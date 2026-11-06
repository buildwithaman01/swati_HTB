"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Search,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Phone,
  Star,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { patnaAreas, slugify, getAreaDetails } from "@/lib/data/areas";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";

// Featured Patna educational hubs with rich card details
const FEATURED_LOCALITIES = [
  "Boring Road",
  "Kankarbagh",
  "Patliputra",
  "Bailey Road",
  "Rajendra Nagar",
  "Ashiana Nagar",
  "Danapur",
  "Anisabad",
  "Gola Road",
  "Saguna More",
  "SK Puri",
  "Raja Bazar"
];

export default function AreasIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");

  // Filtered list of all localities based on search query
  const filteredAreas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patnaAreas;
    return patnaAreas.filter((area) =>
      area.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered featured areas
  const filteredFeatured = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FEATURED_LOCALITIES;
    return FEATURED_LOCALITIES.filter((area) =>
      area.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="bg-[#F9F8F5] min-h-screen">
      {/* ── CINEMATIC INSTITUTIONAL HERO HEADER ── */}
      <section className="relative pt-36 pb-24 md:pt-40 md:pb-28 bg-gradient-to-b from-[#07111E] via-[#0B192C] to-[#07111E] text-white overflow-hidden">
        {/* Subtle Architectural Dot Grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-25 pointer-events-none" />

        {/* Soft Controlled Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-[#1E3E62]/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Live Trust Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
              <span className="text-[#E5A93C] text-xs font-bold uppercase tracking-wider">
                Patna Coverage · 80+ Localities Active
              </span>
            </div>

            {/* Sans Display Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-5 font-display leading-[1.15]">
              Areas We Serve in <span className="text-[#E5A93C]">Patna</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-sans font-normal">
              Find background-checked male and female home tutors within 3 to 5 km of your residence. Explore localities or search your neighborhood below.
            </p>

            {/* Real-time Locality Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-[0_12px_36px_rgba(0,0,0,0.25)] border border-white/20">
                <Search className="w-5 h-5 text-[#5A6578] ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your locality (e.g. Boring Road, Kankarbagh, Bailey Road...)"
                  className="w-full bg-transparent px-3 py-3 text-[#0B192C] font-medium text-sm sm:text-base focus:outline-none placeholder:text-[#5A6578]/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mr-2 text-xs font-bold px-2.5 py-1 rounded-md bg-[#F3F1EC] text-[#5A6578] hover:text-[#0B192C]"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-white/60 mt-3 flex items-center justify-center gap-4">
                <span>Popular: <strong>Boring Road</strong></span>
                <span>•</span>
                <span><strong>Kankarbagh</strong></span>
                <span>•</span>
                <span><strong>Patliputra</strong></span>
                <span>•</span>
                <span><strong>Bailey Road</strong></span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-14 md:py-20">
        
        {/* ── FEATURED LOCALITIES SECTION ── */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E6DF] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005F56] block mb-1">
                Top Educational Neighborhoods
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
                Featured Patna Hubs
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6578]">
              Showing {filteredFeatured.length} active hubs
            </p>
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-10 text-center my-6">
              <MapPin className="w-10 h-10 text-[#5A6578]/40 mx-auto mb-3" />
              <h4 className="font-display text-lg font-bold text-[#0B192C] mb-1">
                No featured hub matched &ldquo;{searchQuery}&rdquo;
              </h4>
              <p className="text-sm text-[#5A6578] mb-4">
                Check our comprehensive alphabetical list below for all 80+ covered areas.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-[#0B192C] underline underline-offset-4"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((areaName) => {
                const details = getAreaDetails(areaName);
                const slug = slugify(areaName);

                return (
                  <motion.div
                    key={areaName}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-[#E8E6DF] p-6 shadow-[0_4px_20px_rgba(11,25,44,0.03)] hover:shadow-[0_10px_30px_rgba(11,25,44,0.08)] hover:border-[#0B192C] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header: Zone & Tutor Count */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#F3F1EC] text-[#1E3E62] text-[11px] font-bold">
                          <Compass className="w-3 h-3 text-[#E5A93C]" />
                          {details.zone}
                        </span>
                        <span className="text-[11px] font-bold text-[#005F56] bg-[#005F56]/10 px-2 py-0.5 rounded">
                          {details.tutorCount}
                        </span>
                      </div>

                      {/* Locality Title */}
                      <Link href={`/areas/${slug}`}>
                        <h3 className="font-display text-xl font-bold text-[#0B192C] group-hover:text-[#1E3E62] transition-colors mb-2">
                          {areaName}
                        </h3>
                      </Link>

                      {/* Landmarks Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {details.landmarks.slice(0, 3).map((landmark, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-[#F9F8F5] text-[#5A6578] px-2 py-0.5 rounded border border-[#E8E6DF]"
                          >
                            {landmark}
                          </span>
                        ))}
                      </div>

                      {/* Top Schools in Area */}
                      <div className="text-xs text-[#5A6578] mb-5 space-y-1">
                        <p className="font-semibold text-[#0B192C] flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#E5A93C]" />
                          Near Top Schools:
                        </p>
                        <p className="line-clamp-1 text-[11px] text-[#5A6578]">
                          {details.topSchools.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="pt-4 border-t border-[#E8E6DF] flex items-center gap-2">
                      <Link
                        href={`/find-tutor?locality=${encodeURIComponent(areaName)}`}
                        className="flex-1 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-center active:scale-[0.98] shadow-sm"
                      >
                        Request Tutor Here
                      </Link>
                      <Link
                        href={`/areas/${slug}`}
                        aria-label={`View ${areaName} tuition page`}
                        className="w-9 h-9 rounded-xl bg-[#F3F1EC] hover:bg-[#0B192C] hover:text-white text-[#0B192C] flex items-center justify-center transition-colors shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── ALL LOCALITIES DIRECTORY ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_4px_24px_rgba(11,25,44,0.03)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E6DF] mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005F56] block mb-1">
                Full City Directory
              </span>
              <h2 className="font-display text-2xl font-bold text-[#0B192C]">
                All {filteredAreas.length} Coverage Areas in Patna
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3F1EC] text-[#1E3E62] self-start sm:self-auto">
              Doorstep Tuition Guaranteed
            </span>
          </div>

          {filteredAreas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base text-[#5A6578] mb-4">
                No locality found matching &ldquo;<strong>{searchQuery}</strong>&rdquo;.
              </p>
              <p className="text-sm text-[#5A6578] mb-6">
                Don&apos;t worry! Even if your specific apartment or mohalla isn&apos;t listed, we cover all corners of Patna.
              </p>
              <Link
                href="/find-tutor"
                className="inline-flex items-center gap-2 bg-[#0B192C] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#1E3E62] transition-colors"
              >
                <span>Request Custom Locality Match</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredAreas.map((area, idx) => {
                const slug = slugify(area);
                return (
                  <Link
                    key={idx}
                    href={`/areas/${slug}`}
                    className="p-3 rounded-xl bg-[#F9F8F5] hover:bg-white hover:border-[#0B192C] hover:shadow-sm border border-[#E8E6DF] transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs font-bold text-[#0B192C] group-hover:text-[#1E3E62] transition-colors truncate mr-1">
                      {area}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5A6578] group-hover:text-[#E5A93C] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Locality Assistance Box */}
          <div className="mt-10 pt-8 border-t border-[#E8E6DF] bg-[#F9F8F5] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#005F56]/10 text-[#005F56] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[#0B192C] text-base">
                  Can&apos;t find your exact colony or apartment?
                </h4>
                <p className="text-xs sm:text-sm text-[#5A6578] mt-0.5">
                  We deploy teachers across all pin codes in the greater Patna municipal area. Simply tell our coordinator your nearest landmark.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href={CANONICAL_LINKS.whatsappWithText("Hello Swati HTB, do you have tutors available in my area in Patna?")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-all"
              >
                <span>WhatsApp ({CANONICAL_LINKS.displayPhone})</span>
              </a>
              <Link
                href="/book-demo"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <span>Book Demo</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── GOOGLE BUSINESS PROFILE 4.9★ & SOCIAL TRUST BAR ── */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F1EC] text-xs font-bold text-[#0B192C]">
                <GoogleGIcon className="w-4 h-4" />
                <span>Google Business Profile • Patna</span>
                <span className="flex text-[#E5A93C] ml-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-[#E5A93C]" />
                  ))}
                </span>
                <span className="font-extrabold">{BUREAU_INFO.rating}★ Rated</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C]">
                Over 500+ Verified Parents Across Patna
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6578]">
                Read genuine reviews from families in Boring Road, Kankarbagh, Bailey Road, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href={CANONICAL_LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-xs py-3 px-5 rounded-xl transition-all shadow-sm border-b-[2px] border-[#B87C1C]"
              >
                <Star className="w-3.5 h-3.5 fill-[#0B192C]" />
                <span>Rate 5 Stars on Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={CANONICAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F9F8F5] hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-3 px-4 rounded-xl border border-[#E8E6DF] transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>{BUREAU_INFO.instagramHandle}</span>
              </a>

              <a
                href={CANONICAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F9F8F5] hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-3 px-4 rounded-xl border border-[#E8E6DF] transition-all"
              >
                <FacebookIcon className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
