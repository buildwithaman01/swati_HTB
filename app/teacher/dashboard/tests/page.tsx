import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TeacherTestsClient from "./TeacherTestsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherTestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/teacher/login");

  const teacher = await getTeacherProfile(user.id, user.email);

  if (!teacher) redirect("/teacher/login");

  const adminClient = await createAdminClient();

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
        whatsapp
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
        overall_rating,
        strengths,
        areas_of_improvement,
        teacher_remarks,
        created_at,
        assignment:assignments (id, subject),
        student:students (id, full_name, class_studying, parent_name, parent_phone, whatsapp)
      `)
      .in("assignment_id", assignmentIds)
      .order("created_at", { ascending: false });

    tests = testRows || [];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E8E6DF] pb-4">
        <h1 className="text-3xl font-bold font-serif text-[#0B192C]">
          Tests & Student Progress
        </h1>
        <p className="text-sm text-[#5A6578] mt-1 font-medium">
          Create chapter assessments, calculate marks & percentages automatically, and track student growth with verified performance badges.
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
