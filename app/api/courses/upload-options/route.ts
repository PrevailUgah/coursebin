import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retrieve user role from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin =
    profile?.role === "senior_admin" || profile?.role === "junior_admin";

  if (isAdmin) {
    // Admins get all courses in the system
    const { data: courses, error } = await supabase
      .from("courses")
      .select("id, code, title, level, semester")
      .order("code");

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch courses" },
        { status: 500 }
      );
    }
    return NextResponse.json({ courses, role: profile?.role });
  } else {
    // Members get only their active enrolled courses (up to 12)
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select("course_id, courses(id, code, title, level, semester)")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch enrolled courses" },
        { status: 500 }
      );
    }

    const courses = (enrollments ?? [])
      .map((e: any) => e.courses)
      .filter(Boolean)
      .sort((a: any, b: any) => a.code.localeCompare(b.code));

    return NextResponse.json({ courses, role: "member" });
  }
}