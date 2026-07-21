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

export function DesktopHeader() {
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
    <header className="fixed inset-x-0 top-0 z-50 hidden items-center justify-between bg-black/80 px-[clamp(1.5rem,5vw,3rem)] py-[clamp(0.85rem,2vw,1.1rem)] backdrop-blur-sm md:flex">
      <a href="#home" className="pointer-events-auto">
        <KedantraLogo size="compact" />
      </a>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={(item as { href?: string }).href ?? `#${item.id}`}
              className="relative flex flex-col items-center group px-3 py-1"
            >
              <motion.div
                animate={{ scale: isActive ? 1.3 : 1 }}
                className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white relative z-10 transition-colors"
              >
                <Icon size={20} />
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -bottom-1 w-6 h-0.5 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="absolute bottom-full mb-2 px-2 py-1 text-[10px] rounded-md bg-gray-800 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
