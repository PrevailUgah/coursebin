"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function AuthButton() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return null;

    if (user) {
        return (
            <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-muted hover:text-ink"
            >
                Sign out ({user.email})
            </button>
        );
    }

    return (
        <button
            onClick={() => supabase.auth.signInWithOAuth({
                provider: "github",
                options: { redirectTo: `${window.location.origin}/auth/callback` },
            })}
            className="text-sm border border-border rounded-full px-3 py-1.5 hover:border-primary"
        >
            Sign in with GitHub
        </button>
    );
}