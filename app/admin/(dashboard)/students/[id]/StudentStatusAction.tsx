"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

interface Props {
  studentId: string;
  currentStatus: string;
  initialNotes: string | null;
}

export default function StudentStatusAction({
  studentId,
  currentStatus,
  initialNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "enquiry");
  const [notes, setNotes] = useState(initialNotes || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const STATUS_STYLES: Record<string, string> = {
    enquiry: "bg-purple-50/80 border-purple-200",
    demo: "bg-amber-50/80 border-amber-200",
    enrolled: "bg-emerald-50/80 border-emerald-200",
    paused: "bg-neutral-50/80 border-neutral-200",
    dropped: "bg-red-50/80 border-red-200",
  };

  async function handleSaveStatus(e: React.FormEvent) {
    e.preventDefault();
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
          status,
          notes,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(`✅ Status saved: ${status.toUpperCase()}`);
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

  return (
    <div className={`rounded-3xl p-6 shadow-sm border transition-colors ${STATUS_STYLES[status] || "bg-white border-neutral-200"}`}>
      <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#0F4C5C]" /> Enrollment Status
      </h3>

      <form onSubmit={handleSaveStatus} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-600 mb-1 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-sm font-semibold rounded-xl border border-neutral-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          >
            <option value="enquiry">📋 Enquiry (New lead)</option>
            <option value="demo">📅 Demo Scheduled / In Progress</option>
            <option value="enrolled">✅ Enrolled (Active tuition)</option>
            <option value="paused">⏸️ Paused / Temporary Break</option>
            <option value="dropped">❌ Dropped / Closed</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-600 mb-1 block">Internal Notes / Requirements</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes about specific requirements, demo feedback, student weak areas..."
            rows={4}
            className="w-full text-sm rounded-xl border border-neutral-300 p-2.5 bg-white resize-none focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
          />
        </div>

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
