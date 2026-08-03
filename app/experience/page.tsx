import { SiteNav } from "@/components/MenuBar";
import { OordhwaFooter } from "@/components/OordhwaFooter";
import { ExperiencePageClient } from "./ExperiencePageClient";

export const metadata = {
  title: "Customer Experiences | Oordhwa Tech Solutions (Urdhva Tech)",
  description: "Real stories and reviews from teams we work with. Share how OORDHWA (Urdhva Tech Solutions) helped transform your project.",
  keywords: [
    "Customer Experiences",
    "Oordhwa Reviews",
    "Urdhva Tech Reviews",
    "Urdhva",
    "urdhva",
    "Urdhva Tech",
    "Oordhwa",
    "Kundapura tech company",
  ],
};

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <SiteNav />
      <div className="relative z-10 pt-20">
        <ExperiencePageClient />
      </div>
      <OordhwaFooter />
    </main>
  );
}
