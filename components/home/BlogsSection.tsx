"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogs = [
  {
    title: "How to choose the right home tutor in Patna?",
    category: "Parenting Guide",
    date: "August 12, 2026",
    excerpt: "Finding a home tutor is easy, but finding the right one is hard. Here are 5 things every Patna parent must check.",
    link: "/blogs/how-to-choose-right-tutor"
  },
  {
    title: "Why Female Tutors are preferred for Girl Students",
    category: "Safety First",
    date: "August 05, 2026",
    excerpt: "Understanding the psychology of comfort and why the Swati Female-First policy is changing the home tuition landscape.",
    link: "/blogs/female-tutors-preference"
  },
  {
    title: "IIT JEE Preparation from Class 9: Too Early?",
    category: "Academics",
    date: "July 28, 2026",
    excerpt: "Should your child start JEE prep in 9th grade? Our IITian mentors break down the timeline for success.",
    link: "/blogs/iit-jee-prep-class-9"
  }
];

export default function BlogsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4 font-serif">
              Latest Insights & <span className="text-[#D4A017] italic">Updates</span>
            </h2>
            <p className="text-[#64748B] text-lg max-w-xl">
              Educational guides, safety tips, and success stories from the Swati HTB team.
            </p>
          </div>
          <Link href="/blogs">
            <button className="text-[#0F4C5C] font-bold border-2 border-[#0F4C5C] px-6 py-3 rounded-full hover:bg-[#0F4C5C] hover:text-white transition-colors flex items-center gap-2">
              View All Blogs <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={blog.link}>
                <div className="h-48 rounded-2xl bg-slate-100 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C5C]/10 to-[#D4A017]/10 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0F4C5C]">
                    {blog.category}
                  </div>
                </div>
                <div className="text-sm text-[#64748B] mb-2">{blog.date}</div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3 group-hover:text-[#D4A017] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-[#64748B] line-clamp-3">
                  {blog.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
