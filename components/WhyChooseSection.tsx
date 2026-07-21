"use client";

import React from "react";
import { Rocket, Sparkles, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";

const advantages = [
  {
    icon: Sparkles,
    badge: "AI Innovation",
    title: "AI-Native Systems",
    description: "Embed autonomous agents, neural workflows, and predictive models directly into your daily operational stack.",
    bullets: ["Custom LLM Integration", "Automated Workflows", "Real-Time Data Processing"],
  },
  {
    icon: Rocket,
    badge: "Speed & Scale",
    title: "Sub-Second Performance",
    description: "Engineered on modern edge infrastructure with zero bloat to achieve instant page loads and high concurrency.",
    bullets: ["Edge CDN Delivery", "Optimized Asset Loading", "Sub-50ms Response Time"],
  },
  {
    icon: ShieldCheck,
    badge: "Enterprise Security",
    title: "Bank-Grade Protection",
    description: "Built with Zero-Trust principles, end-to-end data encryption, and continuous automated security checks.",
    bullets: ["End-to-End Encryption", "Strict RLS Policies", "Compliance Standardized"],
  },
  {
    icon: Wrench,
    badge: "Custom Architecture",
    title: "Tailored Engineering",
    description: "Every product is built from the ground up to match your exact business requirements, never using generic templates.",
    bullets: ["Fully Type-Safe Code", "Custom Design Systems", "Scalable Cloud Architecture"],
  },
];

export function WhyChooseSection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 select-none overflow-hidden border-t border-white/10">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16 flex flex-col gap-12 sm:gap-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why Teams Partner With Us
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/60 font-light leading-relaxed">
            We bridge the gap between complex AI engineering and intuitive digital experiences that drive measurable impact.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col p-7 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-cyan-400/90 uppercase tracking-widest">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-white/60 font-light leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Bullets */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06] mt-auto">
                  {item.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-sans text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
