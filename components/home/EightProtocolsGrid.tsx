"use client";

import { ArrowRight } from "lucide-react";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const PROTOCOLS_SLIDES = [
  {
    src: "/images/protocols/safety.png",
    alt: "The Safety Shield",
    title: "The Safety Shield",
    subtitle: "100% Government ID verified & Female-first matching policy for female students. Safety is non-negotiable.",
    meta: [
      { label: "Check", value: "Aadhaar Verified" },
      { label: "Policy", value: "Female-First" },
    ],
  },
  {
    src: "/images/protocols/passport.png",
    alt: "Teacher Passport",
    title: "Teacher Passport",
    subtitle: "Full verified profile & ID proof sent directly to your WhatsApp before the first demo class.",
    meta: [
      { label: "Transparency", value: "100%" },
      { label: "Timing", value: "Pre-Demo" },
    ],
  },
  {
    src: "/images/protocols/progress.png",
    alt: "Progress Pulse",
    title: "Progress Pulse",
    subtitle: "Monthly reports detailing exact syllabus coverage, test scores, and areas of improvement.",
    meta: [
      { label: "Frequency", value: "Monthly" },
      { label: "Focus", value: "Syllabus" },
    ],
  },
  {
    src: "/images/protocols/mentor.png",
    alt: "Mentor Match",
    title: "Mentor Match",
    subtitle: "Advanced students exclusively paired with actual IIT/NIT or Medical alumni for premium coaching.",
    meta: [
      { label: "Mentors", value: "IIT / NIT" },
      { label: "Students", value: "JEE / NEET" },
    ],
  },
  {
    src: "/images/protocols/pretest.png",
    alt: "Subject Pre-Test",
    title: "Subject Pre-Test",
    subtitle: "We rigorously test our teachers on subject matter expertise before they meet your child.",
    meta: [
      { label: "Screening", value: "Rigorous" },
      { label: "Quality", value: "Top 5%" },
    ],
  },
  {
    src: "/images/protocols/replacement.png",
    alt: "Replacement Promise",
    title: "Replacement Promise",
    subtitle: "Not fully satisfied with the current tutor? We guarantee a qualified replacement within 48 hours.",
    meta: [
      { label: "Turnaround", value: "48 Hours" },
      { label: "Cost", value: "Free" },
    ],
  },
  {
    src: "/images/protocols/support.png",
    alt: "24/7 Academic Support",
    title: "Academic Support",
    subtitle: "Dedicated academic counselor helpline for quick doubt resolution and tutor coordination.",
    meta: [
      { label: "Support", value: "Dedicated" },
      { label: "Response", value: "Instant" },
    ],
  },
  {
    src: "/images/protocols/pricing.png",
    alt: "Transparent Pricing",
    title: "Transparent Pricing",
    subtitle: "No hidden fees, no registration charges. Predictable monthly investments for premium education.",
    meta: [
      { label: "Hidden Fees", value: "Zero" },
      { label: "Pricing", value: "Fixed" },
    ],
  }
];

export default function EightProtocolsGrid() {
  return (
    <section className="py-32 bg-[#fafafa] relative border-t border-neutral-200 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F4C5C] tracking-tighter mb-4">
              The 8 Pillars of the <br className="hidden md:block"/>Swati System.
            </h2>
            <p className="text-lg text-neutral-500 tracking-tight">
              We are not a standard agency. We operate on strict operational protocols to ensure the absolute best academic experience and safety.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-[#D4A017] hover:text-[#b58812] transition-colors">
            Read full documentation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full">
        <CoverflowCarousel 
          slides={PROTOCOLS_SLIDES} 
          showCaption={true} 
          showNavigation={true} 
          showPagination={true}
          loop={true}
          fade={0.2}
          cardWidth="clamp(260px, 30vw, 360px)"
        />
      </div>
    </section>
  );
}
