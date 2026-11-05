import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let photoUrl = "";
    let targetType = "teacher";
    let targetId = "";

    const adminDb = await createAdminClient();

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      targetType = (formData.get("type") as string) || "teacher";
      targetId = (formData.get("id") as string) || "";

      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
      }

      // 1. Try uploading to Supabase storage
      try {
        const fileExt = file.name.split(".").pop() || "png";
        const fileName = `${targetType}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Try 'kyc-documents' bucket or 'avatars'
        const { data: uploadData, error: uploadErr } = await adminDb.storage
          .from("kyc-documents")
          .upload(fileName, file, { contentType: file.type, upsert: true });

        if (!uploadErr && uploadData?.path) {
          // Check if public URL or signed URL
          const { data: publicUrlData } = adminDb.storage
            .from("kyc-documents")
            .getPublicUrl(uploadData.path);

          photoUrl = publicUrlData?.publicUrl || "";

          // If private, generate a 1-year signed url
          if (!photoUrl || photoUrl.includes("/object/public/")) {
            const { data: signedData } = await adminDb.storage
              .from("kyc-documents")
              .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365);
            if (signedData?.signedUrl) {
              photoUrl = signedData.signedUrl;
            }
          }
        }
      } catch (storageErr) {
        console.warn("[upload/photo storage warning]:", storageErr);
      }

      // Fallback: If storage didn't return URL, convert file to base64 data URL
      if (!photoUrl) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        photoUrl = `data:${file.type};base64,${base64}`;
      }
    } else {
      // JSON body with direct dataUrl or photoUrl
      const body = await req.json();
      photoUrl = body.photoUrl || body.dataUrl || "";
      targetType = body.type || "teacher";
      targetId = body.id || "";
    }

    if (!photoUrl) {
      return NextResponse.json({ error: "Failed to process photo" }, { status: 400 });
    }

    // Identify user if targetId not provided
    if (!targetId) {
      const userClient = await createClient();
      const { data: { user } } = await userClient.auth.getUser();

      if (user) {
        if (targetType === "teacher") {
          const { data: t } = await adminDb
            .from("teachers")
            .select("id")
            .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
            .maybeSingle();
          if (t) targetId = t.id;
        } else if (targetType === "student") {
          const { data: s } = await adminDb
            .from("students")
            .select("id")
            .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
            .maybeSingle();
          if (s) targetId = s.id;
        }
      }
    }

    // Save to database
    if (targetType === "teacher" && targetId) {
      await adminDb
        .from("teachers")
        .update({
          profile_photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetId);

      revalidatePath("/teacher/dashboard");
      revalidatePath("/teacher/dashboard/profile");
      revalidatePath("/teacher/dashboard/id-card");
      revalidatePath(`/admin/teachers/${targetId}`);
      revalidatePath("/admin/teachers");
    } else if (targetType === "student" && targetId) {
      // For student, store photoUrl inside internal_notes or student record
      const { data: st } = await adminDb.from("students").select("internal_notes").eq("id", targetId).single();
      const notes = st?.internal_notes || "";
      const cleanedNotes = notes.replace(/\[STUDENT_PHOTO:[^\]]+\]/g, "").trim();
      const updatedNotes = `${cleanedNotes}\n[STUDENT_PHOTO:${photoUrl}]`.trim();

      await adminDb
        .from("students")
        .update({
          internal_notes: updatedNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetId);

      revalidatePath("/portal/dashboard");
      revalidatePath("/portal/profile");
      revalidatePath(`/admin/students/${targetId}`);
    }

    return NextResponse.json({
      success: true,
      photoUrl,
      message: "Photo uploaded and profile updated successfully!",
    });
  } catch (err: any) {
    console.error("[upload-photo exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to upload photo" }, { status: 500 });
  }
}
