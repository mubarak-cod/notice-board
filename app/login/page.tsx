"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { THEME, LOGO_URL, SCHOOL_NAME, DEPARTMENT_NAME } from "@/lib/Theme";
// import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/Supabase";


/* ---------- Custom SVG icons ---------- */

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M6 8V5.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.2 5.2 9 9.5l5.8-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }

    setLoading(true);
    // const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password. Try again.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "#FAFAF7" }}>
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={LOGO_URL}
            alt="School crest"
            className="h-14 w-14 rounded-full object-contain bg-white ring-1 ring-black/5 p-0.5"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
          <p className="mt-3 text-[13px] font-medium" style={{ color: "#5B5F73" }}>
            {SCHOOL_NAME}
          </p>
          <h1 className="mt-1 text-[19px] font-bold tracking-tight" style={{ color: "#1F2430" }}>
            {DEPARTMENT_NAME} Notice Board
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "#5B5F73" }}>
            Staff login
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border p-6"
          style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
        >
          {error && (
            <div
              className="rounded-lg px-3 py-2 text-[13px]"
              style={{ background: "rgba(226,75,74,0.08)", color: "#A32D2D" }}
            >
              {error}
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium" style={{ color: "#1F2430" }}>Email</span>
            <div
              className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
              style={{ borderColor: "#D8D5CC" }}
            >
              <span style={{ color: "#5B5F73" }}><MailIcon /></span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mapoly.edu.ng"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9a9890]"
                style={{ color: "#1F2430" }}
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium" style={{ color: "#1F2430" }}>Password</span>
            <div
              className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
              style={{ borderColor: "#D8D5CC" }}
            >
              <span style={{ color: "#5B5F73" }}><LockIcon /></span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9a9890]"
                style={{ color: "#1F2430" }}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl px-4 py-2.5 text-[14px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: THEME.accent, color: THEME.onPrimary }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-[12.5px]" style={{ color: "#5B5F73" }}>
          Only for authorized {DEPARTMENT_NAME} staff.
        </p>
      </div>
    </div>
  );
}