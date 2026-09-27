import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { normalizeCode } from "@/lib/search";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const facultyId = searchParams.get("facultyId");
    const departmentId = searchParams.get("departmentId");
    const level = searchParams.get("level");
    const semester = searchParams.get("semester");

    const supabase = await createClient();
    let query = supabase
        .from("courses")
        .select("id, code, title, units, level, semester, departments!inner(id, name, faculty_id, faculties(name))");

    if (departmentId) query = query.eq("department_id", departmentId);
    else if (facultyId) query = query.eq("departments.faculty_id", facultyId);
    if (level) query = query.eq("level", Number(level));
    if (semester) query = query.eq("semester", Number(semester));

    const { data, error } = await query.limit(300);
    if (error) return NextResponse.json({ error: "Search failed." }, { status: 500 });

    let results = data ?? [];

    if (q) {
        const normalizedQuery = normalizeCode(q);
        const lowerQuery = q.toLowerCase();
        results = results.filter((c: any) =>
            normalizeCode(c.code).includes(normalizedQuery) ||
            c.title.toLowerCase().includes(lowerQuery)
        );
    }

    return NextResponse.json(results.slice(0, 20));
}