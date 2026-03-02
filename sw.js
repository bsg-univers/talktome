const CACHE_NAME = "speech-notes-v2";

const STATIC_ASSETS = [
  "./micro.png",
  "./manifest.webmanifest"
];

// Installation
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activation (nettoie anciens caches)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  const request = event.request;

  // 🔥 TOUJOURS réseau pour HTML
  if (request.headers.get("accept").includes("text/html")) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache first pour assets
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
