/* ================= 7.14: MONDO APERTO (anteprima) =================
   Una modalità nuova, con un eroe e un salvataggio tutti suoi (voxelia_ow): lo stesso regno della storia, anni dopo la
   caduta di Malakar. Niente trama da seguire: tutto il mondo è aperto (anche il Borgo delle Ceneri) e il lavoro arriva dalla
   Bacheca dei Contratti, in piazza ad Aldoria, accanto all'arrivo.
   I CONTRATTI sono generati da un seme, ma non a caso:
   - sei fazioni (Guardia, Gilda dei Mercanti, Collegio Arcano, Ordine del Tempio, Gente dei Campi, Fratellanza del Porto),
     ognuna con i suoi committenti e i suoi tipi di lavoro;
   - sette tipi di contratto (Taglia, Infestazione, Reliquia perduta, Indagine, Assedio, Commissione rara, Spedizione), ognuno
     una catena di 2-4 tappe: parlare con un testimone, cacciare un bersaglio con nome, sterminare, recuperare una reliquia
     custodita, raccogliere materiali, difendere un luogo da ondate di nemici, tornare a riscuotere;
   - i bersagli hanno un nome e da 1 a 3 tratti (corazzato, furioso, rapido, rigenerante, evocatore, spinato, scudato) che i
     testimoni ti raccontano prima dello scontro, così puoi prepararti;
   - patti che alzano la posta: tempo limitato, niente pozioni, scorta di Campioni, orda;
   - stelle da 1 a 5 secondo zona, livello, tratti e patti; la ricompensa cresce con le stelle: oro, esperienza, un oggetto
     UNICO (con 5 stelle sempre leggendario), un reperto da collezione o da scambiare e la reputazione con la fazione.
   Ogni giorno di gioco la bacheca propone contratti nuovi (con la reputazione alta anche un contratto d'onore), e se ne
   possono tenere tre alla volta. Il bottino del Mondo aperto è fatto di oggetti unici: vedi 8zk_unici.js. */
const OWK='voxelia_ow';
const OW={on:false,next:0,tab:'off',lt:0,dl:0};
// fazioni: n, colore, committenti, tipi di contratto, posti preferiti per la ricompensa
const OWF={
  guardia:{n:'Guardia di Aldoria',c:'#7ab0ff',pat:['il Capitano','la Sergente','il Comandante','la Tenente'],ar:['taglia','assedio','indagine','infest'],sl:'ws'},
  gilda:{n:'Gilda dei Mercanti',c:'#ffd84a',pat:['Mastro','la Tesoriera','il Mercante','la Mercantessa'],ar:['comm','reliq','sped','taglia'],sl:'whcs'},
  collegio:{n:'Collegio Arcano',c:'#c88aff',pat:['la Magistra','l\'Archivista','l\'Alchimista','il Lettore'],ar:['reliq','sped','indagine','comm'],sl:'hc'},
  tempio:{n:'Ordine del Tempio',c:'#f4ecd0',pat:['Frate','la Badessa','il Priore','Sorella'],ar:['infest','reliq','assedio','indagine'],sl:'cs'},
  campi:{n:'Gente dei Campi',c:'#8ad070',pat:['il Fattore','la Massaia','il Pastore','la Mugnaia'],ar:['infest','comm','assedio','taglia'],sl:'wh'},
  porto:{n:'Fratellanza del Porto',c:'#6ad0ff',pat:['il Nostromo','la Capitana','il Contrabbandiere','la Pilota'],ar:['sped','taglia','indagine','comm'],sl:'wc'}};
const OWFK=Object.keys(OWF);
const OWNM=['Arnaldo','Bice','Corrado','Delia','Ettore','Fosca','Guido','Ilaria','Lapo','Mirella','Nando','Ofelia','Piero','Rosa','Sandro','Tecla','Ugo','Vanna','Zeno','Adelmo','Gemma','Ilario','Noemi','Ruggero'];
const OWSN=['Ferri','Baldi','Corsi','Marchetti','Lanza','Orsini','Valli','Riva','Neri','Testa','Fontana','Galli','Mori','Serra','Bruni','Conti'];
// bersagli con nome
const OWB1=['Grakk','Morva','Skarn','Vesh','Ulgra','Thorn','Brak','Ysolde','Karth','Nerys','Ferro','Malva','Orrin','Kroll','Saba','Vorn','Ishka','Tarn','Gorm','Lirra','Dusk','Zarga'];
const OWB2=['Spaccaossa','Ombralunga','Mezzorecchio','Occhiogrigio','Zannarotta','Pelle di Ferro','Senzanome','Mangiacorvi','Unghianera','Cuordipietra','Sette Cicatrici','Passofelpato','Fauci Rosse','Vecchia Zanna','Mille Morsi','Mantonero','Urlo di Ghiaccio','Codaspezzata'];
// i tratti: cosa fanno e come te li raccontano i testimoni
const OWTR={
  corazzato:{n:'Corazzato',h:'Ha una pelle dura come la pietra: porta qualcosa che colpisca forte.'},
  furioso:{n:'Furioso',h:'Quando si infuria colpisce come un ariete, e non si ferma più.'},
  rapido:{n:'Rapido',h:'Non pensare di scappare: è più veloce di te.'},
  rigenera:{n:'Rigenerante',h:'Le ferite gli si chiudono a vista d\'occhio: non dargli tregua, o ricomincerai da capo.'},
  evocatore:{n:'Evocatore',h:'Non resta solo a lungo: quando combatte chiama gli altri.'},
  spinato:{n:'Spinato',h:'Chi lo colpisce si ferisce: io ci ho lasciato mezza mano.'},
  scudato:{n:'Scudato',h:'A tratti si accende di una luce azzurra e allora niente lo scalfisce: aspetta che si spenga.'}};
const OWTRK=Object.keys(OWTR);
// dove si combatte: k, livello, nemici
const OWEN={forest:['slime','lupo','goblin'],desert:['scorpione','sciacallo','mummia'],peaks:['lupo_gelo','yeti','elem_ghiaccio'],rovine:['ratto','bandito','spettro','ghoul'],
  campi:['goblin','lupo','bandito'],porto:['bandito','ratto'],nord:['bandito','ratto']};
const OWOUT=[['forest',1],['desert',4],['rovine',5],['peaks',7]],OWCIV=[['campi',1],['nord',2],['porto',3]],OWDG=['tana','cripta','piramide','cristallo','fucina','abisso'];
// i testimoni: personaggi che esistono già, nei quartieri della città
const OWW={town:['tommaso','ugo','nino','araldo'],nord:['giardiniere','beatrice','lorenzo','nobile'],campi:['marta','pietro','bruno_b','elio','lia_r','contadino'],porto:['pescatore','gino','stefano','nella','rocco','pippo','ernesto','marinaio']};
// i materiali: dove si raccolgono
const OWRES={lunare:['forest',1],scarab:['desert',4],ghiaccio:['peaks',7],cimelio:['rovine',5],grano:['campi',1],legna:['campi',1],mela:['campi',1],uova:['campi',1],rosa:['nord',2],conchiglia:['porto',3]};
const OWREL1=['il Calice','il Sigillo','la Lanterna','il Reliquiario','la Mappa','il Corno','lo Specchio','la Chiave','il Codice','l\'Astrolabio','la Campana','il Diario'],
  OWREL2=['di Santa Ilda','del Primo Re','di Velka','dei Sette Venti','di Ossidiana','d\'Argento Vivo','del Cartografo','delle Maree','di Fra\' Anselmo','della Regina Bianca','dei Fratelli Corsi','senza Nome'];
const OWPLACE={campi:['il mulino','i granai','la fattoria grande','la segheria'],porto:['il faro','i magazzini del molo','la capitaneria','il cantiere'],nord:['il giardino del palazzo','la banca','il teatro'],
  forest:['l\'accampamento dei boscaioli','la capanna del cacciatore','il guado'],desert:['l\'oasi','la carovana bloccata','la tenda dei cartografi'],peaks:['il rifugio','il passo','la vedetta'],rovine:['lo scavo del Collegio','il pozzo antico','l\'ultima casa in piedi']};
const OWCR=['ha assalito una carovana della Gilda','ha ferito tre guardie di ronda','ha reso la strada impraticabile','semina il panico tra chi passa','ha distrutto un accampamento di cacciatori','ha trascinato via un mulo carico di sale','ha messo in fuga una pattuglia intera','tiene in scacco i boscaioli da settimane'];
const OWMY=['Chi ha svuotato la cassaforte della dogana','Chi ha avvelenato il pozzo del borgo','Chi ha rubato le campane del Tempio','Chi ha bruciato i registri della Gilda','Chi ha fatto sparire il cane del magistrato','Chi ha aperto le gabbie del serraglio','Chi ha mandato le lettere senza firma','Chi ha spostato i cippi di confine'];
const OWTRO=['Zanna','Artiglio','Teschio','Stendardo','Amuleto','Corno','Collare','Pugnale spezzato'];
// i patti
const OWMOD={dl:{n:'Tempo limitato',d:'da finire entro un giorno di gioco',k:.25},np:{n:'Niente pozioni',d:'nella zona del contratto le pozioni non si usano',k:.3},el:{n:'Scorta di Campioni',d:'chi accompagna il bersaglio è un Campione',k:.25},hd:{n:'Orda',d:'il doppio dei nemici',k:.2}};
const OWRT=[[0,'Sconosciuto'],[60,'Conosciuto'],[180,'Stimato'],[400,'Onorato'],[800,'Leggendario']];
const owTier=v=>{let i=0;for(let k=0;k<OWRT.length;k++)if((v|0)>=OWRT[k][0])i=k;return i};
const owCap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const owOn=()=>!!(OW.on&&MODE==='story'&&P&&P.ow&&started);
function owZn(k){if(Z[k]&&Z[k].n)return String(Z[k].n);const[id,f]=String(k).split('@');return DG[id]?DG[id].n+' · piano '+f:k}
const owZlv=k=>{const[id,f]=String(k).split('@');return DG[id]?DG[id].lv+((f|0)-1):(Z[k]&&Z[k].lv)||1};
const owEnOf=k=>{if(OW.enOf){const r=OW.enOf(k);if(r&&r.length)return r}const[id]=String(k).split('@');return(DG[id]?DG[id].en:OWEN[k]||['bandito']).filter(t=>E[t]&&!E[t].boss&&!E[t].np)};
const owNpcN=id=>NPCS[id]&&NPCS[id].n?NPCS[id].n:id;
const owStars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const owCur=C=>C&&C.steps[C.si];

/* ---- il generatore ---- */
function owGen(seed,plv,tier,hon){const rn=sd(hs('owc|'+seed)),r2=(a,b)=>a+Math.floor(rn()*(b-a+1)),p2=a=>a[Math.floor(rn()*a.length)];
  const fk=p2(OWFK),F=OWF[fk],ar=p2(F.ar),pat=p2(F.pat)+' '+p2(OWNM)+' '+p2(OWSN);
  const tgt=plv+r2(-2,1)+(hon?2:0);
  // sceglie una zona vicina al livello dell'eroe (le zone troppo forti quasi mai, quelle troppo facili poco)
  const pick=L=>{let tot=0;const W=L.map(([k,lv])=>{const d=lv-tgt,w=d>4?.003:Math.exp(-(d*d)/(d>0?6:12))+.01;tot+=w;return w});let x=rn()*tot;for(let i=0;i<L.length;i++){x-=W[i];if(x<=0)return L[i]}return L[L.length-1]};
  const dgL=[];for(const id of OWDG)for(let f=1;f<=DG[id].fls;f++)dgL.push([id+'@'+f,DG[id].lv+f-1]);
  const fight=OWOUT.concat(dgL);
  const tname=()=>p2(OWB1)+' '+p2(OWB2);
  const usedW=new Set();const wit=()=>{const ks=Object.keys(OWW);for(let k=0;k<20;k++){const z=p2(ks),id=p2(OWW[z]);if(!usedW.has(id)){usedW.add(id);return[z,id]}}return['town','tommaso']};
  const mods={};const nm=r2(0,hon?2:1);const MK=Object.keys(OWMOD);for(let i=0;i<nm;i++)mods[p2(MK)]=1;
  const steps=[];let zlv=1,ti='',tx='',kind=ar,trophy='';
  const hunt=(z,o={})=>{const en=owEnOf(z),t=o.t||p2(en),n=o.nm||tname(),nt=clamp(1+(tgt>=6?1:0)+(rn()<.45?1:0)+(hon?1:0),1,3),tr=[];const pool=OWTRK.slice();for(let i=0;i<nt;i++)tr.push(pool.splice(Math.floor(rn()*pool.length),1)[0]);
    return{k:'hunt',z,t,nm:n,tr,es:o.es==null?r2(1,3):o.es}};
  const talk=(o={})=>{const[z,id]=wit();return{k:'talk',z,nid:id,ln:o.ln||''}};
  if(ar==='taglia'){const[z,lv]=pick(fight);zlv=lv;const H=hunt(z),T=talk();const cr=p2(OWCR);
    ti=p2(['Taglia su ','Vivo o morto: ','La caccia a '])+H.nm;
    tx=`«${H.nm} (${E[H.t].n}) ${cr}. Non è una bestia qualunque: è un Campione, e ha già fatto fuori chi ci ha provato prima di te. Lo hanno visto in ${owZn(z)}. Prima di partire parla con ${owNpcN(T.nid)}: l'ha visto da vicino ed è tornato per raccontarlo.»`;
    T.ln=`«${H.nm}? L'ho visto in ${owZn(z)}, nel punto più lontano dall'ingresso. ${H.tr.map(x=>OWTR[x].h).join(' ')} Buona fortuna: ti servirà.»`;
    steps.push(T,H);trophy=p2(OWTRO)+' di '+H.nm}
  else if(ar==='infest'){const[z,lv]=pick(rn()<.6?OWOUT:fight);zlv=lv;const en=owEnOf(z),t=p2(en),n=r2(6,10)+(mods.hd?5:0),H=hunt(z,{t,es:2});
    ti=p2(['Infestazione in ','La piaga di ','Ripulire '])+owZn(z).split(' · ')[0];
    tx=`«In ${owZn(z)} la piaga si chiama ${E[t].n}. Ne ho contati più di ${n} e ogni settimana sono di più: qualcuno li guida. Sfoltiscili, poi trova chi li comanda. I cacciatori lo chiamano ${H.nm}.»`;
    steps.push({k:'cull',z,t,n,c:0},H);trophy=p2(OWTRO)+' di '+H.nm}
  else if(ar==='reliq'){const cand=OWOUT.filter(([k])=>k!=='forest').concat(dgL.filter(([k])=>/@[23]$/.test(k)||k.startsWith('tana')));const[z,lv]=pick(cand);zlv=lv;const rel=p2(OWREL1)+' '+p2(OWREL2),T=talk();
    ti=owCap(rel);tx=`«${owCap(rel)} è sparito da generazioni. Ora sappiamo dove si trova: in ${owZn(z)}. Non sarà solo: chi lo custodisce non lo lascerà andare. ${owNpcN(T.nid)} ha studiato le vecchie carte: fatti spiegare cosa ti aspetta.»`;
    const G=hunt(z,{es:r2(2,3)});T.ln=`«${owCap(rel)}... sì, le carte parlano chiaro: è in ${owZn(z)}, e lo custodisce ${G.nm}. ${G.tr.map(x=>OWTR[x].h).join(' ')} Prendi la reliquia e vattene, non serve vincere per forza.»`;
    steps.push(T,{k:'relic',z,nm:rel,g:G});trophy='Calco · '+owCap(rel)}
  else if(ar==='indagine'){const[z,lv]=pick(fight);zlv=lv;const my=p2(OWMY),A=talk(),B=talk(),H=hunt(z,{t:owEnOf(z).includes('bandito')?'bandito':undefined});
    ti=my+'?';tx=`«${my}? Non lo sa nessuno, e chi sa qualcosa non parla. Comincia da ${owNpcN(A.nid)}: era lì quella notte.»`;
    A.ln=`«Io non ho visto niente... va bene, qualcosa sì. Un'ombra che scappava verso ${owZn(z).split(' · ')[0]}. Chiedi a ${owNpcN(B.nid)}: quella notte non dormiva.»`;
    B.ln=`«L'ombra ha un nome: ${H.nm}. Si nasconde in ${owZn(z)}. ${H.tr.map(x=>OWTR[x].h).join(' ')}»`;
    steps.push(A,B,H);trophy='Prova del colpevole: '+H.nm}
  else if(ar==='assedio'){const all=OWCIV.concat(OWOUT);const[z,lv]=pick(all);zlv=lv;const pl=p2(OWPLACE[z]||['il campo']),w=3+(tgt>=8?1:0)+(hon?1:0),H=hunt(z,{es:0});
    ti='Difendi '+pl;tx=`«Stanotte, forse domani: verranno a prendersi ${pl}, in ${owZn(z)}. Sono tanti, arrivano a ondate, e alla fine arriverà anche chi li guida, ${H.nm}. Resta lì finché non è finita.»`;
    steps.push({k:'def',z,pl,w,wv:0,nm:H.nm,tr:H.tr,t:H.t});trophy='Stendardo di '+H.nm}
  else if(ar==='comm'){const rk=Object.keys(OWRES);const[rz]=pick(rk.map(k=>[k,OWRES[k][1]]));const R=OWRES[rz],n=R[0]==='campi'||R[0]==='nord'?r2(5,8):r2(3,5);const[z,lv]=pick(OWOUT);zlv=Math.max(lv,R[1]);const H=hunt(z,{es:r2(1,2)});const pz=p2(OWTRO);
    ti='Commissione: '+RESN[rz]+' e '+pz.toLowerCase();tx=`«Mi servono ${n} ${RESN[rz].toLowerCase()} da ${owZn(R[0]).split(' · ')[0]} e ${pz==='Stendardo'?'lo stendardo':'il '+pz.toLowerCase()} di ${H.nm}, che si aggira in ${owZn(z)}. Non chiedere a cosa servono: paga la Gilda, e paga bene.»`;
    steps.push({k:'gath',r:rz,z:R[0],n,c:0},H);trophy=pz+' di '+H.nm}
  else{const id=p2(OWDG.filter(d=>DG[d].lv<=tgt+3).concat(['tana'])),L=DG[id].fls,z1=id+'@1',zl=id+'@'+L;zlv=DG[id].lv+L-1;const rel=p2(OWREL1)+' '+p2(OWREL2);
    const H=hunt(z1,{es:2});const G=hunt(zl,{es:r2(2,3)});
    ti='Spedizione: '+DG[id].n;tx=`«In fondo a ${DG[id].n}, al piano ${L}, c'è ${rel}. All'ingresso fa la guardia ${H.nm}: senza di lui di mezzo, il resto è solo una lunga discesa. Riportami la reliquia e la tua parte è assicurata.»`;
    steps.push(H,{k:'relic',z:zl,nm:rel,g:G});trophy='Calco · '+owCap(rel)}
  steps.push({k:'back'});
  const trn=steps.reduce((a,s)=>a+(s.tr?s.tr.length:0)+(s.g?s.g.tr.length:0),0);
  let st=1+Math.max(0,Math.round((zlv-plv+1)/2.5))+Object.keys(mods).length+(trn>=3?1:0)+(steps.length>=4?1:0);st=clamp(st,1,5);if(hon)st=Math.max(st,4);
  const k=1+Object.keys(mods).reduce((a,m)=>a+OWMOD[m].k,0),lv=Math.max(plv,zlv);
  const rw={g:Math.round((35+lv*22)*st*k*(1+.08*tier)),xp:Math.round((25+lv*lv*5)*(.5+st*.35)*k),rm:[0,0,1,1,2,3][st],sl:p2(F.sl),rep:6+st*6,tro:trophy};
  return{id:seed,fa:fk,pat,ar:kind,ti,tx,st,lv:zlv,steps,si:0,mods,rw,hon:hon?1:0}}

/* ---- la bacheca ---- */
function owFix(o){o=o&&typeof o==='object'?o:{};o.salt=o.salt||uid();o.day=o.day|0;o.off=Array.isArray(o.off)?o.off:[];o.act=Array.isArray(o.act)?o.act:[];o.rep=o.rep||{};o.done=o.done|0;o.fail=o.fail|0;o.log=Array.isArray(o.log)?o.log:[];return o}
function owRefresh(force){if(!P||!P.ow)return;const d=gDay();if(!force&&P.ow.day===d&&P.ow.off.length)return;P.ow.day=d;
  const best=Math.max(0,...OWFK.map(f=>owTier(P.ow.rep[f])));const n=4;P.ow.off=[];
  for(let i=0;i<n;i++)P.ow.off.push(owGen(P.ow.salt+'-'+d+'-'+i,P.lv,best,0));
  if(best>=2)P.ow.off.push(owGen(P.ow.salt+'-'+d+'-h',P.lv,best,1))}
function owStepTxt(C,s,long){s=s||owCur(C);if(!s)return'';switch(s.k){
  case 'talk':return`Parla con ${owNpcN(s.nid)} (${owZn(s.z).split(' · ')[0]})`;
  case 'hunt':return`Elimina ${s.nm} · ${owZn(s.z)}${long?' ('+E[s.t].n+', Campione: '+s.tr.map(x=>OWTR[x].n.toLowerCase()).join(', ')+')':''}`;
  case 'cull':return`Elimina ${E[s.t].n} · ${owZn(s.z)}: ${s.c|0}/${s.n}`;
  case 'relic':return`Recupera ${s.nm} · ${owZn(s.z)}`;
  case 'gath':return`Raccogli ${RESN[s.r]} (${owZn(s.z).split(' · ')[0]}): ${s.c|0}/${s.n}`;
  case 'def':return`Difendi ${s.pl} · ${owZn(s.z)}${s.wv?' — ondata '+Math.min(s.wv,s.w)+'/'+s.w:''}`;
  case 'back':return'Torna alla Bacheca dei Contratti (Aldoria)';}return''}
function owTake(i){if(!owOn())return;const C=P.ow.off[i];if(!C)return;if(P.ow.act.length>=3){msg('Puoi tenere al massimo tre contratti alla volta');tone(150,.12);return}
  P.ow.off.splice(i,1);C.t0=gNow();if(C.mods.dl)C.dl=C.t0+DAYM;P.ow.act.push(C);banner('Contratto accettato',C.ti,'pergamena');jingle([67,71,74],.09,'triangle');
  clog('','Contratto accettato: '+C.ti,{sys:1});if(owCur(C).z===Zk)owSpawn(C);save();hud();OW.tab='act';pn('owb')}
function owDrop(i){if(!owOn())return;const C=P.ow.act[i];if(!C||!confirm('Rinunciare al contratto «'+C.ti+'»? La '+OWF[C.fa].n+' se lo ricorderà (reputazione −10).'))return;owFail(C,'Hai rinunciato')}
function owFail(C,why){const i=P.ow.act.indexOf(C);if(i<0)return;P.ow.act.splice(i,1);P.ow.rep[C.fa]=Math.max(0,(P.ow.rep[C.fa]|0)-10);P.ow.fail++;owClean(C);
  banner('Contratto fallito',why+': '+C.ti,'teschio');tone(110,.4,'sawtooth',.05);clog('','Contratto fallito ('+why.toLowerCase()+'): '+C.ti,{sys:1});save();hud();if(PM==='owb')pn('owb')}
function owClean(C){for(const e of ents.slice())if(e.owc===C.id){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1)}}
function owTurn(i){if(!owOn())return;const C=P.ow.act[i];if(!C||owCur(C).k!=='back')return;const R=C.rw;
  const it=uqNew(Math.max(P.lv,C.lv)+1,R.sl[Math.floor(Math.random()*R.sl.length)],R.rm,NET.name);
  if(P.inv.length>=INV){msg('Zaino pieno: fai spazio per la ricompensa ('+iname(it)+')');tone(150,.15);return}
  P.ow.act.splice(i,1);P.inv.push(it);P.g+=R.g;gainXP(R.xp);P.rep=P.rep||[];
  const t0=owTier(P.ow.rep[C.fa]);P.ow.rep[C.fa]=(P.ow.rep[C.fa]|0)+R.rep;const t1=owTier(P.ow.rep[C.fa]);P.ow.done++;
  P.rep.push(repFix({u:uid(),n:R.tro,d:C.ti+' · per la '+OWF[C.fa].n+', giorno '+gDay(),r:clamp(C.st-2,0,3),p:Math.round(15*C.st*Math.max(1,C.lv)),k:'tro'}));
  P.ow.log.unshift({ti:C.ti,st:C.st,fa:C.fa,d:gDay()});P.ow.log=P.ow.log.slice(0,12);
  if(cineOK()){banner('Contratto completato',C.ti+' · '+owStars(C.st),'trofeo');goldFly(R.g);itemFly(it)}else msg('Contratto completato: '+C.ti);
  jingle([60,64,67,72,76,79],.09,'triangle');clog('','Contratto completato: '+C.ti+' — '+R.g+' oro, '+R.xp+' XP, '+iname(it),{sys:1});
  if(t1>t0)setTimeout(()=>banner(OWF[C.fa].n,'Ora sei '+OWRT[t1][1].toLowerCase()+' presso la fazione','corona'),1600);
  OW.last=it.u;save();hud();pn('owb')}
// i passi avanti
function owNext(C,why){const s=owCur(C);if(!s)return;s.done=1;C.si++;const n=owCur(C);
  if(why)flt(P,why,'#ffd84a');jingle([72,76,79],.08,'triangle');
  msg('✦ '+C.ti+': '+owStepTxt(C,n));clog('','✦ '+C.ti+': '+owStepTxt(C,n),{sys:1});
  if(n&&n.z===Zk)owSpawn(C);save();hud()}

/* ---- nel mondo: bersagli, reliquie, assedi ---- */
// una casella raggiungibile, lontana dall'arrivo, sempre la stessa per lo stesso contratto
function owTile(seed,f0,f1,cx,cy){const rn=sd(hs(seed)),x0=cx==null?P.px|0:cx,y0=cy==null?P.py|0:cy,d=bfs(x0,y0);let mx=0;for(let i=0;i<d.length;i++)if(d[i]>mx)mx=d[i];
  const c=[];for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){const q=d[y*N+x];if(q<mx*f0||q>mx*f1||!WK(M[y][x]))continue;if(ents.some(o=>(o.k==='po'||o.k==='npc'||o.k==='owr'||o.k==='owm')&&Math.abs(o.px-x-.5)<2&&Math.abs(o.py-y-.5)<2))continue;c.push([x,y])}
  if(!c.length)return nearFree(x0,y0);return c[Math.floor(rn()*c.length)]}
function owRing(cx,cy,r0,r1){const d=bfs(cx,cy),c=[];for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){const q=d[y*N+x];if(q<0||!WK(M[y][x]))continue;const r=Math.hypot(x-cx,y-cy);if(r>=r0&&r<=r1)c.push([x,y])}return c.length?c[Math.floor(Math.random()*c.length)]:nearFree(cx,cy)}
let OWID=21000;
function owMob(C,t,x,y,o={}){const e=mk(t,x,y,OWID++);e.owc=C.id;if(o.el)eliteMk(e);if(o.al)e.al=1;ents.push(e);return e}
function owNamed(C,s,x,y){const e=owMob(C,s.t,x,y,{el:1});e.n=s.nm;e.owt=1;e.owtr=s.tr.slice();const k=1+.22*C.st;e.hp=e.mx=Math.round(e.mx*k);
  for(const tr of s.tr){if(tr==='corazzato')e.hp=e.mx=Math.round(e.mx*1.6);if(tr==='furioso'){e.at*=1.3;e.cd*=.85}if(tr==='rapido')e.sp*=1.35}
  return e}
function owSpawn(C){const s=owCur(C);if(!s||s.z!==Zk||!ZZ)return;owClean(C);const ax=P.px|0,ay=P.py|0;
  if(s.k==='hunt'||s.k==='relic'){const G=s.k==='hunt'?s:s.g,[x,y]=owTile(C.id+'|'+C.si+'|'+Zk,.55,.98,ax,ay);
    if(s.k==='relic')ents.push({k:'owr',n:owCap(s.nm),px:x+.5,py:y+.5,owc:C.id});
    const[hx,hy]=s.k==='relic'?nearFree(x,y):[x,y];owNamed(C,G,hx,hy);
    const en=owEnOf(Zk);for(let i=0;i<(G.es|0)*(C.mods.hd?2:1);i++){const[u,v]=nearFree(hx+((i%3)-1)*2,hy+((i/3|0)-1)*2);owMob(C,en[i%en.length],u,v,{el:!!C.mods.el})}
    if(cineOK())msg('✦ '+(s.k==='hunt'?s.nm+' è in questa zona: segui la colonna di luce':owCap(s.nm)+' è in questa zona: segui la colonna di luce'))}
  else if(s.k==='cull'){const have=ents.filter(e=>e.k==='en'&&e.t===s.t).length,need=s.n-(s.c|0);for(let i=0;i<Math.max(0,need-have)+(C.mods.hd?4:0);i++){const[x,y]=owTile(C.id+'|cull|'+i,.25,.95,ax,ay);owMob(C,s.t,x,y)}}
  else if(s.k==='def'){if(s.x==null){const[x,y]=owTile(C.id+'|def|'+Zk,.3,.6,ax,ay);s.x=x;s.y=y}s.wv=0;s.on=0;s.nx=0;ents.push({k:'owm',n:owCap(s.pl),px:s.x+.5,py:s.y+.5,owc:C.id,col:OWF[C.fa].c})}}
function owWave(C,s){s.wv++;const en=owEnOf(Zk),n=3+s.wv+(C.mods.hd?3:0);const last=s.wv>=s.w;
  for(let i=0;i<n;i++){const[x,y]=owRing(s.x,s.y,5,9);const e=owMob(C,en[i%en.length],x,y,{al:1,el:!!C.mods.el&&i===0});e.oww=1}
  if(last){const[x,y]=owRing(s.x,s.y,6,9);const e=owNamed(C,s,x,y);e.oww=1;e.al=1}
  banner(last?'Ultima ondata':'Ondata '+s.wv+' di '+s.w,last?s.nm+' guida l\'assalto':'Difendi '+s.pl,'spade');tone(90,.5,'sawtooth',.06);hud()}
const owNoPot=()=>owOn()&&P.ow.act.some(C=>C.mods.np&&owCur(C)&&owCur(C).z===Zk&&owCur(C).k!=='back');

/* ---- agganci al gioco ---- */
const _loadPost714=loadPost;loadPost=function(k){_loadPost714(k);if(!OW.on||MODE!=='story'||!P||!started)return;P.ow=owFix(P.ow);owEnter(k)};
function owEnter(k){if(!owOn())return;
  if(k==='town'&&!ents.some(e=>e.k==='owb')){const[x,y]=nearFree(37,41);ents.push({k:'owb',n:'Bacheca dei Contratti',px:x+.5,py:y+.5})}
  for(const C of P.ow.act)if(owCur(C)&&owCur(C).z===k)owSpawn(C)}
ITK.add('owb');ITK.add('owr');
const _act714o=act;act=function(e){if(e&&e.k==='owb'&&owOn()){owRefresh();pn('owb');tone(300,.1,'triangle');return}
  if(e&&e.k==='owr'&&owOn()){const C=P.ow.act.find(c=>c.id===e.owc),s=owCur(C);const i=ents.indexOf(e);if(i>=0)ents.splice(i,1);
    if(C&&s&&s.k==='relic'){if(cineOK())sparks(e.px,e.py,24,['#ffd84a','#fff2a0'],100);owNext(C,owCap(s.nm)+'!')}return}
  _act714o(e)};
const _kill714o=kill;kill=function(e){const ok=owOn()&&e&&e.k==='en'&&ents.includes(e);_kill714o(e);if(!ok)return;
  for(const C of P.ow.act.slice()){const s=owCur(C);if(!s)continue;
    if(s.k==='hunt'&&e.owc===C.id&&e.owt){owNext(C,s.nm+' è caduto!');continue}
    if(s.k==='cull'&&e.t===s.t&&Zk===s.z){s.c=(s.c|0)+1;if(s.c>=s.n)owNext(C,'Zona ripulita!');else hud()}}};
const _gather714=gather;gather=function(e){const r=e&&e.r;_gather714(e);if(!owOn())return;for(const C of P.ow.act){const s=owCur(C);if(s&&s.k==='gath'&&s.r===r){s.c=(s.c|0)+1;if(s.c>=s.n)owNext(C,'Materiale raccolto!');else hud()}}};
const _npcHTML714=npcHTML;npcHTML=function(e){let h=_npcHTML714(e);if(!owOn()||!e||e.slp)return h;
  if(OW.clue&&OW.clue.nid!==e.nid)OW.clue=null;
  for(const C of P.ow.act){const s=owCur(C);if(s&&s.k==='talk'&&s.nid===e.nid&&s.z===Zk){const ln=s.ln;OW.clue={nid:e.nid,h:`<div class="owclue"><b style="color:${OWF[C.fa].c}">✦ ${esc(C.ti)}</b><p>${esc(ln)}</p></div>`};owNext(C,'Nuova pista');break}}
  return OW.clue?OW.clue.h+h:h};
// il patto «spinato», la rigenerazione, gli evocatori, gli scudi, le ondate e il tempo
const _hurtE714o=hurtE;hurtE=function(e,d,rem,cr){if(e&&e.owt&&!rem&&owOn()){e.owlh=t;if(e.owtr.includes('spinato')&&P.hp>0){const x=Math.max(1,Math.round(d*.12));P.hp-=x;flt(P,'-'+x+' 🌵','#ff9a9a');if(P.hp<=0){die();return}}}_hurtE714o(e,d,rem,cr)};
const _upd714o=upd;upd=function(dt){_upd714o(dt);if(!owOn())return;OW.lt+=dt;
  for(const e of ents){if(!e.owt||e.k!=='en'||e.hp<=0)continue;const T=e.owtr;
    if(T.includes('rigenera')&&t-(e.owlh||0)>3&&e.hp<e.mx)e.hp=Math.min(e.mx,e.hp+e.mx*.03*dt);
    if(T.includes('scudato')&&e.al&&t>(e.owsh||0)){e.owsh=t+9;e.shd=t+2;flt(e,'Scudo!','#9adcff')}
    if(T.includes('evocatore')&&e.al&&t>(e.owev||0)){if(e.owev){const C=P.ow.act.find(c=>c.id===e.owc);if(C&&ents.filter(o=>o.owc===C.id&&o.owsm).length<6){const en=owEnOf(Zk);for(let i=0;i<2;i++){const[x,y]=nearFree(e.px|0,e.py|0);const m=owMob(C,en[(i+(e.id|0))%en.length],x,y,{al:1});m.owsm=1;if(e.oww)m.oww=1}flt(e,'Rinforzi!','#ffb84a');tone(200,.2,'sawtooth',.04)}}e.owev=t+12}}
  if(OW.lt<.5)return;OW.lt=0;
  for(const C of P.ow.act.slice()){const s=owCur(C);if(!s)continue;
    if(C.dl&&gNow()>C.dl){owFail(C,'Tempo scaduto');continue}
    if(s.k==='def'&&s.z===Zk&&s.x!=null){const near=Math.hypot(P.px-s.x-.5,P.py-s.y-.5)<3.2;
      if(!s.on&&near){s.on=1;s.wv=0;owWave(C,s)}
      else if(s.on&&!ents.some(e=>e.k==='en'&&e.owc===C.id&&e.oww)){if(s.wv>=s.w){owClean(C);owNext(C,owCap(s.pl)+' è salvo!')}else if(!s.nx){s.nx=t+3;msg('Ondata respinta! Preparati: ne arriva un\'altra.')}else if(t>s.nx){s.nx=0;owWave(C,s)}}}}};
// le colonne di luce sopra bersagli, reliquie, testimoni e luoghi da difendere; la bacheca, la reliquia e lo stendardo
function owBeam(x,y,c){const u=Math.sin(t*3+x)*.08;g.globalAlpha=.16+u;box(x-.09,y-.09,0,.18,.18,170,c,1.4);g.globalAlpha=.08+u/2;box(x-.2,y-.2,0,.4,.4,120,c,1.2);g.globalAlpha=1}
const _ent714=ent;ent=function(e){if(!e)return;
  if(e.k==='owb'){_ent714(Object.assign({},e,{k:'board'}));const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.textAlign='center';g.font='bold 11px Georgia,serif';label('✦ Contratti',sx,sy-58,'#ffd84a');
    if(owOn()&&P.ow.act.some(C=>owCur(C)&&owCur(C).k==='back'))owBeam(e.px,e.py,'#ffd84a');return}
  if(e.k==='owr'){const u=Math.sin(t*3+e.px)*2;drawL([[-.22,-.16,0,.44,.32,9,'#4a3a6a'],[-.24,-.18,9,.48,.36,3,'#d4af37'],[-.07,-.07,14+u,.14,.14,9,'#ffe08a']],e.px,e.py,0,0);owBeam(e.px,e.py,'#ffd84a');
    if(cineOK()&&SET.ultra)GLOW.push([e.px,e.py,26,60,'255,220,120',.3]);const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.textAlign='center';g.font='bold 11px Georgia,serif';label('✦ '+e.n,sx,sy-40,'#ffd84a');return}
  if(e.k==='owm'){drawL([[-.05,-.05,0,.1,.1,40,'#5a4a3a'],[.05,-.03,26,.42,.05,14,e.col||'#ffd84a'],[-.3,-.3,0,.6,.6,1,'#8a6a42']],e.px,e.py,0,0);owBeam(e.px,e.py,e.col||'#ffd84a');
    const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);g.textAlign='center';g.font='bold 11px Georgia,serif';label('✦ Difendi '+e.n,sx,sy-52,'#ffd84a');return}
  _ent714(e);if(!owOn())return;
  if(e.k==='en'&&e.owt){owBeam(e.px,e.py,'#ff6a4a');const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0),top=(e.m&&e.m.top?e.m.top:40)+6;g.textAlign='center';g.font='bold 11px Georgia,serif';label('☠ '+e.n,sx,sy-top-24,'#ff9a7a')}
  else if(e.k==='npc'&&P.ow.act.some(C=>{const s=owCur(C);return s&&s.k==='talk'&&s.nid===e.nid&&s.z===Zk}))owBeam(e.px,e.py,'#9adcff')};
// il resoconto in alto a destra
let OWQh='';
const _hud714=hud;hud=function(){_hud714();if(!P||!$('qt'))return;if(!owOn()){if(OWQh){OWQh='';QTh=null;_hud714()}return}
  let q='';for(const C of P.ow.act){const s=owCur(C);let dl='';if(C.dl){const m=Math.max(0,C.dl-gNow());dl=` <small style="color:#ff9a9a">⏳ ${Math.floor(m/60)}h ${String(Math.floor(m%60)).padStart(2,'0')}m</small>`}
    q+=`<span style="color:${OWF[C.fa].c}">✦</span> ${esc(C.ti)}: <b>${esc(owStepTxt(C,s))}</b>${dl}<br>`}
  if(!P.ow.act.length)q+=`<span style="color:#ffd84a">✦</span> <b>Visita la Bacheca dei Contratti in piazza</b><br>`;
  const all=q+(QTh||'');if(all!==OWQh){OWQh=all;$('qt').innerHTML=all}};

/* ---- il pannello della bacheca ---- */
function owCard(C,i,mode){const F=OWF[C.fa],R=C.rw,mods=Object.keys(C.mods);
  let h=`<div class="owc${C.hon?' owh':''}"><div class="owt"><b>${esc(C.ti)}</b><span class="ows">${owStars(C.st)}</span></div>
  <div class="owf"><span style="color:${F.c}">${esc(F.n)}</span> · ${esc(owCap(C.pat))}${C.hon?' · <b style="color:#ffae2b">contratto d\'onore</b>':''}</div><p class="owi">${esc(C.tx)}</p>
  <ol class="owl">${C.steps.map((s,j)=>`<li class="${j<C.si?'ok':j===C.si&&mode==='act'?'cur':''}">${esc(owStepTxt(C,s,1))}</li>`).join('')}</ol>
  ${mods.length?`<p class="owm">${mods.map(m=>`<span title="${esc(OWMOD[m].d)}">⚠ ${esc(OWMOD[m].n)}: ${esc(OWMOD[m].d)}</span>`).join('')}</p>`:''}
  <p class="owr">Livello consigliato ${C.lv} · 💰 ${R.g} · ✨ ${R.xp} XP · ✦ un oggetto ${['unico','unico raro o meglio','unico epico o meglio','unico leggendario'][R.rm]} · 🏺 ${esc(R.tro)} · reputazione +${R.rep}</p>`;
  if(mode==='off')h+=`<button onclick="owTake(${i})">✔ Accetta</button>`;
  else if(mode==='act'){if(owCur(C).k==='back')h+=`<button class="owgo" onclick="owTurn(${i})">💰 Riscuoti la ricompensa</button>`;h+=`<button onclick="owDrop(${i})">Rinuncia</button>`}
  return h+'</div>'}
function owHTML(){if(!P||!P.ow)return'';owRefresh();const O=P.ow,tb=OW.tab;
  const tab=(k,n)=>`<button class="owtb${tb===k?' on':''}" onclick="OW.tab='${k}';pn('owb')">${n}</button>`;
  let h=`<h3>✦ Bacheca dei Contratti</h3><div class="owtabs">${tab('off','Offerte ('+O.off.length+')')}${tab('act','In corso ('+O.act.length+'/3)')}${tab('rep','Reputazione')}${tab('bag','Reperti ('+(P.rep||[]).length+')')}</div>`;
  if(tb==='off'){h+=`<p class="mu">Giorno ${gDay()}: i contratti cambiano ogni giorno. Ogni contratto è unico: un committente, un luogo, un bersaglio con nome e i suoi punti di forza.</p>`;
    h+=O.off.length?O.off.map((C,i)=>owCard(C,i,'off')).join(''):'<p class="mu">Per oggi non c\'è altro: torna domani.</p>'}
  else if(tb==='act'){h+=O.act.length?O.act.map((C,i)=>owCard(C,i,'act')).join(''):'<p class="mu">Nessun contratto in corso: scegline uno fra le offerte.</p>'}
  else if(tb==='rep'){h+=`<p class="mu">Contratti completati ${O.done} · falliti ${O.fail}. Con la reputazione alta le ricompense crescono, e da «Stimato» in su la bacheca propone ogni giorno un contratto d'onore.</p>`;
    h+=OWFK.map(k=>{const v=O.rep[k]|0,ti=owTier(v),nx=OWRT[ti+1];return`<div class="owrep"><b style="color:${OWF[k].c}">${esc(OWF[k].n)}</b><span>${OWRT[ti][1]} · ${v}${nx?' / '+nx[0]:''}</span><div class="owbar"><i style="width:${nx?Math.round((v-OWRT[ti][0])/(nx[0]-OWRT[ti][0])*100):100}%;background:${OWF[k].c}"></i></div></div>`}).join('');
    if(O.log.length)h+=`<h4>Ultimi contratti</h4>`+O.log.map(l=>`<div class="mu">${owStars(l.st)} ${esc(l.ti)} · giorno ${l.d}</div>`).join('')}
  else{const L=P.rep||[];h+=`<p class="mu">I reperti non si indossano: si collezionano, si scambiano con gli altri eroi (anche dalla finestra di scambio) o si vendono qui alla bacheca per il loro valore.</p>`;
    h+=L.length?L.map((x,i)=>`<div class="it"><span>${repFmt(x)}${repLine(x)}</span><span><button onclick="owSellRep(${i})">Vendi</button></span></div>`).join(''):'<p class="mu">Ancora nessun reperto: li danno i contratti.</p>'}
  return h+`<button onclick="cl()">Chiudi</button>`}
function owSellRep(i){const L=P.rep||[],x=L[i];if(!x||!confirm('Vendere «'+x.n+'» per '+x.p+' oro?'))return;L.splice(i,1);P.g+=x.p|0;goldFly(x.p|0);tone(800,.08,'triangle');save();hud();pn('owb')}
const _pn714=pn;pn=function(m,arg){if(m==='owb'&&owOn()){if(arg!==undefined)PA=arg;edPanel('owb',owHTML());return}_pn714(m,arg);
  if(m==='q'&&owOn()&&PM==='q'){const pe=$('pn');if(pe&&!pe.querySelector('.owq'))pe.insertAdjacentHTML('afterbegin',`<div class="owq"><h3>✦ Contratti</h3>${P.ow.act.length?P.ow.act.map(C=>`<p><b style="color:${OWF[C.fa].c}">${esc(C.ti)}</b> ${owStars(C.st)}<br>${esc(owStepTxt(C))}</p>`).join(''):'<p class="mu">Nessun contratto: la bacheca è in piazza, accanto all\'arrivo.</p>'}</div>`)}};

/* ---- avvio, salvataggio, menu ---- */
const _newP714=newP;newP=function(){const p=_newP714();if(OW.on){p.st=5;p.unl={rovine:1};p.ow=owFix(null);p.rep=[];p.g=80;p.pot=5;p.done={};p.seen={}}return p};
const _begin714=begin;begin=function(d,s){OW.on=!!OW.next;OW.next=0;if(!OW.on)document.body.classList.remove('owm');_begin714(d,s);if(!OW.on){uqFixAll();return}
  document.body.classList.add('owm');P.ow=owFix(P.ow);P.rep=Array.isArray(P.rep)?P.rep.map(repFix):[];P.unl=P.unl||{};P.unl.rovine=1;if(P.st<5)P.st=5;uqFixAll();owRefresh();
  if(!ents.some(e=>e.k==='owb'))owEnter(Zk);npcMarks();
  if(!s&&PM==='txt'){PA={ti:'Il Mondo aperto',tx:'Sono passati anni dalla caduta di Malakar. La Corona è di nuovo intera e il regno è aperto a chiunque abbia una spada e pochi scrupoli.\n\nIl lavoro si trova alla Bacheca dei Contratti, qui in piazza (la colonna di luce dorata indica i contratti da riscuotere). Ogni contratto è unico: un committente, un luogo, un bersaglio con nome e i suoi punti di forza. I testimoni ti dicono cosa ti aspetta: ascoltali.\n\nIl bottino del Mondo aperto è fatto di oggetti unici: ognuno ha il suo seme, i suoi poteri, la sua storia e il suo numero di serie. Sono la moneta degli scambi fra eroi: armi, armature, reperti e pozioni passano di mano dalla finestra di scambio.\n\nTasti: J missioni e contratti, I zaino, R interagisci, Q pozione.'};pn('txt')}
  hud();save()};
const _save714=save;save=function(){if(!P||!started||MODE!=='story'){_save714();return}const s0=LS.set;
  LS.set=function(k,v){if(k===SAVEK&&v&&v.p){v.p.rep=P.rep||[];if(OW.on){v.p.ow=P.ow;v.p.tw=P.tw;v.ow=1;k=OWK}}return s0.call(LS,k,v)};try{_save714()}finally{LS.set=s0}};
const _die714o=die;die=function(){if(!OW.on){_die714o();return}const d0=LS.del;LS.del=function(k){return d0.call(LS,k===SAVEK?OWK:k)};try{_die714o()}finally{LS.del=d0}};
const _toMenu714=toMenu;toMenu=function(){_toMenu714();OW.on=false;document.body.classList.remove('owm');owMenu()};
function owNew(d){const s=LS.get(OWK,null);if(s&&s.p){ovrOw(s,()=>owGo(d,null));return}owGo(d,null)}
function owCont(){const s=LS.get(OWK,null);if(!s||!s.p)return;owGo(s.df|0,s)}
// begin() legge nome e stanza dai campi della storia: li prestiamo per un attimo e poi li rimettiamo come erano
function owGo(d,s){const a=$('ownm'),b=$('owrc'),n=$('nm'),r=$('rc'),n0=n?n.value:'',r0=r?r.value:'';if(a&&n)n.value=a.value;if(b&&r)r.value=b.value;OW.next=1;try{begin(d,s)}finally{if(n)n.value=n0;if(r)r.value=r0}}
function owMenu(){const el=$('mowb');if(!el)return;const s=LS.get(OWK,null),st=LS.get(SAVEK,null);
  const nm=(s&&s.name)||($('nm')&&$('nm').value)||(st&&st.name)||'',rc=(s&&s.code)||($('rc')&&$('rc').value)||'';
  el.innerHTML=`<div class="hrow"><div class="hfld"><label>Nome<input id="ownm" maxlength="14" placeholder="Il tuo nome da eroe" value="${esc(nm)}"></label><label>Codice stanza<input id="owrc" maxlength="16" placeholder="Vuoto = da solo" value="${esc(rc)}"></label></div></div>
  <button class="mbtn" onclick="openLook()">${ico('pennello',24)}<span><b>Aspetto dell'eroe</b><small>Lo stesso della Modalità Storia.</small></span></button>
  ${s&&s.p?`<button class="mbtn cont" onclick="owCont()">${ico('gioca',24)}<span><b>Continua: ${esc(s.name)}</b><small>Livello ${s.p.lv|0} · ${DFS[s.df]?DFS[s.df].n:''} · contratti completati ${(s.p.ow&&s.p.ow.done)|0} · salvato ${esc(new Date(s.t).toLocaleString('it-IT'))}</small></span></button>`:''}
  <h4>Nuovo mondo</h4><div class="dgrid">${DFS.map((D,i)=>`<button class="dcard d${i}" onclick="owNew(${i})"><b>${esc(D.n)}</b><small>${['Nemici più deboli, più bottino.','L\'esperienza bilanciata.','Nemici resistenti, meno bottino.','Morte permanente: se cadi, il mondo si cancella.'][i]||''}</small></button>`).join('')}</div>`;iconFill(el)}
document.getElementById('msel')&&document.getElementById('msel').insertAdjacentHTML('beforeend',`<button class="mode ow" onclick="mode('ow')"><i class="nw3">ANTEPRIMA</i><b>🌅 Tomorrow</b><small>Un mondo nuovo e senza confini, generato mentre cammini: villaggi, dungeon e mostri sempre diversi, contratti nati da zero, armi e armature uniche da scambiare con gli altri eroi.</small></button>`);
document.getElementById('mparco')&&document.getElementById('mparco').insertAdjacentHTML('afterend',`<div id="mow" hidden><button class="mback" onclick="mode('')">← Torna alle modalità</button><section class="mpan"><h3>🌅 Tomorrow <small class="mu">anteprima</small></h3><p class="lore">Oltre i confini del regno si apre una terra che nessuna mappa ha mai disegnato. Si genera mentre cammini e non finisce mai: boschi, prati, deserti, vette innevate e lande di cenere, villaggi da scoprire, dungeon che nessuno ha mai visto e mostri che difficilmente incontrerai due volte. Più ti allontani dal villaggio di partenza, più il mondo è pericoloso e il bottino prezioso. Ogni contratto delle bacheche dei villaggi nasce da zero, e ogni arma, elmo, corazza e scudo è un pezzo unico.</p><div id="mowb"></div><p class="mnote">Tomorrow ha un eroe e un salvataggio tutti suoi: la tua partita della storia non viene toccata. Con un codice stanza giocate tutti nello stesso mondo e potete scambiare oggetti unici, reperti, oro e pozioni.</p></section></div>`);
const _mode714=mode;mode=function(m){const w=$('mow');if(m==='ow'){$('msel').hidden=true;$('mstory').hidden=true;$('mdim').hidden=true;const pc=$('mparco');if(pc)pc.hidden=true;if(w){w.hidden=false;owMenu();menuAnim(w)}tone(520,.05,'triangle');return}if(w)w.hidden=true;_mode714(m)};
document.head.insertAdjacentHTML('beforeend',`<style>
#msel .mode.ow{border-color:#ffae2b;background:linear-gradient(160deg,rgba(80,50,10,.85),rgba(20,40,60,.85))}
#msel .mode i.nw3{position:absolute;top:8px;right:10px;font:bold 10px system-ui,sans-serif;background:#ffae2b;color:#2a1800;padding:2px 7px;border-radius:9px;font-style:normal}
#mow h4{margin:12px 0 6px;color:#f5b942}#mow .hrow{margin-bottom:8px}
.owtabs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 10px}.owtb{opacity:.7}.owtb.on{opacity:1;border-color:#ffd84a!important;color:#ffd84a}
.owc{border:1px solid #ffffff22;border-left:3px solid #ffd84a;background:rgba(255,255,255,.04);border-radius:8px;padding:9px 11px;margin:8px 0}
.owc.owh{border-left-color:#ffae2b;background:linear-gradient(160deg,rgba(90,60,10,.3),rgba(255,255,255,.03))}
.owt{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.owt b{font-size:15px}.ows{color:#ffd84a;letter-spacing:1px;white-space:nowrap}
.owf{font-size:12px;opacity:.85;margin:2px 0 4px}.owi{font-style:italic;line-height:1.45;margin:6px 0}
.owl{margin:4px 0 6px 18px;padding:0;font-size:13px;line-height:1.5}.owl li.ok{opacity:.55;text-decoration:line-through}.owl li.cur{color:#ffd84a;font-weight:bold}
.owm{display:flex;flex-direction:column;gap:2px;font-size:12px;color:#ff9a7a;margin:4px 0}.owr{font-size:12px;opacity:.9;margin:4px 0 6px}
.owgo{border-color:#ffd84a!important;color:#ffd84a}.owrep{margin:8px 0}.owrep span{float:right;font-size:12px;opacity:.85}
.owbar{height:6px;background:#ffffff1a;border-radius:3px;overflow:hidden;margin-top:4px}.owbar i{display:block;height:100%}
.owclue{border-left:3px solid #9adcff;background:rgba(154,220,255,.08);padding:6px 10px;margin:0 0 8px;border-radius:6px}.owclue p{margin:4px 0;font-style:italic}
.owq{border-bottom:1px solid #ffffff22;margin-bottom:8px}
</style>`);
