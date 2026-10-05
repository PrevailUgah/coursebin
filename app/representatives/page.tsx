import { getRepresentativesLeaderboard } from "@/lib/representatives";
import RepCountdown from "@/components/RepCountdown";
import { createClient } from "@/lib/supabase/server";
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

const medalColor = ["text-amber-500", "text-slate-400", "text-amber-700"];

export default async function RepresentativesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let isSeniorAdmin = false;
    if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        isSeniorAdmin = profile?.role === "senior_admin";
    }

    const { competition, rows } = await getRepresentativesLeaderboard();

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-ink mb-1">Course Representatives</h1>
            <p className="text-sm text-muted mb-6">Ranked by engagement — total materials uploaded plus course updates posted.</p>

            <RepCountdown endsAt={competition?.ends_at ?? null} hasCompetition={!!competition} isSeniorAdmin={isSeniorAdmin} />

            <h2 className="text-sm font-semibold text-muted uppercase mb-3">Representatives List</h2>
            <div className="space-y-2">
                {rows.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-4 border border-border rounded-xl p-4 bg-card">
                        <div className="w-8 text-center shrink-0">
                            {i < 3 ? <Trophy className={`w-5 h-5 mx-auto ${medalColor[i]}`} /> : <span className="text-sm font-semibold text-muted">{i + 1}</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-ink truncate">{r.name}</p>
                            {r.email && <p className="text-xs text-muted truncate">{r.email}</p>}
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-ink tabular-nums">{r.total}</p>
                            <p className="text-[10px] text-muted">{r.uploads} uploads · {r.updates} updates</p>
                        </div>
                    </div>
                ))}
                {rows.length === 0 && <p className="text-muted text-sm">No junior admins yet.</p>}
            </div>
        </div>
    );
}