-- Upgrade path if you already ran the earlier migration that included `email`.
-- Safe to run on a fresh DB (no-op when column does not exist).

ALTER TABLE public.contact_inquiries
  DROP COLUMN IF EXISTS email;

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
