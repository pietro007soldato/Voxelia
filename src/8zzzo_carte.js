/* ================= 7.47: il duello delle carte =================
   Nella Taverna del Drago Ubriaco (e nelle città di Tomorrow) c'è il Tavolo delle carte. Ogni carta ha un elemento e un
   valore: 🔥 fuoco batte 🌿 natura, 🌿 natura batte 💧 acqua, 💧 acqua batte 🔥 fuoco (+3 a chi ha l'elemento giusto).
   Le carte speciali: il Drago (10), il Giullare (vince solo contro il 9 e il 10) e l'Arcobaleno (ha sempre l'elemento giusto).
   Si giocano cinque mani con cinque carte pescate dalla tua collezione: vince chi ne prende di più. Si può scommettere;
   chi vince prende la posta raddoppiata e spesso una carta dell'avversario. Le prime dieci carte sono in regalo, le altre
   si vincono o si comprano a buste da tre. Gli avversari sono quattro, sempre più bravi. */
XSV.add('crt47');
/* 7.49: ogni carta è un personaggio di Aldoria, con il suo ritratto (lo stesso modello che si vede in città).
   🔥 fuoco: chi lavora con il fuoco e chi combatte · 💧 acqua: la gente del porto e del sapere · 🌿 natura: campi, boschi e bambini.
   Le carte speciali: il Re Aldric (10), l'Attore Fabio (il giullare: vince solo contro il 9 e il 10) e il Saggio Elandor (ha sempre l'elemento giusto). */
const CRTE={f:{i:'🔥',n:'Fuoco',c:'#e85a2a',bg:'#3a1a10'},a:{i:'💧',n:'Acqua',c:'#3a8adc',bg:'#10223a'},n:{i:'🌿',n:'Natura',c:'#4aa84a',bg:'#12301a'}};
const CRTD={f:[['recluta',1],['sguattero',1],['fornaio',2],['stefano',2],['mv_pane',3],['gemma',3],['cuoca',4],['guardia_porta',4],['gilda',5],['ryan',5],['gladiatore',6],['gladiatrice',6],['marcus',7],['ruggero',7],['maestro_armi',8],['kael',8],['borin',9],['generale',9]],
  a:[['pippo',1],['ubriaco',1],['rocco',2],['retaio',2],['nella',3],['ida',3],['nino',4],['gino',4],['ernesto',5],['cantastorie',5],['nostromo',6],['doganiere',6],['armatore',7],['anselmo',7],['baldo',8],['ferro',8],['lia',9],['ammiraglio',9]],
  n:[['tommaso',1],['lucia',1],['bruno_b',2],['lia_r',2],['marta',3],['elio',3],['mv_fiori',4],['mv_frutta',4],['giacomo',5],['rosa_f',5],['pietro',6],['ettore',6],['astronomo',7],['gerald',7],['mira',8],['giardiniere',8],['cacciatore',9],['ada',9]]};
const CRTS={re:{s:'re',v:10,i:'👑',c:'#d4af37',d:'Batte tutti, tranne il giullare'},attore:{s:'giullare',v:1,i:'🎭',c:'#e8c83a',d:'Il giullare: vince solo contro il 9 e il 10'},saggio:{s:'arco',v:6,i:'🌈',c:'#c83ae8',d:'Ha sempre l\'elemento giusto (+3)'}};
const CRTI={};for(const e in CRTD)for(const[id,v]of CRTD[e])CRTI[id]={e,v};
// le carte della 7.47 (f1…n9, drago, giullare, arco) diventano i personaggi con lo stesso elemento e valore
const CRTOLD=k=>{if(k==='drago')return're';if(k==='giullare')return'attore';if(k==='arco')return'saggio';const m=/^([fan])(\d)$/.exec(k);if(!m)return null;const q=CRTD[m[1]].find(x=>x[1]===+m[2]);return q?q[0]:null};
const CRTA=[{id:'lino',n:'Bardo Lino',lv:1,d:'Gioca a caso, e canta mentre perde',min:0,ln:['Una mano a carte? Se perdo ti dedico una ballata.','Hai vinto tu, ma la mia canzone sarà più bella!']},
  {id:'gilda',n:'Oste Gilda',lv:2,d:'Gioca sempre le carte più alte',min:0,ln:['Al mio tavolo si paga da bere e si gioca sul serio.','Brava gente: chi vince offre il giro!']},
  {id:'moreau',n:'Il Moreau',lv:3,d:'Conosce gli elementi',min:15,ln:['Le carte, come le persone, hanno sempre un punto debole.','Interessante. Molto interessante.']},
  {id:'lucrezio',n:'Conte Lucrezio',lv:4,d:'Non sbaglia quasi mai',min:28,ln:['Il Conte non perde. Il Conte, al massimo, concede.','Una rivincita. Subito. Pretendo una rivincita.']}];
const CRTB=[0,50,200,1000];
const CRD={g:null,bet:0,view:'menu',el:''};
const crtAll=()=>{const L=[];for(const e in CRTD)for(const[id]of CRTD[e])L.push(id);return L.concat(Object.keys(CRTS))};
const crtNm=id=>(NPCS[id]&&NPCS[id].n)||id;
const crtInfo=id=>{if(CRTS[id])return Object.assign({id,sp:1,e:null,n:crtNm(id)},CRTS[id]);const q=CRTI[id]||{e:'f',v:1};return{id,e:q.e,v:q.v,n:crtNm(id),i:CRTE[q.e].i,c:CRTE[q.e].c}};
function crtFix(){P.crt47=P.crt47||{c:{},w:{},n:0,v:0};const c=P.crt47;c.c=c.c||{};c.w=c.w||{};
  for(const k of Object.keys(c.c))if(!CRTI[k]&&!CRTS[k]){const n2=CRTOLD(k),q=c.c[k]|0;delete c.c[k];if(n2&&q>0)c.c[n2]=(c.c[n2]|0)+q}
  if(!c.st){c.st=1;for(let i=0;i<10;i++){const e='fan'[i%3],L=CRTD[e].filter(x=>x[1]<=5),id=L[Math.floor(Math.random()*L.length)][0];c.c[id]=(c.c[id]|0)+1}}return c}
const crtCount=()=>Object.values(crtFix().c).reduce((s,n)=>s+(n|0),0);
const crtKinds=()=>Object.keys(crtFix().c).filter(k=>crtFix().c[k]>0).length;
// la forza di una carta contro un'altra (vince la più alta; pari = nessuno)
function crtPow(a,b){const A=crtInfo(a),B=crtInfo(b);if(A.s==='giullare')return B.v>=9?99:0;if(B.s==='giullare'&&A.v>=9)return 0;
  let v=A.v;const adv=A.s==='arco'||A.e&&B.e&&(A.e==='f'&&B.e==='n'||A.e==='n'&&B.e==='a'||A.e==='a'&&B.e==='f');if(adv&&B.s!=='arco')v+=3;return v}
function crtWin(a,b){const x=crtPow(a,b),y=crtPow(b,a);return x>y?1:x<y?-1:0}
function crtDraw(pool,n){const L=[];for(const k in pool)for(let i=0;i<(pool[k]|0);i++)L.push(k);for(let i=L.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[L[i],L[j]]=[L[j],L[i]]}return L.slice(0,n)}
// il mazzo dell'avversario: più è bravo, più carte alte e speciali
function crtFoe(lv){const L=[];for(let i=0;i<5;i++){if(lv>=3&&Math.random()<.08*lv){L.push(Object.keys(CRTS)[Math.floor(Math.random()*3)]);continue}const e='fan'[Math.floor(Math.random()*3)],lo=[1,2,3,4][lv-1],hi=[5,7,8,9][lv-1],C=CRTD[e].filter(x=>x[1]>=lo&&x[1]<=hi);L.push(C[Math.floor(Math.random()*C.length)][0])}return L}
function crtAI(g){const H=g.fh,lv=g.lv;if(lv<=1)return Math.floor(Math.random()*H.length);
  if(lv===2){let b=0;for(let i=1;i<H.length;i++)if(crtInfo(H[i]).v>crtInfo(H[b]).v)b=i;return b}
  // gli altri provano ogni carta contro le carte che hai ancora (il Conte le vede quasi tutte)
  let best=0,bs=-1e9;for(let i=0;i<H.length;i++){let s=0;for(const m of g.ph)s+=crtWin(H[i],m);s=s/Math.max(1,g.ph.length)-crtInfo(H[i]).v*.02*(lv===4?0:1)+(lv===3?Math.random()*.6:Math.random()*.15);if(s>bs){bs=s;best=i}}return best}
function crtStart(i){const A=CRTA[i],c=crtFix();if(!A)return;if(crtCount()<5){msg('Ti servono almeno cinque carte');return}if(crtKinds()<A.min){msg(A.n+' gioca solo con chi ha almeno '+A.min+' carte diverse');tone(150,.1);return}
  const bet=Math.min(CRD.bet,P.g);if(CRD.bet&&P.g<CRD.bet){msg('Non hai abbastanza oro per questa posta');return}P.g-=bet;
  CRD.g={a:i,lv:A.lv,bet,ph:crtDraw(c.c,5),fh:crtFoe(A.lv),sc:[0,0],r:0,last:null,log:[],say:A.ln[0]};tone(500,.06,'triangle');hud();pn('carte47')}
function crtPlay(k){const g=CRD.g;if(!g||g.end)return;const a=g.ph.splice(k,1)[0];if(!a)return;const j=crtAI(g),b=g.fh.splice(j,1)[0],w=crtWin(a,b);g.r++;g.last=[a,b,w];g.log.push([a,b,w]);
  if(w>0)g.sc[0]++;else if(w<0)g.sc[1]++;tone(w>0?720:w<0?220:440,.08,w>0?'triangle':'square',.05);
  // i numeri della spiegazione: con il giullare di mezzo si mostrano i valori delle carte (non il 99 e lo 0 usati per il confronto)
  const A2=crtInfo(a),B2=crtInfo(b),dv=(X,Y,x,y)=>X.s==='giullare'||Y.s==='giullare'&&X.v>=9?X.v:crtPow(x,y),pa=dv(A2,B2,a,b),pb=dv(B2,A2,b,a);
  g.why=w===0?'Pari: '+pa+' contro '+pb:(w>0?A2:B2).n+' vince: '+(w>0?pa+' contro '+pb:pb+' contro '+pa)+((w>0?crtPow(a,b)>A2.v:crtPow(b,a)>B2.v)&&(w>0?A2:B2).s!=='giullare'?' (elemento giusto, +3)':(w>0?A2:B2).s==='giullare'?' (il giullare beffa i grandi)':'');
  if(!g.ph.length)crtEnd();pn('carte47')}
function crtEnd(){const g=CRD.g,c=crtFix(),A=CRTA[g.a],[x,y]=g.sc;g.end=1;
  if(x>y){c.v=(c.v|0)+1;let s='';const pr=g.bet*2;P.g+=pr;if(pr)goldFly(pr);g.say=A.ln[1];
    const nw=!c.w[g.a];c.w[g.a]=(c.w[g.a]|0)+1;let card=null;if(nw&&g.a>=1)card=['saggio','attore','re'][g.a-1];else if(Math.random()<.45){const hi=[5,7,8,9][A.lv-1],L=[];for(const e in CRTD)for(const[id,v]of CRTD[e])if(v<=hi&&v>=hi-3)L.push(id);card=L[Math.floor(Math.random()*L.length)]}
    if(card){c.c[card]=(c.c[card]|0)+1;s=' · nuova carta: '+crtInfo(card).n;g.won=card}g.res='Hai vinto '+x+' a '+y+(pr?' · +'+pr+' oro':'')+s;banner('Hai battuto '+A.n+'!',g.res,'corona');jingle([60,64,67,72,76],.08,'triangle');if(typeof gainXP==='function')gainXP(15*A.lv)}
  else if(x<y){c.n=(c.n|0)+1;g.res='Ha vinto '+A.n+', '+y+' a '+x+(g.bet?' · perdi '+g.bet+' oro':'');g.say='Ritenta, eroe. Le carte girano.';tone(150,.2,'sawtooth',.04)}
  else{P.g+=g.bet;g.res='Pareggio '+x+' a '+y+(g.bet?' · riprendi la posta':'');g.say='Pari e patta. Un\'altra?'}hud();save()}
function crtBuy(){if(P.g<150){msg('Una busta costa 150 monete');tone(150,.1);return}P.g-=150;const c=crtFix(),got=[];for(let i=0;i<3;i++){const r=Math.random();let id;if(r<.04)id=Object.keys(CRTS)[Math.floor(Math.random()*3)];else{const e='fan'[Math.floor(Math.random()*3)],mx=r<.3?9:6,L=CRTD[e].filter(x=>x[1]<=mx);id=L[Math.floor(Math.random()*L.length)][0]}c.c[id]=(c.c[id]|0)+1;got.push(id)}
  CRD.pack=got;msg('Nella busta: '+got.map(crtNm).join(', '));tone(800,.06,'triangle');hud();save();pn('carte47')}
// i ritratti: il personaggio disegnato con il suo modello, dal busto in su, una volta sola
const CRTPIC={};
function crtPic(id){if(CRTPIC[id]!==undefined)return CRTPIC[id];let u='';try{const cv=document.createElement('canvas');cv.width=120;cv.height=110;const q=cv.getContext('2d'),og=g;let m=null;
    try{m=npcModel(id,{},{px:3,py:3})}catch(_){}if(m){g=q;try{q.setTransform(3.2,0,0,3.2,60,131);drawHero(m,0,0,0,0,7)}catch(_){}finally{g=og}u=cv.toDataURL('image/png')}}catch(_){u=''}return CRTPIC[id]=u}
const crtCard=(id,on,cls)=>{const C=crtInfo(id),E2=C.e?CRTE[C.e]:{bg:'#2a1a3a',c:C.c},pic=crtPic(id),nm=String(C.n).replace(/^(Maestro d'arena|Maestro d'armi|Maestro d'ascia|Capitano|Pescatore|Pescivendola|Fruttivendola|Fioraia|Contadina|Fattore|Mugnaio|Pastore|Raccoglitrice|Boscaiolo|Capomastro|Guardiano del Faro|Marinaio|Mozzo|Retaio|Oste|Fabbro|Erborista|Sacerdotessa|Giardiniere|Cacciatore|Gladiatore|Gladiatrice|Doganiere|Armatore|Nostromo|Generale|Ammiraglio|Astronomo|Cantastorie|Garzone|Fornaia|Fornaio|Cuoca|Sguattero|Recluta|Vecchia|Vecchio|Piccolo|Piccola|Bardo|Attore|Saggio|Re)\s+/,'');
  return`<span class="crt47 ${cls||''}" style="--cc:${C.c};--bg:${E2.bg}" title="${esc(C.n)}${C.d?' — '+esc(C.d):''}"${on?` onclick="${on}"`:''}><em>${C.i}</em><b>${C.v}</b>${pic?`<img class="pt" src="${pic}" alt="">`:'<i>?</i>'}<small>${esc(nm)}</small></span>`};
X43P.carte47=()=>{const c=crtFix(),g=CRD.g;let h=`<h3>🃏 Tavolo delle carte · 💰${P.g}</h3>`;
  if(g){const A=CRTA[g.a];h+=`<div class="crt47o"><img src="${crtPic(A.id)}" alt=""><div><b>${esc(A.n)}</b>${g.bet?' · posta '+g.bet+' oro':''}<br><i>«${esc(g.say||'')}»</i></div><span class="crt47s">${g.sc[0]} · ${g.sc[1]}</span></div>`;
    h+=`<p class="x43t">Mano ${Math.min(5,g.r+(g.end?0:1))} di 5 ${g.log.map(q=>q[2]>0?'🟢':q[2]<0?'🔴':'⚪').join('')}</p>`;
    if(g.last){const[a,b,w]=g.last;h+=`<div class="crt47t">${crtCard(a,'',w>0?'win':w<0?'lose':'')}<span class="mu">${w>0?'prendi tu':w<0?'prende '+esc(A.n.split(' ').pop()):'pari'}<br><small>${esc(g.why||'')}</small></span>${crtCard(b,'',w<0?'win':w>0?'lose':'')}</div>`}
    if(g.end)h+=`<p><b>${esc(g.res)}</b></p>${g.won?`<div class="crt47h">${crtCard(g.won,'','win')}</div>`:''}<button onclick="CRD.g=null;pn('carte47')">Ancora</button>`;
    else h+=`<p class="x43t">Scegli la carta da giocare: 🔥 batte 🌿, 🌿 batte 💧, 💧 batte 🔥 (+3).</p><div class="crt47h">${g.ph.map((id,i)=>crtCard(id,'crtPlay('+i+')','hand')).join('')}</div><p class="x43t">${esc(A.n)} ha ancora ${g.fh.length} carte coperte.</p>`;
    return h+`<button onclick="cl()">Chiudi</button>`}
  if(CRD.view==='col'){const all=crtAll(),el=CRD.el,L=all.filter(id=>!el||(el==='s'?CRTS[id]:CRTI[id]&&CRTI[id].e===el));h+=`<p class="x43t">${crtKinds()} personaggi su ${all.length} · ${crtCount()} carte in tutto · vittorie ${c.v|0}, sconfitte ${c.n|0}</p>
    <div class="srow">${[['','Tutte'],['f','🔥 Fuoco'],['a','💧 Acqua'],['n','🌿 Natura'],['s','✨ Speciali']].map(([k,n])=>`<button class="${el===k?'on':''}" onclick="CRD.el='${k}';pn('carte47')">${n}</button>`).join('')}</div>
    <div class="crt47h">${L.map(id=>c.c[id]>0?`<span class="crt47w">${crtCard(id,'','')}${c.c[id]>1?`<sup>×${c.c[id]}</sup>`:''}</span>`:`<span class="crt47 no" title="Ancora da trovare"><em>${CRTS[id]?CRTS[id].i:CRTE[CRTI[id].e].i}</em><b>${crtInfo(id).v}</b><i>?</i><small>???</small></span>`).join('')}</div><button onclick="CRD.view='menu';pn('carte47')">Indietro</button><button onclick="cl()">Chiudi</button>`;return h}
  if(CRD.pack){const pk=CRD.pack;CRD.pack=null;h+=`<p class="x43t">Nella busta:</p><div class="crt47h">${pk.map(id=>crtCard(id,'','win')).join('')}</div>`}
  h+=`<p class="x43t">Ogni carta è un personaggio di Aldoria. Cinque mani con cinque carte della tua collezione: vince chi ne prende di più. Hai ${crtCount()} carte (${crtKinds()} personaggi su ${crtAll().length}).</p>
  <div class="srow"><span class="mu">Posta</span> ${CRTB.map(b=>`<button class="${CRD.bet===b?'on':''}" onclick="CRD.bet=${b};pn('carte47')">${b?b+' 💰':'Per gioco'}</button>`).join('')}</div>
  <div class="x43c">${CRTA.map((A,i)=>`<button class="crt47a" ${crtKinds()<A.min?'disabled':''} onclick="crtStart(${i})"><img src="${crtPic(A.id)}" alt=""><b>${esc(A.n)}</b><small>${A.d}${A.min?' · vuole '+A.min+' personaggi diversi':''}</small><small>${c.w[i]?'Battuto '+c.w[i]+' volte':i?'Prima vittoria: '+crtNm(['saggio','attore','re'][i-1]):''}</small></button>`).join('')}</div>
  <button onclick="crtBuy()">🎴 Busta di tre carte · 150 💰</button><button onclick="CRD.view='col';pn('carte47')">📚 Collezione</button><button onclick="cl()">Chiudi</button>`;return h};
// il tavolo: nella taverna e nelle città di Tomorrow
function crtPlace(){if(!ZZ||!started||ents.some(e=>e.k==='carte47'))return;let c=null;if(Zk==='in_tavern')c=[10,10];else if(typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub)c=[ZZ.shub[0]+4,ZZ.shub[1]-4];if(!c)return;const q=spot47(c,2);if(q)ents.push({k:'carte47',px:q[0]+.5,py:q[1]+.5,n:'Tavolo delle carte'})}
const _loadPost747o=loadPost;loadPost=function(k){_loadPost747o(k);try{crtPlace()}catch(e){console.warn('carte',e)}};
ITK.add('carte47');
const _act747o=act;act=function(e){if(e&&e.k==='carte47'){CRD.view='menu';crtFix();pn('carte47');return}_act747o(e)};
const _ent747o=ent;ent=function(e){if(e.k==='carte47'){drawL([[-.05,-.05,0,.1,.1,8,'#5a3a1a'],[-.42,-.42,8,.84,.84,2,'#2a6a3a'],[-.44,-.44,7,.88,.88,1,'#6a4a2a']],e.px,e.py,0);
  [['#e85a2a',-.2,-.1],['#3a8adc',0,-.15],['#4aa84a',.18,.05],['#ffffff',-.05,.15]].forEach(([c,x,y])=>box(e.px+x,e.py+y,10,.14,.2,.3,c));return}_ent747o(e)};
(function(){const st=document.createElement('style');st.textContent=`.crt47{display:inline-flex;flex-direction:column;align-items:center;position:relative;width:78px;height:110px;margin:3px;padding:3px 2px 2px;border-radius:8px;background:linear-gradient(170deg,var(--bg),#00000080 120%);color:#fff4d8;border:3px solid var(--cc);box-shadow:0 2px 5px #0008,inset 0 0 0 1px #ffffff30;vertical-align:top;font-family:Georgia,serif;overflow:hidden}
.crt47 em img{width:14px;height:14px;margin:0;background:none;border-radius:0}.crt47 img.pt{width:72px;height:66px;object-fit:cover;object-position:center 45%;border-radius:5px;background:radial-gradient(circle at 50% 40%,#ffffff30,#00000040);margin-top:12px}.crt47>i{font-style:normal;font-size:30px;margin-top:22px;opacity:.6}.crt47 em .vi{width:14px;height:14px;font-size:13px}
.crt47 em{position:absolute;left:3px;top:1px;font-style:normal;font-size:13px}.crt47 b{position:absolute;right:4px;top:0;font-size:17px;color:var(--cc);text-shadow:0 0 3px #000,0 0 6px #000}
.crt47 small{font-size:9.5px;text-align:center;line-height:1.05;margin-top:auto;padding:1px 2px;width:100%;background:#00000060;border-radius:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.crt47.hand{cursor:pointer;transition:transform .12s}.crt47.hand:hover{transform:translateY(-7px) rotate(-2deg);box-shadow:0 8px 12px #000a}.crt47.win{box-shadow:0 0 14px #ffd84a,0 0 4px #ffd84a}.crt47.lose{opacity:.5;filter:grayscale(.6)}
.crt47.no{--cc:#ffffff30;--bg:#222;filter:grayscale(1);opacity:.55}.crt47t{display:flex;align-items:center;justify-content:center;gap:12px;margin:6px 0;text-align:center}.crt47t small{font-size:11px}
.crt47h{display:flex;flex-wrap:wrap;justify-content:center;max-height:50vh;overflow:auto}.crt47w{position:relative;display:inline-block}.crt47w sup{position:absolute;right:6px;bottom:22px;font-size:11px;background:#000a;border-radius:6px;padding:0 4px;color:#ffd84a}
.crt47o{display:flex;align-items:center;gap:10px;background:#00000030;border-radius:8px;padding:4px 8px}.crt47o img{width:56px;height:48px;object-fit:cover;object-position:center 30%;border-radius:6px;background:#ffffff20}.crt47o div{flex:1;font-size:13px}.crt47s{font-size:22px;font-weight:bold;color:#ffd84a}
.crt47a img{width:60px;height:52px;object-fit:cover;object-position:center 30%;border-radius:6px;background:#ffffff15;align-self:center}`;document.head.appendChild(st)})();
