"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type CourseOption = { id: string; code: string; title: string };

export default function CourseCombobox({
  value,
  onChange,
  initialCode,
}: {
  value: string;
  onChange: (courseId: string, code: string) => void;
  initialCode?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/courses/selectable")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (initialCode) {
            const match = data.find((c: CourseOption) => c.code.toUpperCase() === initialCode.toUpperCase());
            if (match) onChange(match.id, match.code);
          }
        } else {
          setLoadError(data?.error ?? "Could not load courses.");
        }
      })
      .catch(() => setLoadError("Could not load courses."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) {
      const sel = courses.find((c) => c.id === value);
      if (sel) setQuery(`${sel.code} — ${sel.title}`);
      else if (!value) setQuery("");
    }
  }, [value, courses, open]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const q = query.toLowerCase();
  const filtered = courses.filter(
    (c) => !q || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
  );

  function pick(c: CourseOption) {
    onChange(c.id, c.code);
    setQuery(`${c.code} — ${c.title}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium text-ink">Course</label>
      <div className="relative mt-1">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={loading ? "Loading courses…" : "Select a course…"}
          autoComplete="off"
          className="w-full border border-border rounded-lg px-3 py-2 pr-9 bg-card text-ink"
        />
        <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto bg-card border border-border rounded-lg shadow-lg">
          {loading && <p className="px-3 py-2 text-sm text-muted">Loading…</p>}
          {!loading && loadError && <p className="px-3 py-2 text-sm text-red-600">{loadError}</p>}
          {!loading && !loadError && filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted">
              {courses.length === 0 ? "No courses available to you yet." : "No matching courses."}
            </p>
          )}
          {!loading &&
            filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pick(c)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5"
              >
                <span className="font-medium text-ink">{c.code}</span>{" "}
                <span className="text-muted">{c.title}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}