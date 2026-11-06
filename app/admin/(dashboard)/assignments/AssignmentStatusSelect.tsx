"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Trash2, StopCircle } from "lucide-react";

interface Props {
  assignmentId: string;
  currentStatus: string;
}

export default function AssignmentStatusSelect({ assignmentId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "active");
  const [updating, setUpdating] = useState(false);

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

  async function handleEndTuition() {
    const reason = window.prompt(
      "End tuition assignment?\nAll sessions, attendance, and fee history will be safely preserved.\n\nOptional completion notes / reason (e.g. 'Syllabus completed for board exams'):"
    );

    // If user cancelled prompt, reason is null
    if (reason === null) return;

    await handleStatusChange("completed", reason);
  }

  async function handleDeleteAssignment() {
    const confirmed = window.confirm(
      "Are you sure you want to PERMANENTLY DELETE this assignment?\n\nWarning: Associated session and commission logs may be affected. If tuition has completed or stopped, consider using 'End Tuition' instead to preserve records."
    );

    if (!confirmed) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignmentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
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
    <div className="flex items-center justify-end gap-1.5">
      {updating ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#5A6578]" />
      ) : (
        <>
          {/* Status Dropdown */}
          <select
            value={status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs border border-[#E8E6DF] rounded-lg px-2 py-1.5 focus:outline-none bg-white text-[#0B192C] font-medium cursor-pointer hover:border-[#0B192C] transition-colors disabled:opacity-50"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Quick End Tuition Button */}
          {!isCompleted && (
            <button
              type="button"
              onClick={handleEndTuition}
              title="End tuition and mark Completed (preserves fee & attendance history)"
              className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">End Tuition</span>
            </button>
          )}

          {/* Delete Assignment Button */}
          <button
            type="button"
            onClick={handleDeleteAssignment}
            title="Permanently delete assignment"
            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
