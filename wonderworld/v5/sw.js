"use strict";
const CACHE = "ww-v5-appshell-5-3";
const SHELL = [
  "./", "./index.html", "./parent-dashboard.html", "./manifest.webmanifest", "./icon.svg", "./offline.html",
  "./Manushree_Candy_Garden_V4_9_Complete.html",
  "./Shree_Ocean_Discovery_Complete.html",
  "./Ram_Dino_Space_Quest.html",
  "../../firebase-config.js", "../../site-lock.js", "../../ai-tutor-widget.js"
];
self.addEventListener("install", event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await Promise.all(SHELL.map(async path => {
    try { const response = await fetch(path, { cache: "reload" }); if (response.ok) await cache.put(path, response); } catch (_) {}
  }));
  await self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith("ww-v5-appshell-") && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener("fetch", event => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh.ok) { const cache = await caches.open(CACHE); await cache.put(req, fresh.clone()); }
        return fresh;
      } catch (_) {
        return (await caches.match(req)) || (await caches.match("./offline.html")) || (await caches.match("./index.html"));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh.ok) { const cache = await caches.open(CACHE); await cache.put(req, fresh.clone()); }
      return fresh;
    } catch (_) { return cached || Response.error(); }
  })());
});
