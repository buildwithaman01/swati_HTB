import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const formData = await req.formData().catch(() => null);
    const rawIdentifier = (body.email || formData?.get("email") as string || "").trim();

    if (!rawIdentifier) {
      return NextResponse.json({ error: "Email, Teacher ID, or Phone is required" }, { status: 400 });
    }

    const adminClient = await createAdminClient();
    let targetEmail = rawIdentifier;

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

      const { data: matchedList } = await adminClient
        .from("teachers")
        .select("email, full_name, teacher_id")
        .or(orConditions.join(","))
        .order("created_at", { ascending: false })
        .limit(1);

      const teacherRecord = matchedList?.[0];
      if (!teacherRecord || !teacherRecord.email) {
        return NextResponse.json({
          error: `No teacher found with ID / Phone "${rawIdentifier}". Please enter your registered email address.`
        }, { status: 404 });
      }
      targetEmail = teacherRecord.email;
    } else {
      // Verify teacher exists by email using adminClient (bypasses RLS)
      const { data: teacherList } = await adminClient
        .from("teachers")
        .select("id, full_name, email")
        .ilike("email", targetEmail.trim().toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1);

      const teacher = teacherList?.[0];
      if (!teacher) {
        return NextResponse.json({
          error: `No teacher account found with email "${targetEmail}". Contact Swati HTB admin.`
        }, { status: 404 });
      }
      targetEmail = teacher.email;
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/api/auth/callback?next=/teacher/dashboard`,
      },
    });

    if (error) {
      console.error("[teacher-magic-link signInWithOtp error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, email: targetEmail });
  } catch (e: any) {
    console.error("[teacher-magic-link Error]:", e);
    return NextResponse.json({ error: e.message || "Failed to send magic link" }, { status: 500 });
  }
}
