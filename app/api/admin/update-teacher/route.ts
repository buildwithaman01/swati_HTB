import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    const adminDb = await createAdminClient();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (type === "status") {
      const { status, internal_notes, rejection_reason, badge_level } = body;
      const updateData: any = {
        verification_status: status,
        internal_notes: internal_notes || null,
      };

      if (status === "approved") {
        updateData.badge_level = badge_level || "verified";
        updateData.is_active = true;
        updateData.approved_date = new Date().toISOString();
        updateData.rejection_reason = null;
      } else if (status === "rejected") {
        updateData.is_active = false;
        updateData.rejection_reason = rejection_reason || null;
        updateData.badge_level = "pending";
      } else if (status === "suspended") {
        updateData.is_active = false;
      } else if (status === "pending") {
        updateData.is_active = false;
      }

      let updateQuery = adminDb.from("teachers").update(updateData);
      if (isUuid) {
        updateQuery = updateQuery.eq("id", id);
      } else {
        updateQuery = updateQuery.or(`id.eq.${id},teacher_id.eq.${id.toUpperCase()}`);
      }

      const { data, error } = await updateQuery
        .select("id, verification_status, badge_level, is_active")
        .limit(1);

      if (error) {
        console.error("[update-teacher error]:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      revalidatePath(`/admin/teachers/${id}`);
      revalidatePath("/admin/teachers");
      revalidatePath(`/verify/${id}`);

      return NextResponse.json({ success: true, teacher: data?.[0] || null });
    } else if (type === "profile") {
      const {
        full_name, phone, whatsapp, email, gender, locality, address,
        qualification, institution, experience_years, profile_visibility,
        badge_level, subjects, classes_taught, areas_serviceable
      } = body;

      let updateQuery = adminDb.from("teachers").update({
        full_name,
        phone,
        whatsapp,
        email: email ? email.trim().toLowerCase() : null,
        gender,
        locality,
        address,
        qualification,
        institution,
        experience_years: parseInt(experience_years) || 0,
        profile_visibility,
        badge_level,
        subjects: Array.isArray(subjects) ? subjects : (subjects || "").split(",").map((s: string) => s.trim()).filter(Boolean),
        classes_taught: Array.isArray(classes_taught) ? classes_taught : (classes_taught || "").split(",").map((s: string) => s.trim()).filter(Boolean),
        areas_serviceable: Array.isArray(areas_serviceable) ? areas_serviceable : (areas_serviceable || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      });

      if (isUuid) {
        updateQuery = updateQuery.eq("id", id);
      } else {
        updateQuery = updateQuery.or(`id.eq.${id},teacher_id.eq.${id.toUpperCase()}`);
      }

      const { data, error } = await updateQuery
        .select()
        .limit(1);

      if (error) {
        console.error("[update-teacher error]:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      revalidatePath(`/admin/teachers/${id}`);
      revalidatePath("/admin/teachers");

      return NextResponse.json({ success: true, teacher: data?.[0] || null });
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (err: any) {
    console.error("[update-teacher Exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update teacher" }, { status: 500 });
  }
}

