/* ================= 7.18: TOMORROW È UN MONDO SOLO =================
   Le regioni non si attraversano più con un passaggio: il gioco tiene caricata la regione in cui sei e una fascia delle
   regioni intorno (la «distanza di visuale», nelle Impostazioni → Tomorrow). Quando cammini oltre il bordo della tua
   regione, la finestra si sposta con te senza fermare il gioco: i nemici che ti inseguono ti seguono davvero, quello che
   è a terra resta a terra, i nemici abbattuti non rinascono subito.
   Le regioni generate restano in memoria e quelle intorno si preparano mentre giochi, così lo spostamento non si sente.
   Il pavimento si disegna a blocchi (solo quelli che si vedono), per non riempire la memoria con un mondo così grande. */
const TWW={m:0,cache:new Map(),kill:new Map(),carry:null,seam:0,pre:[],preT:0};
SETD.twrd=TOUCH?0:1;if(SET.twrd==null)SET.twrd=SETD.twrd;
// 7.19.1: si torna al passaggio di prima fra le regioni (una regione alla volta, con la transizione): la fascia è zero
const twMarg=()=>0;
const twWinN=()=>TWR+2*twMarg();
const twWin=()=>!!(ZZ&&ZZ.tw&&TWW.m);
// da finestra a regione e ritorno
function twLocAt(x,y){const p=twP(Zk);if(!p||!TWW.m)return null;const wx=p[0]*TWR+Math.floor(x)-TWW.m,wy=p[1]*TWR+Math.floor(y)-TWW.m,rx=Math.floor(wx/TWR),ry=Math.floor(wy/TWR);return{k:twK(rx,ry),x:wx-rx*TWR,y:wy-ry*TWR,rx,ry}}
function twWinAt(k,x,y){const p=twP(Zk),q=twP(k);if(!p||!q)return null;const X=(q[0]-p[0])*TWR+x+TWW.m,Y=(q[1]-p[1])*TWR+y+TWW.m;return X>=0&&Y>=0&&X<N&&Y<N?[X,Y]:null}
const twLX=()=>TWW.m&&twWin()?(P.px-TWW.m)/TWR:P.px/N,twLY=()=>TWW.m&&twWin()?(P.py-TWW.m)/TWR:P.py/N;
/* ---- una regione generata a parte (e ricordata) ---- */
function twRegGen(k){let D=TWW.cache.get(k);if(D){TWW.cache.delete(k);TWW.cache.set(k,D);return D}
  const z=twZ(k);if(!z)return null;const sv={N,M,DEC,BM,TB,RDF,ents,eid,Zk,ZZ,R,HHc:typeof HHc!=='undefined'?HHc:null};
  try{N=TWR;Zk=k;ZZ=z;R=Math.random;eid=500000+TWW.cache.size*1000;M=grid(0);DEC=grid('');BM=null;TB=[];RDF=new Set();ents=[];
    const sp=twGen(z);ents.forEach((e,i)=>{e.rk=k;e.sid=i});
    D={k,M,DEC,TB,BM,RDF,ents,sp,wallsL:z.walls?z.walls.slice():null,gatesL:z.gates?z.gates.filter(g=>WK(M[g[1]][g[0]])).map(g=>g.slice()):null}}
  finally{N=sv.N;M=sv.M;DEC=sv.DEC;BM=sv.BM;TB=sv.TB;RDF=sv.RDF;ents=sv.ents;eid=sv.eid;Zk=sv.Zk;ZZ=sv.ZZ;R=sv.R}
  TWW.cache.set(k,D);while(TWW.cache.size>36)TWW.cache.delete(TWW.cache.keys().next().value);return D}
/* ---- la finestra: la regione al centro e la fascia di quelle intorno ---- */
const TWRESP=180;// i nemici abbattuti tornano dopo tre ore di gioco
function twGenWin(z){const m=TWW.m=twMarg(),n=N,rx=z.rx,ry=z.ry,C=TWW.carry;TWW.carry=null;
  TB=[];BM=grid(-1);RDF=new Set();let sp=null;const now=gNow(),live=new Map(),loose=[];
  if(C)for(const e of C.ents){if(e.k==='dead'||e===P)continue;e.px-=C.dx*TWR;e.py-=C.dy*TWR;if(e.ax!=null){e.ax-=C.dx*TWR;e.ay-=C.dy*TWR}if(e.path)e.path=[];
    if(e.rk!=null)live.set(e.rk+'#'+e.sid,e);else loose.push(e)}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const ox=m+dx*TWR,oy=m+dy*TWR;if(ox+TWR<=0||oy+TWR<=0||ox>=n||oy>=n)continue;
    const k=twK(rx+dx,ry+dy),D=twRegGen(k);if(!D)continue;const x0=Math.max(0,-ox),x1=Math.min(TWR,n-ox),y0=Math.max(0,-oy),y1=Math.min(TWR,n-oy);
    for(let y=y0;y<y1;y++){const sr=D.M[y],sd=D.DEC[y],dr=M[oy+y],dd=DEC[oy+y];for(let x=x0;x<x1;x++){dr[ox+x]=sr[x];dd[ox+x]=sd[x]}}
    for(const i of D.RDF){const x=i%TWR,y=(i/TWR)|0;if(x>=x0&&x<x1&&y>=y0&&y<y1)RDF.add((oy+y)*n+ox+x)}
    D.TB.forEach((b,i)=>{if(b.x+b.w<=x0||b.x>=x1||b.y+b.h<=y0||b.y>=y1)return;const nb=Object.assign({},b,{x:b.x+ox,y:b.y+oy});if(b.dx!=null)nb.dx=b.dx+ox;const j=TB.push(nb)-1;
      for(let y=Math.max(nb.y,0);y<Math.min(nb.y+nb.h,n);y++)for(let x=Math.max(nb.x,0);x<Math.min(nb.x+nb.w,n);x++)BM[y][x]=j});
    for(const e of D.ents){const X=e.px+ox,Y=e.py+oy;if(X<.5||Y<.5||X>n-.5||Y>n-.5)continue;const key=k+'#'+e.sid,kt=TWW.kill.get(key);
      if(kt!=null){if(now-kt<TWRESP&&e.k==='en')continue;if(now-kt>=TWRESP)TWW.kill.delete(key)}
      if(e.k==='ch'&&e.twk&&P.tw.ch.includes(e.twk))continue;
      const L=live.get(key);if(L){live.delete(key);if(L.px>=.5&&L.py>=.5&&L.px<=n-.5&&L.py<=n-.5)ents.push(L);continue}
      if(C&&e.k==='en'&&kt==null&&C.seen&&C.seen.has(key))continue;// era nella finestra di prima ed è stato abbattuto o è scomparso
      const c=Object.assign({},e,{px:X,py:Y,id:++eid});if(c.ax!=null){c.ax+=ox;c.ay+=oy}if(e.path)c.path=[];ents.push(c)}
    if(!dx&&!dy){sp=[D.sp[0]+ox,D.sp[1]+oy];z.walls=D.wallsL?[D.wallsL[0]+ox,D.wallsL[1]+oy,D.wallsL[2]+ox,D.wallsL[3]+oy]:z.walls;z.gates=D.gatesL?D.gatesL.map(g=>[g[0]+ox,g[1]+oy]):z.gates}}
  // chi era vivo nella finestra di prima e non è più nella sua regione (ti ha inseguito), e le cose a terra
  for(const e of live.values())if(e.px>=.5&&e.py>=.5&&e.px<=n-.5&&e.py<=n-.5)ents.push(e);
  for(const e of loose)if(e.px>=.5&&e.py>=.5&&e.px<=n-.5&&e.py<=n-.5)ents.push(e);
  // il tuo campo, ovunque sia nella finestra
  if(P.tw.camp&&!ents.some(e=>e.k==='twc')){const q=twWinAt(P.tw.camp.k,P.tw.camp.x,P.tw.camp.y);if(q)ents.push({k:'twc',n:'Il tuo campo',px:q[0]+.5,py:q[1]+.5,torch:1,t0:t})}
  return sp||[n>>1,n>>1]}
const _genWild718=genWild;genWild=function(z){return z&&z.tw?twGenWin(z):_genWild718(z)};
// la finestra ha sempre la grandezza della distanza di visuale
const _twZ718=twZ;twZ=function(k){const z=_twZ718(k);if(z&&z.tw)z.N=twWinN();return z};
const _load718=load;load=function(k,from){if(String(k).startsWith('tw:')){const z=twZ(k);if(z)z.N=twWinN()}else if(k!=='town'||!twOn())TWW.m=0;_load718(k,from);if(!(ZZ&&ZZ.tw))TWW.m=0;twPreQueue()};
// i nemici abbattuti si ricordano per un po'
const _kill718=kill;kill=function(e){if(e&&e.rk!=null&&e.k==='en'&&twWin())TWW.kill.set(e.rk+'#'+e.sid,gNow());_kill718(e)};
/* ---- camminare oltre il bordo della regione: la finestra si sposta con te ---- */
const _twEdge719=twEdge;twEdge=function(){if(!TWW.m){_twEdge719();return}if(!twOn()||!P||P.hp<=0||PM||!String(Zk).startsWith('tw:')||OW.tx||OW.tp)return;const m=TWW.m;if(!m)return;const h=1.5;let dx=0,dy=0;
  if(P.px<m-h)dx=-1;else if(P.px>=m+TWR+h)dx=1;if(P.py<m-h)dy=-1;else if(P.py>=m+TWR+h)dy=1;if(dx||dy)twShift(dx,dy)};
function twShift(dx,dy){const p=twP(Zk);if(!p)return;const nk=twK(p[0]+dx,p[1]+dy),ox=P.px,oy=P.py,ocx=camX,ocy=camY,tg=P.tg,ofx=fx,opop=pop,oPJ=PJ,opa=parts;
  const seen=new Set();for(const e of ents)if(e.rk!=null)seen.add(e.rk+'#'+e.sid);
  TWW.carry={ents:ents.slice(),dx,dy,seen};OW.tx=1;TWW.seam=1;
  try{load(nk)}finally{OW.tx=0;TWW.seam=0;TWW.carry=null}
  if(Zk!==nk)return;
  P.px=ox-dx*TWR;P.py=oy-dy*TWR;P.path=[];P.tg=tg&&ents.includes(tg)?tg:null;const sx=-dx*TWR,sy=-dy*TWR;
  camX=ocx+PX(sx,sy);camY=ocy+PY(sx,sy,0);
  // effetti, numeri e proiettili continuano dove sono
  for(const f of ofx){if(f.x!=null){f.x+=sx;f.y+=sy}if(f.x2!=null){f.x2+=sx;f.y2+=sy}}fx=ofx;
  for(const q of opop){if(q.x!=null){q.x+=sx;q.y+=sy}}pop=opop;for(const q of oPJ){if(q.x!=null){q.x+=sx;q.y+=sy}if(q.tx!=null){q.tx+=sx;q.ty+=sy}}PJ=oPJ;
  for(const q of opa){if(q.x!=null){q.x+=sx;q.y+=sy}}parts=opa;
  if(OW.camping){OW.camping.x+=sx;OW.camping.y+=sy}
  if(typeof D3!=='undefined'&&D3.on&&D3.cam){try{for(const v of[D3.cam,D3.tgt])if(v&&v.length>=2){v[0]+=sx;v[1]+=sy}}catch(_){}}}
// spostarsi non è un viaggio: niente cartellone, solo il nome della regione in un angolo
const _zoneCard718=zoneCard;zoneCard=function(z){if(TWW.seam){msg('⟡ '+z.n+' · livello '+z.lv);return}_zoneCard718(z)};
/* ---- le regioni intorno si preparano mentre giochi ---- */
function twPreQueue(){TWW.pre=[];if(!twWin())return;const p=twP(Zk);for(let r=1;r<=2;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(Math.max(Math.abs(dx),Math.abs(dy))===r)TWW.pre.push(twK(p[0]+dx,p[1]+dy))}
function twPreTick(dt){if(!TWW.pre.length||!twWin())return;if((TWW.preT-=dt)>0)return;TWW.preT=.25;
  // prima le regioni verso cui stai camminando
  const p=twP(Zk),cx=(P.px-TWW.m)/TWR-.5,cy=(P.py-TWW.m)/TWR-.5;TWW.pre.sort((a,b)=>{const A=twP(a),B=twP(b);return Math.hypot(A[0]-p[0]-cx,A[1]-p[1]-cy)-Math.hypot(B[0]-p[0]-cx,B[1]-p[1]-cy)});
  const k=TWW.pre.shift();if(!TWW.cache.has(k)){const t0=performance.now();twRegGen(k);if(performance.now()-t0>60)TWW.preT=.6}}
const _upd718=upd;upd=function(dt){_upd718(dt);if(twOn())twPreTick(dt)};
/* ---- il campo si ricorda in coordinate della regione ---- */
twCampHere=function(){return P.tw&&P.tw.camp?ents.find(e=>e.k==='twc')||null:null};
const _twCampBuild718=twCampBuild;twCampBuild=function(){_twCampBuild718();const c=ents.find(e=>e.k==='twc');if(c&&twWin()){const L=twLocAt(c.px,c.py);if(L)P.tw.camp={k:L.k,x:L.x,y:L.y};save()}};
const _twCampTry718=twCampTry;twCampTry=function(){if(twOn()&&twWin()&&!PM){const L=twLocAt(P.px,P.py);if(L&&twVil(L.rx,L.ry)&&!ZZ.vil){msg('Nei villaggi e nelle città c\'è la locanda: il campo si monta in viaggio');return}
    if(L&&!twVil(L.rx,L.ry)&&ZZ.vil){const v=ZZ.vil;ZZ.vil=0;try{_twCampTry718()}finally{ZZ.vil=v}return}}_twCampTry718()};
/* ---- i luoghi dei contratti si scelgono dentro la regione del contratto ---- */
const _owTile718=owTile;owTile=function(seed,f0,f1,cx,cy){if(!twWin())return _owTile718(seed,f0,f1,cx,cy);const m=TWW.m,M0=M;
  // si guardano solo le caselle della regione centrale (le altre diventano muri per un momento)
  const save=[];for(let y=0;y<N;y++){if(y>=m&&y<m+TWR){for(let x=0;x<m;x++)save.push(x,y,M[y][x]);for(let x=m+TWR;x<N;x++)save.push(x,y,M[y][x])}else for(let x=0;x<N;x++)save.push(x,y,M[y][x])}
  for(let i=0;i<save.length;i+=3)M[save[i+1]][save[i]]=1;
  let r;try{const x0=cx==null?P.px|0:cx,y0=cy==null?P.py|0:cy,inC=x0>=m&&y0>=m&&x0<m+TWR&&y0<m+TWR;r=_owTile718(seed,f0,f1,inC?x0:m+(TWR>>1),inC?y0:m+(TWR>>1))}
  finally{for(let i=0;i<save.length;i+=3)M[save[i+1]][save[i]]=save[i+2]}return r};
/* ---- la mappa e la bussola: dove sei nella regione ---- */
/* ---- i giocatori vicini: posizioni scambiate come se tutti avessero la stessa distanza di visuale ---- */
const TWNM0=36;
const _netTick718=netTick;netTick=function(dt){if(twWin()&&TWW.m!==TWNM0){const d=TWW.m-TWNM0,L=Object.values(NET.pl||{});P.px-=d;P.py-=d;for(const o of L){o.px-=d;o.py-=d}
  try{_netTick718(dt)}finally{P.px+=d;P.py+=d;for(const o of Object.values(NET.pl||{})){o.px+=d;o.py+=d}}}else _netTick718(dt)};
/* ---- il pavimento a blocchi per le finestre grandi ---- */
const FCB=16;
function buildFCw(){const cs=Math.min(DPR,1.1);FC={chunk:1,cs,ch:new Map(),cv:null,ox:0,oy:0,w:0,h:0};
  const m=document.createElement('canvas');m.width=m.height=130;const q=m.getContext('2d'),s=130/N;q.fillStyle='#000a';q.fillRect(0,0,130,130);
  const fl=ZZ.a||'#667788';for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c2=M[y][x];if(c2!==9){q.fillStyle=c2===2?(ZZ.pool||'#3388cc'):c2===3?'#a0705a':c2===4?'#8a8070':c2===1?'#3a5a3a':c2===6?'#4a6a3a':fl;q.fillRect(x*s,y*s,s+.3,s+.3)}}
  if(TWW.m){q.strokeStyle='rgba(255,255,255,.35)';q.lineWidth=1;q.strokeRect(TWW.m*s,TWW.m*s,TWR*s,TWR*s)}MC=m}
function fcChunk(cx,cy){const k=cx+','+cy;let c=FC.ch.get(k);if(c){c.u=FC.n;return c}const x0=cx*FCB,y0=cy*FCB,cs=FC.cs,minX=(x0-y0-FCB)*32-32,minY=(x0+y0)*16-40,w=FCB*64+64,h=FCB*32+90;
  const cv=document.createElement('canvas');cv.width=Math.ceil(w*cs);cv.height=Math.ceil(h*cs);const G0=g;g=cv.getContext('2d');g.setTransform(cs,0,0,cs,-minX*cs,-minY*cs);
  try{for(let d=0;d<2*FCB-1;d++)for(let i=Math.max(0,d-FCB+1);i<=Math.min(d,FCB-1);i++){const x=x0+i,y=y0+d-i;if(x>=N||y>=N)continue;const mm=M[y][x];if(mm===0||mm===4||mm===8||mm===6||(mm===1&&openW(x,y)))floor(x,y,mm===6?(RDF.has(y*N+x)?4:0):mm===1?0:mm,hh(x,y))}}
  finally{g=G0}c={cv,minX,minY,w,h,u:FC.n};FC.ch.set(k,c);
  if(FC.ch.size>70){let o=null,ok=null;for(const[kk,v]of FC.ch)if(!o||v.u<o.u){o=v;ok=kk}if(ok)FC.ch.delete(ok)}return c}
function fcDraw(){FC.n=(FC.n||0)+1;const vx=W/2/S+80,vy=H/2/S+80,nc=Math.ceil(N/FCB);let built=0;
  for(let s=0;s<2*nc-1;s++)for(let cx=Math.max(0,s-nc+1);cx<=Math.min(s,nc-1);cx++){const cy=s-cx,x0=cx*FCB,y0=cy*FCB,minX=(x0-y0-FCB)*32-32,maxX=(x0-y0+FCB)*32+32,minY=(x0+y0)*16-40,maxY=(x0+y0+2*FCB)*16+50;
    if(maxX<camX-vx||minX>camX+vx||maxY<camY-vy||minY>camY+vy)continue;const k=cx+','+cy;if(!FC.ch.has(k)&&built>=6)continue;if(!FC.ch.has(k))built++;const c=fcChunk(cx,cy);g.drawImage(c.cv,c.minX,c.minY,c.w,c.h)}}
const _buildFC718=buildFC;buildFC=function(){if(ZZ&&ZZ.tw&&N>TWR){buildFCw();return}_buildFC718()};
// il disegno del pavimento sceglie da solo fra il foglio unico e i blocchi
function fcPaint(){if(!FC)buildFC();if(FC.chunk)fcDraw();else if(FC.cv)g.drawImage(FC.cv,-FC.ox,-FC.oy,FC.w,FC.h)}
/* ---- le Impostazioni: la distanza di visuale di Tomorrow ---- */
/* ---- i borghi: dove si incrociano i sentieri, al posto della radura, qualche casa con i suoi abitanti ---- */
function twHamlet(C,ends){const{F,disc,rnd,rr,n,hub,rx,ry,bio,tg,ok,z}=C,[cx,cy]=hub;z.ham=1;
  disc(cx+.5,cy+.5,6.5,(x,y,d)=>{if(M[y][x]===2){M[y][x]=4;DEC[y][x]='~';return}if(M[y][x]!==4)F(x,y,d<2.2?'4':d<3.4?'1':bio==='deserto'?'2':bio==='neve'?'':bio==='cenere'?'9':'2')});
  // il focolare o il pozzo al centro
  if(bio==='neve'||bio==='cenere'||rnd()<.5){M[cy][cx]=6;DEC[cy][cx]='ƒ';for(const[a,b]of[[-1,1],[1,1],[1,-1]])if(ok(cx+a,cy+b)&&M[cy+b][cx+a]===0){M[cy+b][cx+a]=6;DEC[cy+b][cx+a]='m'}}
  else{M[cy][cx]=2;DEC[cy][cx]='';for(const[a,b]of[[-1,0],[1,0],[0,-1]])if(ok(cx+a,cy+b)){M[cy+b][cx+a]=6;DEC[cy+b][cx+a]='ɸ'}}
  // le case, lontano dai sentieri
  const tra=ends.map(([x,y])=>Math.atan2(y-cy,x-cx)),walls={prato:['#e0d0b0','#c8b89a'],bosco:['#8a6a4a','#9a7a5a'],deserto:['#e8d4aa','#f0e0c0'],neve:['#7a5a3a','#6a4a2a'],cenere:['#5a5050','#4a4040']}[bio];
  const roofs=['#a8402f','#3a5a8a','#4a6a3a','#7a3a2a','#5a4a3a'],nh=rr(2,4),hs2=[];let a0=rnd()*6.283;
  for(let k=0;k<16&&hs2.length<nh;k++){const a=a0+k*.785+rnd()*.2;if(tra.some(t=>{let d=Math.abs(((a-t)%6.283+9.425)%6.283-3.14159);return d<.55}))continue;
    const w=rr(3,4),h=3,x=Math.round(cx+Math.cos(a)*6.4-w/2),y=Math.round(cy+Math.sin(a)*6.4-h/2);if(x<3||y<3||x+w>n-3||y+h>n-4)continue;
    if(hs2.some(b=>x<b.x+b.w+1&&x+w+1>b.x&&y<b.y+b.h+1&&y+h+1>b.y))continue;const b={x,y,w,h,wall:walls[hs2.length%2],roof:roofs[Math.floor(rnd()*roofs.length)],ht:20+rr(0,5),smoke:rnd()<.6?1:0};
    hs2.push(b);twHouse(b,30+hs2.length,rx,ry);tg.push([b.x+(b.w>>1),b.y+b.h])}
  // un orto e una staccionata, una panchina, un lampione
  const sg=(x,y,c)=>{if(ok(x,y)&&M[y][x]===0&&!(Math.abs(x-cx)<2&&Math.abs(y-cy)<2)){M[y][x]=6;DEC[y][x]=c;return 1}return 0};
  {const a=a0+3.14,ox=Math.round(cx+Math.cos(a)*4.5),oy=Math.round(cy+Math.sin(a)*4.5);for(let i=0;i<3;i++)sg(ox+i-1,oy,['g','q','v'][((i+rx+ry)%3+3)%3]);sg(ox+2,oy-1,'E')}
  sg(cx+2,cy-2,'n');sg(cx-2,cy+2,'l');
  // gli abitanti: due o tre paesani, a volte un mercante di passaggio
  const ids=[6,7,8].slice(0,rr(2,3));if(rnd()<.3)ids.push(1);
  ids.forEach((i,j)=>{const id=twNpcId(rx,ry,i);twNpc(id);const[x,y]=nearFree(cx+[2,-2,1,-1][j],cy+[1,-1,-2,2][j]);ents.push(mkNpc(id,x,y,{wd:i===1?0:1}));tg.push([x,y])});
  return[cx,cy+2]}
/* ---- un mondo nuovo (altro eroe, altro codice stanza): si dimentica tutto ciò che era del mondo di prima ---- */
function twForget(){for(const k of Object.keys(Z))if(/^tw[i]?:/.test(k)){delete Z[k];delete SKY[k]}
  for(const k of Object.keys(DG))if(k.startsWith('twd_'))delete DG[k];for(const k of Object.keys(NPCS))if(/^t[vrt]_/.test(k))delete NPCS[k];
  TWW.cache.clear();TWW.kill.clear();TWW.pre=[];for(const c of[typeof TWTH!=='undefined'&&TWTH,typeof TWCH!=='undefined'&&TWCH,typeof TWRC!=='undefined'&&TWRC,typeof TWRI!=='undefined'&&TWRI])if(c)c.clear()}
const _begin718=begin;begin=function(d,s){const tw=!!OW.next;if(tw){const nc=($('rc')?$('rc').value:'').trim().toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16),sd2=s&&s.p&&s.p.tw?s.p.tw.seed:null;
    const key=nc?'c:'+nc:sd2==null?'new':'s:'+sd2;if(TWW.seed!==key)twForget()}
  _begin718(d,s);if(tw&&P&&P.tw)TWW.seed=NET.code?'c:'+NET.code:'s:'+P.tw.seed};
