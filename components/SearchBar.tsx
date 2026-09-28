"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export default function SearchBar({
    faculties,
    compact = false,
}: {
    faculties: any[];
    compact?: boolean;
}) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [facultyId, setFacultyId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [level, setLevel] = useState("");
    const [semester, setSemester] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const selectedFaculty = faculties.find((f) => f.id === facultyId);
    const departments = selectedFaculty?.departments ?? [];

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lets the "Search" quick-action tile focus whichever search bar is visible.
    useEffect(() => {
        function handleFocusEvent() {
            const el = inputRef.current;
            if (!el || el.offsetParent === null) return;
            el.focus();
            if (!compact) el.scrollIntoView({ behavior: "smooth", block: "center" });
            setOpen(true);
        }
        window.addEventListener("coursebin:focus-search", handleFocusEvent);
        return () => window.removeEventListener("coursebin:focus-search", handleFocusEvent);
    }, [compact]);

    useEffect(() => {
        if (!open) return;
        const timeout = setTimeout(() => {
            setLoading(true);
            const params = new URLSearchParams();
            if (query.trim()) params.set("q", query.trim());
            if (facultyId) params.set("facultyId", facultyId);
            if (departmentId) params.set("departmentId", departmentId);
            if (level) params.set("level", level);
            if (semester) params.set("semester", semester);

            fetch(`/api/search?${params.toString()}`)
                .then((r) => r.json())
                .then((data) => setResults(Array.isArray(data) ? data : []))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(timeout);
    }, [query, facultyId, departmentId, level, semester, open]);

    function goToCourse(code: string) {
        setOpen(false);
        setQuery("");
        router.push(`/courses/${encodeURIComponent(code)}`);
    }

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="flex w-full gap-2 items-stretch min-w-0">
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false);
                        if (e.key === "Enter" && results[0]) goToCourse(results[0].code);
                    }}
                    placeholder={compact ? "Search courses…" : "Search by course code or title…"}
                    className={`flex-1 min-w-0 border border-border rounded-full px-4 bg-card text-ink ${compact ? "py-1.5 text-sm" : "py-2"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle filters"
                    className={`shrink-0 flex items-center justify-center rounded-full border border-border text-ink ${compact ? "w-9 h-9" : "w-10 h-10"
                        }`}
                >
                    <SearchIcon className="w-4 h-4" />
                </button>
            </div>

            {open && (
                <div
                    className={`absolute z-40 mt-2 bg-card border border-border rounded-xl shadow-lg p-3 ${compact ? "right-0 w-[30rem] max-w-[90vw]" : "left-0 w-full"
                        }`}
                >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <select
                            value={facultyId}
                            onChange={(e) => {
                                setFacultyId(e.target.value);
                                setDepartmentId("");
                            }}
                            className="border border-border rounded-lg px-2 py-1.5 text-sm bg-card text-ink"
                        >
                            <option value="">All Faculties</option>
                            {faculties.map((f) => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            disabled={!facultyId}
                            className="border border-border rounded-lg px-2 py-1.5 text-sm bg-card text-ink disabled:opacity-50"
                        >
                            <option value="">All Departments</option>
                            {departments.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="border border-border rounded-lg px-2 py-1.5 text-sm bg-card text-ink"
                        >
                            <option value="">All Levels</option>
                            <option value="100">100 Level</option>
                            <option value="200">200 Level</option>
                            <option value="300">300 Level</option>
                            <option value="400">400 Level</option>
                        </select>
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="border border-border rounded-lg px-2 py-1.5 text-sm bg-card text-ink"
                        >
                            <option value="">Both Semesters</option>
                            <option value="1">1st Semester</option>
                            <option value="2">2nd Semester</option>
                        </select>
                    </div>

                    <div className="max-h-64 md:max-h-80 overflow-y-auto divide-y divide-border">
                        {loading && <p className="text-sm text-muted py-3 text-center">Searching…</p>}
                        {!loading && results.length === 0 && (
                            <p className="text-sm text-muted py-3 text-center">No matching courses.</p>
                        )}
                        {!loading &&
                            results.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => goToCourse(c.code)}
                                    className="w-full text-left py-2 px-1 hover:bg-primary/5 rounded-lg"
                                >
                                    <p className="text-sm font-semibold text-ink">{c.code} — {c.title}</p>
                                    <p className="text-xs text-muted">
                                        {c.departments?.name} · {c.level} Level · {c.units} Units
                                    </p>
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}