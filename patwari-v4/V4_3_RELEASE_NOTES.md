# V4.3 Release Notes — Candidate

- Unified Firebase auth/cloud UI with the modular `PatwariFirebase` API.
- Unified AI request flow across both panels; supports Hindi, English and bilingual prompts.
- Added IndexedDB recovery and a clean blank first-run workspace.
- Added record validation, merge timestamps and safe imported-state normalization.
- Improved JSON restore backup/rollback, CSV formula protection, area calculator validation and backdrop upload validation.
- Prevented duplicate conflict records for identical cloud values; guarded Firestore document size.
- Hardened Worker CORS, Firebase token gating, input limits, request throttling, timeouts and sanitized upstream errors.
- Added PWA icon and updated shell cache.

This is a candidate branch, not yet merged or published. CI results, live Firebase/Gemini tests and Android/browser QA must be reviewed before release.
