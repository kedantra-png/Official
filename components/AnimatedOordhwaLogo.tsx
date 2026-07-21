"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface AnimatedOordhwaLogoProps {
  size?: number;
}

/*
 * Assembly animation using the actual transparent logo PNG.
 * The image is split into 4 quadrant "pieces" via CSS clip-path.
 * Each piece starts far outside (different direction) and springs
 * into position — when all 4 settle at (0,0), they combine to
 * reveal the complete logo. No SVG paths to get wrong!
 */

const SPRING = { type: "spring" as const, stiffness: 210, damping: 22 };

const REGIONS = [
  // top-left arm (U-bend at top-left)
  {
    id: "tl",
    clip: "polygon(0% 0%, 54% 0%, 54% 54%, 0% 54%)",
    fromX: -70, fromY: -70, delay: 0.0,
  },
  // top-right arm (arrow + upper arm)
  {
    id: "tr",
    clip: "polygon(46% 0%, 100% 0%, 100% 54%, 46% 54%)",
    fromX: 70, fromY: -70, delay: 0.18,
  },
  // bottom-left arm (U-bend at bottom-left)
  {
    id: "bl",
    clip: "polygon(0% 46%, 54% 46%, 54% 100%, 0% 100%)",
    fromX: -70, fromY: 70, delay: 0.36,
  },
  // bottom-right arm
  {
    id: "br",
    clip: "polygon(46% 46%, 100% 46%, 100% 100%, 46% 100%)",
    fromX: 70, fromY: 70, delay: 0.54,
  },
];

export function AnimatedOordhwaLogo({ size = 160 }: AnimatedOordhwaLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="relative select-none pointer-events-none"
      style={{ width: size, height: size }}
    >
      {/* Gentle float — kicks in after assembly is done */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 1.6,
        }}
        className="relative w-full h-full"
      >
        {/* Lock-in glow burst when all pieces arrive */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, 1.6, 1.1], opacity: [0, 0.55, 0] }}
          transition={{ duration: 0.75, delay: 1.05, ease: "easeOut" as const }}
          className="absolute inset-0 rounded-full bg-cyan-400/35 blur-2xl pointer-events-none z-0"
        />

        {/* Continuous ambient glow (starts after lock-in) */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.14, 0.04, 0.14] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1.9,
          }}
          className="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl pointer-events-none z-0"
        />

        {/* 4 image quadrant pieces — same PNG, different clip-path, different start offset */}
        {REGIONS.map((r) => (
          <motion.div
            key={r.id}
            className="absolute inset-0"
            style={{
              clipPath: r.clip,
              filter: "drop-shadow(0 0 16px rgba(6,182,212,0.45))",
            }}
            initial={{ x: r.fromX, y: r.fromY, opacity: 0, scale: 0.75 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            transition={{
              x:       { ...SPRING, delay: r.delay },
              y:       { ...SPRING, delay: r.delay },
              opacity: { duration: 0.3, delay: r.delay },
              scale:   { ...SPRING, delay: r.delay },
            }}
          >
            <Image
              src="/oordhwa-icon.png"
              alt="Oordhwa Tech Solutions"
              width={size}
              height={size}
              className="w-full h-full object-contain"
              priority
              unoptimized
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
