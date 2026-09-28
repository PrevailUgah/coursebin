"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { semesterLabel } from "@/lib/utils";

type Course = { id: string; code: string; title: string; level: number; semester: number };
type Dept = { id: string; name: string; courses: Course[] };
type Faculty = { id: string; name: string; departments: Dept[] };

function TreeRow({
    depth,
    label,
    isOpen,
    onToggle,
    href,
    active,
}: {
    depth: number;
    label: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    href?: string;
    active?: boolean;
}) {
    const style = { paddingLeft: `${depth * 14 + 12}px` };
    const base = "flex items-center gap-1.5 w-full text-left py-1.5 pr-3 text-sm hover:bg-primary/5";

    if (href) {
        return (
            <Link
                href={href}
                style={style}
                className={`${base} ${active ? "bg-primary/10 text-primary font-semibold" : "text-ink"}`}
            >
                <span className="w-4 shrink-0" />
                <span className="truncate">{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onToggle} style={style} className={`${base} text-ink`}>
            <ChevronRight
                className={`w-4 h-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
            <span className="truncate">{label}</span>
        </button>
    );
}

export default function BrowseTree({ tree }: { tree: Faculty[] }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [, fId, dId, lvl, sm] = pathname.split("/").filter(Boolean);

    // Keep the active course's ancestors open as you navigate.
    useEffect(() => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (fId) next.add(`f:${fId}`);
            if (dId) next.add(`d:${dId}`);
            if (dId && lvl) next.add(`l:${dId}:${lvl}`);
            if (dId && lvl && sm) next.add(`s:${dId}:${lvl}:${sm}`);
            return next;
        });
    }, [fId, dId, lvl, sm]);

    function toggle(key: string) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    const has = (key: string) => expanded.has(key);

    if (tree.length === 0) {
        return <p className="p-4 text-sm text-muted">No faculties yet.</p>;
    }

    return (
        <div className="py-2">
            {tree.map((f) => (
                <div key={f.id}>
                    <TreeRow
                        depth={0}
                        label={f.name}
                        isOpen={has(`f:${f.id}`)}
                        onToggle={() => toggle(`f:${f.id}`)}
                    />
                    {has(`f:${f.id}`) &&
                        f.departments.map((d) => {
                            const levels = Array.from(new Set(d.courses.map((c) => c.level))).sort((a, b) => a - b);
                            return (
                                <div key={d.id}>
                                    <TreeRow
                                        depth={1}
                                        label={d.name}
                                        isOpen={has(`d:${d.id}`)}
                                        onToggle={() => toggle(`d:${d.id}`)}
                                    />
                                    {has(`d:${d.id}`) &&
                                        levels.map((level) => {
                                            const semesters = Array.from(
                                                new Set(d.courses.filter((c) => c.level === level).map((c) => c.semester))
                                            ).sort((a, b) => a - b);
                                            return (
                                                <div key={level}>
                                                    <TreeRow
                                                        depth={2}
                                                        label={`${level} Level`}
                                                        isOpen={has(`l:${d.id}:${level}`)}
                                                        onToggle={() => toggle(`l:${d.id}:${level}`)}
                                                    />
                                                    {has(`l:${d.id}:${level}`) &&
                                                        semesters.map((s) => (
                                                            <div key={s}>
                                                                <TreeRow
                                                                    depth={3}
                                                                    label={semesterLabel(s)}
                                                                    isOpen={has(`s:${d.id}:${level}:${s}`)}
                                                                    onToggle={() => toggle(`s:${d.id}:${level}:${s}`)}
                                                                />
                                                                {has(`s:${d.id}:${level}:${s}`) &&
                                                                    d.courses
                                                                        .filter((c) => c.level === level && c.semester === s)
                                                                        .map((c) => {
                                                                            const href = `/browse/${f.id}/${d.id}/${level}/${s}/${encodeURIComponent(c.code)}`;
                                                                            return (
                                                                                <TreeRow
                                                                                    key={c.id}
                                                                                    depth={4}
                                                                                    href={href}
                                                                                    active={pathname === href}
                                                                                    label={
                                                                                        <>
                                                                                            <span className="font-medium">{c.code}</span>{" "}
                                                                                            <span className="text-muted">{c.title}</span>
                                                                                        </>
                                                                                    }
                                                                                />
                                                                            );
                                                                        })}
                                                            </div>
                                                        ))}
                                                </div>
                                            );
                                        })}
                                </div>
                            );
                        })}
                </div>
            ))}
        </div>
    );
}