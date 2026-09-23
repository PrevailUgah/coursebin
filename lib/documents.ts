import { createClient } from "@/lib/supabase/server";

export async function getCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("courses").select("*").order("code");
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

export async function getPopularCourses(limit = 3) {
    const supabase = await createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select("id, code, title, department");

    if (!courses) return [];

    const withCounts = await Promise.all(
        courses.map(async (c) => {
            const { count } = await supabase
                .from("documents")
                .select("id", { count: "exact", head: true })
                .eq("course_id", c.id);
            return { ...c, materialCount: count ?? 0 };
        })
    );

    return withCounts.sort((a, b) => b.materialCount - a.materialCount).slice(0, limit);
}

export async function getRecentDocuments(limit = 4) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("documents")
        .select("id, title, type, created_at, courses(code)")
        .order("created_at", { ascending: false })
        .limit(limit);
    return data ?? [];
}

export async function getMyDocuments(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("documents")
        .select("*, courses(code)")
        .eq("uploaded_by", userId)
        .order("created_at", { ascending: false });
    return data ?? [];
}