"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, Search, FileStack, Megaphone, Shield } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/auth-client";
import Modal from "@/components/Modal";
import NewsForm from "@/components/NewsForm";
import MyCoursesQuickAction from "@/components/MyCoursesQuickAction";

export default function QuickActions() {
  const { signedIn, isSeniorAdmin } = useAuth();
  const [newsOpen, setNewsOpen] = useState(false);
  const tileClass = "bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary transition-colors w-full";
  const iconWrap = "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center";

  function openSearch() {
    window.dispatchEvent(new Event("coursebin:focus-search"));
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/browse" className={tileClass}>
          <div className={iconWrap}><BookOpen className="w-5 h-5 text-primary" /></div>
          <span className="text-sm font-medium text-ink">Browse Courses</span>
        </Link>

        {signedIn ? (
          <Link href="/upload" className={tileClass}>
            <div className={iconWrap}><Upload className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">Upload</span>
          </Link>
        ) : (
          <button onClick={signInWithGoogle} className={tileClass}>
            <div className={iconWrap}><Upload className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">Upload</span>
            <span className="text-[11px] text-muted -mt-1">Sign in required</span>
          </button>
        )}

        <button onClick={openSearch} className={tileClass}>
          <div className={iconWrap}><Search className="w-5 h-5 text-primary" /></div>
          <span className="text-sm font-medium text-ink">Search</span>
        </button>

        <MyCoursesQuickAction />

        {signedIn ? (
          <Link href="/my-uploads" className={tileClass}>
            <div className={iconWrap}><FileStack className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">My Uploads</span>
          </Link>
        ) : (
          <button onClick={signInWithGoogle} className={tileClass}>
            <div className={iconWrap}><FileStack className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">My Uploads</span>
            <span className="text-[11px] text-muted -mt-1">Sign in required</span>
          </button>
        )}

        {isSeniorAdmin && (
          <Link href="/admin/faculties" className={`${tileClass} md:hidden`}>
            <div className={iconWrap}><Shield className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">Admin</span>
          </Link>
        )}

        {isSeniorAdmin && (
          <button onClick={() => setNewsOpen(true)} className={tileClass}>
            <div className={iconWrap}><Megaphone className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">News Update</span>
          </button>
        )}
      </div>

      <Modal open={newsOpen} onClose={() => setNewsOpen(false)} title="Broadcast a news update">
        <NewsForm onDone={() => setNewsOpen(false)} />
      </Modal>
    </>
  );
}