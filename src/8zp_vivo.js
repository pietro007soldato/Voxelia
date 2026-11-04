/* ================= 7.17: TOMORROW VIVO — città, case, campi, gemme, battaglie =================
   - CITTÀ: mura con torri e porte dove arrivano le strade, viali lastricati, piazza con la fontana, mercato, lampioni,
     stendardi, giardini, 15-20 case, la locanda, la bottega, la fucina, il tempio e la Casa delle Gemme; guardie di ronda e
     cittadini a passeggio. La prima città è a due regioni dalla partenza, le altre sono rare.
   - CASE VISITABILI: nei villaggi e nelle città ogni casa ha la sua porta e il suo interno (letti, tavoli, camino, librerie,
     bauli...) con chi ci abita; la locanda, la bottega, la fucina e il tempio hanno il loro arredo e il loro mestiere.
   - VITA: recinti con mucche, pecore e maiali accanto ai villaggi, campi coltivati e spaventapasseri, viandanti e mercanti
     ambulanti sui sentieri, santuari che curano e benedicono una volta al giorno, falò e rovine.
   - ACCAMPAMENTO (tasto T o il pulsante ⛺): fuori dai villaggi monti la tenda e accendi il fuoco. Intorno al campo c'è una
     zona sicura (i mostri non entrano), la vita torna in fretta e dalla tenda puoi riposare (cura completa, passano due ore),
     cucinare quello che hai raccolto (forza e vita in più) e smontare il campo. Il campo resta finché sei nella regione.
   - GEMME DEL TELETRASPORTO: in molte città il Custode delle Gemme vende la gemma della sua città. Usandola (tasto G) una
     colonna di luce ti solleva e un breve filmato di viaggio ti porta là. Una gemma si usa una volta.
   - BATTAGLIE EPICHE: le città vengono assediate. Un esercito di mostri arriva a ondate dalle porte, guidato da un signore
     della guerra; i soldati della città combattono al tuo fianco, ognuno con la sua vita e la sua spada. Si combattono come
     contratto («La battaglia di...») o capitano entrando in una città. */
const twRegion=()=>String(Zk).startsWith('tw:');
const twEsc=s=>esc(String(s));

/* ---- case e interni ---- */
const TWIK={casa:'Casa',locanda:'Locanda',bottega:'Bottega',fucina:'Fucina',tempio:'Tempio',gemme:'Casa delle Gemme'};
function twHouse(b,i,rx,ry,kind){kind=kind||'casa';const k=TB.push(b)-1;for(let v=b.y;v<b.y+b.h;v++)for(let u=b.x;u<b.x+b.w;u++){M[v][u]=3;DEC[v][u]='';BM[v][u]=k}
  const dx=b.x+Math.floor(b.w/2),dy=b.y+b.h;if(dy>=N-1||dx<1)return;M[dy][dx]=0;DEC[dy][dx]=DN+'4';const ik='twi:'+rx+','+ry+':'+i+':'+kind;const z=twInt(ik);if(!z)return;b.to=ik;b.dx=dx;
  ents.push(po(dx,dy,ik,{st:'door',n:z.n}))}
function twResident(id){if(NPCS[id])return NPCS[id];const m=/^tr_(m?\d+)_(m?\d+)_(\d+)$/.exec(id);if(!m)return null;const rx=twDec(m[1]),ry=twDec(m[2]),i=+m[3],r=twRnd('res',rx,ry,i),nm=TWNM[(twHs('rnm',rx,ry)+i*11)%TWNM.length],vn=twVilName(rx,ry);
  const job=['contadino','tessitrice','pescatore','vecchio soldato','cacciatrice','scrivano','vasaia','boscaiolo','fornaia','cartografo'][Math.floor(r()*10)];
  return NPCS[id]={n:nm,c:['#7a5a3a','#3a5a8a','#8a3a3a','#4a7a3a','#6a4a7a','#a8632f'][Math.floor(r()*6)],hat:['#333333','#7a3a2a','#3a3a5a','#8a6a2a'][Math.floor(r()*4)],
    ln:[`Benvenuto in casa mia. Faccio il ${job}, qui a ${vn}: non è una vita da eroi, ma è una vita.`,'Pulisciti i piedi, prima di entrare! ...Va bene, ormai sei dentro.','Mio nonno diceva che oltre le colline il mondo non finisce mai. Aveva ragione, ma non ci è mai andato.',
      'Se ti serve riposo c\'è la locanda. Se ti serve coraggio, c\'è la locanda lo stesso.']}}
function twInt(k){if(Z[k])return Z[k];const m=/^twi:(-?\d+),(-?\d+):(\d+):([a-z]+)$/.exec(String(k||''));if(!m)return null;const rx=+m[1],ry=+m[2],i=+m[3],kind=m[4],rn=twRnd('int',rx,ry,i),rr=(a,b)=>a+Math.floor(rn()*(b-a+1));
  const reg=twZ(twK(rx,ry));if(!reg)return null;const big=kind!=='casa',W=big?rr(11,13):rr(8,10),H=big?rr(9,10):rr(7,8),L=[];
  for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++)row+=(x===0||y===0||x===W-1||y===H-1)?'#':'.';L.push(row.split(''))}
  const put=(x,y,c)=>{if(x>0&&y>0&&x<W-1&&y<H-1&&L[y][x]==='.')L[y][x]=c},dx=W>>1;L[H-1][dx]='D';
  const np=[];let ttl=TWIK[kind];
  if(kind==='casa'){put(1,1,'B');put(2,1,'B');put(W-2,1,'S');put(W-3,1,'S');put(dx,1,'F');put(1,H-2,'p');put(W-2,H-2,rn()<.5?'c':';');put(dx-1,3,'T');put(dx,3,'T');put(1,3,'_');put(W-2,3,'ɱ');put(dx+1,H-2,'*');
    const id='tr_'+twEnc(rx)+'_'+twEnc(ry)+'_'+i;twResident(id);np.push([id,dx+1,2]);ttl='Casa di '+NPCS[id].n}
  else if(kind==='locanda'){for(let x=2;x<W-2;x++)put(x,2,'C');put(1,1,'b');put(2,1,'b');put(W-2,1,'b');put(dx,1,'F');for(const[x,y]of[[2,5],[3,5],[W-4,5],[W-3,5],[2,H-3],[W-3,H-3]])put(x,y,'T');put(1,H-2,'*');put(W-2,H-2,'*');
    np.push([twNpcId(rx,ry,4),dx,1]);for(let j=0;j<2;j++){const id='tr_'+twEnc(rx)+'_'+twEnc(ry)+'_'+(50+i*3+j);twResident(id);np.push([id,j?W-4:3,j?6:4])}ttl='Locanda di '+reg.n}
  else if(kind==='bottega'){for(let x=2;x<W-2;x++)put(x,3,'C');for(let x=1;x<W-1;x+=2)put(x,1,'S');put(1,H-2,'k');put(2,H-2,'k');put(W-2,H-2,'ŝ');put(W-3,H-2,'b');np.push([twNpcId(rx,ry,1),dx,2]);ttl='Bottega di '+reg.n}
  else if(kind==='fucina'){put(dx,2,'A');put(dx-2,1,'ȼ');put(dx+2,1,'w');put(1,1,'b');put(W-2,1,'k');put(W-2,H-2,'w');put(1,H-2,'L');np.push([twNpcId(rx,ry,2),dx,3]);ttl='Fucina di '+reg.n}
  else if(kind==='tempio'){put(dx,1,'X');for(const x of[dx-2,dx+2])put(x,1,'ċ');put(1,1,'Y');put(W-2,1,'Y');for(const y of[3,5])for(const x of[2,W-3])put(x,y,'n');np.push([twNpcId(rx,ry,3),dx+1,2]);ttl='Tempio di '+reg.n}
  else if(kind==='gemme'){put(dx,1,'<');put(1,1,'8');put(W-2,1,'8');put(dx-2,2,'ʘ');put(dx+2,2,'ċ');put(1,H-2,'8');put(W-2,H-2,'8');np.push([twNpcId(rx,ry,9),dx+1,2]);ttl='Casa delle Gemme di '+reg.n}
  for(const q of np)twNpc(q[0])||twResident(q[0]);
  const n=Math.max(W,H),lay=L.map(r=>r.join('').padEnd(n,' '));while(lay.length<n)lay.push(' '.repeat(n));
  const pal={casa:['#9a7a52','#92744e','#e0d0b0'],locanda:['#8a6a42','#82643e','#d8c8a8'],bottega:['#8a7252','#826c4e','#d8c8a0'],fucina:['#6a6a6a','#646464','#a89a8a'],tempio:['#d8d4c8','#ccc8bc','#f0ece0'],gemme:['#4a4a6a','#44446a','#b8b0d8']}[kind]||['#9a7a52','#92744e','#e0d0b0'];
  return Z[k]={n:ttl,lv:0,N:n,bg:'#141820',mus:kind==='locanda'?'inter':'inter',int:1,tw:0,twi:1,fl:pal[0],fl2:pal[1],wall:pal[2],np,lay,out:twK(rx,ry)}}
const _zd717=zd;zd=function(k){if(typeof k==='string'&&k.startsWith('twi:'))twInt(k);return _zd717(k)};
const _zname717=zname;zname=function(k){if(typeof k==='string'&&k.startsWith('twi:'))twInt(k);return _zname717(k)};

/* ---- la città ---- */
const twCityGem=(rx,ry)=>{const c=twCity1();return!!(c&&c[0]===rx&&c[1]===ry)||twI(rx,ry,113)<.7};

/* ---- vita nelle regioni: recinti, campi, viandanti, santuari, falò ---- */
function twGenExtra(C,spot,C2){const{F,disc,rnd,rr,n,hub,rx,ry,bio,tg,z,ok}=C;
  if(z.vil&&!z.city&&bio!=='cenere'){const q=spot(14,20);if(q){const[x,y]=q;for(let v=y-3;v<=y+3;v++)for(let u=x-4;u<=x+4;u++){if(!ok(u,v)||M[v][u]===3)continue;const edge=v===y-3||v===y+3||u===x-4||u===x+4;
      if(edge&&!(v===y+3&&u===x)){M[v][u]=6;DEC[v][u]='f'}else F(u,v,bio==='deserto'?'2':'')}
      const an=['mucca','pecora','maiale','pecora'].filter(a=>ANM[a]&&NPCS[a]);for(let i=0;i<rr(2,4)&&an.length;i++){const id=an[i%an.length],e=mkNpc(id,x-2+i,y-1+(i&1),{wd:1});e.wg=1;e.m=ANM[id]();ents.push(e)}tg.push([x,y+3])}
    const q2=spot(14,22);if(q2&&bio!=='neve'){const[x,y]=q2;for(let v=y-2;v<=y+2;v++)for(let u=x-3;u<=x+3;u++)if(ok(u,v)&&M[v][u]===0&&DEC[v][u]!==DN+'1'){M[v][u]=6;DEC[v][u]=bio==='deserto'?'v':(u+v)%3?'g':'q'}if(ok(x+4,y)&&M[y][x+4]===0){M[y][x+4]=6;DEC[y][x+4]='E'}}}
  if(!z.vil){// un viandante sul sentiero (a volte un mercante ambulante)
    if(rnd()<.45){const id='tt_'+twEnc(rx)+'_'+twEnc(ry);twTraveller(id);const[x,y]=nearFree(hub[0]+rr(-3,3),hub[1]+rr(-3,3));const e=mkNpc(id,x,y,{wd:1});e.wg=1;ents.push(e);tg.push([x,y])}
    // un santuario
    if(rnd()<.35){const q=spot(8,22);if(q){const[x,y]=q;disc(x+.5,y+.5,2.4,(u,v)=>{if(M[v][u]!==3)F(u,v,'4')});for(const[a,b]of[[-2,-1],[2,-1],[-2,1],[2,1]])if(ok(x+a,y+b)){M[y+b][x+a]=6;DEC[y+b][x+a]='ċ'}
      ents.push({k:'twsh',n:'Santuario',px:x+.5,py:y+.5,key:Zk+':'+x+','+y});tg.push([x,y])}}
    // un falò abbandonato con i tronchi intorno
    if(rnd()<.4){const q=spot(6,26);if(q){const[x,y]=q;F(x,y,'');M[y][x]=6;DEC[y][x]='ƒ';for(const[a,b]of[[-1,1],[1,1]])if(ok(x+a,y+b)&&M[y+b][x+a]===0){M[y+b][x+a]=6;DEC[y+b][x+a]='m'}}}}}
function twTraveller(id){if(NPCS[id])return NPCS[id];const m=/^tt_(m?\d+)_(m?\d+)$/.exec(id);if(!m)return null;const rx=twDec(m[1]),ry=twDec(m[2]),r=twRnd('tt',rx,ry),nm=TWNM[Math.floor(r()*TWNM.length)],shop=r()<.35;
  let cy=null,bd=99;for(let y=-6;y<=6;y++)for(let x=-6;x<=6;x++)if(twCity(rx+x,ry+y)){const d=Math.max(Math.abs(x),Math.abs(y));if(d<bd){bd=d;cy=[x,y]}}
  const ln=[cy?`La città più vicina? ${twZ(twK(rx+cy[0],ry+cy[1])).n}, ${twDir(cy[0],cy[1])}. Ci arrivi seguendo i sentieri.`:'Di città, da queste parti, non ne ho viste. Solo villaggi e bestie.',
    'Cammino da quaranta giorni. Il mondo non finisce: ogni volta che arrivo in cima a una collina, ce n\'è un\'altra.','Se fa buio, accenditi un fuoco e monta la tenda: le bestie non si avvicinano alle fiamme.'];
  return NPCS[id]={n:(shop?'Mercante ambulante ':'Viandante ')+nm,role:shop?'shop':undefined,c:['#6a5a3a','#5a4a6a','#3a5a4a'][Math.floor(r()*3)],hat:'#4a3a2a',ln}}
// il santuario: cura completa e benedizione una volta al giorno
ITK.add('twsh');ITK.add('twc');
function twShrine(e){P.tw.sh=P.tw.sh||{};if(P.tw.sh[e.key]===gDay()){msg('Il santuario è silenzioso: torna domani.');return}P.tw.sh[e.key]=gDay();P.hp=P.mx;P.bD=Math.max(P.bD||0,300);
  if(cineOK()){sparks(e.px,e.py,30,['#fff2a0','#ffffff','#9adcff'],110);ringFx(e.px,e.py,'255,240,160',1,2.6)}jingle([72,76,79,84,88],.1,'triangle');banner('Santuario','La luce ti cura e ti protegge (difesa +25% per 5 minuti)','sole');hud()}

/* ---- l'accampamento ---- */
const TWCR=6.5;
function twCampHere(){return P.tw&&P.tw.camp&&P.tw.camp.k===Zk?ents.find(e=>e.k==='twc'):null}
function twCampTry(){if(!twOn()||!started||PM)return;if(!twRegion()){msg('Il campo si monta all\'aperto, fuori dalle case e dai dungeon');return}
  if(ZZ.vil){msg('Nei villaggi e nelle città c\'è la locanda: il campo si monta in viaggio');return}if(twCampHere()){msg('Il tuo campo è già montato qui');return}if(OW.camping)return;
  const near=ents.find(e=>e.k==='en'&&((e.al&&dist(e,P)<12)||dist(e,P)<5));if(near){msg('Ci sono nemici troppo vicini: allontanati prima di accamparti');tone(150,.12);return}
  if(!WK(M[P.py|0][P.px|0])){msg('Qui non c\'è spazio per la tenda');return}
  OW.camping={t:0,x:P.px,y:P.py};P.path=[];P.tg=null;msg('Monti la tenda e accendi il fuoco…');tone(300,.1,'triangle')}
function twCampBuild(){const c=OW.camping;OW.camping=null;const[x,y]=nearFree(Math.floor(c.x),Math.floor(c.y)-1);
  for(const e of ents.filter(e=>e.k==='twc'))ents.splice(ents.indexOf(e),1);
  const cp={k:'twc',n:'Il tuo campo',px:x+.5,py:y+.5,torch:1,t0:t};ents.push(cp);P.tw.camp={k:Zk,x,y};
  if(cineOK()){sparks(cp.px,cp.py,24,['#ff9a3a','#ffd84a','#fff2a0'],90)}jingle([60,67,72,76],.1,'triangle');banner('Accampamento','Zona sicura: i mostri non entrano. Avvicinati alla tenda per riposare','sole');save()}
function twCampHTML(){const food=['mela','uova','grano','lunare','scarab','ghiaccio'].filter(r=>(P.res[r]|0)>0);const solo=NET.tm==null;
  return`<div class="twcp"><h3>⛺ Il tuo campo</h3><p class="mu">Intorno alla tenda i mostri non entrano. La vita torna in fretta finché resti vicino al fuoco.</p>
  <button class="psb pri" onclick="twCampRest()">🛏 <span><b>Riposa</b><small>Cura completa${solo?', passano due ore':''}</small></span></button>
  ${solo&&gHour()>=19||solo&&gHour()<5?`<button class="psb" onclick="twCampRest(1)">🌅 <span><b>Dormi fino all'alba</b><small>Riparti con la luce</small></span></button>`:''}
  <button class="psb" ${food.length?'':'disabled'} onclick="twCampCook()">🍲 <span><b>Cucina un pasto</b><small>${food.length?'Usa '+food.map(r=>RESN[r]).slice(0,2).join(' e ')+': forza +25% e vita per 3 minuti':'Raccogli mele, uova, grano o erbe per cucinare'}</small></span></button>
  <button class="psb dn" onclick="twCampDown()">🪓 <span><b>Smonta il campo</b><small>Riparti in viaggio</small></span></button></div>`}
function twCampRest(dawn){cl();const go=()=>{P.hp=P.mx;P.pc=0;if(NET.tm==null){if(dawn){const h=gHour();P.gt+=((h>=19?24-h+6:6-h))*60}else P.gt+=120}hud();banner('Riposato',dawn?'Ti svegli con le prime luci':'Due ore di sonno accanto al fuoco','luna');save()};
  if(typeof irisGo==='function'&&cineOK())irisGo(go);else go();tone(400,.3,'sine',.04)}
function twCampCook(){const food=['mela','uova','grano','lunare','scarab','ghiaccio'].filter(r=>(P.res[r]|0)>0);if(!food.length)return;for(const r of food.slice(0,2))P.res[r]--;
  P.bA=Math.max(P.bA||0,180);P.hp=Math.min(P.mx,P.hp+Math.round(P.mx*.3));cl();banner('Un buon pasto','Forza +25% per 3 minuti','forza');jingle([67,72,76],.09,'triangle');hud()}
function twCampDown(){const c=twCampHere();if(c)ents.splice(ents.indexOf(c),1);P.tw.camp=null;cl();msg('Hai smontato il campo');tone(250,.1,'triangle')}
// la zona sicura e il recupero
function twCampTick(dt){if(OW.camping){OW.camping.t+=dt;if(Math.hypot(P.px-OW.camping.x,P.py-OW.camping.y)>.6){OW.camping=null;msg('Hai smesso di montare il campo');return}if(cineOK()&&Math.random()<dt*6)sparks(P.px+.4,P.py,2,['#c8a878','#8a6a42'],40);if(OW.camping.t>=2.2)twCampBuild();return}
  const c=twCampHere();if(!c)return;
  const inside=Math.hypot(P.px-c.px,P.py-c.py)<TWCR;if(inside&&P.hp>0&&P.hp<P.mx){P.hp=Math.min(P.mx,P.hp+P.mx*.05*dt);if(P.pc>0)P.pc=Math.max(0,P.pc-dt*2)}
  for(const e of ents){if(e.k!=='en'||e.boss)continue;const dx=e.px-c.px,dy=e.py-c.py,d=Math.hypot(dx,dy);if(d<TWCR+.6){const k=(TWCR+.8-d)*4*dt/(d||1);mv(e,dx*k,dy*k);if(d<TWCR){e.al=0;e.cdt=Math.max(e.cdt||0,.6)}}}
  for(const p of PJ)if(Math.hypot(p.x-c.px,p.y-c.py)<TWCR)p.t=0}

/* ---- le gemme del teletrasporto ---- */
const twGemPrice=k=>{const z=twZ(k);return 400+(z?z.lv:1)*60};
function twGemHTML(){const G=P.tw.gem||{},keys=Object.keys(G).filter(k=>G[k]>0);const here=twP(String(Zk).startsWith('tw:')?Zk:P.tw.at)||[0,0];
  return`<h3>💎 Gemme del teletrasporto</h3>${keys.length?keys.map(k=>{const p=twP(k),z=twZ(k);return`<div class="twgm"><span class="gi">💎</span><span><b>${twEsc(z.n)}</b><small>${twDir(p[0]-here[0],p[1]-here[1])} · ${G[k]} ${G[k]===1?'gemma':'gemme'}</small></span><button onclick="twTeleport('${k}')" ${OW.tp||OW.bat?'disabled':''}>Usa</button></div>`}).join(''):'<p class="mu">Non hai gemme. Le vende il Custode delle Gemme in molte città: ogni gemma riporta alla sua città.</p>'}<button onclick="cl()">Chiudi</button>`}
function twGemBuy(k){const pr=twGemPrice(k);if(P.g<pr){msg('Non hai abbastanza oro');tone(150,.12);return}P.g-=pr;P.tw.gem=P.tw.gem||{};P.tw.gem[k]=(P.tw.gem[k]|0)+1;
  jingle([76,83,88],.08,'triangle');banner('Gemma del teletrasporto','Ti riporterà a '+twZ(k).n+' (tasto G)','stella');save();hud();if(PA&&PA.k==='npc'&&PM==='npc')pn('npc',PA)}
function twTeleport(k){if(!twOn()||OW.tp||OW.bat)return;const G=P.tw.gem||{};if(!(G[k]>0))return;G[k]--;cl();OW.tp={k,t:0};P.path=[];P.tg=null;
  tone(220,1.2,'sine',.05);jingle([60,64,67,72,76,79,84],.12,'triangle');save()}
function twTpTick(dt){const T=OW.tp;if(!T)return;T.t+=dt;if(cineOK()&&Math.random()<dt*30)sparks(P.px+(Math.random()-.5)*.8,P.py+(Math.random()-.5)*.8,2,['#bfe0ff','#ffffff','#c88aff'],120);
  if(T.t>=1.5&&!T.go){T.go=1;const from=String(Zk).startsWith('tw:')?Zk:P.tw.at,to=T.k,z=twZ(to);
    const land=()=>{OW.tp=null;load(to);if(cineOK()){flash('#e8f4ff',.8,700);sparks(P.px,P.py,40,['#bfe0ff','#ffffff','#c88aff'],140);ringFx(P.px,P.py,'190,220,255',1,3)}banner(z.n,'Sei arrivato con la gemma del teletrasporto','stella')};
    if(typeof LDS!=='undefined'&&cineOK())LDS.play('viaggio',{from,to,name:z.n},land);else land()}}
const _keyDir717=keyDir;keyDir=function(){if(OW.tp||OW.camping&&false)return null;return _keyDir717()};
const _pd717=cv.onpointerdown;cv.onpointerdown=ev=>{if(OW.tp)return;_pd717(ev)};
// il Custode delle Gemme e il pulsante del campo nel dialogo
const _npcHTML717=npcHTML;npcHTML=function(e){let h=_npcHTML717(e);if(!twOn()||!e)return h;const d=NPCS[e.nid];
  if(d&&d.tw2==='gem'){const m=/^tv_(m?\d+)_(m?\d+)_/.exec(e.nid),k=m?twK(twDec(m[1]),twDec(m[2])):null;if(k){const pr=twGemPrice(k),own=(P.tw.gem||{})[k]|0;
    h+=`<div class="qb twgb"><b>💎 Gemma del teletrasporto di ${twEsc(twZ(k).n)}</b><p class="mu">Comprata una volta, ti porta qui quando vuoi: dalla Pietra del viaggio o con il tasto G.${typeof csWsHas==='function'&&csWsHas(k)?' <b>È già tua.</b>':''}</p>${typeof csWsHas==='function'&&csWsHas(k)?'':`<button onclick="twGemBuy('${k}')">Compra · ${pr}💰</button>`}</div>`}}
  return h};

/* ---- le battaglie epiche ---- */
NPCS.tw_sold={n:'Soldato',c:'#5a6a8a',hat:'#9aa4b8',ln:['Per la città!','Restami vicino, eroe: da soli siamo carne, insieme siamo un muro.','Non indietreggiare. Mai.']};
NPCS.tw_capt={n:'Capitano',c:'#7a2a2a',hat:'#d4af37',ln:['Tengo la linea finché respiro. Tu colpisci il loro capo!','Quando cade il signore della guerra, il resto scappa.']};
function twBatStart(C,s){if(OW.bat||!ZZ||!ZZ.city||!ZZ.gates||!ZZ.gates.length)return;const z=ZZ,lv=z.lv+2,rn=sd(hs('bat|'+Zk+'|'+gDay()+'|'+(C?C.id:'ev'))),[cx,cy]=[(z.walls[0]+z.walls[2])>>1,(z.walls[1]+z.walls[3])>>1];
  const g=z.gates[Math.floor(rn()*z.gates.length)],out=[Math.sign(g[0]-cx)||0,Math.sign(g[1]-cy)||0];const ox=Math.abs(g[0]-cx)>Math.abs(g[1]-cy)?out[0]:0,oy=ox?0:out[1];
  const B={z:Zk,C,s,lv,g,o:[ox,oy],wave:0,w:(s&&s.w)||3,nm:(s&&s.nm)||(p2r(rn,OWB1)+' '+p2r(rn,OWB2)),t:0,nx:4,al:[],kills:0,ally0:0,sp:[]};OW.bat=B;
  // lo schieramento: soldati e capitano fra la piazza e la porta
  const hum2=(c,h,sc)=>hum(c,'#e8c8a0',sc,[6,h]);const n=12+Math.min(8,lv>>2);for(let i=0;i<=n;i++){const capt=i===n,f=.55+(i%4)*.06,px=cx+(g[0]-cx)*f+((i%5)-2)*1.2*(oy?1:0)+(ox?((i/5|0)-1):0),py=cy+(g[1]-cy)*f+((i%5)-2)*1.2*(ox?1:0)+(oy?((i/5|0)-1):0);
    const[x,y]=nearFree(clamp(Math.round(px),2,N-3),clamp(Math.round(py),2,N-3));const e=mkNpc(capt?'tw_capt':'tw_sold',x,y,{n:capt?'Capitano '+TWNM[Math.floor(rn()*TWNM.length)]:'Soldato '+TWNM[(i*5+3)%TWNM.length]});
    e.m=capt?hum2('#7a2a2a','#d4af37',1.15):hum2(['#5a6a8a','#4a5a7a','#6a7a9a'][i%3],'#9aa4b8',1);e.ally=1;e.hp=e.mx=Math.round((capt?520:210)*(1+lv*.12));e.at=(capt?16:9)*(1+lv*.1);e.cd=capt?1:1.15;e.cdt=Math.random();e.sp=2.3;e.path=[];ents.push(e);B.al.push(e)}
  B.ally0=B.al.length;music('guerra');banner('La battaglia di '+z.n,'Un esercito di mostri marcia sulla città, guidato da '+B.nm,'spade');if(typeof shake==='function'&&cineOK())shake(.6);tone(70,.8,'sawtooth',.07);twBatUI(1)}
const p2r=(r,a)=>a[Math.floor(r()*a.length)];
function twBatWave(){const B=OW.bat;B.wave++;const last=B.wave>=B.w,g=B.g,[ox,oy]=B.o,z=ZZ,en=z.en.concat(OW.enOf?(OW.enOf(twK(z.rx+ox,z.ry+oy))||[]):[]),n=8+B.wave*4+Math.min(10,B.lv>>1);
  const spawn=(t,el)=>{for(let k=0;k<40;k++){const d=7+Math.random()*9,x=Math.round(g[0]+ox*d+(Math.random()-.5)*(oy?14:5)),y=Math.round(g[1]+oy*d+(Math.random()-.5)*(ox?14:5));if(x<1||y<1||x>=N-1||y>=N-1||!WK(M[y][x]))continue;
      const e=mk(t,x,y,30000+(eid++));if(el)eliteMk(e);e.bt=1;e.al=0;e.hp=e.mx=Math.round(e.mx*(1+B.lv*.02));ents.push(e);return e}return null};
  for(let i=0;i<n;i++)spawn(en[i%en.length],i<B.wave-1);
  if(last){const bb=['troll','re_goblin','faraone','drago_brina','ignis','necromante','sfinge'].filter(t=>E[t]),bk=twKey(bb[twHs('wl',Zk,gDay())%bb.length],'war',Zk,gDay());twType(bk);
    const w=spawn(bk);if(w){w.n=B.nm;w.boss=1;w.hp=w.mx=Math.round(w.mx*1.2);B.boss=w}banner('Ultima ondata','Arriva '+B.nm+', il signore della guerra','teschio');if(typeof shake==='function'&&cineOK())shake(.9);tone(55,1.1,'sawtooth',.08)}
  else banner('Ondata '+B.wave+' di '+B.w,'Tenete la porta!','spade');jingle([55,55,58,55],.18,'square');twBatUI()}
function twAllyKill(e){const i=ents.indexOf(e);if(i<0)return;ents.splice(i,1);if(cineOK()&&e.m)ents.push({k:'dead',m:e.m,px:e.px,py:e.py,t0:t,boss:e.boss,fc:e.m.rg?faceOf(...(e.fd||[0,1])):null});OW.bat&&OW.bat.kills++}
function twBatTick(dt){const B=OW.bat;if(!B)return;if(!ZZ||!ZZ.city||!twRegion()){twBatEnd(0,'La battaglia è continuata senza di te');return}B.t+=dt;
  const foes=ents.filter(e=>e.k==='en'&&e.bt),al=B.al=B.al.filter(a=>ents.includes(a)&&a.hp>0);
  // i soldati: cercano il nemico più vicino e colpiscono
  for(const a of al){a.cdt-=dt;let tg=null,bd=20;for(const f of foes){const d=dist(a,f);if(d<bd){bd=d;tg=f}}
    if(!tg){a.path=[];continue}if(bd>1.25){const dx=(tg.px-a.px)/bd,dy=(tg.py-a.py)/bd;mv(a,dx*a.sp*dt,dy*a.sp*dt);a.path=[{x:a.px|0,y:a.py|0}];a.fd=[dx,dy]}
    else{a.path=[];if(a.cdt<=0){a.cdt=a.cd;a.atkT=t;a.atkD=[(tg.px-a.px)/(bd||1),(tg.py-a.py)/(bd||1)];const d=Math.round(a.at*(.8+Math.random()*.4));if(tg.hp-d<=0)twAllyKill(tg);else{tg.hp-=d;tg.fl=.12;flt(tg,d,'#9ad0ff')}}}}
  // i mostri lontani dall'eroe marciano sui soldati (vicino all'eroe combattono con lui, come sempre)
  for(const f of foes){if(!ents.includes(f))continue;const dp=dist(f,P);if(dp<f.ag||f.al)continue;let tg=null,bd=16;for(const a of al){const d=dist(a,f);if(d<bd){bd=d;tg=a}}
    f.cdt-=dt;if(tg){if(bd>1.2){const dx=(tg.px-f.px)/bd,dy=(tg.py-f.py)/bd;mv(f,dx*f.sp*.9*dt,dy*f.sp*.9*dt);f.fd=[dx,dy]}else if(f.cdt<=0){f.cdt=f.cd;f.atkT=t;f.atkD=[(tg.px-f.px)/(bd||1),(tg.py-f.py)/(bd||1)];const d=Math.round(f.at*(.7+Math.random()*.5));tg.hp-=d;tg.fl=.12;flt(tg,d,'#ff8a7a');
        if(tg.hp<=0){const i=ents.indexOf(tg);if(i>=0)ents.splice(i,1);if(cineOK()&&tg.m)ents.push({k:'dead',m:tg.m,px:tg.px,py:tg.py,t0:t});if(Math.random()<.4)msg(tg.n+' è caduto!')}}}
    else{const cx=(ZZ.walls[0]+ZZ.walls[2])/2,cy=(ZZ.walls[1]+ZZ.walls[3])/2,d=Math.hypot(cx-f.px,cy-f.py);if(d>3)mv(f,(cx-f.px)/d*f.sp*.8*dt,(cy-f.py)/d*f.sp*.8*dt)}}
  // le ondate
  if(!foes.length){B.nx-=dt;if(B.wave>=B.w&&B.wave>0){twBatEnd(1);return}if(B.nx<=0){B.nx=5;twBatWave()}}
  if((B.ui=(B.ui||0)-dt)<=0){B.ui=.4;twBatUI()}}
function twBatUI(on){let el=$('twbat');if(!el){el=document.createElement('div');el.id='twbat';document.body.appendChild(el)}const B=OW.bat;if(!B){el.style.display='none';return}el.style.display='block';
  const foes=ents.filter(e=>e.k==='en'&&e.bt).length,al=B.al.filter(a=>ents.includes(a)).length,pa=Math.round(al/Math.max(1,B.ally0)*100);
  el.innerHTML=`<b>⚔ La battaglia di ${twEsc(ZZ.n)}</b><span>${B.wave?'Ondata '+B.wave+' di '+B.w:'Lo schieramento…'}${B.boss&&ents.includes(B.boss)?' · '+twEsc(B.nm):''}</span><div class="twbb"><i style="width:${pa}%"></i></div><small>Soldati ${al}/${B.ally0} · nemici in campo ${foes} · abbattuti dai soldati ${B.kills}</small>`}
function twBatEnd(win,why){const B=OW.bat;if(!B)return;OW.bat=null;for(const a of B.al){const i=ents.indexOf(a);if(i>=0&&!win)ents.splice(i,1)}for(const e of ents.slice())if(e.k==='en'&&e.bt&&!win){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1)}
  twBatUI();music(typeof zoneMus==='function'?zoneMus():'town');
  if(!win){if(B.s){B.s.on=0}msg(why||'La battaglia è finita');return}
  for(const a of B.al)a.ally=0;jingle([60,64,67,72,76,79,84],.11,'triangle');banner('Vittoria!',ZZ.n+' è salva','trofeo');if(cineOK())for(const a of B.al.slice(0,8))sparks(a.px,a.py,8,['#ffd84a','#fff2a0'],80);
  if(B.C&&B.s){owNext(B.C,'La città è salva!');return}
  const g=Math.round((80+B.lv*35)*(1+B.al.length/Math.max(1,B.ally0))),xp=Math.round((40+B.lv*B.lv*6));P.g+=g;gainXP(xp);P.ow.rep.lega=(P.ow.rep.lega|0)+15;const it=uqNew(Math.max(P.lv,B.lv)+1,null,2,NET.name);if(P.inv.length<INV)P.inv.push(it);
  if(cineOK()){goldFly(g);itemFly(it)}clog('','Battaglia vinta a '+ZZ.n+': '+g+' oro, '+xp+' XP, '+iname(it),{sys:1});save();hud()}
// la battaglia del contratto parte quando arrivi in città; ogni tanto una città viene assediata da sola
const _loadPost717=loadPost;loadPost=function(k){_loadPost717(k);if(!twOn())return;// 7.17.1: anche ricaricare la stessa città (succede quando cadi: ti risvegli in piazza) chiude la battaglia, che è persa
  // 7.22: tranne quando la regione si ricarica sul posto portandosi dietro nemici e alleati (cambio della distanza di visuale; spento finché twMarg() è 0)
  if(OW.bat&&!(OW.bat.z===k&&typeof TWW!=='undefined'&&TWW.seam&&TWW.carry))twBatEnd(0,OW.bat.z===k?'Sei caduto: la battaglia è perduta':'Hai lasciato la battaglia');
  if(String(k).startsWith('tw:')&&ZZ.city){for(const C of P.ow.act){const s=owCur(C);if(s&&s.k==='bat'&&s.z===k){setTimeout(()=>{if(Zk===k&&!OW.bat)twBatStart(C,s)},1800);return}}
    const day=gDay();P.tw.sg=P.tw.sg||{};if(P.tw.sg[k]!==day&&twI(day,hs(k)%9973,127)<.18&&P.lv>=3){P.tw.sg[k]=day;setTimeout(()=>{if(Zk===k&&!OW.bat)twBatStart(null,null)},2500)}}
};
const _owStepTxt717=owStepTxt;owStepTxt=function(C,s,long){s=s||owCur(C);if(s&&s.k==='bat'){let t='Difendi '+owZn(s.z)+' nella battaglia';const a=twP(s.z),b=twP(String(Zk).startsWith('tw:')?Zk:P.tw.at);if(a&&b&&!(a[0]===b[0]&&a[1]===b[1]))t+=' · '+twDir(a[0]-b[0],a[1]-b[1]);return t}return _owStepTxt717(C,s,long)};

/* ---- agganci: tasti, aggiornamento, disegno ---- */
const _upd717=upd;upd=function(dt){_upd717(dt);if(!twOn())return;twCampTick(dt);twTpTick(dt);twBatTick(dt)};
const _act717=act;act=function(e){if(e&&twOn()){if(e.k==='twc'){edPanel('twcamp',twCampHTML());return}if(e.k==='twsh'){twShrine(e);return}}_act717(e)};
const _pn717=pn;pn=function(m,arg){if(m==='twgem'&&twOn()){edPanel('twgem',twGemHTML());return}_pn717(m,arg)};
addEventListener('keydown',e=>{if(!started||!twOn()||e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.repeat)return;const k=e.key.toLowerCase();if(k==='t'){twCampTry();e.preventDefault()}else if(k==='g'){PM==='twgem'?cl():pn('twgem');e.preventDefault()}});
const _ent717=ent;ent=function(e){if(!e)return;
  if(e.k==='twc'){const u=Math.sin(t*9+e.px)*1.5,fl=1.3+Math.sin(t*13)*.15;
    // la tenda, il fuoco con le pietre e i ciocchi, il giaciglio
    for(let i=0;i<4;i++){const w=1.1-i*.26;box(e.px-.9-w/2+.55,e.py-.75,i*5,w,1.05,5,i%2?'#b8986a':'#c8a878')}box(e.px-.4,e.py-.78,0,.1,1.1,21,'#6b4a2b');
    for(let i=0;i<8;i++){const a=i/8*6.283;box(e.px+.55+Math.cos(a)*.32-.06,e.py+.35+Math.sin(a)*.32-.06,0,.12,.12,2.5,'#8a8a80')}
    box(e.px+.35,e.py+.3,0,.45,.1,2.4,'#5a3a1a');box(e.px+.5,e.py+.15,0,.1,.45,2.4,'#6a4a2a');
    box(e.px+.47,e.py+.27,2.4,.16,.16,5+u,'#ff9a3a',fl);box(e.px+.51,e.py+.31,5,.08,.08,5+u*1.4,'#ffd84a',fl);box(e.px-.2,e.py+.6,0,.6,.28,1.2,'#7a3a3a');
    if(SKY[Zk])nlight(e.px+.55,e.py+.35,24,170,'255,170,80',.95);if(SET.ultra)GLOW.push([e.px+.55,e.py+.35,24,60,'255,160,70',.35]);
    if(!D3B){const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.save();g.strokeStyle='rgba(255,210,120,.35)';g.setLineDash([6,8]);g.lineWidth=2;g.beginPath();g.ellipse(sx,sy,TWCR*45/1.414,TWCR*22.5/1.414,0,0,6.3);g.stroke();g.restore();g.textAlign='center';g.font='bold 11px Georgia,serif';label('⛺ Il tuo campo',sx,sy-48,'#ffd8a0')}
    else{for(let i=0;i<36;i++){const a=i/36*6.283;box(e.px+Math.cos(a)*TWCR-.04,e.py+Math.sin(a)*TWCR-.04,.4,.08,.08,.8,'#ffd27a',1.3)}}return}
  if(e.k==='twsh'){const u=Math.sin(t*2.4+e.px)*2;box(e.px-.35,e.py-.35,0,.7,.7,6,'#9a968c');box(e.px-.25,e.py-.25,6,.5,.5,4,'#b8b4aa');box(e.px-.1,e.py-.1,14+u,.2,.2,10,'#bfe8ff',1.4);box(e.px-.05,e.py-.05,24+u,.1,.1,4,'#ffffff',1.5);
    nlight(e.px,e.py,30,120,'190,230,255',.8);if(!D3B){const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.textAlign='center';g.font='bold 11px Georgia,serif';label('✧ Santuario',sx,sy-46,'#cfefff')}return}
  _ent717(e);
  if(e.ally&&e.k==='npc'&&!D3B&&e.mx){const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.fillStyle='#000a';g.fillRect(sx-14,sy-46,28,4);g.fillStyle='#5ab0ff';g.fillRect(sx-14,sy-46,28*Math.max(0,e.hp/e.mx),4)}
  if(e===P&&OW.tp&&!D3B){const k=Math.min(1,OW.tp.t/1.5),sx=PX(P.px,P.py),sy=PY(P.px,P.py,0);g.save();g.globalCompositeOperation='lighter';const gr=g.createLinearGradient(0,sy-260,0,sy);gr.addColorStop(0,'rgba(190,220,255,0)');gr.addColorStop(1,`rgba(190,220,255,${.55*k})`);g.fillStyle=gr;g.fillRect(sx-22-k*10,sy-260,44+k*20,260);g.restore()}
  if(e===P&&OW.tp&&D3B){const k=Math.min(1,OW.tp.t/1.5);box(P.px-.18,P.py-.18,0,.36,.36,60+k*140,'#cfe6ff',1.5)}};
// le barre della vita dei soldati anche in 3D
if(typeof d3Overlay==='function'){const _d3o717=d3Overlay;d3Overlay=function(){_d3o717();if(!OW.bat)return;for(const a of OW.bat.al){if(!ents.includes(a))continue;const q=d3Proj(a.px,a.py,46);if(!q||q[2]>40)continue;g.fillStyle='#000a';g.fillRect(q[0]-14,q[1],28,4);g.fillStyle='#5ab0ff';g.fillRect(q[0]-14,q[1],28*Math.max(0,a.hp/a.mx),4)}}}
// il pulsante del campo e delle gemme nell'interfaccia
document.body.insertAdjacentHTML('beforeend',`<div id="twbtns"><button class="hbtn" onclick="twCampTry()" title="Accampati (T)" aria-label="Accampati">⛺</button><button class="hbtn" onclick="PM==='twgem'?cl():pn('twgem')" title="Gemme del teletrasporto (G)" aria-label="Gemme del teletrasporto">💎</button></div>`);
const _hud717=hud;hud=function(){_hud717();const b=$('twbtns');if(b)b.style.display=twOn()?'flex':'none'};
document.head.insertAdjacentHTML('beforeend',`<style>
#twbtns{position:fixed;z-index:30;right:242px;top:calc(10px + env(safe-area-inset-top,0px));display:none;gap:6px}#twbtns .hbtn{position:static;font-size:19px}
body:not(.ig) #twbtns,body.film #twbtns{display:none!important}
@media (max-width:700px){#twbtns{right:10px;top:auto;bottom:calc(150px + env(safe-area-inset-bottom,0px));flex-direction:column}}
#twbat{position:fixed;z-index:31;left:50%;transform:translateX(-50%);top:calc(56px + env(safe-area-inset-top,0px));min-width:min(420px,86vw);display:none;text-align:center;padding:9px 14px 8px;border-radius:10px;
  background:linear-gradient(180deg,rgba(60,14,10,.92),rgba(24,10,14,.92));border:1px solid #ff8a5a88;box-shadow:0 8px 24px #000a;color:#ffe8d0;font-family:Georgia,serif}
#twbat b{display:block;font-size:16px;color:#ffd08a;letter-spacing:.5px}#twbat span{font-size:13px}#twbat small{display:block;opacity:.8;margin-top:3px}
.twbb{height:8px;border-radius:4px;background:#ffffff22;margin-top:6px;overflow:hidden}.twbb i{display:block;height:100%;background:linear-gradient(90deg,#3a8aff,#9ad0ff)}
body:not(.ig) #twbat{display:none!important}
.twgm{display:flex;align-items:center;gap:10px;padding:8px 10px;margin:6px 0;border-radius:9px;border:1px solid #b88aff55;background:linear-gradient(160deg,rgba(60,30,90,.35),rgba(20,20,40,.3))}
.twgm .gi{font-size:24px}.twgm span:nth-child(2){flex:1;display:flex;flex-direction:column}.twgm small{opacity:.8}.twgb{border-color:#b88aff88!important}
</style>`);
