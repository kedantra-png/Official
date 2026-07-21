"use client";

import React from "react";
import { Shield, Zap, Globe, Cpu } from "lucide-react";

const metrics = [
  {
    icon: Shield,
    value: "99.99%",
    label: "Uptime & Reliability",
    description: "Enterprise-grade fault tolerance & active monitoring",
  },
  {
    icon: Cpu,
    value: "50+",
    label: "Products Shipped",
    description: "Next-gen web & mobile applications deployed",
  },
  {
    icon: Globe,
    value: "< 50ms",
    label: "Global Edge Latency",
    description: "Ultra-fast response rates across distributed nodes",
  },
  {
    icon: Zap,
    value: "10x",
    label: "Development Velocity",
    description: "AI-boosted workflows & automated pipelines",
  },
];

export function MetricsSection() {
  return (
    <section className="relative w-full bg-black py-12 border-y border-white/10 select-none overflow-hidden">
      {/* Background Subtle Gradient Highlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                    0{idx + 1}
                  </span>
                </div>

                <div className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mb-1 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text">
                  {item.value}
                </div>

                <div className="font-sans font-bold text-xs sm:text-sm text-cyan-400 tracking-wide uppercase mb-1">
                  {item.label}
                </div>

                <p className="font-sans text-[11px] sm:text-xs text-white/50 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
