import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const KEY = "RPAA_V4_FIREBASE_CONFIG";
const STATE_DOC = "app_state/main";
let app, auth, db, currentUser = null, saveTimer = null, restoring = false;

const valid = c => c && ["apiKey","authDomain","projectId","appId"].every(k =>
  typeof c[k] === "string" && c[k].trim().length > 5 && !/YOUR_|FAKE|EXAMPLE/i.test(c[k])
);
function getSavedConfig(){ try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } }

async function restoreCloudForUser(user) {
  if (!user || !db) return;
  restoring = true;
  try {
    const ref = doc(db, "users", user.uid, "app_state", "main");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.state && typeof data.state === "object") {
        window.PatwariApplyCloudState?.(data.state);
      }
    } else {
      // First cloud activation: preserve and upload this browser's existing local records.
      const local = window.PatwariGetLocalState?.();
      if (local) await saveStateNow(local);
    }
  } catch (e) {
    window.dispatchEvent(new CustomEvent("patwari-cloud-error", { detail: e.message || String(e) }));
  } finally {
    restoring = false;
  }
}

async function init(c) {
  if (!valid(c)) return {ok:false, reason:"Firebase config incomplete."};
  try {
    app = getApps().length ? getApps().find(a => a.options.projectId === c.projectId) || getApps()[0] : initializeApp(c);
    if (app.options.projectId !== c.projectId) app = initializeApp(c, "patwari-ai-" + c.projectId);
    auth = getAuth(app);
    db = getFirestore(app);
    try { await getRedirectResult(auth); } catch (e) {
      window.dispatchEvent(new CustomEvent("patwari-login-error", {detail:e.message}));
    }
    onAuthStateChanged(auth, async user => {
      currentUser = user;
      window.dispatchEvent(new CustomEvent("patwari-auth", {detail:{user:user?{uid:user.uid,email:user.email||""}:null}}));
      if (user) await restoreCloudForUser(user);
    });
    return {ok:true};
  } catch(e) { return {ok:false, reason:e.message}; }
}

async function saveStateNow(state) {
  if (!currentUser || !db || !state || restoring) return {ok:false,reason:"Login required"};
  const ref = doc(db, "users", currentUser.uid, "app_state", "main");
  await setDoc(ref, {
    ownerUid: currentUser.uid,
    state,
    clientUpdatedAt: Date.now(),
    serverUpdatedAt: serverTimestamp(),
    schemaVersion: 1
  }, {merge:true});
  window.dispatchEvent(new CustomEvent("patwari-cloud-status",{detail:"Cloud Saved"}));
  return {ok:true};
}
function queueSave(state) {
  if (!currentUser || !db || restoring) return;
  window.dispatchEvent(new CustomEvent("patwari-cloud-status",{detail:"Syncing"}));
  clearTimeout(saveTimer);
  const snapshot = JSON.parse(JSON.stringify(state));
  saveTimer = setTimeout(async () => {
    try { await saveStateNow(snapshot); }
    catch(e) {
      try { localStorage.setItem("RPAA_V4_PENDING_CLOUD_STATE", JSON.stringify(snapshot)); } catch {}
      window.dispatchEvent(new CustomEvent("patwari-cloud-status",{detail:"Sync Failed: "+(e.message||"Unknown error")}));
    }
  }, 700);
}
async function flushPending() {
  if (!currentUser || !navigator.onLine) return;
  let pending;
  try { pending = JSON.parse(localStorage.getItem("RPAA_V4_PENDING_CLOUD_STATE") || "null"); } catch {}
  if (pending) {
    await saveStateNow(pending);
    localStorage.removeItem("RPAA_V4_PENDING_CLOUD_STATE");
  }
}
async function saveAndConnectConfig(c) {
  if (!valid(c)) return {ok:false,reason:"apiKey, authDomain, projectId and appId are required."};
  localStorage.setItem(KEY,JSON.stringify(c));
  return init(c);
}
async function loginGoogle() {
  if (!auth) throw Error("Firebase not configured. पहले Save & Connect Firebase करें.");
  const p = new GoogleAuthProvider();
  p.setCustomParameters({prompt:"select_account"});
  await signInWithRedirect(auth,p);
}
async function logoutUser(){ if(auth) await signOut(auth); }
async function getIdToken(){ return currentUser ? currentUser.getIdToken() : ""; }

window.PatwariFirebase = {
  isConfigured:()=>!!db,
  getCurrentUser:()=>currentUser,
  getSavedConfig,
  saveAndConnectConfig,
  loginGoogle,
  logoutUser,
  getIdToken,
  queueSave,
  saveStateNow,
  restoreCloud:()=>restoreCloudForUser(currentUser),
  flushPending
};
window.addEventListener("online",()=>flushPending().catch(e=>console.warn(e)));
const saved=getSavedConfig();
if(saved) init(saved);
