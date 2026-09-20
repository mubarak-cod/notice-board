"use server";

import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export type SubscribeResult =
  | { status: "success"; message: string }
  | { status: "already-subscribed"; message: string }
  | { status: "error"; message: string };

function buildConfirmationHtml() {
  const siteName = "MAPOLY CS Notices";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;background:#f8fafc;padding:32px 20px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;">
        <p style="margin:0 0 12px;color:#7c3aed;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">
          Subscription confirmed
        </p>

        <h2 style="margin:0 0 16px;color:#111827;font-size:28px;line-height:1.2;">
          You’re subscribed to ${siteName}
        </h2>

        <p style="margin:0 0 12px;color:#374151;font-size:16px;">
          Hi there,
        </p>

        <p style="margin:0 0 16px;color:#374151;font-size:16px;">
          Thanks for joining. You’ll now receive an email whenever a new department notice is published.
        </p>

        <div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px 18px;margin:18px 0;">
          <p style="margin:0;color:#4c1d95;font-size:15px;font-weight:600;">
            We’ll keep it useful and timely — just the important updates that matter.
          </p>
        </div>

        <p style="margin:0 0 18px;color:#374151;font-size:16px;">
          Thanks for staying informed.
        </p>

        <p style="margin:0;color:#1f2937;font-size:16px;">
          Best regards,<br />
          <strong>The MAPOLY CS Notices team</strong>
        </p>
      </div>
    </div>
  `;
}

export async function subscribeToNotices(email: string): Promise<SubscribeResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { status: "error", message: "Please enter your email address." };
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  if (!isValidEmail) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("subscriptions").insert({ email: normalizedEmail });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "already-subscribed",
        message: "You’re already subscribed.",
      };
    }

    console.error("Subscription insert failed:", error);
    return {
      status: "error",
      message: "Something went wrong. Try again in a moment.",
    };
  }

  await sendEmail({
    to: normalizedEmail,
    subject: "You're subscribed to MAPOLY CS Notices",
    html: buildConfirmationHtml(),
  });

  return {
    status: "success",
    message: "You’re subscribed",
  };
}
