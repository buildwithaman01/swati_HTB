"use client";

import { motion } from "framer-motion";
import { BookOpen, Atom, Microscope, Beaker, GraduationCap, LineChart, ArrowRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "Class 11 & 12 Board Mastery",
    slug: "class-11-12-boards",
    badge: "Senior Secondary",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    description: "Rigorous board preparation tailored for CBSE, ICSE & BSEB. Deep conceptual clarity, NCERT mastery, and previous 10-year paper analysis.",
    icon: BookOpen,
  },
  {
    title: "JEE Main & Advanced Mentorship",
    slug: "jee-main-advanced",
    badge: "Engineering Entrance",
    subjects: ["Advanced Physics", "Organic/Inorganic Chem", "Higher Math"],
    description: "One-on-one problem solving strategies led by top-tier engineering alumni. Focus on speed, precision, and multi-concept application.",
    icon: Atom,
  },
  {
    title: "NEET Medical Entrance Coaching",
    slug: "neet-medical",
    badge: "Medical Entrance",
    subjects: ["Core Biology", "Medical Physics", "Targeted Chemistry"],
    description: "Precision-driven coaching targeting 680+ NEET scores. Line-by-line NCERT breakdown with weekly test simulations at home.",
    icon: Microscope,
  },
  {
    title: "Class 9 & 10 Board Foundation",
    slug: "class-9-10-foundation",
    badge: "Secondary Foundation",
    subjects: ["Science", "Mathematics", "Social Studies", "English"],
    description: "Building unshakeable analytical fundamentals before board exams. Eliminates exam anxiety and trains students in structured answer writing.",
    icon: Beaker,
  },
  {
    title: "Class 1 to 8 Holistic All Subjects",
    slug: "class-1-to-8-all-subjects",
    badge: "Primary & Middle",
    subjects: ["Maths", "Science", "English Grammar", "Hindi/Sanskrit"],
    description: "Patient, encouraging home mentorship that instills disciplined study habits, improves handwriting, and fosters genuine curiosity.",
    icon: GraduationCap,
  },
  {
    title: "Commerce & Applied Economics",
    slug: "commerce-11-12",
    badge: "Senior Secondary",
    subjects: ["Accountancy", "Business Studies", "Economics", "Applied Math"],
    description: "Specialized commerce faculties bridging ledger mechanics, balance-sheet balancing, and practical economic theory for 95%+ board scores.",
    icon: LineChart,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AcademicsGrid() {
  return (
    <section className="py-20 sm:py-28 bg-[#F9F8F5] relative overflow-hidden border-b border-[#E8E6DF]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#005F56] mb-3">
            Comprehensive Academic Programs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] tracking-tight mb-4 leading-tight">
            Curricula Designed for Measurable Academic Growth
          </h2>
          <p className="text-base sm:text-lg text-[#5A6578] font-normal leading-relaxed">
            Every program is calibrated to your child’s specific syllabus and school pace. From foundational reading to competitive entrance exams.
          </p>
        </div>

        {/* 6 Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {courses.map((course, idx) => {
            const Icon = course.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className="h-full">
                <Link href={`/programs/${course.slug}`} className="group block h-full">
                  <div className="h-full bg-white rounded-2xl p-7 border border-[#E8E6DF] shadow-sm hover:shadow-xl hover:border-[#0B192C] transition-all duration-300 flex flex-col justify-between relative group-hover:-translate-y-1">

                    <div>
                      {/* Top Bar: Icon + Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-[#0B192C]/5 text-[#0B192C] group-hover:bg-[#0B192C] group-hover:text-white flex items-center justify-center transition-colors">
                          <Icon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#005F56] bg-[#005F56]/10 px-2.5 py-1 rounded-md">
                          {course.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl font-bold text-[#0B192C] mb-2 group-hover:text-[#005F56] transition-colors leading-snug">
                        {course.title}
                      </h3>

                      {/* Subject Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.subjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-medium text-[#5A6578] bg-[#F3F1EC] px-2 py-0.5 rounded"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[#5A6578] leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-6 pt-5 border-t border-[#E8E6DF] flex items-center justify-between text-xs font-bold text-[#0B192C] group-hover:text-[#E5A93C] transition-colors uppercase tracking-wider">
                      <span>View Program Syllabus</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Fast Action */}
        <div className="mt-14 text-center">
          <p className="text-sm text-[#5A6578]">
            Need tuition for a specific competitive exam or language?{" "}
            <Link href="/find-tutor" className="font-bold text-[#0B192C] underline decoration-[#E5A93C] decoration-2 hover:text-[#005F56]">
              Request a Custom Subject Tutor →
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
