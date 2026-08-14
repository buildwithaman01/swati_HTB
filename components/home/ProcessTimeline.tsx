"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Request a Tutor",
    desc: "Fill out a quick 30-second form detailing your child's class, subject needs, and location in Patna.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    num: "02",
    title: "We Find the Perfect Match",
    desc: "Within 24 hours, our algorithm and experts select the most qualified, background-verified tutor near you.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    num: "03",
    title: "Free Demo Class",
    desc: "The tutor visits your home for a free demo. If you aren't completely satisfied, we arrange another demo at zero cost.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    num: "04",
    title: "Start Learning & Growing",
    desc: "Tuition begins. We track progress monthly to ensure your child hits their academic goals.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
];

// Individual step component — hooks called at top level, not inside map()
function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const itemRef = useRef(null);
  const inView = useInView(itemRef, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={itemRef} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row group`}>
      {/* Icon Node */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center z-10 transition-colors duration-500 group-hover:border-[#0F4C5C]">
        <div className="w-10 h-10 rounded-full bg-[#0F4C5C]/5 flex items-center justify-center text-[#0F4C5C] group-hover:bg-[#0F4C5C] group-hover:text-white transition-colors duration-500">
          {step.icon}
        </div>
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`ml-24 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} text-left`}
      >
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-[#D4A017] font-bold text-sm tracking-widest mb-2 block">STEP {step.num}</span>
          <h4 className="text-xl font-bold text-[#1E293B] mb-2">{step.title}</h4>
          <p className="text-[#64748B] leading-relaxed text-sm md:text-base">
            {step.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F4C5C] mb-4">
            How Swati Works
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            A frictionless, 4-step process designed to bring Patna's best educators directly to your living room.
          </p>
        </div>

        <div className="relative">
          {/* The Background Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 rounded-full" />

          {/* The Animated Fill Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-[#D4A017] -translate-x-1/2 rounded-full origin-top"
          />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <StepCard key={step.num} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
