# AI Tutor setup — Science Centre Learning Hub + Manushree Wonder World

## What is included
- Both pages load the shared `ai-tutor-widget.js` UI.
- The Learning Hub receives a subject tutor.
- Manushree Wonder World receives a child-safe, age-appropriate learning buddy.
- The browser sends only a question to the existing Cloudflare Worker endpoint:
  `https://science-centre-ai-tutor.realclassesguruji.workers.dev/api/chat`
- No Gemini API key is embedded in HTML, JavaScript, or this repository.

## Required Cloudflare action (not automated from GitHub)
The Cloudflare account/Worker editor is not connected to this workspace, and the Worker source is not present in this repository. Therefore the Worker secret cannot be created or verified here.

In Cloudflare Dashboard:
1. Open Workers & Pages → `science-centre-ai-tutor` → Settings → Variables and Secrets.
2. Add a **Secret** named `GEMINI_API_KEY` and paste a newly generated Gemini API key.
3. Ensure the Worker accepts POST `/api/chat` with JSON `{"question":"..." }`.
4. Configure CORS to allow the exact published origin `https://vishwendrasir.github.io` (and no wildcard for credentialed requests).
5. Keep input limits, rate limits, and upstream error handling enabled.
6. Save/deploy the Worker.

## Important key hygiene
- The Firebase-generated `Browser key (auto created by Firebase)` is not the Gemini key. Leave it dedicated to Firebase.
- Do not paste API keys into GitHub, public HTML, browser JavaScript, screenshots, or chat.
- A key previously shared in chat should be rotated/replaced before production use.
- Keep Google Maps credentials separate from Firebase and Gemini credentials.

## Verification
1. Open `https://vishwendrasir.github.io/Home-page/worker-test.html`.
2. Send the default harmless arithmetic test.
3. Confirm an HTTP 200 response and a readable answer.
4. Test the floating tutor on the Learning Hub homepage and Manushree Wonder World page.
5. If the test fails with a CORS error, fix the Worker allow-list; if it returns 401/403/5xx, inspect the Worker secret and upstream error logs.

## Current limitation
GitHub changes can be prepared here, but no Cloudflare account/Worker deployment tool is connected. The frontend integration is not considered live-verified until the POST test succeeds from the published GitHub Pages origin.
