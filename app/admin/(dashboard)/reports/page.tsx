import { createAdminClient } from "@/utils/supabase/server";
import { FileText, CheckCircle2, ArrowRight, Eye, Send } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReportsPage() {
  const supabase = await createAdminClient();

  const { data: reports } = await supabase
    .from("progress_reports")
    .select(`
      *,
      assignment:assignments (
        subject,
        teacher:teachers (full_name),
        student:students (full_name)
      )
    `)
    .order("created_at", { ascending: false });

  async function markAsSent(formData: FormData) {
    "use server";
    const adminSupabase = await createAdminClient();
    const id = formData.get("id");
    
    await adminSupabase.from("progress_reports").update({
      sent_to_parent: true,
      sent_at: new Date().toISOString()
    }).eq("id", id);
    
    revalidatePath("/admin/reports");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Progress Reports</h1>
        <p className="text-sm text-neutral-500 mt-1">Review and dispatch monthly progress reports submitted by teachers.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <th className="p-4 font-bold">Month</th>
                <th className="p-4 font-bold">Student</th>
                <th className="p-4 font-bold">Teacher</th>
                <th className="p-4 font-bold">Scores</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {(!reports || reports.length === 0) ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">
                    No progress reports found.
                  </td>
                </tr>
              ) : reports.map((report: any) => (
                <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4 font-bold text-[#1F2937]">{report.report_month}</td>
                  <td className="p-4">
                    <p className="font-bold text-[#1F2937]">{report.assignment?.student?.full_name}</p>
                    <p className="text-xs text-neutral-500">{report.assignment?.subject}</p>
                  </td>
                  <td className="p-4 text-neutral-600">{report.assignment?.teacher?.full_name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">{report.test_score_before || '-'}%</span>
                      <ArrowRight className="w-3 h-3 text-neutral-300" />
                      <span className="font-bold text-[#0F4C5C]">{report.test_score_after || '-'}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {report.sent_to_parent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/report/${report.id}`} target="_blank" className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-colors" title="View Report">
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {!report.sent_to_parent && (
                        <form action={markAsSent}>
                          <input type="hidden" name="id" value={report.id} />
                          <button type="submit" className="p-2 bg-[#0F4C5C] hover:bg-[#0a3a47] text-white rounded-lg transition-colors" title="Mark as Sent to Parent">
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
