"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const { signedIn, userId } = useAuth();
  const supabase = createClient();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle()
      .then(({ data }) => { setEnrolled(!!data); setLoading(false); });
  }, [userId, courseId]);

  async function toggle() {
    if (!signedIn) return signInWithGoogle();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/enroll", {
      method: enrolled ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      setBusy(false);
      return;
    }

    setEnrolled(!enrolled);
    setBusy(false);
  }

  if (loading) return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={busy}
        className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg shrink-0 disabled:opacity-50 ${
          enrolled ? "bg-primary/10 text-primary" : "bg-primary text-white"
        }`}
      >
        {enrolled ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
        {enrolled ? "Enrolled" : "Enroll"}
      </button>
      {error && <p className="text-xs text-red-600 max-w-[16rem] text-right">{error}</p>}
    </div>
  );
}