import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTarget = searchParams.get("file") || searchParams.get("url") || searchParams.get("path");

    if (!rawTarget) {
      return NextResponse.json(
        { error: "Missing document file parameter ('file' or 'url')." },
        { status: 400 }
      );
    }

    // Extract raw filename if full Supabase URL was passed
    let filename = rawTarget.trim();

    // If it's a full URL like: https://dtbhafjzoybnmqgxdwoo.supabase.co/storage/v1/object/authenticated/kyc-documents/front-xxx.png
    if (filename.includes("kyc-documents/")) {
      const parts = filename.split("kyc-documents/");
      filename = parts[parts.length - 1].split("?")[0];
    } else if (filename.startsWith("http")) {
      const urlObj = new URL(filename);
      const segments = urlObj.pathname.split("/");
      filename = segments[segments.length - 1];
    }

    // Decode in case of URI encoding
    filename = decodeURIComponent(filename);

    const adminDb = await createAdminClient();

    // 1. Try to generate a signed URL (valid for 2 hours)
    const { data: signed, error: signErr } = await adminDb.storage
      .from("kyc-documents")
      .createSignedUrl(filename, 7200);

    if (signed?.signedUrl) {
      return NextResponse.redirect(signed.signedUrl, 307);
    }

    // 2. Fallback: Download file directly and stream to browser
    const { data: blob, error: dlErr } = await adminDb.storage
      .from("kyc-documents")
      .download(filename);

    if (dlErr || !blob) {
      console.error("[docs/view] File not found or storage error:", signErr, dlErr);
      return NextResponse.json(
        {
          error: "Document not found in KYC storage.",
          file: filename,
          details: signErr?.message || dlErr?.message || "File unavailable",
        },
        { status: 404 }
      );
    }

    const contentType = blob.type || "application/octet-stream";
    const buffer = Buffer.from(await blob.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("[docs/view] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve document" },
      { status: 500 }
    );
  }
}

