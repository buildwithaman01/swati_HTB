import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      assignment_id,
      student_id,
      teacher_id,
      test_title,
      subject,
      test_date,
      total_marks,
      obtained_marks,
      remarks,
      test_paper_url,
    } = body;

    if (!assignment_id || !test_title || obtained_marks === undefined) {
      return NextResponse.json(
        { error: "Student assignment, test title, and marks obtained are required." },
        { status: 400 }
      );
    }

    const adminDb = await createAdminClient();

    // Verify assignment to resolve teacher and student if needed
    const { data: asgn, error: asgnErr } = await adminDb
      .from("assignments")
      .select("id, teacher_id, student_id, subject")
      .eq("id", assignment_id)
      .single();

    if (asgnErr || !asgn) {
      return NextResponse.json({ error: "Invalid tuition assignment." }, { status: 400 });
    }

    const resolvedTeacherId = teacher_id || asgn.teacher_id;
    const resolvedStudentId = student_id || asgn.student_id;
    const total = parseFloat(total_marks) || 100;
    const obtained = parseFloat(obtained_marks) || 0;
    const percentage = Math.round((obtained / total) * 100);

    const scoreString = `${obtained}/${total} (${percentage}%)`;
    const formattedDate = test_date && test_date.trim() !== "" ? test_date.trim() : new Date().toISOString().slice(0, 10);

    const remarksText = [
      remarks ? `Remarks: ${remarks}` : null,
      test_paper_url ? `Test Paper Link: ${test_paper_url}` : null,
    ].filter(Boolean).join(" | ");

    // Insert into progress_reports table
    const { data: record, error: insertErr } = await adminDb
      .from("progress_reports")
      .insert({
        assignment_id: asgn.id,
        teacher_id: resolvedTeacherId,
        student_id: resolvedStudentId,
        report_month: formattedDate,
        topics_covered: `${subject || asgn.subject} - ${test_title}`,
        test_scores: scoreString,
        strengths: percentage >= 80 ? "Excellent understanding of core concepts" : "Solid attempt, improving",
        areas_of_improvement: percentage < 75 ? "Needs practice in numericals and derivations" : "Minor formula revision",
        teacher_remarks: remarksText || `Test completed on ${formattedDate}.`,
        sent_to_parent: true,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[teacher/tests POST error]:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    revalidatePath("/teacher/dashboard/tests");
    revalidatePath("/teacher/dashboard/reports");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/portal/reports");
    revalidatePath("/portal/tests");
    revalidatePath("/portal/dashboard");
    revalidatePath("/admin/reports");

    return NextResponse.json({
      success: true,
      test: record,
      message: `Test score for "${test_title}" saved successfully!`,
    });
  } catch (err: any) {
    console.error("[teacher/tests POST exception]:", err);
    return NextResponse.json({ error: err.message || "Failed to record test" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacher_id");
    const studentId = searchParams.get("student_id");

    const adminDb = await createAdminClient();
    let query = adminDb
      .from("progress_reports")
      .select(`
        *,
        assignment:assignments(id, subject),
        student:students(id, full_name, class_studying, parent_name),
        teacher:teachers(id, full_name, teacher_id)
      `)
      .order("created_at", { ascending: false });

    if (teacherId) query = query.eq("teacher_id", teacherId);
    if (studentId) query = query.eq("student_id", studentId);

    const { data: tests, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ tests: tests || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch tests" }, { status: 500 });
  }
}
