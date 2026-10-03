"use client";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type Post = { id: string; type: "image" | "video"; title: string; subtitle: string | null; mediaUrl: string };

export default function TrendingCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (posts.length <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % posts.length), 4500);
    return () => clearInterval(t);
  }, [posts.length, paused]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, [index]);

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
    const i = Math.round(track.scrollLeft / (cardWidth + 12));
    setIndex(Math.max(0, Math.min(posts.length - 1, i)));
  }

  if (posts.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-muted uppercase mb-3">Trending</h2>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <div key={post.id} className="relative shrink-0 w-[85%] sm:w-72 aspect-[4/5] sm:aspect-[3/4] snap-start rounded-3xl overflow-hidden bg-black">
            {post.type === "video" ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay />
            ) : (
              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
            )}
            {post.type === "video" && (
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-10">
              <p className="text-white font-bold text-lg leading-tight">{post.title}</p>
              {post.subtitle && <p className="text-white/80 text-sm mt-0.5">{post.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>

      {posts.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {posts.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}