/* ================= 7.26: L'EDITOR DEL TUO INSEDIAMENTO =================
   Nel tuo borgo di Tomorrow apri l'editor (Registro → Insediamento → «Modifica il borgo», o il tasto V quando sei lì) e lo
   costruisci come vuoi, camminando fra le case: sposti gli edifici che hai costruito, aggiungi o togli le case (quante ne
   permette il livello), disegni le strade lastricate e i sentieri, metti alberi, aiuole, lampioni, panchine, statue,
   pozzi, fontane, bancarelle, campi, staccionate e tutto il resto, scegli il posto del banco del mercante e dello stendardo,
   e cambi i colori di ogni casa. La prima volta l'editor parte dal borgo com'è; «Ripristina» torna al borgo automatico.
   Nel borgo, come nei villaggi, la gente va in giro (in piazza, sulle strade, a casa, alla locanda) e i mercanti restano
   al loro banco. Funziona anche in 3D. */
const SED={on:0,tool:'bld',sel:null,sz:[4,3],rc:'4',dc:'r',hv:null,down:0,paint:null};
const SEDC=10,SEDFO=120;
const SEDD=[['Natura',[['r','🌳','Albero'],['a','🍎','Melo'],['h','🌸','Cespuglio fiorito'],['o','🌷','Aiuola'],['e','🌹','Roseto'],['j','🌿','Siepe'],['u','🪨','Rocce'],['m','🪵','Ceppo'],['¢','🌵','Cactus']]],
  ['Piazza',[['@fo','⛲','Fontana (4×4)'],['U','💦','Zampillo'],['W','🛖','Pozzo con tetto'],['ʬ','🪣','Pozzo di pietra'],['l','💡','Lampione'],['ł','🏮','Lanterna'],['n','🪑','Panchina'],['Y','🗿','Statua'],['Б','🗿','Statua di pietra'],['Ŧ','🚩','Bandiera'],['§','🎌','Stendardo'],['p','🪴','Pianta in vaso']]],
  ['Mercato',[['ʍ','⛺','Bancarella a strisce'],['s','🏪','Bancarella'],['H','🧺','Banco del mercato'],['b','🛢','Botte'],['k','📦','Cassa'],['x','🛒','Carretto'],['Л','🥬','Cassetta di verdure'],['i','🌾','Sacchi di farina']]],
  ['Campagna',[['g','🌾','Grano'],['q','🥕','Ortaggi'],['v','🍇','Vite'],['y','🟨','Balla di fieno'],['E','🎃','Spaventapasseri'],['f','🚧','Staccionata'],['+','🐝','Arnia'],['L','🪵','Legna'],['N','👕','Stenditoio'],[':','🪣','Abbeveratoio'],['Ω','🌀','Girandola']]]];
const SEDDN={};for(const[,L]of SEDD)for(const[c,ic,nm]of L)SEDDN[c]=[ic,nm];
const SETBA=['mercato','fucina','tempio','locanda','stalla','granaio'],SEDND=new Set();
const SEDK={mercato:'bottega',fucina:'fucina',tempio:'tempio',locanda:'locanda',stalla:'casa',granaio:'casa',casa:'casa'};
const SEDKN={mercato:'🛒 Mercato',fucina:'⚒ Fucina',tempio:'⛪ Tempio',locanda:'🍺 Locanda',stalla:'🐾 Stalla',granaio:'🌾 Granaio',casa:'🏠 Casa'};
const sedKey=(x,y)=>x+','+y,sedXY=k=>k.split(',').map(Number);
const sedHere=()=>twOn()&&P&&P.tw&&P.tw.set&&Zk===P.tw.set.k;
const sedR=()=>{const l=P.tw.set.lv|0;return l<=5?8+l*3:Math.round(23+(l-5)*4.5)};
const sedMaxCase=()=>2+(P.tw.set.lv|0)*2;
// il borgo com'è adesso diventa il punto di partenza dell'editor
function sedCapture(){const S=P.tw.set,z=ZZ,c=z.shub||[N>>1,N>>1],R=sedR(),Ly={v:1,c:c.slice(),b:[],t:{},d:{},p:[],mk:null,bn:null,nid:1};
  const kinds=[];for(const k of['mercato','fucina','tempio','locanda','stalla','granaio'])if(setB(k))kinds.push(k);
  const H=TB.filter(b=>b.to&&/^twi:/.test(b.to)).map(b=>({b,i:+b.to.split(':')[2]})).sort((a,b)=>a.i-b.i);
  H.forEach(({b},j)=>{Ly.b.push({id:Ly.nid++,k:j<kinds.length?kinds[j]:'casa',x:b.x,y:b.y,w:b.w,h:b.h,wall:b.wall,roof:b.roof,ht:b.ht})});
  for(let y=c[1]-R;y<=c[1]+R;y++)for(let x=c[0]-R;x<=c[0]+R;x++){if(x<1||y<1||x>=N-1||y>=N-1||Math.hypot(x-c[0],y-c[1])>R)continue;const d=DEC[y][x]||'',m=M[y][x];
    if(m===0&&(d===DN+'4'||d===DN+'1'))Ly.t[sedKey(x,y)]=d[1];else if(m===6&&d&&d!=='ɸ'&&d.length<=2&&d[0]!==DN)Ly.d[sedKey(x,y)]=d}
  if(S.dec&&S.dec.fontana)Ly.p.push({k:'fo',x:c[0],y:c[1]});
  const bn=ents.find(e=>e.k==='twbn'&&e.set);Ly.bn=bn?[bn.px|0,bn.py|0]:[c[0]+3,c[1]-1];
  if(setB('mercato'))Ly.mk=[c[0]-3,c[1]+4];Ly.hq=Math.max(0,sedMaxCase()-Ly.b.filter(b=>b.k==='casa').length);S.lay=Ly;return Ly}
// i controlli: dentro il borgo, fuori dagli altri edifici, porte libere
function sedIn(x,y){const Ly=P.tw.set.lay,c=Ly.c;return x>2&&y>2&&x<N-3&&y<N-3&&Math.hypot(x-c[0],y-c[1])<=sedR()-1}
function sedBldAt(x,y,skip){const Ly=P.tw.set.lay;return Ly.b.find(b=>b!==skip&&x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)||null}
function sedFoAt(x,y){const Ly=P.tw.set.lay;return Ly.p.find(p=>x>=p.x-1&&x<=p.x+2&&y>=p.y-1&&y<=p.y+2)||null}
function sedDoor(b){return[b.x+(b.w>>1),b.y+b.h]}
function sedDoorAt(x,y,skip){const Ly=P.tw.set.lay;return Ly.b.some(b=>b!==skip&&sedDoor(b)[0]===x&&sedDoor(b)[1]===y)}
function sedBldOK(b,skip){for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){if(!sedIn(x,y)||sedBldAt(x,y,skip)||sedFoAt(x,y)||sedDoorAt(x,y,skip))return false}
  const[dx,dy]=sedDoor(b);return sedIn(dx,dy)&&!sedBldAt(dx,dy,skip)&&!sedFoAt(dx,dy)}
// un arredo che chiuderebbe una porta, la bacheca o il mercante non si mette
function sedReach(d,x,y){if(d[y*N+x]>=0)return true;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const u=x+a,v=y+b;if(u>=0&&v>=0&&u<N&&v<N&&d[v*N+u]>=0)return true}return false}
// si misura da dove si entra nel borgo: le uscite della regione (così conta anche il posto dove sta l'eroe)
function sedBfs(){const R=[];if(ZZ&&ZZ.rx!=null&&typeof twEdgeY==='function'){const rx=ZZ.rx,ry=ZZ.ry;for(const[x,y]of[[N-1,twEdgeY(rx,ry)],[0,twEdgeY(rx-1,ry)],[twEdgeX(rx,ry),N-1],[twEdgeX(rx,ry-1),0]])if(WK(M[y][x]))R.push([x,y])}
  if(!R.length)return bfs(P.px|0,P.py|0);let D=null;for(const[x,y]of R){const d=bfs(x,y);if(!D)D=d;else for(let i=0;i<d.length;i++)if(d[i]>=0&&D[i]<0)D[i]=d[i]}return D}
function sedBlocks(cells){const d0=sedBfs(),old=cells.map(([x,y])=>M[y]&&M[y][x]);for(const[x,y]of cells)if(M[y])M[y][x]=6;let bad=false;try{const d=sedBfs(),need=[[P.px|0,P.py|0]];
    for(const e of ents)if((e.k==='po'&&e.st==='door')||e.k==='owb'||(e.k==='npc'&&e.lf==='stay'))need.push([e.px|0,e.py|0]);if(ZZ&&ZZ.rx!=null&&typeof twEdgeY==='function'){const rx=ZZ.rx,ry=ZZ.ry;need.push([N-1,twEdgeY(rx,ry)],[0,twEdgeY(rx-1,ry)],[twEdgeX(rx,ry),N-1],[twEdgeX(rx,ry-1),0])}
    for(const[x,y]of need){if(cells.some(c=>c[0]===x&&c[1]===y))continue;if(sedReach(d0,x,y)&&!sedReach(d,x,y)){bad=true;break}}}
  finally{cells.forEach(([x,y],i)=>{if(M[y])M[y][x]=old[i]})}return bad}
function sedFree(x,y){const Ly=P.tw.set.lay,mk=Ly&&Ly.mk;if(mk&&mk[0]===x&&(mk[1]===y||mk[1]-1===y))return false;return sedIn(x,y)&&!sedBldAt(x,y)&&!sedFoAt(x,y)&&!sedDoorAt(x,y)}
// la generazione del borgo dalla pianta disegnata con l'editor
function twSetGenC(C,ends){const{F,rnd,n,rx,ry,bio,tg,ok,z}=C,S=P.tw.set,Ly=S.lay,c=Ly.c,cx=c[0],cy=c[1],R=sedR(),th=TWSTH[S.col|0]||TWSTH[0],gr=twGround(bio);z.ham=1;z.set=1;z.n=S.n;z.shub=[cx,cy];
  const inR=(x,y)=>ok(x,y)&&Math.hypot(x-cx,y-cy)<=R;
  for(let y=cy-R;y<=cy+R;y++)for(let x=cx-R;x<=cx+R;x++)if(inR(x,y)){const d=Math.hypot(x-cx,y-cy);if(M[y][x]===2&&(d>R-1||d>23))continue;F(x,y,gr)}
  for(const k in Ly.t){const[x,y]=sedXY(k);if(!inR(x,y))continue;const v=Ly.t[k];F(x,y,v==='g'?gr:v)}
  if(typeof setApplyLay==='function')setApplyLay(C,Ly,inR);
  // le fontane
  for(const p of Ly.p){for(let v=p.y-1;v<=p.y+2;v++)for(let u=p.x-1;u<=p.x+2;u++){if(!ok(u,v))continue;if(u>=p.x&&u<=p.x+1&&v>=p.y&&v<=p.y+1){M[v][u]=2;DEC[v][u]=''}else{M[v][u]=6;DEC[v][u]='ɸ'}C.res(u,v)}}
  // gli edifici: quelli costruiti e non ancora piazzati trovano un posto da soli
  const have=new Set(Ly.b.map(b=>b.k));for(const k of SETBA)if(setB(k)&&!have.has(k)){
    let done=0;for(const[w,h]of[[4,3],[3,3]])for(let r=3;r<R&&!done;r++)for(let i=0;i<32&&!done;i++){const a=i/32*6.283,b={id:Ly.nid,k,x:Math.round(cx+Math.cos(a)*r)-(w>>1),y:Math.round(cy+Math.sin(a)*r)-1,w,h};if(sedBldOK(b)){b.id=Ly.nid++;Ly.b.push(b);done=1}}}
  let nc=0;const mx=sedMaxCase();Ly.b=Ly.b.filter(b=>b.k!=='casa'||++nc<=mx);
  for(const b of Ly.b){if(b.k!=='casa'&&!setB(b.k))continue;const kd=SEDK[b.k]||'casa',bb={x:b.x,y:b.y,w:b.w,h:b.h,wall:b.wall||th[1][b.id%2],roof:b.roof||th[2][b.id%3],ht:b.ht||(kd==='casa'?22:26+setB(b.k)*3),smoke:b.smoke!=null?b.smoke:b.id%2,st:b.st||undefined};
    let ok2=true;for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(!ok(x,y)||M[y][x]===3)ok2=false;{const dx=b.x+(b.w>>1),dy=b.y+b.h;if(!SEDND.has(b.k)&&(!ok(dx,dy)||M[dy][dx]===3))ok2=false}if(!ok2)continue;
    if(SEDND.has(b.k)){const k=TB.push(bb)-1;for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){M[y][x]=3;DEC[y][x]='';BM[y][x]=k}if(typeof setBProps==='function')setBProps(C,b);continue}
    twHouse(bb,60+b.id,rx,ry,kd);tg.push([bb.x+(bb.w>>1),bb.y+bb.h])}
  // gli arredi
  for(const k in Ly.d){const[x,y]=sedXY(k);if(!inR(x,y)||M[y][x]===3||M[y][x]===2)continue;if(ents.some(e=>e.k==='po'&&(e.px|0)===x&&(e.py|0)===y))continue;const ch=Ly.d[k],I=typeof EDECI!=='undefined'&&EDECI[ch];
    if(I&&I.water){M[y][x]=2;DEC[y][x]=ch}else if(I&&I.walk){M[y][x]=0;DEC[y][x]=ch}else{M[y][x]=6;DEC[y][x]=ch}C.res(x,y)}
  // il banco del mercante
  if(Ly.mk&&setB('mercato')){const[x,y]=Ly.mk;if(inR(x,y)&&M[y][x]!==3){M[y][x]=6;DEC[y][x]='ʍ';C.res(x,y);if(ok(x,y-1))C.res(x,y-1);if(ok(x,y-1)&&M[y-1][x]!==3){M[y-1][x]=0;if(DEC[y-1][x]&&DEC[y-1][x][0]!==DN)DEC[y-1][x]=''}}}
  // la palizzata e le torri, sempre lungo il confine
  const tra=ends.map(([x,y])=>Math.atan2(y-cy,x-cx));
  if(setB('mura')){if(typeof setMuraRing==='function')setMuraRing(C,Ly,cx,cy,R,ends);else for(let i=0;i<Math.round(R*6.3);i++){const a=i/(R*6.3)*6.283,x=Math.round(cx+.5+Math.cos(a)*(R-.5)),y=Math.round(cy+.5+Math.sin(a)*(R-.5));if(!ok(x,y)||M[y][x]!==0||DEC[y][x]===DN+'1'||DEC[y][x]===DN+'4')continue;
    if(tra.some(t2=>Math.abs(((a-t2)%6.283+9.425)%6.283-3.14159)<.16))continue;M[y][x]=1;DEC[y][x]=DN+'W'}}
  if(setB('torre')){const tn=typeof csMuraTn==='function'?csMuraTn():4;const Rt=typeof murRad==='function'?murRad(Ly,R):R;for(let i=0;i<tn;i++){const a=.785+i*6.283/tn,x=Math.round(cx+Math.cos(a)*(Rt-2.5))-1,y=Math.round(cy+Math.sin(a)*(Rt-2.5))-1;let bad=0;for(let v=y;v<y+2;v++)for(let u=x;u<x+2;u++)if(!ok(u,v)||M[v][u]!==0)bad=1;if(bad)continue;
    const b={x,y,w:2,h:2,wall:'#9a9284',roof:th[2][0],ht:40+setB('torre')*8,twr:1};const k=TB.push(b)-1;for(let v=y;v<y+2;v++)for(let u=x;u<x+2;u++){M[v][u]=3;DEC[v][u]='';BM[v][u]=k}}}
  if(typeof setMuraPost==='function')setMuraPost(C,Ly,cx,cy,R);
  // lo stendardo
  {let[x,y]=Ly.bn||[cx+3,cy-1];if(!inR(x,y)||!WK(M[y][x]))[x,y]=nearFree(x,y);ents.push({k:'twbn',n:S.n,px:x+.5,py:y+.5,cr:myCrest(),set:1})}
  // la gente
  const ppl=[0];if(setB('mercato'))ppl.push(1);if(setB('fucina'))ppl.push(2);if(setB('tempio'))ppl.push(3);if(setB('locanda'))ppl.push(4);{const nw=typeof setWalkers==='function'?setWalkers():S.lv+1;for(let i=0;i<nw;i++)ppl.push(i<3?6+i:14+i)}for(let i=0;i<(typeof setGuards==='function'?setGuards():setB('torre')*2);i++)ppl.push(10+(i%4));
  ppl.forEach((i,j)=>{const id=twNpcId(rx,ry,i);const N2=twNpc(id);if(i===0&&N2){N2.n='Intendente '+N2.n.split(' ').pop();N2.ln=['Il borgo cresce, signore. Il tesoro e i lavori li trovi nel registro (tasto U).','La gente arriva da tutta la regione: qui ci si sente al sicuro.']}
    let x,y;if(i===1&&Ly.mk&&ok(Ly.mk[0],Ly.mk[1]-1)&&WK(M[Ly.mk[1]-1][Ly.mk[0]])){x=Ly.mk[0];y=Ly.mk[1]-1}else{const a=j*2.4;[x,y]=nearFree(Math.round(cx+Math.cos(a)*(2.5+j%3)),Math.round(cy+Math.sin(a)*(2.5+j%3)))}
    const e=mkNpc(id,x,y);if(i===1||i===2)e.lfStay=1;ents.push(e)});
  if(S.lv>=2){const[x,y]=nearFree(cx-2,cy+2);ents.push({k:'owb',n:'Bacheca dei Contratti',px:x+.5,py:y+.5});tg.push([x,y])}
  twLifeScan(C,cx,cy,R,{mk:Ly.mk?[[Ly.mk[0],Ly.mk[1]+1]]:[]});
  // il punto di arrivo: fra i posti del borgo, quello da cui si raggiunge più mondo (mai una sacca chiusa fra le case)
  const cand=[[cx,cy+2]];if(Ly.bn)cand.push([Ly.bn[0],Ly.bn[1]+1]);for(const b of Ly.b)cand.push([b.x+(b.w>>1),b.y+b.h]);for(let i=0;i<8;i++){const a=i/8*6.283;cand.push([Math.round(cx+Math.cos(a)*(R-2)),Math.round(cy+Math.sin(a)*(R-2))])}
  let sp=null,best=-1;for(let[x,y]of cand){if(!ok(x,y))continue;if(!WK(M[y][x]))[x,y]=nearFree(x,y);if(!WK(M[y][x]))continue;const d=bfs(x,y);let c2=0;for(let i=0;i<d.length;i++)if(d[i]>=0)c2++;if(c2>best*1.05){best=c2;sp=[x,y]}}
  return sp||nearFree(cx,cy+2)}
// i luoghi dove va la gente nel borgo
function twLifeScan(C,cx,cy,R,o){const{n}=C,W=(x,y)=>x>0&&y>0&&x<n-1&&y<n-1&&WK(M[y][x]),pl=[],st=[],dr=[],inn=[];
  for(let y=cy-R;y<=cy+R;y++)for(let x=cx-R;x<=cx+R;x++){if(!W(x,y)||Math.hypot(x-cx,y-cy)>R)continue;const d=DEC[y][x];if(d===DN+'4'){pl.push([x,y]);st.push([x,y])}else if(d===DN+'1')st.push([x,y])}
  for(const b of TB){if(!b.to||b.dx==null)continue;const dy=b.y+b.h;if(Math.hypot(b.dx-cx,dy-cy)>R+1||!W(b.dx,dy))continue;dr.push([b.dx,dy]);if(/:locanda$/.test(b.to))inn.push([b.dx,dy])}
  const pat=[];for(let i=0;i<8;i++){const a=i/8*6.283,x=Math.round(cx+Math.cos(a)*(R-3)),y=Math.round(cy+Math.sin(a)*(R-3));if(W(x,y))pat.push([x,y])}
  if(!pl.length&&!st.length)for(let k=0;k<30;k++){const a=k*2.4,r=1+k%5,x=Math.round(cx+Math.cos(a)*r),y=Math.round(cy+Math.sin(a)*r);if(W(x,y))pl.push([x,y])}
  C.z.lf={pl:pl.length?pl:st,st:st.length?st:pl,fi:[],dr,mk:((o&&o.mk)||[]).filter(([x,y])=>W(x,y)),inn,pat}}
const _twSetGen726=twSetGen;twSetGen=function(C,ends){const S=P.tw.set;if(S&&S.lay&&S.lay.v)return twSetGenC(C,ends);const sp=_twSetGen726(C,ends);const[cx,cy]=C.hub;C.z.shub=[cx,cy];
  for(const e of ents)if(e.k==='npc'&&e.nid===twNpcId(C.rx,C.ry,1))e.lfStay=1;twLifeScan(C,cx,cy,8+S.lv*3,{});return sp};
/* ---- l'editor ---- */
function sedOpen(){if(!sedHere()){msg('L\'editor si apre nel tuo insediamento');return}cl();const S=P.tw.set;if(!S.lay||!S.lay.v){sedCapture();save()}SED.on=1;SED.sel=null;SED.tool=SED.tool||'bld';P.path=[];P.tg=null;
  document.body.classList.add('sedon');sedUI();banner('Editor del borgo','Clicca sulla mappa per costruire · cammina per spostarti','martello')}
function sedClose(){SED.on=0;SED.sel=null;SED.down=0;SED.paint=null;document.body.classList.remove('sedon');const el=$('sed');if(el)el.hidden=true;save()}
function sedApply(){setRebuild();save();sedUI()}
function sedTool(t){SED.tool=t;SED.sel=null;sedUI()}
function sedTile(ev){if(typeof D3!=='undefined'&&D3.act){const p=d3Ground(ev.clientX,ev.clientY);return p?[Math.floor(p[0]),Math.floor(p[1])]:null}const[mx,my]=toWorld(ev.clientX,ev.clientY);return[Math.floor((mx/32+my/16)/2),Math.floor((my/16-mx/32)/2)]}
function sedClear(x,y){const Ly=P.tw.set.lay,k=sedKey(x,y);delete Ly.d[k]}
function sedClick(x,y){const S=P.tw.set,Ly=S.lay,k=sedKey(x,y),T=SED.tool;
  if(T==='bld'){if(SED.sel){const b=SED.sel.b,nb=Object.assign({},b,{x:x-(b.w>>1),y:y-(b.h>>1)});if(!sedBldOK(nb,b.id!=null&&Ly.b.includes(b)?b:null)){msg('Qui non ci sta: serve spazio libero dentro il borgo, anche davanti alla porta');tone(150,.08);return}
      {const cl2=[];for(let v=nb.y;v<nb.y+nb.h;v++)for(let u=nb.x;u<nb.x+nb.w;u++)cl2.push([u,v]);if(sedBlocks(cl2)){msg('Così chiuderesti il passaggio verso una porta, un mercante o verso di te');tone(150,.08);return}}
      for(let v=nb.y;v<=nb.y+nb.h;v++)for(let u=nb.x;u<nb.x+nb.w;u++){if(v<nb.y+nb.h||u===sedDoor(nb)[0])sedClear(u,v)}
      if(Ly.b.includes(b))Object.assign(b,{x:nb.x,y:nb.y});else Ly.b.push(nb);SED.sel=null;tone(520,.06,'triangle');sedApply();return}
    const b=sedBldAt(x,y);if(b){SED.sel={b};tone(440,.05,'triangle');sedUI()}return}
  if(T==='road'){Ly.t[k]=SED.rc;if(Ly.f)delete Ly.f[k];sedClear(x,y);return 'paint'}
  if(T==='dec'){if(!sedFree(x,y)){msg('Qui c\'è già un edificio o una porta');tone(150,.08);return}const c=SED.dc;
    if(c==='@fo'){const fo={k:'fo',x:x-1,y:y-1};for(let v=fo.y-1;v<=fo.y+2;v++)for(let u=fo.x-1;u<=fo.x+2;u++)if(!sedFree(u,v)){msg('La fontana è 4×4: qui non ci sta');tone(150,.08);return}
      const cl4=[];for(let v=fo.y-1;v<=fo.y+2;v++)for(let u=fo.x-1;u<=fo.x+2;u++)cl4.push([u,v]);if(sedBlocks(cl4)){msg('Così chiuderesti il passaggio verso una porta o un mercante');tone(150,.08);return}if(P.g<SEDFO){msg('Servono '+SEDFO+' monete');return}P.g-=SEDFO;for(let v=fo.y-1;v<=fo.y+2;v++)for(let u=fo.x-1;u<=fo.x+2;u++)sedClear(u,v);Ly.p.push(fo);tone(600,.06,'triangle');sedApply();return}
    if(Ly.d[k]===c)return;if(sedBlocks([[x,y]])){msg('Così chiuderesti il passaggio verso una porta o un mercante');tone(150,.08);return}if(P.g<SEDC){msg('Servono '+SEDC+' monete');tone(150,.08);return}P.g-=SEDC;Ly.d[k]=c;tone(560+Math.random()*80,.04,'triangle');sedApply();return}
  if(T==='mk'){if(!setB('mercato')){msg('Prima costruisci il Mercato');return}if(!sedFree(x,y)||!sedFree(x,y-1)){msg('Il banco ha bisogno di una casella libera dietro, per il mercante');return}if(sedBlocks([[x,y]])){msg('Così chiuderesti il passaggio verso una porta');return}{const o=M[y][x];M[y][x]=6;const d=sedBfs();M[y][x]=o;if(!sedReach(d,x,y-1)||d[(y-1)*N+x]<0){msg('Dietro il banco il mercante deve poterci arrivare');return}}sedClear(x,y);sedClear(x,y-1);Ly.mk=[x,y];sedApply();return}
  if(T==='bn'){if(!sedFree(x,y)){msg('Qui non si può');return}sedClear(x,y);Ly.bn=[x,y];sedApply();return}
  if(T==='del'){const fo=sedFoAt(x,y);if(fo){Ly.p.splice(Ly.p.indexOf(fo),1);sedApply();return}if(Ly.d[k]){delete Ly.d[k];sedApply();return}if(Ly.t[k]&&Ly.t[k]!=='g'){Ly.t[k]='g';sedApply();return}
    const b=sedBldAt(x,y);if(b){if(b.k!=='casa'){msg('Gli edifici costruiti si spostano, non si demoliscono');return}if(!confirm('Demolire questa casa?'))return;Ly.b.splice(Ly.b.indexOf(b),1);sedApply()}}}
function sedNewHouse(){const Ly=P.tw.set.lay,n=Ly.b.filter(b=>b.k==='casa').length;if(n>=sedMaxCase()){msg('Per altre case serve un\'Espansione del borgo');return}SED.tool='bld';SED.sel={b:{id:Ly.nid++,k:'casa',w:SED.sz[0],h:SED.sz[1]}};sedUI()}
function sedSize(w,h){SED.sz=[w,h];if(SED.sel&&!P.tw.set.lay.b.includes(SED.sel.b)){SED.sel.b.w=w;SED.sel.b.h=h}else if(SED.sel){const b=SED.sel.b,nb=Object.assign({},b,{w,h});if(b.k==='casa'&&sedBldOK(nb,b)){b.w=w;b.h=h;sedApply();return}else if(b.k==='casa')msg('Non c\'è spazio per allargarla qui')}sedUI()}
function sedColor(kind){const S=P.tw.set,b=SED.sel&&SED.sel.b;if(!b||!S.lay.b.includes(b))return;const th=TWSTH[S.col|0]||TWSTH[0],W2=['#e0d0b0','#c8b89a','#d8c8a8','#e8dcc0','#f0e8d8','#a8988a','#8a6a4a','#c8c8c8','#5a5060'],R2=['#a8402f','#7a3a2a','#3a5a8a','#4a6a3a','#5a4a3a','#8a6a2a','#6a3a8a','#d4af37','#2a4a6a','#3a3a3a'];
  const L=kind==='w'?W2:R2,cur=kind==='w'?(b.wall||th[1][0]):(b.roof||th[2][0]),i=(L.indexOf(cur)+1)%L.length;if(kind==='w')b.wall=L[i];else b.roof=L[i];sedApply()}
function sedReset(){if(!confirm('Tornare al borgo automatico? La pianta disegnata con l\'editor si perde.'))return;delete P.tw.set.lay;sedClose();setRebuild();save();msg('Il borgo è tornato com\'era')}
function sedUI(){let el=$('sed');if(!el){el=document.createElement('div');el.id='sed';document.body.appendChild(el)}if(!SED.on){el.hidden=true;return}el.hidden=false;
  const S=P.tw.set,Ly=S.lay,T=SED.tool,tb=(k,n)=>`<button class="${T===k?'on':''}" onclick="sedTool('${k}')">${n}</button>`,nc=Ly.b.filter(b=>b.k==='casa').length;
  let h=`<div class="sedh"><b>✏ ${esc(S.n)}</b><span>${P.g|0}💰</span><button class="pri" onclick="sedClose()">✔ Fine</button></div><div class="sedt">${tb('bld','🏠 Edifici')}${tb('road','🛣 Strade')}${tb('dec','🌳 Arredi')}${tb('mk','🛒 Banco')}${tb('bn','🚩 Stendardo')}${tb('del','🧽 Gomma')}</div><div class="sedb">`;
  if(T==='bld'){const b=SED.sel&&SED.sel.b,placed=b&&Ly.b.includes(b);
    h+=b?`<p class="sedi">${placed?'Clicca dove vuoi spostare':'Clicca dove vuoi costruire'}: <b>${SEDKN[b.k]||'Casa'}</b> ${b.w}×${b.h}. <button onclick="SED.sel=null;sedUI()">Annulla</button></p>`:`<p class="sedi">Clicca su un edificio per spostarlo, o aggiungi una casa.</p>`;
    h+=`<div class="sedr"><button onclick="sedNewHouse()" ${nc>=sedMaxCase()?'disabled':''}>＋ Nuova casa</button><span class="mu">${nc} di ${sedMaxCase()} case</span></div>`;
    if(!b||b.k==='casa')h+=`<div class="sedr">${[[3,3],[4,3],[5,3],[4,4],[5,4]].map(([w,hh])=>`<button class="${SED.sz[0]===w&&SED.sz[1]===hh?'on':''}" onclick="sedSize(${w},${hh})">${w}×${hh}</button>`).join('')}</div>`;
    if(placed)h+=`<div class="sedr"><button onclick="sedColor('w')">🎨 Muri</button><button onclick="sedColor('r')">🎨 Tetto</button></div>`;
    h+=`<div class="sedl">${Ly.b.map(x=>`<button class="${b===x?'on':''}" onclick="SED.sel={b:P.tw.set.lay.b.find(q=>q.id===${x.id})};sedUI()">${SEDKN[x.k]||'🏠 Casa'}${x.k!=='casa'&&!setB(x.k)?' <i>(da costruire)</i>':''}</button>`).join('')}</div>`}
  else if(T==='road')h+=`<p class="sedi">Clicca o trascina per disegnare.</p><div class="sedr">${[['4','⬜ Lastricato'],['1','🟫 Sentiero'],['g','🟩 Erba']].map(([c,n])=>`<button class="${SED.rc===c?'on':''}" onclick="SED.rc='${c}';sedUI()">${n}</button>`).join('')}</div>`;
  else if(T==='dec')h+=`<p class="sedi">Scegli e clicca sulla mappa · ${SEDC}💰 l'uno, la fontana ${SEDFO}💰.</p>`+SEDD.map(([g2,L])=>`<h5>${g2}</h5><div class="sedg">${L.map(([c,ic,nm])=>`<button title="${esc(nm)}" class="${SED.dc===c?'on':''}" onclick="SED.dc='${c}';sedUI()"><i>${ic}</i><small>${esc(nm)}</small></button>`).join('')}</div>`).join('');
  else if(T==='mk')h+=`<p class="sedi">${setB('mercato')?'Clicca dove mettere il banco: il mercante starà dietro, e lì resterà.':'Prima costruisci il Mercato dal registro (U).'}</p>`;
  else if(T==='bn')h+=`<p class="sedi">Clicca dove piantare lo stendardo del borgo.</p>`;
  else h+=`<p class="sedi">Clicca su un arredo, una strada, una fontana o una casa per toglierli.</p>`;
  h+=`</div><div class="sedf"><button onclick="sedReset()">↺ Ripristina il borgo automatico</button></div>`;el.innerHTML=h}
// clic, trascinamento e anteprima sulla mappa
{const pd=cv.onpointerdown;cv.onpointerdown=ev=>{if(!SED.on||!sedHere()){if(SED.on)sedClose();pd(ev);return}if(ev.button===2||ev.button===1){pd(ev);return}auInit();
  const tl=sedTile(ev);if(!tl)return;SED.down=1;const r=sedClick(tl[0],tl[1]);if(r==='paint')SED.paint=sedKey(tl[0],tl[1]);ev.preventDefault&&ev.preventDefault()}}
addEventListener('pointermove',ev=>{if(!SED.on)return;const tl=ev.target===cv?sedTile(ev):null;SED.hv=tl;if(SED.down&&SED.tool==='road'&&tl&&sedIn(tl[0],tl[1])&&!sedBldAt(tl[0],tl[1])){const k=sedKey(tl[0],tl[1]);if(k!==SED.paint){const Ly=P.tw.set.lay;Ly.t[k]=SED.rc;if(Ly.f)delete Ly.f[k];sedClear(tl[0],tl[1]);SED.paint=k}}});
addEventListener('pointerup',()=>{if(!SED.on)return;if(SED.down&&SED.paint){SED.paint=null;sedApply()}SED.down=0});
function sedScr(x,y){if(typeof D3!=='undefined'&&D3.act){const q=d3Proj(x,y,0);return q?[q[0],q[1]]:null}return[(PX(x,y)-camX)*S+W/2,(PY(x,y,0)-camY)*S+H/2]}
function sedPoly(x,y,w,h,fill,stroke){const a=sedScr(x,y),b=sedScr(x+w,y),c=sedScr(x+w,y+h),d=sedScr(x,y+h);if(!a||!b||!c||!d)return;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.lineTo(d[0],d[1]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}}
function sedOverlay(){if(!SED.on||!sedHere()||!P.tw.set.lay)return;const Ly=P.tw.set.lay,c=Ly.c,R=sedR();g.save();g.setTransform(DPR,0,0,DPR,0,0);
  g.setLineDash([6,6]);g.strokeStyle='rgba(255,216,74,.7)';g.lineWidth=2;g.beginPath();for(let i=0;i<=64;i++){const a=i/64*6.283,q=sedScr(c[0]+.5+Math.cos(a)*(R-.5),c[1]+.5+Math.sin(a)*(R-.5));if(!q)continue;if(i)g.lineTo(q[0],q[1]);else g.moveTo(q[0],q[1])}g.stroke();g.setLineDash([]);
  const sb=SED.sel&&SED.sel.b;if(sb&&Ly.b.includes(sb))sedPoly(sb.x,sb.y,sb.w,sb.h,'rgba(255,216,74,.18)','#ffd84a');
  const hv=SED.hv;if(hv){const[x,y]=hv;if(SED.tool==='bld'&&sb){const nb=Object.assign({},sb,{x:x-(sb.w>>1),y:y-(sb.h>>1)}),ok2=sedBldOK(nb,Ly.b.includes(sb)?sb:null);
      sedPoly(nb.x,nb.y,nb.w,nb.h,ok2?'rgba(90,220,120,.28)':'rgba(255,80,80,.28)',ok2?'#5adc78':'#ff5050');const[dx,dy]=sedDoor(nb);sedPoly(dx,dy,1,1,'rgba(255,255,255,.35)','#ffffff')}
    else if(SED.tool==='dec'&&SED.dc==='@fo'){const ok2=[...Array(16).keys()].every(i=>sedFree(x-2+i%4,y-2+(i>>2)));sedPoly(x-2,y-2,4,4,ok2?'rgba(90,220,120,.25)':'rgba(255,80,80,.25)',ok2?'#5adc78':'#ff5050')}
    else{const b=SED.tool==='bld'?sedBldAt(x,y):null;if(b)sedPoly(b.x,b.y,b.w,b.h,'rgba(255,255,255,.12)','#ffffff');else{const ok2=SED.tool==='del'||SED.tool==='road'?sedIn(x,y):sedFree(x,y);sedPoly(x,y,1,1,ok2?'rgba(255,255,255,.25)':'rgba(255,80,80,.3)',ok2?'#ffffff':'#ff5050')}}}
  g.restore()}
const _draw726=draw;draw=function(){_draw726();if(SED.on&&!(typeof D3!=='undefined'&&D3.act))sedOverlay()};
if(typeof d3Overlay==='function'){const _d3o726=d3Overlay;d3Overlay=function(){_d3o726();if(SED.on)sedOverlay()}}
// il tasto V apre e chiude l'editor quando sei nel tuo borgo; si chiude da solo se esci
{const kd=onkeydown;onkeydown=e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')){kd(e);return}
  if(started&&!PM&&(e.key==='v'||e.key==='V')&&!e.ctrlKey&&!e.metaKey&&sedHere()){if(SED.on)sedClose();else sedOpen();e.preventDefault();return}if(SED.on&&e.key==='Escape'){if(SED.sel){SED.sel=null;sedUI()}else sedClose();e.preventDefault();return}kd(e)}}
const _upd726=upd;upd=function(dt){_upd726(dt);if(SED.on&&!sedHere())sedClose()};
// nel registro: il pulsante dell'editor e, con la pianta disegnata, al posto degli abbellimenti automatici una nota
const _rgHTML726=rgHTML;rgHTML=function(){let h=_rgHTML726();const S=P.tw&&P.tw.set;if(RG.tab!=='set'||!S)return h;
  const btn=`<div class="rgcard sedcard"><div><b>✏ Editor del borgo</b><p class="mu">Sposta gli edifici, aggiungi case, disegna strade e piazze, metti alberi, fontane, lampioni, bancarelle e campi${sedHere()?'':' · si apre quando sei nel borgo'}. Tasto V.</p></div><span><button class="pri" onclick="sedOpen()" ${sedHere()?'':'disabled'}>✏ Modifica il borgo</button></span></div>`;
  h=h.replace('<h4>Personalizzare</h4>','<h4>Personalizzare</h4>'+btn);
  if(S.lay&&S.lay.v)h=h.replace(/<div class="rgth">(?=<button class="[^"]*" onclick="setDec)[\s\S]*?<\/div>/,'<p class="mu">Fontana, statue, giardini, lanterne e stendardi ora li metti tu con l\'editor.</p>');return h};
document.head.insertAdjacentHTML('beforeend',`<style>
#sed{position:fixed;left:10px;top:100px;bottom:80px;width:290px;z-index:60;background:rgba(16,14,24,.93);border:1px solid #ffd84a55;border-radius:12px;color:#f0e8d8;display:flex;flex-direction:column;font:13px system-ui,sans-serif;box-shadow:0 6px 30px #0008}
#sed[hidden]{display:none}#sed .sedh{display:flex;gap:8px;align-items:center;padding:9px 10px;border-bottom:1px solid #ffffff1a}#sed .sedh b{flex:1;color:#ffd84a}#sed .sedh span{color:#ffd84a}
#sed .sedt{display:flex;flex-wrap:wrap;gap:4px;padding:7px 8px;border-bottom:1px solid #ffffff1a}#sed button{font:inherit;color:inherit;background:#ffffff12;border:1px solid #ffffff22;border-radius:7px;padding:5px 8px;cursor:pointer}
#sed button.on{border-color:#ffd84a;color:#ffd84a;background:#ffd84a1a}#sed button.pri{background:#3a7a3a;border-color:#5adc78}#sed button:disabled{opacity:.45;cursor:default}
#sed .sedb{flex:1;overflow:auto;padding:8px 10px}#sed .sedi{margin:4px 0 8px;line-height:1.4}#sed .sedr{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin:6px 0}
#sed .sedl{display:flex;flex-direction:column;gap:4px;margin-top:8px}#sed .sedl button{text-align:left}#sed h5{margin:8px 0 4px;color:#f5b942}
#sed .sedg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}#sed .sedg button{display:flex;flex-direction:column;align-items:center;padding:5px 2px}#sed .sedg i{font-style:normal;font-size:20px}#sed .sedg small{font-size:9.5px;opacity:.8;line-height:1.1;text-align:center}
#sed .sedf{padding:8px 10px;border-top:1px solid #ffffff1a}.sedcard{border-color:#ffd84a88!important}
@media (max-width:700px){#sed{left:6px;right:6px;top:auto;bottom:6px;width:auto;max-height:46vh}}
body.sedon #qt,body.sedon #twbtns{opacity:.35}</style>`);
