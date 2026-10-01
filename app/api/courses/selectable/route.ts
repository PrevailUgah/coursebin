import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "student";
  const isAdmin = role === "junior_admin" || role === "senior_admin";

  if (isAdmin) {
    const { data, error } = await supabase.from("courses").select("id, code, title, level, semester").order("code");
    if (error) return NextResponse.json({ error: "Could not load courses." }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select("courses(id, code, title, level, semester)")
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Could not load your courses." }, { status: 500 });

  const courses = (data ?? []).map((row: any) => row.courses).filter(Boolean);
  return NextResponse.json(courses);
}