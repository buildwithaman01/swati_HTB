"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Calendar,
  Check,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SubmissionSuccessSocialCard } from "@/components/promotions/PromotionBanners";

const PATNA_LOCALITY_OPTIONS = [
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
  "Gardanibagh",
  "Kidwaipuri",
  "Exhibition Road",
  "Kumhrar",
  "Agam Kuan",
  "Patna City",
  "Other Area in Patna"
];

function BookDemoContent() {
  const searchParams = useSearchParams();
  const rawLocality = searchParams.get("locality") || "";
  const rawClass = searchParams.get("classGroup") || searchParams.get("class") || searchParams.get("studentClass") || "";
  const rawSubjects = searchParams.get("subjects") || "";
  const rawPreference = searchParams.get("preference") || "";

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
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const [selectedLocality, setSelectedLocality] = useState(
    initialLocality && !PATNA_LOCALITY_OPTIONS.includes(initialLocality) ? "Other Area in Patna" : initialLocality
  );
  const [customLocality, setCustomLocality] = useState(
    initialLocality && !PATNA_LOCALITY_OPTIONS.includes(initialLocality) ? initialLocality : ""
  );

  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [customClass, setCustomClass] = useState("");
  const [isOtherClass, setIsOtherClass] = useState(false);

  const [subjectsText, setSubjectsText] = useState(rawSubjects || "");

  const hasPreFill = Boolean(initialLocality || initialClass || rawSubjects || rawPreference);

  const formRef = useRef<HTMLFormElement>(null);

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

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const localityVal = selectedLocality === "Other Area in Patna" 
      ? customLocality || (formData.get("customLocality") as string) || "Patna"
      : selectedLocality || (formData.get("locality") as string);

    const classVal = selectedClass === "Other"
      ? customClass || (formData.get("customClass") as string) || "Specialized Course"
      : selectedClass || (formData.get("studentClass") as string);

    try {
      const data = {
        formType: "book-demo",
        name: formData.get("name"),
        phone: formData.get("phone"),
        studentClass: classVal,
        locality: localityVal,
        subjects: subjectsText || formData.get("subjects"),
        address: formData.get("address"),
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Submit to Web3Forms directly from the browser if payload provided
      if (result.web3formsData) {
        try {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              access_key: result.web3formsData.access_key,
              subject: result.web3formsData.subject,
              from_name: "Swati HTB Website",
              Parent_Student_Name: data.name || "-",
              WhatsApp_Number: data.phone || "-",
              Student_Class: data.studentClass || "-",
              Subjects_Needed: data.subjects || "-",
              Home_Address: data.address || "-",
            }),
          });
        } catch (e) {
          console.error("Web3Forms frontend submit failed:", e);
        }
      }

      if (result.success && result.whatsappUrl) {
        setWhatsappUrl(result.whatsappUrl);
        setSubmitted(true);
        toast.success("Demo Request Registered!", {
          description: "Our academic counselor will contact you within 2 hours.",
        });
        window.scrollTo({ top: 180, behavior: "smooth" });
      } else {
        toast.error("Could not register demo request", {
          description: "Please check your inputs or message our counselor directly on WhatsApp.",
        });
      }
    } catch (error) {
      toast.error("Network connection issue", {
        description: "Please retry or message us on WhatsApp for immediate scheduling.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#E5A93C] text-xs font-semibold tracking-wide mb-6">
              100% Free Trial Class at Your Home
            </div>

            {/* Sans Display Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-5 font-display leading-[1.15]">
              Book Your <span className="text-[#E5A93C]">Free In-Home Demo</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-sans font-normal">
              Experience the teaching quality of our verified Patna educators before taking any decision. Fill the form below, and our coordinator will confirm your slot within 2 hours.
            </p>

            {/* Assurance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-xs sm:text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                1-Hour Diagnostic Class
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                Aadhaar-Verified Teacher
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-[#E5A93C]" />
                Zero Obligation to Continue
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONSOLE BODY ── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl py-12 md:py-16 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: Protocol & Direct Bureau Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* The Free Demo Guarantee Card */}
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-[0_4px_24px_rgba(11,25,44,0.04)]">
              <div className="flex items-center justify-between pb-5 border-b border-[#E8E6DF] mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#005F56] block">
                    Swati Trial Policy
                  </span>
                  <h2 className="font-display text-xl font-bold text-[#0B192C]">
                    How the Free Trial Class Works
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#005F56]/10 text-[#005F56] text-xs font-bold">
                  Complimentary
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F1EC] text-[#0B192C] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B192C] text-sm">
                      Zero Upfront Registration Fee
                    </h4>
                    <p className="text-xs text-[#5A6578] leading-relaxed mt-0.5">
                      You never pay to book a demo or meet a teacher. Our matching service is completely free upfront.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F1EC] text-[#0B192C] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B192C] text-sm">
                      Verified Teacher Profile Sent First
                    </h4>
                    <p className="text-xs text-[#5A6578] leading-relaxed mt-0.5">
                      Before any tutor knocks on your door, you receive their verified ID proof, qualifications, and college background via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F1EC] text-[#0B192C] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B192C] text-sm">
                      Student-Teacher Chemistry Test
                    </h4>
                    <p className="text-xs text-[#5A6578] leading-relaxed mt-0.5">
                      Observe the educator&apos;s patience, communication, and grasp of your child&apos;s specific syllabus during the 1-hour session.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F1EC] text-[#0B192C] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B192C] text-sm">
                      48-Hour Replacement Guarantee
                    </h4>
                    <p className="text-xs text-[#5A6578] leading-relaxed mt-0.5">
                      If your child is not 100% comfortable, we provide an alternate top educator within 48 hours at no additional charge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Educator Badge */}
              <div className="mt-7 p-4 bg-[#F9F8F5] rounded-xl border border-[#E8E6DF] flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#005F56] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#0B192C]">
                    100% Background-Checked
                  </p>
                  <p className="text-[11px] text-[#5A6578]">
                    Aadhaar, address verification, and degree validation verified by our bureau.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-7 border border-[#1E3E62] shadow-[0_8px_32px_rgba(11,25,44,0.15)] relative overflow-hidden">
              <div className="absolute right-0 top-0 w-36 h-36 bg-[#E5A93C]/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] block mb-2">
                  Head Office & Counselor Desk
                </span>
                <h3 className="font-display text-lg font-bold mb-4 text-white">
                  Swati Home Tuition Bureau
                </h3>

                <div className="space-y-4 text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#E5A93C] shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold">Call or WhatsApp</p>
                      <a href="tel:+919229738307" className="font-bold text-white hover:text-[#E5A93C] transition-colors">
                        +91 92297 38307
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#E5A93C] shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold">Academic Support</p>
                      <p className="font-medium text-white break-all text-xs sm:text-sm">
                        swatihometuitionbureau@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#E5A93C] shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold">Desk Timings</p>
                      <p className="font-medium text-white">
                        Mon – Sun: 8:00 AM – 9:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-1 border-t border-white/10">
                    <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-white/50 uppercase font-semibold">Patna Bureau Address</p>
                      <p className="text-xs leading-relaxed text-white/80">
                        3rd Floor, Banke Bihari Kunj, Mithapur, Patna, Bihar 800001
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/919229738307?text=Hello%20Swati%20HTB,%20I%20would%20like%20to%20book%20a%20free%20demo%20class%20for%20my%20child."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm py-3.5 px-5 rounded-xl shadow-md transition-all active:scale-[0.99]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Instant Booking on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Interactive Demo Booking Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── SUCCESS CARD ── */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl border border-[#E8E6DF] p-8 sm:p-12 shadow-[0_8px_32px_rgba(11,25,44,0.06)] flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-[#005F56]/10 border border-[#005F56]/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#005F56]" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F56]/10 text-[#005F56] text-xs font-bold uppercase tracking-wider mb-3">
                    Trial Class Request Received
                  </span>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B192C] mb-3">
                    Thank You! We Have Received Your Request 🙏
                  </h3>

                  <p className="text-[#5A6578] text-base leading-relaxed max-w-md mb-8">
                    Our academic coordinator in Patna will call or message you on WhatsApp within <strong className="text-[#0B192C]">2 hours</strong> to share verified teacher options and schedule your child&apos;s free 1-hour trial class.
                  </p>

                  <div className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-2xl p-6 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C]">
                        Need Priority Slot Confirmation?
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5A6578] mb-4">
                      Connect directly with our counseling team on WhatsApp to review tutor profiles right away.
                    </p>
                    <a
                      href={whatsappUrl || "https://wa.me/919229738307"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm sm:text-base py-4 px-6 rounded-xl shadow-[0_4px_16px_rgba(37,211,102,0.25)] transition-all group"
                    >
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>Chat with Academic Counselor</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Official Google Business Profile, Instagram, and Facebook Badges */}
                  <SubmissionSuccessSocialCard
                    title="Connect with Patna's #1 Tuition Bureau"
                    subtitle="While our academic coordinator confirms your demo slot, check out verified student stories on Instagram or read 500+ genuine reviews on Google."
                  />

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#5A6578] hover:text-[#0B192C] underline underline-offset-4 transition-colors"
                  >
                    Submit another demo request
                  </button>
                </motion.div>
              ) : (
                /* ── DEMO BOOKING FORM ── */
                <motion.div
                  key="form-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_8px_32px_rgba(11,25,44,0.06)]"
                >
                  {/* Reassurance Banner */}
                  <div className="mb-8 pb-6 border-b border-[#E8E6DF]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F1EC] text-[#1E3E62] text-xs font-bold uppercase tracking-wider mb-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#E5A93C]" />
                      Official Trial Application
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight">
                      Book Free 1-Hour In-Home Trial
                    </h3>
                    <p className="text-[#5A6578] text-sm mt-1">
                      No advance payment · No registration cost · Complete teacher ID provided
                    </p>
                  </div>

                  {/* Pre-fill Banner */}
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

                  <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
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
                          placeholder="e.g. S.K. Verma"
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

                    {/* Row 2: Student Class & Locality */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                          Student&apos;s Class / Stream <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          name="studentClass"
                          value={selectedClass}
                          onChange={(e) => handleClassSelect(e.target.value)}
                          className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all cursor-pointer"
                        >
                          <option value="">Select class...</option>
                          <option value="Class 1-5 (Primary Foundation)">Class 1–5 (Primary Foundation)</option>
                          <option value="Class 6-8 (Middle School)">Class 6–8 (Middle School)</option>
                          <option value="Class 9-10 (CBSE/ICSE/BSEB)">Class 9–10 (Board Exam Focus)</option>
                          <option value="Class 11-12 Science (PCM/PCB)">Class 11–12 Science (PCM/PCB)</option>
                          <option value="Class 11-12 Commerce">Class 11–12 Commerce</option>
                          <option value="Class 11-12 Humanities/Arts">Class 11–12 Humanities/Arts</option>
                          <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                          <option value="NEET Medical Entrance">NEET Medical Preparation</option>
                          <option value="Other">+ Other Class or Target Exam...</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                          Locality in Patna <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          name="locality"
                          value={selectedLocality}
                          onChange={(e) => setSelectedLocality(e.target.value)}
                          className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all cursor-pointer"
                        >
                          <option value="">Select your area in Patna...</option>
                          {PATNA_LOCALITY_OPTIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Conditional custom class */}
                    {isOtherClass && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                          Specify Grade or Target Exam <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="customClass"
                          type="text"
                          value={customClass}
                          onChange={(e) => setCustomClass(e.target.value)}
                          placeholder="e.g. CUET, BCA, Spoken English, Olympiad"
                          className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                        />
                      </div>
                    )}

                    {/* Conditional other locality */}
                    {selectedLocality === "Other Area in Patna" && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                          Specify Your Exact Locality in Patna <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="customLocality"
                          type="text"
                          value={customLocality}
                          onChange={(e) => setCustomLocality(e.target.value)}
                          className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3.5 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50"
                          placeholder="e.g. Near Mithapur Bus Stand, Anisabad More"
                        />
                      </div>
                    )}

                    {/* Row 3: Specific Subjects with Quick Chips */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                          Specific Subjects for Demo Class <span className="text-red-500">*</span>
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
                        placeholder="e.g. Physics & Mathematics or Sanskrit or All Subjects"
                      />
                    </div>

                    {/* Row 4: Home Address */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] block">
                        Complete In-Home Address & Landmark in Patna <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        name="address"
                        rows={3}
                        className="w-full bg-[#F9F8F5] border border-[#E8E6DF] rounded-xl px-4 py-3 text-[#0B192C] font-medium text-sm focus:outline-none focus:border-[#0B192C] focus:ring-2 focus:ring-[#0B192C]/10 transition-all placeholder:text-[#5A6578]/50 resize-none"
                        placeholder="House / Flat No, Apartment Name, Street, Landmark, Area in Patna"
                      />
                      <p className="text-[11px] text-[#5A6578]">
                        Exact address is kept strictly confidential and shared only with the assigned verified tutor for the demo visit.
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] disabled:opacity-60 disabled:cursor-not-allowed font-extrabold text-base py-4 px-6 rounded-xl shadow-[0_8px_20px_rgba(229,169,60,0.32)] transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#0B192C]/30 border-t-[#0B192C] rounded-full animate-spin" />
                            <span>Registering Demo Slot...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Free 1-Hour Demo Class</span>
                            <ArrowRight className="w-5 h-5 text-[#0B192C] group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <div className="flex flex-wrap items-center justify-between text-xs text-[#5A6578] px-1 pt-2 gap-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Check className="w-4 h-4 text-[#005F56]" />
                          100% Free Demo Session
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <ShieldCheck className="w-4 h-4 text-[#005F56]" />
                          Strict Safety Verification
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-[#005F56]" />
                          Confirmation in 2h
                        </span>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default function BookDemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#0B192C]/20 border-t-[#0B192C] rounded-full animate-spin" />
      </div>
    }>
      <BookDemoContent />
    </Suspense>
  );
}
