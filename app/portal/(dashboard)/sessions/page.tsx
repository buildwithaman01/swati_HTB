import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Calendar, BookOpen, User, Ban } from "lucide-react";
import RateTutorButton from "../RateTutorButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ParentSessions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const adminClient = await createAdminClient();

  const { data: student } = await adminClient
    .from("students")
    .select("id, full_name, class_studying")
    .or(`parent_email.ilike.${user.email},email.ilike.${user.email},parent_auth_user_id.eq.${user.id}`)
    .maybeSingle();

  if (!student) redirect("/portal/login");

  // Fetch all historical sessions for this student regardless of whether assignment is active or completed
  const [{ data: sessions }, { data: assignments }] = await Promise.all([
    adminClient
      .from("sessions")
      .select(`
        *,
        teacher:teachers(id, full_name, phone, whatsapp)
      `)
      .eq("student_id", student.id)
      .order("session_date", { ascending: false }),
    adminClient
      .from("assignments")
      .select("id, subject, status, teacher:teachers(id, full_name)")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const activeAssignment = assignments?.[0];
  const activeTeacher = (activeAssignment?.teacher as any)?.full_name || (sessions?.[0]?.teacher as any)?.full_name || "Your Home Tutor";

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    logged: { label: "Logged", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    voided: { label: "Voided / Cancelled", color: "bg-neutral-100 text-neutral-600", icon: <Ban className="w-3.5 h-3.5" /> },
    cancelled: { label: "Cancelled", color: "bg-amber-100 text-amber-700", icon: <XCircle className="w-3.5 h-3.5" /> },
    cancelled_teacher: { label: "Cancelled (Teacher)", color: "bg-amber-100 text-amber-700", icon: <XCircle className="w-3.5 h-3.5" /> },
    cancelled_student: { label: "Cancelled (Student)", color: "bg-orange-100 text-orange-700", icon: <XCircle className="w-3.5 h-3.5" /> },
    absent: { label: "Absent", color: "bg-red-100 text-red-700", icon: <XCircle className="w-3.5 h-3.5" /> },
  };

  const completed = sessions?.filter((s: any) => s.status === "completed" || s.status === "logged").length || 0;
  const total = sessions?.length || 0;
  const totalMins = (sessions || [])
    .filter((s: any) => s.status === "completed" || s.status === "logged")
    .reduce((acc: number, s: any) => acc + (Number(s.duration_mins) || 60), 0);
  const totalHours = (totalMins / 60).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#0B192C]">Class Attendance & Sessions</h1>
          <p className="text-sm text-[#5A6578] mt-1">
            Verified study log and class topics for <span className="font-semibold text-[#0B192C]">{student.full_name}</span>.
          </p>
        </div>
        <RateTutorButton
          assignmentId={activeAssignment?.id}
          teacherName={activeTeacher}
          subject={activeAssignment?.subject}
          variant="button"
        />
      </div>

      {/* Rate Your Tutor Banner */}
      <RateTutorButton
        assignmentId={activeAssignment?.id}
        teacherName={activeTeacher}
        subject={activeAssignment?.subject}
        variant="banner"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">Classes Completed</p>
            <p className="text-2xl font-extrabold text-[#0B192C] mt-0.5">{completed} <span className="text-xs font-medium text-[#5A6578]">of {total} total</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1E3E62]/10 text-[#1E3E62] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">Total Study Hours</p>
            <p className="text-2xl font-extrabold text-[#0B192C] mt-0.5">{totalHours} <span className="text-xs font-medium text-[#5A6578]">hours</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm overflow-hidden">
        {(!sessions || sessions.length === 0) ? (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
            <p className="text-[#5A6578] font-medium text-sm">No class sessions recorded yet.</p>
            <p className="text-xs text-neutral-400 mt-1">When your home tutor finishes a class and logs attendance, it will appear here immediately.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E6DF]">
            {sessions.map((session: any) => {
              const statusKey = (session.status || "completed").toLowerCase();
              const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.completed;
              const homework = session.homework_given || session.homework_assigned;
              const startTime = session.session_start || session.start_time;
              const endTime = session.session_end || "";
              const timeDisplay = startTime ? (endTime ? `${startTime} – ${endTime}` : startTime) : null;

              return (
                <div key={session.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F8F5]/60 transition-colors">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#0B192C] text-sm sm:text-base">
                        {new Date(session.session_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {session.teacher?.full_name && (
                        <span className="text-xs bg-[#F3F1EC] text-[#1E3E62] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-[#E5A93C]" /> Tutor: {session.teacher.full_name}
                        </span>
                      )}
                    </div>

                    {session.topics_covered && (
                      <p className="text-sm text-[#0B192C]">
                        <span className="font-semibold text-[#1E3E62]">📚 Topics Covered:</span> {session.topics_covered}
                      </p>
                    )}
                    {homework && (
                      <p className="text-xs text-[#5A6578]">
                        <span className="font-semibold text-[#0B192C]">📝 Homework Assigned:</span> {homework}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-[#5A6578] sm:text-right shrink-0 bg-[#F9F8F5] px-3 py-2 rounded-xl border border-[#E8E6DF]">
                    <p className="font-semibold text-[#0B192C]">{session.duration_mins || 60} Minutes</p>
                    {timeDisplay && (
                      <p className="text-[11px] text-[#5A6578] mt-0.5">{timeDisplay}</p>
                    )}
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
