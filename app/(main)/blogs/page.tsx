import { blogsData } from "@/lib/data/blogs";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock, User, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights & Articles — Home Tuition & Parenting Guides | Swati HTB",
  description: "Expert advice on exam preparation, JEE & NEET foundation, home tutor selection, and board exam strategies for parents and students in Patna.",
  alternates: {
    canonical: "https://swatihometuition.in/blogs",
  },
  openGraph: {
    title: "Educational Insights & Parenting Guides — Swati Home Tuition Bureau",
    description: "Read the latest guides on finding verified home tutors, cracking competitive exams, and school board comparisons in Patna.",
    url: "https://swatihometuition.in/blogs",
    siteName: "Swati Home Tuition Bureau",
    locale: "en_IN",
    type: "website",
  },
};

export default function BlogsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Swati HTB Educational Insights & Blog",
    "description": "Guides and articles on home tutoring, exam preparation, and academic excellence in Patna.",
    "url": "https://swatihometuition.in/blogs",
    "hasPart": blogsData.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://swatihometuition.in/blogs/${post.slug}`,
      "datePublished": post.isoDate,
      "description": post.metaDescription,
    })),
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-40 pb-24 bg-[#0F4C5C] overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3.5 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
            <BookOpen className="w-6 h-6 text-[#D4A017]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 font-serif leading-[1.15]">
            Insights <span className="text-[#D4A017] italic">&</span> Academic Guides
          </h1>
          <p className="text-lg md:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
            Actionable advice on exams, parenting, and education from Patna's top educators and verified tutors.
          </p>
        </div>
      </section>

      {/* Editorial Blog Grid */}
      <div className="container mx-auto px-6 max-w-6xl py-20 relative">
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {blogsData.map((blog) => (
            <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group h-full">
              <div className="bg-white rounded-[2rem] p-8 border border-neutral-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_35px_rgb(15,76,92,0.08)] hover:border-[#D4A017]/40 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1F2937] group-hover:text-[#0F4C5C] transition-colors leading-snug mb-3 font-serif">
                    {blog.title}
                  </h2>

                  <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {blog.date}
                  </div>
                  <span className="text-xs font-bold text-[#0F4C5C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
