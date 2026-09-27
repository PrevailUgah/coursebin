import { getFaculties } from "@/lib/academic";

export const dynamic = "force-dynamic";

export default async function BrowseFacultiesPage() {
    const faculties = await getFaculties();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <h1 className="text-2xl font-bold text-ink mb-6">Browse by Faculty</h1>
            <div className="grid sm:grid-cols-2 gap-4">
                {faculties.map((f: any) => (
                    <a key={f.id} href={`/browse/${f.id}`} className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors">
                        <p className="font-bold text-ink">{f.name}</p>
                    </a>
                ))}
                {faculties.length === 0 && <p className="text-muted text-sm col-span-2">No faculties yet.</p>}
            </div>
        </div>
    );
}