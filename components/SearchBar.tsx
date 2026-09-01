"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const [value, setValue] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const code = value.trim();
        if (code) router.push(`/courses/${code.toUpperCase()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by course code…"
                className="flex-1 min-w-0 border border-border rounded-full px-4 py-2"
            />
            <button
                type="submit"
                className="bg-primary text-white px-5 py-2 rounded-full shrink-0"
            >
                Search
            </button>
        </form>
    );
}