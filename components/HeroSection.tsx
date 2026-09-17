"use client";

import { PixelHero } from "@/components/PixelHero";
import { lenisRef } from "@/lib/lenis";

export function HeroSection() {
  return (
    <section id="home" className="relative w-full">
      <PixelHero
        description="We design high-performance web systems, custom neural automation pipelines, and native-feeling mobile applications built for scale."
        primaryCta="What We Build"
        primaryCtaMobile="Services"
        secondaryCta="Connect"
        secondaryCtaMobile="Connect"
        onPrimaryClick={() => {
          const el = document.getElementById("capabilities");
          if (el) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(el);
            } else {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
        onSecondaryClick={() => {
          const el = document.getElementById("footer");
          if (el) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(el);
            } else {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
      />
    </section>
  );
}
