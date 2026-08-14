"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  // Simple title formatting for the stub
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-[#FAFAF8] min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-[#0F4C5C] font-bold mb-8 hover:underline">
          <ArrowLeft className="w-5 h-5" /> Back to Blogs
        </Link>
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
          <div className="mb-6 flex gap-3">
            <span className="bg-[#D4A017] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">Article</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 font-serif">
            {title}
          </h1>
          <div className="prose prose-lg text-[#1F2937]/80">
            <p className="text-xl text-[#1F2937]/60 italic mb-8">This is a placeholder for the blog post content. In a production environment, this would fetch data from a CMS or database based on the slug: "{params.slug}".</p>
            <p>At Swati Home Tuition Bureau, we believe in providing the best educational resources and insights for parents and students in Patna.</p>
            <p>Stay tuned for more informative articles on study techniques, exam preparation, and navigating the academic journey successfully.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
