"use client";
import { useState } from "react";
import { MessageCircle, Star, Link as LinkIcon, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  assignmentId: string;
  teacherId: string;
  studentId: string;
  teacherName: string;
  parentName: string;
  teacherPhone: string;
  parentPhone: string;
  subject: string;
}

export default function AssignmentActions({ 
  assignmentId, teacherId, studentId, teacherName, parentName, teacherPhone, parentPhone, subject 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1-click WhatsApp notification to Teacher
  const teacherMsg = `🔔 *New Tuition Assignment!*\n\nDear ${teacherName},\n\nYou have been assigned a new tuition for *${subject}*.\n\nStudent/Parent: ${parentName}\n\nPlease check your Swati HTB dashboard for full details, address, and schedule.\n\n— Swati Home Tuition Bureau`;
  const teacherWaUrl = `https://wa.me/${teacherPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(teacherMsg)}`;

  // 1-click WhatsApp notification to Parent
  const parentMsg = `🎓 *Teacher Assigned!*\n\nDear ${parentName},\n\nWe have assigned *${teacherName}* as the teacher for *${subject}*.\n\nYou can track sessions, reports, and payments in your Parent Portal.\n\n— Swati Home Tuition Bureau`;
  const parentWaUrl = `https://wa.me/${parentPhone?.replace(/\D/g, "")}?text=${encodeURIComponent(parentMsg)}`;

  async function generateReviewLink() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/generate-review-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, teacherId, studentId }),
      });
      const data = await res.json();
      if (data.token) {
        const link = `${window.location.origin}/review/submit?token=${data.token}`;
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      alert("Failed to generate review link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Quick Actions</p>
      
      <div className="flex flex-wrap gap-2">
        {/* Notify Teacher */}
        <a 
          href={teacherPhone ? teacherWaUrl : "#"}
          target="_blank" rel="noopener noreferrer"
          onClick={(e) => !teacherPhone && e.preventDefault()}
          title="Notify Teacher"
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${teacherPhone ? 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Notify Parent */}
        <a 
          href={parentPhone ? parentWaUrl : "#"}
          target="_blank" rel="noopener noreferrer"
          onClick={(e) => !parentPhone && e.preventDefault()}
          title="Notify Parent"
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${parentPhone ? 'bg-[#0F4C5C]/10 text-[#0F4C5C] hover:bg-[#0F4C5C]/20' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Generate Review Link */}
        <button
          onClick={generateReviewLink}
          disabled={loading || copied}
          title="Generate & Copy Review Link"
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-xs font-bold ${
            copied ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
           copied ? <CheckCircle2 className="w-4 h-4" /> : 
           <Star className="w-4 h-4" />}
          {copied ? "Copied!" : "Review Link"}
        </button>
      </div>
    </div>
  );
}
