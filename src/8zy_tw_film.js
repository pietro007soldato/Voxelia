/* ================= 7.23: «TOMORROW» — IL FILMATO DEL RESET DELL'UNIVERSO, E I CIMELI DI ALDORIA =================
   Il filmato parte la prima volta che si comincia un mondo di Tomorrow (si rivede dal menu di Tomorrow). Racconta, scena
   per scena, mille anni dopo Aldoria: la Corona che teneva insieme il mondo, la sua distruzione, il reset dell'universo
   (Aldoria che si scioglie cubo dopo cubo nel cielo, il vuoto, i cubi che ricadono in un ordine nuovo), i sopravvissuti,
   la ricostruzione, le fazioni, e ciò che forse non è andato perduto. Due musiche nuove: «Il reset» e «Tomorrow».
   I CIMELI DI ALDORIA: dodici oggetti del vecchio mondo sono sopravvissuti nelle rovine, nei forzieri e nei dungeon di
   Tomorrow. Ognuno ha la sua storia; quelli che si indossano sono leggendari. La raccolta è nel menu di pausa. */
// ---- le musiche ----
Object.assign(TRK,{
  // «Il reset»: frigio, lento, un battito di cuore e il coro che sale dal buio
  tw_reset:{sng:1,dyn:1,bpm:66,root:52,sc:'phr',ld:'choir',lv:.05,echo:1,bs:'long',bv:.07,cp:'pad drone',dr:'heart',dv:.7,form:'IABAC',ld2:'str',lv2:.024,parts:{
    I:{ch:[0,1,0,6],ld:'harp',lv:.06,dr:'none',m:'0:4 1:4 4:4 3:4  1:8 0:8  4:4 5:4 7:4 5:4  6:8 4:8'},
    A:{ch:[0,1,6,0],m:'7:6 8:2 7:4 5:4  8:8 7:4 5:4  4:6 5:2 4:4 2:4  1:12 0:4',m2:'0:16 1:16 -1:16 0:16'},
    B:{ch:[3,1,4,0],ld:'str',dr:'timp',m:'10:4 11:4 10:4 8:4  8:6 7:2 5:8  9:4 10:4 11:4 12:4  11:8 7:8',hm:1},
    C:{ch:[0,6,1,0],ld:'choir',cp:'pad ens',dr:'timp',lv:.058,m:'7:8 8:8  6:8 4:8  8:4 7:4 5:4 4:4  0:16',hm:1}}},
  // «Tomorrow»: minore armonica che si apre in un ritornello pieno, come un'alba dopo la tempesta
  tw_saga:{sng:1,dyn:1,bpm:88,root:57,sc:'hm',ld:'fiddle',lv:.05,echo:1,bs:'pulse',bv:.08,cp:'pad arp',dr:'soft',dv:.75,form:'IAABCCD',ld2:'flute',lv2:.026,parts:{
    I:{ch:[0,5,3,4],ld:'harp',lv:.065,cp:'pad',dr:'none',bs:'long',m:'0:2 2:2 4:2 7:2 9:4 7:4  5:2 7:2 9:2 12:4 9:2 7:4  3:2 5:2 7:2 10:4 8:2 7:4  4:2 6:2 8:2 11:6 r:4'},
    A:{ch:[0,3,4,0],m:'4:4 4:2 5:2 7:6 5:2  3:4 5:4 7:4 8:4  7:3 6:1 4:4 2:4 6:4  4:12 r:4',m2:'0:16 3:16 4:16 0:16'},
    B:{ch:[5,3,6,4],ld:'flute',cp:'pad arp',dr:'light',m:'9:4 8:4 7:4 5:4  7:4 5:4 3:4 5:4  8:4 9:4 11:4 9:4  8:8 6:8',hm:1},
    C:{ch:[0,5,3,4],ld:'brass',lv:.055,cp:'stab ens',dr:'march',dv:.85,bs:'gallop',m:'7:3 7:1 9:2 11:2 12:6 11:2  10:4 9:4 7:4 5:4  8:3 8:1 10:2 12:2 13:6 12:2  11:8 r:8',m2:'4:16 5:16 3:16 4:16',hm:1},
    D:{ch:[0,4,0,0],ld:'fiddle',cp:'pad ens',dr:'timp',m:'12:8 11:4 9:4  11:8 13:8  14:12 12:4  14:16',hm:1}}}});
// ---- le scene disegnate ----
const TWFC0=['#5aa84a','#e8d4aa','#e8eef6','#5a5050','#3a8a4a','#c8a060'];
// 1. la Corona che teneva insieme il mondo: una cupola di luce sopra Aldoria
function twCrownFx(lt,x,y,z){const sp=lt*.4;fGlow(x,y,z+4,'255,225,150',70+10*Math.sin(lt*2),.28);for(const b of fCrownL(sp,FCOL,1.5,z))box(x+b[0],y+b[1],b[2],b[3],b[4],b[5],b[6],b[7]);
  for(let i=0;i<6;i++){const a=i/6*6.283+lt*.3;for(let j=0;j<6;j++){const r=1.5+j*2.6;box(x+Math.cos(a)*r-.05,y+Math.sin(a)*r-.05,z-j*14,.1,.1,2,FCOL[i],1.4)}}}
// 2. la Corona va in frantumi
FSET.tw_rotta=(S2,lt)=>{fFloor(-6,-6,12,12,'#3a3440','#34303a');const k=lt<2.6?0:fSmooth((lt-2.6)/2.4),sh=lt<2.6?Math.sin(lt*30)*.03*(lt/2.6):0,z0=40;
  // le crepe: la Corona trema, si illumina, poi esplode
  if(k===0){fGlow(sh,0,z0+6,'255,220,160',60+lt*20,.25+lt*.08);for(const b of fCrownL(lt*.2,FCOL,1.6,z0))box(b[0]+sh,b[1],b[2],b[3],b[4],b[5],b[6],(b[7]||1)+lt*.12);
    for(let i=0;i<Math.floor(lt*8);i++){const a=i*2.39,r=.2+(i%5)*.12;box(Math.cos(a)*r-.02,Math.sin(a)*r-.02,z0+2+(i%4),.04,.04,2.4,'#ffffff',1.6)}}
  else{const L=fCrownL(2.6*.2,FCOL,1.6,z0);L.forEach((b,i)=>{const a=i*2.399,u=Math.cos(a),v=Math.sin(a),sp=6+((i*37)%10),d=k*sp,z=b[2]+Math.sin(k*Math.PI)*40*(1+(i%3)*.3)-k*k*20;
      g.globalAlpha=1-k*.6;box(b[0]+u*d,b[1]+v*d,Math.max(0,z),b[3],b[4],b[5],b[6],(b[7]||1)+.3);g.globalAlpha=1});
    for(let i=0;i<6;i++){const a=i*Math.PI/3+.4,r=k*12;fGlow(Math.cos(a)*r,Math.sin(a)*r,60+Math.sin(k*Math.PI)*50,rgbOf(FCOL[i]),40,.5*(1-k*.5))}
    fGlow(0,0,z0,'255,255,255',300*k,.5*(1-k))}
  for(let i=0;i<14;i++){const a=i/14*6.283;box(Math.cos(a)*4.6-.3,Math.sin(a)*4.6-.3,0,.6,.6,10+(i%3)*5,'#4a4450')}};
// 3. Aldoria si scioglie: i cubi salgono verso il cielo (si disegna sopra la città vera)
function twDissolveFx(lt){const k=fSmooth(lt/9);for(let i=0;i<260;i++){const x=4+((i*37.7)%34),y=4+((i*53.3)%34),ph=(i*.137)%1,u=(lt*.22+ph)%1;if(u>k*1.1+.05)continue;
    const z=u*260,s=.4+((i*7)%5)*.12;g.globalAlpha=Math.max(0,1-u*.9);box(x,y,z,s,s,s*8,['#c8b89a','#a8402f','#5aa84a','#9a9aa6','#3a6ab0','#e8dcc0'][i%6],1.1+u*.6);g.globalAlpha=1}
  // l'onda bianca che parte dal castello
  const r=k*40;g.save();g.globalCompositeOperation='lighter';g.strokeStyle=`rgba(230,240,255,${.5*(1-k)})`;g.lineWidth=14;g.beginPath();g.ellipse(PX(8,7),PY(8,7,0),r*45,r*22.5,0,0,6.3);g.stroke();g.restore()}
// 4. il vuoto: i cubi vagano nel buio, in una spirale
FSET.tw_vuoto=(S2,lt)=>{const n=260,rot=lt*.12;for(let i=0;i<n;i++){const arm=i%4,u=(i/n),a=arm*Math.PI/2+u*9+rot,r=1+u*14,x=Math.cos(a)*r,y=Math.sin(a)*r,z=30+Math.sin(u*20+lt)*6,s=.12+(1-u)*.18;
    g.globalAlpha=.35+(1-u)*.6;box(x-s/2,y-s/2,z,s,s,s*8,['#8a7ad8','#5a8ad0','#c8a0ff','#ffffff'][i%4],1.3);g.globalAlpha=1}
  const pu=.5+.5*Math.sin(lt*2.2);fGlow(0,0,34,'200,190,255',60+pu*40,.35+pu*.2);fGlow(0,0,34,'255,255,255',20+pu*10,.6)};
// 5. la rinascita: i cubi ricadono e si ricompongono in terre nuove
FSET.tw_rinascita=(S2,lt)=>{const R=8;const cells=[];for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=Math.hypot(x,y);if(d>R+.5)continue;cells.push([x,y,d])}cells.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));
  for(const[x,y,d]of cells){const k=fSmooth((lt-d*.35)/1.4);if(k<=0){if(lt>d*.35-1.2){const kk=fSmooth((lt-d*.35+1.2)/1.2);g.globalAlpha=kk*.6;box(x+.3,y+.3,200*(1-kk)+20,.4,.4,3,'#c8c0ff',1.4);g.globalAlpha=1}continue}
    const q=x>=0&&y<0?0:x<0&&y<0?1:x<0?2:3,hgt=4+((x*7+y*13+64)%5)*2+(q===2?Math.max(0,8-d)*3:0),water=(x*x+y*y)%17===3||(q===0&&d>R-2.2&&d<R-1),z=-hgt+(1-k)*-60+(1-k)*120;
    const c=water?'#3a7ab0':[TWFC0[0],TWFC0[1],TWFC0[2],TWFC0[3]][q];g.globalAlpha=k;box(x,y,z-6,1,1,hgt+6,c,.92+((x+y)&1)*.08);
    if(!water&&k>.95&&(x*5+y*3)%7===0)box(x+.3,y+.3,z+hgt,.4,.4,q===2?14:10,q===1?'#c8a060':q===3?'#3a3030':'#2a6a3a');g.globalAlpha=1}};
// 6. i sopravvissuti: rovine, un fuoco, la notte
FSET.tw_rovine=(S2,lt)=>{fFloor(-7,-6,14,12,'#5a5a4a','#545444');for(const[x,y,h]of[[-5,-4,22],[-3,-5,8],[4,-4,16],[5,3,10],[-5,3,26],[2,5,6],[-1,-5,12]]){box(x,y,0,.8,.8,h,'#8a8478');box(x-.1,y-.1,h,1,1,2,'#9a9488')}
  for(let i=0;i<20;i++){const x=-6+((i*3.7)%12),y=-5+((i*5.3)%10);box(x,y,0,.3+(i%3)*.1,.3,1+(i%4),'#6a6458')}
  // il fuoco
  for(let i=0;i<7;i++){const a=i/7*6.283;box(Math.cos(a)*.5-.08,Math.sin(a)*.5-.08,0,.16,.16,1.5,'#7a7a70')}const f=Math.sin(lt*14)*1.2;box(-.15,-.15,1,.3,.3,5+f,'#ff8a2a',1.5);box(-.08,-.08,3,.16,.16,5+f*1.3,'#ffd84a',1.6);
  fGlow(0,0,6,'255,160,60',120,.32);if(typeof nlight==='function')NLS.push([0,0,20,170,'255,170,80',.95])};
// 7. la ricostruzione: le case salgono un cubo alla volta
function twHouseL(k,x0,y0,w,h,wall,roof){const L=[];const tot=w*h*3+w*3;let n=0;const lim=Math.floor(k*tot);
  for(let z=0;z<3;z++)for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(z>0&&x>0&&x<w-1&&y>0&&y<h-1)continue;if(n++>=lim)return L;L.push([x0+x,y0+y,z*8,1,1,8,z===2?shx(wall,.9):wall])}
  for(let s=0;s<3;s++)for(let x=0;x<w;x++){if(n++>=lim)return L;L.push([x0+x,y0+s*.5*(h/3)-.1,24+s*3,1,h-s*(h/3),3,s%2?shx(roof,1.1):roof])}return L}
FSET.tw_ricostruire=(S2,lt)=>{fFloor(-8,-7,16,14,'#6a9a4a','#64924a');for(let i=-7;i<7;i++)box(i,-.5,-.2,1,1,.3,'#9a8a6a');
  const H=[[-6,-5,4,3,'#e0d0b0','#a8402f',0],[1,-5,4,3,'#c8b89a','#3a5a8a',1.6],[-6,2,3,3,'#d8c8a8','#4a6a3a',3.2],[2,2,4,3,'#e8dcc0','#7a3a2a',4.4]];
  for(const[x,y,w,h,wl,rf,d]of H){const k=fSmooth((lt-d)/4);for(const b of twHouseL(k,x,y,w,h,wl,rf))box(b[0],b[1],b[2],b[3],b[4],b[5],b[6]);if(k>0&&k<1){const L=twHouseL(Math.min(1,k+.02),x,y,w,h,wl,rf),c=L[L.length-1];if(c)box(c[0]+.3,c[1]+.3,c[2]+20+Math.sin(lt*8)*4,.4,.4,3,c[6])}}
  for(const[x,y]of[[-1,-1],[5,-1],[-4,1]]){box(x,y,0,.5,.5,8,'#6a4a2a');box(x-.5,y,8,1.5,.3,2,'#6a4a2a')}};
// 8. le fazioni: sei stendardi intorno a una città nuova
FSET.tw_fazioni=(S2,lt)=>{fFloor(-8,-8,16,16,'#7a8a5a','#748454');for(let i=-5;i<=5;i++)for(const s of[-1,1]){box(i,s*5.5,0,1,.6,12,'#9a9284');box(s*5.5,i,0,.6,1,12,'#9a9284')}
  for(const[x,y]of[[-5.5,-5.5],[5,-5.5],[-5.5,5],[5,5]]){box(x-.2,y-.2,0,1.4,1.4,22,'#8a8274');box(x-.3,y-.3,22,1.6,1.6,3,'#a8402f')}
  for(const[x,y,w,h]of[[-3,-3,3,2],[1,-3,2,2],[-3,1,2,3],[1,1,3,2]]){box(x,y,0,w,h,10,'#e0d0b0');box(x-.1,y-.1,10,w+.2,h+.2,4,'#a8402f')}
  const cr=Object.values(typeof TWFCR!=='undefined'?TWFCR:{});for(let i=0;i<6;i++){const a=i/6*6.283-1.57,x=Math.cos(a)*8,y=Math.sin(a)*8,k=fSmooth((lt-.6-i*.6)/1),c=cr[i]||{c1:'#d4af37',c2:'#2a1a0a'};if(k<=0)continue;
    box(x-.08,y-.08,0,.16,.16,70*k,'#5a3a1a');for(let j=0;j<8;j++){const u=Math.sin(lt*4+j*.8+i)*3*(j/8);box(x+.08+j*.16,y-.04,40*k+u,.16,.08,26*k,j===3||j===4?c.c2:c.c1)}fGlow(x,y,60*k,rgbOf(c.c1),40,.25*k)}};
// 9. ciò che non è andato perduto: gli strati della terra e, sotto, gli oggetti del vecchio mondo che brillano
FSET.tw_reperti=(S2,lt)=>{const lay=[['#6a9a4a',6],['#7a5a3a',14],['#6a4a30',16],['#5a5a5a',16],['#3a3a44',18]];let z=0;const LZ=lay.map(([c,h])=>{z-=h;return[c,h,z]}).reverse();
  for(const[c,h,z]of LZ)for(let y=-2;y<=0;y++)for(let x=-5;x<=5;x++)box(x,y,z,1,1,h,shx(c,.9+(((x*7+y*3+40)%4))*.04))
  for(let x=-5;x<=5;x+=2){box(x+.42,-1.58,0,.16,.16,8,'#5a3a1a');box(x+.2,-1.8,8,.6,.6,10+(x&3)*2,'#2a6a3a')}
  const R=[[-3.5,-24,'#c8ccd6','sword'],[-.5,-46,'#ffd84a','crown'],[2.8,-30,'#7a8aa8','shield'],[4.6,-58,'#9fd0ff','gem']];
  for(const[x,zz,c,k]of R){const p=.6+.4*Math.sin(lt*2+x),y=1.02;fGlow(x,y,zz+5,rgbOf(c),46+p*20,.38*p);
    if(k==='sword'){box(x-.08,y,zz,.16,.1,20,c,1.35);box(x-.4,y,zz+5,.8,.12,2,'#d4af37',1.2)}else if(k==='crown'){for(const b of fCrownL(0,FCOL,.9,zz))box(x+b[0],y+b[1]*.25,b[2],b[3],b[4]*.25,b[5],b[6],(b[7]||1)+.15)}
    else if(k==='shield'){box(x-.5,y,zz,1,.1,13,c,1.2);box(x-.12,y-.01,zz+3,.24,.1,7,'#d4af37',1.3)}else{box(x-.2,y,zz,.4,.1,6,c,1.7)}}
  for(let i=0;i<7;i++){const x=-5+i*1.6+Math.sin(lt+i)*.4,u=(lt*.25+i*.17)%1;g.globalAlpha=.5*(1-u);box(x,1.05,-60+u*66,.1,.06,4,'#ffe8a0',1.6);g.globalAlpha=1}};
// 10. tocca a te: l'eroe sulla collina, all'alba
const twHill=(x,y)=>Math.max(0,9-Math.hypot(x,y))*4.5+Math.sin(x*.7)*2;
FSET.tw_alba=(S2,lt)=>{for(let y=-10;y<=10;y++)for(let x=-10;x<=10;x++){const h=twHill(x,y);box(x,y,-6,1,1,6+h,(x+y)&1?'#5a8a3a':'#54823a',.92+((x*3+y+30)%3)*.04)}
  for(const[x,y,h]of[[-6,-2,16],[-5,4,12],[6,-5,18],[4,6,14],[-7,6,10],[7,2,15],[-3,-7,13]]){const z=twHill(x,y);box(x+.35,y+.35,z,.3,.3,h,'#5a3a1a');box(x,y,z+h*.7,1,1,h*1.1,'#2a6a3a');box(x+.15,y+.15,z+h*1.7,.7,.7,h*.6,'#3a7a42')}
  const sun=fSmooth(lt/9);fGlow(-14,-14,40+sun*60,'255,200,120',140,.35*sun)};
const TWSKY=lt=>`rgba(255,${150+Math.round(60*fSmooth(lt/8))},90,${.12+.08*fSmooth(lt/8)})`;
FILMS.tw_intro={n:'Tomorrow · il reset dell\'universo',mus:'tw_reset',L:[
  {d:10,st:'town',dusk:.3,sepia:1,mus:'castello',cam:[[11,15,.9],[9,12,1.05]],drop:['*'],tx:'Mille anni fa la Corona di Voxel teneva insieme Aldoria e il mondo intero: sei gemme, sei terre, un solo cuore che batteva sotto ogni cosa.',
    fx:lt=>twCrownFx(lt,8,7,70)},
  {d:9,set:'tw_rotta',bg:['#0a0612','#2a1030'],stars:1,mus:'tw_reset',cam:[[0,0,1.35],[0,0,1.6]],shake:lt=>lt>2.4&&lt<3.6?6:lt<2.6?lt:0,flash:lt=>lt>2.5&&lt<3.4?1-(lt-2.5)/.9:0,
    tx:'Poi la Corona fu distrutta. Il cuore del mondo si spezzò in un solo istante, e la sua luce tornò all\'origine portando con sé tutto ciò che esisteva.'},
  {d:11,st:'town',dusk:.7,mus:'tw_reset',cam:[[20,24,.95],[16,18,.8]],drop:['*'],tint:lt=>`rgba(225,235,255,${fSmooth((lt-4)/7)*.7})`,
    tx:'Aldoria fu la prima a sparire. Le torri, le case, il porto, il Colosseo: tutto si sciolse cubo dopo cubo e salì verso il cielo, come neve che cade al contrario.',fx:lt=>twDissolveFx(lt)},
  {d:10,set:'tw_vuoto',bg:['#02020a','#0a0820'],stars:1,mus:'tw_reset',cam:[[0,0,.8],[0,0,1.05]],tx:'Per un tempo che nessuno sa misurare non ci fu nulla. Solo i cubi del vecchio mondo che vagavano nel buio, in una spirale lenta, in attesa.'},
  {d:11,set:'tw_rinascita',bg:['#1a2a4a','#6a90b8'],mus:'tw_reset',cam:[[0,0,.95],[0,0,.82]],flash:lt=>lt<.6?1-lt/.6:0,
    tx:'Poi l\'universo ricominciò. I cubi ricaddero e si ricomposero, ma in un ordine nuovo: mari spostati, montagne nate dal nulla, deserti, ghiacci e lande di cenere mai viste prima.'},
  {d:11,set:'tw_rovine',bg:['#05060f','#1a2038'],stars:1,mus:'tw_saga',cam:[[0,1,1.4],[0,0,1.6]],tint:'rgba(20,20,60,.25)',
    act:[fA('s1',{n:'fuggiasco',go:[[-9,3],[-1.4,.9]],v:1.2,t0:.4}),fA('s2',{n:'fuggiasca',go:[[-9,4],[-.8,1.6]],v:1.1,t0:1}),fA('s3',{n:'bimbo1',go:[[9,2],[1.2,1.2]],v:1.3,t0:1.6}),fA('s4',{n:'muratore',go:[[8,-3],[1.4,-.6]],v:1,t0:2.2})],
    tx:'Pochi sopravvissero. Si svegliarono in terre sconosciute, senza nomi e senza mappe, con il ricordo di Aldoria che sbiadiva come un sogno al mattino. E cominciarono a ricostruire.'},
  {d:10,set:'tw_ricostruire',bg:['#6a9ad0','#e8f0e0'],mus:'tw_saga',cam:[[-1,-1,1.05],[0,0,1.15]],
    act:[fA('m1',{n:'muratore',p:[-1,1],f:'N',an:'hammer'}),fA('m2',{n:'fuggiasca',go:[[-7,0],[4,0]],v:.8,t0:.6}),fA('m3',{n:'bimbo1',go:[[6,1],[-3,1]],v:1,t0:2})],
    tx:'Pietra dopo pietra sorsero villaggi, borghi lungo i sentieri, città con le mura. Passarono mille anni.'},
  {d:10,set:'tw_fazioni',bg:['#4a6aa0','#c8d8e8'],mus:'tw_saga',cam:[[0,0,.82],[0,0,.95]],
    tx:'Oggi le fazioni si contendono le terre e i loro stendardi sventolano sulle città. Di Aldoria restano solo leggende, che i vecchi raccontano accanto al fuoco.'},
  {d:10,set:'tw_reperti',bg:['#1a120a','#3a2a1a'],mus:'tw_saga',cam:[[1.6,1.6,1.25],[1.6,1.6,1.4]],
    tx:'Ma forse non tutto è andato perduto. Nelle rovine e nei sotterranei, sotto mille anni di terra, qualcosa del vecchio mondo brilla ancora e aspetta qualcuno che lo trovi.'},
  {d:11,set:'tw_alba',bg:['#2a2a5a','#ff9a5a'],mus:'tw_saga',cam:[[0,2,1.1],[0,0,1.45]],tint:TWSKY,title:'TOMORROW',sub:'Ricostruisci ciò che è andato perduto',big:1,tt:5,
    act:[fA('eroe',{hero:1,p:[0,0],z:40.5,f:'N'})],
    over:lt=>{const k=fSmooth(lt/9),y=H*(.62-.2*k),g2=g.createRadialGradient(W*.5,y,0,W*.5,y,W*.6);g2.addColorStop(0,`rgba(255,220,150,${.55*k})`);g2.addColorStop(1,'rgba(255,160,80,0)');g.fillStyle=g2;g.fillRect(0,0,W,H)},
    tx:'Ora tocca a te. Ricostruisci ciò che è andato perduto.'}]};
// il filmato parte la prima volta che si comincia un mondo di Tomorrow
const TWFK0='voxelia_twfilm';
const _owGo723=owGo;owGo=function(d,s){if(!s&&SET.film!==0&&!LS.get(TWFK0,0)){LS.set(TWFK0,1);const nm=$('ownm')?$('ownm').value:'',rc=$('owrc')?$('owrc').value:'';filmPlay('tw_intro',()=>{if($('ownm'))$('ownm').value=nm;if($('owrc'))$('owrc').value=rc;_owGo723(d,s)});return}_owGo723(d,s)};
function twFilmAgain(){filmPlay('tw_intro',()=>{if(!started){$('menu').style.display='flex';inMenu=1;music('menu')}})}
if(typeof owMenu==='function'){const _om723=owMenu;owMenu=function(){_om723();const el=$('mowb');if(el&&!el.querySelector('.twfa')){const b=document.createElement('button');b.className='mbtn twfa';b.innerHTML='<span><b>🎬 Il reset dell\'universo</b><small>Rivedi il filmato di Tomorrow</small></span>';b.onclick=twFilmAgain;el.appendChild(b)}}}
/* ---- i cimeli di Aldoria ---- */
const CIM=[
  {id:'lama',n:'Lama di Aldric il Primo',s:'w',st:'La spada con cui fu fondata Aldoria. La lama ricorda ancora il mare.'},
  {id:'scudo',n:'Scudo del Faro',s:'s',st:'Lo scudo dei guardiani del faro di Aldoria: la luce non si è mai spenta del tutto.'},
  {id:'elmo',n:'Elmo della Guardia Reale',s:'h',st:'L\'elmo della guardia del castello, ammaccato dalle battaglie di mille anni fa.'},
  {id:'corazza',n:'Corazza del Colosseo',s:'c',st:'Il campione del Colosseo la vestiva nelle sfide della fossa. Porta ancora i segni dei colpi.'},
  {id:'mazza',n:'Mazza di Borin il Fabbro',s:'w',st:'Il martello del fabbro più famoso di Aldoria. Pesa come una promessa.'},
  {id:'diadema',n:'Diadema della Regina Elara',s:'h',st:'Il diadema della regina. Chi lo porta sente una voce lontana che canta.'},
  {id:'fram',n:'Frammento della Corona',st:'Una delle sei gemme della Corona di Voxel, spenta e fredda. O forse soltanto addormentata.'},
  {id:'chiave',n:'Chiave di Aldoria Vecchia',st:'La chiave del quartiere murato. La porta che apriva non esiste più.'},
  {id:'libro',n:'Diario di Malakar',st:'Le pagine del fratello del re. L\'ultima dice: «La verità è sotto le strade».'},
  {id:'campana',n:'Campana del Tempio',st:'Una piccola campana del tempio di Aldoria. Suona da sola quando c\'è un pericolo.'},
  {id:'bussola',n:'Bussola dell\'Ammiraglio',st:'Punta sempre verso un luogo che sulle mappe di oggi non c\'è.'},
  {id:'gatto',n:'Collare di Briciola',st:'Il collare del gatto più amato di Aldoria. Qualcuno, mille anni fa, lo ha ritrovato.'}];
function cimFix(){if(P&&P.tw){P.tw.cim=P.tw.cim||{}}}
function cimGive(why){cimFix();const left=CIM.filter(c=>!P.tw.cim[c.id]);if(!left.length)return false;const c=left[Math.floor(Math.random()*left.length)];P.tw.cim[c.id]=gDay();
  if(c.s){const it=item(Math.max(P.lv+2,8),3,c.s);it.n=c.n;it.lore=c.st;it.cim=c.id;if(c.s==='w')it.cr=Math.max(it.cr||0,12);if(P.inv.length<INV)P.inv.push(it);else ents.push({k:'dr',px:P.px,py:P.py,it});if(cineOK())itemFly(it)}
  else{P.rep=P.rep||[];P.rep.push(repFix({n:c.n,d:c.st,r:3,p:600}))}
  jingle([60,64,67,72,76,79,84,88],.1,'triangle');banner('Un cimelio di Aldoria!',c.n+' è sopravvissuto al reset · '+why,'corona');save();return true}
// si trovano nei forzieri di Tomorrow (di più in quelli preziosi) e sui boss dei dungeon
const _act723=act;act=function(e){const isCh=e&&e.k==='ch'&&twOn()&&ents.includes(e);_act723(e);if(isCh&&!ents.includes(e)&&Math.random()<(e.rich?.1:.035))cimGive('era in un forziere')};
const _kill723=kill;kill=function(e){const ok=e&&e.boss&&e.k==='en'&&twOn()&&ZZ&&ZZ.dg&&ents.includes(e);_kill723(e);if(ok&&Math.random()<.25)cimGive('lo custodiva '+(e.n||'il boss'))};
function cimHTML(){cimFix();const n=Object.keys(P.tw.cim).length;return`<h3>🏺 Cimeli di Aldoria</h3><p class="mu">${n} di ${CIM.length} ritrovati. Sono sopravvissuti al reset nelle rovine, nei forzieri e nei sotterranei di Tomorrow.</p>
  <div class="cml">${CIM.map(c=>{const f=P.tw.cim[c.id];return`<div class="cmc${f?' on':''}"><b>${f?esc(c.n):'???'}</b><small>${f?esc(c.st)+' · trovato il giorno '+f:'Un oggetto del vecchio mondo, ancora perduto.'}</small><i>${c.s?{w:'arma',s:'scudo',h:'elmo',c:'armatura'}[c.s]+' leggendaria':'reperto'}</i></div>`}).join('')}</div><button onclick="cl()">Chiudi</button>`}
const _pn723=pn;pn=function(m,arg){if(m==='cimeli'&&twOn()){edPanel('cimeli',cimHTML());return}_pn723(m,arg)};
const _ivDetail723=ivDetail;ivDetail=function(){let h=_ivDetail723();try{const f=ivFind(IVSEL);if(f&&f.it&&f.it.lore)h+=`<p class="cmlore">🏺 <i>${esc(f.it.lore)}</i></p>`}catch(_){}return h};
if(typeof pauseHTML==='function'){const _ph723=pauseHTML;pauseHTML=function(){let h=_ph723();if(twOn())h=h.replace('<h4>Il tuo mondo</h4>','<h4>Il tuo mondo</h4><button class="psb" onclick="pn(\'cimeli\')">🏺<span><b>Cimeli di Aldoria</b><small>Gli oggetti del vecchio mondo che hai ritrovato</small></span></button>');return h}}
document.head.insertAdjacentHTML('beforeend',`<style>#pn[data-m="cimeli"]{width:min(620px,95vw)}.cml{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:7px;margin:8px 0}.cmc{padding:8px 10px;border-radius:9px;border:1px dashed #ffffff33;background:#0002;display:flex;flex-direction:column;gap:3px}.cmc.on{border:1px solid #ffae2b;background:rgba(255,174,43,.08)}.cmc small{opacity:.8}.cmc i{font-size:11px;color:#ffd84a;font-style:normal}.cmlore{margin:6px 0;color:#ffe0a0}</style>`);
if(typeof ETRKN!=='undefined')Object.assign(ETRKN,{tw_reset:'Il reset dell\'universo',tw_saga:'Tomorrow'});
