"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, BookOpen, Upload, FileStack, Shield, ListChecks, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; requiresAuth: boolean; active: boolean };

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean | null; onToggle: () => void }) {
  const pathname = usePathname();
  const { signedIn, isAdmin, isSeniorAdmin } = useAuth();

  const widthClass = collapsed === null ? "w-16 lg:w-60" : collapsed ? "w-16" : "w-60";
  const labelClass = collapsed === null ? "hidden lg:inline" : collapsed ? "hidden" : "inline";
  const justifyClass = collapsed === null ? "justify-center lg:justify-start" : collapsed ? "justify-center" : "justify-start";
  const showLeft = collapsed === null ? "hidden lg:block" : collapsed ? "hidden" : "block";
  const showRight = collapsed === null ? "block lg:hidden" : collapsed ? "block" : "hidden";

  const items: NavItem[] = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, requiresAuth: false, active: pathname === "/" },
    { href: "/browse", label: "Browse", icon: BookOpen, requiresAuth: false, active: pathname.startsWith("/browse") },
    { href: "/enrolled-courses", label: "My Courses", icon: ListChecks, requiresAuth: true, active: pathname.startsWith("/enrolled-courses") },
  ];
  if (isAdmin) {
    items.push({ href: "/upload", label: "Upload", icon: Upload, requiresAuth: true, active: pathname.startsWith("/upload") });
  }
  items.push({ href: "/my-uploads", label: "My Uploads", icon: FileStack, requiresAuth: true, active: pathname.startsWith("/my-uploads") });
  if (isSeniorAdmin) {
    items.push({ href: "/admin/faculties", label: "Admin", icon: Shield, requiresAuth: false, active: pathname.startsWith("/admin") });
  }

  const itemClass = (active: boolean) =>
    `flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${justifyClass} ${active ? "bg-primary/10 text-primary" : "text-muted hover:text-ink hover:bg-primary/5"}`;

  return (
    <aside className={`hidden md:flex flex-col sticky top-0 self-start h-screen shrink-0 z-20 bg-card border-r border-border transition-[width] duration-200 ${widthClass}`}>
      <Link href="/" className="h-14 flex items-center gap-3 px-4 border-b border-border shrink-0">
        <GraduationCap className="w-6 h-6 text-primary shrink-0" />
        <span className={`${labelClass} font-bold text-ink`}>CourseBin</span>
      </Link>

      <nav aria-label="Primary" className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map(({ href, label, icon: Icon, requiresAuth, active }) =>
          requiresAuth && !signedIn ? (
            <button key={href} onClick={signInWithGoogle} title={label} className={itemClass(false)}>
              <Icon className="w-5 h-5 shrink-0" /><span className={labelClass}>{label}</span>
            </button>
          ) : (
            <Link key={href} href={href} title={label} className={itemClass(active)}>
              <Icon className="w-5 h-5 shrink-0" /><span className={labelClass}>{label}</span>
            </Link>
          )
        )}
      </nav>

      <div className="p-2 border-t border-border">
        <button onClick={onToggle} title="Collapse or expand sidebar" className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted hover:text-ink hover:bg-primary/5 ${justifyClass}`}>
          <ChevronsLeft className={`w-5 h-5 shrink-0 ${showLeft}`} />
          <ChevronsRight className={`w-5 h-5 shrink-0 ${showRight}`} />
          <span className={labelClass}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}