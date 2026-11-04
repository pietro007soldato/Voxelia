/* ================= 7.46: il diario delle scoperte =================
   Nel Diario (K) c'è il «Diario delle scoperte»: i luoghi visitati (zone e dungeon), le creature affrontate e vinte,
   le risorse raccolte, e i pesci pescati (7.50: senza più le isole, tolte con la nave). Ogni pagina mostra quanto manca a
   completarla. Ogni dieci scoperte c'è un premio (oro ed esperienza), e una pagina completa vale un premio grande. */
XSV.add('disc');
const DSC={tab:'z'};
function dscFix(){P.disc=P.disc||{z:{},e:{},m:0,pg:{}};const d=P.disc;d.z=d.z||{};d.e=d.e||{};d.pg=d.pg||{};d.m=d.m|0;return d}
// cosa si può scoprire
const DSCX=k=>/^(torre\d+|cava43|ass:|tw|dim_|sogno|mare$|arrembaggio|stiva|ed:)/.test(k);
function dscZones(){const L=[];for(const k in Z){const z=Z[k];if(!z||!z.n||DSCX(k)||z.ed)continue;L.push(['z:'+k,z.n])}for(const id in DG){const d=DG[id];if(d&&!d.tw)L.push(['d:'+id,d.n])}return L}
function dscCreat(){const L=[];for(const k in E){const b=E[k];if(!b||!b.n||k.includes('.'))continue;L.push([k,b.n])}return L}
const dscRes=()=>Object.keys(typeof RESN!=='undefined'?RESN:{}).map(k=>[k,RESN[k]]);
const dscFish=()=>(typeof FISHT!=='undefined'?FISHT:[]).map(f=>[f.id,f.n]);
function dscCats(){const d=dscFix();return[
  {k:'z',i:'🗺',n:'Luoghi',L:dscZones(),has:([k])=>!!d.z[k]},{k:'e',i:'🐺',n:'Creature',L:dscCreat(),has:([k])=>!!d.e[k]},
  {k:'r',i:'🪵',n:'Risorse',L:dscRes(),has:([k])=>(P.res&&P.res[k]|0)>0||!!(d.r&&d.r[k])},{k:'f',i:'🐟',n:'Pesci',L:dscFish(),has:([k])=>(P.fish&&P.fish[k]|0)>0}]}
function dscCount(){let n=0;for(const C of dscCats())n+=C.L.filter(C.has).length;return n}
function dscCheck(){if(!P)return;const d=dscFix(),n=dscCount(),m=Math.floor(n/10);
  if(m>d.m){const k=m-d.m;d.m=m;const g2=Math.round(80*m*(1+P.lv*.05)),xp=40*m;P.g+=g2;gainXP(xp);banner('Diario delle scoperte',n+' scoperte · +'+g2+' oro, +'+xp+' XP','libro');jingle([64,67,71,76],.1,'triangle');hud()}
  for(const C of dscCats()){if(C.open||!C.L.length||d.pg[C.k])continue;if(C.L.every(C.has)){d.pg[C.k]=1;const g2=Math.round(1500*(1+P.lv*.05));P.g+=g2;gainXP(800);setTimeout(()=>banner('Pagina completa: '+C.n,'Hai scoperto tutto! +'+g2+' oro','corona'),1200)}}}
const _loadPost746s=loadPost;loadPost=function(k){_loadPost746s(k);if(!P||!started)return;const d=dscFix(),dg=ZZ&&ZZ.dg&&DG[ZZ.dg]&&!DG[ZZ.dg].tw?'d:'+ZZ.dg:null,zk='z:'+k;
  let nw=null;if(dg&&!d.z[dg]){d.z[dg]=1;nw=DG[ZZ.dg].n}else if(!DSCX(k)&&Z[k]&&!d.z[zk]){d.z[zk]=1;nw=Z[k].n}if(nw){flt(P,'📖 Nuovo luogo','#ffe08a');dscCheck()}};
const _kill746s=kill;kill=function(e){const ty=e&&e.k==='en'&&ents.includes(e)?e.t:null;_kill746s(e);if(!ty||String(ty).includes('.'))return;const d=dscFix();if(!d.e[ty]){d.e[ty]=1;flt(P,'📖 '+((E[ty]&&E[ty].n)||ty),'#ffe08a');dscCheck()}};
const _gather746s=gather;gather=function(e){const r=e&&e.r;_gather746s(e);if(!r)return;const d=dscFix();d.r=d.r||{};if(!d.r[r]){d.r[r]=1;dscCheck()}};
setInterval(()=>{try{if(started&&P)dscCheck()}catch(_){}},15000);
// il pannello: una scheda per pagina
X43P.disc46=()=>{const C=dscCats(),cur=C.find(c=>c.k===DSC.tab)||C[0],got=cur.L.filter(cur.has),tot=cur.L.length,n=dscCount();
  return`<h3>📖 Diario delle scoperte · ${n} scoperte</h3><div class="srow">${C.map(c=>{const g2=c.L.filter(c.has).length;return`<button class="${c.k===cur.k?'on':''}" onclick="DSC.tab='${c.k}';pn('disc46')">${c.i} ${c.n} ${g2}${c.open?'':'/'+c.L.length}</button>`}).join('')}</div>
  ${cur.open?'':`<p class="x43t">${got.length} su ${tot}${dscFix().pg[cur.k]?' · ✔ pagina completa':' · '+Math.round(got.length/Math.max(1,tot)*100)+'%'} · ogni dieci scoperte c'è un premio, una pagina completa vale 1500 oro.</p>`}
  <div class="dsc46">${cur.L.map(q=>cur.has(q)?`<span>${esc(q[1])}</span>`:'<span class="mu">???</span>').join('')}</div>
  <button onclick="pn('dia')">Indietro</button><button onclick="cl()">Chiudi</button>`};
// un pulsante nel Diario
{const p0=pn;pn=function(m,arg){p0(m,arg);if(m==='dia'&&PM==='dia'){const pe=$('pn');if(pe&&!pe.querySelector('.dsc46b'))pe.insertAdjacentHTML('afterbegin',`<button class="dsc46b" onclick="pn('disc46')">📖 Diario delle scoperte · ${dscCount()}</button>`)}}}
(function(){const st=document.createElement('style');st.textContent=`.dsc46{display:flex;flex-wrap:wrap;gap:4px 6px;margin:6px 0 10px;max-height:46vh;overflow:auto}.dsc46 span{font-size:13px;background:#ffffff12;border:1px solid #ffffff20;border-radius:4px;padding:2px 7px}.dsc46b{width:100%;margin-bottom:6px}`;document.head.appendChild(st)})();
