import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { departmentId, level, semester, code, title, units } = await request.json();

    if (
        !departmentId ||
        !code ||
        !title ||
        ![100, 200, 300, 400].includes(level) ||
        ![1, 2].includes(semester) ||
        !Number.isInteger(units) ||
        units < 1
    ) {
        return NextResponse.json({ error: "Invalid course data." }, { status: 400 });
    }

    const { error } = await supabase.from("courses").insert({
        department_id: departmentId,
        level,
        semester,
        code,
        title,
        units,
    });

    if (error) return NextResponse.json({ error: "Could not create course." }, { status: 500 });

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
        try {
            const body = await request.json();
            id = body?.id;
        } catch {
            // Body parsing ignored if not JSON
        }
    }

    if (!id) {
        return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Could not delete course." }, { status: 500 });

    return NextResponse.json({ success: true });
}