import { createClient, createAdminClient } from "@/utils/supabase/server";
import { FileText, Plus, CheckCircle2, Search, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const adminClient = await createAdminClient();
  const { data: teacher } = await adminClient
    .from("teachers")
    .select("id")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  if (!resolvedTeacherId) return null;

  // Get teacher's assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id,
      subject,
      student:students (full_name, class_studying, parent_name)
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  // Get past reports
  const { data: reports } = await supabase
    .from("progress_reports")
    .select(`
      *,
      assignment:assignments (
        subject,
        student:students (full_name)
      )
    `)
    .in("assignment_id", assignments?.map(a => a.id) || [])
    .order("created_at", { ascending: false });

  // Add new report action
  async function submitReport(formData: FormData) {
    "use server";
    const supabase = await createClient();

    await supabase.from("progress_reports").insert({
      assignment_id: formData.get("assignment_id"),
      report_month: formData.get("report_month"),
      topics_covered: (formData.get("topics_covered") as string).split(",").map(s => s.trim()),
      test_score_before: parseInt(formData.get("test_score_before") as string) || null,
      test_score_after: parseInt(formData.get("test_score_after") as string) || null,
      strengths: formData.get("strengths"),
      gap_areas: formData.get("gap_areas"),
      next_month_plan: formData.get("next_month_plan"),
      tutor_message: formData.get("tutor_message"),
      sent_to_parent: false
    });

    revalidatePath("/teacher/dashboard/reports");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Progress Reports</h1>
        <p className="text-sm text-neutral-500 mt-1">Submit monthly evaluation reports for your students to share with parents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Col - Create Report Form */}
        <div className="lg:col-span-1 space-y-6">
          <form action={submitReport} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60">
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4">
              <Plus className="text-[#0F4C5C] w-5 h-5" />
              <h2 className="text-lg font-bold text-[#1F2937]">New Report</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Select Student</label>
                <select name="assignment_id" required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none">
                  <option value="">Choose student...</option>
                  {assignments?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.student.full_name} ({a.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Report Month</label>
                <input type="month" name="report_month" required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Topics Covered (comma separated)</label>
                <textarea name="topics_covered" rows={2} required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" placeholder="e.g. Algebra, Linear Equations" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Previous Score %</label>
                  <input type="number" name="test_score_before" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" placeholder="e.g. 60" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Current Score %</label>
                  <input type="number" name="test_score_after" className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none" placeholder="e.g. 85" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Student Strengths</label>
                <textarea name="strengths" rows={2} required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" placeholder="What did they do well?" />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Areas for Improvement</label>
                <textarea name="gap_areas" rows={2} required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" placeholder="Where do they struggle?" />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Plan for Next Month</label>
                <textarea name="next_month_plan" rows={2} required className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" placeholder="Topics to cover next..." />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Message to Parent</label>
                <textarea name="tutor_message" rows={2} className="w-full text-sm border border-neutral-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none" placeholder="Optional notes for parent..." />
              </div>

              <button type="submit" className="w-full bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 size={16} /> Submit Report
              </button>
              <p className="text-[10px] text-neutral-400 text-center mt-2">Reports are sent to parents upon admin review.</p>
            </div>
          </form>
        </div>

        {/* Right Col - Past Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0F4C5C]" /> Submitted Reports
            </h2>

            {(!reports || reports.length === 0) ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-500 font-medium text-sm">You haven't submitted any reports yet.</p>
                <p className="text-xs text-neutral-400 mt-1">Submit your first report using the form on the left.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report: any) => (
                  <div key={report.id} className="p-4 border border-neutral-100 rounded-2xl bg-neutral-50/50 flex justify-between items-center hover:bg-neutral-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#1F2937] text-sm">{report.assignment?.student?.full_name}</p>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-white border border-neutral-200 px-2 py-0.5 rounded-md">
                          {report.assignment?.subject}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        Month: {report.report_month} • Topics: {report.topics_covered?.length}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {report.sent_to_parent ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Sent to Parent
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                          Pending Admin
                        </span>
                      )}

                      <Link href={`/report/${report.id}`} target="_blank" className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-neutral-200 transition-colors">
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </Link>
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
