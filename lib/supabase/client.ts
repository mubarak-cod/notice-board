import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase browser env vars are missing; browser client is unavailable.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/*
 * Single shared Supabase client for the browser.
 *
 * The client is created defensively so build-time prerendering cannot crash when
 * these public env vars are temporarily absent.
 */
export const supabase = getSupabaseClient();

// Alias, in case anything else in the project imports { createClient }
export function createClient() {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return client;
}