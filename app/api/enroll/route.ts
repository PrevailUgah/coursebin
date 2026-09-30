import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await request.json();
  if (!courseId) return NextResponse.json({ error: "courseId is required." }, { status: 400 });

  const { error } = await supabase.from("enrollments").insert({ user_id: user.id, course_id: courseId });

  if (error) {
    if (error.message.includes("ENROLLMENT_LIMIT_REACHED")) {
      return NextResponse.json({ error: "You can enroll in a maximum of 12 courses." }, { status: 409 });
    }
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already enrolled in this course." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not enroll." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await request.json();
  if (!courseId) return NextResponse.json({ error: "courseId is required." }, { status: 400 });

  const { error } = await supabase.from("enrollments").delete().eq("user_id", user.id).eq("course_id", courseId);
  if (error) return NextResponse.json({ error: "Could not unenroll." }, { status: 500 });

  return NextResponse.json({ success: true });
}