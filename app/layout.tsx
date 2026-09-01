import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BookOpen } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseBin",
  description: "Past questions, notes, and study guides — by course code.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors">
              <BookOpen className="w-6 h-6" />
              <span>CourseBin</span>
            </a>
            <AuthButton />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
