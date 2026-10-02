"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CourseCombobox from "@/components/CourseCombobox";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];
const MAX_SIZE_MB = 10;

export default function UploadForm({
  userId,
  initialCourseCode = "",
}: {
  userId: string;
  initialCourseCode?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [courseId, setCourseId] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("notes");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full border border-border rounded-lg px-3 py-2 mt-1 bg-card text-ink";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return setError("Choose a course from the list.");
    if (!file) return setError("Choose a file.");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return setError(
        "Only PDF, Word, PowerPoint, Excel, TXT, JPG, or PNG files allowed."
      );
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return setError(`File must be under ${MAX_SIZE_MB}MB.`);
    }

    setSubmitting(true);
    setError(null);

    const filePath = `${userId}/${courseId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadErr) {
      setError("Upload failed.");
      setSubmitting(false);
      return;
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("documents")
      .insert({
        course_id: courseId,
        title,
        type,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userId,
      })
      .select("id")
      .single();

    if (insertErr) {
      await supabase.storage.from("documents").remove([filePath]);
      const message = insertErr.message.includes("row-level security")
        ? "You can only upload materials for courses you're enrolled in."
        : "Something went wrong saving the document.";
      setError(message);
      setSubmitting(false);
      return;
    }

    // Notify enrolled users (in-app + real push notification)
    try {
      await fetch("/api/notify/material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title,
          documentId: inserted?.id,
          courseCode: courseCode.toUpperCase(),
        }),
      });
    } catch (err) {
      console.error("Failed to send material notification:", err);
      // We don't block the user if notification fails
    }

    router.push(`/courses/${courseCode.toUpperCase()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-4 sm:mx-auto my-6 md:my-10 p-5 sm:p-6 space-y-4 bg-card border border-border rounded-2xl shadow-sm"
    >
      <h1 className="text-2xl font-bold text-ink">Upload a resource</h1>

      <CourseCombobox
        value={courseId}
        initialCode={initialCourseCode}
        onChange={(id, code) => {
          setCourseId(id);
          setCourseCode(code);
        }}
      />

      <div>
        <label className="text-sm font-medium text-ink">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="2023 Past Questions"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="past-question">Past Question</option>
          <option value="notes">Notes</option>
          <option value="study-guide">Study Guide</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">File</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx,.xlsx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="w-full text-sm mt-1 text-ink"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white font-medium py-2 rounded-lg disabled:opacity-50"
      >
        {submitting ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}