const version = "v4";
const cacheName = `todo-zenith-${version}`;
const dynamicCacheName = `dynamic-todo-zenith-${version}`;

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

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return (
              key.startsWith("todo-zenith") &&
              key !== cacheName &&
              key !== dynamicCacheName
            );
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  const { request } = event;

  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      return (
        cachedResponse ||
        fetch(request)
          .then(function (fetchResponse) {
            if (!fetchResponse || fetchResponse.status !== 200) {
              return cachedResponse || new Response("You are offline.");
            }

            const responseToCache = fetchResponse.clone();

            caches.open(dynamicCacheName).then(function (cache) {
              cache.put(request.url, responseToCache);
            });

            return fetchResponse;
          })
          .catch(function () {
            return cachedResponse || new Response("You are offline.");
          })
      );
    })
  );
});
