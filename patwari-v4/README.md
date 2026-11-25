# Rajasthan Patwari AI Assistant V4.0
## Deploy
1. Firebase Console में Web App बनाएं; Authentication में Google provider enable करें; Firestore Database बनाएं.
2. इस app को GitHub Pages पर खोलें और Firebase Web App config के चार fields panel में भरें. यह config केवल उसी browser के localStorage में रहती है.
3. Firestore Rules को firestore.rules से publish करें.
4. Cloudflare Worker deploy करें: `npm install -g wrangler`, फिर repo folder में `wrangler deploy`.
5. Secrets: `wrangler secret put GEMINI_API_KEY` और `wrangler secret put FIREBASE_WEB_API_KEY`. API keys को source code में न रखें.
6. Worker URL को app panel में भरें. ALLOWED_ORIGIN को exact GitHub Pages origin पर रखें.
## Security / limits
- Firebase ID token is verified server-side through Identity Toolkit before Gemini access.
- Admin role must be assigned manually in Firestore Console to a trusted user; never let users self-promote.
- The in-memory Worker rate limiter is best-effort per isolate, not a global quota. Use Cloudflare rate limiting/Durable Objects for production enforcement.
- Firebase Web API key is a browser identifier, not a private credential; Gemini key is secret.
- Existing V3 local data/features are retained in this V4 page; V4 cloud CRUD helpers are exposed as window.PatwariFirebase APIs, but automatic migration/background merge is not enabled.
- No Rajasthan government portal integration, certified Jamabandi lookup, or official legal advice.
