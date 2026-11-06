"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  PauseCircle, 
  PlayCircle, 
  UserMinus, 
  Trash2, 
  X,
  AlertTriangle,
  Save,
  Clock
} from "lucide-react";

interface Props {
  teacherId: string;
  teacherName?: string;
  currentStatus: string;
  badgeLevel: string;
  initialNotes: string | null;
  initialRejectionReason: string | null;
}

export default function TeacherApprovalAction({
  teacherId,
  teacherName = "Educator",
  currentStatus,
  badgeLevel,
  initialNotes,
  initialRejectionReason,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "pending");
  const [notes, setNotes] = useState(initialNotes || "");
  const [rejectionReason, setRejectionReason] = useState(initialRejectionReason || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Modals state
  const [showEndModal, setShowEndModal] = useState(false);
  const [endReason, setEndReason] = useState("Tenure completed / Relocated outside Patna");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-50/70 border-amber-200",
    approved: "bg-emerald-50/70 border-emerald-200",
    inactive: "bg-neutral-100 border-neutral-300",
    on_leave: "bg-purple-50/80 border-purple-200",
    suspended: "bg-orange-50/80 border-orange-200",
    rejected: "bg-red-50/70 border-red-200",
  };

  async function handleUpdateStatus(newStatus: string, customNotes?: string) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacherId,
          type: "status",
          status: newStatus,
          internal_notes: customNotes !== undefined ? customNotes : notes,
          rejection_reason: rejectionReason,
          badge_level: newStatus === "approved" ? "verified" : badgeLevel,
          reactivateAssignments: newStatus === "approved",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setStatus(newStatus);
        setSuccess(`✅ Status saved: ${newStatus.toUpperCase()}`);
        router.refresh();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update status. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  async function handleConfirmEndAssociation(e: React.FormEvent) {
    e.preventDefault();
    setShowEndModal(false);
    await handleUpdateStatus("inactive", endReason);
  }

  async function handleDeleteTeacher() {
    setDeleteLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacherId,
          type: "delete",
        }),
      });

      const data = await res.json();
      setDeleteLoading(false);

      if (res.ok && data.success) {
        setShowDeleteModal(false);
        router.push("/admin/teachers");
      } else {
        setError(data.error || "Failed to delete teacher record.");
      }
    } catch (err: any) {
      setDeleteLoading(false);
      setError(err.message || "Network error while deleting teacher.");
    }
  }

  return (
    <>
      <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${STATUS_STYLES[status] || "bg-white border-[#E8E6DF]"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0B192C] text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E3E62]" /> Educator Verification &amp; Lifecycle
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-[#E8E6DF] text-[#0B192C]">
            {status}
          </span>
        </div>

        {/* Quick Action Lifecycle Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {status !== "inactive" && (
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              disabled={loading}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserMinus className="w-3.5 h-3.5 text-neutral-600" />
              End Association
            </button>
          )}

          {status === "approved" ? (
            <button
              type="button"
              onClick={() => handleUpdateStatus("on_leave", "Teacher placed on temporary leave / break")}
              disabled={loading}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PauseCircle className="w-3.5 h-3.5 text-purple-700" />
              Put On Leave
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUpdateStatus("approved", "Teacher reactivated & verified as active")}
              disabled={loading}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
              Approve &amp; Activate
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
            <label className="text-xs font-bold text-neutral-700 mb-1 block">Verification &amp; Association Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white focus:ring-2 focus:ring-[#0B192C]/20 outline-none"
            >
              <option value="pending">⏳ Pending In-Person Verification</option>
              <option value="approved">✅ Approved &amp; Active</option>
              <option value="on_leave">🏖️ On Leave / Temporary Break</option>
              <option value="inactive">📦 Inactive (Association Ended)</option>
              <option value="suspended">⚠️ Suspended (Disciplinary / Inquiry)</option>
              <option value="rejected">❌ Rejected / Ineligible</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 mb-1 block">Internal Bureau Notes (Admin Only)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about background check, interview scores, parent feedback, or end of tenure..."
              rows={3}
              className="w-full text-sm rounded-xl border border-[#E8E6DF] p-2.5 bg-white resize-none focus:ring-2 focus:ring-[#0B192C]/20 outline-none font-sans text-neutral-800"
            />
          </div>

          {status === "rejected" && (
            <div>
              <label className="text-xs font-bold text-red-700 mb-1 block">Rejection Reason</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete ID document, subject test not cleared"
                className="w-full text-sm rounded-xl border border-red-300 p-2.5 bg-white focus:ring-2 focus:ring-red-500/20 outline-none"
              />
            </div>
          )}

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

        {/* Delete Teacher Danger Zone */}
        <div className="pt-4 mt-4 border-t border-neutral-200/60">
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmText("");
              setShowDeleteModal(true);
            }}
            className="w-full text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Educator
          </button>
        </div>
      </div>

      {/* MODAL 1: END ASSOCIATION (INACTIVE) */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E8E6DF] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-neutral-800">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <UserMinus className="w-5 h-5 text-neutral-700" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#0B192C]">End Association (Inactive)</h3>
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
              Setting status to <strong>Inactive</strong> deactivates the teacher and hides their public profile while <strong>preserving all historical payouts, sessions, and verified parent reviews</strong> for tax and legal records.
            </p>

            <form onSubmit={handleConfirmEndAssociation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Reason for Ending Association *</label>
                <select
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white mb-2"
                >
                  <option value="Tenure completed / Relocated outside Patna">📦 Relocated outside Patna / Moved away</option>
                  <option value="Joined Full-Time School or College Job">🏫 Joined Full-Time School or College Job</option>
                  <option value="Higher Studies (M.Tech / PhD / UPSC preparation)">📚 Higher Studies (M.Tech / PhD / UPSC preparation)</option>
                  <option value="Personal / Family Reasons">🏠 Personal / Family Reasons</option>
                  <option value="Mutual Separation">🤝 Mutual Separation</option>
                </select>
                <textarea
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded-xl border border-[#E8E6DF] p-2.5 bg-white resize-none"
                  placeholder="Additional context..."
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-900 text-white shadow-sm flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  End Association
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE TEACHER CONFIRMATION */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-red-700">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-red-950">Delete Educator Record</h3>
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
              <strong>Recommendation:</strong> If the educator is simply leaving or moving, use <strong>End Association (Inactive)</strong> instead. Deletion permanently erases their record and should only be used for accidental duplicate or test profiles.
            </div>

            <p className="text-xs text-neutral-600 font-sans mb-3">
              To permanently remove <strong>{teacherName}</strong>, type <span className="font-mono font-bold text-red-700">DELETE</span> below:
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
                onClick={handleDeleteTeacher}
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
