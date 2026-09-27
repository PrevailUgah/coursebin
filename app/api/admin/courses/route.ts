import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { code, title, department, level } = body;

    if (!code || !title || !department || ![100, 200, 300].includes(level)) {
        return NextResponse.json({ error: "Invalid course data." }, { status: 400 });
    }

    const { error } = await supabase.from("courses").insert({ code, title, department, level });

    if (error) {
        return NextResponse.json({ error: "Could not create course." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}