"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthState = { signedIn: boolean; isAdmin: boolean; loading: boolean };

const AuthContext = createContext<AuthState>({ signedIn: false, isAdmin: false, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ signedIn: false, isAdmin: false, loading: true });

    useEffect(() => {
        const supabase = createClient();

        async function load(userId: string | null | undefined) {
            if (!userId) {
                setState({ signedIn: false, isAdmin: false, loading: false });
                return;
            }
            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", userId)
                .single();
            setState({ signedIn: true, isAdmin: !!profile?.is_admin, loading: false });
        }

        supabase.auth.getUser().then(({ data }) => load(data.user?.id));

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            // Deferred on purpose: calling Supabase inside this callback can deadlock.
            setTimeout(() => load(session?.user?.id), 0);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export function signInWithGoogle() {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
}