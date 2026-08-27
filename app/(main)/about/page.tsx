"use client";

import Image from "next/image";
import { CheckCircle2, Shield, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-24 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Organizing Patna's <br />
              <span className="text-[#D4A017] italic">Tuition Ecosystem</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-3xl mx-auto font-medium">
              For too long, finding a reliable home tutor in Patna relied on word-of-mouth and unverified agencies. We built Swati HTB to bring absolute transparency, elite academics, and guaranteed safety to your child's education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats & Image Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,76,92,0.15)] border border-neutral-200/50"
            >
              <Image 
                src="/images/hero_tutor_young.png" 
                alt="Professional Indian Home Tutor teaching a student" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C]/60 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-8 font-serif">
                A Legacy of <span className="text-[#D4A017] italic">Trust.</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <div className="text-6xl font-bold text-[#0F4C5C] mb-2 font-serif">500+</div>
                  <div className="text-sm font-bold text-[#1F2937]/50 uppercase tracking-widest">Parents Trust Us</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-[#0F4C5C] mb-2 font-serif">200+</div>
                  <div className="text-sm font-bold text-[#1F2937]/50 uppercase tracking-widest">Verified Tutors</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-[#0F4C5C] mb-2 font-serif">86+</div>
                  <div className="text-sm font-bold text-[#1F2937]/50 uppercase tracking-widest">Localities Served</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-[#0F4C5C] mb-2 font-serif">20+</div>
                  <div className="text-sm font-bold text-[#1F2937]/50 uppercase tracking-widest">Expert Coordinators</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Mission Bento */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#FAF7F2] -skew-x-12 -translate-x-20 opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-6 font-serif">
              Why We Are <span className="text-[#D4A017] italic">Different</span>
            </h2>
            <p className="text-[#1F2937]/70 text-lg font-medium">We operate like an elite educational institute, not a matching agency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-[#0F4C5C]" />,
                title: "Absolute Safety",
                desc: "100% government ID verification for every tutor. We enforce a strict female-first matching policy for female students."
              },
              {
                icon: <Award className="w-8 h-8 text-[#0F4C5C]" />,
                title: "Elite Talent",
                desc: "We exclusively recruit from top institutions (IITs, NITs, PMCH). Our tutors undergo subject-matter testing before onboarding."
              },
              {
                icon: <Users className="w-8 h-8 text-[#0F4C5C]" />,
                title: "Managed Progress",
                desc: "We don't just assign a teacher and disappear. We monitor syllabus coverage and take monthly feedback from parents."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-200/60 hover:shadow-[0_8px_30px_rgb(15,76,92,0.08)] hover:border-[#D4A017]/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] flex items-center justify-center mb-8 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-4 font-serif">{item.title}</h3>
                  <p className="text-[#1F2937]/60 text-base leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Image */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1 relative h-[500px] w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,76,92,0.15)] border border-neutral-200/50"
            >
               <Image 
                src="/images/candid_student_1_1786135404844.png" 
                alt="Authentic student studying in Patna" 
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] tracking-tight mb-8 font-serif">
                Real Results. <br/>
                <span className="text-[#D4A017] italic">Real Studying.</span>
              </h2>
              <p className="text-xl text-[#1F2937]/70 tracking-tight leading-relaxed mb-10 font-medium">
                Our approach is grounded in reality. We know what it takes to crack the Bihar Board, CBSE, ICSE, and competitive exams like JEE and NEET. It takes discipline, the right mentor, and continuous evaluation.
              </p>
              <ul className="space-y-6">
                {["Customized Study Plans", "Weekly Subject Tests", "Direct Parent-Tutor Communication", "Guaranteed 48hr Replacement"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#1F2937] font-bold text-lg">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-[#D4A017]/30">
                      <CheckCircle2 className="w-5 h-5 text-[#D4A017]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
