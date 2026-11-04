/* ================= 7.54: QUANDO SI APRE UNA FINESTRA, L'EROE SI FERMA =================
   Prima, se una finestra si apriva mentre l'eroe camminava (un dialogo, la scelta della Torre, un pannello, la mappa),
   l'eroe continuava ad andare da solo sotto la finestra: finiva il percorso del clic, seguiva i tasti ancora premuti o il
   joystick rimasto «agganciato» quando la finestra copriva il dito. Ora:
   - all'apertura di una finestra (pannelli, mappa, impostazioni, aspetto) il percorso, il bersaglio, la corsa, i tasti
     di movimento e il joystick si azzerano;
   - finché una finestra è aperta i tasti di movimento e il joystick non muovono l'eroe;
   - un clic fuori da una finestra la chiude soltanto (prima la chiudeva e intanto faceva camminare o attaccare);
   - dopo una finestra del browser (conferme), quando la pagina si nasconde e quando il joystick perde il dito,
     i comandi si azzerano (prima un tasto lasciato andare in quel momento restava «premuto»). */
function stopMove(){if(typeof KEYS!=='undefined')for(const k in KEYS)KEYS[k]=0;
  if(P){P.path=[];P.tg=null;P.km=0}
  if(typeof ACT!=='undefined'){ACT.go=null;ACT.sh=0;ACT.run=0}
  if(typeof TCH!=='undefined'&&TCH.jid!=null){TCH.jid=null;TCH.jx=TCH.jy=TCH.mag=0;const z=$('tjz');if(z)z.classList.remove('on');try{touchStick(null)}catch(e){}}}
const overOpen=()=>{for(const id of['mappa','set','look','chg']){const el=$(id);if(el&&el.style.display&&el.style.display!=='none')return true}return false};
// all'apertura di una finestra
{const p0=pn;pn=function(m,arg){const was=PM;p0(m,arg);if(started&&PM&&!was)stopMove()}}
for(const f of['openMap','openSet','openLook']){if(typeof window[f]!=='function')continue;const f0=window[f];window[f]=function(){const r=f0.apply(this,arguments);if(started)stopMove();return r}}
// con una finestra aperta i comandi di movimento non muovono l'eroe
{const k0=keyDir;keyDir=function(){if(started&&(PM||overOpen()))return null;return k0()}}
// un clic fuori da una finestra la chiude e basta (gli scambi e la Torre hanno le loro regole)
addEventListener('pointerdown',ev=>{if(!started||!PM||PM==='trade'||PM==='treq'||PM==='torb')return;const tg=ev.target;if(!tg||tg.tagName!=='CANVAS'||(tg.closest&&tg.closest('#pn')))return;
  if(ev.button!=null&&ev.button!==0)return;ev.stopImmediatePropagation();ev.preventDefault();cl();stopMove()},true);
// le finestre del browser «mangiano» il tasto lasciato andare: dopo, i comandi si azzerano
for(const f of['confirm','alert','prompt']){const f0=window[f];if(typeof f0!=='function')continue;window[f]=function(){try{return f0.apply(window,arguments)}finally{if(started)stopMove()}}}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)stopMove()});
// il joystick: se perde il dito (la zona è stata coperta o nascosta), si rilascia
document.addEventListener('lostpointercapture',e=>{const z=e.target;if(!z||z.id!=='tjz'||typeof TCH==='undefined'||TCH.jid!==e.pointerId)return;TCH.jid=null;TCH.jx=TCH.jy=TCH.mag=0;z.classList.remove('on');try{touchStick(null)}catch(_){}},true);
// i compagni degli altri giocatori non si «cliccano» per sbaglio al posto di quello che c'è sotto
{const n0=nearAt;nearAt=function(L,mx,my){return n0(L===ents?L.filter(e=>e.k!=='rpet'):L,mx,my)}}
