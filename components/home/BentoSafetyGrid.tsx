"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck, RefreshCw, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const PILLARS = [
  {
    icon: ShieldCheck,
    tag: "Safety & Identity",
    title: "100% Aadhaar & Background Vetted",
    description: "No unverified strangers. Every educator undergoes in-person Aadhaar verification, physical address confirmation, and credential screening before visiting any Patna home.",
    features: [
      "Physical ID & address check",
      "Academic degree verification",
      "Police clearance declaration",
    ],
    highlight: "Zero Compromise on Family Safety",
  },
  {
    icon: UserCheck,
    tag: "Parent Reassurance",
    title: "Female-First Security Policy",
    description: "We understand parent concerns in Patna. We maintain a large roster of qualified, background-vetted female home tutors specifically for young learners and female students.",
    features: [
      "Dedicated female educators available",
      "Specialized in ICSE/CBSE boards",
      "Comfortable, safe home learning",
    ],
    highlight: "Trusted by 200+ Girls' Families",
  },
  {
    icon: FileCheck,
    tag: "Complete Transparency",
    title: "Teacher Passport Before First Demo",
    description: "Before any teacher arrives at your home, you receive their complete Teacher Passport on WhatsApp: verified photo, college credentials, subject expertise, and past parent ratings.",
    features: [
      "Instant WhatsApp profile delivery",
      "Verified educational qualifications",
      "Past student score improvement record",
    ],
    highlight: "Know Who Enters Your Home",
  },
  {
    icon: RefreshCw,
    tag: "Zero-Risk Guarantee",
    title: "48-Hour Free Replacement Guarantee",
    description: "Every child learns at their own frequency. If the teaching chemistry is not 100% satisfactory after the free demo or during the first month, we provide an alternate tutor within 48 hours.",
    features: [
      "No questions asked replacement",
      "Zero registration or switching fees",
      "Continuous academic counselor support",
    ],
    highlight: "Zero Lock-In, Complete Peace of Mind",
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#E5A93C] text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            The Swati Trust Protocol
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            How We Protect Your Child's Safety &amp; Progress
          </h2>
          <p className="text-base sm:text-lg text-white/75 font-normal leading-relaxed">
            Hiring a home tutor shouldn't feel like a gamble. We operate Patna's most rigorous 4-pillar verification and safety standard.
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
                  <span className="text-white/40">Pillar 0{idx + 1}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-display text-lg font-bold text-white mb-1">
              Want to inspect our tutor verification documentation?
            </h4>
            <p className="text-sm text-white/70">
              Speak directly with our academic coordinators or request a sample Teacher Passport.
            </p>
          </div>
          <Link
            href="/book-demo"
            className="shrink-0 px-6 py-3 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[2px] border-[#B87C1C] flex items-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Schedule Free In-Home Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
