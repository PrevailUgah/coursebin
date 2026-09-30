import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function requireSeniorAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "senior_admin") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { error: authError } = await requireSeniorAdmin(supabase);
  if (authError) return authError;

  const { courseId, departmentIds } = await request.json();
  if (!courseId || !Array.isArray(departmentIds) || departmentIds.length === 0) {
    return NextResponse.json({ error: "courseId and departmentIds are required." }, { status: 400 });
  }

  const rows = departmentIds.map((departmentId: string) => ({ department_id: departmentId, course_id: courseId }));
  const { error } = await supabase
    .from("department_courses")
    .upsert(rows, { onConflict: "department_id,course_id", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Could not link course." }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { error: authError } = await requireSeniorAdmin(supabase);
  if (authError) return authError;

  const { courseId, departmentId } = await request.json();
  if (!courseId || !departmentId) {
    return NextResponse.json({ error: "courseId and departmentId are required." }, { status: 400 });
  }

  const { error } = await supabase.from("department_courses").delete().eq("course_id", courseId).eq("department_id", departmentId);
  if (error) return NextResponse.json({ error: "Could not unlink course." }, { status: 500 });

  return NextResponse.json({ success: true });
}