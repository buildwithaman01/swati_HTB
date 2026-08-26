"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle2, GraduationCap, MessageCircle, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookDemoPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current!;
    const data = {
      formType: "book-demo",
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      studentClass: (form.elements.namedItem("studentClass") as HTMLSelectElement)?.value,
      subjects: (form.elements.namedItem("subjects") as HTMLInputElement)?.value,
      address: (form.elements.namedItem("address") as HTMLTextAreaElement)?.value,
    };

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        setWhatsappUrl(json.whatsappUrl || "");
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please WhatsApp us directly.");
      }
    } catch {
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
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#D4A017] blur-[150px] rounded-full mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
              <GraduationCap className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Book your <span className="text-[#D4A017] italic">Free</span> Demo.
            </h1>
            <p className="text-lg md:text-2xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium px-4 md:px-0">
              Experience the quality of our tutors with zero obligation. Fill the form below, and our academic counselor will contact you within 2 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl py-16 relative z-20">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          
          {/* Form Section — toggles to success card on submit */}
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── SUCCESS CARD ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="md:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden flex flex-col items-center text-center"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Big tick */}
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mb-6 relative z-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>

                <h3 className="text-3xl font-bold text-[#1F2937] mb-3 font-serif relative z-10">
                  Request Received! 🎉
                </h3>
                <p className="text-[#1F2937]/60 text-lg leading-relaxed max-w-md relative z-10">
                  Thank you! Our academic counselor will call you on your WhatsApp number within <strong>2 hours</strong>.
                </p>

                {/* Divider */}
                <div className="w-full border-t border-neutral-100 my-8 relative z-10" />

                {/* WhatsApp CTA — user's CHOICE, not auto-open */}
                <div className="relative z-10 w-full bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-6">
                  <p className="text-sm font-semibold text-emerald-800 mb-1">
                    Want a faster reply?
                  </p>
                  <p className="text-sm text-emerald-700 mb-4">
                    If you can't wait, click below to message us directly on WhatsApp — we usually reply within minutes.
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
                  Submit another request
                </button>
              </motion.div>
            ) : (
              /* ── FORM ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <h3 className="text-3xl font-bold text-[#1F2937] mb-8 font-serif relative z-10">Student Details</h3>
                
                <form ref={formRef} className="space-y-6 relative z-10" onSubmit={handleSubmit}>
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
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Student&apos;s Class</label>
                      <select required name="studentClass" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all appearance-none cursor-pointer">
                        <option value="">Select class...</option>
                        <option value="11-12">Class 11-12</option>
                        <option value="9-10">Class 9-10</option>
                        <option value="1-8">Class 1-8</option>
                        <option value="jee">JEE / NEET Preparation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Specific Subjects (Optional)</label>
                      <input name="subjects" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30" placeholder="e.g. Only Physics & Maths" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wide text-[#1F2937]/70 uppercase">Full Address in Patna</label>
                    <textarea required name="address" rows={3} className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-2xl px-5 py-4 text-[#1F2937] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all placeholder:text-[#1F2937]/30 resize-none" placeholder="House No, Street, Landmark, Area"></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0F4C5C] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#0a3845] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(15,76,92,0.3)] transition-all mt-6 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        Request Demo Class <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-6 text-sm font-medium text-[#1F2937]/60">
                    <CheckCircle2 className="w-5 h-5 text-[#D4A017]" />
                    Your data is secure and will never be shared.
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Contact Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 space-y-6"
          >
            
            <div className="bg-[#0F4C5C] text-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,76,92,0.2)] relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#D4A017] blur-[80px] rounded-full mix-blend-overlay opacity-50"></div>
              
              <h3 className="text-2xl font-bold mb-8 font-serif relative z-10">Contact Us Directly</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl flex-shrink-0 border border-white/10">
                    <Phone className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Call or WhatsApp</p>
                    <p className="font-bold text-lg">+91 92297 38307</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl flex-shrink-0 border border-white/10">
                    <Mail className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Email Support</p>
                    <p className="font-bold text-lg break-all">swatihometuitionbureau@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl flex-shrink-0 border border-white/10">
                    <Clock className="w-6 h-6 text-[#D4A017]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">Working Hours</p>
                    <p className="font-bold text-lg">Mon - Sun<br/>8:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_10px_40px_rgb(0,0,0,0.03)]">
              <h3 className="text-2xl font-bold text-[#1F2937] mb-6 font-serif">Head Office</h3>
              <div className="flex items-start gap-4 text-[#1F2937]/70">
                <div className="p-3 bg-[#FAF7F2] rounded-2xl flex-shrink-0 border border-neutral-200/60">
                  <MapPin className="w-6 h-6 text-[#0F4C5C]" />
                </div>
                <p className="text-base font-medium leading-relaxed">
                  <span className="font-bold text-[#1F2937]">Swati Home Tuition Bureau</span><br />
                  Block A, Area B, 3rd Floor, Banke Bihari Kunj,<br />
                  Mithapur, Patna, Bihar 800001
                </p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
