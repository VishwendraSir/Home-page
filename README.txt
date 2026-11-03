SCIENCE CENTRE LEARNING HUB — Repository Guide
Guided by Vishwendra Sir

LIVE SITE
https://vishwendrasir.github.io/Home-page/index.html

REPOSITORY
https://github.com/VishwendraSir/Home-page
Branch: main
Hosting: GitHub Pages

MAIN FEATURES
- Responsive bilingual learning homepage with class and keyword filters.
- Question Bank, Premium Library catalogue and topic-wise learning pages.
- Shared Hindi + English Voice Studio: browser/device text-to-speech, voice selection, speed, pitch, pause, resume and stop.
- Main SCH Quiz Engine now includes question-and-options audio, Hindi/English voice selection, speed, pause, resume and stop controls.
- Installable PWA foundation: web manifest, app icon, service worker and offline fallback.
- Previously opened same-origin pages may be cached by the service worker for later offline use.

IMPORTANT LIMITATIONS
- Speech quality and Hindi/English voice availability depend on the voices installed on the learner's device/browser. Speech is not a prerecorded audio file.
- Offline mode requires the site to be opened online at least once; only the app shell and pages already visited are available offline.
- Owner Dashboard is a local UI prototype. It is NOT secure owner authentication or server-side resource access control.
- Premium labels/catalogue do not enforce paid access. No verified payment gateway or secure entitlement backend is configured in this static GitHub Pages repository.
- No Firebase configuration or Firebase integration was found in the repository code search. Do not assume student accounts or cloud sync are active.
- worker-test.html is only a client-side diagnostic page for the Cloudflare Worker endpoint. The Worker source/configuration is not stored in this repository, so API security, rate limits, CORS policy and secret configuration must be reviewed in the Cloudflare account. Keep provider API keys in Worker secrets, never in HTML.
- Large HTML pages and question banks need separate runtime, answer-key, content-quality and mobile-device testing. A successful GitHub Pages deployment confirms publishing, not that every quiz/audio feature works on every phone.

PWA INSTALLATION
1. Open the live site in Chrome on Android while online.
2. Wait for the page to load and the install prompt/button to appear.
3. Choose Install app (or Chrome menu → Install app / Add to Home screen).
4. Reopen the installed app once while online so the offline shell can be cached.
5. Test Voice Studio using the device's Hindi and English text-to-speech voices.

KEY FILES
- index.html — main learning hub homepage.
- manifest.webmanifest — PWA metadata.
- sw.js — offline cache and navigation fallback.
- offline.html — offline fallback screen.
- icon.svg — app icon.
- voice-studio.html — shared bilingual speech controls.
- worker-test.html — AI Tutor Worker diagnostic page.
- owner-dashboard.html — non-secure UI prototype only.

SAFE MAINTENANCE
- Keep a backup before large content edits.
- Verify every relative link against the repository tree before publishing.
- Preserve old versions until all known incoming links and external bookmarks have been considered.
- Never add API keys, passwords, student personal data or payment secrets to public HTML/JavaScript.
