import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/");

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) redirect("/");

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">
            <div className="flex gap-4 mb-6 border-b border-border pb-3">
                <a href="/admin/faculties" className="text-sm font-medium text-ink hover:text-primary">Faculties</a>
                <a href="/admin/courses" className="text-sm font-medium text-ink hover:text-primary">Courses</a>
            </div>
            {children}
        </div>
    );
}