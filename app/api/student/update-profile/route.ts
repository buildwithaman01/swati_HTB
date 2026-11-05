import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();

    const body = await req.json();
    const adminDb = await createAdminClient();

    // Resolve student ID
    let studentId = body.id || "";
    if (!studentId && user) {
      const { data: s } = await adminDb
        .from("students")
        .select("id")
        .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
        .maybeSingle();
      if (s) studentId = s.id;
    }

    if (!studentId) {
      return NextResponse.json({ error: "Unauthorized or student profile not found" }, { status: 401 });
    }

    const {
      full_name,
      parent_name,
      parent_phone,
      whatsapp,
      email,
      locality,
      address,
      class_studying,
      board,
      subjects_required,
      tuition_type_preference,
      budget_range,
      school_name,
      previous_marks,
      target_exam,
      weak_subjects,
      photo_url,
    } = body;

    const subjectsArr = Array.isArray(subjects_required)
      ? subjects_required
      : (subjects_required || "").split(",").map((s: string) => s.trim()).filter(Boolean);

    // Format rich student academic metadata into internal_notes JSON block to ensure 100% persistence
    const metaObj = {
      school_name: school_name || "",
      previous_marks: previous_marks || "",
      target_exam: target_exam || "",
      weak_subjects: weak_subjects || "",
      photo_url: photo_url || "",
    };

    const { data: existingS } = await adminDb.from("students").select("internal_notes").eq("id", studentId).single();
    const currentNotes = (existingS?.internal_notes || "").replace(/<!--STUDENT_META:.*?-->/gs, "").trim();
    const enrichedNotes = `${currentNotes}\n<!--STUDENT_META:${JSON.stringify(metaObj)}-->`.trim();

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name) updatePayload.full_name = full_name;
    if (parent_name) updatePayload.parent_name = parent_name;
    if (parent_phone) updatePayload.parent_phone = parent_phone;
    if (whatsapp !== undefined) updatePayload.whatsapp = whatsapp;
    if (email !== undefined) {
      updatePayload.email = email;
      updatePayload.parent_email = email;
    }
    if (locality !== undefined) updatePayload.locality = locality;
    if (address !== undefined) updatePayload.address = address;
    if (class_studying !== undefined) updatePayload.class_studying = class_studying;
    if (board !== undefined) updatePayload.board = board;
    if (subjectsArr.length > 0) {
      updatePayload.subjects_required = subjectsArr;
      updatePayload.subjects_needed = subjectsArr;
    }
    if (tuition_type_preference !== undefined) updatePayload.tuition_type_preference = tuition_type_preference;
    if (budget_range !== undefined) updatePayload.budget_range = budget_range;
    updatePayload.internal_notes = enrichedNotes;

    const { data: updatedStudent, error: updateErr } = await adminDb
      .from("students")
      .update(updatePayload)
      .eq("id", studentId)
      .select()
      .single();

    if (updateErr) {
      console.error("[update-student error]:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    revalidatePath("/portal/dashboard");
    revalidatePath("/portal/profile");
    revalidatePath(`/admin/students/${studentId}`);

    return NextResponse.json({
      success: true,
      student: updatedStudent,
      message: "Student profile updated successfully!",
    });
  } catch (err: any) {
    console.error("[update-student exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
