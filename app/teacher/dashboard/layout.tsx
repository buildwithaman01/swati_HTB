import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Calendar, LayoutDashboard, LogOut, User, FileText, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/teacher/login");
  }

  // Get teacher profile via adminClient to bypass RLS and self-heal auth_user_id
  const adminClient = await createAdminClient();
  let { data: teacher } = await adminClient
    .from("teachers")
    .select("*")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  // Self-heal: ensure auth_user_id is linked
  if (teacher && teacher.auth_user_id !== user.id) {
    await adminClient
      .from("teachers")
      .update({ auth_user_id: user.id })
      .eq("id", teacher.id);
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold font-serif text-[#1F2937]">Profile Not Found</h1>
          <p className="text-sm text-neutral-500 mt-2">
            We couldn't find a teacher profile linked to <strong>{user.email}</strong>.
            If you recently applied, please wait for admin approval.
          </p>
          <form action="/api/auth/logout" method="POST" className="mt-6">
            <button className="text-sm font-bold text-[#0F4C5C] hover:underline">Sign out</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200/60 shrink-0">
        <div className="p-6 border-b border-neutral-100">
          <Link href="/" className="font-serif text-2xl font-bold text-[#1F2937] tracking-tight">
            Swati<span className="text-[#0F4C5C]">HTB</span>
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {teacher.profile_photo_url ? <img src={teacher.profile_photo_url} className="w-full h-full rounded-full object-cover" /> : teacher.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#1F2937] truncate">{teacher.full_name}</p>
              <p className="text-xs text-neutral-500 font-mono truncate">{teacher.teacher_id}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link href="/teacher/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 text-[#1F2937]">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </Link>
          <Link href="/teacher/dashboard/students" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <BookOpen className="w-4 h-4" /> My Students
          </Link>
          <Link href="/teacher/dashboard/sessions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <Calendar className="w-4 h-4" /> Log Session
          </Link>
          <Link href="/teacher/dashboard/tests" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <GraduationCap className="w-4 h-4" /> Tests & Marks
          </Link>
          <Link href="/teacher/dashboard/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <FileText className="w-4 h-4" /> Reports
          </Link>
          <Link href="/teacher/dashboard/id-card" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <User className="w-4 h-4" /> ID Card & QR
          </Link>
          <Link href="/teacher/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#1F2937] transition-colors">
            <User className="w-4 h-4" /> My Profile
          </Link>

          <div className="pt-4 mt-4 border-t border-neutral-100">
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
