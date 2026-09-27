import { getFaculty, getDepartments } from "@/lib/academic";
import DepartmentManager from "@/components/DepartmentManager";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [faculty, departments] = await Promise.all([getFaculty(id), getDepartments(id)]);

    return (
        <div>
            <a href="/admin/faculties" className="text-sm text-primary">← Faculties</a>
            <h1 className="text-2xl font-bold text-ink mt-2 mb-4">{faculty?.name} — Departments</h1>
            <DepartmentManager facultyId={id} departments={departments} />
        </div>
    );
}