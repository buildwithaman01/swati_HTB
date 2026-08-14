"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { label: "Students Enrolled", value: 500, suffix: "+" },
  { label: "Areas Covered", value: 30, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Verified Tutors", value: 100, suffix: "%" },
];

function Counter({ from = 0, to, suffix, inView }: { from?: number; to: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000; // 2 seconds

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Easing function for smooth slowdown
      const easeOutQuart = 1 - Math.pow(1 - progress / duration, 4);
      
      if (progress < duration) {
        setCount(Math.floor(from + (to - from) * easeOutQuart));
        requestAnimationFrame(updateCount);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(updateCount);
  }, [inView, from, to]);

  return (
    <div className="flex items-baseline justify-center">
      <span className="font-serif text-4xl md:text-5xl font-bold text-[#0F4C5C]">{count}</span>
      <span className="font-serif text-3xl md:text-4xl font-bold text-[#D4A017] ml-1">{suffix}</span>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="bg-white py-16 md:py-24 border-y border-[#0F4C5C]/5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#0F4C5C]/40 mb-10">
          Trusted by Patna Families
        </p>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center flex flex-col items-center">
              <Counter to={stat.value} suffix={stat.suffix} inView={isInView} />
              <div className="mt-2 text-sm md:text-base font-medium text-[#64748B] uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
