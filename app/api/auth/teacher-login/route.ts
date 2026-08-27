import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/portal/login?message=${encodeURIComponent(error.message)}`, request.url),
      301
    );
  }

  return NextResponse.redirect(new URL("/portal/dashboard", request.url), 301);
}