import { getFaculty, getDepartments } from "@/lib/academic";

export const dynamic = "force-dynamic";

export default async function BrowseDepartmentsPage({ params }: { params: Promise<{ facultyId: string }> }) {
    const { facultyId } = await params;
    const [faculty, departments] = await Promise.all([getFaculty(facultyId), getDepartments(facultyId)]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <a href="/browse" className="text-sm text-primary">← Faculties</a>
            <h1 className="text-2xl font-bold text-ink mt-2 mb-6">{faculty?.name}</h1>
            <div className="grid sm:grid-cols-2 gap-4">
                {departments.map((d: any) => (
                    <a key={d.id} href={`/browse/${facultyId}/${d.id}`} className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors">
                        <p className="font-bold text-ink">{d.name}</p>
                    </a>
                ))}
                {departments.length === 0 && <p className="text-muted text-sm col-span-2">No departments yet.</p>}
            </div>
        </div>
    );
}