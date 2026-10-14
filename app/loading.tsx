"use client";
export default function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            {/* Book */}
            <div className="relative w-16 h-12">
                {/* Left page */}
                <div className="absolute left-0 top-0 w-8 h-12 bg-primary/20 border border-primary/40 rounded-l-md origin-right animate-[book-left_1.4s_ease-in-out_infinite]" />
                {/* Right page */}
                <div className="absolute right-0 top-0 w-8 h-12 bg-primary/30 border border-primary/40 rounded-r-md origin-left animate-[book-right_1.4s_ease-in-out_infinite]" />
                {/* Spine */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-12 bg-primary/60 rounded-full" />
            </div>

            <p className="text-sm text-muted">Loading Coursebin...</p>

            <style jsx>{`
        @keyframes book-left {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-25deg); }
        }
        @keyframes book-right {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(25deg); }
        }
      `}</style>
        </div>
    );
}