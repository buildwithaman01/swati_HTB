import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { ShieldAlert } from "lucide-react";
import TeacherStudentsView from "./TeacherStudentsView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherStudentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;

  if (!resolvedTeacherId) return null;

  const adminClient = await createAdminClient();

  // Fetch all assignments (active and past) with student details
  let assignments: any[] = [];
  const { data: asData, error: asErr } = await adminClient
    .from("assignments")
    .select(`
      id, status, monthly_fee, session_duration_mins, classes_per_week, subject, session_days, session_time, start_date, end_date, created_at,
      students:student_id ( 
        id, student_id, full_name, class_studying, board, locality, address,
        parent_name, special_needs, preferred_timing
      )
    `)
    .eq("teacher_id", resolvedTeacherId)
    .order("created_at", { ascending: false });

  if (!asErr && asData && asData.length > 0) {
    assignments = asData;
  } else {
    // Fallback flat query to ensure resilient rendering
    const { data: flatAs } = await adminClient
      .from("assignments")
      .select("*")
      .eq("teacher_id", resolvedTeacherId)
      .order("created_at", { ascending: false });

    if (flatAs && flatAs.length > 0) {
      const studentIds = flatAs.map((a) => a.student_id).filter(Boolean);
      const { data: stList } = await adminClient
        .from("students")
        .select("id, student_id, full_name, class_studying, board, locality, address, parent_name, special_needs, preferred_timing")
        .in("id", studentIds);

      const stMap = new Map((stList || []).map((s) => [s.id, s]));
      assignments = flatAs.map((a) => ({
        ...a,
        students: stMap.get(a.student_id) || null,
        student: stMap.get(a.student_id) || null,
      }));
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">My Students & Tuitions</h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Manage your active tuition batches and review completed student records across Patna.
          </p>
        </div>
      </div>

      {/* Bureau contact policy notice */}
      <div className="flex items-start gap-3 bg-blue-50/80 border border-blue-200/70 rounded-2xl p-4">
        <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <p className="font-bold text-sm text-blue-950 mb-0.5">Bureau Communication Policy</p>
          To maintain transparency and safeguarding, all scheduling changes, fee queries, and parent introductions must be coordinated through the bureau support desk at <strong>+91 92297 38307</strong>.
        </div>
      </div>

      {/* Interactive Tabs for Active vs Past Tuitions */}
      <TeacherStudentsView assignments={assignments} />
    </div>
  );
}
