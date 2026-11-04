/* 7.53: tolto da 8_main.js, stesso ordine di prima: avvio, salvataggi e menu, input, ciclo principale, cursore */
/* ================= avvio, salvataggi, menu ================= */
function contHTML(){const s=LS.get(SAVEK,null);$('cont').innerHTML=s&&s.p?`<button class="mbtn cont" onclick="contGame()">${ico('gioca',24)}<span><b>Continua: ${esc(s.name)}</b><small>Livello ${s.p.lv|0} · ${DFS[s.df]?DFS[s.df].n:''} · frammenti ${(s.p.sh||[]).length}/6 · salvato ${esc(new Date(s.t).toLocaleString('it-IT'))}</small></span></button>`:'';menuPort();
  if(s){if(!$('nm').value)$('nm').value=s.name||'';if(!$('rc').value)$('rc').value=s.code||''}}
function newGame(d){if(!LS.get('voxelia_intro',0)){const s0=LS.get(SAVEK,null);if(!(s0&&s0.p)){LS.set('voxelia_intro',1);playIntro(()=>begin(d,null));return}}const s=LS.get(SAVEK,null);if(s&&s.p){ovrStory(s,()=>begin(d,null));return}begin(d,null)}
function contGame(){const s=LS.get(SAVEK,null);if(s&&s.p)begin(s.df|0,s)}
function begin(d,s){cineReset();MODE='story';DIM=null;PPJ=[];document.body.classList.remove('dimm');auInit();DF=DFS[d]||DFS[1];P=newP();gndLoad(s&&s.gnd);
  if(s){for(const k in s.p)if(s.p[k]!=null)P[k]=s.p[k];P.ap=apFix(P.ap||APM);for(const it of P.inv.concat(eqs()))if(!it.u)it.u=uid();if(!P.eq.w)P.eq.w={u:uid(),s:'w',r:0,v:3,n:'Pugnale',p:0}}
  NET.name=($('nm').value.trim()||(s&&s.name)||'Eroe').replace(/[<>]/g,'').slice(0,14);NET.code=$('rc').value.trim().toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16);
  NET.tm=null;lastDay=0;cineOff();SZ=1;NET.hits=[];NET.say=null;NET.ar=null;NET.lb=null;NET.runs={};NET.st=NET.code?(window.GAME_WS?'connessione…':'multigiocatore non disponibile: apri il gioco dal server (node server.js)'):'';
  P.unl=P.unl||{};P.bag=P.bag||0;P.skl=P.skl||{};INV=24+BAGS[P.bag].s;P.stash=P.stash||[];P.sold=P.sold||{};P.room=P.room||0;P.res=P.res||{};P.fish=P.fish||{};P.rod=P.rod||0;recalc();if(!s)P.hp=P.mx;$('menu').style.display='none';closeSet();document.body.classList.add('ig');inMenu=0;started=1;last=performance.now();
  netConnect();load(s&&P.te===1&&!P.key?'cella':'town');npcMarks();hudApply();wheelApply();
  if(!s&&welcomeTour()){}else if(!s){PA={ti:'Benvenuto ad Aldoria',tx:'Il Re Aldric ti attende nel castello a nord-ovest: segui il ! giallo sopra la sua testa.\n\nI personaggi con ! hanno missioni da darti e ti pagano in monete. Le porte della città portano alla Foresta (nord), al Deserto (est) e ai Picchi Gelidi (ovest). Il Colosseo, con l\'arena PvP e la classifica, è a nord-est. Dalle porte secondarie si va nei nuovi quartieri: il Quartiere Nobile (nord-ovest), i Campi (est), il Porto (sud) e il Borgo delle Ceneri (ovest, chiuso: chiedi al Moreau).\n\nI tasti utili: I zaino, J missioni, K diario, L classifica, P giocatori, O opzioni, WASD o frecce per muoverti, R per interagire, Q pozione, Spazio colpo ad area, Shift o E schivata, F affondo, Invio chat.'};pn('txt')}}
function toMenu(){save();hudEdit(0);cineOff();closeLook();started=0;netLeave();PM=0;$('pn').style.display='none';document.body.classList.remove('ig');$('menu').style.display='flex';inMenu=1;music('menu');contHTML();dimObj();mode('');wheelApply()}

/* ================= input ================= */
// Un clic su un altro eroe non apre nulla (si cammina o si colpisce ciò che c'è sotto): il profilo si apre con il doppio clic.
// Nella fossa dell'arena, invece, il clic singolo attacca come sempre.
let lastPl={id:null,t:0},plHint=0;
function nearAt(L,mx,my){let best=null,bd=1e9;for(const e of L){if(e.k==='tc'||e.k==='cho'||e.k==='resx'||e.k==='ship'||e.k==='dead'||e.k==='figura')continue;const r=e.boss?44:26,d=Math.hypot(PX(e.px,e.py)-mx,(PY(e.px,e.py,e.boss?30:16)-my)*.8);if(d<r&&d<bd){bd=d;best=e}}return best}
const toWorld=(cx,cy)=>[(cx-W/2)/S+camX,(cy-H/2)/S+camY];
cv.onpointerdown=ev=>{auInit();if(!started||PM==='trade'||PM==='treq')return;cl();const[mx,my]=toWorld(ev.clientX,ev.clientY),near=L=>nearAt(L,mx,my);
  const pl=near(NET.list),pvp=pl&&inPit(pl.px,pl.py)&&inPit(P.px,P.py);
  if(pl&&pvp){P.tg=pl;P.rp=0;return}
  if(pl){const now=performance.now();
    if(lastPl.id===pl.id&&now-lastPl.t<450){lastPl={id:null,t:0};P.path=[];P.tg=null;pl.prof=null;pl.par=null;NET.send({t:'prof',to:pl.id});pn('pl',pl);return}
    lastPl={id:pl.id,t:now};if(!plHint){plHint=1;msg('Doppio clic su un eroe per aprire il suo profilo')}}
  const best=near(ents);if(best){P.tg=best;P.rp=0;return}
  const gx=Math.floor((mx/32+my/16)/2),gy=Math.floor((my/16-mx/32)/2);P.tg=null;P.path=pathTo(gx,gy)};
cv.addEventListener('wheel',e=>{e.preventDefault();SZ=clamp(SZ*(1-e.deltaY*.001),.55,1.9)},{passive:false});
document.addEventListener('keydown',()=>auInit());
const MOVEK=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
onkeydown=e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();
  if(k==='escape'&&$('mappa')&&$('mappa').style.display==='flex'){closeMap();return}
  if(k==='escape'){if(HED)hudEdit(0);else if($('look').style.display==='block')closeLook();else if($('chg').style.display==='block')closeChg();else if($('set').style.display==='block')closeSet();else if(started)cl();return}
  if(HED)return;
  // 7.10: con la finestra dell'aspetto aperta il tasto C la chiude (come Esc); gli altri tasti restano fermi
  if($('look').style.display==='block'){if(k==='c'&&!e.repeat)closeLook();return}
  if(!started)return;
  if(SET.wasd&&MOVEK.includes(k)){KEYS[k]=1;e.preventDefault();return}
  if(k==='r'){if(IT){P.path=[];P.tg=null;act(IT)}return}
  if(k==='enter'){$('ch').focus();e.preventDefault();return}
  if(k==='m'){$('mappa')&&$('mappa').style.display==='flex'?closeMap():openMap();return}if(k===SET.rk){wheelToggle();return}
  if(k.length===1&&k>='1'&&k<='4'){useSkill(+k-1);return}
  if(k==='q')pot();else if(k==='shift'||k==='e')dodge();else if(k==='f')lunge();else if(k===' '){area();e.preventDefault()}else if(k==='i')tog('inv');else if(k==='j')tog('q');else if(k==='k')tog('dia');else if(k==='l')tog('lb');else if(k==='p')tog('who');else if(k==='c')openLook();else if(k==='o')$('set').style.display==='block'?closeSet():openSet()};
onkeyup=e=>{KEYS[e.key.toLowerCase()]=0};
addEventListener('blur',()=>{for(const q in KEYS)KEYS[q]=0});
onbeforeunload=()=>{if(started)save()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)save()});

/* ================= ciclo principale ================= */
/* ---- frequenza dei fotogrammi (7.4) ----
   Il gioco disegna sempre al ritmo dello schermo (requestAnimationFrame): il browser non può mostrare più immagini di quante
   lo schermo ne aggiorni. Fino alla 7.3 senza V-Sync il ciclo girava con un timer più veloce dello schermo: i fotogrammi in più
   non si vedevano, ma tenevano occupato il browser, che finiva per mostrarne meno (il gioco andava più lento, non più veloce).
   Con un limite FPS più basso della frequenza dello schermo si saltano i fotogrammi in più, a intervalli regolari. */
let FPL=0,HZ=0,HZL=0;const HZS=[];
function loop(n){requestAnimationFrame(loop);frame(n)}
// un fotogramma del gioco: lo chiama il ciclo dello schermo e, in realtà virtuale, quello del visore (8zf_xr.js)
function frame(n){
  if(HZL&&HZS.length<90){const d=n-HZL;if(d>2&&d<60)HZS.push(d);if(HZS.length===90)HZ=Math.round(1000/HZS.slice().sort((a,b)=>a-b)[45])}HZL=n;
  if(SET.fpsmax>0&&!(HZ&&SET.fpsmax>=HZ-1)){const iv=1000/SET.fpsmax;if(n-FPL<iv-1.5)return;FPL=n-FPL>2*iv?n:FPL+iv}else FPL=n;
  const dt=Math.max(0,Math.min(.05,(n-last)/1000||0));last=n;
  if(!started){if(INTRO)introDraw(dt);else if(CN)cineDraw(dt);else if(inMenu)drawMenu(dt);return}
  cineTick(dt);upd(dt*TS);if(!started)return;if(PM==='who'&&NET.ok&&(NET.wt=(NET.wt||0)+dt)>1){NET.wt=0;NET.send({t:'who'})}draw();mini();cdUI();curHover(dt);if((acc+=dt)>.2){acc=0;hud();pdCheck();clockUI()}
  if(SET.fps){fpsN++;fpsT+=dt;if(fpsT>=.5){$('fps').textContent=Math.round(fpsN/fpsT)+' FPS';fpsN=0;fpsT=0}}}
/* ================= cursore personalizzato: pixel art generata dal gioco ================= */
const CURC={oro:'#f5b942',argento:'#d8dde6',rubino:'#e8484f',smeraldo:'#4cd07a',zaffiro:'#4aa3ff',ametista:'#b866ff'};
const CURN=['Spada','Freccia','Guanto','Mirino','Cursore del sistema'];
// forme su una griglia 16×16: poligoni ['p',[[x,y]...]], tratti spessi ['s',x1,y1,x2,y2,spessore], cerchi ['c',x,y,r], anelli ['o',x,y,r,spessore]; l'ultimo valore è il colore
function curShape(k,col){const G='#e2b33a',B='#7a4a22',dk=col?shx(col,.55):'#333333';switch(k){
  case 0:return{hs:[1,1],f:[['s',1.6,1.6,9.6,9.6,1.15,col],['s',7.6,11.4,11.4,7.6,.95,G],['s',10.3,10.3,12.3,12.3,.75,B],['c',13,13,1.05,G]]};
  case 1:return{hs:[1,1],f:[['p',[[1,1],[1,12.6],[3.9,9.8],[6,13.9],[8,13],[5.9,9],[9.7,9]],col]]};
  case 2:return{hs:[5,1],f:[['p',[[4,2.2],[4.8,1.2],[6.2,1.2],[7,2.2],[7,8],[4,8]],col],['p',[[7,6],[12,6],[12.8,7],[12.8,12.4],[11.6,13.4],[4.6,13.4],[3.8,12.4],[3.8,8],[7,8]],col],['p',[[3.9,9.2],[2.4,7.4],[1.4,8.3],[2.8,11.6],[3.9,12.2]],col],['s',9,6.6,9,8.6,.3,dk],['s',10.8,6.6,10.8,8.6,.3,dk],['p',[[4.4,13.4],[12.2,13.4],[12.2,14.8],[4.4,14.8]],G]]};
  case 3:return{hs:[8,8],f:[['o',8,8,4.6,1.5,col],['s',8,1,8,3.6,.75,col],['s',8,12.4,8,15,.75,col],['s',1,8,3.6,8,.75,col],['s',12.4,8,15,8,.75,col],['c',8,8,.85,col]]};
  case 'talk':return{hs:[2,2],f:[['p',[[2,2.6],[2.6,2],[13.4,2],[14,2.6],[14,9.4],[13.4,10],[8,10],[4.6,13.4],[5,10],[2.6,10],[2,9.4]],'#f4f1e8'],['c',5.4,6,.85,'#3a3a42'],['c',8,6,.85,'#3a3a42'],['c',10.6,6,.85,'#3a3a42']]};
  case 'atk':return curShape(0,'#ff5a4a')}}
function shx(h,f){const n=parseInt(h.slice(1,7),16),m=v=>Math.max(0,Math.min(255,Math.round(v*f)));return'#'+((m(n>>16)<<16)|(m(n>>8&255)<<8)|m(n&255)).toString(16).padStart(6,'0')}
function curBake(sh,sc){return curBakeC(sh,sc).toDataURL()}
function curBakeC(sh,sc){const Nn=16,px=new Array(Nn*Nn).fill(null);
  const inP=(x,y,Q)=>{let c=false;for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,yi]=Q[i],[xj,yj]=Q[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
  const sD=(x,y,a,b,c,d)=>{const vx=c-a,vy=d-b,l=vx*vx+vy*vy||1,q=Math.max(0,Math.min(1,((x-a)*vx+(y-b)*vy)/l));return Math.hypot(x-(a+vx*q),y-(b+vy*q))};
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++){const X=x+.5,Y=y+.5;for(const f of sh.f){let on=false;
    if(f[0]==='p')on=inP(X,Y,f[1]);else if(f[0]==='s')on=sD(X,Y,f[1],f[2],f[3],f[4])<=f[5]+.2;else if(f[0]==='c')on=Math.hypot(X-f[1],Y-f[2])<=f[3]+.2;else if(f[0]==='o')on=Math.abs(Math.hypot(X-f[1],Y-f[2])-f[3])<=f[4]/2;
    if(on)px[y*Nn+x]=f[f.length-1]||null}}
  const at=(x,y)=>x<0||y<0||x>=Nn||y>=Nn?null:px[y*Nn+x],ol=(x,y)=>!at(x,y)&&!!(at(x-1,y)||at(x+1,y)||at(x,y-1)||at(x,y+1));
  const c=document.createElement('canvas');c.width=c.height=Nn*sc;const q=c.getContext('2d'),put=(x,y,col)=>{q.fillStyle=col;q.fillRect(x*sc,y*sc,sc,sc)};
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++)if(!at(x,y)&&!ol(x,y)&&(at(x-1,y-1)||ol(x-1,y-1)))put(x,y,'rgba(0,0,0,.35)');  // ombra
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++)if(ol(x,y))put(x,y,'#140c04');  // contorno scuro
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++){const v=at(x,y);if(!v)continue;const lt=!at(x-1,y)||!at(x,y-1),dk=!at(x+1,y)||!at(x,y+1);put(x,y,lt&&!dk?shx(v,1.3):dk&&!lt?shx(v,.7):v)}  // luce in alto a sinistra, ombra in basso a destra
  return c}
let CURU={},curK='',curT=0,MX=-1,MY=-1;
function curApply(){let css='';const st=SET.cur|0;
  if(st<4){const sc=[1,2,3][(SET.curs|0)-1]||2,col=CURC[SET.curc]||CURC.oro,mk=(k,c)=>{const s=curShape(k,c);return{u:curBake(s,sc),u2:curBake(s,sc*2),x:s.hs[0]*sc,y:s.hs[1]*sc}};
    CURU={def:mk(st,col),atk:mk('atk'),talk:mk('talk'),use:mk(2,col)};
    // sugli schermi ad alta densità il browser sceglie l'immagine doppia, così la pixel art resta nitida (i browser che non capiscono image-set usano la prima regola)
    const cu=(o,f)=>`cursor:url(${o.u}) ${o.x} ${o.y},${f};cursor:-webkit-image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},${f};cursor:image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},${f}`;
    css=`html,body,#menu,#pn,#set,#chg,canvas#c{${cu(CURU.def,'auto')}}button,select,summary,label,input[type=checkbox],input[type=range],.ti{${cu(CURU.use,'pointer')}}input:not([type]),input[type=text],input[type=number],input[type=password]{cursor:text}`}
  else CURU={};
  $('curcss').textContent=css;cv.style.cursor='';curK=''}
function curPrev(){if(!CURU.def)return'';return[['def','Normale'],['atk','Nemico'],['talk','Personaggio'],['use','Oggetti e porte']].map(([k,l])=>`<span><img src="${CURU[k].u}" alt="" width="${(SET.curs|0)*16||32}">${l}</span>`).join('')}
cv.addEventListener('pointermove',e=>{MX=e.clientX;MY=e.clientY});
// cambia il cursore in base a cosa c'è sotto il mouse (nemico, personaggio, porta od oggetto)
function curHover(dt){if(!CURU.def||!SET.curx||MX<0){if(curK){cv.style.cursor='';curK=''}return}if((curT-=dt)>0)return;curT=.08;
  const[mx,my]=toWorld(MX,MY),pl=nearAt(NET.list,mx,my),h=pl||nearAt(ents,mx,my);let k='';
  if(h){if(h.k==='en'||(h.k==='pl'&&inPit(h.px,h.py)&&inPit(P.px,P.py)))k='atk';else if(h.k==='npc')k='talk';else k='use'}
  if(k!==curK){curK=k;if(!k){cv.style.cursor='';return}const o=CURU[k];cv.style.cursor=`url(${o.u}) ${o.x} ${o.y},auto`;cv.style.cursor=`image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},auto`}}
$('ver').textContent=GAME_VER;document.title='Voxelia '+GAME_VER+' – Il Regno Perduto';
rs();onresize=rs;applySet();iconFill();contHTML();$('menu').classList.add('intro','rdy');setTimeout(()=>$('menu').classList.remove('intro'),3200);newBadge();music('menu');requestAnimationFrame(loop);edInstall();
