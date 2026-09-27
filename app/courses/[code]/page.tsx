import { redirect } from "next/navigation";
import { getCourseByCode } from "@/lib/academic";

export default async function CourseRedirect({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const course = await getCourseByCode(code);
    if (!course) redirect("/browse");

    const dept = course.departments as any;
    redirect(`/browse/${dept.faculty_id}/${dept.id}/${course.level}/${course.semester}/${course.code}`);
}