/* ================= 7.49: Thalassa più ricca — luoghi, personaggi, leggende e il mistero della Perla =================
   - Thalassa: la piazza con la fontana del Serpente, il Santuario del Mare con Fratel Corallo, il faro sullo scoglio, le
     lanterne sopra il viale (si accendono di notte), gabbiani e gatti, la Nonna Marea che racconta le leggende, il mozzo Tito.
   - La Giungla: l'accampamento dell'Esploratrice Ilva, le teste di pietra degli antichi re, i pappagalli che volano tra
     le palme, le lucciole di notte, l'altare della Perla davanti al tempio.
   - Le Tavolette di Giada: sei pietre incise (tre in città, tre nella giungla) raccontano la storia di Thalassa, dal primo
     approdo al patto con Quetzal. Trovarle tutte vale il titolo «Storico di Thalassa».
   - Il mistero della Perla (dopo aver liberato la Regina): qualcuno ha rubato la Perla di Giada, il cuore calmo di Quetzal.
     Un pescatore, un relitto, una sciarpa arancione, una capanna nella giungla… e Scirocco il contrabbandiere. Riportata
     la Perla sull'altare, il tempio si risveglia (e se Quetzal è vivo, ti benedice: +5% di vita massima per sempre). */
Object.assign(NPCS,{
  marea48:{n:'Nonna Marea',c:'#6a4a8a',hat:'#e8e0d0',ln:['Siediti, straniero: Thalassa ha mille anni di storie.']},
  corallo48:{n:'Fratel Corallo',c:'#2a8a9a',hat:'#e8f4f0',ln:['Il mare dà e il mare prende. Al Santuario si ringrazia per entrambe le cose.','Le tavolette di giada raccontano la nostra storia: ce ne sono anche nella giungla.']},
  tito48:{n:'Mozzo Tito',c:'#c84a3a',hat:'#f4f0e8',ln:['Un giorno avrò una nave tutta mia, con le vele turchesi!','La Capitana Marina dice che il mare non si conquista: si rispetta.','Il faro lo accende il vecchio Basilio, ogni sera, da sessant\'anni.']},
  basilio48:{n:'Guardiano del faro Basilio',c:'#3a4a6a',hat:'#1a1a2a',ln:['Sessant\'anni che accendo questo faro. Non ha mai perso una nave.','La notte del furto ho visto una vela arancione andare verso gli scogli. Poi più niente.']},
  ilva:{n:'Esploratrice Ilva',c:'#6a5a3a',hat:'#c8a070',ln:['Questa giungla è un libro aperto, se sai leggere le foglie.','Le teste di pietra? Erano i re di Thalassa, prima delle regine. Guardano tutte verso il tempio.','Di notte le lucciole indicano la strada per il tempio. Non chiedermi perché.']},
  scirocco48:{n:'Scirocco il contrabbandiere',c:'#c86a2a',hat:'#ff8a1a',ln:['Chi ti manda? Zefiro? Quel vigliacco di mio cugino!']}});
Object.assign(NPS,{marea48:'b|bun:#e8e8e8|none|scarf:#6a4a8a|shawl:#6a4a8a,necklace|cane|idle|old,f',corallo48:'b|bald|full:#8a8a8a|none|robe:#2a8a9a,necklace|book|read|n',
  tito48:'b|spiky:#3a2a1a|none|bandana:#c84a3a|stripes:#2a6ab8|rope|idle|kid',basilio48:'b|short:#d8d8d8|full:#d8d8d8|cap:#1a1a2a|vest:#3a4a6a,buttons|lantern|idle|old'});
// ritocchi alle battute dei personaggi della 7.48
for(const[k,L]of Object.entries({oreste48:['Il palazzo è vuoto senza la Regina. Ogni sera accendo una lanterna per lei.','Gli archivi di Thalassa sono più antichi di Aldoria stessa.'],
  zefiro48:['Pepe di Kalindra, perle nere, seta di ragno: Zefiro ha tutto, a buon prezzo… quasi.','Mio cugino Scirocco? Non parlarmene. Pecora nera della famiglia.'],
  coral48:['Hai visto la fontana del Serpente? Se lanci una moneta, il Serpente ti protegge!','La nonna Marea racconta le storie più belle. Vai a sentirla!'],
  ilio48:['Da quando il Serpente si è svegliato, i pesci scappano verso il largo.','Nella giungla c\'è un fiume che porta al tempio. Nessuno lo risale più.','Le notti senza luna il mare è nero come l\'inchiostro.']}))if(NPCS[k])NPCS[k].ln=(NPCS[k].ln||[]).concat(L);
// le creature nuove: Scirocco e i suoi
E.scirocco48={n:'Scirocco il contrabbandiere',hp:1100,at:36,xp:520,sp:2.4,r:1.4,cd:1,ag:14,m:hum('#c86a2a','#e0b090',1.2,[4,'#ff8a1a'])};
try{E.scirocco48.m=mHum({s:1.18,sk:'#d8a070',tp:'#c86a2a',lg:'#3a2a1a',ey:'#111',mouth:'#5a2a1a',x:[...HT.bandana('#ff8a1a'),['bd',-.23,-.13,12,.46,.27,2,'#ffb04a'],['bd',-.24,.12,16,.48,.03,3,'#ff8a1a'],...WP.cutlass(),...WP.dagger().map(q=>{const r=q.slice();r[0]='al';r[1]=-.38;return r})]})}catch(_){}
/* ---- la storia: le Tavolette di Giada ---- */
const TAV48=[
  {z:'thal48',n:'Il primo approdo',tx:'Mille anni fa i primi navigatori arrivarono su questa spiaggia, perduti in una tempesta. Li guidò una luce verde che brillava sopra la giungla: la chiamarono la Stella di Giada, e dove la luce toccava il mare fondarono Thalassa.'},
  {z:'thal48',n:'Il patto della prima Regina',tx:'La prima Regina, Nerea I, risalì il fiume fino al tempio e incontrò Quetzal, il Serpente piumato. Strinsero un patto: lui avrebbe protetto la giungla e le acque, e il popolo avrebbe custodito la Perla di Giada, il suo cuore.'},
  {z:'thal48',n:'La festa delle lanterne',tx:'Ogni anno, la notte più lunga, Thalassa accende mille lanterne lungo il viale e le lascia andare sul mare. Si dice che Quetzal le guardi dall\'alto del tempio, e che finché le lanterne brillano il patto resti vivo.'},
  {z:'giungla48',n:'I re di pietra',tx:'Prima delle regine Thalassa ebbe dei re. Vollero il tempio per sé e sfidarono il Serpente. Di loro restano soltanto le teste di pietra, nella giungla, rivolte per sempre verso il tempio che non riuscirono a prendere.'},
  {z:'giungla48',n:'Il cuore del Serpente',tx:'La Perla riposa sull\'altare davanti al tempio. Finché è lì, il cuore di Quetzal è calmo e la giungla è in pace. Se la Perla si allontana, il Serpente si sveglia, e il suo dolore diventa furia.'},
  {z:'giungla48',n:'La notte senza luna',tx:'«…in una notte senza luna una barca dalla vela arancione risalì il fiume. Al mattino l\'altare era vuoto…» Il resto della tavoletta è spezzato. Qualcuno l\'ha incisa in fretta, poco tempo fa.'}];
function tavFix(){const o=olFix();o.tav=Array.isArray(o.tav)?o.tav:[0,0,0,0,0,0];return o.tav}
function tavRead(i){const T=TAV48[i];if(!T)return;const L=tavFix(),nw=!L[i];L[i]=1;PA={ti:'🪨 Tavoletta di Giada · '+T.n,tx:T.tx+'\n\n('+L.filter(Boolean).length+' tavolette su 6)'};pn('txt');
  if(nw){tone(520,.2,'triangle',.05);if(L.every(Boolean)){P.g+=600;goldFly(600);gainXP(600);setTimeout(()=>banner('Hai letto tutta la storia di Thalassa','+600 oro · titolo «Storico di Thalassa»','libro'),600);if(typeof titAdd==='function')titAdd('storico48','Storico di Thalassa')}}save()}
/* ---- il mistero della Perla ---- */
// p: 0 da cominciare · 1 la Regina chiede · 2 Ilio ha visto la vela · 3 il relitto (sciarpa e mappa) · 4 hai la Perla · 5 Perla sull'altare · 6 finito
const perP=()=>olFix().p|0,perSet=v=>{olFix().p=Math.max(perP(),v);save()};
const PERS=['','Chiedi in città chi ha visto qualcosa la notte del furto (i pescatori al molo).','Cerca la barca dalla vela arancione sugli scogli a ovest della spiaggia di Thalassa.','Segui la mappa del relitto: una capanna nella giungla, a nord-ovest.','Riporta la Perla di Giada sull\'altare davanti al Tempio.','Torna dalla Regina Nerea.','Il mistero della Perla è risolto.'];
const perStatus=()=>{const p=perP();return p?'🔎 La Perla rubata: '+PERS[Math.min(6,p)]:''};
{const os0=olStatus;olStatus=function(){const t0=tavFix().filter(Boolean).length,ps=perStatus();return os0()+(ps?' '+ps:'')+' · Tavolette di Giada: '+t0+'/6.'}}
// la Regina, a missione finita, chiede della Perla
{const n0=X43P.ner48;X43P.ner48=()=>{const o=olFix(),p=perP();if(o.s<5)return n0();
  if(p===0)return`<h3>👑 Regina Nerea</h3><p class="x43t">«Resta ancora un mistero, eroe. Quetzal si è svegliato perché qualcuno ha rubato la Perla di Giada dall'altare. Senza di lei il tempio non troverà pace. Chi l'ha presa? E perché? Chiedi ai pescatori: di notte sono sempre al molo.»</p><button onclick="perSet(1);cl();banner('Nuova missione: la Perla rubata','Chiedi ai pescatori del molo','libro')">🔎 Troverò la Perla</button><button onclick="cl()">Più tardi</button>`;
  if(p===5){const sp=P.st48&&P.st48.b&&P.st48.b.tempio48>0;return`<h3>👑 Regina Nerea</h3><p class="x43t">«La Perla è di nuovo al suo posto. ${sp?'E Quetzal ti ha benedetto: lo sento anche da qui, il suo cuore è tornato calmo.':'Il tempio si è illuminato per la prima volta dopo tanto tempo.'} E Scirocco? Lo metterò a lavorare al faro con il vecchio Basilio: un po' di luce gli farà bene.»</p><button onclick="perReward()">👑 Grazie, Maestà</button>`}
  if(p>=1&&p<5)return`<h3>👑 Regina Nerea</h3><p class="x43t">«${esc(PERS[p])}»</p><button onclick="cl()">Chiudi</button>`;return n0()}}
function perReward(){if(perP()!==5)return;perSet(6);P.g+=2500;goldFly(2500);gainXP(2000);const it=item(Math.max(16,P.lv),3,'s');it.n='Scudo della Perla';it.hp=(it.hp||0)+80;gain(it);if(typeof titAdd==='function')titAdd('perla48','Custode della Perla');
  banner('Il mistero della Perla è risolto','2500 oro, lo Scudo della Perla e il titolo «Custode della Perla»','corona');jingle([60,64,67,72,76,79],.09,'triangle');cl();save();hud()}
// Ilio e Zefiro: gli indizi
{const a0=act;act=function(e){const p=perP();
  if(e&&e.k==='npc'&&(e.nid==='ilio48'||e.nid==='basilio48')&&p===1){PA={ti:e.n,tx:'«La notte del furto? Ero qui a pescare. Ho visto una barca con la vela arancione che scendeva dal fiume, veloce, senza lanterne. È andata a sbattere sugli scogli in fondo alla spiaggia, a ovest: si vede ancora quello che resta.»'};pn('txt');perSet(2);ents.forEach(q=>{if(q.k==='rel48')q.on=1});return}
  if(e&&e.k==='npc'&&e.nid==='zefiro48'&&p===3){PA={ti:e.n,tx:'«Una sciarpa arancione… questa è di mio cugino Scirocco! Fa il contrabbandiere, vende di tutto a chiunque. Deve aver pensato che una perla del genere valesse una fortuna oltre il mare. Vive in una capanna nella giungla, a nord-ovest. Ti prego… non fargli troppo male. È uno stupido, non un mostro.»'};pn('txt');return}
  if(e&&e.k==='rel48'){if(p<2){msg('I resti di una barca sugli scogli. Una vela arancione strappata sventola nel vento.');return}if(p===2){PA={ti:'Il relitto',tx:'Tra le assi spezzate trovi una sciarpa arancione, di quelle che vende il Mercante Zefiro, e una mappa bagnata: c\'è una croce nella giungla, a nord-ovest, accanto a un disegno di capanna.'};pn('txt');perSet(3);banner('Indizio: la mappa del relitto','Una capanna nella giungla, a nord-ovest','libro');return}msg('Il relitto non ha altro da dire.');return}
  if(e&&e.k==='cap48'){if(p<3){msg('Una capanna di canne e foglie. Non c\'è nessuno.');return}if(p===3&&!ents.some(q=>q.t==='scirocco48')){const[x,y]=nearFree((e.px|0)+1,(e.py|0)+2);const m=mk('scirocco48',x,y);m.n='Scirocco il contrabbandiere';m.sci48=1;ents.push(m);
      for(const[a,b]of[[-2,2],[3,1]]){const[u,v]=nearFree((e.px|0)+a,(e.py|0)+b);ents.push(mk('scimmia48',u,v))}banner('«Chi ti manda? Zefiro?»','Scirocco il contrabbandiere difende il suo bottino','spada');tone(200,.3,'sawtooth',.05);return}
    msg(p>=4?'La capanna è vuota: Scirocco è scappato verso il mare.':'Scirocco è ancora qui!');return}
  if(e&&e.k==='alt48'){if(p<4){msg('Un altare di giada con una conca vuota al centro. Manca qualcosa.');return}if(p===4){perAltar(e);return}msg('La Perla di Giada brilla sull\'altare.');return}
  a0(e)}}
ITK.add('rel48');ITK.add('cap48');ITK.add('alt48');ITK.add('tav48');
{const a1=act;act=function(e){if(e&&e.k==='tav48'){tavRead(e.i);return}a1(e)}}
{const k0=kill;kill=function(e){const s=e&&e.k==='en'&&e.sci48&&ents.includes(e);k0(e);if(s&&!ents.includes(e)&&perP()===3){perSet(4);setTimeout(()=>banner('Hai la Perla di Giada!','Scirocco scappa verso il mare. Riporta la Perla sull\'altare del Tempio','corona'),900)}}}
function perAltar(e){perSet(5);const sp=P.st48&&P.st48.b&&P.st48.b.tempio48>0;jingle([60,64,67,72,76,79,84],.1,'triangle');if(cineOK()){sparks(e.px,e.py,40,['#6affc0','#ffffff','#ffe84a'],160);if(typeof flash==='function')flash('#6affc0',.4,700)}
  if(sp){olFix().bl=1;recalc();ents.push({k:'qg48',px:e.px+1.5,py:e.py-1.5,t0:t});PA={ti:'Quetzal',tx:'Dal tempio scende un\'ombra enorme, verde e lucente. È Quetzal, il Serpente che hai risparmiato. Si china sulla Perla, chiude gli occhi… e per la prima volta il suo respiro è calmo.\n\n«Mi hai lasciato vivere quando potevi uccidermi, e mi hai ridato il cuore. Porta con te la mia benedizione.»\n\nBenedizione di Quetzal: +5% di vita massima, per sempre.'}}
  else PA={ti:'L\'altare di giada',tx:'Appena la Perla tocca l\'altare, le pietre del tempio si illuminano di verde, una dopo l\'altra. Il Serpente non c\'è più, ma la giungla sembra respirare di nuovo: gli uccelli tornano a cantare.\n\nTorna dalla Regina Nerea.'};
  setTimeout(()=>pn('txt'),700);save()}
{const rc0=recalc;recalc=function(){rc0();if(P&&P.ol48&&P.ol48.bl){P.mx=Math.round(P.mx*1.05);P.hp=Math.min(P.hp,P.mx)}}}
/* 7.50: i luoghi di Thalassa e della giungla ora sono costruiti da capo in 8zzzx_thalassa3.js */
/* ---- i disegni ---- */
{const e0=ent;ent=function(e){const k=e.k;
  if(k==='fon48'){drawL([[-1,-1,0,2,2,4,'#e8e0d0'],[-.9,-.9,4,1.8,1.8,1,'#3a9ad8'],[-.25,-.25,4,.5,.5,14,'#e8e0d0'],[-.15,-.15,18,.3,.3,8,'#2ab87a'],[-.05,.1,22,.1,.25,4,'#2ab87a'],[.0,.3,24,.06,.06,2,'#ffe84a']],e.px,e.py,0);
    for(let i=0;i<8;i++){const q=(t*.9+i/8)%1,a=i*.785;g.globalAlpha=1-q;box(e.px+Math.cos(a)*q*.8-.04,e.py+Math.sin(a)*q*.8-.04,22-q*q*18,.08,.08,2,'#bfe8ff',1.2);g.globalAlpha=1}return}
  if(k==='san48'){drawL([[-1,-1.5,0,2,3,4,'#e8e0d0'],[-.9,-1.4,4,1.8,2.8,22,'#f8f4ec'],[-1.05,-1.55,26,2.1,3.1,3,'#2ab8a8'],[-.75,-1.25,29,1.5,2.5,3,'#3ac8b8'],[-.45,-.95,32,.9,1.9,3,'#2ab8a8'],[-.08,-.08,35,.16,.16,8,'#d4af37'],
    [-.35,1.45,4,.7,.06,14,'#2a6a8a'],[-1,1.4,4,.18,.18,22,'#f4f0e8'],[.82,1.4,4,.18,.18,22,'#f4f0e8']],e.px,e.py,0);box(e.px-.25,e.py+1.47,6,.5,.03,10,'#ffe8a0',1.3);if(typeof nlight==='function')nlight(e.px,e.py+1.5,12,70,'120,230,220',.6);return}
  if(k==='lan48'){const nt=(typeof NK!=='undefined'?NK:0)>.3;for(let i=0;i<5;i++){const x=e.px-1.6+i*.8,s=Math.sin(t*1.5+i+e.py)*.4;box(x-.08,e.py-.08,30+s,.16,.16,4,['#ff6a4a','#ffd84a','#3ac8b8','#ff8ad8','#8ad0ff'][i],nt?1.8:1.1);if(nt&&typeof nlight==='function'&&i===2)nlight(x,e.py,30,70,'255,210,140',.6)}
    box(e.px-2,e.py-.02,33,4,.04,.4,'#5a4a3a');return}
  if(k==='tav48'){const got=P&&P.ol48&&P.ol48.tav&&P.ol48.tav[e.i];drawL([[-.3,-.08,0,.6,.16,3,'#5a6a5a'],[-.22,-.06,3,.44,.12,16,'#3a8a6a'],[-.18,-.07,6,.36,.01,1,'#8affc8'],[-.18,-.07,9,.3,.01,1,'#8affc8'],[-.18,-.07,12,.34,.01,1,'#8affc8']],e.px,e.py,0);
    if(!got)box(e.px-.05,e.py-.05,22+Math.sin(t*3+e.i)*1.5,.1,.1,3,'#6affc0',1.5);return}
  if(k==='rel48'){drawL([[-.7,-.3,0,1.4,.6,4,'#6a4a2a'],[-.6,-.25,4,.5,.5,3,'#5a3a1a'],[.1,-.3,0,.6,.15,8,'#7a5a3a'],[-.1,-.05,4,.06,.06,26,'#5a3a1a'],[-.08,-.05,14,.04,.6+Math.sin(t*2)*.05,12,'#ff8a1a']],e.px,e.py,0);
    if(e.on&&perP()===2)box(e.px-.06,e.py-.06,34+Math.sin(t*3)*2,.12,.12,4,'#ffd84a',1.5);return}
  if(k==='cap48'){drawL([[-.8,-.8,0,1.6,1.6,14,'#a8884a'],[-.95,-.95,14,1.9,1.9,3,'#5a8a3a'],[-.7,-.7,17,1.4,1.4,3,'#4a7a2a'],[-.4,-.4,20,.8,.8,3,'#5a8a3a'],[-.25,.78,0,.5,.04,10,'#3a2a1a'],[.85,-.2,0,.4,.3,4,'#6a4a2a'],[.9,-.15,4,.3,.2,1,'#ff8a1a']],e.px,e.py,0);return}
  if(k==='alt48'){const p=perP();drawL([[-.5,-.5,0,1,1,5,'#5a7a6a'],[-.4,-.4,5,.8,.8,5,'#4a6a5a'],[-.25,-.25,10,.5,.5,2,'#2ab87a']],e.px,e.py,0);
    if(p>=5){box(e.px-.12,e.py-.12,12+Math.sin(t*2)*1,.24,.24,5,'#8affc8',1.8);if(typeof nlight==='function')nlight(e.px,e.py,14,110,'106,255,192',.9)}else if(p===4)box(e.px-.05,e.py-.05,16+Math.sin(t*4)*2,.1,.1,3,'#ffd84a',1.5);return}
  if(k==='tes48'){drawL([[-.9,-.9,0,1.8,1.8,4,'#6a6a5a'],[-.75,-.7,4,1.5,1.3,26,'#7a7a6a'],[-.8,-.75,30,1.6,1.4,6,'#6a6a5a'],[-.5,.6,16,.3,.06,5,'#3a3a32'],[.2,.6,16,.3,.06,5,'#3a3a32'],[-.1,.6,8,.2,.12,8,'#6a6a5a'],[-.35,.6,4,.7,.06,2,'#3a3a32'],[-.85,-.4,24,.2,.6,10,'#4a7a3a'],[.6,-.2,6,.25,.5,14,'#3a8a3a']],e.px,e.py,0);return}
  if(k==='ten48'){drawL([[-.7,-.6,0,1.4,1.2,3,'#c8a870'],[-.6,-.5,3,1.2,1,9,'#d8b880'],[-.4,-.3,12,.8,.6,6,'#c8a870'],[-.15,-.1,18,.3,.2,4,'#b89860'],[-.2,.5,0,.4,.04,9,'#5a4a2a']],e.px,e.py,0);return}
  if(k==='fuo48'){drawL([[-.3,-.3,0,.6,.6,1.5,'#6a6a6a'],[-.2,-.05,1.5,.4,.1,2,'#6a4a2a'],[-.05,-.2,1.5,.1,.4,2,'#5a3a1a']],e.px,e.py,0);const f=Math.sin(t*12)*1.5;box(e.px-.12,e.py-.12,3,.24,.24,5+f,'#ff7a2a',1.8);box(e.px-.06,e.py-.06,6,.12,.12,5-f*.5,'#ffd84a',1.9);if(typeof nlight==='function')nlight(e.px,e.py,8,90,'255,170,80',.9);if(cineOK()&&Math.random()<.1)sparks(e.px,e.py,1,['#ffb04a'],60);return}
  if(k==='pap48'){const a=t*.5+e.ph,x=e.px+Math.cos(a)*2.5,y=e.py+Math.sin(a*1.3)*2,z=38+Math.sin(t*2+e.ph)*6,w=Math.sin(t*18+e.ph)*.12;box(x-.08,y-.05,z,.16,.1,3,e.c,1.1);box(x+.08,y-.03,z+1,.06,.06,2,'#ffe84a');box(x-.02,y-.2-w,z+1.5,.08,.15,.8,e.c);box(x-.02,y+.05+w,z+1.5,.08,.15,.8,e.c);box(x-.22,y-.02,z,.14,.04,1,e.c);return}
  if(k==='luc48'){const nk=typeof NK!=='undefined'?NK:0;if(nk<.2)return;const x=e.px+Math.sin(t*.7+e.ph)*.6,y=e.py+Math.cos(t*.5+e.ph)*.6,z=6+Math.sin(t*1.3+e.ph)*4,on=Math.sin(t*3+e.ph*5)>-.3;if(on){box(x-.03,y-.03,z,.06,.06,.6,'#e8ff8a',2);if(typeof nlight==='function'&&e.ph<1.2)nlight(x,y,z,30,'220,255,140',.5)}return}
  if(k==='qg48'){const a=Math.min(1,(t-e.t0)/1.5);if(t-e.t0>14){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1);return}const m=E.quetzal48&&E.quetzal48.m;if(m){g.globalAlpha=a*.75;try{drawHero(m,e.px,e.py,10+Math.sin(t*1.5)*3,0,faceOf(P.px-e.px,P.py-e.py))}catch(_){}g.globalAlpha=1}if(typeof nlight==='function')nlight(e.px,e.py,30,160,'106,255,192',.8*a);return}
  e0(e)}}
