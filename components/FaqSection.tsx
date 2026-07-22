"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What services does Oordhwa Tech Solutions specialize in?",
    answer:
      "Oordhwa Tech Solutions delivers end-to-end digital solutions, including web development, mobile apps, AI integration, cloud services, and user-focused UI/UX design.",
  },
  {
    question: "Can you redesign or modernize an existing website?",
    answer:
      "Yes. We can redesign your current website with a modern UI/UX, improved performance, SEO optimization, and enhanced functionality while preserving your business identity.",
  },
  {
    question: "What is the typical timeline for project development?",
    answer:
      "Project timelines depend on the scope and complexity. Smaller projects typically take 2–4 weeks, while larger web or mobile applications are usually completed within 6–12 weeks, with regular updates and milestone reviews throughout the process.",
  },
  {
    question: "How do you guarantee data security and system uptime?",
    answer:
      "All systems are architected with Zero-Trust principles, end-to-end encryption, strict database RLS policies, and automated failover monitoring on edge infrastructure to deliver 99.99% uptime.",
  },
  {
    question: "Can Oordhwa help modernize or scale our existing codebase?",
    answer:
      "Yes! We specialize in legacy code refactoring, performance optimization, cloud migration, and seamless AI feature additions with zero operational downtime.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative w-full bg-black py-20 sm:py-28 select-none overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[clamp(20rem,92vw,56rem)] px-6 sm:px-12 lg:px-16 flex flex-col gap-12 sm:gap-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="font-sans text-sm sm:text-base text-white/60 font-light leading-relaxed">
            Clear insights into our engineering process, security standards, and partnership model.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white/[0.04] border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.1)]"
                    : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors cursor-pointer"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-white pr-4 group-hover:text-cyan-300 transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 text-cyan-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-cyan-500/20 border-cyan-500/30" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-white/[0.06] mt-1">
                    <p className="font-sans text-xs sm:text-sm text-white/70 font-light leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
