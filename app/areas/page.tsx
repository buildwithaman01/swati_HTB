"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const topAreas = [
  "Boring Road", "Kankarbagh", "Patliputra Colony", "Rajendra Nagar", 
  "Anisabad", "Phulwari Sharif", "Danapur", "Digha", 
  "Ashiana Nagar", "Bailey Road", "Gola Road", "Saguna More"
];

const allAreas = [
  "AG Colony", "Agam Kuan", "Anandpuri", "Anisabad", "Ashiana Nagar", "Bailey Road", "Bazar Samiti", "Bhootnath Road", "Bihta", "Boring Canal Road", "Boring Road", "Bypass Road", "Chhajjubagh", "Danapur", "Digha", "Exhibition Road", "Frazer Road", "Gandhi Maidan", "Gardanibagh", "Gola Road", "Hanuman Nagar", "Indrapuri", "Jagdeo Path", "Kadamkuan", "Kankarbagh", "Khajpura", "Kumhrar", "Kurji", "Lohanipur", "Machhua Toli", "Mahendru", "Mithapur", "Patliputra Colony", "Patna City", "Phulwari Sharif", "Rajabazar", "Rajbanshi Nagar", "Rajendra Nagar", "Rajiv Nagar", "Ramkrishna Nagar", "Rupaspur", "Saguna More", "Sandalpur", "Shastri Nagar", "Sheikhpura", "Sipara", "Srikrishna Nagar", "Yarpur"
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AreasIndexPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-24 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
              <MapPin className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Areas We Serve in <br />
              <span className="text-[#D4A017] italic">Patna</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
              We provide verified, elite home tutors across all major localities in Patna. Find a top-rated tutor near your home today.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-24">
        
        {/* Top Areas Grid */}
        <div className="mb-24 relative">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#1F2937] mb-10 font-serif"
          >
            Popular Localities
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {topAreas.map((area, idx) => {
              const slug = area.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Link href={`/areas/${slug}`}>
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(15,76,92,0.08)] hover:border-[#D4A017]/40 transition-all duration-300 group flex items-center justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                      <span className="font-bold text-[#1F2937] group-hover:text-[#0F4C5C] transition-colors relative z-10 font-serif text-lg">
                        {area}
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#D4A017] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* All Areas List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_10px_40px_rgb(0,0,0,0.03)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <h2 className="text-3xl font-bold text-[#1F2937] mb-10 font-serif relative z-10">All Coverage Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 relative z-10">
            {allAreas.map((area, idx) => {
              const slug = area.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link 
                  href={`/areas/${slug}`} 
                  key={idx}
                  className="text-sm font-bold text-[#1F2937]/60 hover:text-[#0F4C5C] hover:underline underline-offset-4 decoration-[#D4A017]/50 transition-all"
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
