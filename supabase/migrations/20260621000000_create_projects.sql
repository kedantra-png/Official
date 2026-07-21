-- ============================================================================
-- OORDHWA — Projects table
-- Portfolio projects displayed on the homepage projects section.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Table: projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  image_url text,
  features text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT projects_slug_length CHECK (
    char_length(slug) >= 1 AND char_length(slug) <= 128
  ),
  CONSTRAINT projects_title_length CHECK (
    char_length(title) >= 1 AND char_length(title) <= 255
  ),
  CONSTRAINT projects_description_length CHECK (
    char_length(description) >= 1 AND char_length(description) <= 2000
  )
);

COMMENT ON TABLE public.projects IS
  'Portfolio projects shown on the OORDHWA website projects section.';

-- Indexes
CREATE INDEX IF NOT EXISTS projects_published_sort_idx
  ON public.projects (sort_order ASC)
  WHERE is_published = true;
CREATE INDEX IF NOT EXISTS projects_slug_idx
  ON public.projects (slug);

-- ---------------------------------------------------------------------------
-- 2. Trigger: set_updated_at
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can see published projects
DROP POLICY IF EXISTS "projects_select_public" ON public.projects;
CREATE POLICY "projects_select_public"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin full access: service_role bypasses all row-level checks
DROP POLICY IF EXISTS "projects_all_admin" ON public.projects;
CREATE POLICY "projects_all_admin"
  ON public.projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. Grants (Data API access)
-- ---------------------------------------------------------------------------
GRANT SELECT ON TABLE public.projects TO anon, authenticated;
