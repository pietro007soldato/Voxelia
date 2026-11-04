/* ================= generazione del mondo ================= */
const WK=c=>c===0||c===4||c===8;
function getRun(id){return NET.ok?(NET.runs[id]||0):((P&&P.runs&&P.runs[id])||0)}
// Definizione di una zona: statica (città, zone aperte, interni) o calcolata (piano di dungeon "id@piano", livello in base al ciclo)
function zd(k){if(Z[k])return Z[k];const[id,fs]=k.split('@'),d=DG[id],f=+fs,run=getRun(id);
  return Object.assign({},TH[d.th],{n:d.n+' · piano '+f+(run?' · ciclo '+(run+1):''),lv:d.lv+run*3+(f-1),N:44+f*4,dn:f,dg:id,run,th:d.th,en:d.en,boss:f===d.fls?d.boss:0,c:18+f*4+Math.min(6,run),mus:TRK[id]?id:'dungeon'})}
function zname(k){if(Z[k])return Z[k].n;const[id]=k.split('@'),run=getRun(id);return DG[id].n+(run?' · ciclo '+(run+1):'')}
function po(x,y,to,o={}){const st=o.st||'',d=to.includes('@')?DG[to.split('@')[0]]:null;
  return{k:'po',px:x+.5,py:y+.5,to,st,n:o.n||zname(to),col:st==='void'?'#c46bff':d?TH[d.th].tc:to==='town'?'#ffd84a':'#5fe0ff'}}
function mkNpc(id,x,y,o={}){const d=NPCS[id]||{};const e={k:'npc',nid:id,n:o.n||d.n,px:x+.5,py:y+.5,role:d.role||'',fl:0};
  e.m=id==='gatto'?beast('#e09a40',.5,'#e09a40'):hum(o.c||d.c||'#888',SKIN,1,[4,o.hat||d.hat||'#555']);if(id==='re')e.m=hum(d.c,SKIN,1.1,[6,d.hat]);
  if(o.wd){e.wd=1;e.wt=1+Math.random()*3;e.path=[]}return e}
function mk(t,x,y,id){const b=E[t],z=ZZ,s=(1+z.lv*.15)*stHP(b),hp=Math.round(b.hp*s*DF.hp);
  return{k:'en',id:id!=null?id:eid++,t,n:b.n,px:x+.5,py:y+.5,hp,mx:hp,at:b.at*(1+z.lv*.1)*DF.dm*stAT(b),xp:b.xp*(1+z.lv*.3),sp:b.sp,r:b.r,cd:b.cd,ag:b.ag,fl:0,cdt:b.cd,al:0,boss:b.boss,m:b.m,b,slt:4,ns:0}}
function bfs(sx,sy){const d=new Int32Array(N*N).fill(-1),q=[sy*N+sx];d[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%N,y=c/N|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const u=x+a,v=y+b;if(u<0||v<0||u>=N||v>=N||!WK(M[v][u])||d[v*N+u]>=0)continue;d[v*N+u]=d[c]+1;q.push(v*N+u)}}return d}
function path(sx,sy,gx,gy){if(gx<0||gy<0||gx>=N||gy>=N||!WK(M[gy][gx]))return[];const pr=new Int32Array(N*N).fill(-2),q=[sy*N+sx];pr[q[0]]=-1;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%N,y=c/N|0;if(x==gx&&y==gy)break;for(let a=-1;a<2;a++)for(let b=-1;b<2;b++){const u=x+a,v=y+b;if((!a&&!b)||u<0||v<0||u>=N||v>=N||!WK(M[v][u])||pr[v*N+u]!=-2)continue;if(a&&b&&(!WK(M[y][u])||!WK(M[v][x])))continue;pr[v*N+u]=c;q.push(v*N+u)}}
  let c=gy*N+gx;if(pr[c]==-2)return[];const r=[];while(pr[c]!=-1){r.push({x:c%N,y:c/N|0});c=pr[c]}return r.reverse()}
function nearFree(x,y){for(let r=1;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const u=x+dx,v=y+dy;if(u>0&&v>0&&u<N-1&&v<N-1&&WK(M[v][u])&&!ents.some(e=>(e.k==='po'||e.k==='npc')&&(e.px|0)===u&&(e.py|0)===v))return[u,v]}return[x,y]}
const grid=v=>Array.from({length:N},()=>new Array(N).fill(v));

function load(k,from){LFROM=from;if(from==='arrembaggio'||from==='mare'||from==='stiva')from='in_galeone';if(k!=='mare'&&NAV){NAV=null;navUI(0)}if(k==='arrembaggio'||k==='stiva')ARRW=0;if(k==='stiva'&&!SKY.stiva)SKY.stiva=['#0a0604','#140a06','#1e120a'];load0(k,from);if(ZZ&&Zk===k){loadPost(k);heroFix(from)}}
function load0(k,from){if(PM&&PM!=='trade')cl();if(!P)return;const REL=[P.px/(N||1),P.py/(N||1)];const z=zd(k);Zk=k;ZZ=z;N=z.N;
  R=(NET.code||z.dg||!z.th)?sd(hs((NET.code||'solo')+k+(z.dg?'#'+z.run:''))):Math.random;eid=0;
  M=grid(0);DEC=grid('');BM=null;FC=null;RDF=new Set();ents=[];fx=[];pop=[];PJ=[];let sp;LFP=0;
  if(z.ed)sp=edGen(z);else if(k==='town')sp=genTown();else if(k==='arena')sp=genArena();else if(z.lay)sp=genInterior(z);else if(z.dg)sp=genDungeon(z);else if(z.gen)sp=genDist(z);else sp=genWild(z);
  if(from){const ps=ents.filter(e=>e.k==='po'&&e.to===from);let p=ps[0];if(ps.length>1)p=ps.reduce((a,b)=>Math.hypot(b.px/N-REL[0],b.py/N-REL[1])<Math.hypot(a.px/N-REL[0],a.py/N-REL[1])?b:a);if(p){sp=nearFree(p.px|0,p.py|0);LFP=1}}
  R=Math.random;gndRestore();P.px=sp[0]+.5;P.py=sp[1]+.5;P.path=[];P.tg=null;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10);parts=[];
  $('zn').innerHTML=esc(z.n)+(z.dg&&z.boss?' <small>· piano del boss</small>':'');if(cineOK()&&started)zoneCard(z);else msg('Entri in: '+z.n);music(z.mus||'town');
  if(z.dg)P.seen[z.dg]=1;hud();netJoin();save()}

/* ---- città di Aldoria (72×72): mura con sette porte, due viali, piazza della fontana, porto con due moli ---- */
// Isolati: nord (castello, biblioteca, colosseo, osservatorio), centro (taverna, caserma, botteghe, fucina, tempio, municipio),
// sud (cimitero, casinò, sartoria, parco, scuderia), lungomare (rimesse e case dei pescatori).
function genTown(){const n=N,R4=(x0,y0,w,h,v)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<n&&y<n)M[y][x]=v};
  for(let i=0;i<n;i++)M[0][i]=M[n-1][i]=M[i][0]=M[i][n-1]=1;
  // viali (4 di larghezza), strade di cerchia (2), lungomare, piazza
  R4(34,1,4,63,4);R4(1,34,70,4,4);R4(1,16,70,2,4);R4(1,52,70,2,4);R4(16,1,2,63,4);R4(54,1,2,63,4);R4(1,62,70,2,4);R4(30,30,12,12,4);
  R4(1,64,70,7,2);R4(53,64,4,7,4);for(const[x,y,c]of[[53,65,'l'],[56,65,'l'],[53,68,'l'],[56,68,'l'],[53,66,'§'],[56,66,'§']]){M[y][x]=6;DEC[y][x]=c}R4(35,35,2,2,2);townPlaza();
  BM=grid(-1);
  TB=[{x:2,y:2,w:12,h:10,st:'cas',wall:'#9a9aa6',ht:46,to:'in_castle',dx:8},
    {x:20,y:3,w:8,h:6,wall:'#c8b89a',roof:'#3a5a8a',ht:30,to:'in_library',dx:23},
    {x:38,y:2,w:16,h:11,st:'col',wall:'#d8c8a0',ht:58,to:'arena',dx:46},
    {x:2,y:19,w:10,h:7,wall:'#c8a878',roof:'#7a3a2a',ht:28,to:'in_tavern',dx:6},
    {x:19,y:19,w:4,h:4,wall:'#e0d0b0',roof:'#a8402f',ht:24,to:'in_house1',dx:20},
    {x:24,y:19,w:5,h:4,wall:'#b8c8a0',roof:'#6a3a8a',ht:24,to:'in_alch',dx:26},
    {x:39,y:19,w:6,h:5,wall:'#8a7a6a',roof:'#4a4a4a',ht:24,to:'in_smith',dx:41,smoke:1},
    {x:46,y:19,w:8,h:7,st:'tem',wall:'#f0ece0',roof:'#d4af37',ht:34,to:'in_temple',dx:50},
    {x:7,y:42,w:3,h:2,wall:'#8a8a94',roof:'#5a5a64',ht:18},
    {x:19,y:39,w:4,h:4,wall:'#b8a890',roof:'#5a4a3a',ht:22,to:'in_house2',dx:20},
    {x:19,y:45,w:9,h:5,wall:'#e8d0c0',roof:'#aa1a3a',ht:30,to:'in_casino',dx:23},
    {x:25,y:26,w:4,h:4,wall:'#d8c8a0',roof:'#2a6a4a',ht:22,to:'in_house3',dx:26},
    {x:19,y:26,w:5,h:4,wall:'#f0dcc0',roof:'#c8783a',ht:24,to:'in_panetteria',dx:21,smoke:1},
    {x:25,y:39,w:5,h:4,wall:'#e8d8e8',roof:'#8a3a6a',ht:24,to:'in_sartoria',dx:27},
    {x:2,y:28,w:12,h:5,wall:'#8a8a80',roof:'#3a4a5a',ht:28,to:'in_caserma',dx:8},
    {x:57,y:39,w:11,h:6,wall:'#b88a5a',roof:'#6a3a1a',ht:26,to:'in_scuderia',dx:62},
    {x:60,y:3,w:6,h:6,st:'obs',wall:'#d8d4c8',roof:'#2a3a6a',ht:30,to:'in_osservatorio',dx:63},
    {x:57,y:19,w:10,h:7,st:'mun',wall:'#e8dcc4',roof:'#8a2a2a',ht:32,to:'in_municipio',dx:61},
    {x:4,y:55,w:6,h:4,wall:'#9a8a6a',roof:'#5a4a3a',ht:20},{x:20,y:55,w:5,h:4,wall:'#d8c8a8',roof:'#3a6a8a',ht:22},
    {x:40,y:55,w:5,h:4,wall:'#e0d0b0',roof:'#a8402f',ht:22},{x:46,y:55,w:5,h:4,wall:'#c8b8a0',roof:'#4a6a3a',ht:22},
    {x:58,y:55,w:5,h:4,wall:'#d8d0c0',roof:'#7a3a2a',ht:22},{x:64,y:55,w:5,h:4,wall:'#b8a890',roof:'#3a4a6a',ht:20},{x:26,y:55,w:8,h:6,st:'motel',wall:'#e8d8b0',roof:'#2a5a5a',ht:44,to:'in_motel',dx:30}];
  TB.forEach((b,i)=>{R4(b.x,b.y,b.w,b.h,3);for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)BM[y][x]=i;if(b.to)ents.push(po(b.dx,b.y+b.h,b.to,{st:'door'}))});
  const D=(x,y,c)=>{if(M[y][x]===0){M[y][x]=6;DEC[y][x]=c}},DL=(c,L)=>{for(const[x,y]of L)D(x,y,c)};
  // cimitero con la cripta (entrata a est)
  for(let x=2;x<=14;x++)for(let y=39;y<=49;y++)if((x===2||x===14||y===39||y===49)&&!(x===14&&(y===44||y===45)))D(x,y,'f');
  DL('t',[[4,41],[4,43],[4,45],[4,47],[11,41],[11,43],[11,46],[6,47],[9,47],[12,47],[6,40],[10,40]]);DL('r',[[3,48],[13,40],[3,40]]);
  // cortile del castello e giardino della biblioteca
  DL('Y',[[4,13],[12,13]]);DL('j',[[2,14],[3,14],[13,14],[14,14]]);DL('o',[[19,10],[28,10]]);DL('n',[[21,11],[25,11]]);
  // osservatorio: cannocchiali e aiuole
  DL('5',[[58,11],[67,11]]);DL('o',[[59,10],[66,10],[62,13]]);DL('n',[[64,12]]);
  // caserma e colosseo
  DL('E',[[58,13],[68,13]]);DL('!',[[39,13],[53,13]]);
  // mercato a est della piazza, con il pozzo
  DL('s',[[44,29],[46,29],[48,29],[50,29],[44,31],[46,31],[48,31],[50,31]]);D(42,28,'W');DL('n',[[43,27],[51,27]]);
  // giardino del municipio
  DL('j',[[57,28],[58,28],[59,28],[63,28],[64,28],[65,28]]);DL('o',[[57,30],[65,30],[61,31]]);DL('Y',[[61,29]]);DL('n',[[59,31],[63,31]]);
  // parco a sud-est della piazza
  D(47,46,'Y');D(43,48,'W');DL('n',[[45,44],[49,44],[45,48],[49,48]]);DL('o',[[46,44],[48,44],[46,48],[48,48]]);DL('h',[[44,46],[50,46],[47,43],[47,49]]);
  // recinto dei cavalli (aperto davanti alla scuderia)
  for(let x=57;x<=68;x++)for(let y=47;y<=51;y++)if((x===57||x===68||y===47||y===51)&&!(y===47&&(x===62||x===63)))D(x,y,'f');
  DL('y',[[58,48],[67,50]]);D(60,50,':');
  // lungomare: casse, botti, reti, ancore
  DL('k',[[2,60],[3,60],[12,57],[27,58],[33,60],[52,60],[69,60]]);DL('b',[[2,61],[13,57],[28,58],[53,60],[69,59]]);DL('N',[[11,60],[29,60],[39,60],[51,58]]);DL('&',[[8,61],[45,61]]);DL('@',[[14,61],[57,61],[66,61]]);
  DL('l',[[33,62],[38,62],[53,62],[56,62]]);
  M[66][20]=2;DEC[66][20]='O';DEC[67][47]='O';DEC[68][10]='O';DEC[66][63]='O';DEC[69][28]='O';
  ents.push(Object.assign(po(35,1,'forest',{st:'cancello'}),{dir:'x',span:4,off:-1.5,eo:-1,sw:1,sty:'legno'}),Object.assign(po(70,35,'desert',{st:'cancello'}),{dir:'y',span:4,off:-1.5,eo:1,sw:-1,sty:'sabbia'}),Object.assign(po(1,35,'peaks',{st:'cancello'}),{dir:'y',span:4,off:-1.5,eo:-1,sw:1,sty:'gelo'}),Object.assign(po(16,1,'nord',{st:'cancello'}),{dir:'x',span:3,off:-1.5,eo:-1,sw:1,sty:'nobile'}),Object.assign(po(70,16,'campi',{st:'cancello'}),{dir:'y',span:3,off:-1.5,eo:1,sw:-1,sty:'campi'}),Object.assign(po(1,52,'rovine',{st:'cancello'}),{dir:'y',span:3,off:-1.5,eo:-1,sw:1,sty:'ceneri',lock:'rovine',lockMsg:'Il cancello del Borgo delle Ceneri è sbarrato da catene arrugginite. Il Moreau, qui accanto, sa come aprirlo.'}),Object.assign(po(54,70,'porto',{st:'cancello'}),{dir:'x',span:4,off:-1.5,eo:1,sw:-1,sty:'mare'}));
  const cav=mkNpc('cavallo',63,49);cav.m=ANM.cavallo();
  ents.push(mkNpc('marcus',37,3),mkNpc('guardia_porta',33,3),mkNpc('tommaso',32,27),mkNpc('araldo',39,39),mkNpc('ugo',47,30),mkNpc('nino',37,61),mkNpc('guardia',8,14,{n:'Guardia del Castello'}),mkNpc('moreau',3,51),
    mkNpc('recluta',10,34,{n:'Recluta di ronda',wd:1}),cav,{k:'board',px:44.5,py:14.5,n:'Tabellone dell\'Arena'});
  const rd=[];for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(M[y][x]===4&&y<62)rd.push([x,y]);
  VILL.forEach((v,i)=>{const p=rd[Math.floor(R()*rd.length)];ents.push(mkNpc('v'+i,p[0],p[1],{n:v,c:['#a85a3a','#3a7a5a','#7a3a8a','#3a5a9a','#9a8a3a','#8a3a3a','#3a8a8a','#8a6a3a'][i],hat:['#553','#335','#533','#353','#444','#664','#355','#535'][i],wd:1}))});
  const near=(x,y,r)=>ents.some(e=>Math.abs(e.px-.5-x)<=r&&Math.abs(e.py-.5-y)<=r);
  const nb=(x,y,v)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>M[y+b]&&M[y+b][x+a]===v);
  const park=(x,y)=>x>=38&&x<=53&&y>=42&&y<=51;
  for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++){if(M[y][x]!==0||near(x,y,1.5)||y>=54)continue;
    if(nb(x,y,4)){if((x*3+y*5)%13===0)D(x,y,'l');continue}
    if(nb(x,y,3)||nb(x,y,2)||nb(x,y,6))continue;const h=hh(x*3,y*7);if(h>(park(x,y)?.5:y>38?.66:.8))D(x,y,h>.9?'h':'r')}
  // nessun angolo di prato chiuso dagli alberi: si tolgono quelli che lo circondano
  const dd=bfs(35,43);for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(M[y][x]===0&&dd[y*n+x]<0)for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(M[y+b][x+a]===6&&'rh'.includes(DEC[y+b][x+a])){M[y+b][x+a]=0;DEC[y+b][x+a]=''}
  return[35,43]}

/* ---- 7.12: il Colosseo, più grande (40×40). A nord la galleria dei gladiatori (zona sicura) con il Maestro d'Arena, il
   banditore, il tabellone, le statue dei campioni e l'angolo per allenarsi; il tunnel scende nella fossa di sabbia, ellittica e
   più ampia, dove si combatte; tutto intorno le gradinate piene di spettatori, la tribuna d'onore a est e la porta a ovest.
   I punti dove il plugin dello stress test fa duellare i suoi bot, (12.5,19.5) e (18.5,19.5), restano dentro la fossa. ---- */
const ARC={cx:19.5,cy:23.5,rx:12,ry:9};
const arD=(x,y)=>Math.hypot((x-ARC.cx)/ARC.rx,(y-ARC.cy)/ARC.ry);
const inPit=(x,y)=>Zk==='arena'&&arD(x,y)<.96;
function genArena(){const n=N;for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    if(!x||!y||x===n-1||y===n-1)M[y][x]=1;else if(y<=8)M[y][x]=0;else if(x>=18&&x<=21&&y<=15)M[y][x]=0;else if(y===9)M[y][x]=1;else M[y][x]=arD(x+.5,y+.5)<1?0:1}
  const D=(x,y,c)=>{M[y][x]=6;DEC[y][x]=c};
  // la galleria: colonne, statue dei campioni, armeria del Maestro, bracieri, panche, l'angolo degli allenamenti
  for(const x of[3,9,15,24,30,36])for(const y of[2,7])D(x,y,'₪C');
  for(const[x,y]of[[2,1],[3,1],[4,1]])D(x,y,'w');for(const[x,y]of[[5,1],[6,1]])D(x,y,'₪A');D(5,3,'C');D(6,3,'C');
  D(11,1,'₪S');D(27,1,'₪S');D(16,1,'0');D(23,1,'0');D(33,1,'₪T');D(34,1,'₪T');D(37,1,'b');D(37,2,'k');D(37,8,'k');D(2,8,'b');
  for(const[x,y]of[[32,4],[34,5],[36,4]])D(x,y,'₪D');D(29,5,'W');for(const x of[12,13,26,27])D(x,6,'n');
  ents.push(po(19,1,'town',{st:'gate',n:'Aldoria'}),mkNpc('kael',7,3),mkNpc('banditore',12,3),{k:'board',px:24.5,py:3.5,n:'Tabellone dell\'Arena'},
    mkNpc('gladiatore',33,6),mkNpc('gladiatrice',35,3),{k:'tc',px:17.7,py:8.6},{k:'tc',px:22.3,py:8.6},{k:'tc',px:17.7,py:15.4},{k:'tc',px:22.3,py:15.4});
  return[19,4]}

/* ---- interni da mappe ASCII ---- */
function genInterior(z){let sp=null;const L=z.lay;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=(L[y]||'')[x]||' ';
    if(c==='#')M[y][x]=1;else if(c==='.')M[y][x]=0;else if(c==='=')M[y][x]=8;else if(c===' ')M[y][x]=9;
    else if(c==='D'){M[y][x]=0;ents.push(po(x,y,z.out||'town',{st:'exit',n:'Esci: '+(z.out?Z[z.out].n:'Aldoria')}));sp=[x,y-1]}
    else if(c==='V'){M[y][x]=0;if(P.st>=3)ents.push(po(x,y,'cittadella@1',{st:'void'}))}
    else if(c==='c'){M[y][x]=0;if((P.hc[Zk]||0)<Date.now()-600000)ents.push({k:'ch',px:x+.5,py:y+.5,hc:Zk})}
    else{M[y][x]=6;DEC[y][x]=c}}
  for(const[id,x,y,o]of z.np){const e=mkNpc(id,x,y,o||{});if(ANM[id])e.m=ANM[id]();ents.push(e)}
  if(z.po)for(const[x,y,to,n,o]of z.po){M[y][x]=0;DEC[y][x]='';const face=M[y-1]&&M[y-1][x]===1?'n':M[y+1]&&M[y+1][x]===1?'s':M[y][x-1]===1?'w':'e';ents.push(Object.assign(po(x,y,to,{st:'door',n}),{face},o||{}))}if(z.ex)for(const o of z.ex)ents.push(Object.assign({},o));
  return sp||[1,1]}

/* ---- zone aperte: foresta, deserto, picchi ---- */
function genWild(z){for(let y=0;y<N;y++)for(let x=0;x<N;x++)M[y][x]=(!x||!y||x===N-1||y===N-1||R()<.13)?1:0;
  const lakes=Zk==='forest'?5:Zk==='peaks'?4:3;for(let i=0;i<lakes;i++){const cx=ri(9,N-8),cy=ri(9,N-8),r=ri(2,3);for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++)if((x-cx)**2+(y-cy)**2<=r*r)M[y][x]=2}
  const[gx,gy,gd,geo,gsw]=Zk==='forest'?[N>>1,N-2,'x',1,-1]:Zk==='desert'?[1,N>>1,'y',-1,1]:[N-2,N>>1,'y',1,-1];for(let y=gy-4;y<=gy+4;y++)for(let x=gx-4;x<=gx+4;x++)if(x>0&&y>0&&x<N-1&&y<N-1)M[y][x]=0;for(let k=-1;k<=1;k++){if(gd==='x')M[gy+geo][gx+k]=0;else M[gy+k][gx+geo]=0}const sp=gd==='x'?[gx,gy-3]:[gx-3*geo,gy];ents.push(Object.assign(po(gx,gy,'town',{st:'cancello',n:'Aldoria'}),{dir:gd,span:3,off:-1.5,eo:geo,sw:gsw,sty:Zk==='forest'?'legno':Zk==='desert'?'sabbia':'gelo'}));
  const d=bfs(sp[0],sp[1]),c=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(d[y*N+x]>8)c.push({x,y,d:d[y*N+x]});c.sort((a,b)=>b.d-a.d);
  const bp=c.shift();ents.push(mk(z.boss,bp.x,bp.y));
  Object.keys(DG).filter(id=>DG[id].ent===Zk).forEach((id,i)=>{const j=Math.floor(c.length*(.12+i*.22)),q=c.splice(j,1)[0];if(!q)return;for(let y=q.y-1;y<=q.y+1;y++)for(let x=q.x-1;x<=q.x+1;x++)if(x>0&&y>0&&x<N-1&&y<N-1&&M[y][x]===1)M[y][x]=0;ents.push(po(q.x,q.y,id+'@1',{st:'dun'}))});
  const fr=c.filter(q=>!ents.some(e=>Math.abs(e.px-q.x-.5)<2&&Math.abs(e.py-q.y-.5)<2));
  for(let i=fr.length-1;i>0;i--){const j=ri(0,i);[fr[i],fr[j]]=[fr[j],fr[i]]}
  for(let i=0;i<z.c&&fr.length;i++){const q=fr.pop();ents.push(mk(z.en[ri(0,z.en.length-1)],q.x,q.y))}
  for(let i=0;i<6&&fr.length;i++){const q=fr.pop();ents.push({k:'ch',px:q.x+.5,py:q.y+.5})}
  return sp}

/* ---- dungeon: stanze e corridoi, colonne e pozze, torce, boss nell'ultima stanza ---- */
function genDungeon(z){const d=DG[z.dg],f=z.dn;M.forEach(r=>r.fill(1));const rooms=[];
  for(let n=0;n<360&&rooms.length<12+f*2;n++){const w=ri(5,10),h=ri(5,10),x=ri(2,N-w-2),y=ri(2,N-h-2);
    if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)});for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)M[j][i]=0}
  for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i],wd=R()<.3?2:1;for(let x=Math.min(a.cx,b.cx);x<=Math.max(a.cx,b.cx);x++)for(let k=0;k<wd;k++)M[a.cy+k][x]=0;for(let y=Math.min(a.cy,b.cy);y<=Math.max(a.cy,b.cy);y++)for(let k=0;k<wd;k++)M[y][b.cx+k]=0}
  const sp=[rooms[0].cx,rooms[0].cy],feat=[];
  for(const r of rooms.slice(1)){if(r.w>=7&&r.h>=7&&R()<.55)for(const[x,y]of[[r.x+1,r.y+1],[r.x+r.w-2,r.y+1],[r.x+1,r.y+r.h-2],[r.x+r.w-2,r.y+r.h-2]])feat.push([x,y,1]);
    else if(z.pool&&r.w>=6&&r.h>=6&&R()<.6){const px=r.x+1,py=r.y+1;for(let y=py;y<py+2;y++)for(let x=px;x<px+2;x++)feat.push([x,y,2])}}
  for(const[x,y,v]of feat)if(M[y][x]===0)M[y][x]=v;
  let dd=bfs(sp[0],sp[1]);if(rooms.some(r=>dd[r.cy*N+r.cx]<0)){for(const[x,y]of feat)M[y][x]=0;dd=bfs(sp[0],sp[1])}
  ents.push(po(rooms[0].x,rooms[0].y,f===1?d.ent:z.dg+'@'+(f-1),{st:f===1?'exit':'up',n:f===1?'Uscita: '+zname(d.ent):'Sali al piano '+(f-1)}));
  let far=rooms[0];for(const r of rooms)if(dd[r.cy*N+r.cx]>dd[far.cy*N+far.cx])far=r;
  if(z.boss)ents.push(mk(z.boss,far.cx,far.cy));else ents.push(po(far.cx,far.cy,z.dg+'@'+(f+1),{st:'down',n:'Scendi al piano '+(f+1)}));
  for(const r of rooms){ents.push({k:'tc',px:r.x+.15,py:r.y+.15},{k:'tc',px:r.x+r.w-.15,py:r.y+.15});if(r.w*r.h>50)ents.push({k:'tc',px:r.x+.15,py:r.y+r.h-.15})}
  const c=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(dd[y*N+x]>6&&!(Math.abs(x-far.cx)<3&&Math.abs(y-far.cy)<3))c.push({x,y});
  for(let i=c.length-1;i>0;i--){const j=ri(0,i);[c[i],c[j]]=[c[j],c[i]]}
  for(let i=0;i<z.c&&c.length;i++){const q=c.pop();ents.push(mk(z.en[ri(0,z.en.length-1)],q.x,q.y))}
  for(let i=0;i<3+f&&c.length;i++){const q=c.pop();ents.push({k:'ch',px:q.x+.5,py:q.y+.5})}
  const lid=z.dg+f;if(LORE[lid]&&!P.lore.includes(lid)&&c.length){const q=c.pop();ents.push({k:'lore',id:lid,px:q.x+.5,py:q.y+.5,n:'Pagina di diario'})}
  return sp}
