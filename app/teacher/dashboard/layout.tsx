import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  User,
  FileText,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/teacher/login");
  }

  // Get teacher profile via getTeacherProfile: resilient lookup, avoids duplicate-row crashes, and self-heals auth_user_id
  const teacher = await getTeacherProfile(user.id, user.email);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F5] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-[#E8E6DF] text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold font-serif text-[#0B192C]">Profile Not Found</h1>
          <p className="text-sm text-[#5A6578] mt-2">
            We couldn't find a teacher profile linked to <strong>{user.email}</strong>.
            If you recently applied, please wait for admin approval.
          </p>
          <form action="/api/auth/logout" method="POST" className="mt-6">
            <button className="text-sm font-bold text-[#0B192C] hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isVerified = teacher.verification_status === "approved";

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E8E6DF] shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#E8E6DF]">
            <Link href="/" className="font-serif text-2xl font-bold text-[#0B192C] tracking-tight block">
              Swati<span className="text-[#E5A93C]">HTB</span>
            </Link>
            <p className="text-[10px] uppercase font-bold text-[#5A6578] tracking-widest mt-0.5">
              Faculty Portal · Patna
            </p>

            {/* Teacher Badge Card */}
            <div className="mt-4 flex items-center gap-3 p-2.5 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF]">
              <div className="w-11 h-11 rounded-xl bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden relative border border-[#E5A93C]">
                {teacher.profile_photo_url ? (
                  <img
                    src={teacher.profile_photo_url}
                    alt={teacher.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  teacher.full_name.charAt(0)
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-[#0B192C] truncate">
                    {teacher.full_name}
                  </p>
                  {isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[#1E3E62] font-mono truncate font-semibold">
                  {teacher.teacher_id}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              href="/teacher/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#1E3E62] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#E5A93C]" /> Overview
            </Link>
            <Link
              href="/teacher/dashboard/students"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <BookOpen className="w-4 h-4" /> My Students
            </Link>
            <Link
              href="/teacher/dashboard/sessions"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <Calendar className="w-4 h-4" /> Log Session
            </Link>
            <Link
              href="/teacher/dashboard/tests"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0B192C] bg-[#F9F8F5] border border-[#E8E6DF] transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-[#E5A93C]" /> Tests & Marks
            </Link>
            <Link
              href="/teacher/dashboard/reports"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <FileText className="w-4 h-4" /> Progress Reports
            </Link>
            <Link
              href="/teacher/dashboard/id-card"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <CreditCard className="w-4 h-4 text-[#E5A93C]" /> ID Card & QR
            </Link>
            <Link
              href="/teacher/dashboard/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] hover:text-[#0B192C] transition-colors"
            >
              <User className="w-4 h-4" /> Faculty Profile
            </Link>
          </nav>
        </div>

        {/* Footer / Sign Out */}
        <div className="p-4 border-t border-[#E8E6DF]">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
