import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { FileText, Plus, CheckCircle2, Search, ArrowRight, User, Award } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  // Get teacher's assignments
  const adminClient = await createAdminClient();

  // Get teacher's assignments (with flat fallback)
  let assignments: any[] = [];
  const { data: asData, error: asErr } = await adminClient
    .from("assignments")
    .select(`
      id,
      student_id,
      subject,
      student:students (id, full_name, class_studying, parent_name)
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  if (!asErr && asData && asData.length > 0) {
    assignments = asData.map((a: any) => ({
      ...a,
      student: a.student || a.students,
    }));
  } else {
    const { data: flatAs } = await adminClient
      .from("assignments")
      .select("id, student_id, subject, teacher_id, status")
      .eq("teacher_id", resolvedTeacherId)
      .eq("status", "active");

    if (flatAs && flatAs.length > 0) {
      const studentIds = flatAs.map((a: any) => a.student_id).filter(Boolean);
      const { data: stList } = await adminClient
        .from("students")
        .select("id, full_name, class_studying, parent_name")
        .in("id", studentIds);

      const stMap = new Map((stList || []).map((s: any) => [s.id, s]));
      assignments = flatAs.map((a: any) => ({
        ...a,
        student: stMap.get(a.student_id) || null,
      }));
    }
  }

  // Get past reports with robust fallback
  const assignmentIds = assignments.map(a => a.id);
  let reports: any[] = [];
  let repQuery = adminClient.from("progress_reports").select(`
    *,
    assignment:assignments (
      subject,
      student:students (full_name)
    )
  `);

  if (assignmentIds.length > 0) {
    repQuery = repQuery.or(`teacher_id.eq.${resolvedTeacherId},assignment_id.in.(${assignmentIds.join(",")})`);
  } else {
    repQuery = repQuery.eq("teacher_id", resolvedTeacherId);
  }

  const { data: repData, error: repErr } = await repQuery.order("created_at", { ascending: false });
  if (!repErr && repData) {
    reports = repData;
  } else {
    // Resilient flat fallback
    const { data: flatReps } = await adminClient
      .from("progress_reports")
      .select("*")
      .eq("teacher_id", resolvedTeacherId)
      .order("created_at", { ascending: false });
    reports = flatReps || [];
  }

  // Add new report action
  async function submitReport(formData: FormData) {
    "use server";
    try {
      const adminDb = await createAdminClient();
      const assignmentId = String(formData.get("assignment_id") || "");
      if (!assignmentId) return;

      // Resolve student_id & teacher_id from assignment
      const { data: asg } = await adminDb
        .from("assignments")
        .select("teacher_id, student_id")
        .eq("id", assignmentId)
        .maybeSingle();

      const reportMonth = String(formData.get("report_month") || new Date().toISOString().slice(0, 7));
      // Format as date: YYYY-MM-01
      const normalizedMonth = reportMonth.length === 7 ? `${reportMonth}-01` : reportMonth;

      const reportPayload: Record<string, any> = {
        assignment_id: assignmentId,
        teacher_id: asg?.teacher_id || resolvedTeacherId,
        student_id: asg?.student_id,
        report_month: normalizedMonth,
        topics_covered: formData.get("topics_covered") as string,
        strengths: formData.get("strengths") as string,
        areas_of_improvement: formData.get("gap_areas") as string,
        teacher_remarks: formData.get("tutor_message") || "Monthly progress evaluation submitted.",
        sent_to_parent: true,
        sent_at: new Date().toISOString(),
      };

      for (let attempt = 0; attempt < 5; attempt++) {
        const { error: insErr } = await adminDb.from("progress_reports").insert(reportPayload);
        if (!insErr) break;

        const msg = insErr.message || "";
        const missingColMatch = msg.match(/Could not find the '([^']+)' column/i);
        if (missingColMatch) {
          delete reportPayload[missingColMatch[1]];
          continue;
        }
        break;
      }

      revalidatePath("/teacher/dashboard/reports");
      revalidatePath("/portal/reports");
      revalidatePath("/admin/reports");
    } catch (err) {
      console.error("[submitReport error]:", err);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">Progress Reports</h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Submit monthly evaluations and track academic milestones across your tuitions in Patna.
          </p>
        </div>

        <Link
          href="/teacher/dashboard/tests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B192C] hover:bg-[#1E3E62] px-4 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <Award className="w-4 h-4 text-[#E5A93C]" />
          Record Topic Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Col - Create Report Form */}
        <div className="lg:col-span-1 space-y-6">
          <form action={submitReport} className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E6DF]">
            <div className="flex items-center gap-2 mb-6 border-b border-[#E8E6DF] pb-4">
              <Plus className="text-[#E5A93C] w-5 h-5" />
              <h2 className="text-lg font-bold font-serif text-[#0B192C]">New Monthly Evaluation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Select Student</label>
                <select name="assignment_id" required className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C] font-semibold bg-white">
                  <option value="">Choose student...</option>
                  {assignments?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.student?.full_name || a.students?.full_name || 'Student'} ({a.subject || 'All Subjects'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Report Month</label>
                <input type="month" name="report_month" required className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Syllabus / Topics Covered</label>
                <textarea name="topics_covered" rows={2} required className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20]" placeholder="e.g. Chapter 4: Quadratic Equations & Chapter 5: AP" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Student Strengths</label>
                <textarea name="strengths" rows={2} required className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20]" placeholder="What did they excel in this month?" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Areas for Improvement</label>
                <textarea name="gap_areas" rows={2} required className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20]" placeholder="Formulas, calculations, or homework regularity?" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">Tutor Note to Parents</label>
                <textarea name="tutor_message" rows={2} className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20]" placeholder="Guidance for parents at home..." />
              </div>

              <button type="submit" className="w-full bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 mt-4 shadow-sm">
                <CheckCircle2 size={16} className="text-[#E5A93C]" /> Submit Report
              </button>
            </div>
          </form>
        </div>

        {/* Right Col - Past Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E6DF]">
            <h2 className="text-lg font-bold font-serif text-[#0B192C] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E5A93C]" /> Submitted Reports ({reports?.length || 0})
            </h2>

            {(!reports || reports.length === 0) ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-[#5A6578]/30 mx-auto mb-3" />
                <p className="text-[#0B192C] font-bold text-sm">No monthly reports submitted yet.</p>
                <p className="text-xs text-[#5A6578] mt-1">Submit your first monthly report using the form on the left, or record topic tests.</p>
              </div>
            ) : (
              <div className="grid gap-3.5">
                {reports.map((report: any) => (
                  <div key={report.id} className="p-4 border border-[#E8E6DF] rounded-2xl bg-[#F9F8F5]/60 flex justify-between items-center hover:bg-white transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[#0B192C] text-sm">
                          {report.assignment?.student?.full_name || report.student?.full_name || "Enrolled Student"}
                        </p>
                        <span className="text-[10px] font-bold text-[#1E3E62] uppercase tracking-wider bg-white border border-[#E8E6DF] px-2 py-0.5 rounded-md">
                          {report.assignment?.subject || "General"}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6578]">
                        Month: {report.report_month} • Topics: {report.topics_covered?.slice(0, 40)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Report
                      </span>

                      <Link href={`/report/${report.id}`} target="_blank" className="p-2 hover:bg-[#F9F8F5] rounded-lg border border-[#E8E6DF] transition-colors" title="View Report">
                        <ArrowRight className="w-4 h-4 text-[#0B192C]" />
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
