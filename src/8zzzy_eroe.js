/* ================= 7.52: ESPORTARE E IMPORTARE L'EROE =================
   L'eroe della Modalità Storia e quello di Tomorrow si salvano in un file (.voxelia-eroe.json) e si ricaricano da un file:
   per tenerne una copia, spostarlo su un altro computer o in un altro browser, o passarlo a un amico.
   - Esporta: nel menu della modalità (sotto «Continua») e nel menu di pausa. Prima salva la partita, poi scarica il file.
     Il file ha tutto il salvataggio dell'eroe (livello, oggetti, missioni, aspetto, compagni, regno di Tomorrow…), tranne
     il codice della stanza, che può essere privato.
   - Importa: nel menu. Il gioco controlla che il file sia un eroe di Voxelia, intero e non modificato a mano (un codice di
     controllo calcolato sui dati), e capisce da solo se è un eroe della Storia o di Tomorrow. Se in quella modalità c'è già
     un eroe salvato, chiede le due conferme della 7.50, con il pulsante per esportare prima quello attuale.
   Il codice di controllo serve a riconoscere i file rovinati o ritoccati per sbaglio: non è una protezione contro chi
   bara di proposito, perché il gioco gira tutto nel browser. Sui server resta il Guardiano a controllare oro e livelli. */
// 7.52.1: gli eroi Incubo (morte permanente) non si esportano e non si importano: una copia aggirerebbe la morte permanente
const hxIncubo=s=>!!(s&&(s.df|0)===3);
const HX={key:{story:SAVEK,ow:OWK},nome:{story:'Modalità Storia',ow:'Tomorrow'},ic:{story:'👑',ow:'🌍'},MAXB:25*1024*1024,SAVEV:4};
// codice di controllo: due passate FNV-1a a 32 bit, 16 cifre esadecimali
function hxSum(s){let a=2166136261,b=0x811c9dc5^0x5bd1e995;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^(c+i&65535),16777619)}
  return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')}
function hxKindNow(){return typeof OW!=='undefined'&&OW.on?'ow':'story'}
function hxCanExportNow(){return started&&P&&MODE!=='dim'&&!(typeof EDPLAY!=='undefined'&&EDPLAY)&&!(typeof DEV!=='undefined'&&DEV.sess)}
function hxFile(s,kind){const n=String(s.name||'eroe').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\w\-]+/g,'_').replace(/^_+|_+$/g,'')||'eroe',
    d=new Date(),dd=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  return'voxelia_'+n+'_liv'+(s.p.lv|0)+'_'+(kind==='ow'?'tomorrow':'storia')+'_'+dd+'.voxelia-eroe.json'}
function hxExport(kind){kind=kind||hxKindNow();
  if(hxCanExportNow()&&hxKindNow()===kind)try{save()}catch(e){}
  const s=LS.get(HX.key[kind],null);if(!s||!s.p){edToast('Non c\'è un eroe salvato da esportare in '+HX.nome[kind],'err');return}
  if(hxIncubo(s)){edToast('Gli eroi in difficoltà Incubo non si esportano: la morte è permanente','err');return}
  const dati=JSON.parse(JSON.stringify(s));dati.code='';const js=JSON.stringify(dati);
  const out={formato:'voxelia-eroe',v:1,gioco:GAME_VER,modo:kind,esportato:new Date().toISOString(),
    eroe:{nome:String(s.name||''),livello:s.p.lv|0,difficolta:DFS[s.df|0]?DFS[s.df|0].n:''},controllo:hxSum(js),dati};
  try{const b=new Blob([JSON.stringify(out)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=hxFile(s,kind);
    document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);edToast('📤 Eroe esportato: '+a.download)}
  catch(e){edToast('Esportazione non riuscita','err')}}
// legge e controlla un file; restituisce {ok:true,kind,s,ver} oppure {ok:false,err}
function hxCheck(txt){let o;try{o=JSON.parse(txt)}catch(e){return{ok:false,err:'Il file non si legge: non è un file di Voxelia o è rovinato.'}}
  if(!o||typeof o!=='object')return{ok:false,err:'Il file non è un eroe di Voxelia.'};
  if(o.formato!=='voxelia-eroe'){if(o.maps&&o.name)return{ok:false,err:'Questo è un mondo di Voxelia Studio: si importa dal Parco giochi.'};return{ok:false,err:'Il file non è un eroe di Voxelia.'}}
  if(!(o.v>=1)||o.v>1)return{ok:false,err:'Il file viene da una versione più nuova del gioco: aggiorna Voxelia e riprova.'};
  const kind=o.modo;if(!HX.key[kind])return{ok:false,err:'Il file non dice di che modalità è l\'eroe.'};
  const s=o.dati;if(!s||typeof s!=='object'||!s.p||typeof s.p!=='object')return{ok:false,err:'Nel file manca l\'eroe.'};
  if(hxSum(JSON.stringify(s))!==o.controllo)return{ok:false,err:'Il file è stato modificato o si è rovinato: il codice di controllo non torna. Non lo importo.'};
  if((s.v|0)>HX.SAVEV)return{ok:false,err:'Il salvataggio viene da una versione più nuova del gioco: aggiorna Voxelia e riprova.'};
  if(hxIncubo(s))return{ok:false,err:'È un eroe in difficoltà Incubo: con la morte permanente non si importa.'};
  const lv=Number(s.p.lv);if(!isFinite(lv)||lv<1||lv>9999)return{ok:false,err:'I dati dell\'eroe non sono validi (livello).'};
  if(typeof s.name!=='string')s.name='Eroe';s.name=s.name.slice(0,14)||'Eroe';
  if(kind==='ow'&&!s.ow)s.ow=1;if(kind==='story'&&s.ow)return{ok:false,err:'I dati dicono che è un eroe di Tomorrow, ma il file lo segna come della Storia: non lo importo.'};
  return{ok:true,kind,s,ver:String(o.gioco||'')}}
function hxNewer(v){const a=String(v).split('.').map(Number),b=String(GAME_VER).split('.').map(Number);for(let i=0;i<Math.max(a.length,b.length);i++){const x=a[i]||0,y=b[i]||0;if(x!==y)return x>y}return false}
function hxImport(){if(started){edToast('Torna al menu per importare un eroe','err');return}
  const inp=document.createElement('input');inp.type='file';inp.accept='.json,application/json';inp.style.display='none';document.body.appendChild(inp);
  inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.remove();if(!f)return;
    if(f.size>HX.MAXB){edToast('Il file è troppo grande per essere un eroe di Voxelia','err');return}
    const r=new FileReader();r.onerror=()=>edToast('Il file non si legge','err');r.onload=()=>hxImportText(String(r.result||''));r.readAsText(f)};
  inp.click()}
function hxImportText(txt){const c=hxCheck(txt);if(!c.ok){edToast('⚠ '+c.err,'err');return false}
  const{kind,s}=c,old=LS.get(HX.key[kind],null),nuovo=s.name+' (livello '+(s.p.lv|0)+', '+HX.nome[kind]+')',
    nota=c.ver&&hxNewer(c.ver)?' Il file viene dalla versione '+c.ver+', più nuova di questa: qualcosa potrebbe non esserci.':'';
  if(old&&old.p){ovrAsk({ti:'Sostituire l\'eroe salvato?',cosa:'Stai per importare '+nuovo+'. Prende il posto dell\'eroe salvato:'+nota,
      eroe:old.name,lv:old.p.lv,df:DFS[old.df|0]&&DFS[old.df|0].n,g:old.p.g,t:old.t,ic:HX.ic[kind],dati:'I dati di '+(old.name||'questo eroe')+' (livello '+old.p.lv+')',ok:'Sì, importa',
      extra:`<button class="ovexp" onclick="hxExport('${kind}')">📤 Esporta prima l'eroe attuale</button>`},()=>hxApply(kind,s));return true}
  hxApply(kind,s,nota);return true}
function hxApply(kind,s,nota){const k=HX.key[kind];s.code='';LS.set(k,s);const back=LS.get(k,null);
  if(!back||!back.p||back.name!==s.name||(back.p.lv|0)!==(s.p.lv|0)){edToast('Non c\'è spazio nel browser per salvare l\'eroe','err');return}
  if(kind==='story'){const n=$('nm');if(n)n.value=s.name;try{contHTML()}catch(e){}}else{try{owMenu()}catch(e){}const n=$('ownm');if(n)n.value=s.name}
  try{tone(660,.08,'triangle',.04);setTimeout(()=>tone(880,.1,'triangle',.04),90)}catch(_){}
  edToast('📥 '+s.name+' importato in '+HX.nome[kind]+': premi «Continua» per giocare'+(nota||''))}
// i pulsanti: nel menu della Storia, nel menu di Tomorrow e nel menu di pausa
function hxRow(kind){const s=LS.get(HX.key[kind],null),has=!!(s&&s.p),inc=has&&hxIncubo(s);
  return`<div class="hxr"><button class="mbtn hxb" onclick="hxExport('${kind}')" ${has&&!inc?'':'disabled'}><span><b>📤 Esporta l'eroe</b><small>${inc?'Non con Incubo: la morte è permanente':has?'Scarica un file con '+esc(s.name)+', livello '+(s.p.lv|0):'Nessun eroe salvato'}</small></span></button>
    <button class="mbtn hxb" onclick="hxImport()"><span><b>📥 Importa un eroe</b><small>Da un file .voxelia-eroe.json</small></span></button></div>`}
{const _cont752=contHTML;contHTML=function(){_cont752();const c=$('cont');if(c&&!c.querySelector('.hxr'))c.insertAdjacentHTML('beforeend',hxRow('story'))}}
if(typeof owMenu==='function'){const _om752=owMenu;owMenu=function(){_om752();const el=$('mowb');if(!el||el.querySelector('.hxr'))return;const h=el.querySelector('h4');if(h)h.insertAdjacentHTML('beforebegin',hxRow('ow'));else el.insertAdjacentHTML('beforeend',hxRow('ow'))}}
if(typeof pauseHTML==='function'){const _ph752=pauseHTML;pauseHTML=function(){const h=_ph752();if(!hxCanExportNow())return h;
  const inc=typeof DF!=='undefined'&&DFS.indexOf(DF)===3,b=inc?`<button class="psb" disabled>${ico('pergamena',20)||'📤'}<span><b>Esporta l'eroe</b><small>Non con Incubo: la morte è permanente</small></span></button>`:`<button class="psb" onclick="hxExport()">${ico('pergamena',20)||'📤'}<span><b>Esporta l'eroe</b><small>Salva e scarica un file con l'eroe</small></span></button>`,i=h.indexOf('<button class="psb dn"');
  return i<0?h:h.slice(0,i)+b+h.slice(i)}}
try{contHTML()}catch(e){}
(function(){const st=document.createElement('style');st.textContent=`
.hxr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.hxr .hxb{margin:0;padding:8px 10px;min-height:0}.hxr .hxb b{font-size:14px}.hxr .hxb small{font-size:12px}
.hxr .hxb:disabled{opacity:.5;cursor:not-allowed}
.psb:disabled{opacity:.5;cursor:not-allowed}
@media(max-width:420px){.hxr{grid-template-columns:1fr}}
.ovexp{align-self:flex-start;margin:0;padding:7px 12px;font:inherit;font-size:13.5px;border-radius:3px;cursor:pointer;background:#24304e;color:#ffd98a;border:1px dashed #f5b94299}
.ovexp:hover,.ovexp:focus-visible{background:#2f3d63;outline:2px solid #f5b942;outline-offset:1px}`;document.head.appendChild(st)})();
