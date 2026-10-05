"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

function formatRemaining(ms: number) {
    if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const totalSeconds = Math.floor(ms / 1000);
    return {
        d: Math.floor(totalSeconds / 86400),
        h: Math.floor((totalSeconds % 86400) / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
    };
}

export default function RepCountdown({
    endsAt, hasCompetition, isSeniorAdmin,
}: { endsAt: string | null; hasCompetition: boolean; isSeniorAdmin: boolean }) {
    const router = useRouter();
    const [now, setNow] = useState(() => Date.now());
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const endMs = endsAt ? new Date(endsAt).getTime() : 0;
    const active = hasCompetition && endMs > now;

    useEffect(() => {
        if (!active) return;
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, [active]);

    useEffect(() => {
        if (active && endMs - now <= 1000) {
            const timeout = setTimeout(() => router.refresh(), endMs - now + 500);
            return () => clearTimeout(timeout);
        }
    }, [active, endMs, now, router]);

    async function handleStart() {
        setStarting(true);
        setError(null);
        const res = await fetch("/api/admin/rep-competition/start", { method: "POST" });
        setStarting(false);
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error ?? "Could not start competition.");
            return;
        }
        router.refresh();
    }

    if (active) {
        const { d, h, m, s } = formatRemaining(endMs - now);
        return (
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6 text-center">
                <p className="text-sm text-primary font-medium mb-2">Competition ends in</p>
                <div className="flex justify-center gap-3 text-ink">
                    {[["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]].map(([label, val]) => (
                        <div key={label as string} className="bg-card border border-border rounded-xl px-3 py-2 min-w-[3.5rem]">
                            <p className="text-xl font-bold tabular-nums">{String(val).padStart(2, "0")}</p>
                            <p className="text-[10px] text-muted uppercase">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6 text-center">
            <p className="text-sm font-semibold text-ink mb-1">
                {hasCompetition ? "The last competition has ended." : "No competition has started yet."}
            </p>
            <p className="text-xs text-muted mb-3">Engagement is counted for 5 days once a competition starts.</p>
            {isSeniorAdmin ? (
                <>
                    <button onClick={handleStart} disabled={starting} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
                        <Play className="w-4 h-4" /> {starting ? "Starting…" : "Start 5-day competition"}
                    </button>
                    {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                </>
            ) : (
                <p className="text-xs text-muted">A senior admin can start the next competition.</p>
            )}
        </div>
    );
}