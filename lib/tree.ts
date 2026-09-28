import { createClient } from "@/lib/supabase/server";

export async function getAcademicTree() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("faculties")
        .select("id, name, departments(id, name, courses(id, code, title, level, semester))")
        .order("name");

    return (data ?? []).map((f: any) => ({
        id: f.id,
        name: f.name,
        departments: [...(f.departments ?? [])]
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((d: any) => ({
                id: d.id,
                name: d.name,
                courses: [...(d.courses ?? [])].sort((a: any, b: any) => a.code.localeCompare(b.code)),
            })),
    }));
}