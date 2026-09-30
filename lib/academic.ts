import { createClient } from "@/lib/supabase/server";

export async function getFaculties() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faculties").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getFacultiesWithDepartments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faculties")
    .select("id, name, departments(id, name)")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getFaculty(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("faculties").select("*").eq("id", id).single();
  return data;
}

export async function getDepartments(facultyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("faculty_id", facultyId)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getDepartment(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*, faculties(id, name)")
    .eq("id", id)
    .single();
  return data;
}

export async function getLevelsWithCourses(departmentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department_courses")
    .select("courses!inner(level)")
    .eq("department_id", departmentId);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r: any) => r.courses.level))).sort((a, b) => a - b);
}

export async function getSemestersWithCourses(departmentId: string, level: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department_courses")
    .select("courses!inner(semester)")
    .eq("department_id", departmentId)
    .eq("courses.level", level);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r: any) => r.courses.semester))).sort((a, b) => a - b);
}

export async function getCoursesFor(departmentId: string, level: number, semester: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department_courses")
    .select("courses!inner(id, code, title, units, level, semester)")
    .eq("department_id", departmentId)
    .eq("courses.level", level)
    .eq("courses.semester", semester);
  if (error) throw error;
  return (data ?? [])
    .map((row: any) => row.courses)
    .sort((a: any, b: any) => a.code.localeCompare(b.code));
}

export async function getCourseByCode(code: string) {
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();
  if (!course) return null;

  const { data: links } = await supabase
    .from("department_courses")
    .select("created_at, departments(id, name, faculty_id, faculties(id, name))")
    .eq("course_id", course.id)
    .order("created_at", { ascending: true });

  const departments = (links ?? []).map((l: any) => l.departments);
  return { ...course, departments };
}