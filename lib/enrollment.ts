import { createClient } from "@/lib/supabase/server";

export async function getMyEnrollments(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(id, code, title, level, semester, departments(name))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}