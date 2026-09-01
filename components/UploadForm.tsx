"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

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

export default function UploadForm({ userId }: { userId: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [courseCode, setCourseCode] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("notes");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) {
            setError("Choose a file.");
            return;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Only PDF, Word, PowerPoint, Excel, TXT, JPG, or PNG files allowed.");
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File must be under ${MAX_SIZE_MB}MB.`);
            return;
        }

        setSubmitting(true);
        setError(null);

        const { data: course, error: courseErr } = await supabase
            .from("courses")
            .select("id")
            .eq("code", courseCode.toUpperCase())
            .single();

        if (courseErr || !course) {
            setError("Unknown course code.");
            setSubmitting(false);
            return;
        }

        const filePath = `${userId}/${courseCode.toUpperCase()}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("documents").upload(filePath, file);

        if (uploadErr) {
            setError("Upload failed.");
            setSubmitting(false);
            return;
        }

        const { error: insertErr } = await supabase.from("documents").insert({
            course_id: course.id,
            title,
            type,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: userId,
        });

        if (insertErr) {
            await supabase.storage.from("documents").remove([filePath]);
            setError("Something went wrong saving the document.");
            setSubmitting(false);
            return;
        }

        toast.success("Document uploaded successfully!");
        router.push(`/courses/${courseCode.toUpperCase()}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface to-surface-secondary py-12 px-4 sm:px-6">
            <div className="max-w-md mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-ink mb-2">Upload a Resource</h1>
                    <p className="text-muted">Share your study materials with the community</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-5">
                    {/* Course Code Field */}
                    <div>
                        <label htmlFor="courseCode" className="block text-sm font-semibold text-ink mb-2">Course Code</label>
                        <input
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            placeholder="e.g., CSC203"
                            required
                            className="input-base"
                        />
                    </div>

                    {/* Title Field */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-ink mb-2">Title</label>
                        <input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., 2024 Exam Questions"
                            required
                            className="input-base"
                        />
                    </div>

                    {/* Type Field */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-ink mb-2">Resource Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="input-base bg-white cursor-pointer"
                        >
                            <option value="past-question">Past Question</option>
                            <option value="notes">Lecture Notes</option>
                            <option value="study-guide">Study Guide</option>
                        </select>
                    </div>

                    {/* File Upload Field */}
                    <div>
                        <label htmlFor="file" className="block text-sm font-semibold text-ink mb-2">File</label>
                        <div className="relative">
                            <input
                                id="file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx,.xlsx,.txt"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] ?? null);
                                    setError(null);
                                }}
                                required
                                className="sr-only"
                            />
                            <label htmlFor="file" className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                                <Upload className="w-5 h-5 text-muted" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-ink">
                                        {file ? file.name : "Choose a file or drag and drop"}
                                    </p>
                                    <p className="text-xs text-muted mt-1">PDF, Word, PowerPoint, Excel, TXT, JPG, or PNG up to 10MB</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex gap-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-danger-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="button-primary w-full text-base font-semibold py-2.5 rounded-lg"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading…
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Document
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
