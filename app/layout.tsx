import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthButton from "@/components/AuthButton";
import BottomNav from "@/components/BottomNav";
// import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
          <a href="/" className="font-bold text-ink shrink-0">CourseBin</a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthButton />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        {/* <Footer /> */}
        <BottomNav />
      </body>
    </html>
  );
}