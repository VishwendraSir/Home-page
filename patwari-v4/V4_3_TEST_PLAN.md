# V4.3 Test Plan

## Automated tests
Run from `patwari-v4/`:
```bash
npm test
```

The static/contract tests check unique IDs, handler references, stale API absence, shared AI client, IndexedDB recovery presence, CRUD timestamp hooks, land-search renderer, version consistency, service-worker cache boundaries, owner-only Firestore rule text, Worker input bounds/CORS/token validation and secret non-disclosure.

The Worker mock suite checks preflight CORS, unsupported methods, missing/invalid token, missing Gemini secret, malformed JSON, prompt length, success shape and sanitized upstream failure.

## Manual / integration tests still required
1. Google login with intended Firebase project and Authorized Domain.
2. Firestore save on a dedicated TEST record; verify users/{uid}/app_state/main.
3. Refresh; verify data restored from cloud.
4. Second device with same account; verify merge.
5. Offline edit then reconnect; verify pending save is cleared only after remote confirmation.
6. Invalid Firestore rules; ensure local record remains and status shows error.
7. Worker live tests with valid Firebase ID token and configured Cloudflare secrets.
8. Android portrait/landscape, narrow viewport, print preview and PWA install/update.
9. Storage recovery by deliberately using a separate test browser profile where Local Storage is cleared but IndexedDB test fixture remains.

Never run destructive tests against the owner's real office data or production Firestore collection.
