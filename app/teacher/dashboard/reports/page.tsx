import { createClient, createAdminClient, getTeacherProfile } from "@/utils/supabase/server";
import { FileText, ArrowRight, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";
import ReportFormClient from "./ReportFormClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeacherReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const teacher = await getTeacherProfile(user.id, user.email);
  const resolvedTeacherId = teacher?.id;
  if (!resolvedTeacherId) return null;

  const adminClient = await createAdminClient();

  // Get teacher's assignments (with flat fallback)
  let assignments: any[] = [];
  const { data: asData, error: asErr } = await adminClient
    .from("assignments")
    .select(`
      id,
      student_id,
      subject,
      student:students (id, full_name, class_studying, parent_name)
    `)
    .eq("teacher_id", resolvedTeacherId)
    .eq("status", "active");

  if (!asErr && asData && asData.length > 0) {
    assignments = asData.map((a: any) => ({
      ...a,
      student: a.student || a.students,
    }));
  } else {
    const { data: flatAs } = await adminClient
      .from("assignments")
      .select("id, student_id, subject, teacher_id, status")
      .eq("teacher_id", resolvedTeacherId)
      .eq("status", "active");

    if (flatAs && flatAs.length > 0) {
      const studentIds = flatAs.map((a: any) => a.student_id).filter(Boolean);
      const { data: stList } = await adminClient
        .from("students")
        .select("id, full_name, class_studying, parent_name")
        .in("id", studentIds);

      const stMap = new Map((stList || []).map((s: any) => [s.id, s]));
      assignments = flatAs.map((a: any) => ({
        ...a,
        student: stMap.get(a.student_id) || null,
      }));
    }
  }

  // Get past reports with robust fallback
  const assignmentIds = assignments.map((a) => a.id);
  let reports: any[] = [];
  let repQuery = adminClient.from("progress_reports").select(`
    *,
    assignment:assignments (
      id,
      subject,
      student:students (id, full_name, class_studying)
    ),
    student:students (id, full_name, class_studying)
  `);

  if (assignmentIds.length > 0) {
    repQuery = repQuery.or(
      `teacher_id.eq.${resolvedTeacherId},assignment_id.in.(${assignmentIds.join(",")})`
    );
  } else {
    repQuery = repQuery.eq("teacher_id", resolvedTeacherId);
  }

  const { data: repData, error: repErr } = await repQuery.order("created_at", {
    ascending: false,
  });

  if (!repErr && repData) {
    reports = repData;
  } else {
    // Resilient flat fallback
    const { data: flatReps } = await adminClient
      .from("progress_reports")
      .select("*")
      .eq("teacher_id", resolvedTeacherId)
      .order("created_at", { ascending: false });
    reports = flatReps || [];
  }

  // Fallback map to resolve student/subject if join wasn't hydrated
  const assignmentMap = new Map(assignments.map((a: any) => [a.id, a]));
  reports = reports.map((r: any) => {
    const matchingAsg = assignmentMap.get(r.assignment_id);
    const resolvedStudent =
      r.student ||
      r.assignment?.student ||
      matchingAsg?.student ||
      null;
    const resolvedSubject =
      r.assignment?.subject || matchingAsg?.subject || "General";

    return {
      ...r,
      resolvedStudent,
      resolvedSubject,
    };
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#0B192C]">
            Progress Reports
          </h1>
          <p className="text-sm text-[#5A6578] mt-1 font-medium">
            Submit monthly evaluations and track academic milestones across your tuitions in Patna.
          </p>
        </div>

        <Link
          href="/teacher/dashboard/tests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B192C] hover:bg-[#1E3E62] px-4 py-2.5 rounded-xl transition-colors shadow-xs"
        >
          <Award className="w-4 h-4 text-[#E5A93C]" />
          Record Topic Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Col - Create Report Form Client Component */}
        <div className="lg:col-span-1 space-y-6">
          <ReportFormClient
            assignments={assignments}
            teacherId={resolvedTeacherId}
          />
        </div>

        {/* Right Col - Past Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E6DF]">
            <h2 className="text-lg font-bold font-serif text-[#0B192C] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#E5A93C]" /> Submitted Reports (
              {reports?.length || 0})
            </h2>

            {!reports || reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-[#5A6578]/30 mx-auto mb-3" />
                <p className="text-[#0B192C] font-bold text-sm">
                  No monthly reports submitted yet.
                </p>
                <p className="text-xs text-[#5A6578] mt-1">
                  Submit your first monthly report using the form on the left, or record topic tests.
                </p>
              </div>
            ) : (
              <div className="grid gap-3.5">
                {reports.map((report: any) => {
                  const studentName =
                    report.resolvedStudent?.full_name || "Enrolled Student";
                  const subjectName = report.resolvedSubject || "General";

                  return (
                    <div
                      key={report.id}
                      className="p-4 border border-[#E8E6DF] rounded-2xl bg-[#F9F8F5]/60 flex justify-between items-center hover:bg-white transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#0B192C] text-sm">
                            {studentName}
                          </p>
                          <span className="text-[10px] font-bold text-[#1E3E62] uppercase tracking-wider bg-white border border-[#E8E6DF] px-2 py-0.5 rounded-md">
                            {subjectName}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A6578]">
                          Month: {report.report_month} • Topics:{" "}
                          {typeof report.topics_covered === "string"
                            ? report.topics_covered.slice(0, 45)
                            : Array.isArray(report.topics_covered)
                            ? report.topics_covered.join(", ").slice(0, 45)
                            : "Evaluation"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Report
                        </span>

                        <Link
                          href={`/report/${report.id}`}
                          target="_blank"
                          className="p-2 hover:bg-[#F9F8F5] rounded-lg border border-[#E8E6DF] transition-colors"
                          title="View Printable Report"
                        >
                          <ArrowRight className="w-4 h-4 text-[#0B192C]" />
                        </Link>
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
