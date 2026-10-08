"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { 
  Shield, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  UserPlus, 
  MessageCircle,
  FileText,
  UploadCloud,
  Check,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, title: "Personal Details", icon: UserPlus },
  { id: 2, title: "Professional Profile", icon: BookOpen },
  { id: 3, title: "Verification & KYC", icon: Shield }
];

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-scroll to top when step changes
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) {
      handleNext();
      return;
    }

    setLoading(true);
    const form = formRef.current!;
    const formData = new FormData(form);
    formData.append("formType", "join-tutor-wizard");

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        // Do not set Content-Type, fetch will set it to multipart/form-data with the boundary
        body: formData,
      });

      const result = await res.json();
      
      if (result.success && result.whatsappUrl) {
        setWhatsappUrl(result.whatsappUrl);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <GraduationCap className="w-8 h-8 text-[#D4A017]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 font-serif leading-[1.1]">
              Become a Verified <br />
              <span className="text-[#D4A017] italic">Swati Home Tutor</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 tracking-tight leading-relaxed max-w-2xl mx-auto font-medium">
              Join Patna's most premium home tuition network. Earn premium fees, get guaranteed students, and build your reputation.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-12 relative z-20 -mt-20">
        
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── SUCCESS CARD ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-neutral-200/60 shadow-2xl relative overflow-hidden flex flex-col items-center text-center mx-auto max-w-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAF7F2] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mb-6 relative z-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>

              <h3 className="text-3xl font-bold text-[#1F2937] mb-3 font-serif relative z-10">
                Application Submitted! 🎉
              </h3>
              <p className="text-[#1F2937]/60 text-lg leading-relaxed max-w-sm relative z-10">
                Thank you! Our team will verify your KYC documents and run background checks. We will contact you within <strong>24-48 hours</strong>.
              </p>

              <div className="w-full border-t border-neutral-100 my-8 relative z-10" />

              <div className="relative z-10 w-full bg-[#f0fdf4] border border-emerald-200 rounded-2xl p-6">
                <p className="text-sm font-semibold text-emerald-800 mb-1">Want to connect faster?</p>
                <p className="text-sm text-emerald-700 mb-4">
                  Message us on WhatsApp to speed up your verification process.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base px-7 py-4 rounded-2xl shadow-[0_8px_24px_rgba(37,211,102,0.3)] transition-all group"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message us on WhatsApp
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ) : (
            /* ── WIZARD FORM ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-neutral-200/60 shadow-2xl overflow-hidden"
            >
              {/* Progress Header */}
              <div className="bg-[#FAF7F2] p-6 md:px-12 md:py-8 border-b border-neutral-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    {steps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                          currentStep >= step.id 
                            ? "bg-[#0F4C5C] text-white shadow-md" 
                            : "bg-white text-[#1F2937]/30 border border-neutral-200"
                        }`}>
                          {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                        </div>
                        <span className={`text-xs md:text-sm font-semibold text-center ${
                          currentStep >= step.id ? "text-[#0F4C5C]" : "text-[#1F2937]/40"
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Progress Line */}
                  <div className="relative mt-[-2.75rem] mx-auto w-[66%] h-1 bg-neutral-200 rounded-full z-0">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#0F4C5C] rounded-full transition-all duration-500 ease-out"
                      style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-12">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* STEP 1: PERSONAL DETAILS */}
                  <div className={currentStep === 1 ? "block" : "hidden"}>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1F2937]">Personal Details</h2>
                      <p className="text-[#1F2937]/60 mt-2">Let's start with your basic contact information.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Full Name *</label>
                        <input required={currentStep === 1} name="name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="Enter your full name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Date of Birth *</label>
                        <input required={currentStep === 1} name="dob" type="date" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Gender *</label>
                        <select required={currentStep === 1} name="gender" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all">
                          <option value="">Select gender...</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Father / Husband Name *</label>
                        <input required={currentStep === 1} name="guardian_name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="Enter name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">WhatsApp Number *</label>
                        <input required={currentStep === 1} name="whatsapp" type="tel" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="+91" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Email Address *</label>
                        <input required={currentStep === 1} name="email" type="email" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Current Address in Patna *</label>
                        <textarea required={currentStep === 1} name="current_address" rows={2} className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="Full local address..."></textarea>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: PROFESSIONAL PROFILE */}
                  <div className={currentStep === 2 ? "block" : "hidden"}>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1F2937]">Professional Profile</h2>
                      <p className="text-[#1F2937]/60 mt-2">Tell us about your teaching experience and expertise.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Highest Qualification *</label>
                        <select required={currentStep === 2} name="qualification" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all">
                          <option value="">Select...</option>
                          <option value="BA/BSc/BCom">BA / BSc / BCom</option>
                          <option value="MA/MSc/MCom">MA / MSc / MCom</option>
                          <option value="BTech/BE">B.Tech / B.E</option>
                          <option value="BEd/MEd">B.Ed / M.Ed</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">College / University Name *</label>
                        <input required={currentStep === 2} name="college" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="e.g. Patna University" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Subjects You Can Teach *</label>
                        <input required={currentStep === 2} name="subjects" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="e.g. Maths, Science, Physics" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Classes You Can Teach *</label>
                        <input required={currentStep === 2} name="classes" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="e.g. Class 1-8, JEE, NEET" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Teaching Experience (Years) *</label>
                        <input required={currentStep === 2} name="experience" type="number" min="0" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Preferred Mode *</label>
                        <select required={currentStep === 2} name="mode" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all">
                          <option value="">Select...</option>
                          <option value="Home Visit">Home Visit Only</option>
                          <option value="Online">Online Only</option>
                          <option value="Both">Both (Home & Online)</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Areas in Patna (Serviceable) *</label>
                        <input required={currentStep === 2} name="areas" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="e.g. Boring Road, Kankarbagh, Bailey Road" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase flex items-center gap-2">
                          <Video className="w-4 h-4" /> Demo Video Link (Highly Recommended)
                        </label>
                        <input name="video_url" type="url" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="Paste YouTube or Google Drive link..." />
                        <p className="text-xs text-[#1F2937]/50 mt-1">Tutors with demo videos are verified and assigned students 3x faster.</p>
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: VERIFICATION & KYC */}
                  <div className={currentStep === 3 ? "block" : "hidden"}>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1F2937]">Verification & KYC</h2>
                      <p className="text-[#1F2937]/60 mt-2">Swati HTB is a premium agency. We require strict ID verification to ensure student safety.</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex gap-4 items-start">
                      <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900">Why do we need this?</h4>
                        <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                          Your Aadhaar and ID documents are stored in a highly secure, private vault. They are never shared publicly. We only use them to perform a background check before sending you to a student's home.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1F2937] border-b pb-2">1. Identity Verification</h4>
                        <div className="space-y-2">
                          <label className="text-xs font-bold tracking-wider text-[#1F2937]/70 uppercase">Aadhaar Number *</label>
                          <input required={currentStep === 3} name="aadhaar_number" type="text" maxLength={12} className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-[#1F2937] tracking-widest font-mono focus:ring-2 focus:ring-[#0F4C5C]/20 focus:border-[#0F4C5C] transition-all" placeholder="XXXX XXXX XXXX" />
                        </div>
                        {/* File Upload UI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:bg-neutral-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                            <UploadCloud className="w-8 h-8 mx-auto text-[#0F4C5C] mb-2" />
                            <p className="text-sm font-bold text-[#1F2937]">Upload Aadhaar Front *</p>
                            <p className="text-xs text-neutral-500 mt-1">JPEG/PNG max 5MB</p>
                            <input required={currentStep === 3} type="file" name="aadhaar_front" accept="image/*" className="mt-4 text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0F4C5C]/10 file:text-[#0F4C5C] hover:file:bg-[#0F4C5C]/20 w-full" />
                          </label>
                          <label className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:bg-neutral-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                            <UploadCloud className="w-8 h-8 mx-auto text-[#0F4C5C] mb-2" />
                            <p className="text-sm font-bold text-[#1F2937]">Upload Aadhaar Back *</p>
                            <p className="text-xs text-neutral-500 mt-1">JPEG/PNG max 5MB</p>
                            <input required={currentStep === 3} type="file" name="aadhaar_back" accept="image/*" className="mt-4 text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#0F4C5C]/10 file:text-[#0F4C5C] hover:file:bg-[#0F4C5C]/20 w-full" />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1F2937] border-b pb-2">2. Local References</h4>
                        <p className="text-xs text-neutral-500 mb-3">Please provide 2 local references in Patna (Not immediate family).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required={currentStep === 3} name="ref1_name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-sm" placeholder="Reference 1 Name" />
                          <input required={currentStep === 3} name="ref1_phone" type="tel" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-sm" placeholder="Reference 1 Phone" />
                          <input required={currentStep === 3} name="ref2_name" type="text" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-sm" placeholder="Reference 2 Name" />
                          <input required={currentStep === 3} name="ref2_phone" type="tel" className="w-full bg-[#FAF7F2]/50 border border-neutral-200/60 rounded-xl px-4 py-3 text-sm" placeholder="Reference 2 Phone" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1F2937] border-b pb-2">3. Bureau Agreements</h4>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input required={currentStep === 3} type="checkbox" name="agreement_1" className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0F4C5C] focus:ring-[#0F4C5C]" />
                          <span className="text-sm text-[#1F2937] leading-snug group-hover:text-black">
                            <strong>Strict Anti-Bypass Policy:</strong> I agree that all financial transactions with parents will be routed through Swati HTB. I understand that accepting direct payment from a parent will result in immediate termination and blacklisting.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input required={currentStep === 3} type="checkbox" name="agreement_2" className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0F4C5C] focus:ring-[#0F4C5C]" />
                          <span className="text-sm text-[#1F2937] leading-snug group-hover:text-black">
                            I confirm that all information provided is true. I understand my profile will undergo background verification before I am assigned any students.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-8 border-t border-neutral-100">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-4 rounded-xl font-bold text-[#1F2937]/70 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" /> Back
                      </button>
                    ) : (
                      <div></div> // empty div for flex spacing
                    )}

                    <button
                      type={currentStep === 3 ? "submit" : "button"}
                      onClick={currentStep !== 3 ? handleNext : undefined}
                      disabled={loading}
                      className="px-8 py-4 rounded-xl font-bold text-white bg-[#0F4C5C] hover:bg-[#0a3845] shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 transition-all group"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : currentStep === 3 ? (
                        <>Submit Application <Check className="w-5 h-5" /></>
                      ) : (
                        <>Continue to Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

