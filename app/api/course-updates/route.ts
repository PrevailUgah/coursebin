import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["junior_admin", "senior_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId, type, title, body, eventAt } = await request.json();
  if (!courseId || !title || !["assignment", "lecture", "exam", "announcement"].includes(type)) {
    return NextResponse.json({ error: "Invalid update data." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("course_updates")
    .insert({ course_id: courseId, author_id: user.id, type, title, body: body || null, event_at: eventAt || null })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Could not post update." }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
}