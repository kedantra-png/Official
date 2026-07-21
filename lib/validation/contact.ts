import {
  INQUIRY_TYPES,
  type ContactInquiryInsert,
  type InquiryType,
} from "@/lib/types/contact";

export type ContactFormInput = {
  name: string;
  type: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; data: ContactInquiryInsert }
  | { ok: false; error: string };

function isInquiryType(value: string): value is InquiryType {
  return INQUIRY_TYPES.includes(value as InquiryType);
}

export function validateContactForm(
  input: ContactFormInput,
  meta?: { userAgent?: string | null; pagePath?: string | null },
): ValidationResult {
  const name = input.name?.trim() ?? "";
  const message = input.message?.trim() ?? "";
  const type = input.type?.trim() ?? "";

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Name must be between 2 and 120 characters." };
  }

  if (!isInquiryType(type)) {
    return {
      ok: false,
      error: "Please select a valid type: feedback, query, or complaint.",
    };
  }

  if (message.length < 10 || message.length > 5000) {
    return {
      ok: false,
      error: "Message must be between 10 and 5000 characters.",
    };
  }

  return {
    ok: true,
    data: {
      name,
      inquiry_type: type,
      message,
      source: "website",
      user_agent: meta?.userAgent ?? null,
      page_path: meta?.pagePath ?? null,
    },
  };
}
