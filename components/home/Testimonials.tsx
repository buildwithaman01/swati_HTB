"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Rajesh Kumar",
    locality: "Boring Road",
    childGrade: "Class 10 CBSE",
    review: "The ID verification protocol gave my wife and I total peace of mind. Our daughter's science tutor from NIT Patna is exceptional, patient, and punctual. Knowing she's police and Aadhaar verified makes all the difference.",
    rating: 5,
    avatar: "R",
  },
  {
    name: "Sneha Sinha",
    locality: "Kankarbagh",
    childGrade: "Class 12 JEE Aspirant",
    review: "We tried finding tutors through local contacts with very inconsistent results. The engineering mentor Swati HTB matched for my son's JEE physics completely changed his problem-solving speed. Within 3 months his mock test percentile jumped from 78 to 94.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Vikash Singh",
    locality: "Patliputra Colony",
    childGrade: "Class 8 ICSE",
    review: "I appreciate the transparency. We received a complete Teacher Passport on WhatsApp before the demo even took place. No surprises, no hidden charges. Highly recommended for busy working parents in Patna.",
    rating: 5,
    avatar: "V",
  },
  {
    name: "Neha Agarwal",
    locality: "Rajendra Nagar",
    childGrade: "Class 9 ICSE",
    review: "We specifically requested an experienced female home tutor for my 9th-grade daughter. Swati HTB arranged a brilliant post-graduate tutor in Chemistry within 24 hours. The free trial demo gave us immediate confidence.",
    rating: 5,
    avatar: "N",
  },
  {
    name: "Amit Mishra",
    locality: "Bailey Road (RPS More)",
    childGrade: "Class 6 All Subjects",
    review: "The 48-hour replacement guarantee removed all the anxiety. Their academic counselor stays in touch regularly to check on syllabus coverage and attendance. Genuine, professional home tuition bureau.",
    rating: 5,
    avatar: "A",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section
      className="py-20 sm:py-28 bg-[#F9F8F5] relative overflow-hidden border-b border-[#E8E6DF]"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#005F56] mb-3">
            Real Patna Parent Experiences
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] mb-4">
            Trusted by <span className="text-[#E5A93C]">500+</span> Patna Families
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Authentic feedback from parents across Boring Road, Kankarbagh, Patliputra, and Bailey Road.
          </p>
        </div>

        {/* Testimonial Display Card */}
        <div className="relative min-h-[340px] sm:min-h-[280px] bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E6DF] shadow-lg flex flex-col items-center justify-center text-center">
          <Quote className="absolute top-6 left-8 text-[#0B192C]/5 w-20 h-20 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-center w-full relative z-10"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#E5A93C] text-[#E5A93C]" />
                ))}
              </div>

              {/* Quote */}
              <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-[#1A1D20] leading-snug font-medium mb-8 text-balance">
                "{testimonials[current].review}"
              </p>

              {/* Author & Verification Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#E8E6DF] w-full max-w-md justify-center">
                <div className="w-11 h-11 rounded-full bg-[#0B192C] text-white flex items-center justify-center text-base font-bold shadow-md">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 font-display font-bold text-base text-[#0B192C]">
                    {testimonials[current].name}
                    <CheckCircle2 className="w-4 h-4 text-[#005F56] fill-[#005F56]/20" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6578]">
                    <span className="flex items-center gap-0.5 text-[#005F56]">
                      <MapPin className="w-3 h-3" /> {testimonials[current].locality}
                    </span>
                    <span>•</span>
                    <span>{testimonials[current].childGrade}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === current ? "bg-[#0B192C] w-8" : "bg-[#0B192C]/20 w-2 hover:bg-[#0B192C]/40"
              )}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
