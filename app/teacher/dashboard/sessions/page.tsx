import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { Calendar as CalendarIcon, Clock, BookOpen, CheckCircle, Share2, Users } from "lucide-react";
import SessionLoggerForm from "./SessionLoggerForm";
import SessionDeleteButton from "./SessionDeleteButton";
import { formatWhatsAppUrl, PARENT_LOGIN_URL, CANONICAL_SUPPORT_PHONE_DISPLAY } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function calculateEndTime(startTime: string | null | undefined, durationMins: number = 60): string {
  if (!startTime) return "";
  try {
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(1970, 0, 1, hours, minutes);
    date.setMinutes(date.getMinutes() + (durationMins || 60));
    return date.toTimeString().slice(0, 5);
  } catch {
    return "";
  }
}

export default async function SessionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  const adminClient = await createAdminClient();

  // 1. Fetch assignments with robust fallback
  let assignments: any[] = [];
  const { data: asData, error: asErr } = await adminClient
    .from("assignments")
    .select(`
      id, student_id, subject,
      student:students ( id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  if (!asErr && asData && asData.length > 0) {
    assignments = asData;
  } else {
    // Fallback flat query to ensure assignments NEVER fail if PostgREST alias fails
    const { data: flatAs } = await adminClient
      .from("assignments")
      .select("id, student_id, subject")
      .eq("teacher_id", resolvedTeacherId)
      .eq("status", "active");

    if (flatAs && flatAs.length > 0) {
      const studentIds = flatAs.map((a) => a.student_id).filter(Boolean);
      const { data: stList } = await adminClient
        .from("students")
        .select("id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp")
        .in("id", studentIds);

      const stMap = new Map((stList || []).map((s) => [s.id, s]));
      assignments = flatAs.map((a) => ({
        ...a,
        student: stMap.get(a.student_id) || null,
        students: stMap.get(a.student_id) || null,
      }));
    }
  }

  // 2. Fetch recent sessions with robust fallback
  let recentSessions: any[] = [];
  const { data: sessData, error: sessErr } = await adminClient
    .from("sessions")
    .select(`
      *,
      student:students ( id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .order("session_date", { ascending: false })
    .limit(30);

  if (!sessErr && sessData && sessData.length > 0) {
    recentSessions = sessData;
  } else {
    // Fallback flat query
    const { data: flatSessions } = await adminClient
      .from("sessions")
      .select("*")
      .eq("teacher_id", resolvedTeacherId)
      .order("session_date", { ascending: false })
      .limit(30);

    if (flatSessions && flatSessions.length > 0) {
      const studentIds = Array.from(new Set(flatSessions.map((s) => s.student_id).filter(Boolean)));
      const { data: stList } = await adminClient
        .from("students")
        .select("id, full_name, parent_name, parent_phone, parent_whatsapp, whatsapp")
        .in("id", studentIds);

      const stMap = new Map((stList || []).map((s) => [s.id, s]));
      recentSessions = flatSessions.map((s) => ({
        ...s,
        student: stMap.get(s.student_id) || null,
        students: stMap.get(s.student_id) || null,
      }));
    }
  }

  // Calculate monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthSessions = (recentSessions || []).filter((s) =>
    (s.session_date || "").startsWith(currentMonth)
  );
  const totalMins = monthSessions.reduce(
    (acc, s) => acc + (Number(s.duration_mins) || 60),
    0
  );
  const totalHours = (totalMins / 60).toFixed(1);
  const uniqueStudents = new Set(monthSessions.map((s) => s.student_id)).size;

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">
            Class Session & Attendance Tracker
          </h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Log classes conducted in Patna to update parents and record your monthly teaching hours.
          </p>
        </div>
      </div>

      {/* Monthly KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
              Sessions This Month
            </p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">
              {monthSessions.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
            <Clock className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
              Teaching Hours
            </p>
            <p className="text-2xl font-bold font-serif text-emerald-800 mt-0.5">
              {totalHours} <span className="text-xs font-medium text-[#5A6578]">hrs</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3E62] text-white flex items-center justify-center">
            <Users className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
              Active Students
            </p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">
              {uniqueStudents || assignments?.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <SessionLoggerForm assignments={assignments} teacherId={resolvedTeacherId} />
        </div>

        {/* History Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF]">
            <h2 className="text-lg font-bold font-serif text-[#0B192C] mb-6 flex items-center gap-2 border-b border-[#E8E6DF] pb-3">
              <CalendarIcon className="w-5 h-5 text-[#E5A93C]" /> Logged Sessions History ({recentSessions?.length || 0})
            </h2>

            {!recentSessions || recentSessions.length === 0 ? (
              <div className="py-12 text-center text-[#5A6578]">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#5A6578]/30" />
                <p className="text-sm font-bold text-[#0B192C]">No sessions logged yet.</p>
                <p className="text-xs mt-1 text-[#5A6578]">
                  Log your first class using the form on the left to start tracking hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session: any) => {
                  const student = session.student || session.students;
                  const parentPhone =
                    student?.parent_whatsapp ||
                    student?.whatsapp ||
                    student?.parent_phone ||
                    "";

                  // Normalize start and end times across database column variants
                  const startTime = (session.start_time || session.session_start || "16:00").slice(0, 5);
                  const durationMins = Number(session.duration_mins) || 60;
                  const endTime = session.session_end || calculateEndTime(startTime, durationMins);
                  const homework = session.homework_assigned || session.homework_given || "";
                  const notes = session.notes || session.teacher_notes || "";

                  const waText = `*Swati Home Tuition Bureau — Class Update*\n\nDear Parent,\nClass completed for *${student?.full_name || "Student"}*.\n\n📅 *Date:* ${new Date(session.session_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}\n⏱️ *Duration:* ${durationMins} mins (${startTime} - ${endTime})\n📚 *Topics Covered:* ${session.topics_covered}${homework ? `\n📝 *Homework:* ${homework}` : ""}\n\nYou can review complete attendance and reports in your Parent Portal:\n🔗 ${PARENT_LOGIN_URL}\n\n📞 Support: ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n— *Swati Home Tuition Bureau, Patna*`;

                  const waUrl = parentPhone ? formatWhatsAppUrl(parentPhone, waText) : null;

                  return (
                    <div
                      key={session.id}
                      className="p-4 border border-[#E8E6DF] rounded-2xl bg-[#F9F8F5]/60 hover:bg-white transition-colors"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                          <h3 className="font-bold font-serif text-[#0B192C] text-base">
                            {student?.full_name || "Assigned Student"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#5A6578]">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#E5A93C]" />{" "}
                              {new Date(session.session_date).toLocaleDateString("en-IN", {
                                dateStyle: "medium",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#5A6578]" /> {startTime} - {endTime} ({durationMins}m)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                            Completed
                          </span>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                              title="Share session update to parent WhatsApp"
                            >
                              <Share2 className="w-3 h-3 text-[#128C7E]" /> WhatsApp
                            </a>
                          )}
                          <SessionDeleteButton
                            sessionId={session.id}
                            studentName={student?.full_name}
                            sessionDate={new Date(session.session_date).toLocaleDateString("en-IN", {
                              dateStyle: "medium",
                            })}
                          />
                        </div>
                      </div>

                      <div className="mt-3 text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E8E6DF]">
                        <p>
                          <span className="font-bold text-[#0B192C]">Topics:</span> {session.topics_covered}
                        </p>
                        {homework && (
                          <p className="text-[#5A6578]">
                            <span className="font-semibold text-[#0B192C]">Homework:</span> {homework}
                          </p>
                        )}
                        {notes && (
                          <p className="text-[#5A6578] italic">Notes: {notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
