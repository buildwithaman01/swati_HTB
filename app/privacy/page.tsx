"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#0F4C5C] font-bold mb-8 hover:underline">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 font-serif">
            Privacy Policy
          </h1>
          <div className="prose prose-lg text-[#1F2937]/80">
            <p><strong>Last Updated: August 2026</strong></p>
            <p>At Swati Home Tuition Bureau, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as your name, contact details, location, and educational requirements when you fill out our forms or contact us.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">2. How We Use Your Information</h3>
            <p>We use the information we collect to connect you with suitable tutors, respond to your inquiries, improve our services, and communicate with you about our offerings.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">3. Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">4. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:swatihometuitionbureau@gmail.com" className="text-[#D4A017] font-bold hover:underline">swatihometuitionbureau@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
