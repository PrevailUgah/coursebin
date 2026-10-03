import { createClient } from "@/lib/supabase/server";

export async function getTrendingPosts(limit = 7) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trending_posts")
    .select("id, type, title, subtitle, media_path, media_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    mediaUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/trending-media/${p.media_path}`,
  }));
}