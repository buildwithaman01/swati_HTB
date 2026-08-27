import { createClient } from "@/utils/supabase/server";
import { Clock, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get active assignments for the dropdown
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, assignments(id, assignment_id, subject, student_id, students(full_name))")
    .eq("auth_user_id", user?.id)
    .single();

  const activeAssignments = (teacher?.assignments || []) as any[];

  // Get past sessions
  const { data: pastSessions } = await supabase
    .from("sessions")
    .select("*, assignments(subject, students(full_name))")
    .eq("teacher_id", teacher?.id)
    .order("session_date", { ascending: false })
    .limit(10);

  async function logSession(formData: FormData) {
    "use server";
    const adminSupabase = await createClient(); // we use the teacher's own token to write (RLS permits this)
    const { data: { user } } = await adminSupabase.auth.getUser();
    
    // We need the teacher UUID
    const { data: t } = await adminSupabase.from("teachers").select("id").eq("auth_user_id", user?.id).single();
    if (!t) return;

    const assignmentId = formData.get("assignment_id") as string;
    
    // Find the student ID for this assignment
    const { data: assign } = await adminSupabase.from("assignments").select("student_id").eq("id", assignmentId).single();

    if (assign) {
      await adminSupabase.from("sessions").insert({
        assignment_id: assignmentId,
        teacher_id: t.id,
        student_id: assign.student_id,
        session_date: formData.get("date"),
        session_start: formData.get("start_time"),
        session_end: formData.get("end_time"),
        topics_covered: formData.get("topics"),
        status: "completed"
      });
      revalidatePath("/portal/sessions");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Class Log</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log a class form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60">
            <h2 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <Plus size={20} className="text-[#0F4C5C]" /> Log New Class
            </h2>
            
            <form action={logSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide mb-1">Student & Subject</label>
                <select name="assignment_id" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20">
                  <option value="">Select student...</option>
                  {activeAssignments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.students.full_name} — {a.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide mb-1">Date</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide mb-1">Start Time</label>
                  <input type="time" name="start_time" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide mb-1">End Time</label>
                  <input type="time" name="end_time" required className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937]/50 uppercase tracking-wide mb-1">Topics Covered</label>
                <textarea name="topics" required placeholder="What did you teach today?" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#0F4C5C] hover:bg-[#0a3844] text-white font-bold py-3 rounded-xl transition-colors mt-2">
                Save Class
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 min-h-full">
            <h2 className="text-lg font-bold text-[#1F2937] mb-4">Recent History</h2>
            
            {pastSessions && pastSessions.length > 0 ? (
              <div className="space-y-4">
                {pastSessions.map((session: any) => (
                  <div key={session.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-neutral-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#1F2937] text-sm">{session.assignments?.students?.full_name} <span className="text-neutral-400 font-normal">— {session.assignments?.subject}</span></p>
                      <p className="text-xs text-[#1F2937]/60 mt-0.5">{new Date(session.session_date).toLocaleDateString()} • {session.session_start?.slice(0,5)} to {session.session_end?.slice(0,5)}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">Completed</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-500 font-medium text-sm">No classes logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}