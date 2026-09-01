"use client";

import { useState, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { THEME } from "@/lib/Theme";

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

    if (!supabase) {
      setErrorMsg("Supabase is not configured for file uploads.");
      return;
    }

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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name="attachment_url" value={url} />

      <div
        style={{
          border: `1.5px dashed ${url ? "#D8D5CC" : "rgba(66,21,75,0.28)"}`,
          borderRadius: 18,
          background: url ? "rgba(66,21,75,0.02)" : "rgba(255,141,39,0.03)",
          padding: 18,
          transition: "all 180ms ease",
        }}
      >
        <label
          htmlFor="attachment-upload"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderRadius: 14,
            cursor: "pointer",
            background: uploading ? "rgba(66,21,75,0.02)" : "transparent",
            padding: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: url ? "rgba(66,21,75,0.08)" : "rgba(255,141,39,0.12)",
                color: url ? THEME.primary : THEME.accent,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 3.5v8.2M6.8 9.6 10 6.4l3.2 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.5 14.5a2.5 2.5 0 0 0 2.5 2.5h6a2.5 2.5 0 0 0 2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1F2430" }}>
                {uploading ? "Uploading image..." : url ? "Image attached" : "Add attachment image"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5B5F73" }}>
                {uploading ? "Please wait while it syncs to storage." : "PNG, JPG, or GIF up to a reasonable size."}
              </p>
            </div>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: THEME.accent,
              color: THEME.onPrimary,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {uploading ? "Working" : url ? "Replace" : "Browse"}
          </span>
        </label>

        <input
          id="attachment-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      {errorMsg && (
        <p style={{ margin: 0, fontSize: 12.5, color: "#A32D2D" }}>{errorMsg}</p>
      )}

      {url && !uploading && (
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #E7E4DC",
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 10px 26px rgba(66,21,75,0.04)",
          }}
        >
          <img
            src={url}
            alt="Attachment preview"
            style={{ display: "block", width: "100%", maxHeight: 220, objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}