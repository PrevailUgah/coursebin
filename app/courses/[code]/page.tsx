import { redirect } from "next/navigation";
import { getCourseByCode } from "@/lib/academic";

export default async function CourseRedirect({
  params, searchParams,
}: { params: Promise<{ code: string }>; searchParams: Promise<{ tab?: string; type?: string }> }) {
  const { code } = await params;
  const { tab, type } = await searchParams;
  const course = await getCourseByCode(code);
  if (!course || !course.departments || course.departments.length === 0) redirect("/browse");

  const primary = course.departments[0];
  const qs = new URLSearchParams();
  if (tab) qs.set("tab", tab);
  if (type) qs.set("type", type);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  redirect(`/browse/${primary.faculty_id}/${primary.id}/${course.level}/${course.semester}/${course.code}${suffix}`);
}