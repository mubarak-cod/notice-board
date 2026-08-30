"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

const THEME = {
  primary: "#42154B",
  primaryDark: "#33103A",
  accent: "#FF8D27",
  onPrimary: "#FFFFFF",
  muted: "#C9AFD1",
};

const DEPARTMENT_NAME = "Computer Science";

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="15" height="11" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.2 5.3 10 10.5l6.8-5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8.2" stroke={THEME.accent} strokeWidth="1.4" />
    <path d="M5.5 9.2 7.8 11.5 12.5 6.5" stroke={THEME.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SubscribeSection() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.from("subscriptions").insert({ email });

    setSubmitting(false);

    if (error) {
      // Unique constraint violation = they already subscribed —
      // treat that as a success, not an error, from their point of view.
      if (error.code === "23505") {
        setSubmitted(true);
        return;
      }
      console.error("Subscribe failed:", error);
      setErrorMsg("Something went wrong. Try again in a moment.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="w-full border-y" style={{ background: THEME.primaryDark, borderColor: THEME.primary }}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide"
              style={{ background: "rgba(255,141,39,0.16)", color: THEME.accent }}
            >
              Never miss a notice
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: THEME.onPrimary }}>
              Get notified the moment {DEPARTMENT_NAME} posts something.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed" style={{ color: THEME.muted }}>
              No account needed. Drop your email and we&apos;ll send you a
              heads-up whenever a new {DEPARTMENT_NAME} notice goes live.
            </p>
          </div>

          <div className="rounded-2xl border p-5 sm:p-6" style={{ background: THEME.primary, borderColor: "rgba(255,255,255,0.12)" }}>
            {submitted ? (
              <div className="flex items-center gap-3 py-3">
                <CheckIcon />
                <div>
                  <p className="text-[14.5px] font-semibold" style={{ color: THEME.onPrimary }}>
                    You&apos;re subscribed
                  </p>
                  <p className="text-[13px]" style={{ color: THEME.muted }}>
                    We&apos;ll email you when a new notice goes live.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {errorMsg && (
                  <p className="text-[13px]" style={{ color: "#FF8D8D" }}>{errorMsg}</p>
                )}
                <div
                  className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
                  style={{ background: THEME.primaryDark, borderColor: "rgba(255,255,255,0.14)" }}
                >
                  <span style={{ color: THEME.muted }}>
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@student.mapoly.edu.ng"
                    className="w-full bg-transparent text-[14px] outline-none"
                    style={{ color: THEME.onPrimary }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 rounded-xl px-4 py-2.5 text-[14px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: THEME.accent, color: THEME.onPrimary }}
                >
                  {submitting ? "Subscribing..." : "Subscribe"}
                </button>

                <p className="text-center text-[12px]" style={{ color: THEME.muted }}>
                  You can unsubscribe anytime. No spam, just notices.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}