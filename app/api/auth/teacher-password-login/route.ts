import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawIdentifier = (body.email || body.identifier || "").trim();
    const password = body.password || "";

    if (!rawIdentifier || !password) {
      return NextResponse.json({ error: "Email / Teacher ID and password are required" }, { status: 400 });
    }

    const adminClient = await createAdminClient();

    // 1. Resolve identifier: could be email, Teacher ID (e.g. TCH-2026-619), or phone (e.g. 939090631)
    let emailToAuth = rawIdentifier;
    let teacherRow: any = null;

    if (!rawIdentifier.includes("@")) {
      // Find teacher by teacher_id or phone
      const { data: matchedTeacher } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .or(`teacher_id.ilike.${rawIdentifier},phone.eq.${rawIdentifier},whatsapp.eq.${rawIdentifier}`)
        .maybeSingle();

      if (!matchedTeacher || !matchedTeacher.email) {
        return NextResponse.json({ 
          error: `No teacher found with ID / Phone "${rawIdentifier}". Please enter your registered email.` 
        }, { status: 404 });
      }

      emailToAuth = matchedTeacher.email;
      teacherRow = matchedTeacher;
    } else {
      // Find teacher by email
      const { data: matchedTeacher } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .ilike("email", rawIdentifier)
        .maybeSingle();

      teacherRow = matchedTeacher;
    }

    // 2. Sign in via Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth.toLowerCase(),
      password,
    });

    if (authError) {
      return NextResponse.json({ error: "Invalid credentials. Please verify your email / Teacher ID and password." }, { status: 401 });
    }

    // 3. Verify teacher record exists in database
    if (!teacherRow) {
      const { data: foundTeacher } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .or(`auth_user_id.eq.${authData.user.id},email.ilike.${emailToAuth}`)
        .maybeSingle();
      teacherRow = foundTeacher;
    }

    if (!teacherRow) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "No teacher record found for this account. Contact Swati HTB admin." }, { status: 403 });
    }

    // Auto-heal: Link auth_user_id if not linked yet
    if (teacherRow && teacherRow.auth_user_id !== authData.user.id) {
      await adminClient
        .from("teachers")
        .update({ auth_user_id: authData.user.id })
        .eq("id", teacherRow.id);
    }

    return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
  } catch (err: any) {
    console.error("[teacher-password-login Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

