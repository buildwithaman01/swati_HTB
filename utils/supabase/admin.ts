import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key — full admin access, bypasses RLS
// ONLY use this in server-side code (API routes, Server Actions)
export function createAdminAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dtbhafjzoybnmqgxdwoo.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createClient(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
