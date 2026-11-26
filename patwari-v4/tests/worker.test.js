import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";

const env = {
  ALLOWED_ORIGIN: "https://vishwendrasir.github.io",
  FIREBASE_WEB_API_KEY: "test-api-key",
  GEMINI_API_KEY: "test-gemini-key",
  GEMINI_MODEL: "mock-model"
};
const originalFetch = globalThis.fetch;
const responseJson = (payload,status=200)=>new Response(JSON.stringify(payload),{status,headers:{"Content-Type":"application/json"}});

test("Worker rejects disallowed preflight origins", async()=>{
  const res=await worker.fetch(new Request("https://worker.test",{method:"OPTIONS",headers:{Origin:"https://evil.test"}}),env);
  assert.equal(res.status,403);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"),null);
});
test("Worker permits approved preflight origin", async()=>{
  const res=await worker.fetch(new Request("https://worker.test",{method:"OPTIONS",headers:{Origin:env.ALLOWED_ORIGIN}}),env);
  assert.equal(res.status,204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"),env.ALLOWED_ORIGIN);
});
test("Worker rejects unsupported methods", async()=>{
  const res=await worker.fetch(new Request("https://worker.test",{method:"GET",headers:{Origin:env.ALLOWED_ORIGIN}}),env);
  assert.equal(res.status,405);
});
test("Worker rejects missing bearer token", async()=>{
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({prompt:"test"})}),env);
  assert.equal(res.status,401);
});
test("Worker rejects invalid token", async()=>{
  globalThis.fetch=async()=>responseJson({error:{message:"bad token"}},400);
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer bad","Content-Type":"application/json"},body:JSON.stringify({prompt:"test"})}),env);
  assert.equal(res.status,401);
});
test("Worker reports missing Gemini secret only after token validation", async()=>{
  const localEnv={...env,GEMINI_API_KEY:""};
  globalThis.fetch=async()=>responseJson({users:[{localId:"user-1"}]});
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},body:JSON.stringify({prompt:"test"})}),localEnv);
  assert.equal(res.status,503);
});
test("Worker rejects malformed JSON", async()=>{
  globalThis.fetch=async()=>responseJson({users:[{localId:"user-1"}]});
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},body:"{"}),env);
  assert.equal(res.status,400);
});
test("Worker rejects oversized prompt", async()=>{
  globalThis.fetch=async()=>responseJson({users:[{localId:"user-1"}]});
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},body:JSON.stringify({prompt:"x".repeat(6001)})}),env);
  assert.equal(res.status,413);
});
test("Worker returns Gemini draft on successful authenticated request", async()=>{
  let geminiCalled=false;
  globalThis.fetch=async(url,init)=>{
    if(String(url).includes("identitytoolkit")) return responseJson({users:[{localId:"user-2"}]});
    geminiCalled=true;
    return responseJson({candidates:[{content:{parts:[{text:"Draft response"}]}}]});
  };
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},body:JSON.stringify({prompt:"draft letter",taskType:"draft",language:"en"})}),env);
  const data=await res.json();
  assert.equal(res.status,200);
  assert.equal(geminiCalled,true);
  assert.equal(data.text,"Draft response");
  assert.match(data.disclaimer,/AI draft only/i);
});
test("Worker returns sanitized upstream failure", async()=>{
  globalThis.fetch=async(url,init)=>{
    if(String(url).includes("identitytoolkit")) return responseJson({users:[{localId:"user-3"}]});
    return responseJson({error:{message:"secret upstream details"}},500);
  };
  const res=await worker.fetch(new Request("https://worker.test",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},body:JSON.stringify({prompt:"test"})}),env);
  const data=await res.json();
  assert.equal(res.status,502);
  assert.equal(JSON.stringify(data).includes("secret upstream details"),false);
});
test.after(()=>{globalThis.fetch=originalFetch;});


test("Worker applies per-user request throttling",async()=>{
  globalThis.fetch=async(url,init)=>{
    if(String(url).includes("identitytoolkit")) return responseJson({users:[{localId:"rate-limit-user"}]});
    return responseJson({candidates:[{content:{parts:[{text:"ok"}]}}]});
  };
  let last;
  for(let i=0;i<21;i++){
    last=await worker.fetch(new Request("https://worker.test",{
      method:"POST",
      headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json","CF-Connecting-IP":"203.0.113.77"},
      body:JSON.stringify({prompt:"test"})
    }),env);
  }
  assert.equal(last.status,429);
});


test("Worker requests both Hindi and English when language is both",async()=>{
  let upstreamBody=null;
  globalThis.fetch=async(url,init)=>{
    if(String(url).includes("identitytoolkit")) return responseJson({users:[{localId:"bilingual-user"}]});
    upstreamBody=JSON.parse(init.body);
    return responseJson({candidates:[{content:{parts:[{text:"हिन्दी / English"}]}}]});
  };
  const res=await worker.fetch(new Request("https://worker.test",{
    method:"POST",
    headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer valid","Content-Type":"application/json"},
    body:JSON.stringify({prompt:"prepare bilingual note",language:"both"})
  }),env);
  assert.equal(res.status,200);
  assert.match(upstreamBody.systemInstruction.parts[0].text,/Hindi and English/);
});
