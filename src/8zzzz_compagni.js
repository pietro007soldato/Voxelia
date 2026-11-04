/* ================= 7.54: I COMPAGNI IN RETE, GLI SCAMBI, LE VARIANTI E I NOMI =================
   - In rete ogni giocatore vede il compagno in campo degli altri (con nome, livello, forma evoluta e variante), che
     cammina con il suo padrone e attacca con lui. Nel profilo di un eroe (doppio clic) c'è anche la sua stalla.
   - I colpi dei compagni arrivano a tutti: quando il compagno di qualcuno colpisce un mostro, il danno arriva anche al
     giocatore che guida quel mostro e agli altri, come i colpi degli eroi (7.41).
   - I compagni si scambiano dalla finestra degli scambi (fino a tre per volta), anche quelli nati dagli incroci, con la
     loro specie, il livello, l'esperienza, il nome e la variante.
   - Le varianti: negli incroci il piccolo può nascere con una variante di colore e di effetti. Ce ne sono quattordici,
     dalle comuni alle leggendarie; più è rara, più il compagno è forte. Un genitore con una variante può passarla al figlio.
   - I compagni si rinominano direttamente nella stalla (prima serviva una finestra del browser). */
XSV.add('x47');
// ---- le varianti ----
const PVT=[{n:'Comune',c:'#c8ccd4',b:.05},{n:'Non comune',c:'#5ad65a',b:.08},{n:'Rara',c:'#4aa3ff',b:.12},{n:'Epica',c:'#b866ff',b:.18},{n:'Leggendaria',c:'#ffae2b',b:.25}];
// f(h,s,l,b) restituisce il colore nuovo [h,s,l] (h in gradi, s e l da 0 a 1); fx: gli effetti intorno al compagno
const PVR={
  cromatica:{n:'Cromatica',r:0,w:26,i:'🎨',d:'colori stravolti, ogni cromatica a modo suo',f:(h,s,l,v)=>[h+(v.vh||180),Math.min(1,s*1.15+.1),l]},
  perla:{n:'Perla',r:0,w:12,i:'⚪',d:'bianco perla, quasi senza colore',f:(h,s,l)=>[h,s*.12,.74+.2*l]},
  corallo:{n:'Corallo',r:0,w:10,i:'🪸',d:'rosa e arancio come il corallo',f:(h,s,l)=>[8+l*14,.78,.42+.36*l]},
  smeraldo:{n:'Smeraldo',r:1,w:8,i:'💚',d:'verde gemma',f:(h,s,l)=>[145,.68,.16+.46*l],fx:['#7affb0','#d8ffe8']},
  ghiaccio:{n:'Ghiaccio',r:1,w:8,i:'❄',d:'bianco e azzurro, lascia cadere fiocchi di neve',f:(h,s,l)=>[198,.58,.52+.4*l],fx:['#ffffff','#cfefff']},
  ombra:{n:'Ombra',r:1,w:7,i:'🌑',d:'quasi nero, con un fumo viola',f:(h,s,l)=>[270,.42,.05+.2*l],fx:['#6a3a9a','#2a1a3a']},
  neon:{n:'Neon',r:1,w:6,i:'💡',d:'colori accesi e un alone luminoso',f:(h,s,l)=>[(h+150)%360,1,.5+.12*l],ring:1},
  tempesta:{n:'Tempesta',r:2,w:5,i:'⚡',d:'grigio temporale, con i lampi',f:(h,s,l)=>[218,.2,.12+.42*l],fx:['#fff36a','#ffffff'],zap:1},
  magma:{n:'Magma',r:2,w:5,i:'🌋',d:'roccia scura con le crepe di lava',f:(h,s,l)=>l<.45?[12,.32,.07+.18*l]:[18+50*(l-.45),1,.5],fx:['#ff7a2a','#ffd84a'],ring:1},
  spettro:{n:'Spettro',r:2,w:4,i:'👻',d:'trasparente come un fantasma',f:(h,s,l)=>[176,.45,.7+.22*l],a:.55,fx:['#bffaff','#ffffff']},
  oro:{n:'Oro',r:3,w:3.4,i:'🪙',d:'tutto d\'oro, con le scintille',f:(h,s,l)=>[44,.86,.28+.46*l],fx:['#ffd84a','#fff2a0'],ring:1},
  stellare:{n:'Stellare',r:3,w:2.6,i:'🌌',d:'blu notte con le stelle che brillano',f:(h,s,l)=>[235,.62,.09+.26*l],fx:['#ffffff','#9ad8ff','#ffe9a0'],ring:1},
  diamante:{n:'Diamante',r:4,w:1.2,i:'💎',d:'trasparente e lucente, manda lampi di luce',f:(h,s,l)=>[188,.55,.66+.3*l],fx:['#ffffff','#bff4ff'],ring:1},
  rgb:{n:'RGB',r:4,w:.8,i:'🌈',d:'cambia colore di continuo, come un arcobaleno',f:(h,s,l,v,k)=>[(k*30+l*140)%360,.95,.48+.16*l],fx:['#ff5a5a','#5aff7a','#5a9aff'],ring:1,rgb:1}};
const PV={rp:{},ren:null,mc:new Map(),inPet:0,lastA:{}};
const pvOk=k=>!!(k&&PVR[k]);
const pvBonus=p=>p&&pvOk(p.vr)?PVT[PVR[p.vr].r].b:0;
const pvLabel=p=>domName(p)+(pvOk(p.vr)?' · '+PVR[p.vr].n:'');
const pvTag=k=>{if(!pvOk(k))return'';const V=PVR[k],T=PVT[V.r];return`<span class="pvb" style="--c:${T.c}" title="${esc(V.d)} · ${T.n}: +${Math.round(T.b*100)}% attacco">${V.i} ${esc(V.n)}</span>`};
// colori: da esadecimale a HSL e ritorno
function pvHSL(c){let s=String(c||'');if(/^#[0-9a-f]{3}$/i.test(s))s='#'+s[1]+s[1]+s[2]+s[2]+s[3]+s[3];if(!/^#[0-9a-f]{6}/i.test(s))return null;const n=parseInt(s.slice(1,7),16),r=(n>>16)/255,g2=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g2,b),mn=Math.min(r,g2,b),l=(mx+mn)/2;
  if(mx===mn)return[0,0,l];const d=mx-mn,sa=l>.5?d/(2-mx-mn):d/(mx+mn);let h=mx===r?(g2-b)/d+(g2<b?6:0):mx===g2?(b-r)/d+2:(r-g2)/d+4;return[h*60,sa,l]}
function pvHex(h,s,l){h=((h%360)+360)%360/360;s=clamp(s,0,1);l=clamp(l,0,1);const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t2=>{t2<0?t2+=1:t2>1?t2-=1:0;return t2<1/6?p+(q-p)*6*t2:t2<1/2?q:t2<2/3?p+(q-p)*(2/3-t2)*6:p},x=v=>Math.round(clamp(v,0,1)*255).toString(16).padStart(2,'0');
  return'#'+x(f(h+1/3))+x(f(h))+x(f(h-1/3))}
// il modello del compagno: la forma della specie (più grande se evoluto), poi i colori della variante
function pvBase(tk,lv){let m=E[tk]&&E[tk].m;const ev=lv>=20?2:lv>=10?1:0;if(m&&ev){const s=1+.15*ev;if(m.rg)m=rgScale(m,s);else{const L=scl(m,s);for(const k of Object.keys(m))if(isNaN(+k))L[k]=m[k];L.top=(m.top||36)*s;m=L}}return m}
function pvModel(tk,lv,vr,vh,k){const ev=lv>=20?2:lv>=10?1:0,key=tk+'|'+ev+'|'+(vr||'')+'|'+(vh|0)+'|'+(k|0);let m=PV.mc.get(key);if(m)return m;m=pvBase(tk,lv);if(!m)return m;
  if(pvOk(vr)){const V=PVR[vr],src=m;m=src.map(b=>{const o=b.slice(),c=pvHSL(b[6]);if(c){const[h,s,l]=V.f(c[0],c[1],c[2],{vh},k|0);o[6]=pvHex(h,s,l)}return o});for(const q of Object.keys(src))if(isNaN(+q))m[q]=src[q]}
  if(PV.mc.size>400)PV.mc.clear();PV.mc.set(key,m);return m}
const pvStep=()=>Math.floor(t*6)%12;
// il sorteggio della variante alla nascita: i genitori con una variante la passano più facilmente
function pvRoll(va,vb){const r=Math.random();if(pvOk(va)&&va===vb&&r<.5)return va;if(pvOk(va)&&r<.25)return va;if(pvOk(vb)&&r>.75)return vb;
  if(Math.random()>.45)return null;const L=Object.entries(PVR);let tot=0;for(const[,V]of L)tot+=V.w;let x=Math.random()*tot;for(const[k,V]of L){if((x-=V.w)<0)return k}return'cromatica'}
// ---- gli incroci: le varianti dei genitori finiscono nell'uovo, e il piccolo nasce con la sua ----
{const s0=incStart;incStart=function(){const a=P.pets&&P.pets[INC.a],b=P.pets&&P.pets[INC.b],had=!!P.egg47;s0();if(!had&&P.egg47){P.egg47.va=a&&a.vr||null;P.egg47.vb=b&&b.vr||null;save()}}}
{const h0=incHatch;incHatch=function(){const g=P.egg47;if(!g||Date.now()<g.t)return h0();const n0=Array.isArray(P.pets)?P.pets.length:0;h0();if(!Array.isArray(P.pets)||P.pets.length<=n0)return;
  const p=P.pets[P.pets.length-1],v=pvRoll(g.va,g.vb);if(!v)return;p.vr=v;if(v==='cromatica')p.vh=60+Math.floor(Math.random()*240);const V=PVR[v],T=PVT[V.r];save();
  setTimeout(()=>{if(!started)return;banner(V.i+' Variante '+V.n+'!',T.n+' · '+V.d+' · +'+Math.round(T.b*100)+'% attacco',V.r>=3?'corona':'stella');jingle(V.r>=3?[72,76,79,84,88,91]:[67,72,76,79],.08,'triangle');if(cineOK()&&V.fx)sparks(P.px,P.py,40,V.fx,130)},2600)}}
// ---- il compagno in campo: la variante (colori, forza, effetti) e il nome ----
{const s0=domSummon;domSummon=function(){s0();const e=DOM.pet;if(!e||!e.p)return;const p=e.p;if(pvOk(p.vr)){e.at=+(e.at*(1+pvBonus(p))).toFixed(1);e.m=pvModel(p.t,p.lv,p.vr,p.vh,0)||e.m}e.n=pvLabel(p)}}
// i colpi del compagno arrivano anche agli altri giocatori (come quelli dell'eroe)
{const d0=domPetTick;domPetTick=function(dt){PV.inPet=1;try{return d0(dt)}finally{PV.inPet=0}}}
{const h0=hurtE;hurtE=function(e,d,rem,cr){if(PV.inPet&&rem&&e&&e.k==='en'&&e.mx>0&&typeof NET!=='undefined'&&NET.code&&NET.ok){if(e.pup)e.hme=t;NET.hits.push([e.sg||e.id,+(Math.max(1,+d||0)/e.mx).toFixed(4),++NET.seq]);if(NET.hits.length>14)NET.hits.shift()}return h0.apply(this,arguments)}}
// le specie degli incroci di un compagno (anche quelle dei nonni) servono a chi lo vede o lo riceve
function pvDefs(tk,out,d){out=out||{};d=d|0;if(d>6||!String(tk).startsWith('x47.'))return out;const id=String(tk).slice(4),x=P.x47&&P.x47[id];if(!x||out[id])return out;out[id]=x;pvDefs(x.a,out,d+1);pvDefs(x.b,out,d+1);return out}
function pvReg(defs){if(!defs||typeof defs!=='object')return;const keep=P.x47;P.x47=Object.assign({},defs);try{for(let i=0;i<4;i++)x47Reg()}catch(e){}finally{P.x47=keep}}
const pvType=tk=>{tk=String(tk||'');if(!E[tk]&&tk.startsWith('tw.')&&typeof twType==='function')try{twType(tk)}catch(e){}return!!E[tk]};
// ---- quello che mando agli altri: il mio compagno in campo ----
{const sp0=syncPack;syncPack=function(){const o=sp0()||{};const e=DOM.pet;if(e&&e.p&&ents.includes(e)&&domOn()&&NET.ok){const p=e.p,fd=e.fd||[0,1],a=e.atkT!=null&&t-e.atkT<.3?1:0,df=String(p.t).startsWith('x47.')?pvDefs(p.t):0;
    o.cp=[String(p.t).slice(0,60),pvLabel(p).slice(0,40),+e.px.toFixed(2),+e.py.toFixed(2),p.lv|0,pvOk(p.vr)?p.vr:'',p.vh|0,a,+(+fd[0]||0).toFixed(2),+(+fd[1]||0).toFixed(2),+(Math.max(0,e.hp)/(e.mx||1)).toFixed(2),df]}
  return o}}
// ---- i compagni degli altri: copie che si disegnano come il tuo, ma che il gioco non tocca ----
function pvRemote(dt){if(typeof NET==='undefined'||!NET.ok||!started){for(const id in PV.rp)pvDrop(id);return}const rk=rmKey(),seen={};
  for(const id in NET.peers){const q=NET.peers[id],pl=NET.pl&&NET.pl[id];if(!q||q.rm!==rk||!pl||!Array.isArray(q.cp))continue;const c=q.cp,tk=String(c[0]||'').slice(0,60);
    if(c[11]&&typeof c[11]==='object'&&tk.startsWith('x47.')&&!E[tk])pvReg(c[11]);if(!pvType(tk))continue;seen[id]=1;
    const lv=clamp(c[4]|0,1,40),vr=pvOk(c[5])?c[5]:'',vh=clamp(c[6]|0,0,359),x=+c[2],y=+c[3];if(!isFinite(x)||!isFinite(y))continue;let e=PV.rp[id];
    if(!e||!ents.includes(e)||e.t!==tk||e.lv!==lv){if(e)pvDrop(id);e=PV.rp[id]={k:'rpet',rid:id,t:tk,lv,px:x,py:y,tx:x,ty:y,hp:1,mx:1,fd:[0,1],p:{t:tk,lv,vr,vh},b:E[tk]||{}};ents.push(e)}
    e.n=String(c[1]||'Compagno').slice(0,40);e.p.vr=vr;e.p.vh=vh;e.vr=vr;e.m=pvModel(tk,lv,vr,vh,vr==='rgb'?pvStep():0);e.tx=x;e.ty=y;e.hp=clamp(+c[10]||0,0,1);e.mx=1;
    const dx=x-e.px,dy=y-e.py,d=Math.hypot(dx,dy);if(d>7){e.px=x;e.py=y}else if(d>.01){const k=Math.min(1,dt*10);e.px+=dx*k;e.py+=dy*k;e.mvT=t;e.fd=[dx/d,dy/d]}
    if(c[7]&&!PV.lastA[id]){e.atkT=t;e.atkD=[+c[8]||0,+c[9]||1];e.fd=e.atkD}PV.lastA[id]=c[7]?1:0}
  for(const id in PV.rp)if(!seen[id])pvDrop(id)}
function pvDrop(id){const e=PV.rp[id];delete PV.rp[id];delete PV.lastA[id];if(e){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1)}}
{const u0=upd;upd=function(dt){u0(dt);if(!started||!P)return;try{pvRemote(dt);const e=DOM.pet;if(e&&e.p){e.n=pvLabel(e.p);if(e.p.vr==='rgb')e.m=pvModel(e.p.t,e.p.lv,'rgb',0,pvStep())}}catch(err){console.warn('compagni',err)}}}
{const l0=loadPost;loadPost=function(k){PV.rp={};PV.lastA={};l0(k)}}
// il disegno: la variante (trasparenza, alone, scintille, lampi) intorno al compagno, tuo o di un altro
{const e0=ent;ent=function(e){if(!e||(e.k!=='pet'&&e.k!=='rpet')){e0(e);return}const p=e.p||{},V=pvOk(p.vr)?PVR[p.vr]:null,rem=e.k==='rpet';
  if(rem)e.k='pet';const a0=g.globalAlpha;if(V&&V.a)g.globalAlpha=a0*V.a;try{e0(e)}finally{g.globalAlpha=a0;if(rem)e.k='rpet'}
  if(rem&&e.hp<1&&!D3B){const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0),top=(e.m&&e.m.top||36)+10;g.fillStyle='#0008';g.fillRect(sx-14,sy-top-2,28,4);g.fillStyle='#5ad06a';g.fillRect(sx-14,sy-top-2,28*e.hp,4)}
  if(!V)return;const T=PVT[V.r],col=V.rgb?pvHex(t*90,1,.6):V.fx?V.fx[0]:T.c;
  if(V.ring)for(let i=0;i<12;i++){const a=i/12*6.283-t*1.4;box(e.px+Math.cos(a)*.5-.03,e.py+Math.sin(a)*.5-.03,.2+Math.sin(t*3+i)*.4+.4,.06,.06,.3,col,1.4)}
  if(V.fx&&cineOK()&&Math.random()<(V.r>=3?.35:.18)){const top=(e.m&&e.m.top||30);sparks(e.px+(Math.random()-.5)*.7,e.py+(Math.random()-.5)*.7,1,V.rgb?[col]:V.fx,V.zap?60:25);if(V.zap&&Math.random()<.04&&typeof vf==='function')vf({k:'flash',x:e.px,y:e.py,r:30,c:'255,243,106',d:.15,z:top})}}}
// ---- la stalla: anteprime con la variante, l'etichetta della variante, il nome che si cambia sul posto ----
domPaint=function(){const pe=$('pn');if(!pe)return;for(const c of pe.querySelectorAll('canvas.dmpv')){const p=P.pets[+c.dataset.i];if(!p)continue;const q=c.getContext('2d');q.clearRect(0,0,76,76);
  const m=pvModel(p.t,p.lv,p.vr,p.vh,p.vr==='rgb'?pvStep():0);if(!m)continue;let top=0;for(const b of m)top=Math.max(top,(b[2]||0)+(b[5]||0));const sc=Math.min(2.2,58/(top+6)),og=g;g=q;
  try{q.setTransform(sc,0,0,sc,38,68);if(pvOk(p.vr)&&PVR[p.vr].a)q.globalAlpha=PVR[p.vr].a;if(m.rg||m.hm)drawHero(m,0,0,0,0,3);else drawL(m,0,0,0)}catch(_){}finally{q.globalAlpha=1;g=og}}};
domRen=function(i){if(!P.pets[i])return;PV.ren=i;pn('pets')};
function pvRenSave(i){const p=P.pets[i],el=$('pvren');if(p&&el){const n=String(el.value||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,22);if(n&&n!==p.n){p.n=n;if(DOM.pet&&DOM.pet.p===p)DOM.pet.n=pvLabel(p);msg('Ora si chiama '+n);save()}}PV.ren=null;pn('pets')}
function pvRenNo(){PV.ren=null;pn('pets')}
{const p0=pn;pn=function(m,arg){if(m!=='pets')PV.ren=null;p0(m,arg);if(m!=='pets'||PM!=='pets')return;const pe=$('pn');if(!pe)return;const cards=pe.querySelectorAll('.dmc');
  cards.forEach((c,i)=>{const p=P.pets[i];if(!p)return;const b=c.querySelector('.dmb b');if(!b)return;
    if(pvOk(p.vr)&&!c.querySelector('.pvb'))b.insertAdjacentHTML('afterend',pvTag(p.vr));
    if(PV.ren===i){b.outerHTML=`<span class="pvren"><input id="pvren" maxlength="22" value="${esc(p.n)}" aria-label="Nuovo nome" onkeydown="event.stopPropagation();if(event.key==='Enter')pvRenSave(${i});else if(event.key==='Escape')pvRenNo()"><button onclick="pvRenSave(${i})">✔</button><button onclick="pvRenNo()">✖</button></span>`;
      setTimeout(()=>{const el=$('pvren');if(el){el.focus();el.select()}},20)}});
  if(P.pets.some(p=>pvOk(p.vr)&&p.vr==='rgb')){clearTimeout(PV.rgbT);PV.rgbT=setTimeout(function a(){if(PM!=='pets')return;domPaint();PV.rgbT=setTimeout(a,160)},160)}}}
// ---- gli incroci: le varianti spiegate ----
{const p0=pn;pn=function(m,arg){p0(m,arg);if(m!=='inc47'||PM!=='inc47')return;const pe=$('pn');if(!pe||pe.querySelector('.pvinc'))return;const h3=pe.querySelector('.x43t');if(!h3)return;
  const L=Object.values(PVR).sort((a,b)=>b.r-a.r||a.w-b.w);
  h3.insertAdjacentHTML('afterend',`<details class="pvinc"><summary>✨ Le varianti: il piccolo può nascere con una di queste (una volta su due circa)</summary><div class="pvl">${L.map(V=>`<span style="--c:${PVT[V.r].c}"><b>${V.i} ${esc(V.n)}</b><small>${PVT[V.r].n} · +${Math.round(PVT[V.r].b*100)}% attacco · ${esc(V.d)}</small></span>`).join('')}</div><p class="x43t">Se un genitore ha una variante, la passa al piccolo una volta su quattro; se ce l'hanno tutti e due uguale, una volta su due.</p></details>`)}}
// ---- lo scambio dei compagni ----
const pvTrPet=id=>P.pets&&P.pets.find(p=>p.id===id);
function pvPackPet(p){const o={id:String(p.id).slice(0,16),t:String(p.t).slice(0,60),n:String(p.n).slice(0,22),lv:p.lv|0,xp:Math.max(0,Math.round(p.xp||0))};if(pvOk(p.vr)){o.vr=p.vr;o.vh=p.vh|0}if(String(p.t).startsWith('x47.'))o.xd=pvDefs(p.t);return o}
const pvPetRow=(p,btn)=>`<div class="it"><span>🐾 <b>${esc(p.n)}</b> ${pvTag(p.vr)} <span class="mu">livello ${p.lv|0}${E[p.t]&&E[p.t].n?' · '+esc(String(E[p.t].n).replace(/^[^A-Za-zÀ-ÿ]+/,'')):''}</span></span>${btn?`<span>${btn}</span>`:''}</div>`;
{const h0=tradeHTML;tradeHTML=function(){let h=h0();const T=NET.tr;if(!T||!h)return h;T.mine.pe=Array.isArray(T.mine.pe)?T.mine.pe.filter(id=>pvTrPet(id)):[];const you=T.you||{},th=T.them||{};
  const yp=Array.isArray(you.pe)?you.pe:[],tp=Array.isArray(th.pe)?th.pe:[];if(!domOn()&&!tp.length)return h;
  for(const q of tp)if(q&&q.xd&&String(q.t).startsWith('x47.')&&!E[q.t])pvReg(q.xd);
  let s=`<h4>🐾 Compagni</h4><div class="cols"><div><p class="mu">I tuoi in offerta (fino a 3)</p>${yp.length?yp.map(q=>pvPetRow(q,`<button onclick="pvTrRem('${esc(q.id)}')">−</button>`)).join(''):'<p class="mu">Nessuno</p>'}</div><div><p class="mu">Quelli di ${esc(T.n)}</p>${tp.length?tp.map(q=>pvPetRow(q)).join(''):'<p class="mu">Nessuno</p>'}</div></div>`;
  const av=(P.pets||[]).filter(p=>!T.mine.pe.includes(p.id));if(domOn()&&av.length)s+=`<details class="pvtr"><summary>Offri un compagno (${av.length} nella stalla)</summary>${av.map(p=>pvPetRow(p,`<button onclick="pvTrAdd('${esc(p.id)}')" ${T.mine.pe.length>=3?'disabled':''}>+ Offri</button>`)).join('')}</details>`;
  const i=h.indexOf('<button onclick="trOk()"');return i<0?h+s:h.slice(0,i)+s+h.slice(i)}}
trSend=function(){const T=NET.tr;if(!T)return;const pe=(Array.isArray(T.mine.pe)?T.mine.pe:[]).map(pvTrPet).filter(Boolean).slice(0,3).map(pvPackPet);
  NET.send({t:'tr',a:'off',it:T.mine.it.map(trFind).filter(Boolean),g:T.mine.g,pt:Math.min(T.mine.pt|0,P.pot),pe})};
function pvTrAdd(id){const T=NET.tr;if(!T)return;T.mine.pe=Array.isArray(T.mine.pe)?T.mine.pe:[];if(T.mine.pe.length>=3||T.mine.pe.includes(id)||!pvTrPet(id))return;T.mine.pe.push(id);trSend()}
function pvTrRem(id){const T=NET.tr;if(!T)return;T.mine.pe=(T.mine.pe||[]).filter(x=>x!==id);trSend()}
{const o0=trOk;trOk=function(){const T=NET.tr;if(T&&(T.mine.pe||[]).some(id=>!pvTrPet(id))){msg('La tua offerta non è più valida: un compagno non c\'è più');return}o0()}}
{const d0=trDone;trDone=function(m){try{pvTrDone(m)}catch(e){console.warn('scambio compagni',e)}d0(m)}}
function pvTrDone(m){const give=m.give||{},get=m.get||{},gp=Array.isArray(give.pe)?give.pe:[],rp=Array.isArray(get.pe)?get.pe:[];if(!gp.length&&!rp.length)return;domFix();
  for(const q of gp){const i=P.pets.findIndex(p=>p.id===q.id);if(i<0)continue;if(DOM.pet&&DOM.pet.p===P.pets[i])domDismiss(1);P.pets.splice(i,1);if(P.pet===i)P.pet=null;else if(P.pet!=null&&P.pet>i)P.pet--}
  let n=0;for(const q of rp){if(!q||!q.t)continue;let tk=String(q.t);if(tk.startsWith('x47.')&&q.xd&&typeof q.xd==='object'){P.x47=P.x47||{};for(const id in q.xd)if(!P.x47[id])P.x47[id]=q.xd[id];x47Reg()}
    if(!pvType(tk))continue;const p={id:uid(),t:tk,n:String(q.n||'Compagno').replace(/[<>]/g,'').slice(0,22),lv:clamp(q.lv|0,1,40),xp:Math.max(0,q.xp|0),hp:0,bd:typeof gDay==='function'?gDay():0};
    if(pvOk(q.vr)){p.vr=q.vr;p.vh=clamp(q.vh|0,0,359)}p.hp=domStats(p).mx;P.pets.push(p);P.bst[tk]=(P.bst[tk]|0)+1;n++}
  if(n)setTimeout(()=>{msg('Hai ricevuto '+n+(n>1?' compagni':' compagno')+' (tasto N)'+(P.pets.length>domMax()?': la stalla è oltre il limite, libera un posto':''));if(cineOK())sparks(P.px,P.py,20,['#7aff8a','#ffffff'],90)},1600);save()}
// ---- il profilo di un eroe: anche i suoi compagni ----
{const m0=myProf;myProf=function(){const o=m0();try{if(Array.isArray(P.pets)&&P.pets.length)o.cp=P.pets.slice(0,16).map((p,i)=>[pvLabel(p).slice(0,40),p.lv|0,pvOk(p.vr)?p.vr:'',i===P.pet?1:0])}catch(e){}return o}}
{const h0=profHTML;profHTML=function(e){let h=h0(e);const L=e&&e.prof&&Array.isArray(e.prof.cp)?e.prof.cp.slice(0,16):[];if(!L.length)return h;
  return h+`<h4>🐾 I suoi compagni · ${L.length}</h4><div class="pvpl">${L.map(q=>Array.isArray(q)?`<span>${q[3]?'⭐ ':''}<b>${esc(String(q[0]).slice(0,40))}</b> <small>liv. ${clamp(q[1]|0,1,40)}</small> ${pvTag(q[2])}</span>`:'').join('')}</div>`}}
(function(){const st=document.createElement('style');st.textContent=`
.pvb{align-self:flex-start;display:inline-block;margin:0 0 0 6px;padding:0 6px;border-radius:9px;font-size:11px;line-height:17px;font-weight:bold;color:#14100a;background:var(--c);vertical-align:middle}
.pvren{display:flex;gap:4px;align-items:center}.pvren input{flex:1;min-width:0;padding:3px 6px;font:inherit;background:#0b1022;color:#fff;border:1px solid #7aff8a;border-radius:4px}.pvren button{padding:2px 8px}
.pvinc{margin:6px 0;padding:6px 8px;border:1px solid #ffffff22;border-radius:8px;background:#ffffff08}.pvinc summary{cursor:pointer}
.pvl{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px;margin:6px 0}.pvl span{padding:5px 7px;border-left:3px solid var(--c);background:#0003;border-radius:4px}.pvl b{display:block}.pvl small{opacity:.8;font-size:11px}
.pvtr{margin:4px 0 8px}.pvtr summary{cursor:pointer;margin-bottom:4px}
.pvpl{display:flex;flex-direction:column;gap:3px}.pvpl span{padding:3px 6px;background:#ffffff0a;border-radius:4px}`;document.head.appendChild(st)})();
