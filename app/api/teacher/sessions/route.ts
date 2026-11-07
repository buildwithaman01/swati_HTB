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
      session_date,
      start_time,
      session_start,
      session_end,
      duration_mins,
      topics_covered,
      homework_assigned,
      homework_given,
      notes,
      teacher_notes,
      student_attendance,
      status,
    } = body;

    if (!assignment_id || !topics_covered) {
      return NextResponse.json(
        { error: "Student assignment and topics covered are required." },
        { status: 400 }
      );
    }

    const adminDb = await createAdminClient();

    // Verify assignment to resolve student and teacher if not provided
    const { data: asgn, error: asgnErr } = await adminDb
      .from("assignments")
      .select("id, teacher_id, student_id")
      .eq("id", assignment_id)
      .single();

    if (asgnErr || !asgn) {
      return NextResponse.json({ error: "Invalid tuition assignment." }, { status: 400 });
    }

    const resolvedTeacherId = teacher_id || asgn.teacher_id;
    const resolvedStudentId = student_id || asgn.student_id;
    const cleanDate = session_date && session_date.trim() !== "" ? session_date.trim() : new Date().toISOString().slice(0, 10);
    const cleanStartTime = (start_time || session_start || "16:00").slice(0, 5);
    const cleanDuration = parseInt(duration_mins) || 60;
    const cleanHomework = homework_assigned || homework_given || null;
    const cleanNotes = notes || teacher_notes || null;

    // Adaptive payload matching public.sessions schema
    const payload: Record<string, any> = {
      assignment_id: asgn.id,
      student_id: resolvedStudentId,
      teacher_id: resolvedTeacherId,
      session_date: cleanDate,
      start_time: cleanStartTime,
      duration_mins: cleanDuration,
      topics_covered: topics_covered.trim(),
      homework_assigned: cleanHomework,
      student_attendance: student_attendance || "present",
      status: status || "completed",
      notes: cleanNotes,
    };

    let sessionRecord: any = null;
    let insertErr: any = null;

    // Resilient adaptive loop to handle schema differences in live Supabase DB
    for (let attempt = 0; attempt < 6; attempt++) {
      const res = await adminDb
        .from("sessions")
        .insert(payload)
        .select()
        .maybeSingle();

      if (!res.error && res.data) {
        sessionRecord = res.data;
        insertErr = null;
        break;
      }

      insertErr = res.error;
      const msg = res.error?.message || "";
      console.warn(`[sessions POST attempt ${attempt + 1} warning]:`, msg);

      // Detect missing column error: "Could not find the '...' column of 'sessions' in the schema cache"
      const missingColMatch = msg.match(/Could not find the '([^']+)' column/i);
      if (missingColMatch) {
        const col = missingColMatch[1];
        console.warn(`[sessions POST] Dynamically adapting around missing column '${col}'...`);
        delete payload[col];

        if (col === "homework_assigned" && cleanHomework) {
          payload.homework_given = cleanHomework;
        } else if (col === "start_time" && cleanStartTime) {
          payload.session_start = cleanStartTime;
        } else if (col === "notes" && cleanNotes) {
          payload.teacher_notes = cleanNotes;
        }
        continue;
      }

      // If error is about student_attendance or status default
      if (msg.includes("student_attendance")) {
        delete payload.student_attendance;
        continue;
      }

      break;
    }

    if (insertErr || !sessionRecord) {
      console.error("[sessions POST fatal insert error]:", insertErr);
      return NextResponse.json(
        { error: insertErr?.message || "Failed to record session in database." },
        { status: 400 }
      );
    }

    // Attach student details safely without relying on PostgREST embed aliases
    if (sessionRecord && sessionRecord.student_id) {
      const { data: st } = await adminDb
        .from("students")
        .select("id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp")
        .eq("id", sessionRecord.student_id)
        .maybeSingle();
      sessionRecord.students = st || null;
      sessionRecord.student = st || null;
    }

    revalidatePath("/teacher/dashboard/sessions");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/portal/sessions");
    revalidatePath("/portal/dashboard");
    revalidatePath("/admin/sessions");

    return NextResponse.json({
      success: true,
      session: sessionRecord,
      message: "Class session recorded successfully!",
    });
  } catch (err: any) {
    console.error("[sessions POST exception]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacher_id");
    const studentId = searchParams.get("student_id");

    const adminDb = await createAdminClient();
    let query = adminDb
      .from("sessions")
      .select(`
        *,
        students:student_id ( id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp ),
        assignments:assignment_id ( id, subject )
      `)
      .order("session_date", { ascending: false });

    if (teacherId) query = query.eq("teacher_id", teacherId);
    if (studentId) query = query.eq("student_id", studentId);

    let { data: sessions, error } = await query;
    if (error) {
      console.warn("[sessions GET embed query failed, trying flat fallback]:", error.message);
      let flatQuery = adminDb
        .from("sessions")
        .select("*")
        .order("session_date", { ascending: false });
      if (teacherId) flatQuery = flatQuery.eq("teacher_id", teacherId);
      if (studentId) flatQuery = flatQuery.eq("student_id", studentId);
      const flatRes = await flatQuery;
      if (!flatRes.error && flatRes.data) {
        sessions = flatRes.data;
        error = null;
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let sessionId = searchParams.get("id");

    if (!sessionId) {
      try {
        const body = await req.json();
        sessionId = body.id || body.session_id;
      } catch {}
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required for deletion." }, { status: 400 });
    }

    // Authenticate caller
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in as a teacher." }, { status: 401 });
    }

    const teacher = await getTeacherProfile(user.id, user.email);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found." }, { status: 403 });
    }

    const adminDb = await createAdminClient();

    // Verify session belongs to this teacher
    const { data: existingSession, error: fetchErr } = await adminDb
      .from("sessions")
      .select("id, teacher_id, session_date, topics_covered")
      .eq("id", sessionId)
      .single();

    if (fetchErr || !existingSession) {
      return NextResponse.json({ error: "Session log not found or already deleted." }, { status: 404 });
    }

    if (existingSession.teacher_id !== teacher.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete another teacher's session log." },
        { status: 403 }
      );
    }

    // Delete session
    const { error: deleteErr } = await adminDb
      .from("sessions")
      .delete()
      .eq("id", sessionId);

    if (deleteErr) {
      console.error("[deleteSession error]:", deleteErr);
      return NextResponse.json({ error: deleteErr.message || "Failed to delete session log." }, { status: 500 });
    }

    revalidatePath("/teacher/dashboard/sessions");
    revalidatePath("/teacher/dashboard");
    revalidatePath("/portal/sessions");
    revalidatePath("/portal/dashboard");
    revalidatePath("/admin/sessions");

    return NextResponse.json({
      success: true,
      message: "Session log deleted successfully.",
    });
  } catch (err: any) {
    console.error("[sessions DELETE exception]:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
