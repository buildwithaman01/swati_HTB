import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { createAdminAuthClient } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawIdentifier = (body.email || body.identifier || "").trim();
    const password = body.password || "";

    if (!rawIdentifier || !password) {
      return NextResponse.json({ error: "Email / Teacher ID and password are required" }, { status: 400 });
    }

    const adminClient = await createAdminClient();

    // 1. Resolve identifier: email, Teacher ID (e.g. TCH-2026-619), or phone (e.g. 939090631)
    let emailToAuth = rawIdentifier;
    let teacherRow: any = null;

    if (!rawIdentifier.includes("@")) {
      const cleanId = rawIdentifier.toUpperCase().trim();
      const digitsOnly = rawIdentifier.replace(/\D/g, "");

      const orConditions: string[] = [
        `teacher_id.ilike.%${cleanId}%`,
        `teacher_id.eq.${cleanId}`,
      ];

      if (digitsOnly.length >= 6) {
        orConditions.push(`phone.ilike.%${digitsOnly}%`);
        orConditions.push(`whatsapp.ilike.%${digitsOnly}%`);
      }

      const { data: matchedTeachers } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .or(orConditions.join(","))
        .order("created_at", { ascending: false })
        .limit(1);

      teacherRow = matchedTeachers?.[0] || null;

      if (!teacherRow || !teacherRow.email) {
        return NextResponse.json({
          error: `No teacher found with ID / Phone "${rawIdentifier}". Please enter your registered email address.`
        }, { status: 404 });
      }

      emailToAuth = teacherRow.email;
    } else {
      // Find teacher by email
      const { data: matchedTeachers } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .ilike("email", rawIdentifier.toLowerCase().trim())
        .order("created_at", { ascending: false })
        .limit(1);

      teacherRow = matchedTeachers?.[0] || null;
      if (teacherRow?.email) {
        emailToAuth = teacherRow.email;
      }
    }

    // 2. Sign in via Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth.toLowerCase().trim(),
      password,
    });

    if (authError) {
      // Check if user even has an auth account created in Supabase Auth
      try {
        const authAdmin = createAdminAuthClient();
        const { data: userList } = await authAdmin.auth.admin.listUsers();
        const existsInAuth = userList?.users?.some(
          (u) => u.email?.toLowerCase() === emailToAuth.toLowerCase().trim()
        );

        if (!existsInAuth) {
          return NextResponse.json({
            error: "Your login password has not been activated by the admin yet. Please contact Swati HTB Admin to set your password."
          }, { status: 401 });
        }
      } catch (authAdminErr) {
        console.warn("[teacher-password-login] authAdmin check warning:", authAdminErr);
      }

      return NextResponse.json({
        error: "Incorrect password. Please verify your credentials or contact Swati HTB Admin to reset."
      }, { status: 401 });
    }

    // 3. Verify teacher record exists in database
    if (!teacherRow) {
      const { data: foundTeachers } = await adminClient
        .from("teachers")
        .select("id, email, full_name, teacher_id, verification_status, auth_user_id, is_active")
        .or(`auth_user_id.eq.${authData.user.id},email.ilike.${emailToAuth.toLowerCase().trim()}`)
        .order("created_at", { ascending: false })
        .limit(1);

      teacherRow = foundTeachers?.[0] || null;
    }

    if (!teacherRow) {
      await supabase.auth.signOut();
      return NextResponse.json({
        error: "No teacher record found for this account. Contact Swati HTB admin."
      }, { status: 403 });
    }

    // 4. Auto-heal: Link auth_user_id if not linked yet
    if (teacherRow && teacherRow.auth_user_id !== authData.user.id) {
      await adminClient
        .from("teachers")
        .update({ auth_user_id: authData.user.id })
        .eq("id", teacherRow.id);
    }

    // Return JSON with redirectUrl for client-side navigation
    return NextResponse.json({
      success: true,
      redirectUrl: "/teacher/dashboard",
      teacher: {
        id: teacherRow.id,
        name: teacherRow.full_name,
        teacher_id: teacherRow.teacher_id,
      },
    });
  } catch (err: any) {
    console.error("[teacher-password-login Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
