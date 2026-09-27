import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminCourseForm from "@/components/AdminCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/");

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) redirect("/");

    return <AdminCourseForm />;
}