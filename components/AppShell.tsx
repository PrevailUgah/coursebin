"use client";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { unlockNotificationSound } from "@/lib/notificationSound";
import { registerPush } from "@/lib/push";
import { createClient } from "@/lib/supabase/client";

function PushRegistrar() {
  const { signedIn, userId } = useAuth();

  useEffect(() => {
    if (!signedIn || !userId) return;

    registerPush().then(async (subscription) => {
      if (!subscription) return;

      const json = subscription.toJSON();
      const supabase = createClient();

      await supabase.from("push_subscriptions").upsert(
        {
          user_id: userId,
          endpoint: json.endpoint!,
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth,
        },
        { onConflict: "user_id,endpoint" }
      );
    });
  }, [signedIn, userId]);

  return null;
}

export default function AppShell({
  faculties,
  children,
}: {
  faculties: any[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved === "collapsed") setCollapsed(true);
    if (saved === "expanded") setCollapsed(false);
  }, []);

  useEffect(() => {
    function unlock() {
      unlockNotificationSound();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  function toggleSidebar() {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const currentlyCollapsed = collapsed === null ? !isDesktop : collapsed;
    const nextCollapsed = !currentlyCollapsed;
    setCollapsed(nextCollapsed);
    localStorage.setItem("sidebar", nextCollapsed ? "collapsed" : "expanded");
  }

  return (
    <AuthProvider>
      <PushRegistrar />
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar faculties={faculties} />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </div>
      </div>
      <BottomNav />
    </AuthProvider>
  );
}