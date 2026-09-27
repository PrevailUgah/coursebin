"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FacultyManager({ faculties }: { faculties: any[] }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const res = await fetch("/api/admin/faculties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error ?? "Failed to create faculty.");
            setSubmitting(false);
            return;
        }
        setName("");
        setSubmitting(false);
        router.refresh();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this faculty? Its departments and courses will also be removed.")) return;
        const res = await fetch(`/api/admin/faculties/${id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
        else alert("Failed to delete faculty.");
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-ink mb-4">Faculties</h1>

            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Faculty of Science"
                    required
                    className="flex-1 border border-border rounded-lg px-3 py-2 bg-card text-ink"
                />
                <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50">
                    {submitting ? "Adding…" : "Add"}
                </button>
            </form>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <div className="space-y-2">
                {faculties.map((f) => (
                    <div key={f.id} className="flex items-center justify-between border border-border rounded-lg p-3 bg-card">
                        <a href={`/admin/faculties/${f.id}/departments`} className="font-medium text-ink hover:text-primary">
                            {f.name}
                        </a>
                        <button onClick={() => handleDelete(f.id)} className="text-sm text-red-600">Delete</button>
                    </div>
                ))}
                {faculties.length === 0 && <p className="text-muted text-sm">No faculties yet.</p>}
            </div>
        </div>
    );
}