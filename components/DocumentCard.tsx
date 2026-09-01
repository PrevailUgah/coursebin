"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const typeLabels: Record<string, string> = {
    "past-question": "Past Question",
    "notes": "Notes",
    "study-guide": "Study Guide",
};

const typeColors: Record<string, string> = {
    "past-question": "bg-amber-100 text-amber-800",
    "notes": "bg-blue-100 text-blue-800",
    "study-guide": "bg-emerald-100 text-emerald-800",
};

export default function DocumentCard({ doc }: { doc: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    }, []);

    const isOwner = userId && userId === doc.uploaded_by;

    async function handleDelete() {
        if (!confirm("Delete this document? This can't be undone.")) return;
        setDeleting(true);
        const res = await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
        if (res.ok) {
            router.refresh();
        } else {
            alert("Failed to delete. Please try again.");
            setDeleting(false);
        }
    }

    return (
        <div className="border border-border rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
            <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${typeColors[doc.type]}`}>
                {typeLabels[doc.type]}
            </span>
            <h3 className="font-semibold text-ink mt-2">{doc.title}</h3>
            <p className="text-sm text-muted">{doc.courses?.code}</p>

            <div className="flex items-center gap-4 mt-3">
                <a
                    href={`/api/download/${doc.id}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                    View document →
                </a>

                {
                    isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                            {deleting ? "Deleting…" : "Delete"}
                        </button>
                    )
                }
            </div >
        </div >
    );
}