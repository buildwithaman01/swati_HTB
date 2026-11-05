import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Users, IndianRupee, ShieldAlert, CheckCircle2, Clock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const adminClient = await createAdminClient();
  const { data: teacher } = await adminClient
    .from("teachers")
    .select("id, verification_status, badge_level")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  const resolvedTeacherId = teacher?.id;

  if (!resolvedTeacherId) return null;

  // 2. Fetch assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, monthly_fee, status, teacher_earning,
      students:student_id ( full_name )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  const activeStudentsCount = assignments?.length || 0;
  const expectedMonthlyEarnings = assignments?.reduce((acc, curr) => acc + (curr.teacher_earning || 0), 0) || 0;

  // 3. Fetch Payouts (Commissions)
  const { data: payouts } = await supabase
    .from("commissions")
    .select("*")
    .eq("teacher_id", resolvedTeacherId)
    .order("created_at", { ascending: false })
    .limit(3);

  // 4. Fetch recent sessions
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: sessionCountThisMonth } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", resolvedTeacherId)
    .gte("session_date", startOfMonth.toISOString());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Welcome Back!</h1>
        <p className="text-sm text-neutral-500 mt-1">Here's your teaching summary for this month.</p>
      </div>

      {(teacher?.verification_status !== "approved") && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 text-sm">Profile pending verification</h3>
            <p className="text-xs text-amber-700 mt-1">Your profile is currently under review by our team. We will assign you students once your background check is complete.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60 flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Students</p>
            <p className="text-2xl font-bold text-[#1F2937] mt-1">{activeStudentsCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sessions This Month</p>
            <p className="text-2xl font-bold text-[#1F2937] mt-1">{sessionCountThisMonth || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/60 flex items-start gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Expected Earnings</p>
            <p className="text-2xl font-bold text-[#1F2937] mt-1">₹{expectedMonthlyEarnings}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout History */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden h-full">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <h2 className="font-bold text-[#1F2937]">Recent Payouts</h2>
          </div>
          {(!payouts || payouts.length === 0) ? (
            <div className="p-8 text-center text-neutral-500">
              <Clock className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
              <p className="text-sm font-medium">No payouts yet.</p>
              <p className="text-xs mt-1">Payouts appear here when parents pay fees.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {payouts.map((p) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div>
                    <p className="font-bold text-[#1F2937] text-sm">{p.month}</p>
                    <p className="text-xs text-neutral-500 mt-1">Gross Fee: ₹{p.gross_amount} (25% Bureau Fee applied)</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="text-sm font-bold text-[#1F2937]">₹{p.teacher_payout}</p>
                    {p.status === "paid" ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Assignments Preview */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden h-full">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <h2 className="font-bold text-[#1F2937]">Active Tuitions</h2>
          </div>
          {activeStudentsCount === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <Users className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
              <p className="text-sm font-medium">No active students right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {assignments?.map((asg) => (
                <div key={asg.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-sm">{asg.students?.full_name}</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">● Active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1F2937]">₹{asg.teacher_earning} <span className="text-xs text-neutral-400 font-normal">/ month</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
