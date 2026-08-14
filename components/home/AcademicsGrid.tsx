"use client";

import { motion } from "framer-motion";
import { BookOpen, Atom, Microscope, Beaker, GraduationCap, LineChart, ChevronRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "Class 11 & 12 Boards",
    slug: "class-11-12-boards",
    subjects: "Physics, Chemistry, Maths, Biology",
    description: "Board-focused rigorous curriculum tailored to CBSE, ICSE & State boards for maximum scoring.",
    icon: <BookOpen className="w-8 h-8 text-[#D4A017]" />,
  },
  {
    title: "JEE Main & Advanced",
    slug: "jee-main-advanced",
    subjects: "Intensive PCM Coaching",
    description: "Mentorship by top-tier engineering graduates focusing on advanced problem-solving techniques.",
    icon: <Atom className="w-8 h-8 text-[#D4A017]" />,
  },
  {
    title: "NEET Medical",
    slug: "neet-medical",
    subjects: "PCB focused coaching",
    description: "Highly structured biology and core science coaching designed by medical entrance experts.",
    icon: <Microscope className="w-8 h-8 text-[#D4A017]" />,
  },
  {
    title: "Class 9 & 10 Foundation",
    slug: "class-9-10-foundation",
    subjects: "Science, Maths, SST, English",
    description: "Building strong analytical fundamentals crucial for future competitive exams and board success.",
    icon: <Beaker className="w-8 h-8 text-[#D4A017]" />,
  },
  {
    title: "Class 1 to 8 All Subjects",
    slug: "class-1-to-8-all-subjects",
    subjects: "Holistic Academic Support",
    description: "Nurturing young minds with personalized attention, improving grades and subject interest.",
    icon: <GraduationCap className="w-8 h-8 text-[#D4A017]" />,
  },
  {
    title: "Commerce (11 & 12)",
    slug: "commerce-11-12",
    subjects: "Accountancy, Business, Economics",
    description: "Specialized commerce faculties bridging the gap between theoretical knowledge and practical application.",
    icon: <LineChart className="w-8 h-8 text-[#D4A017]" />,
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AcademicsGrid() {
  return (
    <section className="py-24 bg-[#0F4C5C] relative overflow-hidden">
      
      {/* Background Accent Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4A017] -skew-x-12 translate-x-1/2 opacity-10 pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white -skew-x-12 -translate-x-1/2 opacity-5 pointer-events-none blur-3xl" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 font-serif">
              Curriculum <span className="text-[#D4A017] italic">&</span> Programs
            </h2>
            <p className="text-lg text-white/80 font-medium">
              Specialized home tuition programs designed by academic experts to build unshakable fundamentals and crack India's toughest competitive exams.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 md:pb-0 w-full"
        >
          {courses.map((course, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full min-w-[85vw] md:min-w-0 snap-center shrink-0">
              <Link href={`/programs/${course.slug}`}>
                <div className="group h-full bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-[#D4A017]/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Internal Glow Effect */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A017] rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-[#D4A017]/20 border border-white/10 transition-all duration-300">
                      {course.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-3 font-serif group-hover:text-[#D4A017] transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-4">
                      {course.subjects}
                    </p>
                    
                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors relative z-10 uppercase tracking-widest">
                    Explore Program
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[#D4A017] transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
