/* 7.53: tolto da 8_main.js, stesso ordine di prima: la pesca rifatta, Stefano e la Puledra, le battaglie di Ryan il Pelato, Manuel */
/* ================= 7.3: la pesca rifatta — lancio, ombre nell'acqua, abboccate finte, lotta con la corrente e pesci leggendari ================= */
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h){this.rect(x,y,w,h)};
const FRC=['#c8ccd4','#5ad65a','#4aa3ff','#b866ff','#ffae2b'],FRN=['Comune','Non comune','Raro','Epico','Leggendario'];
// dati in più per i pesci di sempre (rarità, peso in kg, forma e colori)
const FX73={sardina:{r:0,kg:[.05,.15],c:'#9ab4c8',b:'#e8f0f4',l:.34,h:3.2},sgombro:{r:0,kg:[.2,.7],c:'#3a7a8a',b:'#e0ecf0',st:'#1a3a4a',l:.42,h:3.6},
  orata:{r:1,kg:[.4,1.8],c:'#b8c0c8',b:'#f0f0f0',st:'#e8c040',l:.44,h:5},branzino:{r:1,kg:[.5,3],c:'#8a98a8',b:'#e8ecf0',l:.52,h:4.6},
  polpo:{r:2,kg:[.8,4],c:'#c8605a',sh:'octo',l:.4,h:5},calamaro:{r:1,kg:[.3,1.5],c:'#e8b0a0',sh:'squid',l:.5,h:3.5},
  pesce_spada:{r:3,kg:[20,80],c:'#3a5a7a',b:'#c8d4e0',sh:'sword',l:.9,h:6},trota_dorata:{r:3,kg:[1,4],c:'#e8b040',b:'#fff0c0',st:'#c87a20',l:.5,h:4.6,gl:1},
  stivale:{r:0,kg:[.4,.9],c:'#5a3a22',sh:'boot',l:.3,h:6}};
for(const f of FISHT)Object.assign(f,FX73[f.id]||{r:0,kg:[.2,1],c:'#8aa0b0',l:.4,h:4});
// i pesci del mare aperto (si pescano solo dalla barca di Stefano)
FISHT.push(
  {id:'acciuga',n:'Acciuga',w:0,p:5,d:.12,sea:1,r:0,kg:[.02,.06],c:'#a8c0d0',b:'#f0f6fa',l:.28,h:2.6},
  {id:'merluzzo',n:'Merluzzo',w:0,p:14,d:.3,sea:1,r:0,kg:[.8,4],c:'#b0a080',b:'#efe8d8',l:.6,h:4.6},
  {id:'dentice',n:'Dentice',w:0,p:28,d:.42,sea:1,r:1,kg:[1,6],c:'#d08a8a',b:'#f8e0e0',l:.56,h:5.4},
  {id:'ricciola',n:'Ricciola',w:0,p:40,d:.5,sea:1,r:1,kg:[3,15],c:'#7a8aa0',b:'#e8ecf0',st:'#e8d040',l:.75,h:5},
  {id:'lampuga',n:'Lampuga',w:0,p:60,d:.58,sea:1,r:2,kg:[4,18],c:'#2ab07a',b:'#f0e040',l:.8,h:6,fn:'#2a7ad8'},
  {id:'razza',n:'Razza',w:0,p:55,d:.5,sea:1,r:2,kg:[2,10],c:'#7a6a5a',sh:'flat',l:.6,h:1.6},
  {id:'cernia',n:'Cernia',w:0,p:75,d:.62,sea:1,r:2,kg:[5,25],c:'#7a5a3a',b:'#c8a878',sh:'grouper',l:.8,h:7},
  {id:'tonno',n:'Tonno',w:0,p:90,d:.66,sea:1,r:2,kg:[15,90],c:'#23345e',b:'#d8dce8',fn:'#e8c040',l:1,h:7.5},
  {id:'murena',n:'Murena',w:0,p:70,d:.6,sea:1,r:2,kg:[1,6],c:'#6a7a3a',sh:'eel',st:'#e8e080',l:.9,h:3},
  {id:'pesce_lanterna',n:'Pesce lanterna',w:0,p:140,d:.7,sea:1,r:3,kg:[.3,1.2],c:'#2a3450',sh:'lantern',l:.42,h:4.6,gl:1},
  {id:'verdesca',n:'Verdesca',w:0,p:180,d:.8,sea:1,r:3,kg:[20,60],c:'#3a5a8a',b:'#e8ecf0',sh:'shark',l:1.3,h:6.5},
  {id:'re_spada',n:'Re Spada',w:0,p:1200,d:.92,sea:1,r:4,leg:1,kg:[120,300],c:'#c8a440',b:'#fff4c8',sh:'sword',l:1.5,h:7.5,gl:1,fn:'#ffd84a'},
  {id:'tonno_rosso',n:'Tonno Rosso Gigante',w:0,p:1500,d:.94,sea:1,r:4,leg:1,kg:[250,600],c:'#8a1a2a',b:'#f0d8d8',fn:'#ffd84a',l:1.7,h:11},
  {id:'murena_abissi',n:'Murena degli Abissi',w:0,p:1400,d:.95,sea:1,r:4,leg:1,kg:[30,80],c:'#2a1a3a',sh:'eel',st:'#c46bff',l:1.6,h:4.6,gl:1},
  {id:'luna_argento',n:'Luna d\'Argento',w:0,p:1800,d:.95,sea:1,r:4,leg:1,kg:[200,900],c:'#d8e4f0',b:'#ffffff',sh:'sun',l:1,h:7,gl:1},
  {id:'vecchio_testardo',n:'Il Vecchio Testardo',w:0,p:3000,d:.98,sea:1,r:4,leg:1,kg:[300,500],c:'#4a3a2a',b:'#a88a5a',sh:'grouper',l:1.8,h:13,old:1});
const FISHI=Object.fromEntries(FISHT.map(f=>[f.id,f]));
// ---- modelli voxel dei pesci (lungo l'asse y, testa in avanti) ----
function fishModel(f,s=1){const L=[],c=f.c,b=f.b||shx(hx6(c),1.3),fn=f.fn||shx(hx6(c),.8),l=f.l*s,h=f.h*s,w=Math.max(.06,l*.22),A=(x,y,z,W,D,H,col,br)=>L.push(br?[x,y,z,W,D,H,col,br]:[x,y,z,W,D,H,col]);
  switch(f.sh){
    case 'boot':A(-.08,-.1,0,.16,.2,h,c);A(-.08,.08,0,.16,.16,h*.35,c);A(-.09,-.11,h*.85,.18,.22,h*.15,'#3a2412');A(-.085,.2,0,.17,.06,h*.18,'#2a1a0a');break;
    case 'octo':A(-w,-w,h*.35,w*2,w*2,h*.65,c);A(-w*.7,-w*.7,h,w*1.4,w*1.4,h*.2,c);for(let i=0;i<6;i++){const a=i/6*6.28;A(Math.cos(a)*w*1.1-.02,Math.sin(a)*w*1.1-.02,0,.04,.04,h*.4,shx(hx6(c),.9))}A(-w*.6,w*.95,h*.6,.04,.01,h*.15,'#111');A(w*.45,w*.95,h*.6,.04,.01,h*.15,'#111');break;
    case 'squid':A(-w*.6,-l*.2,h*.2,w*1.2,l*.6,h*.6,c);A(-w*.4,-l*.35,h*.3,w*.8,l*.15,h*.4,c);for(let i=0;i<4;i++)A(-w*.5+i*w*.33,l*.38,h*.15,.03,l*.25,h*.2,shx(hx6(c),.9));A(-w*.6-.005,l*.25,h*.5,.01,.04,h*.18,'#111');A(w*.6-.005,l*.25,h*.5,.01,.04,h*.18,'#111');break;
    case 'flat':A(-l*.45,-l*.3,0,l*.9,l*.6,h,c);A(-l*.25,-l*.45,0,l*.5,l*.15,h,c);A(-.015,-l*1.05,0,.03,l*.6,h*.6,shx(hx6(c),.8));A(-l*.1,l*.2,h,.03,.03,h*.3,'#111');A(l*.07,l*.2,h,.03,.03,h*.3,'#111');break;
    case 'eel':{for(let i=0;i<7;i++){const ox=Math.sin(i*1.1)*w*.5;A(ox-w*.35,-l*.5+i*l*.14,0,w*.7,l*.15,h,i===6?shx(hx6(c),1.1):c);if(f.st&&i%2)A(ox-w*.36,-l*.5+i*l*.14,h*.4,w*.72,l*.05,h*.2,f.st,f.gl?1.3:0)}
      A(-w*.37,l*.4,h*.55,.01,.04,h*.2,f.gl?'#ff4ad0':'#111',f.gl?1.6:0);A(w*.36,l*.4,h*.55,.01,.04,h*.2,f.gl?'#ff4ad0':'#111',f.gl?1.6:0);A(-w*.2,l*.48,0,w*.4,.03,h*.3,'#3a0a0a');break}
    case 'sun':A(-w*.5,-l*.4,0,w,l*.8,h*1.6,c,f.gl?1.15:0);A(-w*.45,-l*.38,0,w*.9,l*.76,h*.4,b);A(-w*.2,-l*.1,h*1.6,w*.4,l*.2,h*.9,c);A(-w*.2,-l*.1,-h*.8,w*.4,l*.2,h*.8,c);A(-w*.25,-l*.5,h*.3,w*.5,l*.12,h,shx(hx6(c),.9));
      A(-w*.5-.005,l*.25,h*1.1,.01,.05,h*.2,'#1a2a3a');A(w*.5-.005,l*.25,h*1.1,.01,.05,h*.2,'#1a2a3a');break;
    default:{const big=f.sh==='grouper',sw=f.sh==='sword',sk=f.sh==='shark';const W=big?w*1.3:w;
      A(-W/2,-l*.35,0,W,l*.7,h,c);A(-W/2+.005,-l*.32,0,W-.01,l*.62,h*.32,b);A(-W*.42,l*.35,h*.08,W*.84,l*.14,h*(big?.9:.78),c);
      A(-W*.12,-l*.62,-h*.15,W*.24,l*.2,h*1.25,fn);A(-W*.08,-l*.18,h,W*.16,l*(sk?.2:.36),h*(sk?.9:sw?.9:.45),fn);if(sk)A(-W*.06,-l*.1,h*1.6,W*.12,l*.08,h*.5,fn);
      A(-W/2-.006,l*.38,h*.55,.012,.035,h*.18,'#111');A(W/2-.006,l*.38,h*.55,.012,.035,h*.18,'#111');
      if(sw)A(-.015,l*.49,h*.42,.03,l*.5,h*.14,'#d8dce4');if(sk)A(-W*.3,l*.49,h*.1,W*.6,l*.08,h*.5,c);
      if(big){A(-W*.35,l*.49,h*.05,W*.7,.02,h*.3,'#2a1a10');for(let i=0;i<5;i++)A(-W/2-.004,-l*.25+i*l*.12,h*(.3+(i%2)*.3),.008,.04,h*.12,shx(hx6(c),.7))}
      if(f.st)for(let i=0;i<3;i++)A(-W/2-.004,-l*.22+i*l*.17,h*.35,W+.008,.035,h*.55,f.st,f.gl?1.25:0);
      if(f.sh==='lantern'){A(-.01,l*.45,h,.02,.02,h*.7,'#1a2030');A(-.03,l*.43,h*1.65,.06,.06,h*.25,'#9affff',1.8)}
      if(f.old){A(-W*.3,l*.5,h*.45,.02,.02,h*.4,'#b0b0b8');A(W*.2,l*.5,h*.3,.02,.02,h*.35,'#b0b0b8');A(-W*.05,l*.2,h*1.05,W*.5,l*.2,h*.25,'#c0392b')}
      if(f.gl)A(-W*.1,-l*.2,h*.95,W*.2,l*.4,h*.1,'#fff6c0',1.4)}}
  return L}
// ---- dove si pesca: il porto e i cinque mari di Stefano ----
const FGR={porto:{n:'Porto di Aldoria'},
  mare_scogliera:{n:'Scogliera dei Gabbiani',t:{acciuga:25,merluzzo:20,dentice:16,ricciola:12,orata:10,sgombro:10,razza:6,pesce_spada:3},leg:'re_spada',q:'ste2'},
  mare_banco:{n:'Banco dei Tonni',t:{sgombro:20,ricciola:18,lampuga:16,tonno:14,acciuga:10,pesce_spada:6,verdesca:3},leg:'tonno_rosso',q:'ste3'},
  mare_fossa:{n:'Fossa Profonda',t:{merluzzo:18,cernia:18,murena:16,razza:12,polpo:10,pesce_lanterna:6,verdesca:5},leg:'murena_abissi',q:'ste4'},
  mare_grotta:{n:'Grotta Marina',t:{calamaro:18,pesce_lanterna:16,polpo:12,murena:12,dentice:10,acciuga:10},leg:'luna_argento',q:'ste5'},
  mare_naufragio:{n:'Punta del Naufragio',t:{cernia:20,polpo:12,murena:12,stivale:10,verdesca:8,tonno:8,merluzzo:10},leg:'vecchio_testardo',q:'ste6'}};
function fishPick(good){const G=FGR[Zk];const rb=(P.rod>=2?1.6:1)*(P.rod>=3?1.3:1)*(good?1.5:1),nt=isNight();
  if(G&&G.t){const lg=FISHI[G.leg],qa=P.q.some(q=>q.id===G.q),got=(P.fish[G.leg]||0)>0;
    if(lg&&(G.leg!=='vecchio_testardo'||qa||got)){const ch=(qa&&!got?.1:.018)*(good?1.6:1)*(P.rod>=3?1.3:1);if(Math.random()<ch)return lg}
    const L=Object.entries(G.t).map(([id,w])=>[FISHI[id],w*(FISHI[id].r>=2?rb:1)]).filter(x=>x[0]);let r=Math.random()*L.reduce((a,b)=>a+b[1],0);for(const[f,w]of L)if((r-=w)<0)return f;return L[0][0]}
  const L=FISHT.filter(f=>!f.sea&&(!f.nt||nt)&&f.w>0).map(f=>[f,f.w*(f.p>=30?rb:1)]);let r=Math.random()*L.reduce((a,b)=>a+b[1],0);for(const[f,w]of L){if((r-=w)<0)return f}return L[0][0]}
const ROD=['Nessuna canna','Canna da pesca','Canna di quercia','Canna del Cavallo Pazzo'];
const fkg=f=>{const[a,b]=f.kg,u=Math.pow(Math.random(),1.8);return Math.round((a+(b-a)*u)*100)/100};
const fkgS=k=>k>=10?k.toFixed(0)+' kg':k>=1?k.toFixed(1)+' kg':Math.round(k*1000)+' g';
// ---- la partita di pesca ----

function fishStart(){const sp=FSPOT,sea=Zk.startsWith('mare_');if(sp){P.dr=[sp.ox,sp.oy];P.fc=faceOf(sp.ox,sp.oy)}P.path=[];P.tg=null;
  FSH={ph:'aim',pw:0,pd:1,hold:0,msg:'Tieni premuto per caricare il lancio, poi rilascia.',dx:sp?sp.ox:(P.dr||[0,1])[0],dy:sp?sp.oy:(P.dr||[0,1])[1],sx:P.px,sy:P.py,bx:0,by:0,k:0,rph:'',sea,t0:performance.now(),sh:[],rip:[],sp:[]};
  clearInterval(FST);FST=setInterval(fishTick,30);pn('fish')}
function fishCastTo(F){const pw=F.pw,d=(F.sea?1.3:.9)+pw*(F.sea?3.4:2.4);let bx=F.sx+F.dx*d,by=F.sy+F.dy*d;
  const wat=(a,b)=>{const x=a|0,y=b|0;return x>0&&y>0&&x<N-1&&y<N-1&&M[y][x]===2};let ok=wat(bx,by);for(let k=1;k<=12&&!ok;k++){if(wat(bx+F.dx*.25*k,by+F.dy*.25*k)){bx+=F.dx*.25*k;by+=F.dy*.25*k;ok=1;break}if(wat(bx-F.dx*.25*k,by-F.dy*.25*k)){bx-=F.dx*.25*k;by-=F.dy*.25*k;ok=1;break}}F.bx=bx;F.by=by}
function fishKey(on){const F=FSH;if(!F)return;const now=performance.now();
  if(F.ph==='aim'){if(on)F.hold=1;else if(F.hold){F.hold=0;F.good=F.pw>=.62&&F.pw<=.9;fishCastTo(F);F.ph='fly';F.k=0;F.msg=F.good?'Lancio perfetto! L\'amo vola lontano.':'Lancio!';whoosh();F.cast=now}}
  else if(F.ph==='wait'&&on&&!F.sk){F.sk=1;const ch=F.sh[0];if(ch){ch.flee=1}F.tw=now+3200+Math.random()*3000;F.nb=fishNibbles(now,F.tw);F.f=fishPick(F.good);fishShadow(F,1);
    F.msg=F.nibT&&now-F.nibT<500?'Era solo un assaggio! Il pesce è scappato: aspetta che abbocchi davvero.':'Troppo presto! Hai spaventato il pesce.';tone(170,.15,'sine');setTimeout(()=>{if(FSH===F)F.sk=0},350)}
  else if(F.ph==='bite'&&on){fishFightStart(F)}
  else if(F.ph==='fight')F.hold=on?1:0;
  else if(F.ph==='end'&&on&&now-(F.endT||0)>500)fishStart();fishUI()}
function fishNibbles(now,tw){const n=Math.floor(Math.random()*3.2),L=[];for(let i=0;i<n;i++)L.push(now+1000+Math.random()*Math.max(200,tw-now-1700));return L.sort((a,b)=>a-b)}
function fishShadow(F,fresh){const f=F.f,big=Math.min(1.6,.5+Math.log10(1+f.kg[1])*.5);const a=Math.random()*6.28;
  const ch={x:F.bx+Math.cos(a)*2.2,y:F.by+Math.sin(a)*2.2,vx:0,vy:0,s:big,gl:f.r>=4?FRC[4]:f.r>=3?FRC[3]:'',ch:1};
  if(fresh)F.sh=F.sh.filter(s=>!s.ch||s.flee);F.sh.unshift(ch);while(F.sh.length<4){const b=Math.random()*6.28,r=1+Math.random()*1.8;F.sh.push({x:F.bx+Math.cos(b)*r,y:F.by+Math.sin(b)*r,vx:0,vy:0,s:.35+Math.random()*.5})}}
function fishFightStart(F){const f=F.f,r=f.r,rod=P.rod||1;F.ph='fight';F.hold=0;tone(520,.08,'square',.05);if(cineOK())shake(.25);
  F.fp=.5;F.ft=.5;F.fs=.12+f.d*.42;F.ftT=0;F.zc=.5;F.zv=0;F.zw=Math.max(.15,.27+(rod-1)*.04-.02*r);F.pr=.32;F.dash=0;F.dw=0;F.jt=-1;F.deep=0;F.nd=3+Math.random()*3;F.nj=5+Math.random()*4;F.ndp=6+Math.random()*4;F.ft0=performance.now();
  F.msg=f.r>=4?'È ENORME! Tieni il pesce dentro la zona dorata!':'Ha abboccato! Tieni il pesce dentro la zona dorata.'}
function fishTick(){if(PM!=='fish'||!FSH){clearInterval(FST);if(PM!=='fish')FSH=null;return}const F=FSH,dt=.03,now=performance.now();if(Math.hypot(P.px-F.sx,P.py-F.sy)>1.3){cl();msg('Hai smesso di pescare.');return}
  if(F.ph==='aim'&&F.hold){F.pw+=F.pd*dt*1.05;if(F.pw>1){F.pw=1;F.pd=-1}if(F.pw<0){F.pw=0;F.pd=1}}
  if(F.ph==='fly'){F.k+=dt/.65;if(F.k>=1){F.k=1;F.ph='wait';F.f=fishPick(F.good);F.tw=now+(2400+Math.random()*3800)*(F.good?.7:1)*(F.sea?.85:1);F.nb=fishNibbles(now,F.tw);fishShadow(F,1);
      F.msg='Il galleggiante dondola... guarda le ombre sotto l\'acqua.';tone(260,.07,'sine');fishRip(F.bx,F.by,1.2);if(cineOK())sparks(F.bx,F.by,10,['#cfe8ff','#ffffff'],50)}}
  if(F.ph==='wait'){for(const s of F.sh){if(s.flee){const dx=s.x-F.bx,dy=s.y-F.by,d=Math.hypot(dx,dy)||1;s.x+=dx/d*dt*4;s.y+=dy/d*dt*4;s.al=Math.max(0,(s.al==null?1:s.al)-dt*1.5);continue}
      if(s.ch&&now>F.tw-1600){s.x+=(F.bx-s.x)*Math.min(1,dt*1.6);s.y+=(F.by-s.y)*Math.min(1,dt*1.6)}
      else{s.vx+=(Math.random()-.5)*dt*3;s.vy+=(Math.random()-.5)*dt*3;const dx=F.bx-s.x,dy=F.by-s.y,d=Math.hypot(dx,dy);if(d>2.4){s.vx+=dx/d*dt*1.4;s.vy+=dy/d*dt*1.4}s.vx*=.97;s.vy*=.97;s.x+=s.vx*dt;s.y+=s.vy*dt}}
    F.sh=F.sh.filter(s=>!s.flee||s.al>0);
    if(F.nb&&F.nb.length&&now>=F.nb[0]){F.nb.shift();F.nibT=now;tone(330,.04,'sine',.03);fishRip(F.bx,F.by,.5)}
    if(now>=F.tw){F.ph='bite';F.te=now+1000*(P.rod>=2?1.15:1)*(F.f.r>=4?.75:1);F.msg='ABBOCCA! Ferra subito!';tone(880,.1,'triangle');tone(660,.12,'square',.04);fishRip(F.bx,F.by,1.6);if(cineOK()){sparks(F.bx,F.by,16,['#ffffff','#bfe6ff'],70);shake(.15)}}}
  if(F.ph==='bite'&&now>F.te){F.ph='end';F.endT=now;F.res=null;F.msg='Troppo lento a ferrare: il pesce ha mangiato l\'esca ed è scappato.';tone(150,.2)}
  if(F.ph==='fight')fishFight(F,dt,now);
  if(F.ph==='land'){F.k+=dt/.8;if(F.k>=1){F.ph='end';F.endT=now}}
  if(F.rip.length)F.rip=F.rip.filter(r=>now-r.t<1400);fishUI()}
function fishRip(x,y,s){FSH&&FSH.rip.push({x,y,s,t:performance.now()})}
function fishFight(F,dt,now){const f=F.f,r=f.r,leg=f.r>=4;
  // il pesce: corre verso un punto, cambia idea, a volte scatta, salta o va a fondo
  F.ftT-=dt;if(F.ftT<=0||Math.abs(F.ft-F.fp)<.02){F.ftT=.6+Math.random()*(1.8-f.d);const rg=.25+f.d*.6;F.ft=Math.max(.04,Math.min(.96,F.fp+(Math.random()-.5)*rg*2))}
  if(r>=3||leg){F.nd-=dt;if(F.nd<=0&&!F.dw&&F.jt<0){F.dw=.45;F.nd=(leg?3.5:5)+Math.random()*3;tone(200,.1,'sawtooth',.04)}
    if(F.dw>0){F.dw-=dt;if(F.dw<=0){F.dw=0;F.dash=.55;F.ft=F.fp<.5?.9+Math.random()*.08:.02+Math.random()*.08;if(cineOK())shake(.2)}}}
  if(r>=2&&F.jt<0){F.nj-=dt;if(F.nj<=0){F.nj=(leg?4:7)+Math.random()*4;F.jt=0;F.jx=F.fp;F.jto=Math.max(.05,Math.min(.95,F.fp+(Math.random()-.5)*.7));tone(400,.08,'triangle');whoosh()}}
  if(F.jt>=0){F.jt+=dt;F.fp=F.jx+(F.jto-F.jx)*Math.min(1,F.jt/.9);if(F.jt>=.9){F.jt=-1;fishRip(F.wfx||F.bx,F.wfy||F.by,1.4);if(cineOK())sparks(F.wfx||F.bx,F.wfy||F.by,14,['#ffffff','#bfe6ff'],70);tone(200,.12,'sine')}}
  else{const sp=F.fs*(F.dash>0?2.4:1);F.dash=Math.max(0,F.dash-dt);const d=F.ft-F.fp;F.fp+=Math.sign(d)*Math.min(Math.abs(d),sp*dt)+(Math.random()-.5)*dt*.05;F.fp=Math.max(0,Math.min(1,F.fp))}
  if(leg){F.ndp-=dt;if(F.ndp<=0&&F.deep<=0){F.deep=2.6;F.ndp=7+Math.random()*4;F.msg='Va a fondo! La zona si stringe: tieni duro!';tone(90,.3,'sine',.06)}if(F.deep>0){F.deep-=dt;if(F.deep<=0)F.msg='Tieni il pesce dentro la zona dorata!'}}
  // la zona dorata: tieni premuto per spingerla a destra, lascia e torna a sinistra
  const zw=F.zw*(F.deep>0?.78:1);F.zv+=(F.hold?3.2:-3.2)*dt;F.zv*=1-1.8*dt;F.zc+=F.zv*dt;if(F.zc<zw/2){F.zc=zw/2;F.zv=-F.zv*.35}if(F.zc>1-zw/2){F.zc=1-zw/2;F.zv=-F.zv*.35}
  const inz=F.jt<0&&Math.abs(F.fp-F.zc)<zw/2;F.inz=inz;
  if(F.jt<0)F.pr+=inz?(.3-.02*r)*dt:-(.1+.012*r)*dt;
  if(inz&&Math.random()<.08)tone(600+F.pr*500,.025,'triangle',.02);
  if(F.pr>=1)fishLand(F);else if(F.pr<=0){F.ph='end';F.endT=now;F.res=null;F.msg=(leg?f.n+' ha spezzato la lenza ed è tornato negli abissi.':'Il pesce si è liberato ed è scappato.');tone(120,.3,'sawtooth');if(cineOK())sparks(F.bx,F.by,10,['#ffffff'],60)}}
function fishLand(F){const f=F.f,kg=fkg(f),nw=!(P.fish[f.id]>0),rec=!nw&&kg>((P.frec||{})[f.id]||0);P.frec=P.frec||{};
  P.fish[f.id]=(P.fish[f.id]||0)+1;if(!(P.frec[f.id]>=kg))P.frec[f.id]=kg;F.res={f,kg,nw,rec};F.ph='land';F.k=0;
  F.msg=f.id==='stivale'?'Hai tirato su... uno stivale vecchio.':(f.r>=4?'LEGGENDARIO! ':'Preso! ')+f.n+' · '+fkgS(kg)+(nw?' · nuova specie!':rec?' · nuovo record!':'');
  jingle(f.r>=4?[72,76,79,84,88,91]:f.r>=2?[72,76,79,84]:[67,72,76],.09,'triangle');if(f.r>=4){if(cineOK()){shake(.6);slowmo&&slowmo(.4,.8)}banner('Pesce leggendario!',f.n+' · '+fkgS(kg),'stella')}
  for(const q of P.q){const T=QT[q.id];if(T.t==='fish'&&!qReady(q)&&(T.f==='any'?(f.id!=='stivale'&&(!T.zb||Zk.startsWith('mare_'))):T.f===f.id)){q.c++;msg(T.ti+': '+q.c+'/'+T.n);if(qReady(q))jingle([67,72])}}
  npcMarks();hud();save()}
function fishUI(){const F=FSH;if(!F)return;if(F.ph!==F.rph){F.rph=F.ph;pn('fish');return}const m=$('fmsg');if(m&&m.textContent!==F.msg)m.textContent=F.msg}
function fishHTML(){const F=FSH,G=FGR[Zk];const lab={aim:'🎣 Lancia (tieni premuto)',fly:'…',wait:'⚡ Ferra',bite:'⚡ FERRA!',fight:'🔄 Recupera (tieni premuto)',land:'…',end:'🎣 Lancia di nuovo'}[F.ph];
  return`<div class="fhd"><b>🎣 ${esc(G?G.n:ZZ.n)}</b><span>${esc(ROD[Math.min(3,P.rod||1)])}</span></div><canvas id="fcv" width="560" height="150" onpointerdown="event.preventDefault();fishKey(1)"></canvas><p id="fmsg">${esc(F.msg)}</p>
  <div class="fbr"><button id="fbt" class="${F.ph==='bite'?'hot':''}">${lab}</button><button onclick="pn('fdia')">📖 Diario</button><button onclick="cl()">Smetti</button></div>
  <p class="mu fsm">Barra spaziatrice o tieni premuto sul riquadro. ${F.sea?'In mare aperto abboccano pesci più grossi.':isNight()?'È notte: calamari e trote dorate salgono in superficie.':'Di notte abboccano anche calamari e trote dorate.'}</p>`}
// diario del pescatore: specie prese, quante, il record
function fdiaHTML(){let h='<h3>📖 Diario del pescatore</h3><p class="mu">Ogni specie presa, quante volte e il pesce più grosso.</p><div class="fdia">';
  const rec=P.frec||{};for(const f of FISHT.slice().sort((a,b)=>a.r-b.r||a.p-b.p)){const n=P.fish[f.id]||0;
    h+=`<div class="fde ${n?'':'no'}" style="--rc:${FRC[f.r]}"><b>${n?esc(f.n):'???'}</b><small>${FRN[f.r]}${f.sea?' · mare aperto':''}</small><span>${n?'×'+n+(rec[f.id]?' · record '+fkgS(rec[f.id]):''):f.leg?'leggenda dei mari':'non ancora preso'}</span></div>`}
  const tot=FISHT.filter(f=>P.fish[f.id]>0).length;return h+`</div><p class="mu">Specie trovate: ${tot}/${FISHT.length}</p><button onclick="${fishBack()?"pn('fish')":'cl()'}">${fishBack()?'Torna a pescare':'Chiudi'}</button>`}
// ---- la canna: si piega e trema mentre il pesce tira ----
function rodL2(){const F=FSH,L=[];let a0=.78,bend=0,sx=0;
  if(F){if(F.ph==='aim')a0=.78+F.pw*1.1*(F.hold?1:0);else if(F.ph==='fly')a0=.5+Math.max(0,.6-F.k)*.4;else if(F.ph==='fight'){a0=.6;bend=.1+.12*(1-F.pr)+(F.dash>0?.08:0);sx=(F.fp-.5)*.06}else if(F.ph==='bite')a0=.5,bend=.12;else if(F.ph==='wait')a0=.62}
  let y=.05,z=14,a=a0;for(let k=0;k<7;k++){const tr=F&&F.ph==='fight'?Math.sin(t*30+k)*.004*k:0;L.push([.24+sx*k+tr,y,z,.04,.12,3,k<2?'#3a2a1a':k===6?'#e8e8e8':'#8a6a42']);y+=Math.cos(a)*.13;z+=Math.sin(a)*3.4;a-=bend}
  rodL2.tip=[.26+sx*7,y,z];return L}
// punto della punta della canna nel mondo
function rodTip(){const tp=rodL2.tip||[.26,.85,34],dr=P.dr||[0,1],d=Math.hypot(dr[0],dr[1])||1,fx=dr[0]/d,fy=dr[1]/d;return[P.px+fy*tp[0]+fx*tp[1],P.py-fx*tp[0]+fy*tp[1],tp[2]]}
// ---- disegno nel mondo: mira, galleggiante, ombre, increspature, salti ----
function fishDraw(){const F=FSH;if(!F||PM!=='fish')return;const now=performance.now();fishPanel(now);const[tx,ty,tz]=rodTip();
  // increspature
  for(const r of F.rip){const k=(now-r.t)/1400;g.strokeStyle=`rgba(230,245,255,${(1-k)*.7})`;g.lineWidth=1.5;for(const o of[0,.35]){const kk=Math.max(0,k-o);if(kk<=0)continue;g.beginPath();g.ellipse(PX(r.x,r.y),PY(r.x,r.y,-3),r.s*kk*40,r.s*kk*20,0,0,6.3);g.stroke()}}
  if(F.ph==='aim'){const d=(F.sea?1.3:.9)+F.pw*(F.sea?3.4:2.4),x=F.sx+F.dx*d,y=F.sy+F.dy*d,good=F.pw>=.62&&F.pw<=.9;
    g.setLineDash([4,5]);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;g.beginPath();for(let i=0;i<=16;i++){const k=i/16,px2=F.sx+F.dx*d*k,py2=F.sy+F.dy*d*k,z=20+Math.sin(k*Math.PI)*36*(.4+F.pw)-k*23;i?g.lineTo(PX(px2,py2),PY(px2,py2,z)):g.moveTo(PX(px2,py2),PY(px2,py2,z))}g.stroke();g.setLineDash([]);
    const p=1+Math.sin(t*8)*.1;g.strokeStyle=good?'rgba(255,215,90,.95)':'rgba(255,255,255,.8)';g.lineWidth=2.5;g.beginPath();g.ellipse(PX(x,y),PY(x,y,-3),18*p,9*p,0,0,6.3);g.stroke();g.beginPath();g.ellipse(PX(x,y),PY(x,y,-3),5,2.5,0,0,6.3);g.stroke();return}
  // ombre dei pesci
  if(F.ph==='wait'||F.ph==='bite'){for(const s of F.sh){const a=(s.al==null?1:s.al)*(s.ch?.5:.32),X=PX(s.x,s.y),Y=PY(s.x,s.y,-4),ang=Math.atan2(PY(0,0,0)-PY(s.vx||F.bx-s.x,s.vy||F.by-s.y,0),PX(s.vx||F.bx-s.x,s.vy||F.by-s.y)-PX(0,0));
      g.save();g.translate(X,Y);g.rotate(-ang);g.globalAlpha=a;if(s.gl){g.shadowColor=s.gl;g.shadowBlur=14}g.fillStyle=s.gl&&s.ch?'#2a2a10':'#0a1a2a';g.beginPath();g.ellipse(0,0,16*s.s,6*s.s,0,0,6.3);g.fill();g.beginPath();g.moveTo(-14*s.s,0);g.lineTo(-24*s.s,-6*s.s);g.lineTo(-24*s.s,6*s.s);g.fill();g.restore()}g.globalAlpha=1}
  let bx=F.bx,by=F.by,bz=-3+Math.sin(t*3)*1;
  if(F.ph==='fly'){const k=F.k;bx=tx+(F.bx-tx)*k;by=ty+(F.by-ty)*k;bz=tz+(-3-tz)*k+Math.sin(k*Math.PI)*46}
  if(F.ph==='wait'&&F.nibT&&now-F.nibT<260)bz=-6;
  if(F.ph==='bite')bz=-9+Math.sin(t*28)*2;
  let fx=bx,fy=by,fz=-6;
  if(F.ph==='fight'){const dr=[F.dx,F.dy],rx=dr[1],ry=-dr[0],off=(F.fp-.5)*3.2,back=(1-F.pr)*.9;fx=F.bx+rx*off+F.dx*back;fy=F.by+ry*off+F.dy*back;F.wfx=fx;F.wfy=fy;bx=fx;by=fy;bz=-8;
    if(F.jt>=0){const j=Math.sin(Math.min(1,F.jt/.9)*Math.PI);fz=-6+j*44}
    if(Math.random()<.25&&cineOK())sparks(fx,fy,1,['#ffffff','#cfe8ff'],30);if(Math.random()<.04)fishRip(fx,fy,.8)}
  if(F.ph==='land'){const k=F.k,sx=F.wfx||F.bx,sy=F.wfy||F.by;fx=sx+(P.px-sx)*k;fy=sy+(P.py-sy)*k;fz=-4+Math.sin(k*Math.PI)*50+k*10}
  // filo
  if(F.ph!=='end'&&F.ph!=='land'){const tense=F.ph==='fight';g.strokeStyle=tense?(F.dw>0?'rgba(255,120,100,.95)':'rgba(255,255,255,.95)'):'rgba(240,240,240,.8)';g.lineWidth=tense?1.4:1;g.beginPath();g.moveTo(PX(tx,ty),PY(tx,ty,tz));
    if(tense)g.lineTo(PX(bx,by),PY(bx,by,F.jt>=0?fz+4:bz+2));else{const mx=(tx+bx)/2,my=(ty+by)/2;g.quadraticCurveTo(PX(mx,my),PY(mx,my,(tz+bz)/2-12),PX(bx,by),PY(bx,by,bz+4))}g.stroke()}
  if(F.ph!=='fight'&&F.ph!=='land'&&F.ph!=='end'){box(bx-.06,by-.06,bz,.12,.12,5,'#e8483a');box(bx-.05,by-.05,bz+5,.1,.1,3,'#ffffff')}
  if(F.ph==='bite'){g.font='bold 30px Georgia,serif';g.textAlign='center';label('!',PX(P.px,P.py),PY(P.px,P.py,74)+Math.sin(t*20)*2,'#ffd84a')}
  // il pesce fuori dall'acqua (salto e arrivo)
  if((F.ph==='fight'&&F.jt>=0)||F.ph==='land'){const f=F.f,ml=F.fm||(F.fm=fishModel(f,Math.min(1.1,.55+Math.log10(1+(F.res?F.res.kg:f.kg[1]))*.2)));const fc=faceOf(F.ph==='land'?P.px-fx:F.dy,F.ph==='land'?P.py-fy:-F.dx);
    drawHero(ml,fx,fy,fz,0,fc)}
  if(F.ph==='fight'&&F.jt<0){g.globalAlpha=.45;g.fillStyle='#0a1a2a';g.beginPath();g.ellipse(PX(fx,fy),PY(fx,fy,-4),18,7,0,0,6.3);g.fill();g.globalAlpha=1}}
// ---- il riquadro della pesca: acqua vista di lato, ombre, lotta e cartolina del pescato ----
function fishPanel(now){const F=FSH,c=$('fcv');if(!c)return;const dp=Math.min(2,window.devicePixelRatio||1),W2=560,H2=150;if(c.width!==W2*dp){c.width=W2*dp;c.height=H2*dp}
  const q=c.getContext('2d');q.setTransform(dp,0,0,dp,0,0);const tt=now/1000;
  const deep=F.ph==='fight'&&F.deep>0,gr=q.createLinearGradient(0,0,0,H2);gr.addColorStop(0,deep?'#0a2236':'#1d6e9a');gr.addColorStop(.35,deep?'#06182a':'#0f4a74');gr.addColorStop(1,deep?'#02060e':'#061a33');
  q.fillStyle=gr;q.fillRect(0,0,W2,H2);
  // raggi di luce e bolle
  q.globalAlpha=.08;q.fillStyle='#cfefff';for(let i=0;i<5;i++){const x=(i*130+tt*12)%(W2+120)-60;q.beginPath();q.moveTo(x,0);q.lineTo(x+40,0);q.lineTo(x+90,H2);q.lineTo(x+60,H2);q.fill()}q.globalAlpha=1;
  q.fillStyle='rgba(220,240,255,.35)';for(let i=0;i<14;i++){const x=(i*41.7)%W2,y=H2-((tt*22+i*37)%H2);q.beginPath();q.arc(x+Math.sin(tt*2+i)*3,y,1.2+(i%3)*.6,0,6.3);q.fill()}
  const SURF=30;
  const sil=(x,y,len,col,dir,al,glc)=>{q.save();q.translate(x,y);q.scale(dir,1);q.globalAlpha=al;if(glc){q.shadowColor=glc;q.shadowBlur=16}q.fillStyle=col;q.beginPath();q.ellipse(0,0,len*.5,len*.2,0,0,6.3);q.fill();
    q.beginPath();q.moveTo(-len*.42,0);q.lineTo(-len*.7,-len*.2+Math.sin(tt*10)*2);q.lineTo(-len*.7,len*.2+Math.sin(tt*10)*2);q.fill();q.beginPath();q.moveTo(-len*.1,-len*.18);q.lineTo(len*.08,-len*.32);q.lineTo(len*.15,-len*.16);q.fill();
    q.fillStyle='rgba(255,255,255,.8)';q.beginPath();q.arc(len*.3,-len*.04,Math.max(1,len*.04),0,6.3);q.fill();q.restore()};
  const surf=()=>{q.fillStyle='rgba(180,225,255,.25)';q.beginPath();q.moveTo(0,0);for(let x=0;x<=W2;x+=10)q.lineTo(x,SURF+Math.sin(x*.05+tt*2)*2.5);q.lineTo(W2,0);q.fill();q.strokeStyle='rgba(230,248,255,.7)';q.lineWidth=1.5;q.beginPath();for(let x=0;x<=W2;x+=10){const y=SURF+Math.sin(x*.05+tt*2)*2.5;x?q.lineTo(x,y):q.moveTo(x,y)}q.stroke()};
  const txt=(s,x,y,sz,col,al)=>{q.font=`${al||'bold'} ${sz}px Georgia,serif`;q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.6)';q.strokeText(s,x,y);q.fillStyle=col;q.fillText(s,x,y)};
  if(F.ph==='aim'){surf();const x0=60,x1=500,y=88;q.fillStyle='rgba(0,0,0,.35)';q.fillRect(x0-4,y-14,x1-x0+8,28);const g2=q.createLinearGradient(x0,0,x1,0);g2.addColorStop(0,'#3a8ad8');g2.addColorStop(.6,'#7ad0ff');g2.addColorStop(1,'#ff6a4a');
    q.fillStyle=g2;q.fillRect(x0,y-10,(x1-x0)*F.pw,20);q.fillStyle='rgba(255,215,90,.35)';q.fillRect(x0+(x1-x0)*.62,y-12,(x1-x0)*.28,24);q.strokeStyle='#ffd84a';q.lineWidth=2;q.strokeRect(x0+(x1-x0)*.62,y-12,(x1-x0)*.28,24);
    q.fillStyle='#ffffff';q.fillRect(x0+(x1-x0)*F.pw-2,y-16,4,32);txt(F.hold?'Rilascia nella zona dorata!':'Tieni premuto per caricare',W2/2,y-24,15,'#ffffff');txt('lancio perfetto',x0+(x1-x0)*.76,y+30,11,'#ffd84a','italic');return}
  if(F.ph==='fly'||F.ph==='wait'||F.ph==='bite'){surf();const bx=W2/2;let by=SURF-2+Math.sin(tt*3)*1.5;if(F.ph==='wait'&&F.nibT&&now-F.nibT<260)by+=5;if(F.ph==='bite')by+=10+Math.sin(tt*30)*2;
    if(F.ph!=='fly'){q.strokeStyle='rgba(255,255,255,.6)';q.lineWidth=1;q.beginPath();q.moveTo(bx,by+8);q.lineTo(bx,108);q.stroke();q.fillStyle='#c8ccd4';q.fillRect(bx-1,106,3,5);
      // ombre: la prescelta si avvicina all'amo
      const chs=F.sh[0];F.sh.forEach((s,i)=>{const ang=i*2.1+tt*(.3+i*.13),r=s.ch&&F.ph==='wait'&&now>F.tw-1600?Math.max(0,(F.tw-now)/1600)*160:s.flee?220:110+i*30;const x=bx+Math.cos(ang)*r,y=70+i*16+Math.sin(ang*1.7)*10;
        sil(x,s.ch&&F.ph==='bite'?108:y,36*s.s,s.gl&&s.ch?'#3a3010':'#04111f',Math.sin(ang)>0?-1:1,(s.al==null?1:s.al)*(s.ch?.85:.55),s.ch?s.gl:'')})}
    q.fillStyle='#e8483a';q.fillRect(bx-5,by,10,8);q.fillStyle='#ffffff';q.fillRect(bx-4,by-5,8,5);
    if(F.ph==='bite'){const a=.5+Math.sin(tt*20)*.5;q.fillStyle=`rgba(255,216,74,${.15*a})`;q.fillRect(0,0,W2,H2);txt('!',bx,92,64,'#ffd84a');txt('FERRA!',bx+120,70,22,'#ffffff')}
    else if(F.ph==='wait'){const ch=F.sh[0];if(ch&&ch.s>1.05)txt(ch.gl===FRC[4]?'Un\'ombra enorme e dorata...':'Un\'ombra grossa si avvicina...',W2/2,138,13,ch.gl||'#cfe8ff','italic')}return}
  if(F.ph==='fight'){const x0=40,x1=470,y0=58,y1=106,w=x1-x0,zw=F.zw*(F.deep>0?.78:1);
    q.fillStyle='rgba(0,10,20,.45)';q.beginPath();q.roundRect(x0-6,y0-6,w+12,y1-y0+12,10);q.fill();const gg=q.createLinearGradient(x0,0,x1,0);gg.addColorStop(0,'rgba(40,120,180,.4)');gg.addColorStop(1,'rgba(20,70,130,.4)');q.fillStyle=gg;q.fillRect(x0,y0,w,y1-y0);
    if(F.dw>0){q.strokeStyle=`rgba(255,80,60,${.5+Math.sin(tt*40)*.5})`;q.lineWidth=3;q.strokeRect(x0-3,y0-3,w+6,y1-y0+6)}
    const zx=x0+(F.zc-zw/2)*w;q.fillStyle=F.inz?'rgba(255,215,90,.38)':'rgba(255,215,90,.18)';q.fillRect(zx,y0,zw*w,y1-y0);q.strokeStyle='#ffd84a';q.lineWidth=2.5;q.strokeRect(zx,y0,zw*w,y1-y0);
    const f=F.f,fx=x0+F.fp*w,jy=F.jt>=0?Math.sin(Math.min(1,F.jt/.9)*Math.PI)*42:0,len=Math.min(70,26+Math.log10(1+f.kg[1])*14);
    sil(fx,(y0+y1)/2-jy,len,F.jt>=0?'#cfe8ff':'#0a1a2a',F.ft>F.fp?1:-1,1,f.r>=3?FRC[f.r]:'');if(F.dw>0)txt('!',fx,y0-8,24,'#ff6a4a');
    // anello dei progressi
    const cx=515,cy=82,R2=28;q.lineWidth=7;q.strokeStyle='rgba(255,255,255,.15)';q.beginPath();q.arc(cx,cy,R2,0,6.3);q.stroke();q.strokeStyle=F.pr>.7?'#5ad65a':F.pr>.35?'#ffd84a':'#ff6a4a';q.beginPath();q.arc(cx,cy,R2,-Math.PI/2,-Math.PI/2+F.pr*6.283);q.stroke();
    txt(Math.round(F.pr*100)+'%',cx,cy+5,14,'#ffffff');txt(f.r>=4?'??? · leggendario':f.r>=3?'???  · grosso':'???',(x0+x1)/2,y0-16,13,f.r>=3?FRC[f.r]:'#cfe8ff','italic');
    txt(F.hold?'▶ recupero':'◀ la corrente tira',(x0+x1)/2,y1+24,12,'#cfe8ff','italic');return}
  // cartolina del pescato
  if((F.ph==='land'||F.ph==='end')&&F.res){const r=F.res,f=r.f,col=FRC[f.r];q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,0,W2,H2);const cg=q.createRadialGradient(110,80,10,110,80,90);cg.addColorStop(0,col+'88');cg.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=cg;q.fillRect(0,0,220,H2);
    const ml=F.cm||(F.cm=fishModel(f,1)),ppt=Math.min(230/Math.max(.3,f.l),2400/Math.max(2,f.h*(f.sh==="sun"?2.4:1)),440);const og=g;g=q;try{q.setTransform(dp*ppt/32,0,0,dp*ppt/32,110*dp,(96+f.h*ppt/80)*dp);drawHero(ml,0,0,0,0,(Math.floor(tt*1.2))&7)}catch(e){}finally{g=og;q.setTransform(dp,0,0,dp,0,0)}
    q.textAlign='left';q.font='bold 24px Georgia,serif';q.fillStyle=col;q.fillText(f.n,230,48);q.font='italic 14px Georgia,serif';q.fillStyle='#e8f0f8';q.fillText(FRN[f.r]+' · '+fkgS(r.kg)+' · vale '+f.p+'💰',230,72);
    let bx2=230;const badge=(s,c2)=>{q.font='bold 12px Georgia,serif';const w=q.measureText(s).width+16;q.fillStyle=c2;q.beginPath();q.roundRect(bx2,88,w,22,11);q.fill();q.fillStyle='#1a1408';q.fillText(s,bx2+8,103);bx2+=w+8};
    if(r.nw)badge('★ Nuova specie','#ffd84a');if(r.rec)badge('▲ Nuovo record','#7ad0ff');if(f.r>=4)badge('Leggenda dei mari','#ffae2b');
    if(F.ph==='land'&&cineOK()&&Math.random()<.4){q.fillStyle='#ffffff';q.fillRect(Math.random()*W2,Math.random()*H2,2,2)}
    q.font='12px Georgia,serif';q.fillStyle='rgba(230,240,250,.7)';q.fillText('Specie trovate: '+FISHT.filter(x=>P.fish[x.id]>0).length+'/'+FISHT.length,230,134);return}
  surf();txt(F.msg.length>60?F.msg.slice(0,58)+'…':F.msg,W2/2,92,15,'#ffffff','italic')}
(function(){const st=document.createElement('style');st.textContent=`
#pn.fishp{top:auto!important;bottom:calc(14px + env(safe-area-inset-bottom,0px))!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:min(600px,96vw)!important;max-height:70vh;padding:10px 14px 8px;background:linear-gradient(180deg,rgba(10,30,50,.96),rgba(6,16,30,.97));border:2px solid #4aa3d8;border-radius:12px;color:#e8f2fa;box-shadow:0 16px 50px #000b}
#pn.fishp .fhd{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:6px}#pn.fishp .fhd b{font:700 18px Georgia,serif;color:#9adcff}#pn.fishp .fhd span{font:italic 13px Georgia,serif;opacity:.75}
#pn.fishp canvas#fcv{width:100%;aspect-ratio:560/150;display:block;border-radius:8px;border:1px solid #2a5a7a;touch-action:none;cursor:pointer}
#pn.fishp #fmsg{margin:7px 2px;font:15px/1.4 Georgia,serif;min-height:1.4em}
#pn.fishp .fbr{display:flex;gap:6px;flex-wrap:wrap}#pn.fishp .fbr button{margin:0}#pn.fishp #fbt{flex:1;font-weight:700;background:linear-gradient(180deg,#2a6a9a,#1a4a72);border-color:#7ad0ff}
#pn.fishp #fbt.hot{background:linear-gradient(180deg,#e8a020,#b86a10);border-color:#ffd84a;animation:fbHot .25s infinite alternate}@keyframes fbHot{to{transform:scale(1.04)}}
#pn.fishp .fsm{font-size:12px;margin:6px 0 0;opacity:.7}
.fdia{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin:8px 0;max-height:46vh;overflow:auto}
.fde{border:1px solid var(--rc);border-left:4px solid var(--rc);border-radius:6px;padding:5px 8px;display:flex;flex-direction:column;gap:1px;background:#0002}.fde b{color:var(--rc)}.fde small{opacity:.7;font-size:11px}.fde span{font-size:12px}.fde.no{opacity:.55}`;document.head.appendChild(st)})();

/* ================= 7.3: Stefano «il Cavallo Pazzo» e la Puledra — a pesca in mare aperto in cerca dei pesci leggendari ================= */
Object.assign(NPCS,{stefano:{n:'Stefano «il Cavallo Pazzo»',c:'#2a5a8a',hat:'#c0392b',role:'',ln:['IIIIH-HIHIHI! Lo senti il mare? Ti sta chiamando, ragazzo!',
  'Mi chiamano il Cavallo Pazzo da quando inseguii un tonno al galoppo... dentro il mare. Col cavallo. Non chiedere.',
  'Trent\'anni che inseguo il Vecchio Testardo. Mi ha mangiato una canna, un cappello e metà del mio orgoglio!',
  'La Puledra è la barca più veloce del porto. La più rumorosa di sicuro. Come il suo capitano!',
  'I pesci leggendari esistono, eccome! Gli altri ridono. Io pesco. HIIIH!',
  'Il segreto? Guarda le ombre sotto l\'acqua. Se è grossa e dorata... tieniti forte al cappello!'],qs:['ste1','ste2','ste3','ste4','ste5','ste6']}});
Object.assign(QT,{
  ste1:{t:'fish',f:'any',zb:1,n:3,once:1,unl:'ste1',ti:'Il battesimo del mare',tx:'Sali sulla Puledra e pesca tre pesci in mare aperto! Dal molo si prendono le sardine: là fuori, i pesci veri. HIIIH!',g:150,x:120},
  ste2:{t:'fish',f:'re_spada',n:1,once:1,req:'ste1',unl:'ste2',ti:'Il Re della Scogliera',tx:'Alla Scogliera dei Gabbiani nuota il Re Spada: una spada d\'oro lunga come un remo. Prendilo, e ti porto dove nessuno osa andare!',g:900,x:700},
  ste3:{t:'fish',f:'tonno_rosso',n:1,once:1,req:'ste2',unl:'ste3',rod:3,ti:'Il tonno dei tonni',tx:'Sul Banco dei Tonni c\'è un tonno rosso grande come una carrozza. Tira come dieci cavalli! Portalo a bordo e ti regalo la mia canna migliore.',g:1300,x:1000},
  ste4:{t:'fish',f:'murena_abissi',n:1,once:1,req:'ste3',unl:'ste4',ti:'Denti nel buio',tx:'Nella Fossa Profonda l\'acqua è nera come la pece. Lì vive la Murena degli Abissi: gli occhi le brillano viola. Non farti mordere!',g:1500,x:1200},
  ste5:{t:'fish',f:'luna_argento',n:1,once:1,req:'ste4',unl:'ste5',ti:'La luna sotto il mare',tx:'Nella Grotta Marina, quando tutto è buio, nuota la Luna d\'Argento: un pesce tondo che brilla come la luna piena. Mia nonna giurava di averla vista.',g:1800,x:1500},
  ste6:{t:'fish',f:'vecchio_testardo',n:1,once:1,req:'ste5',unl:'ste6',ti:'Il Vecchio Testardo',tx:'È ora. Alla Punta del Naufragio, tra le ossa delle navi, mi aspetta da trent\'anni il Vecchio Testardo. Una cernia enorme, piena dei miei ami. Aiutami a prenderlo, compagno!',g:5000,x:3500}});
const SEAG=[['mare_scogliera','Scogliera dei Gabbiani','Scogli, gabbiani e acqua limpida. Il Re Spada caccia qui.',null],['mare_banco','Banco dei Tonni','Mare aperto, tonni che saltano. Il Tonno Rosso Gigante.','ste2'],
  ['mare_fossa','Fossa Profonda','Acqua nera e fredda. La Murena degli Abissi.','ste3'],['mare_grotta','Grotta Marina','Una grotta che brilla nel buio. La Luna d\'Argento.','ste4'],['mare_naufragio','Punta del Naufragio','Relitti e tempesta. Il Vecchio Testardo.','ste5']];
function seaHTML(e){const onb=Zk.startsWith('mare_');let h='';
  if(!P.rod)h+=`<button onclick="P.rod=1;flt(P,'+🎣','#9adcff');msg('Stefano ti presta una canna da pesca!');save();pn('npc')">🎣 Fatti prestare una canna</button>`;
  h+=`<h4>⛵ ${onb?'Dove andiamo adesso?':'Salpa con la Puledra'}</h4>`;
  for(const[k,n,ds,req]of SEAG){const ok=!req||P.unl[req];if(k===Zk)continue;h+=ok?`<button onclick="seaGo('${k}')">⛵ ${esc(n)} <small class="mu">· ${esc(ds)}</small></button>`:`<button disabled style="opacity:.45">🔒 ${esc(n)} <small class="mu">· prima completa la missione di Stefano</small></button>`}
  if(onb)h+=`<button onclick="seaHome()">⚓ Torna al porto di Aldoria</button>`;
  return h+`<button onclick="pn('fdia')">📖 Diario del pescatore</button>`}
function seaGo(k){if(!P.rod){P.rod=1;msg('Stefano ti presta una canna da pesca!')}cl();const G=SEAG.find(s=>s[0]===k);irisGo(()=>{load(k,Zk);banner('La Puledra salpa!',G?G[1]:'','luna');whoosh()})}
function seaHome(){cl();irisGo(()=>{load('porto','town');P.px=10.5+1;P.py=45.5;P.path=[];camX=PX(P.px,P.py);camY=PY(P.px,P.py,10);msg('Si torna al porto. HIIIH!')})}
// premio speciale della terza missione: la canna di Stefano
const _qTurn73=qTurn;qTurn=function(q){const T=QT[q&&q.id];_qTurn73(q);if(T&&T.rod&&(P.rod||0)<T.rod){P.rod=T.rod;setTimeout(()=>banner('Canna del Cavallo Pazzo','Zona dorata più larga e pesci leggendari più vicini','stella'),1200);save()}};
// ---- il mare: la barca al centro, e attorno il paesaggio di ogni zona ----
let BOATD=new Set(),BOATA=new Set();
const SEAZ={scogliera:{n:'In barca · Scogliera dei Gabbiani',pool:'#2f86c4',bg:'#62a8de',sky:['#3f84d4','#86bce8','#d9eef9']},
  banco:{n:'In barca · Banco dei Tonni',pool:'#2a6ca8',bg:'#4a88c8',sky:['#3a78c8','#7ab2e4','#cfe6f6']},
  fossa:{n:'In barca · Fossa Profonda',pool:'#163e66',bg:'#20384e',sky:['#3a4a64','#6a7a90','#a8b4c0']},
  grotta:{n:'In barca · Grotta Marina',pool:'#0f5a66',bg:'#04080c',cave:1},
  naufragio:{n:'In barca · Punta del Naufragio',pool:'#24486a',bg:'#2a3440',sky:['#2a3240','#4a5464','#7a8494']}};
for(const k in SEAZ){const s=SEAZ[k];Z['mare_'+k]={n:s.n,lv:6,N:40,a:s.pool,b:s.pool,bg:s.bg,pool:s.pool,mus:'pesca',pt:'mote',gen:genSea,dist:1,wl:s.cave?'#2a2a32':'#3a3a44',wh:s.cave?70:6,nolamp:1,sea:1,boat:1,gr:k,rd:['#8a6a42','#7e6040']};if(s.sky)SKY['mare_'+k]=s.sky}
function genSea(o){const{F,N2,FS,n}=o,z=ZZ,gr=z.gr;BOATD=new Set();BOATA=new Set();
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}
  if(SEAZ[gr].cave){for(let y=0;y<n;y++)for(let x=0;x<n;x++){const d=Math.min(x,y,n-1-x,n-1-y)+(hh(x*.7,y*.7)*2.2|0);if(d<3){M[y][x]=1}}}
  // la Puledra: scafo, ponte, cabina, albero
  const x0=17,x1=23,y0=12,y1=30;const inB=(x,y)=>{if(y<y0||y>y1)return false;const tp=Math.max(0,y-(y1-3));return x>=x0+tp&&x<=x1-tp};
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inB(x,y)){BOATA.add(y*n+x);const edge=!inB(x-1,y)||!inB(x+1,y)||!inB(x,y-1)||!inB(x,y+1);if(edge){M[y][x]=6;DEC[y][x]='ℜ'}else{M[y][x]=0;DEC[y][x]='';BOATD.add(y*n+x)}}
  for(let y=13;y<=15;y++)for(let x=18;x<=22;x++){M[y][x]=6;DEC[y][x]='ℭ';BOATD.delete(y*n+x)}
  F(20,22,'ℳ');BOATD.delete(22*n+20);
  for(const[x,y,c]of[[18,17,'Ж'],[22,17,'Ж'],[18,26,'Ь'],[22,26,'Щ'],[22,21,'Ф'],[18,21,'Я'],[21,28,'Э']]){F(x,y,c);BOATD.delete(y*n+x)}
  const s=N2('stefano',20,16);s.fc0=faceOf(0,1);
  // posti per pescare lungo le murate
  for(const[x,y,ox,oy]of[[18,19,-1,0],[22,19,1,0],[18,24,-1,0],[22,24,1,0],[20,29,0,1],[20,28,0,1]])if(M[y][x]===0)FS(x,y,ox,oy);
  // paesaggio
  const rk=(x,y,c)=>{if(x>0&&y>0&&x<n-1&&y<n-1&&M[y][x]===2&&!inB(x,y)&&!(x>=15&&x<=25&&y>=10&&y<=32)){M[y][x]=6;DEC[y][x]=c}};
  const cluster=(cx,cy,r,c)=>{for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++)if(Math.hypot(x-cx,y-cy)<=r-hh(x,y)*1.2)rk(x,y,c)};
  if(gr==='scogliera'){cluster(5,6,4,'ℛ');cluster(33,9,3,'ℛ');cluster(7,33,3,'ℛ');cluster(34,32,4,'ℛ');cluster(31,20,2,'ℛ');for(const[x,y]of[[10,20],[28,26],[12,12]])rk(x,y,'ℛ')}
  else if(gr==='banco'){for(const[x,y]of[[8,8],[32,10],[10,30],[30,32],[6,20],[34,22]])if(M[y][x]===2)DEC[y][x]='^'}
  else if(gr==='fossa'){for(const[x,y]of[[9,14],[31,26]])rk(x,y,'ℨ')}
  else if(gr==='grotta'){for(let i=0;i<26;i++){const x=3+Math.floor(hh(i,1)*34),y=3+Math.floor(hh(1,i)*34);rk(x,y,'ℵ')}}
  else if(gr==='naufragio'){cluster(8,9,3,'ℛ');cluster(33,30,3,'ℛ');for(const[x,y]of[[10,24],[11,25],[29,10],[30,11],[31,12],[6,32],[33,6]])rk(x,y,'ℨ')}
  return[20,19]}
// ponte di legno della barca
function deckTile(x,y,h){box(x,y,-6,1,1,6,'#5a3a22',.9);const tn=['#a87e50','#9c7448','#b08654','#946c42'];
  for(let i=0;i<4;i++){const c=tn[(hs(x*13+y*29+i)>>>3)%4];box(x+i*.25+.015,y+.01,-1,.22,.98,1,c,.94+h*.08)}
  if((x+y)%3===0)box(x+.4,y+.45,0,.04,.04,.25,'#3a2a1a')}
// decorazioni del mare e della barca
function decSea(x,y,c,h){switch(c){
  case 'ℜ':{const ob=(a,b)=>!BOATA.has(b*N+a),H0=-14,c1='#23446e',c2='#7a4a28';
    const wallX=(xx)=>{box(xx,y,H0,.16,1,12,c1,.95);box(xx,y,-2.5,.16,1,1.4,'#f0e8d8');box(xx,y,-1.1,.16,1,10,c2,.93);box(xx-.02,y,8.9,.2,1,1.3,'#c89a5a')};
    const wallY=(yy)=>{box(x,yy,H0,1,.16,12,c1,.95);box(x,yy,-2.5,1,.16,1.4,'#f0e8d8');box(x,yy,-1.1,1,.16,10,c2,.93);box(x,yy-.02,8.9,1,.2,1.3,'#c89a5a')};
    if(ob(x-1,y))wallX(x);if(ob(x,y-1))wallY(y);if(ob(x+1,y))wallX(x+.84);if(ob(x,y+1))wallY(y+.84);
    if((x+y)%3===0&&!ob(x,y-1)&&!ob(x,y+1)===false)box(x+.42,y+.42,10,.12,.12,2.5,'#5a3a1e');return true}
  case 'ℭ':{const top=y===13,frt=y===15,lft=x===18,rgt=x===22;box(x,y,0,1,1,24,'#e8e0d0',.92);box(x-.02,y-.02,24,1.04,1.04,2.5,'#c0392b');
    if(frt&&(x===19||x===21))box(x+.2,y+.97,11,.6,.05,7,'#7ad0ff',1.1);if(rgt&&y===14)box(x+.97,y+.2,11,.05,.6,7,'#7ad0ff',1.1);if(frt&&x===20){box(x+.2,y+.97,0,.6,.05,17,'#6a4224');box(x+.45,y+1.02,8,.1,.05,1.4,'#d4af37')}
    if(top&&x===20)box(x+.35,y+.35,26.5,.3,.3,10,'#3a3a3a');return true}
  case 'ℳ':{box(x+.4,y+.4,0,.2,.2,90,'#6a4224');box(x+.1,y+.42,60,.8,.16,1.2,'#5a3a1e');const sw=Math.sin(t*1.4)*.04;box(x-.6+sw,y+.48,26,2.2,.04,34,'#f4ecdc',.98);box(x-.6+sw,y+.47,40,2.2,.05,5,'#c0392b');
    box(x+.35,y+.35,90,.3,.3,3,'#c0392b');box(x+.5,y+.45,93,.5+Math.sin(t*3)*.1,.04,5,'#f2c230');return true}
  case 'ℛ':{const r=.8+h*.6,ht=8+h*26;box(x+.05,y+.05,-8,.9,.9,ht,'#6a6a72',.85+h*.1);box(x+.2,y+.15,-8+ht,.6,.6,4+h*6,'#7a7a82',.9);box(x+.1,y+.1,-8+ht*.3,.8,.8,1.5,'#3a6a3a');
    if(h>.6){box(x+.3,y+.3,-4+ht+(4+h*6),.4,.4,1.6,'#c8b890');box(x+.42,y+.42,-2.4+ht+(4+h*6),.14,.14,1.2,'#f4f4f4')}return true}
  case 'ℨ':{box(x+.1,y+.2,-10,.8,.6,10,'#4a3420',.85);box(x+.15,y+.25,0,.7,.08,6,'#5a4028');if(h>.5){box(x+.45,y+.45,-6,.12,.12,38+h*20,'#4a3a2a');box(x+.2,y+.48,22+h*10,.6,.05,1.2,'#3a2a1a');box(x+.5,y+.46,24,.03,.03,14,'#8a8070')}
    else box(x+.05,y+.3,-4,.9,.4,4,'#3a2a1a');return true}
  case 'ℵ':{const ht=6+h*22;box(x+.1,y+.1,-8,.8,.8,ht,'#4a5a66',.95);box(x+.25,y+.25,-8+ht,.5,.5,5,'#5a6a76');box(x+.3,y+.2,-8+ht*.4,.14,.14,4,'#7affe0',1.7);if(h>.4)box(x+.6,y+.55,-8+ht*.7,.12,.12,3,'#a0d8ff',1.7);if(h>.7)box(x+.15,y+.6,-8+ht+2,.1,.1,4,'#c8a0ff',1.7);return true}}
  return false}
// gabbiani, tonni che saltano, nebbia, lucciole marine, pioggia: un tocco di vita per ogni mare
function seaOverlay(){if(!ZZ||!ZZ.sea)return;const gr=ZZ.gr;
  // scia e schiuma attorno allo scafo
  g.strokeStyle='rgba(240,250,255,.45)';g.lineWidth=1.2;for(let i=0;i<14;i++){const y=12+i*1.4,ph=(t*1.5+i*.7)%1;g.globalAlpha=(1-ph)*.6;for(const[x,dx]of[[16.6,-1],[23.4,1]]){const xx=x+dx*ph*1.2;g.beginPath();g.moveTo(PX(xx,y),PY(xx,y,-3));g.lineTo(PX(xx,y+.6),PY(xx,y+.6,-3));g.stroke()}}g.globalAlpha=1;
  if(gr==='scogliera'||gr==='naufragio'||gr==='banco'){for(let i=0;i<5;i++){const a=t*.4+i*1.26,r=9+i*2,x=20+Math.cos(a)*r,y=20+Math.sin(a)*r*.7,z=60+i*8+Math.sin(t*2+i)*4,fl=Math.sin(t*9+i)*.12;
      box(x-.08,y-.04,z,.16,.08,2,'#f4f4f4');box(x-.28,y-.03,z+1+fl*10,.2,.06,.8,'#e8e8e8');box(x+.08,y-.03,z+1+fl*10,.2,.06,.8,'#e8e8e8')}}
  if(gr==='banco'){const k=(t*.5)%3;if(k<1){const x=8+(Math.floor(t*.5/3)*7)%24,y=6+(Math.floor(t*.5/3)*11)%28,j=Math.sin(k*Math.PI);drawHero(fishModel(FISHI.tonno,.7),x+k*2,y,-6+j*30,0,faceOf(1,0))}}
  g.save();g.setTransform(DPR,0,0,DPR,0,0);
  if(gr==='fossa'){const gd=g.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,H*.75);gd.addColorStop(0,'rgba(10,20,30,0)');gd.addColorStop(1,'rgba(4,10,18,.55)');g.fillStyle=gd;g.fillRect(0,0,W,H);
    g.fillStyle='rgba(200,220,235,.06)';for(let i=0;i<6;i++){const x=((t*14+i*230)%(W+400))-200;g.beginPath();g.ellipse(x,H*(.2+i*.12),260,40,0,0,6.3);g.fill()}}
  if(gr==='grotta'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,W,H);for(let i=0;i<40;i++){const x=(hh(i,3)*W+Math.sin(t*.3+i)*30)%W,y=(hh(3,i)*H+Math.cos(t*.4+i)*20)%H,a=.4+Math.sin(t*2+i)*.4;g.fillStyle=`rgba(120,255,230,${a})`;g.beginPath();g.arc(x,y,1.5+(i%3),0,6.3);g.fill()}}
  if(gr==='naufragio'){g.strokeStyle='rgba(200,215,235,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<70;i++){const x=(hh(i,7)*W+t*240+i*13)%W,y=(hh(7,i)*H+t*520)%H;g.moveTo(x,y);g.lineTo(x-6,y+14)}g.stroke();
    if((t%11)<.12){g.fillStyle='rgba(255,255,255,.25)';g.fillRect(0,0,W,H)}}g.restore()}
// arrivo in mare: musica e piccolo rollio della telecamera
const _ct73=camTarget;camTarget=function(){const r=_ct73();if(ZZ&&ZZ.boat)return[r[0]+Math.sin(t*.9)*.05,r[1]+Math.sin(t*1.3)*.07];return r};
Object.assign(TRK,{pesca:{sng:1,bpm:104,root:62,sc:'maj',spb:12,ld:'flute',lv:.04,echo:1,bs:'shanty',cp:'strum6',dr:'shanty',dv:.55,form:'AABA',parts:{
  A:{ch:[0,3,4,0],m:'4:3 2:3 0:3 2:3  3:3 5:3 7:6  6:3 5:3 4:3 2:3  4:9 r:3'},
  B:{ch:[5,3,0,4],m:'9:3 7:3 5:3 7:3  8:3 7:3 5:6  4:3 5:3 7:3 9:3  8:6 6:6'}}}});

/* ================= 7.3: Gabriele «Ryan il Pelato» e le battaglie — truppe, corsie, ordini e assalti all'accampamento nemico ================= */
Object.assign(NPCS,{ryan:{n:'Gabriele «Ryan il Pelato»',c:'#5a6a4a',hat:'#3a4a2a',role:'',ln:['Gabriele. Ma tutti mi chiamano Ryan il Pelato. Il primo che ride fa cinquanta flessioni!',
  'Una testa lucida riflette il sole negli occhi del nemico. Strategia, soldato!','Le battaglie non si vincono con la forza. Si vincono con gli ordini giusti al momento giusto!',
  'Ho perso i capelli in battaglia. Tutti. In una notte. Non parliamone.','In piedi, soldato! Il regno ha bisogno di comandanti, non di turisti!',
  'Lancieri contro cavalieri, cavalieri contro arcieri, arcieri contro fanti, fanti contro lancieri. Ripetilo finché non lo sogni!'],qs:['ry1','ry2','ry3','ry4','ry5']}});
const BATS={guado:{n:'Il Guado dei Salici',fac:'banditi',fn:'Banditi del Guado',diff:.62,pu:['fanti','arcieri'],eu:['fanti','arcieri'],ab:['carica'],rw:[400,320],ds:'Banditi che assaltano i carri dei mercanti. La battaglia per imparare.'},
  ponte:{n:'Il Ponte di Pietra',fac:'goblin',fn:'Orda dei Goblin',diff:.8,pu:['fanti','arcieri','lancieri'],eu:['fanti','arcieri','lancieri'],ab:['carica','frecce'],rw:[700,560],ds:'Un fiume taglia il campo: si passa solo sui tre ponti.'},
  colle:{n:'Il Colle dei Corvi',fac:'ossa',fn:'Legione delle Ossa',diff:.95,pu:['fanti','arcieri','lancieri','cavalieri'],eu:['fanti','arcieri','lancieri','cavalieri'],ab:['carica','frecce','rinforzi'],rw:[1100,900],ds:'I morti si rialzano tra le tombe. Arrivano i tuoi primi cavalieri.'},
  forte:{n:'L\'assedio del Forte Nero',fac:'nero',fn:'Predoni del Forte Nero',diff:1.1,tw:1.6,pu:['fanti','arcieri','lancieri','cavalieri','catapulta'],eu:['fanti','arcieri','lancieri','cavalieri'],ab:['carica','frecce','rinforzi'],rw:[1600,1300],ds:'Torri robuste e una palizzata. Porta le catapulte!'},
  spade:{n:'La Piana delle Spade',fac:'legione',fn:'Legione Nera',diff:1.2,pu:['fanti','arcieri','lancieri','cavalieri','catapulta'],eu:['fanti','arcieri','lancieri','cavalieri','catapulta'],ab:['carica','frecce','rinforzi'],rw:[3000,2500],gen:1,ds:'La battaglia finale. Il Generale Varg guida la Legione Nera.'}};
Object.assign(QT,{
  ry1:{t:'bat',b:'guado',n:1,once:1,unl:'ry1',ti:'Battesimo del fuoco',tx:'I banditi del Guado dei Salici assaltano i carri dei mercanti. Prendi il comando di una compagnia e cacciali via! Ti porto io sul campo.',g:350,x:300},
  ry2:{t:'bat',b:'ponte',n:1,once:1,req:'ry1',unl:'ry2',ti:'Il Ponte di Pietra',tx:'Un\'orda di goblin vuole passare il fiume. Tieni i tre ponti e distruggi il loro accampamento. Ti affido i lancieri!',g:600,x:500},
  ry3:{t:'bat',b:'colle',n:1,once:1,req:'ry2',unl:'ry3',ti:'Il Colle dei Corvi',tx:'Sul Colle dei Corvi i morti marciano in file ordinate. Nessuno sa chi li comandi. Prendi i cavalieri e falli tornare sotto terra.',g:900,x:800},
  ry4:{t:'bat',b:'forte',n:1,once:1,req:'ry3',unl:'ry4',ti:'L\'assedio del Forte Nero',tx:'I predoni si sono chiusi nel Forte Nero, con torri robuste. Ci vogliono le catapulte. Ne ho fatte costruire due: sono tue.',g:1300,x:1100},
  ry5:{t:'bat',b:'spade',n:1,once:1,req:'ry4',unl:'ry5',it:'h',ti:'La Piana delle Spade',tx:'La Legione Nera del Generale Varg marcia verso Aldoria. È la battaglia della mia vita, soldato. E voglio te al comando.',g:2600,x:2200}});
Z.in_caserma.np.push(['ryan',9,6]);
// tipi di truppa: costo, vita, danno, portata, velocità, ricarica, quanti per squadra
const UT={fanti:{n:'Fanteria',ic:'⚔',c:25,hp:110,at:12,r:1.1,sp:2,cd:1,sq:3,vs:{lancieri:1.5},d:'Robusti, forti contro i lancieri.'},
  lancieri:{n:'Lancieri',ic:'🔱',c:35,hp:120,at:11,r:1.55,sp:1.8,cd:1.1,sq:3,vs:{cavalieri:2.2,gen:1.8},d:'Fermano le cariche: fortissimi contro i cavalieri.'},
  arcieri:{n:'Arcieri',ic:'🏹',c:40,hp:70,at:10,r:5,sp:1.9,cd:1.4,sq:3,rng:1,vs:{fanti:1.5},d:'Tirano da lontano, forti contro la fanteria.'},
  cavalieri:{n:'Cavalieri',ic:'🐎',c:65,hp:200,at:19,r:1.25,sp:3.3,cd:1.2,sq:2,vs:{arcieri:2.2},d:'Veloci e potenti, travolgono gli arcieri.'},
  catapulta:{n:'Catapulta',ic:'🪨',c:100,hp:160,at:42,r:7,sp:1,cd:3.6,sq:1,rng:1,cat:1,vs:{},d:'Lenta, colpisce da lontanissimo: tre volte il danno sulle torri.'}};
const UTK=['fanti','lancieri','arcieri','cavalieri','catapulta'];
const ABL={carica:{n:'Carica!',ic:'📯',cd:35,d:'8 secondi: le tue truppe corrono e colpiscono più forte.'},frecce:{n:'Pioggia di frecce',ic:'🌧',cd:28,d:'Una raffica di frecce sul gruppo nemico più numeroso nella corsia scelta.'},rinforzi:{n:'Rinforzi',ic:'🛡',cd:45,d:'Una squadra di fanti gratis nella corsia scelta.'}};
const FACC={banditi:{tp:'#7a3a2a',lg:'#3a2a1a',hc:'#a83a1a',hk:'bandana',sk:'#e0ac69'},goblin:{tp:'#5a4a2a',lg:'#3a3a1a',hc:'#7a6a3a',hk:'ears',sk:'#6aa04a',s:.86},
  ossa:{tp:'#d8d0b8',lg:'#c8c0a8',hc:'#6a5a4a',hk:'helmet',sk:'#e8e0c8',ey:'#e03a2a'},nero:{tp:'#2a2a30',lg:'#1a1a20',hc:'#1a1a20',hk:'helmet',sk:'#c68642',pl:'#c0392b'},
  legione:{tp:'#3a1a4a',lg:'#1a1020',hc:'#2a1030',hk:'horns',sk:'#d8b090',pl:'#d4af37'},aldoria:{tp:'#2a5aa8',lg:'#33343c',hc:'#a8b0bc',hk:'helmet',sk:SKIN,pl:'#2a5aa8'}};
function warModel(side,ut){const fa=side?FACC[WAR.b.fac]:FACC.aldoria,x=[];const H=(q)=>{for(const b of q)x.push(b)};
  if(fa.hk==='helmet')H(HT.helmet(fa.hc,fa.pl||null));else if(fa.hk==='bandana')H(HT.bandana(fa.hc));else if(fa.hk==='ears')H(HT.ears(fa.sk));else if(fa.hk==='horns')H(HT.horns('#d4af37')),H(HT.helmet(fa.hc));
  if(ut==='cavalieri'){const m=mQuad({c:side?(WAR.b.fac==='ossa'?'#c8c0a8':'#2a2226'):'#8a5a32',mane:side?'#1a1a1a':'#2a1a10',s:1.25});const A=(...b)=>rgAdd(m,'bd',b);
    A(-.3,-.05,12,.08,.16,8,fa.lg);A(.22,-.05,12,.08,.16,8,fa.lg);A(-.2,-.12,18,.4,.26,9,fa.tp);A(-.14,-.1,27,.28,.24,8,fa.sk);A(-.16,-.12,33.5,.32,.28,3.5,fa.hc);A(-.1,.13,30,.06,.01,1.5,'#111');A(.04,.13,30,.06,.01,1.5,'#111');
    A(.2,-.3,22,.05,1.2,1.2,'#8a6a42');A(.19,.9,21.5,.07,.14,2.2,'#c8ccd6');A(.2,.5,23,.02,.25,3,side?'#c0392b':'#2a5aa8');A(-.34,-.12,18,.06,.3,10,side?'#5a2a2a':'#2a5aa8');m.top=44;return m}
  if(ut==='catapulta'){const L=rgNew('cat'),A=(g,...b)=>rgAdd(L,g,b),w=side?'#4a3a2a':'#8a6a42';A('bd',-.35,-.4,3,.7,.8,3,w);for(const[a,b]of[[-.42,-.32],[.32,-.32],[-.42,.22],[.32,.22]])A('bd',a,b,0,.1,.12,5,'#3a2a1a');
    A('bd',-.3,-.05,6,.08,.1,14,w);A('bd',.22,-.05,6,.08,.1,14,w);A('bd',-.3,-.05,19,.6,.1,2,w);A('ar',-.04,-.45,8,.08,.7,2,shx(hx6(w),1.15));A('ar',-.1,-.55,9,.2,.18,3,'#5a4a3a');A('ar',-.07,-.52,11.5,.14,.12,3,'#7a7a82');
    A('bd',-.25,.3,6,.5,.06,2,side?'#c0392b':'#2a5aa8');L.top=26;return rgScale(L,1.1)}
  if(ut==='fanti')H(WP.sword()),H(WP.shield(fa.tp,side?'#c0392b':'#e8d070'));else if(ut==='lancieri')H(WP.spear()),H([['al',-.4,-.06,9,.06,.2,10,shx(hx6(fa.tp),.8)]]);else if(ut==='arcieri')H(WP.bow());
  if(ut==='gen')H(WP.big('#c8a8ff')),H(HT.crown('#d4af37'));
  const m=mHum({s:ut==='gen'?1.45:fa.s||1,sk:fa.sk,tp:fa.tp,lg:fa.lg,ey:fa.ey||'#111',x,rng:ut==='arcieri',belt:shx(hx6(fa.tp),.6)});return m}
// accampamenti e torri
function warBldL(side,big){const c=side?(WAR.b.fac==='ossa'?'#6a6458':'#4a3a3a'):'#8a8a92',fl=side?'#c0392b':'#2a5aa8',L=[];
  if(big){for(const[a,b,w,d]of[[-1.3,-1.3,2.6,.18],[-1.3,1.12,2.6,.18],[-1.3,-1.3,.18,2.6],[1.12,-1.3,.18,2.6]])L.push([a,b,0,w,d,12,'#6a4a2a']);for(let i=0;i<8;i++)L.push([-1.3+i*.36,-1.3,12,.12,.12,3,'#5a3a1a'],[-1.3+i*.36,1.12,12,.12,.12,3,'#5a3a1a']);
    L.push([-.7,-.7,0,1.4,1.4,16,side?'#5a2a2a':'#e8e0d0'],[-.55,-.55,16,1.1,1.1,8,side?'#4a1a1a':'#d8d0c0'],[-.3,-.3,24,.6,.6,6,side?'#3a1010':'#c8c0b0'],[-.05,-.05,0,.1,.1,64,'#5a3a1a'],[.05,-.04,48,.08,.8,16,fl],[.05,-.04,60,.08,.8,2,'#d4af37'],[-.1,.68,0,.2,.04,10,'#2a1a10'])}
  else{L.push([-.4,-.4,0,.8,.8,34,c],[-.46,-.46,34,.92,.92,4,shx(hx6(c),.85)]);for(const[a,b]of[[-.46,-.46],[.3,-.46],[-.46,.3],[.3,.3]])L.push([a,b,38,.16,.16,4,c]);L.push([-.1,.38,12,.2,.04,8,'#1a1a1a'],[0,0,38,.05,.05,18,'#5a3a1a'],[.05,-.02,48,.04,.35,7,fl])}
  return L}
let WAR=null,TRP=[];
const WA=[6.5,35.5],WE=[35.5,6.5];
function lanePts(side,l){const a=side?WE:WA,b=side?WA:WE,m=l===0?[7.5,7.5]:l===2?[34.5,34.5]:null;return m?[a,m,b]:[a,b]}
function warSetup(id){const b=BATS[id];WAR={id,b,t:0,sup:[50,50*b.diff],lane:1,ord:'avanza',sel:'fanti',cd:{},boost:0,ai:2,won:0,over:0,gen:0,kills:[0,0],first:!(P.bat&&P.bat[id])};TRP=[];
  const mk2=(side,big,x,y)=>{const lv=P.lv||1,hp=Math.round((big?4200:1000)*(1+lv*.05)*(side&&!big?(b.tw||1):1)*(side?.85+.3*b.diff:1));
    const e={k:side?'en':'tr',tr:1,bld:1,big,side,id:eid++,t:'trb',n:side?(big?'Accampamento nemico':'Torre nemica'):(big?'Il tuo accampamento':'Torre di Aldoria'),px:x,py:y,hp,mx:hp,at:big?10:16,r:big?4.5:5.5,cd:big?1.6:1.3,cdt:1,rad:big?1.45:.55,m:warBldL(side,big),b:{n:'',np:1,pt:1},fl:0,al:1,ag:0,xp:big?200:60,boss:0,sp:0};ents.push(e);return e};
  WAR.base=[mk2(0,1,WA[0],WA[1]),mk2(1,1,WE[0],WE[1])];
  for(const[x,y]of[[6.5,26.5],[13.5,28.5],[15.5,35.5]]){mk2(0,0,x,y);mk2(1,0,41-x,41-y)}
  for(const s of[0,1])for(const[dx,dy]of[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]){const c=s?WE:WA,x=Math.floor(c[0])+dx,y=Math.floor(c[1])+dy;if(M[y]&&M[y][x]!==1){M[y][x]=6;DEC[y][x]=''}}
  warUI(1);music('guerra');banner(b.n,'Contro: '+b.fn,'spade');setTimeout(()=>{if(WAR&&!WAR.over)msg('Ryan: «Scegli la corsia, poi manda le truppe! Distruggi il loro accampamento!»')},2600)}
function warSpawn(side,ut,lane,free){const W=WAR;if(!W||W.over)return false;const U=UT[ut];if(ents.filter(e=>e.tr&&!e.bld&&e.side===side).length>=30){if(!side)msg('Ryan: «Il campo è pieno, soldato! Aspetta che si liberi.»');return false}if(!free){if(W.sup[side]<U.c)return false;W.sup[side]-=U.c}
  const b=W.b,lv=P.lv||1,hm=(1+lv*.06)*(side?.8+.4*b.diff:1),am=(1+lv*.05)*(side?.8+.3*b.diff:1);const base=side?WE:WA,pts=lanePts(side,lane),d0=pts[1],dd=Math.hypot(d0[0]-base[0],d0[1]-base[1]);
  for(let i=0;i<U.sq;i++){const ox=(d0[0]-base[0])/dd*2.2+(Math.random()-.5)*1.2,oy=(d0[1]-base[1])/dd*2.2+(Math.random()-.5)*1.2,hp=Math.round(U.hp*hm);
    // 7.11: la squadra nasce solo su caselle libere (prima un soldato su cinque della corsia centrale nasceva dentro il recinto dell'accampamento e restava lì per sempre)
    const[sx,sy]=warFree(base[0]+ox,base[1]+oy,(d0[0]-base[0])/dd,(d0[1]-base[1])/dd);
    const e={k:side?'en':'tr',tr:1,side,ut,id:eid++,t:'tr_'+ut,n:(side?'':'')+U.n,px:sx,py:sy,hp,mx:hp,at:U.at*am,r:U.r,sp:U.sp,cd:U.cd,cdt:.5+Math.random()*.5,lane,wp:1,m:warModel(side,ut),b:{n:U.n,np:1},fl:0,al:1,ag:0,xp:8+lv,boss:0,fd:[d0[0]-base[0],d0[1]-base[1]]};
    ents.push(e)}
  if(!side){tone(520,.06,'triangle');if(cineOK())sparks(base[0],base[1],10,['#7ad0ff','#ffffff'],50)}return true}
function warGen(){const W=WAR,b=W.b;const lv=P.lv||1,hp=Math.round(3200*(1+lv*.06)),e={k:'en',tr:1,side:1,ut:'gen',id:eid++,t:'tr_gen',n:'Generale Varg',px:WE[0]-2,py:WE[1]+2,hp,mx:hp,at:26*(1+lv*.05),r:1.6,sp:1.4,cd:1.3,cdt:1,lane:1,wp:1,m:warModel(1,'gen'),b:{n:'Generale Varg',np:1,pt:1},fl:0,al:1,ag:0,xp:600,boss:0};
  ents.push(e);banner('Il Generale Varg scende in campo!','Fermalo prima che raggiunga il tuo accampamento','teschio');shake(.8);tone(70,.6,'sawtooth',.07)}
// ---- il cervello della battaglia ----
function warTick(dt){const W=WAR;if(!W||!ZZ||!ZZ.war||!started)return;W.t+=dt;if(W.over){W.ot=(W.ot||0)+dt;warUI();return}
  const b=W.b;W.sup[0]+=dt*5;W.sup[1]+=dt*5*b.diff;W.boost=Math.max(0,W.boost-dt);for(const k in W.cd)W.cd[k]=Math.max(0,W.cd[k]-dt);
  if(b.gen&&!W.gen&&W.t>90){W.gen=1;warGen()}
  // l'esercito nemico decide
  if((W.ai-=dt)<=0){W.ai=1.4+Math.random()*1.8;const mine={};for(const e of ents)if(e.tr&&!e.bld&&e.side===0)mine[e.ut]=(mine[e.ut]||0)+1;
    const top=Object.keys(mine).sort((a,c)=>mine[c]-mine[a])[0];const ctr={fanti:'arcieri',arcieri:'cavalieri',cavalieri:'lancieri',lancieri:'fanti',catapulta:'cavalieri'};
    let ut=top&&Math.random()<.55?ctr[top]:b.eu[Math.floor(Math.random()*b.eu.length)];if(!b.eu.includes(ut))ut=b.eu[Math.floor(Math.random()*b.eu.length)];
    if(W.sup[1]>=UT[ut].c&&(Math.random()<.75||W.sup[1]>140)){let lane=Math.floor(Math.random()*3);if(Math.random()<.5){const lc=[0,0,0];for(const e of ents)if(e.tr&&!e.bld&&e.side===0)lc[e.lane]++;lane=lc.indexOf(Math.max(...lc))}warSpawn(1,ut,lane)}}
  // squadre, torri e accampamenti
  const units=ents.filter(e=>e.tr),foes=[[],[]];for(const e of units)foes[e.side===0?1:0].push(e);if(P.hp>0)foes[1].push(P);
  for(const e of units){e.fl=Math.max(0,(e.fl||0)-dt);e.cdt-=dt;const U=UT[e.ut]||{},boost=e.side===0&&W.boost>0;
    let tg=null,bd=1e9;const ag=e.bld?e.r:(e.ut==='catapulta'?8:U.rng?6:4.6);
    for(const o of foes[e.side]){if(o.hp<=0)continue;if(e.igT>t&&dist(e,o)-(o.rad||0)>e.r)continue;const d=dist(e,o)-(o.rad||0);if(d<ag&&d<bd){bd=d;tg=o}}
    if(e.ut==='catapulta'){const bl=foes[e.side].filter(o=>o.bld&&dist(e,o)-o.rad<e.r);if(bl.length){tg=bl[0];bd=dist(e,tg)-tg.rad}}
    if(e.bld){if(tg&&e.cdt<=0){e.cdt=e.cd;warShoot(e,tg,'arrow',e.at)}continue}
    const retreat=e.side===0&&W.ord==='ritirata',hold=e.side===0&&W.ord==='difendi';
    if(retreat){const hb=WA;const d=Math.hypot(hb[0]-e.px,hb[1]-e.py);if(d>2.4)warMove(e,hb[0],hb[1],dt,boost);else e.hp=Math.min(e.mx,e.hp+e.mx*.15*dt);continue}
    if(tg){const rr=e.r*(e.ut==='gen'?1:1);if(bd>rr)warMove(e,tg.px,tg.py,dt,boost);else if(e.cdt<=0){e.cdt=e.cd*(boost?.75:1);const dx=tg.px-e.px,dy=tg.py-e.py,dd=Math.hypot(dx,dy)||1;e.atkT=t;e.atkD=[dx/dd,dy/dd];e.fd=e.atkD;
        let dmg=e.at*((U.vs||{})[tg.ut]||1)*(boost?1.5:1)*(.85+Math.random()*.3);if(tg.bld)dmg*=e.ut==='catapulta'?3:.9;
        if(e.ut==='catapulta')warShoot(e,tg,'stone',dmg);else if(U.rng)warShoot(e,tg,'arrow',dmg);else warHit(e,tg,dmg)}continue}
    if(hold){const pts=lanePts(0,e.lane),p=pts[0],q=pts[1],hx=p[0]+(q[0]-p[0])*.35,hy=p[1]+(q[1]-p[1])*.35;if(Math.hypot(hx-e.px,hy-e.py)>1)warMove(e,hx,hy,dt,boost);continue}
    const pts=lanePts(e.side,e.lane);let w=pts[Math.min(e.wp,pts.length-1)];if(Math.hypot(w[0]-e.px,w[1]-e.py)<1.4&&e.wp<pts.length-1){e.wp++;w=pts[e.wp]}warMove(e,w[0],w[1],dt,boost)}
  // separazione: non si ammucchiano
  for(let i=0;i<units.length;i++){const a=units[i];if(a.bld)continue;for(let j=i+1;j<units.length;j++){const c=units[j];if(c.bld)continue;const dx=c.px-a.px,dy=c.py-a.py,d=dx*dx+dy*dy;if(d<.25&&d>1e-6){const k=(.5-Math.sqrt(d))*.5,dd=Math.sqrt(d);mv(a,-dx/dd*k,-dy/dd*k);mv(c,dx/dd*k,dy/dd*k)}}}
  // proiettili
  for(const p of TRP){p.t+=dt;if(p.t>=p.d){p.done=1;if(p.k==='stone'){if(cineOK()){burst(p.x1,p.y1,14,['#6a5a4a','#a89878','#ffffff'],{v:1.4,up:160,gr:400,d:.8,s:3,z:2});shake(.15)}tone(80,.15,'sawtooth',.05);
        for(const o of foes[p.side].slice())if(o.hp>0&&Math.hypot(o.px-p.x1,o.py-p.y1)-(o.rad||0)<1.3)warHit(p.src,o,o===p.tg?p.dmg:p.dmg*.55)}
      else if(p.tg&&p.tg.hp>0&&Math.hypot(p.tg.px-p.x1,p.tg.py-p.y1)-(p.tg.rad||0)<1.2)warHit(p.src,p.tg,p.dmg)}}
  TRP=TRP.filter(p=>!p.done);
  if(W.base[1].hp<=0&&!W.over)warEnd(1);else if(W.base[0].hp<=0&&!W.over)warEnd(0,'Il tuo accampamento è caduto.');
  if(Math.floor(W.t*4)!==Math.floor((W.t-dt)*4))warUI()}
function warMove(e,x,y,dt,boost){const dx=x-e.px,dy=y-e.py,d=Math.hypot(dx,dy);if(d<.05)return;const sp=e.sp*dt*(boost?1.45:1);
  // 7.11: chi si trova dentro una casella bloccata (recinto dell'accampamento, palizzata, acqua) ne esce verso la casella libera più vicina
  if(blk(e.px,e.py)){const[u,v]=nearFree(e.px|0,e.py|0),ex=u+.5-e.px,ey=v+.5-e.py,ed=Math.hypot(ex,ey)||1,s=Math.min(ed,sp);e.px+=ex/ed*s;e.py+=ey/ed*s;e.fd=[ex/ed,ey/ed];e.mvT=t;return}
  // 7.11: davanti a un ostacolo (il recinto, la palizzata del Forte Nero, il fiume del Ponte) la truppa lo aggira seguendo una strada vera
  if(e.wpath&&e.wpath.length&&e.wpt>t&&Math.hypot(e.wgx-x,e.wgy-y)<3){const w=e.wpath[0],wx=w.x+.5-e.px,wy=w.y+.5-e.py,wd=Math.hypot(wx,wy);
    if(wd<.3){e.wpath.shift();if(!e.wpath.length)e.wpath=null}else{const s=Math.min(wd,sp),x0=e.px,y0=e.py;mv(e,wx/wd*s,wy/wd*s);e.fd=[wx/wd,wy/wd];e.mvT=t;if(Math.hypot(e.px-x0,e.py-y0)<s*.2)e.wpath=null}return}
  const s=Math.min(d,sp),x0=e.px,y0=e.py;mv(e,dx/d*s,dy/d*s);e.fd=[dx/d,dy/d];e.mvT=t;
  const mvd=Math.hypot(e.px-x0,e.py-y0);if(mvd<s*.25){e.stk=(e.stk||0)+dt;if(e.stk>.5){e.stk=0;const[gx,gy]=warGoal(x,y),p=path(e.px|0,e.py|0,gx,gy);
      if(p.length){e.wpath=p.slice(0,40);e.wpt=t+8;e.wgx=x;e.wgy=y}else{e.igT=t+3;e.wp=Math.max(1,e.wp)}}}else e.stk=0}
// la casella libera più vicina a un punto, cercando prima lungo la direzione della corsia
function warFree(x,y,dx,dy){if(!blk(x,y))return[x,y];for(let k=.25;k<=5;k+=.25){const u=x+dx*k,v=y+dy*k;if(!blk(u,v))return[u,v]}const[u,v]=nearFree(x|0,y|0);return[u+.5,v+.5]}
// la meta di un percorso deve essere una casella libera (il centro dell'accampamento è recintato)
function warGoal(x,y){const gx=x|0,gy=y|0;if(gx>=0&&gy>=0&&gx<N&&gy<N&&WK(M[gy][gx]))return[gx,gy];return nearFree(gx,gy)}
function warShoot(e,tg,k,dmg){const st=k==='stone';TRP.push({k,x0:e.px,y0:e.py,z0:e.bld?40:st?14:18,x1:tg.px,y1:tg.py,t:0,d:st?1.1:.35+dist(e,tg)*.06,tg,src:e,side:e.side,dmg});if(Math.random()<.4)tone(st?140:900,.04,st?'sawtooth':'triangle',.02)}
function warHit(src,o,d){d=Math.max(1,Math.round(d));if(o===P){hurtP(d);return}if(o.hp<=0)return;o.hp-=d;o.fl=.12;if(SET.dmg&&(src===P||Math.random()<.35))flt(o,d,o.side?'#ffffff':'#ffb0a0');if(o.hp<=0)kill(o)}
// la morte di una truppa (dagli eroi o dalle truppe)
const _kill73=kill;kill=function(e){if(!e||!e.tr){_kill73(e);return}const i=ents.indexOf(e);if(i<0)return;ents.splice(i,1);
  if(cineOK()&&e.m&&!e.bld)ents.push({k:'dead',m:e.m,px:e.px,py:e.py,t0:t,fc:e.m.rg?faceOf(...(e.fd||[0,1])):null});const W=WAR;if(!W)return;
  if(e.bld){if(cineOK()){burst(e.px,e.py,40,['#5a4a3a','#8a7a6a','#ffb040','#ffffff'],{v:2,up:240,gr:380,d:1.4,s:5,z:20});shake(1);pillar&&pillar(e.px,e.py,'255,180,80',1,50)}tone(60,.5,'sawtooth',.08);
    msg(e.side?(e.big?'L\'accampamento nemico crolla!':'Torre nemica distrutta!'):(e.big?'Il tuo accampamento è caduto!':'Hanno distrutto una tua torre!'));if(e.side)gainXP(Math.round(e.xp*DF.x));return}
  W.kills[e.side]++;W.sup[e.side?0:1]+=e.side?3:2;if(e.side===1&&e.ut==='gen'){banner('Il Generale Varg è caduto!','La Legione vacilla','trofeo');slowmo&&slowmo(.4,.8);gainXP(Math.round(e.xp*DF.x))}
  else if(e.side===1&&dist(e,P)<2.2)gainXP(Math.round(e.xp*DF.x*.5))};
function warEnd(win,why){const W=WAR;if(!W||W.over)return;W.over=win?1:-1;W.ot=0;W.ord='avanza';
  if(win){const b=W.b,f=W.first?1:.35,g=Math.round(b.rw[0]*f*(NET.cfg.gm||1)),x=Math.round(b.rw[1]*f);P.bat=P.bat||{};P.bat[W.id]=(P.bat[W.id]||0)+1;P.g+=g;gainXP(Math.round(x*DF.x));goldFly(g);
    for(const q of P.q){const T=QT[q.id];if(T.t==='bat'&&T.b===W.id&&!qReady(q))q.c=1}npcMarks();
    if(cineOK()){slowmo&&slowmo(.35,1.4);shake(1.2);for(let i=0;i<6;i++)setTimeout(()=>{if(WAR)burst(WE[0]+(Math.random()-.5)*3,WE[1]+(Math.random()-.5)*3,24,['#ffd84a','#ffffff','#2a5aa8'],{v:2,up:260,gr:260,d:1.4,s:5,z:40})},i*200)}
    jingle([60,64,67,72,76,79,84],.12,'square');banner('Vittoria!',b.n+' · +'+g+' oro, +'+x+' XP','trofeo')}
  else{tone(90,.6,'sawtooth',.06);banner('Sconfitta',why||'Ritirata!','teschio');P.hp=Math.max(P.hp,Math.round(P.mx*.5))}
  save();warUI(1)}
function warLeave(){cl();const W=WAR;irisGo(()=>{WAR=null;warUI(0);load('in_caserma','town');const r=ents.find(e=>e.nid==='ryan');if(r){P.px=r.px;P.py=r.py+1.2;P.path=[];camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}
  if(W&&W.over===1)setTimeout(()=>msg('Ryan: «Che spettacolo, soldato! Vieni a prendere la tua ricompensa!»'),900)})}
function warGo(id){if(!BATS[id])return;cl();irisGo(()=>{load('bat_'+id,'in_caserma')})}
// ---- il comando: carte delle truppe, corsie, ordini, abilità di Ryan ----
function warCmd(k,a){const W=WAR;if(!W||W.over)return;
  if(k==='u'){if(!W.b.pu.includes(a))return;if(!warSpawn(0,a,W.lane)){tone(150,.1);msg('Rifornimenti insufficienti')}}
  else if(k==='l'){W.lane=a;tone(600,.04,'triangle')}else if(k==='o'){W.ord=a;tone(500,.05,'triangle');msg({avanza:'Ryan: «Avanti, avanti, AVANTI!»',difendi:'Ryan: «Tenete la posizione!»',ritirata:'Ryan: «Ritirata! Tutti all\'accampamento!»'}[a])}
  else if(k==='a'){if(!W.b.ab.includes(a)||W.cd[a]>0)return;W.cd[a]=ABL[a].cd;
    if(a==='carica'){W.boost=8;tone(392,.3,'square',.05);setTimeout(()=>tone(523,.5,'square',.05),300);banner('Carica!','Le tue truppe si lanciano in avanti','spade');if(W.ord==='ritirata')W.ord='avanza'}
    else if(a==='frecce'){const pts=lanePts(0,W.lane);let best=null,bn=0;for(const e of ents)if(e.tr&&e.side===1&&!e.bld){let n=0;for(const o of ents)if(o.tr&&o.side===1&&!o.bld&&dist(e,o)<2.2)n++;if(n>bn){bn=n;best=e}}
      const c=best||{px:(pts[0][0]+pts[pts.length-1][0])/2,py:(pts[0][1]+pts[pts.length-1][1])/2};for(let i=0;i<18;i++){const x=c.px+(Math.random()-.5)*4,y=c.py+(Math.random()-.5)*4;TRP.push({k:'arrow',x0:WA[0],y0:WA[1],z0:80,x1:x,y1:y,t:-Math.random()*.4,d:.9,side:0,src:P,dmg:0,rain:1})}
      setTimeout(()=>{if(!WAR)return;for(const e of ents.slice())if(e.tr&&e.side===1&&!e.bld&&Math.hypot(e.px-c.px,e.py-c.py)<2.4)warHit(P,e,55*(1+(P.lv||1)*.05))},1100);tone(900,.2,'triangle',.03)}
    else if(a==='rinforzi'){warSpawn(0,'fanti',W.lane,1);banner('Rinforzi!','Una squadra di fanti arriva al campo','spade')}}
  warUI(1)}
// riscrive il pannello solo se il contenuto cambia: rifarlo a ogni tick distruggeva i pulsanti mentre venivano cliccati
function setBH(el,h){if(el._h!==h){el._h=h;el.innerHTML=h}}
function warUI(on){let el=$('batui');if(on===0){if(el)el.remove();document.body.classList.remove('batt');return}const W=WAR;if(!W)return;
  if(!el){el=document.createElement('div');el.id='batui';document.body.appendChild(el);el.addEventListener('pointerdown',e=>e.stopPropagation())}document.body.classList.add('batt');
  const b=W.b,hb=s=>Math.max(0,W.base[s].hp/W.base[s].mx*100);const sup=Math.floor(W.sup[0]);
  if(W.over){const ok=W.over===1;setBH(el,`<div class="bt-top"><div class="bt-end ${ok?'win':'lose'}"><b>${ok?'🏆 Vittoria!':'💀 Sconfitta'}</b><span>${ok?'Il nemico è in rotta. Ryan esulta!':'I tuoi soldati si ritirano. Riprova con un\'altra strategia.'}</span><button onclick="warLeave()">Torna in caserma da Ryan</button>${ok?'':`<button onclick="warRetry()">Riprova la battaglia</button>`}</div></div>`);return}
  let h=`<div class="bt-top"><div class="bt-hp"><i style="width:${hb(0)}%"></i><span>Il tuo accampamento</span></div><b>${esc(b.n)}</b><div class="bt-hp en"><i style="width:${hb(1)}%"></i><span>${esc(b.fn)}</span></div></div>`;
  h+=`<div class="bt-bar"><div class="bt-sup">🌾 <b>${sup}</b><small>rifornimenti</small></div><div class="bt-units">`;
  UTK.forEach((k,i)=>{if(!b.pu.includes(k))return;const U=UT[k],can=sup>=U.c;h+=`<button class="bt-u ${can?'':'no'}" title="${esc(U.n+': '+U.d)}" onclick="warCmd('u','${k}')"><em>${i+1}</em><span>${U.ic}</span><b>${U.n}</b><small>${U.c} 🌾 · ×${U.sq}</small></button>`});
  h+=`</div><div class="bt-col"><div class="bt-lanes">${['Alta','Centro','Bassa'].map((n,i)=>`<button class="${W.lane===i?'on':''}" onclick="warCmd('l',${i})">${n}</button>`).join('')}</div><div class="bt-ord">${[['avanza','⚔ Avanza'],['difendi','🛡 Difendi'],['ritirata','↩ Ritirata']].map(([k,n])=>`<button class="${W.ord===k?'on':''}" onclick="warCmd('o','${k}')">${n}</button>`).join('')}</div></div>`;
  h+=`<div class="bt-ab">${b.ab.map((k,i)=>{const A=ABL[k],c=W.cd[k]||0;return`<button class="${c>0?'cd':''}" title="${esc(A.d)}" onclick="warCmd('a','${k}')"><em>${6+i}</em>${A.ic}<small>${c>0?Math.ceil(c)+'s':A.n}</small></button>`}).join('')}<button class="bt-pot" onclick="pot()" title="Pozione">🧪<small>${P.pot}</small></button><button class="bt-x" onclick="warAbandon()" title="Abbandona la battaglia">🏳</button></div></div>`;
  if(W.boost>0)h+=`<div class="bt-boost">📯 CARICA! ${Math.ceil(W.boost)}s</div>`;setBH(el,h)}
function warAbandon(){if(!WAR||WAR.over)return;warEnd(0,'Hai suonato la ritirata.')}
function warRetry(){const id=WAR&&WAR.id;if(!id)return;irisGo(()=>{load('bat_'+id,'in_caserma')})}
addEventListener('keydown',ev=>{if(!WAR||WAR.over||!ZZ||!ZZ.war||PM)return;const tg=ev.target;if(tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'))return;const n=+ev.key;if(n>=1&&n<=5){const k=UTK[n-1];if(WAR.b.pu.includes(k)){ev.preventDefault();ev.stopImmediatePropagation();warCmd('u',k)}}
  else if(n>=6&&n<=8){const k=WAR.b.ab[n-6];if(k){ev.preventDefault();ev.stopImmediatePropagation();warCmd('a',k)}}},true);
// ---- i campi di battaglia ----
for(const id in BATS){const b=BATS[id],dark=id==='colle';Z['bat_'+id]={n:'Battaglia · '+b.n,lv:Math.max(3,(P&&P.lv)||5),N:42,a:dark?'#6a7a52':id==='forte'?'#8a8a5a':'#7aa04a',b:dark?'#64744c':id==='forte'?'#828254':'#74994a',bg:'#86c0ea',mus:'guerra',pt:'mote',gen:genBat,dist:1,wl:'#5a6a3a',wh:10,nolamp:1,war:id,rd:['#a89a7a','#9e9070']};
  SKY['bat_'+id]=dark?['#4a4a5a','#8a8a96','#c8c4c0']:['#3f84d4','#86bce8','#d9eef9']}
function genBat(o){const{D,F,n}=o,id=ZZ.war;
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){M[y][x]=0;DEC[y][x]=''}
  const nearLane=(x,y,m)=>{for(let l=0;l<3;l++){const p=lanePts(0,l);for(let i=0;i<p.length-1;i++){const[a,b]=[p[i],p[i+1]],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy,k=Math.max(0,Math.min(1,((x+.5-a[0])*dx+(y+.5-a[1])*dy)/L2)),qx=a[0]+dx*k,qy=a[1]+dy*k;if(Math.hypot(x+.5-qx,y+.5-qy)<m)return true}}return false};
  const nearBase=(x,y,r)=>Math.hypot(x+.5-WA[0],y+.5-WA[1])<r||Math.hypot(x+.5-WE[0],y+.5-WE[1])<r;
  // strade di terra battuta lungo le corsie
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(nearLane(x,y,1.2))M[y][x]=4;
  if(id==='ponte'){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(Math.abs(x-y)<=1){if(nearLane(x,y,1.7)){M[y][x]=4;DEC[y][x]='~'}else{M[y][x]=2;DEC[y][x]=''}}}
  const deco=(c,p,lane)=>{for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++)if(M[y][x]===0&&!nearLane(x,y,lane||2.6)&&!nearBase(x,y,4.5)&&R()<p)D(x,y,c)};
  if(id==='guado'){deco('r',.07);deco('h',.03);for(let y=18;y<=23;y++)for(let x=2;x<=8;x++)if(M[y][x]===0&&R()<.7){M[y][x]=2}for(let y=2;y<=8;y++)for(let x=18;x<=23;x++)if(M[y][x]===0&&R()<.7)M[y][x]=2}
  else if(id==='ponte'){deco('r',.06);deco('u',.03)}
  else if(id==='colle'){deco('t',.05);deco('u',.04);deco('ℸ',.03)}
  else if(id==='forte'){deco('u',.04);deco('r',.03);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const c=Math.max(Math.abs(x+.5-WE[0]),Math.abs(y+.5-WE[1]));if(c>=5&&c<6&&x>0&&y>0&&x<n-1&&y<n-1&&!nearLane(x,y,1.7)){M[y][x]=6;DEC[y][x]='ℷ'}}}
  else if(id==='spade'){deco('h',.02);deco('ℶ',.02)}
  // bandiere ai lati delle basi
  for(const[x,y,c]of[[3,31,'ℶ'],[10,38,'ℶ'],[38,10,'ℶ'],[31,3,'ℶ']])if(M[y][x]===0)F(x,y,c);
  return[Math.floor(WA[0])+2,Math.floor(WA[1])-2]}
function decWar(x,y,c,h){switch(c){
  case 'ℶ':{const s=x+y<41,fl=s?'#2a5aa8':'#c0392b',wv=Math.sin(t*3+x)*.05;box(x+.45,y+.45,0,.1,.1,40,'#5a3a1a');box(x+.55,y+.48+wv,26,.04,.5,13,fl);box(x+.55,y+.48+wv,26,.04,.5,1.5,'#d4af37');return true}
  case 'ℷ':{for(let i=0;i<3;i++)box(x+.08+i*.3,y+.08+i*.3,0,.24,.24,22+((x*3+y+i)%3)*3,'#5a3a1e');box(x+.1,y+.1,14,.8,.8,1.5,'#3a2a14');return true}
  case 'ℸ':{box(x+.42,y+.42,0,.16,.16,22,'#3a3430');box(x+.2,y+.45,16,.6,.08,1.4,'#3a3430');box(x+.5,y+.2,19,.08,.5,1.2,'#3a3430');if(h>.5){box(x+.2,y+.47,17.4,.1,.08,2,'#111111');box(x+.25,y+.47,19.4,.05,.06,1,'#111111')}return true}}return false}
function warLoad(k){if(ZZ&&ZZ.war){warSetup(ZZ.war)}else if(WAR){WAR=null;TRP=[];warUI(0)}}
// disegno: proiettili, frecce delle torri, corsie evidenziate
function warDraw(){const W=WAR;if(!W||!ZZ||!ZZ.war)return;
  if(!W.over){const pts=lanePts(0,W.lane);g.strokeStyle='rgba(120,190,255,.35)';g.lineWidth=3;g.setLineDash([10,8]);g.beginPath();pts.forEach((p,i)=>{const X=PX(p[0],p[1]),Y=PY(p[0],p[1],0);i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke();g.setLineDash([])}
  for(const p of TRP){if(p.t<0)continue;const k=Math.min(1,p.t/p.d),x=p.x0+(p.x1-p.x0)*k,y=p.y0+(p.y1-p.y0)*k,z=p.z0*(1-k)+Math.sin(k*Math.PI)*(p.k==='stone'?70:p.rain?20:18);
    if(p.k==='stone'){box(x-.09,y-.09,z,.18,.18,5,'#6a6a72');g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(PX(x,y),PY(x,y,0),6,3,0,0,6.3);g.fill()}
    else{const k2=Math.min(1,k+.05),x2=p.x0+(p.x1-p.x0)*k2,y2=p.y0+(p.y1-p.y0)*k2,z2=p.z0*(1-k2)+Math.sin(k2*Math.PI)*(p.rain?20:18);g.strokeStyle=p.side?'#5a3a2a':'#e8e0d0';g.lineWidth=1.6;g.beginPath();g.moveTo(PX(x,y),PY(x,y,z));g.lineTo(PX(x2,y2),PY(x2,y2,z2));g.stroke()}}}
(function(){const st=document.createElement('style');st.textContent=`
body.batt #ruota{display:none!important}
#batui{position:fixed;left:0;right:0;bottom:0;top:0;pointer-events:none;z-index:14;font-family:Georgia,serif;color:#f2ead6}
#batui button{pointer-events:auto;margin:0}
#batui .bt-top{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background:rgba(10,14,24,.82);border:1px solid #c8963a;border-radius:10px;padding:6px 12px;pointer-events:auto}
#batui .bt-top>b{font-size:15px;color:#ffd98a;white-space:nowrap}
#batui .bt-hp{position:relative;width:min(180px,26vw);height:16px;background:#0008;border-radius:8px;overflow:hidden;border:1px solid #4a7ad8}#batui .bt-hp i{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,#2a5aa8,#5a9ae8);transition:width .3s}
#batui .bt-hp.en{border-color:#d84a3a}#batui .bt-hp.en i{background:linear-gradient(90deg,#a82a1a,#e85a4a)}#batui .bt-hp span{position:absolute;inset:0;font-size:11px;line-height:16px;text-align:center;text-shadow:0 1px 2px #000}
#batui .bt-bar{position:absolute;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;gap:10px;align-items:stretch;background:linear-gradient(180deg,rgba(18,22,36,.94),rgba(8,10,20,.95));border:1px solid #c8963a;border-radius:12px;padding:8px 10px;pointer-events:auto;box-shadow:0 12px 40px #000a;max-width:96vw;flex-wrap:wrap;justify-content:center}
#batui .bt-sup{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:64px;font-size:20px}#batui .bt-sup small{font-size:10px;opacity:.7}
#batui .bt-units{display:flex;gap:5px}
#batui .bt-u{position:relative;display:flex;flex-direction:column;align-items:center;gap:1px;width:78px;padding:5px 4px;background:#2a3350;border:1px solid #7a9ad8;border-radius:8px;color:#fff}
#batui .bt-u span{font-size:20px}#batui .bt-u b{font-size:12px}#batui .bt-u small{font-size:10px;opacity:.8}#batui .bt-u em,#batui .bt-ab em{position:absolute;top:2px;left:4px;font:700 10px system-ui;opacity:.6}
#batui .bt-u.no{opacity:.45}#batui .bt-u:hover{background:#3a4a70}
#batui .bt-col{display:flex;flex-direction:column;gap:4px;justify-content:center}#batui .bt-lanes,#batui .bt-ord{display:flex;gap:3px}
#batui .bt-lanes button,#batui .bt-ord button{font-size:12px;padding:4px 8px;background:#1e2438;border:1px solid #4a5a7a;border-radius:6px;color:#dde}#batui .bt-lanes button.on{background:#2a5aa8;border-color:#9ad0ff;color:#fff}#batui .bt-ord button.on{background:#8a6a1a;border-color:#ffd98a;color:#fff}
#batui .bt-ab{display:flex;gap:5px;align-items:center}#batui .bt-ab button{position:relative;display:flex;flex-direction:column;align-items:center;width:62px;padding:5px 2px;font-size:20px;background:#3a2a1a;border:1px solid #d8a040;border-radius:8px;color:#fff}#batui .bt-ab button small{font-size:10px}
#batui .bt-ab button.cd{opacity:.45;filter:grayscale(.7)}#batui .bt-ab .bt-x{width:40px;background:#3a1a1a;border-color:#a84a3a}#batui .bt-ab .bt-pot{width:44px;background:#1a3a2a;border-color:#4ad66a}
#batui .bt-boost{position:absolute;top:60px;left:50%;transform:translateX(-50%);font:700 20px Georgia,serif;color:#ffd84a;text-shadow:0 2px 8px #000;animation:btB .4s infinite alternate}@keyframes btB{to{transform:translateX(-50%) scale(1.08)}}
#batui .bt-end{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 16px}#batui .bt-end b{font-size:28px}#batui .bt-end.win b{color:#ffd84a}#batui .bt-end.lose b{color:#ff7a6a}#batui .bt-end span{font-size:14px;opacity:.85}
@media (max-width:700px){#batui .bt-u{width:62px}#batui .bt-u b{font-size:10px}#batui .bt-hp{width:24vw}}`;document.head.appendChild(st)})();
function warHTML(e){const done=P.bat||{};let h='<h4>⚔ Sul campo di battaglia</h4>';
  for(const id in BATS){const b=BATS[id],qi=Object.keys(QT).find(k=>QT[k].t==='bat'&&QT[k].b===id),T=QT[qi],ok=!T.req||P.unl[T.req]||done[id],act=P.q.some(q=>q.id===qi);
    h+=ok?`<button onclick="warGo('${id}')">⚔ ${esc(b.n)} <small class="mu">· ${esc(b.ds)}${done[id]?' · vinta '+done[id]+'×':act?' · missione attiva':''}</small></button>`:`<button disabled style="opacity:.45">🔒 ${esc(b.n)} <small class="mu">· prima vinci la battaglia precedente</small></button>`}
  return h+'<p class="mu" style="margin:4px 8px">Ripetere una battaglia già vinta paga meno, ma è un ottimo allenamento.</p>'}
// premio della battaglia finale: l'elmo di Ryan
const _qTurn73b=qTurn;qTurn=function(q){const T=QT[q&&q.id];_qTurn73b(q);if(T&&T.it==='h'){const it=item((P.lv||1)+4,3,'h');it.n='Elmo del Pelato';if(P.inv.length<INV)P.inv.push(it);else ents.push({k:'dr',px:P.px,py:P.py,it});banner('Elmo del Pelato','Ryan ti regala il suo elmo. «Tanto a me non serve: lo porto lucido!»','corona');save()}};
// musica di guerra
Object.assign(TRK,{guerra:{sng:1,bpm:132,root:55,sc:'min',ld:'brass',lv:.042,bs:'gallop',bv:.1,cp:'stab',dr:'march',dv:1,fill:1,form:'AABA',parts:{
  A:{ch:[0,5,3,4],m:'0:4 0:2 2:2 3:4 4:4  5:6 4:2 3:4 2:4  3:4 3:2 4:2 5:4 7:4  6:8 4:8'},
  B:{ch:[5,6,4,4],m:'7:4 8:4 9:4 7:4  10:6 9:2 8:8  7:4 5:4 4:4 3:4  4:8 r:8'}}}});

const _wl73=worldLoad;worldLoad=function(k){_wl73(k);warLoad(k)};
const _die73=die;die=function(){if(WAR&&ZZ&&ZZ.war&&!DF.pm&&!WAR.over){P.hp=1;warEnd(0,'Sei stato ferito: i tuoi soldati ti portano al sicuro.');return}_die73()};

/* ================= 7.3: Manuel, il più scontroso della Taverna del Drago Ubriaco ================= */
Object.assign(NPCS,{manuel:{n:'Manuel',c:'#6a4a3a',hat:'#3a2a1a',ln:['Che vuoi?','Ancora tu? Non ti basta il resto della taverna?','Se sei venuto a chiacchierare, la porta è là.','Mmh. Parla, ma sbrigati.','Non ho tempo. Ho una birra da finire e un muso da tenere.','Hai la faccia di uno che fa domande. Odio quelli che fanno domande.']}});
const MANQ=[['Buongiorno, Manuel!',['Buongiorno un corno.','Era buono finché non sei arrivato tu.','Il giorno è buono solo quando finisce.']],
  ['Come stai?',['Male. Come ieri. Come domani.','Stavo meglio cinque minuti fa, prima della tua domanda.','Ho mal di schiena, mal di testa e mal di te.']],
  ['Che lavoro fai?',['Il bevitore. A tempo pieno. Con gli straordinari.','Facevo il carpentiere. Poi ho capito che la gente è più storta del legno.','Lavoravo. Poi mi sono stancato. Fine della storia.']],
  ['Perché sei sempre arrabbiato?',['Non sono arrabbiato! SONO ESATTAMENTE COME DEVO ESSERE!','Perché la gente fa domande come questa.','Vuoi davvero saperlo? No. Infatti non te lo dico.']],
  ['Hai qualche consiglio per me?',['Sì: lasciami in pace.','Non fidarti di nessuno. Specialmente di quelli che fanno domande.','Bevi meno latte. E parla meno con me.']],
  ['Conosci qualche segreto di Aldoria?',['L\'unico segreto è come faccio a sopportarvi tutti.','Sì. E me lo tengo.','Il segreto è stare zitti. Provaci.']],
  ['Bella giornata, eh?',['Per te, forse.','Il sole mi dà fastidio. La pioggia pure. Anche tu.','Sì. Bellissima. Adesso rovinala andandotene.']],
  ['Ti offro da bere! (5💰)',null]];
const MAN={i:-1,n:0,dr:0,ans:''};
function manAsk(i){const now=Date.now();if(now-(MAN.lt||0)>60000)MAN.n=0;MAN.lt=now;MAN.n++;MAN.i=i;
  if(MAN.n>6&&MANQ[i][1]&&Math.random()<.6){MAN.ans=['BASTA! Mi fai venire il mal di testa!','Ancora?! Ti pago io per stare zitto!','Ma tu non hai una casa? Un lavoro? Un drago da uccidere? VAI!'][Math.floor(Math.random()*3)];tone(110,.2,'sawtooth',.05)}
  else if(MANQ[i][1])MAN.ans=MANQ[i][1][Math.floor(Math.random()*3)];
  else{if(!pay(5)){MAN.ans='Non hai neanche cinque monete? E vuoi offrire da bere a me? Ah!'}else{MAN.dr++;const e=ents.find(x=>x.nid==='manuel');if(e)flt(e,'🍺','#ffd84a');
    MAN.ans=MAN.dr>=5&&!MAN.tip?(MAN.tip=1,'... Va bene. Una cosa te la dico. Al porto c\'è uno matto come un cavallo, Stefano. Dicono che sappia dove nuotano i pesci d\'oro. E in caserma c\'è un pelato che cerca gente per le sue battaglie. Ecco. Non ti ho detto niente. E ora sparisci.'):['... Grazie. Non abituarti.','Lo bevo. Ma resto arrabbiato.','Hmpf. Almeno qualcuno qui ha un po\' di buon senso. Comunque vattene.','Questa birra è calda. Come sempre. Come tutto, qui.'][Math.floor(Math.random()*4)]}}
  pn('npc')}
function manBye(){const e=ents.find(x=>x.nid==='manuel');if(e)flt(e,['Era ora!','Finalmente!','Non tornare!','Hmpf.'][Math.floor(Math.random()*4)],'#ff8a7a');cl()}
function manuelHTML(e){const d=NPCS.manuel;const line=MAN.i>=0&&MAN.ans?MAN.ans:d.ln[Math.floor(Math.random()*d.ln.length)];MAN.i=-1;
  let h=`<h3>${esc(e.n)}</h3><p><i>«${esc(line)}»</i></p>`;MANQ.forEach((q,i)=>{h+=`<button onclick="manAsk(${i})">${esc(q[0])}</button>`});
  return h+'<button onclick="manBye()">Arrivederci</button>'}
// dialoghi: Manuel ha il suo, Stefano e Ryan aggiungono i loro viaggi
const _npcHTML73=npcHTML;npcHTML=function(e){if(e&&e.nid==='manuel'&&!e.slp)return dlgWrap(e,manuelHTML(e));let h=_npcHTML73(e);
  const ex=e&&!e.slp?(e.nid==='stefano'?seaHTML(e):e.nid==='ryan'&&typeof warHTML==='function'?warHTML(e):''):'';
  if(ex){const k=h.lastIndexOf('<button onclick="cl()">Arrivederci</button>');if(k>=0)h=h.slice(0,k)+ex+h.slice(k);else h+=ex}return h};
Z.in_tavern.np.push(['manuel',8,10]);
Object.assign(DROLE,{});
// sulla mappa: il mare di Stefano e i campi di battaglia di Ryan
const MNAME={mare_:'Il mare di Stefano',bat_:'Campi di battaglia'};
Object.assign(MNODE,{mare_:[.98,1.02],bat_:[.6,-1.02]});
ZB.push({k:'mare_',nm:'Il mare di Stefano',ic:'⛵',how:'Parla con Stefano «il Cavallo Pazzo» sul molo ovest del Porto: ti porta con la Puledra.',tx:'Cinque mari, ognuno con i suoi pesci e una leggenda da pescare: la Scogliera dei Gabbiani, il Banco dei Tonni, la Fossa Profonda, la Grotta Marina e la Punta del Naufragio.',f:['Pesci del mare aperto, più grossi e rari','Cinque pesci leggendari','Il Diario del pescatore con i tuoi record']},
  {k:'bat_',nm:'Campi di battaglia',ic:'⚔',how:'Parla con Gabriele «Ryan il Pelato» nella Caserma della Guardia.',tx:'Cinque battaglie in cui comandi un esercito: scegli le truppe, la corsia e gli ordini, e distruggi l\'accampamento nemico.',f:['Fanti, lancieri, arcieri, cavalieri e catapulte','Torri da abbattere e un accampamento da difendere','Le abilità di Ryan: Carica, Pioggia di frecce, Rinforzi']});

// arredi degli interni: stessi simboli dei dungeon, disegno diverso
const DUP52='1234567890!%?<>';
function decInt52(x,y,c,h){switch(c){
  case '1':box(x+.05,y+.05,0,.9,.9,12,'#a8503a');box(x+.12,y+.12,12,.76,.76,8,'#b8604a');box(x+.25,y+.25,20,.5,.5,5,'#a8503a');box(x+.3,y+.92,2,.4,.06,7,'#2a1a10');box(x+.35,y+.94,3,.3,.04,4,'#ff8a2a',1.1+Math.sin(t*9+x)*.15);if(SET.ultra)GLOW.push([x+.5,y+.95,6,40,'255,140,50',.25]);break;
  case '2':box(x+.1,y+.35,0,.8,.3,30,'#8a6a42');for(let i=0;i<3;i++){box(x+.12,y+.37,6+i*9,.76,.26,1,'#6b4a2b');box(x+.18,y+.42,7+i*9,.24,.16,3,'#d8a050');box(x+.55,y+.42,7+i*9,.24,.16,3,'#c88a3a')}break;
  case '3':box(x+.45,y+.45,0,.1,.1,14,'#4a3a2a');box(x+.3,y+.35,0,.4,.3,2,'#4a3a2a');box(x+.32,y+.36,14,.36,.28,14,['#a83a5a','#3a6aa8','#e8d8a0','#3a8a5a'][(x+y)%4]);box(x+.4,y+.4,28,.2,.2,4,'#e8dcc8');break;
  case '4':box(x+.05,y+.2,0,.9,.6,12,'#7a5a3a');box(x+.1,y+.25,12,.8,.5,1,'#9a7a4a');box(x+.15,y+.3,13,.3,.4,3,'#c0392b');box(x+.5,y+.3,13,.3,.4,3,'#2980b9');box(x+.4,y+.45,13,.08,.08,10,'#cccccc');break;
  case '5':box(x+.4,y+.4,0,.2,.2,10,'#4a4a52');box(x+.25,y+.25,0,.5,.5,2,'#3a3a42');box(x+.2,y+.42,10,.8,.16,5,'#b8963a');box(x+.82,y+.42,13,.15,.16,4,'#d4af37');box(x+.1,y+.44,9,.12,.12,4,'#2a2a32');break;
  case '6':box(x+.4,y+.4,0,.2,.2,12,'#6b4a2b');box(x+.25,y+.25,12,.5,.5,10,'#3a7ab8');box(x+.32,y+.3,14,.2,.3,5,'#4a9a4a');box(x+.24,y+.45,16,.52,.06,2,'#d4af37');break;
  case '7':box(x+.45,y+.45,0,.1,.1,10,'#4a3a2a');box(x+.3,y+.3,0,.4,.4,2,'#4a3a2a');box(x+.28,y+.32,10,.44,.36,14,'#a8b0bc');box(x+.33,y+.36,24,.34,.28,7,'#c8ccd4');box(x+.18,y+.36,18,.12,.28,6,'#a8b0bc');box(x+.7,y+.36,18,.12,.28,6,'#a8b0bc');break;
  case '8':box(x+.05,y+.1,0,.08,.8,26,'#5a4a3a');box(x+.87,y+.1,0,.08,.8,26,'#5a4a3a');box(x+.05,y+.1,4,.9,.8,3,'#7a6a4a');box(x+.1,y+.15,7,.8,.7,2,'#c8c0a8');box(x+.05,y+.1,17,.9,.8,3,'#7a6a4a');box(x+.1,y+.15,20,.8,.7,2,'#a8b0a0');break;
  case '9':box(x,y+.42,0,1,.16,16,'#7a5a3a');box(x+.42,y,0,.16,.42,16,'#7a5a3a');box(x+.1,y+.6,0,.6,.3,4,'#d8b84a');break;
  case '0':box(x+.05,y+.15,0,.9,.7,12,'#6b4a2b');box(x+.02,y+.12,12,.96,.76,2,'#7a5a3a');box(x+.2,y+.3,14,.3,.22,1,'#f4f0e0');box(x+.55,y+.35,14,.1,.1,4,'#2a2a3a');box(x+.62,y+.5,14,.2,.15,2,'#c0392b');break;
  case '!':box(x+.45,y+.45,0,.1,.1,34,'#4a3a2a');box(x+.55,y+.47,16,.06,.4,18,['#a8303a','#2a4a8a','#d4af37'][(x+y)%3]);box(x+.4,y+.4,34,.2,.2,3,'#d4af37');break;
  case '%':box(x+.05,y+.2,0,.9,.6,8,'#1a1a22');box(x+.02,y+.18,8,.96,.64,6,'#2a2a32');box(x+.05,y+.65,10,.9,.12,2,'#f4f0e8');box(x+.6,y+.2,14,.3,.5,10,'#2a2a32');break;
  case '?':box(x+.3,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.64,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.25,y+.42,10,.5,.06,18,'#f4f0e8');box(x+.3,y+.4,14,.2,.04,6,['#3a8ad8','#e8484f','#4cd07a','#ffd84a'][(x*3+y)%4]);box(x+.5,y+.4,18,.15,.04,5,'#c86ae8');break;
  case '<':box(x+.05,y+.25,0,.9,.5,32,'#6a4a2a');box(x+.48,y+.74,4,.04,.02,26,'#3a2a1a');box(x+.38,y+.75,16,.06,.02,4,'#d4af37');box(x+.56,y+.75,16,.06,.02,4,'#d4af37');break;
  case '>':box(x+.05,y+.15,0,.9,.7,9,'#e8e4dc');box(x+.12,y+.22,6,.76,.56,3,'#8ac8e8');box(x+.08,y+.75,3,.1,.05,3,'#b8963a');break;
  default:return false}return true}
function npcUnstick(){for(const e of ents){if(e.k!=='npc'||e.wg)continue;const x=e.px|0,y=e.py|0;if(x<0||y<0||x>=N||y>=N||WK(M[y][x]))continue;const q=nearFree(x,y);if(q&&WK(M[q[1]][q[0]])){e.px=q[0]+.5;e.py=q[1]+.5}}}
function fishBack(){return!!(FSPOT&&P&&ents.includes(FSPOT)&&Math.hypot(P.px-FSPOT.px,P.py-FSPOT.py)<1.5)}
(function(){const st=document.createElement('style');const sel=':root[data-theme=light] ';st.textContent=`
${sel}[style*="color:#c8ccd4"]{color:#4a505e!important}${sel}[style*="color:#ffae2b"]{color:#b86e00!important}
@media(prefers-color-scheme:light){:root:not([data-theme=dark]) [style*="color:#c8ccd4"]{color:#4a505e!important}:root:not([data-theme=dark]) [style*="color:#ffae2b"]{color:#b86e00!important}}
@media (max-width:700px){#batui .bt-top{top:calc(100px + env(safe-area-inset-top,0px))!important;max-width:94vw}#batui .bt-top>b{display:none}#batui .bt-bar{padding:6px}}`;document.head.appendChild(st)})();
function enMove(e,tp,d,dt){const s=e.sp*dt;
  if(e.ep&&e.ep.length&&e.ept>t){const w=e.ep[0],dx=w.x+.5-e.px,dy=w.y+.5-e.py,dd=Math.hypot(dx,dy);if(dd<.25)e.ep.shift();else mv(e,dx/dd*Math.min(s,dd),dy/dd*Math.min(s,dd));if(Math.hypot(tp.px-e.px,tp.py-e.py)<1.2)e.ep=null;return}
  const x0=e.px,y0=e.py;mv(e,(tp.px-e.px)/d*s,(tp.py-e.py)/d*s);
  if(Math.hypot(e.px-x0,e.py-y0)<s*.55){e.stk=(e.stk||0)+dt;if(e.stk>.3&&!(e.epw>t)){e.stk=0;e.epw=t+.8;const tx=tp.px|0,ty=tp.py|0;if(tx>=0&&ty>=0&&tx<N&&ty<N&&WK(M[ty][tx])){const p=path(e.px|0,e.py|0,tx,ty);if(p.length){e.ep=p.slice(0,24);e.ept=t+9}}}}else e.stk=0}
const _ct731=camTarget;camTarget=function(){const r=_ct731();if(document.body.classList.contains('dlgo')){const d=110/(32*Math.max(.6,S||1));return[r[0]+d,r[1]+d]}return r};
function pathTo(gx,gy){const ok=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&WK(M[y][x]);if(ok(gx,gy))return path(P.px|0,P.py|0,gx,gy);
  const C=[];for(let r=1;r<=4;r++){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=gx+dx,y=gy+dy;if(ok(x,y))C.push([Math.hypot(dx,dy)+Math.hypot(x-P.px,y-P.py)*.05,x,y])}if(C.length)break}
  C.sort((a,b)=>a[0]-b[0]);for(const c of C.slice(0,6)){const p=path(P.px|0,P.py|0,c[1],c[2]);if(p.length||((P.px|0)===c[1]&&(P.py|0)===c[2]))return p}return[]}
// ordine di disegno isometrico: per ogni coppia di pezzi che si sovrappongono sullo schermo, quello separato "dietro" lungo un asse va prima
function isoOrder(R,odd){const n=R.length;if(n<2)return R;const K2=Math.SQRT2,e=.002,bb=new Array(n),key=new Float64Array(n);
  for(let i=0;i<n;i++){const b=R[i],x0=b[0],x1=b[0]+b[3],y0=b[1],y1=b[1]+b[4],z0=b[2],z1=b[2]+b[5];
    bb[i]=odd?[x0,x1,y0,y1,z0,z1,-K2*y1*32,-K2*y0*32,K2*x0*16-z1,K2*x1*16-z0]:[x0,x1,y0,y1,z0,z1,(x0-y1)*32,(x1-y0)*32,(x0+y0)*16-z1,(x1+y1)*16-z0];
    key[i]=odd?(x0+x1)*8+(z0+z1)*.01:(x0+x1+y0+y1)*4+(z0+z1)*.01}
  const out=[],adj=Array.from({length:n},()=>[]),deg=new Int32Array(n);
  for(let i=0;i<n;i++){const a=bb[i];for(let j=i+1;j<n;j++){const c=bb[j];if(a[7]<=c[6]+e||c[7]<=a[6]+e||a[9]<=c[8]+e||c[9]<=a[8]+e)continue;let o=0;
    if(a[1]<=c[0]+e)o=-1;else if(c[1]<=a[0]+e)o=1;else if(!odd&&a[3]<=c[2]+e)o=-1;else if(!odd&&c[3]<=a[2]+e)o=1;else if(a[5]<=c[4]+e)o=-1;else if(c[5]<=a[4]+e)o=1;
    else{const E2=.02,ins=(A,B)=>A[0]>=B[0]-E2&&A[1]<=B[1]+E2&&A[2]>=B[2]-E2&&A[3]<=B[3]+E2&&A[4]>=B[4]-.5&&A[5]<=B[5]+.5;
      if(ins(c,a))o=1;else if(ins(a,c))o=-1;else{// pezzi che si compenetrano: decide l'asse in cui si toccano di meno
      const px=Math.min(a[1],c[1])-Math.max(a[0],c[0]),py=odd?1e9:Math.min(a[3],c[3])-Math.max(a[2],c[2]),pz=(Math.min(a[5],c[5])-Math.max(a[4],c[4]))/32;
      if(px<=py&&px<=pz)o=(a[0]+a[1])<(c[0]+c[1])?-1:1;else if(py<=pz)o=(a[2]+a[3])<(c[2]+c[3])?-1:1;else o=(a[4]+a[5])<(c[4]+c[5])?-1:1}}
    if(o<0){adj[i].push(j);deg[j]++}else if(o>0){adj[j].push(i);deg[i]++}}}
  const done=new Uint8Array(n);for(let k=0;k<n;k++){let best=-1;for(let i=0;i<n;i++)if(!done[i]&&deg[i]===0&&(best<0||key[i]<key[best]))best=i;
    if(best<0)for(let i=0;i<n;i++)if(!done[i]&&(best<0||key[i]<key[best]))best=i;done[best]=1;out.push(R[best]);for(const j of adj[best])deg[j]--}
  return out}
let LFP=0;
function heroPut(x,y){P.px=x+.5;P.py=y+.5;P.path=[];P.tg=null;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}
function heroFix(from){if(!P||!M||!M.length)return;
  // 7.41.1: uscendo dal portale dopo il boss (from = ultimo piano, es. «tana@2») non c'è una porta che porti proprio lì:
  // si arriva accanto all'ingresso dello stesso dungeon, come quando si esce dal primo piano
  if(from&&!LFP){let ps=ents.filter(e=>e.k==='po'&&e.to===from);const fb=String(from).split('@');if(!ps.length&&fb.length>1)ps=ents.filter(e=>e.k==='po'&&typeof e.to==='string'&&e.to.split('@')[0]===fb[0]&&e.to.includes('@'));if(ps.length){const p=ps.reduce((a,b)=>dist(P,b)<dist(P,a)?b:a);const[x,y]=nearFree(p.px|0,p.py|0);if(WK(M[y][x])){heroPut(x,y);LFP=1}}}
  const x=P.px|0,y=P.py|0;if(!(M[y]&&WK(M[y][x]))){const q=nearFree(x,y);if(WK(M[q[1]][q[0]]))heroPut(q[0],q[1]);else for(let r=1;r<N;r++){let ok=0;for(let v=y-r;v<=y+r&&!ok;v++)for(let u=x-r;u<=x+r&&!ok;u++)if(u>0&&v>0&&u<N-1&&v<N-1&&WK(M[v][u])){heroPut(u,v);ok=1}if(ok)break}}}
function poFade(e){if(e.k!=='po'||!P||!(e.st==='up'||e.st==='down'||e.st==='tap'))return 1;const d=(e.px+e.py)-(P.px+P.py);if(d<=0)return 1;const k=Math.abs((e.px-e.py)-(P.px-P.py));return k<1.6&&d<2.6?.38:1}
