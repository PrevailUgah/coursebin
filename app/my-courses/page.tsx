import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyEnrollments } from "@/lib/enrollment";
import { semesterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const enrollments = await getMyEnrollments(user.id);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">My Courses</h1>
        <span className="text-sm text-muted">{enrollments.length} / 12</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {enrollments.map((e: any) => (
          <Link key={e.id} href={`/courses/${e.courses?.code}`} className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors">
            <p className="font-bold text-ink">{e.courses?.code}</p>
            <p className="text-sm text-muted">{e.courses?.title}</p>
            <p className="text-xs text-muted mt-1">
              {e.courses?.departments?.name} · {e.courses?.level} Level · {semesterLabel(e.courses?.semester)}
            </p>
          </Link>
        ))}
        {enrollments.length === 0 && (
          <p className="text-muted text-sm col-span-2">You haven't enrolled in any courses yet. Browse courses and tap Enroll.</p>
        )}
      </div>
    </div>
  );
}