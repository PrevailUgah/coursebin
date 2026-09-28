import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getMyDocuments } from "@/lib/documents";
import DocumentCard from "@/components/DocumentCard";

export const dynamic = "force-dynamic";

export default async function MyUploadsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/");

    const docs = await getMyDocuments(user.id);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-ink mb-6">My Uploads</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {docs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted">
                        <p>You haven't uploaded anything yet.</p>
                        <a href="/upload" className="text-primary font-medium">Upload your first resource →</a>
                    </div>
                )}
                {docs.map((doc: any) => (
                    <DocumentCard key={doc.id} doc={doc} />
                ))}
            </div>
        </div>
    );
}