import { createClient } from "@/utils/supabase/server";
import { BookOpen, MapPin, Phone, UserCircle } from "lucide-react";

export default async function TeacherStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get teacher ID
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!teacher) return null;

  // Get active assignments with student details
  const { data: assignments } = await supabase
    .from("assignments")
    .select(`
      id, monthly_fee, session_duration_mins, classes_per_week, subject,
      students:student_id ( 
        id, student_id, full_name, class_studying, board, locality, address, 
        parent_name, parent_phone, special_needs, preferred_timing
      )
    `)
    .eq("teacher_id", teacher.id)
    .eq("status", "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">My Students</h1>
        <p className="text-sm text-neutral-500 mt-1">View details for your currently assigned students.</p>
      </div>

      {!assignments || assignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-neutral-200/60 text-center">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1F2937]">No Active Tuitions</h2>
          <p className="text-sm text-neutral-500 mt-2">You don't have any students assigned to you right now. The admin will contact you when a match is found.</p>
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
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Parent Contact</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">{student.parent_name}</p>
                      <p className="text-sm text-[#0F4C5C] font-mono mt-0.5">{student.parent_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Location</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">{student.locality}</p>
                      <p className="text-sm text-neutral-600 mt-0.5 line-clamp-2">{student.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Schedule & Requirements</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">
                        {asg.classes_per_week} classes/week ({asg.session_duration_mins} mins each)
                      </p>
                      {student.preferred_timing && (
                        <p className="text-sm text-neutral-600 mt-0.5">Timing: {student.preferred_timing}</p>
                      )}
                      {student.special_needs && (
                        <p className="text-sm text-neutral-600 mt-0.5 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                          Note: {student.special_needs}
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
