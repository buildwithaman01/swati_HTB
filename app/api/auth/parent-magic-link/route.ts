import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const supabase = await createClient();

    // Verify parent email is registered in students table
    const { data: student } = await supabase
      .from("students")
      .select("id, full_name, parent_name")
      .or(`parent_email.eq.${email},email.eq.${email}`)
      .single();

    if (!student) {
      return NextResponse.json({ error: "No account found with that email. Contact Swati HTB to get access." }, { status: 404 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/api/auth/callback?next=/portal/dashboard`,
      },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
