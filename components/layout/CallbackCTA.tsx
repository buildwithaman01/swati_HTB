"use client";

import { motion } from "framer-motion";
import { PhoneCall, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CANONICAL_LINKS } from "@/lib/constants";

export default function CallbackCTA() {
  return (
    <section className="relative bg-[#0B192C] py-20 sm:py-24 overflow-hidden border-t-2 border-[#E5A93C]">
      {/* Crisp Architectural Grid */}
      <div className="absolute inset-0 bg-grid-dots-light opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Headline */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Looking for a Tutor for Your Child?
          </h2>

          <p className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-sans">
            Call us or message on WhatsApp. We discuss your child's requirements and usually respond with matched teacher details within 30 minutes.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-13 px-8 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm sm:text-base rounded-xl transition-all border-b-[3px] border-[#B87C1C] hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer gap-2"
            >
              Book Free Trial Class
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <a
              href={CANONICAL_LINKS.whatsappWithText("Hi, I am looking for a home tutor in Patna")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 sm:h-13 px-8 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm sm:text-base rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              WhatsApp Us ({CANONICAL_LINKS.displayPhone})
            </a>
          </div>

          <p className="mt-8 text-white/50 text-xs tracking-wide">
            📍 Banke Bihari Kunj, Mithapur, Patna · Mon–Sun 8:00 AM – 9:00 PM · Free trial class at your home
          </p>
        </motion.div>
      </div>
    </section>
  );
}
