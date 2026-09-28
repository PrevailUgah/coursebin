"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

export default function NotificationsBell() {
    const ref = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [lastSeen, setLastSeen] = useState(0);

    useEffect(() => {
        setLastSeen(Number(localStorage.getItem("notif_last_seen") ?? 0));
        const supabase = createClient();
        supabase
            .from("documents")
            .select("id, title, created_at, courses(code)")
            .order("created_at", { ascending: false })
            .limit(6)
            .then(({ data }) => setItems(data ?? []));
    }, []);

    function markSeen() {
        const now = Date.now();
        localStorage.setItem("notif_last_seen", String(now));
        setLastSeen(now);
    }

    useEffect(() => {
        if (!open) return;
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                markSeen();
            }
        }
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    function toggle() {
        if (open) {
            setOpen(false);
            markSeen();
        } else {
            setOpen(true);
        }
    }

    const unread = items.filter((i) => new Date(i.created_at).getTime() > lastSeen).length;

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={toggle}
                aria-label="Notifications"
                className="relative w-8 h-8 flex items-center justify-center rounded-full border border-border text-ink"
            >
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-card border border-border rounded-xl shadow-lg z-40">
                    <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Recent uploads</p>
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                        {items.length === 0 && <p className="px-4 py-6 text-sm text-muted text-center">Nothing new yet.</p>}
                        {items.map((doc) => {
                            const isNew = new Date(doc.created_at).getTime() > lastSeen;
                            return (
                                <Link
                                    key={doc.id}
                                    href={`/courses/${doc.courses?.code}`}
                                    onClick={() => { setOpen(false); markSeen(); }}
                                    className="flex gap-3 px-4 py-3 hover:bg-primary/5"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted">{doc.courses?.code}</p>
                                        <p className={`text-sm truncate ${isNew ? "font-semibold text-ink" : "text-ink"}`}>{doc.title}</p>
                                        <p className="text-xs text-muted">{timeAgo(doc.created_at)}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}