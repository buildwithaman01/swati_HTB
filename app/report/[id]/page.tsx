import { createAdminClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrintReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const reportId = id;

  const { data: report } = await supabase
    .from("progress_reports")
    .select(`
      *,
      assignment:assignments (
        subject,
        teacher:teachers (full_name, teacher_id, profile_photo_url),
        student:students (full_name, student_id, class_studying, board)
      )
    `)
    .eq("id", reportId)
    .maybeSingle();

  if (!report) {
    notFound();
  }

  // Resolve student and teacher safely if relation hydration is partial
  let student = report.assignment?.student;
  let teacher = report.assignment?.teacher;

  if (!student && report.student_id) {
    const { data: stData } = await supabase
      .from("students")
      .select("full_name, student_id, class_studying, board")
      .eq("id", report.student_id)
      .maybeSingle();
    student = stData;
  }

  if (!teacher && report.teacher_id) {
    const { data: tcData } = await supabase
      .from("teachers")
      .select("full_name, teacher_id, profile_photo_url")
      .eq("id", report.teacher_id)
      .maybeSingle();
    teacher = tcData;
  }

  let formattedMonth = "Monthly Progress";
  try {
    const rawDate = report.report_month ? new Date(report.report_month) : new Date();
    if (!isNaN(rawDate.getTime())) {
      formattedMonth = format(rawDate, "MMMM yyyy");
    }
  } catch {
    formattedMonth = String(report.report_month || "Monthly Progress");
  }

  // Trigger print dialog on load
  const printScript = `window.onload = function() { window.print(); }`;

  return (
    <div className="bg-white min-h-screen p-8 text-black print:p-0">
      <script dangerouslySetInnerHTML={{ __html: printScript }} />
      
      <div className="max-w-4xl mx-auto border border-neutral-300 print:border-none p-10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#0F4C5C] pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1F2937]">Swati Home Tuition Bureau</h1>
            <p className="text-sm text-neutral-500 font-medium">Patna's Premium Tutoring Service</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#0F4C5C] uppercase tracking-wide">Progress Report</h2>
            <p className="text-sm text-neutral-600 font-bold">{formattedMonth}</p>
          </div>
        </div>

        {/* Student & Teacher Info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 border-b border-neutral-200 pb-2">Student Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold text-neutral-600 w-20 inline-block">Name:</span> <span className="font-bold">{student?.full_name || "Enrolled Student"}</span></p>
              <p><span className="font-semibold text-neutral-600 w-20 inline-block">Class/Board:</span> {student?.class_studying || "General"} {student?.board ? `(${student.board})` : ""}</p>
              <p><span className="font-semibold text-neutral-600 w-20 inline-block">Subject:</span> {report.assignment?.subject || "All Assigned Subjects"}</p>
            </div>
          </div>
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 border-b border-neutral-200 pb-2">Tutor Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold text-neutral-600 w-20 inline-block">Name:</span> <span className="font-bold">{teacher?.full_name || "Assigned Faculty"}</span></p>
              <p><span className="font-semibold text-neutral-600 w-20 inline-block">Tutor ID:</span> {teacher?.teacher_id || report.teacher_id || "HTB-FACULTY"}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs">1</span> 
            Performance Evaluation
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-xl p-4">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {report.test_scores ? "Assessment Score" : "Previous Score"}
              </p>
              <p className="text-2xl font-bold mt-1 text-neutral-700">
                {report.test_scores || (report.test_score_before ? `${report.test_score_before}%` : "—")}
              </p>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-[#0F4C5C]/5">
              <p className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wide">Current Benchmark / Rating</p>
              <p className="text-3xl font-bold mt-1 text-[#0F4C5C]">
                {report.test_score_after
                  ? `${report.test_score_after}%`
                  : report.overall_rating
                  ? `${report.overall_rating} / 5 Stars`
                  : "Verified"}
              </p>
            </div>
          </div>
        </div>

        {/* Core Analysis */}
        <div className="mb-10 space-y-6">
          <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs">2</span> 
            Monthly Analysis
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-t-lg border-b border-emerald-100">Strengths & Achievements</p>
              <div className="border border-neutral-200 border-t-0 p-4 rounded-b-lg text-sm whitespace-pre-wrap text-neutral-700 min-h-[100px]">
                {report.strengths || "Consistently attentive and completing assigned homework."}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-t-lg border-b border-amber-100">Areas for Improvement</p>
              <div className="border border-neutral-200 border-t-0 p-4 rounded-b-lg text-sm whitespace-pre-wrap text-neutral-700 min-h-[100px]">
                {report.gap_areas || report.areas_of_improvement || "Continue regular revision and problem-solving practice."}
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs">3</span> 
            Topics & Forward Plan
          </h3>
          
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 border-b border-neutral-200">
              <div className="p-3 bg-neutral-50 text-xs font-bold text-neutral-600 uppercase col-span-1">Topics Covered</div>
              <div className="p-3 bg-white text-sm col-span-2">
                <ul className="list-disc pl-4 space-y-1">
                  {Array.isArray(report.topics_covered) ? (
                    report.topics_covered.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))
                  ) : typeof report.topics_covered === "string" ? (
                    report.topics_covered
                      .split(/,|\n/)
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((t: string, i: number) => <li key={i}>{t}</li>)
                  ) : (
                    <li>Curriculum syllabus completed as scheduled.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="p-3 bg-neutral-50 text-xs font-bold text-neutral-600 uppercase col-span-1">Next Month's Plan</div>
              <div className="p-3 bg-white text-sm col-span-2 whitespace-pre-wrap text-neutral-700">
                {report.next_month_plan || "Advance to next chapter exercises and regular chapter revision assessments."}
              </div>
            </div>
          </div>
        </div>

        {/* Tutor Message */}
        {(report.tutor_message || report.teacher_remarks) && (
          <div className="mb-10 border-l-4 border-[#0F4C5C] bg-[#0F4C5C]/5 p-6 rounded-r-xl italic text-neutral-700 text-sm">
            &ldquo;{report.tutor_message || report.teacher_remarks}&rdquo;
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-neutral-200 text-center">
          <p className="text-xs text-neutral-400 font-bold tracking-widest uppercase mb-1">Confidential • For Parents Only</p>
          <p className="text-xs text-neutral-500">Generated by Swati Home Tuition Bureau • +91 92297 38307</p>
        </div>

      </div>
    </div>
  );
}
