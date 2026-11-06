import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#07111E] pt-20 pb-12 mt-auto text-white border-t border-[#1E3E62]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-3.5 mb-6">
              <div className="relative w-14 h-14 overflow-hidden flex items-center justify-center bg-white rounded-xl p-1.5 shadow-sm">
                <Image
                  src="/images/logo12.png"
                  alt="Swati HTB Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-white text-2xl leading-none tracking-tight">
                  SWATI
                </span>
                <span className="text-[10px] text-[#E5A93C] font-sans tracking-[0.2em] uppercase font-bold mt-1">
                  Home Tuition Bureau
                </span>
              </div>
            </Link>

            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              Patna's premier home tuition bureau. We pair students with thoroughly verified, background-checked educators for measurable academic improvement across CBSE, ICSE, and Bihar Board.
            </p>

            <div className="flex gap-3 mb-6">
              <a href="https://wa.me/919229738307" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all text-white shadow-sm" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="tel:+919229738307" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#E5A93C] hover:text-[#0B192C] transition-all text-white shadow-sm" aria-label="Phone Call">
                <Phone className="w-5 h-5" />
              </a>
              <a href="https://share.google/XTLwHsungtjqoBaGj" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#E5A93C] hover:text-[#0B192C] transition-all text-white shadow-sm" aria-label="Google Maps Location">
                <MapPin className="w-5 h-5" />
              </a>
            </div>

            <Link href="/book-demo" className="inline-flex items-center justify-center gap-2 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] px-6 py-3 rounded-xl text-sm font-extrabold transition-all border-b-[2px] border-[#B87C1C] shadow-md hover:-translate-y-0.5 active:translate-y-0">
              Book Free In-Home Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-wide uppercase text-xs text-[#E5A93C]">
              Academic Programs
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/programs/class-11-12-boards" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> Class 11 &amp; 12 Boards
                </Link>
              </li>
              <li>
                <Link href="/programs/jee-main-advanced" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> JEE Main &amp; Advanced
                </Link>
              </li>
              <li>
                <Link href="/programs/neet-medical" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> NEET Medical Entrance
                </Link>
              </li>
              <li>
                <Link href="/programs/class-9-10-foundation" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> Class 9 &amp; 10 Foundation
                </Link>
              </li>
              <li>
                <Link href="/programs/class-1-to-8-all-subjects" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> Class 1 to 8 All Subjects
                </Link>
              </li>
              <li>
                <Link href="/areas" className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#E5A93C]" /> Service Areas in Patna
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="font-display font-bold text-white text-base mb-6 tracking-wide uppercase text-xs text-[#E5A93C]">
              Patna Bureau Office
            </h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5" />
                <span>
                  Block A, Area B, 3rd Floor,<br />
                  Banke Bihari Kunj, Mithapur,<br />
                  Patna, Bihar 800001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <a href="tel:+919229738307" className="font-bold hover:text-[#E5A93C] transition-colors">
                  +91 92297 38307
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E5A93C] shrink-0" />
                <a href="mailto:swatihometuitionbureau@gmail.com" className="hover:text-[#E5A93C] transition-colors break-all">
                  swatihometuitionbureau@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-white/50">
          <div>
            <p>© {new Date().getFullYear()} Swati Home Tuition Bureau. All rights reserved.</p>
            <p className="mt-1">
              Developed &amp; Maintained by{" "}
              <a
                href="https://pehchanly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E5A93C] transition-colors underline underline-offset-2"
              >
                Pehchanly Digital Solutions
              </a>
              {" "}·{" "}
              <a
                href="https://github.com/buildwithaman01"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E5A93C] transition-colors"
              >
                Aman Singh
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/join" className="hover:text-white transition-colors">Teacher Registration</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
