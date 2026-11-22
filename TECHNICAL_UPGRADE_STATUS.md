# Science Centre Learning Hub — Technical Upgrade Status

**Audit date:** 3 November 2026  
**Repository:** `VishwendraSir/Home-page`  
**Branch:** `main`

## Completed in this upgrade

- Added PWA manifest, SVG app icon, service worker, and offline fallback page.
- Added an install-app prompt to the homepage and registered the service worker.
- Added a homepage section linking the Smart Quiz Engine, Offline/Online Test Generator, and AI Tutor diagnostics.
- Corrected stale resource links and the Sri Ganganagar quiz label.
- Repaired the Vishwa Tech dashboard's root navigation.
- Reworked `worker-test.html` to test the Worker health and chat endpoints directly. Removed the public CORS proxy to avoid routing student questions and responses through an unrelated third party.
- Added English question/option/explanation text to the 20 seed questions in the Smart Quiz Engine and corrected the malformed Hindi option in the 12 × 8 question.
- Repaired six uniquely identifiable answer indexes in pending Quiz Engine records. These records remain pending and are not promoted to student tests.

## Current data quality

### Smart Quiz Engine

- 1,678 total records.
- 20 approved MCQs.
- 1,658 pending review.
- 7 MCQs initially had an invalid answer index; six were repaired by matching a unique answer to an option.
- One record remains unresolved because the answer `50` appears twice among its options. It remains pending.
- No duplicate question IDs found.
- The 20 approved seed questions now have English question text, options, and explanations. This is a content pass, not a full chapter-by-chapter syllabus audit.

### Offline/Online Test Generator

- 2,444 embedded question records, including 2,203 MCQs.
- The 2,203 MCQs have answer values present among their options in the current data check.
- All 2,444 records are marked `verified: false`; none should be described as fully curriculum-verified.
- Repeated question text exists across grade-level records. These have not been auto-deleted because some repetitions may be intentional reinforcement across classes.
- The embedded data itself states that it is not yet a fully chapter-verified 50,000-question bank.

## AI Tutor / security status

- Public `GET /api/health` responded with HTTP 200 and reported service `science-centre-ai-tutor`, model `gemini-2.5-flash`.
- A GET request to `/api/chat` returned 404 and listed the supported routes. This is expected for a POST-only chat endpoint.
- The revised diagnostics page can test `POST /api/chat` from the browser; that POST has not yet been verified from the GitHub Pages origin.
- The Worker source is not present in this repository and no Cloudflare account/Worker editor is connected here. Therefore API-secret storage, CORS allow-list, rate limiting, input limits, and upstream error handling cannot yet be audited.
- Repository search found no Firebase SDK/config/auth implementation. Firebase Authentication is not currently integrated in the inspected repository. Do not put Firebase admin credentials or Gemini keys in public HTML.

## Remaining work

1. Obtain the Cloudflare Worker source/export or authorized Worker editor access to complete the security audit.
2. Run the POST chat test from the published diagnostics page and verify CORS for `https://vishwendrasir.github.io`.
3. Decide the review workflow for the 1,658 pending Quiz Engine records and the 2,444 unverified Test Generator records.
4. Test install/offline behavior, audio voices, quiz scoring, and large pages on a real Android device.
5. Review duplicate filename copies before deleting any, because external links may depend on them.

**Important:** GitHub Actions deployment success does not replace a real Android/browser runtime test.