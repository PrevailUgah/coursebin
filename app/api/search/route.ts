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

  let courseIdFilter: string[] | null = null;
  if (departmentId || facultyId) {
    let linkQuery = supabase.from("department_courses").select("course_id, departments!inner(id, faculty_id)");
    if (departmentId) linkQuery = linkQuery.eq("department_id", departmentId);
    else if (facultyId) linkQuery = linkQuery.eq("departments.faculty_id", facultyId);
    const { data: links } = await linkQuery;
    courseIdFilter = Array.from(new Set((links ?? []).map((l: any) => l.course_id)));
    if (courseIdFilter.length === 0) return NextResponse.json([]);
  }

  let query = supabase.from("courses").select("id, code, title, units, level, semester");
  if (courseIdFilter) query = query.in("id", courseIdFilter);
  if (level) query = query.eq("level", Number(level));
  if (semester) query = query.eq("semester", Number(semester));

  const { data, error } = await query.limit(300);
  if (error) return NextResponse.json({ error: "Search failed." }, { status: 500 });

  let results = data ?? [];
  if (q) {
    const normalizedQuery = normalizeCode(q);
    const lowerQuery = q.toLowerCase();
    results = results.filter(
      (c: any) => normalizeCode(c.code).includes(normalizedQuery) || c.title.toLowerCase().includes(lowerQuery)
    );
  }

  const withDepts = await Promise.all(
    results.slice(0, 20).map(async (c: any) => {
      const { data: links } = await supabase
        .from("department_courses")
        .select("departments(name)")
        .eq("course_id", c.id);
      const departmentNames = (links ?? []).map((l: any) => l.departments?.name).filter(Boolean);
      return { ...c, departmentNames };
    })
  );

  return NextResponse.json(withDepts);
}