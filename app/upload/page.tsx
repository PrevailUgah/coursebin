import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UploadForm from "@/components/UploadForm";

export default async function UploadPage() {
    const supabase = await createClient();
    const { data: { user } } = await
        supabase.auth.getUser();
    if (!user) redirect("/");
    return <UploadForm userId={user.id} />;
}
