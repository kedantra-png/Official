"use client";

import React from "react";
import { LayoutGrid, Cpu, Smartphone, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: LayoutGrid,
    title: "Enterprise SaaS & Web Platforms",
    subtitle: "Scalable, secure, sub-second web applications",
    description:
      "We design and engineer bespoke web platforms, administrative portals, and customer-facing SaaS applications optimized for maximum concurrency and instant response times.",
    features: ["Custom UI/UX Design", "Real-Time Dashboards", "Role-Based Access Control", "Automated Billing & APIs"],
    highlight: "Web Platforms",
  },
  {
    icon: Cpu,
    title: "AI Agents & Autonomous Workflows",
    subtitle: "Custom neural pipelines & LLM integrations",
    description:
      "Transform business processes by embedding intelligent AI agents that handle complex data extraction, automated customer interactions, and predictive decision making.",
    features: ["LLM Fine-Tuning & Prompting", "Intelligent Document AI", "Autonomous Customer Bots", "Vector Search Systems"],
    highlight: "AI Systems",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Apps",
    subtitle: "60fps native performance on iOS & Android",
    description:
      "Deliver elegant mobile experiences with fluid animations, offline-first data synchronization, and unified design tokens across all devices.",
    features: ["iOS & Android Build", "Offline Sync", "Push Notifications", "Biometric Authentication"],
    highlight: "Mobile Apps",
  },
];

export function SolutionsSection() {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28 select-none overflow-hidden border-t border-white/10">
      <div className="relative mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16 flex flex-col gap-12 sm:gap-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Tailored Digital Solutions
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/60 font-light leading-relaxed">
            From modern web platforms to intelligent autonomous agents, we craft software designed to perform at scale.
          </p>
        </div>

        {/* 3 Column Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {item.highlight}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-mono text-xs text-cyan-400/80 font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-white/60 font-light leading-relaxed">
                    {item.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-white/[0.06]">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-sans text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
