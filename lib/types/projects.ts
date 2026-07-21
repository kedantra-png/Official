export type ProjectInsert = {
  slug: string;
  title: string;
  category: string;
  description: string;
  tags?: string[];
  image_url?: string | null;
  features?: string[];
  is_published?: boolean;
  sort_order?: number;
};

export type ProjectRow = ProjectInsert & {
  id: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
