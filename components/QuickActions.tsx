"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, Upload, Search, FileStack, PlusCircle } from "lucide-react";

export default function QuickActions() {
    const supabase = createClient();
    const [signedIn, setSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            setSignedIn(!!data.user);
            if (data.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("is_admin")
                    .eq("id", data.user.id)
                    .single();
                setIsAdmin(!!profile?.is_admin);
            }
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            setSignedIn(!!session);
            if (!session) setIsAdmin(false);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    function signIn() {
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    }

    const tileClass =
        "bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary transition-colors w-full";

    return (
        <div className={`grid grid-cols-2 ${isAdmin ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-3 mb-12`}>
            <a href="/browse" className={tileClass}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-ink">Browse Courses</span>
            </a>

            {signedIn ? (
                <a href="/upload" className={tileClass}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-ink">Upload</span>
                </a>
            ) : (
                <button onClick={signIn} className={tileClass}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-ink">Upload</span>
                    <span className="text-[11px] text-muted -mt-1">Sign in required</span>
                </button>
            )}

            <a href="#search-bar" className={tileClass}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-ink">Search</span>
            </a>

            {signedIn ? (
                <a href="/my-uploads" className={tileClass}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileStack className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-ink">My Uploads</span>
                </a>
            ) : (
                <button onClick={signIn} className={tileClass}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileStack className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-ink">My Uploads</span>
                    <span className="text-[11px] text-muted -mt-1">Sign in required</span>
                </button>
            )}

            {isAdmin && (
                <a href="/admin/courses" className={tileClass}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlusCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-ink">Add Course</span>
                </a>
            )}
        </div>
    );
}