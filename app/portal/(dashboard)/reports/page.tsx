import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FileText, TrendingUp, TrendingDown, Award, ExternalLink, Calendar } from "lucide-react";

export default async function ParentReports() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const adminClient = await createAdminClient();

  const { data: student } = await adminClient
    .from("students")
    .select("id, full_name")
    .or(`parent_email.ilike.${user.email},email.ilike.${user.email},parent_auth_user_id.eq.${user.id}`)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  const { data: assignments } = await adminClient
    .from("assignments")
    .select("id")
    .eq("student_id", student.id);

  const assignmentIds = assignments?.map((a) => a.id) || [];

  // Fetch both assignment-linked reports and directly student-linked reports
  let query = adminClient
    .from("progress_reports")
    .select("*")
    .eq("sent_to_parent", true);

  if (assignmentIds.length > 0) {
    query = query.or(`student_id.eq.${student.id},assignment_id.in.(${assignmentIds.join(",")})`);
  } else {
    query = query.eq("student_id", student.id);
  }

  const { data: reports } = await query.order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Academic Tests & Progress Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Verified performance reports and test marks for <span className="font-semibold text-neutral-800">{student.full_name}</span>.
          </p>
        </div>
        <div className="text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] font-semibold px-3 py-1.5 rounded-full w-fit">
          {reports?.length || 0} Records Published
        </div>
      </div>

      {(!reports || reports.length === 0) ? (
        <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-16 text-center">
          <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 font-semibold text-sm">No test reports or assessments yet.</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            When your home tutor conducts topic tests or compiles monthly evaluations, the marks and remarks will appear right here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const hasExplicitScore = Boolean(report.test_scores);
            const scoreBefore = report.test_score_before;
            const scoreAfter = report.test_score_after;
            const improved = scoreAfter != null && scoreBefore != null && scoreAfter >= scoreBefore;

            // Extract test paper link if embedded in remarks
            const testPaperMatch = (report.teacher_remarks || "").match(/Test Paper Link:\s*(https?:\/\/[^\s|]+)/i);
            const testPaperUrl = testPaperMatch ? testPaperMatch[1] : null;
            const cleanedRemarks = (report.teacher_remarks || "")
              .replace(/Test Paper Link:\s*https?:\/\/[^\s|]+/gi, "")
              .replace(/Remarks:\s*/i, "")
              .replace(/\|\s*$/, "")
              .trim();

            return (
              <div key={report.id} className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#0F4C5C]/10 text-[#0F4C5C] rounded-lg">
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="font-bold text-[#1F2937] text-base sm:text-lg">
                        {report.topics_covered || report.report_month || "Assessment"}
                      </h2>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {report.report_month || new Date(report.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    </div>
                  </div>

                  {hasExplicitScore ? (
                    <div className="bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl text-right">
                      <span className="text-xs text-emerald-700 block font-medium">Test Score</span>
                      <span className="text-base font-extrabold text-emerald-800">{report.test_scores}</span>
                    </div>
                  ) : (scoreBefore != null || scoreAfter != null) ? (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${improved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {improved ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {improved ? "Improving" : "Needs Focus"}
                    </div>
                  ) : null}
                </div>

                {(scoreBefore != null || scoreAfter != null) && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-neutral-50 rounded-xl p-3.5 text-center border border-neutral-100">
                      <p className="text-2xl font-bold text-neutral-600">{scoreBefore ?? "—"}%</p>
                      <p className="text-xs text-neutral-400 mt-1">Starting Benchmark</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3.5 text-center border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-700">{scoreAfter ?? "—"}%</p>
                      <p className="text-xs text-emerald-600 mt-1">Recent Evaluation</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {report.strengths && (
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-0.5">💪 Strengths & Mastery</p>
                      <p className="text-sm text-neutral-700">{report.strengths}</p>
                    </div>
                  )}

                  {(report.gap_areas || report.areas_of_improvement) && (
                    <div>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-0.5">📌 Target Revision Areas</p>
                      <p className="text-sm text-neutral-700">{report.gap_areas || report.areas_of_improvement}</p>
                    </div>
                  )}

                  {report.next_month_plan && (
                    <div>
                      <p className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wide mb-0.5">📅 Upcoming Roadmap</p>
                      <p className="text-sm text-neutral-700">{report.next_month_plan}</p>
                    </div>
                  )}

                  {(cleanedRemarks || report.tutor_message) && (
                    <div className="bg-[#0F4C5C]/5 border border-[#0F4C5C]/10 rounded-xl p-3.5">
                      <p className="text-xs font-bold text-[#0F4C5C] mb-1">💬 Teacher's Feedback</p>
                      <p className="text-sm text-neutral-700 italic">
                        "{cleanedRemarks || report.tutor_message}"
                      </p>
                    </div>
                  )}

                  {testPaperUrl && (
                    <div className="pt-2">
                      <a
                        href={testPaperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C5C] hover:underline bg-[#0F4C5C]/10 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Attached Question Paper / Answer Sheet
                      </a>
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
