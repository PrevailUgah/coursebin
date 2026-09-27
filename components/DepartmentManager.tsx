"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepartmentManager({ facultyId, departments }: { facultyId: string; departments: any[] }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const res = await fetch("/api/admin/departments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, facultyId }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error ?? "Failed to create department.");
            setSubmitting(false);
            return;
        }
        setName("");
        setSubmitting(false);
        router.refresh();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this department? Its courses will also be removed.")) return;
        const res = await fetch(`/api/admin/departments/${id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
        else alert("Failed to delete department.");
    }

    return (
        <div>
            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Department of Computer Science"
                    required
                    className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-ink"
                />
                <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50">
                    {submitting ? "Adding…" : "Add"}
                </button>
            </form>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="space-y-2">
                {departments.map((d) => (
                    <div key={d.id} className="flex items-center justify-between border border-border rounded-lg p-3 bg-card">
                        <span className="font-medium text-ink">{d.name}</span>
                        <button onClick={() => handleDelete(d.id)} className="text-sm text-red-600">Delete</button>
                    </div>
                ))}
                {departments.length === 0 && <p className="text-muted text-sm">No departments yet.</p>}
            </div>
        </div>
    );
}