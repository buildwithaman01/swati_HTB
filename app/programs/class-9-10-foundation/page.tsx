"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, Rocket, Target, BookOpen, LineChart } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Class910FoundationPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="foundation-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Class 9 & 10 Foundation & Board Coaching in Patna",
          "description": "Expert home tuition in Patna for Class 9 and 10 Boards, plus early foundation for NEET, JEE, and CA.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Strategic & Transitional */}
      <section className="relative pt-32 pb-24 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">Class 9 & 10 Foundation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A017]/20 border border-[#D4A017]/50 rounded-full mb-6">
              <Rocket className="w-5 h-5 text-[#D4A017]" />
              <span className="text-[#D4A017] font-bold text-sm tracking-wide uppercase">Board & Competitive Prep</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Ace the Boards. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-yellow-200">Prepare for the Future.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-10">
              Class 9 and 10 are the turning points. We ensure top scores in your 10th Board Exams while simultaneously building the strong conceptual foundation needed to crack NEET, JEE, or CA in the future.
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
                The Dual-Advantage Strategy
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                A common mistake is studying only for the school exams. When students suddenly transition to Class 11, they struggle to cope with the massive syllabus jump for JEE or NEET. Our tutors bridge this gap early.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Board Exam Mastery</h3>
                  <p className="text-[#1F2937]/70">Strict adherence to the CBSE/BSEB syllabus to ensure students secure 90%+ in their Class 10 board exams through rigorous mock tests.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Pre-NEET & Pre-JEE</h3>
                  <p className="text-[#1F2937]/70">We introduce analytical problem-solving early. Science and Math concepts are taught with a deeper perspective, preparing them for Class 11.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                    <LineChart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">NTSE & Olympiads</h3>
                  <p className="text-[#1F2937]/70">For ambitious students, we integrate preparation for competitive talent search exams like NTSE and Science Olympiads.</p>
                </div>

                <div className="bg-[#0F4C5C] p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">Commerce & CA Pathway</h3>
                  <p className="text-white/80">If the student is inclined towards Commerce, we build a strong foundation in Mathematics and Economics early on to make the CA journey smoother.</p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Parent & Student FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Is the focus primarily on boards or foundation?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    The immediate priority is always the Class 10 Board Exam (CBSE or BSEB), as that requires a specific answer-writing style. However, the *way* we teach the concepts ensures the student isn't just memorizing, but actually understanding the deeper mechanics required for competitive exams.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you provide separate tutors for Math and Science?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    For Class 9 and 10, we usually assign one highly capable senior tutor who specializes in both Math and Science. This ensures consistency. However, if requested, we can assign specialized subject tutors.
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
                  alt="Class 9 and 10 Foundation" 
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Start Strong.</h4>
                <p className="text-[#1F2937]/60 mb-6">Don't wait for Class 11 to start building competitive concepts.</p>
                
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
