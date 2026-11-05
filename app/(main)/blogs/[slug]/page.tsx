import { blogsData } from "@/lib/data/blogs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, ShieldCheck, HelpCircle, PhoneCall, ArrowRight, Share2 } from "lucide-react";

// 1. GENERATE STATIC PARAMS FOR ALL BLOG POSTS AT BUILD TIME
export async function generateStaticParams() {
  return blogsData.map((post) => ({
    slug: post.slug,
  }));
}

// 2. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogsData.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `https://swatihometuition.in/blogs/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://swatihometuition.in/blogs/${slug}`,
      siteName: "Swati Home Tuition Bureau",
      locale: "en_IN",
      type: "article",
      publishedTime: post.isoDate,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

// 3. BLOG POST COMPONENT
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Schema.org BlogPosting & FAQ & Breadcrumb
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://swatihometuition.in/blogs/${slug}#article`,
        "headline": post.title,
        "description": post.metaDescription,
        "datePublished": post.isoDate,
        "dateModified": post.isoDate,
        "mainEntityOfPage": `https://swatihometuition.in/blogs/${slug}`,
        "author": {
          "@type": "Organization",
          "name": post.author.name,
          "url": "https://swatihometuition.in"
        },
        "publisher": {
          "@type": "EducationalOrganization",
          "name": "Swati Home Tuition Bureau",
          "logo": {
            "@type": "ImageObject",
            "url": "https://swatihometuition.in/images/logo1.png"
          }
        },
        "keywords": post.keywords.join(", ")
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://swatihometuition.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Insights & Blogs",
            "item": "https://swatihometuition.in/blogs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://swatihometuition.in/blogs/${slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": post.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  };

  const otherPosts = blogsData.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-[#FAFAF8] min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
          
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0F4C5C] hover:text-[#0a333e] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Articles
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Main Article Container */}
          <div className="bg-white p-6 sm:p-12 md:p-16 rounded-[2.5rem] border border-neutral-200/80 shadow-[0_15px_45px_rgb(0,0,0,0.04)]">
            
            {/* Header Area */}
            <header className="border-b border-neutral-100 pb-8 mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1F2937] leading-[1.2] mb-6">
                {post.title}
              </h1>

              {/* Author & Meta Pill Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-500 font-medium">
                <div className="flex items-center gap-1.5 text-[#1F2937] font-semibold">
                  <User className="w-4 h-4 text-[#0F4C5C]" />
                  {post.author.name}
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  {post.date}
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  {post.readTime}
                </div>
              </div>
            </header>

            {/* Quick Summary Box */}
            <div className="bg-[#FAF7F2] border-l-4 border-[#0F4C5C] p-6 rounded-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0F4C5C] mb-1">
                Executive Overview
              </p>
              <p className="text-base text-neutral-700 leading-relaxed font-serif italic">
                "{post.excerpt}"
              </p>
            </div>

            {/* Body Sections */}
            <div className="space-y-10 text-neutral-800 leading-relaxed text-base sm:text-lg">
              {post.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F2937] pt-4">
                      {section.heading}
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="text-xl font-bold text-[#0F4C5C]">
                      {section.subheading}
                    </h3>
                  )}

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-neutral-700 text-base leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Highlight Callout */}
                  {section.callout && (
                    <div className="my-6 p-6 rounded-2xl border bg-amber-50/70 border-amber-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                        💡 {section.callout.title}
                      </p>
                      <p className="text-sm sm:text-base text-amber-950 font-medium">
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {/* Bullet Points */}
                  {section.bulletPoints && (
                    <ul className="space-y-2.5 my-4 bg-[#FAF7F2]/60 p-6 rounded-2xl border border-neutral-100">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-700">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* FAQ Section */}
            {post.faq && post.faq.length > 0 && (
              <div className="mt-14 pt-10 border-t border-neutral-100">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C5C] mb-3">
                  <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#1F2937] mb-6">
                  Common Questions from Patna Parents
                </h3>
                <div className="space-y-4">
                  {post.faq.map((item, fIdx) => (
                    <div key={fIdx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-neutral-200/60">
                      <h4 className="font-bold text-base text-[#1F2937] mb-2">
                        {item.question}
                      </h4>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-Article Conversion CTA */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F4C5C] to-[#0A333E] text-white text-center relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017] bg-white/10 px-4 py-1.5 rounded-full inline-block">
                  Verified In-Home Tuition in Patna
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif leading-tight">
                  Find the Perfect Verified Home Tutor for Your Child
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Join 500+ satisfied families across Patna. 100% Aadhaar-verified teachers with our 4-pillar safety guarantee and free replacement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/book-demo">
                    <button className="w-full sm:w-auto bg-[#D4A017] hover:bg-[#e0b02f] text-[#0F4C5C] font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-lg hover:shadow-xl">
                      Book a Free Demo Class
                    </button>
                  </Link>
                  <a
                    href="https://wa.me/919229738307?text=Hi%2C%20I%20read%20your%20article%20and%20want%20to%20inquire%20about%20a%20home%20tutor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-full text-sm flex items-center justify-center gap-2 border border-white/20"
                  >
                    <PhoneCall className="w-4 h-4" /> WhatsApp Counselors
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Related Articles Carousel / Grid */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold font-serif text-[#1F2937] mb-6">
              More Insights for Patna Parents
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherPosts.map((other, idx) => (
                <Link key={idx} href={`/blogs/${other.slug}`} className="group">
                  <div className="p-6 bg-white rounded-3xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-all group-hover:border-[#0F4C5C]/40 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] mb-2 block">
                        {other.category}
                      </span>
                      <h4 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0F4C5C] transition-colors leading-snug mb-2 font-serif">
                        {other.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {other.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C5C] mt-4 pt-4 border-t border-neutral-100">
                      Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
