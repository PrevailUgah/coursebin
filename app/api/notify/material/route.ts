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

  const { courseId, title, documentId, courseCode } = await request.json();

  if (!courseId || !title) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  await notifyEnrolledUsers({
    courseId,
    kind: "material",
    title: `New material: ${title}`,
    body: null,
    sourceId: documentId ?? null,
    url: `/courses/${courseCode || courseId}`,
  });

  return NextResponse.json({ success: true });
}