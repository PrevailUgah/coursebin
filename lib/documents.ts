import { createClient } from "@/lib/supabase/server";

export async function getCourses() {
    const supabase = await createClient();
    const { data, error } = await
        supabase.from("courses").select("*").order("code");
    if (error) throw error;
    return data;
}

export async function getDocumentsByCourseCode(courseCode: string, type?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("documents")
        .select("*, courses!inner(code)")
        .eq("courses.code", courseCode.toUpperCase())
        .order("created_at", { ascending: false });

    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error) throw error;
    return data;
}
