"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Megaphone, CalendarClock, ClipboardList, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import Modal from "@/components/Modal";
import CourseUpdateForm from "@/components/CourseUpdateForm";

const typeMeta: Record<string, { label: string; icon: any; color: string }> = {
  announcement: { label: "Announcement", icon: Megaphone, color: "bg-blue-100 text-blue-800" },
  assignment: { label: "Assignment", icon: ClipboardList, color: "bg-amber-100 text-amber-800" },
  lecture: { label: "Lecture", icon: CalendarClock, color: "bg-emerald-100 text-emerald-800" },
  exam: { label: "Exam", icon: CalendarClock, color: "bg-red-100 text-red-800" },
};

function fileNameFromPath(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1].replace(/^[0-9a-f-]{36}-/, "");
}

export default function CourseUpdatesList({ courseId, updates }: { courseId: string; updates: any[] }) {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("Delete this update?")) return;
    const res = await fetch(`/api/course-updates/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete update.");
  }

  return (
    <div>
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Post update
          </button>
        </div>
      )}

      <div className="space-y-3">
        {updates.length === 0 && <p className="text-muted text-sm text-center py-12">No updates yet for this course.</p>}
        {updates.map((u: any) => {
          const meta = typeMeta[u.type] ?? typeMeta.announcement;
          const Icon = meta.icon;
          return (
            <div key={u.id} className="border border-border rounded-xl p-4 bg-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    <h3 className="font-semibold text-ink mt-1">{u.title}</h3>
                    {u.event_at && (
                      <p className="text-sm text-muted mt-0.5">
                        {new Date(u.event_at).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    )}
                    {u.body && <p className="text-sm text-ink mt-2 whitespace-pre-wrap">{u.body}</p>}
                    {u.course_update_attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {u.course_update_attachments.map((a: any) => (
                          <a key={a.id} href={`/api/course-updates/attachment/${a.id}`} className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                            <FileText className="w-3.5 h-3.5" /> {fileNameFromPath(a.file_path)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(u.id)} aria-label="Delete update" className="text-red-600 hover:text-red-800 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Post a course update">
        <CourseUpdateForm courseId={courseId} onDone={() => setOpen(false)} />
      </Modal>
    </div>
  );
}