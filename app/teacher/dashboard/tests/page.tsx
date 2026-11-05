import { createClient, createAdminClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TeacherTestsClient from "./TeacherTestsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherTestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/teacher/login");

  const adminClient = await createAdminClient();
  const { data: teacher } = await adminClient
    .from("teachers")
    .select("id, full_name, teacher_id")
    .or(`auth_user_id.eq.${user.id},email.ilike.${user.email}`)
    .maybeSingle();

  if (!teacher) redirect("/teacher/login");

  // Get active assignments for this teacher
  const { data: assignments } = await adminClient
    .from("assignments")
    .select(`
      id,
      subject,
      student:students (
        id,
        full_name,
        class_studying,
        parent_name,
        parent_phone,
        parent_whatsapp
      )
    `)
    .eq("teacher_id", teacher.id)
    .eq("status", "active");

  const assignmentIds = (assignments || []).map((a) => a.id);

  // Fetch tests/reports for these assignments
  let tests: any[] = [];
  if (assignmentIds.length > 0) {
    const { data: testRows } = await adminClient
      .from("progress_reports")
      .select(`
        id,
        report_month,
        topics_covered,
        test_scores,
        strengths,
        areas_of_improvement,
        teacher_remarks,
        created_at,
        assignment:assignments (id, subject),
        student:students (id, full_name, class_studying, parent_name, parent_phone, parent_whatsapp)
      `)
      .in("assignment_id", assignmentIds)
      .order("created_at", { ascending: false });

    tests = testRows || [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-[#1F2937]">Tests & Assessments</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Create chapter assessments, record scores, and communicate test feedback to parents.
        </p>
      </div>

      <TeacherTestsClient
        teacherId={teacher.id}
        teacherName={teacher.full_name}
        assignments={(assignments as any) || []}
        initialTests={tests}
      />
    </div>
  );
}
