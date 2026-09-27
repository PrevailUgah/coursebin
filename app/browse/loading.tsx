export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <div className="h-6 w-40 bg-border rounded animate-pulse mb-4" />
            <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-border rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}