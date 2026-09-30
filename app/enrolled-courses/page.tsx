import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyEnrollments } from "@/lib/enrollment";
import { semesterLabel } from "@/lib/utils";
import UnenrollButton from "@/components/UnenrollButton";

export const dynamic = "force-dynamic";

export default async function EnrolledCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const enrollments = await getMyEnrollments(user.id);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">My Enrolled Courses</h1>
        <span className="text-sm text-muted">{enrollments.length} / 12</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {enrollments.map((e: any) => (
          <div key={e.id} className="border border-border rounded-xl p-4 bg-card">
            <p className="font-bold text-ink">{e.courses?.code}</p>
            <p className="text-sm text-muted">{e.courses?.title}</p>
            <p className="text-xs text-muted mt-1">
              {e.departmentName} · {e.courses?.level} Level · {semesterLabel(e.courses?.semester)}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Link href={`/courses/${e.courses?.code}`} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">Materials</Link>
              <Link href={`/courses/${e.courses?.code}?tab=updates`} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">Updates</Link>
              <UnenrollButton courseId={e.course_id} />
            </div>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p className="text-muted text-sm col-span-2">You haven't enrolled in any courses yet. Browse courses and tap Enroll.</p>
        )}
      </div>
    </div>
  );
}