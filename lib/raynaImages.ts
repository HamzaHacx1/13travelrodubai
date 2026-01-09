import "server-only";

import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const DEFAULT_RAYNA_IMAGE_BASE_URL =
  "https://d1i3enf1i5tb1f.cloudfront.net/";
const LEGACY_RAYNA_IMAGE_HOSTS = new Set([
  "d2g4iwshf24scx.cloudfront.net",
]);
const DEFAULT_IMAGE_HEADERS: Record<string, string> = {
  accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

const parseCloudinaryUrl = (cloudinaryUrl: string | undefined) => {
  if (!cloudinaryUrl) {
    return null;
  }

  try {
    const url = new URL(cloudinaryUrl);
    if (!url.username || !url.password || !url.hostname) {
      return null;
    }
    return {
      cloudName: url.hostname,
      apiKey: url.username,
      apiSecret: url.password,
    };
  } catch {
    return null;
  }
};

const readEnvValue = (value: string | undefined) => value?.trim() || undefined;

const getCloudinaryConfig = (): CloudinaryConfig => {
  const configSource = readEnvValue(
    process.env.CLOUDINARY_CONFIG_SOURCE,
  )?.toLowerCase();
  const urlConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const useUrl = configSource !== "fields" && urlConfig;

  const cloudName = useUrl
    ? urlConfig?.cloudName
    : readEnvValue(process.env.CLOUDINARY_CLOUD_NAME) ?? urlConfig?.cloudName;
  const apiKey = useUrl
    ? urlConfig?.apiKey
    : readEnvValue(process.env.CLOUDINARY_API_KEY) ?? urlConfig?.apiKey;
  const apiSecret = useUrl
    ? urlConfig?.apiSecret
    : readEnvValue(process.env.CLOUDINARY_API_SECRET) ?? urlConfig?.apiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not set.");
  }

  return { cloudName, apiKey, apiSecret };
};

let cloudinaryConfigured = false;
let lastCloudinaryConfigKey: string | null = null;

const ensureCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const configKey = `${cloudName}:${apiKey}:${apiSecret}`;
  if (cloudinaryConfigured && lastCloudinaryConfigKey === configKey) {
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  cloudinaryConfigured = true;
  lastCloudinaryConfigKey = configKey;
};

const uploadStream = async (
  stream: NodeJS.ReadableStream,
  options: { folder: string; public_id: string },
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed."));
        return;
      }
      resolve(result);
    });

    pipeline(stream, upload).catch(reject);
  });

const normalizeBaseUrl = (baseUrl: string) =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

const getRaynaImageBaseUrl = () =>
  normalizeBaseUrl(
    process.env.RAYNA_IMAGE_BASE_URL ?? DEFAULT_RAYNA_IMAGE_BASE_URL,
  );

const shouldLogRaynaImages = () => {
  const value = readEnvValue(process.env.RAYNA_IMAGE_DEBUG)?.toLowerCase();
  return value === "1" || value === "true" || value === "yes";
};

const getRaynaImageHeaders = () => {
  const headers: Record<string, string> = { ...DEFAULT_IMAGE_HEADERS };
  const customHeaders = process.env.RAYNA_IMAGE_HEADERS;

  if (customHeaders) {
    try {
      const parsed = JSON.parse(customHeaders) as Record<string, string>;
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers[key.toLowerCase()] = value;
        }
      });
    } catch (error) {
      console.error("RAYNA_IMAGE_HEADERS must be valid JSON.", {
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  const referer = process.env.RAYNA_IMAGE_REFERER ?? process.env.RAYNA_API_BASE_URL;
  if (referer) {
    headers.referer = referer;
    try {
      headers.origin = new URL(referer).origin;
    } catch {
      delete headers.origin;
    }
  }

  return headers;
};

const normalizeRaynaPathname = (pathname: string) =>
  pathname.replace(/\/{2,}/g, "/");

const hasRaynaImageSuffix = (pathname: string) =>
  /_[LMS]\.(jpg|jpeg)$/i.test(pathname);

const normalizeRaynaImageUrl = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);
    url.pathname = normalizeRaynaPathname(url.pathname);
    if (LEGACY_RAYNA_IMAGE_HOSTS.has(url.hostname)) {
      const base = new URL(getRaynaImageBaseUrl());
      url.protocol = base.protocol;
      url.host = base.host;
    }
    return url.toString();
  } catch {
    return imageUrl;
  }
};

const buildRaynaImageVariantUrl = (imageUrl: string, size: "L" | "S") => {
  try {
    const url = new URL(imageUrl);
    let pathname = normalizeRaynaPathname(url.pathname).replace(/\/$/, "");
    if (hasRaynaImageSuffix(pathname)) {
      url.pathname = pathname.replace(/_[LMS]\.(jpg|jpeg)$/i, `_${size}.jpg`);
      return url.toString();
    }
    if (/\.[a-z0-9]+$/i.test(pathname)) {
      url.pathname = pathname.replace(/\.[a-z0-9]+$/i, `_${size}.jpg`);
      return url.toString();
    }
    url.pathname = `${pathname}_${size}.jpg`;
    return url.toString();
  } catch {
    return imageUrl;
  }
};

const buildRaynaImageVariants = (imageUrl: string) => {
  const normalized = normalizeRaynaImageUrl(imageUrl);
  const small = buildRaynaImageVariantUrl(normalized, "S");
  const large = buildRaynaImageVariantUrl(normalized, "L");
  return [small, large].filter(
    (value, index, array) => array.indexOf(value) === index,
  );
};

export const buildRaynaImageBaseUrl = (imagePath: string | undefined) => {
  if (!imagePath) {
    return "";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return normalizeRaynaImageUrl(imagePath);
  }
  const normalized = imagePath
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+/, "");
  return new URL(normalized, getRaynaImageBaseUrl()).toString();
};

const isAbsoluteUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

export const buildRaynaImageProxyUrl = (paths: string[]) => {
  const params = new URLSearchParams();

  paths.forEach((path) => {
    const trimmed = path.trim();
    if (!trimmed) {
      return;
    }

    if (isAbsoluteUrl(trimmed)) {
      params.append("url", trimmed);
    } else {
      params.append("path", trimmed);
    }
  });

  const query = params.toString();
  return query ? `/api/rayna/image?${query}` : "";
};

export const buildRaynaImageUrl = (imagePath: string | undefined) => {
  const baseUrl = buildRaynaImageBaseUrl(imagePath);
  return baseUrl ? buildRaynaImageVariantUrl(baseUrl, "L") : "";
};

export const fetchRaynaImage = async (imageUrl: string) => {
  const headers = getRaynaImageHeaders();
  const candidates = buildRaynaImageVariants(imageUrl);
  let lastResponse: Response | undefined;

  for (const candidate of candidates) {
    let response = await fetch(candidate, { headers, cache: "no-store" });

    if (response.status === 403) {
      const fallbackHeaders = new Headers(headers);
      fallbackHeaders.delete("referer");
      fallbackHeaders.delete("origin");
      response = await fetch(candidate, {
        headers: fallbackHeaders,
        cache: "no-store",
      });
    }

    if (response.ok && response.body) {
      return response;
    }

    lastResponse = response;
    try {
      await response.body?.cancel();
    } catch {
      // Ignore cancellation errors for failed attempts.
    }
  }

  return (
    lastResponse ??
    (await fetch(imageUrl, {
      headers,
      cache: "no-store",
    }))
  );
};

export const fetchRaynaImageStream = async (imageUrl: string) => {
  const headers = getRaynaImageHeaders();
  let response = await fetch(imageUrl, { headers, cache: "no-store" });

  if (response.status === 403) {
    const fallbackHeaders = new Headers(headers);
    fallbackHeaders.delete("referer");
    fallbackHeaders.delete("origin");
    response = await fetch(imageUrl, {
      headers: fallbackHeaders,
      cache: "no-store",
    });
  }

  return response;
};

const fetchRaynaImageStatus = async (
  imageUrl: string,
  method: "HEAD" | "GET",
  headers: HeadersInit,
) => {
  const response = await fetch(imageUrl, {
    method,
    headers,
    cache: "no-store",
  });

  if (method !== "HEAD") {
    try {
      await response.body?.cancel();
    } catch {
      // Ignore cancellation errors for probe requests.
    }
  }

  return response.status;
};

const isRaynaImageAvailable = async (imageUrl: string) => {
  const headers = getRaynaImageHeaders();

  const checkWithHeaders = async (requestHeaders: HeadersInit) => {
    const headStatus = await fetchRaynaImageStatus(
      imageUrl,
      "HEAD",
      requestHeaders,
    );
    if (headStatus === 200) {
      return true;
    }

    if (headStatus === 403 || headStatus === 405 || headStatus === 501) {
      const rangeHeaders = new Headers(requestHeaders);
      rangeHeaders.set("range", "bytes=0-0");
      const getStatus = await fetchRaynaImageStatus(
        imageUrl,
        "GET",
        rangeHeaders,
      );
      return getStatus === 200 || getStatus === 206;
    }

    return false;
  };

  if (await checkWithHeaders(headers)) {
    return true;
  }

  const fallbackHeaders = new Headers(headers);
  fallbackHeaders.delete("referer");
  fallbackHeaders.delete("origin");
  return checkWithHeaders(fallbackHeaders);
};

export const resolveRaynaImageUrl = async (imagePath: string | undefined) => {
  const baseUrl = buildRaynaImageBaseUrl(imagePath);
  if (!baseUrl) {
    return "";
  }

  const smallUrl = buildRaynaImageVariantUrl(baseUrl, "S");
  const debug = shouldLogRaynaImages();
  if (debug) {
    console.info("Rayna image resolve: probe small", {
      imagePath,
      candidate: smallUrl,
    });
  }
  if (await isRaynaImageAvailable(smallUrl)) {
    if (debug) {
      console.info("Rayna image resolve: selected", {
        imagePath,
        selected: smallUrl,
      });
    }
    return smallUrl;
  }

  const largeUrl = buildRaynaImageVariantUrl(baseUrl, "L");
  if (debug) {
    console.info("Rayna image resolve: probe large", {
      imagePath,
      candidate: largeUrl,
    });
  }
  if (await isRaynaImageAvailable(largeUrl)) {
    if (debug) {
      console.info("Rayna image resolve: selected", {
        imagePath,
        selected: largeUrl,
      });
    }
    return largeUrl;
  }

  if (debug) {
    console.info("Rayna image resolve: none", { imagePath });
  }
  return "";
};

export const uploadRaynaImagesToCloudinary = async (
  productId: string | number,
  imageUrls: string[],
): Promise<string[]> => {
  ensureCloudinaryConfigured();

  const safeProductId = String(productId);
  const uploadedUrls: string[] = [];

  for (const [index, imageUrl] of imageUrls.entries()) {
    if (!imageUrl) {
      continue;
    }

    try {
      const response = await fetchRaynaImage(imageUrl);

      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to download image (${response.status} ${response.statusText}).`,
        );
      }

      const stream = Readable.fromWeb(
        response.body as unknown as ReadableStream<Uint8Array>,
      );
      const result = await uploadStream(stream, {
        folder: `rayna/${safeProductId}`,
        public_id: `${safeProductId}-${index}`,
      });

      uploadedUrls.push(result.secure_url);
    } catch (error) {
      console.error("Rayna image upload failed.", {
        productId: safeProductId,
        index,
        imageUrl,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  return uploadedUrls;
};
