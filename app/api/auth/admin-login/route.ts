import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/login?message=${encodeURIComponent(error.message)}`, request.url),
      303
    );
  }

  // After successful login, redirect to admin dashboard
  return NextResponse.redirect(new URL("/admin/dashboard", request.url), 303);
}
