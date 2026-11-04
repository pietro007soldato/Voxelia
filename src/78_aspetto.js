/* ================= aspetto dell'eroe ================= */
// Pelle, capelli, occhi, barba, tunica, pantaloni, mantello, corporatura; l'elmo si può nascondere.
// L'aspetto si salva con l'eroe, è la scelta predefinita per le partite nuove e lo vedono anche gli altri giocatori.
const APK=['sk','hs','hc','ec','bd','tu','pa','ca','sz','hh'];
const APO={
  sk:{n:'Pelle',c:['#ffdfc0','#f1c27d','#d9a066','#b07a4a','#8d5524','#5c3a1e']},
  hs:{n:'Capelli',o:['Rasati','Corti','Lunghi','Coda','Cresta','Ricci']},
  hc:{n:'Colore dei capelli',c:['#2a1b10','#5a3a1e','#9a6430','#e0c070','#c0502a','#e8e8e8','#3a3a3a','#2a6ab8','#8a3ac8']},
  ec:{n:'Occhi',c:['#2a2a32','#3a6aa8','#3a8a4a','#7a4a2a','#8a2a8a','#c8a020']},
  bd:{n:'Barba',o:['Nessuna','Corta','Lunga','Baffi']},
  tu:{n:'Tunica',c:['#3a6ea5','#a83a3a','#3a8a4a','#6a3a8a','#c8a040','#3a3a42','#e8e4d8','#d86a2a']},
  pa:{n:'Pantaloni',c:['#333344','#5a3a1e','#2a3a5a','#4a4a4a','#6a2a2a','#3a5a3a']},
  ca:{n:'Mantello',c:[null,'#a8303a','#2a4a8a','#2a6a3a','#5a2a7a','#1a1a22','#d4af37']},
  sz:{n:'Corporatura',o:['Minuta','Normale','Robusta']},
  hh:{n:'Elmo',o:['Visibile','Nascosto']}};
const APD={sk:1,hs:1,hc:1,ec:0,bd:0,tu:0,pa:0,ca:0,sz:1,hh:0};
function apFix(a){const o=Object.assign({},APD);if(Array.isArray(a))a.forEach((v,i)=>{if(APK[i])o[APK[i]]=v});else if(a&&typeof a==='object')Object.assign(o,a);
  for(const k of APK){const n=(APO[k].c||APO[k].o).length;o[k]=clamp(Math.floor(+o[k]||0),0,n-1)}return o}
const apPack=a=>APK.map(k=>a[k]|0);
let APM=apFix(LS.get('voxelia_ap',APD));
/* ---- 7.10: l'equipaggiamento indossato ha il suo modello, lo stesso tipo delle icone dello zaino ----
   Arma nella mano destra, scudo sul braccio sinistro, elmo in testa, corazza sul busto. Le animazioni riconoscono
   il braccio dalla posizione dei pezzi (centro oltre x .18 = braccio destro, sotto x -.25 = sinistro): per questo ogni pezzo
   dell'arma ha il centro oltre .18 e parte sopra z 8.6, e ogni pezzo dello scudo sta tra z 8.6 e 22 con il centro sotto -.25. */
const EQT={w:['swd','dag','axe','ham','spr','tri','stf','scy'],h:['helm','crn','hood','mask'],c:['plate','mail','robe'],s:['kite','buck','pav']},EQD={w:'swd',h:'helm',c:'plate',s:'kite'};
// tipi dell'equipaggiamento: {w,h,c,s}; null = slot vuoto
function eqTy(eq){const o={};for(const s of'whcs'){const it=eq&&eq[s];o[s]=it?itype(it):null}return o}
// in rete e nei ritratti viaggiano come stringa "swd.helm.plate.kite" ('-' = niente)
const tyPack=o=>[...'whcs'].map(s=>o&&o[s]||'-').join('.');
function tyFix(v){if(v&&typeof v==='object')v=tyPack(v);const p=String(v||'').split('.'),o={};[...'whcs'].forEach((s,i)=>{o[s]=p[i]==='-'?null:EQT[s].includes(p[i])?p[i]:EQD[s]});return o}
const EQB=(cx,cy,z,w,d,h,c)=>[cx-w/2,cy-d/2,z,w,d,h,c],EQG='#d4af37',EQW='#6b4a2b',EQK='#3a3a42',EQN='#1d1d24';
// lo stesso colore più scuro (per gli anelli della cotta di maglia)
const eqDk=(c,k)=>{const n=parseInt(String(c).slice(1),16)||0,f=s=>Math.round(((n>>s)&255)*(1-k));return'#'+((1<<24)+(f(16)<<16)+(f(8)<<8)+f(0)).toString(16).slice(1)};
function wpnL(ty,c){const B=EQB,X=.37,G=EQG,W2=EQW,K=EQK;switch(ty){
  case 'dag':return[B(X,0,8.8,.06,.06,1.2,G),B(X,0,10,.045,.045,3.4,W2),B(X,0,13.4,.05,.2,1.3,G),B(X,0,14.7,.03,.08,8.5,c),B(X,0,23.2,.024,.045,2,c)];
  case 'axe':return[B(X,0,8.8,.05,.05,23,W2),B(X,0,9.6,.056,.056,2.6,K),B(X,0,24,.075,.075,5.5,K),B(X+.09,0,23,.12,.035,7.5,c),B(X+.16,0,21.6,.035,.04,10.5,c),B(X-.08,0,25,.06,.035,3,K),B(X,0,31.8,.06,.06,1.3,G)];
  case 'ham':return[B(X,0,8.8,.05,.05,19,W2),B(X,0,9.6,.056,.056,2.8,K),B(X,0,27,.21,.13,8,c),B(X,0,28.2,.215,.135,1.1,G),B(X,0,32.6,.215,.135,1.1,G)];
  case 'spr':return[B(X,0,8.8,.04,.04,29.2,W2),B(X,0,10.4,.05,.05,2.6,K),B(X,0,38,.06,.06,1.4,G),B(X,0,39.4,.03,.11,4,c),B(X,0,43.4,.025,.07,3,c),B(X,0,46.4,.02,.035,2.2,c)];
  case 'tri':return[B(X,0,8.8,.04,.04,27.4,W2),B(X,0,10.4,.05,.05,2.6,K),B(X,0,36.2,.06,.06,1.4,G),B(X,0,37.6,.04,.25,1.8,c),B(X,-.105,39.4,.035,.035,5.6,c),B(X,0,39.4,.035,.035,7.4,c),B(X,.105,39.4,.035,.035,5.6,c)];
  case 'stf':return[B(X,0,8.8,.045,.045,27.6,W2),B(X,0,36.4,.085,.085,1.8,G),B(X-.055,0,37.2,.02,.02,4,G),B(X+.055,0,37.2,.02,.02,4,G),B(X,0,38.2,.11,.11,5.5,c),B(X,0,43.7,.055,.055,1.6,'#ffffff')];
  case 'scy':return[B(X,0,8.8,.04,.04,30.6,W2),B(X,.05,20,.025,.1,1.6,W2),B(X,0,39.4,.06,.06,1.5,G),B(X+.12,0,38.4,.24,.04,2.6,c),B(X+.225,0,35.4,.035,.04,3.2,c)];
  default:return[B(X,0,8.8,.07,.07,1.5,G),B(X,0,10.3,.05,.05,4.2,W2),B(X,0,14.5,.06,.3,1.7,G),B(X,0,16.2,.035,.1,17,c),B(X,0,33.2,.03,.06,2.2,c)]}}
function helmL(ty,c){const B=EQB,G=EQG;switch(ty){
  case 'crn':return[B(0,0,30,.33,.28,2.4,G),B(-.14,-.115,32.4,.05,.05,2.6,G),B(.14,-.115,32.4,.05,.05,2.6,G),B(-.14,.115,32.4,.05,.05,2.6,G),B(.14,.115,32.4,.05,.05,2.6,G),B(0,.12,32.4,.06,.04,3.6,G),
    B(0,.143,30.5,.07,.012,1.4,c),B(-.168,0,30.5,.012,.07,1.4,c),B(.168,0,30.5,.012,.07,1.4,c)];
  case 'hood':return[B(0,-.01,30.4,.37,.31,3.4,c),B(-.168,-.01,21,.035,.29,9.6,c),B(.168,-.01,21,.035,.29,9.6,c),B(0,-.145,19,.37,.05,12,c),B(0,-.12,33.6,.14,.1,2.4,c),B(0,0,18.4,.5,.33,2.4,c)];
  case 'mask':return[B(0,.132,22.2,.3,.022,8.4,G),B(-.06,.145,25.6,.07,.006,1.3,EQN),B(.06,.145,25.6,.07,.006,1.3,EQN),B(0,.138,17.6,.06,.03,4.6,G),B(0,0,29.6,.35,.3,3.1,c),
    B(-.172,.01,17.5,.045,.15,12.6,c),B(.172,.01,17.5,.045,.15,12.6,c),B(-.172,.01,21,.047,.152,1,G),B(.172,.01,21,.047,.152,1,G),B(0,-.14,21,.35,.04,9,c)];
  default:return[B(0,0,29.4,.35,.3,3.6,c),B(0,0,33,.25,.21,1.6,c),B(-.162,0,22.8,.036,.28,6.8,c),B(.162,0,22.8,.036,.28,6.8,c),B(0,-.14,22.4,.35,.04,7.2,c),B(0,.135,28.4,.35,.03,1.3,G),
    B(0,.143,24.2,.035,.02,4.4,c),B(0,0,34.6,.045,.23,1.5,G)]}}
function armL(ty,c){const B=EQB,G=EQG,BL='#5a3a1e';switch(ty){
  case 'mail':{const L=[B(.28,0,15.6,.135,.185,4.6,c),B(-.28,0,15.6,.135,.185,4.6,c),B(0,0,6.6,.46,.3,2.6,c),B(0,0,9.4,.465,.305,1.2,BL)];
    const rk=eqDk(c,.42);for(const[x,z]of[[-.12,11.2],[0,11.2],[.12,11.2],[-.06,14.2],[.06,14.2],[-.12,17.2],[0,17.2],[.12,17.2]])L.push(B(x,.146,z,.035,.012,1.1,rk));return L}
  case 'robe':return[B(0,0,1.3,.44,.28,8.4,c),B(0,0,1.3,.452,.292,.9,G),B(0,0,10.6,.464,.304,1.4,G),B(.08,.157,6.2,.05,.014,4.4,G),B(.285,0,12.6,.15,.2,6.6,c),B(-.285,0,12.6,.15,.2,6.6,c),B(0,.145,17.4,.1,.012,3.6,EQN)];
  default:return[B(.29,0,18.4,.17,.23,3.3,c),B(-.29,0,18.4,.17,.23,3.3,c),B(.29,0,18,.172,.232,.6,G),B(-.29,0,18,.172,.232,.6,G),B(0,.147,10.8,.05,.014,9.6,G),B(0,0,9.2,.465,.305,1.6,BL),B(0,.158,9.3,.08,.012,1.4,G),
    B(-.11,0,6.2,.18,.28,3.1,c),B(.11,0,6.2,.18,.28,3.1,c)]}}
function shdL(ty,c){const B=EQB,G=EQG;switch(ty){
  case 'buck':return[B(-.36,.125,12.7,.22,.04,3.6,c),B(-.36,.125,10.7,.1,.04,7.6,c),B(-.36,.125,11.7,.18,.04,5.6,c),B(-.36,.147,13.6,.06,.012,1.8,G)];
  case 'pav':return[B(-.37,.125,8.8,.25,.045,13,c),B(-.37,.149,9.6,.045,.008,11.4,G),B(-.37,.125,20.6,.26,.05,1.1,G),B(-.37,.125,9,.26,.05,.9,G)];
  default:return[B(-.36,.125,12,.22,.04,9.4,c),B(-.36,.125,10.2,.15,.04,1.8,c),B(-.36,.125,8.7,.07,.04,1.5,c),B(-.36,.125,21.2,.23,.046,.7,G),B(-.36,.147,13,.03,.008,7,G),B(-.36,.147,17.4,.13,.008,1.1,G)]}}
// modello voxel dell'eroe: gambe, busto, braccia, testa, capelli, occhi, barba, mantello e l'equipaggiamento con i suoi modelli
// ty: tipi dell'equipaggiamento (oggetto o stringa "swd.helm.plate.kite"); se manca: spada, elmo, corazza e scudo classici
function heroL(ap,c,h,w,wv,s,sw,ty){const a=ap&&ap.sk!=null?ap:apFix(ap),sk=APO.sk.c[a.sk],hc=APO.hc.c[a.hc],tu=c>=0?RC[c]:APO.tu.c[a.tu],pa=APO.pa.c[a.pa],ca=APO.ca.c[a.ca],T=tyFix(ty);
  const L=[[-.2,-.1,0,.15,.2,9,pa],[.05,-.1,0,.15,.2,9,pa],[-.22,-.14,9,.44,.28,12,tu],[-.34,-.08,10,.12,.16,10,sk],[.22,-.08,10,.12,.16,10,sk],[-.15,-.12,21,.3,.24,10,sk]];
  if(c<0)L.push([-.23,-.15,10,.46,.3,2,'#5a3a1e']);else L.push(...armL(T.c||EQD.c,RC[c]));
  if(ca)L.push([-.3,-.21,3,.6,.06,19,ca],[-.36,-.2,20,.72,.16,3,ca]);
  L.push([-.09,.12,25,.06,.01,2.5,APO.ec.c[a.ec]],[.04,.12,25,.06,.01,2.5,APO.ec.c[a.ec]]);
  const helm=h>=0&&!a.hh,ht=T.h||EQD.h;
  if(!(helm&&ht==='mask')){if(a.bd===1)L.push([-.15,.12,21,.3,.02,3,hc]);else if(a.bd===2)L.push([-.15,.12,16,.3,.03,8,hc],[.15,-.1,21,.02,.22,4,hc]);else if(a.bd===3)L.push([-.1,.12,22.5,.2,.02,1.5,hc])}
  if(!helm||ht==='crn')switch(a.hs){case 1:L.push([-.16,-.13,29,.32,.26,3,hc],[-.16,-.16,23,.32,.05,7,hc]);break;
    case 2:L.push([-.17,-.14,28,.34,.28,4,hc],[-.17,-.19,14,.34,.07,17,hc],[-.18,-.14,16,.05,.2,13,hc],[.13,-.14,19,.05,.14,10,hc]);break;
    case 3:L.push([-.16,-.13,29,.32,.26,3,hc],[-.16,-.17,24,.32,.05,6,hc],[-.04,-.24,15,.08,.08,13,hc]);break;
    case 4:L.push([-.04,-.13,31,.08,.26,5,hc],[-.16,-.13,26,.32,.03,4,hc]);break;
    case 5:L.push([-.18,-.15,28,.36,.3,4,hc],[-.12,-.09,32,.24,.18,2,hc],[-.18,-.18,21,.36,.06,8,hc],[-.19,-.15,22,.05,.3,7,hc],[.14,-.15,25,.05,.16,4,hc]);break}
  if(helm)L.push(...helmL(ht,RC[h]));
  if(s>=0)L.push(...shdL(T.s||EQD.s,RC[s]));
  if(T.w!==null)L.push(...wpnL(T.w,RC[w]||'#cccccc'));
  // ordine di disegno per profondità (dal fondo al davanti, poi dal basso in alto), così mantello, capelli e barba si sovrappongono giusti
  L.sort((p,q)=>(p[0]+p[3]/2+p[1]+p[4]/2)-(q[0]+q[3]/2+q[1]+q[4]/2)||p[2]-q[2]);
  const k=[.92,1,1.08][a.sz];return k===1?L:scl(L,k)}
// ruota il modello di 90° alla volta (per l'anteprima)
const rotL=(L,n)=>{let R=L;for(let i=0;i<(n&3);i++)R=R.map(b=>[-(b[1]+b[4]),b[0],b[2],b[4],b[3],b[5],b[6]]);return R};
/* ---- direzione dell'eroe: 8 versi, cambio istantaneo (nessuna animazione) ---- */
// 0 = guarda verso +y (in basso a sinistra sullo schermo); ogni passo ruota di 45°
const faceOf=(dx,dy)=>((Math.round((Math.atan2(dy,dx)-Math.PI/2)/(Math.PI/4))%8)+8)%8;
// scatola ruotata di un angolo qualsiasi attorno a (ox,oy): disegna solo le facce rivolte verso chi guarda, poi il tetto
function rbox(x,y,z,w,d,h,c,ca,sa,ox,oy){const T=z+h,Q=[[x,y],[x+w,y],[x+w,y+d],[x,y+d]].map(([u,v])=>[ox+u*ca-v*sa,oy+u*sa+v*ca]);
  if(h>0)for(let i=0;i<4;i++){const p=Q[i],q=Q[(i+1)&3],nx=q[1]-p[1],ny=p[0]-q[0];if(nx+ny<=1e-6)continue;const l=nx*nx+ny*ny||1,f=(.58*nx*Math.max(0,nx)+.78*ny*Math.max(0,ny))/l+.68*(Math.min(0,nx)**2+Math.min(0,ny)**2)/l;
    poly([PX(p[0],p[1]),PY(p[0],p[1],T),PX(q[0],q[1]),PY(q[0],q[1],T),PX(q[0],q[1]),PY(q[0],q[1],z),PX(p[0],p[1]),PY(p[0],p[1],z)],sh(c,f))}
  poly([PX(Q[0][0],Q[0][1]),PY(Q[0][0],Q[0][1],T),PX(Q[1][0],Q[1][1]),PY(Q[1][0],Q[1][1],T),PX(Q[2][0],Q[2][1]),PY(Q[2][0],Q[2][1],T),PX(Q[3][0],Q[3][1]),PY(Q[3][0],Q[3][1],T)],sh(c,1))}
// disegna il modello dell'eroe girato nella direzione fc (0..7)
function drawHero(L,x,y,zo,white,fc){fc=(fc|0)&7;const R=rotL(L,fc>>1);if(!(fc&1)){drawL(isoOrder(R,0),x,y,zo,white);return}
  const k=Math.SQRT1_2;for(const b of isoOrder(R,1))rbox(b[0],b[1],b[2]+zo,b[3],b[4],b[5],white?'#ffffff':b[6],k,k,x,y)}
// disegna un eroe in una tela (anteprima, profilo); rot va da 0 a 7 (passi di 45°)
function paintHero(cv2,ap,eq,rot=0,bob=0){const q=cv2.getContext('2d'),w=cv2.width,h=cv2.height;q.setTransform(1,0,0,1,0,0);q.globalAlpha=1;q.clearRect(0,0,w,h);const og=g;g=q;const sc=Math.min(h/76,w/50);
  try{g.setTransform(sc,0,0,sc,w/2,h*.82);g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(0,0,16,7,0,0,6.3);g.fill();
    const e=eq||{};drawHero(heroL(ap,e.c==null?-1:e.c,e.h==null?-1:e.h,e.w==null?0:e.w,e.wv||12,e.s==null?-1:e.s,0,e.ty),0,0,bob,0,rot)}finally{g=og}}
const myEq=()=>({c:P&&P.eq.c?P.eq.c.r:-1,h:P&&P.eq.h?P.eq.h.r:-1,w:P&&P.eq.w?P.eq.w.r:0,wv:P&&P.eq.w?iv(P.eq.w):12,s:P&&P.eq.s?P.eq.s.r:-1,ty:P?tyPack(eqTy(P.eq)):''});

/* ---- finestra "Aspetto dell'eroe" (dal menu, dalle impostazioni, con il tasto C) ---- */
let LKA=null,LKR=0,LKT=0;
function openLook(){auInit();winOnly('look');$('ztc').className='';LKA=Object.assign({},started&&P?apFix(P.ap):APM);LKR=0;lookHTML();$('look').style.display='block';if(!LKT)LKT=requestAnimationFrame(lookAnim)}
function closeLook(){$('look').style.display='none';cancelAnimationFrame(LKT);LKT=0}
function lookHTML(){const row=k=>{const o=APO[k];let h=`<div class="lkr"><span>${o.n}</span><span>`;
    if(o.c)h+=o.c.map((c,i)=>`<button class="sw${LKA[k]===i?' on':''}" style="background:${c||'repeating-linear-gradient(45deg,#555 0 4px,#333 4px 8px)'}" title="${c?o.n+' '+(i+1):'Nessuno'}" aria-label="${o.n} ${c?i+1:'nessuno'}" onclick="LKA.${k}=${i};lookHTML()"></button>`).join('');
    else h+=`<span class="seg">${o.o.map((n,i)=>`<button class="${LKA[k]===i?'on':''}" onclick="LKA.${k}=${i};lookHTML()">${n}</button>`).join('')}</span>`;return h+'</span></div>'};
  $('look').innerHTML=`<h3>${ico('pennello',24)} Aspetto dell'eroe</h3><div class="lkg"><div class="lkp"><canvas id="lkc" width="180" height="230"></canvas><div><button onclick="LKR=(LKR+7)%8" aria-label="Ruota a sinistra">⟲</button><button onclick="LKR=(LKR+1)%8" aria-label="Ruota a destra">⟳</button></div></div>
  <div class="lko">${APK.map(row).join('')}</div></div><p class="mu">${started?'Gli altri giocatori ti vedono così.':'Vale per le partite nuove e per il tuo eroe salvato.'}</p>
  <button onclick="lookRandom()">🎲 Casuale</button><button onclick="LKA=Object.assign({},APD);lookHTML()">Ripristina</button><button class="gold" onclick="lookSave()">Salva</button><button onclick="closeLook()">Annulla</button>`}
function lookAnim(n){LKT=requestAnimationFrame(lookAnim);const c=$('lkc');if(c&&LKA)paintHero(c,LKA,started?myEq():{c:-1,h:-1,w:0,wv:12,s:-1},LKR,Math.abs(Math.sin(n/300))*1.5)}
function lookRandom(){for(const k of APK){if(k==='hh')continue;const n=(APO[k].c||APO[k].o).length;LKA[k]=Math.floor(Math.random()*n)}lookHTML()}
function lookSave(){const a=apFix(LKA);APM=a;LS.set('voxelia_ap',a);
  if(started&&P){P.ap=a;save();sceneEquip();msg('Nuovo aspetto salvato')}
  else{const s=LS.get(SAVEK,null);if(s&&s.p){s.p.ap=a;LS.set(SAVEK,s)}msg('Aspetto salvato')}
  closeLook();if(!started)menuPort()}
// ritratti nei pannelli: <canvas class="port" data-ap="[...]" data-eq="{...}">
function paintPorts(root){for(const c of root.querySelectorAll('canvas.port')){try{paintHero(c,apFix(JSON.parse(c.dataset.ap||'null')),JSON.parse(c.dataset.eq||'{}'),0,0)}catch(e){}}}
