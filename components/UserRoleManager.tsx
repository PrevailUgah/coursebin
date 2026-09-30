"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { type Column } from "@/components/DataTable";

type User = { id: string; email: string | null; role: string };

const roleLabel: Record<string, string> = { student: "Student", junior_admin: "Junior Admin", senior_admin: "Senior Admin" };

export default function UserRoleManager({ users }: { users: User[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function changeRole(id: string, role: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setBusyId(null);
    if (res.ok) router.refresh();
    else alert("Failed to update role.");
  }

  const columns: Column<User>[] = [
    { key: "email", label: "Email", sortable: true, render: (u) => u.email ?? "—" },
    { key: "role", label: "Current role", sortable: true, render: (u) => roleLabel[u.role] ?? u.role },
    {
      key: "actions", label: "Change role",
      render: (u) => (
        <select value={u.role} disabled={busyId === u.id} onChange={(e) => changeRole(u.id, e.target.value)} className="border border-border rounded-lg px-2 py-1 text-sm bg-card text-ink disabled:opacity-50">
          <option value="student">Student</option>
          <option value="junior_admin">Junior Admin</option>
          <option value="senior_admin">Senior Admin</option>
        </select>
      ),
    },
  ];

  return <DataTable columns={columns} rows={users} pageSize={15} searchText={(u) => `${u.email ?? ""} ${u.role}`} filterPlaceholder="Filter by email…" emptyMessage="No users yet." />;
}