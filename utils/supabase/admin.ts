import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key — full admin access, bypasses RLS
// ONLY use this in server-side code (API routes, Server Actions)
export function createAdminAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
