"use client";

import React, { Suspense, lazy } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load the Spline viewer to prevent blocking the initial SSR load
const Spline = lazy(() => import("@splinetool/react-spline"));

export function AuroraBackground() {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-x-0 top-0 h-[100vh] w-full z-0 overflow-hidden bg-black pointer-events-none">
      {/* 3D Spline Galaxy Container (Skipped on mobile to prevent GPU performance choke) */}
      {isMobile ? (
        <div
          className="absolute inset-0 z-0 bg-black"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.12), rgba(79, 70, 229, 0.08), rgba(0, 0, 0, 1))",
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          <Suspense fallback={<div className="w-full h-full bg-black" />}>
            <Spline
              style={{
                width: "100%",
                height: "100%",
              }}
              scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
            />
          </Suspense>
        </div>
      )}

      {/* Side and Bottom Vignette overlays to blend the 3D particles into our matte black pages */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.85), transparent 25%, transparent 75%, rgba(0, 0, 0, 0.85)),
            linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.95))
          `,
        }}
      />
    </div>
  );
}
