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
