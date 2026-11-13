'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   STORE — zasebni dokumenti (recepti, DIY projekti, vlastiti napitci) i slike
   • Glavni planner (zadaci, liste, notes, djeca) ostaje u jednom dokumentu.
   • Svaki recept / projekt je svoj Firestore dokument  → nema limita od 1 MB.
   • Slike su zasebno (planners/{uid}/blobs/{id}), komprimirane u pregledniku.
   ═══════════════════════════════════════════════════════════════════════ */
const DOCS={};                 // id -> objekt {id, kind, ...}
let docsLoaded=false, docsError='';
const docQueue=new Map();      // id -> 'put' | 'del'
let docTimer=null;
const LOCAL_DOCS_KEY='planner.local.docs.v1';

function docsOf(kind){return Object.values(DOCS).filter(d=>d&&d.kind===kind);}
function docById(id){return DOCS[id]||null;}
function putDoc(d,{now=false}={}){d.updated=Date.now();if(!d.created)d.created=d.updated;DOCS[d.id]=d;docQueue.set(d.id,'put');scheduleDocFlush(now?0:500);}
function delDoc(id){const d=DOCS[id];delete DOCS[id];docQueue.set(id,'del');scheduleDocFlush(0);return d;}
function scheduleDocFlush(ms){clearTimeout(docTimer);if(!LOCAL_MODE)setSyncStatus('syncing','Spremam…');docTimer=setTimeout(flushDocs,ms);}
async function flushDocs(){
  clearTimeout(docTimer);docTimer=null;
  if(!docQueue.size)return;
  const jobs=[...docQueue.entries()];docQueue.clear();
  if(LOCAL_MODE){lsSet(LOCAL_DOCS_KEY,JSON.stringify(DOCS));return;}
  if(!window._fbDocPut)return;
  const ps=jobs.map(([id,op])=>{
    if(op==='del')return window._fbDocDel(id);
    const d=DOCS[id];if(!d)return null;
    const json=JSON.stringify(d);
    if(json.length>900000){toast('Prevelik zapis: '+(d.title||'').slice(0,30)+' (makni dio teksta)');return null;}
    return window._fbDocPut(id,d.kind,json);
  }).filter(Boolean);
  try{await Promise.all(ps);setSyncStatus('synced','Sinkronizirano');}
  catch(e){console.error('Doc save',e);setSyncStatus('error',e.code==='permission-denied'?'Nema dozvole — objavi nova Firestore pravila':'Greška pri spremanju');
    jobs.forEach(([id,op])=>{if(!docQueue.has(id))docQueue.set(id,op);});}
}
window.flushDocs=flushDocs;
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushDocs();});
window.addEventListener('pagehide',()=>flushDocs());

window.onDocsReset=()=>{for(const k in DOCS)delete DOCS[k];docsLoaded=false;docsError='';IMG.clear();
  setTimeout(()=>{if(!docsLoaded){docsLoaded=true;scheduleRemoteRender();}},4000);}; // offline bez keša: ne čekaj vječno
window.onDocChanges=(changes,fromCache,err)=>{
  if(err){docsError=err;setSyncStatus('error',err);}
  let touched=false;
  changes.forEach(ch=>{
    if(docQueue.has(ch.id))return; // lokalna promjena čeka spremanje — ne gazi je
    if(ch.type==='removed'){if(DOCS[ch.id]){delete DOCS[ch.id];touched=true;}return;}
    const d=ch.data;if(!d||typeof d!=='object')return;d.id=ch.id;DOCS[ch.id]=d;touched=true;
  });
  const was=docsLoaded;if(!fromCache)docsLoaded=true;else if(changes.length)docsLoaded=true;
  if(touched||was!==docsLoaded)scheduleRemoteRender();
};
function loadLocalDocs(){try{const raw=localStorage.getItem(LOCAL_DOCS_KEY);if(raw){const o=JSON.parse(raw);for(const k in o)DOCS[k]=o[k];}}catch(e){}docsLoaded=true;}

/* ───────── generički "bind" za inline uređivanje (bez re-rendera) ─────────
   <input data-bind="docId" data-path="materials.ID.n" data-type="num">
   Dijelovi puta koji nisu indeksi traže element niza po .id                 */
function getByPath(obj,path,create){
  const parts=path.split('.');let o=obj;
  for(let i=0;i<parts.length-1;i++){
    const p=parts[i];let nx;
    if(Array.isArray(o))nx=o.find(x=>x&&x.id===p);else nx=o[p];
    if(nx==null){if(!create)return null;nx=o[p]={};}
    o=nx;
  }
  return{o,k:parts[parts.length-1]};
}
function setPath(obj,path,val){const r=getByPath(obj,path,true);if(!r)return;if(Array.isArray(r.o)){const it=r.o.find(x=>x&&x.id===r.k);if(it)Object.assign(it,val);}else r.o[r.k]=val;}
function bindValue(el){
  if(el.type==='checkbox')return el.checked;
  if(el.dataset.type==='num'){const v=parseNum(el.value);return v==null?null:v;}
  return el.value;
}
const BIND_HOOKS={};           // kind -> fn(doc, path, el) nakon promjene (npr. osvježi zbrojeve)
function bindTarget(id){if(id==='state')return state;return DOCS[id]||null;}
function handleBind(el,isChange){
  const id=el.dataset.bind;const obj=bindTarget(id);if(!obj)return;
  setPath(obj,el.dataset.path,bindValue(el));
  if(id==='state')saveData();else putDoc(obj);
  const h=BIND_HOOKS[id==='state'?'state':obj.kind];if(h)h(obj,el.dataset.path,el,isChange);
  if(el.tagName==='TEXTAREA'&&el.classList.contains('grow'))autoGrow(el);
}
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.bind&&t.type!=='checkbox'&&t.tagName!=='SELECT')handleBind(t,false);});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.bind&&(t.type==='checkbox'||t.tagName==='SELECT'||t.type==='date'||t.type==='time'))handleBind(t,true);});

/* ───────── BROJEVI / KOLIČINE ───────── */
const FRAC={'½':.5,'¼':.25,'¾':.75,'⅓':1/3,'⅔':2/3,'⅛':.125};
function parseNum(s){
  if(s==null)return null;s=String(s).trim().replace(',','.');if(!s)return null;
  let m=s.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(m)return+m[1]+m[2]/m[3];
  m=s.match(/^(\d+)\s*([½¼¾⅓⅔⅛])$/);if(m)return+m[1]+FRAC[m[2]];
  if(FRAC[s]!=null)return FRAC[s];
  m=s.match(/^(\d+)\/(\d+)$/);if(m)return m[1]/m[2];
  const n=parseFloat(s);return isNaN(n)?null:n;
}
const UNITS=['kg','dag','g','mg','ml','dl','cl','l','žlica','žlice','žličica','žličice','žl','čž','šalica','šalice','šalicu','čaša','čaše','kom','komad','komada','kocka','kocke','kockica','kockice','prstohvat','režanj','režnja','češanj','češnja','vezica','vezice','list','lista','listića','grančica','grančice','kriška','kriške','kriški','pakiranje','pakiranja','vrećica','vrećice','limenka','limenke','boca','boce','glavica','glavice','tsp','tbsp','cup','cups','oz','lb','m','cm','mm','m2','m²','m3','m³','kut','paket','paketa','role','rola','pak'];
const UNIT_RE=UNITS.slice().sort((a,b)=>b.length-a.length).map(u=>u.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
const NUM_RE='(?:\\d+\\s+\\d+\\/\\d+|\\d+\\s*[½¼¾⅓⅔⅛]|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?|[½¼¾⅓⅔⅛])';
const ING_RE=new RegExp(`^\\s*(?:[-*•]\\s*)?(${NUM_RE})(?:\\s*[-–]\\s*(${NUM_RE}))?\\s*(?:(${UNIT_RE})\\.?(?=\\s|$))?\\s*(.*)$`,'i');
function parseIngLine(line){
  line=String(line||'').replace(/^\s*(?:[-*•☐☑]|\[\s?[xX ]?\])\s*/,'').trim();
  if(!line)return null;
  if(/^#{1,3}\s+/.test(line)||/^[^\d].{0,40}:$/.test(line))return{id:uid('g'),t:'h',n:line.replace(/^#{1,3}\s+/,'').replace(/:$/,'')};
  const m=line.match(ING_RE);
  if(m){return{id:uid('g'),t:'i',q:parseNum(m[1]),q2:m[2]?parseNum(m[2]):null,u:m[3]||'',n:(m[4]||'').trim()};}
  return{id:uid('g'),t:'i',q:null,q2:null,u:'',n:line};
}
function fmtNum(n,unit){
  if(n==null||isNaN(n))return'';
  const u=(unit||'').toLowerCase();
  const spoonish=/žl|šalic|kom|kock|režan|režnj|češ|glav|krišk|list|vrećic|paket|limen|boc|tsp|tbsp|cup|^$/.test(u);
  if(spoonish&&n<20){
    const w=Math.floor(n+1e-9),f=n-w;const fr=[[0,''],[.25,'¼'],[1/3,'⅓'],[.5,'½'],[2/3,'⅔'],[.75,'¾'],[1,'']];
    let best=fr[0],bd=9;fr.forEach(x=>{const d=Math.abs(f-x[0]);if(d<bd){bd=d;best=x;}});
    if(bd<.06){const ww=best[0]===1?w+1:w;return(ww?String(ww):'')+(best[1]&&best[0]!==1?best[1]:'')||'0';}
  }
  let r;if(n>=100)r=Math.round(n/5)*5;else if(n>=10)r=Math.round(n);else r=Math.round(n*10)/10;
  return String(r).replace('.',',');
}
function fmtQty(it,f=1){
  if(it.q==null)return'';
  const a=fmtNum(it.q*f,it.u);const b=it.q2!=null?fmtNum(it.q2*f,it.u):'';
  return(b?a+'–'+b:a)+(it.u?' '+it.u:'');
}
function ingToText(it){return it.t==='h'?'# '+it.n:[fmtQty(it),it.n].filter(Boolean).join(' ');}
function eur(n){return(Math.round((n||0)*100)/100).toLocaleString('hr-HR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';}
function plural(n,a,b,c){const m10=n%10,m100=n%100;return m10===1&&m100!==11?a:(m10>=2&&m10<=4&&(m100<10||m100>=20))?b:c;}
function fmtMin(m){m=+m||0;if(!m)return'';if(m<60)return m+' min';const h=Math.floor(m/60),r=m%60;return h+' h'+(r?' '+r+' min':'');}

/* ───────── SLIKE ───────── */
const IMG=new Map();           // id -> dataURL | Promise
const IDB={db:null};
function idbOpen(){if(IDB.db)return Promise.resolve(IDB.db);return new Promise((res,rej)=>{const r=indexedDB.open('planner-blobs',1);r.onupgradeneeded=()=>r.result.createObjectStore('b');r.onsuccess=()=>{IDB.db=r.result;res(IDB.db);};r.onerror=()=>rej(r.error);});}
async function idbDo(mode,fn){const db=await idbOpen();return new Promise((res,rej)=>{const tx=db.transaction('b',mode);const st=tx.objectStore('b');const rq=fn(st);tx.oncomplete=()=>res(rq&&rq.result);tx.onerror=()=>rej(tx.error);});}
function safeImg(d){return typeof d==='string'&&/^data:image\/(jpeg|png|webp|gif);base64,/.test(d)?d:null;}
async function blobPut(id,data){IMG.set(id,data);if(LOCAL_MODE)return idbDo('readwrite',st=>st.put(data,id));return window._fbBlobPut(id,data);}
function blobGet(id){
  if(IMG.has(id))return Promise.resolve(IMG.get(id));
  const p=(async()=>{try{const d=LOCAL_MODE?await idbDo('readonly',st=>st.get(id)):(window._fbBlobGet?await window._fbBlobGet(id):null);const s=safeImg(d);IMG.set(id,s);return s;}catch(e){IMG.delete(id);return null;}})();
  IMG.set(id,p);return p;
}
function blobDel(id){IMG.delete(id);try{if(LOCAL_MODE)idbDo('readwrite',st=>st.delete(id));else window._fbBlobDel&&window._fbBlobDel(id);}catch(e){}}
function imgDelete(id){if(!id)return;blobDel(id);blobDel(id+'_t');}

async function compressImage(file,max,q){
  let bmp;
  try{bmp=await createImageBitmap(file,{imageOrientation:'from-image'});}
  catch(e){bmp=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=URL.createObjectURL(file);});}
  const w0=bmp.width,h0=bmp.height;const s=Math.min(1,max/Math.max(w0,h0));
  const c=document.createElement('canvas');c.width=Math.round(w0*s);c.height=Math.round(h0*s);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
  let out=c.toDataURL('image/jpeg',q);
  while(out.length>880000&&q>.4){q-=.12;out=c.toDataURL('image/jpeg',q);}
  return out;
}
// Upload: vraća id slike (sprema punu verziju + sličicu)
async function imgUpload(file){
  if(!file||!/^image\//.test(file.type))throw new Error('Nije slika');
  const id=uid('img');
  const [full,thumb]=await Promise.all([compressImage(file,1600,.82),compressImage(file,520,.72)]);
  await Promise.all([blobPut(id,full),blobPut(id+'_t',thumb)]);
  return id;
}
async function imgUploadMany(files,onEach){
  const list=[...files].filter(f=>/^image\//.test(f.type));if(!list.length)return[];
  toast(list.length>1?`Učitavam ${list.length} slika…`:'Učitavam sliku…');
  const ids=[];
  for(const f of list){try{const id=await imgUpload(f);ids.push(id);onEach&&onEach(id);}catch(e){console.error(e);toast('Slika nije spremljena: '+(e.message||e));}}
  return ids;
}
// <img> koji se sam napuni kad je slika dostupna
function imgTag(id,{thumb=true,cls='',alt=''}={}){
  if(!id)return'';
  return`<img class="pimg ${cls}" data-img="${esc(id+(thumb?'_t':''))}" data-full="${esc(id)}" alt="${esc(alt)}" decoding="async">`;
}
function hydrateImages(root=document){
  $$('img[data-img]:not([src])',root).forEach(el=>{
    const id=el.dataset.img;
    const set=d=>{if(d)el.src=d;else el.classList.add('missing');};
    const c=IMG.get(id);
    if(typeof c==='string')set(c);
    else{el.classList.add('loading');blobGet(id).then(d=>{el.classList.remove('loading');if(!d&&id.endsWith('_t'))blobGet(id.slice(0,-2)).then(set);else set(d);});}
  });
}
new MutationObserver(()=>{clearTimeout(hydrateImages._t);hydrateImages._t=setTimeout(()=>hydrateImages(),20);}).observe(document.body,{childList:true,subtree:true});

/* ───────── LIGHTBOX ───────── */
function openLightbox(ids,start=0){
  ids=ids.filter(Boolean);if(!ids.length)return;let i=Math.max(0,Math.min(start,ids.length-1));
  const box=document.createElement('div');box.className='lightbox';
  const paint=()=>{box.innerHTML=`<button class="lb-x" aria-label="Zatvori">${icon('x')}</button>
    ${ids.length>1?`<button class="lb-nav lb-prev" aria-label="Prethodna">${icon('chevL')}</button><button class="lb-nav lb-next" aria-label="Sljedeća">${icon('chevR')}</button><div class="lb-count">${i+1} / ${ids.length}</div>`:''}
    <img class="pimg" data-img="${esc(ids[i])}" alt="">`;hydrateImages(box);};
  const close=()=>{box.remove();document.removeEventListener('keydown',key,true);};
  const key=e=>{if(e.key==='Escape'){e.stopPropagation();close();}if(e.key==='ArrowRight'){i=(i+1)%ids.length;paint();}if(e.key==='ArrowLeft'){i=(i-1+ids.length)%ids.length;paint();}};
  box.addEventListener('click',e=>{if(e.target.closest('.lb-next')){i=(i+1)%ids.length;paint();return;}if(e.target.closest('.lb-prev')){i=(i-1+ids.length)%ids.length;paint();return;}if(e.target.tagName!=='IMG')close();});
  let x0=null;box.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50&&ids.length>1){i=(i+(dx<0?1:-1)+ids.length)%ids.length;paint();}});
  document.addEventListener('keydown',key,true);document.body.appendChild(box);paint();
}

/* ───────── ZAJEDNIČKI UI DIJELOVI ───────── */
function starsHTML(val,act,id){return`<span class="stars" role="group" aria-label="Ocjena">${[1,2,3,4,5].map(n=>`<button class="${n<=(val||0)?'on':''}" data-act="${act}" data-id="${esc(id)}" data-v="${n}" aria-label="${n} zvjezdica">★</button>`).join('')}</span>`;}
function stepperHTML(val,act,id,min=1){return`<span class="stepper"><button data-act="${act}" data-id="${esc(id)}" data-d="-1" ${val<=min?'disabled':''} aria-label="Manje">−</button><b>${esc(val)}</b><button data-act="${act}" data-id="${esc(id)}" data-d="1" aria-label="Više">+</button></span>`;}
function fileBtn(act,id,{label='Dodaj slike',multiple=true,cls='btn btn-ghost btn-sm',extra=''}={}){
  return`<label class="${cls} file-btn">${icon('image')}<span>${label}</span><input type="file" accept="image/*" ${multiple?'multiple':''} data-file="${act}" data-id="${esc(id)}" ${extra} hidden></label>`;
}
const FILE_ACT={};             // act -> async fn(files, el)
document.addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.file&&t.files&&t.files.length){const fn=FILE_ACT[t.dataset.file];if(fn)fn([...t.files],t);t.value='';}});
// drag & drop + paste slika na zone s data-drop
document.addEventListener('dragover',e=>{const z=e.target.closest&&e.target.closest('[data-drop]');if(z&&e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){e.preventDefault();z.classList.add('dropping');}});
document.addEventListener('dragleave',e=>{const z=e.target.closest&&e.target.closest('[data-drop]');if(z)z.classList.remove('dropping');});
document.addEventListener('drop',e=>{const z=e.target.closest&&e.target.closest('[data-drop]');if(!z)return;e.preventDefault();z.classList.remove('dropping');const fn=FILE_ACT[z.dataset.drop];if(fn&&e.dataTransfer.files.length)fn([...e.dataTransfer.files],z);});
document.addEventListener('paste',e=>{
  const files=[...((e.clipboardData&&e.clipboardData.files)||[])].filter(f=>/^image\//.test(f.type));if(!files.length)return;
  const z=(e.target.closest&&e.target.closest('[data-drop]'))||$('#view [data-drop]')||$('#sheet [data-drop]');if(!z)return;
  e.preventDefault();const fn=FILE_ACT[z.dataset.drop];fn&&fn(files,z);
});
function galleryHTML(ids,{act,id,cover,editable=true}={}){
  ids=ids||[];
  return`<div class="gallery" data-drop="${act}" data-id="${esc(id)}">
    ${ids.map((im,i)=>`<div class="gal-item${cover===im?' is-cover':''}">
      <button class="gal-open" data-act="lightbox" data-ids="${esc(ids.join(','))}" data-i="${i}" aria-label="Povećaj">${imgTag(im)}</button>
      ${editable?`<div class="gal-tools">
        <button class="ibtn" data-act="${act}Cover" data-id="${esc(id)}" data-img="${esc(im)}" title="${cover===im?'Naslovna slika':'Postavi kao naslovnu'}">${icon(cover===im?'star':'starO')}</button>
        <button class="ibtn ibtn-danger" data-act="${act}Del" data-id="${esc(id)}" data-img="${esc(im)}" title="Obriši sliku">${icon('trash')}</button></div>`:''}
    </div>`).join('')}
    ${editable?`<label class="gal-add">${icon('image')}<b>Dodaj slike</b><small>ili povuci / zalijepi (Ctrl+V)</small><input type="file" accept="image/*" multiple data-file="${act}" data-id="${esc(id)}" hidden></label>`:''}
  </div>`;
}
function copyText(txt){return navigator.clipboard.writeText(txt).then(()=>toast('Kopirano'),()=>toast('Kopiranje nije uspjelo'));}
// pošalji stavke u bilješku-checklistu (npr. 🛒 Popis za dućan)
function addToShoppingNote(lines,title='🛒 Popis za dućan'){
  lines=lines.map(x=>String(x).trim()).filter(Boolean);if(!lines.length){toast('Nema stavki za dodati');return;}
  let n=state.notes.find(x=>(x.title||'').trim()===title);
  if(!n){n={id:uid('n'),title,blocks:[],created:Date.now(),updated:Date.now(),hideDone:false};state.notes.push(n);}
  if(n.blocks.length===1&&!n.blocks[0].x.trim())n.blocks=[];
  const have=new Set(n.blocks.filter(b=>b.t==='c'&&!b.d).map(b=>b.x.trim().toLowerCase()));
  let added=0;lines.forEach(l=>{if(!have.has(l.toLowerCase())){n.blocks.push({id:uid('b'),t:'c',x:l,d:false});added++;}});
  n.updated=Date.now();saveData();
  toast(`${added} ${plural(added,'stavka dodana','stavke dodane','stavki dodano')} u “${title}”`,{label:'Otvori',fn:()=>go('#/note/'+n.id)});
}
Object.assign(ICONS,{
  image:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" fill="currentColor"/>',
  starO:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
  heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/>',
  chef:'<path d="M6 13.9A4 4 0 0 1 7.5 6a5 5 0 0 1 9 0A4 4 0 0 1 18 13.9V20H6Z"/><path d="M6 17h12"/>',
  cocktail:'<path d="M4 4h16l-8 9Z"/><path d="M12 13v8M8 21h8"/><path d="m15 4 3-2"/>',
  hammer:'<path d="m14 12-8.5 8.5a2.1 2.1 0 0 1-3-3L11 9"/><path d="m15 13 6-6-4-4-2 2-2-1-2 2 1 2-2 2Z"/>',
  kids:'<circle cx="12" cy="6" r="3"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/><path d="M9 13.5 12 17l3-3.5"/>',
  school:'<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
  play:'<path d="M7 4v16l13-8Z"/>',
  minus:'<path d="M5 12h14"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  wand:'<path d="m15 4 5 5M4 20 16 8M14 2v2M20 8h2M19 3l-1 1"/>',
  ruler:'<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v4M10 7v3M14 7v4M18 7v3"/>',
  box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4Z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
});
