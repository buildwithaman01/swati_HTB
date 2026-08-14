import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, ChevronDown, GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Script from "next/script";

// Data mapping for the dynamic routes based on AcademicsGrid
const programsData: Record<string, any> = {
  "class-11-12-boards": {
    title: "Class 11 & 12 Board Preparation",
    subtitle: "Physics, Chemistry, Maths, Biology",
    desc: "Rigorous preparation for CBSE and BSEB board exams. We focus on conceptual clarity, regular answer-writing practice, and high-scoring techniques.",
    image: "/images/candid_student_1_1786135404844.png",
    features: ["NCERT focused teaching", "Previous Year Question (PYQ) solving", "Weekly mock tests", "Expert examiners as tutors"],
  },
  "jee-main-advanced": {
    title: "JEE Main & Advanced Coaching",
    subtitle: "Intensive PCM Coaching by IITians",
    desc: "The most competitive exam requires the best minds. Our JEE tutors are carefully selected alumni from IITs and NITs who have cracked the exam themselves.",
    image: "/images/jee_student_1786135342245.png",
    features: ["Advanced problem solving", "Time management strategies", "Customized DPPs (Daily Practice Problems)", "Direct IITian Mentorship"],
  },
  "neet-medical": {
    title: "NEET Medical Coaching",
    subtitle: "PCB focused coaching by Medical Experts",
    desc: "Biology must be at your fingertips, and Physics/Chemistry must be fast. Our NEET specialists (including PMCH students) train you for speed and accuracy.",
    image: "/images/jee_student_1786135342245.png", 
    features: ["NCERT line-by-line coverage", "High-yield topic focus", "Negative marking avoidance strategies", "Full syllabus mock tests"],
  },
  "class-9-10-foundation": {
    title: "Class 9 & 10 Foundation",
    subtitle: "Science, Maths, SST, English",
    desc: "The critical years for building the foundation for future competitive exams. We ensure your child doesn't just memorize, but truly understands the core concepts.",
    image: "/images/candid_student_1_1786135404844.png",
    features: ["NTSE & Olympiad prep integration", "Concept building for 11th/12th", "Regular parent-teacher feedback", "Doubt clearing sessions"],
  },
  "class-1-to-8-all-subjects": {
    title: "Class 1 to 8 (All Subjects)",
    subtitle: "Building strong academic fundamentals",
    desc: "Young minds need patient, engaging, and highly vetted tutors. Our junior classes focus on making learning enjoyable while ensuring strict academic discipline.",
    image: "/images/candid_kids_1_1786135415321.png",
    features: ["Homework assistance", "Reading & Writing skill improvement", "Female tutors preferred for younger kids", "Interactive learning methods"],
  },
  "commerce-11-12": {
    title: "Commerce (Class 11 & 12)",
    subtitle: "Accountancy, Business Studies, Economics",
    desc: "Specialized coaching for Commerce students aiming for top board scores and future CA/CS entrance exams. Practical, real-world examples to explain complex accounting.",
    image: "/images/candid_student_1_1786135404844.png",
    features: ["CA Foundation oriented basics", "Balance sheet & accounting mastery", "Economics case studies", "Exam presentation skills"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programsData[slug];
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.title} | Swati Home Tuition Bureau`,
    description: program.desc,
  };
}

export function generateStaticParams() {
  return Object.keys(programsData).map((slug) => ({
    slug: slug,
  }));
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programsData[slug];
  
  if (!program) {
    notFound();
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      <Script id="program-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": program.title,
          "description": program.desc,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Swati Home Tuition Bureau",
            "url": "https://swatihometuition.in"
          }
        })}
      </Script>

      {/* Premium Header */}
      <section className="relative pt-32 pb-20 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm font-bold tracking-[0.1em] uppercase text-white/50">
            <Link href="/" className="hover:text-[#D4A017] transition-colors">Home</Link>
            <span className="mx-2 text-[#D4A017]">-</span>
            <span className="text-[#D4A017]">{program.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-16 relative z-20 pb-24">
        
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left Content */}
          <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-[#FAF7F2] rounded-xl mb-6 border border-[#D4A017]/20">
                <GraduationCap className="w-6 h-6 text-[#D4A017]" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-4 font-serif leading-[1.1]">
                {program.title}
              </h1>
              <div className="text-xl font-bold text-[#0F4C5C] mb-8 uppercase tracking-wide text-sm">
                {program.subtitle}
              </div>
              
              <p className="text-lg text-[#1F2937]/70 leading-relaxed mb-10 font-medium">
                {program.desc}
              </p>

              <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#D4A017]/20 mb-10">
                <h3 className="text-2xl font-bold text-[#1F2937] mb-6 font-serif">Program Highlights</h3>
                <ul className="space-y-4">
                  {program.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4 text-[#1F2937]/80">
                      <div className="w-6 h-6 rounded-full bg-[#0F4C5C] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
                      </div>
                      <span className="font-bold text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-demo" className="flex-1">
                  <button className="w-full bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(15,76,92,0.3)] flex items-center justify-center gap-3 group">
                    Book a Free Demo Class
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <a href="https://wa.me/919229738307" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] flex items-center justify-center gap-3 group">
                    WhatsApp Us
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>
            </div>

            {/* FAQs */}
            <div className="mt-16 relative z-10">
              <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif">Frequently Asked Questions</h3>
              <div className="space-y-4">
                
                <details className="group bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-[#FAF7F2]">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Are the tutors verified?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-1 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes, absolutely. Every single tutor undergoes a strict background check, Aadhar ID verification, and qualification screening before they are assigned to any student.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-[#FAF7F2]">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    Can I request a female tutor?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-1 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    Yes. We have a specific "Girls Safety Shield" protocol. We can prioritize assigning verified female tutors for female students upon request.
                  </div>
                </details>

                <details className="group bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all hover:bg-[#FAF7F2]">
                  <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-[#1F2937] text-lg">
                    What if I am not satisfied with the demo?
                    <span className="transition-transform duration-300 group-open:-rotate-180 bg-white p-1 rounded-full shadow-sm">
                      <ChevronDown className="w-5 h-5 text-[#0F4C5C]" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-[#1F2937]/70 font-medium leading-relaxed">
                    The first demo class is 100% free with no obligations. If you are not satisfied with the tutor's teaching style, we will provide a replacement within 24 hours at no extra cost.
                  </div>
                </details>

              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[800px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.1)] border-8 border-white sticky top-32">
            <div className="absolute inset-0 bg-[#0F4C5C]/10 z-10 mix-blend-overlay"></div>
            <Image 
              src={program.image} 
              alt={program.title} 
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
