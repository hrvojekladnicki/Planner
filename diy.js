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
const DUI={tab:{},status:lsGet('planner.diyst','active'),q:''};
function diyCats(){const s=state.diy||(state.diy={});if(!Array.isArray(s.cats)||!s.cats.length)s.cats=DIY_DEFAULT_CATS.map(([id,e,n])=>({id,emoji:e,name:n}));return s.cats;}
function diyCat(id){return diyCats().find(c=>c.id===id)||null;}
function projects(){return docsOf('diy');}
function pStats(p){
  const st=(p.steps||[]).filter(s=>(s.x||'').trim());const sd=st.filter(s=>s.d).length;
  const mat=(p.materials||[]).filter(m=>(m.n||'').trim());const md=mat.filter(m=>m.have).length;
  const cost=mat.reduce((a,m)=>a+(+m.price||0)*(m.q==null?1:+m.q||0),0);const spent=mat.filter(m=>m.have).reduce((a,m)=>a+(+m.price||0)*(m.q==null?1:+m.q||0),0);
  return{steps:st.length,stepsDone:sd,mat:mat.length,matDone:md,cost,spent,imgs:(p.images||[]).length+(p.steps||[]).reduce((a,s)=>a+(s.img||[]).length,0)};
}
function statusPill(s){const x=DIY_STATUS[s]||DIY_STATUS.idea;return`<span class="pill pill-${x[2]}">${x[0]} ${x[1]}</span>`;}
function projCard(p){
  const s=pStats(p);const c=diyCat(p.cat);const pct=s.steps?Math.round(s.stepsDone/s.steps*100):(p.status==='done'?100:0);
  const over=p.due&&p.status!=='done'&&fromInputDate(p.due)<today();
  return`<a class="pcard" href="#/diy/p/${encodeURIComponent(p.id)}">
    <div class="pcard-img" style="--h:${hueOf(p.cat||p.title)}">${p.cover?imgTag(p.cover):`<span class="remo">${esc(p.emoji||'🛠️')}</span>`}<span class="pcard-st">${statusPill(p.status)}</span></div>
    <div class="pcard-body"><small class="rcat">${c?esc(c.emoji+' '+c.name):''}</small><b>${esc(p.title||'Bez naslova')}</b>
      ${p.desc?`<p>${esc(p.desc.slice(0,110))}</p>`:''}
      <div class="pbar"><div class="bar"><i style="width:${pct}%"></i></div><small>${s.steps?`${s.stepsDone}/${s.steps} koraka`:'—'}</small></div>
      <div class="dmeta">${s.mat?`<span>${icon('box')}${s.matDone}/${s.mat}</span>`:''}${s.cost?`<span>${esc(eur(s.cost))}</span>`:''}${p.due?`<span class="${over?'over':''}">${icon('calendar')}${esc(shortDay(fromInputDate(p.due)))}</span>`:''}${s.imgs?`<span>${icon('image')}${s.imgs}</span>`:''}</div></div>
  </a>`;
}
function viewDiy(r){
  if(r.id==='p'&&r.sub)return viewProject(r.sub);
  const cats=diyCats();const catId=r.id==='c'?r.sub:'';const cat=catId?diyCat(catId):null;
  const all=projects();const q=DUI.q.trim().toLowerCase();
  let list=all.filter(p=>!catId||p.cat===catId);
  const stF={active:p=>p.status!=='done'&&p.status!=='idea',idea:p=>p.status==='idea',done:p=>p.status==='done',all:()=>true};
  const base=list;
  list=list.filter(stF[DUI.status]||stF.all);
  if(q)list=list.filter(p=>[p.title,p.desc,p.specs,p.notes,(p.materials||[]).map(m=>m.n).join(' ')].join(' ').toLowerCase().includes(q));
  const ord={progress:0,plan:1,hold:2,idea:3,done:4};list.sort((a,b)=>(ord[a.status]??5)-(ord[b.status]??5)||(b.updated||0)-(a.updated||0));
  const cnt=k=>base.filter(stF[k]).length;
  const totalCost=base.filter(p=>p.status!=='done').reduce((a,p)=>a+pStats(p).cost-pStats(p).spent,0);
  return`
  <div class="page-head"><div><a class="crumb" href="${cat?'#/diy':'#/'}">${icon('chevL')}${cat?'DIY':'Dashboard'}</a>
    <h1>${cat?`<span class="emo">${esc(cat.emoji)}</span>${esc(cat.name)}`:'🔨 DIY projekti'}</h1>
    <p>${base.length} ${plural(base.length,'projekt','projekta','projekata')}${totalCost>0?` · još za kupiti ≈ ${esc(eur(totalCost))}`:''}</p></div>
    <div class="head-acts">${cat?`<button class="btn btn-outline btn-sm" data-act="diyCatEdit" data-id="${esc(cat.id)}">${icon('edit')}Uredi podsekciju</button>`:''}<button class="btn btn-primary" data-act="diyNew" data-cat="${esc(catId)}">${icon('plus')}Novi projekt</button></div></div>
  <div class="cats">
    <a class="cat${!catId?' on':''}" href="#/diy">Sve<span class="n">${all.length}</span></a>
    ${cats.map(c=>`<a class="cat${catId===c.id?' on':''}" href="#/diy/c/${encodeURIComponent(c.id)}">${esc(c.emoji)} ${esc(c.name)}<span class="n">${all.filter(p=>p.cat===c.id).length}</span></a>`).join('')}
    <button class="cat cat-add" data-act="diyCatEdit" data-id="">${icon('plus')}Podsekcija</button>
  </div>
  <div class="list-tools" style="margin-top:0">
    <div class="seg">${[['active','Aktivni'],['idea','Ideje'],['done','Završeni'],['all','Sve']].map(([k,l])=>`<button class="${DUI.status===k?'on':''}" data-act="diySt" data-v="${k}">${l} <small>${cnt(k)}</small></button>`).join('')}</div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="psearch" data-input="pSearch" value="${esc(DUI.q)}" placeholder="Pretraži projekte i materijal…"></label>
  </div>
  ${!docsLoaded&&!all.length?`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam projekte…</div>`:
  list.length?`<div class="pgrid">${list.map(projCard).join('')}</div>`:`<section class="card hero-empty"><div><span class="big">🪚</span><h2>${base.length?'Nema projekata u ovom filtru':'Još nema projekata'}</h2>
    <p>Projekt ima popis materijala s cijenama, alat, korake sa slikama, galeriju i linkove. Kreni od predloška.</p>
    <div class="btn-row" style="justify-content:center">${Object.entries(DIY_TPL).map(([k,t])=>`<button class="btn btn-outline btn-sm" data-act="diyNew" data-tpl="${k}" data-cat="${esc(catId)}">${t.emoji} ${esc(t.name)}</button>`).join('')}</div></div></section>`}`;
}
function viewProject(id){
  const p=docById(id);if(!p||p.kind!=='diy')return docsLoaded?`<div class="card empty" style="padding:40px"><span class="big">🤷</span>Projekt nije pronađen. <a class="link-btn" href="#/diy">Natrag</a></div>`:`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam…</div>`;
  const s=pStats(p);const tab=DUI.tab[id]||'overview';const c=diyCat(p.cat);const B=`data-bind="${esc(p.id)}"`;
  const tabs=[['overview','Pregled',''],['mat','Materijal',s.mat?`${s.matDone}/${s.mat}`:''],['tools','Alat',(p.tools||[]).length||''],['steps','Koraci',s.steps?`${s.stepsDone}/${s.steps}`:''],['img','Slike',(p.images||[]).length||''],['links','Linkovi',(p.links||[]).length||'']];
  let body='';
  if(tab==='overview'){
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
        <div class="field"><label>Podsekcija</label><select ${B} data-path="cat">${diyCats().map(x=>`<option value="${esc(x.id)}" ${p.cat===x.id?'selected':''}>${esc(x.emoji+' '+x.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Prioritet</label><select ${B} data-path="prio"><option value="">—</option>${[['high','Visok'],['medium','Srednji'],['low','Nizak']].map(([k,l])=>`<option value="${k}" ${p.prio===k?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label>Početak</label><input type="date" ${B} data-path="start" value="${esc(p.start||'')}"></div>
        <div class="field"><label>Rok</label><input type="date" ${B} data-path="due" value="${esc(p.due||'')}"></div>
        <div class="field"><label>Budžet (€)</label><input inputmode="decimal" ${B} data-path="budget" data-type="num" value="${esc(p.budget??'')}" placeholder="npr. 300"></div>
        <div class="field"><label>Trošak materijala</label><div class="ro" id="pCost2">${esc(eur(s.cost))}${p.budget?` <small class="${s.cost>p.budget?'over':''}">/ budžet ${esc(eur(p.budget))}</small>`:''}</div></div>
      </div>
      <div class="field"><label>Opis / cilj</label><textarea class="input grow" ${B} data-path="desc" rows="3" placeholder="Što radiš i zašto, kako bi trebalo izgledati…">${esc(p.desc||'')}</textarea></div>
      <div class="field"><label>${icon('ruler')} Mjere i specifikacije</label><textarea class="input grow mono" ${B} data-path="specs" rows="4" placeholder="Otvor: 82 × 205 cm&#10;Debljina krila: 4 cm&#10;Drvo: smreka, sušena">${esc(p.specs||'')}</textarea></div>
      <div class="field"><label>Bilješke</label><textarea class="input grow" ${B} data-path="notes" rows="3" placeholder="Ideje, upozorenja, kontakti majstora…">${esc(p.notes||'')}</textarea></div>
    </div></section>`;
  }
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
  <div class="page-head"><div style="min-width:0;flex:1"><a class="crumb" href="${c?'#/diy/c/'+encodeURIComponent(c.id):'#/diy'}">${icon('chevL')}${c?esc(c.emoji+' '+c.name):'DIY'}</a>
    <div class="ptitle"><input class="emo-in" ${B} data-path="emoji" value="${esc(p.emoji||'')}" maxlength="4" placeholder="🛠️" aria-label="Ikona"><input class="note-title" ${B} data-path="title" value="${esc(p.title||'')}" placeholder="Naziv projekta" aria-label="Naziv projekta"></div>
    <div class="mini-stats">${statusPill(p.status)}${p.due?`<span class="pill">${icon('calendar')} rok ${esc(shortDay(fromInputDate(p.due)))}</span>`:''}${p.prio?`<span class="pill chip-prio-${esc(p.prio)}">${{high:'Visok',medium:'Srednji',low:'Nizak'}[p.prio]} prioritet</span>`:''}</div></div>
    <div class="head-acts"><button class="ibtn big" data-act="diyMenu" data-id="${esc(p.id)}" title="Opcije">${icon('more')}</button></div></div>
  <div class="ptabs seg seg-scroll">${tabs.map(([k,l,n])=>`<button class="${tab===k?'on':''}" data-act="diyTab" data-id="${esc(p.id)}" data-v="${k}">${l}${n!==''?` <small>${n}</small>`:''}</button>`).join('')}</div>
  ${body}`;
}
function matTotHTML(p){const s=pStats(p);return`<span>Ukupno <b>${esc(eur(s.cost))}</b></span><span class="ok">Nabavljeno <b>${esc(eur(s.spent))}</b></span><span class="warn">Preostalo <b>${esc(eur(s.cost-s.spent))}</b></span>`;}
BIND_HOOKS.diy=(p,path,el,isChange)=>{
  if(/^materials\./.test(path)){const t=$('#matTot');if(t)t.innerHTML=matTotHTML(p);const id=path.split('.')[1];const m=(p.materials||[]).find(x=>x.id===id);const c=$(`[data-tot="${CSS.escape(id)}"]`);if(c&&m)c.textContent=m.price?eur((+m.price)*(m.q==null?1:+m.q||0)):'';}
  if(isChange&&(/\.(have|d)$/.test(path)||['cat','prio','start','due'].includes(path)))renderAll();
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
  (p.links||[]).length?'\nLINKOVI':'',...(p.links||[]).map(l=>`${l.t?l.t+': ':''}${l.u}`)].filter(x=>x!=='').join('\n').trim();}
function newProject(tpl='blank',cat=''){
  const T=DIY_TPL[tpl]||DIY_TPL.blank;const cats=diyCats();
  const p={id:uid('p'),kind:'diy',title:tpl==='blank'?'':T.name,emoji:T.emoji,cat:cat||T.cat||cats[0].id,status:'plan',images:[],cover:'',desc:'',specs:'',notes:'',
    materials:T.mat.map(parseMatLine).filter(Boolean),tools:T.tools.map(n=>({id:uid('t'),n,have:false})),steps:T.steps.map(x=>({id:uid('s'),x,d:false,img:[]})),links:[]};
  if(!cats.find(c=>c.id===p.cat))p.cat=cats[0].id;
  putDoc(p,{now:true});DUI.tab[p.id]='overview';go('#/diy/p/'+p.id);
  setTimeout(()=>{const t=$('.ptitle .note-title');if(t){t.focus();t.select();}},120);
}
function openDiyNew(cat){
  openSheet({title:'Novi DIY projekt',body:`<div class="choices">${Object.entries(DIY_TPL).map(([k,t])=>`<button class="choice" data-tpl="${k}"><div class="ico" style="background:var(--surface-2);font-size:1.3rem">${t.emoji}</div><div><b>${esc(t.name)}</b><small>${t.steps.length?`${t.steps.length} koraka · ${t.mat.length} materijala`:'kreni od nule'}</small></div></button>`).join('')}</div>
    <div class="field"><label for="dn_cat">Podsekcija</label><select id="dn_cat">${diyCats().map(c=>`<option value="${esc(c.id)}" ${c.id===cat?'selected':''}>${esc(c.emoji+' '+c.name)}</option>`).join('')}</select></div>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-tpl]',el).forEach(b=>b.addEventListener('click',()=>{const c=$('#dn_cat',el).value;closeSheet();newProject(b.dataset.tpl,c);}))});
}
function openDiyCatEditor(id){
  const c=id?diyCat(id):null;
  openSheet({title:c?'Uredi podsekciju':'Nova podsekcija',body:`<div class="grid2" style="grid-template-columns:90px 1fr">
    <div class="field"><label for="dc_emo">Ikona</label><input id="dc_emo" value="${esc(c?c.emoji:'')}" maxlength="4" placeholder="🪵" style="text-align:center;font-size:1.3rem"></div>
    <div class="field"><label for="dc_name">Naziv</label><input id="dc_name" value="${esc(c?c.name:'')}" maxlength="30" placeholder="npr. Auto, Radiona…"></div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap" id="dcPick">${['🪚','🪵','🏠','🌱','⚡','🔧','🌳','🚗','🧱','🎨','🔌','🚿','🪟','🛠️','🍇','🐔'].map(e=>`<button class="ibtn" style="font-size:1.2rem;background:var(--surface-2)" data-e="${e}">${e}</button>`).join('')}</div>`,
    actions:[...(c?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>{const n=projects().filter(p=>p.cat===c.id).length;const cats=diyCats();if(cats.length<2){toast('Mora ostati barem jedna podsekcija');return;}
        confirmSheet(`Obrisati podsekciju “${c.name}”?${n?` ${n} projekata premjestit će se u “${cats.find(x=>x.id!==c.id).name}”.`:''}`,()=>{const to=cats.find(x=>x.id!==c.id).id;projects().filter(p=>p.cat===c.id).forEach(p=>{p.cat=to;putDoc(p);});state.diy.cats=cats.filter(x=>x.id!==c.id);saveData();go('#/diy');});}}]:[]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(c?'Spremi':'Kreiraj'),cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');const name=$('#dc_name',el).value.trim();if(!name){$('#dc_name',el).focus();return;}const emo=$('#dc_emo',el).value.trim()||'🛠️';
        if(c){c.name=name;c.emoji=emo;closeSheet();saveData();renderAll();}else{const nid='dc'+Date.now().toString(36);diyCats().push({id:nid,name,emoji:emo});closeSheet();saveData();go('#/diy/c/'+nid);}}}],
    onOpen:el=>{$$('#dcPick button',el).forEach(b=>b.addEventListener('click',()=>{$('#dc_emo',el).value=b.dataset.e;}));$('#dc_name',el).focus();}});
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
  diyNew:el=>{if(el.dataset.tpl)newProject(el.dataset.tpl,el.dataset.cat||'');else openDiyNew(el.dataset.cat||'');},
  diyCatEdit:(el,e)=>{e.preventDefault();e.stopPropagation();openDiyCatEditor(el.dataset.id||null);},
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
  [['#matList','materials','.mat-row'],['#toolList','tools','.tool-row'],['#stepList','steps','.pstep']].forEach(([sel,L,row])=>{
    const el=$(sel);if(!el||!window.Sortable)return;
    sortables.push(Sortable.create(el,{...base,onEnd:()=>{dragging=false;const p=docById(el.dataset.p);if(!p){renderAll();return;}const ids=$$(sel+' > '+row).map(x=>x.dataset.id);
      p[L].sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));putDoc(p);renderAll();}}));
  });
}
VIEWS.diy={render:viewDiy,after:diySortables,label:'DIY'};
