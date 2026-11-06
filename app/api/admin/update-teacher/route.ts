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

    // Resolve teacher record
    let teacherQuery = adminDb.from("teachers").select("id, teacher_id, full_name, auth_user_id, internal_notes, verification_status");
    if (isUuid) {
      teacherQuery = teacherQuery.eq("id", id);
    } else {
      teacherQuery = teacherQuery.or(`id.eq.${id},teacher_id.eq.${id.toUpperCase()}`);
    }
    const { data: teacherRecord, error: findError } = await teacherQuery.maybeSingle();

    if (findError || !teacherRecord) {
      return NextResponse.json({ error: "Teacher record not found" }, { status: 404 });
    }

    const resolvedId = teacherRecord.id;

    // -------------------------------------------------------------
    // ACTION 1: DELETE TEACHER (SAFE CASCADE CLEANUP)
    // -------------------------------------------------------------
    if (type === "delete") {
      try {
        // 1. Identify all assignments for this teacher
        const { data: teacherAssignments } = await adminDb
          .from("assignments")
          .select("id")
          .eq("teacher_id", resolvedId);

        const assignmentIds = (teacherAssignments || []).map((a: any) => a.id);

        // 2. Cascade delete dependent child records pointing to teacher / teacher's assignments
        // A) Sessions
        await adminDb.from("sessions").delete().eq("teacher_id", resolvedId);
        if (assignmentIds.length > 0) {
          await adminDb.from("sessions").delete().in("assignment_id", assignmentIds);
        }

        // B) Progress Reports
        await adminDb.from("progress_reports").delete().eq("teacher_id", resolvedId);
        if (assignmentIds.length > 0) {
          await adminDb.from("progress_reports").delete().in("assignment_id", assignmentIds);
        }

        // C) Reviews
        await adminDb.from("reviews").delete().eq("teacher_id", resolvedId);
        if (assignmentIds.length > 0) {
          await adminDb.from("reviews").delete().in("assignment_id", assignmentIds);
        }

        // D) Commissions
        await adminDb.from("commissions").delete().eq("teacher_id", resolvedId);
        if (assignmentIds.length > 0) {
          await adminDb.from("commissions").delete().in("assignment_id", assignmentIds);
        }

        // E) Payments: Disassociate teacher and teacher's assignments to preserve parent payment receipts
        try {
          if (assignmentIds.length > 0) {
            await adminDb.from("payments").update({ assignment_id: null }).in("assignment_id", assignmentIds);
          }
          await adminDb.from("payments").update({ teacher_id: null }).eq("teacher_id", resolvedId);
        } catch (payErr: any) {
          // Safe fallback if column is absent in older migrations
          console.warn("[delete-teacher payment unlinking warning]:", payErr?.message);
        }

        // F) Assignments
        await adminDb.from("assignments").delete().eq("teacher_id", resolvedId);
      } catch (cascadeErr: any) {
        console.warn("[delete-teacher cascade cleanup warning]:", cascadeErr?.message);
      }

      // 3. Delete teacher record from DB
      const { error: delError } = await adminDb
        .from("teachers")
        .delete()
        .eq("id", resolvedId);

      if (delError) {
        console.error("[delete-teacher error]:", delError);
        return NextResponse.json({ error: delError.message }, { status: 400 });
      }

      // 4. If teacher had an auth account, safely remove
      if (teacherRecord.auth_user_id) {
        try {
          await adminDb.auth.admin.deleteUser(teacherRecord.auth_user_id);
        } catch (authErr) {
          console.warn("[delete-teacher auth delete warning]:", authErr);
        }
      }

      revalidatePath("/admin/teachers");
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/assignments");
      revalidatePath("/admin/students");

      return NextResponse.json({
        success: true,
        deleted: true,
        teacherId: resolvedId,
        message: `Teacher ${teacherRecord.full_name || resolvedId} deleted successfully.`
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: STATUS & LIFECYCLE (APPROVE, INACTIVE, ON_LEAVE, SUSPEND, REJECT)
    // -------------------------------------------------------------
    if (type === "status" || type === "end") {
      const targetStatus = type === "end" ? "inactive" : body.status;
      const { internal_notes, rejection_reason, badge_level, notes } = body;
      const noteInput = notes || internal_notes || "";
      const timestamp = new Date().toISOString();

      let updatedNotes = teacherRecord.internal_notes || "";
      if (noteInput.trim()) {
        const entry = `[${new Date().toLocaleDateString("en-IN")}] Status -> ${targetStatus.toUpperCase()}: ${noteInput.trim()}`;
        updatedNotes = updatedNotes ? `${entry}\n${updatedNotes}` : entry;
      }

      const updateData: Record<string, any> = {
        verification_status: targetStatus,
        internal_notes: updatedNotes || null,
        updated_at: timestamp,
      };

      if (targetStatus === "approved") {
        updateData.badge_level = badge_level || "verified";
        updateData.is_active = true;
        updateData.profile_visibility = "public";
        updateData.approved_date = timestamp;
        updateData.rejection_reason = null;
      } else if (targetStatus === "inactive") {
        // Association Ended (Preserve history, deactivate & hide from public directory)
        updateData.is_active = false;
        updateData.profile_visibility = "hidden";
      } else if (targetStatus === "on_leave") {
        // Temporary leave / sabbatical
        updateData.is_active = false;
        updateData.profile_visibility = "hidden";
      } else if (targetStatus === "rejected") {
        updateData.is_active = false;
        updateData.profile_visibility = "hidden";
        updateData.rejection_reason = rejection_reason || null;
        updateData.badge_level = "pending";
      } else if (targetStatus === "suspended" || targetStatus === "pending") {
        updateData.is_active = false;
        updateData.profile_visibility = "hidden";
      }

      const { data: updatedTeacher, error: updateError } = await adminDb
        .from("teachers")
        .update(updateData)
        .eq("id", resolvedId)
        .select()
        .single();

      if (updateError) {
        console.error("[update-teacher status error]:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      // Automatically handle active assignments when ending association or putting on leave
      if (targetStatus === "inactive" || targetStatus === "on_leave" || targetStatus === "suspended") {
        const assignmentStatus = targetStatus === "inactive" ? "completed" : "paused";
        await adminDb
          .from("assignments")
          .update({
            status: assignmentStatus,
            updated_at: timestamp,
          })
          .eq("teacher_id", resolvedId)
          .eq("status", "active");
      } else if (targetStatus === "approved" && body.reactivateAssignments) {
        await adminDb
          .from("assignments")
          .update({
            status: "active",
            updated_at: timestamp,
          })
          .eq("teacher_id", resolvedId)
          .eq("status", "paused");
      }

      revalidatePath(`/admin/teachers/${resolvedId}`);
      revalidatePath("/admin/teachers");
      revalidatePath(`/verify/${resolvedId}`);
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/assignments");

      return NextResponse.json({
        success: true,
        teacher: updatedTeacher,
        status: targetStatus,
        message: `Teacher status set to ${targetStatus}.`
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: PROFILE UPDATE
    // -------------------------------------------------------------
    if (type === "profile") {
      const {
        full_name, phone, whatsapp, email, gender, locality, address,
        qualification, institution, experience_years, profile_visibility,
        badge_level, subjects, classes_taught, areas_serviceable, aadhar_number
      } = body;

      const { data: updatedTeacher, error: profileError } = await adminDb
        .from("teachers")
        .update({
          full_name: full_name?.trim(),
          phone: phone?.trim(),
          whatsapp: (whatsapp || phone)?.trim() || null,
          email: email ? email.trim().toLowerCase() : null,
          gender: gender || "other",
          locality: locality?.trim() || null,
          address: address?.trim() || null,
          aadhar_number: aadhar_number?.trim() || null,
          qualification: qualification?.trim() || null,
          institution: institution?.trim() || null,
          experience_years: parseInt(experience_years) || 0,
          profile_visibility: profile_visibility || "public",
          badge_level: badge_level || "verified",
          subjects: Array.isArray(subjects) ? subjects : (subjects || "").split(",").map((s: string) => s.trim()).filter(Boolean),
          classes_taught: Array.isArray(classes_taught) ? classes_taught : (classes_taught || "").split(",").map((s: string) => s.trim()).filter(Boolean),
          areas_serviceable: Array.isArray(areas_serviceable) ? areas_serviceable : (areas_serviceable || "").split(",").map((s: string) => s.trim()).filter(Boolean),
          updated_at: new Date().toISOString(),
        })
        .eq("id", resolvedId)
        .select()
        .single();

      if (profileError) {
        console.error("[update-teacher profile error]:", profileError);
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      revalidatePath(`/admin/teachers/${resolvedId}`);
      revalidatePath("/admin/teachers");

      return NextResponse.json({ success: true, teacher: updatedTeacher });
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (err: any) {
    console.error("[update-teacher Exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update teacher" }, { status: 500 });
  }
}
