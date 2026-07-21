"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, ChevronLeft, ChevronRight,
  Tag, Zap, X, Home,
} from "lucide-react";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  video_url: string | null;
  gallery_images: string[];
  features: string[];
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";

function VideoPlayer({ url }: { url: string }) {
  if (!url) return null;
  
  let embedUrl = url;
  if (url.includes("youtube.com/watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
  } else if (url.includes("vimeo.com/")) {
    embedUrl = url.replace("vimeo.com/", "player.vimeo.com/video/");
  }

  // Check if it's a raw video file (ignoring query parameters like ?t=123)
  const isRawVideo = url.match(/\.(mp4|webm|ogg)(\?.*)?$/i);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative mt-12 mb-4 shadow-2xl">
      {isRawVideo ? (
        <video src={url} controls className="w-full h-full object-cover bg-black" />
      ) : (
        <iframe
          src={embedUrl}
          className="w-full h-full absolute inset-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

export function ProjectDetailClient({ project }: { project: Project }) {
  // Build full image list: cover first, then gallery extras
  const allImages = [
    project.image_url ?? DEFAULT_IMAGE,
    ...(project.gallery_images ?? []),
  ].filter(Boolean);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(allImages.length - 1, i + 1));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Project image"
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      {/* Top nav */}
      <nav className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          title="Back to Home"
        >
          <Home className="size-4" />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">
            {project.category}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero image gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/5 group cursor-zoom-in"
            onClick={() => setLightbox(allImages[activeIdx])}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeIdx]}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  disabled={activeIdx === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  disabled={activeIdx === allImages.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="size-5" />
                </button>
                {/* Counter */}
                <span className="absolute bottom-3 right-4 text-xs text-white/60 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  {activeIdx + 1} / {allImages.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === activeIdx
                      ? "border-white/60 scale-105"
                      : "border-white/10 opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#a78bfa] mb-2">
              {project.category}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {project.title}
            </h1>
          </div>
          <Link
            href="/#contact"
            className="flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
          >
            <ExternalLink className="size-4" /> Get in Touch
          </Link>
        </div>

        {/* Video Player */}
        {project.video_url && <VideoPlayer url={project.video_url} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Description + Tags */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-3">
                Overview
              </h2>
              <p className="text-white/70 leading-relaxed text-base">
                {project.description}
              </p>
            </div>

            {project.tags.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                  <Tag className="size-3.5" /> Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium hover:border-[#a78bfa]/40 hover:text-[#a78bfa] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features sidebar */}
          {project.features.length > 0 && (
            <div className="lg:col-span-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                <Zap className="size-3.5" /> Key Features
              </h2>
              <ul className="space-y-2">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/60 leading-relaxed"
                  >
                    <span className="mt-1.5 size-1.5 rounded-full bg-[#a78bfa] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bold text-white text-lg">Interested in this project?</p>
            <p className="text-sm text-white/40 mt-0.5">
              Let&apos;s talk about how we can build something similar for you.
            </p>
          </div>
          <Link
            href="/#contact"
            className="flex items-center gap-2 rounded-xl bg-[#a78bfa] text-white px-6 py-3 text-sm font-bold hover:bg-[#8b5cf6] transition-colors shrink-0"
          >
            Contact Us <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
