"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Eye, Cpu, Mail, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { lenisRef } from "@/lib/lenis";

export interface MenuBarItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuBarItem[];
  scrollActiveIndex?: number;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 450,
  damping: 30,
};

export function MenuBar({ items, scrollActiveIndex = -1, className, ...props }: MenuBarProps) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const activeIndex = hoverIndex !== null ? hoverIndex : scrollActiveIndex >= 0 ? scrollActiveIndex : null;

  return (
    <div className={cn("relative select-none", className)} {...props}>
      {/* Main Dock Container */}
      <div className="relative p-1.5 flex items-center justify-center gap-1 rounded-full bg-black/85 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 hover:border-cyan-500/35 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]">
        {items.map((item, index) => {
          const isActive = index === scrollActiveIndex;
          const isHovered = hoverIndex === index;
          const targetHref = item.href ?? `#${item.label.toLowerCase()}`;
          const showTooltip = index === activeIndex;

          return (
            <a
              key={index}
              href={targetHref}
              onClick={(e) => {
                if (targetHref.startsWith("#")) {
                  e.preventDefault();
                  const targetId = targetHref.replace("#", "");
                  const el = document.getElementById(targetId);
                  if (el) {
                    if (lenisRef.current) {
                      lenisRef.current.scrollTo(el);
                    } else {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }
              }}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Magnetic Sliding Active/Hover Pill Highlight */}
              {(isHovered || (hoverIndex === null && isActive)) && (
                <motion.div
                  layoutId="menuNavPill"
                  transition={springConfig}
                  className={cn(
                    "absolute inset-0 rounded-full z-0",
                    isHovered
                      ? "bg-gradient-to-tr from-cyan-500/25 via-blue-500/20 to-purple-500/25 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-white/15 border border-white/20"
                  )}
                />
              )}

              {/* Animated Icon */}
              <motion.div
                whileHover={{ scale: 1.25, rotate: [0, -6, 6, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "relative z-10 flex items-center justify-center w-5 h-5 transition-all duration-200",
                  isHovered || isActive ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-white/60"
                )}
              >
                <item.icon className="w-full h-full" />
              </motion.div>

              <span className="sr-only">{item.label}</span>

              {/* Pinpoint Tooltip Card pointing to the selected icon */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full max-[675px]:top-auto max-[675px]:bottom-full mt-3.5 max-[675px]:mt-0 max-[675px]:mb-3.5 pointer-events-none z-50 flex flex-col max-[675px]:flex-col-reverse items-center"
                  >
                    {/* Pinpoint Triangle pointing up/down */}
                    <div className="w-2 h-2 rotate-45 bg-[#0a0a0a] border-l border-t border-cyan-500/35 -mb-1 max-[675px]:mb-0 max-[675px]:-mt-1 max-[675px]:border-l-0 max-[675px]:border-t-0 max-[675px]:border-r max-[675px]:border-b z-10" />

                    {/* Tooltip Card */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#0a0a0a]/95 border border-cyan-500/35 shadow-[0_4px_20px_rgba(6,182,212,0.3),0_0_12px_rgba(255,255,255,0.01)_inset] backdrop-blur-xl flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase leading-none">
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </div>
    </div>
  );
}

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Eye, label: "Vision" },
  { icon: Cpu, label: "Services", href: "#capabilities" },
  { icon: MessageSquareQuote, label: "Reviews" },
  { icon: Mail, label: "Contact", href: "#footer" },
];

const sectionIds = navItems.map((item) => {
  if (item.href) return item.href.replace("#", "");
  return item.label.toLowerCase();
});

export function SiteNav() {
  const [scrollActiveIndex, setScrollActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) {
              setScrollActiveIndex(idx);
            }
          }
        });
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((el) => observer.observe(el));

    // Force Home active at the top, and Contact (footer) active at the absolute bottom
    const handleScroll = () => {
      const vh = window.innerHeight;
      const sh = document.documentElement.scrollHeight;
      const sy = window.scrollY;
      if (sy <= 50) {
        setScrollActiveIndex(0);
        return;
      }
      if (vh + sy >= sh - 150) {
        setScrollActiveIndex(sectionIds.length - 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 right-4 sm:right-6 md:right-8 h-[70px] flex items-center z-50 max-[675px]:top-auto max-[675px]:bottom-6 max-[675px]:left-1/2 max-[675px]:-translate-x-1/2 max-[675px]:right-auto max-[675px]:h-auto">
      <MenuBar items={navItems} scrollActiveIndex={scrollActiveIndex} className="w-auto" />
    </div>
  );
}
