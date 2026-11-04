/* ================= 7.46: le cavalcature e le corse =================
   Allo Stallo dei Campi (Aldoria Est) e nelle tue città di Tomorrow si comprano i cavalli: un puledro, un destriero e il
   Corsiero d'oro, ognuno più veloce, in quattro mantelli. Con H si sale e si scende (all'aperto: non nei dungeon, negli
   interni o in mare). In sella si corre molto più in fretta; gli altri giocatori ti vedono a cavallo.
   Accanto allo stallo parte la Corsa: otto porte di luce da attraversare in ordine, poi di nuovo al traguardo. Il tuo
   record resta nel diario, e sul cartello si vedono anche i record degli altri giocatori presenti nella zona. */
XSV.add('cav');
const CAV46=[{k:'puledro',n:'Puledro',v:1.45,p:300,d:'Un cavallino giovane e vivace'},{k:'destriero',n:'Destriero',v:1.7,p:1200,d:'Forte, veloce e coraggioso'},{k:'corsiero',n:'Corsiero d\'oro',v:2,p:4000,d:'Il più veloce del regno: corre come il vento'}];
const CAVC={baio:['Baio','#8a5a32','#2a1a10'],morello:['Morello','#2a2426','#120e0e'],grigio:['Grigio','#c8c4c0','#8a8682'],pezzato:['Pezzato','#e8e0d0','#4a3a2a']};
const CAVR={on:null};
function cavFix(){P.cav=P.cav||{own:[],sel:0,col:'baio',on:0,best:{}};P.cav.own=P.cav.own||[];P.cav.best=P.cav.best||{};return P.cav}
const cavOk=()=>!!(ZZ&&!ZZ.int&&!ZZ.lay&&!ZZ.dg&&!ZZ.torre&&!ZZ.boat&&!ZZ.war&&!ZZ.ass&&Zk!=='mare'&&Zk!=='arena'&&!String(Zk).startsWith('mare_')&&(SKY[Zk]||String(Zk).startsWith('tw:')));
const cavOn=()=>!!(P&&P.cav&&P.cav.on&&cavOk());
const cavB=()=>{const c=cavFix();return CAV46.find(b=>b.k===c.own[c.sel])||CAV46[0]};
function cavToggle(){if(!started||PM)return;const c=cavFix();if(!c.own.length){msg('Non hai un cavallo: lo compri allo Stallo dei Campi (Aldoria Est) o nella tua città di Tomorrow');return}
  if(!c.on&&!cavOk()){msg('Qui non si può andare a cavallo');return}c.on=c.on?0:1;P.az=c.on?16:0;tone(c.on?520:300,.08,'triangle');if(c.on){msg('In sella al tuo '+cavB().n+' (H per scendere)');whoosh()}save()}
addEventListener('keydown',e=>{if(!started||e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.repeat)return;if(e.key.toLowerCase()==='h'&&!PM){cavToggle();e.preventDefault()}});
// la velocità: si aggiunge al passo dell'eroe quello che manca per arrivare alla velocità del cavallo
const _upd746c=upd;upd=function(dt){const x0=P?P.px:0,y0=P?P.py:0,on=P&&cavOn()&&!P.dm;_upd746c(dt);if(!P)return;
  if(on&&P.hp>0){const dx=P.px-x0,dy=P.py-y0,d=Math.hypot(dx,dy);if(d>.0005&&d<.5){const k=cavB().v-1;mv(P,dx*k,dy*k)}}
  P.az=cavOn()?16:0;if(CAVR.on)cavRaceTick()};
// scendere da soli entrando dove non si può andare a cavallo
const _loadPost746c=loadPost;loadPost=function(k){_loadPost746c(k);if(P&&P.cav&&P.cav.on&&!cavOk())P.az=0;if(CAVR.on&&CAVR.on.zk!==Zk)CAVR.on=null;cavPlace()};
// il cavallo sotto l'eroe (anche per gli altri giocatori)
function cavL(col,mane,dir,mov,ph){const s=mov?Math.sin(ph):0,c2=typeof shx==='function'?shx(col,.82):col,L=[];
  const B=(u,v,z,du,dv,h,cc)=>{if(dir==='x'||dir==='-x'){const sg=dir==='x'?1:-1;L.push([v*sg-(sg<0?dv:0),u,z,dv,du,h,cc])}else{const sg=dir==='y'?1:-1;L.push([u,v*sg-(sg<0?dv:0),z,du,dv,h,cc])}};
  for(const[u,v,q]of[[-.17,.22,0],[.07,.22,1],[-.17,-.36,1],[.07,-.36,0]]){const lift=(q?s:-s)*3;B(u,v,Math.max(0,lift),.1,.12,16-Math.max(0,lift),c2)}
  B(-.19,-.44,15,.38,.86,12,col);B(-.2,-.14,27,.4,.34,3,'#7a2a1a');B(-.21,-.12,26,.42,.3,1.5,'#d4af37');
  B(-.1,.34,24,.2,.2,12,col);B(-.11,.46,33,.22,.34,8,col);B(-.12,.76,33,.24,.06,4,c2);B(-.04,.3,30,.08,.28,10,mane);B(-.06,-.56,18,.12,.14,13,mane);return L}
function cavDraw(e,b,col,mov){const C=CAVC[col]||CAVC.baio,d=e.dr||(e===P?P.dr:null)||[0,1],dir=Math.abs(d[0])>Math.abs(d[1])?(d[0]>0?'x':'-x'):(d[1]>0?'y':'-y');
  const L=cavL(b&&b.k==='corsiero'?'#d8b048':C[1],b&&b.k==='corsiero'?'#fff0b0':C[2],dir,mov,t*13+(e.px+e.py));drawL(typeof isoOrder==='function'?isoOrder(L,0):L,e.px,e.py,0)}
const _ent746c=ent;ent=function(e){if(e===P&&cavOn()){const mv2=P.path.length||P.km;cavDraw(P,cavB(),P.cav.col,mv2);P.az=16}
  else if(e.k==='pl'){const q=NET.peers&&NET.peers[e.id];if(q&&q.cav){cavDraw(e,CAV46[q.cav[0]|0],q.cav[1],e.mv>0);e.az=16}else e.az=0}
  if(e.k==='stalla46'){stallaDraw(e);return}if(e.k==='gara46'){garaDraw(e);return}_ent746c(e)};
{const sp0=syncPack;syncPack=function(){const o=sp0()||{};if(cavOn())o.cav=[CAV46.indexOf(cavB()),P.cav.col];if(P&&P.cav&&P.cav.best&&P.cav.best[Zk])o.crb=P.cav.best[Zk];return o}}
/* ---- lo stallo e il cartello della corsa ---- */
function cavPlace(){if(!ZZ||!started)return;let c=null;if(Zk==='campi'&&!(typeof OW!=='undefined'&&OW.on))c=[22,40];else if(typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub)c=[ZZ.shub[0]-5,ZZ.shub[1]+3];if(!c)return;
  if(ents.some(e=>e.k==='stalla46'))return;const fr=(x,y)=>x>2&&y>2&&x<N-3&&y<N-3&&(M[y][x]===0||M[y][x]===4)&&!(DEC[y][x]&&DEC[y][x][0]!=='₪')&&!ents.some(e=>Math.abs(e.px-x-.5)<1.6&&Math.abs(e.py-y-.5)<1.6);
  let a=null,b=null;for(let r=0;r<10&&!b;r++)for(let dy=-r;dy<=r&&!b;dy++)for(let dx=-r;dx<=r&&!b;dx++){const x=c[0]+dx,y=c[1]+dy;if(!fr(x,y))continue;if(!a)a=[x,y];else if(Math.hypot(x-a[0],y-a[1])>=2.5)b=[x,y]}
  if(a)ents.push({k:'stalla46',px:a[0]+.5,py:a[1]+.5,n:'Stallo dei cavalli'});if(b)ents.push({k:'gara46',px:b[0]+.5,py:b[1]+.5,n:'Corsa a cavallo'})}
ITK.add('stalla46');ITK.add('gara46');
const _act746c=act;act=function(e){if(e&&e.k==='stalla46'){pn('cav46');return}if(e&&e.k==='gara46'){pn('gara46');return}_act746c(e)};
X43P.cav46=()=>{const c=cavFix();return`<h3>🐴 Stallo dei cavalli · 💰${P.g}</h3><p class="x43t">Con un cavallo si corre molto più in fretta. Premi <b>H</b> per salire e scendere (all'aperto).</p>
  <div class="x43c">${CAV46.map((b,i)=>{const own=c.own.includes(b.k),sel=own&&c.own[c.sel]===b.k;return`<button class="${sel?'on':''}" onclick="cavBuy('${b.k}')"><i>🐎</i><b>${b.n}</b><small>${b.d} · velocità ×${b.v}</small><small>${own?(sel?'✔ è il tuo cavallo':'Tuo: sceglilo'):b.p+' 💰'}</small></button>`}).join('')}</div>
  <h4>Mantello</h4><div class="srow">${Object.keys(CAVC).map(k=>`<button class="${c.col===k?'on':''}" onclick="P.cav.col='${k}';save();pn('cav46')"><i style="display:inline-block;width:12px;height:12px;background:${CAVC[k][1]};border:1px solid #0006"></i> ${CAVC[k][0]}</button>`).join('')}</div>
  ${c.own.length?`<button onclick="cl();cavToggle()">${c.on?'⬇ Scendi da cavallo':'🐴 Monta in sella'}</button>`:''}<button onclick="cl()">Chiudi</button>`};
function cavBuy(k){const c=cavFix(),B=CAV46.find(b=>b.k===k);if(!B)return;const i=c.own.indexOf(k);if(i>=0){c.sel=i;save();pn('cav46');return}
  if(P.g<B.p){msg('Servono '+B.p+' monete');tone(150,.1);return}P.g-=B.p;c.own.push(k);c.sel=c.own.length-1;jingle([67,71,74,79],.09,'triangle');banner('Un cavallo tutto tuo!',B.n+' · premi H per montare in sella','stella');hud();save();pn('cav46')}
// la corsa: otto porte di luce intorno alla zona, nello stesso ordine per tutti
function cavCourse(st){const r=sd(hs(Zk+'|corsa')),c=[N/2,N/2],R0=N*.33,d=bfs(st.px|0,st.py|0),L=[];
  for(let i=0;i<8;i++){const a=(i/8)*6.283+r()*.4-.2,tx=c[0]+Math.cos(a)*R0*(.8+r()*.35),ty=c[1]+Math.sin(a)*R0*(.8+r()*.35);let best=null,bd=1e9;
    for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){if(d[y*N+x]<0||M[y][x]!==0&&M[y][x]!==4)continue;const q=Math.hypot(x-tx,y-ty);if(q<bd){bd=q;best=[x+.5,y+.5]}}if(best)L.push(best)}
  // si parte dalla porta più vicina al cartello e si gira intorno
  let k0=0,b0=1e9;L.forEach((p,i)=>{const q=Math.hypot(p[0]-st.px,p[1]-st.py);if(q<b0){b0=q;k0=i}});return L.slice(k0).concat(L.slice(0,k0))}
X43P.gara46=()=>{const c=cavFix(),me=c.best[Zk],peers=[];if(NET.ok){const rk=rmKey();for(const id in NET.peers){const q=NET.peers[id];if(q&&q.rm===rk&&q.crb)peers.push([String(q.n||'Eroe').slice(0,14),+q.crb])}}
  peers.sort((a,b)=>a[1]-b[1]);const f=s=>Math.floor(s/60)+':'+(s%60).toFixed(1).padStart(4,'0');
  return`<h3>🏁 Corsa a cavallo</h3><p class="x43t">Otto porte di luce da attraversare in ordine, poi di nuovo qui al traguardo. Si può correre anche a piedi, ma a cavallo è un'altra storia.</p>
  <div class="x43r"><span>Il tuo record qui</span><b>${me?f(me):'—'}</b></div>${peers.map(([n,s])=>`<div class="x43r"><span>${esc(n)}</span><b>${f(s)}</b></div>`).join('')}
  <button onclick="cavRace()">🏁 Via!</button><button onclick="cl()">Chiudi</button>`};
function cavRace(){cl();const st=ents.find(e=>e.k==='gara46');if(!st)return;const cp=cavCourse(st);if(cp.length<4){msg('Qui la corsa non si può fare');return}
  CAVR.on={zk:Zk,cp:cp.concat([[st.px,st.py]]),i:0,t0:t,st};banner('3… 2… 1… via!','Attraversa le porte di luce in ordine','stella');jingle([60,60,60,72],.25,'square')}
function cavRaceTick(){const R=CAVR.on;if(Zk!==R.zk){CAVR.on=null;return}const p=R.cp[R.i];if(!p)return;if(Math.hypot(P.px-p[0],P.py-p[1])<1.7){R.i++;tone(600+R.i*60,.08,'triangle');
    if(R.i>=R.cp.length){const s=Math.round((t-R.t0)*10)/10,c=cavFix(),old=c.best[Zk];CAVR.on=null;if(!old||s<old){c.best[Zk]=s;banner('Nuovo record!','Corsa finita in '+s.toFixed(1)+' secondi','corona');jingle([67,72,76,79,84],.09)}else msg('Traguardo! '+s.toFixed(1)+' secondi (record: '+old.toFixed(1)+')');save()}
    else if(R.i===R.cp.length-1)msg('Ultima porta passata: torna al traguardo!')}}
// le porte di luce della corsa (in 2D e in 3D)
const _ent746c2=ent;ent=function(e){_ent746c2(e);if(e!==P||!CAVR.on)return;const R=CAVR.on;for(let j=R.i;j<Math.min(R.cp.length,R.i+2);j++){const[x,y]=R.cp[j],a=j===R.i?1:.45,c=j===R.cp.length-1?'#ffd84a':'#7affea',u=Math.sin(t*4)*2;
    g.globalAlpha=a;box(x-.6,y-.05,0,.12,.12,40,c,1.4);box(x+.48,y-.05,0,.12,.12,40,c,1.4);box(x-.6,y-.05,40+u,1.2,.12,4,c,1.5);g.globalAlpha=1}};
function stallaDraw(e){if(SET.shad){g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(PX(e.px,e.py),PY(e.px,e.py,0),24,11,0,0,6.3);g.fill()}
  drawL([[-.55,-.3,0,.08,.08,24,'#6a4a2a'],[.47,-.3,0,.08,.08,24,'#6a4a2a'],[-.55,-.3,20,1.1,.08,3,'#7a5a3a'],[-.55,.22,0,.08,.08,10,'#6a4a2a'],[.47,.22,0,.08,.08,10,'#6a4a2a'],[-.55,.22,8,1.1,.06,2,'#7a5a3a']],e.px,e.py,0);
  cavDraw({px:e.px,py:e.py-.05,dr:[1,0]},CAV46[0],'baio',false)}
function garaDraw(e){const w=Math.sin(t*3)*.05;drawL([[-.04,-.04,0,.08,.08,44,'#5a4a3a'],[.04,-.03+w,26,.46,.04,16,'#f4f0e0'],[.04,-.035+w,26,.12,.05,8,'#1a1a1a'],[.28,-.035+w,34,.12,.05,8,'#1a1a1a'],[.16,-.035+w,30,.12,.05,8,'#1a1a1a'],[-.25,-.2,0,.5,.4,2,'#9a8a6a']],e.px,e.py,0)}
