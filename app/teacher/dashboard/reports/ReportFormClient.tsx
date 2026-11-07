"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ArrowRight,
  Star,
  Sparkles,
  BookOpen,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

export interface Assignment {
  id: string;
  student_id?: string;
  subject?: string;
  student?: {
    id?: string;
    full_name?: string;
    class_studying?: string;
    parent_name?: string;
  };
  students?: {
    id?: string;
    full_name?: string;
    class_studying?: string;
    parent_name?: string;
  };
}

interface Props {
  assignments: Assignment[];
  teacherId: string;
}

const STRENGTH_TAGS = [
  "Sharp analytical problem solving",
  "Punctual, attentive & active in class",
  "Consistent daily homework completion",
  "Strong conceptual grasp of topics",
  "Rapid formula recall & accuracy",
];

const IMPROVEMENT_TAGS = [
  "Needs regular revision of key formulas",
  "Reduce careless calculation mistakes",
  "Time management during mock tests",
  "Step-by-step structured presentation",
  "More independent numerical practice",
];

export default function ReportFormClient({ assignments, teacherId }: Props) {
  const router = useRouter();

  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id || "");
  const [reportMonth, setReportMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [topicsCovered, setTopicsCovered] = useState("");
  const [strengths, setStrengths] = useState("");
  const [areasOfImprovement, setAreasOfImprovement] = useState("");
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [overallRating, setOverallRating] = useState<number>(4);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<any | null>(null);

  const selectedAssignment = assignments.find((a) => a.id === assignmentId);
  const studentObj =
    selectedAssignment?.student || selectedAssignment?.students;

  function appendText(
    setter: React.Dispatch<React.SetStateAction<string>>,
    text: string
  ) {
    setter((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.includes(text)) return prev;
      return `${trimmed}. ${text}`;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!assignmentId) {
      setError("Please select a student assignment.");
      return;
    }
    if (!reportMonth) {
      setError("Please select the evaluation report month.");
      return;
    }
    if (!topicsCovered.trim()) {
      setError("Please provide the syllabus or topics covered this month.");
      return;
    }
    if (!strengths.trim()) {
      setError("Please highlight the student's academic strengths.");
      return;
    }
    if (!areasOfImprovement.trim()) {
      setError("Please specify the key areas for improvement.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/teacher/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: assignmentId,
          teacher_id: teacherId,
          report_month: reportMonth,
          topics_covered: topicsCovered.trim(),
          strengths: strengths.trim(),
          areas_of_improvement: areasOfImprovement.trim(),
          gap_areas: areasOfImprovement.trim(),
          teacher_remarks:
            teacherRemarks.trim() || "Monthly progress evaluation submitted.",
          tutor_message:
            teacherRemarks.trim() || "Monthly progress evaluation submitted.",
          overall_rating: overallRating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit progress report.");
      }

      setSuccess(data.message || "Monthly report submitted successfully!");
      setLastSubmitted(data.report || null);

      // Clear contents for fresh report while keeping student/month context
      setTopicsCovered("");
      setStrengths("");
      setAreasOfImprovement("");
      setTeacherRemarks("");

      // Trigger revalidation in Next.js router
      router.refresh();
    } catch (err: any) {
      console.error("[ReportFormClient submit error]:", err);
      setError(
        err.message || "An unexpected error occurred while submitting."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E6DF]">
      <div className="flex items-center justify-between mb-6 border-b border-[#E8E6DF] pb-4">
        <div className="flex items-center gap-2">
          <Plus className="text-[#E5A93C] w-5 h-5" />
          <h2 className="text-lg font-bold font-serif text-[#0B192C]">
            New Monthly Evaluation
          </h2>
        </div>
        <span className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider bg-[#F9F8F5] px-2.5 py-1 rounded-full border border-[#E8E6DF]">
          Parent Report
        </span>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col gap-2 transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">{success}</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Published to Parent Portal and verified in Bureau records.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {lastSubmitted?.id && (
            <Link
              href={`/report/${lastSubmitted.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl w-fit mt-1 shadow-2xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              View Printable Report Card
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-3 transition-all">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-900">Submission Error</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-700 hover:text-rose-900 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Assignment Selector */}
        <div>
          <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">
            Select Student <span className="text-rose-500">*</span>
          </label>
          {assignments && assignments.length > 0 ? (
            <select
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C] font-semibold bg-white disabled:bg-neutral-100"
            >
              <option value="">Choose student...</option>
              {assignments.map((a: any) => {
                const s = a.student || a.students;
                return (
                  <option key={a.id} value={a.id}>
                    {s?.full_name || "Enrolled Student"} ({a.subject || "All Subjects"})
                    {s?.class_studying ? ` • Class ${s.class_studying}` : ""}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              No active student assignments found for your teacher profile.
            </div>
          )}

          {studentObj && (
            <div className="mt-2 p-2.5 bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl flex items-center justify-between text-xs text-[#5A6578]">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#0B192C]" />
                <span className="font-bold text-[#0B192C]">
                  {studentObj.full_name}
                </span>
                {studentObj.class_studying && (
                  <span>(Class {studentObj.class_studying})</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-[#1E3E62] bg-white px-2 py-0.5 rounded border border-[#E8E6DF]">
                {selectedAssignment?.subject || "General"}
              </span>
            </div>
          )}
        </div>

        {/* Report Month & Overall Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">
              Report Month <span className="text-rose-500">*</span>
            </label>
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C] font-medium bg-white disabled:bg-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">
              Rating
            </label>
            <select
              value={overallRating}
              onChange={(e) => setOverallRating(parseInt(e.target.value, 10))}
              disabled={loading}
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C] font-semibold bg-white disabled:bg-neutral-100"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
              <option value="3">⭐⭐⭐ Good Progress (3/5)</option>
              <option value="2">⭐⭐ Needs Attention (2/5)</option>
              <option value="1">⭐ Critical Support (1/5)</option>
            </select>
          </div>
        </div>

        {/* Syllabus / Topics Covered */}
        <div>
          <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">
            Syllabus / Topics Covered <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={topicsCovered}
            onChange={(e) => setTopicsCovered(e.target.value)}
            rows={2}
            required
            disabled={loading}
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20] disabled:bg-neutral-100"
            placeholder="e.g. Chapter 4: Quadratic Equations & Chapter 5: Arithmetic Progression"
          />
        </div>

        {/* Student Strengths */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
              Student Strengths <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-[#5A6578]">Click to insert</span>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {STRENGTH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => appendText(setStrengths, tag)}
                disabled={loading}
                className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            rows={2}
            required
            disabled={loading}
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20] disabled:bg-neutral-100"
            placeholder="What concepts did they excel in this month?"
          />
        </div>

        {/* Areas for Improvement */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide">
              Areas for Improvement <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-[#5A6578]">Click to insert</span>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {IMPROVEMENT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => appendText(setAreasOfImprovement, tag)}
                disabled={loading}
                className="text-[10px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            value={areasOfImprovement}
            onChange={(e) => setAreasOfImprovement(e.target.value)}
            rows={2}
            required
            disabled={loading}
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20] disabled:bg-neutral-100"
            placeholder="Formulas, calculations, speed, or homework regularity?"
          />
        </div>

        {/* Tutor Note to Parents */}
        <div>
          <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5 block">
            Tutor Note to Parents (Optional)
          </label>
          <textarea
            value={teacherRemarks}
            onChange={(e) => setTeacherRemarks(e.target.value)}
            rows={2}
            disabled={loading}
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-2.5 focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20] disabled:bg-neutral-100"
            placeholder="Guidance for parents to reinforce learning at home..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !assignments || assignments.length === 0}
          className="w-full bg-[#0B192C] hover:bg-[#1E3E62] disabled:bg-[#0B192C]/50 text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 mt-4 shadow-sm cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 text-[#E5A93C] animate-spin" />
              Submitting Report...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} className="text-[#E5A93C]" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
