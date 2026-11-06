"use client";

import { motion } from "framer-motion";
import {
  FileText,
  UserCheck,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Award,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const SWATI_4_STEPS = [
  {
    stepNumber: "01",
    title: "Share Your Requirements",
    headline: "Tell us your child's academic needs & locality",
    description:
      "Submit our quick 45-second inquiry form or message our academic coordinator on WhatsApp. Share your child's class (1 to 12), board (CBSE / ICSE / BSEB), difficult subjects, preferred tutor gender, and exact Patna address.",
    badge: "Takes 45 Seconds",
    details: [
      "No registration fees or hidden charges",
      "Exact locality matching within 3–5 km",
      "Special requirements (e.g. female tutor, IIT alumni, weekend focus)"
    ]
  },
  {
    stepNumber: "02",
    title: "Review Teacher Passport on WhatsApp",
    headline: "Full background-verified dossier delivered in 24 hours",
    description:
      "Our senior academic team cross-references your requirements against 1,200+ registered tutors. Within 24 hours, we send you the teacher's complete passport on WhatsApp containing their Aadhaar verification, degree proofs, and academic background.",
    badge: "24h Guaranteed Turnaround",
    details: [
      "Government photo ID (Aadhaar/PAN) verified",
      "Academic degrees & college credentials validated",
      "Direct phone briefing with our counselor"
    ]
  },
  {
    stepNumber: "03",
    title: "Free In-Home Demo Class",
    headline: "100% complimentary trial session at your home",
    description:
      "The selected educator conducts a 1-hour diagnostic session right in your home. You and your child can evaluate their teaching methodology, communication skills, and subject clarity with zero financial commitment.",
    badge: "Zero Financial Commitment",
    details: [
      "Completely free 1-hour trial class",
      "Diagnostic test of child's concept gaps",
      "Evaluate comfort, patience, and teaching pace"
    ]
  },
  {
    stepNumber: "04",
    title: "Structured Tuition with 48h Replacement",
    headline: "Regular learning, syllabus tracking & full peace of mind",
    description:
      "Once you are completely satisfied with the demo, regular monthly tuition begins. If at any point your child's comfort drops or scheduling changes, our 48-Hour Free Replacement Guarantee ensures you receive an alternate top educator immediately.",
    badge: "48-Hour Safety Guarantee",
    details: [
      "Transparent monthly tuition structure",
      "Continuous syllabus and test-score monitoring",
      "Hassle-free tutor replacement within 48 hours if unsatisfied"
    ]
  }
];

const COMPARISON_POINTS = [
  {
    feature: "Identity Verification",
    swati: "100% Aadhaar & Address Verified In-Person",
    others: "Unverified classified posts, no identity check"
  },
  {
    feature: "Upfront Cost",
    swati: "Zero Registration Fee · Free 1-Hour Demo",
    others: "Upfront commission or registration charges"
  },
  {
    feature: "Tutor Replacement",
    swati: "Guaranteed within 48 Hours with Zero Extra Fee",
    others: "Tutor disappears; no bureau support"
  },
  {
    feature: "Academic Quality",
    swati: "Vetted subject specialists matched to child's board",
    others: "Random freelancers with unverified marks"
  }
];

export default function HowItWorksPage() {
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
                The Swati 4-Step Matching Protocol
              </span>
            </div>

            {/* Sans Display Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-5 font-display leading-[1.15]">
              How the <span className="text-[#E5A93C]">Swati System</span> Works
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-sans font-normal">
              A transparent, rigorous, and stress-free matching protocol engineered to bring Patna&apos;s most capable, background-checked educators to your doorstep.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-xs sm:text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-[#E5A93C]" />
                Zero Registration Cost
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
                Teacher Passport Provided First
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                <Award className="w-4 h-4 text-[#E5A93C]" />
                48h Replacement Guarantee
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4-STEP MATCHING PROCESS TIMELINE ── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-5xl py-16 md:py-24 relative z-20">
        
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005F56] block mb-2">
            Step-by-Step Transparency
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B192C]">
            From Request to Free Demo in 4 Steps
          </h2>
        </div>

        {/* The 4 Cards */}
        <div className="space-y-8 relative">
          {SWATI_4_STEPS.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_4px_24px_rgba(11,25,44,0.03)] hover:border-[#0B192C] transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                
                {/* Left Step Badge & Number */}
                <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#0B192C] text-[#E5A93C] flex items-center justify-center font-display font-extrabold text-2xl shadow-sm">
                    {step.stepNumber}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-md bg-[#F3F1EC] text-[#1E3E62] text-xs font-bold whitespace-nowrap">
                    {step.badge}
                  </span>
                </div>

                {/* Right Step Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#005F56]">
                      Step {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C] mb-2 group-hover:text-[#1E3E62] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm sm:text-base font-semibold text-[#1E3E62] mb-3">
                    {step.headline}
                  </p>

                  <p className="text-[#5A6578] text-sm sm:text-base leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Bullet points */}
                  <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-[#E8E6DF]">
                    {step.details.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#0B192C] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#005F56] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* ── THE SWATI DIFFERENCE COMPARISON ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-[0_4px_24px_rgba(11,25,44,0.03)]"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005F56] block mb-1">
              Safety & Accountability
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C]">
              Why Patna Parents Trust Swati Over Local Ads
            </h3>
            <p className="text-sm text-[#5A6578] mt-2">
              Unlike unverified social media groups or local posters, Swati Home Tuition Bureau acts as your institutional guarantor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8E6DF] bg-[#F9F8F5] text-xs font-bold uppercase tracking-wider text-[#1E3E62]">
                  <th className="py-3.5 px-4 rounded-l-xl">Feature</th>
                  <th className="py-3.5 px-4 text-[#005F56]">Swati Home Tuition Bureau</th>
                  <th className="py-3.5 px-4 text-[#5A6578] rounded-r-xl">Unverified Classifieds / Local Ads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF]">
                {COMPARISON_POINTS.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F9F8F5]/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-[#0B192C]">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-[#005F56] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#005F56] shrink-0" />
                      <span>{row.swati}</span>
                    </td>
                    <td className="py-4 px-4 text-[#5A6578]">
                      {row.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── HIGH-CONVERSION AMBER CALL TO ACTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 border border-[#1E3E62] shadow-[0_16px_40px_rgba(11,25,44,0.18)] relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E5A93C] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              Zero Financial Risk
            </div>
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold mb-4 text-white">
              Ready to Experience the Swati System?
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
              Schedule a free 1-hour diagnostic session at your home today. No payment needed until you are 100% convinced of the educator&apos;s ability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book-demo"
                className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-base py-4 px-8 rounded-xl shadow-[0_8px_20px_rgba(229,169,60,0.32)] transition-all inline-flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>Book Free In-Home Demo</span>
                <ArrowRight className="w-5 h-5 text-[#0B192C] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/find-tutor"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-base py-4 px-8 rounded-xl border border-white/15 transition-all inline-flex items-center justify-center"
              >
                <span>Find Tutor by Locality</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </section>
    </div>
  );
}
