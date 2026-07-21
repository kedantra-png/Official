import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env: set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_* equivalents).",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Admin client using the service_role key — bypasses RLS entirely.
 * ONLY use in server-side API routes, never in client components.
 * Requires SUPABASE_SERVICE_ROLE_KEY in env.
 */
export function createSupabaseAdminClient() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isPlaceholder =
    !rawServiceKey ||
    rawServiceKey.includes("service_role_key_here") ||
    rawServiceKey.trim() === "";

  const serviceKey = isPlaceholder
    ? (process.env.SUPABASE_ANON_KEY ??
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    : rawServiceKey;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
