import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Calendar as CalendarIcon, Clock, BookOpen, CheckCircle, Share2, Award, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  const adminClient = await createAdminClient();

  // Get assignments with student details
  const { data: assignments } = await adminClient
    .from("assignments")
    .select(`
      id, student_id, subject,
      students:student_id ( id, full_name, parent_name, parent_phone, parent_whatsapp )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  // Get recent sessions
  const { data: recentSessions } = await adminClient
    .from("sessions")
    .select(`
      *,
      students:student_id ( id, full_name, parent_name, parent_phone, parent_whatsapp )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .order("session_date", { ascending: false })
    .limit(20);

  // Calculate monthly stats
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthSessions = (recentSessions || []).filter(s => (s.session_date || "").startsWith(currentMonth));
  const totalMins = monthSessions.reduce((acc, s) => acc + (Number(s.duration_mins) || 60), 0);
  const totalHours = (totalMins / 60).toFixed(1);
  const uniqueStudents = new Set(monthSessions.map(s => s.student_id)).size;

  // Server Action
  async function logSession(formData: FormData) {
    "use server";
    const adminDb = await createAdminClient();
    const assignmentStr = String(formData.get("assignment_id"));
    const [assignment_id, student_id] = assignmentStr.split("|");

    const session_date = String(formData.get("session_date"));
    const session_start = String(formData.get("session_start"));
    const session_end = String(formData.get("session_end"));
    const topics_covered = String(formData.get("topics_covered"));
    const homework_given = String(formData.get("homework_given"));
    const teacher_notes = String(formData.get("teacher_notes"));

    // Calculate duration
    let duration_mins = 60;
    try {
      const start = new Date(`1970-01-01T${session_start}:00`);
      const end = new Date(`1970-01-01T${session_end}:00`);
      const diff = (end.getTime() - start.getTime()) / 60000;
      if (diff > 0) duration_mins = diff;
    } catch {
      duration_mins = 60;
    }

    await adminDb.from("sessions").insert({
      assignment_id,
      student_id,
      teacher_id: resolvedTeacherId,
      session_date,
      session_start,
      session_end,
      duration_mins,
      topics_covered,
      homework_given,
      teacher_notes,
      status: "completed"
    });

    revalidatePath("/teacher/dashboard/sessions");
    revalidatePath("/portal/sessions");
    revalidatePath("/admin/sessions");
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">Class Session & Attendance Tracker</h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">Log classes conducted in Patna to update parents and record your monthly teaching hours.</p>
        </div>
      </div>

      {/* Monthly KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">Sessions This Month</p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">{monthSessions.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
            <Clock className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">Teaching Hours</p>
            <p className="text-2xl font-bold font-serif text-emerald-800 mt-0.5">{totalHours} <span className="text-xs font-medium text-[#5A6578]">hrs</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8E6DF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3E62] text-white flex items-center justify-center">
            <Users className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">Active Students</p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">{uniqueStudents || assignments?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF]">
            <h2 className="text-lg font-bold font-serif text-[#0B192C] mb-6 flex items-center gap-2 border-b border-[#E8E6DF] pb-3">
              <CheckCircle className="w-5 h-5 text-[#E5A93C]" /> Log New Session
            </h2>

            <form action={logSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Select Student</label>
                <select name="assignment_id" required className="w-full text-sm font-semibold border border-[#E8E6DF] rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]">
                  <option value="">Select Student...</option>
                  {assignments?.map((a: any) => (
                    <option key={a.id} value={`${a.id}|${a.student_id}`}>
                      {a.students?.full_name} ({a.subject || 'All Subjects'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Date</label>
                <input type="date" name="session_date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Start Time</label>
                  <input type="time" name="session_start" required defaultValue="16:00" className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">End Time</label>
                  <input type="time" name="session_end" required defaultValue="17:00" className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Topics Covered</label>
                <input type="text" name="topics_covered" required placeholder="e.g. NCERT Chapter 4 - Quadratic Equations" className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Homework Given</label>
                <input type="text" name="homework_given" placeholder="e.g. Exercise 4.2 Q1 to Q8" className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">Private Tutor Notes (Optional)</label>
                <textarea name="teacher_notes" rows={2} placeholder="Observations, student focus, or reminders..." className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 resize-none text-[#1A1D20]"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#E5A93C]" />
                Save & Record Class
              </button>
            </form>
          </div>
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
                <p className="text-xs mt-1 text-[#5A6578]">Log your first class using the form on the left to start tracking hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session: any) => {
                  const student = session.students;
                  const parentPhone = (student?.parent_whatsapp || student?.parent_phone || "").replace(/[^\d]/g, "");
                  const rawWa = parentPhone.startsWith("91") ? parentPhone : `91${parentPhone}`;
                  const waText = `*Swati Home Tuition Bureau — Class Update*\n\nDear Parent,\nClass completed for *${student?.full_name || 'Student'}*.\n\n📅 *Date:* ${new Date(session.session_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}\n⏱️ *Duration:* ${session.duration_mins} mins (${session.session_start || ''} - ${session.session_end || ''})\n📚 *Topics Covered:* ${session.topics_covered}${session.homework_given ? `\n📝 *Homework:* ${session.homework_given}` : ''}\n\n— *Swati Home Tuition Bureau*`;
                  const waUrl = parentPhone ? `https://wa.me/${rawWa}?text=${encodeURIComponent(waText)}` : null;

                  return (
                    <div key={session.id} className="p-4 border border-[#E8E6DF] rounded-2xl bg-[#F9F8F5]/60 hover:bg-white transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                          <h3 className="font-bold font-serif text-[#0B192C] text-base">{student?.full_name}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#5A6578]">
                            <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-[#E5A93C]" /> {new Date(session.session_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#5A6578]" /> {session.session_start?.slice(0, 5)} - {session.session_end?.slice(0, 5)} ({session.duration_mins}m)</span>
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
                        </div>
                      </div>

                      <div className="mt-3 text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E8E6DF]">
                        <p><span className="font-bold text-[#0B192C]">Topics:</span> {session.topics_covered}</p>
                        {session.homework_given && (
                          <p className="text-[#5A6578]"><span className="font-semibold text-[#0B192C]">Homework:</span> {session.homework_given}</p>
                        )}
                        {session.teacher_notes && (
                          <p className="text-[#5A6578] italic">Notes: {session.teacher_notes}</p>
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
