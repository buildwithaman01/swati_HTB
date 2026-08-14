"use client";

import { motion } from "framer-motion";
import { PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CallbackCTA() {
  return (
    <section className="relative bg-[#0F4C5C] overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[200%] bg-white blur-[150px] rounded-full mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
            <PhoneCall className="w-8 h-8 text-[#D4A017]" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            Ready to give your child the <span className="text-[#D4A017] italic">academic edge?</span>
          </h2>
          
          <p className="text-xl text-white/80 mb-10 font-medium">
            Join hundreds of successful students in Patna. Book a free demo class today and experience the Swati difference.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book-demo">
              <button className="bg-white hover:bg-[#FAF7F2] text-[#0F4C5C] font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group w-full sm:w-auto">
                Book Free Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <a href="tel:+919229738307">
              <button className="bg-transparent border border-white/30 hover:border-white/60 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                <PhoneCall className="w-5 h-5 text-[#D4A017]" />
                Call +91 92297 38307
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
