"use client";

import Link from "next/link";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const blogs = [
  {
    slug: "how-to-find-best-home-tutor-in-patna",
    title: "How to Find the Best Home Tutor in Patna (2026 Guide)",
    excerpt: "Finding a home tutor in Patna can be overwhelming. Here is a step-by-step guide on what to check before hiring.",
    date: "Aug 10, 2026",
    category: "Parenting",
  },
  {
    slug: "jee-preparation-strategy-from-class-9",
    title: "Why JEE Preparation Must Start from Class 9",
    excerpt: "The competition for IITs is fiercer than ever. Learn why foundation courses in Class 9 give students an unbeatable edge.",
    date: "Aug 05, 2026",
    category: "JEE Prep",
  },
  {
    slug: "importance-of-female-tutors-for-girls",
    title: "The Importance of Female Home Tutors for Girl Students",
    excerpt: "Why Swati HTB enforces a strict female-first matching policy for female students across Patna.",
    date: "Jul 28, 2026",
    category: "Safety",
  },
  {
    slug: "cbse-vs-icse-which-is-better-in-patna",
    title: "CBSE vs ICSE: Which Board is Better in Patna?",
    excerpt: "A comprehensive comparison of the CBSE and ICSE boards to help parents make the right choice for their child's future.",
    date: "Jul 15, 2026",
    category: "Academics",
  }
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BlogsPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-24 bg-[#0F4C5C] overflow-hidden">
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
              <BookOpen className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Insights <span className="text-[#D4A017] italic">&</span> Articles
            </h1>
            <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
              Expert advice on exams, parenting, and education from Patna's top academicians and tutors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Editorial Blog Grid */}
      <div className="container mx-auto px-6 max-w-6xl py-24 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-10 relative z-10"
        >
          {blogs.map((blog, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <Link href={`/blogs/${blog.slug}`}>
                <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(15,76,92,0.08)] hover:border-[#D4A017]/30 transition-all duration-500 group h-full flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Subtle Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017] bg-[#FAF7F2] px-4 py-1.5 rounded-full border border-[#D4A017]/20">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1F2937]/40 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.date}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-[#1F2937] tracking-tight mb-4 font-serif leading-[1.2] group-hover:text-[#0F4C5C] transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-[#1F2937]/70 leading-relaxed font-medium text-lg">
                      {blog.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-10 flex items-center gap-3 text-sm font-bold text-[#1F2937]/40 group-hover:text-[#0F4C5C] transition-colors relative z-10 uppercase tracking-widest">
                    Read Article
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-transparent group-hover:border-[#D4A017]/30 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
