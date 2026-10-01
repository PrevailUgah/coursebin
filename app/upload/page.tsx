"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle } from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  level?: string;
  semester?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [role, setRole] = useState<string>("member");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("note");
  const [file, setFile] = useState<File | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses/upload-options")
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
          setRole(data.role);
          if (data.courses.length > 0) {
            setSelectedCourseId(data.courses[0].id);
          }
        }
      })
      .catch(() => setError("Failed to load available courses."))
      .finally(() => setLoadingCourses(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourseId) return setError("Please select a valid course.");
    if (!file) return setError("Please select a file to upload.");

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("courseId", selectedCourseId);
    formData.append("title", title);
    formData.append("type", docType);
    formData.append("file", file);

    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to upload document.");
      setSubmitting(false);
      return;
    }

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    router.push(`/courses/${selectedCourse?.code ?? ""}`);
  }

  const inputClass =
    "w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-2">Upload Course Material</h1>
      <p className="text-sm text-muted mb-6">
        {role === "member"
          ? "As a member, you can upload materials for your enrolled courses."
          : "Admin access: Select any course to upload materials."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-sm"
      >
        <div>
          <label className="text-sm font-medium text-ink">Select Course</label>
          {loadingCourses ? (
            <p className="text-xs text-muted mt-2">Loading your available courses…</p>
          ) : courses.length === 0 ? (
            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                You are not enrolled in any courses yet. Enroll in courses first to upload materials.
              </span>
            </div>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className={inputClass}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Material Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Week 3 Lecture Notes"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className={inputClass}
          >
            <option value="note">Lecture Note</option>
            <option value="past_question">Past Question</option>
            <option value="textbook">Textbook / Reference</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="w-full mt-1 text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting || courses.length === 0}
          className="w-full bg-primary text-white font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4 hover:bg-primary/90 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {submitting ? "Uploading…" : "Upload Material"}
        </button>
      </form>
    </div>
  );
}