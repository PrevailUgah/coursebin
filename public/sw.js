self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "CourseBin";
  const options = {
    body: data.body || "",
    icon: "/icon-192.png", // optional
    badge: "/badge-72.png", // optional
    data: { url: data.url || "/" },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});