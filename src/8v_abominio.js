/* ================= 7.11: l'Abominio, cinque fasi =================
   Il boss del vero finale diventa la battaglia più dura del gioco:
   1 · Le braccia: quattro braccia che schiacciano e spazzano la stanza; più ne cadono, più le altre si arrabbiano.
   2 · Il ventre: sputa acido e onde di vomito, e ogni tanto si chiude (non si può colpire) mentre escono le anime perdute.
   3 · L'eco della Regina: dal ventre squarciato esce l'ombra della Regina Elara, presa dall'Abominio la notte della nebbia.
       Va liberata, non uccisa: quando cade, la sua benedizione rende i tuoi colpi più forti fino alla fine.
   4 · La testa: l'Occhio si apre; raggi diretti, uno sguardo che ruota per metà stanza, anelli di colpi e anime.
   5 · Il cuore: la nebbia stringe l'arena, tutti gli attacchi insieme; il fantasma di Malakar ti protegge a intervalli.
   Gli attacchi sono sempre annunciati (cerchi rossi a terra): chi li legge e si sposta in tempo può vincere. */
Object.assign(E.abo_braccio,{hp:1100,at:22});Object.assign(E.abo_ventre,{hp:3000,at:24});Object.assign(E.abo_testa,{hp:3800,at:28});
Object.assign(E.anima,{hp:110,at:30,sp:2.4,xp:30});
E.abo_cuore={n:'Cuore dell\'Abominio',hp:3400,at:30,xp:2500,sp:0,r:2.8,cd:1.6,ag:40,np:1,pt:1,m:[]};
E.elara_ombra={n:'Ombra della Regina Elara',hp:2600,at:62,xp:1200,sp:2.7,r:1.35,cd:1.2,ag:40,np:1,pt:1,m:[]};
Object.assign(NPCS,{elara:{n:'Regina Elara',c:'#6a2a7a',hat:'#d4af37',ln:['Aldoria è la mia casa. E le case si difendono.']},elara_o:{n:'Ombra della Regina Elara',c:'#7a6aa8',hat:'#c8c0e8',ln:['...']}});
Object.assign(NPS,{elara:'a|long:#c89a50|none|diadem|necklace,cape:#4a1a5a,collar|none|proud|f',elara_o:'a|long:#e0dcf4|none|diadem|necklace,cape:#3a2a5a|none|sad|f'});
// un modello con i colori «spenti» verso il lilla: per le ombre e i fantasmi
function ghostL(L,k=.55,tint='#b8b0e8'){const tn=parseInt(tint.slice(1),16),tr=tn>>16,tg=tn>>8&255,tb=tn&255;const f=c=>{if(typeof c!=='string'||c[0]!=='#')return c;const h=c.length===4?'#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3]:c,n=parseInt(h.slice(1,7),16),m=(a,b)=>Math.round(a+(b-a)*k);
    return'#'+((m(n>>16,tr)<<16)|(m(n>>8&255,tg)<<8)|m(n&255,tb)).toString(16).padStart(6,'0')};
  const R=L.map(b=>{const q=b.slice();q[6]=f(q[6]);return q});for(const p of['kind','g','rg','top','an','fem','hm'])if(L[p]!==undefined)R[p]=L[p];return R}
let ELM=null;function elaraShade(){if(!ELM){try{ELM=ghostL(npcModel('elara_o',{},{px:3,py:3}),.4,'#c8c0f0')}catch(_){ELM=hum('#9a8ac8','#e0dcf4',1,[3,'#c8c0e8'])}}return ELM}
const AB_D={slam:230,sweep:190,acid:190,pool:40,vomit:175,beam:210,gaze:140,nova:105,slamE:200,fog:55};
const abAt=()=>(((ZZ&&ZZ.lv)||16)*.1+1)*DF.dm;
const AB_C=[14,18.4];// il centro del pavimento davanti al mostro (dove si stringe la nebbia)
// fase visiva per il disegno originale del mostro (1 braccia, 2 ventre aperto, 3 testa abbassata)
OCCph=function(){if(!OCC)return P&&P.te>=2?4:1;return[1,1,2,2,3,3][OCC.ph]||1};
const _occEnter711=occEnter;occEnter=function(){_occEnter711();if(!OCC)return;Object.assign(OCC,{nx:3,sw:7,sm:5,bm:4,cl:9,vm:7,gz:9,tp:5,ms:3,fz:0,R:14,ph:1,elb:0,ps:0});OCCK={arms:4,ph:1};P.elb=0;P.mks=0};
function abWarn(x,y,r,tt,dmg){if(x<1||y<1||x>N-2||y>N-2)return;fx.push({k:'warn',x,y,r,t:tt,mx:tt,dmg})}
function abPart(id,x,y){const e=mk(id,x|0,y|0);e.px=e.ax=x;e.py=e.ay=y;e.al=1;ents.push(e);return e}
function abSay(s,d){abLater((d||0)/1000,()=>msg(s))}
// i ritardi della battaglia contano il tempo del gioco (pausa, rallentatore) e finiscono con lei
function abLater(d,f){if(OCC)(OCC.q=OCC.q||[]).push({t:d,f,ph:OCC.ph})}
function abPhase(n){const O=OCC;O.ph=n;O.t=0;O.nx=2.4;O.sm=4;O.bm=3;O.sw=6;O.cl=8;O.vm=5;O.gz=6;O.tp=4;O.ms=2;flash(n===5?'#ffffff':'#5a0000',.5,600);growl();O.shk=1;shake(1.2);slowmo(.4,1);
  if(n===2){abPart('abo_ventre',14,12.6);banner('Il ventre si apre','Le braccia sono cadute: ora colpisci il ventre','teschio');abSay('Malakar: «Il ventre! Quando si chiude, allontanati dall\'acido e aspetta.»',2400)}
  if(n===3){const e=mk('elara_ombra',14,17);e.px=14;e.py=17.2;e.al=1;e.m=elaraShade();e.shd=t+2.2;e.fd=[0,1];ents.push(e);
    banner('L\'eco della Regina','Dal ventre squarciato esce l\'ombra della Regina Elara','teschio');abSay('Malakar: «Elara... È lei. L\'Abominio l\'ha presa quella notte. Liberala, eroe: non è più lei.»',2000);if(cineOK()){cineOn(e,1.3,2.4);pillar(e.px,e.py,'200,180,255',1.6,50)}}
  if(n===4){abPart('abo_testa',14,12.6);banner('L\'Occhio si apre','La testa si abbassa: colpiscila, e non restare davanti allo sguardo','teschio');abSay('Malakar: «Lo sguardo gira! Corrigli dietro, non davanti!»',2600)}
  if(n===5){const c=abPart('abo_cuore',14,12.6);O.R=14;banner('Il cuore dell\'Abominio','La nebbia si stringe: distruggi il cuore prima che ti soffochi','teschio');
    const[gx,gy]=freeNear((P.px|0)-2,(P.py|0)+1);ents.push({k:'mkghost',px:gx+.5,py:gy+.5,t0:t,n:'Fantasma di Malakar'});abSay('Malakar: «Ora! Il cuore! Ti proteggo io, finché posso!»',1500);if(cineOK())cineOn(c,1.15,2.2)}}
// la Regina liberata: non muore, se ne va in pace, e lascia la sua benedizione
function elaraFree(e){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1);OCC.elb=1;P.elb=1;ents.push({k:'elara_free',px:e.px,py:e.py,t0:t,n:'Regina Elara'});
  slowmo(.35,1.4);flash('#e8e0ff',.6,900);if(cineOK()){pillar(e.px,e.py,'230,220,255',2.2,70);ringFx(e.px,e.py,'220,210,255',1.4,3);burst(e.px,e.py,30,['#ffffff','#d8d0ff','#ffe8b0'],{v:1.4,up:220,gr:-40,d:1.8,s:4,z:20})}
  jingle([64,67,71,76],.16,'triangle');banner('La Regina Elara è libera','La sua benedizione: i tuoi colpi sono più forti fino alla fine','corona');
  abLater(1.8,()=>msg('Elara: «I bambini sono al sicuro... Di\' a Malakar che gli ho sempre creduto.»'));OCC.fr=3.6}
const _kill711a=kill;kill=function(e){if(e&&e.t==='elara_ombra'&&OCC&&ents.includes(e)){elaraFree(e);return}_kill711a(e)};
const _roll711=roll;roll=function(m){return _roll711((m==null?1:m)*(P&&P.elb&&Zk==='occhio'?1.2:1))};
// lo scudo di Malakar (fase 5): per un attimo nessun colpo ti tocca
const _hurtP711=hurtP;hurtP=function(at){if(P&&P.mks>t&&Zk==='occhio'){if(!(P.mkf>t)){P.mkf=t+.4;flt(P,'Scudo di Malakar','#9adcff')}return}_hurtP711(at)};
function abSweep(cx,cy,a0,a1,n,r0,rad,dmg,t0){for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/(n-1);abWarn(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,rad,t0+i*.12,dmg)}}
function abRay(cx,cy,a,n,step,rad,dmg,t0,dt2){for(let i=1;i<=n;i++)abWarn(cx+Math.cos(a)*i*step,cy+Math.sin(a)*i*step,rad,t0+i*dt2,dmg)}
occTick=function(dt){if(Zk!=='occhio'||!OCC||!P){if(OCCZ){OCCZ=0;CZ.goal=1}return}if(!CAM.f){OCCZ=1;CZ.goal=.8}if(OCC.intro){occIntroTick(dt);return}occBeats();const O=OCC;O.t+=dt;
  if(O.q&&O.q.length){const L=O.q;O.q=[];for(const j of L){j.t-=dt;if(j.t<=0){try{j.f()}catch(_){}}else O.q.push(j)}if(OCC!==O)return}
  for(const e of ents)if(e.ax!=null){e.px=e.ax;e.py=e.ay}if(O.shk>0){O.shk-=dt;camX+=(Math.random()-.5)*14;camY+=(Math.random()-.5)*8}
  for(const p of O.pools){p.t-=dt;p.k=(p.k||0)-dt;if(p.k<=0&&Math.hypot(P.px-p.x,P.py-p.y)<p.r){p.k=.5;hurtP(p.d)}}O.pools=O.pools.filter(p=>p.t>0);
  if(O.win){O.win-=dt;if(O.win<=0){O.win=0;OCC=null;P.elb=0;P.mks=0;trueEnding()}return}
  const A=abAt(),arms=partAt('abo_braccio'),ven=partAt('abo_ventre'),ela=partAt('elara_ombra'),tes=partAt('abo_testa'),cuo=partAt('abo_cuore');
  // passaggi di fase
  if(O.ph===1&&!arms.length){abPhase(2);return}
  if(O.ph===2&&!ven.length&&O.t>1){abPhase(3);return}
  if(O.ph===3&&!ela.length&&!O.elb&&O.t>3){O.elb=1;O.fr=.6}
  if(O.ph===3&&O.fr!=null){O.fr-=dt;if(O.fr<=0){O.fr=null;abPhase(4);return}}
  if(O.ph===4&&!tes.length&&O.t>1){abPhase(5);return}
  if(O.ph===5&&!cuo.length&&O.t>1){O.win=2.4;O.shk=2;flash('#ffffff',.8,1500);growl();for(const e of ents.filter(x=>x.k==='en'))kill(e);ents=ents.filter(x=>x.k!=='mkghost');return}
  const anger=O.ph===1?1+(4-arms.length)*.16:1;
  // l'attacco principale di ogni fase
  if((O.nx-=dt*anger)<=0){
    if(O.ph===1){O.nx=arms.length<=2?2.2:2.8;const a=arms[Math.floor(Math.random()*arms.length)];if(a){a.slT=t;abWarn(P.px,P.py,1.6,.95,AB_D.slam*A);O.shk=.25;
        if(arms.length<=2){const b=arms.find(q=>q!==a)||a;b.slT=t;const k=P.dr||[0,1];abLater(.55,()=>{if(OCC.ph===1){b.slT=t;abWarn(P.px+k[0]*1.8,P.py+k[1]*1.8,1.5,.95,AB_D.slam*A)}})}}}
    else if(O.ph===2){O.nx=2.5;for(let i=0;i<5;i++){const x=P.px+(Math.random()-.5)*4.4,y=P.py+(Math.random()-.5)*4.4;abWarn(x,y,1.3,1,AB_D.acid*A);abLater(1,()=>{if(OCC.ph===2)OCC.pools.push({x,y,r:1.1,t:6,d:AB_D.pool*A})})}}
    else if(O.ph===3){O.nx=5;abWarn(P.px,P.py,1.8,1.15,AB_D.slamE*A);O.shk=.3}
    else if(O.ph===4){O.nx=3.4;const dx=P.px-14,dy=P.py-12.6;abRay(14,12.6,Math.atan2(dy,dx),12,1.1,.65,AB_D.beam*A,.65,.055)}
    else{O.nx=3;const r=Math.random();if(r<.4){abWarn(P.px,P.py,1.6,1,AB_D.slam*A);O.shk=.25}else if(r<.75){const dx=P.px-14,dy=P.py-12.6;abRay(14,12.6,Math.atan2(dy,dx),12,1.1,.65,AB_D.beam*A,.7,.05)}
      else for(let i=0;i<3;i++){const x=P.px+(Math.random()-.5)*4,y=P.py+(Math.random()-.5)*4;abWarn(x,y,1.2,1,AB_D.acid*A);abLater(1,()=>{if(OCC.ph===5)OCC.pools.push({x,y,r:1,t:5,d:AB_D.pool*A})})}}}
  // fase 1: la spazzata delle braccia
  if(O.ph===1&&(O.sw-=dt*anger)<=0){O.sw=6.2;const L=Math.random()<.5;abSweep(BX,BY+1,L?.15:2.99,L?2.99:.15,10,6.4,1.4,AB_D.sweep*A,.9);flt(P,'Spazzata!','#ff8a6a')}
  // fase 2: il ventre si chiude (immune) e libera le anime; onde di vomito a ventaglio
  if(O.ph===2){const v=ven[0];if(v&&(O.cl-=dt)<=0){O.cl=10;v.shd=t+3;O.closed=t+3;flt(v,'Si chiude!','#9adcff');if(partAt('anima').length<7)for(let i=0;i<3;i++){const[x,y]=freeNear(8+Math.floor(Math.random()*12),15+Math.floor(Math.random()*8));const m=mk('anima',x,y);m.al=1;ents.push(m)}scream()}
    if((O.vm-=dt)<=0){O.vm=9;const a0=Math.atan2(P.py-13.4,P.px-14);for(let k=-2;k<=2;k++)abRay(14,13.4,a0+k*.33,9,1.15,.6,AB_D.vomit*A,.8,.06);flt(P,'Vomito!','#9aff6a')}}
  // fase 3: l'ombra della Regina si teletrasporta, piange un anello di colpi e chiama le anime
  if(O.ph===3){const e=ela[0];if(e){if((O.tp-=dt)<=0){O.tp=5.5;for(let k=0;k<20;k++){const an=Math.random()*6.283,x=Math.floor(P.px+Math.cos(an)*2.4),y=Math.floor(P.py+Math.sin(an)*2.4);
        if(x>0&&y>0&&x<N-1&&y<N-1&&WK(M[y][x])){if(cineOK())sparks(e.px,e.py,14,['#c8c0ff','#ffffff'],60);e.px=x+.5;e.py=y+.5;e.cdt=.6;if(cineOK())sparks(e.px,e.py,14,['#c8c0ff','#ffffff'],60);break}}}
      if((O.bm-=dt)<=0){O.bm=8;const n=14;for(let i=0;i<n;i++){const an=i*6.283/n;PJ.push({x:e.px,y:e.py,vx:Math.cos(an)*5.2,vy:Math.sin(an)*5.2,t:2.2,d:AB_D.nova*A,c:'#c8c0ff'})}flt(e,'Lamento!','#c8c0ff');scream()}
      if((O.sm-=dt)<=0){O.sm=11;if(partAt('anima').length<6)for(let i=0;i<2;i++){const[x,y]=freeNear(Math.floor(e.px)+ri(-2,2),Math.floor(e.py)+ri(-2,2));const m=mk('anima',x,y);m.al=1;ents.push(m)}}}}
  // fase 4: lo sguardo che ruota, anelli di colpi e anime
  if(O.ph===4){if((O.gz-=dt)<=0){O.gz=9;const a0=Math.atan2(P.py-12.6,P.px-14)+(Math.random()<.5?-1.2:1.2),dir=a0<Math.atan2(P.py-12.6,P.px-14)?1:-1;O.gaze={a:a0,dir,k:0};flt(P,'Lo sguardo!','#ff5a4a');growl()}
    if((O.bm-=dt)<=0){O.bm=5;const n=16;for(let i=0;i<n;i++){const an=i*6.283/n+t;PJ.push({x:14,y:12.6,vx:Math.cos(an)*5,vy:Math.sin(an)*5,t:2.6,d:AB_D.nova*A,c:'#ff3a3a'})}}
    if((O.sm-=dt)<=0){O.sm=7.5;if(partAt('anima').length<6)for(let i=0;i<3;i++){const[x,y]=freeNear(6+Math.floor(Math.random()*16),14+Math.floor(Math.random()*8));const m=mk('anima',x,y);m.al=1;ents.push(m)}if(Math.random()<.5)scream()}}
  if(O.gaze){const G=O.gaze;G.k+=dt;const steps=Math.floor(G.k/.14);while((G.n||0)<steps&&(G.n||0)<18){G.n=(G.n||0)+1;abRay(14,12.6,G.a+G.dir*G.n*.17,11,1.1,.62,AB_D.gaze*A,.5,.015)}if(G.n>=18)O.gaze=null}
  // fase 5: la nebbia si stringe, tutto insieme, e Malakar protegge
  if(O.ph===5){O.R=Math.max(4.6,14-O.t*.15);const enr=O.t>75?1.5:1;if(O.t>75&&!O.enr){O.enr=1;banner('L\'Abominio impazzisce','Ogni colpo fa più male: finiscilo!','teschio');growl()}
    if((O.fz-=dt)<=0){O.fz=.5;if(Math.hypot(P.px-AB_C[0],P.py-AB_C[1])>O.R)hurtP(AB_D.fog*A*enr)}
    if((O.bm-=dt)<=0){O.bm=7;const n=12;for(let i=0;i<n;i++){const an=i*6.283/n-t;PJ.push({x:14,y:12.6,vx:Math.cos(an)*4.4,vy:Math.sin(an)*4.4,t:2.6,d:AB_D.nova*A*enr,c:'#ff6a3a'})}}
    if((O.sm-=dt)<=0){O.sm=9;if(partAt('anima').length<5)for(let i=0;i<2;i++){const an=Math.random()*6.283,[x,y]=freeNear(Math.floor(AB_C[0]+Math.cos(an)*O.R*.7),Math.floor(AB_C[1]+Math.sin(an)*O.R*.6));const m=mk('anima',x,y);m.al=1;m.at*=enr;ents.push(m)}}
    if((O.ms-=dt)<=0){O.ms=14;P.mks=t+2.2;const g2=ents.find(e=>e.k==='mkghost');if(g2){g2.cast=t;if(cineOK()){ringFx(P.px,P.py,'160,210,255',1,1.6);sparks(g2.px,g2.py,12,['#bfe6ff','#ffffff'],60)}}msg('Lo scudo di Malakar ti avvolge');tone(780,.12,'triangle')}}
  if(Math.random()<dt*.08)growl()};
// momenti di cinema durante la battaglia: braccia che cadono e cambi di fase
occBeats=function(){if(!OCC||OCC.intro)return;const arms=partAt('abo_braccio').length;if(arms<OCCK.arms){OCCK.arms=arms;shake(.9);slowmo(.45,.5);growl();
    for(const[ax,ay]of ARMS)if(!partAt('abo_braccio').some(a=>a.ax===ax&&a.ay===ay)&&!OCC['d'+ax]){OCC['d'+ax]=1;if(cineOK())burst(ax,ay,26,['#5a2a30','#8a1a1a','#e8dcc8'],{v:2,up:200,gr:420,d:1.2,s:5,z:6});vf({k:'flash',x:ax,y:ay,r:90,c:'255,80,60',d:.4,z:10})}}
  if(OCC.ph!==OCCK.ph){OCCK.ph=OCC.ph;const tg=OCC.ph===2?'abo_ventre':OCC.ph===4?'abo_testa':OCC.ph===5?'abo_cuore':null,e=tg?ents.find(x=>x.t===tg):null;
    if(e&&cineOK()){cineOn(e,1.2,2.2);CAM.k=.75}if(cineOK())for(let i=0;i<3;i++)setTimeout(()=>{if(OCC)burst(BX+(Math.random()-.5)*5,BY+4,20,OCC.ph===2?['#7aff4a','#3a8a2a','#ffffff']:OCC.ph===3?['#c8c0ff','#ffffff','#e8e0ff']:['#ff3a2a','#ffffff','#ffd0d0'],{v:1.8,up:240,gr:300,d:1.3,s:5,z:60})},i*250);
    vf({k:'ring',x:BX,y:BY+5,r0:.5,r:6,c:OCC.ph===2?'120,255,80':OCC.ph===3?'200,190,255':'255,60,40',w:12,d:.9})}
  if(OCC.win&&!OCC.boom){OCC.boom=1;slowmo(.3,1.6);shake(2);for(let i=0;i<8;i++)setTimeout(()=>{if(!cineOK())return;const x=BX+(Math.random()-.5)*7,y=BY+(Math.random()-.5)*7;burst(x,y,24,['#ffffff','#ffd0a0','#ff6a3a','#5a2a30'],{v:2.4,up:260,gr:260,d:1.4,s:6,z:40+Math.random()*80});pillar(x,y,'255,230,200',1.2,60);shake(1)},i*220)}};
// il disegno: il ventre chiuso, il cuore che batte, l'ombra della Regina, il fantasma di Malakar, la nebbia che si stringe
const _aboDraw711=aboDraw;aboDraw=function(e){_aboDraw711(e);if(e.dead||!OCC)return;const br=1+Math.sin(t*1.6)*.03;
  if(OCC.ph===2&&OCC.closed>t){box(BX-1.7,BY+3.24,52*br,3.4,.08,36,'#4a2026');box(BX-1.5,BY+3.27,68*br,3,.05,2,'#2a0a0e')}
  if(OCC.ph===5){const c=partAt('abo_cuore')[0],hit=c&&c.fl>0,b=1+Math.max(0,Math.sin(t*5))*.18;box(BX-1.8,BY+3.2,40,3.6,.1,40,'#2a0a0e');
    box(BX-.9*b,BY+3.3,48,1.8*b,.18,22*b,hit?'#ffb0b0':'#b0101a',1.15);box(BX-.5*b,BY+3.46,54,1*b,.08,10*b,'#ff4a3a',1.35);for(let i=0;i<5;i++)box(BX-1.6+i*.75,BY+3.25,44+((i*7)%9),.12,.06,26-((i*5)%9),'#5a1a20');
    nlight(BX,BY+4,56,220,'255,40,30',.6+.4*Math.sin(t*5));if(SET.ultra)GLOW.push([BX,BY+4,56,90,'255,50,40',.4])}};
let MKGL=null,ELFL=null;const _ent711b=ent;ent=function(e){if(!e)return;
  if(e.k==='mkghost'){const a=Math.min(1,(t-e.t0)/1.2),cast=e.cast&&t-e.cast<.8?Math.sin((t-e.cast)/.8*Math.PI):0,L=MKGL||(MKGL=ghostL(npcModel('malakar_re',{},{px:1,py:1}),.6,'#bfe6ff'));
    g.globalAlpha=a*(.55+Math.sin(t*2)*.12);drawHero(L,e.px,e.py,8+Math.sin(t*1.7)*3+cast*4,0,faceOf(P.px-e.px,P.py-e.py));g.globalAlpha=1;nlight(e.px,e.py,30,140,'160,210,255',.9*a);if(SET.ultra)GLOW.push([e.px,e.py,30,50,'160,210,255',.3*a]);return}
  if(e.k==='elara_free'){const k=(t-e.t0)/3.2;if(k>=1){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1);return}const L=ELFL||(ELFL=npcModel('elara',{},{px:2,py:2}));g.globalAlpha=Math.max(0,1-k)*(k<.15?k/.15:1);drawHero(L,e.px,e.py,k*60,0,4);g.globalAlpha=1;nlight(e.px,e.py,30+k*60,180,'255,240,210',1-k);return}
  if(e.t==='elara_ombra'){g.globalAlpha=.78+Math.sin(t*3)*.08;_ent711b(e);g.globalAlpha=1;nlight(e.px,e.py,26,120,'190,170,255',.7);return}
  _ent711b(e)};
// la nebbia della fase 5 e lo scudo di Malakar
const _occOverlay711=occOverlay;occOverlay=function(){_occOverlay711();if(!OCC||!P)return;g.save();
  if(OCC.ph===5){const[cx,cy]=scr(AB_C[0],AB_C[1],0),rx=OCC.R*45*S,ry=OCC.R*22.5*S;g.setTransform(DPR,0,0,DPR,0,0);g.beginPath();g.rect(0,0,W,H);g.ellipse(cx,cy,rx,ry,0,0,6.3);g.fillStyle=`rgba(150,150,160,${.32+.06*Math.sin(t*2)})`;g.fill('evenodd');
    g.strokeStyle=`rgba(220,220,235,${.55+.2*Math.sin(t*3)})`;g.lineWidth=3;g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,6.3);g.stroke()}
  if(P.mks>t){const[x,y]=scr(P.px,P.py,16),r=34*S*(1+.06*Math.sin(t*8));g.setTransform(DPR,0,0,DPR,0,0);g.strokeStyle='rgba(160,215,255,.85)';g.lineWidth=2.5;g.beginPath();g.ellipse(x,y,r,r*1.15,0,0,6.3);g.stroke();g.fillStyle='rgba(160,215,255,.12)';g.fill()}
  g.restore()};
// il fantasma di Malakar ora conosce tutte le fasi
QA.malakar_g[0][1]='Con questa chiave aprirai la porta di pietra nella stanza del culto. Dietro c\'è l\'Occhio. Prima le braccia, poi il ventre. Dentro troverai qualcuno che conoscevo: liberala. Poi la testa, e per ultimo il cuore, quando la nebbia si stringerà. Io sarò con te, per quanto può esserlo un fantasma.';
ghostHTML=function(){let h='';if(!P.key)h+=`<div class="qb"><i>«Non avere paura. Sono Malakar. Mio fratello ti ha mentito, come ha mentito a tutti. Il settimo cuore non è un falso: è la serratura di ciò che dorme sotto Aldoria. E adesso che lui ha la Corona, l\'Occhio si sta svegliando di nuovo.»</i><br><button onclick="takeKey()">Prendi la chiave della porta di pietra</button></div>`;
  else h+='<div class="qb"><i>«Il varco ti porta nella stanza del culto. Apri la porta di pietra. Le braccia, il ventre, chi è prigioniero dentro, la testa, il cuore. E leggi la terra: i cerchi rossi dicono dove colpirà.»</i></div>';return h+qaHTML('malakar_g')};
