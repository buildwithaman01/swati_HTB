import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      teacher_id,
      student_id,
      subject,
      monthly_fee,
      classes_per_week,
      session_duration_mins,
      session_days,
      session_time,
      start_date,
      notes,
      bureau_commission_pct,
    } = body;

    if (!teacher_id || !student_id || !subject) {
      return NextResponse.json(
        { error: "Teacher, Student, and Subject are required to create an assignment." },
        { status: 400 }
      );
    }

    const fee = parseFloat(monthly_fee);
    if (isNaN(fee) || fee < 0) {
      return NextResponse.json(
        { error: "Please enter a valid monthly fee (e.g. 5000)." },
        { status: 400 }
      );
    }

    const commissionPct = parseFloat(bureau_commission_pct) || 25;
    const adminDb = await createAdminClient();

    // Verify teacher exists
    const { data: teacher, error: teacherErr } = await adminDb
      .from("teachers")
      .select("id, full_name, is_active")
      .eq("id", teacher_id)
      .single();

    if (teacherErr || !teacher) {
      return NextResponse.json({ error: "Selected teacher does not exist." }, { status: 400 });
    }

    // Verify student exists
    const { data: student, error: studentErr } = await adminDb
      .from("students")
      .select("id, full_name, enrollment_status")
      .eq("id", student_id)
      .single();

    if (studentErr || !student) {
      return NextResponse.json({ error: "Selected student does not exist." }, { status: 400 });
    }

    // Parse session days
    const daysArray = Array.isArray(session_days)
      ? session_days
      : typeof session_days === "string"
      ? session_days.split(",").map((d) => d.trim()).filter(Boolean)
      : [];

    const payload: Record<string, any> = {
      teacher_id,
      student_id,
      subject: subject.trim(),
      monthly_fee: fee,
      bureau_commission_pct: commissionPct,
      classes_per_week: parseInt(classes_per_week) || 3,
      session_duration_mins: parseInt(session_duration_mins) || 60,
      session_days: daysArray,
      session_time: session_time && session_time.trim() !== "" ? session_time.trim() : null,
      start_date: start_date && start_date.trim() !== "" ? start_date.trim() : null,
      notes: notes && notes.trim() !== "" ? notes.trim() : null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: assignment, error: insertErr } = await adminDb
      .from("assignments")
      .insert(payload)
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id, phone, whatsapp),
        student:students(id, full_name, student_id, parent_name, parent_phone, whatsapp)
      `)
      .single();

    if (insertErr) {
      console.error("[assignments POST error]:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    // Ensure student is updated to enrolled
    await adminDb
      .from("students")
      .update({
        enrollment_status: "enrolled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", student_id);

    // Revalidate relevant pages
    revalidatePath("/admin/assignments");
    revalidatePath(`/admin/students/${student_id}`);
    revalidatePath(`/admin/teachers/${teacher_id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/finance");

    return NextResponse.json({
      success: true,
      assignment,
      message: `Assignment successfully created between ${teacher.full_name} and ${student.full_name}!`,
    });
  } catch (err: any) {
    console.error("[assignments POST exception]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create assignment" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, cancellation_reason } = body;

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    const adminDb = await createAdminClient();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (cancellation_reason !== undefined) {
      updateData.cancellation_reason = cancellation_reason || null;
    }

    const { data, error } = await adminDb
      .from("assignments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[assignments PATCH error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/admin/assignments");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/finance");

    return NextResponse.json({ success: true, assignment: data });
  } catch (err: any) {
    console.error("[assignments PATCH exception]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update assignment status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    const adminDb = await createAdminClient();
    const { error } = await adminDb.from("assignments").delete().eq("id", id);

    if (error) {
      console.error("[assignments DELETE error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    revalidatePath("/admin/assignments");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/finance");

    return NextResponse.json({ success: true, message: "Assignment deleted." });
  } catch (err: any) {
    console.error("[assignments DELETE exception]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
