const CACHE = "patwari-sewar-v4-v43-audit-1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg", "./firebase.js?v=4.3.0"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map(async path => {
      try { await cache.add(path); } catch (error) { console.warn("Precache skipped:", path); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("patwari-sewar-") && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes("/users/") || url.pathname.includes("/auth/")) return;
  const isShellAsset = SHELL.some(path => new URL(path, self.registration.scope).pathname === url.pathname);
  if (!isShellAsset && request.mode !== "navigate") return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isShellAsset) {
      const cached = await cache.match(request);
      if (cached) return cached;
    }
    try {
      const fresh = await fetch(request);
      if (fresh.ok && (isShellAsset || request.mode === "navigate")) {
        const clone = fresh.clone();
        await cache.put(request, clone);
      }
      return fresh;
    } catch (error) {
      if (request.mode === "navigate") {
        const fallback = await cache.match("./index.html");
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
