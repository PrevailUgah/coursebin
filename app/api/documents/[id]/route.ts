import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: doc } = await supabase
        .from("documents")
        .select("file_path, uploaded_by")
        .eq("id", id)
        .single();

    if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (doc.uploaded_by !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.storage.from("documents").remove([doc.file_path]);
    await supabase.from("documents").delete().eq("id", id);

    return NextResponse.json({ success: true });
}