import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "student";
  if (role !== "junior_admin" && role !== "senior_admin") {
    return NextResponse.json({ error: "Only admins can upload materials." }, { status: 403 });
  }

  const { data, error } = await supabase.from("courses").select("id, code, title, level, semester").order("code");
  if (error) return NextResponse.json({ error: "Could not load courses." }, { status: 500 });
  return NextResponse.json(data ?? []);
}