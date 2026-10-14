import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-border mt-16 pb-24 sm:pb-8">
            <div className="mt-16 mb-4 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-sm text-muted text-center sm:text-left">
                    Made for <span className="text-red-500">growth🚀</span> by <span className="font-semibold text-ink">Dev Prevail Ugah</span>
                </p>
                <div className="flex flex-col items-center gap-2">
                    <Image src="/mugina-logo.jpg" alt="MU GINA Community Logo" width={72} height={72} className="rounded-xl shadow-sm" />
                    <p className="text-xs font-semibold text-muted tracking-wide uppercase">MU GINA Community</p>
                </div>
            </div>
        </footer>
    );
}
