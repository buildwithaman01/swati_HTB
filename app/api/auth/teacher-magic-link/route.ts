import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const formData = await req.formData().catch(() => null);
    const rawIdentifier = (body.email || formData?.get("email") as string || "").trim();

    if (!rawIdentifier) return NextResponse.json({ error: "Email or Teacher ID is required" }, { status: 400 });

    const adminClient = await createAdminClient();

    let targetEmail = rawIdentifier;
    if (!rawIdentifier.includes("@")) {
      // Find teacher by teacher_id or phone
      const { data: teacherRecord } = await adminClient
        .from("teachers")
        .select("email, full_name, teacher_id")
        .or(`teacher_id.ilike.${rawIdentifier},phone.eq.${rawIdentifier},whatsapp.eq.${rawIdentifier}`)
        .maybeSingle();

        if (!teacherRecord || !teacherRecord.email) {
          return NextResponse.json({
            error: `No teacher found with ID / Phone "${rawIdentifier}". Please enter your registered email.`
          }, { status: 404 });
        }
        targetEmail = teacherRecord.email;
      } else {
        // Verify teacher exists by email using adminClient (bypasses RLS)
        const { data: teacher } = await adminClient
          .from("teachers")
          .select("id, full_name, email")
          .ilike("email", targetEmail)
          .maybeSingle();

        if (!teacher) {
          return NextResponse.json({
            error: `No teacher account found with email "${targetEmail}". Contact Swati HTB admin.`
          }, { status: 404 });
        }
      }

      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail.toLowerCase(),
        options: {
          emailRedirectTo: `${req.nextUrl.origin}/api/auth/callback?next=/teacher/dashboard`,
        },
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      return NextResponse.json({ success: true, email: targetEmail });
    } catch (e: any) {
      console.error("[teacher-magic-link Error]:", e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
