# MANUSHREE WONDER WORLD – Global Free Learning Platform (V2.1)

## Included in this release
- Preserves the V2.0 global curriculum, AI Studio offline templates, labs, games, teacher tools, dashboards and Learner Zone.
- Keeps learner profile and progress device-local; existing V1.x/V2.0 browser-state migration remains in place.
- Improves PWA install metadata and same-origin offline caching.
- Uses a dedicated `manushree-wonder-world-v2-1` cache and only removes older caches with this app's own prefix.
- Disables the packaged demo admin credential. Static HTML cannot provide secure administrator authentication.
- Keeps AI API keys out of the browser. Live AI requires a secure HTTPS Worker endpoint.

## Important limitations
- Learner profiles and progress remain in the current browser/device only. Firebase login, global accounts and Firestore sync are not connected.
- Admin operations require Firebase Authentication plus server-side/Firestore Security Rules. Do not rely on client-side checks for authorization.
- AI generation is live only when a secure HTTPS Worker endpoint is configured. Provider API keys must remain on the server.
- This package is a static GitHub Pages app; it does not create a backend or cloud account system.

## Deploy
Upload these four files together into:
`VishwendraSir/Home-page/manushree-wonder-world/`

Files: `index.html`, `sw.js`, `manifest.json`, `README.md`

Live page:
`https://vishwendrasir.github.io/Home-page/manushree-wonder-world/`

After deployment, open the page once while online, then reload. If an older cached screen remains, close the installed app/browser tab and reopen after the service worker activates.

## Rollback
The previous release remains in the Git history. Restore the prior folder contents from the preceding commit if rollback is needed.
