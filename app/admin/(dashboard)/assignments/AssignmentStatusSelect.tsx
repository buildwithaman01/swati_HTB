"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, StopCircle, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  assignmentId: string;
  currentStatus: string;
}

export default function AssignmentStatusSelect({ assignmentId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "active");
  const [updating, setUpdating] = useState(false);

  // Modal dialog states
  const [showEndModal, setShowEndModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [endReason, setEndReason] = useState("");

  async function handleStatusChange(newStatus: string, reason?: string) {
    if (!newStatus) return;
    setUpdating(true);

    try {
      const res = await fetch("/api/admin/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: assignmentId,
          status: newStatus,
          cancellation_reason: reason || null,
        }),
      });

      if (res.ok) {
        setStatus(newStatus);
        setShowEndModal(false);
        setEndReason("");
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to update assignment status.");
      }
    } catch {
      alert("Network error updating status.");
    } finally {
      setUpdating(false);
    }
  }

  async function confirmDeleteAssignment() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignmentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteModal(false);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to delete assignment.");
      }
    } catch {
      alert("Network error deleting assignment.");
    } finally {
      setUpdating(false);
    }
  }

  const isCompleted = status === "completed";

  return (
    <>
      <div className="flex items-center justify-end gap-1.5 flex-wrap">
        {updating ? (
          <div className="flex items-center gap-1.5 text-xs text-[#5A6578] py-1 px-2 bg-[#F9F8F5] rounded-lg border border-[#E8E6DF]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B192C]" />
            <span className="hidden sm:inline">Saving...</span>
          </div>
        ) : (
          <>
            {/* Status Dropdown */}
            <select
              value={status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              aria-label="Assignment status"
              className="text-xs border border-[#E8E6DF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]/10 bg-white text-[#0B192C] font-semibold cursor-pointer hover:border-[#0B192C] transition-colors disabled:opacity-50 shadow-2xs"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Quick End Tuition (Amber Gold Accent) */}
            {!isCompleted && (
              <button
                type="button"
                onClick={() => setShowEndModal(true)}
                title="End tuition and mark Completed (preserves all records)"
                className="px-2.5 py-1.5 rounded-lg border border-[#E5A93C]/40 bg-[#E5A93C]/10 text-[#0B192C] hover:bg-[#E5A93C] hover:text-[#0B192C] transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-2xs active:scale-[0.98]"
              >
                <StopCircle className="w-3.5 h-3.5 text-[#B87C1C]" />
                <span>End Tuition</span>
              </button>
            )}

            {/* Delete Assignment Button (Danger Action) */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              title="Permanently delete assignment"
              aria-label="Delete assignment"
              className="p-1.5 px-2 rounded-lg border border-red-200/80 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 text-xs shrink-0 active:scale-[0.98]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* ── MODAL: End Tuition Confirmation ── */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E8E6DF] shadow-[0_20px_50px_rgba(11,25,44,0.2)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 text-[#B87C1C] flex items-center justify-center">
                  <StopCircle className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-[#0B192C]">
                  End Tuition Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#5A6578]">
              <p>
                Are you sure you want to conclude this tuition and mark it as <strong>Completed</strong>?
              </p>
              <div className="p-3 bg-[#005F56]/10 rounded-xl border border-[#005F56]/20 text-xs space-y-1.5">
                <p className="font-bold text-[#005F56] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#005F56]" />
                  Safe Archival — Historical Records Intact:
                </p>
                <p className="text-[#0B192C]">
                  • All past attendance records, conducted sessions, and syllabus logs remain safely preserved.
                </p>
                <p className="text-[#0B192C]">
                  • Student test scores, monthly reports, and billing history stay accessible on both Parent and Teacher portals.
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                  Completion Notes / Reason (Optional)
                </label>
                <input
                  type="text"
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  placeholder="e.g. Completed syllabus for 10th boards, Student shifted..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] text-[#0B192C] focus:outline-none focus:border-[#0B192C] focus:bg-white transition-all placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E6DF]">
              <button
                type="button"
                disabled={updating}
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] hover:bg-[#F3F1EC] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusChange("completed", endReason)}
                className="px-4 py-2 text-xs font-bold bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StopCircle className="w-3.5 h-3.5" />}
                Confirm & End Tuition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Assignment Confirmation ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E8E6DF] shadow-[0_20px_50px_rgba(11,25,44,0.2)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-red-950">
                  Delete Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#5A6578]">
              <p>
                Are you sure you want to <strong className="text-red-700">permanently delete</strong> this assignment?
              </p>
              <div className="p-3 bg-red-50 rounded-xl border border-red-300 text-xs text-red-950 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  Irreversible Deletion Warning:
                </p>
                <p className="leading-relaxed">
                  This will completely erase this assignment record from the database. Any sessions or tests linked specifically to this assignment ID may become detached.
                </p>
                <p className="font-semibold text-red-900 pt-1 border-t border-red-200">
                  If this student&apos;s tuition has naturally concluded (e.g., exams finished or syllabus completed), please <strong>Cancel</strong> and click <strong>End Tuition</strong> instead.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E6DF]">
              <button
                type="button"
                disabled={updating}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] hover:bg-[#F3F1EC] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={confirmDeleteAssignment}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
