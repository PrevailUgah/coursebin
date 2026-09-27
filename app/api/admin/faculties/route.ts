import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { name } = await request.json();
    if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "Faculty name is required." }, { status: 400 });
    }

    const { error } = await supabase.from("faculties").insert({ name });
    if (error) return NextResponse.json({ error: "Could not create faculty." }, { status: 500 });

    return NextResponse.json({ success: true });
}