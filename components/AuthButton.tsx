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
                className="text-sm text-muted hover:text-ink max-w-[160px] sm:max-w-none truncate"
            >
                Sign out ({user.email})
            </button>
        );
    }

    return (
        <button
            onClick={() => supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })}
            className="text-sm border border-border rounded-full px-3 py-1.5 hover:border-primary shrink-0"
        >
            Sign in with Google
        </button>
    );
}