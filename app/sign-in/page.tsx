"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signedIn, loading } = useAuth();

    useEffect(() => {
        if (!loading && signedIn) {
            router.replace(searchParams.get("next") || "/");
        }
    }, [loading, signedIn, router, searchParams]);

    return (
        <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
                    <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-ink mb-1">Sign in to CourseBin</h1>
                <p className="text-sm text-muted mb-6">
                    Access your enrolled courses, uploads, and notifications.
                </p>
                <button
                    onClick={() =>
                        signInWithGoogle(
                            `${window.location.origin}/auth/callback?next=${encodeURIComponent(searchParams.get("next") || "/")}`
                        )
                    }
                    className="w-full inline-flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium text-ink hover:border-primary transition-colors"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.89c2.27-2.1 3.57-5.18 3.57-8.82Z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.26v3.1A12 12 0 0 0 12 24Z" />
                        <path fill="#FBBC05" d="M5.28 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.26a12 12 0 0 0 0 10.8l4.02-3.1Z" />
                        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.6l4.02 3.1C6.23 6.86 8.88 4.75 12 4.75Z" />
                    </svg>
                    Continue with Google
                </button>
                <p className="text-xs text-muted mt-6">
                    By continuing, you agree this account will be used to identify your uploads and enrollments on CourseBin.
                </p>
            </div>
        </div>
    );
}