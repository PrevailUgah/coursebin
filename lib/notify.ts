import { createClient } from "@/lib/supabase/server";
import { sendPushToUsers } from "@/lib/send-push";

type NotifyParams = {
  courseId: string;
  kind: "material" | "update";
  title: string;
  body?: string | null;
  sourceId?: string;
  url?: string;
};

/**
 * Creates notification rows for every enrolled user
 * and also sends a real system push notification.
 */
export async function notifyEnrolledUsers({
  courseId,
  kind,
  title,
  body = null,
  sourceId,
  url,
}: NotifyParams) {
  const supabase = await createClient();

  // 1. Get all users enrolled in this course
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id")
    .eq("course_id", courseId);

  if (!enrollments?.length) return;

  const userIds = enrollments.map((e) => e.user_id);

  // 2. Get the real course code (so the link is nice)
  let finalUrl = url;
  if (!finalUrl) {
    const { data: course } = await supabase
      .from("courses")
      .select("code")
      .eq("id", courseId)
      .single();

    const code = course?.code ?? courseId;
    finalUrl =
      kind === "update"
        ? `/courses/${code}?tab=updates`
        : `/courses/${code}`;
  }

  // 3. Insert notification rows
  const rows = userIds.map((userId) => ({
    user_id: userId,
    course_id: courseId,
    kind,
    title,
    body,
    source_id: sourceId ?? null,
  }));

  const { error } = await supabase.from("notifications").insert(rows);
  if (error) {
    console.error("Failed to create notifications:", error);
    return;
  }

  // 4. Send real push notifications
  await sendPushToUsers(userIds, {
    title,
    body:
      body ||
      (kind === "material" ? "New material available" : "New course update"),
    url: finalUrl,
  });
}