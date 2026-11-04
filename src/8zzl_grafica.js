/* ================= 7.37: PIÙ FLUIDO, E LA GRAFICA COME VUOI TU =================
   Impostazioni → Grafica ha molte più opzioni: luminosità, contrasto e colori, quantità di particelle, scossoni dello
   schermo, risoluzione (anche sopra il 100% per un'immagine più fine) e, per la vista 3D, risoluzione interna con
   upscaling e nitidezza (in stile FSR 1), campo visivo, distanza della nebbia, qualità delle ombre e numero di luci.
   Il DLSS di NVIDIA in un browser non si può usare: richiede un programma nativo (DirectX o Vulkan) e una scheda RTX.
   L'upscaling con nitidezza fa la stessa cosa in modo più semplice e funziona su qualunque scheda. */
Object.assign(SETD,{gam:1,sat:1,con:1,shk:1,pdn:1,dyn:1,wfast:1});for(const k of['gam','sat','con','shk','pdn','dyn','wfast'])if(SET[k]==null)SET[k]=SETD[k];
// luminosità, contrasto e colori: un filtro della scheda grafica, sopra il disegno, che non costa niente
uFx=function(){const u=SET.ultra?[1.16,1.05]:[1,1],f=[];const b=+SET.gam||1,sa=(+SET.sat||1)*u[0],co=(+SET.con||1)*u[1];if(Math.abs(b-1)>.01)f.push('brightness('+b.toFixed(2)+')');if(Math.abs(co-1)>.01)f.push('contrast('+co.toFixed(2)+')');if(Math.abs(sa-1)>.01)f.push('saturate('+sa.toFixed(2)+')');
  const s=f.join(' ');cv.style.filter=s;if(typeof D3!=='undefined'&&D3.cv)D3.cv.style.filter=s};
// le particelle e gli scossoni, nella misura che vuoi
{const b0=burst;burst=function(x,y,n,c,o){const d=SET.pdn==null?1:+SET.pdn;if(d<=0)return;if(d!==1){const m=n*d;n=Math.floor(m)+(Math.random()<m-Math.floor(m)?1:0);if(n<=0)return}return b0(x,y,n,c,o)}}
{const s0=shake;shake=function(a){const k=SET.shk==null?1:+SET.shk;if(k>0)s0(a*k)}}
/* ---- la vista 3D: risoluzione interna, upscaling e nitidezza ---- */
const D3UP_VS=`in vec2 a;out vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
// nitidezza adattiva al contrasto (come AMD FidelityFX CAS/RCAS): più forte dove l'immagine è piatta, morbida sui bordi già netti
const D3UP_FS=`uniform sampler2D T;uniform vec2 PX;uniform float SH;in vec2 v;out vec4 o;
void main(){vec3 c=texture(T,v).rgb,n=texture(T,v+vec2(0.,PX.y)).rgb,s=texture(T,v-vec2(0.,PX.y)).rgb,e=texture(T,v+vec2(PX.x,0.)).rgb,w=texture(T,v-vec2(PX.x,0.)).rgb;
 vec3 mn=min(c,min(min(n,s),min(e,w))),mx=max(c,max(max(n,s),max(e,w)));vec3 amp=sqrt(clamp(min(mn,1.-mx)/max(mx,vec3(1e-4)),0.,1.));
 vec3 wg=amp*(-1./mix(8.,4.5,SH));vec3 r=(c+(n+s+e+w)*wg)/(1.+4.*wg);o=vec4(clamp(mix(c,r,step(.001,SH)),0.,1.),1.);}`;
function d3UpInit(gl,w,h){try{if(!D3.upP)D3.upP=d3Prog(gl,D3UP_VS,D3UP_FS,['a']);if(D3.upW===w&&D3.upH===h&&D3.upF)return true;d3UpFree(gl);
    const ns=Math.min(4,gl.getParameter(gl.MAX_SAMPLES)||0);D3.upF=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,D3.upF);
    const cb=D3.upC=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,cb);if(ns>1)gl.renderbufferStorageMultisample(gl.RENDERBUFFER,ns,gl.RGBA8,w,h);else gl.renderbufferStorage(gl.RENDERBUFFER,gl.RGBA8,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,cb);
    const db=D3.upD=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,db);if(ns>1)gl.renderbufferStorageMultisample(gl.RENDERBUFFER,ns,gl.DEPTH_COMPONENT24,w,h);else gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,db);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('framebuffer');
    const tx=D3.upT=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA8,w,h);for(const[k,v]of[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);
    D3.upR=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,D3.upR);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.bindRenderbuffer(gl.RENDERBUFFER,null);D3.upW=w;D3.upH=h;return true}
  catch(e){console.warn('upscaling 3D non disponibile',e);d3UpFree(gl);D3.fsr=0;d3Save();return false}}
function d3UpFree(gl){for(const[k,f]of[['upF','deleteFramebuffer'],['upR','deleteFramebuffer'],['upC','deleteRenderbuffer'],['upD','deleteRenderbuffer'],['upT','deleteTexture']])if(D3[k]){gl[f](D3[k]);D3[k]=null}D3.upW=D3.upH=0}
function d3UpPass(gl,w,h,ow,oh){gl.bindFramebuffer(gl.READ_FRAMEBUFFER,D3.upF);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,D3.upR);gl.blitFramebuffer(0,0,w,h,0,0,w,h,gl.COLOR_BUFFER_BIT,gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,ow,oh);gl.disable(gl.DEPTH_TEST);gl.useProgram(D3.upP.p);const U=D3.upP.U;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,D3.upT);gl.uniform1i(U.T,0);
  gl.uniform2f(U.PX,1/w,1/h);gl.uniform1f(U.SH,clamp(D3.shp==null?.5:+D3.shp,0,1));gl.bindVertexArray(D3.vao);gl.bindBuffer(gl.ARRAY_BUFFER,D3.svb);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);for(let i=1;i<4;i++)gl.disableVertexAttribArray(i);gl.drawArrays(gl.TRIANGLES,0,3);gl.enable(gl.DEPTH_TEST)}
// le opzioni nuove della vista 3D
{const o0=d3Opt;d3Opt=function(k,v){if(['rsc','shp','fov','fog'].includes(k)){D3[k]=+v;d3Save();return}if(k==='fsr'){D3.fsr=v?1:0;d3Save();return}if(k==='nl'){D3.nl=clamp(+v|0,0,12);d3Save();return}if(k==='shr'){D3.shr=+v|0;D3.smS=0;d3Save();return}o0(k,v)}}
function gfxRng(id,l,v,min,max,st,on,fm){return`<div class="row"><label for="${id}">${l} <b class="gfxv" id="${id}_v">${fm(v)}</b></label><input type="range" id="${id}" min="${min}" max="${max}" step="${st}" value="${v}" oninput="${on};$('${id}_v').textContent=(${fm.toString()})(+this.value)"></div>`}
const gfxPct=v=>Math.round(v*100)+'%';
function gfx3DHTML(){const D=typeof D3!=='undefined'?D3:null;if(!D)return'';
  return sGrp('Vista 3D · risoluzione e nitidezza',gfxRng('g3_rsc','Risoluzione interna',D.rsc==null?1:D.rsc,.5,1,.05,"d3Opt('rsc',+this.value)",gfxPct)
    +`<div class="row"><label for="g3_fsr">✨ Upscaling con nitidezza (in stile FSR)</label><input type="checkbox" id="g3_fsr" ${D.fsr?'checked':''} onchange="d3Opt('fsr',this.checked?1:0)"></div>`
    +gfxRng('g3_shp','Nitidezza',D.shp==null?.5:D.shp,0,1,.05,"d3Opt('shp',+this.value)",gfxPct)
    +`<p class="mu">Con l'upscaling il mondo 3D si disegna a una risoluzione più bassa (più fotogrammi al secondo) e poi viene ingrandito a schermo pieno e reso nitido, come fa AMD FSR. <b>Il DLSS di NVIDIA non si può usare in un browser</b>: richiede un gioco nativo (DirectX o Vulkan) e una scheda RTX. Questo funziona su qualunque scheda, anche integrata.</p>`)
   +sGrp('Vista 3D · scena',gfxRng('g3_fov','Campo visivo',D.fov||57,40,100,1,"d3Opt('fov',+this.value)",v=>Math.round(v)+'°')
    +gfxRng('g3_fog','Distanza della nebbia',D.fog||1,.4,2,.05,"d3Opt('fog',+this.value)",gfxPct)
    +`<div class="row"><label for="g3_shr">Qualità delle ombre</label><select id="g3_shr" onchange="d3Opt('shr',+this.value)">${[[0,'Automatica'],[1024,'Media (1024)'],[2048,'Alta (2048)'],[4096,'Altissima (4096)']].map(([v,n])=>`<option value="${v}" ${(D.shr|0)===v?'selected':''}>${n}</option>`).join('')}</select></div>`
    +gfxRng('g3_nl','Luci accese insieme (lampioni, torce)',D.nl==null?12:D.nl,0,12,1,"d3Opt('nl',+this.value)",v=>String(Math.round(v))))}
const _setBody737=setBody;setBody=function(k){let h=_setBody737(k);if(k==='gfx'){h=h.replace(/(id="s_rs" min=")0\.5(" max=")1(")/,'$10.4$21.5$3');
    const rg=(q,l,min,max,st,fm)=>gfxRng('s_'+q,l,SET[q]==null?1:SET[q],min,max,st,`setv('${q}',+this.value)`,fm);
    h+=sGrp('Immagine',rg('gam','Luminosità',.6,1.5,.02,gfxPct)+rg('con','Contrasto',.6,1.5,.02,gfxPct)+rg('sat','Colori',0,2,.05,gfxPct)+`<p class="mu">Si regolano anche mentre giochi. La risoluzione sopra il 100% rende l'immagine più fine, ma pesa di più.</p>`)
      +sGrp('Movimento',rg('pdn','Quantità di particelle',0,2,.1,gfxPct)+rg('shk','Scossoni dello schermo',0,1.5,.05,gfxPct))+gfx3DHTML()}
  else if(k==='v3d')h+=gfx3DHTML();return h};
{const a0=applySet;applySet=function(k){a0(k);if(k==='gam'||k==='sat'||k==='con')uFx()}}
document.head.insertAdjacentHTML('beforeend',`<style>.gfxv{font-weight:600;color:#ffd84a;margin-left:6px;font-size:12px}</style>`);
uFx();
/* ---- più fluido: l'acqua ---- 
   L'acqua (fiumi, laghi, mare) era la cosa più pesante da disegnare: migliaia di caselle riempite e ripassate a ogni
   fotogramma. Ora si disegna su un foglio a parte poche volte al secondo (le onde sono lente) e a ogni fotogramma si copia
   il foglio, spostato con la telecamera. Con gli effetti Ultra (riflessi) resta il disegno di prima. */
const WCL={c:null,x:null,t:-9,tx:0,ty:0,k:0,zk:null,M:null,w:0,h:0,m:0,n:0,dt:.07};
function wMark(){const st=FAST.st,wo=FAST.wo,fr=FAST.frame;if(!st||!wo)return;const vx=W/2/S+100,vy0=H/2/S+100,vy1=H/2/S+160;
  for(let d=0;d<2*N-1;d++){const y0=Math.max(0,d-N+1),y1=Math.min(d,N-1);for(let x=y0;x<=y1;x++){const y=d-x;if(M[y][x]!==2)continue;const ex=PX(x,y)-camX,ey=PY(x,y,0)-camY;if(Math.abs(ex)>=vx||ey<=-vy1||ey>=vy0)continue;
    if(fWspec(x,y))continue;const i=y*N+x;if((x>0&&st[i-1]!==1)||(y>0&&st[i-N]!==1)||(x>0&&y>0&&st[i-N-1]!==1))wo[i]=fr}}}
const _fastWater737=fastWater;fastWater=function(){if(SET.ultra||!SET.wfast||!ZZ||typeof document==='undefined'){_fastWater737();return}
  const k=S*DPR,m=Math.max(8,Math.round(Math.min(96*DPR,90*k))),cw=cv.width+2*m,ch=cv.height+2*m,dx=FAST.tx-WCL.tx,dy=FAST.ty-WCL.ty;
  const stale=!WCL.c||WCL.zk!==Zk||WCL.M!==M||WCL.n!==N||Math.abs(WCL.k-k)>1e-6||WCL.w!==cw||WCL.h!==ch||Math.abs(dx)>m*.85||Math.abs(dy)>m*.85||t-WCL.t>WCL.dt||t<WCL.t;
  if(stale){// 7.50: cambiando zona il foglio si rifà nuovo (prima l'acqua della zona di prima a volte restava disegnata dentro le case)
    if(!WCL.c||WCL.zk!==Zk||WCL.M!==M){WCL.c=document.createElement('canvas');WCL.x=WCL.c.getContext('2d')}if(WCL.c.width!==cw||WCL.c.height!==ch){WCL.c.width=cw;WCL.c.height=ch}
    const q=WCL.x;if(typeof q.reset==='function')q.reset();q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,cw,ch);q.setTransform(k,0,0,k,FAST.tx+m,FAST.ty+m);const og=g;g=q;try{_fastWater737()}finally{g=og}
    Object.assign(WCL,{t,tx:FAST.tx,ty:FAST.ty,k,zk:Zk,M,w:cw,h:ch,m,n:N})}else wMark();
  g.save();g.setTransform(1,0,0,1,0,0);g.drawImage(WCL.c,FAST.tx-WCL.tx-m,FAST.ty-WCL.ty-m);g.restore()};
/* ---- più fluido: la risoluzione dinamica ----
   Se il computer non ce la fa a stare dietro allo schermo, la risoluzione scende un po' da sola (fino al 60% di quella
   scelta) e risale quando torna fluido. In 3D lo fa già la vista 3D. Si spegne nelle Impostazioni → Prestazioni. */
const DYN={f:1,a:16.7,lt:0,chk:0,cool:0,good:0};
{const r0=rs;rs=function(){const v=SET.rs;if(SET.dyn&&DYN.f<1)SET.rs=v*DYN.f;try{r0()}finally{SET.rs=v}};onresize=rs}
function dynTick(ts){requestAnimationFrame(dynTick);if(!started||document.hidden||(typeof D3!=='undefined'&&D3.act)||(typeof XR!=='undefined'&&XR.s)||navigator.webdriver){DYN.lt=0;return}
  if(DYN.lt){const d=ts-DYN.lt;if(d>0&&d<250)DYN.a=DYN.a*.94+d*.06}DYN.lt=ts;if(ts<DYN.chk)return;DYN.chk=ts+500;
  const hz=Math.min(60,(typeof HZ!=='undefined'&&HZ)||60,SET.fpsmax||60),tgt=1000/hz;
  if(!SET.dyn){if(DYN.f<1){DYN.f=1;rs()}return}if(ts<DYN.cool)return;
  if(DYN.a>tgt*1.4&&DYN.f>.6){DYN.f=Math.max(.6,Math.round((DYN.f-.1)*10)/10);DYN.cool=ts+4000;DYN.good=0;rs()}
  else if(DYN.a<tgt*1.08&&DYN.f<1){if(++DYN.good>=12){DYN.f=Math.min(1,Math.round((DYN.f+.1)*10)/10);DYN.cool=ts+4000;DYN.good=0;rs()}}else DYN.good=0}
requestAnimationFrame(dynTick);
{const b0=setBody;setBody=function(k){let h=b0(k);if(k!=='perf')return h;const chk=(q,l)=>`<div class="row"><label for="s_${q}">${l}</label><input type="checkbox" id="s_${q}" ${SET[q]?'checked':''} onchange="setv('${q}',this.checked?1:0)"></div>`;
  return h+sGrp('Fluidità',chk('dyn','📉 Risoluzione dinamica: se il gioco rallenta, la risoluzione scende un po\' da sola e poi risale')+chk('wfast','🌊 Acqua veloce: fiumi, laghi e mare si disegnano poche volte al secondo')
    +`<p class="mu">${DYN.f<1?'Adesso la risoluzione è al '+Math.round(DYN.f*100)+'% di quella scelta, per andare più fluido.':'La risoluzione è quella scelta.'}</p>`)}}
{const a0=applySet;applySet=function(k){a0(k);if(k==='dyn'&&!SET.dyn&&DYN.f<1){DYN.f=1;rs()}}}
