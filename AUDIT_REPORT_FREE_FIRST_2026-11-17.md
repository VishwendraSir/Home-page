# Science Centre Learning Hub — Free-first Technical Audit
Date: 17 November 2026
Repository: VishwendraSir/Home-page (public, default branch: main)

## Scope checked
- `index.html` (homepage)
- `manifest.webmanifest`
- `EXAM_POWER_HUB.html`
- `question-bank.html`
- `Navodaya.html` redirect and `Science_Centre_Learning_Hub_Complete_JNVST_Concept_App_v25.html`
- `CET_Antim_Prahar_2026_27/index.html`
- `Apna_Basket.html`

This is a source-code review of the files above, not a full browser/device, Firebase-rules, or production transaction test. No paid services were added and no existing app files were changed during this audit.

## Findings

### P0 — verify before accepting real orders
1. Apna Basket writes cloud orders from the browser using Firebase client SDK. The source checks the signed-in user and contains an admin UID verification flow, but client-side checks are not a security boundary. Firestore Security Rules must independently enforce customer ownership, allowed fields/status transitions, and admin-only approval. The rules and live Firebase project were not available in this repository review, so order security is **not yet verified**.
2. The order flow catches cloud-save failure and continues with a WhatsApp order. This is a useful fallback, but the customer/admin UI must clearly distinguish a cloud-saved order from a WhatsApp-only order to prevent false assumptions about tracking.

### P1 — reliability and navigation
1. Homepage registers `./sw.js` for service-worker support. The file `service-worker.js` was not found at repository root; confirm whether `sw.js` exists and whether its cache list includes the current app paths. Offline support is not confirmed from the manifest alone.
2. EXAM POWER HUB labels SSC/Railway/Army, Sainik/Navodaya, GK, Maths/Reasoning and Hindi/English sections as upcoming. Do not advertise these as available until real destination pages/question banks are connected.
3. CET app currently labels itself a preliminary PDF-based version and explicitly flags several topics for verification. Its daily live update/Firebase/Cloudflare automation is not implemented or proven by the inspected file.
4. The Navodaya redirect page forwards to the V25 JNVST app. The target file is very large (~658 KB); test first load, low-memory Android devices, touch targets, and offline reopening on real devices before further feature additions.

### P2 — maintainability and usability
1. Homepage CSS contains multiple successive theme/style override blocks. Consolidate only after visual regression testing; avoid changing its current design blindly.
2. Several apps are standalone HTML pages with inline JavaScript. Add a repeatable validation checklist (HTML parse, broken internal links, console errors, mobile viewport, offline reload) before publishing each update.
3. Homepage social links and manifest are present in source. Their live rendering and installability still need a browser/device check.

## Recommended free-first sequence
1. Audit and verify Firestore Security Rules for Apna Basket; run test customer/admin scenarios using Firebase Emulator Suite where possible.
2. Check homepage internal links and confirm `sw.js` + offline cache behavior.
3. Run mobile/touch regression on Navodaya and CET; fix only reproducible issues.
4. Update EXAM POWER HUB cards so every visible “available” card opens a real, tested resource.
5. Add GitHub Actions for static checks (HTML/link validation) if repository permissions and free GitHub Actions quota allow.

## Not included / not claimed
- No live Firebase credentials, deployed Firestore Rules, Cloudflare Worker, cron, or production order database was inspected.
- No live Pages deployment or Android browser session was executed.
- No automatic current-affairs feed is active based on this review.
- No paid plan or paid API is required for the recommended first steps.
