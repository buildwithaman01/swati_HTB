"use client";

import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BASE_RATES = {
  "1-8": 200,
  "9-10": 300,
  "11-12": 500,
  "jee-neet": 800,
};

export default function TuitionCalculator() {
  const [classGroup, setClassGroup] = useState<keyof typeof BASE_RATES>("1-8");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(1);

  // Calculate monthly fee (assume 4 weeks per month for standard calculation)
  const hourlyRate = BASE_RATES[classGroup];
  const monthlyFee = hourlyRate * hoursPerDay * daysPerWeek * 4;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#FAFAF8] opacity-50" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-sm mb-4">
              <Calculator className="w-4 h-4" /> Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4">
              Estimate Your Tuition Fee
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              No hidden charges. No registration fees. Use our interactive calculator to estimate your monthly tuition investment.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-neutral-100 flex flex-col md:flex-row gap-12">
            
            {/* Controls */}
            <div className="flex-1 space-y-8">
              {/* Class Group */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-3 block">Student's Class Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "1-8", label: "Class 1-8" },
                    { id: "9-10", label: "Class 9-10" },
                    { id: "11-12", label: "Class 11-12" },
                    { id: "jee-neet", label: "JEE / NEET" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setClassGroup(option.id as keyof typeof BASE_RATES)}
                      className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                        classGroup === option.id 
                          ? "bg-[#0F4C5C] border-[#0F4C5C] text-white shadow-md" 
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-[#0F4C5C]/30 hover:bg-[#FAF7F2]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days Per Week */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-semibold text-neutral-700 block">Days per Week</label>
                  <span className="text-sm font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2 py-1 rounded-md">{daysPerWeek} Days</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="6" 
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D4A017]"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-2 font-medium">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                </div>
              </div>

              {/* Hours Per Day */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm font-semibold text-neutral-700 block">Hours per Day</label>
                  <span className="text-sm font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2 py-1 rounded-md">{hoursPerDay} {hoursPerDay === 1 ? 'Hour' : 'Hours'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3"
                  step="0.5" 
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#D4A017]"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-2 font-medium">
                  <span>1 hr</span>
                  <span>2 hrs</span>
                  <span>3 hrs</span>
                </div>
              </div>
            </div>

            {/* Result Board */}
            <div className="w-full md:w-72 bg-[#0F4C5C] rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017]/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:bg-[#D4A017]/30"></div>
              
              <div className="relative z-10">
                <p className="text-neutral-400 font-medium mb-2">Estimated Monthly Fee</p>
                <div className="flex items-start gap-1">
                  <span className="text-2xl font-bold text-neutral-300 mt-1">₹</span>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={monthlyFee}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-5xl md:text-6xl font-bold tracking-tighter"
                    >
                      {monthlyFee.toLocaleString('en-IN')}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
                  *This is an estimate. Final fees depend on tutor experience and specific location in Patna.
                </p>
              </div>

              <Link href="/book-demo" className="relative z-10 w-full bg-white text-neutral-900 hover:bg-neutral-100 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-8">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
