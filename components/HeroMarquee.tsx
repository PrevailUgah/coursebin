const message =
    "Hello 👋 Welcome to CourseBin — get updates and materials for your courses.";

export default function HeroMarquee() {
    return (
        <div className="hero-marquee bg-primary/8 border border-primary/15 rounded-2xl mb-6">
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
