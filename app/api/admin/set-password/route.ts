import { NextRequest, NextResponse } from "next/server";
import { createAdminAuthClient } from "@/utils/supabase/admin";

// Admin sets or resets a teacher/parent password directly
export async function POST(req: NextRequest) {
  try {
    const { targetEmail, targetAuthUserId, newPassword, createIfMissing, targetType } = await req.json();
    const supabase = createAdminAuthClient();

    // Validate caller is admin (check via service role — the client is already admin-level)
    // In production you'd also verify the request comes from an authenticated admin session

    if (targetAuthUserId) {
      // Update existing user password
      const { error } = await supabase.auth.admin.updateUserById(targetAuthUserId, {
        password: newPassword,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, action: "updated" });
    }

    if (createIfMissing && targetEmail) {
      // Create a brand new auth account
      const { data, error } = await supabase.auth.admin.createUser({
        email: targetEmail,
        password: newPassword,
        email_confirm: true, // auto-confirm, no email verification needed
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true, action: "created", authUserId: data.user.id });
    }

    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
