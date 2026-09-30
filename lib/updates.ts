import { createClient } from "@/lib/supabase/server";

export async function getCourseUpdates(courseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_updates")
    .select("*, course_update_attachments(id, file_path, mime_type)")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}