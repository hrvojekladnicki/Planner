'use strict';
if(window.top!==window.self){try{window.top.location=window.self.location.href;}catch(e){document.documentElement.innerHTML='';}}
/* ───────── ICONS ───────── */
const ICONS={
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  list:'<path d="M9 6h12M9 12h12M9 18h12"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  grip:'<circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  chevL:'<path d="m15 18-6-6 6-6"/>', chevR:'<path d="m9 18 6-6-6-6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>', check:'<path d="M20 6 9 17l-5-5"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  pin:'<path d="M12 17v5"/><path d="M9 3h6l-1 6 4 4v2H6v-2l4-4Z"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  flame:'<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-4 5-4 8 0 4 3 7 6 7Z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrowR:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  sort:'<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
  today:'<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><circle cx="12" cy="15" r="2"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  moveR:'<path d="M4 12h12M12 6l6 6-6 6"/><path d="M20 4v16"/>',
  square:'<rect x="4" y="4" width="16" height="16" rx="4"/>',
  note:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  checklist:'<path d="m3.5 6 1.5 1.5 3-3M3.5 13l1.5 1.5 3-3"/><path d="M11 6h10M11 13h10M11 20h10"/>',
  heading:'<path d="M6 4v16M18 4v16M6 12h12"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  refresh:'<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
};
const FILLED=new Set(['grip','more']);
function icon(n,cls=''){return`<svg class="i${FILLED.has(n)?' fill':''} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;}

/* ───────── UTILS ───────── */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function esc(s){if(s==null)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function tryDomain(url){try{return new URL(url).hostname.replace(/^www\./,'');}catch(e){return url;}}
// Dopušta samo sigurne sheme (blokira javascript:, data: itd. — zaštita od ubacivanja koda)
function safeUrl(u){u=normUrl(u);if(!u)return'#';try{const x=new URL(u);return/^(https?|mailto|tel):$/.test(x.protocol)?x.href:'#';}catch(e){return'#';}}
function normUrl(u){u=(u||'').trim();if(!u)return'';return /^[a-z]+:\/\//i.test(u)?u:'https://'+u;}
function linkify(s){
  return esc(s).replace(/((?:https?:\/\/|www\.)[^\s<]+[^\s<.,;:!?)\]'"])/gi,m=>{
    const href=safeUrl(m.toLowerCase().startsWith('www.')?'https://'+m:m);
    const txt=m.replace(/^https?:\/\/(www\.)?/i,'');
    return`<a class="inline-link" href="${href}" target="_blank" rel="noopener">${txt.length>42?txt.slice(0,40)+'…':txt}</a>`;
  });
}
function title(t){return t.text!=null?t.text:(t.desc||'');}
function splitName(name){
  const m=String(name||'').match(/^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)\s*(.*)$/u);
  return m?{emo:m[1],label:m[2]||m[1]}:{emo:'',label:name||''};
}
function pickEmoji(n){n=n.toLowerCase();const map=[['kuc','🏠'],['dom','🏠'],['alat','🔧'],['oprem','📦'],['posao','💼'],['rad','💼'],['auto','🚗'],['vrt','🌱'],['opg','🌳'],['sport','💪'],['trening','💪'],['putov','✈️'],['odmor','🏖️'],['kupov','🛒'],['shop','🛒'],['djec','🧸'],['financ','💶'],['knjig','📚'],['ideje','💡'],['qa','🧪']];for(const[k,e]of map)if(n.includes(k))return e;return'📁';}
function vibrate(ms=10){try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v==null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
// Registar dodatnih prikaza (kuharica, kokteli, DIY, kids) — popunjavaju ih zasebne datoteke
const VIEWS={}, INPUT_SET={}, CHANGE_SET={};

/* ───────── DATES (kompatibilno s postojećim ključevima) ───────── */
const DAY_NAMES=['Ponedjeljak','Utorak','Srijeda','Četvrtak','Petak','Subota','Nedjelja'];
const DAY_SHORT=['Pon','Uto','Sri','Čet','Pet','Sub','Ned'];
const MONTH_NAMES=['sij','velj','ožu','tra','svi','lip','srp','kol','ruj','lis','stu','pro'];
function getMonday(d){d=new Date(d);const day=d.getDay(),diff=d.getDate()-day+(day===0?-6:1);d.setDate(diff);d.setHours(0,0,0,0);return d;}
function getWeekKey(d){const mon=getMonday(d);const y=mon.getFullYear(),start=new Date(y,0,1);const week=Math.ceil(((mon-start)/86400000+start.getDay()+1)/7);return`${y}-W${String(week).padStart(2,'0')}`;}
// NAPOMENA: postojeći podaci koriste ovaj (UTC) ključ dana — zadržan radi kompatibilnosti
function formatDateKey(d){return d.toISOString().slice(0,10);}
const _monCache={};
function mondayFromKey(wk){
  if(_monCache[wk])return new Date(_monCache[wk]);
  const y=parseInt(wk.slice(0,4),10);let m=getMonday(new Date(y,0,1));
  for(let i=0;i<60;i++){if(getWeekKey(m)===wk){_monCache[wk]=m.getTime();return new Date(m);}m.setDate(m.getDate()+7);}
  return getMonday(new Date(y,0,1));
}
function getWeekDays(m){const days=[];for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);days.push(d);}return days;}
function today(){const d=new Date();d.setHours(0,0,0,0);return d;}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x;}
function isToday(d){return formatDateKey(d)===formatDateKey(today());}
function isPast(d){return d<today();}
function getCurrentWeekKey(){return getWeekKey(today());}
function dateFromDk(dk){const b=new Date(dk+'T12:00:00');for(const off of[1,0,-1,2,-2]){const c=new Date(b);c.setDate(c.getDate()+off);c.setHours(0,0,0,0);if(formatDateKey(c)===dk)return c;}return new Date(dk+'T00:00:00');}
function localISO(d){return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function localDT(d){return`${localISO(d)}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
function fromInputDate(v){return new Date(v+'T00:00:00');}
function dayIdx(d){return d.getDay()===0?6:d.getDay()-1;}
function formatDayLabel(d){return`${d.getDate()}. ${MONTH_NAMES[d.getMonth()]}`;}
function formatWeekRange(m){const sun=addDays(m,6);return`${formatDayLabel(m)} – ${formatDayLabel(sun)} ${sun.getFullYear()}.`;}
function shortDay(d){if(isToday(d))return'Danas';if(formatDateKey(d)===formatDateKey(addDays(today(),1)))return'Sutra';if(formatDateKey(d)===formatDateKey(addDays(today(),-1)))return'Jučer';return`${DAY_SHORT[dayIdx(d)]} ${formatDayLabel(d)}`;}
function fmtRem(at){const d=new Date(at);if(isNaN(d))return'';const day=new Date(d);day.setHours(0,0,0,0);return`${shortDay(day)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}

/* ───────── STATE ───────── */
function getDefaultData(){
  return{
    tabs:[
      {id:'todolist',name:'✅ To Do Lista',type:'todolist'},
      {id:'kuca',name:'🏠 Kuća',type:'todo'},
      {id:'alat',name:'🔧 Alat',type:'todo'},
      {id:'oprema',name:'📦 Oprema',type:'todo'},
      {id:'posao',name:'💼 Posao',type:'todo'},
      {id:'bookmarks',name:'🌐 Web stranice',type:'bookmarks'},
    ],
    items:{kuca:[],alat:[],oprema:[],posao:[]},
    bookmarks:[], bookmarkCats:[{id:'bmcat_default',name:'Općenito'}],
    highPriority:[], hpArchive:[], weeklyTasks:{},
    notes:[],
    settings:{openSummary:true},
  };
}
function normalize(s){
  s=s&&typeof s==='object'?s:getDefaultData();
  if(!Array.isArray(s.tabs)||!s.tabs.length)s.tabs=getDefaultData().tabs;
  if(!s.tabs.find(t=>t.type==='todolist'))s.tabs.unshift({id:'todolist',name:'✅ To Do Lista',type:'todolist'});
  if(!s.tabs.find(t=>t.type==='bookmarks'))s.tabs.push({id:'bookmarks',name:'🌐 Web stranice',type:'bookmarks'});
  s.items=s.items||{};
  s.tabs.forEach(t=>{if(t.type==='todo'&&!Array.isArray(s.items[t.id]))s.items[t.id]=[];});
  s.bookmarks=Array.isArray(s.bookmarks)?s.bookmarks:[];
  s.bookmarkCats=Array.isArray(s.bookmarkCats)&&s.bookmarkCats.length?s.bookmarkCats:[{id:'bmcat_default',name:'Općenito'}];
  s.highPriority=Array.isArray(s.highPriority)?s.highPriority:[];
  s.hpArchive=Array.isArray(s.hpArchive)?s.hpArchive:[];
  s.weeklyTasks=s.weeklyTasks&&typeof s.weeklyTasks==='object'?s.weeklyTasks:{};
  s.settings=Object.assign({openSummary:true},s.settings||{});
  s.settings.gcal=Object.assign({clientId:'',calendarId:'primary',show:true},s.settings.gcal||{});
  s.notes=Array.isArray(s.notes)?s.notes.filter(n=>n&&n.id):[];
  s.notes.forEach(n=>{n.blocks=Array.isArray(n.blocks)&&n.blocks.length?n.blocks:[{id:uid('b'),t:'p',x:'',d:false}];n.blocks.forEach(b=>{b.x=b.x==null?'':String(b.x);if(!['p','c','h'].includes(b.t))b.t='p';});});
  delete s.activeTab; // aktivni tab se više ne sinkronizira (svaki uređaj ima svoj)
  if(typeof normalizeExtra==='function')normalizeExtra(s);
  return s;
}
let state=normalize(getDefaultData());
window.getState=()=>state;

const LOCAL_MODE=new URLSearchParams(location.search).has('local');
window.PLANNER_LOCAL=LOCAL_MODE;
const LOCAL_KEY='planner.local.v2';

function saveData(){
  if(LOCAL_MODE){lsSet(LOCAL_KEY,JSON.stringify(state));setSyncStatus('local','Lokalni način');}
  else if(window._scheduleSave)window._scheduleSave();
  updateBadges();
}

/* ───────── UI STATE (po uređaju) ───────── */
let viewingWeekKey=null, justToggled=null, justAdded=null, dragging=false, pendingRemote=false, cloudReady=false;
let sortables=[];
const dayPrio={};             // prioritet za quick-add po danu
const tabUI={};               // filter/sort/search po listi
let activeBmCat=lsGet('planner.bmcat','');
let bmSearch='', histSearch='', histMode='weeks';
let user={name:'',photo:'',email:''};
function tabState(id){return tabUI[id]||(tabUI[id]={filter:'all',q:'',open:false});}

/* ───────── LOOKUPS ───────── */
function todoTabs(){return state.tabs.filter(t=>t.type==='todo');}
function tabById(id){return state.tabs.find(t=>t.id===id);}
function getDayList(wk,dk,create){if(!state.weeklyTasks[wk]){if(!create)return[];state.weeklyTasks[wk]={};}if(!state.weeklyTasks[wk][dk]){if(!create)return[];state.weeklyTasks[wk][dk]=[];}return state.weeklyTasks[wk][dk];}
function getList(loc){
  if(loc.kind==='hp')return state.highPriority;
  if(loc.kind==='day')return getDayList(loc.wk,loc.dk,true);
  if(loc.kind==='item')return state.items[loc.tabId]||(state.items[loc.tabId]=[]);
  if(loc.kind==='archive')return state.hpArchive;
  return[];
}
function findTask(id){
  if(!id)return null;
  let i=state.highPriority.findIndex(t=>t.id===id);
  if(i>=0)return{kind:'hp',list:state.highPriority,task:state.highPriority[i],index:i};
  for(const wk in state.weeklyTasks)for(const dk in state.weeklyTasks[wk]){const l=state.weeklyTasks[wk][dk];if(!Array.isArray(l))continue;i=l.findIndex(x=>x.id===id);if(i>=0)return{kind:'day',wk,dk,list:l,task:l[i],index:i};}
  for(const tid in state.items){const l=state.items[tid];if(!Array.isArray(l))continue;i=l.findIndex(x=>x.id===id);if(i>=0)return{kind:'item',tabId:tid,list:l,task:l[i],index:i};}
  i=state.hpArchive.findIndex(t=>t.id===id);
  if(i>=0)return{kind:'archive',list:state.hpArchive,task:state.hpArchive[i],index:i};
  return null;
}
function whereLabel(r){
  if(!r)return'';
  if(r.kind==='hp')return'Hitno';
  if(r.kind==='day')return shortDay(dateFromDk(r.dk));
  if(r.kind==='archive')return'Arhiva';
  if(r.kind==='item'){const t=tabById(r.tabId);return t?splitName(t.name).label:'';}
  return'';
}
function weekTasks(wk){
  const mon=mondayFromKey(wk);
  return getWeekDays(mon).map(d=>{const dk=formatDateKey(d);return{d,dk,tasks:(state.weeklyTasks[wk]&&state.weeklyTasks[wk][dk])||[]};});
}
function tabForTask(t){
  if(t.srcTab&&tabById(t.srcTab))return tabById(t.srcTab);
  if(t.src){const s=t.src.trim();return state.tabs.find(x=>x.name===s||splitName(x.name).label===splitName(s).label)||null;}
  return null;
}

/* ───────── REMINDERS ───────── */
function allTasksIter(cb){
  state.highPriority.forEach(t=>cb(t,{kind:'hp'}));
  for(const wk in state.weeklyTasks)for(const dk in state.weeklyTasks[wk])(state.weeklyTasks[wk][dk]||[]).forEach(t=>cb(t,{kind:'day',wk,dk}));
  for(const tid in state.items)(state.items[tid]||[]).forEach(t=>cb(t,{kind:'item',tabId:tid}));
}
function remState(t){
  if(!t.reminder||!t.reminder.on)return'';
  const at=new Date(t.reminder.at).getTime();if(isNaN(at))return'';
  if(!t.done&&!t.reminder.seen&&at<=Date.now())return'due';
  if(at>Date.now()&&at-Date.now()<864e5)return'soon';
  return'';
}
function reminders(){
  const due=[],soon=[];
  allTasksIter((t,loc)=>{const s=remState(t);if(s==='due')due.push({t,loc});else if(s==='soon'&&!t.done)soon.push({t,loc});});
  const by=(a,b)=>new Date(a.t.reminder.at)-new Date(b.t.reminder.at);
  return{due:due.sort(by),soon:soon.sort(by)};
}
function defaultRemAt(r){
  let d;
  if(r&&r.kind==='day')d=dateFromDk(r.dk);
  else if(r&&r.task&&r.task.due)d=fromInputDate(r.task.due);
  else{d=new Date();d.setMinutes(0,0,0);d.setHours(d.getHours()+1);return localDT(d);}
  d=new Date(d);d.setHours(9,0,0,0);
  if(d<new Date()){d=new Date();d.setMinutes(0,0,0);d.setHours(d.getHours()+1);}
  return localDT(d);
}

/* ───────── ROUTER ───────── */
function route(){
  const h=decodeURIComponent(location.hash.replace(/^#\/?/,'')).split('?')[0];const p=h.split('/');
  if(p[0]==='history')return{v:'history'};
  if(p[0]==='tab'&&p[1])return{v:'tab',id:p[1],hl:p[2]||''};
  if(p[0]==='web')return{v:'web',cat:p[1]||''};
  if(p[0]==='notes')return{v:'notes'};
  if(p[0]==='note'&&p[1])return{v:'note',id:p[1]};
  if(p[0]==='dash')return{v:'dash',hl:p[1]||''};
  if(VIEWS[p[0]])return{v:p[0],id:p[1]||'',sub:p[2]||''};
  return{v:'dash',hl:''};
}
function go(h){if(location.hash===h)renderAll();else location.hash=h;}
let lastView='';
function viewKey(r){return r.v+'/'+(r.id||'')+'/'+(r.sub||'');}
window.addEventListener('hashchange',()=>{const r=route();const k=viewKey(r);if(k!==lastView)window.scrollTo({top:0});renderAll();});

/* ───────── RENDER ───────── */
function renderAll(){
  if(!$('#app').classList.contains('ready'))return;
  const a=document.activeElement;const fk=a&&a.dataset?a.dataset.fk:null;
  const r=route();
  if(r.v==='tab'&&!tabById(r.id)){location.hash='#/';return;}
  if(r.v==='note'&&!noteById(r.id)){location.hash='#/notes';return;}
  if(r.v==='dash'&&r.hl){const f=findTask(r.hl);if(f&&f.kind==='day')viewingWeekKey=f.wk===getCurrentWeekKey()?null:f.wk;}
  if(typeof beforeRender==='function')beforeRender(r);
  renderShell(r);
  const v=$('#view');
  const k=viewKey(r);
  if(k!==lastView){v.style.animation='none';void v.offsetWidth;v.style.animation='';lastView=k;}
  if(r.v==='dash')v.innerHTML=viewDash();
  else if(r.v==='history')v.innerHTML=viewHistory();
  else if(r.v==='tab')v.innerHTML=viewTab(tabById(r.id));
  else if(r.v==='web')v.innerHTML=viewWeb(r.cat);
  else if(r.v==='notes')v.innerHTML=viewNotes();
  else if(r.v==='note')v.innerHTML=viewNote(noteById(r.id));
  else if(VIEWS[r.v])v.innerHTML=VIEWS[r.v].render(r);
  initSortables(r);
  if(VIEWS[r.v]&&VIEWS[r.v].after)VIEWS[r.v].after(r);
  $$('#view textarea.grow').forEach(autoGrow);
  if(r.v==='dash')gcalEnsureWeek(viewingWeekKey||getCurrentWeekKey());
  if(fk&&!(r.v==='note'&&focusBlock)){const n=document.querySelector(`[data-fk="${fk}"]`);if(n){n.focus({preventScroll:true});}}
  if(r.v==='note')autoGrowAll();
  if(r.hl){requestAnimationFrame(()=>{const el=document.querySelector(`[data-id="${CSS.escape(r.hl)}"]`);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('flash');}});}
  justToggled=null;justAdded=null;
  updateBadges();
}
function scheduleRemoteRender(){if(isBusy()){pendingRemote=true;return;}pendingRemote=false;renderAll();}
function isBusy(){
  if(dragging)return true;
  const a=document.activeElement;
  return!!(a&&a.closest&&a.closest('#view')&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.value);
}
document.addEventListener('focusout',()=>setTimeout(()=>{if(pendingRemote&&!isBusy()){pendingRemote=false;renderAll();}},60));

/* ───────── SHELL (sidebar / topbar / bottom nav) ───────── */
function openCount(tabId){return(state.items[tabId]||[]).filter(i=>!i.done).length;}
function renderShell(r){
  const hpOpen=state.highPriority.filter(t=>!t.done).length;
  const navTabs=todoTabs().map(t=>{const n=splitName(t.name);const c=openCount(t.id);
    return`<a class="nav-item${r.v==='tab'&&r.id===t.id?' active':''}" href="#/tab/${encodeURIComponent(t.id)}" data-tab="${esc(t.id)}">
      <span class="emo">${esc(n.emo||'📁')}</span><span>${esc(n.label)}</span>
      <button class="nav-edit" data-act="tabEdit" data-id="${esc(t.id)}" title="Uredi listu" aria-label="Uredi listu">${icon('edit')}</button>
      ${c?`<span class="count">${c}</span>`:''}</a>`;}).join('');
  const navNotes=sortedNotes().slice(0,12).map(n=>{const st=noteStats(n);const nm=splitName(noteName(n));
    return`<a class="nav-item${r.v==='note'&&r.id===n.id?' active':''}" href="#/note/${encodeURIComponent(n.id)}"><span class="emo">${nm.emo?esc(nm.emo):icon('note')}</span><span class="nav-txt">${esc(nm.label)}</span>${st.total?`<span class="count">${st.done}/${st.total}</span>`:''}</a>`;}).join('');
  const switcher=sharedPlanners.length?`<label class="pswitch">${icon('users')}<select data-change="plannerSwitch" aria-label="Odaberi planner"><option value="">Moj planner</option>${sharedPlanners.map(p=>`<option value="${esc(p.uid)}" ${window._fbActiveUid&&window._fbActiveUid()===p.uid?'selected':''}>${esc(p.ownerName||p.ownerEmail)}</option>`).join('')}</select></label>`:'';
  $('#sidebar').innerHTML=`
    <div class="brand"><div class="brand-mark">${icon('check')}</div><b>Planner</b></div>
    <div class="nav-scroll">
      <a class="nav-item${r.v==='dash'?' active':''}" href="#/"><span class="emo">${icon('home')}</span><span>Dashboard</span>${hpOpen?`<span class="count hot">${hpOpen}</span>`:''}</a>
      <a class="nav-item${r.v==='history'?' active':''}" href="#/history"><span class="emo">${icon('history')}</span><span>Povijest</span></a>
      <a class="nav-item${r.v==='web'?' active':''}" href="#/web"><span class="emo">${icon('globe')}</span><span>Web stranice</span>${state.bookmarks.length?`<span class="count">${state.bookmarks.length}</span>`:''}</a>
      ${typeof sectionsNav==='function'?sectionsNav(r):''}
      <div class="nav-label">Liste <button data-act="tabEdit" data-id="" title="Nova lista" aria-label="Nova lista">${icon('plus')}</button></div>
      <div id="navTabs">${navTabs}</div>
      <div class="nav-label"><a href="#/notes" style="color:inherit;text-decoration:none">Notes</a> <button data-act="noteNew" data-tpl="blank" title="Nova bilješka" aria-label="Nova bilješka">${icon('plus')}</button></div>
      <a class="nav-item${r.v==='notes'?' active':''}" href="#/notes"><span class="emo">${icon('layers')}</span><span>Sve bilješke</span><span class="count">${state.notes.length||''}</span></a>
      ${navNotes}
    </div>
    ${switcher}
    <div class="side-foot">
      <div style="display:flex;gap:6px;align-items:center;justify-content:space-between">
        <span class="sync" id="syncSide"><span class="dot"></span><span class="txt">…</span></span>
        <span style="display:flex;gap:2px"><button class="ibtn" data-act="settings" title="Postavke">${icon('gear')}</button><button class="ibtn" data-act="theme" title="Tema">${icon(isDark()?'sun':'moon')}</button></span>
      </div>
      <div class="user-row">
        <div class="avatar">${user.photo?`<img src="${esc(user.photo)}" alt="" referrerpolicy="no-referrer">`:esc((user.name||'?')[0])}</div>
        <div class="who"><b>${esc(user.name||'Korisnik')}</b><small>${esc(user.email||(LOCAL_MODE?'Lokalni način':''))}</small></div>
        <button class="ibtn" data-act="logout" title="Odjava">${icon('logout')}</button>
      </div>
    </div>`;
  $('#deskTools').innerHTML=`<button class="ibtn" data-act="notif" title="Podsjetnici" id="bellDesk">${icon('bell')}</button>
    <button class="ibtn" data-act="quickAdd" title="Brzo dodaj (N)">${icon('plus')}</button>`;
  $('#topbar').innerHTML=`<a class="brand" href="#/" style="text-decoration:none"><div class="brand-mark">${icon('check')}</div><b>Planner</b></a>
    <span class="sync" id="syncTop"><span class="dot"></span><span class="txt">…</span></span>
    <button class="ibtn" data-act="notif" id="bellTop" aria-label="Podsjetnici">${icon('bell')}</button>
    <button class="ibtn" data-act="account" aria-label="Račun"><span class="avatar" style="width:28px;height:28px">${user.photo?`<img src="${esc(user.photo)}" alt="" referrerpolicy="no-referrer">`:esc((user.name||'?')[0])}</span></button>`;
  const isTab=r.v==='tab';
  $('#bottomNav').innerHTML=`
    <a href="#/" class="${r.v==='dash'?'on':''}">${icon('home')}Početna</a>
    <button data-act="lists" class="${isTab?'on':''}">${icon('list')}Liste</button>
    <a href="#/notes" class="${r.v==='notes'||r.v==='note'?'on':''}">${icon('note')}Notes</a>
    <a href="#/kids" class="${r.v==='kids'?'on':''}">${icon('kids')}Kids</a>
    <button data-act="more" class="${['history','web','kuharica','kokteli','diy','izleti'].includes(r.v)?'on':''}">${icon('grid')}Više</button>`;
  paintSync();
}
let syncState={type:'syncing',text:'Učitavam…'};
function setSyncStatus(type,text){syncState={type,text};paintSync();}
window.setSyncStatus=setSyncStatus;
function paintSync(){['#syncSide','#syncTop'].forEach(s=>{const el=$(s);if(!el)return;el.className='sync '+syncState.type;el.title=syncState.text;el.querySelector('.txt').textContent=syncState.text;});}
function updateBadges(){
  const n=reminders().due.length;
  ['#bellDesk','#bellTop'].forEach(s=>{const el=$(s);if(!el)return;const b=el.querySelector('.badge-dot');if(n){if(b)b.textContent=n;else el.insertAdjacentHTML('beforeend',`<span class="badge-dot">${n}</span>`);}else if(b)b.remove();});
  try{if(navigator.setAppBadge){n?navigator.setAppBadge(n):navigator.clearAppBadge();}}catch(e){}
}

/* ───────── TASK MARKUP ───────── */
function srcChip(t){
  const tab=tabForTask(t);
  if(tab){const n=splitName(tab.name);return`<a class="chip" href="#/tab/${encodeURIComponent(tab.id)}${t.srcItem?'/'+encodeURIComponent(t.srcItem):''}" title="Otvori izvornu stavku">${icon('folder')}${esc(n.emo)} ${esc(n.label)}</a>`;}
  if(t.src)return`<span class="chip">${icon('folder')}${esc(t.src)}</span>`;
  return'';
}
function taskHTML(t,o={}){
  const p=t.priority||'';
  const cls=['task'];if(o.compact)cls.push('compact');if(t.done)cls.push('is-done');if(p)cls.push('p-'+p);
  if(t.id===justToggled)cls.push('anim');if(t.id===justAdded)cls.push('anim-in');
  const meta=[];
  if(o.dayChip)meta.push(`<span class="chip">${icon('calendar')}${esc(o.dayChip)}</span>`);
  if(o.prioChip&&p)meta.push(`<span class="chip chip-prio-${p}">${{high:'Visok',medium:'Srednji',low:'Nizak'}[p]}</span>`);
  if(o.kind!=='item'){const s=srcChip(t);if(s)meta.push(s);}
  if(o.tabChip)meta.push(o.tabChip);
  if(t.link)meta.push(`<a class="chip chip-link" href="${esc(safeUrl(t.link))}" target="_blank" rel="noopener" title="${esc(t.link)}">${icon('link')}${esc(tryDomain(safeUrl(t.link)))}</a>`);
  if(o.kind==='item'){
    if(t.due){const dd=fromInputDate(t.due);const over=!t.done&&dd<today();meta.push(`<span class="chip chip-due${over?' over':''}">${icon('calendar')}Rok: ${esc(shortDay(dd))}</span>`);}
    if(t.todoId){const r=findTask(t.todoId);if(r&&r.kind!=='item')meta.push(`<a class="chip chip-todo" href="#/dash/${encodeURIComponent(t.todoId)}" title="Otvori na To Do listi">${icon('pin')}To Do · ${esc(whereLabel(r))}</a>`);}
    if(t.created&&!o.compact)meta.push(`<span class="chip">${icon('clock')}${new Date(t.created).toLocaleDateString('hr-HR')}</span>`);
  }
  if(t.gcal&&t.gcal.link)meta.push(`<a class="chip chip-gcal" href="${esc(safeUrl(t.gcal.link))}" target="_blank" rel="noopener" title="Otvori u Google Calendaru">${icon('calendar')}Kalendar</a>`);
  if(t.reminder&&t.reminder.on){const rs=remState(t);meta.push(`<span class="chip chip-rem ${rs}">${icon('bell')}${esc(fmtRem(t.reminder.at))}</span>`);}
  const note=o.kind==='item'?t.info:t.note;
  return`<li class="${cls.join(' ')}" data-id="${esc(t.id)}">
    ${o.drag===false?'':`<span class="grip" title="Povuci za premještanje">${icon('grip')}</span>`}
    <button class="check" data-act="toggle" data-id="${esc(t.id)}" aria-label="${t.done?'Vrati kao nedovršeno':'Označi kao gotovo'}">${icon('check')}</button>
    <div class="task-body" data-act="edit" data-id="${esc(t.id)}">
      <div class="task-title">${linkify(title(t))}</div>
      ${note&&!o.compact?`<div class="task-note">${linkify(note)}</div>`:''}
      ${meta.length?`<div class="task-meta">${meta.join('')}</div>`:''}
    </div>
    <div class="task-actions">
      ${o.send?`<button class="ibtn ibtn-accent" data-act="send" data-id="${esc(t.id)}" title="Pošalji na To Do listu">${icon('pin')}</button>`:''}
      <button class="ibtn" data-act="edit" data-id="${esc(t.id)}" title="Uredi">${icon('edit')}</button>
      <button class="ibtn ibtn-danger" data-act="del" data-id="${esc(t.id)}" title="Obriši">${icon('trash')}</button>
    </div>
  </li>`;
}

/* ═════════ DASHBOARD ═════════ */
function greet(){const h=new Date().getHours();return h<5?'Laku noć':h<12?'Dobro jutro':h<18?'Dobar dan':'Dobra večer';}
function viewDash(){
  const cur=getCurrentWeekKey();
  const wkData=weekTasks(cur);
  const all=wkData.flatMap(d=>d.tasks);const done=all.filter(t=>t.done).length;
  const todayD=wkData.find(d=>isToday(d.d));const todayTasks=todayD?todayD.tasks:[];
  const todayOpen=todayTasks.filter(t=>!t.done).length;
  const hpOpen=state.highPriority.filter(t=>!t.done).length;
  const rem=reminders();
  const pct=all.length?done/all.length:0;const C=2*Math.PI*15.5;
  const first=(user.name||'').split(' ')[0];
  const d=new Date();
  const hpDone=state.highPriority.filter(t=>t.done).length;
  return`
  <section class="hero">
    <div class="hero-top">
      <div>
        <h1>${greet()}${first?`, ${esc(first)}`:''} 👋</h1>
        <div class="sub">${DAY_NAMES[dayIdx(d)]}, ${d.getDate()}. ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}. · ${todayOpen?`danas te čeka ${todayOpen} ${todayOpen===1?'zadatak':todayOpen<5?'zadatka':'zadataka'}`:'danas nema otvorenih zadataka'}</div>
      </div>
    </div>
    <div class="stats">
      <a class="stat" href="#hpCard" data-act="scrollTo" data-target="hpCard"><div class="ico ico-urgent">${icon('flame')}</div><div><div class="num">${hpOpen}</div><div class="lbl">Hitno otvoreno</div></div></a>
      <a class="stat" href="#agendaCard" data-act="scrollTo" data-target="agendaCard"><div class="ico ico-accent">${icon('today')}</div><div><div class="num">${todayOpen}<small style="font-size:.9rem;color:var(--text-3)">/${todayTasks.length}</small></div><div class="lbl">Danas</div></div></a>
      <a class="stat" href="#boardCard" data-act="scrollTo" data-target="boardCard"><svg class="ring" viewBox="0 0 36 36"><circle class="bgc" cx="18" cy="18" r="15.5"/><circle class="fg" cx="18" cy="18" r="15.5" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/></svg><div><div class="num">${Math.round(pct*100)}%</div><div class="lbl">Tjedan · ${done}/${all.length}</div></div></a>
      <button class="stat" data-act="notif"><div class="ico ico-warn">${icon('bell')}</div><div><div class="num">${rem.due.length}${rem.soon.length?`<small style="font-size:.9rem;color:var(--text-3)"> +${rem.soon.length}</small>`:''}</div><div class="lbl">Podsjetnici</div></div></button>
    </div>
  </section>
  ${typeof dashExtra==='function'?dashExtra():''}

  <div class="dash-grid">
    <section class="card card-urgent" id="hpCard">
      <div class="card-head">
        <h2>${icon('flame')} Hitno</h2><span class="pill pill-urgent">Prioritet</span>
        <span class="spacer"></span>
        ${hpDone?`<button class="btn btn-ghost btn-sm" data-act="archiveHp" title="Premjesti završene u povijest">${icon('archive')}Arhiviraj ${hpDone}</button>`:''}
      </div>
      <div class="card-body">
        <ul class="tasks" id="hpList" data-empty="Nema hitnih stavki 🎉">${state.highPriority.map(t=>taskHTML(t,{kind:'hp'})).join('')}</ul>
        <div class="add-row">
          <input class="input" id="hpInput" data-fk="hp" data-enter="addHp" placeholder="Dodaj hitnu stavku… (zalijepi i link)" autocomplete="off">
          <button class="btn btn-primary" data-act="addHp">${icon('plus')}<span>Dodaj</span></button>
        </div>
        <div style="font-size:.76rem;color:var(--text-3);margin-top:8px">Povuci ${icon('grip','')} za promjenu redoslijeda — gore je najvažnije.</div>
      </div>
    </section>

    <section class="card" id="agendaCard">
      <div class="card-head">
        <h2>${icon('calendar')} Ovaj tjedan</h2><span class="pill pill-week">${formatWeekRange(mondayFromKey(cur))}</span>
        <span class="spacer"></span>
        <a class="link-btn" href="#/history">${icon('history')}Povijest ${icon('arrowR')}</a>
      </div>
      <div class="card-body">${agendaHTML(wkData)}</div>
    </section>
  </div>

  <section class="card" id="boardCard">
    <div class="card-head">
      <h2>${icon('layers')} Tjedni plan</h2>
      <span class="pill ${viewingWeekKey&&viewingWeekKey!==cur?'':'pill-week'}">${viewingWeekKey&&viewingWeekKey!==cur?'Odabrani tjedan':'Ovaj tjedan'}</span>
      <span class="spacer"></span>
      ${gcalBoardBtn()}${boardNavHTML()}
    </div>
    <div class="card-body">
      <div class="board-wrap"><div class="board" id="board">${boardHTML()}</div></div>
      <div style="font-size:.76rem;color:var(--text-3);margin-top:4px">Povuci zadatak gore/dolje za prioritet ili na drugi dan. Klik na zadatak otvara uređivanje.</div>
    </div>
  </section>`;
}
function agendaHTML(wkData){
  const items=[];
  todoTabs().forEach(tab=>(state.items[tab.id]||[]).forEach(it=>{if(it.due&&!it.todoId){const dk=formatDateKey(fromInputDate(it.due));items.push({dk,it,tab});}}));
  let out='',shown=0,freeDays=[];
  wkData.forEach(({d,dk,tasks})=>{
    const extra=items.filter(x=>x.dk===dk);
    const td=isToday(d);
    const evs=gcalEventsFor(getCurrentWeekKey(),d);
    if(!tasks.length&&!extra.length&&!evs.length){if(!td){freeDays.push(DAY_SHORT[dayIdx(d)]);return;}}
    shown++;
    const open=tasks.filter(t=>!t.done).length;
    out+=`<div class="agenda-day${td?' today':''}${isPast(d)&&!td?' past':''}">
      <div class="agenda-head">${td?'Danas':DAY_NAMES[dayIdx(d)]} <span class="d">${formatDayLabel(d)}</span><span class="cnt">${tasks.length?`${tasks.length-open}/${tasks.length} gotovo`:''}</span></div>
      ${evs.length?`<div class="gevs">${evs.map(gcalEvHTML).join('')}</div>`:''}
      ${tasks.length||extra.length?`<ul class="tasks">${tasks.map(t=>taskHTML(t,{kind:'day',drag:false,prioChip:true})).join('')}${extra.map(x=>{const n=splitName(x.tab.name);return taskHTML(x.it,{kind:'item',drag:false,compact:true,tabChip:`<a class="chip" href="#/tab/${encodeURIComponent(x.tab.id)}/${encodeURIComponent(x.it.id)}">${icon('folder')}${esc(n.emo)} ${esc(n.label)} · rok</a>`});}).join('')}</ul>`:`<div class="agenda-free">Ništa planirano — dodaj u tjednom planu ispod.</div>`}
    </div>`;
  });
  if(!shown)out=`<div class="empty"><span class="big">🗓️</span>Ovaj tjedan još nema zadataka.<br>Dodaj ih u tjednom planu ispod.</div>`;
  if(freeDays.length&&shown)out+=`<div class="agenda-rest">Slobodno: ${freeDays.join(', ')}</div>`;
  return out;
}
function boardNavHTML(){
  const wk=viewingWeekKey||getCurrentWeekKey();const mon=mondayFromKey(wk);const isCur=wk===getCurrentWeekKey();
  return`<div class="week-nav">
    <span class="range">${formatWeekRange(mon)}</span>
    <button class="ibtn" data-act="weekNav" data-dir="-1" title="Prethodni tjedan">${icon('chevL')}</button>
    ${isCur?'':`<button class="btn btn-week btn-sm" data-act="weekNav" data-dir="0">Ovaj tjedan</button>`}
    <button class="ibtn" data-act="weekNav" data-dir="1" title="Sljedeći tjedan">${icon('chevR')}</button>
    <input type="date" data-change="pickWeek" value="${localISO(mon)}" title="Skoči na tjedan" aria-label="Odaberi tjedan">
  </div>`;
}
function boardHTML(){
  const wk=viewingWeekKey||getCurrentWeekKey();
  return weekTasks(wk).map(({d,dk,tasks},i)=>{
    const td=isToday(d),past=isPast(d)&&!td;
    const open=tasks.filter(t=>!t.done).length;
    const pr=dayPrio[dk]||'';
    return`<div class="day${td?' today':''}${past?' past collapsed':''}" data-dk="${dk}">
      <div class="day-head">
        <div><div class="dn">${DAY_NAMES[i]}</div><div class="dd">${formatDayLabel(d)}</div></div>
        <div class="meta">${tasks.length?`<span class="cnt" title="otvoreno / ukupno">${open}/${tasks.length}</span>`:''}
          <button class="ibtn" data-act="dayMenu" data-wk="${wk}" data-dk="${dk}" title="Opcije dana">${icon('more')}</button></div>
      </div>
      ${(()=>{const ev=gcalEventsFor(wk,d);return ev.length?`<div class="gevs">${ev.map(gcalEvHTML).join('')}</div>`:'';})()}
      <ul class="tasks day-list" data-wk="${wk}" data-dk="${dk}" data-empty="—">${tasks.map(t=>taskHTML(t,{kind:'day',compact:true})).join('')}</ul>
      <div class="day-add">
        <button class="prio-btn" data-act="cyclePrio" data-dk="${dk}" title="Prioritet: ${{high:'visok',medium:'srednji',low:'nizak'}[pr]||'bez'} (klik za promjenu)"><span class="pd pd-${pr}"></span></button>
        <input data-fk="day-${dk}" data-enter="addDay" data-wk="${wk}" data-dk="${dk}" placeholder="Dodaj…" autocomplete="off" aria-label="Dodaj zadatak za ${DAY_NAMES[i]}">
        <button class="go" data-act="addDay" data-wk="${wk}" data-dk="${dk}" aria-label="Dodaj">${icon('plus')}</button>
      </div>
    </div>`;
  }).join('');
}

/* ═════════ HISTORY ═════════ */
function viewHistory(){
  const cur=getCurrentWeekKey();
  const q=histSearch.trim().toLowerCase();
  const weeks=Object.keys(state.weeklyTasks).filter(wk=>wk!==cur&&Object.values(state.weeklyTasks[wk]||{}).some(l=>l&&l.length)).sort((a,b)=>b.localeCompare(a));
  const archive=[...state.hpArchive,...state.highPriority.filter(t=>t.done)].sort((a,b)=>(b.doneAt||0)-(a.doneAt||0));
  let body='';
  if(histMode==='weeks'){
    const list=weeks.map(wk=>{
      const wd=weekTasks(wk);let all=wd.flatMap(x=>x.tasks);
      if(q&&!all.some(t=>title(t).toLowerCase().includes(q)))return'';
      const done=all.filter(t=>t.done).length;const mon=mondayFromKey(wk);const future=mon>today();
      return`<section class="card hist-week${q?' open':''}" data-wk="${wk}">
        <div class="hist-head" data-act="histToggle">
          <div><div class="t">${formatWeekRange(mon)}</div><div class="s">${future?'Budući tjedan · ':''}${done}/${all.length} završeno</div></div>
          <div class="bar"><i style="width:${all.length?Math.round(done/all.length*100):0}%"></i></div>
          <span class="chev">${icon('chevR')}</span>
        </div>
        <div class="hist-body">
          <div class="hist-days">${wd.filter(x=>x.tasks.length).map(({d,tasks})=>`<div class="hist-day"><div class="dn">${DAY_NAMES[dayIdx(d)]}</div><div class="dd">${formatDayLabel(d)}</div>
            ${tasks.filter(t=>!q||title(t).toLowerCase().includes(q)).map(t=>`<div class="hist-task${t.done?' done':''}">${icon(t.done?'check':'clock')}<span>${linkify(title(t))}</span></div>`).join('')}</div>`).join('')}</div>
          <div class="hist-actions">
            <button class="btn btn-week btn-sm" data-act="histOpen" data-wk="${wk}">${icon('calendar')}Otvori u tjednom planu</button>
            <button class="btn btn-ghost btn-sm" data-act="histCarry" data-wk="${wk}">${icon('moveR')}Prenesi nedovršeno u ovaj tjedan</button>
            <button class="btn btn-danger btn-sm" data-act="histDel" data-wk="${wk}">${icon('trash')}Obriši tjedan</button>
          </div>
        </div>
      </section>`;}).join('');
    body=list||`<div class="card empty" style="padding:40px"><span class="big">📭</span>${q?'Ništa ne odgovara pretrazi.':'Još nema prošlih tjedana.'}</div>`;
  }else{
    const list=archive.filter(t=>!q||title(t).toLowerCase().includes(q));
    body=list.length?`<section class="card"><div class="card-body" style="padding-top:12px"><ul class="tasks">${list.map(t=>taskHTML(t,{kind:'archive',drag:false,dayChip:t.doneAt?'Gotovo '+shortDay(new Date(new Date(t.doneAt).setHours(0,0,0,0))):''})).join('')}</ul></div></section>`
      :`<div class="card empty" style="padding:40px"><span class="big">🗂️</span>${q?'Ništa ne odgovara pretrazi.':'Završene hitne stavke pojavit će se ovdje.'}</div>`;
  }
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>Povijest</h1><p>Prošli tjedni i završene hitne stavke.</p></div></div>
  <div class="list-tools">
    <div class="seg"><button class="${histMode==='weeks'?'on':''}" data-act="histMode" data-m="weeks">${icon('calendar')}Tjedni (${weeks.length})</button><button class="${histMode==='hp'?'on':''}" data-act="histMode" data-m="hp">${icon('flame')}Hitno završeno (${archive.length})</button></div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="hsearch" data-input="histSearch" value="${esc(histSearch)}" placeholder="Pretraži povijest…"></label>
  </div>
  ${body}`;
}

/* ═════════ TAB (LISTA) ═════════ */
function viewTab(tab){
  const ts=tabState(tab.id);const items=state.items[tab.id]||[];const n=splitName(tab.name);
  const done=items.filter(i=>i.done).length;
  const q=ts.q.trim().toLowerCase();
  let vis=items.filter(i=>ts.filter==='pending'?!i.done:ts.filter==='done'?i.done:true);
  if(q)vis=vis.filter(i=>(i.desc+' '+(i.info||'')+' '+(i.link||'')).toLowerCase().includes(q));
  if((tab.sort||'priority')==='priority'){const p={high:0,medium:1,low:2};vis=[...vis].sort((a,b)=>(a.done-b.done)||((p[a.priority]??1)-(p[b.priority]??1)));}
  else if(tab.sort==='due'){vis=[...vis].sort((a,b)=>(a.done-b.done)||((a.due||'9999').localeCompare(b.due||'9999')));}
  return`
  <div class="page-head">
    <div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1><span class="emo">${esc(n.emo)}</span>${esc(n.label)}</h1>
      <div class="mini-stats" style="margin-top:8px"><span class="pill">${items.length} ukupno</span><span class="pill pill-urgent">${items.length-done} na čekanju</span><span class="pill pill-ok">${done} završeno</span></div></div>
    <button class="btn btn-outline btn-sm" data-act="tabEdit" data-id="${esc(tab.id)}">${icon('edit')}Uredi listu</button>
  </div>

  <section class="card quick-add${ts.open?' open':''}" id="qa">
    <div class="row">
      <input class="input" id="qa_desc" data-fk="qa-${esc(tab.id)}" data-enter="itemAdd" placeholder="Nova stavka… (Enter za dodavanje)" autocomplete="off">
      <button class="ibtn" data-act="qaMore" title="Više opcija" aria-label="Više opcija">${icon('more')}</button>
      <button class="btn btn-primary" data-act="itemAdd">${icon('plus')}<span>Dodaj</span></button>
    </div>
    <div class="quick-more grid2">
      <div class="field"><label for="qa_link">Link</label><input id="qa_link" type="url" placeholder="https://…"></div>
      <div class="field"><label>Prioritet</label>${prioSeg('qa_prio','medium')}</div>
      <div class="field"><label for="qa_due">Rok (pojavljuje se u “Ovaj tjedan”)</label><input id="qa_due" type="date"></div>
      <div class="field full"><label for="qa_info">Dodatne informacije</label><textarea id="qa_info" placeholder="Napomene, cijena, detalji…"></textarea></div>
    </div>
  </section>

  <div class="list-tools">
    <div class="seg">
      <button class="${ts.filter==='all'?'on':''}" data-act="filter" data-f="all">Sve</button>
      <button class="${ts.filter==='pending'?'on':''}" data-act="filter" data-f="pending">Na čekanju</button>
      <button class="${ts.filter==='done'?'on':''}" data-act="filter" data-f="done">Završeno</button>
    </div>
    <div class="seg" title="Redoslijed">
      <button class="${(tab.sort||'priority')==='priority'?'on':''}" data-act="tabSort" data-s="priority">${icon('sort')}Prioritet</button>
      <button class="${tab.sort==='manual'?'on':''}" data-act="tabSort" data-s="manual">${icon('grip')}Ručno</button>
      <button class="${tab.sort==='due'?'on':''}" data-act="tabSort" data-s="due">${icon('calendar')}Rok</button>
    </div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="tsearch" data-input="tabSearch" data-id="${esc(tab.id)}" value="${esc(ts.q)}" placeholder="Pretraži…"></label>
  </div>
  <ul class="tasks items" id="itemList" data-tab="${esc(tab.id)}" data-empty="${q?'Ništa ne odgovara pretrazi.':'Nema stavki — dodaj prvu gore.'}">${vis.map(i=>taskHTML(i,{kind:'item',send:true,prioChip:true})).join('')}</ul>
  <div style="font-size:.76rem;color:var(--text-3);margin-top:6px">${icon('pin')} šalje stavku na To Do listu (hitno ili na određeni dan) — ostaju povezane: kvačica na jednom mjestu označi i drugo.</div>`;
}
function prioSeg(name,val,withNone){
  const opts=[...(withNone?[['','Bez']]:[]),['high','Visok'],['medium','Srednji'],['low','Nizak']];
  return`<div class="seg" data-seg="${name}">${opts.map(([v,l])=>`<button type="button" class="${(val||'')===v?'on':''}" data-act="segPick" data-v="${v}"><span class="pd pd-${v}"></span>${l}</button>`).join('')}</div>`;
}
function segVal(name,root=document){const b=root.querySelector(`[data-seg="${name}"] button.on`);return b?b.dataset.v:'';}

/* ═════════ WEB STRANICE ═════════ */
function viewWeb(catParam){
  const cats=state.bookmarkCats;
  if(catParam&&cats.find(c=>c.id===catParam))activeBmCat=catParam;
  if(!cats.find(c=>c.id===activeBmCat))activeBmCat=cats[0].id;
  lsSet('planner.bmcat',activeBmCat);
  const q=bmSearch.trim().toLowerCase();
  let bms=q?state.bookmarks.filter(b=>(b.name+' '+b.url+' '+(b.note||'')).toLowerCase().includes(q)):state.bookmarks.filter(b=>b.catId===activeBmCat);
  const cat=cats.find(c=>c.id===activeBmCat);
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>Web stranice</h1><p>${state.bookmarks.length} spremljenih stranica u ${cats.length} ${cats.length===1?'kategoriji':'kategorija'}.</p></div>
    <button class="btn btn-primary" data-act="bmEdit" data-id="">${icon('plus')}Dodaj stranicu</button></div>
  <div class="list-tools" style="margin-top:0">
    <label class="searchbox">${icon('search')}<input class="input" data-fk="bsearch" data-input="bmSearch" value="${esc(bmSearch)}" placeholder="Pretraži sve stranice…"></label>
  </div>
  ${q?'':`<div class="cats">${cats.map(c=>`<a class="cat${c.id===activeBmCat?' on':''}" href="#/web/${encodeURIComponent(c.id)}">${esc(c.name)}<span class="n">${state.bookmarks.filter(b=>b.catId===c.id).length}</span></a>`).join('')}
    <button class="cat cat-add" data-act="catEdit" data-id="">${icon('plus')}Kategorija</button></div>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><b style="font-family:var(--display);font-size:1.1rem">${esc(cat.name)}</b><button class="ibtn" data-act="catEdit" data-id="${esc(cat.id)}" title="Uredi kategoriju">${icon('edit')}</button></div>`}
  <div class="bm-grid" id="bmGrid">${bms.length?bms.map(bmHTML).join(''):`<div class="card empty" style="grid-column:1/-1;padding:36px"><span class="big">🌐</span>${q?'Ništa ne odgovara pretrazi.':'Nema stranica u ovoj kategoriji.'}</div>`}</div>`;
}
function bmHTML(b){
  const dom=tryDomain(safeUrl(b.url));const cat=state.bookmarkCats.find(c=>c.id===b.catId);
  return`<div class="bm" data-id="${esc(b.id)}">
    <span class="grip" title="Povuci">${icon('grip')}</span>
    <div class="bm-top"><div class="fav"><img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(dom)}&sz=64" alt="" loading="lazy" data-fav></div>
      <div style="min-width:0"><div class="bm-name">${esc(b.name)}</div><div class="bm-url">${esc(dom)}${bmSearch&&cat?` · ${esc(cat.name)}`:''}</div></div></div>
    ${b.note?`<div class="bm-note">${linkify(b.note)}</div>`:''}
    <div class="bm-actions">
      <button class="ibtn" data-act="bmEdit" data-id="${esc(b.id)}" title="Uredi">${icon('edit')}</button>
      <button class="ibtn ibtn-danger" data-act="bmDel" data-id="${esc(b.id)}" title="Obriši">${icon('trash')}</button>
      <span class="spacer"></span>
      <a class="btn btn-ghost btn-sm" href="${esc(safeUrl(b.url))}" target="_blank" rel="noopener">Otvori ${icon('ext')}</a>
    </div></div>`;
}

/* ═════════ NOTES (bilješke s checklistama) ═════════ */
const NOTE_TPL={
  blank:{title:'',blocks:[['p','']]},
  check:{title:'',blocks:[['c','']]},
  shop:{title:'🛒 Popis za dućan',blocks:[['c','']]},
  material:{title:'🧱 Popis materijala',blocks:[['h','Materijal'],['c',''],['p','']]},
};
function noteById(id){return state.notes.find(n=>n.id===id);}
function noteName(n){return(n.title||'').trim()||'Bez naslova';}
function noteStats(n){const c=n.blocks.filter(b=>b.t==='c'&&b.x.trim());return{total:c.length,done:c.filter(b=>b.d).length};}
function sortedNotes(){return[...state.notes].sort((a,b)=>(!!b.pin-!!a.pin)||((b.updated||0)-(a.updated||0)));}
function newNote(tpl='blank'){
  const T=NOTE_TPL[tpl]||NOTE_TPL.blank;
  const n={id:uid('n'),title:T.title||`Notes ${state.notes.length+1}`,blocks:T.blocks.map(([t,x])=>({id:uid('b'),t,x,d:false})),created:Date.now(),updated:Date.now(),hideDone:false};
  state.notes.push(n);saveData();
  focusBlock=n.blocks.find(b=>b.t==='c')?.id||null;
  go('#/note/'+n.id);
  if(!focusBlock)setTimeout(()=>{const ti=$('#noteTitle');ti&&(ti.focus(),ti.select());},80);
  return n;
}
let focusBlock=null,focusCaret=null,lastNoteBlock=null;
function viewNotes(){
  const notes=sortedNotes();
  const card=n=>{const s=noteStats(n);const prev=n.blocks.filter(b=>b.x.trim()).slice(0,5);
    return`<a class="ncard" href="#/note/${encodeURIComponent(n.id)}">
      <div class="ncard-top"><b>${esc(noteName(n))}</b>${n.pin?`<span class="pill">${icon('pin')}</span>`:''}</div>
      <div class="ncard-prev">${prev.map(b=>b.t==='c'?`<div class="pc${b.d?' d':''}">${icon(b.d?'check':'square')}<span>${esc(b.x)}</span></div>`:b.t==='h'?`<div class="ph">${esc(b.x)}</div>`:`<div class="pp">${esc(b.x)}</div>`).join('')||'<div class="pp" style="color:var(--text-3)">Prazno</div>'}</div>
      <div class="ncard-foot">${s.total?`<div class="bar"><i style="width:${Math.round(s.done/s.total*100)}%"></i></div><span>${s.done}/${s.total}</span>`:'<span></span>'}<span>${new Date(n.updated||n.created).toLocaleDateString('hr-HR')}</span></div>
    </a>`;};
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>Notes</h1><p>Bilješke, popisi za dućan i materijal — s checklistama.</p></div></div>
  <div class="tpl-row">
    <button class="tpl" data-act="noteNew" data-tpl="blank">${icon('note')}<b>Prazna bilješka</b></button>
    <button class="tpl" data-act="noteNew" data-tpl="check">${icon('checklist')}<b>Checklista</b></button>
    <button class="tpl" data-act="noteNew" data-tpl="shop">🛒<b>Popis za dućan</b></button>
    <button class="tpl" data-act="noteNew" data-tpl="material">🧱<b>Popis materijala</b></button>
  </div>
  <div class="ngrid">${notes.length?notes.map(card).join(''):`<div class="card empty" style="grid-column:1/-1;padding:36px"><span class="big">📝</span>Još nema bilješki — odaberi predložak gore.</div>`}</div>`;
}
function noteBlockHTML(b){
  const ph=b.t==='c'?'Stavka…':b.t==='h'?'Naslov':'Piši… (počni s "[] " za checklistu)';
  return`<div class="nb nb-${b.t}${b.d?' done':''}" data-bid="${esc(b.id)}">
    <span class="grip" title="Povuci">${icon('grip')}</span>
    ${b.t==='c'?`<button class="ncheck" data-act="nbToggle" data-bid="${esc(b.id)}" aria-label="${b.d?'Odznači':'Označi'}">${icon('check')}</button>`:''}
    <textarea class="nb-in" rows="1" data-fk="nb-${esc(b.id)}" data-bid="${esc(b.id)}" placeholder="${ph}" spellcheck="true">${esc(b.x)}</textarea>
    <button class="ibtn nb-del" data-act="nbDel" data-bid="${esc(b.id)}" title="Ukloni" aria-label="Ukloni">${icon('x')}</button>
  </div>`;
}
function viewNote(n){
  const s=noteStats(n);
  const blocks=n.hideDone?n.blocks.filter(b=>!(b.t==='c'&&b.d)):n.blocks;
  return`
  <div class="page-head note-head"><div style="flex:1;min-width:0"><a class="crumb" href="#/notes">${icon('chevL')}Notes</a>
    <input class="note-title" id="noteTitle" data-fk="ntitle" data-note-title="${esc(n.id)}" value="${esc(n.title)}" placeholder="Naslov" maxlength="80" aria-label="Naslov bilješke"></div>
    <button class="ibtn" data-act="noteMenu" data-id="${esc(n.id)}" title="Opcije" aria-label="Opcije">${icon('more')}</button>
  </div>
  <section class="card note-card">
    <div class="note-tools">
      <button class="btn btn-ghost btn-sm" data-act="nbAdd" data-t="c">${icon('checklist')}Checklista</button>
      <button class="btn btn-ghost btn-sm" data-act="nbAdd" data-t="p">${icon('note')}Tekst</button>
      <button class="btn btn-ghost btn-sm" data-act="nbAdd" data-t="h">${icon('heading')}Naslov</button>
      <span class="spacer"></span>
      ${s.total?`<div class="note-prog"><div class="bar"><i style="width:${Math.round(s.done/s.total*100)}%"></i></div><b>${s.done}/${s.total}</b></div>
      <div class="seg"><button class="${n.hideDone?'':'on'}" data-act="noteHide" data-v="0">Sve</button><button class="${n.hideDone?'on':''}" data-act="noteHide" data-v="1">Neoznačeno</button></div>`:''}
    </div>
    <div class="nblocks" id="noteBlocks" data-note="${esc(n.id)}">${blocks.map(noteBlockHTML).join('')}</div>
    <button class="nb-add-end" data-act="nbAdd" data-t="${n.blocks.length&&n.blocks[n.blocks.length-1].t==='c'?'c':'p'}">${icon('plus')}Dodaj ${n.blocks.length&&n.blocks[n.blocks.length-1].t==='c'?'stavku':'redak'}</button>
    ${n.hideDone&&s.done?`<div class="agenda-rest">${s.done} označenih skriveno</div>`:''}
  </section>
  <div style="font-size:.76rem;color:var(--text-3);margin-top:8px">Enter u checklisti dodaje novu stavku · Backspace na praznoj briše · zalijepljeni popis (više redaka) postaje više stavki · promjene se spremaju i sinkroniziraju same.</div>`;
}
function autoGrow(t){t.style.height='auto';t.style.height=t.scrollHeight+'px';}
function autoGrowAll(){$$('.nb-in').forEach(autoGrow);
  if(focusBlock){const el=$(`.nb-in[data-bid="${CSS.escape(focusBlock)}"]`);if(el){el.focus({preventScroll:false});const p=focusCaret==null?el.value.length:focusCaret;el.setSelectionRange(p,p);}focusBlock=null;focusCaret=null;}}
function curNote(){const r=route();return r.v==='note'?noteById(r.id):null;}
function touchNote(n){n.updated=Date.now();saveData();}
function insertBlock(n,afterId,t,x='',focus=true){
  const b={id:uid('b'),t,x,d:false};const i=afterId?n.blocks.findIndex(z=>z.id===afterId):-1;
  n.blocks.splice(i<0?n.blocks.length:i+1,0,b);if(focus){focusBlock=b.id;focusCaret=0;}return b;
}
function refreshNoteStats(n){ // osvježi traku napretka bez re-rendera (da se ne izgubi fokus)
  const s=noteStats(n);const pr=$('.note-prog');
  if(pr){pr.querySelector('i').style.width=(s.total?Math.round(s.done/s.total*100):0)+'%';pr.querySelector('b').textContent=`${s.done}/${s.total}`;}
}
function noteKeydown(e,ta){
  const n=curNote();if(!n)return false;const b=n.blocks.find(z=>z.id===ta.dataset.bid);if(!b)return false;
  const pos=ta.selectionStart,end=ta.selectionEnd;
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&(b.t==='c'||b.t==='h')){
    e.preventDefault();
    if(b.t==='c'&&!b.x.trim()){b.t='p';b.x='';touchNote(n);focusBlock=b.id;renderAll();return true;} // prazna stavka + Enter = izlaz iz liste
    const rest=b.x.slice(end);b.x=b.x.slice(0,pos);
    insertBlock(n,b.id,b.t==='h'?'p':'c',rest);focusCaret=0;touchNote(n);renderAll();return true;
  }
  if(e.key==='Backspace'&&pos===0&&end===0){
    if(!b.x&&n.blocks.length>1){e.preventDefault();const i=n.blocks.indexOf(b);n.blocks.splice(i,1);const prev=n.blocks[Math.max(0,i-1)];focusBlock=prev.id;focusCaret=null;touchNote(n);renderAll();return true;}
    if(b.t!=='p'){e.preventDefault();b.t='p';b.d=false;focusBlock=b.id;focusCaret=0;touchNote(n);renderAll();return true;}
  }
  if((e.key==='ArrowUp'&&pos===0)||(e.key==='ArrowDown'&&end===ta.value.length)){
    const all=$$('.nb-in');const i=all.indexOf(ta);const nx=all[e.key==='ArrowUp'?i-1:i+1];
    if(nx){e.preventDefault();nx.focus();const p=e.key==='ArrowUp'?nx.value.length:0;nx.setSelectionRange(p,p);return true;}
  }
  return false;
}
function noteInput(ta){
  const n=curNote();if(!n)return;const b=n.blocks.find(z=>z.id===ta.dataset.bid);if(!b)return;
  let v=ta.value;
  if(b.t==='p'){
    const m=v.match(/^(\[\s?\]|- \[\s?\]|\* |- )\s?/);const h=v.match(/^#\s/);
    if(m&&v.indexOf('\n')<0){b.t='c';b.x=v.slice(m[0].length);touchNote(n);focusBlock=b.id;focusCaret=b.x.length;renderAll();return;}
    if(h&&v.indexOf('\n')<0){b.t='h';b.x=v.slice(2);touchNote(n);focusBlock=b.id;focusCaret=b.x.length;renderAll();return;}
  }
  b.x=v;autoGrow(ta);touchNote(n);refreshNoteStats(n);
}
function notePaste(e,ta){
  const n=curNote();if(!n)return;const b=n.blocks.find(z=>z.id===ta.dataset.bid);if(!b||b.t!=='c')return;
  const txt=(e.clipboardData||window.clipboardData).getData('text');if(!txt||txt.indexOf('\n')<0)return;
  e.preventDefault();
  const lines=txt.split(/\r?\n/).map(l=>l.replace(/^\s*(?:[-*•]|\[\s?[xX ]?\]|☐|☑|\d+[.)])\s*/,'').trim()).filter(Boolean);
  const pos=ta.selectionStart;let rest=lines;
  if(!(b.x.trim()&&pos===b.x.length)){b.x=b.x.slice(0,pos)+lines[0]+b.x.slice(ta.selectionEnd);rest=lines.slice(1);} // inače sve postaju nove stavke
  let after=b.id;rest.forEach(l=>{after=insertBlock(n,after,'c',l,false).id;});
  focusBlock=after;focusCaret=null;touchNote(n);renderAll();toast(`Dodano ${lines.length} stavki`);
}
function noteAsText(n){return[noteName(n),'',...n.blocks.map(b=>b.t==='c'?`${b.d?'☑':'☐'} ${b.x}`:b.t==='h'?`\n${b.x.toUpperCase()}`:b.x)].join('\n').trim();}
function openNoteMenu(id){
  const n=noteById(id);if(!n)return;const s=noteStats(n);
  openSheet({title:esc(noteName(n)),side:true,body:`<div class="sheet-list">
    <button class="row" data-nm="uncheck">${icon('square')}Odznači sve<span class="count">${s.done}</span></button>
    <button class="row" data-nm="bottom">${icon('sort')}Označene na dno</button>
    <button class="row" data-nm="clear">${icon('trash')}Obriši označene stavke<span class="count">${s.done}</span></button>
    <button class="row" data-nm="copy">${icon('copy')}Kopiraj kao tekst</button>
    <button class="row" data-nm="todo">${icon('pin')}Pošalji neoznačeno u Hitno<span class="count">${s.total-s.done}</span></button>
    <button class="row" data-nm="pin">${icon('pin')}${n.pin?'Otkvači s vrha':'Prikvači na vrh'}</button>
    <button class="row" data-nm="dup">${icon('layers')}Dupliciraj</button>
    <button class="row" data-nm="del" style="color:var(--urgent)">${icon('trash')}Obriši bilješku</button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-nm]',el).forEach(b=>b.addEventListener('click',async()=>{
      const a=b.dataset.nm;
      if(a==='uncheck')n.blocks.forEach(x=>x.d=false);
      if(a==='bottom'){const und=n.blocks.filter(x=>!(x.t==='c'&&x.d)),dn=n.blocks.filter(x=>x.t==='c'&&x.d);n.blocks=[...und,...dn];}
      if(a==='clear'){n.blocks=n.blocks.filter(x=>!(x.t==='c'&&x.d));if(!n.blocks.length)n.blocks=[{id:uid('b'),t:'c',x:'',d:false}];}
      if(a==='copy'){try{await navigator.clipboard.writeText(noteAsText(n));toast('Kopirano');}catch(e){toast('Kopiranje nije uspjelo');}closeSheet();return;}
      if(a==='todo'){const items=n.blocks.filter(x=>x.t==='c'&&!x.d&&x.x.trim());items.forEach(x=>addHp(x.x,{src:'📝 '+noteName(n)}));toast(`${items.length} poslano u Hitno`);}
      if(a==='pin')n.pin=!n.pin;
      if(a==='dup'){const c=JSON.parse(JSON.stringify(n));c.id=uid('n');c.title=noteName(n)+' (kopija)';c.blocks.forEach(x=>x.id=uid('b'));c.created=c.updated=Date.now();c.pin=false;state.notes.push(c);closeSheet();saveData();go('#/note/'+c.id);return;}
      if(a==='del'){closeSheet();const i=state.notes.indexOf(n);state.notes.splice(i,1);saveData();go('#/notes');toast('Bilješka obrisana',{label:'Poništi',fn:()=>{state.notes.splice(i,0,n);saveData();go('#/note/'+n.id);}});return;}
      touchNote(n);closeSheet();renderAll();
    }))});
}

/* ═════════ GOOGLE CALENDAR ═════════ */
const GCAL={token:null,exp:0,weeks:{},busy:false};
try{const t=JSON.parse(sessionStorage.getItem('planner.gtok')||'null');if(t&&t.exp>Date.now()){GCAL.token=t.token;GCAL.exp=t.exp;}}catch(e){}
function gcfg(){return state.settings.gcal||(state.settings.gcal={clientId:'',calendarId:'primary',show:true});}
function gcalReady(){return!!GCAL.token&&Date.now()<GCAL.exp;}
function gcalConfigured(){return!!(gcfg().clientId||'').trim();}
function ymd(d){return localISO(d).replace(/-/g,'');}
function taskCalDate(r){
  if(!r)return today();
  if(r.task.reminder&&r.task.reminder.on){const d=new Date(r.task.reminder.at);if(!isNaN(d))return d;}
  if(r.kind==='day')return dateFromDk(r.dk);
  if(r.kind==='item'&&r.task.due)return fromInputDate(r.task.due);
  return today();
}
function gcalTemplateUrl(r){ // radi bez ikakvog postavljanja — otvara Google Calendar s popunjenim događajem
  const t=r.task;const d=taskCalDate(r);const timed=!!(t.reminder&&t.reminder.on);
  let dates;
  if(timed){const e=new Date(d.getTime()+30*60000);const f=x=>`${ymd(x)}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;dates=`${f(d)}/${f(e)}`;}
  else{const s=new Date(d);s.setHours(0,0,0,0);dates=`${ymd(s)}/${ymd(addDays(s,1))}`;}
  const det=[(r.kind==='item'?t.info:t.note)||'',t.link||''].filter(Boolean).join('\n');
  const p=new URLSearchParams({action:'TEMPLATE',text:title(t),dates,details:det,ctz:Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Zagreb'});
  return'https://calendar.google.com/calendar/render?'+p.toString();
}
function loadGis(){
  if(window.google&&google.accounts&&google.accounts.oauth2)return Promise.resolve();
  return new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=res;s.onerror=()=>rej(new Error('Ne mogu učitati Google Identity'));document.head.appendChild(s);});
}
async function gcalConnect(){
  if(!gcalConfigured()){openSettings('gcal');toast('Prvo upiši Google Client ID');return false;}
  try{await loadGis();}catch(e){toast(e.message);return false;}
  return new Promise(res=>{
    const tc=google.accounts.oauth2.initTokenClient({client_id:gcfg().clientId.trim(),scope:'https://www.googleapis.com/auth/calendar.events',hint:user.email||undefined,prompt:'',
      callback:r=>{
        if(r.error){toast('Google Calendar: '+r.error);res(false);return;}
        GCAL.token=r.access_token;GCAL.exp=Date.now()+(Number(r.expires_in||3600)-60)*1000;GCAL.weeks={};
        try{sessionStorage.setItem('planner.gtok',JSON.stringify({token:GCAL.token,exp:GCAL.exp}));}catch(e){}
        toast('📅 Google Calendar povezan');res(true);renderAll();
      },
      error_callback:err=>{toast('Povezivanje prekinuto'+(err&&err.type?' ('+err.type+')':''));res(false);}});
    tc.requestAccessToken();
  });
}
function gcalDisconnect(){
  if(GCAL.token&&window.google&&google.accounts&&google.accounts.oauth2){try{google.accounts.oauth2.revoke(GCAL.token,()=>{});}catch(e){}}
  GCAL.token=null;GCAL.exp=0;GCAL.weeks={};try{sessionStorage.removeItem('planner.gtok');}catch(e){}
}
async function gapi(path,opts={}){
  const r=await fetch('https://www.googleapis.com/calendar/v3'+path,{...opts,headers:{Authorization:'Bearer '+GCAL.token,'Content-Type':'application/json'}});
  if(r.status===401){gcalDisconnect();renderAll();throw new Error('Sesija za Google Calendar je istekla — poveži ponovno');}
  if(!r.ok){let m=r.status+'';try{m=(await r.json()).error.message;}catch(e){}throw new Error(m);}
  return r.status===204?null:r.json();
}
async function gcalEnsureWeek(wk){
  if(!gcalReady()||!gcfg().show||GCAL.busy)return;
  const c=GCAL.weeks[wk];if(c&&Date.now()-c.at<120000)return;
  GCAL.busy=true;
  try{
    const mon=mondayFromKey(wk),end=addDays(mon,7);const cal=encodeURIComponent(gcfg().calendarId||'primary');
    const data=await gapi(`/calendars/${cal}/events?timeMin=${encodeURIComponent(mon.toISOString())}&timeMax=${encodeURIComponent(end.toISOString())}&singleEvents=true&orderBy=startTime&maxResults=250`);
    GCAL.weeks[wk]={at:Date.now(),items:(data.items||[]).filter(e=>e.status!=='cancelled'&&!(e.extendedProperties&&e.extendedProperties.private&&e.extendedProperties.private.plannerId))};
    GCAL.busy=false;scheduleRemoteRender();
  }catch(e){GCAL.busy=false;GCAL.weeks[wk]={at:Date.now(),items:[],err:e.message};toast('Kalendar: '+e.message);}
}
function gcalEventsFor(wk,d){
  const c=GCAL.weeks[wk];if(!c||!gcfg().show)return[];const iso=localISO(d);
  return c.items.filter(e=>{
    if(e.start&&e.start.date){return e.start.date<=iso&&iso<(e.end&&e.end.date||e.start.date);}
    if(e.start&&e.start.dateTime){return localISO(new Date(e.start.dateTime))===iso;}
    return false;});
}
function gcalEvHTML(e){
  const t=e.start&&e.start.dateTime?new Date(e.start.dateTime):null;
  const time=t?`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`:'Cijeli dan';
  return`<a class="gev" href="${esc(safeUrl(e.htmlLink))}" target="_blank" rel="noopener" title="Otvori u Google Calendaru"><span class="gt">${time}</span><span class="gs">${esc(e.summary||'(bez naslova)')}</span></a>`;
}
async function gcalPushTask(id,silent){
  const r=findTask(id);if(!r)return;
  if(!gcalReady()){const ok=await gcalConnect();if(!ok)return;}
  const t=r.task;const d=taskCalDate(r);const timed=!!(t.reminder&&t.reminder.on);
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Zagreb';
  const body={summary:title(t),description:[(r.kind==='item'?t.info:t.note)||'',t.link||'','— dodano iz Plannera'].filter(Boolean).join('\n'),
    extendedProperties:{private:{plannerId:t.id}}};
  if(timed){body.start={dateTime:new Date(d).toISOString(),timeZone:tz};body.end={dateTime:new Date(d.getTime()+30*60000).toISOString(),timeZone:tz};body.reminders={useDefault:false,overrides:[{method:'popup',minutes:0}]};}
  else{const s=new Date(d);s.setHours(0,0,0,0);body.start={date:localISO(s)};body.end={date:localISO(addDays(s,1))};}
  const cal=encodeURIComponent(gcfg().calendarId||'primary');
  try{
    let ev;
    if(t.gcal&&t.gcal.id){try{ev=await gapi(`/calendars/${cal}/events/${encodeURIComponent(t.gcal.id)}`,{method:'PATCH',body:JSON.stringify(body)});}catch(e){if(/not found|deleted|404|410/i.test(e.message))ev=null;else throw e;}}
    if(!ev)ev=await gapi(`/calendars/${cal}/events`,{method:'POST',body:JSON.stringify(body)});
    const fr=findTask(id);if(fr){fr.task.gcal={id:ev.id,link:ev.htmlLink};saveData();renderAll();}
    if(!silent)toast(timed?'📅 U kalendaru — Google će te podsjetiti i na mobitelu':'📅 Dodano u Google Calendar',{label:'Otvori',fn:()=>window.open(ev.htmlLink,'_blank','noopener')});
  }catch(e){toast('Kalendar: '+e.message);}
}
function gcalBoardBtn(){
  if(!gcalConfigured())return'';
  if(!gcalReady())return`<button class="btn btn-outline btn-sm" data-act="gcalConnect" title="Prikaži događaje iz Google Calendara">${icon('calendar')}Poveži kalendar</button>`;
  return`<button class="ibtn" data-act="gcalRefresh" title="Osvježi Google Calendar">${icon('refresh')}</button>`;
}

/* ═════════ POSTAVKE: kalendar, dijeljenje, sigurnost ═════════ */
let plannerMeta={own:true,ownerEmail:'',ownerName:'',sharedWith:[]},sharedPlanners=[],secResults=null;
function openSettings(focus){
  const g=gcfg();const cloud=!LOCAL_MODE;
  const share=!cloud?`<div style="font-size:.84rem;color:var(--text-3)">Dijeljenje radi samo s prijavom (ne u lokalnom načinu).</div>`
    :plannerMeta.own?`<div style="font-size:.84rem;color:var(--text-2)">Osobe koje dodaš (Google e-mail) mogu <b>vidjeti i uređivati cijeli</b> ovaj planner. Ne mogu dodavati druge ni mijenjati popis dijeljenja.</div>
      <div id="shareList" class="share-list">${(plannerMeta.sharedWith||[]).map(e=>`<div class="share-row"><span>${esc(e)}</span><button class="btn btn-danger btn-sm" data-unshare="${esc(e)}">Ukloni</button></div>`).join('')||'<div style="font-size:.84rem;color:var(--text-3)">Planner nije podijeljen ni s kim.</div>'}</div>
      <div class="add-row" style="margin-top:0"><input class="input" id="shareEmail" type="email" placeholder="ime@gmail.com" autocomplete="off"><button class="btn btn-primary" id="shareAdd">${icon('plus')}Podijeli</button></div>`
    :`<div style="font-size:.84rem;color:var(--text-2)">Ovo je planner korisnika <b>${esc(plannerMeta.ownerName||plannerMeta.ownerEmail)}</b> koji je podijeljen s tobom. Samo vlasnik upravlja dijeljenjem.</div>`;
  openSheet({title:'Postavke',side:true,body:`
    <details class="set" ${focus==='gcal'?'open':''}><summary>${icon('calendar')}<b>Google Calendar</b><span class="pill ${gcalReady()?'pill-ok':''}">${gcalReady()?'Povezan':gcalConfigured()?'Nije povezan':'Nije postavljen'}</span></summary>
      <div class="set-body">
        <div style="font-size:.84rem;color:var(--text-2)">Bez postavljanja: u uređivanju zadatka klikni <b>“Dodaj u Google Calendar”</b>. Za pravi sync (prikaz tvojih događaja u tjednom planu + slanje zadataka s podsjetnikom na mobitel) upiši Client ID:</div>
        <div class="field"><label for="g_cid">OAuth Client ID</label><input id="g_cid" value="${esc(g.clientId||'')}" placeholder="123…apps.googleusercontent.com" autocomplete="off" spellcheck="false"></div>
        <div class="field"><label for="g_cal">Kalendar</label><input id="g_cal" value="${esc(g.calendarId||'primary')}" placeholder="primary"></div>
        <label class="switch"><input type="checkbox" id="g_show" ${g.show!==false?'checked':''}><span class="track"></span>Prikaži događaje iz kalendara u tjednom planu</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" id="g_save">${icon('check')}Spremi i poveži</button>${gcalReady()?`<button class="btn btn-ghost btn-sm" id="g_disc">Odspoji</button>`:''}</div>
        <details class="howto"><summary>Kako dobiti Client ID (5 min, jednom)</summary><ol>
          <li><a href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=planner-96d7c" target="_blank" rel="noopener">Google Cloud → Google Calendar API</a> → <b>Enable</b>.</li>
          <li><a href="https://console.cloud.google.com/apis/credentials?project=planner-96d7c" target="_blank" rel="noopener">Credentials</a> → otvori <b>Web client (auto created by Google Service)</b> → pod <i>Authorized JavaScript origins</i> dodaj <code>https://hrvojekladnicki.github.io</code> → Save → kopiraj <b>Client ID</b>.</li>
          <li><a href="https://console.cloud.google.com/auth/audience?project=planner-96d7c" target="_blank" rel="noopener">OAuth consent screen → Audience</a>: ako je u “Testing”, dodaj svoj Gmail pod <i>Test users</i>.</li>
          <li>Zalijepi Client ID ovdje → <b>Spremi i poveži</b>. Google može prikazati “aplikacija nije verificirana” — to je tvoja vlastita aplikacija, klikni Advanced → Continue.</li></ol>
          <div style="font-size:.78rem;color:var(--text-3)">Pristup kalendaru vrijedi ~1 h i čuva se samo u ovoj kartici preglednika (ne u bazi). Client ID nije tajna.</div></details>
      </div></details>
    <details class="set" ${focus==='share'?'open':''}><summary>${icon('users')}<b>Dijeljenje</b><span class="pill">${plannerMeta.own?(plannerMeta.sharedWith||[]).length+' osoba':'dijeljeno sa mnom'}</span></summary><div class="set-body">${share}</div></details>
    <details class="set" ${focus==='sec'?'open':''}><summary>${icon('shield')}<b>Sigurnosna provjera</b>${secResults?secBadge():''}</summary><div class="set-body">
      <div style="font-size:.84rem;color:var(--text-2)">Testira <b>uživo</b> tvoj Firebase: može li netko bez prijave ili s tuđim računom čitati/pisati tvoje podatke, je li stranica zaštićena od ubacivanja skripti itd.</div>
      <button class="btn btn-primary btn-sm" id="secRun" ${cloud?'':'disabled'}>${icon('shield')}Pokreni provjeru</button>${cloud?'':'<div style="font-size:.8rem;color:var(--text-3)">Dostupno nakon prijave.</div>'}
      <div id="secOut">${secResults?secHTML():''}</div></div></details>
    <details class="set"><summary>${icon('archive')}<b>Sigurnosna kopija</b></summary><div class="set-body">
      <div style="font-size:.84rem;color:var(--text-2)">Preuzmi sve podatke (liste, tjedne, bilješke, stranice, recepte, DIY projekte, raspored djece) kao JSON datoteku — korisno prije dijeljenja ili većih promjena. Slike nisu u datoteci (ostaju u Firebaseu).</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-outline btn-sm" id="bkExport">${icon('archive')}Preuzmi kopiju</button>
      <label class="btn btn-ghost btn-sm" style="cursor:pointer">${icon('refresh')}Vrati iz kopije<input type="file" id="bkImport" accept="application/json,.json" hidden></label></div></div></details>
    <div class="sheet-list"><button class="row" data-act="notif">${icon('bell')}Podsjetnici i obavijesti</button><button class="row" data-act="theme">${icon(isDark()?'sun':'moon')}${isDark()?'Svijetla tema':'Tamna tema'}</button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>{
      $('#g_save',el).addEventListener('click',async()=>{
        const cid=$('#g_cid',el).value.trim();
        if(cid&&!/^[\w-]+\.apps\.googleusercontent\.com$/.test(cid)){toast('Client ID mora završavati s .apps.googleusercontent.com');return;}
        Object.assign(gcfg(),{clientId:cid,calendarId:$('#g_cal',el).value.trim()||'primary',show:$('#g_show',el).checked});GCAL.weeks={};saveData();
        if(cid){const ok=await gcalConnect();if(ok)openSettings('gcal');}else{gcalDisconnect();renderAll();openSettings('gcal');}
      });
      const dc=$('#g_disc',el);if(dc)dc.addEventListener('click',()=>{gcalDisconnect();renderAll();openSettings('gcal');toast('Kalendar odspojen');});
      const sa=$('#shareAdd',el);
      if(sa){const add=async()=>{const v=$('#shareEmail',el).value.trim().toLowerCase();
          if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){toast('Upiši ispravan e-mail');return;}
          if(v===(user.email||'').toLowerCase()){toast('To je tvoj e-mail');return;}
          const list=[...new Set([...(plannerMeta.sharedWith||[]),v])];
          try{await window._fbSetSharing(list);toast('Podijeljeno s '+v);}catch(e){toast('Greška: '+e.message);}openSettings('share');};
        sa.addEventListener('click',add);$('#shareEmail',el).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add();}});}
      $$('[data-unshare]',el).forEach(b=>b.addEventListener('click',async()=>{const list=(plannerMeta.sharedWith||[]).filter(x=>x!==b.dataset.unshare);try{await window._fbSetSharing(list);toast('Pristup uklonjen');}catch(e){toast('Greška: '+e.message);}openSettings('share');}));
      $('#bkExport',el).addEventListener('click',()=>{const blob=new Blob([JSON.stringify(Object.assign({},state,{_docs:typeof DOCS==='object'?DOCS:{}}),null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`planner-backup-${localISO(new Date())}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);toast('Kopija preuzeta');});
      $('#bkImport',el).addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!data||!Array.isArray(data.tabs))throw new Error('Nije Planner kopija');
        confirmSheet2('Zamijeniti SVE trenutne podatke podacima iz kopije “'+f.name+'”?','Vrati kopiju',()=>{const docs=data._docs;delete data._docs;state=normalize(data);saveData();if(docs&&typeof putDoc==='function')Object.values(docs).forEach(d=>d&&d.id&&d.kind&&putDoc(d,{now:true}));renderAll();toast('Podaci vraćeni iz kopije');});}catch(err){toast('Greška: '+err.message);}});
      const sr=$('#secRun',el);if(sr)sr.addEventListener('click',async()=>{sr.disabled=true;sr.textContent='Provjeravam…';secResults=await runSecurityCheck();openSettings('sec');});
    }});
}

/* ═════════ SIGURNOSNA PROVJERA (uživo, iz preglednika) ═════════ */
function secBadge(){const bad=secResults.filter(r=>r.s==='fail').length,warn=secResults.filter(r=>r.s==='warn').length;
  return`<span class="pill ${bad?'pill-urgent':warn?'':'pill-ok'}">${bad?bad+' kritično':warn?warn+' upozorenja':'Sve OK'}</span>`;}
function secHTML(){return`<div class="sec-list">${secResults.map(r=>`<div class="sec-item ${r.s}"><span class="sec-ico">${r.s==='pass'?'✅':r.s==='warn'?'⚠️':r.s==='info'?'ℹ️':'❌'}</span><div><b>${esc(r.name)}</b><small>${esc(r.msg)}</small></div></div>`).join('')}</div>
  <div style="font-size:.76rem;color:var(--text-3);margin-top:6px">Provjereno ${new Date().toLocaleString('hr-HR')}</div>`;}
async function runSecurityCheck(){
  const out=[];const add=(s,name,msg)=>out.push({s,name,msg});
  const info=window._fbInfo||{};const uid=window._fbUid&&window._fbUid();
  const base=`https://firestore.googleapis.com/v1/projects/${info.projectId}/databases/(default)/documents`;
  const rnd=()=>Math.random().toString(36).slice(2,12);
  const req=async(url,opts={},token)=>{try{const h={'Content-Type':'application/json'};if(token)h.Authorization='Bearer '+token;const r=await fetch(url,{...opts,headers:h});return r.status;}catch(e){return 0;}};
  // 1) bez prijave — čitanje mog dokumenta
  let s=await req(`${base}/planners/${uid}?key=${info.apiKey}`);
  s===403||s===401?add('pass','Bez prijave: čitanje tvog plannera','Odbijeno ('+s+') — nitko bez prijave ne vidi tvoje podatke.')
    :s===200?add('fail','Bez prijave: čitanje tvog plannera','DOSTUPNO SVIMA! Odmah postavi Firestore Rules iz datoteke firestore.rules.')
    :add('warn','Bez prijave: čitanje tvog plannera','Neočekivan odgovor ('+s+').');
  // 2) bez prijave — popis svih plannera
  s=await req(`${base}/planners?pageSize=1&key=${info.apiKey}`);
  s===403||s===401?add('pass','Bez prijave: popis svih korisnika','Odbijeno ('+s+').'):s===200?add('fail','Bez prijave: popis svih korisnika','Svatko može izlistati sve plannere! Postavi Firestore Rules.'):add('warn','Bez prijave: popis svih korisnika','Neočekivan odgovor ('+s+').');
  // 3) prijavljen — čitanje TUĐEG dokumenta
  const tok=await (window._fbIdToken?window._fbIdToken():null);
  if(tok){
    s=await req(`${base}/planners/sectest_${rnd()}`,{},tok);
    s===403?add('pass','Prijavljeni korisnik: tuđi planner','Odbijeno — prijavljeni korisnik ne može čitati tuđe podatke.')
      :s===404?add('fail','Prijavljeni korisnik: tuđi planner','Pravila dopuštaju čitanje TUĐIH dokumenata (svatko s Google računom može čitati sve). Postavi firestore.rules.')
      :add('warn','Prijavljeni korisnik: tuđi planner','Neočekivan odgovor ('+s+').');
    // 4) prijavljen — popis kolekcije bez filtra
    s=await req(`${base}/planners?pageSize=1`,{},tok);
    s===403?add('pass','Prijavljeni korisnik: popis svih plannera','Odbijeno.'):s===200?add('fail','Prijavljeni korisnik: popis svih plannera','Svaki prijavljeni korisnik može izlistati sve plannere!'):add('warn','Prijavljeni korisnik: popis svih plannera','Neočekivan odgovor ('+s+').');
    // 5) prijavljen — pisanje u tuđi dokument
    const fake=`sectest_${rnd()}`;
    s=await req(`${base}/planners/${fake}?currentDocument.exists=false`,{method:'PATCH',body:JSON.stringify({fields:{payload:{stringValue:'x'}}})},tok);
    if(s===403)add('pass','Prijavljeni korisnik: upis u tuđi planner','Odbijeno.');
    else if(s===200){add('fail','Prijavljeni korisnik: upis u tuđi planner','Upis je PROŠAO — svatko može mijenjati tuđe podatke! (testni dokument je obrisan)');await req(`${base}/planners/${fake}`,{method:'DELETE'},tok);}
    else add('warn','Prijavljeni korisnik: upis u tuđi planner','Neočekivan odgovor ('+s+').');
  }else add('warn','Token prijave','Nije moguće dohvatiti token — prijavi se ponovno.');
  // 6) može li stranac napraviti račun (anonimno / e-mail) i s njim čitati tvoj planner?
  const it=`https://identitytoolkit.googleapis.com/v1/accounts`;
  for(const [label,body] of [['anonimna prijava',{returnSecureToken:true}],['registracija e-mailom',{email:`sectest-${rnd()}@example.com`,password:rnd()+rnd(),returnSecureToken:true}]]){
    let r=null;try{const x=await fetch(`${it}:signUp?key=${info.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});r={status:x.status,j:await x.json().catch(()=>({}))};}catch(e){}
    if(!r){add('warn','Stranac: '+label,'Provjera nije uspjela (mreža).');continue;}
    if(r.status===200&&r.j.idToken){
      const rs=await req(`${base}/planners/${uid}`,{},r.j.idToken);
      await fetch(`${it}:delete?key=${info.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:r.j.idToken})}).catch(()=>{});
      rs===403?add('warn','Stranac: '+label,`Uključena je (svatko može napraviti račun), ali taj račun NE može čitati tvoj planner. Preporuka: isključi u Firebase → Authentication → Sign-in method ako je ne koristiš. (testni račun obrisan)`)
        :add('fail','Stranac: '+label,`Novi račun stranca MOŽE čitati tvoj planner (${rs})! Postavi firestore.rules. (testni račun obrisan)`);
    }else add('pass','Stranac: '+label,'Isključeno — nije moguće napraviti račun na taj način.');
  }
  // 7) stranica
  location.protocol==='https:'?add('pass','HTTPS','Promet je šifriran.'):add('warn','HTTPS','Stranica nije otvorena preko HTTPS-a.');
  const csp=document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  csp?add('pass','Content-Security-Policy','Preglednik smije učitati skripte samo s ove stranice i Googlea — ubačene tuđe skripte se blokiraju.'):add('warn','Content-Security-Policy','Nema CSP zaštite.');
  const ext=[...document.scripts].map(x=>x.src).filter(Boolean).map(u=>new URL(u).host).filter(h=>h!==location.host);
  ext.every(h=>/(^|\.)google\.com$|gstatic\.com$/.test(h))?add('pass','Vanjske skripte','Samo vlastite datoteke i Google (Firebase/Calendar): '+([...new Set(ext)].join(', ')||'nema')+'.'):add('warn','Vanjske skripte','Učitavaju se skripte s: '+[...new Set(ext)].join(', '));
  window.top===window.self?add('pass','Clickjacking','Stranica nije ugrađena u tuđi okvir.'):add('fail','Clickjacking','Stranica je otvorena unutar tuđeg okvira!');
  add('info','Firebase API ključ','Ključ u kodu je javan po dizajnu (ne daje pristup podacima — to rade Rules). Preporuka: u Google Cloud → Credentials ograniči ključ na “HTTP referrer” hrvojekladnicki.github.io/*.');
  add('info','Ovaj uređaj','Prijava i offline kopija podataka čuvaju se u pregledniku. Na tuđem/zajedničkom računalu uvijek se odjavi.');
  return out;
}

/* ═════════ DRAG & DROP ═════════ */
function initSortables(r){
  sortables.forEach(s=>{try{s.destroy();}catch(e){}});sortables=[];
  if(!window.Sortable)return;
  const base={animation:180,easing:'cubic-bezier(.2,.8,.2,1)',handle:'.grip',ghostClass:'s-ghost',chosenClass:'s-chosen',dragClass:'s-drag',
    forceFallback:true,fallbackOnBody:true,fallbackTolerance:3,scrollSensitivity:80,bubbleScroll:true,
    onStart:()=>{dragging=true;vibrate(8);document.body.style.userSelect='none';}};
  const finish=()=>{dragging=false;document.body.style.userSelect='';saveData();renderAll();};
  const hp=$('#hpList');
  if(hp)sortables.push(Sortable.create(hp,{...base,onEnd:()=>{
    const ids=$$('#hpList > .task').map(li=>li.dataset.id);
    state.highPriority.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));finish();}}));
  $$('.day-list').forEach(el=>sortables.push(Sortable.create(el,{...base,group:'days',onEnd:e=>{
    const from=getDayList(e.from.dataset.wk,e.from.dataset.dk,true),to=getDayList(e.to.dataset.wk,e.to.dataset.dk,true);
    const id=e.item.dataset.id;const idx=from.findIndex(t=>t.id===id);
    if(idx>=0){const[t]=from.splice(idx,1);
      if(e.from!==e.to&&t.reminder&&t.reminder.on){const old=new Date(t.reminder.at);const nd=dateFromDk(e.to.dataset.dk);nd.setHours(old.getHours(),old.getMinutes(),0,0);t.reminder.at=localDT(nd);t.reminder.seen=false;}
      to.splice(Math.min(e.newIndex,to.length),0,t);
      if(e.from!==e.to){toast(`Premješteno na ${shortDay(dateFromDk(e.to.dataset.dk))}`);if(t.gcal&&gcalReady())setTimeout(()=>gcalPushTask(t.id,true),50);}}
    finish();}})));
  const il=$('#itemList');
  if(il)sortables.push(Sortable.create(il,{...base,onEnd:()=>{
    const tabId=il.dataset.tab;const tab=tabById(tabId);const ids=$$('#itemList > .task').map(li=>li.dataset.id);
    const list=state.items[tabId];const vis=ids.map(id=>list.find(i=>i.id===id)).filter(Boolean);const rest=list.filter(i=>!ids.includes(i.id));
    state.items[tabId]=[...vis,...rest];
    if(tab&&tab.sort!=='manual'){tab.sort='manual';toast('Redoslijed je sada ručni');}
    finish();}}));
  const nt=$('#navTabs');
  if(nt)sortables.push(Sortable.create(nt,{...base,handle:undefined,delay:180,delayOnTouchOnly:true,onEnd:()=>{
    const ids=$$('#navTabs > .nav-item').map(a=>a.dataset.tab);
    const special=state.tabs.filter(t=>t.type!=='todo');const todos=ids.map(id=>tabById(id)).filter(Boolean);
    state.tabs=[special.find(t=>t.type==='todolist'),...todos,...special.filter(t=>t.type!=='todolist')].filter(Boolean);finish();}}));
  const nb=$('#noteBlocks');
  if(nb)sortables.push(Sortable.create(nb,{...base,onEnd:()=>{
    const n=noteById(nb.dataset.note);if(!n){finish();return;}const ids=$$('#noteBlocks > .nb').map(x=>x.dataset.bid);
    n.blocks.sort((a,b)=>{const ia=ids.indexOf(a.id),ib=ids.indexOf(b.id);return(ia<0?1e9:ia)-(ib<0?1e9:ib);});n.updated=Date.now();finish();}}));
  const bg=$('#bmGrid');
  if(bg&&!bmSearch)sortables.push(Sortable.create(bg,{...base,onEnd:()=>{
    const ids=$$('#bmGrid > .bm').map(x=>x.dataset.id);
    state.bookmarks.sort((a,b)=>{const ia=ids.indexOf(a.id),ib=ids.indexOf(b.id);return(ia<0?1e9:ia)-(ib<0?1e9:ib);});finish();}}));
}

/* ═════════ ACTIONS: TASKS ═════════ */
function toggleTask(id){
  const r=findTask(id);if(!r)return;
  const v=!r.task.done;setDone(r,v);justToggled=id;
  if(v)vibrate(12);
  saveData();renderAll();
}
function setDone(r,v){
  r.task.done=v;r.task.doneAt=v?Date.now():null;
  if(v&&r.task.reminder)r.task.reminder.seen=true;
  // povezane stavke (lista ⇄ To Do)
  const linkedId=r.kind==='item'?r.task.todoId:r.task.srcItem;
  if(linkedId){const l=findTask(linkedId);if(l&&l.task.done!==v){l.task.done=v;l.task.doneAt=v?Date.now():null;}}
}
function deleteTask(id){
  const r=findTask(id);if(!r)return;
  const loc={kind:r.kind,wk:r.wk,dk:r.dk,tabId:r.tabId};const idx=r.index;const t=r.task;
  r.list.splice(idx,1);
  if(r.kind!=='item'&&t.srcItem){const s=findTask(t.srcItem);if(s&&s.task.todoId===t.id)delete s.task.todoId;}
  if(r.kind==='item'&&t.todoId){const s=findTask(t.todoId);if(s&&s.task.srcItem===t.id){/* zadržavamo To Do zadatak, samo prekidamo vezu */delete s.task.srcItem;}}
  saveData();renderAll();
  toast('Obrisano: '+title(t).slice(0,40),{label:'Poništi',fn:()=>{getList(loc).splice(idx,0,t);saveData();renderAll();}});
}
function addHp(text,extra={}){
  text=(text||'').trim();if(!text)return null;
  const t={id:uid('hp'),text,done:false,src:'',created:Date.now(),...extra};
  state.highPriority.push(t);justAdded=t.id;return t;
}
function addDay(wk,dk,text,extra={}){
  text=(text||'').trim();if(!text)return null;
  const t={id:uid('dt'),text,done:false,src:'',priority:'',created:Date.now(),...extra};
  getDayList(wk,dk,true).push(t);justAdded=t.id;return t;
}
function placeOnDate(date,text,extra){const wk=getWeekKey(date),dk=formatDateKey(date);return addDay(wk,dk,text,extra);}
function extractLink(text){const m=text.match(/https?:\/\/\S+/);return m?m[0]:'';}
function moveTask(r,target){ // target: {kind:'hp'} | {kind:'day',date}
  const t=r.task;r.list.splice(r.index,1);
  if(target.kind==='hp'){state.highPriority.unshift(t);}
  else{getDayList(getWeekKey(target.date),formatDateKey(target.date),true).push(t);}
}

/* ═════════ EDIT SHEET (sve se može urediti) ═════════ */
function editTask(id){
  const r=findTask(id);if(!r)return;const t=r.task;const isItem=r.kind==='item';
  const rem=t.reminder&&t.reminder.on;
  const dateVal=r.kind==='day'?localISO(dateFromDk(r.dk)):'';
  const srcTab=tabForTask(t);
  openSheet({
    title:isItem?'Uredi stavku':r.kind==='hp'?'Uredi hitnu stavku':r.kind==='archive'?'Arhivirana stavka':'Uredi zadatak',
    body:`
      <div class="field"><label for="f_text">Opis *</label><input id="f_text" value="${esc(title(t))}" autocomplete="off"></div>
      <div class="grid2">
        <div class="field"><label for="f_link">Link</label><input id="f_link" type="url" value="${esc(t.link||'')}" placeholder="https://…"></div>
        <div class="field"><label>Prioritet</label>${prioSeg('f_prio',t.priority||(isItem?'medium':''),!isItem)}</div>
      </div>
      ${r.kind==='day'?`<div class="field"><label for="f_date">Dan (promjena premješta zadatak)</label><input id="f_date" type="date" value="${dateVal}"></div>`:''}
      ${r.kind==='hp'?`<div class="field"><label for="f_date">Prebaci u tjedni plan (opcionalno)</label><input id="f_date" type="date" value=""></div>`:''}
      ${isItem?`<div class="field"><label for="f_due">Rok</label><input id="f_due" type="date" value="${esc(t.due||'')}"></div>`:''}
      <div class="field"><label for="f_note">${isItem?'Dodatne informacije':'Bilješka'}</label><textarea id="f_note" placeholder="Detalji, napomene…">${esc(isItem?t.info||'':t.note||'')}</textarea></div>
      <div class="rem-box${rem?' on':''}" id="remBox">
        <label class="switch"><input type="checkbox" id="f_rem" ${rem?'checked':''}><span class="track"></span>${icon('bell')} Podsjetnik</label>
        <div class="when"><input class="input" type="datetime-local" id="f_rem_at" value="${esc(rem?t.reminder.at:defaultRemAt(r))}">
          <div style="font-size:.76rem;color:var(--text-3);width:100%">Prikazat će se obavijest kad otvoriš Planner (i dok je otvoren) nakon ovog vremena.</div></div>
      </div>
      <div class="gcal-box">${icon('calendar')}<div style="flex:1;min-width:0"><b>Google Calendar</b><small>${t.gcal?'Povezano s događajem u kalendaru.':'Dodaj kao događaj (s podsjetnikom ako je uključen).'}</small></div>
        ${t.gcal&&t.gcal.link?`<a class="btn btn-ghost btn-sm" href="${esc(safeUrl(t.gcal.link))}" target="_blank" rel="noopener">Otvori</a>`:''}
        ${gcalConfigured()?`<button class="btn btn-outline btn-sm" type="button" id="f_gcal">${t.gcal?'Spremi i ažuriraj':'Spremi i pošalji'}</button>`:`<a class="btn btn-outline btn-sm" href="${esc(gcalTemplateUrl(r))}" target="_blank" rel="noopener">Dodaj u Google Calendar</a>`}</div>
      ${(srcTab||(!isItem&&t.src))?`<div style="font-size:.82rem;color:var(--text-2)">Izvor: ${srcChip(t)}</div>`:''}
      ${isItem&&t.todoId&&findTask(t.todoId)?`<div style="font-size:.82rem;color:var(--text-2)">Na To Do listi: <a class="chip chip-todo" href="#/dash/${encodeURIComponent(t.todoId)}">${icon('pin')}${esc(whereLabel(findTask(t.todoId)))}</a></div>`:''}`,
    actions:[
      {label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>{closeSheet();deleteTask(id);}},
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+'Spremi',cls:'btn-primary',primary:true,fn:()=>saveEdit(id)},
    ],
    onOpen:(el)=>{
      const cb=$('#f_rem',el);cb.addEventListener('change',()=>$('#remBox',el).classList.toggle('on',cb.checked));
      const f=$('#f_text',el);f.focus();f.setSelectionRange(f.value.length,f.value.length);
      const gb=$('#f_gcal',el);if(gb)gb.addEventListener('click',()=>{if(saveEdit(id)!==false)gcalPushTask(id);});
    }
  });
}
function saveEdit(id){
  const r=findTask(id);if(!r){closeSheet();return;}
  const t=r.task;const isItem=r.kind==='item';const el=$('#sheet');
  const text=$('#f_text',el).value.trim();if(!text){$('#f_text',el).focus();toast('Opis je obavezan');return false;}
  if(isItem)t.desc=text;else t.text=text;
  t.link=$('#f_link',el).value.trim();
  const p=segVal('f_prio',el);if(p)t.priority=p;else delete t.priority;
  const note=$('#f_note',el).value.trim();if(isItem)t.info=note;else t.note=note;
  if(isItem){const due=$('#f_due',el).value;if(due)t.due=due;else delete t.due;}
  const remOn=$('#f_rem',el).checked,remAt=$('#f_rem_at',el).value;
  if(remOn&&remAt){const changed=!t.reminder||t.reminder.at!==remAt||!t.reminder.on;t.reminder={on:true,at:remAt,seen:changed?false:!!t.reminder.seen};if(changed)notified.delete(t.id);if(remOn&&'Notification'in window&&Notification.permission==='default')askNotifPermission(true);}
  else delete t.reminder;
  const dv=$('#f_date',el)?$('#f_date',el).value:'';
  if(r.kind==='day'&&dv&&dv!==localISO(dateFromDk(r.dk))){moveTask(r,{kind:'day',date:fromInputDate(dv)});toast('Premješteno na '+shortDay(fromInputDate(dv)));}
  if(r.kind==='hp'&&dv){moveTask(r,{kind:'day',date:fromInputDate(dv)});toast('Prebačeno na '+shortDay(fromInputDate(dv)));}
  closeSheet();saveData();renderAll();
  if(t.gcal&&t.gcal.id&&gcalReady())gcalPushTask(id,true);
}

/* ═════════ SEND TO TODO (povezivanje) ═════════ */
function openSendToTodo(id){
  const r=findTask(id);if(!r||r.kind!=='item')return;const it=r.task;const tab=tabById(r.tabId);
  const existing=it.todoId?findTask(it.todoId):null;
  let target='hp';
  openSheet({
    title:'Pošalji na To Do',
    body:`<div style="font-weight:700">${linkify(it.desc)}</div>
      ${existing?`<div class="notif"><div class="ico ico-week">${icon('pin')}</div><div class="tx"><b>Već je na To Do listi</b><small>${esc(whereLabel(existing))} — novo slanje premješta vezu.</small></div></div>`:''}
      <div class="choices" id="sendChoices">
        <button class="choice on" data-t="hp"><div class="ico ico-urgent">${icon('flame')}</div><div><b>Hitno</b><small>Na vrh liste prioriteta</small></div></button>
        <button class="choice" data-t="today"><div class="ico ico-accent">${icon('today')}</div><div><b>Danas</b><small>${formatDayLabel(today())}</small></div></button>
        <button class="choice" data-t="tomorrow"><div class="ico ico-week">${icon('calendar')}</div><div><b>Sutra</b><small>${formatDayLabel(addDays(today(),1))}</small></div></button>
        <button class="choice" data-t="date"><div class="ico ico-warn">${icon('calendar')}</div><div><b>Odaberi dan</b><small>Bilo koji datum</small></div></button>
      </div>
      <div class="field" id="sendDateRow" style="display:none"><label for="s_date">Datum</label><input type="date" id="s_date" value="${localISO(addDays(today(),2))}" min="${localISO(today())}"></div>
      <div class="field"><label>Prioritet na danu</label>${prioSeg('s_prio',it.priority||'medium',true)}</div>
      <div class="rem-box" id="sRemBox"><label class="switch"><input type="checkbox" id="s_rem"><span class="track"></span>${icon('bell')} Podsjetnik</label>
        <div class="when"><input class="input" type="datetime-local" id="s_rem_at" value="${defaultRemAt(null)}"></div></div>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('pin')+'Pošalji',cls:'btn-primary',primary:true,fn:()=>{
      const el=$('#sheet');let date=null;
      if(target==='today')date=today();else if(target==='tomorrow')date=addDays(today(),1);else if(target==='date'){const v=$('#s_date',el).value;if(!v){toast('Odaberi datum');return;}date=fromInputDate(v);}
      if(existing){existing.list.splice(existing.index,1);}
      const extra={srcTab:r.tabId,srcItem:it.id,src:tab?tab.name:'',link:it.link||'',note:it.info||'',priority:segVal('s_prio',el)};
      if($('#s_rem',el).checked)extra.reminder={on:true,at:$('#s_rem_at',el).value,seen:false};
      const t=date?placeOnDate(date,it.desc,extra):(()=>{const x=addHp(it.desc,extra);state.highPriority.pop();state.highPriority.unshift(x);return x;})();
      it.todoId=t.id;closeSheet();saveData();renderAll();
      toast(date?`📅 Dodano: ${shortDay(date)}`:'🔥 Dodano na hitnu listu',{label:'Prikaži',fn:()=>go('#/dash/'+t.id)});
    }}],
    onOpen:(el)=>{
      $$('#sendChoices .choice',el).forEach(b=>b.addEventListener('click',()=>{target=b.dataset.t;$$('#sendChoices .choice',el).forEach(x=>x.classList.toggle('on',x===b));$('#sendDateRow',el).style.display=target==='date'?'':'none';
        const d=target==='today'?today():target==='tomorrow'?addDays(today(),1):target==='date'?fromInputDate($('#s_date',el).value):null;
        if(d){const x=new Date(d);x.setHours(9,0,0,0);if(x<new Date()){x.setTime(Date.now());x.setMinutes(0,0,0);x.setHours(x.getHours()+1);}$('#s_rem_at',el).value=localDT(x);}}));
      $('#s_rem',el).addEventListener('change',e=>$('#sRemBox',el).classList.toggle('on',e.target.checked));
    }
  });
}

/* ═════════ QUICK ADD (FAB / tipka N) ═════════ */
function openQuickAdd(){
  let target='hp';
  const tabsOpts=todoTabs().map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
  openSheet({
    title:'Brzo dodaj',
    body:`<div class="field"><label for="q_text">Što treba napraviti?</label><input id="q_text" placeholder="npr. Nazvati majstora https://…" autocomplete="off"></div>
      <div class="choices" id="qChoices">
        <button class="choice on" data-t="hp"><div class="ico ico-urgent">${icon('flame')}</div><div><b>Hitno</b><small>Lista prioriteta</small></div></button>
        <button class="choice" data-t="today"><div class="ico ico-accent">${icon('today')}</div><div><b>Danas</b><small>${formatDayLabel(today())}</small></div></button>
        <button class="choice" data-t="date"><div class="ico ico-week">${icon('calendar')}</div><div><b>Na dan</b><small>Tjedni plan</small></div></button>
        <button class="choice" data-t="list"><div class="ico ico-warn">${icon('folder')}</div><div><b>U listu</b><small>Kuća, Posao…</small></div></button>
        ${state.notes.length?`<button class="choice" data-t="note" style="grid-column:1/-1"><div class="ico ico-ok">${icon('checklist')}</div><div><b>U bilješku (checklista)</b><small>npr. popis za dućan</small></div></button>`:''}
      </div>
      <div class="field" id="qNote" style="display:none"><label for="q_note">Bilješka</label><select id="q_note">${sortedNotes().map(n=>`<option value="${esc(n.id)}">${esc(noteName(n))}</option>`).join('')}</select></div>
      <div class="field" id="qDate" style="display:none"><label for="q_date">Datum</label><input type="date" id="q_date" value="${localISO(addDays(today(),1))}"></div>
      <div class="field" id="qList" style="display:none"><label for="q_list">Lista</label><select id="q_list">${tabsOpts}</select></div>
      <div class="field"><label>Prioritet</label>${prioSeg('q_prio','',true)}</div>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('plus')+'Dodaj',cls:'btn-primary',primary:true,fn:()=>{
      const el=$('#sheet');const text=$('#q_text',el).value.trim();if(!text){$('#q_text',el).focus();return;}
      const prio=segVal('q_prio',el);const link=extractLink(text);let t,msg;
      if(target==='hp'){t=addHp(text,{link,priority:prio});msg='🔥 Dodano na hitnu listu';}
      else if(target==='today'){t=placeOnDate(today(),text,{link,priority:prio});msg='📅 Dodano za danas';}
      else if(target==='date'){const d=fromInputDate($('#q_date',el).value);t=placeOnDate(d,text,{link,priority:prio});msg='📅 Dodano: '+shortDay(d);}
      else if(target==='note'){const n=noteById($('#q_note',el).value);if(!n)return;const lines=text.split(/\s*[,;]\s*|\n/).map(x=>x.trim()).filter(Boolean);
        const empty=n.blocks.length===1&&!n.blocks[0].x.trim();if(empty)n.blocks=[];lines.forEach(l=>n.blocks.push({id:uid('b'),t:'c',x:l,d:false}));n.updated=Date.now();closeSheet();saveData();go('#/note/'+n.id);toast(`${lines.length} ${lines.length===1?'stavka dodana':'stavki dodano'} u ${noteName(n)}`);return;}
      else{const tid=$('#q_list',el).value;t={id:uid('i'),desc:text,link,info:'',priority:prio||'medium',done:false,created:Date.now()};state.items[tid].push(t);justAdded=t.id;msg='Dodano u '+splitName(tabById(tid).name).label;closeSheet();saveData();go('#/tab/'+encodeURIComponent(tid));toast(msg);return;}
      closeSheet();saveData();renderAll();toast(msg,{label:'Prikaži',fn:()=>go('#/dash/'+t.id)});
    }}],
    onOpen:(el)=>{
      const r=route();if(r.v==='tab'){target='list';$('#q_list',el).value=r.id;}if(r.v==='note'&&$('#q_note',el)){target='note';$('#q_note',el).value=r.id;}
      const sync=()=>{$$('#qChoices .choice',el).forEach(x=>x.classList.toggle('on',x.dataset.t===target));$('#qDate',el).style.display=target==='date'?'':'none';$('#qList',el).style.display=target==='list'?'':'none';$('#qNote',el).style.display=target==='note'?'':'none';};
      $$('#qChoices .choice',el).forEach(b=>b.addEventListener('click',()=>{target=b.dataset.t;sync();}));sync();
      $('#q_text',el).focus();
    }
  });
}

/* ═════════ TABS / LISTE ═════════ */
function openTabEditor(id){
  const tab=id?tabById(id):null;const n=tab?splitName(tab.name):{emo:'',label:''};
  openSheet({
    title:tab?'Uredi listu':'Nova lista',
    body:`<div class="grid2" style="grid-template-columns:90px 1fr">
      <div class="field"><label for="t_emo">Ikona</label><input id="t_emo" value="${esc(n.emo)}" maxlength="4" placeholder="📁" style="text-align:center;font-size:1.3rem"></div>
      <div class="field"><label for="t_name">Naziv</label><input id="t_name" value="${esc(n.label)}" maxlength="30" placeholder="npr. Kuća, Vrt, OPG…"></div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap" id="emoPick">${['🏠','🔧','📦','💼','🚗','🌱','🌳','🍇','🛒','✈️','💪','🧸','💶','📚','💡','🧪','🎁','🐾'].map(e=>`<button class="ibtn" style="font-size:1.2rem;background:var(--surface-2)" data-e="${e}">${e}</button>`).join('')}</div>
      ${tab?`<div style="font-size:.8rem;color:var(--text-3)">${(state.items[tab.id]||[]).length} stavki u listi. Redoslijed lista mijenjaš povlačenjem u bočnom izborniku.</div>`:''}`,
    actions:[
      ...(tab?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>confirmSheet(`Obrisati listu “${n.label}” i svih ${(state.items[tab.id]||[]).length} stavki?`,()=>{
        state.tabs=state.tabs.filter(t=>t.id!==tab.id);delete state.items[tab.id];saveData();go('#/');toast('Lista obrisana');})}]:[]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(tab?'Spremi':'Kreiraj'),cls:'btn-primary',primary:true,fn:()=>{
        const el=$('#sheet');const name=$('#t_name',el).value.trim();if(!name){$('#t_name',el).focus();return;}
        const emo=$('#t_emo',el).value.trim()||pickEmoji(name);const full=emo+' '+name;
        if(tab){tab.name=full;closeSheet();saveData();renderAll();}
        else{const nid='tab_'+Date.now();const bi=state.tabs.findIndex(t=>t.type==='bookmarks');state.tabs.splice(bi<0?state.tabs.length:bi,0,{id:nid,name:full,type:'todo',sort:'priority'});state.items[nid]=[];closeSheet();saveData();go('#/tab/'+nid);}
      }}],
    onOpen:(el)=>{$$('#emoPick button',el).forEach(b=>b.addEventListener('click',()=>{$('#t_emo',el).value=b.dataset.e;}));$('#t_name',el).focus();}
  });
}
function openListsSheet(){
  openSheet({title:'Liste',side:true,body:`<div class="sheet-list">${todoTabs().map(t=>{const n=splitName(t.name);return`<div style="display:flex;align-items:center"><a href="#/tab/${encodeURIComponent(t.id)}" data-close style="flex:1"><span class="emo">${esc(n.emo||'📁')}</span>${esc(n.label)}<span class="count">${openCount(t.id)} otvoreno</span></a><button class="ibtn" data-act="tabEdit" data-id="${esc(t.id)}" aria-label="Uredi">${icon('edit')}</button></div>`;}).join('')}</div>`,
    actions:[{label:icon('plus')+'Nova lista',cls:'btn-primary',primary:true,fn:()=>openTabEditor(null)}]});
}

/* ═════════ BOOKMARKS ACTIONS ═════════ */
function openBmEditor(id){
  const b=id?state.bookmarks.find(x=>x.id===id):null;
  openSheet({title:b?'Uredi web stranicu':'Nova web stranica',
    body:`<div class="field"><label for="b_url">URL *</label><input id="b_url" type="url" value="${esc(b?b.url:'')}" placeholder="https://…" autocomplete="off"></div>
      <div class="field"><label for="b_name">Naziv *</label><input id="b_name" value="${esc(b?b.name:'')}" placeholder="npr. YouTube"></div>
      <div class="field"><label for="b_cat">Kategorija</label><select id="b_cat">${state.bookmarkCats.map(c=>`<option value="${esc(c.id)}" ${(b?b.catId:activeBmCat)===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label for="b_note">Napomena</label><textarea id="b_note" placeholder="Kratki opis…">${esc(b?b.note||'':'')}</textarea></div>`,
    actions:[...(b?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>{closeSheet();delBm(b.id);}}]:[]),{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('check')+'Spremi',cls:'btn-primary',primary:true,fn:()=>{
      const el=$('#sheet');const url=normUrl($('#b_url',el).value);let name=$('#b_name',el).value.trim();
      if(!url){$('#b_url',el).focus();return;}if(!name)name=tryDomain(url);
      const data={url,name,catId:$('#b_cat',el).value,note:$('#b_note',el).value.trim()};
      if(b)Object.assign(b,data);else state.bookmarks.push({id:'b'+Date.now(),...data});
      activeBmCat=data.catId;closeSheet();saveData();renderAll();}}],
    onOpen:(el)=>{const u=$('#b_url',el),n=$('#b_name',el);u.focus();u.addEventListener('blur',()=>{if(!n.value.trim()&&u.value.trim())n.value=tryDomain(normUrl(u.value)).split('.')[0].replace(/^./,c=>c.toUpperCase());});}
  });
}
function delBm(id){const i=state.bookmarks.findIndex(b=>b.id===id);if(i<0)return;const[b]=state.bookmarks.splice(i,1);saveData();renderAll();toast('Obrisano: '+b.name,{label:'Poništi',fn:()=>{state.bookmarks.splice(i,0,b);saveData();renderAll();}});}
function openCatEditor(id){
  const c=id?state.bookmarkCats.find(x=>x.id===id):null;const cnt=c?state.bookmarks.filter(b=>b.catId===c.id).length:0;
  openSheet({title:c?'Uredi kategoriju':'Nova kategorija',body:`<div class="field"><label for="c_name">Naziv</label><input id="c_name" value="${esc(c?c.name:'')}" maxlength="30" placeholder="npr. Vijesti, Posao…"></div>`,
    actions:[...(c&&state.bookmarkCats.length>1?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>confirmSheet(`Obrisati kategoriju “${c.name}”${cnt?` i ${cnt} stranica`:''}?`,()=>{state.bookmarkCats=state.bookmarkCats.filter(x=>x.id!==c.id);state.bookmarks=state.bookmarks.filter(b=>b.catId!==c.id);activeBmCat=state.bookmarkCats[0].id;saveData();go('#/web');})}]:[]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('check')+'Spremi',cls:'btn-primary',primary:true,fn:()=>{
        const name=$('#c_name').value.trim();if(!name)return;
        if(c)c.name=name;else{const nc={id:'bmcat_'+Date.now(),name};state.bookmarkCats.push(nc);activeBmCat=nc.id;}
        closeSheet();saveData();go('#/web/'+encodeURIComponent(activeBmCat));}}],
    onOpen:el=>$('#c_name',el).focus()});
}

/* ═════════ DAY MENU / HISTORY ACTIONS ═════════ */
function openDayMenu(wk,dk){
  const d=dateFromDk(dk);const list=getDayList(wk,dk,false);const open=list.filter(t=>!t.done);
  openSheet({title:`${DAY_NAMES[dayIdx(d)]}, ${formatDayLabel(d)}`,side:true,body:`<div class="sheet-list">
    <button class="row" data-dm="sort">${icon('sort')}Sortiraj po prioritetu<span class="count">${list.length}</span></button>
    <button class="row" data-dm="next">${icon('moveR')}Prenesi nedovršeno na sljedeći dan<span class="count">${open.length}</span></button>
    <button class="row" data-dm="hp">${icon('flame')}Prebaci nedovršeno u Hitno<span class="count">${open.length}</span></button>
    <button class="row" data-dm="clear" style="color:var(--urgent)">${icon('trash')}Obriši završene<span class="count">${list.length-open.length}</span></button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-dm]',el).forEach(b=>b.addEventListener('click',()=>{
      const L=getDayList(wk,dk,true);const a=b.dataset.dm;
      if(a==='sort'){const p={high:0,medium:1,low:2,'':3};L.sort((x,y)=>(x.done-y.done)||((p[x.priority||'']??3)-(p[y.priority||'']??3)));toast('Sortirano po prioritetu');}
      if(a==='next'){const nd=addDays(d,1);const mv=L.filter(t=>!t.done);state.weeklyTasks[wk][dk]=L.filter(t=>t.done);mv.forEach(t=>getDayList(getWeekKey(nd),formatDateKey(nd),true).push(t));toast(`${mv.length} prenijeto na ${shortDay(nd)}`);}
      if(a==='hp'){const mv=L.filter(t=>!t.done);state.weeklyTasks[wk][dk]=L.filter(t=>t.done);state.highPriority.push(...mv);toast(`${mv.length} prebačeno u Hitno`);}
      if(a==='clear'){state.weeklyTasks[wk][dk]=L.filter(t=>!t.done);toast('Završeni obrisani');}
      closeSheet();saveData();renderAll();}))});
}
function carryWeek(wk){
  const mv=[];weekTasks(wk).forEach(({dk})=>{const L=getDayList(wk,dk,false);if(!L.length)return;state.weeklyTasks[wk][dk]=L.filter(t=>t.done);mv.push(...L.filter(t=>!t.done));});
  if(!mv.length){toast('Nema nedovršenih zadataka');return;}
  const td=today();mv.forEach(t=>getDayList(getWeekKey(td),formatDateKey(td),true).push(t));
  saveData();renderAll();toast(`${mv.length} zadataka prenijeto na danas`,{label:'Prikaži',fn:()=>go('#/')});
}

/* ═════════ NOTIFICATIONS / PODSJETNICI ═════════ */
const notified=new Set();
let startupDone=false;
function openNotifications(){
  const {due,soon}=reminders();
  const row=(x,isDue)=>{const t=x.t;const r=findTask(t.id);return`<div class="notif${isDue?' due':''}" data-id="${esc(t.id)}">
    <div class="ico ${isDue?'ico-urgent':'ico-warn'}">${icon('bell')}</div>
    <div class="tx"><b>${linkify(title(t))}</b><small>${esc(fmtRem(t.reminder.at))} · ${esc(whereLabel(r))}</small>
      <div class="acts">
        <button class="btn btn-primary btn-sm" data-n="done">${icon('check')}Gotovo</button>
        ${isDue?`<button class="btn btn-ghost btn-sm" data-n="snooze">+1 h</button><button class="btn btn-ghost btn-sm" data-n="tomorrow">Sutra 9:00</button><button class="btn btn-ghost btn-sm" data-n="seen">Viđeno</button>`:''}
        <button class="btn btn-ghost btn-sm" data-n="open">Otvori</button>
      </div></div></div>`;};
  const perm='Notification'in window?Notification.permission:'unsupported';
  openSheet({title:'Podsjetnici',side:true,body:`
    ${due.length?`<div class="sec-title">Sada (${due.length})</div>${due.map(x=>row(x,true)).join('')}`:`<div class="empty"><span class="big">🔕</span>Nema dospjelih podsjetnika.</div>`}
    ${soon.length?`<div class="sec-title">Uskoro (24 h)</div>${soon.map(x=>row(x,false)).join('')}`:''}
    <div class="sec-title" style="margin-top:6px">Postavke</div>
    <label class="switch"><input type="checkbox" id="n_sum" ${state.settings.openSummary?'checked':''}><span class="track"></span>Sažetak dana pri otvaranju</label>
    ${perm==='granted'?`<div style="font-size:.8rem;color:var(--ok);font-weight:700">${icon('check')} Sistemske obavijesti su uključene na ovom uređaju.</div>`
      :perm==='denied'?`<div style="font-size:.8rem;color:var(--text-3)">Sistemske obavijesti su blokirane u pregledniku — omogući ih u postavkama stranice.</div>`
      :perm==='unsupported'?`<div style="font-size:.8rem;color:var(--text-3)">Ovaj preglednik ne podržava sistemske obavijesti${/iP(hone|ad)/.test(navigator.userAgent)?' — na iPhoneu dodaj Planner na početni zaslon (Dijeli → Dodaj na početni zaslon)':''}.</div>`
      :`<button class="btn btn-outline" id="n_perm">${icon('bell')}Uključi sistemske obavijesti</button>`}`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>{
      $('#n_sum',el).addEventListener('change',e=>{state.settings.openSummary=e.target.checked;saveData();});
      const pb=$('#n_perm',el);if(pb)pb.addEventListener('click',()=>askNotifPermission());
      $$('.notif [data-n]',el).forEach(b=>b.addEventListener('click',()=>{
        const id=b.closest('.notif').dataset.id;const r=findTask(id);if(!r)return;const t=r.task;const a=b.dataset.n;
        if(a==='done'){setDone(r,true);}
        if(a==='seen'){t.reminder.seen=true;}
        if(a==='snooze'){const d=new Date(Math.max(Date.now(),new Date(t.reminder.at).getTime())+36e5);t.reminder.at=localDT(d);t.reminder.seen=false;notified.delete(id);}
        if(a==='tomorrow'){const d=addDays(today(),1);d.setHours(9,0,0,0);t.reminder.at=localDT(d);t.reminder.seen=false;notified.delete(id);}
        saveData();
        if(a==='open'){closeSheet();go(r.kind==='item'?`#/tab/${encodeURIComponent(r.tabId)}/${encodeURIComponent(id)}`:`#/dash/${encodeURIComponent(id)}`);return;}
        renderAll();openNotifications();
      }));
    }});
}
async function askNotifPermission(silent){
  if(!('Notification'in window)){if(!silent)toast('Preglednik ne podržava obavijesti');return;}
  try{const p=await Notification.requestPermission();if(p==='granted'){toast('🔔 Obavijesti uključene');systemNotify('Planner','Obavijesti rade! Podsjetnici će se prikazati ovdje.');}if(!silent&&$('#sheetBg').classList.contains('open'))openNotifications();}catch(e){}
}
async function systemNotify(t,body,tag){
  if(!('Notification'in window)||Notification.permission!=='granted')return;
  const opts={body,tag:tag||'planner',icon:'icon-192.png',badge:'icon-192.png',renotify:!!tag};
  try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg){await reg.showNotification(t,opts);return;}}catch(e){}
  try{new Notification(t,opts);}catch(e){}
}
function checkReminders(isStartup){
  const {due}=reminders();
  const fresh=due.filter(x=>!notified.has(x.t.id));
  fresh.forEach(x=>{notified.add(x.t.id);systemNotify('⏰ '+title(x.t),fmtRem(x.t.reminder.at)+' · Planner',x.t.id);});
  updateBadges();
  if(isStartup){
    if(due.length){openNotifications();}
    else if(state.settings.openSummary){
      const td=today();const L=getDayList(getWeekKey(td),formatDateKey(td),false).filter(t=>!t.done).length;const hp=state.highPriority.filter(t=>!t.done).length;
      if(L||hp)toast(`☀️ Danas: ${L} ${L===1?'zadatak':L>1&&L<5?'zadatka':'zadataka'} · ${hp} hitno`,{ms:4500});
    }
  }else if(fresh.length){
    toast(`⏰ ${title(fresh[0].t).slice(0,50)}`,{label:'Prikaži',fn:openNotifications,ms:8000});
    if(route().v==='dash')scheduleRemoteRender();
  }
}
setInterval(()=>{if(cloudReady)checkReminders(false);},30000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&cloudReady){checkReminders(false);if(!isBusy())renderAll();}});

/* ═════════ SHEET ═════════ */
let curSheet=null;
function openSheet(o){
  curSheet=o;const el=$('#sheet');el.className='sheet'+(o.side?' side':'');
  const left=(o.actions||[]).filter(a=>a.left),right=(o.actions||[]).filter(a=>!a.left);
  el.innerHTML=`<div class="handle"></div><div class="sheet-head"><h3>${o.title}</h3><button class="ibtn" data-act="closeSheet" aria-label="Zatvori">${icon('x')}</button></div>
    <div class="sheet-body">${o.body}</div>
    ${(o.actions||[]).length?`<div class="sheet-foot">${left.map(a=>`<button class="btn ${a.cls}" data-sa="${o.actions.indexOf(a)}">${a.label}</button>`).join('')}<span class="spacer"></span>${right.map(a=>`<button class="btn ${a.cls}" data-sa="${o.actions.indexOf(a)}">${a.label}</button>`).join('')}</div>`:''}`;
  $('#sheetBg').classList.add('open');
  $$('[data-sa]',el).forEach(b=>b.addEventListener('click',()=>o.actions[+b.dataset.sa].fn()));
  $$('[data-close]',el).forEach(a=>a.addEventListener('click',()=>closeSheet()));
  el.querySelectorAll('input:not([type=checkbox]):not([type=date]):not([type=datetime-local])').forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){const p=o.actions&&o.actions.find(a=>a.primary);if(p){e.preventDefault();p.fn();}}}));
  if(o.onOpen)setTimeout(()=>o.onOpen(el),30);
}
function closeSheet(){$('#sheetBg').classList.remove('open');curSheet=null;if(pendingRemote&&!isBusy()){pendingRemote=false;renderAll();}}
function confirmSheet(msg,yes){openSheet({title:'Potvrda',body:`<p>${esc(msg)}</p>`,actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:'Obriši',cls:'btn-danger',primary:true,fn:()=>{closeSheet();yes();}}]});}
$('#sheetBg').addEventListener('click',e=>{if(e.target.id==='sheetBg')closeSheet();});
// swipe-down za zatvaranje na mobitelu
(()=>{let y0=null;const s=$('#sheet');s.addEventListener('touchstart',e=>{if(e.target.closest('.sheet-head,.handle'))y0=e.touches[0].clientY;},{passive:true});
  s.addEventListener('touchmove',e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0;if(dy>0)s.style.transform=`translateY(${dy}px)`;},{passive:true});
  s.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;s.style.transform='';y0=null;if(dy>90)closeSheet();});})();

/* ═════════ TOAST ═════════ */
function toast(msg,o={}){
  const box=$('#toasts');const el=document.createElement('div');el.className='toast';
  el.innerHTML=`<span>${esc(msg)}</span>${o.label?`<button>${esc(o.label)}</button>`:''}`;
  const kill=()=>{el.classList.add('out');setTimeout(()=>el.remove(),260);};
  if(o.label)el.querySelector('button').addEventListener('click',()=>{o.fn&&o.fn();kill();});
  box.appendChild(el);while(box.children.length>3)box.firstChild.remove();
  setTimeout(kill,o.ms||(o.label?5500:2600));
}

/* ═════════ THEME ═════════ */
function isDark(){const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;}
function applyTheme(){const t=lsGet('planner.theme','');if(t)document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;}
applyTheme();

/* ═════════ EVENT DELEGATION ═════════ */
const ACT={
  toggle:el=>toggleTask(el.dataset.id),
  edit:el=>editTask(el.dataset.id),
  del:el=>deleteTask(el.dataset.id),
  send:el=>openSendToTodo(el.dataset.id),
  addHp:()=>{const inp=$('#hpInput');if(!inp||!inp.value.trim())return inp&&inp.focus();const v=inp.value;inp.value='';addHp(v,{link:extractLink(v)});saveData();renderAll();$('#hpInput')&&$('#hpInput').focus();},
  addDay:el=>{const inp=$(`.day-add input[data-dk="${el.dataset.dk}"]`);if(!inp||!inp.value.trim())return inp&&inp.focus();const v=inp.value;inp.value='';addDay(el.dataset.wk,el.dataset.dk,v,{priority:dayPrio[el.dataset.dk]||'',link:extractLink(v)});saveData();renderAll();const n=$(`.day-add input[data-dk="${el.dataset.dk}"]`);n&&n.focus();},
  cyclePrio:el=>{const order=['','high','medium','low'];const c=dayPrio[el.dataset.dk]||'';dayPrio[el.dataset.dk]=order[(order.indexOf(c)+1)%4];const pd=el.querySelector('.pd');pd.className='pd pd-'+dayPrio[el.dataset.dk];el.title='Prioritet: '+({high:'visok',medium:'srednji',low:'nizak'}[dayPrio[el.dataset.dk]]||'bez');},
  weekNav:el=>{const dir=+el.dataset.dir;if(!dir)viewingWeekKey=null;else{const m=mondayFromKey(viewingWeekKey||getCurrentWeekKey());m.setDate(m.getDate()+dir*7);viewingWeekKey=getWeekKey(m);if(viewingWeekKey===getCurrentWeekKey())viewingWeekKey=null;}refreshBoard();},
  dayMenu:el=>openDayMenu(el.dataset.wk,el.dataset.dk),
  archiveHp:()=>{const done=state.highPriority.filter(t=>t.done);state.highPriority=state.highPriority.filter(t=>!t.done);state.hpArchive.unshift(...done);saveData();renderAll();toast(`${done.length} premješteno u povijest`,{label:'Povijest',fn:()=>{histMode='hp';go('#/history');}});},
  scrollTo:(el,e)=>{e.preventDefault();const t=document.getElementById(el.dataset.target);t&&t.scrollIntoView({behavior:'smooth',block:'start'});},
  tabEdit:(el,e)=>{e.preventDefault();e.stopPropagation();openTabEditor(el.dataset.id||null);},
  filter:el=>{tabState(route().id).filter=el.dataset.f;renderAll();},
  tabSort:el=>{const t=tabById(route().id);if(t){t.sort=el.dataset.s;saveData();renderAll();}},
  qaMore:()=>{const ts=tabState(route().id);ts.open=!ts.open;$('#qa').classList.toggle('open',ts.open);},
  itemAdd:()=>{
    const tabId=route().id;const d=$('#qa_desc');const desc=d.value.trim();if(!desc){d.focus();return;}
    const due=$('#qa_due').value;
    const it={id:uid('i'),desc,link:$('#qa_link').value.trim()||extractLink(desc),info:$('#qa_info').value.trim(),priority:segVal('qa_prio')||'medium',done:false,created:Date.now()};
    if(due)it.due=due;
    const tab=tabById(tabId);if(tab&&tab.sort==='manual')state.items[tabId].unshift(it);else state.items[tabId].push(it);
    justAdded=it.id;saveData();renderAll();const n=$('#qa_desc');n&&n.focus();
  },
  segPick:el=>{const seg=el.closest('.seg');seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===el));},
  bmEdit:el=>openBmEditor(el.dataset.id||null),
  bmDel:el=>delBm(el.dataset.id),
  catEdit:el=>openCatEditor(el.dataset.id||null),
  histToggle:el=>el.closest('.hist-week').classList.toggle('open'),
  histMode:el=>{histMode=el.dataset.m;renderAll();},
  histOpen:el=>{viewingWeekKey=el.dataset.wk;go('#/');setTimeout(()=>{const b=$('#boardCard');b&&b.scrollIntoView({behavior:'smooth'});},120);},
  histDel:el=>confirmSheet('Obrisati cijeli tjedan iz povijesti?',()=>{delete state.weeklyTasks[el.dataset.wk];saveData();renderAll();toast('Tjedan obrisan');}),
  histCarry:el=>carryWeek(el.dataset.wk),
  notif:()=>openNotifications(),
  settings:()=>openSettings(),
  noteNew:(el,e)=>{e.preventDefault();e.stopPropagation();newNote(el.dataset.tpl||'blank');},
  noteMenu:el=>openNoteMenu(el.dataset.id),
  noteHide:el=>{const n=curNote();if(n){n.hideDone=el.dataset.v==='1';touchNote(n);renderAll();}},
  nbAdd:el=>{const n=curNote();if(!n)return;const after=lastNoteBlock&&n.blocks.find(b=>b.id===lastNoteBlock)?lastNoteBlock:null;insertBlock(n,after,el.dataset.t);touchNote(n);renderAll();},
  nbToggle:el=>{const n=curNote();if(!n)return;const b=n.blocks.find(z=>z.id===el.dataset.bid);if(!b)return;b.d=!b.d;vibrate(10);
    const row=el.closest('.nb');row.classList.toggle('done',b.d);row.classList.remove('pop');void row.offsetWidth;row.classList.add('pop');touchNote(n);refreshNoteStats(n);
    if(n.hideDone&&b.d)setTimeout(()=>renderAll(),350);},
  nbDel:el=>{const n=curNote();if(!n)return;const i=n.blocks.findIndex(z=>z.id===el.dataset.bid);if(i<0)return;const[b]=n.blocks.splice(i,1);if(!n.blocks.length)n.blocks.push({id:uid('b'),t:'p',x:'',d:false});touchNote(n);renderAll();
    if(b.x.trim())toast('Uklonjeno: '+b.x.slice(0,30),{label:'Poništi',fn:()=>{n.blocks.splice(i,0,b);touchNote(n);renderAll();}});},
  gcalConnect:()=>gcalConnect(),
  gcalRefresh:()=>{GCAL.weeks={};renderAll();},
  quickAdd:()=>openQuickAdd(),
  lists:()=>openListsSheet(),
  closeSheet:()=>closeSheet(),
  theme:()=>{lsSet('planner.theme',isDark()?'light':'dark');applyTheme();renderAll();},
  logout:()=>confirmSheet2('Odjaviti se s ovog uređaja?','Odjava',()=>signOut()),
  account:()=>openSheet({title:esc(user.name||'Račun'),side:true,body:`<div class="user-row"><div class="avatar">${user.photo?`<img src="${esc(user.photo)}" alt="" referrerpolicy="no-referrer">`:''}</div><div class="who"><b>${esc(user.name||'')}</b><small>${esc(user.email||'')}</small></div></div>
    <div class="sheet-list"><button class="row" data-act="theme">${icon(isDark()?'sun':'moon')}${isDark()?'Svijetla tema':'Tamna tema'}</button><button class="row" data-act="settings">${icon('gear')}Postavke · kalendar · dijeljenje · sigurnost</button><button class="row" data-act="notif">${icon('bell')}Podsjetnici i obavijesti</button><button class="row" data-act="logout" style="color:var(--urgent)">${icon('logout')}Odjava</button></div>`}),
};
function confirmSheet2(msg,label,yes){openSheet({title:'Potvrda',body:`<p>${esc(msg)}</p>`,actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label,cls:'btn-primary',primary:true,fn:()=>{closeSheet();yes();}}]});}
function refreshBoard(){const b=$('#boardCard');if(!b){renderAll();return;}renderAll();}
document.addEventListener('click',e=>{
  const a=e.target.closest('a');
  const el=e.target.closest('[data-act]');
  if(a&&(!el||a.contains(el)===false&&el.contains(a))){ // klik na link unutar kartice — pusti link
    if(a.getAttribute('href')&&a.getAttribute('href').startsWith('#'))closeSheet();
    return;}
  if(!el)return;
  const fn=ACT[el.dataset.act];if(fn){fn(el,e);}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&curSheet){closeSheet();return;}
  const t=e.target;
  if(t.classList&&t.classList.contains('nb-in')&&noteKeydown(e,t))return;
  if(e.key==='Enter'&&t.dataset&&t.dataset.noteTitle!==undefined){e.preventDefault();const f=$('.nb-in');f&&f.focus();return;}
  if(e.key==='Enter'&&!e.isComposing&&t.dataset&&t.dataset.enter){e.preventDefault();ACT[t.dataset.enter](t,e);return;}
  if(!curSheet&&!/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
    if(e.key==='n'||e.key==='N'){e.preventDefault();openQuickAdd();}
    if(e.key==='/'){const s=$('.searchbox input');if(s){e.preventDefault();s.focus();}}
  }
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.classList&&t.classList.contains('nb-in')){noteInput(t);return;}
  if(t.dataset&&t.dataset.noteTitle!==undefined){const n=noteById(t.dataset.noteTitle);if(n){n.title=t.value;touchNote(n);}return;}
  if(!t.dataset||!t.dataset.input)return;
  const k=t.dataset.input;
  clearTimeout(t._deb);t._deb=setTimeout(()=>{
    if(k==='histSearch')histSearch=t.value;
    if(k==='bmSearch')bmSearch=t.value;
    if(k==='tabSearch')tabState(t.dataset.id).q=t.value;
    if(INPUT_SET[k])INPUT_SET[k](t.value,t);
    renderAll();const n=$(`[data-fk="${t.dataset.fk}"]`);if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}
  },180);
});
document.addEventListener('change',e=>{
  const t=e.target;if(t.dataset&&t.dataset.change==='plannerSwitch'){window._fbSwitch&&window._fbSwitch(t.value);return;}
  if(t.dataset&&CHANGE_SET[t.dataset.change]){CHANGE_SET[t.dataset.change](t.value,t);return;}
  if(t.dataset&&t.dataset.change==='pickWeek'&&t.value){const wk=getWeekKey(fromInputDate(t.value));viewingWeekKey=wk===getCurrentWeekKey()?null:wk;refreshBoard();}
});
// tap na prošli dan na mobitelu otvara/zatvara ga
document.addEventListener('click',e=>{const h=e.target.closest('.day.past .day-head');if(h&&!e.target.closest('[data-act]')&&matchMedia('(max-width:640px)').matches)h.parentElement.classList.toggle('collapsed');});

/* ═════════ AUTH / BOOT (pozivi iz Firebase modula) ═════════ */
function signIn(){if(window._fbSignIn)window._fbSignIn();else $('#loginStatus').textContent='Firebase se još učitava…';}
function signOut(){if(LOCAL_MODE){location.href=location.pathname;return;}window._fbSignOut&&window._fbSignOut();}
window.onSignedIn=u=>{user=u;$('#login').style.display='none';$('#app').classList.add('ready');setSyncStatus('syncing','Učitavam…');renderAll();};
window.onSignedOut=()=>{$('#login').style.display='flex';$('#app').classList.remove('ready');$('#loginStatus').textContent='Nisi prijavljen.';};
window.onLoginError=e=>{$('#loginStatus').textContent='Greška: '+(e&&e.message||e);};
window.onRemoteState=(data)=>{state=normalize(data);scheduleRemoteRender();if(curSheet&&$('#sheet .notif'))openNotifications();};
document.addEventListener('paste',e=>{const t=e.target;if(t.classList&&t.classList.contains('nb-in'))notePaste(e,t);});
document.addEventListener('focusin',e=>{const t=e.target;if(t.classList&&t.classList.contains('nb-in'))lastNoteBlock=t.dataset.bid;});
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'&&t.hasAttribute('data-fav'))t.replaceWith(document.createTextNode('🌐'));},true);
$('#googleBtn').addEventListener('click',()=>signIn());
window.onPlannerMeta=m=>{plannerMeta=m;if(!m.own)toast('Otvoren je planner: '+(m.ownerName||m.ownerEmail));renderAll();};
window.onSharedList=list=>{sharedPlanners=list;renderAll();};
window.onCloudReady=()=>{cloudReady=true;if(!startupDone){startupDone=true;setTimeout(()=>checkReminders(true),600);}};


// service worker (potreban za obavijesti na Androidu i instalaciju kao aplikacija)
if('serviceWorker'in navigator&&location.protocol.startsWith('http')){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  navigator.serviceWorker.addEventListener&&navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='open-notifications')openNotifications();});}
window.addEventListener('online',()=>setSyncStatus('syncing','Ponovno spajanje…'));
window.addEventListener('offline',()=>setSyncStatus('offline','Offline – promjene se spremaju lokalno'));
