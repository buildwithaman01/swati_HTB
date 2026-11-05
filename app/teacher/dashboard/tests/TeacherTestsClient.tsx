"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageCircle,
  FileText,
  ExternalLink,
  Award,
} from "lucide-react";

interface Assignment {
  id: string;
  subject: string;
  student: {
    id: string;
    full_name: string;
    class_studying?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_whatsapp?: string;
  };
}

interface TestRecord {
  id: string;
  report_month: string;
  topics_covered: string;
  test_scores: string;
  strengths?: string;
  areas_of_improvement?: string;
  teacher_remarks?: string;
  created_at: string;
  assignment?: {
    id: string;
    subject: string;
  };
  student?: {
    id: string;
    full_name: string;
    class_studying?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_whatsapp?: string;
  };
}

interface Props {
  teacherId: string;
  teacherName: string;
  assignments: Assignment[];
  initialTests: TestRecord[];
}

export default function TeacherTestsClient({
  teacherId,
  teacherName,
  assignments,
  initialTests,
}: Props) {
  const router = useRouter();

  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id || "");
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalMarks, setTotalMarks] = useState("50");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [remarks, setRemarks] = useState("");
  const [testPaperUrl, setTestPaperUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tests, setTests] = useState<TestRecord[]>(initialTests);

  const selectedAssignment = assignments.find((a) => a.id === assignmentId);
  const tot = parseFloat(totalMarks) || 100;
  const obt = parseFloat(obtainedMarks) || 0;
  const pct = tot > 0 ? Math.round((obt / tot) * 100) : 0;

  async function handleCreateTest(e: React.FormEvent) {
    e.preventDefault();
    if (!assignmentId) {
      setError("Please select a student.");
      return;
    }
    if (!testTitle.trim()) {
      setError("Please enter the test title / chapter name.");
      return;
    }
    if (obtainedMarks === "") {
      setError("Please enter the marks obtained by the student.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/teacher/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: assignmentId,
          teacher_id: teacherId,
          student_id: selectedAssignment?.student?.id,
          subject: selectedAssignment?.subject,
          test_title: testTitle.trim(),
          test_date: testDate,
          total_marks: tot,
          obtained_marks: obt,
          remarks: remarks.trim(),
          test_paper_url: testPaperUrl.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(`✅ Score recorded: ${testTitle} (${obt}/${tot} - ${pct}%)!`);
        setTestTitle("");
        setObtainedMarks("");
        setRemarks("");
        setTestPaperUrl("");
        if (data.test) {
          setTests((prev) => [
            {
              ...data.test,
              student: selectedAssignment?.student,
              assignment: { id: selectedAssignment?.id || "", subject: selectedAssignment?.subject || "" },
            },
            ...prev,
          ]);
        }
        router.refresh();
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to record test.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Create / Log Test Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200/60">
        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4">
          <GraduationCap className="text-[#0F4C5C] w-6 h-6" />
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Record Student Test / Assessment</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Log chapter tests, marks, and feedback. Results immediately appear in the Parent Portal.
            </p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm font-medium">You do not have any active student assignments yet.</p>
          </div>
        ) : (
          <form onSubmit={handleCreateTest} className="space-y-6">
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {success}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Select Student */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Select Student *
                </label>
                <select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  required
                  className="w-full text-sm font-semibold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.student.full_name} ({a.subject}) · Class {a.student.class_studying || "?"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Test / Topic Title *
                </label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Quadratic Equations"
                  required
                  className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                />
              </div>

              {/* Test Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Test Date *
                </label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                  className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                />
              </div>

              {/* Total Marks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Total / Max Marks *
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  min="1"
                  required
                  placeholder="50"
                  className="w-full text-sm font-bold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                />
              </div>

              {/* Marks Obtained */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Marks Obtained *
                </label>
                <input
                  type="number"
                  value={obtainedMarks}
                  onChange={(e) => setObtainedMarks(e.target.value)}
                  min="0"
                  max={totalMarks}
                  step="0.5"
                  required
                  placeholder="45"
                  className="w-full text-sm font-bold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none text-[#0F4C5C]"
                />
              </div>

              {/* Calculated Percentage Card */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase">Calculated Score</p>
                  <p className="text-xl font-bold text-[#1F2937] mt-0.5">
                    {obtainedMarks !== "" ? `${pct}%` : "—"}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    pct >= 85
                      ? "bg-emerald-100 text-emerald-800"
                      : pct >= 65
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {pct >= 90 ? "Grade A+" : pct >= 75 ? "Grade A" : pct >= 60 ? "Grade B" : "Needs Revision"}
                </span>
              </div>

              {/* Test Paper Link */}
              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Question Paper / Solution Link (Optional)
                </label>
                <input
                  type="url"
                  value={testPaperUrl}
                  onChange={(e) => setTestPaperUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or cloud document link"
                  className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                  Feedback & Topics to Revise
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="e.g. Excellent grasp of word problems. Needs more practice in calculation speed and negative signs."
                  className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Test Score...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save & Publish Test Result
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Tests History Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200/60 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
          <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0F4C5C]" /> Published Test Results ({tests.length})
          </h2>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-neutral-200" />
            <p className="text-sm font-medium">No tests logged yet. Use the form above to record your first test.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => {
              const studentName = test.student?.full_name || "Student";
              const parentPhone = test.student?.parent_whatsapp || test.student?.parent_phone || "";

              const waMsg = `📊 *Tuition Test Result Alert!*\n\nDear Parent of ${studentName},\n\nTeacher ${teacherName} has uploaded a new test score:\n\n📝 *Test:* ${test.topics_covered}\n📅 *Date:* ${test.report_month}\n🎯 *Score:* ${test.test_scores}\n💬 *Teacher Feedback:* ${test.teacher_remarks || "Good effort!"}\n\nYou can review all progress reports in your Parent Portal.\n\n— Swati Home Tuition Bureau`;
              const waUrl = `https://wa.me/${parentPhone.replace(/\D/g, "")}?text=${encodeURIComponent(waMsg)}`;

              return (
                <div
                  key={test.id}
                  className="border border-neutral-100 rounded-2xl p-5 bg-neutral-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1F2937] text-base">{test.topics_covered}</span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {studentName}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(test.report_month).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#0F4C5C]">{test.test_scores}</span>
                      </div>

                      {parentPhone && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                          title="Share result with parent on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Share
                        </a>
                      )}
                    </div>
                  </div>

                  {test.teacher_remarks && (
                    <p className="text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/60">
                      {test.teacher_remarks}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
