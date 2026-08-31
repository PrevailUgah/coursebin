"use client";

import { useState, useEffect } from "react";
import DocumentCard from "@/components/DocumentCard";
import CourseFilterClient from "@/components/CourseFilterClient";

type Document = {
    id: string;
    type: string;
    [key: string]: unknown;
};

export default function CoursePage({ params }: { params: { courseCode: string } }) {
    const [docs, setDocs] = useState<Document[]>([]);
    const [type, setType] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/documents?course=${params.courseCode}`)
            .then(r => r.json())
            .then(setDocs);
    }, [params.courseCode]);

    const filtered = type ? docs.filter(d => d.type === type) : docs;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{params.courseCode}</h1>
            <CourseFilterClient selected={type} onChange={setType} />
            <div className="grid gap-4 mt-4">
                {filtered.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
            </div>
        </div>
    );
}
