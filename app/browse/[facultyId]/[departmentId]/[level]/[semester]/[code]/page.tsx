import { getDocumentsByCourseCode } from "@/lib/documents";
import { getCourseByCode } from "@/lib/academic";
import DocumentCard from "@/components/DocumentCard";
import CourseFilterClient from "@/components/CourseFilterClient";
import { semesterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
    params, searchParams,
}: {
    params: Promise<{ facultyId: string; departmentId: string; level: string; semester: string; code: string }>;
    searchParams: Promise<{ type?: string }>;
}) {
    const { facultyId, departmentId, level, semester, code } = await params;
    const { type } = await searchParams;
    const [course, docs] = await Promise.all([
        getCourseByCode(code),
        getDocumentsByCourseCode(code, type),
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <a href={`/browse/${facultyId}/${departmentId}/${level}/${semester}`} className="text-sm text-primary">
                ← {semesterLabel(Number(semester))}
            </a>
            <h1 className="text-2xl font-bold text-ink mt-2">{code.toUpperCase()}</h1>
            <p className="text-muted mb-2">{course?.title} · {course?.units} Units</p>
            <CourseFilterClient selected={type ?? null} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {docs.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 text-center py-12 text-muted">
                        <p>No resources yet for {code.toUpperCase()}.</p>
                        <a href="/upload" className="text-primary font-medium">Be the first to upload →</a>
                    </div>
                )}
                {docs.map((doc: any) => <DocumentCard key={doc.id} doc={doc} />)}
            </div>
        </div>
    );
}