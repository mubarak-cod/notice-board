"use server";

import { createClient } from "@/lib/supabase/server";
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
  const publishAtRaw = formData.get("publish_at") as string;
  const expiresAtRaw = formData.get("expires_at") as string;
  const publishAt = publishAtRaw ? new Date(publishAtRaw).toISOString() : null;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null;

  if (id) {
    await supabase
      .from("notices")
      .update({
        title, body, category_id: categoryId, attachment_url: attachmentUrl,
        status, publish_at: publishAt, expires_at: expiresAt,
      })
      .eq("id", id);

    await supabase.from("audit_log").insert({ notice_id: id, admin_id: user.id, action: "edited" });
  } else {
    const slug = slugify(title);
    const { data: inserted } = await supabase
      .from("notices")
      .insert({
        title, slug, body, category_id: categoryId, attachment_url: attachmentUrl,
        status, publish_at: publishAt, expires_at: expiresAt, created_by: user.id,
      })
      .select("id")
      .single();

    if (inserted) {
      await supabase.from("audit_log").insert({ notice_id: inserted.id, admin_id: user.id, action: "created" });
    }
  }

  // FIXED: your real route is /dashboard (via the (admin) route group),
  // not /admin/dashboard
  revalidatePath("/dashboard");
  redirect("/dashboard");
}