"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Students Guided", sublabel: "CBSE, ICSE & Bihar Board", value: 500, suffix: "+" },
  { label: "Patna Localities", sublabel: "Boring Road to Danapur", value: 30, suffix: "+" },
  { label: "Years in Patna", sublabel: "Serving local families", value: 6, suffix: "+" },
  { label: "Verified Tutors", sublabel: "In-person Aadhaar check", value: 100, suffix: "%" },
];

function Counter({ from = 0, to, suffix, inView }: { from?: number; to: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 1800;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
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
      <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] tracking-tight">
        {count}
      </span>
      <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E5A93C] ml-1">
        {suffix}
      </span>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="bg-[#F9F8F5] py-14 sm:py-20 border-b border-[#E8E6DF] relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0B192C]/50">
            Proven Track Record Across Patna
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E6DF]"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center flex flex-col items-center pt-6 sm:pt-0 sm:px-4">
              <Counter to={stat.value} suffix={stat.suffix} inView={isInView} />
              <div className="mt-2 text-sm sm:text-base font-bold text-[#0B192C] tracking-tight">
                {stat.label}
              </div>
              <div className="text-xs text-[#5A6578] font-medium mt-0.5">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
