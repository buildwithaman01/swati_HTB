"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Ban, CheckCircle, Loader2, RotateCcw } from "lucide-react";

interface Props {
  sessionId: string;
  currentStatus: string;
}

export default function SessionRowActions({ sessionId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isVoidedOrCancelled = currentStatus === "voided" || currentStatus === "cancelled";

  async function handleToggleVoid() {
    const targetStatus = isVoidedOrCancelled ? "completed" : "voided";
    const promptMsg = isVoidedOrCancelled
      ? "Reactivate this session log and mark it as completed?"
      : "Mark this session log as voided? It will remain in history as voided/cancelled without deleting the record.";

    if (!window.confirm(promptMsg)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, status: targetStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update session status.");
      }
    } catch {
      alert("Network error updating session status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to permanently delete this class session log? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sessions?id=${sessionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete session log.");
      }
    } catch {
      alert("Network error deleting session log.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#5A6578]" />
      ) : (
        <>
          {/* Void / Reactivate Button */}
          <button
            type="button"
            onClick={handleToggleVoid}
            title={isVoidedOrCancelled ? "Restore session to Completed" : "Void / Cancel session"}
            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
              isVoidedOrCancelled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            }`}
          >
            {isVoidedOrCancelled ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restore</span>
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Void</span>
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            title="Permanently delete session log"
            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
