'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   BOOT — spaja nove sekcije u postojeći shell (sidebar, donja traka, dashboard)
   ═══════════════════════════════════════════════════════════════════════ */
function normalizeExtra(s){
  s.drinks=s.drinks&&typeof s.drinks==='object'?s.drinks:{};
  ['fav','rate','note','photo','bar','made','credit','noweb'].forEach(k=>{if(!s.drinks[k]||typeof s.drinks[k]!=='object')s.drinks[k]={};});
  s.diy=s.diy&&typeof s.diy==='object'?s.diy:{};
  if(!Array.isArray(s.diy.cats)||!s.diy.cats.length)s.diy.cats=DIY_DEFAULT_CATS.map(([id,e,n])=>({id,emoji:e,name:n}));
  s.kids=Array.isArray(s.kids)?s.kids.filter(k=>k&&k.id):[];
  s.kids.forEach(normKid);
}
state=normalize(state);

function beforeRender(r){
  // urednik recepta: sačuvaj ono što je upisano prije ponovnog crtanja; očisti skicu kad se izađe
  const editing=(r.v==='kuharica'||r.v==='kokteli')&&(r.id==='new'||r.sub==='edit');
  if(draft&&$('#e_title'))try{readDraftForm();}catch(e){}
  if(draft&&!editing){if(draft.isNew)draft.newImgs.forEach(imgDelete);draft=null;}
}

/* ───────── SIDEBAR: sekcije ───────── */
function sectionsNav(r){
  const recN=docsOf('recipe').length;const act=projects().filter(p=>p.status==='progress').length;
  const nav=(href,on,emo,label,count,cls='')=>`<a class="nav-item${on?' active':''}${cls?' '+cls:''}" href="${href}"><span class="emo">${emo}</span><span class="nav-txt">${esc(label)}</span>${count?`<span class="count">${count}</span>`:''}</a>`;
  const diyOpen=r.v==='diy';const kidsOpen=r.v==='kids';
  const curProj=r.v==='diy'&&r.id==='p'?docById(r.sub):null;
  return`<div class="nav-label">Kuća i obitelj</div>
    ${nav('#/kuharica',r.v==='kuharica','🍳','Kuharica',recN)}
    ${nav('#/kokteli',r.v==='kokteli','🍸','Kokteli i napitci','')}
    ${nav('#/diy',r.v==='diy'&&!r.id,'🔨','DIY',act?`${act} u tijeku`:'')}
    ${diyOpen||true?`<div class="nav-sub">${diyCats().map(c=>{const n=projects().filter(p=>p.cat===c.id&&p.status!=='done').length;
      return nav('#/diy/c/'+encodeURIComponent(c.id),(r.id==='c'&&r.sub===c.id)||(curProj&&curProj.cat===c.id),c.emoji,c.name,n||'');}).join('')}</div>`:''}
    ${nav('#/kids',r.v==='kids'&&!r.id,'🧒','Kids','')}
    ${kids().length?`<div class="nav-sub">${kids().map(k=>nav('#/kids/'+encodeURIComponent(k.id),r.v==='kids'&&r.id===k.id,esc(k.emoji||'🧒'),k.name||'Dijete','')).join('')}</div>`:''}`;
}
ACT.more=()=>openSheet({title:'Sve sekcije',side:true,body:`<div class="tiles">
  ${[['#/kuharica','🍳','Kuharica',`${docsOf('recipe').length} ${plural(docsOf('recipe').length,'recept','recepta','recepata')}`],['#/kokteli','🍸','Kokteli i napitci',`${allDrinks().length} recepata`],['#/diy','🔨','DIY projekti',`${projects().filter(p=>p.status==='progress').length} u tijeku`],['#/kids','🧒','Kids',kids().map(k=>k.name).join(', ')||'raspored sati'],['#/notes','📝','Notes',`${state.notes.length} bilješki`],['#/web','🌐','Web stranice',`${state.bookmarks.length}`],['#/history','🕘','Povijest','prošli tjedni']]
    .map(([h,e,l,s])=>`<a class="tile" href="${h}" data-close><span>${e}</span><b>${esc(l)}</b><small>${esc(s)}</small></a>`).join('')}</div>
  <div class="sheet-list" style="margin-top:6px">${diyCats().map(c=>`<a href="#/diy/c/${encodeURIComponent(c.id)}" data-close><span class="emo">${esc(c.emoji)}</span>DIY · ${esc(c.name)}</a>`).join('')}</div>`,
  actions:[{label:icon('gear')+'Postavke',cls:'btn-ghost',fn:()=>{closeSheet();openSettings();}}]});

/* ───────── DASHBOARD dodaci ───────── */
function dashExtra(){
  const kc=kidsDashCard();
  const prog=projects().filter(p=>p.status==='progress').sort((a,b)=>(b.updated||0)-(a.updated||0)).slice(0,3);
  const diy=prog.length?`<section class="card"><div class="card-head"><h2>🔨 DIY u tijeku</h2><span class="spacer"></span><a class="link-btn" href="#/diy">Svi ${icon('arrowR')}</a></div>
    <div class="card-body dash-proj">${prog.map(p=>{const s=pStats(p);const pct=s.steps?Math.round(s.stepsDone/s.steps*100):0;const nx=(p.steps||[]).find(x=>!x.d&&(x.x||'').trim());
      return`<a class="dp" href="#/diy/p/${encodeURIComponent(p.id)}"><span class="dp-e">${esc(p.emoji||'🛠️')}</span><div><b>${esc(p.title)}</b><small>${nx?'Sljedeće: '+esc(nx.x.slice(0,70)):'Svi koraci gotovi'}</small><div class="bar"><i style="width:${pct}%"></i></div></div><span class="dp-p">${pct}%</span></a>`;}).join('')}</div></section>`:'';
  if(!kc&&!diy)return'';
  return`<div class="dash-extra${kc&&diy?' two':''}">${kc}${diy}</div>`;
}

INPUT_SET.dSearch=v=>{KUI.dq=v;};
INPUT_SET.rSearch=v=>{KUI.rq=v;};
INPUT_SET.pSearch=v=>{DUI.q=v;};
CHANGE_SET.rSort=v=>{KUI.rsort=v;lsSet('planner.rsort',v);renderAll();};

/* ───────── LOKALNI NAČIN (bez prijave) ───────── */
if(LOCAL_MODE){
  try{const raw=localStorage.getItem(LOCAL_KEY);if(raw)state=normalize(JSON.parse(raw));}catch(e){}
  loadLocalDocs();
  window.onSignedIn({name:'Lokalni korisnik',photo:'',email:'samo ovaj preglednik'});
  setSyncStatus('local','Lokalni način');window.onCloudReady();
}
