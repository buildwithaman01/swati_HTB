"use client";

import {
  Download,
  Loader2,
  Printer,
  Share2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Star,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { InstagramIcon, GoogleGIcon } from "@/components/shared/SocialIcons";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import {
  preprocessCardImages,
  drawBadgeCanvasFallback,
  generateQrDataUrl,
  BadgeDrawData,
} from "./rasterizer";

interface Props {
  targetId: string;
  teacherName: string;
  teacherId: string;
  verifyUrl: string;
  teacherPhotoUrl?: string | null;
  teacherQualification?: string;
  teacherInstitution?: string;
  teacherLocality?: string;
  subjectsDisplay?: string;
  classesDisplay?: string;
  isVerified?: boolean;
  validUntil?: string;
  qrDataUrl?: string;
}

export default function IDCardDownloader({
  targetId,
  teacherName,
  teacherId,
  verifyUrl,
  teacherPhotoUrl,
  teacherQualification,
  teacherInstitution,
  teacherLocality,
  subjectsDisplay,
  classesDisplay,
  isVerified = true,
  validUntil = "31-DEC-2027",
  qrDataUrl,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [showPdfPrompt, setShowPdfPrompt] = useState(false);

  /**
   * Triggers download of an image data URL with a clean sanitized filename
   */
  function triggerDownload(dataUrl: string, suffix: string = "") {
    const cleanTeacherId = (teacherId || "FACULTY").replace(/[^a-zA-Z0-9_-]/g, "_");
    const cleanName = (teacherName || "Tutor").trim().replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Swati_HTB_Teacher_ID_${cleanTeacherId}_${cleanName}${suffix}.png`;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Primary PNG rasterization flow:
   * 1. Inline all external images as base64 data URLs to prevent canvas tainting.
   * 2. Rasterize via html2canvas with useCORS: true, allowTaint: false, scale: 3.
   * 3. Fallback: Pure HTML5 Canvas 2D badge renderer if html2canvas throws.
   * 4. Secondary fallback: Clean "Print to PDF" prompt.
   */
  async function handleDownload() {
    const el = document.getElementById(targetId);
    if (!el) {
      setDownloadError("ID badge element not found on page.");
      return;
    }

    setDownloading(true);
    setDownloadSuccess(false);
    setUsedFallback(false);
    setDownloadError("");
    setShowPdfPrompt(false);

    let restoreImages: (() => void) | null = null;

    try {
      // Step 1: Preprocess all images inside the badge into local base64 Data URLs
      // This completely eliminates "Tainted canvases may not be exported" errors
      restoreImages = await preprocessCardImages(el);

      // Give browser a quick microtask cycle to paint inlined data URLs
      await new Promise((r) => setTimeout(r, 80));

      // Step 2: Render via html2canvas with strict allowTaint: false and high DPI scale
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const canvas = await html2canvas(el, {
        scale: 3, // 300+ DPI equivalent for ultra-crisp physical print quality
        useCORS: true,
        allowTaint: false, // Critical: Disallows tainted images, ensuring toDataURL() succeeds
        backgroundColor: null,
        logging: false,
        imageTimeout: 15000,
      });

      const image = canvas.toDataURL("image/png");
      triggerDownload(image);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (primaryError) {
      console.warn("Primary html2canvas rasterization encountered error, launching 2D Canvas fallback:", primaryError);

      try {
        // Step 3: Pure Canvas 2D Fallback Rasterizer
        let activeQr = qrDataUrl;
        if (!activeQr || !activeQr.startsWith("data:")) {
          activeQr = await generateQrDataUrl(verifyUrl);
        }

        const fallbackData: BadgeDrawData = {
          teacherName,
          teacherId,
          qualification: teacherQualification,
          institution: teacherInstitution,
          locality: teacherLocality,
          subjectsDisplay,
          classesDisplay,
          isVerified,
          validUntil,
          qrDataUrl: activeQr,
          photoUrl: teacherPhotoUrl,
        };

        const fallbackDataUrl = await drawBadgeCanvasFallback(fallbackData);
        triggerDownload(fallbackDataUrl, "_HQ");

        setDownloadSuccess(true);
        setUsedFallback(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
      } catch (fallbackError) {
        console.error("Canvas 2D fallback also failed:", fallbackError);
        setDownloadError("Direct PNG export was blocked by your browser's security settings. Please use Print / Save as PDF below.");
        setShowPdfPrompt(true);
      }
    } finally {
      // Always restore original image sources
      if (restoreImages) {
        restoreImages();
      }
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
      setCopied(false);
    }
  }

  const shareText = `Official Faculty Verification Card - Swati Home Tuition Bureau, Patna\n\nFaculty: ${teacherName}\nID: ${teacherId}\n\nVerify official credentials online:\n${verifyUrl}\n\nFollow us on Instagram: ${BUREAU_INFO.instagramHandle}`;
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-4 mt-5">
      {/* Primary Action: Download PNG */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-[#0B192C] hover:bg-[#1E3E62] disabled:opacity-60 text-white font-bold py-3.5 px-5 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.99]"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#E5A93C]" />
            Generating High-Res Badge (300 DPI)...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-[#E5A93C]" />
            Download Official ID (PNG)
          </>
        )}
      </button>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {usedFallback
              ? "Official badge generated and downloaded via High-Res 2D Engine!"
              : "Ultra-crisp 300 DPI ID Badge downloaded to your device!"}
          </span>
        </div>
      )}

      {/* Error Message with PDF fallback prompt */}
      {downloadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-rose-900 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Notice</span>
          </div>
          <p>{downloadError}</p>
        </div>
      )}

      {/* Suggested PDF action when prompted */}
      {showPdfPrompt && (
        <button
          type="button"
          onClick={handlePrint}
          className="w-full bg-amber-500 hover:bg-amber-600 text-[#0B192C] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <FileText className="w-4 h-4" />
          Print / Save as PDF Now
        </button>
      )}

      {/* Secondary Actions: Print & Share */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="bg-white hover:bg-[#F9F8F5] text-[#1E3E62] font-bold py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-colors flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#0B192C]" />
          Print / PDF
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
      <div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] flex items-center justify-center gap-1.5 py-1.5 transition-colors cursor-pointer"
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

      {/* Promotional Social Badges Card */}
      <div className="mt-4 pt-4 border-t border-[#E8E6DF] space-y-2.5">
        <div className="bg-gradient-to-br from-[#0B192C]/5 to-[#E5A93C]/10 p-3 rounded-2xl border border-[#E8E6DF] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3E62]">
              Official Bureau Badges
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              GBP Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Google Business Profile Verified */}
            <div className="bg-white p-2 rounded-xl border border-[#E8E6DF] text-left">
              <div className="flex items-center gap-1 text-[#E5A93C]">
                <Star className="w-3 h-3 fill-[#E5A93C]" />
                <span className="text-[10px] font-bold text-[#0B192C]">4.9 / 5.0</span>
              </div>
              <p className="text-[9px] text-[#5A6578] font-medium mt-0.5">
                Google Business Profile Verified
              </p>
            </div>

            {/* Instagram Official Handle */}
            <a
              href={CANONICAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-pink-50/50 p-2 rounded-xl border border-[#E8E6DF] text-left transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center gap-1 text-pink-600">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-[10px] font-bold text-[#0B192C] group-hover:text-pink-600 font-mono">
                  {BUREAU_INFO.instagramHandle}
                </span>
              </div>
              <p className="text-[9px] text-[#5A6578] font-medium mt-0.5">
                Official Bureau Instagram
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
