"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCourseForm({ faculties, onSuccess }: { faculties: any[]; onSuccess?: () => void }) {
  const router = useRouter();
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState("100");
  const [semester, setSemester] = useState("1");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [units, setUnits] = useState("3");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const inputClass = "w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink";

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
    if (selectedDepts.size === 0) return setError("Select at least one department.");
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        departmentIds: Array.from(selectedDepts),
        level: Number(level),
        semester: Number(semester),
        code: code.toUpperCase(),
        title,
        units: Number(units),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to add course.");
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
        <label className="text-sm font-medium text-ink">Departments (select one or more)</label>
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
              {(!f.departments || f.departments.length === 0) && (
                <p className="text-xs text-muted pl-1">No departments yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-ink">Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Semester</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} className={inputClass}>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Course code</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MTH 201" required className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Linear Algebra" required className={inputClass} />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Units</label>
        <input type="number" min={1} value={units} onChange={(e) => setUnits(e.target.value)} required className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50">
        {submitting ? "Adding…" : "Create course"}
      </button>
    </form>
  );
}