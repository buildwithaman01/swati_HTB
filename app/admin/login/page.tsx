import Link from "next/link";
import { Shield } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const sp = await searchParams;
  const message = sp?.message;

  // If already logged in, redirect
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0F4C5C] flex items-center justify-center text-white shadow-md">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-[#1F2937] mb-2 font-serif">Admin Control Panel</h1>
        <p className="text-center text-[#1F2937]/60 text-sm mb-8">Authorized personnel only</p>

        {message && (
          <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 text-center font-medium">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* Google OAuth */}
          <form action="/api/auth/admin-oauth" method="post">
            <input type="hidden" name="provider" value="google" />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-[#1F2937] font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 52.749 L -8.284 52.749 C -8.574 53.879 -9.254 54.819 -10.204 55.449 L -10.204 57.779 L -6.324 57.779 C -4.054 55.699 -2.764 52.549 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.279 L -10.204 57.949 C -11.274 58.669 -12.654 59.109 -14.754 59.109 C -18.804 59.109 -22.254 56.379 -23.494 52.709 L -27.494 52.709 L -27.494 55.819 C -25.134 60.509 -20.314 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -23.494 52.709 C -23.814 51.759 -24.004 50.749 -24.004 49.709 C -24.004 48.669 -23.814 47.659 -23.494 46.709 L -23.494 43.599 L -27.494 43.599 C -28.324 45.249 -28.804 47.109 -28.804 49.059 C -28.804 51.009 -28.324 52.869 -27.494 54.519 L -23.494 52.709 Z"/><path fill="#EA4335" d="M -14.754 40.179 C -12.984 40.179 -11.404 40.789 -10.154 41.989 L -6.744 38.579 C -8.804 36.659 -11.514 35.509 -14.754 35.509 C -20.314 35.509 -25.134 38.239 -27.494 42.929 L -23.494 46.039 C -22.254 42.369 -18.804 39.639 -14.754 40.179 Z"/></g></svg>
              Continue with Google
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs font-semibold uppercase tracking-wider">Or Password</span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          {/* Password Login */}
          <form action="/api/auth/admin-login" method="post" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1" htmlFor="email">Admin Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="admin@swatihometuition.in"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1" htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-3 rounded-xl transition-colors shadow-md"
            >
              Access Dashboard
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#1F2937]/40 mt-8">
          <Link href="/" className="hover:underline">Return to main website</Link>
        </p>
      </div>
    </div>
  );
}