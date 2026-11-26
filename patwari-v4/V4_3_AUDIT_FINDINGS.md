# V4.3 Preliminary Source Audit Findings

Branch: `patwari-v4.3-full-audit-upgrade`

This report records static findings from the inspected V4.2.2 source. It is not a claim that runtime tests have passed.

## Findings observed in source
1. **Legacy Firebase API mismatch — High.** The legacy assistant block calls `window.patwariSignIn`, `window.firebaseAuth`, `window.patwariCloudLoad` and `window.patwariCloudSave`; the modular module exports `window.PatwariFirebase`. These systems must be unified.
2. **Two AI integration paths — High.** The legacy AI panel reads `window.PATWARI_CONFIG.workerUrl` and `window.firebaseAuth.currentUser`; the V4 panel stores `RPAA_V4_WORKER_URL` and gets an ID token using `PatwariFirebase.getIdToken()`. Unify both entry points.
3. **PWA metadata version mismatch — Medium.** `manifest.json` still says V4.0; the HTML footer says V4.2.
4. **HTML control coverage — Requires executable checks.** Static scan found 103 IDs, 49 declared named functions and 64 inline handler attributes. These counts are inventory inputs, not pass/fail proof.
5. **Offline storage recovery — High.** Main page persists to Local Storage and asynchronously writes IndexedDB, but loadInitial only reads Local Storage before adding demo fixtures. Add IndexedDB recovery and prevent demo initialization from overwriting an existing recoverable profile.
6. **Record timestamp consistency — High.** CRUD records must be checked for updatedAt/clientUpdatedAt values to support deterministic local/cloud conflict resolution. Current Firebase merge uses these fields when present.
7. **Cloud sync status semantics — High.** Verify manual sync and debounced saves treat deferred/not-ok results as queued rather than confirmed writes; pending queue must only clear after Firestore confirmation.
8. **Service worker behavior — Medium.** Inspect shell cache, navigation fallback, module cache versioning and ensure private/auth/API responses are never cached.
9. **Shared site catalogue workflow — Medium.** Root workflow runs scripts/build-site-pages.py on pushes and inserts the shared site-lock loader into HTML pages. Verify it does not cause unrelated changes during V4.3 work.
10. **Worker integration — High.** Verify strict CORS allowlist, OPTIONS preflight, user rate limiting, Firebase token validation, request size limits, non-JSON upstream errors and Gemini secret handling.

## Required execution evidence
- Parse all inline and external JavaScript.
- Verify every handler and target element.
- Browser tests for CRUD, storage, auth, sync, restore, offline mode, worker and PWA.
- Firebase Emulator tests or dedicated non-production Firebase test account.
- Worker mocked tests and optional configured live smoke tests.
- Android/mobile viewport test.

Do not label any unrun test as passed.