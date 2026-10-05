"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";

export default function MyCoursesQuickAction() {
  const { signedIn, userId } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open || loaded || !userId) return;
    const supabase = createClient();
    supabase
      .from("enrollments")
      .select("course_id, courses(code, title)")
      .eq("user_id", userId)
      .then(({ data }) => {
        setCourses(data ?? []);
        setLoaded(true);
      });
  }, [open, loaded, userId]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const tileClass = "bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary transition-colors w-full";
  const iconWrap = "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center";

  if (!signedIn) {
    return (
      <button onClick={() => signInWithGoogle()} className={tileClass}>
        <div className={iconWrap}><ListChecks className="w-5 h-5 text-primary" /></div>
        <span className="text-sm font-medium text-ink">My Courses</span>
        <span className="text-[11px] text-muted -mt-1">Sign in required</span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative w-full">
      <button onClick={() => setOpen((o) => !o)} className={tileClass}>
        <div className={iconWrap}><ListChecks className="w-5 h-5 text-primary" /></div>
        <span className="text-sm font-medium text-ink">My Courses</span>
      </button>

      {open && (
        <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:left-0 top-20 sm:top-auto sm:mt-2 w-auto sm:w-72 max-h-[70vh] sm:max-h-80 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-40">
          <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Enrolled courses ({courses.length}/12)</p>
          <div className="divide-y divide-border">
            {courses.length === 0 && <p className="px-4 py-6 text-sm text-muted text-center">No courses enrolled yet.</p>}
            {courses.map((e: any) => (
              <Link key={e.course_id} href={`/courses/${e.courses?.code}`} onClick={() => setOpen(false)} className="block px-4 py-2.5 hover:bg-primary/5">
                <p className="text-sm font-medium text-ink">{e.courses?.code}</p>
                <p className="text-xs text-muted truncate">{e.courses?.title}</p>
              </Link>
            ))}
          </div>
          <Link href="/enrolled-courses" onClick={() => setOpen(false)} className="block text-center text-sm font-medium text-primary py-2.5 border-t border-border">
            Manage all →
          </Link>
        </div>
      )}
    </div>
  );
}