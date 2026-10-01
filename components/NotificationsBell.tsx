"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, FileText, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-client";
import { timeAgo } from "@/lib/utils";

interface NotificationItem {
  id: string;
  kind: "material" | "news" | "update";
  title: string;
  body?: string;
  created_at: string;
  read_at?: string | null;
  courses?: { code: string } | { code: string }[] | null;
}

export default function NotificationsBell() {
  const { signedIn, userId } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);

  const playNotificationSound = () => {
    // Guard against execution during server-side pre-rendering
    if (typeof window === "undefined" || typeof Audio === "undefined") return;

    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch((err) => {
        console.warn("Audio play blocked by browser autoplay policy:", err);
      });
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const getCourseCode = (courses: NotificationItem["courses"]) => {
    if (Array.isArray(courses)) {
      return courses[0]?.code ?? null;
    }
    return courses?.code ?? null;
  };

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }

    const supabase = createClient();

    // 1. Initial Fetch
    supabase
      .from("notifications")
      .select("id, kind, title, body, created_at, read_at, courses(code)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) =>
        setItems((data as unknown as NotificationItem[]) ?? [])
      );

    // 2. Realtime Subscription for New Notifications
    const channel = supabase
      .channel(`user-notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          playNotificationSound();

          const { data: newNotif } = await supabase
            .from("notifications")
            .select("id, kind, title, body, created_at, read_at, courses(code)")
            .eq("id", payload.new.id)
            .single();

          if (newNotif) {
            setItems((prev) => [
              newNotif as unknown as NotificationItem,
              ...prev,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!open) return;

    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
        setItems((prev) =>
          prev.map((i) =>
            unreadIds.includes(i.id)
              ? { ...i, read_at: new Date().toISOString() }
              : i
          )
        );

        const supabase = createClient();
        await supabase
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .in("id", unreadIds);
      }
    }
  }

  if (!signedIn) return null;

  const unread = items.filter((i) => !i.read_at).length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-full p-2 hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border bg-background shadow-lg">
            <div className="border-b px-4 py-3 font-medium">
              Notifications
            </div>

            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Enroll in courses to get notified about new materials and
                  updates.
                </p>
              )}

              {items.map((n) => {
                const Icon = n.kind === "material" ? FileText : Megaphone;
                const courseCode = getCourseCode(n.courses);

                const content = (
                  <div className="flex gap-3 px-4 py-3 hover:bg-muted/50">
                    <div className="mt-0.5 shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        {n.kind === "news"
                          ? "Announcement"
                          : `${courseCode ?? "Course"} · ${
                              n.kind === "material"
                                ? "New material"
                                : "Course update"
                            }`}
                      </p>
                      <p className="mt-0.5 text-sm font-medium leading-snug">
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {n.body}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>
                );

                return n.kind === "news" ? (
                  <div key={n.id}>{content}</div>
                ) : (
                  <Link
                    key={n.id}
                    href={courseCode ? `/courses/${courseCode}` : "#"}
                    onClick={() => setOpen(false)}
                  >
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