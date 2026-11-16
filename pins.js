'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   DASHBOARD LISTA (📌) + PONIŠTI/PONOVI
   Bilo što u Planneru (bilješka, lista, stavka liste, projekt, checklista
   projekta, zadatak projekta, recept, izlet) može se "zakačiti" na dashboard
   s prioritetom, rokom, podsjetnikom i bilješkom. state.pins = [...]
   ═══════════════════════════════════════════════════════════════════════ */
Object.assign(ICONS,{undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',filter:'<path d="M3 5h18l-7 8v6l-4 2v-8Z"/>'});
const PRIO_ORD={high:0,medium:1,low:2,'':3};
const PRIO_LBL={high:'Visok',medium:'Srednji',low:'Nizak','':'Bez'};
function pins(){if(!Array.isArray(state.pins))state.pins=[];return state.pins;}
function refKey(r){return r.t+':'+(r.pid?r.pid+'/':'')+r.id;}
function findPin(ref){const k=refKey(ref);return pins().find(p=>refKey(p.ref)===k)||null;}
function isPinned(ref){return!!findPin(ref);}
function pinBtn(ref,{label=false,cls='ibtn big'}={}){const p=findPin(ref);
  return`<button class="${cls}${p?' pin-on':''}" data-act="pin" data-t="${esc(ref.t)}" data-id="${esc(ref.id)}" ${ref.pid?`data-pid="${esc(ref.pid)}"`:''} title="${p?'Na dashboard listi — uredi':'Dodaj na dashboard listu (prioritet, rok, podsjetnik)'}">📌${label?` <span>${p?'Na dashboardu':'Na dashboard'}</span>`:''}</button>`;}

/* razriješi na što pin pokazuje */
function resolvePin(p){
  const r=p.ref;const out={title:p.text||'(obrisano)',emoji:'📌',href:'#/',src:'Ostalo',missing:false,items:null,done:false};
  try{
  if(r.t==='note'){const n=noteById(r.id);if(!n)return Object.assign(out,{missing:true});
    Object.assign(out,{title:noteName(n),emoji:splitName(noteName(n)).emo||'📝',href:'#/note/'+encodeURIComponent(n.id),src:'Notes',
      items:n.blocks.filter(b=>b.t==='c'&&b.x.trim()).map(b=>({id:b.id,x:b.x,d:b.d})),text:n.blocks.filter(b=>b.t==='p'&&b.x.trim()).map(b=>b.x).join(' ').slice(0,140)});}
  else if(r.t==='tab'){const tab=tabById(r.id);if(!tab)return Object.assign(out,{missing:true});const nm=splitName(tab.name);
    Object.assign(out,{title:nm.label,emoji:nm.emo||'📁',href:'#/tab/'+encodeURIComponent(tab.id),src:'Liste',items:(state.items[tab.id]||[]).map(i=>({id:i.id,x:i.desc,d:!!i.done}))});}
  else if(r.t==='item'){const f=findTask(r.id);if(!f||f.kind!=='item')return Object.assign(out,{missing:true});const tab=tabById(f.tabId);const t=f.task;
    Object.assign(out,{title:t.desc,emoji:tab?splitName(tab.name).emo||'📁':'📁',href:'#/tab/'+encodeURIComponent(f.tabId)+'/'+encodeURIComponent(t.id),src:'Liste · '+(tab?splitName(tab.name).label:''),
      items:(t.checks||[]).length?t.checks.map(c=>({id:c.id,x:c.x,d:c.d})):null,done:!!t.done,selfDone:true,text:t.info||'',link:t.link});}
  else if(r.t==='proj'){const d=docById(r.id);if(!d)return Object.assign(out,{missing:!docsLoaded?false:true,loading:!docsLoaded});const c=diyCat(d.cat);
    const st=(d.steps||[]).filter(x=>(x.x||'').trim());const tk=(d.tasks||[]).filter(x=>(x.x||'').trim());
    Object.assign(out,{title:d.title||'Projekt',emoji:d.emoji||'🛠️',href:'#/diy/p/'+encodeURIComponent(d.id),src:'Projekt · '+(c?c.name:''),items:(st.length?st:tk).map(x=>({id:x.id,x:x.x,d:!!x.d,date:x.date})),done:d.status==='done',text:d.desc||''});}
  else if(r.t==='pcl'){const d=docById(r.pid);const cl=d&&(d.checks||[]).find(x=>x.id===r.id);if(!cl)return Object.assign(out,{missing:docsLoaded,loading:!docsLoaded});const c=diyCat(d.cat);
    Object.assign(out,{title:cl.title||'Checklista',emoji:d.emoji||'☑️',href:'#/diy/p/'+encodeURIComponent(d.id),src:'Projekt · '+(c?c.name:'')+' · '+(d.title||''),items:(cl.items||[]).filter(i=>i.x).map(i=>({id:i.id,x:i.x,d:!!i.d}))});}
  else if(r.t==='ptask'){const d=docById(r.pid);const tk=d&&(d.tasks||[]).find(x=>x.id===r.id);if(!tk)return Object.assign(out,{missing:docsLoaded,loading:!docsLoaded});const c=diyCat(d.cat);
    Object.assign(out,{title:tk.x||'Zadatak',emoji:d.emoji||'🗓️',href:'#/diy/p/'+encodeURIComponent(d.id),src:'Projekt · '+(c?c.name:'')+' · '+(d.title||''),done:!!tk.d,selfDone:true,text:tk.note||'',due:tk.date});}
  else if(r.t==='cat'){const c=diyCat(r.id);if(!c)return Object.assign(out,{missing:true});const ids=catDesc(c.id);const ps=projects().filter(x=>ids.includes(x.cat));
    const tk=ps.flatMap(x=>(x.tasks||[]).filter(t=>(t.x||'').trim()).map(t=>({id:x.id+'|'+t.id,x:t.x+(ps.length>1?` · ${x.title||''}`:''),d:!!t.d,date:t.date})));
    tk.sort((a,b)=>(a.d-b.d)||((a.date||'9999').localeCompare(b.date||'9999')));
    Object.assign(out,{title:catLabel(c.id),emoji:c.emoji||'📁',href:'#/diy/c/'+encodeURIComponent(c.id),src:'Projekt · '+catPath(c.id)[0].name,items:tk.length?tk.filter(i=>!i.d).slice(0,15).concat(tk.filter(i=>i.d).slice(0,3)):null,text:`${ps.length} ${plural(ps.length,'stranica','stranice','stranica')}`});}
  else if(r.t==='recipe'){const d=docById(r.id);if(!d)return Object.assign(out,{missing:docsLoaded,loading:!docsLoaded});Object.assign(out,{title:d.title,emoji:d.emoji||'🍳',href:'#/kuharica/'+encodeURIComponent(d.id),src:'Kuharica'});}
  else if(r.t==='trip'){const d=docById(r.id);if(!d)return Object.assign(out,{missing:docsLoaded,loading:!docsLoaded});
    Object.assign(out,{title:d.title,emoji:d.emoji||'🧳',href:'#/izleti/'+encodeURIComponent(d.id),src:'Izleti',text:[fmtRange(d),untilTxt(d)].filter(Boolean).join(' · '),
      items:(d.packing||[]).length?d.packing.map(x=>({id:x.id,x:x.text,d:!!x.done})):null,due:d.from,done:d.status==='done'});}
  }catch(e){console.error(e);}
  if(out.title&&!out.missing&&p.text!==out.title)p.text=out.title;
  return out;
}
/* označavanje stavke u izvoru */
function pinToggleItem(p,itemId){
  const r=p.ref;
  if(r.t==='note'){const n=noteById(r.id);const b=n&&n.blocks.find(x=>x.id===itemId);if(b){b.d=!b.d;touchNote(n);}return;}
  if(r.t==='tab'){const f=findTask(itemId);if(f){setDone(f,!f.task.done);saveData();}return;}
  if(r.t==='item'){const f=findTask(r.id);const c=f&&(f.task.checks||[]).find(x=>x.id===itemId);if(c){c.d=!c.d;saveData();}return;}
  if(r.t==='proj'){const d=docById(r.id);const x=d&&([...(d.steps||[]),...(d.tasks||[])]).find(z=>z.id===itemId);if(x){x.d=!x.d;putDoc(d);}return;}
  if(r.t==='pcl'){const d=docById(r.pid);const cl=d&&(d.checks||[]).find(x=>x.id===r.id);const it=cl&&cl.items.find(x=>x.id===itemId);if(it){it.d=!it.d;putDoc(d);}return;}
  if(r.t==='trip'){const d=docById(r.id);const it=d&&(d.packing||[]).find(x=>x.id===itemId);if(it){it.done=!it.done;putDoc(d);}return;}
  if(r.t==='cat'){const[pid,tid]=itemId.split('|');const d=docById(pid);const tk=d&&(d.tasks||[]).find(x=>x.id===tid);if(tk){tk.d=!tk.d;putDoc(d);}return;}
}
function pinToggleSelf(p){
  const r=p.ref;
  if(r.t==='item'){const f=findTask(r.id);if(f){setDone(f,!f.task.done);saveData();}return;}
  if(r.t==='ptask'){const d=docById(r.pid);const tk=d&&(d.tasks||[]).find(x=>x.id===r.id);if(tk){tk.d=!tk.d;putDoc(d);}return;}
  p.done=!p.done;if(p.done&&p.reminder)p.reminder.seen=true;saveData();
}
function pinAddItem(p,text){
  const lines=text.split(/\s*[,;]\s*|\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length)return;const r=p.ref;
  if(r.t==='note'){const n=noteById(r.id);if(!n)return;if(n.blocks.length===1&&!n.blocks[0].x.trim())n.blocks=[];lines.forEach(x=>n.blocks.push({id:uid('b'),t:'c',x,d:false}));touchNote(n);return;}
  if(r.t==='tab'){lines.forEach(x=>state.items[r.id].push({id:uid('i'),desc:x,link:'',info:'',priority:'medium',done:false,created:Date.now()}));saveData();return;}
  if(r.t==='item'){const f=findTask(r.id);if(!f)return;f.task.checks=[...(f.task.checks||[]),...lines.map(x=>({id:uid('c'),x,d:false}))];saveData();return;}
  if(r.t==='pcl'){const d=docById(r.pid);const cl=d&&(d.checks||[]).find(x=>x.id===r.id);if(cl){cl.items.push(...lines.map(x=>({id:uid('ci'),x,d:false})));putDoc(d);}return;}
  if(r.t==='proj'){const d=docById(r.id);if(!d)return;const key=(d.steps||[]).length||!(d.mods||[]).includes('tasks')?'steps':'tasks';d[key]=[...(d[key]||[]),...lines.map(x=>({id:uid('s'),x,d:false,img:[]}))];putDoc(d);return;}
  if(r.t==='trip'){const d=docById(r.id);if(!d)return;lines.forEach(x=>d.packing.push({id:uid('pk'),group:'Ostalo',text:x,done:false}));putDoc(d);}
}

/* ───────── dashboard kartica s filtrima ───────── */
const PF=(()=>{try{return Object.assign({q:'',prio:'',src:'',date:'',done:false},JSON.parse(lsGet('planner.pinfilter','{}')));}catch(e){return{q:'',prio:'',src:'',date:'',done:false};}})();
const pinOpen={};
function savePF(){lsSet('planner.pinfilter',JSON.stringify(Object.assign({},PF,{q:''})));}
function pinDue(p,res){return p.due||res.due||'';}
function pinsDashCard(){
  const all=pins();
  const rows=all.map(p=>({p,r:resolvePin(p)}));
  const srcs=[...new Set(rows.map(x=>x.r.src.split(' · ').slice(0,2).join(' · ')))].sort();
  const t0=localISO(today()),wkEnd=localISO(addDays(getMonday(today()),6));const q=PF.q.trim().toLowerCase();
  let vis=rows.filter(({p,r})=>{
    const isDone=r.selfDone?r.done:p.done;if(!PF.done&&isDone)return false;
    if(PF.prio&&(p.prio||'')!==(PF.prio==='none'?'':PF.prio))return false;
    if(PF.src&&!r.src.startsWith(PF.src))return false;
    const due=pinDue(p,r);
    if(PF.date==='today'&&due!==t0)return false;if(PF.date==='week'&&!(due&&due<=wkEnd))return false;if(PF.date==='over'&&!(due&&due<t0))return false;if(PF.date==='none'&&due)return false;
    if(q&&!([r.title,r.src,r.text,p.note,...(r.items||[]).map(i=>i.x)].join(' ').toLowerCase().includes(q)))return false;
    return true;});
  vis.sort((a,b)=>(PRIO_ORD[a.p.prio||'']-PRIO_ORD[b.p.prio||''])||((pinDue(a.p,a.r)||'9999').localeCompare(pinDue(b.p,b.r)||'9999'))||((a.p.order??0)-(b.p.order??0)));
  const fil=PF.prio||PF.src||PF.date||PF.q;
  return`<section class="card pin-card" id="pinCard">
    <div class="card-head"><h2>📌 Dashboard lista</h2><span class="pill">${vis.length}${fil?` / ${all.length}`:''}</span><span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" data-act="pinPick">${icon('plus')}Dodaj</button></div>
    ${all.length?`<div class="pin-filters">
      <label class="searchbox">${icon('search')}<input class="input" data-fk="pinq" data-input="pinQ" value="${esc(PF.q)}" placeholder="Traži po imenu…"></label>
      <div class="seg seg-sm">${[['','Svi'],['high','●','pd-high'],['medium','●','pd-medium'],['low','●','pd-low']].map(([k,l,c])=>`<button class="${PF.prio===k?'on':''}" data-act="pinF" data-k="prio" data-v="${k}" title="${PRIO_LBL[k]||'Svi'}">${c?`<span class="pd ${c}"></span>${PRIO_LBL[k]}`:l}</button>`).join('')}</div>
      <select class="input sel-sm" data-change="pinSrc" aria-label="Projekt / izvor"><option value="">Svi izvori</option>${srcs.map(s=>`<option value="${esc(s)}" ${PF.src===s?'selected':''}>${esc(s)}</option>`).join('')}</select>
      <select class="input sel-sm" data-change="pinDate" aria-label="Datum">${[['','Bilo kada'],['today','Danas'],['week','Do kraja tjedna'],['over','Zakašnjelo'],['none','Bez roka']].map(([k,l])=>`<option value="${k}" ${PF.date===k?'selected':''}>${l}</option>`).join('')}</select>
      <button class="fchip${PF.done?' on':''}" data-act="pinF" data-k="done" data-v="${PF.done?'':'1'}">✓ Gotovi</button>
      ${fil?`<button class="link-btn" data-act="pinFClear">Očisti</button>`:''}
    </div>`:''}
    <div class="card-body">${vis.length?`<div class="pins" id="pinList">${vis.map(({p,r})=>pinRow(p,r)).join('')}</div>`:
      all.length?`<div class="empty">Ništa ne odgovara filtru.</div>`:`<div class="empty"><span class="big">📌</span>Zakači ovdje bilo što iz Plannera — bilješku, listu, stavku, projekt, OPG checklistu, recept ili izlet — s prioritetom, rokom i podsjetnikom.<br><button class="btn btn-primary btn-sm" style="margin-top:10px" data-act="pinPick">${icon('plus')}Dodaj na dashboard</button></div>`}</div>
  </section>`;
}
function pinRow(p,r){
  const due=pinDue(p,r);const t0=localISO(today());const over=due&&due<t0&&!(r.selfDone?r.done:p.done);
  const items=r.items||null;const open=pinOpen[p.id]??(items&&items.length<=8);const isDone=r.selfDone?r.done:p.done;
  const und=items?items.filter(i=>!i.d):[];const shown=open?(items||[]):[];
  return`<div class="pin p-${esc(p.prio||'none')}${isDone?' done':''}${r.missing?' missing':''}" data-id="${esc(p.id)}">
    <div class="pin-top">
      <button class="check pin-check" data-act="pinDone" data-id="${esc(p.id)}" aria-label="Gotovo">${icon('check')}</button>
      <span class="pin-emo">${esc(r.emoji)}</span>
      <div class="pin-main"><a class="pin-title" href="${esc(r.href)}">${esc(r.missing?(p.text||'Obrisano')+' (ne postoji više)':r.title)}</a>
        <div class="task-meta"><span class="chip">${icon('folder')}${esc(r.src)}</span>${p.prio?`<span class="chip chip-prio-${esc(p.prio)}">${PRIO_LBL[p.prio]}</span>`:''}
          ${due?`<span class="chip chip-due${over?' over':''}">${icon('calendar')}${esc(shortDay(fromInputDate(due)))}</span>`:''}
          ${p.reminder&&p.reminder.on?`<span class="chip chip-rem ${remState(p)}">${icon('bell')}${esc(fmtRem(p.reminder.at))}</span>`:''}
          ${items&&items.length?`<button class="chip" data-act="pinExp" data-id="${esc(p.id)}">${icon('checklist')}${items.length-und.length}/${items.length} ${open?'▴':'▾'}</button>`:''}
          ${r.link?`<a class="chip chip-link" href="${esc(safeUrl(r.link))}" target="_blank" rel="noopener">${icon('link')}${esc(tryDomain(safeUrl(r.link)))}</a>`:''}</div>
        ${p.note||r.text?`<div class="task-note">${linkify(p.note||r.text)}</div>`:''}</div>
      <div class="task-actions"><button class="ibtn" data-act="pinEdit" data-id="${esc(p.id)}" title="Prioritet, rok, podsjetnik">${icon('edit')}</button><button class="ibtn ibtn-danger" data-act="pinDel" data-id="${esc(p.id)}" title="Makni s dashboarda">${icon('x')}</button></div>
    </div>
    ${shown.length||(open&&items)?`<ul class="subchecks pin-items">${shown.map(i=>`<li class="${i.d?'done':''}"><button class="sc" data-act="pinItem" data-id="${esc(p.id)}" data-i="${esc(i.id)}">${icon('check')}</button><span>${linkify(i.x)}</span>${i.date?`<small>${esc(shortDay(fromInputDate(i.date)))}</small>`:''}</li>`).join('')}
      ${['note','tab','item','pcl','proj','trip'].includes(p.ref.t)?`<li class="pin-add"><input class="input" data-enter="pinAdd" data-id="${esc(p.id)}" placeholder="+ dodaj stavku (zarez = više)"></li>`:''}</ul>`:''}
  </div>`;
}
/* ───────── editor pina ───────── */
function openPinEditor(ref,presetTitle){
  let p=findPin(ref);const isNew=!p;
  const tmp=p||{id:uid('pin'),ref,prio:'',due:'',note:'',text:presetTitle||''};const r=resolvePin(tmp);
  const rem=p&&p.reminder&&p.reminder.on;
  openSheet({title:'📌 '+(isNew?'Na dashboard listu':'Dashboard lista'),body:`
    <div class="pin-what"><span>${esc(r.emoji)}</span><div><b>${esc(r.title)}</b><small>${esc(r.src)}</small></div></div>
    <div class="field"><label>Prioritet</label>${prioSeg('pn_prio',tmp.prio||'',true)}</div>
    <div class="grid2"><div class="field"><label for="pn_due">Rok</label><input type="date" id="pn_due" value="${esc(tmp.due||'')}"></div>
      <div class="field"><label>&nbsp;</label><div class="btn-row" style="margin:0">${[['Danas',0],['Sutra',1],['Za tjedan',7]].map(([l,n])=>`<button type="button" class="fchip" data-dd="${n}">${l}</button>`).join('')}</div></div></div>
    <div class="rem-box${rem?' on':''}" id="pnRemBox"><label class="switch"><input type="checkbox" id="pn_rem" ${rem?'checked':''}><span class="track"></span>${icon('bell')} Podsjetnik</label>
      <div class="when"><input class="input" type="datetime-local" id="pn_rem_at" value="${esc(rem?p.reminder.at:defaultRemAt(tmp.due?{task:{due:tmp.due}}:null))}"></div></div>
    <div class="field"><label for="pn_note">Bilješka na dashboardu</label><textarea id="pn_note" rows="2" placeholder="npr. zvati prije 15 h">${esc(tmp.note||'')}</textarea></div>`,
    actions:[...(isNew?[]:[{label:icon('x')+'Makni s dashboarda',cls:'btn-danger',left:true,fn:()=>{closeSheet();unpin(p.id);}}]),
      {label:'Odustani',cls:'btn-ghost',fn:closeSheet},
      {label:icon('check')+(isNew?'Dodaj':'Spremi'),cls:'btn-primary',primary:true,fn:()=>{const el=$('#sheet');
        const o=p||tmp;o.prio=segVal('pn_prio',el);o.due=$('#pn_due',el).value;o.note=$('#pn_note',el).value.trim();o.text=r.title;
        const on=$('#pn_rem',el).checked,at=$('#pn_rem_at',el).value;
        if(on&&at){const ch=!o.reminder||o.reminder.at!==at||!o.reminder.on;o.reminder={on:true,at,seen:ch?false:!!o.reminder.seen};if(ch)notified.delete(o.id);if('Notification'in window&&Notification.permission==='default')askNotifPermission(true);}else delete o.reminder;
        if(isNew){o.created=Date.now();o.order=pins().length;pins().push(o);}
        closeSheet();saveData();renderAll();toast(isNew?'📌 Dodano na dashboard listu':'Spremljeno',isNew?{label:'Dashboard',fn:()=>go('#/')}:{});}}],
    onOpen:el=>{const cb=$('#pn_rem',el);cb.addEventListener('change',()=>$('#pnRemBox',el).classList.toggle('on',cb.checked));
      $$('[data-dd]',el).forEach(b=>b.addEventListener('click',()=>{$('#pn_due',el).value=localISO(addDays(today(),+b.dataset.dd));}));}});
}
function unpin(id){const i=pins().findIndex(p=>p.id===id);if(i<0)return;const[p]=pins().splice(i,1);saveData();renderAll();toast('Maknuto s dashboarda',{label:'Poništi',fn:()=>{pins().splice(i,0,p);saveData();renderAll();}});}
/* "Dodaj" s dashboarda: odaberi bilo što */
function openPinPicker(){
  const groups=[
    ['📝 Notes',state.notes.map(n=>({ref:{t:'note',id:n.id},l:noteName(n)}))],
    ['📋 Liste',todoTabs().map(t=>({ref:{t:'tab',id:t.id},l:t.name}))],
    ['📁 Podsekcije (npr. OPG / Plan radova)',diyCats().map(c=>({ref:{t:'cat',id:c.id},l:c.emoji+' '+catLabel(c.id)}))],
    ['🔨 Projekti i stranice',projects().map(p=>({ref:{t:'proj',id:p.id},l:(p.emoji||'🛠️')+' '+(p.title||'Projekt'),s:(diyCat(p.cat)||{}).name}))],
    ['☑️ Checkliste u projektima',projects().flatMap(p=>(p.checks||[]).map(c=>({ref:{t:'pcl',pid:p.id,id:c.id},l:c.title||'Checklista',s:p.title})))],
    ['✈️ Izleti',trips().map(t=>({ref:{t:'trip',id:t.id},l:(t.emoji||'🧳')+' '+t.title,s:fmtRange(t)}))],
    ['🍳 Recepti',recipes().map(r=>({ref:{t:'recipe',id:r.id},l:(r.emoji||'🍳')+' '+(r.title||'Recept')}))],
  ].filter(g=>g[1].length);
  openSheet({title:'📌 Dodaj na dashboard listu',body:`<label class="searchbox" style="max-width:none">${icon('search')}<input class="input" id="ppQ" placeholder="Traži…"></label>
    <div class="pp-list">${groups.map(([h,items])=>`<div class="sec-title">${h}</div>${items.map(x=>`<button class="row pp-row${isPinned(x.ref)?' on':''}" data-ref='${esc(JSON.stringify(x.ref))}'><span>${esc(x.l)}</span>${x.s?`<small>${esc(x.s)}</small>`:''}${isPinned(x.ref)?'<b>📌</b>':''}</button>`).join('')}`).join('')||'<div class="empty">Još nemaš ništa za zakačiti.</div>'}</div>
    <p class="hint">Pojedinačne stavke listi i zadatke projekata zakačiš gumbom 📌 pokraj njih.</p>`,
    onOpen:el=>{$('#ppQ',el).addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('.pp-row',el).forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?'':'none');});
      $$('.pp-row',el).forEach(b=>b.addEventListener('click',()=>openPinEditor(JSON.parse(b.dataset.ref))));setTimeout(()=>$('#ppQ',el).focus(),50);}});
}
Object.assign(ACT,{
  pin:(el,e)=>{e.preventDefault();e.stopPropagation();openPinEditor({t:el.dataset.t,id:el.dataset.id,...(el.dataset.pid?{pid:el.dataset.pid}:{})});},
  pinEdit:el=>{const p=pins().find(x=>x.id===el.dataset.id);if(p)openPinEditor(p.ref);},
  pinDel:el=>unpin(el.dataset.id),
  pinPick:()=>openPinPicker(),
  pinDone:el=>{const p=pins().find(x=>x.id===el.dataset.id);if(!p)return;const r=resolvePin(p);pinToggleSelf(p);vibrate(12);
    if(!r.selfDone&&p.done&&r.items&&r.items.some(i=>!i.d))toast('Označeno kao gotovo (stavke u izvoru ostaju kako jesu)');renderAll();},
  pinItem:el=>{const p=pins().find(x=>x.id===el.dataset.id);if(!p)return;pinToggleItem(p,el.dataset.i);vibrate(8);const li=el.closest('li');li.classList.toggle('done');setTimeout(()=>{if(!isBusy())renderAll();},400);},
  pinExp:el=>{const p=pins().find(x=>x.id===el.dataset.id);if(!p)return;const r=resolvePin(p);pinOpen[p.id]=!(pinOpen[p.id]??(r.items&&r.items.length<=8));renderAll();},
  pinAdd:el=>{const p=pins().find(x=>x.id===el.dataset.id);if(!p||!el.value.trim())return;pinAddItem(p,el.value);el.value='';pinOpen[p.id]=true;renderAll();const n=$(`.pin[data-id="${CSS.escape(p.id)}"] .pin-add input`);n&&n.focus();},
  pinF:el=>{const k=el.dataset.k;PF[k]=k==='done'?!!el.dataset.v:(PF[k]===el.dataset.v?'':el.dataset.v);savePF();renderAll();},
  pinFClear:()=>{PF.prio='';PF.src='';PF.date='';PF.q='';savePF();renderAll();},
  subTog:el=>{const f=findTask(el.dataset.id);const c=f&&(f.task.checks||[]).find(x=>x.id===el.dataset.c);if(!c)return;c.d=!c.d;vibrate(8);saveData();renderAll();},
  tabPlain:el=>{const t=tabById(el.dataset.id);if(!t)return;t.plain=!t.plain;saveData();renderAll();toast(t.plain?'Stavke bez checkboxa (kao bilješke)':'Stavke s checkboxima');},
  undo:()=>doUndo(),redo:()=>doRedo(),
});
INPUT_SET.pinQ=v=>{PF.q=v;};
CHANGE_SET.pinSrc=v=>{PF.src=v;savePF();renderAll();};
CHANGE_SET.pinDate=v=>{PF.date=v;savePF();renderAll();};
// Enter u data-enter polju za dodavanje je već pokriven (app.js keydown → ACT[data-enter])

/* ═════════ PONIŠTI / PONOVI ═════════
   Prije svake "serije" promjena sprema se snimka (glavni planner + recepti/projekti).
   Ctrl+Z / Ctrl+Shift+Z (izvan polja za upis) ili gumb ↶ gore desno.            */
const UNDO={stack:[],redo:[],cur:null,last:0,lastInput:0,restoring:false,timer:null};
document.addEventListener('input',()=>{UNDO.inInput=true;setTimeout(()=>{UNDO.inInput=false;},0);},true);
function undoSnap(){try{return JSON.stringify({s:state,d:DOCS});}catch(e){return null;}}
function undoMark(){
  if(UNDO.restoring)return;
  const now=Date.now();
  const typing=!!UNDO.inInput; // promjena iz tipkanja se grupira; klik/Enter je zasebna točka za poništavanje
  if(UNDO.cur&&(!typing||now-UNDO.last>1500)){UNDO.stack.push(UNDO.cur);if(UNDO.stack.length>50)UNDO.stack.shift();UNDO.redo=[];}
  UNDO.last=now;clearTimeout(UNDO.timer);
  // snimka stanja NAKON promjene (pozivatelj je već promijenio podatke): odmah za klikove, s odgodom za tipkanje
  if(typing)UNDO.timer=setTimeout(()=>{UNDO.cur=undoSnap();},350);else Promise.resolve().then(()=>{UNDO.cur=undoSnap();});
}
function undoApply(snapStr){
  const o=JSON.parse(snapStr);UNDO.restoring=true;
  try{
    state=normalize(o.s);
    const want=o.d||{};
    Object.keys(DOCS).forEach(id=>{if(!want[id])delDoc(id);});
    Object.keys(want).forEach(id=>{if(JSON.stringify(DOCS[id])!==JSON.stringify(want[id])){DOCS[id]=want[id];docQueue.set(id,'put');}});
    scheduleDocFlush(0);saveData();renderAll();
  }finally{UNDO.restoring=false;}
}
function doUndo(){
  clearTimeout(UNDO.timer);const now=undoSnap();
  let prev=UNDO.stack.pop();
  if(!prev&&UNDO.cur&&UNDO.cur!==now)prev=UNDO.cur;
  if(!prev){toast('Nema ništa za poništiti');return;}
  UNDO.redo.push(now);undoApply(prev);UNDO.cur=prev;UNDO.last=0;
  toast('↶ Poništeno',{label:'Ponovi',fn:doRedo});
}
function doRedo(){const nx=UNDO.redo.pop();if(!nx){toast('Nema ništa za ponoviti');return;}UNDO.stack.push(undoSnap());undoApply(nx);UNDO.cur=nx;UNDO.last=0;toast('↷ Ponovljeno');}
{ // omotaj spremanje: svaka promjena bilježi točku za poništavanje
  const _sd=saveData;saveData=function(){undoMark();return _sd.apply(this,arguments);};
  const _pd=putDoc;putDoc=function(){undoMark();return _pd.apply(this,arguments);};
  const _dd=delDoc;delDoc=function(){undoMark();return _dd.apply(this,arguments);};
  const _rs=window.onRemoteState;window.onRemoteState=function(d){_rs(d);if(!UNDO.restoring)setTimeout(()=>{UNDO.cur=undoSnap();},0);};
}
setTimeout(()=>{UNDO.cur=undoSnap();},1500);
document.addEventListener('keydown',e=>{
  if(!(e.ctrlKey||e.metaKey)||e.altKey)return;const k=e.key.toLowerCase();if(k!=='z'&&k!=='y')return;
  const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return; // u polju radi obični undo teksta
  e.preventDefault();if(k==='y'||(k==='z'&&e.shiftKey))doRedo();else doUndo();
});
