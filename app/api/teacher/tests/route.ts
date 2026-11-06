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
      key_topics,
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

    // Performance Badge text
    let performanceLabel = "Good Progress";
    let rating = 3;
    if (percentage >= 90) {
      performanceLabel = "Outstanding";
      rating = 5;
    } else if (percentage >= 75) {
      performanceLabel = "Excellent";
      rating = 4;
    } else if (percentage >= 60) {
      performanceLabel = "Good Progress";
      rating = 3;
    } else if (percentage >= 45) {
      performanceLabel = "Average";
      rating = 2;
    } else {
      performanceLabel = "Needs Attention";
      rating = 1;
    }

    const scoreString = `${obtained}/${total} (${percentage}%)`;
    const formattedDate =
      test_date && test_date.trim() !== ""
        ? test_date.trim()
        : new Date().toISOString().slice(0, 10);

    // Topic string combining Test Title and Key Topics Covered
    const cleanTitle = test_title.trim();
    const cleanTopics = (key_topics || "").trim();
    const fullTopicsString = cleanTopics
      ? `${cleanTitle} (Topics: ${cleanTopics})`
      : cleanTitle;

    // Structured metadata for rich parsing
    const metaObj = {
      test_title: cleanTitle,
      key_topics: cleanTopics,
      total_marks: total,
      obtained_marks: obtained,
      percentage,
      performance_badge: `${performanceLabel} (${percentage}%)`,
      test_paper_url: test_paper_url ? test_paper_url.trim() : "",
    };

    const cleanRemarks = (remarks || "").trim();
    const remarksFormatted = [
      cleanRemarks || `Test conducted on ${formattedDate}.`,
      test_paper_url ? `Test Paper Link: ${test_paper_url.trim()}` : null,
      `<!--TEST_META:${JSON.stringify(metaObj)}-->`,
    ]
      .filter(Boolean)
      .join(" | ");

    // Insert into progress_reports table
    const { data: record, error: insertErr } = await adminDb
      .from("progress_reports")
      .insert({
        assignment_id: asgn.id,
        teacher_id: resolvedTeacherId,
        student_id: resolvedStudentId,
        report_month: formattedDate,
        topics_covered: fullTopicsString,
        test_scores: scoreString,
        overall_rating: rating,
        strengths:
          percentage >= 80
            ? "Strong conceptual clarity, accurate problem-solving, and good test presentation."
            : percentage >= 60
            ? "Solid understanding of standard questions; active participation in doubt-clearing."
            : "Shows sincere effort; responsive to guided corrections and hints.",
        areas_of_improvement:
          percentage < 60
            ? "Needs focused revision of core formulas, step-by-step derivations, and speed practice."
            : percentage < 80
            ? "Work on reducing silly calculation errors and handling higher-order thinking problems."
            : "Continue regular mock papers to maintain top percentile in school examinations.",
        teacher_remarks: remarksFormatted,
        sent_to_parent: true,
        sent_at: new Date().toISOString(),
      })
      .select(`
        *,
        assignment:assignments (id, subject),
        student:students (id, full_name, class_studying, parent_name, parent_phone, whatsapp)
      `)
      .single();

    if (insertErr) {
      console.error("[teacher/tests POST error]:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }

    revalidatePath("/teacher/dashboard/tests");
    revalidatePath("/teacher/dashboard/reports");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/portal/reports");
    revalidatePath("/portal/dashboard");
    revalidatePath("/admin/reports");

    return NextResponse.json({
      success: true,
      test: record,
      message: `Test score for "${cleanTitle}" saved successfully!`,
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
        student:students(id, full_name, class_studying, parent_name, parent_phone, whatsapp),
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
