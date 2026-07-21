-- Admin users table — credentials stored with pgcrypt hash.
-- Passwords are compared inside Postgres via crypt(), never in app code.
-- Access is exposed through a SECURITY DEFINER RPC function so the
-- API route can verify credentials without holding the service_role key.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  'Administrator credentials used by the /admin login panel. Manage rows via Supabase Dashboard SQL Editor.';

-- Seed the default admin user.
INSERT INTO public.admin_users (email, password_hash)
VALUES ('oordhwa2026@gmail.com', crypt('aardhwo@2026', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('aardhwo@2026', gen_salt('bf'));

INSERT INTO public.admin_users (email, password_hash)
VALUES ('oordhwa@gmail.com', crypt('aardhwo@2026', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('aardhwo@2026', gen_salt('bf'));

-- RLS: only service_role can touch the table directly
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_service_role_only"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Secure RPC: anon can call this to verify credentials.
-- SECURITY DEFINER lets it bypass RLS on admin_users.
-- The function only returns a boolean — never exposes the hash.
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

-- Verification query (run in SQL Editor after migration):
--   SELECT verify_admin_password('oordhwa@gmail.com', 'oordhwa');
