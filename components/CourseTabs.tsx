"use client";
import { useState } from "react";

export default function CourseTabs({
  materials, updates, defaultTab = "materials",
}: { materials: React.ReactNode; updates: React.ReactNode; defaultTab?: "materials" | "updates" }) {
  const [tab, setTab] = useState<"materials" | "updates">(defaultTab);
  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"}`;

  return (
    <div>
      <div className="flex border-b border-border mb-4">
        <button onClick={() => setTab("materials")} className={tabClass(tab === "materials")}>Materials</button>
        <button onClick={() => setTab("updates")} className={tabClass(tab === "updates")}>Course Updates</button>
      </div>
      <div className={tab === "materials" ? "" : "hidden"}>{materials}</div>
      <div className={tab === "updates" ? "" : "hidden"}>{updates}</div>
    </div>
  );
}