"use client";

import Image from "next/image";
import { CheckCircle2, ArrowRight, ChevronDown, Stethoscope, Microscope, Activity, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

export default function NEETMedicalPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="neet-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "NEET & AIIMS Medical Coaching in Patna",
          "description": "Expert PCB coaching for NEET, AIIMS, and other medical exams by PMCH students and medical professionals in Patna. Master NCERT line-by-line.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Medical & Clinical */}
      <section className="relative pt-32 pb-24 bg-[#0F4C5C] overflow-hidden">
        {/* Abstract medical/DNA style background elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 border-[40px] border-white rounded-full mix-blend-overlay"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] border-[60px] border-[#D4A017] rounded-full mix-blend-overlay blur-md"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">NEET & AIIMS Preparation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Stethoscope className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm tracking-wide uppercase">Taught by Future Doctors</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Biology in your blood. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">Physics on your fingertips.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium mb-10">
              NEET and AIIMS demand speed, extreme accuracy, and flawless memory. Our medical specialists (including top-rankers from PMCH) train you to read NCERT like a doctor reads a chart—missing nothing, to secure a seat in India's premier medical institutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo" className="flex-1 max-w-[280px]">
                <button className="w-full bg-white hover:bg-neutral-100 text-[#0F4C5C] px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group">
                  Book Free Evaluation
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
                The Swati Medical Prescription
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                A single silly mistake in NEET costs you 5 marks (4 for the question, 1 negative). Our coaching methodology is designed to eliminate these mistakes through brutal, systematic revision and NCERT mastery, ensuring you are ready for NEET, AIIMS, and any top-tier medical entrance.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:border-emerald-500/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                    <Microscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">NCERT Line-by-Line</h3>
                  <p className="text-[#1F2937]/70">For Biology and Inorganic Chemistry, NCERT is the Bible. We teach students how to read between the lines and frame their own questions.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:border-[#D4A017]/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#D4A017]/10 rounded-xl flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Physics Phobia Cure</h3>
                  <p className="text-[#1F2937]/70">Most biology students fear physics. We break down physics into formula maps and standard models that appear repeatedly in NEET.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:border-red-500/30 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Negative Marking Defense</h3>
                  <p className="text-[#1F2937]/70">We run 'Speed and Accuracy' drills designed specifically to trigger panic, teaching students how to remain calm and skip bait questions.</p>
                </div>

                <div className="bg-gradient-to-br from-[#0F4C5C] to-emerald-900 p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <Stethoscope className="w-6 h-6 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">PMCH Mentorship</h3>
                  <p className="text-white/80">Get taught and mentored by students who recently cracked NEET and secured seats in Bihar's top medical colleges.</p>
                </div>
              </div>
            </div>

            {/* FAQs Specific to NEET */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Parent & Student FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you focus more on Physics or Biology?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    It depends entirely on the student's weakness. We typically find that students score well in Biology but struggle in Physics and Physical Chemistry. Our tutors diagnose this in the first week and adjust the hourly split accordingly.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Are assertion-reasoning questions covered?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes. With the recent changes in the NEET pattern, assertion-reasoning and statement-based questions are the new rank-deciders. We have dedicated test modules just for these question types.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Do you provide test series?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, we conduct part-syllabus and full-syllabus mock tests. More importantly, our tutors sit down with the student for a 1-hour "Test Analysis" session after every mock test to review mistakes.
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
                  src="/images/jee_student_1786135342245.png" 
                  alt="NEET Medical Preparation" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay"></div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Wear the White Coat.</h4>
                <p className="text-[#1F2937]/60 mb-6">Start your journey to medical college with a free diagnostic class.</p>
                
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
