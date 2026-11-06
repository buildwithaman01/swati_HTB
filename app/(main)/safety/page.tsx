import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserCheck, 
  RefreshCcw, 
  PhoneCall, 
  FileCheck2, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  HelpCircle,
  Eye,
  MapPin,
  ArrowRight,
  Star,
  ExternalLink
} from "lucide-react";
import { Metadata } from "next";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";

export const metadata: Metadata = {
  title: "Parent Safety & Teacher Verification in Patna | Swati HTB",
  description: "Learn how Swati Home Tuition Bureau protects Patna families: in-person Aadhaar verification, female home tutors for girls, WhatsApp teacher preview, free demo, and 48-hour replacement guarantee.",
  alternates: {
    canonical: "https://swatihometuition.in/safety",
  },
};

export default function SafetyPage() {
  const safetyPillars = [
    {
      step: "01",
      title: "In-Person Aadhaar & Address Verification",
      desc: "We never onboard tutors through unverified online forms. Every teacher physically visits our Mithapur office, where we verify their original government Aadhaar, permanent address proof, and university degree certificates.",
      badge: "100% In-Person Vetted",
      icon: <FileCheck2 className="w-6 h-6 text-[#E5A93C]" />
    },
    {
      step: "02",
      title: "Dedicated Female Tutors for Girl Students",
      desc: "For parents who prioritize female educators for their daughters or primary school children, we have a curated pool of 120+ verified female home tutors across Patna, ensuring total comfort and peace of mind.",
      badge: "Female-First Pool",
      icon: <UserCheck className="w-6 h-6 text-[#E5A93C]" />
    },
    {
      step: "03",
      title: "Complete Teacher Profile on WhatsApp in Advance",
      desc: "Before a teacher ever rings your doorbell, we send you their full dossier on WhatsApp: high-resolution photo, college degrees, subjects taught, years of experience, and their verifiable digital bureau ID card.",
      badge: "Zero Unknown Visitors",
      icon: <MessageSquare className="w-6 h-6 text-[#E5A93C]" />
    },
    {
      step: "04",
      title: "Free In-Home Trial Class to Observe Demeanor",
      desc: "Observe how the teacher speaks, explains difficult concepts, and engages with your child in your own living room during a 45-minute free demo. You decide whether to proceed only after you are 100% satisfied.",
      badge: "Observe First, Decide Later",
      icon: <Eye className="w-6 h-6 text-[#E5A93C]" />
    },
    {
      step: "05",
      title: "48-Hour Replacement Guarantee",
      desc: "If at any point the teacher's teaching pace, communication style, or schedule does not suit your child's learning needs, simply inform us. We provide a qualified replacement tutor within 48 hours—no awkward talks, no extra fees.",
      badge: "No Questions Asked",
      icon: <RefreshCcw className="w-6 h-6 text-[#E5A93C]" />
    },
    {
      step: "06",
      title: "Direct Line to Our Mithapur Office",
      desc: "You are never left talking to an automated IVR or a disconnected call center. Our Patna office founders and academic coordinators are directly reachable on WhatsApp and phone for immediate assistance.",
      badge: "Local Patna Bureau",
      icon: <PhoneCall className="w-6 h-6 text-[#E5A93C]" />
    }
  ];

  const steps = [
    {
      num: "1",
      title: "You Share Your Child's Academic Needs",
      desc: "Tell us your locality in Patna, student's class (1 to 12), school board (CBSE, ICSE, or Bihar Board), and preferred days and gender for the tutor."
    },
    {
      num: "2",
      title: "We Send Verified Profiles on WhatsApp",
      desc: "We match educators living within 3–5 km and send you their Aadhaar-verified photo, degree qualifications, and teaching background to review."
    },
    {
      num: "3",
      title: "You Observe the Free Trial Class",
      desc: "The teacher visits your home for an observed 45-minute demo session. Assess their patience, concept clarity, and communication directly."
    },
    {
      num: "4",
      title: "Confirm Only When You Feel Confident",
      desc: "If satisfied, regular classes begin with syllabus tracking on our Parent Portal. If not satisfied, we send another qualified teacher at zero cost."
    }
  ];

  const faqs = [
    {
      q: "How do I verify the teacher's identity when they arrive at my house?",
      a: "Every Swati HTB educator carries a physical and digital bureau ID card containing their verified name, photo, tutor ID number, and a scannable QR code. You can cross-reference this instantly with the profile we send to your WhatsApp before the demo class."
    },
    {
      q: "Can I request specifically a female home tutor for my daughter?",
      a: "Yes, absolutely. Over 40% of the families we serve across Patna request female tutors. We have over 120+ verified female educators available across Boring Road, Kankarbagh, Bailey Road, Rajendra Nagar, and surrounding localities."
    },
    {
      q: "What if the tutor misses classes, arrives late, or lacks discipline?",
      a: "Tutors are required to log daily attendance and topic coverage on their Teacher Portal. If any tutor demonstrates poor punctuality or fails to respect your family's schedule, our Mithapur coordinators step in immediately to replace the tutor within 48 hours."
    },
    {
      q: "Are there any registration fees or hidden charges before the demo class?",
      a: "None. The first in-home demo class is 100% free with zero obligation. You only pay standard monthly tuition fees after you have approved the teacher and regular classes commence."
    }
  ];

  return (
    <div className="bg-[#F9F8F5] min-h-screen">
      
      {/* Header Section */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#0B192C] overflow-hidden border-b-2 border-[#E5A93C]">
        {/* Subtle architectural dot grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3E62] border border-white/10 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-6">
            <ShieldCheck className="w-4 h-4 text-[#E5A93C]" />
            Parent Peace of Mind • Patna Family Standards
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Inviting a Teacher Home Requires <br className="hidden sm:inline" />
            <span className="text-[#E5A93C]">Complete, Uncompromising Trust</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 tracking-normal leading-relaxed max-w-3xl mx-auto font-sans">
            Home tuition means opening your front door to an educator. We understand the genuine anxieties Patna parents carry. Here are the 6 clear safeguards we enforce for every single teacher before they ever step into your home.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-16 sm:py-20">
        
        {/* Intro Reassurance Banner */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 mb-16 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C]">
              Zero Strangers. Zero Unverified Freelancers.
            </h2>
            <p className="text-sm sm:text-base text-[#5A6578] font-sans">
              Unlike online classifieds where anyone can post an ad, every Swati HTB educator is personally known to our Mithapur team.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <span className="px-4 py-2 bg-[#F3F1EC] rounded-xl text-xs font-bold text-[#0B192C] border border-[#E8E6DF]">
              100% Aadhaar Verified
            </span>
            <span className="px-4 py-2 bg-[#F3F1EC] rounded-xl text-xs font-bold text-[#0B192C] border border-[#E8E6DF]">
              Mithapur Bureau Office
            </span>
          </div>
        </div>

        {/* 6 Core Safeguards Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-2">
              <span className="w-6 h-0.5 bg-[#E5A93C]" />
              The 6 Grounded Safeguards
              <span className="w-6 h-0.5 bg-[#E5A93C]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight">
              How We Protect Your Child and Home
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {safetyPillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E8E6DF] shadow-sm hover:border-[#E5A93C]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0B192C] flex items-center justify-center">
                      {pillar.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] bg-[#F3F1EC] px-3 py-1 rounded-full border border-[#E8E6DF]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0B192C] mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#5A6578] leading-relaxed font-sans mb-4">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E6DF]/60 flex items-center gap-2 text-xs font-bold text-[#005F56]">
                  <CheckCircle2 className="w-4 h-4 text-[#005F56]" />
                  Active Standard in Patna
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Reassurance Journey */}
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-8 sm:p-12 mb-20 shadow-sm">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5A93C] bg-[#0B192C] px-3 py-1 rounded-md">
              Step-by-Step Flow
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B192C] mt-4 mb-2">
              What Happens Before a Tutor Knocks on Your Door
            </h2>
            <p className="text-sm sm:text-base text-[#5A6578] font-sans">
              From your first phone call to the trial class, you stay in total control of the process.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF]">
                <div className="w-10 h-10 rounded-xl bg-[#1E3E62] text-white font-display font-extrabold text-base flex items-center justify-center mb-4">
                  {st.num}
                </div>
                <h4 className="font-display font-bold text-base text-[#0B192C] mb-2 leading-snug">
                  {st.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5A6578] font-sans leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Real Parent Questions / FAQ */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-2">
              <HelpCircle className="w-4 h-4 text-[#E5A93C]" />
              Common Questions
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C]">
              What Patna Parents Ask About Safety
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, fIdx) => (
              <div 
                key={fIdx} 
                className="bg-white p-7 rounded-2xl border border-[#E8E6DF] shadow-2xs space-y-3"
              >
                <h3 className="font-display font-bold text-base sm:text-lg text-[#0B192C] leading-snug">
                  {faq.q}
                </h3>
                <p className="text-sm text-[#5A6578] font-sans leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bureau Office Direct Line Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B192C] text-white border-2 border-[#E5A93C] relative overflow-hidden shadow-lg mb-16">
          <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E5A93C]">
                <MapPin className="w-4 h-4 text-[#E5A93C]" />
                Mithapur, Patna Bureau Office
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Any Questions or Special Requirements? Speak With Us Directly.
              </h2>
              <p className="text-white/80 text-sm sm:text-base font-sans leading-relaxed">
                Whether you need a female tutor for Class 8 in Kankarbagh or an IIT alumni mentor for Class 11 in Boring Road, our academic coordinators are ready to assist you.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center h-12 px-6 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[3px] border-[#B87C1C] text-center shadow-md"
              >
                Book Free Trial Class
              </Link>
              <a
                href={CANONICAL_LINKS.whatsappWithText("Hi, I have questions regarding teacher verification and safety at Swati HTB")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm rounded-xl transition-all text-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" /> WhatsApp {CANONICAL_LINKS.displayPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Google Business Profile 4.9★ Reviews & Verified Channels Banner */}
        <div className="bg-white rounded-3xl border border-[#E8E6DF] p-6 sm:p-10 shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F1EC] border border-[#E8E6DF] text-xs font-bold text-[#0B192C]">
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
                Read Honest Reviews from Real Patna Families
              </h3>
              <p className="text-sm text-[#5A6578] font-sans leading-relaxed">
                Over 500 parents across Boring Road, Kankarbagh, and Bailey Road trust Swati HTB for vetted home tuition. Check our live rating or leave your own review on Google.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
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
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F9F8F5] hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-all"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-600" />
                  <span>{BUREAU_INFO.instagramHandle}</span>
                </a>
                <a
                  href={CANONICAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F9F8F5] hover:bg-[#F3F1EC] text-[#0B192C] font-bold text-xs py-2.5 px-3 rounded-xl border border-[#E8E6DF] transition-all"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
