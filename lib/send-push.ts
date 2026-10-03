import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

export async function sendPushToUsers(
  userIds: string[],
  payload: { title: string; body?: string; url?: string }
) {
  if (!userIds.length) return;

  // Set VAPID details only when the function is actually called (not at build time)
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (!subs?.length) return;

  const message = JSON.stringify(payload);

  await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        message
      )
    )
  );
}