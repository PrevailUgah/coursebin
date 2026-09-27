import { getDepartment, getCoursesFor } from "@/lib/academic";
import { semesterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BrowseCoursesPage({
    params,
}: { params: Promise<{ facultyId: string; departmentId: string; level: string; semester: string }> }) {
    const { facultyId, departmentId, level, semester } = await params;
    const levelNum = Number(level);
    const semesterNum = Number(semester);
    const [department, courses] = await Promise.all([
        getDepartment(departmentId),
        getCoursesFor(departmentId, levelNum, semesterNum),
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <a href={`/browse/${facultyId}/${departmentId}/${levelNum}`} className="text-sm text-primary">← {levelNum} Level</a>
            <h1 className="text-2xl font-bold text-ink mt-2 mb-6">{department?.name} — {semesterLabel(semesterNum)}</h1>
            <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((c: any) => (
                    <a
                        key={c.id}
                        href={`/browse/${facultyId}/${departmentId}/${levelNum}/${semesterNum}/${c.code}`}
                        className="border border-border rounded-xl p-4 bg-card hover:border-primary transition-colors"
                    >
                        <p className="font-bold text-ink">{c.code}</p>
                        <p className="text-sm text-muted">{c.title}</p>
                        <p className="text-xs text-muted mt-1">{c.units} Units</p>
                    </a>
                ))}
                {courses.length === 0 && <p className="text-muted text-sm col-span-2">No courses yet.</p>}
            </div>
        </div >
    );
}