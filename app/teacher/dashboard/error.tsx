"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function TeacherDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to client console / error tracker
    console.error("Teacher Dashboard caught runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-sm border border-[#E8E6DF] text-center space-y-6">
        {/* Status Icon */}
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1E3E62] bg-[#F9F8F5] px-3 py-1 rounded-full border border-[#E8E6DF]">
            Faculty Portal · Notice
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#0B192C] pt-1">
            Something went wrong
          </h1>
          <p className="text-xs text-[#5A6578] max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while loading this dashboard view. Your profile, demo requests, and session records remain safe and secure.
          </p>
        </div>

        {/* Error Detail Pill */}
        {error?.message && (
          <div className="bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl p-3 text-left">
            <p className="text-[10px] font-mono font-bold text-[#5A6578] uppercase mb-1">
              Error Details:
            </p>
            <p className="text-xs font-mono text-rose-700 break-words line-clamp-3">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-[9px] font-mono text-[#5A6578] mt-1">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E5A93C]" />
            Try Again
          </button>

          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F9F8F5] hover:bg-[#E8E6DF] text-[#1E3E62] text-xs font-bold border border-[#E8E6DF] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
