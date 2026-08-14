"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Parent from Boring Road",
    review: "The Safety Shield protocol gave my wife and I total peace of mind. Our daughter's tutor is fantastic, and knowing she's ID-verified makes all the difference.",
    rating: 5,
    avatar: "R"
  },
  {
    name: "Sneha Sinha",
    role: "Parent from Kankarbagh",
    review: "We changed 3 tutors before finding Swati HTB. The IITian mentor they sent for my son's JEE prep completely changed his approach to Physics.",
    rating: 5,
    avatar: "S"
  },
  {
    name: "Vikash Singh",
    role: "Parent from Patliputra",
    review: "I love the monthly Progress Pulse reports on WhatsApp. I don't have to constantly ask the teacher how my child is doing; the bureau updates me automatically.",
    rating: 5,
    avatar: "V"
  },
  {
    name: "Neha Agarwal",
    role: "Parent from Rajendra Nagar",
    review: "We requested a female tutor for my 9th-grade daughter and they sent a brilliant M.Sc Chemistry grad the very next day. Extremely professional.",
    rating: 5,
    avatar: "N"
  },
  {
    name: "Amit Mishra",
    role: "Parent from Bailey Road",
    review: "The Teacher Passport is a game changer. We received a WhatsApp PDF with the teacher's qualifications and ID proof before the demo even started. Highly recommend.",
    rating: 5,
    avatar: "A"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section className="py-24 bg-[#FAF7F2] relative overflow-hidden" onMouseEnter={() => setAutoplay(false)} onMouseLeave={() => setAutoplay(true)}>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4 tracking-tight font-serif">
            Trusted by <span className="text-[#D4A017] italic">500+</span> Patna Parents
          </h2>
          <p className="text-lg text-[#1F2937]/60 max-w-2xl mx-auto font-medium">
            Hear what families across Patna have to say about the Swati System.
          </p>
        </div>

        <div className="relative min-h-[380px] md:min-h-[300px] flex flex-col items-center justify-center">
          <Quote className="absolute top-0 text-[#D4A017]/10 w-32 h-32 -z-10" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center w-full"
            >
              
              <div className="flex gap-1 mb-8">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4A017] text-[#D4A017]" />
                ))}
              </div>

              <p className="max-w-3xl text-2xl md:text-3xl text-[#1F2937] leading-tight font-medium mb-10 text-balance">
                "{testimonials[current].review}"
              </p>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-[#0F4C5C]/20 border-2 border-white">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <h5 className="font-bold text-lg text-[#1F2937]">
                    {testimonials[current].name}
                  </h5>
                  <p className="text-sm font-semibold text-[#1F2937]/50 uppercase tracking-widest">
                    {testimonials[current].role}
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current ? "bg-[#0F4C5C] w-8" : "bg-[#0F4C5C]/20 w-2 hover:bg-[#0F4C5C]/40"
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
