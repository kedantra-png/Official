import type { CustomerExperienceInsert } from "@/lib/types/customer-experience";

export type CustomerExperienceFormInput = {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image_url?: string;
};

export type ValidationResult =
  | { ok: true; data: CustomerExperienceInsert }
  | { ok: false; error: string };

const VALID_IMAGE_SRC =
  /^(https:\/\/[^\s/$.?#].[^\s]*|data:image\/[a-z]+;base64,)/i;

export function validateCustomerExperienceForm(
  input: CustomerExperienceFormInput,
  meta?: { userAgent?: string | null; pagePath?: string | null },
): ValidationResult {
  const quote = input.quote?.trim() ?? "";
  const author = input.author?.trim() ?? "";
  const role = input.role?.trim() ?? "";
  const company = input.company?.trim() ?? "";
  const imageUrl = input.image_url?.trim() ?? "";

  if (quote.length < 10 || quote.length > 2000) {
    return {
      ok: false,
      error: "Experience must be between 10 and 2000 characters.",
    };
  }

  if (author.length < 2 || author.length > 120) {
    return {
      ok: false,
      error: "Name must be between 2 and 120 characters.",
    };
  }

  if (role.length > 120) {
    return { ok: false, error: "Role must be 120 characters or fewer." };
  }

  if (company.length > 120) {
    return { ok: false, error: "Company must be 120 characters or fewer." };
  }

  if (imageUrl && !VALID_IMAGE_SRC.test(imageUrl)) {
    return {
      ok: false,
      error: "Image must be a valid https link or an uploaded photo.",
    };
  }

  return {
    ok: true,
    data: {
      quote,
      author,
      role: role || null,
      company: company || null,
      image_url: imageUrl || null,
      source: "website",
      user_agent: meta?.userAgent ?? null,
      page_path: meta?.pagePath ?? null,
    },
  };
}
