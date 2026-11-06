"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";

interface Props {
  sessionId: string;
  studentName?: string;
  sessionDate?: string;
}

export default function SessionDeleteButton({ sessionId, studentName, sessionDate }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/teacher/sessions?id=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setDeleting(false);

      if (res.ok && data.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        setError(data.error || "Failed to delete session log. Please try again.");
      }
    } catch (err: any) {
      setDeleting(false);
      setError(err.message || "Network error while deleting session log.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setShowConfirm(true);
        }}
        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        title="Delete this class log"
      >
        <Trash2 className="w-3 h-3 text-rose-600" />
        <span>Delete</span>
      </button>

      {/* Styled Confirmation Modal (No unstyled window.confirm/alert) */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E6DF] relative animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <button
              onClick={() => !deleting && setShowConfirm(false)}
              disabled={deleting}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="text-base font-bold font-serif text-[#0B192C]">
                  Delete this class log?
                </h3>
                <p className="text-xs text-[#5A6578]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#5A6578] leading-relaxed mb-4">
              Are you sure you want to remove the session recorded
              {studentName ? (
                <>
                  {" "}
                  for <strong className="text-[#0B192C]">{studentName}</strong>
                </>
              ) : null}
              {sessionDate ? (
                <>
                  {" "}
                  on <strong className="text-[#0B192C]">{sessionDate}</strong>
                </>
              ) : null}
              ? This will deduct the hours from your monthly total and remove the update from the parent portal.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E6DF]">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-[#E8E6DF] text-xs font-bold text-[#5A6578] hover:bg-[#F9F8F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
