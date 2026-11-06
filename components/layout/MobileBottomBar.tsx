"use client";

import Link from "next/link";
import { MessageCircle, Phone, Calendar } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CANONICAL_LINKS } from "@/lib/constants";

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
          <div className="bg-white/95 backdrop-blur-xl border-t border-[#E8E6DF] p-3 pb-safe-bottom flex items-center justify-around gap-2.5 shadow-[0_-10px_40px_rgba(0,0,0,0.12)]">

            <Link href="/book-demo" className="flex-1">
              <button className="w-full bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] py-3 rounded-xl font-extrabold text-sm border-b-[2px] border-[#B87C1C] flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:border-b-0 shadow-sm">
                <Calendar className="w-4 h-4" />
                Book Demo
              </button>
            </Link>

            <a href={CANONICAL_LINKS.whatsappWithText("Hi Swati HTB, I am looking for a home tutor in Patna")} target="_blank" rel="noopener noreferrer" className="flex-1">
              <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </a>

            <a href={`tel:${CANONICAL_LINKS.phone}`} className="w-[44px] h-[44px] bg-[#0B192C] text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform" title={`Call ${CANONICAL_LINKS.displayPhone}`}>
              <Phone className="w-4 h-4" />
            </a>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
