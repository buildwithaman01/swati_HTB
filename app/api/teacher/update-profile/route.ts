import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();

    const body = await req.json();
    const adminDb = await createAdminClient();

    // Resolve teacher ID
    let teacherId = body.id || "";
    if (!teacherId && user) {
      const { data: t } = await adminDb
        .from("teachers")
        .select("id")
        .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
        .maybeSingle();
      if (t) teacherId = t.id;
    }

    if (!teacherId) {
      return NextResponse.json({ error: "Unauthorized or teacher profile not found" }, { status: 401 });
    }

    const {
      full_name,
      whatsapp,
      phone,
      gender,
      qualification,
      institution,
      experience_years,
      locality,
      address,
      subjects,
      classes_taught,
      areas_serviceable,
      profile_photo_url,
      bio,
      headline,
      marks_percentage,
      graduation_year,
      linkedin_url,
      demo_video_url,
    } = body;

    const subjectsArr = Array.isArray(subjects)
      ? subjects
      : (subjects || "").split(",").map((s: string) => s.trim()).filter(Boolean);

    const classesArr = Array.isArray(classes_taught)
      ? classes_taught
      : (classes_taught || "").split(",").map((s: string) => s.trim()).filter(Boolean);

    const areasArr = Array.isArray(areas_serviceable)
      ? areas_serviceable
      : (areas_serviceable || "").split(",").map((s: string) => s.trim()).filter(Boolean);

    // Format rich metadata into internal_notes JSON block to ensure 100% persistence
    const metaObj = {
      headline: headline || "",
      bio: bio || "",
      marks_percentage: marks_percentage || "",
      graduation_year: graduation_year || "",
      linkedin_url: linkedin_url || "",
      demo_video_url: demo_video_url || "",
    };

    const { data: existingT } = await adminDb.from("teachers").select("internal_notes").eq("id", teacherId).single();
    const currentNotes = (existingT?.internal_notes || "").replace(/<!--PROFILE_META:.*?-->/gs, "").trim();
    const enrichedNotes = `${currentNotes}\n<!--PROFILE_META:${JSON.stringify(metaObj)}-->`.trim();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name) updatePayload.full_name = full_name;
    if (whatsapp !== undefined) updatePayload.whatsapp = whatsapp;
    if (phone !== undefined) updatePayload.phone = phone;
    if (gender !== undefined) updatePayload.gender = gender;
    if (qualification !== undefined) updatePayload.qualification = qualification;
    if (institution !== undefined) updatePayload.institution = institution;
    if (experience_years !== undefined) updatePayload.experience_years = parseInt(experience_years) || 0;
    if (locality !== undefined) updatePayload.locality = locality;
    if (address !== undefined) updatePayload.address = address;
    if (subjectsArr.length > 0) updatePayload.subjects = subjectsArr;
    if (classesArr.length > 0) updatePayload.classes_taught = classesArr;
    if (areasArr.length > 0) updatePayload.areas_serviceable = areasArr;
    if (profile_photo_url !== undefined) updatePayload.profile_photo_url = profile_photo_url;
    updatePayload.internal_notes = enrichedNotes;

    const { data: updatedTeacher, error: updateErr } = await adminDb
      .from("teachers")
      .update(updatePayload)
      .eq("id", teacherId)
      .select()
      .single();

    if (updateErr) {
      console.error("[update-profile error]:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    revalidatePath("/teacher/dashboard/profile");
    revalidatePath("/teacher/dashboard/id-card");
    revalidatePath("/teacher/dashboard");
    revalidatePath(`/admin/teachers/${teacherId}`);

    return NextResponse.json({
      success: true,
      teacher: updatedTeacher,
      message: "Profile updated successfully!",
    });
  } catch (err: any) {
    console.error("[update-profile exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
