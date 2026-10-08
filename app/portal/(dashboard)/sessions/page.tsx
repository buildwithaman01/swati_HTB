import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";

export default async function ParentSessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: student } = await supabase
    .from("students").select("id, full_name")
    .or(`parent_email.eq.${user.email},email.eq.${user.email},parent_auth_user_id.eq.${user.id}`).single();

  if (!student) redirect("/portal/login");

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("student_id", student.id)
    .order("session_date", { ascending: false });

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    cancelled_teacher: { label: "Cancelled (Teacher)", color: "bg-amber-100 text-amber-700", icon: <XCircle className="w-3.5 h-3.5" /> },
    cancelled_student: { label: "Cancelled (Student)", color: "bg-orange-100 text-orange-700", icon: <XCircle className="w-3.5 h-3.5" /> },
    absent: { label: "Absent", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3.5 h-3.5" /> },
  };

  const completed = sessions?.filter(s => s.status === "completed").length || 0;
  const total = sessions?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#1F2937]">Sessions</h1>
        <p className="text-sm text-neutral-500 mt-1">{completed} of {total} sessions completed</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
        {(!sessions || sessions.length === 0) ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400 font-medium text-sm">No sessions logged yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {sessions.map((session) => {
              const cfg = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.completed;
              return (
                <div key={session.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-[#1F2937] text-sm">
                        {new Date(session.session_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    {session.topics_covered && (
                      <p className="text-xs text-neutral-600"><span className="font-semibold">Topics:</span> {session.topics_covered}</p>
                    )}
                    {session.homework_given && (
                      <p className="text-xs text-neutral-500 mt-0.5"><span className="font-semibold">Homework:</span> {session.homework_given}</p>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 shrink-0">
                    {session.duration_mins} min
                    {session.session_start && <span> · {session.session_start}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}