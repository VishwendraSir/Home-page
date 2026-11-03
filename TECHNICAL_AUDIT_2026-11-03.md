# Science Centre Learning Hub — Technical Audit
**Audit date:** 3 November 2026  
**Repository:** https://github.com/VishwendraSir/Home-page  
**Branch:** main  
**Hosting:** GitHub Pages

## Verified repository checks
- Repository tree inspected: 41 files.
- Homepage `index.html`: 31 local `href`/`src` references checked against the repository tree; no missing local targets found.
- Student registration page: malformed root markup corrected and re-read from GitHub; the document now starts with a valid HTML root element.
- AI Tutor diagnostic page: removed the optional public CORS proxy. The page now posts only to the configured Science Centre Cloudflare Worker endpoint and validates the JSON question field. This reduces accidental third-party exposure; it does not prove the Worker itself is secure.
- Quiz Engine seed data: corrected the Hindi option typo in the multiplication sample and completed Hindi question/explanation text for the two English grammar seed samples.

## Quiz Engine data status
- 1,678 unique records in the embedded bank.
- 20 records marked approved; 1,658 remain pending review.
- 1,492 records are tagged MCQ; 1,485 have a structurally valid correct-option index.
- All 20 approved seed questions contain both Hindi and English question text.
- Pending records remain excluded from normal student quiz selection. Do not bulk-approve pending records without checking source, wording, options, answer key, and explanation.

## Known platform limitations — not represented as completed
- Firebase configuration/integration was not found in repository code search. Student accounts and cloud-synced progress are therefore not verified or active based on this repository.
- The Owner Dashboard is a local UI prototype, not secure owner authentication or server-side authorization.
- Premium labels/catalogue do not enforce paid access; no secure payment entitlement backend was found.
- The Cloudflare Worker source and settings are not in this repository. Its API key storage, CORS allowlist, authentication, rate limits, request validation, abuse controls, and logs cannot be audited from GitHub alone. Keep provider keys in Cloudflare Worker secrets, never in HTML.
- PWA offline behavior is cache-based. Only the app shell and pages already visited/cached can be available offline.
- Browser text-to-speech depends on voices installed on each device. No Android device-level audio test was performed in this audit.
- GitHub Pages deployment status must be confirmed in the linked Actions run; repository commits alone do not prove the newest deployment is live.

## Required external actions to finish the remaining platform work
1. Provide access to the Cloudflare Worker source/settings or export its source (remove all secret values first). Then review and harden Worker security.
2. Provide the Firebase project configuration and confirm the desired authentication providers and data model. Keep authorized Firebase web config separate from private service-account credentials; never expose service-account keys.
3. Decide the student data/privacy policy before enabling cloud accounts, analytics, or progress sync.
4. Test install, Hindi/English voices, quiz scoring, offline navigation, and form submission on a real Android phone.
5. Review the 1,658 pending questions against their original sources before promoting them to the student bank.

## Recent commits made during this audit
- Registration HTML root fix: `61c325e987f81204b5b8f3772cd4af6e655d8a59`
- AI Tutor diagnostic proxy removal: `0bb2860cc70250480ec8ffb9258078bda753d2f9`
- Diagnostic documentation update: `4ae9409e1601b93edca72d78b8240bf64067f8d5`
- Bilingual grammar sample corrections: `22ff0c4290248f58627d827b16fd275d57c925f2`
