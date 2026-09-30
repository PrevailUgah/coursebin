import { getFacultiesWithDepartments } from "@/lib/academic";
import { getAllCourses } from "@/lib/admin-data";
import AdminCourseManager from "@/components/AdminCourseManager";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [faculties, courses] = await Promise.all([getFacultiesWithDepartments(), getAllCourses()]);
  return <AdminCourseManager faculties={faculties} courses={courses} />;
}