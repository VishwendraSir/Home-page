/* Copy to patwari-config.js and fill only public Firebase web config + Worker URL.
   Never put Gemini/API secrets here. Firebase web config is public; secure access with Firestore rules. */
window.PATWARI_CONFIG = {
  workerUrl: "https://YOUR-WORKER.workers.dev",
  firebase: {
    apiKey: "YOUR_FIREBASE_WEB_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  }
};
