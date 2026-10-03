import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "senior_admin") redirect("/");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex gap-4 mb-6 border-b border-border pb-3 overflow-x-auto">
        <Link href="/admin/faculties" className="text-sm font-medium text-ink hover:text-primary whitespace-nowrap">Faculties</Link>
        <Link href="/admin/courses" className="text-sm font-medium text-ink hover:text-primary whitespace-nowrap">Courses</Link>
        <Link href="/admin/users" className="text-sm font-medium text-ink hover:text-primary whitespace-nowrap">Users</Link>
        <Link href="/admin/trending" className="text-sm font-medium text-ink hover:text-primary whitespace-nowrap">Trending</Link>
      </div>
      {children}
    </div>
  );
}