import { createClient } from "@/lib/supabase/server";

export async function getAllCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("id, code, title, units, level, semester, departments(id, name, faculties(id, name))")
        .order("code");
    if (error) throw error;
    return data ?? [];
}