# Rajasthan Patwari AI Assistant V4.3

## V4.3 changes on this branch
- Removed the legacy `patwariSignIn/firebaseAuth/patwariCloudLoad/patwariCloudSave` integration and retained one `PatwariFirebase` API for the legacy assistant controls.
- Unified both AI interfaces through one authenticated Worker request service.
- Added IndexedDB recovery before starting a blank local workspace when Local Storage is absent or corrupt.
- New clean installs start with an empty workspace rather than silent sample revenue/land records.
- Added field validation and `updatedAt` timestamps for land, mutation, crop, visit and task create/edit workflows.
- Added area calculator input validation and image type/size checks for the custom backdrop.
- JSON import now previews record count and merges by stable IDs instead of replacing unrelated records.
- Hardened Cloudflare Worker request size limits, strict allowed-origin CORS, token-based per-user rate limits, timeout and upstream error handling.
- Updated app, manifest and Service Worker to V4.3; safe shell-only caching. Auth/private API responses are not cached.

## Firebase setup
1. Enable Google provider in Firebase Authentication.
2. Add `vishwendrasir.github.io` to Authentication > Settings > Authorized domains.
3. Create Firestore Database and publish the current owner-only `firestore.rules`.
4. Enter the Firebase Web App config in the in-app Firebase panel.
5. Keep Gemini API key and Firebase verification API key as Cloudflare Worker Secrets. Never place secrets in HTML, browser JavaScript or Git.
6. Configure Worker URL in the panel and verify the Cloudflare Worker environment contains `ALLOWED_ORIGIN=https://vishwendrasir.github.io`, `GEMINI_API_KEY`, and `FIREBASE_WEB_API_KEY`.

## Storage and sync
- Local Storage and IndexedDB are retained as device-local backups.
- Existing keys `RPAA_SEWAR_COMPLETE_HTML5_V1` and `RPAA_V4_PENDING_CLOUD_STATE` are preserved.
- Cloud state is per Firebase UID at `users/{uid}/app_state/main`.
- First login migrates local state; autosave and both manual Sync controls use the Firebase module.
- A browser-only app cannot guarantee sync after the browser/app is fully closed.
- Multi-device behavior still requires authenticated end-to-end tests against the intended Firebase project.

## QA status
- This branch contains source repairs and preliminary audit findings.
- Static source checks, parser tests and automated tests must be run and their actual results recorded in `V4_3_TEST_PLAN.md` and the pull request.
- Live Firebase and Gemini smoke tests require the owner's configured project and Cloudflare Worker secrets. Do not report those as passed unless executed with evidence.

## Limitations
- The app is a workflow and draft assistant, not an official Rajasthan government portal or source of certified land records.
- Verify AI-created drafts against official records and current departmental instructions before use.
