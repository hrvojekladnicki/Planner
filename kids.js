'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   KIDS — školski raspored, zvono (A/B smjene), predmeti, aktivnosti, važni datumi
   Podaci su u glavnom planneru: state.kids = [ {...dijete} ]
   tt[smjena][dan 0-6][indeks sata] = id predmeta
   ═══════════════════════════════════════════════════════════════════════ */
const KID_COLORS=['#5b4ff0','#d4572a','#1a9a68','#2f8fbf','#c98a10','#c2338a','#7a5af8','#e0533d'];
const SUBJ_COLORS=['#e0533d','#2f8fbf','#1a9a68','#c98a10','#7a5af8','#c2338a','#0f9aa8','#8a6d3b','#d4572a','#5b4ff0','#4f8a10','#b8336a'];
const DEFAULT_SUBJ=['Hrvatski jezik','Matematika','Engleski jezik','Priroda i društvo','Likovna kultura','Glazbena kultura','Tjelesna i zdravstvena kultura','Vjeronauk','Informatika','Njemački jezik','Priroda','Biologija','Povijest','Geografija','Fizika','Kemija','Tehnička kultura','Sat razrednika'];
const EVT={test:['📝','Test / ispit'],usmeno:['🗣️','Usmeno'],zadaca:['📚','Zadaća / projekt'],lektira:['📖','Lektira'],izlet:['🚌','Izlet / događaj'],roditeljski:['👪','Roditeljski'],free:['🏖️','Nema nastave'],ostalo:['📌','Ostalo']};
const KUI2={tab:{},shift:{}};
function kids(){if(!Array.isArray(state.kids))state.kids=[];return state.kids;}
function kidById(id){return kids().find(k=>k.id===id)||null;}
function genBells(start='08:00',n=7,len=45,small=5,big=15,bigAfter=2){
  let [h,m]=start.split(':').map(Number);let t=h*60+m;const out=[];
  for(let i=0;i<n;i++){const s=t,e=t+len;out.push({id:uid('bl'),s:hm(s),e:hm(e)});t=e+(i+1===bigAfter?big:small);}
  return out;
}
function hm(min){return`${String(Math.floor(min/60)%24).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`;}
function toMin(s){if(!s)return null;const[h,m]=String(s).split(':').map(Number);return isNaN(h)?null:h*60+(m||0);}
function newKid(){
  const n=kids().length;
  return{id:uid('k'),name:'',emoji:['🧒','👧','👦','🧑'][n%4],color:KID_COLORS[n%KID_COLORS.length],school:'',cls:'',shiftMode:'single',refWeek:localISO(getMonday(today())),refShift:'A',
    shiftNames:{A:'Jutarnja',B:'Popodnevna'},bells:{A:genBells('08:00'),B:genBells('14:00')},tt:{A:{},B:{}},subjects:[],acts:[],events:[],sat:false};
}
function normKid(k){
  k.shiftNames=Object.assign({A:'Jutarnja',B:'Popodnevna'},k.shiftNames||{});
  k.bells=k.bells||{};['A','B'].forEach(s=>{if(!Array.isArray(k.bells[s]))k.bells[s]=genBells(s==='A'?'08:00':'14:00');k.tt=k.tt||{};if(!k.tt[s]||typeof k.tt[s]!=='object')k.tt[s]={};});
  ['subjects','acts','events'].forEach(x=>{if(!Array.isArray(k[x]))k[x]=[];});
  return k;
}
function shiftFor(k,d){
  if(k.shiftMode!=='alt')return'A';
  const ref=getMonday(fromInputDate(k.refWeek||localISO(getMonday(today()))));const w=Math.round((getMonday(d)-ref)/(7*864e5));
  const other=k.refShift==='A'?'B':'A';return Math.abs(w)%2===0?k.refShift||'A':other;
}
function subjById(k,id){return k.subjects.find(s=>s.id===id)||null;}
function freeEvent(k,d){const iso=localISO(d);return k.events.find(e=>e.type==='free'&&e.date===iso)||null;}
function daySchedule(k,d){
  const di=dayIdx(d);const sh=shiftFor(k,d);const bells=k.bells[sh]||[];const row=(k.tt[sh]||{})[di]||{};
  const free=freeEvent(k,d);
  const periods=bells.map((b,i)=>({i,b,subj:row[i]?subjById(k,row[i]):null})).filter(p=>p.subj);
  const acts=k.acts.filter(a=>+a.day===di).sort((a,b)=>(a.s||'').localeCompare(b.s||''));
  if(free||!periods.length)return{sh,periods:[],acts,free,start:null,end:null};
  return{sh,periods,acts,free:null,start:periods[0].b.s,end:periods[periods.length-1].b.e};
}
function nowStatus(sc){
  if(!sc.start)return null;const n=new Date();const now=n.getHours()*60+n.getMinutes();
  const s=toMin(sc.start),e=toMin(sc.end);
  if(now<s)return{t:'before',txt:`Počinje u ${sc.start} (za ${fmtMin(s-now)})`,pct:0};
  if(now>=e)return{t:'after',txt:`Nastava završila u ${sc.end}`,pct:100};
  const cur=sc.periods.find(p=>now>=toMin(p.b.s)&&now<toMin(p.b.e));const pct=Math.round((now-s)/(e-s)*100);
  if(cur)return{t:'in',txt:`Sad: ${cur.i+1}. sat · ${cur.subj.n} (do ${cur.b.e})`,pct,cur:cur.i};
  const nx=sc.periods.find(p=>toMin(p.b.s)>now);return{t:'break',txt:nx?`Odmor · ${nx.i+1}. sat ${nx.subj.n} u ${nx.b.s}`:'Odmor',pct};
}
function upcomingEvents(k,days=14){const t=localISO(today());const lim=localISO(addDays(today(),days));return k.events.filter(e=>!e.done&&e.date>=t&&e.date<=lim&&e.type!=='free').sort((a,b)=>a.date.localeCompare(b.date));}
function relDay(iso){const d=fromInputDate(iso);const diff=Math.round((d-today())/864e5);return diff===0?'danas':diff===1?'sutra':diff<0?`prije ${-diff} d`:diff<7?`za ${diff} dana (${DAY_SHORT[dayIdx(d)]})`:formatDayLabel(d);}
function evHTML(k,e,showKid){const s=subjById(k,e.subj);const T=EVT[e.type]||EVT.ostalo;const d=fromInputDate(e.date);const soon=Math.round((d-today())/864e5)<=2;
  return`<div class="kev${e.done?' done':''}${soon&&!e.done?' soon':''}"><span class="kev-ico">${T[0]}</span><div class="kev-tx"><b>${esc(T[1])}${s?` · <span style="color:${esc(s.color)}">${esc(s.n)}</span>`:''}</b>${e.note?`<small>${linkify(e.note)}</small>`:''}</div>
    <span class="kev-d">${showKid?`${esc(k.emoji)} `:''}${esc(relDay(e.date))}</span></div>`;}
function subjChip(s,small){return s?`<span class="subj${small?' sm':''}" style="--sc:${esc(s.color)}">${esc(s.n)}</span>`:'';}
function kidTodayHTML(k,{compact=false}={}){
  const d=new Date();const td=today();const we=dayIdx(td)>4&&!k.sat;
  const sc=daySchedule(k,td);const ns=nowStatus(sc);
  let next=null;for(let i=1;i<=7;i++){const dd=addDays(td,i);if(dayIdx(dd)>4&&!k.sat)continue;const s=daySchedule(k,dd);if(s.start||s.free){next={d:dd,s};break;}}
  const head=sc.free?`<div class="kt-big free">🏖️ Danas nema nastave<small>${esc(sc.free.note||'')}</small></div>`:
    we?`<div class="kt-big free">🎉 Vikend</div>`:
    sc.start?`<div class="kt-big"><span>U školi</span><b>${esc(sc.start)} – ${esc(sc.end)}</b><small>${sc.periods.length} ${plural(sc.periods.length,'sat','sata','sati')}${k.shiftMode==='alt'?` · ${esc(k.shiftNames[sc.sh])} smjena`:''}</small></div>`:
    `<div class="kt-big free">Danas nema nastave u rasporedu</div>`;
  return`<div class="ktoday" style="--kc:${esc(k.color)}">
    ${head}
    ${ns?`<div class="kt-now ${ns.t}"><div class="bar"><i style="width:${ns.pct}%"></i></div><span>${esc(ns.txt)}</span></div>`:''}
    ${sc.periods.length&&!compact?`<div class="kt-periods">${sc.periods.map(p=>`<div class="ktp${ns&&ns.cur===p.i?' cur':''}${ns&&toMin(p.b.e)<=new Date().getHours()*60+new Date().getMinutes()?' past':''}"><span class="t">${p.i+1}. · ${esc(p.b.s)}</span>${subjChip(p.subj)}</div>`).join('')}</div>`:''}
    ${sc.periods.length&&compact?`<div class="kt-subj">${sc.periods.map(p=>subjChip(p.subj,true)).join('')}</div>`:''}
    ${sc.acts.length?`<div class="kt-acts">${sc.acts.map(a=>`<span class="pill">⚽ ${esc(a.n)} ${esc(a.s||'')}${a.e?'–'+esc(a.e):''}</span>`).join('')}</div>`:''}
    ${next&&!compact?`<div class="kt-next"><b>${esc(shortDay(next.d))}:</b> ${next.s.free?'nema nastave':`${esc(next.s.start)} – ${esc(next.s.end)} · ${next.s.periods.map(p=>esc(p.subj.n)).join(', ')}`}</div>`:''}
  </div>`;
}
function viewKids(r){
  if(r.id)return viewKid(r.id);
  const ks=kids();
  const evs=ks.flatMap(k=>upcomingEvents(k,21).map(e=>({k,e}))).sort((a,b)=>a.e.date.localeCompare(b.e.date));
  return`
  <div class="page-head"><div><a class="crumb" href="#/">${icon('chevL')}Dashboard</a><h1>🧒 Kids</h1><p>Školski raspored, smjene, aktivnosti i važni datumi.</p></div>
    <div class="head-acts"><button class="btn btn-primary" data-act="kidEdit" data-id="">${icon('plus')}Dodaj dijete</button></div></div>
  ${!ks.length?`<section class="card hero-empty"><div><span class="big">🎒</span><h2>Dodaj dijete</h2><p>Upiši raspored sati i vrijeme zvona (i A/B smjene ako se izmjenjuju) — na početnoj ćeš uvijek vidjeti do kada je dijete u školi i koji su predmeti.</p>
    <div class="btn-row" style="justify-content:center"><button class="btn btn-primary" data-act="kidEdit" data-id="">${icon('plus')}Dodaj dijete</button></div></div></section>`:`
  <div class="kgrid">${ks.map(k=>`<a class="card kcard" href="#/kids/${encodeURIComponent(k.id)}" style="--kc:${esc(k.color)}">
    <div class="kcard-head"><span class="kav">${esc(k.emoji||'🧒')}</span><div><b>${esc(k.name||'Dijete')}</b><small>${esc([k.cls,k.school].filter(Boolean).join(' · ')||'Dodaj razred i školu')}</small></div>${icon('chevR')}</div>
    ${kidTodayHTML(k)}</a>`).join('')}</div>
  <section class="card" style="margin-top:18px"><div class="card-head"><h2>📅 Nadolazeće (3 tjedna)</h2></div>
    <div class="card-body">${evs.length?evs.map(({k,e})=>evHTML(k,e,ks.length>1)).join(''):`<div class="empty">Nema testova ni događaja. Dodaj ih na stranici djeteta → Važni datumi.</div>`}</div></section>`}`;
}
function viewKid(id){
  const k=kidById(id);if(!k)return`<div class="card empty" style="padding:40px">Dijete nije pronađeno. <a class="link-btn" href="#/kids">Natrag</a></div>`;
  normKid(k);const tab=KUI2.tab[id]||'today';const B=`data-bind="state"`;const P=`kids.${esc(k.id)}`;
  const curSh=shiftFor(k,today());const sh=KUI2.shift[id]||curSh;
  const tabs=[['today','Danas'],['tt','Raspored'],['bells','Zvono'],['subj','Predmeti',k.subjects.length],['acts','Aktivnosti',k.acts.length],['ev','Važni datumi',upcomingEvents(k,60).length]];
  const shiftSeg=k.shiftMode==='alt'?`<div class="seg">${['A','B'].map(s=>`<button class="${sh===s?'on':''}" data-act="kidShift" data-id="${esc(k.id)}" data-v="${s}">${esc(k.shiftNames[s])}${s===curSh?' <small>· ovaj tj.</small>':''}</button>`).join('')}</div>`:'';
  let body='';
  if(tab==='today'){
    const wk=getWeekDays(getMonday(today())).slice(0,k.sat?6:5);
    body=`<div class="kid-today-grid">
      <section class="card"><div class="card-head"><h2>Danas · ${esc(DAY_NAMES[dayIdx(today())])}</h2></div><div class="card-body">${kidTodayHTML(k)}</div></section>
      <section class="card"><div class="card-head"><h2>Ovaj tjedan</h2></div><div class="card-body kweek">
        ${wk.map(d=>{const s=daySchedule(k,d);return`<div class="kw${isToday(d)?' today':''}${isPast(d)&&!isToday(d)?' past':''}"><b>${DAY_SHORT[dayIdx(d)]} <small>${d.getDate()}.</small></b>
          <span class="kw-t">${s.free?'🏖️ slobodno':s.start?`${esc(s.start)}–${esc(s.end)}`:'—'}</span>
          <span class="kw-s">${s.periods.map(p=>subjChip(p.subj,true)).join('')}</span>
          ${k.events.filter(e=>e.date===localISO(d)&&e.type!=='free').map(e=>`<span class="pill pill-urgent">${(EVT[e.type]||EVT.ostalo)[0]} ${esc((subjById(k,e.subj)||{}).n||(EVT[e.type]||EVT.ostalo)[1])}</span>`).join('')}</div>`;}).join('')}
      </div></section>
    </div>
    <section class="card"><div class="card-head"><h2>📅 Nadolazeće</h2><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-act="kidTab" data-id="${esc(k.id)}" data-v="ev">${icon('plus')}Dodaj</button></div>
      <div class="card-body">${upcomingEvents(k,30).map(e=>evHTML(k,e)).join('')||'<div class="empty">Ništa u idućih 30 dana.</div>'}</div></section>`;
  }
  if(tab==='tt'){
    const bells=k.bells[sh];const days=k.sat?6:5;const tt=k.tt[sh];const ti=dayIdx(today());
    body=`<section class="card"><div class="card-head"><h2>${icon('calendar')} Raspored sati</h2><span class="spacer"></span>${shiftSeg}
      ${k.shiftMode==='alt'?`<button class="btn btn-ghost btn-sm" data-act="kidCopyTT" data-id="${esc(k.id)}" data-from="${sh}">${icon('copy')}Kopiraj u ${esc(k.shiftNames[sh==='A'?'B':'A'])}</button>`:''}</div>
      <div class="card-body"><div class="tt-wrap"><div class="tt" style="grid-template-columns:96px repeat(${days},minmax(110px,1fr))">
        <div class="tt-h"></div>${Array.from({length:days},(_,d)=>`<div class="tt-h${d===ti&&sh===curSh?' today':''}">${DAY_NAMES[d]}</div>`).join('')}
        ${bells.map((b,i)=>`<div class="tt-b"><b>${i+1}.</b><small>${esc(b.s)}–${esc(b.e)}</small></div>${Array.from({length:days},(_,d)=>{const s=subjById(k,(tt[d]||{})[i]);
          return`<button class="tt-c${s?' has':''}${d===ti&&sh===curSh?' today':''}" style="${s?`--sc:${esc(s.color)}`:''}" data-act="ttPick" data-id="${esc(k.id)}" data-sh="${sh}" data-d="${d}" data-i="${i}">${s?esc(s.n):'<span>+</span>'}</button>`;}).join('')}`).join('')}
      </div></div>
      <p class="hint">Klikni polje i odaberi predmet. ${k.subjects.length?'':'<b>Prvo dodaj predmete</b> (kartica Predmeti) — ili ih upiši izravno u polje.'} Vremena sati mijenjaš u kartici Zvono.</p></div></section>`;
  }
  if(tab==='bells'){
    const bells=k.bells[sh];
    body=`<section class="card"><div class="card-head"><h2>🔔 Raspored zvona${k.shiftMode==='alt'?' · '+esc(k.shiftNames[sh]):''}</h2><span class="spacer"></span>${shiftSeg}</div>
      <div class="card-body">
        <div class="bells">${bells.map((b,i)=>`<div class="bell"><b>${i+1}. sat</b><input type="time" class="input" ${B} data-path="${P}.bells.${sh}.${esc(b.id)}.s" value="${esc(b.s)}"><span>–</span><input type="time" class="input" ${B} data-path="${P}.bells.${sh}.${esc(b.id)}.e" value="${esc(b.e)}">
          ${i===bells.length-1?`<button class="ibtn ibtn-danger" data-act="bellDel" data-id="${esc(k.id)}" data-sh="${sh}" aria-label="Ukloni zadnji sat">${icon('x')}</button>`:''}</div>`).join('')}</div>
        <div class="btn-row"><button class="btn btn-ghost btn-sm" data-act="bellAdd" data-id="${esc(k.id)}" data-sh="${sh}">${icon('plus')}Dodaj sat</button></div>
        <details class="gen"><summary>${icon('wand')}Generiraj automatski</summary>
          <div class="grid2" style="grid-template-columns:repeat(auto-fill,minmax(130px,1fr));margin-top:10px">
            <div class="field"><label>Početak</label><input type="time" id="bg_s" value="${esc((bells[0]||{}).s||(sh==='A'?'08:00':'14:00'))}"></div>
            <div class="field"><label>Broj sati</label><input id="bg_n" inputmode="numeric" value="${bells.length||7}"></div>
            <div class="field"><label>Trajanje sata</label><input id="bg_l" inputmode="numeric" value="45"></div>
            <div class="field"><label>Mali odmor</label><input id="bg_sm" inputmode="numeric" value="5"></div>
            <div class="field"><label>Veliki odmor</label><input id="bg_b" inputmode="numeric" value="15"></div>
            <div class="field"><label>…nakon sata</label><input id="bg_ba" inputmode="numeric" value="2"></div>
          </div>
          <div class="btn-row"><button class="btn btn-week btn-sm" data-act="bellGen" data-id="${esc(k.id)}" data-sh="${sh}">${icon('refresh')}Postavi zvono</button><small class="hint">Raspored predmeta ostaje (po rednom broju sata).</small></div>
        </details>
      </div></section>`;
  }
  if(tab==='subj'){
    body=`<section class="card"><div class="card-head"><h2>📚 Predmeti</h2><span class="spacer"></span>${!k.subjects.length?`<button class="btn btn-week btn-sm" data-act="subjDefaults" data-id="${esc(k.id)}">${icon('wand')}Dodaj uobičajene predmete</button>`:''}</div>
      <div class="card-body"><div class="subj-list">${k.subjects.map(s=>`<div class="subj-row"><input type="color" ${B} data-path="${P}.subjects.${esc(s.id)}.color" value="${esc(s.color)}" aria-label="Boja">
        <input class="input" ${B} data-path="${P}.subjects.${esc(s.id)}.n" value="${esc(s.n)}" placeholder="Predmet">
        <input class="input" ${B} data-path="${P}.subjects.${esc(s.id)}.teacher" value="${esc(s.teacher||'')}" placeholder="Učitelj/ica, kontakt…">
        <button class="ibtn ibtn-danger" data-act="kidRowDel" data-id="${esc(k.id)}" data-list="subjects" data-row="${esc(s.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')||'<div class="empty">Još nema predmeta.</div>'}</div>
        <div class="add-row"><input class="input" id="subjAdd" data-enter="subjAdd" data-id="${esc(k.id)}" placeholder="Novi predmet… (više odvoji zarezom)"><button class="btn btn-primary" data-act="subjAdd" data-id="${esc(k.id)}">${icon('plus')}<span>Dodaj</span></button></div></div></section>`;
  }
  if(tab==='acts'){
    body=`<section class="card"><div class="card-head"><h2>⚽ Izvanškolske aktivnosti</h2></div>
      <div class="card-body"><div class="acts">${k.acts.map(a=>`<div class="act-row"><input class="input" ${B} data-path="${P}.acts.${esc(a.id)}.n" value="${esc(a.n)}" placeholder="Aktivnost">
        <select class="input" ${B} data-path="${P}.acts.${esc(a.id)}.day">${DAY_NAMES.map((d,i)=>`<option value="${i}" ${+a.day===i?'selected':''}>${d}</option>`).join('')}</select>
        <input type="time" class="input" ${B} data-path="${P}.acts.${esc(a.id)}.s" value="${esc(a.s||'')}"><input type="time" class="input" ${B} data-path="${P}.acts.${esc(a.id)}.e" value="${esc(a.e||'')}">
        <input class="input" ${B} data-path="${P}.acts.${esc(a.id)}.place" value="${esc(a.place||'')}" placeholder="Mjesto / napomena">
        <button class="ibtn ibtn-danger" data-act="kidRowDel" data-id="${esc(k.id)}" data-list="acts" data-row="${esc(a.id)}" aria-label="Ukloni">${icon('x')}</button></div>`).join('')||'<div class="empty">Trening, glazbena, strani jezik… prikazuju se uz raspored dana.</div>'}</div>
        <div class="btn-row"><button class="btn btn-primary btn-sm" data-act="actAdd" data-id="${esc(k.id)}">${icon('plus')}Dodaj aktivnost</button></div></div></section>`;
  }
  if(tab==='ev'){
    const all=[...k.events].sort((a,b)=>a.date.localeCompare(b.date));const t=localISO(today());
    const up=all.filter(e=>e.date>=t),past=all.filter(e=>e.date<t).reverse();
    const row=e=>`<div class="ev-row${e.done?' done':''}"><label class="cbx-l"><input type="checkbox" ${B} data-path="${P}.events.${esc(e.id)}.done" ${e.done?'checked':''}><span class="check">${icon('check')}</span></label>${evHTML(k,e)}<button class="ibtn ibtn-danger" data-act="kidRowDel" data-id="${esc(k.id)}" data-list="events" data-row="${esc(e.id)}" aria-label="Ukloni">${icon('x')}</button></div>`;
    body=`<section class="card"><div class="card-head"><h2>➕ Novi datum</h2></div><div class="card-body">
      <div class="ev-form"><div class="field"><label>Datum</label><input type="date" id="ev_d" value="${localISO(addDays(today(),1))}"></div>
        <div class="field"><label>Vrsta</label><select id="ev_t">${Object.entries(EVT).map(([k2,v])=>`<option value="${k2}">${v[0]} ${v[1]}</option>`).join('')}</select></div>
        <div class="field"><label>Predmet</label><select id="ev_s"><option value="">—</option>${k.subjects.map(s=>`<option value="${esc(s.id)}">${esc(s.n)}</option>`).join('')}</select></div>
        <div class="field" style="flex:2"><label>Napomena</label><input id="ev_n" data-enter="evAdd" data-id="${esc(k.id)}" placeholder="npr. razlomci, str. 40–52"></div>
        <button class="btn btn-primary" data-act="evAdd" data-id="${esc(k.id)}">${icon('plus')}Dodaj</button></div>
      <label class="switch" style="margin-top:10px"><input type="checkbox" id="ev_todo"><span class="track"></span>Dodaj i podsjetnik u tjedni plan (dan prije)</label></div></section>
      <section class="card"><div class="card-head"><h2>Nadolazeće <small>${up.length}</small></h2></div><div class="card-body">${up.map(row).join('')||'<div class="empty">Nema nadolazećih datuma.</div>'}</div></section>
      ${past.length?`<details class="card hist"><summary class="card-head"><h2>Prošlo <small>${past.length}</small></h2></summary><div class="card-body">${past.slice(0,40).map(row).join('')}</div></details>`:''}`;
  }
  return`
  <div class="page-head"><div><a class="crumb" href="#/kids">${icon('chevL')}Kids</a>
    <h1><span class="kav big" style="--kc:${esc(k.color)}">${esc(k.emoji||'🧒')}</span>${esc(k.name||'Dijete')}</h1>
    <p>${esc([k.cls&&k.cls+(/\d$/.test(k.cls)?'. razred':''),k.school].filter(Boolean).join(' · '))}${k.shiftMode==='alt'?` · ovaj tjedan <b>${esc(k.shiftNames[curSh])}</b> smjena`:''}</p></div>
    <div class="head-acts"><button class="btn btn-outline btn-sm" data-act="kidEdit" data-id="${esc(k.id)}">${icon('edit')}Uredi</button></div></div>
  <div class="ptabs seg seg-scroll">${tabs.map(([t,l,n])=>`<button class="${tab===t?'on':''}" data-act="kidTab" data-id="${esc(k.id)}" data-v="${t}">${l}${n?` <small>${n}</small>`:''}</button>`).join('')}</div>
  ${body}`;
}
function openKidEditor(id){
  const k=id?kidById(id):null;const d=k||newKid();const curSh=k?shiftFor(k,today()):'A';
  openSheet({title:k?'Uredi':'Novo dijete',body:`
    <div class="grid2" style="grid-template-columns:80px 1fr">
      <div class="field"><label for="kd_e">Ikona</label><input id="kd_e" value="${esc(d.emoji)}" maxlength="4" style="text-align:center;font-size:1.4rem"></div>
      <div class="field"><label for="kd_n">Ime</label><input id="kd_n" value="${esc(d.name)}" placeholder="Ime" maxlength="30"></div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap" id="kdPick">${['🧒','👧','👦','🧑','👶','🦊','🐻','🦄','⚽','🎨','🎸','🚀'].map(e=>`<button class="ibtn" style="font-size:1.2rem;background:var(--surface-2)" data-e="${e}">${e}</button>`).join('')}</div>
    <div class="field"><label>Boja</label><div style="display:flex;gap:8px;flex-wrap:wrap" id="kdCol">${KID_COLORS.map(c=>`<button class="cdot${d.color===c?' on':''}" style="background:${c}" data-c="${c}" aria-label="Boja"></button>`).join('')}</div></div>
    <div class="grid2"><div class="field"><label for="kd_s">Škola / vrtić</label><input id="kd_s" value="${esc(d.school||'')}" placeholder="OŠ …"></div>
      <div class="field"><label for="kd_c">Razred</label><input id="kd_c" value="${esc(d.cls||'')}" placeholder="npr. 3.b"></div></div>
    <div class="field"><label>Smjene</label><div class="seg" id="kdMode"><button class="${d.shiftMode!=='alt'?'on':''}" data-v="single">Uvijek isto</button><button class="${d.shiftMode==='alt'?'on':''}" data-v="alt">Izmjenjuju se tjedno (A/B)</button></div></div>
    <div id="kdAlt" class="grid2" style="${d.shiftMode==='alt'?'':'display:none'}">
      <div class="field"><label for="kd_a">Naziv smjene A</label><input id="kd_a" value="${esc(d.shiftNames.A)}"></div>
      <div class="field"><label for="kd_b">Naziv smjene B</label><input id="kd_b" value="${esc(d.shiftNames.B)}"></div>
      <div class="field full"><label for="kd_cur">Ovaj tjedan je</label><select id="kd_cur"><option value="A" ${curSh==='A'?'selected':''}>${esc(d.shiftNames.A)} (A)</option><option value="B" ${curSh==='B'?'selected':''}>${esc(d.shiftNames.B)} (B)</option></select></div></div>
    <label class="switch"><input type="checkbox" id="kd_sat" ${d.sat?'checked':''}><span class="track"></span>Nastava i subotom</label>`,
    actions:[...(k?[{label:icon('trash')+'Obriši',cls:'btn-danger',left:true,fn:()=>confirmSheet(`Obrisati “${k.name}” i cijeli raspored?`,()=>{const i=kids().indexOf(k);kids().splice(i,1);saveData();go('#/kids');toast('Obrisano',{label:'Poništi',fn:()=>{kids().splice(i,0,k);saveData();go('#/kids/'+k.id);}});})}]:[]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(k?'Spremi':'Dodaj'),cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');const name=$('#kd_n',el).value.trim();if(!name){$('#kd_n',el).focus();return;}
        Object.assign(d,{name,emoji:$('#kd_e',el).value.trim()||'🧒',school:$('#kd_s',el).value.trim(),cls:$('#kd_c',el).value.trim(),sat:$('#kd_sat',el).checked,
          color:($('#kdCol .on',el)||{}).dataset?.c||d.color,shiftMode:$('#kdMode .on',el).dataset.v});
        d.shiftNames={A:$('#kd_a',el).value.trim()||'Jutarnja',B:$('#kd_b',el).value.trim()||'Popodnevna'};
        if(d.shiftMode==='alt'){d.refWeek=localISO(getMonday(today()));d.refShift=$('#kd_cur',el).value;}
        if(!k)kids().push(d);closeSheet();saveData();go('#/kids/'+d.id);if(!k){KUI2.tab[d.id]='subj';renderAll();}}}],
    onOpen:el=>{$$('#kdPick button',el).forEach(b=>b.addEventListener('click',()=>{$('#kd_e',el).value=b.dataset.e;}));
      $$('#kdCol .cdot',el).forEach(b=>b.addEventListener('click',()=>{$$('#kdCol .cdot',el).forEach(x=>x.classList.toggle('on',x===b));}));
      $$('#kdMode button',el).forEach(b=>b.addEventListener('click',()=>{$$('#kdMode button',el).forEach(x=>x.classList.toggle('on',x===b));$('#kdAlt',el).style.display=b.dataset.v==='alt'?'':'none';}));
      if(!k)$('#kd_n',el).focus();}});
}
function openTTPicker(k,sh,d,i){
  const cur=((k.tt[sh]||{})[d]||{})[i];const b=k.bells[sh][i];
  openSheet({title:`${DAY_NAMES[d]} · ${i+1}. sat <small style="color:var(--text-3);font-size:.9rem">${esc(b.s)}–${esc(b.e)}</small>`,body:`
    <div class="subj-pick">${k.subjects.map(s=>`<button class="subj big${cur===s.id?' on':''}" style="--sc:${esc(s.color)}" data-s="${esc(s.id)}">${esc(s.n)}</button>`).join('')}
      <button class="subj big none${!cur?' on':''}" data-s="">— slobodno</button></div>
    <div class="add-row"><input class="input" id="ttNew" placeholder="Novi predmet…"><button class="btn btn-ghost" id="ttNewBtn">${icon('plus')}Dodaj i postavi</button></div>
    <label class="switch"><input type="checkbox" id="ttNext"><span class="track"></span>Nakon odabira prijeđi na idući sat</label>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>{
      const nx=$('#ttNext',el);nx.checked=lsGet('planner.ttnext','1')==='1';nx.addEventListener('change',()=>lsSet('planner.ttnext',nx.checked?'1':'0'));
      const set=sid=>{k.tt[sh]=k.tt[sh]||{};k.tt[sh][d]=k.tt[sh][d]||{};if(sid)k.tt[sh][d][i]=sid;else delete k.tt[sh][d][i];saveData();renderAll();
        if(nx.checked){let ni=i+1,nd=d;if(ni>=k.bells[sh].length){ni=0;nd=d+1;}if(nd<(k.sat?6:5)){openTTPicker(k,sh,nd,ni);return;}}closeSheet();};
      $$('[data-s]',el).forEach(x=>x.addEventListener('click',()=>set(x.dataset.s)));
      const add=()=>{const n=$('#ttNew',el).value.trim();if(!n)return;let s=k.subjects.find(x=>x.n.toLowerCase()===n.toLowerCase());if(!s){s={id:uid('sb'),n,color:SUBJ_COLORS[k.subjects.length%SUBJ_COLORS.length],teacher:''};k.subjects.push(s);}set(s.id);};
      $('#ttNewBtn',el).addEventListener('click',add);$('#ttNew',el).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();add();}});
    }});
}
Object.assign(ACT,{
  kidEdit:el=>openKidEditor(el.dataset.id||null),
  kidTab:el=>{KUI2.tab[el.dataset.id]=el.dataset.v;renderAll();},
  kidShift:el=>{KUI2.shift[el.dataset.id]=el.dataset.v;renderAll();},
  ttPick:el=>{const k=kidById(el.dataset.id);if(k)openTTPicker(k,el.dataset.sh,+el.dataset.d,+el.dataset.i);},
  kidCopyTT:el=>{const k=kidById(el.dataset.id);if(!k)return;const f=el.dataset.from,t=f==='A'?'B':'A';confirmSheet2(`Kopirati raspored predmeta iz “${k.shiftNames[f]}” u “${k.shiftNames[t]}”?`,'Kopiraj',()=>{k.tt[t]=JSON.parse(JSON.stringify(k.tt[f]||{}));saveData();KUI2.shift[k.id]=t;renderAll();toast('Kopirano');});},
  bellAdd:el=>{const k=kidById(el.dataset.id);if(!k)return;const L=k.bells[el.dataset.sh];const last=L[L.length-1];const s=last?toMin(last.e)+5:8*60;L.push({id:uid('bl'),s:hm(s),e:hm(s+45)});saveData();renderAll();},
  bellDel:el=>{const k=kidById(el.dataset.id);if(!k)return;k.bells[el.dataset.sh].pop();saveData();renderAll();},
  bellGen:el=>{const k=kidById(el.dataset.id);if(!k)return;const n=x=>parseInt($(x).value,10);
    k.bells[el.dataset.sh]=genBells($('#bg_s').value||'08:00',Math.min(12,n('#bg_n')||7),n('#bg_l')||45,n('#bg_sm')||0,n('#bg_b')||0,n('#bg_ba')||0);saveData();renderAll();toast('Zvono postavljeno');},
  subjDefaults:el=>{const k=kidById(el.dataset.id);if(!k)return;DEFAULT_SUBJ.forEach((n,i)=>k.subjects.push({id:uid('sb'),n,color:SUBJ_COLORS[i%SUBJ_COLORS.length],teacher:''}));saveData();renderAll();toast('Dodano — obriši one koje dijete nema');},
  subjAdd:el=>{const k=kidById(el.dataset.id);const inp=$('#subjAdd');if(!k||!inp.value.trim())return inp&&inp.focus();inp.value.split(/[,\n]/).map(x=>x.trim()).filter(Boolean).forEach(n=>k.subjects.push({id:uid('sb'),n,color:SUBJ_COLORS[k.subjects.length%SUBJ_COLORS.length],teacher:''}));inp.value='';saveData();renderAll();const x=$('#subjAdd');x&&x.focus();},
  actAdd:el=>{const k=kidById(el.dataset.id);if(!k)return;k.acts.push({id:uid('a'),n:'',day:Math.min(4,dayIdx(today())),s:'17:00',e:'18:00',place:''});saveData();renderAll();const ins=$$('.act-row input');ins.length&&ins[ins.length-5].focus();},
  kidRowDel:el=>{const k=kidById(el.dataset.id);if(!k)return;const L=el.dataset.list;const i=k[L].findIndex(x=>x.id===el.dataset.row);if(i<0)return;const[row]=k[L].splice(i,1);saveData();renderAll();
    toast('Uklonjeno',{label:'Poništi',fn:()=>{k[L].splice(i,0,row);saveData();renderAll();}});},
  evAdd:el=>{const k=kidById(el.dataset.id);if(!k)return;const d=$('#ev_d').value;if(!d){$('#ev_d').focus();return;}
    const e={id:uid('e'),date:d,type:$('#ev_t').value,subj:$('#ev_s').value,note:$('#ev_n').value.trim(),done:false};k.events.push(e);
    if($('#ev_todo').checked&&e.type!=='free'){const s=subjById(k,e.subj);const T=EVT[e.type]||EVT.ostalo;const day=addDays(fromInputDate(d),-1);
      placeOnDate(day<today()?today():day,`${k.emoji} ${k.name}: ${T[1]}${s?' iz '+s.n:''} (${shortDay(fromInputDate(d))})${e.note?' — '+e.note:''}`,{priority:'medium'});}
    saveData();renderAll();toast('Dodano: '+relDay(d));},
});
BIND_HOOKS.state=(obj,path,el,isChange)=>{if(isChange&&/^kids\..*\.(done|day|color)$/.test(path))renderAll();};
// dashboard kartica
function kidsDashCard(){
  const ks=kids();if(!ks.length)return'';
  const evs=ks.flatMap(k=>upcomingEvents(k,7).map(e=>({k,e}))).sort((a,b)=>a.e.date.localeCompare(b.e.date)).slice(0,4);
  return`<section class="card kids-dash"><div class="card-head"><h2>🧒 Djeca danas</h2><span class="spacer"></span><a class="link-btn" href="#/kids">Raspored ${icon('arrowR')}</a></div>
    <div class="card-body"><div class="kdash">${ks.map(k=>`<a class="kdash-item" href="#/kids/${encodeURIComponent(k.id)}" style="--kc:${esc(k.color)}"><div class="kcard-head"><span class="kav">${esc(k.emoji)}</span><div><b>${esc(k.name)}</b><small>${esc(k.cls||'')}</small></div></div>${kidTodayHTML(k,{compact:true})}</a>`).join('')}</div>
    ${evs.length?`<div class="kdash-ev">${evs.map(({k,e})=>evHTML(k,e,ks.length>1)).join('')}</div>`:''}</div></section>`;
}
VIEWS.kids={render:viewKids,label:'Kids'};
// osvježi "sad je X. sat" svake minute dok je otvoren dashboard / kids
setInterval(()=>{const r=route();if((r.v==='kids'||r.v==='dash')&&!isBusy()&&!curSheet&&kids().length)renderAll();},60000);
