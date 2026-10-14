"use client";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import BrowseTree from "@/components/BrowseTree";

export default function BrowseSplitPane({
    tree,
    children,
}: {
    tree: any[];
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <div className="md:flex md:items-start">
            {open && (
                <aside className="hidden md:block md:w-64 lg:w-80 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-card border-r border-border">
                    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
                        <span className="text-xs font-semibold uppercase text-muted">All Courses</span>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Hide tree"
                            className="text-muted hover:text-ink"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <BrowseTree tree={tree} />
                </aside>
            )}

            <section className="flex-1 min-w-0">
                {!open && (
                    <button
                        onClick={() => setOpen(true)}
                        className="hidden md:inline-flex items-center gap-1 m-4 mb-0 text-sm text-primary"
                    >
                        <ChevronsRight className="w-4 h-4" /> Show All
                    </button>
                )}
                {children}
            </section>
        </div>
    );
}