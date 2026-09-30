"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import Modal from "@/components/Modal";
import AdminCourseForm from "@/components/AdminCourseForm";
import AdminLinkCourseForm from "@/components/AdminLinkCourseForm";
import { semesterLabel } from "@/lib/utils";

export default function AdminCourseManager({ faculties, courses }: { faculties: any[]; courses: any[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "link" | null>(null);
  const [filter, setFilter] = useState("");

  const visible = courses.filter((c) => {
    const q = filter.toLowerCase();
    return !q || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
  });

  async function unlink(courseId: string, departmentId: string) {
    if (!confirm("Remove this course from this department? The course and its materials stay intact everywhere else it's linked.")) return;
    const res = await fetch("/api/admin/department-courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, departmentId }),
    });
    if (res.ok) router.refresh();
    else alert("Failed to unlink course.");
  }

  async function deleteCourse(courseId: string, code: string) {
    if (!confirm(`Permanently delete ${code}? This removes it from every department, along with all its materials and updates.`)) return;
    const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete course.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Courses</h1>
          <p className="text-sm text-muted">{courses.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModal("link")} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Link existing
          </button>
          <button onClick={() => setModal("create")} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> New course
          </button>
        </div>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter courses…"
        className="mb-3 w-full sm:w-72 border border-border rounded-lg px-3 py-2 text-sm bg-card text-ink"
      />

      <div className="space-y-3">
        {visible.map((c) => (
          <div key={c.id} className="border border-border rounded-xl p-4 bg-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {c.code} <span className="text-muted font-normal">— {c.title}</span>
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {c.level} Level · {semesterLabel(c.semester)} · {c.units} Units
                </p>
              </div>
              <button onClick={() => deleteCourse(c.id, c.code)} aria-label={`Delete ${c.code}`} className="text-red-600 hover:text-red-800 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {c.departments.length === 0 && <span className="text-xs text-muted">Not linked to any department.</span>}
              {c.departments.map((d: any) => (
                <span key={d.id} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {d.name}
                  <button onClick={() => unlink(c.id, d.id)} aria-label={`Unlink from ${d.name}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-muted text-sm">No courses found.</p>}
      </div>

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Create a course">
        <AdminCourseForm faculties={faculties} onSuccess={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "link"} onClose={() => setModal(null)} title="Link an existing course">
        <AdminLinkCourseForm faculties={faculties} onSuccess={() => setModal(null)} />
      </Modal>
    </div>
  );
}