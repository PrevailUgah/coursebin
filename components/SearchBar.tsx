"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
    const router = useRouter();
    const [value, setValue] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const code = value.trim();
        if (code) router.push(`/courses/${code.toUpperCase()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search by course code…"
                    className="input-base pl-10 rounded-full border-border"
                />
            </div>
            <button
                type="submit"
                className="button-primary px-6 rounded-full shrink-0 font-semibold"
            >
                Search
            </button>
        </form>
    );
}
