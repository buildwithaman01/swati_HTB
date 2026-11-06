"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Sparkles, MapPin, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { patnaAreas } from "@/lib/data/areas";

const POPULAR_AREAS = [
  "Boring Road",
  "Kankarbagh",
  "Patliputra",
  "Bailey Road",
  "Danapur",
  "Rajendra Nagar",
  "Ashiana Nagar",
  "Anisabad",
  "SK Puri",
  "Raja Bazar",
  "Gola Road",
  "Saguna More",
];

const CLASSES = [
  { value: "class-1-8", label: "Class 1 to 8 (All Subjects)" },
  { value: "class-9-10", label: "Class 9 & 10 (CBSE / ICSE / BSEB)" },
  { value: "class-11-12", label: "Class 11 & 12 (Science / Commerce / Arts)" },
  { value: "jee-main", label: "JEE Main & Advanced" },
  { value: "neet", label: "NEET Medical Entrance" },
];

const PREFERENCES = [
  { value: "any", label: "Any Verified Tutor" },
  { value: "female", label: "Female Tutor Preferred" },
  { value: "board-expert", label: "Senior Board Specialist" },
  { value: "iit-medico", label: "Engineering / Medical Graduate" },
];

const TOP_SCHOOLS = [
  "DPS Patna",
  "St. Michael's",
  "Loyola High School",
  "Notre Dame Academy",
  "St. Xavier's",
  "DAV Public School",
];

export default function Hero() {
  const router = useRouter();
  const [selectedLocality, setSelectedLocality] = useState("Boring Road");
  const [selectedClass, setSelectedClass] = useState("class-9-10");
  const [selectedPreference, setSelectedPreference] = useState("any");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      locality: selectedLocality,
      classGroup: selectedClass,
      preference: selectedPreference,
    });
    router.push(`/find-tutor?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#07111E] overflow-hidden flex flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-24 text-white">
      {/* ── Layered Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Cinematic Video / WebP Background */}
        <Image
          src="/images/hero-video.webp"
          alt="Home tuition teaching session in Patna"
          fill
          unoptimized
          className="object-cover object-center opacity-45 sm:opacity-50"
          priority
        />
        {/* Deep Oxford Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111E]/85 via-[#0B192C]/75 to-[#07111E]" />
        {/* Fine Architectural Grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-25" />
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#1E3E62]/40 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center text-center">

          {/* ── Main Headline ── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-white tracking-tight mb-5 leading-[1.12] max-w-4xl"
          >
            Find a Qualified Home Tutor in Patna.
            <span className="block text-[#E5A93C] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 sm:mt-3">
              Personalized 1-on-1 teaching at your home.
            </span>
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            CBSE, ICSE, and Bihar Board specialists with verified Aadhaar and academic credentials. Take a free trial class at home before you decide.
          </motion.p>

          {/* ── Interactive Instant Tutor Matcher Widget (Above The Fold) ── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-4xl mb-10"
          >
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/30 text-left">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">

                {/* 1. Locality */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#005F56]" /> Your Area in Patna
                  </label>
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full h-[48px] sm:h-[44px] bg-[#F3F1EC] hover:bg-[#eae7df] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] transition-colors cursor-pointer"
                  >
                    <optgroup label="Top Localities">
                      {POPULAR_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Patna Localities">
                      {patnaAreas
                        .filter((a) => !POPULAR_AREAS.includes(a))
                        .map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* 2. Grade / Class */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#005F56]" /> Student's Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-[48px] sm:h-[44px] bg-[#F3F1EC] hover:bg-[#eae7df] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] transition-colors cursor-pointer"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Tutor Preference */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#005F56]" /> Teacher Preference
                  </label>
                  <select
                    value={selectedPreference}
                    onChange={(e) => setSelectedPreference(e.target.value)}
                    className="w-full h-[48px] sm:h-[44px] bg-[#F3F1EC] hover:bg-[#eae7df] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] transition-colors cursor-pointer"
                  >
                    {PREFERENCES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Action Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full h-[48px] sm:h-[44px] bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[3px] border-[#B87C1C] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Check Available Tutors
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

              </form>
            </div>
          </motion.div>

          {/* ── Social Proof Ribbon ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/85 font-medium mb-8"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#005F56] fill-[#005F56]/20" />
              <span>Verified Aadhaar &amp; Background</span>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-[#E5A93C] fill-[#E5A93C]" />
              <span>Rated 4.9/5 by Patna Parents</span>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <span>Free 1-Hour Demo at Home</span>
            </div>
          </motion.div>

          {/* ── Patna Schools ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="w-full pt-6 border-t border-white/10 max-w-4xl"
          >
            <p className="text-xs font-medium text-white/50 mb-3">
              Trusted by families with students attending top Patna schools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/70 font-medium">
              {TOP_SCHOOLS.map((school, i) => (
                <span key={school} className="flex items-center gap-6">
                  <span className="hover:text-white transition-colors">{school}</span>
                  {i < TOP_SCHOOLS.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                  )}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
