"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

function toUtcIsoOrNull(value: FormDataEntryValue | string | null | undefined) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

async function notifySubscribers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  notice: { title: string; slug: string; body: string }
) {
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("email")
    .is("unsubscribed_at", null);

  if (!subs || subs.length === 0) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL is not set; skipping notice email links.");
    return;
  }

  const noticeUrl = `${siteUrl}/notices/${notice.slug}`;
  const snippet = notice.body.trim().slice(0, 140);

  await Promise.all(
    subs.map((s: { email: string }) =>
      sendEmail({
        to: s.email,
        subject: `New notice: ${notice.title}`,
        html: `
          <p style="font-size:16px;font-weight:bold;">${notice.title}</p>
          <p style="color:#555;">${snippet}${notice.body.length > 140 ? "..." : ""}</p>
          <p><a href="${noticeUrl}">Read the full notice →</a></p>
        `,
      })
    )
  );
}

// Wraps notifySubscribers so a network/DNS/Resend failure NEVER
// breaks the actual notice save — it just logs and moves on.
async function notifySubscribersSafely(
  supabase: Awaited<ReturnType<typeof createClient>>,
  notice: { title: string; slug: string; body: string }
) {
  try {
    await notifySubscribers(supabase, notice);
  } catch (err) {
    console.error("Email notification failed (notice was still saved fine):", err);
  }
}

export async function saveNotice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const categoryId = (formData.get("category_id") as string) || null;
  const attachmentUrl = (formData.get("attachment_url") as string) || null;
  const status = formData.get("status") as string;
  const publishAt = toUtcIsoOrNull(formData.get("publish_at"));
  const expiresAt = toUtcIsoOrNull(formData.get("expires_at"));

  if (id) {
    const { data: existing } = await supabase
      .from("notices")
      .select("status")
      .eq("id", id)
      .single();

    const wasAlreadyPublished = existing?.status === "published";

    const { error: updateError } = await supabase
      .from("notices")
      .update({
        title, body, category_id: categoryId, attachment_url: attachmentUrl,
        status, publish_at: publishAt, expires_at: expiresAt,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update failed:", updateError);
      throw new Error(`Failed to update notice: ${updateError.message}`);
    }

    await supabase.from("audit_log").insert({ notice_id: id, admin_id: user.id, action: "edited" });

    if (status === "published" && !wasAlreadyPublished) {
      const { data: slugRow } = await supabase.from("notices").select("slug").eq("id", id).single();
      if (slugRow) {
        await notifySubscribersSafely(supabase, { title, slug: slugRow.slug, body });
      }
    }
  } else {
    const slug = slugify(title);
    const { data: inserted, error: insertError } = await supabase
      .from("notices")
      .insert({
        title, slug, body, category_id: categoryId, attachment_url: attachmentUrl,
        status, publish_at: publishAt, expires_at: expiresAt, created_by: user.id,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert failed:", insertError);
      throw new Error(`Failed to save notice: ${insertError.message}`);
    }

    if (inserted) {
      await supabase.from("audit_log").insert({ notice_id: inserted.id, admin_id: user.id, action: "created" });

      if (status === "published") {
        await notifySubscribersSafely(supabase, { title, slug, body });
      }
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}