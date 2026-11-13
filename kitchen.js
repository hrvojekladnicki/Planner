'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   KUHINJA — Kuharica (vlastiti recepti) + Kokteli i napitci
   Recepti i vlastiti napici: zasebni dokumenti (kind 'recipe' / 'drink').
   Ugrađeni napici: DRINKS (drinks-data.js); favoriti/ocjene/bar u state.drinks.
   ═══════════════════════════════════════════════════════════════════════ */

/* ───────── ČAŠE (SVG ilustracije) ───────── */
const GLASS={
  wine:{body:'M30 22C28 62 40 88 60 90C80 88 92 62 90 22Z',stem:[90,132],liq:46,rim:[30,90,22]},
  balloon:{body:'M22 24C16 72 36 98 60 98C84 98 104 72 98 24Z',stem:[98,132],liq:50,rim:[22,98,24]},
  flute:{body:'M46 12C44 52 48 80 60 84C72 80 76 52 74 12Z',stem:[84,132],liq:24,rim:[46,74,12]},
  martini:{body:'M18 24L102 24L60 72Z',stem:[72,132],liq:32,rim:[18,102,24]},
  coupe:{body:'M20 36C22 64 42 72 60 72C78 72 98 64 100 36Z',stem:[72,132],liq:42,rim:[20,100,36]},
  highball:{body:'M38 16L40 134Q40 138 44 138L76 138Q80 138 80 134L82 16Z',liq:34,rim:[38,82,16]},
  rocks:{body:'M28 58L32 132Q32 138 38 138L82 138Q88 138 88 132L92 58Z',liq:78,rim:[28,92,58]},
  copper:{body:'M30 48L32 132Q32 138 38 138L80 138Q86 138 86 132L88 48Z',handle:'M87 64C106 64 106 112 85 112',liq:52,rim:[30,88,48],opaque:'copper'},
  mug:{body:'M28 40L28 130Q28 138 36 138L78 138Q86 138 86 130L86 40Z',handle:'M86 60C106 60 106 112 86 112',liq:54,rim:[28,86,40]},
  irish:{body:'M32 28L38 110Q60 118 82 110L88 28Z',stem:[114,128],handle:'M86 44C104 46 102 92 83 94',liq:40,rim:[32,88,28]},
  bottle:{body:'M50 8L70 8L70 30Q90 40 90 62L90 134Q90 140 84 140L36 140Q30 140 30 134L30 62Q30 40 50 30Z',liq:56,rim:[50,70,8]},
};
let _gid=0;
function glassSVG(d,{size=''}={}){
  const g=GLASS[d.glass]||GLASS.rocks;const id='g'+(++_gid);const[c1,c2]=d.color||['#f3c470','#b9701e'];
  const[rl,rr,ry]=g.rim;const mid=(rl+rr)/2;const top=g.liq;
  const ice=['highball','rocks','wine','balloon','copper'].includes(d.glass)&&!d.hot&&d.garnish!=='none'||d.id==='negroni'||d.id==='white-russian';
  const gar={
    orange:`<g transform="translate(${rr-6} ${ry-2})"><circle r="13" fill="#ffa53a"/><circle r="10" fill="#ffd28a"/><path d="M0-10V10M-10 0H10M-7-7 7 7M-7 7 7-7" stroke="#ffa53a" stroke-width="1.4"/></g>`,
    lime:`<g transform="translate(${rr-6} ${ry-2})"><circle r="12" fill="#6fb52c"/><circle r="9.5" fill="#c8ec8c"/><path d="M0-9V9M-9 0H9M-6.5-6.5 6.5 6.5M-6.5 6.5 6.5-6.5" stroke="#6fb52c" stroke-width="1.3"/></g>`,
    lemon:`<g transform="translate(${rr-6} ${ry-2})"><circle r="12" fill="#f2c613"/><circle r="9.5" fill="#fff1a1"/><path d="M0-9V9M-9 0H9M-6.5-6.5 6.5 6.5M-6.5 6.5 6.5-6.5" stroke="#f2c613" stroke-width="1.3"/></g>`,
    lemonTwist:`<path d="M${rr-8} ${ry+4}c6-8 14-2 10 4s-12 2-6-6 12-6 12-12" fill="none" stroke="#f2c613" stroke-width="4" stroke-linecap="round"/>`,
    mint:`<g transform="translate(${mid+8} ${ry+2})"><ellipse rx="6" ry="11" transform="rotate(-30)" fill="#3fa34d"/><ellipse cx="9" cy="-4" rx="5" ry="10" transform="rotate(25 9 -4)" fill="#58c060"/><ellipse cx="-8" cy="-2" rx="5" ry="9" transform="rotate(-60 -8 -2)" fill="#2f8a3c"/></g>`,
    berry:`<g><circle cx="${mid-8}" cy="${top+30}" r="6" fill="#d61f45"/><circle cx="${mid+9}" cy="${top+44}" r="5" fill="#e83a5d"/><circle cx="${mid+2}" cy="${top+18}" r="5" fill="#b8173a"/></g>`,
    cherry:`<g><path d="M${mid+2} ${ry-14}q8-10 16-12" stroke="#4b6b1d" stroke-width="2" fill="none"/><circle cx="${mid+2}" cy="${ry-6}" r="8" fill="#d41b32"/><circle cx="${mid-1}" cy="${ry-9}" r="2.4" fill="#fff" opacity=".6"/></g>`,
    cinnamon:`<g transform="rotate(18 ${rr-14} ${ry})"><rect x="${rr-18}" y="${ry-26}" width="7" height="46" rx="3" fill="#8a4a1f"/><rect x="${rr-11}" y="${ry-26}" width="5" height="46" rx="2.5" fill="#a65d2a"/></g>`,
    coffee:`<g fill="#3a1d0d">${[-10,0,10].map(x=>`<ellipse cx="${mid+x}" cy="${top-1}" rx="3.4" ry="2.3"/>`).join('')}</g>`,
    cream:`<path d="M${rl+6} ${top+2}q4-12 14-8q4-10 14-4q8-8 16 0q10-4 12 8q6 2 4 8H${rl+6}z" fill="#fffaf0" stroke="#efe3cf"/>`,
    none:'',
  }[d.garnish||'none']||'';
  const foam=d.foam?`<rect x="0" y="${top}" width="120" height="7" fill="#fff7e6" opacity=".9"/>`:'';
  const iceS=ice?`<g fill="#fff" opacity=".32">${[[mid-14,top+10],[mid+4,top+20],[mid-6,top+34]].map(([x,y])=>`<rect x="${x}" y="${y}" width="15" height="15" rx="3" transform="rotate(12 ${x+7} ${y+7})"/>`).join('')}</g>`:'';
  const steam=d.hot?`<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".28" class="steam"><path d="M${mid-10} ${ry-6}c-6-8 6-12 0-20"/><path d="M${mid+2} ${ry-8}c-6-8 6-12 0-20"/><path d="M${mid+14} ${ry-6}c-6-8 6-12 0-20"/></g>`:'';
  const copper=g.opaque==='copper';
  return`<svg class="glass ${size}" viewBox="-8 -24 136 172" aria-hidden="true">
    <defs><linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8692f"/><stop offset=".45" stop-color="#f0a768"/><stop offset="1" stop-color="#8c4719"/></linearGradient>
      <clipPath id="${id}k"><path d="${g.body}"/></clipPath></defs>
    ${steam}
    ${g.handle?`<path d="${g.handle}" fill="none" stroke="${copper?`url(#${id}c)`:'currentColor'}" stroke-width="${copper?7:5}" stroke-linecap="round" opacity="${copper?1:.35}"/>`:''}
    <path d="${g.body}" fill="${copper?`url(#${id}c)`:'currentColor'}" opacity="${copper?1:.07}"/>
    ${copper?`<ellipse cx="${mid}" cy="${ry+2}" rx="${(rr-rl)/2-2}" ry="5" fill="url(#${id}l)"/>`:`<g clip-path="url(#${id}k)"><rect x="0" y="${top}" width="120" height="150" fill="url(#${id}l)"/>${foam}${iceS}${d.garnish==='berry'?gar:''}<path d="M${rl+8} ${ry+10}Q${rl+6} ${ry+50} ${rl+14} ${ry+80}" stroke="#fff" stroke-width="4" fill="none" opacity=".35" stroke-linecap="round"/></g>`}
    <path d="${g.body}" fill="none" stroke="currentColor" stroke-width="2.2" opacity=".55" stroke-linejoin="round"/>
    ${g.stem?`<path d="M60 ${g.stem[0]}V${g.stem[1]}" stroke="currentColor" stroke-width="3" opacity=".5"/><ellipse cx="60" cy="${g.stem[1]+2}" rx="22" ry="4" fill="currentColor" opacity=".18"/>`:''}
    ${d.garnish==='berry'?'':gar}
  </svg>`;
}

/* ───────── POMOĆNO ───────── */
const KUI={rq:'',rcat:'',rsort:lsGet('planner.rsort','recent'),rfav:false,dtab:lsGet('planner.dtab','all'),dsp:'',dq:'',dcan:false};
const COOK={};          // ephemeral: id -> {serv, ing:Set, st:Set, unit}
function cookSt(id,def){return COOK[id]||(COOK[id]={serv:def||1,ing:new Set(),st:new Set(),unit:'ml'});}
function dm(){const s=state.drinks||(state.drinks={});['fav','rate','note','photo','bar','made'].forEach(k=>{if(!s[k]||typeof s[k]!=='object')s[k]={};});return s;}
function hueOf(s){let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))%360;return h;}
function stepsOf(d){return(d.steps||[]).map(s=>typeof s==='string'?s:(s&&s.x)||'').filter(x=>x.trim());}
function timersIn(text){const out=[];const re=/(\d+)(?:\s*[-–]\s*(\d+))?\s*(min(?:ut[aei]?)?|sat[ai]?|h|sek(?:und[ei]?)?|s)\b/gi;let m;
  while((m=re.exec(text))){const n=+(m[2]||m[1]);const u=m[3].toLowerCase();const sec=u.startsWith('s')&&!u.startsWith('sat')?n:(u.startsWith('h')||u.startsWith('sat'))?n*3600:n*60;if(sec>0&&sec<=12*3600)out.push({sec,label:m[0]});}return out;}
function stepHTMLText(t,ctx){
  let h=linkify(t);
  timersIn(t).forEach(tm=>{h=h.replace(esc(tm.label),`<button class="tchip" data-act="timerStart" data-sec="${tm.sec}" data-label="${esc((ctx||'')+' · '+tm.label)}">${icon('timer')}${esc(tm.label)}</button>`);});
  return h;
}

/* ───────── TIMERI ───────── */
const TIMERS=[];let timerTick=null;
function timerStart(sec,label){TIMERS.push({id:uid('t'),end:Date.now()+sec*1000,label,sec});vibrate(15);paintTimers();if(!timerTick)timerTick=setInterval(paintTimers,1000);
  try{if('Notification'in window&&Notification.permission==='default')Notification.requestPermission();}catch(e){}}
function beep(){try{const A=new(window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(t=>{const o=A.createOscillator(),g=A.createGain();o.frequency.value=880;o.connect(g);g.connect(A.destination);g.gain.setValueAtTime(.001,A.currentTime+t);g.gain.exponentialRampToValueAtTime(.3,A.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+t+.28);o.start(A.currentTime+t);o.stop(A.currentTime+t+.3);});}catch(e){}}
function paintTimers(){
  let box=$('#timers');if(!box){box=document.createElement('div');box.id='timers';document.body.appendChild(box);}
  const now=Date.now();
  TIMERS.forEach(t=>{if(!t.fired&&t.end<=now){t.fired=1;beep();vibrate([200,100,200]);toast('⏰ Gotovo: '+t.label,{ms:8000});
    try{if('Notification'in window&&Notification.permission==='granted')new Notification('⏰ Timer gotov',{body:t.label,icon:'icon-192.png'});}catch(e){}}});
  box.innerHTML=TIMERS.map(t=>{const left=Math.max(0,Math.round((t.end-now)/1000));const m=Math.floor(left/60),s=left%60;const h=Math.floor(m/60);
    return`<div class="timer${t.fired?' done':''}">${icon('timer')}<span><b>${h?h+':'+String(m%60).padStart(2,'0'):m}:${String(s).padStart(2,'0')}</b><small>${esc(t.label)}</small></span>
      <button data-act="timerStop" data-id="${t.id}" aria-label="Zaustavi">${icon('x')}</button></div>`;}).join('');
  if(!TIMERS.length&&timerTick){clearInterval(timerTick);timerTick=null;}
}

/* ═════════════════════ KOKTELI I NAPITCI ═════════════════════ */
const DCAT={koktel:'Kokteli',topli:'Topli i zimski napici',domace:'Domaći likeri'};
function allDrinks(){
  const custom=docsOf('drink');const over={};custom.forEach(d=>{if(d.base)over[d.base]=d;});
  const built=DRINKS.filter(d=>!over[d.id]).map(d=>Object.assign({builtin:true},d));
  return[...built,...custom.map(d=>Object.assign({custom:true},d))];
}
function drinkById(id){return docById(id)||((d=>d?Object.assign({builtin:true},d):null)(DRINKS.find(d=>d.id===id)));}
function drinkReq(d){return(d.ing||[]).filter(i=>i.t!=='h'&&i.k&&!i.opt);}
function drinkMissing(d){const bar=dm().bar;return drinkReq(d).filter(i=>!bar[i.k]);}
function barCount(){return Object.values(dm().bar).filter(Boolean).length;}
function drinkArt(d,big){const ph=dm().photo[d.id]||d.cover;return ph?imgTag(ph,{thumb:!big,cls:'dphoto'}):glassSVG(d,{size:big?'big':''});}
function drinkCard(d){
  const m=dm();const fav=!!m.fav[d.id];const bc=barCount();const miss=bc?drinkMissing(d):null;
  return`<a class="dcard" href="#/kokteli/${encodeURIComponent(d.id)}" style="--c1:${esc(d.color?d.color[0]:'#f3c470')};--c2:${esc(d.color?d.color[1]:'#b9701e')}">
    <div class="dcard-art">${drinkArt(d)}</div>
    <button class="fav-btn${fav?' on':''}" data-act="drinkFav" data-id="${esc(d.id)}" aria-label="Favorit">${icon(fav?'star':'starO')}</button>
    ${d.n?`<span class="dnum">${d.n}</span>`:d.custom?`<span class="dnum mine">moj</span>`:d.extra?`<span class="dnum new">+</span>`:''}
    <div class="dcard-body"><b>${esc(d.title)}</b><small>${esc(d.desc||'')}</small>
      <div class="dmeta"><span>${icon('clock')}${esc(d.timeLabel||fmtMin(d.time)||'—')}</span><span>${esc(d.abv||'')}</span>
      ${miss?miss.length?`<span class="miss">fali ${miss.length}</span>`:`<span class="can">✓ imaš sve</span>`:''}</div></div>
  </a>`;
}
function viewDrinks(r){
  if(r.id==='bar')return viewBar();
  if(r.id==='new'||r.sub==='edit')return viewRecipeEdit(r,'drink');
  if(r.id)return viewDrink(r.id);
  const m=dm();const all=allDrinks();const q=KUI.dq.trim().toLowerCase();const bc=barCount();
  let list=all.filter(d=>KUI.dtab==='all'?true:KUI.dtab==='fav'?m.fav[d.id]:KUI.dtab==='mine'?d.custom:d.cat===KUI.dtab);
  if(KUI.dsp)list=list.filter(d=>(d.sp||[]).includes(KUI.dsp));
  if(q)list=list.filter(d=>(d.title+' '+(d.desc||'')+' '+(d.taste||'')+' '+(d.ing||[]).map(i=>i.n).join(' ')).toLowerCase().includes(q));
  if(KUI.dcan&&bc)list=list.filter(d=>!drinkMissing(d).length);
  const cnt=k=>all.filter(d=>k==='fav'?m.fav[d.id]:k==='mine'?d.custom:d.cat===k).length;
  const groups=KUI.dtab==='all'&&!q&&!KUI.dsp&&!KUI.dcan?[['koktel'],['topli'],['domace']].map(([k])=>[DCAT[k],list.filter(d=>d.cat===k)]):[[null,list]];
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>🍸 Kokteli i napitci</h1><p>${all.length} recepata · kućni koktel bar i topli zimski napici.</p></div>
    <div class="head-acts"><a class="btn btn-outline" href="#/kokteli/bar">🍾 Moj bar${bc?` <span class="pill">${bc}</span>`:''}</a><a class="btn btn-primary" href="#/kokteli/new">${icon('plus')}Novi napitak</a></div></div>
  <div class="list-tools" style="margin-top:0">
    <div class="seg seg-scroll">
      ${[['all','Sve',all.length],['koktel','Kokteli',cnt('koktel')],['topli','Topli & zimski',cnt('topli')],['domace','Domaće',cnt('domace')],['fav','★ Favoriti',cnt('fav')],...(cnt('mine')?[['mine','Moji',cnt('mine')]]:[])].map(([k,l,n])=>`<button class="${KUI.dtab===k?'on':''}" data-act="dTab" data-v="${k}">${l} <small>${n}</small></button>`).join('')}
    </div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="dsearch" data-input="dSearch" value="${esc(KUI.dq)}" placeholder="Pretraži napitke ili sastojke…"></label>
  </div>
  <div class="chips-row">
    ${SPIRITS.map(([k,l])=>`<button class="fchip${KUI.dsp===k?' on':''}" data-act="dSp" data-v="${k}">${esc(l)}</button>`).join('')}
    <span class="spacer"></span>
    ${bc?`<button class="fchip can${KUI.dcan?' on':''}" data-act="dCan">✓ Mogu napraviti (${all.filter(d=>!drinkMissing(d).length).length})</button>`:`<a class="fchip" href="#/kokteli/bar">Označi što imaš doma →</a>`}
  </div>
  ${groups.map(([h,l])=>l.length?`${h?`<h2 class="sec-h">${esc(h)} <small>${l.length}</small></h2>`:''}<div class="dgrid">${l.map(drinkCard).join('')}</div>`:'').join('')||`<div class="card empty" style="padding:40px"><span class="big">🍹</span>Ništa ne odgovara filtru.</div>`}`;
}
function viewDrink(id){
  const d=drinkById(id);if(!d)return`<div class="card empty" style="padding:40px"><span class="big">🤷</span>Napitak nije pronađen. <a class="link-btn" href="#/kokteli">Natrag</a></div>`;
  const m=dm();const st=cookSt('d:'+d.id,1);const f=st.serv/(d.servings||1);const bc=barCount();
  const hasMl=(d.ing||[]).some(i=>i.u==='ml');const yl=d.yieldU==='l';
  const conv=i=>{if(i.u!=='ml'||st.unit==='ml')return fmtQty(i,f);const k=st.unit==='cl'?.1:1/29.57;return fmtQty({q:i.q*k,q2:i.q2!=null?i.q2*k:null,u:st.unit},f);};
  const miss=drinkMissing(d);const glassName={wine:'vinska čaša',balloon:'balon čaša',flute:'flûte',martini:'martini čaša',coupe:'coupe',highball:'visoka čaša',rocks:'niska čaša',copper:'bakrena šalica',mug:'šalica',irish:'staklena šalica',bottle:'boca'}[d.glass]||'';
  return`
  <div class="page-head"><div style="min-width:0"><a class="crumb" href="#/kokteli">${icon('chevL')}Kokteli i napitci</a>
    <h1>${esc(d.title)}</h1><p>${esc(d.desc||'')}</p></div>
    <div class="head-acts">
      <button class="ibtn big${m.fav[d.id]?' fav-on':''}" data-act="drinkFav" data-id="${esc(d.id)}" title="Favorit">${icon(m.fav[d.id]?'star':'starO')}</button>
      <button class="ibtn big" data-act="drinkMenu" data-id="${esc(d.id)}" title="Opcije">${icon('more')}</button></div></div>
  <div class="ddetail">
    <section class="card dart" style="--c1:${esc(d.color?d.color[0]:'#f3c470')};--c2:${esc(d.color?d.color[1]:'#b9701e')}">
      ${(m.photo[d.id]||d.cover)?`<button class="dart-photo" data-act="lightbox" data-ids="${esc(m.photo[d.id]||d.cover)}">${drinkArt(d,true)}</button>`:drinkArt(d,true)}
      <div class="dart-foot">${fileBtn('drinkPhoto',d.id,{label:(m.photo[d.id]?'Promijeni fotku':'Dodaj svoju fotku'),multiple:false,cls:'btn btn-ghost btn-sm'})}
        ${m.photo[d.id]?`<button class="btn btn-ghost btn-sm" data-act="drinkPhotoDel" data-id="${esc(d.id)}">${icon('trash')}</button>`:''}</div>
    </section>
    <div class="dinfo">
      <div class="facts">
        <div><small>Vrijeme</small><b>${esc(d.timeLabel||fmtMin(d.time)||'—')}</b></div>
        <div><small>Alkohol</small><b>${esc(d.abv||'—')}</b></div>
        <div><small>Okus</small><b>${esc(d.taste||'—')}</b></div>
        <div><small>Čaša</small><b>${esc(glassName||'—')}</b></div>
      </div>
      <div class="rate-row">${starsHTML(m.rate[d.id],'drinkRate',d.id)}<span class="made">${m.made[d.id]?`Napravljeno ${m.made[d.id]}×`:''}</span>
        <button class="btn btn-ghost btn-sm" data-act="drinkMade" data-id="${esc(d.id)}">🍹 Napravio sam</button></div>
      <section class="card">
        <div class="card-head"><h2>${icon('list')} Sastojci</h2><span class="spacer"></span>
          ${hasMl&&!yl?`<div class="seg seg-sm">${['ml','cl','oz'].map(u=>`<button class="${st.unit===u?'on':''}" data-act="dUnit" data-id="${esc(d.id)}" data-v="${u}">${u}</button>`).join('')}</div>`:''}
          <span class="serv">${stepperHTML(st.serv,'dServ',d.id)} <small>${yl?'l':plural(st.serv,'osoba','osobe','osoba')}</small></span></div>
        <div class="card-body">
          <ul class="ing-list">${(d.ing||[]).map(i=>i.t==='h'?`<li class="ing-h">${esc(i.n)}</li>`:`<li class="${i.opt?'opt':''}${bc&&i.k&&!i.opt?(m.bar[i.k]?' have':' need'):''}"><span class="q">${esc(conv(i))}</span><span class="n">${esc(i.n)}${i.opt?' <small>(ukras / po želji)</small>':''}</span>${bc&&i.k&&!i.opt?`<span class="bar-dot" title="${m.bar[i.k]?'Imaš doma':'Nemaš'}"></span>`:''}</li>`).join('')}</ul>
          <div class="btn-row">
            ${bc&&miss.length?`<button class="btn btn-primary btn-sm" data-act="dShop" data-id="${esc(d.id)}" data-miss="1">${icon('cart')}Fali mi (${miss.length}) → popis</button>`:''}
            <button class="btn btn-ghost btn-sm" data-act="dShop" data-id="${esc(d.id)}">${icon('cart')}Sve na popis za dućan</button>
            ${!bc?`<a class="btn btn-ghost btn-sm" href="#/kokteli/bar">🍾 Označi što imaš</a>`:''}
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-head"><h2>${icon('checklist')} Priprema</h2></div>
        <div class="card-body"><ol class="steps">${stepsOf(d).map((s,i)=>`<li class="${st.st.has(i)?'done':''}" data-act="stepTog" data-id="d:${esc(d.id)}" data-i="${i}"><span class="sn">${i+1}</span><div>${stepHTMLText(s,d.title)}</div></li>`).join('')}</ol></div>
      </section>
      ${d.tips?`<section class="card tip-card"><div class="card-body">💡 <b>Savjet:</b> ${linkify(d.tips)}</div></section>`:''}
      <section class="card"><div class="card-head"><h2>${icon('note')} Moja bilješka</h2></div>
        <div class="card-body"><textarea class="input grow" data-bind="state" data-path="drinks.note.${esc(d.id)}" placeholder="npr. s 40 ml gina je bolji, koristiti Hendrick's…">${esc(m.note[d.id]||'')}</textarea></div></section>
    </div>
  </div>`;
}
function viewBar(){
  const m=dm();const bar=m.bar;const all=allDrinks();const can=all.filter(d=>drinkReq(d).length&&!drinkMissing(d).length);
  const near=all.filter(d=>drinkMissing(d).length===1).map(d=>({d,k:drinkMissing(d)[0]}));
  const used=new Set();all.forEach(d=>drinkReq(d).forEach(i=>used.add(i.k)));
  return`
  <div class="page-head"><div><a class="crumb" href="#/kokteli">${icon('chevL')}Kokteli i napitci</a><h1>🍾 Moj bar</h1><p>Označi što imaš doma — vidjet ćeš što možeš napraviti odmah.</p></div>
    <div class="head-acts"><button class="btn btn-ghost btn-sm" data-act="barAll" data-v="0">Odznači sve</button></div></div>
  <div class="bar-sum">
    <div class="stat"><div class="ico ico-ok">✓</div><div><div class="num">${can.length}</div><div class="lbl">Možeš napraviti</div></div></div>
    <div class="stat"><div class="ico ico-warn">+1</div><div><div class="num">${near.length}</div><div class="lbl">Fali samo 1 sastojak</div></div></div>
    <div class="stat"><div class="ico ico-accent">🍾</div><div><div class="num">${barCount()}</div><div class="lbl">Sastojaka doma</div></div></div>
  </div>
  <div class="bar-grid">
    ${BAR_GROUPS.map(g=>`<section class="card"><div class="card-head"><h2>${esc(g)}</h2></div><div class="card-body bar-chips">
      ${Object.entries(BAR).filter(([k,v])=>v[1]===g&&used.has(k)).map(([k,v])=>`<button class="fchip${bar[k]?' on':''}" data-act="barTog" data-k="${k}">${bar[k]?'✓ ':''}${esc(v[0])}</button>`).join('')}
    </div></section>`).join('')}
  </div>
  ${can.length?`<h2 class="sec-h">✓ Možeš napraviti odmah <small>${can.length}</small></h2><div class="dgrid">${can.map(drinkCard).join('')}</div>`:''}
  ${near.length?`<h2 class="sec-h">Fali samo jedan sastojak <small>${near.length}</small></h2>
    <div class="near-list">${near.map(({d,k})=>`<a class="near" href="#/kokteli/${encodeURIComponent(d.id)}"><span class="near-art">${glassSVG(d)}</span><b>${esc(d.title)}</b><span class="miss">+ ${esc((BAR[k]||[k])[0])}</span></a>`).join('')}</div>`:''}`;
}
function drinkToText(d,f=1){return[d.title,d.desc||'','','SASTOJCI'+(f!==1?` (×${f})`:''),...(d.ing||[]).map(i=>i.t==='h'?'\n'+i.n:`• ${fmtQty(i,f)} ${i.n}`),'','PRIPREMA',...stepsOf(d).map((s,i)=>`${i+1}. ${s}`),d.tips?'\nSavjet: '+d.tips:''].join('\n').trim();}
function openDrinkMenu(id){
  const d=drinkById(id);if(!d)return;
  openSheet({title:esc(d.title),side:true,body:`<div class="sheet-list">
    ${d.builtin?`<button class="row" data-dm="custom">${icon('edit')}Prilagodi recept (napravi svoju verziju)</button>`:`<button class="row" data-dm="edit">${icon('edit')}Uredi</button>`}
    <button class="row" data-dm="copy">${icon('copy')}Kopiraj kao tekst</button>
    <button class="row" data-dm="dup">${icon('layers')}Dupliciraj kao novi napitak</button>
    ${d.custom&&d.base?`<button class="row" data-dm="reset">${icon('refresh')}Vrati originalni recept</button>`:''}
    ${d.custom&&!d.base?`<button class="row" data-dm="del" style="color:var(--urgent)">${icon('trash')}Obriši napitak</button>`:''}</div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-dm]',el).forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.dm;closeSheet();
      if(a==='edit')go('#/kokteli/'+encodeURIComponent(id)+'/edit');
      if(a==='copy')copyText(drinkToText(d,cookSt('d:'+d.id,1).serv/(d.servings||1)));
      if(a==='custom'||a==='dup'){const c=JSON.parse(JSON.stringify(d));delete c.builtin;delete c.custom;delete c.n;
        c.id=uid('dr');c.kind='drink';if(a==='custom')c.base=d.id;else{c.title+=' (kopija)';delete c.base;}
        c.steps=stepsOf(d).map(x=>({id:uid('s'),x}));c.ing=(c.ing||[]).map(i=>Object.assign({id:uid('g'),t:i.t||'i'},i));c.servings=c.servings||1;
        const ph=dm().photo[d.id];if(a==='custom'&&ph){dm().photo[c.id]=ph;delete dm().photo[d.id];saveData();}
        putDoc(c,{now:true});go('#/kokteli/'+c.id+'/edit');toast(a==='custom'?'Tvoja verzija recepta — uredi i spremi':'Kopija napravljena');}
      if(a==='reset')confirmSheet2('Vratiti originalni recept? Tvoje izmjene se brišu.','Vrati original',()=>{delDoc(d.id);go('#/kokteli/'+encodeURIComponent(d.base));});
      if(a==='del')confirmSheet(`Obrisati “${d.title}”?`,()=>{delDoc(d.id);(d.images||[]).forEach(imgDelete);go('#/kokteli');toast('Napitak obrisan',{label:'Poništi',fn:()=>{putDoc(d,{now:true});go('#/kokteli/'+d.id);}});});
    }))});
}

/* ═════════════════════ KUHARICA ═════════════════════ */
const RCATS=['Doručak','Predjelo','Juha i varivo','Glavno jelo','Meso','Riba','Tjestenina','Prilog','Salata','Pizza i peciva','Kolači i deserti','Zimnica','Roštilj','Napitci','Ostalo'];
const DIFF={lako:'Lako',srednje:'Srednje',zahtjevno:'Zahtjevno'};
function recipes(){return docsOf('recipe');}
function recipeCats(){const s=new Set();recipes().forEach(r=>r.cat&&s.add(r.cat));return[...s].sort((a,b)=>RCATS.indexOf(a)-RCATS.indexOf(b)||a.localeCompare(b,'hr'));}
function rTotal(r){return(+r.prep||0)+(+r.cook||0);}
function recipeCard(r){
  const t=rTotal(r);
  return`<a class="rcard" href="#/kuharica/${encodeURIComponent(r.id)}">
    <div class="rcard-img" style="--h:${hueOf(r.cat||r.title)}">${r.cover?imgTag(r.cover):`<span class="remo">${esc(r.emoji||'🍽️')}</span>`}</div>
    <button class="fav-btn${r.fav?' on':''}" data-act="recFav" data-id="${esc(r.id)}" aria-label="Favorit">${icon(r.fav?'star':'starO')}</button>
    <div class="rcard-body"><small class="rcat">${esc(r.cat||'Recept')}</small><b>${esc(r.title||'Bez naslova')}</b>
      <div class="dmeta">${t?`<span>${icon('clock')}${esc(fmtMin(t))}</span>`:''}${r.servings?`<span>👥 ${esc(r.servings)}</span>`:''}${r.rating?`<span class="stars-mini">${'★'.repeat(r.rating)}</span>`:''}${r.made?`<span>🍳 ${r.made}×</span>`:''}</div></div>
  </a>`;
}
function viewKuharica(r){
  if(r.id==='new'||r.sub==='edit')return viewRecipeEdit(r,'recipe');
  if(r.id)return viewRecipe(r.id);
  const all=recipes();const q=KUI.rq.trim().toLowerCase();const cats=recipeCats();
  if(KUI.rcat&&!cats.includes(KUI.rcat))KUI.rcat='';
  let list=all.filter(x=>(!KUI.rcat||x.cat===KUI.rcat)&&(!KUI.rfav||x.fav));
  if(q)list=list.filter(x=>[x.title,x.cat,(x.tags||[]).join(' '),(x.ing||[]).map(i=>i.n).join(' '),x.notes].join(' ').toLowerCase().includes(q));
  const S={recent:(a,b)=>(b.updated||0)-(a.updated||0),az:(a,b)=>(a.title||'').localeCompare(b.title||'','hr'),made:(a,b)=>(b.made||0)-(a.made||0),rating:(a,b)=>(b.rating||0)-(a.rating||0),quick:(a,b)=>(rTotal(a)||999)-(rTotal(b)||999)};
  list.sort(S[KUI.rsort]||S.recent);
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>🍳 Kuharica</h1><p>${all.length} ${plural(all.length,'recept','recepta','recepata')} · tvoja osobna kuharica sa slikama.</p></div>
    <div class="head-acts"><a class="btn btn-outline" href="#/kuharica/new?import=1">${icon('wand')}Zalijepi recept</a><a class="btn btn-primary" href="#/kuharica/new">${icon('plus')}Novi recept</a></div></div>
  ${!docsLoaded&&!all.length?`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam recepte…</div>`:!all.length?`
  <section class="card hero-empty"><div><span class="big">👩‍🍳</span><h2>Kuharica je prazna</h2><p>Dodaj prvi recept — upiši ga, zalijepi tekst s weba ili iz poruke (sastojci i koraci se sami prepoznaju), dodaj slike s mobitela.</p>
    <div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="#/kuharica/new">${icon('plus')}Novi recept</a><a class="btn btn-outline" href="#/kuharica/new?import=1">${icon('wand')}Zalijepi recept</a></div></div></section>`:`
  <div class="list-tools" style="margin-top:0">
    <label class="searchbox">${icon('search')}<input class="input" data-fk="rsearch" data-input="rSearch" value="${esc(KUI.rq)}" placeholder="Pretraži recepte, sastojke, oznake…"></label>
    <span class="spacer"></span>
    <button class="fchip${KUI.rfav?' on':''}" data-act="rFav">★ Favoriti</button>
    <select class="input sel-sm" data-change="rSort" aria-label="Sortiraj">${[['recent','Nedavno'],['az','A–Ž'],['made','Najčešće kuhano'],['rating','Ocjena'],['quick','Najbrže']].map(([k,l])=>`<option value="${k}" ${KUI.rsort===k?'selected':''}>${l}</option>`).join('')}</select>
  </div>
  <div class="chips-row">${[['','Sve',all.length],...cats.map(c=>[c,c,all.filter(x=>x.cat===c).length])].map(([k,l,n])=>`<button class="fchip${KUI.rcat===k?' on':''}" data-act="rCat" data-v="${esc(k)}">${esc(l)} <small>${n}</small></button>`).join('')}</div>
  <div class="rgrid">${list.length?list.map(recipeCard).join(''):`<div class="card empty" style="grid-column:1/-1;padding:36px"><span class="big">🔍</span>Ništa ne odgovara pretrazi.</div>`}</div>`}`;
}
function viewRecipe(id){
  const r=docById(id);if(!r||r.kind!=='recipe')return docsLoaded?`<div class="card empty" style="padding:40px"><span class="big">🤷</span>Recept nije pronađen. <a class="link-btn" href="#/kuharica">Natrag</a></div>`:`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam…</div>`;
  const st=cookSt(r.id,r.servings||4);const f=r.servings?st.serv/r.servings:1;const steps=stepsOf(r);const t=rTotal(r);
  const imgs=[...(r.cover&&!(r.images||[]).includes(r.cover)?[r.cover]:[]),...(r.images||[])];
  return`
  <div class="page-head"><div style="min-width:0"><a class="crumb" href="#/kuharica">${icon('chevL')}Kuharica</a>
    <h1>${r.emoji?`<span class="emo">${esc(r.emoji)}</span>`:''}${esc(r.title||'Bez naslova')}</h1></div>
    <div class="head-acts">
      <button class="ibtn big${r.fav?' fav-on':''}" data-act="recFav" data-id="${esc(r.id)}" title="Favorit">${icon(r.fav?'star':'starO')}</button>
      <a class="btn btn-outline btn-sm" href="#/kuharica/${encodeURIComponent(r.id)}/edit">${icon('edit')}Uredi</a>
      <button class="ibtn big" data-act="recMenu" data-id="${esc(r.id)}" title="Opcije">${icon('more')}</button></div></div>
  <section class="rhero" style="--h:${hueOf(r.cat||r.title)}">
    ${r.cover?`<button class="rhero-img" data-act="lightbox" data-ids="${esc(imgs.join(','))}" data-i="0">${imgTag(r.cover,{thumb:false})}</button>`:`<div class="rhero-ph"><span>${esc(r.emoji||'🍽️')}</span>${fileBtn('recCoverUp',r.id,{label:'Dodaj naslovnu sliku',multiple:false,cls:'btn btn-ghost btn-sm'})}</div>`}
    <div class="facts">
      ${r.cat?`<div><small>Kategorija</small><b>${esc(r.cat)}</b></div>`:''}
      ${r.prep?`<div><small>Priprema</small><b>${esc(fmtMin(r.prep))}</b></div>`:''}
      ${r.cook?`<div><small>Kuhanje / pečenje</small><b>${esc(fmtMin(r.cook))}</b></div>`:''}
      ${t?`<div><small>Ukupno</small><b>${esc(fmtMin(t))}</b></div>`:''}
      ${r.diff?`<div><small>Težina</small><b>${esc(DIFF[r.diff]||r.diff)}</b></div>`:''}
    </div>
  </section>
  <div class="rate-row">${starsHTML(r.rating,'recRate',r.id)}<span class="made">${r.made?`Skuhano ${r.made}×${r.lastMade?' · zadnji put '+new Date(r.lastMade).toLocaleDateString('hr-HR'):''}`:''}</span>
    ${(r.tags||[]).map(x=>`<span class="pill">#${esc(x)}</span>`).join('')}
    <span class="spacer"></span>
    ${steps.length?`<button class="btn btn-week btn-sm" data-act="cookMode" data-id="${esc(r.id)}">${icon('play')}Kuhaj korak po korak</button>`:''}
    <button class="btn btn-ghost btn-sm" data-act="recMade" data-id="${esc(r.id)}">🍳 Skuhao sam</button></div>
  <div class="rgrid2">
    <section class="card ing-card">
      <div class="card-head"><h2>${icon('list')} Sastojci</h2><span class="spacer"></span>${r.servings?`<span class="serv">${stepperHTML(st.serv,'rServ',r.id)} <small>${plural(st.serv,'porcija','porcije','porcija')}</small></span>`:''}</div>
      <div class="card-body">
        ${(r.ing||[]).length?`<ul class="ing-list checkable">${(r.ing||[]).map(i=>i.t==='h'?`<li class="ing-h">${esc(i.n)}</li>`:`<li class="${st.ing.has(i.id)?'done':''}" data-act="ingTog" data-id="${esc(r.id)}" data-g="${esc(i.id)}"><span class="cbx">${icon('check')}</span><span class="q">${esc(fmtQty(i,f))}</span><span class="n">${linkify(i.n)}</span></li>`).join('')}</ul>
        <div class="btn-row"><button class="btn btn-ghost btn-sm" data-act="rShop" data-id="${esc(r.id)}">${icon('cart')}${st.ing.size?'Neoznačeno':'Sve'} na popis za dućan</button></div>`:`<div class="empty">Nema sastojaka. <a class="link-btn" href="#/kuharica/${encodeURIComponent(r.id)}/edit">Dodaj</a></div>`}
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>${icon('checklist')} Priprema</h2><span class="spacer"></span>${steps.length?`<small style="color:var(--text-3);font-weight:700">${st.st.size}/${steps.length}</small>`:''}</div>
      <div class="card-body">${steps.length?`<ol class="steps">${steps.map((s,i)=>`<li class="${st.st.has(i)?'done':''}" data-act="stepTog" data-id="${esc(r.id)}" data-i="${i}"><span class="sn">${i+1}</span><div>${stepHTMLText(s,r.title)}</div></li>`).join('')}</ol>`:`<div class="empty">Nema koraka.</div>`}</div>
    </section>
  </div>
  ${r.notes?`<section class="card tip-card"><div class="card-body" style="white-space:pre-line">📝 ${linkify(r.notes)}</div></section>`:''}
  ${(r.links||[]).length||r.source?`<section class="card"><div class="card-head"><h2>${icon('link')} Linkovi i izvor</h2></div><div class="card-body links-list">
    ${r.source?`<a class="lnk" href="${esc(safeUrl(r.source))}" target="_blank" rel="noopener">${icon('ext')}<span><b>Izvor recepta</b><small>${esc(tryDomain(safeUrl(r.source)))}</small></span></a>`:''}
    ${(r.links||[]).map(l=>`<a class="lnk" href="${esc(safeUrl(l.u))}" target="_blank" rel="noopener">${icon('link')}<span><b>${esc(l.t||tryDomain(safeUrl(l.u)))}</b><small>${esc(tryDomain(safeUrl(l.u)))}</small></span></a>`).join('')}</div></section>`:''}
  <section class="card"><div class="card-head"><h2>${icon('image')} Slike <small style="color:var(--text-3)">${imgs.length||''}</small></h2></div>
    <div class="card-body">${galleryHTML(imgs,{act:'recImg',id:r.id,cover:r.cover})}</div></section>
  <div class="foot-meta">Dodano ${new Date(r.created||Date.now()).toLocaleDateString('hr-HR')} · zadnja izmjena ${new Date(r.updated||Date.now()).toLocaleString('hr-HR',{dateStyle:'short',timeStyle:'short'})}</div>`;
}
function recipeToText(r,f=1){
  return[(r.emoji?r.emoji+' ':'')+r.title,[r.cat,r.servings?`${Math.round(r.servings*f)} porcija`:'',rTotal(r)?fmtMin(rTotal(r)):''].filter(Boolean).join(' · '),'',
    'SASTOJCI',...(r.ing||[]).map(i=>i.t==='h'?'\n'+i.n.toUpperCase():`• ${[fmtQty(i,f),i.n].filter(Boolean).join(' ')}`),'',
    'PRIPREMA',...stepsOf(r).map((s,i)=>`${i+1}. ${s}`),r.notes?'\nBILJEŠKE\n'+r.notes:'',r.source?'\nIzvor: '+r.source:''].join('\n').trim();
}
function openRecMenu(id){
  const r=docById(id);if(!r)return;
  openSheet({title:esc(r.title||'Recept'),side:true,body:`<div class="sheet-list">
    <a class="row" href="#/kuharica/${encodeURIComponent(r.id)}/edit" data-close>${icon('edit')}Uredi</a>
    <button class="row" data-rm="copy">${icon('copy')}Kopiraj kao tekst (za poruku)</button>
    <button class="row" data-rm="share">${icon('ext')}Podijeli…</button>
    <button class="row" data-rm="todo">${icon('pin')}Planiraj za danas (To Do)</button>
    <button class="row" data-rm="dup">${icon('layers')}Dupliciraj</button>
    <button class="row" data-rm="print">${icon('note')}Ispiši</button>
    <button class="row" data-rm="del" style="color:var(--urgent)">${icon('trash')}Obriši recept</button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-rm]',el).forEach(b=>b.addEventListener('click',async()=>{
      const a=b.dataset.rm;const f=r.servings?cookSt(r.id,r.servings).serv/r.servings:1;closeSheet();
      if(a==='copy')copyText(recipeToText(r,f));
      if(a==='share'){try{await navigator.share({title:r.title,text:recipeToText(r,f)});}catch(e){if(e.name!=='AbortError')copyText(recipeToText(r,f));}}
      if(a==='todo'){placeOnDate(today(),'🍳 Skuhati: '+r.title,{note:location.origin+location.pathname+'#/kuharica/'+r.id});saveData();toast('Dodano za danas',{label:'Prikaži',fn:()=>go('#/')});}
      if(a==='dup'){const c=JSON.parse(JSON.stringify(r));c.id=uid('r');c.title+=' (kopija)';c.made=0;c.created=0;putDoc(c,{now:true});go('#/kuharica/'+c.id);}
      if(a==='print')setTimeout(()=>window.print(),200);
      if(a==='del')confirmSheet(`Obrisati recept “${r.title}”?`,()=>{delDoc(r.id);go('#/kuharica');toast('Recept obrisan',{label:'Poništi',fn:()=>{putDoc(r,{now:true});go('#/kuharica/'+r.id);}});
        setTimeout(()=>{if(!docById(r.id))[r.cover,...(r.images||[])].filter(Boolean).forEach(imgDelete);},7000);});
    }))});
}

/* ───────── NAČIN KUHANJA (cijeli zaslon, korak po korak) ───────── */
let wakeLock=null;
async function cookMode(id){
  const r=docById(id);if(!r)return;const steps=stepsOf(r);if(!steps.length)return;
  const st=cookSt(r.id,r.servings||4);const f=r.servings?st.serv/r.servings:1;
  let i=Math.min(st.st.size,steps.length-1);let showIng=false;
  const box=document.createElement('div');box.className='cook';
  try{if(navigator.wakeLock)wakeLock=await navigator.wakeLock.request('screen');}catch(e){}
  const paint=()=>{box.innerHTML=`
    <div class="cook-top"><b>${esc(r.title)}</b><span>${i+1} / ${steps.length}</span><button class="ibtn" data-c="ing">${icon('list')}</button><button class="ibtn" data-c="x" aria-label="Zatvori">${icon('x')}</button></div>
    <div class="cook-prog"><i style="width:${(i+1)/steps.length*100}%"></i></div>
    ${showIng?`<div class="cook-ing"><ul class="ing-list">${(r.ing||[]).map(x=>x.t==='h'?`<li class="ing-h">${esc(x.n)}</li>`:`<li><span class="q">${esc(fmtQty(x,f))}</span><span class="n">${esc(x.n)}</span></li>`).join('')}</ul></div>`:''}
    <div class="cook-step"><div class="cook-n">Korak ${i+1}</div><p>${stepHTMLText(steps[i],r.title)}</p></div>
    <div class="cook-nav"><button class="btn btn-ghost" data-c="prev" ${i?'':'disabled'}>${icon('chevL')}Natrag</button>
      ${i<steps.length-1?`<button class="btn btn-primary" data-c="next">Dalje${icon('chevR')}</button>`:`<button class="btn btn-primary" data-c="done">${icon('check')}Gotovo — dobar tek!</button>`}</div>`;};
  const close=()=>{box.remove();document.removeEventListener('keydown',key,true);try{wakeLock&&wakeLock.release();}catch(e){}wakeLock=null;renderAll();};
  const nav=d=>{if(d>0)st.st.add(i);i=Math.max(0,Math.min(steps.length-1,i+d));paint();};
  const key=e=>{if(e.key==='Escape'){e.stopPropagation();close();}if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();nav(1);}if(e.key==='ArrowLeft')nav(-1);};
  box.addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;const c=b.dataset.c;
    if(c==='x')close();if(c==='next')nav(1);if(c==='prev')nav(-1);if(c==='ing'){showIng=!showIng;paint();}
    if(c==='done'){st.st.add(i);close();confirmSheet2('Zabilježiti da si skuhao/la ovaj recept?','🍳 Da',()=>{r.made=(r.made||0)+1;r.lastMade=Date.now();putDoc(r);renderAll();});}});
  let x0=null;box.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>60)nav(dx<0?1:-1);});
  document.addEventListener('keydown',key,true);document.body.appendChild(box);paint();
}

/* ───────── PAMETNI UVOZ TEKSTA ───────── */
function parseRecipeText(txt){
  const lines=String(txt||'').replace(/\r/g,'').split('\n').map(l=>l.replace(/\s+$/,''));
  const ING_H=/^\s*(?:potrebni\s+)?(sastojci|potrebno|namirnice|ingredients)\b[^a-zčćžšđ]*$/i;
  const STEP_H=/^\s*(priprema|postupak|upute|način pripreme|izrada|preparation|instructions|directions|method)\b[^a-zčćžšđ]*$/i;
  const NOTE_H=/^\s*(napomen[ae]|savjet[i]?|bilješk[ae]|notes?|tips?)\b[^a-zčćžšđ]*$/i;
  const out={title:'',servings:null,prep:null,cook:null,ing:[],steps:[],notes:[],source:''};
  let sec=null,hasH=lines.some(l=>ING_H.test(l)||STEP_H.test(l));
  lines.forEach(raw=>{
    const l=raw.trim();if(!l)return;
    if(!out.source){const u=l.match(/https?:\/\/\S+/);if(u&&l.length<200&&!sec){out.source=u[0];return;}}
    let m=l.match(/(?:za\s+)?(\d+)\s*(?:osob|porcij|komad|serving|people)/i)||l.match(/porcij\w*\s*:?\s*(\d+)/i);if(m&&!out.servings&&l.length<60){out.servings=+m[1];if(!sec)return;}
    m=l.match(/(?:vrijeme\s+)?priprem\w*\s*:?\s*(\d+)\s*(min|h|sat)/i);if(m&&l.length<60){out.prep=m[2].toLowerCase().startsWith('min')?+m[1]:+m[1]*60;return;}
    m=l.match(/(?:kuhanj|pečenj|peč)\w*\s*:?\s*(\d+)\s*(min|h|sat)/i);if(m&&l.length<60&&sec!=='steps'){out.cook=m[2].toLowerCase().startsWith('min')?+m[1]:+m[1]*60;return;}
    if(ING_H.test(l)){sec='ing';return;}if(STEP_H.test(l)){sec='steps';return;}if(NOTE_H.test(l)){sec='notes';return;}
    if(!out.title&&!sec){out.title=l.replace(/^#+\s*/,'').slice(0,90);return;}
    let s=sec;
    if(!hasH){const ing=parseIngLine(l);s=(ing&&ing.q!=null&&l.length<70)||(/^[-*•]\s/.test(l)&&l.length<60)?'ing':'steps';}
    if(s==='ing'){const it=parseIngLine(l);if(it)out.ing.push(it);}
    else if(s==='notes')out.notes.push(l);
    else if(s==='steps'||!s)out.steps.push(l.replace(/^\s*(?:\d+\s*[.)]|korak\s*\d+\s*[:.)-]?|[-*•])\s*/i,''));
  });
  return out;
}

/* ───────── UREĐIVANJE RECEPTA / NAPITKA ───────── */
let draft=null;      // {doc, isNew, newImgs:[]}
function linksToText(ls){return(ls||[]).map(l=>l.t&&l.t!==l.u?`${l.t} | ${l.u}`:l.u).join('\n');}
function textToLinks(t){return String(t||'').split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const p=x.split('|');const u=(p.length>1?p.slice(1).join('|'):p[0]).trim();return{id:uid('l'),t:p.length>1?p[0].trim():'',u};});}
function ingToTextAll(ing){return(ing||[]).map(ingToText).join('\n');}
function stepsToText(st){return stepsOf({steps:st}).join('\n\n');}
function textToSteps(t){t=String(t||'').replace(/\r/g,'').trim();if(!t)return[];
  const parts=/\n\s*\n/.test(t)?t.split(/\n\s*\n/):t.split('\n');
  return parts.map(x=>x.replace(/^\s*(?:\d+\s*[.)]|korak\s*\d+\s*[:.)-]?)\s*/i,'').trim()).filter(Boolean).map(x=>({id:uid('s'),x}));}
function guessKey(name){const n=name.toLowerCase();let best=null;for(const[k,v]of Object.entries(BAR)){const w=v[0].toLowerCase().split(/[ /(]/)[0];if(w.length>2&&n.includes(w)){best=k;break;}}return best;}
function startDraft(kind,id){
  const ex=id&&id!=='new'?docById(id):null;
  if(draft&&draft.doc.id===(ex?ex.id:draft.doc.id)&&draft.kind===kind&&(ex||draft.isNew))return draft;
  const base=kind==='drink'?{cat:'koktel',glass:'rocks',color:['#f3c470','#b9701e'],garnish:'none',sp:[],servings:1}:{servings:4,cat:''};
  draft={kind,isNew:!ex,newImgs:[],doc:ex?JSON.parse(JSON.stringify(ex)):Object.assign({id:uid(kind==='drink'?'dr':'r'),kind,title:'',emoji:'',images:[],cover:'',ing:[],steps:[],links:[],tags:[]},base)};
  return draft;
}
function viewRecipeEdit(r,kind){
  const isDrink=kind==='drink';const dr=startDraft(kind,r.id==='new'?null:r.id);const d=dr.doc;
  const back=isDrink?(dr.isNew?'#/kokteli':'#/kokteli/'+encodeURIComponent(d.id)):(dr.isNew?'#/kuharica':'#/kuharica/'+encodeURIComponent(d.id));
  const imp=/import=1/.test(location.hash);
  const imgs=[...(d.cover&&!(d.images||[]).includes(d.cover)?[d.cover]:[]),...(d.images||[])];
  return`
  <div class="page-head"><div><a class="crumb" href="${back}">${icon('chevL')}${isDrink?'Kokteli i napitci':'Kuharica'}</a><h1>${dr.isNew?(isDrink?'Novi napitak':'Novi recept'):'Uredi'}${d.base?' <small class="pill">tvoja verzija</small>':''}</h1></div>
    <div class="head-acts"><a class="btn btn-ghost" href="${back}" data-act="draftCancel">Odustani</a><button class="btn btn-primary" data-act="draftSave">${icon('check')}Spremi</button></div></div>
  <details class="card import-box" ${imp?'open':''}>
    <summary>${icon('wand')}<b>Zalijepi cijeli recept</b><small>tekst s weba, iz poruke ili bilješke — sastojci i koraci se sami raspodijele</small></summary>
    <div class="card-body"><textarea class="input" id="impText" rows="7" placeholder="Palačinke&#10;Za 4 osobe&#10;&#10;Sastojci:&#10;250 g brašna&#10;3 jaja&#10;500 ml mlijeka&#10;prstohvat soli&#10;&#10;Priprema:&#10;1. Sve sastojke izmiješaj u glatko tijesto.&#10;2. Ostavi 20 min da odstoji.&#10;3. Peci na vrućoj tavi."></textarea>
      <div class="btn-row"><button class="btn btn-week btn-sm" data-act="draftImport">${icon('wand')}Raspodijeli u polja</button><small style="color:var(--text-3)">Ništa se ne sprema dok ne klikneš Spremi.</small></div></div>
  </details>
  <div class="edit-grid">
    <section class="card"><div class="card-body form-stack">
      <div class="grid2" style="grid-template-columns:76px 1fr">
        <div class="field"><label for="e_emoji">Ikona</label><input id="e_emoji" value="${esc(d.emoji||'')}" maxlength="4" placeholder="${isDrink?'🍹':'🍲'}" style="text-align:center;font-size:1.3rem"></div>
        <div class="field"><label for="e_title">Naziv</label><input id="e_title" value="${esc(d.title||'')}" placeholder="${isDrink?'npr. Bazga spritz':'npr. Bakina sarma'}" maxlength="100"></div>
      </div>
      ${isDrink?`
      <div class="grid2">
        <div class="field"><label for="e_cat">Vrsta</label><select id="e_cat">${Object.entries(DCAT).map(([k,l])=>`<option value="${k}" ${d.cat===k?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label for="e_glass">Čaša</label><select id="e_glass">${[['wine','Vinska'],['balloon','Balon (gin)'],['flute','Flûte'],['martini','Martini'],['coupe','Coupe'],['highball','Visoka'],['rocks','Niska'],['copper','Bakrena šalica'],['mug','Šalica'],['irish','Staklena šalica'],['bottle','Boca']].map(([k,l])=>`<option value="${k}" ${d.glass===k?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label for="e_abv">Alkohol</label><input id="e_abv" value="${esc(d.abv||'')}" placeholder="~12%"></div>
        <div class="field"><label for="e_time">Vrijeme (min)</label><input id="e_time" inputmode="numeric" value="${esc(d.time||'')}" placeholder="3"></div>
        <div class="field"><label for="e_taste">Okus</label><input id="e_taste" value="${esc(d.taste||'')}" placeholder="voćni, svjež"></div>
        <div class="field"><label>Boja napitka</label><div style="display:flex;gap:8px;align-items:center"><input type="color" id="e_c1" value="${esc(d.color[0])}"><input type="color" id="e_c2" value="${esc(d.color[1])}"><span class="mini-glass">${glassSVG(d)}</span></div></div>
        <div class="field full"><label for="e_desc">Kratki opis</label><input id="e_desc" value="${esc(d.desc||'')}" placeholder="Jednom rečenicom…"></div>
        <div class="field full"><label>Osnova</label><div class="chips-row" id="e_sp" style="margin:0">${SPIRITS.map(([k,l])=>`<button type="button" class="fchip${(d.sp||[]).includes(k)?' on':''}" data-v="${k}">${esc(l)}</button>`).join('')}</div></div>
      </div>`:`
      <div class="grid2">
        <div class="field"><label for="e_cat">Kategorija</label><input id="e_cat" list="rcats" value="${esc(d.cat||'')}" placeholder="Glavno jelo"><datalist id="rcats">${[...new Set([...RCATS,...recipeCats()])].map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
        <div class="field"><label for="e_tags">Oznake</label><input id="e_tags" value="${esc((d.tags||[]).join(', '))}" placeholder="brzo, vege, blagdani"></div>
        <div class="field"><label for="e_serv">Porcije</label><input id="e_serv" inputmode="numeric" value="${esc(d.servings||'')}" placeholder="4"></div>
        <div class="field"><label for="e_diff">Težina</label><select id="e_diff"><option value="">—</option>${Object.entries(DIFF).map(([k,l])=>`<option value="${k}" ${d.diff===k?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label for="e_prep">Priprema (min)</label><input id="e_prep" inputmode="numeric" value="${esc(d.prep||'')}" placeholder="20"></div>
        <div class="field"><label for="e_cook">Kuhanje / pečenje (min)</label><input id="e_cook" inputmode="numeric" value="${esc(d.cook||'')}" placeholder="45"></div>
      </div>`}
      <div class="field"><label for="e_ing">Sastojci <small>— jedan po retku · <code># Za tijesto</code> za podnaslov · količine se same prepoznaju za skaliranje</small></label>
        <textarea id="e_ing" class="mono" rows="9" placeholder="500 g mljevenog mesa&#10;1 glavica luka&#10;2–3 režnja češnjaka&#10;1 žličica soli&#10;# Umak&#10;400 ml pasirane rajčice">${esc(ingToTextAll(d.ing))}</textarea></div>
      <div class="field"><label for="e_steps">${isDrink?'Priprema':'Priprema'} <small>— svaki korak u novi redak (ili odvoji praznim retkom). Vremena poput “20 min” postaju timeri.</small></label>
        <textarea id="e_steps" rows="9" placeholder="Luk nasjeckaj i prodinstaj 5 min.&#10;Dodaj meso i peci dok ne porumeni.">${esc(stepsToText(d.steps))}</textarea></div>
      <div class="field"><label for="e_notes">${isDrink?'Savjet':'Bilješke i savjeti'}</label><textarea id="e_notes" rows="3" placeholder="${isDrink?'Varijacije, trikovi…':'Što promijeniti idući put, s čim poslužiti…'}">${esc(isDrink?(d.tips||''):(d.notes||''))}</textarea></div>
      ${isDrink?'':`<div class="grid2"><div class="field"><label for="e_src">Izvor (link)</label><input id="e_src" type="url" value="${esc(d.source||'')}" placeholder="https://…"></div>
        <div class="field"><label for="e_links">Ostali linkovi <small>(naziv | url, jedan po retku)</small></label><textarea id="e_links" rows="2" placeholder="Video | https://youtube.com/…">${esc(linksToText(d.links))}</textarea></div></div>`}
    </div></section>
    <section class="card"><div class="card-head"><h2>${icon('image')} Slike</h2><span class="spacer"></span><small style="color:var(--text-3)">★ = naslovna</small></div>
      <div class="card-body">${galleryHTML(imgs,{act:'draftImg',id:d.id,cover:d.cover})}
        <p class="hint">Fotografiraj mobitelom, povuci datoteke ili zalijepi (Ctrl+V). Slike se same smanje (≈200–500 KB).</p></div></section>
  </div>`;
}
function readDraftForm(){
  const el=$('#view');const d=draft.doc;const v=s=>{const x=$(s,el);return x?x.value.trim():'';};
  d.title=v('#e_title')||(draft.kind==='drink'?'Novi napitak':'Novi recept');d.emoji=v('#e_emoji');
  d.ing=v('#e_ing').split('\n').map(parseIngLine).filter(Boolean);
  d.steps=textToSteps($('#e_steps',el).value);
  if(draft.kind==='drink'){
    d.cat=v('#e_cat')||'koktel';d.glass=v('#e_glass');d.abv=v('#e_abv');d.time=parseNum(v('#e_time'))||'';d.taste=v('#e_taste');d.desc=v('#e_desc');
    d.color=[$('#e_c1',el).value,$('#e_c2',el).value];d.tips=v('#e_notes');d.sp=$$('#e_sp .fchip.on',el).map(b=>b.dataset.v);d.servings=d.servings||1;
    d.ing.forEach(i=>{if(i.t==='i'&&!i.k){i.k=guessKey(i.n);if(/^led\b|ukras|korica/i.test(i.n))i.opt=1;}});
    d.hot=d.cat==='topli'?1:0;
  }else{
    d.cat=v('#e_cat');d.tags=v('#e_tags').split(',').map(x=>x.trim().replace(/^#/,'')).filter(Boolean);d.servings=parseNum(v('#e_serv'))||null;d.diff=v('#e_diff');
    d.prep=parseNum(v('#e_prep'))||'';d.cook=parseNum(v('#e_cook'))||'';d.notes=v('#e_notes');d.source=v('#e_src');d.links=textToLinks(v('#e_links'));
    if(!d.emoji)d.emoji={'Doručak':'🍳','Juha i varivo':'🍲','Glavno jelo':'🍽️','Meso':'🥩','Riba':'🐟','Tjestenina':'🍝','Salata':'🥗','Pizza i peciva':'🍕','Kolači i deserti':'🍰','Zimnica':'🫙','Roštilj':'🔥','Napitci':'🥤','Prilog':'🥔','Predjelo':'🧀'}[d.cat]||'';
  }
  return d;
}
function draftSave(){
  if(!draft)return;const d=readDraftForm();const kind=draft.kind;
  if(!d.cover&&(d.images||[]).length)d.cover=d.images[0];
  if(kind==='recipe'&&d.servings){const c=COOK[d.id];if(c)c.serv=d.servings;}
  putDoc(d,{now:true});draft=null;
  go(kind==='drink'?'#/kokteli/'+encodeURIComponent(d.id):'#/kuharica/'+encodeURIComponent(d.id));toast('Spremljeno ✓');
}

/* ───────── AKCIJE ───────── */
Object.assign(ACT,{
  dTab:el=>{KUI.dtab=el.dataset.v;lsSet('planner.dtab',KUI.dtab);renderAll();},
  dSp:el=>{KUI.dsp=KUI.dsp===el.dataset.v?'':el.dataset.v;renderAll();},
  dCan:()=>{KUI.dcan=!KUI.dcan;renderAll();},
  drinkFav:(el,e)=>{e.preventDefault();e.stopPropagation();const m=dm();m.fav[el.dataset.id]=!m.fav[el.dataset.id];if(!m.fav[el.dataset.id])delete m.fav[el.dataset.id];vibrate(8);saveData();renderAll();},
  drinkRate:el=>{const m=dm();const v=+el.dataset.v;m.rate[el.dataset.id]=m.rate[el.dataset.id]===v?0:v;saveData();renderAll();},
  drinkMade:el=>{const m=dm();m.made[el.dataset.id]=(m.made[el.dataset.id]||0)+1;saveData();renderAll();toast('Živjeli! 🥂');},
  drinkMenu:el=>openDrinkMenu(el.dataset.id),
  drinkPhotoDel:el=>{const m=dm();const old=m.photo[el.dataset.id];delete m.photo[el.dataset.id];saveData();renderAll();toast('Fotka uklonjena',{label:'Poništi',fn:()=>{m.photo[el.dataset.id]=old;saveData();renderAll();}});setTimeout(()=>{if(!dm().photo[el.dataset.id])imgDelete(old);},7000);},
  dServ:el=>{const d=drinkById(el.dataset.id);const st=cookSt('d:'+el.dataset.id,1);st.serv=Math.max(1,st.serv+ +el.dataset.d);renderAll();},
  dUnit:el=>{cookSt('d:'+el.dataset.id,1).unit=el.dataset.v;renderAll();},
  dShop:el=>{const d=drinkById(el.dataset.id);if(!d)return;const st=cookSt('d:'+d.id,1);const f=st.serv/(d.servings||1);
    const list=(el.dataset.miss?drinkMissing(d):(d.ing||[]).filter(i=>i.t!=='h'&&!i.opt&&i.k));addToShoppingNote(list.map(i=>el.dataset.miss?(BAR[i.k]||[i.n])[0]:[fmtQty(i,f),i.n].filter(Boolean).join(' ')));},
  barTog:el=>{const m=dm();const k=el.dataset.k;if(m.bar[k])delete m.bar[k];else m.bar[k]=true;vibrate(6);saveData();renderAll();},
  barAll:()=>confirmSheet2('Odznačiti sve sastojke u baru?','Odznači',()=>{dm().bar={};saveData();renderAll();}),
  stepTog:(el,e)=>{if(e.target.closest('a,.tchip'))return;const id=el.dataset.id;const st=COOK[id]||cookSt(id,1);const i=+el.dataset.i;if(st.st.has(i))st.st.delete(i);else st.st.add(i);el.classList.toggle('done');vibrate(6);},
  ingTog:(el,e)=>{if(e.target.closest('a'))return;const st=cookSt(el.dataset.id,1);const g=el.dataset.g;if(st.ing.has(g))st.ing.delete(g);else st.ing.add(g);el.classList.toggle('done');vibrate(6);
    const b=$('[data-act="rShop"]');if(b)b.lastChild.textContent=(st.ing.size?'Neoznačeno':'Sve')+' na popis za dućan';},
  timerStart:(el,e)=>{e.stopPropagation();timerStart(+el.dataset.sec,el.dataset.label);toast('⏱ Timer pokrenut: '+el.dataset.label.split(' · ').pop());},
  timerStop:el=>{const i=TIMERS.findIndex(t=>t.id===el.dataset.id);if(i>=0)TIMERS.splice(i,1);paintTimers();},
  lightbox:(el,e)=>{e.preventDefault();openLightbox(el.dataset.ids.split(','),+el.dataset.i||0);},
  rCat:el=>{KUI.rcat=el.dataset.v;renderAll();},
  rFav:()=>{KUI.rfav=!KUI.rfav;renderAll();},
  recFav:(el,e)=>{e.preventDefault();e.stopPropagation();const r=docById(el.dataset.id);if(!r)return;r.fav=!r.fav;vibrate(8);putDoc(r);renderAll();},
  recRate:el=>{const r=docById(el.dataset.id);if(!r)return;const v=+el.dataset.v;r.rating=r.rating===v?0:v;putDoc(r);renderAll();},
  recMade:el=>{const r=docById(el.dataset.id);if(!r)return;r.made=(r.made||0)+1;r.lastMade=Date.now();putDoc(r);renderAll();toast('Dobar tek! 🍽️');},
  recMenu:el=>openRecMenu(el.dataset.id),
  rServ:el=>{const r=docById(el.dataset.id);const st=cookSt(el.dataset.id,(r&&r.servings)||4);st.serv=Math.max(1,st.serv+ +el.dataset.d);renderAll();},
  rShop:el=>{const r=docById(el.dataset.id);if(!r)return;const st=cookSt(r.id,r.servings||4);const f=r.servings?st.serv/r.servings:1;
    addToShoppingNote((r.ing||[]).filter(i=>i.t!=='h'&&!st.ing.has(i.id)).map(i=>[fmtQty(i,f),i.n].filter(Boolean).join(' ')));},
  cookMode:el=>cookMode(el.dataset.id),
  draftSave:()=>draftSave(),
  draftCancel:()=>{if(draft&&draft.isNew)draft.newImgs.forEach(imgDelete);draft=null;},
  draftImport:()=>{
    const t=$('#impText').value;if(!t.trim()){$('#impText').focus();return;}const p=parseRecipeText(t);const el=$('#view');
    const set=(s,v)=>{const x=$(s,el);if(x&&v!=null&&v!=='')x.value=v;};
    set('#e_title',p.title);set('#e_serv',p.servings);set('#e_prep',p.prep);set('#e_cook',p.cook);set('#e_src',p.source);
    if(p.ing.length)$('#e_ing',el).value=ingToTextAll(p.ing);if(p.steps.length)$('#e_steps',el).value=p.steps.join('\n');if(p.notes.length)$('#e_notes',el).value=p.notes.join('\n');
    $('.import-box').open=false;toast(`Prepoznato: ${p.ing.length} sastojaka, ${p.steps.length} koraka — provjeri i spremi`,{ms:4500});
    $('#e_title',el).scrollIntoView({behavior:'smooth',block:'center'});},
  draftImgCover:el=>{readDraftForm();draft.doc.cover=el.dataset.img;renderAll();},
  draftImgDel:el=>{readDraftForm();const d=draft.doc;const im=el.dataset.img;d.images=(d.images||[]).filter(x=>x!==im);if(d.cover===im)d.cover=d.images[0]||'';if(draft.newImgs.includes(im))imgDelete(im);renderAll();},
  recImgCover:el=>{const r=docById(el.dataset.id);if(!r)return;r.cover=el.dataset.img;putDoc(r);renderAll();},
  recImgDel:el=>{const r=docById(el.dataset.id);if(!r)return;const im=el.dataset.img;confirmSheet('Obrisati ovu sliku?',()=>{r.images=(r.images||[]).filter(x=>x!==im);if(r.cover===im)r.cover=r.images[0]||'';putDoc(r);imgDelete(im);renderAll();});},
});
// upload handleri
FILE_ACT.draftImg=async files=>{readDraftForm();const d=draft.doc;await imgUploadMany(files,id=>{d.images=[...(d.images||[]),id];draft.newImgs.push(id);if(!d.cover)d.cover=id;});renderAll();};
FILE_ACT.recImg=async(files,el)=>{const r=docById(el.dataset.id);if(!r)return;await imgUploadMany(files,id=>{r.images=[...(r.images||[]),id];if(!r.cover)r.cover=id;});putDoc(r);renderAll();};
FILE_ACT.recCoverUp=FILE_ACT.recImg;
FILE_ACT.drinkPhoto=async(files,el)=>{const id=el.dataset.id;const[im]=await imgUploadMany(files.slice(0,1));if(!im)return;const m=dm();const old=m.photo[id];m.photo[id]=im;saveData();if(old)imgDelete(old);renderAll();};
VIEWS.kokteli={render:viewDrinks,label:'Kokteli i napitci'};
VIEWS.kuharica={render:viewKuharica,label:'Kuharica'};
