import { createClient } from "@/lib/supabase/server";

export async function getMyEnrollments(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(id, code, title, level, semester)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const withDepts = await Promise.all(
    (data ?? []).map(async (e: any) => {
      const { data: links } = await supabase
        .from("department_courses")
        .select("departments(name)")
        .eq("course_id", e.course_id)
        .limit(1);
      return { ...e, departmentName: links?.[0]?.departments?.name ?? "" };
    })
  );
  return withDepts;
}