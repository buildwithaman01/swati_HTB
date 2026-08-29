import { createAdminClient } from "@/utils/supabase/server";
import { Users, UserPlus, CreditCard, AlertCircle, BookOpen, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createAdminClient();

  const [
    { count: totalTeachers },
    { count: pendingTeachers },
    { count: approvedTeachers },
    { count: activeStudents },
    { count: totalStudents },
    { count: activeAssignments },
    { data: recentTeachers },
    { data: recentStudents },
    { data: payments },
  ] = await Promise.all([
    supabase.from("teachers").select("*", { count: "exact", head: true }),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("verification_status", "approved"),
    supabase.from("students").select("*", { count: "exact", head: true }).eq("enrollment_status", "enrolled"),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("assignments").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("id, full_name, teacher_id, verification_status, locality, badge_level, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("students").select("id, full_name, student_id, enrollment_status, class_studying, parent_name, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("payments").select("amount, payment_month, status").eq("payment_month", new Date().toISOString().slice(0, 7)),
  ]);

  const monthlyRevenue = payments?.filter(p => p.status === "received").reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    suspended: "bg-gray-100 text-gray-500",
    enquiry: "bg-purple-100 text-purple-700",
    demo: "bg-blue-100 text-blue-700",
    enrolled: "bg-emerald-100 text-emerald-700",
    paused: "bg-gray-100 text-gray-500",
    dropped: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Overview</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome back — here's your system at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Teachers" value={totalTeachers || 0} sub={`${approvedTeachers || 0} approved`} icon={<Users size={22} />} color="text-blue-600" bg="bg-blue-100" href="/admin/teachers" />
        <StatCard title="Pending Approvals" value={pendingTeachers || 0} sub="Need your action" icon={<AlertCircle size={22} />} color="text-amber-600" bg="bg-amber-100" href="/admin/teachers" alert={!!pendingTeachers} />
        <StatCard title="Active Assignments" value={activeAssignments || 0} sub="Ongoing sessions" icon={<BookOpen size={22} />} color="text-indigo-600" bg="bg-indigo-100" href="/admin/assignments" />
        <StatCard title="Enrolled Students" value={activeStudents || 0} sub={`of ${totalStudents || 0} total`} icon={<UserPlus size={22} />} color="text-emerald-600" bg="bg-emerald-100" href="/admin/students" />
        <StatCard title="Revenue This Month" value={`₹${monthlyRevenue.toLocaleString("en-IN")}`} sub="Payments received" icon={<IndianRupee size={22} />} color="text-purple-600" bg="bg-purple-100" href="/admin/finance" />
        <StatCard title="Pending Payouts" value="Check →" sub="Teacher commissions" icon={<CreditCard size={22} />} color="text-rose-600" bg="bg-rose-100" href="/admin/finance" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teachers */}
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="font-bold text-[#1F2937]">Recent Teachers</h2>
            <Link href="/admin/teachers" className="text-xs text-[#0F4C5C] font-semibold hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentTeachers?.length === 0 && (
              <p className="text-center py-8 text-neutral-400 text-sm">No teachers yet</p>
            )}
            {recentTeachers?.map(t => (
              <div key={t.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {t.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1F2937]">{t.full_name}</p>
                    <p className="text-xs text-neutral-400 font-mono">{t.teacher_id} · {t.locality || "—"}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[t.verification_status] || "bg-gray-100 text-gray-500"}`}>
                  {t.verification_status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="font-bold text-[#1F2937]">Recent Students</h2>
            <Link href="/admin/students" className="text-xs text-[#0F4C5C] font-semibold hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentStudents?.length === 0 && (
              <p className="text-center py-8 text-neutral-400 text-sm">No students yet</p>
            )}
            {recentStudents?.map(s => (
              <div key={s.id} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {s.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1F2937]">{s.full_name}</p>
                    <p className="text-xs text-neutral-400">{s.student_id} · Class {s.class_studying || "?"} · {s.parent_name}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.enrollment_status] || "bg-gray-100 text-gray-500"}`}>
                  {s.enrollment_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title, value, sub, icon, color, bg, href, alert = false
}: {
  title: string; value: string | number; sub: string;
  icon: React.ReactNode; color: string; bg: string;
  href?: string; alert?: boolean;
}) {
  const inner = (
    <div className={`bg-white p-5 rounded-3xl shadow-sm border transition-shadow hover:shadow-md ${alert ? "border-amber-300 bg-amber-50/30" : "border-neutral-200/60"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>{icon}</div>
        <p className="text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide leading-tight">{title}</p>
      </div>
      <p className="text-3xl font-bold text-[#1F2937]">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{sub}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}