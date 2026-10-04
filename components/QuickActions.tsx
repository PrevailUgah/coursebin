"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, Search, FileStack, Megaphone, Shield, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import Modal from "@/components/Modal";
import NewsForm from "@/components/NewsForm";
import MyCoursesQuickAction from "@/components/MyCoursesQuickAction";

export default function QuickActions() {
  const { isAdmin, isSeniorAdmin } = useAuth();
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

        {isAdmin && (
          <Link href="/upload" className={tileClass}>
            <div className={iconWrap}><Upload className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">Upload Material</span>
          </Link>
        )}

        <button onClick={openSearch} className={tileClass}>
          <div className={iconWrap}><Search className="w-5 h-5 text-primary" /></div>
          <span className="text-sm font-medium text-ink">Search</span>
        </button>

        <MyCoursesQuickAction />

        {isAdmin && (
          <Link href="/my-uploads" className={tileClass}>
            <div className={iconWrap}><FileStack className="w-5 h-5 text-primary" /></div>
            <span className="text-sm font-medium text-ink">My Uploads</span>
          </Link>
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

        <div
          aria-disabled="true"
          className="relative bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center w-full opacity-70 cursor-not-allowed select-none"
        >
          <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full rotate-6 shadow-sm whitespace-nowrap">
            Coming Soon
          </span>
          <div className={iconWrap}><MessageCircle className="w-5 h-5 text-primary" /></div>
          <span className="text-sm font-medium text-ink">Feedback</span>
        </div>
      </div>

      <Modal open={newsOpen} onClose={() => setNewsOpen(false)} title="Broadcast a news update">
        <NewsForm onDone={() => setNewsOpen(false)} />
      </Modal>
    </>
  );
}