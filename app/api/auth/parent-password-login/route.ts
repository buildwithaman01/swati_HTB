import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    // Verify parent exists
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .or(`parent_email.eq.${email},email.eq.${email}`)
      .single();

    if (!student) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "No parent account found." }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
