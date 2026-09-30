"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Role = "student" | "junior_admin" | "senior_admin";

type AuthState = {
  signedIn: boolean;
  role: Role;
  isAdmin: boolean;
  isSeniorAdmin: boolean;
  loading: boolean;
  userId: string | null;
};

const initialState: AuthState = {
  signedIn: false, role: "student", isAdmin: false, isSeniorAdmin: false, loading: true, userId: null,
};

const AuthContext = createContext<AuthState>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const supabase = createClient();

    async function load(userId: string | null | undefined) {
      if (!userId) {
        setState({ ...initialState, loading: false });
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
      const role = (profile?.role as Role) ?? "student";
      setState({
        signedIn: true,
        role,
        isAdmin: role === "junior_admin" || role === "senior_admin",
        isSeniorAdmin: role === "senior_admin",
        loading: false,
        userId,
      });
    }

    supabase.auth.getUser().then(({ data }) => load(data.user?.id));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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