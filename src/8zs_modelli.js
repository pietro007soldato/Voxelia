/* ================= 7.18: I MODELLI NUOVI PER CHI ERA RIMASTO ALLA GRAFICA VECCHIA =================
   Boss e nemici: il Drago di Brina, la Sfinge Antica, il Leviatano, Lord Vexmoor, il Signore della Fiamma Ignis,
   il Cavalcalupi e il nido di mitragliatrice. Animali: mucca, pecora, maiale, gallina, gatto, gabbiano e i cavalli.
   Tutti hanno lo scheletro (gruppi di pezzi che si muovono insieme), guardano nelle 8 direzioni e hanno le loro
   animazioni: camminata, attesa, attacco; gli animali brucano, scodinzolano, beccano e sbattono le ali. */
const MS=(c,k)=>shx(c,k);
/* ---- il drago (e la sfinge, che è un leone alato con il volto umano) ---- */
function mDrake(o){const L=rgNew('d'),c=o.c,c2=o.c2||MS(c,.78),w=o.w||MS(c,1.25),ey=o.ey||'#ffd040',cl=o.cl||'#e8e8f0';const A=(g,...b)=>rgAdd(L,g,b);
  // zampe con gli artigli
  for(const[g,x,y]of[['q0',-.24,.2],['q1',.13,.2],['q2',-.24,-.32],['q3',.13,-.32]]){A(g,x,y,0,.11,.12,9,c2);A(g,x-.01,y+.08,0,.13,.06,1.4,cl);A(g,x,y-.02,6,.12,.14,4,c)}
  // corpo, ventre a scaglie, cresta
  A('bd',-.25,-.38,8,.5,.68,11,c);A('bd',-.19,-.32,7,.38,.56,2.2,w);for(let i=0;i<5;i++)A('bd',-.2,-.3+i*.12,7.3,.4,.015,1.8,MS(w,.85));
  if(o.mane)A('bd',-.27,.06,15,.54,.26,8,o.mane);
  for(let i=0;i<5;i++)A('bd',-.035,-.32+i*.13,19,.07,.08,2.5+(i%2)*1.5,o.sp||cl);
  // collo
  const nl=o.neck==null?3:o.neck;for(let i=0;i<nl;i++)A('n'+i,-.09,.26+i*.1,15+i*4.5,.18,.15,7,i%2?c:MS(c,.92));
  const hz=15+nl*4.5+(o.human?2:4),hy=.24+nl*.1;
  if(o.human){// testa umana con il copricapo
    A('hd',-.13,hy,hz,.26,.24,9,o.sk||'#d8b07a');A('hd',-.09,hy+.24,hz+5,.06,.012,1.6,'#111');A('hd',.03,hy+.24,hz+5,.06,.012,1.6,'#111');A('hd',-.05,hy+.24,hz+2,.1,.012,1,'#7a4a2a');
    A('hd',-.16,hy-.04,hz+6,.32,.3,5,o.hat||'#d4af37');A('hd',-.16,hy-.04,hz+7.5,.32,.3,.8,'#2a5fd0');A('hd',-.16,hy-.04,hz+9.5,.32,.3,.8,'#2a5fd0');
    A('hd',-.17,hy-.02,hz-4,.07,.12,10,o.hat||'#d4af37');A('hd',.1,hy-.02,hz-4,.07,.12,10,o.hat||'#d4af37');A('hd',-.04,hy+.2,hz-3,.08,.03,3,'#3a2a1a')}
  else{A('hd',-.13,hy,hz,.26,.28,9,c);A('hd',-.09,hy+.26,hz,.18,.2,5.5,c);A('hd',-.08,hy+.43,hz+4,.04,.02,1.2,'#1a1a1a');A('hd',.04,hy+.43,hz+4,.04,.02,1.2,'#1a1a1a');
    A('hd',-.12,hy+.2,hz+6,.05,.012,2,ey);A('hd',.07,hy+.2,hz+6,.05,.012,2,ey);
    A('jw',-.08,hy+.28,hz-2.5,.16,.17,2.5,c2);A('jw',-.07,hy+.42,hz-.4,.03,.02,1.3,cl);A('jw',.04,hy+.42,hz-.4,.03,.02,1.3,cl);
    A('hd',-.13,hy-.04,hz+8,.05,.05,6,cl);A('hd',.08,hy-.04,hz+8,.05,.05,6,cl);A('hd',-.15,hy-.1,hz+12,.04,.05,4,cl);A('hd',.11,hy-.1,hz+12,.04,.05,4,cl)}
  // ali: attaccatura e punta, con le ossa
  if(o.wings!==0){const wc=o.wc||w;A('wl',-.62,-.22,21,.38,.38,1.4,wc);A('wl',-.62,-.22,22.2,.38,.04,1.2,c2);A('wo',-1.0,-.26,23,.4,.3,1.2,MS(wc,.9));A('wo',-1.0,-.26,24,.4,.04,1.2,c2);
    A('wr',.24,-.22,21,.38,.38,1.4,wc);A('wr',.24,-.22,22.2,.38,.04,1.2,c2);A('wp',.62,-.26,23,.4,.3,1.2,MS(wc,.9));A('wp',.62,-.26,24,.4,.04,1.2,c2)}
  // coda a segmenti con la punta
  const tn=o.tail==null?6:o.tail;for(let i=0;i<tn;i++){const k=1-i/tn;A('t'+i,-.07*k-.01,-.42-i*.13,10-i*1.3,.14*k+.04,.14,Math.max(1.5,5*k),i%2?c:MS(c,.9))}
  if(tn&&!o.tuft)A('t'+(tn-1),-.06,-.42-tn*.13,10-tn*1.3,.12,.1,2,cl);if(o.tuft)A('t'+(tn-1),-.05,-.42-tn*.13,9-tn*1.3,.1,.1,3,o.tuft);
  for(const q of o.x||[])rgAdd(L,q[0],q.slice(1));L.nn=nl;L.nt=tn;L.top=o.top||46;L.rng=o.rng;return rgScale(L,o.s||1)}
/* ---- la piovra degli abissi ---- */
function mKraken(o){const L=rgNew('k'),c=o.c,c2=o.c2||MS(c,.75),ey=o.ey||'#ffe040';const A=(g,...b)=>rgAdd(L,g,b);
  const T=o.arms||8,S=o.seg||5;
  for(let i=0;i<T;i++){const a=i/T*Math.PI*2+Math.PI/T;for(let j=0;j<S;j++){const r=.3+j*.15,sz=.16-j*.022;A('e'+i+'_'+j,Math.cos(a)*r-sz/2,Math.sin(a)*r-sz/2,Math.max(0,5-j*1.1),sz,sz,3.5-j*.35,j%2?c2:c);if(j<S-1&&j%2===0)A('e'+i+'_'+j,Math.cos(a)*r-.02,Math.sin(a)*r-.02,Math.max(0,5-j*1.1)+3.4-j*.35,.04,.04,.6,'#f0d0c8')}}
  A('bd',-.34,-.32,5,.68,.62,14,c);A('bd',-.3,-.3,19,.6,.56,6,MS(c,1.08));A('bd',-.22,-.28,25,.44,.44,6,MS(c,1.15));A('bd',-.12,-.22,31,.24,.3,4,MS(c,1.2));
  for(let i=0;i<6;i++)A('bd',-.3+(i%3)*.22,-.25+(i>>1)*.1,21+(i%2)*4,.06,.06,1.2,MS(c,1.45));
  A('hd',-.22,.29,13,.14,.03,4,'#f8f0d0');A('hd',.08,.29,13,.14,.03,4,'#f8f0d0');A('hd',-.18,.31,14,.06,.02,2.4,ey);A('hd',.12,.31,14,.06,.02,2.4,ey);A('hd',-.17,.32,15,.03,.01,1.2,'#0a0a0a');A('hd',.13,.32,15,.03,.01,1.2,'#0a0a0a');
  A('jw',-.06,.3,6,.12,.06,3,'#2a1a1a');A('jw',-.04,.35,6.5,.08,.04,1.6,'#d8c8a0');
  L.na=T;L.ns=S;L.top=o.top||42;return rgScale(L,o.s||1)}
/* ---- il nido di mitragliatrice: sacchi, arma e mitragliere ---- */
function mNest(){const L=rgNew('mg');const A=(g,...b)=>rgAdd(L,g,b);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=Math.cos(a)*.38,y=Math.sin(a)*.38;A('sb',x-.13,y-.1,0,.26,.2,4,i%2?'#a8916a':'#9e886a');A('sb',x-.11,y-.09,4,.22,.18,3.5,i%2?'#9e886a':'#b09a72')}
  A('sb',-.3,-.3,0,.6,.6,1,'#6a5a3a');
  // il mitragliere
  A('ll',-.12,-.32,0,.1,.12,6,'#4a4a2a');A('lr',.04,-.32,0,.1,.12,6,'#4a4a2a');A('bd',-.15,-.36,6,.3,.2,9,'#5a5a3a');A('al',-.24,-.2,9,.08,.24,3,'#5a5a3a');A('ar',.16,-.2,9,.08,.24,3,'#5a5a3a');
  A('hd',-.1,-.33,15,.2,.18,6,'#d8b07a');A('hd',-.13,-.36,20,.26,.24,3,'#4a4a2a');A('hd',-.15,-.38,19.5,.3,.28,.8,'#3a3a20');A('hd',-.06,-.15,17,.04,.01,1.4,'#111');A('hd',.02,-.15,17,.04,.01,1.4,'#111');
  // l'arma: treppiede, corpo, canna, nastro
  A('gn',-.02,-.05,0,.04,.04,8,'#3a3a3a');A('gn',-.14,-.12,0,.04,.04,7,'#3a3a3a');A('gn',.1,-.12,0,.04,.04,7,'#3a3a3a');A('gn',-.07,-.16,8,.14,.32,4,'#4a4a4e');A('gn',-.08,-.18,8.5,.16,.14,5,'#5a5a5e');
  A('gn',-.03,.14,9.5,.06,.36,1.6,'#2a2a2a');A('gn',-.045,.12,9,.09,.14,2.6,'#5a5a5e');A('gn',.08,-.12,9,.08,.2,1.2,'#c8a040');
  A('fl',-.08,.48,8.5,.16,.14,3.5,'#fff2a0');A('fl',-.05,.52,9.2,.1,.18,2,'#ffffff');
  L.top=30;return rgScale(L,1)}
/* ---- animali ---- */
function mBeast(o){const L=rgNew('q'),s=o.s||1,c=o.c,c2=o.c2||MS(c,.8),ey=o.ey||'#111',lh=o.leg||6,bh=o.bh||8;const A=(g,...b)=>rgAdd(L,g,b);
  const lw=o.lw||.09,bw=o.bw||.32,bl=o.bl||.6,hx=bw/2;
  for(const[g,x,y]of[['q0',-hx+.01,bl/2-.14],['q1',hx-lw-.01,bl/2-.14],['q2',-hx+.01,-bl/2+.04],['q3',hx-lw-.01,-bl/2+.04]]){A(g,x,y,0,lw,lw,lh,o.lc||c2);if(o.hoof)A(g,x-.005,y-.005,0,lw+.01,lw+.01,1.2,o.hoof)}
  A('bd',-hx,-bl/2,lh,bw,bl,bh,c);
  if(o.spots)for(const[x,y,z,w,d,h]of o.spots)A('bd',x,y,z+lh,w,d,h,o.sc||'#2a2a2a');
  if(o.wool){A('bd',-hx-.03,-bl/2-.03,lh+1,bw+.06,bl+.06,bh,o.wool);for(let i=0;i<4;i++)A('bd',-hx+(i%2)*bw*.5,-bl/2+.05+(i>>1)*bl*.45,lh+bh+1,bw*.5,bl*.35,1.5,MS(o.wool,1.04))}
  if(o.udder)A('bd',-.06,-bl/2+.12,lh-1.6,.12,.12,1.8,'#f0b0b0');
  if(o.mane)for(let i=0;i<4;i++)A('hd',-.04,bl/2-.08-i*.02,lh+bh+i*2.6,.08,.1,4,o.mane);
  // testa (con il collo, se lungo)
  const nz=o.neck||0,hz=lh+bh-3+nz,hy=bl/2-.04+(nz?.06:0);
  if(nz)A('hd',-.08,bl/2-.12,lh+bh-3,.16,.18,nz+3,c);
  const hw=o.hw||.24,hl=o.hl||.22,hh=o.hh||7;A('hd',-hw/2,hy,hz,hw,hl,hh,o.hc||c);
  const sw=o.snw||hw*.7;A('hd',-sw/2,hy+hl,hz,sw,o.snl||.12,o.snh||4,o.snc||c2);if(o.nose)A('hd',-sw/2+.02,hy+hl+(o.snl||.12),hz+1,sw-.04,.012,1.6,o.nose);
  A('hd',-hw/2+.03,hy+hl+.002,hz+hh-3,.045,.012,1.6,ey);A('hd',hw/2-.075,hy+hl+.002,hz+hh-3,.045,.012,1.6,ey);
  const ec=o.ec||c;if(o.ears==='up'){A('hd',-hw/2,hy+.04,hz+hh,.06,.05,3.5,ec);A('hd',hw/2-.06,hy+.04,hz+hh,.06,.05,3.5,ec)}
  else if(o.ears==='flop'){A('hd',-hw/2-.05,hy+.06,hz+hh-3,.06,.08,3,ec);A('hd',hw/2-.01,hy+.06,hz+hh-3,.06,.08,3,ec)}
  else if(o.ears==='side'){A('hd',-hw/2-.08,hy+.05,hz+hh-2,.09,.05,1.6,ec);A('hd',hw/2-.01,hy+.05,hz+hh-2,.09,.05,1.6,ec)}
  if(o.horns){A('hd',-hw/2-.04,hy+.04,hz+hh-.5,.07,.05,1.6,o.horns);A('hd',hw/2-.03,hy+.04,hz+hh-.5,.07,.05,1.6,o.horns);A('hd',-hw/2-.05,hy+.04,hz+hh+1,.04,.04,2.2,o.horns);A('hd',hw/2+.01,hy+.04,hz+hh+1,.04,.04,2.2,o.horns)}
  if(o.blaze)A('hd',-.025,hy+hl-.005,hz+1,.05,.012,hh-2,o.blaze);
  // coda
  if(o.tail==='curl'){A('tl',-.02,-bl/2-.04,lh+bh-3,.05,.05,2,c2);A('tl',-.02,-bl/2-.07,lh+bh-1,.05,.05,1.6,c2)}
  else if(o.tail==='long'){for(let i=0;i<4;i++)A('tl',-.03,-bl/2-.04-i*.07,lh+bh-1-i*1.3,.06,.08,2,o.tc||c)}
  else if(o.tail==='hair'){A('tl',-.04,-bl/2-.04,lh+bh-6,.08,.06,7,o.tc||c2)}
  else if(o.tail!==0){A('tl',-.03,-bl/2-.03,lh+bh-5,.05,.05,5,o.tc||c);A('tl',-.04,-bl/2-.04,lh+bh-7,.07,.06,2,o.tc2||c2)}
  for(const q of o.x||[])rgAdd(L,q[0],q.slice(1));L.top=o.top||(lh+bh+hh+4);L.ani=o.ani||'graze';return rgScale(L,s)}
function mBird(o){const L=rgNew('b'),s=o.s||1,c=o.c,c2=o.c2||MS(c,.85);const A=(g,...b)=>rgAdd(L,g,b);const lh=o.leg||4;
  A('q0',-.07,-.02,0,.03,.03,lh,o.lc||'#e8a020');A('q1',.04,-.02,0,.03,.03,lh,o.lc||'#e8a020');A('q0',-.08,.0,0,.06,.06,.6,o.lc||'#e8a020');A('q1',.03,.0,0,.06,.06,.6,o.lc||'#e8a020');
  A('bd',-.12,-.16,lh,.24,.3,o.bh||7,c);A('bd',-.1,-.24,lh+3,.2,.1,o.tlh||3,o.tlc||c2);if(o.breast)A('bd',-.09,.13,lh+1,.18,.02,4,o.breast);
  A('wl',-.15,-.12,lh+2,.04,.22,4,o.wc||c2);A('wr',.11,-.12,lh+2,.04,.22,4,o.wc||c2);if(o.tip){A('wl',-.15,-.18,lh+2,.04,.08,2,o.tip);A('wr',.11,-.18,lh+2,.04,.08,2,o.tip)}
  const hz=lh+(o.bh||7)-1;A('hd',-.08,.06,hz,.16,.14,5,o.hc||c);A('hd',-.03,.2,hz+1.5,.06,o.bl||.07,1.6,o.bk||'#e8a020');
  A('hd',-.08,.17,hz+3,.03,.01,1.2,'#111');A('hd',.05,.17,hz+3,.03,.01,1.2,'#111');if(o.comb){A('hd',-.03,.08,hz+5,.06,.1,2.2,o.comb);A('hd',-.025,.18,hz,.05,.02,2,o.comb)}
  L.top=o.top||16;return rgScale(L,s)}
/* ---- le pose dei modelli nuovi ---- */
function poseOut(L,O,skip){const n=L.length,R=[];for(let i=0;i<n;i++){if(skip&&skip(i))continue;const b=L[i],o=i*4;R.push([b[0]+O[o],b[1]+O[o+1],b[2]+O[o+2],b[3],b[4],Math.max(.3,b[5]+O[o+3]),b[6]])}return R}
function rigPose718(L,e){const n=L.length,O=new Float32Array(n*4),G=L.g,ph=(e.id||0)*1.37,mv=t-(e.mvT||-9)<.18,lt=t-(e.atkT||-9),atk=lt>=0&&lt<ATK,k=L.kind;
  const add=(g,dx,dy,dz,dh)=>{const I=G[g];if(!I)return;for(const i of I){const o=i*4;O[o]+=dx;O[o+1]+=dy;O[o+2]+=dz;O[o+3]+=dh||0}};
  const all=(dx,dy,dz)=>{for(let i=0;i<n;i++){O[i*4]+=dx;O[i*4+1]+=dy;O[i*4+2]+=dz}};
  const inR=P&&e.r&&dist(e,P)<=e.r*1.05,wind=!atk&&inR&&e.cdt>0&&e.cdt<.4?ease3(1-e.cdt/.4):0,st=atk?(lt<.1?ease3(lt/.1):1-ease3((lt-.1)/.35)):0;
  const w=t*(e.sp>2.5?11:8)+ph,s=Math.sin(w);
  if(k==='d'){const nn=L.nn||3,nt=L.nt||6,up=['bd','hd','jw','wl','wr','wo','wp'];
    if(mv&&!atk){const a=Math.max(0,s)*3,b=Math.max(0,-s)*3;add('q0',0,s*.1,a,-a*.5);add('q3',0,s*.1,a,-a*.5);add('q1',0,-s*.1,b,-b*.5);add('q2',0,-s*.1,b,-b*.5);
      const bob=Math.abs(Math.cos(w))*1.4;for(const g of up)add(g,0,0,bob,0);for(let i=0;i<nn;i++)add('n'+i,Math.sin(w*.5)*.015*i,0,bob,0);add('hd',Math.sin(w*.5)*.04,0,bob,0);add('jw',Math.sin(w*.5)*.04,0,0,0);
      const f=Math.sin(t*6+ph);add('wl',0,0,f*2,0);add('wr',0,0,f*2,0);add('wo',.06*f,0,f*5,0);add('wp',-.06*f,0,f*5,0)}
    else{const b=Math.sin(t*1.6+ph);for(const g of up)add(g,0,0,b*.7,0);for(let i=0;i<nn;i++)add('n'+i,0,0,b*.7*(i+1)/nn,0);
      add('hd',Math.sin(t*.6+ph)*.06,0,b*.6,0);add('jw',Math.sin(t*.6+ph)*.06,0,0,0);const f=Math.sin(t*1.2+ph);add('wl',0,0,f*.8,0);add('wr',0,0,f*.8,0);add('wo',.02*f,0,f*1.8,0);add('wp',-.02*f,0,f*1.8,0)}
    for(let i=0;i<nt;i++)add('t'+i,Math.sin(t*(mv?5:2.2)+ph-i*.7)*.03*i,0,Math.sin(t*1.7+ph-i)*.3,0);
    if(atk||wind){const p=st,q=wind;add('q0',0,.04*p,6*p+3*q,0);add('q1',0,.04*p,6*p+3*q,0);for(const g of up)add(g,0,-.04*q+.06*p,4*p+3*q,0);
      for(let i=0;i<nn;i++)add('n'+i,0,(-.05*q+.12*p)*(i+1)/nn,(3*q-2*p)*(i+1)/nn+4*p,0);add('hd',0,-.08*q+.26*p,4*q-2*p+4*p,0);add('jw',0,-.08*q+.26*p,4*q-6*p+4*p,0);
      add('wl',0,0,6*(p+q),0);add('wr',0,0,6*(p+q),0);add('wo',.1*(p+q),0,14*(p+q),0);add('wp',-.1*(p+q),0,14*(p+q),0)}}
  else if(k==='k'){const na=L.na||8,ns=L.ns||5,br=Math.sin(t*1.8+ph);add('bd',0,0,br*1.2,br*.8);add('hd',0,0,br*1.2,0);add('jw',0,0,br*1.2+Math.max(0,Math.sin(t*3+ph))*-.8,0);
    for(let i=0;i<na;i++){const a=i/na*Math.PI*2+Math.PI/na,fr=Math.sin(a)>.2;for(let j=0;j<ns;j++){const q=Math.sin(t*(mv?4.5:2.6)+ph+i*1.1-j*.8)*(1+j*.9);let dx=-Math.sin(a)*q*.025,dy=Math.cos(a)*q*.025,dz=Math.max(-3,q*.6);
      if(fr&&(atk||wind)){dz+=(6+j*5)*wind*(1-st)+(j*1.5)*st;dy+=.12*j*st;dz-=j*2*st}
      add('e'+i+'_'+j,dx,dy,dz,0)}}
    if(atk)all(0,.12*st,0)}
  else if(k==='mg'){const fire=atk&&Math.floor(lt*24)%2===0;add('hd',0,0,Math.sin(t*1.5+ph)*.3,0);add('bd',0,0,Math.sin(t*1.5+ph)*.2,0);
    if(atk){const r=Math.sin(lt*60)*.025;add('gn',0,-Math.abs(r),Math.abs(r)*6,0);add('hd',0,-Math.abs(r)*.6,0,0);add('al',0,-Math.abs(r),0,0);add('ar',0,-Math.abs(r),0,0)}
    return poseOut(L,O,i=>G.fl&&G.fl.includes(i)&&!fire)}
  return poseOut(L,O)}
// gli animali: camminano, brucano, si guardano intorno, scodinzolano; gli uccelli beccano e sbattono le ali
function animalPose(L,e){const n=L.length,O=new Float32Array(n*4),G=L.g;
  const add=(g,dx,dy,dz,dh)=>{const I=G[g];if(!I)return;for(const i of I){const o=i*4;O[o]+=dx;O[o+1]+=dy;O[o+2]+=dz;O[o+3]+=dh||0}};
  const ph=e.nph==null?(e.nph=(e.px*7.3+e.py*3.1)%6.28):e.nph,T=t+ph,mv=(e.path&&e.path.length)||t-(e.nmv||-9)<.2,cyc=p=>(T%p)/p;
  if(L.kind==='b'){if(mv){const s=Math.sin(T*16);add('q0',0,s*.04,Math.max(0,s)*1.4,0);add('q1',0,-s*.04,Math.max(0,-s)*1.4,0);for(const g of['bd','hd','wl','wr'])add(g,0,0,Math.abs(s)*.8,0);add('hd',0,.03*s,0,0)}
    else{const f=cyc(5);if(f<.25){const p=Math.abs(Math.sin(f/.25*Math.PI*3));add('hd',0,.06*p,-3*p,0);add('bd',0,.02*p,-.4*p,0)}
      else if(f>.86){const a=Math.sin((f-.86)/.14*Math.PI),fl=Math.sin(T*30)*a;add('wl',-.05*a,0,1.5*a+fl*2,-1*a);add('wr',.05*a,0,1.5*a+fl*2,-1*a)}
      else add('hd',Math.sin(T*.9)*.02,0,Math.sin(T*2.4)*.2,0)}
    return poseOut(L,O)}
  // quadrupedi
  if(mv){const s=Math.sin(T*9),a=Math.max(0,s)*2.4,b=Math.max(0,-s)*2.4;add('q0',0,s*.08,a,-a);add('q3',0,s*.08,a,-a);add('q1',0,-s*.08,b,-b);add('q2',0,-s*.08,b,-b);
    const bob=Math.abs(Math.cos(T*9))*.9;for(const g of['bd','hd','tl'])add(g,0,0,bob,0);add('hd',0,0,Math.sin(T*18)*.4,0);add('tl',Math.sin(T*6)*.03,0,0,0)}
  else{const br=Math.sin(T*1.8)*.3;add('bd',0,0,br,0);add('tl',Math.sin(T*3.2)*.05,0,br,0);
    const f=cyc(L.ani==='cat'?7:9);
    if(L.ani==='graze'&&f<.45){const p=f<.08?ease3(f/.08):f>.37?1-ease3((f-.37)/.08):1;add('hd',0,.05*p,-6*p+Math.abs(Math.sin(T*7))*.6*p,0)}
    else if(L.ani==='cat'&&f<.3){const p=Math.sin(f/.3*Math.PI);add('hd',0,0,-.5*p,0);add('tl',Math.sin(T*8)*.06*p,0,1.5*p,0);add('bd',0,0,-1*p,0)}
    else if(f>.8){const p=Math.sin((f-.8)/.2*Math.PI);add('hd',Math.sin(T*1.6)*.05*p,0,.8*p,0)}
    else add('hd',0,0,br,0)}
  return poseOut(L,O)}
/* ---- i modelli ---- */
const AM718={
  mucca:(v)=>mBeast({s:1.12,c:v||'#f2efe8',c2:'#e0dcd2',lc:'#e8e4da',hoof:'#3a2a1a',bw:.36,bl:.72,leg:7,bh:9,hw:.26,hl:.2,hh:7,snc:'#e8a8a8',nose:'#a85a5a',snl:.1,ears:'side',ec:'#2a2a2a',horns:'#e8e0c8',udder:1,
    spots:[[-.19,-.2,3,.02,.22,5],[.17,.05,2,.02,.2,6],[-.1,-.36,4,.2,.02,4],[-.12,.1,9,.2,.18,.6],[.02,-.25,9,.14,.2,.6]],tail:'hair',tc:'#2a2a2a',ani:'graze'}),
  pecora:(v)=>mBeast({s:.85,c:'#3a3a3a',c2:'#2a2a2a',lc:'#2a2a2a',wool:v||'#f4f2ea',bw:.34,bl:.56,leg:5,bh:8,hw:.2,hl:.18,hh:6,snw:.14,snl:.08,snc:'#3a3a3a',ears:'side',ec:'#2a2a2a',tail:'curl',ani:'graze'}),
  maiale:(v)=>mBeast({s:.85,c:v||'#f0a8a8',c2:'#e09090',bw:.36,bl:.6,leg:4,bh:9,hw:.26,hl:.18,hh:7,snw:.14,snl:.07,snh:3.4,snc:'#f8b8b8',nose:'#c86a6a',ears:'flop',ec:'#e09090',tail:'curl',ani:'graze'}),
  gatto:(v)=>mBeast({s:.55,c:v||'#e09a40',c2:'#c88030',bw:.22,bl:.52,leg:6,bh:6,hw:.24,hl:.2,hh:7,snw:.12,snl:.06,snh:3,snc:'#f0c890',nose:'#e88a8a',ey:'#2a8a3a',ears:'up',tail:'long',tc:'#c88030',ani:'cat',
    spots:[[-.12,-.2,5.8,.24,.04,.4],[-.12,-.05,5.8,.24,.04,.4],[-.12,.1,5.8,.24,.04,.4]],sc:'#b87028'}),
  cavallo:(v,k)=>mBeast({s:1.2,c:v||'#8a5a32',c2:MS(v||'#8a5a32',.82),lc:MS(v||'#8a5a32',.82),hoof:'#2a2018',bw:.3,bl:.78,leg:11,bh:9,neck:7,hw:.18,hl:.18,hh:6,snw:.14,snl:.2,snh:4,snc:MS(v||'#8a5a32',.9),nose:'#2a1a10',
    ears:'up',mane:k||'#2a1a10',tail:'hair',tc:k||'#2a1a10',blaze:'#f0ece4',top:40,ani:'graze',
    x:[['bd',-.16,-.1,19,.32,.3,1.2,'#6a3a1a'],['bd',-.17,-.08,14,.34,.04,6,'#5a2a14'],['bd',-.17,-.08,14,.04,.04,6,'#5a2a14']]}),
  gallina:(v)=>mBird({s:1,c:v||'#f4f4f0',c2:MS(v||'#f4f4f0',.88),comb:'#d02020',bk:'#e8a020',tlh:5,ani:'peck'}),
  gabbiano:()=>mBird({s:1,c:'#f4f4f4',wc:'#9a9aa4',tip:'#2a2a2a',tlc:'#e8e8ec',bk:'#e8b020',bl:.12,lc:'#e8a020',leg:5,bh:6})};
ANM.mucca=()=>AM718.mucca();ANM.pecora=()=>AM718.pecora();ANM.maiale=()=>AM718.maiale();ANM.gabbiano=()=>AM718.gabbiano();ANM.gallina=()=>AM718.gallina();
ANM.cavallo=()=>AM718.cavallo('#8a5a32','#2a1a10');ANM.cavallo2=()=>AM718.cavallo('#e8e4dc','#a8a094');ANM.cavallo3=()=>AM718.cavallo('#2a2a2e','#5a5a62');
// un animale con il modello vecchio (passato a mano) prende quello nuovo, con il suo colore
const firstCol=m=>{try{return Array.isArray(m)&&m[0]&&m[0][6]||null}catch(_){return null}};
function animalNew(id,m){if(m&&m.rg)return m;const c=firstCol(m);
  if(id==='gallina')return AM718.gallina(c);if(id==='gatto')return AM718.gatto(c&&c!=='#e09a40'?c:null);if(id==='mucca'||id==='pecora'||id==='maiale'||id==='gabbiano')return AM718[id]();
  if(id==='cavallo'||id==='cavallo2'||id==='cavallo3')return ANM[id]();return m}
const _mkNpc718=mkNpc;mkNpc=function(id,x,y,o){const e=_mkNpc718(id,x,y,o);if(ANIMN.has(id)&&e.m&&!e.m.rg){const m2=animalNew(id,e.m);if(m2)e.m=m2}return e};
// chi assegna il modello dopo (e.m=ANM[id]() o un modello fatto a mano): si corregge al primo disegno
const _npcPose718=npcPose;npcPose=function(L,e){if(L&&(L.kind==='q'||L.kind==='b'))return animalPose(L,e);return _npcPose718(L,e)};
const _ent718=ent;ent=function(e){if(e&&e.k==='npc'&&ANIMN.has(e.nid)&&e.m&&!e.m.rg){const m2=animalNew(e.nid,e.m);if(m2)e.m=m2}return _ent718(e)};
/* ---- i nemici ---- */
(function(){const set=(k,m)=>{if(E[k])E[k].m=m};
  set('drago_brina',mDrake({s:1.75,c:'#9fc8e8',c2:'#7aa8cc',w:'#dff2ff',wc:'#cfe8fa',ey:'#40e0ff',cl:'#f4fbff',sp:'#e8f6ff',top:52}));
  set('sfinge',mDrake({s:1.7,c:'#d4b25a',c2:'#b8963a',w:'#e8cc80',wc:'#e0c070',human:1,sk:'#c8965a',hat:'#d4af37',neck:1,tail:4,tuft:'#8a6a2a',cl:'#e8e0c8',sp:'#d4af37',top:50}));
  set('leviatano',mKraken({s:1.65,c:'#2a5a7a',c2:'#1e4a66',ey:'#ffe040',top:56}));
  set('vexmoor',mFloat({s:1.55,kind:'ghost',c:'#9a7ad8',hc:'#b8a0f0',ey:'#e8f0ff',hair:'#6a4aa8',x:[...HT.crown('#c8c0e8').map(q=>{const r=q.slice();r[3]+=6.5;return r}),['bd',-.24,-.16,12,.48,.06,16,'#5a3a98'],['ar',.26,.0,13,.05,.07,22,'#d8d0f8'],['ar',.2,-.04,12,.16,.13,1.6,'#8a6ad0'],['bd',-.05,.12,22,.1,.02,3,'#e8e0ff']],top:44}));
  set('ignis',mHum({s:2.05,sk:'#3a1408',tp:'#2a0a0a',lg:'#1a0606',ar:'#3a1408',hd:'#2a0a06',ey:'#ffd040',mouth:'#ff7a2a',belt:'#ff7a2a',
    x:[...HT.horns('#1a0a06',1),['hd',-.15,-.12,28.5,.3,.25,2,'#ffcc33'],['hd',-.12,-.1,30.5,.05,.05,3,'#ff9a2a'],['hd',-.025,-.1,30.5,.05,.05,4.5,'#ffcc33'],['hd',.07,-.1,30.5,.05,.05,3,'#ff9a2a'],
      ['bd',-.15,.125,11,.02,.01,8,'#ff7a2a'],['bd',.08,.125,13,.02,.01,6,'#ff7a2a'],['bd',-.26,-.16,9,.52,.06,14,'#4a0a04'],
      ['fx',-.1,-.06,33,.2,.14,4,'#ff7a2a'],['fx',-.06,-.03,37,.12,.08,3,'#ffcc33'],['al',-.34,-.05,8,.12,.12,2,'#ff9a2a'],...WP.big('#ff6a2a')],top:40}));
  set('cavalcalupi',(()=>{const L=mQuad({s:1.12,c:'#7a6a5a',c2:'#5a4a3a',ey:'#ffd040',mane:'#5a4a3a'});const R=L.slice();R.kind=L.kind;R.g=JSON.parse(JSON.stringify(L.g));R.rg=1;
    const sc=1.12,add=(g,b)=>{(R.g[g]=R.g[g]||[]).push(R.length);R.push([b[0]*sc,b[1]*sc,b[2]*sc,b[3]*sc,b[4]*sc,b[5]*sc,b[6]])};
    const g='#5aa84a';[[-.13,-.12,13,.26,.2,7,'#4a6b2a'],[-.2,-.12,10,.08,.14,5,'#4a6b2a'],[.12,-.12,10,.08,.14,5,'#4a6b2a'],[-.1,-.1,20,.2,.17,6,g],[-.07,.075,23,.04,.01,1.4,'#ffd040'],[.03,.075,23,.04,.01,1.4,'#ffd040'],
      [-.16,-.08,22,.07,.05,2.5,g],[.09,-.08,22,.07,.05,2.5,g],[-.09,-.12,26,.18,.15,1.5,'#663333'],[-.18,-.04,15,.07,.18,2.4,'#4a6b2a'],[.11,-.04,15,.07,.18,2.4,'#4a6b2a'],
      [.16,.0,14,.04,.04,14,'#6a4a2a'],[.13,-.03,26,.1,.1,4,'#9aa0aa'],[-.16,-.16,9,.32,.36,2,'#6a3a1a']].forEach(b=>add('bd',b));R.top=40;return R})());
  set('mitragliatrice',mNest())})();
const _rigPose718=rigPose;rigPose=function(L,e){if(L&&(L.kind==='d'||L.kind==='k'||L.kind==='mg'))return rigPose718(L,e);return _rigPose718(L,e)};
