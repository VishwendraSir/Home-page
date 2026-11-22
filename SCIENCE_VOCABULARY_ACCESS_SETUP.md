# Science Vocabulary Master 500 ProMax — Secure Access Setup

The static app requires Firebase for secure Gmail authentication, admin approval and enforceable 50-question batches.

## One-time deployment
1. Create a Firebase project and a Web App.
2. Enable Authentication → Google. Add `vishwendrasir.github.io` as an authorized domain.
3. Create Firestore.
4. Copy the Web App config into `firebase-config.js`. This web config is public; never commit service-account JSON/private keys.
5. Sign in once, copy your Firebase Auth UID from Authentication → Users, then replace `REPLACE_WITH_ADMIN_UID` in both `firestore.rules` and `functions/index.js`.
6. Install Firebase CLI; from the repository root run `firebase deploy --only firestore:rules,functions` (install `functions` dependencies with `npm install` first).
7. Configure and deploy the matching modular Firebase Web SDK integration in the app before removing the fail-closed setup gate.

## Policy
- Google sign-in with verified email.
- New student creates a pending request.
- Only the configured admin UID can approve/reject/revoke students.
- Each approval/grant authorizes 50 server-counted attempts.
- Attempts are decremented transactionally by Cloud Function; Firestore client writes are denied.
- At zero remaining, practice is blocked until admin grants another 50.
- Admin operations are callable Cloud Functions, not client-side password checks.

## Status
The committed HTML gate is fail-closed and remains locked until Firebase client integration, project config, Admin UID and deployed backend are complete. Adding files to GitHub does not itself create/configure a Firebase project or grant Firebase permissions.
