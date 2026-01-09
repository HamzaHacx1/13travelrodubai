type RaynaConfig = {
  baseUrl: string;
  token?: string;
  headers?: Record<string, string>;
  authScheme: string;
};

const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

export const getRaynaConfig = (): RaynaConfig => {
  const baseUrl = process.env.RAYNA_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("RAYNA_API_BASE_URL is not set.");
  }

  const token = process.env.RAYNA_API_TOKEN;
  const authScheme = process.env.RAYNA_API_AUTH_SCHEME ?? "Bearer";
  const headersEnv = process.env.RAYNA_API_HEADERS;
  let headers: Record<string, string> | undefined;

  if (headersEnv) {
    try {
      headers = JSON.parse(headersEnv) as Record<string, string>;
    } catch {
      throw new Error("RAYNA_API_HEADERS must be valid JSON.");
    }
  }

  return {
    baseUrl: normalizeBaseUrl(baseUrl),
    token,
    headers,
    authScheme,
  };
};

export const buildRaynaUrl = (baseUrl: string, path: string, search: string) => {
  const cleanPath = path.replace(/^\/+/, "");
  const target = new URL(cleanPath, baseUrl);
  if (search) {
    target.search = search;
  }
  return target;
};

export const injectRaynaToken = (
  bodyText: string,
  token?: string,
  contentType?: string | null,
) => {
  if (!token) {
    return bodyText;
  }

  if (!contentType?.includes("application/json")) {
    return bodyText;
  }

  if (!bodyText) {
    return JSON.stringify({ Token: token });
  }

  try {
    const parsed = JSON.parse(bodyText) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const payload = parsed as Record<string, unknown>;
      if (!("Token" in payload)) {
        payload.Token = token;
      }
      return JSON.stringify(payload);
    }
  } catch {
    return bodyText;
  }

  return bodyText;
};
