import { createClient } from "@/lib/supabase/server";

export async function getAllCourses() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, code, title, units, level, semester")
    .order("code");
  if (error) throw error;

  return Promise.all(
    (courses ?? []).map(async (c) => {
      const { data: links } = await supabase
        .from("department_courses")
        .select("department_id, departments(id, name, faculties(name))")
        .eq("course_id", c.id);
      const departments = (links ?? []).map((l: any) => ({
        id: l.department_id,
        name: l.departments?.name,
        faculty: l.departments?.faculties?.name,
      }));
      return { ...c, departments };
    })
  );
}