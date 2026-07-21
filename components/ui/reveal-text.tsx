"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type RevealTextTheme = "auto" | "dark" | "light";

export type MinimalistTextEffectProps = {
  text: string;
  duration?: number;
  theme?: RevealTextTheme;
  className?: string;
  fontSize?: number;
  viewBox?: string;
  /** Show always-visible base layer (use for footer wordmark) */
  withBase?: boolean;
  textClassName?: string;
  /** Stretch glyphs to span most of the viewBox width (responsive wordmarks) */
  fillWidth?: boolean;
};

function parseViewBoxWidth(viewBox: string): number {
  const parts = viewBox.trim().split(/\s+/);
  return parts.length >= 3 ? Number(parts[2]) || 1000 : 1000;
}

export function MinimalistTextEffect({
  text,
  duration = 0.3,
  theme = "auto",
  className,
  fontSize = 16,
  viewBox = "0 0 150 50",
  withBase = false,
  textClassName,
  fillWidth = false,
}: MinimalistTextEffectProps) {
  const viewBoxWidth = parseViewBoxWidth(viewBox);
  const textLength = fillWidth ? Math.round(viewBoxWidth * 0.92) : undefined;
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({
    cx: "50%",
    cy: "50%",
  });
  const [isDark, setIsDark] = useState(theme === "dark" || theme === "auto");

  const gradientId = `monoGradient-${uid}`;
  const baseGradientId = `baseGradient-${uid}`;
  const inverseMaskId = `inverseMask-${uid}`;
  const revealMaskId = `revealMask-${uid}`;

  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
      return;
    }
    if (theme === "light") {
      setIsDark(false);
      return;
    }

    const checkDark = () => {
      if (typeof window !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

      setRipplePosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  const revealGradientStops = isDark
    ? [
        <stop key="0" offset="0%" stopColor="#f3f4f6" />,
        <stop key="1" offset="50%" stopColor="#a1a1aa" />,
        <stop key="2" offset="100%" stopColor="#52525b" />,
      ]
    : [
        <stop key="0" offset="0%" stopColor="#ffffff" />,
        <stop key="1" offset="50%" stopColor="#a3a3a3" />,
        <stop key="2" offset="100%" stopColor="#171717" />,
      ];

  const textProps = {
    x: "50%",
    y: "50%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    className: cn(
      "font-heading select-none",
      withBase ? "font-extrabold tracking-tighter" : "font-light tracking-wider",
      textClassName,
    ),
    style: { fontSize },
    ...(textLength != null
      ? {
          textLength,
          lengthAdjust: "spacingAndGlyphs" as const,
        }
      : {}),
  };

  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className="mx-auto block h-full w-full max-w-full select-none"
        role="img"
        aria-label={text}
      >
        <defs>
          {withBase ? (
            <linearGradient
              id={baseGradientId}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          ) : null}

          <motion.radialGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            r="35%"
            animate={ripplePosition}
            transition={{ duration, ease: "circOut" }}
          >
            {revealGradientStops}
          </motion.radialGradient>

          <motion.radialGradient
            id={inverseMaskId}
            gradientUnits="userSpaceOnUse"
            r="30%"
            animate={ripplePosition}
            transition={{
              duration: duration + 0.1,
              ease: "easeOut",
              type: "spring",
              stiffness: 150,
              damping: 20,
            }}
          >
            <stop offset="0%" stopColor="black" />
            <stop offset="80%" stopColor="white" />
            <stop offset="100%" stopColor="white" />
          </motion.radialGradient>

          <mask id={revealMaskId}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#${inverseMaskId})`}
            />
          </mask>
        </defs>

        <motion.text
          {...textProps}
          fill={
            withBase && !isHovered
              ? `url(#${baseGradientId})`
              : `url(#${gradientId})`
          }
          mask={isHovered ? `url(#${revealMaskId})` : undefined}
          animate={{
            opacity: withBase || isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
}
