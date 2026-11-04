/* ================= 7.44: scavare =================
   All'aperto (nelle zone intorno ad Aldoria e nelle regioni di Tomorrow) ogni giorno ci sono tre punti dove il terreno
   luccica appena: avvicinati e scava (R o clic). Sotto c'è oro, una pozione, un oggetto, a volte una pietra preziosa
   e, una volta ogni tanto, un passaggio segreto che porta in una grotta nascosta con i suoi forzieri e i suoi abitanti. */
XSV.add('dug');
const DIG43={hint:0};let CAVA=null;
function digZoneOk(){const z=ZZ;if(!z||!started||z.dg||z.int||z.lay||z.ed||z.war||z.dist&&!String(Zk).startsWith('tw:')||Zk==='arena'||Zk==='mare'||String(Zk).startsWith('dim_')||N<24)return false;
  return!!(SKY[Zk]||String(Zk).startsWith('tw:'))}
function digSetup(){if(!digZoneOk())return;const d=dayKey();P.dug=P.dug||{};for(const k in P.dug)if(!k.startsWith(d))delete P.dug[k];
  const r=sd(hs('scavo|'+d+'|'+(NET.code||'')+'|'+Zk)),dR=bfs(P.px|0,P.py|0);
  // 7.50.1: solo dove l'eroe arriva a piedi (prima una terra smossa poteva finire in una radura chiusa dagli alberi)
  for(let i=0;i<3;i++){const id=d+'|'+Zk+'|'+i,q=freeTile(r,(x,y)=>dR[y*N+x]>=0&&!ents.some(e=>e.k==='po'&&Math.abs(e.px-x)<4&&Math.abs(e.py-y)<4));if(!q)continue;const rl=r();if(P.dug[id])continue;ents.push({k:"dig",px:q[0]+.5,py:q[1]+.5,id,rl,n:'Terra smossa'})}}
const _loadPost743d=loadPost;loadPost=function(k){_loadPost743d(k);try{digSetup()}catch(e){console.warn('scavo',e)}
  if(LFROM==='cava43'&&CAVA&&CAVA.from===k){const[x,y]=nearFree(CAVA.x|0,CAVA.y|0);P.px=x+.5;P.py=y+.5;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}};
ITK.add('dig');
function digDo(e){if(P.digT>t)return;P.digT=t+.9;P.path=[];P.tg=null;tone(120,.12,'square',.05);setTimeout(()=>tone(100,.12,'square',.05),250);
  if(cineOK()){sparks(e.px,e.py,14,['#7a5a3a','#a8845a','#5a4028'],60);setTimeout(()=>sparks(e.px,e.py,10,['#7a5a3a','#a8845a'],70),300)}
  setTimeout(()=>{if(!ents.includes(e))return;ents.splice(ents.indexOf(e),1);P.dug=P.dug||{};P.dug[e.id]=1;const lv=Math.max(1,ZZ.lv||P.lv),rl=e.rl;
    if(rl<.07){CAVA={from:Zk,x:e.px,y:e.py,seed:e.id,lv};ents.push(Object.assign(po(e.px|0,e.py|0,'cava43',{st:'down',n:'Passaggio segreto'}),{cava:1}));banner('Un passaggio segreto!','Sotto la terra si apre una scala che scende nel buio','frammento');jingle([60,63,67,70,74],.12,'triangle')}
    else if(rl<.15){const it=item(lv+3,3);dropLocal(it,e.px,e.py,1);msg('Hai dissotterrato un tesoro: '+iname(it)+'!');jingle([72,76,79,84,88],.09)}
    else if(rl<.35){const it=item(lv+1,rl<.22?2:rl<.29?1:0);dropLocal(it,e.px,e.py,1);msg('Sotto la terra c\'era '+iname(it));jingle([67,72,76],.1)}
    else if(rl<.55){const n=rl<.45?1:2;P.pot+=n;flt(P,'+'+n+' 🧪','#88ff88');msg(n===1?'Hai trovato una pozione sepolta':'Hai trovato due pozioni sepolte');tone(520,.1)}
    else{const g=Math.round((15+rl*45)*(1+lv*.3)*(NET.cfg&&NET.cfg.gm||1));P.g+=g;goldFly(g,e.px,e.py);flt(e,'+'+g+' oro','#ffd84a');msg('Hai dissotterrato '+g+' monete')}
    hud();save()},650)}
const _act743d=act;act=function(e){if(e&&e.k==='dig'){digDo(e);return}if(e&&e.k==='po'&&e.cava&&CAVA){tone(90,.5,'sawtooth',.05);irisGo(()=>load('cava43',Zk));return}_act743d(e)};
// avvicinandosi la prima volta: un consiglio
const _upd743d=upd;upd=function(dt){_upd743d(dt);if(DIG43.hint||!P||!started||P.dugH)return;for(const e of ents)if(e.k==='dig'&&dist(e,P)<3.2){DIG43.hint=1;P.dugH=1;msg('Qualcosa luccica nel terreno: avvicinati e premi R (o clicca) per scavare.');break}};
XSV.add('dugH');
// la grotta segreta: una caverna piccola con forzieri e qualche abitante
Z.cava43={n:'Grotta segreta',lv:1,N:24,dg:'cava',cava43:1,dn:1,run:0,th:'cave',a:'#6b5a48',b:'#635342',o:'#4a3c30',bg:'#0a0806',tc:'#ffb04a',pt:'dust',mus:'dungeon',c:0,en:[],boss:0};
function cavaGen(z){const C=CAVA||{seed:'x',lv:P.lv,from:'town'},r=sd(hs('cava|'+C.seed));z.lv=Math.max(1,C.lv);M.forEach(row=>row.fill(1));const c=N>>1,blobs=[];
  for(let i=0;i<5;i++){const cx=i?Math.floor(5+r()*(N-10)):c,cy=i?Math.floor(5+r()*(N-10)):c,rr=2.5+r()*2.5;blobs.push([cx,cy]);for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)if(Math.hypot(x-cx,y-cy)<rr+r()*.6)M[y][x]=0}
  for(let i=1;i<blobs.length;i++){let[x,y]=blobs[i-1];const[tx,ty]=blobs[i];while(x!==tx||y!==ty){if(x!==tx&&(y===ty||r()<.5))x+=Math.sign(tx-x);else y+=Math.sign(ty-y);M[y][x]=0;if(M[y+1])M[y+1][x]=0}}
  const sp=[c,c];ents.push(Object.assign(po(c,c+1,C.from||'town',{st:'up',n:'Torna in superficie'}),{cavaUp:1}));
  const d=bfs(c,c),L=[];for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)if(d[y*N+x]>4)L.push([x,y,d[y*N+x]]);L.sort((a,b)=>b[2]-a[2]);
  const pool=['pipistrello','ratto','ragno','slime','goblin'].filter(q=>E[q]);
  for(let i=0;i<3&&L.length;i++){const q=L.splice(Math.floor(r()*Math.min(L.length,8)),1)[0];ents.push({k:'ch',px:q[0]+.5,py:q[1]+.5,rich:i===0?1:0})}
  for(let i=0;i<4&&L.length;i++){const q=L.splice(Math.floor(r()*L.length),1)[0];ents.push(mk(pool[Math.floor(r()*pool.length)]||'ratto',q[0],q[1]))}
  for(const[x,y]of blobs)ents.push({k:'tc',px:x+.2,py:y+.2});
  return sp}
{const g0=genDungeon;genDungeon=function(z){return z&&z.cava43?cavaGen(z):g0(z)}}
{const a0=act;act=function(e){if(e&&e.k==='po'&&e.cavaUp&&CAVA){const back=CAVA.from;irisGo(()=>load(back,'cava43'));return}a0(e)}}
{const d0=dungeonClear;dungeonClear=function(e){if(ZZ&&ZZ.cava43)return;return d0(e)}}
// il disegno: un mucchietto di terra che luccica, visibile solo da vicino
const _ent743d=ent;ent=function(e){if(e.k!=='dig'){_ent743d(e);return}const d=P?dist(e,P):99;if(d>5)return;const k=Math.max(0,1-(d-2)/3),u=.5+.5*Math.sin(t*5+e.px);
  const L=[[-.25,-.2,0,.5,.4,2,'#6a4e32'],[-.15,-.12,2,.3,.24,1.5,'#7a5a3a']];if(u>.55&&k>.05)L.push([-.04,-.04,4+u*3,.08,.08,3,'#fff6c0',1.6]);
  if(k<1)g.globalAlpha=Math.max(.15,k);drawLB(L,e.px,e.py,0);g.globalAlpha=1};
