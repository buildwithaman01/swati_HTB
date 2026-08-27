import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const provider = String(formData.get("provider"));
  
  if (provider === "google") {
    const supabase = await createClient();
    
    const origin = new URL(request.url).origin;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth/callback?next=/admin/dashboard`,
      },
    });
    
    if (data.url) {
      return NextResponse.redirect(data.url, 301);
    }
  }
  
  return NextResponse.redirect(new URL("/admin/login?message=Provider not supported", request.url), 301);
}