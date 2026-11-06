"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, Briefcase, Calculator, TrendingUp, Landmark } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Commerce1112Page() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="commerce-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Class 11 & 12 Commerce Coaching in Patna",
          "description": "Expert home tuition for Class 11-12 Commerce in Patna. Accountancy, Business Studies, and Economics coaching tailored for board exams and CA Foundation.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Professional & Corporate */}
      <section className="relative pt-32 pb-24 bg-[#1e293b] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">Class 11 & 12 Commerce</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full mb-6">
              <Landmark className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold text-sm tracking-wide uppercase">CA / CS Pathway</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Master Accountancy. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200">Prepare for Business.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-10">
              Commerce is about understanding the language of business, not just memorizing balance sheets. We provide specialized coaching for Accountancy, Economics, and Business Studies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo" className="flex-1 max-w-[280px]">
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 group">
                  Book Free Demo
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
                The Commerce Advantage
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                Class 11 introduces entirely new subjects like Accountancy and Economics that you've never seen before. A strong conceptual grip early on is the only way to crack the CA Foundation later.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Accountancy Mastery</h3>
                  <p className="text-[#1F2937]/70">We break down complex accounting principles, journals, ledgers, and balance sheets into real-world business scenarios.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Economics Made Real</h3>
                  <p className="text-[#1F2937]/70">Micro and Macro Economics taught through current events, stock market trends, and practical case studies rather than boring theory.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Business Studies</h3>
                  <p className="text-[#1F2937]/70">Learn management principles and business environment concepts through case studies required for the board exams.</p>
                </div>

                <div className="bg-slate-800 p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <Landmark className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">CA Foundation Prep</h3>
                  <p className="text-white/80">Our tutors actively align your Class 11/12 preparation with the syllabus required to clear the ICAI CA Foundation exam.</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Commerce FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you provide specialized tutors for Accountancy?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-slate-800" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, we assign highly specialized tutors—often M.Com graduates, CA Finalists, or experienced commerce educators—who have deep expertise in Accountancy.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Is Applied Mathematics covered?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-slate-800" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, if the student has opted for Applied Mathematics, we provide dedicated tutors who specialize in the commerce-focused math syllabus rather than just standard pure mathematics.
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
                  src="/images/candid_student_1_1786135404844.png" 
                  alt="Class 11 12 Commerce Preparation" 
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Balance Your Career.</h4>
                <p className="text-[#1F2937]/60 mb-6">Master the fundamentals of business and accountancy today.</p>
                
                <div className="flex flex-col gap-4">
                  <Link href="/book-demo">
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      Book Free Demo
                    </button>
                  </Link>
                  <a href="https://wa.me/917549097748" target="_blank" rel="noopener noreferrer">
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
