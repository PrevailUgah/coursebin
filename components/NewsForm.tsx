"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsForm({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: body || null }),
    });

    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(b.error ?? "Could not post news update.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink" placeholder="Platform maintenance this weekend" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Message (optional)</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink" placeholder="Details every user should see…" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-muted">This sends a notification to every registered user.</p>
      <button type="submit"  className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50">
        {submitting ? "Broadcasting…" : "Broadcast to all users"}
      </button>
    </form>
  );
}