import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";
import { saveNotice } from "@/app/(admin)/notices/action";
import NoticeFormFields from "@/components/admin/NoticeFormFields";

interface EditNoticePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNoticePage({ params }: EditNoticePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: notice }, { data: categories }] = await Promise.all([
    supabase.from("notices").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!notice) notFound();

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      <div className="border-b" style={{ background: THEME.primary, borderColor: THEME.primaryDark }}>
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
          <Link href="/admin/dashboard" className="text-[13px] font-medium" style={{ color: THEME.muted }}>
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-[20px] font-bold tracking-tight" style={{ color: "#1F2430" }}>
          Edit notice
        </h1>
        <form action={saveNotice} className="rounded-2xl border p-6" style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}>
          <input type="hidden" name="id" value={notice.id} />
          <NoticeFormFields categories={categories ?? []} defaultValues={notice} />
        </form>
      </div>
    </div>
  );
}