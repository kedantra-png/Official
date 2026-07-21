import { SiteNav } from "@/components/MenuBar";
import { OordhwaFooter } from "@/components/OordhwaFooter";
import { ExperiencePageClient } from "./ExperiencePageClient";

export const metadata = {
  title: "Customer Experiences | Oordhwa",
  description: "Real stories from teams we work with. Share how OORDHWA helped your project.",
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
