"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export type NavItem = {
  id: number;
  label: string;
  link?: string;
  subMenus?: {
    title: string;
    items: {
      label: string;
      description: string;
      icon: React.ElementType;
      link: string;
    }[];
  }[];
};

type Props = {
  navItems: NavItem[];
  scrolled: boolean;
};

export function DropdownNavigation({ navItems, scrolled }: Props) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);

  const handleHover = (menuLabel: string | null) => {
    setOpenMenu(menuLabel);
  };

  return (
    <div className="relative flex items-center justify-center">
      <ul className="relative flex items-center space-x-2">
        {navItems.map((navItem) => (
          <li
            key={navItem.label}
            className="relative"
            onMouseEnter={() => handleHover(navItem.label)}
            onMouseLeave={() => handleHover(null)}
          >
            {navItem.link ? (
              <Link
                href={navItem.link}
                className={`text-sm py-2 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center font-bold relative z-10 ${
                  scrolled ? "text-[#0F4C5C]/80 hover:text-[#0F4C5C]" : "text-white/90 hover:text-white"
                }`}
                onMouseEnter={() => setIsHover(navItem.id)}
                onMouseLeave={() => setIsHover(null)}
              >
                <span>{navItem.label}</span>
                {(isHover === navItem.id) && (
                  <motion.div
                    layoutId="hover-bg"
                    className={`absolute inset-0 size-full -z-10 ${scrolled ? 'bg-[#0F4C5C]/5' : 'bg-white/10'}`}
                    style={{ borderRadius: 99 }}
                  />
                )}
              </Link>
            ) : (
              <button
                className={`text-sm py-2 px-4 flex cursor-pointer group transition-colors duration-300 items-center justify-center gap-1 font-bold relative z-10 ${
                  scrolled ? "text-[#0F4C5C]/80 hover:text-[#0F4C5C]" : "text-white/90 hover:text-white"
                }`}
                onMouseEnter={() => setIsHover(navItem.id)}
                onMouseLeave={() => setIsHover(null)}
              >
                <span>{navItem.label}</span>
                {navItem.subMenus && (
                  <ChevronDown
                    className={`h-4 w-4 group-hover:rotate-180 duration-300 transition-transform
                      ${openMenu === navItem.label ? "rotate-180" : ""}`}
                  />
                )}
                {(isHover === navItem.id || openMenu === navItem.label) && (
                  <motion.div
                    layoutId="hover-bg"
                    className={`absolute inset-0 size-full -z-10 ${scrolled ? 'bg-[#0F4C5C]/5' : 'bg-white/10'}`}
                    style={{ borderRadius: 99 }}
                  />
                )}
              </button>
            )}

            <AnimatePresence>
              {openMenu === navItem.label && navItem.subMenus && (
                <div className="w-auto absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#FAF7F2] border border-[#0F4C5C]/10 p-6 w-max shadow-xl"
                    style={{ borderRadius: 16 }}
                    layoutId="menu"
                  >
                    <div className="w-fit shrink-0 flex space-x-10 overflow-hidden">
                      {navItem.subMenus.map((sub) => (
                        <motion.div layout className="w-full" key={sub.title}>
                          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#0F4C5C]/50">
                            {sub.title}
                          </h3>
                          <ul className="space-y-6">
                            {sub.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <li key={item.label}>
                                  <Link
                                    href={item.link}
                                    className="flex items-start space-x-4 group"
                                  >
                                    <div className="border border-[#0F4C5C]/10 bg-white text-[#0F4C5C] rounded-xl flex items-center justify-center size-10 shrink-0 group-hover:bg-[#0F4C5C] group-hover:text-white transition-all duration-300 shadow-sm">
                                      <Icon className="h-5 w-5 flex-none" />
                                    </div>
                                    <div className="leading-5 w-max flex flex-col justify-center">
                                      <p className="text-sm font-bold text-[#0F4C5C] shrink-0 group-hover:text-[#D4A017] transition-colors duration-300">
                                        {item.label}
                                      </p>
                                      <p className="text-xs text-[#0F4C5C]/60 shrink-0 mt-0.5">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}
