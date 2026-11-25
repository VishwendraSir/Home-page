import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,deleteDoc,collection,query,where,getDocs,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const KEY="RPAA_V4_FIREBASE_CONFIG";
const COLLECTIONS=["land_records","khasra_records","khata_records","mutation_records","girdawari_records","farmer_records","field_diary","revenue_reports","tasks","audit_logs"];
let app,auth,db,user=null,role="patwari";
const valid=c=>c&&["apiKey","authDomain","projectId","appId"].every(k=>typeof c[k]==="string"&&c[k].trim().length>5&&!/YOUR_|FAKE|EXAMPLE/i.test(c[k]));
async function init(c){if(!valid(c))return {ok:false,reason:"Firebase config incomplete."};try{app=getApps().length?getApps()[0]:initializeApp(c);auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,async u=>{user=u;role="patwari";if(u){try{const s=await getDoc(doc(db,"users",u.uid));if(s.exists()&&s.data().role==="admin")role="admin";else if(!s.exists())await setDoc(doc(db,"users",u.uid),{uid:u.uid,email:u.email||"",role:"patwari",designation:"Patwari",posting:"Sewar",district:"Bharatpur",state:"Rajasthan",updatedAt:serverTimestamp()});}catch(e){} }window.onPatwariAuthChange?.({configured:true,user:user?{uid:user.uid,email:user.email||""}:null,role});});return {ok:true};}catch(e){return {ok:false,reason:e.message};}}
function getSavedConfig(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}}
async function saveAndConnectConfig(c){if(!valid(c))return {ok:false,reason:"apiKey, authDomain, projectId and appId are required."};localStorage.setItem(KEY,JSON.stringify(c));return init(c)}
async function loginGoogle(){if(!auth)throw Error("Firebase not configured.");return (await signInWithPopup(auth,new GoogleAuthProvider())).user}
async function logoutUser(){if(auth)await signOut(auth)}
async function getIdToken(){return user?user.getIdToken(): ""}
function check(col,id){if(!COLLECTIONS.includes(col))throw Error("Unsupported collection");if(!id||String(id).length>120)throw Error("Valid record id required")}
async function upsertRecord(col,record){if(!user||!db)return {ok:false,reason:"Login required"};check(col,record?.id);const ref=doc(db,col,user.uid+"_"+record.id);await setDoc(ref,{...record,ownerUid:user.uid,clientUpdatedAt:Date.now(),serverUpdatedAt:serverTimestamp()},{merge:true});return {ok:true}}
async function fetchUserCollection(col){if(!user||!db)return {ok:false,items:[]};if(!COLLECTIONS.includes(col))throw Error("Unsupported collection");const q=role==="admin"?collection(db,col):query(collection(db,col),where("ownerUid","==",user.uid));const s=await getDocs(q);return {ok:true,items:s.docs.map(d=>d.data())}}
async function removeRemoteRecord(col,id){if(!user||!db)return {ok:false};check(col,id);await deleteDoc(doc(db,col,user.uid+"_"+id));return {ok:true}}
window.PatwariFirebase={COLLECTIONS,isConfigured:()=>!!db,getCurrentUser:()=>user,getCurrentRole:()=>role,getSavedConfig,saveAndConnectConfig,loginGoogle,logoutUser,getIdToken,upsertRecord,fetchUserCollection,removeRemoteRecord};
const saved=getSavedConfig();if(saved)init(saved);