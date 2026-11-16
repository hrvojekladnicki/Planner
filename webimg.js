'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   PRAVE FOTOGRAFIJE — Wikipedia / Wikimedia Commons (slobodne licence)
   • Napici: automatski se prikaže fotka iz Wikipedije (keš u localStorage).
   • "Odaberi fotku": pretraga Commonsa → odabrana fotka se preuzme, smanji
     i spremi kao tvoja slika (radi i offline, ne ovisi o Wikipediji).
   ═══════════════════════════════════════════════════════════════════════ */
// w: = Wikipedia članak (naslovna slika), c: = pretraga Wikimedia Commonsa. Probaju se redom.
const WQ={
  'aperol-spritz':['w:Spritz Veneziano','c:aperol spritz glass'],'pink-gin-tonic':['c:pink gin tonic','w:Gin and tonic'],'french-75':['w:French 75 cocktail','c:French 75 cocktail'],
  'cosmopolitan':['w:Cosmopolitan cocktail'],'mojito':['w:Mojito'],'moscow-mule':['w:Moscow mule'],'whiskey-sour':['w:Whiskey sour'],'espresso-martini':['w:Espresso martini'],
  'daiquiri':['w:Daiquiri'],'negroni':['w:Negroni'],'gin-fizz':['w:Gin fizz'],'hugo-spritz':['w:Hugo cocktail','c:Hugo cocktail elderflower'],
  'kuhano-vino':['w:Mulled wine'],'hot-aperol':['c:hot aperol','c:mulled aperol','w:Mulled wine'],'irish-coffee':['w:Irish coffee'],'grog':['c:grog hot drink glass','c:grog rum tea'],
  'dumbir-limun':['w:Ginger tea','c:ginger lemon tea'],'zimski-vocni':['c:hot fruit tea cup','c:berry tea cup'],'hot-toddy':['w:Hot toddy'],
  'kuhana-rakija':['c:kuhana rakija','c:šumadijski čaj','c:hot rakija'],'kuhano-bijelo':['c:white mulled wine','c:weißer Glühwein'],'bombardino':['w:Bombardino','c:bombardino'],
  'hot-buttered-rum':['w:Hot buttered rum'],'cokolada-baileys':['c:hot chocolate whipped cream mug','w:Hot chocolate'],'jabucni-punc':['w:Mulled cider','c:hot apple cider mug'],
  'old-fashioned':['w:Old fashioned cocktail'],'white-russian':['w:White Russian cocktail'],'orahovac':['c:orahovac','w:Nocino'],
};
const WCACHE_KEY='planner.wimg.v1';
let WCACHE={};try{WCACHE=JSON.parse(localStorage.getItem(WCACHE_KEY)||'{}');}catch(e){}
const wPending={};let wActive=0;const wQueue=[];
function wSave(){try{localStorage.setItem(WCACHE_KEY,JSON.stringify(WCACHE));}catch(e){}}
function stripHtml(s){const d=document.createElement('div');d.innerHTML=String(s||'');return(d.textContent||'').trim().slice(0,80);}
async function wikiLead(q,size=700){
  const u=`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&prop=pageimages&piprop=thumbnail|name&pithumbsize=${size}`;
  const j=await(await fetch(u)).json();const p=Object.values((j.query||{}).pages||{})[0];
  if(!p||!p.thumbnail||/\.svg/i.test(p.pageimage||''))return null;
  return{u:p.thumbnail.source,f:'https://en.wikipedia.org/wiki/File:'+encodeURIComponent(p.pageimage),a:'',l:'',t:p.title};
}
async function commonsSearch(q,n=1,size=700){
  const u=`https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q+' filetype:bitmap')}&gsrlimit=${n}&prop=imageinfo&iiprop=url|extmetadata&iiextmetadatafilter=Artist|LicenseShortName&iiurlwidth=${size}`;
  const j=await(await fetch(u)).json();
  return Object.values((j.query||{}).pages||{}).sort((a,b)=>(a.index||0)-(b.index||0)).map(p=>{const ii=(p.imageinfo||[])[0];if(!ii||!ii.thumburl)return null;const m=ii.extmetadata||{};
    return{u:ii.thumburl,f:ii.descriptionurl,a:stripHtml(m.Artist&&m.Artist.value),l:(m.LicenseShortName&&m.LicenseShortName.value)||'',t:(p.title||'').replace(/^File:/,'').replace(/\.[a-z]+$/i,'')};}).filter(Boolean);
}
async function resolveQueries(qs){for(const q of qs){try{const r=q.startsWith('w:')?await wikiLead(q.slice(2)):(await commonsSearch(q.slice(2),1))[0];if(r)return r;}catch(e){}}return null;}
function wikiFor(id){
  const c=WCACHE[id];if(c&&(c.r||Date.now()-c.ts<7*864e5))return Promise.resolve(c.r||null);
  if(wPending[id])return wPending[id];
  const qs=WQ[id];if(!qs)return Promise.resolve(null);
  wPending[id]=new Promise(res=>{wQueue.push(async()=>{const r=await resolveQueries(qs);WCACHE[id]={r,ts:Date.now()};wSave();delete wPending[id];res(r);});wPump();});
  return wPending[id];
}
function wPump(){while(wActive<4&&wQueue.length){wActive++;const job=wQueue.shift();job().finally(()=>{wActive--;wPump();});}}
function hydrateWiki(root=document){
  $$('[data-wiki]:not([data-wdone])',root).forEach(el=>{el.dataset.wdone='1';
    wikiFor(el.dataset.wiki).then(r=>{if(!r||!el.isConnected)return;const img=new Image();img.className='pimg wimg';img.alt='';img.referrerPolicy='no-referrer';img.decoding='async';
      img.onload=()=>{el.querySelector('.glass')&&el.querySelector('.glass').remove();el.prepend(img);el.classList.add('has-photo');};img.src=r.u;
      const cr=el.parentElement&&el.parentElement.querySelector('[data-wcredit]');if(cr)cr.innerHTML=creditHTML(r);});});
}
new MutationObserver(()=>{clearTimeout(hydrateWiki._t);hydrateWiki._t=setTimeout(()=>hydrateWiki(),30);}).observe(document.body,{childList:true,subtree:true});
function creditHTML(c){if(!c)return'';return`<a class="wcredit" href="${esc(safeUrl(c.f))}" target="_blank" rel="noopener" title="Izvor fotografije">📷 ${esc([c.a,c.l].filter(Boolean).join(' · ')||(c.s?'Izvor':'Wikimedia'))} · ${esc(c.s||'Wikimedia Commons')}</a>`;}

/* ───────── odabir fotke s weba ───────── */
async function downloadToBlob(url){
  const r=await fetch(url,{mode:'cors'});if(!r.ok)throw new Error('HTTP '+r.status);const b=await r.blob();
  return imgUpload(new File([b],'web.jpg',{type:b.type||'image/jpeg'}));
}
function openWebPicker({title='Odaberi fotografiju',query,lead,onPick}){
  let q=query||'';
  openSheet({title:esc(title),body:`<div class="add-row" style="margin:0"><input class="input" id="wpQ" value="${esc(q)}" placeholder="Pretraži fotografije…"><button class="btn btn-week" id="wpGo">${icon('search')}Traži</button></div>
    <div class="wp-grid" id="wpGrid"><div class="empty">Tražim…</div></div>
    <p class="hint">Fotografije su s Wikimedia Commonsa (slobodne licence). Odabrana se sprema u tvoj Planner zajedno s izvorom.</p>`,
    actions:[{label:'Zatvori',cls:'btn-ghost',fn:closeSheet}],
    onOpen:el=>{
      const grid=$('#wpGrid',el);let results=[];
      const run=async()=>{q=$('#wpQ',el).value.trim();if(!q)return;grid.innerHTML='<div class="empty">Tražim…</div>';
        try{const [ld,cs]=await Promise.all([lead?resolveQueries(lead).catch(()=>null):null,commonsSearch(q,24,1000).catch(()=>[])]);
          results=[ld,...cs].filter(Boolean).filter((x,i,a)=>a.findIndex(y=>y.u===x.u)===i);
          grid.innerHTML=results.length?results.map((r,i)=>`<button class="wp-item" data-i="${i}" title="${esc(r.t||'')}"><img src="${esc(r.u)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${esc((r.t||'').slice(0,40))}</span></button>`).join(''):'<div class="empty">Ništa nije pronađeno — probaj drugi pojam (npr. na engleskom).</div>';
        }catch(e){grid.innerHTML='<div class="empty">Pretraga nije uspjela (provjeri internet).</div>';}};
      $('#wpGo',el).addEventListener('click',run);$('#wpQ',el).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
      grid.addEventListener('click',async e=>{const b=e.target.closest('.wp-item');if(!b)return;const r=results[+b.dataset.i];b.classList.add('busy');
        try{const id=await downloadToBlob(r.u);closeSheet();onPick(id,{f:r.f,a:r.a,l:r.l});toast('Fotka spremljena ✓');}
        catch(err){b.classList.remove('busy');toast('Preuzimanje nije uspjelo: '+(err.message||err));}});
      run();
    }});
}
Object.assign(ACT,{
  drinkWebPick:el=>{const d=drinkById(el.dataset.id);if(!d)return;
    openWebPicker({title:'Fotka: '+d.title,query:(WQ[d.id]||[]).map(x=>x.slice(2))[0]||d.title,lead:WQ[d.id],onPick:(id,cr)=>{const m=dm();const old=m.photo[d.id];m.photo[d.id]=id;m.credit[d.id]=cr;delete m.noweb[d.id];saveData();if(old)imgDelete(old);renderAll();}});},
  drinkNoWeb:el=>{const m=dm();const id=el.dataset.id;if(m.noweb[id])delete m.noweb[id];else m.noweb[id]=1;saveData();renderAll();},
  recWebPick:el=>{const r=docById(el.dataset.id)||(draft&&draft.doc.id===el.dataset.id?draft.doc:null);if(!r)return;const inDraft=draft&&draft.doc===r;if(inDraft)readDraftForm();
    openWebPicker({title:'Fotka: '+(r.title||'recept'),query:r.title||'',onPick:(id,cr)=>{r.images=[...(r.images||[]),id];r.cover=id;r.credits=Object.assign({},r.credits,{[id]:cr});if(inDraft)draft.newImgs.push(id);else putDoc(r);renderAll();}});},
});
