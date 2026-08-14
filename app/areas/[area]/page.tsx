import { patnaAreas, slugify, unslugify } from "@/lib/data/areas";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/home/Hero"; // We can reuse hero or make a specific one

// 1. GENERATE 86+ STATIC PAGES AT BUILD TIME
export async function generateStaticParams() {
  return patnaAreas.map((area) => ({
    area: slugify(area),
  }));
}

// 2. DYNAMIC SEO METADATA FOR EACH PAGE
export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const areaName = unslugify(area);
  
  // Verify it's a real area we support
  const isValidArea = patnaAreas.some(a => slugify(a) === area);
  if (!isValidArea) return {};

  return {
    title: `Best Home Tutors in ${areaName}, Patna | Swati HTB`,
    description: `Looking for reliable home tuition in ${areaName}, Patna? Swati HTB provides 100% verified, expert male and female tutors in ${areaName}. Book a free demo!`,
    openGraph: {
      title: `Home Tutors in ${areaName}, Patna`,
      description: `Verified home tutors available in ${areaName}. Girls Safety Shield protocol included.`,
      url: `https://swatihtb.in/areas/${area}`,
      siteName: 'Swati Home Tuition Bureau',
      locale: 'en_IN',
      type: 'website',
    },
  };
}

// 3. THE PAGE CONTENT
export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaName = unslugify(area);
  
  // Verify it's a real area
  const isValidArea = patnaAreas.some(a => slugify(a) === area);
  if (!isValidArea) {
    notFound();
  }

  return (
    <>
      {/* Custom localized Hero for the specific area */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#FAFAF8] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="text-sm font-medium tracking-wide text-[#1E293B] uppercase">
              Tutors Available in {areaName}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-[#1B3F8B] leading-[1.1] tracking-tight mb-6">
            Top Home Tutors in <br/>
            <span className="text-[#F5A623] italic">{areaName}, Patna</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            Get 100% verified, expert educators delivered right to your home in {areaName}. We enforce a strict 4-step safety protocol for your peace of mind.
          </p>
          <div className="flex justify-center">
            <Link href="/book-demo">
              <button className="bg-[#1B3F8B] text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-xl shadow-[#1B3F8B]/20 hover:bg-[#15306B]">
                Book a Free Demo in {areaName}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust and Safety Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1E293B] mb-8">Why parents in {areaName} trust Swati HTB</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-lg mb-2 text-[#1B3F8B]">Female Tutors</h3>
              <p className="text-[#64748B] text-sm">We provide verified female tutors for female students across {areaName}.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-lg mb-2 text-[#1B3F8B]">Free Replacement</h3>
              <p className="text-[#64748B] text-sm">Not happy with the demo? Get a replacement tutor in {areaName} at zero cost.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-lg mb-2 text-[#1B3F8B]">Monthly Tracking</h3>
              <p className="text-[#64748B] text-sm">We track your child's academic progress every month to ensure results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-200">
            <iframe 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '1.25rem' }}
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
