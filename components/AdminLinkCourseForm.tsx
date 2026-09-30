"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLinkCourseForm({ faculties, onSuccess }: { faculties: any[]; onSuccess?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => setResults(Array.isArray(data) ? data : []));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  function toggleDept(id: string) {
    setSelectedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse) return setError("Pick a course first.");
    if (selectedDepts.size === 0) return setError("Select at least one department.");
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/department-courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: selectedCourse.id, departmentIds: Array.from(selectedDepts) }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not link course.");
      setSubmitting(false);
      return;
    }

    router.refresh();
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink">Search for a course</label>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedCourse(null);
          }}
          placeholder="MTH201, Linear Algebra…"
          className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
        />
        {results.length > 0 && !selectedCourse && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-lg divide-y divide-border">
            {results.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => {
                  setSelectedCourse(c);
                  setQuery(`${c.code} — ${c.title}`);
                  setResults([]);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5"
              >
                <span className="font-semibold text-ink">{c.code}</span> <span className="text-muted">{c.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div>
          <label className="text-sm font-medium text-ink">Link to departments</label>
          <div className="mt-1 max-h-48 overflow-y-auto border border-border rounded-lg p-2 space-y-2">
            {faculties.map((f) => (
              <div key={f.id}>
                <p className="text-xs font-semibold text-muted uppercase mt-1">{f.name}</p>
                {(f.departments ?? []).map((d: any) => (
                  <label key={d.id} className="flex items-center gap-2 py-1 text-sm text-ink">
                    <input type="checkbox" checked={selectedDepts.has(d.id)} onChange={() => toggleDept(d.id)} />
                    {d.name}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !selectedCourse}
        className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50"
      >
        {submitting ? "Linking…" : "Link course"}
      </button>
    </form>
  );
}