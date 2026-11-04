/* ================= 7.47: gli animali da compagnia (7.49: più animazioni) =================
   7.49: si girano verso dove vanno, si siedono, annusano, si guardano intorno, si addormentano quando sei fermo a lungo,
   saltano di gioia quando li accarezzi, scavano con le zampe; il coniglio saltella, il pinguino scivola sulla pancia, il gufo
   sbatte le ali e gira la testa, il draghetto sbuffa fumo.
   Al Negozio degli animali (ad Aldoria vicino alla piazza, e nelle città di Tomorrow) si prende un amico: cane, gatto,
   volpe, coniglio, gufo, maialino, pinguino o draghetto. Ti segue dappertutto (e lo vedono anche gli altri giocatori),
   e ogni tanto si mette a fiutare e scava: ogni animale trova cose diverse (il cane monete e oggetti, il gatto pesci,
   la volpe risorse, il coniglio frutta e grano, il gufo pozioni, il maialino tartufi preziosi, il pinguino conchiglie e
   ghiaccio, il draghetto gemme). Non combatte: per quello ci sono i compagni domati. Si accarezza toccandolo. */
XSV.add('ani47');
const ANI47={
  cane:{n:'Cane',p:400,c:['#a8743a','#6a4422','#f4e8d0'],q:1,fi:'oro',d:'Trova monete e, a volte, un oggetto'},
  gatto:{n:'Gatto',p:400,c:['#e0a050','#a86a2a','#ffffff'],q:1,fi:'pesce',d:'Ti porta i pesci'},
  volpe:{n:'Volpe',p:700,c:['#e0702a','#ffffff','#2a1a10'],q:1,fi:'ris',d:'Fiuta legna, pietra, ferro e rame'},
  coniglio:{n:'Coniglio',p:500,c:['#e8e0d8','#c8b8a8','#ff9aa8'],q:2,fi:'cibo',d:'Trova mele, grano e uova'},
  gufo:{n:'Gufo',p:900,c:['#8a6a4a','#d8c8a0','#ffd84a'],q:3,fi:'pot',d:'Ti porta pozioni (di più di notte)'},
  maialino:{n:'Maialino',p:900,c:['#f4a8b8','#e08898','#5a3a3a'],q:1,fi:'tartufo',d:'Scava tartufi: valgono tanto oro'},
  pinguino:{n:'Pinguino',p:1100,c:['#2a2a3a','#ffffff','#ffa82a'],q:4,fi:'mare',d:'Conchiglie, ghiaccio e qualche pesce'},
  draghetto:{n:'Draghetto',p:3500,c:['#4aa86a','#2a6a3a','#ffd84a'],q:5,fi:'gemma',d:'Trova gemme e pepite d\'oro'}};
const ANI={e:{},nx:0,sel:null};
function aniFix(){P.ani47=P.ani47||{own:[],on:null,f:0};const a=P.ani47;a.own=Array.isArray(a.own)?a.own.filter(q=>q&&ANI47[q.t]):[];if(a.on&&!a.own.some(q=>q.id===a.on))a.on=null;return a}
const aniCur=()=>{const a=P&&P.ani47;return a&&a.on?a.own.find(q=>q.id===a.on):null};
// 7.49: il modello con le pose. Stati: walk (cammina), idle, sit (seduto), sniff (annusa), look (si guarda intorno), sleep (dorme),
// happy (salta di gioia quando lo accarezzi), dig (scava). Il modello si costruisce rivolto a +x e poi si gira verso dove guarda.
function aniL(t0,st,ph,k){const A=ANI47[t0],[c,c2,c3]=A.c,wk=st==='walk',w=wk?Math.sin(t*12+ph):0,sl=st==='sleep',sit=st==='sit',hap=st==='happy',dg=st==='dig',sn=st==='sniff',lk=st==='look';
  const jz=hap?Math.abs(Math.sin(k*9))*6:0,wag=Math.sin(t*(hap?22:wk?10:(st==='idle'||sit)?7:2)+ph)*(hap?.09:.05),bob=wk?Math.abs(w)*.8:0,br=sl?Math.sin(t*1.6+ph)*.25:Math.sin(t*2.2+ph)*.15,hl=lk?Math.sin(k*2.4)*.06:0;
  let L;
  if(t0==='gufo'){const fl=wk?Math.sin(t*16+ph)*.1:hap?Math.sin(t*20)*.12:0,z=wk?10+Math.sin(t*3)*2:2+jz,bl=Math.sin(t*.9+ph)>.97||sl,ht=lk?Math.sin(k*2)*.05:0;
    L=[[-.1,-.08,z,.2,.16,8+br,c],[-.05,-.09,z+1,.1,.03,5,c2],[-.09+ht,-.06,z+8,.18,.14,5,c],[-.07+ht,-.09,z+9.5,.05,.02,bl?.4:2,c3],[.02+ht,-.09,z+9.5,.05,.02,bl?.4:2,c3],[-.02+ht,-.1,z+8,.04,.02,1.5,'#ffa82a'],
      [-.1+ht,-.04,z+13,.04,.04,2,c2],[.06+ht,-.04,z+13,.04,.04,2,c2],[-.17-fl,-.06,z+2+(wk?Math.abs(fl)*20:0),.07,.12,5,c2],[.1+fl,-.06,z+2+(wk?Math.abs(fl)*20:0),.07,.12,5,c2],[-.06,-.02,z-1.5,.04,.04,1.5,'#ffa82a'],[.02,-.02,z-1.5,.04,.04,1.5,'#ffa82a']];
    return rotL(L,2)}
  if(t0==='pinguino'){const sld=wk&&k>2,s2=wk&&!sld?Math.sin(t*10+ph)*.03:0,ar=hap?Math.sin(t*20)*3:0;
    if(sld||sl)L=[[-.08,-.3,0,.16,.5,5,c],[-.06,-.32,1,.12,.46,3.6,c2],[-.07,.16,1,.14,.14,5,c],[-.02,.29,3,.04,.04,1,c3],[-.04,-.38,0,.08,.08,1,c3],[-.15,-.1,1,.05,.2,2,c],[.1,-.1,1,.05,.2,2,c]];
    else L=[[-.09+s2,-.08,jz,.18,.16,11+br,c],[-.06+s2,-.09,1+jz,.12,.04,8,c2],[-.08+s2,-.07,11+jz,.16,.14,4,c],[-.02+s2,-.1,12+jz,.04,.04,1,c3],[-.06+s2,-.1,13.5+jz,.03,.01,1.2,'#111'],[.03+s2,-.1,13.5+jz,.03,.01,1.2,'#111'],[-.13+s2,-.04,4+jz+ar,.04,.08,5,c],[.09+s2,-.04,4+jz-ar,.04,.08,5,c],[-.07,-.08,0,.06,.06,1,c3],[.01,-.08,0,.06,.06,1,c3]];
    return rotL(L,2)}
  const big=t0==='maialino'?1.15:t0==='coniglio'?.8:1,lay=sl,hop=t0==='coniglio'&&wk?Math.abs(Math.sin(t*9+ph))*5:0;
  const bz=(lay?.6:sit?2.2:3)+jz+bob*.5+hop,fz=lay?.6:3+jz+hop,hz=(lay?1.2:sit?6.6:4+4*big*.6)+jz+hop-(sn||dg?2.6:0)+(sit?1:0),hx=(sn||dg?.16:.1)*big+(lay?.04:0);
  L=[[-.16*big,-.07*big,bz,.32*big,.14*big,(lay?3.2:4*big)+br*.6,c],[hx,-.06*big+hl,hz,.14*big,.12*big,4,c],[hx+.1*big,-.03*big+hl,hz+(sn?Math.abs(Math.sin(t*14))*.6:0),.04,.06,1.4,c3]];
  // le zampe: davanti e dietro, che camminano, si piegano da seduto e spariscono sotto il corpo quando dorme
  for(const[x,y,kk,fr]of[[-.13,-.06,1,0],[-.13,.04,-1,0],[.1,-.06,-1,1],[.1,.04,1,1]]){const lh=lay?.6:sit&&!fr?1.2:3+w*kk*.8+(dg&&fr?Math.abs(Math.sin(t*14+kk))*1.4:0);L.push([x*big+(sit&&!fr?.03:0),y*big,lay?0:jz+hop*(fr?1:.7),.05,.04,Math.max(.4,lh),c2])}
  // gli occhi (chiusi quando dorme, e ogni tanto battono le palpebre)
  const bl=sl||Math.sin(t*.7+ph*3)>.985;L.push([hx+.13*big,-.045*big+hl,hz+2.4,.01,.025,bl?.3:1,'#111'],[hx+.13*big,.035*big+hl,hz+2.4,.01,.025,bl?.3:1,'#111']);
  if(t0==='coniglio'){const tw=Math.sin(t*3+ph)>.9?.6:0;L.push([.12,-.05+hl,hz+5.5-(lay?3:0),.03,.03,lay?2:5,c],[.12,.01+hl,hz+5.5+tw-(lay?3:0),.03,.03,lay?2:5,c],[-.2,-.03,bz+2,.06,.06,3,'#ffffff'])}
  else if(t0==='maialino')L.push([hx+.14*big,-.04+hl,hz+1.5,.04,.08,2,c2],[.12,-.07+hl,hz+5.6,.04,.03,1.5,c2],[.12,.03+hl,hz+5.6,.04,.03,1.5,c2],[-.22,-.01+wag,bz+3,.04,.03,2,c2]);
  else if(t0==='draghetto'){const fw=wk||hap?Math.abs(Math.sin(t*14+ph))*3:Math.abs(Math.sin(t*2))*1;L.push([.12,-.05+hl,hz+5.5,.03,.03,2.5,c3],[.12,.03+hl,hz+5.5,.03,.03,2.5,c3],[-.05,-.2,bz+3+fw,.14,.13,1,c2],[-.05,.07,bz+3+fw,.14,.13,1,c2],[-.3,-.02+wag,bz+1,.14,.04,2,c])}
  else{const ear=t0==='gatto'||t0==='volpe'?1:0;L.push([.12,-.06+hl,hz+4,.035,.03,ear?2.5:2,c],[.12,.03+hl,hz+4,.035,.03,ear?2.5:2,c]);const fx=t0==='volpe'?.16:t0==='gatto'?.04:.12,tz=t0==='gatto'?(lay?1:bz+3):lay?1:bz+1.5;
    L.push([-.16-fx,-.02+wag,tz,fx+.02,.04,t0==='gatto'&&!lay?4:2,t0==='volpe'?c3:c]);if(t0==='volpe')L.push([-.32,-.02+wag,tz,.04,.04,2,c2]);if(t0==='cane'&&hap)L.push([hx+.13,-.01,hz+.6,.03,.03,1.2,'#e86a8a'])}
  return rotL(L,1)}
function aniDraw(e){const st=e.st||'idle',k=t-(e.stT||0),fc=e.fc|0;drawHero(aniL(e.t,st,e.ph||0,k),e.px,e.py,0,0,fc);
  if(st==='dig'&&cineOK()&&Math.random()<.35)sparks(e.px+.15,e.py,2,['#8a6a42','#6a4a2a'],30);
  if(st==='sleep'){for(let i=0;i<3;i++){const q=((t*.5+i/3)%1);g.globalAlpha=1-q;box(e.px+.1+q*.2,e.py-.05,10+q*14,.05+q*.03,.02,.8,'#ffffff');box(e.px+.1+q*.2,e.py-.05,10+q*14+1.4+q,.05+q*.03,.02,.8,'#ffffff');g.globalAlpha=1}}
  if(e.hrt&&t-e.hrt<1.4){for(let i=0;i<3;i++){const q=(t-e.hrt)/1.4+i*.2;box(e.px-.05+Math.sin(i*2+q*6)*.15,e.py-.05,12+q*16,.1,.1,2,'#ff5a7a',1.4)}}
  if(e.t==='draghetto'&&(st==='happy'||Math.sin(t*.8+(e.ph||0))>.985)&&cineOK()&&Math.random()<.5){const[dx,dy]=[[0,1],[-.7,.7],[-1,0],[-.7,-.7],[0,-1],[.7,-.7],[1,0],[.7,.7]][fc];sparks(e.px+dx*.35,e.py+dy*.35,2,st==='happy'?['#ff7a2a','#ffd84a']:['#bbbbbb','#888888'],30)}}
// il tuo animale e quelli degli altri, come entità che seguono il loro padrone
function aniEnt(key,t0,n){let e=ANI.e[key];if(e&&ents.includes(e)){e.t=t0;e.n=n;return e}e={k:'ani47',key,t:t0,n,px:P.px,py:P.py,mv:0,ph:Math.random()*6};ANI.e[key]=e;ents.push(e);return e}
function aniState(e,dt,ox,oy,hx,hy){const moved=Math.hypot(e.px-ox,e.py-oy)>.004;let st;
  if(moved){e.fc=faceOf(e.px-ox,e.py-oy);st='walk';e.it=0}else{e.it=(e.it||0)+dt;if(e.it>.6&&Math.hypot(hx-e.px,hy-e.py)<4)e.fc=faceOf(hx-e.px,hy-e.py)}
  if(!moved){if(e.dg&&t-e.dg<1.4)st='dig';else if(e.hrt&&t-e.hrt<1.4)st='happy';else if(ANI.hid>14&&e.it>5)st='sleep';else if(e.it>2.5){const cyc=Math.floor((e.it+(e.ph||0)*3)/4)%4,A=e.t;st=(A==='cane'||A==='gatto'||A==='volpe')?(cyc===1?'look':cyc===3?'sniff':'sit'):(A==='coniglio'||A==='maialino')?(cyc%2?'sniff':'look'):cyc===2?'look':'idle'}else st='idle'}
  if(st!==e.st){e.st=st;e.stT=t}}
function aniFollow(e,tx,ty,dt){const dx=tx-e.px,dy=ty-e.py,d=Math.hypot(dx,dy);if(d>8){e.px=tx;e.py=ty;e.mv=0;return}if(d>1.1){const s=Math.min(d-1,(d>3?7:3.6)*dt);e.px+=dx/d*s;e.py+=dy/d*s;e.mv=.2}else e.mv=Math.max(0,e.mv-dt)}
const aniOkZone=()=>!!ZZ;
const _upd747a=upd;upd=function(dt){_upd747a(dt);if(!P||!started)return;const c=aniCur(),me=ANI.e.me;
  {const mv=Math.hypot(P.px-(ANI.lx||0),P.py-(ANI.ly||0))>.002;ANI.hid=mv?0:(ANI.hid||0)+dt;ANI.lx=P.px;ANI.ly=P.py}
  if(c&&aniOkZone()){const e=aniEnt('me',c.t,c.n),ox=e.px,oy=e.py;if(!(e.dg&&t-e.dg<1.4))aniFollow(e,P.px-.6,P.py+.5,dt);aniState(e,dt,ox,oy,P.px,P.py);
    if(!ANI.nx)ANI.nx=t+50+Math.random()*40;if(t>ANI.nx&&P.hp>0&&!PM){ANI.nx=t+60+Math.random()*60;e.dg=t;setTimeout(()=>{try{aniFind(c,e)}catch(_){}},1300)}}
  else if(me){const i=ents.indexOf(me);if(i>=0)ents.splice(i,1);delete ANI.e.me}
  // gli animali degli altri giocatori nella stessa stanza
  if(typeof NET!=='undefined'&&NET.ok&&NET.peers){for(const id in NET.peers){const q=NET.peers[id],pl=NET.pl&&NET.pl[id];if(q&&q.a47&&ANI47[q.a47[0]]&&pl){const e=aniEnt('p'+id,q.a47[0],String(q.a47[1]||'').slice(0,14)),ox=e.px,oy=e.py;aniFollow(e,pl.px-.6,pl.py+.5,dt);aniState(e,dt,ox,oy,pl.px,pl.py)}}
    for(const k in ANI.e)if(k!=='me'){const id=k.slice(1),q=NET.peers[id];if(!q||!q.a47||!(NET.pl&&NET.pl[id])){const e=ANI.e[k],i=ents.indexOf(e);if(i>=0)ents.splice(i,1);delete ANI.e[k]}}}};
const _loadPost747a=loadPost;loadPost=function(k){ANI.e={};_loadPost747a(k);try{aniShop()}catch(e){console.warn('animali',e)}};
{const sp0=syncPack;syncPack=function(){const o=sp0()||{};const c=aniCur();if(c&&aniOkZone())o.a47=[c.t,c.n];return o}}
// i ritrovamenti
function aniFind(c,e){if(!started||!ents.includes(e))return;const A=ANI47[c.t],a=aniFix(),lv=Math.max(1,ZZ.lv||P.lv),r=Math.random(),pick=L=>L[Math.floor(Math.random()*L.length)];let s='';
  const res=k=>{P.res[k]=(P.res[k]|0)+1;s=RESN[k]||k},fish=()=>{const F=(typeof FISHT!=='undefined'?FISHT:[]).filter(f=>f.w>=10);const f=pick(F.length?F:[{id:'sardina',n:'Sardina'}]);P.fish=P.fish||{};P.fish[f.id]=(P.fish[f.id]|0)+1;s=f.n};
  if(r<.05&&P.inv.length<INV){const it=item(lv,1);P.inv.push(it);s=iname(it)}
  else if(A.fi==='oro'){const g2=Math.round(12+lv*4+Math.random()*20);P.g+=g2;goldFly(g2,e.px,e.py);s=g2+' monete'}
  else if(A.fi==='pesce')fish();else if(A.fi==='ris')res(pick(['legna','pietra','ferro','rame','legna','pietra']));
  else if(A.fi==='cibo')res(pick(['mela','grano','uova']));else if(A.fi==='pot'){const n=(typeof isNight==='function'&&isNight())||Math.random()<.3?2:1;P.pot+=n;s=n+(n>1?' pozioni':' pozione')}
  else if(A.fi==='tartufo'){const g2=Math.round(30+lv*8+Math.random()*40);P.g+=g2;goldFly(g2,e.px,e.py);s='un tartufo ('+g2+' monete)'}
  else if(A.fi==='mare'){if(Math.random()<.4)fish();else res(pick(['conchiglia','ghiaccio']))}else if(A.fi==='gemma')res(Math.random()<.4?'gemma':'pepita');
  a.f=(a.f|0)+1;flt(e,'🐾 '+s,'#ffe08a');msg(c.n+' ha trovato: '+s);tone(880,.06,'triangle');hud();save()}
// il negozio
function aniShop(){if(!ZZ||!started||ents.some(e=>e.k==='ani47s'))return;let c=null;if(Zk==='town'&&!(typeof OW!=='undefined'&&OW.on))c=[40,36];else if(typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub)c=[ZZ.shub[0]-4,ZZ.shub[1]-4];if(!c)return;
  const q=spot47(c,2);if(q)ents.push({k:'ani47s',px:q[0]+.5,py:q[1]+.5,n:'Negozio degli animali'})}
ITK.add('ani47s');ITK.add('ani47');
const _act747a=act;act=function(e){if(e&&e.k==='ani47s'){pn('ani47');return}if(e&&e.k==='ani47'){e.hrt=t;e.it=0;tone(660,.08,'sine',.05);setTimeout(()=>tone(880,.06,'sine',.04),120);msg(e.key==='me'?e.n+' è felice!':'Accarezzi '+e.n);return}_act747a(e)};
function aniBuy(k){const A=ANI47[k],a=aniFix();if(!A)return;if(a.own.some(q=>q.t===k)){msg('Ce l\'hai già');return}if(P.g<A.p){msg('Servono '+A.p+' monete');tone(150,.1);return}
  P.g-=A.p;const q={id:uid(),t:k,n:A.n};a.own.push(q);a.on=q.id;banner('Hai un nuovo amico!',A.n+' ti seguirà dappertutto','stella');jingle([67,72,76,79],.09,'triangle');hud();save();pn('ani47')}
function aniSet(id){const a=aniFix();a.on=a.on===id?null:id;ANI.nx=0;save();pn('ani47')}
function aniName(id){const a=aniFix(),q=a.own.find(x=>x.id===id),el=$('ani47n_'+id);if(!q||!el)return;const n=String(el.value||'').replace(/[<>]/g,'').trim().slice(0,14);if(n){q.n=n;save();msg('Ora si chiama '+n)}pn('ani47')}
X43P.ani47=()=>{const a=aniFix();let h=`<h3>🐾 Animali da compagnia · 💰${P.g}</h3><p class="x43t">Ti seguono dappertutto e ogni tanto scavano qualcosa per te${a.f?' · finora hanno trovato '+a.f+' cose':''}.</p>`;
  if(a.own.length)h+=`<h4>I tuoi</h4>`+a.own.map(q=>`<div class="x43r"><span><b>${esc(q.n)}</b> <small class="mu">${ANI47[q.t].n}</small> <input id="ani47n_${q.id}" maxlength="14" value="${esc(q.n)}" style="width:96px" onkeydown="event.stopPropagation()"><button onclick="aniName('${q.id}')">Nome</button></span><button class="${a.on===q.id?'on':''}" onclick="aniSet('${q.id}')">${a.on===q.id?'Con te ✓':'Portalo con te'}</button></div>`).join('');
  const shop=ents.some(e=>e.k==='ani47s'&&dist(e,P)<4);
  h+=`<h4>${shop?'Il negozio':'Al Negozio degli animali'}</h4><div class="x43c">${Object.keys(ANI47).map(k=>{const A=ANI47[k],got=a.own.some(q=>q.t===k);return`<button ${got||!shop?'disabled':''} onclick="aniBuy('${k}')"><b>${A.n}</b><small>${A.d}</small><small>${got?'✓ è tuo':A.p+' 💰'}</small></button>`}).join('')}</div>`;
  return h+`<button onclick="cl()">Chiudi</button>`};
const _ent747a=ent;ent=function(e){if(e.k==='ani47'){aniDraw(e);return}if(e.k==='ani47s'){drawL([[-.45,-.3,0,.9,.6,12,'#c8a070'],[-.5,-.35,12,1,.7,3,'#e05a5a'],[-.5,-.35,15,1,.7,2,'#ffffff'],[-.3,-.31,3,.25,.02,7,'#3a2a1a'],[.08,-.31,5,.28,.02,5,'#9adcff']],e.px,e.py,0);
  drawHero(aniL('cane',Math.sin(t*.5)>0?'sit':'look',1,t),e.px-.25,e.py+.55,0,0,1);drawHero(aniL('gatto',Math.sin(t*.4+1)>.3?'sleep':'idle',2,t),e.px+.3,e.py+.5,0,0,7);return}_ent747a(e)};
// nel Diario
{const p0=pn;pn=function(m,arg){p0(m,arg);if(m==='dia'&&PM==='dia'){const pe=$('pn');if(pe&&!pe.querySelector('.ani47b'))pe.insertAdjacentHTML('afterbegin',`<button class="ani47b" onclick="pn('ani47')">🐾 Animali da compagnia</button>`)}}}
(function(){const st=document.createElement('style');st.textContent=`.ani47b{width:100%;margin-bottom:6px}`;document.head.appendChild(st)})();
