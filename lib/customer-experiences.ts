import type { CustomerExperienceCard } from "@/lib/types/customer-experience";

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
];

export function pickDefaultAvatar(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % DEFAULT_AVATARS.length;
  }
  return DEFAULT_AVATARS[hash] ?? DEFAULT_AVATARS[0];
}

export function mapRowToCard(row: {
  id: string;
  quote: string;
  author: string;
  role?: string | null;
  company?: string | null;
  image_url?: string | null;
}): CustomerExperienceCard {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    role: row.role ?? "",
    company: row.company ?? "",
    image: row.image_url ?? "/default.jfif",
  };
}
