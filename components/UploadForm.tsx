
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
const MAX_SIZE_MB = 10;
export default function UploadForm({ userId }: { userId: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [courseCode, setCourseCode] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("notes");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string
        | null>(null);
    const [submitting, setSubmitting] =
        useState(false);
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return setError("Choose a file.");
        if (!ALLOWED_TYPES.includes(file.type))
            return setError("Only PDF, JPG, PNG allowed.");
        if (file.size > MAX_SIZE_MB * 1024 *
            1024) return setError(`File must be under 
${MAX_SIZE_MB}MB.`);
        setSubmitting(true);
        setError(null);
        const { data: course, error: courseErr
        } = await supabase
            .from("courses").select("id").eq("code",
                courseCode.toUpperCase()).single();
        if (courseErr || !course) {
            setError("Unknown course code.");
            setSubmitting(false); return;
        }
        const filePath =
            `${userId}/${courseCode.toUpperCase()}/${crypto.randomUUID()
            } -${file.name} `;
        const { error: uploadErr } = await
            supabase.storage.from("documents").upload(filePath, file);
        if (uploadErr) { setError("Upload failed."); setSubmitting(false); return; }
        const { error: insertErr } = await
            supabase.from("documents").insert({
                course_id: course.id, title, type,
                file_path: filePath, file_size:
                    file.size, mime_type: file.type,
                uploaded_by: userId,
            });
        if (insertErr) {
            await
                supabase.storage.from("documents").remove([
                    filePath]); // no orphaned files
            setError("Something went wrong saving the document.");
            setSubmitting(false);
            return;
        }
        router.push(`/ courses / ${courseCode.toUpperCase()}`);
    }
    return (
        <form onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold text-ink">Upload a resource</h1>
            <input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="CSC203" required className="wfull border rounded-lg px-3 py-2" />
            <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Title" required className="wfull border rounded-lg px-3 py-2" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="past-question">Past Question</option>
                <option value="notes">Notes</option>
                <option value="study-guide">Study Guide</option>
            </select>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />{error && <p className="text-sm textred-600">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50">
                {submitting ? "Uploading…" : "Upload"}
            </button>
        </form>
    );
}
