import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const formData = await req.formData().catch(() => null);
    const email = body.email || formData?.get("email") as string;

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const supabase = await createClient();

    // Verify teacher exists
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id, full_name")
      .eq("email", email)
      .single();

    if (!teacher) {
      return NextResponse.json({ error: "No teacher account found with that email. Contact your admin." }, { status: 404 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/api/auth/callback?next=/teacher/dashboard`,
      },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}