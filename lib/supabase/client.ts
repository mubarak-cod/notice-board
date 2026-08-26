import { createClient } from "@supabase/supabase-js";

/*
 * Single shared Supabase client for the browser.
 * Needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 * .env.local — both come from your Supabase dashboard:
 * Project Settings → API.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);