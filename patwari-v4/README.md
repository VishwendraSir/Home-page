# Rajasthan Patwari AI Assistant V4.3

## V4.3 candidate changes
- Removed stale legacy Firebase globals and routed login/cloud actions through the single `PatwariFirebase` API.
- Unified both AI entry points through one authenticated Worker request service and one Worker URL setting.
- Added Local Storage → IndexedDB recovery before creating a blank first-run workspace.
- New installs no longer receive fictitious sample landholder, mutation, crop or visit records.
- Added required-field/area validation and `updatedAt` timestamps for land, mutation, crop, visit and task records.
- Added stricter area/share parsing, image MIME/2 MB limits, safe imported record cloning/ID normalization and CSV formula-injection handling.
- JSON restore now validates the selected backup, shows its record count, downloads a pre-restore backup, and rolls back in-memory state if Local Storage cannot save.
- Fixed cloud merge so identical records with identical timestamps are not duplicated as conflicts; cloud restore writes merge with the latest remote snapshot.
- Added Firestore snapshot size preflight (900 KiB safety threshold; no silent truncation).
- Hardened Worker exact-origin CORS, request limits, authenticated user throttling, timeout and sanitized upstream errors. The AI language selector supports Hindi, English and Both.
- Added scalable PWA SVG icon and cached shell icon. Service Worker only caches same-origin shell/navigation resources.

## Firebase setup
1. Enable Google provider in Firebase Authentication.
2. Add `vishwendrasir.github.io` to Authentication > Settings > Authorized domains.
3. Create Firestore Database and publish the current owner-only `firestore.rules`.
4. Enter the Firebase Web App config in the in-app Firebase panel.
5. Set Cloudflare Worker secrets: `GEMINI_API_KEY` and `FIREBASE_WEB_API_KEY`. Never put these secrets in HTML, browser JavaScript or Git.
6. Configure Worker URL in the panel and verify Worker variables: `ALLOWED_ORIGIN=https://vishwendrasir.github.io` and `GEMINI_MODEL`.

## Storage and sync
- Local Storage key `RPAA_SEWAR_COMPLETE_HTML5_V1` and pending queue key `RPAA_V4_PENDING_CLOUD_STATE` are preserved.
- IndexedDB backup database: `PatwariCompleteDB`, object store `store`, record key `main`.
- Cloud state is per Firebase UID at `users/{uid}/app_state/main`.
- First login migrates local state; autosave and manual sync use the Firebase module.
- JSON restore intentionally restores the selected backup as the workspace state after confirmation; it does not silently merge two unrelated backups.
- A browser-only app cannot guarantee sync after the browser/app is fully closed.
- A single Firestore snapshot is limited by Firestore document size; this build blocks writes above 900 KiB and does not truncate data.

## QA status
- Automated tests are included under `tests/` and run in GitHub Actions.
- Verified run for application commit `c0c79bc4c70dbaf1136527c902fcbaa4f6a6dc89`: **37 passed, 0 failed**, including selected app-function tests with a fake DOM. [View GitHub Actions run](https://github.com/VishwendraSir/Home-page/actions/runs/45755766540).
- Documentation-only updates after that tested commit trigger a fresh CI run; review the latest run before merge.
- Live Firebase/Gemini smoke tests and Android/browser QA require the owner's configured project, Cloudflare secrets and a dedicated test account.
- The Worker in-memory rate limiter is best-effort per Worker isolate, not a globally coordinated production quota. Use Cloudflare Durable Objects or a managed rate-limit binding before high-volume deployment.

## Limitations
This is an office workflow and AI drafting helper, not an official Rajasthan government portal or source of certified land records. AI-generated drafts must be checked against official records and current departmental instructions before use.
