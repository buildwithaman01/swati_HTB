"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserCheck, 
  MoreVertical, 
  CheckSquare, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Loader2,
  X
} from "lucide-react";

interface Props {
  studentId: string;
  studentName: string;
  currentStatus: string;
}

export default function StudentRowActions({
  studentId,
  studentName,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endReason, setEndReason] = useState("Board exams / Syllabus completed");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleQuickStatus(status: string, reason?: string) {
    setLoading(true);
    setOpen(false);

    try {
      const res = await fetch("/api/admin/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentId,
          type: "status",
          status,
          notes: reason || `Quick action: status changed to ${status}`,
          reactivateAssignments: status === "enrolled",
        }),
      });

      setLoading(false);
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to update status");
    }
  }

  async function handleDelete() {
    setLoading(true);
    setShowDeleteModal(false);

    try {
      const res = await fetch("/api/admin/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentId,
          type: "delete",
        }),
      });

      setLoading(false);
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete student");
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to delete student");
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1.5 relative">
        <Link 
          href={`/admin/students/${studentId}`} 
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#0B192C] hover:bg-neutral-50 border border-[#E8E6DF] px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
          title="View full student profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#1E3E62]" /> Details
        </Link>

        {/* Quick Lifecycle Action Button */}
        {currentStatus === "enrolled" ? (
          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Mark tuition as completed (preserves history)"
          >
            <CheckSquare className="w-3 h-3 text-blue-700" /> End
          </button>
        ) : currentStatus === "paused" ? (
          <button
            type="button"
            onClick={() => handleQuickStatus("enrolled")}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Reactivate tuition"
          >
            <PlayCircle className="w-3 h-3 text-emerald-700" /> Resume
          </button>
        ) : null}

        {/* More dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            disabled={loading}
            className="p-1.5 text-neutral-400 hover:text-[#0B192C] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="More actions"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-30 w-48 bg-white rounded-xl shadow-lg border border-[#E8E6DF] py-1 text-xs text-left animate-in fade-in duration-100 font-sans">
                {currentStatus !== "completed" && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setShowEndModal(true);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 text-blue-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> End Tuition (Complete)
                  </button>
                )}

                {currentStatus !== "paused" && currentStatus !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatus("paused")}
                    className="w-full px-3 py-2 text-left hover:bg-amber-50 text-amber-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-amber-600" /> Pause Tuition
                  </button>
                )}

                {currentStatus !== "enrolled" && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatus("enrolled")}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-emerald-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-600" /> Set as Enrolled
                  </button>
                )}

                <div className="h-px bg-[#E8E6DF] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-700 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete Student
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End Tuition Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E8E6DF]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-base text-[#0B192C]">End Tuition for {studentName}</h4>
              <button onClick={() => setShowEndModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#5A6578] mb-3">
              Safely marks status as <strong>Completed</strong> and archives active tuitions. All historical attendance logs, session reports, and payment records remain permanently preserved.
            </p>
            <select
              value={endReason}
              onChange={(e) => setEndReason(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white mb-4"
            >
              <option value="Board Exams Over (Syllabus Completed)">Board Exams Over</option>
              <option value="Crash Course Completed">Crash Course Completed</option>
              <option value="Student Moving Out of Patna">Moving Out of Patna</option>
              <option value="Tuition Target Achieved">Target Achieved</option>
            </select>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowEndModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndModal(false);
                  handleQuickStatus("completed", endReason);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-2xs"
              >
                End Tuition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-red-200">
            <h4 className="font-display font-bold text-base text-red-950 mb-2">Permanently Delete Student?</h4>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 mb-3 space-y-1">
              <p className="font-bold">⚠️ Irreversible Deletion Warning:</p>
              <p>
                This will permanently delete <strong>{studentName}</strong> and their records. If tuition has merely ended or exams are over, click <strong>Cancel</strong> and choose <strong>End Tuition</strong> to preserve session logs and payment history.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-2xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
