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
  const ref = useRef(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const playNotificationSound = () => {
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
            {unread > 0 && (

    {unread}
    )}

    {open && (
    <>

    setOpen(false)}
    />

    Notifications

    {items.length === 0 && (

    Enroll in courses to get notified about new materials and updates.

    )}
    {items.map((n) => {
    const Icon = n.kind === "material" ? FileText : Megaphone;
    const courseCode = getCourseCode(n.courses);
    const content = (

    {n.kind === "news"
    ? "Announcement"
    : \({courseCode ?? "Course"} ·\){ n.kind === "material" ? "New material" : "Course update" }}

    {n.title}

    {n.body && (

    {n.body}

    )}

    {timeAgo(n.created_at)}

    );
    return n.kind === "news" ? (

    {content}

    ) : (
    setOpen(false)}
    >
    {content}

    );
    })}

    )}

 );
}