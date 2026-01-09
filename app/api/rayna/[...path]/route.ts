import { NextRequest, NextResponse } from "next/server";

import { buildRaynaUrl, getRaynaConfig, injectRaynaToken } from "@/lib/rayna";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const proxyRaynaRequest = async (
  request: NextRequest,
  context: RouteContext,
) => {
  const { baseUrl, token, headers, authScheme } = getRaynaConfig();
  const params = await context.params;
  const path = params.path.join("/");

  if (!path) {
    return NextResponse.json(
      { error: "Missing Rayna API path." },
      { status: 400 },
    );
  }

  const targetUrl = buildRaynaUrl(baseUrl, path, request.nextUrl.search);
  const contentType = request.headers.get("content-type") ?? "application/json";
  const hasBody = !["GET", "HEAD"].includes(request.method);

  let body: string | undefined;
  if (hasBody) {
    const text = await request.text();
    body = injectRaynaToken(text, token, contentType);
  }

  const forwardHeaders = new Headers();
  forwardHeaders.set("accept", "application/json");
  if (hasBody) {
    forwardHeaders.set("content-type", contentType);
  }

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      forwardHeaders.set(key, value);
    });
  }

  if (token && !forwardHeaders.has("authorization")) {
    const authValue = authScheme ? `${authScheme} ${token}` : token;
    forwardHeaders.set("authorization", authValue);
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body,
    cache: "no-store",
  });

  const responseBody = await response.arrayBuffer();
  const responseHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  return new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
};

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest, context: RouteContext) => {
  try {
    return await proxyRaynaRequest(request, context);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Rayna API proxy failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};

export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
