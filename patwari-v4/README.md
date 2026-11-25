# Rajasthan Patwari AI Assistant V4.1

## What changed
- Local Storage and IndexedDB remain enabled as device backups.
- After Google sign-in, the app loads `users/{uid}/app_state/main` from Firestore.
- Existing browser data is uploaded on first cloud activation if no cloud snapshot exists.
- Every app `persist()` queues a debounced cloud snapshot save.
- Failed saves remain in `RPAA_V4_PENDING_CLOUD_STATE` and retry when the browser is online.
- Cloud and local records are merged by stable record IDs; cloud records win ID conflicts during initial restore.
- Existing app sections and offline workflows are retained.

## Deploy
1. In Firebase Authentication, enable Google provider.
2. Add `vishwendrasir.github.io` to Authentication > Settings > Authorized domains.
3. Create Firestore Database.
4. Publish the complete contents of `firestore.rules` in Firestore > Rules.
5. Keep the Firebase Web config in the app panel/browser. Never put a Gemini API key or service-account key in HTML.
6. Commit the files in `patwari-v4/` to the `main` branch. GitHub Pages serves the folder at the existing URL.

## Test checklist
- Sign in with Google; status should show the signed-in email.
- Add a test land record or task; wait for Cloud Saved.
- In Firestore Data, verify `users/{your-uid}/app_state/main`.
- Refresh while signed in; records should reappear.
- To test offline queue, switch offline, make a test change, reconnect and wait for Cloud Saved.

## Important
The app currently stores a single per-user state snapshot in Firestore. Do not share a user login between staff. No certified Rajasthan government portal integration is provided. Cloud restore requires internet on first sign-in. A browser-only app cannot guarantee background sync after it is fully closed.
