import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { name, facultyId } = await request.json();
    if (!name || !facultyId) {
        return NextResponse.json({ error: "Department name and faculty are required." }, { status: 400 });
    }

    const { error } = await supabase.from("departments").insert({ name, faculty_id: facultyId });
    if (error) return NextResponse.json({ error: "Could not create department." }, { status: 500 });

    return NextResponse.json({ success: true });
}