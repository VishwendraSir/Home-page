import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const cfg=window.PATWARI_CONFIG?.firebase;
const ready=cfg && cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId;
if(ready){
 const app=initializeApp(cfg), auth=getAuth(app), db=getFirestore(app);
 window.firebaseAuth=auth;
 window.patwariSignIn=async()=>signInWithPopup(auth,new GoogleAuthProvider());
 window.patwariSignOut=()=>signOut(auth);
 window.patwariCloudSave=async data=>{if(!auth.currentUser)throw new Error("पहले sign in करें");await setDoc(doc(db,"users",auth.currentUser.uid,"appdata","main"),{data,updatedAt:serverTimestamp()});};
 window.patwariCloudLoad=async()=>{if(!auth.currentUser)throw new Error("पहले sign in करें");const s=await getDoc(doc(db,"users",auth.currentUser.uid,"appdata","main"));return s.exists()?s.data().data:null;};
 onAuthStateChanged(auth,u=>{window.dispatchEvent(new CustomEvent("patwari-auth",{detail:{user:u?{email:u.email,uid:u.uid}:null}}));});
}else{
 window.patwariSignIn=async()=>{throw new Error("पहले patwari-config.js में Firebase Web App config भरें");};
 window.patwariSignOut=async()=>{};
 window.patwariCloudSave=async()=>{throw new Error("Firebase config उपलब्ध नहीं");};
 window.patwariCloudLoad=async()=>{throw new Error("Firebase config उपलब्ध नहीं");};
}