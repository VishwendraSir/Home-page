/**
 * Manushree WonderWorld Membership API
 * Cloudflare Worker: Bind KV namespace as MEMBERSHIPS; set secret ADMIN_TOKEN.
 */
const ORIGIN="https://vishwendrasir.github.io";
const cors={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","Content-Type":"application/json","Vary":"Origin"};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:cors});
const uid=()=>crypto.randomUUID();
const admin=req=>req.headers.get("Authorization")==="Bearer "+(globalThis.__token||"");
export default {async fetch(req,env){
 const u=new URL(req.url),origin=req.headers.get("Origin");
 if(origin&&origin!==ORIGIN)return new Response("Forbidden origin",{status:403});
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(!env.MEMBERSHIPS||!env.ADMIN_TOKEN)return json({error:"Backend bindings/secrets missing"},503);
 const isAdmin=req.headers.get("Authorization")==="Bearer "+env.ADMIN_TOKEN;
 if(u.pathname==="/request"&&req.method==="POST"){
  let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
  const phone=String(b.phone||"").replace(/[^0-9+]/g,""),name=String(b.name||"").trim(),plan=String(b.plan||"");
  if(name.length<2||phone.length<10||phone.length>15||!(/^(Manushree Plan \(₹49\/month\)|My Choice Plan \(₹99\/month\))$/.test(plan)))return json({error:"Invalid request"},400);
  const requestId=uid(),m={requestId,name,phone,plan,customName:String(b.customName||"Manushree").slice(0,40),status:"Pending",requestedAt:new Date().toISOString(),proofName:String(b.proofName||"").slice(0,120),serverVerified:false};
  await env.MEMBERSHIPS.put("request:"+requestId,JSON.stringify(m));return json({requestId,status:"Pending"},201);
 }
 if(u.pathname==="/status"&&req.method==="GET"){
  const requestId=u.searchParams.get("requestId"),phone=u.searchParams.get("phone");if(!requestId||!phone)return json({error:"Missing parameters"},400);
  const raw=await env.MEMBERSHIPS.get("request:"+requestId);if(!raw)return json({error:"Not found"},404);const m=JSON.parse(raw);if(m.phone!==phone)return json({error:"Unauthorized"},401);
  m.serverVerified=m.status==="Approved"&&m.expiresAt&&Date.now()<Date.parse(m.expiresAt);if(m.status==="Approved"&&!m.serverVerified)m.status="Expired";return json({membership:m});
 }
 if(u.pathname==="/admin/list"&&req.method==="GET"){
  if(!isAdmin)return json({error:"Unauthorized"},401);
  let cursor,items=[];do{const page=await env.MEMBERSHIPS.list({prefix:"request:",cursor,limit:1000});cursor=page.cursor;for(const k of page.keys){const raw=await env.MEMBERSHIPS.get(k.name);if(raw)items.push(JSON.parse(raw));}}while(cursor);
  items.sort((a,b)=>String(b.requestedAt).localeCompare(String(a.requestedAt)));
  return json({items});
 }
 if(["/admin/approve","/admin/reject","/admin/extend"].includes(u.pathname)&&req.method==="POST"){
  if(!isAdmin)return json({error:"Unauthorized"},401);
  let b;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
  const raw=await env.MEMBERSHIPS.get("request:"+b.requestId);if(!raw)return json({error:"Request not found"},404);const m=JSON.parse(raw);
  if(u.pathname==="/admin/approve"){const days=Math.max(1,Math.min(365,Number(b.days)||30));m.status="Approved";m.approvedAt=new Date().toISOString();m.expiresAt=new Date(Date.now()+days*86400000).toISOString();m.serverVerified=true;}
  else if(u.pathname==="/admin/extend"){const days=Math.max(1,Math.min(365,Number(b.days)||30));const base=m.expiresAt&&Date.parse(m.expiresAt)>Date.now()?Date.parse(m.expiresAt):Date.now();m.expiresAt=new Date(base+days*86400000).toISOString();m.status="Approved";m.serverVerified=true;m.extendedAt=new Date().toISOString();}
  else {m.status="Rejected";m.rejectedAt=new Date().toISOString();m.serverVerified=false;}
  await env.MEMBERSHIPS.put("request:"+m.requestId,JSON.stringify(m));return json({ok:true,membership:m});
 }
 return json({error:"Not found"},404);
}};
