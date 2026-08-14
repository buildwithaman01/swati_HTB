"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do you verify your home tutors in Patna?",
    answer: "We enforce an 8-Step Safety Shield. This includes Aadhar verification, face-match visits, subject pre-testing, and local reference checks before any tutor is sent to your home."
  },
  {
    question: "Do you provide female home tutors for girls?",
    answer: "Yes, we have a strict Female-First Policy. By default, we prioritize matching female students with highly qualified female educators to ensure maximum comfort and safety."
  },
  {
    question: "What happens if I'm not satisfied with the tutor?",
    answer: "We offer a 48-Hour Replacement Guarantee. If you are not completely satisfied with the teaching style or progress, we will arrange a new tutor with zero questions asked."
  },
  {
    question: "Which areas in Patna do you cover?",
    answer: "We cover 86+ localities in Patna, including major areas like Boring Road, Kankarbagh, Patliputra Colony, Rajendra Nagar, Bailey Road, and Danapur."
  },
  {
    question: "Do you offer demo classes before I commit?",
    answer: "Absolutely! We provide a free demo class so you can observe the tutor's teaching methodology and ensure they are the right fit for your child's academic needs."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 bg-white relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-3">Questions & Answers</h2>
          <h3 className="font-serif text-4xl font-bold text-[#0F4C5C] mb-4">Frequently Asked Questions</h3>
          <p className="text-[#64748B] text-lg">Everything you need to know about Patna's most trusted home tuition bureau.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-neutral-200 rounded-2xl overflow-hidden bg-[#FAFAF8] shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none hover:bg-white transition-colors"
              >
                <span className="font-bold text-[#1F2937] text-lg">{faq.question}</span>
                <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#D4A017]' : 'text-[#64748B]'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[#64748B] text-base border-t border-neutral-100 pt-4 bg-white">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
