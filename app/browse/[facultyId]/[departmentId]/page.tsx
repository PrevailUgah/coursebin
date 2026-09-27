import { getDepartment, getLevelsWithCourses } from "@/lib/academic";

export const dynamic = "force-dynamic";

export default async function BrowseLevelsPage({
    params,
}: { params: Promise<{ facultyId: string; departmentId: string }> }) {
    const { facultyId, departmentId } = await params;
    const [department, levels] = await Promise.all([
        getDepartment(departmentId),
        getLevelsWithCourses(departmentId),
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <a href={`/browse/${facultyId}`} className="text-sm text-primary">← {(department as any)?.faculties?.name}</a>
            <h1 className="text-2xl font-bold text-ink mt-2 mb-6">{department?.name}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {levels.map((level) => (
                    <a key={level} href={`/browse/${facultyId}/${departmentId}/${level}`} className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors text-center">
                        <p className="font-bold text-ink">{level} Level</p>
                    </a>
                ))}
                {levels.length === 0 && <p className="text-muted text-sm col-span-4">No courses yet in this department.</p>}
            </div>
        </div>
    );
}