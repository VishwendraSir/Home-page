# Rajasthan Patwari AI Assistant v3.0

Live app: https://vishwendrasir.github.io/Home-page/Rajasthan_Patwari_AI_Assistant_Sewar_Complete.html

## Added in v3
- AI draft workspace (requires Worker URL and signed-in Firebase user token).
- Task calendar and monthly summary.
- Service worker and web manifest for installable offline shell.
- Owner-only starter Firestore rules and Cloudflare Worker sample.

## Firebase setup
1. Create Firebase project; enable Authentication and Firestore.
2. Publish firestore.rules.
3. Copy patwari-config.example.js to patwari-config.js and fill public Firebase web config and Worker URL.
4. This app remains local-first; Firebase sign-in/cloud sync client is not yet wired into the HTML. Do not assume records are cloud-synced.

## Cloudflare AI setup
1. Deploy patwari-worker.js as a Worker.
2. Set FIREBASE_PROJECT_ID and ALLOWED_ORIGIN=https://vishwendrasir.github.io.
3. Add GEMINI_API_KEY as a Worker secret (never put it in browser code or GitHub).
4. Optionally set GEMINI_MODEL; default gemini-2.5-flash.
5. Set workerUrl in patwari-config.js. Worker requires a valid Firebase ID token.

## Limits and safety
- No integration with Rajasthan government portals; no certified Jamabandi, Bhu-Naksha, mutation status or official orders are fetched.
- Firebase sign-in/cloud-sync UI is not yet implemented; the rules and Worker are deployment components only.
- GPS requires browser permission and secure context. Export JSON backups regularly.
- AI content is a draft. Verify facts, current laws, deadlines and formats with authoritative sources and competent officers.
- Use sample data during testing; do not enter Aadhaar, bank details, OTPs, passwords or unnecessary sensitive data.
