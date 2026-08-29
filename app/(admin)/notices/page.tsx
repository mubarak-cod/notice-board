import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";
import NoticeCard from "@/components/public/NoticeCard";

function snippet(body: string, length = 120) {
  const trimmed = body.trim();
  return trimmed.length > length ? trimmed.slice(0, length) + "..." : trimmed;
}

export default async function AllNoticesPage() {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data: notices, error } = await supabase
    .from("notices")
    .select("slug, title, body, attachment_url, created_at, categories(name)")
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("AllNoticesPage query failed:", error);
  }

  return (
    <div style={{ background: "#FAFAF7" }} className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: THEME.primary }}>
          All Notices
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "#5B5F73" }}>
          Every notice from the department, most recent first.
        </p>

        {/* TEMPORARY: surfaces the real error instead of hiding it */}
        {error && (
          <p className="mt-6 text-[13.5px]" style={{ color: "#A32D2D" }}>
            Couldn&apos;t load notices: {error.message}
          </p>
        )}

        {!error && (!notices || notices.length === 0) && (
          <div className="mt-8 rounded-2xl border py-16 text-center" style={{ borderColor: "#E7E4DC" }}>
            <p className="text-[14.5px]" style={{ color: "#5B5F73" }}>No notices yet — check back soon.</p>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices?.map((n) => (
            <NoticeCard
              key={n.slug}
              slug={n.slug}
              title={n.title}
              bodySnippet={snippet(n.body)}
              categoryName={(n.categories as unknown as { name: string } | null)?.name}
              date={n.created_at}
              attachmentUrl={n.attachment_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}