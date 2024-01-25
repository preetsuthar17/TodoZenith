const cacheName = "todo-zenith-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/src/images/favicon.png",
  "/src/images/icon.svg",
  "/src/images/preview.png",
  "/src/scripts/notes.js",
  "/src/scripts/todo.js",
  "/src/styles/globals.css",
  "/src/styles/notes.css",
  "/src/styles/todo.css",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
