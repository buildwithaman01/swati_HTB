"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Shield, BookOpen, GraduationCap, ArrowRight, CheckCircle2, UserPlus, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current!;
    const formData = new FormData(formRef.current!);
    
    try {
      const data = {
        formType: "join-tutor",
        name: formData.get("name"),
        phone: formData.get("phone"),
        gender: formData.get("gender"),
        qualification: formData.get("qualification"),
        subjects: formData.get("subjects"),
        location: formData.get("location"),
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      // Send to Web3Forms directly from the browser to bypass Cloudflare bot blocks
      if (result.web3formsData) {
        try {
          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              access_key: result.web3formsData.access_key,
              subject: result.web3formsData.subject,
              from_name: "Swati HTB Website",
              "Teacher Name": data.name || "-",
              "WhatsApp Number": data.phone || "-",
              "Gender": data.gender || "-",
              "Highest Qualification": data.qualification || "-",
              "Subjects Taught": data.subjects || "-",
              "Location (Patna)": data.location || "-",
            })
          });
        } catch (e) {
          console.error("Web3Forms frontend submit failed:", e);
        }
      }

      if (result.success && result.whatsappUrl) {
        setWhatsappUrl(result.whatsappUrl);
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please WhatsApp us directly.");
      }
    } catch (error) {
      toast.error("Network error. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      
      {/* Cinematic Hero Header */}
      <section className="relative pt-40 pb-32 bg-[#0F4C5C] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
              <UserPlus className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Teach with Patna's <br />
              <span className="text-[#D4A017] italic">Most Trusted Bureau</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
              We are actively looking for passionate educators, top university alumni, and subject matter experts to join our elite network.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-16 relative z-20 pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Left Content - Information */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-16 md:pt-24"
          >
            <h2 className="text-4xl font-bold text-[#1F2937] mb-10 font-serif leading-tight">
              Why Partner With Us?
            </h2>

            <div className="space-y-10 mb-12">
              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-neutral-200/60 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4C5C] group-hover:border-[#0F4C5C] transition-colors duration-300">
                  <Shield className="w-8 h-8 text-[#0F4C5C] group-hover:text-[#D4A017] transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-serif">Strict Verification</h3>
                  <p className="text-[#1F2937]/70 text-lg leading-relaxed">You must provide government ID (Aadhaar) and local address proof before any student assignment.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-neutral-200/60 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4C5C] group-hover:border-[#0F4C5C] transition-colors duration-300">
                  <BookOpen className="w-8 h-8 text-[#0F4C5C] group-hover:text-[#D4A017] transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-serif">Subject Matter Testing</h3>
                  <p className="text-[#1F2937]/70 text-lg leading-relaxed">Tutors applying for JEE/NEET or Class 11-12 Boards must pass a screening test with our academic heads.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-neutral-200/60 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F4C5C] group-hover:border-[#0F4C5C] transition-colors duration-300">
                  <GraduationCap className="w-8 h-8 text-[#0F4C5C] group-hover:text-[#D4A017] transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1F2937] mb-3 font-serif">Premium Compensation</h3>
                  <p className="text-[#1F2937]/70 text-lg leading-relaxed">We work with Patna's premium localities allowing you to earn top-tier tuition fees.</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-[#0F4C5C]/5 rounded-3xl border border-[#0F4C5C]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h4 className="font-bold text-[#0F4C5C] mb-3 text-xl font-serif">Note for Female Tutors</h4>
              <p className="text-[#1F2937]/70 text-base leading-relaxed">Due to high demand from parents, we are actively prioritizing the onboarding of verified female tutors for students in Class 1 to 10.</p>
            </div>
          </motion.div>

          {/* Right Content — Form or Success Card */}
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── SUCCESS CARD ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mb-6 relative z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>

                <h3 className="text-3xl font-bold text-[#1F2937] mb-3 font-serif relative z-10">
                  Application Received! 🎉
                </h3>
                <p className="text-[#1F2937]/60 text-lg leading-relaxed max-w-sm relative z-10">
                  Thank you for applying! Our recruitment team will review your details and contact you on WhatsApp within <strong>24 hours</strong>.
                </p>

                <div className="w-full border-t border-neutral-100 my-8 relative z-10" />

                {/* Optional WhatsApp CTA */}
                <div className="relative z-10 w-full bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-6">
                  <p className="text-sm font-semibold text-emerald-800 mb-1">Want to connect faster?</p>
                  <p className="text-sm text-emerald-700 mb-4">
                    You can also message us directly on WhatsApp for a quicker response from our team.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base px-7 py-4 rounded-2xl shadow-[0_8px_24px_rgba(37,211,102,0.3)] transition-all group"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message us on WhatsApp
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-[#1F2937]/40 hover:text-[#0F4C5C] underline underline-offset-4 transition-colors relative z-10"
                >
                  Submit another application
                </button>
              </motion.div>
            ) : (
              /* ── FORM ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-[#1F2937] mb-3 font-serif">Teacher Application</h3>
                  <p className="text-[#1F2937]/60 text-base mb-10 font-medium">Submit your initial details. Our recruitment team will contact you on WhatsApp.</p>
                  
                  <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Full Name</label>
                      <input required name="name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="Enter your full name" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">WhatsApp Number</label>
                        <input required name="phone" type="tel" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="+91" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Gender</label>
                        <select required name="gender" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all appearance-none cursor-pointer">
                          <option value="">Select...</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Highest Qualification</label>
                      <input required name="qualification" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. B.Tech from NIT Patna" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Subjects you can teach</label>
                      <input required name="subjects" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. Physics for JEE, Class 10 Maths" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Current Location (in Patna)</label>
                      <input required name="location" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. Rajendra Nagar" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[#0F4C5C] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#0a3845] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(15,76,92,0.3)] transition-all flex items-center justify-center gap-3 group"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <a href="https://wa.me/919229738307" target="_blank" rel="noopener noreferrer" className="flex-1">
                        <button type="button" className="w-full h-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all flex items-center justify-center gap-3 group">
                          WhatsApp Us <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </a>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
