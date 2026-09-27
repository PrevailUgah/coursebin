"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCourseForm({ faculties }: { faculties: any[] }) {
    const router = useRouter();
    const [facultyId, setFacultyId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [level, setLevel] = useState("100");
    const [semester, setSemester] = useState("1");
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [units, setUnits] = useState("3");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const selectedFaculty = faculties.find((f) => f.id === facultyId);
    const departments = selectedFaculty?.departments ?? [];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!departmentId) return setError("Choose a department.");
        setSubmitting(true);
        setError(null);

        const res = await fetch("/api/admin/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                departmentId,
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

        router.push("/browse");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h1 className="text-2xl font-bold text-ink mb-2">Add a course</h1>

            <div>
                <label className="text-sm font-medium text-ink">Faculty</label>
                <select
                    value={facultyId}
                    onChange={(e) => { setFacultyId(e.target.value); setDepartmentId(""); }}
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                >
                    <option value="">Select a faculty</option>
                    {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Department</label>
                <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                    disabled={!facultyId}
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink disabled:opacity-50"
                >
                    <option value="">Select a department</option>
                    {departments.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                {facultyId && departments.length === 0 && (
                    <p className="text-xs text-muted mt-1">
                        No departments in this faculty yet — <a href={`/admin/faculties/${facultyId}/departments`} className="text-primary">add one first</a>.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium text-ink">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink">
                        <option value="100">100 Level</option>
                        <option value="200">200 Level</option>
                        <option value="300">300 Level</option>
                        <option value="400">400 Level</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-ink">Semester</label>
                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink">
                        <option value="1">1st Semester</option>
                        <option value="2">2nd Semester</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Course code</label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CSC 101"
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Introduction to Programming"
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-ink">Units</label>
                <input
                    type="number"
                    min={1}
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink"
                />
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