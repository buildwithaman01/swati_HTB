import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient, getTeacherProfile } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      assignment_id,
      student_id,
      teacher_id,
      report_month,
      topics_covered,
      strengths,
      areas_of_improvement,
      gap_areas,
      teacher_remarks,
      tutor_message,
      overall_rating,
    } = body;

    // Strict validation
    if (!assignment_id) {
      return NextResponse.json(
        { error: "Please select an active student assignment." },
        { status: 400 }
      );
    }

    const cleanTopics = (topics_covered || "").trim();
    if (!cleanTopics) {
      return NextResponse.json(
        { error: "Please provide the syllabus / topics covered this month." },
        { status: 400 }
      );
    }

    const cleanStrengths = (strengths || "").trim();
    if (!cleanStrengths) {
      return NextResponse.json(
        { error: "Please highlight the student's strengths and academic achievements." },
        { status: 400 }
      );
    }

    const cleanImprovement = (areas_of_improvement || gap_areas || "").trim();
    if (!cleanImprovement) {
      return NextResponse.json(
        { error: "Please specify key areas for improvement or focus points." },
        { status: 400 }
      );
    }

    const adminDb = await createAdminClient();

    // Verify assignment to resolve student and teacher if needed
    const { data: asgn, error: asgnErr } = await adminDb
      .from("assignments")
      .select("id, teacher_id, student_id, subject")
      .eq("id", assignment_id)
      .maybeSingle();

    if (asgnErr || !asgn) {
      return NextResponse.json(
        { error: "Invalid tuition assignment selected. Please refresh and try again." },
        { status: 400 }
      );
    }

    // Resolve IDs
    const resolvedTeacherId = teacher_id || asgn.teacher_id;
    const resolvedStudentId = student_id || asgn.student_id;

    if (!resolvedTeacherId || !resolvedStudentId) {
      return NextResponse.json(
        { error: "Unable to resolve tutor or student identity for this assignment." },
        { status: 400 }
      );
    }

    // Normalize report month to YYYY-MM-01 format
    const rawMonth = (report_month || "").trim() || new Date().toISOString().slice(0, 7);
    const normalizedMonth = rawMonth.length === 7 ? `${rawMonth}-01` : rawMonth;

    const cleanRemarks = (teacher_remarks || tutor_message || "Monthly progress evaluation submitted.").trim();

    // Explicit UUID generation to prevent sequence permission errors in Supabase
    const reportId = crypto.randomUUID();

    // Primary payload targeting standard canonical schema
    const reportPayload: Record<string, any> = {
      id: reportId,
      assignment_id: asgn.id,
      teacher_id: resolvedTeacherId,
      student_id: resolvedStudentId,
      report_month: normalizedMonth,
      topics_covered: cleanTopics,
      strengths: cleanStrengths,
      areas_of_improvement: cleanImprovement,
      teacher_remarks: cleanRemarks,
      sent_to_parent: true,
      sent_at: new Date().toISOString(),
    };

    if (overall_rating !== undefined && overall_rating !== null && overall_rating !== "") {
      const parsedRating = parseInt(String(overall_rating), 10);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        reportPayload.overall_rating = parsedRating;
      }
    }

    let record: any = null;
    let insertErr: any = null;

    // Resilient adaptive insert loop handling column variations across DB environments
    for (let attempt = 0; attempt < 8; attempt++) {
      const res = await adminDb
        .from("progress_reports")
        .insert(reportPayload)
        .select()
        .maybeSingle();

      if (!res.error && res.data) {
        record = res.data;
        insertErr = null;
        break;
      }

      insertErr = res.error;
      const msg = res.error?.message || "";
      console.warn(`[teacher/reports POST attempt ${attempt + 1} warning]:`, msg);

      // Handle specific missing column errors reported by PostgREST
      const missingColMatch = msg.match(/Could not find the '([^']+)' column/i);
      if (missingColMatch) {
        const missingCol = missingColMatch[1];
        if (missingCol === "areas_of_improvement") {
          delete reportPayload.areas_of_improvement;
          reportPayload.gap_areas = cleanImprovement;
          continue;
        }
        if (missingCol === "gap_areas") {
          delete reportPayload.gap_areas;
          reportPayload.areas_of_improvement = cleanImprovement;
          continue;
        }
        if (missingCol === "teacher_remarks") {
          delete reportPayload.teacher_remarks;
          reportPayload.tutor_message = cleanRemarks;
          continue;
        }
        if (missingCol === "tutor_message") {
          delete reportPayload.tutor_message;
          reportPayload.teacher_remarks = cleanRemarks;
          continue;
        }
        if (missingCol === "id") {
          // If the DB generates its own ID or doesn't allow explicit ID
          delete reportPayload.id;
          continue;
        }
        // Drop any other missing optional column
        delete reportPayload[missingCol];
        continue;
      }

      // Column name variations
      if (msg.toLowerCase().includes("areas_of_improvement") && !reportPayload.gap_areas) {
        delete reportPayload.areas_of_improvement;
        reportPayload.gap_areas = cleanImprovement;
        continue;
      }
      if (msg.toLowerCase().includes("teacher_remarks") && !reportPayload.tutor_message) {
        delete reportPayload.teacher_remarks;
        reportPayload.tutor_message = cleanRemarks;
        continue;
      }
      if (msg.toLowerCase().includes("overall_rating")) {
        delete reportPayload.overall_rating;
        continue;
      }
      if (msg.toLowerCase().includes("sent_to_parent")) {
        delete reportPayload.sent_to_parent;
        continue;
      }
      if (msg.toLowerCase().includes("sent_at")) {
        delete reportPayload.sent_at;
        continue;
      }
      if (msg.toLowerCase().includes("id") && (msg.toLowerCase().includes("sequence") || msg.toLowerCase().includes("default"))) {
        delete reportPayload.id;
        continue;
      }

      // Unknown fatal error: break out
      break;
    }

    if (insertErr || !record) {
      console.error("[teacher/reports POST fatal error]:", insertErr);
      return NextResponse.json(
        { error: insertErr?.message || "Failed to record evaluation in database." },
        { status: 400 }
      );
    }

    // Attach student and assignment details for rich client feedback
    if (record) {
      const [{ data: stData }, { data: asData }] = await Promise.all([
        record.student_id
          ? adminDb
              .from("students")
              .select("id, full_name, class_studying, parent_name, parent_phone, whatsapp")
              .eq("id", record.student_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        record.assignment_id
          ? adminDb
              .from("assignments")
              .select("id, subject")
              .eq("id", record.assignment_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      record.student = stData || null;
      record.assignment = asData || null;
    }

    // Cache revalidation
    revalidatePath("/teacher/dashboard/reports");
    revalidatePath("/teacher/dashboard/tests");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/portal/reports");
    revalidatePath("/portal/dashboard");
    revalidatePath("/admin/reports");

    return NextResponse.json({
      success: true,
      report: record,
      message: "Monthly progress report submitted successfully!",
    });
  } catch (err: any) {
    console.error("[teacher/reports POST exception]:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while saving the report." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacher_id");
    const studentId = searchParams.get("student_id");
    const assignmentId = searchParams.get("assignment_id");

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
    if (assignmentId) query = query.eq("assignment_id", assignmentId);

    let { data: reports, error } = await query;
    if (error) {
      console.warn("[teacher/reports GET embed query failed, trying flat fallback]:", error.message);
      let flatQuery = adminDb
        .from("progress_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (teacherId) flatQuery = flatQuery.eq("teacher_id", teacherId);
      if (studentId) flatQuery = flatQuery.eq("student_id", studentId);
      if (assignmentId) flatQuery = flatQuery.eq("assignment_id", assignmentId);

      const flatRes = await flatQuery;
      if (!flatRes.error && flatRes.data) {
        reports = flatRes.data;
        error = null;
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ reports: reports || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch reports" }, { status: 500 });
  }
}
