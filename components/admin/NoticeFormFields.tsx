"use client";

import { motion } from "framer-motion";
import { THEME } from "@/lib/Theme";
import AttachmentUploader from "./AttachmentUploader";

interface Category {
  id: string;
  name: string;
}

interface NoticeFormFieldsProps {
  categories: Category[];
  defaultValues?: {
    title?: string;
    body?: string;
    category_id?: string | null;
    attachment_url?: string | null;
    status?: string;
    publish_at?: string | null;
    expires_at?: string | null;
  };
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function toDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputStyle = {
  borderColor: "#D8D5CC",
  color: "#1F2430",
  background: "#FFFFFF",
};

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,141,39,0.12)",
          color: THEME.accent,
          border: `1px solid ${"rgba(255,141,39,0.18)"}`,
        }}
      >
        {icon}
      </div>
      <h2 style={{ margin: 0, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: THEME.primary, fontWeight: 700 }}>
        {label}
      </h2>
    </div>
  );
}

export default function NoticeFormFields({ categories, defaultValues = {} }: NoticeFormFieldsProps) {
  const sectionDelay = [0, 0.06, 0.12] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: easeOutExpo }}
        style={{ display: "grid", gap: 24 }}
      >
        {[
          {
            label: "Content",
            icon: (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ),
            body: (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>Title</span>
                  <input
                    name="title"
                    required
                    defaultValue={defaultValues.title}
                    placeholder="e.g. First Semester Exam Timetable"
                    className="rounded-xl border px-3.5 py-2.75 text-[14px] outline-none transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>Body</span>
                  <textarea
                    name="body"
                    required
                    rows={8}
                    defaultValue={defaultValues.body}
                    placeholder="Write the full notice here..."
                    className="rounded-xl border px-3.5 py-3 text-[14px] outline-none resize-y transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={{ ...inputStyle, minHeight: 180 }}
                  />
                </label>
              </div>
            ),
          },
          {
            label: "Media",
            icon: (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h8a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 14 14H6a2.5 2.5 0 0 1-2.5-2.5v-7Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.8 7.3 10 11.5l6.2-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
            body: <AttachmentUploader defaultValue={defaultValues.attachment_url} />,
          },
          {
            label: "Publishing",
            icon: (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5v5.2M10 17.5v-5.2M2.5 10h5.2M17.5 10h-5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ),
            body: (
              <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>Category</span>
                  <select
                    name="category_id"
                    defaultValue={defaultValues.category_id ?? ""}
                    className="rounded-xl border px-3.5 py-2.75 text-[14px] outline-none transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={inputStyle}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>Status</span>
                  <select
                    name="status"
                    defaultValue={defaultValues.status ?? "draft"}
                    className="rounded-xl border px-3.5 py-2.75 text-[14px] outline-none transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={inputStyle}
                  >
                    <option value="draft">Draft — not visible yet</option>
                    <option value="scheduled">Scheduled — goes live at publish date</option>
                    <option value="published">Published — live immediately</option>
                    <option value="archived">Archived — hidden</option>
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>
                    Publish date <span style={{ color: "#9a9890", fontWeight: 400 }}>(optional)</span>
                  </span>
                  <input
                    type="datetime-local"
                    name="publish_at"
                    defaultValue={toDatetimeLocal(defaultValues.publish_at)}
                    className="rounded-xl border px-3.5 py-2.75 text-[14px] outline-none transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2430" }}>
                    Expires <span style={{ color: "#9a9890", fontWeight: 400 }}>(optional)</span>
                  </span>
                  <input
                    type="datetime-local"
                    name="expires_at"
                    defaultValue={toDatetimeLocal(defaultValues.expires_at)}
                    className="rounded-xl border px-3.5 py-2.75 text-[14px] outline-none transition-all duration-200 focus:border-[#42154B] focus:ring-2"
                    style={inputStyle}
                  />
                </label>
              </div>
            ),
          },
        ].map((section, index) => (
          <motion.section
            key={section.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: sectionDelay[index], ease: easeOutExpo }}
            style={{
              border: "1px solid #E7E4DC",
              borderRadius: 22,
              background: "#FFFFFF",
              padding: 20,
              boxShadow: "0 10px 28px rgba(66,21,75,0.04)",
            }}
          >
            <SectionHeader icon={section.icon} label={section.label} />
            {section.body}
          </motion.section>
        ))}
      </motion.div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center self-start rounded-xl px-6 py-3 text-[14px] font-bold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(255,141,39,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: THEME.accent,
          color: THEME.onPrimary,
          boxShadow: "0 10px 18px rgba(255,141,39,0.18)",
        }}
      >
        Save notice
      </button>
    </div>
  );
}