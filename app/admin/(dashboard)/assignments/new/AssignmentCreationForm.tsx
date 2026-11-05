"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, CheckCircle2, AlertCircle, IndianRupee, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Teacher {
  id: string;
  full_name: string;
  teacher_id: string;
  locality?: string | null;
  subjects?: string[] | null;
  phone?: string | null;
  whatsapp?: string | null;
  verification_status?: string | null;
}

interface Student {
  id: string;
  full_name: string;
  student_id: string;
  class_studying?: string | null;
  locality?: string | null;
  subjects_needed?: string[] | null;
  subjects_required?: string[] | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  parent_whatsapp?: string | null;
  enrollment_status?: string | null;
}

interface Props {
  teachers: Teacher[];
  students: Student[];
  preSelectedTeacherId?: string;
  preSelectedStudentId?: string;
}

export default function AssignmentCreationForm({
  teachers,
  students,
  preSelectedTeacherId,
  preSelectedStudentId,
}: Props) {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState(preSelectedTeacherId || "");
  const [studentId, setStudentId] = useState(preSelectedStudentId || "");
  const [subject, setSubject] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("5000");
  const [classesPerWeek, setClassesPerWeek] = useState("3");
  const [sessionDurationMins, setSessionDurationMins] = useState("60");
  const [sessionDays, setSessionDays] = useState("Mon, Wed, Fri");
  const [sessionTime, setSessionTime] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdAssignment, setCreatedAssignment] = useState<any>(null);

  // Selected entities
  const selectedTeacher = teachers.find((t) => t.id === teacherId);
  const selectedStudent = students.find((s) => s.id === studentId);

  // Auto-fill subject if student has subjects and none selected
  const studentSubjects = selectedStudent?.subjects_needed || selectedStudent?.subjects_required || [];

  const feeNum = parseFloat(monthlyFee) || 0;
  const bureauCommission = Math.round(feeNum * 0.25);
  const teacherPayout = feeNum - bureauCommission;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) {
      setError("Please select a teacher.");
      return;
    }
    if (!studentId) {
      setError("Please select a student.");
      return;
    }
    if (!subject.trim()) {
      setError("Please specify the subject to teach.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          student_id: studentId,
          subject: subject.trim(),
          monthly_fee: feeNum,
          classes_per_week: parseInt(classesPerWeek) || 3,
          session_duration_mins: parseInt(sessionDurationMins) || 60,
          session_days: sessionDays,
          session_time: sessionTime,
          start_date: startDate,
          notes,
          bureau_commission_pct: 25,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setCreatedAssignment(data.assignment);
        router.refresh();
      } else {
        setError(data.error || "Failed to create assignment.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  if (createdAssignment) {
    const teacherName = selectedTeacher?.full_name || "Teacher";
    const studentName = selectedStudent?.full_name || "Student";
    const parentName = selectedStudent?.parent_name || studentName;
    const teacherPhone = selectedTeacher?.whatsapp || selectedTeacher?.phone || "";
    const parentPhone = selectedStudent?.parent_whatsapp || selectedStudent?.parent_phone || "";

    const teacherMsg = `🔔 *New Tuition Assignment!*\n\nDear ${teacherName},\n\nYou have been assigned a new tuition for *${subject}*.\n\nStudent: ${studentName}\nParent/Guardian: ${parentName}\nMonthly Fee: ₹${feeNum.toLocaleString("en-IN")}\nSchedule: ${classesPerWeek} days/week (${sessionDays})\n\nPlease check your Swati HTB dashboard for full address and details.\n\n— Swati Home Tuition Bureau`;
    const teacherWaUrl = `https://wa.me/${teacherPhone.replace(/\D/g, "")}?text=${encodeURIComponent(teacherMsg)}`;

    const parentMsg = `🎓 *Teacher Assigned!*\n\nDear ${parentName},\n\nWe have assigned *${teacherName}* as your home tutor for *${subject}* (${studentName}).\n\nFee: ₹${feeNum.toLocaleString("en-IN")}/month\nSchedule: ${classesPerWeek} days/week\n\nYou can track all classes and progress reports in your parent portal.\n\n— Swati Home Tuition Bureau`;
    const parentWaUrl = `https://wa.me/${parentPhone.replace(/\D/g, "")}?text=${encodeURIComponent(parentMsg)}`;

    return (
      <div className="bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-bold font-serif text-[#1F2937]">Assignment Created!</h2>
          <p className="text-neutral-500 text-sm mt-1">
            <span className="font-semibold text-neutral-800">{teacherName}</span> is now assigned to teach{" "}
            <span className="font-semibold text-neutral-800">{subject}</span> to{" "}
            <span className="font-semibold text-neutral-800">{studentName}</span>.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Monthly Fee:</span>
            <span className="font-bold text-[#1F2937]">₹{feeNum.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Bureau Commission (25%):</span>
            <span className="font-bold text-purple-700">₹{bureauCommission.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Teacher Earning (75%):</span>
            <span className="font-bold text-emerald-700">₹{teacherPayout.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Instant 1-Click Notifications</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={teacherPhone ? teacherWaUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => !teacherPhone && e.preventDefault()}
              className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                teacherPhone
                  ? "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <MessageCircle className="w-4 h-4" /> Notify Teacher on WhatsApp
            </a>

            <a
              href={parentPhone ? parentWaUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => !parentPhone && e.preventDefault()}
              className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                parentPhone
                  ? "bg-[#0F4C5C] hover:bg-[#0a3a47] text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <MessageCircle className="w-4 h-4" /> Notify Parent on WhatsApp
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-center gap-4">
          <Link
            href="/admin/assignments"
            className="px-6 py-2.5 rounded-xl border border-neutral-300 font-semibold text-sm hover:bg-neutral-50 transition-colors"
          >
            Go to All Assignments
          </Link>
          <button
            onClick={() => {
              setCreatedAssignment(null);
              setSubject("");
            }}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-black transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-200/60 space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#0F4C5C]" /> New Teacher ↔ Student Assignment
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Link an active home tutor to a student enquiry or enrollment with fee and schedule configuration.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teacher Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Select Teacher *
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            className="w-full text-sm font-semibold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            <option value="">-- Choose Teacher --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name} ({t.teacher_id || "ID"}) · {t.locality || "Patna"} · {t.verification_status === "approved" ? "Verified" : t.verification_status || "Pending"}
              </option>
            ))}
          </select>
          {selectedTeacher && (
            <p className="text-xs text-neutral-500">
              Subjects taught: {selectedTeacher.subjects?.join(", ") || "General"}
            </p>
          )}
        </div>

        {/* Student Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Select Student *
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full text-sm font-semibold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.student_id || "ID"}) · Class {s.class_studying || "?"} · {s.locality || "Patna"}
              </option>
            ))}
          </select>
          {selectedStudent && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs text-neutral-500">Needed:</span>
              {studentSubjects.map((sub, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSubject(sub)}
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 hover:bg-[#0F4C5C] hover:text-white transition-colors"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Subject to Teach *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics & Science"
            required
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Monthly Fee */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Monthly Fee (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="5000"
              min="0"
              step="100"
              required
              className="w-full pl-8 text-sm font-bold rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
          </div>
        </div>

        {/* Classes Per Week */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Classes Per Week
          </label>
          <select
            value={classesPerWeek}
            onChange={(e) => setClassesPerWeek(e.target.value)}
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                {num} days per week
              </option>
            ))}
          </select>
        </div>

        {/* Session Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Class Duration
          </label>
          <select
            value={sessionDurationMins}
            onChange={(e) => setSessionDurationMins(e.target.value)}
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes (1 Hour)</option>
            <option value="90">90 Minutes (1.5 Hours)</option>
            <option value="120">120 Minutes (2 Hours)</option>
          </select>
        </div>

        {/* Session Days */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Session Days
          </label>
          <input
            type="text"
            value={sessionDays}
            onChange={(e) => setSessionDays(e.target.value)}
            placeholder="Mon, Wed, Fri"
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Session Preferred Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Session Time (Optional)
          </label>
          <input
            type="time"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Tuition Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
            Special Notes / Instructions
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special syllabus focus, demo feedback, exam dates..."
            rows={2}
            className="w-full text-sm rounded-xl border border-neutral-300 p-3 bg-white resize-none focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>
      </div>

      {/* Live Financial Breakdown Card */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Automated Fee Split</p>
          <p className="text-sm font-semibold text-[#1F2937] mt-0.5">
            Total Monthly Fee: <span className="font-bold">₹{feeNum.toLocaleString("en-IN")}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-left sm:text-right">
            <p className="text-xs text-neutral-500">Teacher Earning (75%)</p>
            <p className="text-base font-bold text-emerald-600">₹{teacherPayout.toLocaleString("en-IN")}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-neutral-500">Bureau Commission (25%)</p>
            <p className="text-base font-bold text-purple-600">₹{bureauCommission.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Assignment...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Create & Activate Assignment
            </>
          )}
        </button>

        <Link
          href="/admin/assignments"
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
