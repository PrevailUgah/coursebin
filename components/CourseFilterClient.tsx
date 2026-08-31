"use client";
import { useRouter, usePathname } from "next/navigation";

const options = [
    { value: null, label: "All" },
    { value: "past-question", label: "Past Questions" },
    { value: "notes", label: "Notes" },
    { value: "study-guide", label: "Study Guides" },
];

export default function CourseFilterClient({ selected, onChange }: { selected: string | null; onChange: (value: string | null) => void }) {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className="flex gap-2 flex-wrap mt-4">
            {options.map((opt) => (
                <button
                    key={opt.label}
                    onClick={() => { onChange(opt.value); router.push(opt.value ? `${pathname}?type=${opt.value}` : pathname); }}
                    className={`text-sm px-3 py-1.5 rounded-full border ${selected === opt.value ? "bg primary text-white border-primary" : "border-border"
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}