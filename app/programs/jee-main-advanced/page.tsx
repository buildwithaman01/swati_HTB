"use client";

import Image from "next/image";
import { CheckCircle2, ArrowRight, ChevronDown, GraduationCap, Target, Clock, BookOpen, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

export default function JEEMainAdvancedPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="jee-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "JEE Main & Advanced Coaching in Patna",
          "description": "Intensive PCM coaching for JEE Main and Advanced by IITian and NITian alumni in Patna. Includes DPPs, mock tests, and time management strategies.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Elite & Intense */}
      <section className="relative pt-32 pb-24 bg-[#0A192F] overflow-hidden">
        {/* Subtle grid pattern for technical feel */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4A017 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-[#0F4C5C] to-transparent opacity-40 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">JEE Main & Advanced</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A017]/20 border border-[#D4A017]/50 rounded-full mb-6">
              <BrainCircuit className="w-5 h-5 text-[#D4A017]" />
              <span className="text-[#D4A017] font-bold text-sm tracking-wide uppercase">Elite IITian Faculty</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Crack JEE with the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-yellow-200">Minds Who Did It.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-10">
              The most competitive engineering exam requires an elite strategy. Our JEE tutors are carefully selected alumni from IITs and NITs who bring high-pressure problem-solving right to your home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo" className="flex-1 max-w-[280px]">
                <button className="w-full bg-[#D4A017] hover:bg-[#e0b02f] text-[#0A192F] px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(212,160,23,0.3)] flex items-center justify-center gap-3 group">
                  Book IITian Demo
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 max-w-6xl py-20 relative z-20">
        
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left - Syllabus & Approach (Col-8) */}
          <div className="lg:col-span-7 space-y-12">
            
            <div>
              <h2 className="text-4xl font-bold text-[#1F2937] mb-8 font-serif leading-tight">
                The Swati JEE Methodology
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                School-level physics and chemistry won't cut it. JEE Advanced tests your ability to connect multiple concepts under severe time pressure. Our methodology bridges the gap between NCERT knowledge and Advanced application.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#0F4C5C]/10 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-[#0F4C5C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Advanced Problem Solving</h3>
                  <p className="text-[#1F2937]/70">We teach heuristic approaches to multi-concept problems, specifically targeting the mechanics of Advanced level physics and physical chemistry.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Customized DPPs</h3>
                  <p className="text-[#1F2937]/70">Daily Practice Problems tailored to the student's weak spots. We don't believe in generic sheets; we target exact conceptual gaps.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#0F4C5C]/10 rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-[#0F4C5C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Time & Accuracy</h3>
                  <p className="text-[#1F2937]/70">Speed is useless without accuracy. We train students on how to select which questions to skip and which to attack first to maximize percentile.</p>
                </div>

                <div className="bg-[#0F4C5C] p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <GraduationCap className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">IITian Mentorship</h3>
                  <p className="text-white/80">More than just teaching, our tutors provide psychological mentorship for the grueling 2-year preparation journey.</p>
                </div>
              </div>
            </div>

            {/* FAQs Specific to JEE */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Parent & Student FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Are the tutors actually from IIT/NIT?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes. For our premium JEE tier, we exclusively assign tutors who are alumni or senior students from IITs, NITs, or other top-tier engineering institutes. You can verify their credentials during the free demo class.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you provide study material?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, our tutors provide highly curated Daily Practice Problems (DPPs) and mock tests. We also guide students on which standard reference books (like HC Verma, Irodov, Cengage) to strictly follow.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    My child is enrolled in a big coaching institute. Can they still take home tuition?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Absolutely. In fact, 70% of our JEE students use our home tutors for 'Doubt Clearing & Concept Consolidation' alongside their massive batch classes at big institutes. Our tutors give the 1-on-1 attention those institutes lack.
                  </div>
                </details>

              </div>
            </div>

          </div>

          {/* Right - Sticky Panel (Col-5) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 space-y-8">
              
              <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-8 border-white">
                <Image 
                  src="/images/jee_student.png" 
                  alt="JEE Main and Advanced Preparation" 
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Start the Prep.</h4>
                <p className="text-[#1F2937]/60 mb-6">The JEE clock is ticking. Book a free evaluation class today.</p>
                
                <div className="flex flex-col gap-4">
                  <Link href="/book-demo">
                    <button className="w-full bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      Book Free Demo
                    </button>
                  </Link>
                  <a href="https://wa.me/919229738307" target="_blank" rel="noopener noreferrer">
                    <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      WhatsApp Us
                    </button>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
