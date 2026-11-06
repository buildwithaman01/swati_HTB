import { blogsData } from "@/lib/data/blogs";
import { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock, User, ShieldCheck, Sparkles, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Insights & Parenting Guides | Swati HTB Patna",
  description: "Practical advice on CBSE/ICSE board exams, JEE/NEET foundation, finding verified home tutors, and school comparisons for parents and students in Patna.",
  alternates: {
    canonical: "https://swatihometuition.in/blogs",
  },
  openGraph: {
    title: "Academic Insights & Parenting Guides — Swati Home Tuition Bureau",
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
    "name": "Swati HTB Educational Insights & Academic Guides",
    "description": "Guides and articles on home tutoring, exam preparation, and academic excellence in Patna.",
    "url": "https://swatihometuition.in/blogs",
    "hasPart": blogsData.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://swatihometuition.in/blogs/${post.slug}`,
      "datePublished": post.isoDate,
      "description": post.metaDescription,
      "author": {
        "@type": "Organization",
        "name": post.author.name,
      }
    })),
  };

  const featuredBlog = blogsData[0];
  const regularBlogs = blogsData.slice(1);

  return (
    <div className="bg-[#F9F8F5] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#0B192C] overflow-hidden border-b-2 border-[#E5A93C]">
        {/* Subtle architectural dot grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3E62] border border-white/10 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-6">
            <BookOpen className="w-4 h-4 text-[#E5A93C]" />
            Swati HTB Academic Counsel • Patna Educational Insights
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Academic Guides &amp; Insights for <br className="hidden sm:inline" />
            <span className="text-[#E5A93C]">Patna Parents &amp; Students</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 tracking-normal leading-relaxed max-w-3xl mx-auto font-sans font-normal">
            Honest, actionable advice from experienced teachers and counselors. Explore realistic strategies for CBSE, ICSE, Bihar Board exams, competitive entrance prep, and tutor selection in Patna.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-16 sm:py-20">
        
        {/* Featured Editorial Spotlight */}
        {featuredBlog && (
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-4">
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              Featured Parent Guide
            </div>

            <Link href={`/blogs/${featuredBlog.slug}`} className="group block">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E6DF] shadow-sm hover:border-[#E5A93C] hover:shadow-lg transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B192C] bg-[#E5A93C]/20 px-3.5 py-1 rounded-full border border-[#E5A93C]/30">
                    {featuredBlog.category}
                  </span>
                  <span className="text-xs text-[#5A6578] font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                    {featuredBlog.readTime}
                  </span>
                  <span className="text-xs text-[#5A6578] font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {featuredBlog.date}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] group-hover:text-[#1E3E62] transition-colors leading-tight mb-4">
                  {featuredBlog.title}
                </h2>

                <p className="text-[#5A6578] text-base sm:text-lg leading-relaxed font-sans mb-8 max-w-4xl">
                  {featuredBlog.excerpt}
                </p>

                <div className="pt-6 border-t border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#5A6578] font-medium">
                    <User className="w-4 h-4 text-[#1E3E62]" />
                    <span className="font-semibold text-[#0B192C]">{featuredBlog.author.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{featuredBlog.author.role}</span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#0B192C] group-hover:text-[#E5A93C] transition-colors">
                    Read Complete Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Blog Grid (All other articles) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl font-bold text-[#0B192C]">
              All Academic Guides &amp; Articles ({blogsData.length})
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6578]">
              Verified Educational Advice
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {regularBlogs.map((blog) => (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group h-full">
                <div className="bg-white rounded-2xl p-7 sm:p-8 border border-[#E8E6DF] shadow-sm hover:shadow-md hover:border-[#E5A93C]/60 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] bg-[#F3F1EC] px-3 py-1 rounded-full border border-[#E8E6DF]">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#5A6578] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                        {blog.readTime}
                      </div>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C] group-hover:text-[#1E3E62] transition-colors leading-snug mb-3">
                      {blog.title}
                    </h2>

                    <p className="text-[#5A6578] text-sm leading-relaxed font-sans line-clamp-3 mb-6">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#E8E6DF]/70 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#5A6578] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {blog.date}
                    </div>
                    <span className="text-xs font-bold text-[#0B192C] group-hover:text-[#E5A93C] flex items-center gap-1.5 group-hover:translate-x-1 transition-all">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Consultation Banner */}
        <div className="rounded-3xl bg-[#0B192C] p-8 sm:p-10 border-2 border-[#E5A93C] text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C] bg-white/10 px-3 py-1 rounded-md">
                Personalized Academic Guidance
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Not Sure Which Tutor or Study Plan Fits Your Child?
              </h3>
              <p className="text-white/80 text-sm font-sans leading-relaxed">
                Speak directly with our academic coordinators in Mithapur, Patna. We assess your child&apos;s board, syllabus pace, and match the ideal verified educator.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center h-12 px-6 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[3px] border-[#B87C1C]"
              >
                Book Free Trial Class
              </Link>
              <a
                href="https://wa.me/919229738307?text=Hi%2C%20I%20am%20reading%20your%20articles%20and%20need%20academic%20advice%20for%20my%20child"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
