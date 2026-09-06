"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { THEME } from "@/lib/Theme";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (!supabase) return;

    setPending(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      aria-label="Log out"
      title="Log out"
      className="flex h-10 w-10 items-center justify-center rounded-md transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-60"
      style={{ color: THEME.onPrimary }}
    >
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M8.2 3.2H5.1A1.6 1.6 0 0 0 3.5 4.8v10.4a1.6 1.6 0 0 0 1.6 1.6h3.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.5 6.5 14 10l-3.5 3.5M14 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}