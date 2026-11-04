/* ================= 7.16: TOMORROW — IL MONDO SENZA CONFINI =================
   La modalità che nella 7.14 si chiamava «Mondo aperto» diventa Tomorrow e ha una terra tutta nuova, che non finisce mai.
   - Il mondo è fatto di regioni di 64×64 caselle, generate da un seme mentre cammini: arrivi al bordo e sei nella regione
     accanto. Il seme è dell'eroe (da soli) o della stanza (con il codice stanza: tutti nello stesso mondo).
   - Il terreno è una funzione delle coordinate del mondo: fiumi, laghi, boschi, dune e pareti di roccia continuano da una
     regione all'altra senza cuciture, e i sentieri si incontrano sempre sul bordo comune.
   - Cinque biomi (prati, boschi, deserti, vette innevate, lande di cenere) disegnati con gli stessi alberi, rocce, cactus,
     abeti e cristalli della 7.12.
   - Villaggi con case, abitanti, mercante, fabbro, guaritrice, locanda e la Bacheca dei Contratti; dungeon con nome, tema,
     piani, mostri e boss propri; accampamenti con un Campione, rovine con un forziere, raccolte del bioma.
   - I mostri non si ripetono: ogni regione ha le sue specie, varianti di quelle del regno con colori, taglia, forza, velocità
     e nome diversi («Lupo delle Ceneri», «Scheletro d'Ambra»...); i boss dei dungeon hanno un nome proprio e abilità mescolate.
   - Più ti allontani dal villaggio di partenza, più il livello sale, senza un limite: mostri più forti, bottino migliore.
   - I contratti sono fatti da zero per questo mondo: sei fazioni nuove, otto tipi (anche messaggi da portare ad altri villaggi
     ed esplorazioni di regioni lontane), con la direzione da prendere scritta in ogni tappa.
   - Mappa del mondo (tasto M): le regioni intorno con biomi, villaggi, dungeon e i luoghi dei contratti.
   - In 3D l'orizzonte mostra il mondo vero: le regioni vicine che vedi in lontananza sono quelle in cui puoi camminare. */
const TWR=96;   // 7.17: regioni più grandi (prima 64×64)
const twOn=()=>!!(OW.on&&MODE==='story'&&P&&P.tw);
function twFix(o){o=o&&typeof o==='object'?o:{};o.seed=o.seed||((Math.random()*2147483647)|0)||7;o.home=o.home||'tw:0,0';o.at=o.at||o.home;o.vis=o.vis&&typeof o.vis==='object'?o.vis:{};o.ch=Array.isArray(o.ch)?o.ch.slice(-3000):[];return o}
const twSeed=()=>NET.code?hs('tw|'+NET.code):(P&&P.tw?P.tw.seed:1);
const twK=(rx,ry)=>'tw:'+rx+','+ry;
const twP=k=>{const m=/^tw:(-?\d+),(-?\d+)$/.exec(String(k||''));return m?[+m[1],+m[2]]:null};
const twHs=(...a)=>hs(twSeed()+'|'+a.join('|'));
const twRnd=(...a)=>sd(twHs(...a));
// rumore morbido con il seme del mondo
const twI=(x,y,s)=>{let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s+twSeed(),2246822519);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
function twV(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,sm=v=>v*v*(3-2*v),a=twI(xi,yi,s),b=twI(xi+1,yi,s),c=twI(xi,yi+1,s),d=twI(xi+1,yi+1,s),u=sm(fx),v=sm(fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const twF=(x,y,s)=>twV(x,y,s)*.6+twV(x*2.1,y*2.1,s+1)*.28+twV(x*4.3,y*4.3,s+2)*.12;

/* ---- biomi, livello, luoghi ---- */
const TWBT={prato:'forest',bosco:'forest',deserto:'desert',neve:'peaks',cenere:'peaks'};
const TWBN={prato:'Prati',bosco:'Boschi',deserto:'Dune',neve:'Vette',cenere:'Lande di cenere'};
function twBio(rx,ry){if(!rx&&!ry)return'prato';const T=twF(rx/5.5,ry/5.5,11),Wt=twF(rx/4.5,ry/4.5,23),dd=Math.hypot(rx,ry);
  if(dd>3.5&&twF(rx/3.2,ry/3.2,41)>.68)return'cenere';if(T<.36)return'neve';if(T>.62&&Wt<.52)return'deserto';if(Wt>.53)return'bosco';return'prato'}
const twLv=(rx,ry)=>1+Math.floor(Math.hypot(rx,ry)*1.25);
// le città: la prima a due regioni dalla partenza, poi rare; i villaggi più spessi. Una città conta anche come villaggio.
let TWC1=null,TWC1S=null;const twCity1=()=>{const s=twSeed();if(TWC1S===s)return TWC1;let b=null,bh=2;for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){if(Math.max(Math.abs(x),Math.abs(y))!==2)continue;const h=twI(x,y,107);if(h<bh){bh=h;b=[x,y]}}TWC1S=s;return TWC1=b};
const twCity=(rx,ry)=>{const c=twCity1();if(c&&c[0]===rx&&c[1]===ry)return true;return Math.max(Math.abs(rx),Math.abs(ry))>=4&&twI(rx,ry,109)<.05};
const twVil=(rx,ry)=>(!rx&&!ry)||twCity(rx,ry)||(Math.max(Math.abs(rx),Math.abs(ry))>=2&&twI(rx,ry,101)<.13);
const twDun=(rx,ry)=>!twVil(rx,ry)&&((rx===1&&ry===0)||twI(rx,ry,103)<.38);
const twEnc=n=>n<0?'m'+(-n):''+n,twDec=s=>s[0]==='m'?-(+s.slice(1)):+s;
const twDid=(rx,ry)=>'twd_'+twEnc(rx)+'_'+twEnc(ry);
// nomi: villaggi in stile italiano, luoghi selvaggi e nomi propri antichi
const TWV1=['Rocca','Val','Borgo','Castel','Pian','Fonte','Sasso','Torre','Poggio','Monte','Villa','Colle','Porto','Ponte','Pietra','Selva'];
const TWV2=['fosca','lupo','bianca','nera','verde','santa','alta','mira','luce','vento','ferro','rosa','serena','grigia','dorata','antica','chiara','lunga'];
const TWP1=['Vel','Mor','Ast','Kael','Ith','Sar','Or','Lum','Drav','Nyx','Thal','Er','Zan','Cor','Vey','Aur','Gal','Sil','Ark','Bel','Dun','Fen','Hal','Mir'];
const TWP2=['a','e','i','o','ae','ia','u','','ar','en'];const TWP3=['ris','dan','thil','gor','wyn','mir','vane','nar','kesh','lith','dor','rax','mund','sel','mora','thas'];
const twProp=r=>{const p=TWP1[Math.floor(r()*TWP1.length)]+TWP2[Math.floor(r()*TWP2.length)]+TWP3[Math.floor(r()*TWP3.length)];return p[0].toUpperCase()+p.slice(1)};
const twVilName=(rx,ry)=>{const r=twRnd('vn',rx,ry),a=TWV1[Math.floor(r()*TWV1.length)],b=TWV2[Math.floor(r()*TWV2.length)];return r()<.5?a+b:a+' '+b[0].toUpperCase()+b.slice(1)};
function twName(rx,ry){if(twVil(rx,ry))return twVilName(rx,ry);const r=twRnd('rn',rx,ry),b=twBio(rx,ry);return TWBN[b]+' di '+twProp(r)}

/* ---- le specie: varianti dei mostri del regno, con colori, taglia, forza e nome propri ---- */
const TWEP=['delle Ceneri','di Brina','del Vespro','delle Paludi','di Ossidiana','dei Rovi','della Notte','di Sangue','delle Rovine','del Vento','d\'Ambra','di Pietra','del Crepuscolo','dei Cristalli','delle Maree','del Sole Nero','di Ruggine','dell\'Abisso','delle Lucciole','di Cenere Viva','del Tuono','delle Nebbie','di Giada','del Lutto'];
const TWBP={prato:['slime','lupo','goblin','arciere','ratto','bandito','cavalcalupi'],bosco:['lupo','goblin','ragno','bandito','spettro','sciamano_goblin','ghoul','slime','arciere'],
  deserto:['scorpione','sciacallo','mummia','scarabeo','scorpione_reale','anubi','sacerdote','bandito'],neve:['lupo_gelo','yeti','elem_ghiaccio','golem_cr','ragno','spettro'],cenere:['imp','golem_magma','demone','ombra','ghoul','cavaliere','mago']};
const TWTP={cave:{en:['goblin','arciere','ratto','sciamano_goblin','cavalcalupi','ragno','pipistrello'],bo:['troll','re_goblin']},crypt:{en:['scheletro','zombie','pipistrello','banshee','cavaliere_ossa','spettro','ghoul'],bo:['necromante']},
  pyr:{en:['mummia','scarabeo','sacerdote','anubi','scorpione_reale'],bo:['faraone','sfinge']},ice:{en:['golem_cr','ragno','elem_ghiaccio','lupo_gelo','yeti'],bo:['drago_brina','regina']},
  fire:{en:['imp','golem_magma','demone','ombra'],bo:['ignis']},sea:{en:['uomo_pesce','medusa','granchio'],bo:['leviatano']},void:{en:['cavaliere','ombra','mago','spettro'],bo:['necromante','ignis']}};
const TWBT2={troll:'Troll',re_goblin:'Re dei Goblin',necromante:'Necromante',faraone:'Faraone',sfinge:'Sfinge',drago_brina:'Drago',regina:'Regina dei Ragni',ignis:'Signore della Fiamma',leviatano:'Leviatano'};
const TWAB=['charge','slam2','rain','nova','teleport','heal','shield'];
// i colori: spostati di tinta, saturazione e luce (i grigi e i colori quasi bianchi o neri cambiano poco: occhi e denti restano tali)
function twCol(c,dh,ks,kl){if(typeof c!=='string'||c[0]!=='#')return c;let s=c.slice(1);if(s.length<6)s=s[0]+s[0]+s[1]+s[1]+s[2]+s[2];const n=parseInt(s.slice(0,6),16);if(n!==n)return c;
  let r=(n>>16)/255,g=(n>>8&255)/255,b=(n&255)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;if(d<.06||l>.93||l<.07)return c;
  let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=h*60;let sat=d/(1-Math.abs(2*l-1));h=(h+dh+360)%360;sat=clamp(sat*ks,0,1);const L=clamp(l*kl,.04,.92);
  const C=(1-Math.abs(2*L-1))*sat,X=C*(1-Math.abs((h/60)%2-1)),m=L-C/2;let rr=0,gg=0,bb=0;if(h<60)[rr,gg,bb]=[C,X,0];else if(h<120)[rr,gg,bb]=[X,C,0];else if(h<180)[rr,gg,bb]=[0,C,X];else if(h<240)[rr,gg,bb]=[0,X,C];else if(h<300)[rr,gg,bb]=[X,0,C];else[rr,gg,bb]=[C,0,X];
  const hx=v=>Math.round((v+m)*255).toString(16).padStart(2,'0');return'#'+hx(rr)+hx(gg)+hx(bb)}
function twModel(L,dh,ks,kl,sc){if(!L||!L.length)return L;const R=L.map(b=>{const o=b.slice();if(sc!==1)for(let i=0;i<6;i++)o[i]*=sc;o[6]=twCol(b[6],dh,ks,kl);return o});
  for(const k of Object.keys(L))if(isNaN(+k))R[k]=L[k];if(L.top)R.top=L.top*sc;return R}
// il livello «di casa» di ogni mostro del regno: le varianti vengono riportate al livello 0, poi la regione le fa crescere
let TWNL=null;function twNL(t){if(!TWNL){TWNL={};const add=(q,l)=>{if(q&&(TWNL[q]==null||l<TWNL[q]))TWNL[q]=l};
    for(const k in Z){const z=Z[k];if(z&&!z.tw&&Array.isArray(z.en)&&z.lv!=null){for(const q of z.en)add(q,z.lv);if(z.boss)add(z.boss,z.lv)}}
    for(const id in DG){const d=DG[id];if(!d||d.tw)continue;for(const q of d.en||[])add(q,d.lv);if(d.boss)add(d.boss,d.lv+(d.fls||1)-1)}
    for(const k in OWEN)for(const q of OWEN[k])add(q,(Z[k]&&Z[k].lv)||3)}return TWNL[t]!=null?TWNL[t]:4}
function twType(key){if(E[key])return E[key];const m=/^tw\.([a-z_]+)\.([a-z0-9]+)$/.exec(String(key||''));if(!m||!E[m[1]])return null;const B=E[m[1]],rn=sd(hs('twt|'+key)),boss=!!B.boss;
  const dh=rn()<.25?(rn()-.5)*40:(rn()-.5)*300,ks=.7+rn()*.7,kl=.78+rn()*.4,sc=boss?1+rn()*.25:.82+rn()*.5,kh=.8+rn()*.75,ka=.85+rn()*.5,kp=.85+rn()*.4;
  const nl=twNL(m[1]);const o=Object.assign({},B,{tw:1,base:m[1],hp:Math.max(8,Math.round(B.hp/(1+nl*.15)*kh*(.9+sc*.12))),at:+Math.max(2,B.at/(1+nl*.1)*ka).toFixed(2),sp:+(B.sp*kp).toFixed(2),cd:+(B.cd*(.85+rn()*.3)).toFixed(2),m:twModel(B.m,dh,ks,kl,sc)});
  o.xp=Math.max(3,Math.round(B.xp/(1+nl*.3)*Math.sqrt(kh*ka)*(kp>1.1?1.1:1)));
  if(!boss&&B.r<3&&rn()<.14){o.r=4.5;o.rng=twCol(B.rng||'#ffb04a',dh,1,1.1);o.cd=Math.max(1.5,o.cd*1.4)}
  if(boss){const r2=sd(hs('twb|'+key));o.n=(TWBT2[m[1]]||B.n.split(' ')[0])+' '+twProp(r2);const L=(BAB[m[1]]||['nova','slam2']).filter(a=>!a.startsWith('summon')),ex=TWAB.filter(a=>!L.includes(a));
    const ab=L.slice(0,2).concat([ex[Math.floor(r2()*ex.length)]]);if(r2()<.6)ab.push('summon:'+(B.sum||'goblin'));BAB[key]=ab;o.slam=B.slam||(r2()<.5?1:0)}
  else o.n=B.n+' '+TWEP[Math.floor(rn()*TWEP.length)];
  E[key]=o;return o}
const twKey=(base,...salt)=>'tw.'+base+'.'+(twHs('sp',base,...salt)%1679616).toString(36);
function twSpecies(rx,ry){const b=twBio(rx,ry),L=TWBP[b].filter(t=>E[t]),r=twRnd('spl',rx,ry),out=[];const lv=twLv(rx,ry);
  // le specie si ripetono solo in zone vicine (stessa macchia del bioma): così una specie si incontra di rado, e non ovunque
  const gx=Math.floor(rx/2),gy=Math.floor(ry/2);
  for(let i=0;i<3+(lv>10?1:0);i++){const base=L[Math.floor(r()*L.length)];const k=twKey(base,gx,gy,i);if(!out.includes(k)){twType(k);out.push(k)}}
  // ogni tanto un ospite di un altro bioma
  if(r()<.25){const ob=Object.keys(TWBP)[Math.floor(r()*5)],L2=TWBP[ob].filter(t=>E[t]),k=twKey(L2[Math.floor(r()*L2.length)],rx,ry,'o');twType(k);out.push(k)}
  return out}

/* ---- le zone: una regione o un piano di dungeon, create quando servono ---- */
function twZ(k){if(Z[k])return Z[k];const p=twP(k);if(!p)return null;const[rx,ry]=p,bio=twBio(rx,ry),th=TWBT[bio],base=Z[th],lv=twLv(rx,ry),vil=twVil(rx,ry);
  const city=twCity(rx,ry);const z={n:twName(rx,ry),lv,N:TWR,th,a:base.a,b:base.b,o:base.o,bg:base.bg,en:twSpecies(rx,ry),c:city?14:vil?22:Math.min(72,40+(lv>>1)),city,mus:vil?'town':base.mus,pt:bio==='cenere'?'ember':bio==='prato'?'petal':base.pt,tw:1,rx,ry,bio,vil};
  Z[k]=z;SKY[k]=SKY[th]||SKY.forest;return z}
function twDG(id){if(DG[id])return DG[id];const m=/^twd_(m?\d+)_(m?\d+)$/.exec(String(id||''));if(!m)return null;const rx=twDec(m[1]),ry=twDec(m[2]),rn=twRnd('dg',rx,ry),bio=twBio(rx,ry),lv=twLv(rx,ry)+1;
  const TH2={prato:['cave','crypt','cave'],bosco:['cave','crypt','sea'],deserto:['pyr','crypt','pyr'],neve:['ice','cave','ice'],cenere:['fire','void','fire']}[bio],th=TH2[Math.floor(rn()*TH2.length)];
  const P2=TWTP[th],pr=twProp(rn),nm={cave:'Grotte di ',crypt:'Cripta di ',pyr:'Tomba di ',ice:'Caverne di ',fire:'Forgia di ',sea:'Grotta sommersa di ',void:'Abisso di '}[th]+pr;
  const en=[];for(let i=0;i<4;i++){const b=P2.en.filter(t=>E[t]);const k=twKey(b[Math.floor(rn()*b.length)],'d',rx,ry,i);if(!en.includes(k)){twType(k);en.push(k)}}
  const bb=P2.bo.filter(t=>E[t]),bk=twKey(bb[Math.floor(rn()*bb.length)],'b',rx,ry);const bo=twType(bk);if(bo){bo.sum=en[0];const ab=BAB[bk];if(ab)BAB[bk]=ab.map(a=>a.startsWith('summon')?'summon:'+en[0]:a)}
  twZ(twK(rx,ry));DG[id]={n:nm,lv,fls:clamp(2+Math.floor(lv/9)+(rn()<.3?1:0),2,5),en,boss:bk,th,ent:twK(rx,ry),fin:1,tw:1};return DG[id]}
const _zd716=zd;zd=function(k){if(typeof k==='string'){if(k.startsWith('tw:'))twZ(k);else if(k.startsWith('twd_'))twDG(k.split('@')[0])}return _zd716(k)};
const _zname716=zname;zname=function(k){if(typeof k==='string'){if(k.startsWith('tw:'))twZ(k);else if(k.startsWith('twd_'))twDG(k.split('@')[0])}return _zname716(k)};
// i cicli dei dungeon di Tomorrow restano sull'eroe anche in stanza (il server conosce solo i dungeon del regno)
const _getRun716=getRun;getRun=function(id){if(String(id).startsWith('twd_'))return(P&&P.runs&&P.runs[id])||0;return _getRun716(id)};
const _dungeonClear716=dungeonClear;dungeonClear=function(e){const id=ZZ&&ZZ.dg,run=ZZ&&ZZ.run;_dungeonClear716(e);if(String(id).startsWith('twd_')&&P)P.runs[id]=(run|0)+1};
OW.enOf=k=>{const z=String(k).startsWith('tw:')?twZ(k):null;return z?z.en:null};

/* ---- il terreno: una funzione delle coordinate del mondo, uguale da una regione all'altra ---- */
const twH2=(x,y)=>twI(x*7+3,y*13+5,77);
// restituisce [tipo di casella, codice]: 0 terreno (codice = terreno), 1 albero o roccia, 2 acqua, 6 arredo
function twBase(wx,wy,bio){const riv=Math.abs(twV(wx/80,wy/80,3)-.5),lake=twF(wx/30,wy/30,5),d=twV(wx/9,wy/9,7)*.66+twV(wx/3.5,wy/3.5,8)*.34,r=twV(wx/5,wy/5,9),h=twH2(wx,wy);
  if(bio!=='deserto'&&bio!=='cenere'&&(riv<.018||lake<.19))return[2,''];
  if(bio==='deserto'&&lake<.13)return[2,''];
  switch(bio){
    case 'bosco':if(d>.5&&h<.84)return[1,r>.62?'P':r<.3?'B':h<.04?'R':'O'];if(d>.44&&h<.25)return[1,'U'];if(h>.995)return[6,'u'];return[0,d>.42?'3':r>.6?'2':''];
    case 'prato':if(d>.67&&h<.72)return[1,r>.6?'B':'O'];if(h<.012)return[1,h<.006?'R':'U'];if(h>.993)return[6,h>.997?'l':'u'];return[0,r>.64?'2':''];
    case 'deserto':if(lake<.18)return h<.3?[1,'X']:[0,'6'];if(d>.69&&h<.8)return[1,'M'];if(h<.022)return[1,h<.012?'Q':'J'];if(r>.62&&h>.985)return[6,'d'];return[0,r>.56?'2':r<.3?'3':''];
    case 'neve':if(d>.66)return[1,h<.85?'N':'K'];if(r>.56&&h<.5)return[1,h<.44?'F':'Y'];if(h<.012)return[1,h<.004?'G':'K'];return[0,r<.3?'7':''];
    case 'cenere':if(d>.63&&h<.82)return[1,'K'];if(h<.01)return[6,'v'];return[0,r>.48?'9':'8']}
  return[0,'']}
const twEdgeY=(rx,ry)=>6+twHs('ey',rx,ry)%(TWR-12),twEdgeX=(rx,ry)=>6+twHs('ex',rx,ry)%(TWR-12);

/* ---- la regione ---- */
const TWRES={prato:['lunare','mela','legna'],bosco:['lunare','legna'],deserto:['scarab'],neve:['ghiaccio'],cenere:['scarab']};
function twGen(z){const n=N,rx=z.rx,ry=z.ry,bio=z.bio,rnd=twRnd('reg',rx,ry),rr=(a,b)=>a+Math.floor(rnd()*(b-a+1));BM=grid(-1);TB=[];RDF=new Set();const RS=new Uint8Array(n*n);
  const ok=(x,y)=>x>=0&&y>=0&&x<n&&y<n,res=(x,y)=>{if(ok(x,y))RS[y*n+x]=1};
  const F=(x,y,c)=>{if(ok(x,y)){M[y][x]=0;DEC[y][x]=c?DN+c:'';res(x,y)}},W=(x,y,c,f)=>{if(ok(x,y)){M[y][x]=1;DEC[y][x]=DN+c+(f||'');res(x,y)}},
    Pp=(x,y,c,f)=>{if(ok(x,y)){M[y][x]=6;DEC[y][x]=DN+c+(f||'');res(x,y)}},Wa=(x,y)=>{if(ok(x,y)){M[y][x]=2;DEC[y][x]='';res(x,y)}};
  const disc=(cx,cy,r,fn)=>{for(let y=Math.floor(cy-r-1);y<=cy+r+1;y++)for(let x=Math.floor(cx-r-1);x<=cx+r+1;x++){const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<=r&&ok(x,y))fn(x,y,d)}};
  // 1. il terreno del mondo
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const[m,c]=twBase(rx*n+x,ry*n+y,bio);M[y][x]=m;DEC[y][x]=m===2?'':m===0?(c?DN+c:''):DN+c+(bio==='cenere'?'8':'')}
  // 2. i sentieri: dal centro della regione ai quattro punti di passaggio, gli stessi delle regioni accanto
  const hub=[rr(38,58),rr(38,58)],ends=[[n-1,twEdgeY(rx,ry)],[0,twEdgeY(rx-1,ry)],[twEdgeX(rx,ry),n-1],[twEdgeX(rx,ry-1),0]];
  const trail=(a,b,w)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1])||1,st=Math.ceil(d*3);for(let s=0;s<=st;s++){const u=s/st,wob=(twV((a[0]+u*(b[0]-a[0])+rx*n)/7,(a[1]+u*(b[1]-a[1])+ry*n)/7,13)-.5)*5*Math.sin(u*Math.PI),
      x=a[0]+(b[0]-a[0])*u-(b[1]-a[1])/d*wob,y=a[1]+(b[1]-a[1])*u+(b[0]-a[0])/d*wob;for(let j=0;j<w;j++)for(let i=0;i<w;i++){const X=clamp(Math.floor(x)+i-(w>>1),0,n-1),Y=clamp(Math.floor(y)+j-(w>>1),0,n-1);
        if(M[Y][X]===2){M[Y][X]=4;DEC[Y][X]='~';res(X,Y)}else if(M[Y][X]!==4&&M[Y][X]!==3){M[Y][X]=0;DEC[Y][X]=DN+'1';res(X,Y)}}}};
  for(const e of ends){trail(hub,e,2);for(let k=-1;k<=1;k++){const X=e[0]===0||e[0]===n-1?e[0]:clamp(e[0]+k,0,n-1),Y=e[1]===0||e[1]===n-1?e[1]:clamp(e[1]+k,0,n-1);if(M[Y][X]!==4){M[Y][X]=0;DEC[Y][X]=DN+'1'}}}
  const tg=[];let sp=hub.slice();
  // 3. i luoghi
  const CX={F,W,Pp,Wa,disc,rnd,rr,n,hub,rx,ry,bio,tg,ok,res,RS,z,trail};
  if(z.city)sp=twCityGen(CX);else if(z.vil)sp=twVillage(CX);
  else if(typeof twSetGen==='function'&&twSetAt(rx,ry))sp=twSetGen(CX,ends);
  else if(typeof twHamlet==='function')sp=twHamlet(CX,ends);
  else{disc(hub[0]+.5,hub[1]+.5,2.2,(x,y)=>{if(M[y][x]!==4)F(x,y,'1')})}
  // 7.42: accampamenti e rovine non nascono dentro la propria città (prima ne bucavano le mura); le raccolte sì, ma mai sulle mura
  const sh0=z.set?(z.shub||hub):null,shR=sh0?(typeof sedR==='function'&&P.tw&&P.tw.set&&P.tw.set.lay&&P.tw.set.lay.v?sedR():8+((P.tw&&P.tw.set&&P.tw.set.lv)|0)*3)+6:0;
  const sc6=n/64,spot=(minD,maxD,inCity)=>{minD*=sc6;maxD*=sc6;if(z.city)minD=Math.max(minD,34);for(let k=0;k<200;k++){const a=rnd()*6.283,d=minD+rnd()*(maxD-minD),x=Math.round(hub[0]+Math.cos(a)*d),y=Math.round(hub[1]+Math.sin(a)*d);if(x>4&&y>4&&x<n-5&&y<n-5&&!RS[y*n+x]&&M[y][x]!==2&&M[y][x]!==3&&!(sh0&&M[y][x]===1&&DEC[y][x]===DN+'W')&&(inCity||!sh0||Math.hypot(x-sh0[0],y-sh0[1])>shR))return[x,y]}return null};
  if(twDun(rx,ry)){const q=spot(12,24,1);if(q){const[x,y]=q,id=twDid(rx,ry);twDG(id);disc(x+.5,y+.5,2.6,(u,v)=>{if(M[v][u]!==3)F(u,v,bio==='deserto'?'4':bio==='cenere'?'9':'4')});
      for(let i=0;i<8;i++){const a=i/8*6.283,u=Math.round(x+Math.cos(a)*3.4),v=Math.round(y+Math.sin(a)*3.4);if(ok(u,v)&&i%2&&M[v][u]!==3)W(u,v,'W',bio==='cenere'?'9':'')}
      ents.push(po(x,y,id+'@1',{st:'dun'}));tg.push([x,y])}}
  const C2=[];
  for(let ci=0;ci<(z.vil?0:rr(1,2));ci++){const q=spot(10,26);if(q){const[x,y]=q;disc(x+.5,y+.5,4,(u,v,d)=>{if(M[v][u]!==3)F(u,v,d<2?'6':'')});Pp(x,y,'f');for(const[u,v]of[[x-2,y-1],[x+2,y+1],[x,y-3]])if(ok(u,v)&&M[v][u]===0)Pp(u,v,'t');
      C2.push([x,y+2,1]);tg.push([x,y+2]);(z.camps=z.camps||[]).push([x,y])}}
  for(let ri2=0;ri2<(rnd()<.5?2:1);ri2++){const q=spot(8,28);if(q){const[x,y]=q;disc(x+.5,y+.5,3.2,(u,v,d)=>{if(M[v][u]===3)return;if(d>2.3&&hh(u*7,v*3)>.3)W(u,v,'W',bio==='cenere'?'9':'');else F(u,v,'4')});C2.push([x,y,1]);tg.push([x,y])}}
  // raccolte del bioma
  const RL=TWRES[bio]||[];for(let i=0;i<(RL.length?rr(5,9):0);i++){const q=spot(5,28,1);if(!q)continue;const r=RL[Math.floor(rnd()*RL.length)];F(q[0],q[1],'');ents.push({k:'res',r,n:RESN[r],px:q[0]+.5,py:q[1]+.5});tg.push(q)}
  if(typeof twGenExtra==='function')twGenExtra(CX,spot,C2);
  for(let i=0;i<rr(3,6);i++){const q=spot(6,30,1);if(q){F(q[0],q[1],'');C2.push([q[0],q[1],0]);tg.push(q)}}
  // 4. tutto raggiungibile: un varco verso ciò che resta chiuso fra alberi e rocce
  for(const e of ents)if(e.k==='po')tg.push([e.px|0,e.py|0]);// anche le porte delle case
  const NB=[[1,0],[-1,0],[0,1],[0,-1]];let d=bfs(sp[0],sp[1]);z.carved=[];
  for(const[x0,y0]of tg.concat(ends)){if(d[y0*n+x0]>=0)continue;const pr=new Int32Array(n*n).fill(-2),q=[y0*n+x0];pr[q[0]]=-1;let hit=-1;
    for(let i=0;i<q.length&&hit<0;i++){const c=q[i],x=c%n,y=c/n|0;for(const[a,b]of NB){const u=x+a,v=y+b;if(u<0||v<0||u>=n||v>=n||pr[v*n+u]!==-2||M[v][u]===3)continue;pr[v*n+u]=c;if(d[v*n+u]>=0){hit=v*n+u;break}q.push(v*n+u)}}
    if(hit<0)continue;(z.carved=z.carved||[]).push([x0,y0]);for(let c=hit;c>=0;c=pr[c]){const x=c%n,y=c/n|0;if(M[y][x]===1||M[y][x]===6){M[y][x]=0;DEC[y][x]=DN+'1'}else if(M[y][x]===2){M[y][x]=4;DEC[y][x]='~'}}d=bfs(sp[0],sp[1])}
  // 5. forzieri (quelli già aperti non tornano), nemici lontani dal villaggio, un Campione nell'accampamento
  const opened=new Set(P.tw.ch);for(const[x,y,rich]of C2){const key=Zk+':'+x+','+y;if(WK(M[y][x])&&!opened.has(key))ents.push({k:'ch',px:x+.5,py:y+.5,rich,twk:key})}
  const far=[],safe=z.city?40:z.vil?26:z.ham?14:8;for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(WK(M[y][x])&&d[y*n+x]>safe&&!ents.some(e=>Math.abs(e.px-x-.5)<1.5&&Math.abs(e.py-y-.5)<1.5))far.push([x,y]);
  for(let i=far.length-1;i>0;i--){const j=ri(0,i);[far[i],far[j]]=[far[j],far[i]]}
  for(let i=0;i<z.c&&far.length;i++){const[x,y]=far.pop();ents.push(mk(z.en[Math.floor(R()*z.en.length)],x,y))}
  for(const cp of z.camps||[]){const[x,y]=cp;for(let i=0;i<3;i++){const[u,v]=nearFree(x+(i-1)*2,y+1);const e=mk(z.en[i%z.en.length],u,v);if(i===0)eliteMk(e);ents.push(e)}}
  return sp}
// gli abitanti dei villaggi: nome, mestiere e colori sempre uguali per lo stesso villaggio
const TWNM=['Arnaldo','Bice','Corrado','Delia','Ettore','Fosca','Guido','Ilaria','Lapo','Mirella','Nando','Ofelia','Piero','Rosa','Sandro','Tecla','Ugo','Vanna','Zeno','Adelmo','Gemma','Ilario','Noemi','Ruggero','Agata','Bruno','Celsa','Dino','Elsa','Fulvio','Gilda','Lino','Marta','Nilo','Orsola','Primo'];
const TWROLE={gem:['Custode delle Gemme','Custode delle Gemme','gem'],gua2:['Guardia','Guardia',''],anz:['Anziano','Anziana',''],mer:['Mercante','Mercante','shop'],fab:['Fabbro','Fabbra','smith'],gua:['Guaritore','Guaritrice','heal'],ost:['Oste','Ostessa','inn'],alc:['Erborista','Erborista','alch'],pae:['','','']};
const twNpcId=(rx,ry,i)=>'tv_'+twEnc(rx)+'_'+twEnc(ry)+'_'+i;
function twNpc(id){if(NPCS[id])return NPCS[id];const m=/^tv_(m?\d+)_(m?\d+)_(\d+)$/.exec(id);if(!m)return null;const rx=twDec(m[1]),ry=twDec(m[2]),i=+m[3],r=twRnd('npc',rx,ry,i);
  const rk=['anz','mer','fab','gua','ost','alc','pae','pae','pae','gem','gua2','gua2','gua2','gua2'][i]||'pae',nm=TWNM[(twHs('vnm',rx,ry)+i*7)%TWNM.length],fem=/a$|e$/.test(nm)&&!['Ettore','Dante','Sandro'].includes(nm),R2=TWROLE[rk];
  const ttl=R2[fem?1:0],vn=twVilName(rx,ry),near=[];for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(twDun(rx+dx,ry+dy))near.push([dx,dy]);
  const q=near.length?near[Math.floor(r()*near.length)]:null,dn=q?twDG(twDid(rx+q[0],ry+q[1])):null;
  const ln=[`Benvenuto a ${vn}. Qui la terra è nuova: nessuno sa davvero cosa c'è oltre le colline.`,dn?`Dicono che ${twDir(q[0],q[1])} ci sia ${dn.n}. Chi ci è sceso è tornato con meno amici e più oro.`:'Le strade si incontrano sempre al confine tra due terre: seguile, e non ti perderai.',
    `Più ti allontani da qui, più le bestie si fanno grosse. Ma anche quello che portano addosso vale di più.`,`Alla bacheca c'è sempre lavoro: qualcuno paga per ogni guaio di questa terra.`];
  const c=['#7a5a3a','#3a5a8a','#8a3a3a','#4a7a3a','#6a4a7a','#a8632f','#5a6a7a','#8a7a4a'][Math.floor(r()*8)],hat=['#333333','#7a3a2a','#d4af37','#3a3a5a','#8a6a2a','#5a2a2a'][Math.floor(r()*6)];
  if(rk==='gua2')ln.splice(0,4,`Le mura di ${vn} hanno retto a tre assedi. Al quarto ci penso io.`,'Tieni la spada nel fodero, in città. Fuori fai quello che vuoi.','Di notte le bestie si avvicinano alle porte: si sentono grattare.');
  if(rk==='gem')ln.splice(0,4,`Una gemma di ${vn} ti riporta qui da qualunque angolo del mondo, tutte le volte che vuoi: basta toccare una Pietra del viaggio.`,'Le gemme si caricano alla luce della nostra fontana: per questo valgono quello che costano.');
  return NPCS[id]={n:(ttl?ttl+' ':'')+nm,role:R2[2]&&R2[2]!=='gem'?R2[2]:undefined,tw2:rk,c:rk==='gua2'?'#5a6a8a':c,hat:rk==='gua2'?'#9aa4b8':hat,ln}}
const TWDIR=[['est','sud-est','sud','sud-ovest','ovest','nord-ovest','nord','nord-est']];
function twDir(dx,dy){if(!dx&&!dy)return'qui';const a=Math.atan2(dy,dx),i=((Math.round(a/(Math.PI/4))%8)+8)%8,d=Math.max(Math.abs(dx),Math.abs(dy));return(d===1?'una regione':d+' regioni')+' a '+TWDIR[0][i]}
const _genWild716=genWild;genWild=function(z){return z&&z.tw?twGen(z):_genWild716(z)};

/* ---- passare da una regione all'altra camminando oltre il bordo ---- */
function twEdge(){if(!twOn()||!P||P.hp<=0||PM||!String(Zk).startsWith('tw:')||OW.tx)return;let dx=0,dy=0;if(P.px<.56)dx=-1;else if(P.px>N-.56)dx=1;else if(P.py<.56)dy=-1;else if(P.py>N-.56)dy=1;if(!dx&&!dy)return;
  const[rx,ry]=twP(Zk),fx=P.px,fy=P.py,nk=twK(rx+dx,ry+dy);OW.tx=1;
  const go=()=>{try{load(nk);let x=dx>0?1.5:dx<0?N-1.5:fx,y=dy>0?1.5:dy<0?N-1.5:fy;let bx=Math.floor(x),by=Math.floor(y);if(!WK(M[by][bx])){const q=nearFree(bx,by);bx=q[0];by=q[1]}
      P.px=bx+.5;P.py=by+.5;P.path=[];P.tg=null;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}finally{OW.tx=0}};
  if(typeof irisGo==='function'&&cineOK())irisGo(go);else go()}
const _upd716=upd;upd=function(dt){_upd716(dt);if(twOn())twEdge()};
// 'town' nel mondo di Tomorrow è il villaggio dove ti risvegli; si ricordano le regioni visitate
const _load716=load;load=function(k,from){if(twOn()&&k==='town'){k=P.tw.home||'tw:0,0';from=undefined}_load716(k,from);
  if(twOn()&&String(Zk).startsWith('tw:')){P.tw.at=Zk;P.tw.vis[Zk]=1;if(ZZ.vil)P.tw.home=Zk;
    for(const C of P.ow.act){const s=owCur(C);if(s&&s.k==='reach'&&s.z===Zk)owNext(C,'Regione raggiunta!')}}};
// i forzieri aperti restano aperti
const _act716=act;act=function(e){if(e&&e.k==='ch'&&e.twk&&twOn()){P.tw.ch.push(e.twk);if(P.tw.ch.length>3000)P.tw.ch.splice(0,500)}_act716(e)};
// le botteghe dei villaggi portano il nome di chi le tiene
const _pn716=pn;pn=function(m,arg){_pn716(m,arg);if(twOn()&&(m==='shop'||m==='smith'||m==='alch')&&PA&&PA.nid&&String(PA.nid).startsWith('tv_')){const h=$('pn')&&$('pn').querySelector('h3');if(h)h.innerHTML=h.innerHTML.replace(/Mercante Ugo|Fucina di Borin|Bottega di Mira/,esc(PA.n))}};

/* ---- i contratti di Tomorrow: fazioni, tipi e tappe nuovi ---- */
Object.assign(OWF,{
  lega:{n:'Lega dei Villaggi',c:'#8ad070',pat:['il Capovillaggio','la Sindaca','l\'Anziano','la Guardiana'],ar:['taglia','assedio','messaggio','infest'],sl:'ws'},
  carto:{n:'Compagnia dei Cartografi',c:'#6ad0ff',pat:['la Cartografa','il Mastro Esploratore','l\'Apprendista'],ar:['esplora','sped','reliq','messaggio'],sl:'hc'},
  fiamma:{n:'Ordine della Fiamma',c:'#ff9a5a',pat:['la Sorella','il Priore','il Custode'],ar:['infest','sped','taglia','assedio'],sl:'cs'},
  strada:{n:'Mercanti di Strada',c:'#ffd84a',pat:['la Carovaniera','il Mercante','la Contabile'],ar:['comm','messaggio','taglia','reliq'],sl:'whcs'},
  custodi:{n:'Custodi delle Rovine',c:'#c88aff',pat:['l\'Archivista','la Studiosa','il Vecchio Custode'],ar:['reliq','sped','esplora'],sl:'hc'},
  clan:{n:'Clan dei Cacciatori',c:'#e0b070',pat:['la Capobranco','il Tracciatore','la Cacciatrice'],ar:['taglia','infest','comm','esplora'],sl:'wh'}});
const TWFK=['lega','carto','fiamma','strada','custodi','clan'];
function twGenC(seed,plv,tier,hon,vk){const rn=sd(hs('twc|'+seed)),p2=a=>a[Math.floor(rn()*a.length)],r2=(a,b)=>a+Math.floor(rn()*(b-a+1));
  const[vx,vy]=twP(vk)||[0,0],fk=p2(TWFK),F=OWF[fk];let ar=p2(F.ar);if(twCity(vx,vy)&&rn()<.35)ar='battaglia';const pat=p2(F.pat)+' '+p2(TWNM);const tgt=plv+r2(-1,2)+(hon?2:0);
  // una regione adatta: abbastanza lontana, del livello giusto
  const pick=(minD,maxD,f)=>{const L=[];for(let y=vy-maxD;y<=vy+maxD;y++)for(let x=vx-maxD;x<=vx+maxD;x++){const d=Math.max(Math.abs(x-vx),Math.abs(y-vy));if(d<minD||(f&&!f(x,y)))continue;const lv=twLv(x,y),dl=lv-tgt;L.push([x,y,dl>3?.01:Math.exp(-dl*dl/(dl>0?5:14))+.01])}
    if(!L.length)return[vx+minD,vy];let s=L.reduce((a,b)=>a+b[2],0)*rn();for(const q of L){s-=q[2];if(s<=0)return[q[0],q[1]]}return[L[0][0],L[0][1]]};
  const nameT=()=>p2(OWB1)+' '+p2(OWB2);
  const traits=()=>{const n=clamp(1+(tgt>=6?1:0)+(rn()<.45?1:0)+(hon?1:0),1,3),pool=OWTRK.slice(),o=[];for(let i=0;i<n;i++)o.push(pool.splice(Math.floor(rn()*pool.length),1)[0]);return o};
  const hunt=(z,t,es)=>({k:'hunt',z,t,nm:nameT(),tr:traits(),es:es==null?r2(1,3):es});
  const regionSp=(x,y)=>{const z=twZ(twK(x,y));return z.en};
  const witness=(x,y)=>{const k=twK(x,y);twZ(k);const i=p2([0,5,6,7,8]),id=twNpcId(x,y,i);twNpc(id);return{k:'talk',z:k,nid:id,ln:''}};
  const farVil=(minD,maxD)=>{const L=[];for(let y=vy-maxD;y<=vy+maxD;y++)for(let x=vx-maxD;x<=vx+maxD;x++){const d=Math.max(Math.abs(x-vx),Math.abs(y-vy));if(d>=minD&&twVil(x,y))L.push([x,y])}return L.length?p2(L):[vx,vy]};
  const where=(x,y)=>twDir(x-vx,y-vy);
  const steps=[];let ti='',tx='',zlv=1,trophy='';
  if(ar==='taglia'){const[x,y]=pick(1,4,(x,y)=>!twVil(x,y)),k=twK(x,y),z=twZ(k),H=hunt(k,p2(z.en));zlv=z.lv;const[wx,wy]=farVil(0,3),T=witness(wx,wy);
    ti=p2(['Taglia su ','Vivo o morto: ','La caccia a '])+H.nm;tx=`«${H.nm} (${E[H.t].n}) ${p2(OWCR)}. Si nasconde ${where(x,y)}, in ${z.n}. Prima parla con ${owNpcN(T.nid)} a ${twZ(T.z).n}: l'ha visto da vicino.»`;
    T.ln=`«${H.nm}? Sta in ${z.n}, ${twDir(x-wx,y-wy)} da qui. ${H.tr.map(q=>OWTR[q].h).join(' ')}»`;steps.push(T,H);trophy=p2(OWTRO)+' di '+H.nm}
  else if(ar==='infest'){const[x,y]=pick(1,3,(x,y)=>!twVil(x,y)),k=twK(x,y),z=twZ(k),t=p2(z.en),n=r2(6,10)+(0);zlv=z.lv;const H=hunt(k,t,2);
    ti='Infestazione: '+z.n;tx=`«${z.n}, ${where(x,y)}: ${E[t].n} dappertutto, e ogni notte sono di più. Sfoltiscili e trova chi li guida: lo chiamano ${H.nm}.»`;steps.push({k:'cull',z:k,t,n,c:0},H);trophy=p2(OWTRO)+' di '+H.nm}
  else if(ar==='sped'||ar==='reliq'){const[x,y]=pick(1,4,(x,y)=>twDun(x,y)),id=twDid(x,y),D=twDG(id),rel=p2(OWREL1)+' '+p2(OWREL2);zlv=D.lv+D.fls-1;
    if(ar==='sped'){const G1=hunt(id+'@1',p2(D.en),2),G2=hunt(id+'@'+D.fls,p2(D.en),r2(2,3));ti='Spedizione: '+D.n;tx=`«In fondo a ${D.n} (${where(x,y)}, piano ${D.fls}) c'è ${rel}. All'ingresso fa la guardia ${G1.nm}. Riportami la reliquia.»`;steps.push(G1,{k:'relic',z:id+'@'+D.fls,nm:rel,g:G2})}
    else{const T=witness(vx,vy),G=hunt(id+'@'+Math.max(1,D.fls-1),p2(D.en),r2(2,3));ti=owCap(rel);tx=`«${owCap(rel)} è finito in ${D.n}, ${where(x,y)}. ${owNpcN(T.nid)} ha letto le vecchie carte: chiedi a lui.»`;
      T.ln=`«Le carte dicono ${D.n}, al piano ${Math.max(1,D.fls-1)}. La custodisce ${G.nm}. ${G.tr.map(q=>OWTR[q].h).join(' ')}»`;steps.push(T,{k:'relic',z:id+'@'+Math.max(1,D.fls-1),nm:rel,g:G})}
    trophy='Calco · '+owCap(rel)}
  else if(ar==='battaglia'){const z=twZ(vk),wl=p2(OWB1)+' '+p2(OWB2);zlv=z.lv+3;ti='La battaglia di '+z.n;
    tx=`«Le vedette l'hanno visto dalle torri: un esercito di mostri marcia su ${z.n}, guidato da ${wl}. Arriveranno a ondate dalla porta. I nostri soldati terranno la linea con te: tu cerca il loro signore della guerra e abbattilo.»`;
    steps.push({k:'bat',z:vk,w:3+(tgt>=10?1:0),nm:wl});trophy='Stendardo strappato a '+wl}
  else if(ar==='assedio'){const k=vk,z=twZ(k),[nx,ny]=pick(1,2),t=p2(regionSp(nx,ny)),pl=p2(['la piazza','i granai','il pozzo','le case a nord','la bacheca']);const H=hunt(k,t,0);zlv=Math.max(z.lv,twLv(nx,ny));
    ti='Difendi '+z.n;tx=`«Dalle terre ${twDir(nx-vx,ny-vy).replace(/^.*a /,'a ')} arrivano ${E[t].n}, a ondate. Difendi ${pl} finché non arriva il loro capo, ${H.nm}.»`;
    steps.push({k:'def',z:k,pl,w:3+(tgt>=8?1:0)+(hon?1:0),wv:0,nm:H.nm,tr:H.tr,t});trophy='Stendardo di '+H.nm}
  else if(ar==='comm'){const[x,y]=pick(0,3,(x,y)=>(TWRES[twBio(x,y)]||[]).length>0&&!twVil(x,y)),k=twK(x,y),z=twZ(k),rs=TWRES[z.bio],r=p2(rs),n=r2(3,5),H=hunt(k,p2(z.en),r2(1,2));zlv=z.lv;const pz=p2(OWTRO);
    ti='Commissione: '+RESN[r]+' e '+pz.toLowerCase();tx=`«Mi servono ${n} ${RESN[r].toLowerCase()} da ${z.n} (${where(x,y)}) e ${pz==='Stendardo'?'lo stendardo':'il '+pz.toLowerCase()} di ${H.nm}, che si aggira là. Paga la carovana, e paga bene.»`;
    steps.push({k:'gath',r,z:k,n,c:0},H);trophy=pz+' di '+H.nm}
  else if(ar==='messaggio'){const[ax,ay]=farVil(2,5),A=witness(ax,ay),[bx,by]=farVil(2,6),B=witness(bx,by);zlv=Math.max(twLv(ax,ay),twLv(bx,by));
    ti='Il messaggio per '+twZ(A.z).n;tx=`«Questa lettera deve arrivare a ${owNpcN(A.nid)}, a ${twZ(A.z).n} (${where(ax,ay)}). Non aprirla. La risposta, portala a ${owNpcN(B.nid)} di ${twZ(B.z).n}.»`;
    A.ln=`«Una lettera... per me? (la legge, poi la stringe forte) Porta questa risposta a ${owNpcN(B.nid)}, ${twDir(bx-ax,by-ay)} da qui. E fa' presto.»`;B.ln=`«Finalmente. Dì alla bacheca che il debito è saldato.»`;steps.push(A,B);trophy='Sigillo di ceralacca di '+twZ(A.z).n}
  else{const[ax,ay]=pick(3,6),[bx,by]=pick(4,8,(x,y)=>Math.max(Math.abs(x-ax),Math.abs(y-ay))>=2);const A=twK(ax,ay),B=twK(bx,by);twZ(A);twZ(B);zlv=Math.max(twLv(ax,ay),twLv(bx,by));
    ti='Esplorazione: '+Z[B].n;tx=`«Le nostre mappe finiscono dove comincia il bello. Raggiungi ${Z[A].n} (${where(ax,ay)}) e poi ${Z[B].n} (${where(bx,by)}): voglio sapere cosa c'è laggiù.»`;
    steps.push({k:'reach',z:A},{k:'reach',z:B});trophy='Mappa di '+Z[B].n}
  steps.push({k:'back'});
  const mods={};const nm=r2(0,hon?2:1),MK=Object.keys(OWMOD);for(let i=0;i<nm;i++)mods[p2(MK)]=1;if(ar==='esplora'||ar==='messaggio'){delete mods.np;delete mods.el;delete mods.hd}
  const trn=steps.reduce((a,s)=>a+(s.tr?s.tr.length:0)+(s.g?s.g.tr.length:0),0);let st=1+Math.max(0,Math.round((zlv-plv+1)/2.5))+Object.keys(mods).length+(trn>=3?1:0)+(steps.length>=4?1:0);st=clamp(st,1,5);if(hon)st=Math.max(st,4);
  const kk=1+Object.keys(mods).reduce((a,m)=>a+OWMOD[m].k,0),lv=Math.max(plv,zlv),dist=steps.filter(s=>s.z).reduce((a,s)=>{const p=twP(String(s.z).startsWith('twd_')?DG[s.z.split('@')[0]].ent:s.z)||[vx,vy];return Math.max(a,Math.max(Math.abs(p[0]-vx),Math.abs(p[1]-vy)))},0);
  const rw={g:Math.round((35+lv*22)*st*kk*(1+.08*tier)*(1+dist*.08)),xp:Math.round((25+lv*lv*5)*(.5+st*.35)*kk),rm:[0,0,1,1,2,3][st],sl:p2(F.sl),rep:6+st*6,tro:trophy};
  return{id:seed,fa:fk,pat,ar,ti,tx,st,lv:zlv,steps,si:0,mods,rw,hon:hon?1:0,tw:1,vk}}
const _owRefresh716=owRefresh;owRefresh=function(force){if(!twOn())return _owRefresh716(force);const d=gDay(),vk=Zk;if(!String(vk).startsWith('tw:'))return;
  if(!force&&P.ow.day===d&&P.ow.offv===vk&&P.ow.off.length)return;P.ow.day=d;P.ow.offv=vk;const best=Math.max(0,...TWFK.map(f=>owTier(P.ow.rep[f])));P.ow.off=[];
  for(let i=0;i<4;i++)P.ow.off.push(twGenC(P.tw.seed+'-'+vk+'-'+d+'-'+i,P.lv,best,0,vk));if(best>=2)P.ow.off.push(twGenC(P.tw.seed+'-'+vk+'-'+d+'-h',P.lv,best,1,vk))};
// le tappe: anche «raggiungi», e la direzione da prendere da dove sei
const _owStepTxt716=owStepTxt;owStepTxt=function(C,s,long){s=s||owCur(C);if(!s)return'';let t=s.k==='reach'?'Raggiungi '+owZn(s.z):_owStepTxt716(C,s,long);
  if(twOn()&&s.z&&s.k!=='back'){const tz=String(s.z).startsWith('twd_')?(twDG(s.z.split('@')[0])||{}).ent:s.z,a=twP(tz),b=twP(String(Zk).startsWith('tw:')?Zk:(ZZ&&ZZ.dg&&DG[ZZ.dg]?DG[ZZ.dg].ent:''));
    if(a&&b&&!(a[0]===b[0]&&a[1]===b[1]))t+=' · '+twDir(a[0]-b[0],a[1]-b[1])}
  if(s.k==='back'&&twOn())t='Torna alla bacheca di un villaggio';return t};
// le specie che arrivano all'assedio di un villaggio vengono dalle terre vicine
// 7.17.1: nell'assedio di un villaggio arrivano i mostri scritti nel contratto accettato (prima: quelli dell'ultima offerta generata, e dopo un ricaricamento quelli del villaggio)
const _enOf716=OW.enOf;OW.enOf=k=>{if(ZZ&&ZZ.vil&&P&&P.ow)for(const C of P.ow.act){const s=owCur(C);if(s&&s.k==='def'&&s.z===k&&s.t&&twType(s.t))return[s.t]}return _enOf716(k)};
OWFK.length=0;OWFK.push(...TWFK);

/* ---- la mappa del mondo (M) ---- */
const TWMC={prato:'#7ab04e',bosco:'#3f7834',deserto:'#d9b56b',neve:'#dbe6ef',cenere:'#5c5652'};
function twMapHTML(){return`<h3>🗺 Mappa del mondo</h3><canvas id="twmc" width="520" height="520" style="width:min(520px,82vw);height:auto;border-radius:8px;border:1px solid #ffffff33"></canvas>
  <p class="mu">${esc(ZZ&&ZZ.n||'')} · livello della zona ${ZZ&&ZZ.lv||1} · regioni esplorate ${Object.keys(P.tw.vis).length}<br>🏠 villaggio · ⛫ dungeon · ✦ contratto · il riquadro dorato sei tu. Le regioni mai visitate sono velate.</p><button onclick="cl()">Chiudi</button>`}
const _openMap716=openMap;openMap=function(){if(twOn()){edPanel('twmap',twMapHTML());twMapDraw();return}_openMap716()};

/* ---- l'orizzonte in 3D: il mondo vero intorno alla regione ---- */
const _d3Backdrop716=d3Backdrop;d3Backdrop=function(){if(!(ZZ&&ZZ.tw))return _d3Backdrop716();const B=[],rx=ZZ.rx,ry=ZZ.ry,n=N,R0=TWR,o0=typeof TWW!=='undefined'?TWW.m:0,ring=[0,40,56,72][D3.q]||56,far=Math.round([0,96,150,220][D3.q]*(D3.far?1:.5)/8)*8;
  const pal=(bio,c)=>{const th=TWBT[bio],P2=BFL[th]&&BFL[th][c];if(P2)return x3Col(P2[0]);return x3Col(bio==='cenere'?'#4e4644':Z[th].a)};
  const tree=(x,y,bio,code,big)=>{const sc=big?2.2:1,pine=code==='P'||code==='F',g=bio==='neve'?[40,86,64]:pine?[46,92,58]:code==='B'?[110,150,70]:[62,118,50];
    if(code==='M'){B.push(x-.4*sc,y-.4*sc,0,.8*sc,.8*sc,(30+twH2(x,y)*30)*sc,196,150,96,1+20);return}if(code==='N'){B.push(x-.45*sc,y-.45*sc,0,.9*sc,.9*sc,(26+twH2(x,y)*26)*sc,170,178,188,1+20);B.push(x-.4*sc,y-.4*sc,(26+twH2(x,y)*26)*sc,.8*sc,.8*sc,5*sc,236,242,248,1+20);return}
    if(code==='K'||code==='R'){const lava=bio==='cenere';B.push(x-.3*sc,y-.3*sc,0,.6*sc,.6*sc,10*sc,lava?70:130,lava?60:130,lava?60:126,1+20);return}if(code==='Q'||code==='J'){B.push(x-.08,y-.08,0,.16,.16,16,70,130,60,1+10);return}
    if(code==='X'){B.push(x-.06,y-.06,0,.12,.12,26,120,90,50,1+30);B.push(x-.45,y-.45,26,.9,.9,4,70,140,60,1+10);return}if(code==='U'){B.push(x-.3,y-.3,0,.6,.6,8,60,110,50,1+10);return}
    B.push(x-.08*sc,y-.08*sc,0,.16*sc,.16*sc,12*sc,92,64,40,1+30);if(pine)for(let j=0;j<3;j++){const w=(.9-j*.25)*sc;B.push(x-w/2,y-w/2,(9+j*11)*sc,w,w,11*sc,g[0],g[1],g[2],1+10)}else{B.push(x-.5*sc,y-.5*sc,11*sc,1*sc,1*sc,16*sc,g[0],g[1],g[2],1+10)}};
  // l'anello vicino: le caselle vere delle regioni accanto (una ogni due), con i loro alberi, rocce e acqua
  for(let y=-ring;y<n+ring;y+=2)for(let x=-ring;x<n+ring;x+=2){if(x>=0&&y>=0&&x<n&&y<n)continue;const wx=rx*R0-o0+x,wy=ry*R0-o0+y,qx=Math.floor(wx/R0),qy=Math.floor(wy/R0),bio=twBio(qx,qy),[m,c]=twBase(wx,wy,bio);
    if(m===2){B.push(x,y,-2,2,2,0,64,124,178,1+50);continue}const fc=pal(bio,m===0?c:(bio==='cenere'?'9':''));const v=.94+twH2(wx,wy)*.12;B.push(x,y,-6,2,2,6,fc[0]*v,fc[1]*v,fc[2]*v,1+20);
    if(m===1)tree(x+1,y+1,bio,c,0)}
  // oltre: colline e montagne del bioma, fino all'orizzonte
  const cells=[];const dOf=(x0,y0,cs)=>{const lo=-ring,hi=n+ring-1,dx=x0+cs-1<lo?lo-(x0+cs-1):x0>hi?x0-hi:0,dy=y0+cs-1<lo?lo-(y0+cs-1):y0>hi?y0-hi:0;return Math.max(dx,dy)};
  const sub=(x0,y0,cs)=>{const d=dOf(x0,y0,cs);if(cs===8&&d>=60||cs===4){if(d>0)cells.push([x0,y0,cs,d]);return}const h=cs/2;for(const[u,v]of[[0,0],[h,0],[0,h],[h,h]])sub(x0+u,y0+v,h)};
  for(let y0=-ring-far;y0<n+ring+far;y0+=8)for(let x0=-ring-far;x0<n+ring+far;x0+=8)sub(x0,y0,8);
  for(const[x,y,cs,d]of cells){const wx=rx*R0-o0+x,wy=ry*R0-o0+y,qx=Math.floor(wx/R0),qy=Math.floor(wy/R0),bio=twBio(qx,qy),nz=twF(wx/34,wy/34,61),rise=Math.max(0,d-6);
    let hgt=bio==='neve'?Math.pow(rise,1.3)*13*(.5+nz):bio==='deserto'?rise*4*(.4+nz)+Math.sin(wx*.2+nz*6)*30:bio==='cenere'?Math.pow(rise,1.2)*8*(.4+nz):Math.pow(rise,1.15)*4*(.3+nz)+(d>70?Math.pow(d-70,1.3)*8*(.3+twF(wx/26,wy/26,62)):0);
    let col=pal(bio,'');const v=.9+twF(wx/11,wy/11,63)*.2;col=col.map(c=>c*v);if(hgt>(bio==='neve'?420:1100)+twV(wx/7,wy/7,64)*300)col=[236,240,246];else if(hgt>(bio==='neve'?250:800))col=[132,130,134];
    const H2=Math.round(hgt/6)*6;B.push(x,y,-40,cs,cs,H2+40,col[0],col[1],col[2],1+20);
    if((bio==='bosco'||bio==='prato'||bio==='neve')&&hgt<700&&twF(wx/14,wy/14,65)>(bio==='bosco'?.45:.62)&&twH2(wx,wy)<.6){const tx=x+cs*.5,ty=y+cs*.5;const sc=cs<=4?1.6:2.6,g=bio==='neve'?[40,86,64]:[56,108,48];B.push(tx-.6*sc,ty-.6*sc,H2,1.2*sc,1.2*sc,30*sc,g[0],g[1],g[2],1+10)}}
  return B};

/* ---- avvio: eroe nuovo, eroe che torna, eroe del vecchio Mondo aperto ---- */
const _newP716=newP;newP=function(){const p=_newP716();if(OW.on)p.tw=twFix(null);return p};
const _begin716=begin;begin=function(d,s){_begin716(d,s);if(!OW.on)return;
  if(!P.tw||!P.tw.seed){P.tw=twFix(null);if(P.ow){P.ow.act=[];P.ow.off=[];P.ow.day=0}if(s)setTimeout(()=>{PA={ti:'Tomorrow',tx:'Il tuo eroe del Mondo aperto ha varcato i confini del regno: tiene livello, oggetti, reperti e reputazione, ma i vecchi contratti di Aldoria sono rimasti là.\n\nDavanti a te c\'è una terra nuova. Cerca la bacheca del villaggio.'};pn('txt')},600)}
  else P.tw=twFix(P.tw);
  // le zone dei contratti in corso esistono di nuovo (nomi, specie, dungeon) prima che il resoconto le nomini
  for(const C of P.ow.act.concat(P.ow.off))for(const st of C.steps||[]){if(st.z){zd(st.z)}if(st.t)twType(st.t);if(st.nid)twNpc(st.nid);if(st.g&&st.g.t)twType(st.g.t)}
  if(!String(Zk).startsWith('tw:'))load(P.tw.at&&twP(P.tw.at)?P.tw.at:P.tw.home);
  if(!s&&(PM==='txt'||!PM)){PA={ti:'Tomorrow',tx:'Oltre i confini del regno si apre una terra che nessuna mappa ha mai disegnato. Si genera mentre cammini e non finisce mai.\n\nSei a '+(ZZ?ZZ.n:'')+', il villaggio di partenza. La Bacheca dei Contratti è in piazza: lì c\'è sempre lavoro. Ogni contratto nasce da zero e ti dice in che direzione andare.\n\nCammina oltre il bordo di una regione per passare a quella accanto. Più ti allontani dal villaggio, più i mostri sono forti e il bottino prezioso. I mostri cambiano da una terra all\'altra: difficilmente incontrerai due volte la stessa specie.\n\nTasti: M mappa del mondo, J contratti, I zaino, R interagisci, B vista 3D, Esc pausa.'};pn('txt')}
  hud();save()};
// il resoconto quando non ci sono contratti
const _hud716=hud;hud=function(){_hud716();if(!twOn()||P.ow.act.length)return;const el=$('qt');if(el&&el.innerHTML.includes('Visita la Bacheca dei Contratti in piazza'))el.innerHTML=el.innerHTML.replace('Visita la Bacheca dei Contratti in piazza','Cerca la bacheca di un villaggio (M: mappa)')};
// l'editor elenca solo i mostri del regno, non le specie generate da Tomorrow
const _edEnemyList716=edEnemyList;edEnemyList=function(){return _edEnemyList716().filter(k=>!k.startsWith('tw.'))};
