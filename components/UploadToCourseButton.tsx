"use client";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";

export default function UploadToCourseButton({ code }: { code: string }) {
    const { signedIn } = useAuth();
    const cls =
        "inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg shrink-0";

    if (signedIn) {
        return (
            <Link href={`/upload?course=${encodeURIComponent(code)}`} className={cls}>
                <Upload className="w-4 h-4" /> Upload resource
            </Link>
        );
    }

    return (
        <button onClick={signInWithGoogle} className={cls}>
            <Upload className="w-4 h-4" /> Sign in to upload
        </button>
    );
}