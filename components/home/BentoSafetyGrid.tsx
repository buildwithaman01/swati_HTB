"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function BentoSafetyGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: any = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 70, damping: 20 }
    },
  };

  return (
    <section className="py-24 bg-[#FAFAF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-3"
          >
            The Swati Standard
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-[#0F4C5C] mb-4"
          >
            Safety First, Always.
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#64748B] text-lg"
          >
            We don't just send anyone to your home. We operate an 8-step system to ensure maximum safety, transparency, and results.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Main Block: The Safety Shield */}
          <motion.div 
            variants={item}
            className="md:col-span-2 lg:col-span-2 row-span-2 bg-[#0F4C5C] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group shadow-lg"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                  <svg className="w-8 h-8 text-[#D4A017]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-serif text-3xl font-bold mb-4 text-white">8-Step Safety Shield</h4>
                <p className="text-white/80 text-lg leading-relaxed max-w-md">
                  Aadhar verification, Face-Match visits, Demo observation, local reference locks, and emergency traceability. We rigorously vet every tutor.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4,5,6,7,8].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F4C5C] bg-white/20 backdrop-blur flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-white/80 self-center">100% Verified Roster</span>
              </div>
            </div>
          </motion.div>

          {/* Block: Teacher Passport */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#0F4C5C]/10">
              <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h4 className="font-bold text-lg text-[#1E293B] mb-2">Teacher Passport</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Full ID and profile sent to you before they arrive.
            </p>
          </motion.div>

          {/* Block: Subject Pre-Test */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#0F4C5C]/10">
              <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="font-bold text-lg text-[#1E293B] mb-2">Subject Pre-Test</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We test their subject knowledge before you meet them.
            </p>
          </motion.div>

          {/* Block: Female Tutors (Col Span 2) */}
          <motion.div 
            variants={item}
            className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-center"
          >
            <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#D4A017]/20">
              <svg className="w-6 h-6 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-xl text-[#1E293B] mb-2">Female-First Policy</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We understand parental concerns. By default, we prioritize matching female students with highly qualified female educators to ensure comfort and safety.
            </p>
          </motion.div>

          {/* Block: Progress Pulse */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#0F4C5C]/10">
              <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg text-[#1E293B] mb-2">Progress Pulse</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Monthly PDF reports tracking your child's growth.
            </p>
          </motion.div>

          {/* Block: Replacement Guarantee */}
          <motion.div 
            variants={item}
            className="bg-[#D4A017] rounded-3xl p-8 text-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 opacity-10">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
               </svg>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 relative z-10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-2 relative z-10">48Hr Replacement</h4>
            <p className="text-white/90 text-sm leading-relaxed relative z-10">
              New teacher, zero questions asked if you're not satisfied.
            </p>
          </motion.div>

          {/* Block: Mentor Match */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#0F4C5C]/10">
              <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg text-[#1E293B] mb-2">Mentor Match</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              IITians & Medicos for premium JEE/NEET prep.
            </p>
          </motion.div>

          {/* Block: Parent Hotline */}
          <motion.div 
            variants={item}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 border border-[#0F4C5C]/10">
              <svg className="w-5 h-5 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg text-[#1E293B] mb-2">Parent Hotline</h4>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Always-on WhatsApp support. We're one message away.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
