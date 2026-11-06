import { createAdminClient } from "@/utils/supabase/server";
import { BookOpen, Calendar, Clock, CheckCircle2, User, XCircle, Ban, AlertCircle } from "lucide-react";
import SessionRowActions from "./SessionRowActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSessionsPage() {
  const supabase = await createAdminClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(`
      *,
      teacher:teachers(full_name, teacher_id),
      student:students(full_name, student_id),
      assignment:assignments(subject)
    `)
    .order("session_date", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[AdminSessionsPage error]:", error);
  }

  const STATUS_BADGES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-700" />,
    },
    logged: {
      label: "Logged",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-700" />,
    },
    voided: {
      label: "Voided",
      color: "bg-neutral-100 text-neutral-600 border-neutral-300",
      icon: <Ban className="w-3 h-3 text-neutral-500" />,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <XCircle className="w-3 h-3 text-amber-700" />,
    },
    absent: {
      label: "Absent",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <AlertCircle className="w-3 h-3 text-red-700" />,
    },
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">Class Session Logs</h1>
          <p className="text-[#5A6578] text-sm mt-1">
            Verified study logs, topics taught, and attendance across all home tuition assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#E8E6DF] text-[#0B192C] shadow-sm">
            Total Logs: <strong>{sessions?.length ?? 0}</strong>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E6DF] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E6DF] flex items-center justify-between bg-[#F9F8F5]">
          <h2 className="font-bold text-[#0B192C] text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E5A93C]" /> Recent Verified Sessions
          </h2>
          <span className="text-xs text-[#5A6578]">
            Showing recent 100 classes
          </span>
        </div>

        {(!sessions || sessions.length === 0) ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-[#5A6578] font-medium">No class sessions recorded yet.</p>
            <p className="text-xs text-neutral-400 mt-1">Sessions logged by teachers in their educator dashboard will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E8E6DF] text-xs uppercase tracking-wider text-[#5A6578]">
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Teacher</th>
                  <th className="px-6 py-4 font-semibold">Student & Subject</th>
                  <th className="px-6 py-4 font-semibold">Topics & Homework</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]/70">
                {sessions.map((s) => {
                  const startTime = s.session_start || s.start_time || "";
                  const endTime = s.session_end || "";
                  const timeFormatted = startTime
                    ? endTime
                      ? `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`
                      : startTime.slice(0, 5)
                    : null;
                  const homework = s.homework_given || s.homework_assigned;
                  const notes = s.teacher_notes || s.notes;
                  const statusKey = (s.status || "completed").toLowerCase();
                  const badge = STATUS_BADGES[statusKey] || STATUS_BADGES.completed;

                  return (
                    <tr key={s.id} className="hover:bg-[#F9F8F5]/60 transition-colors">
                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">
                          {s.session_date ? new Date(s.session_date).toLocaleDateString("en-IN") : "—"}
                        </p>
                        <p className="text-xs text-[#5A6578] flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-[#E5A93C]" />
                          {timeFormatted ? `${timeFormatted} ` : ""}({s.duration_mins || 60}m)
                        </p>
                      </td>

                      {/* Teacher */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">{(s.teacher as any)?.full_name || "—"}</p>
                        <p className="text-xs text-[#5A6578] font-mono mt-0.5">{(s.teacher as any)?.teacher_id || ""}</p>
                      </td>

                      {/* Student & Subject */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#0B192C]">{(s.student as any)?.full_name || "—"}</p>
                        <p className="text-xs text-[#5A6578] mt-0.5">{(s.assignment as any)?.subject || "General"}</p>
                      </td>

                      {/* Topics & Homework */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#0B192C] max-w-[220px] truncate" title={s.topics_covered}>
                          {s.topics_covered || "—"}
                        </p>
                        {homework && (
                          <p className="text-xs text-[#5A6578] mt-1 max-w-[220px] truncate" title={homework}>
                            <span className="font-semibold text-[#0B192C]">HW:</span> {homework}
                          </p>
                        )}
                        {notes && (
                          <p className="text-[11px] text-[#5A6578]/80 mt-0.5 max-w-[220px] truncate" title={notes}>
                            <span className="font-semibold">Note:</span> {notes}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}>
                          {badge.icon} {badge.label}
                        </span>
                      </td>

                      {/* Lifecycle Controls */}
                      <td className="px-6 py-4 text-right">
                        <SessionRowActions sessionId={s.id} currentStatus={statusKey} />
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
