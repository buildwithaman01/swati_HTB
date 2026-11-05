"use client";

import { Printer } from "lucide-react";

export default function PrintReportButton({ studentName }: { studentName: string }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0F4C5C] hover:bg-[#0a3a47] text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer print:hidden"
    >
      <Printer className="w-3.5 h-3.5" />
      Print / Save PDF Report
    </button>
  );
}
