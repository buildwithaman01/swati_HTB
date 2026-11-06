import { patnaAreas, slugify, unslugify, getAreaDetails } from "@/lib/data/areas";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  Award, 
  MapPin, 
  HelpCircle, 
  PhoneCall, 
  School, 
  Compass, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Search,
  Star,
  ExternalLink
} from "lucide-react";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";

// 1. GENERATE STATIC PAGES AT BUILD TIME
export async function generateStaticParams() {
  return patnaAreas.map((area) => ({
    area: slugify(area),
  }));
}

// 2. DYNAMIC SEO & GEO METADATA
export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const areaName = unslugify(area);
  
  const isValidArea = patnaAreas.some(a => slugify(a) === area);
  if (!isValidArea) return {};

  const details = getAreaDetails(areaName);
  const title = `Best Home Tutors in ${areaName}, Patna | 100% Verified Teachers | Swati HTB`;
  const description = `Find top-rated home tutors in ${areaName}, Patna (${details.zone}). Verified male & female teachers near ${details.landmarks.slice(0, 2).join(", ")}. Classes 1 to 12, CBSE/ICSE, NEET & JEE. Book a free demo class today!`;

  return {
    title,
    description,
    keywords: details.searchQueries,
    alternates: {
      canonical: `https://swatihometuition.in/areas/${area}`,
    },
    openGraph: {
      title: `Home Tutors in ${areaName}, Patna — Swati Home Tuition Bureau`,
      description: `Verified home tutors available in ${areaName}. 100% background-checked, Swati Safety Shield guaranteed. Serving students near ${details.landmarks.slice(0, 2).join(", ")}.`,
      url: `https://swatihometuition.in/areas/${area}`,
      siteName: 'Swati Home Tuition Bureau',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// 3. THE PAGE COMPONENT
export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaName = unslugify(area);
  
  const isValidArea = patnaAreas.some(a => slugify(a) === area);
  if (!isValidArea) {
    notFound();
  }

  const details = getAreaDetails(areaName);

  // Schema.org Structured Data for LocalBusiness & EducationalOrganization + FAQ + Breadcrumb
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://swatihometuition.in/areas/${area}#localbusiness`,
        "name": `Swati Home Tuition Bureau - ${areaName}`,
        "description": `Premier home tuition and verified tutoring service in ${areaName}, Patna (${details.zone}). Female-first safety protocols and expert educators for Class 1 to 12, IIT-JEE, and NEET.`,
        "url": `https://swatihometuition.in/areas/${area}`,
        "telephone": CANONICAL_LINKS.phone,
        "priceRange": details.feeRange,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": areaName,
          "addressLocality": "Patna",
          "addressRegion": "Bihar",
          "postalCode": "800001",
          "addressCountry": "IN"
        },
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": `${areaName}, Patna`
          },
          ...details.landmarks.map(lm => ({
            "@type": "Place",
            "name": `${lm}, ${areaName}, Patna`
          }))
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
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
            "name": "Areas in Patna",
            "item": "https://swatihometuition.in/areas"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${areaName}`,
            "item": `https://swatihometuition.in/areas/${area}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How can I find a verified home tutor in ${areaName}, Patna?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `You can book a tutor with Swati Home Tuition Bureau by filling our 1-minute Book Demo form. We match you with a verified, experienced teacher living in or near ${areaName} (serving ${details.landmarks.slice(0, 3).join(", ")}) within 24 hours.`
            }
          },
          {
            "@type": "Question",
            "name": `Are female home tutors available in ${areaName} for girls?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes. Swati HTB specializes in female-first home education. We have verified female teachers across ${areaName} backed by the Swati Safety Shield protocol, Aadhaar verification, and digital ID checks.`
            }
          },
          {
            "@type": "Question",
            "name": `What is the monthly fee for home tuition in ${areaName}, Patna?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Home tuition in ${areaName} ranges typically between ${details.feeRange}, depending on class level (Class 1-8, Class 9-10, or Class 11-12/NEET/JEE) and number of weekly sessions.`
            }
          },
          {
            "@type": "Question",
            "name": `Which schools in ${areaName} do your tutors cater to?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our educators in ${areaName} frequently mentor students from ${details.topSchools.join(", ")}, specializing in both CBSE and ICSE marking guidelines.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      {/* Inject Structured Data for Google AI Overviews & Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 bg-[#FAF7F2] overflow-hidden border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Locality & Zone Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-neutral-200/80 text-xs font-bold text-[#0F4C5C] uppercase tracking-wide">
              <Compass className="w-3.5 h-3.5 text-[#E36414]" /> {details.zone}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              {details.tutorCount}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-display text-[#0B192C] leading-[1.15] mb-6">
            Best Home Tutors in <br />
            <span className="text-[#E5A93C]">{areaName}, Patna</span>
          </h1>

          <p className="text-lg md:text-xl text-[#5A6578] max-w-3xl mx-auto mb-8 font-sans leading-relaxed">
            Get 100% Aadhaar-verified, experienced educators delivered directly to your home in <strong>{areaName}</strong>. Enforced with the <strong>Swati Safety Shield</strong> and backed by our free replacement guarantee.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book-demo">
              <button className="bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] px-8 py-4 rounded-xl font-extrabold text-base transition-all shadow-md border-b-[3px] border-[#B87C1C]">
                Book a Free Demo in {areaName}
              </button>
            </Link>
            <Link href="/find-tutor">
              <button className="bg-white text-[#0B192C] border border-[#E8E6DF] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#F3F1EC] transition-all shadow-2xs">
                Search Tutors by Subject
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Locality Highlights & Neighborhood Landmarks */}
      <section className="py-12 bg-white border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Key Landmarks */}
            <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-neutral-200/70">
              <div className="flex items-center gap-2 mb-3 text-[#0F4C5C] font-bold text-sm uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#E36414]" /> Key Landmarks Covered
              </div>
              <div className="flex flex-wrap gap-2">
                {details.landmarks.map((landmark, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 border border-neutral-200 shadow-2xs">
                    {landmark}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Schools */}
            <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-neutral-200/70">
              <div className="flex items-center gap-2 mb-3 text-[#0F4C5C] font-bold text-sm uppercase tracking-wider">
                <School className="w-4 h-4 text-[#0F4C5C]" /> Schools in {areaName} Zone
              </div>
              <div className="flex flex-wrap gap-2">
                {details.topSchools.map((school, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 border border-neutral-200 shadow-2xs">
                    {school}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Subjects */}
            <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-neutral-200/70">
              <div className="flex items-center gap-2 mb-3 text-[#0F4C5C] font-bold text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#0F4C5C]" /> High-Demand Subjects
              </div>
              <div className="flex flex-wrap gap-2">
                {details.popularSubjects.map((sub, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 border border-neutral-200 shadow-2xs">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Local Pricing Benchmark for this Locality */}
      <section className="py-16 bg-[#FAFAF8] border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E36414] bg-[#E36414]/10 px-3 py-1 rounded-full inline-block mb-3">
              Transparent Local Pricing
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#1F2937]">
              Home Tuition Fee Structure in {areaName}
            </h2>
            <p className="text-neutral-500 text-sm mt-2">
              Fair, standardized monthly rates with zero hidden bureau brokerage charged to parents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Primary School</p>
              <h3 className="text-xl font-bold font-serif text-[#1F2937] mb-2">Class 1 to 5</h3>
              <p className="text-2xl font-bold text-[#0F4C5C] mb-2">₹2,500 – ₹4,000</p>
              <p className="text-xs text-neutral-500">Per month • All Subjects</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Middle School</p>
              <h3 className="text-xl font-bold font-serif text-[#1F2937] mb-2">Class 6 to 8</h3>
              <p className="text-2xl font-bold text-[#0F4C5C] mb-2">₹3,500 – ₹5,500</p>
              <p className="text-xs text-neutral-500">Per month • Maths & Science</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm text-center border-t-4 border-t-[#0F4C5C]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0F4C5C] mb-1">High School Boards</p>
              <h3 className="text-xl font-bold font-serif text-[#1F2937] mb-2">Class 9 & 10</h3>
              <p className="text-2xl font-bold text-[#0F4C5C] mb-2">₹4,500 – ₹7,000</p>
              <p className="text-xs text-neutral-500">Per month • CBSE / ICSE Boards</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Senior & Entrance</p>
              <h3 className="text-xl font-bold font-serif text-[#1F2937] mb-2">Class 11-12 / NEET / JEE</h3>
              <p className="text-2xl font-bold text-[#0F4C5C] mb-2">₹6,500 – ₹12,000</p>
              <p className="text-xs text-neutral-500">Per month • Subject Specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Pillars */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-serif text-[#1F2937]">Why Families in {areaName} Choose Swati HTB</h2>
            <p className="text-neutral-500 text-sm mt-2">Patna's only home tuition bureau with 4-pillar verification and female student safety guarantees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F2937] mb-1">Aadhaar Verified</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Every tutor in {areaName} is government ID verified with address background checks.</p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60">
              <div className="w-10 h-10 rounded-xl bg-[#E36414]/10 text-[#E36414] flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F2937] mb-1">Female Tutors</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Female-first educator matching for daughters in {areaName} for 100% comfort and safety.</p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F2937] mb-1">Free Replacement</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Not happy with the demo session? We arrange an immediate replacement tutor with zero hassle.</p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1F2937] mb-1">Monthly Tracking</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Regular syllabus completion reviews and test performance tracking sent to parents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Query-Based Local Search Signals (SEO & NLP Dominance) */}
      <section className="py-12 bg-[#FAF7F2] border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-[#0F4C5C] font-serif font-bold text-lg">
              <Search className="w-5 h-5 text-[#E36414]" /> Frequently Searched in {areaName}, Patna
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Parents from {areaName} regularly connect with Swati HTB for specialized learning requirements:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {details.searchQueries.map((query, idx) => (
                <div key={idx} className="bg-[#FAF7F2] text-neutral-800 text-xs font-medium px-4 py-2 rounded-xl border border-neutral-200">
                  🔍 "{query}"
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQ Section for AEO and High Conversions */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C5C] mb-2">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1F2937]">
              Home Tuition in {areaName} — Common Queries
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
              <h3 className="font-bold text-base text-[#1F2937] mb-2">How do I get a home tutor in {areaName}?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Simply click <strong>Book a Free Demo</strong>, provide your child's class, subjects, and location in {areaName}. Our academic counselor will call you within 2-4 hours to match the best tutor near {details.landmarks[0] || areaName}.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
              <h3 className="font-bold text-base text-[#1F2937] mb-2">Can I request a female tutor in {areaName}?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Yes! We maintain an extensive network of qualified, background-verified female teachers who specialize in classes 1 to 12 across {areaName} and {details.zone}.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
              <h3 className="font-bold text-base text-[#1F2937] mb-2">How can I verify the teacher when they arrive?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every teacher registered with Swati HTB carries a <strong>Digital Virtual ID Card with a live QR code</strong>. You can scan the QR code with your phone camera to view their real-time bureau approval page at <code className="text-[#0F4C5C]">swatihometuition.in/verify/[id]</code>.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white px-8 py-5 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-left">
                <p className="text-xs text-[#5A6578] font-bold uppercase">Need immediate help in {areaName}?</p>
                <p className="text-sm font-bold text-[#0B192C]">Call / WhatsApp our Patna Bureau Desk</p>
              </div>
              <a
                href={CANONICAL_LINKS.whatsappWithText(`Hi, I need a home tutor in ${areaName}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" /> WhatsApp {CANONICAL_LINKS.displayPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Business Profile 4.9★ Reviews & Verified Channels Banner */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F9F8F5] rounded-3xl border border-[#E8E6DF] p-6 sm:p-10 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6DF] text-xs font-bold text-[#0B192C]">
                  <GoogleGIcon className="w-4 h-4" />
                  <span>Verified Google Business Profile • Patna</span>
                  <span className="flex text-[#E5A93C] ml-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-[#E5A93C]" />
                    ))}
                  </span>
                  <span className="font-extrabold text-[#0B192C]">{BUREAU_INFO.rating}★</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0B192C]">
                  Trusted by Over 500+ Patna Families
                </h3>
                <p className="text-sm text-[#5A6578] font-sans leading-relaxed">
                  Parents across {areaName} and greater Patna rely on Swati HTB for vetted, punctual home educators. Read Google reviews or leave feedback for your teacher.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <a
                  href={CANONICAL_LINKS.googleReviews}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm border-b-[2px] border-[#B87C1C] text-center"
                >
                  <Star className="w-4 h-4 fill-[#0B192C]" />
                  <span>Rate Swati HTB 5 Stars on Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex gap-2">
                  <a
                    href={CANONICAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-all"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <span>{BUREAU_INFO.instagramHandle}</span>
                  </a>
                  <a
                    href={CANONICAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-all"
                  >
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4 text-[#1F2937] font-serif font-bold text-lg">
            <MapPin className="w-5 h-5 text-[#0F4C5C]" /> Serviceable Locality: {areaName}, Patna ({details.zone})
          </div>
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-neutral-200">
            <iframe 
              width="100%" 
              height="350" 
              style={{ border: 0, borderRadius: '1rem' }}
              loading="lazy" 
              allowFullScreen 
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(areaName + ', Patna, Bihar')}&output=embed`}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
