export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="h-8 w-32 bg-border rounded animate-pulse mb-4" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-border rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}