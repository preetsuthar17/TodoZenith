self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(self.registration.showNotification("Reminder", options));
});

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});
