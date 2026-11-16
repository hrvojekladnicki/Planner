'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   UVOZ RECEPTA S LINKA
   Javna stranica recepta → (CORS proxy) → schema.org/Recipe JSON-LD
   (to ima većina recepata: Coolinarika, Podravka, AllRecipes, BBC Good Food…)
   → naslov, porcije, vremena, sastojci, koraci, kategorija, oznake, slika.
   Ako stranica nema JSON-LD, čita se tekst stranice (r.jina.ai) i dijeli
   pametnim uvozom teksta.
   ═══════════════════════════════════════════════════════════════════════ */
const RI_PROXIES=[
  u=>'https://api.allorigins.win/raw?url='+encodeURIComponent(u),
  u=>'https://corsproxy.io/?url='+encodeURIComponent(u),
];
async function riFetch(url,{as='text',timeout=14000}={}){
  let lastErr;
  for(const px of RI_PROXIES){
    const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),timeout);
    try{const r=await fetch(px(url),{signal:ctl.signal,credentials:'omit'});clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);
      if(as==='blob'){const b=await r.blob();if(!/^image\//.test(b.type)&&b.size<2000)throw new Error('nije slika');return b;}
      const tx=await r.text();if(tx.length<300)throw new Error('prazno');return tx;}
    catch(e){clearTimeout(t);lastErr=e;}
  }
  throw lastErr||new Error('Stranica nije dostupna');
}
function riText(s){if(s==null)return'';const d=new DOMParser().parseFromString(String(s),'text/html');return(d.body.textContent||'').replace(/\s+/g,' ').trim();}
function riDur(s){if(!s)return null;const m=String(s).match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);if(!m)return null;const v=(+m[1]||0)*1440+(+m[2]||0)*60+(+m[3]||0);return v||null;}
function riTypes(o){const t=o&&o['@type'];return Array.isArray(t)?t:t?[t]:[];}
function riFindRecipe(node,depth=0){
  if(!node||depth>6)return null;
  if(Array.isArray(node)){for(const x of node){const r=riFindRecipe(x,depth+1);if(r)return r;}return null;}
  if(typeof node!=='object')return null;
  if(riTypes(node).some(t=>/recipe/i.test(t)))return node;
  for(const k of['@graph','mainEntity','itemListElement','hasPart']){if(node[k]){const r=riFindRecipe(node[k],depth+1);if(r)return r;}}
  return null;
}
function riSteps(ins){
  const out=[];
  const walk=x=>{if(!x)return;if(typeof x==='string'){riText(x).split(/\n+|(?<=\.)\s+(?=\d+\.\s)/).map(s=>s.trim()).filter(Boolean).forEach(s=>out.push(s));return;}
    if(Array.isArray(x)){x.forEach(walk);return;}
    if(riTypes(x).some(t=>/HowToSection/i.test(t))){if(x.name)out.push('— '+riText(x.name)+' —');walk(x.itemListElement);return;}
    if(x.text||x.name)out.push(riText(x.text||x.name));else if(x.itemListElement)walk(x.itemListElement);};
  walk(ins);return out.filter(Boolean);
}
function riImage(img){if(!img)return'';if(typeof img==='string')return img;if(Array.isArray(img))return riImage(img[0]);return img.url||img.contentUrl||'';}
function riFromLD(R,url){
  const yieldV=Array.isArray(R.recipeYield)?R.recipeYield.join(' '):String(R.recipeYield||'');const serv=parseInt((yieldV.match(/\d+/)||[])[0],10)||null;
  const prep=riDur(R.prepTime),cook=riDur(R.cookTime)||(riDur(R.totalTime)&&prep?riDur(R.totalTime)-prep:riDur(R.totalTime));
  const cat=riText(Array.isArray(R.recipeCategory)?R.recipeCategory[0]:R.recipeCategory);
  const kw=(Array.isArray(R.keywords)?R.keywords:String(R.keywords||'').split(',')).map(x=>riText(x)).filter(x=>x&&x.length<25).slice(0,6);
  const ing=(R.recipeIngredient||R.ingredients||[]).map(x=>parseIngLine(riText(x))).filter(Boolean);
  return{title:riText(R.name),desc:riText(R.description),servings:serv,prep,cook,cat,tags:kw,ing,steps:riSteps(R.recipeInstructions),image:riImage(R.image),source:url};
}
function riFromHTML(html,url){
  const doc=new DOMParser().parseFromString(html,'text/html'); // DOMParser ne izvršava skripte
  for(const sc of doc.querySelectorAll('script[type="application/ld+json"]')){
    let j;try{j=JSON.parse(sc.textContent.trim().replace(/^\s*\/\/.*$/gm,''));}catch(e){continue;}
    const R=riFindRecipe(j);if(R)return riFromLD(R,url);
  }
  // microdata (itemprop)
  const ingEls=doc.querySelectorAll('[itemprop="recipeIngredient"],[itemprop="ingredients"]');
  if(ingEls.length){const q=s=>{const e=doc.querySelector(`[itemprop="${s}"]`);return e?(e.getAttribute('content')||e.textContent||'').trim():'';};
    return{title:q('name')||(doc.querySelector('h1')||{}).textContent||'',desc:q('description'),servings:parseInt(q('recipeYield'),10)||null,prep:riDur(q('prepTime')),cook:riDur(q('cookTime')),cat:'',tags:[],
      ing:[...ingEls].map(e=>parseIngLine(e.textContent.trim())).filter(Boolean),steps:[...doc.querySelectorAll('[itemprop="recipeInstructions"]')].flatMap(e=>[...e.querySelectorAll('li,p')].map(x=>x.textContent.trim()).filter(Boolean).length?[...e.querySelectorAll('li,p')].map(x=>x.textContent.trim()).filter(Boolean):[e.textContent.trim()]),
      image:(doc.querySelector('meta[property="og:image"]')||{}).content||'',source:url};}
  return{ogImage:(doc.querySelector('meta[property="og:image"]')||{}).content||'',ogTitle:(doc.querySelector('meta[property="og:title"]')||doc.querySelector('title')||{}).content||((doc.querySelector('title')||{}).textContent||'')};
}
async function importRecipeFromUrl(url){
  url=normUrl(url);
  let res=null,og={};
  try{const html=await riFetch(url);res=riFromHTML(html,url);if(res&&!res.ing){og=res;res=null;}}catch(e){console.warn('HTML',e);}
  if(!res){ // rezerva: tekst stranice preko r.jina.ai → pametni uvoz teksta
    const md=await riFetch('https://r.jina.ai/'+url,{timeout:20000}).catch(()=>{throw new Error('Stranica nije dostupna (možda je zaštićena ili traži prijavu)');});
    const clean=md.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/^#{1,6}\s*/gm,'').replace(/\*\*/g,'').replace(/^(Title|URL Source|Markdown Content):.*$/gmi,'');
    const p=parseRecipeText(clean);
    res={title:og.ogTitle||p.title,servings:p.servings,prep:p.prep,cook:p.cook,ing:p.ing,steps:p.steps,image:og.ogImage||'',source:url,desc:'',tags:[],cat:'',weak:true};
  }
  return res;
}
Object.assign(ACT,{
  draftUrl:async el=>{
    const inp=$('#impUrl');const url=(inp.value||'').trim();if(!/\./.test(url)){inp.focus();toast('Zalijepi link recepta');return;}
    readDraftForm();const d=draft.doc;el.disabled=true;const old=el.innerHTML;el.innerHTML='⏳ Čitam stranicu…';
    try{
      const r=await importRecipeFromUrl(url);
      if(r.title)d.title=r.title;if(r.servings)d.servings=r.servings;if(r.prep)d.prep=r.prep;if(r.cook)d.cook=r.cook;
      if(r.ing&&r.ing.length)d.ing=r.ing;if(r.steps&&r.steps.length)d.steps=r.steps.map(x=>({id:uid('s'),x}));
      if(r.cat){const m=RCATS.find(c=>c.toLowerCase().startsWith(r.cat.toLowerCase().slice(0,5)));d.cat=m||r.cat;}
      if(r.tags&&r.tags.length)d.tags=r.tags;if(r.desc)d.notes=[r.desc,d.notes].filter(Boolean).join('\n\n');d.source=r.source;
      draft.skipRead=true;renderAll();
      toast(`${r.weak?'Pročitano iz teksta stranice':'Recept prepoznat'}: ${(r.ing||[]).length} sastojaka, ${(r.steps||[]).length} koraka — provjeri i spremi`,{ms:5000});
      if(r.image){try{const b=await riFetch(new URL(r.image,url).href,{as:'blob'});const id=await imgUpload(new File([b],'recept.jpg',{type:b.type||'image/jpeg'}));
        if(draft&&draft.doc===d){d.images=[...(d.images||[]),id];draft.newImgs.push(id);if(!d.cover)d.cover=id;d.credits=Object.assign({},d.credits,{[id]:{f:url,a:'',l:'',s:tryDomain(url)}});readDraftForm();renderAll();}}catch(e){console.warn('slika',e);}}
    }catch(e){toast('Uvoz nije uspio: '+(e.message||e),{ms:6000});}
    finally{const b=$('[data-act="draftUrl"]');if(b){b.disabled=false;b.innerHTML=old;}}
  },
});
