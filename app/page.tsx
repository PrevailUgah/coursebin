import Image from "next/image";
import Link from "next/link";
import { getPopularCourses, getRecentDocuments } from "@/lib/documents";
import { getFacultiesWithDepartments } from "@/lib/academic";
import { timeAgo } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import QuickActions from "@/components/QuickActions";
import HeroMarquee from "@/components/HeroMarquee";
import EdgeLight from "@/components/EdgeLight";
import { Code2, LineChart, GitBranch, FileText } from "lucide-react";

function courseIcon(departmentName: string) {
  if (departmentName.toLowerCase().includes("computer")) return Code2;
  if (departmentName.toLowerCase().includes("math")) return LineChart;
  return GitBranch;
}

export default async function Home() {
  const [popularCourses, recentDocs, faculties] = await Promise.all([
    getPopularCourses(6),
    getRecentDocuments(6),
    getFacultiesWithDepartments(),
  ]);

  return (
    <>
      <EdgeLight />
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
        <HeroMarquee />

        {/* Mobile only — desktop/tablet use the search in the top bar */}
        <div id="search-bar" className="md:hidden mb-6 scroll-mt-20">
          <SearchBar faculties={faculties} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 min-w-0">
            <section>
              <h2 className="text-sm font-semibold text-muted uppercase mb-3">Quick Actions</h2>
              <QuickActions />
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink mb-4">Popular Courses</h2>
              <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                {popularCourses.map((c: any) => {
                  const Icon = courseIcon(c.departments?.name ?? "");
                  return (
                    <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-ink">{c.code}</h3>
                      <p className="text-sm text-muted mb-2">{c.title}</p>
                      <p className="text-xs text-muted flex items-center gap-1 mb-4">
                        <FileText className="w-3.5 h-3.5" /> {c.materialCount} materials
                      </p>
                      <Link
                        href={`/courses/${c.code}`}
                        className="block text-center text-sm font-medium py-2 rounded-lg bg-primary/10 text-primary"
                      >
                        View
                      </Link>
                    </div>
                  );
                })}
                {popularCourses.length === 0 && (
                  <p className="text-muted text-sm col-span-full">No courses yet.</p>
                )}
              </div>
            </section>
          </div>

          <aside className="min-w-0">
            <div className="bg-card border border-border rounded-2xl p-4 lg:sticky lg:top-20">
              <h2 className="text-lg font-bold text-ink mb-3">Recently Added</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {recentDocs.map((doc: any) => (
                  <Link
                    key={doc.id}
                    href={`/courses/${doc.courses?.code}`}
                    className="border border-border rounded-xl p-3 flex gap-3 hover:border-primary transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{doc.courses?.code}</p>
                      <p className="font-medium text-ink text-sm truncate">{doc.title}</p>
                      <p className="text-xs text-muted mt-0.5">{timeAgo(doc.created_at)}</p>
                    </div>
                  </Link>
                ))}
                {recentDocs.length === 0 && (
                  <p className="text-muted text-sm sm:col-span-2 lg:col-span-1">No uploads yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Footer Credit */}
        <div className="mt-16 mb-4 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted text-center sm:text-left">
            Made for{" "}
            <span className="text-red-500">growth🚀</span>{" "}
            by{" "}
            <span className="font-semibold text-ink">Dev Prevail Ugah</span>
          </p>

          <div className="flex flex-col items-center gap-2">
            <Image
              src="/mugina-logo.jpg"
              alt="MU GINA Community Logo"
              width={72}
              height={72}
              className="rounded-xl shadow-sm"
            />
            <p className="text-xs font-semibold text-muted tracking-wide uppercase">
              MU GINA Community
            </p>
          </div>
        </div>
      </div>
    </>
  );
}