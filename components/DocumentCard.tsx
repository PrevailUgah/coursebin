import React from "react";

const typeLabels: Record<string, string> = {
    "past-question": "Past Question",
    "notes": "Notes",
    "study-guide": "Study Guide",
};

const typeColors: Record<string, string> = {
    "past-question": "bg-amber-100 text-amber-800",
    "notes": "bg-blue-100 text-blue-800",
    "study-guide": "bg-emerald-100 text-emerald-800",
};

type DocumentProps = {
    doc: {
        id: string;
        title?: string;
        type: string;
        courses?: { code?: string };
        [key: string]: unknown;
    };
};

export default function DocumentCard({ doc }: DocumentProps) {
    // Fallback styling and labels for unknown or missing types
    const badgeColor = typeColors[doc.type] || "bg-slate-100 text-slate-800";
    const badgeLabel = typeLabels[doc.type] || doc.type || "Document";

    return (
        <div className="flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div>
                {/* Fixed textxs -> text-xs */}
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${badgeColor}`}>
                    {badgeLabel}
                </span>
                <h3 className="font-semibold text-slate-900 mt-2 line-clamp-2">
                    {doc.title || "Untitled Document"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {doc.courses?.code}
                </p>
            </div>

            <a
                href={`/api/download/${doc.id}`}
                className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
                View document →
            </a>
        </div>
    );
}