import { getDepartment, getSemestersWithCourses } from "@/lib/academic";
import { semesterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BrowseSemestersPage({
    params,
}: { params: Promise<{ facultyId: string; departmentId: string; level: string }> }) {
    const { facultyId, departmentId, level } = await params;
    const levelNum = Number(level);
    const [department, semesters] = await Promise.all([
        getDepartment(departmentId),
        getSemestersWithCourses(departmentId, levelNum),
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <a href={`/browse/${facultyId}/${departmentId}`} className="text-sm text-primary">← {department?.name}</a>
            <h1 className="text-2xl font-bold text-ink mt-2 mb-6">{levelNum} Level</h1>
            <div className="grid grid-cols-2 gap-4">
                {semesters.map((s) => (
                    <a key={s} href={`/browse/${facultyId}/${departmentId}/${levelNum}/${s}`} className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors text-center">
                        <p className="font-bold text-ink">{semesterLabel(s)}</p>
                    </a>
                ))}
                {semesters.length === 0 && <p className="text-muted text-sm col-span-2">No courses yet at this level.</p>}
            </div>
        </div>
    );
}