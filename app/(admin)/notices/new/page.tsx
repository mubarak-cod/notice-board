import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";
import { saveNotice } from "../action";
import NoticeFormFields from "@/components/admin/NoticeFormFields";

export default async function NewNoticePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

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
          New notice
        </h1>
        <form action={saveNotice} className="rounded-2xl border p-6" style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}>
          <NoticeFormFields categories={categories ?? []} />
        </form>
      </div>
    </div>
  );
}