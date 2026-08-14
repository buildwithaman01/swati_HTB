"use client";

import { motion } from "framer-motion";
import { PhoneCall, UserCheck, BookOpen, GraduationCap, ArrowRight, Settings } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <PhoneCall className="w-8 h-8 text-[#0F4C5C]" />,
      title: "1. Tell Us Your Needs",
      description: "Submit a request online or call us directly. Let us know the class, subjects, locality, and any specific preferences you have for the tutor."
    },
    {
      icon: <Settings className="w-8 h-8 text-[#D4A017]" />,
      title: "2. The Matching Process",
      description: "Our academic team cross-references your requirements with our database of verified tutors, selecting the one whose teaching style best fits your child."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-[#0F4C5C]" />,
      title: "3. Background Verification",
      description: "Before sending the tutor to your home, we verify their identity (Aadhaar/PAN), address, and academic credentials to ensure absolute safety."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-[#D4A017]" />,
      title: "4. Free Demo Class",
      description: "The assigned tutor conducts a free trial class at your home. This allows you and your child to evaluate their teaching methodology without any commitment."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-[#0F4C5C]" />,
      title: "5. Begin Regular Classes",
      description: "If satisfied, regular classes commence. We provide continuous monitoring, monthly progress reports, and a hassle-free tutor replacement policy if needed."
    }
  ];

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-32 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
              <Settings className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              How it <span className="text-[#D4A017] italic">Works</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
              A transparent, rigorous, and completely stress-free process to find the perfect home tutor in Patna.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <div className="container mx-auto px-6 max-w-6xl -mt-16 relative z-20 pb-24">
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="space-y-16 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-8 items-start group"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#FAF7F2] border border-neutral-200/60 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#1F2937] mb-4 font-serif group-hover:text-[#0F4C5C] transition-colors">{step.title}</h3>
                  <p className="text-[#1F2937]/70 text-lg leading-relaxed max-w-3xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-10 bg-[#0F4C5C]/5 rounded-3xl border border-[#0F4C5C]/10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-3xl font-bold text-[#1F2937] mb-6 font-serif">Ready to get started?</h3>
            <Link href="/book-demo">
              <button className="bg-[#0F4C5C] hover:bg-[#0a3845] text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-[0_10px_30px_rgba(15,76,92,0.3)] transition-all inline-flex items-center justify-center gap-3 group">
                Request Free Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
