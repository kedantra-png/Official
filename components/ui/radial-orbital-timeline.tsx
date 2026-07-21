"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

// Phase color mapping for high visual vibrancy
const PHASE_COLORS: Record<number, { text: string; bg: string; border: string; glow: string; gradient: string }> = {
  1: {
    text: "text-cyan-400",
    bg: "bg-cyan-500",
    border: "border-cyan-400",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.7)]",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  2: {
    text: "text-purple-400",
    bg: "bg-purple-500",
    border: "border-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.7)]",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  3: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.7)]",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
  },
  4: {
    text: "text-blue-400",
    bg: "bg-blue-500",
    border: "border-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.7)]",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },
  5: {
    text: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.7)]",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
};

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
  activeNodeId?: number | null;
  setActiveNodeId?: (id: number | null) => void;
  pipelineActiveNodeId?: number | null;
  autoRotate?: boolean;
  setAutoRotate?: (val: boolean) => void;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className = "",
  activeNodeId: externalActiveNodeId,
  setActiveNodeId: externalSetActiveNodeId,
  pipelineActiveNodeId = null,
  autoRotate: externalAutoRotate,
  setAutoRotate: externalSetAutoRotate,
}: RadialOrbitalTimelineProps) {
  const viewMode = "orbital" as const;
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [internalAutoRotate, setInternalAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [internalActiveNodeId, setInternalActiveNodeId] = useState<number | null>(null);

  const activeNodeId = externalActiveNodeId !== undefined ? externalActiveNodeId : internalActiveNodeId;
  const setActiveNodeId = externalSetActiveNodeId !== undefined ? externalSetActiveNodeId : setInternalActiveNodeId;
  const autoRotate = externalAutoRotate !== undefined ? externalAutoRotate : internalAutoRotate;
  const setAutoRotate = externalSetAutoRotate !== undefined ? externalSetAutoRotate : setInternalAutoRotate;

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const prevSizeRef = useRef({ width: 0, height: 0 });

  const orbitRadius = useMemo(() => {
    const isMobile = containerSize.width < 640;
    const available = Math.min(containerSize.width, containerSize.height);
    if (isMobile) {
      return Math.min(180, containerSize.width / 2 - 20);
    }
    return Math.min(280, available / 2 - 25);
  }, [containerSize]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const w = Math.round(width);
        const h = Math.round(height);

        const dw = Math.abs(w - prevSizeRef.current.width);
        const dh = Math.abs(h - prevSizeRef.current.height);

        if (dw > 5 || dh > 80 || prevSizeRef.current.width === 0) {
          prevSizeRef.current = { width: w, height: h };
          setContainerSize({ width: w, height: h });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (activeNodeId === id && !autoRotate) {
      setAutoRotate(true);
    } else {
      setActiveNodeId(id);
      setAutoRotate(false);
      centerViewOnNode(id);
    }
  };

  useEffect(() => {
    if (autoRotate) return;
    const timer = setTimeout(() => {
      setAutoRotate(true);
      setActiveNodeId(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [autoRotate, setActiveNodeId]);

  useEffect(() => {
    if (activeNodeId !== null && activeNodeId !== undefined) {
      setAutoRotate(false);

      const relatedItems = getRelatedItems(activeNodeId);
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);
      
      if (mounted) {
        const timer = setTimeout(() => centerViewOnNode(activeNodeId), 50);
        return () => clearTimeout(timer);
      }
    } else {
      setPulseEffect({});
    }
  }, [activeNodeId, mounted]);

  useEffect(() => {
    if (!mounted || !autoRotate || viewMode !== "orbital") return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const updateRotation = (time: number) => {
      const deltaTime = Math.min(time - lastTime, 100);
      lastTime = time;

      setRotationAngle((prev) => (prev + deltaTime * 0.006) % 360);

      animationFrameId = requestAnimationFrame(updateRotation);
    };

    animationFrameId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mounted, autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital") return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex === -1) return;
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = orbitRadius;
    const radian = (angle * Math.PI) / 180;

    const x = Math.round(radius * Math.cos(radian) * 100) / 100;
    const y = Math.round(radius * Math.sin(radian) * 100) / 100;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity =
      Math.round(
        Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(radian)) / 2))) *
          1000,
      ) / 1000;

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center overflow-visible ${className}`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="absolute flex h-full w-full items-center justify-center transition-transform duration-700 ease-out"
          ref={orbitRef}
          style={{
            perspective: "1000px",
          }}
        >
          {/* Neon Orbital Ring Trace */}
          <div
            className="absolute rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-pulse"
            style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
          />

          {/* Inner Cyan Secondary Ring */}
          <div
            className="absolute rounded-full border border-purple-500/20"
            style={{ width: orbitRadius * 1.4, height: orbitRadius * 1.4 }}
          />

          {/* Central Pulsing Energetic Core */}
          <div
            className="absolute z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_35px_rgba(6,182,212,0.8)] animate-pulse"
            style={{ width: orbitRadius * 0.28, height: orbitRadius * 0.28 }}
          >
            <div
              className="absolute animate-ping rounded-full border border-cyan-300 opacity-60"
              style={{ width: orbitRadius * 0.38, height: orbitRadius * 0.38 }}
            />
            <div
              className="rounded-full bg-black/90 border border-white/60 flex items-center justify-center shadow-inner"
              style={{ width: orbitRadius * 0.14, height: orbitRadius * 0.14 }}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            </div>
          </div>

          {!mounted && (
            <p className="absolute text-sm text-white/40">Loading timeline…</p>
          )}

          {mounted &&
            timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isActive = activeNodeId === item.id;
              const isPipelineActive = pipelineActiveNodeId === item.id;
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const Icon = item.icon;
              const theme = PHASE_COLORS[item.id] ?? PHASE_COLORS[1];

              const nodeStyle: CSSProperties = {
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isActive ? 200 : position.zIndex,
                opacity: isActive ? 1 : position.opacity,
              };

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    nodeRefs.current[item.id] = el;
                  }}
                  className={`absolute cursor-pointer flex flex-col items-center ${
                    autoRotate ? "transition-none" : "transition-all duration-700 ease-out"
                  }`}
                  style={nodeStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                >
                  {/* Energy Aura Pulse */}
                  <div
                    className={`absolute -inset-1 rounded-full ${
                      isPulsing || isActive ? "animate-pulse duration-1000" : ""
                    }`}
                    style={{
                      background: `radial-gradient(circle, ${
                        isActive ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.15)"
                      } 0%, rgba(0,0,0,0) 70%)`,
                      width: `${item.energy * 0.35 + 40}px`,
                      height: `${item.energy * 0.35 + 40}px`,
                      left: `-${(item.energy * 0.35 + 40 - 36) / 2}px`,
                      top: `-${(item.energy * 0.35 + 40 - 36) / 2}px`,
                    }}
                  />

                  {/* Node Icon Sphere */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? `scale-125 border-white ${theme.bg} text-white ${theme.glow}`
                        : isPipelineActive
                          ? `border-white ${theme.text} ${theme.glow} scale-110`
                          : isRelated
                            ? "animate-pulse border-cyan-400 bg-cyan-950/80 text-cyan-300"
                            : "border-white/20 bg-black/80 text-white/70 hover:border-cyan-400 hover:text-cyan-300 hover:scale-110"
                    }`}
                  >
                    <Icon size={14} />
                  </div>

                  {/* Title Label */}
                  <div
                    className={`absolute top-11 whitespace-nowrap text-[9.5px] font-semibold tracking-wider transition-all duration-300 ${
                      isActive
                        ? `scale-110 ${theme.text} font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]`
                        : "text-white/60"
                    }`}
                  >
                    {item.title}
                  </div>

                  {/* Interactive Glass Detail Popup */}
                  {isActive && (
                    <Card className="absolute top-16 left-1/2 w-[clamp(12rem,75vw,16rem)] max-h-[240px] -translate-x-1/2 overflow-y-auto border-cyan-500/40 bg-black/95 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-2xl z-50 pointer-events-auto select-none rounded-2xl">
                      <div className="absolute -top-3 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-cyan-400" />
                      <CardHeader className="pb-1.5 px-3.5 pt-3.5">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`px-2 py-0.5 text-[8.5px] font-mono leading-none border uppercase tracking-wider ${theme.text} bg-cyan-950/60 border-cyan-400/40`}
                          >
                            {item.date} — {item.status}
                          </Badge>
                          <span className="font-mono text-[8px] text-cyan-300/80 font-bold">
                            PHASE 0{item.id}
                          </span>
                        </div>
                        <CardTitle className={`mt-1.5 text-xs font-bold font-heading ${theme.text}`}>
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-[9.5px] text-white/80 px-3.5 pb-3.5 pt-0">
                        <p className="leading-relaxed font-light">{item.content}</p>

                        {/* Energy Level Bar */}
                        <div className="mt-3 border-t border-white/10 pt-2.5">
                          <div className="mb-1 flex items-center justify-between text-[9px]">
                            <span className="flex items-center text-cyan-300 font-mono">
                              <Zap size={9} className="mr-1 text-yellow-400 animate-bounce" />
                              Phase Momentum
                            </span>
                            <span className="font-mono font-bold text-white">{item.energy}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 border border-white/10">
                            <div
                              className={`h-full bg-gradient-to-r ${theme.gradient}`}
                              style={{ width: `${item.energy}%` }}
                            />
                          </div>
                        </div>

                        {item.relatedIds.length > 0 && (
                          <div className="mt-2.5 border-t border-white/10 pt-2">
                            <div className="mb-1 flex items-center">
                              <Link size={8} className="mr-1 text-cyan-400" />
                              <h4 className="text-[8px] font-mono font-semibold tracking-wider text-cyan-300 uppercase">
                                Connected Next Steps
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.relatedIds.map((relatedId) => {
                                const relatedItem = timelineData.find(
                                  (i) => i.id === relatedId,
                                );
                                return (
                                  <Button
                                    key={relatedId}
                                    variant="outline"
                                    size="sm"
                                    className="flex h-5 items-center rounded-md border-cyan-500/30 bg-cyan-950/40 px-2 py-0 text-[8px] text-cyan-200 transition-all hover:bg-cyan-500/20 hover:border-cyan-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(relatedId);
                                    }}
                                  >
                                    {relatedItem?.title}
                                    <ArrowRight
                                      size={7}
                                      className="ml-1 text-cyan-400"
                                    />
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
