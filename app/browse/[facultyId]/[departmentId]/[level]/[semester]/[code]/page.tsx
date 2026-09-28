import Link from "next/link";
import { getDocumentsByCourseCode } from "@/lib/documents";
import { getCourseByCode } from "@/lib/academic";
import DocumentCard from "@/components/DocumentCard";
import CourseFilterClient from "@/components/CourseFilterClient";
import UploadToCourseButton from "@/components/UploadToCourseButton";
import { semesterLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
    params,
    searchParams,
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

    const displayCode = course?.code ?? code.toUpperCase();
    const chip = "text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary";

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Link
                href={`/browse/${facultyId}/${departmentId}/${level}/${semester}`}
                className="md:hidden text-sm text-primary"
            >
                ← {semesterLabel(Number(semester))}
            </Link>

            <div className="bg-card border border-border rounded-2xl p-5 mt-2 md:mt-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-ink">{displayCode}</h1>
                    <p className="text-muted">{course?.title}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className={chip}>{level} Level</span>
                        <span className={chip}>{semesterLabel(Number(semester))}</span>
                        <span className={chip}>{course?.units} Units</span>
                        <span className={chip}>
                            {docs.length} {docs.length === 1 ? "resource" : "resources"}
                        </span>
                    </div>
                </div>
                <UploadToCourseButton code={displayCode} />
            </div>

            <CourseFilterClient selected={type ?? null} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                {docs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted">
                        <p>No resources yet for {displayCode}.</p>
                    </div>
                )}
                {docs.map((doc: any) => (
                    <DocumentCard key={doc.id} doc={doc} />
                ))}
            </div>
        </div>
    );
}