/* ================= 7.50: Thalassa e la Giungla di Smeraldo, costruite da capo =================
   THALASSA (56×56), una città bianca su una baia:
   - in alto il Palazzo della Regina, con il piazzale, le statue e i cipressi; dentro la sala del trono (Oreste, le guardie,
     la Regina quando torna);
   - il Viale del Serpente scende dal palazzo al porto, con le palme, le lanterne e gli archi di bouganvillea;
   - la Piazza del Serpente con la fontana, le panchine e i vasi; a est il Santuario del Mare (con il suo interno), a ovest
     la Taverna della Sirena (con il suo interno) e la casa della Nonna Marea;
   - i due quartieri di case bianche con i tetti colorati, i vicoli, gli orti, le anfore e i giardini;
   - il Mercato delle spezie con le bancarelle, il lungomare di pietra, tre moli di legno con le barche, il frangiflutti
     e il faro sullo scoglio; a ovest la spiaggia con gli ombrelloni, le barche tirate in secco e gli scogli del relitto.
   LA GIUNGLA (60×60): alberi giganti con le liane, palme, banani, felci, fiori enormi, rocce coperte di muschio; un fiume
   che scende da una cascata e passa sotto due ponti di corda; il lago; sentieri di terra battuta; il tempio in cima a una
   scalinata di rovine con le colonne; i tre santuari; l'accampamento di Ilva, la capanna di Scirocco, le teste di pietra.
   Gli alberi alti diventano trasparenti quando l'eroe ci passa dietro. */
Object.assign(NPCS,{
  teti48:{n:'Pescivendola Teti',c:'#3a6a8a',hat:'#e8e0d0',ln:['Tonno, orate, ricciole! Pescato all\'alba, venduto a mezzogiorno!','Da quando il Serpente dorme di nuovo, le reti tornano piene.']},
  nereo48:{n:'Vasaio Nereo',c:'#a86a3a',hat:'#d8c8a0',ln:['Le anfore di Thalassa arrivano fino ad Aldoria. Le riconosci dall\'onda dipinta sul collo.','L\'argilla buona si trova sulle rive del fiume, nella giungla.']},
  ondina48:{n:'Ondina',c:'#e8a0c8',hat:'#ffd84a',ln:['Ogni sera la mamma mi porta a vedere il faro che si accende.','Sai nuotare? Io sì, fino al primo molo!']},
  glauco48:{n:'Vecchio Glauco',c:'#4a5a6a',hat:'#2a2a3a',ln:['Sessant\'anni per mare. Ne ho viste di tempeste, ma mai come la notte in cui si svegliò il Serpente.','Alla Taverna della Sirena si beve il miglior rum dell\'arcipelago.']},
  gaia48:{n:'Ostessa Gaia',c:'#8a3a4a',hat:'#f4f0e0',ln:['Benvenuto alla Sirena! Pesce alla brace e rum di canna, finché ce n\'è.','I marinai raccontano storie, io le ascolto tutte. Quasi tutte vere.']},
  vela48:{n:'Velaia Iride',c:'#c8a8e8',hat:'#3a2a6a',ln:['Cucio le vele per tutte le barche del porto. Quella arancione? Non l\'ho cucita io.','Il vento di Thalassa profuma di sale e di limoni.']}});
Object.assign(NPS,{teti48:'c|bun:#3a1a10|none|scarf:#3a6a8a|apron:#e8e0d0|fish|shout|f,fat',nereo48:'d|short:#2a1a10|full:#2a1a10|none|apron:#a86a3a,patches|basket|idle|fat',
  ondina48:'c|tail:#3a1a10|none|flower|apron:#e8a0c8|none|idle|kid,f',glauco48:'c|bald|full:#e8e8e8|cap:#2a2a3a|vest:#4a5a6a,earring|pipe|idle|old',
  gaia48:'b|bun:#8a3a1a|none|scarf:#8a3a4a|apron:#f4f0e0|mug|idle|f,fat',vela48:'b|long:#3a2a1a|none|none|shawl:#c8a8e8|rope|idle|f'});
NPCS.guardia48.ln=['Il Palazzo della Regina è aperto a chi porta pace. Il Cancelliere Oreste è nella sala del trono.','Thalassa non ha mura: il mare è la nostra difesa.'];
/* ---- gli interni: la sala del trono, il santuario, la taverna, la casa della Nonna Marea ---- */
const INT48=(n,lay,np,c,ex)=>({n,out:'thal48',lay,np,ex,fl:c[0],fl2:c[1],wall:c[2],int:1,lv:0,N:Math.max(lay.length,...lay.map(r=>r.length)),bg:'#141820',mus:'inter'});
Object.assign(Z,{
  in_pal48:INT48('Palazzo di Thalassa · la sala del trono',['################','#pp...pKKp...pp#','#..............#','#n.....==.....n#','#n.....==.....n#','#p.....==.....p#','#......==......#','#T.....==.....T#','#......==......#','#p.....==.....p#','#......==......#','#######D########'],
    [['oreste48',5,3],['guardia48',3,9],['guardia48',12,9]],['#e8e0d0','#ddd4c4','#f4f0e8']),
  in_tem48:INT48('Santuario del Mare',['##############','#p...XXXX...p#','#............#','#.nn..==..nn.#','#.nn..==..nn.#','#.....==.....#','#.nn..==..nn.#','#.....==.....#','#p....==....p#','######D#######'],
    [['corallo48',6,2]],['#cfe8e4','#c4ded8','#e8f4f0'],[{k:'tav48',i:1,px:11.5,py:2.5,n:'Tavoletta di Giada'}]),
  in_sir48:INT48('Taverna della Sirena',['##############','#bbb.CCCC..F.#','#............#','#.TT..TT..TT.#','#............#','#.TT..TT..TT.#','#............#','#k..........b#','#............#','######D#######'],
    [['gaia48',6,2],['glauco48',3,4],['vela48',10,6]],['#8a6a42','#82643e','#d8c8a8']),
  in_mar48:INT48('Casa della Nonna Marea',['##########','#B.S..pkk#','#........#','#.TT..n..#','#........#','#p......F#','####D#####'],[['marea48',6,3]],['#9a7a5a','#927254','#e8dcc4'])});
// la Regina, quando torna, siede sul trono
{const lp=loadPost;loadPost=function(k){lp(k);try{if(k==='in_pal48'&&olFix().s>=4&&!ents.some(e=>e.nid==='nerea48')){const e=mkNpc('nerea48',7,2);ents.push(e)}}catch(_){}}}
/* ---- Thalassa ---- */
function genThal50({R4,D,F,W,H,gate,N2,AN,FS,n}){
  const pier=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>0&&y>0&&x<n-1&&y<n-1){M[y][x]=4;DEC[y][x]='~'}};
  const pave=(x0,y0,w,h,c)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>0&&y>0&&x<n-1&&y<n-1){M[y][x]=4;DEC[y][x]=c}};
  const sand=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(M[y]&&M[y][x]===0&&!DEC[y][x])DEC[y][x]='ꞧ'};
  // il mare a sud e la baia a est
  R4(1,45,n-2,n-46,2);R4(48,29,n-49,16,2);
  // il lungomare, il viale, le strade, il mercato
  R4(12,41,36,4,4);R4(26,13,4,28,4);R4(3,22,44,2,4);R4(3,33,44,2,4);R4(12,35,36,6,4);
  // il piazzale del palazzo in marmo, con il tappeto rosso dalla porta al viale; la piazza a mosaico
  pave(18,11,20,2,'ⱡ');pave(27,11,2,2,'ⱦ');pave(19,25,18,7,'ⱥ');
  // i moli, il frangiflutti, lo scoglio del faro
  pier(19,45,3,7);pier(30,45,3,8);pier(40,45,2,4);R4(48,43,3,2,4);R4(49,45,6,6,0);
  H({x:50,y:46,w:3,h:3,st:'lh',wall:'#f4f0e8',ht:104});
  for(const[x,y]of[[49,50],[54,45],[54,50],[53,50]])D(x,y,'ꞃ');sand(49,45,6,6);
  // il palazzo, con le colonne, le statue e i cipressi
  H({x:19,y:2,w:18,h:9,st:'cas',wall:'#f8f4ec',ht:50,to:'in_pal48',dx:27});
  for(const[x,y]of[[18,11],[37,11]])F(x,y,'Y');for(const x of[20,22,24,31,33,35])F(x,12,'ꞡ');
  for(const y of[2,4,6,8,10])D(17,y,'ꞩ'),D(38,y,'ꞩ');
  // le case: due quartieri di case bianche con i vicoli, i vasi di fiori e i panni stesi
  const RF=['#2a8aa8','#d87a3a','#3aa8a0','#c84a4a','#2a6ab8','#e8b84a','#4aa86a'];let ri=0;
  const casa=(x,y,w,h,dx,lane)=>{H({x,y,w,h,wall:ri%3?'#f4f0e8':'#ece4d4',roof:RF[ri%RF.length],ht:20+(ri%3)*4,dx});ri++;R4(Math.min(dx,lane),y+h,Math.abs(lane-dx)+1,1,4)};
  R4(8,2,3,20,4);R4(44,2,3,20,4);
  casa(2,2,6,5,4,8);casa(11,2,6,5,13,10);casa(2,9,6,5,5,8);casa(11,9,6,5,14,10);casa(2,16,6,5,5,8);casa(11,16,6,5,13,10);
  casa(38,2,6,5,40,44);casa(47,2,7,5,50,46);casa(38,9,6,5,41,44);casa(47,9,7,5,49,46);casa(38,16,6,5,40,44);casa(47,16,7,5,50,46);
  for(const y of[5,12,19]){ents.push({k:'pan50',px:9.5,py:y+.5,s:y},{k:'pan50',px:45.5,py:y+.5,s:y+7})}
  for(const[x,y]of[[9,8],[9,15],[45,8],[45,15]])W(x,y,'ꞵ');
  for(const[x,y]of[[7,7],[6,14],[16,7],[16,14],[2,7],[11,14],[38,7],[43,14],[47,7],[53,14],[53,7],[38,14]])D(x,y,(x+y)%3?'o':'ꞣ');
  for(const[x,y]of[[2,21],[7,21],[11,21],[16,21],[38,21],[43,21],[47,21],[53,21]])D(x,y,'ꞯ');
  // il giardino dei limoni (ovest) e il giardino delle statue (est), fra le case e il viale
  for(let y=14;y<=20;y++)for(let x=18;x<=24;x++){const e=x===18||x===24||y===14||y===20;if(e&&!(y===17)&&!(x===21))D(x,y,'j');else if(!e&&(x===19||x===23)&&(y===15||y===19))D(x,y,'ꞯ')}
  D(21,17,'Y');for(const[x,y]of[[20,16],[22,18]])D(x,y,'h');D(20,18,'n');D(22,16,'n');
  for(let y=14;y<=20;y++)for(let x=31;x<=37;x++){const e=x===31||x===37||y===14||y===20;if(e&&!(y===17)&&!(x===34))D(x,y,'j');else if(!e&&(x===32||x===36)&&(y===15||y===19))D(x,y,'ꞩ')}
  D(34,17,'Y');for(const[x,y]of[[33,16],[35,18],[33,18],[35,16]])D(x,y,'h');
  // la piazza del serpente: la fontana, le panchine, i vasi, le palme
  for(let y=27;y<=28;y++)for(let x=27;x<=28;x++){M[y][x]=6;DEC[y][x]=' '}ents.push({k:'fon48',px:28,py:28,n:'Fontana del Serpente'});
  for(const[x,y]of[[23,26],[32,26],[23,29],[32,29]])F(x,y,'n');for(const[x,y]of[[19,25],[36,25],[19,31],[36,31]])F(x,y,'ꞁ');for(const[x,y]of[[25,25],[30,25],[25,30],[30,30]])F(x,y,'o');
  // il santuario del mare, la taverna della sirena con i tavolini fuori, la casa della nonna
  H({x:38,y:24,w:8,h:7,st:'tem',wall:'#f4f0e8',roof:'#2ab8a8',ht:34,to:'in_tem48',dx:42});R4(42,31,1,2,4);for(const x of[39,41,43,45])D(x,31,'ꞡ');
  H({x:3,y:25,w:9,h:6,wall:'#ece4d4',roof:'#d87a3a',ht:28,to:'in_sir48',dx:7,smoke:1});R4(7,31,1,2,4);for(const[x,y]of[[4,31],[10,31],[5,32],[9,32]])D(x,y,'ꞹ');
  H({x:13,y:26,w:5,h:5,wall:'#f4f0e8',roof:'#6a4a8a',ht:22,to:'in_mar48',dx:15});R4(15,31,1,2,4);D(13,31,'o');D(17,31,'e');
  for(const[x,y]of[[46,24],[46,27],[47,30],[2,25],[2,29],[12,25],[18,26],[18,30]])D(x,y,'ꞩ');D(47,26,'n');
  // il viale: palme e lanterne
  for(const y of[14,18,35,39]){F(26,y,'ꞁ');F(29,y,'ꞁ')}
  // le luci appese: un filo fra due pali ai lati del viale, con le lanterne di carta (ogni pezzo è un'entità a sé, così sta al posto giusto davanti e dietro)
  for(const y of[16,20,37]){for(const x of[25,30]){if(M[y][x]===4)RDF.add(y*n+x);M[y][x]=6;DEC[y][x]=' ';ents.push({k:'lp50',px:x+.5,py:y+.5})}for(let i=0;i<5;i++)ents.push({k:'lan48',seg:i,x0:25.5,x1:30.5,px:25.5+(i+.5),py:y+.5})}
  // il mercato delle spezie: due file di bancarelle con le tende a righe, le casse e le anfore
  for(let x=13;x<=46;x+=2){if(x>=24&&x<=31)continue;F(x,35,'ꞷ');F(x,40,'ꞷ')}
  for(const[x,y]of[[12,36],[12,39],[47,36],[47,39],[23,36],[32,39]])F(x,y,'ꞣ');
  // il lungomare: le bitte per le cime, le reti e le casse
  for(const x of[13,16,24,27,35,38,44,47])F(x,44,'ꞻ');for(const[x,y,c]of[[14,41,'Ы'],[25,41,'Щ'],[36,41,'Ъ'],[46,41,'Л']])F(x,y,c);
  // la spiaggia a ovest: la sabbia, gli ombrelloni, le palme, una barca in secco, gli scogli del relitto
  sand(1,35,11,10);sand(1,24,2,9);
  for(const[x,y]of[[4,37],[8,38],[5,41],[9,43]])D(x,y,'ꞥ');for(const[x,y]of[[2,35],[10,36],[6,35],[1,39]])D(x,y,'ꞁ');
  ents.push(mkShip('gozzo',8.5,40.5,'x'));for(const[x,y]of[[1,42],[1,44],[3,44],[4,44]])D(x,y,'ꞃ');ents.push({k:'rel48',px:2.5,py:42.5,n:'Relitto',on:perP()>=2});
  // il cancello verso la giungla
  R4(1,21,3,3,4);Object.assign(gate(1,22,'giungla48',{n:'Verso la Giungla di Smeraldo'}),{st:'cancello',dir:'y',span:3,off:-1.5,eo:-1,sw:1,sty:'thalassa'});
  // le barche, il traghetto, i punti di pesca
  ents.push(mkShip('caravella',36.5,50,'y'),mkShip('barca',16.5,48,'y'),mkShip('gozzo',24.5,49,'y'),mkShip('barca',44.5,48,'y'));ents.push({k:'trag48b',px:31.5,py:52.5,n:'La Stella del Sud · per Aldoria'});
  FS(20,51,0,1);FS(41,48,0,1);FS(28,44,0,1);
  // le tavolette in città: il piazzale del palazzo, il faro (la terza è nel santuario)
  ents.push({k:'tav48',i:0,px:21.5,py:11.5,n:'Tavoletta di Giada'},{k:'tav48',i:2,px:53.5,py:47.5,n:'Tavoletta di Giada'});
  // i personaggi
  N2('guardia48',25,11);N2('guardia48',30,11);N2('zefiro48',21,37);N2('teti48',34,37);N2('nereo48',16,38);N2('coral48',22,27,{wd:1});N2('ondina48',33,30,{wd:1});
  N2('ilio48',20,50);N2('tito48',40,46);N2('basilio48',49,47);
  for(const[x,y]of[[12,43],[26,43],[38,43],[46,42],[6,42]])AN('gabbiano',x,y,ANM.gabbiano());N2('gatto',9,20,{wd:1});N2('gatto',45,14,{wd:1});
  if(perP()>=6)N2('scirocco48',50,50,{n:'Scirocco, aiutante del faro'});
  return LFROM==='giungla48'?[3,22]:[28,39]}
Z.thal48.gen=genThal50;Object.assign(Z.thal48,{N:56,a:'#b4bc74',b:'#acb46c',rd:['#efe9dc','#e6dfd0'],pav50:1});
/* ---- la Giungla di Smeraldo ---- */
function genGiungla50({R4,D,W,RS,EN,gate,n}){const r=sd(hs('giungla50|'+dayKey())),c=30,nz=(x,y,s,k)=>vnz(x,y,s,k);
  // la vegetazione: macchie fitte e radure, con il rumore morbido (le macchie restano uguali, cambia solo dove sono i nemici)
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){const v=nz(x,y,7,3)*.7+nz(x,y,3,11)*.3,q=hh(x*1.7,y*2.3);
    if(v>.56){if(q<.3)D(x,y,'ꞑ');else if(q<.45)D(x,y,'ꞁ');else if(q<.57)D(x,y,'ꞕ');else if(q<.72)D(x,y,'ꞛ');else if(q<.82)D(x,y,'r');else if(q<.9)D(x,y,'ꞙ');else W(x,y,'ꞓ')}
    else if(v>.45){if(q<.14)D(x,y,'ꞑ');else if(q<.22)D(x,y,'ꞛ');else if(q<.28)D(x,y,'ꞕ');else if(q<.33)D(x,y,'ꞙ');else if(q<.5)W(x,y,'ꞓ');else if(q<.54)W(x,y,'ꞗ')}
    else{if(q<.04)D(x,y,'ꞑ');else if(q<.07)D(x,y,'ꞁ');else if(q<.09)D(x,y,'ꞙ');else if(q<.2)W(x,y,'ꞓ');else if(q<.23)W(x,y,'ꞗ');else if(q<.25)D(x,y,'ꞛ')}}
  // il fiume dalla cascata (nord-est) al mare (sud), e il lago
  const rx=y=>Math.round(44+Math.sin(y*.16)*3-(y>34?(y-34)*.25:0)),x0=rx(6);for(let y=5;y<n-1;y++){const a=rx(Math.max(6,y));for(let x=a;x<a+3;x++)if(x>0&&x<n-1){M[y][x]=2;DEC[y][x]=''}}
  for(let y=26;y<=33;y++)for(let x=37;x<=50;x++)if(Math.hypot((x-43.5)/1.4,y-29.5)<4.6){M[y][x]=2;DEC[y][x]=''}
  // la parete di roccia della cascata, coperta di muschio e di liane; l'acqua scende davanti
  for(let y=1;y<=4+(0);y++)for(let x=Math.max(39,x0-6);x<=Math.min(n-2,x0+8);x++){M[y][x]=6;DEC[y][x]='ꞽ'}
  for(const x of[x0-6,x0-5,x0+7,x0+8])if(x>38&&x<n-1&&M[5][x]!==2){M[5][x]=6;DEC[5][x]='ꞙ'}
  ents.push({k:'cas50',px:x0+1.5,py:5.15,n:'Cascata'});
  // i sentieri di terra battuta (larghi due caselle), con i ponti di corda dove passano il fiume
  const path=(a,b)=>{let[x,y]=a;let k=0;while((x!==b[0]||y!==b[1])&&k++<400){for(const[u,v]of[[x,y],[x+1,y],[x,y+1],[x+1,y+1]]){if(u<1||v<1||u>=n-1||v>=n-1)continue;if(M[v][u]===2){M[v][u]=4;DEC[v][u]='~'}else if(M[v][u]!==1){M[v][u]=4;DEC[v][u]=''}}
      if(Math.abs(b[0]-x)>Math.abs(b[1]-y))x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y)}};
  const G=[c,n-3],T=[c,13],S=[[8,22],[n-9,40],[9,n-14]],camp=[n-12,n-10],hut=[7,7],L=[[c,44],[c-6,32],[c+2,24],[c,T[1]+3]];
  path(G,L[0]);path(L[0],L[1]);path(L[1],L[2]);path(L[2],L[3]);for(const s of S)path(L[1],s);path(L[0],camp);path(L[2],hut);path(L[2],[38,22]);
  // i ponti di corda: i pali alle due rive
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(DEC[y][x]==='~'&&(M[y][x-1]===4&&DEC[y][x-1]!=='~'||M[y][x+1]===4&&DEC[y][x+1]!=='~')&&!ents.some(e=>e.k==='pon50'&&Math.abs(e.py-y-.5)<2.5&&Math.abs(e.px-x-.5)<4))ents.push({k:'pon50',px:x+.5,py:y+.5});
  // il tempio: la scalinata di rovine, le colonne e la porta
  for(let y=3;y<=T[1]+2;y++)for(let x=c-7;x<=c+8;x++){M[y][x]=0;DEC[y][x]=y<T[1]?'ꞟ':''}
  const pil=(x,y,ch)=>{M[y][x]=6;DEC[y][x]=ch||'ꞝ'};for(let y=4;y<=T[1]-2;y+=2){pil(c-7,y);pil(c+8,y)}for(const x of[c-5,c-3,c+4,c+6])pil(x,T[1]-1);
  for(let x=c-7;x<=c+8;x++)if((x<c-3||x>c+4)&&hh(x,3)<.7)pil(x,3,'ꞅ');for(const[x,y]of[[c-5,8],[c+6,8],[c-5,5],[c+6,5]])pil(x,y,'Ꞁ');
  ents.push({k:'tem50',px:c+1,py:5.5,n:'Tempio di Giada'});for(let y=4;y<=6;y++)for(let x=c-2;x<=c+3;x++){M[y][x]=6;DEC[y][x]=' '}
  const tp=po(c,7,'tempio48@1',{st:'dun',n:'Tempio di Giada'});M[7][c]=0;if(!(P.unl&&P.unl.tempio48)){tp.lock='tempio48';tp.lockMsg='Le porte del tempio sono sigillate: servono i tre Sigilli di Giada.'}ents.push(tp);
  ents.push({k:'alt48',px:c+.5,py:T[1]+.5,n:'Altare della Perla'});
  // i santuari dei sigilli
  S.forEach((s,i)=>{for(let y=s[1]-2;y<=s[1]+2;y++)for(let x=s[0]-2;x<=s[0]+2;x++)if(x>0&&y>0&&x<n-1&&y<n-1&&M[y][x]!==2){M[y][x]=0;DEC[y][x]=Math.abs(x-s[0])+Math.abs(y-s[1])<=2?'ꞟ':''}
    for(const[a,b]of[[-2,-2],[2,-2],[-2,2],[2,2]])if(M[s[1]+b]&&M[s[1]+b][s[0]+a]===0)D(s[0]+a,s[1]+b,'ꞝ');ents.push({k:'sig48',i,px:s[0]+.5,py:s[1]+.5,n:'Santuario del Sigillo di Giada'})});
  // l'accampamento di Ilva e la capanna di Scirocco
  for(const q of[camp,hut])for(let y=q[1]-2;y<=q[1]+2;y++)for(let x=q[0]-2;x<=q[0]+2;x++)if(M[y]&&M[y][x]!==2&&M[y][x]!==4){M[y][x]=0;DEC[y][x]=''}
  ents.push({k:'ten48',px:camp[0]+.5,py:camp[1]-.5,n:'Tenda dell\'esploratrice'},{k:'fuo48',px:camp[0]+1.5,py:camp[1]+1.5});
  ents.push({k:'cap48',px:hut[0]+.5,py:hut[1]+.5,n:'Capanna nella giungla'});for(let v=hut[1]-1;v<=hut[1];v++)for(let u=hut[0]-1;u<=hut[0]+1;u++){M[v][u]=6;DEC[v][u]=' '}
  // le teste di pietra degli antichi re, lungo il sentiero
  for(const[x,y]of[[c-10,36],[c+6,20],[16,12]]){for(let v=y-1;v<=y+2;v++)for(let u=x-1;u<=x+2;u++)if(M[v]&&M[v][u]!==2&&M[v][u]!==4){M[v][u]=0;DEC[v][u]=''}for(let v=y;v<=y+1;v++)for(let u=x;u<=x+1;u++){M[v][u]=6;DEC[v][u]=' '}ents.push({k:'tes48',px:x+1,py:y+1,n:'Testa di pietra'})}
  // le tavolette nella giungla: vicino alla prima testa, davanti al tempio, alla capanna
  ents.push({k:'tav48',i:3,px:c-11.5,py:39.5,n:'Tavoletta di Giada'},{k:'tav48',i:4,px:c+4.5,py:T[1]+1.5,n:'Tavoletta di Giada'},{k:'tav48',i:5,px:hut[0]+2.5,py:hut[1]+2.5,n:'Tavoletta di Giada'});
  // l'ingresso e il cancello
  for(let y=n-5;y<n-1;y++)for(let x=c-2;x<=c+3;x++){M[y][x]=y>n-4?4:0;DEC[y][x]=''}Object.assign(gate(c,n-2,'thal48',{n:'Verso Thalassa'}),{st:'cancello',dir:'x',span:3,off:-1.5,eo:1,sw:-1,sty:'giada'});
  // la gente e le creature
  return{c,T,S,camp,hut,r}}
function genGiungla50w(o){const n=o.n,{c,T,S,camp,hut,r}=genGiungla50(o),{RS,EN,N2}=o;N2('ilva',camp[0]-1,camp[1]+1);
  const d=bfs(c,n-4),fr=[];for(let y=3;y<n-3;y++)for(let x=2;x<n-2;x++)if(M[y][x]===0&&d[y*N+x]>=0&&Math.hypot(x-c,y-(n-3))>10&&!S.some(s=>Math.hypot(x-s[0],y-s[1])<4)&&Math.hypot(x-camp[0],y-camp[1])>4&&!DEC[y][x])fr.push([x,y]);
  for(let i=fr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[fr[i],fr[j]]=[fr[j],fr[i]]}
  const pool=['scimmia48','pantera48','serpe48','scimmia48','serpe48'];for(let i=0;i<18&&fr.length;i++){const q=fr.pop();EN(pool[i%pool.length],q[0],q[1])}
  for(let i=0;i<5&&fr.length;i++){const q=fr.pop();ents.push({k:'ch',px:q[0]+.5,py:q[1]+.5,rich:i===0?1:0})}
  for(let i=0;i<10&&fr.length;i++){const q=fr.pop();RS(['legna','mela','lunare','rosa','argilla'][i%5],q[0],q[1])}
  for(let i=0;i<7;i++)ents.push({k:'pap48',px:6+Math.random()*(n-12),py:6+Math.random()*(n-12),ph:Math.random()*6.28,c:['#e83a3a','#3a8ae8','#ffd84a','#3ac85a'][i%4]});
  for(let i=0;i<10;i++)ents.push({k:'far50',px:4+Math.random()*(n-8),py:4+Math.random()*(n-8),ph:Math.random()*6.28,c:['#ffd84a','#5adcff','#ff8ad8','#ffffff'][i%4]});
  for(let i=0;i<22;i++)ents.push({k:'luc48',px:3+Math.random()*(n-6),py:3+Math.random()*(n-6),ph:Math.random()*6.28});
  return LFROM&&String(LFROM).startsWith('tempio48')?[c,8]:[c,n-4]}
Z.giungla48.gen=genGiungla50w;Z.giungla48.N=60;Z.giungla48.rd=['#8a7450','#82704a'];
/* ---- i disegni delle decorazioni nuove ---- */
// gli alberi alti diventano trasparenti quando l'eroe ci passa dietro (come i muri)
const fade50=(x,y)=>{if(!P)return 0;const d=(x+y)-(P.px+P.py);return d>0&&d<4.5&&Math.abs((x-y)-(P.px-P.py))<3?1:0};
{const d0=dec;dec=function(x,y,c,h){const f=fade50(x,y);let a=0;
  switch(c){
  case 'ꞑ':{if(f){g.globalAlpha=.35;a=1}const s=.9+h*.3,o=(hh(x*3,y)-.5)*.16,k=Math.sin(t*.8+x*.7+y)*.02;
    box(x+.38,y+.38,0,.24,.24,40*s,'#5a3a22');for(const[a2,b2]of[[.2,.42],[.58,.42],[.42,.2],[.42,.6]])box(x+a2,y+b2,0,.14,.12,6,'#4a3020');
    box(x-.15+o+k,y-.15,34*s,1.3,1.3,8,'#2a6a2a');box(x+.0+o,y+.0,42*s,1,1,7,'#357a30');box(x+.2+o-k,y+.2,49*s,.6,.6,6,'#3e8a36');
    for(let i=0;i<4;i++){const q=hh(x+i,y*2);box(x+q*.9,y+.1+i*.22,14*s,.04,.04,22*s,'#3a7a2a')}break}
  case 'ꞓ':{for(let i=0;i<5;i++){const a2=i*1.256+h*2,sw=Math.sin(t*1.2+x+i)*.03;box(x+.45+Math.cos(a2)*.22+sw,y+.45+Math.sin(a2)*.22,0,.12,.12,3+i%2*2,i%2?'#3a8a3a':'#4aa04a')}box(x+.42,y+.42,0,.16,.16,4,'#2f7a2f');break}
  case 'ꞕ':{const sw=Math.sin(t*1.1+x*.9+y)*.04;box(x+.42,y+.42,0,.16,.16,20,'#6a8a3a');for(const[a2,b2]of[[-.3,0],[.3,0],[0,-.3],[0,.3]])box(x+.35+a2+sw,y+.35+b2,17,.3,.3,2,'#4aa83a');box(x+.48,y+.5,13,.12,.12,5,'#e8d040');break}
  case 'ꞗ':{box(x+.2,y+.2,0,.6,.6,1.6,'#2f6a2a');box(x+.25,y+.25,1.6,.5,.5,2,'#c8303a');for(const[a2,b2]of[[.32,.32],[.52,.32],[.32,.52],[.52,.52]])box(x+a2,y+b2,3.4,.08,.08,.8,'#f4e8d0');box(x+.4,y+.4,3.6,.2,.2,1,'#5a1a1a');break}
  case 'ꞙ':{box(x+.12,y+.15,0,.76,.7,9+h*4,'#6a6a62',.9+h*.1);box(x+.2,y+.22,9+h*4,.6,.55,2.5,'#4a8a3a');box(x+.55,y+.15,3,.3,.06,4,'#3a7a32');break}
  case 'ꞛ':{box(x+.1,y+.12,0,.8,.76,8+h*3,'#2f7a30');box(x+.2,y+.2,8+h*3,.58,.56,3,'#3a8a36',1.05);for(let i=0;i<5;i++){const q=hh(x*5+i,y*3+i);box(x+.15+q*.6,y+.15+((q*7)%1)*.6,6+((q*13)%1)*5,.1,.1,1.5,['#ff5a8a','#ffd84a','#ff8a3a'][i%3])}break}
  case 'ꞝ':{if(f){g.globalAlpha=.35;a=1}const tall=14+h*14;box(x+.25,y+.25,0,.5,.5,3,'#7a8a7a');box(x+.3,y+.3,3,.4,.4,tall,'#8a9a88');box(x+.24,y+.24,3+tall,.52,.52,3,'#7a8a7a');box(x+.62,y+.3,4,.06,.06,tall*.8,'#3a8a3a');box(x+.3,y+.66,8,.06,.06,tall*.6,'#3a8a3a');break}
  case 'ꞟ':{box(x+.02,y+.02,0,.96,.96,.6,(x+y)%2?'#9aa494':'#8e9888');if(hh(x*2,y*5)<.3)box(x+.1+h*.4,y+.2,.6,.3,.2,.3,'#5a8a4a');break}
  case 'ꞡ':{if(f){g.globalAlpha=.35;a=1}box(x+.28,y+.28,0,.44,.44,3,'#e8e0d0');box(x+.33,y+.33,3,.34,.34,32,'#f8f4ec');box(x+.26,y+.26,35,.48,.48,3,'#d4af37');break}
  case 'ꞣ':{for(const[a2,b2,s2]of[[.18,.2,1],[.55,.3,.8],[.32,.58,.9]]){box(x+a2,y+b2,0,.22*s2,.22*s2,8*s2,'#c8784a');box(x+a2+.04*s2,y+b2+.04*s2,8*s2,.14*s2,.14*s2,3*s2,'#a85a3a');box(x+a2,y+b2+.22*s2,4*s2,.22*s2,.01,1.2,'#2a6ab8')}break}
  case 'ꞥ':{const cl=['#e84a4a','#2a8aa8','#e8b84a','#4aa86a'][(x+y)%4];box(x+.47,y+.47,0,.06,.06,22,'#e8e0d0');box(x+.1,y+.1,22,.8,.8,2,cl);box(x+.25,y+.25,24,.5,.5,1.5,'#f4f0e8');box(x+.1,y+.6,0,.5,.3,.3,cl);break}
  case 'ꞩ':{if(f){g.globalAlpha=.35;a=1}box(x+.42,y+.42,0,.16,.16,6,'#5a3a22');box(x+.3,y+.3,5,.4,.4,22,'#2a5a2a');box(x+.35,y+.35,27,.3,.3,10,'#2f6a2f');box(x+.42,y+.42,37,.16,.16,6,'#357a35');break}
  case 'ꞵ':{box(x+.04,y+.04,0,.1,.1,28,'#e8e0d0');box(x+.86,y+.86,0,.1,.1,28,'#e8e0d0');box(x+.04,y+.04,28,.92,.92,2,'#3a8a3a');for(let i=0;i<7;i++){const q=hh(x*7+i,y);box(x+.1+q*.75,y+.1+((q*11)%1)*.75,29,.12,.12,2,i%2?'#e83a8a':'#c83ae8')}break}
  case 'ꞁ':{if(f){g.globalAlpha=.35;a=1}const s2=h>.5?1:-1,top=30+h*8,sw=Math.sin(t*.9+x*.7+y*.3)*.03;for(let i=0;i<7;i++){const q=i/6;box(x+.42+s2*q*q*.22+sw*q,y+.42,i*top/7,.16,.16,top/7+.4,i%2?'#8a6a42':'#7a5a3a')}
    const cx=x+.5+s2*.22+sw,cy=y+.5;for(let k=0;k<7;k++){const an=k*.898+h*3,dx=Math.cos(an),dy=Math.sin(an);for(let j=0;j<3;j++)box(cx+dx*(.12+j*.17)-.07,cy+dy*(.12+j*.17)-.07,top-j*j*1.3,.14,.14,1.4,j%2?'#3a8a3a':'#2f7a30')}
    box(cx-.1,cy-.08,top-2.5,.1,.1,2.2,'#6a4a2a');box(cx+.02,cy+.02,top-2.2,.1,.1,2.2,'#5a3a1a');break}
  case 'ꞃ':bRock(x,y,h,ZZ&&ZZ.pav50?'#8a8478':'#7a7e74','');break;
  case 'ꞅ':bRuin(x,y,h,'#7e8e7c','#5e6e5c','#4a8a3a');break;
  case 'ꞯ':{if(f){g.globalAlpha=.35;a=1}box(x+.42,y+.42,0,.16,.16,10,'#6a4a2a');box(x+.18,y+.18,9,.64,.64,10,'#3f8a36',.95+h*.1);box(x+.26,y+.26,19,.48,.48,5,'#4a9a3e');
    for(let i=0;i<6;i++){const q=hh(x*3+i,y*5+i);box(x+.16+q*.62,y+.16+((q*9)%1)*.62,10+((q*17)%1)*9,.08,.08,1.6,'#ffe03a',1.1)}break}
  case 'ꞷ':{if(f){g.globalAlpha=.4;a=1}const k=Math.floor(hh(x,y*3)*4),cl=['#c84a3a','#2a8aa8','#e8a83a','#3a9a6a'][Math.floor(hh(x*7,y)*4)],w='#6a4a2a';
    box(x+.1,y+.28,0,.8,.46,9,'#8a6a42');box(x+.08,y+.26,9,.84,.5,1,'#a8845a');for(const[a2,b2]of[[.08,.22],[.86,.22],[.08,.72],[.86,.72]])box(x+a2,y+b2,0,.06,.06,22,w);
    for(let i=0;i<4;i++)box(x+.04+i*.23,y+.14,22,.23,.72,1.6,i%2?'#f4f0e8':cl);box(x+.04,y+.84,19,.92,.04,3,cl);
    const G=[['#c8d0d8','#8aa0b8','#c8d0d8'],['#ff8a1a','#ffd84a','#3a8a3a'],['#c84a2a','#e8b84a','#8a5a2a'],['#c8784a','#a85a3a','#2a6ab8']][k];for(let i=0;i<3;i++)box(x+.16+i*.24,y+.34,10,.18,.3,2.4,G[i]);break}
  case 'ꞻ':box(x+.36,y+.36,0,.28,.28,7,'#3a3a42');box(x+.32,y+.32,7,.36,.36,1.6,'#4a4a54');box(x+.3,y+.42,3,.4,.1,.8,'#c8b080');break;
  case 'ꞹ':{const cl=(x+y)%2?'#2a8aa8':'#c84a3a';box(x+.3,y+.3,0,.4,.4,7,'#8a6a42');box(x+.2,y+.2,7,.6,.6,1,'#a8845a');box(x+.05,y+.4,0,.18,.18,4,'#6a4a2a');box(x+.77,y+.4,0,.18,.18,4,'#6a4a2a');
    box(x+.47,y+.47,8,.06,.06,14,'#e8e0d0');box(x+.06,y+.06,22,.88,.88,1.4,cl);box(x+.22,y+.22,23.4,.56,.56,1.2,'#f4f0e8');box(x+.42,y+.42,8,.08,.08,3,'#c8e8f8',1.1);break}
  case 'ꞧ':{box(x,y,0,1,1,.35,(x+y)&1?'#ecdcae':'#e6d4a2',.96+h*.08);const q=hh(x*2.3,y*1.7);if(q<.08)box(x+.3+q*3,y+.5,.35,.12,.1,.4,'#f4ece0');else if(q>.94)box(x+.4,y+.3,.35,.16,.16,.3,'#e8784a');break}
  case 'ꞽ':{const hz=30+Math.floor(h*3)*5+(y<3?8:0);box(x,y,0,1,1,hz,(x+y)&1?'#6a7268':'#626a60',.92+h*.12);box(x,y,hz,1,1,2.4,'#3f7a35');if(h>.4)box(x+.1+h*.5,y+.96,hz*.3,.08,.04,hz*.6,'#3a8a3a');if(h<.3)box(x+.2,y+.96,hz*.55,.4,.03,4,'#4a5248');break}
  case 'Ꞁ':{box(x+.25,y+.25,0,.5,.5,4,'#5a6a58');box(x+.32,y+.32,4,.36,.36,9,'#6e7e6c');box(x+.22,y+.22,13,.56,.56,3,'#4a5a48');const u=Math.sin(t*9+x)*.8;
    box(x+.34,y+.34,16,.32,.32,4+u,'#3affa0',1.4);box(x+.42,y+.42,19+u,.16,.16,4,'#c8ffe8',1.6);if(typeof nlight==='function')nlight(x+.5,y+.5,20,70,'80,255,170',.55);break}
  default:return d0.apply(this,arguments)}
  if(a)g.globalAlpha=1}}
// la cascata, i ponti di corda, il tempio, le farfalle
{const e0=ent;ent=function(e){const k=e.k;
  if(k==='cas50'){const H2=40;for(let i=0;i<3;i++){const x=e.px-1.5+i;box(x,e.py-.15,0,1,.16,H2,i%2?'#bfe8ff':'#a6dcf8',1.1);for(let j=0;j<3;j++){const q=(t*1.4+i*.37+j/3)%1;box(x+.15+j*.25,e.py-.1,H2-q*H2,.12,.08,5,'#ffffff',1.25)}}
    box(e.px-1.6,e.py-.2,H2,3.2,.3,2,'#d8f0ff',1.2);
    for(let i=0;i<8;i++){const q=(t*.7+i/8)%1;g.globalAlpha=(1-q)*.55;box(e.px-1.7+(i%4)*.9+q*.2,e.py+.1+q*.9,q*7,.5,.5,2.5,'#ffffff');g.globalAlpha=1}return}
  if(k==='pon50'){drawL([[-.06,-.06,0,.12,.12,16,'#6a4a2a'],[-.08,-.08,14,.16,.16,2,'#8a6a42']],e.px,e.py,0);return}
  if(k==='tem50'){const L=[[-3.2,-2.6,0,6.4,4.2,6,'#6a7a6a'],[-2.8,-2.3,6,5.6,3.6,6,'#7a8a78'],[-2.4,-2,12,4.8,3,6,'#6a7a6a'],[-2,-1.7,18,4,2.4,16,'#7e8e7c'],[-2.2,-1.9,34,4.4,2.8,3,'#5a6a5a'],[-1.6,-1.4,37,3.2,1.8,6,'#6a7a6a'],[-.9,-1,43,1.8,1,6,'#7a8a78'],
      [-.5,.68,18,1,.06,12,'#1a2a20'],[-.7,.66,30,1.4,.08,2,'#2ab87a'],[-2.1,-1.8,24,.1,.1,10,'#3a8a3a'],[1.9,-1.6,22,.1,.1,12,'#3a8a3a'],[-1.2,.69,8,.5,.04,6,'#3a6a5a'],[.7,.69,8,.5,.04,6,'#3a6a5a']];
    drawL(L,e.px,e.py,0);const u=.5+.5*Math.sin(t*2);box(e.px-.15,e.py-.7,49,.3,.3,4,'#6affc0',1.3+u*.4);if(typeof nlight==='function')nlight(e.px,e.py+.7,30,90,'106,255,192',.5);return}
  if(k==='lp50'){box(e.px-.1,e.py-.1,0,.2,.2,3,'#5a5a64');box(e.px-.06,e.py-.06,3,.12,.12,31,'#3a3a44');box(e.px-.1,e.py-.1,34,.2,.2,1.6,'#d4af37');box(e.px-.03,e.py-.03,35.6,.06,.06,2,'#d4af37');return}
  if(k==='lan48'&&e.seg!=null){const nt=(typeof NK!=='undefined'?NK:0)>.3,L=e.x1-e.x0,top=33,sag=7,zA=u=>top-sag*(1-(2*u-1)*(2*u-1)),wind=Math.sin(t*1.3+e.py)*.04;
    for(let j=0;j<4;j++){const u=(e.seg+j/4)/5,u2=(e.seg+(j+1)/4)/5,z1=zA(u),z2=zA(u2);box(e.x0+u*L,e.py-.015,Math.min(z1,z2),(u2-u)*L+.01,.03,Math.abs(z2-z1)+.35,'#2a2a30')}
    const u=(e.seg+.5)/5,zr=zA(u),sw=Math.sin(t*1.6+e.seg*1.3+e.py)*.05+wind,x=e.x0+u*L+sw,C=['#ff6a4a','#ffd84a','#3ac8b8','#ff8ad8','#8ad0ff'][(e.seg+(e.py|0))%5];
    box(x-.01,e.py-.01,zr-2.2,.02,.02,2.2,'#2a2a30');box(x-.07,e.py-.07,zr-2.8,.14,.14,.6,'#3a2a20');box(x-.1,e.py-.1,zr-7,.2,.2,4.2,C,nt?1.75:1.05);box(x-.07,e.py-.07,zr-7.6,.14,.14,.6,'#3a2a20');
    if(nt){box(x-.05,e.py-.05,zr-6.6,.1,.1,3.4,'#fff4c0',1.9);if(typeof nlight==='function'&&e.seg%2===0)nlight(x,e.py,zr-5,60,'255,210,140',.55)}return}
  if(k==='pan50'){const x0=e.px-2,L=4,z=17;box(x0,e.py,z,L,.03,.25,'#e8e0d0');const C=['#e84a4a','#ffffff','#2a8aa8','#ffd84a','#4aa86a','#e8a0c8'];
    for(let i=0;i<5;i++){const c=C[(i+e.s)%C.length],sw=Math.sin(t*2+i+e.s)*.03,w=.3+hh(i,e.s)*.25;box(x0+.35+i*.72+sw,e.py-.01,z-4-hh(e.s,i)*3,w,.04,4+hh(e.s,i)*3,c)}return}
  if(k==='far50'){const a2=t*.9+e.ph,x=e.px+Math.sin(a2*1.3)*1.2,y=e.py+Math.cos(a2)*1.2,z=6+Math.abs(Math.sin(t*3+e.ph))*6,w=Math.abs(Math.sin(t*16+e.ph))*.08+.02;box(x-w,y-.02,z,w,.04,.6,e.c,1.1);box(x,y-.02,z,w,.04,.6,e.c,1.1);return}
  e0(e)}}
// la fontana del serpente, rifatta: vasca rotonda a due piani, il serpente di giada che sputa l'acqua
{const e0=ent;ent=function(e){if(e.k==='fon48'){const L=[[-1,-1,0,2,2,3,'#e8e0d0'],[-.92,-.92,3,1.84,1.84,.6,'#3a9ad8'],[-.98,-.98,3,.12,1.96,2,'#f4f0e8'],[.86,-.98,3,.12,1.96,2,'#f4f0e8'],[-.98,-.98,3,1.96,.12,2,'#f4f0e8'],[-.98,.86,3,1.96,.12,2,'#f4f0e8'],
      [-.2,-.2,3,.4,.4,12,'#e8e0d0'],[-.5,-.5,15,1,1,2,'#f4f0e8'],[-.42,-.42,17,.84,.84,.5,'#5ab0e8'],[-.12,-.12,17,.24,.24,10,'#2ab87a'],[-.06,.05,27,.12,.3,4,'#2ab87a'],[.0,.3,29,.06,.06,2,'#ffe84a']];drawL(L,e.px,e.py,0);
    for(let i=0;i<10;i++){const q=(t*.9+i/10)%1,a2=i*.628;g.globalAlpha=1-q;box(e.px+Math.cos(a2)*(.2+q*.7)-.04,e.py+Math.sin(a2)*(.2+q*.7)-.04,28-q*q*24,.08,.08,2,'#bfe8ff',1.2);g.globalAlpha=1}
    if(typeof nlight==='function'&&(typeof NK!=='undefined'&&NK>.3))nlight(e.px,e.py,20,80,'150,210,255',.5);return}e0(e)}}

// il pavimento di Thalassa: il marmo del piazzale, il tappeto rosso, il mosaico della piazza
{const f0=floor;floor=function(x,y,c,h){const z=ZZ;if(c===4&&z&&z.pav50){const d=DEC[y][x];
  if(d==='ⱡ'||d==='ⱦ'){box(x,y,-6,1,1,6,(x+y)&1?'#f8f4ec':'#ece6da',.96+h*.06);if(!((x+y)&1))box(x+.42,y+.42,0,.16,.16,.15,'#d4af37');
    if(d==='ⱦ'){const L=x===27;box(x+(L?.15:0),y,0,.85,1,.3,'#b02a3a');box(x+(L?.15:.78),y,.3,.07,1,.15,'#d4af37')}return}
  if(d==='ⱥ'){const r=Math.max(Math.abs(x+.5-28),Math.abs(y+.5-28))|0;box(x,y,-6,1,1,6,'#f4f0e6',.96+h*.05);
    const k=r%4;if(k===1)box(x+.12,y+.12,0,.76,.76,.12,(x+y)&1?'#3a9ac0':'#5ab4d4');else if(k===3){if((x+y)&1)box(x+.3,y+.3,0,.4,.4,.12,'#e0b858')}else if(r===0||(x*7+y*3)%5===0)box(x+.42,y+.42,0,.16,.16,.1,'#9ad0e0');return}}
  return f0.apply(this,arguments)}}
