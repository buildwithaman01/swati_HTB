"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  User,
  BookOpen,
} from "lucide-react";

interface TeacherData {
  id: string;
  name: string;
  photo?: string | null;
  subjects: string[];
  qualification?: string | null;
  locality?: string | null;
  badgeLevel?: string;
  ratingAverage?: number;
  totalReviews?: number;
}

interface StudentData {
  name: string;
  parentName?: string | null;
  classStudying?: string | null;
  locality?: string | null;
}

const GOOGLE_REVIEW_URL = "https://share.google/tarSWReEvLi7cim5V";
const SUPPORT_WHATSAPP_URL = "https://wa.me/919229738307?text=Hello%20Swati%20HTB%20Team%2C%20I%20have%20a%20question%20regarding%20my%20tutor%20review.";

export default function SubmitReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F4C5C]/5 p-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 border-4 border-[#0F4C5C] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#0F4C5C] font-semibold text-sm">Loading review form...</p>
          </div>
        </div>
      }
    >
      <ReviewFormContent />
    </Suspense>
  );
}

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [invalidReason, setInvalidReason] = useState<string>("");
  const [invalidMessage, setInvalidMessage] = useState<string>("");

  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [subject, setSubject] = useState<string>("Tuition");

  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [parentName, setParentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copiedReview, setCopiedReview] = useState(false);

  // Prefetch tutor & student details on mount
  useEffect(() => {
    if (!token) {
      setChecking(false);
      setTokenValid(false);
      setInvalidReason("missing_token");
      setInvalidMessage("No review token was provided in the link.");
      return;
    }

    let isMounted = true;
    async function loadReviewInfo() {
      try {
        setChecking(true);
        const res = await fetch(`/api/review/submit?token=${encodeURIComponent(token!)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (data.valid) {
          setTokenValid(true);
          setTeacher(data.teacher);
          setStudent(data.student);
          if (data.subject) setSubject(data.subject);
          if (data.student?.parentName) setParentName(data.student.parentName);
        } else {
          setTokenValid(false);
          setInvalidReason(data.reason || "invalid");
          setInvalidMessage(data.message || "This review link is invalid or has expired.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setTokenValid(false);
        setInvalidReason("network_error");
        setInvalidMessage("Unable to verify review link. Please check your internet connection.");
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    loadReviewInfo();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle Review Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!text.trim()) {
      setError("Please write a brief review.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          rating,
          review_text: text,
          parent_name: parentName,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setDone(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitting(false);
      setError("Network error occurred. Please check your connection and try again.");
    }
  }

  // Copy review text to clipboard for 1-click paste on Google
  async function handleCopyReview() {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReview(true);
      setTimeout(() => setCopiedReview(false), 3000);
    } catch {
      // Fallback
    }
  }

  // 1. Loading State
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] to-[#082830] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 border-4 border-[#0F4C5C] border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-[#1F2937] font-serif">Verifying Review Link</h2>
          <p className="text-neutral-500 text-xs">
            Connecting with Swati Home Tuition Bureau verification service...
          </p>
        </div>
      </div>
    );
  }

  // 2. Invalid or Already Used State
  if (!tokenValid) {
    const isAlreadyUsed = invalidReason === "already_used";

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] to-[#082830] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl space-y-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              isAlreadyUsed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {isAlreadyUsed ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1F2937] font-serif">
              {isAlreadyUsed ? "Review Already Submitted! 🙏" : "Review Link Expired or Invalid"}
            </h2>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              {invalidMessage ||
                (isAlreadyUsed
                  ? "Thank you! Feedback for this tutor has already been submitted by your family."
                  : "This link may have expired or was already completed.")}
            </p>
          </div>

          {/* Google Business Profile Prompt Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Google Business Profile
              </span>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              You can also share your valuable experience directly on our official Google Business page.
              Your public rating helps verified home tutors connect with more students across Patna!
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#D4A017] hover:bg-[#b88912] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              <Star className="w-4 h-4 fill-white" /> Rate Us on Google Reviews
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" /> Contact Bureau Support
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
            >
              Visit Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Success / Submitted State with Google Review CTA
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] to-[#082830] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] font-serif">
              Thank You{parentName ? `, ${parentName}` : ""}! 🙏
            </h2>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              Your feedback for{" "}
              <strong className="text-[#0F4C5C]">{teacher?.name || "your home tutor"}</strong> has been
              securely recorded. Our team will verify and feature it on the educator&apos;s verified profile.
            </p>
          </div>

          {/* Golden 5-Star Google Review Prompt */}
          <div className="bg-gradient-to-br from-[#FFF9E6] via-[#FFF3D1] to-[#FFE8A3] border-2 border-[#D4A017]/60 rounded-3xl p-6 text-left shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex text-amber-500 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-[#D4A017] text-[#D4A017]" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#D4A017]/20 text-[#855e05] px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-[#D4A017]" /> 10-Second Favor
              </span>
            </div>

            <h3 className="font-bold text-[#1F2937] text-base font-serif">
              Would you also take 10 seconds to share this on our Google Business Profile?
            </h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              It helps verified teachers reach more families in Patna and motivates them to deliver exceptional home tuition!
            </p>

            <div className="space-y-2 pt-2">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#D4A017] hover:bg-[#b88912] text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg"
              >
                <Star className="w-4 h-4 fill-white" /> Share on Google Business Profile
                <ExternalLink className="w-4 h-4" />
              </a>

              {text && (
                <button
                  type="button"
                  onClick={handleCopyReview}
                  className="w-full flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-neutral-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors border border-amber-300"
                >
                  {copiedReview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Copied your review to clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-500" /> Copy your written review to paste on Google
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Link
              href="/"
              className="text-xs font-semibold text-neutral-400 hover:text-[#0F4C5C] transition-colors"
            >
              ← Return to Swati Home Tuition Bureau
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Main Review Form with Prefetched Tutor & Student Details
  const RATING_LABELS = [
    "",
    "Needs Improvement (1/5)",
    "Fair (2/5)",
    "Good (3/5)",
    "Very Good (4/5)",
    "Outstanding! Highly Recommended (5/5)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] via-[#0B3B48] to-[#082830] flex items-center justify-center p-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-[#0F4C5C] px-6 sm:px-8 py-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl mb-3 border border-white/10 backdrop-blur-sm">
            <GraduationCap className="w-6 h-6 text-[#D4A017]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif">Share Your Experience</h1>
          <p className="text-white/70 text-xs mt-1">Swati Home Tuition Bureau · Verified Parent Review</p>
        </div>

        {/* Tutor Identity Card - EXACTLY WHO THEY ARE REVIEWING */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 space-y-3">
            <div className="flex items-start gap-4">
              {teacher?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                  {teacher?.name ? teacher.name.charAt(0) : "T"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {teacher?.badgeLevel === "elite"
                      ? "Elite Tutor"
                      : teacher?.badgeLevel === "certified"
                      ? "Certified Tutor"
                      : "Verified Tutor"}
                  </span>
                  {teacher?.locality && (
                    <span className="text-[10px] text-neutral-500 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                      {teacher.locality}
                    </span>
                  )}
                </div>

                <h2 className="font-bold text-base sm:text-lg text-[#1F2937] leading-tight truncate">
                  {teacher?.name || "Assigned Home Tutor"}
                </h2>

                <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#0F4C5C] shrink-0" />
                  <span>Subject: <strong className="text-neutral-700">{subject}</strong></span>
                </p>

                {teacher?.qualification && (
                  <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                    {teacher.qualification}
                  </p>
                )}
              </div>
            </div>

            {/* Student Context Badge */}
            {student?.name && (
              <div className="bg-white/80 border border-neutral-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-neutral-600">
                <User className="w-3.5 h-3.5 text-[#0F4C5C]" />
                <span>
                  Reviewing tuition for:{" "}
                  <strong className="text-[#1F2937]">{student.name}</strong>
                  {student.classStudying ? ` · Class ${student.classStudying}` : ""}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Section */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Your Overall Rating <span className="text-red-500">*</span>
              </label>

              <div className="flex justify-center items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hovered || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                          active
                            ? "fill-[#D4A017] text-[#D4A017] drop-shadow-sm"
                            : "text-neutral-300 stroke-1"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-bold text-[#D4A017] min-h-[1.25rem]">
                {RATING_LABELS[hovered || rating]}
              </p>
            </div>

            {/* Written Review */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Your Written Feedback <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-neutral-400">Min. 10 characters</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                required
                placeholder="How has the tutor's teaching style, punctuality, and concept clarification helped your child? What progress have you noticed?"
                className="w-full text-sm border border-neutral-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] outline-none resize-none transition-all"
              />
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Mrs. Sharma, Kankarbagh"
                className="w-full text-sm border border-neutral-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] outline-none transition-all"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Displayed publicly as: First Name / Parent of {student?.name || "Student"}. Phone & address are never shared.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0F4C5C] hover:bg-[#0a3a47] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Verified Review</span>
                </>
              )}
            </button>

            <div className="text-center space-y-1">
              <p className="text-[11px] text-neutral-400">
                🛡️ All reviews are verified by Swati Home Tuition Bureau to ensure authentic academic feedback.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
