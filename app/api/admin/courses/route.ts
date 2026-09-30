import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "senior_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { departmentIds, level, semester, code, title, units } = await request.json();

  if (
    !Array.isArray(departmentIds) || departmentIds.length === 0 || !code || !title ||
    ![100, 200, 300, 400].includes(level) || ![1, 2].includes(semester) ||
    !Number.isInteger(units) || units < 1
  ) {
    return NextResponse.json({ error: "Invalid course data." }, { status: 400 });
  }

  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .insert({ code, title, level, semester, units })
    .select("id")
    .single();

  if (courseErr) {
    const message = courseErr.code === "23505" ? "A course with this code already exists." : "Could not create course.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const links = departmentIds.map((departmentId: string) => ({ department_id: departmentId, course_id: course.id }));
  const { error: linkErr } = await supabase.from("department_courses").insert(links);
  if (linkErr) return NextResponse.json({ error: "Course created, but could not link departments." }, { status: 500 });

  return NextResponse.json({ success: true, id: course.id });
}