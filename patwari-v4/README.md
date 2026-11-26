# Rajasthan Patwari AI Assistant V4.2

## Cloud sync and backup
- Local Storage and IndexedDB remain enabled as device backups.
- Google sign-in loads the per-user Firestore snapshot at `users/{uid}/app_state/main`.
- First sign-in migrates the existing local state when no cloud snapshot exists.
- App changes queue debounced cloud saves while signed in.
- Failed saves are retained in `RPAA_V4_PENDING_CLOUD_STATE` and retried when connectivity returns.
- Manual **Cloud Sync** and **Sync Data** both use the same Firebase save/restore layer.
- Firestore writes are serialized to prevent an older autosave from overwriting a newer manual sync.
- Restore merges records by stable IDs and persists the merged result to Local Storage and IndexedDB.
- Restore releases its lock before flushing the offline queue.
- Existing app sections and offline workflows are retained.

## Firebase setup
1. In Firebase Authentication, enable the Google provider.
2. Add `vishwendrasir.github.io` to Authentication > Settings > Authorized domains.
3. Create a Firestore database.
4. Publish the full contents of `firestore.rules` in Firestore > Rules.
5. Open the app's Firebase panel and enter the Firebase Web App config.
6. Never put Gemini API keys or service-account credentials in HTML or GitHub.
7. In Firestore, verify that signed-in data appears at `users/{uid}/app_state/main`.

## Verification checklist
- Sign in and confirm the email appears in the status.
- Add a clearly labelled test record and wait for **Cloud Saved**.
- Confirm the document `users/{uid}/app_state/main` exists in Firestore.
- Refresh the page and confirm the record returns.
- Open the same account on a second device and confirm the record is restored.
- Test offline: make a test edit, reconnect, and wait for **Cloud Saved**.
- Confirm the local record remains available if Firebase is unavailable.

## Important limitations
- This app stores one snapshot per Firebase user; do not share one login between staff.
- A browser-only app cannot guarantee background sync after it has been fully closed.
- The app is an office-workflow and draft assistant, not a certified Rajasthan government portal or source of official land records.
- AI-generated drafts must be checked against official records and current departmental instructions.
