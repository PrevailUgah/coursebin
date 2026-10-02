import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { notifyEnrolledUsers } from "@/lib/notify";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["junior_admin", "senior_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId, type, title, body, eventAt } = await request.json();

  if (
    !courseId ||
    !title ||
    !["assignment", "lecture", "exam", "announcement"].includes(type)
  ) {
    return NextResponse.json({ error: "Invalid update data." }, { status: 400 });
  }

  // 1. Create the course update
  const { data, error } = await supabase
    .from("course_updates")
    .insert({
      course_id: courseId,
      author_id: user.id,
      type,
      title,
      body: body || null,
      event_at: eventAt || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not post update." }, { status: 500 });
  }

  // 2. Get course code for a nice URL
  const { data: course } = await supabase
    .from("courses")
    .select("code")
    .eq("id", courseId)
    .single();

  const courseCode = course?.code ?? courseId;

  // 3. Notify all enrolled users (in-app + real push notification)
  await notifyEnrolledUsers({
    courseId,
    kind: "update",
    title,
    body: body || null,
    sourceId: data.id,
    url: `/courses/${courseCode}?tab=updates`,
  });

  return NextResponse.json({ success: true, id: data.id });
}