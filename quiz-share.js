/* SCIENCE CENTRE LEARNING HUB — UNIVERSAL QUIZ IMAGE SHARE ENGINE */
(()=>{"use strict";
if(window.__SCLH_QUIZ_SHARE_V1__)return;window.__SCLH_QUIZ_SHARE_V1__=true;
const $=s=>document.querySelector(s),txt=e=>(e?.innerText||e?.textContent||"").replace(/\s+/g," ").trim();
const pick=a=>{for(const s of a){const e=$(s);if(e&&txt(e))return txt(e)}return""};
const themes=[["Ocean Blue",["#062a55","#087eae","#36d5e8"]],["Royal Purple",["#24105a","#5531a8","#b06bff"]],["Science Cyan",["#003b55","#007e9e","#52e4ee"]],["Forest Green",["#073b32","#147a55","#7be0a6"]],["Sunrise",["#5a2146","#c14d55","#ffc46b"]],["Midnight",["#10182f","#263b70","#6f8cff"]],["Kids Rainbow",["#193d8b","#713fc0","#ff9fcb"]],["Exam Gold",["#26314c","#8a5c13","#f8d66d"]],["Coral Reef",["#06435c","#087d86","#ff8e75"]],["Clean White",["#e8f4ff","#cbdcff","#8bd9ee"]]];
let state={type:"poster",theme:0,ratio:"portrait",language:"both",answers:false,qr:true,custom:"Explore • Learn • Practice • Share",blob:null};
function readLive(){
 const title=document.title.replace(/\s*[|—-]\s*Science Centre Learning Hub.*$/i,"").trim()||"Learning Challenge";
 const question=pick(["#mockQ","#practiceQ","#question","#qtext","#qhi","#qen",".question-text",".qtext"]);
 const root=["#mockOpts","#practiceOpts","#options","#opts",".options",".option-list"].map($).find(e=>e&&e.children.length);
 let options=root?[...root.querySelectorAll("button,label,[role=option],.option")].map(txt).filter(Boolean):[];
 if(!options.length&&root)options=[...root.children].map(txt).filter(Boolean);
 const counter=pick(["#counter","#position","#mockPosition","#practiceNumber","#progressText"]);
 const totalText=(document.body.innerText.match(/(?:80|100|50|40|20|10|[0-9]{1,4})\s*(?:प्रश्न|questions|MCQ)/i)||[])[0]||"";
 const section=pick(["#mockSubject","#practiceSubject","#modeLabel","#sectionTag"]);
 const score=pick(["#scoreValue","#score","#finalScore","#scoreLive"]);
 const summary=pick(["#summary","#resultText","#scoreMeta","#resultMessage"]);
 const answer=pick(["#feedback .answer","#feedback",".answer",".correct","#explain"]);
 const result=!!(["#mockResult","#result"].map($).find(e=>e&&!e.classList.contains("hidden")&&getComputedStyle(e).display!=="none"));
 return {title,question,options:options.slice(0,6),counter,totalText,section,score,summary,answer,result,url:location.href};
}
function loadQr(){if(window.QRCode)return Promise.resolve(true);if(!navigator.onLine)return Promise.resolve(false);return new Promise(resolve=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";s.onload=()=>resolve(!!window.QRCode);s.onerror=()=>resolve(false);document.head.appendChild(s)})}
const css=document.createElement("style");css.textContent=
'#sclh-share-fab{position:fixed;right:14px;bottom:148px;z-index:2147483002;border:0;border-radius:999px;padding:13px 17px;background:linear-gradient(120deg,#06b6d4,#4f46e5,#9333ea);color:#fff;font:900 14px system-ui;box-shadow:0 8px 28px #081b4d55;cursor:pointer}'+
'#sclh-share-modal{position:fixed;inset:0;z-index:2147483003;background:#061329d9;display:none;align-items:center;justify-content:center;padding:12px;font:14px system-ui;color:#12213c}'+
'#sclh-share-modal.open{display:flex}#sclh-share-modal .panel{width:min(980px,100%);max-height:94vh;overflow:auto;background:#f7fbff;border-radius:20px;padding:16px;box-shadow:0 20px 70px #0008}'+
'#sclh-share-modal h2{margin:0 0 10px;color:#10285f;font-size:21px}#sclh-share-modal .controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0}'+
'#sclh-share-modal select,#sclh-share-modal input{min-width:0;width:100%;padding:10px;border:1px solid #bfd0e8;border-radius:10px;background:#fff;color:#17223d}'+
'#sclh-share-modal .actions{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}#sclh-share-modal button{border:0;border-radius:10px;padding:10px 13px;font-weight:800;cursor:pointer;background:#e3edf9;color:#10285f}'+
'#sclh-share-modal button.primary{background:linear-gradient(100deg,#06b6d4,#4f46e5);color:#fff}#sclh-share-modal .preview{display:flex;justify-content:center;background:#dbe8f5;border-radius:14px;padding:10px;overflow:auto}'+
'#sclh-share-modal canvas{display:block;width:min(100%,360px);height:auto;box-shadow:0 5px 22px #13294c33;border-radius:8px}#sclh-share-status{font-size:12px;color:#345;min-height:18px}'+
'#sclh-share-modal .close{float:right;background:#fee2e2;color:#991b1b}@media(max-width:560px){#sclh-share-modal .controls{grid-template-columns:1fr 1fr}#sclh-share-modal .panel{padding:12px}#sclh-share-fab{bottom:136px;right:10px}}';
document.head.appendChild(css);
const fab=document.createElement("button");fab.id="sclh-share-fab";fab.type="button";fab.textContent="🖼️ Share Quiz Image";document.body.appendChild(fab);
const modal=document.createElement("div");modal.id="sclh-share-modal";
modal.innerHTML='<div class="panel"><button class="close" id="sclh-close">✕ Close</button><h2>Universal Quiz Image Studio</h2><div class="controls">'+
'<select id="sclh-type"><option value="poster">Quiz Promotion Poster</option><option value="question">Question Challenge</option><option value="result">Student Result Card</option></select>'+
'<select id="sclh-theme">'+themes.map((t,i)=>'<option value="'+i+'">'+t[0]+'</option>').join("")+'</select>'+
'<select id="sclh-ratio"><option value="portrait">1080 × 1350</option><option value="story">1080 × 1920</option></select>'+
'<select id="sclh-lang"><option value="both">Hindi + English</option><option value="hi">Hindi</option><option value="en">English</option></select>'+
'<input id="sclh-custom" value="Explore • Learn • Practice • Share" aria-label="Promotional text">'+
'<select id="sclh-answer"><option value="no">Hide answers</option><option value="yes">Show visible answers</option></select>'+\n'<select id="sclh-qr"><option value="yes">Show QR code</option><option value="no">Hide QR code</option></select></div>'+
'<div class="actions"><button class="primary" id="sclh-generate">↻ Generate / Preview</button><button id="sclh-download">⬇ Download PNG</button><button id="sclh-jpeg">⬇ Download JPEG</button><button id="sclh-native">↗ Android Share</button><button id="sclh-copy">▣ Copy Image</button></div>'+
'<div class="actions"><button id="sclh-wa">WhatsApp</button><button id="sclh-fb">Facebook</button><button id="sclh-tg">Telegram</button><button id="sclh-x">X</button><button id="sclh-class">Google Classroom</button><button id="sclh-link">Copy Quiz URL</button></div>'+
'<div class="preview"><canvas id="sclh-canvas" width="1080" height="1350"></canvas></div><p id="sclh-share-status" aria-live="polite"></p><small>Real content is read from this page. Platform image-upload support varies; use Android Share or Download where direct upload is unavailable.</small></div>';
document.body.appendChild(modal);
const canvas=$("#sclh-canvas"),ctx=canvas.getContext("2d"),status=$("#sclh-share-status");
function setStatus(s){status.textContent=s}
function wrap(t,max){const words=String(t||"").split(/\s+/),lines=[];let line="";for(const w of words){const z=line?line+" "+w:w;if(ctx.measureText(z).width>max&&line){lines.push(line);line=w}else line=z}if(line)lines.push(line);return lines}
function round(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function draw(t,x,y,max,size,color,weight,limit){ctx.font=weight+" "+size+'px system-ui,"Noto Sans Devanagari",Arial,sans-serif';ctx.fillStyle=color;const lines=wrap(t,max).slice(0,limit);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*size*1.35));return y+lines.length*size*1.35}
async function generate(){
 const d=readLive(),c=themes[state.theme][1],h=state.ratio==="story"?1920:1350;canvas.width=1080;canvas.height=h;
 const g=ctx.createLinearGradient(0,0,1080,h);g.addColorStop(0,c[0]);g.addColorStop(.55,c[1]);g.addColorStop(1,c[2]);ctx.fillStyle=g;ctx.fillRect(0,0,1080,h);
 ctx.globalAlpha=.12;for(let i=0;i<18;i++){ctx.beginPath();ctx.arc((i*197)%1080,(i*293)%h,35+(i%5)*15,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill()}ctx.globalAlpha=1;
 round(48,48,984,h-96,38,"rgba(255,255,255,.95)");ctx.textAlign="center";
 draw("SCIENCE CENTRE LEARNING HUB",540,125,900,32,"#13518b",900,1);draw("GUIDED BY VISHWENDRA SIR",540,170,900,23,"#4c4c8d",800,1);
 ctx.textAlign="left";let y=255;const head=state.type==="poster"?"QUIZ CHALLENGE":state.type==="question"?"QUESTION CHALLENGE":"STUDENT RESULT";
 y=draw(head,100,y,880,52,"#13285a",900,2)+24;y=draw(d.title,100,y,880,42,"#172d57",900,3)+18;
 if(d.section)y=draw("SUBJECT / SECTION: "+d.section,100,y,880,25,"#365d86",750,2)+14;
 if(state.type==="question"){
  y=draw("QUESTION",100,y,880,25,"#0b7a99",900,1)+12;y=draw(d.question||"No active question detected on this page.",100,y,880,34,"#17233f",800,5)+18;
  d.options.forEach((o,i)=>{round(100,y,880,64,15,"#edf5ff");y=draw(String.fromCharCode(65+i)+". "+o,125,y+41,830,25,"#17233f",700,2)+12});if(state.answers&&d.answer)y=draw("Answer: "+d.answer,110,y+10,850,25,"#16834b",900,2)+12;
 }else if(state.type==="result"){
  y=draw(d.result?[d.score,d.summary].filter(Boolean).join(" • "):"Complete the quiz to display your actual result here.",100,y,880,34,d.result?"#17233f":"#9b3c2d",800,6)+22;
 }else{
  y=draw("Explore • Learn • Practice • Achieve",100,y,880,30,"#0b7a99",850,2)+22;
  y=draw(d.totalText||d.counter||"Interactive Learning Challenge",100,y,880,27,"#304e76",750,2)+24;
  y=draw(d.question||"Scan the QR code or open the quiz to begin your challenge.",100,y,880,29,"#17233f",800,5)+20;
  d.options.forEach((o,i)=>{round(100,y,880,58,14,"#edf5ff");y=draw(String.fromCharCode(65+i)+". "+o,125,y+38,830,23,"#17233f",700,2)+10});
 }
 const fy=Math.max(y+20,h-250);round(90,fy-25,900,2,1,"#a8c6e6");draw($("#sclh-custom").value||state.custom,110,fy+30,850,26,"#214b7b",800,2);draw("MANUSHREE WONDER WORLD • Learn • Revise • Share",110,fy+90,850,22,"#4b5583",750,2);
 if(state.qr){const ok=await loadQr();if(ok){const holder=document.createElement("div");new QRCode(holder,{text:d.url,width:150,height:150,correctLevel:QRCode.CorrectLevel.M});const im=holder.querySelector("img");if(im){await new Promise(r=>{im.onload=r;setTimeout(r,300)});ctx.fillStyle="#fff";ctx.fillRect(820,h-215,170,170);ctx.drawImage(im,830,h-205,150,150);draw("SCAN TO OPEN",830,h-30,160,16,"#234",800,1)}}else setStatus("Offline/QR library unavailable: image generated without QR.")}
 ctx.textAlign="left";state.blob=await new Promise(r=>canvas.toBlob(r,"image/png"));if(!state.blob)throw Error("Image generation failed");setStatus("Preview ready. Verify content before sharing.");
}
function download(jpeg){if(!state.blob)return;const a=document.createElement("a");a.href=jpeg?canvas.toDataURL("image/jpeg",.94):URL.createObjectURL(state.blob);a.download="science-centre-"+state.type+(jpeg?".jpg":".png");a.click();if(!jpeg)setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function nativeShare(){if(!state.blob)await generate();const f=new File([state.blob],"science-centre-quiz.png",{type:"image/png"});try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:document.title,text:"SCIENCE CENTRE LEARNING HUB — Guided by Vishwendra Sir"});else{download(false);setStatus("File sharing unsupported here. Image downloaded; share it from your gallery.")}}catch(e){if(e.name!=="AbortError")setStatus("Sharing failed: "+e.message)}}
function open(u){window.open(u,"_blank","noopener,noreferrer")}
fab.onclick=async()=>{modal.classList.add("open");try{await generate()}catch(e){setStatus(e.message)}};
$("#sclh-close").onclick=()=>modal.classList.remove("open");$("#sclh-generate").onclick=()=>generate().catch(e=>setStatus(e.message));
$("#sclh-download").onclick=()=>download(false);$("#sclh-jpeg").onclick=()=>download(true);$("#sclh-native").onclick=nativeShare;
$("#sclh-copy").onclick=async()=>{try{if(!state.blob)await generate();if(navigator.clipboard&&window.ClipboardItem)await navigator.clipboard.write([new ClipboardItem({"image/png":state.blob})]);else throw Error("Image clipboard unsupported")}catch(e){setStatus("Copy unavailable. Use Download PNG. "+e.message)}};
$("#sclh-link").onclick=async()=>{try{await navigator.clipboard.writeText(location.href);setStatus("Quiz URL copied.")}catch(e){setStatus(location.href)}};
$("#sclh-wa").onclick=()=>open("https://wa.me/?text="+encodeURIComponent(document.title+" "+location.href));
$("#sclh-tg").onclick=()=>open("https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(document.title));
$("#sclh-fb").onclick=()=>open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href));
$("#sclh-x").onclick=()=>open("https://twitter.com/intent/tweet?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(document.title));
$("#sclh-class").onclick=async()=>{try{await navigator.clipboard.writeText(location.href);setStatus("URL copied. Paste it into Google Classroom.")}catch(e){setStatus(location.href)}};
["type","theme","ratio","lang","answer","custom","qr"].forEach(k=>$("#sclh-"+k).addEventListener("change",e=>{if(k==="theme")state.theme=Number(e.target.value);else if(k==="answer")state.answers=e.target.value==="yes";else if(k==="qr")state.qr=e.target.value==="yes";else state[k]=e.target.value;generate().catch(err=>setStatus(err.message))}));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
})();