"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Eye, Briefcase, Layers, Mail, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* Floating Tooltip Pill */}
      <AnimatePresence>
        {activeIndex !== null && items[activeIndex] && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" as const }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 pointer-events-none z-50"
          >
            <div className="px-3.5 py-1.2 rounded-full bg-black/90 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] backdrop-blur-xl flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                {items[activeIndex].label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dock Container */}
      <div className="relative p-1.5 flex items-center justify-center gap-1 rounded-full bg-black/85 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 hover:border-cyan-500/35 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]">
        {items.map((item, index) => {
          const isActive = index === scrollActiveIndex;
          const isHovered = hoverIndex === index;

          return (
            <a
              key={index}
              href={item.href ?? `#${item.label.toLowerCase()}`}
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
  { icon: Layers, label: "Process" },
  { icon: MessageSquareQuote, label: "Reviews" },
  { icon: Mail, label: "Contact", href: "#footer" },
];

const sectionIds = navItems.filter((item) => !item.href).map((item) => item.label.toLowerCase());

export function SiteNav() {
  const [scrollActiveIndex, setScrollActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const vh = () => window.innerHeight;

    const update = () => {
      const footerEl = document.getElementById("footer");

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const topThreshold = vh() * 0.3;
        const bottomThreshold = vh() * 0.7;
        if (rect.top <= bottomThreshold && rect.bottom >= topThreshold) {
          const idx = sectionIds.indexOf(id);
          if (idx === sectionIds.length - 1 && footerEl) {
            const fRect = footerEl.getBoundingClientRect();
            if (fRect.top < vh() && fRect.bottom > 0) {
              setScrollActiveIndex(-1);
              return;
            }
          }
          setScrollActiveIndex(idx);
          return;
        }
      }

      if (footerEl) {
        const fRect = footerEl.getBoundingClientRect();
        if (fRect.top < vh() && fRect.bottom > 0) {
          setScrollActiveIndex(-1);
        }
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 min-[500px]:left-auto min-[500px]:-translate-x-0 min-[500px]:right-6 z-50">
      <MenuBar items={navItems} scrollActiveIndex={scrollActiveIndex} className="w-auto" />
    </div>
  );
}
