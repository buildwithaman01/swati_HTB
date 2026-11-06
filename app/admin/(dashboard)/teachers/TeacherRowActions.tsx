"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserCheck, 
  MoreVertical, 
  UserMinus, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Loader2,
  X
} from "lucide-react";

interface Props {
  teacherId: string;
  teacherName: string;
  currentStatus: string;
}

export default function TeacherRowActions({
  teacherId,
  teacherName,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endReason, setEndReason] = useState("Tenure completed / Relocated outside Patna");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleQuickStatus(status: string, reason?: string) {
    setLoading(true);
    setOpen(false);

    try {
      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacherId,
          type: "status",
          status,
          internal_notes: reason || `Quick action: status changed to ${status}`,
          reactivateAssignments: status === "approved",
        }),
      });

      setLoading(false);
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update teacher status");
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to update teacher status");
    }
  }

  async function handleDelete() {
    setLoading(true);
    setShowDeleteModal(false);

    try {
      const res = await fetch("/api/admin/update-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: teacherId,
          type: "delete",
        }),
      });

      setLoading(false);
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete teacher");
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to delete teacher");
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1.5 relative">
        <Link 
          href={`/admin/teachers/${teacherId}`} 
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#0B192C] hover:bg-neutral-50 border border-[#E8E6DF] px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
          title="Review and edit educator profile"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#1E3E62]" /> Edit
        </Link>

        {/* Quick Lifecycle Action Button */}
        {currentStatus === "approved" ? (
          <button
            type="button"
            onClick={() => handleQuickStatus("on_leave", "Educator placed on temporary break")}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Mark educator on leave"
          >
            <PauseCircle className="w-3 h-3 text-purple-700" /> Leave
          </button>
        ) : (currentStatus === "on_leave" || currentStatus === "inactive" || currentStatus === "pending") ? (
          <button
            type="button"
            onClick={() => handleQuickStatus("approved")}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Approve and activate educator"
          >
            <PlayCircle className="w-3 h-3 text-emerald-700" /> Activate
          </button>
        ) : null}

        {/* More Dropdown */}
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
                {currentStatus !== "inactive" && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setShowEndModal(true);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-100 text-neutral-800 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <UserMinus className="w-3.5 h-3.5 text-neutral-600" /> End Association (Inactive)
                  </button>
                )}

                {currentStatus !== "on_leave" && currentStatus !== "inactive" && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatus("on_leave")}
                    className="w-full px-3 py-2 text-left hover:bg-purple-50 text-purple-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-purple-600" /> Put On Leave
                  </button>
                )}

                {currentStatus !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatus("approved")}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-emerald-900 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-600" /> Approve &amp; Activate
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
                  <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete Educator
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End Association Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E8E6DF]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-base text-[#0B192C]">End Association: {teacherName}</h4>
              <button onClick={() => setShowEndModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#5A6578] mb-3">
              Safely deactivates educator while preserving past payouts, session logs, student reviews, and audit records.
            </p>
            <select
              value={endReason}
              onChange={(e) => setEndReason(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-[#E8E6DF] p-2.5 bg-white mb-4"
            >
              <option value="Tenure completed / Relocated outside Patna">Relocated outside Patna</option>
              <option value="Joined Full-Time School or College Job">Joined Full-Time Job</option>
              <option value="Higher Studies (M.Tech / UPSC prep)">Higher Studies / Competitive Prep</option>
              <option value="Personal / Family Reasons">Personal / Family Reasons</option>
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
                  handleQuickStatus("inactive", endReason);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 hover:bg-neutral-900 text-white shadow-2xs"
              >
                Confirm Inactive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-red-200">
            <h4 className="font-display font-bold text-base text-red-950 mb-2">Permanently Delete Educator?</h4>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 mb-3 space-y-1">
              <p className="font-bold">⚠️ Irreversible Deletion Warning:</p>
              <p>
                Are you sure you want to permanently delete <strong>{teacherName}</strong>? If their association has simply concluded, click <strong>Cancel</strong> and choose <strong>End Association</strong> to preserve historical payout and session records.
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
