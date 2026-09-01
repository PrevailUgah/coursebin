import { getCourses } from "@/lib/documents";
import SearchBar from "@/components/SearchBar";

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="max-w-3xl mx-auto p-6 pt-16">
      <h1 className="text-3xl font-bold text-ink text-center mb-2">CourseBin</h1>
      <p className="text-muted text-center mb-8">Past questions, notes, and study guides — by course code.</p>

      <SearchBar />

      <h2 className="text-sm font-semibold text-muted uppercase mt-10 mb-3">Courses</h2>
      <div className="flex gap-2 flex-wrap">
        {courses.map((c: any) => (
          <a
            key={c.id}
            href={`/courses/${c.code}`}
            className="border border-border rounded-lg px-3 py-2 text-sm hover:border-primary"
          >
            {c.code} — {c.title}
          </a>
        ))}
      </div>
    </div >
  );
}
