"use client";

import { Download, Loader2, Printer, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";

interface Props {
  targetId: string;
  teacherName: string;
  teacherId: string;
  verifyUrl: string;
}

export default function IDCardDownloader({
  targetId,
  teacherName,
  teacherId,
  verifyUrl,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function handleDownload() {
    const el = document.getElementById(targetId);
    if (!el) return;

    setDownloading(true);
    setDownloadSuccess(false);
    setDownloadError("");

    try {
      // Temporarily ensure styles are rendered without print-only hides
      const canvas = await html2canvas(el, {
        scale: 3, // High resolution (300+ DPI equivalent)
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      const cleanName = teacherName.replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `SwatiHTB_ID_${cleanName}_${teacherId}.png`;
      a.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error("ID card download error:", e);
      setDownloadError("Unable to auto-download PNG. Please use 'Print ID Card' or take a quick screenshot.");
      setTimeout(() => setDownloadError(""), 6000);
    } finally {
      setDownloading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(false);
    }
  }

  const shareText = `Official Faculty Verification Card - Swati Home Tuition Bureau\n\nTutor: ${teacherName}\nID: ${teacherId}\n\nVerify official bureau credentials here:\n${verifyUrl}`;
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-3 mt-5">
      {/* Primary Action: Download PNG */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-60 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" />
            Generating High-Res Badge...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-[#E5A93C]" />
            Download Official ID (PNG)
          </>
        )}
      </button>

      {downloadSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          High-res ID Card downloaded to your device!
        </div>
      )}

      {downloadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 text-center">
          {downloadError}
        </div>
      )}

      {/* Secondary Actions: Print & Share */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="bg-white hover:bg-[#F9F8F5] text-[#1E3E62] font-bold py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-colors flex items-center justify-center gap-1.5 text-xs shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-[#0B192C]" />
          Print ID Card
        </button>

        <a
          href={waShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold py-2.5 px-3 rounded-xl border border-[#25D366]/30 transition-colors flex items-center justify-center gap-1.5 text-xs text-center"
        >
          <Share2 className="w-3.5 h-3.5 text-[#128C7E]" />
          WhatsApp Share
        </a>
      </div>

      {/* Quick Copy Verification Link */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] flex items-center justify-center gap-1.5 py-1.5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Verification URL for Parents
            </>
          )}
        </button>
      </div>
    </div>
  );
}
