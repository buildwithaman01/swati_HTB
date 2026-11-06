"use client";

import { motion } from "framer-motion";
import { BookOpen, Atom, Microscope, Beaker, GraduationCap, LineChart, ArrowRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "Class 11 & 12 Board Preparation",
    slug: "class-11-12-boards",
    badge: "Classes 11–12",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    description: "Focused preparation for CBSE, ICSE, and Bihar Board. Complete NCERT coverage, clear concepts, and practice with past 10 years' exam papers.",
    icon: BookOpen,
  },
  {
    title: "Class 9 & 10 Board Foundation",
    slug: "class-9-10-foundation",
    badge: "Classes 9–10",
    subjects: ["Science", "Mathematics", "Social Science", "English"],
    description: "Building strong fundamentals before board exams. We help students overcome math and science anxiety through patient, one-on-one guidance.",
    icon: Beaker,
  },
  {
    title: "Class 1 to 8 (All Subjects)",
    slug: "class-1-to-8-all-subjects",
    badge: "Classes 1–8",
    subjects: ["Maths", "Science", "English", "Hindi / Sanskrit"],
    description: "Caring home tutors who assist with daily homework, build disciplined study routines, and strengthen reading and basic arithmetic.",
    icon: GraduationCap,
  },
  {
    title: "JEE Main & Advanced Mentorship",
    slug: "jee-main-advanced",
    badge: "Engineering",
    subjects: ["Physics", "Chemistry", "Higher Mathematics"],
    description: "One-on-one problem solving guidance by qualified engineering graduates. Focused on numerical speed, concept clarity, and test strategies.",
    icon: Atom,
  },
  {
    title: "NEET Medical Entrance Guidance",
    slug: "neet-medical",
    badge: "Medical",
    subjects: ["Botany & Zoology", "Medical Physics", "Chemistry"],
    description: "Thorough NCERT line-by-line coverage for medical aspirants. In-home test practice and concept revision designed for high NEET scores.",
    icon: Microscope,
  },
  {
    title: "Commerce & Economics",
    slug: "commerce-11-12",
    badge: "Commerce 11–12",
    subjects: ["Accountancy", "Business Studies", "Economics", "Applied Math"],
    description: "Clear understanding of ledger mechanics, balance sheets, and economic theory tailored for Class 11 and 12 board examinations.",
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] tracking-tight mb-4 leading-tight">
            Classes &amp; Subjects We Cover
          </h2>
          <p className="text-base sm:text-lg text-[#5A6578] font-normal leading-relaxed">
            From Class 1 foundational support to Class 10 &amp; 12 board preparations and JEE/NEET mentorship. Every tutor follows your child's school syllabus and pace.
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
                      <span>View Program Details</span>
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
            Looking for a tutor for a specific language or subject?{" "}
            <Link href="/find-tutor" className="font-bold text-[#0B192C] underline decoration-[#E5A93C] decoration-2 hover:text-[#005F56]">
              Request a Custom Tutor →
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
