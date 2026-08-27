"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#0F4C5C] font-bold mb-8 hover:underline">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-neutral-200/60 shadow-[0_20px_60px_rgb(0,0,0,0.05)]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8 font-serif">
            Terms of Service
          </h1>
          <div className="prose prose-lg text-[#1F2937]/80">
            <p><strong>Last Updated: August 2026</strong></p>
            <p>Welcome to Swati Home Tuition Bureau. By accessing or using our website and services, you agree to be bound by these Terms of Service.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">1. Use of Services</h3>
            <p>Our services are designed to connect students with qualified home tutors. You agree to use our services only for lawful purposes and in accordance with these terms.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">2. Tutor Verification</h3>
            <p>While we rigorously verify our tutors' identities and qualifications, parents/guardians are ultimately responsible for the safety and supervision of their children during tutoring sessions.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">3. Fees and Payments</h3>
            <p>Tuition fees are determined based on the class, subject, and tutor qualifications. Payment terms will be discussed and agreed upon prior to commencing regular classes.</p>
            
            <h3 className="text-2xl font-bold text-[#0F4C5C] mt-8 mb-4">4. Modifications</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of our services following any changes constitutes acceptance of the new terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
