/* ================= 7.39: LE FAZIONI DEI GIOCATORI =================
   In rete, nello stesso mondo di Tomorrow, i giocatori si uniscono in una fazione e costruiscono insieme (U → 🤝 Fazione).
   - Il capo fonda la fazione, invita gli altri o accoglie chi chiede di entrare, e mette in comune una delle sue città.
   - Chi entra è una «recluta»: visita la città comune, ci combatte, ma non la cambia.
   - Solo il capo decide i permessi di ogni ruolo e crea ruoli nuovi (costruttori, tesorieri...). Lo «staff» fa il lavoro
     al posto suo: invita, accoglie, cambia i ruoli dei membri, espelle.
   - Con i permessi si fa tutto, insieme: costruire e potenziare, l'editor del borgo e delle mura, arredare le case,
     ritirare il tesoro, addestrare l'esercito, dare il nome alla città. Le modifiche arrivano subito a tutti.
   Serve il plugin del server «Fazioni» (plugins/fazioni.js). */
const FZ={st:null,ok:0,ask:0,last:{},tm:null,seq:0};
const FZPN={costruire:'🏗 Costruire, potenziare e l\'editor del borgo',arredare:'🪑 Arredare le case',tesoro:'💰 Ritirare il tesoro e il magazzino',esercito:'🛡 Addestrare e congedare i soldati',gestire:'✎ Dare il nome alla città',invitare:'✉ Invitare e accogliere',espellere:'👢 Cambiare i ruoli dei membri ed espellere'};
const FZRN={capo:'👑 Capo',staff:'⭐ Staff',membro:'🙂 Membro',recluta:'🌱 Recluta'};
const fzRn=r=>FZRN[r]||('🎖 '+r.charAt(0).toUpperCase()+r.slice(1));
function fzTk(){let A={};try{A=JSON.parse(localStorage.getItem('voxelia_fzk')||'{}')}catch(e){}const w=twWorld();if(!A[w]){const b=new Uint8Array(16);(crypto||window.crypto).getRandomValues(b);A[w]=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');try{localStorage.setItem('voxelia_fzk',JSON.stringify(A))}catch(e){}}return A[w]}
const fzOn=()=>!!(NET.ok&&twOn()&&twWorld());
function fzSend(e,d){if(!fzOn())return;VXP.send('fazioni',e,Object.assign({w:twWorld(),tk:fzTk()},d||{}))}
const fzMine=()=>FZ.st&&FZ.st.fz;
function fzCan(perm,S){S=S===undefined?P.tw&&P.tw.set:S;if(!S||!S.fz)return true;const F=fzMine();if(!F||F.id!==S.fz)return S.fzo===NET.name;const me=FZ.st.me;return!!me&&(me.r==='capo'||me.p.includes(perm))}
function fzNo(perm){msg('Il tuo ruolo nella fazione non lo permette: serve «'+(FZPN[perm]||perm).replace(/^\S+ /,'')+'». Chiedilo al capo.');tone(150,.1);return false}
const fzGate=(nm,perm,getS)=>{if(typeof window[nm]!=='function')return;const f0=window[nm];window[nm]=function(){const S=getS?getS.apply(null,arguments):P.tw&&P.tw.set;if(S&&S.fz&&!fzCan(perm,S))return fzNo(perm);return f0.apply(this,arguments)}};
fzGate('setBuy','costruire');fzGate('sedOpen','costruire');fzGate('csFound','costruire');fzGate('setCollect','tesoro');fzGate('armyTrain','esercito');fzGate('armyFire','esercito');fzGate('setRename','gestire');
fzGate('csOpen','arredare',()=>{const o=csOf(Zk);return o&&o.S});fzGate('csSet','arredare',()=>{const o=csOf(Zk);return o&&o.S});fzGate('csSetMine','arredare',S=>S);
// la vita di tutti i giorni della città comune (tasse, raccolto, abitanti) la fa andare avanti il capo
{const a0=setAccrue;setAccrue=function(){const S=P&&P.tw&&P.tw.set;if(S&&S.fz&&S.fzo&&S.fzo!==NET.name)return;return a0.apply(this,arguments)}}
// mandare la città comune al server, a pezzi, quando cambia
const fzStrip=S=>{const o=Object.assign({},S);delete o.fzo;return o};
const FZKP={lay:'costruire',b:'costruire',lv:'costruire',dec:'costruire',col:'costruire',int:'arredare',cash:'tesoro',mag:'tesoro',army:'esercito',n:'gestire'};
FZ.base={};
// si mandano solo le parti cambiate rispetto all'ultima versione vista, e solo quelle che il tuo ruolo può toccare
function fzPush(S,nuova){const F=fzMine();if(!F||!S||!fzOn())return;const O=fzStrip(S),j=JSON.stringify(O);if(!nuova&&FZ.last[S.k]===j)return;const B=FZ.base[S.k]||{};FZ.last[S.k]=j;
  let pay;if(nuova)pay={k:S.k,S:O};else{const me=FZ.st.me,capo=me.r==='capo',set={},del=[];let n=0;
    for(const k of new Set(Object.keys(O).concat(Object.keys(B)))){if(k==='fz')continue;if(JSON.stringify(O[k])===JSON.stringify(B[k]))continue;const pk=FZKP[k];if(!(capo||(pk&&me.p.includes(pk))))continue;if(O[k]===undefined)del.push(k);else set[k]=O[k];n++}
    if(!n){return}pay={k:S.k,set,del}}
  FZ.base[S.k]=JSON.parse(j);const t=JSON.stringify(pay),id=(++FZ.seq).toString(36)+Date.now().toString(36),n2=Math.ceil(t.length/30000);
  for(let i=0;i<n2;i++)VXP.send('fazioni','citta',{w:twWorld(),tk:fzTk(),id,i,n:n2,s:t.slice(i*30000,(i+1)*30000),nuova:nuova?1:0})}
function fzCheck(){FZ.tm=null;if(!P||!P.tw||!fzOn())return;const F=fzMine();if(!F)return;for(const S of csSets())if(S.fz===F.id)fzPush(S)}
{const s0=save;save=function(){const r=s0.apply(this,arguments);if(P&&P.tw&&fzMine()&&csSets().some(S=>S.fz)){clearTimeout(FZ.tm);FZ.tm=setTimeout(fzCheck,1200)}return r}}
// la città comune che arriva dal server
function fzInstall(d){if(!P||!P.tw||!twOn())return;const T0=P.tw;T0.sets=T0.sets||[];
  if(!d.k){for(const S of csSets().slice())if(S.fz===d.fid){if(S.fzo===NET.name){delete S.fz;delete S.fzo}else fzDrop(S)}save();return}
  let T=csSets().find(s=>s.k===d.k);const j=JSON.stringify(d.S);if(T&&FZ.last[d.k]===j&&T.fz===d.fid){T.fzo=d.capo;return}
  if(!T){T={};T0.sets.push(T)}for(const k of Object.keys(T))delete T[k];Object.assign(T,JSON.parse(j),{fz:d.fid,fzo:d.capo});FZ.last[d.k]=JSON.stringify(fzStrip(T));FZ.base[d.k]=JSON.parse(FZ.last[d.k]);if(!T0.set)twSetUse(T.k)||(T0.set=T);
  const p=twP(d.k);if(p){for(const k in Z)if(k.startsWith('twi:'+p[0]+','+p[1]+':')&&k!==Zk)delete Z[k]}if(typeof TWW!=='undefined')TWW.cache.delete(d.k);if(typeof TWDT!=='undefined')TWDT.delete(d.k);
  if(Zk===d.k){setRebuild();if(typeof SED!=='undefined'&&SED.on)sedUI()}if(d.by&&d.by!==NET.name&&Zk===d.k)msg('🤝 '+d.by+' ha cambiato '+T.n);save();if(PM==='regno')pn('regno')}
function fzDrop(S){const T=P.tw;if(T.set===S){T.set=null;const o=(T.sets||[]).find(x=>x!==S);if(o){T.sets.splice(T.sets.indexOf(o),1);T.set=o}}T.sets=(T.sets||[]).filter(x=>x!==S);if(T.cap===S.k)T.cap=null;if(P.tw.myh&&P.tw.myh.k===S.k)P.tw.myh=null}
// chi non è più nella fazione perde la città comune (quella del capo resta sua)
function fzClean(){if(!P||!P.tw)return;const F=fzMine();for(const S of csSets().slice()){if(!S.fz)continue;if(F&&F.id===S.fz){S.fzo=F.capo;continue}if(S.fzo===NET.name){delete S.fz;delete S.fzo}else fzDrop(S)}}
VXP.on('fazioni','stato',d=>{if(!d||d.w!==twWorld())return;FZ.ok=1;FZ.st=d;fzClean();if(PM==='regno'&&RG.tab==='fz')pn('regno')});
VXP.on('fazioni','citta',d=>{if(d)fzInstall(d)});
VXP.on('fazioni','esito',d=>{if(d&&d.testo){msg(d.testo);if(PM==='regno'&&RG.tab==='fz')pn('regno')}});
VXP.on('fazioni','invito',d=>{if(d)banner('🤝 Invito nella fazione '+d.n,d.da+' ti invita · U → Fazione per rispondere','bandiera')});
VXP.on('fazioni','fuori',d=>{if(d)banner('🤝 Non sei più nella fazione '+d.n,'La città comune resta al capo','bandiera')});
// chiedere lo stato: quando si entra nel mondo, e ogni tanto
setInterval(()=>{if(!fzOn()||!P||!P.tw)return;if(!FZ.ask||Date.now()-FZ.ask>45000){FZ.ask=Date.now();const S=csSets().find(s=>s.fz);fzSend('stato',{v:S&&FZ.st&&FZ.st.fz&&FZ.st.fz.set&&FZ.last[S.k]?FZ.st.fz.set.v:0})}},3000);
// nella città comune i mostri non ci sono, come nelle tue terre; e le terre dei compagni non si assediano
{const l0=load;load=function(k,from){l0(k,from);if(twOn()&&P&&P.tw&&String(Zk).startsWith('tw:')){const S=csSets().find(s=>s.k===Zk&&s.fz);if(S&&!P.tw.terr[Zk])for(const e of ents.slice())if(e.k==='en'&&!e.owt&&!e.bt&&!e.asl)ents.splice(ents.indexOf(e),1)}}}
{const c0=twConqStart;twConqStart=function(){const F=fzMine();if(F&&ZZ&&ZZ.tw){const X=typeof TWX!=='undefined'&&TWX.map&&TWX.map[Zk];if(X&&X.o&&F.m.some(m=>m.n===X.o)&&X.o!==NET.name){msg('È terra di '+X.o+', della tua fazione: insieme si difende, non si assedia');return}if(csSets().some(s=>s.k===Zk&&s.fz===F.id)){msg('È la città della tua fazione');return}}return c0.apply(this,arguments)}}
/* ---- il pannello: U → 🤝 Fazione ---- */
const FZU={n:'',inv:'',ruolo:''};
function fzAct(e,d){fzSend(e,d);tone(600,.05,'triangle');setTimeout(()=>{if(PM==='regno'&&RG.tab==='fz')pn('regno')},700)}
function fzShare(){const F=fzMine();if(!F||FZ.st.me.r!=='capo')return;const k=($('fz_share')||{}).value;const S=csSets().find(s=>s.k===k&&!s.fz);if(!S){msg('Scegli una delle tue città');return}
  if(!confirm('Mettere in comune '+S.n+'? I membri della fazione la vedranno e, con i permessi, potranno cambiarla.'))return;S.fz=F.id;S.fzo=NET.name;fzPush(S,1);save();setTimeout(()=>pn('regno'),800)}
function fzHTML(){const st=FZ.st;let h='<div class="fzw">';
  if(!NET.ok||!twWorld())return h+`<div class="rgcard"><b>🤝 Le fazioni dei giocatori si giocano in rete</b><p class="mu">Entra in Tomorrow con un codice stanza (nel menu del Mondo aperto): chi usa lo stesso codice gioca nel tuo stesso mondo, e lì potete fondare una fazione e costruire insieme.</p></div></div>`;
  if(!FZ.ok)return h+`<div class="rgcard"><b>🤝 Fazioni</b><p class="mu">${FZ.ask&&Date.now()-FZ.ask>4000?'Questo server non ha il plugin «Fazioni»: chiedi a chi lo gestisce di accenderlo (plugins/fazioni.js).':'Un momento, chiedo al server…'}</p></div></div>`;
  const F=st.fz;
  if(!F){if(st.inv&&st.inv.length)h+=`<h4>✉ Inviti</h4>`+st.inv.map(i=>`<div class="rgcard"><div><b>${esc(i.n)}</b><p class="mu">${esc(i.da)} ti invita nella sua fazione</p></div><span><button class="pri" onclick="fzAct('rispondi',{id:'${i.id}',si:1})">Entra</button><button onclick="fzAct('rispondi',{id:'${i.id}',si:0})">No, grazie</button></span></div>`).join('');
    h+=`<h4>Le fazioni di questo mondo</h4>`+(st.lista&&st.lista.length?st.lista.map(f=>`<div class="rgcard"><div><b>${esc(f.n)}</b><p class="mu">capo ${esc(f.capo)} · ${f.nm} ${f.nm===1?'membro':'membri'}${f.citta?' · città: '+esc(f.citta.n)+' (liv. '+f.citta.lv+')':''}</p></div><span>${f.chiesto?'<span class="mu">richiesta mandata</span>':`<button onclick="fzAct('chiedi',{id:'${f.id}'})">Chiedi di entrare</button>`}</span></div>`).join(''):'<p class="mu">Ancora nessuna: fondala tu.</p>');
    h+=`<h4>Fonda una fazione</h4><div class="rgcard"><div><p class="mu">Sarai il capo: inviti gli altri, decidi i ruoli e i permessi, e metti in comune una delle tue città per costruirla insieme.</p><input id="fz_n" maxlength="28" placeholder="Il nome della fazione" value="${esc(FZU.n)}" oninput="FZU.n=this.value"></div><span><button class="pri" onclick="if((FZU.n||'').trim().length<3){msg('Almeno 3 lettere');return}fzAct('crea',{n:FZU.n})">🤝 Fonda</button></span></div>`;
    return h+'</div>'}
  const me=st.me,capo=me.r==='capo',can=p=>capo||me.p.includes(p),roles=Object.keys(F.ru);
  h+=`<div class="rgcard fzhd"><div><b>🤝 ${esc(F.n)}</b><p class="mu">capo <b>${esc(F.capo)}</b> · ${F.m.length} ${F.m.length===1?'membro':'membri'} · il tuo ruolo: <b>${fzRn(me.r)}</b></p>
    <div class="fzch">${(capo?Object.keys(FZPN):me.p).map(p=>`<span>${FZPN[p]}</span>`).join('')||'<span class="mu">per ora nessun permesso: puoi visitare la città comune e difenderla con gli altri</span>'}</div></div></div>`;
  // la città comune
  const SC=F.set,mine=csSets().filter(s=>!s.fz&&s.fzo===undefined);
  h+=`<h4>🏰 La città della fazione</h4>`;
  if(SC){const here=Zk===SC.k;h+=`<div class="rgcard"><div><b>${esc(SC.n)}</b> <small>livello ${SC.lv}</small><p class="mu">La costruite insieme: ognuno fa quello che gli lasciano fare i permessi del suo ruolo, e le modifiche arrivano subito a tutti. Le spese le paga chi costruisce.</p></div>
      <span>${here?'<span class="mu">sei qui</span>':`<button class="pri" onclick="if(twSetUse('${SC.k}')){cl();setGo()}">🏠 Vai</button>`}<button onclick="if(twSetUse('${SC.k}')){RG.tab='set';pn('regno')}">Gestisci</button>${capo?`<button onclick="if(confirm('Riprendere per te la città? I membri non la vedranno più.'))fzAct('nonCondividere')">Riprendila</button>`:''}</span></div>`}
  else if(capo)h+=mine.length?`<div class="rgcard"><div><p class="mu">Scegli una delle tue città da costruire insieme alla fazione.</p><select id="fz_share">${mine.map(s=>`<option value="${s.k}">${esc(s.n)} · liv. ${s.lv}</option>`).join('')}</select></div><span><button class="pri" onclick="fzShare()">🤝 Mettila in comune</button></span></div>`:'<p class="mu">Prima fonda una città (U → Territorio, in una regione conquistata), poi mettila in comune.</p>';
  else h+='<p class="mu">Il capo non ha ancora messo in comune una città.</p>';
  // i membri
  h+=`<h4>👥 Membri</h4><div class="fzml">`+F.m.slice().sort((a,b)=>(b.r==='capo')-(a.r==='capo')||(b.r==='staff')-(a.r==='staff')||a.n.localeCompare(b.n)).map(m=>{const self=m.n===NET.name,edit=can('espellere')&&m.r!=='capo'&&!self&&(capo||m.r!=='staff');
    return`<div class="fzm"><i class="${m.on?'on':''}"></i><b>${esc(m.n)}</b>${edit?`<select onchange="fzAct('ruolo',{n:decodeURIComponent('${encodeURIComponent(m.n)}'),r:this.value})">${roles.filter(r=>capo||r!=='staff').map(r=>`<option value="${esc(r)}" ${m.r===r?'selected':''}>${fzRn(r)}</option>`).join('')}</select><button title="Espelli" onclick="if(confirm('Espellere ${esc(m.n)}?'))fzAct('caccia',{n:decodeURIComponent('${encodeURIComponent(m.n)}')})">👢</button>`:`<span class="mu">${fzRn(m.r)}</span>`}
      ${capo&&!self?`<button title="Passa il comando" onclick="if(confirm('Fare ${esc(m.n)} capo della fazione? Tu diventi staff.'))fzAct('capo',{n:decodeURIComponent('${encodeURIComponent(m.n)}')})">👑</button>`:''}</div>`}).join('')+'</div>';
  if(can('invitare')){const on=(NET.list||[]).map(e=>e.n).filter(n=>n&&!F.m.some(m=>m.n===n));
    h+=`<div class="rgcard"><div><b>✉ Invita</b><input id="fz_inv" list="fz_onl" maxlength="24" placeholder="Il nome dell'eroe" value="${esc(FZU.inv)}" oninput="FZU.inv=this.value"><datalist id="fz_onl">${on.map(n=>`<option value="${esc(n)}">`).join('')}</datalist></div><span><button class="pri" onclick="if(FZU.inv.trim())fzAct('invita',{n:FZU.inv.trim()});FZU.inv=''">Invita</button></span></div>`;
    if(F.req&&F.req.length)h+=`<h4>🚪 Chiedono di entrare</h4>`+F.req.map(r=>`<div class="rgcard"><div><b>${esc(r.n)}</b></div><span><button class="pri" onclick="fzAct('accogli',{n:decodeURIComponent('${encodeURIComponent(r.n)}'),si:1})">Accogli</button><button onclick="fzAct('accogli',{n:decodeURIComponent('${encodeURIComponent(r.n)}'),si:0})">Respingi</button></span></div>`).join('')}
  // i ruoli e i permessi: li decide solo il capo
  h+=`<h4>🎖 Ruoli e permessi</h4><p class="mu">${capo?'Solo tu, il capo, decidi cosa può fare ogni ruolo. Chi entra parte come recluta. Lo staff fa il lavoro al posto tuo.':'Li decide il capo.'}</p><div class="fzr"><table><tr><th></th>${Object.keys(FZPN).map(p=>`<th title="${esc(FZPN[p])}">${FZPN[p].split(' ')[0]}</th>`).join('')}${capo?'<th></th>':''}</tr>`+
    roles.map(r=>`<tr><td>${fzRn(r)}</td>${Object.keys(FZPN).map(p=>`<td><input type="checkbox" ${F.ru[r].p.includes(p)?'checked':''} ${capo?`onchange="fzPerm('${esc(r)}','${p}',this.checked)"`:'disabled'}></td>`).join('')}${capo?`<td>${r==='recluta'||r==='staff'?'':`<button title="Togli il ruolo" onclick="fzAct('togliRuolo',{r:'${esc(r)}'})">✕</button>`}</td>`:''}</tr>`).join('')+'</table></div>';
  if(capo)h+=`<div class="rgcard"><div><input id="fz_ru" maxlength="18" placeholder="Nome del ruolo nuovo (es. costruttore)" value="${esc(FZU.ruolo)}" oninput="FZU.ruolo=this.value"></div><span><button onclick="if(FZU.ruolo.trim())fzAct('nuovoRuolo',{r:FZU.ruolo.trim(),p:[]});FZU.ruolo=''">＋ Ruolo</button></span></div>`;
  h+=`<p class="fzlg">${Object.keys(FZPN).map(p=>`${FZPN[p]}`).join(' · ')}</p>`;
  if(F.log&&F.log.length)h+=`<h4>📜 Cronaca</h4><div class="fzlog">${F.log.map(l=>`<div><small>${new Date(l.t).toLocaleString('it-IT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small> ${esc(l.testo)}</div>`).join('')}</div>`;
  h+=`<div class="fzft">${capo?`<button onclick="if(confirm('Sciogliere la fazione ${esc(F.n)}? I membri perdono la città comune, che resta tua.'))fzAct('sciogli')">Sciogli la fazione</button>`:''}<button onclick="if(confirm('Uscire dalla fazione?'))fzAct('esci')">Esci dalla fazione</button></div>`;
  return h+'</div>'}
function fzPerm(r,p,on){const F=fzMine();if(!F||!F.ru[r])return;const L=F.ru[r].p.filter(x=>x!==p);if(on)L.push(p);F.ru[r].p=L;fzAct('permessi',{r,p:L})}
const _rgHTML739=rgHTML;rgHTML=function(){const tab=RG.tab;if(tab==='fz')RG.tab='fac';let h=_rgHTML739();RG.tab=tab;
  h=h.replace(/(<button class="twtb[^"]*" onclick="RG\.tab='fac';pn\('regno'\)">[^<]*<\/button>)/,`$1<button class="twtb${tab==='fz'?' on':''}" onclick="RG.tab='fz';FZ.ask=0;pn('regno')">🤝 Fazione</button>`);
  if(tab==='fz'){h=h.replace(/class="twtb on" onclick="RG\.tab='fac'/,'class="twtb" onclick="RG.tab=\'fac\'');const i=h.indexOf('<div class="rgc">'),j=h.lastIndexOf('</div><footer');if(i>=0&&j>i)h=h.slice(0,i)+'<div class="rgc">'+fzHTML()+h.slice(j)}
  return h};
document.head.insertAdjacentHTML('beforeend',`<style>.fzw input,.fzw select{background:#1c1a24;color:#f0e8d8;border:1px solid #ffffff33;border-radius:7px;padding:6px 8px;margin-top:4px}.fzw input{width:100%;box-sizing:border-box}
.fzch{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}.fzch span{font-size:11.5px;background:#ffd84a1f;border:1px solid #ffd84a55;border-radius:10px;padding:2px 8px}
.fzml{display:flex;flex-direction:column;gap:4px}.fzm{display:flex;align-items:center;gap:8px;background:#ffffff0d;border-radius:8px;padding:5px 8px}.fzm b{flex:1}.fzm i{width:9px;height:9px;border-radius:50%;background:#777}.fzm i.on{background:#5adc78}.fzm select{margin:0}
.fzr{overflow-x:auto}.fzr table{border-collapse:collapse;font-size:12.5px;width:100%}.fzr th,.fzr td{padding:4px 6px;text-align:center;border-bottom:1px solid #ffffff14}.fzr td:first-child{text-align:left;white-space:nowrap}
.fzlg{font-size:11px;opacity:.6}.fzlog{max-height:160px;overflow:auto;font-size:12.5px}.fzlog small{opacity:.6}.fzft{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}</style>`);
