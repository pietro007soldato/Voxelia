/* ================= 7.47: i mestieri — cucina, alchimia e fabbro (7.49: rifatti) =================
   La Bottega dei mestieri (in piazza ad Aldoria, nelle Cucine del castello e nelle città di Tomorrow) ha tre postazioni:
   - 🍲 il Fornello: si cucinano i PASTI. Un pasto alla volta, dura dieci minuti e si vede in alto a sinistra: vita massima,
     attacco, difesa, rigenerazione, più esperienza o più oro. Mangiarne un altro lo sostituisce;
   - ⚗ l'Alambicco: pozioni, Sigilli di doma, la Pietra del ritorno e gli ELISIR (anche loro uno alla volta: aria doppia
     sott'acqua, fortuna, esperienza);
   - ⚒ l'Incudine: FORGIA armi, elmi, corazze e scudi con il tuo nome, TEMPRA quello che indossi (fino a tre volte, +7% ogni
     volta) e FONDE gli oggetti che non ti servono, per riavere ferro, carbone, rame e gemme.
   Il Ricettario mostra tutte le ricette, con gli ingredienti, dove si trovano e quanti ne hai: ogni livello del mestiere
   (fino al 10) ne sblocca di nuove. Tre ricette segrete si trovano solo sperimentando con due ingredienti a caso.
   Al banco del Mercato si comprano gli ingredienti di base, così ogni mestiere si può usare anche senza raccogliere tutto. */
XSV.add('mest');
// una casella libera vicino al punto c, lontana dalle altre cose (serve a tutte le novità della 7.47)
function spot47(c,gap){const fr=(x,y)=>x>1&&y>1&&x<N-2&&y<N-2&&(M[y][x]===0||M[y][x]===4)&&!(DEC[y][x]&&DEC[y][x][0]!=='₪')&&!ents.some(e=>e.k!=='tc'&&Math.abs(e.px-x-.5)<(gap||1.6)&&Math.abs(e.py-y-.5)<(gap||1.6));
  for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=(c[0]|0)+dx,y=(c[1]|0)+dy;if(fr(x,y))return[x,y]}return null}
const MSTN47={c:{i:'🍲',n:'Fornello',m:'Cucina'},a:{i:'⚗',n:'Alambicco',m:'Alchimia'},f:{i:'⚒',n:'Incudine',m:'Fabbro'}};
// dove si trovano gli ingredienti
const MSTW={grano:'Campi di Aldoria (est), o al Mercato del banco',uova:'le galline dei Campi, o al Mercato',mela:'Campi e Foresta, o al Mercato',rosa:'il Roseto del Quartiere Nobile, o al Mercato',
  lunare:'il cerchio di pietre nella Foresta',scarab:'il Deserto di Khem',ghiaccio:'i Picchi Gelidi',conchiglia:'la spiaggia del Porto',legna:'gli alberi, ovunque',
  ferro:'fondendo gli oggetti all\'Incudine, la meteora degli eventi, o al Mercato',carbone:'fondendo gli oggetti, le miniere, o al Mercato',rame:'fondendo oggetti rari, le miniere, o al Mercato',
  pietra:'le cave e le miniere di Tomorrow',marmo:'le miniere di Tomorrow',pepita:'scavando nei punti che luccicano, le miniere',gemma:'fondendo oggetti epici, scavando, le miniere',
  sardina:'la pesca al Porto',polpo:'la pesca al Porto',orata:'la pesca al Porto',sgombro:'la pesca al Porto'};
// le ricette: lv = livello del mestiere che la sblocca; sec = segreta (solo sperimentando); n = quanti ne servono
const MSRC47=[
  {id:'pane',m:'c',lv:1,a:'r:grano',b:'r:uova',na:1,nb:1,n:'Pane dolce',fx:'vita',d:'Vita massima +15% e cura subito il 30%'},
  {id:'torta',m:'c',lv:1,a:'r:grano',b:'r:mela',na:1,nb:1,n:'Torta di mele',fx:'forza',d:'Attacco +25%'},
  {id:'zuppa',m:'c',lv:2,a:'r:grano',b:'f:sardina',na:1,nb:1,n:'Zuppa del pescatore',fx:'rigenera',d:'Rigenera l\'1,5% della vita al secondo'},
  {id:'frittata',m:'c',lv:3,a:'r:uova',b:'f:polpo',na:2,nb:1,n:'Frittata di mare',fx:'difesa',d:'Difesa +25%'},
  {id:'orata',m:'c',lv:4,a:'r:mela',b:'f:orata',na:1,nb:1,n:'Orata alle mele',fx:'xp',d:'Esperienza +25%'},
  {id:'banchetto',m:'c',lv:6,a:'r:uova',b:'r:mela',na:2,nb:2,n:'Banchetto del cavaliere',fx:'tutto',d:'Attacco e difesa +25%, vita massima +10%'},
  {id:'sidro',m:'c',lv:1,a:'r:lunare',b:'r:mela',na:1,nb:1,n:'Sidro di luna',fx:'oro',d:'Oro dai nemici +30%',sec:1},
  {id:'pozrosa',m:'a',lv:1,a:'r:rosa',b:'r:mela',na:1,nb:1,n:'Pozioni di rosa',fx:'pozioni',v:3,d:'Tre pozioni curative'},
  {id:'sigillo',m:'a',lv:2,a:'r:lunare',b:'r:rosa',na:1,nb:1,n:'Sigilli di doma',fx:'sigilli',v:2,d:'Due Sigilli per domare i mostri'},
  {id:'respiro',m:'a',lv:3,a:'r:conchiglia',b:'r:rosa',na:2,nb:1,n:'Respiro del mare',fx:'aria',d:'Elisir: il doppio dell\'aria sott\'acqua'},
  {id:'ritorno',m:'a',lv:4,a:'r:ghiaccio',b:'r:lunare',na:1,nb:1,n:'Pietra del ritorno',fx:'ritorno',d:'Ti riporta subito ad Aldoria (o alla tua città)'},
  {id:'fortuna',m:'a',lv:5,a:'r:scarab',b:'r:rosa',na:2,nb:1,n:'Elisir della fortuna',fx:'oro',d:'Elisir: oro dai nemici +30%'},
  {id:'saggio',m:'a',lv:7,a:'r:gemma',b:'r:lunare',na:1,nb:2,n:'Essenza del saggio',fx:'xp2',d:'Elisir: esperienza +50%'},
  {id:'arcobaleno',m:'a',lv:1,a:'r:conchiglia',b:'r:scarab',na:1,nb:1,n:'Pozione dell\'arcobaleno',fx:'pozioni',v:6,d:'Sei pozioni in un colpo solo',sec:1},
  {id:'lama',m:'f',lv:1,a:'r:ferro',b:'r:carbone',na:3,nb:2,n:'Forgia un\'arma',s:'w',d:'Un\'arma con il tuo nome'},
  {id:'scudo',m:'f',lv:2,a:'r:ferro',b:'r:legna',na:3,nb:2,n:'Forgia uno scudo',s:'s',d:'Uno scudo con il tuo nome'},
  {id:'elmo',m:'f',lv:3,a:'r:ferro',b:'r:rame',na:2,nb:2,n:'Forgia un elmo',s:'h',d:'Un elmo con il tuo nome'},
  {id:'corazza',m:'f',lv:4,a:'r:ferro',b:'r:rame',na:4,nb:2,n:'Forgia una corazza',s:'c',d:'Una corazza con il tuo nome'},
  {id:'capo',m:'f',lv:8,a:'r:gemma',b:'r:ferro',na:1,nb:4,n:'Capolavoro',s:null,d:'Un oggetto epico, di qualunque tipo'},
  {id:'drago',m:'f',lv:1,a:'r:gemma',b:'r:carbone',na:2,nb:3,n:'Lama del drago',s:'w',d:'Un\'arma epica con il fuoco dentro',sec:1}];
const MST47={tab:'c',sel:[],ft:'forgia'};
function mstFix(){P.mest=P.mest||{};const m=P.mest;m.k=m.k||{};m.xp=m.xp||{};m.cib=m.cib||{};m.fx=m.fx||{};return m}
const mstLv=c=>Math.min(10,1+Math.floor(Math.sqrt((mstFix().xp[c]|0)/12)));
const mstKnown=r=>r.sec?!!mstFix().k[r.id]:mstLv(r.m)>=r.lv||!!mstFix().k[r.id];
const ingN=k=>{const[t,id]=k.split(':');if(t==='r')return RESN[id]||id;const f=(typeof FISHT!=='undefined'?FISHT:[]).find(q=>q.id===id);return f?f.n:id};
const ingHas=k=>{const[t,id]=k.split(':');return t==='r'?(P.res&&P.res[id])|0:(P.fish&&P.fish[id])|0};
function ingTake(k,n){const[t,id]=k.split(':'),o=t==='r'?P.res:P.fish;if(!o)return;o[id]=Math.max(0,(o[id]|0)-n)}
const ingW=k=>MSTW[k.split(':')[1]]||'';
const MST_MET=['ferro','carbone','rame','pietra','marmo','pepita','gemma','argilla'];
function ingList(m){const L=[];if(P.res)for(const k in P.res)if((P.res[k]|0)>0){const met=MST_MET.includes(k);if(m==='f'?met||k==='legna':m==='a'?!met||k==='gemma':!met)L.push('r:'+k)}
  if(m!=='f'&&P.fish)for(const k in P.fish)if((P.fish[k]|0)>0)L.push('f:'+k);return L}
const mstNeed=r=>[r.na||1,r.nb||1];
const mstFind=(m,a,b)=>MSRC47.find(r=>r.m===m&&(r.a===a&&r.b===b||r.a===b&&r.b===a));
function mstGainXP(c,n){const m=mstFix(),l0=mstLv(c);m.xp[c]=(m.xp[c]|0)+n;const l1=mstLv(c);if(l1>l0){const nw=MSRC47.filter(r=>r.m===c&&!r.sec&&r.lv===l1);banner(MSTN47[c].i+' '+MSTN47[c].m+': livello '+l1,nw.length?'Nuova ricetta: '+nw.map(r=>r.n).join(', '):'Le tue creazioni migliorano','stella');jingle([60,64,67,72],.09,'triangle')}}
// sperimentare: due ingredienti scelti a mano (è così che si trovano le ricette segrete, e si sbloccano prima quelle normali)
function mstTry(){const m=mstFix(),[a,b]=MST47.sel,c=MST47.tab;if(!a||!b){msg('Scegli due ingredienti');return}if(a===b&&ingHas(a)<2){msg('Ne serve un altro');return}
  const r=mstFind(c,a,b);if(!r){ingTake(a,1);ingTake(b,1);mstGainXP(c,2);msg('Non è venuto niente di buono… ma hai imparato qualcosa');tone(160,.15,'sawtooth',.04);MST47.sel=[];save();pn('mest47');return}
  if(!m.k[r.id]){m.k[r.id]=1;mstGainXP(c,25);banner((r.sec?'Ricetta segreta: ':'Ricetta scoperta: ')+r.n,r.d,'libro')}mstMake(r);MST47.sel=[];save();pn('mest47')}
// preparare una ricetta: toglie gli ingredienti e dà il risultato
function mstMake(r){if(typeof r==='string')r=MSRC47.find(q=>q.id===r);if(!r)return false;const m=mstFix(),[na,nb]=mstNeed(r),lv=mstLv(r.m);
  if(ingHas(r.a)<na||ingHas(r.b)<nb){msg('Servono '+na+' '+ingN(r.a)+' e '+nb+' '+ingN(r.b));tone(150,.1);return false}
  if(r.m==='f'&&P.inv.length>=INV){msg('Lo zaino è pieno');return false}
  ingTake(r.a,na);ingTake(r.b,nb);
  if(r.m==='f'){const nm=String((typeof NET!=='undefined'&&NET.name)||'Eroe').slice(0,16),L2=P.lv+1+Math.floor(lv/3),mr=r.id==='capo'||r.id==='drago'?3:lv>=6&&Math.random()<.25+lv*.03?3:lv>=3?2:1;
    const it=item(L2,mr,r.s||undefined);it.n=(r.id==='drago'?'Lama del drago':it.n)+' di '+nm;it.mk=nm;if(r.id==='drago')it.cr=(it.cr||0)+10;P.inv.push(it);MST47.last=it;msg('Hai forgiato: '+iname(it));
    tone(220,.08,'square',.06);setTimeout(()=>tone(260,.08,'square',.06),140);if(cineOK())sparks(P.px,P.py,18,['#ffb04a','#ffe08a','#ffffff'],80)}
  else if(r.fx==='pozioni'){const n=r.v+(lv>=5?1:0);P.pot+=n;msg('+'+n+' pozioni')}
  else if(r.fx==='sigilli'){const n=r.v+(lv>=6?1:0);P.seal=(P.seal|0)+n;msg('+'+n+' Sigilli di doma')}
  else{const n=r.m==='c'&&lv>=4?2:1;m.cib[r.id]=(m.cib[r.id]|0)+n;msg('Pronto: '+r.n+(n>1?' ×'+n:'')+' (nella Dispensa)')}
  mstGainXP(r.m,r.m==='f'?14:8);tone(700,.07,'triangle');hud();save();return true}
// mangiare e bere: un pasto alla volta (Fornello) e un elisir alla volta (Alambicco), dieci minuti ciascuno
const MSTD=600;
function mstEat(id){const m=mstFix(),r=MSRC47.find(q=>q.id===id);if(!r||!(m.cib[id]>0))return;const now=Date.now(),lv=mstLv(r.m),dur=MSTD*(1+.05*(lv-1));
  if(r.fx==='ritorno'){m.cib[id]--;if(!m.cib[id])delete m.cib[id];const to=typeof twOn==='function'&&twOn()&&P.tw&&P.tw.set?P.tw.set.k:'town';cl();msg('La Pietra del ritorno brilla…');irisGo(()=>load(to,Zk));save();return}
  m.cib[id]--;if(!m.cib[id])delete m.cib[id];const slot=r.m==='c'?'meal':'eli';if(slot==='meal')mstBuffEnd(m.fx.meal);m.fx[slot]={id,u:now+dur*1000,t:now,a0:Math.max(0,P.bA||0),d0:Math.max(0,P.bD||0)};
  if(r.fx==='vita'){recalc();P.hp=Math.min(P.mx,P.hp+Math.round(P.mx*.3));flt(P,'❤','#66ff88')}else if(r.fx==='forza'||r.fx==='tutto'){P.bA=Math.max(P.bA||0,dur);if(r.fx==='tutto'){P.bD=Math.max(P.bD||0,dur);recalc()}flt(P,'💪','#ffd84a')}
  else if(r.fx==='difesa'){P.bD=Math.max(P.bD||0,dur);flt(P,'🛡','#cccccc')}else flt(P,r.m==='c'?'🍲':'⚗','#ffe08a');
  msg((r.m==='c'?'Hai mangiato: ':'Hai bevuto: ')+r.n+' · '+r.d);tone(520,.08,'sine',.05);hud();save();if(PM==='mest47')pn('mest47')}
// la forza e la difesa di un pasto usano i timer P.bA e P.bD: quando il pasto finisce o viene sostituito da un altro, si torna a quello
// che restava degli altri effetti (gli elisir del Mercante, il tempio…), senza che il pasto vecchio continui a valere
function mstBuffEnd(f){if(!f||f.e||!P)return;f.e=1;const r=MSRC47.find(q=>q.id===f.id);if(!r)return;const el=Math.max(0,(Date.now()-(f.t||0))/1000);
  if(r.fx==='forza'||r.fx==='tutto')P.bA=Math.min(P.bA||0,Math.max(0,(f.a0||0)-el));if(r.fx==='difesa'||r.fx==='tutto')P.bD=Math.min(P.bD||0,Math.max(0,(f.d0||0)-el))}
const mstAct=(slot,fx)=>{const f=P&&P.mest&&P.mest.fx&&P.mest.fx[slot];if(!f||f.u<Date.now())return false;const r=MSRC47.find(q=>q.id===f.id);return r&&(!fx||fx.includes(r.fx))?r:false};
const mstHas=fx=>!!(mstAct('meal',fx)||mstAct('eli',fx));
const _gainXP747=gainXP;gainXP=function(x){if(P&&x>0){if(mstHas(['xp2']))x=Math.round(x*1.5);else if(mstHas(['xp']))x=Math.round(x*1.25)}return _gainXP747(x)};
{const rc0=recalc;recalc=function(){rc0();if(!P||!P.mest)return;const k=mstHas(['vita'])?1.15:mstHas(['tutto'])?1.1:1;if(k>1){P.mx=Math.round(P.mx*k);P.hp=Math.min(P.hp,P.mx)}}}
const _kill749m=kill;kill=function(e){const g0=P?P.g:0,on=e&&e.k==='en'&&ents.includes(e)&&mstHas(['oro']);_kill749m(e);if(on&&P.g>g0)P.g+=Math.round((P.g-g0)*.3)};
let MSTV=0;
const _upd747m=upd;upd=function(dt){_upd747m(dt);if(!P||!started||!P.mest)return;const now=Date.now();
  if(mstHas(['rigenera'])&&P.hp>0&&P.hp<P.mx)P.hp=Math.min(P.mx,P.hp+P.mx*.015*dt);
  if(typeof SUB46!=='undefined'){const mx=mstHas(['aria'])?60:30;if(SUB46.mx!==mx){SUB46.mx=mx;SUB46.o=Math.min(SUB46.o,mx)}}
  // il cartellino in alto a sinistra con il pasto e l'elisir
  MSTV-=dt;if(MSTV>0)return;MSTV=.5;{const f=P.mest.fx&&P.mest.fx.meal;if(f&&!f.e&&f.u<now)mstBuffEnd(f)}let el=$('mst49');const A=[['meal',mstAct('meal')],['eli',mstAct('eli')]].filter(q=>q[1]);
  if(!A.length){if(el)el.hidden=true;if(P.mest.vv){P.mest.vv=0;recalc()}return}if(!el){el=document.createElement('div');el.id='mst49';el.onclick=()=>{MST47.tab='d';pn('mest47')};document.body.appendChild(el)}el.hidden=false;
  const vv=mstHas(['vita','tutto'])?1:0;if(vv!==(P.mest.vv|0)){P.mest.vv=vv;recalc()}
  el.innerHTML=A.map(([s,r])=>{const q=Math.max(0,Math.round((P.mest.fx[s].u-now)/1000));return`<span>${s==='meal'?'🍲':'⚗'} ${esc(r.n)} · ${Math.floor(q/60)}:${String(q%60).padStart(2,'0')}</span>`}).join('')};
// l'incudine: temprare quello che indossi e fondere quello che non ti serve
const MSTP={w:'Arma',h:'Elmo',c:'Corazza',s:'Scudo'};
const tmpCost=it=>{const n=(it.tp|0)+1;return{ferro:1+n,carbone:n,rame:n>=3?1:0}};
function mstTemper(s){const it=P.eq[s];if(!it)return;if((it.tp|0)>=3){msg('Più di così non si tempra');return}const c=tmpCost(it);for(const k in c)if((P.res[k]|0)<c[k]){msg('Servono '+Object.keys(c).filter(k=>c[k]).map(k=>c[k]+' '+RESN[k]).join(', '));tone(150,.1);return}
  for(const k in c)P.res[k]-=c[k];it.tp=(it.tp|0)+1;it.v=Math.round(it.v*1.07);it.p=Math.round((it.p||50)*1.1);mstGainXP('f',10);recalc();msg(iname(it)+' temprato ('+it.tp+'/3): +7%');
  tone(260,.08,'square',.06);setTimeout(()=>tone(320,.1,'square',.06),130);if(typeof sceneForge==='function'&&cineOK())sceneForge();hud();save();pn('mest47')}
const fndGive=it=>{const r=it.r|0;return{ferro:1+r,carbone:1,rame:r>=2?1:0,gemma:r>=3?1:0}};
function mstSmelt(u){const i=P.inv.findIndex(q=>q.u===u);if(i<0)return;const it=P.inv[i];if(it.ar){msg('Questo oggetto è vincolato: non si può fondere');return}const g2=fndGive(it);P.inv.splice(i,1);const L=[];for(const k in g2)if(g2[k]){P.res[k]=(P.res[k]|0)+g2[k];L.push(g2[k]+' '+RESN[k])}
  mstGainXP('f',4);msg('Fuso: '+iname(it)+' → '+L.join(', '));tone(180,.15,'sawtooth',.04);if(cineOK())sparks(P.px,P.py,10,['#ff7a2a','#ffd84a'],60);hud();save();pn('mest47')}
// il Mercato del banco: gli ingredienti di base
const MSTM=[['grano',6],['uova',8],['mela',6],['rosa',10],['ferro',25],['carbone',14],['rame',30],['legna',5]];
function mstBuy(k,n){const b=(MSTM.find(q=>q[0]===k)||[k,10])[1],c=px('mst_'+k,b)*n;if(P.g<c){msg('Servono '+c+' monete');tone(150,.1);return}P.g-=c;P.res[k]=(P.res[k]|0)+n;tone(700,.06,'triangle');hud();save();pn('mest47')}
// il pannello
const ingRow=(k,n)=>{const h=ingHas(k),ok=h>=n;return`<span class="mst49i ${ok?'ok':'no'}" title="${esc(ingN(k))}: ${esc(ingW(k))}">${n} ${esc(ingN(k))} <small>(${h})</small></span>`};
X43P.mest47=()=>{const m=mstFix(),c=MST47.tab;let h=`<h3>🧑‍🍳 Bottega dei mestieri · 💰${P.g}</h3><div class="srow">${Object.keys(MSTN47).map(k=>`<button class="${k===c?'on':''}" onclick="MST47.tab='${k}';MST47.sel=[];pn('mest47')">${MSTN47[k].i} ${MSTN47[k].n} · liv. ${mstLv(k)}</button>`).join('')}<button class="${c==='d'?'on':''}" onclick="MST47.tab='d';pn('mest47')">🧺 Dispensa</button><button class="${c==='m'?'on':''}" onclick="MST47.tab='m';pn('mest47')">🛒 Mercato</button></div>`;
  if(c==='m')return h+`<p class="x43t">Gli ingredienti di base, per cucinare e forgiare anche senza andarli a raccogliere.</p>${MSTM.map(([k,b])=>`<div class="x43r"><span>${esc(RESN[k]||k)} <small class="mu">ne hai ${P.res[k]|0}</small></span><span><button onclick="mstBuy('${k}',1)">1 · ${px('mst_'+k,b)} 💰</button><button onclick="mstBuy('${k}',5)">5 · ${px('mst_'+k,b)*5} 💰</button></span></div>`).join('')}<button onclick="cl()">Chiudi</button>`;
  if(c==='d'){const L=Object.keys(m.cib).filter(k=>m.cib[k]>0),A=[['meal',mstAct('meal')],['eli',mstAct('eli')]].filter(q=>q[1]);
    h+=`<p class="x43t">${A.length?'Adesso: '+A.map(([s,r])=>(s==='meal'?'🍲 ':'⚗ ')+esc(r.n)+' — '+esc(r.d)).join(' · '):'Nessun pasto e nessun elisir attivo. Un pasto e un elisir alla volta, dieci minuti ciascuno.'}</p>`;
    h+=L.length?L.map(id=>{const r=MSRC47.find(q=>q.id===id);return r?`<div class="x43r"><span>${MSTN47[r.m].i} <b>${esc(r.n)}</b> ×${m.cib[id]} <small class="mu">${esc(r.d)}</small></span><button onclick="mstEat('${id}')">${r.fx==='ritorno'?'Usa':r.m==='a'?'Bevi':'Mangia'}</button></div>`:''}).join(''):'<p class="mu">La dispensa è vuota: cucina qualcosa al Fornello.</p>';
    return h+`<button onclick="cl()">Chiudi</button>`}
  const R2=MSRC47.filter(r=>r.m===c),lv=mstLv(c),xp=m.xp[c]|0,nx=Math.pow(lv,2)*12;
  h+=`<p class="x43t">${MSTN47[c].i} <b>${MSTN47[c].m}</b>, livello ${lv}${lv<10?' · '+xp+'/'+nx+' punti per il prossimo':' · maestro'} · ${c==='c'?'un pasto dura dieci minuti':c==='a'?'pozioni, sigilli e un elisir alla volta':'armi e armature con il tuo nome'}</p>`;
  if(c==='f')h+=`<div class="srow">${[['forgia','🔨 Forgia'],['tempra','✨ Tempra'],['fondi','🔥 Fondi']].map(([k,n])=>`<button class="${MST47.ft===k?'on':''}" onclick="MST47.ft='${k}';pn('mest47')">${n}</button>`).join('')}</div>`;
  if(c==='f'&&MST47.ft==='tempra'){h+=`<p class="x43t">Tempra quello che indossi: +7% ogni volta, fino a tre. Costa ferro e carbone (e rame per la terza).</p>`+'whcs'.split('').map(s=>{const it=P.eq[s];if(!it)return'';const co=tmpCost(it),txt=Object.keys(co).filter(k=>co[k]).map(k=>ingRow('r:'+k,co[k])).join(' ');
      return`<div class="x43r"><span>${MSTP[s]}: ${fmt(it)} <small class="mu">tempra ${it.tp|0}/3</small><br>${(it.tp|0)<3?txt:''}</span>${(it.tp|0)<3?`<button onclick="mstTemper('${s}')">Tempra</button>`:'<i class="mu">al massimo</i>'}</div>`}).join('');return h+`<button onclick="cl()">Chiudi</button>`}
  if(c==='f'&&MST47.ft==='fondi'){const L=P.inv.filter(it=>it&&it.s&&!it.ar);h+=`<p class="x43t">Fondi gli oggetti che non ti servono: ferro e carbone, rame dagli oggetti rari, una gemma da quelli epici.</p>`+(L.length?L.map(it=>{const g2=fndGive(it);return`<div class="x43r"><span>${fmt(it)}<br><small class="mu">→ ${Object.keys(g2).filter(k=>g2[k]).map(k=>g2[k]+' '+RESN[k]).join(', ')}</small></span><button onclick="mstSmelt('${it.u}')">Fondi</button></div>`}).join(''):'<p class="mu">Nello zaino non hai oggetti da fondere.</p>');return h+`<button onclick="cl()">Chiudi</button>`}
  h+=`<h4>📖 Ricettario</h4>`+R2.map(r=>{const kn=mstKnown(r),[na,nb]=mstNeed(r);if(!kn)return r.sec?'':`<div class="x43r mst49l"><span>🔒 <b>${esc(r.n)}</b> <small class="mu">al livello ${r.lv} · ${esc(r.d)}</small></span></div>`;
    const ok=ingHas(r.a)>=na&&ingHas(r.b)>=nb;return`<div class="x43r"><span><b>${r.sec?'✨ ':''}${esc(r.n)}</b> <small class="mu">${esc(r.d)}</small><br>${ingRow(r.a,na)} ${ingRow(r.b,nb)}</span><button ${ok?'':'disabled'} onclick="mstMake('${r.id}');pn('mest47')">${c==='f'?'Forgia':'Prepara'}</button></div>`}).join('');
  const sk=R2.filter(r=>r.sec),sf=sk.filter(r=>m.k[r.id]).length;
  const I=ingList(c);h+=`<h4>🧪 Sperimenta <small class="mu">· ricette segrete trovate: ${sf}/${sk.length}</small></h4><p class="x43t">Scegli due ingredienti a caso: forse esiste una ricetta che nessuno conosce. Se non esiste, gli ingredienti vanno persi.</p>`;
  h+=`<div class="srow mst47">${I.length?I.map(k=>`<button class="${MST47.sel.includes(k)?'on':''}" onclick="mstPick('${k}')">${esc(ingN(k))} ×${ingHas(k)}</button>`).join(''):'<span class="mu">Non hai ingredienti adatti.</span>'}</div><button ${MST47.sel.length===2?'':'disabled'} onclick="mstTry()">✨ Prova ${MST47.sel.map(k=>esc(ingN(k))).join(' + ')}</button>`;
  return h+`<button onclick="cl()">Chiudi</button>`};
function mstPick(k){const i=MST47.sel.indexOf(k);if(i>=0)MST47.sel.splice(i,1);else{if(MST47.sel.length>=2)MST47.sel.shift();MST47.sel.push(k)}pn('mest47')}
// la bottega: in piazza ad Aldoria, nelle cucine del castello, nelle città di Tomorrow
function mstPlace(){if(!ZZ||!started||ents.some(e=>e.k==='mest47'))return;let c=null;
  if(Zk==='town'&&!(typeof OW!=='undefined'&&OW.on))c=[32,40];else if(Zk==='cas_cucine')c=[6,5];else if(typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub)c=[ZZ.shub[0]+4,ZZ.shub[1]+3];if(!c)return;
  const q=spot47(c,2.2);if(q)ents.push({k:'mest47',px:q[0]+.5,py:q[1]+.5,n:'Bottega dei mestieri'})}
const _loadPost747m=loadPost;loadPost=function(k){_loadPost747m(k);try{mstPlace()}catch(e){console.warn('mestieri',e)}};
ITK.add('mest47');
const _act747m=act;act=function(e){if(e&&e.k==='mest47'){MST47.sel=[];if(MST47.tab==='d'||MST47.tab==='m')MST47.tab='c';pn('mest47');return}_act747m(e)};
// il disegno: il fornello con la pentola che bolle, l'alambicco che gorgoglia e l'incudine con il martello
const _ent747m=ent;ent=function(e){if(e.k==='mest47'){const f=Math.sin(t*3),fl=.6+Math.sin(t*11)*.3;
  drawL(isoOrder([[-.95,-.35,0,1.9,.7,9,'#6a4a2a'],[-.98,-.38,9,1.96,.76,2,'#8a6a42'],[-.9,-.3,11,.5,.5,7,'#4a4a52'],[-.88,-.28,18,.46,.46,2,'#2a2a2a'],[-.8,-.2,20,.3,.3,6,'#3a3a42'],[-.12,-.2,11,.24,.24,8,'#c8b890'],[-.06,-.14,19,.12,.12,10,'#9adcff'],[.04,-.1,26,.22,.04,2,'#c8b890'],[.25,-.1,27,.04,.04,6,'#c8b890'],[.45,-.18,11,.36,.2,6,'#5a5a64'],[.4,-.22,17,.46,.28,3,'#7a7a84'],[.75,-.18,20,.05,.05,8,'#6a4a2a'],[.7,-.2,27,.16,.1,4,'#8a8a94'],[-.98,.32,0,.06,.06,30,'#6a4a2a'],[.92,.32,0,.06,.06,30,'#6a4a2a'],[-.98,.3,30,1.96,.1,3,'#a8303a']],0),e.px,e.py,0);
  box(e.px-.85,e.py-.25,11,.4,.05,3+fl*2,'#ff8a2a',1.6);box(e.px-.7,e.py-.12,26+f*2,.1,.1,3,'#e8f0f0',1.1);box(e.px-.6,e.py-.15,30+f*3,.08,.08,2.5,'#d8e8e8',1);
  box(e.px-.03,e.py-.11,22+Math.abs(f)*3,.06,.06,2,'#6affc0',1.5);if(Math.sin(t*5)>.95&&cineOK())sparks(e.px+.6,e.py-.05,3,['#ffd84a','#ff7a2a'],40);
  if(typeof nlight==='function')nlight(e.px-.5,e.py,16,80,'255,170,90',.5);return}_ent747m(e)};
// nel Diario
{const p0=pn;pn=function(m,arg){p0(m,arg);if(m==='dia'&&PM==='dia'){const pe=$('pn');if(pe&&!pe.querySelector('.mst47b'))pe.insertAdjacentHTML('afterbegin',`<button class="mst47b" onclick="MST47.tab='d';pn('mest47')">🧺 Dispensa e mestieri</button>`)}}}
(function(){const st=document.createElement('style');st.textContent=`.mst47 button{font-size:13px;padding:3px 8px}.mst47b{width:100%;margin-bottom:6px}.mst49i{display:inline-block;font-size:12px;border-radius:4px;padding:1px 6px;margin:2px 2px 0 0}.mst49i.ok{background:#3a8a3a33;border:1px solid #3a8a3a}.mst49i.no{background:#a8303a22;border:1px solid #a8303a88}.mst49l{opacity:.6}
#mst49{position:fixed;left:10px;top:116px;z-index:30;display:flex;flex-direction:column;gap:3px;cursor:pointer}#mst49 span{font:12px Georgia,serif;color:#fff4d0;background:rgba(40,24,6,.8);border:1px solid #ffd84a88;border-radius:10px;padding:2px 9px}#mst49[hidden]{display:none}body:not(.ig) #mst49{display:none}`;document.head.appendChild(st)})();
