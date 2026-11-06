"use client";

import { useState } from "react";
import { Calculator, ArrowRight, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BASE_RATES = {
  "1-8": 200,
  "9-10": 300,
  "11-12": 500,
  "jee-neet": 800,
};

export default function TuitionCalculator() {
  const [classGroup, setClassGroup] = useState<keyof typeof BASE_RATES>("9-10");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [hoursPerDay, setHoursPerDay] = useState(1.5);

  const hourlyRate = BASE_RATES[classGroup];
  const monthlyFee = Math.round(hourlyRate * hoursPerDay * daysPerWeek * 4);

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-[#E8E6DF]">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005F56]/10 text-[#005F56] font-bold text-xs uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" /> 100% Transparent Pricing
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] tracking-tight mb-4">
            Estimate Your Monthly Tuition Investment
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Zero hidden bureau registration charges. Zero lock-in contracts. Calculate estimated monthly fees based on your class level and frequency.
          </p>
        </div>

        {/* Interactive Calculator Box */}
        <div className="bg-[#F9F8F5] rounded-3xl p-6 sm:p-10 border border-[#E8E6DF] shadow-lg flex flex-col lg:flex-row gap-10 items-stretch">

          {/* Controls */}
          <div className="flex-1 space-y-7">

            {/* 1. Class Group */}
            <div>
              <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wider mb-3 block">
                1. Select Academic Level
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "1-8", label: "Class 1 to 8", desc: "All Subjects" },
                  { id: "9-10", label: "Class 9 & 10", desc: "Foundation / Boards" },
                  { id: "11-12", label: "Class 11 & 12", desc: "Boards (PCM/PCB/Comm)" },
                  { id: "jee-neet", label: "JEE / NEET", desc: "Entrance Mentorship" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setClassGroup(option.id as keyof typeof BASE_RATES)}
                    className={`py-3 px-4 rounded-xl border text-left transition-all cursor-pointer ${classGroup === option.id
                        ? "bg-[#0B192C] border-[#0B192C] text-white shadow-md"
                        : "bg-white border-[#E8E6DF] text-[#1A1D20] hover:border-[#0B192C]/40 hover:bg-neutral-50"
                      }`}
                  >
                    <div className="font-display font-bold text-sm">{option.label}</div>
                    <div className={`text-[11px] font-medium mt-0.5 ${classGroup === option.id ? "text-white/70" : "text-[#5A6578]"}`}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Days Per Week */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wider block">
                  2. Sessions Per Week
                </label>
                <span className="text-xs font-bold text-[#005F56] bg-[#005F56]/10 px-2.5 py-1 rounded-md">
                  {daysPerWeek} Days / Week
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-[#E8E6DF] rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
              />
              <div className="flex justify-between text-[11px] text-[#5A6578] mt-1.5 font-medium">
                <span>2 days</span>
                <span>3 days</span>
                <span>4 days</span>
                <span>5 days</span>
                <span>6 days</span>
              </div>
            </div>

            {/* 3. Hours Per Day */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0B192C] uppercase tracking-wider block">
                  3. Duration Per Session
                </label>
                <span className="text-xs font-bold text-[#005F56] bg-[#005F56]/10 px-2.5 py-1 rounded-md">
                  {hoursPerDay} {hoursPerDay === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full h-2 bg-[#E8E6DF] rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
              />
              <div className="flex justify-between text-[11px] text-[#5A6578] mt-1.5 font-medium">
                <span>1 hour</span>
                <span>1.5 hours</span>
                <span>2 hours</span>
                <span>2.5 hours</span>
                <span>3 hours</span>
              </div>
            </div>

          </div>

          {/* Result Board */}
          <div className="w-full lg:w-80 bg-[#0B192C] rounded-2xl p-7 sm:p-8 text-white flex flex-col justify-between relative shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] block mb-2">
                Estimated Fee
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white/80">₹</span>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={monthlyFee}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight"
                  >
                    {monthlyFee.toLocaleString('en-IN')}
                  </motion.div>
                </AnimatePresence>
                <span className="text-xs text-white/60 font-medium ml-1">/ month</span>
              </div>

              <div className="mt-6 space-y-2 pt-6 border-t border-white/10 text-xs text-white/75">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#005F56] shrink-0" />
                  <span>Free 1-Hour in-home demo class</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#005F56] shrink-0" />
                  <span>Zero bureau registration fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#005F56] shrink-0" />
                  <span>48h free tutor replacement guarantee</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/book-demo"
                className="w-full bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border-b-[2px] border-[#B87C1C] hover:-translate-y-0.5 active:translate-y-0 text-sm shadow-md cursor-pointer"
              >
                Book Free Trial Class
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[10px] text-white/40 text-center mt-3">
                Final fee may vary slightly by tutor qualification &amp; exact locality.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
