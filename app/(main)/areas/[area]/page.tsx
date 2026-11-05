import { patnaAreas, slugify, unslugify } from "@/lib/data/areas";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, UserCheck, RefreshCw, Award, MapPin, HelpCircle, PhoneCall } from "lucide-react";

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

  const title = `Best Home Tutors in ${areaName}, Patna | Verified Male & Female Teachers | Swati HTB`;
  const description = `Looking for top home tuition in ${areaName}, Patna? Swati Home Tuition Bureau provides 100% verified, background-checked male and female tutors for CBSE, ICSE & Bihar Board (Class 1 to 12, NEET/JEE). Book a free demo class today!`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://swatihometuition.in/areas/${area}`,
    },
    openGraph: {
      title: `Home Tutors in ${areaName}, Patna — Swati Home Tuition Bureau`,
      description: `Verified home tutors available in ${areaName}. 100% background-checked, Swati Safety Shield guaranteed.`,
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

  // Schema.org Structured Data for LocalBusiness & EducationalOrganization + FAQ + Breadcrumb
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://swatihometuition.in/areas/${area}#localbusiness`,
        "name": `Swati Home Tuition Bureau - ${areaName}`,
        "description": `Premier home tuition and verified tutoring service in ${areaName}, Patna. Female-first safety protocols and expert educators for Class 1 to 12, IIT-JEE, and NEET.`,
        "url": `https://swatihometuition.in/areas/${area}`,
        "telephone": "+919229738307",
        "priceRange": "₹2,500 - ₹12,000/month",
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
          }
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
              "text": `You can book a tutor with Swati Home Tuition Bureau by filling our 1-minute Book Demo form. We match you with a verified, experienced teacher living in or near ${areaName} within 24 hours.`
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
              "text": `Fees typically range from ₹2,500 to ₹5,000 per month for Class 1-8, ₹4,000 to ₹7,000 for Class 9-10, and ₹6,000 to ₹12,000 for Class 11-12/NEET/JEE, depending on subjects and frequency.`
            }
          },
          {
            "@type": "Question",
            "name": `What if we don't like the tutor after the demo class in ${areaName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The first demo session is arranged for you to evaluate the teacher. If you are not completely satisfied, Swati HTB arranges a replacement tutor at zero additional bureau fees.`
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-200/60 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold tracking-wide text-[#0F4C5C] uppercase">
              Verified Tutors Available in {areaName}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#1F2937] leading-[1.15] mb-6">
            Best Home Tutors in <br />
            <span className="text-[#0F4C5C] italic underline decoration-[#E36414]/30">{areaName}, Patna</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Get 100% Aadhaar-verified, experienced educators delivered to your doorstep in <strong>{areaName}</strong>. Enforced with the <strong>Swati Safety Shield</strong> for peace of mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book-demo">
              <button className="bg-[#0F4C5C] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#0c3c49] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Book a Free Demo in {areaName}
              </button>
            </Link>
            <Link href="/find-tutor">
              <button className="bg-white text-[#1F2937] border border-neutral-300 px-8 py-4 rounded-full font-bold text-base hover:bg-neutral-50 transition-all">
                Search Tutors by Subject
              </button>
            </Link>
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

      {/* Local FAQ Section for AEO and High Conversions */}
      <section className="py-16 bg-[#FAF7F2]">
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
                Simply click <strong>Book a Free Demo</strong>, provide your child's class, subjects, and location in {areaName}. Our academic counselor will call you within 2-4 hours to match the best tutor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
              <h3 className="font-bold text-base text-[#1F2937] mb-2">Can I request a female tutor in {areaName}?</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Yes! We maintain an extensive network of qualified, background-verified female teachers who specialize in classes 1 to 12 in {areaName}.
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
                <p className="text-xs text-neutral-400 font-bold uppercase">Need immediate help in {areaName}?</p>
                <p className="text-sm font-bold text-[#1F2937]">Call / WhatsApp our Patna Bureau Desk</p>
              </div>
              <a
                href="https://wa.me/919229738307?text=Hi%2C%20I%20need%20a%20home%20tutor%20in%20"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F4C5C] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-[#0c3c49]"
              >
                <PhoneCall className="w-3.5 h-3.5" /> +91 92297 38307
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4 text-[#1F2937] font-serif font-bold text-lg">
            <MapPin className="w-5 h-5 text-[#0F4C5C]" /> Serviceable Locality: {areaName}, Patna
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
