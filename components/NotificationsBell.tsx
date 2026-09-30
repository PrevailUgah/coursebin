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
    if (!userId) { setItems([]); return; }
    const supabase = createClient();
    supabase
      .from("notifications")
      .select("id, kind, title, created_at, read_at, courses(code)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(15)
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
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-card border border-border rounded-xl shadow-lg z-40">
          <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Updates from your courses</p>
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {items.length === 0 && <p className="px-4 py-6 text-sm text-muted text-center">Enroll in courses to get notified about new materials and updates.</p>}
            {items.map((n) => {
              const Icon = n.kind === "material" ? FileText : Megaphone;
              return (
                <Link key={n.id} href={`/courses/${n.courses?.code}`} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-primary/5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{n.courses?.code} · {n.kind === "material" ? "New material" : "Course update"}</p>
                    <p className={`text-sm truncate ${!n.read_at ? "font-semibold text-ink" : "text-ink"}`}>{n.title}</p>
                    <p className="text-xs text-muted">{timeAgo(n.created_at)}</p>
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