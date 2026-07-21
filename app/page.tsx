import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { CustomerExperiencesSection } from "@/components/CustomerExperiencesSection";
import { DevelopmentProcessSection } from "@/components/DevelopmentProcessSection";
import { FaqSection } from "@/components/FaqSection";
import { HeroSection } from "@/components/HeroSection";
import { OordhwaFooter } from "@/components/OordhwaFooter";
import { SiteNav } from "@/components/MenuBar";
import { VisionMissionSection } from "@/components/VisionMissionSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <SiteNav />
      <div className="relative z-10">
        <HeroSection />
        <VisionMissionSection />
        <CapabilitiesSection />
        <DevelopmentProcessSection />
        <FaqSection />
        <CustomerExperiencesSection />
        <OordhwaFooter />
      </div>
    </main>
  );
}
