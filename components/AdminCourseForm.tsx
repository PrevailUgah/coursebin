"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCourseForm() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [level, setLevel] = useState("100");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const res = await fetch("/api/admin/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code.toUpperCase(), title, department, level: Number(level) }),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error ?? "Failed to add course.");
            setSubmitting(false);
            return;
        }

        router.push("/browse");
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 sm:px-6 py-6 space-y-4">
            <h1 className="text-2xl font-bold text-ink">Add a course</h1>

            <div>
                <label className="text-sm font-medium text-ink">Course code</label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CSC301"
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Operating Systems"
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Department</label>
                <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Level</label>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50"
            >
                {submitting ? "Adding…" : "Add course"}
            </button>
        </form>
    );
}