/* Science Centre shared AI Tutor widget.
 * No provider API key is stored in this file or in either public HTML page.
 */
(() => {
  "use strict";
  if (window.__SCLH_AI_TUTOR_LOADED__) return;
  window.__SCLH_AI_TUTOR_LOADED__ = true;

  const ENDPOINT = "https://science-centre-ai-tutor.realclassesguruji.workers.dev/api/chat";
  const scriptTag = document.currentScript;
  const profile = scriptTag?.dataset?.profile ||
    (/Manushree|WonderWorld/i.test(document.title + " " + location.pathname) ? "wonderworld" : "learning-hub");
  const childMode = profile === "wonderworld";
  const title = childMode ? "Manushree's AI Learning Buddy" : "Science Centre AI Tutor";
  const prompt = childMode
    ? "You are Manushree's child-safe learning buddy for Play Group to Class 5. Use simple, age-appropriate Hindi or English. Be kind and encouraging, explain step by step, and give small examples. Never ask for personal details, contact information, passwords, school location, or private family information. Redirect unsafe or adult topics to a parent or teacher. STUDENT QUESTION: "
    : "You are Science Centre Learning Hub's bilingual educational tutor. Help with school subjects, mathematics, science, English, GK, computers and competitive-exam concepts. Explain clearly in Hindi or English as requested, show calculation steps, and state uncertainty honestly. Never ask for personal information, passwords, or private student data. STUDENT QUESTION: ";

  const css = document.createElement("style");
  css.textContent = `
    #sclhAiFab{position:fixed;right:16px;bottom:18px;z-index:99990;border:0;border-radius:999px;padding:13px 17px;background:linear-gradient(120deg,#2458d3,#7142c8);color:#fff;font:800 14px system-ui;box-shadow:0 8px 26px #172b7240;cursor:pointer}
    #sclhAiPanel{position:fixed;right:14px;bottom:78px;z-index:99991;width:min(370px,calc(100vw - 28px));height:min(520px,70dvh);display:none;flex-direction:column;background:#fff;color:#17234a;border:1px solid #dce3f7;border-radius:18px;box-shadow:0 18px 55px #101b4638;overflow:hidden;font:14px system-ui}
    #sclhAiPanel.open{display:flex}#sclhAiHead{padding:13px 15px;background:linear-gradient(120deg,#2458d3,#7142c8);color:white;display:flex;justify-content:space-between;align-items:center;gap:8px}
    #sclhAiHead small{display:block;opacity:.88;margin-top:3px}#sclhAiClose{border:0;background:#ffffff25;color:white;border-radius:9px;padding:5px 10px;font-size:20px}
    #sclhAiMessages{padding:12px;flex:1;overflow:auto;background:#f7f8ff;display:flex;flex-direction:column;gap:9px}
    .sclhAiMsg{max-width:90%;padding:10px 12px;border-radius:13px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.45}
    .sclhAiBot{align-self:flex-start;background:white;border:1px solid #e3e8f7}.sclhAiUser{align-self:flex-end;background:#e9edff}
    #sclhAiForm{display:flex;gap:7px;padding:10px;border-top:1px solid #e3e8f7;background:white}
    #sclhAiInput{min-width:0;flex:1;border:1px solid #d5dcef;border-radius:11px;padding:11px;font:14px system-ui;color:#17234a}
    #sclhAiSend{border:0;border-radius:11px;background:#2458d3;color:white;font-weight:800;padding:0 14px}
    #sclhAiSend:disabled{opacity:.55}#sclhAiNote{padding:0 12px 9px;background:white;color:#68738d;font-size:10px}
    @media(max-width:480px){#sclhAiFab{right:12px;bottom:12px}#sclhAiPanel{right:8px;bottom:68px;width:calc(100vw - 16px);height:min(68dvh,520px)}}
  `;
  document.head.appendChild(css);

  const fab = document.createElement("button");
  fab.id = "sclhAiFab"; fab.type = "button";
  fab.textContent = childMode ? "🦄 Ask AI Buddy" : "✨ Ask AI Tutor";
  fab.setAttribute("aria-controls", "sclhAiPanel");
  fab.setAttribute("aria-expanded", "false");

  const panel = document.createElement("section");
  panel.id = "sclhAiPanel";
  panel.setAttribute("aria-label", title);
  panel.innerHTML = `
    <header id="sclhAiHead"><div><b></b><small>Hindi + English · Learning support</small></div><button id="sclhAiClose" type="button" aria-label="Close">×</button></header>
    <div id="sclhAiMessages" role="log" aria-live="polite"><div class="sclhAiMsg sclhAiBot"></div></div>
    <form id="sclhAiForm"><input id="sclhAiInput" maxlength="1200" autocomplete="off" placeholder="Ask your question…" aria-label="Your question" required><button id="sclhAiSend" type="submit">Send</button></form>
    <div id="sclhAiNote">AI can make mistakes. Ask a teacher or parent when unsure. Do not share personal information.</div>`;
  document.body.append(fab, panel);

  panel.querySelector("b").textContent = title;
  panel.querySelector(".sclhAiBot").textContent = childMode
    ? "Hello Manushree! 🌈 What would you like to learn today?"
    : "Namaste! Ask me about Maths, Science, English, GK or Computers.";

  const messages = panel.querySelector("#sclhAiMessages");
  const input = panel.querySelector("#sclhAiInput");
  const send = panel.querySelector("#sclhAiSend");
  const addMessage = (value, isUser) => {
    const item = document.createElement("div");
    item.className = "sclhAiMsg " + (isUser ? "sclhAiUser" : "sclhAiBot");
    item.textContent = String(value || "");
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  };
  const toggle = open => {
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  fab.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  panel.querySelector("#sclhAiClose").addEventListener("click", () => toggle(false));

  panel.querySelector("#sclhAiForm").addEventListener("submit", async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || send.disabled) return;
    addMessage(question, true);
    input.value = "";
    send.disabled = true;
    send.textContent = "…";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt + question }),
        signal: controller.signal
      });
      const raw = await response.text();
      let data;
      try { data = JSON.parse(raw); } catch (_) { data = raw; }
      if (!response.ok) throw new Error("HTTP " + response.status);
      let answer = typeof data === "string" ? data : "";
      if (!answer && data && typeof data === "object") {
        for (const key of ["answer", "response", "text", "reply", "output", "message", "result"]) {
          if (typeof data[key] === "string") { answer = data[key]; break; }
        }
        if (!answer && data.candidates?.[0]?.content?.parts) {
          answer = data.candidates[0].content.parts.map(part => part.text || "").join("\n");
        }
      }
      if (!answer) throw new Error("Empty response");
      addMessage(answer, false);
    } catch (error) {
      addMessage(error.name === "AbortError"
        ? "The AI request timed out. Please try again."
        : "AI Tutor is not reachable right now. The Cloudflare Worker may need its Gemini secret or website CORS settings checked.", false);
    } finally {
      clearTimeout(timeoutId);
      send.disabled = false;
      send.textContent = "Send";
      input.focus();
    }
  });
})();
