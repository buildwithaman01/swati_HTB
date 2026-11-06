"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  MapPin, 
  HeartHandshake, 
  Clock, 
  ArrowRight, 
  FileText, 
  Laptop, 
  PhoneCall,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Patna Students Mentored", subtext: "Across CBSE, ICSE & Bihar Board" },
    { value: "100%", label: "Aadhaar Verified", subtext: "In-person checks at our Mithapur office" },
    { value: "120+", label: "Dedicated Female Tutors", subtext: "Ensuring comfort for female students" },
    { value: "86+", label: "Neighborhoods Covered", subtext: "From Boring Road to Kankarbagh" },
  ];

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E5A93C]" />,
      title: "In-Person Verification, Not Just Online Uploads",
      desc: "Every tutor visits our Mithapur office in person. We inspect original Aadhaar cards, university degrees (PU, NIT, IIT, Magadh University), and local residential addresses before recommending anyone to your home."
    },
    {
      icon: <Users className="w-6 h-6 text-[#E5A93C]" />,
      title: "Dedicated Female Home Tutors",
      desc: "We understand the safety and cultural comfort Patna families prioritize. We maintain a large, verified pool of qualified female tutors for girl students and primary school children."
    },
    {
      icon: <Clock className="w-6 h-6 text-[#E5A93C]" />,
      title: "Punctuality & Respect for Family Values",
      desc: "A good tutor isn't just someone who knows mathematics; they must show up on time, respect family boundaries, and maintain professional decorum in your home at all times."
    },
    {
      icon: <Award className="w-6 h-6 text-[#E5A93C]" />,
      title: "Subject-Matter Evaluation Before Demo",
      desc: "We don't act as a blind broker. Every teacher solves diagnostic tests and explains sample concepts to our academic coordinators before facing your child in a demo class."
    }
  ];

  const localities = [
    "Boring Road", "Kankarbagh", "Rajendra Nagar", "Bailey Road", 
    "Patliputra Colony", "Ashiana Nagar", "Saguna More", "Danapur", 
    "Mithapur", "Anisabad", "Shastrinagar", "Gardanibagh"
  ];

  return (
    <div className="bg-[#F9F8F5] min-h-screen">
      
      {/* Hero Header */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-[#0B192C] overflow-hidden border-b-2 border-[#E5A93C]">
        {/* Subtle architectural dot grid */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Bureau Identity Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3E62] border border-white/10 text-xs font-bold uppercase tracking-widest text-[#E5A93C] mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
              Rooted in Mithapur, Patna
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Honest, Verified Home Tuition <br className="hidden sm:inline" />
              Built on <span className="text-[#E5A93C]">Patna Family Values</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 tracking-normal leading-relaxed max-w-3xl mx-auto font-sans font-normal">
              For years, Patna parents had to rely on random newspaper classifieds and roadside flyers, only to end up with teachers who arrived late, lacked credentials, or vanished right before board exams. We founded Swati Home Tuition Bureau to bring personal accountability, total safety, and genuine academic progress to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grounded Stats Bar */}
      <section className="relative z-20 -mt-10 sm:-mt-12 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E6DF] shadow-sm hover:border-[#E5A93C]/50 transition-all"
            >
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B192C] mb-1">
                {stat.value}
              </div>
              <div className="font-sans font-bold text-sm text-[#0B192C] mb-1">
                {stat.label}
              </div>
              <p className="text-xs text-[#5A6578] font-sans leading-snug">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Authentic Story */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62]">
                <span className="w-6 h-0.5 bg-[#E5A93C]" />
                Our Story &amp; Purpose
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight leading-tight">
                Why We Started in Mithapur: Ending the Headache of Unverified Tutors
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#1A1D20]/80 font-sans leading-relaxed">
                <p>
                  Every parent in Patna wants their child to excel. With fierce competition in schools like St. Michael&apos;s, DPS, Loyola, and Notre Dame, classroom attention alone often isn&apos;t enough. But finding an honest, disciplined home tutor who actually knows how to explain concepts has always felt like a gamble.
                </p>
                <p>
                  Before Swati Home Tuition Bureau, parents were stuck calling unknown numbers torn off street poles or dealing with anonymous commission agents who sent unvetted college students without knowing their character, address, or teaching capabilities. When exams approached, tutors frequently stopped coming without notice.
                </p>
                <p className="text-[#0B192C] font-semibold bg-[#F3F1EC] p-4 rounded-xl border-l-4 border-[#0B192C]">
                  We established our physical bureau in Mithapur to change that. When you work with us, you aren&apos;t hiring a stranger from an anonymous online app. You are partnering with a locally grounded bureau that takes personal responsibility for every teacher sent into your home.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#0B192C]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#005F56]" />
                  Physical Office in Mithapur
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#005F56]" />
                  48-Hour Replacement Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#005F56]" />
                  Free In-Home Demo Session
                </div>
              </div>
            </motion.div>

            {/* Authentic Visual Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-md bg-white p-3">
                <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden">
                  <Image 
                    src="/images/hero_tutor_young.png" 
                    alt="Dedicated home tutor guiding a student in Patna" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/80 via-transparent to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-sm border border-white/50 text-[#0B192C]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0B192C] flex items-center justify-center shrink-0">
                        <HeartHandshake className="w-5 h-5 text-[#E5A93C]" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-sm text-[#0B192C]">Personal Accountability</p>
                        <p className="text-xs text-[#5A6578]">Direct coordination with parents from day one</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modern Digital System: Student & Teacher Portals */}
      <section className="py-20 bg-white border-y border-[#E8E6DF]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-3">
              <span className="w-6 h-0.5 bg-[#E5A93C]" />
              Modern Accountability
              <span className="w-6 h-0.5 bg-[#E5A93C]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mb-4">
              Old-School Warmth Powered by Modern Digital Portals
            </h2>
            <p className="text-base sm:text-lg text-[#5A6578] font-sans">
              We combine traditional home tutoring with purpose-built digital portals so parents always know where their child stands academically.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Student/Parent Portal Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF] hover:border-[#1E3E62]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B192C] flex items-center justify-center mb-6">
                  <Laptop className="w-6 h-6 text-[#E5A93C]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] bg-white px-3 py-1 rounded-full border border-[#E8E6DF]">
                  For Parents &amp; Students
                </span>
                <h3 className="font-display text-2xl font-bold text-[#0B192C] mt-4 mb-3">
                  Student &amp; Parent Academic Portal
                </h3>
                <p className="text-sm sm:text-base text-[#5A6578] leading-relaxed mb-6 font-sans">
                  No more guessing whether the tutor completed the syllabus. Parents can log in anytime to review class logs, syllabus milestones, weekly chapter test scores, and upcoming revision schedules.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Daily attendance verification and topic logs",
                    "Monthly chapter test scorecards and rank updates",
                    "Direct feedback channel to our Mithapur counselors"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#1A1D20]">
                      <CheckCircle2 className="w-4 h-4 text-[#005F56] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Link 
                  href="/portal/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0B192C] hover:text-[#E5A93C] transition-colors"
                >
                  Explore Parent Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Teacher Portal Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-[#F9F8F5] border border-[#E8E6DF] hover:border-[#1E3E62]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1E3E62] flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6 text-[#E5A93C]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3E62] bg-white px-3 py-1 rounded-full border border-[#E8E6DF]">
                  For Verified Educators
                </span>
                <h3 className="font-display text-2xl font-bold text-[#0B192C] mt-4 mb-3">
                  Teacher Portal &amp; Digital ID Cards
                </h3>
                <p className="text-sm sm:text-base text-[#5A6578] leading-relaxed mb-6 font-sans">
                  Every educator affiliated with Swati HTB carries a verifiable digital ID card with an instant QR check. Tutors submit lesson plans, log daily progress, and receive fair, timely compensation.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Verified digital educator ID card with photo & degree proof",
                    "Standardized lesson plans and curriculum benchmarks",
                    "Direct liaison with bureau academic supervisors"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-[#1A1D20]">
                      <CheckCircle2 className="w-4 h-4 text-[#005F56] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Link 
                  href="/teacher/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0B192C] hover:text-[#E5A93C] transition-colors"
                >
                  Teacher Portal Access <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our 4 Non-Negotiable Standards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mb-4">
              What We Stand For Every Single Day
            </h2>
            <p className="text-base sm:text-lg text-[#5A6578] font-sans">
              No buzzwords, no empty promises. Just the baseline standards every family deserves.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl border border-[#E8E6DF] shadow-sm hover:border-[#E5A93C]/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B192C] flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#0B192C] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5A6578] leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Local Patna Coverage Area */}
      <section className="py-16 bg-[#F3F1EC] border-t border-[#E8E6DF]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3E62] mb-2">
                <MapPin className="w-4 h-4 text-[#E5A93C]" />
                All Across Patna
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C] mb-3">
                Teachers Near Your Neighborhood
              </h3>
              <p className="text-sm text-[#5A6578] leading-relaxed font-sans mb-4">
                We assign teachers who live within 3–5 kilometers of your home so travel delays never cause cancelled classes.
              </p>
              <Link 
                href="/areas" 
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0B192C] hover:text-[#E5A93C] uppercase tracking-wider"
              >
                View all 86+ localities in Patna <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2.5">
                {localities.map((loc, i) => (
                  <span 
                    key={i} 
                    className="px-3.5 py-2 bg-white rounded-lg border border-[#E8E6DF] text-xs font-semibold text-[#0B192C] shadow-2xs"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office & Direct Contact Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0B192C] text-white relative overflow-hidden shadow-lg border-2 border-[#E5A93C]">
            <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#1E3E62] flex items-center justify-center mx-auto border border-[#E5A93C]/40">
                <PhoneCall className="w-7 h-7 text-[#E5A93C]" />
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Have Questions or Want to Meet Us in Person?
              </h2>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed font-sans">
                Our office is located right in Mithapur, Patna. You are always welcome to visit us for a face-to-face academic consultation, or call our team directly to discuss your child&apos;s learning needs.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/book-demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[3px] border-[#B87C1C] shadow-md"
                >
                  Book Free In-Home Demo Class
                </Link>

                <a
                  href="https://wa.me/919229738307?text=Hi%2C%20I%20would%20like%20to%20learn%20more%20about%20Swati%20Home%20Tuition%20Bureau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition-all border border-white/20 gap-2"
                >
                  WhatsApp Bureau Office (+91 92297 38307)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
