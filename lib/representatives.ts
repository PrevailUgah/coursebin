import { createClient } from "@/lib/supabase/server";

export type RepCompetition = { id: string; started_at: string; ends_at: string };
export type RepRow = { id: string; name: string; email: string | null; uploads: number; updates: number; total: number };

export async function getCurrentCompetition(): Promise<RepCompetition | null> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("rep_competitions")
        .select("id, started_at, ends_at")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    return data ?? null;
}

export async function getRepresentativesLeaderboard() {
    const supabase = await createClient();
    const competition = await getCurrentCompetition();

    const { data: reps } = await supabase.from("profiles").select("id, full_name, email").eq("role", "junior_admin");
    const list = reps ?? [];

    if (!competition) {
        const rows: RepRow[] = list
            .map((r) => ({ id: r.id, name: r.full_name || r.email || "Unnamed", email: r.email, uploads: 0, updates: 0, total: 0 }))
            .sort((a, b) => a.name.localeCompare(b.name));
        return { competition: null as RepCompetition | null, rows };
    }

    const { started_at, ends_at } = competition;

    const rows: RepRow[] = await Promise.all(
        list.map(async (r) => {
            const [{ count: uploads }, { count: updates }] = await Promise.all([
                supabase.from("documents").select("id", { count: "exact", head: true }).eq("uploaded_by", r.id).gte("created_at", started_at).lte("created_at", ends_at),
                supabase.from("course_updates").select("id", { count: "exact", head: true }).eq("author_id", r.id).gte("created_at", started_at).lte("created_at", ends_at),
            ]);
            const u = uploads ?? 0;
            const c = updates ?? 0;
            return { id: r.id, name: r.full_name || r.email || "Unnamed", email: r.email, uploads: u, updates: c, total: u + c };
        })
    );

    rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    return { competition, rows };
}