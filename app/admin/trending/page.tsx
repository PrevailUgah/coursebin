import { getTrendingPosts } from "@/lib/trending";
import TrendingManager from "@/components/TrendingManager";

export const dynamic = "force-dynamic";

export default async function AdminTrendingPage() {
  const posts = await getTrendingPosts(50);
  return <TrendingManager posts={posts} />;
}