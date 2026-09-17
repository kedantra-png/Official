"use client";

import React from "react";

/* -----------------------------------------------------------------------------
 * EXACT ICONS MATCHING THE POSTER
 * -------------------------------------------------------------------------- */

// 1. Web Development: Globe with Pointer Click
function WebDevIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M11 3a13 13 0 0 0 0 16 13 13 0 0 0 0-16" />
      <path d="M3 11h16" />
      <path
        d="m14 14 6 2-2.5 1.5 2.5 3.5-1.5 1-2.5-3.5L14 20z"
        fill="currentColor"
      />
    </svg>
  );
}

// 2. Mobile App Development: Smartphone with Screen & Bar
function MobileAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="13" height="20" x="5.5" y="2" rx="2.5" />
      <path d="M10 18.5h4" />
      <line x1="10" y1="5.5" x2="14" y2="5.5" strokeWidth="1.5" />
    </svg>
  );
}

// 3. AI Solutions: Microchip with "AI" Center
function AiChipIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      <text
        x="12"
        y="14.2"
        textAnchor="middle"
        fontSize="6.2"
        fontWeight="900"
        fontFamily="monospace"
        fill="currentColor"
        stroke="none"
      >
        AI
      </text>
    </svg>
  );
}

// 4. IoT & Smart Devices: Connected Nodes with "IOT" Center
function IotNetworkIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4.5" />
      <text
        x="12"
        y="13.3"
        textAnchor="middle"
        fontSize="3.6"
        fontWeight="bold"
        fontFamily="sans-serif"
        fill="currentColor"
        stroke="none"
      >
        IOT
      </text>
      <circle cx="4" cy="7" r="1.6" fill="currentColor" />
      <circle cx="4" cy="17" r="1.6" fill="currentColor" />
      <circle cx="20" cy="7" r="1.6" fill="currentColor" />
      <circle cx="20" cy="17" r="1.6" fill="currentColor" />
      <circle cx="12" cy="3" r="1.6" fill="currentColor" />
      <circle cx="12" cy="21" r="1.6" fill="currentColor" />
      <path d="M5.3 7.8l2.6 2M5.3 16.2l2.6-2M18.7 7.8l-2.6 2M18.7 16.2l-2.6-2M12 4.6v2.9M12 16.5v2.9" />
    </svg>
  );
}

// 5. IT Infrastructure: Desktop PC Monitor + Server Tower
function ItInfraIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="4" width="13" height="11" rx="1.5" />
      <path d="M6 19h5M8.5 15v4" />
      <rect x="17" y="3" width="5.5" height="18" rx="1.2" />
      <circle cx="19.75" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="19.75" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
      <line x1="18.5" y1="17.5" x2="21" y2="17.5" strokeWidth="1.5" />
    </svg>
  );
}

// 6. Education Solutions: Academic Graduation Cap / Mortarboard
function EducationIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.84l8.57 3.9a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

/* -----------------------------------------------------------------------------
 * 6 SERVICES (ZEPHVION EDITORIAL ARCHITECTURAL STYLE)
 * -------------------------------------------------------------------------- */

const services = [
  {
    id: "web",
    code: "SERVICE // 01",
    watermark: "WEB",
    title: "WEB DEVELOPMENT",
    description:
      "High-performance websites, cloud-native web applications, and resilient enterprise portals engineered for speed and scale.",
    Icon: WebDevIcon,
    isFeatured: true, // Main featured Cobalt Blue card
  },
  {
    id: "mobile",
    code: "SERVICE // 02",
    watermark: "APP",
    title: "APP DEVELOPMENT",
    description:
      "Cross-platform and high-performance native iOS and Android applications with fluid micro-interactions.",
    Icon: MobileAppIcon,
    isFeatured: false,
  },
  {
    id: "ai",
    code: "SERVICE // 03",
    watermark: "AI",
    title: "AI SOLUTIONS",
    description:
      "Bespoke AI architectures engineered to eliminate operational bottlenecks and execute high-stakes business logic autonomously.",
    Icon: AiChipIcon,
    isFeatured: false,
  },
  {
    id: "iot",
    code: "SERVICE // 04",
    watermark: "IOT",
    title: "IOT & SMART DEVICES",
    description:
      "Embedded sensors, hardware telemetry, edge computing, and real-time machine telemetry automation.",
    Icon: IotNetworkIcon,
    isFeatured: false,
  },
  {
    id: "it",
    code: "SERVICE // 05",
    watermark: "SYS",
    title: "CORE INFRASTRUCTURE",
    description:
      "Custom PC builds, bare-metal server deployment, private cloud networking, and zero-trust security.",
    Icon: ItInfraIcon,
    isFeatured: false,
  },
  {
    id: "education",
    code: "SERVICE // 06",
    watermark: "EDU",
    title: "EDUCATION SOLUTIONS",
    description:
      "Academic administration, biometric attendance, online examinations, and secure student record systems.",
    Icon: EducationIcon,
    isFeatured: false,
  },
];

export function CapabilitiesSection() {
  const handleCtaClick = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="capabilities"
      className="relative w-full bg-white select-none overflow-hidden text-[#101828]"
    >
      {/* =========================================================================
       * SEAMLESS SECTION BLENDING (TRANSITION FROM DARK SITE)
       * ========================================================================= */}
      {/* Top Transition from Dark Vision Section */}
      <div className="w-full h-20 sm:h-28 bg-gradient-to-b from-black via-[#0c1017] to-white pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16 sm:pb-24">
        {/* =========================================================================
         * HEADER (ZEPHVION STYLE: BOLD COBALT BLUE "SERVICES")
         * ========================================================================= */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#eaecf0]">
            <div>
              <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#0d65e0] uppercase tracking-tight leading-none">
                What We Build
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#667085] mt-2 font-medium">
                Smart technology solutions for businesses &amp; institutions
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
         * 6 CARDS (EDITORIAL ZEPHVION GRID - NO HOVER ANIMATIONS)
         * ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((item) => {
            const Icon = item.Icon;

            if (item.isFeatured) {
              // Signature Cobalt Blue Card
              return (
                <div
                  key={item.id}
                  onClick={handleCtaClick}
                  className="relative p-7 sm:p-8 rounded-xl bg-[#0d65e0] text-white flex flex-col justify-between min-h-[280px] sm:min-h-[310px] overflow-hidden cursor-pointer transition-colors duration-150 hover:bg-[#0b5cd0]"
                >
                  {/* Giant Faint Watermark */}
                  <span className="absolute top-3 right-4 font-heading font-black text-7xl sm:text-8xl lg:text-9xl text-white/[0.12] pointer-events-none select-none tracking-tighter leading-none">
                    {item.watermark}
                  </span>

                  {/* Top Label */}
                  <div className="relative z-10">
                    <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                      {item.code}
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight leading-tight mt-3">
                      {item.title}
                    </h3>
                  </div>

                  {/* Bottom Meta & Corner Icon */}
                  <div className="relative z-10 flex items-end justify-between gap-4 mt-8 pt-4">
                    <p className="font-sans text-xs sm:text-[13px] text-white/85 font-normal leading-relaxed max-w-[82%]">
                      {item.description}
                    </p>
                    <div className="shrink-0 text-white/90">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                  </div>
                </div>
              );
            }

            // Clean Architectural Off-White Card
            return (
              <div
                key={item.id}
                onClick={handleCtaClick}
                className="relative p-7 sm:p-8 rounded-xl bg-[#f4f5f8] border border-[#e4e7ec] text-[#101828] flex flex-col justify-between min-h-[280px] sm:min-h-[310px] overflow-hidden cursor-pointer transition-colors duration-150 hover:border-[#0d65e0]/40 hover:bg-[#f0f2f6]"
              >
                {/* Giant Faint Watermark */}
                <span className="absolute top-3 right-4 font-heading font-black text-7xl sm:text-8xl lg:text-9xl text-black/[0.04] pointer-events-none select-none tracking-tighter leading-none">
                  {item.watermark}
                </span>

                {/* Top Label */}
                <div className="relative z-10">
                  <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#667085]">
                    {item.code}
                  </span>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#101828] uppercase tracking-tight leading-tight mt-3">
                    {item.title}
                  </h3>
                </div>

                {/* Bottom Meta & Corner Icon */}
                <div className="relative z-10 flex items-end justify-between gap-4 mt-8 pt-4">
                  <p className="font-sans text-xs sm:text-[13px] text-[#475467] font-normal leading-relaxed max-w-[82%]">
                    {item.description}
                  </p>
                  <div className="shrink-0 text-[#344054]">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
         * FOOTER BAR (ZEPHVION STYLE METADATA & DEMO CTA)
         * ========================================================================= */}
        <div className="mt-12 pt-6 border-t border-[#eaecf0] flex flex-col sm:flex-row items-center justify-between gap-4">


          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-[#1a1a1a] text-white rounded-md font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-150 flex items-center justify-center gap-2"
          >
            <span>CONNECT WITH US</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Bottom Transition back into Dark FAQ Section */}
      <div className="w-full h-20 sm:h-28 bg-gradient-to-b from-white via-[#0c1017] to-black pointer-events-none" />
    </section>
  );
}
