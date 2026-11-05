import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { count, error } = await supabase
      .from("teachers")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          status: "database_error",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      teacher_count: count ?? 0,
      timestamp: new Date().toISOString(),
      keep_alive: "active",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: err?.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
