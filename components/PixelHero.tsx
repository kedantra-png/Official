"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { WavyBackground } from "@/components/ui/wavy-background";

interface PixelHeroProps {
  description?: string;
  primaryCta?: string;
  primaryCtaMobile?: string;
  secondaryCta?: string;
  secondaryCtaMobile?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  githubUrl?: string;
}

export function PixelHero({
  description = "We design high-performance web systems, custom neural automation pipelines, and native-feeling mobile applications built for scale and uncompromised speed.",
  primaryCta = "Explore Capabilities",
  primaryCtaMobile = "Capabilities",
  secondaryCta,
  secondaryCtaMobile,
  onPrimaryClick,
  onSecondaryClick,
  githubUrl = "https://github.com",
}: PixelHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WavyBackground
      colors={["#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#0284c7"]}
      waveOpacity={0.4}
      blur={12}
      speed="fast"
      containerClassName="relative w-full min-h-screen bg-black overflow-hidden select-none isolate"
      className="w-full max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center text-center"
    >
      <div className="flex flex-col items-center text-center gap-6 max-w-3xl">

        {/* Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
          Engineering Next-Gen <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Intelligent Platforms
          </span>{" "}
          &amp; Autonomous Workflows
        </h1>

        {/* Paragraph */}
        <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-2xl">
          {description}
        </p>

        {/* CTA Row */}
        <div
          className={cn(
            "flex flex-row items-center justify-center gap-4 mt-2 transition-all duration-1000 transform",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <button
            onClick={onPrimaryClick}
            className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-cyan-500 to-blue-600 font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            style={{
              height: "clamp(2.75rem, 2vw + 1.5rem, 3.25rem)",
              paddingInline: "clamp(1.25rem, 2vw + 0.5rem, 2.25rem)",
              fontSize: "clamp(0.85rem, 0.6vw + 0.4rem, 0.95rem)",
              gap: "0.5rem",
            }}
          >
            <span className="inline min-[500px]:hidden">{primaryCtaMobile}</span>
            <span className="hidden min-[500px]:inline">{primaryCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {secondaryCta && (
            <button
              onClick={onSecondaryClick}
              className="relative inline-flex items-center justify-center rounded-xl bg-[#080808] border border-white/15 hover:border-cyan-400/50 hover:bg-black font-semibold text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                height: "clamp(2.75rem, 2vw + 1.5rem, 3.25rem)",
                paddingInline: "clamp(1.25rem, 2vw + 0.5rem, 2.25rem)",
                fontSize: "clamp(0.85rem, 0.6vw + 0.4rem, 0.95rem)",
                gap: "0.5rem",
              }}
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="inline min-[500px]:hidden">{secondaryCtaMobile}</span>
              <span className="hidden min-[500px]:inline">{secondaryCta}</span>
            </button>
          )}
        </div>
      </div>
    </WavyBackground>
  );
}
