/* ================= 7.4: grafica più veloce =================
   Muri, edifici e arredi che non si muovono vengono disegnati UNA volta sola in una "figurina" (sprite) dentro grandi
   fogli in memoria, e a ogni fotogramma si copia solo l'immagine: copiare un'immagine costa molto meno che ridisegnare
   decine di poligoni con i bordi sfumati. Le caselle che si muovono davvero (pale, fontane, galleggianti, fuochi...)
   si riconoscono da sole e restano disegnate dal vivo. Se qualcosa cambia (porte, bancarelle chiuse, finestre accese
   di notte...), la figurina si rifà da sola. L'acqua si disegna tutta insieme, raggruppata per colore.
   Impostazioni → Prestazioni → "Rendering veloce" torna al disegno di prima. */
const FAST={ok:1,k:0,kNew:0,kAt:0,tx:0,ty:0,zk:null,fc:null,N:0,st:null,hg:null,hc:null,bb:null,spr:null,li:null,sn:null,seen:null,thr:null,
  pages:[],pg:null,cx:0,cy:0,rh:0,frame:0,t0:0,bud:4,vis:[],vi:0,err:0,stats:{spr:0,live:0,dir:0,mk:0,pr:0}};
// fogli da 1024×1024: quando se ne aggiunge una figurina il browser deve ricopiare il foglio, e un foglio piccolo si ricopia in fretta
const FPAGE=1024,FMAXPG=24;
/* ---- registratore: un finto "pennello" che invece di disegnare annota cosa verrebbe disegnato ---- */
const REC={hg:0,hc:0,bad:0,x0:0,y0:0,x1:0,y1:0,L:null,fillStyle:'#000',strokeStyle:'#000',lineWidth:1,globalAlpha:1,font:'',textAlign:'',textBaseline:'',lineCap:'',lineJoin:'',imageSmoothingEnabled:true,miterLimit:10,lineDashOffset:0,
  get globalCompositeOperation(){return'source-over'},set globalCompositeOperation(v){if(v!=='source-over')this.bad=1},
  get filter(){return'none'},set filter(v){if(v&&v!=='none')this.bad=1},get shadowBlur(){return 0},set shadowBlur(v){if(v)this.bad=1},shadowColor:'',shadowOffsetX:0,shadowOffsetY:0,
  reset(){this.hg=2166136261;this.hc=2166136261;this.bad=0;this.x0=this.y0=1e9;this.x1=this.y1=-1e9;this.fillStyle='#000';this.strokeStyle='#000';this.lineWidth=1;this.globalAlpha=1},
  n(v){this.hg=Math.imul(this.hg^(Math.round(v*16)|0),16777619)},
  c(v){if(typeof v!=='string'){this.bad=1;return}let h=this.hc;for(let i=0;i<v.length;i++)h=Math.imul(h^v.charCodeAt(i),16777619);this.hc=Math.imul(h^(Math.round(this.globalAlpha*64)|0),16777619)},
  p(x,y){if(x<this.x0)this.x0=x;if(x>this.x1)this.x1=x;if(y<this.y0)this.y0=y;if(y>this.y1)this.y1=y;this.n(x);this.n(y)},
  beginPath(){},closePath(){},moveTo(x,y){this.p(x,y)},lineTo(x,y){this.p(x,y)},
  fill(){this.c(this.fillStyle);this.n(1)},stroke(){this.c(this.strokeStyle);this.n(2+this.lineWidth);this.x0-=this.lineWidth;this.y0-=this.lineWidth;this.x1+=this.lineWidth;this.y1+=this.lineWidth},
  rect(x,y,w,h){this.p(x,y);this.p(x+w,y+h)},fillRect(x,y,w,h){this.p(x,y);this.p(x+w,y+h);this.c(this.fillStyle)},strokeRect(x,y,w,h){this.p(x-1,y-1);this.p(x+w+1,y+h+1);this.c(this.strokeStyle)},
  arc(x,y,r){this.p(x-r,y-r);this.p(x+r,y+r)},ellipse(x,y,a,b){const r=Math.max(a,b);this.p(x-r,y-r);this.p(x+r,y+r)},roundRect(x,y,w,h){this.p(x,y);this.p(x+w,y+h)},
  quadraticCurveTo(a,b,x,y){this.p(a,b);this.p(x,y)},bezierCurveTo(a,b,c,d,x,y){this.p(a,b);this.p(c,d);this.p(x,y)},
  drawImage(im,a,b,c,d,e,f,gg,h){if(e!==undefined){this.p(e,f);this.p(e+gg,f+h)}else if(c!==undefined){this.p(a,b);this.p(a+c,b+d)}else this.bad=1;this.n(7)},
  save(){},restore(){},setLineDash(){},getLineDash(){return[]},
  setTransform(){this.bad=1},transform(){this.bad=1},translate(){this.bad=1},rotate(){this.bad=1},scale(){this.bad=1},resetTransform(){this.bad=1},clip(){this.bad=1},
  fillText(){this.bad=1},strokeText(){this.bad=1},measureText(s){return{width:String(s).length*7}},
  createLinearGradient(){this.bad=1;return{addColorStop(){}}},createRadialGradient(){this.bad=1;return{addColorStop(){}}},createPattern(){this.bad=1;return null},
  getImageData(){this.bad=1;return{data:[]}},putImageData(){this.bad=1},clearRect(){this.bad=1}};
// quello che una casella disegna sopra il pavimento (muri, edifici, arredi, oggetti sull'acqua)
function fWspec(x,y){const i=y*N+x;return DEC[y][x]==='ɷ'||(ZZ&&ZZ.boat&&BOATA.has(i))||(PIERD.size&&PIERD.has(i))}
function fObj(x,y){const c=M[y][x];if(c===9)return;const h=HHc&&HHc.length===N*N?HHc[y*N+x]:hh(x,y);
  if(c===2){if(fWspec(x,y))floor(x,y,2,h);else{WMODE=2;try{floor(x,y,2,h)}finally{WMODE=0}}return}
  if(c===0){if(DEC[y][x])dec(x,y,DEC[y][x],h);return}if(c===4||c===8)return;
  if(c===1)wall(x,y,h);else if(c===3)bld(x,y,h);else dec(x,y,DEC[y][x],h)}
const fNkB=()=>Math.round(NK*10)/10;
// esame di una casella: disegno "a vuoto" con il registratore; ritorna hash, riquadro, luci
const MRND=Math.random;
function fProbe(x,y,tt){const og=g,ot=t,onk=NK,onl=nlight,gl=GLOW.length,L=[];REC.reset();g=REC;t=tt;NK=fNkB();Math.random=()=>{REC.bad=1;return .999};
  nlight=function(){const a=Array.prototype.slice.call(arguments);L.push(a);for(const v of a)if(typeof v==='number')REC.n(v)};
  let err=0;try{fObj(x,y)}catch(e){err=1}const G=GLOW.length>gl?GLOW.splice(gl):null;
  g=og;t=ot;NK=onk;nlight=onl;Math.random=MRND;return{hg:REC.hg>>>0,hc:REC.hc>>>0,bad:REC.bad||err,x0:REC.x0,y0:REC.y0,x1:REC.x1,y1:REC.y1,L:L.length?L:null,G}}
function fReset(){const n=N*N;FAST.N=N;FAST.zk=Zk;FAST.fc=FC;FAST.st=new Uint8Array(n);FAST.hg=new Uint32Array(n);FAST.hc=new Uint32Array(n);FAST.bb=new Float32Array(n*4);
  FAST.spr=new Array(n).fill(null);FAST.li=new Array(n).fill(null);FAST.sn=new Float64Array(n);FAST.seen=new Uint32Array(n);FAST.wo=new Uint32Array(n);FAST.thr=new Uint8Array(n);FAST.qm=new Uint8Array(n);FAST.q=[];FAST.vi=0;FAST.zf=0;fNewGen()}
function fNewGen(){FAST.pages=[];FAST.pg=null;FAST.cx=FAST.cy=FAST.rh=0}
const fSnap=(x,y)=>{const d=DEC[y][x];return M[y][x]*1048576+(d?d.charCodeAt(0)*8+Math.min(7,d.length):0)};
// stati: 0 da esaminare · 1 niente da disegnare · 2 ferma (figurina) · 3 si muove (dal vivo) · 4 non adatta alla figurina (dal vivo)
function fClass(i){const x=i%N,y=i/N|0,c=M[y][x];FAST.sn[i]=fSnap(x,y);FAST.spr[i]=null;FAST.li[i]=null;FAST.stats.pr++;
  if(c===9||c===4||c===8||(c===0&&!DEC[y][x])||(c===2&&!DEC[y][x]&&!fWspec(x,y)&&!(Zk==='town'&&x===35&&y===35)))return FAST.st[i]=1;
  const a=fProbe(x,y,0);if(a.x1<a.x0)return FAST.st[i]=1;
  const b=4*i;FAST.bb[b]=a.x0;FAST.bb[b+1]=a.y0;FAST.bb[b+2]=a.x1;FAST.bb[b+3]=a.y1;FAST.hg[i]=a.hg;FAST.hc[i]=a.hc;
  if(a.bad||FAST.thr[i]>3)return FAST.st[i]=4;
  const b2=fProbe(x,y,.731);if(b2.hg>>>0!==a.hg||b2.bad){
    // qualità Bassa: il leggero ondeggiare del grano e delle chiome degli alberi si ferma e la casella diventa una figurina; tutto il resto resta animato
    if(!(SET.q===0&&!b2.bad&&b2.hc===a.hc&&(DEC[y][x]==='g'||DEC[y][x]==='r')))return FAST.st[i]=3}
  if((a.x1-a.x0)*FAST.k>900||(a.y1-a.y0)*FAST.k>900)return FAST.st[i]=4;
  if(a.L||a.G)FAST.li[i]={n:a.L,g:a.G};return FAST.st[i]=2}
// figurina: la casella disegnata una volta nel foglio, alla scala attuale e allineata ai pixel dello schermo
function fRender(i){const x=i%N,y=i/N|0,k=FAST.k,b=4*i,ox=Math.floor(FAST.bb[b]*k)-2,oy=Math.floor(FAST.bb[b+1]*k)-2,w=Math.ceil(FAST.bb[b+2]*k)+2-ox,h=Math.ceil(FAST.bb[b+3]*k)+2-oy;
  if(w>FPAGE||h>FPAGE){FAST.st[i]=4;return null}
  if(!FAST.pg||FAST.cx+w>FPAGE){FAST.cx=0;FAST.cy+=FAST.rh;FAST.rh=0}
  if(!FAST.pg||FAST.cy+h>FPAGE){let pg=null;
    if(FAST.pages.length<FMAXPG){const c=document.createElement('canvas');c.width=c.height=FPAGE;pg={c,q:c.getContext('2d'),lu:FAST.frame};FAST.pages.push(pg)}
    else{// fogli pieni: si riusa quello non disegnato da più tempo (le sue figurine si rifaranno quando servono)
      for(const p of FAST.pages)if(p!==FAST.pg&&p.lu<FAST.frame-1&&(!pg||p.lu<pg.lu))pg=p;if(!pg)return null;
      for(let j=0;j<FAST.spr.length;j++){const o=FAST.spr[j];if(o&&o.pg===pg)FAST.spr[j]=null}pg.q.setTransform(1,0,0,1,0,0);pg.q.clearRect(0,0,FPAGE,FPAGE);pg.lu=FAST.frame;FAST.stats.ev=(FAST.stats.ev||0)+1}
    FAST.pg=pg;FAST.cx=FAST.cy=FAST.rh=0}
  const pg=FAST.pg,sx=FAST.cx,sy=FAST.cy,q=pg.q;FAST.cx+=w+1;if(h+1>FAST.rh)FAST.rh=h+1;
  const og=g,ot=t,onk=NK,onl=nlight,gl=GLOW.length;q.save();q.setTransform(1,0,0,1,0,0);q.clearRect(sx,sy,w,h);q.beginPath();q.rect(sx,sy,w,h);q.clip();q.setTransform(k,0,0,k,sx-ox,sy-oy);
  g=q;t=0;NK=fNkB();nlight=function(){};Math.random=()=>.999;try{fObj(x,y)}catch(e){}finally{g=og;t=ot;NK=onk;nlight=onl;Math.random=MRND;if(GLOW.length>gl)GLOW.length=gl;q.restore()}
  FAST.stats.mk++;return FAST.spr[i]={pg,sx,sy,w,h,ox,oy,k}}
// telecamera allineata ai pixel: così le figurine si copiano senza sfocature e coincidono col disegno dal vivo
function fastCam(){if(FAST.zk!==Zk||FAST.N!==N||FAST.fc!==FC||!FAST.st){if(!FC)buildFC();fReset()}
  const k=S*DPR,now=performance.now();FAST.frame++;FAST.t0=now;FAST.stats={spr:0,live:0,dir:0,mk:0,pr:0};
  // cambio di zoom: finché lo zoom si muove le figurine vecchie si allargano; quando si ferma si rifanno alla scala nuova
  if(Math.abs(k-FAST.kNew)>1e-6){FAST.kNew=k;FAST.kAt=now}
  if(Math.abs(FAST.k-k)>1e-6&&(!FAST.k||now-FAST.kAt>220)){FAST.k=k;const f=FAST.frame-2;for(let i=0;i<FAST.spr.length;i++)if(FAST.spr[i]&&FAST.seen[i]<f)FAST.spr[i]=null;fNewGen();
    for(let i=0;i<FAST.st.length;i++)if(FAST.st[i]===4&&FAST.thr[i]<=3)FAST.st[i]=0}
  FAST.tx=Math.round((W/2-camX*S)*DPR);FAST.ty=Math.round((H/2-camY*S)*DPR);g.setTransform(k,0,0,k,FAST.tx,FAST.ty);
  if(FAST.frame%600===0)for(let i=0;i<FAST.thr.length;i++)FAST.thr[i]>>=1;
  FAST.used=0;FAST.bud=FAST.zf++<12?30:5}
const fBudget=()=>FAST.used<FAST.bud;
function fTimed(fn,i){const a=performance.now(),r=fn(i);FAST.used+=performance.now()-a;return r}
/* ---- acqua: tutte le caselle visibili insieme, raggruppate per tonalità (al massimo una ventina di riempimenti) ----
   Le caselle d'acqua che hanno subito dietro qualcosa (moli, scafi, rocce, muri, alberi...) si disegnano invece al loro turno,
   come prima: così continuano a coprire la parte di quegli oggetti che sta sott'acqua. */
function fastWater(){const z=ZZ;if(!z)return;const lava=z.pool==='#ff6a1a',col=z.pool||(Zk==='peaks'?'#bfe3f5':'#3b86d6'),B=lava?1.05:.9,amp=Zk==='peaks'?.02:.08;
  const vx=W/2/S+100,vy0=H/2/S+100,vy1=H/2/S+160,G={};let any=0;const ultra=SET.ultra,list=ultra?[]:null,st=FAST.st,wo=FAST.wo,fr=FAST.frame;
  for(let d=0;d<2*N-1;d++){const y0=Math.max(0,d-N+1),y1=Math.min(d,N-1);for(let x=y0;x<=y1;x++){const y=d-x;if(M[y][x]!==2)continue;const ex=PX(x,y)-camX,ey=PY(x,y,0)-camY;if(Math.abs(ex)>=vx||ey<=-vy1||ey>=vy0)continue;
    if(fWspec(x,y))continue;const i=y*N+x;if((x>0&&st[i-1]!==1)||(y>0&&st[i-N]!==1)||(x>0&&y>0&&st[i-N-1]!==1)){wo[i]=fr;continue}const f=B+Math.sin(t*2+x+y)*amp,q=f*50|0,e=!(M[y][x+1]===2)||!(M[y+1]&&M[y+1][x]===2);(G[q]||(G[q]={f,t:[],e:[]})).t.push(x,y);if(e)G[q].e.push(x,y);any=1;if(list)list.push(x,y)}}
  if(!any)return;g.lineWidth=1;
  const face=(L,f,k)=>{const c=sh(col,f*k);g.fillStyle=g.strokeStyle=c;g.beginPath();for(let i=0;i<L.length;i+=2){const x=L[i],y=L[i+1];
    if(k===.78){g.moveTo(PX(x,y+1),PY(x,y+1,-3));g.lineTo(PX(x+1,y+1),PY(x+1,y+1,-3));g.lineTo(PX(x+1,y+1),PY(x+1,y+1,-9));g.lineTo(PX(x,y+1),PY(x,y+1,-9))}
    else if(k===.58){g.moveTo(PX(x+1,y),PY(x+1,y,-3));g.lineTo(PX(x+1,y+1),PY(x+1,y+1,-3));g.lineTo(PX(x+1,y+1),PY(x+1,y+1,-9));g.lineTo(PX(x+1,y),PY(x+1,y,-9))}
    else{g.moveTo(PX(x,y),PY(x,y,-3));g.lineTo(PX(x+1,y),PY(x+1,y,-3));g.lineTo(PX(x+1,y+1),PY(x+1,y+1,-3));g.lineTo(PX(x,y+1),PY(x,y+1,-3))}g.closePath()}g.fill();g.stroke()};
  for(const q in G){const o=G[q];if(o.e.length){face(o.e,o.f,.78);face(o.e,o.f,.58)}}
  for(const q in G)face(G[q].t,G[q].f,1);
  if(list)for(let i=0;i<list.length;i+=2)waterFx(list[i],list[i+1],lava)}
// una casella d'acqua al suo turno: i lati solo dove davanti non c'è altra acqua (come nel disegno classico, dove la casella davanti li copriva)
function fWaterTile(x,y){const z=ZZ,lava=z.pool==='#ff6a1a',col=z.pool||(Zk==='peaks'?'#bfe3f5':'#3b86d6'),f=(lava?1.05:.9)+Math.sin(t*2+x+y)*(Zk==='peaks'?.02:.08);
  if(!(M[y+1]&&M[y+1][x]===2))poly([PX(x,y+1),PY(x,y+1,-3),PX(x+1,y+1),PY(x+1,y+1,-3),PX(x+1,y+1),PY(x+1,y+1,-9),PX(x,y+1),PY(x,y+1,-9)],sh(col,.78*f));
  if(M[y][x+1]!==2)poly([PX(x+1,y),PY(x+1,y,-3),PX(x+1,y+1),PY(x+1,y+1,-3),PX(x+1,y+1),PY(x+1,y+1,-9),PX(x+1,y),PY(x+1,y,-9)],sh(col,.58*f));
  poly([PX(x,y),PY(x,y,-3),PX(x+1,y),PY(x+1,y,-3),PX(x+1,y+1),PY(x+1,y+1,-3),PX(x,y+1),PY(x,y+1,-3)],sh(col,f));if(SET.ultra)waterFx(x,y,lava)}
/* ---- il giro delle caselle visibili, dal fondo verso lo schermo, con i personaggi infilati al punto giusto ---- */
function fastTiles(by,vx,vy0,vy1){const st=FAST.st,spr=FAST.spr,k=FAST.k,fr=FAST.frame,pd=P.px+P.py,pm=P.px-P.py,vis=FAST.vis;vis.length=0;
  for(let d=0;d<2*N-1;d++){const xa=Math.max(0,d-N+1),xb=Math.min(d,N-1);
    for(let x=xa;x<=xb;x++){const y=d-x,ex=PX(x,y)-camX,ey=PY(x,y,0)-camY;if(!(Math.abs(ex)<vx&&ey>-vy1&&ey<vy0+40))continue;
      const i=y*N+x;let s=st[i];if(FAST.wo[i]===fr&&M[y][x]===2)fWaterTile(x,y);
      if(s===0){if(fBudget())s=fTimed(fClass,i);else{fDirect(x,y,pd,pm);FAST.stats.dir++;continue}}
      if(s===1)continue;
      const c=M[y][x];let a=0;if(c===1||c===3||(c===6&&'rlSsWwFK'.includes(DEC[y][x]))){const dd=(x+y)-pd;if(dd>0&&dd<5.5&&Math.abs((x-y)-pm)<3.5)a=1}
      if(s!==2){if(a)g.globalAlpha=.35;fObj(x,y);if(a)g.globalAlpha=1;FAST.stats.live++;continue}
      // figurina da fare (o da rifare alla scala nuova): si prepara a fine fotogramma; intanto si disegna dal vivo (o la vecchia, allargata)
      let sp=spr[i];if(!sp||sp.k!==k){if(!FAST.qm[i]){FAST.qm[i]=1;FAST.q.push(i)}if(!sp){if(a)g.globalAlpha=.35;fObj(x,y);if(a)g.globalAlpha=1;FAST.stats.live++;continue}}
      if(FAST.sn[i]!==fSnap(x,y)){fRedo(i);if(a)g.globalAlpha=.35;fObj(x,y);if(a)g.globalAlpha=1;continue}
      FAST.seen[i]=fr;sp.pg.lu=fr;vis.push(i);if(a)g.globalAlpha=.35;g.drawImage(sp.pg.c,sp.sx,sp.sy,sp.w,sp.h,sp.ox/sp.k,sp.oy/sp.k,sp.w/sp.k,sp.h/sp.k);if(a)g.globalAlpha=1;FAST.stats.spr++;
      const L=FAST.li[i];if(L){if(L.n&&NK>.02)for(const q of L.n)nlight.apply(null,q);if(L.g&&SET.ultra)for(const q of L.g)GLOW.push(q)}}
    if(by[d])by[d].sort((a,b)=>a.py-b.py).forEach(ent)}
  fValidate();fFlushQ()}
// le figurine nuove si scrivono nei fogli tutte insieme, dopo aver disegnato il fotogramma: scrivere in un foglio da cui si è appena
// copiato costringe il browser a duplicarlo, e farlo una volta sola per fotogramma invece che a ogni figurina evita gli scatti
function fFlushQ(){const q=FAST.q;if(!q.length)return;let j=0;
  for(;j<q.length&&fBudget();j++){const i=q[j];FAST.qm[i]=0;if(FAST.st[i]!==2)continue;const sp=FAST.spr[i];if(sp&&sp.k===FAST.k)continue;fTimed(fRender,i)}
  if(j)q.splice(0,j);if(q.length>4000){for(const i of q)FAST.qm[i]=0;q.length=0}}
// casella non ancora esaminata (budget del fotogramma finito): disegnata dal vivo come una volta
function fDirect(x,y,pd,pm){const c=M[y][x];if(c===9||c===4||c===8||(c===0&&!DEC[y][x]))return;let a=0;
  if(c===1||c===3||(c===6&&'rlSsWwFK'.includes(DEC[y][x]))){const dd=(x+y)-pd;if(dd>0&&dd<5.5&&Math.abs((x-y)-pm)<3.5)a=1}
  if(a)g.globalAlpha=.35;fObj(x,y);if(a)g.globalAlpha=1}
// controllo continuo: qualche figurina visibile a ogni fotogramma viene riesaminata; se il suo disegno è cambiato si rifà
function fValidate(){const vis=FAST.vis;if(!vis.length)return;const n=Math.min(vis.length,24);
  for(let j=0;j<n;j++){FAST.vi=(FAST.vi+1)%vis.length;const i=vis[FAST.vi],x=i%N,y=i/N|0;
    const a=fProbe(x,y,0);if((a.hg>>>0)!==FAST.hg[i]||(a.hc>>>0)!==FAST.hc[i])fRedo(i)}}
function fRedo(i){if(FAST.thr[i]<255)FAST.thr[i]++;FAST.st[i]=0;FAST.spr[i]=null}
// rifare tutto (cambio di impostazioni, di zona o di pavimento)
function fastFlush(){FAST.zk=null}
