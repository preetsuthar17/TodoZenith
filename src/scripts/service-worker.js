const CACHE_NAME = "my-app-cache-v1";
const NOTIFICATION_TAG = "reminder-notification";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "index.html",
        "src/scripts/notes.js",
        "src/scripts/reminder.js",
        "src/scripts/todo.js",
        "src/styles/globals.css",
        "src/styles/reminder.css",
        "src/styles/todo.css",
        "src/styles/notes.css",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "../images/favicon.png",
    tag: NOTIFICATION_TAG,
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === "open") {
    clients.openWindow(notification.data.url);
  }

  notification.close();
});

self.addEventListener("notificationclose", (event) => {
  const closedNotification = event.notification;
  const closedNotificationTag = closedNotification.tag;

  event.waitUntil(
    caches
      .open("notification-data")
      .then((cache) => {
        return cache.delete(closedNotificationTag);
      })
      .catch((error) => {
        console.error("Error while cleaning up notification:", error);
      })
  );
});
