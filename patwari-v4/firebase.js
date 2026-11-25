import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { initializeFirestore, getFirestore, persistentLocalCache, persistentSingleTabManager, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const KEY = "RPAA_V4_FIREBASE_CONFIG";
const PENDING_KEY = "RPAA_V4_PENDING_CLOUD_STATE";
const STATE_KEY = "RPAA_SEWAR_COMPLETE_HTML5_V1";
let app, auth, db, currentUser = null, saveTimer = null, restoring = false, initPromise = null, lastSavedJSON = "";

const valid = c => c && ["apiKey","authDomain","projectId","appId"].every(k =>
  typeof c[k] === "string" && c[k].trim().length > 5 && !/YOUR_|FAKE|EXAMPLE/i.test(c[k])
);
const DEFAULT_CONFIG = {
  apiKey: "AIzaSyCl8k1p2_r9Ejxu-KXYFHXOZxwLk5e6d6c",
  authDomain: "rajasthan-patwari-ai.firebaseapp.com",
  projectId: "rajasthan-patwari-ai",
  storageBucket: "rajasthan-patwari-ai.firebasestorage.app",
  messagingSenderId: "941057063249",
  appId: "1:941057063249:web:b38e7e09f32045d82e3b70",
  measurementId: "G-1X5JZJ1PKP"
};
function getSavedConfig(){ try { return JSON.parse(localStorage.getItem(KEY) || "null") || DEFAULT_CONFIG; } catch { return DEFAULT_CONFIG; } }
function emit(name, detail){ window.dispatchEvent(new CustomEvent(name,{detail})); }
function clone(v){ return JSON.parse(JSON.stringify(v)); }
function localState(){ return window.PatwariGetLocalState?.() || JSON.parse(localStorage.getItem(STATE_KEY)||"{}"); }
function mergeById(local, cloud) {
  const out = {...(cloud||{}), ...(local||{})};
  for (const k of ["land","mutations","crops","visits","tasks"]) {
    const map = new Map();
    (cloud?.[k]||[]).forEach(x=>map.set(String(x.id),x));
    (local?.[k]||[]).forEach(x=>{
      const id=String(x.id);
      if(!map.has(id)) map.set(id,x);
      else {
        const a=map.get(id), ta=Number(a.updatedAt||a.clientUpdatedAt||0), tb=Number(x.updatedAt||x.clientUpdatedAt||0);
        if(tb>ta) map.set(id,x);
      }
    });
    out[k]=Array.from(map.values());
  }
  out.audit=[...(cloud?.audit||[]),...(local?.audit||[])].filter((x,i,a)=>a.indexOf(x)===i).slice(-200);
  out.lang=local?.lang||cloud?.lang||"hi";
  out.dark=!!(local?.dark??cloud?.dark);
  return out;
}

async function init(c) {
  if (!valid(c)) return {ok:false, reason:"Firebase config incomplete."};
  if (initPromise) return initPromise;
  initPromise = (async()=>{
    try {
      const existing=getApps().find(a=>a.options.projectId===c.projectId);
      app=existing || initializeApp(c, "patwari-ai-"+c.projectId);
      auth=getAuth(app);
      try { await setPersistence(auth,browserLocalPersistence); } catch(e) { console.warn("Auth persistence fallback:",e); }
      try {
        db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentSingleTabManager()})});
      } catch(e) {
        // Another module/tab may have initialized Firestore already, or browser storage is unavailable.
        db=getFirestore(app);
        console.warn("Firestore persistent cache fallback:",e);
      }
      try { await getRedirectResult(auth); } catch(e) { emit("patwari-login-error",e.message||String(e)); }
      onAuthStateChanged(auth, async user=>{
        currentUser=user;
        emit("patwari-auth",{user:user?{uid:user.uid,email:user.email||""}:null});
        if(user) await restoreCloudForUser(user);
        else emit("patwari-cloud-status","Local Saved • Login to sync");
      });
      window.addEventListener("online",()=>flushPending().catch(e=>emit("patwari-cloud-status","Sync Failed: "+e.message)));
      return {ok:true};
    } catch(e) { initPromise=null; return {ok:false,reason:e.message||String(e)}; }
  })();
  return initPromise;
}

async function restoreCloudForUser(user) {
  if(!user||!db||restoring) return;
  restoring=true;
  emit("patwari-cloud-status","Restoring Cloud Data…");
  try {
    const ref=doc(db,"users",user.uid,"app_state","main");
    const snap=await getDoc(ref);
    const local=clone(localState()||{});
    if(snap.exists()) {
      const remote=snap.data();
      const merged=mergeById(local,remote.state||{});
      window.PatwariApplyCloudState?.(merged);
      // Persist merged state so local-only records migrate without deleting cloud records.
      await writeSnapshot(merged, user, true);
      emit("patwari-cloud-status","Cloud Restored • Local Backup");
    } else {
      // First sign-in: migrate the existing local data without clearing it.
      await writeSnapshot(local,user,true);
      emit("patwari-cloud-status","Local Data Migrated • Cloud Saved");
    }
    await flushPending();
  } catch(e) {
    emit("patwari-cloud-error",e.message||String(e));
    emit("patwari-cloud-status","Sync Failed • Local data retained");
  } finally { restoring=false; }
}

async function writeSnapshot(state,user=currentUser,force=false) {
  if(!user||!db) throw new Error("Google Login required");
  const ref=doc(db,"users",user.uid,"app_state","main");
  const snap=await getDoc(ref);
  let finalState=state;
  if(snap.exists()&&!force) finalState=mergeById(state,snap.data().state||{});
  const now=Date.now();
  const payload={ownerUid:user.uid,state:finalState,clientUpdatedAt:now,serverUpdatedAt:serverTimestamp(),schemaVersion:2};
  await setDoc(ref,payload);
  lastSavedJSON=JSON.stringify(finalState);
  return {ok:true};
}

async function saveStateNow(state) {
  if(!currentUser||!db||!state||restoring) return {ok:false,reason:"Login required or restore in progress"};
  emit("patwari-cloud-status","Syncing…");
  await writeSnapshot(clone(state));
  try{localStorage.removeItem(PENDING_KEY);}catch{}
  emit("patwari-cloud-status","Cloud Saved");
  return {ok:true};
}
function queueSave(state) {
  try { localStorage.setItem(STATE_KEY,JSON.stringify(state)); } catch(e) { console.warn("Local backup failed",e); }
  if(!currentUser||!db||restoring) { emit("patwari-cloud-status",navigator.onLine?"Local Saved • Login to sync":"Local Saved • Offline"); return; }
  const snapshot=clone(state);
  emit("patwari-cloud-status","Syncing…");
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    try { await saveStateNow(snapshot); }
    catch(e) {
      try { localStorage.setItem(PENDING_KEY,JSON.stringify(snapshot)); } catch{}
      emit("patwari-cloud-status","Sync Failed • Pending save retained");
      emit("patwari-cloud-error",e.message||String(e));
    }
  },500);
}
async function flushPending() {
  if(!currentUser||!db||!navigator.onLine) return;
  let pending=null;
  try{pending=JSON.parse(localStorage.getItem(PENDING_KEY)||"null");}catch{}
  if(pending){await saveStateNow(pending);}
}
async function saveAndConnectConfig(c) {
  if(!valid(c)) return {ok:false,reason:"apiKey, authDomain, projectId and appId are required."};
  localStorage.setItem(KEY,JSON.stringify(c));
  return init(c);
}
async function loginGoogle() {
  if(!auth) throw Error("Firebase not configured. पहले Save & Connect Firebase करें.");
  const p=new GoogleAuthProvider();
  p.setCustomParameters({prompt:"select_account"});
  await signInWithRedirect(auth,p);
}
async function logoutUser(){if(auth) await signOut(auth);}
async function getIdToken(){return currentUser?currentUser.getIdToken(): "";}
async function exportCloudBackup(){
  if(!currentUser||!db) throw Error("पहले Google Login करें");
  const snap=await getDoc(doc(db,"users",currentUser.uid,"app_state","main"));
  return snap.exists()?snap.data().state:null;
}

window.PatwariFirebase={
  isConfigured:()=>!!db,getCurrentUser:()=>currentUser,getSavedConfig,saveAndConnectConfig,loginGoogle,logoutUser,getIdToken,
  queueSave,saveStateNow,restoreCloud:()=>restoreCloudForUser(currentUser),flushPending,exportCloudBackup
};
const saved=getSavedConfig();
if(saved) init(saved);
