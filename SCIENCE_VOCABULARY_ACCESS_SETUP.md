# Science Vocabulary 500 — Firebase Access Control (Spark-compatible)

This version uses Firebase Authentication + Firestore + Security Rules. It does not require Cloud Functions, so it can be used on Spark for the supported Firebase products.

## 1. Create Firebase Web App
Firebase Console → Project settings → Your apps → Add Web App. Copy the config values into `firebase-config.js`. The config is public client config; never add service account keys.

## 2. Authentication
Authentication → Sign-in method → enable Google. Add `vishwendrasir.github.io` under Authorized domains.

## 3. Firestore
Create Firestore Database. Deploy `firestore.rules` in Firestore → Rules (or use Firebase CLI).

## 4. Bootstrap Admin (one-time)
Sign in to the app with your Google account, then copy your Firebase Auth UID from Authentication → Users.
Firestore → Data → create collection `admins`, document ID = your exact UID. Add fields:
- `role`: string `admin`
- `createdAt`: timestamp (current time)

Do not share or use another student's UID. Admin docs cannot be created from the app.

## 5. Deploy
If using Firebase CLI:
`firebase deploy --only firestore:rules`
Cloud Functions are not required for this Spark-compatible rules/transaction version.

## Access policy
- New Google users create a pending profile.
- Admin approves initial access with 50 attempts.
- Each question attempt is consumed using a Firestore transaction; rules require an approved profile and decrement by exactly one.
- At zero, the student is locked until an admin grants the next 50.
- Students may request the next batch; Admin approves/rejects in the dashboard.
- Attempts are read-only and cannot be edited/deleted by students.

## Notes
Question-attempt accounting is applied to Quiz answers, Rapid Fire answers, Spelling submissions, Matching pair checks, and completed Scramble submissions. Flashcard viewing/dictionary browsing is not counted as a question attempt.
