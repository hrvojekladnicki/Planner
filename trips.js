'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   IZLETI I PUTOVANJA
   Izlet = zaseban dokument (kind 'trip'):
   • datumi od–do, odredište i smještaj (linkano na Google Maps)
   • plan po danima (kartice s trajanjem → automatski raspored, upozorenja,
     "loše vrijeme" način) + banka ideja, drag & drop između dana
   • pakiranje po osobama, linkovi po kategorijama, troškovi, info, slike, bilješke
   • prijedlozi za izlete = izleti sa statusom "Ideja"
   Uvoz: plan kopiran iz "Špik Winter Trip" artifacta (isti format).
   ═══════════════════════════════════════════════════════════════════════ */
const TT={travel:['🚗','Putovanje',0],sight:['🏛️','Razgledavanje',0],nature:['🌲','Priroda / šetnja',1],snow:['❄️','Snijeg / vani',1],sled:['🛷','Sanjkanje',1],
  water:['🏖️','More / bazen vani',1],food:['🍽️','Hrana / pauza',0],indoor:['🏊','Unutra',0],rest:['💤','Odmor',0],event:['🎟️','Događaj / ulaznice',0]};
const TRIP_ST={idea:['💡','Ideja','low'],plan:['📐','Planiranje','week'],booked:['✅','Rezervirano','ok'],done:['📸','Bilo je','accent']};
const LINK_CATS=['Smještaj','Rezervacije i karte','Aktivnosti','Hrana','Prijevoz','Info i vrijeme','Ostalo'];
const PACK_TPL={
  'Odrasli':['Dokumenti (osobna/putovnica)','Zdravstvena iskaznica / EKZO','Punjač + power bank','Lijekovi','Toaletna torbica','Pidžama','Rezervna odjeća'],
  'Djeca':['Rezervna odjeća (2×)','Pidžama','Omiljena igračka','Grickalice','Bočica za vodu','Kapa / šešir'],
  'Zima':['Skijaške hlače + jakna','Rukavice (2 para)','Kapa + šal','Termo rublje','Čizme za snijeg','Sanjke','Termosica s čajem'],
  'More':['Kupaći','Ručnici za plažu','Krema za sunčanje','Naočale za sunce','Papuče za vodu','Suncobran'],
  'Auto':['Vinjeta / ENC','Prometna + zelena karta','Prva pomoć','Punjač za auto','Deka','Vrećica za smeće'],
};
const TUI={tab:{},list:lsGet('planner.triplist','up'),q:''};
function trips(){return docsOf('trip');}
function tripDays(t){return(t.days||[]);}
function isoD(s){return s?fromInputDate(s):null;}
function fmtRange(t){const a=isoD(t.from),b=isoD(t.to);if(!a)return'Bez datuma';const f=d=>`${d.getDate()}. ${MONTH_NAMES[d.getMonth()]}`;
  if(!b||+a===+b)return`${DAY_SHORT[dayIdx(a)]} ${f(a)} ${a.getFullYear()}.`;return`${f(a)} – ${f(b)} ${b.getFullYear()}.`;}
function nights(t){const a=isoD(t.from),b=isoD(t.to);return a&&b?Math.max(0,Math.round((b-a)/864e5)):0;}
function untilTxt(t){const a=isoD(t.from),b=isoD(t.to)||a;if(!a)return'';const d=Math.round((a-today())/864e5);
  if(d>1)return`za ${d} ${plural(d,'dan','dana','dana')}`;if(d===1)return'sutra';if(d===0||(b&&today()<=b&&today()>=a))return'u tijeku 🎉';return'';}
function mapsQ(q){return'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);}
function mapsDir(from,to,way=[]){return'https://www.google.com/maps/dir/?api=1'+(from?'&origin='+encodeURIComponent(from):'')+'&destination='+encodeURIComponent(to)+(way.length?'&waypoints='+encodeURIComponent(way.slice(0,8).join('|')):'');}
function tToMin(t){if(!t)return 0;const p=String(t).split(':');return(+p[0]||0)*60+(+p[1]||0);}
function tFmt(m){m=Math.round(m);return`${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(((m%60)+60)%60).padStart(2,'0')}`;}
function tHm(m){m=Math.round(m);const h=Math.floor(m/60),mm=m%60;return h?h+' h'+(mm?' '+mm+' min':''):mm+' min';}
function isOutC(c){return!!(TT[c.type]&&TT[c.type][2]);}
function schedule(t,day){
  let cur=tToMin(day.start||'09:00'),run=0,out=0,warns=0;const res={};const late=t.late?tToMin(t.late):null;
  (t.order[day.id]||[]).forEach(id=>{const c=t.cards[id];if(!c)return;const w=[];
    if(c.fixed){const f=tToMin(c.fixed);if(f>cur)cur=f;else if(f<cur)w.push(`Fiksni početak ${c.fixed}, a prethodno završava ${tFmt(cur)}`);}
    const d=Math.max(0,+c.dur||0),s=cur,e=cur+d;
    if(isOutC(c)){run+=d;out+=d;if(run>120)w.push('Više od 2 h vani bez pauze za zagrijavanje');}else run=0;
    if(late!=null&&e>late)w.push(`Završava nakon ${t.late}`);
    if(w.length)warns++;res[id]={s,e,w};cur=e;});
  return{res,start:tToMin(day.start||'09:00'),end:cur,out,warns};
}
function syncDays(t){
  const a=isoD(t.from),b=isoD(t.to)||a;if(!a)return;const want=[];
  for(let d=new Date(a);d<=b&&want.length<31;d=addDays(d,1))want.push(localISO(d));
  const byDate={};(t.days||[]).forEach(d=>{if(d.date)byDate[d.date]=d;});
  const days=want.map((iso,i)=>byDate[iso]||{id:uid('td'),date:iso,title:'',sub:i===0?'Dolazak':i===want.length-1&&want.length>1?'Povratak':'',start:i===0?'10:00':'09:00',bad:false});
  // dani bez datuma (ručni) ostaju na kraju; kartice obrisanih dana idu u ideje
  const keep=new Set(days.map(d=>d.id));(t.days||[]).forEach(d=>{if(!keep.has(d.id)&&!d.date)days.push(d);});
  (t.days||[]).forEach(d=>{if(!days.includes(d)){t.order.ideas=[...(t.order.ideas||[]),...(t.order[d.id]||[])];delete t.order[d.id];}});
  t.days=days;days.forEach(d=>{t.order[d.id]=t.order[d.id]||[];});
}
function dayTitle(d,i){if(d.title)return d.title;if(d.date){const x=fromInputDate(d.date);return`${DAY_NAMES[dayIdx(x)]}, ${x.getDate()}. ${MONTH_NAMES[x.getMonth()]}`;}return`Dan ${i+1}`;}
function normTrip(t){t.days=t.days||[];t.cards=t.cards||{};t.order=t.order||{};t.order.ideas=t.order.ideas||[];t.packing=t.packing||[];t.links=t.links||[];t.costs=t.costs||[];t.info=t.info||[];t.images=t.images||[];return t;}
function newTrip(o={}){
  const t=normTrip(Object.assign({id:uid('tr'),kind:'trip',title:'',emoji:'🧳',status:'plan',from:'',to:'',place:'',base:'',desc:'',who:'',late:'',budget:null,cover:'',notes:''},o));
  if(t.from){syncDays(t);}
  return t;
}
function tripStats(t){
  const all=Object.keys(t.cards||{}).filter(id=>!(t.order.ideas||[]).includes(id));
  const pk=t.packing||[];const pd=pk.filter(p=>p.done).length;
  const cost=(t.costs||[]).reduce((a,c)=>a+(+c.amount||0),0);const paid=(t.costs||[]).filter(c=>c.paid).reduce((a,c)=>a+(+c.amount||0),0);
  return{acts:all.length,ideas:(t.order.ideas||[]).length,pk:pk.length,pd,cost,paid,verify:all.filter(id=>t.cards[id]&&!t.cards[id].verified).length};
}
function tripCard(t){
  const s=tripStats(t);const u=untilTxt(t);
  return`<a class="pcard tcard" href="#/izleti/${encodeURIComponent(t.id)}">
    <div class="pcard-img" style="--h:${hueOf(t.place||t.title)}">${t.cover?imgTag(t.cover):`<span class="remo">${esc(t.emoji||'🧳')}</span>`}<span class="pcard-st">${tripPill(t.status)}</span>${u?`<span class="t-until">${esc(u)}</span>`:''}</div>
    <div class="pcard-body"><small class="rcat">${esc(fmtRange(t))}${nights(t)?` · ${nights(t)} ${plural(nights(t),'noć','noći','noći')}`:''}</small><b>${esc(t.title||'Bez naslova')}</b>
      ${t.place?`<p>📍 ${esc(t.place)}</p>`:t.desc?`<p>${esc(t.desc.slice(0,110))}</p>`:''}
      <div class="dmeta">${s.acts?`<span>🗓️ ${s.acts}</span>`:''}${s.ideas?`<span>💡 ${s.ideas}</span>`:''}${s.pk?`<span>🎒 ${s.pd}/${s.pk}</span>`:''}${s.cost?`<span>${esc(eur(s.cost))}</span>`:''}</div></div>
  </a>`;
}
function tripPill(s){const x=TRIP_ST[s]||TRIP_ST.plan;return`<span class="pill pill-${x[2]}">${x[0]} ${x[1]}</span>`;}
function viewTrips(r){
  if(r.id)return viewTrip(r.id,r.sub);
  const all=trips();const t0=localISO(today());const q=TUI.q.trim().toLowerCase();
  const up=all.filter(t=>t.status!=='idea'&&t.status!=='done'&&(!t.to||t.to>=t0)).sort((a,b)=>(a.from||'9').localeCompare(b.from||'9'));
  const ideas=all.filter(t=>t.status==='idea');
  const past=all.filter(t=>t.status==='done'||(t.status!=='idea'&&t.to&&t.to<t0)).sort((a,b)=>(b.from||'').localeCompare(a.from||''));
  let list={up,idea:ideas,past,all}[TUI.list]||up;
  if(q)list=all.filter(t=>[t.title,t.place,t.desc,t.notes].join(' ').toLowerCase().includes(q));
  const next=up[0];
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>✈️ Izleti i putovanja</h1><p>${up.length} ${plural(up.length,'planirani','planirana','planiranih')} · ${ideas.length} ${plural(ideas.length,'ideja','ideje','ideja')} za izlete</p></div>
    <div class="head-acts"><button class="btn btn-outline" data-act="tripIdea">${icon('sparkle')}Prijedlog izleta</button><button class="btn btn-primary" data-act="tripNew">${icon('plus')}Novi izlet</button></div></div>
  ${next&&!q&&TUI.list==='up'?`<a class="card next-trip" href="#/izleti/${encodeURIComponent(next.id)}" style="--h:${hueOf(next.place||next.title)}">
    <div class="nt-img">${next.cover?imgTag(next.cover,{thumb:false}):`<span>${esc(next.emoji||'🧳')}</span>`}</div>
    <div class="nt-body"><small>SLJEDEĆE PUTOVANJE</small><b>${esc(next.title)}</b><span>${esc(fmtRange(next))}${next.place?' · 📍 '+esc(next.place):''}</span>
      ${untilTxt(next)?`<div class="nt-count">${esc(untilTxt(next))}</div>`:''}
      ${(()=>{const s=tripStats(next);return`<div class="dmeta">${s.pk?`<span>🎒 spakirano ${s.pd}/${s.pk}</span>`:''}${s.verify?`<span class="miss">⚠️ ${s.verify} za provjeriti</span>`:''}${s.cost?`<span>${esc(eur(s.cost))}</span>`:''}</div>`;})()}</div></a>`:''}
  <div class="list-tools">
    <div class="seg">${[['up','Nadolazeći',up.length],['idea','💡 Ideje',ideas.length],['past','Bilo je',past.length],['all','Sve',all.length]].map(([k,l,n])=>`<button class="${TUI.list===k?'on':''}" data-act="tripList" data-v="${k}">${l} <small>${n}</small></button>`).join('')}</div>
    <span class="spacer"></span>
    <label class="searchbox">${icon('search')}<input class="input" data-fk="tsrch" data-input="tripSearch" value="${esc(TUI.q)}" placeholder="Pretraži izlete…"></label>
  </div>
  ${!docsLoaded&&!all.length?`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam…</div>`:
   list.length?`<div class="pgrid">${list.map(tripCard).join('')}</div>`:
   `<section class="card hero-empty"><div><span class="big">${TUI.list==='idea'?'💡':'🗺️'}</span><h2>${TUI.list==='idea'?'Još nema prijedloga':'Nema izleta ovdje'}</h2>
    <p>Izlet ima datume, odredište i smještaj na karti, plan po danima sa satnicom, banku ideja, pakiranje, linkove (rezervacije, karte, info), troškove i slike.</p>
    <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" data-act="tripNew">${icon('plus')}Novi izlet</button><button class="btn btn-outline" data-act="tripIdea">${icon('sparkle')}Prijedlog izleta</button><button class="btn btn-ghost" data-act="tripImport">${icon('archive')}Uvezi plan</button></div></div></section>`}`;
}
function tripCardHTML(t,id,day,sch){
  const c=t.cards[id];if(!c)return'';const info=sch&&sch.res[id];const ty=TT[c.type]||TT.sight;
  const cls=['tc','t-'+esc(c.type||'sight')];if(info&&info.w.length)cls.push('warn');if(day&&day.bad&&isOutC(c))cls.push('dim');
  const anyBad=tripDays(t).some(d=>d.bad);if(!day&&anyBad&&!isOutC(c)&&c.type!=='travel')cls.push('suggest');
  const time=info?`<b>${tFmt(info.s)}–${tFmt(info.e)}</b> · ${tHm(c.dur||0)}${c.fixed?' · 📌':''}`:`~${tHm(c.dur||0)}`;
  const ch=[];
  if(c.place)ch.push(`<a class="chip" href="${esc(mapsQ(c.place))}" target="_blank" rel="noopener">📍 ${esc(c.place.length>34?c.place.slice(0,32)+'…':c.place)}</a>`);
  if(+c.drive>0)ch.push(`<span class="chip">🚗 ${esc(c.drive)} min</span>`);
  if(c.kid)ch.push(`<span class="chip" title="Za djecu">🧒 ${'★'.repeat(c.kid)}${'☆'.repeat(3-c.kid)}</span>`);
  if(c.cost)ch.push(`<span class="chip">💶 ${esc(c.cost)}</span>`);
  if(c.link)ch.push(`<a class="chip chip-link" href="${esc(safeUrl(c.link))}" target="_blank" rel="noopener">${icon('link')}${esc(tryDomain(safeUrl(c.link)))}</a>`);
  ch.push(c.verified?`<span class="chip ok">✓ provjereno</span>`:`<span class="chip verify">⚠️ provjeriti</span>`);
  if(day&&day.bad&&isOutC(c))ch.push(`<span class="chip rain">☔ zamijeni za unutra?</span>`);
  if(!day&&anyBad&&!isOutC(c)&&c.type!=='travel')ch.push(`<span class="chip rain">☔ dobro za loše vrijeme</span>`);
  return`<div class="${cls.join(' ')}" data-id="${esc(id)}" data-act="tcEdit" data-trip="${esc(t.id)}">
    <div class="tc-top"><span class="tc-emo">${esc(c.emoji||ty[0])}</span><div class="tc-main"><div class="tc-title">${esc(c.title||'Bez naslova')}</div><div class="tc-time">${time}</div></div></div>
    <div class="chips">${ch.join('')}</div>
    ${c.notes?`<div class="tc-notes">${linkify(c.notes.length>140?c.notes.slice(0,138)+'…':c.notes)}</div>`:''}
    ${info&&info.w.length?`<div class="tc-warn">⚠️ ${info.w.map(esc).join('<br>⚠️ ')}</div>`:''}
  </div>`;
}
function viewTrip(id,sub){
  const t=docById(id);if(!t||t.kind!=='trip')return docsLoaded?`<div class="card empty" style="padding:40px"><span class="big">🤷</span>Izlet nije pronađen. <a class="link-btn" href="#/izleti">Natrag</a></div>`:`<div class="card empty" style="padding:40px"><span class="big">⏳</span>Učitavam…</div>`;
  normTrip(t);const tab=TUI.tab[id]||(t.days.length?'plan':'overview');const s=tripStats(t);const B=`data-bind="${esc(t.id)}"`;
  const tabs=[['overview','Pregled',''],['plan','Plan',s.acts||''],['pack','Pakiranje',s.pk?`${s.pd}/${s.pk}`:''],['links','Linkovi',t.links.length||''],['costs','Troškovi',s.cost?eur(s.cost):''],['img','Slike',t.images.length||''],['notes','Bilješke','']];
  let body='';
  if(tab==='overview'){
    body=`<div class="pov">
      <section class="card pov-hero" style="--h:${hueOf(t.place||t.title)}">${t.cover?`<button class="rhero-img" data-act="lightbox" data-ids="${esc([t.cover,...t.images.filter(x=>x!==t.cover)].join(','))}">${imgTag(t.cover,{thumb:false})}</button>`:
        `<div class="rhero-ph"><span>${esc(t.emoji||'🧳')}</span><div class="btn-row" style="margin:0;justify-content:center"><button class="btn btn-ghost btn-sm" data-act="tripWebPick" data-id="${esc(t.id)}">${icon('search')}Pronađi fotku mjesta</button>${fileBtn('tripImg',t.id,{label:'Svoja fotka',cls:'btn btn-ghost btn-sm'})}</div></div>`}</section>
      <div class="pov-stats">
        <div class="stat"><div class="ico ico-week">${icon('calendar')}</div><div><div class="num">${esc(untilTxt(t)||(t.from?fmtRange(t):'—'))}</div><div class="lbl">${t.from?esc(fmtRange(t)):'Dodaj datume'}</div></div></div>
        <button class="stat" data-act="tripTab" data-id="${esc(t.id)}" data-v="plan"><div class="ico ico-accent">🗓️</div><div><div class="num">${s.acts}</div><div class="lbl">Aktivnosti${s.ideas?` · ${s.ideas} ideja`:''}</div></div></button>
        <button class="stat" data-act="tripTab" data-id="${esc(t.id)}" data-v="pack"><div class="ico ico-ok">🎒</div><div><div class="num">${s.pd}/${s.pk}</div><div class="lbl">Spakirano</div></div></button>
        <button class="stat" data-act="tripTab" data-id="${esc(t.id)}" data-v="costs"><div class="ico ico-warn">€</div><div><div class="num">${esc(eur(s.cost))}</div><div class="lbl">Troškovi${t.budget?` / ${esc(eur(t.budget))}`:''}</div></div></button>
      </div></div>
    <section class="card"><div class="card-body form-stack">
      <div class="field"><label>Status</label><div class="seg seg-scroll">${Object.entries(TRIP_ST).map(([k,v])=>`<button class="${(t.status||'plan')===k?'on':''}" data-act="tripSet" data-id="${esc(t.id)}" data-k="status" data-v="${k}">${v[0]} ${v[1]}</button>`).join('')}</div></div>
      <div class="grid2">
        <div class="field"><label>Od</label><input type="date" ${B} data-path="from" value="${esc(t.from||'')}"></div>
        <div class="field"><label>Do</label><input type="date" ${B} data-path="to" value="${esc(t.to||'')}"></div>
        <div class="field"><label>Odredište</label><div class="in-btn"><input ${B} data-path="place" value="${esc(t.place||'')}" placeholder="npr. Kranjska Gora, Slovenija"><a class="ibtn" href="${esc(mapsQ(t.place||''))}" target="_blank" rel="noopener" title="Karta">${icon('ext')}</a></div></div>
        <div class="field"><label>Smještaj (adresa)</label><div class="in-btn"><input ${B} data-path="base" value="${esc(t.base||'')}" placeholder="Hotel / apartman, adresa"><a class="ibtn" href="${esc(mapsDir('',t.base||t.place||''))}" target="_blank" rel="noopener" title="Upute do smještaja">${icon('ext')}</a></div></div>
        <div class="field"><label>Tko ide</label><input ${B} data-path="who" value="${esc(t.who||'')}" placeholder="npr. 2 odrasla + djeca 7 i 5 god."></div>
        <div class="field"><label>Budžet (€)</label><input inputmode="decimal" ${B} data-type="num" data-path="budget" value="${esc(t.budget??'')}" placeholder="npr. 800"></div>
        <div class="field"><label>Djeca: dan završava do</label><input type="time" ${B} data-path="late" value="${esc(t.late||'')}" title="Upozorenje ako aktivnost završava kasnije"></div>
      </div>
      <div class="field"><label>Opis izleta</label><textarea class="input grow" ${B} data-path="desc" rows="3" placeholder="Zašto idemo, što želimo vidjeti, okvirna ideja…">${esc(t.desc||'')}</textarea></div>
      <div class="btn-row" style="margin-top:0">
        ${t.from?`<a class="btn btn-ghost btn-sm" href="${esc(tripGcal(t))}" target="_blank" rel="noopener">${icon('calendar')}Dodaj u Google Calendar</a><button class="btn btn-ghost btn-sm" data-act="tripTodo" data-id="${esc(t.id)}">${icon('pin')}U tjedni plan</button>`:''}
        ${t.place?`<a class="btn btn-ghost btn-sm" href="${esc(mapsDir('',t.base||t.place))}" target="_blank" rel="noopener">🧭 Navigacija</a><a class="btn btn-ghost btn-sm" href="https://www.google.com/search?q=${encodeURIComponent('vremenska prognoza '+t.place)}" target="_blank" rel="noopener">⛅ Vrijeme</a>`:''}
      </div>
    </div></section>
    <section class="card"><div class="card-head"><h2>ℹ️ Važne informacije</h2><small style="color:var(--text-3)">check-in, broj rezervacije, kontakti…</small></div>
      <div class="card-body"><div class="kv">${t.info.map(x=>`<div class="kv-row"><input class="input kv-k" ${B} data-path="info.${esc(x.id)}.k" value="${esc(x.k)}" placeholder="npr. Check-in"><input class="input" ${B} data-path="info.${esc(x.id)}.v" value="${esc(x.v)}" placeholder="od 14:00"><button class="ibtn ibtn-danger" data-act="tripRowDel" data-id="${esc(t.id)}" data-list="info" data-row="${esc(x.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')}</div>
        <div class="btn-row"><button class="btn btn-ghost btn-sm" data-act="tripInfoAdd" data-id="${esc(t.id)}">${icon('plus')}Dodaj red</button>${!t.info.length?`<button class="btn btn-ghost btn-sm" data-act="tripInfoTpl" data-id="${esc(t.id)}">${icon('wand')}Uobičajena polja</button>`:''}</div></div></section>`;
  }
  if(tab==='plan'){
    const days=tripDays(t);
    body=`${!days.length?`<section class="card"><div class="card-body" style="padding:18px">${t.from?'':'Upiši datume <b>od – do</b> u Pregledu pa će se dani složiti sami — ili '}<button class="btn btn-primary btn-sm" data-act="${t.from?'tripSync':'tripDayAdd'}" data-id="${esc(t.id)}">${icon('plus')}${t.from?'Složi dane iz datuma':'dodaj dan ručno'}</button></div></section>`:''}
    <div class="tboard-tools"><span class="hint" style="margin:0">Klik na karticu = uredi · povuci karticu na drugi dan ili gore/dolje · satnica se računa sama</span><span class="spacer"></span>
      ${t.from?`<button class="btn btn-ghost btn-sm" data-act="tripSync" data-id="${esc(t.id)}">${icon('refresh')}Uskladi dane s datumima</button>`:''}<button class="btn btn-ghost btn-sm" data-act="tripDayAdd" data-id="${esc(t.id)}">${icon('plus')}Dan</button></div>
    <div class="tboard" id="tboard">
      ${days.map((d,i)=>{const sc=schedule(t,d);const places=(t.order[d.id]||[]).map(x=>t.cards[x]&&t.cards[x].place).filter(Boolean);const uniq=places.filter((p,j)=>p!==places[j-1]);
        return`<section class="tcol${d.bad?' bad':''}${d.date===localISO(today())?' today':''}">
        <div class="tcol-h"><div style="min-width:0;flex:1"><input class="tcol-title" ${B} data-path="days.${esc(d.id)}.title" value="${esc(d.title||'')}" placeholder="${esc(dayTitle(d,i))}"><input class="tcol-sub" ${B} data-path="days.${esc(d.id)}.sub" value="${esc(d.sub||'')}" placeholder="podnaslov dana…"></div>
          <button class="ibtn" data-act="tripDayMenu" data-id="${esc(t.id)}" data-day="${esc(d.id)}" aria-label="Opcije dana">${icon('more')}</button></div>
        <div class="tcol-tools"><label>Početak <input type="time" ${B} data-path="days.${esc(d.id)}.start" value="${esc(d.start||'09:00')}"></label>
          <button class="tog${d.bad?' on':''}" data-act="tripBad" data-id="${esc(t.id)}" data-day="${esc(d.id)}">☔ Loše vrijeme${d.bad?' ✓':''}</button></div>
        <div class="tsum"><span>🕒 <b>${tFmt(sc.start)}–${tFmt(sc.end)}</b></span>${sc.out?`<span>🌲 <b>${tHm(sc.out)}</b> vani</span>`:''}${sc.warns?`<span class="bad">⚠️ ${sc.warns}</span>`:''}
          ${uniq.length?`<a href="${esc(mapsDir(t.base||'',uniq[uniq.length-1],uniq.slice(0,-1)))}" target="_blank" rel="noopener">🧭 ruta dana</a>`:''}</div>
        <div class="tlist" data-trip="${esc(t.id)}" data-col="${esc(d.id)}">${(t.order[d.id]||[]).map(x=>tripCardHTML(t,x,d,sc)).join('')}</div>
        <button class="tadd" data-act="tcNew" data-id="${esc(t.id)}" data-col="${esc(d.id)}">＋ Dodaj aktivnost</button></section>`;}).join('')}
      <section class="tcol ideas"><div class="tcol-h"><div><b class="tcol-title ro">💡 Banka ideja</b><div class="tcol-sub ro">${tripDays(t).some(d=>d.bad)?'☔ označene su ideje za unutra':'Povuci ideju u dan'}</div></div></div>
        <div class="tlist" data-trip="${esc(t.id)}" data-col="ideas">${(t.order.ideas||[]).map(x=>tripCardHTML(t,x,null,null)).join('')}</div>
        <button class="tadd" data-act="tcNew" data-id="${esc(t.id)}" data-col="ideas">＋ Dodaj ideju</button></section>
    </div>`;
  }
  if(tab==='pack'){
    const groups=[...new Set([...t.packing.map(p=>p.group),...(t.packGroups||[])])];const pct=s.pk?Math.round(s.pd/s.pk*100):0;
    body=`<section class="card"><div class="card-head"><h2>🎒 Pakiranje</h2><span class="spacer"></span><div class="note-prog"><div class="bar"><i style="width:${pct}%"></i></div><b>${s.pd}/${s.pk}</b></div></div>
      <div class="card-body"><div class="btn-row" style="margin-top:0"><span class="hint" style="margin:0">Dodaj predložak:</span>${Object.keys(PACK_TPL).map(k=>`<button class="fchip" data-act="tripPackTpl" data-id="${esc(t.id)}" data-v="${esc(k)}">${esc(k)}</button>`).join('')}
        <span class="spacer"></span>${s.pd?`<button class="btn btn-ghost btn-sm" data-act="tripUnpack" data-id="${esc(t.id)}">Odznači sve</button>`:''}<button class="btn btn-ghost btn-sm" data-act="tripPackCopy" data-id="${esc(t.id)}">${icon('copy')}Kopiraj iz drugog izleta</button></div></div></section>
    <div class="pack-grid">${groups.map(g=>{const it=t.packing.filter(p=>p.group===g);const d=it.filter(p=>p.done).length;
      return`<section class="card"><div class="card-head"><input class="pack-g" value="${esc(g)}" data-act-in="tripGroupRen" data-id="${esc(t.id)}" data-g="${esc(g)}" aria-label="Naziv grupe"><span class="spacer"></span><small style="color:var(--text-3);font-weight:800">${d}/${it.length}</small></div>
        <div class="card-body"><ul class="pack">${it.map(p=>`<li class="${p.done?'done':''}"><label class="cbx-l"><input type="checkbox" ${B} data-path="packing.${esc(p.id)}.done" ${p.done?'checked':''}><span class="check">${icon('check')}</span></label><span>${esc(p.text)}</span><button class="ibtn" data-act="tripRowDel" data-id="${esc(t.id)}" data-list="packing" data-row="${esc(p.id)}" aria-label="Ukloni">${icon('x')}</button></li>`).join('')}</ul>
        <div class="add-row"><input class="input pack-in" data-enter="tripPackAdd" data-id="${esc(t.id)}" data-g="${esc(g)}" placeholder="Dodaj… (zarez = više)"></div></div></section>`;}).join('')}
      <section class="card"><div class="card-body"><div class="add-row" style="margin:0"><input class="input" id="packNewG" data-enter="tripGroupAdd" data-id="${esc(t.id)}" placeholder="Nova grupa — npr. Tata, Mama, Lana…"><button class="btn btn-primary" data-act="tripGroupAdd" data-id="${esc(t.id)}">${icon('plus')}</button></div></div></section>
    </div>`;
  }
  if(tab==='links'){
    const cats=[...new Set([...LINK_CATS.filter(c=>t.links.some(l=>l.cat===c)),...t.links.map(l=>l.cat||'Ostalo')])];
    body=`<section class="card"><div class="card-head"><h2>🔗 Dodaj stranicu</h2></div><div class="card-body">
      <div class="ev-form"><div class="field" style="flex:3"><label>Link</label><input id="tlU" type="url" data-enter="tripLinkAdd" data-id="${esc(t.id)}" placeholder="https://… (booking, karte, restoran, vremenska prognoza)"></div>
        <div class="field" style="flex:2"><label>Naziv</label><input id="tlT" data-enter="tripLinkAdd" data-id="${esc(t.id)}" placeholder="opcionalno"></div>
        <div class="field"><label>Kategorija</label><select id="tlC">${LINK_CATS.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
        <button class="btn btn-primary" data-act="tripLinkAdd" data-id="${esc(t.id)}">${icon('plus')}Dodaj</button></div>
      ${t.place?`<div class="btn-row"><span class="hint" style="margin:0">Brzi linkovi:</span>${[['Smještaj','Booking.com','https://www.booking.com/searchresults.html?ss='],['Aktivnosti','TripAdvisor','https://www.tripadvisor.com/Search?q='],['Info i vrijeme','Vrijeme (yr.no)','https://www.yr.no/en/search?q='],['Hrana','Restorani na karti','https://www.google.com/maps/search/restoran+'],['Prijevoz','Benzinske / punionice','https://www.google.com/maps/search/benzinska+postaja+']].map(([c,n,u])=>`<button class="fchip" data-act="tripQuickLink" data-id="${esc(t.id)}" data-c="${esc(c)}" data-n="${esc(n)}" data-u="${esc(u+encodeURIComponent(t.place))}">+ ${esc(n)}</button>`).join('')}</div>`:''}
    </div></section>
    ${cats.map(c=>`<section class="card"><div class="card-head"><h2>${esc(c)}</h2></div><div class="card-body plinks">${t.links.filter(l=>(l.cat||'Ostalo')===c).map(l=>`<div class="plink">
      <div class="fav"><img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(tryDomain(safeUrl(l.u)))}&sz=64" alt="" loading="lazy" data-fav></div>
      <div class="plink-in"><input class="input" ${B} data-path="links.${esc(l.id)}.t" value="${esc(l.t||'')}" placeholder="Naziv"><input class="input mono" ${B} data-path="links.${esc(l.id)}.u" value="${esc(l.u||'')}"></div>
      <a class="btn btn-ghost btn-sm" href="${esc(safeUrl(l.u))}" target="_blank" rel="noopener">Otvori ${icon('ext')}</a>
      <button class="ibtn ibtn-danger" data-act="tripRowDel" data-id="${esc(t.id)}" data-list="links" data-row="${esc(l.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')}</div></section>`).join('')||'<div class="card empty" style="padding:30px">Još nema linkova — dodaj rezervacije, karte, stranice atrakcija, restorane…</div>'}`;
  }
  if(tab==='costs'){
    body=`<section class="card"><div class="card-head"><h2>💶 Troškovi</h2><span class="spacer"></span><div class="mat-tot"><span>Ukupno <b>${esc(eur(s.cost))}</b></span><span class="ok">Plaćeno <b>${esc(eur(s.paid))}</b></span><span class="warn">Za platiti <b>${esc(eur(s.cost-s.paid))}</b></span>${t.budget?`<span class="${s.cost>t.budget?'over':''}">Budžet <b>${esc(eur(t.budget))}</b></span>`:''}</div></div>
      <div class="card-body"><div class="costs">${t.costs.map(c=>`<div class="cost-row${c.paid?' have':''}"><label class="cbx-l" title="Plaćeno"><input type="checkbox" ${B} data-path="costs.${esc(c.id)}.paid" ${c.paid?'checked':''}><span class="check">${icon('check')}</span></label>
        <select class="input" ${B} data-path="costs.${esc(c.id)}.cat">${['🏨 Smještaj','🚗 Prijevoz','⛽ Gorivo','🍽️ Hrana','🎟️ Ulaznice','🛍️ Ostalo'].map(x=>`<option ${c.cat===x?'selected':''}>${x}</option>`).join('')}</select>
        <input class="input" ${B} data-path="costs.${esc(c.id)}.n" value="${esc(c.n||'')}" placeholder="Opis">
        <input class="input mi-p" inputmode="decimal" ${B} data-type="num" data-path="costs.${esc(c.id)}.amount" value="${esc(c.amount==null?'':String(c.amount).replace('.',','))}" placeholder="0,00 €">
        <button class="ibtn ibtn-danger" data-act="tripRowDel" data-id="${esc(t.id)}" data-list="costs" data-row="${esc(c.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')||'<div class="empty">Još nema troškova.</div>'}</div>
        <div class="btn-row"><button class="btn btn-primary btn-sm" data-act="tripCostAdd" data-id="${esc(t.id)}">${icon('plus')}Dodaj trošak</button></div></div></section>`;
  }
  if(tab==='img'){
    body=`<section class="card"><div class="card-head"><h2>${icon('image')} Slike</h2><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-act="tripWebPick" data-id="${esc(t.id)}">${icon('search')}Pronađi fotku mjesta</button></div>
      <div class="card-body">${galleryHTML(t.images,{act:'tripImg',id:t.id,cover:t.cover})}<p class="hint">Fotke s izleta, karte, ulaznice, screenshotovi rezervacija… ★ = naslovna.</p></div></section>`;
  }
  if(tab==='notes'){
    body=`<section class="card"><div class="card-body"><textarea class="input grow" ${B} data-path="notes" rows="10" placeholder="Brojevi rezervacija, pitanja za recepciju, dojmovi nakon izleta…">${esc(t.notes||'')}</textarea></div></section>`;
  }
  return`
  <div class="page-head"><div style="min-width:0;flex:1"><a class="crumb" href="#/izleti">${icon('chevL')}Izleti i putovanja</a>
    <div class="ptitle"><input class="emo-in" ${B} data-path="emoji" value="${esc(t.emoji||'')}" maxlength="4" placeholder="🧳" aria-label="Ikona"><input class="note-title" ${B} data-path="title" value="${esc(t.title||'')}" placeholder="Naziv izleta" aria-label="Naziv"></div>
    <div class="mini-stats">${tripPill(t.status)}<span class="pill">${icon('calendar')} ${esc(fmtRange(t))}${nights(t)?` · ${nights(t)} ${plural(nights(t),'noć','noći','noći')}`:''}</span>${t.place?`<a class="pill" href="${esc(mapsQ(t.place))}" target="_blank" rel="noopener" style="text-decoration:none">📍 ${esc(t.place)}</a>`:''}${untilTxt(t)?`<span class="pill pill-week">${esc(untilTxt(t))}</span>`:''}</div></div>
    <div class="head-acts"><button class="ibtn big" data-act="tripMenu" data-id="${esc(t.id)}" title="Opcije">${icon('more')}</button></div></div>
  <div class="ptabs seg seg-scroll">${tabs.map(([k,l,n])=>`<button class="${tab===k?'on':''}" data-act="tripTab" data-id="${esc(t.id)}" data-v="${k}">${l}${n!==''?` <small>${esc(n)}</small>`:''}</button>`).join('')}</div>
  ${body}`;
}
function tripGcal(t){const a=isoD(t.from),b=addDays(isoD(t.to)||a,1);const y=d=>localISO(d).replace(/-/g,'');
  return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((t.emoji||'')+' '+t.title)}&dates=${y(a)}/${y(b)}&location=${encodeURIComponent(t.base||t.place||'')}&details=${encodeURIComponent((t.desc||'')+'\n\n'+location.origin+location.pathname+'#/izleti/'+t.id)}`;}
function openTripNew(idea){
  openSheet({title:idea?'💡 Prijedlog izleta':'✈️ Novi izlet',body:`
    <div class="grid2" style="grid-template-columns:76px 1fr"><div class="field"><label for="tn_e">Ikona</label><input id="tn_e" value="${idea?'🗺️':'🧳'}" maxlength="4" style="text-align:center;font-size:1.3rem"></div>
      <div class="field"><label for="tn_t">Naziv</label><input id="tn_t" placeholder="${idea?'npr. Plitvice u jesen':'npr. Zimovanje Kranjska Gora'}" maxlength="80"></div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap" id="tnPick">${['🧳','🏔️','❄️','🏖️','🏕️','🚗','✈️','🏰','🌲','🍷','🎢','⛪','🚴','🛶'].map(e=>`<button class="ibtn" style="font-size:1.2rem;background:var(--surface-2)" data-e="${e}">${e}</button>`).join('')}</div>
    <div class="field"><label for="tn_p">Odredište / mjesto</label><input id="tn_p" placeholder="npr. Nacionalni park Plitvička jezera"></div>
    ${idea?`<div class="field"><label for="tn_l">Link (opcionalno)</label><input id="tn_l" type="url" placeholder="https://…"></div><div class="field"><label for="tn_d">Opis</label><textarea id="tn_d" rows="3" placeholder="Zašto, kada bi bilo najbolje, s kim…"></textarea></div>`:
    `<div class="grid2"><div class="field"><label for="tn_f">Od</label><input type="date" id="tn_f"></div><div class="field"><label for="tn_to">Do</label><input type="date" id="tn_to"></div></div>
    <div class="field"><label for="tn_b">Smještaj (adresa, opcionalno)</label><input id="tn_b" placeholder="Hotel / apartman, adresa"></div>`}`,
    actions:[...(idea?[]:[{label:icon('archive')+'Uvezi plan',cls:'btn-ghost',left:true,fn:()=>openTripImport()}]),{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('check')+(idea?'Spremi ideju':'Kreiraj'),cls:'btn-primary',primary:true,fn:()=>{
      const el=$('#sheet');const v=s=>{const x=$(s,el);return x?x.value.trim():'';};const name=v('#tn_t');if(!name){$('#tn_t',el).focus();return;}
      let from=v('#tn_f'),to=v('#tn_to');if(from&&!to)to=from;if(to&&!from)from=to;if(from&&to<from)[from,to]=[to,from];
      const t=newTrip({title:name,emoji:v('#tn_e')||'🧳',place:v('#tn_p'),status:idea?'idea':'plan',from,to,base:v('#tn_b'),desc:v('#tn_d')});
      const l=v('#tn_l');if(l)t.links.push({id:uid('l'),t:'',u:normUrl(l),cat:'Ostalo'});
      putDoc(t,{now:true});closeSheet();if(idea){TUI.list='idea';go('#/izleti');toast('💡 Ideja spremljena',{label:'Otvori',fn:()=>go('#/izleti/'+t.id)});}else{TUI.tab[t.id]=from?'plan':'overview';go('#/izleti/'+t.id);}}}],
    onOpen:el=>{$$('#tnPick button',el).forEach(b=>b.addEventListener('click',()=>{$('#tn_e',el).value=b.dataset.e;}));$('#tn_t',el).focus();
      const f=$('#tn_f',el),to=$('#tn_to',el);if(f)f.addEventListener('change',()=>{if(!to.value||to.value<f.value)to.value=f.value;});}});
}
/* uvoz plana iz Špik artifacta (ili izvoza izleta) */
function importTripJSON(o,title){
  if(o&&o.kind==='trip'){const t=normTrip(JSON.parse(JSON.stringify(o)));t.id=uid('tr');t.images=[];t.cover='';return t;}
  if(!o||!o.cards||!o.order||!o.columns)throw new Error('Ne izgleda kao kopirani plan');
  const t=newTrip({title:title||'Uvezeni plan',status:'plan',notes:o.notes||''});
  const map={sled:'sled',snow:'snow',food:'food',indoor:'indoor',rest:'rest',travel:'travel'};
  for(const id in o.cards){const c=o.cards[id];t.cards[id]={emoji:c.emoji||'✨',title:c.title||'',type:map[c.type]||'sight',dur:+c.dur||60,fixed:c.fixed||'',place:c.place||'',drive:+c.drive||0,kid:+c.kid||0,cost:c.cost||'',notes:c.notes||'',verified:!!c.verified,link:''};}
  o.columns.forEach(col=>{if(col.idea){t.order.ideas=[...(o.order[col.id]||[])];return;}const d={id:uid('td'),date:'',title:col.title||'',sub:col.sub||'',start:col.start||'09:00',bad:!!col.bad};t.days.push(d);t.order[d.id]=[...(o.order[col.id]||[])];});
  t.packing=(o.packing||[]).map(p=>({id:uid('pk'),group:p.group||'Ostalo',text:p.text||'',done:!!p.done}));
  return t;
}
function openTripImport(){
  openSheet({title:'Uvezi plan izleta',body:`<p style="color:var(--text-2);font-size:.9rem">Zalijepi plan kopiran iz trip-planner artifacta (⋯ → Copy plan) ili izvoz izleta iz Plannera.</p>
    <div class="field"><label for="ti_n">Naziv</label><input id="ti_n" placeholder="npr. Špik zimovanje"></div>
    <div class="field"><label for="ti_j">Plan (JSON)</label><textarea id="ti_j" rows="6" class="mono" placeholder='{"columns":[…],"cards":{…},"order":{…}}'></textarea></div>
    <button class="choice" id="tiSpik"><div class="ico" style="background:var(--low-soft);font-size:1.3rem">❄️</div><div><b>Uvezi “Špik Winter Trip”</b><small>Hotel Špik, Gozd Martuljek · 28.–30. 12. — 3 dana, 31 kartica, popis za pakiranje</small></div></button>`,
    actions:[{label:'Odustani',cls:'btn-ghost',fn:closeSheet},{label:icon('check')+'Uvezi',cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');try{const t=importTripJSON(JSON.parse($('#ti_j',el).value),$('#ti_n',el).value.trim());putDoc(t,{now:true});closeSheet();TUI.tab[t.id]='plan';go('#/izleti/'+t.id);toast('Plan uvezen ✓');}catch(e){toast('Greška: '+e.message);}}}],
    onOpen:el=>$('#tiSpik',el).addEventListener('click',async()=>{try{const o=await(await fetch('data/trip-spik.json')).json();const t=importTripJSON(o,'Špik zimovanje');
      Object.assign(t,{emoji:'❄️',place:'Gozd Martuljek, Slovenija',base:'Hotel Špik, Jezerci 21, Gozd Martuljek',status:'booked',from:'2026-12-28',to:'2026-12-30',who:'2 odrasla + djeca 7 i 5 god.',late:'19:30'});
      t.days.forEach((d,i)=>{d.date=localISO(addDays(fromInputDate('2026-12-28'),i));d.title='';});
      t.info=[['Check-in','od 14:00'],['Check-out','do 11:00'],['Hitni broj','112 (cijela EU)'],['Djeca','pauza za zagrijavanje svaka 2 h · gotovo do 19:30'],['Cestarina','e-vinjeta za Sloveniju (kupiti online prije puta)']].map(([k,v])=>({id:uid('i'),k,v}));
      t.links=[{id:uid('l'),t:'Hotel Špik',u:'https://www.hotelspik.com',cat:'Smještaj'},{id:uid('l'),t:'Kranjska Gora — ski centar',u:'https://www.kr-gora.si',cat:'Aktivnosti'},{id:uid('l'),t:'Slovenska e-vinjeta',u:'https://evinjeta.dars.si',cat:'Prijevoz'},{id:uid('l'),t:'Vremenska prognoza (ARSO)',u:'https://meteo.arso.gov.si',cat:'Info i vrijeme'}];
      putDoc(t,{now:true});closeSheet();TUI.tab[t.id]='plan';go('#/izleti/'+t.id);toast('❄️ Špik plan uvezen');}catch(e){toast('Uvoz nije uspio: '+e.message);}})});
}
function openTcEditor(tripId,id,col){
  const t=docById(tripId);if(!t)return;normTrip(t);const isNew=!id;
  const c=isNew?{emoji:'',title:'',type:'sight',dur:60,fixed:'',place:'',drive:0,kid:0,cost:'',notes:'',verified:false,link:''}:t.cards[id];if(!c)return;
  const cur=isNew?col:(Object.keys(t.order).find(k=>(t.order[k]||[]).includes(id))||'ideas');
  openSheet({title:isNew?'Nova aktivnost':'Uredi aktivnost',body:`
    <div class="grid2" style="grid-template-columns:76px 1fr"><div class="field"><label>Ikona</label><input id="tc_e" value="${esc(c.emoji||'')}" maxlength="4" placeholder="${esc((TT[c.type]||TT.sight)[0])}" style="text-align:center;font-size:1.3rem"></div>
      <div class="field"><label>Naziv</label><input id="tc_t" value="${esc(c.title)}" placeholder="npr. Sanjkanje na Vitrancu"></div></div>
    <div class="grid2">
      <div class="field"><label>Vrsta</label><select id="tc_ty">${Object.entries(TT).map(([k,v])=>`<option value="${k}" ${c.type===k?'selected':''}>${v[0]} ${v[1]}</option>`).join('')}</select></div>
      <div class="field"><label>Dan</label><select id="tc_c">${tripDays(t).map((d,i)=>`<option value="${esc(d.id)}" ${cur===d.id?'selected':''}>${esc(dayTitle(d,i))}</option>`).join('')}<option value="ideas" ${cur==='ideas'?'selected':''}>💡 Banka ideja</option></select></div>
      <div class="field"><label>Trajanje (min)</label><input id="tc_d" type="number" min="0" step="15" value="${esc(c.dur)}"></div>
      <div class="field"><label>Fiksni početak</label><input id="tc_f" type="time" value="${esc(c.fixed||'')}"></div>
      <div class="field full"><label>Mjesto (za kartu i rutu)</label><input id="tc_p" value="${esc(c.place||'')}" placeholder="npr. Zelenci, Kranjska Gora"></div>
      <div class="field"><label>Vožnja od smještaja (min)</label><input id="tc_dr" type="number" min="0" value="${esc(c.drive||0)}"></div>
      <div class="field"><label>Cijena</label><input id="tc_co" value="${esc(c.cost||'')}" placeholder="npr. 10 € / besplatno"></div>
      <div class="field full"><label>Link (stranica, karte, rezervacija)</label><input id="tc_l" type="url" value="${esc(c.link||'')}" placeholder="https://…"></div>
      <div class="field full"><label>Za djecu</label><div class="seg" id="tc_k">${[0,1,2,3].map(n=>`<button type="button" class="${(+c.kid||0)===n?'on':''}" data-v="${n}">${n?'★'.repeat(n):'—'}</button>`).join('')}</div></div>
      <div class="field full"><label>Bilješke</label><textarea id="tc_n" rows="3" placeholder="Radno vrijeme, što ponijeti…">${esc(c.notes||'')}</textarea></div>
    </div>
    <label class="switch"><input type="checkbox" id="tc_v" ${c.verified?'checked':''}><span class="track"></span>Radno vrijeme / cijene provjereni</label>`,
    actions:[...(isNew?[]:[{label:icon('trash'),cls:'btn-danger',left:true,fn:()=>{const k=Object.keys(t.order).find(x=>(t.order[x]||[]).includes(id));const i=t.order[k].indexOf(id);const card=t.cards[id];t.order[k].splice(i,1);delete t.cards[id];putDoc(t);closeSheet();renderAll();
        toast('Aktivnost obrisana',{label:'Poništi',fn:()=>{t.cards[id]=card;t.order[k].splice(i,0,id);putDoc(t);renderAll();}});}},
      {label:icon('copy'),cls:'btn-ghost',left:true,fn:()=>{const nid=uid('c');t.cards[nid]=JSON.parse(JSON.stringify(c));t.cards[nid].title+=' (kopija)';const arr=t.order[cur];arr.splice(arr.indexOf(id)+1,0,nid);putDoc(t);closeSheet();renderAll();}}]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(isNew?'Dodaj':'Spremi'),cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');const v=s=>$(s,el).value.trim();
        const o={emoji:v('#tc_e'),title:v('#tc_t')||'Aktivnost',type:v('#tc_ty'),dur:Math.max(0,parseInt(v('#tc_d'),10)||0),fixed:v('#tc_f'),place:v('#tc_p'),drive:Math.max(0,parseInt(v('#tc_dr'),10)||0),cost:v('#tc_co'),link:v('#tc_l')?normUrl(v('#tc_l')):'',
          kid:+($('#tc_k .on',el)||{dataset:{v:0}}).dataset.v,notes:$('#tc_n',el).value.trim(),verified:$('#tc_v',el).checked};
        const target=v('#tc_c');
        if(isNew){const nid=uid('c');t.cards[nid]=o;(t.order[target]=t.order[target]||[]).push(nid);}
        else{Object.assign(t.cards[id],o);if(target!==cur){t.order[cur]=t.order[cur].filter(x=>x!==id);(t.order[target]=t.order[target]||[]).push(id);}}
        putDoc(t);closeSheet();renderAll();}}],
    onOpen:el=>{$$('#tc_k button',el).forEach(b=>b.addEventListener('click',()=>$$('#tc_k button',el).forEach(x=>x.classList.toggle('on',x===b))));if(isNew)$('#tc_t',el).focus();}});
}
function openTripMenu(id){
  const t=docById(id);if(!t)return;
  openSheet({title:esc(t.title||'Izlet'),side:true,body:`<div class="sheet-list">
    ${t.from?`<a class="row" href="${esc(tripGcal(t))}" target="_blank" rel="noopener" data-close>${icon('calendar')}Dodaj u Google Calendar</a>`:''}
    <button class="row" data-tm="copy">${icon('copy')}Kopiraj plan kao tekst (za poruku)</button>
    <button class="row" data-tm="json">${icon('archive')}Kopiraj kao JSON (za uvoz / dijeljenje)</button>
    <button class="row" data-tm="dup">${icon('layers')}Dupliciraj (npr. za iduću godinu)</button>
    <button class="row" data-tm="del" style="color:var(--urgent)">${icon('trash')}Obriši izlet</button></div>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>$$('[data-tm]',el).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.tm;closeSheet();
      if(a==='copy')copyText(tripToText(t));
      if(a==='json'){const c=JSON.parse(JSON.stringify(t));delete c.images;delete c.cover;copyText(JSON.stringify(c));}
      if(a==='dup'){const c=JSON.parse(JSON.stringify(t));c.id=uid('tr');c.title=(t.title||'Izlet')+' (kopija)';c.status='plan';c.images=[];c.cover='';c.created=0;c.packing.forEach(p=>p.done=false);c.costs=[];putDoc(c,{now:true});go('#/izleti/'+c.id);}
      if(a==='del')confirmSheet(`Obrisati izlet “${t.title}”?`,()=>{delDoc(t.id);go('#/izleti');toast('Izlet obrisan',{label:'Poništi',fn:()=>{putDoc(t,{now:true});go('#/izleti/'+t.id);}});setTimeout(()=>{if(!docById(t.id))(t.images||[]).forEach(imgDelete);},7000);});
    }))});
}
function tripToText(t){
  const L=[`${t.emoji||'🧳'} ${t.title}`,fmtRange(t)+(t.place?' · '+t.place:''),t.base?'Smještaj: '+t.base:'',t.desc||''];
  tripDays(t).forEach((d,i)=>{const sc=schedule(t,d);L.push('',dayTitle(d,i).toUpperCase()+(d.sub?' — '+d.sub:''));(t.order[d.id]||[]).forEach(id=>{const c=t.cards[id];if(!c)return;const r=sc.res[id];L.push(`${tFmt(r.s)}–${tFmt(r.e)}  ${c.emoji||''} ${c.title}${c.place?' ('+c.place+')':''}`);});});
  if((t.order.ideas||[]).length){L.push('','IDEJE');t.order.ideas.forEach(id=>t.cards[id]&&L.push('• '+t.cards[id].title));}
  return L.filter((x,i)=>x!==''||L[i-1]!=='').join('\n').trim();
}
const tPut=t=>{putDoc(t);renderAll();};
Object.assign(ACT,{
  tripNew:()=>openTripNew(false),tripIdea:()=>openTripNew(true),tripImport:()=>openTripImport(),
  tripList:el=>{TUI.list=el.dataset.v;lsSet('planner.triplist',TUI.list);renderAll();},
  tripTab:el=>{TUI.tab[el.dataset.id]=el.dataset.v;renderAll();window.scrollTo({top:0,behavior:'smooth'});},
  tripSet:el=>{const t=docById(el.dataset.id);if(!t)return;t[el.dataset.k]=el.dataset.v;tPut(t);},
  tripMenu:el=>openTripMenu(el.dataset.id),
  tripSync:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);syncDays(t);tPut(t);toast('Dani usklađeni s datumima');},
  tripDayAdd:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);const d={id:uid('td'),date:'',title:'',sub:'',start:'09:00',bad:false};t.days.push(d);t.order[d.id]=[];TUI.tab[t.id]='plan';tPut(t);},
  tripBad:el=>{const t=docById(el.dataset.id);const d=t&&t.days.find(x=>x.id===el.dataset.day);if(!d)return;d.bad=!d.bad;tPut(t);if(d.bad)toast('☔ Aktivnosti vani su zatamnjene, ideje za unutra istaknute');},
  tripDayMenu:el=>{const t=docById(el.dataset.id);if(!t)return;const d=t.days.find(x=>x.id===el.dataset.day);if(!d)return;const i=t.days.indexOf(d);
    openSheet({title:esc(dayTitle(d,i)),side:true,body:`<div class="sheet-list">
      <button class="row" data-dm="todo">${icon('pin')}Pošalji u tjedni plan${d.date?'':' (danas)'}</button>
      <button class="row" data-dm="ideas">${icon('layers')}Sve aktivnosti u banku ideja</button>
      ${i>0?`<button class="row" data-dm="left">${icon('chevL')}Pomakni dan ranije</button>`:''}${i<t.days.length-1?`<button class="row" data-dm="right">${icon('chevR')}Pomakni dan kasnije</button>`:''}
      <button class="row" data-dm="del" style="color:var(--urgent)">${icon('trash')}Ukloni dan (aktivnosti idu u ideje)</button></div>`,actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
      onOpen:e2=>$$('[data-dm]',e2).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.dm;closeSheet();
        if(a==='todo'){const date=d.date?fromInputDate(d.date):today();const sc=schedule(t,d);(t.order[d.id]||[]).forEach(id=>{const c=t.cards[id];if(c)placeOnDate(date,`${tFmt(sc.res[id].s)} ${c.emoji||''} ${c.title}`.trim(),{link:c.link||'',note:c.place||''});});saveData();toast('Dodano u tjedni plan: '+shortDay(date),{label:'Prikaži',fn:()=>go('#/')});return;}
        if(a==='ideas'){t.order.ideas=[...(t.order.ideas||[]),...(t.order[d.id]||[])];t.order[d.id]=[];}
        if(a==='left'||a==='right'){const j=a==='left'?i-1:i+1;[t.days[i],t.days[j]]=[t.days[j],t.days[i]];if(d.date&&t.days[i].date){const x=t.days[i].date;t.days[i].date=d.date;d.date=x;}}
        if(a==='del'){t.order.ideas=[...(t.order.ideas||[]),...(t.order[d.id]||[])];delete t.order[d.id];t.days.splice(i,1);}
        tPut(t);}))});},
  tcNew:el=>openTcEditor(el.dataset.id,null,el.dataset.col),
  tcEdit:(el,e)=>{if(e.target.closest('a')||justDraggedTrip)return;openTcEditor(el.dataset.trip,el.dataset.id);},
  tripRowDel:el=>{const t=docById(el.dataset.id);if(!t)return;const L=el.dataset.list;const i=(t[L]||[]).findIndex(x=>x.id===el.dataset.row);if(i<0)return;const[row]=t[L].splice(i,1);tPut(t);
    toast('Uklonjeno',{label:'Poništi',fn:()=>{t[L].splice(i,0,row);tPut(t);}});},
  tripInfoAdd:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);t.info.push({id:uid('i'),k:'',v:''});tPut(t);const ks=$$('.kv-k');ks.length&&ks[ks.length-1].focus();},
  tripInfoTpl:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);['Check-in','Check-out','Broj rezervacije','Kontakt smještaja','Parking','Wi-Fi lozinka','Hitni broj'].forEach(k=>t.info.push({id:uid('i'),k,v:k==='Hitni broj'?'112':''}));tPut(t);},
  tripPackTpl:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);const g=el.dataset.v;const have=new Set(t.packing.filter(p=>p.group===g).map(p=>p.text));PACK_TPL[g].forEach(x=>{if(!have.has(x))t.packing.push({id:uid('pk'),group:g,text:x,done:false});});tPut(t);},
  tripUnpack:el=>{const t=docById(el.dataset.id);if(!t)return;t.packing.forEach(p=>p.done=false);tPut(t);},
  tripPackAdd:el=>{const t=docById(el.dataset.id);if(!t||!el.value.trim())return;el.value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean).forEach(x=>t.packing.push({id:uid('pk'),group:el.dataset.g,text:x,done:false}));const g=el.dataset.g;el.value='';tPut(t);
    const n=$$('.pack-in').find(x=>x.dataset.g===g);n&&n.focus();},
  tripGroupAdd:el=>{const t=docById(el.dataset.id);const inp=$('#packNewG');if(!t||!inp.value.trim())return inp&&inp.focus();const g=inp.value.trim();t.packGroups=[...new Set([...(t.packGroups||[]),g])];tPut(t);
    const n=$$('.pack-in').find(x=>x.dataset.g===g);n&&n.focus();},
  tripPackCopy:el=>{const t=docById(el.dataset.id);if(!t)return;const others=trips().filter(x=>x.id!==t.id&&(x.packing||[]).length);if(!others.length){toast('Nema drugih izleta s popisom');return;}
    openSheet({title:'Kopiraj pakiranje iz…',side:true,body:`<div class="sheet-list">${others.map(o=>`<button class="row" data-o="${esc(o.id)}"><span class="emo">${esc(o.emoji||'🧳')}</span>${esc(o.title)}<span class="count">${o.packing.length}</span></button>`).join('')}</div>`,
      onOpen:e2=>$$('[data-o]',e2).forEach(b=>b.addEventListener('click',()=>{const o=docById(b.dataset.o);const have=new Set(t.packing.map(p=>p.group+'|'+p.text));o.packing.forEach(p=>{if(!have.has(p.group+'|'+p.text))t.packing.push({id:uid('pk'),group:p.group,text:p.text,done:false});});closeSheet();tPut(t);}))});},
  tripLinkAdd:el=>{const t=docById(el.dataset.id);const u=$('#tlU').value.trim();if(!t||!u)return $('#tlU').focus();normTrip(t);t.links.push({id:uid('l'),t:$('#tlT').value.trim(),u:normUrl(u),cat:$('#tlC').value});tPut(t);$('#tlU')&&$('#tlU').focus();},
  tripQuickLink:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);t.links.push({id:uid('l'),t:el.dataset.n+' — '+t.place,u:el.dataset.u,cat:el.dataset.c});tPut(t);},
  tripCostAdd:el=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);t.costs.push({id:uid('co'),cat:'🏨 Smještaj',n:'',amount:null,paid:false});tPut(t);},
  tripTodo:el=>{const t=docById(el.dataset.id);if(!t||!t.from)return;placeOnDate(fromInputDate(t.from),`${t.emoji||'🧳'} ${t.title} (${fmtRange(t)})`,{note:location.origin+location.pathname+'#/izleti/'+t.id});
    const pk=(t.packing||[]).filter(p=>!p.done).length;if(pk){const d=addDays(fromInputDate(t.from),-1);placeOnDate(d<today()?today():d,`🎒 Spakirati za: ${t.title} (${pk} stvari)`,{priority:'medium'});}saveData();toast('Dodano u tjedni plan',{label:'Prikaži',fn:()=>go('#/')});},
  tripImgCover:el=>{const t=docById(el.dataset.id);if(!t)return;t.cover=el.dataset.img;tPut(t);},
  tripImgDel:el=>{const t=docById(el.dataset.id);if(!t)return;const im=el.dataset.img;confirmSheet('Obrisati ovu sliku?',()=>{t.images=t.images.filter(x=>x!==im);if(t.cover===im)t.cover=t.images[0]||'';putDoc(t);imgDelete(im);renderAll();});},
  tripWebPick:el=>{const t=docById(el.dataset.id);if(!t)return;openWebPicker({title:'Fotka: '+(t.place||t.title),query:t.place||t.title,lead:t.place?['w:'+t.place]:null,onPick:(id,cr)=>{normTrip(t);t.images.push(id);t.cover=id;t.credits=Object.assign({},t.credits,{[id]:cr});tPut(t);}});},
});
FILE_ACT.tripImg=async(files,el)=>{const t=docById(el.dataset.id);if(!t)return;normTrip(t);await imgUploadMany(files,id=>{t.images.push(id);if(!t.cover)t.cover=id;});tPut(t);};
// preimenovanje grupe pakiranja (na blur)
document.addEventListener('change',e=>{const x=e.target;if(!x.dataset||x.dataset.actIn!=='tripGroupRen')return;const t=docById(x.dataset.id);const nv=x.value.trim();if(!t||!nv||nv===x.dataset.g)return;t.packing.forEach(p=>{if(p.group===x.dataset.g)p.group=nv;});t.packGroups=(t.packGroups||[]).map(g=>g===x.dataset.g?nv:g);tPut(t);});
BIND_HOOKS.trip=(t,path,el,isChange)=>{
  if(isChange&&(path==='from'||path==='to')){if(t.from&&!t.to)t.to=t.from;if(t.to&&t.from&&t.to<t.from)t.to=t.from;syncDays(t);putDoc(t);renderAll();return;}
  if(isChange&&(/\.(done|paid|start)$/.test(path)||path==='late'||/\.cat$/.test(path)))renderAll();
  if(/^costs\..*\.amount$/.test(path)){/* zbrojevi se osvježe pri idućem crtanju */}
};
let justDraggedTrip=false;
function tripSortables(){
  if(!window.Sortable)return;
  $$('.tlist').forEach(el=>sortables.push(Sortable.create(el,{group:'trip',animation:160,delay:200,delayOnTouchOnly:true,touchStartThreshold:6,ghostClass:'s-ghost',chosenClass:'s-chosen',filter:'a',preventOnFilter:false,forceFallback:true,fallbackOnBody:true,fallbackTolerance:4,
    onStart:()=>{dragging=true;vibrate(8);},
    onEnd:()=>{dragging=false;justDraggedTrip=true;setTimeout(()=>justDraggedTrip=false,120);const t=docById(el.dataset.trip);if(!t){renderAll();return;}
      $$('.tlist').forEach(l=>{t.order[l.dataset.col]=$$('.tc',l).map(c=>c.dataset.id);});putDoc(t);setTimeout(renderAll,0);}})));
}
function tripsDashCard(){
  const t0=localISO(today());const up=trips().filter(t=>t.status!=='idea'&&t.status!=='done'&&t.from&&(t.to||t.from)>=t0).sort((a,b)=>a.from.localeCompare(b.from));
  const t=up[0];if(!t)return'';const d=Math.round((fromInputDate(t.from)-today())/864e5);if(d>60)return'';const s=tripStats(t);
  return`<a class="card trip-dash" href="#/izleti/${encodeURIComponent(t.id)}" style="--h:${hueOf(t.place||t.title)}"><div class="td-img">${t.cover?imgTag(t.cover):`<span>${esc(t.emoji||'🧳')}</span>`}</div>
    <div class="td-b"><small>✈️ SLJEDEĆI IZLET</small><b>${esc(t.title)}</b><span>${esc(fmtRange(t))}${t.place?' · '+esc(t.place):''}</span>
    <div class="dmeta">${untilTxt(t)?`<span class="can">${esc(untilTxt(t))}</span>`:''}${s.pk?`<span>🎒 ${s.pd}/${s.pk}</span>`:''}${s.verify?`<span class="miss">⚠️ ${s.verify} provjeriti</span>`:''}</div></div></a>`;
}
INPUT_SET.tripSearch=v=>{TUI.q=v;};
VIEWS.izleti={render:viewTrips,after:tripSortables,label:'Izleti i putovanja'};
