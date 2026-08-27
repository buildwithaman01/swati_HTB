import { createAdminClient } from "@/utils/supabase/server";
import { Users, UserPlus, CreditCard, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createAdminClient();
  
  // Basic stats queries
  const [{ count: totalTeachers }, { count: pendingTeachers }, { count: activeStudents }] = await Promise.all([
    supabase.from("teachers").select("*", { count: "exact", head: true }),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    supabase.from("students").select("*", { count: "exact", head: true }).eq("enrollment_status", "enrolled"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Teachers" value={totalTeachers || 0} icon={<Users size={24} />} color="text-blue-600" bg="bg-blue-100" />
        <StatCard title="Pending Approvals" value={pendingTeachers || 0} icon={<AlertCircle size={24} />} color="text-amber-600" bg="bg-amber-100" />
        <StatCard title="Active Students" value={activeStudents || 0} icon={<UserPlus size={24} />} color="text-emerald-600" bg="bg-emerald-100" />
        <StatCard title="Monthly Revenue" value="₹0" icon={<CreditCard size={24} />} color="text-purple-600" bg="bg-purple-100" />
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