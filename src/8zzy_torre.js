/* ================= 7.44: la Torre della Corona, la sfida del giorno (7.49: una torre vera, sale casuali, sempre più difficile) =================
   Una porta di pietra con la luce dorata, in piazza ad Aldoria e nella tua città di Tomorrow. Dentro, dieci piani:
   in ognuno una sala con i nemici; ripulita la sala si sceglie una di tre benedizioni (valgono solo nella Torre) e
   si sale. Ai piani 5 e 10 aspetta un boss. Ogni giorno la Torre cambia, ma è uguale per tutti: stessi nemici, stesse
   sale e stesse benedizioni, così ci si sfida sulla classifica del giorno (in rete, con il plugin Torre del server).
   Cadere nella Torre non costa niente: la prova finisce e si prende il premio dei piani fatti. */
const TOR={run:null,top:null,topd:''};
const TOR_N=10;
const TORB=[
  {k:'forza',i:'⚔',n:'Forza',d:'+20% danni'},{k:'vita',i:'❤',n:'Vigore',d:'+25% vita massima'},{k:'vampiro',i:'🩸',n:'Sete',d:'Ti curi del 5% dei danni che fai'},
  {k:'fortuna',i:'💰',n:'Fortuna',d:'+50% oro dai nemici'},{k:'pozioni',i:'🧪',n:'Scorta',d:'+2 pozioni subito'},{k:'scudo',i:'🛡',n:'Pelle di pietra',d:'-20% danni subiti'},
  {k:'esplosione',i:'💥',n:'Scoppio',d:'Chi cade esplode e ferisce chi gli sta vicino'},{k:'critico',i:'🎯',n:'Occhio fino',d:'+12% probabilità di colpo critico'},
  {k:'rigenera',i:'🌿',n:'Rigenerazione',d:'Recuperi l\'1% della vita al secondo'},{k:'riflessi',i:'🌀',n:'Riflessi',d:'Schivata e affondo si ricaricano molto prima'}];
for(let i=1;i<=TOR_N;i++)Z['torre'+i]={n:'Torre della Corona · piano '+i,lv:1,N:30,int:1,fl:'#4a4258',fl2:'#433b50',wall:'#6e6480',bg:'#05040a',tc:'#ffd84a',pt:'mote',mus:'dungeon',torre:i,c:0};
const torOn=()=>!!(ZZ&&ZZ.torre&&TOR.run);
const torN=k=>(TOR.run&&TOR.run.b.filter(x=>x===k).length)|0;
const torRng=s=>sd(hs('torre|'+(TOR.run?TOR.run.d:dayKey())+'|'+s));
// i nemici e i boss che possono uscire nella Torre (quelli dei dungeon della storia)
function torPool(){const en=[],bo=[];for(const id in DG){const d=DG[id];if(!d||d.tw)continue;for(const q of d.en||[])if(E[q]&&!en.includes(q))en.push(q);if(d.boss&&E[d.boss]&&!bo.includes(d.boss)&&id!=='cittadella')bo.push(d.boss)}return{en,bo}}
function torStart(){const from=ZZ&&!ZZ.torre?Zk:'town';TOR.run={d:dayKey(),f:1,lv:Math.max(1,P.lv),from,b:[],t0:Date.now(),clr:0,sp:0,seed:Math.floor(Math.random()*1e9)};P.hp=P.mx;load('torre1',from)}
// 7.49: ogni piano è generato a caso a ogni salita (sei forme di sala, ostacoli, pozze, vuoti) e ogni piano è più difficile:
// più nemici, più forti, di più tipi, campioni dal piano 3, e dal piano 4 una «legge del piano» che cambia le regole.
const TORT=[['cerchio','Sala rotonda'],['quadrata','Sala delle colonne'],['croce','Sala a croce'],['anello','Sala ad anello'],['stanze','Le quattro stanze'],['labirinto','Il labirinto'],['ponti','La sala dei ponti']];
const TORL=[{k:'veloci',n:'I nemici sono più veloci'},{k:'corazzati',n:'I nemici hanno la corazza: più vita'},{k:'furiosi',n:'I nemici colpiscono più forte'},{k:'sciame',n:'Uno sciame: tanti nemici, più deboli'},{k:'rinforzi',n:'A metà sala arrivano i rinforzi'},{k:'campioni',n:'Tutti campioni'}];
const TORC=[['#4a4258','#433b50','#6e6480','#ffd84a'],['#3a4a5a','#344454','#5a7088','#9adcff'],['#3a5a52','#34544c','#5a8a7a','#6affc0'],['#5a3a3a','#523434','#8a5a5a','#ff7a3a'],['#5a2a3a','#502434','#8a3a4a','#ff4a6a'],['#6a5a2a','#625226','#a8904a','#ffe84a']];
const torTier=f=>f>=10?5:f>=8?4:f>=6?3:f>=4?2:f>=2?1:0;
function torLay(ty,r,c){const n=N,F=(x,y,v)=>{if(x>0&&y>0&&x<n-1&&y<n-1)M[y][x]=v};
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=9;DEC[y][x]=''}
  const disk=(cx,cy,R,v)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(Math.hypot(x+.5-cx,y+.5-cy)<R)F(x,y,v)},rect=(x0,y0,w,h,v)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)F(x,y,v)};
  if(ty==='cerchio'){disk(c,c,12,0);const np=[4,6,8][Math.floor(r()*3)],pr=4+r()*4,ph=r()*6.283;for(let i=0;i<np;i++){const a=ph+i*6.283/np;F(Math.floor(c+Math.cos(a)*pr),Math.floor(c+Math.sin(a)*pr),1)}}
  else if(ty==='quadrata'){rect(3,3,n-6,n-6,0);const st=3+Math.floor(r()*2);for(let y=6;y<n-6;y+=st)for(let x=6;x<n-6;x+=st)if(r()<.75&&Math.hypot(x-c,y-c)>2.5){F(x,y,1);if(r()<.3)F(x+1,y,1)}}
  else if(ty==='croce'){const w=7+Math.floor(r()*3);rect(c-w/2|0,3,w,n-6,0);rect(3,c-w/2|0,n-6,w,0);disk(c,c,w*.8,0)}
  else if(ty==='anello'){disk(c,c,12.5,0);disk(c,c,4.5+r()*1.5,9);const nb=2+Math.floor(r()*3),ph=r()*6.283;for(let i=0;i<nb;i++){const a=ph+i*6.283/nb;for(let k=0;k<7;k++){F(Math.floor(c+Math.cos(a)*k),Math.floor(c+Math.sin(a)*k),0)}}disk(c,c,2,0)}
  else if(ty==='stanze'){const q=[[4,4],[n-13,4],[4,n-13],[n-13,n-13]];for(const[x,y]of q)rect(x,y,9,9,0);rect(c-2,6,4,n-12,0);rect(6,c-2,n-12,4,0);disk(c,c,4,0);for(const[x,y]of q)if(r()<.6)F(x+4,y+4,1)}
  else if(ty==='labirinto'){const cs=4,cw=6,o0=3,V=new Set(['0,'+(cw-1)]),st=[[0,cw-1]],cell=(i,j)=>rect(o0+i*cs,o0+j*cs,cs-1,cs-1,0);cell(0,cw-1);
    const link=(i,j,a,b)=>{if(a>i)rect(o0+i*cs+cs-1,o0+j*cs,1,cs-1,0);else if(a<i)rect(o0+a*cs+cs-1,o0+j*cs,1,cs-1,0);else if(b>j)rect(o0+i*cs,o0+j*cs+cs-1,cs-1,1,0);else rect(o0+i*cs,o0+b*cs+cs-1,cs-1,1,0)};
    while(st.length){const[i,j]=st[st.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[i+a,j+b]).filter(([a,b])=>a>=0&&b>=0&&a<cw&&b<cw&&!V.has(a+','+b));
      if(!nb.length){st.pop();continue}const[a,b]=nb[Math.floor(r()*nb.length)];V.add(a+','+b);cell(a,b);link(i,j,a,b);st.push([a,b])}
    for(let k=0;k<5;k++){const i=Math.floor(r()*(cw-1)),j=Math.floor(r()*cw);link(i,j,i+1,j)}disk(c,c,2.2,0)}
  else{rect(3,3,n-6,n-6,0);for(let k=0;k<5;k++){const x=4+Math.floor(r()*(n-12)),y=4+Math.floor(r()*(n-12)),w=3+Math.floor(r()*4),h=3+Math.floor(r()*4);if(Math.abs(x+w/2-c)<4&&Math.abs(y+h/2-c)<4)continue;rect(x,y,w,h,9)}disk(c,c,2.5,0)}
}
// il muro intorno: dove il pavimento tocca il vuoto (le fosse dell'anello e dei ponti restano aperte)
function torWalls(ty,c){const n=N;for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(M[y][x]===9&&[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].some(([a,b])=>M[y+b][x+a]===0)&&!(ty==='anello'&&Math.hypot(x+.5-c,y+.5-c)<7.5)&&!(ty==='ponti'&&x>3&&y>3&&x<n-4&&y<n-4))M[y][x]=1}
const _genWild743t=genWild;genWild=function(z){if(!z.torre)return _genWild743t(z);if(!TOR.run)TOR.run={d:dayKey(),f:z.torre,lv:Math.max(1,P.lv),from:'town',b:[],t0:Date.now(),clr:0,sp:0};
  const R=TOR.run,f=z.torre;if(R.seed==null)R.seed=Math.floor(Math.random()*1e9);const r=sd(hs('torre|'+R.seed+'|'+f)),c=N>>1;R.f=f;R.clr=0;R.sp=0;R.w2=0;z.lv=R.lv+Math.round((f-1)*1.4);
  const ty=f===TOR_N?'cerchio':TORT[Math.floor(r()*TORT.length)][0];R.ty=ty;const C=TORC[torTier(f)];Object.assign(z,{fl:C[0],fl2:C[1],wall:C[2],tc:C[3]});
  torLay(ty,r,c);
  // l'ingresso in basso e la scala al centro: un passaggio sempre aperto
  const sp=[c,N-4];for(let y=N-5;y<=N-3;y++)for(let x=c-2;x<=c+2;x++)M[y][x]=0;
  {let d=bfs(sp[0],sp[1]);if(d[c*N+c]<0){for(let y=c;y<N-3;y++)for(let x=c-1;x<=c+1;x++)if(M[y][x]!==0)M[y][x]=0;d=bfs(sp[0],sp[1])}for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)if(M[y][x]===0&&d[y*N+x]<0)M[y][x]=9}
  torWalls(ty,c);for(let x=0;x<N;x++){M[0][x]=M[0][x]===0?1:M[0][x];M[N-1][x]=M[N-1][x]===0?1:M[N-1][x]}
  // le torce e i bracieri lungo i muri; dal piano 6 qualche pozza di lava (che non si può attraversare)
  let nt=0;for(let y=2;y<N-2&&nt<16;y++)for(let x=2;x<N-2&&nt<16;x++)if(M[y][x]===0&&((x*7+y*11)%9===0)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>M[y+b][x+a]===1)){ents.push({k:'tc',px:x+.5,py:y+.5});nt++}
  z.pool=f>=6?'#ff6a1a':'#3a6ab0';if(f>=6&&ty!=='labirinto')for(let k=0;k<3;k++){const x=4+Math.floor(r()*(N-8)),y=4+Math.floor(r()*(N-10));if(Math.hypot(x-c,y-c)<4||Math.hypot(x-sp[0],y-sp[1])<6)continue;const pc=[];for(const[a,b]of[[0,0],[1,0],[0,1],[1,1]])if(M[y+b]&&M[y+b][x+a]===0){M[y+b][x+a]=2;pc.push([x+a,y+b])}
    // 7.49.1: la pozza non deve tagliare la sala (un ponte dell'anello, un passaggio stretto): se lo fa, non c'è
    if(pc.length){const d2=bfs(sp[0],sp[1]);let cut=false;for(let v=1;v<N-1&&!cut;v++)for(let u=1;u<N-1;u++)if(M[v][u]===0&&d2[v*N+u]<0){cut=true;break}if(cut)for(const[u,v]of pc)M[v][u]=0}}
  ents.push(Object.assign(po(c,N-3,R.from||'town',{st:'exit',n:'Esci dalla Torre'}),{torEx:1}));R.st=[c,c];
  // la legge del piano e i nemici
  const law=f>=4&&f!==TOR_N?TORL[Math.floor(r()*TORL.length)].k:null;R.law=law;
  const P2=torPool(),boss=f===5||f===TOR_N,nT=Math.min(5,2+Math.floor(f/3)),tys=[];for(let i=0;i<nT;i++)tys.push(P2.en[Math.floor(r()*P2.en.length)]);
  let n=boss?2+Math.floor(f/3):4+Math.round(f*1.2);if(law==='sciame')n=Math.round(n*1.6);if(law==='rinforzi')n=Math.round(n*.7);
  const spots=[];for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++)if(M[y][x]===0&&Math.hypot(x-sp[0],y-sp[1])>7)spots.push([x,y]);for(let i=spots.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[spots[i],spots[j]]=[spots[j],spots[i]]}
  const pump=m=>{const k=1+.1*(f-1);m.hp=m.mx=Math.round(m.mx*k*(law==='corazzati'?1.35:law==='sciame'?.7:1));m.at*=(1+.06*(f-1))*(law==='furiosi'?1.25:1);if(law==='veloci')m.sp=(m.sp||2)*1.3;
    if((law==='campioni'||f>=3&&r()<.06*f)&&!m.boss&&typeof eliteMk==='function')eliteMk(m);m.tor=1;return m};
  // 7.49.1: il guardiano su una casella del pavimento (non dentro una colonna, nel vuoto dell'anello o nella lava)
  const bfr=(x,y)=>M[y][x]===0?[x,y]:nearFree(x,y);
  if(boss){const b=P2.bo[Math.floor(r()*P2.bo.length)]||'troll',m=mk(b,...bfr(c,c-3));pump(m);ents.push(m);if(f===TOR_N){const b2=P2.bo.filter(q=>q!==b)[Math.floor(r()*(P2.bo.length-1))];if(b2){const m2=mk(b2,...bfr(c+3,c-1));pump(m2);m2.hp=m2.mx=Math.round(m2.mx*.6);ents.push(m2)}}}
  for(let i=0;i<n&&spots.length;i++){const q=spots.pop();ents.push(pump(mk(tys[i%tys.length],q[0],q[1])))}
  R.n0=ents.filter(e=>e.k==='en').length;R.spots=spots.slice(0,10);R.tys=tys;
  setTimeout(()=>{if(torOn()&&TOR.run.f===f)banner('Piano '+f+' · '+(TORT.find(q=>q[0]===ty)||['',''])[1],law?'⚠ '+TORL.find(q=>q.k===law).n:boss?'Il guardiano del piano ti aspetta':(f>=3?'I nemici sono più forti':'Ripulisci la sala'),'stella')},500);
  R.sp=1;return sp};
// la legge «rinforzi»: a metà sala arriva un'altra ondata
function torWave(){const R=TOR.run;if(!torOn()||R.law!=='rinforzi'||R.w2||!R.sp)return;const n=ents.filter(e=>e.k==='en'&&e.hp>0).length;if(n>R.n0/2)return;R.w2=1;const f=R.f;
  for(const q of R.spots.slice(0,4+Math.floor(f/2))){const m=mk(R.tys[Math.floor(Math.random()*R.tys.length)],q[0],q[1]);m.hp=m.mx=Math.round(m.mx*(1+.1*(f-1)));m.at*=1+.06*(f-1);m.tor=1;ents.push(m);if(cineOK())sparks(q[0]+.5,q[1]+.5,10,['#ff4a6a','#ffffff'],60)}
  banner('Rinforzi!','Un\'altra ondata sale le scale','spada')}
// il piano è ripulito: si sceglie la benedizione e si sale
function torTick(){const R=TOR.run;if(!torOn()||R.clr||!R.sp)return;if(ents.some(e=>e.k==='en'&&e.hp>0))return;R.clr=1;R.done=Math.max(R.done|0,R.f);
  jingle([67,72,76,79],.1,'triangle');if(R.f>=TOR_N){setTimeout(()=>torEnd(1),1200);return}
  // 7.54: al centro compare l'altare delle benedizioni: se la scelta si chiude senza aver scelto, si riapre da lì
  {const c=N>>1,[sx,sy]=R.st||[c,c];if(!ents.some(e=>e.k==='torb54'))ents.push({k:'torb54',px:sx+.5,py:sy+.5,n:'Altare delle benedizioni'})}
  setTimeout(()=>{if(torOn()&&!PM)pn('torb')},900)}
X43P.torb=()=>{const R=TOR.run,r=torRng('benedizioni'+R.f),L=TORB.slice();for(let i=L.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[L[i],L[j]]=[L[j],L[i]]}const C=L.slice(0,3);
  return`<h3>✨ Piano ${R.f} ripulito · scegli una benedizione</h3><p class="x43t">Vale fino a quando resti nella Torre e si somma a quelle che hai già.${R.b.length?' Hai: '+R.b.map(k=>TORB.find(b=>b.k===k).i).join(' '):''}</p>
  <div class="x43c">${C.map(b=>`<button onclick="torBless('${b.k}')"><i>${b.i}</i><b>${b.n}${torN(b.k)?' ×'+(torN(b.k)+1):''}</b><small>${b.d}</small></button>`).join('')}</div>`};
function torBless(k){const R=TOR.run;if(!R||R.bf===R.f)return;R.bf=R.f;R.b.push(k);ents=ents.filter(e=>e.k!=='torb54');cl();if(k==='pozioni'){P.pot+=2;flt(P,'+2 🧪','#88ff88')}if(k==='vita'){recalc();P.hp=Math.min(P.mx,P.hp+Math.round(P.mx*.25))}hud();
  const c=N>>1,[sx,sy]=R.st||[c,c];ents.push(po(sx,sy,'torre'+(R.f+1),{st:'up',n:'Sali al piano '+(R.f+1)}));if(cineOK())ringFx(sx+.5,sy+.5,'255,216,74',.9,2.4);msg('Benedizione: '+TORB.find(b=>b.k===k).n+'. La scala per il piano '+(R.f+1)+' è al centro della sala.')}
// la prova finisce (vittoria, caduta o uscita): premio dei piani fatti e classifica del giorno
function torEnd(win){const R=TOR.run;if(!R)return;const done=win?TOR_N:(R.done|0),sec=Math.round((Date.now()-R.t0)/1000),lv=R.lv;TOR.run=null;recalc();
  const gold=Math.round(done*done*18*(1+lv*.12)),xp=Math.round(done*done*9*(1+lv*.2));P.g+=gold;gainXP(xp);const its=[];if(done>=5)its.push(item(lv+3,2));if(done>=TOR_N)its.push(item(lv+4,3));for(const it of its)gain(it);
  const L=LS.get('voxelia_torre',{})||{},o=L[R.d];if(!o||done>o.c||(done===o.c&&sec<o.t))L[R.d]={c:done,t:sec,lv};for(const k of Object.keys(L))if(k<dayKey().slice(0,8)+'00'&&Object.keys(L).length>30)delete L[k];LS.set('voxelia_torre',L);
  if(typeof NET!=='undefined'&&NET.ok&&typeof VXP!=='undefined'&&done>0)VXP.send('torre','score',{d:R.d,c:done,t:sec,lv});
  PA={ti:win?'🏆 La Torre è tua!':'La prova della Torre è finita',tx:(win?'Hai conquistato tutti e dieci i piani della Torre di oggi!':'Piani superati: '+done+' di '+TOR_N+'.')+'\nTempo: '+Math.floor(sec/60)+' min '+(sec%60)+' s · benedizioni: '+(R.b.length?R.b.map(k=>TORB.find(b=>b.k===k).n).join(', '):'nessuna')+'\n\nPremio: +'+gold+' oro, +'+xp+' XP'+(its.length?' e '+its.map(iname).join(', '):'')+'.\nLa Torre di domani sarà diversa.'};
  if(win&&cineOK())banner('Torre conquistata!',TOR_N+' piani in '+Math.floor(sec/60)+' min','corona');
  const back=R.from||'town';P.hp=P.mx;irisGo(()=>{load(back,'torre1');setTimeout(()=>pn('txt'),400)});save()}
const _upd743t=upd;upd=function(dt){_upd743t(dt);if(!torOn())return;try{torWave();torTick()}catch(e){console.warn(e)}const R=TOR.run;if(torN('rigenera')&&P.hp>0&&P.hp<P.mx)P.hp=Math.min(P.mx,P.hp+P.mx*.01*torN('rigenera')*dt)};
// le benedizioni
const _roll743t=roll;roll=function(m){const r=_roll743t(m);if(!torOn())return r;if(torN('forza'))r.d=Math.max(1,Math.round(r.d*(1+.2*torN('forza'))));if(!r.cr&&torN('critico')&&Math.random()<.12*torN('critico')){r.d=Math.round(r.d*1.8);r.cr=true}return r};
const _recalc743t=recalc;recalc=function(){_recalc743t();if(torOn()&&torN('vita')&&P){P.mx=Math.round(P.mx*(1+.25*torN('vita')))}};
const _hurtE743t=hurtE;hurtE=function(e,d,rem,cr){_hurtE743t(e,d,rem,cr);if(!rem&&torOn()&&torN('vampiro')&&P.hp>0)P.hp=Math.min(P.mx,P.hp+d*.05*torN('vampiro'))};
const _hurtP743t=hurtP;hurtP=function(at){_hurtP743t(torOn()&&torN('scudo')?at*Math.pow(.8,torN('scudo')):at)};
const _kill743t=kill;kill=function(e){const g0=P.g,on=torOn()&&e&&e.k==='en'&&ents.includes(e);_kill743t(e);if(!on)return;if(torN('fortuna'))P.g+=Math.round((P.g-g0)*.5*torN('fortuna'));
  if(torN('esplosione')){fx.push({k:'boom',x:e.px,y:e.py,r:2.2,t:.4});for(const o of ents.slice())if(o.k==='en'&&o!==e&&o.hp>0&&dist(o,e)<2.2)hurtE(o,Math.max(1,Math.round(e.mx*.25*torN('esplosione'))),0)}};
const _dodge743t=dodge;dodge=function(){const c0=P?P.dgc:0;_dodge743t();if(torOn()&&torN('riflessi')&&P.dgc>c0)P.dgc*=.5};
const _lunge743t=lunge;lunge=function(){const c0=P?P.lgc:0;_lunge743t();if(torOn()&&torN('riflessi')&&P.lgc>c0)P.lgc*=.6};
// cadere nella Torre non costa niente
const _die743t=die;die=function(){if(torOn()){if(typeof sceneDeath==='function')sceneDeath();P.hp=P.mx;torEnd(0);return}_die743t()};
// uscire: dalla porta della Torre (la prova finisce) o in altri modi (la prova si perde)
const _act743t=act;act=function(e){if(e&&e.k==='po'&&e.torEx&&TOR.run){torEnd(0);return}if(e&&e.k==='torb54'){if(TOR.run&&TOR.run.bf!==TOR.run.f){pn('torb');tone(520,.08,'triangle')}return}if(e&&e.k==='torre43'){pn('torre');tone(330,.1,'triangle');return}_act743t(e)};
const _loadPost743t=loadPost;loadPost=function(k){_loadPost743t(k);if(TOR.run&&!(ZZ&&ZZ.torre)){const v=torN('vita');TOR.run=null;if(v)recalc()}torDoor();
  // 7.44.1: uscendo dalla Torre si torna davanti alla sua porta, non al punto di partenza della zona
  if(/^torre\d+$/.test(String(LFROM))&&!(ZZ&&ZZ.torre)){const d=ents.find(e=>e.k==='torre43');if(d){let x=d.px|0,y=(d.py|0)+1;if(!(M[y]&&WK(M[y][x])))[x,y]=nearFree(x,y);if(M[y]&&WK(M[y][x])){heroPut(x,y);LFP=1}}}};
// la porta della Torre: in piazza ad Aldoria e nella tua città di Tomorrow
ITK.add('torre43');ITK.add('torb54');
// 7.54: la scelta della benedizione non si chiude più cliccando fuori dal riquadro (si sceglie e basta); se si chiude in altro
// modo (Esc, un'altra finestra), l'altare al centro della sala la riapre
addEventListener('pointerdown',ev=>{if(!started||PM!=='torb'||!ev.target||!ev.target.closest||ev.target.closest('#pn'))return;ev.stopImmediatePropagation();ev.preventDefault();const p=$('pn');if(p){p.classList.remove('torbw');void p.offsetWidth;p.classList.add('torbw')}},true);
{const c0=cl;cl=function(){const w=PM==='torb'&&TOR.run&&TOR.run.bf!==TOR.run.f;c0();if(w)msg('Scegli la benedizione all\'altare al centro della sala: poi si apre la scala')}}
(function(){const st=document.createElement('style');st.textContent='#pn.torbw{animation:torbw .35s}@keyframes torbw{25%{transform:translate(calc(-50% - 6px),-50%)}75%{transform:translate(calc(-50% + 6px),-50%)}}';document.head.appendChild(st)})();
// 7.49: l'ingresso è una torre vera (3×3 caselle) con la porta davanti; la porta è la casella dove si preme R
function torDoor(){if(!ZZ||ents.some(e=>e.k==='torre43'))return;let c=null;const town=Zk==='town'&&MODE==='story'&&!(typeof OW!=='undefined'&&OW.on);
  if(town)c=[47,47];else if(typeof twOn==='function'&&twOn()&&ZZ.set&&ZZ.shub)c=[ZZ.shub[0]+3,ZZ.shub[1]+4];if(!c)return;
  const free=(u,v)=>u>1&&v>1&&u<N-2&&v<N-2&&(M[v][u]===0||M[v][u]===4)&&!(DEC[v][u]&&DEC[v][u][0]!=='₪');
  // 7.54: prima si cerca un posto che non dia fastidio: sull'erba, con almeno una casella libera da strade tutto intorno
  // (prima la torre poteva finire sul bordo di una strada e restringerla), lontano da porte e personaggi, con la porta
  // che dà su un passaggio. Ad Aldoria il posto è vicino al castello, a nord-est, sul viale grande.
  const grass=(u,v)=>u>2&&v>2&&u<N-3&&v<N-3&&M[v][u]===0&&!DEC[v][u],road=(u,v)=>!!(M[v]&&M[v][u]===4);
  const calm=(x,y)=>{for(let v=y-3;v<=y;v++)for(let u=x-1;u<=x+1;u++)if(!grass(u,v))return false;for(let v=y-4;v<=y;v++)for(let u=x-2;u<=x+2;u++)if(road(u,v))return false;
    if(!(M[y+1]&&(M[y+1][x]===0||M[y+1][x]===4)))return false;return!ents.some(e=>(e.k==='po'||e.k==='npc'||e.k==='board'||e.k==='owb'||e.k==='tr'||e.k==='ani47s')&&e.px>x-3&&e.px<x+3.5&&e.py>y-5&&e.py<y+3.5)};
  const place=(x,y)=>{for(let v=y-3;v<=y-1;v++)for(let u=x-1;u<=x+1;u++){M[v][u]=6;DEC[v][u]='¨'}ents.push({k:'torre43',px:x+.5,py:y+.5,n:'Torre della Corona'})};
  for(const q of town?[[60,14],[60,15]]:[])if(calm(q[0],q[1])){place(q[0],q[1]);return}
  for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=c[0]+dx,y=c[1]+dy;if(calm(x,y)){place(x,y);return}}
  for(let r=0;r<10;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=c[0]+dx,y=c[1]+dy;
    let ok=true;for(let v=y-3;v<=y+1&&ok;v++)for(let u=x-1;u<=x+1;u++)if(!free(u,v))ok=false;if(!ok)continue;
    if(ents.some(e=>(e.k==='po'||e.k==='npc'||e.k==='board'||e.k==='owb'||e.k==='tr')&&e.px>x-2.5&&e.px<x+2.5&&e.py>y-4.5&&e.py<y+2.5))continue;if(Zk==='town'&&Math.hypot(x-35,y-43)<7)continue;
    for(let v=y-3;v<=y-1;v++)for(let u=x-1;u<=x+1;u++){M[v][u]=6;DEC[v][u]='¨'}
    ents.push({k:'torre43',px:x+.5,py:y+.5,n:'Torre della Corona'});return}}
X43P.torre=()=>{const d=dayKey(),L=LS.get('voxelia_torre',{})||{},me=L[d],srv=TOR.topd===d&&TOR.top;if(NET.ok&&typeof VXP!=='undefined'&&TOR.ask!==d){TOR.ask=d;VXP.send('torre','top',{d})}
  return`<h3>🗼 Torre della Corona · ${dayName(d)}</h3><p class="x43t">Dieci piani, e ogni salita è diversa: le sale si costruiscono a caso mentre sali (rotonde, a croce, ad anello, labirinti, ponti sul vuoto). Ogni piano è più difficile del precedente: più nemici, più forti, campioni, e dal piano 4 una legge che cambia le regole della sala. Ripulisci la sala, scegli una benedizione e sali. Ai piani 5 e 10 c'è il guardiano. Cadere qui non costa niente.</p>
  <div class="qb">${me?`Il tuo record di oggi: <b>${me.c} piani</b> in ${Math.floor(me.t/60)} min ${me.t%60} s`:'Oggi non l\'hai ancora tentata.'}</div>
  ${srv?`<h4>Classifica di oggi</h4>${srv.length?srv.slice(0,10).map((q,i)=>`<div class="x43r"><span>${i+1}. ${esc(q.n)}</span><span>${q.c} piani · ${Math.floor(q.t/60)}:${String(q.t%60).padStart(2,'0')}</span></div>`).join(''):'<p class="mu">Nessuno ancora: tocca a te.</p>'}`:NET.ok?'<p class="mu">Classifica del server: in arrivo (serve il plugin Torre).</p>':'<p class="mu">Gioca in rete per entrare nella classifica del giorno.</p>'}
  <button onclick="cl();torStart()">🗼 Entra nella Torre (piano 1)</button><button onclick="cl()">Più tardi</button>`};
if(typeof VXP!=='undefined')VXP.on('torre','top',d=>{if(!d)return;TOR.top=Array.isArray(d.L)?d.L:[];TOR.topd=String(d.d||'');if(PM==='torre')pn('torre')});
// 7.49: il disegno della Torre: base, fusto con le paraste, finestre accese, stendardi, merli, tetto a punta e la corona che gira
const _ent743t=ent;ent=function(e){if(e.k==='torb54'){const u=.5+Math.sin(t*3)*.5;drawL([[-.35,-.35,0,.7,.7,4,'#6e6480'],[-.25,-.25,4,.5,.5,8,'#8a8098'],[-.32,-.32,12,.64,.64,2,'#a29cb0']],e.px,e.py,0);
    box(e.px-.12,e.py-.12,16+u*3,.24,.24,5,u>.5?'#ffe9a0':'#ffd84a',1.4);if(cineOK()&&Math.random()<.2)sparks(e.px,e.py,1,['#ffd84a','#ffffff'],30);
    if(!D3B){g.textAlign='center';g.font='bold 10px Georgia,serif';label('✨ Benedizione',PX(e.px,e.py),PY(e.px,e.py,0)-34,'#ffe9a0')}return}
  if(e.k!=='torre43'){_ent743t(e);return}const u=.55+Math.sin(t*2)*.12,S='#8a8478',S2='#6e685e',S3='#a29c90',RO='#3a2a6a',RO2='#4a3a8a',GL=u>.6?'#ffe9a0':'#ffd84a';
  if(SET.shad){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(PX(e.px,e.py-1.5),PY(e.px,e.py-1.5,0),62,30,0,0,6.3);g.fill()}
  const L=[[-1.5,-3.5,0,3,3,6,S2],[-1.3,-3.3,6,2.6,2.6,104,S]];
  for(const[x,y]of[[-1.42,-3.42],[1.06,-3.42],[-1.42,-.94],[1.06,-.94]])L.push([x,y,6,.36,.36,104,S3]);
  for(const z of[38,74])L.push([-1.34,-3.34,z,2.68,2.68,3,S2]);
  L.push([-1.46,-3.46,110,2.92,2.92,5,S3]);for(let i=0;i<4;i++){const a=-1.46+i*.8;L.push([a,-.6,115,.4,.06,6,S3],[1.4,-3.46+i*.8,115,.06,.4,6,S3],[a,-3.46,115,.4,.06,6,S3],[-1.46,-3.46+i*.8,115,.06,.4,6,S3])}
  L.push([-1.1,-3.1,115,2.2,2.2,9,RO],[-.85,-2.85,124,1.7,1.7,9,RO2],[-.6,-2.6,133,1.2,1.2,9,RO],[-.36,-2.36,142,.72,.72,9,RO2],[-.14,-2.14,151,.28,.28,10,'#d4af37']);
  L.push([-.62,-.76,6,1.24,.1,36,S2],[-.48,-.75,6,.96,.08,30,'#2a1e3a'],[-.9,-.62,0,1.8,.52,3,S2],[-.7,-.5,3,1.4,.3,2,S3]);
  for(const x of[-1.12,.82])L.push([x,-.74,64,.3,.05,32,'#a8303a'],[x,-.75,92,.3,.06,3,'#d4af37'],[x+.1,-.75,70,.1,.06,8,'#d4af37']);
  drawL(isoOrder(L,0),e.px,e.py,0);
  // le luci: la porta, le finestre, le torce, la corona
  box(e.px-.42,e.py-.73,8,.84,.04,24,GL,1.5);for(const z of[48,84])box(e.px-.15,e.py-.71,z,.3,.04,12,'#ffd27a',1.4);for(const y of[-2.4,-1.6])for(const z of[52,88])box(e.px+1.29,e.py+y,z,.04,.3,12,'#ffd27a',1.3);
  for(const x of[-.82,.72])box(e.px+x,e.py-.6,22,.1,.1,4+Math.sin(t*9+x)*1,'#ffb040',1.6);
  const k=Math.sin(t*1.5)*3,a=t*1.2;for(let i=0;i<6;i++){const q=a+i*1.047;box(e.px-.05+Math.cos(q)*.35,e.py-2.05+Math.sin(q)*.35,166+k,.1,.1,i%2?6:4,'#ffd84a',1.3)}box(e.px-.08,e.py-2.08,170+k,.16,.16,6,'#ff4ad8',1.6);
  if(typeof nlight==='function'){nlight(e.px,e.py+.2,30,150,'255,216,120',u);nlight(e.px,e.py-2,170,120,'255,120,220',.4)}if(SET.ultra)GLOW.push([e.px,e.py,30,60,'255,216,120',.3])};
