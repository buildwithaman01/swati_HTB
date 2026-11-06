"use client";

import { useState } from "react";
import { MessageCircle, Copy, CheckCircle2, Share2, Sparkles, X } from "lucide-react";
import {
  buildTutorOnboardingAnnouncementMessage,
  formatWhatsAppUrl,
  CANONICAL_SUPPORT_PHONE_DISPLAY,
} from "@/lib/whatsapp";

export default function TutorAnnouncementButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const announcementText = buildTutorOnboardingAnnouncementMessage();
  const shareWhatsAppUrl = formatWhatsAppUrl("", announcementText);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(announcementText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert("Failed to copy announcement. Please select and copy manually.");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        title="View &amp; Copy New Tutor Onboarding Announcement Message"
      >
        <MessageCircle className="w-4 h-4 text-[#25D366]" />
        <span>Tutor Recruitment Broadcast</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#25D366] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B192C] text-base">New Tutor Onboarding Broadcast</h3>
                  <p className="text-xs text-neutral-400">Ready-to-copy WhatsApp template to onboard teachers</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={announcementText}
                rows={11}
                className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-800 leading-relaxed outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 resize-none select-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-neutral-400">
                Helpline: {CANONICAL_SUPPORT_PHONE_DISPLAY}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-900 hover:bg-black text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Template
                    </>
                  )}
                </button>

                <a
                  href={shareWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
