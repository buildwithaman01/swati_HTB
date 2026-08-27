import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  
  const supabase = await createClient();
  const origin = new URL(request.url).origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback?next=/portal/dashboard`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/portal/login?message=${encodeURIComponent(error.message)}`, request.url),
      301
    );
  }

  return NextResponse.redirect(
    new URL(`/portal/login?success=${encodeURIComponent("Check your email for the magic link!")}`, request.url),
    301
  );
}