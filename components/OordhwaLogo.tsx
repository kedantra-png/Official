"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function OordhwaLogo() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  const logoContent = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Oordhwa Swastika+Arrow Icon */}
      <Image
        src="/oordhwa-icon.png"
        alt="Oordhwa Tech Solutions Logo"
        width={44}
        height={44}
        className="shrink-0 object-contain drop-shadow-[0_0_16px_rgba(6,182,212,0.55)]"
        priority
        unoptimized
      />

      {/* Brand Text — Perfectly Centered */}
      <div className="hidden sm:flex flex-col items-center justify-center text-center select-none leading-none">
        {/* Line 1: OORDHWA in Ethnocentric Font with Integrated SVG Letter A */}
        <span className="font-ethnocentric text-base sm:text-lg tracking-[0.14em] text-white leading-none text-center w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] flex items-center justify-center">
          OORDHW
          <span className="inline-flex items-center justify-center -ml-[0.03em] relative">
            <svg
              className="h-[11.5px] sm:h-[13.8px] w-auto shrink-0 translate-y-[0.5px] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              viewBox="0 0 20 18"
              fill="none"
            >
              {/* Outer White Stencil Legs of A */}
              <path
                d="M10 0L20 18H14.8L10 9.2L5.2 18H0L10 0Z"
                fill="white"
              />
              {/* Inner Glowing Blue Core In Lower Half Only */}
              <path
                d="M8.1 13.5H11.9L14.0 17.5H6.0L8.1 13.5Z"
                fill="url(#a-core-grad)"
              />
              <defs>
                <linearGradient id="a-core-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00d2ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </span>

        {/* Line 2: — TECH SOLUTIONS — (Centered Below Oordhwa) */}
        <div className="flex items-center justify-center gap-2 mt-1 w-full">
          {/* Left gradient line */}
          <span className="h-[1px] w-3.5 bg-gradient-to-r from-transparent to-[#06b6d4]" />

          {/* Gradient text */}
          <span className="font-sans font-extrabold text-[9.5px] tracking-[0.28em] uppercase leading-none bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent">
            Tech Solutions
          </span>

          {/* Right gradient line */}
          <span className="h-[1px] w-3.5 bg-gradient-to-r from-[#a855f7] to-transparent" />
        </div>

        {/* Line 3: ELEVATE • EVOLVE • EXCEL */}
        <div className="flex items-center justify-center gap-1 font-sans text-[6.5px] font-bold tracking-[0.35em] text-white/60 mt-1 uppercase leading-none w-full">
          <span>ELEVATE</span>
          <span className="text-[#06b6d4] text-[8px] tracking-normal">•</span>
          <span>EVOLVE</span>
          <span className="text-[#a855f7] text-[8px] tracking-normal">•</span>
          <span>EXCEL</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-4 left-4 sm:left-6 md:left-8 z-50 pointer-events-auto">
      {isHome ? (
        <a href="#home" className="hover:opacity-90 active:scale-95 transition-all duration-300">
          {logoContent}
        </a>
      ) : (
        <Link href="/" className="hover:opacity-90 active:scale-95 transition-all duration-300">
          {logoContent}
        </Link>
      )}
    </div>
  );
}
