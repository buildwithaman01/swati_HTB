import { createClient } from "@/utils/supabase/server";
import { Users, IndianRupee, ShieldAlert, CheckCircle2 } from "lucide-react";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get teacher ID
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, verification_status, badge_level")
    .eq("email", user.email)
    .single();

  if (!teacher) return null;

  // Get assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, monthly_fee, status, teacher_earning,
      students:student_id ( full_name )
    `)
    .eq("teacher_id", teacher.id)
    .eq("status", "active");

  const activeStudentsCount = assignments?.length || 0;
  const expectedMonthlyEarnings = assignments?.reduce((acc, curr) => acc + (curr.teacher_earning || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Welcome Back!</h1>
        <p className="text-sm text-neutral-500 mt-1">Here's your teaching summary for this month.</p>
      </div>

      {teacher.verification_status !== "approved" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 text-sm">Profile pending verification</h3>
            <p className="text-xs text-amber-700 mt-1">Your profile is currently under review by our team. We will assign you students once your background check is complete.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Active Students</p>
            <p className="text-3xl font-bold text-[#1F2937] mt-1">{activeStudentsCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Expected Earnings (Monthly)</p>
            <p className="text-3xl font-bold text-[#1F2937] mt-1">₹{expectedMonthlyEarnings}</p>
          </div>
        </div>
      </div>

      {/* Current Assignments Preview */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#1F2937]">Current Tuitions</h2>
        </div>
        
        {activeStudentsCount === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <p className="text-sm font-medium">You don't have any active students right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {assignments?.map((asg) => (
              <div key={asg.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <h3 className="font-bold text-[#1F2937]">{asg.students?.full_name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">Status: Active</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">₹{asg.teacher_earning} <span className="text-xs text-neutral-400 font-normal">/ month</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
