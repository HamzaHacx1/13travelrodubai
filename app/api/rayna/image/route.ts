import { NextRequest, NextResponse } from "next/server";

import {
  buildRaynaImageBaseUrl,
  fetchRaynaImage,
} from "@/lib/raynaImages";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const urlParams = searchParams.getAll("url");
  const pathParams = searchParams.getAll("path");

  const candidates = [
    ...pathParams.map((path) => buildRaynaImageBaseUrl(path)),
    ...urlParams,
  ].filter(Boolean);

  if (candidates.length === 0) {
    return NextResponse.json(
      { error: "Missing image path or url." },
      { status: 400 },
    );
  }

  for (const candidate of candidates) {
    const response = await fetchRaynaImage(candidate);
    if (!response.ok || !response.body) {
      try {
        await response.body?.cancel();
      } catch {
        // Ignore cancellation errors for failed attempts.
      }
      continue;
    }

    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }
    headers.set("cache-control", "public, max-age=3600");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  }

  return NextResponse.json({ error: "Image not found." }, { status: 404 });
};
