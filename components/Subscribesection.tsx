"use client";

import { useState, type FormEvent } from "react";

/* ---------- Custom SVG icons (same hand-drawn set as the nav) ---------- */

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="15" height="11" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.2 5.3 10 10.5l6.8-5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8.2" stroke="#2F6F5E" strokeWidth="1.4" />
    <path d="M5.5 9.2 7.8 11.5 12.5 6.5" stroke="#2F6F5E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DEPARTMENTS: string[] = [
  "Computer Science",
  "Engineering",
  "Business Admin",
  "Mass Communication",
];

/* ---------- Subscribe section ---------- */

export default function SubscribeSection() {
  const [email, setEmail] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    // wire this up to your Supabase Subscription insert
    setSubmitted(true);
  };

  return (
    <section
      className="w-full border-y"
      style={{ background: "#1F0631", borderColor: "#3D1259" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
          {/* Copy */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
              style={{ background: "rgba(242,169,59,0.16)", color: "#F2A93B" }}
            >
              Never miss a notice
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: "#FAFAF7" }}>
              Get notified the moment your department posts something.
            </h2>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed" style={{ color: "#B9A9C7" }}>
              No account needed. Drop your email, pick your department, and we&apos;ll
              send you a heads-up only for what&apos;s actually relevant to you.
            </p>
          </div>

          {/* Form / success state */}
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{ background: "#2E0846", borderColor: "#3D1259" }}
          >
            {submitted ? (
              <div className="flex items-center gap-3 py-3">
                <CheckIcon />
                <div>
                  <p className="text-[14.5px] font-medium" style={{ color: "#FAFAF7" }}>
                    You&apos;re subscribed
                  </p>
                  <p className="text-[13px]" style={{ color: "#B9A9C7" }}>
                    We&apos;ll email you when a relevant notice goes live.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div
                  className="flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
                  style={{ background: "#1F0631", borderColor: "#45145F" }}
                >
                  <span style={{ color: "#5B5F73" }}>
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@student.edu"
                    className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#5B5F73]"
                    style={{ color: "#FAFAF7" }}
                  />
                </div>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
                  style={{ background: "#1F0631", borderColor: "#45145F", color: department ? "#FAFAF7" : "#5B5F73" }}
                >
                  <option value="" disabled>
                    Select your department
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} style={{ color: "#1F2430" }}>
                      {d}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="mt-1 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#F2A93B", color: "#FAFAF7" }}
                >
                  Subscribe
                </button>

                <p className="text-center text-[12px]" style={{ color: "#5B5F73" }}>
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