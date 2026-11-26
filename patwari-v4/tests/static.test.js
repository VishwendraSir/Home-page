import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const firebase=fs.readFileSync(path.join(root,"firebase.js"),"utf8");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"manifest.json"),"utf8"));
const sw=fs.readFileSync(path.join(root,"service-worker.js"),"utf8");
const worker=fs.readFileSync(path.join(root,"worker/index.js"),"utf8");
const handlers=[...html.matchAll(/\b(onclick|onchange|oninput|onsubmit)=["']([^"']+)["']/g)].map(m=>m[2]);
const declared=new Set([...html.matchAll(/(?:function|async function)\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]));
const globalHandlers=new Set(["v4Connect","v4GoogleLogin","v4Logout","v4AskAI","v4CloudSync"]);
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);

test("HTML IDs are unique",()=>assert.equal(ids.length,new Set(ids).size));
test("All inline-handler function names resolve to app functions or declared globals",()=>{
  const calls=handlers.flatMap(code=>[...code.matchAll(/(?:^|[;{}]\s*)([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]));
  const missing=[...new Set(calls)].filter(name=>!declared.has(name)&&!globalHandlers.has(name)&&!["alert","confirm","prompt","open","print","window","document"].includes(name));
  assert.deepEqual(missing,[]);
});
test("Legacy Firebase global APIs are absent",()=>{
  for(const bad of ["window.patwariSignIn","window.firebaseAuth","window.patwariCloudLoad","window.patwariCloudSave","PATWARI_CONFIG.workerUrl"]) assert.equal(html.includes(bad),false,bad);
});
test("Both AI panels share one authenticated request function",()=>{
  assert.match(html,/async function requestPatwariAI\(/);
  assert.match(html,/await requestPatwariAI\(/);
  assert.match(html,/getIdToken\(\)/);
});
test("IndexedDB recovery is present before clean first-run initialization",()=>{
  assert.match(html,/async function recoverIndexedDbState\(/);
  assert.match(html,/await recoverIndexedDbState\(\)/);
  assert.doesNotMatch(html,/DEMO-1|सैंपल खातेदार/);
});
test("CRUD records receive conflict timestamps",()=>{
  for(const name of ["saveLandRecord","saveMutation","saveCrop","saveVisit","saveTask"]) {
    const start=html.indexOf("function "+name+"(");
    assert.ok(start>=0,name+" exists");
    assert.match(html.slice(start,start+1800),/updatedAt/);
  }
});
test("Land search references the existing renderer",()=>{
  assert.match(html,/<input id="lrSearch" oninput="renderAll\(\)"/);
  assert.doesNotMatch(html,/oninput="renderLandTable\(\)"/);
});
test("V4.3 app, Firebase, manifest and worker cache versions agree",()=>{
  assert.match(html,/APP_VERSION = "4\.3\.0"/);
  assert.match(html,/firebase\.js\?v=4\.3\.0/);
  assert.match(manifest.name,/V4\.3/);
  assert.ok(manifest.icons?.some(icon=>icon.src==="./icon.svg"),"PWA icon must be registered");
  assert.match(sw,/icon\.svg/);
  assert.match(sw,/v43-audit/);
  assert.match(sw,/firebase\.js\?v=4\.3\.0/);
});
test("Service worker avoids caching private/auth routes and external APIs",()=>{
  assert.match(sw,/url\.origin !== self\.location\.origin/);
  assert.match(sw,/\/users\//);
  assert.match(sw,/\/auth\//);
});
test("Firestore rules remain owner-only",()=>{
  const rules=fs.readFileSync(path.join(root,"firestore.rules"),"utf8");
  assert.match(rules,/request\.auth\.uid == uid/);
  assert.match(rules,/request\.resource\.data\.ownerUid == uid/);
});
test("Worker bounds body and prompt sizes",()=>{
  assert.match(worker,/MAX_BODY_BYTES/);
  assert.match(worker,/MAX_PROMPT_CHARS/);
  assert.match(worker,/MAX_DOCUMENT_CHARS/);
});
test("Worker implements exact-origin CORS and token verification",()=>{
  assert.match(worker,/origin !== allowedOrigin/);
  assert.match(worker,/verifyFirebaseToken/);
  assert.match(worker,/Bearer/);
});
test("Worker returns draft disclaimer and never embeds a Gemini key",()=>{
  assert.match(worker,/AI draft only/);
  assert.doesNotMatch(worker,/AIzaSy[A-Za-z0-9_-]{20,}/);
});
test("No duplicate module import path or stale V4.2 cache versions",()=>{
  assert.equal((html.match(/import "\.\/firebase\.js\?v=4\.3\.0"/g)||[]).length,1);
  assert.doesNotMatch(sw,/v42-cloud-sync|firebase\.js\?v=4\.2/);
});


test("Inline JavaScript blocks parse without syntax errors",()=>{
  let count=0;
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    const attrs=match[1]||"";
    if(/\bsrc\s*=/.test(attrs)) continue;
    let code=match[2]||"";
    if(/\btype=["']module["']/.test(attrs)){
      code=code.replace(/^\s*import\s+[^;]+;\s*$/gm,"");
    }
    new vm.Script(code,{filename:"index.html:inline-script-"+(++count)});
  }
  assert.ok(count>0,"expected inline scripts to parse");
});
test("Static DOM selectors resolve to declared element IDs",()=>{
  const declared=new Set(ids);
  const references=[...html.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(m=>m[1]);
  const missing=[...new Set(references)].filter(id=>!declared.has(id));
  assert.deepEqual(missing,[]);
});
test("Firebase and service-worker JavaScript parse",()=>{
  const firebaseSource=firebase.replace(/^\s*import\s+[^;]+;\s*$/gm,"");
  new vm.Script(firebaseSource,{filename:"firebase.js"});
  new vm.Script(sw,{filename:"service-worker.js"});
  // Worker syntax is also checked by importing it in worker.test.js.
});


test("CSV export mitigates formula injection and record IDs are escaped",()=>{
  assert.ok(html.includes(String.raw`/^[\s\u0000-\u001F]*[=+\-@]/`));
  assert.doesNotMatch(html,/\$\{[rmcvt]\.id\}/);
});
test("Imported records are cloned and malformed entries are rejected",()=>{
  assert.match(html,/src\[key\]\.map\(item=>\(\{\.\.\.item\}\)\)/);
  assert.match(html,/Invalid record in/);
});
