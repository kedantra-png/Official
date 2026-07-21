"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Home, Eye, Briefcase, Layers, Mail, MessageSquareQuote } from "lucide-react";
import { KedantraLogo } from "@/components/KedantraLogo";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "vision", icon: Eye, label: "Vision" },
  { id: "process", icon: Layers, label: "Process" },
  { id: "reviews", icon: MessageSquareQuote, label: "Reviews" },
  { id: "footer", icon: Mail, label: "Contact" },
];

export function MobileNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-black/80 px-[clamp(1rem,4vw,2rem)] py-[clamp(0.65rem,1.5vw,0.9rem)] backdrop-blur-sm md:hidden">
      <KedantraLogo size="compact" />

      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={(item as { href?: string }).href ?? `#${item.id}`}
              className="relative flex flex-col items-center group px-2 py-1"
            >
              <motion.div
                animate={{ scale: isActive ? 1.3 : 1 }}
                className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white relative z-10 transition-colors"
              >
                <Icon size={18} />
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -bottom-1 w-5 h-0.5 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
