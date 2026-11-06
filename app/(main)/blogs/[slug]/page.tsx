import { blogsData } from "@/lib/data/blogs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CANONICAL_LINKS } from "@/lib/constants";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  ListOrdered,
  Lightbulb,
  AlertTriangle,
  Award,
  MapPin
} from "lucide-react";

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
            "url": "https://swatihometuition.in/images/logo12.png"
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
            "name": "Insights & Guides",
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
  const headingsList = post.sections
    .map((s, idx) => ({ heading: s.heading, id: `section-${idx}` }))
    .filter((s): s is { heading: string; id: string } => Boolean(s.heading));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-[#F9F8F5] min-h-screen pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
          
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B192C] hover:text-[#E5A93C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Academic Guides
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B192C] bg-[#E5A93C]/20 border border-[#E5A93C]/30 px-3.5 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Main Article Container */}
          <div className="bg-white p-6 sm:p-10 md:p-14 rounded-3xl border border-[#E8E6DF] shadow-sm">
            
            {/* Header Area */}
            <header className="border-b border-[#E8E6DF] pb-8 mb-10">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] leading-tight mb-6">
                {post.title}
              </h1>

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#5A6578] font-sans">
                <div className="flex items-center gap-1.5 text-[#0B192C] font-semibold">
                  <User className="w-4 h-4 text-[#1E3E62]" />
                  {post.author.name}
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E5A93C]" />
                  {post.author.role}
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  {post.date}
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  {post.readTime}
                </div>
              </div>
            </header>

            {/* Key Takeaways Box (Executive Overview) */}
            <div className="bg-[#F3F1EC] border-l-4 border-[#0B192C] p-6 sm:p-7 rounded-2xl mb-10">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C] mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#E5A93C]" />
                Key Takeaway for Patna Parents
              </p>
              <p className="text-base sm:text-lg text-[#1A1D20] leading-relaxed font-sans font-medium">
                {post.excerpt}
              </p>
            </div>

            {/* Table of Contents */}
            {headingsList.length > 0 && (
              <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B192C] mb-4">
                  <ListOrdered className="w-4 h-4 text-[#E5A93C]" />
                  In This Article: Table of Contents
                </div>
                <nav>
                  <ol className="space-y-2.5">
                    {headingsList.map((item, idx) => (
                      <li key={idx}>
                        <a 
                          href={`#${item.id}`} 
                          className="text-sm font-semibold text-[#1E3E62] hover:text-[#E5A93C] transition-colors flex items-start gap-2"
                        >
                          <span className="text-xs font-bold text-[#5A6578] w-5 shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{item.heading}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            )}

            {/* Body Sections */}
            <div className="space-y-10 text-[#1A1D20] font-sans leading-relaxed text-base sm:text-lg">
              {post.sections.map((section, idx) => (
                <section key={idx} id={`section-${idx}`} className="scroll-mt-28 space-y-4">
                  {section.heading && (
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C] pt-6 leading-tight">
                      {section.heading}
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E3E62]">
                      {section.subheading}
                    </h3>
                  )}

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-[#1A1D20]/85 text-base sm:text-lg leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}

                  {/* Highlight Callout */}
                  {section.callout && (
                    <div className="my-6 p-6 rounded-2xl border bg-[#FEF9EE] border-[#E5A93C]/50">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0B192C] mb-2 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-[#E5A93C]" />
                        {section.callout.title}
                      </p>
                      <p className="text-sm sm:text-base text-[#1A1D20] font-medium leading-relaxed font-sans">
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {/* Bullet Points */}
                  {section.bulletPoints && (
                    <ul className="space-y-3 my-5 bg-[#F9F8F5] p-6 sm:p-7 rounded-2xl border border-[#E8E6DF]">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#1A1D20] font-sans">
                          <CheckCircle2 className="w-5 h-5 text-[#005F56] shrink-0 mt-0.5" />
                          <span className="leading-snug">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Author Profile Card */}
            <div className="mt-14 p-7 sm:p-8 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0B192C] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#E5A93C]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-[#0B192C]">
                      {post.author.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#005F56]/10 text-[#005F56] px-2 py-0.5 rounded-full">
                      Verified Counselor
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6578] font-sans">
                    {post.author.role} • Swati Home Tuition Bureau, Mithapur, Patna
                  </p>
                  <p className="text-xs text-[#1A1D20]/75 font-sans pt-1">
                    Dedicated to transparent educator vetting, female tutor safety, and structured academic tracking across Patna schools.
                  </p>
                </div>
              </div>

              <a
                href={CANONICAL_LINKS.whatsappWithText("Hi, I read your article and want to consult an academic counselor")}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 text-xs font-bold text-[#0B192C] hover:text-[#E5A93C] bg-white px-4 py-2.5 rounded-xl border border-[#E8E6DF] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#E5A93C]" />
                Consult Counselor
              </a>
            </div>

            {/* FAQ Section */}
            {post.faq && post.faq.length > 0 && (
              <div className="mt-14 pt-10 border-t border-[#E8E6DF]">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-3">
                  <HelpCircle className="w-4 h-4 text-[#E5A93C]" /> Frequently Asked Questions
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0B192C] mb-6">
                  Common Questions from Patna Parents
                </h3>
                <div className="space-y-4">
                  {post.faq.map((item, fIdx) => (
                    <div key={fIdx} className="p-6 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF]">
                      <h4 className="font-display font-bold text-base text-[#0B192C] mb-2">
                        {item.question}
                      </h4>
                      <p className="text-sm text-[#5A6578] font-sans leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-Article Conversion CTA */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-[#0B192C] text-white text-center relative overflow-hidden border-2 border-[#E5A93C] shadow-lg">
              <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />
              
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C] bg-white/10 px-4 py-1.5 rounded-full inline-block">
                  Verified In-Home Tuition in Patna
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Need a Qualified Home Tutor for Your Child?
                </h3>
                <p className="text-white/80 text-sm font-sans leading-relaxed">
                  Join 500+ satisfied Patna families across Boring Road, Kankarbagh, Bailey Road, and 86+ localities. 100% Aadhaar-verified teachers with our 48-hour replacement guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/book-demo">
                    <button className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all border-b-[3px] border-[#B87C1C] cursor-pointer shadow-md">
                      Book Free In-Home Demo
                    </button>
                  </Link>
                  <a
                    href={CANONICAL_LINKS.whatsappWithText("Hi, I read your article and want to inquire about a home tutor")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 border border-white/20 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-[#E5A93C]" /> WhatsApp Counselors ({CANONICAL_LINKS.displayPhone})
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Related Articles Grid */}
          <div className="mt-16">
            <h3 className="font-display text-2xl font-bold text-[#0B192C] mb-6">
              More Academic Guides for Patna Parents
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherPosts.map((other, idx) => (
                <Link key={idx} href={`/blogs/${other.slug}`} className="group">
                  <div className="p-6 sm:p-7 bg-white rounded-2xl border border-[#E8E6DF] shadow-sm hover:shadow-md transition-all group-hover:border-[#E5A93C]/60 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] bg-[#F3F1EC] px-3 py-1 rounded-full border border-[#E8E6DF] inline-block mb-3">
                        {other.category}
                      </span>
                      <h4 className="font-display text-lg font-bold text-[#0B192C] group-hover:text-[#1E3E62] transition-colors leading-snug mb-2">
                        {other.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5A6578] font-sans line-clamp-2 leading-relaxed">
                        {other.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B192C] group-hover:text-[#E5A93C] mt-5 pt-4 border-t border-[#E8E6DF]/70">
                      Read Complete Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
