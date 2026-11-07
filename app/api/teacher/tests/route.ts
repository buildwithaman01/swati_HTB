import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient, getTeacherProfile } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

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

    if (!assignment_id || !test_title || obtained_marks === undefined || obtained_marks === null) {
      return NextResponse.json(
        { error: "Student assignment, test title, and marks obtained are required." },
        { status: 400 }
      );
    }

    const adminDb = await createAdminClient();

    // Verify assignment to resolve teacher and student if needed
    // Use .maybeSingle() instead of .single() to avoid PGRST116 crashes
    const { data: asgn, error: asgnErr } = await adminDb
      .from("assignments")
      .select("id, teacher_id, student_id, subject")
      .eq("id", assignment_id)
      .maybeSingle();

    if (asgnErr) {
      console.error("[teacher/tests POST] Assignment lookup error:", asgnErr);
      return NextResponse.json(
        { error: `Database error finding assignment: ${asgnErr.message}` },
        { status: 500 }
      );
    }

    if (!asgn) {
      return NextResponse.json(
        { error: "Invalid or inactive tuition assignment. Please refresh and select an active student." },
        { status: 400 }
      );
    }

    let resolvedTeacherId = teacher_id || asgn.teacher_id;
    const resolvedStudentId = student_id || asgn.student_id;

    // Fallback: If teacher_id is missing, attempt to resolve from current authenticated session
    if (!resolvedTeacherId) {
      try {
        const authClient = await createClient();
        const {
          data: { user },
        } = await authClient.auth.getUser();
        if (user) {
          const profile = await getTeacherProfile(user.id, user.email);
          if (profile) resolvedTeacherId = profile.id;
        }
      } catch (authErr) {
        console.warn("[teacher/tests POST] Could not resolve teacher from auth session:", authErr);
      }
    }

    if (!resolvedTeacherId || !resolvedStudentId) {
      return NextResponse.json(
        { error: "Could not resolve teacher or student for this assignment. Please contact support." },
        { status: 400 }
      );
    }

    const total = Math.max(1, parseFloat(total_marks) || 100);
    const rawObtained = parseFloat(obtained_marks);
    const obtained = isNaN(rawObtained) ? 0 : Math.max(0, Math.min(total, rawObtained));
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

    // Ensure overall_rating is strictly within 1 to 5 integer range
    const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));

    // Ensure score format e.g. "45/50 (90%)"
    const scoreString = `${obtained}/${total} (${percentage}%)`;

    // Strictly normalize report_month as YYYY-MM-DD
    let reportMonth = new Date().toISOString().slice(0, 10);
    const rawDateStr = typeof test_date === "string" ? test_date.trim() : "";
    if (rawDateStr) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawDateStr)) {
        reportMonth = rawDateStr;
      } else if (/^\d{4}-\d{2}$/.test(rawDateStr)) {
        reportMonth = `${rawDateStr}-01`;
      } else if (/^\d{4}-\d{2}-\d{2}/.test(rawDateStr)) {
        reportMonth = rawDateStr.slice(0, 10);
      } else {
        const parsed = new Date(rawDateStr);
        if (!isNaN(parsed.getTime())) {
          reportMonth = parsed.toISOString().slice(0, 10);
        }
      }
    }

    // Topic string combining Test Title and Key Topics Covered (ensuring trimmed string)
    const cleanTitle = (test_title || "").trim();
    const cleanTopics = (key_topics || "").trim();
    const fullTopicsString = (
      cleanTopics ? `${cleanTitle} (Topics: ${cleanTopics})` : cleanTitle
    ).trim() || "Chapter Assessment";

    // Structured metadata for rich parsing
    const metaObj = {
      test_title: cleanTitle,
      key_topics: cleanTopics,
      total_marks: total,
      obtained_marks: obtained,
      percentage,
      performance_badge: `${performanceLabel} (${percentage}%)`,
      test_paper_url: test_paper_url ? String(test_paper_url).trim() : "",
    };

    const cleanRemarks = (remarks || "").trim();
    const remarksFormatted = [
      cleanRemarks || `Test conducted on ${reportMonth}.`,
      test_paper_url ? `Test Paper Link: ${String(test_paper_url).trim()}` : null,
      `<!--TEST_META:${JSON.stringify(metaObj)}-->`,
    ]
      .filter(Boolean)
      .join(" | ");

    // Pre-generate UUID so PostgreSQL does not call NEXTVAL on a sequence (avoiding sequence permission errors)
    const generatedUuid = crypto.randomUUID();

    // In live PostgreSQL, topics_covered is TEXT[] (array of text).
    // PostgREST maps JSON arrays directly to PostgreSQL text[] types.
    const testPayload: Record<string, any> = {
      id: generatedUuid,
      assignment_id: asgn.id,
      teacher_id: resolvedTeacherId,
      student_id: resolvedStudentId,
      report_month: reportMonth,
      topics_covered: [fullTopicsString],
      test_scores: scoreString,
      overall_rating: normalizedRating,
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
    };

    let record: any = null;
    let insertErr: any = null;

    // Resilient adaptive loop to handle schema differences, check constraints, and sequence permissions
    for (let attempt = 0; attempt < 6; attempt++) {
      const res = await adminDb
        .from("progress_reports")
        .insert(testPayload)
        .select()
        .maybeSingle();

      if (!res.error) {
        if (res.data) {
          record = res.data;
        } else {
          // If select returned no data, synthesize record from payload
          record = {
            id: testPayload.id || generatedUuid,
            ...testPayload,
            created_at: new Date().toISOString(),
          };
        }
        insertErr = null;
        break;
      }

      insertErr = res.error;
      const msg = res.error?.message || "";
      console.warn(`[teacher/tests POST attempt ${attempt + 1} warning]:`, msg);

      // 0. Array type vs scalar string variations (PostgreSQL TEXT[] column)
      if (
        /malformed array literal/i.test(msg) ||
        (msg.toLowerCase().includes("array") && msg.toLowerCase().includes("literal"))
      ) {
        console.warn(`[teacher/tests POST] Malformed array literal detected on attempt ${attempt + 1}. Retrying with array payload...`);
        testPayload.topics_covered = [fullTopicsString];
        continue;
      }

      if (
        /cannot cast type text\[\] to text/i.test(msg) ||
        /is of type text but expression is of type text\[\]/i.test(msg) ||
        (msg.toLowerCase().includes("type text") && msg.toLowerCase().includes("text[]"))
      ) {
        console.warn(`[teacher/tests POST] Column is scalar text; converting topics_covered to scalar string and retrying...`);
        testPayload.topics_covered = fullTopicsString;
        continue;
      }

      // 1. Missing columns: "Could not find the '...' column of 'progress_reports' in the schema cache"
      const missingColMatch =
        msg.match(/Could not find the '([^']+)' column/i) ||
        msg.match(/column "([^"]+)" of relation/i) ||
        msg.match(/column "([^"]+)" does not exist/i);

      if (missingColMatch && missingColMatch[1]) {
        const col = missingColMatch[1];
        console.warn(`[teacher/tests POST] Handling missing column '${col}' and retrying...`);
        if (col === "areas_of_improvement") {
          delete testPayload.areas_of_improvement;
          testPayload.gap_areas =
            percentage < 60
              ? "Needs focused revision of core formulas, step-by-step derivations, and speed practice."
              : percentage < 80
              ? "Work on reducing silly calculation errors and handling higher-order thinking problems."
              : "Continue regular mock papers to maintain top percentile in school examinations.";
          continue;
        }
        if (col === "gap_areas") {
          delete testPayload.gap_areas;
          testPayload.areas_of_improvement =
            percentage < 60
              ? "Needs focused revision of core formulas, step-by-step derivations, and speed practice."
              : percentage < 80
              ? "Work on reducing silly calculation errors and handling higher-order thinking problems."
              : "Continue regular mock papers to maintain top percentile in school examinations.";
          continue;
        }
        if (col === "teacher_remarks") {
          delete testPayload.teacher_remarks;
          testPayload.tutor_message = remarksFormatted;
          continue;
        }
        if (col === "tutor_message") {
          delete testPayload.tutor_message;
          testPayload.teacher_remarks = remarksFormatted;
          continue;
        }
        delete testPayload[col];
        continue;
      }

      // 2. Check constraint violations (e.g. overall_rating BETWEEN 1 AND 5)
      if (
        msg.includes("overall_rating") ||
        msg.toLowerCase().includes("violates check constraint") ||
        msg.toLowerCase().includes("check constraint")
      ) {
        if ("overall_rating" in testPayload) {
          console.warn(`[teacher/tests POST] Dropping overall_rating due to check constraint error and retrying...`);
          delete testPayload.overall_rating;
          continue;
        }
      }

      // 3. Serial ID type mismatch (if id is integer instead of UUID)
      if (
        msg.includes("invalid input syntax for type integer") ||
        (msg.includes("invalid input syntax") && msg.includes("id"))
      ) {
        console.warn(`[teacher/tests POST] Table may use integer id. Dropping client UUID id and retrying...`);
        delete testPayload.id;
        continue;
      }

      // 4. Sequence permission error
      if (
        msg.toLowerCase().includes("permission denied for sequence") ||
        (msg.toLowerCase().includes("permission denied") && msg.toLowerCase().includes("sequence"))
      ) {
        if (!testPayload.id) {
          console.warn(`[teacher/tests POST] Sequence permission error detected; setting client UUID and retrying...`);
          testPayload.id = crypto.randomUUID();
          continue;
        }
        // If already had client ID and still failed with sequence error, provide helpful message
        break;
      }

      // 5. Non-critical optional columns that might fail validation
      if ("sent_at" in testPayload && msg.includes("sent_at")) {
        delete testPayload.sent_at;
        continue;
      }
      if ("sent_to_parent" in testPayload && msg.includes("sent_to_parent")) {
        delete testPayload.sent_to_parent;
        continue;
      }
      if ("strengths" in testPayload && msg.includes("strengths")) {
        delete testPayload.strengths;
        continue;
      }
      if ("areas_of_improvement" in testPayload && msg.includes("areas_of_improvement")) {
        delete testPayload.areas_of_improvement;
        continue;
      }

      // If unrecognized error, stop loop to avoid infinite attempts
      break;
    }

    if (insertErr || !record) {
      console.error("[teacher/tests POST fatal error]:", insertErr);
      let userFriendlyError = insertErr?.message || "Failed to record test in database.";
      if (userFriendlyError.toLowerCase().includes("permission denied for sequence")) {
        userFriendlyError =
          "Database sequence permission error: Unable to generate test record ID. Please contact bureau administration.";
      }
      return NextResponse.json({ error: userFriendlyError }, { status: 400 });
    }

    // Attach student and assignment details safely
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

    let { data: tests, error } = await query;
    if (error) {
      console.warn("[teacher/tests GET embed query failed, trying flat fallback]:", error.message);
      let flatQuery = adminDb
        .from("progress_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (teacherId) flatQuery = flatQuery.eq("teacher_id", teacherId);
      if (studentId) flatQuery = flatQuery.eq("student_id", studentId);
      const flatRes = await flatQuery;
      if (!flatRes.error && flatRes.data) {
        const flatRows = flatRes.data;
        const sIds = Array.from(new Set(flatRows.map((r: any) => r.student_id).filter(Boolean)));
        const aIds = Array.from(new Set(flatRows.map((r: any) => r.assignment_id).filter(Boolean)));

        const [{ data: sList }, { data: aList }] = await Promise.all([
          sIds.length > 0
            ? adminDb.from("students").select("id, full_name, class_studying, parent_name, parent_phone, whatsapp").in("id", sIds)
            : Promise.resolve({ data: [] }),
          aIds.length > 0
            ? adminDb.from("assignments").select("id, subject").in("id", aIds)
            : Promise.resolve({ data: [] }),
        ]);

        const sMap = new Map((sList || []).map((s: any) => [s.id, s]));
        const aMap = new Map((aList || []).map((a: any) => [a.id, a]));

        tests = flatRows.map((r: any) => ({
          ...r,
          student: sMap.get(r.student_id) || null,
          assignment: aMap.get(r.assignment_id) || null,
        }));
        error = null;
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ tests: tests || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch tests" }, { status: 500 });
  }
}
