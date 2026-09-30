"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, FileText, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-client";
import { timeAgo } from "@/lib/utils";

export default function NotificationsBell() {
  const { signedIn, userId } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("notifications")
      .select("id, kind, title, body, created_at, read_at, courses(code)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setItems(data ?? []));
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && userId) {
      const unreadIds = items.filter((i) => !i.read_at).map((i) => i.id);
      if (unreadIds.length > 0) {
        setItems((prev) => prev.map((i) => (unreadIds.includes(i.id) ? { ...i, read_at: new Date().toISOString() } : i)));
        const supabase = createClient();
        await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
      }
    }
  }

  if (!signedIn) return null;

  const unread = items.filter((i) => !i.read_at).length;

  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={toggle} aria-label="Notifications" className="relative w-8 h-8 flex items-center justify-center rounded-full border border-border text-ink">
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-30 sm:hidden" onClick={() => setOpen(false)} />
          <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-16 sm:top-auto sm:mt-2 w-auto sm:w-80 sm:max-w-[90vw] max-h-[75vh] sm:max-h-80 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-40">
            <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border sticky top-0 bg-card">Notifications</p>
            <div className="divide-y divide-border">
              {items.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted text-center">Enroll in courses to get notified about new materials and updates.</p>
              )}
              {items.map((n) => {
                const Icon = n.kind === "material" ? FileText : Megaphone;
                const content = (
                  <div className="flex gap-3 px-4 py-3 hover:bg-primary/5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">
                        {n.kind === "news" ? "Announcement" : `${n.courses?.code} · ${n.kind === "material" ? "New material" : "Course update"}`}
                      </p>
                      <p className={`text-sm truncate ${!n.read_at ? "font-semibold text-ink" : "text-ink"}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-xs text-muted mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                );
                return n.kind === "news" ? (
                  <div key={n.id}>{content}</div>
                ) : (
                  <Link key={n.id} href={`/courses/${n.courses?.code}`} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}