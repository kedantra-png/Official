"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/stepper";

interface DevelopmentPipelineProps {
  timelineData: TimelineItem[];
  activeNodeId: number | null;
  setActiveNodeId: (id: number | null) => void;
  isTimelinePopupOpen?: boolean;
}

const PHASE_PILL_STYLES: Record<number, { activeBorder: string; activeBg: string; activeGlow: string; text: string }> = {
  1: {
    activeBorder: "border-cyan-400",
    activeBg: "bg-cyan-500/20",
    activeGlow: "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    text: "text-cyan-300",
  },
  2: {
    activeBorder: "border-purple-400",
    activeBg: "bg-purple-500/20",
    activeGlow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
    text: "text-purple-300",
  },
  3: {
    activeBorder: "border-emerald-400",
    activeBg: "bg-emerald-500/20",
    activeGlow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]",
    text: "text-emerald-300",
  },
  4: {
    activeBorder: "border-blue-400",
    activeBg: "bg-blue-500/20",
    activeGlow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
    text: "text-blue-300",
  },
  5: {
    activeBorder: "border-amber-400",
    activeBg: "bg-amber-500/20",
    activeGlow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
    text: "text-amber-300",
  },
};

export function DevelopmentPipeline({
  timelineData,
  activeNodeId,
  setActiveNodeId,
  isTimelinePopupOpen = false,
}: DevelopmentPipelineProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState<number | null>(null);

  const totalCopies = 4;

  const getMiddleItem = () => {
    const container = containerRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestId = null;
    let minDistance = Infinity;

    Object.keys(itemRefs.current).forEach((key) => {
      const el = itemRefs.current[parseInt(key, 10)];
      if (el) {
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(itemCenter - containerCenter);
        if (dist < minDistance) {
          minDistance = dist;
          const actualId = parseInt(key, 10) % 10;
          closestId = actualId;
        }
      }
    });

    return closestId;
  };

  const centerItem = (id: number) => {
    const container = containerRef.current;
    if (!container) return;

    let closestEl: HTMLDivElement | null = null;
    let minCenterDist = Infinity;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    for (const offset of [0, 10, 20, 30]) {
      const el = itemRefs.current[id + offset];
      if (el) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs((rect.left + rect.width / 2) - containerCenter);
        if (dist < minCenterDist) {
          minCenterDist = dist;
          closestEl = el;
        }
      }
    }

    if (!closestEl) return;

    const itemRect = closestEl.getBoundingClientRect();
    const targetScrollLeft = container.scrollLeft + (itemRect.left - containerRect.left) - (containerRect.width / 2) + (itemRect.width / 2);
    container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const singleSetWidth = container.scrollWidth / totalCopies;
    if (container.scrollLeft >= singleSetWidth) {
      container.scrollLeft -= singleSetWidth;
    } else if (container.scrollLeft <= 2) {
      container.scrollLeft += singleSetWidth;
    }

    if (autoRotate) {
      const activeId = getMiddleItem();
      if (activeId !== null && activeId !== activeNodeId) {
        setActiveNodeId(activeId);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoRotate || isHovered || isTimelinePopupOpen) return;

    let rafId: number;
    const speed = 0.55;

    const scrollLoop = () => {
      if (container) {
        container.scrollLeft += speed;
        handleScroll();
      }
      rafId = requestAnimationFrame(scrollLoop);
    };

    rafId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate, isHovered, activeNodeId, isTimelinePopupOpen]);

  useEffect(() => {
    if (isTimelinePopupOpen) {
      setActiveNodeId(null);
    }
  }, [isTimelinePopupOpen, setActiveNodeId]);

  useEffect(() => {
    if (!autoRotate && activeNodeId !== null) {
      centerItem(activeNodeId);
    }
  }, [activeNodeId, autoRotate]);

  useEffect(() => {
    if (autoRotate) return;
    const timer = setTimeout(() => {
      setAutoRotate(true);
      setActiveNodeId(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [autoRotate, setActiveNodeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeNodeId === null) return;

    const updateTooltipPosition = () => {
      let closestEl: HTMLDivElement | null = null;
      let minCenterDist = Infinity;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      for (const offset of [0, 10, 20, 30]) {
        const el = itemRefs.current[activeNodeId + offset];
        if (el) {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs((rect.left + rect.width / 2) - containerCenter);
          if (dist < minCenterDist) {
            minCenterDist = dist;
            closestEl = el;
          }
        }
      }

      if (!closestEl) return;

      const activeRect = closestEl.getBoundingClientRect();
      let left = activeRect.left - containerRect.left + activeRect.width / 2;

      const tooltipWidth = Math.min(containerRect.width * 0.60, 192);
      const halfWidth = tooltipWidth / 2;
      const margin = 16;
      const minLeft = halfWidth + margin;
      const maxLeft = containerRect.width - halfWidth - margin;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setTooltipLeft(left);
    };

    updateTooltipPosition();
    container.addEventListener("scroll", updateTooltipPosition);
    window.addEventListener("resize", updateTooltipPosition);
    return () => {
      container.removeEventListener("scroll", updateTooltipPosition);
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [activeNodeId]);

  const activeItem = useMemo(() => {
    return timelineData.find((i) => i.id === activeNodeId);
  }, [activeNodeId, timelineData]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-[clamp(0.5rem,1.5vh,1.5rem)] px-4 flex flex-col items-center relative">
      
      {/* Horizontal Moving Stepper Track */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_95%,transparent)] py-1 select-none">
        <Stepper value={activeNodeId ?? 0} onValueChange={(id) => {
          setActiveNodeId(id);
          setAutoRotate(false);
        }} className="w-auto">
          
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-0 overflow-x-auto w-full scrollbar-none py-10 flex-row items-center relative"
            style={{ scrollBehavior: "auto" }}
          >
            {[0, 10, 20, 30].map((offset, copyIdx) => (
              <div
                key={`copy-${copyIdx}`}
                className="flex gap-0 items-center flex-row shrink-0"
                aria-hidden={copyIdx > 0 ? "true" : undefined}
              >
                {timelineData.map((item) => {
                  const isActive = activeNodeId === item.id;
                  const pillStyle = PHASE_PILL_STYLES[item.id] ?? PHASE_PILL_STYLES[1];

                  return (
                    <div
                      key={`c${copyIdx}-${item.id}`}
                      ref={(el) => { itemRefs.current[item.id + offset] = el; }}
                      className="shrink-0 flex items-center"
                    >
                      <StepperItem step={item.id} className="flex-row shrink-0 items-center justify-start">
                        <StepperTrigger className={`px-4 py-2 border rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 focus-visible:scale-105 ${
                          isActive 
                            ? `${pillStyle.activeBorder} ${pillStyle.activeBg} ${pillStyle.text} ${pillStyle.activeGlow} scale-105 font-bold` 
                            : "border-white/10 text-white/50 hover:text-white/85 hover:border-white/30"
                        }`}>
                          <StepperIndicator className={`size-5 text-[9px] border-white/20 ${isActive ? pillStyle.text : ""}`}>
                            {item.id}
                          </StepperIndicator>
                          <StepperTitle className="text-xs font-semibold font-heading tracking-wide">
                            {item.title}
                          </StepperTitle>
                        </StepperTrigger>
                        <StepperSeparator className={`w-12 md:w-20 h-0.5 mx-2 transition-colors duration-300 ${
                          isActive ? "bg-gradient-to-r from-cyan-400 to-purple-400" : "bg-white/10"
                        }`} />
                      </StepperItem>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Stepper>
      </div>

      {/* Floating Description Tooltip */}
      {activeNodeId !== null && activeItem && tooltipLeft !== null && !isTimelinePopupOpen && (
        <div 
          className="absolute z-40 -translate-x-1/2 flex flex-col items-center select-none pointer-events-auto transition-all duration-300 ease-out md:hidden"
          style={{
            left: `${tooltipLeft}px`,
            bottom: "calc(100% - 30px)",
            width: "clamp(10rem, 60vw, 12rem)",
          }}
        >
          <div className="border border-cyan-400/40 bg-black/95 text-white rounded-xl p-2.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-xl w-full flex flex-col gap-1 text-center animate-fade-up">
            <span className="text-[7px] font-mono text-cyan-300 uppercase tracking-widest leading-none font-bold">
              {activeItem.date} — {activeItem.status.toUpperCase()}
            </span>
            <h4 className="text-[10px] font-bold text-white font-heading leading-tight">
              {activeItem.title}
            </h4>
            <p className="text-[8px] text-white/80 leading-normal font-light">
              {activeItem.content}
            </p>
          </div>
          <div className="w-1.5 h-1.5 bg-black border-r border-b border-cyan-400/40 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
