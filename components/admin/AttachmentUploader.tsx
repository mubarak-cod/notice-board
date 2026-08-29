"use client";

import { useState, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";

interface AttachmentUploaderProps {
  defaultValue?: string | null;
}

export default function AttachmentUploader({ defaultValue }: AttachmentUploaderProps) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("attachments").upload(fileName, file);

    if (error) {
      setErrorMsg(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("attachments").getPublicUrl(fileName);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* This hidden input is what actually gets submitted with the form */}
      <input type="hidden" name="attachment_url" value={url} />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-[13.5px]"
        style={{ color: "#1F2430" }}
      />

      {uploading && (
        <p className="text-[12.5px]" style={{ color: "#5B5F73" }}>Uploading...</p>
      )}

      {errorMsg && (
        <p className="text-[12.5px]" style={{ color: "#A32D2D" }}>{errorMsg}</p>
      )}

      {url && !uploading && (
        <img
          src={url}
          alt="Attachment preview"
          className="mt-1 h-32 w-auto rounded-lg border object-cover"
          style={{ borderColor: "#E7E4DC" }}
        />
      )}
    </div>
  );
}