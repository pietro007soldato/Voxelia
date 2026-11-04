/* ================= 7.46: la tua nave e le isole da scoprire =================
   Nel Cantiere Navale del Porto (e in Tomorrow nelle tue città sul mare) c'è il banco del progetto: scegli lo scafo
   (barca, caravella o galeone), i colori dello scafo, delle vele e della bandiera e il nome, e la nave viene costruita.
   Resta ormeggiata accanto al molo, con i tuoi colori. Dal molo si salpa verso il mare aperto: ogni viaggio verso
   l'ignoto scopre un'isola nuova (spiagge, palme, rovine, forzieri, tesori sepolti, messaggi in bottiglia e qualche
   abitante poco amichevole), che resta nel tuo giornale di bordo e si può raggiungere di nuovo quando vuoi. */
XSV.add('nave');
const NAV46=[{k:'barca',n:'Barca a vela',p:800,isl:4,d:'Piccola e svelta: fino a 4 isole nel giornale di bordo'},{k:'caravella',n:'Caravella',p:2500,isl:8,d:'Due alberi: fino a 8 isole'},{k:'galeone',n:'Galeone',p:7000,isl:14,d:'Il re dei mari: fino a 14 isole'}];
const NAVCOL={scafo:['#7a5a3a','#5a3a22','#2a3a5a','#6a2a2a','#2a5a3a','#e8e0d0'],vele:['#f2ede0','#c0392b','#2a6aa8','#2a2a2a','#e8c040','#7a4a9a'],band:['#c0392b','#2a6aa8','#e8c040','#2a2a2a','#2aa86a','#ffffff']};
const NAVD={sz:0,h:'#7a5a3a',sl:'#f2ede0',fl:'#c0392b',n:'La Speranza'};
const navOwn=()=>!!(P&&P.nave&&P.nave.ok);
function navFix(){P.nave=P.nave||{};const v=P.nave;for(const k in NAVD)if(v[k]==null)v[k]=NAVD[k];v.isl=v.isl||[];return v}
function navKind(){const v=navFix(),B=SHK[NAV46[v.sz|0].k];SHK.mia46=Object.assign({},B,{h:v.h,h2:typeof shx==='function'?shx(v.h,.7):v.h,sl:v.sl,fl:v.fl});return'mia46'}
// dove ormeggiarla: uno specchio d'acqua grande quanto la nave, con la riva accanto per il molo
function navDock(pref){const K=SHK[navKind()],w=Math.ceil(K.w)+1,l=Math.ceil(K.l)+1,busy=(x,y)=>ents.some(e=>e.k==='ship'&&x>=e.px-e.ex-1&&x<=e.px+1&&y>=e.py-e.ey-1&&y<=e.py+1);let best=null,bd=1e9;
  for(let y0=1;y0<N-l-1;y0++)for(let x0=1;x0<N-w-1;x0++){const q=Math.hypot(x0-pref[0],y0-pref[1]);if(q>=bd)continue;let ok=true;for(let y=y0;y<y0+l&&ok;y++)for(let x=x0;x<x0+w&&ok;x++)if(M[y][x]!==2||busy(x,y))ok=false;if(!ok)continue;
    // la riva: una casella camminabile accanto al fianco della nave
    let sh=null;for(let y=y0+1;y<y0+l-1&&!sh;y++)for(const x of[x0-1,x0+w])if(x>0&&x<N-1&&WK(M[y][x]))sh=[x,y];if(!sh)continue;best={x0,y0,sh};bd=q}return best}
function navPlace(){if(!ZZ||!started)return;const home=navHome(),here=Zk===home,isl=!!ZZ.isola;
  // il banco del progetto nel cantiere (e nelle città di Tomorrow sul mare)
  const twSea=typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub&&navWater()>=30;
  if((Zk==='in_cantiere'||twSea)&&!ents.some(e=>e.k==='cant46')){const c=Zk==='in_cantiere'?[6,6]:[ZZ.shub[0]+5,ZZ.shub[1]-3];const q=nearReach(c[0],c[1]);ents.push({k:'cant46',px:q[0]+.5,py:q[1]+.5,n:'Banco del progetto'})}
  if(!navOwn()||!(here||isl))return;const pref=isl?[N/2,N-6]:Zk==='porto'?[46,16]:[ZZ.shub?ZZ.shub[0]:N/2,ZZ.shub?ZZ.shub[1]:N/2];const D=navDock(pref);if(!D)return;
  const kind=navKind(),s=mkShip(kind,D.x0,D.y0,'y');s.mia=1;ents.push(s);ents.push({k:'molo46',px:D.sh[0]+.5,py:D.sh[1]+.5,n:'Molo · '+P.nave.n});
  if(/^isola46_/.test(String(LFROM))&&!isl||isl){heroPut(D.sh[0],D.sh[1]);LFP=1}}
// la «casa» della nave: il Porto di Aldoria, o in Tomorrow la tua città dove l'hai costruita
function navWater(){let n=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(M[y][x]===2)n++;return n}
function navHome(){const v=P&&P.nave;if(v&&v.home)return v.home;return'porto'}
const _loadPost746n=loadPost;loadPost=function(k){_loadPost746n(k);try{navPlace()}catch(e){console.warn('nave',e)}};
ITK.add('cant46');ITK.add('molo46');ITK.add('bott46');
const _act746n=act;act=function(e){if(e&&e.k==='cant46'){pn('nave46');return}if(e&&e.k==='molo46'){pn('rotta46');return}
  if(e&&e.k==='bott46'){ents.splice(ents.indexOf(e),1);const g2=Math.round((40+P.lv*12)*(NET.cfg&&NET.cfg.gm||1));P.g+=g2;goldFly(g2,e.px,e.py);PA={ti:'🍾 Un messaggio in bottiglia',tx:e.tx+'\n\n(Nella bottiglia c\'erano anche '+g2+' monete.)'};pn('txt');hud();save();return}_act746n(e)};
X43P.nave46=()=>{const v=navFix(),B=NAV46[v.sz|0],pal=(k,f)=>NAVCOL[k].map(c=>`<button class="${v[f]===c?'on':''}" title="${c}" onclick="P.nave.${f}='${c}';pn('nave46')"><i style="display:inline-block;width:16px;height:16px;background:${c};border:1px solid #0008"></i></button>`).join('');
  return`<h3>⚓ Il tuo progetto di nave · 💰${P.g}</h3>${v.ok?`<p class="x43t">La tua nave, <b>${esc(v.n)}</b>, è ormeggiata al molo. Puoi cambiarle i colori (gratis) o costruirne una più grande.</p>`:'<p class="x43t">Scegli lo scafo, i colori e il nome: i carpentieri la costruiscono subito.</p>'}
  <div class="x43c">${NAV46.map((q,i)=>`<button class="${(v.sz|0)===i?'on':''}" onclick="P.nave.sz=${i};pn('nave46')"><i>⛵</i><b>${q.n}</b><small>${q.d}</small><small>${v.ok&&(v.bsz|0)>=i?'già tua':q.p+' 💰'}</small></button>`).join('')}</div>
  <div class="srow">Scafo: ${pal('scafo','h')}</div><div class="srow">Vele: ${pal('vele','sl')}</div><div class="srow">Bandiera: ${pal('band','fl')}</div>
  <div class="srow"><label>Nome <input id="nv46" maxlength="22" value="${esc(v.n)}"></label></div>
  <button onclick="navBuild()">🔨 ${v.ok&&(v.bsz|0)>=(v.sz|0)?'Salva i colori e il nome':'Costruisci · '+B.p+' 💰'}</button><button onclick="cl()">Chiudi</button>`};
function navBuild(){const v=navFix(),nm=($('nv46')&&$('nv46').value||'').replace(/[<>]/g,'').trim().slice(0,22);if(nm)v.n=nm;const B=NAV46[v.sz|0],paid=v.ok&&(v.bsz|0)>=(v.sz|0);
  if(!paid){if(P.g<B.p){msg('Servono '+B.p+' monete per la '+B.n);tone(150,.1);return}P.g-=B.p;v.bsz=v.sz|0}
  const first=!v.ok;v.ok=1;if(String(Zk).startsWith('tw:'))v.home=Zk;else if(!v.home||!String(v.home).startsWith('tw:'))v.home='porto';
  cl();save();hud();if(first||!paid){banner(first?'La tua nave è pronta!':'Nave nuova!',v.n+' ti aspetta al molo','stella');jingle([60,64,67,72,79],.1)}else msg('Colori e nome della nave aggiornati');
  const home=navHome();if(Zk===home||Zk==='in_cantiere'){for(const e of ents.slice())if(e.mia||e.k==='molo46')ents.splice(ents.indexOf(e),1);if(Zk===home)navPlace();else msg('La trovi ormeggiata al Porto, accanto al molo')}}
// il giornale di bordo e le rotte
const ISN1=['Isola','Scoglio','Atollo','Isola','Arcipelago','Isolotto'],ISN2=['dei Gabbiani','del Teschio','delle Palme','della Luna','del Corallo','dei Venti','Smeraldo','della Sirena','del Tesoro','Perduta','delle Tartarughe','del Faro','Nera','dei Pirati','delle Conchiglie','Silenziosa'];
function islName(s){const r=sd(s);return ISN1[Math.floor(r()*ISN1.length)]+' '+ISN2[Math.floor(r()*ISN2.length)]}
function islKey(s){const k='isola46_'+s;if(!Z[k]){const r=sd(s+7);Z[k]={n:islName(s),lv:Math.max(1,P.lv),N:40,isola:s,a:'#e6d29a',b:'#dccb90',pool:'#2f86c4',bg:'#62a8de',mus:'pesca',pt:'mote',sea:1};SKY[k]=SKY.porto||SKY.town}return k}
X43P.rotta46=()=>{const v=navFix(),B=NAV46[v.bsz|0],isl=!!(ZZ&&ZZ.isola);
  return`<h3>🧭 ${esc(v.n)} · giornale di bordo</h3><p class="x43t">${v.isl.length} isole scoperte su ${B.isl}. Il mare aperto è pieno di isole: ogni viaggio verso l'ignoto ne trova una nuova.</p>
  ${v.isl.map(s=>{const k=islKey(s);return k===Zk?'':`<button onclick="navSail(${s})">🏝 ${esc(Z[k].n)}</button>`}).join('')}
  <button class="pri" onclick="navSail(0)">🌊 Verso l'ignoto${v.isl.length>=B.isl?' (la più vecchia lascia il posto)':''}</button>
  ${isl?`<button onclick="navBack()">⚓ Torna a ${esc(navHome()==='porto'?'Porto di Aldoria':zname(navHome()))}</button>`:''}<button onclick="cl()">Resta qui</button>`};
function navSail(s){const v=navFix(),B=NAV46[v.bsz|0];if(!s){s=(hs((NET.name||'eroe')+'|isola|'+(v.cnt=(v.cnt|0)+1)+'|'+Date.now())%900000)+1000;v.isl.push(s);while(v.isl.length>B.isl)v.isl.shift();save()}
  const k=islKey(s);Z[k].lv=Math.max(1,P.lv);cl();whoosh();irisGo(()=>{load(k,Zk);banner('Terra in vista!',Z[k].n,'luna')})}
function navBack(){cl();whoosh();const h=navHome();irisGo(()=>load(h,Zk))}
// l'isola: spiagge, palme, rocce, rovine, forzieri, messaggi in bottiglia e qualche abitante
const BOTT46=['«Chi trova questa bottiglia sappia che il tesoro non è dove dice la mappa. È sotto la palma storta.»','«Giorno 40 su quest\'isola. I granchi mi hanno eletto re. Mandate aiuto, o almeno del pane.»',
  '«Al mio amore, ad Aldoria: torno a primavera. Forse. Il vento non vuole.»','«Capitano Scarlatto, se leggi questo: le mappe le hai sbagliate tutte. Firmato: il tuo ex nostromo.»','«Qui c\'era un faro. Ora c\'è un gabbiano che crede di essere un faro.»','«Ho seppellito le mie monete in tre posti diversi. Uno l\'ho già dimenticato.»'];
function islGen(z){const r=sd(z.isola),n=N,c=n>>1;for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}
  const blobs=[[c,c,9+r()*4]];for(let i=0;i<3;i++){const a=r()*6.283;blobs.push([c+Math.cos(a)*7,c+Math.sin(a)*7,4+r()*3])}
  for(const[bx,by,br]of blobs)for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++)if(Math.hypot(x-bx,y-by)<br+(hh(x*.5+z.isola%97,y*.5)*1.6-.8))M[y][x]=0;
  // la spiaggia a sud, dove si sbarca
  for(let y=c;y<n-4;y++)for(let x=c-2;x<=c+2;x++)M[y][x]=0;
  const fr=[];for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++)if(M[y][x]===0)fr.push([x,y]);for(let i=fr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[fr[i],fr[j]]=[fr[j],fr[i]]}
  const far=q=>Math.hypot(q[0]-c,q[1]-(n-5))>5;
  for(let i=0;i<14&&fr.length;i++){const q=fr.pop();if(!far(q))continue;M[q[1]][q[0]]=6;DEC[q[1]][q[0]]=i<9?'ꞁ':'ꞃ'}
  if(r()<.7){const q=fr.find(far);if(q)for(let k=0;k<5;k++){const x=q[0]+k%3-1,y=q[1]+(k>2?1:0);if(M[y]&&M[y][x]===0){M[y][x]=6;DEC[y][x]='ꞅ'}}}
  const free=()=>{while(fr.length){const q=fr.pop();if(M[q[1]][q[0]]===0&&far(q))return q}return null};
  for(let i=0;i<3;i++){const q=free();if(q)ents.push({k:'ch',px:q[0]+.5,py:q[1]+.5,rich:i===0?1:0})}
  const q2=free();if(q2)ents.push({k:'bott46',px:q2[0]+.5,py:q2[1]+.5,n:'Bottiglia',tx:BOTT46[Math.floor(r()*BOTT46.length)]});
  const pool=['granchio','pirata','uomo_pesce'].filter(k=>E[k]),ne=3+Math.floor(r()*4);for(let i=0;i<ne;i++){const q=free();if(q)ents.push(mk(pool[Math.floor(r()*pool.length)],q[0],q[1]))}
  return[c,n-6]}
const _genWild746n=genWild;genWild=function(z){if(z&&z.isola)return islGen(z);return _genWild746n(z)};
// i disegni: palma, roccia, rovina, bottiglia, banco del progetto, molo
{const d0=dec;dec=function(x,y,c,h){if(c==='ꞁ'){bPalm(x,y,h);return}if(c==='ꞃ'){box(x+.15,y+.2,0,.7,.6,8,'#8a8478',.9+h*.1);box(x+.3,y+.3,8,.4,.35,5,'#9a948a');return}
  if(c==='ꞅ'){box(x+.05,y+.05,0,.9,.9,14+h*10,'#b8ae98',.9+h*.08);if(h>.5)box(x+.1,y+.1,14+h*10,.5,.5,4,'#a89e88');return}return d0.apply(this,arguments)}}
const _ent746n=ent;ent=function(e){if(e.k==='bott46'){const u=Math.sin(t*3+e.px)*1.2;drawLB([[-.06,-.14,1+u,.12,.28,5,'#5a9a6a',1.15],[-.03,.12,2+u,.06,.08,3,'#a8845a'],[-.04,-.1,2.5+u,.08,.14,2,'#f4ecd8']],e.px,e.py,0);return}
  if(e.k==='cant46'){drawL([[-.45,-.3,0,.9,.6,14,'#8a6a42'],[-.48,-.33,14,.96,.66,2,'#6a4a2a'],[-.3,-.2,16,.5,.36,1,'#f4ecd8'],[-.1,-.1,17,.4,.06,4,'#5a3a22'],[.05,-.15,17,.05,.4,8,'#5a3a22'],[.05,-.12,20,.03,.3,6,'#f2ede0']],e.px,e.py,0);return}
  if(e.k==='molo46'){const fl=P&&P.nave?P.nave.fl:'#c0392b',w=Math.sin(t*3)*.04;drawL([[-.4,-.4,-2,.8,.8,3,'#8a6a42'],[-.08,-.08,1,.16,.16,14,'#5a3a22'],[-.1,-.1,15,.2,.2,2,'#3a2a1a'],[.02,-.02,15,.04,.04,24,'#6a4a2a'],[.06,-.03+w,32,.36,.04,10,fl]],e.px,e.py,0);return}
  _ent746n(e)};
