"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, PenTool, BookOpen, FileText, Verified } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Class1112BoardsPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="boards-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Class 11 & 12 Board Coaching in Patna",
          "description": "Expert home tuition for CBSE and BSEB Class 11-12 in Patna. Focus on PCM/PCB, NCERT, answer writing, and PYQs to score 95%+ in boards.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Academic & Structured */}
      <section className="relative pt-32 pb-24 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">Class 11 & 12 Boards</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A017]/20 border border-[#D4A017]/50 rounded-full mb-6">
              <Verified className="w-5 h-5 text-[#D4A017]" />
              <span className="text-[#D4A017] font-bold text-sm tracking-wide uppercase">CBSE & BSEB Specialists</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Score 95%+ with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-yellow-200">Perfect Presentation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-10">
              Knowing the answer isn't enough; writing it exactly how board examiners expect is what gets you 95%+. Our tutors train you on NCERT framing and PYQ mastery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo" className="flex-1 max-w-[280px]">
                <button className="w-full bg-[#D4A017] hover:bg-[#e0b02f] text-[#0A192F] px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(212,160,23,0.3)] flex items-center justify-center gap-3 group">
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
                The Board Exam Strategy
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                Board exams are highly predictable if you know how to study for them. Our methodology strips away unnecessary competitive-level stress and focuses purely on what CBSE/BSEB asks year after year.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#0F4C5C]/10 rounded-xl flex items-center justify-center mb-6">
                    <PenTool className="w-6 h-6 text-[#0F4C5C]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Answer Presentation</h3>
                  <p className="text-[#1F2937]/70">We teach the step-marking system. Students learn how to write point-wise answers, underline keywords, and draw clean diagrams to secure every half-mark.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">10-Year PYQ Mastery</h3>
                  <p className="text-[#1F2937]/70">By analyzing the last 10 years of Previous Year Questions, we predict the exact weightage of topics so you study smart, not just hard.</p>
                </div>

                <div className="bg-[#0F4C5C] sm:col-span-2 p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">Strict NCERT Focus</h3>
                  <p className="text-white/80">Every single board question is derived from NCERT. Our tutors ensure complete conceptual clarity of the NCERT textbook, including all in-text examples and back exercises, before moving to any reference books.</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Parent & Student FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you cover both CBSE and BSEB boards?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, we assign tutors based on your specific board. A CBSE student will get a tutor specializing in the CBSE marking scheme, while a BSEB (Bihar Board) student gets a tutor who understands the specific objective-subjective pattern of BSEB.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you help with practicals and project files?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes. 30 marks are in the hands of the school for practicals. Our tutors guide students on how to prepare their investigatory projects and prepare them for external viva questions.
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
                  alt="Class 11 12 Board Preparation" 
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Secure Your Percentage.</h4>
                <p className="text-[#1F2937]/60 mb-6">Class 12 marks stay on your resume forever. Don't risk it.</p>
                
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
