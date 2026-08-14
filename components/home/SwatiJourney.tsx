"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, User, Star, BookOpen, Clock, PhoneCall, FileText, ChevronRight } from "lucide-react";

const chapters = [
  {
    id: "01",
    title: "Verified",
    headline: "Your Child's Safety Comes First",
    desc: "Every tutor completes our multi-step verification before entering your home.",
    Component: Chapter1_Safety,
  },
  {
    id: "02",
    title: "Matched",
    headline: "The Teacher Passport",
    desc: "Receive a comprehensive, verified profile directly to your WhatsApp before the first demo class.",
    Component: Chapter2_Passport,
  },
  {
    id: "03",
    title: "Demo Class",
    headline: "The Perfect Mentor Match",
    desc: "We pair your child exclusively with top-tier educators, including actual IIT/NIT and Medical alumni.",
    Component: Chapter3_Match,
  },
  {
    id: "04",
    title: "Regular Tracking",
    headline: "The Progress Pulse",
    desc: "Watch your child's academic journey light up with monthly reports detailing exact syllabus coverage.",
    Component: Chapter4_Tracking,
  },
  {
    id: "05",
    title: "Performance Improvement",
    headline: "Targeted Subject Assessment",
    desc: "We rigorously test our teachers on subject matter expertise, ensuring they are perfectly equipped to elevate performance.",
    Component: Chapter5_Assessment,
  },
  {
    id: "06",
    title: "Replacement Support",
    headline: "The 48-Hour Guarantee",
    desc: "Not fully satisfied? We guarantee a highly qualified replacement tutor within 48 hours. No questions asked.",
    Component: Chapter6_Replacement,
  },
  {
    id: "07",
    title: "Academic Success",
    headline: "24/7 Parent Support Hub",
    desc: "WhatsApp, Call, Chat, Video—all connected into one premium support experience for instantaneous doubt resolution.",
    Component: Chapter7_Support,
  },
  {
    id: "08",
    title: "Transparent Pricing",
    headline: "Premium Education, No Surprises",
    desc: "Zero hidden charges. No registration fees. Just a predictable, premium monthly investment.",
    Component: Chapter8_Pricing,
  }
];

import { useEffect, useState, useRef } from "react";

export default function SwatiJourney() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" } // Triggers when element is near top third of screen
    );

    const sections = document.querySelectorAll(".journey-chapter");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <section className="py-24 bg-ivory relative border-t border-neutral-200 text-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 relative items-start">
          
          {/* Sticky Left Sidebar (Index) */}
          <div className="hidden lg:block w-1/3 sticky top-32 h-[calc(100vh-8rem)]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              The Swati Promise.
            </h2>
            <p className="text-lg text-neutral-600 tracking-tight mb-12">
              We don't just send a tutor. We orchestrate a complete academic journey designed for safety, transparency, and elite performance.
            </p>
            
            <nav className="flex flex-col gap-6 relative">
              {/* Progress Line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-neutral-200 -z-10"></div>
              
              {chapters.map((chapter) => {
                const isActive = activeChapter === chapter.id;
                return (
                  <div key={chapter.id} className="flex items-center gap-4 group cursor-default">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-emerald border-emerald' : 'bg-ivory border-neutral-300'}`}>
                      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-white' : 'bg-transparent'}`}></div>
                    </div>
                    <div>
                      <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-gold' : 'text-neutral-400'}`}>
                        {chapter.id}
                      </span>
                      <h4 className={`text-lg font-bold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-neutral-500'}`}>
                        {chapter.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Scrolling Content (Right Side) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-24 lg:gap-40" ref={containerRef}>
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                The Swati Promise.
              </h2>
              <p className="text-lg text-neutral-600 tracking-tight">
                We don't just send a tutor. We orchestrate a complete academic journey designed for safety, transparency, and elite performance.
              </p>
            </div>

            {chapters.map((chapter) => (
              <div key={chapter.id} id={chapter.id} className="journey-chapter scroll-mt-32">
                <div className="mb-8">
                  <div className="lg:hidden flex items-center gap-4 mb-4">
                    <span className="text-sm font-bold tracking-widest uppercase text-gold">Chapter {chapter.id}</span>
                    <div className="h-px bg-gold/30 w-12"></div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">{chapter.headline}</h3>
                  <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-2xl">
                    {chapter.desc}
                  </p>
                </div>

                <div className="w-full h-[450px] md:h-[500px] rounded-3xl overflow-hidden relative group">
                  <chapter.Component />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 1: SAFETY SHIELD
// ----------------------------------------------------------------------
function Chapter1_Safety() {
  return (
    <div className="w-full h-full bg-primary/5 flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#0F3D3E 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.05 }}></div>
      
      {/* House Silhouette */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.1, y: 0 }}
        className="absolute bottom-[-10%] w-full flex justify-center"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-96 h-96 text-primary">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </motion.div>

      {/* Glass Shield */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-64 h-72 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(15,61,62,0.1)] flex flex-col items-center justify-center p-8 group-hover:shadow-[0_40px_80px_rgba(15,61,62,0.15)] transition-all duration-700"
      >
        {/* Floating ID Card */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-full bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="h-2 w-16 bg-neutral-200 rounded mb-2"></div>
            <div className="h-2 w-24 bg-neutral-100 rounded"></div>
          </div>
        </motion.div>

        {/* Green Verification Pulse */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-emerald rounded-full"
          ></motion.div>
          <div className="relative z-10 w-16 h-16 bg-emerald rounded-full flex items-center justify-center shadow-lg shadow-emerald/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Particles */}
        <motion.div 
          animate={{ y: [0, -20], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="absolute top-10 right-10 w-2 h-2 rounded-full bg-emerald"
        ></motion.div>
        <motion.div 
          animate={{ y: [0, -20], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
          className="absolute bottom-20 left-10 w-2 h-2 rounded-full bg-emerald"
        ></motion.div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 2: PASSPORT
// ----------------------------------------------------------------------
function Chapter2_Passport() {
  return (
    <div className="w-full h-full bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Orbital Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[300px] h-[300px] rounded-full border border-gold/30 absolute"></div>
        <div className="w-[500px] h-[500px] rounded-full border border-gold/20 absolute"></div>
        <div className="w-[700px] h-[700px] rounded-full border border-gold/10 absolute"></div>
      </div>

      {/* Apple Wallet Style Card */}
      <motion.div 
        initial={{ y: 50, rotateX: 20 }}
        whileInView={{ y: 0, rotateX: 0 }}
        whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ perspective: 1000 }}
        className="relative z-10 w-80 bg-white rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/20"
      >
        <div className="bg-neutral-900 text-white p-6 pb-12 flex justify-between items-start relative">
          <div>
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Teacher Passport</p>
            <h4 className="text-xl font-bold text-ivory">Aarti Sharma</h4>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
            <User className="w-6 h-6 text-white" />
          </div>
          
          {/* Glowing Verified Seal */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -bottom-6 right-6 w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/40 border-4 border-white"
          >
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        <div className="p-6 pt-10 bg-ivory space-y-4">
          {[
            { label: "Verified ID", icon: ShieldCheck },
            { label: "Qualification: M.Sc Physics", icon: BookOpen },
            { label: "Experience: 5+ Years", icon: Clock },
            { label: "Background Check Passed", icon: CheckCircle2 },
            { label: "Rating: 4.9/5", icon: Star }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-primary"
            >
              <item.icon className="w-5 h-5 text-emerald" />
              <span className="text-sm font-semibold">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 3: MENTOR MATCH
// ----------------------------------------------------------------------
function Chapter3_Match() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary to-neutral-900 flex items-center justify-center relative overflow-hidden">
      
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Left Orbit (Student) */}
        <motion.div 
          animate={{ x: [ -60, 0, -60 ] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute left-1/4 w-32 h-32 rounded-full border border-white/20 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">STUDENT</span>
          </div>
        </motion.div>

        {/* Right Orbit (Tutor) */}
        <motion.div 
          animate={{ x: [ 60, 0, 60 ] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute right-1/4 w-32 h-32 rounded-full border border-gold/30 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gold/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <span className="text-gold font-bold text-xs">MENTOR</span>
          </div>
        </motion.div>

        {/* Center Match Element */}
        <motion.div 
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="z-10 w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.6)]"
        >
          <span className="text-primary font-bold text-sm text-center leading-tight">PERFECT<br/>MATCH</span>
        </motion.div>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 4: REGULAR TRACKING
// ----------------------------------------------------------------------
function Chapter4_Tracking() {
  return (
    <div className="w-full h-full bg-[#f4f7f6] flex items-center justify-center relative overflow-hidden">
      {/* Gradient Mesh bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10 w-64 bg-white rounded-3xl p-8 shadow-xl shadow-emerald/5 border border-emerald/10">
        <div className="relative">
          {/* The Glowing Line Background */}
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-neutral-200"></div>
          
          {/* The Glowing Line Foreground (Animated) */}
          <motion.div 
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-[15px] top-4 w-[2px] bg-emerald shadow-[0_0_10px_rgba(46,204,113,0.8)]"
          ></motion.div>

          {/* Timeline Nodes */}
          {[
            { label: "Week 1", desc: "Foundation" },
            { label: "Week 4", desc: "First Review" },
            { label: "Week 8", desc: "Mid-Term" },
            { label: "Goal Achieved", desc: "98% Score", highlight: true }
          ].map((node, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.5 }}
              className="flex items-start gap-6 mb-8 last:mb-0 relative z-10"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${node.highlight ? 'bg-emerald text-white shadow-lg shadow-emerald/40' : 'bg-white border-2 border-emerald text-emerald'}`}>
                {node.highlight ? <Star className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-emerald"></div>}
              </div>
              <div>
                <h5 className={`font-bold ${node.highlight ? 'text-emerald' : 'text-primary'}`}>{node.label}</h5>
                <p className="text-xs text-neutral-500">{node.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 5: ASSESSMENT
// ----------------------------------------------------------------------
function Chapter5_Assessment() {
  return (
    <div className="w-full h-full bg-[#E5E9F0] flex items-center justify-center relative overflow-hidden">
      {/* Blueprint Grid */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#d1d8e0 1px, transparent 1px), linear-gradient(90deg, #d1d8e0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-primary/20"></div>
        <div className="absolute inset-4 rounded-full border border-primary/10"></div>
        <div className="absolute inset-12 rounded-full border border-primary/10"></div>
        
        {/* Radar Sweep */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(15,61,62,0.2) 100%)' }}
        ></motion.div>

        {/* Center */}
        <div className="w-4 h-4 bg-primary rounded-full relative z-10 shadow-[0_0_15px_rgba(15,61,62,0.5)]"></div>

        {/* Subject Dots */}
        {[
          { label: "Math", top: "10%", left: "50%", glow: true },
          { label: "Physics", top: "70%", left: "80%", glow: false },
          { label: "English", top: "60%", left: "20%", glow: true },
          { label: "Chemistry", top: "30%", left: "80%", glow: false }
        ].map((sub, i) => (
          <div key={i} className="absolute" style={{ top: sub.top, left: sub.left, transform: 'translate(-50%, -50%)' }}>
            <motion.div 
              animate={sub.glow ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
              className={`w-3 h-3 rounded-full ${sub.glow ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-primary/40'}`}
            ></motion.div>
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">{sub.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 6: REPLACEMENT
// ----------------------------------------------------------------------
function Chapter6_Replacement() {
  return (
    <div className="w-full h-full bg-ivory flex items-center justify-center relative overflow-hidden">
      {/* Soft diagonal stripes */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0F3D3E 25%, transparent 25%, transparent 75%, #0F3D3E 75%, #0F3D3E), repeating-linear-gradient(45deg, #0F3D3E 25%, #FDFBF7 25%, #FDFBF7 75%, #0F3D3E 75%, #0F3D3E)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>

      <div className="relative w-full max-w-sm h-64 flex items-center justify-center">
        {/* Outgoing Card */}
        <motion.div 
          animate={{ x: [0, -100, -100, 0], opacity: [1, 0, 0, 1], scale: [1, 0.8, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute z-10 w-48 bg-white p-4 rounded-2xl shadow-lg border border-neutral-100 flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-neutral-100 rounded-full mb-3"></div>
          <div className="h-3 w-24 bg-neutral-200 rounded mb-2"></div>
          <div className="h-2 w-16 bg-neutral-100 rounded"></div>
        </motion.div>

        {/* Incoming Card */}
        <motion.div 
          animate={{ x: [100, 0, 0, 100], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute z-20 w-48 bg-white p-4 rounded-2xl shadow-[0_20px_40px_rgba(15,61,62,0.1)] border border-emerald/20 flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-emerald/10 rounded-full mb-3 flex items-center justify-center">
            <User className="w-8 h-8 text-emerald" />
          </div>
          <div className="h-3 w-24 bg-primary/80 rounded mb-2"></div>
          <div className="h-2 w-16 bg-primary/40 rounded"></div>
        </motion.div>

        {/* 48h Badge */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute z-30 -bottom-6 bg-emerald text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald/30 border-2 border-white flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          48h Replacement
        </motion.div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 7: SUPPORT HUB
// ----------------------------------------------------------------------
function Chapter7_Support() {
  return (
    <div className="w-full h-full bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Light Dots Matrix */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#FDFBF7 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.1 }}></div>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Connecting Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <line x1="50" y1="50" x2="20" y2="20" stroke="rgba(253, 251, 247, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="rgba(253, 251, 247, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="50" x2="20" y2="80" stroke="rgba(253, 251, 247, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="50" x2="80" y2="80" stroke="rgba(253, 251, 247, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Nodes */}
        {[
          { icon: PhoneCall, top: "10%", left: "10%" },
          { icon: FileText, top: "10%", left: "90%" },
          { icon: ShieldCheck, top: "90%", left: "10%" },
          { icon: CheckCircle2, top: "90%", left: "90%" },
        ].map((node, i) => (
          <div key={i} className="absolute w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20" style={{ top: node.top, left: node.left, transform: 'translate(-50%, -50%)' }}>
            <node.icon className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Data Packets (Motion) */}
        {[
          { top: ["10%", "50%"], left: ["10%", "50%"] },
          { top: ["10%", "50%"], left: ["90%", "50%"] },
        ].map((packet, i) => (
          <motion.div 
            key={i}
            animate={{ top: packet.top, left: packet.left, opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 1 }}
            className="absolute w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]"
            style={{ transform: 'translate(-50%, -50%)' }}
          ></motion.div>
        ))}

        {/* Central Hub */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative z-10 w-24 h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] border-4 border-primary"
        >
          <span className="text-primary font-bold text-lg">HUB</span>
        </motion.div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CHAPTER 8: PRICING
// ----------------------------------------------------------------------
function Chapter8_Pricing() {
  return (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative overflow-hidden">
      {/* Frosted Glass Background Panels */}
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute w-[120%] h-40 bg-white/5 backdrop-blur-lg -rotate-12 rounded-3xl"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute w-[120%] h-40 bg-primary/20 backdrop-blur-md rotate-12 rounded-3xl"
      ></motion.div>

      {/* Luxury Pricing Receipt */}
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative z-10 w-72 bg-ivory rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden"
      >
        <div className="bg-primary p-6 text-center">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">Monthly Tuition</p>
          <h4 className="text-white text-4xl font-serif">₹XXXX</h4>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400 line-through">Registration Fee</span>
            <span className="text-neutral-400 line-through">₹2,000</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400 line-through">Hidden Charges</span>
            <span className="text-neutral-400 line-through">₹500</span>
          </div>
          <div className="h-px bg-neutral-200 my-4"></div>
          <div className="flex justify-between items-center text-sm font-bold text-emerald">
            <span>Free Demo Class</span>
            <span>Included</span>
          </div>
        </div>

        {/* Glare effect */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 opacity-50"
        ></motion.div>
      </motion.div>
    </div>
  );
}
