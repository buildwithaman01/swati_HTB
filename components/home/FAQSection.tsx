"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do you verify your home tutors in Patna?",
    answer: "Every educator completes our strict 4-Pillar Trust Standard: physical Aadhaar KYC verification, verified educational degree checks (IIT/NIT/B.Ed/post-graduate), past teaching track record review, and police clearance declaration before any home visit."
  },
  {
    question: "Do you provide dedicated female home tutors for girls?",
    answer: "Yes, absolutely. We maintain a large roster of highly qualified, background-verified female tutors across Patna for female students and families who prefer female home mentors."
  },
  {
    question: "What happens if I'm not satisfied with the tutor?",
    answer: "We provide an ironclad 48-Hour Free Replacement Guarantee. If the teaching chemistry is not an ideal match after the free demo or anytime during the first month, our academic counselors assign an alternate verified tutor with zero extra fees."
  },
  {
    question: "Which areas in Patna do you cover?",
    answer: "We provide home tutors across 30+ major localities in Patna, including Boring Road, Kankarbagh, Patliputra Colony, Rajendra Nagar, Bailey Road, Danapur, Ashiana Nagar, Anisabad, and SK Puri."
  },
  {
    question: "Do you offer a free demo class before I commit?",
    answer: "Yes. Every student is entitled to a 100% free 1-hour in-home demo class. You can observe the educator's communication, patience, and subject clarity firsthand before finalizing tuition."
  },
  {
    question: "What are your tuition fees and payment terms?",
    answer: "Our fees are completely transparent with zero bureau registration charges. Monthly fees are calculated based on grade level (Class 1-8, 9-10, 11-12, or JEE/NEET) and weekly session frequency. Use our interactive fee estimator above for instant estimates."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section className="py-20 sm:py-28 bg-[#F9F8F5] relative border-b border-[#E8E6DF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005F56]/10 text-[#005F56] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Direct Parent Answers
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Patna's premier home tuition bureau.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border transition-all duration-200 ${isOpen
                    ? "bg-white border-[#0B192C] shadow-md"
                    : "bg-white border-[#E8E6DF] hover:border-[#0B192C]/40"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-display font-bold text-[#0B192C] text-base sm:text-lg leading-snug">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#0B192C] text-white" : "bg-[#F3F1EC] text-[#5A6578]"
                    }`}>
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[#5A6578] text-sm sm:text-base leading-relaxed border-t border-[#E8E6DF] pt-4 font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
