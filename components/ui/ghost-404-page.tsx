"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { FlowButton } from "@/components/ui/flow-button";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

const numberVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

const ghostVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 15,
    rotate: -5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
      rotate: {
        duration: 2,
        ease: "linear" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
};

export function NotFound() {
  return (
    <div className="bg-dots relative flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,#c8ced6_10%,transparent)_0%,transparent_70%)]"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          className="relative text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="mb-8 flex items-center justify-center gap-4 md:mb-12 md:gap-6">
            <motion.span
              className="font-signika select-none text-[80px] font-bold text-white/70 md:text-[120px]"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>
            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={["visible", "floating"]}
            >
              <Image
                src="/404-ghost.svg"
                alt=""
                width={120}
                height={120}
                className="h-[80px] w-[80px] select-none object-contain md:h-[120px] md:w-[120px]"
                draggable={false}
                priority
              />
            </motion.div>
            <motion.span
              className="font-signika select-none text-[80px] font-bold text-white/70 md:text-[120px]"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          <motion.h1
            className="font-dm-sans mb-4 select-none text-3xl font-bold text-white/80 md:mb-6 md:text-5xl"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          <motion.p
            className="font-dm-sans mb-8 max-w-md select-none text-lg text-white/50 md:mb-12 md:text-xl"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost — it&apos;s not here!
          </motion.p>

          <motion.div variants={itemVariants}>
            <FlowButton href="/" text="Back to home" />
          </motion.div>

          <motion.div className="mt-12" variants={itemVariants}>
            <Link
              href="/#footer"
              className="font-dm-sans text-sm text-white/45 underline transition-opacity hover:text-white/70"
            >
              Return to OORDHWA
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
