import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Calendar, FileText, IndianRupee, LogOut, GraduationCap, User, Phone, MessageCircle, Headphones } from "lucide-react";
import { ParentPortalSidebarPromo } from "@/components/promotions/PromotionBanners";
import { CANONICAL_LINKS } from "@/lib/constants";
import { formatSupportWhatsAppUrl } from "@/lib/whatsapp";

export default async function ParentPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  // Find student by parent auth id or email with resilient admin fallback
  const adminClient = await createAdminClient();
  let { data: student } = await adminClient
    .from("students")
    .select("id, full_name, class_studying, parent_name, enrollment_status, parent_auth_user_id, internal_notes")
    .or(`parent_auth_user_id.eq.${user.id},parent_email.ilike.${user.email},email.ilike.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  // Auto-heal parent_auth_user_id if missing
  if (!student.parent_auth_user_id) {
    await adminClient.from("students").update({ parent_auth_user_id: user.id }).eq("id", student.id);
  }

  // Get all active assignments and assigned teachers
  const { data: assignments } = await adminClient
    .from("assignments")
    .select(`id, subject, teacher:teachers(id, full_name, phone, whatsapp)`)
    .eq("student_id", student.id)
    .eq("status", "active");

  const activeAssignments = assignments || [];

  const navLinks = [
    { href: "/portal/dashboard", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/portal/sessions", label: "Sessions", icon: <Calendar className="w-4 h-4" /> },
    { href: "/portal/reports", label: "Progress & Tests", icon: <FileText className="w-4 h-4" /> },
    { href: "/portal/profile", label: "Student Profile", icon: <User className="w-4 h-4" /> },
    { href: "/portal/payments", label: "Payments", icon: <IndianRupee className="w-4 h-4" /> },
  ];

  const supportWhatsAppUrl = formatSupportWhatsAppUrl(
    `Hello Swati HTB Support, I am parent of ${student.full_name} (Class ${student.class_studying || ""}). I need assistance.`
  );

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
            <a
              href={supportWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Helpdesk</span>
            </a>
            <form action="/api/auth/logout" method="POST">
              <button className="text-neutral-500 hover:text-red-600 transition-colors p-1" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Teacher Banner */}
      {activeAssignments.length > 0 && (
        <div className="bg-[#0F4C5C] text-white text-center py-2 px-4 text-xs">
          {activeAssignments.length === 1 ? (
            <span>
              Current Teacher: <strong>{(activeAssignments[0].teacher as any)?.full_name || "Assigned Tutor"}</strong> · Subject: <strong>{activeAssignments[0].subject}</strong>
            </span>
          ) : (
            <span>
              Assigned Teachers:{" "}
              {activeAssignments.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && " • "}
                  <strong>{(a.teacher as any)?.full_name}</strong> ({a.subject})
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-52 shrink-0 space-y-4">
            <nav className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-neutral-600 hover:bg-[#0F4C5C]/5 hover:text-[#0F4C5C] transition-colors border-b border-neutral-100 last:border-0">
                  {link.icon} {link.label}
                </Link>
              ))}
            </nav>

            <ParentPortalSidebarPromo />

            {/* Bureau Support & Helpline Widget */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/60 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">
                <Headphones className="w-4 h-4 text-[#0F4C5C]" />
                <span>Bureau Support</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Need to reschedule, report an issue, or change tuition timings?
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href={supportWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Help</span>
                </a>
                <a
                  href={`tel:${CANONICAL_LINKS.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-[#1F2937] text-xs font-bold py-2 px-3 rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0F4C5C]" />
                  <span>{CANONICAL_LINKS.displayPhone}</span>
                </a>
              </div>
              <p className="text-[10px] text-center text-neutral-400">
                Patna Bureau Desk · 7 Days Support
              </p>
            </div>
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
