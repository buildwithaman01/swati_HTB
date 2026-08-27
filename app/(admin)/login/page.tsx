import Link from "next/link";
import { Shield } from "lucide-react";

export default async function AdminLogin({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0F4C5C] flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-[#1F2937] mb-2">Admin Control Panel</h1>
        <p className="text-center text-[#1F2937]/60 text-sm mb-8">Authorized personnel only</p>

        {searchParams?.message && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
            {searchParams.message}
          </div>
        )}

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
            className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            Access Dashboard
          </button>
        </form>

        <p className="text-center text-xs text-[#1F2937]/40 mt-8">
          <Link href="/" className="hover:underline">Return to main website</Link>
        </p>
      </div>
    </div>
  );
}