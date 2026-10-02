import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "senior_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, body } = await request.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const { data: allUsers, error: usersErr } = await supabase
    .from("profiles")
    .select("id");

  if (usersErr || !allUsers?.length) {
    return NextResponse.json({ error: "Could not load users." }, { status: 500 });
  }

  const broadcastId = crypto.randomUUID();
  const rows = allUsers.map((p) => ({
    user_id: p.id,
    course_id: null,
    kind: "news",
    title: title.trim(),
    body: body?.trim() || null,
    source_id: broadcastId,
  }));

  // Insert in batches of 500
  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from("notifications").insert(batch);
    if (error) {
      console.error("News insert error:", error);
      return NextResponse.json(
        { error: error.message || "Could not send broadcast." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, recipients: rows.length });
}