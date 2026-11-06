"use client";

import { useState } from "react";
import { MessageCircle, Star, Link as LinkIcon, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  formatWhatsAppUrl,
  normalizeIndianPhone,
  buildTeacherAssignmentMessage,
  buildParentAssignmentMessage,
  buildParentReviewRequestMessage,
} from "@/lib/whatsapp";

interface Props {
  assignmentId: string;
  teacherId: string;
  studentId: string;
  teacherName: string;
  studentName?: string;
  parentName: string;
  teacherPhone: string;
  parentPhone: string;
  subject: string;
}

// Ensure phone number has country code 91 and no formatting characters for WhatsApp wa.me links
export function normalizePhoneForWhatsApp(phone?: string | null): string {
  return normalizeIndianPhone(phone);
}

export default function AssignmentActions({
  assignmentId,
  teacherId,
  studentId,
  teacherName,
  studentName,
  parentName,
  teacherPhone,
  parentPhone,
  subject,
}: Props) {
  const [loadingToken, setLoadingToken] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sendingWa, setSendingWa] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [cachedToken, setCachedToken] = useState<string | null>(null);

  const cleanTeacherPhone = normalizeIndianPhone(teacherPhone);
  const cleanParentPhone = normalizeIndianPhone(parentPhone);

  // 1-click WhatsApp notification to Teacher
  const teacherMsg = buildTeacherAssignmentMessage({
    teacherName,
    studentName,
    parentName,
    subject,
  });
  const teacherWaUrl = cleanTeacherPhone ? formatWhatsAppUrl(cleanTeacherPhone, teacherMsg) : "#";

  // 1-click WhatsApp notification to Parent
  const parentMsg = buildParentAssignmentMessage({
    parentName,
    studentName: studentName || "Student",
    teacherName,
    subject,
  });
  const parentWaUrl = cleanParentPhone ? formatWhatsAppUrl(cleanParentPhone, parentMsg) : "#";

  // Helper to fetch or generate token
  async function fetchToken(): Promise<string | null> {
    if (cachedToken) return cachedToken;
    try {
      const res = await fetch("/api/admin/generate-review-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, teacherId, studentId }),
      });
      const data = await res.json();
      if (data.token) {
        setCachedToken(data.token);
        return data.token;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Generate & Copy Review Link
  async function handleCopyReviewLink() {
    setLoadingToken(true);
    try {
      const token = await fetchToken();
      if (token) {
        const link = `${window.location.origin}/review/submit?token=${token}`;
        await navigator.clipboard.writeText(link);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } else {
        alert("Could not generate review link. Please check network connection.");
      }
    } catch {
      alert("Failed to copy review link.");
    } finally {
      setLoadingToken(false);
    }
  }

  // 1-Click WhatsApp Review Request to Parent
  async function handleSendWhatsAppReviewRequest() {
    setSendingWa(true);
    try {
      const token = await fetchToken();
      if (!token) {
        alert("Failed to generate review link. Please try again.");
        setSendingWa(false);
        return;
      }

      const reviewUrl = `${window.location.origin}/review/submit?token=${token}`;
      const reviewRequestMsg = buildParentReviewRequestMessage({
        parentName,
        studentName,
        teacherName,
        subject,
        reviewUrl,
      });

      if (cleanParentPhone) {
        const waUrl = formatWhatsAppUrl(cleanParentPhone, reviewRequestMsg);
        window.open(waUrl, "_blank");
        setWaSent(true);
        setTimeout(() => setWaSent(false), 3500);
      } else {
        // Parent phone not available, copy text to clipboard as fallback
        await navigator.clipboard.writeText(reviewRequestMsg);
        alert("Parent phone number is not available. The personalized review request message and link have been copied to your clipboard!");
        setWaSent(true);
        setTimeout(() => setWaSent(false), 3500);
      }
    } catch (e) {
      console.error("[handleSendWhatsAppReviewRequest error]:", e);
      alert("Unable to open WhatsApp review request.");
    } finally {
      setSendingWa(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
        Quick Actions &amp; Reviews
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {/* Notify Teacher via WhatsApp */}
        <a
          href={cleanTeacherPhone ? teacherWaUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => !cleanTeacherPhone && e.preventDefault()}
          title={cleanTeacherPhone ? `Notify Teacher on WhatsApp (${cleanTeacherPhone})` : "Teacher phone missing"}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors text-xs font-semibold ${
            cleanTeacherPhone
              ? "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Notify Parent via WhatsApp */}
        <a
          href={cleanParentPhone ? parentWaUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => !cleanParentPhone && e.preventDefault()}
          title={cleanParentPhone ? `Notify Parent on WhatsApp (${cleanParentPhone})` : "Parent phone missing"}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors text-xs font-semibold ${
            cleanParentPhone
              ? "bg-[#0F4C5C]/10 text-[#0F4C5C] hover:bg-[#0F4C5C]/20"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* 1-Click WhatsApp Review Request Button */}
        <button
          type="button"
          onClick={handleSendWhatsAppReviewRequest}
          disabled={sendingWa}
          title={cleanParentPhone ? `Send review link to parent via WhatsApp (${cleanParentPhone})` : "Send review request (copies to clipboard)"}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-bold cursor-pointer shadow-sm ${
            waSent
              ? "bg-emerald-600 text-white"
              : "bg-[#25D366] hover:bg-[#20ba5a] text-white"
          }`}
        >
          {sendingWa ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : waSent ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>{waSent ? "WhatsApp Opened!" : "WhatsApp Review Request"}</span>
        </button>

        {/* Copy Review Link Button */}
        <button
          type="button"
          onClick={handleCopyReviewLink}
          disabled={loadingToken || copiedLink}
          title="Generate &amp; Copy Review Link to Clipboard"
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-xs font-bold cursor-pointer ${
            copiedLink
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
          }`}
        >
          {loadingToken ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : copiedLink ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <LinkIcon className="w-3.5 h-3.5" />
          )}
          <span>{copiedLink ? "Link Copied!" : "Copy Review Link"}</span>
        </button>
      </div>
    </div>
  );
}
