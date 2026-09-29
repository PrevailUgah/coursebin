import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import { getFacultiesWithDepartments } from "@/lib/academic";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let faculties: any[] = [];
  try {
    faculties = await getFacultiesWithDepartments();
  } catch {
    faculties = [];
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
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
      <body className="min-h-full">
        <AppShell faculties={faculties}>{children}</AppShell>
      </body>
    </html>
  );
}