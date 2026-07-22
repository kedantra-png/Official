-- ============================================================================
-- OORDHWA - COMPLETE SUPABASE DATABASE SETUP & FULL SECURITY POLICIES
-- ============================================================================
-- Run this ENTIRE file in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Helper Functions & Shared Triggers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Admin Authentication (`admin_users` & RPC verification)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT admin_users_email_check CHECK (
    char_length(email) >= 5 AND char_length(email) <= 255
  )
);

COMMENT ON TABLE public.admin_users IS
  'Administrator credentials used by the /admin login panel.';

-- Seed / Update Admin User credentials with email oordhwa2026@gmail.com and password aardhwo@2026
INSERT INTO public.admin_users (email, password_hash)
VALUES ('oordhwa2026@gmail.com', crypt('aardhwo@2026', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('aardhwo@2026', gen_salt('bf'));

-- Also keep legacy oordhwa@gmail.com if previously inserted or update it
INSERT INTO public.admin_users (email, password_hash)
VALUES ('oordhwa@gmail.com', crypt('aardhwo@2026', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('aardhwo@2026', gen_salt('bf'));

-- Enable RLS on admin_users table (Service role only access)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_service_role_only" ON public.admin_users;
CREATE POLICY "admin_users_service_role_only"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC Function for verifying admin login securely without exposing hashes
CREATE OR REPLACE FUNCTION public.verify_admin_password(email text, password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.email = verify_admin_password.email
    AND admin_users.password_hash = crypt(verify_admin_password.password, admin_users.password_hash)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_admin_password TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Table: `contact_inquiries`
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.inquiry_type AS ENUM ('feedback', 'query', 'complaint');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inquiry_status AS ENUM ('new', 'read', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  email text,
  inquiry_type public.inquiry_type NOT NULL DEFAULT 'query',
  message text NOT NULL,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'website',
  user_agent text,
  page_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contact_inquiries_phone_length CHECK (
    phone IS NULL OR (char_length(trim(phone)) >= 7 AND char_length(phone) <= 30)
  ),
  CONSTRAINT contact_inquiries_message_length CHECK (
    char_length(trim(message)) >= 5 AND char_length(message) <= 5000
  ),
  CONSTRAINT contact_inquiries_source_length CHECK (
    char_length(source) >= 1 AND char_length(source) <= 64
  )
);

ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS email text;

COMMENT ON TABLE public.contact_inquiries IS
  'Public contact form submissions: feedback, queries, and complaints.';

CREATE INDEX IF NOT EXISTS contact_inquiries_created_at_idx ON public.contact_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_inquiries_inquiry_type_idx ON public.contact_inquiries (inquiry_type);
CREATE INDEX IF NOT EXISTS contact_inquiries_status_idx ON public.contact_inquiries (status);

CREATE OR REPLACE FUNCTION public.contact_inquiries_normalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.name IS NOT NULL THEN
    NEW.name := trim(NEW.name);
  END IF;
  IF NEW.phone IS NOT NULL THEN
    NEW.phone := trim(NEW.phone);
  END IF;
  NEW.message := trim(NEW.message);
  NEW.source := coalesce(nullif(trim(NEW.source), ''), 'website');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_inquiries_normalize_trigger ON public.contact_inquiries;
CREATE TRIGGER contact_inquiries_normalize_trigger
  BEFORE INSERT OR UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.contact_inquiries_normalize();

DROP TRIGGER IF EXISTS contact_inquiries_set_updated_at ON public.contact_inquiries;
CREATE TRIGGER contact_inquiries_set_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_inquiries_insert_anon" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_insert_anon"
  ON public.contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    inquiry_type IN ('feedback', 'query', 'complaint')
    AND status = 'new'
    AND source = 'website'
  );

DROP POLICY IF EXISTS "contact_inquiries_insert_authenticated" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_insert_authenticated"
  ON public.contact_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    inquiry_type IN ('feedback', 'query', 'complaint')
    AND status = 'new'
    AND source = 'website'
  );

DROP POLICY IF EXISTS "contact_inquiries_all_service_role" ON public.contact_inquiries;
CREATE POLICY "contact_inquiries_all_service_role"
  ON public.contact_inquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. Table: `customer_experiences`
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  role text,
  company text,
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  source text NOT NULL DEFAULT 'website',
  user_agent text,
  page_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT customer_experiences_quote_length CHECK (
    char_length(trim(quote)) >= 10 AND char_length(quote) <= 2000
  ),
  CONSTRAINT customer_experiences_author_length CHECK (
    char_length(trim(author)) >= 2 AND char_length(author) <= 120
  ),
  CONSTRAINT customer_experiences_role_length CHECK (
    role IS NULL OR char_length(role) <= 120
  ),
  CONSTRAINT customer_experiences_company_length CHECK (
    company IS NULL OR char_length(company) <= 120
  ),
  CONSTRAINT customer_experiences_source_length CHECK (
    char_length(source) >= 1 AND char_length(source) <= 64
  )
);

COMMENT ON TABLE public.customer_experiences IS
  'Public customer experience quotes shown on the website carousel.';

CREATE INDEX IF NOT EXISTS customer_experiences_created_at_idx ON public.customer_experiences (created_at DESC);
CREATE INDEX IF NOT EXISTS customer_experiences_published_idx ON public.customer_experiences (is_published) WHERE is_published = true;

CREATE OR REPLACE FUNCTION public.customer_experiences_normalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.quote := trim(NEW.quote);
  NEW.author := trim(NEW.author);
  NEW.role := nullif(trim(coalesce(NEW.role, '')), '');
  NEW.company := nullif(trim(coalesce(NEW.company, '')), '');
  NEW.image_url := nullif(trim(coalesce(NEW.image_url, '')), '');
  NEW.source := coalesce(nullif(trim(NEW.source), ''), 'website');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customer_experiences_normalize_trigger ON public.customer_experiences;
CREATE TRIGGER customer_experiences_normalize_trigger
  BEFORE INSERT OR UPDATE ON public.customer_experiences
  FOR EACH ROW EXECUTE FUNCTION public.customer_experiences_normalize();

DROP TRIGGER IF EXISTS customer_experiences_set_updated_at ON public.customer_experiences;
CREATE TRIGGER customer_experiences_set_updated_at
  BEFORE UPDATE ON public.customer_experiences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.customer_experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customer_experiences_select_public" ON public.customer_experiences;
CREATE POLICY "customer_experiences_select_public"
  ON public.customer_experiences
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "customer_experiences_insert_anon" ON public.customer_experiences;
CREATE POLICY "customer_experiences_insert_anon"
  ON public.customer_experiences
  FOR INSERT
  TO anon
  WITH CHECK (
    is_published = true
    AND source = 'website'
  );

DROP POLICY IF EXISTS "customer_experiences_insert_authenticated" ON public.customer_experiences;
CREATE POLICY "customer_experiences_insert_authenticated"
  ON public.customer_experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_published = true
    AND source = 'website'
  );

DROP POLICY IF EXISTS "customer_experiences_all_service_role" ON public.customer_experiences;
CREATE POLICY "customer_experiences_all_service_role"
  ON public.customer_experiences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 5. Table: `projects`
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  image_url text,
  gallery_images text[] NOT NULL DEFAULT '{}',
  video_url text,
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

-- Ensure gallery_images & video_url columns exist if table was previously created
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url text;

COMMENT ON TABLE public.projects IS
  'Portfolio projects shown on the website projects section.';

CREATE INDEX IF NOT EXISTS projects_published_sort_idx ON public.projects (sort_order ASC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects (slug);

DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_public" ON public.projects;
CREATE POLICY "projects_select_public"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "projects_all_admin" ON public.projects;
CREATE POLICY "projects_all_admin"
  ON public.projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 6. Schema & Data API Grants
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT INSERT ON TABLE public.contact_inquiries TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.customer_experiences TO anon, authenticated;
GRANT SELECT ON TABLE public.projects TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 7. Verification Statements
-- ---------------------------------------------------------------------------
-- Verify admin password verification:
SELECT public.verify_admin_password('oordhwa2026@gmail.com', 'aardhwo@2026') AS admin_auth_valid;
