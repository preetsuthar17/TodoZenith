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

function fetchAndCache(request) {
  return fetch(request)
    .then(function (response) {
      if (!response || response.status !== 200) {
        throw new Error(`Invalid response for ${request.url}`);
      }

      const responseToCache = response.clone();

      return caches.open(dynamicCacheName).then(function (cache) {
        cache.put(request, responseToCache);
        return response;
      });
    })
    .catch(function (error) {
      if (error.message !== "Failed to fetch") {
        console.error(`[Service Worker] Fetch error: ${error}`);
      }

      return new Response("You are offline.");
    });
}

self.addEventListener("fetch", function (event) {
  const { request } = event;

  if (!request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then(function (cachedResponse) {
        if (cachedResponse) {
          console.log(`[Service Worker] Cached resource: ${request.url}`);
          return cachedResponse;
        }

        return fetchAndCache(request);
      })
      .catch(function () {
        return new Response("You are offline.");
      })
  );

  event.waitUntil(
    fetch(request)
      .then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          console.log("[Service Worker]: Background cache update");
          return cache.put(request, response);
        });
      })
      .catch(function (error) {
        console.error(
          `[Service Worker] Background cache update error: ${error}`
        );
      })
  );
});
