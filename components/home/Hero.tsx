"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  MapPin,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  Check,
  Phone,
  MessageCircle,
  Edit3,
  Loader2,
  UserCheck
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
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
  { value: "Class 1-5 (Primary Foundation)", label: "Class 1 to 5 (Primary Foundation)" },
  { value: "Class 6-8 (Middle School)", label: "Class 6 to 8 (Middle School All Subjects)" },
  { value: "Class 9-10 (CBSE/ICSE/BSEB)", label: "Class 9 & 10 (CBSE / ICSE / BSEB)" },
  { value: "Class 11-12 Science (PCM/PCB)", label: "Class 11 & 12 Science (PCM / PCB)" },
  { value: "Class 11-12 Commerce", label: "Class 11 & 12 Commerce (Accounts / Eco)" },
  { value: "Class 11-12 Humanities/Arts", label: "Class 11 & 12 Humanities / Arts" },
  { value: "JEE Main & Advanced", label: "JEE Main & Advanced Preparation" },
  { value: "NEET Medical Entrance", label: "NEET Medical Entrance Preparation" },
  { value: "other", label: "+ Other Class or Target Exam..." },
];

const PREFERENCES = [
  { value: "Any Verified Tutor", label: "Any Top Verified Tutor" },
  { value: "Female Tutor Preferred", label: "Female Tutor Preferred" },
  { value: "Senior Board Exam Specialist", label: "Senior Board Specialist" },
  { value: "IIT / NIT / Medical Alumni", label: "Engineering / Medical Alumni" },
];

const QUICK_SUBJECT_SUGGESTIONS = [
  "All Subjects",
  "Mathematics",
  "Science (PCM/PCB)",
  "English",
  "Social Science",
  "Commerce & Accounts",
  "Computer / Coding",
  "+ Other Subjects...",
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

  // ── Step 1 Form States ──
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLocality, setSelectedLocality] = useState("Boring Road");
  const [customLocality, setCustomLocality] = useState("");
  const [isOtherLocality, setIsOtherLocality] = useState(false);

  const [selectedClass, setSelectedClass] = useState("Class 9-10 (CBSE/ICSE/BSEB)");
  const [customClass, setCustomClass] = useState("");
  const [isOtherClass, setIsOtherClass] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [customSubject, setCustomSubject] = useState("");
  const [isOtherSubject, setIsOtherSubject] = useState(false);

  const [selectedPreference, setSelectedPreference] = useState("Any Verified Tutor");

  // ── Step 2 Form States (Contact Intake) ──
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Handlers ──
  const handleLocalityChange = (val: string) => {
    setSelectedLocality(val);
    if (val === "other") {
      setIsOtherLocality(true);
    } else {
      setIsOtherLocality(false);
      setCustomLocality("");
    }
  };

  const handleClassChange = (val: string) => {
    setSelectedClass(val);
    if (val === "other") {
      setIsOtherClass(true);
    } else {
      setIsOtherClass(false);
      setCustomClass("");
    }
  };

  const handleSubjectClick = (sub: string) => {
    if (sub === "+ Other Subjects...") {
      setIsOtherSubject(true);
      setSelectedSubject("Other");
    } else {
      setSelectedSubject(sub);
      setIsOtherSubject(false);
      setCustomSubject("");
    }
  };

  const effectiveLocality = isOtherLocality ? (customLocality.trim() || "Patna") : selectedLocality;
  const effectiveClass = isOtherClass ? (customClass.trim() || "Specialized Course") : selectedClass;
  const effectiveSubject = isOtherSubject ? (customSubject.trim() || "Custom Subjects") : selectedSubject;

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtherLocality && !customLocality.trim()) {
      toast.error("Please specify your area or colony name");
      return;
    }
    if (isOtherClass && !customClass.trim()) {
      toast.error("Please specify your student's class or course");
      return;
    }
    if (isOtherSubject && !customSubject.trim()) {
      toast.error("Please specify which subjects you need tuition for");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        formType: "book-demo",
        name: parentName.trim() || "Parent Enquiry",
        phone: phone.trim(),
        studentClass: effectiveClass,
        locality: effectiveLocality,
        subjects: `${effectiveSubject} (Preference: ${selectedPreference})`,
        address: effectiveLocality,
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        toast.success("Matching Verified Tutors!", {
          description: "Details registered. Connecting with Swati Ma'am on WhatsApp...",
        });

        const waText = encodeURIComponent(
          `Hello Swati HTB, I am looking for a verified home tutor in *${effectiveLocality}*.\n\n` +
          `• *Student Class:* ${effectiveClass}\n` +
          `• *Subjects:* ${effectiveSubject}\n` +
          `• *Preference:* ${selectedPreference}\n` +
          `• *Parent Name:* ${parentName.trim() || "Parent"}\n` +
          `• *WhatsApp:* ${phone.trim()}\n\n` +
          `Please send matching teacher profiles for a free trial class at our home.`
        );

        const targetUrl = `https://wa.me/919229738307?text=${waText}`;

        setTimeout(() => {
          window.open(targetUrl, "_blank");
        }, 1200);
      } else {
        toast.error("Could not register request", {
          description: "Please WhatsApp our counselor directly at +91 92297 38307",
        });
      }
    } catch (err) {
      toast.error("Network issue", {
        description: "Please message us directly on WhatsApp for instant assistance.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-[#0A0D12] overflow-hidden flex flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-24 text-white">
      {/* ── Natural Cinematic Background (No Harsh Blue Filter) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Real Video WebP at Natural Clarity */}
        <Image
          src="/images/hero-video.webp"
          alt="Home tuition teaching session in Patna"
          fill
          unoptimized
          className="object-cover object-center opacity-80 sm:opacity-85"
          priority
        />
        {/* Soothing Neutral Charcoal Vignette - preserves natural skin & study warmth without blue tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        {/* Subtle radial ambient warmth at the center top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(229,169,60,0.06)_0%,rgba(0,0,0,0.5)_80%)]" />
        {/* Whisper-fine architectural grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center text-center">

          {/* ── Soothing Ambient Eyebrow ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
            <span>Personalized 1-on-1 Home Tuition Across Patna</span>
          </motion.div>

          {/* ── Main Headline ── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-white tracking-tight mb-5 leading-[1.14] max-w-4xl drop-shadow-md"
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
            className="text-base sm:text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed font-sans font-normal drop-shadow-sm"
          >
            CBSE, ICSE, and Bihar Board specialists with verified Aadhaar and academic credentials. Take a free trial class at home before you decide.
          </motion.p>

          {/* ── Interactive Instant Tutor Matcher Widget (2-Step Direct Booking) ── */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-4xl mb-10 text-left"
          >
            <div className="bg-white/95 backdrop-blur-2xl p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/40">

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* ════════════════════════════════════════════════════════════
                     STEP 1: INTERACTIVE REQUIREMENT SELECTOR (WITH "OTHER")
                     ════════════════════════════════════════════════════════════ */
                  <motion.form
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleGoToStep2}
                    className="space-y-4"
                  >
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/80">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#005F56] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <h3 className="font-display font-extrabold text-[#0B192C] text-base sm:text-lg">
                          Select Your Tuition Requirements
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#005F56] bg-[#005F56]/10 px-3 py-1 rounded-full w-fit">
                        Step 1 of 2 · No Re-typing Later
                      </span>
                    </div>

                    {/* Row 1: Area & Class */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">

                      {/* 1. Locality Selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#005F56]" /> Your Area in Patna
                        </label>
                        <select
                          value={selectedLocality}
                          onChange={(e) => handleLocalityChange(e.target.value)}
                          className="w-full h-[46px] bg-[#F8F7F4] hover:bg-[#F2EFE9] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:bg-white transition-all cursor-pointer"
                        >
                          <optgroup label="Top Patna Localities">
                            {POPULAR_AREAS.map((area) => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                          </optgroup>
                          <optgroup label="All Patna Localities">
                            {patnaAreas
                              .filter((a) => !POPULAR_AREAS.includes(a))
                              .map((area) => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                          </optgroup>
                          <optgroup label="Other / Unlisted">
                            <option value="other">+ Other Area / Colony in Patna...</option>
                          </optgroup>
                        </select>
                      </div>

                      {/* 2. Grade / Class Selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#005F56]" /> Student's Class / Grade
                        </label>
                        <select
                          value={selectedClass}
                          onChange={(e) => handleClassChange(e.target.value)}
                          className="w-full h-[46px] bg-[#F8F7F4] hover:bg-[#F2EFE9] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:bg-white transition-all cursor-pointer"
                        >
                          {CLASSES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Teacher Preference */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#005F56]" /> Teacher Preference
                        </label>
                        <select
                          value={selectedPreference}
                          onChange={(e) => setSelectedPreference(e.target.value)}
                          className="w-full h-[46px] bg-[#F8F7F4] hover:bg-[#F2EFE9] border border-neutral-300 rounded-xl px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] focus:bg-white transition-all cursor-pointer"
                        >
                          {PREFERENCES.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Conditional Dynamic "Other" Inputs for Locality & Class */}
                    <AnimatePresence>
                      {(isOtherLocality || isOtherClass) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1"
                        >
                          {isOtherLocality && (
                            <div>
                              <label className="block text-[11px] font-bold text-[#0B192C] uppercase tracking-wider mb-1">
                                Specify Your Area or Landmark <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={customLocality}
                                onChange={(e) => setCustomLocality(e.target.value)}
                                placeholder="e.g. Near Mithapur Bus Stand, RPS More, Gola Road"
                                className="w-full h-[44px] bg-white border-2 border-[#E5A93C] rounded-xl px-3.5 text-sm font-medium text-neutral-900 focus:outline-none shadow-sm"
                                required
                              />
                            </div>
                          )}

                          {isOtherClass && (
                            <div>
                              <label className="block text-[11px] font-bold text-[#0B192C] uppercase tracking-wider mb-1">
                                Specify Grade or Exam Course <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={customClass}
                                onChange={(e) => setCustomClass(e.target.value)}
                                placeholder="e.g. B.Com, BCA, CUET, Spoken English, Olympiad"
                                className="w-full h-[44px] bg-white border-2 border-[#E5A93C] rounded-xl px-3.5 text-sm font-medium text-neutral-900 focus:outline-none shadow-sm"
                                required
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Row 2: Subjects Quick Chips + Custom Subject Input */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#005F56]" /> Subjects Needed
                        </span>
                        <span className="text-[11px] font-normal text-neutral-500 lowercase">
                          click to select or choose other
                        </span>
                      </label>

                      <div className="flex flex-wrap gap-2">
                        {QUICK_SUBJECT_SUGGESTIONS.map((subj) => {
                          const isSelected = isOtherSubject
                            ? subj === "+ Other Subjects..."
                            : selectedSubject === subj;

                          return (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => handleSubjectClick(subj)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                isSelected
                                  ? "bg-[#0B192C] text-white border-[#0B192C] shadow-sm"
                                  : "bg-[#F3F1EC] text-neutral-700 border-neutral-300 hover:bg-neutral-200"
                              }`}
                            >
                              {subj}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Subject Input if "+ Other Subjects..." chosen */}
                      <AnimatePresence>
                        {isOtherSubject && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <input
                              type="text"
                              value={customSubject}
                              onChange={(e) => setCustomSubject(e.target.value)}
                              placeholder="Type your subjects: e.g. Sanskrit, Computer Science / Python, French, Hindi, Accountancy"
                              className="w-full h-[44px] bg-white border-2 border-[#E5A93C] rounded-xl px-3.5 text-sm font-medium text-neutral-900 focus:outline-none shadow-sm"
                              required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200/80">
                      <div className="flex items-center gap-3 text-xs text-neutral-600 font-medium">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-[#005F56]" /> In-Person Aadhaar Checked
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-[#E5A93C]" /> Free 1-Hour Demo at Home
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto h-[48px] px-8 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[3px] border-[#B87C1C] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        Check Available Tutors in Patna
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  /* ════════════════════════════════════════════════════════════
                     STEP 2: INSTANT MATCH RESULTS & 1-TAP WHATSAPP DELIVERY
                     (Zero double filing! Retains 100% of Step 1 selections)
                     ════════════════════════════════════════════════════════════ */
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Top Progress & Match Counter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#E5A93C] text-[#0B192C] flex items-center justify-center text-xs font-extrabold">2</span>
                          <h3 className="font-display font-extrabold text-[#0B192C] text-lg sm:text-xl">
                            12+ Verified Tutors Found in {effectiveLocality}!
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Matching your exact criteria. Where should we send their verified profiles?
                        </p>
                      </div>

                      {/* Edit Button to return to Step 1 */}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B192C] hover:text-[#005F56] bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Requirements</span>
                      </button>
                    </div>

                    {/* Pre-filled Selections Summary Pills */}
                    <div className="bg-[#F8F7F4] border border-neutral-200 rounded-xl p-3.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] mr-1">
                        Your Search:
                      </span>
                      <span className="bg-white border border-neutral-300 px-2.5 py-1 rounded-md font-semibold text-[#0B192C] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#005F56]" /> {effectiveLocality}
                      </span>
                      <span className="bg-white border border-neutral-300 px-2.5 py-1 rounded-md font-semibold text-[#0B192C] flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[#005F56]" /> {effectiveClass}
                      </span>
                      <span className="bg-white border border-neutral-300 px-2.5 py-1 rounded-md font-semibold text-[#0B192C] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#005F56]" /> {effectiveSubject}
                      </span>
                      <span className="bg-white border border-neutral-300 px-2.5 py-1 rounded-md font-semibold text-[#0B192C] flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#005F56]" /> {selectedPreference}
                      </span>
                    </div>

                    {/* Sample Verified Tutor Preview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
                        <div className="w-10 h-10 rounded-full bg-[#005F56]/10 text-[#005F56] flex items-center justify-center font-bold text-sm shrink-0">
                          PK
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-neutral-900 truncate">Pooja K. (M.Sc, Patna Univ)</p>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#005F56] shrink-0" />
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">Math & Science • 4.9★ (38 demos taught)</p>
                        </div>
                      </div>

                      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
                        <div className="w-10 h-10 rounded-full bg-[#0B192C]/10 text-[#0B192C] flex items-center justify-center font-bold text-sm shrink-0">
                          RR
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-neutral-900 truncate">Ravi Ranjan (B.Tech NIT)</p>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#005F56] shrink-0" />
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">Senior Board Specialist • 5.0★</p>
                        </div>
                      </div>
                    </div>

                    {/* Final Step 2 Form (Name & WhatsApp Only - Zero Double Entry!) */}
                    {submitted ? (
                      <div className="bg-[#005F56]/10 border border-[#005F56]/30 rounded-2xl p-5 text-center space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-[#005F56] mx-auto" />
                        <h4 className="font-display font-extrabold text-[#0B192C] text-lg">
                          Tutor Matching Dispatched!
                        </h4>
                        <p className="text-xs text-neutral-600 max-w-md mx-auto">
                          Swati Ma&apos;am will share complete teacher dossiers (with Aadhaar verification and degrees) to your WhatsApp shortly.
                        </p>
                        <div className="pt-2">
                          <a
                            href={`https://wa.me/919229738307?text=${encodeURIComponent(`Hello Swati HTB, I just submitted tuition requirements for ${effectiveLocality}. Please send available teacher profiles.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#20BD5A] transition-all"
                          >
                            <MessageCircle className="w-4 h-4" /> Message Directly on WhatsApp
                          </a>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleFinalSubmit} className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                              Parent or Student Name (Optional)
                            </label>
                            <input
                              type="text"
                              value={parentName}
                              onChange={(e) => setParentName(e.target.value)}
                              placeholder="e.g. Rajesh Kumar"
                              className="w-full h-[46px] bg-white border border-neutral-300 rounded-xl px-3.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] transition-all shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#0B192C] uppercase tracking-wider mb-1">
                              WhatsApp Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              pattern="[0-9]{10}"
                              title="Please enter a 10-digit mobile number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="10-digit WhatsApp number"
                              required
                              className="w-full h-[46px] bg-white border-2 border-[#E5A93C] rounded-xl px-3.5 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B192C] transition-all shadow-xs"
                            />
                          </div>
                        </div>

                        {/* Submit Action */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <p className="text-[11px] text-neutral-500 text-center sm:text-left">
                            🔒 No spam. Verified profiles and demo timings sent directly to your WhatsApp.
                          </p>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto h-[48px] px-8 bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm rounded-xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Dispatching Profiles...</span>
                              </>
                            ) : (
                              <>
                                <MessageCircle className="w-4 h-4 fill-white" />
                                <span>Get Teacher Profiles on WhatsApp</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

          {/* ── Social Proof Ribbon (Minimal Frosted Badges) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/90 font-medium mb-10"
          >
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Verified Aadhaar &amp; Background</span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-[#E5A93C] fill-[#E5A93C] shrink-0" />
              <span>Rated 4.9/5 by Patna Parents</span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <span>Free 1-Hour Demo at Home</span>
            </div>
          </motion.div>

          {/* ── Patna Schools Ticker Strip ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="w-full pt-6 border-t border-white/15 max-w-4xl"
          >
            <p className="text-xs font-medium text-white/60 mb-3 tracking-wide">
              Trusted by families with students attending top Patna schools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-white/75 font-medium">
              {TOP_SCHOOLS.map((school, i) => (
                <span key={school} className="flex items-center gap-6">
                  <span className="hover:text-white transition-colors">{school}</span>
                  {i < TOP_SCHOOLS.length - 1 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
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
