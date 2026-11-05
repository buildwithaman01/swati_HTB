"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  assignmentId: string;
  currentStatus: string;
}

export default function AssignmentStatusSelect({ assignmentId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "active");
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: string) {
    if (!newStatus || newStatus === status) return;
    setUpdating(true);
    setStatus(newStatus);

    try {
      const res = await fetch("/api/admin/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: assignmentId, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to update assignment status.");
        setStatus(currentStatus);
      }
    } catch {
      alert("Network error updating status.");
      setStatus(currentStatus);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      {updating && <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />}
      <select
        value={status}
        disabled={updating}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white cursor-pointer hover:border-neutral-400 disabled:opacity-50"
      >
        <option value="active">Active</option>
        <option value="paused">Pause</option>
        <option value="completed">Complete</option>
        <option value="cancelled">Cancel</option>
      </select>
    </div>
  );
}
