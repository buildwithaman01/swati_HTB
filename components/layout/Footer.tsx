import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0F4C5C] pt-24 pb-12 mt-auto text-[#FAF7F2]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-12">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <div className="relative w-20 h-20 overflow-hidden flex items-center justify-center bg-white rounded-2xl p-2">
                <Image 
                  src="/images/logo12.png" 
                  alt="Swati HTB Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-white text-3xl leading-none tracking-tight">
                  SWATI
                </span>
                <span className="text-[12px] text-[#D4A017] font-sans tracking-[0.2em] uppercase font-bold mt-1">
                  Home Tuition Bureau
                </span>
              </div>
            </Link>
            
            <p className="text-[#FAF7F2]/80 text-lg leading-relaxed mb-6 font-sans">
              Patna's premier home tuition bureau. We provide highly vetted, government ID-verified tutors for a personalized learning experience.
            </p>

            <div className="flex gap-4 mb-8">
              <a href="https://www.facebook.com/share/196uTsR7Rq/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#D4A017] hover:text-white transition-all text-white shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.instagram.com/swati.htb/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#D4A017] hover:text-white transition-all text-white shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://wa.me/919229738307" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#D4A017] hover:text-white transition-all text-white shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://share.google/XTLwHsungtjqoBaGj" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#D4A017] hover:text-white transition-all text-white shadow-sm">
                <MapPin className="w-5 h-5" />
              </a>
            </div>

            <Link href="/book-demo" className="group flex items-center justify-center gap-3 bg-[#D4A017] hover:bg-[#b58812] text-white px-8 py-3.5 rounded-full text-base font-bold transition-all shadow-[0_4px_14px_rgba(212,160,23,0.3)] hover:shadow-[0_6px_20px_rgba(212,160,23,0.4)] w-full sm:w-auto">
              Book Free Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="font-bold text-white text-lg mb-8 font-sans">Our Programs</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/programs/class-11-12-boards" className="group flex items-center gap-2 text-[15px] font-medium text-[#FAF7F2]/70 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" /> Class 11 & 12 Boards
                </Link>
              </li>
              <li>
                <Link href="/programs/jee-main-advanced" className="group flex items-center gap-2 text-[15px] font-medium text-[#FAF7F2]/70 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" /> JEE Main & Advanced
                </Link>
              </li>
              <li>
                <Link href="/programs/neet-medical" className="group flex items-center gap-2 text-[15px] font-medium text-[#FAF7F2]/70 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" /> NEET Medical Prep
                </Link>
              </li>
              <li>
                <Link href="/programs/class-9-10-foundation" className="group flex items-center gap-2 text-[15px] font-medium text-[#FAF7F2]/70 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#D4A017] opacity-0 group-hover:opacity-100 transition-opacity" /> Class 9 & 10 Foundation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-lg mb-8 font-sans">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/50 mb-1">Call Us</span>
                  <a href="tel:+919229738307" className="text-base font-bold text-white hover:text-[#D4A017] transition-colors">+91 92297 38307</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/50 mb-1">Head Office</span>
                  <span className="text-sm font-medium text-[#FAF7F2]/80 leading-relaxed">
                    Block A, Area B, 3rd Floor,<br />
                    Banke Bihari Kunj, Mithapur,<br />
                    Patna, Bihar 800001
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/50 mb-1">Email</span>
                  <a href="mailto:swatihometuitionbureau@gmail.com" className="text-sm font-medium text-[#FAF7F2]/80 hover:text-[#D4A017] transition-colors break-all">swatihometuitionbureau@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-[#FAF7F2]/50">
            © {new Date().getFullYear()} Swati Home Tuition Bureau. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm font-medium text-[#FAF7F2]/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm font-medium text-[#FAF7F2]/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
