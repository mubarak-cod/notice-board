import { createBrowserClient } from "@supabase/ssr";

/*
 * Single shared Supabase client for the browser.
 *
 * IMPORTANT: this uses createBrowserClient from @supabase/ssr, NOT
 * createClient from @supabase/supabase-js. The plain supabase-js
 * client stores the session in localStorage, which your server
 * (middleware, Server Actions) can never read. createBrowserClient
 * stores the session in COOKIES instead, which is what lets your
 * server-side code actually know who's logged in.
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 * .env.local — both come from Supabase dashboard: Settings → API.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Alias, in case anything else in the project imports { createClient }
export function createClient() {
  return supabase;
}