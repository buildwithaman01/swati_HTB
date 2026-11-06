"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";
import { Star, ExternalLink, Share2, Check, ShieldCheck, HeartHandshake } from "lucide-react";

/**
 * High-converting promotion card for Teacher Dashboard
 */
export function TeacherGoogleReviewBanner() {
  return (
    <div className="bg-gradient-to-br from-[#0B192C] via-[#0F2238] to-[#1E3E62] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#E5A93C]/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Google 5-Star CTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs">
            <span className="flex gap-1 text-[#E5A93C]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#E5A93C]" />
              ))}
            </span>
            <span className="font-bold text-[#E5A93C]">Rated 4.9★</span>
            <span className="text-white/60">on Google Reviews</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
            Share your experience teaching with Patna&apos;s premier tuition bureau.{" "}
            <span className="text-[#E5A93C]">Rate us 5 stars on Google!</span>
          </h2>

          <p className="text-sm text-white/80 leading-relaxed max-w-xl">
            Your review helps us attract more dedicated parents and expand premium home tuition assignments for verified educators across Patna.
          </p>

          <div className="pt-2">
            <a
              href={CANONICAL_LINKS.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold px-6 py-3.5 rounded-2xl shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base border-b-2 border-[#B87C1C]"
            >
              <GoogleGIcon className="w-5 h-5 shrink-0" />
              <span>Rate 5 Stars on Google</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Right Column: Social Follow for Tuition Openings */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
                Daily Tuition Openings
              </p>
            </div>
            <h3 className="font-bold text-base text-white">
              Stay Updated with New Tuitions
            </h3>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              We post urgent tutor requirements and bureau notices on Instagram &amp; Facebook. Follow us to grab new assignments first.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <a
              href={CANONICAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30 border border-pink-500/30 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-pink-500/30 flex items-center justify-center text-pink-300">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <span>Follow {BUREAU_INFO.instagramHandle}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
            </a>

            <a
              href={CANONICAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <span>Follow on Facebook</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * High-converting promotion card for Parent / Student Portal
 */
export function ParentGoogleReviewCard() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E6DF] shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E6DF]">
            <div className="flex gap-0.5 text-[#E5A93C]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#E5A93C]" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#0B192C]">4.9 / 5.0 Google Rating</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0B192C]">
            How is your tuition experience with Swati HTB?
          </h3>
          <p className="text-sm text-[#5A6578] leading-relaxed max-w-xl">
            Help other parents in Patna find verified, sincere home tutors for their children. It takes just 30 seconds to rate us on Google.
          </p>

          {/* Social Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs font-semibold text-[#5A6578]">Connect with bureau:</span>
            <a
              href={CANONICAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>{BUREAU_INFO.instagramHandle}</span>
            </a>
            <a
              href={CANONICAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
          <a
            href={CANONICAL_LINKS.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold px-6 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-sm text-center"
          >
            <GoogleGIcon className="w-4 h-4 shrink-0" />
            <span>Rate Us on Google</span>
            <ExternalLink className="w-4 h-4 text-white/60" />
          </a>
          <span className="text-[11px] text-center md:text-right text-[#5A6578]">
            ⭐️ Takes 30 seconds • Directly on Google Maps
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Official social trust badges for Verification Page
 */
export function VerificationSocialTrustBadges() {
  return (
    <div className="bg-[#F9F8F5] rounded-2xl p-4 sm:p-5 border border-[#E8E6DF] space-y-3.5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#0B192C]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B192C]">
          Verified by Swati Home Tuition Bureau
        </h4>
      </div>

      <p className="text-xs text-[#5A6578] leading-relaxed">
        Patna&apos;s premier home tuition bureau with 6+ years of academic excellence and 500+ satisfied parent testimonials.
      </p>

      {/* Social Trust Links & Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Google 4.9 Star Badge */}
        <a
          href={CANONICAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-white hover:bg-white/80 p-2.5 rounded-xl border border-[#E8E6DF] shadow-2xs transition-colors group"
        >
          <GoogleGIcon className="w-4 h-4 shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs text-[#0B192C]">4.9★</span>
              <div className="flex text-[#E5A93C]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-[#E5A93C]" />
                ))}
              </div>
            </div>
            <span className="text-[10px] text-[#5A6578] truncate group-hover:text-[#0B192C]">
              Google Reviews
            </span>
          </div>
        </a>

        {/* Instagram Badge */}
        <a
          href={CANONICAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-white hover:bg-white/80 p-2.5 rounded-xl border border-[#E8E6DF] shadow-2xs transition-colors group"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0">
            <InstagramIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-[#0B192C] truncate">
              {BUREAU_INFO.instagramHandle}
            </span>
            <span className="text-[10px] text-[#5A6578] truncate group-hover:text-[#0B192C]">
              Official Instagram
            </span>
          </div>
        </a>

        {/* Facebook Badge */}
        <a
          href={CANONICAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-white hover:bg-white/80 p-2.5 rounded-xl border border-[#E8E6DF] shadow-2xs transition-colors group"
        >
          <div className="w-5 h-5 rounded-md bg-[#1877F2] flex items-center justify-center text-white shrink-0">
            <FacebookIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-[#0B192C] truncate">
              Swati HTB
            </span>
            <span className="text-[10px] text-[#5A6578] truncate group-hover:text-[#0B192C]">
              Facebook Page
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

/**
 * Social Sharing and Bureau Trust Badge for Teacher Profile
 */
export function TeacherProfileSocialTrust({
  teacherName,
  teacherId,
  qualification,
  locality,
}: {
  teacherName: string;
  teacherId: string;
  qualification?: string;
  locality?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = `Check out verified teacher profile: ${teacherName} (${qualification || "Tutor"}), ID: ${teacherId} on Swati Home Tuition Bureau, Patna.`;
  const shareWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${typeof window !== "undefined" ? window.location.href : ""}`)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-neutral-200/60 space-y-5">
      {/* Bureau Trust Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0B192C] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#E5A93C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#0B192C]">
                Verified by Swati Home Tuition Bureau
              </span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-[#5A6578] mt-0.5">
              Patna&apos;s leading network of verified home tutors &amp; educators
            </p>
          </div>
        </div>

        {/* Google 4.9★ Trust Chip */}
        <a
          href={CANONICAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E8E6DF] px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <GoogleGIcon className="w-4 h-4 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs text-[#0B192C]">4.9★</span>
            <div className="flex text-[#E5A93C]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-[#E5A93C]" />
              ))}
            </div>
            <span className="text-[11px] text-[#5A6578] border-l border-[#E8E6DF] pl-1.5">
              Google Reviews
            </span>
          </div>
        </a>
      </div>

      {/* Social Sharing & Follow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6578] flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#0B192C]" /> Share Teacher Profile
          </h4>
          <p className="text-xs text-[#5A6578] mt-0.5">
            Recommend {teacherName.split(" ")[0]} to friends or family in Patna
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Share */}
          <a
            href={shareWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 px-3 py-1.5 rounded-xl transition-all"
          >
            <span>Share on WhatsApp</span>
          </a>

          {/* Facebook Share */}
          <a
            href={shareFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 px-3 py-1.5 rounded-xl transition-all"
          >
            <FacebookIcon className="w-3 h-3" />
            <span>Share</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B192C] bg-[#FAF7F2] hover:bg-[#E8E6DF] border border-[#E8E6DF] px-3 py-1.5 rounded-xl transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Follow Channels */}
      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E6DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-[#5A6578] font-medium text-center sm:text-left">
          Follow Swati HTB for tutor updates &amp; academic tips:
        </span>
        <div className="flex items-center gap-2">
          <a
            href={CANONICAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-pink-700 hover:underline"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
          <span className="text-[#5A6578]">·</span>
          <a
            href={CANONICAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:underline"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>
          <span className="text-[#5A6578]">·</span>
          <a
            href={CANONICAL_LINKS.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#0B192C] hover:underline"
          >
            <GoogleGIcon className="w-3.5 h-3.5" />
            <span>Reviews</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact promotional widget for Parent Portal Sidebar
 */
export function ParentPortalSidebarPromo() {
  return (
    <div className="mt-4 bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E6DF] space-y-3">
      <div className="flex items-center gap-1.5">
        <div className="flex text-[#E5A93C]">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-[#E5A93C]" />
          ))}
        </div>
        <span className="text-xs font-bold text-[#0B192C]">4.9★ on Google</span>
      </div>
      <p className="text-[11px] text-[#5A6578] leading-tight">
        Satisfied with your home tutor? Share a review on Google!
      </p>
      <a
        href={CANONICAL_LINKS.googleReviews}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-2xs"
      >
        <GoogleGIcon className="w-3.5 h-3.5" />
        <span>Rate Us on Google</span>
      </a>
      <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-around text-xs">
        <a
          href={CANONICAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5A6578] hover:text-pink-600 transition-colors p-1"
          title={`Instagram ${BUREAU_INFO.instagramHandle}`}
          aria-label="Instagram"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href={CANONICAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5A6578] hover:text-blue-600 transition-colors p-1"
          title="Facebook Swati Home Tuition Bureau"
          aria-label="Facebook"
        >
          <FacebookIcon className="w-4 h-4" />
        </a>
        <a
          href={CANONICAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5A6578] hover:text-[#0B192C] transition-colors p-1"
          title="Google Reviews"
          aria-label="Google Reviews"
        >
          <GoogleGIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

/**
 * Universal Post-Submission Social & Google Review Card
 * Used across: book-demo, find-tutor, join, and review-submission
 */
export function SubmissionSuccessSocialCard({
  title = "Follow Patna's #1 Home Tuition Bureau",
  subtitle = "While our team prepares your details, connect with our official channels & see why 500+ Patna families rate us 4.9★ on Google.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E6DF] text-left space-y-4 my-6 shadow-xs">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B192C] bg-white px-2 py-0.5 rounded-md border border-[#E8E6DF]">
              Official Bureau Registry
            </span>
          </div>
          <h4 className="font-display font-bold text-base sm:text-lg text-[#0B192C]">
            {title}
          </h4>
        </div>

        <a
          href={CANONICAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white border border-[#E8E6DF] px-3 py-1.5 rounded-xl shadow-2xs hover:border-[#E5A93C] transition-colors text-xs"
        >
          <GoogleGIcon className="w-4 h-4" />
          <span className="font-extrabold text-[#0B192C]">4.9★</span>
          <div className="flex text-[#E5A93C]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-[#E5A93C]" />
            ))}
          </div>
        </a>
      </div>

      <p className="text-xs sm:text-sm text-[#5A6578] leading-relaxed">
        {subtitle}
      </p>

      {/* 3 Action Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Google Reviews */}
        <a
          href={CANONICAL_LINKS.googleReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-[#FAF7F2] border border-[#E8E6DF] hover:border-[#0B192C] p-3 rounded-xl transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <GoogleGIcon className="w-4 h-4 shrink-0" />
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#0B192C] transition-colors" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0B192C]">Google Business</div>
            <div className="text-[11px] text-[#5A6578]">Rate us &amp; read 500+ reviews</div>
          </div>
        </a>

        {/* Instagram */}
        <a
          href={CANONICAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-pink-50/50 border border-[#E8E6DF] hover:border-pink-300 p-3 rounded-xl transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white">
              <InstagramIcon className="w-3 h-3" />
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-pink-600 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0B192C]">{BUREAU_INFO.instagramHandle}</div>
            <div className="text-[11px] text-[#5A6578]">Follow on Instagram</div>
          </div>
        </a>

        {/* Facebook */}
        <a
          href={CANONICAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-blue-50/50 border border-[#E8E6DF] hover:border-blue-300 p-3 rounded-xl transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-5 h-5 rounded-md bg-[#1877F2] flex items-center justify-center text-white">
              <FacebookIcon className="w-3 h-3" />
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0B192C]">Swati HTB Facebook</div>
            <div className="text-[11px] text-[#5A6578]">Official Facebook Page</div>
          </div>
        </a>
      </div>
    </div>
  );
}

/**
 * Official Student ID & Bureau Accreditation Card
 * For Student Profile and Student Portal view
 */
export function StudentPortalSocialCard({
  studentName,
  studentClass,
  enrollmentStatus = "Enrolled Student",
}: {
  studentName?: string;
  studentClass?: string;
  enrollmentStatus?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#0B192C] via-[#0F2238] to-[#1E3E62] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-[#E5A93C]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-60 h-60 bg-[#E5A93C]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#E5A93C] text-[#0B192C] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Verified Enrollment
            </span>
            <span className="text-xs text-[#E5A93C] font-semibold">
              Swati Home Tuition Bureau
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {studentName ? `${studentName} — ${studentClass || "Student"}` : "Swati HTB Academic Protection"}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Your tuition is backed by Patna&apos;s highest-rated bureau with 48-hour tutor replacement and monthly performance tracking.
          </p>
        </div>

        {/* Action badges with GBP, Instagram, Facebook */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <a
            href={CANONICAL_LINKS.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-2">
              <GoogleGIcon className="w-4 h-4" />
              <span>Rate on Google (4.9★)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-white/50 group-hover:text-white" />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={CANONICAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-pink-600/30 border border-white/15 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-300" />
              <span>Instagram</span>
            </a>
            <a
              href={CANONICAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-blue-600/30 border border-white/15 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-blue-300" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


