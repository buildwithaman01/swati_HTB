"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, CheckCircle2, ExternalLink, Sparkles, X } from "lucide-react";
import { CANONICAL_LINKS } from "@/lib/constants";

interface Props {
  assignmentId?: string;
  teacherName?: string;
  subject?: string;
  variant?: "button" | "card" | "banner";
  className?: string;
}

export default function RateTutorButton({
  assignmentId,
  teacherName = "Your Teacher",
  subject,
  variant = "button",
  className = "",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewedData, setReviewedData] = useState<{
    rating: number;
    reviewText?: string;
    googleReviewUrl: string;
  } | null>(null);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/review-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.alreadyReviewed) {
        setReviewedData({
          rating: data.rating,
          reviewText: data.reviewText,
          googleReviewUrl: data.googleReviewUrl || CANONICAL_LINKS.googleReviews,
        });
        setModalOpen(true);
      } else if (data.reviewUrl) {
        router.push(data.reviewUrl);
      } else {
        alert(data.error || "Unable to start review right now. Please try again.");
      }
    } catch {
      setLoading(false);
      alert("Network error. Please try again.");
    }
  }

  // Variant: Full Banner (Used in Sessions / Dashboard)
  if (variant === "banner") {
    return (
      <>
        <div
          className={`bg-gradient-to-r from-[#0B192C]/10 via-[#F9F8F5] to-[#E5A93C]/10 border border-[#E8E6DF] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex text-[#E5A93C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E5A93C] text-[#E5A93C]" />
                ))}
              </span>
              <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">
                Parent Feedback
              </span>
            </div>
            <h3 className="font-bold text-[#0B192C] text-base">
              Rate Your Home Tutor ({teacherName})
            </h3>
            <p className="text-xs text-[#5A6578] leading-relaxed">
              How are classes going for {subject ? `*${subject}*` : "your child"}? Your 1-minute verified review ensures top academic standards!
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-[#E5A93C] text-[#E5A93C]" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>

        {/* Already Reviewed Modal */}
        {modalOpen && reviewedData && (
          <AlreadyReviewedModal
            teacherName={teacherName}
            rating={reviewedData.rating}
            googleUrl={reviewedData.googleReviewUrl}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Variant: Compact Card (Inside Teacher Profile Card)
  if (variant === "card") {
    return (
      <>
        <div className={`mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
          <div>
            <p className="text-xs font-bold text-[#1F2937] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#D4A017] text-[#D4A017]" />
              Rate {teacherName}
            </p>
            <p className="text-[11px] text-neutral-500">
              Share your feedback to keep our educator quality verified.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
            ) : (
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            )}
            <span>Rate Tutor</span>
          </button>
        </div>

        {modalOpen && reviewedData && (
          <AlreadyReviewedModal
            teacherName={teacherName}
            rating={reviewedData.rating}
            googleUrl={reviewedData.googleReviewUrl}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Default Variant: Standard Button
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 disabled:opacity-60 ${className}`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
        ) : (
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
        )}
        <span>Rate Tutor</span>
      </button>

      {modalOpen && reviewedData && (
        <AlreadyReviewedModal
          teacherName={teacherName}
          rating={reviewedData.rating}
          googleUrl={reviewedData.googleReviewUrl}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

function AlreadyReviewedModal({
  teacherName,
  rating,
  googleUrl,
  onClose,
}: {
  teacherName: string;
  rating: number;
  googleUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative border border-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#0B192C] font-display">Review Already Submitted!</h3>
          <p className="text-xs text-[#5A6578] mt-1">
            You gave <strong className="text-[#0B192C]">{teacherName}</strong> a rating of {rating}/5 stars.
          </p>
        </div>

        <div className="flex justify-center text-[#E5A93C] gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${s <= rating ? "fill-[#E5A93C]" : "text-neutral-200 fill-neutral-200"}`}
            />
          ))}
        </div>

        {/* Google Business Profile Prompt */}
        <div className="bg-gradient-to-br from-[#0B192C]/5 to-[#E5A93C]/10 border border-[#E8E6DF] rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E5A93C]" />
            <span className="text-xs font-bold text-[#0B192C] uppercase tracking-wide">
              Share on Google Reviews
            </span>
          </div>
          <p className="text-xs text-[#5A6578] leading-relaxed">
            Would you take 10 seconds to also share your rating on our Google Business Profile? It helps verified teachers reach more families!
          </p>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-xs"
          >
            <Star className="w-3.5 h-3.5 fill-[#0B192C]" /> Post on Google Reviews
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}
