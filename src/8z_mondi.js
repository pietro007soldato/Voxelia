/* ================= 7.6: MONDI DELLA COMMUNITY =================
   Il browser dei mondi creati con Voxelia Studio e pubblicati sul server: prima pagina con i mondi in evidenza (quelli
   che in poche ore ricevono tante partite e recensioni), di tendenza, nuovi, più votati e più giocati; ricerca, tag,
   schede con galleria di immagini e video, stelle, recensioni, commenti, preferiti e segnalazioni; pagina dell'autore
   e il proprio profilo. Dall'editor si pubblica con un'anteprima a scelta: titolo, descrizione, tag, immagini scattate
   o caricate e un video registrato dentro l'editor (a mano, con il giro automatico o mentre si prova il mondo).
   Il server tiene tutto nella cartella mondi/. Senza server (gioco aperto come file) il browser spiega come avviarlo. */
const MAPI='/api/mondi',MSRV=!!window.GAME_WS;
// chiave segreta di questo browser: identifica l'autore senza password (il server ne tiene solo un'impronta)
function mKey(){let k=LS.get('voxelia_key','');if(!/^[0-9a-f]{32,64}$/.test(k)){const a=new Uint8Array(24);crypto.getRandomValues(a);k=[...a].map(b=>b.toString(16).padStart(2,'0')).join('');LS.set('voxelia_key',k)}return k}
async function mapi(p,o={}){const h={'x-voxelia':'1','x-voxelia-key':mKey()};let b=o.body;if(o.json){h['Content-Type']='application/json';b=JSON.stringify(o.json)}else if(b&&b.type)h['Content-Type']=b.type;
  let r;try{r=await fetch(MAPI+p,{method:o.m||(o.json||o.body?'POST':'GET'),headers:h,body:b,cache:'no-store'})}catch(e){throw{err:'Il server non risponde: controlla la connessione'}}
  let j=null;try{j=await r.json()}catch(e){}if(!r.ok||!j)throw Object.assign({err:(j&&j.err)||'Errore del server ('+r.status+')'},j||{},{st:r.status});return j}
const mJ=v=>esc(JSON.stringify(String(v==null?'':v)));   // testo dentro un onclick: prima stringa JS, poi attributo HTML
const mN=n=>{n=+n||0;return n>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,'')+' Mln':n>=1e4?Math.round(n/1e3)+'k':n>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,'')+'k':String(n|0)};
function mAgo(t){const s=(Date.now()-t)/1000;if(s<60)return'adesso';if(s<3600)return Math.floor(s/60)+' min fa';if(s<7200)return'un\'ora fa';if(s<86400)return Math.floor(s/3600)+' ore fa';if(s<172800)return'ieri';if(s<604800)return Math.floor(s/86400)+' giorni fa';return new Date(t).toLocaleDateString('it-IT',{day:'numeric',month:'short',year:'numeric'})}
const mStars=(v,cls)=>`<span class="mst${cls?' '+cls:''}" style="--v:${Math.max(0,Math.min(100,v/5*100))}%" role="img" aria-label="${(+v||0).toString().replace('.',',')} stelle su 5">★★★★★</span>`;
const mHue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const mCover=(c,big)=>c.cover?`<img src="${esc(c.cover)}" alt="" loading="lazy">`:`<div class="mph" style="--h:${mHue(c.id)}"><span>${big?'🗺':'🗺'}</span><b>${esc((c.n||'?').slice(0,1).toUpperCase())}</b></div>`;
const MPUB_K='voxelia_pubmap';const mPubMap=()=>LS.get(MPUB_K,{})||{};function mPubSet(wid,id){const o=mPubMap();if(id)o[wid]=id;else delete o[wid];LS.set(MPUB_K,o)}

/* ---------------- il browser ---------------- */
const MB={page:'home',arg:null,hist:[],q:'',ord:'trend',tag:'',pag:0,me:null,open:1,d:null,gi:0,feat:[],fi:0,ft:0,ret:null};
function mbOpen(page,arg){let el=$('mb');if(!el){el=document.createElement('div');el.id='mb';el.setAttribute('role','dialog');el.setAttribute('aria-label','Mondi della community');document.body.appendChild(el)}
  el.hidden=false;document.body.classList.add('mbon');MB.hist=[];tone(560,.05,'triangle');
  el.innerHTML=`<div class="mbtop"><button class="mbx" onclick="mbClose()" title="Chiudi (Esc)" aria-label="Chiudi">✕</button><b class="mblogo">🌐 <span>Mondi della community</span></b>
    <nav class="mbnav">${[['home','🏠','Home'],['lista','🧭','Esplora'],['pref','❤','Preferiti'],['io','👤','Il mio profilo']].map(([k,i,n])=>`<button data-p="${k}" onclick="mbGo('${k}')"><span>${i}</span> ${n}</button>`).join('')}</nav>
    <form class="mbs" onsubmit="event.preventDefault();MB.q=this.q.value.trim();MB.pag=0;mbGo('lista')">🔍<input name="q" placeholder="Cerca mondi, autori, generi..." value="${esc(MB.q)}" aria-label="Cerca"></form></div><div class="mbb" id="mbb"></div>`;
  mbGo(page||'home',arg,1)}
function mbClose(){const el=$('mb');if(el){el.hidden=true;el.innerHTML=''}document.body.classList.remove('mbon');clearInterval(MB.ft);MB.ft=0}
const mbIsOpen=()=>{const el=$('mb');return!!(el&&!el.hidden)};
function mbGo(p,arg,nohist){if(!nohist&&MB.page)MB.hist.push([MB.page,MB.arg]);if(MB.hist.length>30)MB.hist.shift();MB.page=p;MB.arg=arg;clearInterval(MB.ft);MB.ft=0;
  for(const b of document.querySelectorAll('.mbnav button'))b.classList.toggle('on',b.dataset.p===p);const B=$('mbb');if(!B)return;B.scrollTop=0;
  if(!MSRV){B.innerHTML=mbNoSrv();return}
  B.innerHTML='<div class="mbload">Caricamento…</div>';
  ({home:mbHome,lista:mbLista,pref:mbPref,w:mbW,autore:mbAutore,io:mbIo}[p]||mbHome)(arg).catch(e=>{if($('mbb')&&MB.page===p)$('mbb').innerHTML=`<div class="mbempty">⚠ ${esc(e.err||'Errore')}<br><button onclick="mbGo('${p}',MB.arg,1)">Riprova</button></div>`})}
function mbBack(){const h=MB.hist.pop();if(h)mbGo(h[0],h[1],1);else mbGo('home',null,1)}
function mbNoSrv(){return`<div class="mbempty big"><h2>🌐 I mondi della community stanno sul server</h2><p>Per giocare ai mondi degli altri, recensirli e pubblicare i tuoi, apri il gioco dal server di Voxelia:</p>
  <ol><li>avvia <code>node server.js</code> nella cartella del gioco;</li><li>apri <code>http://localhost:3000</code> nel browser (o l'indirizzo che il server scrive all'avvio, per gli amici sulla stessa rete);</li><li>torna qui: Parco giochi → 🌐 Mondi della community.</li></ol>
  <p class="mu">Ora il gioco è aperto come file, senza server: puoi sempre esportare un mondo in un file e regalarlo.</p></div>`}
// scheda piccola di un mondo
function mbCard(c,o={}){const nw=Date.now()-c.t0<3*864e5,up=!nw&&c.t1-c.t0>36e5&&Date.now()-c.t1<3*864e5;
  return`<button class="mbc${o.wide?' wide':''}" onclick="mbGo('w','${esc(c.id)}')" ${c.vid?`data-vid="${esc(c.vid)}" onmouseenter="mbHov(this,1)" onmouseleave="mbHov(this,0)" onfocus="mbHov(this,1)" onblur="mbHov(this,0)"`:''} aria-label="${esc(c.n)} di ${esc(c.a)}">
    <span class="mbcv">${mCover(c)}${c.vid?'<i class="mbtag v">▶ video</i>':''}${c.pin?'<i class="mbtag p">⭐ scelto</i>':nw?'<i class="mbtag n">NUOVO</i>':up?'<i class="mbtag u">AGGIORNATO</i>':c.hot>=6?'<i class="mbtag h">🔥</i>':''}</span>
    <span class="mbci"><b>${esc(c.n)}</b><small>di ${esc(c.a)}</small><span class="mbcs">${c.r.n?mStars(c.r.avg)+` <em>${String(c.r.avg).replace('.',',')}</em> <span class="mu">(${c.r.n})</span>`:'<span class="mu">nessuna recensione</span>'}</span>
    <span class="mbcn"><span title="Partite">▶ ${mN(c.st.p)}</span><span title="Visualizzazioni">👁 ${mN(c.st.v)}</span>${c.st.c?`<span title="Commenti">💬 ${mN(c.st.c)}</span>`:''}${c.st.f?`<span title="Preferiti">❤ ${mN(c.st.f)}</span>`:''}</span></span></button>`}
function mbHov(el,on){const s=el.dataset.vid,cv2=el.querySelector('.mbcv');if(!s||!cv2)return;let v=cv2.querySelector('video');if(on){if(!v){v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.src=s;cv2.appendChild(v)}v.play().catch(()=>{})}else if(v)v.remove()}
const mbRow=(t,L,more)=>L&&L.length?`<section class="mbrow"><h3>${t}${more?`<button class="mblink" onclick="${more}">Vedi tutti →</button>`:''}</h3><div class="mbrl">${L.map(c=>mbCard(c)).join('')}</div></section>`:'';
async function mbHome(){const d=await mapi('/home');if(MB.page!=='home')return;MB.me=d.me;MB.open=d.open;MB.feat=d.feat||[];MB.fi=0;const B=$('mbb');
  let h='';
  if(MB.feat.length)h+=`<section class="mbhero" id="mbhero"></section>`;
  else if(!d.n)h+=`<div class="mbempty big"><h2>Ancora nessun mondo pubblicato</h2><p>Sii il primo! Apri un tuo mondo in Voxelia Studio e premi <b>🌐 Pubblica</b> in alto.</p><button class="gold" onclick="mbClose();mode('parco')">🎡 Vai al Parco giochi</button></div>`;
  h+=mbRow('🔥 Di tendenza',d.trend,"MB.ord='trend';mbGo('lista')")+mbRow('✨ Appena pubblicati',d.nuovi,"MB.ord='nuovi';mbGo('lista')")+mbRow('🏆 I più votati',d.top,"MB.ord='top';mbGo('lista')")+mbRow('▶ I più giocati',d.giocati,"MB.ord='giocati';mbGo('lista')");
  const tg=(d.tags||[]).filter(t=>t[1]);if(tg.length)h+=`<section class="mbrow"><h3>🏷 Per genere</h3><div class="mbtags">${tg.map(([t,n])=>`<button onclick="MB.tag=${mJ(t)};MB.q='';MB.pag=0;mbGo('lista')">${esc(t)} <span>${n}</span></button>`).join('')}</div></section>`;
  if(!d.open)h=`<p class="mbnote">🔒 L'admin del server ha chiuso per ora pubblicazioni, recensioni e commenti. Puoi comunque giocare.</p>`+h;
  B.innerHTML=h;if(MB.feat.length){mbHero();MB.ft=setInterval(()=>{if(MB.feat.length>1&&!document.querySelector('#mbhero:hover')){MB.fi=(MB.fi+1)%MB.feat.length;mbHero()}},9000)}}
function mbHero(){const el=$('mbhero');if(!el)return;const c=MB.feat[MB.fi];if(!c)return;
  el.innerHTML=`<div class="mbhm" onclick="mbGo('w','${esc(c.id)}')">${c.vid?`<video src="${esc(c.vid)}" ${c.cover?`poster="${esc(c.cover)}"`:''} muted loop autoplay playsinline></video>`:mCover(c,1)}</div>
    <div class="mbhi"><span class="mbwhy">${c.pin?'⭐ In evidenza':'🔥 In evidenza'}</span><h2>${esc(c.n)}</h2><p class="mbby">di <a href="#" onclick="event.preventDefault();mbGo('autore','${esc(c.au)}')">${esc(c.a)}</a></p>
    <p class="mbhs">${c.r.n?mStars(c.r.avg,'big')+` <b>${String(c.r.avg).replace('.',',')}</b> <span class="mu">(${c.r.n} ${c.r.n===1?'recensione':'recensioni'})</span>`:'<span class="mu">Ancora nessuna recensione</span>'}</p>
    <p class="mbhn">▶ ${mN(c.st.p)} partite · 👁 ${mN(c.st.v)} visualizzazioni · 👥 ${mN(c.st.pu)} giocatori</p><p class="mu">${esc(c.why||'')}</p>
    <div class="mbha"><button class="gold big" onclick="mbPlay('${esc(c.id)}')">▶ Gioca</button><button onclick="mbGo('w','${esc(c.id)}')">Scopri di più</button></div>
    ${MB.feat.length>1?`<div class="mbdots">${MB.feat.map((f,i)=>`<button class="${i===MB.fi?'on':''}" aria-label="${esc(f.n)}" onclick="MB.fi=${i};mbHero()"></button>`).join('')}</div>`:''}</div>`}
const MBORD=[['trend','🔥 Di tendenza'],['nuovi','✨ I più nuovi'],['aggiornati','⟳ Aggiornati di recente'],['top','🏆 I più votati'],['giocati','▶ I più giocati'],['preferiti','❤ I più amati']];
async function mbLista(){const p=new URLSearchParams({ord:MB.ord,q:MB.q,tag:MB.tag,pag:MB.pag});const[d,tg]=await Promise.all([mapi('/lista?'+p),MB.tags?Promise.resolve({tags:MB.tags}):mapi('/tags')]);MB.tags=tg.tags;if(MB.page!=='lista')return;
  const B=$('mbb');const sel=`<select onchange="MB.ord=this.value;MB.pag=0;mbGo('lista',0,1)" aria-label="Ordina">${MBORD.map(([k,n])=>`<option value="${k}"${MB.ord===k?' selected':''}>${n}</option>`).join('')}</select>`;
  let h=`<div class="mbhead"><h2>🧭 Esplora${MB.q?' · «'+esc(MB.q)+'»':''}</h2><span class="mu">${d.n} ${d.n===1?'mondo':'mondi'}</span>${sel}</div>
  <div class="mbtags">${['',...MB.tags].map(t=>`<button class="${MB.tag===t?'on':''}" onclick="MB.tag=${mJ(t)};MB.pag=0;mbGo('lista',0,1)">${t?esc(t):'Tutti'}</button>`).join('')}${MB.q?`<button class="clr" onclick="MB.q='';document.querySelector('.mbs input').value='';mbGo('lista',0,1)">✕ togli la ricerca</button>`:''}</div>`;
  h+=d.L.length?`<div class="mbgrid">${d.L.map(c=>mbCard(c)).join('')}</div>`:`<div class="mbempty">Nessun mondo trovato.</div>`;
  if(d.more||MB.pag)h+=`<div class="mbpag">${MB.pag?`<button onclick="MB.pag--;mbGo('lista',0,1)">← Precedenti</button>`:''}<span class="mu">pagina ${MB.pag+1}</span>${d.more?`<button onclick="MB.pag++;mbGo('lista',0,1)">Successivi →</button>`:''}</div>`;
  B.innerHTML=h}
async function mbPref(){const d=await mapi('/io');if(MB.page!=='pref')return;$('mbb').innerHTML=`<div class="mbhead"><h2>❤ I tuoi preferiti</h2></div>`+(d.favs.length?`<div class="mbgrid">${d.favs.map(c=>mbCard(c)).join('')}</div>`:`<div class="mbempty">Non hai ancora preferiti: premi ❤ nella scheda di un mondo per ritrovarlo qui.</div>`)}
async function mbAutore(u){const d=await mapi('/autore/'+encodeURIComponent(u));if(MB.page!=='autore')return;
  $('mbb').innerHTML=`<button class="mbback" onclick="mbBack()">← Indietro</button><div class="mbauth"><div class="mbav" style="--h:${mHue(u)}">${esc((d.n||'?').slice(0,1).toUpperCase())}</div><div><h2>${esc(d.n)}</h2><p class="mu">${d.L.length} ${d.L.length===1?'mondo pubblicato':'mondi pubblicati'} · ▶ ${mN(d.plays)} partite${d.nrev?' · media '+String(d.avg).replace('.',',')+' ★ su '+d.nrev+' recensioni':''}${d.since?' · autore dal '+new Date(d.since).toLocaleDateString('it-IT'):''}</p></div></div>
    ${d.L.length?`<div class="mbgrid">${d.L.map(c=>mbCard(c)).join('')}</div>`:'<div class="mbempty">Nessun mondo pubblicato.</div>'}`}

/* ---- la scheda di un mondo ---- */
async function mbW(id){const d=await mapi('/w/'+encodeURIComponent(id));if(MB.page!=='w'||MB.arg!==id)return;MB.d=d;MB.gi=0;mapi('/w/'+encodeURIComponent(id)+'/vista',{m:'POST'}).catch(()=>{});mbWRender()}
function mbWRender(){const d=MB.d,B=$('mbb');if(!d||!B)return;const sv=LS.get(EDSK+'pub_'+d.id,null),pv=(LS.get('voxelia_pubv',{})||{})[d.id],md=d.media.length?d.media:null,R=d.r,me=d.me;
  const st=(i,n,l)=>`<div class="mbst"><b>${i} ${mN(n)}</b><small>${l}</small></div>`;
  B.innerHTML=`<button class="mbback" onclick="mbBack()">← Indietro</button>
  <div class="mbw"><div class="mbgal"><div class="mbgm" id="mbgm"></div>${md&&md.length>1?`<div class="mbgt">${md.map((m,i)=>`<button class="${i===MB.gi?'on':''}" onclick="MB.gi=${i};mbGal()" aria-label="Anteprima ${i+1}">${m.k==='vid'?`<span class="mbgv">▶</span>${d.cover?`<img src="${esc(d.cover)}" alt="">`:''}`:`<img src="${esc(m.url)}" alt="" loading="lazy">`}</button>`).join('')}</div>`:''}</div>
  <div class="mbinfo"><h2>${esc(d.n)}</h2><p class="mbby">di <a href="#" onclick="event.preventDefault();mbGo('autore','${esc(d.au)}')">${esc(d.a)}</a> · pubblicato ${mAgo(d.t0)}${d.t1-d.t0>6e4?' · aggiornato '+mAgo(d.t1):''}${d.ver>1?' · versione '+d.ver:''}</p>
    ${d.tags.length?`<div class="mbtags sm">${d.tags.map(t=>`<button onclick="MB.tag=${mJ(t)};MB.q='';MB.pag=0;mbGo('lista')">${esc(t)}</button>`).join('')}</div>`:''}
    <div class="mbrate">${R.n?`<div class="mbrbig"><b>${String(R.avg).replace('.',',')}</b>${mStars(R.avg,'big')}<small>${R.n} ${R.n===1?'recensione':'recensioni'}</small></div><div class="mbdist">${[5,4,3,2,1].map(s=>`<div><span>${s}★</span><i><em style="width:${R.n?R.dist[s-1]/R.n*100:0}%"></em></i><span>${R.dist[s-1]}</span></div>`).join('')}</div>`:'<p class="mu">Ancora nessuna recensione: giocalo e dai tu le prime stelle!</p>'}</div>
    <div class="mbsts">${st('▶',d.st.p,'partite')}${st('👥',d.st.pu,'giocatori')}${st('🏁',d.st.d,'l\'hanno finito')}${st('👁',d.st.v,'visualizzazioni')}${st('❤',d.st.f,'preferiti')}</div>
    <p class="mu">🗺 ${d.maps} ${d.maps===1?'mappa':'mappe'} · 🧑 ${d.npcs} personaggi · 📜 ${d.quests} missioni</p>
    <div class="mbact"><button class="gold big" onclick="mbPlay('${esc(d.id)}',0)">▶ ${sv?'Continua':'Gioca'}</button>${sv?`<button onclick="ovrMbW('${esc(d.id)}')">↺ Da capo</button>`:''}
      <button class="${me.fav?'on':''}" onclick="mbFav()" aria-pressed="${me.fav?'true':'false'}">${me.fav?'❤ Nei preferiti':'🤍 Preferito'}</button>
      ${d.remix||me.own?`<button onclick="mbCopy()" title="${me.own?'Scarica il tuo mondo nel Parco giochi di questo dispositivo':'Una copia tutta tua da aprire nell\'editor'}">📥 ${me.own?'Scarica nel Parco giochi':'Copia nel Parco giochi'}</button>`:''}
      ${me.own?`<button onclick="mpubOpen({scheda:MB.d})">✏ Modifica l'anteprima</button>`:`<button class="ghost" onclick="mbReport()">🚩 Segnala</button>`}</div>
    ${sv&&pv&&pv!==d.ver?'<p class="mbnote">ℹ L\'autore ha aggiornato il mondo dopo la tua ultima partita: se qualcosa non torna, ricomincia da capo.</p>':''}
    ${me.own?'<p class="mbnote ok">✔ Questo mondo è tuo. Per aggiornarlo aprilo nell\'editor e premi 🌐 Pubblica.</p>':''}</div></div>
  ${d.d?`<section class="mbdesc"><h3>📖 Descrizione</h3><p>${esc(d.d).replace(/\n/g,'<br>')}</p></section>`:''}
  <div class="mbcols"><section class="mbrev" id="mbrev"></section><section class="mbcom" id="mbcom"></section></div>`;
  mbGal();mbRevRender();mbComRender();if(MB.focusRev){MB.focusRev=0;const r=$('mbrev');if(r)r.scrollIntoView({behavior:'smooth'})}}
function mbGal(){const d=MB.d,el=$('mbgm');if(!d||!el)return;const m=d.media[MB.gi];
  el.innerHTML=m?(m.k==='vid'?`<video src="${esc(m.url)}" ${d.cover?`poster="${esc(d.cover)}"`:''} controls muted autoplay loop playsinline></video>`:`<img src="${esc(m.url)}" alt="Anteprima di ${esc(d.n)}">`)+(d.media.length>1?`<button class="mbgp" aria-label="Precedente" onclick="MB.gi=(MB.gi+${d.media.length-1})%${d.media.length};mbGal()">‹</button><button class="mbgn" aria-label="Successiva" onclick="MB.gi=(MB.gi+1)%${d.media.length};mbGal()">›</button>`:''):mCover(d,1);
  for(const[i,b]of[...document.querySelectorAll('.mbgt button')].entries())b.classList.toggle('on',i===MB.gi)}
function mbStarsIn(cur){return`<span class="mbsi" role="radiogroup" aria-label="Stelle">${[1,2,3,4,5].map(s=>`<button type="button" class="${s<=cur?'on':''}" data-s="${s}" role="radio" aria-checked="${s===cur}" aria-label="${s} ${s===1?'stella':'stelle'}" onmouseenter="mbSiHov(this.parentNode,${s})" onmouseleave="mbSiHov(this.parentNode,0)" onclick="MB.rs=${s};mbSiHov(this.parentNode,0)">★</button>`).join('')}</span>`}
function mbSiHov(el,s){const v=s||MB.rs||0;for(const b of el.querySelectorAll('button'))b.classList.toggle('on',+b.dataset.s<=v)}
function mbRevRender(){const d=MB.d,el=$('mbrev');if(!d||!el)return;const mine=d.me.rev;MB.rs=mine?mine.s:0;
  let h=`<h3>⭐ Recensioni <span class="mu">${d.r.n}</span></h3>`;
  if(d.me.own)h+=`<p class="mu">Gli altri giocatori lasciano qui le loro stelle.</p>`;
  else if(MB.open!==0)h+=`<div class="mbform"><b>${mine?'La tua recensione':'Dai il tuo voto'}</b>${mbStarsIn(MB.rs)}<textarea id="mbrt" rows="3" maxlength="800" placeholder="Cosa ti è piaciuto? Cosa miglioreresti? (facoltativo)">${esc(mine?mine.tx:'')}</textarea><div><button class="gold" onclick="mbRevSend()">${mine?'Aggiorna':'Pubblica la recensione'}</button>${mine?'<button class="ghost" onclick="mbRevDel()">Elimina</button>':''}</div></div>`;
  h+=d.rev.length?d.rev.map(r=>`<div class="mbitem"><div class="mbih"><a href="#" onclick="event.preventDefault();mbGo('autore','${esc(r.u)}')">${esc(r.n)}</a>${mStars(r.s)}<span class="mu">${mAgo(r.t)}</span></div>${r.tx?`<p>${esc(r.tx).replace(/\n/g,'<br>')}</p>`:''}</div>`).join(''):'<p class="mu">Nessuna recensione per ora.</p>';
  el.innerHTML=h}
function mbComRender(){const d=MB.d,el=$('mbcom');if(!d||!el)return;
  let h=`<h3>💬 Commenti <span class="mu">${d.com.length}</span></h3>`;
  if(MB.open!==0)h+=`<div class="mbform"><textarea id="mbct" rows="2" maxlength="600" placeholder="${d.me.own?'Rispondi ai tuoi giocatori...':'Scrivi un commento all\'autore e agli altri giocatori...'}"></textarea><div><button class="gold" onclick="mbComSend()">Invia</button></div></div>`;
  h+=d.com.length?d.com.map(c=>`<div class="mbitem${c.au?' au':''}"><div class="mbih"><a href="#" onclick="event.preventDefault();mbGo('autore','${esc(c.u)}')">${esc(c.n)}</a>${c.au?'<i class="mbau">autore</i>':''}<span class="mu">${mAgo(c.t)}</span>
    <span class="mbia"><button class="ghost sm" onclick="mbReply(${mJ(c.n)})">Rispondi</button>${c.u===d.me.uid||d.me.own?`<button class="ghost sm" onclick="mbComDel('${esc(c.id)}')">Elimina</button>`:''}</span></div><p>${esc(c.tx).replace(/\n/g,'<br>')}</p></div>`).join(''):'<p class="mu">Nessun commento: scrivi tu il primo!</p>';
  el.innerHTML=h}
function mbReply(n){const t=$('mbct');if(!t)return;t.value='@'+n+' '+t.value;t.focus()}
// un'azione che richiede il nome da autore: se manca lo si chiede e si riprova
async function mAct(fn){try{return await fn()}catch(e){if(e.nome){const ok=await mName();if(ok)try{return await fn()}catch(e2){edToast('⚠ '+(e2.err||'Errore'),'err');return null}return null}edToast('⚠ '+(e.err||'Errore'),'err');return null}}
async function mbRevSend(){const d=MB.d;if(!MB.rs){edToast('Scegli prima quante stelle dare','err');return}const tx=($('mbrt')||{}).value||'';
  const r=await mAct(()=>mapi('/w/'+d.id+'/recensione',{json:{s:MB.rs,tx}}));if(!r)return;edToast('⭐ Grazie per la recensione!');tone(880,.06,'triangle');const nd=await mapi('/w/'+d.id);MB.d=nd;mbWRender()}
async function mbRevDel(){const d=MB.d;if(!confirm('Eliminare la tua recensione?'))return;const r=await mAct(()=>mapi('/w/'+d.id+'/recensione',{json:{s:0}}));if(!r)return;MB.d=await mapi('/w/'+d.id);mbWRender()}
async function mbComSend(){const d=MB.d,t=$('mbct');if(!t||!t.value.trim())return;const tx=t.value;const r=await mAct(()=>mapi('/w/'+d.id+'/commento',{json:{tx}}));if(!r)return;MB.d=await mapi('/w/'+d.id);mbComRender();mbRevRender()}
async function mbComDel(cid){const d=MB.d;if(!confirm('Eliminare questo commento?'))return;const r=await mAct(()=>mapi('/w/'+d.id+'/elimina-commento',{json:{id:cid}}));if(!r)return;MB.d=await mapi('/w/'+d.id);mbComRender()}
async function mbFav(){const d=MB.d;const r=await mAct(()=>mapi('/w/'+d.id+'/preferito',{json:{}}));if(!r)return;d.me.fav=r.fav;d.st.f=r.n;if(r.fav)edToast('❤ Aggiunto ai preferiti');mbWRender()}
function mbReport(){const d=MB.d;mModal(`<h3>🚩 Segnala «${esc(d.n)}»</h3><p class="mu">La segnalazione arriva all'admin del server, che può nascondere o eliminare il mondo.</p>
  <select id="mrw">${['Contenuti offensivi o inadatti','Non funziona o non si può finire','Copiato da un altro autore','Spam','Altro'].map(s=>`<option>${s}</option>`).join('')}</select><textarea id="mrt" rows="3" maxlength="250" placeholder="Spiega in breve (facoltativo)"></textarea>`,
  [['Invia la segnalazione','gold',async()=>{const why=$('mrw').value+($('mrt').value.trim()?': '+$('mrt').value.trim():'');const r=await mAct(()=>mapi('/w/'+d.id+'/segnala',{json:{why}}));if(r)edToast('🚩 Segnalazione inviata, grazie');return true}],['Annulla','',()=>true]])}
async function mbCopy(){const d=MB.d;try{const j=await mapi('/w/'+d.id+'/mondo');const w=edFixWorld(j);if(!w)throw{err:'Mondo non valido'};
    if(d.me.own){if(d.wid)w.id=d.wid;if(edIdx().some(q=>q.id===w.id)&&!confirm('Nel Parco giochi di questo dispositivo c\'è già «'+w.name+'». Sostituirlo con la versione pubblicata?'))return;mPubSet(w.id,d.id)}
    else{w.id=edUid('w');w.name=(w.name+' (copia)').slice(0,60);w.remixOf={id:d.id,n:d.n,a:d.a};if(!/remix/i.test(w.desc))w.desc=('Copia di «'+d.n+'» di '+d.a+'. '+w.desc).slice(0,600)}
    edSaveWorld(w);edToast('📥 «'+w.name+'» è nel tuo Parco giochi');tone(700,.06,'triangle')}catch(e){edToast('⚠ '+(e.err||'Copia non riuscita'),'err')}}
// giocare un mondo pubblicato: si scarica, si controlla e si gioca con un salvataggio tutto suo
async function mbPlay(id,fresh){if(EDIT){if(!confirm('Uscire dall\'editor per giocare? Il mondo che stai modificando viene salvato.'))return;mpubClose();edExit()}edToast('⏳ Scarico il mondo…');let j,d=MB.d&&MB.d.id===id?MB.d:null;try{j=await mapi('/w/'+encodeURIComponent(id)+'/mondo');if(!d)d=await mapi('/w/'+encodeURIComponent(id))}catch(e){edToast('⚠ '+(e.err||'Download non riuscito'),'err');return}
  const w=edFixWorld(j);if(!w){edToast('⚠ Questo mondo è danneggiato','err');return}
  w.id='pub_'+id;w.pubId=id;w.name=d.n||w.name;if(!w.author)w.author=d.a;const pv=LS.get('voxelia_pubv',{})||{};pv[id]=d.ver;LS.set('voxelia_pubv',pv);if(fresh)LS.del(EDSK+w.id);
  mapi('/w/'+encodeURIComponent(id)+'/gioca',{m:'POST'}).catch(()=>{});mbClose();edPlay(w,{fresh})}

/* ---- profilo: nome da autore, codice personale, i propri mondi ---- */
async function mbIo(){const d=await mapi('/io');if(MB.page!=='io')return;MB.uid=d.uid;const B=$('mbb'),k=mKey();
  B.innerHTML=`<div class="mbhead"><h2>👤 Il mio profilo</h2></div><div class="mbprof">
  <section class="mbcard"><h3>Il tuo nome da autore</h3><p class="mu">Compare sui mondi che pubblichi, sulle recensioni e sui commenti. Su questo server è solo tuo.</p><div class="mbrowf"><input id="mion" maxlength="20" value="${esc(d.n||mSuggest())}" placeholder="Il tuo nome"><button class="gold" onclick="mName($('mion').value).then(ok=>ok&&mbGo('io',0,1))">${d.n?'Cambia':'Salva'}</button></div>${d.n?'':'<p class="mbnote">Non hai ancora un nome da autore: sceglilo per pubblicare, recensire e commentare.</p>'}</section>
  <section class="mbcard"><h3>🔑 Il tuo codice personale</h3><p class="mu">I tuoi mondi pubblicati, le recensioni e i preferiti sono legati a questo browser. Per usarli anche su un altro computer o telefono, copia il codice e incollalo là. <b>Non darlo a nessuno</b>: chi ce l'ha può modificare i tuoi mondi.</p>
    <div class="mbrowf"><input id="miok" value="${'•'.repeat(24)}" readonly aria-label="Codice personale"><button onclick="const e=$('miok');e.value=e.value.startsWith('•')?mKey():'${'•'.repeat(24)}'">👁</button><button onclick="navigator.clipboard&&navigator.clipboard.writeText(mKey()).then(()=>edToast('🔑 Codice copiato'),()=>edToast('Copia non riuscita','err'))">Copia</button></div>
    <details><summary>Usa il codice di un altro dispositivo</summary><div class="mbrowf"><input id="mion2" placeholder="Incolla qui il codice"><button onclick="mUseKey($('mion2').value)">Usa questo codice</button></div><p class="mu">Il codice attuale verrà sostituito: copialo prima se ti serve.</p></details></section></div>
  <div class="mbhead"><h2>🌐 I tuoi mondi pubblicati</h2><span class="mu">${d.mine.length}</span></div>
  ${d.mine.length?`<div class="mbmine">${d.mine.map(c=>`<div class="mbmi"><div class="mbmc">${mCover(c)}</div><div class="mbmt"><b>${esc(c.n)}</b>${c.hide?'<i class="mbtag u">nascosto</i>':''}<small class="mu">pubblicato ${mAgo(c.t0)} · aggiornato ${mAgo(c.t1)}</small>
      <span class="mbcn"><span>▶ ${mN(c.st.p)} partite</span><span>👥 ${mN(c.st.pu)}</span><span>🏁 ${mN(c.st.d)}</span><span>👁 ${mN(c.st.v)}</span><span>${c.r.n?'★ '+String(c.r.avg).replace('.',',')+' ('+c.r.n+')':'★ —'}</span><span>💬 ${c.st.c}</span><span>❤ ${c.st.f}</span>${c.hot>=1?`<span>🔥 ${c.hot}</span>`:''}</span></div>
      <div class="mbma"><button onclick="mbGo('w','${esc(c.id)}')">Apri la scheda</button>${edIdx().some(q=>q.id===c.wid)?`<button onclick="mbClose();edOpen('${esc(c.wid)}');setTimeout(()=>mpubOpen(),350)">✏ Apri nell'editor</button>`:''}<button onclick="mbHide('${esc(c.id)}',${c.hide?0:1})">${c.hide?'👁 Rendi visibile':'🙈 Nascondi'}</button><button class="ghost" onclick="mbRetire('${esc(c.id)}',${mJ(c.n)})">🗑 Ritira</button></div></div>`).join('')}</div>`:`<div class="mbempty">Non hai ancora pubblicato mondi. Aprine uno in Voxelia Studio e premi <b>🌐 Pubblica</b>.</div>`}
  ${d.favs.length?`<div class="mbhead"><h2>❤ Preferiti</h2></div><div class="mbgrid">${d.favs.map(c=>mbCard(c)).join('')}</div>`:''}`;
  for(const c of d.mine)if(c.wid)mPubSet(c.wid,c.id)}
async function mbHide(id,on){const r=await mAct(()=>mapi('/w/'+id+'/nascondi',{json:{on}}));if(r){edToast(on?'🙈 Il mondo non compare più nel browser':'👁 Il mondo è di nuovo visibile');mbGo('io',0,1)}}
async function mbRetire(id,n){if(!confirm('Ritirare «'+n+'»? Spariscono dal server il mondo, le anteprime, le recensioni e i commenti. Il mondo resta nel tuo Parco giochi.'))return false;const r=await mAct(()=>mapi('/w/'+id+'/ritira',{json:{}}));if(!r)return false;
  const o=mPubMap();for(const k in o)if(o[k]===id)delete o[k];LS.set(MPUB_K,o);for(const k in MPST)if(MPST[k].pubId===id)delete MPST[k];edToast('🗑 Mondo ritirato');if(mbIsOpen())mbGo(MB.page==='w'?'io':MB.page,0,1);return true}
function mUseKey(k){k=String(k||'').trim().toLowerCase();if(!/^[0-9a-f]{32,64}$/.test(k)){edToast('⚠ Questo non è un codice valido','err');return}if(!confirm('Usare questo codice? Il codice attuale di questo browser verrà sostituito.'))return;LS.set('voxelia_key',k);LS.del(MPUB_K);edToast('🔑 Codice cambiato');mbGo('io',0,1)}
const mSuggest=()=>((typeof NET!=='undefined'&&NET.name)||($('nm')&&$('nm').value.trim())||(typeof EW!=='undefined'&&EW&&EW.author)||'').replace(/[<>]/g,'').slice(0,20);
// chiede (o salva) il nome da autore
function mName(n){if(n!=null)return mapi('/io',{json:{n}}).then(r=>{edToast('👤 Ora sei «'+r.n+'»');return true}).catch(e=>{edToast('⚠ '+(e.err||'Errore'),'err');return false});
  return new Promise(res=>{mModal(`<h3>👤 Scegli il tuo nome da autore</h3><p class="mu">Comparirà sui mondi che pubblichi, sulle recensioni e sui commenti. Puoi cambiarlo dal profilo.</p><input id="mnm" maxlength="20" value="${esc(mSuggest())}" placeholder="Il tuo nome">`,
    [['Conferma','gold',async()=>{const ok=await mName($('mnm').value);if(ok)res(true);return ok}],['Annulla','',()=>{res(false);return true}]],'mnm')})}
// finestrella di conferma con pulsanti
function mModal(html,btns,focus){let el=$('mmod');if(!el){el=document.createElement('div');el.id='mmod';document.body.appendChild(el)}el.hidden=false;
  el.innerHTML=`<div class="mmb" role="dialog">${html}<div class="mmf">${btns.map(([t,c],i)=>`<button class="${c}" data-i="${i}">${t}</button>`).join('')}</div></div>`;
  for(const b of el.querySelectorAll('.mmf button'))b.onclick=async()=>{b.disabled=true;let close=true;try{close=await btns[+b.dataset.i][2]()}catch(e){}b.disabled=false;if(close!==false){el.hidden=true;el.innerHTML=''}};
  setTimeout(()=>{const f=focus&&$(focus);if(f){f.focus();f.select&&f.select()}},30)}

/* ---- giocando un mondo pubblicato: partite finite, ritorno alla scheda, invito a recensire ---- */
const _edEndM=edEnd;edEnd=function(ti,tx){const r=_edEndM(ti,tx);if(EW&&EW.pubId&&EDPLAY&&!EDPLAY.test){const id=EW.pubId;mapi('/w/'+encodeURIComponent(id)+'/finito',{m:'POST'}).catch(()=>{});
    const b=document.querySelector('#edend .edeb');if(b){const x=document.createElement('button');x.className='gold';x.textContent='⭐ Lascia una recensione';x.onclick=()=>{MB.focusRev=1;toMenu()};b.appendChild(x)}}return r};
const _toMenuM=toMenu;toMenu=function(){const id=MODE==='ed'&&!EDIT&&EW&&EW.pubId&&!(EDPLAY&&EDPLAY.test)?EW.pubId:null;_toMenuM();if(id&&MSRV)setTimeout(()=>mbOpen('w',id),60)};

/* ---------------- pubblicare dall'editor ---------------- */
const MPEND={};   // immagini e video scattati o registrati ma non ancora caricati, per mondo
const MPST={};    // stato della finestra di pubblicazione (modifiche non ancora pubblicate), per mondo
let MP=null;
async function mpubOpen(o={}){if(!MSRV){mModal(`<h3>🌐 Pubblicare serve un server</h3>${mbNoSrv().replace('mbempty big','')}`,[['Ho capito','gold',()=>true]]);return}
  const sch=o.scheda||null;if(!sch&&(!EDIT||!EW))return;
  let el=$('mpub');if(!el){el=document.createElement('div');el.id='mpub';document.body.appendChild(el)}el.hidden=false;el.innerHTML='<div class="mpb"><div class="mbload">Caricamento…</div></div>';
  let r;try{r=sch?{pub:sch,n:(await mapi('/io')).n,open:1,tags:null}:await mapi('/mio?wid='+encodeURIComponent(EW.id))}catch(e){el.innerHTML=`<div class="mpb"><div class="mbempty">⚠ ${esc(e.err)}<br><button onclick="mpubClose()">Chiudi</button></div></div>`;return}
  if(!MB.tags)try{MB.tags=r.tags||(await mapi('/tags')).tags}catch(e){MB.tags=[]}
  const wid=sch?(sch.wid||'scheda_'+sch.id):EW.id,p=r.pub;
  if(!MPST[wid]||(p?MPST[wid].pubId!==p.id:!!MPST[wid].pubId)){MPST[wid]={pubId:p?p.id:null,n:p?p.n:EW.name,d:p?p.d:EW.desc||'',tags:p?p.tags.slice():[],remix:p?!!p.remix:false,media:p?p.media.map(m=>({id:m.id,k:m.k,url:m.url})):[],cover:p&&p.cover?(p.media.find(m=>m.url===p.cover)||{}).id||'':'',st:p}}
  MP=MPST[wid];MP.wid=wid;MP.sch=!!sch;MP.who=r.n||'';MP.open=r.open!==false;if(p)MP.st=p;
  if(!sch&&MPEND[wid]&&MPEND[wid].length){for(const m of MPEND[wid]){if(m.k==='vid'){const old=MP.media.findIndex(x=>x.k==='vid');if(old>=0)MP.media.splice(old,1)}MP.media.push(m)}MPEND[wid]=[]}
  if(p&&!sch)mPubSet(EW.id,p.id);mpubRender()}
function mpubClose(){const el=$('mpub');if(el){el.hidden=true;el.innerHTML=''}}
const mpIsOpen=()=>{const el=$('mpub');return!!(el&&!el.hidden)};
const mpCover=()=>{const im=MP.media.filter(m=>m.k==='img');const c=im.find(m=>(m.id||m.url)===MP.cover);return c||im[0]||null};
function mpubRender(){const el=$('mpub');if(!el||!MP)return;const pub=MP.pubId,st=MP.st,ck=MP.sch?[]:edCheck().filter(q=>q.lv==='err'),cov=mpCover(),canRec=!MP.sch&&typeof MediaRecorder!=='undefined'&&!!HTMLCanvasElement.prototype.captureStream;
  const nImg=MP.media.filter(m=>m.k==='img').length,hasV=MP.media.some(m=>m.k==='vid');
  const card={id:pub||'nuovo',n:MP.n||'Senza titolo',a:MP.who||'te',cover:cov?cov.url:null,vid:null,t0:Date.now(),t1:Date.now(),r:st?st.r:{avg:0,n:0},st:st?st.st:{p:0,v:0,c:0,f:0},hot:0,tags:MP.tags};
  el.innerHTML=`<div class="mpb" role="dialog" aria-label="Pubblica il mondo"><div class="mph2"><b>🌐 ${pub?(MP.sch?'Modifica l\'anteprima':'Aggiorna la pubblicazione'):'Pubblica il tuo mondo'}</b><button class="edx" onclick="mpubClose()" aria-label="Chiudi">✕</button></div>
  <div class="mpc"><div class="mpl">
    <label>Titolo<input id="mpn" maxlength="60" value="${esc(MP.n)}" oninput="MP.n=this.value;mpPrev()"></label>
    <label>Descrizione<textarea id="mpd" rows="4" maxlength="1500" placeholder="Di cosa parla? Quanto dura? Cosa aspetta chi lo gioca?" oninput="MP.d=this.value">${esc(MP.d)}</textarea></label>
    <div class="mplab">Generi <span class="mu">(fino a 4)</span></div><div class="mbtags sm">${(MB.tags||[]).map(t=>`<button class="${MP.tags.includes(t)?'on':''}" onclick="mpTag(${mJ(t)})">${esc(t)}</button>`).join('')}</div>
    <label class="mpchk"><input type="checkbox" ${MP.remix?'checked':''} onchange="MP.remix=this.checked"> Permetti agli altri di copiarlo nel loro Parco giochi per studiarlo o modificarlo</label>
    <div class="mplab">Anteprime <span class="mu">${nImg}/8 immagini · ${hasV?'1 video':'nessun video'}</span></div>
    <div class="mpmed">${MP.media.map((m,i)=>`<div class="mpm${(m.id||m.url)===(cov&&(cov.id||cov.url))?' cov':''}">${m.k==='vid'?`<video src="${esc(m.url)}" muted loop autoplay playsinline></video><i class="mbtag v">🎬 video</i>`:`<img src="${esc(m.url)}" alt="">`}${m.blob?'<i class="mbtag n">da caricare</i>':''}${m.k==='img'&&(m.id||m.url)===(cov&&(cov.id||cov.url))?'<i class="mbtag p">copertina</i>':''}
      <span class="mpmb"><button title="Sposta a sinistra" onclick="mpMove(${i},-1)" ${i?'':'disabled'}>◀</button><button title="Sposta a destra" onclick="mpMove(${i},1)" ${i<MP.media.length-1?'':'disabled'}>▶</button>${m.k==='img'?`<button title="Usa come copertina" onclick="MP.cover=${mJ(m.id||m.url)};mpubRender()">★</button>`:''}<button title="Togli" onclick="mpDel(${i})">🗑</button></span></div>`).join('')||'<p class="mu">Nessuna anteprima: aggiungi immagini o un video. Senza immagini la scheda mostra un disegno con l\'iniziale del titolo.</p>'}</div>
    <div class="mpadd">${MP.sch?'':`<button onclick="mcamOpen('img')" ${nImg>=8?'disabled':''}>📷 Inquadra e scatta</button>`}<label class="mpup${nImg>=8?' dis':''}">🖼 Carica immagini<input type="file" accept="image/*" multiple onchange="mpFiles(this.files);this.value=''" ${nImg>=8?'disabled':''}></label>
      ${canRec?`<button onclick="mcamOpen('vid')">🎬 Registra un video</button><button onclick="mcamOpen('vid',{tour:1})">🎥 Video con giro automatico</button>`:''}</div>
    ${MP.sch?'<p class="mu">Per scattare foto o registrare un video, apri il mondo nell\'editor e premi 🌐 Pubblica.</p>':canRec?'<p class="mu">Il video dura fino a 20 secondi. Puoi registrarlo anche giocando: premi ▶ Prova e poi ⏺ Video nella barra in alto.</p>':'<p class="mu">Questo browser non sa registrare video: puoi comunque aggiungere immagini.</p>'}
    ${ck.length?`<p class="mbnote warn">⚠ Il controllo del mondo ha trovato ${ck.length} ${ck.length===1?'problema grave':'problemi gravi'} (per esempio: ${esc(ck[0].tx)}). Puoi pubblicare lo stesso, ma chi gioca potrebbe bloccarsi. <button class="sm" onclick="mpubClose();edCheckWin()">🩺 Vedi</button></p>`:''}
    ${!MP.open?'<p class="mbnote warn">🔒 L\'admin del server ha chiuso le pubblicazioni per ora.</p>':''}
  </div><div class="mpr"><div class="mplab">Così apparirà nel browser</div><div class="mpprev" id="mpprev">${mbCard(card)}</div>
    <p class="mu">Pubblichi come <b>${esc(MP.who||'(scegli un nome)')}</b> · <a href="#" onclick="event.preventDefault();mName().then(ok=>ok&&mapi('/io').then(r=>{MP.who=r.n;mpubRender()}))">cambia nome</a></p>
    ${st?`<div class="mpst"><b>Da quando l'hai pubblicato</b><span>▶ ${mN(st.st.p)} partite · 👥 ${mN(st.st.pu)} giocatori · 🏁 ${mN(st.st.d)} finiti</span><span>👁 ${mN(st.st.v)} visualizzazioni · ❤ ${mN(st.st.f)} preferiti</span><span>${st.r.n?'★ '+String(st.r.avg).replace('.',',')+' su '+st.r.n+' recensioni':'Nessuna recensione'} · 💬 ${st.com?st.com.length:st.st.c} commenti</span><button class="sm" onclick="mpubClose();mbOpen('w','${esc(pub)}')">Apri la scheda</button></div>`:''}
  </div></div>
  <div class="mpf" id="mpf">${MP.sch?`<button class="gold" onclick="mpGo(0)">💾 Salva l'anteprima</button>`:pub?`<button class="gold" onclick="mpGo(1)" title="Carica la versione attuale del mondo e la scheda">🌐 Aggiorna il mondo e l'anteprima</button><button onclick="mpGo(0)" title="Cambia titolo, descrizione, generi e anteprime senza toccare il mondo">✏ Aggiorna solo l'anteprima</button>`:`<button class="gold big" onclick="mpGo(1)" ${MP.open?'':'disabled'}>🌐 Pubblica</button>`}
    ${pub?`<button class="ghost" onclick="mbRetire('${esc(pub)}',${mJ(MP.n)}).then(ok=>{if(ok)mpubClose()})">🗑 Ritira</button>`:''}<button class="ghost" onclick="mpubClose()">Chiudi</button><span class="mpmsg" id="mpmsg" aria-live="polite"></span></div></div>`}
function mpPrev(){const e=$('mpprev');if(!e||!MP)return;const b=e.querySelector('.mbci b');if(b)b.textContent=MP.n||'Senza titolo'}
function mpTag(t){const i=MP.tags.indexOf(t);if(i>=0)MP.tags.splice(i,1);else{if(MP.tags.length>=4){edToast('Al massimo 4 generi','err');return}MP.tags.push(t)}mpubRender()}
function mpMove(i,d){const j=i+d;if(j<0||j>=MP.media.length)return;const a=MP.media;[a[i],a[j]]=[a[j],a[i]];mpubRender()}
function mpDel(i){const m=MP.media[i];if(!m)return;if(m.blob&&m.url)URL.revokeObjectURL(m.url);MP.media.splice(i,1);mpubRender()}
// immagini dal disco: ridotte a 1280×720 al massimo e salvate in JPEG
async function mpFiles(F){for(const f of[...F]){if(MP.media.filter(m=>m.k==='img').length>=8){edToast('Al massimo 8 immagini','err');break}if(!/^image\//.test(f.type))continue;
  try{const b=await mImgFit(f);MP.media.push({k:'img',blob:b,url:URL.createObjectURL(b)})}catch(e){edToast('⚠ Immagine non leggibile: '+f.name,'err')}}mpubRender()}
function mImgFit(src){return new Promise((res,rej)=>{const u=URL.createObjectURL(src),im=new Image();im.onload=()=>{const k=Math.min(1,1280/im.width,720/im.height),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(),'image/jpeg',.86)};im.onerror=()=>{URL.revokeObjectURL(u);rej()};im.src=u})}
async function mpGo(withWorld){if(!MP)return;const msg=s=>{const e=$('mpmsg');if(e)e.textContent=s},btns=()=>document.querySelectorAll('#mpf button');
  MP.n=($('mpn')||{}).value||MP.n;MP.d=($('mpd')||{}).value||'';if((MP.n||'').trim().length<2){edToast('Dai un titolo al mondo','err');return}
  for(const b of btns())b.disabled=true;
  try{// 1) il nome da autore
    if(!MP.who){const ok=await mName();if(!ok)throw{err:'Serve un nome da autore per pubblicare'};MP.who=(await mapi('/io')).n}
    // 2) le anteprime nuove
    const todo=MP.media.filter(m=>m.blob);let k=0;for(const m of todo){k++;msg(`Carico le anteprime… ${k}/${todo.length}${m.k==='vid'?' (video)':''}`);const r=await mapi('/media',{body:m.blob});const cov=MP.cover===m.url;URL.revokeObjectURL(m.url);Object.assign(m,{id:r.id,url:r.url,blob:null});if(cov)MP.cover=r.id}
    // 3) la scheda e, se serve, il mondo
    msg(withWorld?'Pubblico il mondo…':'Aggiorno l\'anteprima…');const c=mpCover();
    const body={id:MP.pubId||undefined,n:MP.n.trim(),d:MP.d,tags:MP.tags,remix:MP.remix,media:MP.media.map(m=>m.id),cover:c?c.id:null};
    if(withWorld){edSaveNow(1);EW.author=MP.who;body.wid=EW.id;body.mondo=edPack(EW)}
    const r=await mAct(()=>mapi('/pubblica',{json:body}));if(!r)throw{err:''};
    const first=!MP.pubId;MP.pubId=r.id;if(!MP.sch)mPubSet(EW.id,r.id);msg('');jingle([72,76,79,84],.09,'triangle');
    edToast(first?'🌐 Pubblicato! Ora tutti i giocatori del server possono trovarlo':withWorld?'🌐 Mondo e anteprima aggiornati':'✏ Anteprima aggiornata');
    try{MP.st=await mapi('/w/'+r.id)}catch(e){}
    if(MP.sch){mpubClose();if(mbIsOpen()&&MB.page==='w'){MB.d=MP.st||MB.d;mbWRender()}return}mpubRender();
    if(first)mModal(`<h3>🎉 «${esc(MP.n)}» è pubblicato!</h3><p>Lo trovi nel browser dei mondi: chi gioca su questo server può giocarlo, dargli le stelle e commentarlo. Se riceve tante partite e recensioni in poco tempo finisce <b>in evidenza</b> nella prima pagina.</p><p class="mu">Quando cambi il mondo, torna qui e premi «Aggiorna il mondo e l'anteprima».</p>`,[['Vedi la scheda','gold',()=>{mpubClose();mbOpen('w',r.id);return true}],['Torna all\'editor','',()=>true]])
  }catch(e){if(e.err)edToast('⚠ '+e.err,'err');msg(e.err?'⚠ '+e.err:'')}finally{for(const b of btns())b.disabled=false}}
// dal Parco giochi: apre il mondo nell'editor e subito la finestra di pubblicazione
function mpFromMenu(id){edOpen(id);setTimeout(()=>{if(EDIT)mpubOpen()},350)}

/* ---------------- inquadrare, scattare, registrare ----------------
   L'immagine e il video sono un riquadro 16:9 al centro dello schermo, senza griglia né aiuti dell'editor.
   Si muove la vista come sempre (frecce, tasto destro o centrale trascinando, rotellina); giocando si gioca. */
const MREC={on:0,clean:0,kind:'',ret:null,tool:'',rec:null,ch:[],cv:null,q:null,t0:0,max:20,tour:null,last:0,box:null,wid:''};
function mcamRect(){const r=W/H>16/9?{h:H,w:H*16/9}:{w:W,h:W*9/16};r.x=(W-r.w)/2;r.y=(H-r.h)/2;return r}
function mcamOpen(kind,o={}){if(MREC.kind)return;const ed=!!EDIT;MREC.kind=kind;MREC.wid=EW?EW.id:'';MREC.ed=ed;MREC.ret=o.ret||null;mpubClose();
  if(ed){MREC.tool=EDS.tool;edTool('hand');EDS.sel=null}MREC.clean=1;document.body.classList.add('mcam');
  let el=$('mcam');if(!el){el=document.createElement('div');el.id='mcam';document.body.appendChild(el)}el.hidden=false;mcamUI();if(o.tour&&ed)setTimeout(()=>mrecStart(1),400)}
function mcamUI(){const el=$('mcam');if(!el)return;const r=mcamRect(),v=MREC.kind==='vid',on=MREC.on;
  el.innerHTML=`<div class="mcf${on?' rec':''}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>
  <div class="mcb">${on?`<b class="mcr">⏺ REC <span id="mct">0:00</span> / 0:${MREC.max}</b><button class="gold" onclick="mrecStop(1)">■ Ferma e usa</button><button onclick="mrecStop(0)">✕ Annulla</button>`:
  `<b>${v?'🎬 Registra un video':'📷 Inquadra e scatta'}</b><span class="mu">${MREC.ed?'Muovi la vista con le frecce o trascinando col tasto destro, rotellina per lo zoom':'Gioca normalmente: verrà registrato solo il mondo, senza i pannelli'}</span>
   ${MREC.ed?`<button onclick="SZ=clamp(SZ/1.15,.3,2.6)" title="Allontana">－</button><button onclick="SZ=clamp(SZ*1.15,.3,2.6)" title="Avvicina">＋</button><button class="${EDS.dark?'on':''}" onclick="EDS.dark=!EDS.dark;mcamUI()" title="Luce vera: notte, buio e interni">🌙</button>`:''}
   ${v?`<button class="gold" onclick="mrecStart(0)">⏺ Registra</button>${MREC.ed?'<button onclick="mrecStart(1)">🎥 Giro automatico</button>':''}`:`<button class="gold" onclick="mcamShot()">📷 Scatta</button>`}<button onclick="mcamClose()">Annulla</button>`}</div>`}
addEventListener('resize',()=>{if(MREC.kind)mcamUI()});
function mcamClose(){if(MREC.on)mrecStop(0);const el=$('mcam');if(el){el.hidden=true;el.innerHTML=''}document.body.classList.remove('mcam');MREC.clean=0;MREC.tour=null;
  if(MREC.ed&&EDIT&&MREC.tool)edTool(MREC.tool);const back=MREC.ed&&EDIT;MREC.kind='';if(back)mpubOpen()}
// consegna l'anteprima: nell'editor alla finestra di pubblicazione, giocando la si tiene per dopo
function mcamGive(item){const wid=MREC.wid;if(MREC.ed){const S2=MPST[wid];if(S2){if(item.k==='vid'){const i=S2.media.findIndex(m=>m.k==='vid');if(i>=0)S2.media.splice(i,1)}S2.media.push(item)}else(MPEND[wid]=MPEND[wid]||[]).push(item)}
  else{const L=MPEND[wid]=MPEND[wid]||[];if(item.k==='vid'){const i=L.findIndex(m=>m.k==='vid');if(i>=0)L.splice(i,1)}L.push(item);edToast(item.k==='vid'?'🎬 Video pronto: lo trovi in 🌐 Pubblica, tornato nell\'editor':'📷 Foto pronta: la trovi in 🌐 Pubblica, tornato nell\'editor')}}
function mcamGrab(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const r=mcamRect(),k=cv.width/W;c.getContext('2d').drawImage(cv,r.x*k,r.y*k,r.w*k,r.h*k,0,0,w,h);return c}
function mcamShot(){let rs0=null;if(cv.width<1200&&SET.rs<1){rs0=SET.rs;SET.rs=1;rs()}   // con la risoluzione ridotta la foto si scatta comunque nitida
  draw();const c=mcamGrab(1280,720);if(rs0!=null){SET.rs=rs0;rs()}
  flash('#ffffff',.5,250);tone(1400,.05,'triangle');c.toBlob(b=>{if(!b){edToast('⚠ Foto non riuscita','err');return}mcamGive({k:'img',blob:b,url:URL.createObjectURL(b)});mcamClose()},'image/jpeg',.88)}
function mrecStart(tour){if(MREC.on)return;const types=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'],mt=types.find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||'';
  const r=mcamRect(),k=cv.width/W,ow=Math.max(320,Math.min(1280,Math.round(r.w*k/16)*16)),oh=Math.round(ow*9/16/2)*2;
  MREC.cv=document.createElement('canvas');MREC.cv.width=ow;MREC.cv.height=oh;MREC.q=MREC.cv.getContext('2d');MREC.q.fillStyle='#000';MREC.q.fillRect(0,0,ow,oh);
  let rec;try{rec=new MediaRecorder(MREC.cv.captureStream(30),mt?{mimeType:mt,videoBitsPerSecond:2200000}:{videoBitsPerSecond:2200000})}catch(e){edToast('⚠ Questo browser non riesce a registrare il video','err');return}
  MREC.rec=rec;MREC.ch=[];MREC.keep=1;rec.ondataavailable=e=>{if(e.data&&e.data.size)MREC.ch.push(e.data)};
  rec.onstop=()=>{const keep=MREC.keep,ch=MREC.ch;MREC.ch=[];if(!keep||!ch.length)return;const b=new Blob(ch,{type:(rec.mimeType||mt||'video/webm').split(';')[0]});
    if(b.size>12*1048576){edToast('⚠ Il video è troppo pesante: registrane uno più corto','err');return}mcamGive({k:'vid',blob:b,url:URL.createObjectURL(b)});mcamClose()};
  if(tour){MREC.tour=mtourPlan();if(!MREC.tour){edToast('Mappa troppo vuota per il giro automatico: registra a mano','err');return}}
  MREC.on=1;MREC.t0=performance.now();MREC.last=MREC.t0;rec.start(250);tone(660,.05,'square');mcamUI()}
function mrecStop(keep){if(!MREC.on)return;MREC.on=0;MREC.keep=keep;MREC.tour=null;try{MREC.rec.stop()}catch(e){}if(!keep)mcamUI()}
function mrecFrame(){const r=mcamRect(),k=cv.width/W;MREC.q.drawImage(cv,r.x*k,r.y*k,r.w*k,r.h*k,0,0,MREC.cv.width,MREC.cv.height);
  const s=(performance.now()-MREC.t0)/1000,e=$('mct');if(e){const tx=Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');if(e.textContent!==tx)e.textContent=tx}if(s>=MREC.max)mrecStop(1)}
// giro automatico: la telecamera passa per i punti più interessanti della mappa (partenza, edifici, personaggi, porte, forzieri)
function mtourPlan(){const m=EM;if(!m)return null;const P0=[];const sp=EW.start.map===m.id?[EW.start.x,EW.start.y]:m.sp;P0.push([sp[0]+.5,sp[1]+.5]);
  for(const b of m.b)P0.push([b.x+b.w/2,b.y+b.h/2+1]);for(const e of m.e)if(e.k==='npc'||e.k==='po'||e.k==='ch'||e.k==='en')P0.push([e.x+.5,e.y+.5]);
  const pts=[P0[0]];while(pts.length<6){let best=null,bd=0;for(const p of P0){const d=Math.min(...pts.map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])));if(d>bd){bd=d;best=p}}if(!best||bd<4)break;pts.push(best)}
  if(pts.length<2){const c=m.N/2,r2=m.N/4;for(let i=0;i<4;i++)pts.push([c+Math.cos(i*1.57)*r2,c+Math.sin(i*1.57)*r2])}
  const path=[pts.shift()];while(pts.length){const l=path[path.length-1];let bi=0;pts.forEach((p,i)=>{if(Math.hypot(p[0]-l[0],p[1]-l[1])<Math.hypot(pts[bi][0]-l[0],pts[bi][1]-l[1]))bi=i});path.push(pts.splice(bi,1)[0])}
  let L=0;const seg=[];for(let i=0;i<path.length-1;i++){const d=Math.hypot(path[i+1][0]-path[i][0],path[i+1][1]-path[i][1]);seg.push(d);L+=d}
  const dur=Math.min(18,Math.max(10,L/3.2));EDS.cam.x=path[0][0];EDS.cam.y=path[0][1];camX=PX(EDS.cam.x,EDS.cam.y);camY=PY(EDS.cam.x,EDS.cam.y,10);
  return{path,seg,L,dur,t:0,z0:SZ}}
function mtourStep(dt){const T=MREC.tour;if(!T)return;T.t+=dt;const u=Math.min(1,T.t/T.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;let d=e*T.L,i=0;while(i<T.seg.length-1&&d>T.seg[i]){d-=T.seg[i];i++}
  const P=T.path,f=T.seg[i]?Math.min(1,d/T.seg[i]):0,p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1]||P[i],p3=P[i+2]||p2,cr=(a,b,c,d2)=>.5*((2*b)+(-a+c)*f+(2*a-5*b+4*c-d2)*f*f+(-a+3*b-3*c+d2)*f*f*f);
  EDS.cam.x=cr(p0[0],p1[0],p2[0],p3[0]);EDS.cam.y=cr(p0[1],p1[1],p2[1],p3[1]);SZ=clamp(T.z0*(1.15-.3*Math.sin(u*Math.PI)),.4,2.4);if(u>=1)mrecStop(1)}
// ogni fotogramma: niente aiuti dell'editor nel riquadro, giro automatico, copia nel video
const _drawM=draw;draw=function(){const now=performance.now();if(MREC.tour)mtourStep(Math.min(.05,(now-(MREC.lt||now))/1000));MREC.lt=now;if(MREC.clean&&EDIT)_draw75();else _drawM();if(MREC.on)mrecFrame()};

/* ---- tasti: con il browser o le finestre aperte non arrivano al gioco ---- */
addEventListener('keydown',e=>{const md=$('mmod');if(md&&!md.hidden){if(e.key==='Escape'){md.hidden=true;md.innerHTML=''}e.stopImmediatePropagation();return}
  if(MREC.kind){if(e.key==='Escape'){e.stopImmediatePropagation();MREC.on?mrecStop(0):mcamClose();return}
    // nell'editor durante l'inquadratura passano solo i tasti della vista (frecce, zoom): niente strumenti che dipingono
    if(MREC.ed&&!/^(Arrow|[+=\- ]$)/.test(e.key))e.stopImmediatePropagation();return}
  if(mpIsOpen()){if(e.key==='Escape')mpubClose();e.stopImmediatePropagation();return}
  if(mbIsOpen()){if(e.key==='Escape'){if(MB.hist.length)mbBack();else mbClose()}e.stopImmediatePropagation()}},true);

/* ---- inglese: il menu e i pulsanti principali (schede, recensioni e commenti restano come li scrivono i giocatori) ---- */
Object.assign(EN,{'🌐 Mondi della community':'🌐 Community worlds','Gioca ai mondi creati dagli altri giocatori, dai le stelle, commenta e pubblica i tuoi. I più giocati del momento finiscono in evidenza.':'Play worlds made by other players, rate them, comment and publish your own. The most played right now get featured.',
  'Gioca ai mondi creati dagli altri giocatori del server, dai le stelle, commenta e pubblica i tuoi.':'Play worlds made by other players on this server, rate them, comment and publish your own.','🌐 Pubblica':'🌐 Publish','Esplora':'Explore','Preferiti':'Favourites','Il mio profilo':'My profile','▶ Gioca':'▶ Play','Scopri di più':'Learn more','Vedi tutti →':'See all →',
  '🔥 Di tendenza':'🔥 Trending','✨ Appena pubblicati':'✨ Just published','🏆 I più votati':'🏆 Top rated','▶ I più giocati':'▶ Most played','🏷 Per genere':'🏷 By genre','← Indietro':'← Back','Invia':'Send','Rispondi':'Reply','Elimina':'Delete','Pubblica la recensione':'Post review','Aggiorna':'Update','Chiudi':'Close','Annulla':'Cancel'});

/* ---- stile ---- */
(function(){const st=document.createElement('style');st.textContent=`
#mb{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% -10%,#24305a,#0b0e1a 60%);color:#e8ecf4;font:14px Georgia,serif}#mb[hidden]{display:none}
#mb button,#mpub button,#mmod button,#mcam button{cursor:pointer}
.mbtop{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 14px;background:#0b0e1ae6;border-bottom:1px solid #f5b94255;box-shadow:0 6px 20px #0008}
.mbx{font-size:18px;padding:4px 10px}.mblogo{font-size:19px;color:#f5b942;white-space:nowrap}.mbnav{display:flex;gap:4px;flex-wrap:wrap}.mbnav button{padding:6px 12px;background:#1b2238;border:1px solid #ffffff1f;border-radius:20px;color:#dfe5f2}.mbnav button.on{background:#7a5a1e;border-color:#f5b942;color:#fff}
.mbs{margin-left:auto;flex:1 1 220px;max-width:380px}.mbs input{width:100%;box-sizing:border-box;padding:8px 14px;border-radius:20px;border:1px solid #f5b94266;background:#0b0e18;color:#fff;font:inherit}
.mbb{flex:1;overflow-y:auto;padding:14px clamp(12px,3vw,40px) 40px}.mbload{padding:60px;text-align:center;color:#9aa4b8}
.mbempty{padding:40px 20px;text-align:center;color:#c8cede}.mbempty.big{max-width:640px;margin:30px auto;background:#141a2ccc;border:1px solid #f5b94244;border-radius:14px;padding:26px 30px;text-align:left}.mbempty.big h2{color:#f5b942;margin-top:0}.mbempty code{background:#0006;padding:1px 6px;border-radius:4px}
.mbnote{background:#f5b94214;border:1px solid #f5b94255;border-radius:8px;padding:8px 12px;font-size:13px;line-height:1.4}.mbnote.ok{background:#4cd07a14;border-color:#4cd07a66}.mbnote.warn{background:#e5553314;border-color:#e5553388}
.mu{color:#9aa4b8}
.mbrow{margin:20px 0 6px}.mbrow h3,.mbhead h2{display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:18px;color:#f5d58a}.mblink{margin-left:auto;font-size:12px;background:transparent;border:none;color:#9fd0ff}
.mbrl{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,250px);gap:14px;overflow-x:auto;padding:4px 2px 12px;scroll-snap-type:x proximity}.mbrl>*{scroll-snap-align:start}
.mbgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
.mbc{display:flex;flex-direction:column;text-align:left;padding:0;background:#151b2e;border:1px solid #ffffff17;border-radius:12px;overflow:hidden;color:inherit;font:inherit;transition:transform .2s,box-shadow .2s,border-color .2s}
.mbc:hover,.mbc:focus-visible{transform:translateY(-4px);border-color:#f5b94299;box-shadow:0 12px 26px #000a}
.mbcv{position:relative;display:block;aspect-ratio:16/9;background:#0b0e18;overflow:hidden}.mbcv img,.mbcv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,hsl(var(--h),45%,32%),hsl(calc(var(--h) + 60),50%,18%))}.mph span{font-size:44px;opacity:.35}.mph b{position:absolute;font-size:46px;color:#fff;text-shadow:0 3px 12px #0009}
.mbtag{position:absolute;top:8px;left:8px;font:bold 10px system-ui,sans-serif;letter-spacing:.5px;padding:3px 7px;border-radius:10px;background:#4cd07a;color:#0b1a10;font-style:normal}.mbtag.v{left:auto;right:8px;background:#000a;color:#fff}.mbtag.p{background:#f5b942;color:#1b1408}.mbtag.u{background:#5ad0ff;color:#06202c}.mbtag.h{background:#ff6a3a;color:#fff}
.mbci{display:flex;flex-direction:column;gap:3px;padding:9px 12px 11px}.mbci b{font-size:15px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mbci small{color:#9aa4b8;font-size:12px}
.mbcs{font-size:12px;display:flex;align-items:center;gap:4px}.mbcs em{font-style:normal;color:#ffd84a;font-weight:bold}.mbcn{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:12px;color:#c8cede}
.mst{display:inline-block;font-size:14px;letter-spacing:1px;line-height:1;background:linear-gradient(90deg,#ffd84a var(--v),#4a5470 var(--v));-webkit-background-clip:text;background-clip:text;color:transparent}.mst.big{font-size:22px}
.mbhero{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,1fr);gap:0;border-radius:16px;overflow:hidden;border:1px solid #f5b94266;background:#121829;box-shadow:0 18px 50px #000a;margin-bottom:10px;min-height:280px}
.mbhm{position:relative;aspect-ratio:16/9;cursor:pointer;background:#000}.mbhm img,.mbhm video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mbhi{padding:18px 22px;display:flex;flex-direction:column;gap:4px;background:linear-gradient(160deg,#1d2440,#121829)}.mbhi h2{margin:6px 0 0;font-size:28px;color:#fff}.mbwhy{align-self:flex-start;background:#ff6a3a;color:#fff;font:bold 12px system-ui,sans-serif;padding:4px 10px;border-radius:12px}
.mbby a{color:#9fd0ff}.mbhs{margin:6px 0 0;display:flex;align-items:center;gap:6px}.mbhs b{font-size:20px;color:#ffd84a}.mbhn{margin:2px 0;color:#c8cede;font-size:13px}.mbha{display:flex;gap:8px;margin-top:auto;padding-top:10px;flex-wrap:wrap}
button.big{font-size:16px;padding:9px 20px}.mbdots{display:flex;gap:6px;margin-top:10px}.mbdots button{width:10px;height:10px;padding:0;border-radius:50%;background:#ffffff33;border:none}.mbdots button.on{background:#f5b942}
.mbtags{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 12px}.mbtags button{padding:5px 12px;border-radius:16px;background:#1b2238;border:1px solid #ffffff22;color:#dfe5f2;font-size:13px}.mbtags button span{color:#9aa4b8;font-size:11px}.mbtags button.on{background:#7a5a1e;border-color:#f5b942;color:#fff}.mbtags.sm button{padding:3px 10px;font-size:12px}.mbtags .clr{background:transparent}
.mbhead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:6px 0 10px}.mbhead h2{margin:0}.mbhead select{margin-left:auto;background:#0b0e18;color:#fff;border:1px solid #f5b94266;border-radius:6px;padding:5px 8px;font:inherit}
.mbpag{display:flex;align-items:center;justify-content:center;gap:12px;margin:20px 0}
.mbback{background:transparent;border:none;color:#9fd0ff;padding:4px 0;margin-bottom:8px;font-size:14px}
.mbw{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:22px;align-items:start}
.mbgm{position:relative;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;border:1px solid #f5b94244}.mbgm img,.mbgm video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
.mbgp,.mbgn{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:56px;font-size:30px;background:#000a;border:none;color:#fff;border-radius:8px;padding:0}.mbgp{left:8px}.mbgn{right:8px}
.mbgt{display:flex;gap:6px;margin-top:8px;overflow-x:auto;padding-bottom:4px}.mbgt button{position:relative;flex:0 0 96px;aspect-ratio:16/9;padding:0;border:2px solid transparent;border-radius:6px;overflow:hidden;background:#000}.mbgt button.on{border-color:#f5b942}.mbgt img{width:100%;height:100%;object-fit:cover;display:block}.mbgv{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;background:#0007;z-index:1}
.mbinfo h2{margin:0;font-size:26px;color:#fff}.mbinfo .mbby{margin:4px 0 8px;color:#9aa4b8}
.mbrate{display:flex;gap:16px;align-items:center;margin:10px 0;padding:10px 12px;background:#0000002a;border:1px solid #ffffff14;border-radius:10px}.mbrbig{display:flex;flex-direction:column;align-items:center;min-width:92px}.mbrbig b{font-size:34px;color:#ffd84a;line-height:1}.mbrbig small{color:#9aa4b8;font-size:11px;margin-top:3px}
.mbdist{flex:1;display:flex;flex-direction:column;gap:2px;font-size:11px;color:#c8cede}.mbdist div{display:flex;align-items:center;gap:6px}.mbdist i{flex:1;height:7px;background:#ffffff14;border-radius:4px;overflow:hidden}.mbdist em{display:block;height:100%;background:#ffd84a;border-radius:4px}.mbdist span:first-child{width:22px}.mbdist span:last-child{width:22px;text-align:right;color:#9aa4b8}
.mbsts{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;margin:8px 0}.mbst{background:#0000002a;border:1px solid #ffffff12;border-radius:8px;padding:6px 8px;text-align:center}.mbst b{display:block;font-size:16px}.mbst small{color:#9aa4b8;font-size:11px}
.mbact{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.mbact button.on{background:#5a1e2a;border-color:#ff7a8a}button.ghost{background:transparent!important;border-color:#ffffff33!important}button.sm{padding:2px 8px!important;font-size:12px!important}
.mbdesc{margin:22px 0;padding:12px 18px;background:#141a2ccc;border:1px solid #ffffff14;border-radius:12px;line-height:1.55}.mbdesc h3{margin:0 0 6px;color:#f5d58a}
.mbcols{display:grid;grid-template-columns:1fr 1fr;gap:22px}.mbcols h3{color:#f5d58a;margin:4px 0 10px}
.mbform{display:flex;flex-direction:column;gap:6px;padding:10px 12px;background:#f5b9420d;border:1px solid #f5b94244;border-radius:10px;margin-bottom:12px}.mbform textarea,.mmb textarea,.mmb input,.mmb select,.mbrowf input,.mpl input:not([type=checkbox]),.mpl textarea{font:inherit;background:#0b0e18;color:#e8ecf4;border:1px solid #f5b94266;border-radius:6px;padding:6px 8px;box-sizing:border-box;width:100%;resize:vertical}
.mbsi{display:inline-flex;gap:2px}.mbsi button{font-size:28px;line-height:1;padding:0 2px;background:transparent;border:none;color:#4a5470;transition:transform .12s,color .12s}.mbsi button.on{color:#ffd84a}.mbsi button:hover{transform:scale(1.15)}
.mbitem{padding:9px 12px;border-bottom:1px solid #ffffff12}.mbitem p{margin:4px 0 0;line-height:1.45;white-space:normal;overflow-wrap:anywhere}.mbitem.au{background:#f5b9420a;border-left:3px solid #f5b942}.mbih{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}.mbih a{color:#9fd0ff;font-weight:bold}.mbia{margin-left:auto;display:flex;gap:2px}.mbau{font:bold 10px system-ui,sans-serif;background:#f5b942;color:#1b1408;padding:1px 6px;border-radius:8px;font-style:normal}
.mbauth{display:flex;align-items:center;gap:16px;margin:6px 0 18px}.mbav{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:bold;background:linear-gradient(135deg,hsl(var(--h),55%,45%),hsl(calc(var(--h) + 50),55%,25%));color:#fff;box-shadow:0 4px 14px #0008}.mbauth h2{margin:0}
.mbprof{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}.mbcard{background:#141a2ccc;border:1px solid #ffffff17;border-radius:12px;padding:12px 16px}.mbcard h3{margin:0 0 4px;color:#f5d58a}.mbrowf{display:flex;gap:6px;margin:8px 0}.mbrowf input{flex:1}
.mbmine{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}.mbmi{display:grid;grid-template-columns:160px 1fr auto;gap:14px;align-items:center;background:#151b2e;border:1px solid #ffffff17;border-radius:12px;padding:8px;position:relative}.mbmc{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}.mbmc img{width:100%;height:100%;object-fit:cover}.mbmt{display:flex;flex-direction:column;gap:3px;min-width:0}.mbmt .mbtag{position:static;align-self:flex-start}.mbma{display:flex;flex-direction:column;gap:3px}
#mb a,#mpub a,#mmod a{color:#9fd0ff}
#mpub{position:fixed;inset:0;z-index:55;display:flex;align-items:center;justify-content:center;background:#05070fc0;font:14px Georgia,serif;color:#e8ecf4}#mpub[hidden]{display:none}
.mpb{width:min(1060px,97vw);max-height:94vh;display:flex;flex-direction:column;background:#1b2030;border:2px solid #f5b942;border-radius:12px;box-shadow:0 20px 60px #000c;overflow:hidden}
.mph2{display:flex;align-items:center;justify-content:space-between;padding:8px 12px 8px 18px;border-bottom:1px solid #f5b94244;background:#00000026}.mph2 b{font-size:19px;color:#f5b942}
.mpc{flex:1;overflow-y:auto;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(250px,1fr);gap:20px;padding:14px 18px}.mpl{display:flex;flex-direction:column;gap:8px}.mpl label{display:flex;flex-direction:column;gap:3px;font-size:13px;color:#c8cede}.mpl label.mpchk{flex-direction:row;align-items:flex-start;gap:6px}
.mplab{font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#f5b942;margin-top:6px}
.mpmed{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.mpm{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;border:2px solid #ffffff1a;background:#000}.mpm.cov{border-color:#f5b942}.mpm img,.mpm video{width:100%;height:100%;object-fit:cover;display:block}.mpm .mbtag.n{top:auto;bottom:30px;left:6px;background:#5ad0ff;color:#06202c}
.mpmb{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:2px;padding:3px;background:linear-gradient(transparent,#000c)}.mpmb button{padding:1px 7px;font-size:12px}
.mpadd{display:flex;flex-wrap:wrap;gap:6px}.mpadd{align-items:stretch}.mpadd>*{margin:0!important}.mpup{display:inline-flex;align-items:center;cursor:pointer;padding:6px 12px;border:1px solid #f5b94288;border-radius:4px;background:#2a3350;font:inherit;color:#e8ecf4}.mpup.dis{opacity:.5;pointer-events:none}.mpup input{display:none}
.mpr{display:flex;flex-direction:column;gap:8px}.mpprev .mbc{width:100%;pointer-events:none}.mpst{display:flex;flex-direction:column;gap:3px;padding:10px 12px;background:#0000002a;border:1px solid #ffffff14;border-radius:10px;font-size:13px}.mpst button{align-self:flex-start;margin-top:4px}
.mpf{display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:10px 18px;border-top:1px solid #f5b94244;background:#00000026}.mpmsg{color:#9fd0ff;font-size:13px}
#mmod{position:fixed;inset:0;z-index:66;display:flex;align-items:center;justify-content:center;background:#000a}#mmod[hidden]{display:none}.mmb{width:min(460px,92vw);background:#1b2030;border:2px solid #f5b942;border-radius:12px;padding:14px 18px;color:#e8ecf4;font:14px Georgia,serif;box-shadow:0 20px 50px #000c;display:flex;flex-direction:column;gap:8px}.mmb h3{margin:0;color:#f5b942}.mmb ol{padding-left:20px}.mmf{display:flex;justify-content:flex-end;gap:6px;margin-top:6px}
body.mcam #ed,body.mcam #edback,body.mcam #mpub{display:none!important}
body.mcam.ig #hud,body.mcam.ig #mm,body.mcam.ig #ruota{opacity:.25}
#mcam{position:fixed;inset:0;z-index:58;pointer-events:none}#mcam[hidden]{display:none}.mcf{position:absolute;border:2px dashed #f5b942;box-shadow:0 0 0 9999px #0007;box-sizing:border-box;border-radius:2px}.mcf.rec{border:3px solid #ff3a3a;box-shadow:0 0 0 9999px #000a}
.mcb{position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:6px;max-width:94vw;padding:6px 12px;background:#121828f2;border:1px solid #f5b942;border-radius:10px;pointer-events:auto;font:13px Georgia,serif;color:#e8ecf4;box-shadow:0 6px 20px #000a}.mcb button.on{background:#7a5a1e}
.mcr{color:#ff6a6a;font-family:system-ui,sans-serif;animation:mcblink 1s infinite}@keyframes mcblink{50%{opacity:.55}}
#edtop .edpub{background:#1e4a7a;border-color:#5ad0ff}
#msel .mode.mondi{border-color:#5ad0ff;background:linear-gradient(160deg,rgba(20,50,90,.85),rgba(50,25,70,.8))}#msel .mode i.nw2{position:absolute;top:8px;right:10px;font:bold 10px system-ui,sans-serif;background:#5ad0ff;color:#06202c;padding:2px 7px;border-radius:9px;font-style:normal}
.dcard.edcom{border-color:#5ad0ff!important;background:linear-gradient(160deg,rgba(20,50,90,.6),rgba(40,25,70,.6))!important}.edpubt{font:bold 10px system-ui,sans-serif;background:#5ad0ff;color:#06202c;padding:1px 6px;border-radius:8px;margin-left:6px;vertical-align:middle}
@media (max-width:820px){.mbnav button{padding:4px 9px;font-size:13px}.mbtop{gap:6px;padding:6px 10px}.mbhero,.mbw,.mbcols,.mbprof,.mpc{grid-template-columns:1fr}.mbmi{grid-template-columns:110px 1fr}.mbma{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}.mbhi h2{font-size:22px}.mblogo span{display:none}}
@media (prefers-reduced-motion:reduce){.mbc,.mbsi button{transition:none}.mcr{animation:none}}
`;document.head.appendChild(st)})();

/* ---------- 7.8: i Mondi della community con l'aspetto del gioco ----------
   Bacheca di legno e oro sopra il mondo che scorre dietro, schede come i pannelli del gioco (seguono il tema chiaro/scuro),
   bordi a cubetti con l'ombra sotto, icone voxel, scritte in Georgia come il resto di Voxelia. */
(function(){const st=document.createElement('style');st.id='mbvx';st.textContent=`
#mb{--wd1:#7a5532;--wd2:#5a3b22;--wd3:#3a2414;--gd:#f5b942;--gd2:#c98a1a;--pf:var(--pn);--ink:var(--fg);--hd:var(--ac2,#f5b942);
  background:radial-gradient(ellipse at 50% -20%,rgba(36,44,84,.55),rgba(8,10,20,.93) 62%);backdrop-filter:blur(3px);font:14px Georgia,serif}
#mb .mbb{scrollbar-width:thin;scrollbar-color:#c98a1a #0000}
#mb .mbtop{position:relative;gap:12px;padding:9px 16px 11px;background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);border-bottom:3px solid var(--wd3);box-shadow:inset 0 2px 0 #a37a4f,inset 0 -2px 0 #2e1d1055,0 5px 0 #00000066,0 12px 26px #0009}
#mb .mbtop::before,#mb .mbtop::after{content:'';position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}#mb .mbtop::before{left:5px}#mb .mbtop::after{right:5px}
#mb .mblogo{display:flex;align-items:center;gap:8px;font:bold 21px Georgia,serif;font-variant:small-caps;letter-spacing:1px;color:#ffd27a;text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244}#mb .mblogo .vi{width:28px;height:28px;vertical-align:0}
#mb .mbx{width:38px;height:38px;padding:0;display:flex;align-items:center;justify-content:center;background:#2a3350;border:2px solid #f5b942aa;border-radius:4px;box-shadow:0 3px 0 #0009}
#mb button{border-radius:3px;box-shadow:0 3px 0 #00000080;transition:transform .08s,box-shadow .08s,filter .15s}#mb button:active{transform:translateY(2px);box-shadow:0 1px 0 #00000080}
#mb .mbnav{gap:6px}#mb .mbnav button{display:flex;align-items:center;gap:6px;padding:6px 12px;background:#2a3350;border:1px solid #f5b94288;border-radius:3px;color:#fff;font:14px Georgia,serif}
#mb .mbnav button:hover{background:#3b4770}#mb .mbnav button.on{background:linear-gradient(180deg,#ffd27a,#e0a634 55%,#c98a1a);border-color:#fff0c0;color:#2a1a06;font-weight:bold;text-shadow:0 1px 0 #fff5}
#mb .mbs{position:relative}#mb .mbs .vi{position:absolute;left:9px;top:50%;transform:translateY(-50%);width:20px;height:20px;pointer-events:none}
#mb .mbs input{margin:0;padding:8px 12px 8px 36px;border-radius:3px;border:2px solid #3a2414;background:#f4ecd6;color:#2a2010;box-shadow:inset 0 2px 0 #0002,0 2px 0 #a37a4f66;font:14px Georgia,serif}#mb .mbs input::placeholder{color:#8a7a5a}
#mb .mbs input:focus{outline:none;border-color:#f5b942;box-shadow:0 0 0 2px #f5b94266}
#mb .mbrow h3,#mb .mbhead h2{font:bold 15px Georgia,serif;letter-spacing:1.6px;text-transform:uppercase;color:#ffd27a;text-shadow:1px 1px 0 #000}#mb .mbrow h3 .vi,#mb .mbhead h2 .vi{width:24px;height:24px;vertical-align:0}
#mb .mbrow h3::after{content:'';order:1;flex:1;height:2px;background:linear-gradient(90deg,#f5b94299,#f5b94200)}#mb .mblink{order:2;margin-left:0;box-shadow:none!important;color:#ffd27a;font-size:13px;text-transform:none;letter-spacing:0}
#mb .mbrl{padding:4px 4px 16px}
#mb .mbc{background:var(--pf);color:var(--ink);border:2px solid #8a6a3a;border-radius:4px;box-shadow:0 5px 0 #2e1d10,0 10px 20px #0007;transition:transform .15s,box-shadow .15s,border-color .15s}
#mb .mbc:hover,#mb .mbc:focus-visible{transform:translateY(-3px);border-color:#f5b942;box-shadow:0 8px 0 #2e1d10,0 0 0 2px #f5b94255,0 16px 26px #0008;outline:none}#mb .mbc:active{transform:translateY(1px);box-shadow:0 3px 0 #2e1d10}
#mb .mbcv{border-bottom:2px solid #8a6a3a;background:#0b0e18}
#mb .mbci b{font:bold 15px Georgia,serif;color:var(--ink)}#mb .mbci small,#mb .mbcn,#mb .mu{color:var(--mu)}#mb .mbcn .vi{width:15px;height:15px;vertical-align:-3px}
#mb .mbcs em{color:var(--hd);text-shadow:none}
#mb .mbtag,#mb .mbwhy{font:bold 10px Georgia,serif;letter-spacing:1px;text-transform:uppercase;border-radius:2px;border:1px solid #0005;box-shadow:0 2px 0 #0007;padding:3px 7px}
#mb .mbtag.n{background:#4cd07a;color:#0b1a10}#mb .mbtag.v{background:#1b2030e6;color:#fff;border-color:#f5b94288}#mb .mbtag .vi{width:13px;height:13px;vertical-align:-2px}
#mb .mst{filter:drop-shadow(1px 1px 0 #0008);letter-spacing:2px}
#mb .mbhero{border:3px solid #c98a1a;border-radius:6px;background:var(--pf);box-shadow:0 0 0 3px #4a301b,0 8px 0 3px #2e1d10,0 22px 44px #000b;margin:4px 3px 22px}
#mb .mbhm{border-right:3px solid #c98a1a}
#mb .mbhi{background:var(--pf);color:var(--ink)}#mb .mbhi h2{font:bold 28px Georgia,serif;color:var(--ink)}#mb .mbhi .mbhn{color:var(--mu)}#mb .mbhs b{color:var(--hd)}
#mb .mbwhy{position:relative;font-size:12px;padding:5px 16px 5px 10px;background:linear-gradient(180deg,#d8452c,#a8301c);color:#fff;border-radius:0;clip-path:polygon(0 0,100% 0,calc(100% - 9px) 50%,100% 100%,0 100%)}
#mb .mbdots button{width:12px;height:12px;border-radius:2px;background:#ffffff40;box-shadow:0 2px 0 #0008}#mb .mbdots button.on{background:#f5b942}
#mb a,#mb .mbby a{color:var(--hd)}#mb .mbinfo .mbby a{color:#ffd27a}
#mb .mbtags button{border-radius:3px;background:#2a3350;border:1px solid #f5b94288;color:#fff}#mb .mbtags button span{color:#ffd27a}
#mb .mbgm{border:3px solid #c98a1a;border-radius:6px;box-shadow:0 0 0 3px #4a301b,0 7px 0 3px #2e1d10,0 18px 34px #000a}
#mb .mbgp,#mb .mbgn{border:2px solid #f5b94288;background:#1b2030cc;border-radius:4px}#mb .mbgt button{border-radius:3px;border:2px solid #4a301b}#mb .mbgt button.on{border-color:#f5b942}
#mb .mbinfo{background:var(--pf);color:var(--ink);border:2px solid var(--ac);border-radius:4px;padding:14px 16px;box-shadow:0 5px 0 #0008,0 14px 30px #0007}#mb .mbinfo h2{color:var(--ink);font-size:25px}#mb .mbinfo .mbby{color:var(--mu)}#mb .mbinfo .mbby a{color:var(--hd)}
#mb .mbrate,#mb .mbst{background:#00000014;border:1px solid #8a6a3a66;border-radius:3px}#mb .mbrbig b{color:var(--hd)}#mb .mbdist{color:var(--ink)}#mb .mbdist i{background:#00000026;border-radius:1px}#mb .mbdist em{background:linear-gradient(90deg,#c98a1a,#ffd27a)}
#mb .mbst b{color:var(--ink)}#mb .mbst .vi{width:18px;height:18px;vertical-align:-3px}
#mb .mbdesc,#mb .mbcols>section,#mb .mbcard,#mb .mbempty.big,#mb .mbmi,#mb .mbnote{background:var(--pf);color:var(--ink);border:2px solid var(--ac);border-radius:4px;box-shadow:0 5px 0 #0008,0 12px 26px #0006}
#mb .mbcols>section{padding:10px 14px 12px}#mb .mbdesc h3,#mb .mbcols h3,#mb .mbcard h3,#mb .mbempty.big h2{font:bold 14px Georgia,serif;letter-spacing:1.4px;text-transform:uppercase;color:var(--hd);display:flex;align-items:center;gap:6px}
#mb .mbitem{border-bottom:1px solid #8884}#mb .mbitem.au{background:#f5b94218;border-left:3px solid #c98a1a}
#mb .mbform{background:#00000010;border:1px solid #8a6a3a66;border-radius:3px}
#mb textarea,#mb .mbform input,#mb .mbcard input,#mb .mbhead select,#mpub input:not([type=checkbox]):not([type=range]),#mpub textarea,#mpub select,#mmod input,#mmod textarea,#mmod select{background:#00000018;color:var(--fg);border:1px solid #8a6a3aaa;border-radius:3px;font:14px Georgia,serif}
#mb textarea:focus,#mb input:focus,#mpub input:focus,#mpub textarea:focus,#mmod input:focus,#mmod textarea:focus{outline:none;border-color:#f5b942;box-shadow:0 0 0 2px #f5b94244}
#mb .mbsi button{box-shadow:none!important;color:#8a7a6a88;text-shadow:1px 1px 0 #0004}#mb .mbsi button.on{color:#f5b942;text-shadow:1px 1px 0 #8a3b12}
#mb .mbauth .mbav,#mb .mbav{border-radius:4px;border:2px solid #f5b942;box-shadow:0 4px 0 #0008}
#mb .mbmi{padding:8px}#mb .mbempty{color:#e8ecf4}#mb .mbempty.big{color:var(--ink)}#mb .mbempty code{background:#0002}
#mb button.gold,#mpub button.gold,#mmod button.gold{background:linear-gradient(180deg,#b88a2c,#8a6420 55%,#6a4a16);border:1px solid #ffd27a;color:#fff;text-shadow:0 1px 0 #0008}#mb button.gold:hover,#mpub button.gold:hover{filter:brightness(1.12)}
#mb .mbact button.on{background:linear-gradient(180deg,#a8303c,#7a1e2a);border-color:#ff9aa4}
#mb .mbback{box-shadow:none!important;color:#ffd27a;font:14px Georgia,serif}
#mb .mbload{color:#ffd27a;font:italic 16px Georgia,serif}
#mpub{background:radial-gradient(ellipse at 50% 30%,#10142acc,#05070fe6)}
#mpub .mpb,#mmod .mmb{background:var(--pn);color:var(--fg);border:2px solid var(--ac);border-radius:4px;box-shadow:0 0 0 3px #4a301b,0 8px 0 3px #2e1d10,0 24px 60px #000c}
#mpub .mph2{background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f}#mpub .mph2 b{font:bold 19px Georgia,serif;font-variant:small-caps;letter-spacing:1px;color:#ffd27a;text-shadow:2px 2px 0 #8a3b12}
#mpub .mpf{background:#00000014;border-top:2px solid #8a6a3a66}#mpub .mpl label{color:var(--fg)}#mpub .mplab{color:var(--hd,#c98a1a);color:var(--ac2,#f5b942)}#mpub .mpst{background:#00000014;border:1px solid #8a6a3a66;border-radius:3px;color:var(--fg)}
#mpub .mpm{border:2px solid #8a6a3a;border-radius:3px}#mpub .mpm.cov{border-color:#f5b942;box-shadow:0 0 0 2px #f5b94266}#mpub .mpmsg{color:var(--ac2,#9fd0ff)}
#mpub button,#mmod button{border-radius:3px;box-shadow:0 3px 0 #00000080}#mpub .mpup{border-radius:3px;box-shadow:0 3px 0 #00000080}
#mmod .mmb h3{color:var(--ac2,#f5b942)}
#mb button.ghost,#mpub button.ghost,#mmod button.ghost{color:var(--fg)!important;border-color:#8a6a3a99!important;box-shadow:0 3px 0 #0003}
body.mbon #menu .mwrap,body.mbon #devbtn{visibility:hidden}body.mbon #edtoast{font:14px Georgia,serif;border-radius:4px;border-width:2px;box-shadow:0 4px 0 #0008,0 10px 24px #000a}
:is(#mpub,#mb) .mbc{background:var(--pn);color:var(--fg);border:2px solid #8a6a3a;border-radius:4px;box-shadow:0 5px 0 #2e1d10,0 10px 20px #0007}#mpub .mbci b{color:var(--fg)}#mpub .mbci small,#mpub .mbcn{color:var(--mu)}#mpub .mbcv{border-bottom:2px solid #8a6a3a}
#mpub .mpadd .mpup{flex-direction:row;gap:6px;color:#fff;font:inherit}
@media (max-width:820px){#mb .mblogo{font-size:17px}#mb .mbtop{padding:7px 12px 9px}#mb .mbhm{border-right:0;border-bottom:3px solid #c98a1a}}
`;document.head.appendChild(st)})();
