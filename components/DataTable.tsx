"use client";
import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export type Column<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    sortValue?: (row: T) => string | number;
    render?: (row: T) => React.ReactNode;
    className?: string;
};

export default function DataTable<T extends { id: string }>({
    columns,
    rows,
    pageSize = 10,
    searchText,
    filterPlaceholder = "Filter…",
    emptyMessage = "Nothing to show.",
}: {
    columns: Column<T>[];
    rows: T[];
    pageSize?: number;
    searchText?: (row: T) => string;
    filterPlaceholder?: string;
    emptyMessage?: string;
}) {
    const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState("");

    const processed = useMemo(() => {
        let out = rows;
        const q = filter.trim().toLowerCase();
        if (q && searchText) out = out.filter((r) => searchText(r).toLowerCase().includes(q));

        if (sort) {
            const col = columns.find((c) => c.key === sort.key);
            const getValue = col?.sortValue ?? ((r: T) => String((r as any)[sort.key] ?? ""));
            out = [...out].sort((a, b) => {
                const av = getValue(a);
                const bv = getValue(b);
                const cmp =
                    typeof av === "number" && typeof bv === "number"
                        ? av - bv
                        : String(av).localeCompare(String(bv), undefined, { numeric: true });
                return sort.dir === "asc" ? cmp : -cmp;
            });
        }
        return out;
    }, [rows, filter, sort, columns, searchText]);

    const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));
    const safePage = Math.min(page, pageCount - 1);
    const start = safePage * pageSize;
    const visible = processed.slice(start, start + pageSize);

    function toggleSort(key: string) {
        setPage(0);
        setSort((prev) =>
            prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
        );
    }

    return (
        <div>
            {searchText && (
                <input
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(0);
                    }}
                    placeholder={filterPlaceholder}
                    className="mb-3 w-full sm:w-72 border border-border rounded-lg px-3 py-2 text-sm bg-card text-ink"
                />
            )}

            <div className="overflow-x-auto border border-border rounded-xl bg-card">
                <table className="w-full text-sm">
                    <thead className="border-b border-border text-left text-muted">
                        <tr>
                            {columns.map((c) => (
                                <th key={c.key} className={`px-4 py-3 font-semibold whitespace-nowrap ${c.className ?? ""}`}>
                                    {c.sortable ? (
                                        <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-ink">
                                            {c.label}
                                            {sort?.key === c.key &&
                                                (sort.dir === "asc" ? (
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                ))}
                                        </button>
                                    ) : (
                                        c.label
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {visible.map((row) => (
                            <tr key={row.id} className="hover:bg-primary/5">
                                {columns.map((c) => (
                                    <td key={c.key} className={`px-4 py-3 text-ink ${c.className ?? ""}`}>
                                        {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-3 text-sm text-muted">
                <span>
                    {processed.length === 0
                        ? "0 results"
                        : `${start + 1}–${Math.min(start + pageSize, processed.length)} of ${processed.length}`}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(0, safePage - 1))}
                        disabled={safePage === 0}
                        aria-label="Previous page"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>
                        Page {safePage + 1} of {pageCount}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
                        disabled={safePage >= pageCount - 1}
                        aria-label="Next page"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}