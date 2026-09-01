"use client";

export default function Error({
    error, reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="max-w-md mx-auto p-6 text-center py-20">
            <h2 className="text-xl font-bold text-ink mb-2">Something went wrong</h2>
            <p className="text-muted mb-4">We couldn't load this course's resources.</p>
            <button
                onClick={reset}
                className="bg-primary text-white px-4 py-2 rounded-lg"
            >
                Try again
            </button>
        </div>
    );
}