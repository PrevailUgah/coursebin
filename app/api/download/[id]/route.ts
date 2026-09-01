import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch document record
    const { data: doc } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", id)
        .single();

    if (!doc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2. Generate signed download URL (valid for 60 seconds)
    const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.file_path, 60);

    if (error || !data?.signedUrl) {
        return NextResponse.json(
            { error: "Could not generate link" },
            { status: 500 }
        );
    }

    // 3. Redirect user to the file
    return NextResponse.redirect(data.signedUrl);
}