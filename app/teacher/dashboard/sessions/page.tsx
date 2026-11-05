import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Calendar as CalendarIcon, Clock, BookOpen, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const adminClient = await createAdminClient();
  const { data: teacher } = await adminClient
    .from("teachers")
    .select("id")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  // Get assignments
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, student_id,
      students:student_id ( full_name )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  // Get recent sessions
  const { data: recentSessions } = await supabase
    .from("sessions")
    .select(`
      *,
      students:student_id ( full_name )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .order("session_date", { ascending: false })
    .limit(10);

  // Server Action
  async function logSession(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teacherResult } = await supabase
      .from("teachers")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    const resolvedFormTeacherId = teacherResult?.id ?? (await supabase
      .from("teachers")
      .select("id")
      .eq("email", user.email)
      .single()
    ).data?.id;

    if (!resolvedFormTeacherId) return;

    const assignmentStr = String(formData.get("assignment_id"));
    const [assignment_id, student_id] = assignmentStr.split("|");

    const session_date = String(formData.get("session_date"));
    const session_start = String(formData.get("session_start"));
    const session_end = String(formData.get("session_end"));
    const topics_covered = String(formData.get("topics_covered"));
    const homework_given = String(formData.get("homework_given"));
    const teacher_notes = String(formData.get("teacher_notes"));

    // Calculate duration
    const start = new Date(`1970-01-01T${session_start}:00`);
    const end = new Date(`1970-01-01T${session_end}:00`);
    const duration_mins = (end.getTime() - start.getTime()) / 60000;

    await supabase.from("sessions").insert({
      assignment_id,
      student_id,
      teacher_id: resolvedFormTeacherId,
      session_date,
      session_start,
      session_end,
      duration_mins: duration_mins > 0 ? duration_mins : 60, // Fallback
      topics_covered,
      homework_given,
      teacher_notes,
      status: "completed"
    });

    revalidatePath("/teacher/dashboard/sessions");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Session Logger</h1>
        <p className="text-sm text-neutral-500 mt-1">Log your completed classes to track your earnings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#0F4C5C]" /> Log New Session
            </h2>

            <form action={logSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Student</label>
                <select name="assignment_id" required className="w-full text-sm border border-neutral-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
                  <option value="">Select Student...</option>
                  {assignments?.map(a => (
                    <option key={a.id} value={`${a.id}|${a.student_id}`}>{a.students?.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Date</label>
                <input type="date" name="session_date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Start Time</label>
                  <input type="time" name="session_start" required defaultValue="16:00" className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">End Time</label>
                  <input type="time" name="session_end" required defaultValue="17:00" className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Topics Covered</label>
                <input type="text" name="topics_covered" required placeholder="e.g. Algebra Chapter 2" className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Homework Given</label>
                <input type="text" name="homework_given" placeholder="e.g. Exercises 2.1 to 2.4" className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">Private Notes (Optional)</label>
                <textarea name="teacher_notes" rows={2} placeholder="Any notes for yourself..." className="w-full text-sm border border-neutral-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0F4C5C]/20"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold py-3 rounded-xl transition-colors">
                Save Session
              </button>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 h-full">
            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#0F4C5C]" /> Recent Sessions
            </h2>

            {!recentSessions || recentSessions.length === 0 ? (
              <div className="py-12 text-center text-neutral-500">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm font-medium">No sessions logged yet.</p>
                <p className="text-xs mt-1">Log your first class using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map(session => (
                  <div key={session.id} className="p-4 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-[#1F2937] text-sm">{session.students?.full_name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {new Date(session.session_date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.session_start?.slice(0, 5)} - {session.session_end?.slice(0, 5)} ({session.duration_mins}m)</span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full">
                        Logged
                      </span>
                    </div>
                    <div className="mt-3 text-sm">
                      <p><span className="font-bold text-neutral-700">Topics:</span> {session.topics_covered}</p>
                      {session.homework_given && (
                        <p className="mt-1"><span className="font-bold text-neutral-700">HW:</span> {session.homework_given}</p>
                      )}
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
