"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Search, MapPin, BookOpen, UserCheck, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { submitLeadToCRM } from "./actions";

export default function FindTutorPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    const result = await submitLeadToCRM(formData);
    
    if (result.success) {
      toast.success("Tutor Search Initiated!", {
        description: "Our matching team is looking for the perfect tutor. We'll contact you soon."
      });
      // reset form manually or via ref
      const form = document.getElementById("find-tutor-form") as HTMLFormElement;
      if (form) form.reset();
    } else {
      toast.error("Oops! Something went wrong.", {
        description: "Please try again or contact us on WhatsApp."
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-32 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
              <Search className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Find Your <br />
              <span className="text-[#D4A017] italic">Perfect Tutor</span> Today.
            </h1>
            <p className="text-lg md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium px-4 md:px-0">
              We match your child with Patna's most elite, background-verified educators tailored to their specific learning style.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-16 relative z-20 pb-24">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          
          {/* Left - Matching Process */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_10px_40px_rgb(0,0,0,0.03)]">
              <h3 className="text-2xl font-bold text-[#1F2937] mb-8 font-serif">Our Matching Process</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#0F4C5C] before:via-[#0F4C5C]/50 before:to-transparent">
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0F4C5C] text-white shadow shadow-[#0F4C5C]/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-[#FAF7F2] rounded-2xl border border-neutral-200/60 shadow-sm ml-4 md:ml-0 md:group-odd:mr-8 md:group-even:ml-8">
                    <h4 className="font-bold text-[#1F2937] mb-1">Submit Request</h4>
                    <p className="text-sm text-[#1F2937]/70">Tell us about your requirements.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-[#0F4C5C] text-[#0F4C5C] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white rounded-2xl border border-neutral-200/60 shadow-sm ml-4 md:ml-0 md:group-odd:mr-8 md:group-even:ml-8">
                    <h4 className="font-bold text-[#1F2937] mb-1">We Find a Match</h4>
                    <p className="text-sm text-[#1F2937]/70">Our team selects the best tutor.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-[#0F4C5C]/30 text-[#0F4C5C]/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white rounded-2xl border border-neutral-200/60 shadow-sm ml-4 md:ml-0 md:group-odd:mr-8 md:group-even:ml-8">
                    <h4 className="font-bold text-[#1F2937]/50 mb-1">Free Demo</h4>
                    <p className="text-sm text-[#1F2937]/50">Take a trial class before deciding.</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-[#0F4C5C] p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,76,92,0.2)] text-white text-center">
              <Star className="w-10 h-10 text-[#D4A017] mx-auto mb-4" fill="currentColor" />
              <h3 className="text-xl font-bold font-serif mb-2">Prefer to book a demo first?</h3>
              <p className="text-white/70 text-sm mb-6">You can directly book a free demo class instead.</p>
              <Link href="/book-demo">
                <button className="bg-white text-[#0F4C5C] px-6 py-3 rounded-xl font-bold w-full hover:bg-[#FAF7F2] transition-colors shadow-lg">
                  Book Free Demo
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif relative z-10">Your Requirements</h3>
            
            <form id="find-tutor-form" className="space-y-6 relative z-10" action={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Parent/Student Name</label>
                  <input required name="name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">WhatsApp Number</label>
                  <input required name="phone" type="tel" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="+91" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Class/Grade</label>
                  <select required name="class" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all appearance-none cursor-pointer">
                    <option value="">Select class...</option>
                    <option value="11-12">Class 11-12</option>
                    <option value="9-10">Class 9-10</option>
                    <option value="1-8">Class 1-8</option>
                    <option value="jee">JEE / NEET</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Locality in Patna</label>
                  <input required name="locality" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. Boring Road" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Subjects Needed</label>
                <input required name="subjects" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. Physics, Maths, Chemistry" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Any Specific Requirements? (Optional)</label>
                <textarea name="requirements" rows={3} className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30 resize-none" placeholder="e.g. Prefer female tutor, Need weekend classes..."></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-[#0F4C5C] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#0a3845] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(15,76,92,0.3)] transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      Find My Tutor <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <a 
                  href="https://wa.me/919229738307" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <button type="button" className="w-full h-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all flex items-center justify-center gap-3 group">
                    WhatsApp Us <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              </div>

            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

