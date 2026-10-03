"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-client";
import Modal from "@/components/Modal";
import TrendingForm from "@/components/TrendingForm";

export default function TrendingManager({ posts }: { posts: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  function startEdit(post: any) {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditSubtitle(post.subtitle ?? "");
  }

  async function saveEdit(id: string) {
    setBusyId(id);
    const { error } = await supabase.from("trending_posts").update({ title: editTitle, subtitle: editSubtitle || null }).eq("id", id);
    setBusyId(null);
    if (!error) { setEditingId(null); router.refresh(); } else alert("Failed to update post.");
  }

  async function handleDelete(post: any) {
    if (!confirm(`Delete "${post.title}" from Trending?`)) return;
    setBusyId(post.id);
    await supabase.storage.from("trending-media").remove([post.media_path]);
    const { error } = await supabase.from("trending_posts").delete().eq("id", post.id);
    setBusyId(null);
    if (!error) router.refresh(); else alert("Failed to delete post.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Trending</h1>
          <p className="text-sm text-muted">{posts.length} posts · homepage shows the latest 7</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-3 border border-border rounded-xl p-3 bg-card">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0">
              {post.type === "video" ? (
                <video src={post.mediaUrl} className="w-full h-full object-cover" muted />
              ) : (
                <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editingId === post.id ? (
                <div className="space-y-2">
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-ink" />
                  <input value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} className="w-full border border-border rounded px-2 py-1 text-sm bg-card text-ink" placeholder="Subtitle" />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(post.id)} disabled={busyId === post.id} className="text-xs inline-flex items-center gap-1 text-primary"><Check className="w-3.5 h-3.5" /> Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs inline-flex items-center gap-1 text-muted"><X className="w-3.5 h-3.5" /> Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-ink truncate">{post.title}</p>
                  <p className="text-xs text-muted truncate">{post.subtitle || "—"}</p>
                  <p className="text-xs text-muted mt-0.5">{post.type === "video" ? "Video" : "Image"}</p>
                </>
              )}
            </div>
            {editingId !== post.id && (
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => startEdit(post)} aria-label="Edit"><Pencil className="w-4 h-4 text-muted" /></button>
                <button onClick={() => handleDelete(post)} disabled={busyId === post.id} aria-label="Delete"><Trash2 className="w-4 h-4 text-red-600" /></button>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && <p className="text-muted text-sm">No trending posts yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Trending post">
        {userId && <TrendingForm userId={userId} onDone={() => setOpen(false)} />}
      </Modal>
    </div>
  );
}