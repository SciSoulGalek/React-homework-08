const VERSION = "v8";

const SHELL_CACHE = `questlog-shell-${VERSION}`;
const STATIC_CACHE = `questlog-static-${VERSION}`;
const API_CACHE = `questlog-api-${VERSION}`;

const BASE = new URL(self.registration.scope).pathname;

const SHELL_FILES = [
  BASE,
  `${BASE}manifest.json`,
  `${BASE}offline.html`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`,
  `${BASE}precache-assets.json`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(SHELL_FILES);

      const response = await fetch(BASE);
      const html = await response.text();

      const assetsResponse = await fetch(`${BASE}precache-assets.json`);
      const assets = await assetsResponse.json();

      const staticCache = await caches.open(STATIC_CACHE);

      await Promise.all(
        assets.map(async (asset) => {
          const response = await fetch(`${BASE}${asset}`);
        
          if (response.ok) {
            await staticCache.put(`${BASE}${asset}`, response);
          }
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((name) =>
            name.startsWith("questlog-") &&
            ![SHELL_CACHE, STATIC_CACHE, API_CACHE].includes(name)
          )
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.includes("/api/") &&
      !url.pathname.includes("/auth/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (/\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const appShell = await caches.match(BASE);
          if (appShell) return appShell;

          return caches.match(`${BASE}offline.html`);
        }
      })()
    );
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, response.clone());
    await limitCache(STATIC_CACHE, 100);
  }

  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put(request, response.clone());
      await limitCache(API_CACHE, 50);
    }

    return response;
  } catch {
    const cached = await caches.match(request);

    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set("X-Cache-Status", "cached");

      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers
      });
    }

    return new Response(
      JSON.stringify({ error: "No internet connection and no cached data." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

async function limitCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
  }
}

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});