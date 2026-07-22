-- Add phone column and adjust name requirements for contact inquiries
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS phone text;

-- Make name column nullable since we are collecting phone number instead
ALTER TABLE public.contact_inquiries ALTER COLUMN name DROP NOT NULL;

-- Remove the old name length constraint
ALTER TABLE public.contact_inquiries DROP CONSTRAINT IF EXISTS contact_inquiries_name_length;

-- Add a validation constraint for the phone number field (length check between 7 and 30 characters)
ALTER TABLE public.contact_inquiries ADD CONSTRAINT contact_inquiries_phone_length CHECK (
  phone IS NULL OR (char_length(trim(phone)) >= 7 AND char_length(phone) <= 30)
);

-- Update the normalization trigger to safely handle name and phone normalization
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
