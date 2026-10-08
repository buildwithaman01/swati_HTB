import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, FileText, IndianRupee, LogOut, GraduationCap } from "lucide-react";

export default async function ParentPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  // Find student by parent auth id
  const { data: student } = await supabase
    .from("students")
    .select("id, full_name, class_studying, parent_name, enrollment_status")
    .eq("parent_auth_user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  // Get active teacher
  const { data: assignment } = await supabase
    .from("assignments")
    .select(`id, subject, teacher:teacher_id(full_name)`)
    .eq("student_id", student.id)
    .eq("status", "active")
    .single();

  const navLinks = [
    { href: "/portal/dashboard", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/portal/sessions", label: "Sessions", icon: <Calendar className="w-4 h-4" /> },
    { href: "/portal/reports", label: "Progress Reports", icon: <FileText className="w-4 h-4" /> },
    { href: "/portal/payments", label: "Payments", icon: <IndianRupee className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0F4C5C] rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F2937]">Swati HTB</p>
              <p className="text-xs text-neutral-400">Parent Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-[#1F2937]">{student.full_name}</p>
              <p className="text-xs text-neutral-400">Class {student.class_studying} • {student.enrollment_status}</p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button className="text-neutral-500 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Teacher Banner */}
      {assignment && (
        <div className="bg-[#0F4C5C] text-white text-center py-2 px-4 text-xs">
          Current Teacher: <strong>{(assignment.teacher as any)?.full_name}</strong> · Subject: <strong>{assignment.subject}</strong>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-52 shrink-0">
            <nav className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-neutral-600 hover:bg-[#0F4C5C]/5 hover:text-[#0F4C5C] transition-colors border-b border-neutral-100 last:border-0">
                  {link.icon} {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}