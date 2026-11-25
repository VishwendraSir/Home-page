# Manushree Wonder World V5.1

Live entry: https://vishwendrasir.github.io/Home-page/wonderworld/v5/

## Existing project retained
- Candy Garden V4.9 Complete
- Shree Ocean Discovery (Phase 8)
- Ram Dino Space Quest (Phase 7)
- Existing browser-based learning activities and device-local progress are preserved.
- Existing Firebase project integration and site-lock references in the child apps are preserved.

## V5.1 upgrades
- Installable PWA manifest and Wonder World app icon.
- Dedicated service-worker cache scoped to this V5 folder.
- Offline launcher and cached copies of all three learning modules.
- Install prompt on supported browsers.
- Shared child-safe AI Learning Buddy widget added to launcher and all three worlds. It uses the existing root widget and Cloudflare endpoint; live AI is not guaranteed until the Worker is reachable and its Gemini secret/CORS are verified.
- Main Science Centre home quick link now opens this V5.1 project.
- Main Wonder World version switcher label updated from V5.0 to V5.1.
- Existing V5.0 app source and V3.7/older projects are retained in Git history and existing separate paths.

## Important limitations
- Student progress remains device/browser-local unless a verified cloud-sync feature is configured.
- Firebase page lock is a display gate; public GitHub Pages files remain directly retrievable.
- AI chat requires internet and the existing Cloudflare Worker. No API key is stored in these public files.
- Some visual styling uses third-party CDN assets in the learning modules; full styling may be reduced while offline. The PWA caches the app shell and same-origin project pages, not third-party CDN assets.
- Membership Worker/admin panel is separate from student progress sync and requires configured Cloudflare KV and ADMIN_TOKEN.

## Deploy
The V5 folder contains: `index.html`, `manifest.webmanifest`, `icon.svg`, `sw.js`, `offline.html`, and the three learning HTML modules.

Open the live entry once online to install/update the service worker. Existing V5.0 learning module URLs remain unchanged.
