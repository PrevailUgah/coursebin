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

export default function DocumentCard({ doc }: { doc: any }) {
    return (
        <div className="border border-border rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
            <span className={`inline-block textxs font-medium px-2 py-1 rounded-full ${typeColors[doc.type]}`}>
                {typeLabels[doc.type]}
            </span>
            <h3 className="font-semibold text-ink mt-2">{doc.title}</h3>
            <p className="text-sm text-muted">{doc.courses?.code}</p>
            <a href={`/api/download/${doc.id}`} className="inline-block mt-3 text-sm font-medium text-primary">
                View document →
            </a>
        </div>
    );
}
