"use client";

import { motion } from "framer-motion";

const areas = [
  "Boring Road", "Kankarbagh", "Patliputra", "Rajendra Nagar",
  "Bailey Road", "Frazer Road", "Dak Bungalow", "Ashiana Nagar",
  "Phulwari Sharif", "Danapur", "Gandhi Maidan", "Anisabad",
  "Kurji", "SK Puri", "Gola Road", "Rukanpura"
];

const marqueeItems = [...areas, ...areas, ...areas];
const marqueeItemsReversed = [...marqueeItems].reverse();

export default function ServiceAreas() {
  return (
    <section className="py-20 bg-[#0F4C5C] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
          Serving All of Patna
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto font-sans">
          From Boring Road to Danapur, our network of verified home tutors covers every major neighborhood in the city.
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative flex flex-col gap-6 transform -rotate-2 scale-105">
        
        {/* Row 1: Left to Right */}
        <div className="flex w-max">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-33.33%" }}
            transition={{ 
              ease: "linear",
              duration: 25, 
              repeat: Infinity 
            }}
            className="flex gap-4 px-2"
          >
            {marqueeItems.map((area, index) => (
              <div 
                key={`row1-${index}`}
                className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full text-white font-medium whitespace-nowrap hover:bg-[#D4A017] hover:border-[#D4A017] transition-colors cursor-default"
              >
                {area}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex w-max -ml-[50vw]">
          <motion.div
            initial={{ x: "-33.33%" }}
            animate={{ x: "0%" }}
            transition={{ 
              ease: "linear",
              duration: 35, 
              repeat: Infinity 
            }}
            className="flex gap-4 px-2"
          >
            {marqueeItemsReversed.map((area, index) => (
              <div 
                key={`row2-${index}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full text-white/80 font-medium whitespace-nowrap hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-white transition-colors cursor-default"
              >
                {area}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
      
      {/* Fog gradients to smooth the edges of the screen */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F4C5C] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0F4C5C] to-transparent pointer-events-none" />
    </section>
  );
}
