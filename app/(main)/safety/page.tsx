import Image from "next/image";
import { ShieldCheck, UserCheck, Activity, RefreshCcw, ClipboardCheck, PhoneCall, GraduationCap, Star } from "lucide-react";
import { motion } from "framer-motion";

export const metadata = {
  title: "Safety Shield Protocol | Swati Home Tuition Bureau",
  description: "Learn about our strict 8-pillar safety and academic quality protocols for home tuition in Patna.",
};

const protocols = [
  {
    title: "1. The Safety Shield (ID Verification)",
    desc: "Every tutor undergoes a strict background check. We collect Aadhaar, Address Proof, and educational documents before they ever step into your home.",
    icon: <ShieldCheck className="w-8 h-8 text-[#0F4C5C]" />,
    image: "/images/protocol_safety_1786310759112.png"
  },
  {
    title: "2. Female-First Matching",
    desc: "For female students, we prioritize matching with verified female tutors to ensure maximum comfort and safety.",
    icon: <UserCheck className="w-8 h-8 text-[#0F4C5C]" />,
    image: "/images/protocol_passport_1786310771300.png"
  },
  {
    title: "3. Teacher Passport",
    desc: "Before the first demo class, you will receive a digital 'Teacher Passport' via WhatsApp containing their verified photo, qualifications, and ID status.",
    icon: <ClipboardCheck className="w-8 h-8 text-[#D4A017]" />,
    image: "/images/protocol_progress_1786310784437.png"
  },
  {
    title: "4. Pre-Screening Tests",
    desc: "We don't accept everyone. Tutors must pass a subject-matter interview with our academic heads before they are assigned to JEE/NEET or Board students.",
    icon: <Activity className="w-8 h-8 text-[#0F4C5C]" />,
    image: "/images/protocol_mentor_1786310797057.png"
  },
  {
    title: "5. Replacement Promise",
    desc: "If you are not 100% satisfied with the tutor after the first week, we guarantee a qualified replacement within 48 hours, no questions asked.",
    icon: <RefreshCcw className="w-8 h-8 text-[#D4A017]" />,
    image: "/images/protocol_pretest_1786310818858.png"
  },
  {
    title: "6. IIT/Medical Mentor Match",
    desc: "Advanced students aiming for competitive exams are exclusively paired with alumni or current students from top-tier institutions.",
    icon: <GraduationCap className="w-8 h-8 text-[#0F4C5C]" />,
    image: "/images/protocol_replacement_1786310828734.png"
  },
  {
    title: "7. Monthly Progress Pulse",
    desc: "We take regular feedback from parents to track syllabus completion and student improvement.",
    icon: <Star className="w-8 h-8 text-[#D4A017]" />,
    image: "/images/protocol_support_1786310840597.png"
  },
  {
    title: "8. 24/7 Helpline",
    desc: "Direct access to our founders and management team for any escalations or emergency requests.",
    icon: <PhoneCall className="w-8 h-8 text-[#0F4C5C]" />,
    image: "/images/protocol_pricing_1786310855531.png"
  }
];

export default function SafetyPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Premium Header */}
      <section className="relative pt-40 pb-32 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
            <ShieldCheck className="w-8 h-8 text-[#D4A017]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
            The Safety <span className="text-[#D4A017] italic">Shield</span> Protocol
          </h1>
          <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-3xl mx-auto font-medium">
            Home tuition requires bringing a stranger into your home. We eliminate the risk. Here are the 8 non-negotiable rules we follow for every single admission.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl -mt-16 relative z-20 pb-24">
        
        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-8 border-white mb-24 bg-white">
          <div className="absolute inset-0 bg-[#0F4C5C]/10 z-10 mix-blend-overlay"></div>
          <Image 
            src="/images/safety_shield_1786135353842.png" 
            alt="Safety and Trust Concept" 
            fill
            className="object-cover"
          />
        </div>

        {/* 8 Protocols List */}
        <div className="grid md:grid-cols-2 gap-8">
          {protocols.map((protocol, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-neutral-200/60 shadow-sm hover:shadow-[0_20px_60px_rgb(0,0,0,0.05)] transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF7F2] rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {protocol.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2937] font-serif group-hover:text-[#0F4C5C] transition-colors">{protocol.title}</h3>
                </div>
                <p className="text-[#1F2937]/70 leading-relaxed font-medium text-lg">
                  {protocol.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
