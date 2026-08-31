"use client";

import { use, useState, useEffect } from "react";
import DocumentCard from "@/components/DocumentCard";
import CourseFilterClient from "@/components/CourseFilterClient";

type Document = {
    id: string;
    type: string;
    title?: string;
    courses?: { code?: string };
    [key: string]: unknown;
};

export default function CoursePage({ params }: { params: Promise<{ courseCode: string }> }) {
    const { courseCode } = use(params);
    const [docs, setDocs] = useState<Document[]>([]);
    const [type, setType] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/documents?course=${courseCode}`)
            .then((r) => r.json())
            .then((data) => {
                setDocs(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Failed to load documents:", err))
            .finally(() => setLoading(false));
    }, [courseCode]);

    const filtered = type ? docs.filter((d) => d.type === type) : docs;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{courseCode}</h1>

            <CourseFilterClient selected={type} onChange={setType} />

            {loading ? (
                <div className="py-12 text-center text-slate-500">Loading documents...</div>
            ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl mt-4 border border-slate-200">
                    No documents found.
                </div>
            ) : (
                /* Responsive 1 to 3 column grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filtered.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                    ))}
                </div>
            )}
        </div>
    );
}