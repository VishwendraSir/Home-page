# V4.3 Test Plan

## Automated checks
Run from `patwari-v4/`:
```bash
npm test
```

The suite includes:
- Unique HTML ID check.
- Inline handler function-name resolution.
- Stale Firebase global absence.
- Shared AI client and token use.
- IndexedDB recovery and blank first-run check.
- CRUD timestamp presence.
- DOM selector existence and JavaScript syntax parsing.
- Version/cache consistency and PWA icon manifest.
- Service Worker cache boundaries.
- Owner-only Firestore rule source contract.
- Worker CORS, HTTP method, token, JSON, prompt-size, secret, upstream error and rate-limit mock cases.

## Manual/integration tests still required
1. Google redirect login with intended Firebase project and Authorized Domain.
2. Save a dedicated TEST record; verify only `users/{uid}/app_state/main` is written.
3. Refresh and confirm cloud restore.
4. Sign in on a second test device and verify conflict handling.
5. Offline edit then reconnect; confirm pending queue clears only after Firestore confirms a write.
6. Use intentionally restrictive test rules; confirm local data remains and the UI reports failure.
7. Test Worker live call with valid Firebase ID token and configured Cloudflare secrets.
8. Test Hindi, English and Both response modes.
9. Android portrait/landscape, narrow viewport, print preview and install/update.
10. IndexedDB recovery using a separate disposable browser profile with a TEST fixture; never clear the owner's real records.

Do not run destructive tests against real office data or the production Firestore account. A CI green result does not replace Firebase/Gemini live tests.
