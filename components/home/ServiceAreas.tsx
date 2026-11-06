"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const areas = [
  "Boring Road", "Kankarbagh", "Patliputra", "Rajendra Nagar",
  "Bailey Road", "Frazer Road", "Dak Bungalow", "Ashiana Nagar",
  "Phulwari Sharif", "Danapur", "Gandhi Maidan", "Anisabad",
  "Kurji", "SK Puri", "Gola Road", "Rukanpura", "Raja Bazar", "Saguna More"
];

const marqueeItems = [...areas, ...areas];
const marqueeItemsReversed = [...marqueeItems].reverse();

export default function ServiceAreas() {
  return (
    <section className="py-20 sm:py-24 bg-[#0B192C] overflow-hidden relative border-b border-[#1E3E62]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 text-center relative z-10">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          Home Tutors Available Across Patna
        </h2>
        <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Whether you live in Boring Road, Kankarbagh, Bailey Road, or Danapur, we connect you with verified teachers who live nearby and can teach at your home.
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative flex flex-col gap-5 py-4">

        {/* Row 1: Left to Right */}
        <div className="flex w-max">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity
            }}
            className="flex gap-3 px-2"
          >
            {marqueeItems.map((area, index) => (
              <div
                key={`row1-${index}`}
                className="bg-white/10 backdrop-blur-sm border border-white/15 px-6 py-3 rounded-full text-white/90 text-sm font-semibold whitespace-nowrap hover:bg-[#E5A93C] hover:border-[#E5A93C] hover:text-[#0B192C] transition-colors cursor-default"
              >
                {area}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex w-max -ml-[30vw]">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity
            }}
            className="flex gap-3 px-2"
          >
            {marqueeItemsReversed.map((area, index) => (
              <div
                key={`row2-${index}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-white/80 text-sm font-semibold whitespace-nowrap hover:bg-[#E5A93C] hover:border-[#E5A93C] hover:text-[#0B192C] transition-colors cursor-default"
              >
                {area}
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Edge gradient fog */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B192C] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B192C] to-transparent pointer-events-none z-10" />

      {/* Bottom Link */}
      <div className="text-center mt-10 relative z-10">
        <Link
          href="/areas"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#E5A93C] hover:text-[#D49228] transition-colors tracking-wide"
        >
          <span>View All Supported Localities in Patna</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
