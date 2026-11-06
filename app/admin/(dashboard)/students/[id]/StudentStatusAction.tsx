"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Save, 
  CheckSquare, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  X,
  History,
  AlertTriangle
} from "lucide-react";

interface Props {
  studentId: string;
  studentName?: string;
  currentStatus: string;
  initialNotes: string | null;
}

export default function StudentStatusAction({
  studentId,
  studentName = "Student",
  currentStatus,
  initialNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "enquiry");
  const [notes, setNotes] = useState(initialNotes || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Modals state
  const [showEndModal, setShowEndModal] = useState(false);
  const [endReason, setEndReason] = useState("Syllabus / Board exams successfully completed");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const STATUS_STYLES: Record<string, string> = {
    enquiry: "bg-purple-50/80 border-purple-200",
    demo: "bg-amber-50/80 border-amber-200",
    enrolled: "bg-emerald-50/80 border-emerald-200",
    completed: "bg-blue-50/80 border-blue-200",
    paused: "bg-orange-50/80 border-orange-200",
    dropped: "bg-red-50/80 border-red-200",
  };

  async function handleUpdateStatus(newStatus: string, customNotes?: string) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentId,
          type: "status",
          status: newStatus,
          notes: customNotes !== undefined ? customNotes : notes,
          reactivateAssignments: newStatus === "enrolled",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setStatus(newStatus);
        setSuccess(`✅ Status updated to ${newStatus.toUpperCase()}`);
        router.refresh();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update student status.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  async function handleConfirmEndTuition(e: React.FormEvent) {
    e.preventDefault();
    setShowEndModal(false);
    await handleUpdateStatus("completed", endReason);
  }

  async function handleDeleteStudent() {
    setDeleteLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentId,
          type: "delete",
        }),
      });

      const data = await res.json();
      setDeleteLoading(false);

      if (res.ok && data.success) {
        setShowDeleteModal(false);
        router.push("/admin/students");
      } else {
        setError(data.error || "Failed to delete student record.");
      }
    } catch (err: any) {
      setDeleteLoading(false);
      setError(err.message || "Network error while deleting student.");
    }
  }

  return (
    <>
      <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${STATUS_STYLES[status] || "bg-white border-[#E8E6DF]"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0B192C] text-sm uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#1E3E62]" /> Student Lifecycle &amp; Status
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-[#E8E6DF] text-[#0B192C]">
            {status}
          </span>
        </div>

        {/* Quick Action Lifecycle Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {status !== "completed" && (
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              disabled={loading}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-700" />
              End Tuition (Complete)
            </button>
          )}

          {status === "enrolled" ? (
            <button
              type="button"
              onClick={() => handleUpdateStatus("paused", "Tuition put on temporary pause")}
              disabled={loading}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
              Pause Tuition
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUpdateStatus("enrolled", "Tuition resumed / reactivated to active enrolled")}
              disabled={loading}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
              Reactivate Enrolled
            </button>
          )}
        </div>

        {/* Status Select & Notes Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateStatus(status, notes);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-bold text-neutral-700 mb-1 block">Enrollment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
            >
              <option value="enquiry">📋 Enquiry (New Lead)</option>
              <option value="demo">📅 Demo Stage (Trial Class)</option>
              <option value="enrolled">✅ Enrolled (Active Tuition)</option>
              <option value="paused">⏸️ Paused (Temporary Break)</option>
              <option value="completed">🎓 Completed (Tuition Concluded)</option>
              <option value="dropped">❌ Dropped / Discontinued</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 mb-1 block">Internal Notes &amp; History</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about requirements, demo outcome, or reason for ending..."
              rows={3}
              className="w-full text-sm rounded-xl border border-[#E8E6DF] p-2.5 bg-white resize-none focus:ring-2 focus:ring-[#0B192C]/20 outline-none font-sans text-neutral-800"
            />
          </div>

          {success && (
            <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-900 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer border-b-[2px] border-[#E5A93C]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" /> Updating Status...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#E5A93C]" /> Save Status &amp; Notes
              </>
            )}
          </button>
        </form>

        {/* Delete Student Danger Zone */}
        <div className="pt-4 mt-4 border-t border-neutral-200/60">
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmText("");
              setShowDeleteModal(true);
            }}
            className="w-full text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Student
          </button>
        </div>
      </div>

      {/* MODAL 1: END TUITION (COMPLETED) */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E8E6DF] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-blue-900">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#0B192C]">End Tuition (Completed)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEndModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5A6578] font-sans leading-relaxed mb-4">
              Marking tuition as <strong>Completed</strong> automatically updates active assignments to completed while <strong>preserving all past session logs, receipts, and progress reports</strong> for future audit.
            </p>

            <form onSubmit={handleConfirmEndTuition} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Completion Reason / Notes *</label>
                <select
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white mb-2"
                >
                  <option value="Board Exams Over (Syllabus Completed)">🎓 Board Exams Over (Syllabus Completed)</option>
                  <option value="Crash Course / Target Achieved">🎯 Crash Course / Target Achieved</option>
                  <option value="Family Relocating / Moving away">📦 Family Relocating / Moving away</option>
                  <option value="Self-Study Phase Before Exams">📖 Self-Study Phase Before Exams</option>
                  <option value="Mutual Conclusion of Classes">🤝 Mutual Conclusion of Classes</option>
                </select>
                <textarea
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded-xl border border-[#E8E6DF] p-2.5 bg-white resize-none"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Completion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE STUDENT CONFIRMATION */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-red-700">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-red-950">Delete Student Record</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs mb-4 leading-relaxed font-sans">
              <strong>Recommendation:</strong> If the student has merely completed their board exams or ended tuition, please use <strong>End Tuition (Completed)</strong> instead. Deletion permanently erases this record and should only be used for test/duplicate entries.
            </div>

            <p className="text-xs text-neutral-600 font-sans mb-3">
              To permanently remove <strong>{studentName}</strong>, type <span className="font-mono font-bold text-red-700">DELETE</span> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full text-sm font-mono border border-neutral-300 rounded-xl p-2.5 mb-4 outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
