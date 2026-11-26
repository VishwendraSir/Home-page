# Rajasthan Patwari AI Assistant V4.3 — COMPLETE PRODUCTION AUDIT, REPAIR & FULL-FUNCTION UPGRADE

## Target
- Repository: VishwendraSir/Home-page
- Existing app: patwari-v4/
- Work branch: patwari-v4.3-full-audit-upgrade
- Existing live URL must remain compatible: https://vishwendrasir.github.io/Home-page/patwari-v4/
- Never overwrite main directly. Preserve all existing modules, user data and current storage keys.
- The app is an office-workflow helper for Sewar, Bharatpur. It is NOT an official Rajasthan revenue portal and must never claim access to certified Jamabandi, Bhunaksha, mutation orders, government databases or live departmental records unless an authorized real integration is documented and configured.

## Role
Act as a senior full-stack engineer, Firebase/Firestore specialist, Cloudflare Worker/Gemini engineer, PWA engineer, security reviewer and QA automation lead. Audit the exact code, implement fixes, add automated tests, run them, repair failures, and open a pull request. Do not merely write a report or plan. Do not merge without human approval.

## Current defects and repository facts to verify before implementation
1. patwari-v4/index.html is a large single-page HTML application with dashboard, land records, mutation tracking, girdawari/crop entries, field visits, area calculator, draft generator, tasks, backup/export/import, audit log, calendar/reports, AI assistant and Firebase settings.
2. patwari-v4/firebase.js exports window.PatwariFirebase using Firebase modular SDK 10.14.1 and stores a per-user Firestore snapshot at users/{uid}/app_state/main.
3. There is legacy code in index.html around the AI/Firebase functions referencing window.patwariSignIn, window.firebaseAuth, window.patwariCloudLoad, window.patwariCloudSave. The modular firebase.js exports PatwariFirebase instead. Remove or migrate all stale symbols so there is ONE authoritative API.
4. The legacy AI UI reads window.PATWARI_CONFIG.workerUrl and window.firebaseAuth.currentUser while the newer V4 panel stores worker URL in localStorage RPAA_V4_WORKER_URL and uses PatwariFirebase.getIdToken(). Unify both AI entry points into one tested client service.
5. Search actual file source for literal escaped newline sequences in inline scripts. Parse all scripts with a JavaScript parser; do not assume the browser source is valid.
6. Both header Cloud Sync and green Sync Data must call the same Firebase adapter. Show "Cloud Saved" only after a confirmed Firestore write.
7. Current manifest metadata has older version strings; make manifest, UI, module URL, service worker and release notes agree on V4.3.
8. Root workflow .github/workflows/refresh-site-pages.yml calls scripts/build-site-pages.py, which scans HTML and inserts shared site-lock.js loaders. Stay compatible. Inspect its output on a safe temporary copy; do not break the shared site-lock loader or alter unrelated pages.
9. Discover all actual files and paths with GitHub directory listings; do not assume missing files.
10. Do not claim live Cloud/Gemini success without real authenticated tests and evidence.

## Phase 0 — protect data and characterize existing behavior
- Re-fetch all target files from the current branch and record SHAs, version strings, storage keys, module load order, UI IDs, functions, event handlers and routes.
- Preserve RPAA_SEWAR_COMPLETE_HTML5_V1 and RPAA_V4_PENDING_CLOUD_STATE unless a backwards-compatible migration is implemented and tested.
- Never wipe user storage, IndexedDB, Firestore documents or production rules during testing.
- Use fixtures clearly named TEST only; use Firebase Emulator or a dedicated test account, never live office records.

## Phase 1 — complete functional audit
Create a feature inventory and function map.
For every visible button, nav item, inline handler, form, table row action and generated action verify:
- handler exists and is callable;
- referenced DOM IDs exist and are unique;
- form event and async promise handling is correct;
- validation, persistence, feedback and error state work;
- Cancel/reset does not delete saved data;
- empty and populated states render;
- record content is safely escaped;
- no dead/duplicate functions, stale APIs, broken assets, bad relative URLs, malformed script escapes, console errors or unhandled rejections remain.
Record control, handler, result, severity, fix and test evidence in V4_3_AUDIT_REPORT.md.

## Phase 2 — one integration architecture
- Create a clear app service layer; exactly one documented Firebase API.
- Migrate/remove old patwariSignIn, firebaseAuth, patwariCloudLoad and patwariCloudSave usage.
- Make module initialization deterministic. Disable cloud buttons until Firebase setup/auth init is complete.
- Expose app readiness and display meaningful accessible status using role=status/aria-live.
- Keep UI responsive and usable on Android/mobile/tablet.
- No duplicate/conflicting auth listeners or competing save systems.

## Phase 3 — Local storage, IndexedDB and schema safety
- Define one versioned, validated state schema for land, mutations, crops, visits, tasks and audit.
- Stable unique IDs and updatedAt/clientUpdatedAt on every create/edit.
- Safe normalization without mutating imported source objects.
- If Local Storage is absent/corrupt, recover from IndexedDB before loading optional demo fixtures.
- Never overwrite an existing user state with sample data. Demo fixtures must be opt-in and explicitly labelled.
- Local Storage and IndexedDB must each work independently and report quota/permission errors.
- JSON backup, CSV export, safe JSON import preview, count preview, duplicate policy, explicit confirmation, pre-restore backup and rollback on invalid data.
- CSV must mitigate spreadsheet formula injection.
- Test Hindi/English, quotes, commas, newlines, empty data and large values.

## Phase 4 — Firebase Auth and Cloud Sync
- Verify config, named app initialization, auth persistence and redirect callback.
- Support Google redirect auth on GitHub Pages; process getRedirectResult and auth state once.
- States: config missing, initializing, login, signed out/local, connected, restoring, saving, saved, offline/pending, permission denied and error.
- All manual sync, autosave and offline retry use one shared API.
- Never delete pending queue until Firestore write is confirmed.
- Retry bounded exponential backoff; no retry storm or duplicate writes.
- Deterministic local/cloud merge by stable ID and updated timestamps. Define and explain conflict policy; never silently drop either version.
- Serialize writes and protect against stale updates, simultaneous restore/login/manual sync.
- Persist restore result to Local Storage and IndexedDB.
- Add backup download and restore preview; always make backup before restore.
- Diagnostics must check config, auth, network, Firestore read/write using a dedicated isolated test document, pending queue and last sync. Never write test content in actual records.
- Do not weaken owner-only Firestore rules or add public reads/writes.
- Validate UID ownership, payload schema, size limits and document size. If one snapshot cannot safely fit Firestore limits, design chunked storage/migration instead of truncating.
- No cross-user access.

## Phase 5 — Cloudflare Worker and Gemini
- One AI client service for both AI UI entry points.
- One worker URL setting source; validate HTTPS URL. Remove contradictory PATWARI_CONFIG dependency if unused.
- Firebase bearer token from PatwariFirebase.getIdToken().
- Validate JSON and response shape. Handle timeout and 400/401/403/429/500/502/503.
- CORS: handle OPTIONS correctly; allow exact production origin https://vishwendrasir.github.io and only intentional local dev origins. No wildcard credentials.
- Verify Firebase ID token against trusted endpoint and handle expired/revoked tokens.
- Per-user rate limit, bounded input, safe prompt handling, no private record content in logs.
- Gemini key ONLY in Cloudflare Worker Secret, never HTML, browser JS, git, logs or docs.
- Verify model availability/current model name.
- Never fabricate Jamabandi data, Khasra entries, legal sections, circulars, orders, case status or government access. Mark AI responses as drafts requiring official verification.
- Misconfigured AI must not break other app modules.
- Mock Worker tests always; live smoke test only if secrets are configured.

## Phase 6 — retain and fully test every feature
1. Dashboard KPIs and overdue task calculation.
2. Land records CRUD, search, totals and validation.
3. Mutation records CRUD, status, filtering and search.
4. Crop/girdawari CRUD, area, damage and optional GPS.
5. Field visits CRUD, GPS permission denied/unavailable handling.
6. Area calculator unit conversions, fractions, invalid and zero inputs.
7. Draft generator types, recipient, subject, body, preview, copy and download; draft disclaimer.
8. Tasks CRUD, completion toggle, priority, dates, calendar filtering.
9. Smart Record Finder across every collection, safe matching and useful results.
10. Audit log and confirmation before clearing.
11. JSON export/import and CSV export round-trips.
12. PDF/print Hindi layout, page breaks and hidden controls.
13. Hindi/English full interface including labels, errors, tables, notices, generated text; no half-translated UI.
14. Dark/light theme, persisted settings and readable contrast.
15. Backdrop upload/reset with size/type validation and safe storage; don't keep huge unbounded data URIs in localStorage.
16. Mobile navigation/forms/tables without horizontal overflow, accessible touch targets.
17. PWA install, offline shell and safe cache updates. Never cache auth responses or private cloud data in shared Cache Storage.
18. AI workflow, auth and worker configuration.
19. Firebase config, Login, Logout, Sync, Auto Save, Restore, pending retry.
20. Keep existing identity, office context, disclaimers and all current sections.

External government data, permission, credentials, API key or paid-service feature must be marked CONFIGURATION REQUIRED—not simulated as working.

## Phase 7 — security/privacy
Threat-model XSS, malicious JSON import, local shared device, token theft, IDOR, CSV formula injection, oversized image, exposed key, excessive Firestore rules, AI prompt injection.
- User-provided data must use safe text rendering/escaping; no unsafe innerHTML with untrusted values.
- Never log landholder/applicant data.
- Sign-out stops further cloud writes but never deletes local records.
- No private credentials or Gemini key in client code.
- No analytics/tracking/extra third-party script without necessity.
- No official portal impersonation or fabricated official data/legal advice.

## Phase 8 — CI and automated tests
Add a dedicated GitHub Actions workflow for patwari-v4, without breaking existing site catalogue workflow.
Use Node/Vitest/Playwright or lightweight parser/test tools as appropriate. CI must not require production secrets for mock tests.
Required suites:
A. Parse all inline/external JavaScript.
B. Unique HTML IDs; inline handlers resolve; selectors/asset paths exist.
C. CRUD and validation for each collection.
D. Normalization/schema migration and JSON import/export.
E. Search across all collections.
F. CSV quoting and formula injection.
G. Area calculator edge cases.
H. Deterministic merge and timestamp conflict policy.
I. Mocked Firebase login/logout/read/write/errors/offline queue/retry/restore.
J. Worker method/CORS/token/JSON/secret/size/rate-limit/upstream error/success tests.
K. PWA manifest, paths and cache behavior.
L. Mobile viewport overflow smoke test.
M. Accessibility labels, focus, keyboard and statuses.
Show test counts, failures and actual output. Fix all failures. Distinguish static/unit results from live browser/E2E tests not run.

## Phase 9 — deliverables and PR
Create in patwari-v4/:
- V4_3_AUDIT_REPORT.md
- V4_3_TEST_PLAN.md
- V4_3_RELEASE_NOTES.md
- tests/ automated tests
- dedicated CI workflow
- modular helper/service files when useful.
Update README and manifest to V4.3.
Add About/Diagnostics view showing version/build commit, local storage status, Firebase/auth status, last sync, Worker configured status, PWA/offline status, data backup/restore.
Preserve original app and routes.
Open a PR from patwari-v4.3-full-audit-upgrade to main. Include changes, test results, setup requirements and manual QA steps. Do not merge without user approval.

## Mandatory work protocol
1. Work ONLY on branch patwari-v4.3-full-audit-upgrade.
2. Re-fetch target file SHA immediately before each write.
3. Implement source fixes and test suite, not only documentation.
4. Fetch each changed file and verify after write.
5. Run syntax checks and automated tests in available runner. If browser/E2E execution unavailable, state this plainly.
6. Check the existing catalogue workflow impact in a safe temporary copy; do not commit unrelated generated files.
7. Review full diff for regressions/unintended files.
8. Create PR and return PR URL.
9. If secrets or Firebase console permissions are unavailable, list exact manual configuration needed.
10. Never claim an unrun test passed.

## Acceptance criteria
- Every existing app section and action stays accessible and functional.
- Zero stale legacy Firebase symbols in active code.
- Both Cloud Sync actions use same API and success only after remote write.
- Local save/recovery works offline; IndexedDB recovery available.
- Per-user cloud security intact, merge no data loss.
- Both AI entry points use same authenticated Worker service.
- No secrets shipped to browser.
- All scripts parse; controls and IDs verified.
- Unit/CI tests pass; unresolved high-risk defects are documented as blockers.
- Android/mobile usable; PWA cache safe.
- Version metadata consistent at V4.3.
- PR remains unmerged pending human review.