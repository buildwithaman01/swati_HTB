import { createClient } from "@/utils/supabase/server";
import { BookOpen, MapPin, Phone, UserCircle, ShieldAlert } from "lucide-react";

export default async function TeacherStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Auth-user-id-based lookup (more reliable than email)
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  // Fallback to email if auth_user_id not set yet on this record
  const resolvedTeacherId = teacher?.id ?? (await supabase
    .from("teachers")
    .select("id")
    .eq("email", user.email)
    .single()
  ).data?.id;

  if (!resolvedTeacherId) return null;

  // SECURITY: parent_phone intentionally NOT selected
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, monthly_fee, session_duration_mins, classes_per_week, subject, session_days, session_time,
      students:student_id ( 
        id, student_id, full_name, class_studying, board, locality, address,
        parent_name, special_needs, preferred_timing
      )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">My Students</h1>
        <p className="text-sm text-neutral-500 mt-1">View details for your currently assigned students.</p>
      </div>

      {/* Bureau contact policy notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Bureau Policy:</strong> All parent communication must go through Swati Home Tuition Bureau. 
          Contact us at <strong>+91 75490 97748</strong> for any queries.
        </p>
      </div>

      {!assignments || assignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-neutral-200/60 text-center">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1F2937]">No Active Tuitions</h2>
          <p className="text-sm text-neutral-500 mt-2">You don&apos;t have any students assigned to you right now. The admin will contact you when a match is found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(asg => {
            const student = asg.students;
            if (!student) return null;
            return (
              <div key={asg.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60">
                <div className="p-6 border-b border-neutral-100 flex items-start gap-4 bg-neutral-50/50">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center shrink-0">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1F2937]">{student.full_name}</h2>
                    <p className="text-sm font-medium text-neutral-600 mt-1">
                      Class {student.class_studying} • {student.board} • {asg.subject}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Parent name visible, phone NOT visible — contact via bureau */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Parent</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">{student.parent_name}</p>
                      <a
                        href="https://wa.me/917549097748"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full mt-1.5 font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Contact via Bureau WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Location</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">{student.locality}</p>
                      {student.address && <p className="text-sm text-neutral-600 mt-0.5 line-clamp-2">{student.address}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Schedule</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">
                        {asg.classes_per_week} classes/week • {asg.session_duration_mins} mins each
                      </p>
                      {asg.session_days && Array.isArray(asg.session_days) && asg.session_days.length > 0 && (
                        <p className="text-xs text-neutral-500 mt-0.5">Days: {asg.session_days.join(", ")}</p>
                      )}
                      {asg.session_time && (
                        <p className="text-xs text-neutral-500 mt-0.5">Time: {asg.session_time}</p>
                      )}
                      {student.preferred_timing && (
                        <p className="text-xs text-neutral-500 mt-0.5">Preferred: {student.preferred_timing}</p>
                      )}
                      {student.special_needs && (
                        <p className="text-sm text-amber-800 mt-1.5 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                          ⚠️ {student.special_needs}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
