"use client";

import React from "react";
import { motion } from "motion/react";
import { Eye, Rocket, Compass, Target } from "lucide-react";

export function VisionMissionSection() {
  return (
    <section
      id="vision"
      className="w-full bg-[#000000] min-h-screen flex flex-col justify-center items-center py-20 font-sans select-none overflow-hidden relative"
    >
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.3) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[clamp(20rem,92vw,72rem)] px-6 sm:px-12 lg:px-16 flex flex-col gap-12 sm:gap-16">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#06b6d4] mb-2">
            Who We Are
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Vision &amp; Mission
          </h2>
        </motion.div>

        {/* Clean, Formatted Two Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-stretch">
          
          {/* Vision Column (Assembling from Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
            whileHover={{ scale: 1.015, y: -4 }}
            className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-xl hover:border-cyan-400/40 hover:bg-cyan-500/[0.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            {/* Glowing Accent Corner Indicator */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-400/0 group-hover:border-cyan-400/60 rounded-tl-3xl transition-all duration-300" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-400/0 group-hover:border-cyan-400/60 rounded-br-3xl transition-all duration-300" />

            <div className="flex flex-col gap-6">
              {/* Header Icon Row */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                  Our Vision
                </h3>
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/25 transition-all duration-300">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed font-light">
                To build advanced, secure, and intelligent digital systems powered by next-generation AI, autonomous technologies, and high-performance infrastructure that can solve complex real-world problems with world-class scalability and innovation.
              </p>
            </div>

            {/* Decorative Vector Target Radar */}
            <div className="mt-8 flex justify-end opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Compass className="w-12 h-12 text-cyan-400 animate-spin" style={{ animationDuration: "25s" }} />
            </div>
          </motion.div>

          {/* Mission Column (Assembling from Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.015, y: -4 }}
            className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-xl hover:border-purple-400/40 hover:bg-purple-500/[0.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-300"
          >
            {/* Glowing Accent Corner Indicator */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-purple-400/0 group-hover:border-purple-400/60 rounded-tl-3xl transition-all duration-300" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-purple-400/0 group-hover:border-purple-400/60 rounded-br-3xl transition-all duration-300" />

            <div className="flex flex-col gap-6">
              {/* Header Icon Row */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                  Our Mission
                </h3>
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all duration-300">
                  <Rocket className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed font-light">
                We develop high-quality, secure, and scalable websites, mobile applications, and digital platforms for modern organizations. We provide advanced feature integration, AI-powered solutions, and intelligent system automation while ensuring strong data security and reliable performance.
              </p>
            </div>

            {/* Decorative Vector Rocket Launch */}
            <div className="mt-8 flex justify-end opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Target className="w-12 h-12 text-purple-400" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
