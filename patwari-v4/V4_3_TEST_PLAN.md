# V4.3 Test Plan

## Automated checks — passed
Run from `patwari-v4/` with `npm test`.

- GitHub Actions run: <https://github.com/VishwendraSir/Home-page/actions/runs/45755577026>
- Tested commit: `db3acc2e6625e514a2a860f69be9835cfece5053`
- Result: **36 tests passed, 0 failed**.

Coverage:
- Unique HTML IDs and inline handler function resolution.
- Stale Firebase global absence and shared AI client/token use.
- IndexedDB recovery and blank first-run initialization.
- CRUD timestamps and Firebase config-switch guard.
- Static DOM selector existence and inline JavaScript parsing.
- Firebase and Service Worker syntax; version/cache and PWA icon consistency.
- Owner-only Firestore rule source contract.
- Worker CORS, HTTP method, missing/invalid token, missing Gemini secret, malformed JSON, prompt limits, success, sanitized upstream failure, per-user throttling and bilingual prompt mode.
- Executable app-function tests with a controlled fake DOM: imported-state cloning/validation, area conversions/share validation, task validation and timestamped persistence, and safe record search output.
- CSV formula guard and record ID escaping.

The fake-DOM tests exercise selected functions, but they are not a substitute for a real browser/device test.

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
