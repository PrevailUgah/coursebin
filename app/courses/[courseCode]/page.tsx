import { getDocumentsByCourseCode } from "@/lib/documents";
import DocumentCard from "@/components/DocumentCard";
import CourseFilterClient from "@/components/CourseFilterClient";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params, searchParams,
}: {
  params: Promise<{ courseCode: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { courseCode } = await params;
  const { type } = await searchParams;
  const docs = await getDocumentsByCourseCode(courseCode, type);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ink">{courseCode.toUpperCase()}</h1>
      <CourseFilterClient selected={type ?? null} />
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {docs.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted">
            <p>No resources yet for {courseCode.toUpperCase()}.</p>
            <a href="/upload" className="text-primary font-medium">Be the first to upload →</a>
          </div>
        )}
        {docs.map((doc: any) => <DocumentCard key={doc.id} doc={doc} />)}
      </div>
    </div>
  );
}