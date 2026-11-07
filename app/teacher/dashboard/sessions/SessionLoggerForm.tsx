"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle, CheckCircle2, Clock, Calendar, BookOpen } from "lucide-react";

interface Assignment {
  id: string;
  student_id: string;
  subject: string;
  student?: {
    id: string;
    full_name: string;
    parent_name?: string;
    parent_phone?: string;
    parent_whatsapp?: string;
  };
  students?: {
    id: string;
    full_name: string;
    parent_name?: string;
    parent_phone?: string;
    parent_whatsapp?: string;
  };
}

interface Props {
  assignments: Assignment[];
  teacherId: string;
}

export default function SessionLoggerForm({ assignments, teacherId }: Props) {
  const router = useRouter();

  const [assignmentValue, setAssignmentValue] = useState(
    assignments[0] ? `${assignments[0].id}|${assignments[0].student_id || assignments[0].student?.id || assignments[0].students?.id}` : ""
  );
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionStart, setSessionStart] = useState("16:00");
  const [sessionEnd, setSessionEnd] = useState("17:00");
  const [topicsCovered, setTopicsCovered] = useState("");
  const [homeworkGiven, setHomeworkGiven] = useState("");
  const [teacherNotes, setTeacherNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assignmentValue) {
      setError("Please select a student assignment.");
      return;
    }
    if (!topicsCovered.trim()) {
      setError("Please enter the topics or syllabus covered in this class.");
      return;
    }

    const [assignmentId, studentId] = assignmentValue.split("|");

    // Calculate duration in minutes
    let durationMins = 60;
    try {
      const start = new Date(`1970-01-01T${sessionStart}:00`);
      const end = new Date(`1970-01-01T${sessionEnd}:00`);
      const diff = (end.getTime() - start.getTime()) / 60000;
      if (diff > 0) durationMins = Math.round(diff);
    } catch {
      durationMins = 60;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Explicit unique session_id and UUID prevent triggers from evaluating NEXTVAL('session_seq')
      const explicitSessionId = `SES-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      const explicitId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined;

      const res = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: explicitId,
          session_id: explicitSessionId,
          assignment_id: assignmentId,
          student_id: studentId,
          teacher_id: teacherId,
          session_date: sessionDate,
          start_time: sessionStart,
          session_start: sessionStart,
          session_end: sessionEnd,
          duration_mins: durationMins,
          topics_covered: topicsCovered.trim(),
          homework_assigned: homeworkGiven.trim() || null,
          homework_given: homeworkGiven.trim() || null,
          notes: teacherNotes.trim() || null,
          teacher_notes: teacherNotes.trim() || null,
          student_attendance: "present",
          status: "completed",
        }),
      });

      const data = await res.json().catch(() => ({}));
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(`Class recorded successfully (${durationMins} mins)! Details synced to parent portal.`);
        setTopicsCovered("");
        setHomeworkGiven("");
        setTeacherNotes("");
        router.refresh();
        setTimeout(() => setSuccess(""), 6000);
      } else {
        const errorMsg = data.error || data.message || "Failed to log session. Please try again.";
        const isPermissionErr =
          data.code === "SEQUENCE_PERMISSION_DENIED" ||
          /permission denied.*sequence/i.test(errorMsg) ||
          /session_seq/i.test(errorMsg);

        if (isPermissionErr) {
          setError(
            "Database sequence permission error: The system attempted to generate a unique session identifier, but the database sequence 'session_seq' lacks usage permissions. Please try clicking 'Save & Record Class' again to retry with an alternate identifier, or contact bureau tech support."
          );
        } else {
          setError(errorMsg);
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E6DF]">
      <h2 className="text-lg font-bold font-serif text-[#0B192C] mb-6 flex items-center gap-2 border-b border-[#E8E6DF] pb-3">
        <CheckCircle className="w-5 h-5 text-[#E5A93C]" /> Log New Session
      </h2>

      {success && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <p className="font-bold text-rose-950">Notice Logging Class Session</p>
              <p className="font-medium text-rose-800 leading-relaxed">{error}</p>
              {/permission|session_seq|sequence/i.test(error) && (
                <div className="mt-2.5 pt-2.5 border-t border-rose-200/70 text-[11px] text-rose-800">
                  <p className="font-bold text-rose-900 mb-1">Recommended action:</p>
                  <ul className="list-disc list-inside space-y-1 text-rose-700">
                    <li>Click <strong>&ldquo;Save & Record Class&rdquo;</strong> again — the form automatically dispatches an explicit session identifier.</li>
                    <li>If it persists, contact Bureau Support on WhatsApp / Call: <strong>+91 92297 38307</strong>.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
            Select Student *
          </label>
          <select
            value={assignmentValue}
            onChange={(e) => setAssignmentValue(e.target.value)}
            required
            className="w-full text-sm font-semibold border border-[#E8E6DF] rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
          >
            <option value="">Select Student...</option>
            {assignments.map((a) => {
              const studentName = a.student?.full_name || a.students?.full_name || "Student";
              const sId = a.student_id || a.student?.id || a.students?.id;
              return (
                <option key={a.id} value={`${a.id}|${sId}`}>
                  {studentName} ({a.subject || "All Subjects"})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
            Class Date *
          </label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            required
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
              Start Time *
            </label>
            <input
              type="time"
              value={sessionStart}
              onChange={(e) => setSessionStart(e.target.value)}
              required
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
              End Time *
            </label>
            <input
              type="time"
              value={sessionEnd}
              onChange={(e) => setSessionEnd(e.target.value)}
              required
              className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
            Topics / Syllabus Covered *
          </label>
          <input
            type="text"
            value={topicsCovered}
            onChange={(e) => setTopicsCovered(e.target.value)}
            required
            placeholder="e.g. NCERT Chapter 4 - Quadratic Equations Ex 4.2"
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
            Homework Assigned (Optional)
          </label>
          <input
            type="text"
            value={homeworkGiven}
            onChange={(e) => setHomeworkGiven(e.target.value)}
            placeholder="e.g. Exercise 4.2 Q1 to Q8 & Revision Notes"
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 text-[#0B192C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#5A6578] uppercase tracking-wide mb-1.5">
            Tutor Notes (Optional)
          </label>
          <textarea
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            rows={2}
            placeholder="Observations on student understanding, focus, or reminders for next class..."
            className="w-full text-sm border border-[#E8E6DF] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#0B192C]/20 resize-none text-[#1A1D20]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" />
              Saving & Recording Class...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-[#E5A93C]" />
              Save & Record Class
            </>
          )}
        </button>
      </form>
    </div>
  );
}
