"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck, RefreshCw, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const PILLARS = [
  {
    icon: ShieldCheck,
    tag: "Identity Check",
    title: "Verified Identity & Aadhaar Check",
    description: "No unverified strangers. Every tutor undergoes in-person Aadhaar verification, physical address confirmation, and original degree checks at our Mithapur office.",
    features: [
      "Original Aadhaar & address proof verified",
      "College degrees & academic certificates checked",
      "Signed conduct and background declaration",
    ],
    highlight: "100% In-Person Verified",
  },
  {
    icon: UserCheck,
    tag: "Female Tutors",
    title: "Experienced Female Tutors for Girls",
    description: "We understand that many parents in Patna prefer female home tutors for their daughters. We have hundreds of qualified female educators across CBSE, ICSE, and state boards.",
    features: [
      "Qualified female educators for all classes",
      "Comfortable and secure environment at home",
      "Available across all major Patna neighborhoods",
    ],
    highlight: "Preferred by 250+ Patna Families",
  },
  {
    icon: FileCheck,
    tag: "Advance Profile",
    title: "Complete Teacher Details Sent on WhatsApp",
    description: "Before any teacher visits for the demo, we send their complete profile on WhatsApp: photo, college qualifications, teaching experience, and subjects covered.",
    features: [
      "Photo & verified qualifications on WhatsApp",
      "Details of past teaching experience",
      "Zero surprises — you know exactly who is coming",
    ],
    highlight: "Full Transparency Before Demo",
  },
  {
    icon: RefreshCw,
    tag: "Tutor Replacement",
    title: "48-Hour Tutor Replacement Guarantee",
    description: "Every child learns at their own pace. If you or your child are not completely satisfied after the demo or during the first month, we provide an alternate tutor within 48 hours.",
    features: [
      "Hassle-free replacement at no extra charge",
      "Zero registration or bureau switching fees",
      "Direct phone support from our Patna coordinators",
    ],
    highlight: "Complete Peace of Mind",
  },
];

export default function BentoSafetyGrid() {
  return (
    <section className="py-20 sm:py-28 bg-[#0B192C] text-white relative overflow-hidden border-b border-[#1E3E62]">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-grid-dots-light opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Your Child's Safety is Our First Responsibility
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-normal leading-relaxed max-w-2xl mx-auto">
            Inviting a teacher into your home requires trust. Every educator registered with Swati Home Tuition Bureau is physically verified in person before visiting any Patna household.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#0E2238]/90 border border-white/15 rounded-2xl p-7 sm:p-9 hover:border-[#E5A93C] transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl"
              >
                <div>
                  {/* Top Bar: Icon + Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/20 flex items-center justify-center text-[#E5A93C] group-hover:bg-[#E5A93C] group-hover:text-[#0B192C] transition-colors">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 px-3 py-1 rounded-full border border-[#E5A93C]/20">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#E5A93C] transition-colors leading-snug">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6 font-sans">
                    {pillar.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {pillar.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/85">
                        <CheckCircle2 className="w-4 h-4 text-[#005F56] shrink-0 fill-[#005F56]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Highlight Badge */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span className="font-medium text-[#E5A93C]">{pillar.highlight}</span>
                  <span className="text-white/40">Check 0{idx + 1}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-display text-lg font-bold text-white mb-1">
              Have questions about our tutor verification?
            </h4>
            <p className="text-sm text-white/70">
              Speak directly with our Patna team or message us on WhatsApp anytime.
            </p>
          </div>
          <Link
            href="/book-demo"
            className="shrink-0 px-6 py-3 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[2px] border-[#B87C1C] flex items-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Book Free Trial Class
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
