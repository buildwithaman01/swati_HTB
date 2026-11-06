"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const blogs = [
  {
    title: "How to Choose the Right Home Tutor in Patna (Parent's Checklist)",
    category: "Parenting Guide",
    date: "August 12, 2026",
    excerpt: "Finding a home tutor is simple, but finding the right mentor is critical. Here are 5 verification steps every Patna parent must follow.",
    link: "/blogs/how-to-choose-right-tutor",
  },
  {
    title: "Why Female Tutors are Preferred for High School Girl Students",
    category: "Safety & Comfort",
    date: "August 05, 2026",
    excerpt: "Understanding student psychology and why Swati HTB's Female-First Policy provides unmatched security and academic confidence.",
    link: "/blogs/female-tutors-preference",
  },
  {
    title: "IIT JEE & NEET Preparation from Class 9: Strategy & Reality",
    category: "Entrance Strategy",
    date: "July 28, 2026",
    excerpt: "Should your child begin foundation prep in 9th grade? Our engineering alumni mentors break down the realistic timeline for success.",
    link: "/blogs/iit-jee-prep-class-9",
  },
];

export default function BlogsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B192C]/5 text-[#0B192C] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Academic Insights
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] tracking-tight">
              Educational Guides &amp; <span className="text-[#E5A93C]">Articles</span>
            </h2>
            <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mt-3 leading-relaxed">
              Actionable advice on board examinations, tutor selection, and student productivity in Patna.
            </p>
          </div>
          <Link href="/blogs">
            <button className="h-12 px-6 rounded-xl border-2 border-[#0B192C] text-[#0B192C] hover:bg-[#0B192C] hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0">
              View All Articles <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={blog.link} className="block h-full bg-[#F9F8F5] p-6 rounded-2xl border border-[#E8E6DF] hover:border-[#0B192C] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#005F56] bg-[#005F56]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <span className="text-xs text-[#5A6578] font-medium">{blog.date}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#0B192C] mb-3 group-hover:text-[#005F56] transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h3>

                <p className="text-sm text-[#5A6578] line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>

                <div className="mt-5 pt-4 border-t border-[#E8E6DF] flex items-center gap-1.5 text-xs font-bold text-[#0B192C] group-hover:text-[#E5A93C] transition-colors uppercase tracking-wider">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
