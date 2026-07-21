"use client";

/** 
 * FooterWordmark component.
 * Renders the "OORDHWA" text using responsive inline SVG layers.
 * On hover of the footer section / wordmark, it smoothly transitions from a 
 * subtle, semi-transparent base matte gradient to a gorgeous, premium silver 
 * metallic chrome gradient with a soft drop shadow, avoiding any heavy 
 * JS/pointer calculations or canvas/masking.
 */
export function FooterWordmark() {
  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{
        height: "clamp(5rem, 22vw, 14rem)",
        minHeight: "5rem",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto block h-full w-full max-w-full overflow-visible"
        role="img"
        aria-label="OORDHWA"
      >
        <defs>
          {/* Base Matte Gradient (Vertical) */}
          <linearGradient id="footerBaseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.32)" />
            <stop offset="45%" stopColor="rgba(255, 255, 255, 0.12)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
          </linearGradient>
        </defs>

        {/* Elegant Base Matte Text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-heading font-extrabold tracking-tighter select-none"
          style={{ fontSize: "200px" }}
          fill="url(#footerBaseGradient)"
        >
          OORDHWA
        </text>
      </svg>
    </div>
  );
}

