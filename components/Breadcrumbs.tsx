"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href: string };

function safeDecode(s: string) {
    try {
        return decodeURIComponent(s);
    } catch {
        return s;
    }
}

function titleCase(s: string) {
    return s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function Breadcrumbs({ faculties }: { faculties: any[] }) {
    const pathname = usePathname();
    const seg = pathname.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ label: "Dashboard", href: "/" }];

    if (seg[0] === "browse") {
        crumbs.push({ label: "Browse", href: "/browse" });
        const faculty = faculties.find((f) => f.id === seg[1]);
        if (seg[1]) crumbs.push({ label: faculty?.name ?? "Faculty", href: `/browse/${seg[1]}` });
        if (seg[2]) {
            const dept = faculty?.departments?.find((d: any) => d.id === seg[2]);
            crumbs.push({ label: dept?.name ?? "Department", href: `/browse/${seg[1]}/${seg[2]}` });
        }
        if (seg[3]) crumbs.push({ label: `${seg[3]} Level`, href: `/browse/${seg[1]}/${seg[2]}/${seg[3]}` });
        if (seg[4]) {
            crumbs.push({
                label: seg[4] === "1" ? "1st Semester" : "2nd Semester",
                href: `/browse/${seg[1]}/${seg[2]}/${seg[3]}/${seg[4]}`,
            });
        }
        if (seg[5]) crumbs.push({ label: safeDecode(seg[5]).toUpperCase(), href: pathname });
    } else if (seg[0] === "admin") {
        crumbs.push({ label: "Admin", href: "/admin/faculties" });
        if (seg[1] === "faculties") {
            crumbs.push({ label: "Faculties", href: "/admin/faculties" });
            if (seg[2]) {
                const f = faculties.find((x) => x.id === seg[2]);
                crumbs.push({ label: f?.name ?? "Faculty", href: `/admin/faculties/${seg[2]}/departments` });
            }
            if (seg[3] === "departments") crumbs.push({ label: "Departments", href: pathname });
        } else if (seg[1] === "courses") {
            crumbs.push({ label: "Courses", href: "/admin/courses" });
        }
    } else if (seg[0]) {
        crumbs.push({ label: titleCase(seg[0]), href: `/${seg[0]}` });
    }

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm min-w-0 overflow-hidden">
            {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                const middle = i > 0 && !last;
                return (
                    <span
                        key={`${c.href}-${i}`}
                        className={`items-center min-w-0 ${middle ? "hidden xl:flex" : "flex"}`}
                    >
                        {i > 0 && <ChevronRight className="w-4 h-4 mx-1 text-muted shrink-0" />}
                        {last && crumbs.length > 2 && (
                            <span className="xl:hidden flex items-center text-muted">
                                …<ChevronRight className="w-4 h-4 mx-1 shrink-0" />
                            </span>
                        )}
                        {last ? (
                            <span className="font-semibold text-ink truncate max-w-[14rem]">{c.label}</span>
                        ) : (
                            <Link href={c.href} className="text-muted hover:text-ink truncate max-w-[10rem]">
                                {c.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}