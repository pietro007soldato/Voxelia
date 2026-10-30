
'use strict';
/* ================= utilità ================= */
const $=i=>document.getElementById(i),cv=$('c'),G0=cv.getContext('2d'),mmc=$('mm'),mm=mmc.getContext('2d');let g=G0;
let R=Math.random;
const ri=(a,b)=>a+Math.floor(R()*(b-a+1)),pk=a=>a[Math.floor(R()*a.length)];
const hh=(x,y)=>{let n=Math.sin(x*127.1+y*311.7)*43758.5;return n-Math.floor(n)};
const sd=a=>()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hs=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};

/* ================= stato globale ================= */
const GAME_VER='7.50';
let GLOW=[],IT=null;const KEYS={};
let W=0,H=0,DPR=1,S=1,M,N,Zk,ZZ,DEC,BM,ents=[],P=null,fx=[],pop=[],PJ=[],parts=[],t=0,DF,started=0,PM=0,PA=null,camX=0,camY=0,last=0,acc=0,eid=0,inMenu=1,mt0=0,lc=null,FC=null,MC=null,fpsN=0,fpsT=0,bossT=0,saveT=0,TB=[];

/* ================= impostazioni ================= */
const SETD={lang:'it',rk:'v',rw:1,oldbar:0,mv:.8,mu:.5,sf:.7,muOn:1,q:2,rs:1,part:1,shad:1,light:1,sky:1,ultra:0,dmg:1,names:1,mini:1,fps:0,wasd:1,cur:0,curc:'oro',curs:2,curx:1,ivs:'new',ivf:'all',cine:1,cinecam:1,fpsmax:0,vsync:1,mapt:0,fast:1,hudsnap:1,film:1,tch:0,tsz:100,tlh:0,tvib:1,tauto:1};
const SET=Object.assign({},SETD,LS.get('voxelia_set',{}));
// Preimpostazioni grafiche: Bassa, Media, Alta, Ultra
const QP=[{rs:.6,part:0,shad:0,light:0,sky:0,ultra:0},{rs:.8,part:1,shad:1,light:0,sky:1,ultra:0},{rs:1,part:1,shad:1,light:1,sky:1,ultra:0},{rs:1,part:1,shad:1,light:1,sky:1,ultra:1}];
function rs(){W=innerWidth;H=innerHeight;DPR=Math.min(2,window.devicePixelRatio||1)*SET.rs;cv.width=Math.max(1,W*DPR|0);cv.height=Math.max(1,H*DPR|0);lc=null;FC=null}

/* ================= rendering voxel isometrico ================= */
const PX=(x,y)=>(x-y)*32,PY=(x,y,z)=>(x+y)*16-z,cc={};
const SHM=new Map();
function sh(c,f){let o=SHM.get(c);if(!o){o=[];SHM.set(c,o)}const q=(f*50|0)+64;let r=o[q];if(r===undefined){r=o[q]=shC(c,f)}return r}
function shC(c,f){if(c.length==4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];const k=c+(f*50|0);if(cc[k])return cc[k];const n=parseInt(c.slice(1),16),m=v=>Math.min(255,v*f|0);return cc[k]=`rgb(${m(n>>16)},${m(n>>8&255)},${m(n&255)})`}
function poly(p,c){if(SET.fast!==0&&polyX(p,c))return;g.fillStyle=g.strokeStyle=c;g.lineWidth=1;g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.closePath();g.fill();g.stroke()}
// 7.4: invece di riempire e poi ripassare il bordo (il bordo serve a non lasciare fessure tra le facce), si riempie una sola volta
// il poligono allargato di mezzo pixel: stesso aspetto, circa metà del lavoro. Solo per poligoni convessi; gli altri come prima.
const PXB=new Float64Array(32);
function polyX(p,c){const n=p.length>>1;if(n<3||n>16)return false;let s=0;for(let i=0,j=n-1;i<n;j=i++)s+=p[2*j]*p[2*i+1]-p[2*i]*p[2*j+1];if(s<1e-9&&s>-1e-9)return true;const o=s>0?1:-1;
  let cx=p[0],cy=p[1],ax=cx-p[2*n-2],ay=cy-p[2*n-1],la=Math.sqrt(ax*ax+ay*ay);if(la<1e-9)return false;
  for(let i=0;i<n;i++){const k=i+1<n?2*i+2:0,nx=p[k],ny=p[k+1],bx=nx-cx,by=ny-cy,lb=Math.sqrt(bx*bx+by*by),cr=ax*by-ay*bx;
    if(o>0?cr<-1e-9:cr>1e-9)return false;if(lb<1e-9)return false;
    // normali esterne dei due lati, punto d'incontro dei lati spostati di mezzo pixel (spigolo vivo, con un limite)
    const n1x=ay/la*o,n1y=-ax/la*o,n2x=by/lb*o,n2y=-bx/lb*o,d=1+n1x*n2x+n1y*n2y,f=.5/(d>.25?d:.25);PXB[2*i]=cx+(n1x+n2x)*f;PXB[2*i+1]=cy+(n1y+n2y)*f;
    ax=bx;ay=by;la=lb;cx=nx;cy=ny}
  g.fillStyle=c;g.beginPath();g.moveTo(PXB[0],PXB[1]);for(let i=1;i<n;i++)g.lineTo(PXB[2*i],PXB[2*i+1]);g.closePath();g.fill();return true}
function box(x,y,z,w,d,h,c,f=1){const T=z+h,ax=PX(x,y),ay=PY(x,y,T),bx=PX(x+w,y),by=PY(x+w,y,T),cx=PX(x+w,y+d),cy=PY(x+w,y+d,T),dx=PX(x,y+d),dy=PY(x,y+d,T);
if(h>0){poly([dx,dy,cx,cy,cx,cy+h,dx,dy+h],sh(c,.78*f));poly([bx,by,cx,cy,cx,cy+h,bx,by+h],sh(c,.58*f))}poly([ax,ay,bx,by,cx,cy,dx,dy],sh(c,f))}
function drawL(L,x,y,zo,white){for(const b of L)box(x+b[0],y+b[1],b[2]+zo,b[3],b[4],b[5],white?'#ffffff':b[6])}
function label(s,x,y,c){if(g===G0&&SET.fast!==0&&labelC(s,x,y,c))return;g.lineWidth=3;g.strokeStyle='#000';g.fillStyle=c||'#fff';g.strokeText(s,x,y);g.fillText(s,x,y)}
// 7.4: le scritte con il bordo (nomi, fumetti, punti esclamativi) si preparano una volta come immagine e poi si copiano allineate ai pixel:
// ridisegnare il contorno delle lettere a ogni fotogramma è una delle operazioni più lente per la scheda grafica
const LBC=new Map();let LBk=0,LBt=0;
function labelC(s,x,y,c){if(g.textBaseline!=='alphabetic')return false;const m=g.getTransform();if(m.b||m.c||m.a<=0||Math.abs(m.a-m.d)>1e-6)return false;const k=m.a,now=performance.now();
  if(Math.abs(k-LBk)>1e-6){LBk=k;LBt=now}if(now-LBt<250)return false;  // durante lo zoom si scrive normalmente
  const f=g.font,al=g.textAlign,key=f+'|'+al+'|'+(c||'#fff')+'|'+k.toFixed(4)+'|'+s;let e=LBC.get(key);
  if(!e){if(LBC.size>700)LBC.clear();const cv=document.createElement('canvas'),q=cv.getContext('2d');q.font=f;const mt=q.measureText(s),fs=+(/(\d+(?:\.\d+)?)px/.exec(f)||[0,11])[1];
    const asc=Math.ceil(Math.max(mt.actualBoundingBoxAscent||0,fs))+3,des=Math.ceil(Math.max(mt.actualBoundingBoxDescent||0,fs*.3))+3,L=Math.ceil(Math.max(0,mt.actualBoundingBoxLeft||0))+3,R=Math.ceil(Math.max(mt.width,mt.actualBoundingBoxRight||0))+3,w=L+R;
    cv.width=Math.max(1,Math.ceil(w*k));cv.height=Math.max(1,Math.ceil((asc+des)*k));q.setTransform(k,0,0,k,0,0);q.font=f;q.textAlign='left';q.lineWidth=3;q.strokeStyle='#000';q.fillStyle=c||'#fff';q.strokeText(s,L,asc);q.fillText(s,L,asc);
    e={cv,ax:al==='center'?L+mt.width/2:al==='right'||al==='end'?L+mt.width:L,ay:asc};LBC.set(key,e)}
  const X=Math.round((x-e.ax)*k+m.e),Y=Math.round((y-e.ay)*k+m.f);g.drawImage(e.cv,(X-m.e)/k,(Y-m.f)/k,e.cv.width/k,e.cv.height/k);return true}

/* ================= audio: effetti e musica procedurale ================= */
const AU={ac:null,want:'',tr:'',nt:0,st:0,bar:0,sw:0};
function auInit(){
  if(AU.ac){if(AU.ac.state==='suspended')AU.ac.resume().catch(()=>{});return}
  try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const ac=AU.ac=new A();
    AU.mg=ac.createGain();AU.mg.connect(ac.destination);AU.mu=ac.createGain();AU.mu.connect(AU.mg);AU.fd=ac.createGain();AU.fd.connect(AU.mu);AU.sf=ac.createGain();AU.sf.connect(AU.mg);
    const nb=AU.nb=ac.createBuffer(1,ac.sampleRate*.5|0,ac.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    auVol();AU.tr=AU.want;setInterval(sched,25)}catch(e){AU.ac=null}}
function auVol(){if(!AU.ac)return;AU.mg.gain.value=SET.mv;AU.sf.gain.value=SET.sf;AU.mu.gain.value=SET.muOn?SET.mu:0}
function music(n){if(AU.want===n)return;AU.want=n;const ac=AU.ac;if(!ac){AU.tr=n;return}
  const t0=ac.currentTime;AU.fd.gain.cancelScheduledValues(t0);AU.fd.gain.setValueAtTime(AU.fd.gain.value,t0);AU.fd.gain.linearRampToValueAtTime(0,t0+.5);
  clearTimeout(AU.sw);AU.sw=setTimeout(()=>{AU.tr=AU.want;AU.bar=0;AU.st=0;AU.nt=0;const t2=ac.currentTime;AU.fd.gain.cancelScheduledValues(t2);AU.fd.gain.setValueAtTime(0,t2);AU.fd.gain.linearRampToValueAtTime(1,t2+.8)},550)}
function note(m,t0,d,type,v,a=.01,dest){const ac=AU.ac,o=ac.createOscillator(),gn=ac.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(m-69)/12);
  gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+a);gn.gain.exponentialRampToValueAtTime(.0001,t0+Math.max(d,a+.02));o.connect(gn);gn.connect(dest||AU.fd);o.start(t0);o.stop(t0+d+.05)}
function nz(t0,d,v,f,tp,dest){const ac=AU.ac,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),gn=ac.createGain();s.buffer=AU.nb;fl.type=tp;fl.frequency.value=f;
  gn.gain.setValueAtTime(v,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(fl);fl.connect(gn);gn.connect(dest||AU.fd);s.start(t0,Math.random()*.3);s.stop(t0+d+.02)}
function kick(t0,v){const ac=AU.ac,o=ac.createOscillator(),gn=ac.createGain();o.frequency.setValueAtTime(130,t0);o.frequency.exponentialRampToValueAtTime(40,t0+.12);
  gn.gain.setValueAtTime(v,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+.2);o.connect(gn);gn.connect(AU.fd);o.start(t0);o.stop(t0+.22)}
const SCL={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],phr:[0,1,4,5,7,8,10],hm:[0,2,3,5,7,8,11],lyd:[0,2,4,6,7,9,11]};
// Ogni brano: tempo, tonica, scala, giro di accordi, strumento solista, densità della melodia, batteria
const TRK={
  menu:{bpm:88,root:50,sc:'maj',pr:[0,5,3,4],ld:'square',dn:.5,arp:1,dr:0,pad:1},
  town:{bpm:100,root:53,sc:'maj',pr:[0,3,4,0,5,3,1,4],ld:'triangle',dn:.6,dr:1,bs:[0,6,8,12]},
  forest:{bpm:104,root:50,sc:'dor',pr:[0,6,3,0],ld:'triangle',dn:.55,arp:1,dr:1},
  desert:{bpm:94,root:52,sc:'phr',pr:[0,1,0,6],ld:'square',dn:.45,dr:1,bs:[0,3,8,11]},
  peaks:{bpm:72,root:49,sc:'min',pr:[0,5,2,6],ld:'sine',dn:.35,arp:1,dr:0,pad:1},
  inter:{bpm:126,root:55,sc:'maj',pr:[0,4,5,3],ld:'triangle',dn:.6,spb:12,bs:[0],waltz:1},
  dungeon:{bpm:80,root:45,sc:'min',pr:[0,0,5,4],ld:'triangle',dn:.28,dr:2,pad:1},
  arena:{bpm:136,root:47,sc:'hm',pr:[0,5,3,4],ld:'square',dn:.62,dr:3,bs:[0,3,6,8,11,14]},
  boss:{bpm:150,root:45,sc:'hm',pr:[0,1,0,4],ld:'sawtooth',dn:.66,dr:3,bs:[0,2,4,6,8,10,12,14]}
};
function sched(){const ac=AU.ac,T=TRK[AU.tr];if(!ac||!T||ac.state!=='running')return;const spb=T.spb||16,dt=60/T.bpm/4;
  if(AU.nt<ac.currentTime)AU.nt=ac.currentTime+.06;
  while(AU.nt<ac.currentTime+.16){mstep(T,AU.st,AU.bar,AU.nt,dt,spb);AU.nt+=dt;if(++AU.st>=spb){AU.st=0;AU.bar++}}}
function mstep(T,s,b,t0,dt,spb){if(T.sng){songStep(T,s,b,t0,dt,spb);return}const sc=SCL[T.sc],deg=T.pr[b%T.pr.length],mid=k=>T.root+sc[((k%7)+7)%7]+12*Math.floor(k/7),cn=i=>mid(deg+i*2);
  if(T.pad&&s==0)for(let i=0;i<3;i++)note(cn(i)+12,t0,dt*spb*.98,'sine',.018,.25);
  const bs=T.bs||[0,8];if(bs.includes(s))note(cn(0)-12,t0,dt*(spb==12?4:3),'triangle',.09);
  if(T.waltz&&(s==4||s==8))for(let i=0;i<3;i++)note(cn(i),t0,dt*2,'triangle',.022);
  if(T.arp&&s%2==0)note(cn((s>>1)%3)+24,t0,dt*1.6,'triangle',.016);
  if(s%2==0){const r=sd(hs(AU.tr)+(b%4)*977+((b>>2)&1)*7919+s*131),a=r(),c=r(),e=r();
    if(a<T.dn&&!(b%8==7&&s>=spb/2)){const k=s%4==0?deg+2*Math.floor(c*3):deg+Math.floor(c*7)-1;note(mid(k)+12,t0,dt*(2+Math.floor(e*3)),T.ld,T.ld=='square'||T.ld=='sawtooth'?.02:.045)}}
  if(T.dr==1){if(s==0||s==8)kick(t0,.16);if(s%4==2)nz(t0,.03,.03,8000,'highpass')}
  else if(T.dr==2){if(s==0)kick(t0,.2);if(s==10&&b%2)kick(t0,.12);if(s==6)nz(t0,.08,.025,3000,'bandpass')}
  else if(T.dr==3){if(s==0||s==8||s==10)kick(t0,.24);if(s==4||s==12)nz(t0,.12,.09,1800,'bandpass');if(s%2==0)nz(t0,.03,.035,8000,'highpass')}}
function tone(f,d,tp='square',v=.05){const ac=AU.ac;if(!ac)return;try{const t0=ac.currentTime,o=ac.createOscillator(),gn=ac.createGain();o.type=tp;o.frequency.setValueAtTime(f,t0);gn.gain.setValueAtTime(v,t0);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(gn);gn.connect(AU.sf);o.start(t0);o.stop(t0+d+.02)}catch(e){}}
function jingle(ns,sp=.12,tp='square'){const ac=AU.ac;if(!ac)return;try{const t0=ac.currentTime;ns.forEach((m,i)=>{if(m)note(m,t0+i*sp,sp*1.8,tp,.05,.01,AU.sf)})}catch(e){}}
function whoosh(){const ac=AU.ac;if(!ac)return;try{nz(ac.currentTime,.35,.08,900,'bandpass',AU.sf)}catch(e){}}
