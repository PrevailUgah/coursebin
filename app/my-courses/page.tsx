import { redirect } from "next/navigation";

export default function MyCoursesRedirect() {
  redirect("/enrolled-courses");
}