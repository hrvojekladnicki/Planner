'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   DIY — projekti po podsekcijama (stolarija, kuća, vrt…)
   Projekt = zaseban dokument (kind 'diy'): materijal, alat, koraci sa slikama,
   galerija, linkovi, troškovi. Kategorije su u state.diy.cats.
   ═══════════════════════════════════════════════════════════════════════ */
const DIY_STATUS={idea:['💡','Ideja','low'],plan:['📐','Planiranje','week'],progress:['🔨','U tijeku','accent'],hold:['⏸️','Na čekanju','warn'],done:['✅','Završeno','ok']};
const DIY_DEFAULT_CATS=[['stolarija','🪚','Stolarija'],['kuca','🏠','Kuća i uređenje'],['vrt','🌱','Vrt i dvorište'],['elektrika','⚡','Elektrika i pametna kuća'],['popravci','🔧','Popravci i održavanje'],['opg','🌳','OPG']];
const DIY_TPL={
  blank:{name:'Prazan projekt',emoji:'🛠️',steps:[],mat:[],tools:[]},
  vrata:{name:'Drvena vrata',emoji:'🚪',cat:'stolarija',
    steps:['Izmjeri otvor (širina × visina na 3 mjesta) i provjeri pravokutnost dijagonalama','Nacrtaj skicu s mjerama i izračunaj materijal','Nabavi drvo, okov i potrošni materijal','Izreži dijelove okvira i ispune','Spoji okvir (ljepilo + tiple/vijci), stegni i provjeri dijagonale','Brusi: 80 → 120 → 180','Zaštiti: impregnacija + 2–3 sloja lazure/laka','Ugradi šarke i bravu','Postavi vrata i podesi zazore (2–3 mm)'],
    mat:['4 kom Gredice za okvir','6 m² Daske / ploče za ispunu','3 kom Šarke','1 kom Brava s kvakom','1 pak Vijci za drvo','1 kom Ljepilo za drvo (D3)','1 kom Brusni papir (set)','1 l Lazura / lak'],
    tools:['Kružna pila','Bušilica-odvijač','Brusilica','Metar','Kutnik','Stege','Libela']},
  polica:{name:'Polica / ormar',emoji:'🗄️',cat:'stolarija',
    steps:['Izmjeri prostor i odluči dimenzije','Nacrtaj skicu i krojnu listu','Nabavi ploče / drvo i okov','Izreži dijelove (ili naruči krojenje)','Izbuši rupe za tiple / police','Sastavi korpus i provjeri kut','Obradi rubove (kant traka / brušenje)','Površinska zaštita','Montiraj na zid / postavi'],
    mat:['2 kom Ploča (iverica / šperploča)','1 rola Kant traka','1 pak Tiple 8 mm','1 pak Vijci za drvo','4 kom Nosači polica'],tools:['Ubodna pila','Bušilica-odvijač','Metar','Kutnik','Stege']},
  nadstresnica:{name:'Nadstrešnica / pergola',emoji:'🏗️',cat:'kuca',
    steps:['Odredi lokaciju, dimenzije i nagib krova','Provjeri propise / potrebnu dokumentaciju','Skica i statika (presjeci greda, razmak stupova)','Nabava drvene građe i okova','Iskolči i izradi temeljne stope','Postavi stupove (papuče za stupove)','Montiraj grede i rogove','Postavi pokrov (lim / ploče / crijep)','Oluk i odvod vode','Zaštita drva (2–3 sloja)'],
    mat:['6 kom Stupovi 12×12 cm','4 kom Grede 12×16 cm','10 kom Rogovi 8×12 cm','6 kom Papuče za stupove','1 pak Vijci / sidra','1 kom Krovni pokrov (m²)','1 kom Oluk + odvodna cijev','4 vreće Beton'],
    tools:['Kružna pila','Bušilica-odvijač','Libela','Mješalica za beton','Metar','Ljestve']},
  popravak:{name:'Popravak',emoji:'🔧',cat:'popravci',steps:['Utvrdi uzrok kvara','Fotografiraj stanje prije','Nabavi dijelove','Popravi','Testiraj','Fotografiraj stanje poslije'],mat:[],tools:[]},
};
const DIY_MODS={mat:['📦','Materijal'],tools:['🔨','Alat'],steps:['🪜','Koraci'],tasks:['🗓️','Zadaci i rokovi'],checks:['☑️','Checkliste'],notes:['📝','Bilješke'],links:['🔗','Linkovi'],img:['🖼️','Slike']};
const MODS_DIY=['mat','tools','steps','img','links'];
const MODS_GEN=['tasks','checks','notes','links','img'];
const GEN_TPL={
  page:{name:'Prazna stranica',emoji:'📄',mods:MODS_GEN,tasks:[],checks:[],notes:[]},
  papiri:{name:'Papirologija',emoji:'📑',mods:['tasks','checks','notes','links','img'],
    tasks:['Provjeriti rokove za prijave i potpore','Obnova / ažuriranje upisa u upisnik','Godišnja evidencija i izvješća','Osiguranje — obnova police'],
    checks:[['Dokumenti — gdje je što',['Rješenje o upisu','OIB / žiro račun','Ugovori','Računi i evidencija prodaje']]],notes:[['Kontakti',''] ]},
  radovi:{name:'Plan radova — voćnjak i vinograd',emoji:'🌿',mods:['tasks','checks','notes','links','img'],
    tasks:[['Zimska rezidba vinove loze','02-15'],['Rezidba voćaka','03-01'],['Prihrana / gnojenje','03-20'],['Zaštita (prskanje) — početak sezone','04-15'],['Košnja i održavanje međurednog prostora','05-15'],['Zelena rezidba i plijevljenje','06-01'],['Berba grožđa','09-15'],['Berba oraha','09-25'],['Pečenje rakije','11-01']],
    checks:[['Nabava za sezonu',['Sredstva za zaštitu','Gnojivo','Vezivo za lozu','Škare i pila (servis)']]],notes:[['Bilješke o sezoni','']]},
  biljeske:{name:'Bilješke i linkovi',emoji:'🔖',mods:['notes','links','checks','img'],tasks:[],checks:[],notes:[['Bilješke','']]},
};
function migrateProj(p){if(typeof p.notes==='string'){p.memo=p.memo||p.notes;p.notes=[];}return p;}
function projMods(p){return Array.isArray(p.mods)&&p.mods.length?p.mods:MODS_DIY;}
function catKind(id){let c=diyCat(id);while(c){if(c.kind)return c.kind;c=c.parent?diyCat(c.parent):null;}return'diy';}
function catChildren(id){return diyCats().filter(c=>c.parent===id);}
function catDesc(id){const out=[id];catChildren(id).forEach(c=>out.push(...catDesc(c.id)));return out;}
function catPath(id){const a=[];let c=diyCat(id);while(c){a.unshift(c);c=c.parent?diyCat(c.parent):null;}return a;}
function catLabel(id){return catPath(id).map(c=>c.name).join(' / ');}
const DUI={tab:{},status:lsGet('planner.diyst','active'),q:''};
function diyCats(){const s=state.diy||(state.diy={});if(!Array.isArray(s.cats)||!s.cats.length)s.cats=DIY_DEFAULT_CATS.map(([id,e,n])=>({id,emoji:e,name:n}));return s.cats;}
function diyCat(id){return diyCats().find(c=>c.id===id)||null;}
function projects(){return docsOf('diy').map(migrateProj);}
function pStats(p){
  const st=(p.steps||[]).filter(s=>(s.x||'').trim());const sd=st.filter(s=>s.d).length;
  const mat=(p.materials||[]).filter(m=>(m.n||'').trim());const md=mat.filter(m=>m.have).length;
  const cost=mat.reduce((a,m)=>a+(+m.price||0)*(m.q==null?1:+m.q||0),0);const spent=mat.filter(m=>m.have).reduce((a,m)=>a+(+m.price||0)*(m.q==null?1:+m.q||0),0);
  const tk=(p.tasks||[]).filter(x=>(x.x||'').trim());const ci=(p.checks||[]).flatMap(c=>(c.items||[]).filter(i=>i.x));
  const t0=localISO(today());
  return{steps:st.length,stepsDone:sd,mat:mat.length,matDone:md,cost,spent,imgs:(p.images||[]).length+(p.steps||[]).reduce((a,s)=>a+(s.img||[]).length,0),
    tasks:tk.length,tasksDone:tk.filter(x=>x.d).length,over:tk.filter(x=>!x.d&&x.date&&x.date<t0).length,next:tk.filter(x=>!x.d&&x.date).sort((a,b)=>a.date.localeCompare(b.date))[0]||null,
    ci:ci.length,ciDone:ci.filter(i=>i.d).length,notes:Array.isArray(p.notes)?p.notes.length:0,links:(p.links||[]).length};
}
function statusPill(s){const x=DIY_STATUS[s]||DIY_STATUS.idea;return`<span class="pill pill-${x[2]}">${x[0]} ${x[1]}</span>`;}
function projCard(p){
  const s=pStats(p);const c=diyCat(p.cat);const gen=!projMods(p).includes('steps');
  const tot=gen?s.tasks+s.ci:s.steps,dn=gen?s.tasksDone+s.ciDone:s.stepsDone;const pct=tot?Math.round(dn/tot*100):(p.status==='done'?100:0);
  const over=p.due&&p.status!=='done'&&fromInputDate(p.due)<today();
  return`<a class="pcard" href="#/diy/p/${encodeURIComponent(p.id)}">
    <div class="pcard-img" style="--h:${hueOf(p.cat||p.title)}">${p.cover?imgTag(p.cover):`<span class="remo">${esc(p.emoji||'🛠️')}</span>`}<span class="pcard-st">${statusPill(p.status)}</span></div>
    <div class="pcard-body"><small class="rcat">${c?esc(c.emoji+' '+catLabel(c.id)):''}</small><b>${esc(p.title||'Bez naslova')}</b>
      ${p.desc?`<p>${esc(p.desc.slice(0,110))}</p>`:gen&&s.next?`<p>Sljedeće: ${esc(s.next.x)} · ${esc(shortDay(fromInputDate(s.next.date)))}</p>`:''}
      <div class="pbar"><div class="bar"><i style="width:${pct}%"></i></div><small>${tot?`${dn}/${tot} ${gen?'gotovo':'koraka'}`:'—'}</small></div>
      <div class="dmeta">${s.over?`<span class="over">⚠️ ${s.over} kasni</span>`:''}${gen&&s.notes?`<span>📝 ${s.notes}</span>`:''}${gen&&s.links?`<span>🔗 ${s.links}</span>`:''}${typeof isPinned==='function'&&isPinned({t:'proj',id:p.id})?'<span>📌</span>':''}${s.mat?`<span>${icon('box')}${s.matDone}/${s.mat}</span>`:''}${s.cost?`<span>${esc(eur(s.cost))}</span>`:''}${p.due?`<span class="${over?'over':''}">${icon('calendar')}${esc(shortDay(fromInputDate(p.due)))}</span>`:''}${s.imgs?`<span>${icon('image')}${s.imgs}</span>`:''}</div></div>
  </a>`;
}
function viewDiy(r){
  if(r.id==='p'&&r.sub)return viewProject(r.sub);
  const cats=diyCats();const catId=r.id==='c'?r.sub:'';const cat=catId?diyCat(catId):null;
  const all=projects();const q=DUI.q.trim().toLowerCase();
  const inCat=catId?new Set(catDesc(catId)):null;
  let list=all.filter(p=>!catId||inCat.has(p.cat));
  const stF={active:p=>p.status!=='done'&&p.status!=='idea',idea:p=>p.status==='idea',done:p=>p.status==='done',all:()=>true};
  const base=list;
  list=list.filter(stF[DUI.status]||stF.all);
  if(q)list=list.filter(p=>[p.title,p.desc,p.specs,p.memo,JSON.stringify(p.notes||''),JSON.stringify(p.tasks||''),JSON.stringify(p.checks||''),(p.materials||[]).map(m=>m.n).join(' ')].join(' ').toLowerCase().includes(q));
  const ord={progress:0,plan:1,hold:2,idea:3,done:4};list.sort((a,b)=>(ord[a.status]??5)-(ord[b.status]??5)||(b.updated||0)-(a.updated||0));
  const cnt=k=>base.filter(stF[k]).length;
  const totalCost=base.filter(p=>p.status!=='done').reduce((a,p)=>a+pStats(p).cost-pStats(p).spent,0);
  return`
  <div class="page-head"><div><a class="crumb" href="${cat&&cat.parent?'#/diy/c/'+encodeURIComponent(cat.parent):cat?'#/diy':'#/'}">${icon('chevL')}${cat&&cat.parent?esc(catLabel(cat.parent)):cat?'DIY':'Dashboard'}</a>
    <h1>${cat?`<span class="emo">${esc(cat.emoji)}</span>${esc(cat.name)}`:'🔨 DIY projekti'}</h1>
    <p>${base.length} ${catId&&catKind(catId)==='general'?plural(base.length,'stranica','stranice','stranica'):plural(base.length,'projekt','projekta','projekata')}${totalCost>0?` · još za kupiti ≈ ${esc(eur(totalCost))}`:''}</p></div>
    <div class="head-acts">${cat?`<button class="btn btn-outline btn-sm" data-act="diyCatEdit" data-id="${esc(cat.id)}">${icon('edit')}Uredi podsekciju</button>`:''}${cat?pinBtn({t:'cat',id:cat.id}):''}<button class="btn btn-primary" data-act="diyNew" data-cat="${esc(catId)}">${icon('plus')}${catId&&catKind(catId)==='general'?'Nova stranica':'Novi projekt'}</button></div></div>
  <div class="cats">
    <a class="cat${!catId?' on':''}" href="#/diy">Sve<span class="n">${all.length}</span></a>
    ${cats.filter(c=>!c.parent).map(c=>`<a class="cat${catId===c.id||(cat&&catPath(cat.id)[0].id===c.id)?' on':''}" href="#/diy/c/${encodeURIComponent(c.id)}">${esc(c.emoji)} ${esc(c.name)}<span class="n">${all.filter(p=>catDesc(c.id).includes(p.cat)).length}</span></a>`).join('')}
    <button class="cat cat-add" data-act="diyCatEdit" data-id="" data-parent="">${icon('plus')}Podsekcija</button>
  </div>
  ${cat?`<div class="subcats">${catChildren(cat.id).map(c=>`<a class="subcat" href="#/diy/c/${encodeURIComponent(c.id)}"><span>${esc(c.emoji)}</span><b>${esc(c.name)}</b><small>${all.filter(p=>catDesc(c.id).includes(p.cat)).length} · ${catKind(c.id)==='general'?'bilješke, checkliste, linkovi':'DIY projekti'}</small></a>`).join('')}
    <button class="subcat add" data-act="diyCatEdit" data-id="" data-parent="${esc(cat.id)}">${icon('plus')}<b>Nova podsekcija u “${esc(cat.name)}”</b><small>npr. ${esc(cat.name)} / Papirologija</small></button></div>`:''}
  <div class="list-tools" style="margin-top:0">
    <div class="seg">${[['active','Aktivni'],['idea','Ideje'],['done','Završeni'],['all','Sve']].map(([k,l])=>`<button class="${DUI.status===k?'on':''}" data-act="diySt" data-v="${k}">${l} <small>${cnt(k)}</small></button>`).join('')}</div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="psearch" data-input="pSearch" value="${esc(DUI.q)}" placeholder="Pretraži projekte i materijal…"></label>
  </div>
  ${!docsLoaded&&!all.length?`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam projekte…</div>`:
  list.length?`<div class="pgrid">${list.map(projCard).join('')}</div>`:`<section class="card hero-empty"><div><span class="big">🪚</span><h2>${base.length?'Nema projekata u ovom filtru':'Još nema projekata'}</h2>
    ${catId&&catKind(catId)==='general'?`<p>Stranica ima zadatke s rokovima, checkliste, bilješke, linkove i slike — sve se može zakačiti na dashboard s prioritetom i podsjetnikom.</p>
    <div class="btn-row" style="justify-content:center">${Object.entries(GEN_TPL).map(([k,t])=>`<button class="btn btn-outline btn-sm" data-act="diyNew" data-tpl="g:${k}" data-cat="${esc(catId)}">${t.emoji} ${esc(t.name)}</button>`).join('')}</div>`:
    `<p>Projekt ima popis materijala s cijenama, alat, korake sa slikama, galeriju i linkove. Kreni od predloška.</p>
    <div class="btn-row" style="justify-content:center">${Object.entries(DIY_TPL).map(([k,t])=>`<button class="btn btn-outline btn-sm" data-act="diyNew" data-tpl="${k}" data-cat="${esc(catId)}">${t.emoji} ${esc(t.name)}</button>`).join('')}</div>`}</div></section>`}`;
}
function viewProject(id){
  const p=docById(id);if(p)migrateProj(p);if(!p||p.kind!=='diy')return docsLoaded?`<div class="card empty" style="padding:40px"><span class="big">🤷</span>Projekt nije pronađen. <a class="link-btn" href="#/diy">Natrag</a></div>`:`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam…</div>`;
  const s=pStats(p);let tab=DUI.tab[id]||'overview';if(tab!=='overview'&&!projMods(p).includes(tab)){tab='overview';}const c=diyCat(p.cat);const B=`data-bind="${esc(p.id)}"`;
  const mods=projMods(p);const gen=!mods.includes('steps')&&!mods.includes('mat');
  const cnt={mat:s.mat?`${s.matDone}/${s.mat}`:'',tools:(p.tools||[]).length||'',steps:s.steps?`${s.stepsDone}/${s.steps}`:'',tasks:s.tasks?`${s.tasksDone}/${s.tasks}`:'',checks:(p.checks||[]).length||'',notes:s.notes||'',img:(p.images||[]).length||'',links:s.links||''};
  const tabs=[['overview','Pregled',''],...Object.keys(DIY_MODS).filter(k=>mods.includes(k)).map(k=>[k==='img'?'img':k,DIY_MODS[k][1],cnt[k]])];
  if(!tabs.find(t=>t[0]===tab)&&tab!=='overview'){DUI.tab[id]='overview';}
  let body='';
  if(tab==='overview'&&gen)body=genOverview(p,s);
  else if(tab==='overview'){
    const pct=s.steps?Math.round(s.stepsDone/s.steps*100):0;
    body=`
    <div class="pov">
      <section class="card pov-hero" style="--h:${hueOf(p.cat||p.title)}">${p.cover?`<button class="rhero-img" data-act="lightbox" data-ids="${esc([p.cover,...(p.images||[]).filter(x=>x!==p.cover)].join(','))}">${imgTag(p.cover,{thumb:false})}</button>`:`<div class="rhero-ph"><span>${esc(p.emoji||'🛠️')}</span>${fileBtn('diyImg',p.id,{label:'Dodaj sliku / skicu',multiple:true,cls:'btn btn-ghost btn-sm'})}</div>`}</section>
      <div class="pov-stats">
        <button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="steps"><svg class="ring" viewBox="0 0 36 36"><circle class="bgc" cx="18" cy="18" r="15.5"/><circle class="fg" cx="18" cy="18" r="15.5" stroke-dasharray="97.4" stroke-dashoffset="${97.4*(1-pct/100)}"/></svg><div><div class="num">${pct}%</div><div class="lbl">Koraci ${s.stepsDone}/${s.steps}</div></div></button>
        <button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="mat"><div class="ico ico-warn">${icon('box')}</div><div><div class="num">${s.matDone}/${s.mat}</div><div class="lbl">Materijal nabavljen</div></div></button>
        <button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="mat"><div class="ico ico-accent">€</div><div><div class="num" id="pCost">${esc(eur(s.cost))}</div><div class="lbl">Procjena troška</div></div></button>
        <button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="img"><div class="ico ico-week">${icon('image')}</div><div><div class="num">${s.imgs}</div><div class="lbl">Slike</div></div></button>
      </div>
    </div>
    <section class="card"><div class="card-body form-stack">
      <div class="field"><label>Status</label><div class="seg seg-scroll">${Object.entries(DIY_STATUS).map(([k,v])=>`<button class="${(p.status||'idea')===k?'on':''}" data-act="diySet" data-id="${esc(p.id)}" data-k="status" data-v="${k}">${v[0]} ${v[1]}</button>`).join('')}</div></div>
      <div class="grid2">
        <div class="field"><label>Podsekcija</label><select ${B} data-path="cat">${catOptions(p.cat)}</select></div>
        <div class="field"><label>Prioritet</label><select ${B} data-path="prio"><option value="">—</option>${[['high','Visok'],['medium','Srednji'],['low','Nizak']].map(([k,l])=>`<option value="${k}" ${p.prio===k?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label>Početak</label><input type="date" ${B} data-path="start" value="${esc(p.start||'')}"></div>
        <div class="field"><label>Rok</label><input type="date" ${B} data-path="due" value="${esc(p.due||'')}"></div>
        <div class="field"><label>Budžet (€)</label><input inputmode="decimal" ${B} data-path="budget" data-type="num" value="${esc(p.budget??'')}" placeholder="npr. 300"></div>
        <div class="field"><label>Trošak materijala</label><div class="ro" id="pCost2">${esc(eur(s.cost))}${p.budget?` <small class="${s.cost>p.budget?'over':''}">/ budžet ${esc(eur(p.budget))}</small>`:''}</div></div>
      </div>
      <div class="field"><label>Opis / cilj</label><textarea class="input grow" ${B} data-path="desc" rows="3" placeholder="Što radiš i zašto, kako bi trebalo izgledati…">${esc(p.desc||'')}</textarea></div>
      <div class="field"><label>${icon('ruler')} Mjere i specifikacije</label><textarea class="input grow mono" ${B} data-path="specs" rows="4" placeholder="Otvor: 82 × 205 cm&#10;Debljina krila: 4 cm&#10;Drvo: smreka, sušena">${esc(p.specs||'')}</textarea></div>
      <div class="field"><label>Bilješke</label><textarea class="input grow" ${B} data-path="memo" rows="3" placeholder="Ideje, upozorenja, kontakti majstora…">${esc(p.memo||'')}</textarea></div>
    </div></section>`;
  }
  if(tab==='tasks')body=tasksTab(p);
  if(tab==='checks')body=checksTab(p);
  if(tab==='notes')body=notesTab(p);
  if(tab==='mat'){
    const mats=p.materials||[];
    body=`<section class="card"><div class="card-head"><h2>${icon('box')} Popis materijala</h2><span class="spacer"></span>
      <div class="mat-tot" id="matTot">${matTotHTML(p)}</div></div>
      <div class="card-body">
        <div class="mat-head"><span></span><span></span><span>Naziv</span><span>Kol.</span><span>Jed.</span><span>Cijena/jed. €</span><span>Ukupno</span><span>Trgovina / link</span><span></span></div>
        <div class="mat-list" id="matList" data-p="${esc(p.id)}">${mats.map(m=>`<div class="mat-row${m.have?' have':''}" data-id="${esc(m.id)}">
          <span class="grip">${icon('grip')}</span>
          <label class="cbx-l"><input type="checkbox" ${B} data-path="materials.${esc(m.id)}.have" ${m.have?'checked':''}><span class="check">${icon('check')}</span></label>
          <input class="input mi-n" ${B} data-path="materials.${esc(m.id)}.n" value="${esc(m.n||'')}" placeholder="Naziv">
          <input class="input mi-q" inputmode="decimal" ${B} data-type="num" data-path="materials.${esc(m.id)}.q" value="${esc(m.q==null?'':String(m.q).replace('.',','))}" placeholder="1">
          <input class="input mi-u" ${B} data-path="materials.${esc(m.id)}.u" value="${esc(m.u||'')}" placeholder="kom" list="units">
          <input class="input mi-p" inputmode="decimal" ${B} data-type="num" data-path="materials.${esc(m.id)}.price" value="${esc(m.price==null?'':String(m.price).replace('.',','))}" placeholder="0,00">
          <span class="mi-t" data-tot="${esc(m.id)}">${m.price?esc(eur((+m.price)*(m.q==null?1:+m.q||0))):''}</span>
          <span class="mi-s"><input class="input" ${B} data-path="materials.${esc(m.id)}.shop" value="${esc(m.shop||'')}" placeholder="Bauhaus / link">${/^https?:|www\./i.test(m.shop||'')?`<a class="ibtn" href="${esc(safeUrl(m.shop))}" target="_blank" rel="noopener" title="Otvori">${icon('ext')}</a>`:''}</span>
          <button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="materials" data-row="${esc(m.id)}" aria-label="Ukloni">${icon('x')}</button>
        </div>`).join('')}</div>
        <datalist id="units">${['kom','m','m²','m³','kg','l','pak','rola','vreća','set','par'].map(u=>`<option value="${u}">`).join('')}</datalist>
        <div class="add-row"><input class="input" id="matAdd" data-enter="diyMatAdd" data-id="${esc(p.id)}" placeholder="Dodaj materijal… npr. “4 kom grede 10×10 cm 12,50 €” (zalijepi cijeli popis za više stavki)" autocomplete="off"><button class="btn btn-primary" data-act="diyMatAdd" data-id="${esc(p.id)}">${icon('plus')}<span>Dodaj</span></button></div>
        <div class="btn-row"><button class="btn btn-ghost btn-sm" data-act="diyShop" data-id="${esc(p.id)}">${icon('cart')}Nenabavljeno → popis za kupnju</button>
          <button class="btn btn-ghost btn-sm" data-act="diyMatCopy" data-id="${esc(p.id)}">${icon('copy')}Kopiraj popis</button>
          <button class="btn btn-ghost btn-sm" data-act="diyMatHp" data-id="${esc(p.id)}">${icon('flame')}Nenabavljeno → Hitno</button></div>
      </div></section>`;
  }
  if(tab==='tools'){
    const tl=p.tools||[];
    body=`<section class="card"><div class="card-head"><h2>${icon('hammer')} Potreban alat</h2><span class="spacer"></span><small style="color:var(--text-3);font-weight:700">${tl.filter(t=>t.have).length}/${tl.length} spremno</small></div>
      <div class="card-body"><div class="tool-list" id="toolList" data-p="${esc(p.id)}">${tl.map(t=>`<div class="tool-row${t.have?' have':''}" data-id="${esc(t.id)}"><span class="grip">${icon('grip')}</span>
        <label class="cbx-l"><input type="checkbox" ${B} data-path="tools.${esc(t.id)}.have" ${t.have?'checked':''}><span class="check">${icon('check')}</span></label>
        <input class="input" ${B} data-path="tools.${esc(t.id)}.n" value="${esc(t.n||'')}" placeholder="Alat">
        <input class="input tool-note" ${B} data-path="tools.${esc(t.id)}.note" value="${esc(t.note||'')}" placeholder="napomena (posuditi od…)">
        <button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="tools" data-row="${esc(t.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')}</div>
        <div class="add-row"><input class="input" id="toolAdd" data-enter="diyToolAdd" data-id="${esc(p.id)}" placeholder="Dodaj alat… (više redaka = više stavki)" autocomplete="off"><button class="btn btn-primary" data-act="diyToolAdd" data-id="${esc(p.id)}">${icon('plus')}<span>Dodaj</span></button></div>
      </div></section>`;
  }
  if(tab==='steps'){
    const st=p.steps||[];
    body=`<section class="card"><div class="card-head"><h2>${icon('checklist')} Koraci</h2><span class="spacer"></span>
      ${s.steps?`<div class="note-prog"><div class="bar"><i style="width:${Math.round(s.stepsDone/s.steps*100)}%"></i></div><b>${s.stepsDone}/${s.steps}</b></div>`:''}</div>
      <div class="card-body"><ol class="psteps" id="stepList" data-p="${esc(p.id)}">${st.map((x,i)=>`<li class="pstep${x.d?' done':''}" data-id="${esc(x.id)}">
        <span class="grip">${icon('grip')}</span>
        <label class="cbx-l"><input type="checkbox" ${B} data-path="steps.${esc(x.id)}.d" ${x.d?'checked':''}><span class="check">${icon('check')}</span></label>
        <div class="pstep-main"><div class="pstep-n">Korak ${i+1}</div>
          <textarea class="input grow" rows="1" ${B} data-path="steps.${esc(x.id)}.x" placeholder="Opis koraka…">${esc(x.x||'')}</textarea>
          <div class="pstep-imgs" data-drop="diyStepImg" data-id="${esc(p.id)}" data-step="${esc(x.id)}">${(x.img||[]).map((im,j)=>`<span class="psi"><button data-act="lightbox" data-ids="${esc(x.img.join(','))}" data-i="${j}">${imgTag(im)}</button><button class="psi-x" data-act="diyStepImgDel" data-id="${esc(p.id)}" data-step="${esc(x.id)}" data-img="${esc(im)}" aria-label="Obriši sliku">${icon('x')}</button></span>`).join('')}
            <label class="psi-add" title="Dodaj sliku koraku">${icon('image')}<input type="file" accept="image/*" multiple data-file="diyStepImg" data-id="${esc(p.id)}" data-step="${esc(x.id)}" hidden></label></div>
        </div>
        <button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="steps" data-row="${esc(x.id)}" aria-label="Ukloni korak">${icon('x')}</button></li>`).join('')}</ol>
        <div class="add-row"><textarea class="input" id="stepAdd" rows="1" data-id="${esc(p.id)}" placeholder="Novi korak… (Enter dodaje, Shift+Enter novi red; zalijepljeni popis = više koraka)"></textarea><button class="btn btn-primary" data-act="diyStepAdd" data-id="${esc(p.id)}">${icon('plus')}<span>Dodaj</span></button></div>
      </div></section>`;
  }
  if(tab==='img'){
    body=`<section class="card"><div class="card-head"><h2>${icon('image')} Slike, skice i nacrti</h2><span class="spacer"></span><small style="color:var(--text-3)">★ = naslovna</small></div>
      <div class="card-body">${galleryHTML(p.images||[],{act:'diyImg',id:p.id,cover:p.cover})}
      ${(p.steps||[]).some(x=>(x.img||[]).length)?`<h3 class="sub-h">Slike iz koraka</h3><div class="gallery">${(p.steps||[]).flatMap((x,i)=>(x.img||[]).map(im=>`<div class="gal-item"><button class="gal-open" data-act="lightbox" data-ids="${esc(im)}">${imgTag(im)}</button><span class="gal-cap">Korak ${i+1}</span></div>`)).join('')}</div>`:''}</div></section>`;
  }
  if(tab==='links'){
    const ls=p.links||[];
    body=`<section class="card"><div class="card-head"><h2>${icon('link')} Linkovi</h2><small style="color:var(--text-3)">upute, videi, proizvodi, nacrti</small></div>
      <div class="card-body"><div class="plinks">${ls.map(l=>`<div class="plink" data-id="${esc(l.id)}">
        <div class="fav"><img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(tryDomain(safeUrl(l.u)))}&sz=64" alt="" loading="lazy" data-fav></div>
        <div class="plink-in"><input class="input" ${B} data-path="links.${esc(l.id)}.t" value="${esc(l.t||'')}" placeholder="Naziv"><input class="input mono" ${B} data-path="links.${esc(l.id)}.u" value="${esc(l.u||'')}" placeholder="https://…"></div>
        <a class="btn btn-ghost btn-sm" href="${esc(safeUrl(l.u))}" target="_blank" rel="noopener">Otvori ${icon('ext')}</a>
        <button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="links" data-row="${esc(l.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')||'<div class="empty">Još nema linkova.</div>'}</div>
        <div class="add-row"><input class="input" id="linkAdd" type="url" data-enter="diyLinkAdd" data-id="${esc(p.id)}" placeholder="Zalijepi link (YouTube, upute, proizvod…)" autocomplete="off"><input class="input" id="linkAddT" data-enter="diyLinkAdd" data-id="${esc(p.id)}" placeholder="Naziv (opcionalno)" style="max-width:220px"><button class="btn btn-primary" data-act="diyLinkAdd" data-id="${esc(p.id)}">${icon('plus')}<span>Dodaj</span></button></div>
      </div></section>`;
  }
  return`
  <div class="page-head"><div style="min-width:0;flex:1"><a class="crumb" href="${c?'#/diy/c/'+encodeURIComponent(c.id):'#/diy'}">${icon('chevL')}${c?esc(c.emoji+' '+catLabel(c.id)):'DIY'}</a>
    <div class="ptitle"><input class="emo-in" ${B} data-path="emoji" value="${esc(p.emoji||'')}" maxlength="4" placeholder="🛠️" aria-label="Ikona"><input class="note-title" ${B} data-path="title" value="${esc(p.title||'')}" placeholder="Naziv projekta" aria-label="Naziv projekta"></div>
    <div class="mini-stats">${statusPill(p.status)}${p.due?`<span class="pill">${icon('calendar')} rok ${esc(shortDay(fromInputDate(p.due)))}</span>`:''}${p.prio?`<span class="pill chip-prio-${esc(p.prio)}">${{high:'Visok',medium:'Srednji',low:'Nizak'}[p.prio]} prioritet</span>`:''}</div></div>
    <div class="head-acts">${pinBtn({t:'proj',id:p.id})}<button class="ibtn big" data-act="diyMenu" data-id="${esc(p.id)}" title="Opcije">${icon('more')}</button></div></div>
  <div class="ptabs-row"><div class="ptabs seg seg-scroll">${tabs.map(([k,l,n])=>`<button class="${(DUI.tab[id]||'overview')===k?'on':''}" data-act="diyTab" data-id="${esc(p.id)}" data-v="${k}">${l}${n!==''?` <small>${n}</small>`:''}</button>`).join('')}</div>
    <button class="btn btn-ghost btn-sm" data-act="diyMods" data-id="${esc(p.id)}" title="Odaberi koje kartice projekt ima">${icon('gear')}Kartice</button></div>
  ${body}`;
}
function matTotHTML(p){const s=pStats(p);return`<span>Ukupno <b>${esc(eur(s.cost))}</b></span><span class="ok">Nabavljeno <b>${esc(eur(s.spent))}</b></span><span class="warn">Preostalo <b>${esc(eur(s.cost-s.spent))}</b></span>`;}
BIND_HOOKS.diy=(p,path,el,isChange)=>{
  if(/^materials\./.test(path)){const t=$('#matTot');if(t)t.innerHTML=matTotHTML(p);const id=path.split('.')[1];const m=(p.materials||[]).find(x=>x.id===id);const c=$(`[data-tot="${CSS.escape(id)}"]`);if(c&&m)c.textContent=m.price?eur((+m.price)*(m.q==null?1:+m.q||0)):'';}
  if(isChange&&(/\.(have|d|date)$/.test(path)||['cat','prio','start','due','status'].includes(path)))renderAll();
  if(path==='title'||path==='emoji'){const nav=$(`#sidebar a[href="#/diy/p/${CSS.escape(p.id)}"] .nav-txt`);if(nav)nav.textContent=p.title;}
};
function parseMatLine(l){
  let price=null;const pm=l.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur|kn)(?=\s|$)/i);if(pm){price=parseNum(pm[1]);l=l.replace(pm[0],'').trim();}
  const it=parseIngLine(l);if(!it||it.t==='h')return it?{id:uid('m'),n:it.n,q:null,u:'',price:null,have:false}:null;
  return{id:uid('m'),n:it.n||l,q:it.q,u:it.u||'',price,have:false};
}
function projToText(p){const s=pStats(p);return[`${p.emoji||'🛠️'} ${p.title}`,DIY_STATUS[p.status||'idea'][1],p.desc||'',p.specs?'\nMJERE\n'+p.specs:'',
  (p.materials||[]).length?'\nMATERIJAL'+(s.cost?` (≈ ${eur(s.cost)})`:''):'',...(p.materials||[]).map(m=>`${m.have?'☑':'☐'} ${m.q!=null?fmtNum(m.q,m.u)+' '+(m.u||''):''} ${m.n}${m.price?' — '+eur(m.price*(m.q==null?1:m.q)):''}`.replace(/\s+/g,' ')),
  (p.tools||[]).length?'\nALAT':'',...(p.tools||[]).map(t=>`${t.have?'☑':'☐'} ${t.n}`),
  (p.steps||[]).length?'\nKORACI':'',...(p.steps||[]).map((x,i)=>`${x.d?'☑':'☐'} ${i+1}. ${x.x}`),
  (p.tasks||[]).length?'\nZADACI':'',...(p.tasks||[]).map(x=>`${x.d?'☑':'☐'} ${x.x}${x.date?' — '+x.date:''}`),
  ...(p.checks||[]).flatMap(c=>['\n'+(c.title||'CHECKLISTA').toUpperCase(),...(c.items||[]).map(i=>`${i.d?'☑':'☐'} ${i.x}`)]),
  (p.links||[]).length?'\nLINKOVI':'',...(p.links||[]).map(l=>`${l.t?l.t+': ':''}${l.u}`)].filter(x=>x!=='').join('\n').trim();}
function catOptions(sel,{exclude}={}){
  const out=[];const walk=(par,depth)=>diyCats().filter(c=>(c.parent||'')===(par||'')).forEach(c=>{if(exclude&&catDesc(exclude).includes(c.id))return;out.push(`<option value="${esc(c.id)}" ${sel===c.id?'selected':''}>${'— '.repeat(depth)}${esc(c.emoji+' '+c.name)}</option>`);walk(c.id,depth+1);});
  walk('',0);return out.join('');
}
function newProject(tpl='blank',cat=''){
  const cats=diyCats();
  if(!cat||!diyCat(cat))cat=cats[0].id;
  let p;
  if(String(tpl).startsWith('g:')){
    const T=GEN_TPL[tpl.slice(2)]||GEN_TPL.page;const y=today().getFullYear();
    p={id:uid('p'),kind:'diy',title:T===GEN_TPL.page?'':T.name,emoji:T.emoji,cat,status:'progress',images:[],cover:'',desc:'',mods:[...T.mods],links:[],
      tasks:T.tasks.map(x=>{const[n,md]=Array.isArray(x)?x:[x,''];let date='';if(md){date=`${y}-${md}`;if(date<localISO(today()))date=`${y+1}-${md}`;}return{id:uid('tk'),x:n,d:false,date,note:''};}),
      checks:T.checks.map(([t,items])=>({id:uid('cl'),title:t,items:items.map(x=>({id:uid('ci'),x,d:false}))})),
      notes:T.notes.map(([t,b])=>({id:uid('nt'),title:t,body:b,date:localISO(today())}))};
  }else{
    const T=DIY_TPL[tpl]||DIY_TPL.blank;
    p={id:uid('p'),kind:'diy',title:tpl==='blank'?'':T.name,emoji:T.emoji,cat:cat||T.cat,status:'plan',images:[],cover:'',desc:'',specs:'',notes:[],mods:[...MODS_DIY],
      materials:T.mat.map(parseMatLine).filter(Boolean),tools:T.tools.map(n=>({id:uid('t'),n,have:false})),steps:T.steps.map(x=>({id:uid('s'),x,d:false,img:[]})),links:[]};
  }
  putDoc(p,{now:true});DUI.tab[p.id]=String(tpl).startsWith('g:')&&p.tasks.length?'tasks':'overview';go('#/diy/p/'+p.id);
  setTimeout(()=>{const t=$('.ptitle .note-title');if(t&&!t.value){t.focus();}},120);
}
function openDiyNew(cat){
  let kind=cat?catKind(cat):'diy';
  const paint=el=>{$('#dnKind',el).innerHTML=`<button class="${kind==='diy'?'on':''}" data-k="diy">🔨 DIY projekt</button><button class="${kind==='general'?'on':''}" data-k="general">📄 Bilješke · checkliste · rokovi · linkovi</button>`;
    $('#dnTpl',el).innerHTML=kind==='diy'?Object.entries(DIY_TPL).map(([k,t])=>`<button class="choice" data-tpl="${k}"><div class="ico" style="background:var(--surface-2);font-size:1.3rem">${t.emoji}</div><div><b>${esc(t.name)}</b><small>${t.steps.length?`${t.steps.length} koraka · ${t.mat.length} materijala`:'materijal, alat, koraci, slike'}</small></div></button>`).join('')
      :Object.entries(GEN_TPL).map(([k,t])=>`<button class="choice" data-tpl="g:${k}"><div class="ico" style="background:var(--surface-2);font-size:1.3rem">${t.emoji}</div><div><b>${esc(t.name)}</b><small>${t.mods.map(m=>DIY_MODS[m][1]).join(' · ')}</small></div></button>`).join('');
    $$('#dnKind button',el).forEach(b=>b.onclick=()=>{kind=b.dataset.k;paint(el);});
    $$('[data-tpl]',el).forEach(b=>b.onclick=()=>{const c=$('#dn_cat',el).value;closeSheet();newProject(b.dataset.tpl,c);});};
  openSheet({title:'Novo',body:`<div class="field"><label>Vrsta</label><div class="seg seg-scroll" id="dnKind"></div></div>
    <div class="field"><label for="dn_cat">Podsekcija</label><select id="dn_cat">${catOptions(cat||diyCats()[0].id)}</select></div>
    <div class="choices" id="dnTpl"></div><p class="hint">Kartice (materijal, zadaci, checkliste, bilješke…) možeš kasnije uključiti/isključiti gumbom ⚙ Kartice.</p>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet}],onOpen:el=>{paint(el);$('#dn_cat',el).addEventListener('change',e=>{kind=catKind(e.target.value);paint(el);});}});
}
function openDiyCatEditor(id,parent){
  const c=id?diyCat(id):null;const par=c?c.parent||'':parent||'';const kind=c?c.kind||'':(par?'':'diy');
  openSheet({title:c?'Uredi podsekciju':'Nova podsekcija',body:`<div class="grid2" style="grid-template-columns:90px 1fr">
    <div class="field"><label for="dc_emo">Ikona</label><input id="dc_emo" value="${esc(c?c.emoji:'')}" maxlength="4" placeholder="🪵" style="text-align:center;font-size:1.3rem"></div>
    <div class="field"><label for="dc_name">Naziv</label><input id="dc_name" value="${esc(c?c.name:'')}" maxlength="40" placeholder="npr. Papirologija, Plan radova, Auto…"></div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap" id="dcPick">${['🪚','🪵','🏠','🌱','⚡','🔧','🌳','🚗','🧱','🎨','🔌','🚿','📑','🌿','🍇','🐔','🥃','🚜'].map(e=>`<button class="ibtn" style="font-size:1.2rem;background:var(--surface-2)" data-e="${e}">${e}</button>`).join('')}</div>
    <div class="field"><label for="dc_par">Nalazi se u</label><select id="dc_par"><option value="">— glavna sekcija —</option>${catOptions(par,{exclude:c?c.id:null})}</select></div>
    <div class="field"><label for="dc_kind">Vrsta sadržaja</label><select id="dc_kind"><option value="" ${!kind?'selected':''}>Kao nadređena sekcija</option><option value="diy" ${kind==='diy'?'selected':''}>🔨 DIY projekti (materijal, alat, koraci)</option><option value="general" ${kind==='general'?'selected':''}>📄 Bilješke, checkliste, rokovi, linkovi</option></select></div>`,
    actions:[...(c?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>{const cats=diyCats();if(cats.filter(x=>!x.parent).length<2&&!c.parent){toast('Mora ostati barem jedna sekcija');return;}
        const to=c.parent||cats.find(x=>x.id!==c.id&&!x.parent).id;const n=projects().filter(p=>catDesc(c.id).includes(p.cat)).length;
        confirmSheet(`Obrisati “${c.name}”?${n?` ${n} stavki premjestit će se u “${diyCat(to).name}”.`:''}`,()=>{const del=catDesc(c.id);projects().filter(p=>del.includes(p.cat)).forEach(p=>{p.cat=to;putDoc(p);});state.diy.cats=cats.filter(x=>!del.includes(x.id));saveData();go('#/diy/c/'+to);});}}]:[]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(c?'Spremi':'Kreiraj'),cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');const name=$('#dc_name',el).value.trim();if(!name){$('#dc_name',el).focus();return;}
        const o={name,emoji:$('#dc_emo',el).value.trim()||'📁',parent:$('#dc_par',el).value||undefined,kind:$('#dc_kind',el).value||undefined};
        if(c){Object.assign(c,o);if(!o.parent)delete c.parent;if(!o.kind)delete c.kind;closeSheet();saveData();renderAll();}
        else{const nid='dc'+Date.now().toString(36);const nc={id:nid,...o};if(!nc.parent)delete nc.parent;if(!nc.kind)delete nc.kind;diyCats().push(nc);closeSheet();saveData();go('#/diy/c/'+nid);}}}],
    onOpen:el=>{$$('#dcPick button',el).forEach(b=>b.addEventListener('click',()=>{$('#dc_emo',el).value=b.dataset.e;}));$('#dc_name',el).focus();}});
}
/* ───────── Pregled za stranice (OPG i sl.) ───────── */
function genOverview(p,s){
  const B=`data-bind="${esc(p.id)}"`;const t0=localISO(today());
  const up=(p.tasks||[]).filter(x=>!x.d&&(x.x||'').trim()).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')).slice(0,6);
  return`<div class="gen-ov">
    <section class="card"><div class="card-head"><h2>🗓️ Sljedeće</h2><span class="spacer"></span><button class="link-btn" data-act="diyTab" data-id="${esc(p.id)}" data-v="tasks">Svi zadaci ${icon('arrowR')}</button></div>
      <div class="card-body">${up.length?up.map(x=>`<div class="gtask${x.date&&x.date<t0?' over':''}"><span>${esc(x.x)}</span><small>${x.date?esc(shortDay(fromInputDate(x.date))):'bez roka'}</small></div>`).join(''):'<div class="empty">Nema otvorenih zadataka.</div>'}</div></section>
    <div class="pov-stats">
      ${projMods(p).includes('tasks')?`<button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="tasks"><div class="ico ico-week">🗓️</div><div><div class="num">${s.tasksDone}/${s.tasks}</div><div class="lbl">Zadaci${s.over?` · ${s.over} kasni`:''}</div></div></button>`:''}
      ${projMods(p).includes('checks')?`<button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="checks"><div class="ico ico-ok">☑️</div><div><div class="num">${s.ciDone}/${s.ci}</div><div class="lbl">Checkliste (${(p.checks||[]).length})</div></div></button>`:''}
      ${projMods(p).includes('notes')?`<button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="notes"><div class="ico ico-warn">📝</div><div><div class="num">${s.notes}</div><div class="lbl">Bilješke</div></div></button>`:''}
      ${projMods(p).includes('links')?`<button class="stat" data-act="diyTab" data-id="${esc(p.id)}" data-v="links"><div class="ico ico-accent">🔗</div><div><div class="num">${s.links}</div><div class="lbl">Linkovi</div></div></button>`:''}
    </div></div>
  <section class="card"><div class="card-body form-stack">
    <div class="grid2">
      <div class="field"><label>Podsekcija</label><select ${B} data-path="cat">${catOptions(p.cat)}</select></div>
      <div class="field"><label>Status</label><select ${B} data-path="status">${Object.entries(DIY_STATUS).map(([k,v])=>`<option value="${k}" ${(p.status||'idea')===k?'selected':''}>${v[0]} ${v[1]}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Opis</label><textarea class="input grow" ${B} data-path="desc" rows="3" placeholder="Čemu služi ova stranica…">${esc(p.desc||'')}</textarea></div>
  </div></section>`;
}
/* ───────── Zadaci i rokovi ───────── */
function tasksTab(p){
  const B=`data-bind="${esc(p.id)}"`;const t0=localISO(today());const list=p.tasks||[];
  const open=list.filter(x=>!x.d).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));const done=list.filter(x=>x.d);
  const row=x=>`<div class="tk-row${x.d?' have':''}${!x.d&&x.date&&x.date<t0?' over':''}" data-id="${esc(x.id)}">
    <label class="cbx-l"><input type="checkbox" ${B} data-path="tasks.${esc(x.id)}.d" ${x.d?'checked':''}><span class="check">${icon('check')}</span></label>
    <div class="tk-main"><input class="input tk-x" ${B} data-path="tasks.${esc(x.id)}.x" value="${esc(x.x||'')}" placeholder="Zadatak">
      <input class="input tk-note" ${B} data-path="tasks.${esc(x.id)}.note" value="${esc(x.note||'')}" placeholder="napomena / link"></div>
    <input type="date" class="input tk-d" ${B} data-path="tasks.${esc(x.id)}.date" value="${esc(x.date||'')}">
    ${pinBtn({t:'ptask',pid:p.id,id:x.id},{cls:'ibtn'})}
    <button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="tasks" data-row="${esc(x.id)}" aria-label="Ukloni">${icon('x')}</button></div>`;
  return`<section class="card"><div class="card-head"><h2>🗓️ Zadaci i rokovi</h2><span class="spacer"></span><small style="color:var(--text-3);font-weight:800">${done.length}/${list.length}</small></div>
    <div class="card-body"><div class="tk-list">${open.map(row).join('')||'<div class="empty">Nema otvorenih zadataka.</div>'}</div>
      <div class="add-row"><input class="input" id="tkAdd" data-enter="diyTaskAdd" data-id="${esc(p.id)}" placeholder="Novi zadatak… (zalijepljeni popis = više zadataka)"><input type="date" class="input" id="tkAddD" style="max-width:170px"><button class="btn btn-primary" data-act="diyTaskAdd" data-id="${esc(p.id)}">${icon('plus')}<span>Dodaj</span></button></div>
      <p class="hint">📌 pokraj zadatka stavlja ga na dashboard listu s prioritetom i podsjetnikom.</p>
      ${done.length?`<details class="done-box"><summary>Gotovo (${done.length})</summary><div class="tk-list">${done.map(row).join('')}</div></details>`:''}</div></section>`;
}
/* ───────── Checkliste ───────── */
function checksTab(p){
  const B=`data-bind="${esc(p.id)}"`;const cls=p.checks||[];
  return`<div class="cl-grid">${cls.map(cl=>{const it=cl.items||[];const d=it.filter(i=>i.d).length;
    return`<section class="card cl-card"><div class="card-head"><input class="pack-g" ${B} data-path="checks.${esc(cl.id)}.title" value="${esc(cl.title||'')}" placeholder="Naziv checkliste"><span class="spacer"></span><small style="color:var(--text-3);font-weight:800">${d}/${it.length}</small>
      ${pinBtn({t:'pcl',pid:p.id,id:cl.id},{cls:'ibtn'})}<button class="ibtn" data-act="clMenu" data-id="${esc(p.id)}" data-cl="${esc(cl.id)}" aria-label="Opcije">${icon('more')}</button></div>
      <div class="card-body"><ul class="pack cl-items" data-p="${esc(p.id)}" data-cl="${esc(cl.id)}">${it.map(i=>`<li class="${i.d?'done':''}" data-id="${esc(i.id)}"><span class="grip">${icon('grip')}</span><label class="cbx-l"><input type="checkbox" ${B} data-path="checks.${esc(cl.id)}.items.${esc(i.id)}.d" ${i.d?'checked':''}><span class="check">${icon('check')}</span></label>
        <input class="input cl-x" ${B} data-path="checks.${esc(cl.id)}.items.${esc(i.id)}.x" value="${esc(i.x)}"><button class="ibtn" data-act="clItemDel" data-id="${esc(p.id)}" data-cl="${esc(cl.id)}" data-i="${esc(i.id)}" aria-label="Ukloni">${icon('x')}</button></li>`).join('')}</ul>
      <div class="add-row"><input class="input cl-in" data-enter="clAdd" data-id="${esc(p.id)}" data-cl="${esc(cl.id)}" placeholder="Dodaj… (zarez = više)"></div></div></section>`;}).join('')}
    <section class="card"><div class="card-body"><div class="add-row" style="margin:0"><input class="input" id="clNew" data-enter="clNew" data-id="${esc(p.id)}" placeholder="Nova checklista — npr. Dokumenti za potporu"><button class="btn btn-primary" data-act="clNew" data-id="${esc(p.id)}">${icon('plus')}</button></div></div></section></div>`;
}
/* ───────── Bilješke ───────── */
function notesTab(p){
  const B=`data-bind="${esc(p.id)}"`;const ns=Array.isArray(p.notes)?p.notes:[];
  return`<div class="nt-list">${ns.map(n=>`<section class="card"><div class="card-head"><input class="pack-g" ${B} data-path="notes.${esc(n.id)}.title" value="${esc(n.title||'')}" placeholder="Naslov"><span class="spacer"></span>
      <input type="date" class="input sel-sm" ${B} data-path="notes.${esc(n.id)}.date" value="${esc(n.date||'')}"><button class="ibtn ibtn-danger" data-act="diyRowDel" data-id="${esc(p.id)}" data-list="notes" data-row="${esc(n.id)}" aria-label="Obriši">${icon('trash')}</button></div>
    <div class="card-body"><textarea class="input grow" ${B} data-path="notes.${esc(n.id)}.body" rows="4" placeholder="Piši… (linkovi su klikabilni u pregledu ispod)">${esc(n.body||'')}</textarea>
      ${/https?:\/\//.test(n.body||'')?`<div class="nt-links">${linkify((n.body||'').match(/https?:\/\/\S+/g).join('  '))}</div>`:''}</div></section>`).join('')}
    <button class="tadd" data-act="ntNew" data-id="${esc(p.id)}">＋ Nova bilješka</button></div>`;
}
function openDiyMods(id){
  const p=docById(id);if(!p)return;const cur=projMods(p);
  openSheet({title:'Kartice projekta',side:true,body:`<p class="hint" style="margin:0 0 6px">Odaberi što ovaj projekt / stranica prikazuje. Podaci se ne brišu kad isključiš karticu.</p>
    <div class="mods">${Object.entries(DIY_MODS).map(([k,[e,l]])=>`<label class="switch mod"><input type="checkbox" value="${k}" ${cur.includes(k)?'checked':''}><span class="track"></span>${e} ${l}</label>`).join('')}</div>
    <div class="btn-row"><button class="fchip" data-pre="diy">🔨 DIY set</button><button class="fchip" data-pre="gen">📄 Bilješke/OPG set</button></div>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('check')+'Spremi',cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');p.mods=$$('.mods input:checked',el).map(x=>x.value);if(!p.mods.length)p.mods=['notes'];
      if(p.mods.includes('notes')&&!Array.isArray(p.notes)){p.notes=[];}
      putDoc(p);closeSheet();renderAll();}}],
    onOpen:el=>$$('[data-pre]',el).forEach(b=>b.addEventListener('click',()=>{const set=b.dataset.pre==='diy'?MODS_DIY:MODS_GEN;$$('.mods input',el).forEach(x=>x.checked=set.includes(x.value));}))});
}
function openDiyMenu(id){
  const p=docById(id);if(!p)return;const s=pStats(p);
  openSheet({title:esc(p.title||'Projekt'),side:true,body:`<div class="sheet-list">
    <button class="row" data-pm="todo">${icon('pin')}Dodaj na To Do${p.due?' (na dan roka)':' (danas)'}</button>
    <button class="row" data-pm="note">${icon('note')}Izvezi u bilješku (checklista)</button>
    <button class="row" data-pm="copy">${icon('copy')}Kopiraj kao tekst</button>
    <button class="row" data-pm="dup">${icon('layers')}Dupliciraj (kao predložak)</button>
    <button class="row" data-pm="del" style="color:var(--urgent)">${icon('trash')}Obriši projekt</button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-pm]',el).forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.pm;closeSheet();
      if(a==='copy')copyText(projToText(p));
      if(a==='todo'){const d=p.due?fromInputDate(p.due):today();placeOnDate(d,`${p.emoji||'🛠️'} ${p.title}`,{note:location.origin+location.pathname+'#/diy/p/'+p.id});saveData();toast('Dodano: '+shortDay(d),{label:'Prikaži',fn:()=>go('#/')});}
      if(a==='note'){const n={id:uid('n'),title:`${p.emoji||'🛠️'} ${p.title}`,created:Date.now(),updated:Date.now(),hideDone:false,blocks:[]};
        if(p.desc)n.blocks.push({id:uid('b'),t:'p',x:p.desc,d:false});
        if((p.materials||[]).length){n.blocks.push({id:uid('b'),t:'h',x:'Materijal',d:false});p.materials.forEach(m=>n.blocks.push({id:uid('b'),t:'c',x:`${m.q!=null?fmtNum(m.q,m.u)+' '+(m.u||'')+' ':''}${m.n}`.trim(),d:!!m.have}));}
        if((p.steps||[]).length){n.blocks.push({id:uid('b'),t:'h',x:'Koraci',d:false});p.steps.forEach(x=>n.blocks.push({id:uid('b'),t:'c',x:x.x,d:!!x.d}));}
        if(!n.blocks.length)n.blocks.push({id:uid('b'),t:'p',x:'',d:false});state.notes.push(n);saveData();go('#/note/'+n.id);}
      if(a==='dup'){const c=JSON.parse(JSON.stringify(p));c.id=uid('p');c.title=(p.title||'Projekt')+' (kopija)';c.status='plan';c.created=0;c.images=[];c.cover='';
        (c.materials||[]).forEach(m=>{m.id=uid('m');m.have=false;});(c.tools||[]).forEach(t=>t.id=uid('t'));(c.steps||[]).forEach(x=>{x.id=uid('s');x.d=false;x.img=[];});(c.links||[]).forEach(l=>l.id=uid('l'));putDoc(c,{now:true});go('#/diy/p/'+c.id);toast('Kopija napravljena (bez slika)');}
      if(a==='del')confirmSheet(`Obrisati projekt “${p.title}”${s.imgs?` i ${s.imgs} slika`:''}?`,()=>{delDoc(p.id);go(p.cat?'#/diy/c/'+p.cat:'#/diy');
        toast('Projekt obrisan',{label:'Poništi',fn:()=>{putDoc(p,{now:true});go('#/diy/p/'+p.id);}});
        setTimeout(()=>{if(!docById(p.id))[...(p.images||[]),...(p.steps||[]).flatMap(x=>x.img||[])].forEach(imgDelete);},7000);});
    }))});
}
function diyAddMany(p,list,lines,mk){const rows=lines.map(mk).filter(Boolean);if(!rows.length)return 0;p[list]=[...(p[list]||[]),...rows];putDoc(p);return rows.length;}
function splitLines(v){return String(v||'').split(/\r?\n/).map(x=>x.replace(/^\s*(?:[-*•☐☑]|\[\s?[xX ]?\]|\d+\s*[.)])\s*/,'').trim()).filter(Boolean);}
Object.assign(ACT,{
  diyMods:el=>openDiyMods(el.dataset.id),
  diyTaskAdd:el=>{const p=docById(el.dataset.id);const inp=$('#tkAdd');if(!p||!inp.value.trim())return inp&&inp.focus();const date=$('#tkAddD').value;
    p.tasks=[...(p.tasks||[]),...splitLines(inp.value).map(x=>({id:uid('tk'),x,d:false,date,note:''}))];putDoc(p);renderAll();const n=$('#tkAdd');n&&n.focus();},
  clNew:el=>{const p=docById(el.dataset.id);const inp=$('#clNew');if(!p||!inp.value.trim())return inp&&inp.focus();p.checks=[...(p.checks||[]),{id:uid('cl'),title:inp.value.trim(),items:[]}];putDoc(p);renderAll();const n=$$('.cl-in');n.length&&n[n.length-1].focus();},
  clAdd:el=>{const p=docById(el.dataset.id);const cl=p&&(p.checks||[]).find(x=>x.id===el.dataset.cl);if(!cl||!el.value.trim())return;cl.items.push(...el.value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean).map(x=>({id:uid('ci'),x,d:false})));putDoc(p);const k=cl.id;renderAll();const n=$$('.cl-in').find(x=>x.dataset.cl===k);n&&n.focus();},
  clItemDel:el=>{const p=docById(el.dataset.id);const cl=p&&(p.checks||[]).find(x=>x.id===el.dataset.cl);if(!cl)return;const i=cl.items.findIndex(x=>x.id===el.dataset.i);if(i<0)return;cl.items.splice(i,1);putDoc(p);renderAll();},
  clMenu:el=>{const p=docById(el.dataset.id);const cl=p&&(p.checks||[]).find(x=>x.id===el.dataset.cl);if(!cl)return;
    openSheet({title:esc(cl.title||'Checklista'),side:true,body:`<div class="sheet-list"><button class="row" data-cm="unc">${icon('square')}Odznači sve</button><button class="row" data-cm="clr">${icon('trash')}Obriši označene</button><button class="row" data-cm="copy">${icon('copy')}Kopiraj kao tekst</button><button class="row" data-cm="shop">${icon('cart')}Neoznačeno → popis za dućan</button><button class="row" data-cm="del" style="color:var(--urgent)">${icon('trash')}Obriši checklistu</button></div>`,
      actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],onOpen:e2=>$$('[data-cm]',e2).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.cm;closeSheet();
        if(a==='unc')cl.items.forEach(i=>i.d=false);if(a==='clr')cl.items=cl.items.filter(i=>!i.d);
        if(a==='copy'){copyText((cl.title||'')+'\n'+cl.items.map(i=>(i.d?'☑ ':'☐ ')+i.x).join('\n'));return;}
        if(a==='shop'){addToShoppingNote(cl.items.filter(i=>!i.d).map(i=>i.x),'🛒 '+(cl.title||'Popis'));return;}
        if(a==='del'){const i=p.checks.indexOf(cl);p.checks.splice(i,1);putDoc(p);renderAll();toast('Checklista obrisana',{label:'Poništi',fn:()=>{p.checks.splice(i,0,cl);putDoc(p);renderAll();}});return;}
        putDoc(p);renderAll();}))});},
  ntNew:el=>{const p=docById(el.dataset.id);if(!p)return;migrateProj(p);if(!Array.isArray(p.notes))p.notes=[];p.notes.unshift({id:uid('nt'),title:'',body:'',date:localISO(today())});putDoc(p);renderAll();const t=$('.nt-list .pack-g');t&&t.focus();},
  diyNew:el=>{if(el.dataset.tpl)newProject(el.dataset.tpl,el.dataset.cat||'');else openDiyNew(el.dataset.cat||'');},
  diyCatEdit:(el,e)=>{e.preventDefault();e.stopPropagation();openDiyCatEditor(el.dataset.id||null,el.dataset.parent||'');},
  diySt:el=>{DUI.status=el.dataset.v;lsSet('planner.diyst',DUI.status);renderAll();},
  diyTab:el=>{DUI.tab[el.dataset.id]=el.dataset.v;renderAll();window.scrollTo({top:0,behavior:'smooth'});},
  diySet:el=>{const p=docById(el.dataset.id);if(!p)return;p[el.dataset.k]=el.dataset.v;putDoc(p);renderAll();if(el.dataset.v==='done')toast('🎉 Projekt završen!');},
  diyMenu:el=>openDiyMenu(el.dataset.id),
  diyRowDel:el=>{const p=docById(el.dataset.id);if(!p)return;const L=el.dataset.list;const i=(p[L]||[]).findIndex(x=>x.id===el.dataset.row);if(i<0)return;const[row]=p[L].splice(i,1);putDoc(p);renderAll();
    const label=row.n||row.x||row.t||row.u||'';if(label)toast('Uklonjeno: '+String(label).slice(0,30),{label:'Poništi',fn:()=>{p[L].splice(i,0,row);putDoc(p);renderAll();}});
    if(L==='steps'&&(row.img||[]).length)setTimeout(()=>{const pp=docById(p.id);if(!pp||!(pp.steps||[]).find(x=>x.id===row.id))row.img.forEach(imgDelete);},7000);},
  diyMatAdd:el=>{const p=docById(el.dataset.id);const inp=$('#matAdd');if(!p||!inp.value.trim())return inp&&inp.focus();const n=diyAddMany(p,'materials',splitLines(inp.value),parseMatLine);inp.value='';renderAll();const x=$('#matAdd');x&&x.focus();if(n>1)toast(`Dodano ${n} stavki`);},
  diyToolAdd:el=>{const p=docById(el.dataset.id);const inp=$('#toolAdd');if(!p||!inp.value.trim())return inp&&inp.focus();diyAddMany(p,'tools',splitLines(inp.value),n=>({id:uid('t'),n,have:false}));inp.value='';renderAll();const x=$('#toolAdd');x&&x.focus();},
  diyStepAdd:el=>{const p=docById(el.dataset.id);const inp=$('#stepAdd');if(!p||!inp.value.trim())return inp&&inp.focus();const n=diyAddMany(p,'steps',splitLines(inp.value),x=>({id:uid('s'),x,d:false,img:[]}));inp.value='';renderAll();const x=$('#stepAdd');x&&x.focus();if(n>1)toast(`Dodano ${n} koraka`);},
  diyLinkAdd:el=>{const p=docById(el.dataset.id);const inp=$('#linkAdd');const u=inp.value.trim();if(!p||!u)return inp&&inp.focus();const t=$('#linkAddT').value.trim();
    p.links=[...(p.links||[]),...u.split(/\s+/).filter(x=>/\./.test(x)).map(x=>({id:uid('l'),t,u:normUrl(x)}))];putDoc(p);renderAll();const x=$('#linkAdd');x&&x.focus();},
  diyShop:el=>{const p=docById(el.dataset.id);if(!p)return;addToShoppingNote((p.materials||[]).filter(m=>!m.have&&m.n).map(m=>`${m.q!=null?fmtNum(m.q,m.u)+' '+(m.u||'')+' ':''}${m.n}`.trim()),`🧱 ${p.title||'Materijal'}`);},
  diyMatHp:el=>{const p=docById(el.dataset.id);if(!p)return;const ms=(p.materials||[]).filter(m=>!m.have&&m.n);ms.forEach(m=>addHp(`Kupiti: ${m.q!=null?fmtNum(m.q,m.u)+' '+(m.u||'')+' ':''}${m.n}`.trim(),{src:`${p.emoji||'🛠️'} ${p.title}`}));saveData();toast(`${ms.length} poslano u Hitno`);},
  diyMatCopy:el=>{const p=docById(el.dataset.id);if(!p)return;copyText((p.materials||[]).map(m=>`${m.have?'☑':'☐'} ${m.q!=null?fmtNum(m.q,m.u)+' '+(m.u||''):''} ${m.n}${m.price?' — '+eur(m.price*(m.q==null?1:m.q)):''}`.replace(/\s+/g,' ').trim()).join('\n')+`\n\nUkupno: ${eur(pStats(p).cost)}`);},
  diyImgCover:el=>{const p=docById(el.dataset.id);if(!p)return;p.cover=el.dataset.img;putDoc(p);renderAll();},
  diyImgDel:el=>{const p=docById(el.dataset.id);if(!p)return;const im=el.dataset.img;confirmSheet('Obrisati ovu sliku?',()=>{p.images=(p.images||[]).filter(x=>x!==im);if(p.cover===im)p.cover=p.images[0]||'';putDoc(p);imgDelete(im);renderAll();});},
  diyStepImgDel:el=>{const p=docById(el.dataset.id);if(!p)return;const x=(p.steps||[]).find(s=>s.id===el.dataset.step);if(!x)return;const im=el.dataset.img;confirmSheet('Obrisati sliku iz koraka?',()=>{x.img=(x.img||[]).filter(i=>i!==im);putDoc(p);imgDelete(im);renderAll();});},
});
FILE_ACT.diyImg=async(files,el)=>{const p=docById(el.dataset.id);if(!p)return;await imgUploadMany(files,id=>{p.images=[...(p.images||[]),id];if(!p.cover)p.cover=id;});putDoc(p);renderAll();};
FILE_ACT.diyStepImg=async(files,el)=>{const p=docById(el.dataset.id);if(!p)return;const x=(p.steps||[]).find(s=>s.id===el.dataset.step);if(!x)return;await imgUploadMany(files,id=>{x.img=[...(x.img||[]),id];});putDoc(p);renderAll();};
// Enter u polju za novi korak dodaje; Shift+Enter novi red; zalijepljeni više redaka -> više koraka
document.addEventListener('keydown',e=>{const t=e.target;if(t&&t.id==='stepAdd'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ACT.diyStepAdd(t);}});
document.addEventListener('paste',e=>{const t=e.target;if(!t||!['matAdd','toolAdd'].includes(t.id))return;const txt=(e.clipboardData||window.clipboardData).getData('text');if(!txt||txt.indexOf('\n')<0)return;e.preventDefault();t.value=txt;ACT[t.id==='matAdd'?'diyMatAdd':'diyToolAdd'](t);});
function diySortables(){
  const base={animation:180,handle:'.grip',ghostClass:'s-ghost',chosenClass:'s-chosen',forceFallback:true,fallbackOnBody:true,fallbackTolerance:3,onStart:()=>{dragging=true;vibrate(8);}};
  $$('.cl-items').forEach(el=>{if(!window.Sortable)return;sortables.push(Sortable.create(el,{...base,onEnd:()=>{dragging=false;const p=docById(el.dataset.p);const cl=p&&(p.checks||[]).find(x=>x.id===el.dataset.cl);if(!cl){renderAll();return;}const ids=$$('li',el).map(x=>x.dataset.id);cl.items.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));putDoc(p);renderAll();}}));});
  [['#matList','materials','.mat-row'],['#toolList','tools','.tool-row'],['#stepList','steps','.pstep']].forEach(([sel,L,row])=>{
    const el=$(sel);if(!el||!window.Sortable)return;
    sortables.push(Sortable.create(el,{...base,onEnd:()=>{dragging=false;const p=docById(el.dataset.p);if(!p){renderAll();return;}const ids=$$(sel+' > '+row).map(x=>x.dataset.id);
      p[L].sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));putDoc(p);renderAll();}}));
  });
}
VIEWS.diy={render:viewDiy,after:diySortables,label:'DIY'};
