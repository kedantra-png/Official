export const INQUIRY_TYPES = ["feedback", "query", "complaint"] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export type ContactInquiryInsert = {
  name: string;
  inquiry_type: InquiryType;
  message: string;
  source?: string;
  user_agent?: string | null;
  page_path?: string | null;
};

export type ContactInquiryRow = ContactInquiryInsert & {
  id: string;
  status: "new" | "read" | "resolved";
  created_at: string;
  updated_at: string;
};
