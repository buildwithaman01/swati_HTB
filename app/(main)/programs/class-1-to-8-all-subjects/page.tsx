"use client";

import Image from "next/image";
import { CheckCircle2, ArrowRight, ChevronDown, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

export default function Class1to8Page() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="junior-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Class 1 to 8 Foundation & Growth Tuition in Patna",
          "description": "Nurturing kids' dreams, growth, and future with verified home tutors for Class 1 to 8 in Patna. Female tutors available.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Hero Header - Safe & Nurturing */}
      <section className="relative pt-32 pb-24 bg-[#FAF7F2] overflow-hidden border-b border-neutral-200">
        
        {/* Soft blob background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#D4A017]/20 blur-[120px] rounded-full mix-blend-multiply"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[120%] bg-[#0F4C5C]/10 blur-[100px] rounded-full mix-blend-multiply"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-[#0F4C5C]/60">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#0F4C5C]/30">-</span>
            <span className="text-[#0F4C5C]">Class 1 to 8</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 border border-rose-200 rounded-full mb-6">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              <span className="text-rose-600 font-bold text-sm tracking-wide uppercase">100% Verified Tutors</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-[#1F2937] tracking-tight mb-6 font-serif leading-[1.1]">
              Nurture their dreams. <br />
              <span className="text-[#0F4C5C] italic">Build their future.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#1F2937]/70 leading-relaxed font-medium mb-10">
              Young minds don't just need a teacher; they need a mentor who inspires growth and big dreams. We provide patient, highly-verified tutors (with a focus on female educators) to lay the strongest foundation for your child's future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/book-demo" className="flex-1 max-w-[280px]">
                <button className="w-full bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(15,76,92,0.3)] flex items-center justify-center gap-3 group">
                  Book a Free Trial
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
                Our Foundation for Growth
              </h2>
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10">
                For Classes 1 through 8, we do not focus on rote memorization. Our goal is to build the *habit* of learning, protect their big dreams, and develop a genuine curiosity that guarantees future academic growth.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Female-First Policy</h3>
                  <p className="text-[#1F2937]/70">We prioritize assigning verified, experienced female tutors for young children to ensure maximum comfort and a nurturing environment.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Homework Support</h3>
                  <p className="text-[#1F2937]/70">No more late-night fights over school assignments. Our tutors ensure daily school homework is completed and understood properly.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 font-serif">Future-Proof Habits</h3>
                  <p className="text-[#1F2937]/70">We focus on improving handwriting, reading speed, and developing a consistent daily study routine that sets them up for high school success.</p>
                </div>

                <div className="bg-[#1F2937] p-8 rounded-[2rem] shadow-lg text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">8-Step Safety Protocol</h3>
                  <p className="text-white/80">Every tutor undergoes strict background checks, Aadhar verification, and behavioral screening before stepping into your home.</p>
                </div>
              </div>
            </div>

            {/* FAQs Specific to Junior */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Parent FAQs</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Can I strictly request a female tutor?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, absolutely. Under our "Girls Safety Shield" protocol, parents can mandate that only female tutors be assigned to their children. We have a large roster of excellent female educators in Patna.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Will the tutor teach all subjects?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, for Classes 1 to 8, we typically assign a single highly-qualified generalist tutor who can handle all core subjects (Maths, Science, English, SST) to maintain consistency for the child.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2] border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-white">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    What if my child doesn't bond with the tutor?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-2 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Child psychology is tricky. If your child doesn't feel comfortable with the assigned tutor during the free demo or in the first week, we will replace the tutor immediately, no questions asked.
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
                  src="/images/candid_kids_1_1786135415321.png" 
                  alt="Class 1 to 8 Home Tuition" 
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl text-center">
                <h4 className="text-2xl font-bold text-[#1F2937] mb-2 font-serif">Secure Their Future.</h4>
                <p className="text-[#1F2937]/60 mb-6">Book a free, safe demo class in the comfort of your home today.</p>
                
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
