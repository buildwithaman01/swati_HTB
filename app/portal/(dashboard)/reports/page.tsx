import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FileText, TrendingUp, TrendingDown } from "lucide-react";

export default async function ParentReports() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: student } = await supabase
    .from("students").select("id, full_name")
    .or(`parent_email.eq.${user.email},email.eq.${user.email},parent_auth_user_id.eq.${user.id}`).single();

  if (!student) redirect("/portal/login");

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id")
    .eq("student_id", student.id);

  const assignmentIds = assignments?.map(a => a.id) || [];

  const { data: reports } = await supabase
    .from("progress_reports")
    .select("*")
    .in("assignment_id", assignmentIds)
    .eq("sent_to_parent", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Progress Reports</h1>
        <p className="text-sm text-neutral-500 mt-1">{reports?.length || 0} reports available</p>
      </div>

      {(!reports || reports.length === 0) ? (
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-16 text-center">
          <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 font-medium text-sm">No progress reports yet.</p>
          <p className="text-xs text-neutral-400 mt-1">Your teacher will submit monthly reports for admin approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const improved = report.test_score_after != null && report.test_score_before != null && report.test_score_after > report.test_score_before;
            return (
              <div key={report.id} className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#1F2937] text-lg">{report.report_month}</h2>
                  {report.test_score_before != null && report.test_score_after != null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${improved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {improved ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {improved ? "Improving" : "Needs Focus"}
                    </div>
                  )}
                </div>

                {(report.test_score_before != null || report.test_score_after != null) && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-neutral-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-neutral-600">{report.test_score_before ?? "—"}%</p>
                      <p className="text-xs text-neutral-400 mt-1">Score at Start</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{report.test_score_after ?? "—"}%</p>
                      <p className="text-xs text-neutral-400 mt-1">Score at End</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {report.strengths && (
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">💪 Strengths</p>
                      <p className="text-sm text-neutral-700">{report.strengths}</p>
                    </div>
                  )}
                  {report.gap_areas && (
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">📌 Areas to Improve</p>
                      <p className="text-sm text-neutral-700">{report.gap_areas}</p>
                    </div>
                  )}
                  {report.next_month_plan && (
                    <div>
                      <p className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wide mb-1">📅 Next Month Plan</p>
                      <p className="text-sm text-neutral-700">{report.next_month_plan}</p>
                    </div>
                  )}
                  {report.tutor_message && (
                    <div className="bg-[#0F4C5C]/5 rounded-xl p-4 mt-2">
                      <p className="text-xs font-bold text-[#0F4C5C] mb-1">💬 Teacher's Message</p>
                      <p className="text-sm text-neutral-700 italic">"{report.tutor_message}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
