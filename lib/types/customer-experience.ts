export type CustomerExperienceInsert = {
  quote: string;
  author: string;
  role?: string | null;
  company?: string | null;
  image_url?: string | null;
  source?: string;
  user_agent?: string | null;
  page_path?: string | null;
};

export type CustomerExperienceRow = CustomerExperienceInsert & {
  id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerExperienceCard = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
};
