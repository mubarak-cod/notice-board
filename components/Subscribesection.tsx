"use client";

import { useEffect, useState, type FormEvent } from "react";
import { THEME, DEPARTMENT_NAME } from "@/lib/Theme";
import { supabase } from "@/lib/supabase/client";

const SUBSCRIBE_MODAL_STORAGE_KEY = "noticeboard-subscribe-modal";

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

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4.5 4.5 13.5 13.5M13.5 4.5 4.5 13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function SubscribeSection() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedValue = window.localStorage.getItem(SUBSCRIBE_MODAL_STORAGE_KEY);

    if (storedValue === null) {
      window.localStorage.setItem(SUBSCRIBE_MODAL_STORAGE_KEY, "seen");
      setShowModal(true);
      return;
    }

    if (storedValue === "dismissed" || storedValue === "subscribed") {
      setShowModal(false);
      return;
    }

    if (storedValue === "seen") {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    if (!supabase) {
      setErrorMsg("Subscriptions are not configured for this environment.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const { error } = await supabase.from("subscriptions").insert({ email });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setSubmitted(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(SUBSCRIBE_MODAL_STORAGE_KEY, "subscribed");
        }
        setShowModal(false);
        return;
      }

      console.error("Subscribe failed:", error);
      setErrorMsg("Something went wrong. Try again in a moment.");
      return;
    }

    setSubmitted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SUBSCRIBE_MODAL_STORAGE_KEY, "subscribed");
    }
    setShowModal(false);
  };

  const dismissModal = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SUBSCRIBE_MODAL_STORAGE_KEY, "dismissed");
    }
    setShowModal(false);
  };

  return (
    <>
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
                  {errorMsg && <p className="text-[13px]" style={{ color: "#FF8D8D" }}>{errorMsg}</p>}
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

      {showModal && (
        <div
          className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:justify-end sm:px-6"
          onClick={dismissModal}
          aria-label="Subscribe modal overlay"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Subscribe to updates"
            className="w-full max-w-md rounded-2xl border shadow-[0_24px_60px_rgba(32,16,31,0.24)]"
            style={{
              background: "rgba(66, 21, 75, 0.97)",
              borderColor: "rgba(255,255,255,0.14)",
              backdropFilter: "blur(10px)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: THEME.muted }}>
                  Stay looped in
                </p>
                <h3 className="mt-1 text-lg font-bold" style={{ color: THEME.onPrimary }}>
                  Join the notice list
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close subscription prompt"
                onClick={dismissModal}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", color: THEME.onPrimary }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <p className="mb-4 text-sm leading-relaxed" style={{ color: THEME.muted }}>
                Be the first to know when a new notice is posted. It&apos;s quick, free, and easy to dismiss anytime.
              </p>

              <div className="rounded-2xl border p-4" style={{ background: THEME.primary, borderColor: "rgba(255,255,255,0.12)" }}>
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
                    {errorMsg && <p className="text-[13px]" style={{ color: "#FF8D8D" }}>{errorMsg}</p>}
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
        </div>
      )}
    </>
  );
}