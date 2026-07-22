"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Code2, Smartphone, Cpu, Bot, Sparkles, Layout, Gauge, Layers } from "lucide-react";

/* -----------------------------------------------------------------------------
 * VISUAL ANIMATED GRAPHIC WIDGETS FOR EACH CAPABILITY PILLAR (COMPACT VERSION)
 * -------------------------------------------------------------------------- */

// 1. Web Development Graphic: Glass 3D UI Dashboard
function WebDevGraphic() {
  return (
    <div className="relative w-full h-28 rounded-2xl bg-black/70 border border-cyan-500/25 overflow-hidden flex items-center justify-center p-3 select-none">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(6,182,212,0.5) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
        className="relative z-10 w-full h-full rounded-xl bg-cyan-950/40 border border-cyan-400/35 p-2.5 flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[9px] font-mono font-bold text-white tracking-wider">
              HIGH-SPEED WEB UI
            </span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded-full">
            <Gauge className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[8.5px] font-mono text-emerald-300 font-semibold">100 SCORE</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 py-0.5">
          <div className="h-6 rounded-md bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
            <motion.div
              animate={{ width: ["20%", "80%", "20%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
              className="h-1 rounded-full bg-cyan-400/70"
            />
          </div>
          <div className="h-6 rounded-md bg-blue-500/15 border border-blue-400/20 flex items-center justify-center">
            <motion.div
              animate={{ width: ["70%", "30%", "70%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
              className="h-1 rounded-full bg-blue-400/70"
            />
          </div>
          <div className="h-6 rounded-md bg-purple-500/15 border border-purple-400/20 flex items-center justify-center">
            <motion.div
              animate={{ width: ["40%", "90%", "40%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
              className="h-1 rounded-full bg-purple-400/70"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[7.5px] font-mono text-white/50 border-t border-cyan-500/20 pt-1">
          <span className="flex items-center gap-1 text-cyan-300">
            <Layers className="w-2.5 h-2.5" /> Edge Delivered
          </span>
          <span className="text-white/40">Next.js 16 Turbo</span>
        </div>
      </motion.div>
    </div>
  );
}

// 2. App Development Graphic: Mobile Device Frame
function AppDevGraphic() {
  return (
    <div className="relative w-full h-28 rounded-2xl bg-black/70 border border-purple-500/25 overflow-hidden flex items-center justify-center p-2.5 select-none">
      <div className="w-26 h-24 rounded-2xl border border-purple-500/35 bg-purple-950/20 p-1.5 flex flex-col justify-between relative shadow-[0_0_12px_rgba(168,85,247,0.2)]">
        <div className="w-6 h-0.5 rounded-full bg-purple-400/50 mx-auto" />
        <motion.div
          animate={{ y: [-1, 2, -1], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
          className="p-1.5 rounded-lg bg-purple-900/40 border border-purple-400/30 flex items-center justify-between"
        >
          <div className="flex flex-col gap-0.5">
            <span className="w-8 h-1 rounded-full bg-purple-300/80" />
            <span className="w-5 h-0.5 rounded-full bg-purple-400/40" />
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" as const }}
            className="w-3.5 h-3.5 rounded-full border border-cyan-400 text-[7.5px] flex items-center justify-center text-cyan-300"
          >
            ⚡
          </motion.div>
        </motion.div>
        <div className="w-10 h-0.5 rounded-full bg-white/20 mx-auto" />
      </div>
    </div>
  );
}

// 3. AI Solutions Graphic: Neural Synapses
function AiGraphic() {
  return (
    <div className="relative w-full h-28 rounded-2xl bg-black/70 border border-blue-500/25 overflow-hidden flex items-center justify-center p-3 select-none">
      <div className="relative w-full h-full flex items-center justify-around">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
          className="w-9 h-9 rounded-full bg-blue-950/80 border border-blue-400 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
        >
          <Bot className="w-4 h-4" />
        </motion.div>

        <div className="relative w-16 h-0.5 bg-blue-500/30">
          <motion.div
            animate={{ x: [0, 60, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 -top-1 absolute shadow-[0_0_10px_#06b6d4]"
          />
        </div>

        <motion.div
          animate={{ scale: [1.15, 1, 1.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
          className="w-9 h-9 rounded-full bg-purple-950/80 border border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>
    </div>
  );
}

// 4. Hardware Solutions Graphic: Microchip Circuit
function HardwareGraphic() {
  return (
    <div className="relative w-full h-28 rounded-2xl bg-black/70 border border-emerald-500/25 overflow-hidden flex items-center justify-center p-3 select-none">
      <svg className="absolute inset-0 w-full h-full stroke-emerald-500/20" strokeWidth="1">
        <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4,4" />
        <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4,4" />
      </svg>
      <motion.div
        animate={{ scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
        className="relative z-10 w-14 h-14 rounded-xl bg-emerald-950/90 border border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.35)] flex flex-col items-center justify-center gap-0.5"
      >
        <Cpu className="w-5 h-5 text-emerald-400" />
        <span className="text-[6px] font-mono text-emerald-300 tracking-wider">IOT-CORE</span>
      </motion.div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * MAIN CAPABILITIES SECTION COMPONENT
 * -------------------------------------------------------------------------- */

const capabilities = [
  {
    id: "web",
    icon: Code2,
    title: "Web Development",
    description:
      "Crafting high-performance Next.js and React web platforms engineered for ultra-fast load times, global edge delivery, and intuitive user experiences.",
    tech: ["Next.js / React", "TypeScript", "Tailwind CSS"],
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderColor: "hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    Graphic: WebDevGraphic,
  },
  {
    id: "app",
    icon: Smartphone,
    title: "App Development",
    description:
      "Building 60fps native-feeling mobile applications for iOS and Android with smooth micro-animations, offline-first sync, and responsive UI systems.",
    tech: ["React Native / iOS", "Android Systems", "Cross-Platform UI"],
    gradient: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    borderColor: "hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    Graphic: AppDevGraphic,
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI Solutions",
    description:
      "Deploying intelligent neural agents, custom LLM integrations, automated machine learning pipelines, and smart workflows to scale business operations.",
    tech: ["OpenAI / Claude", "Custom LLM Agents", "Neural Workflows"],
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    borderColor: "hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    Graphic: AiGraphic,
  },
  {
    id: "hardware",
    icon: Cpu,
    title: "Hardware Solutions",
    description:
      "Architecting custom IoT devices, embedded microcontrollers, firmware, and seamless hardware-software integration pipelines for real-time control.",
    tech: ["IoT / Embedded", "Microcontrollers", "Hardware Integration"],
    gradient: "from-emerald-500/20 via-cyan-500/10 to-transparent",
    borderColor: "hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    Graphic: HardwareGraphic,
  },
];

export function CapabilitiesSection() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <section id="capabilities" className="relative w-full bg-black py-12 sm:py-16 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16 flex flex-col gap-8 sm:gap-10">
        {/* Section Header (Sub-header pill badge removed) */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Core Technical Capabilities
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Architecting intelligent, scalable, and resilient digital &amp; hardware solutions powered by next-generation engineering.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            const GraphicWidget = cap.Graphic;

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.012 }}
                onMouseEnter={() => setActiveTab(cap.id)}
                onMouseLeave={() => setActiveTab(null)}
                onClick={() => {
                  const contactSection = document.getElementById("footer");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl transition-all duration-300 cursor-pointer ${cap.borderColor}`}
              >
                {/* Top Subtle Gradient Overlay */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Top Row — Icon Only */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all duration-300">
                      <Icon className="w-5.5 h-5.5" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Animated Visual Preview Widget */}
                  <GraphicWidget />

                  {/* Title & Description */}
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                      {cap.description}
                    </p>
                  </div>
                </div>

                {/* Tech Pills Footer */}
                <div className="relative z-10 flex flex-wrap gap-2 pt-4 mt-4 border-t border-white/[0.06]">
                  {cap.tech.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9.5px] font-mono text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/15 px-2.5 py-0.5 rounded-md transition-all duration-200 group-hover:bg-cyan-500/15 group-hover:border-cyan-400/40 group-hover:text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
