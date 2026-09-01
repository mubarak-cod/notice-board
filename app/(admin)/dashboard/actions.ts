"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteNotice(formData: FormData) {
  const id = formData.get("id") as string | null;

  if (!id) {
    throw new Error("Missing notice id for delete action.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (error) {
    console.error("Delete notice failed:", {
      id,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Failed to delete notice: ${error.message}`);
  }

  revalidatePath("/dashboard");
}