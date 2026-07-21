"use client";

import { useState } from "react";
import {
  Calendar,
  Code,
  FileText,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { DevelopmentPipeline } from "@/components/DevelopmentPipeline";

const developmentTimeline: TimelineItem[] = [
  {
    id: 1,
    title: "Discovery",
    date: "Phase 01",
    content:
      "Requirements gathering, stakeholder workshops, and success metrics for your web or mobile product.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Design",
    date: "Phase 02",
    content:
      "UX flows, UI systems, and technical architecture — aligned with OORDHWA’s secure, scalable standards.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Build",
    date: "Phase 03",
    content:
      "Iterative development: APIs, front-end, AI integrations, and automation with continuous feedback loops.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 4,
    title: "QA & Security",
    date: "Phase 04",
    content:
      "Testing, performance tuning, penetration checks, and compliance validation before release.",
    category: "Quality",
    icon: ShieldCheck,
    relatedIds: [3, 5],
    status: "pending",
    energy: 35,
  },
  {
    id: 5,
    title: "Launch",
    date: "Phase 05",
    content:
      "Deployment, monitoring, handover, and post-launch optimization for long-term reliability.",
    category: "Release",
    icon: Rocket,
    relatedIds: [4],
    status: "pending",
    energy: 15,
  },
];

export function DevelopmentProcessSection() {
  const [timelineActiveNodeId, setTimelineActiveNodeId] = useState<number | null>(null);
  const [pipelineActiveNodeId, setPipelineActiveNodeId] = useState<number | null>(null);

  return (
    <section
      id="process"
      className="h-screen max-h-[100vh] min-h-[580px] bg-black relative flex flex-col justify-between overflow-hidden pt-[clamp(1rem,3vh,2rem)] pb-14 select-none"
    >
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <header className="relative z-20 shrink-0 px-4 text-center">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-1">
          How We Deliver
        </p>
        <h2 className="font-heading text-clamp-h2 font-extrabold text-white leading-tight tracking-tight">
          Iterative Development Process
        </h2>
      </header>

      {/* Middle Container for the Orbital Circle */}
      <div className="relative flex-1 flex items-center justify-center px-4 min-h-0 z-30">
        <div className="w-full max-w-xl h-[clamp(280px,58vh,520px)] flex items-center justify-center relative -translate-y-8 md:translate-y-0">
          <RadialOrbitalTimeline 
            timelineData={developmentTimeline} 
            activeNodeId={timelineActiveNodeId}
            setActiveNodeId={setTimelineActiveNodeId}
            pipelineActiveNodeId={pipelineActiveNodeId}
            className="bg-transparent"
          />
        </div>
      </div>

      {/* Bottom Container for the Pipeline Stepper Marquee */}
      <div className="w-full shrink-0 z-10">
        <DevelopmentPipeline 
          timelineData={developmentTimeline} 
          activeNodeId={pipelineActiveNodeId} 
          setActiveNodeId={setPipelineActiveNodeId} 
          isTimelinePopupOpen={timelineActiveNodeId !== null}
        />
      </div>
    </section>
  );
}
