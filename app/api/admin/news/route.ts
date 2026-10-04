import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "senior_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, body } = await request.json();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  const { data: allUsers, error: usersErr } = await supabase.from("profiles").select("id");
  if (usersErr || !allUsers) {
    console.error("news broadcast: could not load users", usersErr);
    return NextResponse.json({ error: "Could not load users." }, { status: 500 });
  }

  const broadcastId = crypto.randomUUID();
  const rows = allUsers.map((p) => ({
    user_id: p.id, course_id: null, kind: "news", title, body: body || null, source_id: broadcastId,
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) {
    console.error("news broadcast insert failed:", error.code, error.message);
    const message = error.code === "42501"
      ? "You don't have permission to broadcast news. Check that the senior-admin RLS policy on notifications exists."
      : "Could not send broadcast.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ success: true, recipients: rows.length });
}