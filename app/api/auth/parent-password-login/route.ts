import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    const adminClient = await createAdminClient();
    // Verify parent exists using adminClient (bypasses RLS)
    const { data: student } = await adminClient
      .from("students")
      .select("id, parent_auth_user_id")
      .or(`parent_auth_user_id.eq.${data.user.id},parent_email.ilike.${email},email.ilike.${email}`)
      .limit(1)
      .maybeSingle();

    if (!student) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "No parent account found." }, { status: 403 });
    }

    // Auto-link parent_auth_user_id if not linked
    if (student && student.parent_auth_user_id !== data.user.id) {
      await adminClient
        .from("students")
        .update({ parent_auth_user_id: data.user.id })
        .eq("id", student.id);
    }

    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
