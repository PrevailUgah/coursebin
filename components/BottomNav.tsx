"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Home, BookOpen, Upload, User, LogIn } from "lucide-react";

// Instantiate the client outside the component to avoid re-creation on re-renders
const supabase = createClient();

export default function BottomNav() {
    const pathname = usePathname();
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));

        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            setSignedIn(!!session);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const items = [
        { href: "/", label: "Home", icon: Home },
        { href: "/browse", label: "Browse", icon: BookOpen },
        { href: "/upload", label: "Upload", icon: Upload },
    ];

    return (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border flex justify-around items-center py-2 z-20">
            {items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${active ? "text-primary" : "text-muted"
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </Link>
                );
            })}

            {signedIn ? (
                <Link
                    href="/my-uploads"
                    className={`flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${pathname === "/my-uploads" ? "text-primary" : "text-muted"
                        }`}
                >
                    <User className="w-5 h-5" />
                    Account
                </Link>
            ) : (
                <button
                    onClick={() =>
                        supabase.auth.signInWithOAuth({
                            provider: "google",
                            options: {
                                redirectTo: `${window.location.origin}/auth/callback`,
                            },
                        })
                    }
                    className="flex flex-col items-center gap-0.5 text-xs px-3 py-1 text-muted"
                >
                    <LogIn className="w-5 h-5" />
                    Sign in
                </button>
            )}
        </nav>
    );
}