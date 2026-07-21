-- Customer experiences (public testimonials / feedback carousel)

CREATE TABLE public.customer_experiences (
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
    char_length(trim(quote)) >= 10
    AND char_length(quote) <= 2000
  ),

  CONSTRAINT customer_experiences_author_length CHECK (
    char_length(trim(author)) >= 2
    AND char_length(author) <= 120
  ),

  CONSTRAINT customer_experiences_role_length CHECK (
    role IS NULL
    OR char_length(role) <= 120
  ),

  CONSTRAINT customer_experiences_company_length CHECK (
    company IS NULL
    OR char_length(company) <= 120
  ),

  CONSTRAINT customer_experiences_source_length CHECK (
    char_length(source) >= 1
    AND char_length(source) <= 64
  )
);

COMMENT ON TABLE public.customer_experiences IS
  'Public customer experience quotes shown on the OORDHWA website carousel.';

CREATE INDEX customer_experiences_created_at_idx
  ON public.customer_experiences (created_at DESC);

CREATE INDEX customer_experiences_published_idx
  ON public.customer_experiences (is_published)
  WHERE is_published = true;

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

CREATE TRIGGER customer_experiences_normalize_trigger
  BEFORE INSERT OR UPDATE ON public.customer_experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.customer_experiences_normalize();

CREATE TRIGGER customer_experiences_set_updated_at
  BEFORE UPDATE ON public.customer_experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.customer_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_experiences_select_public"
  ON public.customer_experiences
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "customer_experiences_insert_anon"
  ON public.customer_experiences
  FOR INSERT
  TO anon
  WITH CHECK (
    is_published = true
    AND source = 'website'
  );

CREATE POLICY "customer_experiences_insert_authenticated"
  ON public.customer_experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_published = true
    AND source = 'website'
  );

GRANT SELECT, INSERT ON TABLE public.customer_experiences TO anon, authenticated;
