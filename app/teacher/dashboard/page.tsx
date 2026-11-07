import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Users,
  IndianRupee,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Calendar,
  GraduationCap,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { TeacherGoogleReviewBanner } from "@/components/promotions/PromotionBanners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/teacher/login");

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;

  if (!resolvedTeacherId) redirect("/teacher/login");

  const adminClient = await createAdminClient();

  // 1. Fetch active assignments with teacher earnings using adminClient
  const { data: assignmentsData } = await adminClient
    .from("assignments")
    .select(`
      id, student_id, monthly_fee, status, teacher_earning, subject,
      student:students ( id, full_name, class_studying, parent_name )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  const assignments = assignmentsData || [];
  const activeStudentsCount = assignments.length;
  const expectedMonthlyEarnings = assignments.reduce((acc, curr) => {
    const fee = Number(curr.monthly_fee) || 0;
    const earning = curr.teacher_earning !== null && curr.teacher_earning !== undefined
      ? Number(curr.teacher_earning)
      : Math.round(fee * 0.75);
    return acc + earning;
  }, 0);

  // 2. Fetch Payouts (Commissions)
  const { data: payouts } = await adminClient
    .from("commissions")
    .select("*")
    .eq("teacher_id", resolvedTeacherId)
    .order("created_at", { ascending: false })
    .limit(3);

  // 3. Fetch recent sessions this month
  const now = new Date();
  const startOfMonthStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const { count: sessionCountThisMonth } = await adminClient
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", resolvedTeacherId)
    .gte("session_date", startOfMonthStr);

  // 4. Fetch total tests & progress evaluations conducted
  const { count: totalTestsCount } = await adminClient
    .from("progress_reports")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", resolvedTeacherId);

  const isVerified = teacher?.verification_status === "approved";

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">
            Welcome Back, {teacher.full_name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Here is your teaching performance, active students, and tuition revenue summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher/dashboard/tests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B192C] hover:bg-[#1E3E62] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-[#E5A93C]" />
            Record Test
          </Link>
          <Link
            href="/teacher/dashboard/id-card"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3E62] bg-white hover:bg-[#F9F8F5] border border-[#E8E6DF] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <CreditCard className="w-4 h-4 text-[#E5A93C]" />
            ID Badge
          </Link>
        </div>
      </div>

      {!isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-center">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-sm">Faculty Profile Verification In Progress</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Your credentials are being reviewed by the Swati HTB verification desk. You will receive active student assignments once verified.
            </p>
          </div>
          <Link
            href="/teacher/dashboard/profile"
            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors shrink-0"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Prominent Google Reviews & Social Tuition Promotion Banner */}
      <TeacherGoogleReviewBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-start gap-4">
          <div className="w-11 h-11 bg-[#0B192C] text-white rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">Active Students</p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">{activeStudentsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-start gap-4">
          <div className="w-11 h-11 bg-[#1E3E62] text-white rounded-2xl flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">Sessions Logged</p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">{sessionCountThisMonth || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-start gap-4">
          <div className="w-11 h-11 bg-[#F9F8F5] text-[#0B192C] border border-[#E8E6DF] rounded-2xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">Tests Conducted</p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">{totalTestsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-start gap-4">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">Expected Payout</p>
            <p className="text-2xl font-bold font-serif text-emerald-800 mt-0.5">₹{expectedMonthlyEarnings}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout History */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E6DF] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E8E6DF] flex justify-between items-center bg-[#F9F8F5]">
              <h2 className="font-bold font-serif text-[#0B192C]">Recent Payouts</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6578]">Bureau Settlements</span>
            </div>
            {(!payouts || payouts.length === 0) ? (
              <div className="p-10 text-center text-[#5A6578]">
                <Clock className="w-8 h-8 text-[#5A6578]/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0B192C]">No payouts recorded yet</p>
                <p className="text-xs mt-1 text-[#5A6578]">Monthly earnings will be credited after student session confirmations.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E6DF]">
                {payouts.map((p) => (
                  <div key={p.id} className="p-5 flex items-center justify-between hover:bg-[#F9F8F5] transition-colors">
                    <div>
                      <p className="font-bold text-[#0B192C] text-sm">{p.month}</p>
                      <p className="text-xs text-[#5A6578] mt-0.5">Gross Fee: ₹{p.gross_amount} (Bureau Commission Applied)</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-sm font-bold text-[#0B192C]">₹{p.teacher_payout}</p>
                      {p.status === "paid" ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Processing
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Assignments Preview */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E6DF] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E8E6DF] flex justify-between items-center bg-[#F9F8F5]">
              <h2 className="font-bold font-serif text-[#0B192C]">Active Tuitions</h2>
              <Link href="/teacher/dashboard/students" className="text-xs font-bold text-[#1E3E62] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {activeStudentsCount === 0 ? (
              <div className="p-10 text-center text-[#5A6578]">
                <Users className="w-8 h-8 text-[#5A6578]/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0B192C]">No active students assigned yet</p>
                <p className="text-xs mt-1 text-[#5A6578]">Keep your preferred Patna localities up-to-date in your Profile to get matched faster.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E6DF]">
                {assignments?.map((asg) => (
                  <div key={asg.id} className="p-5 flex items-center justify-between hover:bg-[#F9F8F5] transition-colors">
                    <div>
                      <h3 className="font-bold text-[#0B192C] text-sm">
                        {(asg.student as any)?.full_name || (asg.students as any)?.full_name || "Enrolled Student"}
                      </h3>
                      <p className="text-xs text-[#5A6578] font-medium mt-0.5">
                        {asg.subject || "All Subjects"}
                        {(asg.student as any)?.class_studying ? ` · Class ${(asg.student as any).class_studying}` : ""}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" /> Active Enrollment
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0B192C]">
                        ₹{asg.teacher_earning !== null && asg.teacher_earning !== undefined ? asg.teacher_earning : Math.round((Number(asg.monthly_fee) || 0) * 0.75)} <span className="text-xs text-[#5A6578] font-normal">/ mo</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
