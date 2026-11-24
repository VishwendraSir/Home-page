# Wonder World India — Upgrade Audit
Date: 2026-11-24
Repository: VishwendraSir/Home-page
Base branch: main
Audit branch: wonderworld-upgrade-2026-11-24
Base commit: 0b60bfa04ccac8afc5155552f3da20a961a5109c

## Scope and safety
- Read-only inspection of the main branch and its recursive Git tree (223 entries).
- No source files were modified or deleted on main.
- This branch is a safe workspace for the next upgrade steps.
- No duplicate or empty HTML file is deleted in this audit.

## Verified findings

### 1. Exact duplicate content
These three paths have the same Git blob SHA `9f34fd92f538fb10170e035b47ad43217ff4b494` and are byte-identical:
- `index.html` (root)
- `wonderworld/index.html`
- `backups/wonderworld-v3.7-prelaunch-index.html`

The root index is a 343 KB HTML document titled “WONDER WORLD – BHARAT LEARNING NETWORK”. The nested path and backup are exact copies, not independent implementations. Keep all three until inbound links, deployment path expectations, and backup-retention requirements are checked.

### 2. Empty V3.7 module files
These tracked HTML files are zero bytes and share the empty-blob SHA:
- `Manushree_Candy_Garden_V3_7.html`
- `Ram_Dino_Space_Quest_V3_7.html`
- `Shree_Ocean_Discovery_V3_7.html`

They are not working modules in their current repository state. Do not remove or overwrite them until their intended source files are recovered and references are checked. The repository also contains `Manushree_WonderWorld_Smart_Learning_Hub.html` (227 KB), which is a separate non-empty candidate and must be treated as a distinct module unless its relationship is proven.

### 3. Other Wonder World-related assets
- `Manushree_WonderWorld_Admin.html` exists (about 3.7 KB); it calls a configurable Cloudflare Worker API and requires an admin token.
- `Manushree_WonderWorld_Header_Preview.html` exists (about 11.3 KB) and explicitly labels itself as a preview; it is not proof that the live page uses that header.
- `manushree-membership-worker.js` exists (about 4 KB); its comments require a Cloudflare KV binding named `MEMBERSHIPS` and an `ADMIN_TOKEN` secret. Actual deployment bindings and secrets cannot be verified from repository source.
- `wonder-world-dp.svg` exists and is referenced by the root HTML.

### 4. PWA dependency check
The root `sw.js` precache shell references:
- `./`
- `./index.html`
- `./offline.html`
- `./manifest.webmanifest`
- `./icon.svg`
- `./voice-studio.html`

All six paths are present in the repository tree. This confirms path presence, not runtime/offline correctness on a device.

### 5. Documentation/configuration mismatch
- `README.txt` describes the Science Centre Learning Hub as the main site and says no Firebase configuration/integration was found.
- The repository currently contains `firebase-config.js`, and the root HTML contains Firebase-related code/strings. This needs reconciliation before documenting authentication, sync, or payment as operational.
- The Firebase web config file is client-side configuration, not proof of secure Firebase rules or enabled services. Review Firebase rules and console settings separately; never put service-account credentials or private keys in this repository.

### 6. Homepage ambiguity
- `HomeIndex.html` is a separate “Rajasthan District Dig-Darshan | HomeIndex” page, not the root Wonder World launcher.
- Root `index.html` and `wonderworld/index.html` are identical. The canonical live entry point is therefore likely the root `index.html`, but deployment settings and external links should be confirmed before changing routing.

## Recommended upgrade order
1. Recover the three zero-byte V3.7 module sources from the intended source artifacts.
2. Build an inbound-reference map for each candidate duplicate before deciding whether to keep, redirect, or retire it.
3. Reconcile the root launcher, nested `wonderworld/` route, and backup policy.
4. Test each module's relative asset paths, script dependencies, Firebase calls, Worker endpoints, and mobile layout.
5. Validate PWA install/offline behavior and service-worker cache invalidation on a test deployment.
6. Only after all checks pass, prepare a reviewed pull request; do not delete source files as part of the initial repair.

## Not verified by this repository-only audit
- Cloudflare Worker live deployment, KV binding, secrets, CORS, or production API health.
- Firebase security rules, authentication providers, storage rules, or billing status.
- Browser/device runtime behavior and GitHub Pages deployment status.
- Availability of original sources for the three zero-byte V3.7 files.


## Recovery update — 2026-11-24
The user supplied the original V3.7 source files. The following paths were restored on the audit branch:
- `Manushree_Candy_Garden_V3_7.html` — non-empty, direct-starts the Manushree profile.
- `Shree_Ocean_Discovery_V3_7.html` — non-empty, direct-starts the Shree profile.
- `Ram_Dino_Space_Quest_V3_7.html` — non-empty, direct-starts the Ram profile.
- `WonderWorld_V3_7_Launcher.html` — recovered 3-profile launcher stored separately; it does not replace the current root homepage.
- `WONDERWORLD_V3_7_README.txt` — recovered release guide stored under a new name to avoid overwriting repository documentation.

### Preservation and verification
- The existing root `index.html` was not changed; it remains the 358 KB Bharat Learning Network homepage.
- No files were deleted.
- The three direct modules were verified non-empty after commit, with the expected titles and profile-specific startup calls.
- The separate launcher was verified non-empty and retains the three-profile selector.
- The three modules share the same core implementation; the intentional differences are their document titles and startup profile.
- External runtime dependencies in the recovered HTML include Tailwind CDN and Google Fonts. The files are not fully offline/self-contained as uploaded.
- GitHub content fetch confirmed all restored files exist on the audit branch. A real browser/device test and GitHub Pages deployment test remain pending.

## Current audit-branch outcome
The recovered V3.7 modules are restored without replacing the working live homepage or deleting any existing path. Review and runtime testing should precede any merge to `main`.


## Static validation pass — 2026-11-24
The four supplied HTML documents were checked locally with an HTML parser and Node.js syntax validation:
- index.html, Manushree_Candy_Garden_V3_7.html, Shree_Ocean_Discovery_V3_7.html, and Ram_Dino_Space_Quest_V3_7.html all parsed without parser exceptions.
- Each document contains 81 unique HTML IDs; no duplicate IDs were detected.
- Inline JavaScript passed node --check validation in all four documents (zero syntax errors).
- No missing local href/src file references were detected relative to the supplied files.
- No broken same-page #anchor links were detected.
- The recovered files load Tailwind from https://cdn.tailwindcss.com. A browser network connection is therefore needed for that dependency; full offline operation is not established.
- This is static validation only. It does not prove that buttons, audio, profile persistence, Firebase/Worker requests, responsive layout, or all 80 activities behave correctly in a browser/device.

### Next test gate
1. Run browser-based smoke tests for each profile and the 3-profile launcher.
2. Exercise navigation, all activity entry points, audio controls, progress persistence, and reload behavior.
3. Check mobile viewport and keyboard/touch interactions.
4. Only then decide whether a deployment preview or pull request is appropriate. Keep main and live Pages unchanged until reviewed.
