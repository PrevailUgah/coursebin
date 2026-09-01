export default function NotFound() {
    return (
        <div className="max-w-md mx-auto p-6 text-center py-20">
            <h2 className="text-xl font-bold text-ink mb-2">Page not found</h2>
            <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
            <a href="/" className="text-primary font-medium">← Back to home</a>
        </div>
    );
}