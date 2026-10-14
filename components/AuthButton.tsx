"use client";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function AuthButton() {
    const supabase = createClient();
    const containerRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return null;

    if (user) {
        const label = (user.user_metadata?.full_name || user.email || "?").trim();
        const initial = label.charAt(0).toUpperCase();

        return (
            <div ref={containerRef} className="relative shrink-0">
                <button
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Account menu"
                    className="w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center"
                >
                    {initial}
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-30">
                        <p className="px-3 py-1.5 text-xs text-muted truncate">{user.email}</p>
                        <Link href="/my-uploads" className="block px-3 py-1.5 text-sm text-ink hover:bg-primary/5">My Uploads</Link>
                        <button
                            onClick={() => { setOpen(false); supabase.auth.signOut(); }}
                            className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href="/sign-in"
            className="text-sm border border-border rounded-full px-3 py-1.5 hover:border-primary shrink-0"
        >
            Sign in
        </Link>
    );
}