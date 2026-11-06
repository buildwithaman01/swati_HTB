"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do you verify your home tutors in Patna?",
    answer: "Every tutor must visit our Mithapur office in person with their original Aadhaar card, local residence proof, and university degree marksheets. We also check their past teaching background before sending them for any home demo."
  },
  {
    question: "Can we request a female home tutor for our daughter?",
    answer: "Yes, absolutely. Many families in Patna prefer female educators for younger children and girl students. We have hundreds of experienced female tutors registered across Patna for CBSE, ICSE, and state boards."
  },
  {
    question: "What if my child is not comfortable with the tutor?",
    answer: "We provide a 48-hour tutor replacement guarantee. If after the free trial or anytime during the first month you feel the teaching style is not the right fit, we will connect you with an alternate verified tutor at no additional fee."
  },
  {
    question: "Which areas in Patna do you serve?",
    answer: "We cover all major residential neighborhoods in Patna including Boring Road, Kankarbagh, Patliputra Colony, Rajendra Nagar, Bailey Road, Danapur, Ashiana Nagar, Anisabad, SK Puri, Raja Bazar, and Gola Road."
  },
  {
    question: "Is the trial class completely free?",
    answer: "Yes, 100% free. The teacher visits your home for a 1-hour session. You can observe their communication, patience, and subject clarity firsthand before finalizing regular tuition."
  },
  {
    question: "How do tuition fee payments work?",
    answer: "There are no bureau registration charges or upfront deposits. Tuition fees are paid monthly based on the student's grade and weekly class frequency, with transparent rates agreed upon before classes begin."
  },
  {
    question: "How can parents track attendance and syllabus progress?",
    answer: "Parents can log in to our Student & Parent Portal to view monthly attendance records, test scores, and syllabus completion. Tutors also log topics covered after each class."
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B192C] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#5A6578] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Common questions from parents looking for home tutors in Patna.
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
