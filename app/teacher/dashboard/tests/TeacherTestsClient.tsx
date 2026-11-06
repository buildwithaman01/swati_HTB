"use client";

import { useState, useMemo } from "react";
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
  Search,
  Filter,
  TrendingUp,
  Percent,
  Check,
  Tag,
  BookOpen,
} from "lucide-react";
import { formatWhatsAppUrl, PARENT_LOGIN_URL, CANONICAL_SUPPORT_PHONE_DISPLAY } from "@/lib/whatsapp";

interface Assignment {
  id: string;
  subject: string;
  student: {
    id: string;
    full_name: string;
    class_studying?: string;
    parent_name?: string;
    parent_phone?: string;
    whatsapp?: string;
    parent_whatsapp?: string;
  };
}

interface TestRecord {
  id: string;
  report_month: string;
  topics_covered: string;
  test_scores: string;
  overall_rating?: number;
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
    whatsapp?: string;
    parent_whatsapp?: string;
  };
}

interface Props {
  teacherId: string;
  teacherName: string;
  assignments: Assignment[];
  initialTests: TestRecord[];
}

const SAMPLE_TITLES = [
  "Class 10 CBSE Physics - Electricity & Magnetism",
  "Class 10 CBSE Maths - Quadratic Equations & AP",
  "Class 12 CBSE Chemistry - Chemical Kinetics",
  "Class 9 ICSE Biology - Cell & Tissue Architecture",
  "Class 11 Science - Laws of Motion & Friction",
  "Class 8 All Subjects - Mid-Term Revision Assessment",
];

// Helper to determine performance badge and styling from percentage
export function getPerformanceBadge(percentage: number): {
  label: string;
  badgeClass: string;
  badgeText: string;
} {
  if (percentage >= 90) {
    return {
      label: "Outstanding",
      badgeText: `Outstanding (${percentage}%)`,
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  } else if (percentage >= 75) {
    return {
      label: "Excellent",
      badgeText: `Excellent (${percentage}%)`,
      badgeClass: "bg-[#1E3E62]/10 text-[#1E3E62] border-[#1E3E62]/20",
    };
  } else if (percentage >= 60) {
    return {
      label: "Good Progress",
      badgeText: `Good Progress (${percentage}%)`,
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    };
  } else if (percentage >= 45) {
    return {
      label: "Average",
      badgeText: `Average (${percentage}%)`,
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
    };
  } else {
    return {
      label: "Needs Attention",
      badgeText: `Needs Attention (${percentage}%)`,
      badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    };
  }
}

// Parse embedded metadata from remarks or parse test_scores string
export function parseTestDetails(test: TestRecord) {
  let meta: any = null;
  try {
    const match = (test.teacher_remarks || "").match(/<!--TEST_META:(.*?)-->/s);
    if (match && match[1]) {
      meta = JSON.parse(match[1]);
    }
  } catch {}

  // Parse scores string e.g. "46/50 (92%)"
  let obtained = meta?.obtained_marks;
  let total = meta?.total_marks;
  let percentage = meta?.percentage;

  if (percentage === undefined && test.test_scores) {
    const pctMatch = test.test_scores.match(/(\d+(?:\.\d+)?)\s*%/);
    if (pctMatch) {
      percentage = Math.round(parseFloat(pctMatch[1]));
    }
    const scoreMatch = test.test_scores.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (scoreMatch) {
      obtained = parseFloat(scoreMatch[1]);
      total = parseFloat(scoreMatch[2]);
      if (percentage === undefined && total > 0) {
        percentage = Math.round((obtained / total) * 100);
      }
    }
  }

  const finalPercentage = percentage ?? 75;
  const badgeInfo = getPerformanceBadge(finalPercentage);

  // Extract clean remarks
  const cleanedRemarks = (test.teacher_remarks || "")
    .replace(/<!--TEST_META:.*?-->/gs, "")
    .replace(/Test Paper Link:\s*https?:\/\/[^\s|]+/gi, "")
    .replace(/Remarks:\s*/i, "")
    .replace(/\|\s*$/, "")
    .trim();

  // Extract test paper URL
  const paperMatch = (test.teacher_remarks || "").match(/Test Paper Link:\s*(https?:\/\/[^\s|]+)/i);
  const paperUrl = meta?.test_paper_url || (paperMatch ? paperMatch[1] : "");

  // Extract key topics
  let topics = meta?.key_topics || "";
  let title = meta?.test_title || test.topics_covered;

  if (!topics && test.topics_covered) {
    const topicsMatch = test.topics_covered.match(/\(Topics:\s*([^)]+)\)/i);
    if (topicsMatch) {
      topics = topicsMatch[1];
      title = test.topics_covered.replace(/\(Topics:\s*[^)]+\)/i, "").trim();
    }
  }

  return {
    title,
    topics,
    obtained,
    total,
    percentage: finalPercentage,
    badgeInfo,
    cleanedRemarks,
    paperUrl,
  };
}

export default function TeacherTestsClient({
  teacherId,
  teacherName,
  assignments,
  initialTests,
}: Props) {
  const router = useRouter();

  // Form State
  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id || "");
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalMarks, setTotalMarks] = useState("50");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [keyTopics, setKeyTopics] = useState("");
  const [remarks, setRemarks] = useState("");
  const [testPaperUrl, setTestPaperUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tests, setTests] = useState<TestRecord[]>(initialTests);

  // Filter State
  const [filterStudentId, setFilterStudentId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedAssignment = assignments.find((a) => a.id === assignmentId);

  // Live Percentage Calculation
  const tot = parseFloat(totalMarks) || 100;
  const obt = parseFloat(obtainedMarks) || 0;
  const pct = tot > 0 ? Math.round((obt / tot) * 100) : 0;
  const liveBadge = getPerformanceBadge(pct);

  // Metrics
  const stats = useMemo(() => {
    const totalCount = tests.length;
    if (totalCount === 0) return { totalCount: 0, avgPct: 0, highestScore: 0 };

    let sumPct = 0;
    let maxPct = 0;
    tests.forEach((t) => {
      const { percentage } = parseTestDetails(t);
      sumPct += percentage;
      if (percentage > maxPct) maxPct = percentage;
    });

    return {
      totalCount,
      avgPct: Math.round(sumPct / totalCount),
      highestScore: maxPct,
    };
  }, [tests]);

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const studentMatch =
        filterStudentId === "all" ||
        t.student?.id === filterStudentId ||
        t.assignment?.id === filterStudentId;

      const q = searchQuery.toLowerCase().trim();
      const queryMatch =
        !q ||
        t.topics_covered.toLowerCase().includes(q) ||
        (t.student?.full_name || "").toLowerCase().includes(q) ||
        (t.teacher_remarks || "").toLowerCase().includes(q);

      return studentMatch && queryMatch;
    });
  }, [tests, filterStudentId, searchQuery]);

  async function handleCreateTest(e: React.FormEvent) {
    e.preventDefault();
    if (!assignmentId) {
      setError("Please select a student assignment.");
      return;
    }
    if (!testTitle.trim()) {
      setError("Please enter the test title (e.g. Class 10 CBSE Physics - Electricity & Magnetism).");
      return;
    }
    if (obtainedMarks === "" || isNaN(obt)) {
      setError("Please enter valid marks obtained by the student.");
      return;
    }
    if (obt > tot) {
      setError(`Marks obtained (${obt}) cannot exceed maximum marks (${tot}).`);
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
          key_topics: keyTopics.trim(),
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
        setSuccess(
          `Test published successfully: "${testTitle}" · Score: ${obt}/${tot} (${liveBadge.badgeText})`
        );
        setTestTitle("");
        setObtainedMarks("");
        setKeyTopics("");
        setRemarks("");
        setTestPaperUrl("");

        if (data.test) {
          setTests((prev) => [
            {
              ...data.test,
              student: selectedAssignment?.student,
              assignment: {
                id: selectedAssignment?.id || "",
                subject: selectedAssignment?.subject || "",
              },
            },
            ...prev,
          ]);
        }
        router.refresh();
        setTimeout(() => setSuccess(""), 6000);
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
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">
              Tests Conducted
            </p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">
              {stats.totalCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3E62] text-white flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6 text-[#E5A93C]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">
              Batch Average
            </p>
            <p className="text-2xl font-bold font-serif text-[#0B192C] mt-0.5">
              {stats.avgPct > 0 ? `${stats.avgPct}%` : "—"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E6DF] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">
              Top Score
            </p>
            <p className="text-2xl font-bold font-serif text-emerald-800 mt-0.5">
              {stats.highestScore > 0 ? `${stats.highestScore}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Test Creation Form */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8E6DF]">
        <div className="flex items-center gap-3 mb-6 border-b border-[#E8E6DF] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-white flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 text-[#E5A93C]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#0B192C]">
              Record Student Test / Assessment
            </h2>
            <p className="text-xs text-[#5A6578] mt-0.5 font-medium">
              Log chapter marks and performance badges. Results sync immediately with the Parent Portal.
            </p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12 text-[#5A6578] bg-[#F9F8F5] rounded-2xl border border-[#E8E6DF] p-6">
            <GraduationCap className="w-10 h-10 mx-auto text-[#5A6578]/50 mb-2" />
            <p className="text-sm font-bold text-[#0B192C]">No Active Student Assignments Found</p>
            <p className="text-xs mt-1 text-[#5A6578]">
              Once Swati Home Tuition Bureau assigns you students in Patna, you can record and track all assessments here.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateTest} className="space-y-6">
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {success}
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-sm font-bold text-rose-900 flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Student Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Select Student *
                </label>
                <select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  required
                  className="w-full text-sm font-semibold rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.student.full_name} ({a.subject}) · Class {a.student.class_studying || "?"}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Test Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Test Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    required
                    className="w-full text-sm font-medium rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                  />
                </div>
              </div>

              {/* 3. Test Title */}
              <div className="md:col-span-2 lg:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. Class 10 CBSE Physics - Electricity & Magnetism"
                  required
                  className="w-full text-sm rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C] font-medium"
                />
              </div>

              {/* Quick Sample Title Chips */}
              <div className="md:col-span-2 lg:col-span-3 -mt-2">
                <p className="text-[11px] font-semibold text-[#5A6578] mb-1">
                  Quick Examples:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_TITLES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTestTitle(st)}
                      className="text-[11px] font-medium bg-[#F9F8F5] text-[#1E3E62] hover:bg-[#E8E6DF] px-2.5 py-1 rounded-lg border border-[#E8E6DF] transition-colors text-left"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Maximum Marks */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Maximum / Total Marks *
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  min="1"
                  required
                  placeholder="50"
                  className="w-full text-sm font-bold rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                />
              </div>

              {/* 5. Marks Obtained */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
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
                  placeholder="e.g. 46"
                  className="w-full text-sm font-bold rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                />
              </div>

              {/* 6. Dynamic Live Percentage & Badge Indicator */}
              <div className="p-3 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#5A6578] uppercase">
                      Calculated Percentage
                    </p>
                    <p className="text-xl font-bold font-serif text-[#0B192C] mt-0.5">
                      {obtainedMarks !== "" ? `${pct}%` : "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
                      obtainedMarks !== ""
                        ? liveBadge.badgeClass
                        : "bg-neutral-100 text-neutral-500 border-neutral-200"
                    }`}
                  >
                    {obtainedMarks !== "" ? liveBadge.badgeText : "Awaiting Marks"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E8E6DF] rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      pct >= 75
                        ? "bg-emerald-600"
                        : pct >= 50
                        ? "bg-[#1E3E62]"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>

              {/* 7. Key Topics Covered */}
              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Key Topics Covered (Comma-separated)
                </label>
                <input
                  type="text"
                  value={keyTopics}
                  onChange={(e) => setKeyTopics(e.target.value)}
                  placeholder="e.g. Ohm's Law, Resistance in Series/Parallel, Electric Power & Heating Effect"
                  className="w-full text-sm rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                />
              </div>

              {/* 8. Teacher Remarks & Actionable Feedback */}
              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Teacher Remarks & Feedback (Parents read this directly)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="e.g. Excellent grasp of conceptual definitions and circuit diagrams. Advised student to practice 5 additional numericals on Joule's heating law."
                  className="w-full text-sm rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none resize-none text-[#1A1D20]"
                />
              </div>

              {/* 9. Question Paper Link (Optional) */}
              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wide block">
                  Question Paper / Solutions Link (Optional Google Drive or Cloud URL)
                </label>
                <input
                  type="url"
                  value={testPaperUrl}
                  onChange={(e) => setTestPaperUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/..."
                  className="w-full text-sm rounded-xl border border-[#E8E6DF] p-3 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none text-[#0B192C]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" />
                    Publishing Test Result...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#E5A93C]" />
                    Publish Test Result & Notify Parent
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Structured List of Conducted Tests */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8E6DF] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#0B192C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E5A93C]" />
              Conducted Tests & Performance Records ({filteredTests.length})
            </h2>
            <p className="text-xs text-[#5A6578] mt-0.5">
              Verified chapter assessments with automatic performance badge scoring.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            {assignments.length > 1 && (
              <select
                value={filterStudentId}
                onChange={(e) => setFilterStudentId(e.target.value)}
                className="text-xs font-semibold rounded-xl border border-[#E8E6DF] px-3 py-2 bg-[#F9F8F5] text-[#0B192C] outline-none"
              >
                <option value="all">All Students</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.student.id}>
                    {a.student.full_name}
                  </option>
                ))}
              </select>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5A6578] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic or student..."
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] outline-none focus:bg-white text-[#0B192C] w-48"
              />
            </div>
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-16 text-[#5A6578]">
            <FileText className="w-12 h-12 mx-auto mb-2 text-[#5A6578]/40" />
            <p className="text-sm font-bold text-[#0B192C]">No Conducted Tests Found</p>
            <p className="text-xs text-[#5A6578] mt-1 max-w-sm mx-auto">
              {searchQuery || filterStudentId !== "all"
                ? "No test results match your search filters. Try clearing the search query."
                : "Record chapter assessments using the form above. Results will be structured and badged here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const {
                title,
                topics,
                obtained,
                total,
                percentage,
                badgeInfo,
                cleanedRemarks,
                paperUrl,
              } = parseTestDetails(test);

              const studentName = test.student?.full_name || "Student";
              const studentClass = test.student?.class_studying
                ? `Class ${test.student.class_studying}`
                : "";
              const parentPhone =
                test.student?.whatsapp || test.student?.parent_whatsapp || test.student?.parent_phone || "";

              const waMsg = `📊 *Tuition Assessment Result Alert!*\n\nDear Parent of ${studentName},\n\nTeacher ${teacherName} has uploaded a new test score:\n\n📝 *Assessment:* ${title}\n📅 *Date:* ${test.report_month}\n🎯 *Score:* ${test.test_scores}\n🏆 *Performance:* ${badgeInfo.badgeText}\n${
                topics ? `📚 *Topics Covered:* ${topics}\n` : ""
              }${
                cleanedRemarks ? `💬 *Teacher Feedback:* ${cleanedRemarks}\n` : ""
              }\nYou can review all verified progress reports on your Parent Portal:\n🔗 ${PARENT_LOGIN_URL}\n\n📞 Support: ${CANONICAL_SUPPORT_PHONE_DISPLAY}\n— Swati Home Tuition Bureau, Patna`;

              const waUrl = parentPhone ? formatWhatsAppUrl(parentPhone, waMsg) : "";

              return (
                <div
                  key={test.id}
                  className="border border-[#E8E6DF] rounded-2xl p-5 bg-[#F9F8F5]/60 hover:bg-white transition-all space-y-3.5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#0B192C] text-base font-serif">
                          {title}
                        </h3>
                        <span className="text-xs bg-[#1E3E62]/10 text-[#1E3E62] font-bold px-2.5 py-0.5 rounded-full border border-[#1E3E62]/20">
                          {studentName} {studentClass ? `(${studentClass})` : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#5A6578] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                          {new Date(test.report_month).toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {test.assignment?.subject && (
                          <span className="flex items-center gap-1 font-semibold text-[#1E3E62]">
                            <BookOpen className="w-3.5 h-3.5" />
                            {test.assignment.subject}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Performance Badge & Score */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${badgeInfo.badgeClass}`}
                          >
                            {badgeInfo.badgeText}
                          </span>
                        </div>
                        <p className="text-xs font-mono font-bold text-[#0B192C] mt-1">
                          {test.test_scores}
                        </p>
                      </div>

                      {/* WhatsApp Share Button */}
                      {parentPhone && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#25D366]/30"
                          title="Share verified result with parent on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#128C7E]" />
                          Share
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Key Topics Tag Row */}
                  {topics && (
                    <div className="flex items-center gap-1.5 text-xs text-[#5A6578] flex-wrap">
                      <Tag className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                      <span className="font-bold text-[#0B192C]">Topics:</span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8E6DF] text-[#1E3E62] font-medium">
                        {topics}
                      </span>
                    </div>
                  )}

                  {/* Teacher Feedback / Remarks */}
                  {cleanedRemarks && (
                    <div className="bg-white p-3 rounded-xl border border-[#E8E6DF] text-xs text-[#1A1D20] leading-relaxed">
                      <span className="font-bold text-[#0B192C] mr-1.5">Feedback:</span>
                      {cleanedRemarks}
                    </div>
                  )}

                  {/* Paper Link if present */}
                  {paperUrl && (
                    <div className="pt-1">
                      <a
                        href={paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#1E3E62] font-bold hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Question Paper / Solutions
                      </a>
                    </div>
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
