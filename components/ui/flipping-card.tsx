"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  isFlipped: boolean;
  onFlipToggle: () => void;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 320,
  width = "100%",
  isFlipped,
  onFlipToggle,
}: FlippingCardProps) {
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const widthStyle = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      onClick={onFlipToggle}
      className="group/flipping-card [perspective:1000px] w-full cursor-pointer select-none"
      style={
        {
          "--height": heightStyle,
          "--width": widthStyle,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative rounded-2xl border border-white/10 bg-[#0c0c0c]/90 shadow-2xl transition-all duration-700 [transform-style:preserve-3d] w-full h-[var(--height)]",
          "md:group-hover/flipping-card:[transform:rotateY(180deg)]",
          isFlipped ? "[transform:rotateY(180deg)]" : "",
          className
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden bg-[#0a0a0a] text-white [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(0deg)] border border-white/5">
          <div className="[transform:translateZ(60px)_scale(.95)] h-full w-full">
            {frontContent}
          </div>
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden bg-[#0c0c0c] text-white [transform-style:preserve-3d] [backface-visibility:hidden] [transform:rotateY(180deg)] border border-white/15">
          <div className="[transform:translateZ(60px)_scale(.95)] h-full w-full">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
