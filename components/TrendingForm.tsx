"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ALLOWED = ["image/jpeg", "image/png", "video/mp4"];
const MAX_MB = 20;

export default function TrendingForm({ userId, onDone }: { userId: string; onDone?: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Choose an image or short video.");
    if (!ALLOWED.includes(file.type)) return setError("Only JPG, PNG, or MP4 files are allowed.");
    if (file.size > MAX_MB * 1024 * 1024) return setError(`File must be under ${MAX_MB}MB.`);

    setSubmitting(true);
    setError(null);

    const type = file.type.startsWith("video") ? "video" : "image";
    const mediaPath = `${crypto.randomUUID()}-${file.name}`;

    const { error: uploadErr } = await supabase.storage.from("trending-media").upload(mediaPath, file);
    if (uploadErr) {
      setError("Upload failed.");
      setSubmitting(false);
      return;
    }

    const { error: insertErr } = await supabase.from("trending_posts").insert({
      type, title, subtitle: subtitle || null, media_path: mediaPath, media_type: file.type, author_id: userId,
    });

    if (insertErr) {
      await supabase.storage.from("trending-media").remove([mediaPath]);
      setError("Could not save the post.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    router.refresh();
    onDone?.();
  }

  const inputClass = "w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} placeholder="BUK wins national hackathon" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Subtitle (optional)</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} placeholder="Campus News · Achievement" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Image or short video</label>
        <input type="file" accept=".jpg,.jpeg,.png,.mp4" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required className="w-full text-sm mt-1 text-ink" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50">
        {submitting ? "Posting…" : "Post to Trending"}
      </button>
    </form>
  );
}