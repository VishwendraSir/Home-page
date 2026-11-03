const VERSION='sch-pwa-v1';
const SHELL=[ './', './index.html', './offline.html', './manifest.webmanifest', './icon.svg' ];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(SHELL);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('sch-pwa-')&&k!==VERSION).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request;const url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{try{const fresh=await fetch(req);if(fresh.ok){const c=await caches.open(VERSION);c.put(req,fresh.clone());}return fresh;}catch(_){return (await caches.match(req))||(await caches.match('./offline.html'));}})());
  return;
 }
 if(['style','script','image','font'].includes(req.destination)){
  event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const fresh=await fetch(req);if(fresh.ok){const c=await caches.open(VERSION);c.put(req,fresh.clone());}return fresh;}catch(_){return cached||Response.error();}})());
 }
});