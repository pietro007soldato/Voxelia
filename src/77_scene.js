/* ================= animazioni sceniche ================= */
// Inquadrature (zoom e bande nere), transizioni a iride, stendardi, oggetti e monete che volano verso l'HUD,
// colonne di luce, scintille e rallentatore. Si spengono dalle impostazioni ("Animazioni sceniche").
const CZ={m:1,goal:1};let SZ=1,TS=1,TSt=0;const CAM={f:null,k:.5,t:0};
const cineOK=()=>SET.cine!==0;
function cineOn(f,zoom=1.22,dur=0){if(!cineOK()||!SET.cinecam)return;CAM.f=f;CAM.k=.5;CAM.t=dur;CZ.goal=zoom;document.body.classList.add('lbx')}
function cineOff(){CAM.f=null;CAM.t=0;CZ.goal=1;document.body.classList.remove('lbx')}
function slowmo(k,d){if(!cineOK())return;TS=k;TSt=d}
function cineTick(dt){CZ.m+=(CZ.goal-CZ.m)*Math.min(1,dt*4);S=SZ*CZ.m;
  if(TSt>0){TSt-=dt;if(TSt<=0)TS=1}
  if(CAM.t>0){CAM.t-=dt;if(CAM.t<=0)cineOff()}
  if(CAM.f&&CAM.f!==P&&(!CAM.f.px||dist(CAM.f,P)>4.5)&&!CAM.t)cineOff();
  sfxUpd(dt);arcUpd()}
// punto che la camera segue: l'eroe, oppure a metà strada verso ciò che si sta guardando
function camTarget(){if(CAM.f&&CAM.f.px!=null){const k=CAM.k;return[P.px+(CAM.f.px-P.px)*k,P.py+(CAM.f.py-P.py)*k]}return[P.px,P.py]}

/* ---- stendardi al centro dello schermo (livello, missioni, frammenti, boss, nuovo giorno) ---- */
const BQ=[];let BB=0;
function banner(ti,sub,icn){if(!cineOK()){msg(ti+(sub?' — '+sub:''));return}BQ.push([ti,sub,icn]);if(!BB)bnNext()}
function bnNext(){const b=BQ.shift();const el=$('bnr');if(!b){BB=0;el.className='';return}BB=1;
  el.innerHTML=`${b[2]?ico(b[2],32,'bi'):''}<b>${esc(b[0])}</b>${b[1]?`<small>${esc(b[1])}</small>`:''}`;el.className='';void el.offsetWidth;el.className='on';
  setTimeout(()=>{el.className='off';setTimeout(bnNext,450)},BQ.length?1700:2600)}

/* ---- transizione a iride quando si attraversa una porta o un portale ---- */
let IRB=0;
function irisGo(fn){if(!cineOK()||IRB||!started){fn();return}IRB=1;const el=$('iris');const[x0,y0]=scr(P.px,P.py,20),R0=Math.hypot(W,H);let t0=performance.now();
  el.style.display='block';
  const close=n=>{const k=Math.min(1,(n-t0)/330),r=R0*(1-k*k);el.style.background=`radial-gradient(circle at ${x0}px ${y0}px,transparent ${r}px,#000 ${r+2}px)`;
    if(k<1)requestAnimationFrame(close);else{try{fn()}finally{t0=performance.now();setTimeout(()=>requestAnimationFrame(open),90)}}};
  const open=n=>{const[x,y]=scr(P.px,P.py,20),k=Math.min(1,(n-t0)/520),r=R0*k*k;el.style.background=`radial-gradient(circle at ${x}px ${y}px,transparent ${r}px,#000 ${r+2}px)`;
    if(k<1)requestAnimationFrame(open);else{el.style.display='none';IRB=0}};
  requestAnimationFrame(close)}
// cartello con il nome della zona all'ingresso
function zoneCard(z){const el=$('ztc');el.innerHTML=`<b>${esc(z.n)}</b>${z.dg?`<small>${z.boss?'Piano del boss':'Dungeon'}${z.run?' · ciclo '+(z.run+1):''}</small>`:z.int?'<small>Interno</small>':`<small>${phase()} · ${gClock()}</small>`}`;el.className='';void el.offsetWidth;el.className='on'}

/* ---- particelle del mondo: monete che saltano, scintille, colonne di luce, anelli ---- */
let SFX=[];
function sfx(o){if(cineOK()&&SFX.length<260)SFX.push(Object.assign({t:0,d:1,z:0},o))}
function burst(x,y,n,c,o={}){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(o.v||1.2)*(.4+Math.random()*.8);sfx({k:'pt',x,y,z:o.z||10,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:(o.up||150)*(.6+Math.random()*.6),gr:o.gr||380,b:o.b!==0,d:o.d||(.9+Math.random()*.5),c:Array.isArray(c)?c[i%c.length]:c,s:o.s||4})}}
function sparks(x,y,n,c,up=90){burst(x,y,n,c,{v:.6,up,gr:60,b:0,d:1.1,s:3,z:12})}
function pillar(x,y,c,d=1.4,w=46){sfx({k:'beam',x,y,c,d,w})}
function ringFx(x,y,c,d=.8,r=2.2){sfx({k:'ring',x,y,c,d,r})}
function sfxUpd(dt){if(!SFX.length)return;for(const p of SFX){p.t+=dt;if(p.k==='pt'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=p.gr*dt;if(p.z<0){if(p.b){p.z=0;p.vz=-p.vz*.35;p.vx*=.5;p.vy*=.5}else p.t=p.d}}}SFX=SFX.filter(p=>p.t<p.d)}
function sfxDraw(){if(!SFX.length)return;g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);
  for(const p of SFX){const k=p.t/p.d,X=PX(p.x,p.y),Y=PY(p.x,p.y,p.z);
    if(p.k==='pt'){if(p.gl===1){const z2=p.s*(1+k*1.6);g.globalAlpha=Math.max(0,Math.min(.7,(1-k)*1.1));g.fillStyle=p.c;g.fillRect(X-z2/2,Y-z2/2,z2,z2*.8)}else{g.globalAlpha=Math.min(1,(1-k)*2.2);g.fillStyle=p.c;g.fillRect(X-p.s/2,Y-p.s/2,p.s,p.s)}}
    else if(p.k==='beam'){const a=Math.sin(Math.min(1,k)*Math.PI),w=p.w*(.6+.4*a),h=330;g.globalCompositeOperation='lighter';const gr=g.createLinearGradient(0,Y-h,0,Y);gr.addColorStop(0,`rgba(${p.c},0)`);gr.addColorStop(.7,`rgba(${p.c},${.45*a})`);gr.addColorStop(1,`rgba(${p.c},${.7*a})`);g.fillStyle=gr;g.fillRect(X-w/2,Y-h,w,h);
      g.globalAlpha=.7*a;g.drawImage(glowSpr(p.c),X-w*1.6,Y-w*.9,w*3.2,w*1.8);g.globalAlpha=1;g.globalCompositeOperation='source-over'}
    else if(p.k==='ring'){g.globalAlpha=1-k;g.strokeStyle=`rgb(${p.c})`;g.lineWidth=3;g.beginPath();g.ellipse(X,Y,p.r*45*k+4,p.r*22*k+2,0,0,6.3);g.stroke()}}
  g.globalAlpha=1}

/* ---- icone che volano verso l'HUD: oggetti verso lo zaino, monete verso l'oro ---- */
let FLYN=0;
function flyIcon(src,from,toEl,o={}){if(!cineOK()||!toEl||!src||document.hidden||FLYN>40)return;const r=toEl.getBoundingClientRect();if(!r.width)return;FLYN++;const im=document.createElement('img');im.src=src;im.className='fly';
  const sz=o.sz||34;im.style.cssText=`left:${from[0]-sz/2}px;top:${from[1]-sz/2}px;width:${sz}px;height:${sz}px`;document.body.appendChild(im);
  const dx=r.left+r.width/2-from[0],dy=r.top+r.height/2-from[1],up=o.arc==null?-70:o.arc;
  const a=im.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.4}px,${dy*.4+up}px) scale(1.15)`,opacity:1,offset:.35},{transform:`translate(${dx}px,${dy}px) scale(.45)`,opacity:.85}],{duration:o.dur||720,delay:o.delay||0,easing:'cubic-bezier(.45,.05,.55,.95)',fill:'both'});
  a.onfinish=()=>{FLYN--;im.remove();toEl.classList.remove('bump');void toEl.offsetWidth;toEl.classList.add('bump')}}
const bagBtn=()=>document.querySelector('#bar button');
function itemFly(it,wx,wy){if(!started)return;const[x,y]=scr(wx==null?P.px:wx,wy==null?P.py:wy,24);flyIcon(icon(it),[x,y],bagBtn())}
function goldFly(n,wx,wy){if(!started||n<=0)return;const[x,y]=scr(wx==null?P.px:wx,wy==null?P.py:wy,30),to=$('hg');const k=Math.min(7,1+Math.floor(n/25));
  for(let i=0;i<k;i++)flyIcon(ICON('oro',2).u,[x+(Math.random()-.5)*30,y+(Math.random()-.5)*20],to,{sz:20,dur:650+i*40,delay:i*70,arc:-40-Math.random()*50})}
// lampo sullo schermo (bianco, rosso, oro)
let FLS=null;
function flash(c='#fff',a=.6,d=420){if(!cineOK())return;const el=$('flash');el.style.background=c;FLS={c,a,d,t:performance.now()};el.animate([{opacity:a},{opacity:0}],{duration:d,easing:'ease-out'})}
// pioggia di monete per le grandi vincite
let CRT=0;
function coinRain(n=26){if(!cineOK()||document.hidden||performance.now()-CRT<1500)return;CRT=performance.now();for(let i=0;i<n;i++){const im=document.createElement('img');im.src=ICON('oro',2).u;im.className='fly';const x=Math.random()*W;im.style.cssText=`left:${x}px;top:-30px;width:22px;height:22px`;document.body.appendChild(im);
  im.animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(${H+60}px) rotate(${(Math.random()-.5)*720}deg)`}],{duration:1300+Math.random()*900,delay:Math.random()*600,easing:'cubic-bezier(.4,0,.9,.6)',fill:'both'}).onfinish=()=>im.remove()}}

/* ---- scene pronte per le interazioni del gioco ---- */
function sceneLevel(){if(!cineOK())return;pillar(P.px,P.py,'255,220,120',1.6,54);ringFx(P.px,P.py,'255,216,74',.9,2.4);setTimeout(()=>ringFx(P.px,P.py,'255,240,180',.9,3),180);sparks(P.px,P.py,24,['#ffd84a','#fff6c0','#ffae2b'],130);
  banner('Livello '+P.lv+'!','Attacco, difesa e vita aumentati','stella')}
function sceneShard(e){if(!cineOK())return;flash('#fff8d8',.7,700);slowmo(.35,1.1);pillar(e.px,e.py,'255,220,90',2.2,70);burst(e.px,e.py,30,['#ffd84a','#fff6c0'],{v:1.6,up:220,b:0,gr:120,d:1.6});cineOn(P,1.3,2)}
function sceneChest(e){if(!cineOK())return;pillar(e.px,e.py,e.rich?'200,140,255':'255,214,110',1.2,40);burst(e.px,e.py,e.rich?22:14,['#ffd84a','#f5b942','#fff2a0'],{v:1.1,up:190,gr:520,d:1.4});tone(520,.08,'triangle');setTimeout(()=>tone(780,.1,'triangle'),90)}
function sceneBoss(e){if(!cineOK())return;banner(e.n,'Il guardiano di '+(ZZ.n||'').split(' · ')[0],'teschio');slowmo(.4,1.2);cineOn(e,1.12,1.8);CAM.k=.6;flash('#000',.35,600);tone(70,.5,'sawtooth',.08)}
function sceneBossDown(e){if(!cineOK())return;slowmo(.3,1.4);flash('#fff',.5,800);burst(e.px,e.py,40,['#ffffff','#ffd84a','#c46bff'],{v:2,up:240,gr:300,d:1.8,s:5});pillar(e.px,e.py,'255,255,255',1.6,80);banner('Vittoria!',e.n+' è stato sconfitto','corona')}
function sceneDeath(){if(!cineOK())return;flash('#a01010',.75,1100);banner('Sei caduto',DF&&DF.pm?'':'Ti risvegli ad Aldoria','teschio')}
function sceneHeal(){if(!cineOK())return;sparks(P.px,P.py,14,['#66ff88','#c8ffd0'],110)}
function sceneEquip(){if(!cineOK())return;P.fl=.12;sparks(P.px,P.py,10,['#ffffff','#ffd84a'],100);tone(880,.06,'triangle')}
function sceneForge(){if(!cineOK())return;burst(P.px,P.py,18,['#ff8a2a','#ffd84a','#ffffff'],{v:1.4,up:160,gr:420,b:0,d:.8,s:3});tone(1200,.05,'square');setTimeout(()=>tone(900,.06,'square'),110)}

/* ---- oggetti che saltano fuori (dal forziere, dalle mani dell'eroe) e atterrano al loro posto ---- */
function arcFrom(e,x0,y0,dl=0){if(!cineOK())return;e.arc={x0,y0,x1:e.px,y1:e.py,t0:t+dl,d:.55};e.px=x0;e.py=y0;e.az=10}
function arcUpd(){for(const e of ents){const a=e.arc;if(!a)continue;const k=clamp((t-a.t0)/a.d,0,1);e.px=a.x0+(a.x1-a.x0)*k;e.py=a.y0+(a.y1-a.y0)*k;e.az=10+Math.sin(k*Math.PI)*34-10*k;if(k>=1){e.px=a.x1;e.py=a.y1;e.az=0;delete e.arc;if(e.it&&e.it.r>=2)sparks(e.px,e.py,6,RC[e.it.r],60)}}}
