"use client";
import Link from "next/link";
import { Upload } from "lucide-react";
import { useAuth } from "@/lib/auth-client";

export default function UploadToCourseButton({ code }: { code: string }) {
  const { isAdmin, loading } = useAuth();
  if (loading || !isAdmin) return null;

  return (
    <Link
      href={`/upload?course=${encodeURIComponent(code)}`}
      className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg shrink-0"
    >
      <Upload className="w-4 h-4" /> Upload resource
    </Link>
  );
}