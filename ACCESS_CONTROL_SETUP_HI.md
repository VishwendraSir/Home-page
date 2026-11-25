# Existing Firebase Project — Owner Lock System Setup

## Existing project reused (no new project created)
- Firebase Project ID: `science-centre-learninghub-500`
- Web App ID: `1:81470212445:web:b1a84f4a187bc3e38040b4`
- Firestore database: `(default)`
- Previously recorded Firestore region: `asia-south2` (Delhi)
- Existing web config is already stored in repository root `firebase-config.js`; dashboard imports this file.
- Existing admin authorization model: Firebase Auth custom claim `admin: true`. No new `admins/{uid}` collection is required.

## What the repository now contains
- `owner-dashboard.html`: Owner login, Master switch, individual Page switches, Module switches, and audit log.
- `firestore.rules`: owner-only switch writes and server-side access checks for `protectedContent` / `courseContent`; existing SCLH collections are retained.
- `site-lock.js`: browser-side page/module display gate.
- `firebase.json`: already maps Firestore rules to `firestore.rules`.

## Apply rules to the already-existing Firebase project
1. Open https://console.firebase.google.com/project/science-centre-learninghub-500/firestore/rules
2. Review and publish the repository's `firestore.rules` for this same project.
3. Do not create a new Firebase project or replace the existing web app config.
4. The Owner account must already have the custom claim `admin: true`. The dashboard checks this same claim. Custom claims can only be granted securely by trusted Firebase Admin SDK code; never set them from browser JavaScript.
5. Open https://vishwendrasir.github.io/Home-page/owner-dashboard.html and sign in with that existing Owner account.

## Important behavior
- Master OFF blocks reads from the protected Firestore content collections.
- A Page must be ON and its Module must be ON for protected Firestore documents to be readable by normal signed-in users.
- Owner with `admin: true` can manage switches and read protected data.
- Add sensitive content to `protectedContent` or `courseContent` with string fields `pageId` and `moduleId` matching the dashboard's IDs.
- Existing published materials/quizzes, users, results, progress, student practice, attempts, batch requests and videos collection rules remain in the rules file.

## Static file security limit
GitHub Pages HTML, JavaScript, images and PDFs remain publicly retrievable by direct URL. The browser gate is not a security boundary. Only Firestore data access is enforced server-side by these rules. For actual private page/file delivery, move the protected bytes behind authenticated Firebase Hosting + Cloud Functions/Cloud Run (or another authenticated server/proxy). Do not put paid answer keys or private files in the public GitHub repository.
