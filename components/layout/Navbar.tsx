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
        className={`fixed inset-x-0 z-[60] transition-all duration-300 ${scrolled
            ? "top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8E6DF]"
            : "top-0 bg-transparent"
          }`}
      >
        <div className={`${scrolled ? "px-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>

            {/* Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className={`relative flex items-center justify-center transition-all duration-300 ${scrolled ? "w-11 h-11" : "w-12 h-12"
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
                  className={`font-display font-extrabold leading-none tracking-tight transition-all duration-300 ${scrolled ? "text-[#0B192C] text-2xl" : "text-white text-2xl md:text-3xl"
                    }`}
                >
                  SWATI
                </span>
                <span className={`font-sans font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-tight transition-all duration-300 ${scrolled ? "text-[#5A6578]" : "text-white/80"
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
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/join" className={`text-sm font-bold transition-colors ${scrolled ? 'text-[#0B192C]/80 hover:text-[#0B192C]' : 'text-white/85 hover:text-white'}`}>
                Become a Tutor
              </Link>

              <Link href="/book-demo">
                <button
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all border-b-[2px] border-[#B87C1C] bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 cursor-pointer"
                >
                  Book Free Demo
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-xl transition-colors ${scrolled ? 'text-[#0B192C] hover:bg-neutral-100' : 'text-white hover:bg-white/10'}`}
              >
                <Menu className="w-6 h-6" />
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
              className="fixed inset-0 bg-[#0B192C]/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-5 flex justify-between items-center border-b border-[#E8E6DF]">
                <div className="font-display font-extrabold text-[#0B192C] text-lg">
                  SWATI <span className="text-[#E5A93C] text-xs font-sans tracking-wider uppercase font-semibold">Home Tuition</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1D20]" />
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
                        className="text-base font-bold text-[#1A1D20] hover:text-[#E5A93C] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-[#1A1D20] hover:text-[#E5A93C] transition-colors"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-[#1A1D20] hover:text-[#E5A93C] transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/areas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-[#1A1D20] hover:text-[#E5A93C] transition-colors"
                  >
                    Service Areas in Patna
                  </Link>
                </div>

                <div className="h-px bg-[#E8E6DF]"></div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A6578]">Academic Programs</h4>
                  {programLinks.map((prog) => (
                    <Link
                      key={prog.name}
                      href={prog.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-[#5A6578] hover:text-[#0B192C] transition-colors"
                    >
                      {prog.name}
                    </Link>
                  ))}
                </div>

              </div>

              <div className="p-5 border-t border-[#E8E6DF] bg-[#F9F8F5] space-y-3">
                <Link href="/join" className="block w-full text-center py-3 text-[#0B192C] font-bold text-sm rounded-xl border-2 border-[#0B192C] hover:bg-[#0B192C] hover:text-white transition-all">
                  Become a Tutor
                </Link>
                <Link href="/book-demo" className="block w-full text-center py-3 bg-[#E5A93C] hover:bg-[#D49228] text-[#0B192C] font-extrabold text-sm rounded-xl transition-all border-b-[2px] border-[#B87C1C] shadow-md">
                  Book Free In-Home Demo
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
