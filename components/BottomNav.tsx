"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Upload, User, LogIn } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";

export default function BottomNav() {
  const pathname = usePathname();
  const { signedIn, isAdmin } = useAuth();

  const itemClass = (active: boolean) =>
    `flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${active ? "text-primary" : "text-muted"}`;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border flex justify-around items-center py-2 z-20">
      <Link href="/" className={itemClass(pathname === "/")}>
        <Home className="w-5 h-5" />
        Home
      </Link>
      <Link href="/browse" className={itemClass(pathname.startsWith("/browse"))}>
        <BookOpen className="w-5 h-5" />
        Browse
      </Link>
      {isAdmin && (
        <Link href="/upload" className={itemClass(pathname === "/upload")}>
          <Upload className="w-5 h-5" />
          Upload
        </Link>
      )}
      {signedIn ? (
        <Link href="/my-uploads" className={itemClass(pathname === "/my-uploads")}>
          <User className="w-5 h-5" />
          Account
        </Link>
      ) : (
        <button onClick={signInWithGoogle} className={itemClass(false)}>
          <LogIn className="w-5 h-5" />
          Sign in
        </button>
      )}
    </nav>
  );
}