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
        .from("courses")
        .select("level")
        .eq("department_id", departmentId);
    if (error) throw error;
    return Array.from(new Set((data ?? []).map((c) => c.level))).sort((a, b) => a - b);
}

export async function getSemestersWithCourses(departmentId: string, level: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("semester")
        .eq("department_id", departmentId)
        .eq("level", level);
    if (error) throw error;
    return Array.from(new Set((data ?? []).map((c) => c.semester))).sort((a, b) => a - b);
}

export async function getCoursesFor(departmentId: string, level: number, semester: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("department_id", departmentId)
        .eq("level", level)
        .eq("semester", semester)
        .order("code");
    if (error) throw error;
    return data;
}

export async function getCourseByCode(code: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("courses")
        .select("*, departments(id, name, faculty_id, faculties(id, name))")
        .eq("code", code.toUpperCase())
        .single();
    return data;
}