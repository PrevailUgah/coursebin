import { getFacultiesWithDepartments } from "@/lib/academic";
import AdminCourseForm from "@/components/AdminCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const faculties = await getFacultiesWithDepartments();
    return <AdminCourseForm faculties={faculties} />;
}