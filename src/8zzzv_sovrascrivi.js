/* ================= 7.50: SOVRASCRIVERE UNA PARTITA, CON DUE CONFERME =================
   Prima di cancellare una partita salvata (nuova partita della Storia, nuovo mondo di Tomorrow, nuovo viaggio della
   Dimension, «Da capo» in un mondo di Voxelia Studio o della community) il gioco chiede due volte, senza le finestre del
   browser:
   1) una schermata nel menu che mostra che cosa si perde (eroe, livello, difficoltà, oro, ultimo salvataggio).
      Il pulsante già scelto è «Annulla»; Esc o un clic fuori chiudono senza toccare niente;
   2) un avviso in basso che chiede di confermare la perdita dei dati. Il suo pulsante si sblocca dopo un attimo, così un
      doppio clic non passa per sbaglio, e se non lo premi entro 12 secondi l'avviso sparisce e la partita resta. */
const OVR={go:null,o:null,tm:0,ul:0,bye:0};
const OVR_T=12000,OVR_LOCK=1500;
function ovrWhen(t){if(!t)return'';const d=new Date(t),n=new Date(),hm=d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}),
    g=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime(),dd=Math.round((g(n)-g(d))/864e5);
  return dd===0?'oggi alle '+hm:dd===1?'ieri alle '+hm:'il '+d.toLocaleDateString('it-IT')+' alle '+hm}
function ovrOpen(){return!!(($('ovrm')&&!$('ovrm').hidden)||($('ovrt')&&!$('ovrt').hidden))}
// o: {ti titolo, cosa testo, eroe, lv, df, g oro, t ultimo salvataggio, ic icona, dati «i dati di…» per l'avviso, ok testo del pulsante}
function ovrAsk(o,go){ovrClose(1);OVR.go=go;OVR.o=o;let el=$('ovrm');
  if(!el){el=document.createElement('div');el.id='ovrm';document.body.appendChild(el);el.addEventListener('click',e=>{if(e.target===el)ovrClose()})}
  const r=[];if(o.lv)r.push('Livello '+o.lv);if(o.df)r.push(o.df);if(o.g!=null)r.push('💰 '+Number(o.g).toLocaleString('it-IT')+' oro');
  for(const x of o.righe||[])r.push(x);
  el.innerHTML=`<div class="ovb" role="alertdialog" aria-modal="true" aria-labelledby="ovrh" aria-describedby="ovrd">
    <div class="ovh"><span class="ovi" aria-hidden="true">⚠</span><h3 id="ovrh">${esc(o.ti)}</h3></div>
    <p id="ovrd">${esc(o.cosa)}</p>
    <div class="ovs"><span class="ovsi" aria-hidden="true">${o.ic||'🛡'}</span><span><b>${esc(o.eroe||'Partita salvata')}</b>${r.length?`<small>${esc(r.join(' · '))}</small>`:''}${o.t?`<small>Ultimo salvataggio ${esc(ovrWhen(o.t))}</small>`:''}</span></div>
    <p class="ovw">Una partita sovrascritta <b>non si può recuperare</b>.</p>
    <div class="ovbt"><button class="ovno" onclick="ovrClose()">Annulla, tieni la partita</button><button class="ovyes" onclick="ovrStep2()">${esc(o.ok||'Sovrascrivi')}…</button></div></div>`;
  el.hidden=false;try{tone(330,.08,'triangle',.04)}catch(_){}setTimeout(()=>{const b=el.querySelector('.ovno');if(b)b.focus()},30)}
// il secondo passo: l'avviso in basso che conferma la perdita dei dati
function ovrStep2(){const o=OVR.o;if(!o||!OVR.go)return;const m=$('ovrm');if(m)m.hidden=true;let el=$('ovrt');
  if(!el){el=document.createElement('div');el.id='ovrt';document.body.appendChild(el)}
  el.className='';el.setAttribute('role','alertdialog');el.setAttribute('aria-labelledby','ovrth');el.setAttribute('aria-describedby','ovrtd');
  el.innerHTML=`<div class="otx"><b id="ovrth">⚠ Ultima conferma</b><span id="ovrtd">${esc(o.dati||'I dati di questa partita')} verranno <b>cancellati per sempre</b>.</span></div>
    <div class="otb"><button class="otno" onclick="ovrClose()">Annulla</button><button class="otyes" onclick="ovrDo()" disabled>Cancella i dati</button></div><i class="otbar"></i>`;
  el.hidden=false;OVR.ul=performance.now()+OVR_LOCK;clearTimeout(OVR.tm);clearTimeout(OVR.bye);
  const bar=el.querySelector('.otbar');bar.style.animationDuration=OVR_T+'ms';
  setTimeout(()=>{const b=el.querySelector('.otyes');if(b&&!el.hidden&&OVR.go)b.disabled=false},OVR_LOCK);
  OVR.tm=setTimeout(()=>ovrClose(0,'Tempo scaduto: nessun dato cancellato.'),OVR_T);
  try{tone(220,.12,'square',.03)}catch(_){}setTimeout(()=>{const b=el.querySelector('.otno');if(b)b.focus()},30)}
function ovrDo(){const go=OVR.go;if(!go||performance.now()<OVR.ul)return;
  // se nel frattempo è partita un'altra partita, non si cancella niente
  if(typeof started!=='undefined'&&started){ovrClose(0,'Sei già in partita: nessun dato cancellato.');return}
  OVR.go=null;ovrClose(1);go()}
// chiude tutto; con «avviso» l'avviso in basso resta un attimo a dire che la partita è salva
function ovrClose(quiet,avviso){const had=!!OVR.go;OVR.go=null;clearTimeout(OVR.tm);const m=$('ovrm');if(m)m.hidden=true;const el=$('ovrt');if(!el)return;
  if(quiet||!had||el.hidden){el.hidden=true;return}
  el.className='safe';el.removeAttribute('role');el.innerHTML=`<div class="otx"><b>✔ ${esc(avviso||'Annullato: nessun dato cancellato.')}</b><span>La tua partita è al sicuro.</span></div>`;
  clearTimeout(OVR.bye);OVR.bye=setTimeout(()=>{el.hidden=true},2600)}
// i casi del gioco
function ovrStory(s,go){ovrAsk({ti:'Sovrascrivere la partita?',cosa:'Stai per iniziare una nuova partita della Modalità Storia. Prende il posto di quella salvata:',
  eroe:s.name,lv:s.p.lv,df:DFS[s.df|0]&&DFS[s.df|0].n,g:s.p.g,t:s.t,ic:'👑',dati:'I dati di '+(s.name||'questo eroe')+' (livello '+s.p.lv+')',ok:'Sì, nuova partita'},go)}
function ovrOw(s,go){ovrAsk({ti:'Sovrascrivere il mondo di Tomorrow?',cosa:'Stai per iniziare un nuovo mondo di Tomorrow. Il mondo salvato, con il suo eroe, le terre e le città, viene sostituito:',
  eroe:s.name,lv:s.p.lv,df:DFS[s.df|0]&&DFS[s.df|0].n,g:s.p.g,t:s.t,ic:'🌍',dati:'Il mondo di '+(s.name||'questo eroe')+' (livello '+s.p.lv+')',ok:'Sì, nuovo mondo'},go)}
function ovrDim(){const sv=LS.get(DIMK,null);if(!sv){beginDim(true);return}const d=sv.d||{},n=Object.keys(d.era||{}).length;
  ovrAsk({ti:'Sovrascrivere il viaggio?',cosa:'Stai per iniziare un nuovo viaggio di Voxelia Dimension. Il viaggio salvato ricomincia dalla cabina:',
    eroe:'Il viaggio salvato',righe:[n?n+(n===1?' epoca visitata':' epoche visitate'):'Appena cominciato'],t:sv.t,ic:'🌀',dati:'I dati del viaggio salvato',ok:'Sì, nuovo viaggio'},()=>beginDim(true))}
function ovrEdW(id){const w=(typeof edIdx==='function'?edIdx():[]).find(q=>q.id===id),sv=LS.get(EDSK+id,null),nm=w?w.name:'questo mondo';
  ovrAsk({ti:'Ricominciare da capo?',cosa:'La partita salvata in questo mondo di Voxelia Studio viene cancellata. Il mondo, con mappe e missioni, resta com\'è:',
    eroe:nm,t:sv&&sv.t,ic:'🧱',dati:'La tua partita in «'+nm+'»',ok:'Sì, da capo'},()=>edPlayId(id,1))}
function ovrMbW(id){const d=typeof MB!=='undefined'&&MB.d&&MB.d.id===id?MB.d:null,sv=LS.get(EDSK+'pub_'+id,null),nm=d?d.n:'questo mondo';
  ovrAsk({ti:'Ricominciare da capo?',cosa:'La tua partita in questo mondo della community viene cancellata. Il mondo resta com\'è:',
    eroe:nm,t:sv&&sv.t,ic:'🌐',dati:'La tua partita in «'+nm+'»',ok:'Sì, da capo'},()=>mbPlay(id,1))}
// tastiera: Esc annulla, Tab resta dentro la schermata; la Corona non sente niente mentre si decide
addEventListener('keydown',e=>{if(!ovrOpen())return;const m=$('ovrm'),t=$('ovrt');
  if(e.key==='Escape'){ovrClose();e.preventDefault();e.stopImmediatePropagation();return}
  if(e.key==='Tab'&&m&&!m.hidden){const b=[...m.querySelectorAll('button')];if(!b.length)return;const i=b.indexOf(document.activeElement),j=e.shiftKey?(i<=0?b.length-1:i-1):(i<0||i>=b.length-1?0:i+1);b[j].focus();e.preventDefault()}
  if(m&&!m.hidden||t&&!t.hidden&&t.contains(document.activeElement))e.stopImmediatePropagation()},true);
if(typeof crBusy==='function'){const _crBusy750=crBusy;crBusy=function(){if(ovrOpen())return true;const v=$('vmenu');if(v&&!v.hidden)return true;return _crBusy750()}}
(function(){const st=document.createElement('style');st.textContent=`
#ovrm{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;background:#000b;padding:max(12px,env(safe-area-inset-top,0px)) max(12px,env(safe-area-inset-right,0px)) max(12px,env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px))}#ovrm[hidden],#ovrt[hidden]{display:none}
.ovb{width:min(460px,94vw);display:flex;flex-direction:column;gap:10px;background:linear-gradient(160deg,#2a1420,#110a14);color:#f2e8ec;border:2px solid #e8524a;border-radius:6px;padding:16px 18px;box-shadow:0 10px 40px #000a,0 0 0 4px #e8524a22;animation:ovIn .18s ease-out}
.ovh{display:flex;align-items:center;gap:10px}.ovh h3{margin:0;color:#ffb3a8;font-size:20px}.ovi{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#e8524a;color:#fff;font-size:19px;flex:none}
.ovb>p{margin:0;font-size:14px;line-height:1.45;color:#e6d6dc}
.ovs{display:flex;align-items:center;gap:12px;background:#0006;border:1px solid #ffffff1f;border-radius:4px;padding:10px 12px}.ovsi{font-size:26px}.ovs b{display:block;font-size:16px;color:#fff}.ovs small{display:block;color:#c3b0b8;font-size:12.5px;line-height:1.4}
.ovb .ovw{color:#ffb3a8}
.ovbt{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:4px}.ovbt button{margin:0;padding:9px 14px;font:inherit;font-size:14px;border-radius:3px;cursor:pointer}
.ovno{background:#2f3a5a;color:#fff;border:1px solid #f5b942}.ovno:hover,.ovno:focus-visible{background:#3d4a72;outline:2px solid #f5b942;outline-offset:1px}
.ovyes{background:transparent;color:#ffb3a8;border:1px solid #e8524a99}.ovyes:hover,.ovyes:focus-visible{background:#e8524a33;color:#fff;outline:2px solid #e8524a;outline-offset:1px}
#ovrt{position:fixed;left:50%;bottom:max(18px,calc(env(safe-area-inset-bottom,0px) + 12px));transform:translateX(-50%);z-index:71;width:min(560px,calc(100vw - 24px));box-sizing:border-box;display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  background:#1d0f16;color:#f2e8ec;border:2px solid #e8524a;border-radius:6px;padding:10px 14px 14px;box-shadow:0 8px 30px #000b;overflow:hidden;animation:otIn .22s ease-out;font-size:14px}
#ovrt .otx{flex:1 1 240px;display:flex;flex-direction:column;gap:2px;line-height:1.4}#ovrt .otx>b{color:#ffb3a8}
#ovrt .otb{display:flex;gap:8px;margin-left:auto}#ovrt button{margin:0;padding:8px 12px;font:inherit;border-radius:3px;cursor:pointer}
#ovrt .otno{background:#2f3a5a;color:#fff;border:1px solid #f5b942}#ovrt .otno:focus-visible{outline:2px solid #f5b942;outline-offset:1px}
#ovrt .otyes{background:#c8342c;color:#fff;border:1px solid #ff8a80}#ovrt .otyes:hover:not(:disabled),#ovrt .otyes:focus-visible{background:#e0443a;outline:2px solid #ff8a80;outline-offset:1px}
#ovrt .otyes:disabled{opacity:.45;cursor:wait}
#ovrt .otbar{position:absolute;left:0;bottom:0;height:4px;width:100%;background:#e8524a;transform-origin:left;animation:otBar linear forwards}
#ovrt.safe{border-color:#5ad67a;background:#0f1d14}#ovrt.safe .otx>b{color:#9cf0b0}
@keyframes ovIn{from{transform:scale(.94);opacity:0}}@keyframes otIn{from{transform:translate(-50%,20px);opacity:0}}@keyframes otBar{to{transform:scaleX(0)}}
@media(prefers-reduced-motion:reduce){.ovb,#ovrt{animation:none}}`;document.head.appendChild(st)})();
