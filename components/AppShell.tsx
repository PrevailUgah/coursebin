"use client";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth-client";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function AppShell({
    faculties,
    children,
}: {
    faculties: any[];
    children: React.ReactNode;
}) {
    // null = follow the breakpoint (rail on tablet, expanded on desktop)
    const [collapsed, setCollapsed] = useState<boolean | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar");
        if (saved === "collapsed") setCollapsed(true);
        if (saved === "expanded") setCollapsed(false);
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