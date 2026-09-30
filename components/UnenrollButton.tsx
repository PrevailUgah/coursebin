"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnenrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!confirm("Unenroll from this course?")) return;
    setBusy(true);
    const res = await fetch("/api/enroll", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Failed to unenroll.");
  }

  return (
    <button onClick={handleClick} disabled={busy} className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50">
      {busy ? "…" : "Unenroll"}
    </button>
  );
}