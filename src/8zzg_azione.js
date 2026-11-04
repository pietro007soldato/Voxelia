/* ================= 7.32: IL COMBATTIMENTO D'AZIONE, IN STILE DARK SOULS =================
   Per combattere non si clicca più sul nemico: si clicca dove si vuole colpire. L'eroe si gira verso il cursore e fa la
   mossa della sua arma (con la catena di tre colpi e il colpo perfetto di sempre); tenendo premuto il tasto del mouse si
   carica il colpo pesante. Il movimento è quello di un gioco d'azione:
   - STAMINA (la barra verde sotto la vita): ogni attacco, ogni capriola e la corsa la consumano, ognuna secondo l'arma;
     quando finisce si resta senza fiato e bisogna aspettare un attimo. Si ricarica da sola quando ti fermi;
   - CAPRIOLA (Maiusc premuto e lasciato, o E, o il pulsante Schiva): un rotolamento veloce nella direzione in cui ti muovi,
     invulnerabile per un istante; da fermo è un passo indietro. Niente più attesa di tre secondi: basta la stamina;
   - CORSA: tenendo premuto Maiusc mentre ti muovi corri più veloce, consumando stamina;
   - BLOCCO DEL BERSAGLIO (Tab, o il pulsante Blocca sul telefono): l'eroe resta girato verso il nemico scelto anche
     mentre si sposta, e ogni colpo va su di lui. Tab di nuovo passa al nemico dopo; il mirino rosso lo segna.
   Lontano dai nemici il clic fa camminare come sempre; cliccare persone, porte e forzieri funziona come prima.
   Si torna al combattimento classico nelle impostazioni (Comandi → Combattimento). */
if(SET.act==null)SET.act=1;
const actOn=()=>!!(SET.act&&cbOn()&&MODE!=='dim'&&!(typeof XR!=='undefined'&&XR&&XR.s));
const STW={dag:10,swd:14,axe:18,ham:22,spr:14,tri:15,stf:10,scy:16};
const stMax=()=>100+Math.min(60,P.lv|0);
const ACT={sh:0,shT:0,run:0,lock:null,tw:-9,stT:-9};
function stCur(){if(P.sta==null)P.sta=stMax();return P.sta}
// 7.42.2: arrivati a zero si resta SENZA FIATO finché la stamina non torna almeno al 30%: niente corsa, capriole, attacchi.
// Prima bastava un filo di stamina ricaricata (anche 0,4) per scattare, rotolare o colpire di nuovo, all'infinito.
const ST_OK=.3;
function stUse(n){P.sta=Math.max(0,stCur()-n);ACT.stT=t;if(P.sta<=0)ACT.ex=1}
function stTired(){if(ACT.ex&&stCur()>=stMax()*ST_OK)ACT.ex=0;if(!ACT.ex&&stCur()>0)return false;if(t-ACT.tw>.8){ACT.tw=t;flt(P,'Senza fiato','#9adcff');tone(200,.05,'triangle',.03)}return true}
// dove punta il cursore, sul terreno (anche in 3D)
function actAim(ev){let wx,wy;if(typeof D3!=='undefined'&&D3.act){const p=d3Ground(ev.clientX,ev.clientY);if(!p)return null;wx=p[0];wy=p[1]}
  else{const[mx,my]=toWorld(ev.clientX,ev.clientY),m2=my+14;wx=(mx/32+m2/16)/2;wy=(m2/16-mx/32)/2}const dx=wx-P.px,dy=wy-P.py,d=Math.hypot(dx,dy);if(d<.05)return null;return[dx/d,dy/d]}
// c'è da combattere? (nemici vicini e visibili, o la fossa dei duelli)
function actFight(){if(inPit(P.px,P.py))return true;for(const e of ents)if(e.k==='en'&&!(e.al===0&&e.hid)&&dist(e,P)<10)return true;return false}
// verso chi va la mossa: il bersaglio bloccato, poi il nemico più vicino nella direzione del cursore, poi dove punta il cursore
const _cbDir732=cbDir;cbDir=function(r){if(!actOn())return _cbDir732(r);
  const L=ACT.lock&&ents.includes(ACT.lock)&&dist(ACT.lock,P)<r+7?ACT.lock:null;if(L){const dx=L.px-P.px,dy=L.py-P.py,d=Math.hypot(dx,dy)||1;return{dx:dx/d,dy:dy/d,tg:L}}
  const aim=ACT.aim&&t-ACT.aimT<.7?ACT.aim:(P.dr||[0,1]),cone=ACT.aim&&t-ACT.aimT<.7?.82:.7;let tg=null,bs=-1;
  for(const e of ents){if(e.k!=='en'||(e.al===0&&e.hid))continue;const dx=e.px-P.px,dy=e.py-P.py,d=Math.hypot(dx,dy);if(d>r+1.3||d<.01)continue;const c=(dx*aim[0]+dy*aim[1])/d-d*.02;if(c>cone&&c>bs){bs=c;tg=e}}
  if(tg){const dx=tg.px-P.px,dy=tg.py-P.py,d=Math.hypot(dx,dy)||1;return{dx:dx/d,dy:dy/d,tg}}const d=Math.hypot(aim[0],aim[1])||1;return{dx:aim[0]/d,dy:aim[1]/d,tg:null}};
// la stamina: ogni mossa ha il suo costo
const _cbPress732=cbPress;cbPress=function(src){if(actOn()&&cbOn()&&!PM&&!P.dm&&!CMB.cur&&stTired())return;_cbPress732(src)};
const _cbDo732=cbDo;cbDo=function(step,o){if(actOn()&&!(o&&o.auto)&&!(o&&o.first)&&stTired()){CMB.buf=0;return}_cbDo732(step,o);if(!actOn()||(o&&o.auto))return;if(P.tg&&P.tg.k==='en')P.tg=null;stUse((STW[cbCls()]||14)*(step===2?1.3:1));
  // il passo in avanti con il colpo
  const c=CMB.cur;if(c&&!P.dm){const s=.22;if(!blk(P.px+c.dx*s,P.py))P.px+=c.dx*s;if(!blk(P.px,P.py+c.dy*s))P.py+=c.dy*s}};
const _cbHeavy732=cbHeavy;cbHeavy=function(lv){if(actOn()){if(stTired())return;stUse(26+lv*14)}_cbHeavy732(lv)};
// la capriola: senza attesa, con la stamina
const _dodge732=dodge;dodge=function(){if(!actOn()||(NAV&&Zk==='mare')){_dodge732();return}if(!started||P.dm||P.hp<=0||P.dgc>0)return;if(stTired())return;
  let dx=0,dy=0;const kd=keyDir();if(kd)[dx,dy]=kd;else if(P.path.length){const w=P.path[0];dx=w.x+.5-P.px;dy=w.y+.5-P.py}
  const back=!dx&&!dy;if(back){const f=ACT.lock&&ents.includes(ACT.lock)?[ACT.lock.px-P.px,ACT.lock.py-P.py]:(P.dr||[0,1]);dx=-f[0];dy=-f[1]}
  const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;CMB.cur=null;CMB.buf=0;CMB.ch=null;
  if(back){P.dm={k:'d',t:.18,v:7,dx,dy,h:[],m:1};P.iv=.22;stUse(12)}else{P.dm={k:'d',t:.34,v:7.6,dx,dy,h:[],m:1};P.iv=.36;stUse(20);ACT.roll=t}
  P.dgc=.42;if(!ACT.lock)P.dr=[dx,dy];P.path=[];P.tg=null;fxDodge(dx,dy);whoosh()};
// i tasti: Maiusc corto = capriola, lungo = corsa; Tab = blocca il bersaglio
addEventListener('keydown',e=>{if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(!started||!actOn())return;
  if(e.key==='Shift'){if(!e.repeat){ACT.sh=1;ACT.shT=t}e.stopImmediatePropagation();return}
  if(e.key==='Tab'&&!PM){e.preventDefault();e.stopImmediatePropagation();lockNext()}},true);
addEventListener('keyup',e=>{if(e.key!=='Shift'||!ACT.sh)return;ACT.sh=0;if(actOn()&&t-ACT.shT<.24&&!ACT.ran)dodge();ACT.ran=0});
addEventListener('blur',()=>{ACT.sh=0;ACT.ran=0});
// il blocco del bersaglio
function lockNext(){const L=ents.filter(e=>e.k==='en'&&!(e.al===0&&e.hid)&&dist(e,P)<12).sort((a,b)=>dist(a,P)-dist(b,P));
  if(!L.length){if(ACT.lock){ACT.lock=null;msg('Bersaglio libero')}return}let i=ACT.lock?L.indexOf(ACT.lock)+1:0;if(i>=L.length){ACT.lock=null;tone(300,.04,'triangle');return}
  ACT.lock=L[i];tone(760,.05,'triangle',.04);flt(ACT.lock,'🎯','#ff6a5a')}
function lockToggle(){if(ACT.lock)ACT.lock=null;else lockNext()}
// il clic: dove clicchi, colpisci
{const pd=cv.onpointerdown;cv.onpointerdown=ev=>{if(!actOn()||!started||PM||(ev.button!=null&&ev.button!==0)||(typeof SED!=='undefined'&&SED.on)||(ZZ&&ZZ.mine)){pd(ev);return}
  if(!actFight()){pd(ev);return}
  const tg0=P.tg,pr0=CMB.press;pd(ev);const tg=P.tg;
  if(tg&&tg!==tg0&&tg.k!=='en'&&tg.k!=='pl')return;           // una persona, una porta, un forziere: come sempre
  if(tg&&tg.k==='pl')return;
  // 7.42.1: un nemico cliccato fuori portata si raggiunge camminando, e il colpo parte quando si arriva
  if(tg&&tg.k==='en'&&tg!==tg0&&dist(tg,P)>actReach(tg)){ACT.go=tg;ACT.goT=t;return}
  ACT.go=null;P.path=[];if(!tg||tg.k==='en')P.tg=null;const a=actAim(ev);if(a){ACT.aim=a;ACT.aimT=t}
  if(CMB.press!==pr0)return;                                    // il colpo è già partito
  cbPress('m');CMB.th=1}}
// fin dove arriva la prossima mossa dell'arma contro questo nemico
function actReach(e){const W=cbW(),mv=W.c3[Math.max(0,CMB.step+1)%3]||W.c3[0];return mv.r+cbRad(e)-.05}
// 7.50: la polvere della corsa esce dai piedi: dietro l'eroe, a terra, un piede alla volta, del colore del terreno
const RUND={k:0,ft:0};
function runDust(dx,dy,dt){RUND.k+=dt*13;if(RUND.k<1)return;RUND.k=0;RUND.ft^=1;const d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,side=RUND.ft?1:-1,
    x=P.px-ux*.16-uy*.09*side,y=P.py-uy*.16+ux*.09*side,tx=P.px|0,ty=P.py|0,m=M[ty]&&M[ty][tx],z=ZZ||{},pt=z.pt;
  const c=pt==='snow'?['#ffffff','#e8f0f8']:z.th==='desert'||Zk==='desert'||pt==='dust'?['#e0c890','#c8a868']:m===4?['#b8b4a8','#9a968c']:z.int?['#a89880','#8a7a64']:['#b8a882','#9a8a66'];
  for(let i=0;i<2;i++)sfx({k:'pt',x:x+(Math.random()-.5)*.06,y:y+(Math.random()-.5)*.06,z:.6,vx:-ux*.25+(Math.random()-.5)*.35,vy:-uy*.25+(Math.random()-.5)*.35,vz:10+Math.random()*10,gr:55,b:0,d:.35+Math.random()*.25,c:c[i%c.length],s:2.5+Math.random()*1.5,gl:1})}
/* ---- ogni fotogramma: stamina, corsa, blocco ---- */
const _upd732=upd;upd=function(dt){const on=actOn()&&started&&P&&P.hp>0;const ox=P&&P.px,oy=P&&P.py;
  // l'avvicinamento al nemico cliccato: finisce se si fa altro (tasti, altro clic, capriola) o se il nemico non c'è più
  const G=ACT.go;if(G){if(!on||P.tg!==G||!ents.includes(G)||G.hp<=0||P.dm||PM||t-ACT.goT>20)ACT.go=null;
    else if(dist(G,P)<=actReach(G)){ACT.go=null;P.tg=null;P.path=[];const dx=G.px-P.px,dy=G.py-P.py,d=Math.hypot(dx,dy)||1;ACT.aim=[dx/d,dy/d];ACT.aimT=t;cbPress('m')}}
  _upd732(dt);if(!on)return;stCur();
  // la corsa
  const kd=keyDir();ACT.run=0;if(ACT.sh&&t-ACT.shT>=.24&&kd&&!P.dm&&!CMB.cur&&P.sta>0&&!ACT.ex&&!PM){ACT.run=1;ACT.ran=1;const[dx,dy]=kd,s=1.95*dt,r=.24;
    if(!blk(P.px+dx*s+Math.sign(dx)*r,P.py))P.px+=dx*s;if(!blk(P.px,P.py+dy*s+Math.sign(dy)*r))P.py+=dy*s;P.sta=Math.max(0,P.sta-16*dt);ACT.stT=t;if(P.sta<=0){ACT.ex=1;stTired()}if(cineOK())runDust(dx,dy,dt)}
  // si ricarica quando non fai niente di faticoso
  if(!ACT.run&&!CMB.cur&&!CMB.ch&&!P.dm&&t-ACT.stT>.65){P.sta=Math.min(stMax(),P.sta+dt*(kd?30:42));if(ACT.ex&&P.sta>=stMax()*ST_OK)ACT.ex=0}
  // il bersaglio bloccato: si guarda sempre lui
  const L=ACT.lock;if(L){if(!ents.includes(L)||L.hp<=0||dist(L,P)>15){ACT.lock=null}else if(!P.dm){const dx=L.px-P.px,dy=L.py-P.py;P.fc=faceOf(dx,dy);if(!kd)P.dr=[dx,dy]}}
  stBar()};
// la barra della stamina, sotto la vita
function stBar(){const f=$('stamf');if(!f){const hb=document.querySelectorAll('#hud .hb');if(hb.length>=2&&actOn())hb[1].insertAdjacentHTML('afterend',`<div class="hb" id="stamb">${ico('vortice')||''}<div class="b"><i id="stamf" style="background:#4cc070"></i><span id="stamt"></span></div></div>`);return}
  const k=clamp(stCur()/stMax(),0,1);f.style.width=(k*100)+'%';f.style.background=ACT.ex?'#c05040':k<.25?'#c0a040':'#4cc070';const s=$('stamt');if(s)s.textContent=(ACT.ex?'Senza fiato ':'Stamina ')+Math.floor(P.sta)+'/'+stMax();const b=$('stamb');if(b)b.style.display=actOn()?'':'none'}
const _hud732=hud;hud=function(){_hud732();stBar()};
// il mirino sul bersaglio bloccato
function lockMark(){const L=ACT.lock;if(!L||!ents.includes(L))return;let sx,sy;if(typeof D3!=='undefined'&&D3.act){const q=d3Proj(L.px,L.py,(L.m&&L.m.top||40)*.6);if(!q)return;sx=q[0];sy=q[1]}else{sx=(PX(L.px,L.py)-camX)*S+W/2;sy=(PY(L.px,L.py,(L.m&&L.m.top||40)*.6)-camY)*S+H/2}
  g.save();g.setTransform(DPR,0,0,DPR,0,0);const r=13+Math.sin(t*6)*2;g.strokeStyle='#ff5a4a';g.lineWidth=2.5;g.beginPath();g.arc(sx,sy,r,0,6.3);g.stroke();
  for(let i=0;i<4;i++){const a=i*Math.PI/2+t*1.5;g.beginPath();g.moveTo(sx+Math.cos(a)*(r+3),sy+Math.sin(a)*(r+3));g.lineTo(sx+Math.cos(a)*(r+9),sy+Math.sin(a)*(r+9));g.stroke()}g.restore()}
const _draw732=draw;draw=function(){_draw732();if(actOn()&&!(typeof D3!=='undefined'&&D3.act))lockMark()};
if(typeof d3Overlay==='function'){const _d3o732=d3Overlay;d3Overlay=function(){_d3o732();if(actOn())lockMark()}}
const _loadPost732=loadPost;loadPost=function(k){_loadPost732(k);ACT.lock=null;ACT.ex=0;if(P)P.sta=stMax()};
// sul telefono: il pulsante per bloccare il bersaglio
if(typeof touchBuild==='function'){const _tb732=touchBuild;touchBuild=function(){_tb732();const tc=$('tc');if(!tc||$('t-lock'))return;
  tc.insertAdjacentHTML('beforeend',`<button id="t-lock" class="tb" aria-label="Blocca"><img src="${ICON('mira',3).u}" alt=""><b>Blocca</b><i class="tcd"></i></button>`);
  const b=$('t-lock');b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();auInit();if(actOn())lockToggle()})}}
document.head.insertAdjacentHTML('beforeend',`<style>#t-lock{right:calc(176px * var(--s) + env(safe-area-inset-right,0px));bottom:calc(30px * var(--s) + env(safe-area-inset-bottom,0px))}</style>`);
// nelle impostazioni
const _setBody732=setBody;setBody=function(k){const h=_setBody732(k);if(k!=='ctrl')return h;
  return h+sGrp('Combattimento',`<div class="row"><label for="s_act">Combattimento d'azione: clic per colpire verso il cursore, stamina, capriola (Maiusc) e blocco del bersaglio (Tab)</label><input type="checkbox" id="s_act" ${SET.act?'checked':''} onchange="setv('act',this.checked?1:0);hud()"></div>
    <p class="mu">Con il combattimento classico si clicca sul nemico per attaccarlo, come prima della 7.32.</p>`)};
