import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "senior_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: existing } = await supabase
        .from("rep_competitions")
        .select("id, ends_at")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (existing && new Date(existing.ends_at).getTime() > Date.now()) {
        return NextResponse.json({ error: "A competition is already running." }, { status: 409 });
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + 5 * 24 * 60 * 60 * 1000);

    const { error } = await supabase.from("rep_competitions").insert({
        started_at: startedAt.toISOString(),
        ends_at: endsAt.toISOString(),
        started_by: user.id,
    });

    if (error) {
        console.error("start rep competition failed:", error);
        return NextResponse.json({ error: "Could not start competition." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}