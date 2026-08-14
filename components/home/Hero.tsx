"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden flex items-center pt-24 md:pt-32 pb-16 md:pb-24 text-white">
      {/* Full Screen Video Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero-video.webp"
          alt="Swati Home Tuition Learning Experience"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col items-center justify-center">
          
          {/* Main Text Content */}
          <div className="w-full max-w-4xl flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="font-serif text-4xl md:text-5xl lg:text-[5.5rem] font-bold text-white tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]"
            >
              Find the Right Tutor. <br />
              <span className="text-[#D4A017] italic drop-shadow-sm">Not Just Any Tutor.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/90 mb-10 md:mb-12 max-w-3xl leading-relaxed tracking-wide font-sans text-center mx-auto px-2"
            >
              Every child learns differently. So should their tutor. Connect with Patna's most trusted, verified home tutors for a personalized learning experience.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center gap-10 w-full"
            >
              <Link href="/book-demo">
                <button className="group flex items-center justify-center gap-3 bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-base md:text-lg font-bold shadow-[0_8px_20px_rgba(15,76,92,0.2)] hover:shadow-[0_12px_25px_rgba(15,76,92,0.3)] transition-all active:scale-95 w-full md:w-auto">
                  Book Free Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
