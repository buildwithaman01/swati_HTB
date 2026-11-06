"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  BookOpen,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Sparkles,
  Clock,
  Award,
  Star,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { submitLeadToCRM } from "./actions";
import { patnaAreas } from "@/lib/data/areas";
import { SubmissionSuccessSocialCard } from "@/components/promotions/PromotionBanners";

const POPULAR_LOCALITIES = [
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
  "Raja Bazar",
  "Digha",
  "Khajpura",
  "Gardanibagh",
  "Kidwaipuri",
  "Exhibition Road",
  "Kumhrar",
  "Agam Kuan",
  "Patna City"
];

function FindTutorFormContent() {
  const searchParams = useSearchParams();
  const rawLocality = searchParams.get("locality") || "";
  const rawClass = searchParams.get("classGroup") || searchParams.get("class") || "";
  const rawSubjects = searchParams.get("subjects") || "";
  const rawPreference = searchParams.get("preference") || "";

  // Normalize initial class
  const normalizeClass = (val: string) => {
    if (!val) return "";
    if (val.includes("9-10")) return "Class 9-10 (CBSE/ICSE/BSEB)";
    if (val.includes("1-5") || val.includes("1-8")) return "Class 1-5 (Primary Foundation)";
    if (val.includes("6-8")) return "Class 6-8 (Middle School)";
    if (val.includes("11-12") && val.toLowerCase().includes("commerce")) return "Class 11-12 Commerce";
    if (val.includes("11-12")) return "Class 11-12 Science (PCM/PCB)";
    if (val.toLowerCase().includes("jee")) return "JEE Main & Advanced";
    if (val.toLowerCase().includes("neet")) return "NEET Medical Entrance";
    return val;
  };

  const initialClass = normalizeClass(rawClass);
  const initialLocality = rawLocality;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/919229738307");

  const [selectedLocality, setSelectedLocality] = useState(
    initialLocality && !POPULAR_LOCALITIES.includes(initialLocality) ? "Other" : initialLocality
  );
  const [customLocality, setCustomLocality] = useState(
    initialLocality && !POPULAR_LOCALITIES.includes(initialLocality) ? initialLocality : ""
  );

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [customClass, setCustomClass] = useState("");
  const [isOtherClass, setIsOtherClass] = useState(false);

  const [subjectsText, setSubjectsText] = useState(rawSubjects || "");
  const [requirementsText, setRequirementsText] = useState(
    rawPreference ? `Preference: ${rawPreference}` : ""
  );

  const hasPreFill = Boolean(initialLocality || initialClass || rawSubjects || rawPreference);

  const handleClassSelect = (val: string) => {
    setSelectedClass(val);
    if (val === "Other") {
      setIsOtherClass(true);
    } else {
      setIsOtherClass(false);
      setCustomClass("");
    }
  };

  const handleSubjectChipClick = (chip: string) => {
    if (chip === "+ Other Subjects...") {
      setSubjectsText((prev) => (prev ? `${prev}, ` : ""));
    } else if (!subjectsText) {
      setSubjectsText(chip);
    } else if (!subjectsText.includes(chip)) {
      setSubjectsText(`${subjectsText}, ${chip}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // If "Other" locality was picked or custom is filled, ensure formData has accurate locality
    const effectiveLocality =
      selectedLocality === "Other" || !selectedLocality
        ? customLocality || (formData.get("locality_custom") as string) || "Patna"
        : selectedLocality;

    const effectiveClass =
      selectedClass === "Other"
        ? customClass || (formData.get("class_custom") as string) || "Specialized Course"
        : selectedClass;

    formData.set("locality", effectiveLocality);
    formData.set("class", effectiveClass);
    formData.set("subjects", subjectsText || (formData.get("subjects") as string) || "All Subjects");
    formData.set("requirements", requirementsText);

    try {
      const result = await submitLeadToCRM(formData);

      if (result.success) {
        toast.success("Tutor Search Initiated!", {
          description: "Your request is registered. We are matching verified tutors in your locality.",
        });
        if (result.whatsappUrl) {
          setWhatsappUrl(result.whatsappUrl);
        }
        setSubmitted(true);
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else {
        toast.error("Could not process request", {
          description: "Please check your details or connect directly with our counselor on WhatsApp.",
        });
      }
    } catch (err) {
      toast.error("Network issue encountered", {
        description: "Please connect directly with us on WhatsApp for immediate matching.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* ── LEFT COLUMN: High-Trust Institutional Console ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-5 space-y-6"
      >
        {/* Matchmaker Protocol Card */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-[0_4px_24px_rgba(11,25,44,0.04)]">
          <div className="flex items-center justify-between pb-5 border-b border-[#E8E6DF] mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#005F56] block">
                Verification Desk
              </span>
              <h2 className="font-display text-xl font-bold text-[#0B192C]">
                How We Match Your Child
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F56]/10 text-[#005F56] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#005F56]" />
              Patna Bureau
            </span>
          </div>

          {/* 3 Step Matching System */}
          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8E6DF]">
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#E5A93C] flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm z-10">
                01
              </div>
              <div className="pt-0.5">
                <h4 className="font-display font-bold text-[#0B192C] text-base mb-1">
                  Locality & Needs Intake
                </h4>
                <p className="text-sm text-[#5A6578] leading-relaxed">
                  Tell us your child's board (CBSE/ICSE/Bihar Board), current class, weak subjects, and preferred tutor gender.
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3E62] text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm z-10">
                02
              </div>
              <div className="pt-0.5">
                <h4 className="font-display font-bold text-[#0B192C] text-base mb-1">
                  Academic Match in 24 Hours
                </h4>
                <p className="text-sm text-[#5A6578] leading-relaxed">
                  We cross-match against 1,200+ background-verified tutors within a 3–5 km radius of your address.
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#005F56] text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm z-10">
                03
              </div>
              <div className="pt-0.5">
                <h4 className="font-display font-bold text-[#0B192C] text-base mb-1">
                  100% Free In-Home Demo
                </h4>
                <p className="text-sm text-[#5A6578] leading-relaxed">
                  The educator visits your home for a 1-hour diagnostic session. Proceed only if your child is fully confident.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Metrics Pill Box */}
          <div className="mt-8 pt-6 border-t border-[#E8E6DF] grid grid-cols-2 gap-3">
            <div className="bg-[#F9F8F5] rounded-xl p-3.5 border border-[#E8E6DF]/80">
              <p className="text-xs text-[#5A6578] font-medium">Acceptance Rate</p>
              <p className="font-display text-lg font-extrabold text-[#0B192C]">98.4%</p>
              <p className="text-[11px] text-[#005F56] font-semibold">After first demo</p>
            </div>
            <div className="bg-[#F9F8F5] rounded-xl p-3.5 border border-[#E8E6DF]/80">
              <p className="text-xs text-[#5A6578] font-medium">Safety Guarantee</p>
              <p className="font-display text-lg font-extrabold text-[#0B192C]">48-Hour</p>
              <p className="text-[11px] text-[#005F56] font-semibold">Free replacement</p>
            </div>
          </div>
        </div>

        {/* Direct WhatsApp Callout Card */}
        <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-7 border border-[#1E3E62] shadow-[0_8px_32px_rgba(11,25,44,0.15)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-36 h-36 bg-[#E5A93C]/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#E5A93C]/20 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]">
                Immediate Assistance
              </span>
            </div>
            <h3 className="font-display text-lg font-bold mb-2 text-white">
              Need a tutor starting this week?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Skip the queue. Chat directly with Swati Ma&apos;am or our senior academic coordinator.
            </p>
            <a
              href="https://wa.me/919229738307?text=Hello%20Swati%20HTB,%20I%20am%20looking%20for%20an%20urgent%20home%20tutor%20in%20Patna."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp (+91 92297 38307)</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT COLUMN: High-Conversion Matching Console ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-7"
      >
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_8px_32px_rgba(11,25,44,0.06)] relative">
          {submitted ? (
            /* ── SUBMITTED STATE ── */
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#005F56]/10 border border-[#005F56]/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#005F56]" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F56]/10 text-[#005F56] text-xs font-bold uppercase tracking-wider mb-3">
                Request Registered Successfully
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C] mb-3">
                Thank You! We Have Received Your Request 🙏
              </h3>

              <p className="text-[#5A6578] text-base leading-relaxed max-w-lg mb-8">
                Our academic coordinator in Patna is reviewing verified tutors near your locality. We will share matching teacher profiles with you on WhatsApp within <strong className="text-[#0B192C]">2 to 4 hours</strong>.
              </p>

              <div className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C]">
                    Next Step: Verified Teacher Profile
                  </p>
                </div>
                <p className="text-sm text-[#5A6578] mb-4">
                  Want an immediate update? Connect with our Patna coordinator on WhatsApp to discuss your child&apos;s timing right away.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base py-4 px-6 rounded-xl shadow-[0_4px_16px_rgba(37,211,102,0.25)] transition-all group"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Send Requirements on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Official Google Business Profile, Instagram, and Facebook Badges */}
              <SubmissionSuccessSocialCard
                title="Connect with Patna's #1 Tuition Bureau"
                subtitle="While our counseling team matches your requirement, follow Swati HTB on Instagram & Facebook or check out 500+ verified parent reviews on Google Maps."
              />

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] underline underline-offset-4 transition-colors"
              >
                Submit another student requirement
              </button>
            </div>
          ) : (
            /* ── INTERACTIVE FORM ── */
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F1EC] text-[#1E3E62] text-xs font-bold uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Student Intake Form
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
                  Student Requirements
                </h3>
                <p className="text-[#5A6578] text-sm mt-1">
                  Takes 45 seconds · Free in-home trial · No registration fees
                </p>
              </div>

              {hasPreFill && (
                <div className="mb-6 p-4 rounded-xl bg-[#005F56]/10 border border-[#005F56]/20 flex items-center gap-3 text-xs text-[#005F56] font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#005F56]" />
                  <span>
                    Pre-filled from your search:{" "}
                    <strong className="text-[#0B192C]">
                      {[initialLocality, initialClass, rawSubjects, rawPreference].filter(Boolean).join(" • ")}
                    </strong>
                  </span>
                </div>
              )}

              <form id="find-tutor-form" className="space-y-6" onSubmit={handleSubmit}>
                {/* Row 1: Name and WhatsApp Number */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Parent or Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                      placeholder="e.g. Rajesh Kumar"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                      placeholder="10-digit WhatsApp number"
                    />
                  </div>
                </div>

                {/* Row 2: Class/Grade and Locality */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Class / Target Exam <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="class"
                      value={selectedClass}
                      onChange={(e) => handleClassSelect(e.target.value)}
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all cursor-pointer"
                    >
                      <option value="">Select student class...</option>
                      <option value="Class 1-5 (Primary Foundation)">Class 1–5 (Primary Foundation)</option>
                      <option value="Class 6-8 (Middle School)">Class 6–8 (Middle School)</option>
                      <option value="Class 9-10 (CBSE/ICSE/BSEB)">Class 9–10 (Board Foundation)</option>
                      <option value="Class 11-12 Science (PCM/PCB)">Class 11–12 Science (PCM/PCB)</option>
                      <option value="Class 11-12 Commerce">Class 11–12 Commerce</option>
                      <option value="Class 11-12 Humanities/Arts">Class 11–12 Humanities/Arts</option>
                      <option value="JEE Main & Advanced">JEE Main & Advanced Focus</option>
                      <option value="NEET Medical Entrance">NEET Medical Focus</option>
                      <option value="Other">+ Other Class or Target Exam...</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Patna Locality / Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="locality_select"
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all cursor-pointer"
                    >
                      <option value="">Select your area in Patna...</option>
                      {POPULAR_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="Other">+ Other Area in Patna...</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Custom Class Input if "Other" is chosen */}
                {isOtherClass && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Specify Target Grade or Course <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="class_custom"
                      type="text"
                      value={customClass}
                      onChange={(e) => setCustomClass(e.target.value)}
                      placeholder="e.g. CUET, BCA, Spoken English, Olympiad"
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                    />
                  </div>
                )}

                {/* Conditional Custom Locality Input if "Other" is chosen */}
                {(selectedLocality === "Other" || (!POPULAR_LOCALITIES.includes(selectedLocality) && selectedLocality !== "")) && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Specify Exact Locality or Landmark in Patna <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="locality_custom"
                      type="text"
                      value={customLocality}
                      onChange={(e) => setCustomLocality(e.target.value)}
                      className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                      placeholder="e.g. Near Mithapur Bus Stand, Anisabad More"
                    />
                  </div>
                )}

                {/* Row 3: Subjects Needed with Quick Multi-Select Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                      Subjects Needed <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#5A6578]">click chips or type below</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {[
                      "All Subjects",
                      "Mathematics",
                      "Science (PCM/PCB)",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "English",
                      "Commerce & Accounts",
                      "Computer / Coding",
                      "+ Other Subjects..."
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSubjectChipClick(chip)}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#F3F1EC] text-neutral-700 hover:bg-neutral-200 border border-neutral-300 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <input
                    required
                    name="subjects"
                    type="text"
                    value={subjectsText}
                    onChange={(e) => setSubjectsText(e.target.value)}
                    className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                    placeholder="e.g. Mathematics, Physics, Sanskrit, Computer Science"
                  />
                </div>

                {/* Row 4: Preferences / Requirements */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                    Preferences & Requirements (Optional)
                  </label>
                  <textarea
                    name="requirements"
                    rows={3}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50 resize-none"
                    placeholder="e.g. Prefer female tutor, 5 days a week, evening timings around 5 PM, preparing for St. Michael's school exams"
                  />
                </div>

                {/* Form Action Controls */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] disabled:opacity-60 disabled:cursor-not-allowed font-extrabold text-base py-4 px-6 rounded-xl shadow-[0_8px_20px_rgba(229,169,60,0.32)] transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0B192C]/30 border-t-[#0B192C] rounded-full animate-spin" />
                        <span>Matching Verified Tutors...</span>
                      </>
                    ) : (
                      <>
                        <span>Find Verified Tutor Now</span>
                        <ArrowRight className="w-5 h-5 text-[#0B192C] group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#5A6578] px-1 pt-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#005F56]" />
                      Zero Registration Fee
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#005F56]" />
                      Free 1-Hour Demo Trial
                    </span>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function FindTutorPage() {
  return (
    <div className="bg-[#F9F8F5] min-h-screen">
      {/* ── CINEMATIC INSTITUTIONAL HERO HEADER ── */}
      <section className="relative pt-36 pb-24 md:pt-40 md:pb-28 bg-gradient-to-b from-[#07111E] via-[#0B192C] to-[#07111E] text-white overflow-hidden">
        {/* Subtle Architectural Dot Grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-25 pointer-events-none" />

        {/* Soft Controlled Ambient Glow (No muddy orbs) */}
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
                Patna&apos;s Verified Matching Desk · 30+ Localities Active
              </span>
            </div>

            {/* High-Contrast Modern Display Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-5 font-display leading-[1.15]">
              Find Your <span className="text-[#E5A93C]">Verified Home Tutor</span> in Patna
            </h1>

            {/* Authoritative Subheading */}
            <p className="text-base sm:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-sans font-normal">
              We connect your child with Patna&apos;s most reliable, background-checked educators matched specifically to their syllabus, learning pace, and home location.
            </p>

            {/* Three Institutional Assurance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-xs sm:text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                100% Free Demo Class
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                Aadhaar & Degree Verified
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-[#E5A93C]" />
                Fast 24-Hour Matching
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONSOLE BODY ── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl py-12 md:py-16 relative z-20">
        <Suspense
          fallback={
            <div className="p-12 text-center text-[#5A6578]">
              <div className="w-8 h-8 border-2 border-[#0B192C]/20 border-t-[#0B192C] rounded-full animate-spin mx-auto mb-3" />
              Loading matching desk...
            </div>
          }
        >
          <FindTutorFormContent />
        </Suspense>
      </section>
    </div>
  );
}
