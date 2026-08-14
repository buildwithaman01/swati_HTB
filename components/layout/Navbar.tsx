"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, BookOpen, Rocket, Activity, Library, Pencil, Info, Settings, MapPin } from "lucide-react";
import { DropdownNavigation, NavItem } from "@/components/ui/dropdown-navigation";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (latest > 250 && latest > previous && !mobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const NAV_ITEMS: NavItem[] = [
    {
      id: 1,
      label: "Find Tutor",
      link: "/find-tutor",
    },
    {
      id: 2,
      label: "Programs",
      subMenus: [
        {
          title: "Our Programs",
          items: [
            {
              label: "Class 11 & 12 Boards",
              description: "Physics, Chemistry, Math, Biology",
              icon: BookOpen,
              link: "/programs/class-11-12-boards"
            },
            {
              label: "Class 11 & 12 Commerce",
              description: "Accountancy, Economics, Business",
              icon: BookOpen,
              link: "/programs/commerce-11-12"
            },
            {
              label: "JEE Main & Advanced",
              description: "Engineering entrance preparation",
              icon: Rocket,
              link: "/programs/jee-main-advanced"
            },
            {
              label: "NEET Medical",
              description: "Medical entrance preparation",
              icon: Activity,
              link: "/programs/neet-medical"
            },
            {
              label: "Class 9 & 10 Foundation",
              description: "Build a strong academic base",
              icon: Library,
              link: "/programs/class-9-10-foundation"
            },
            {
              label: "Class 1 to 8",
              description: "All subjects home tuition",
              icon: Pencil,
              link: "/programs/class-1-to-8-all-subjects"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      label: "Company",
      subMenus: [
        {
          title: "About Us",
          items: [
            {
              label: "Our Story",
              description: "Why we started Swati",
              icon: Info,
              link: "/about"
            },
            {
              label: "How It Works",
              description: "Our simple 4-step process",
              icon: Settings,
              link: "/how-it-works"
            },
            {
              label: "Service Areas",
              description: "Where we provide tutors in Patna",
              icon: MapPin,
              link: "/areas"
            }
          ]
        }
      ]
    },
    {
      id: 4,
      label: "Blogs",
      link: "/blogs",
    }
  ];

  const programLinks = [
    { name: "Class 11 & 12 Boards", href: "/programs/class-11-12-boards" },
    { name: "JEE Main & Advanced", href: "/programs/jee-main-advanced" },
    { name: "NEET Medical", href: "/programs/neet-medical" },
    { name: "Class 9 & 10 Foundation", href: "/programs/class-9-10-foundation" },
    { name: "Class 1 to 8", href: "/programs/class-1-to-8-all-subjects" },
  ];


  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed inset-x-0 z-[60] transition-all duration-300 ${
          scrolled 
            ? "top-0 bg-[#FAF7F2] shadow-[0_2px_10px_rgb(0,0,0,0.03)] border-b border-neutral-200/50" 
            : "top-0 bg-transparent"
        }`}
      >
        <div className={`${scrolled ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-16" : "h-24"}`}>
            
            {/* Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-4 group">
              <motion.div 
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  scrolled ? "w-[64px] h-[64px]" : "w-[96px] h-[96px]"
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
              >
                <Image 
                  src="/images/logo12.png" 
                  alt="Swati Home Tuition Bureau Logo" 
                  fill 
                  className="object-contain" 
                  priority
                />
              </motion.div>
              
              <div className="flex flex-col justify-center">
                <span 
                  className={`font-serif font-bold leading-none tracking-tight transition-all duration-300 ${
                    scrolled ? "text-[#0F4C5C] text-[24px]" : "text-white text-[32px] md:text-[36px]"
                  }`}
                >
                  SWATI
                </span>
                <span className={`font-serif font-bold uppercase tracking-widest leading-tight transition-all duration-300 ${
                  scrolled ? "text-[#4B5563] text-[10px]" : "text-white/80 text-[11px] md:text-[12px]"
                }`}>
                  Home Tuition Bureau
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center">
              <DropdownNavigation navItems={NAV_ITEMS} scrolled={scrolled} />
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/join" className={`text-sm font-bold transition-colors ${scrolled ? 'text-[#0F4C5C]/70 hover:text-[#0F4C5C]' : 'text-white/80 hover:text-white'}`}>
                Become a Tutor
              </Link>
              
              <Link href="/book-demo">
                <button
                  className="px-8 py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 bg-[#0F4C5C] hover:bg-[#0a3845] text-white shadow-[0_4px_14px_rgba(15,76,92,0.3)] hover:shadow-[0_6px_20px_rgba(15,76,92,0.4)]"
                >
                  Book Free Demo
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-full transition-colors ${scrolled ? 'text-[#1F2937] hover:bg-neutral-100' : 'text-white hover:bg-white/10'}`}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F4C5C]/20 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-end border-b border-neutral-100">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-[#1F2937]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {NAV_ITEMS.map((item) => (
                    item.link && (
                      <Link 
                        key={item.label} 
                        href={item.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-bold text-[#1F2937] hover:text-[#D4A017] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                  <Link 
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-[#1F2937] hover:text-[#D4A017] transition-colors"
                  >
                    Our Story
                  </Link>
                  <Link 
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-[#1F2937] hover:text-[#D4A017] transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/areas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-[#1F2937] hover:text-[#D4A017] transition-colors"
                  >
                    Service Areas
                  </Link>
                </div>

                <div className="h-px bg-neutral-200"></div>
                
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Programs</h4>
                  {programLinks.map((prog) => (
                    <Link 
                      key={prog.name} 
                      href={prog.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-[#4B5563] hover:text-[#0F4C5C] transition-colors"
                    >
                      {prog.name}
                    </Link>
                  ))}
                </div>

              </div>

              <div className="p-6 border-t border-neutral-100 bg-[#FAF7F2] space-y-4">
                <Link href="/join" className="block w-full text-center py-4 text-[#0F4C5C] font-bold rounded-2xl border-2 border-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white transition-all">
                  Become a Tutor
                </Link>
                <Link href="/book-demo" className="block w-full text-center py-4 bg-[#0F4C5C] text-white font-bold rounded-2xl hover:bg-[#0a3845] transition-all shadow-lg shadow-[#0F4C5C]/20">
                  Book Free Demo
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
