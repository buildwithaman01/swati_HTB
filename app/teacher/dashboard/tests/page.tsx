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

  // Fetch tests/reports for this teacher with robust resilient hydration
  let tests: any[] = [];
  let testQuery = adminClient.from("progress_reports").select(`
    id,
    report_month,
    topics_covered,
    test_scores,
    overall_rating,
    strengths,
    areas_of_improvement,
    teacher_remarks,
    created_at,
    student_id,
    assignment_id
  `);

  if (assignmentIds.length > 0) {
    testQuery = testQuery.or(`teacher_id.eq.${teacher.id},assignment_id.in.(${assignmentIds.join(",")})`);
  } else {
    testQuery = testQuery.eq("teacher_id", teacher.id);
  }

  const { data: testRows } = await testQuery.order("created_at", { ascending: false });

  if (testRows && testRows.length > 0) {
    const stIds = Array.from(new Set(testRows.map((t) => t.student_id).filter(Boolean)));
    const { data: stList } = stIds.length > 0
      ? await adminClient
          .from("students")
          .select("id, full_name, class_studying, parent_name, parent_phone, whatsapp")
          .in("id", stIds)
      : { data: [] };
    const stMap = new Map((stList || []).map((s) => [s.id, s]));
    const asgMap = new Map((assignments || []).map((a) => [a.id, a]));

    tests = testRows.map((t) => ({
      ...t,
      student: stMap.get(t.student_id) || (t.assignment_id && asgMap.get(t.assignment_id)?.student) || null,
      assignment: asgMap.get(t.assignment_id) || { id: t.assignment_id, subject: "General Assessment" },
    }));
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
