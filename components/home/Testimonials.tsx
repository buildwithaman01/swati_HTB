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
    review: "Finding a good science and maths teacher in Boring Road was a headache until we contacted Swati Bureau. The teacher who visits is always on time, very patient, and helped my son score 92% in his Class 10 pre-boards.",
    rating: 5,
    avatar: "R",
  },
  {
    name: "Sneha Sinha",
    locality: "Kankarbagh",
    childGrade: "Class 12 Science",
    review: "We struggled to find a reliable physics tutor for Class 12 boards and JEE. The coordinator shared the teacher's profile on WhatsApp and arranged a trial class the next day. My son's confidence in numericals improved tremendously.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Vikash Singh",
    locality: "Patliputra Colony",
    childGrade: "Class 8 ICSE",
    review: "What impressed me was their honest approach. No advance registration fee, and they sent the teacher's Aadhaar and college marksheets before the trial class. Very dependable home tuition service in Patna.",
    rating: 5,
    avatar: "V",
  },
  {
    name: "Neha Agarwal",
    locality: "Rajendra Nagar",
    childGrade: "Class 9 ICSE",
    review: "We specifically wanted an experienced female home tutor for our daughter. Swati Bureau connected us with an M.Sc teacher living nearby. She has been teaching for over six months now and our daughter's marks have visibly improved.",
    rating: 5,
    avatar: "N",
  },
  {
    name: "Amit Mishra",
    locality: "Bailey Road (RPS More)",
    childGrade: "Class 6 All Subjects",
    review: "Both my wife and I work full-time, so ensuring daily study discipline was challenging. The tutor helps with daily homework, clears concepts patiently, and we can check monthly attendance and test marks on the Parent Portal.",
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] mb-4">
            What Patna Parents Say About Us
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Honest feedback from families in Boring Road, Kankarbagh, Patliputra, and Bailey Road.
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
