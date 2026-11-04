/* ================= 7.15: LA VISTA 3D =================
   Lo stesso gioco, in vero 3D: si passa dalla vista classica alla vista 3D in qualsiasi momento (tasto B, il pulsante in
   alto o le impostazioni) e la partita continua uguale. Non ci sono modelli nuovi: il gioco disegna tutto con
   box(x,y,z,w,d,h,colore) e qui quelle chiamate diventano solidi WebGL. Ma sono resi come oggetti veri:
   - luce del sole che segue l'ora del giorno, cielo con nuvole, stelle di notte, ombre proiettate dal sole;
   - 7.27: stile VOXEL (predefinito): facce nette con lo spigolo scuro di ogni cubo, la grana a cubetti di ogni materiale
     e i fili d'erba fatti di cubetti; nelle opzioni si torna allo stile liscio;
   - spigoli arrotondati nello stile liscio (la luce scivola sui bordi come su legno, pietra e metallo veri), superfici con la loro grana:
     erba, pietra, legno, sabbia, neve, metallo lucido, e l'acqua che si muove e riflette il cielo;
   - di notte e nei sotterranei le torce, le lanterne e i bracieri illuminano davvero ciò che hanno intorno;
   - fili d'erba mossi dal vento;
   - attorno a ogni zona all'aperto il mondo continua fino all'orizzonte: campi, boschi, dune, laghi e catene di montagne
     innevate, sfumati dalla foschia, così ogni luogo è un pezzo di un regno enorme.
   La telecamera segue l'eroe da dietro: tasto destro del mouse (o due dita) per girarla, rotellina per avvicinarla.
   WASD e la levetta si muovono rispetto alla telecamera; clic per camminare, attaccare, parlare, come sempre.
   Nei filmati, durante la pesca, la navigazione e le battaglie del mare il gioco torna da solo alla vista classica. */
const D3=Object.assign({on:0,q:2,sh:1,gr:1,far:1,sens:1,inv:0,seen:0,vx:1,rsc:1,fsr:0,shp:.5,fov:57,fog:1,shr:0,nl:12},LS.get('voxelia_3d',{}),
  {gl:null,ok:null,act:0,yaw:Math.PI/4,pitch:.62,dist:13,cam:null,tgt:null,zk:null,M:null,FC:null,ch:new Map(),bd:null,lt:[],labs:[],t:0,rr:0,drag:null,
   vp:null,V:null,P:null,ew:[0,0,0],cw:[0,0,0],sk:null,cv:null,f:0});
if(LS.get('voxelia_3d',null)===null&&typeof TOUCH!=='undefined'&&TOUCH)D3.q=1;
const d3Save=()=>LS.set('voxelia_3d',{on:D3.on,q:D3.q,sh:D3.sh,gr:D3.gr,far:D3.far,sens:D3.sens,inv:D3.inv,seen:D3.seen,vx:D3.vx,rsc:D3.rsc,fsr:D3.fsr,shp:D3.shp,fov:D3.fov,fog:D3.fog,shr:D3.shr,nl:D3.nl});
const D3TS=1.6,D3ZS=.05,D3CS=16;   // 1 casella = 1,6 m; 1 pixel d'altezza = 5 cm; pezzi di 16×16 caselle
// la vista 3D vale solo nella partita e non durante pesca, mare, battaglie, editor e realtà virtuale
const d3Want=()=>!!(D3.on&&started&&P&&M&&D3.ok!==false&&!(typeof XR!=='undefined'&&XR.s)&&!(NAV&&Zk==='mare')&&!(FSH&&PM==='fish')&&PM!=='dig'&&PM!=='duel'&&
  !(typeof EDIT!=='undefined'&&EDIT)&&!(typeof TOUR!=='undefined'&&TOUR)&&!(typeof OCC!=='undefined'&&OCC&&OCC.intro)&&!(typeof WAR!=='undefined'&&WAR&&ZZ&&ZZ.war));

/* ---- registrare i disegni del gioco: box con colore, bagliore e materiale ---- */
let D3B=null,D3E=null,D3CTX=0;   // box registrate (10 valori: x,y,z,w,d,h,r,g,b,bagliore), entità corrente, materiale imposto
const D3G=Object.create(REC);
// 7.42: quello che in 2D si disegna dopo, in 3D vince sulle facce allineate (niente più tremolio di tetti, finestre, facce)
function d3Rk(B,n0,base,neg,len){if(!B.rk)B.rk=[];while(B.rk.length<n0/10)B.rk.push(0);const n=(len==null?B.length-n0:len)/10,cap=neg?31:15;for(let j=0;j<n;j++){const r=base+Math.min(j,cap)+1;B.rk.push(neg?-r:r)}}
const _box715=box;box=function(x,y,z,w,d,h,c,f){if(D3B){if(D3G.globalAlpha<.12||!(w>0)||!(d>0))return;const k=x3Col(c);D3B.push(x,y,z,w,d,Math.max(0,h),k[0],k[1],k[2],(f===undefined?1:f)+D3CTX*10);if(D3G.globalAlpha<.9)(D3B.al||(D3B.al=[]))[D3B.length/10-1]=D3G.globalAlpha<.4?2:1;return}_box715(x,y,z,w,d,h,c,f)};
const _rbox715=rbox;rbox=function(x,y,z,w,d,h,c,ca,sa,ox,oy){if(!D3B){_rbox715(x,y,z,w,d,h,c,ca,sa,ox,oy);return}if(D3G.globalAlpha<.12||!(w>0)||!(d>0))return;
  const u=x+w/2,v=y+d/2,k=x3Col(c);D3B.push(ox+u*ca-v*sa-w/2,oy+u*sa+v*ca-d/2,z,-w,d,Math.max(0,h),k[0],k[1],k[2],1+D3CTX*10);if(D3G.globalAlpha<.9)(D3B.al||(D3B.al=[]))[D3B.length/10-1]=D3G.globalAlpha<.4?2:1};
// le scritte sopra le teste (nomi, «!», «★ Campione»): si ricordano con la loro altezza e si scrivono sopra la vista 3D
const _label715=label;label=function(s,x,y,c){if(D3B&&D3E){D3.labs.push([D3E,s,PY(D3E.px,D3E.py,0)-y,c||'#fff',g.font]);return}_label715(s,x,y,c)};
function d3Rec(fn,fix,tt){const og=g,ot=t,onl=nlight,gl=GLOW.length,B=[];let rnd=0;D3B=B;g=D3G;D3G.globalAlpha=1;D3G.font='bold 11px Georgia,serif';
  if(fix){t=tt;Math.random=()=>{rnd=1;return .999}}nlight=function(){};
  try{fn()}catch(e){}finally{D3B=null;g=og;nlight=onl;if(fix){t=ot;Math.random=MRND}if(GLOW.length>gl)GLOW.length=gl;D3G.globalAlpha=1}
  B.rnd=rnd;return B}
const d3Hash=B=>{let h=2166136261;for(let i=0;i<B.length;i++)h=Math.imul(h^(Math.round(B[i]*16)|0),16777619);return h>>>0};

/* ---- i materiali: dal colore e da dove si trova la box ----
   0 normale · 1 foglie ed erba · 2 pietra · 3 legno · 4 metallo · 5 acqua · 6 luce · 7 pelle e stoffa · 8 sabbia · 9 neve · 10 terra · 11 fili d'erba · 12 lava */
function d3Mat(r,g,b,f,ctx){if(ctx===5)return r>g*1.4&&r>b*1.6?12:5;if(ctx===11)return 11;if(f>1.16)return 6;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),s=mx-mn,l=(mx+mn)/510;
  if(r>=mx-2&&g>110&&b<g*.6&&s>70&&l>.35&&g>r*.62)return 4;          // oro e ottone
  if(g>r+10&&g>=b)return 1;
  if(s<26){if(l>.86)return ctx===2?9:7;return ctx===3?4:2}            // grigi: pietra (sui personaggi, metallo)
  if(r>g&&g>b){if(ctx===2)return l>.52?8:10;if(ctx===3&&l>.5)return 7;return l<.5?3:7}
  if(b>r&&b>g&&ctx===2)return 2;
  return ctx===3?7:0}

/* ---- dalle box ai vertici: 24 byte per vertice (posizione, colore e materiale, normale, coordinate della faccia) ---- */
const D3BUF={b:new ArrayBuffer(1<<22),i:new Uint32Array(1<<19)};
function d3Grow(nv,ni){if(D3BUF.b.byteLength<nv*24){let s=D3BUF.b.byteLength;while(s<nv*24)s*=2;D3BUF.b=new ArrayBuffer(s)}if(D3BUF.i.length<ni){let s=D3BUF.i.length;while(s<ni)s*=2;D3BUF.i=new Uint32Array(s)}}
const D3FC=[[4,5,6,7,0,1,0],[3,2,6,7,0,0,1],[0,1,5,4,0,0,-1],[1,2,6,5,1,0,0],[0,3,7,4,-1,0,0],[0,1,2,3,0,-1,0]];
function d3Mesh(B,ctx0){let nf=0;for(let i=0;i<B.length;i+=10)nf+=B[i+5]>0?(B[i+2]>4?6:5):1;d3Grow(nf*4,nf*6);
  const F=new Float32Array(D3BUF.b),U=new Uint8Array(D3BUF.b),I8=new Int8Array(D3BUF.b),IX=D3BUF.i;let v=0,ix=0;const C=new Array(8);
  for(let i=0;i<B.length;i+=10){const x=B[i],y=B[i+1],z=B[i+2],ro=B[i+3]<0,w=Math.abs(B[i+3]),d=B[i+4],h=B[i+5],fr=B[i+9],ctx=Math.floor(fr/10)||ctx0||0,fl=fr-Math.floor(fr/10)*10;
    const rk0=(B.rk&&B.rk[i/10])||0,al=(B.al&&B.al[i/10])||0,rk=(rk0<0?-1:1)*(Math.abs(rk0)+33*al),m=d3Mat(B[i+6],B[i+7],B[i+8],fl,ctx),cr=Math.min(255,B[i+6]*(m===6?1:Math.min(fl,1.15))),cg=Math.min(255,B[i+7]*(m===6?1:Math.min(fl,1.15))),cb=Math.min(255,B[i+8]*(m===6?1:Math.min(fl,1.15)));
    const cx=x+w/2,cy=y+d/2;
    for(let k=0;k<8;k++){const qx=k&1^(k>>1&1),qy=k>>1&1,qz=k>>2;let px,py;if(ro){const a=(qx-.5)*w,c=(qy-.5)*d;px=cx+(a-c)*Math.SQRT1_2;py=cy+(a+c)*Math.SQRT1_2}else{px=x+qx*w;py=y+qy*d}C[k]=[px,py,z+qz*h]}
    const nfc=h>0?(z>4?6:5):1;
    for(let f=0;f<nfc;f++){const q=D3FC[f];let nx=q[4],ny=q[5],nz=q[6];
      if(ro&&f>0&&f<5){const a=C[q[0]],b=C[q[1]],ex=(b[0]-a[0]),ey=(b[1]-a[1]);let ux=ey,uy=-ex;const L=Math.hypot(ux,uy)||1;ux/=L;uy/=L;const mx2=(C[q[0]][0]+C[q[2]][0])/2-cx,my2=(C[q[0]][1]+C[q[2]][1])/2-cy;if(ux*mx2+uy*my2<0){ux=-ux;uy=-uy}nx=ux;ny=0;nz=uy}
      // nel mondo: x→X, altezza→Y, y→Z; normale (nx, ny, nz) già in (X, Y, Z)
      const vert=Math.abs(ny)<.5;let tx,tz,ty=0;if(vert){tx=nz;tz=-nx;const L=Math.hypot(tx,tz)||1;tx/=L;tz/=L}else{tx=1;tz=0}
      const W=[],P=[];for(let j=0;j<4;j++){const c=C[q[j]],X=c[0]*D3TS,Y=c[2]*D3ZS,Z=c[1]*D3TS;P.push([X*tx+Z*tz,vert?Y:Z])}
      let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;for(const p of P){u0=Math.min(u0,p[0]);u1=Math.max(u1,p[0]);v0=Math.min(v0,p[1]);v1=Math.max(v1,p[1])}
      const Wm=u1-u0,Hm=v1-v0,nob=(ro&&!vert)||m===11||m===5||m===12||Wm>25||Hm>25,WW=nob?255:Math.max(1,Math.round(Wm*10)),HH=nob?255:Math.max(1,Math.round(Hm*10));
      for(let j=0;j<4;j++){const c=C[q[j]],o=v*24,o4=o>>2;F[o4]=c[0];F[o4+1]=c[1];F[o4+2]=c[2];U[o+12]=cr;U[o+13]=cg;U[o+14]=cb;U[o+15]=m;
        I8[o+16]=Math.round(nx*127);I8[o+17]=Math.round(ny*127);I8[o+18]=Math.round(nz*127);I8[o+19]=rk;
        U[o+20]=Wm>0?Math.round((P[j][0]-u0)/Wm*255):0;U[o+21]=Hm>0?Math.round((P[j][1]-v0)/Hm*255):0;U[o+22]=WW;U[o+23]=HH;v++}
      const b0=v-4;IX[ix++]=b0;IX[ix++]=b0+1;IX[ix++]=b0+2;IX[ix++]=b0;IX[ix++]=b0+2;IX[ix++]=b0+3}}
  return{nv:v,ni:ix}}
function d3Upload(gl,o,B,ctx,dyn){const r=d3Mesh(B,ctx);if(!o)o={vb:gl.createBuffer(),ib:gl.createBuffer(),n:0};const us=dyn?gl.STREAM_DRAW:gl.STATIC_DRAW;
  gl.bindBuffer(gl.ARRAY_BUFFER,o.vb);gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(D3BUF.b,0,r.nv*24),us);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,D3BUF.i.subarray(0,r.ni),us);o.n=r.ni;return o}
function d3Free(o){const gl=D3.gl;if(o&&gl){gl.deleteBuffer(o.vb);gl.deleteBuffer(o.ib)}}

/* ---- gli shader ---- */
const D3NOISE=`float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb(vec3 p){return vn(p)*.55+vn(p*2.03)*.28+vn(p*4.1)*.17;}`;
const D3VS=`uniform mat4 VP,LM;uniform float TM;in vec3 a;in vec4 c;in vec4 n;in vec4 l;out vec3 wp;out vec4 vc;out vec3 vn3;out vec4 vl;out vec4 ls;out float vk;out float va;
void main(){vec3 w=vec3(a.x*${D3TS},a.z*${D3ZS},a.y*${D3TS});float m=floor(c.a*255.+.5);
 if(m==11.){float s=sin(TM*2.1+w.x*.9+w.z*.6)+.5*sin(TM*3.3+w.x*2.1);w.xz+=vec2(.07,.04)*s*l.y;}
 wp=w;vc=c;vn3=n.xyz;vl=l;ls=LM*vec4(w+n.xyz*.06,1.);vk=n.w;float rv=floor(abs(n.w)*127.+.5),al=floor(rv/33.);va=al;gl_Position=VP*vec4(w,1.);gl_Position.z-=(rv-al*33.)*(1.0e-4/127.)*gl_Position.w;}`;
const D3FS=`uniform vec3 SUN,SUNC,AU,AD,FOGC,CAM,HZC,HP;uniform float FOG0,FOG1,TM,SHON,LAN,VX;uniform highp sampler2DShadow SM;uniform vec4 PL[12];uniform vec3 PC[12];uniform int NP;uniform vec4 HL;
in vec3 wp;in vec4 vc;in vec3 vn3;in vec4 vl;in vec4 ls;in float vk;in float va;out vec4 o;
${D3NOISE}
float shd(){if(SHON<.5)return 1.;vec3 p=ls.xyz/ls.w*.5+.5;if(p.x<0.||p.y<0.||p.x>1.||p.y>1.||p.z>1.)return 1.;float s=0.;vec2 tx=vec2(1.)/vec2(textureSize(SM,0));
 for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++)s+=texture(SM,vec3(p.xy+vec2(i,j)*tx*1.2,p.z-.0015));return s/9.;}
void main(){vec3 base=vc.rgb;float m=floor(vc.a*255.+.5);vec3 N=normalize(vn3);bool vert=abs(N.y)<.5;
 // 7.42: fumo, fantasmi e cose semitrasparenti del 2D: una trama fine invece di un blocco pieno
 if(va>.5){vec2 f=floor(gl_FragCoord.xy);if(va<1.5){if(mod(f.x+f.y,2.)<1.)discard;}else if(mod(f.x,2.)+mod(f.y,2.)*2.>.5)discard;}
 // ciò che sta fra la telecamera e l'eroe si apre a trama fine, così l'eroe si vede sempre
 {vec3 cd=HP-CAM;float L=length(cd);vec3 dr=cd/L;float tt=dot(wp-CAM,dr);if(vk>-.004&&tt>.2&&tt<L-.7&&wp.y>HP.y-1.1){float r=length(wp-CAM-dr*tt),rad=1.25+.6*tt/L;if(r<rad){float k=smoothstep(rad,rad*.55,r);vec2 f=floor(gl_FragCoord.xy);if(k>.9||mod(f.x+f.y,2.)<1.||(k>.6&&mod(f.x,2.)<1.))discard;}}}
 vec3 T=vert?normalize(cross(vec3(0,1,0),N)):vec3(1,0,0);vec3 B=vert?vec3(0,1,0):vec3(0,0,1);
 // spigoli arrotondati: vicino ai bordi la normale si piega verso l'esterno
 float W=vl.z*25.5,H=vl.w*25.5,eg=1.;if(vl.z<.999&&vl.w<.999&&VX>.5){float u=vl.x*W,v=vl.y*H,e=min(min(u,W-u),min(v,H-v)),r=min(.045,.18*min(W,H));eg=mix(vert?.72:.82,1.,smoothstep(r*.25,r,e));}
 if(VX<.5&&vl.z<.999&&vl.w<.999){float u=vl.x*W,v=vl.y*H,r=min(.06,.32*min(W,H));if(r>.005){
   float eu=min(u,W-u),ev=min(v,H-v),ku=1.-smoothstep(0.,r,eu),kv=1.-smoothstep(0.,r,ev);N=normalize(N+T*(u<W*.5?-1.:1.)*ku*1.2+B*(v<H*.5?-1.:1.)*kv*1.2);}}
 // la grana dei materiali
 vec3 vc3=floor((wp-N*.012)*6.),p=VX>.5?(vc3+.5)/6.:wp;float spk=.04,shi=16.;
 if(VX>.5&&m!=5.&&m!=6.&&m!=12.&&m!=11.)base*=(.92+.12*h3(vc3*1.37+.5))*eg;
 if(m==1.){base*=.8+.32*fb(p*2.6)+.08*vn(p*22.);spk=.06;}
 else if(m==11.){base*=.8+.4*vl.y;spk=.02;N=normalize(vec3(0,1,0)+N*.25);}
 else if(m==2.){float c=fb(p*3.1);base*=.78+.3*c;base*=1.-.22*smoothstep(.47,.5,vn(p*7.))*smoothstep(.53,.5,vn(p*7.));spk=.08;shi=24.;}
 else if(m==3.){float g=sin(dot(p,vert?B:T)*28.+fb(p*3.)*9.);base*=.84+.1*g+.12*vn(p*12.);spk=.06;}
 else if(m==4.){base*=.88+.14*vn(p*vec3(40.,3.,40.));spk=1.1;shi=60.;}
 else if(m==7.){base*=.93+.1*vn(p*30.);spk=.05;}
 else if(m==8.){base*=.88+.16*vn(p*24.)+.06*sin(p.x*3.+p.z*2.+fb(p)*4.);spk=.05;}
 else if(m==9.){base*=.95+.06*vn(p*18.);spk=.5;shi=80.;}
 else if(m==10.){base*=.8+.3*fb(p*4.)+.06*vn(p*30.);spk=.03;}
 vec3 Vd=normalize(CAM-wp);
 if(m==5.||m==12.){vec2 q=p.xz;float t2=TM*.9;vec3 wn=normalize(vec3(.06*sin(q.x*2.3+t2*1.7)+.04*sin(q.y*3.1-t2*1.3+q.x),1.,.06*cos(q.y*2.7+t2*1.5)+.04*sin(q.x*3.7+t2)));N=wn;
   if(m==12.){float e=.6+.4*fb(vec3(q*1.4,TM*.4));o=vec4(base*1.15*e+vec3(.25,.08,0.)*e*e,1.);return;}}
 float sh=shd();
 float ao=vert&&m!=11.?mix(.62,1.,smoothstep(0.,.9,wp.y-HL.w)):1.;
 vec3 amb=mix(AD,AU,N.y*.5+.5)*ao;
 float ndl=max(dot(N,SUN),0.);
 vec3 col=base*(amb+SUNC*ndl*sh);
 for(int i=0;i<12;i++){if(i>=NP)break;vec3 d=PL[i].xyz-wp;float dd=length(d);float at=min(PL[i].w/(1.+dd*dd*.18),1.1);col+=base*PC[i]*(max(dot(N,d/max(dd,.001)),0.)*.85+.15)*at;}
 if(LAN>0.){vec3 d=HL.xyz-wp;float dd=length(d);col+=base*vec3(1.,.78,.5)*LAN*(max(dot(N,d/max(dd,.001)),0.)*.8+.2)/(1.+dd*dd*.09);}
 vec3 Hh=normalize(SUN+Vd);col+=SUNC*pow(max(dot(N,Hh),0.),shi)*spk*sh*(m==4.?base*1.6+.2:vec3(1.));
 if(m==4.){col+=AU*.25*pow(1.-max(dot(N,Vd),0.),2.)*base;}
 if(m==5.){float fr=pow(1.-max(dot(N,Vd),0.),3.);col=mix(base*(amb*.7+SUNC*.35),HZC,.2+.65*fr)+SUNC*pow(max(dot(N,Hh),0.),120.)*1.6*sh;}
 if(m==6.){col=base*1.25+vec3(.12);}
 // foschia: lontano tutto sfuma nel colore del cielo all'orizzonte
 float dd=length(CAM-wp),f=smoothstep(FOG0,FOG1,dd);f=f*(1.-.25*smoothstep(0.,120.,wp.y));
 col=mix(col,FOGC,f);
 col=min(col,vec3(1.6));col=col*(1.+.15*col)/(1.+.25*col);vec3 hi=max(col-.82,0.);col=min(col,vec3(.82))+hi/(1.+hi*3.);
 o=vec4(col,1.);}`;
const D3SKY_VS=`in vec2 a;out vec2 q;void main(){q=a;gl_Position=vec4(a,.9999,1.);}`;
const D3SKY_FS=`uniform mat4 IVP;uniform vec3 SUN,ZEN,HZC,SUNC;uniform float TM,NK,OUT;in vec2 q;out vec4 o;
${D3NOISE}
void main(){vec4 a=IVP*vec4(q,1.,1.),b=IVP*vec4(q,-1.,1.);vec3 d=normalize(a.xyz/a.w-b.xyz/b.w);
 if(OUT<.5){o=vec4(HZC,1.);return;}
 float y=d.y;vec3 c=mix(HZC,ZEN,pow(clamp(y,0.,1.),.55));if(y<0.)c=mix(HZC,HZC*.82,clamp(-y*4.,0.,1.));
 float s=max(dot(d,SUN),0.);c+=SUNC*(pow(s,700.)*3.+pow(s,24.)*.25)*(1.-NK*.8);
 if(y>0.){vec2 p=d.xz/(y+.08)*1.4+vec2(TM*.006,TM*.002);float cl=smoothstep(.5,.85,fb(vec3(p,TM*.004))*1.05+.08*vn(vec3(p*6.,0.)));
   vec3 cc=mix(vec3(1.),HZC,.25)*(1.-NK*.75);cc+=SUNC*.25*pow(s,6.);c=mix(c,cc,cl*smoothstep(0.,.18,y)*.85);
   if(NK>.05){vec3 sp=floor(d*260.);float st=step(.997,h3(sp))*smoothstep(.0,.3,y);c+=vec3(st)*NK*(1.-cl);}}
 o=vec4(c,1.);}`;
const D3SH_VS=`uniform mat4 LM;in vec3 a;void main(){gl_Position=LM*vec4(a.x*${D3TS},a.z*${D3ZS},a.y*${D3TS},1.);}`;
const D3SH_FS=`out vec4 o;void main(){o=vec4(1.);}`;
function d3Prog(gl,vs,fs,attrs){const p=gl.createProgram();
  for(const[tp,src]of[[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const s=gl.createShader(tp);gl.shaderSource(s,'#version 300 es\nprecision highp float;\nprecision highp int;\n'+src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('shader 3D: '+gl.getShaderInfoLog(s));gl.attachShader(p,s)}
  attrs.forEach((n,i)=>gl.bindAttribLocation(p,i,n));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('shader 3D: '+gl.getProgramInfoLog(p));
  const U={},nu=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<nu;i++){const k=gl.getActiveUniform(p,i).name.replace(/\[0\]$/,'');U[k]=gl.getUniformLocation(p,k)}return{p,U}}

/* ---- avvio di WebGL: una tela sotto quella del gioco, che resta sopra per le scritte e i clic ---- */
function d3Init(){if(D3.ok!=null)return D3.ok;try{const c=document.createElement('canvas');c.id='c3';c.setAttribute('aria-hidden','true');cv.parentNode.insertBefore(c,cv);D3.cv=c;
    const gl=c.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WebGL2 non disponibile');D3.gl=gl;
    D3.pr=d3Prog(gl,D3VS,D3FS,['a','c','n','l']);D3.sp=d3Prog(gl,D3SKY_VS,D3SKY_FS,['a']);D3.dp=d3Prog(gl,D3SH_VS,D3SH_FS,['a']);
    D3.vao=gl.createVertexArray();D3.svb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,D3.svb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    D3.dyn=null;D3.ok=true;c.addEventListener('webglcontextlost',e=>{e.preventDefault();D3.lost=1});c.addEventListener('webglcontextrestored',()=>{D3.ok=null;D3.lost=0;c.remove();d3Init();d3Reset()})}
  catch(e){console.warn(e);D3.ok=false;msg('La vista 3D non è disponibile su questo dispositivo: '+e.message)}return D3.ok}
function d3Shadow(){const gl=D3.gl,s=D3.shr?D3.shr:D3.q>=3?2048:1024;if(D3.smS===s)return;if(D3.smT){gl.deleteTexture(D3.smT);gl.deleteFramebuffer(D3.smF)}D3.smS=s;
  const t=D3.smT=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,s,s);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);
  const f=D3.smF=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,t,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null)}

/* ---- la zona: pezzi di 16×16 caselle, preparati una volta sola ---- */
function d3Reset(){for(const c of D3.ch.values())d3Free(c.o);D3.ch.clear();if(D3.bd){d3Free(D3.bd);D3.bd=null}D3.zk=Zk;D3.M=M;D3.N=N;D3.FC=FC;D3.lt=[];D3.full=0}
function d3Tile(x,y,S,D,L,G){const c=M[y][x];if(c===9)return;const h=HHc&&HHc.length===N*N?HHc[y*N+x]:hh(x,y);
  D3CTX=c===2?5:2;const fl=d3Rec(()=>{if(c===2){WMODE=1;try{floor(x,y,2,h)}finally{WMODE=0}}else if(c===0||c===4||c===8||c===6||(c===1&&openW(x,y)))floor(x,y,c===6?(RDF.has(y*N+x)?4:0):c===1?0:c,h)},1,0);D3CTX=0;
  for(const v of fl)S.push(v);
  const a=d3Rec(()=>fObj(x,y),1,0);
  // fili d'erba sul prato libero, all'aperto
  if(G&&!a.length&&c!==2&&fl.length>=10&&SKY[Zk]){const r=fl[6],gg=fl[7],b=fl[8];if(gg>r+8&&gg>b){const n=G;for(let i=0;i<n;i++){const k=hh(x*7.1+i*1.3,y*3.7+i*2.9),k2=hh(x*2.3+i*5.1,y*9.1+i),hgt=3+k*5,cm=.92+k2*.3,bx=x+.08+k*.84,by=y+.08+k2*.84;
      if(D3.vx){if(i%2===0)S.push(bx,by,fl[2]+fl[5],.06,.06,hgt*.7,r*cm*.95,gg*cm*1.08,b*cm*.8,1+110)}else for(let j=0;j<3;j++)S.push(bx+(j-1)*.03,by+(j%2)*.025,fl[2]+fl[5],.018,.018,hgt*(j===1?1.25:.85),r*cm*.95,gg*cm*1.05,b*cm*.8,1+110)}}}
  if(!a.length)return;const b=d3Rec(()=>fObj(x,y),1,.731);
  if(a.rnd||b.rnd||a.length!==b.length||d3Hash(a)!==d3Hash(b)){D.push(x,y);return}
  d3Rk(S,S.length,((x+y)&1)*16,0,a.length);for(let i=0;i<a.length;i+=10){if(a.al&&a.al[i/10])(S.al||(S.al=[]))[S.length/10]=a.al[i/10];S.push(a[i],a[i+1],a[i+2],a[i+3],a[i+4],a[i+5],a[i+6],a[i+7],a[i+8],a[i+9]);const f=a[i+9]%10;if(f>1.16&&a[i+5]>0)L.push([a[i]+Math.abs(a[i+3])/2,a[i+1]+a[i+4]/2,a[i+2]+a[i+5]/2,a[i+6],a[i+7],a[i+8]])}}
function d3Chunk(k){const gl=D3.gl,nc=Math.ceil(N/D3CS),X0=(k%nc)*D3CS,Y0=(k/nc|0)*D3CS,S=[],D=[],L=[],G=D3.gr?[0,2,4,7][D3.q]||4:0;
  for(let y=Y0;y<Math.min(N,Y0+D3CS);y++)for(let x=X0;x<Math.min(N,X0+D3CS);x++)d3Tile(x,y,S,D,L,G);
  const hs=d3Hash(S);let c=D3.ch.get(k);if(c&&c.hs===hs&&c.D.join()===D.join())return c;
  if(!c){c={o:null,hs:0,D,L};D3.ch.set(k,c)}c.hs=hs;c.D=D;c.L=L;c.o=d3Upload(gl,c.o,S,0,0);D3.lt=null;return c}

/* ---- il mondo oltre i confini: campi, boschi, dune, laghi e montagne fino all'orizzonte ---- */
const d3Hs=(x,y)=>{let h=(x*374761393+y*668265263)^0x5bd1e995;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const d3Vn=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,s=v=>v*v*(3-2*v),a=d3Hs(xi,yi),b=d3Hs(xi+1,yi),c=d3Hs(xi,yi+1),d=d3Hs(xi+1,yi+1);return a+(b-a)*s(fx)+(c-a)*s(fy)+(a-b-c+d)*s(fx)*s(fy)};
const d3Fb=(x,y)=>{let v=0,a=1,f=1,n=0;for(let i=0;i<5;i++){v+=d3Vn(x*f,y*f)*a;n+=a;a*=.5;f*=2.03}return v/n};
function d3Biome(k){const b=String(ZZ&&ZZ.th||'');if(k==='forest')return'bosco';if(k==='desert'||b==='pyr'||k.startsWith('mare_'))return k.startsWith('mare_')?'mare':'deserto';if(k==='peaks')return'monti';if(k==='rovine'||k==='vecchia')return'cenere';if(k==='porto')return'costa';return'campi'}
function d3Backdrop(){if(!SKY[Zk]||ZZ.dg||N<24)return[];const B=[],bio=d3Biome(Zk),far=Math.round([0,120,176,240][D3.q]*(D3.far?1:.55)/8)*8,sd=hs(Zk)%1000;
  // il colore e il tipo delle caselle di bordo: il paesaggio continua quello che c'è sul confine
  const edge=(x,y)=>{x=clamp(x,0,N-1);y=clamp(y,0,N-1);const c=M[y][x];if(c===2)return'w';const B2=d3Rec(()=>floor(x,y,c===1?0:c,0),1,0);return B2.length>=9?[B2[6],B2[7],B2[8]]:null};
  const EC=new Map(),ec=(x,y)=>{x=clamp(x|0,0,N-1);y=clamp(y|0,0,N-1);const k=y*N+x;if(!EC.has(k))EC.set(k,edge(x,y));return EC.get(k)};
  const pal={campi:[[96,160,70],[178,170,84],[130,150,62],[150,112,72]],bosco:[[66,128,52],[54,112,46],[84,140,58],[60,96,44]],deserto:[[222,196,138],[210,180,120],[230,206,150],[196,160,104]],
    monti:[[120,150,92],[132,132,138],[150,150,156],[110,140,86]],cenere:[[104,110,92],[118,112,104],[92,98,84],[130,120,108]],costa:[[110,166,78],[214,198,146],[90,150,70],[150,140,100]],mare:[[214,198,146],[200,184,130],[214,198,146],[190,170,120]]}[bio];
  const trees=bio==='bosco'?.55:bio==='campi'?.16:bio==='costa'?.12:bio==='monti'?.22:bio==='cenere'?.06:0;
  // celle sempre più grandi man mano che ci si allontana (2, 4 e 8 caselle), senza buchi e senza sovrapposizioni
  const dOf=(x0,y0,cs)=>{const dx=x0+cs-1<0?-(x0+cs-1):x0>N-1?x0-(N-1):0,dy=y0+cs-1<0?-(y0+cs-1):y0>N-1?y0-(N-1):0;return Math.max(dx,dy)};
  const cells=[];const sub=(x0,y0,cs)=>{const d=dOf(x0,y0,cs);if(cs===8&&d>=110||cs===4&&d>=36||cs===2){if(d>0)cells.push([x0,y0,cs,d]);return}const h=cs/2;for(const[u,v]of[[0,0],[h,0],[0,h],[h,h]])sub(x0+u,y0+v,h)};
  for(let y0=-far;y0<N+far;y0+=8)for(let x0=-far;x0<N+far;x0+=8)sub(x0,y0,8);
  for(const[gx,gy,cs,out]of cells){{
      const x=gx,y=gy,d=out,ex=clamp(x,0,N-1),ey=clamp(y,0,N-1),e=ec(ex,ey);
      const n=d3Fb((x+sd)/34,(y-sd)/34),n2=d3Fb((x-sd)/11+40,(y+sd)/11);
      let hgt=0,rise=Math.max(0,d-8);
      if(bio==='monti')hgt=Math.pow(rise,1.25)*14*(.5+n)+ (d>60?(d-60)*22*d3Fb(x/22,y/22):0);
      else if(bio==='deserto')hgt=rise*3*(.4+n)+Math.sin(x*.21+n*6)*30*Math.min(1,rise/10)+(d>90?(d-90)*16*Math.max(0,d3Fb(x/18+9,y/18)-.45)*3:0);
      else if(bio==='mare')hgt=-60;
      else hgt=Math.pow(rise,1.15)*3.4*(.3+n*1.1)+(d>110?Math.pow(d-110,1.25)*7*(.3+d3Fb(x/26+5,y/26+2)):0)+(d>150&&bio!=='costa'?Math.pow(d-150,1.4)*14*Math.max(0,d3Fb(x/30+11,y/30+3)-.38):0);
      let water=false;if(e==='w'&&d<60){water=true}else if(bio!=='monti'&&bio!=='mare'&&d>14&&d3Fb(x/40+3,y/40+7)<.33&&hgt<260){water=true}else if(bio==='mare'||(bio==='costa'&&d3Fb(x/50,y/50)<.42&&d>10))water=true;
      let col;const blend=Math.min(1,d/22),P0=pal[Math.floor(d3Hs(Math.floor(x/9),Math.floor(y/9))*4)];
      const ed=Array.isArray(e)?e:pal[0];col=[ed[0]+(P0[0]-ed[0])*blend,ed[1]+(P0[1]-ed[1])*blend,ed[2]+(P0[2]-ed[2])*blend];
      const v=.92+n2*.16;col=col.map(c=>c*v);
      const rk=bio==='monti'?520:1200;if(hgt>rk+380+d3Vn(x/7,y/7)*400)col=[236,240,246];else if(hgt>rk&&bio!=='deserto')col=[132+n2*20,130+n2*20,134+n2*20];
      const H=Math.round(hgt/6)*6;
      if(water){B.push(x,y,-40,cs,cs,40-2,58,110,150,1+50);B.push(x,y,-2,cs,cs,0,64,124,178,1+50);continue}
      B.push(x,y,Math.min(H,0)-40,cs,cs,Math.max(H,0)+40-Math.min(H,0)+ (H<0?H:0),col[0],col[1],col[2],1+20);
      // alberi: vicini con chioma a gradini, lontani una sola macchia scura
      if(trees&&hgt<(bio==='monti'?700:1250)&&d3Fb(x/14+20,y/14)>.5-trees*.4&&d3Hs(x*3,y*7)<trees*1.6){const k=d3Hs(x,y*5),tx=x+cs*(.2+k*.5),ty=y+cs*(.25+d3Hs(y,x)*.5),pine=bio==='monti'||(bio==='bosco'&&k<.45);
        const sc=cs<=2?1:cs<=4?1.6:2.6,gr=pine?[46,92,58]:[62,118,50],z0=H+2;
        if(cs<=4){B.push(tx-.08*sc,ty-.08*sc,z0,.16*sc,.16*sc,14*sc,92,64,40,1+30);
          if(pine){for(let j=0;j<3;j++){const w=(.9-j*.25)*sc;B.push(tx-w/2,ty-w/2,z0+(10+j*12)*sc,w,w,12*sc,gr[0]*(1-j*.05),gr[1]*(1-j*.05),gr[2],1+10)}}
          else{B.push(tx-.55*sc,ty-.55*sc,z0+12*sc,1.1*sc,1.1*sc,18*sc,gr[0],gr[1],gr[2],1+10);B.push(tx-.35*sc,ty-.35*sc,z0+30*sc,.7*sc,.7*sc,8*sc,gr[0]*1.1,gr[1]*1.08,gr[2],1+10)}}
        else B.push(tx-.6*sc,ty-.6*sc,z0,1.2*sc,1.2*sc,(pine?40:30)*sc,gr[0]*.9,gr[1]*.9,gr[2]*.9,1+10)}
      // fattorie e casolari sparsi nei campi
      if(bio==='campi'&&cs<=4&&d>16&&d3Hs(x*11,y*13)<.012){const z0=H;B.push(x+.5,y+.5,z0,2.4,1.8,36,226,214,190,1+20);B.push(x+.3,y+.3,z0+36,2.8,2.2,8,170,70,52,1+20);B.push(x+.5,y+.5,z0+44,2.4,1.8,8,150,62,46,1+20)}}}
  return B}

/* ---- la telecamera ---- */
const d3M={mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let v=0;for(let k=0;k<4;k++)v+=a[k*4+j]*b[i*4+k];o[i*4+j]=v}return o},
  per(f,as,n,fa){const t=1/Math.tan(f/2);return new Float32Array([t/as,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0])},
  orth(l,r,b,t,n,f){return new Float32Array([2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1])},
  look(e,c,up){const z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]],zl=Math.hypot(...z)||1;z[0]/=zl;z[1]/=zl;z[2]/=zl;up=up||[0,1,0];let x=[up[1]*z[2]-up[2]*z[1],up[2]*z[0]-up[0]*z[2],up[0]*z[1]-up[1]*z[0]];const xl=Math.hypot(...x)||1;x=x.map(v=>v/xl);
    const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1])},
  inv(m){const a=m,o=new Float32Array(16),b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];
    let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;if(!d)return o;d=1/d;
    o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d;o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d;o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;
    o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d;o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d;o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d;o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;return o}};
const d3W=(x,y,z)=>[x*D3TS,(z||0)*D3ZS,y*D3TS];
// dal mondo allo schermo (pixel CSS); null se è dietro la telecamera
function d3Proj(x,y,z){const m=D3.vp;if(!m)return null;const X=x*D3TS,Y=(z||0)*D3ZS,Z=y*D3TS,w=m[3]*X+m[7]*Y+m[11]*Z+m[15];if(w<.1)return null;
  return[((m[0]*X+m[4]*Y+m[8]*Z+m[12])/w*.5+.5)*W,(1-((m[1]*X+m[5]*Y+m[9]*Z+m[13])/w*.5+.5))*H,w]}
// dallo schermo al terreno: il punto della casella sotto il cursore
function d3Ground(cx,cy){const iv=D3.ivp;if(!iv)return null;const nx=cx/W*2-1,ny=1-cy/H*2;const un=(x,y,z)=>{const w=iv[3]*x+iv[7]*y+iv[11]*z+iv[15];return[(iv[0]*x+iv[4]*y+iv[8]*z+iv[12])/w,(iv[1]*x+iv[5]*y+iv[9]*z+iv[13])/w,(iv[2]*x+iv[6]*y+iv[10]*z+iv[14])/w]};
  const a=un(nx,ny,-1),b=un(nx,ny,1),dy=b[1]-a[1];if(Math.abs(dy)<1e-6)return null;const k=(0-a[1])/dy;if(k<0)return null;return[(a[0]+(b[0]-a[0])*k)/D3TS,(a[2]+(b[2]-a[2])*k)/D3TS]}

/* ---- la luce del giorno ---- */
function d3Light(){const out=!!SKY[Zk]&&!(ZZ&&ZZ.dg),h=gHour(),nk=out?NK:1,dk=out?DK:0,z=ZZ||{};
  const day=clamp(Math.sin((h-6)/12*Math.PI),0,1),an=(h-6)/12*Math.PI,el=Math.max(.08,Math.sin(Math.max(0,Math.min(Math.PI,an)))*1.15);
  let sun=out&&day>0?[Math.cos(an)*Math.cos(el),Math.sin(el),.45*Math.cos(el)]:[-.35,.82,.45];const sl=Math.hypot(...sun);sun=sun.map(v=>v/sl);
  const lerp=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
  let sunc=lerp([1.05,.98,.88],[1.05,.62,.36],dk);sunc=lerp(sunc,[.26,.32,.5],nk).map(v=>v*(out?1:.0));
  let zen=lerp([.26,.47,.85],[.34,.36,.62],dk),hz=lerp([.76,.84,.93],[.98,.72,.52],dk);zen=lerp(zen,[.02,.03,.08],nk);hz=lerp(hz,[.08,.1,.18],nk);
  let au=lerp([.5,.56,.66],[.46,.42,.5],dk),ad=lerp([.34,.33,.28],[.36,.28,.24],dk);au=lerp(au,[.1,.12,.22],nk);ad=lerp(ad,[.05,.05,.08],nk);
  let fog=hz,lan=0;
  if(!out){const bg=x3Col(z.bg||'#202028').map(v=>v/255),dark=DARKZ.has(Zk)||(z.dg&&true);au=[.36+bg[0]*.6,.34+bg[1]*.6,.36+bg[2]*.6].map(v=>v*(dark?.7:1));ad=au.map(v=>v*.65);fog=bg.map(v=>v*.6);hz=fog;zen=fog;lan=dark||z.dg?2.4:.9}
  else lan=nk*1.4;
  return{out,sun,sunc,zen,hz,au,ad,fog,lan,nk}}

/* ---- un fotogramma in 3D ---- */
function d3Frame(){const gl=D3.gl,cvs=D3.cv;const now=performance.now(),fdt=D3.lf?now-D3.lf:16;D3.lf=now;if(fdt<250){D3.ft=(D3.ft||16)*.95+fdt*.05;if(D3.ft>26)D3.dr=Math.max(.5,(D3.dr||1)-.004);else if(D3.ft<19)D3.dr=Math.min(1,(D3.dr||1)+.002);
    if(D3.dr<=.5&&D3.ft>38){D3.slow=(D3.slow||0)+fdt;if(D3.slow>5000&&D3.q>1){D3.q--;D3.slow=0;D3.dr=.8;d3Save();d3Reset();msg('Vista 3D: dettaglio abbassato a '+['','Basso','Medio'][D3.q]+' per andare più fluido')}}else D3.slow=0}
  const rs=([.6,.6,.85,1][D3.q]||.85)*(D3.dr||1)*(D3.rsc||1),w=Math.max(1,Math.round(W*DPR*rs)),h=Math.max(1,Math.round(H*DPR*rs));const up=!!D3.fsr&&typeof d3UpInit==='function'&&d3UpInit(gl,w,h),ow=up?Math.max(1,Math.round(W*DPR)):w,oh=up?Math.max(1,Math.round(H*DPR)):h;if(cvs.width!==ow||cvs.height!==oh){cvs.width=ow;cvs.height=oh}
  if(D3.zk!==Zk||D3.M!==M||D3.N!==N)d3Reset();
  const nc=Math.ceil(N/D3CS);
  if(!D3.full){const t0=performance.now();for(let k=0;k<nc*nc;k++)if(!D3.ch.has(k))d3Chunk(k);D3.full=1;D3.bt=performance.now()-t0}
  else{const k=D3.rr++%(nc*nc);d3Chunk(k)}
  if(!D3.bd){const t0=performance.now(),B=d3Backdrop();D3.bd=B.length?d3Upload(gl,null,B,0,0):{n:0};D3.bdt=performance.now()-t0}
  // cose che si muovono: personaggi, nemici, oggetti a terra, caselle animate, proiettili, particelle del gioco
  D3.labs.length=0;const R=D3.q>=3?40:30,dl=[];
  const B=d3Rec(()=>{for(const c of D3.ch.values())for(let i=0;i<c.D.length;i+=2){const n0=D3B.length;fObj(c.D[i],c.D[i+1]);d3Rk(D3B,n0,((c.D[i]+c.D[i+1])&1)*16,0)}
    D3CTX=3;for(const e of ents.concat(P,NET.list)){if(!e||e.px==null)continue;if(e.k!=='ship'&&(Math.abs(e.px-P.px)>R||Math.abs(e.py-P.py)>R))continue;D3E=e;const n0=D3B.length;try{ent(e)}catch(_){}d3Rk(D3B,n0,0,1);
      if(e.torch||e.k==='tc'){for(let i=n0;i<D3B.length;i+=10)if(D3B[i+9]%10>1.16){dl.push([D3B[i],D3B[i+1],D3B[i+2]+D3B[i+5]/2,D3B[i+6],D3B[i+7],D3B[i+8]]);break}}}
    D3E=null;D3CTX=0;for(const p of PJ)box(p.x-.08,p.y-.08,18,.16,.16,8,p.c,1.2);if(typeof PPJ!=='undefined'&&PPJ.length)ppjDraw()},0);
  // effetti: scintille e anelli del gioco diventano piccole luci nel mondo
  if(typeof SFX!=='undefined')for(const p of SFX){if(p.k==='pt'&&p.x!=null){const k=x3Col(p.c||'#ffd84a'),w=p.gl===1?(p.s||4)*.016*(1+.8*p.t/(p.d||1)):.06,hh=p.gl===1?w*10:4;B.push(p.x-w/2,p.y-w/2,(p.z==null?10:p.z),w,w,hh,k[0],k[1],k[2],p.gl===1?1:2)}}
  for(const f of fx){if(f.k==='ring'||f.k==='boom'){const p=Math.max(0,1-f.t/(f.k==='boom'?.4:.5)),r=f.r*p*1.1,c=f.k==='boom'?[255,120,60]:[255,200,80];for(let i=0;i<24;i++){const a=i/24*6.283;B.push(f.x+Math.cos(a)*r-.06,f.y+Math.sin(a)*r-.06,1,.12,.12,3,c[0],c[1],c[2],2)}}
    else if(f.k==='warn'){const p=1-f.t/f.mx;for(let i=0;i<32;i++){const a=i/32*6.283;B.push(f.x+Math.cos(a)*f.r-.05,f.y+Math.sin(a)*f.r-.05,.5,.1,.1,1,255,60,40,2);if(i%2===0)B.push(f.x+Math.cos(a)*f.r*p-.04,f.y+Math.sin(a)*f.r*p-.04,.6,.08,.08,1,255,120,60,2)}}}
  D3.dyn=d3Upload(gl,D3.dyn,B,0,1);
  // la telecamera: dietro l'eroe, alla distanza scelta con la rotellina
  const ph=P.px,pv=P.py,hz=HHc&&HHc.length===N*N?(HHc[(clamp(pv|0,0,N-1))*N+clamp(ph|0,0,N-1)]||0):0,tgt=[ph*D3TS,hz*D3ZS+1.25,pv*D3TS];
  if(!D3.tgt||Math.hypot(tgt[0]-D3.tgt[0],tgt[2]-D3.tgt[2])>9)D3.tgt=tgt.slice();for(let i=0;i<3;i++)D3.tgt[i]+=(tgt[i]-D3.tgt[i])*.18;
  const dist=clamp(13/(SZ||1),4.5,30),pitch=D3.pitch,yw=D3.yaw,ce=[D3.tgt[0]+Math.sin(yw)*Math.cos(pitch)*dist,D3.tgt[1]+Math.sin(pitch)*dist,D3.tgt[2]+Math.cos(yw)*Math.cos(pitch)*dist];
  D3.cw=ce;const far=SKY[Zk]&&!ZZ.dg?(D3.far?900:520)*Math.max(1,D3.fog||1):120,Pm=d3M.per(clamp(D3.fov||57,40,100)*Math.PI/180,W/H,.3,far),Vm=d3M.look(ce,D3.tgt);D3.vp=d3M.mul(Pm,Vm);D3.ivp=d3M.inv(D3.vp);
  const Lx=d3Light();D3.L=Lx;
  // luci: lampioni e torce vicine (le più vicine all'eroe), più quelle portate dai personaggi
  if(!D3.lt){D3.lt=[];for(const c of D3.ch.values())for(const l of c.L)D3.lt.push(l)}
  const lights=D3.lt.concat(dl).map(l=>[l,Math.hypot(l[0]-ph,l[1]-pv)]).filter(q=>q[1]<26).sort((a,b)=>a[1]-b[1]).slice(0,clamp(D3.nl==null?12:D3.nl,0,12));
  const lk=Lx.out?Math.max(.08,Lx.nk*1.3+DK*.3):1.15;
  // ombre del sole
  const shOn=D3.sh&&D3.q>=2&&Lx.out&&Lx.sun[1]>.12;let LM=new Float32Array(16);
  if(shOn){d3Shadow();const c=D3.tgt,s=Lx.sun,R2=D3.q>=3?38:28,le=[c[0]+s[0]*120,c[1]+s[1]*120,c[2]+s[2]*120];LM=d3M.mul(d3M.orth(-R2,R2,-R2,R2,1,300),d3M.look(le,c,Math.abs(s[1])>.98?[0,0,1]:[0,1,0]));
    gl.bindFramebuffer(gl.FRAMEBUFFER,D3.smF);gl.viewport(0,0,D3.smS,D3.smS);gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.colorMask(false,false,false,false);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(2,4);
    gl.useProgram(D3.dp.p);gl.uniformMatrix4fv(D3.dp.U.LM,false,LM);gl.bindVertexArray(D3.vao);
    for(const c of D3.ch.values())d3Draw(gl,c.o,1);d3Draw(gl,D3.dyn,1);
    gl.disable(gl.POLYGON_OFFSET_FILL);gl.colorMask(true,true,true,true);gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
  gl.bindFramebuffer(gl.FRAMEBUFFER,up?D3.upF:null);gl.viewport(0,0,w,h);gl.clearColor(Lx.fog[0],Lx.fog[1],Lx.fog[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  // il cielo
  gl.disable(gl.DEPTH_TEST);gl.useProgram(D3.sp.p);const U2=D3.sp.U;gl.uniformMatrix4fv(U2.IVP,false,D3.ivp);gl.uniform3fv(U2.SUN,Lx.sun);gl.uniform3fv(U2.ZEN,Lx.zen);gl.uniform3fv(U2.HZC,Lx.hz);gl.uniform3fv(U2.SUNC,Lx.sunc);gl.uniform1f(U2.TM,t);gl.uniform1f(U2.NK,Lx.nk);gl.uniform1f(U2.OUT,Lx.out?1:0);
  gl.bindVertexArray(D3.vao);gl.bindBuffer(gl.ARRAY_BUFFER,D3.svb);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);for(let i=1;i<4;i++)gl.disableVertexAttribArray(i);gl.drawArrays(gl.TRIANGLES,0,3);
  // il mondo
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.disable(gl.CULL_FACE);
  gl.useProgram(D3.pr.p);const U=D3.pr.U;gl.uniformMatrix4fv(U.VP,false,D3.vp);gl.uniformMatrix4fv(U.LM,false,LM);gl.uniform1f(U.TM,t);
  gl.uniform3fv(U.SUN,Lx.sun);gl.uniform3fv(U.SUNC,Lx.sunc);gl.uniform3fv(U.AU,Lx.au);gl.uniform3fv(U.AD,Lx.ad);gl.uniform3fv(U.FOGC,Lx.fog);gl.uniform3fv(U.HZC,Lx.hz);gl.uniform3fv(U.CAM,ce);
  const fogEnd=Lx.out?(D3.far?[0,330,430,560][D3.q]:300)*clamp(D3.fog||1,.4,2):55;gl.uniform1f(U.FOG0,Lx.out?fogEnd*.18:10);gl.uniform1f(U.FOG1,fogEnd);gl.uniform1f(U.SHON,shOn?1:0);gl.uniform1f(U.LAN,Lx.lan);gl.uniform1f(U.VX,D3.vx?1:0);
  gl.uniform4f(U.HL,ph*D3TS,hz*D3ZS+1.9,pv*D3TS,hz*D3ZS);gl.uniform3f(U.HP,ph*D3TS,hz*D3ZS+1.15,pv*D3TS);
  const pl=new Float32Array(48),pc=new Float32Array(36);lights.forEach(([l],i)=>{pl.set([l[0]*D3TS,l[2]*D3ZS,l[1]*D3TS,1.6*lk],i*4);pc.set([l[3]/255*1.2,l[4]/255,l[5]/255*.8],i*3)});
  gl.uniform4fv(U.PL,pl);gl.uniform3fv(U.PC,pc);gl.uniform1i(U.NP,lights.length);
  gl.activeTexture(gl.TEXTURE0);if(D3.smT)gl.bindTexture(gl.TEXTURE_2D,D3.smT);else gl.bindTexture(gl.TEXTURE_2D,null);gl.uniform1i(U.SM,0);
  if(!D3.smT){d3Shadow()}gl.bindTexture(gl.TEXTURE_2D,D3.smT);
  for(const c of D3.ch.values())d3Draw(gl,c.o);d3Draw(gl,D3.dyn);if(D3.bd&&D3.bd.n)d3Draw(gl,D3.bd);
  if(up)d3UpPass(gl,w,h,ow,oh);gl.bindVertexArray(null)}
function d3Draw(gl,o,depth){if(!o||!o.n)return;gl.bindBuffer(gl.ARRAY_BUFFER,o.vb);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);
  if(depth){for(let i=1;i<4;i++)gl.disableVertexAttribArray(i)}
  else{gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,4,gl.UNSIGNED_BYTE,true,24,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.BYTE,true,24,16);gl.enableVertexAttribArray(3);gl.vertexAttribPointer(3,4,gl.UNSIGNED_BYTE,true,24,20)}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.ib);gl.drawElements(gl.TRIANGLES,o.n,gl.UNSIGNED_INT,0)}

/* ---- le scritte sopra la vista 3D: nomi, «!», barre della vita, numeri dei colpi, tasto R ---- */
function d3Overlay(){g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,W,H);g.textAlign='center';
  // 7.42: i nomi non si accavallano più: prima i più vicini; uno che toccherebbe un altro sale di una riga, e se non c'è posto si salta
  const LQ=[];for(const[e,s2,zp,c,font]of D3.labs){const q=d3Proj(e.px,e.py,zp);if(!q||q[2]>(s2==='!'||s2==='?'?48:e.k==='en'||e===P?40:26))continue;LQ.push([q,s2,c,font,e])}
  LQ.sort((a,b)=>(b[1]==='!'||b[1]==='?')-(a[1]==='!'||a[1]==='?')||a[0][2]-b[0][2]);const PL=[],hit=(x0,y0,x1,y1)=>PL.some(r=>x0<r[2]&&x1>r[0]&&y0<r[3]&&y1>r[1]);
  for(const[q,s2,c,font,e]of LQ){g.font=font||'bold 11px Georgia,serif';const hw=g.measureText(s2).width/2+3,mark=s2==='!'||s2==='?';let y=q[1],ok=mark||e===P;
    if(!ok)for(let k=0;k<3&&!ok;k++){if(!hit(q[0]-hw,y-12,q[0]+hw,y+3))ok=true;else y-=13}
    if(!ok)continue;PL.push([q[0]-hw,y-12,q[0]+hw,y+3]);_label715(s2,q[0],y,c)}
  for(const e of ents.concat(NET.list)){if(!(e.k==='en'||e.k==='tr'||e.k==='pl')||e.hp==null||!e.mx)continue;if(e.k==='en'&&!e.al&&e.hp>=e.mx)continue;const top=(e.m&&e.m.top?e.m.top:e.boss?70:40)+6,q=d3Proj(e.px,e.py,top);if(!q||q[2]>45)continue;
    const w=(e.boss||(e.b&&e.b.pt)?60:30)*clamp(14/q[2],.6,1.6);g.fillStyle='#000a';g.fillRect(q[0]-w/2,q[1],w,5);g.fillStyle=e.k==='pl'?'#44aaff':e.k==='tr'?'#4a8aff':e.enr?'#ff7a2a':'#ee3333';g.fillRect(q[0]-w/2,q[1],w*Math.max(0,e.hp/e.mx),5)}
  if(SET.dmg){g.font='bold 16px Georgia,serif';g.lineWidth=3;g.strokeStyle='#000';for(const p of pop){const q=d3Proj(p.x,p.y,48+(1-p.t)*24);if(!q)continue;g.globalAlpha=Math.min(1,p.t*2);g.fillStyle=p.c;if(typeof vxText==='function')vxText(p.s,q[0],q[1],1,1);else{g.strokeText(p.s,q[0],q[1]);g.fillText(p.s,q[0],q[1])}}g.globalAlpha=1}
  if(typeof partDraw==='function')partDraw();if(typeof sfxDraw==='function'&&false)sfxDraw();
  if(SET.wasd&&IT&&!PM&&!(typeof TCH!=='undefined'&&TCH.on)){g.setTransform(DPR,0,0,DPR,0,0);const q=d3Proj(IT.px,IT.py,IT.k==='npc'?44:IT.k==='po'?40:20);if(q)keycap(q[0]+26,q[1],'R')}}

/* ---- accendere e spegnere ---- */
function d3Show(on){if(!D3.cv)return;const was=D3.act;D3.act=on?1:0;D3.cv.style.display=on?'block':'none';document.body.classList.toggle('v3d',!!on);if(was!==D3.act){d3Btn();if(!on&&started){g.setTransform(DPR,0,0,DPR,0,0)}}}
function d3Toggle(v){const want=v==null?!D3.on:!!v;if(want&&d3Init()===false){D3.on=0;d3Save();d3Btn();return}D3.on=want?1:0;d3Save();
  if(want&&started&&!d3Want())msg('Vista 3D attiva: compare appena finisce quello che stai facendo');
  if(want&&!D3.seen){D3.seen=1;d3Save();setTimeout(()=>{if(D3.on)banner('Vista 3D','Tasto destro o due dita per girare la telecamera · rotellina per avvicinarla · B per tornare alla vista classica','occhio')},300)}
  d3Btn();if(typeof hud==='function'&&started)hud()}
function d3Btn(){const b=$('v3b');if(b){b.classList.toggle('on',!!D3.on);b.title=D3.on?'Torna alla vista classica (B)':'Passa alla vista 3D (B)';b.innerHTML=`<span>${D3.on?'2D':'3D'}</span>`}
  const r=$('v3rot');if(r)r.style.display=D3.act?'flex':'none'}
// il disegno del gioco: in 3D il mondo va sulla tela WebGL e su quella del gioco restano solo le scritte
const _draw715=draw;draw=function(){if(!d3Want()||!d3Init()||D3.lost){if(D3.act)d3Show(0);_draw715();return}
  if(!D3.act)d3Show(1);D3.f=1;if(!FC)buildFC();
  // la telecamera del gioco classico continua a seguire l'eroe, così tornando al 2D è già al suo posto
  const[tx,ty]=camTarget();camX+=(PX(tx,ty)-camX)*.12;camY+=(PY(tx,ty,10)-camY)*.12;if(typeof shakeTick==='function')shakeTick(1/60);GLOW.length=0;NLS.length=0;
  try{d3Frame()}catch(e){console.error(e);D3.err=(D3.err||0)+1;if(D3.err>3){D3.on=0;d3Save();d3Show(0);msg('La vista 3D si è fermata per un errore: torno alla vista classica')}}
  d3Overlay()};
// fuori dalla partita (menu, filmati) la tela 3D si nasconde
const _frame715=frame;frame=function(n){D3.f=0;_frame715(n);if(!D3.f&&D3.act)d3Show(0)};

/* ---- comandi: movimento rispetto alla telecamera, clic nel mondo 3D, rotazione della telecamera ---- */
const _keyDir715=keyDir;keyDir=function(){const d=_keyDir715();if(!d||!D3.act)return d;const a=D3.yaw-Math.PI/4,c=Math.cos(a),s=Math.sin(a);return[d[0]*c+d[1]*s,d[1]*c-d[0]*s]};
// cosa c'è sotto il punto dello schermo: un'entità (vicina al suo corpo) o una casella del terreno
function d3Pick(cx,cy){let best=null,bd=1e9;
  for(const L of[NET.list,ents])for(const e of L){if(!e||e.k==='tc'||e.k==='cho'||e.k==='resx'||e.k==='ship'||e.k==='dead'||e.k==='figura')continue;
    const top=e.boss?60:e.k==='po'?30:e.k==='dr'?8:26,q=d3Proj(e.px,e.py,top*.55);if(!q)continue;const r=clamp(1.15*D3.cv.height/(DPR*q[2]*1.6),14,90)*(e.boss?1.6:1),d=Math.hypot(q[0]-cx,(q[1]-cy)*.75);
    if(d<r&&d<bd){bd=d;best=e}}
  if(best)return{e:best};const gp=d3Ground(cx,cy);return gp?{x:gp[0],y:gp[1]}:null}
// trasforma il punto scelto in 3D nelle coordinate che il gioco classico si aspetta, e lascia fare a lui
function d3Client(p){let mx,my;if(p.e){mx=PX(p.e.px,p.e.py);my=PY(p.e.px,p.e.py,p.e.boss?30:16)}else{mx=PX(p.x,p.y);my=PY(p.x,p.y,0)}return[(mx-camX)*S+W/2,(my-camY)*S+H/2]}
const _pd715=cv.onpointerdown;cv.onpointerdown=ev=>{if(!D3.act){_pd715(ev);return}
  if(ev.button===2||ev.button===1){D3.drag={x:ev.clientX,y:ev.clientY,id:ev.pointerId};ev.preventDefault();return}
  if(ev.pointerType==='touch'&&D3.tch&&D3.tch.size>=1){return}
  const p=d3Pick(ev.clientX,ev.clientY);if(!p){auInit();return}const[cx,cy]=d3Client(p);
  _pd715({clientX:cx,clientY:cy,button:0,pointerType:ev.pointerType,pointerId:ev.pointerId,preventDefault(){},stopPropagation(){},target:cv})};
cv.addEventListener('contextmenu',e=>{if(D3.act)e.preventDefault()});
addEventListener('pointermove',e=>{const d=D3.drag;if(!d||e.pointerId!==d.id)return;const k=.0065*(D3.sens||1);D3.yaw-=(e.clientX-d.x)*k;D3.pitch=clamp(D3.pitch+(e.clientY-d.y)*k*(D3.inv?-1:1)*.7,.1,1.35);d.x=e.clientX;d.y=e.clientY});
addEventListener('pointerup',e=>{if(D3.drag&&e.pointerId===D3.drag.id)D3.drag=null});
// due dita: girandole si gira la telecamera (avvicinarle e allontanarle fa lo zoom, come sempre)
D3.tch=new Map();
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')D3.tch.set(e.pointerId,[e.clientX,e.clientY])},true);
cv.addEventListener('pointermove',e=>{if(!D3.act||e.pointerType!=='touch'||!D3.tch.has(e.pointerId))return;const o=D3.tch.get(e.pointerId);if(D3.tch.size===2){const[a,b]=[...D3.tch.entries()],other=a[0]===e.pointerId?b[1]:a[1];
    const a0=Math.atan2(o[1]-other[1],o[0]-other[0]),a1=Math.atan2(e.clientY-other[1],e.clientX-other[0]);let da=a1-a0;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;D3.yaw-=da;
    const my=(e.clientY-o[1])/2;D3.pitch=clamp(D3.pitch+my*.004,.1,1.35)}D3.tch.set(e.pointerId,[e.clientX,e.clientY])},true);
const d3TchEnd=e=>{D3.tch.delete(e.pointerId)};cv.addEventListener('pointerup',d3TchEnd,true);cv.addEventListener('pointercancel',d3TchEnd,true);
// il cursore che cambia sopra nemici, personaggi e oggetti
const _curHover715=curHover;curHover=function(dt){if(!D3.act||MX<0){_curHover715(dt);return}const p=d3Pick(MX,MY),ox=MX,oy=MY;if(p){[MX,MY]=d3Client(p)}try{_curHover715(dt)}finally{MX=ox;MY=oy}};
// tasti: B cambia vista; con la rotellina la telecamera si avvicina (la stessa scala dello zoom classico)
addEventListener('keydown',e=>{if(!started||e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.repeat)return;const k=e.key.toLowerCase();if(k==='b'&&!HED&&!(typeof RKW!=='undefined'&&RKW)){d3Toggle();e.preventDefault()}});
// rotazione con i pulsanti a schermo (tenendoli premuti)
let D3ROT=0;function d3RotTick(){if(D3ROT&&D3.act){D3.yaw+=D3ROT*.035;requestAnimationFrame(d3RotTick)}}
function d3Rot(v){D3ROT=v;if(v)requestAnimationFrame(d3RotTick)}

/* ---- pulsanti nell'interfaccia: vista 2D/3D e rotazione della telecamera ---- */
document.body.insertAdjacentHTML('beforeend',`<button id="v3b" class="hbtn" onclick="d3Toggle()" title="Passa alla vista 3D (B)"><span>3D</span></button>
<div id="v3rot"><button aria-label="Gira la telecamera a sinistra" onpointerdown="d3Rot(1)" onpointerup="d3Rot(0)" onpointerleave="d3Rot(0)">⟲</button><button aria-label="Gira la telecamera a destra" onpointerdown="d3Rot(-1)" onpointerup="d3Rot(0)" onpointerleave="d3Rot(0)">⟳</button></div>`);
document.head.insertAdjacentHTML('beforeend',`<style>
canvas#c3{position:fixed;inset:0;width:100%;height:100%;display:none}
body.v3d{background:#000}
.hbtn{position:fixed;z-index:30;width:40px;height:40px;border-radius:10px;border:1px solid #f5b94288;background:linear-gradient(160deg,rgba(40,30,18,.88),rgba(18,20,34,.88));color:#f5d58a;font:bold 13px Georgia,serif;cursor:pointer;box-shadow:0 3px 10px #0007;display:flex;align-items:center;justify-content:center;padding:0}
.hbtn:hover{border-color:#ffd84a;color:#fff2c0;transform:translateY(-1px)}
#v3b{right:196px;top:calc(10px + env(safe-area-inset-top,0px))}#v3b.on{background:linear-gradient(160deg,rgba(90,60,10,.92),rgba(30,40,70,.92));border-color:#ffd84a}
body:not(.ig) #v3b,body:not(.ig) #v3rot,body.film #v3b,body.film #v3rot{display:none!important}
#v3rot{position:fixed;z-index:30;right:150px;top:calc(56px + env(safe-area-inset-top,0px));display:none;gap:6px}
#v3rot button{width:40px;height:34px;border-radius:9px;border:1px solid #f5b94266;background:rgba(18,20,34,.82);color:#f5d58a;font-size:18px;cursor:pointer}
@media (max-width:700px){#v3b{right:106px}#v3rot{right:104px;top:calc(56px + env(safe-area-inset-top,0px))}}
</style>`);
d3Btn();
