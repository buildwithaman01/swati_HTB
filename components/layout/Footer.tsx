import Link from "next/link";
import { ArrowRight, ChevronRight, Phone, Mail, MapPin, MessageCircle, ShieldCheck, GraduationCap, Users, Clock, Lock } from "lucide-react";
import Image from "next/image";
import { CANONICAL_LINKS, BUREAU_INFO } from "@/lib/constants";
import { GoogleGIcon, InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-[#07111E] text-white border-t-2 border-[#E5A93C] relative overflow-hidden">
      {/* Fine architectural dot grid */}
      <div className="absolute inset-0 bg-grid-dots-light opacity-15 pointer-events-none" />

      {/* Main Footer Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Identity (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <Link href="/" className="flex items-center gap-3.5 mb-5 group">
              <div className="relative w-12 h-12 overflow-hidden flex items-center justify-center bg-white rounded-xl p-1.5 shadow-md">
                <Image 
                  src="/images/logo12.png" 
                  alt="Swati Home Tuition Bureau Logo" 
                  fill 
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-white text-2xl tracking-tight leading-none">
                  SWATI
                </span>
                <span className="text-[10px] text-[#E5A93C] font-sans tracking-[0.22em] uppercase font-bold mt-1">
                  Home Tuition Bureau
                </span>
              </div>
            </Link>
            
            <p className="text-white/75 text-sm leading-relaxed mb-6 font-sans">
              Helping Patna parents connect with verified, qualified home tutors for over 6 years. We provide personalized teaching for CBSE, ICSE &amp; Bihar Board students, complete with monthly test tracking and a 48-hour replacement guarantee.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-5">
              <a
                href={CANONICAL_LINKS.whatsappWithText("Hi, I am looking for a home tutor in Patna")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 px-3.5 py-2 rounded-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Message on WhatsApp
              </a>
              <a
                href={`tel:${CANONICAL_LINKS.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3.5 py-2 rounded-lg transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5A93C]" /> Call 92297 38307
              </a>
            </div>

            {/* Social & Google Reviews Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <a
                href={CANONICAL_LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-[#E5A93C] border border-[#E5A93C]/40 px-3 py-1.5 rounded-lg transition-all"
                title="Rate Swati HTB on Google"
              >
                <GoogleGIcon className="w-3.5 h-3.5" />
                <span>4.9★ Google Reviews</span>
              </a>
              <a
                href={CANONICAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-pink-600/30 text-white hover:text-pink-300 border border-white/15 px-3 py-1.5 rounded-lg transition-all"
                title="Follow on Instagram @swati.htb"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@swati.htb</span>
              </a>
              <a
                href={CANONICAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-blue-600/30 text-white hover:text-blue-300 border border-white/15 px-3 py-1.5 rounded-lg transition-all"
                title="Follow on Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Office Hours: 8:00 AM – 9:00 PM (Monday to Sunday)</span>
            </div>
          </div>

          {/* Column 2: Academic Programs (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#E5A93C] mb-5">
              Classes &amp; Subjects
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/programs/class-11-12-boards" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>Class 11 &amp; 12 Boards (PCM / PCB)</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/jee-main-advanced" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>JEE Main &amp; Advanced Mentorship</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/neet-medical" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>NEET Medical Preparation</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/class-9-10-foundation" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>Class 9 &amp; 10 Board Foundation</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/class-1-to-8-all-subjects" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>Class 1 to 8 (All Subjects)</span>
                </Link>
              </li>
              <li>
                <Link href="/programs/commerce-11-12" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-[#E5A93C] group-hover:translate-x-0.5 transition-transform" />
                  <span>Commerce &amp; Accountancy</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/areas" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5A93C] hover:text-[#D49228] transition-colors uppercase tracking-wider">
                  <span>View All 80+ Patna Areas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Digital Access (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#E5A93C] mb-5">
              Online Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/teacher/login" className="flex items-center gap-1.5 font-semibold text-white/90 hover:text-[#E5A93C] transition-colors">
                  <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Teacher Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/portal/login" className="flex items-center gap-1.5 font-semibold text-white/90 hover:text-[#E5A93C] transition-colors">
                  <GraduationCap className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Student &amp; Parent Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/join" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span>Apply as a Home Tutor</span>
                </Link>
              </li>
              <li>
                <Link href="/safety" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span>Our Safety Checks</span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                  <span>Articles &amp; Tips</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Patna Office & Contact (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#E5A93C] mb-5">
              Patna Office
            </h4>
            <ul className="space-y-3.5 text-xs text-white/80 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Block A, Area B, 3rd Floor,<br />
                  Banke Bihari Kunj, Mithapur,<br />
                  Patna, Bihar 800001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <a href="tel:+919229738307" className="font-bold hover:text-[#E5A93C] transition-colors">
                  +91 92297 38307
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <a href="mailto:swatihometuitionbureau@gmail.com" className="hover:text-[#E5A93C] transition-colors break-all">
                  swatihometuitionbureau@gmail.com
                </a>
              </li>
            </ul>

            <Link
              href="/book-demo"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all border-b-[2px] border-[#B87C1C] shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Book a Free Demo Class
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

        </div>

        {/* Sub-Footer Line */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 text-center md:text-left">
          <div>
            <p>© {new Date().getFullYear()} Swati Home Tuition Bureau (Patna). All rights reserved.</p>
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
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
            <a
              href={CANONICAL_LINKS.googleReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E5A93C] transition-colors inline-flex items-center gap-1"
            >
              <GoogleGIcon className="w-3 h-3" />
              <span>Google Reviews (4.9★)</span>
            </a>
            <span>•</span>
            <a
              href={CANONICAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors inline-flex items-center gap-1"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <a
              href={CANONICAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
            >
              <FacebookIcon className="w-3 h-3" />
              <span>Facebook</span>
            </a>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#E5A93C]" /> Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
