import { getCourses } from "@/lib/documents";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
    const courses = await getCourses();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <h1 className="text-2xl font-bold text-ink mb-6">Browse Courses</h1>
            <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((c: any) => (
                    <a
                        key={c.id}
                        href={`/courses/${c.code}`}
                        className="border border-border rounded-xl p-4 bg-white hover:border-primary transition-colors"
                    >
                        <p className="font-bold text-ink">{c.code}</p>
                        <p className="text-sm text-muted">{c.title}</p>
                        <p className="text-xs text-muted mt-1">{c.department}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}