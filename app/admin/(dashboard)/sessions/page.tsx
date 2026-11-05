import { createAdminClient } from "@/utils/supabase/server";
import { BookOpen, Calendar, Clock, CheckCircle2, User } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSessionsPage() {
  const supabase = await createAdminClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select(`
      *,
      teachers:teacher_id ( full_name, teacher_id ),
      students:student_id ( full_name, student_id ),
      assignments:assignment_id ( subject )
    `)
    .order("session_date", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Session Logs</h1>
        <p className="text-neutral-500 text-sm mt-1">Recent classes logged by teachers across all assignments</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h2 className="font-bold text-[#1F2937] text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0F4C5C]" /> Recent Sessions
          </h2>
        </div>

        {(!sessions || sessions.length === 0) ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium">No sessions logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-neutral-200/60 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Teacher</th>
                  <th className="px-6 py-4 font-semibold">Student & Subject</th>
                  <th className="px-6 py-4 font-semibold">Topics Covered</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#1F2937]">{new Date(s.session_date).toLocaleDateString("en-IN")}</p>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {s.session_start?.slice(0,5)} - {s.session_end?.slice(0,5)} ({s.duration_mins}m)
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#1F2937]">{s.teachers?.full_name}</p>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">{s.teachers?.teacher_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#1F2937]">{s.students?.full_name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{s.assignments?.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#1F2937] max-w-[200px] truncate" title={s.topics_covered}>{s.topics_covered}</p>
                      {s.homework_given && (
                        <p className="text-xs text-neutral-500 mt-1 max-w-[200px] truncate" title={s.homework_given}>HW: {s.homework_given}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Logged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
