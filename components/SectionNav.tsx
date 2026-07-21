"use client";

const sections = [
  { id: "home", label: "Home" },
  { id: "vision", label: "Vision" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Experiences" },
] as const;

export function SectionNav() {
  return (
    <nav
      aria-label="Page sections"
      className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-[clamp(0.5rem,1.2vw,0.875rem)] pr-[clamp(0.75rem,2vw,1.25rem)] md:flex"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          title={section.label}
          className="group flex items-center justify-end gap-2"
        >
          <span className="text-clamp-small translate-x-2 rounded-md bg-primary/90 px-2 py-0.5 font-medium text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
            {section.label}
          </span>
          <span className="block size-[clamp(0.5rem,0.9vw,0.625rem)] rounded-full border-2 border-primary/25 bg-primary/15 shadow-sm transition-all duration-300 group-hover:scale-125 group-hover:border-ternary group-hover:bg-ternary group-focus-visible:scale-125 group-focus-visible:border-ternary group-focus-visible:bg-ternary" />
        </a>
      ))}
    </nav>
  );
}
