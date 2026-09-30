import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_ROLES = ["student", "junior_admin", "senior_admin"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "senior_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { role } = await request.json();
  if (!VALID_ROLES.includes(role)) return NextResponse.json({ error: "Invalid role." }, { status: 400 });

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update role." }, { status: 500 });

  return NextResponse.json({ success: true });
}