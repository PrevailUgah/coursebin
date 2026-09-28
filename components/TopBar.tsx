"use client";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import NotificationsBell from "@/components/NotificationsBell";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";

export default function TopBar({ faculties }: { faculties: any[] }) {
    return (
        <header className="sticky top-0 z-30 h-14 bg-card border-b border-border flex items-center gap-3 px-4 md:px-6">
            <Link href="/" className="md:hidden flex items-center gap-2 font-bold text-ink shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
                CourseBin
            </Link>

            <div className="hidden md:block flex-1 min-w-0">
                <Breadcrumbs faculties={faculties} />
            </div>

            <div className="hidden md:block w-56 lg:w-80 shrink-0">
                <SearchBar faculties={faculties} compact />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto md:ml-0">
                <NotificationsBell />
                <ThemeToggle />
                <AuthButton />
            </div>
        </header>
    );
}