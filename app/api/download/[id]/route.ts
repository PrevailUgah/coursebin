import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function extractOriginalFilename(path: string) {
  const last = path.split("/").pop() ?? "file";
  const match = last.match(/^[0-9a-f-]{36}-(.+)$/i);
  return match ? match[1] : last;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") === "download" ? "download" : "view";

  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filename = extractOriginalFilename(doc.file_path);

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60, mode === "download" ? { download: filename } : undefined);

  if (error) {
    return NextResponse.json({ error: "File no longer available" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}