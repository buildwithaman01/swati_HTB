"use client";

import Link from "next/link";
import { MessageCircle, Phone, Calendar } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MobileBottomBar() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Hide bar when scrolling down significantly, show when scrolling up
    if (latest > previous && latest > 200) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden"
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-neutral-200/60 p-3 pb-safe-bottom flex items-center justify-around gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            
            <Link href="/book-demo" className="flex-1">
              <button className="w-full bg-[#0F4C5C] hover:bg-[#0a3845] text-white py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-95">
                <Calendar className="w-4 h-4" />
                Book Demo
              </button>
            </Link>
            
            <a href="https://wa.me/919229738307" target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors active:scale-95">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </a>

            <a href="tel:+919229738307" className="w-[48px] h-[48px] bg-[#FAF7F2] border border-[#0F4C5C]/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform text-[#0F4C5C]">
              <Phone className="w-5 h-5" />
            </a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
