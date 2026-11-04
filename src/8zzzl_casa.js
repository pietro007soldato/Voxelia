/* ================= 7.47: la vita in casa — lavagna, trofei e coinquilini =================
   In casa (la tua stanza del Motel, la tua casa di Tomorrow, le case del Borgo) ci sono:
   - la Lavagna: chi entra lascia un messaggio; il padrone di casa e i coinquilini li fissano in alto o li cancellano, e il
     padrone sceglie i coinquilini. In rete la tiene il plugin «lavagna» (così la leggono anche gli ospiti); senza server
     resta nel salvataggio, come un quaderno di appunti;
   - la Mensola dei trofei (solo in casa tua): una coppa per ogni dungeon liberato, i frammenti della Corona, la Torre,
     le corse a cavallo e le isole trovate. */
XSV.add('lav47');
const LAV={b:null,k:null,ask:0};
// dove sei: la chiave della lavagna, se è casa tua e chi ne è il padrone
function casaHere(){if(!ZZ||!started)return null;const nm=String((typeof NET!=='undefined'&&NET.name)||'eroe');
  if(String(Zk).startsWith('in_vxcasa_')&&ZZ.vx)return{k:'h'+(ZZ.vx.hid|0),mine:!!ZZ.vx.mia,o:ZZ.vx.owner||'?',n:ZZ.n||'Casa'};
  if(/^in_stanza\d+$/.test(Zk))return Zk==='in_stanza'+P.room?{k:'m:'+nm.toLowerCase().slice(0,24),mine:true,o:nm,n:'Stanza '+P.room}:null;
  if(typeof csHere==='function'&&csHere()){const q=csOf(Zk);return q?{k:'tw:'+Zk,mine:csMine(q.S,q.b),o:'',n:ZZ.n||'Casa'}:null}return null}
// in rete la lavagna la tiene il plugin: se il server non risponde entro tre secondi, il plugin non c'è e si scrive nel salvataggio
const lavSrv=()=>typeof NET!=='undefined'&&NET.ok&&typeof VXP!=='undefined'&&LAV.ok!==0;
function lavLocal(k){P.lav47=P.lav47||{};return P.lav47[k]||(P.lav47[k]={L:[],co:[]})}
function lavBoard(){const H=casaHere();if(!H)return null;if(lavSrv()){if(LAV.b&&LAV.b.k===H.k)return LAV.b;if(LAV.t&&Date.now()-LAV.t>3000&&!LAV.ok){LAV.ok=0;return lavBoard()}return{k:H.k,L:[],co:[],capo:H.mine,mio:H.mine,wait:1}}
  const B=lavLocal(H.k);return{k:H.k,L:B.L,co:B.co,capo:true,mio:true,loc:1}}
function lavAsk(H){if(!lavSrv()||!H)return;LAV.k=H.k;if(!LAV.ok){LAV.t=Date.now();setTimeout(()=>{if(PM==='lav47')pn('lav47')},3200)}VXP.send('lavagna',H.mine?'claim':'get',{k:H.k})}
if(typeof VXP!=='undefined')VXP.on('lavagna','board',d=>{if(!d||!d.k)return;LAV.ok=1;LAV.b={k:String(d.k),L:Array.isArray(d.L)?d.L:[],co:Array.isArray(d.co)?d.co:[],capo:!!d.capo,mio:!!d.mio,o:d.o};
  const H=casaHere();if(H&&H.k===LAV.b.k){if(PM==='lav47')pn('lav47');const nv=LAV.b.L.length;if(LAV.seen!=null&&nv>LAV.seen&&PM!=='lav47'){const m=LAV.b.L[nv-1];if(m)flt(P,'✎ '+m.n,'#9adc8a')}LAV.seen=nv}});
function lavPost(){const el=$('lav47t'),t=String(el&&el.value||'').replace(/\s+/g,' ').trim().slice(0,160);if(!t)return;const H=casaHere();if(!H)return;
  if(lavSrv())VXP.send('lavagna','post',{k:H.k,t});else{const B=lavLocal(H.k);B.L.push({id:uid(),n:String((typeof NET!=='undefined'&&NET.name)||'Tu'),t,at:Date.now(),pin:0});while(B.L.length>40){const i=B.L.findIndex(m=>!m.pin);B.L.splice(i<0?0:i,1)}save();pn('lav47')}
  if(el)el.value='';tone(800,.05,'triangle')}
function lavDel(id){const H=casaHere();if(!H)return;if(lavSrv()){VXP.send('lavagna','del',{k:H.k,id});return}const B=lavLocal(H.k),i=B.L.findIndex(m=>m.id===id);if(i>=0)B.L.splice(i,1);save();pn('lav47')}
function lavPin(id){const H=casaHere();if(!H)return;if(lavSrv()){VXP.send('lavagna','pin',{k:H.k,id});return}const m=lavLocal(H.k).L.find(q=>q.id===id);if(m)m.pin=m.pin?0:1;save();pn('lav47')}
function lavCo(){const el=$('lav47c'),L=String(el&&el.value||'').split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,6);const H=casaHere();if(!H)return;
  if(lavSrv())VXP.send('lavagna','co',{k:H.k,co:L});else{lavLocal(H.k).co=L;save();pn('lav47')}msg(L.length?'Coinquilini: '+L.join(', '):'Nessun coinquilino')}
X43P.lav47=()=>{const H=casaHere(),B=lavBoard();if(!H||!B)return`<h3>✎ Lavagna</h3><p class="mu">Sei uscito di casa.</p><button onclick="cl()">Chiudi</button>`;
  const me=String((typeof NET!=='undefined'&&NET.name)||'').toLowerCase(),L=B.L.slice().sort((a,b)=>(b.pin|0)-(a.pin|0)||a.at-b.at);
  return`<h3>✎ Lavagna · ${esc(H.n)}</h3><p class="x43t">${B.loc?'Senza server la lavagna è un quaderno di appunti tuo.':H.mine?'Chi entra in casa tua può lasciarti un messaggio.':'Lascia un messaggio a chi abita qui.'}${B.co.length?' · Coinquilini: '+B.co.map(esc).join(', '):''}</p>
  <div class="lav47">${B.wait?'<p class="mu">Leggo la lavagna…</p>':L.length?L.map(m=>`<div class="${m.pin?'pin':''}"><b>${m.pin?'📌 ':''}${esc(m.n)}</b> <small>${new Date(m.at).toLocaleDateString('it-IT',{day:'numeric',month:'short'})}</small><br>${esc(m.t)}
    <span>${B.capo?`<button onclick="lavPin('${esc(m.id)}')">${m.pin?'Stacca':'Fissa'}</button>`:''}${B.capo||String(m.n).toLowerCase()===me?`<button onclick="lavDel('${esc(m.id)}')">✕</button>`:''}</span></div>`).join(''):'<p class="mu">La lavagna è pulita.</p>'}</div>
  <div class="srow"><input id="lav47t" maxlength="160" placeholder="Scrivi un messaggio…" style="flex:1" onkeydown="if(event.key==='Enter'){lavPost();event.preventDefault()}event.stopPropagation()"><button onclick="lavPost()">Scrivi</button></div>
  ${B.mio&&!B.loc?`<h4>Coinquilini</h4><p class="x43t">Fino a sei nomi, separati da virgole: possono fissare e cancellare i messaggi.</p><div class="srow"><input id="lav47c" value="${esc(B.co.join(', '))}" style="flex:1" onkeydown="event.stopPropagation()"><button onclick="lavCo()">Salva</button></div>`:''}
  <button onclick="cl()">Chiudi</button>`};
// la mensola dei trofei
function troList(){const L=[];for(const id in DG){const d=DG[id];if(d&&!d.tw&&P.done&&P.done[id]>0){const b=E[d.boss];L.push({i:'🏆',n:d.n,s:(b&&b.n?'Sconfitto: '+b.n:'Liberato')+(P.done[id]>1?' · '+P.done[id]+' volte':''),c:d.lv>=10?'#ffd84a':d.lv>=6?'#d8d8e8':'#d08a4a'})}}
  if(P.sh&&P.sh.length)L.push({i:'👑',n:'Frammenti della Corona',s:P.sh.length+' frammenti',c:'#ff6ad5'});
  try{const T=LS.get('voxelia_torre',{})||{};let b=0;for(const d in T)b=Math.max(b,(T[d]&&T[d].c)|0);if(b)L.push({i:'🗼',n:'Torre della Corona',s:'Il tuo record: '+b+'/10 piani',c:'#9adcff'})}catch(_){}
  if(P.cav&&P.cav.best&&Object.keys(P.cav.best).length)L.push({i:'🐎',n:'Corse a cavallo',s:Object.keys(P.cav.best).length+' percorsi corsi',c:'#c8a870'});
  if(P.disc&&P.disc.pg)for(const k in P.disc.pg)L.push({i:'📖',n:'Pagina completa del Diario',s:{z:'Luoghi',e:'Creature',r:'Risorse',f:'Pesci'}[k]||k,c:'#ffe08a'});return L}
X43P.tro47=()=>{const L=troList();return`<h3>🏆 Mensola dei trofei · ${L.length}</h3>${L.length?L.map(q=>`<div class="x43r"><span>${q.i} <b>${esc(q.n)}</b></span><span class="mu">${esc(q.s)}</span></div>`).join(''):'<p class="mu">La mensola è vuota: libera un dungeon per la prima coppa.</p>'}<button onclick="cl()">Chiudi</button>`};
// lavagna e mensola nelle case
function casaPlace(){const H=casaHere();if(!H)return;LAV.b=null;LAV.seen=null;if(!ents.some(e=>e.k==='lav47')){const q=spot47([N>>1,(N>>1)-2]);if(q)ents.push({k:'lav47',px:q[0]+.5,py:q[1]+.5,n:'Lavagna'})}
  if(H.mine&&!ents.some(e=>e.k==='tro47')){const q=spot47([(N>>1)+2,(N>>1)+1],2);if(q)ents.push({k:'tro47',px:q[0]+.5,py:q[1]+.5,n:'Mensola dei trofei'})}lavAsk(H)}
const _loadPost747l=loadPost;loadPost=function(k){_loadPost747l(k);try{casaPlace()}catch(e){console.warn('casa',e)}};
ITK.add('lav47');ITK.add('tro47');
const _act747l=act;act=function(e){if(e&&e.k==='lav47'){const H=casaHere();if(H&&lavSrv()){if(!LAV.ok)LAV.t=Date.now();VXP.send('lavagna','get',{k:H.k})}pn('lav47');return}if(e&&e.k==='tro47'){pn('tro47');return}_act747l(e)};
const _ent747l=ent;ent=function(e){if(e.k==='lav47'){const B=LAV.b,n=B?B.L.length:P.lav47&&casaHere()&&P.lav47[casaHere().k]?P.lav47[casaHere().k].L.length:0;
    drawL([[-.4,-.04,0,.06,.08,22,'#6a4a2a'],[.34,-.04,0,.06,.08,22,'#6a4a2a'],[-.42,-.06,10,.84,.1,16,'#8a6a42'],[-.38,-.07,11,.76,.1,14,'#2a4a3a']],e.px,e.py,0);
    for(let i=0;i<Math.min(5,n);i++)box(e.px-.3+(i%2)*.06,e.py-.08,22-i*2.4,.4-(i*7%3)*.08,.02,.8,'#e8f0e8');return}
  if(e.k==='tro47'){const L=troList();drawL([[-.45,-.15,0,.9,.3,4,'#5a3a1a'],[-.45,-.15,4,.05,.3,20,'#6a4a2a'],[.4,-.15,4,.05,.3,20,'#6a4a2a'],[-.45,-.15,13,.9,.3,1.5,'#7a5a32'],[-.45,-.15,24,.9,.3,1.5,'#7a5a32']],e.px,e.py,0);
    L.slice(0,10).forEach((q,i)=>{const x=e.px-.36+(i%5)*.17,z=i<5?14.5:5.5;box(x,e.py-.04,z,.08,.08,2,q.c,1.1);box(x-.02,e.py-.06,z+2,.12,.12,3,q.c,1.25)});return}_ent747l(e)};
(function(){const st=document.createElement('style');st.textContent=`.lav47{background:#1e3a2a;border:6px solid #6a4a2a;border-radius:4px;padding:8px;max-height:40vh;overflow:auto;margin:6px 0;font-family:'Comic Sans MS',cursive,Georgia;color:#eef4ea}.lav47 small{color:#cfe0cf;opacity:.8}
.lav47>div{border-bottom:1px dashed #ffffff30;padding:5px 0;position:relative}.lav47>div.pin{background:#ffffff10}.lav47>div span{position:absolute;right:0;top:4px}.lav47 button{padding:1px 6px;font-size:12px;margin:0 0 0 4px}.lav47 b{color:#ffe8a0}`;document.head.appendChild(st)})();
