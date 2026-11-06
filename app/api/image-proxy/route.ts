import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(urlParam);

    // Security: Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return new NextResponse("Invalid protocol", { status: 400 });
    }

    // Fetch the upstream image server-side (bypasses browser CORS)
    const upstreamRes = await fetch(urlParam, {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "SwatiHTB-BadgeRasterizer/1.0",
      },
      cache: "force-cache",
    });

    if (!upstreamRes.ok) {
      return new NextResponse(
        `Failed to fetch upstream image: ${upstreamRes.status} ${upstreamRes.statusText}`,
        { status: upstreamRes.status }
      );
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/png";
    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error);
    return new NextResponse(error.message || "Internal server error fetching image", {
      status: 500,
    });
  }
}
