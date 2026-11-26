# V4.3 Test Plan

## Automated checks — passed
Run from `patwari-v4/` with `npm test`.

- GitHub Actions run: <https://github.com/VishwendraSir/Home-page/actions/runs/45755215138>
- Tested commit: `17f1d46359b5313c61b29b7a018d69dd45226278`
- Result: **31 tests passed, 0 failed**.

Coverage:
- Unique HTML IDs and inline handler function resolution.
- Stale Firebase global absence.
- Shared AI request helper and token retrieval.
- IndexedDB recovery and blank first-run initialization.
- CRUD timestamp presence.
- Land search renderer wiring.
- App/manifest/module/service-worker version and icon consistency.
- Service Worker cache boundaries.
- Owner-only Firestore rule source contract.
- Worker CORS, HTTP method, missing/invalid token, missing Gemini secret, malformed JSON, prompt length, success, sanitized upstream failure, per-user request throttling and bilingual prompt mode.
- Inline JavaScript parsing; Firebase and Service Worker syntax; static DOM selector references.
- CSV formula guard, record ID escaping and imported record cloning/validation.

## Manual / integration tests still required
1. Google redirect login with intended Firebase project and Authorized Domain.
2. Save a dedicated TEST record; verify only `users/{uid}/app_state/main` is written.
3. Refresh and confirm cloud restore.
4. Sign in on a second test device and verify conflict handling.
5. Offline edit then reconnect; confirm pending queue clears only after Firestore confirms a write.
6. Use intentionally restrictive test rules; confirm local data remains and UI reports failure.
7. Worker live call with valid Firebase ID token and configured Cloudflare secrets.
8. Test Hindi, English and Both response modes against deployed Gemini.
9. Android portrait/landscape, narrow viewport, print preview and install/update.
10. IndexedDB recovery using a separate disposable browser profile with a TEST fixture; never clear the owner's real records.

Do not run destructive tests against real office data or production Firestore. A CI green result does not replace Firebase/Gemini live tests.
