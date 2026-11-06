import { createAdminClient } from "@/utils/supabase/server";
import { BookOpen, Calendar, Clock, CheckCircle2, User, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSessionsPage() {
  const supabase = await createAdminClient();

  let sessions: any[] = [];
  const { data: sessData, error: sessErr } = await supabase
    .from("sessions")
    .select(`
      *,
      teacher:teachers ( full_name, teacher_id ),
      student:students ( full_name, student_id ),
      assignment:assignments ( subject )
    `)
    .order("session_date", { ascending: false })
    .limit(100);

  if (!sessErr && sessData && sessData.length > 0) {
    sessions = sessData;
  } else {
    // Resilient flat query fallback
    const { data: flatSess } = await supabase
      .from("sessions")
      .select("*")
      .order("session_date", { ascending: false })
      .limit(100);

    if (flatSess && flatSess.length > 0) {
      const teacherIds = flatSess.map((s: any) => s.teacher_id).filter(Boolean);
      const studentIds = flatSess.map((s: any) => s.student_id).filter(Boolean);
      const assignmentIds = flatSess.map((s: any) => s.assignment_id).filter(Boolean);

      const [teachersRes, studentsRes, assignmentsRes] = await Promise.all([
        teacherIds.length ? supabase.from("teachers").select("id, full_name, teacher_id").in("id", teacherIds) : { data: [] },
        studentIds.length ? supabase.from("students").select("id, full_name, student_id").in("id", studentIds) : { data: [] },
        assignmentIds.length ? supabase.from("assignments").select("id, subject").in("id", assignmentIds) : { data: [] },
      ]);

      const tMap = new Map((teachersRes.data || []).map((t: any) => [t.id, t]));
      const sMap = new Map((studentsRes.data || []).map((s: any) => [s.id, s]));
      const aMap = new Map((assignmentsRes.data || []).map((a: any) => [a.id, a]));

      sessions = flatSess.map((s: any) => ({
        ...s,
        teacher: tMap.get(s.teacher_id) || null,
        student: sMap.get(s.student_id) || null,
        assignment: aMap.get(s.assignment_id) || null,
      }));
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#0B192C]">Session Logs</h1>
        <p className="text-[#5A6578] text-sm mt-1">Verified class attendance and daily syllabus logs recorded by teachers across Patna.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E6DF] flex items-center justify-between bg-[#F9F8F5]">
          <h2 className="font-bold text-[#0B192C] text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E5A93C]" /> Recent Sessions
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1E3E62]/10 text-[#1E3E62]">
            {sessions?.length ?? 0} Recorded
          </span>
        </div>

        {(!sessions || sessions.length === 0) ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-[#5A6578]/30 mx-auto mb-3" />
            <p className="text-[#5A6578] font-medium text-sm">No sessions logged yet.</p>
            <p className="text-xs text-[#5A6578]/70 mt-1">When teachers record classes in the Teacher Dashboard, logs appear here immediately.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E8E6DF] text-xs uppercase tracking-wider text-[#5A6578]">
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Teacher</th>
                  <th className="px-6 py-4 font-semibold">Student & Subject</th>
                  <th className="px-6 py-4 font-semibold">Topics Covered</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]/70">
                {sessions.map((s: any) => {
                  const teacher = s.teacher || s.teachers;
                  const student = s.student || s.students;
                  const assignment = s.assignment || s.assignments;
                  const startTime = s.start_time || s.session_start || "";
                  const endTime = s.session_end || "";
                  const timeFormatted = startTime ? (endTime ? `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}` : startTime.slice(0, 5)) : "16:00";
                  const homework = s.homework_assigned || s.homework_given;
                  const notes = s.notes || s.teacher_notes;

                  return (
                    <tr key={s.id} className="hover:bg-[#F9F8F5]/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">
                          {s.session_date ? new Date(s.session_date).toLocaleDateString("en-IN") : "—"}
                        </p>
                        <p className="text-xs text-[#5A6578] flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-[#E5A93C]" /> {timeFormatted} ({s.duration_mins || 60}m)
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">{teacher?.full_name || "—"}</p>
                        <p className="text-xs text-[#5A6578] font-mono mt-0.5">{teacher?.teacher_id || ""}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">{student?.full_name || "—"}</p>
                        <p className="text-xs text-[#5A6578] mt-0.5">{assignment?.subject || "General"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#0B192C] max-w-[220px] truncate" title={s.topics_covered}>
                          {s.topics_covered || "—"}
                        </p>
                        {homework && (
                          <p className="text-xs text-[#5A6578] mt-1 max-w-[220px] truncate" title={homework}>
                            HW: {homework}
                          </p>
                        )}
                        {notes && (
                          <p className="text-[11px] text-[#5A6578]/80 mt-0.5 max-w-[220px] truncate" title={notes}>
                            Note: {notes}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {s.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
