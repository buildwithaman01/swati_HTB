import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // Just send them back to the main site
  return NextResponse.redirect(new URL("/", request.url), 301);
}