const CATS=["Smileys & Emotion","People & Body","Animals & Nature","Food & Drink","Travel & Places","Activities","Objects","Symbols","Flags"];
const $=(q)=>document.querySelector(q);
const tabs=$("#tabs"),grid=$("#grid"),fav=$("#fav"),rec=$("#rec"),sel=$("#sel");
const search=$("#q"); let CUR=CATS[0]; let LIST=[]; let SELECTED=new Set();

function setTabs(){tabs.innerHTML=CATS.map(c=>`<button class="tab ${c===CUR?'active':''}" data-c="${c}">${c}</button>`).join('');tabs.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{CUR=b.dataset.c;setTabs();render();});}
function card(e){const s=SELECTED.has(e.name)?'selected':'';return `<button class="card ${s}" data-n="${e.name}" title="${e.name}"><img src="${e.url}" alt="${e.name}"><div>:${e.name}:</div></button>`;}
function render(){const qv=(search?.value||'').trim().toLowerCase();const rows=LIST.filter(x=>x.cat===CUR).filter(x=>!qv||x.name.includes(qv));grid.innerHTML=rows.map(card).join('');grid.querySelectorAll('.card').forEach(btn=>{btn.onclick=()=>{const n=btn.dataset.n;SELECTED.has(n)?SELECTED.delete(n):SELECTED.add(n);btn.classList.toggle('selected');renderSel();pushRecent(n);};btn.ondblclick=()=>copy(`:${btn.dataset.n}:`);});renderFav();renderRec();renderSel();}
function getLS(k,def){try{return JSON.parse(localStorage.getItem(k))??def;}catch{return def;}}
function setLS(k,v){localStorage.setItem(k,JSON.stringify(v));}
function renderFav(){const a=getLS('fav',[]);fav.innerHTML=a.map(n=>`<span class="pill" data-n="${n}" title="Click to copy">:${n}: ★</span>`).join('');fav.querySelectorAll('.pill').forEach(p=>p.onclick=()=>copy(`:${p.dataset.n}:`));}
function renderRec(){const a=getLS('rec',[]);rec.innerHTML=a.map(n=>`<span class="pill" data-n="${n}" title="Click to copy">:${n}:</span>`).join('');rec.querySelectorAll('.pill').forEach(p=>p.onclick=()=>copy(`:${p.dataset.n}:`));}
function renderSel(){const a=[...SELECTED];sel.innerHTML=a.map(n=>`<span class="pill" data-n="${n}" title="Click to copy">:${n}:</span>`).join('');sel.querySelectorAll('.pill').forEach(p=>p.onclick=()=>copy(`:${p.dataset.n}:`));}
function pushRecent(n){const a=getLS('rec',[]);const out=[n,...a.filter(x=>x!==n)].slice(0,18);setLS('rec',out);renderRec();}
function copy(txt){navigator.clipboard.writeText(txt).then(()=>alert('Copied: '+txt));}
$("#copySel").onclick=()=>{const txt=[...SELECTED].map(n=>`:${n}:`).join(' ');if(!txt)return alert('No selection');navigator.clipboard.writeText(txt).then(()=>alert('Copied selection!'));};
$("#randomBtn").onclick=()=>{const pool=LIST.filter(x=>x.cat===CUR);if(!pool.length)return alert('No data yet.');const picks=[];for(let i=0;i<8;i++){picks.push(pool[Math.floor(Math.random()*pool.length)].name);}alert('🎲 Random 8:\\n'+picks.map(n=>`:${n}:`).join(' '));};
search.addEventListener('keydown',e=>{if(e.key==='Escape'){search.value='';render();}if(e.key==='Enter'){const first=grid.querySelector('.card');if(first){copy(`:${first.dataset.n}:`);}}});
document.addEventListener('keydown',e=>{if(e.key==='/'){e.preventDefault();search.focus();}});
async function loadData(){const r=await fetch('/api/emojis');return r.json();}
(async()=>{setTabs();LIST=await loadData();render();})();