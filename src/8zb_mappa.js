/* ================= 7.12: LA MAPPA DELLA ZONA (tasto M) =================
   Prima il tasto M apriva sempre e solo la mappa di Aldoria. Ora, fuori dalla città, apre la mappa della zona in cui sei:
   la Foresta, il Deserto, i Picchi, i quartieri, Aldoria Vecchia, il piano del dungeon, il Colosseo... con le uscite, i
   personaggi (e le loro missioni), il boss, i forzieri e la tua posizione. Negli interni dei quartieri si vede il quartiere
   con l'edificio in cui sei; negli edifici della città resta la mappa di Aldoria, con l'edificio evidenziato.
   Il pulsante «🏰 Regno» / «📍 Zona» passa da una mappa all'altra. */
const ZMAPS={};   // la pianta delle zone all'aperto già visitate (serve quando sei in un interno del quartiere)
function zmapPois(L){const R=[];for(const e of L){
    if(e.k==='po')R.push({t:'po',x:e.px,y:e.py,n:e.n||'',st:e.st||'',to:e.to,lock:typeof gateLocked==='function'&&gateLocked(e)});
    else if(e.k==='npc'&&!e.wg&&!e.ghost)R.push({t:'npc',x:e.px,y:e.py,n:e.n||'',qm:e.qm||''});
    else if(e.k==='en'&&e.boss)R.push({t:'boss',x:e.px,y:e.py,n:e.n||''});
    else if(e.k==='ch')R.push({t:'ch',x:e.px,y:e.py});
    else if(e.k==='shard'||e.k==='lore'||e.k==='shard7')R.push({t:'star',x:e.px,y:e.py,n:e.n||''});
    else if(e.k==='res')R.push({t:'res',x:e.px,y:e.py,n:e.n||''});
    else if(e.k==='fs')R.push({t:'fish',x:e.px,y:e.py,n:'Punto di pesca'})}return R}
function zmapSnap(k){if(!k||!M||(Z[k]&&Z[k].int))return;ZMAPS[k]={k,N,M:M.map(r=>r.slice()),DEC:DEC.map(r=>r.slice()),TB:BM?(TB||[]).map(b=>Object.assign({},b)):[],BM:BM?BM.map(r=>r.slice()):null,z:ZZ,RDF:new Set(RDF),pois:zmapPois(ents),v:(ZMAPS[k]?ZMAPS[k].v:0)+1}}
const _load712m=load;load=function(k,from){_load712m(k,from);try{if(Zk===k)zmapSnap(k)}catch(_){}};
// che cosa mostrare per la zona in cui sei: null = la mappa del regno
function zmapTarget(){const k=Zk;if(!k||k==='town'||MODE==='ed')return null;const z=Z[k];
  if(z&&z.int){if(mapBld(k))return null;let o=z.out,i=0;while(o&&Z[o]&&Z[o].int&&i++<5)o=Z[o].out;
    if(o&&o!=='town'&&ZMAPS[o]){const d=ZMAPS[o];let hl=null;for(let q=k,j=0;q&&j<6&&!hl;j++){hl=d.TB.find(b=>b.to===q)||null;q=Z[q]&&Z[q].out}return{k:o,d,hl,inside:k}}}
  return{k,live:1}}
function zmapData(T){return T.live?{k:T.k,N,M,DEC,TB:BM?TB:[],BM,z:ZZ,RDF,pois:zmapPois(ents),v:'live'}:T.d}
function zmapName(T){const k=T?T.k:Zk;return String(Z[k]?Z[k].n:typeof zname==='function'?zname(k):k)}
/* ---- la pianta: un'immagine preparata una volta per zona e per tema ---- */
let ZMBM=null;
/* ---- il disegno della mappa della zona ---- */
const ZMICO={po:'#2aa8c8',door:'#8a5a2a',npc:'#f5c542',boss:'#d8283a',ch:'#e8962a',star:'#ffffff',res:'#5aa83a',fish:'#3a7ad8',me:'#e8303a',pl:'#3a8aff'};
let ZMHIT=[];
function zmapDraw(){const cv2=$('mapcv');if(!cv2||!MV.zt)return;const q=cv2.getContext('2d'),dp=MV.dp,w=MV.w,h=MV.h,p=mpal(),k=MV.k,T=MV.zt,d=zmapData(T),n=d.N,dk=mapDark();ZMHIT=[];
  q.setTransform(dp,0,0,dp,0,0);q.fillStyle=p.bg;q.fillRect(0,0,w,h);
  for(let i=0;i<26;i++){const[sx,sy]=w2s(((i*137)%280)/100-1.4,((i*91)%280)/100-1.4);q.fillStyle=`rgba(${p.spot},${.03+.025*(i%3)})`;q.beginPath();q.arc(sx,sy,(.06+(i%5)*.03)*k,0,6.3);q.fill()}
  const[x0,y0]=w2s(-.5,-.5),S=k,ts=S/n,bm=zmapBitmap(d),P2=(x,y)=>[x0+x*ts,y0+y*ts];
  q.imageSmoothingEnabled=false;q.drawImage(bm,x0,y0,S,S);q.imageSmoothingEnabled=true;q.strokeStyle=p.edge;q.lineWidth=3;q.strokeRect(x0,y0,S,S);
  // l'edificio in cui sei (interni dei quartieri)
  if(T.hl){const b=T.hl,a=.5+.5*Math.sin(performance.now()/180);q.globalAlpha=.4+.6*a;q.strokeStyle=p.me;q.lineWidth=4;q.strokeRect(x0+b.x*ts,y0+b.y*ts,b.w*ts,b.h*ts);q.globalAlpha=1}
  const lab=(s,x,y,col,fs,b)=>{q.font=`${b===0?'':'bold '}${fs}px Georgia,serif`;q.textAlign='center';q.textBaseline='middle';q.lineJoin='round';q.lineWidth=3.5;q.strokeStyle=p.txtS;q.strokeText(s,x,y);q.fillStyle=col||p.txt;q.fillText(s,x,y);q.textBaseline='alphabetic'},used=[];
  const free=(x,y,tw,th)=>{const R=[x-tw/2-3,y-th/2-2,tw+6,th+4];if(used.some(u2=>R[0]<u2[0]+u2[2]&&R[0]+R[2]>u2[0]&&R[1]<u2[1]+u2[3]&&R[1]+R[3]>u2[1]))return false;used.push(R);return true};
  // nomi degli edifici, se si è ingrandito abbastanza
  const fs=clamp(ts*1.4,10,15);if(d.TB&&ts>=4){q.font=`bold ${fs}px Georgia,serif`;for(const b of d.TB.slice().sort((a,b2)=>b2.w*b2.h-a.w*a.h)){if(!b.to||!Z[b.to])continue;if(ts<7&&b.w*b.h<30)continue;
      const bx=x0+(b.x+b.w/2)*ts,by=y0+(b.y+b.h/2)*ts,nm=String(Z[b.to].n).split(/[·,]/)[0].trim(),tw=q.measureText(nm).width;if(free(bx,by,tw,fs))lab(nm,bx,by,p.txt,fs)}}
  // segni: uscite e porte, personaggi, boss, forzieri, frammenti, risorse
  const r0=clamp(ts*.42,3.2,7);
  for(const o of d.pois){const[X,Y]=P2(o.x,o.y);if(X<-40||Y<-40||X>w+40||Y>h+40)continue;let tip=o.n;
    if(o.t==='po'){
      if(o.st==='door'){q.fillStyle=ZMICO.door;q.fillRect(X-r0*.6,Y-r0*.6,r0*1.2,r0*1.2);tip=Z[o.to]?String(Z[o.to].n):o.n}
      else{q.fillStyle=o.lock?'#8a5a4a':ZMICO.po;q.strokeStyle=dk?'#0a1420':'#ffffff';q.lineWidth=2;q.beginPath();q.moveTo(X,Y-r0*1.6);q.lineTo(X+r0*1.3,Y);q.lineTo(X,Y+r0*1.6);q.lineTo(X-r0*1.3,Y);q.closePath();q.fill();q.stroke();
        const nm=(o.n||'').replace(/^(Uscita|Esci): /,'');if(nm){q.font=`bold 13px Georgia,serif`;const tw=q.measureText(nm).width;if(free(X,Y-r0*2.6,tw,13))lab((o.lock?'🔒 ':'')+nm,X,Y-r0*2.6,dk?'#9fe8ff':'#14506a',13)}}}
    else if(o.t==='npc'){q.fillStyle=ZMICO.npc;q.strokeStyle=dk?'#1a1408':'#5a4010';q.lineWidth=1.5;q.beginPath();q.arc(X,Y,r0*.75,0,6.3);q.fill();q.stroke();
      if(o.qm){q.font='bold 16px Georgia,serif';q.textAlign='center';q.lineWidth=3;q.strokeStyle='#000';q.strokeText(o.qm,X,Y-r0-4);q.fillStyle=o.qm==='?'?'#7aff7a':'#ffd84a';q.fillText(o.qm,X,Y-r0-4)}}
    else if(o.t==='boss'){q.fillStyle=ZMICO.boss;q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.arc(X,Y,r0*1.25,0,6.3);q.fill();q.stroke();q.font=`bold ${Math.round(r0*1.6)}px Georgia,serif`;q.textAlign='center';q.textBaseline='middle';q.fillStyle='#fff';q.fillText('☠',X,Y+1);q.textBaseline='alphabetic';
      q.font='bold 13px Georgia,serif';const tw=q.measureText(o.n).width;if(free(X,Y+r0*2.6,tw,13))lab(o.n,X,Y+r0*2.6,dk?'#ff9a9a':'#8a1020',13)}
    else if(o.t==='ch'){q.fillStyle=ZMICO.ch;q.strokeStyle='#4a2a0a';q.lineWidth=1;q.fillRect(X-r0*.6,Y-r0*.45,r0*1.2,r0*.9);q.strokeRect(X-r0*.6,Y-r0*.45,r0*1.2,r0*.9);tip='Forziere'}
    else if(o.t==='star'){q.font=`bold ${Math.round(r0*2.6)}px Georgia,serif`;q.textAlign='center';q.textBaseline='middle';q.lineWidth=3;q.strokeStyle='#000';q.strokeText('✦',X,Y);q.fillStyle='#ffe88a';q.fillText('✦',X,Y);q.textBaseline='alphabetic';tip=o.n||'Qualcosa di prezioso'}
    else{q.fillStyle=ZMICO[o.t]||'#888';q.beginPath();q.arc(X,Y,Math.max(2,r0*.4),0,6.3);q.fill()}
    ZMHIT.push({x:X,y:Y,r:Math.max(8,r0*1.4),n:tip})}
  // gli altri eroi e tu
  if(T.live){for(const o of NET.list){const[X,Y]=P2(o.px,o.py);q.fillStyle=ZMICO.pl;q.strokeStyle='#fff';q.lineWidth=2;q.beginPath();q.arc(X,Y,r0*.8,0,6.3);q.fill();q.stroke();ZMHIT.push({x:X,y:Y,r:9,n:o.n})}
    if(P){const[X,Y]=P2(P.px,P.py),a=.5+.5*Math.sin(performance.now()/160),r=clamp(ts*.5,5,9),dr=P.dr||[0,1],an=Math.atan2(dr[1],dr[0]);
      q.fillStyle=`rgba(232,48,58,${.25*a})`;q.beginPath();q.arc(X,Y,r*(2+a),0,6.3);q.fill();q.fillStyle=ZMICO.me;q.beginPath();q.arc(X,Y,r,0,6.3);q.fill();q.strokeStyle='#fff';q.lineWidth=2;q.stroke();
      q.save();q.translate(X,Y);q.rotate(an);q.fillStyle='#fff';q.beginPath();q.moveTo(r*1.9,0);q.lineTo(r*.9,-r*.6);q.lineTo(r*.9,r*.6);q.closePath();q.fill();q.restore();ZMHIT.push({x:X,y:Y,r:10,n:'Tu sei qui'})}}
  // legenda e rosa dei venti
  const LG=[['me','Tu'],['po','Uscita'],['door','Porta'],['npc','Personaggio'],['boss','Boss'],['ch','Forziere']],lw2=118,lh2=LG.length*17+12,lx=w-lw2-12,ly=h-lh2-12;
  q.globalAlpha=.88;q.fillStyle=dk?'#141a28':'#fbf3df';q.fillRect(lx,ly,lw2,lh2);q.globalAlpha=1;q.strokeStyle=p.frame;q.lineWidth=1.5;q.strokeRect(lx,ly,lw2,lh2);
  LG.forEach(([c,s],i)=>{const yy=ly+14+i*17;q.fillStyle=ZMICO[c];q.beginPath();if(c==='po'){q.moveTo(lx+14,yy-6);q.lineTo(lx+19,yy);q.lineTo(lx+14,yy+6);q.lineTo(lx+9,yy)}else q.arc(lx+14,yy,5,0,6.3);q.fill();q.font='12px Georgia,serif';q.textAlign='left';q.fillStyle=p.txt;q.fillText(s,lx+28,yy+4)});
  q.font='bold 22px Georgia,serif';q.textAlign='center';q.fillStyle=p.edge;q.fillText('N',w-30,34);q.beginPath();q.moveTo(w-30,40);q.lineTo(w-37,60);q.lineTo(w-30,55);q.lineTo(w-23,60);q.closePath();q.fill();
  q.strokeStyle=p.frame;q.lineWidth=3;q.strokeRect(3,3,w-6,h-6)}
/* ---- la scheda della zona in cima alla guida ---- */
function zmapCard(T){const k=T.k,z=Z[k]||(typeof zd==='function'?zd(k):{})||{},zb=ZB.find(b=>b.k===k||(k.startsWith('mare')&&b.k==='mare_')),d=zmapData(T),dg=String(k).includes('@')?DG[k.split('@')[0]]:null;
  const ex=[...new Set(d.pois.filter(o=>o.t==='po'&&o.st!=='door').map(o=>(o.n||'').replace(/^(Uscita|Esci): /,'')).filter(Boolean))],doors=d.pois.filter(o=>o.t==='po'&&o.st==='door').length,
    npc=d.pois.filter(o=>o.t==='npc'),qn=npc.filter(o=>o.qm).map(o=>o.n),boss=d.pois.filter(o=>o.t==='boss').map(o=>o.n);
  let cr=typeof zoneCreatures==='function'?zoneCreatures(k):'';if(!cr&&dg)cr=[...new Set(dg.en.map(e=>E[e]&&E[e].n).filter(Boolean))].join(', ')+(dg.boss&&E[dg.boss]?' · boss: '+E[dg.boss].n:'');
  return`<div class="bcard here" id="zb_here"><h4>📍 ${esc(zmapName(T))} <small class="mu">· sei qui${T.inside&&Z[T.inside]?' (in '+esc(Z[T.inside].n)+')':''}</small></h4>
    ${z.lv?`<p class="mu">Livello consigliato: ${z.lv}+${dg?' · piano '+(z.dn||k.split('@')[1])+' di '+dg.fls:''}</p>`:''}${zb?`<p>${zb.tx}</p>`:''}
    ${ex.length?`<p><b>Uscite</b>: ${ex.map(esc).join(' · ')}</p>`:''}${doors?`<p><b>Edifici da visitare</b>: ${doors}</p>`:''}
    ${qn.length?`<p><b>Hanno una missione per te</b>: ${qn.map(esc).join(', ')}</p>`:''}${boss.length?`<p><b>Boss</b>: ${boss.map(esc).join(', ')}</p>`:''}
    ${cr?`<p class="mu"><b>Creature:</b> ${esc(cr)}</p>`:''}${zb&&zb.f?`<ul>${zb.f.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`}
/* ---- i pulsanti, il titolo, l'aggancio alle funzioni della mappa ---- */
function zmapUI(){const el=$('mappa');if(!el)return;const tools=el.querySelector('.mtools'),hd=el.querySelector('.mhd>b'),box2=el.querySelector('.mbox'),zona=MV.view==='zona'&&MV.zt;
  if(tools&&MV.zt){let b=$('mview');if(!b){b=document.createElement('button');b.id='mview';tools.insertBefore(b,tools.firstChild)}
    b.textContent=zona?'🏰 Regno':'📍 Zona';b.title=zona?'Mostra la mappa di Aldoria e del regno':'Mostra la mappa della zona in cui sei';b.onclick=()=>{MV.view=zona?'regno':'zona';zmapUI();mapFit();mapUI()}}
  if(hd)hd.innerHTML=ico('mappa',24)+' '+(zona?'Mappa · '+esc(zmapName(MV.zt).split(' · ')[0]):'Mappa di Aldoria');if(box2)box2.setAttribute('aria-label',zona?'Mappa della zona':'Mappa di Aldoria');
  const hint=el.querySelector('.mhint');if(hint)hint.textContent=zona?'Rotellina o +/− per ingrandire · trascina per spostarti · passa sopra i segni per i nomi':'Rotellina o +/− per ingrandire · trascina per spostarti · clicca una zona per la guida';
  const bro=el.querySelector('.bro');if(bro){const old=$('zb_here');if(old)old.remove();if(zona){const cov=bro.querySelector('.bcov');const tmp=document.createElement('div');tmp.innerHTML=zmapCard(MV.zt);const card=tmp.firstElementChild;if(cov)cov.after(card);else bro.prepend(card);const mb=el.querySelector('.mbro');if(mb)mb.scrollTop=0}}
  mapDirty()}
const _openMap712=openMap;openMap=function(){const el=$('mappa'),open=el&&el.style.display==='flex';MV.zt=started?zmapTarget():null;if(!open||!MV.zt)MV.view=MV.zt?'zona':'regno';_openMap712();zmapUI();if(MV.view==='zona'){mapFit();mapUI()}};
const _mapFit712=mapFit;mapFit=function(){if(MV.view==='zona'&&MV.zt){MV.k0=Math.min(MV.w,MV.h)*.92;MV.k=MV.k0;MV.x=0;MV.y=0;MV.fit=1;mapDirty();return}_mapFit712()};
const _mapSize712=mapSize;mapSize=function(cv2,first){const zona=MV.view==='zona'&&MV.zt,ok=MV.k0?MV.k/MV.k0:1;_mapSize712(cv2,first);if(zona){if(first||MV.fit)mapFit();else{MV.k0=Math.min(MV.w,MV.h)*.92;MV.k=MV.k0*ok}}};
const _mapMe712=mapMe;mapMe=function(){if(MV.view==='zona'&&MV.zt){const T=MV.zt,d=zmapData(T);let tx=0,ty=0;if(T.live&&P){tx=P.px/d.N-.5;ty=P.py/d.N-.5}else if(T.hl){tx=(T.hl.x+T.hl.w/2)/d.N-.5;ty=(T.hl.y+T.hl.h/2)/d.N-.5}
    MV.k=MV.k0*2.4;MV.x=tx;MV.y=ty;MV.fit=0;mapClampView();mapDirty();return}_mapMe712()};
const _mapDraw712=mapDraw;mapDraw=function(){if(MV.view==='zona'&&MV.zt){zmapDraw();return}_mapDraw712()};
const _mapLoop712=mapLoop;mapLoop=function(){if(MV.view==='zona'&&MV.zt){MV.raf=requestAnimationFrame(mapLoop);const t2=performance.now();if(t2-(MV.lp||0)>80){MV.lp=t2;MV.dirty=1}if(MV.dirty){MV.dirty=0;mapDraw();mapUI()}return}_mapLoop712()};
const _mapHover712=mapHover;mapHover=function(x,y){if(MV.view==='zona'&&MV.zt){const tip=$('mtip'),cv2=$('mapcv');let b=null,bd=1e9;for(const o of ZMHIT){const dd=Math.hypot(o.x-x,o.y-y);if(dd<o.r&&dd<bd&&o.n){bd=dd;b=o}}
    cv2.style.cursor=b?'pointer':'grab';if(b){tip.textContent=b.n;tip.style.display='block';tip.style.left=(x+14)+'px';tip.style.top=(y+10)+'px'}else tip.style.display='none';return}_mapHover712(x,y)};
const _mapClick712=mapClick;mapClick=function(x,y){if(MV.view==='zona'&&MV.zt){const c=$('zb_here');if(!MV.guide)mapGuide();if(c){c.scrollIntoView({behavior:'smooth',block:'start'});c.classList.remove('hl');void c.offsetWidth;c.classList.add('hl')}return}_mapClick712(x,y)};
(function(){const st=document.createElement('style');st.textContent=`.bcard.here{border:2px solid #f5b942;box-shadow:0 0 0 1px #f5b94244}.bcard.here h4 small{font-weight:normal;font-size:13px}#mview{font-weight:bold}`;document.head.appendChild(st)})();
