// Place at PROJECT ROOT (same level as package.json), or src/ if you
// used the src/ directory option.
//
// Updated matcher: your actual routes have NO "/admin" prefix (you're
// using a (admin) route GROUP, which organizes files without adding
// a URL segment) — so we match the real paths directly instead.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// Matches your REAL protected paths: /dashboard and everything under
// it, plus /notices/new and /notices/*/edit. Deliberately does NOT
// match a plain /notices/[slug] — that route (when you build it) is
// the PUBLIC notice detail page and must stay open to everyone.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/notices/new",
    "/notices/:path*/edit",
  ],
};