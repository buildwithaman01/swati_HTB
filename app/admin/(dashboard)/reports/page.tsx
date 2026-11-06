import { createAdminClient } from "@/utils/supabase/server";
import { FileText, CheckCircle2, ArrowRight, Eye, Send, Star, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReportsPage() {
  const supabase = await createAdminClient();

  let reportsList: any[] = [];

  try {
    const { data, error } = await supabase
      .from("progress_reports")
      .select(`
        *,
        teacher:teachers(id, full_name, teacher_id),
        student:students(id, full_name, student_id),
        assignment:assignments (
          id,
          subject,
          teacher:teachers (full_name),
          student:students (full_name)
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      reportsList = data;
    } else {
      // Resilient fallback query if nested assignment join fails
      const { data: flatReports } = await supabase
        .from("progress_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (flatReports && flatReports.length > 0) {
        const studentIds = [...new Set(flatReports.map((r: any) => r.student_id).filter(Boolean))];
        const teacherIds = [...new Set(flatReports.map((r: any) => r.teacher_id).filter(Boolean))];

        const [{ data: students }, { data: teachers }] = await Promise.all([
          studentIds.length > 0
            ? supabase.from("students").select("id, full_name, student_id").in("id", studentIds)
            : Promise.resolve({ data: [] }),
          teacherIds.length > 0
            ? supabase.from("teachers").select("id, full_name, teacher_id").in("id", teacherIds)
            : Promise.resolve({ data: [] }),
        ]);

        const studentMap = new Map((students || []).map((s: any) => [s.id, s]));
        const teacherMap = new Map((teachers || []).map((t: any) => [t.id, t]));

        reportsList = flatReports.map((r: any) => ({
          ...r,
          student: studentMap.get(r.student_id) || null,
          teacher: teacherMap.get(r.teacher_id) || null,
        }));
      }
    }
  } catch (err) {
    console.error("Admin progress reports fetch error:", err);
  }

  async function markAsSent(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    const adminSupabase = await createAdminClient();
    await adminSupabase.from("progress_reports").update({
      sent_to_parent: true,
      sent_at: new Date().toISOString()
    }).eq("id", id);
    
    revalidatePath("/admin/reports");
  }

  const formatReportMonth = (dateStr: string) => {
    if (!dateStr) return "Monthly";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0B192C]">Monthly Progress Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">Review, dispatch, and monitor student academic evaluations submitted by tutors.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white border border-[#E8E6DF] px-3.5 py-2 rounded-xl font-bold text-[#0B192C] shadow-2xs">
            Total Reports: {reportsList.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6DF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F8F5] text-xs uppercase tracking-wider text-[#5A6578] border-b border-[#E8E6DF]">
                <th className="p-4 font-bold">Evaluation Month</th>
                <th className="p-4 font-bold">Student &amp; Subject</th>
                <th className="p-4 font-bold">Educator</th>
                <th className="p-4 font-bold">Assessment / Rating</th>
                <th className="p-4 font-bold">Parent Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {reportsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500 font-sans">
                    <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                    <p className="font-semibold text-[#0B192C]">No progress reports logged yet.</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Teachers submit monthly reports directly from their Educator Portal.</p>
                  </td>
                </tr>
              ) : reportsList.map((report: any) => {
                const studentName = report.student?.full_name || report.assignment?.student?.full_name || "Student";
                const teacherName = report.teacher?.full_name || report.assignment?.teacher?.full_name || "Teacher";
                const subjectName = report.assignment?.subject || "All Subjects";
                const testScore = report.test_scores || (report.test_score_after ? `${report.test_score_after}%` : null);

                return (
                  <tr key={report.id} className="hover:bg-[#F9F8F5]/60 transition-colors">
                    <td className="p-4 font-bold text-[#0B192C]">
                      {formatReportMonth(report.report_month)}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#0B192C]">{studentName}</p>
                      <p className="text-xs text-[#5A6578]">{subjectName}</p>
                    </td>
                    <td className="p-4 text-neutral-700">
                      <p className="font-medium text-[#0B192C]">{teacherName}</p>
                      {report.teacher?.teacher_id && (
                        <p className="text-xs text-[#5A6578]">{report.teacher.teacher_id}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {testScore ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#005F56] bg-emerald-50 px-2.5 py-0.5 rounded-md w-fit border border-emerald-100">
                            Score: {testScore}
                          </span>
                        ) : report.overall_rating ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md w-fit border border-amber-200">
                            <Star className="w-3 h-3 fill-[#E5A93C] text-[#E5A93C]" /> {report.overall_rating}/5 Rating
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Regular Evaluation</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {report.sent_to_parent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Dispatch
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/report/${report.id}`} 
                          target="_blank" 
                          className="p-2 bg-neutral-100 hover:bg-neutral-200 text-[#0B192C] rounded-lg transition-colors" 
                          title="View / Print Printable Report"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {!report.sent_to_parent && (
                          <form action={markAsSent}>
                            <input type="hidden" name="id" value={report.id} />
                            <button 
                              type="submit" 
                              className="p-2 bg-[#005F56] hover:bg-[#004740] text-white rounded-lg transition-colors cursor-pointer shadow-2xs" 
                              title="Mark as Sent to Parent"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
