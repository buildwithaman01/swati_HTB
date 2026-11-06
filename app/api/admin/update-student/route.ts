import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const adminDb = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // Resolve student record to get UUID and parent_auth_user_id
    let studentQuery = adminDb.from("students").select("id, student_id, full_name, parent_auth_user_id, internal_notes");
    if (isUuid) {
      studentQuery = studentQuery.eq("id", id);
    } else {
      studentQuery = studentQuery.or(`id.eq.${id},student_id.eq.${id.toUpperCase()}`);
    }
    const { data: studentRecord, error: findError } = await studentQuery.maybeSingle();

    if (findError || !studentRecord) {
      return NextResponse.json({ error: "Student record not found" }, { status: 404 });
    }

    const resolvedId = studentRecord.id;

    // -------------------------------------------------------------
    // ACTION 1: DELETE STUDENT
    // -------------------------------------------------------------
    if (type === "delete") {
      // 1. Delete student row (cascades or sets null per DB constraints)
      const { error: delError } = await adminDb
        .from("students")
        .delete()
        .eq("id", resolvedId);

      if (delError) {
        console.error("[delete-student error]:", delError);
        return NextResponse.json({ error: delError.message }, { status: 400 });
      }

      // 2. If student had an authenticated parent user, clean it up safely
      if (studentRecord.parent_auth_user_id) {
        try {
          await adminDb.auth.admin.deleteUser(studentRecord.parent_auth_user_id);
        } catch (authErr) {
          console.warn("[delete-student auth delete warning]:", authErr);
        }
      }

      revalidatePath("/admin/students");
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/assignments");

      return NextResponse.json({
        success: true,
        deleted: true,
        studentId: resolvedId,
        message: `Student ${studentRecord.full_name || resolvedId} deleted successfully.`
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: STATUS & LIFECYCLE (ENROLL, PAUSE, COMPLETE, DROP)
    // -------------------------------------------------------------
    if (type === "status" || type === "end") {
      const targetStatus = type === "end" ? "completed" : body.status;
      const notes = body.notes || body.reason || "";
      const timestamp = new Date().toISOString();

      // Format updated notes with historical timestamp if notes were provided
      let updatedNotes = studentRecord.internal_notes || "";
      if (notes.trim()) {
        const entry = `[${new Date().toLocaleDateString("en-IN")}] Status -> ${targetStatus.toUpperCase()}: ${notes.trim()}`;
        updatedNotes = updatedNotes ? `${entry}\n${updatedNotes}` : entry;
      }

      // 1. Update student enrollment status
      const { data: updatedStudent, error: updateError } = await adminDb
        .from("students")
        .update({
          enrollment_status: targetStatus,
          internal_notes: updatedNotes || null,
          updated_at: timestamp,
        })
        .eq("id", resolvedId)
        .select()
        .single();

      if (updateError) {
        console.error("[update-student status error]:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }

      // 2. Automatically sync active assignments
      if (targetStatus === "completed" || targetStatus === "paused") {
        const assignmentStatus = targetStatus === "completed" ? "completed" : "paused";
        await adminDb
          .from("assignments")
          .update({
            status: assignmentStatus,
            updated_at: timestamp,
          })
          .eq("student_id", resolvedId)
          .eq("status", "active");
      } else if (targetStatus === "enrolled" && body.reactivateAssignments) {
        // If reactivating to enrolled and user asked to reactivate paused assignments
        await adminDb
          .from("assignments")
          .update({
            status: "active",
            updated_at: timestamp,
          })
          .eq("student_id", resolvedId)
          .eq("status", "paused");
      }

      revalidatePath(`/admin/students/${resolvedId}`);
      revalidatePath("/admin/students");
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/assignments");

      return NextResponse.json({
        success: true,
        student: updatedStudent,
        status: targetStatus,
        message: `Student status updated to ${targetStatus}.`
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: PROFILE EDIT
    // -------------------------------------------------------------
    if (type === "profile") {
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
      } = body;

      const subjectsArr = Array.isArray(subjects_required)
        ? subjects_required
        : (subjects_required || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);

      const updatePayload: Record<string, any> = {
        full_name: full_name?.trim(),
        parent_name: parent_name?.trim(),
        parent_phone: parent_phone?.trim(),
        parent_whatsapp: (whatsapp || parent_phone)?.trim() || null,
        whatsapp: (whatsapp || parent_phone)?.trim() || null,
        email: email?.trim() || null,
        parent_email: email?.trim() || null,
        locality: locality?.trim() || null,
        address: address?.trim() || null,
        class_studying: class_studying?.trim() || null,
        subjects_required: subjectsArr,
        subjects_needed: subjectsArr,
        tuition_type_preference: tuition_type_preference || "home",
        budget_range: budget_range?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (board) {
        updatePayload.board = board;
      }

      const { data: updatedStudent, error: profileError } = await adminDb
        .from("students")
        .update(updatePayload)
        .eq("id", resolvedId)
        .select()
        .single();

      if (profileError) {
        console.error("[update-student profile error]:", profileError);
        return NextResponse.json({ error: profileError.message }, { status: 400 });
      }

      revalidatePath(`/admin/students/${resolvedId}`);
      revalidatePath("/admin/students");

      return NextResponse.json({ success: true, student: updatedStudent });
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (err: any) {
    console.error("[update-student exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to update student" }, { status: 500 });
  }
}
