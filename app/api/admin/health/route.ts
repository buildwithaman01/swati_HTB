import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    const diagnostics = {
      timestamp: new Date().toISOString(),
      env: {
        NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "Configured" : "Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnon ? "Configured" : "Missing",
        SUPABASE_SERVICE_ROLE_KEY: hasServiceRole ? "Configured" : "Missing (Falling back to anon key)",
      },
      database_access: {
        service_role_bypassing_rls: false,
        teachers_count: 0,
        students_count: 0,
        assignments_count: 0,
        assignments_query_error: null as string | null,
        students_sample_columns: [] as string[],
        teacher_lookup: null as any,
        auth_users_count: 0,
        error: null as string | null,
      },
    };

    const adminDb = await createAdminClient();

    const { count: teacherCount, error: tErr } = await adminDb
      .from("teachers")
      .select("*", { count: "exact", head: true });

    const { count: studentCount, error: sErr } = await adminDb
      .from("students")
      .select("*", { count: "exact", head: true });

    // Test assignments join
    const { data: asData, error: asErr } = await adminDb
      .from("assignments")
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id, locality, subjects, phone, whatsapp),
        student:students(id, full_name, student_id, class_studying, parent_name, parent_phone, whatsapp)
      `)
      .limit(5);

    if (asErr) {
      diagnostics.database_access.assignments_query_error = asErr.message;
    } else {
      diagnostics.database_access.assignments_count = asData?.length || 0;
    }

    // Test sessions count & join
    const { data: sessData, error: sessErr } = await adminDb
      .from("sessions")
      .select(`
        *,
        teacher:teachers(id, full_name),
        student:students(id, full_name),
        assignment:assignments(id, subject)
      `)
      .limit(5);

    diagnostics.database_access.sessions_test = {
      count: sessData?.length ?? 0,
      error: sessErr?.message || null,
      sample_keys: sessData && sessData[0] ? Object.keys(sessData[0]) : null
    };

    // Test old syntax students:student_id vs student:students
    const { error: oldJoinErr } = await adminDb
      .from("assignments")
      .select("id, students:student_id(id, full_name)")
      .limit(1);
    diagnostics.database_access.old_students_student_id_syntax_error = oldJoinErr?.message || null;

    // Sample students columns
    const { data: stSample } = await adminDb.from("students").select("*").limit(1);
    if (stSample && stSample[0]) {
      diagnostics.database_access.students_sample_columns = Object.keys(stSample[0]);
    }

    // Check teacher Aman
    const { data: amanTeacher } = await adminDb
      .from("teachers")
      .select("id, full_name, email, phone, teacher_id, verification_status, auth_user_id")
      .or("email.ilike.%amansingh%,phone.ilike.%939090631%,whatsapp.ilike.%939090631%");
    diagnostics.database_access.teacher_lookup = amanTeacher;

    // Check auth users
    const { data: authList } = await adminDb.auth.admin.listUsers();
    diagnostics.database_access.auth_users_count = authList?.users?.length || 0;

    if (tErr) {
      diagnostics.database_access.error = `Teachers query: ${tErr.message}`;
    } else {
      diagnostics.database_access.teachers_count = teacherCount || 0;
    }

    if (sErr) {
      diagnostics.database_access.error = diagnostics.database_access.error
        ? `${diagnostics.database_access.error} | Students query: ${sErr.message}`
        : `Students query: ${sErr.message}`;
    } else {
      diagnostics.database_access.students_count = studentCount || 0;
    }

    diagnostics.database_access.service_role_bypassing_rls = hasServiceRole && !tErr && !sErr;

    return NextResponse.json(diagnostics, {
      status: diagnostics.database_access.service_role_bypassing_rls ? 200 : 207,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Failed health check",
      },
      { status: 500 }
    );
  }
}
