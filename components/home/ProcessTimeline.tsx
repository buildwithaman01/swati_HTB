"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FileText, UserCheck, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Tell Us What Your Child Needs",
    desc: "Share your child's class, board (CBSE, ICSE, or BSEB), subjects, and your area in Patna. Fill our simple form or message us directly on WhatsApp.",
    icon: FileText,
  },
  {
    num: "02",
    title: "We Share Teacher Details on WhatsApp",
    desc: "Within 24 hours, we connect you with a verified tutor nearby and send their photo, qualifications, and teaching experience directly to your phone.",
    icon: UserCheck,
  },
  {
    num: "03",
    title: "Take a Free Trial Class at Home",
    desc: "The teacher visits your home for a 1-hour free trial lesson. Observe how they teach and ensure your child feels completely comfortable.",
    icon: Sparkles,
  },
  {
    num: "04",
    title: "Start Classes & Track Progress on the Portal",
    desc: "Begin regular classes with complete peace of mind. Parents can check attendance and test marks on our Student & Parent Portal, while teachers manage lesson schedules on the Teacher Portal.",
    icon: TrendingUp,
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const itemRef = useRef(null);
  const inView = useInView(itemRef, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <div ref={itemRef} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row group`}>
      {/* Icon Node */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-4 border-[#E8E6DF] flex items-center justify-center z-10 transition-colors duration-300 group-hover:border-[#0B192C] shadow-sm">
        <div className="w-8 h-8 rounded-full bg-[#0B192C]/5 flex items-center justify-center text-[#0B192C] group-hover:bg-[#0B192C] group-hover:text-white transition-colors duration-300">
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 40 : -40 }}
        transition={{ duration: 0.4 }}
        className={`ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'} text-left`}
      >
        <div className="bg-[#F9F8F5] p-6 rounded-2xl border border-[#E8E6DF] shadow-sm hover:shadow-md hover:border-[#0B192C] transition-all">
          <span className="text-[#E5A93C] font-bold text-xs uppercase tracking-widest mb-1.5 block">
            Step {step.num}
          </span>
          <h4 className="font-display text-lg font-bold text-[#0B192C] mb-2">
            {step.title}
          </h4>
          <p className="text-[#5A6578] leading-relaxed text-sm">
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
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-[#E8E6DF]" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] mb-4">
            How It Works
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Finding the right home tutor in Patna is simple, clear, and completely free until you are satisfied with the demo.
          </p>
        </div>

        <div className="relative">
          {/* Background Track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-[#E8E6DF] -translate-x-1/2 rounded-full" />

          {/* Animated Fill Track */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-[#E5A93C] -translate-x-1/2 rounded-full origin-top"
          />

          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, index) => (
              <StepCard key={step.num} step={step} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
