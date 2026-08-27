import { THEME } from "@/lib/Theme";

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

// Converts a stored ISO timestamp to the format <input type="datetime-local"> expects
function toDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputStyle = {
  borderColor: "#D8D5CC",
  color: "#1F2430",
};

export default function NoticeFormFields({ categories, defaultValues = {} }: NoticeFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>Title</span>
        <input
          name="title"
          required
          defaultValue={defaultValues.title}
          placeholder="e.g. First Semester Exam Timetable"
          className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
          style={inputStyle}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>Body</span>
        <textarea
          name="body"
          required
          rows={8}
          defaultValue={defaultValues.body}
          placeholder="Write the full notice here..."
          className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none resize-y"
          style={inputStyle}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>Category</span>
          <select
            name="category_id"
            defaultValue={defaultValues.category_id ?? ""}
            className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
            style={inputStyle}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>Status</span>
          <select
            name="status"
            defaultValue={defaultValues.status ?? "draft"}
            className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
            style={inputStyle}
          >
            <option value="draft">Draft — not visible yet</option>
            <option value="scheduled">Scheduled — goes live at Publish date</option>
            <option value="published">Published — live immediately</option>
            <option value="archived">Archived — hidden</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>
            Publish date <span style={{ color: "#9a9890", fontWeight: 400 }}>(for scheduled notices)</span>
          </span>
          <input
            type="datetime-local"
            name="publish_at"
            defaultValue={toDatetimeLocal(defaultValues.publish_at)}
            className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
            style={inputStyle}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>
            Expires <span style={{ color: "#9a9890", fontWeight: 400 }}>(optional)</span>
          </span>
          <input
            type="datetime-local"
            name="expires_at"
            defaultValue={toDatetimeLocal(defaultValues.expires_at)}
            className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
            style={inputStyle}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>
          Attachment URL <span style={{ color: "#9a9890", fontWeight: 400 }}>(optional — paste a Cloudinary link)</span>
        </span>
        <input
          name="attachment_url"
          defaultValue={defaultValues.attachment_url ?? ""}
          placeholder="https://res.cloudinary.com/..."
          className="rounded-xl border px-3.5 py-2.5 text-[14px] outline-none"
          style={inputStyle}
        />
      </label>

      <button
        type="submit"
        className="mt-2 self-start rounded-xl px-6 py-2.5 text-[14px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
        style={{ background: THEME.accent, color: THEME.onPrimary }}
      >
        Save notice
      </button>
    </div>
  );
}