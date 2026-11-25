/**
 * Cloudflare Worker — deploy separately with wrangler.
 * Required secrets: GEMINI_API_KEY
 * Required vars: FIREBASE_PROJECT_ID
 * Set ALLOWED_ORIGIN to the deployed GitHub Pages origin.
 */
const cors = origin => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Vary": "Origin"
});
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "https://vishwendrasir.github.io";
    if (origin !== allowed) return new Response("Origin not allowed", {status:403});
    if (request.method === "OPTIONS") return new Response(null,{headers:cors(allowed)});
    if (request.method !== "POST") return new Response("Method not allowed",{status:405,headers:cors(allowed)});
    try {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (!token || !env.FIREBASE_PROJECT_ID) return json({error:"Authentication configuration missing"},401,allowed);
      const verify = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token="+encodeURIComponent(token));
      if (!verify.ok) return json({error:"Invalid Firebase ID token"},401,allowed);
      const claims = await verify.json();
      if (claims.aud !== env.FIREBASE_PROJECT_ID || claims.iss !== "https://securetoken.google.com/"+env.FIREBASE_PROJECT_ID || Number(claims.exp)*1000 < Date.now()) return json({error:"Unauthorized token"},401,allowed);
      if (!env.GEMINI_API_KEY) return json({error:"AI secret not configured"},503,allowed);
      const body = await request.json();
      const prompt = String(body.prompt || "").trim().slice(0,12000);
      const type = String(body.taskType || "answer");
      const lang = String(body.language || "hi");
      if (!prompt) return json({error:"Prompt is required"},400,allowed);
      const system = "You are a careful assistant for a Rajasthan Patwari office workflow. Create drafts and explain administrative workflows only. Never claim to access official land records or government portals. Never fabricate khasra, jamabandi, case status, law sections, deadlines, orders, or facts. If legal provision or official data is uncertain, say it must be verified from current official Rajasthan sources and competent authority. Mark every document as DRAFT. Do not make final legal decisions. Language: "+lang+". Task: "+type+". Office context: Patwar halka Sewar, Bharatpur, Rajasthan. User-provided facts: "+prompt;
      const model = env.GEMINI_MODEL || "gemini-2.5-flash";
      const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent?key="+encodeURIComponent(env.GEMINI_API_KEY);
      const ai = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:system}]}],generationConfig:{temperature:0.3,maxOutputTokens:1800}})});
      const result = await ai.json();
      if (!ai.ok) return json({error:"AI provider request failed"},502,allowed);
      const text = result.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n") || "No response";
      return json({text},200,allowed);
    } catch (e) { return json({error:"Request could not be processed"},400,allowed); }
  }
};
function json(data,status,origin){return new Response(JSON.stringify(data),{status,headers:{...cors(origin),"Content-Type":"application/json","Cache-Control":"no-store"}});}
