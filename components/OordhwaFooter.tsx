"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Code2, Smartphone, Cpu, Bot, Instagram, Send, Sparkles, CheckCircle2, MessageCircle, Zap, Shield, TrendingUp, Palette } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const INITIAL_CHIPS = [
  {
    id: 1,
    title: "Lightning-Fast Performance",
    description: "Built for speed and seamless user experience.",
    icon: Zap,
    glow: "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] text-amber-300",
  },
  {
    id: 2,
    title: "Enterprise-Grade Security",
    description: "Protecting your data with trusted security standards.",
    icon: Shield,
    glow: "border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-300",
  },
  {
    id: 3,
    title: "Scalable Solutions",
    description: "Designed to grow with your business.",
    icon: TrendingUp,
    glow: "border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-blue-300",
  },
  {
    id: 4,
    title: "AI-Powered Innovation",
    description: "Smart automation for better productivity.",
    icon: Bot,
    glow: "border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-purple-300",
  },
  {
    id: 5,
    title: "Modern UI/UX Design",
    description: "Beautiful, intuitive, and user-focused experiences.",
    icon: Palette,
    glow: "border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.4)] text-pink-300",
  },
];

function Bucket() {
  const [items, setItems] = useState(INITIAL_CHIPS);
  const isMobile = useIsMobile();
  const [isWebKit, setIsWebKit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsWebKit(
      typeof window !== "undefined" &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
          (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="relative w-full aspect-[655/352]" />;
  }

  return (
    <div
      className="relative isolate w-full aspect-[655/352] select-none shrink-0"
    >
      {/* SVG Container: Bottom Matte Layer */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 655 352"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-0"
      >
        <foreignObject
          x="443.561"
          y="-10.5141"
          width="211.24"
          height="166.977"
          clipPath="url(#bgblur_0_51_65_clip_path)"
        >
          <div
            style={{
              backdropFilter: isWebKit ? "none" : "blur(11.03px)",
              WebkitBackdropFilter: isWebKit ? "none" : "blur(11.03px)",
              height: "100%",
              width: "100%",
            }}
          ></div>
        </foreignObject>
        <g
          filter="url(#filter1_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z"
            fill="#eab308"
            fillOpacity="0.15"
            shapeRendering="crispEdges"
          />
        </g>
        <foreignObject
          x="-3.43323e-05"
          y="-10.9516"
          width="215.96"
          height="167.786"
          clipPath="url(#bgblur_1_51_65_clip_path)"
        >
          <div
            style={{
              backdropFilter: isWebKit ? "none" : "blur(11.03px)",
              WebkitBackdropFilter: isWebKit ? "none" : "blur(11.03px)",
              height: "100%",
              width: "100%",
            }}
          ></div>
        </foreignObject>
        <g
          filter="url(#filter2_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z"
            fill="#eab308"
            fillOpacity="0.15"
            shapeRendering="crispEdges"
          />
        </g>
        <foreignObject
          x="78.7048"
          y="20.823"
          width="501.297"
          height="136.012"
          clipPath="url(#bgblur_2_51_65_clip_path)"
        >
          <div
            style={{
              backdropFilter: isWebKit ? "none" : "blur(11.03px)",
              WebkitBackdropFilter: isWebKit ? "none" : "blur(11.03px)",
              height: "100%",
              width: "100%",
            }}
          ></div>
        </foreignObject>
        <g
          filter="url(#filter3_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z"
            fill="url(#paint0_linear_51_65)"
            fillOpacity="0.25"
            shapeRendering="crispEdges"
          />
        </g>
        <foreignObject
          x="78.7048"
          y="20.823"
          width="137.255"
          height="136.012"
          clipPath="url(#bgblur_3_51_65_clip_path)"
        >
          <div
            style={{
              backdropFilter: isWebKit ? "none" : "blur(11.03px)",
              WebkitBackdropFilter: isWebKit ? "none" : "blur(11.03px)",
              height: "100%",
              width: "100%",
            }}
          ></div>
        </foreignObject>
        <g
          filter="url(#filter4_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z"
            fill="#eab308"
            fillOpacity="0.15"
            shapeRendering="crispEdges"
          />
        </g>

        <g
          filter="url(#filter5_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M487.973 78.9088V42.8774L536.404 79.1144L487.973 78.9088Z"
            fill="#eab308"
            fillOpacity="0.15"
            shapeRendering="crispEdges"
          />
        </g>

        <defs>
          <filter
            id="filter0_i_51_65"
            x="123.766"
            y="79.1595"
            width="413"
            height="275.676"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_51_65"
            />
          </filter>
          <filter
            id="filter1_dddi_51_65"
            x="443.561"
            y="-10.5141"
            width="211.24"
            height="166.977"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <clipPath
            id="bgblur_0_51_65_clip_path"
            transform="translate(-443.561 10.5141)"
          >
            <path d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z" />
          </clipPath>
          <filter
            id="filter2_dddi_51_65"
            x="-3.43323e-05"
            y="-10.9516"
            width="215.96"
            height="167.786"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <clipPath
            id="bgblur_1_51_65_clip_path"
            transform="translate(3.43323e-05 10.9516)"
          >
            <path d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z" />
          </clipPath>
          <filter
            id="filter3_dddi_51_65"
            x="78.7048"
            y="20.823"
            width="501.297"
            height="136.012"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <clipPath
            id="bgblur_2_51_65_clip_path"
            transform="translate(-78.7048 -20.823)"
          >
            <path d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z" />
          </clipPath>
          <filter
            id="filter4_dddi_51_65"
            x="78.7048"
            y="20.823"
            width="137.255"
            height="136.012"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <clipPath
            id="bgblur_3_51_65_clip_path"
            transform="translate(-78.7048 -20.823)"
          >
            <path d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z" />
          </clipPath>
          <filter
            id="filter5_dddi_51_65"
            x="443.561"
            y="20.823"
            width="137.255"
            height="136.012"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <filter
            id="filter6_dddi_51_65"
            x="21.477"
            y="56.6875"
            width="612.444"
            height="212.562"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="33.3087" />
            <feGaussianBlur stdDeviation="22.2058" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_51_65"
              result="effect2_dropShadow_51_65"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="effect2_dropShadow_51_65"
              result="effect3_dropShadow_51_65"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect3_dropShadow_51_65"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.51362" />
            <feGaussianBlur stdDeviation="1.83787" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect4_innerShadow_51_65"
            />
          </filter>
          <clipPath id="bgblur_5_51_65_clip_path">
            <path d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z" />
          </clipPath>
          <clipPath id="center_box_clip">
            <rect x="123.766" y="0" width="413" height="352" />
          </clipPath>
          <linearGradient
            id="paint0_linear_51_65"
            x1="329.353"
            y1="42.8774"
            x2="329.353"
            y2="79.1144"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ca8a04" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Chip Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-start pointer-events-none">
        <div
          className="relative w-full h-full flex justify-center md:justify-start items-center"
          style={{ paddingBottom: "65%" }}
        >
          <div className="relative w-full max-w-[655px] h-full flex justify-center items-center">
            <AnimatePresence mode="wait">
              {items[0] ? (
                <motion.div
                  key={items[0].id}
                  initial={{
                    y: isMobile ? -60 : -120,
                    opacity: 0,
                    scale: isMobile ? 0.55 : 0.8,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: isMobile ? 0.7 : 1.25,
                  }}
                  exit={{
                    y: isMobile ? 70 : 140,
                    opacity: 0,
                    scale: isMobile ? 0.55 : 0.8,
                    transition: {
                      y: {
                        type: "tween",
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                      scale: {
                        type: "tween",
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                      opacity: {
                        type: "tween",
                        duration: 0.6,
                        ease: "linear",
                      },
                    },
                  }}
                  transition={{
                    y: {
                      type: "spring",
                      stiffness: 35,
                      damping: 15,
                      mass: 1.2,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 40,
                      damping: 16,
                      mass: 1.2,
                    },
                    opacity: {
                      type: "tween",
                      duration: 0.8,
                      ease: "easeInOut",
                    },
                  }}
                  className={`bg-[#0d0c07]/95 border z-10 rounded-full p-2.5 w-[240px] sm:w-[290px] shadow-lg absolute pointer-events-auto flex items-center gap-2.5 origin-bottom backdrop-blur-xl ${items[0].glow}`}
                >
                  <div className="flex size-8 sm:size-9.5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                    {(() => {
                      const IconComponent = items[0].icon;
                      return <IconComponent className="size-3.5 sm:size-4.5" />;
                    })()}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[clamp(10.5px,2.2vw,12.5px)] sm:text-[clamp(12px,2.4vw,13.5px)] font-bold text-white leading-tight truncate">
                      {items[0].title}
                    </span>
                    <span className="text-[clamp(8px,1.8vw,9.5px)] sm:text-[clamp(9.5px,2vw,11px)] text-white/60 leading-normal line-clamp-2">
                      {items[0].description}
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SVG Container: Top Matte Layer with Mustard Yellow Tint */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 655 352"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        style={{
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <g filter="url(#filter0_i_51_65)">
          <path
            d="M512.766 79.1595L147.766 79.1624C136.453 79.1625 130.796 79.1626 127.281 82.6773C123.766 86.192 123.766 91.8488 123.766 103.162V327.159C123.766 338.473 123.766 344.13 127.281 347.645C130.796 351.159 136.453 351.159 147.766 351.159H512.766C524.08 351.159 529.737 351.159 533.252 347.645C536.766 344.13 536.766 338.473 536.766 327.159V103.159C536.766 91.8457 536.766 86.1888 533.252 82.6741C529.737 79.1594 524.08 79.1594 512.766 79.1595Z"
            fill="#854d0e"
            fillOpacity="0.4"
            stroke="#eab308"
            strokeWidth="1.5"
          />
        </g>

        <g clipPath="url(#center_box_clip)">
          <foreignObject x="0" y="0" width="655" height="352" clipPath="url(#bgblur_5_51_65_clip_path)">
            <div
              style={{
                backdropFilter: isWebKit ? "none" : "blur(60.03px)",
                WebkitBackdropFilter: isWebKit ? "none" : "blur(60.03px)",
                height: "100%",
                width: "100%",
                background: "rgba(234, 179, 8, 0.04)",
              }}
            ></div>
          </foreignObject>
        </g>

        <g
          filter="url(#filter6_dddi_51_65)"
          data-figma-bg-blur-radius="22.0545"
        >
          <path
            d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z"
            fill="#eab308"
            fillOpacity="0.12"
            shapeRendering="crispEdges"
          />
        </g>
      </svg>
    </div>
  );
}


export function OordhwaFooter() {
  const [formData, setFormData] = useState({ phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({ phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    let hasError = false;
    const newErrors = { phone: "", email: "", message: "" };

    if (!formData.phone.trim()) {
      newErrors.phone = "Please fill out this field.";
      hasError = true;
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (7-20 digits).";
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please fill out this field.";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please fill out this field.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({ phone: "", email: "", message: "" });
      setErrors({ phone: "", email: "", message: "" });
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section
      id="footer"
      className="relative w-full bg-black min-h-screen flex flex-col justify-between select-none overflow-hidden border-t border-white/10"
    >
      {/* Dynamic Ambient Mustard & Purple Backdrops */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Grid: Left Creative Get In Touch + Right Product Funnel Box */}
      <div className="relative z-10 mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 my-auto">
        
        {/* LEFT COLUMN: Big Creative "Get In Touch" Contact Form (Expanded) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[58%] flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono tracking-[0.25em] uppercase w-fit">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              Start A Conversation
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Get In Touch.
            </h2>

            <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-lg">
              Have a web platform, mobile app, hardware IoT system, or AI integration in mind? Drop us a line and let&apos;s build together.
            </p>
          </div>

          {/* Interactive Glassmorphic Contact Form */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col gap-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex flex-col items-center gap-2 text-center animate-fade-up">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                <span className="font-bold text-sm">Message Sent Successfully!</span>
                <span className="text-xs text-white/70">Our engineering team will review your message and reply shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-mono text-white/60 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      placeholder="e.g. +1 555-0199"
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/60 border text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                          : "border-white/15 focus:border-cyan-400"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-rose-400 font-mono font-medium animate-fade-in">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10.5px] font-mono text-white/60 uppercase tracking-wider">Work Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/60 border text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                          : "border-white/15 focus:border-cyan-400"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-rose-400 font-mono font-medium animate-fade-in">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-mono text-white/60 uppercase tracking-wider">Project Details *</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    placeholder="Tell us about your project goals, timelines, or technical requirements..."
                    className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/60 border text-white placeholder:text-white/25 focus:outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                        : "border-white/15 focus:border-cyan-400"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] text-rose-400 font-mono font-medium animate-fade-in">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 mt-1"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Interactive Mustard Yellow Product Funnel Box (Compact) */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full lg:w-[38%] max-w-[460px] shrink-0 flex flex-col items-center gap-2.5 self-center"
        >

          <h3
            className="font-black-ops text-[clamp(0.875rem,2.8vw,1.75rem)] tracking-[0.18em] text-white/50 uppercase select-none text-center leading-tight"
            style={{
              textShadow: [
                "0 0 8px rgba(255,255,255,0.55)",
                "0 0 20px rgba(255,255,255,0.30)",
                "0 0 55px rgba(255,255,255,0.15)",
              ].join(", "),
            }}
          >
            OUR PRODUCT CONTAINS:
          </h3>
          <div className="w-full scale-95 sm:scale-100 origin-center">
            <Bucket />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM FOOTER BAR: Icon-Only Instagram & WhatsApp Buttons + Copyright */}
      <div className="relative z-10 mx-auto w-full max-w-[clamp(20rem,92vw,76rem)] px-6 sm:px-12 lg:px-16 pb-6 max-[675px]:pb-28 pt-2">
        <div className="w-full border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/45">
          {/* Copyright text */}
          <span className="text-center sm:text-left">
            © 2026 OORDHWA. All rights reserved.
          </span>

          {/* Social Icons Only (Instagram + WhatsApp) */}
          <div className="flex items-center gap-3">
            {/* Instagram Icon Link */}
            <a
              href="https://instagram.com/oordhwatechsolution"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram: oordhwatechsolution"
              className="p-3 rounded-full bg-white/[0.04] border border-white/12 hover:border-[#e4405f]/50 hover:bg-[#e4405f]/15 hover:shadow-[0_0_20px_rgba(228,64,95,0.4)] text-white/70 hover:text-[#e4405f] transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* WhatsApp Icon Link */}
            <a
              href="https://wa.me/918147534336"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp: +91 8147534336"
              className="p-3 rounded-full bg-white/[0.04] border border-white/12 hover:border-[#25d366]/50 hover:bg-[#25d366]/15 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] text-white/70 hover:text-[#25d366] transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
