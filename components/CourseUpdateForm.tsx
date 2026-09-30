"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 10;

export default function CourseUpdateForm({ courseId, onDone }: { courseId: string; onDone?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [type, setType] = useState("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [eventAt, setEventAt] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const needsDate = type === "lecture" || type === "exam";
  const inputClass = "w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (files) {
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) return setError("Attachments must be PDF, JPG, or PNG.");
        if (file.size > MAX_SIZE_MB * 1024 * 1024) return setError(`Each attachment must be under ${MAX_SIZE_MB}MB.`);
      }
    }

    setSubmitting(true);

    const res = await fetch("/api/course-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId, type, title, body: body || null,
        eventAt: needsDate && eventAt ? new Date(eventAt).toISOString() : null,
      }),
    });

    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(b.error ?? "Could not post update.");
      setSubmitting(false);
      return;
    }

    const { id: updateId } = await res.json();

    if (files) {
      for (const file of Array.from(files)) {
        const filePath = `${courseId}/${updateId}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("course-updates").upload(filePath, file);
        if (!uploadErr) {
          await supabase.from("course_update_attachments").insert({
            update_id: updateId, file_path: filePath, mime_type: file.type, file_size: file.size,
          });
        }
      }
    }

    setSubmitting(false);
    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option value="announcement">Announcement</option>
          <option value="assignment">Assignment</option>
          <option value="lecture">Lecture date/time</option>
          <option value="exam">Test/exam date/time</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} placeholder="Assignment 2 posted" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Details (optional)</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className={inputClass} placeholder="Details students should know…" />
      </div>
      {needsDate && (
        <div>
          <label className="text-sm font-medium text-ink">Date &amp; time</label>
          <input type="datetime-local" value={eventAt} onChange={(e) => setEventAt(e.target.value)} required className={inputClass} />
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-ink">Attachments (optional — PDF, JPG, PNG)</label>
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(e.target.files)} className="w-full text-sm mt-1 text-ink" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50">
        {submitting ? "Posting…" : "Post update"}
      </button>
    </form>
  );
}