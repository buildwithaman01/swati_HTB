"use client";
import { useState } from "react";
import { Star, CheckCircle2, Send } from "lucide-react";

export default function SubmitReviewPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token;
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8">
          <p className="text-red-600 font-bold">Invalid review link.</p>
          <p className="text-sm text-neutral-500 mt-2">This link may have expired or already been used.</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!text.trim()) { setError("Please write a brief review."); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/review/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, rating, review_text: text, parent_name: parentName }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setDone(true);
    } else {
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C5C] to-[#1a2a3a] p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3 font-serif">Thank You! 🙏</h2>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Your review has been submitted. It will be reviewed by our team and published on the teacher's profile once approved.
          </p>
          <p className="text-xs text-neutral-400 mt-4 font-medium">— Swati Home Tuition Bureau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] to-[#1a2a3a] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F4C5C] px-8 py-6 text-center">
          <div className="text-3xl mb-2">⭐</div>
          <h1 className="text-xl font-bold text-white font-serif">Share Your Experience</h1>
          <p className="text-white/60 text-xs mt-1">Swati Home Tuition Bureau</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <p className="text-sm text-neutral-600 text-center">
            How has your experience been with the teacher assigned to your child?
          </p>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wide mb-3">Your Rating *</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      (hovered || rating) >= star
                        ? "fill-[#D4A017] text-[#D4A017]"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-semibold text-[#D4A017] mt-2">
                {["", "Poor", "Below Average", "Average", "Good", "Excellent!"][rating]}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">
              Your Review *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              placeholder="Tell us about the teacher's punctuality, teaching style, and your child's progress..."
              className="w-full text-sm border border-neutral-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none resize-none"
            />
          </div>

          {/* Parent Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wide mb-1.5">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Mrs. Sharma, Boring Road"
              className="w-full text-sm border border-neutral-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#0F4C5C]/20 outline-none"
            />
            <p className="text-xs text-neutral-400 mt-1">First name + locality only. Your phone number is never shared.</p>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F4C5C] disabled:opacity-60 hover:bg-[#0a3a47] text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Review</>}
          </button>

          <p className="text-center text-xs text-neutral-400">
            Reviews are verified and moderated before appearing on the teacher's profile.
          </p>
        </form>
      </div>
    </div>
  );
}
