import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Verify this user is actually a teacher
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id, verification_status, full_name")
      .eq("auth_user_id", data.user.id)
      .single();

    if (!teacher) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "No teacher account found for this email." }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
