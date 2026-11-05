"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  teacherId: string;
  currentStatus: string;
  badgeLevel: string;
  initialNotes: string | null;
  initialRejectionReason: string | null;
}

export default function TeacherApprovalAction({
  teacherId,
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

  async function handleSaveStatus(e: React.FormEvent) {
    e.preventDefault();
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
          status,
          internal_notes: notes,
          rejection_reason: rejectionReason,
          badge_level: status === "approved" ? "verified" : badgeLevel,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(`✅ Status saved: ${status === "approved" ? "Approved & Active" : status.toUpperCase()}`);
        router.refresh();
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to update status. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Network error. Please try again.");
    }
  }

  return (
    <div
      className={`rounded-3xl p-6 shadow-sm border transition-colors ${
        status === "pending"
          ? "bg-amber-50/70 border-amber-200"
          : status === "approved"
          ? "bg-emerald-50/70 border-emerald-200"
          : "bg-red-50/70 border-red-200"
      }`}
    >
      <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#0F4C5C]" /> Approval Action
      </h3>

      <form onSubmit={handleSaveStatus} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-600 mb-1 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-sm font-semibold rounded-xl border border-neutral-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            <option value="pending">⏳ Pending Review</option>
            <option value="approved">✅ Approved & Active</option>
            <option value="rejected">❌ Rejected</option>
            <option value="suspended">⚠️ Suspended</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-600 mb-1 block">Internal Notes (Admin Only)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes about background check, verification call, document verification, etc."
            rows={3}
            className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white resize-none focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

        {status === "rejected" && (
          <div>
            <label className="text-xs font-bold text-red-700 mb-1 block">Rejection Reason</label>
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete ID document, experience not verified"
              className="w-full text-sm rounded-xl border border-red-300 p-2.5 bg-white focus:ring-2 focus:ring-red-500/20 outline-none"
            />
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F2937] hover:bg-black disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Status...
            </>
          ) : (
            "Save Status"
          )}
        </button>
      </form>
    </div>
  );
}

