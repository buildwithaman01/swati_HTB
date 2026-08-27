import { createClient } from "@/utils/supabase/server";
import { BookOpen, Clock, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  // Get teacher profile
  const { data: teacher } = await supabase
    .from("teachers")
    .select("*, assignments(*)")
    .eq("auth_user_id", user.id)
    .single();

  if (!teacher) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center">
        <h2 className="text-xl font-bold text-[#1F2937]">Profile Not Found</h2>
        <p className="text-[#1F2937]/60 mt-2">Your email isn't linked to an approved teacher profile.</p>
      </div>
    );
  }

  const activeAssignments = (teacher.assignments || []).filter((a: any) => a.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Welcome, {teacher.full_name.split(' ')[0]}</h1>
          <p className="text-[#1F2937]/60 mt-1">Here is your teaching summary for {new Date().toLocaleString('default', { month: 'long' })}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${teacher.verification_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {teacher.verification_status === 'approved' ? '✅ Verified Profile' : '⏳ Pending Approval'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Students" value={activeAssignments.length} icon={<BookOpen size={24} />} color="text-[#0F4C5C]" bg="bg-[#0F4C5C]/10" />
        <StatCard title="Classes this month" value={0} icon={<Clock size={24} />} color="text-amber-600" bg="bg-amber-100" />
        <StatCard title="Est. Earnings" value="₹0" icon={<CreditCard size={24} />} color="text-emerald-600" bg="bg-emerald-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionLink href="/portal/sessions" title="Log a Class" desc="Record attendance and topics covered" icon={<Clock size={20} />} />
            <ActionLink href="/portal/students" title="My Students" desc="View student details and progress" icon={<BookOpen size={20} />} />
            <ActionLink href={`/teacher/${teacher.profile_slug}`} title="View Public Profile" desc="See how parents view your profile" icon={<ChevronRight size={20} />} target="_blank" />
          </div>
        </div>

        {/* Recent Classes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Recent Classes</h2>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium text-sm">No classes logged yet.</p>
            <Link href="/portal/sessions" className="text-[#0F4C5C] text-sm font-semibold hover:underline mt-2 inline-block">
              Log your first class
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: { title: string; value: string | number; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1F2937]/50 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-[#1F2937] mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionLink({ href, title, desc, icon, target }: { href: string, title: string, desc: string, icon: React.ReactNode, target?: string }) {
  return (
    <Link href={href} target={target} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200 group">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-[#0F4C5C]/5 text-[#0F4C5C] group-hover:bg-[#0F4C5C] group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-[#1F2937] text-sm">{title}</h3>
          <p className="text-xs text-[#1F2937]/60">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#0F4C5C] transition-colors" />
    </Link>
  );
}