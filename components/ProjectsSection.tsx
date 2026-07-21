"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Lock, Smartphone, Network, ChevronLeft, ChevronRight, Loader2, FolderKanban } from "lucide-react";
import { FlippingCard } from "@/components/ui/flipping-card";

type DbProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  features: string[];
  sort_order: number;
};

type ProjectDetail = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  icon: React.ReactNode;
};

// Default images for projects without a custom image
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
];

const ICONS = [
  <BrainCircuit key="0" className="size-4 text-white" />,
  <Lock key="1" className="size-4 text-white" />,
  <Smartphone key="2" className="size-4 text-white" />,
  <Network key="3" className="size-4 text-white" />,
];

function pickIcon(index: number): React.ReactNode {
  return ICONS[index % ICONS.length];
}

function mapDbProject(p: DbProject, index: number): ProjectDetail {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    description: p.description,
    image: p.image_url ?? DEFAULT_IMAGES[index % DEFAULT_IMAGES.length],
    features: p.features.length > 0
      ? p.features
      : ["Scalable Core Architecture", "Modern API Endpoints", "Clean UI/UX Design"],
    icon: pickIcon(index),
  };
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch projects from Supabase via API
  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        const mapped = (data.projects as DbProject[] ?? []).map(mapDbProject);
        setProjects(mapped);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < maxScroll - 5);
      }
    }
  };

  // Animate cards in once projects are loaded
  useEffect(() => {
    if (loading || projects.length === 0) return;
    const timers: NodeJS.Timeout[] = [];
    projects.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 150 * i);
      timers.push(timer);
    });

    setTimeout(handleScroll, 200);

    // Hint flip on first card
    const hint1 = setTimeout(() => { setFlippedCardId(projects[0]?.id ?? null); }, 1500);
    const hint2 = setTimeout(() => {
      setFlippedCardId(cur => (cur === projects[0]?.id ? null : cur));
    }, 2800);

    window.addEventListener("resize", handleScroll);
    return () => {
      timers.forEach(t => clearTimeout(t));
      clearTimeout(hint1);
      clearTimeout(hint2);
      window.removeEventListener("resize", handleScroll);
    };
  }, [loading, projects]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 340 + 24;
      const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      id="projects"
      className="section-full relative flex flex-col justify-center pad-section overflow-hidden"
    >
      <div className="mx-auto flex w-full max-w-[clamp(20rem,92vw,76rem)] flex-col gap-section items-center">
        {/* Header */}
        <header className="text-center w-full max-w-2xl px-4 mb-4">
          <p className="text-clamp-small mb-2 font-semibold tracking-[0.25em] text-ternary uppercase">
            Portfolio
          </p>
          <h2 className="font-heading text-clamp-h4 font-bold text-white mb-3">
            Our Projects
          </h2>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-7 animate-spin text-white/20" />
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="size-10 text-white/10 mb-3" strokeWidth={1.25} />
            <p className="text-sm text-white/30">No projects published yet</p>
          </div>
        )}

        {/* Cards */}
        {!loading && projects.length > 0 && (
          <>
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-row gap-6 w-full overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-center transition-all duration-700 ease-out"
                  style={{
                    opacity: animatedOptions.includes(index) ? 1 : 0,
                    transform: animatedOptions.includes(index) ? "translateY(0)" : "translateY(30px)",
                  }}
                >
                  <FlippingCard
                    height={400}
                    isFlipped={flippedCardId === project.id}
                    onFlipToggle={() => {
                      setFlippedCardId(cur => cur === project.id ? null : project.id);
                    }}
                    frontContent={
                      <div
                        className="relative h-full w-full flex flex-col justify-end p-5 rounded-xl overflow-hidden"
                        style={{
                          backgroundImage: `url('${project.image}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-ternary bg-black/60 px-2 py-0.5 rounded-full w-fit border border-white/5">
                            {project.category}
                          </span>
                          <h3 className="font-heading font-bold text-lg text-white">{project.title}</h3>
                          <div className="flex items-center gap-1 text-[10px] text-white/40 mt-1 font-medium">
                            <span>Hover to Flip</span>
                            <span className="animate-pulse">→</span>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 size-8 rounded-full bg-black/75 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                          {project.icon}
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="h-full w-full flex flex-col justify-between p-5 bg-[#0c0c0c]/95 border border-white/5 rounded-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 size-20 rounded-full bg-ternary/15 blur-xl pointer-events-none" />
                        <div className="flex flex-col gap-2 text-left">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                              {project.icon}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-ternary">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-base text-white mt-1">{project.title}</h3>
                          <p className="text-xs text-white/70 leading-relaxed mt-1">{project.description}</p>
                          <ul className="flex flex-col gap-1 mt-2.5">
                            {project.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-[10px] text-white/50">
                                <span className="size-1 rounded-full bg-secondary shrink-0" />
                                <span className="truncate">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/projects/${project.slug}`); }}
                          className="w-full py-2 mt-4 text-[11px] font-bold rounded-lg bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                          Explore Project
                        </button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>

            {/* Scroll Controls */}
            <div className="flex items-center gap-4 mt-6 select-none">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-all duration-300 ${
                  canScrollLeft
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95"
                    : "border-white/5 bg-transparent text-white/20 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="relative w-28 h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-secondary to-ternary rounded-full transition-transform duration-150 ease-out"
                  style={{ width: "40%", transform: `translateX(${scrollProgress * 150}%)` }}
                />
              </div>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border transition-all duration-300 ${
                  canScrollRight
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95"
                    : "border-white/5 bg-transparent text-white/20 cursor-not-allowed"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
