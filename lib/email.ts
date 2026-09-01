// Thin wrapper around Resend's API. Server-side only — never import
// this from a "use client" file, since RESEND_API_KEY must stay secret.

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NOTICE_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping email send.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, to, subject, html }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Resend send to ${to} failed:`, errText);
  }
}