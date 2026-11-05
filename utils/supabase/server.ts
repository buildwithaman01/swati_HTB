import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// For operations that bypass RLS (like the admin dashboard fetching data & API handlers)
export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dtbhafjzoybnmqgxdwoo.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Robust helper to load a teacher's profile for the logged-in auth user.
 * Prevents PGRST116 (multiple rows) crashes and auto-heals unlinked auth_user_id.
 */
export async function getTeacherProfile(userId: string, email?: string | null) {
  const adminClient = await createAdminClient();

  // 1. First priority: match by auth_user_id
  const { data: byAuth } = await adminClient
    .from("teachers")
    .select("*")
    .eq("auth_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (byAuth && byAuth.length > 0) {
    return byAuth[0];
  }

  // 2. Second priority: match by email (case-insensitive)
  if (email && email.trim()) {
    const cleanEmail = email.trim();
    const { data: byEmail } = await adminClient
      .from("teachers")
      .select("*")
      .ilike("email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1);

    if (byEmail && byEmail.length > 0) {
      const teacher = byEmail[0];
      // Self-heal link in the background
      await adminClient
        .from("teachers")
        .update({ auth_user_id: userId })
        .eq("id", teacher.id);
      return teacher;
    }
  }

  return null;
}

