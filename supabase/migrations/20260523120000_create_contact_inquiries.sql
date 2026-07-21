-- OORDHWA contact form: feedback, queries, and complaints
-- Run with: supabase db push  (or paste into Supabase SQL Editor)

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

CREATE TYPE public.inquiry_type AS ENUM (
  'feedback',
  'query',
  'complaint'
);

CREATE TYPE public.inquiry_status AS ENUM (
  'new',
  'read',
  'resolved'
);

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submitter (trimmed on insert via trigger)
  name text NOT NULL,

  -- feedback | query | complaint
  inquiry_type public.inquiry_type NOT NULL,

  -- Message body (trimmed on insert via trigger)
  message text NOT NULL,

  -- Workflow status (defaults to new; only admins should change via dashboard)
  status public.inquiry_status NOT NULL DEFAULT 'new',

  -- Where the submission came from
  source text NOT NULL DEFAULT 'website',

  -- Optional request metadata (set by API when available)
  user_agent text,
  page_path text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contact_inquiries_name_length CHECK (
    char_length(trim(name)) >= 2
    AND char_length(name) <= 120
  ),

  CONSTRAINT contact_inquiries_message_length CHECK (
    char_length(trim(message)) >= 10
    AND char_length(message) <= 5000
  ),

  CONSTRAINT contact_inquiries_source_length CHECK (
    char_length(source) >= 1
    AND char_length(source) <= 64
  )
);

COMMENT ON TABLE public.contact_inquiries IS
  'Public contact form submissions: feedback, queries, and complaints from the OORDHWA website.';

COMMENT ON COLUMN public.contact_inquiries.inquiry_type IS
  'Type of submission: feedback, query, or complaint.';

COMMENT ON COLUMN public.contact_inquiries.status IS
  'Internal workflow status. Only updatable by admins via dashboard or service role.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX contact_inquiries_created_at_idx
  ON public.contact_inquiries (created_at DESC);

CREATE INDEX contact_inquiries_inquiry_type_idx
  ON public.contact_inquiries (inquiry_type);

CREATE INDEX contact_inquiries_status_idx
  ON public.contact_inquiries (status);

-- ---------------------------------------------------------------------------
-- Triggers: trim text + maintain updated_at
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.contact_inquiries_normalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.name := trim(NEW.name);
  NEW.message := trim(NEW.message);
  NEW.source := coalesce(nullif(trim(NEW.source), ''), 'website');
  RETURN NEW;
END;
$$;

CREATE TRIGGER contact_inquiries_normalize_trigger
  BEFORE INSERT OR UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.contact_inquiries_normalize();

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

CREATE TRIGGER contact_inquiries_set_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public website: insert only (no read/update/delete for anon)
CREATE POLICY "contact_inquiries_insert_anon"
  ON public.contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    inquiry_type IN ('feedback', 'query', 'complaint')
    AND status = 'new'
    AND source = 'website'
  );

CREATE POLICY "contact_inquiries_insert_authenticated"
  ON public.contact_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    inquiry_type IN ('feedback', 'query', 'complaint')
    AND status = 'new'
    AND source = 'website'
  );

-- No SELECT / UPDATE / DELETE policies for anon or authenticated.
-- View and manage rows in Supabase Dashboard (service_role) or add admin policies later.

-- ---------------------------------------------------------------------------
-- Grants (Data API / PostgREST)
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT INSERT ON TABLE public.contact_inquiries TO anon, authenticated;

-- Optional admin read policy (uncomment after you have admin users in auth.users):
--
-- CREATE POLICY "contact_inquiries_select_admin"
--   ON public.contact_inquiries
--   FOR SELECT
--   TO authenticated
--   USING (
--     coalesce(
--       (auth.jwt() -> 'app_metadata' ->> 'role'),
--       ''
--     ) = 'admin'
--   );
--
-- GRANT SELECT ON TABLE public.contact_inquiries TO authenticated;
