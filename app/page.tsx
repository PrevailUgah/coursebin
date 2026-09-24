import { getPopularCourses, getRecentDocuments } from "@/lib/documents";
import { timeAgo } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import QuickActions from "@/components/QuickActions";
import HomeFooter from "@/components/HomeFooter";
import { Code2, LineChart, GitBranch, FileText } from "lucide-react";

function courseIcon(department: string) {
  if (department.toLowerCase().includes("computer")) return Code2;
  if (department.toLowerCase().includes("math")) return LineChart;
  return GitBranch;
}

export default async function Home() {
  const [popularCourses, recentDocs] = await Promise.all([
    getPopularCourses(3),
    getRecentDocuments(4),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 sm:pb-16">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6">
        <p className="text-sm text-primary font-medium mb-1">Hello 👋</p>
        <p className="text-ink font-semibold">
          Find past questions, notes, and study guides for your courses.
        </p>
      </div>

      <div id="search-bar" className="bg-white border border-border rounded-2xl shadow-sm p-2 flex gap-2 mb-8 scroll-mt-20">
        <SearchBar />
      </div>

      <h2 className="text-sm font-semibold text-muted uppercase mb-3">Quick Actions</h2>
      <QuickActions />

      <h2 className="text-lg font-bold text-ink mb-4">Popular Courses</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {popularCourses.map((c: any, i: number) => {
          const Icon = courseIcon(c.department);
          const highlighted = i === 1;
          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 ${highlighted ? "border-primary bg-primary/5" : "border-border bg-white"
                }`}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-ink">{c.code}</h3>
              <p className="text-sm text-muted mb-2">{c.title}</p>
              <p className="text-xs text-muted flex items-center gap-1 mb-4">
                <FileText className="w-3.5 h-3.5" /> {c.materialCount} materials
              </p>
              <a
                href={`/courses/${c.code}`}
                className={`block text-center text-sm font-medium py-2 rounded-lg ${highlighted ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
              >
                View
              </a>
            </div>
          );
        })}
      </div>

      <h2 className="text-lg font-bold text-ink mb-4">Recently Added</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {recentDocs.map((doc: any) => (
          <a
            key={doc.id}
            href={`/courses/${doc.courses?.code}`}
            className="border border-border rounded-xl p-4 bg-white flex gap-3 hover:border-primary transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted">{doc.courses?.code}</p>
              <p className="font-medium text-ink text-sm truncate">{doc.title}</p>
              <p className="text-xs text-muted mt-1">{timeAgo(doc.created_at)}</p>
            </div>
          </a>
        ))}
        {recentDocs.length === 0 && (
          <p className="text-muted text-sm col-span-2">No uploads yet.</p>
        )}
      </div>

      <HomeFooter />
    </div>
  );
}
