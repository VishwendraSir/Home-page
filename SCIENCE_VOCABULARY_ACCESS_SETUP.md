# Science Vocabulary Master 500 — Student Approval + 50-question Access

This version uses Firebase Authentication + Firestore + Security Rules and is intended to work with Firebase's Spark-compatible products. It does **not** deploy Cloud Functions.

## A. Firebase project setup (phone-friendly)
1. Open Firebase Console → your project → Project settings → General.
2. Under **Your apps**, add a Web App. Register any app nickname.
3. Copy the Web App config values into `firebase-config.js` (apiKey, authDomain, projectId, appId). Do not use service-account/private keys.
4. Authentication → Sign-in method → enable **Google**.
5. Authentication → Settings → Authorized domains → add `vishwendrasir.github.io`.
6. Firestore Database → Create database. Choose a location and start in production mode.
7. Firestore → Rules: paste the contents of repository `firestore.rules` and Publish.

## B. Make yourself Admin (one-time)
1. Open the Vocabulary website and sign in with your Google account after Firebase config is set.
2. Firebase Console → Authentication → Users → select your account and copy the **UID**.
3. Firestore → Data → Start collection: `admins`.
4. Document ID: paste your exact UID.
5. Add fields: `role` (string) = `admin`; `createdAt` (timestamp) = current date/time.
6. Refresh the website and sign in again. Admin Dashboard should appear.

Admin documents cannot be created from the app. This is a deliberate security bootstrap step.

## C. Student access
- New verified Google users register as Pending.
- Admin approves with 50 attempts.
- Admin can reject, revoke, or grant the next 50.
- Student can request the next batch only after remaining attempts reaches 0.
- Admin can approve or reject batch requests.
- Quiz, Rapid Fire, Spelling, Matching, and completed Scramble submissions consume an attempt.
- Firestore transaction decrements the remaining count and writes an immutable attempt record with deterministic ID. Security Rules validate the decrement and prevent duplicate sequence records.
- Flashcards and dictionary browsing are not counted.

## D. Android deployment
- To update `firebase-config.js`: GitHub → repository → file → Edit (pencil) → replace placeholder config → Commit changes.
- To deploy Rules without CLI: Firebase Console → Firestore Database → Rules → paste `firestore.rules` → Publish.
- GitHub Pages deploys the updated HTML/config automatically after commits (wait a few minutes and refresh).

## E. Security and limitations
- Firestore rules protect profile status and attempt decrement; no Cloud Functions are needed for this version.
- The vocabulary content is static in a GitHub Pages HTML file, so a determined visitor can download/view the source. This access gate is not DRM/content secrecy.
- Admin is determined by the existence of `admins/{UID}`; never add a student's UID.
- Never commit service-account keys or private secrets.
