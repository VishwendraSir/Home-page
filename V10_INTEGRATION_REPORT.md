# v10 Integration Report

## Added in v10
- `modules/data-entry.html` — central learning content entry; local JSON/CSV backup and optional Cloudflare KV sync.
- `modules/kg-portal.html` — KG learning pathway.
- `modules/class-1-2-portal.html` — Class 1–2 learning pathway.
- `modules/class-3-5-entrance-portal.html` — Class 3–5 and entrance preparation pathway.
- `modules/voice-room.html` — browser text-to-speech controls.
- `modules/portal-workshop.html` — HTML editor, preview, and configured Worker/GitHub publishing interface.
- `modules/portal-content-manager.html` — owner guide.
- `docs/GITHUB_UPLOAD_GUIDE_HI.txt` — supplied deployment guide.

The supplied files were added as distinct pages. The master homepage now links to all seven new HTML pages. The previous homepage and existing modules were retained.

## Validation
- Master homepage now lists 25 departments.
- All 25 homepage module targets exist in the package.
- ZIP archive integrity was checked after creation.
- The supplied portal pages reference two local files that were not included in this upload:
  - `question-bank-central.html`
  - `practice-slide-player.html`
  These links are preserved as supplied; they will not work until those dependencies are added or deliberately mapped to approved alternatives.

## Deployment and security status
- This package has not been published to GitHub Pages.
- The guide describes a Cloudflare Worker setup, but `cloudflare-worker.js` was not included in this upload. Shared cloud sync and automatic GitHub publishing therefore remain unconfigured.
- Do not place `ADMIN_KEY` or `GITHUB_TOKEN` in HTML, GitHub public files, screenshots, or chat. Configure secrets only in Cloudflare Worker settings.
- The guide's live-site check is dated 27 October 2026; it is historical evidence, not a fresh live verification.
