import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: attachment } = await supabase
    .from("course_update_attachments")
    .select("file_path")
    .eq("id", id)
    .single();

  if (!attachment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase.storage.from("course-updates").createSignedUrl(attachment.file_path, 60);
  if (error) return NextResponse.json({ error: "File no longer available" }, { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}