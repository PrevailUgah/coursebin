"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Home, BookOpen, Upload, User, LogIn } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();
    const supabase = createClient();
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            setSignedIn(!!session);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    function signIn() {
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    }

    const itemClass = (active: boolean) =>
        `flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${active ? "text-primary" : "text-muted"}`;

    return (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border flex justify-around items-center py-2 z-20">
            <a href="/" className={itemClass(pathname === "/")}>
                <Home className="w-5 h-5" />
                Home
            </a>
            <a href="/browse" className={itemClass(pathname === "/browse")}>
                <BookOpen className="w-5 h-5" />
                Browse
            </a>
            {signedIn ? (
                <a href="/upload" className={itemClass(pathname === "/upload")}>
                    <Upload className="w-5 h-5" />
                    Upload
                </a>
            ) : (
                <button onClick={signIn} className={itemClass(false)}>
                    <Upload className="w-5 h-5" />
                    Upload
                </button>
            )}
            {signedIn ? (
                <a href="/my-uploads" className={itemClass(pathname === "/my-uploads")}>
                    <User className="w-5 h-5" />
                    My Uploads
                </a>
            ) : (
                <button onClick={signIn} className={itemClass(false)}>
                    <LogIn className="w-5 h-5" />
                    Sign in
                </button>
            )}
        </nav>
    );
}