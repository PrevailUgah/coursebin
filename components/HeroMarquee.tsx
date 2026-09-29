const message =
    "Hello 👋 Welcome to CourseBin — find past questions, notes, and study guides for your courses.";

export default function HeroMarquee() {
    return (
        <div className="hero-marquee bg-primary/5 border border-primary/10 rounded-2xl mb-6">
            <p className="sr-only">{message}</p>
            <div className="hero-viewport" aria-hidden="true">
                <div className="hero-track">
                    <span className="hero-text">{message}</span>
                    <span className="hero-text">{message}</span>
                    <span className="hero-text">{message}</span>
                    <span className="hero-text">{message}</span>
                </div>
            </div>
        </div>
    );
}