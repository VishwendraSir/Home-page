(function(root){'use strict';if(root.WonderKidAutoPrefs)return;
const PREFS_KEY='ww_v37_kid_auto_prefs_v1',KIDS=['manushree','shree','ram'];
const GRADE_ORDER=['Play Group','Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
const DEFAULTS={manushree:{grade:'Play Group',mode:'match',autoVoice:true,voiceLanguage:'auto',speechRate:.9},shree:{grade:'Play Group',mode:'match',autoVoice:true,voiceLanguage:'auto',speechRate:.9},ram:{grade:'Play Group',mode:'match',autoVoice:true,voiceLanguage:'auto',speechRate:.9}};
const MODES=['match','plus1'],LANGS=['auto','hi-IN','en-IN'],listeners=new Set();let memoryStore=null;
function kid(id){id=String(id||'manushree').trim().toLowerCase();return KIDS.includes(id)?id:null}
function clone(x){return JSON.parse(JSON.stringify(x))}
function getRaw(){try{const x=JSON.parse((()=>{try{return root.localStorage.getItem(PREFS_KEY)||'{}'}catch(e){return memoryStore||'{}'}})());return x&&typeof x==='object'?(x.kids||x):{}}catch(e){return {}}}
function validate(p,k){const v={...DEFAULTS[k],...(p||{})};if(!GRADE_ORDER.includes(v.grade))v.grade=DEFAULTS[k].grade;if(!MODES.includes(v.mode))v.mode='match';if(typeof v.autoVoice!=='boolean')v.autoVoice=true;if(!LANGS.includes(v.voiceLanguage))v.voiceLanguage='auto';const n=Number(v.speechRate);v.speechRate=Number.isFinite(n)?Math.max(.5,Math.min(1.5,n)):.9;return v}
function all(){const raw=getRaw(),out={};KIDS.forEach(k=>out[k]=validate(raw[k],k));return out}
function emit(type,data){const event={type,settings:clone(data||all())};listeners.forEach(fn=>{try{fn(event)}catch(e){console.error('[WonderKidPrefs]',e)}});try{root.dispatchEvent(new CustomEvent('wonderkid:settings-changed',{detail:event}))}catch(e){}}
function save(p){const clean={};KIDS.forEach(k=>clean[k]=validate(p[k],k));const json=JSON.stringify({version:2,updatedAt:Date.now(),kids:clean});memoryStore=json;try{root.localStorage.setItem(PREFS_KEY,json)}catch(e){}emit('settings-updated',clean);return clone(clean)}
function getKidPref(id){const k=kid(id);return k?validate(getRaw()[k],k):clone(DEFAULTS.manushree)}
function getAllPrefs(){return all()}
function updateKidPref(id,patch){const k=kid(id);if(!k)throw Error('Invalid WonderKid ID');if(!patch||typeof patch!=='object'||Array.isArray(patch))throw Error('Patch must be an object');const a=all();a[k]=validate({...a[k],...patch},k);save(a);return clone(a[k])}
function getEffectiveGrade(id,fallback){const p=getKidPref(id),base=GRADE_ORDER.includes(p.grade)?p.grade:(GRADE_ORDER.includes(fallback)?fallback:'Play Group'),i=GRADE_ORDER.indexOf(base);return p.mode==='plus1'&&i<GRADE_ORDER.length-1?GRADE_ORDER[i+1]:base}
function getEffectiveGradeIndex(id,fallback){const f=GRADE_ORDER[Math.max(0,Math.min(8,Number(fallback)||0))];return GRADE_ORDER.indexOf(getEffectiveGrade(id,f))}
function setGrade(id,grade){if(!GRADE_ORDER.includes(grade))throw Error('Invalid grade');return updateKidPref(id,{grade})}
function setMode(id,mode){if(!MODES.includes(mode))throw Error('Invalid mode');return updateKidPref(id,{mode})}
function setAutoVoice(id,on){return updateKidPref(id,{autoVoice:Boolean(on)})}
function toggleAutoVoice(id){return setAutoVoice(id,!getKidPref(id).autoVoice)}
function resetKid(id){const k=kid(id);if(!k)throw Error('Invalid WonderKid ID');const a=all();a[k]=clone(DEFAULTS[k]);save(a);return clone(a[k])}
function resetAll(){return save(clone(DEFAULTS))}
function subscribe(fn){if(typeof fn!=='function')throw Error('Listener must be a function');listeners.add(fn);return()=>listeners.delete(fn)}
function onKidSelected(id,gradeIndex){const k=kid(id);if(!k)return null;const raw=getRaw();if(!raw[k])return updateKidPref(k,{grade:GRADE_ORDER[Math.max(0,Math.min(8,Number(gradeIndex)||0))]});return getKidPref(k)}
function syncGradeFromApp(id,index){const i=Math.max(0,Math.min(8,Number(index)||0));return setGrade(id,GRADE_ORDER[i])}
if(root.addEventListener)root.addEventListener('storage',e=>{if(e.key===PREFS_KEY)emit('external-settings-updated',all())});
root.WonderKidAutoPrefs=Object.freeze({VERSION:2,PREFS_KEY,KIDS,GRADE_ORDER,getKidPref,getAllPrefs,updateKidPref,getEffectiveGrade,getEffectiveGradeIndex,setGrade,setMode,setAutoVoice,toggleAutoVoice,isAutoVoiceEnabled:id=>getKidPref(id).autoVoice,resetKid,resetAll,subscribe,onKidSelected,syncGradeFromApp});
})(window);