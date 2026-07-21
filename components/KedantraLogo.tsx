import { cn } from "@/lib/utils";

interface KedantraLogoProps {
  className?: string;
  size?: "hero" | "compact";
}

const sizeClasses = {
  hero: "text-clamp-logo",
  compact: "text-clamp-logo-compact",
} as const;

export function KedantraLogo({ className, size = "hero" }: KedantraLogoProps) {
  return (
    <p
      className={cn(
        "font-logo font-normal leading-none",
        sizeClasses[size],
        className,
      )}
      aria-label="kedantra"
    >
      <span className="inline-flex items-baseline justify-center">
        <span className="shine-text">ked</span>
        <span className="text-[#b08d57]">a</span>
        <span className="shine-text">ntra</span>
      </span>
    </p>
  );
}
