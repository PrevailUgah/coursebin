import { getFaculties } from "@/lib/academic";
import FacultyManager from "@/components/FacultyManager";

export const dynamic = "force-dynamic";

export default async function AdminFacultiesPage() {
    const faculties = await getFaculties();
    return (
        <div className="max-w-2xl">
            <FacultyManager faculties={faculties} />
        </div>
    );
}