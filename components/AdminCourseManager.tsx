"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import AdminCourseForm from "@/components/AdminCourseForm";
import { semesterLabel } from "@/lib/utils";

type Row = {
    id: string;
    code: string;
    title: string;
    units: number;
    level: number;
    semester: number;
    department: string;
    faculty: string;
};

export default function AdminCourseManager({
    courses,
    faculties,
}: {
    courses: any[];
    faculties: any[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const closeModal = useCallback(() => setOpen(false), []);

    const rows: Row[] = courses.map((c: any) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        units: c.units,
        level: c.level,
        semester: c.semester,
        department: c.departments?.name ?? "—",
        faculty: c.departments?.faculties?.name ?? "—",
    }));

    async function handleDelete(row: Row) {
        if (!confirm(`Delete ${row.code}? Its uploaded documents will also be removed.`)) return;
        const res = await fetch(`/api/admin/courses/${row.id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
        else alert("Failed to delete course.");
    }

    const columns: Column<Row>[] = [
        { key: "code", label: "Code", sortable: true, render: (r) => <span className="font-semibold">{r.code}</span> },
        { key: "title", label: "Title", sortable: true },
        { key: "department", label: "Department", sortable: true, className: "hidden md:table-cell" },
        { key: "faculty", label: "Faculty", sortable: true, className: "hidden xl:table-cell" },
        { key: "level", label: "Level", sortable: true, render: (r) => `${r.level}` },
        {
            key: "semester",
            label: "Semester",
            sortable: true,
            className: "hidden sm:table-cell",
            render: (r) => semesterLabel(r.semester),
        },
        { key: "units", label: "Units", sortable: true, sortValue: (r) => r.units, className: "hidden sm:table-cell" },
        {
            key: "actions",
            label: "",
            render: (r) => (
                <button
                    onClick={() => handleDelete(r)}
                    aria-label={`Delete ${r.code}`}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink">Courses</h1>
                    <p className="text-sm text-muted">{rows.length} total</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                    <Plus className="w-4 h-4" /> Add course
                </button>
            </div>

            <DataTable
                columns={columns}
                rows={rows}
                pageSize={10}
                searchText={(r) => `${r.code} ${r.title} ${r.department} ${r.faculty}`}
                filterPlaceholder="Filter courses…"
                emptyMessage="No courses yet."
            />

            <Modal open={open} onClose={closeModal} title="Add a course">
                <AdminCourseForm faculties={faculties} onSuccess={closeModal} />
            </Modal>
        </div>
    );
}