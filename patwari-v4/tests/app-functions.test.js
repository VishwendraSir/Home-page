import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function makeElement(id) {
  return {
    id, value:"", textContent:"", innerText:"", innerHTML:"", style:{}, dataset:{},
    files:[], disabled:false, checked:false, className:"",
    classList:{add(){},remove(){},toggle(){}},
    reset(){},focus(){},scrollIntoView(){},click(){},appendChild(){},
    addEventListener(){},removeAttribute(){},setAttribute(){},
  };
}
function makeAppContext() {
  const elements=new Map();
  const local=new Map();
  const document={
    body:makeElement("body"),
    getElementById(id){if(!elements.has(id))elements.set(id,makeElement(id));return elements.get(id);},
    querySelector(){return null;},
    querySelectorAll(){return [];},
    createElement(tag){return makeElement(tag);},
    addEventListener(){},
  };
  const window={
    addEventListener(){},dispatchEvent(){},scrollTo(){},
  };
  const context={
    window,document,navigator:{onLine:true,geolocation:null},
    localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,String(v)),removeItem:k=>local.delete(k)},
    alert(){},confirm(){return true;},prompt(){return null;},
    console:{log(){},warn(){},error(){}},
    setTimeout(){return 1;},clearTimeout(){},
    URL,Blob,Date,Math,JSON,Map,Set,Number,String,Array,Object,RegExp,Error,Promise,
    FileReader:function(){},Image:function(){},
  };
  vm.createContext(context);
  const html=fs.readFileSync(path.join(process.cwd(),"index.html"),"utf8");
  const script=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(m=>!/\bsrc\s*=/.test(m[1]||"")&&!/\btype=["']module["']/.test(m[1]||""));
  assert.ok(script,"main inline application script should exist");
  vm.runInContext(script[2],context,{filename:"patwari-main-inline.js"});
  for(const id of ["tkTitle","tkPri","tkDue"]) context[id]=document.getElementById(id);
  return {context,elements:{get:id=>document.getElementById(id)},local};
}
test("normalizeState clones input, sanitizes IDs and preserves audit strings",()=>{
  const {context}=makeAppContext();
  const original={land:[{id:"bad id/1",owner:"A"}],audit:["audit line"],lang:"en"};
  context.__input=original;
  const result=vm.runInContext("normalizeState(__input)",context);
  assert.equal(result.lang,"en");
  assert.equal(result.land[0].id,"bad_id_1");
  assert.equal(result.audit[0],"audit line");
  assert.notStrictEqual(result.land[0],original.land[0]);
  assert.throws(()=>vm.runInContext("normalizeState({land:[null]})",context),/Invalid record in land/);
});
test("area calculator converts hectares and validates share fractions",()=>{
  const {context,elements}=makeAppContext();
  elements.get("calcUnit").value="hectare";
  elements.get("calcVal").value="1";
  elements.get("bighaSqm").value="2529.29";
  elements.get("shareFrac").value="1/2";
  vm.runInContext("calcArea()",context);
  assert.match(elements.get("calcOut").textContent,/हैक्टेयर: 1\.0000 Ha/);
  assert.match(elements.get("calcOut").textContent,/हिस्सा \(1\/2\): 0\.5000 Ha/);
  elements.get("shareFrac").value="2/1";
  vm.runInContext("calcArea()",context);
  assert.match(elements.get("calcOut").textContent,/हिस्सा 0 से 1 के बीच/);
});
test("task form rejects blank task and saves a timestamped task",()=>{
  const {context,elements,local}=makeAppContext();
  vm.runInContext("state={lang:'hi',dark:false,land:[],mutations:[],crops:[],visits:[],tasks:[],audit:[]}",context);
  elements.get("tkTitle").value="";
  elements.get("tkPri").value="High";
  elements.get("tkDue").value="2026-12-01";
  vm.runInContext("saveTask({preventDefault(){}})",context);
  assert.equal(vm.runInContext("state.tasks.length",context),0);
  elements.get("tkTitle").value="TEST task";
  vm.runInContext("saveTask({preventDefault(){}})",context);
  assert.equal(vm.runInContext("state.tasks.length",context),1);
  assert.equal(vm.runInContext("state.tasks[0].title",context),"TEST task");
  assert.ok(vm.runInContext("Number.isFinite(state.tasks[0].updatedAt)",context));
  assert.ok(local.has("RPAA_SEWAR_COMPLETE_HTML5_V1"));
});
test("record search finds tasks and renders escaped user text",()=>{
  const {context,elements}=makeAppContext();
  vm.runInContext("state={lang:'hi',dark:false,land:[],mutations:[],crops:[],visits:[],tasks:[{id:'T1',title:'TEST <script>',priority:'Low',due:'2026-12-01',done:false}],audit:[]}",context);
  vm.runInContext("searchAllRecords('TEST')",context);
  assert.match(elements.get("globalSearchResults").innerHTML,/&lt;script&gt;/);
  assert.doesNotMatch(elements.get("globalSearchResults").innerHTML,/<script>/);
});
