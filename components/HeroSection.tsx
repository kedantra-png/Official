"use client";

import { PixelHero } from "@/components/PixelHero";

export function HeroSection() {
  return (
    <section id="home" className="relative w-full">
      <PixelHero
        description="We design high-performance web systems, custom neural automation pipelines, and native-feeling mobile applications built for scale."
        primaryCta="Explore Capabilities"
        primaryCtaMobile="Capabilities"
        secondaryCta="View Projects"
        secondaryCtaMobile="Projects"
        onPrimaryClick={() => {
          document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
        }}
        onSecondaryClick={() => {
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </section>
  );
}
