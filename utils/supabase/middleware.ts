import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  const isPortal = request.nextUrl.pathname.startsWith('/portal');
  const isAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname.endsWith('/login');

  if (!user && (isPortal || isAdmin) && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = isPortal ? '/portal/login' : '/admin/login';
    return NextResponse.redirect(url);
  }

  // Basic role check: if admin route, ensure user is an authorized admin.
  if (user && isAdmin && !isLoginPage) {
    const defaultAdmins = [
      "swatihometuitionbureau@gmail.com",
      "swatihometuitionbeauro@gmail.com",
      "amansingh.dev.ai.ml@gmail.com",
      "aman.kalpra.11@gmail.com",
      "buildwithaman01@gmail.com",
      "contact@pehchanly.com",
    ];

    const envAdmins = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const authorizedAdminEmails = Array.from(new Set([...defaultAdmins, ...envAdmins]));

    if (!authorizedAdminEmails.includes(user.email?.toLowerCase() || "")) {
      // User is logged in but not an authorized admin.
      // Redirect to admin login with clear message WITHOUT destroying their active teacher/parent session.
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("message", `Unauthorized: ${user.email} does not have Admin access.`);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}