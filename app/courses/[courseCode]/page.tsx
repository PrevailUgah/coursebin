import { getCourses } from "@/lib/documents";

export default async function Home() {
    const courses = await getCourses();

    return (
        <div className="max-w-3xl mx-auto p-6 pt-16">
            <h1 className="text-3xl font-bold text-ink text-center mb-2">CourseBin</h1>
            <p className="text-muted text-center mb-8">Past questions, notes, and study guides — by course code.</p>

            <form action="/courses" method="get" className="flex gap-2">
                <input name="code"
                    placeholder="Search by course code…"
                    className="flex-1 border border-border rounded-full px-4 py-2"
                />
                <button className="bg-primary text white px-5 py-2 rounded-full">Search</button>
            </form>

            <h2 className="text-sm font-semibold text-muted uppercase mt-10 mb3">Courses</h2>
            <div className="flex gap-2 flex-wrap">
                {courses.map((c: any) => (
                    <a key={c.id} href={`/courses/${c.code}`} className="border border-border rounded-lg px-3 py-2 text-sm hover:border-primary">
                        {c.code} — {c.title}
                    </a>
                ))}
            </div>
        </div>
    );
}
