"use client";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";

export default function IDCardDownloader({ targetId, teacherName }: { targetId: string; teacherName: string }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    const el = document.getElementById(targetId);
    if (!el) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 3, // High resolution
        useCORS: true, // For images like profile photos or QR
        backgroundColor: null,
      });
      
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `SwatiHTB_ID_${teacherName.replace(/\s+/g, "_")}.png`;
      a.click();
    } catch (e) {
      alert("Failed to download ID card. Try screenshotting instead.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="bg-[#0F4C5C] hover:bg-[#0a3a47] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 w-full"
    >
      {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      {downloading ? "Generating..." : "Download as PNG"}
    </button>
  );
}
