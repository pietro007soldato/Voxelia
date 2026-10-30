/* ================= disegno del mondo ================= */
const winC0=(x,y)=>hh(x+.3,y+.7)>.5?'#ffd27a':'#6a8ab0',winC=(x,y)=>SET.ultra&&NK<.5&&Math.sin(t*.8-(x+y)*.4)>.975?'#ffffff':NK>.3&&winC0(x,y)==='#ffd27a'?'#ffe9a8':winC0(x,y);
let WMODE=0;
function floor(x,y,c,h){const z=ZZ;if(z&&z.boat&&BOATA.has(y*N+x)){deckTile(x,y,h);return}if(PIERD.size&&PIERD.has(y*N+x)){pierTile(x,y,h);return}
  if(c===2){if(DEC[y][x]==='ɷ'){if(WMODE!==1)fountW(x,y);return}const lava=z.pool==='#ff6a1a',col=z.pool||(Zk==='peaks'?'#bfe3f5':'#3b86d6');if(WMODE!==2){box(x,y,-9,1,1,6,col,(lava?1.05:.9)+Math.sin(t*2+x+y)*(Zk==='peaks'?.02:.08));if(SET.ultra&&g===G0)waterFx(x,y,lava)}if(WMODE===1)return;
    if(DEC[y][x]==='^'){const b2=Math.sin(t*2+x)*1.5;box(x+.4,y+.4,-3+b2,.2,.2,6,'#e8483a');box(x+.42,y+.42,3+b2,.16,.16,3,'#ffffff')}
    if(DEC[y][x]==='O'){box(x+.1,y-.3,-3,.8,1.6,6,'#7a5a3a');box(x+.45,y+.3,3,.08,.08,26,'#5a4a3a');box(x+.5,y,9,.04,.7,16,'#eeeeee')}
    if((Zk==='town'&&x===35&&y===35)||DEC[y][x]==='U'){box(x+.6,y+.6,-3,.8,.8,10,'#a8a8b0');box(x+.8,y+.8,7,.4,.4,16,'#c8c8d0');box(x+.75,y+.75,23,.5,.5,6,'#d4af37')}return}
  if(c===8){box(x,y,-6,1,1,6,'#a8303a',.95+h*.08);return}
  if(c===4){const pier=(Zk==='town'&&y>=64)||DEC[y][x]==='~',rc=z.rd;if(pier){pierTile(x,y,h);return}box(x,y,-6,1,1,6,pier?((x+y)&1?'#8a6a42':'#7e6040'):rc?((x+y)&1?rc[0]:rc[1]):((x+y)&1?'#a89a84':'#9e917c'),.92+h*.12);if(pier&&z.dist&&(x+y)%5===0)box(x+.05,y+.05,-12,.12,.12,8,'#5a4a32');return}
  let a=z.a,b=z.b;if(z.int){a=z.fl;b=z.fl2}else if(Zk==='arena'){const c2=arFloorC(x,y);a=c2[0];b=c2[1]}
  box(x,y,-6,1,1,6,(x+y)&1?a:b,.92+h*.16);
  if(Zk==='town'&&h>.93)box(x+.3,y+.3,0,.1,.1,3,h>.965?'#ffd84a':'#e86a8a');
  else if(z.dg&&h>.95)box(x+.2,y+.5,0,.3,.12,2,'#d8d4c8');
  if(SET.ultra)floorDetail(x,y,z)}
function wall(x,y,h){const z=ZZ;
  if(z.int){const fr=x===N-1||y===N-1;box(x,y,0,1,1,fr?6:44,z.wall,.9+h*.08);if(!fr&&h>.75&&(x===0)!==(y===0)){if(y===0)box(x+.25,y+.98,20,.5,.04,12,'#a83a3a');else box(x+.98,y+.25,20,.04,.5,12,'#3a6aa8')}return}
  if(z.dist){const c=z.wl;if(GT.has(x+','+y)){const rc=z.rd||['#a89a84','#9e917c'];box(x,y,-6,1,1,6,(x+y)&1?rc[0]:rc[1],.92+h*.12);box(x,y,z.wh-4,1,1,10,c,.85);return}if(z.ruin){const r=h>.3?8+h*24:4;box(x,y,0,1,1,r,c,.8+h*.15);if(h>.6)box(x+.2,y+.2,r,.5,.5,4,c,.7);return}box(x,y,0,1,1,z.wh,c,.9+h*.1);if((x+y)%2===0)box(x+.2,y+.2,z.wh,.6,.6,5,c,.95);return}
  if(Zk==='town'){const gate=(y===0&&x>=34&&x<=37)||((x===N-1||x===0)&&y>=34&&y<=37)||(y===0&&x>=16&&x<=17)||(x===N-1&&y>=16&&y<=17)||(x===0&&y>=52&&y<=53)||(y===N-1&&x>=53&&x<=56),tw=(y===0&&(x===33||x===38||x===15||x===18))||((x===N-1||x===0)&&(y===33||y===38))||(x===N-1&&(y===15||y===18))||(x===0&&(y===51||y===54))||(y===N-1&&(x===52||x===57));
    if(gate){box(x,y,-6,1,1,6,(x+y)&1?'#a89a84':'#9e917c',.92+h*.12);box(x,y,26,1,1,10,'#7b7f89');return}if(tw){box(x-.1,y-.1,0,1.2,1.2,46,'#7b7f89');box(x-.15,y-.15,46,1.3,1.3,5,'#6b6f79');return}
    box(x,y,0,1,1,30,'#8b8f99',.9+h*.1);if((x+y)%2===0)box(x+.2,y+.2,30,.6,.6,6,'#8b8f99',.95);return}
  if(Zk==='arena'){arWall(x,y,h);return}
  if(z.th==='forest'){box(x+.35,y+.35,0,.3,.3,14,'#6b4a2b');box(x+.05,y+.05,12,.9,.9,12,z.o,.85+h*.3);box(x+.25,y+.25,24,.5,.5,8,z.o,1.1);return}
  if(z.th==='desert'){h<.5?(box(x+.38,y+.38,0,.24,.24,18+h*30,z.o),box(x+.15,y+.42,10,.25,.14,6,z.o)):box(x+.1,y+.1,0,.8,.8,8+h*14,'#a88c5a');return}
  if(z.th==='peaks'){if(h<.55){box(x+.4,y+.4,0,.2,.2,8,'#5a3a2a');box(x+.1,y+.1,8,.8,.8,10,z.o);box(x+.2,y+.2,18,.6,.6,9,z.o,1.1);box(x+.3,y+.3,27,.4,.4,8,z.o,1.2);box(x+.38,y+.38,35,.24,.24,4,'#f4f8fc')}
    else{box(x+.05,y+.05,0,.9,.9,10+h*16,'#7a8a9a');box(x+.1,y+.1,10+h*16,.8,.8,3,'#f4f8fc')}return}
  box(x,y,0,1,1,36+h*10,z.o,.95+h*.1);if(z.dg&&h>.85)box(x+.97,y+.3,14,.05,.4,10,z.o,.7);if(z.dg)wallOrn(x,y,h,z)}
function bld(x,y,h){const b=TB[BM[y][x]];if(!b)return;if(b.st==='lh'){lhouse(x,y,b);return}const e=Math.min(x-b.x,b.x+b.w-1-x,y-b.y,b.y+b.h-1-y),fy=y===b.y+b.h-1,fx=x===b.x+b.w-1,corner=(x===b.x||fx)&&(y===b.y||fy);
  let ht=b.ht;if(b.st==='cas'&&corner)ht+=18;box(x,y,0,1,1,ht,b.wall,.88+h*.12);
  if(b.st!=='col'){if(fy&&x!==b.dx&&h>.3){box(x+.3,y+.97,ht*.35,.4,.06,ht*.3,'#3a2a1a');box(x+.34,y+.99,ht*.35+1,.32,.04,ht*.3-2,winC(x,y));if(NK>.02&&winC0(x,y)==='#ffd27a')nlight(x+.5,y+1.1,ht*.5,64,'255,200,120',.42,1)}
    if(fx&&!fy&&h>.3){box(x+.97,y+.3,ht*.35,.06,.4,ht*.3,'#3a2a1a');box(x+.99,y+.34,ht*.35+1,.04,.32,ht*.3-2,winC(x,y));if(NK>.02&&winC0(x,y)==='#ffd27a')nlight(x+1.1,y+.5,ht*.5,64,'255,200,120',.42,1)}}
  if(b.st==='col'){if(fy&&x%2===0)box(x+.25,y+.97,0,.5,.06,ht*.55,'#4a3a2a');if(fx&&y%2===0)box(x+.97,y+.25,0,.06,.5,ht*.55,'#4a3a2a');
    if(e===0&&(x+y)%2===0)box(x+.2,y+.2,ht,.6,.6,8,b.wall);if(corner){box(x+.45,y+.45,ht,.06,.06,24,'#554');box(x+.51,y+.45,ht+15,.3,.04,8,'#c0392b')}}
  else if(b.st==='cas'){if(e===0&&(x+y)%2===0)box(x+.2,y+.2,ht,.6,.6,8,b.wall);if(corner){box(x+.1,y+.1,ht,.8,.8,6,'#3a4a7a');box(x+.25,y+.25,ht+6,.5,.5,8,'#3a4a7a');box(x+.4,y+.4,ht+14,.2,.2,8,'#3a4a7a')}
    if(fy&&x===b.x+3)box(x+.3,y+.98,ht-22,.4,.04,16,'#a8303a')}
  else{bldDetail(x,y,h,b,ht,fy,fx);box(x-.04,y-.04,ht,1.08,1.08,e*7+6,b.roof,.95+((x+y)&1)*.06);if(b.smoke&&x===b.x+1&&y===b.y+1){box(x+.25,y+.25,ht+e*7+6,.4,.4,14,'#5a4a4a');smokeFx(x,y,ht+e*7+20)}if(b.st==='motel'&&fy){if(x!==b.dx&&h>.15){box(x+.3,y+.97,ht*.68,.4,.06,ht*.18,'#3a2a1a');box(x+.34,y+.99,ht*.68+1,.32,.04,ht*.18-2,winC(x,y))}if(x===b.dx+1){const on=Math.sin(t*3)>-.6;box(x-.6,y+1.02,ht*.42,1.4,.05,7,on?'#ff4a8a':'#5a2a3a',on?1.3:1);if(on)nlight(x,y+1.1,ht*.45,110,'255,80,140',.8)}}if(b.st==='mill'&&fy&&x===b.x+(b.w>>1)&&!millOK())millBroken(x,y,b,ht);else if(b.st==='mill'&&fy&&x===b.x+(b.w>>1)){const a=t*1.2,zc=ht*.75;for(let k=0;k<4;k++){const an=a+k*1.5708;const nq=Math.round(b.w*1.2),sc=b.w>6?.32:.22,sz=b.w>6?10:7;for(let q=1;q<=nq;q++)box(x+.5+Math.cos(an)*q*sc-.08,y+1.06,zc+Math.sin(an)*q*sz-3,.16,.05,b.w>6?7:4,q>2?'#efe6d0':'#7a5a3a')}box(x+.42,y+1.02,zc-3,.16,.06,6,'#5a3a2a')}
    if((b.st==='obs'||b.st==='mun')&&x===b.x+(b.w>>1)&&y===b.y+(b.h>>1)){const rh=ht+e*7+6;
      if(b.st==='obs'){box(x+.1,y+.1,rh-2,.8,.8,10,b.wall);box(x+.05,y+.05,rh+8,.9,.9,6,'#4a5a8a');box(x+.18,y+.18,rh+14,.64,.64,5,'#5a6a9a');box(x+.32,y+.32,rh+19,.36,.36,3,'#6a7aaa');box(x+.62,y+.36,rh+11,.38,.16,5,'#b8963a');box(x+.92,y+.38,rh+12,.06,.12,3,'#d4af37')}
      else{box(x+.15,y+.15,rh-6,.7,.7,28,b.wall);box(x+.3,y+.86,rh+6,.4,.02,10,'#f4f0e0');box(x+.48,y+.87,rh+11,.04,.02,4,'#2a2a2a');box(x+.48,y+.87,rh+11,.12,.02,1,'#2a2a2a');box(x+.1,y+.1,rh+22,.8,.8,4,b.roof);box(x+.25,y+.25,rh+26,.5,.5,6,b.roof);box(x+.42,y+.42,rh+32,.16,.16,8,'#d4af37')}}
    if(b.st==='tem'&&e===Math.floor((Math.min(b.w,b.h)-1)/2)&&x===b.x+(b.w>>1)){box(x+.45,y+.45,ht+e*7+6,.1,.1,14,'#d4af37');box(x+.3,y+.45,ht+e*7+14,.4,.1,3,'#d4af37')}}}
function lhouse(x,y,b){const n=Math.round(b.ht/12);for(let i=0;i<n;i++){box(x,y,i*12,1,1,12,i%2?'#c0392b':'#f0ece4',.9+hh(x,y)*.1);if(y===b.y+b.h-1&&x===b.x+(b.w>>1)&&i%2===0&&i>0)box(x+.35,y+.98,i*12+3,.3,.04,6,'#3a4a6a')}
  if(x===b.x+b.w-1&&y===b.y+b.h-1){const z0=n*12,cx=b.x+b.w/2,cy=b.y+b.h/2;box(b.x-.15,b.y-.15,z0,b.w+.3,b.h+.3,3,'#3a3a3a');box(b.x+.3,b.y+.3,z0+3,b.w-.6,b.h-.6,12,'#ffe08a',1.1+Math.sin(t*3)*.1);
    box(b.x+.1,b.y+.1,z0+15,b.w-.2,b.h-.2,4,'#c0392b');box(cx-.35,cy-.35,z0+19,.7,.7,6,'#c0392b');box(cx-.05,cy-.05,z0+25,.1,.1,8,'#3a3a3a');if(SET.ultra)GLOW.push([cx,cy,z0+9,110,'255,224,140',.32]);nlight(cx,cy,z0+9,300,'255,220,140',1)}}
function dec(x,y,c,h){if(ZZ&&ZZ.int&&DUP52.includes(c)&&decInt52(x,y,c,h))return;if(c==='ɸ'){fountRim(x,y,h);return}if(c==='ʍ'){stallD(x,y,h);return}if(c==='s'&&!MKO){stallClosed(x,y);return}if(decRooms(x,y,c,h))return;if(decTruth(x,y,c))return;if(decWorld(x,y,c,h))return;if(decSea(x,y,c,h))return;if(decWar(x,y,c,h))return;if(decCine(x,y,c,h))return;switch(c){
  case '¢':box(x+.4,y+.4,0,.2,.2,22+h*10,'#4e9a47');box(x+.18,y+.44,8,.22,.12,4,'#4e9a47');box(x+.18,y+.44,8,.08,.12,10,'#4e9a47');box(x+.6,y+.44,12,.22,.12,4,'#4e9a47');box(x+.74,y+.44,12,.08,.12,9,'#4e9a47');break;
  case 'ß':box(x+.02,y+.15,0,.96,.7,6,'#b8a070',.9+h*.15);box(x+.08,y+.2,6,.84,.6,5,'#a89060');break;
  case '¤':for(let i=0;i<3;i++)box(x+.1+i*.38,y+.45,0,.05,.05,10,'#4a3a2a');box(x,y+.46,4,1,.03,1,'#8a8a8a');box(x,y+.46,8,1,.03,1,'#8a8a8a');break;
  case 'Ŧ':{const w=Math.sin(t*3+x)*.05;box(x+.45,y+.45,0,.1,.1,40,'#5a4a3a');box(x+.5,y+.42+w,22,.04,.14,16,'#2a4a9a');box(x+.5,y+.56+w,22,.04,.14,16,'#f0f0f0');box(x+.5,y+.7+w,22,.04,.14,16,'#c0392b');break}
  case '·':box(x+.15,y+.15,-.5,.7,.7,.6,'#3a3024',.9);break;
  case 'ŵ':{const c2=(x*7+y*3)%3;box(x+.15+c2*.2,y+.2,0,.08,.08,3+c2,'#5a7a3a');box(x+.55,y+.5+c2*.1,0,.08,.08,4,'#6a8a42');box(x+.35,y+.7,0,.06,.06,2.5,'#4a6a32');break}
  case 'Ŗ':{const hh=8+((x*13+y*7)%5)*5,wc=(x+y)&1?'#b8a88a':'#a8987a';box(x,y,0,1,1,hh,wc,.85+h*.15);box(x+.45,y,0,.1,1,hh,'#4a3424');box(x,y,hh-2,1,1,2,'#2a2420');if((x*3+y)%4===0)box(x+.2,y+.2,hh,.3,.3,3,'#4a6a32');break}
  case 'ƒ':{box(x+.1,y+.1,0,.8,.8,4,'#3a2a20');const fl=1+Math.sin(t*11+x*3)*.18;box(x+.25,y+.25,4,.5,.5,8*fl,'#ff7a2a',1.3);box(x+.35,y+.35,8,.3,.3,8*fl,'#ffd04a',1.4);nlight(x+.5,y+.5,10,110,'255,140,60',.9);if(SET.ultra)GLOW.push([x+.5,y+.5,10,46,'255,140,60',.3]);if(SET.part&&Math.random()<.05)sparks(x+.5,y+.5,1,['#ffb04a'],25);break}
  case '≠':box(x+.1,y+.35,0,.85,.2,3,'#2a1e18');box(x+.2,y+.1,2,.2,.8,3,'#3a2a20');break;
  case 'ç':box(x,y,-.4,1,1,.5,'#2a2620',.9);if((x+y)%3===0)box(x+.3,y+.3,0,.2,.2,1.5,'#4a4438');break;
  case 'č':box(x,y,-.4,1,1,.5,'#3a3628',.9);break;
  case 'ø':box(x+.1,y+.45,-.4,.8,.1,.5,'#8a1a1a',1.1);box(x+.45,y+.1,-.4,.1,.8,.5,'#8a1a1a',1.1);break;
  case 'Ā':box(x+.05,y+.15,0,.9,.7,12,'#3a3434');box(x,y+.1,12,1,.8,2,'#2a2424');box(x+.3,y+.3,14,.4,.3,2,'#6a2a2a');box(x+.42,y+.15,14,.06,.06,6,'#f4ecd4');nlight(x+.5,y+.5,16,90,'255,120,80',.6);break;
  case 'ğ':box(x+.2,y+.2,0,.6,.6,8,'#3a3a40');box(x+.25,y+.25,8,.5,.5,24,'#2a2a30');box(x+.3,y+.3,32,.4,.4,9,'#222228');box(x+.36,y+.66,34,.28,.04,5,'#0a0a0a');break;
  case 'ċ':for(let i=0;i<3;i++){const cx2=x+.25+i*.22,cy2=y+.3+(i%2)*.25,hh=5+i*2;box(cx2,cy2,0,.08,.08,hh,'#efe6d0');box(cx2+.02,cy2+.02,hh,.04,.04,2+Math.sin(t*9+i)*.6,'#ffcc55',1.5)}nlight(x+.5,y+.5,8,70,'255,190,110',.7);break;
  case 'ë':box(x+.1,y+.85,8,.8,.08,30,'#3a0a0a');box(x+.3,y+.94,24,.4,.02,8,'#e8e0c8');box(x+.43,y+.95,26,.14,.02,4,'#0a0a0a');break;
  case 'ж':box(x+.05,y+.45,0,.08,.08,28,'#4a3a32');box(x+.87,y+.45,0,.08,.08,28,'#4a3a32');for(let i=0;i<4;i++)box(x+.05,y+.47,4+i*6,.9,.02,.8,'#6a5a52',.8);for(let i=0;i<5;i++)box(x+.08+i*.2,y+.47,0,.02,.02,26,'#6a5a52',.8);break;
  case '¥':box(x+.3,y+.3,0,.4,.4,60,'#5a3a2a',.8+h*.2);box(x+.26,y+.26,20,.48,.48,3,'#3a2a20');box(x+.26,y+.26,42,.48,.48,3,'#3a2a20');break;
  case 'ш':box(x+.1+h*.2,y+.15,-.5,.5+h*.3,.4,.6,'#4a0a08',.8);break;
  case 'Ω':box(x+.42,y+.42,0,.16,.16,16,'#5a3a1a');for(let i=0;i<8;i++){const a=i*.785+t*.2;box(x+.5+Math.cos(a)*.32-.04,y+.46,22+Math.sin(a)*10,.08,.06,3,'#8a5a2a')}box(x+.44,y+.44,20,.12,.06,4,'#d4af37');break;
  case 'ł':box(x+.45,y+.45,0,.1,.1,20,'#3a2a1a');box(x+.36,y+.36,20,.28,.28,8,'#ffd890',1.2+Math.sin(t*6+x)*.08);box(x+.34,y+.34,28,.32,.32,2,'#3a2a1a');nlight(x+.5,y+.5,24,130,'255,200,120',.8);if(SET.ultra)GLOW.push([x+.5,y+.5,24,40,'255,200,120',.25]);break;
  case '¶':{const w=Math.sin(t*3+x)*.06;box(x+.45,y+.45,0,.1,.1,44,'#3a2a1a');box(x+.5,y+.42+w,26,.04,.5,16,'#141414');box(x+.52,y+.6+w,32,.03,.12,4,'#f0f0f0');break}
  case 'Ø':box(x+.1,y+.15,0,.8,.7,6,'#d4af37',1.15);box(x+.25,y+.3,6,.5,.4,5,'#e8c54a',1.2);box(x+.4,y+.4,11,.2,.2,3,'#fff2a0',1.3);if(SET.ultra)GLOW.push([x+.5,y+.5,8,36,'255,210,90',.25]);break;
  case '§':{const w=Math.sin(t*3+x)*.06;box(x+.45,y+.45,0,.1,.1,40,'#5a4a3a');box(x+.5,y+.42+w,22,.04,.4,16,'#2a5a9a');box(x+.5,y+.42+w*1.6,26,.04,.36,4,'#d4af37');box(x+.4,y+.4,40,.2,.2,3,'#d4af37');break}
  case 'z':box(x+.05,y+.05,0,.9,.9,8,'#8a8a8a');box(x+.15,y+.15,8,.7,.7,6,'#9a9a9a');box(x+.45,y+.45,14,.1,.1,10,'#6b4a2b');break;
  case 'i':box(x+.15,y+.2,0,.3,.3,10,'#e8e0c8');box(x+.55,y+.4,0,.3,.3,9,'#e0d8c0');box(x+.35,y+.15,9,.3,.3,8,'#ece4cc');break;
  case 'J':box(x+.25,y+.3,0,.5,.4,6,'#5a3a1a');box(x+.1,y+.4,6,.8,.2,5,'#3a3a3a');break;
  case 'I':box(x+.35,y+.35,0,.3,.3,44,'#6b4a2b');break;
  case 'H':box(x+.1,y+.15,0,.8,.7,8,'#8a6a42');box(x+.15,y+.2,8,.25,.15,2,'#9ab4c8');box(x+.5,y+.45,8,.3,.15,2,'#c8a07a');box(x+.2,y+.55,8,.25,.15,2,'#b8c8d8');break;
  case '&':box(x+.45,y+.4,0,.1,.2,18,'#4a4a52');box(x+.25,y+.4,0,.5,.2,4,'#4a4a52');box(x+.38,y+.4,16,.24,.2,3,'#4a4a52');break;
  case '@':box(x+.2,y+.2,0,.6,.6,4,'#c8b080');box(x+.32,y+.32,4,.36,.36,2,'#b89a68');break;
  case '$':box(x+.05,y+.15,6,.9,.7,12,'#3a2a5a');box(x,y+.1,18,1,.8,2,'#d4af37');box(x+.1,y+.1,0,.2,.06,8,'#2a2a2a');box(x+.7,y+.1,0,.2,.06,8,'#2a2a2a');box(x+.1,y+.84,0,.2,.06,8,'#2a2a2a');box(x+.7,y+.84,0,.2,.06,8,'#2a2a2a');box(x+.3,y+.86,9,.4,.04,6,'#ffe08a');break;
  case '+':box(x+.25,y+.25,0,.5,.5,4,'#6b4a2b');box(x+.28,y+.28,4,.44,.44,12,'#e8b84a');box(x+.25,y+.25,16,.5,.5,3,'#a0702a');break;
  case ':':box(x+.05,y+.25,0,.9,.5,6,'#7a5a3a');box(x+.1,y+.3,4,.8,.4,2,'#3b86d6');break;
  case '{':box(x+.3,y+.35,0,.25,.22,5,'#e8e4d8');box(x+.55,y+.3,0,.3,.08,2,'#d8d4c8');box(x+.2,y+.6,0,.35,.08,2,'#d8d4c8');break;
  case ',':box(x+.25,y+.25,0,.5,.5,3,'#4a3a2a');box(x+.35,y+.35,3,.3,.3,6+Math.sin(t*10+x)*2,'#ff8a2a',1.2);if(SET.ultra)GLOW.push([x+.5,y+.5,8,50,'255,140,60',.3]);nlight(x+.5,y+.5,8,160,'255,140,60',.9);break;
  case ';':box(x+.05,y+.1,0,.9,.8,10,'#7a6a4a');box(x+.2,y+.2,10,.6,.6,6,'#6a5a3a');box(x+.42,y+.85,0,.16,.06,8,'#2a2a1a');break;
  case 'g':{const s=Math.sin(t*1.6+x*.7+y*.4)*.04;box(x+.08,y+.08,0,.84,.84,9,'#c9a83a',.9+h*.15);box(x+.12+s,y+.12,9,.76,.76,3,'#e8cc5a',1+h*.1);break}
  case 'q':box(x+.15,y+.15,0,.3,.3,5,'#5aa03a');box(x+.55,y+.5,0,.3,.3,5,'#62a842');box(x+.2,y+.6,0,.25,.25,4,'#4a9032');break;
  case 'v':box(x+.45,y+.1,0,.1,.1,18,'#6b4a2b');box(x+.45,y+.82,0,.1,.1,18,'#6b4a2b');box(x+.4,y+.05,8,.2,.9,10,'#4f8a3a',.9+h*.2);if(h>.4)box(x+.36,y+.3+h*.3,6,.12,.12,5,'#6a2a6a');break;
  case 'a':{const k=h>.5?'#3f7a32':'#4a8a3a';box(x+.4,y+.4,0,.2,.2,12,'#6b4a2b');box(x+.1,y+.1,10,.8,.8,12,k,.9+h*.2);box(x+.25,y+.25,22,.5,.5,7,k,1.1);box(x+.2,y+.86,14,.1,.06,4,'#d03a2a');box(x+.86,y+.4,16,.06,.1,4,'#d03a2a');box(x+.6,y+.86,18,.1,.06,4,'#d03a2a');break}
  case 'y':box(x+.1,y+.15,0,.8,.7,12,'#d8b84a',.9+h*.1);box(x+.15,y+.2,12,.7,.6,4,'#e6c85a');break;
  case 'L':box(x+.1,y+.12,0,.8,.2,6,'#8a5a32');box(x+.1,y+.4,0,.8,.2,6,'#7a4a2a');box(x+.1,y+.68,0,.8,.2,6,'#8a5a32');box(x+.1,y+.25,6,.8,.2,6,'#7a4a2a');box(x+.1,y+.53,6,.8,.2,6,'#8a5a32');break;
  case 'm':box(x+.3,y+.3,0,.4,.4,6,'#7a5a3a');box(x+.32,y+.32,6,.36,.36,1,'#c8a878');break;
  case 'u':box(x+.1,y+.2,0,.5,.4,5,'#8a8a8a',.9+h*.2);box(x+.45,y+.45,0,.4,.35,8,'#7a7a7a');box(x+.2,y+.55,5,.25,.2,3,'#9a9a9a');break;
  case 'd':box(x+.42,y+.42,0,.16,.16,26,'#4a3a2a');box(x+.2,y+.45,16,.3,.08,3,'#4a3a2a');box(x+.55,y+.4,20,.3,.08,3,'#4a3a2a');box(x+.45,y+.2,12,.08,.3,3,'#4a3a2a');break;
  case 'Y':box(x+.1,y+.1,0,.8,.8,10,'#d8d4c8');box(x+.3,y+.3,10,.4,.4,18,'#e8e4d8');box(x+.33,y+.33,28,.34,.34,7,'#f0ece0');box(x+.15,y+.4,18,.15,.1,8,'#e0dcd0');break;
  case 'o':{const k=['#e86a8a','#ffd84a','#c86ae8','#ff8a4a'][(x*3+y)%4];box(x+.05,y+.05,0,.9,.9,4,'#6a4a2a');box(x+.1,y+.1,4,.8,.8,3,'#4a8a3a');box(x+.2,y+.2,7,.15,.15,3,k);box(x+.6,y+.3,7,.15,.15,3,k);box(x+.35,y+.62,7,.15,.15,3,k);break}
  case 'j':box(x+.05,y+.05,0,.9,.9,12,'#3a7a32',.85+h*.25);box(x+.1,y+.1,12,.8,.8,2,'#4a8a3a');break;
  case 'e':box(x+.1,y+.1,0,.8,.8,10,'#3f7a32');box(x+.2,y+.3,10,.15,.15,3,'#d0304a');box(x+.55,y+.55,10,.15,.15,3,'#e04a6a');box(x+.6,y+.2,9,.15,.15,3,'#d0304a');break;
  case 'N':box(x+.1,y+.4,0,.08,.08,20,'#6b4a2b');box(x+.82,y+.4,0,.08,.08,20,'#6b4a2b');box(x+.1,y+.42,6,.8,.04,14,'#c8b890',.9);box(x+.1,y+.4,20,.8,.08,2,'#6b4a2b');break;
  case 'E':box(x+.45,y+.45,0,.1,.1,26,'#6b4a2b');box(x+.15,y+.45,16,.7,.08,3,'#6b4a2b');box(x+.32,y+.38,14,.36,.24,10,'#a85a3a');box(x+.36,y+.38,24,.28,.24,7,'#d8c070');box(x+.3,y+.32,31,.4,.36,3,'#8a6a2a');break;
  case 'x':box(x+.05,y+.2,4,.9,.6,6,'#8a6a42');box(x+.1,y+.12,0,.18,.08,8,'#3a3a3a');box(x+.7,y+.12,0,.18,.08,8,'#3a3a3a');box(x+.1,y+.8,0,.18,.08,8,'#3a3a3a');box(x+.7,y+.8,0,.18,.08,8,'#3a3a3a');break;
  case 'G':box(x+.1,y+.1,0,.8,.8,12,'#a0703a');box(x,y,12,1,1,4,'#8a3a2a');box(x+.35,y+.88,2,.3,.05,6,'#3a2a1a');break;
  case 'r':{const k=h>.5?'#3f7a32':'#4a8a3a',sw=Math.sin(t*1.3+x*.7+y*.5)*.04;box(x+.4,y+.4,0,.2,.2,14,'#6b4a2b');box(x+.1+sw,y+.1,12,.8,.8,12,k,.85+h*.3);box(x+.25+sw*1.6,y+.25,24,.5,.5,9,k,1.1);break}
  case '1':box(x+.4,y+.4,0,.2,.2,26,'#6b4a2b');box(x+.3,y+.3,26,.4,.4,8,'#e8e4d8');box(x+.25,y+.45,22,.5,.08,3,'#c84a2a');break;
  case '2':box(x+.2,y+.2,0,.1,.1,6,'#e8e0d0');box(x+.1,y+.1,6,.3,.3,4,'#6aff8a',1.2);box(x+.55,y+.5,0,.08,.08,4,'#e8e0d0');box(x+.48,y+.43,4,.22,.22,3,'#4ae0ff',1.2);if(SET.ultra)GLOW.push([x+.5,y+.5,8,40,'90,255,170',.2]);break;
  case '3':box(x+.1,y+.1,0,.8,.8,2,'#3a3a3a');for(const[a,b]of[[.1,.1],[.82,.1],[.1,.82],[.82,.82],[.46,.1],[.1,.46]])box(x+a,y+b,2,.08,.08,22,'#4a4a4a');box(x+.1,y+.1,24,.8,.8,2,'#3a3a3a');break;
  case '4':box(x+.1,y+.2,0,.8,.6,10,'#8a8a94');box(x+.15,y+.25,10,.7,.5,3,'#a8a8b0');box(x+.42,y+.3,13,.16,.4,1,'#c8c8d0');break;
  case '5':box(x+.3,y+.3,0,.08,.08,6,'#f4f0e0');box(x+.31,y+.31,6,.06,.06,3,'#ffcc33',1.2+Math.sin(t*9+x)*.1);box(x+.55,y+.45,0,.08,.08,9,'#f4f0e0');box(x+.56,y+.46,9,.06,.06,3,'#ffcc33',1.2);box(x+.4,y+.62,0,.08,.08,5,'#f4f0e0');box(x+.41,y+.63,5,.06,.06,3,'#ffcc33',1.2);nlight(x+.5,y+.5,8,90,'255,200,120',.7);break;
  case '6':box(x+.3,y+.3,0,.4,.4,40,'#c9a860');box(x+.35,y+.35,40,.3,.3,6,'#d4af37');box(x+.31,y+.69,12,.38,.02,16,'#3a5aa8');break;
  case '7':box(x+.3,y+.3,0,.4,.4,8,'#d4af37');box(x+.35,y+.35,8,.3,.3,4,'#c49a2a');box(x+.42,y+.42,12,.16,.16,3,'#d4af37');break;
  case '8':box(x+.35,y+.35,0,.25,.25,22,'#9ae8ff',1.2);box(x+.15,y+.5,0,.2,.2,12,'#c8a0ff',1.2);box(x+.6,y+.2,0,.18,.18,15,'#9ae8ff',1.1);nlight(x+.5,y+.5,10,110,'150,230,255',.6);break;
  case '9':box(x+.3,y+.3,0,.4,.4,10,'#d8f0ff');box(x+.38,y+.38,10,.24,.24,10,'#e8f8ff');box(x+.44,y+.44,20,.12,.12,8,'#f4fcff');break;
  case '0':box(x+.3,y+.3,0,.4,.4,10,'#3a3a3a');box(x+.25,y+.25,10,.5,.5,3,'#4a4a4a');box(x+.32,y+.32,13,.36,.36,5+Math.sin(t*9+x)*2,'#ff7a2a',1.2);nlight(x+.5,y+.5,16,150,'255,140,60',.9);break;
  case '!':box(x+.42,y+.42,0,.16,.16,30,'#4a4a52');box(x+.45,y+.45,8+Math.sin(t*2+x)*2,.1,.1,20,'#6a6a72');break;
  case '%':box(x+.3,y+.4,0,.12,.12,14,'#ff7a8a');box(x+.2,y+.3,8,.1,.1,8,'#ff9aaa');box(x+.5,y+.5,0,.12,.12,10,'#ffb04a');box(x+.6,y+.35,6,.1,.1,10,'#ff7a8a');break;
  case '?':{const s2=Math.sin(t*1.5+x+y)*.08;box(x+.4,y+.4,0,.08,.08,10,'#2a8a4a');box(x+.4+s2,y+.4,10,.08,.08,10,'#3a9a5a');box(x+.4+s2*2,y+.4,20,.08,.08,10,'#4aaa6a');break}
  case '<':{const u=Math.sin(t*2+x*1.7)*3;box(x+.35,y+.35,8+u,.3,.3,14,'#c46bff',1.2);box(x+.4,y+.4,22+u,.2,.2,5,'#e8b0ff',1.3);nlight(x+.5,y+.5,16,110,'196,107,255',.7);break}
  case '>':box(x+.05,y+.05,0,.9,.9,1,'#5a2a8a');box(x+.2,y+.2,1,.6,.6,1,'#c46bff',1+Math.sin(t*3)*.2);break;
  case 'h':box(x+.1,y+.1,0,.8,.8,9,'#3f7a32',.9+h*.2);box(x+.3,y+.3,9,.2,.2,2,'#e86a8a');break;
  case 'f':fenceD(x,y);break;
  case 't':box(x+.25,y+.4,0,.5,.2,14,'#8a8f99');box(x+.2,y+.35,0,.6,.3,3,'#6a6f79');break;
  case 'l':box(x+.42,y+.42,0,.16,.16,30,'#2a2a2a');box(x+.32,y+.32,30,.36,.36,7,'#ffe08a',1.1+Math.sin(t*3+x)*.05);if(SET.ultra)GLOW.push([x+.5,y+.5,34,ZZ.int||ZZ.dg?58:40,'255,224,150',.22]);nlight(x+.5,y+.5,34,200,'255,214,140',.95);break;
  case 's':{const k=['#c0392b','#2980b9','#27ae60','#f39c12'][(x*7+y)%4];box(x+.1,y+.1,0,.8,.8,12,'#8a6a42');box(x+.1,y+.1,12,.08,.08,14,'#5a4a3a');box(x+.82,y+.82,12,.08,.08,14,'#5a4a3a');box(x+.82,y+.1,12,.08,.08,14,'#5a4a3a');box(x+.1,y+.82,12,.08,.08,14,'#5a4a3a');box(x+.05,y+.05,26,.9,.9,4,k);box(x+.2,y+.2,12,.25,.25,4,'#e74c3c');box(x+.5,y+.3,12,.25,.25,4,'#f1c40f');break}
  case 'W':box(x+.15,y+.15,0,.7,.7,10,'#8b8f99');box(x+.25,y+.25,2,.5,.5,8.5,'#2a5a9a');box(x+.15,y+.15,10,.1,.1,16,'#5a4a3a');box(x+.75,y+.75,10,.1,.1,16,'#5a4a3a');box(x+.05,y+.05,26,.9,.9,4,'#a8402f');break;
  case 'n':box(x+.15,y+.35,0,.1,.3,5,'#5a4a3a');box(x+.75,y+.35,0,.1,.3,5,'#5a4a3a');box(x+.1,y+.3,5,.8,.4,3,'#8a6a42');break;
  case 'k':box(x+.15,y+.15,0,.7,.7,14,'#a07a4a');box(x+.15,y+.47,0,.7,.06,14,'#7a5a3a');break;
  case 'b':box(x+.2,y+.2,0,.6,.6,16,'#8a5a2a');box(x+.18,y+.18,4,.64,.64,2,'#3a3a3a');box(x+.18,y+.18,11,.64,.64,2,'#3a3a3a');break;
  case 'S':box(x+.05,y+.05,0,.9,.9,34,'#6b4a2b');for(let i=0;i<3;i++){const k=['#a83a3a','#3a6aa8','#3a8a4a','#b89a3a'][(i+x+y)%4];box(x+.1,y+.92,6+i*10,.8,.05,7,k);box(x+.92,y+.1,6+i*10,.05,.8,7,['#3a8a4a','#a83a3a','#6a3a8a'][(i+x)%3])}break;
  case 'T':box(x+.15,y+.15,0,.1,.1,12,'#5a4a3a');box(x+.75,y+.75,0,.1,.1,12,'#5a4a3a');box(x+.75,y+.15,0,.1,.1,12,'#5a4a3a');box(x+.15,y+.75,0,.1,.1,12,'#5a4a3a');box(x+.05,y+.05,12,.9,.9,3,'#8a6a42');if(h>.5)box(x+.4,y+.4,15,.15,.15,5,'#dddddd');break;
  case 'B':box(x+.05,y+.05,0,.9,.9,8,'#6b4a2b');box(x+.08,y+.08,8,.84,.84,4,'#d8d0c0');box(x+.08,y+.35,8,.84,.57,5,'#a83a5a');break;
  case 'C':box(x,y+.1,0,1,.8,16,'#7a5a3a');box(x-.02,y+.08,16,1.04,.84,2,'#9a7a4a');if(h>.6)box(x+.3,y+.3,18,.2,.2,6,'#c8a040');break;
  case 'A':box(x+.25,y+.3,0,.5,.4,8,'#3a3a3a');box(x+.1,y+.25,8,.8,.5,6,'#4a4a52');break;
  case 'F':box(x+.05,y+.05,0,.9,.9,20,'#6a6464');box(x+.2,y+.75,2,.6,.2,10,'#ff8a2a',1+Math.sin(t*10+y+x)*.2);box(x+.25,y+.25,20,.5,.5,16,'#5a5454');if(SET.ultra)GLOW.push([x+.5,y+.9,8,66,'255,140,50',.3]);nlight(x+.5,y+.9,10,200,'255,140,50',1);break;
  case 'P':box(x+.15,y+.15,0,.7,.7,12,'#2a2a2a');box(x+.2,y+.2,12,.6,.6,1,'#5aff7a',.9+Math.sin(t*4)*.1);if(SET.ultra)GLOW.push([x+.5,y+.5,13,40,'90,255,130',.2]);break;
  case 'X':box(x,y+.1,0,1,.8,14,'#e8e4d8');box(x-.02,y+.08,14,1.04,.84,3,'#d4af37');if(h>.5){box(x+.45,y+.45,17,.1,.1,8,'#f4f0e0');box(x+.46,y+.46,25,.08,.08,3,'#ffcc33',1.1+Math.sin(t*8+x)*.1);if(SET.ultra)GLOW.push([x+.5,y+.5,27,28,'255,210,120',.18]);nlight(x+.5,y+.5,27,110,'255,210,120',.8)}break;
  case 'K':box(x+.1,y+.1,0,.8,.8,10,'#d4af37');box(x+.1,y+.1,10,.8,.25,26,'#a8303a');box(x+.1,y+.1,36,.8,.25,4,'#d4af37');break;
  case 'p':box(x+.3,y+.3,0,.4,.4,8,'#a0603a');box(x+.2,y+.2,8,.6,.6,12,'#3f8a3a',.9+h*.2);break;
  case 'M':box(x+.1,y+.15,0,.8,.7,22,'#2a2a3a');box(x+.15,y+.85,12,.7,.05,7,['#ff3355','#33ddff','#ffdd33'][(Math.floor(t*4)+x)%3]);box(x+.1,y+.15,22,.8,.7,4,'#d4af37');box(x+.45,y+.6,6,.1,.25,3,'#cccccc');if(SET.ultra)GLOW.push([x+.5,y+.85,16,30,'255,80,160',.13]);nlight(x+.5,y+.85,16,90,'255,80,160',.6);break;
  case 'R':box(x+.05,y+.05,0,.9,.9,12,'#5a2a1a');box(x+.1,y+.1,12,.8,.8,2,'#1a6a2a');if((x+y)%2)box(x+.3,y+.3,14,.4,.4,2,Math.floor(t*2)%2?'#cc2222':'#222222');break;
  case 'Q':box(x+.05,y+.05,0,.9,.9,12,'#4a2a1a');box(x+.08,y+.08,12,.84,.84,2,'#1f7a3a');box(x+.3,y+.35,14,.15,.2,1,'#eeeeee');break;
  case 'Z':box(x+.2,y+.2,0,.6,.6,12,'#4a2a1a');box(x+.15,y+.15,12,.7,.7,2,'#1f7a3a');box(x+.35,y+.35,14,.18,.18,5,'#ffffff');box(x+.6,y+.5,14,.15,.15,4,'#cc2222');break;
  // ---- 5.2: arredi nuovi per gli interni (ogni edificio ha la sua disposizione) ----
  case '1':box(x+.05,y+.05,0,.9,.9,12,'#a8503a');box(x+.12,y+.12,12,.76,.76,8,'#b8604a');box(x+.25,y+.25,20,.5,.5,5,'#a8503a');box(x+.3,y+.92,2,.4,.06,7,'#2a1a10');box(x+.35,y+.94,3,.3,.04,4,'#ff8a2a',1.1+Math.sin(t*9+x)*.15);if(SET.ultra)GLOW.push([x+.5,y+.95,6,40,'255,140,50',.25]);break;
  case '2':box(x+.1,y+.35,0,.8,.3,30,'#8a6a42');for(let i=0;i<3;i++){box(x+.12,y+.37,6+i*9,.76,.26,1,'#6b4a2b');box(x+.18,y+.42,7+i*9,.24,.16,3,'#d8a050');box(x+.55,y+.42,7+i*9,.24,.16,3,'#c88a3a')}break;
  case '3':box(x+.45,y+.45,0,.1,.1,14,'#4a3a2a');box(x+.3,y+.35,0,.4,.3,2,'#4a3a2a');box(x+.32,y+.36,14,.36,.28,14,['#a83a5a','#3a6aa8','#e8d8a0','#3a8a5a'][(x+y)%4]);box(x+.4,y+.4,28,.2,.2,4,'#e8dcc8');break;
  case '4':box(x+.05,y+.2,0,.9,.6,12,'#7a5a3a');box(x+.1,y+.25,12,.8,.5,1,'#9a7a4a');box(x+.15,y+.3,13,.3,.4,3,'#c0392b');box(x+.5,y+.3,13,.3,.4,3,'#2980b9');box(x+.4,y+.45,13,.08,.08,10,'#cccccc');break;
  case '5':box(x+.4,y+.4,0,.2,.2,10,'#4a4a52');box(x+.25,y+.25,0,.5,.5,2,'#3a3a42');box(x+.2,y+.42,10,.8,.16,5,'#b8963a');box(x+.82,y+.42,13,.15,.16,4,'#d4af37');box(x+.1,y+.44,9,.12,.12,4,'#2a2a32');break;
  case '6':box(x+.4,y+.4,0,.2,.2,12,'#6b4a2b');box(x+.25,y+.25,12,.5,.5,10,'#3a7ab8');box(x+.32,y+.3,14,.2,.3,5,'#4a9a4a');box(x+.24,y+.45,16,.52,.06,2,'#d4af37');break;
  case '7':box(x+.45,y+.45,0,.1,.1,10,'#4a3a2a');box(x+.3,y+.3,0,.4,.4,2,'#4a3a2a');box(x+.28,y+.32,10,.44,.36,14,'#a8b0bc');box(x+.33,y+.36,24,.34,.28,7,'#c8ccd4');box(x+.18,y+.36,18,.12,.28,6,'#a8b0bc');box(x+.7,y+.36,18,.12,.28,6,'#a8b0bc');break;
  case '8':box(x+.05,y+.1,0,.08,.8,26,'#5a4a3a');box(x+.87,y+.1,0,.08,.8,26,'#5a4a3a');box(x+.05,y+.1,4,.9,.8,3,'#7a6a4a');box(x+.1,y+.15,7,.8,.7,2,'#c8c0a8');box(x+.05,y+.1,17,.9,.8,3,'#7a6a4a');box(x+.1,y+.15,20,.8,.7,2,'#a8b0a0');break;
  case '9':box(x,y+.42,0,1,.16,16,'#7a5a3a');box(x+.42,y,0,.16,.42,16,'#7a5a3a');box(x+.1,y+.6,0,.6,.3,4,'#d8b84a');break;
  case '0':box(x+.05,y+.15,0,.9,.7,12,'#6b4a2b');box(x+.02,y+.12,12,.96,.76,2,'#7a5a3a');box(x+.2,y+.3,14,.3,.22,1,'#f4f0e0');box(x+.55,y+.35,14,.1,.1,4,'#2a2a3a');box(x+.62,y+.5,14,.2,.15,2,'#c0392b');break;
  case '!':box(x+.45,y+.45,0,.1,.1,34,'#4a3a2a');box(x+.55,y+.47,16,.06,.4,18,['#a8303a','#2a4a8a','#d4af37'][(x+y)%3]);box(x+.4,y+.4,34,.2,.2,3,'#d4af37');break;
  case '%':box(x+.05,y+.2,0,.9,.6,8,'#1a1a22');box(x+.02,y+.18,8,.96,.64,6,'#2a2a32');box(x+.05,y+.65,10,.9,.12,2,'#f4f0e8');box(x+.6,y+.2,14,.3,.5,10,'#2a2a32');break;
  case '*':box(x+.42,y+.42,0,.16,.16,24,'#b8963a');box(x+.2,y+.45,24,.6,.1,2,'#b8963a');for(const o of[.22,.45,.68]){box(x+o,y+.46,26,.08,.08,5,'#f4f0e0');box(x+o+.01,y+.47,31,.06,.06,2,'#ffcc33',1.2)}if(SET.ultra)GLOW.push([x+.5,y+.5,32,40,'255,210,120',.2]);break;
  case '?':box(x+.3,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.64,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.25,y+.42,10,.5,.06,18,'#f4f0e8');box(x+.3,y+.4,14,.2,.04,6,['#3a8ad8','#e8484f','#4cd07a','#ffd84a'][(x*3+y)%4]);box(x+.5,y+.4,18,.15,.04,5,'#c86ae8');break;
  case '<':box(x+.05,y+.25,0,.9,.5,32,'#6a4a2a');box(x+.48,y+.74,4,.04,.02,26,'#3a2a1a');box(x+.38,y+.75,16,.06,.02,4,'#d4af37');box(x+.56,y+.75,16,.06,.02,4,'#d4af37');break;
  case '>':box(x+.05,y+.15,0,.9,.7,9,'#e8e4dc');box(x+.12,y+.22,6,.76,.56,3,'#8ac8e8');box(x+.08,y+.75,3,.1,.05,3,'#b8963a');break;
  case '|':box(x+.3,y+.35,0,.4,.3,36,'#5a3a1a');box(x+.34,y+.64,24,.32,.02,9,'#f4f0e0');box(x+.48,y+.65,8,.04,.02,12+Math.sin(t*3)*3,'#d4af37');break;
  case '_':box(x+.05,y+.2,0,.9,.6,16,'#7a5a3a');box(x+.1,y+.79,4,.8,.02,4,'#5a3a1a');box(x+.1,y+.79,10,.8,.02,4,'#5a3a1a');box(x+.3,y+.3,16,.2,.2,6,'#3a7ab8');break;
  case 'w':box(x+.1,y+.4,0,.8,.15,22,'#6b4a2b');box(x+.2,y+.56,4,.05,.05,24,'#cccccc');box(x+.5,y+.56,4,.05,.05,24,'#cccccc');box(x+.75,y+.56,4,.05,.05,22,'#b8a088');break}}
// 7.12: alberi, cactus, rocce e abeti delle zone aperte (e i muri "aperti" di Voxelia Studio) non riempiono tutta la casella:
// sotto ci va il prato (o la sabbia, o la neve), altrimenti tra il tronco e la chioma si vedeva il cielo
function openW(x,y){const z=ZZ;if(!z)return false;if(z.ed){const m=z.edm,st=m&&m.w&&typeof EWAL!=='undefined'?EWAL[m.w[y*N+x]]:null;return!!(st&&st.open)}
  return!z.dg&&!z.int&&!z.dist&&(z.th==='forest'||z.th==='desert'||z.th==='peaks')}
// Il pavimento (statico) viene disegnato una volta sola in una tela fuori schermo per zona; l'acqua resta animata
function buildFC(){const w=N*64+64,h=N*32+80,cs=Math.min(DPR,Math.sqrt(1.6e7/(w*h)),2),c=document.createElement('canvas');c.width=Math.ceil(w*cs);c.height=Math.ceil(h*cs);
  g=c.getContext('2d');g.setTransform(cs,0,0,cs,(N*32+32)*cs,40*cs);
  for(let d=0;d<2*N-1;d++)for(let x=Math.max(0,d-N+1);x<=Math.min(d,N-1);x++){const y=d-x,m=M[y][x];if(m===0||m===4||m===8||m===6||(m===1&&openW(x,y)))floor(x,y,m===6?(RDF.has(y*N+x)?4:0):m===1?0:m,hh(x,y))}
  g=G0;FC={cv:c,cs,ox:N*32+32,oy:40,w,h};
  const m=document.createElement('canvas');m.width=m.height=130;const q=m.getContext('2d'),s=130/N;q.fillStyle='#000a';q.fillRect(0,0,130,130);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c2=M[y][x];if(c2&&c2!==9){q.fillStyle=c2===2?(ZZ.pool||'#3388cc'):c2===3?'#a0705a':c2===4?'#8a8070':c2===6?'#4a6a3a':c2===8?'#a8303a':'#667788';q.fillRect(x*s,y*s,s+.3,s+.3)}}MC=m}
function tile(x,y){const c=M[y][x];if(c===9)return;const h=HHc&&HHc.length===N*N?HHc[y*N+x]:hh(x,y);
  if(c===2||(!FC&&(c!==1||openW(x,y))&&c!==3))floor(x,y,c===6?(RDF.has(y*N+x)?4:0):c===1?0:c,h);
  if(c===0&&DEC[y][x]){dec(x,y,DEC[y][x],h);return}if(c===0||c===2||c===4||c===8)return;
  let a=0;const ch=c===6?DEC[y][x]:'';if(c!==6||'rlSsWwFK'.includes(ch)){const d=(x+y)-(P.px+P.py);if(d>0&&d<5.5&&Math.abs((x-y)-(P.px-P.py))<3.5){g.globalAlpha=.35;a=1}}
  if(c===1)wall(x,y,h);else if(c===3)bld(x,y,h);else dec(x,y,ch,h);
  if(a)g.globalAlpha=1}

/* ================= aggiornamento 5.0: i quartieri di Aldoria =================
   Nord: Quartiere Nobile · Est: Campi e Mestieri · Ovest: Aldoria Vecchia (si apre con la missione del Moreau) · Sud: Porto */
Object.assign(E,{
bandito:{n:'Bandito',hp:48,at:11,xp:14,sp:2.1,r:1.2,cd:1.1,ag:7,m:hum('#4a3a3a','#c09070',1,[3,'#2a2a2a'])},
spettro:{n:'Spettro',hp:40,at:12,xp:16,sp:1.8,r:1.2,cd:1.3,ag:8,m:elem('#c8d4e8',.9)},
ghoul:{n:'Ghoul',hp:70,at:14,xp:20,sp:1.6,r:1.2,cd:1.4,ag:6,m:hum('#5a6a4a','#8aa07a',1.05,[2,'#3a4a2a'])},
vexmoor:{n:'Lord Vexmoor, lo Spettro',hp:420,at:24,xp:300,sp:1.7,r:1.8,cd:1.3,ag:11,boss:1,m:elem('#9a7ad8',1.8)}});

const RESN={grano:'Grano',legna:'Legna',mela:'Mele',uova:'Uova',rosa:'Rose',cimelio:'Cimeli antichi'},RESP={grano:4,legna:6,mela:5,uova:7,rosa:9,cimelio:40};
const FISHT=[{id:'sardina',n:'Sardina',w:40,p:6,d:.15},{id:'sgombro',n:'Sgombro',w:26,p:10,d:.28},{id:'orata',n:'Orata',w:16,p:18,d:.42},{id:'branzino',n:'Branzino',w:10,p:24,d:.5},{id:'polpo',n:'Polpo',w:6,p:35,d:.6},{id:'calamaro',n:'Calamaro',w:8,p:30,d:.55,nt:1},{id:'pesce_spada',n:'Pesce spada',w:2.2,p:95,d:.8},{id:'trota_dorata',n:'Trota dorata',w:2,p:150,d:.85,nt:1},{id:'stivale',n:'Stivale vecchio',w:4,p:1,d:.05}];

Object.assign(NPCS,{
moreau:{n:'Il Moreau',c:'#3a3a4a',hat:'#1a1a22',qs:['mo1','mo2','mo3','mo4'],ln:['Aldoria Vecchia... la mia casa. Nebbia, fuoco, urla. E poi il silenzio.','Nessuno sa cosa sia successo quella notte. Nessuno.','Dietro quel cancello ci sono ancora i miei ricordi. E qualcosa di peggio.','Mi chiamano «il Moreau» da così tanto che non ricordo più il mio vero nome.']},
conte:{n:'Conte Valerio',c:'#6a1a3a',hat:'#d4af37',qs:['no1','no2','no3'],ln:['Benvenuto nel mio palazzo. Non toccare i quadri.','Aldoria Nord è il cuore elegante del regno. Il resto... beh.']},
contessa:{n:'Contessa Livia',c:'#8a3a6a',hat:'#e8d0e0',qs:['no4','no5'],ln:['Le rose del Roseto sono la mia passione.','Mio marito pensa solo ai banchetti.']},
maggiordomo:{n:'Maggiordomo Alfredo',c:'#1a1a1a',hat:'#f0f0f0',qs:['no13'],ln:['Il Conte riceve solo su appuntamento.','Prego, si pulisca gli stivali.']},
banchiere:{n:'Banchiere Aurelio',c:'#2a4a2a',hat:'#1a1a1a',qs:['no8','no9'],ln:['L\'oro non dorme mai.','La Banca di Aldoria custodisce le fortune di tutto il regno.']},
severino:{n:'Notaio Severino',c:'#3a3a5a',hat:'#2a2a2a',qs:['no10'],ln:['Ogni contratto, ogni chiave, ogni segreto passa da questo ufficio.','Il Moreau? Un uomo ostinato. Ma ha diritto a ciò che chiede: la chiave è sua.']},
cassiere:{n:'Cassiere Gualtiero',c:'#4a5a3a',hat:'#3a3a2a',ln:['Prossimo cliente, prego.','Non si accettano monete false. Le controllo una per una.']},
giardiniere:{n:'Giardiniere Fiore',c:'#3a6a2a',hat:'#d8c070',qs:['no6','no7'],ln:['Una rosa ben potata è una poesia.','Attento alle aiuole, le ho appena rifatte!']},
beatrice:{n:'Dama Beatrice',c:'#6a2a8a',hat:'#f0d0f0',qs:['no11'],ln:['Che quartiere elegante, vero? Peccato per i ladri.','Mia nonna mi lasciò una collana d\'argento...']},
lorenzo:{n:'Poeta Lorenzo',c:'#8a5a2a',hat:'#4a2a1a',qs:['no12'],ln:['O Aldoria, gemma di pietra e di sogno...','Sto cercando una rima per «frammento». Hai idee?']},
guardia_nord:{n:'Guardia d\'Élite',c:'#c0c4d0',hat:'#d4af37',qs:['no14'],ln:['Il Quartiere Nobile è sorvegliato giorno e notte.','Niente risse e niente animali, per ordine del Conte.']},
nobile:{n:'Nobile',c:'#7a3a6a',hat:'#d4af37',ln:['Hai visto il nuovo spettacolo al Teatro?','Il Conte dà un ballo questa sera.','Le orate del porto sono le migliori, dicono.','Che noia, un altro giro in carrozza.']},
bruno_b:{n:'Boscaiolo Bruno',c:'#8a3a2a',hat:'#3a2a1a',qs:['ca1','ca2'],ln:['Taglia, spacca, accatasta. Ogni giorno.','Il legno di quercia è il migliore per le travi.']},
marta:{n:'Contadina Marta',c:'#a87a3a',hat:'#e8d8a0',qs:['ca3','ca4'],ln:['Il grano quest\'anno è alto come un uomo!','Sole e pioggia al momento giusto: è tutto ciò che chiedo.']},
giacomo:{n:'Fattore Giacomo',c:'#5a6a3a',hat:'#8a6a3a',role:'buyer',buy:'res',qs:['ca5','ca6'],ln:['Compro grano, legna, mele e uova. Pago il prezzo del giorno.','La fattoria è la spina dorsale di Aldoria.']},
rosa_f:{n:'Rosa la Fattoressa',c:'#8a4a5a',hat:'#e8e0c8',qs:['ca12'],ln:['Vuoi una tazza di latte caldo?','Giacomo lavora troppo. Come tutti, qui.']},
pietro:{n:'Mugnaio Pietro',c:'#d8d0c0',hat:'#e8e8e8',qs:['ca7'],ln:['Il vento gira, la macina gira. Tutto gira.','La farina di Aldoria finisce sulla tavola del Re.']},
elio:{n:'Pastore Elio',c:'#6a5a3a',hat:'#4a6a2a',qs:['ca8'],ln:['Le mie pecore hanno tutte un nome. Quella è Nuvola.','Il cane è morto l\'inverno scorso. Ora le guardo da solo.']},
lia_r:{n:'Raccoglitrice Lia',c:'#8a6a2a',hat:'#d84a4a',qs:['ca9'],ln:['Le mele rosse sono dolci, le verdi fanno fare smorfie.','Dal frutteto si vede tutta la valle.']},
ettore:{n:'Capomastro Ettore',c:'#5a4a3a',hat:'#d8a020',qs:['ca10'],ln:['La segheria non si ferma mai.','Ogni trave che esce di qui è dritta come una spada.']},
mercante_campi:{n:'Mercante di Raccolti',c:'#6a5a2a',hat:'#3a3a2a',role:'buyer',buy:'res',qs:['ca11'],ln:['Grano, mele, uova, legna: compro tutto, ai prezzi del giorno.','I prezzi cambiano ogni giorno, come il tempo.']},
contadino:{n:'Contadino',c:'#8a6a3a',hat:'#d8c070',ln:['Che caldo, oggi!','Le galline stamattina erano nervose.','Hai visto il mulino? Non si ferma mai.']},
mucca:{n:'Mucca',c:'#eeeeee',hat:'#333333',ln:['Muuu!','La mucca ti guarda masticando, per niente impressionata.']},
pecora:{n:'Pecora',c:'#eeeeee',hat:'#333333',ln:['Beee!','La pecora ti annusa la mano, poi torna a brucare.']},
maiale:{n:'Maiale',c:'#f0a8a8',hat:'#d08080',ln:['Oink oink!','Il maiale grufola felice nel fango.']},
gallina:{n:'Gallina',c:'#f4f4f0',hat:'#d02020',ln:['Coccodè!','La gallina becca qualcosa vicino ai tuoi piedi.']},
ada:{n:'Vecchia Ada',c:'#5a4a5a',hat:'#8a8a8a',qs:['ro1','ro2'],ln:['Non me ne sono mai andata. Questa è casa mia.','Di notte gli spettri cantano. Li senti?']},
tobia:{n:'Fratel Tobia',c:'#5a3a2a',hat:'#3a2a1a',role:'heal',qs:['ro3','ro4'],ln:['Che la Luce protegga anche questi luoghi dimenticati.','Riposa qui, fratello. Il mondo fuori è crudele.']},
sentinella:{n:'Ultima Sentinella',c:'#6a6a7a',hat:'#4a4a5a',qs:['ro5'],ln:['Sono ancora di guardia. Nessuno mi ha detto di smettere.','Il fuoco partì dalla villa di Vexmoor, a nord-est.']},
gino:{n:'Pescatore Gino',c:'#3a5a7a',hat:'#d8c070',role:'fisher',qs:['po1','po2','po3'],ln:['Il mare dà, il mare prende.','Le orate abboccano tutto il giorno, i calamari solo di notte.']},
nella:{n:'Pescivendola Nella',c:'#7a4a3a',hat:'#e8e0d0',role:'buyer',buy:'fish',qs:['po4'],ln:['Pesce fresco! Compro ai prezzi del giorno!','Il pesce spada vale oro, credimi.']},
baldo:{n:'Capitano Baldo',c:'#1a2a4a',hat:'#f0f0f0',qs:['po5','po6'],ln:['Trent\'anni per mare e non ho mai perso una nave.','Il faro guida le navi anche nella nebbia più fitta.']},
doganiere:{n:'Doganiere Fabrizio',c:'#4a4a6a',hat:'#2a2a4a',qs:['po7'],ln:['Ogni cassa che entra nel porto passa da me.','Contrabbando? Non nel mio porto.']},
rocco:{n:'Marinaio Rocco',c:'#2a4a6a',hat:'#c03a2a',qs:['po8','po12'],ln:['Hai mai visto il mare di notte? Brilla di calamari.','Al largo del faro nuotano pesci che nessuno ha mai pescato.']},
pippo:{n:'Mozzo Pippo',c:'#6a8aaa',hat:'#e8d8a0',qs:['po9'],ln:['Un giorno avrò una nave tutta mia!','Il capitano dice che sono il mozzo più veloce del porto.']},
ernesto:{n:'Maestro d\'ascia Ernesto',c:'#7a5a3a',hat:'#4a3a2a',qs:['po10'],ln:['Una buona barca si costruisce con pazienza e buon legno.','Senti l\'odore della pece? È il profumo del mestiere.']},
oste:{n:'Oste Gaspare',c:'#7a3a2a',hat:'#ffffff',role:'inn',qs:['po11'],ln:['Benvenuto alla Locanda del Gabbiano!','Il branzino alla griglia è la nostra specialità.']},
cantastorie:{n:'Cantastorie Viola',c:'#5a2a6a',hat:'#d8a020',role:'bard',ln:['Vuoi sentire la ballata della trota dorata?','Ogni marinaio ha una storia. Io le canto tutte.']},
ubriaco:{n:'Marinaio ubriaco',c:'#4a5a6a',hat:'#3a3a3a',ln:['Hic! Ho visto una sirena... o era un tonno?','Un\'altra birra, oste!']},
marinaio:{n:'Marinaio',c:'#2a4a6a',hat:'#f0f0f0',ln:['Il vento oggi è buono per salpare.','Attento alle cime, scivolano.','Il pesce spada? L\'ho visto una volta sola, al largo.']}});
NPCS.guardia_porta.ln.push('Nuovi quartieri: a nord il Quartiere Nobile, a est i Campi, a sud il Porto. Il cancello ovest di Aldoria Vecchia è sbarrato: chiedi al Moreau.');

Object.assign(QT,{
no1:{t:'fish',f:'orata',n:3,lv:2,ti:'La cena del Conte',tx:'Stasera ho ospiti di riguardo. Portami 3 orate fresche: le pescano al Porto di Aldoria.',g:160,x:110},
no2:{t:'kill',e:['bandito'],n:8,lv:5,req:'rovine',ti:'Banditi nelle rovine',tx:'Dal Borgo delle Ceneri escono banditi che derubano le nostre carrozze. Eliminane 8.',g:260,x:190},
no3:{t:'boss',e:['vexmoor'],n:1,lv:6,req:'rovine',ti:'Il fantasma di Vexmoor',tx:'Lord Vexmoor era il signore di Aldoria Vecchia. Il suo spettro tormenta ancora il quartiere: dagli pace.',g:650,x:480},
no4:{t:'gat',r:'rosa',n:6,ti:'Rose per la Contessa',tx:'Il Roseto, a sud del quartiere, ha le rose più belle del regno. Coglimene 6.',g:80,x:55},
no5:{t:'talk',to:'lorenzo',ti:'Una lettera segreta',tx:'Consegna questo biglietto al poeta Lorenzo, in piazza. E non leggerlo!',g:70,x:45},
no6:{t:'gat',r:'rosa',n:10,ti:'Il Roseto in fiore',tx:'Le rose vanno colte prima che sfioriscano. Raccoglimene 10.',g:110,x:80},
no7:{t:'kill',e:['ratto'],n:10,lv:5,req:'rovine',ti:'Topi nelle cantine',tx:'I ratti giganti risalgono dalle fogne di Aldoria Vecchia. Sterminane 10.',g:200,x:150},
no8:{t:'col',e:['ghoul'],it:'Monete antiche',n:5,lv:5,req:'rovine',ti:'Il tesoro di Aldoria Vecchia',tx:'I ghoul delle rovine portano ancora le monete dell\'antico conio. Recuperane 5 per la Banca.',g:320,x:230},
no9:{t:'kill',e:['scorpione','sciacallo'],n:12,lv:4,ti:'La carovana d\'oro',tx:'La Banca finanzia una carovana per Khem. Ripulisci la strada nel Deserto: 12 bestie.',g:220,x:160},
no10:{t:'gat',r:'cimelio',n:4,lv:5,req:'rovine',ti:'Atti di proprietà',tx:'Tra le macerie del Borgo delle Ceneri ci sono ancora sigilli e documenti delle antiche famiglie. Portamene 4.',g:240,x:170},
no11:{t:'col',e:['bandito'],it:'Collana rubata',n:1,ch:.3,lv:5,req:'rovine',ti:'La collana di Beatrice',tx:'Un bandito mi ha strappato la collana di mia nonna ed è fuggito nelle rovine. Ritrovala, ti prego!',g:200,x:140},
no12:{t:'gat',r:'mela',n:5,ti:'Ispirazione',tx:'Per la mia nuova ode mi servono mele fresche dai frutteti dei Campi Est. Cinque, per l\'esattezza.',g:60,x:45},
no13:{t:'gat',r:'uova',n:6,ti:'Colazione a palazzo',tx:'La cuoca ha finito le uova. Corri alla fattoria dei Campi Est e portane 6.',g:70,x:50},
no14:{t:'kill',e:['lupo'],n:10,lv:1,ti:'Ronda nella foresta',tx:'I lupi si spingono fino alle mura nord. Abbattine 10 nella Foresta di Elmwood.',g:90,x:70},
ca1:{t:'gat',r:'legna',n:10,ti:'Legna per l\'inverno',tx:'Mi serve una mano: raccogli 10 fasci di legna vicino ai ceppi, nel bosco a nord-est.',g:60,x:45},
ca2:{t:'kill',e:['lupo'],n:8,lv:1,ti:'Lupi al taglio',tx:'I lupi della foresta ci assalgono mentre lavoriamo. Abbattine 8.',g:70,x:55},
ca3:{t:'gat',r:'grano',n:12,ti:'La mietitura',tx:'Il grano è maturo! Raccogli 12 covoni nei campi a nord-ovest.',g:70,x:50},
ca4:{t:'kill',e:['goblin','arciere'],n:8,lv:2,ti:'Ladri di grano',tx:'I goblin della foresta rubano il nostro raccolto. Dagli una lezione: 8 goblin.',g:110,x:80},
ca5:{t:'gat',r:'uova',n:6,ti:'Uova fresche',tx:'Le galline hanno fatto il loro dovere. Raccogli 6 uova nel recinto del pollaio.',g:50,x:35},
ca6:{t:'talk',to:'pietro',ti:'Un messaggio per il mugnaio',tx:'Dì a Pietro, al mulino, che domani porto il grano da macinare.',g:35,x:25},
ca7:{t:'gat',r:'grano',n:15,ti:'Farina per il forno',tx:'Il mulino gira a vuoto! Portami 15 covoni di grano.',g:90,x:65},
ca8:{t:'kill',e:['lupo'],n:10,lv:1,ti:'Il pastore e il lupo',tx:'Ogni notte un lupo prova a prendersi una pecora. Vai nella foresta e abbattine 10.',g:85,x:65},
ca9:{t:'gat',r:'mela',n:8,ti:'Mele mature',tx:'Le mele cadono dagli alberi del frutteto a sud-est. Raccoglimene 8 prima che marciscano.',g:60,x:45},
ca10:{t:'gat',r:'legna',n:20,lv:2,ti:'Il grande ordine',tx:'Il Conte ha ordinato travi per la sua villa. Servono 20 fasci di legna!',g:150,x:110},
ca11:{t:'gat',r:'grano',n:8,ti:'Carico per la città',tx:'Riempi il mio carro: 8 covoni di grano e ti pago bene.',g:60,x:40},
ca12:{t:'kill',e:['slime'],n:8,ti:'Slime nell\'orto',tx:'Gli slime della foresta mi mangiano i cavoli! Schiacciane 8.',g:45,x:35},
mo1:{t:'talk',to:'severino',unl:'rovine',ti:'Il cancello sbarrato',tx:'Il cancello ovest fu sbarrato dopo la notte della nebbia e del fuoco: oltre c\'è il Borgo delle Ceneri, la periferia bruciata. La chiave la custodisce il notaio Severino, nella Banca del Quartiere Nobile (porta nord-ovest della città). Parlagli, poi torna da me.',g:60,x:50},
mo2:{t:'kill',e:['spettro'],n:10,lv:5,req:'rovine',ti:'Anime inquiete',tx:'Gli spettri vagano tra le case bruciate. Liberali: 10 spettri.',g:240,x:180},
mo3:{t:'gat',r:'cimelio',n:6,lv:5,req:'rovine',ti:'Ciò che resta della mia famiglia',tx:'La mia casa era in Aldoria Vecchia, ma il Borgo delle Ceneri è il punto più vicino dove si possa arrivare. Cerca tra le sue macerie 6 cimeli e riportameli.',g:280,x:200},
mo4:{t:'boss',e:['vexmoor'],n:1,lv:6,req:'rovine',ti:'La verità su Vexmoor',tx:'Qualcuno dice che fu Lord Vexmoor ad appiccare l\'incendio, ma nessuno lo sa davvero. Il suo spettro, nella villa a nord-est delle rovine, va fermato una volta per tutte.',g:700,x:520},
ro1:{t:'kill',e:['ratto'],n:10,lv:5,ti:'Ratti dappertutto',tx:'Vivo qui da sola da vent\'anni, ma questi ratti... Uccidine 10, ti prego.',g:180,x:140},
ro2:{t:'col',e:['ghoul'],it:'Erbe di cimitero',n:5,lv:5,ti:'Le erbe del cimitero',tx:'I ghoul mangiano le erbe che crescono sulle tombe. Mi servono per i miei infusi: recuperane 5.',g:200,x:150},
ro3:{t:'kill',e:['ghoul'],n:8,lv:5,ti:'Profanatori di tombe',tx:'I ghoul scavano nel cimitero a sud-est. Fermane 8.',g:240,x:180},
ro4:{t:'kill',e:['spettro'],n:12,lv:6,ti:'Preghiere per i morti',tx:'Le anime di Aldoria Vecchia non trovano pace. Liberane 12, io pregherò per loro.',g:260,x:200},
ro5:{t:'kill',e:['bandito'],n:10,lv:5,ti:'L\'ultima sentinella',tx:'Sono rimasto a sorvegliare il cancello. I banditi si sono presi il quartiere: abbattine 10.',g:230,x:170},
po1:{t:'fish',f:'any',n:5,ti:'Primo pescato',tx:'Hai una canna? Allora fammi vedere: pesca 5 pesci dal molo. Cerca i galleggianti rossi!',g:60,x:45},
po2:{t:'fish',f:'polpo',n:2,lv:2,ti:'Polpi tra gli scogli',tx:'I polpi si nascondono tra i pali del molo. Prendine 2.',g:130,x:90},
po3:{t:'fish',f:'pesce_spada',n:1,lv:3,ti:'Il re del mare',tx:'Un vero pescatore ha preso almeno un pesce spada. Tu ce la fai?',g:300,x:220},
po4:{t:'fish',f:'sardina',n:10,ti:'Sardine per il banco',tx:'Il banco è vuoto! Pescami 10 sardine, le vendo in un attimo.',g:80,x:55},
po5:{t:'kill',e:['granchio'],n:8,lv:10,ti:'Granchi nel porto',tx:'I granchi corazzati salgono dall\'Abisso e rompono le reti. Scendi e abbattine 8.',g:400,x:300},
po6:{t:'talk',to:'doganiere',ti:'Il registro di bordo',tx:'Porta i miei rispetti al Doganiere Fabrizio, sulla banchina: deve firmare il registro delle navi.',g:50,x:35},
po7:{t:'col',e:['bandito'],it:'Merci di contrabbando',n:4,lv:5,req:'rovine',ti:'Contrabbandieri',tx:'I banditi del Borgo delle Ceneri nascondono merci rubate. Recupera 4 casse di contrabbando.',g:260,x:190},
po8:{t:'fish',f:'calamaro',n:3,lv:2,ti:'Pesca notturna',tx:'I calamari salgono in superficie solo di notte. Portamene 3.',g:150,x:110},
po9:{t:'fish',f:'stivale',n:1,ti:'Lo stivale perduto',tx:'Ho fatto cadere il mio stivale in mare! Se lo peschi, te ne sarò grato per sempre.',g:40,x:30},
po10:{t:'gat',r:'legna',n:12,ti:'Legname per lo scafo',tx:'Sto costruendo una nuova barca. Mi servono 12 fasci di legna dai Campi Est.',g:120,x:85},
po11:{t:'fish',f:'branzino',n:3,lv:1,ti:'Il piatto del giorno',tx:'Il branzino alla griglia è la specialità della locanda. Portamene 3!',g:110,x:75},
po12:{t:'fish',f:'trota_dorata',n:1,lv:4,ti:'La leggenda dorata',tx:'Dicono che di notte, al largo del faro, nuoti una trota d\'oro. Pescala!',g:500,x:360}});

/* ---- interni dei quartieri (l'uscita riporta al quartiere) ---- */
const IN5={
in_palazzo:{n:'Palazzo del Conte',out:'nord',fl:'#c8b898',fl2:'#beae8e',wall:'#ece6d8',np:[['conte',7,2],['contessa',9,2],['maggiordomo',3,12]],lay:[
'################','#SS....KK....SS#','#..............#','#p....====....p#','#.....====.....#','#T....====....T#','#.....====.....#','#F....====....F#','#.....====.....#','#p....====....p#','#.....====.....#','#T....====....T#','#.....====.....#','#.....====.....#','#..............#','#######D########']},
in_banca:{n:'Banca di Aldoria',out:'nord',fl:'#a8a49a',fl2:'#9e9a90',wall:'#f0ece0',np:[['banchiere',6,2],['cassiere',9,2],['severino',3,9]],lay:[
'##############','#SS..CCCC..SS#','#............#','#............#','#.T..====..T.#','#....====....#','#.p..====..p.#','#....====....#','#.T..====..T.#','#............#','#k..........k#','#kb........bk#','#............#','######D#######']},
in_fattoria:{n:'Casa della Fattoria',out:'campi',fl:'#8a6a42',fl2:'#80623e',wall:'#e8d8b8',np:[['giacomo',5,3],['rosa_f',9,5]],lay:[
'##############','#F...SS....BB#','#............#','#.TT......bb.#','#.TT.........#','#............#','#kk....==....#','#k.....==..p.#','#......==....#','#.b....==..A.#','#......==....#','#.k..........#','#............#','######D#######']},
in_segheria:{n:'Segheria di Ettore',out:'campi',fl:'#9a7a4a',fl2:'#8e7044',wall:'#8a6a4a',np:[['ettore',6,3]],lay:[
'##############','#kkk..ww..AAk#','#............#','#.TTT........#','#..........k.#','#.k..........#','#....====....#','#....====..b.#','#.b..====....#','#....====....#','#..........kk#','#.kk.........#','#............#','######D#######']},
in_cappella:{n:'Cappella in rovina',out:'rovine',fl:'#6a6a64',fl2:'#62625c',wall:'#7a7a80',np:[['tobia',6,2]],lay:[
'##############','#....XXXX....#','#............#','#.nn..==..nn.#','#.....==.....#','#.nn..==..nn.#','#..u..==.....#','#.nn..==..nn.#','#.....==..u..#','#.nn..==..nn.#','#............#','#p..........p#','#............#','######D#######']},
in_locanda:{n:'Locanda del Gabbiano',out:'porto',fl:'#8a6a42',fl2:'#80623e',wall:'#d8c8a8',np:[['oste',5,2],['cantastorie',12,7],['ubriaco',3,10]],lay:[
'################','#bbCCCCCCCC..kk#','#..............#','#.TT..TT..TT...#','#..............#','#.TT..TT..TT..F#','#..............#','#..====....p...#','#..====........#','#.......BB..BB.#','#..............#','#.TT..TT.......#','#..............#','#k............b#','#..............#','#######D########']},
in_capitaneria:{n:'Capitaneria di Porto',out:'porto',fl:'#7a6a5a',fl2:'#726254',wall:'#c8c0b0',np:[['baldo',6,2]],lay:[
'##############','#SS..TTTT..SS#','#............#','#.....==.....#','#.k...==...k.#','#.....==.....#','#.T...==...T.#','#.....==.....#','#.....==.....#','#bb..........#','#b..........w#','#...........w#','#............#','######D#######']}};
for(const k in IN5)Z[k]=Object.assign({lv:0,N:IN5[k].lay.length,bg:'#141820',mus:'inter',int:1},IN5[k]);

Object.assign(Z,{
nord:{n:'Aldoria Nord · Quartiere Nobile',lv:2,N:56,a:'#7fa35e',b:'#7a9c5a',bg:'#7fb6e6',mus:'town',pt:'petal',gen:genNord,rd:['#dcd6c8','#d2ccbe'],wl:'#e4ded2',wh:30,dist:1},
campi:{n:'Aldoria Est · Campi e Mestieri',lv:1,N:56,a:'#86a64e',b:'#7f9e4a',bg:'#8fc4ea',mus:'forest',pt:'leaf',gen:genCampi,rd:['#a8916a','#9e8862'],wl:'#7a5a3a',wh:18,dist:1},
rovine:{n:'Borgo delle Ceneri · periferia di Aldoria Vecchia',lv:5,N:56,a:'#5e6a48',b:'#586444',bg:'#8a96a4',mus:'dungeon',pt:'dust',gen:genRovine,rd:['#7e7a70','#76726a'],wl:'#6a6a70',wh:22,ruin:1,dist:1,pool:'#4a6a5a'},
porto:{n:'Porto di Aldoria',lv:3,N:56,a:'#8aa060',b:'#839a5c',bg:'#86c0ea',mus:'town',pt:'mote',gen:genPorto,rd:['#aaa294','#a0988a'],wl:'#8b8f99',wh:26,dist:1}});

/* ---- costruttore dei quartieri ---- */
// 7.12: RDF ricorda le caselle di strada su cui è stato messo un arredo, così sotto l'arredo resta la strada (prima c'era l'erba)
let GT=new Set(),RDF=new Set();
function genDist(z){const n=N;GT=new Set();RDF=new Set();BM=grid(-1);TB=[];
  const ok=(x,y)=>x>0&&y>0&&x<n-1&&y<n-1;
  const R4=(x0,y0,w,h,v)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(ok(x,y)){M[y][x]=v;if(v!==6)DEC[y][x]=''}};
  const D=(x,y,c)=>{if(ok(x,y)&&M[y][x]===0&&!DEC[y][x]){M[y][x]=6;DEC[y][x]=c}};
  const F=(x,y,c)=>{if(ok(x,y)){if(M[y][x]===4)RDF.add(y*n+x);M[y][x]=6;DEC[y][x]=c}};
  const W=(x,y,c)=>{if(ok(x,y)&&M[y][x]===0)DEC[y][x]=c};
  const H=b=>{const i=TB.push(b)-1;for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){M[y][x]=3;DEC[y][x]='';BM[y][x]=i}if(b.to){M[b.y+b.h][b.dx]=4;DEC[b.y+b.h][b.dx]='';ents.push(po(b.dx,b.y+b.h,b.to,{st:'door'}))}};
  const gate=(x,y,to,o)=>{const e=po(x,y,to,Object.assign({st:'gate'},o||{}));ents.push(e);for(let k=-1;k<=1;k++){if(y===1)GT.add((x+k)+',0');if(y===n-2)GT.add((x+k)+','+(n-1));if(x===1)GT.add('0,'+(y+k));if(x===n-2)GT.add((n-1)+','+(y+k))}return e};
  const N2=(id,x,y,o)=>{const e=mkNpc(id,x,y,o||{});ents.push(e);return e};
  const AN=(id,x,y,m)=>{if(!ok(x,y)||!WK(M[y][x]))return;const e=mkNpc(id,x,y,{wd:1});e.wg=1;e.m=m;ents.push(e)};
  const RS=(r,x,y)=>{if(ok(x,y)&&WK(M[y][x]))ents.push({k:'res',r,n:RESN[r],px:x+.5,py:y+.5})};
  const EN=(t,x,y)=>{if(ok(x,y)&&WK(M[y][x]))ents.push(mk(t,x,y))};
  const FS=(x,y,ox,oy)=>ents.push({k:'fs',n:'Punto di pesca',px:x+.5,py:y+.5,ox,oy});
  const scat=(x0,y0,w,h,c,p)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(R()<p)D(x,y,c)};
  const fence=(x0,y0,w,h,gap)=>{for(let x=x0;x<x0+w;x++)for(let y=y0;y<y0+h;y++)if((x===x0||x===x0+w-1||y===y0||y===y0+h-1)&&!(gap&&gap.some(([a,b])=>a===x&&b===y)))D(x,y,'f')};
  for(let i=0;i<n;i++)M[0][i]=M[n-1][i]=M[i][0]=M[i][n-1]=1;
  const sp=z.gen({R4,D,F,W,H,gate,N2,AN,RS,EN,FS,scat,fence,n});
  // 7.12.1: un arredo messo dopo sopra una raccolta (un albero o un'aiuola sopra le rose del Roseto) si toglie: la raccolta resta in vista
  for(const e of ents)if(e.k==='res'){const x=e.px|0,y=e.py|0;if(M[y][x]===6){const i=y*n+x;M[y][x]=RDF.has(i)?4:0;RDF.delete(i);DEC[y][x]=''}}
  if(!z.ruin&&!z.nolamp)for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++)if(M[y][x]===0&&!DEC[y][x]&&(x*7+y*13)%17===0&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>M[y+b][x+a]===4))D(x,y,'l');
  // apre un varco tra le decorazioni verso ogni personaggio, porta, risorsa, forziere o nemico rimasto chiuso fuori
  const NB=[[1,0],[-1,0],[0,1],[0,-1]];let d=bfs(sp[0],sp[1]);const rc=(x,y)=>d[y*n+x]>=0;
  for(const e of ents){if(!['npc','po','res','fs','ch','en'].includes(e.k)||e.wg)continue;const x0=e.px|0,y0=e.py|0;if(rc(x0,y0)||NB.some(([a,b])=>rc(x0+a,y0+b)))continue;
    const pr=new Int32Array(n*n).fill(-2),q=[y0*n+x0];pr[q[0]]=-1;let hit=-1;
    for(let i=0;i<q.length&&hit<0;i++){const c=q[i],x=c%n,y=c/n|0;for(const[a,b]of NB){const u=x+a,v=y+b;if(u<1||v<1||u>=n-1||v>=n-1||pr[v*n+u]!==-2)continue;const m=M[v][u];if(!(WK(m)||m===6||(z.ruin&&m===1)))continue;pr[v*n+u]=c;if(rc(u,v)){hit=v*n+u;break}q.push(v*n+u)}}
    if(hit<0)continue;for(let c=hit;c>=0;c=pr[c]){const x=c%n,y=c/n|0;if(M[y][x]===6||M[y][x]===1){M[y][x]=0;DEC[y][x]=''}}d=bfs(sp[0],sp[1])}
  return sp}

/* Nord: palazzo del Conte, banca, teatro, ville, piazza con fontana, giardini all'italiana e roseto */
function genNord({R4,D,F,H,gate,N2,RS,scat,n}){
  R4(26,12,4,43,4);R4(3,14,50,2,4);R4(3,30,50,2,4);R4(3,44,50,2,4);R4(19,20,18,10,4);R4(25,22,6,6,2);DEC[24][27]='U';R4(9,24,2,6,4);
  H({x:20,y:2,w:16,h:10,st:'cas',wall:'#ece6d8',ht:46,to:'in_palazzo',dx:27});
  H({x:5,y:18,w:9,h:6,st:'tem',wall:'#f0ece0',roof:'#4a6a8a',ht:34,to:'in_banca',dx:9});
  H({x:39,y:18,w:12,h:8,st:'col',wall:'#e8dcc4',ht:34,to:'in_teatro',dx:45});R4(45,27,1,3,4);
  [[4,3,9,7,'#3a5a8a',1],[41,3,10,7,'#2a6a4a',2],[4,34,8,6,'#6a3a8a',3],[43,34,9,6,'#8a3a3a',4],[5,47,9,5,'#2a5a6a',5],[41,47,10,5,'#4a4a5a',6]].forEach(([x,y,w,h,r,i])=>{const dx=x+(w>>1),ty=y+h+1;H({x,y,w,h,wall:'#f4efe4',roof:r,ht:28,to:'in_villa'+i,dx});R4(dx,ty,1,i<=2?14-ty:i<=4?44-ty:1,4)});R4(3,53,23,1,4);R4(30,53,24,1,4);
  for(const[x,y]of[[19,20],[36,20],[19,29],[36,29]])F(x,y,'Y');
  const garden=(x0,y0,w,h)=>{for(let x=x0;x<x0+w;x++)for(let y=y0;y<y0+h;y++){const e=x===x0||x===x0+w-1||y===y0||y===y0+h-1,mid=Math.abs(x-(x0+(w-1)/2))<1||Math.abs(y-(y0+(h-1)/2))<1;if(e&&!mid)D(x,y,'j')}};
  garden(14,33,10,10);garden(31,33,10,10);
  for(const ox of[14,31]){for(const[x,y]of[[2,2],[7,2],[2,7],[7,7]])D(ox+x,33+y,'o');D(ox+4,37,'Y');D(ox+2,35,'n');D(ox+7,39,'n');D(ox+5,40,'h');D(ox+3,36,'h')}
  garden(14,47,10,6);for(const y of[48,50])for(let x=15;x<=22;x++)if(x!==18&&x!==19)D(x,y,'e');
  for(const[x,y]of[[15,49],[17,49],[20,49],[22,49],[15,51],[17,51],[20,51],[22,51],[16,46],[21,46]])RS('rosa',x,y);
  for(let x=32;x<=39;x+=3)for(let y=48;y<=51;y+=3)D(x,y,'r');D(34,50,'n');D(37,49,'n');
  for(let x=4;x<53;x+=4)for(const y of[13,16,29,32,43,46])D(x,y,'r');
  scat(2,2,52,52,'o',.01);scat(2,2,52,52,'h',.015);
  for(const x of[22,25,30,33])for(const y of[20,29])F(x,y,'p');
  for(const[x,y]of[[6,16],[33,13],[50,29],[18,43],[37,46]])D(x,y,'$');
  for(const y of[34,38,48])D(25,y,'n'),D(30,y,'n');
  for(const[x,y]of[[3,12],[14,12],[38,12],[52,12],[3,41],[13,41],[41,41],[52,41]])D(x,y,'o');
  Object.assign(gate(27,54,'town'),{st:'cancello',dir:'x',span:3,off:-1.5,eo:1,sw:-1,sty:'nobile'});R4(26,54,4,1,4);
  N2('giardiniere',18,46);N2('beatrice',23,26);N2('lorenzo',33,24);N2('guardia_nord',25,52);
  [['Lady Clarissa','#8a2a5a','#f0d0e0',27,36],['Sir Edmondo','#2a3a6a','#d4af37',10,31],['Marchesa Ottavia','#6a4a8a','#ffffff',45,31],['Barone Ugolino','#5a3a2a','#2a2a2a',31,45]].forEach(([nm,c,hat,x,y])=>N2('nobile',x,y,{n:nm,c,hat,wd:1}));
  return[27,52]}

/* Est: campi di grano, mulino, bosco dei taglialegna con segheria, fattoria, pascoli, frutteto, vigne e orti */
function genCampi({R4,D,F,W,H,gate,N2,AN,RS,scat,fence,n}){
  R4(1,26,53,2,4);R4(26,2,2,52,4);R4(3,38,23,2,4);R4(8,37,2,1,4);
  H({x:13,y:2,w:8,h:8,st:'mill',wall:'#e8e0d0',roof:'#8a4a2a',ht:62,to:'in_mulino',dx:17});
  for(const[x0,y0,w,h]of[[3,3,8,6],[3,11,8,6],[3,18,8,6],[13,11,10,6],[13,18,10,6]]){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)W(x,y,'g');
    F(x0+(w>>1),y0+(h>>1),'E');for(let k=0;k<4;k++){const x=x0+ri(0,w-1),y=y0+ri(0,h-1);if(M[y][x]===0)RS('grano',x,y)}}
  H({x:34,y:15,w:9,h:6,wall:'#8a6a4a',roof:'#5a3a2a',ht:26,to:'in_segheria',dx:38,smoke:1});R4(38,21,2,5,4);
  scat(30,2,24,22,'r',.3);for(let x=29;x<n-1;x++){M[9][x]=0;DEC[9][x]=''}for(let y=2;y<26;y++){M[y][45]=0;DEC[y][45]=''}
  for(const[x,y]of[[31,8],[35,10],[40,8],[44,12],[46,5],[50,10],[47,18],[44,22],[52,8],[33,11]]){F(x,y,'m');RS('legna',x+(M[y][x+1]===0?1:-1),y)}
  for(const[x,y]of[[33,22],[44,21],[45,17],[31,23]])F(x,y,'L');F(41,23,'x');F(32,13,'L');
  H({x:4,y:31,w:8,h:6,wall:'#e8d8b8',roof:'#8a3a2a',ht:26,to:'in_fattoria',dx:8,smoke:1});
  H({x:14,y:30,w:9,h:7,wall:'#a83a2a',roof:'#5a2a1a',ht:30,to:'in_fienile',dx:18});
  for(const[x,y]of[[23,31],[23,33],[3,30]])D(x,y,'y');
  fence(16,41,7,5,[[19,41]]);F(17,42,'G');for(const[x,y]of[[19,43],[20,44],[21,42],[18,44]])RS('uova',x,y);
  AN('gallina',20,43,scl([[-.12,-.1,4,.24,.2,8,'#f4f4f0'],[.08,-.06,10,.1,.12,6,'#f4f4f0'],[.16,-.03,12,.06,.06,2,'#e8a020'],[.1,-.04,16,.04,.08,3,'#d02020'],[-.05,-.05,0,.04,.04,4,'#e8a020'],[.03,-.05,0,.04,.04,4,'#e8a020']],1));
  AN('gallina',21,44,scl([[-.12,-.1,4,.24,.2,8,'#c8763a'],[.08,-.06,10,.1,.12,6,'#c8763a'],[.16,-.03,12,.06,.06,2,'#e8a020'],[.1,-.04,16,.04,.08,3,'#d02020'],[-.05,-.05,0,.04,.04,4,'#e8a020'],[.03,-.05,0,.04,.04,4,'#e8a020']],1));
  fence(3,41,11,13);for(const[x,y]of[[5,43],[11,52],[4,51]])D(x,y,'y');
  for(const[x,y]of[[6,44],[9,47],[6,50],[11,49]])AN('mucca',x,y,beast('#f2efe8',1.1,'#2a2a2a'));
  for(const[x,y]of[[8,43],[10,45],[5,47],[9,51]])AN('pecora',x,y,beast('#f4f4ee',.75,'#3a3a3a'));
  fence(16,47,8,7);for(const[x,y]of[[18,49],[21,51],[19,52]])AN('maiale',x,y,beast('#f0a8a8',.75,'#d08080'));
  for(let x=31;x<=43;x+=3)for(let y=31;y<=40;y+=3){D(x,y,'a');if((x+y)%2)RS('mela',x+1,y)}
  for(const y of[44,46,48,50,52])for(let x=31;x<=45;x++)if(x!==37&&x!==38)D(x,y,'v');
  for(let y=31;y<=41;y++)for(let x=47;x<=53;x++)if((x+y)%3)W(x,y,'q');F(49,44,'W');F(51,47,'E');
  for(const[x,y]of[[21,3],[21,5],[22,4],[21,7]])D(x,y,'i');
  for(const y of[30,32,34,36])D(45,y,'+');for(const[x,y]of[[7,46],[10,50],[5,52]])D(x,y,':');
  for(const[x,y]of[[12,10],[24,24],[29,24],[12,29],[25,41]])D(x,y,'x');
  for(const[x,y]of[[2,29],[13,29],[3,36],[13,37],[29,30],[29,40]])D(x,y,'o');
  fence(28,42,2,12);D(24,46,'W');D(24,50,'y');D(25,52,'y');
  Object.assign(gate(1,26,'town'),{st:'cancello',dir:'y',span:3,off:-1.5,eo:-1,sw:1,sty:'campi'});if(!millOK())for(const[x,y]of[[12,4],[12,8],[22,9],[11,6]])if(M[y][x]===0&&!DEC[y][x]){M[y][x]=6;DEC[y][x]='Г'}
  N2('marta',12,25);N2('pietro',21,9);N2('bruno_b',37,25);N2('elio',14,40);N2('lia_r',30,29);N2('mercante_campi',24,28);
  N2('contadino',27,15,{n:'Contadino Nando',wd:1});N2('contadino',15,27,{n:'Contadina Tilde',c:'#a85a5a',wd:1});N2('contadino',27,44,{n:'Bracciante Ugo',c:'#5a7a3a',wd:1});
  return[3,26]}

/* Ovest: Aldoria Vecchia, quartiere bruciato e abbandonato, con la cappella, il cimitero e la villa di Vexmoor */
function genRovine({R4,D,F,H,gate,N2,RS,EN,scat,n}){
  R4(2,27,52,3,4);R4(14,2,2,52,4);R4(38,2,2,52,4);R4(2,12,52,2,4);R4(2,42,52,2,4);R4(54,27,1,3,4);
  H({x:22,y:3,w:10,h:7,st:'tem',wall:'#7a7a80',roof:'#3a3a44',ht:30,to:'in_cappella',dx:27});R4(27,10,2,2,4);
  const ruin=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const e=x===x0||x===x0+w-1||y===y0||y===y0+h-1;
    if(e){if(x===x0+(w>>1)&&y===y0+h-1)continue;if(R()<.8){M[y][x]=1;DEC[y][x]=''}else D(x,y,'u')}else if(R()<.14)D(x,y,R()<.6?'u':R()<.5?'b':'x')}};
  for(const r of[[3,3,8,7],[3,15,9,9],[3,31,9,8],[3,45,8,7],[17,15,9,8],[27,16,8,8],[17,31,8,8],[28,32,8,7],[41,3,11,8],[41,15,10,9],[41,31,10,8]])ruin(...r);
  R4(20,46,10,5,2);for(let x=42;x<=52;x+=2)for(let y=45;y<=52;y+=2)if(R()<.8)D(x,y,'t');for(let y=44;y<=51;y++){M[y][47]=0;DEC[y][47]=''}for(const[x,y]of[[46,50],[48,50],[46,51],[48,51]]){M[y][x]=0;DEC[y][x]=''}ents.push(po(47,51,'cripta@1',{st:'dun',n:'Cripta Dimenticata'}));for(const[x,y]of[[46,50],[48,50]]){M[y][x]=6;DEC[y][x]='Б'}
  scat(2,2,52,52,'d',.025);scat(2,2,52,52,'u',.025);scat(2,2,52,52,'h',.015);
  const clr=(x,y)=>{M[y][x]=0;DEC[y][x]=''};
  clr(46,6);EN('vexmoor',46,6);
  for(const[x,y]of[[6,5],[7,18],[6,34],[31,19],[46,19],[44,34]]){clr(x,y);ents.push({k:'ch',px:x+.5,py:y+.5,rich:x>40?1:0})}
  for(const[x,y]of[[5,6],[9,20],[8,35],[20,18],[30,20],[21,35],[31,35],[44,18],[45,34],[8,48],[48,5],[22,19]]){clr(x,y);RS('cimelio',x,y)}
  const free=()=>{for(let k=0;k<300;k++){const x=ri(2,n-3),y=ri(2,n-3);if(M[y][x]===0&&!DEC[y][x]&&Math.hypot(x-52,y-28)>10)return[x,y]}return null};
  for(const[t,c]of[['ratto',12],['bandito',9],['spettro',9],['ghoul',7]])for(let i=0;i<c;i++){const p=free();if(p)EN(t,p[0],p[1])}
  for(const[x,y,c]of[[32,46,';'],[35,46,';'],[32,50,';'],[34,48,','],[36,49,'k'],[31,48,'b'],[35,51,'x']])F(x,y,c);
  F(26,24,'Y');F(25,24,'u');F(27,25,'u');scat(2,2,52,52,'{',.008);for(const[x,y]of[[8,40],[50,13]])D(x,y,'W');
  Object.assign(gate(54,28,'town'),{st:'cancello',dir:'y',span:3,off:-1.5,eo:1,sw:-1,sty:'ceneri'});N2('ada',8,28);N2('sentinella',51,29);
  return[52,28]}


/* ---- raccolta, pesca e vendita ---- */
const RESM={grano:()=>[[-.2,-.12,0,.4,.24,10,'#e0c050'],[-.22,-.14,4,.44,.28,2,'#a0702a']],
  legna:()=>[[-.25,-.15,0,.5,.12,6,'#8a5a32'],[-.25,.02,0,.5,.12,6,'#7a4a2a'],[-.2,-.08,6,.4,.12,6,'#8a5a32']],
  mela:()=>[[-.08,-.08,0,.16,.16,5,'#d03a2a'],[-.02,-.02,5,.04,.04,3,'#4a3a2a'],[.1,.04,0,.14,.14,4,'#c8302a']],
  uova:()=>[[-.18,-.15,0,.36,.3,4,'#a0703a'],[-.1,-.08,4,.1,.1,4,'#f4ecdc'],[.02,-.05,4,.1,.1,4,'#f0e4cc']],
  rosa:()=>[[-.12,-.12,0,.24,.24,8,'#3f7a32'],[-.08,-.08,8,.16,.16,4,'#e0304a']],
  cimelio:()=>{const u=Math.sin(t*3)*2;return[[-.1,-.1,4+u,.2,.2,6,'#d4af37'],[-.04,-.04,10+u,.08,.08,3,'#fff2a0']]}};
/* ================= 5.1: ogni edificio dei quartieri si può esplorare, porto con navi e pescatori ================= */
RESN.conchiglia='Conchiglie';RESP.conchiglia=12;
RESM.conchiglia=()=>[[-.12,-.1,0,.24,.2,3,'#f4e0d8'],[-.06,-.05,3,.12,.1,2,'#e8b8b0']];
const ANM={mucca:()=>beast('#f2efe8',1.1,'#2a2a2a'),pecora:()=>beast('#f4f4ee',.75,'#3a3a3a'),maiale:()=>beast('#f0a8a8',.75,'#d08080'),
  gabbiano:()=>[[-.12,-.08,4,.24,.16,6,'#f4f4f4'],[.1,-.05,8,.1,.1,5,'#f4f4f4'],[.2,-.03,9,.08,.04,2,'#e8a020'],[-.3,-.04,7,.2,.08,2,'#9a9aa4'],[0,-.22,8,.12,.14,1,'#9a9aa4'],[0,.08,8,.12,.14,1,'#9a9aa4'],[-.05,-.04,0,.03,.03,4,'#e8a020']]};

/* modelli di interni riutilizzabili (quadrati, porta in basso) */
const TPL={
V:['################','#SS..F....F..SS#','#..............#','#.nn..TTTT..nn.#','#..............#','#p....====....p#','#.....====.....#','#T....====....T#','#.....====.....#','#p....====....p#','#..............#','#BB..S....S..BB#','#..............#','#k............b#','#..............#','#######D########'],
T:['################','#SSSS......SSSS#','#..............#','#CCCCCC..CCCCCC#','#..............#','#.nnnn....nnnn.#','#..............#','#.nnnn....nnnn.#','#..............#','#.nnnn....nnnn.#','#..............#','#.nnnn....nnnn.#','#..............#','#p............p#','#..............#','#######D########'],
K:['##############','#kkkk..SS.bbb#','#k...........#','#k..kk..kk...#','#...kk..kk..b#','#............#','#bb..kk..kk..#','#bb..kk..kk..#','#............#','#.x......kkk.#','#........kkk.#','#k..........b#','#............#','######D#######'],
C:['############','#F..SS...BB#','#..........#','#.TT.....p.#','#.TT.......#','#..........#','#....==....#','#b...==...k#','#....==....#','#..........#','#p........b#','#####D######'],
M:['##############','#iii..zz..iii#','#i....zz....i#','#............#','#..k......k..#','#............#','#.iii....iii.#','#............#','#..====......#','#..====...kk.#','#..........k.#','#b..........b#','#............#','######D#######'],
F:['##############','#yyy..yy..yyy#','#yy........yy#','#............#','#.ff.ff.ff.f.#','#............#','#..x......x..#','#............#','#yy..====..yy#','#....====....#','#.b........b.#','#k..........k#','#............#','######D#######'],
P:['##########','#S..XX..S#','#........#','#.k....c.#','#........#','#..====..#','#..====..#','#b......T#','#........#','####D#####'],
G:['################','#kk.bb....bb.kk#','#..............#','#J............J#','#..BB......BB..#','#J............J#','#......II......#','#..BB..II..BB..#','#J............J#','#..............#','#J..T......T..J#','#..............#','#kk..........bb#','#..............#','#..............#','#######D########'],
S:['##############','#CCCC....CCCC#','#............#','#.HH......HH.#','#.HH......HH.#','#............#','#....====....#','#.HH.====.HH.#','#....====....#','#............#','#bb........bb#','#k..........k#','#............#','######D#######'],
Y:['##############','#LL..ww..AA.k#','#............#','#..LLLLLLL...#','#.L.......L..#','#.L.......L..#','#..LLLLLLL...#','#............#','#k...x....kk.#','#............#','#b.....T....b#','#............#','#............#','######D#######']};
const CRM=['#c8b898','#beae8e','#f4efe4'];
const INT=(n,out,tp,np,c)=>({n,out,lay:TPL[tp],np,fl:(c||CRM)[0],fl2:(c||CRM)[1],wall:(c||CRM)[2]});
const IN6={
in_villa1:INT('Villa Aurora','nord','V',[['duchessa',7,2],['cameriera',4,10]]),
in_villa2:INT('Villa Smeraldo','nord','V',[['silvio',7,2],['servitore',11,12,{n:'Servitore Ercole'}]],['#8a9a7a','#829272','#f4efe4']),
in_villa3:INT('Villa Iris','nord','V',[['pittrice',7,2],['cameriera',11,12,{n:'Modella Bianca',c:'#e8e0f0',hat:'#c86ae8'}]],['#b8a8c8','#ae9ebe','#f4efe4']),
in_villa4:INT('Villa Rossa','nord','V',[['generale',7,2],['servitore',4,10,{n:'Attendente Lino'}]],['#a87a6a','#9e7062','#f4efe4']),
in_villa5:INT('Villa Ponente','nord','V',[['armatore',7,2],['servitore',11,12,{n:'Segretario Rufo'}]],['#8aa0b0','#8096a6','#f4efe4']),
in_villa6:INT('Villa Grigia','nord','V',[['vedova',7,2],['cameriera',11,12,{n:'Governante Marta'}]],['#9a9a9a','#909090','#e4e0d8']),
in_teatro:INT('Teatro dell\'Opera','nord','T',[['impresario',7,4],['attore',6,2],['attrice',9,2],['nobile',3,6,{n:'Spettatore annoiato'}]],['#7a2a2a','#702424','#e8dcc4']),
in_mulino:INT('Mulino di Pietro','campi','M',[['garzone',5,3],['contadino',9,7,{n:'Mugnaia Agnese',c:'#a85a5a'}]],['#9a8a6a','#908062','#e8e0d0']),
in_fienile:INT('Fienile','campi','F',[['stalliere',6,3],['mucca',3,5],['mucca',10,5],['pecora',4,9]],['#8a6a42','#80623e','#a83a2a']),
in_casa_p1:INT('Casa di Teresa','porto','C',[['teresa',5,3],['lucia',7,9]],['#9a8a6a','#908062','#e0d8c8']),
in_casa_p2:INT('Casa di Nonno Marino','porto','C',[['marino',5,3]],['#8a8a7a','#828272','#e0d8c8']),
in_casa_p3:INT('Bottega del Retaio','porto','C',[['retaio',5,3]],['#9a8a6a','#908062','#d8d0c0']),
in_casa_p4:INT('Casa degli Sposi','porto','C',[['marinaio',5,3,{n:'Marco',c:'#2a4a6a'}],['marinaio',7,9,{n:'Giulia',c:'#8a3a5a',hat:'#e8d0e0'}]],['#a89a7a','#9e9072','#e0d8c8']),
in_magazzino1:INT('Magazzino del Porto','porto','K',[['magazziniere',6,5]],['#7a6a5a','#726254','#9a8a7a']),
in_magazzino2:INT('Deposito delle Merci','porto','K',[['facchino',6,5],['losco',3,8]],['#6a5a4a','#625244','#a89a8a']),
in_pescheria:INT('Pescheria del Porto','porto','S',[['ida',3,2],['pescatore',10,2,{n:'Pescatore Saverio'}],['nobile',6,9,{n:'Cuoca del Conte',c:'#e8e0d0',hat:'#ffffff'}]],['#a8b0b4','#9ea6aa','#d8d4c8']),
in_cantiere:INT('Cantiere Navale','porto','Y',[['nico',6,2],['marinaio',3,10,{n:'Carpentiere Remo',c:'#7a5a3a'}]],['#9a7a4a','#8e7044','#8a6a4a']),
in_faro:INT('Faro di Aldoria','porto','P',[['anselmo',4,2]],['#8a8a8a','#808080','#f0ece4']),
in_galeone:INT('La Rondine · stiva','porto','G',[['ferro',7,2],['nostromo',4,9],['cuoco',11,11]],['#6a4a2a','#604426','#5a3a22'])};
for(const k in IN6)Z[k]=Object.assign({lv:0,N:IN6[k].lay.length,bg:'#141820',mus:'inter',int:1},IN6[k]);

Object.assign(NPCS,{
duchessa:{n:'Duchessa Aurora',c:'#d8a0b8',hat:'#ffffff',qs:['nv1'],ln:['Ogni primavera do un ballo tra le rose. Quest\'anno sarà il più bello.','Le mie finestre guardano il Palazzo del Conte. Che noia.']},
cameriera:{n:'Cameriera Nina',c:'#2a2a2a',hat:'#ffffff',ln:['Prego, si accomodi. La padrona arriva subito.','Ho appena lucidato l\'argenteria: non tocchi niente, per favore.']},
servitore:{n:'Servitore',c:'#3a3a3a',hat:'#f0f0f0',ln:['Il signore è occupato, ma può parlargli.','Desidera un tè?']},
silvio:{n:'Mercante Silvio',c:'#2a6a4a',hat:'#d4af37',qs:['nv2'],ln:['Ho fatto fortuna con le spezie di Khem.','Ogni moneta che spendo, la riguadagno il doppio.']},
pittrice:{n:'Pittrice Elena',c:'#6a4a8a',hat:'#e86a8a',qs:['nv4'],ln:['La luce del tramonto su Aldoria... impossibile da dipingere.','Il mio prossimo quadro? Le rovine di Aldoria Vecchia.']},
generale:{n:'Generale Arturo',c:'#8a2a2a',hat:'#d4af37',qs:['nv5'],ln:['Quarant\'anni di servizio al Re. E ora mi annoio in questa villa.','Ai miei tempi i banditi non osavano avvicinarsi alle mura.']},
armatore:{n:'Armatore Cosimo',c:'#2a4a6a',hat:'#1a1a1a',qs:['nv3'],ln:['Metà delle navi del porto sono mie. L\'altra metà lo sarà presto.','La Rondine è il galeone più veloce del regno.']},
vedova:{n:'Vedova Ines',c:'#1a1a1a',hat:'#3a3a3a',qs:['nv6'],ln:['Mio marito è morto nell\'incendio di Aldoria Vecchia.','Accendo una candela per lui ogni sera.']},
impresario:{n:'Impresario Vittorio',c:'#5a1a3a',hat:'#1a1a1a',qs:['nt1','nt2'],ln:['Il teatro è la vita, ma con un finale migliore.','Stasera va in scena «La Corona Spezzata». Tutto esaurito!']},
attore:{n:'Attore Fabio',c:'#c0392b',hat:'#d4af37',ln:['Essere eroe o non essere eroe, questo è il dilemma!','Interpreto Malakar. Il pubblico mi fischia: vuol dire che sono bravo.']},
attrice:{n:'Attrice Serena',c:'#8e44ad',hat:'#f0d0f0',ln:['Il mio ruolo? La Regina perduta. Mi viene da piangere solo a pensarci.','Hai portato dei fiori? Che gentile... ah, no?']},
garzone:{n:'Garzone Tonio',c:'#e8e0d0',hat:'#a87a3a',qs:['cm1'],ln:['Sono tutto bianco di farina, lo so.','Le macine girano giorno e notte quando tira vento.']},
stalliere:{n:'Stalliere Beppe',c:'#6a5a3a',hat:'#4a3a2a',qs:['cf1'],ln:['Le mucche sanno quando arriva un temporale. E un lupo.','Il fieno di quest\'anno profuma di sole.']},
teresa:{n:'Teresa',c:'#7a4a5a',hat:'#e8e0d0',ln:['Mio marito è al largo da tre giorni. Tornerà, torna sempre.','Vuoi un po\' di zuppa di pesce?']},
lucia:{n:'Piccola Lucia',c:'#e86a8a',hat:'#ffd84a',qs:['pc2'],ln:['Da grande farò la capitana!','Sull\'isolotto del faro ci sono le conchiglie più belle.']},
marino:{n:'Nonno Marino',c:'#3a4a6a',hat:'#f0f0f0',qs:['pc1'],ln:['Sessant\'anni di mare. Le mani non mi tremano ancora.','Una volta ho visto il Leviatano. Nessuno mi crede.']},
retaio:{n:'Retaio Gigi',c:'#5a6a7a',hat:'#c8b890',qs:['pc3'],ln:['Una rete ben fatta vale più di una barca.','Nodo dopo nodo, così si ripara il mondo.']},
magazziniere:{n:'Magazziniere Osvaldo',c:'#6a5a4a',hat:'#3a3a3a',qs:['pm1'],ln:['Ogni cassa ha il suo posto. Ogni topo, la sua trappola.','Spezie, stoffe, vino: qui passa di tutto.']},
facchino:{n:'Facchino Bruto',c:'#8a6a4a',hat:'#4a3a2a',ln:['Cento casse al giorno. E la schiena fa male.','Non chiedermi cosa c\'è nelle casse con il marchio nero.']},
losco:{n:'Tipo losco',c:'#2a2a2a',hat:'#1a1a1a',ln:['Non mi hai visto. Non sono qui.','Cerchi merce rara? Torna quando il Doganiere dorme.']},
ida:{n:'Pescivendola Ida',c:'#6a8a9a',hat:'#ffffff',role:'buyer',buy:'fish',qs:['pf1'],ln:['Compro pesce fresco ai prezzi del giorno!','Nella al mercato fa la concorrenza, ma io pago puntuale.']},
pescatore:{n:'Pescatore',c:'#3a5a7a',hat:'#d8c070',ln:['Shh... stanno abboccando.','Oggi il mare è generoso.','Ho preso un branzino così, te lo giuro.','Di notte salgono i calamari: si vede la loro luce.']},
nico:{n:'Apprendista Nico',c:'#8a6a4a',hat:'#d8a020',qs:['py1'],ln:['Un giorno costruirò una nave tutta mia.','Il maestro Ernesto dice che ho buone mani. E troppa fretta.']},
anselmo:{n:'Guardiano del Faro Anselmo',c:'#3a3a5a',hat:'#d8d0c0',qs:['pl1','pl2'],ln:['Centoventi gradini, ogni sera. Le gambe ringraziano.','La lanterna non si è mai spenta da quando ci sono io.']},
ferro:{n:'Capitano Ferro',c:'#1a1a2a',hat:'#c0392b',qs:['pg1','pg2'],ln:['Benvenuto a bordo della Rondine. Non toccare il timone.','Salpiamo per Khem con la prossima marea.']},
nostromo:{n:'Nostromo Gaspare',c:'#4a3a2a',hat:'#2a2a2a',ln:['Issa! Tira quella cima, mozzo!','Il capitano urla, ma è un buon uomo.']},
cuoco:{n:'Cuoco di bordo Peppe',c:'#e8e0d0',hat:'#ffffff',qs:['pg3'],ln:['Gallette e acqua, gallette e acqua... servirebbe del pesce fresco!','In cambusa comando io.']},
gabbiano:{n:'Gabbiano',c:'#f4f4f4',hat:'#f4f4f4',ln:['Kiaaa!','Il gabbiano ti fissa, puntando il tuo pranzo.']}});

Object.assign(QT,{
nv1:{t:'gat',r:'rosa',n:8,ti:'Il ballo delle rose',tx:'Darò un ballo nel mio giardino: mi servono 8 rose del Roseto.',g:100,x:70},
nv2:{t:'fish',f:'branzino',n:4,lv:1,ti:'Banchetto di pesce',tx:'Ho invitato i soci della gilda: portami 4 branzini dal Porto.',g:140,x:95},
nv3:{t:'talk',to:'baldo',ti:'Un affare in porto',tx:'Porta i miei saluti al Capitano Baldo, nella Capitaneria del Porto: abbiamo un affare in sospeso.',g:60,x:40},
nv4:{t:'gat',r:'cimelio',n:3,lv:5,req:'rovine',ti:'Ispirazione antica',tx:'Dipingo le rovine di Aldoria Vecchia. Portami 3 cimeli, voglio ritrarli.',g:200,x:150},
nv5:{t:'kill',e:['bandito'],n:12,lv:5,req:'rovine',ti:'Vecchie abitudini',tx:'Sono in pensione, ma i banditi delle rovine mi tolgono il sonno. Fai tu il lavoro: 12 banditi.',g:300,x:220},
nv6:{t:'kill',e:['spettro'],n:6,lv:5,req:'rovine',ti:'Il fantasma di mio marito',tx:'Dicono che lo spettro di mio marito vaghi ancora tra le rovine. Libera quelle anime: 6 spettri.',g:220,x:160},
nt1:{t:'gat',r:'rosa',n:12,ti:'Rose per la prima',tx:'Stasera c\'è la prima! Mi servono 12 rose da lanciare sul palco.',g:130,x:90},
nt2:{t:'talk',to:'cantastorie',ti:'Una nuova voce',tx:'Alla Locanda del Gabbiano, al Porto, canta una certa Viola. Invitala a esibirsi qui!',g:80,x:55},
cm1:{t:'gat',r:'grano',n:20,lv:1,ti:'Macina a pieno ritmo',tx:'Le macine girano notte e giorno: servono 20 covoni di grano.',g:120,x:85},
cf1:{t:'kill',e:['lupo'],n:12,lv:1,ti:'Lupi alla stalla',tx:'Le mucche non dormono da giorni: ci sono lupi nella foresta. Abbattine 12.',g:110,x:80},
pc1:{t:'fish',f:'sgombro',n:8,ti:'Sgombri per l\'inverno',tx:'Sotto sale, gli sgombri durano tutto l\'inverno. Pescamene 8.',g:90,x:65},
pc2:{t:'gat',r:'conchiglia',n:5,ti:'Conchiglie per Lucia',tx:'Voglio fare una collana di conchiglie! Le più belle sono sull\'isolotto del faro.',g:50,x:40},
pc3:{t:'fish',f:'any',n:10,lv:1,ti:'Reti piene',tx:'Ho finito le reti nuove: pesca 10 pesci e dimmi come tengono.',g:110,x:80},
pm1:{t:'kill',e:['ratto'],n:8,lv:5,req:'rovine',ti:'Topi nel magazzino',tx:'I ratti del Borgo delle Ceneri arrivano fin qui. Vai alla fonte e sterminane 8.',g:190,x:140},
pf1:{t:'fish',f:'calamaro',n:5,lv:2,ti:'Calamari per il banco',tx:'I calamari si vendono come il pane. Pescamene 5, di notte.',g:200,x:140},
py1:{t:'gat',r:'legna',n:15,ti:'Assi per lo scafo',tx:'Il maestro Ernesto vuole finire la barca entro la luna nuova. Servono 15 fasci di legna dai Campi.',g:130,x:90},
pl1:{t:'gat',r:'conchiglia',n:6,ti:'Il guardiano e le conchiglie',tx:'Colleziono conchiglie da quarant\'anni. Cercale sull\'isolotto: portamene 6.',g:90,x:65},
pl2:{t:'kill',e:['uomo_pesce'],n:6,lv:12,ti:'Ombre sotto il faro',tx:'Di notte vedo sagome salire dall\'Abisso. Uomini-pesce: abbattine 6.',g:520,x:380},
pg1:{t:'kill',e:['bandito'],n:10,lv:5,req:'rovine',ti:'Pirati di terra',tx:'I banditi delle rovine hanno saccheggiato il nostro carico. Fagliela pagare: 10 banditi.',g:280,x:200},
pg2:{t:'col',e:['uomo_pesce'],it:'Perle nere',n:4,lv:12,ti:'Perle nere',tx:'Gli uomini-pesce dell\'Abisso custodiscono perle nere. Ne voglio 4 per l\'armatore.',g:560,x:400},
pg3:{t:'fish',f:'sgombro',n:6,ti:'Rancio di bordo',tx:'L\'equipaggio è stufo di gallette. Portami 6 sgombri!',g:80,x:55}});

/* ---- navi ormeggiate: entità decorative sull'acqua, disegnate dall'angolo più vicino alla telecamera ---- */
const SHK={galeone:{l:12,w:3,m:[.22,.5,.78],mh:62,h:'#5a3a22',h2:'#3a2414',dk:'#a07a4a',sl:'#f2ede0',fl:'#c0392b'},
  caravella:{l:8,w:2.6,m:[.35,.7],mh:46,h:'#6a4a2a',h2:'#4a2a1a',dk:'#b08a5a',sl:'#ecdcc0',fl:'#2a6aa8'},
  barca:{l:3.2,w:1.3,m:[.5],mh:22,h:'#7a5a3a',h2:'#5a3a22',dk:'#b08a5a',sl:'#d8c8a8',fl:''},
  gozzo:{l:2,w:.9,m:[],mh:0,h:'#2a6a8a',h2:'#e8e0d0',dk:'#8a6a42',sl:'',fl:''}};
function shipL(e){const K=SHK[e.kind],L=[],wu=K.w,lv=K.l,bz=Math.sin(t*1.1+e.px*.7)*1.4,big=lv>5,
  B=(u,v,z,du,dv,h,c)=>{if(e.dir==='y')L.push([u-e.ex,v-e.ey,z+bz,du,dv,h,c]);else L.push([v-e.ex,u-e.ey,z+bz,dv,du,h,c])};
  B(.08,.4,-7,wu-.16,lv-.9,big?16:9,K.h);B(.25,lv-.55,-6,wu-.5,.45,big?13:8,K.h);
  B(.12,.45,big?9:2,wu-.24,lv-1,1.5,K.dk);B(.06,.38,(big?9:2)-1.5,wu-.12,.08,big?7:3,K.h2);
  if(big){B(.06,.1,-6,wu-.12,1.7,26,K.h2);B(.04,.08,20,wu-.08,1.74,2,K.dk);B(wu/2-.3,.3,22,.6,.4,6,'#ffe08a');
    for(let k=0;k<Math.floor(lv/1.6);k++)B(wu-.1,1.5+k*1.5,3,.06,.35,3,'#20140a');B(wu/2-.1,lv-.2,4,.2,1.2,3,K.h2)}
  K.m.forEach(f=>{const v=lv*f,mz=big?10:3;B(wu/2-.08,v-.08,mz,.16,.16,K.mh,'#5a3a1a');
    for(let s=0;s<(big?3:1);s++){const sw=wu+(big?.9:.4)-s*.3;B(wu/2-sw/2,v-.05,mz+10+s*(K.mh/3.4),sw,.06,K.mh/4.2,K.sl)}
    if(K.fl)B(wu/2,v,mz+K.mh,.5,.04,5,K.fl)});
  if(!K.m.length)B(.15,lv*.45,1,wu-.3,.12,2,'#6b4a2b');
  return L}
const mkShip=(kind,x0,y0,dir)=>{const K=SHK[kind],ex=dir==='y'?K.w:K.l,ey=dir==='y'?K.l:K.w;return{k:'ship',kind,dir,px:x0+ex-.01,py:y0+ey-.01,ex,ey}};

/* Sud: il Porto rifatto */
function genPorto({R4,D,F,H,gate,N2,AN,RS,FS,scat,n}){
  R4(1,30,54,25,2);R4(26,1,3,24,4);R4(2,12,52,2,4);R4(2,25,52,5,4);
  const pier=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>0&&y>0&&x<n-1&&y<n-1){M[y][x]=4;DEC[y][x]='~'}};
  pier(6,30,3,17);pier(3,45,9,2);pier(22,30,5,21);pier(18,49,13,2);pier(36,30,3,15);pier(46,30,2,8);R4(44,38,9,9,0);
  H({x:47,y:40,w:3,h:3,st:'lh',wall:'#f0ece4',ht:120,to:'in_faro',dx:48});
  H({x:4,y:16,w:10,h:7,wall:'#d8c8a8',roof:'#2a5a8a',ht:28,to:'in_locanda',dx:9,smoke:1});
  H({x:40,y:15,w:9,h:7,wall:'#c8c0b0',roof:'#3a3a5a',ht:30,to:'in_capitaneria',dx:44});
  H({x:16,y:16,w:8,h:7,wall:'#9a8a7a',roof:'#5a4a3a',ht:26,to:'in_magazzino1',dx:20});
  H({x:31,y:16,w:7,h:7,wall:'#a89a8a',roof:'#4a3a2a',ht:26,to:'in_magazzino2',dx:34});
  for(const dx of[9,44,20,34])R4(dx,23,1,2,4);
  H({x:17,y:4,w:9,h:7,wall:'#d8d4c8',roof:'#2a7a8a',ht:26,to:'in_pescheria',dx:21});
  H({x:46,y:3,w:8,h:8,wall:'#8a6a4a',roof:'#5a3a2a',ht:30,to:'in_cantiere',dx:50,smoke:1});
  [[3,3,'#3a6a8a','in_casa_p1'],[10,3,'#8a5a3a','in_casa_p2'],[30,3,'#2a6a5a','in_casa_p3'],[38,3,'#6a3a3a','in_casa_p4']].forEach(([x,y,r,to])=>{H({x,y,w:6,h:6,wall:'#e0d8c8',roof:r,ht:22,to,dx:x+3});R4(x+3,y+7,1,2,4)});
  ents.push(mkShip('galeone',27,33,'y'),mkShip('caravella',33,33,'y'),mkShip('barca',9.1,33,'y'),mkShip('barca',4.3,35,'y'),mkShip('barca',39.2,32,'y'),mkShip('barca',12,47,'x'),
    mkShip('gozzo',31,47,'x'),mkShip('gozzo',14,40,'x'),mkShip('gozzo',41,48,'x'),mkShip('gozzo',16,53,'x'));
  ents.push(po(26,38,'in_galeone',{st:'door',n:'Passerella · La Rondine'}));
  for(const[x,y]of[[12,36],[30,52],[40,51],[52,34],[19,44]])if(M[y][x]===2)DEC[y][x]='O';
  for(const[x,y]of[[15,33],[33,46],[42,36],[20,40],[10,52],[53,48],[44,33]])if(M[y][x]===2)DEC[y][x]='^';
  for(const x of[12,14,29,37,39])D(x,24,'s');for(const x of[16,24])D(x,24,'H');for(const x of[46,47,48])D(x,24,'N');
  for(const[x,y,c]of[[5,26,'&'],[51,26,'&'],[31,26,'@'],[16,25,'Ы'],[17,25,'Щ'],[12,25,'Щ'],[24,25,'Л'],[29,25,'Ы'],[38,25,'Ъ'],[39,25,'Ъ'],[44,25,'Л'],[45,25,'Ы'],[53,27,'Ф'],[2,27,'Ф']])F(x,y,c);
  for(const[x,y,c]of[[50,15,'L'],[52,15,'L'],[51,18,'L'],[52,21,'x'],[50,22,'k'],[53,22,'b'],[48,13,'@']])D(x,y,c);
  for(const[x,y]of[[44,38],[52,38],[52,46],[44,46]])D(x,y,'u');
  for(const[x,y]of[[45,39],[51,39],[51,45],[46,45],[50,43],[45,42]])RS('conchiglia',x,y);
  scat(2,14,52,9,'h',.025);scat(2,1,52,10,'o',.012);for(const x of[2,9,16,30,37,44,53])D(x,11,'r');
  const fisher=(x,y,ox,oy,nm,c)=>{const e=N2('pescatore',x,y,{n:nm,c,hat:'#d8c070',rod:1});e.fc0=faceOf(ox,oy)};
  fisher(6,33,-1,0,'Pescatore Sandro','#3a5a7a');fisher(8,39,1,0,'Pescatrice Mena','#7a4a5a');fisher(24,50,0,1,'Pescatore Tano','#4a6a3a');
  fisher(38,38,1,0,'Pescatore Mimmo','#6a5a3a');fisher(46,33,-1,0,'Pescatore Orazio','#2a4a6a');fisher(15,29,0,1,'Pescatore Ciro','#5a3a3a');fisher(44,44,-1,0,'Pescatore Leone','#3a3a5a');
  for(const s of[[3,46,0,1],[11,46,0,1],[6,42,-1,0],[18,50,0,1],[30,50,0,1],[22,40,-1,0],[38,44,0,1],[36,41,-1,0],[47,35,1,0],[52,42,1,0],[44,41,-1,0],[14,29,0,1],[33,29,0,1],[51,29,0,1]])FS(...s);
  for(const[x,y]of[[10,27],[36,28],[48,26],[24,27]])AN('gabbiano',x,y,ANM.gabbiano());
  N2('ammiraglio',36,33);for(const[x,y,c]of[[44,40,'Ю'],[44,42,'Ю'],[46,40,'Я'],[45,43,'Ь'],[46,42,'Ю']])F(x,y,c);
  // 7.12: il pozzo delle alghe sta sulla banchina, in fondo alla strada che scende dalla città: lo si vede appena si arriva al porto
  // (prima era sull'isolotto del faro, nascosto dietro la torre). Intorno una lanterna, scogli con le alghe e il cartello.
  ents.push(po(27,27,'abisso@1',{st:'pozzo',n:'Pozzo delle alghe · Abisso Sommerso'}));for(const[x,y,c]of[[26,26,'Ю'],[28,26,'Ю'],[28,28,'Э'],[26,28,'₪c']])F(x,y,c);R4(21,1,12,2,4);for(const[x,y,c]of[[21,2,'Y'],[32,2,'Y'],[23,1,'l'],[31,1,'l'],[24,2,'§'],[30,2,'§'],[21,1,'o'],[32,1,'o']])F(x,y,c);Object.assign(gate(27,1,'town'),{st:'cancello',dir:'x',span:3,off:-1.5,eo:-1,sw:1,sty:'mare'});
  N2('gino',23,28);{const s73=N2('stefano',10,45);s73.fc0=faceOf(1,0)}N2('nella',21,24);N2('doganiere',33,27);N2('rocco',37,30);N2('pippo',11,28);N2('ernesto',51,13);
  N2('marinaio',27,10,{n:'Marinaio Tito',wd:1});N2('marinaio',15,27,{n:'Marinaia Sara',c:'#6a3a3a',wd:1});N2('marinaio',38,13,{n:'Nostromo Lupo',c:'#3a3a3a',wd:1});
  return[27,3]}

function gather(e){e.k='resx';e.rt=t+75;P.res[e.r]=(P.res[e.r]||0)+1;flt(e,'+1 '+RESN[e.r],'#ffe08a');tone(660,.06,'triangle');if(cineOK())sparks(e.px,e.py,8,['#ffe08a','#ffffff'],40);
  for(const q of P.q){const T=QT[q.id];if(T.t==='gat'&&T.r===e.r&&!qReady(q)){q.c++;msg(T.ti+': '+q.c+'/'+T.n);if(qReady(q))jingle([67,72])}}npcMarks();hud()}
let FSH=null,FST=0;
function fishPick(){const nt=isNight(),rb=(P.rod>=2?1.8:1)*(arguments[0]?1.5:1),L=FISHT.filter(f=>!f.nt||nt).map(f=>[f,f.w*(f.p>=30?rb:1)]);let r=Math.random()*L.reduce((a,b)=>a+b[1],0);for(const[f,w]of L){if((r-=w)<0)return f}return L[0][0]}
function fishStart(){FSH={ph:'wait',tw:performance.now()+1200+Math.random()*2800,pos:0,dir:1,f:null,z0:0,z1:0,msg:'Hai lanciato la lenza... aspetta che abbocchi.'};clearInterval(FST);FST=setInterval(fishTick,30);pn('fish')}
function fishTick(){if(PM!=='fish'||!FSH){clearInterval(FST);return}const now=performance.now(),F=FSH;
  if(F.ph==='wait'&&now>=F.tw){F.f=fishPick();const w=Math.max(.08,(.34-F.f.d*.24)*(P.rod>=2?1.3:1));F.z0=Math.random()*(1-w);F.z1=F.z0+w;F.ph='bite';F.te=now+3200;F.sp=.55+F.f.d*1.5;F.msg='Qualcosa ha abboccato!';tone(880,.08,'triangle');pn('fish');return}
  if(F.ph==='bite'){F.pos+=F.dir*F.sp*.03;if(F.pos>1){F.pos=1;F.dir=-1}if(F.pos<0){F.pos=0;F.dir=1}const mk2=$('fmk');if(mk2)mk2.style.left=(F.pos*100)+'%';if(now>F.te){F.ph='end';F.msg='Il pesce si è liberato ed è scappato!';tone(150,.2);pn('fish')}}}
function fishPull(){const F=FSH;if(!F)return;if(F.ph==='wait'){F.ph='end';F.msg='Troppo presto! Hai spaventato i pesci.';tone(150,.2);pn('fish');return}
  if(F.ph!=='bite')return;const f=F.f;F.ph='end';
  if(F.pos>=F.z0&&F.pos<=F.z1){P.fish[f.id]=(P.fish[f.id]||0)+1;F.msg=f.id==='stivale'?'Hai pescato... uno stivale vecchio.':'Preso! '+f.n+(f.p>=90?': una rarità!':'');jingle(f.p>=90?[72,76,79,84,88]:[67,72,76],.09,'triangle');
    for(const q of P.q){const T=QT[q.id];if(T.t==='fish'&&(T.f==='any'?f.id!=='stivale':T.f===f.id)&&!qReady(q)){q.c++;msg(T.ti+': '+q.c+'/'+T.n);if(qReady(q))jingle([67,72])}}npcMarks();hud();save()}
  else{F.msg='Strattone sbagliato: '+f.n+' è scappato.';tone(150,.2)}pn('fish')}
const fishList=()=>FISHT.filter(f=>P.fish[f.id]>0).map(f=>f.n+' ×'+P.fish[f.id]).join(', ');
function buyRod(){const lv=P.rod?2:1,c=px('rod'+lv,lv===1?60:300);if(P.rod>=2)return;if(pay(c)){P.rod=lv;msg(lv===1?'Hai una canna da pesca! Cerca i galleggianti rossi sui moli.':'Canna di quercia: zona di presa più larga e più pesci rari.');jingle([67,72,76]);save();pn('npc')}}
function sellR(id,one){const fm=FISHT.find(f=>f.id===id),src=fm?P.fish:P.res,b=fm?fm.p:RESP[id],c=src[id]|0;if(!c)return;const k=one?1:c,gd=px('s_'+id,b)*k;src[id]=c-k;P.g+=gd;goldFly(gd);tone(700,.08);hud();save();pn('sellres')}

/* ================= 6.0: dungeon unici, animazioni, versi, vetrine, motel, battaglia navale, prologo ================= */
Object.assign(TRK,{
  tana:{bpm:112,root:48,sc:'phr',pr:[0,1,0,4],ld:'square',dn:.5,dr:1,bs:[0,3,8,11]},
  cripta:{bpm:62,root:45,sc:'min',pr:[0,5,1,4],ld:'sine',dn:.25,dr:2,pad:1,arp:1},
  piramide:{bpm:92,root:50,sc:'hm',pr:[0,1,5,4],ld:'square',dn:.45,dr:1,bs:[0,6,8,14]},
  cristallo:{bpm:76,root:52,sc:'lyd',pr:[0,4,1,5],ld:'sine',dn:.4,arp:1,pad:1,dr:0},
  fucina:{bpm:124,root:43,sc:'hm',pr:[0,0,5,1],ld:'sawtooth',dn:.5,dr:3,bs:[0,2,8,10]},
  abisso:{bpm:68,root:46,sc:'dor',pr:[0,3,5,4],ld:'sine',dn:.3,arp:1,pad:1,dr:2},
  cittadella:{bpm:84,root:44,sc:'phr',pr:[0,1,4,1],ld:'sawtooth',dn:.42,pad:1,dr:2},
  naval:{bpm:132,root:50,sc:'dor',pr:[0,6,3,4],ld:'square',dn:.6,dr:3,bs:[0,3,6,8,11,14]},
  boarding:{bpm:158,root:45,sc:'hm',pr:[0,5,1,4],ld:'sawtooth',dn:.66,dr:3,bs:[0,2,4,6,8,10,12,14]},
  intro:{bpm:66,root:45,sc:'min',pr:[0,5,3,4,0,5,6,4],ld:'triangle',dn:.32,pad:1,arp:1,dr:0},
  motel:{bpm:96,root:55,sc:'lyd',pr:[0,3,1,4],ld:'triangle',dn:.5,spb:12,waltz:1,bs:[0]}});

/* ---- dungeon: storia, nemici propri, arredi e muri unici ---- */
const DLORE={tana:'Grugnak, il Re dei Goblin, ha trovato il primo frammento e ne ha fatto un trofeo. Da allora i suoi goblin non conoscono paura.',
  cripta:'Qui Malakar compì il suo primo rito proibito. I morti della cripta si svegliarono quella stessa notte, e non hanno più dormito.',
  piramide:'La Sfinge di Khem custodisce un frammento e pone un enigma a chi entra. Nessuno, finora, ha saputo rispondere.',
  cristallo:'Il frammento caduto qui ha congelato le caverne in un istante. La Regina di Cristallo ne è insieme prigioniera e padrona.',
  fucina:'Ignis forgiò per Malakar le catene che spezzarono la Corona. Ora usa un frammento per alimentare un fuoco che non si spegne.',
  abisso:'Il Leviatano ha inghiottito il frammento caduto in mare. Da quella notte le maree di Aldoria non sono più tornate come prima.',
  cittadella:'La fortezza di Malakar galleggia sul Vuoto. Ogni pietra è un ricordo rubato al regno.'};
Object.assign(E,{
  sciamano_goblin:{n:'Sciamano Goblin',hp:40,at:12,xp:16,sp:1.6,r:5,cd:2.2,ag:8,rng:'#7aff7a',m:hum('#3a6a3a','#7cc04a',.9,[8,'#c84a2a'])},
  cavalcalupi:{n:'Cavalcalupi',hp:60,at:13,xp:18,sp:3,r:1.2,cd:1,ag:9,m:beast('#7a6a5a',1.1,'#2a2a2a').concat(hum('#4a6b2a','#7cc04a',.6,[3,'#663333']).map(b=>[b[0],b[1],b[2]+10,b[3],b[4],b[5],b[6]]))},
  banshee:{n:'Banshee',hp:45,at:15,xp:20,sp:1.9,r:4.5,cd:2,ag:9,rng:'#bfe8ff',m:elem('#cfe8ff',1)},
  cavaliere_ossa:{n:'Cavaliere d\'Ossa',hp:120,at:18,xp:28,sp:1.5,r:1.3,cd:1.4,ag:7,m:hum('#cfc8b8','#e8e4d8',1.35,[6,'#5a5a64'])},
  anubi:{n:'Guardiano Anubi',hp:110,at:20,xp:30,sp:1.8,r:1.3,cd:1.3,ag:8,m:hum('#1a1a1a','#d4af37',1.3,[10,'#1a1a1a'])},
  scorpione_reale:{n:'Scorpione Reale',hp:90,at:19,xp:26,sp:2.4,r:1.2,cd:1.1,ag:8,m:beast('#d4af37',1.3,'#8a6a1a')},
  spettro_cristallo:{n:'Spettro di Cristallo',hp:70,at:22,xp:30,sp:1.8,r:4.5,cd:2,ag:9,rng:'#e0b0ff',m:elem('#b86aff',1.1)},
  lupo_cristallo:{n:'Lupo di Cristallo',hp:85,at:21,xp:28,sp:3,r:1.2,cd:1,ag:9,m:beast('#9adcff',1.05,'#e8f8ff')},
  fabbro_demone:{n:'Fabbro Demone',hp:180,at:30,xp:40,sp:1.3,r:1.4,cd:1.6,ag:7,m:hum('#5a1a10','#ff6a2a',1.5,[4,'#2a2a2a'])},
  salamandra:{n:'Salamandra',hp:90,at:26,xp:34,sp:2.2,r:4,cd:1.8,ag:8,rng:'#ff9a3a',m:beast('#ff7a2a',.9,'#ffd04a')},
  sirena:{n:'Sirena dell\'Abisso',hp:90,at:28,xp:38,sp:1.7,r:5,cd:2,ag:9,rng:'#7affe8',m:hum('#2a8a8a','#9ae0d0',1,[8,'#3ab0a0'])},
  anguilla:{n:'Anguilla Abissale',hp:110,at:30,xp:38,sp:3.2,r:1.2,cd:1,ag:9,m:beast('#2a6a5a',1.25,'#1a3a3a')},
  cavaliere_vuoto:{n:'Cavaliere del Vuoto',hp:220,at:36,xp:50,sp:1.6,r:1.4,cd:1.4,ag:9,m:hum('#2a1a3a','#c46bff',1.4,[8,'#c46bff'])},
  occhio_vuoto:{n:'Occhio del Vuoto',hp:120,at:34,xp:46,sp:1.5,r:5,cd:1.9,ag:10,rng:'#ff4aff',m:elem('#c46bff',.8)},
  pirata:{n:'Pirata',hp:55,at:13,xp:18,sp:2.2,r:1.2,cd:1,ag:14,m:hum('#7a2a2a','#c09070',1,[3,'#cc2222'])},
  pirata_pistola:{n:'Pirata con pistola',hp:45,at:15,xp:20,sp:1.8,r:4.5,cd:1.9,ag:14,rng:'#ffcc66',m:hum('#2a3a5a','#c09070',1,[4,'#1a1a1a'])},
  scarlatto:{n:'Capitano Scarlatto',hp:600,at:26,xp:420,sp:2,r:1.6,cd:1.2,ag:16,boss:1,m:hum('#8a1a1a','#e0b090',1.6,[8,'#111111'])}});
const DGX={tana:['sciamano_goblin','cavalcalupi'],cripta:['banshee','cavaliere_ossa'],piramide:['anubi','scorpione_reale'],cristallo:['spettro_cristallo','lupo_cristallo'],fucina:['fabbro_demone','salamandra'],abisso:['sirena','anguilla'],cittadella:['cavaliere_vuoto','occhio_vuoto']};
for(const k in DGX)if(DG[k])DG[k].en=DG[k].en.concat(DGX[k]);
const DPROP={cave:'123{',crypt:'45{4',pyr:'674',ice:'898',fire:'0!A',sea:'%?%',void:'<><'};
function decorDG(z,sp){const th=TH[z.th]?z.th:DG[z.dg].th,set=DPROP[th];if(!set)return;const r=sd(hs(Zk+'arredi'));
  for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){if(M[y][x]!==0||DEC[y][x]||r()>.045)continue;if(Math.abs(x-sp[0])<3&&Math.abs(y-sp[1])<3)continue;
    let open=true;for(let dy=-1;dy<=1&&open;dy++)for(let dx=-1;dx<=1;dx++)if(M[y+dy][x+dx]!==0||(dx||dy)&&DEC[y+dy][x+dx]){open=false;break}if(!open)continue;if(ents.some(e=>(e.px|0)===x&&(e.py|0)===y))continue;
    M[y][x]=6;DEC[y][x]=set[Math.floor(r()*set.length)]}}
function wallOrn(x,y,h,z){const top=36+h*10;switch(z.th){
  case 'cave':if(h>.55)box(x+.2,y+.2,top,.3,.3,4+h*8,z.o,.8);break;
  case 'crypt':if(h>.6){box(x+.3,y+.97,10,.4,.04,14,'#141620');if(h>.8)box(x+.42,y+.99,13,.16,.03,5,'#e8e4d8')}break;
  case 'pyr':box(x-.01,y-.01,22,1.02,1.02,3,'#d4af37',.9);if(h>.7)box(x+.3,y+.98,8,.4,.03,8,'#3a5aa8');break;
  case 'ice':if(h>.4)box(x+.3+h*.2,y+.3,top,.22,.22,8+h*14,'#d8f6ff',1.15);break;
  case 'fire':if(h>.55)box(x+.97,y+.25,4,.04,.5,18,'#ff6a1a',1.2+Math.sin(t*4+x)*.1);break;
  case 'sea':if(h>.5){box(x+.2,y+.55,top,.18,.18,6,'#ff7a8a');box(x+.6,y+.25,top,.14,.14,9,'#ffb04a')}break;
  case 'void':if(h>.65)box(x+.35,y+.35,top+16+Math.sin(t*2+x+y)*4,.3,.3,6,'#c46bff',1.2);break}}

/* ---- animazioni: passo, attacco, parlata ---- */
function walkA(L,ph){const s=Math.sin(ph),a=Math.max(0,s)*2.6,b=Math.max(0,-s)*2.6,m=(q,dz)=>[q[0],q[1],q[2]+dz,q[3],q[4],q[5],q[6]];
  return L.map((q,i)=>i===0?[q[0],q[1],q[2]+a,q[3],q[4],Math.max(1,q[5]-a),q[6]]:i===1?[q[0],q[1],q[2]+b,q[3],q[4],Math.max(1,q[5]-b),q[6]]:i===3?m(q,s*1.2):i===4?m(q,-s*1.2):q)}
function talkA(L){const k=Math.abs(Math.sin(t*13))*1.1,m=(q,dz)=>[q[0],q[1],q[2]+dz,q[3],q[4],q[5],q[6]];return L.map((q,i)=>i>=5?m(q,k):i===3?m(q,Math.sin(t*6)*1.5):q)}
function idleA(L,e){const k=Math.sin(t*2.2+e.px*1.3)*.5,m=(q,dz)=>[q[0],q[1],q[2]+dz,q[3],q[4],q[5],q[6]];return L.map((q,i)=>i>=2?m(q,k):q)}

/* ---- versi dei personaggi quando parlano ---- */
function vtone(t0,m,d,tp,gl,v=.05){const ac=AU.ac,o=ac.createOscillator(),gn=ac.createGain(),f=440*Math.pow(2,(m-69)/12);o.type=tp;o.frequency.setValueAtTime(f,t0);o.frequency.exponentialRampToValueAtTime(f*(gl||.85),t0+d);
  gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+.012);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(gn);gn.connect(AU.sf);o.start(t0);o.stop(t0+d+.03)}
function voice(e){const ac=AU.ac;if(!ac||!SET.sf||!e)return;try{const t0=ac.currentTime+.03,id=e.nid||'',n=(e.n||'').toLowerCase();
  if(id==='dino'){for(let i=0;i<10;i++)vtone(t0+i*.085,46+(i%3)*6,.1,'square',.72,.15);vtone(t0+.9,38,.55,'sawtooth',.6,.18);return}
  if(id==='mucca'){vtone(t0,43,.9,'sawtooth',.75,.06);vtone(t0,55,.9,'triangle',.8,.04);return}
  if(id==='pecora'){for(let k=0;k<5;k++)vtone(t0+k*.08,64,.09,'sawtooth',.95,.035);return}
  if(id==='maiale'){vtone(t0,50,.12,'square',.6,.05);vtone(t0+.16,53,.14,'square',.55,.05);return}
  if(id==='gallina'){for(let k=0;k<4;k++)vtone(t0+k*.11,76+(k%2)*3,.07,'square',1.25,.035);return}
  if(id==='gabbiano'){vtone(t0,86,.22,'triangle',.7,.05);vtone(t0+.26,84,.3,'triangle',.65,.05);return}
  if(id==='gatto'){vtone(t0,72,.38,'triangle',.78,.05);return}
  if(/cavall|saetta|biscotto|tempesta/.test(id+n)){for(let k=0;k<7;k++)vtone(t0+k*.06,76-k,.08,'sawtooth',.9,.035);return}
  const h=hs(id+n),base=(/a$|essa|ina|ora$/.test(n.split(' ').pop()||'')?62:50)+(h%12),tp=['triangle','square','sine'][h%3],k=4+(h>>4)%5;
  for(let i=0;i<k;i++)vtone(t0+i*.085,base+((hs(id+i+Math.floor(t))%7)-3),.07,tp,.82+Math.random()*.2,tp==='square'?.025:.045)}catch(_){}}

/* ---- vetrine dei mercanti: set che si rinnovano ogni giorno di gioco ---- */
const SETN=['del Lupo','del Grifone','della Fenice','del Leone','dell\'Aquila','del Drago','della Tempesta','del Corvo','dell\'Orso'],SLOTN={w:'Spada',h:'Elmo',c:'Corazza',s:'Scudo'},STC={};
function stockOf(id){const d=gDay(),key=id+'#'+d+'#'+Math.floor(P.lv/3)+'#'+(P.st||0);if(STC[key])return STC[key];const r0=R;R=sd(hs('vetrina'+key));const L=[];
  if(id==='borin'){for(const[k,mr]of[[0,1],[3,2]]){const nm=SETN[(d+k)%SETN.length];for(const s of 'whcs'){const it=item(P.lv+2+mr,mr,s);it.n=SLOTN[s]+' '+nm+(mr>1?' (epico)':'');L.push(it)}}}
  else for(let i=0;i<6;i++)L.push(item(P.lv+1,i<1?1:0,'whcs'[i%4]));
  R=r0;L.forEach((it,i)=>{it.u='st#'+d+'#'+id+i;it.price=Math.max(10,Math.round(it.p*2.2*pf('st_'+id+i)*itemPM(it)))});return STC[key]=L}
function stockHTML(id){const L=stockOf(id),d=gDay(),rem=Math.max(0,Math.round(DAYM-((gNow()%DAYM)+DAYM)%DAYM)),mm=Math.floor(rem/60),ss=rem%60;
  for(const k in P.sold)if(!k.includes('#'+d+'#'))delete P.sold[k];
  let h=`<h4>${id==='borin'?'⚔ In vetrina: Set '+SETN[d%SETN.length]+' e Set '+SETN[(d+3)%SETN.length]:'🛍 Merce del giorno'} <small class="mu">nuovo assortimento tra ${mm}:${String(ss).padStart(2,'0')}</small></h4><div class="stk">`;
  L.forEach((it,i)=>{const so=P.sold[it.u];h+=`<div class="si${so?' so':''}">${fmt(it)} ${so?'':cmp(it)}<br>${so?'<span class="mu">Venduto</span>':`<button onclick="buyStk('${id}',${i})">Compra · ${it.price}💰</button>`}</div>`});return h+'</div>'}
function buyStk(id,i){const it=stockOf(id)[i];if(!it||P.sold[it.u]||!bagOk())return;if(!pay(it.price))return;const c=JSON.parse(JSON.stringify(it));c.u=uid();delete c.price;P.sold[it.u]=1;gain(c);if(cineOK())sceneEquip();jingle([67,72,76],.08,'triangle');save();pn(PM)}

/* ---- motel a due piani con stanze in affitto e baule personale ---- */
const ROOMT=['############','#BB..S..F..#','#..........#','#.T........#','#........p.#','#..........#','#...====...#','#...====...#','#..........#','#b........k#','#..........#','#####D######'];
const INM={in_motel:{n:'Motel della Rosa dei Venti',out:'town',fl:'#8a5a4a',fl2:'#805244',wall:'#e8d8b0',np:[['portiere',6,2],['ospite',3,9]],po:[[12,6,'in_motel2','Scale · primo piano']],mus:'motel',lay:[
  '##############','#p..CCCC....S#','#............#','#.nn......nn.#','#.T........T.#','#.nn......nn.#','#............#','#....====....#','#p...====...p#','#....====....#','#k..........b#','#............#','#............#','######D#######']},
  in_motel2:{n:'Motel · primo piano',fl:'#7a4a3a',fl2:'#704436',wall:'#e8d8b0',np:[['cameriera',8,6,{n:'Cameriera Rina'}]],mus:'motel',po:[[1,7,'in_motel','Scale · piano terra']],lay:[
  '################','#..............#','#..............#','#S.....==.....S#','#......==......#','#p.....==.....p#','#......==......#','#......==......#','#......==......#','#p.....==.....p#','#......==......#','#S.....==.....S#','#..............#','#..............#','#..............#','################']}};
[[2,1],[7,1],[12,1],[2,14],[7,14],[12,14]].forEach(([x,y],i)=>{const n=i+1;INM.in_motel2.po.push([x,y,'in_stanza'+n,'Stanza '+n,{lock:'room'+n,lockMsg:'La stanza '+n+' non è tua: affitta una stanza alla reception, al piano terra.'}]);
  INM['in_stanza'+n]={n:'Stanza '+n+' del Motel',out:'in_motel2',fl:'#8a6a4a',fl2:'#806244',wall:'#e0d0b0',np:[],mus:'motel',lay:ROOMT,ex:[{k:'stash',n:'Baule personale',px:9.5,py:3.5}]}});
for(const k in INM)Z[k]=Object.assign({lv:0,N:INM[k].lay.length,bg:'#141820',mus:'inter',int:1},INM[k]);
function rentRoom(){if(P.room)return;const c=px('motel',250);if(!pay(c))return;P.room=1+(hs((NET.name||'eroe')+(NET.id||''))%6);P.unl['room'+P.room]=1;
  banner('Stanza affittata','Stanza '+P.room+', al primo piano: il baule custodisce i tuoi oggetti','pergamena');jingle([67,72,76,79],.1,'triangle');save();pn('npc')}
function stPut(i){if(P.stash.length>=40){msg('Il baule è pieno (40/40)');return}const it=P.inv[i];if(!it)return;P.stash.push(P.inv.splice(i,1)[0]);tone(500,.06,'triangle');save();pn('stash')}
function stTake(i){if(P.inv.length>=INV){msg('Zaino pieno');return}const it=P.stash[i];if(!it)return;P.inv.push(P.stash.splice(i,1)[0]);tone(620,.06,'triangle');save();pn('stash')}

/* ---- battaglia navale: cannoni, poi arrembaggio ---- */
SHK.pirata={l:12,w:3,m:[.22,.5,.78],mh:62,h:'#2a2222',h2:'#1a1414',dk:'#5a4a3a',sl:'#3a3636',fl:'#111111'};
let NAV=null,ARRW=0;
Object.assign(Z,{mare:{n:'Mare aperto · Battaglia navale',lv:5,N:44,a:'#3b86d6',b:'#3b86d6',bg:'#5a9ad8',mus:'naval',pt:'mote',gen:genMare},
  arrembaggio:{n:'La Vedova Nera · Arrembaggio',lv:5,N:30,a:'#8a6a42',b:'#80623e',bg:'#3a6aa8',mus:'boarding',pt:'mote',gen:genArr,dist:1,wl:'#5a3a22',wh:14}});
function genMare({n}){for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}for(const[x,y]of[[4,4],[38,6],[6,36],[36,38],[20,3],[22,40]])DEC[y][x]='^';
  const me=mkShip('galeone',10,15,'y'),en=mkShip('pirata',29,15,'y');me.nav='me';en.nav='en';en.bx=en.px;en.by=en.py;ents.push(me,en);return[21,21]}
function genArr({F,EN,n}){for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}
  for(let y=3;y<=26;y++)for(let x=8;x<=21;x++){M[y][x]=(x===8||x===21||y===3||y===26)?1:0}
  for(const y of[9,15,21]){F(14,y,'I');F(15,y,'I')}for(const y of[6,10,14,18,22]){F(9,y,'J');F(20,y,'J')}
  for(const[x,y,c]of[[11,5,'b'],[12,5,'k'],[18,24,'b'],[17,24,'k'],[10,20,'@'],[19,12,'@'],[13,25,'k']])F(x,y,c);
  for(const[x,y]of[[11,9],[18,9],[12,13],[17,13],[11,18],[18,18],[13,21]])EN('pirata',x,y);for(const[x,y]of[[10,16],[19,16],[16,12]])EN('pirata_pistola',x,y);EN('scarlatto',14,23);
  return[14,4]}
function navStart(){if(P.lv<4){msg('L\'Ammiraglio non ti fa salire a bordo: torna al livello 4.');return}cl();const lv=Math.max(4,P.lv);Z.mare.lv=lv;Z.arrembaggio.lv=lv;
  NAV={ph:'cannon',hp:100,ehp:100,pw:0,pd:1,hold:0,rl:0,ecd:3.5,inc:null,mcd:0,ev:-9,balls:[],t:0,sink:0};whoosh();started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';playCine(STORMC,'naval',()=>{started=1;document.body.classList.add('ig');last=performance.now();load('mare','porto');banner('Battaglia navale','Tieni la rotta nella tempesta e rispondi al fuoco della Vedova Nera!','spade')})}
const navShips=()=>[ents.find(e=>e.nav==='me'),ents.find(e=>e.nav==='en')];
function navHold(on){if(!NAV||NAV.ph!=='cannon')return;if(on){if(NAV.rl<=0)NAV.hold=1}else if(NAV.hold){NAV.hold=0;navFire()}}
function navEvade(){if(!NAV||NAV.ph!=='cannon'||NAV.mcd>0)return;NAV.ev=NAV.t;NAV.mcd=1.4;whoosh();msg('Manovra!')}
function navFire(){const[me,en]=navShips();if(!me||!en)return;const mx=me.px,ecx=en.px-en.ex/2,tp=(ecx-mx)/26,err=Math.abs(NAV.pw-tp),hit=err<=.065,perf=err<.018;
  NAV.balls.push({x:mx,y:me.py-me.ey/2+(Math.random()-.5)*5,x2:hit?ecx:mx+NAV.pw*26,y2:en.py-en.ey/2+(Math.random()-.5)*5,k:0,T:.9,hit,perf});
  NAV.rl=1.05;NAV.pw=0;NAV.pd=1;tone(70,.25,'square',.08);P.sw=.2;if(cineOK())sparks(mx,me.py-me.ey/2,10,['#ffd04a','#888888'],60)}
function navTick(dt){const V=NAV;V.t+=dt;const[me,en]=navShips();if(!me||!en)return;navExtra(dt,me,en);
  if(V.ph==='cannon'){en.px=en.bx+Math.sin(V.t*.45)*3.2;en.py=en.by+Math.sin(V.t*.3)*2}
  if(V.ph==='sink'){V.sink+=dt;en.az=-V.sink*16;if(cineOK()&&Math.random()<.35)sparks(en.px-1.5,en.py-6,3,['#555555','#888888'],70);if(V.sink>2.6&&!V.go){V.go=1;started=0;document.body.classList.remove('ig');navUI(0);playCine(BOARDC,'boarding',()=>{started=1;document.body.classList.add('ig');last=performance.now();load('arrembaggio','mare')});return}navUIupd(me,en);return}
  if(V.hold&&V.rl<=0){V.pw+=V.pd*dt*1.15;if(V.pw>1){V.pw=1;V.pd=-1}if(V.pw<0){V.pw=0;V.pd=1}}
  V.rl-=dt;V.mcd-=dt;V.ecd-=dt;
  if(V.ecd<=0&&!V.inc){V.inc={t:1.3};V.balls.push({x:en.px-en.ex,y:en.py-en.ey/2,x2:me.px-me.ex/2,y2:me.py-me.ey/2+(Math.random()-.5)*6,k:0,T:1.3,en:1});tone(220,.2,'sawtooth',.05)}
  if(V.inc&&(V.inc.t-=dt)<=0){const ev=V.t-V.ev<.75;V.inc=null;V.ecd=(2.4+Math.random()*1.8)*(V.ehp<40?.75:1);const cx=me.px-me.ex/2,cy=me.py-me.ey/2;
    if(ev){flt(P,'Schivata!','#8ce7ff');if(cineOK())sparks(cx+1.5,cy,10,['#cfe8ff','#ffffff'],70)}
    else{const d=Math.round((9+Math.random()*6)*(DF.dm||1));V.hp-=d;V.shk=.4;flash('#ff4020',.35,300);flt(P,'-'+d+' scafo','#ff6666');tone(90,.3,'sawtooth',.08);if(cineOK())sparks(cx,cy,16,['#ff8a2a','#ffd04a','#444444'],80)}}
  for(const b of V.balls)b.k+=dt;
  V.balls=V.balls.filter(b=>{if(b.k<b.T)return true;if(!b.en){if(b.bar){if(V.br){V.br=null;V.bt=10;V.hp=Math.min(100,V.hp+15);flt(P,'Barile di rum! +15 scafo','#8cf08c');if(cineOK())sparks(b.x2,b.y2,14,['#ffd04a','#8a5a2a'],70);jingle([67,72],.08,'triangle')}return false}if(b.hit){const d=Math.round((10+Math.random()*5)*(b.perf?1.7:1)*(1+P.lv*.02));V.ehp=Math.max(0,V.ehp-d);V.chg=Math.min(3,(V.chg||0)+(b.ch?0:1));if(b.ch){V.ecd+=4;V.inc=null;msg('Alberi spezzati! La Vedova Nera non può sparare per un po\'')}flt({px:b.x2,py:b.y2},'-'+d,b.perf?'#ffd84a':'#ffffff');
      if(cineOK()){sparks(b.x2,b.y2,16,['#ff8a2a','#ffd04a','#555555'],80);ringFx(b.x2,b.y2,'255,140,60',.6,1.6)}tone(60,.3,'sawtooth',.07);if(b.perf)msg('Colpo perfetto!');
      if(V.ehp<=0&&V.ph==='cannon'){V.ph='sink';V.inc=null;banner('All\'arrembaggio!','La Vedova Nera affonda: salta a bordo e affronta la ciurma!','spade');music('boarding');slowmo(.4,1)}}
    else if(cineOK())sparks(b.x2,b.y2,10,['#cfe8ff','#ffffff'],70)}return false});
  if(V.hp<=0){navLose();return}navUIupd(me,en)}
function navLose(){NAV=null;navUI(0);banner('La tua nave è affondata','I pescatori ti riportano al porto','teschio');irisGo(()=>load('porto','in_galeone'))}
function navDraw(){for(const b of NAV.balls){const k=b.k/b.T,x=b.x+(b.x2-b.x)*k,y=b.y+(b.y2-b.y)*k,z=Math.sin(k*Math.PI)*70+14;box(x-.1,y-.1,z,.2,.2,4,'#1a1a1a',1)}}
function navUI(on){let el=$('navui');if(!on){if(el)el.remove();return}if(!el){el=document.createElement('div');el.id='navui';document.body.appendChild(el)}
  el.innerHTML='<b>⚓ Battaglia navale</b><div>Il tuo scafo</div><div class="bar"><i id="nvh" style="background:#4ad66a"></i></div><div>La Vedova Nera</div><div class="bar"><i id="nve" style="background:#e04a3a"></i></div><div class="pm"><i id="nvz" class="pz"></i><i id="nvk" class="pk"></i></div><div id="nvs" class="mu">Tieni premuto Fuoco (o Spazio) e rilascia con il segno nella zona verde.</div><button id="nvf">💥 Fuoco</button><button onclick="navEvade()">⛵ Manovra (Shift)</button>';
  const f=$('nvf');f.onpointerdown=e=>{e.preventDefault();navHold(1)};f.onpointerup=f.onpointerleave=()=>navHold(0)}
function navUIupd(me,en){const h=$('nvh');if(!h||!NAV)return;h.style.width=Math.max(0,NAV.hp)+'%';$('nve').style.width=Math.max(0,NAV.ehp)+'%';const tp=(en.px-en.ex/2-me.px)/26;
  $('nvz').style.left=((tp-.065)*100)+'%';$('nvz').style.width='13%';$('nvk').style.left=(NAV.pw*100)+'%';
  $('nvs').textContent=NAV.ph==='sink'?'La Vedova Nera sta affondando...':NAV.inc?'⚠ Bordata in arrivo: Manovra!':NAV.rl>0?'Ricarica dei cannoni...':NAV.hold?'Rilascia nella zona verde!':'Pronto al fuoco'}
function navWin(){const lv=Z.arrembaggio.lv,gd=Math.round((300+lv*60)*(NET.cfg.gm||1)),xp=200+lv*40;P.g+=gd;gainXP(xp);P.navw=(P.navw||0)+1;
  const it=item(lv+3,3,'w');it.n='Sciabola di Scarlatto';ents.push(dropOk({k:'dr',px:P.px+.5,py:P.py,it}));
  banner('Vittoria sul mare!','+'+gd+' oro, +'+xp+' XP: la Vedova Nera è sconfitta','corona');goldFly(gd);jingle([72,76,79,84,88,91],.1,'triangle');if(cineOK())coinRain(30);
  ents.push(po(14,4,'porto',{st:'gate',n:'Torna al Porto'}));music('town');save()}
addEventListener('keyup',e=>{if(NAV&&Zk==='mare'&&e.key===' ')navHold(0)});

/* ---- dopo ogni caricamento di zona ---- */
let HHc=null;
let LORET=0;function loadPost(k){npcUnstick();routineInit(k);secretsLoad(k);truthLoad(k);worldLoad(k);if(k==='town')TOWNMAP={N,M:M.map(r=>r.slice()),DEC:DEC.map(r=>r.slice()),TB:TB.map(b=>Object.assign({},b)),BM:BM.map(r=>r.slice())};if(k==='town'){townGuards();if(P.vdug||P.q.some(q=>q.id==='mo5'))ents.push(holePo());if(LFROM==='vecchia'){P.px=2.5;P.py=59.5;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}}if(k==='vecchia'&&LFROM==='culto'){P.px=10.5;P.py=87.5;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}if(k==='vecchia'||k==='culto')VSCR=k==='vecchia'?8:4;if(String(k).startsWith('dim_'))dimSkyInit();if(MODE==='dim'&&String(k).startsWith('dim_')){PPJ=[];if(k!=='dim_hub'){DIM.cur=ERAK.find(q=>ERA[q].z===k)||DIM.cur;if(!DIM.era[DIM.cur])DIM.era[DIM.cur]={s:0,c:null,done:0};setTimeout(()=>0,0)}}clearTimeout(LORET);if(CAM.f)cineOff();if(typeof BQ!=='undefined'){BQ.length=0;const bn=$('bnr');if(bn&&BB)bn.className='off'}const z=ZZ;HHc=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++)HHc[y*N+x]=hh(x,y);
  if(z.dg){campfires([P.px|0,P.py|0]);decorDG(z,[P.px|0,P.py|0]);FC=null;if(z.dn===1&&DLORE[z.dg]&&started)LORET=setTimeout(()=>{if(Zk===k)banner(DG[z.dg].n,DLORE[z.dg],'pergamena')},1500)}
  if(k==='mare'&&NAV)navUI(1);if(k==='sogno')dreamStart();if(MODE==='dim'&&String(k).startsWith('dim_')&&k!=='dim_hub'){const cb=ents.find(e=>e.k==='po'&&e.st==='cabina');if(cb&&dist(P,cb)<2.2)for(const[a,b]of[[2,0],[0,2],[2,2],[2,-1],[-1,2],[-2,0],[0,-2]]){const x=Math.floor(cb.px+a),y=Math.floor(cb.py+b);if(x>0&&y>0&&x<N-1&&y<N-1&&WK(M[y][x])){P.px=x+.5;P.py=y+.5;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10);break}}dimSetup(true)}dimObj()}

/* ---- prologo animato ---- */
let INTRO=null;
const ISC=[{d:7.5,tx:'C\'era una volta Aldoria, un regno di pietra e di luce, tenuto unito dalla Corona di Voxel.'},
  {d:7.5,tx:'Ma Malakar, fratello del Re Aldric, bramava quel potere. Studiò le arti proibite, e divenne il Re Lich.'},
  {d:7,tx:'In una notte di tempesta infranse la Corona. Sei frammenti volarono lontano, nei luoghi più oscuri del regno.'},
  {d:8.5,tx:'La Tana dei Goblin, la Cripta Dimenticata, la Piramide di Khem, le Caverne di Cristallo, la Fucina Infernale, l\'Abisso Sommerso: ogni frammento è custodito da un signore terribile.'},
  {d:7.5,tx:'Dalla sua Cittadella del Vuoto, Malakar attende che il regno cada nell\'ombra. E i dungeon rinascono, più forti, a ogni ciclo.'},
  {d:8,tx:'Il Re Aldric cerca un eroe capace di riunire la Corona. Quell\'eroe sei tu.'}];
function playIntro(cb){auInit();INTRO={t:0,cb,shown:''};$('menu').style.display='none';let el=$('intro');
  if(!el){el=document.createElement('div');el.id='intro';el.innerHTML='<div class="itx" id="itx"></div><button class="iskip" onclick="introEnd()">Salta il prologo ▸</button>';document.body.appendChild(el)}el.style.display='flex';music('intro')}
function introEnd(){if(!INTRO)return;const cb=INTRO.cb;INTRO=null;const el=$('intro');if(el)el.style.display='none';if(cb)cb();else{$('menu').style.display='';MINT=0;music('menu')}}
function introSc(sc,cx,cy){g.setTransform(sc*DPR,0,0,sc*DPR,(W/2-PX(cx,cy)*sc)*DPR,(H*.6-PY(cx,cy,0)*sc)*DPR)}
function introGround(sc,cx,cy){const Rw=W/2/sc+80,oy=H*.6,camx=PX(cx,cy),camy=PY(cx,cy,0);const d0=Math.floor((camy-oy/sc-90)/16),d1=Math.ceil((camy+(H-oy)/sc+60)/16);
  for(let d=d0;d<=d1;d++){const a=Math.floor((camx-Rw)/64+d/2),b=Math.ceil((camx+Rw)/64+d/2);for(let x=a;x<=b;x++)mtile(x,d-x)}}
function introCastle(x,y,dk){box(x-2,y-2,0,4,4,46,dk?'#5a5a66':'#9a9aa6');for(const[a,b]of[[-2,-2],[2,-2],[-2,2],[2,2]]){box(x+a-.6,y+b-.6,0,1.2,1.2,64,dk?'#6a6a74':'#a8a8b4');box(x+a-.75,y+b-.75,64,1.5,1.5,8,dk?'#2a1a3a':'#3a4a7a')}box(x-.5,y+1.98,0,1,.04,22,'#4a2a12')}
function introCrown(x,y,z,sp,cols){for(let i=0;i<8;i++){const a=sp+i*Math.PI/4;box(x+Math.cos(a)*.75-.1,y+Math.sin(a)*.75-.1,z,.2,.2,i%2?6:9,i%2?'#d4af37':cols[(i>>1)%cols.length],1.25)}}
function introDraw(dt){const I=INTRO;I.t+=dt;let s=0,acc0=0;while(s<ISC.length&&I.t>acc0+ISC[s].d){acc0+=ISC[s].d;s++}if(s>=ISC.length){introEnd();return}
  const lt=I.t-acc0,D=ISC[s].d,cols=['#7aff7a','#9fd0ff','#ffd060','#b0f0ff','#ff6a2a','#6fffe0'];g.setTransform(DPR,0,0,DPR,0,0);
  const grads=[['#3a7ad0','#f5d08a'],['#1a0a2a','#5a2a6a'],['#0a0612','#3a1a4a'],['#05060c','#1a1430'],['#120620','#2a0a3a'],['#5a8ad0','#f8b878']][s];
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,grads[0]);gr.addColorStop(1,grads[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
  const sc=Math.min(W,H)/520,cx=lt*.25,cy=-lt*.25;
  if(s===0||s===5||s===1){introSc(sc,cx,cy);introGround(sc,cx,cy);if(s===1){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(40,0,60,.5)';g.fillRect(0,0,W,H);introSc(sc,cx,cy)}}
  else introSc(sc,cx,cy);
  if(s===0){introCastle(cx,cy,0);introCrown(cx,cy,92+Math.sin(lt*2)*4,lt*1.2,cols)}
  if(s===1){introCastle(cx+5,cy-5,1);drawL(hum('#2a1a4a','#cfe8ff',3.2,[12,'#d4af37']),cx-1,cy+1,0);box(cx-1.2,cy+1.38,84,.14,.05,6,'#ff3a3a',1.4);box(cx-.82,cy+1.38,84,.14,.05,6,'#ff3a3a',1.4);
    introCrown(cx-1,cy+1,126,lt*.6,['#555555']);if((lt*1.7)%3<.12){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(220,200,255,.55)';g.fillRect(0,0,W,H)}}
  if(s===2){const k=Math.min(1,lt/3.5);for(let i=0;i<6;i++){const a=i*Math.PI/3+.3,r=k*9,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,z=70+Math.sin(k*Math.PI)*60;
      box(x-.25,y-.25,z,.5,.5,10,cols[i],1.3);for(let j=1;j<5;j++){const r2=Math.max(0,r-j*.6);box(cx+Math.cos(a)*r2-.08,cy+Math.sin(a)*r2-.08,z-j*3,.16,.16,4,cols[i],1.1)}}
    if(lt<.5){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=`rgba(255,255,255,${1-lt*2})`;g.fillRect(0,0,W,H)}}
  if(s===3){const n=Math.min(6,Math.floor(lt/1.1)+1),ids=SHARDS;for(let i=0;i<n;i++){const a=i*Math.PI/3-Math.PI/2,x=cx+Math.cos(a)*6,y=cy+Math.sin(a)*6,c=TH[DG[ids[i]].th].tc;
      box(x-.6,y-.6,0,1.2,1.2,8,'#3a3a44');box(x-.4,y-.4,8,.2,.2,36,'#5a5a64');box(x+.2,y-.4,8,.2,.2,36,'#5a5a64');box(x-.4,y-.4,44,1,.2,6,'#5a5a64');box(x-.25,y-.35,10,.5,.1,32,c,1.2+Math.sin(lt*4+i)*.1)}
    g.setTransform(DPR,0,0,DPR,0,0);g.textAlign='center';g.font='bold 15px Georgia,serif';for(let i=0;i<n;i++){const a=i*Math.PI/3-Math.PI/2,x=cx+Math.cos(a)*6,y=cy+Math.sin(a)*6;
      const sx=(PX(x,y)-PX(cx,cy))*sc+W/2,sy=(PY(x,y,0)-PY(cx,cy,0))*sc+H*.6+18;label(DG[ids[i]].n,sx,sy,TH[DG[ids[i]].th].tc)}}
  if(s===4){for(let i=0;i<9;i++){const u=Math.sin(lt*1.2+i)*6;box(cx-3+(i%3)*2,cy-3+Math.floor(i/3)*2,40+u+(i===4?30:0),1.6,1.6,30+(i%2)*20+(i===4?40:0),'#2a1a3a',.9+(i%3)*.1)}
    for(let i=0;i<12;i++){const a=lt*.4+i*.52;box(cx+Math.cos(a)*7-.15,cy+Math.sin(a)*7-.15,60+Math.sin(lt*2+i)*14,.3,.3,6,'#c46bff',1.3)}
    g.setTransform(DPR,0,0,DPR,0,0);const ea=.5+.5*Math.sin(lt*2);g.fillStyle=`rgba(255,40,60,${.35+ea*.4})`;g.beginPath();g.ellipse(W*.44,H*.16,26,9,0,0,6.3);g.ellipse(W*.56,H*.16,26,9,0,0,6.3);g.fill()}
  if(s===5){introCastle(cx+7,cy-7,0);const hx=cx-6+Math.min(1,lt/6)*6,hy=cy+6-Math.min(1,lt/6)*6;drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),hx,hy,Math.abs(Math.sin(lt*9))*2,0,5);
    if(lt>D-3){g.setTransform(DPR,0,0,DPR,0,0);const a=Math.min(1,(lt-(D-3))/1.2);g.globalAlpha=a;g.textAlign='center';g.font=`bold ${Math.round(Math.min(W,H)/8)}px Georgia,serif`;g.lineWidth=6;g.strokeStyle='#3a1a08';g.strokeText('VOXELIA',W/2,H*.3);g.fillStyle='#ffd88a';g.fillText('VOXELIA',W/2,H*.3);g.globalAlpha=1}}
  g.setTransform(DPR,0,0,DPR,0,0);const fa=Math.max(0,1-lt/.7,1-(D-lt)/.7);if(fa>0){g.fillStyle=`rgba(0,0,0,${fa})`;g.fillRect(0,0,W,H)}
  const n=Math.min(ISC[s].tx.length,Math.floor(Math.max(0,lt-.6)*42)),tx=ISC[s].tx.slice(0,n);if(tx!==I.shown){I.shown=tx;const el=$('itx');if(el)el.textContent=tx}}
function drawMenuFx(){g.setTransform(DPR,0,0,DPR,0,0);const cols=['#7aff7a','#9fd0ff','#ffd060','#b0f0ff','#ff6a2a','#6fffe0'];
  for(let i=0;i<34;i++){const x=(i*137.5+mt0*14*(1+i%3))%W,y=H-((mt0*(22+i%5*6)+i*91)%(H+40)),a=.25+.25*Math.sin(mt0*3+i);g.fillStyle=`rgba(255,230,160,${a})`;g.fillRect(x,y,2+i%2,2+i%2)}
  for(let k=0;k<4;k++){const x=((mt0*(36+k*9)+k*380)%(W+240))-120,y=H*.16+k*34+Math.sin(mt0*1.4+k)*12,f=Math.sin(mt0*10+k)*6;g.strokeStyle='rgba(40,30,40,.6)';g.lineWidth=2;g.beginPath();g.moveTo(x-9,y-f);g.lineTo(x,y);g.lineTo(x+9,y-f);g.stroke()}
  for(let i=0;i<6;i++){const a=mt0*.6+i*Math.PI/3,x=W*.5+Math.cos(a)*Math.min(W,H)*.34,y=H*.5+Math.sin(a)*Math.min(W,H)*.12,p=.5+.5*Math.sin(mt0*2+i);g.fillStyle=cols[i];g.globalAlpha=.35+p*.35;g.fillRect(x-5,y-5,10,10);g.globalAlpha=.15;g.fillRect(x-11,y-11,22,22)}g.globalAlpha=1;
  if((mt0%9)<1.1){const k=(mt0%9)/1.1,x=W*(.9-k*.5),y=H*(.05+k*.18);g.strokeStyle=`rgba(255,255,230,${1-k})`;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+60,y-22);g.stroke()}}

(function(){const st=document.createElement('style');st.textContent=`
#intro{position:fixed;inset:0;display:none;align-items:flex-end;justify-content:center;z-index:60;pointer-events:none}
#intro .itx{max-width:min(820px,90vw);margin-bottom:11vh;font:italic 22px Georgia,serif;color:#f4ecd8;text-align:center;text-shadow:0 2px 8px #000,0 0 2px #000;line-height:1.55;min-height:3em}
#intro .iskip{pointer-events:auto;position:fixed;right:24px;bottom:24px;font:15px Georgia,serif;background:rgba(20,20,30,.75);color:#f4ecd8;border:1px solid #f5b94288;border-radius:8px;padding:8px 14px;cursor:pointer}
#pn.fishp{top:auto!important;bottom:92px!important;left:auto!important;right:12px;transform:none!important;max-height:58vh;width:min(360px,92vw);font-size:14px}
#navui{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:30;background:rgba(10,20,40,.86);border:1px solid #6a8ac8;border-radius:10px;padding:10px 14px;color:#eef;min-width:340px;font:13px Georgia,serif}
#navui .bar{height:10px;background:#0006;border-radius:5px;overflow:hidden;margin:3px 0 7px}#navui .bar i{display:block;height:100%;transition:width .2s}
#navui .pm{position:relative;height:16px;background:#0008;border-radius:4px;margin:6px 0;overflow:visible}#navui .pz{position:absolute;top:0;bottom:0;background:#3fbf5a99}#navui .pk{position:absolute;top:-3px;bottom:-3px;width:4px;margin-left:-2px;background:#fff;box-shadow:0 0 6px #fff}
#navui button{margin:4px 4px 0 0;font:inherit;padding:6px 12px;cursor:pointer}
.stk{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px;margin:4px 0 10px}.stk .si{background:#0003;border:1px solid #ffffff22;border-radius:6px;padding:6px;animation:vxin .35s ease-out both}.stk .si.so{opacity:.45}
@keyframes vxin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes vxglow{50%{text-shadow:0 0 18px rgba(255,210,120,.9),0 0 42px rgba(255,160,60,.6)}}
#menu h1{animation:vxglow 3.2s ease-in-out infinite}#menu .mpan{animation:vxin .7s ease-out both}#menu .mpan+.mpan{animation-delay:.15s}#menu .mfoot{animation:mrise .6s .3s both}
#menu .dcard,#menu .mbtn,#menu .mfoot button{transition:transform .15s,box-shadow .15s}#menu .dcard:hover,#menu .mbtn:hover,#menu .mfoot button:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 6px 18px rgba(0,0,0,.35)}
#pn{animation:vxin .22s ease-out}
@media(prefers-reduced-motion:reduce){#menu h1,#menu .mpan,#menu .mfoot,.stk .si,#pn{animation:none}}`;document.head.appendChild(st)})();
Object.assign(NPCS,{portiere:{n:'Portiera Rosalba',c:'#8a2a4a',hat:'#d4af37',role:'motel',ln:['Benvenuto al Motel della Rosa dei Venti! Stanze pulite e bauli robusti.','Le stanze sono al primo piano: le scale sono lì, a destra.']},
  ospite:{n:'Viaggiatore stanco',c:'#5a6a7a',hat:'#3a3a3a',ln:['Tre giorni di cammino da Khem. Finalmente un letto.','Il baule della mia stanza è più sicuro di una banca, dicono.']},
  ammiraglio:{n:'Ammiraglio Corvo',c:'#1a2a4a',hat:'#d4af37',role:'naval',qs:['pn1','pn2'],ln:['La Sfida ha venti cannoni e un equipaggio che non ha paura di niente.','I pirati della Vedova Nera assaltano le nostre navi. È ora di dar loro una lezione.']}});
Object.assign(QT,{pn1:{t:'boss',e:['scarlatto'],n:1,lv:4,ti:'Il terrore dei mari',tx:'Il Capitano Scarlatto comanda la Vedova Nera. Salpa con la Sfida, affondala a cannonate, abbordala e sconfiggilo.',g:500,x:380},
  pn2:{t:'kill',e:['pirata','pirata_pistola'],n:15,lv:4,ti:'Ciurma di tagliagole',tx:'Ogni pirata in meno è una nave mercantile salva. Abbattine 15 durante gli arrembaggi.',g:320,x:240}});

/* ================= 6.1: cancelli che si aprono e il pozzo delle alghe ================= */
const GSTY={legno:{p:'#6a6a62',c:'#5a5a52',l:'#6b4a2b',l2:'#5a3a20',h:'#3a3a3a',v:'#3f7a32'},sabbia:{p:'#d9b56b',c:'#c9a050',l:'#8a6a3a',l2:'#7a5a2a',h:'#d4af37'},
  gelo:{p:'#8a9aaa',c:'#e6edf4',l:'#3a4a5a',l2:'#2a3a4a',h:'#9adcff'},ferro:{p:'#7b7f89',c:'#6b6f79',l:'#3a3a42',l2:'#2e2e36',h:'#d4af37'}};
function gateL(e){const op=e.op||0,sp=e.span||3,o=e.off!=null?e.off:-sp/2,eo=e.eo||0,sw=e.sw||1,S=GSTY[e.sty]||GSTY.ferro,L=[];
  const Q=(a,b,z,w,d,h,c)=>{if(e.dir==='y')L.push([b,a,z,d,w,h,c]);else L.push([a,b,z,w,d,h,c])};
  Q(o-.35,eo-.35,0,.7,.7,52,S.p);Q(o+sp-.35,eo-.35,0,.7,.7,52,S.p);Q(o-.45,eo-.45,52,.9,.9,6,S.c);Q(o+sp-.45,eo-.45,52,.9,.9,6,S.c);Q(o,eo-.2,42,sp,.4,8,S.p);
  const lw=sp/2,ang=op*Math.PI/2*.92,seg=S.bars?7:6;
  for(const side of[0,1]){const ax=side?o+sp:o,da=side?-1:1;for(let i=0;i<seg;i++){const r0=(i+.5)/seg*lw,X=ax+Math.cos(ang)*r0*da,Y=eo+Math.sin(ang)*r0*sw;
      // 7.12: cancelli a sbarre di ferro (sbarre sottili con la punta, e tre traverse), oltre a quelli di assi
      if(S.bars){const bw=lw/seg*.36;Q(X-bw/2,Y-.05,2,bw,.1,34,i%2?S.l:S.l2);Q(X-bw*.3,Y-.035,36,bw*.6,.07,3,S.h);for(const z of[5,19,31])Q(X-lw/seg/2,Y-.04,z,lw/seg+.02,.08,2.2,S.l2)}
      else Q(X-lw/seg/2,Y-.06,2,lw/seg+.02,.12,36,i%2?S.l:S.l2)}
    Q(ax+Math.cos(ang)*lw*.5*da-.05,eo+Math.sin(ang)*lw*.5*sw-.07,18,.1,.14,4,S.h);Q(ax+Math.cos(ang)*lw*.9*da-.04,eo+Math.sin(ang)*lw*.9*sw-.07,30,.08,.14,3,S.h)}
  if(S.v)for(let i=0;i<4;i++)Q(o-.42+i*.04,eo+.36,4+i*12,.07,.07,10,S.v);if(S.ex)S.ex(Q,o,sp,eo,e);
  // 7.12: un cancello sbarrato ha le catene incrociate davanti alle ante e un grosso lucchetto
  if(gateLocked(e)&&op<.05){const n=12;for(let k=0;k<=n;k++){const a=o+.3+(sp-.6)*k/n,c=k%2?'#9a8a7a':'#7a5a44';Q(a-.08,eo+.08,7+26*k/n,.16,.08,3.4,c);Q(a-.08,eo+.08,33-26*k/n,.16,.08,3.4,c)}
    Q(o+sp/2-.18,eo+.1,13,.36,.1,8,'#b8902a');Q(o+sp/2-.12,eo+.1,21,.24,.06,4,'#7a7068');Q(o+sp/2-.04,eo+.2,15,.08,.02,3,'#2a1a10')}
  return L}
// nei filmati il cancello del vecchio quartiere è sempre sbarrato, come nella storia
const gateLocked=e=>!!(e.lock&&((typeof CN!=='undefined'&&CN&&CN.film)||!(P&&P.unl&&P.unl[e.lock])));
// 7.12: il pozzo delle alghe è più grande e si fa notare: bordo di pietra col muschio, acqua che brilla di verde acqua
// (anche di notte, da lontano), alghe che pendono, bolle, carrucola con il secchio e un tetto a due falde
function wellL(e){const L=[],T=6.2832,pu=.5+.5*Math.sin(t*2.2);
  for(let i=0;i<12;i++){const a=i/12*T;L.push([Math.cos(a)*.52-.14,Math.sin(a)*.52-.14,0,.28,.28,13,i%2?'#7a7a82':'#6a6a72'])}
  for(let i=0;i<12;i++){const a=i/12*T+.26;L.push([Math.cos(a)*.52-.13,Math.sin(a)*.52-.13,13,.26,.26,2,i%3?'#3f7a4a':'#4f8a52'])}
  L.push([-.4,-.4,3,.8,.8,9,'#1e6a66',1.15+pu*.15]);
  for(let i=0;i<10;i++){const a=i*.63+.3,s=Math.sin(t*1.8+i)*.04;L.push([Math.cos(a)*.62-.04+s,Math.sin(a)*.62-.04,3+(i%3)*2,.08,.08,10+(i%3)*4,i%2?'#2f8a4a':'#3fa05a'])}
  for(let i=0;i<5;i++){const a=i*1.3,u=(t*.7+i*.2)%1;L.push([Math.cos(a)*.2-.035,Math.sin(a)*.2-.035,12+u*18,.07,.07,2,'#8ff0ff',1.3])}
  L.push([-.6,-.07,15,.12,.14,30,'#6b4a2b'],[.48,-.07,15,.12,.14,30,'#6b4a2b'],[-.64,-.11,44,1.28,.22,3,'#5a3a1a'],[-.05,-.05,28,.1,.1,16,'#c8b890'],[-.13,-.13,22,.26,.26,6,'#7a5a3a'],[-.15,-.15,27.5,.3,.3,1,'#5a3a1a']);
  for(let k=0;k<4;k++)L.push([-.78+k*.1,-.58+k*.13,47+k*3,1.56-k*.2,1.16-k*.26,3,k%2?'#2a6a5a':'#3a7a6a']);
  nlight(e.px,e.py,14,130,'110,255,225',.55+pu*.25);if(SET.ultra)GLOW.push([e.px,e.py,14,46,'110,255,225',.22+pu*.12]);
  return L}
function gateTick(dt){for(const e of ents){if(e.st!=='cancello')continue;const tg=dist(P,e)<3.6&&!gateLocked(e)?1:0;if(tg&&!e.lt&&AU.ac&&SET.sf)try{vtone(AU.ac.currentTime+.02,38,.8,'sawtooth',1.5,.03);vtone(AU.ac.currentTime+.05,45,.6,'square',.7,.015)}catch(_){}
  e.lt=tg;e.op=(e.op||0)+(tg-(e.op||0))*Math.min(1,dt*2.4)}}

/* ================= 6.2: maestria delle armi, zaini, abilità dei boss, falò, motel con due scale ================= */
GSTY.mare={p:'#e8e4dc',c:'#2a5a8a',l:'#3a5a7a',l2:'#2a4a6a',h:'#d4af37'};
/* porte orientate sulla faccia giusta del muro */
function doorL(f){const C='#5a3818',T='#3a2a1a',G='#d4af37';
  if(f==='s')return[[-.3,.46,0,.6,.08,22,C],[-.34,.46,22,.68,.1,3,T],[.16,.45,10,.05,.03,3,G]];
  if(f==='w')return[[-.54,-.3,0,.08,.6,22,C],[-.56,-.34,22,.1,.68,3,T],[-.48,.16,10,.03,.05,3,G]];
  if(f==='e')return[[.46,-.3,0,.08,.6,22,C],[.46,-.34,22,.1,.68,3,T],[.45,.16,10,.03,.05,3,G]];
  return[[-.3,-.54,0,.6,.08,22,C],[-.34,-.56,22,.68,.1,3,T],[.16,-.48,10,.05,.03,3,G]]}
const exitL=()=>[[-.38,-.07,0,.1,.14,26,'#4a3018'],[.28,-.07,0,.1,.14,26,'#4a3018'],[-.38,-.09,26,.76,.18,4,'#3a2a1a'],[-.28,-.04,0,.56,.08,24,'#6b4a2b'],[.12,.04,11,.05,.03,3,'#d4af37'],[-.2,-.02,20,.4,.04,2,'#8a6a42']];
/* maestria: l'arma che usi di più si potenzia combattendo */
function wmHit(){const w=P&&P.eq.w;if(!w)return;w.wx=(w.wx||0)+1;const ml=w.ml||0;if(ml>=10)return;const need=Math.round(20*Math.pow(ml+1,1.5));
  if(w.wx>=need){w.wx-=need;w.ml=ml+1;flt(P,'⚔ Maestria '+w.ml+': '+w.n,'#ffd84a');if(cineOK()){sparks(P.px,P.py,16,['#ffd84a','#ffffff'],70);banner('Maestria +'+w.ml,w.n+' colpisce più forte (+'+(w.ml*4)+'%)','spada')}else msg(w.n+': maestria '+w.ml);jingle([67,71,74,79],.08,'triangle');hud()}}
/* zaini più capienti, venduti a caro prezzo */
const BAGS=[{n:'Zaino di tela',s:0,p:0},{n:'Zaino da viaggio',s:8,p:1500},{n:'Zaino da esploratore',s:16,p:5000},{n:'Zaino del Mercante Reale',s:24,p:15000}];
function bagHTML(){const i=(P.bag||0)+1;if(i>=BAGS.length)return`<h4>🎒 Zaini</h4><p class="mu">Hai già lo ${BAGS[BAGS.length-1].n}: ${INV} posti.</p>`;const b=BAGS[i],c=px('bag'+i,b.p);
  return`<h4>🎒 Zaini</h4><div class="stk"><div class="si"><b>${b.n}</b><br><span class="mu">${INV} → ${24+b.s} posti</span><br><button onclick="buyBag()">Compra · ${c}💰</button></div></div>`}
function buyBag(){const i=(P.bag||0)+1;if(i>=BAGS.length)return;const b=BAGS[i];if(!pay(px('bag'+i,b.p)))return;P.bag=i;INV=24+b.s;banner('Zaino nuovo',b.n+': ora hai '+INV+' posti','spunta');jingle([67,72,76,79],.09,'triangle');save();pn(PM)}
/* abilità uniche dei boss */
const BAB={troll:['charge','slam2'],faraone:['summon:mummia','rain'],drago_brina:['nova','rain','charge'],re_goblin:['summon:goblin','charge'],necromante:['summon:scheletro','teleport','heal'],
  sfinge:['rain','shield','nova'],regina:['nova','teleport','shield'],ignis:['rain','nova','charge'],leviatano:['rain','summon:uomo_pesce','charge'],lich:['summon:scheletro','nova','teleport','shield','rain'],
  vexmoor:['teleport','nova','summon:spettro'],scarlatto:['charge','nova','summon:pirata']};
const BABN={charge:'Carica!',slam2:'Terremoto!',rain:'Pioggia di colpi!',nova:'Esplosione!',teleport:'Teletrasporto!',heal:'Si rigenera!',shield:'Scudo!',summon:'Evoca rinforzi!'};
function bossAI(dt){for(const e of ents){if(e.k!=='en'||!e.boss||!e.al)continue;const d=dist(e,P);
  if(e.ch){e.ch.t-=dt;const s=10*dt;mv(e,e.ch.dx*s,e.ch.dy*s);if(!e.ch.h&&dist(e,P)<1.3){e.ch.h=1;hurtP(e.at*1.4)}if(e.ch.t<=0)e.ch=null;continue}
  if(d>14)continue;e.bab=(e.bab==null?4:e.bab)-dt;if(e.bab>0)continue;
  const L=BAB[e.t]||['nova','slam2'],[k,arg]=L[(e.bi=(e.bi||0)+1)%L.length].split(':');e.bab=bossGap(e);flt(e,BABN[k]||'!','#ffb04a');
  switch(k){
    case 'charge':{const dd=d||1;e.ch={dx:(P.px-e.px)/dd,dy:(P.py-e.py)/dd,t:Math.min(.7,d/10+.15)};whoosh();break}
    case 'slam2':for(let i=0;i<3;i++)fx.push({k:'warn',x:e.px+(P.px-e.px)*i/2,y:e.py+(P.py-e.py)*i/2,r:2,t:1+i*.25,mx:1+i*.25,dmg:e.at*1.3});tone(70,.3,'sawtooth',.05);break;
    case 'rain':{const n=5+(e.enr?3:0);for(let i=0;i<n;i++){const tt=1+Math.random()*.8;fx.push({k:'warn',x:P.px+(Math.random()-.5)*6,y:P.py+(Math.random()-.5)*6,r:1.3,t:tt,mx:tt,dmg:e.at})}fx.push({k:'warn',x:P.px,y:P.py,r:1.3,t:1.2,mx:1.2,dmg:e.at});break}
    case 'nova':{const n=e.enr?16:12;for(let i=0;i<n;i++){const an=i*6.283/n;PJ.push({x:e.px,y:e.py,vx:Math.cos(an)*6,vy:Math.sin(an)*6,t:2,d:e.at*.8,c:e.b.rng||'#ffb04a'})}tone(500,.2,'triangle',.05);break}
    case 'teleport':{for(let k2=0;k2<24;k2++){const an=Math.random()*6.283,x=Math.floor(P.px+Math.cos(an)*2.6),y=Math.floor(P.py+Math.sin(an)*2.6);
      if(x>0&&y>0&&x<N-1&&y<N-1&&WK(M[y][x])){if(cineOK())sparks(e.px,e.py,14,['#c46bff','#ffffff'],60);e.px=x+.5;e.py=y+.5;if(cineOK())sparks(e.px,e.py,14,['#c46bff','#ffffff'],60);break}}break}
    case 'heal':if(!e.hld&&e.hp<e.mx*.6){e.hld=1;const h=Math.round(e.mx*.15);e.hp=Math.min(e.mx,e.hp+h);flt(e,'+'+h,'#66ff88');if(cineOK())sparks(e.px,e.py,16,['#66ff88','#ffffff'],70)}else e.bab=.5;break;
    case 'shield':e.shd=t+2.4;if(cineOK())ringFx(e.px,e.py,'150,220,255',.8,1.6);break;
    case 'summon':{const ty=E[arg]?arg:'scheletro';if(ents.filter(x=>x.k==='en').length>18)break;
      for(let i=0;i<3;i++){const an=i*2.1+Math.random(),[x,y]=nearFree(clamp(Math.floor(e.px+Math.cos(an)*1.8),1,N-2),clamp(Math.floor(e.py+Math.sin(an)*1.8),1,N-2));if(WK(M[y][x])){const m=mk(ty,x,y,20000+e.id*10+(e.sc=(e.sc||0)+1));m.al=1;ents.push(m)}}break}}}}
/* falò nei dungeon: ci si riposa e la vita torna piano piano */
function campfires(sp){const r=sd(hs(Zk+'falo')),d=bfs(sp[0],sp[1]),free=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(M[y+dy][x+dx]!==0||DEC[y+dy][x+dx])return false;
    // 7.10: niente falò (né ceppi intorno) sopra forzieri, pagine di diario, portali o oggetti: prima finivano murati dentro il fuoco
    return!ents.some(e=>(e.k==='en'&&Math.abs(e.px-x-.5)<5&&Math.abs(e.py-y-.5)<5)||(e.k!=='en'&&e.k!=='tc'&&Math.abs((e.px|0)-x)<=1&&Math.abs((e.py|0)-y)<=1))};
  const C=[];for(let y=2;y<N-2;y++)for(let x=2;x<N-2;x++){const v=d[y*N+x];if(v>2&&free(x,y))C.push([x,y,v])}if(!C.length)return;
  const pick=(a,b)=>{const L=C.filter(c=>c[2]>=a&&c[2]<=b);return L.length?L[Math.floor(r()*L.length)]:null},max=Math.max(...C.map(c=>c[2]));
  for(const q of[pick(3,9),pick(max*.4,max*.6),pick(max*.7,max*.85)]){if(!q)continue;const[x,y]=q;if(M[y][x]!==0)continue;M[y][x]=6;DEC[y][x]=',';if(M[y+1][x-1]===0){M[y+1][x-1]=6;DEC[y+1][x-1]='m'}if(M[y-1][x+1]===0){M[y-1][x+1]=6;DEC[y-1][x+1]='m'}}}
let CAMPM=0;
function campTick(dt){if(!ZZ||!ZZ.dg||P.hp<=0)return;let near=false;const x0=P.px|0,y0=P.py|0;for(let y=y0-2;y<=y0+2&&!near;y++)for(let x=x0-2;x<=x0+2;x++)if(y>0&&x>0&&y<N&&x<N&&DEC[y][x]===','&&Math.hypot(x+.5-P.px,y+.5-P.py)<1.9){near=true;break}
  if(!near){CAMPM=0;return}if(ents.some(e=>e.k==='en'&&e.al&&dist(e,P)<7))return;if(!CAMPM){CAMPM=1;msg('Ti riposi accanto al fuoco: la vita torna piano piano.')}
  if(P.hp<P.mx){P.hp=Math.min(P.mx,P.hp+P.mx*(MODE==='story'?.03:.05)*dt);if(Math.random()<dt*1.5&&cineOK())sparks(P.px,P.py,2,['#66ff88'],30)}}
/* motel: due scale (a destra e a sinistra) e un corridoio con tutte le stanze */
Z.in_motel=Object.assign({},Z.in_motel,{N:16,np:[['portiere',7,2],['ospite',3,10]],po:[[1,7,'in_motel2','Scale (sinistra) · primo piano',{st:'up'}],[14,7,'in_motel2','Scale (destra) · primo piano',{st:'up'}]],lay:[
  '################','#p...CCCCCC...p#','#..............#','#..............#','#.nn...TT...nn.#','#.nn........nn.#','#..............#','#..............#','#....======....#','#....======....#','#..............#','#k............b#','#..............#','#p............p#','#..............#','#######D########']});
(()=>{const V=' '.repeat(18),lay=[];for(let i=0;i<13;i++)lay.push(V);lay.push('##################','#................#','#.==============.#','#................#','##################');
  const po2=[[1,15,'in_motel','Scale (sinistra) · piano terra',{st:'down'}],[16,15,'in_motel','Scale (destra) · piano terra',{st:'down'}]];
  [[4,14],[9,14],[14,14],[4,16],[9,16],[14,16]].forEach(([x,y],i)=>{const n=i+1;po2.push([x,y,'in_stanza'+n,'Stanza '+n,{lock:'room'+n,lockMsg:'La stanza '+n+' non è tua: affitta una stanza alla reception, al piano terra.'}])});
  Z.in_motel2=Object.assign({},Z.in_motel2,{N:18,lay,po:po2,np:[['cameriera',7,14,{n:'Cameriera Rina'}]]})})();
/* nuove modalità del menu, ancora in lavorazione */
function wipMode(k){const T={dim:['🌌 Voxelia Dimension','Un\'altra dimensione del regno: mondi generati che cambiano a ogni viaggio, regole nuove e nemici mai visti.'],
  parco:['🎡 Parco giochi','Una modalità libera e creativa: costruisci, prova armi e nemici, gioca senza missioni né pericoli.']}[k];let el=$('wipm');
  if(!el){el=document.createElement('div');el.id='wipm';document.body.appendChild(el)}el.innerHTML=`<div class="wbox"><h2>${T[0]}</h2><p class="wtag">🚧 Work in progress</p><p>${T[1]}</p><p class="mu">Questa modalità è in lavorazione: arriverà in un prossimo aggiornamento.</p><button onclick="$('wipm').style.display='none'">Torna al menu</button></div>`;el.style.display='flex';tone(520,.08,'triangle')}
(function(){const st=document.createElement('style');st.textContent=`#wipm{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(5,8,16,.72);z-index:70}
#wipm .wbox{max-width:min(520px,90vw);background:#1b2030;border:2px solid #f5b942;border-radius:12px;padding:20px 24px;color:#e8ecf4;font:15px Georgia,serif;text-align:center;animation:vxin .3s ease-out}
#wipm .wtag{display:inline-block;background:#f5b942;color:#1b2030;font-weight:bold;border-radius:20px;padding:3px 12px}#wipm button{font:inherit;padding:8px 16px;margin-top:8px;cursor:pointer}
.mmodes .dgrid{grid-template-columns:repeat(2,1fr)}.mmodes .dcard{position:relative}.mmodes .dcard i{position:absolute;top:6px;right:6px;font-style:normal;font-size:10px;background:#f5b942;color:#1b2030;border-radius:10px;padding:1px 7px;font-weight:bold}`;document.head.appendChild(st)})();

/* ================= 6.3: VOXELIA DIMENSION — viaggi nelle epoche dentro la Cabina ================= */
let MODE='story',DIM=null,PPJ=[],DU=null,DUT=0,CN=null;const DIMK='voxelia_dim';
Object.assign(TRK,{dimhub:{bpm:90,root:50,sc:'lyd',pr:[0,4,5,1],ld:'sine',dn:.42,arp:1,pad:1,dr:0},
  west:{bpm:116,root:52,sc:'maj',pr:[0,3,4,0],ld:'square',dn:.55,dr:1,bs:[0,4,7,4]},
  vit:{bpm:84,root:47,sc:'min',pr:[0,5,3,4],ld:'triangle',dn:.4,spb:12,waltz:1,bs:[0]},
  riv:{bpm:120,root:48,sc:'hm',pr:[0,3,4,0],ld:'square',dn:.5,dr:2,bs:[0,4,8,12]},
  war:{bpm:100,root:43,sc:'phr',pr:[0,1,0,5],ld:'sawtooth',dn:.35,dr:3,pad:1,bs:[0,2,4,6,8,10,12,14]},
  dimintro:{bpm:72,root:48,sc:'lyd',pr:[0,4,1,5,0,4,3,5],ld:'sine',dn:.35,pad:1,arp:1,dr:0},
  dimend:{bpm:80,root:50,sc:'maj',pr:[0,3,4,5,0,3,4,0],ld:'triangle',dn:.45,pad:1,arp:1,dr:0}});
Object.assign(E,{
  bandito_w:{n:'Fuorilegge',hp:50,at:10,xp:16,sp:2.2,r:5,cd:1.6,ag:12,rng:'#ffd84a',m:hum('#7a5a3a','#e0b090',1,[5,'#4a3020'])},
  teppista:{n:'Scagnozzo',hp:60,at:11,xp:16,sp:2.4,r:1.2,cd:1,ag:12,m:hum('#3a3a44','#e0b090',1,[3,'#2a2a2a'])},
  corvus:{n:'Dottor Corvus',hp:520,at:20,xp:300,sp:2,r:4.5,cd:1.6,ag:16,boss:1,rng:'#9aff6a',m:hum('#1a1a22','#d8c8b8',1.4,[10,'#111111'])},
  guardia_reale:{n:'Guardia Reale',hp:55,at:13,xp:18,sp:1.7,r:6,cd:2.4,ag:40,rng:'#ffffff',m:hum('#2a3a8a','#e0b090',1,[7,'#1a1a1a'])},
  granatiere:{n:'Granatiere',hp:110,at:16,xp:24,sp:1.9,r:1.3,cd:1.3,ag:40,m:hum('#2a3a8a','#e0b090',1.25,[10,'#1a1a1a'])},
  soldato:{n:'Soldato nemico',hp:55,at:12,xp:18,sp:2,r:6.5,cd:1.4,ag:14,rng:'#ffcc66',m:hum('#5a5a3a','#e0b090',1,[4,'#4a4a3a'])},
  mitragliatrice:{n:'Nido di mitragliatrice',hp:240,at:7,xp:60,sp:0,r:8,cd:.35,ag:11,rng:'#ffaa44',m:[[-.45,-.45,0,.9,.9,8,'#a8916a'],[-.38,-.38,8,.76,.76,6,'#9e8862'],[-.1,.1,12,.2,.6,4,'#2a2a2a'],[-.15,-.15,14,.3,.3,10,'#4a4a3a']]}});
BAB.corvus=['teleport','nova','summon:teppista'];
Object.assign(NPCS,{
  sceriffo:{n:'Sceriffo Hank',c:'#8a6a3a',hat:'#5a3a1a',role:'dim',ln:['Questa città era tranquilla, prima di Black Jack.','La stella sul petto pesa più di quanto sembri.']},
  blackjack:{n:'Black Jack',c:'#1a1a1a',hat:'#1a1a1a',role:'dim',ln:['Questa città è mia, straniero.','Nessuno estrae più veloce di me.']},
  cittadino_w:{n:'Cittadino',c:'#a87a4a',hat:'#6a4a2a',ln:['Stai lontano dal saloon, se ci tieni alla pelle.','La ferrovia? Arriverà solo se la città torna sicura.']},
  ispettore:{n:'Ispettore Graves',c:'#3a3a44',hat:'#2a2a2a',role:'dim',ln:['La nebbia nasconde tutto, tranne la verità.','Elementare? Niente è elementare, a Londra.']},
  corvus_npc:{n:'Dottor Corvus',c:'#1a1a22',hat:'#111111',ln:['La scienza non ha bisogno di permessi.','Il tempo? Solo un ingranaggio come un altro.']},
  ashby:{n:'Lord Ashby',c:'#5a2a3a',hat:'#1a1a1a',ln:['Colleziono orologi, sì. Ma non li rubo, io li compro.','Quella notte ero al club. Chieda a chiunque.']},
  pip:{n:'Pip il borseggiatore',c:'#6a5a4a',hat:'#4a3a2a',ln:['Io? Io rubo portafogli, mica orologi da museo!','Ho visto un tizio col cilindro nero uscire dal museo. Giuro!']},
  londinese:{n:'Passante',c:'#4a4a5a',hat:'#2a2a2a',ln:['Che nebbia, oggi. Come ieri. Come sempre, ormai.','Dicono che al museo sia successo qualcosa di strano.']},
  marianne:{n:'Marianne',c:'#2a4a8a',hat:'#c0392b',role:'dim',ln:['Libertà, uguaglianza... e un po\' di coraggio!','Questa barricata è tutto ciò che ci separa dalle guardie.']},
  valmont:{n:'Conte di Valmont',c:'#4a2a5a',hat:'#d4af37',role:'dim',ln:['Il mio destino è nelle vostre mani, a quanto pare.','La storia giudicherà anche voi.']},
  cittadino_r:{n:'Rivoluzionario',c:'#3a4a7a',hat:'#c0392b',ln:['Abbasso i privilegi!','Il popolo ha fame, e adesso ha anche voce.']},
  sergente:{n:'Sergente Rossi',c:'#5a5a3a',hat:'#4a4a3a',role:'dim',ln:['Testa bassa e occhi aperti.','Ho visto troppi ragazzi correre allo scoperto.']},
  ferito:{n:'Soldato ferito',c:'#6a6a5a',hat:'#5a5a4a',role:'dim',ln:['...','Acqua... per favore...']}});

/* le epoche, le fasi di ogni missione e le scelte che cambiano la storia */
const ERA={
  west:{n:'Selvaggio West',y:'Dusty Creek, 1878',z:'dim_west',w:{n:'Revolver',mul:1,cd:.38,r:6.5,c:'#ffd84a'},st:[
    {t:'talk',npc:'sceriffo',ob:'Parla con lo Sceriffo Hank',tx:'Straniero, arrivi nel momento peggiore. La banda di Black Jack si è presa la città. Ripulisci la strada principale, poi affronta Jack davanti al saloon: non ha mai perso un duello.',ok:'Ci penso io'},
    {t:'kill',ob:'Elimina i fuorilegge in città',sp:[['bandito_w',8]],n:8},
    {t:'duel',npc:'blackjack',ob:'Sfida Black Jack a duello davanti al saloon'},
    {t:'choice',npc:'blackjack',ob:'Decidi il destino di Black Jack',q:'Black Jack è a terra, ferito. «Lasciami andare, straniero... o finisci il lavoro.» Che cosa fai?',o:[
      ['Consegnalo allo Sceriffo','legge','La legge trionfa: la ferrovia arriva a Dusty Creek e la città prospera per un secolo.',1],
      ['Lascialo andare','leggenda','Black Jack diventa una leggenda del West. Le sue storie si raccontano ancora oggi attorno ai fuochi.',0],
      ['Prendi il suo posto alla guida della banda','fuorilegge','Diventi il nuovo capo dei fuorilegge: la ferrovia non arriverà mai e Dusty Creek diventa una città fantasma.',0]]}]},
  vit:{n:'Londra Vittoriana',y:'Londra, 1888',z:'dim_vit',w:{n:'Pistola a tamburo',mul:.95,cd:.32,r:6,c:'#ffe8a0'},st:[
    {t:'talk',npc:'ispettore',ob:'Parla con l\'Ispettore Graves',tx:'Qualcuno ha rubato l\'Orologio del Tempo dal museo, e da quella notte la nebbia non si alza più. Cerca indizi nei vicoli: almeno cinque. Poi dimmi chi è il colpevole.',ok:'Comincio a indagare'},
    {t:'clue',ob:'Trova 5 indizi nella nebbia',n:5,cl:['Un guanto di gomma da laboratorio, macchiato di verde.','Una boccetta vuota: la sostanza dentro brilla ancora, verde fosforescente.','Un biglietto firmato con una sola lettera: «C.»','Un ingranaggio d\'ottone, troppo preciso per un orologio comune.','Un lampionaio giura di aver visto un uomo alto con un cilindro nero e un camice da scienziato.']},
    {t:'choice',npc:'ispettore',ob:'Accusa il colpevole davanti all\'Ispettore',q:'Hai tre sospettati: il Dottor Corvus, scienziato; Lord Ashby, collezionista di orologi; il piccolo Pip, borseggiatore. Chi ha rubato l\'Orologio del Tempo?',o:[
      ['Il Dottor Corvus','giustizia','Avevi ragione: Corvus si smaschera e i suoi scagnozzi escono dalla nebbia!',1],
      ['Lord Ashby','errore','Lord Ashby viene arrestato... ma dalla nebbia ride qualcuno. Il vero ladro è ancora libero, e attacca.',0],
      ['Il borseggiatore Pip','errore','Pip finisce in prigione piangendo. Il vero ladro, intanto, scatena i suoi scagnozzi.',0]]},
    {t:'kill',ob:'Sconfiggi il Dottor Corvus e i suoi scagnozzi',sp:[['corvus',1],['teppista',4]],n:5}]},
  riv:{n:'Rivoluzione',y:'Parigi, 1789',z:'dim_riv',w:{n:'Moschetto',mul:1.9,cd:.95,r:8,c:'#ffffff'},st:[
    {t:'talk',npc:'marianne',ob:'Parla con Marianne alla barricata',tx:'Le guardie del re stanno arrivando per sgomberare il quartiere. Tieni la barricata con noi! Usa le casse come copertura: i loro moschetti sono lenti, ma fanno male.',ok:'Tengo la barricata'},
    {t:'wave',ob:'Difendi la barricata',w:[[['guardia_reale',5]],[['guardia_reale',6],['granatiere',2]],[['guardia_reale',6],['granatiere',4]]]},
    {t:'choice',npc:'valmont',ob:'Decidi la sorte del Conte di Valmont',q:'Il Conte di Valmont, che comandava le guardie, è vostro prigioniero. La folla urla. Marianne ti guarda: «Decidi tu.»',o:[
      ['Risparmialo e fallo processare','clemenza','Il conte viene processato. La rivoluzione sceglie la legge invece della vendetta, e la Repubblica nasce più giusta.',1],
      ['Consegnalo alla folla','terrore','La folla si prende la sua vendetta. Comincia una stagione di paura che segnerà la rivoluzione per sempre.',0]]}]},
  war:{n:'Epoca delle Guerre',y:'Il fronte, 1917',z:'dim_war',w:{n:'Fucile',mul:.85,cd:.24,r:8,c:'#ffcc66'},st:[
    {t:'talk',npc:'sergente',ob:'Parla con il Sergente Rossi in trincea',tx:'Dobbiamo prendere la trincea nemica prima dell\'alba. Avanza da una copertura all\'altra: sacchi di sabbia, crateri, muri. Se resti allo scoperto sei morto.',ok:'Pronto ad avanzare'},
    {t:'kill',ob:'Elimina i soldati nella terra di nessuno',sp:[['soldato',10]],n:10},
    {t:'kill',ob:'Distruggi i 3 nidi di mitragliatrice',sp:[['mitragliatrice',3]],n:3,fix:1},
    {t:'choice',npc:'ferito',ob:'Decidi che cosa fare del soldato ferito',q:'Nella trincea conquistata trovi un soldato nemico ferito. Ha più o meno la tua età. Ti guarda in silenzio.',o:[
      ['Curalo e portalo nelle retrovie','pietà','Il soldato sopravvive. Anni dopo scriverà un libro sulla pace che verrà letto in tutto il mondo.',1],
      ['Lascialo dov\'è e prosegui','ferro','Prosegui senza voltarti. La guerra continua, e nessuno ricorderà il suo nome.',0]]}]}};
const ERAK=['west','vit','riv','war'];
const dimE=()=>DIM&&DIM.cur?DIM.era[DIM.cur]:null,dimSt=()=>{const e=dimE();return e&&!e.done?ERA[DIM.cur].st[e.s]:null},dimW=()=>DIM&&DIM.cur?ERA[DIM.cur].w:ERA.west.w;
function dimSave(){if(DIM)LS.set(DIMK,{d:DIM,t:Date.now()})}
function dimObj(){let el=$('dimobj');if(MODE!=='dim'||!started){if(el)el.style.display='none';return}if(!el){el=document.createElement('div');el.id='dimobj';document.body.appendChild(el)}
  const st=dimSt(),e=dimE(),dn=ERAK.filter(k=>DIM.era[k]&&DIM.era[k].done).length;let tx;
  if(Zk==='dim_hub')tx=dn>=4?'Tutte le epoche sono in ordine: usa la console per tornare a casa.':'Usa la console al centro della Cabina per scegliere un\'epoca.';
  else if(!st)tx='Epoca completata: torna alla Cabina.';
  else{tx=st.ob;if(st.t==='kill')tx+=' ('+Math.min(e.k||0,st.n)+'/'+st.n+')';if(st.t==='clue')tx+=' ('+(e.cl||[]).length+'/'+st.n+')';if(st.t==='wave')tx+=' (ondata '+Math.min((e.wv||0)+1,st.w.length)+'/'+st.w.length+')'}
  el.innerHTML=`<b>⏳ ${DIM.cur&&Zk!=='dim_hub'?ERA[DIM.cur].n:'Voxelia Dimension'}</b><span>${tx}</span><small>Epoche completate: ${dn}/4 · Arma: ${dimW().n}</small>`;el.style.display='block'}
function dimSpawn(ty,fix,i){const z=Z[Zk],L=fix&&z.mg?z.mg:z.sps;if(!L||!L.length)return;const[x,y]=fix&&z.mg?L[i%L.length]:L[Math.floor(Math.random()*L.length)];
  const[fx2,fy2]=nearFree(x,y);const m=mk(ty,fx2,fy2,30000+Math.floor(Math.random()*90000));m.dtag=1;ents.push(m);return m}
function dimSetup(re){const k=DIM.cur,e=dimE(),st=dimSt();ents=ents.filter(q=>!(q.k==='en'&&q.dtag)&&q.k!=='clue');if(!st){dimObj();return}e.k=0;
  if(st.t==='kill'){for(const[ty,n]of st.sp)for(let i=0;i<n;i++)dimSpawn(ty,st.fix,i)}
  if(st.t==='clue')(Z[Zk].clues||[]).forEach(([x,y],i)=>{if(!(e.cl||[]).includes(i))ents.push({k:'clue',i,n:'Indizio',px:x+.5,py:y+.5})});
  if(st.t==='wave'){e.wv=re?0:(e.wv||0);dimWave()}
  dimObj();if(!re)banner(ERA[k].n,st.ob,'pergamena')}
function dimWave(){const st=dimSt(),e=dimE();if(!st||st.t!=='wave')return;for(const[ty,n]of st.w[e.wv]||[])for(let i=0;i<n;i++){const m=dimSpawn(ty);if(m)m.al=1}banner('Ondata '+(e.wv+1)+' di '+st.w.length,'Le guardie del re avanzano: restate dietro la barricata!','spade');dimObj()}
function dimNext(){const e=dimE();if(!e)return;e.s++;if(e.s>=ERA[DIM.cur].st.length){e.done=1;banner(ERA[DIM.cur].n+' · completata','La storia ha preso la sua strada. Torna alla Cabina.','corona');jingle([67,72,76,79,84],.1,'triangle');ents=ents.filter(q=>q.k!=='clue')}else dimSetup(false);dimSave();dimObj();npcMarks()}
function dimKill(q){const st=dimSt(),e=dimE();if(!st)return;e.k=(e.k||0)+1;
  if(st.t==='kill'&&e.k>=st.n)dimNext();
  else if(st.t==='wave'&&!ents.some(x=>x.k==='en'&&x.dtag)){e.wv=(e.wv||0)+1;if(e.wv>=st.w.length)dimNext();else e.wt=2.5}dimObj()}
function dimChoose(i){const st=dimSt(),e=dimE();if(!st||st.t!=='choice')return;const o=st.o[i];e.c=o[1];e.good=o[3];e.ct=o[2];cl();dimNext();PA={ti:'La storia cambia',tx:o[2]};pn('txt')}
function dimNpcHTML(id){const st=dimSt(),e=dimE();if(!DIM)return'';
  if(e&&e.done){const ch=e.c?ERA[DIM.cur].st.find(s=>s.t==='choice').o.find(o=>o[1]===e.c):null;return ch?`<p class="qb">La storia ha preso questa strada: ${ch[2]}</p>`:''}
  if(!st||st.npc!==id)return'';
  if(st.t==='talk')return`<p class="qb">${st.tx}</p><button onclick="dimNext();cl()">✔ ${st.ok}</button>`;
  if(st.t==='duel')return`<p class="qb">«Tu e io, straniero. Davanti al saloon. Quando senti "FUOCO!", estrai. Non un attimo prima.»</p><button onclick="duelStart()">🤠 Accetta il duello</button>`;
  if(st.t==='choice')return`<p class="qb">${st.q}</p>`+st.o.map((o,i)=>`<button onclick="dimChoose(${i})">${o[0]}</button>`).join('');return''}
/* spari del giocatore: in Dimension si combatte a distanza, e le coperture fermano i proiettili */
function dimShoot(tg){const w=dimW(),a=Math.atan2(tg.py-P.py,tg.px-P.px),r=roll();P.at=w.cd;P.sw=.15;P.swc++;
  PPJ.push({x:P.px,y:P.py,vx:Math.cos(a)*16,vy:Math.sin(a)*16,t:w.r/16+.15,d:Math.round(r.d*w.mul),cr:r.cr,c:w.c});tone(160,.05,'square',.06);tone(90,.09,'sawtooth',.05);if(cineOK())sparks(P.px+Math.cos(a)*.5,P.py+Math.sin(a)*.5,4,[w.c,'#ffffff'],40)}
function dimTick(dt){if(MODE!=='dim')return;
  for(const p of PPJ){p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(blk(p.x,p.y)){p.t=0;if(cineOK())sparks(p.x,p.y,5,['#d8c8a0','#ffffff'],40);continue}
    for(const q of ents)if(q.k==='en'&&Math.hypot(q.px-p.x,q.py-p.y)<.5){p.t=0;hurtE(q,p.d,0,p.cr);break}}PPJ=PPJ.filter(p=>p.t>0);
  const e=dimE();if(e&&e.wt){e.wt-=dt;if(e.wt<=0){e.wt=0;dimWave()}}}
function ppjDraw(){for(const p of PPJ)box(p.x-.06,p.y-.06,14,.12,.12,3,p.c,1.3)}
function fogDraw(){g.save();g.setTransform(DPR,0,0,DPR,0,0);const bs=blobSpr('200,205,210');g.globalAlpha=.22;for(let i=0;i<6;i++){const x=((t*14+i*260)%(W+400))-200,y=H*(.2+i*.13);g.drawImage(bs,x-260,y-260,520,520)}g.globalAlpha=1;g.fillStyle='rgba(150,160,170,.12)';g.fillRect(0,0,W,H);g.restore()}
/* duello del West */
function duelStart(){const st=dimSt();if(!st||st.t!=='duel')return;DU={ph:'wait',tf:performance.now()+1500+Math.random()*2200,msg:'Mano alla fondina... aspetta il segnale.'};clearInterval(DUT);DUT=setInterval(duelTick,30);pn('duel')}
function duelTick(){if(PM!=='duel'||!DU){clearInterval(DUT);return}const now=performance.now();if(DU.ph==='wait'&&now>=DU.tf){DU.ph='fire';DU.te=now+520;tone(880,.12,'square',.07);pn('duel');return}
  if(DU.ph==='fire'&&now>DU.te){DU.ph='lose';DU.msg='Troppo lento! Black Jack ti ha colpito.';P.hp=Math.max(1,P.hp-Math.round(P.mx*.25));flash('#ff4020',.35,300);tone(90,.3,'sawtooth',.08);hud();pn('duel')}}
function duelShoot(){if(!DU)return;if(DU.ph==='wait'){DU.ph='lose';DU.msg='Troppo presto! Hai estratto prima del segnale e Black Jack ne ha approfittato.';P.hp=Math.max(1,P.hp-Math.round(P.mx*.15));flash('#ff4020',.3,250);hud();pn('duel');return}
  if(DU.ph!=='fire')return;DU.ph='win';tone(160,.06,'square',.08);tone(70,.3,'sawtooth',.06);jingle([67,72,76,79],.09,'triangle');DU=null;clearInterval(DUT);cl();
  banner('Duello vinto!','Black Jack crolla nella polvere, ferito.','spade');dimNext();const bj=ents.find(q=>q.nid==='blackjack');if(bj){PA=bj;pn('npc')}}
/* cabina, console, indizi: modelli */
const cabinaL=()=>{const on=Math.sin(t*4)>0;return[[-.36,-.36,0,.72,.72,44,'#1a3a8a'],[-.42,-.42,44,.84,.84,4,'#12306e'],[-.12,-.12,48,.24,.24,5,on?'#ffffff':'#9ad0ff',on?1.4:1],
  [-.3,.37,32,.6,.03,7,'#0a1a3a'],[-.28,.38,10,.25,.03,18,'#cfe8ff'],[.03,.38,10,.25,.03,18,'#cfe8ff'],[.37,-.28,10,.03,.25,18,'#cfe8ff'],[.37,.03,10,.03,.25,18,'#cfe8ff'],[.37,-.3,32,.03,.6,7,'#0a1a3a']]};
const consoleL=()=>[[-.6,-.6,0,1.2,1.2,8,'#2a3a6a'],[-.45,-.45,8,.9,.9,6,'#3a5aa8'],[-.15,-.15,14,.3,.3,26+Math.sin(t*3)*4,'#7affff',1.3],[-.5,-.5,14,.2,.2,4,'#ffd84a',1.2],[.3,.3,14,.2,.2,4,'#ff6a6a',1.2],[.3,-.5,14,.2,.2,4,'#6aff8a',1.2]];
/* le mappe delle epoche */
function genHub({R4,F,n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)M[y][x]=0;for(const[x,y]of[[3,3],[12,3],[3,12],[12,12]])F(x,y,'<');
  for(let x=5;x<=10;x++)for(const y of[5,10])if(x===5||x===10||y===5||y===10)DEC[y][x]=DEC[y][x]||'';ents.push({k:'console',n:'Console temporale',px:8,py:8});return[8,12]}
function genWest({R4,D,F,H,N2,n}){R4(2,18,36,4,4);
  for(const[x,y,w,h,wc,rc]of[[4,10,7,6,'#a8784a','#6a3a2a'],[13,11,6,5,'#8a6a4a','#4a3a2a'],[21,11,6,5,'#b8a080','#5a4a3a'],[29,10,7,6,'#9a7a5a','#5a3a2a'],[4,24,7,6,'#8a5a3a','#5a3a1a'],[14,24,6,5,'#e8e0d0','#5a4a4a'],[23,24,6,5,'#a88a6a','#4a3a2a'],[30,24,6,6,'#b88a5a','#6a3a2a']])H({x,y,w,h,wall:wc,roof:rc,ht:26});
  for(const x of[3,9,15,21,27,33]){D(x,17,'f');D(x,22,'f')}for(const[x,y,c]of[[11,19,'b'],[12,20,'x'],[26,19,'b'],[34,20,'k'],[19,21,'b']])F(x,y,c);
  for(let i=0;i<90;i++){const x=ri(2,n-3),y=ri(2,n-3);if(y<9||y>30)D(x,y,R()<.7?'¢':'u')}
  ents.push(po(3,20,'dim_hub',{st:'cabina',n:'La Cabina'}));N2('sceriffo',15,17);N2('blackjack',8,17);for(const[x,y]of[[20,23],[28,17],[10,23]])N2('cittadino_w',x,y,{wd:1});
  Z.dim_west.sps=[];for(let k=0;k<400&&Z.dim_west.sps.length<16;k++){const x=ri(14,37),y=ri(18,21);if(M[y][x]===4)Z.dim_west.sps.push([x,y])}return[5,20]}
function genVit({R4,D,F,H,N2,n}){for(const v of[8,19,30]){R4(2,v,36,3,4);R4(v,2,3,36,4)}
  const cols=[['#8a4a3a','#3a2a2a'],['#7a5a4a','#2a2a32'],['#6a4a42','#3a3a3a'],['#8a6a5a','#2a3a3a']];let i=0;
  for(const[x0,x1]of[[2,7],[11,18],[22,29],[33,37]])for(const[y0,y1]of[[2,7],[11,18],[22,29],[33,37]]){const c=cols[(i++)%4];H({x:x0+1,y:y0+1,w:x1-x0-1,h:y1-y0-1,wall:c[0],roof:c[1],ht:34})}
  for(const[x,y,c]of[[12,12,'k'],[24,23,'$'],[13,31,'b'],[34,20,'k'],[26,9,'$']])F(x,y,c);
  Z.dim_vit.clues=[[12,9],[25,20],[9,31],[34,10],[20,35]];ents.push(po(3,20,'dim_hub',{st:'cabina',n:'La Cabina'}));
  N2('ispettore',9,20);N2('corvus_npc',24,9);N2('ashby',31,21);N2('pip',20,31);for(const[x,y]of[[15,20],[20,14],[27,31]])N2('londinese',x,y,{wd:1});
  Z.dim_vit.sps=[];for(let k=0;k<400&&Z.dim_vit.sps.length<16;k++){const x=ri(12,37),y=ri(2,37);if(M[y][x]===4)Z.dim_vit.sps.push([x,y])}return[5,20]}
function genRiv({R4,D,F,H,N2,n}){R4(3,8,34,30,4);
  for(let x=2;x<38;x+=7)H({x,y:2,w:6,h:5,wall:'#c8b898',roof:'#5a4a6a',ht:28});for(let y=10;y<36;y+=8){H({x:1,y,w:2,h:6,wall:'#b8a888',roof:'#4a4a5a',ht:24});H({x:37,y,w:2,h:6,wall:'#b8a888',roof:'#4a4a5a',ht:24})}
  const bc=['k','x','b','k','k'];for(let x=4;x<=35;x++)if(x!==10&&x!==20&&x!==30)F(x,20,bc[x%5]);F(4,21,'Ŧ');F(35,21,'Ŧ');F(20,24,'Ŧ');
  for(const[x,y,c]of[[8,27,'b'],[31,27,'k'],[14,32,'x']])F(x,y,c);ents.push(po(20,34,'dim_hub',{st:'cabina',n:'La Cabina'}));
  N2('marianne',20,24);N2('valmont',27,30);for(const[x,y]of[[12,26],[26,25],[16,30]])N2('cittadino_r',x,y,{wd:1});
  Z.dim_riv.sps=[];for(let k=0;k<400&&Z.dim_riv.sps.length<16;k++){const x=ri(4,35),y=ri(9,13);if(M[y][x]===4)Z.dim_riv.sps.push([x,y])}return[20,32]}
function genWar({R4,D,F,W,N2,n}){R4(2,33,36,4,4);R4(2,3,36,4,4);
  for(let y=8;y<32;y++)for(let x=2;x<38;x++)if(R()<.06)W(x,y,'·');
  for(const y of[29,25,21,17,12,9])for(let k=0;k<4;k++){const x0=ri(3,33);for(let x=x0;x<x0+3;x++)if(M[y][x]===0)F(x,y,'ß')}
  for(const y of[27,15]){for(let x=2;x<38;x++)if(x%6!==0&&R()<.7&&M[y][x]===0)F(x,y,'¤')}
  for(let i=0;i<14;i++){const x=ri(3,36),y=ri(8,31);if(M[y][x]===0)F(x,y,R()<.5?'u':'d')}for(let x=2;x<38;x+=3)F(x,7,'ß');for(let x=3;x<38;x+=3)if(M[32][x]===0)F(x,32,'ß');
  Z.dim_war.mg=[[10,5],[20,4],[30,5]];ents.push(po(4,35,'dim_hub',{st:'cabina',n:'La Cabina'}));N2('sergente',20,35);N2('ferito',22,4);
  Z.dim_war.sps=[];for(let k=0;k<500&&Z.dim_war.sps.length<20;k++){const x=ri(3,36),y=ri(8,22);if(M[y][x]===0)Z.dim_war.sps.push([x,y])}return[8,35]}
Object.assign(Z,{
  dim_hub:{nolamp:1,n:'La Cabina · interno',lv:6,N:16,a:'#1a2a4a',b:'#1e3052',bg:'#05070f',mus:'dimhub',pt:'mote',gen:genHub,dist:1,wl:'#2a4a8a',wh:44,rd:['#2a3a6a','#24345e']},
  dim_west:{nolamp:1,n:'Dusty Creek · 1878',lv:6,N:40,a:'#c8a870',b:'#c0a068',bg:'#f0c890',mus:'west',pt:'dust',gen:genWest,dist:1,wl:'#8a6a4a',wh:14,rd:['#b89060','#ae8858']},
  dim_vit:{n:'Londra · 1888',lv:7,N:40,a:'#5a6a5a',b:'#546454',bg:'#6a707a',mus:'vit',pt:'mote',gen:genVit,dist:1,wl:'#5a3a32',wh:30,rd:['#6a6a72','#62626a']},
  dim_riv:{n:'Parigi · 1789',lv:7,N:40,a:'#8a8a70',b:'#82826a',bg:'#9ab0c8',mus:'riv',pt:'dust',gen:genRiv,dist:1,wl:'#9a8a70',wh:24,rd:['#a09a8a','#969080']},
  dim_war:{nolamp:1,n:'Il fronte · 1917',lv:8,N:40,a:'#5a4a3a',b:'#54442f',bg:'#6a6458',mus:'war',pt:'ember',gen:genWar,dist:1,wl:'#4a3a2a',wh:16,rd:['#3a3024','#342a20']}});
function dimSkyInit(){if(!SKY.dim_hub)Object.assign(SKY,{dim_hub:['#05070f','#0a1020','#141c30'],dim_west:['#4a8ad0','#f0c890','#ffe0b0'],dim_vit:['#5a606a','#8a9098','#b0b4b8'],dim_riv:['#4a7ab0','#9ab0c8','#d8e0e8'],dim_war:['#4a4a48','#7a746a','#a89e8a']})}
/* inizio, console, ritorno a casa */
function beginDim(fresh){cineReset();auInit();dimSkyInit();document.body.classList.add('dimm');const sv=LS.get(DIMK,null);DIM=(!fresh&&sv&&sv.d)?sv.d:{era:{},seen:0,done:0};DIM.cur=null;MODE='dim';DF=DFS[1];P=newP();
  Object.assign(P,{lv:8,g:0,pot:6,unl:{},res:{},fish:{},stash:[],sold:{},room:0,bag:0});P.eq={w:{u:uid(),s:'w',r:2,v:16,n:'Pistola temporale',p:0}};INV=24;recalc();P.hp=P.mx;
  NET.name=($('nm').value.trim()||'Viaggiatore').replace(/[<>]/g,'').slice(0,14);NET.code='';cineOff();SZ=1;PPJ=[];
  const go=()=>{$('menu').style.display='none';closeSet();document.body.classList.add('ig');inMenu=0;started=1;last=performance.now();load('dim_hub');hudApply&&hudApply();wheelApply();dimObj();
    PA={ti:'La Cabina',tx:'Sei dentro la cabina blu, ed è immensa. Una console pulsa al centro della sala.\n\nScegli un\'epoca dalla console e rimetti in ordine la storia: ogni missione si chiude con una decisione, e ogni decisione cambia il finale. Qui si combatte a distanza: clicca su un nemico per sparargli. Muri, casse e sacchi di sabbia fermano i proiettili, i tuoi e i loro: usali come copertura. Shift o E per schivare.'};pn('txt')};
  if(!DIM.seen){DIM.seen=1;dimSave();playCine(DCI,'dimintro',go)}else go()}
function dimTravel(k){if(!DIM)return;DIM.cur=k;if(!DIM.era[k])DIM.era[k]={s:0,c:null,done:0};cl();whoosh();irisGo(()=>load(ERA[k].z,'dim_hub'))}
function dimHome(){cl();if(ERAK.some(k=>!(DIM.era[k]&&DIM.era[k].done)))return;const good=ERAK.filter(k=>DIM.era[k].good).length;
  const end=good>=4?['La Linea Perfetta','Ogni scelta ha rimesso a posto un pezzo di storia. La linea del tempo è intatta, e nessuno saprà mai quanto ci è andata vicino.']:good>=2?['La Storia Incrinata','La storia regge, ma qualcosa è cambiato: piccole crepe nel tempo che solo tu ricordi.']:['Il Tempo Spezzato','Sei tornato a casa, ma le epoche portano le cicatrici delle tue scelte. Il mondo che conoscevi non è più lo stesso.'];
  const extra=DIM.era.west.c==='fuorilegge'?' Nei libri di storia, ora, c\'è anche il nome di un nuovo fuorilegge del West: il tuo.':'';
  DIM.done=1;DIM.end=end[0];dimSave();started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';const el=$('dimobj');if(el)el.style.display='none';
  DCF[2].tx='Finale: «'+end[0]+'». '+end[1]+extra;playCine(DCF,'dimend',()=>{MODE='story';$('menu').style.display='flex';inMenu=1;music('menu');mode('dim')})}
function dimDie(){const z=Zk;P.hp=P.mx;PPJ=[];msg('Sei caduto... la Cabina ti riporta all\'inizio dell\'epoca.');irisGo(()=>load(z,'dim_hub'))}
function dimSelHTML(){let h='<h3>⏳ Console temporale</h3><p class="mu">Scegli l\'epoca. Ogni missione finisce con una decisione che cambia il corso della storia.</p>';
  for(const k of ERAK){const e=DIM.era[k],E4=ERA[k];const s=e&&e.done?'✔ completata':e?'in corso: '+(E4.st[e.s]?E4.st[e.s].ob:''):'da esplorare';
    h+=`<div class="qb"><b>${E4.n}</b> · <i>${E4.y}</i><br><small>${s}${e&&e.c?' · scelta: '+e.c:''} · arma: ${E4.w.n}</small><br><button onclick="dimTravel('${k}')">🚪 Viaggia</button></div>`}
  if(ERAK.every(k=>DIM.era[k]&&DIM.era[k].done))h+=`<button onclick="dimHome()">🌀 Torna nella dimensione originale</button>`;return h+'<button onclick="cl()">Chiudi</button>'}
/* cinematiche di Dimension */
const DCI=[{d:6.5,tx:'Una notte qualunque, nella Foresta di Elmwood. Nessun rumore, solo il vento tra gli alberi.',f:'forest'},
  {d:6.5,tx:'Poi, dal nulla, un suono impossibile. E una cabina blu, apparsa in mezzo agli alberi.',f:'appear'},
  {d:6.5,tx:'La porta si aprì da sola. Una forza invisibile ci trascinò dentro.',f:'suck'},
  {d:7,tx:'Dentro era immensa, più grande di quanto fosse possibile. E la cabina partì, attraverso il tempo.',f:'vortex'},
  {d:6.5,tx:'Per tornare a casa dovrai rimettere in ordine la storia, un\'epoca dopo l\'altra.',f:'title'}];
const DCF=[{d:6.5,tx:'L\'ultima epoca è in ordine. La Cabina riparte, come una nave tra le correnti del tempo.',f:'vortex'},
  {d:7,tx:'Atterra all\'alba, nello stesso punto della Foresta di Elmwood. La porta si apre: sei a casa.',f:'home'},{d:9,tx:'',f:'end'},{d:5,tx:'Fine. Grazie per aver viaggiato con Voxelia Dimension.',f:'title'}];
function playCine(L,mus,cb){auInit();CN={L,t:0,cb,shown:''};$('menu').style.display='none';let el=$('cine2');
  if(!el){el=document.createElement('div');el.id='cine2';el.innerHTML='<div class="itx" id="ctx"></div><button class="iskip" onclick="cineSkip()">Salta ▸</button>';document.body.appendChild(el)}el.style.display='flex';music(mus)}
function cineSkip(){if(!CN)return;const cb=CN.cb;CN=null;const el=$('cine2');if(el)el.style.display='none';if(cb)cb()}
function cineBooth(x,y,a,open){if(a<=0)return;g.globalAlpha=a;drawL(cabinaL(),x,y,0);if(open)box(x-.3,y+.36,0,.6,.04,30,'#fff8d0',1.5);g.globalAlpha=1}
function cineDraw(dt){const C=CN;C.t+=dt;let s=0,a0=0;while(s<C.L.length&&C.t>a0+C.L[s].d){a0+=C.L[s].d;s++}if(s>=C.L.length){cineSkip();return}
  const S2=C.L[s],lt=C.t-a0,D=S2.d,f=S2.f;g.setTransform(DPR,0,0,DPR,0,0);
  const night=f==='forest'||f==='appear'||f==='suck',gr=g.createLinearGradient(0,0,0,H);
  if(f==='vortex'||f==='title'||f==='end'){gr.addColorStop(0,'#05061a');gr.addColorStop(1,'#120a2a')}else if(f==='home'){gr.addColorStop(0,'#f8b878');gr.addColorStop(1,'#5a8ad0')}else{gr.addColorStop(0,'#04060f');gr.addColorStop(1,'#14203a')}
  g.fillStyle=gr;g.fillRect(0,0,W,H);const sc=Math.min(W,H)/480,cx=lt*.15,cy=-lt*.15;
  if(night||f==='home'){introSc(sc,cx,cy);introGround(sc,cx,cy);if(night){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(5,10,30,.62)';g.fillRect(0,0,W,H);introSc(sc,cx,cy)}}
  if(f==='forest'){const hx=cx-5+lt*.8,hy=cy+5-lt*.8;drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),hx,hy,Math.abs(Math.sin(lt*9))*2,0,5)}
  if(f==='appear'){const a=lt<3?(Math.sin(lt*14)>0?lt/3:lt/6):1;cineBooth(cx+1,cy-1,a,0);drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),cx-1.5,cy+1.5,0,0,1);
    if(lt<3&&Math.sin(lt*14)>.6){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(160,200,255,.25)';g.fillRect(0,0,W,H)}}
  if(f==='suck'){cineBooth(cx+1,cy-1,1,1);const k=Math.min(1,lt/4),hx=cx-1.5+k*2.4,hy=cy+1.5-k*2.4;if(k<1){const L2=heroL(APM,1,APM.hh?2:-1,1,20,0,0);drawHero(scl(L2,1-k*.85),hx,hy,k*20,0,Math.floor(lt*10)%8)}
    for(let i=0;i<20;i++){const a=lt*3+i,r=(i%5)*.5+.5;box(cx+1+Math.cos(a)*r,cy-1+Math.sin(a)*r,10+i*2,.08,.08,2,'#bfe0ff',1.4)}}
  if(f==='vortex'||f==='end'){g.setTransform(DPR,0,0,DPR,0,0);for(let i=0;i<22;i++){const r=((i*40+lt*120)%(Math.max(W,H)*.8)),a=lt*.8+i*.4;g.strokeStyle=`hsla(${(200+i*12+lt*40)%360},80%,60%,${.15+.25*(1-r/(Math.max(W,H)*.8))})`;g.lineWidth=4;g.beginPath();g.ellipse(W/2,H/2,r,r*.55,a*.1,0,6.3);g.stroke()}
    if(f==='vortex'){introSc(sc,0,0);const sp=lt*2;cineBooth(Math.sin(sp)*.4,Math.cos(sp)*.4,1,0)}}
  if(f==='home'){const k=Math.min(1,lt/3);cineBooth(cx+1,cy-1,lt<5?1:Math.max(0,1-(lt-5)/1.5),lt>2.5&&lt<5);if(lt>3)drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),cx+.2-Math.min(1,(lt-3)/2)*1.4,cy+.4+Math.min(1,(lt-3)/2)*1.4,0,0,5)}
  if(f==='sleep'){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='#05060c';g.fillRect(0,0,W,H);g.font='bold 44px Georgia,serif';g.textAlign='center';for(let i=0;i<3;i++){const k=(lt*.5+i*.33)%1;g.globalAlpha=1-k;g.fillStyle='#9ad0ff';g.fillText('Z',W/2+i*34+Math.sin(lt*2+i)*10,H*.5-k*140)}g.globalAlpha=1}
  if(f==='calm'||f==='storm'||f==='clash'||f==='clash2'||f==='board')cineSea(lt,f);if(f==='treasure')cineTreasure(lt);if(TCF.has(f))truthCine(lt,f);
  if(f==='title'||f==='end'){g.setTransform(DPR,0,0,DPR,0,0);const a=Math.min(1,lt/1.2);g.globalAlpha=a;g.textAlign='center';g.font=`bold ${Math.round(Math.min(W,H)/11)}px Georgia,serif`;g.lineWidth=6;g.strokeStyle='#0a0a2a';
    const T=f==='end'?(DIM&&DIM.end?DIM.end:'Fine'):'VOXELIA DIMENSION';g.strokeText(T,W/2,H*.34);g.fillStyle='#9ad0ff';g.fillText(T,W/2,H*.34);g.globalAlpha=1}
  g.setTransform(DPR,0,0,DPR,0,0);const fa=Math.max(0,1-lt/.7,1-(D-lt)/.7);if(fa>0){g.fillStyle=`rgba(0,0,0,${fa})`;g.fillRect(0,0,W,H)}
  const n=Math.min(S2.tx.length,Math.floor(Math.max(0,lt-.6)*42)),tx=S2.tx.slice(0,n);if(tx!==C.shown){C.shown=tx;const el=$('ctx');if(el)el.textContent=tx}}
/* menu: scelta della modalità */
function mode(m){const a=$('msel'),b=$('mstory'),c=$('mdim');if(!a)return;a.hidden=!!m;b.hidden=m!=='story';c.hidden=m!=='dim';menuAnim(m==='story'?b:m==='dim'?c:a);if(m==='dim')dimMenu();tone(520,.05,'triangle')}
function dimMenu(){const sv=LS.get(DIMK,null),d=sv&&sv.d,dn=d?ERAK.filter(k=>d.era[k]&&d.era[k].done).length:0,el=$('mdimb');if(!el)return;
  el.innerHTML=(d&&!d.done?`<button class="dcard" onclick="beginDim(false)"><b>▶ Continua il viaggio</b><small>Epoche completate: ${dn}/4</small></button>`:'')+
    (d&&d.done?`<p class="mnote">Hai completato Voxelia Dimension con il finale «${esc(d.end||'')}».</p>`:'')+
    `<button class="dcard" onclick="ovrDim()"><b>✨ Nuovo viaggio</b><small>Inizia dalla cabina apparsa nella Foresta di Elmwood.</small></button>`+
    `<button class="dcard" onclick="playCine(DCI,'dimintro',()=>{$('menu').style.display='flex';music('menu')})"><b>🎬 Cinematica iniziale</b><small>Come siamo finiti dentro la cabina.</small></button>`}
(function(){const st=document.createElement('style');st.textContent=`
#dimobj{position:fixed;left:10px;top:150px;z-index:20;max-width:300px;background:rgba(8,14,34,.82);border:1px solid #5a8ad8;border-radius:8px;padding:8px 10px;color:#e8f0ff;font:13px Georgia,serif;display:none}
body.dimm #qt{display:none!important}#dimobj b{display:block;color:#9ad0ff}#dimobj span{display:block;margin:3px 0}#dimobj small{opacity:.75}
#cine2{position:fixed;inset:0;display:none;align-items:flex-end;justify-content:center;z-index:60;pointer-events:none}
#cine2 .itx{max-width:min(820px,90vw);margin-bottom:11vh;font:italic 22px Georgia,serif;color:#e8f0ff;text-align:center;text-shadow:0 2px 8px #000;line-height:1.55;min-height:3em}
#cine2 .iskip{pointer-events:auto;position:fixed;right:24px;bottom:24px;font:15px Georgia,serif;background:rgba(10,20,40,.75);color:#e8f0ff;border:1px solid #5a8ad8;border-radius:8px;padding:8px 14px;cursor:pointer}
#msel{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:10px 0}
#msel .mode{text-align:left;padding:16px;border-radius:12px;border:1px solid #ffffff33;background:rgba(20,24,40,.7);color:#f0ece0;cursor:pointer;font:inherit;animation:vxin .6s ease-out both;transition:transform .15s,box-shadow .15s}
#msel .mode:hover{transform:translateY(-4px);box-shadow:0 8px 22px rgba(0,0,0,.4)}#msel .mode b{display:block;font-size:20px;margin-bottom:6px}#msel .mode small{display:block;opacity:.85;line-height:1.4}
#msel .mode.dim{border-color:#5a8ad8;background:linear-gradient(160deg,rgba(20,40,90,.8),rgba(30,10,60,.8))}#msel .mode.wip{opacity:.8}#msel .mode i:not(.vi){float:right;font-style:normal;font-size:11px;background:#f5b942;color:#1b2030;border-radius:10px;padding:1px 8px;font-weight:bold}
.mback{margin:4px 0 8px;font:inherit;cursor:pointer;background:transparent;color:#f5d08a;border:1px solid #f5b94266;border-radius:6px;padding:5px 10px}
#mdim .dgrid{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}`;document.head.appendChild(st)})();

function dimClue(e){const st=dimSt(),d2=dimE();if(!st||st.t!=='clue')return;ents.splice(ents.indexOf(e),1);d2.cl=(d2.cl||[]).concat(e.i);const n=d2.cl.length;
  PA={ti:'Indizio '+n+' di '+st.n,tx:st.cl[e.i]};pn('txt');tone(700,.08,'triangle');dimObj();if(n>=st.n)dimNext()}

/* ================= 6.4: zaino visibile, pesca con canna e mulinello, parate, arti marziali, tempesta e stiva ================= */
/* ordinamento dei pezzi dell'eroe: ciò che sta sotto si disegna prima di ciò che gli sta sopra */
const ovlB=(a,b)=>a[0]<b[0]+b[3]-.001&&b[0]<a[0]+a[3]-.001&&a[1]<b[1]+b[4]-.001&&b[1]<a[1]+a[4]-.001;
function hsort(p,q){if(ovlB(p,q)){if(p[2]+p[5]<=q[2]+.01)return -1;if(q[2]+q[5]<=p[2]+.01)return 1}return dsort(p,q)}
/* lo zaino sulla schiena cambia con il livello dello zaino comprato */
function bagL(tr){const C=[['#8a6a42','#5a3a22'],['#6a4a2a','#4a8a3a'],['#4a3a2a','#3a6aa8'],['#5a2a6a','#d4af37']][tr]||['#8a6a42','#5a3a22'],w=.3+tr*.04,h=8+tr*2.5;
  const L=[[-w/2,-.36,11,w,.15,h,C[0]],[-w/2+.02,-.38,11+h*.55,w-.04,.04,h*.4,C[1]],[-.16,-.22,12,.05,.08,9,C[1]],[.11,-.22,12,.05,.08,9,C[1]]];
  if(tr>=1)L.push([-w/2-.05,-.35,11+h,w+.1,.13,3,'#c8b890']);if(tr>=2)L.push([w/2,-.32,12,.07,.1,5,'#ffe08a']);if(tr>=3)L.push([-w/2,-.385,11,w,.02,1.5,'#d4af37'],[-w/2,-.385,11+h-1.5,w,.02,1.5,'#d4af37']);return L}
const rodL=()=>{const L=[];for(let k=0;k<7;k++)L.push([.24,.05+k*.13,14+k*3.2,.04,.13,3,k<2?'#3a2a1a':'#8a6a42']);return L};
/* ---- pesca: lancio con la canna, abboccata, mulinello ---- */
let FSPOT=null;
function fishStart(){const sp=FSPOT;FSH={ph:'aim',pw:0,pd:1,hold:0,msg:'Tieni premuto Lancia per caricare il lancio, poi rilascia.',dx:sp?sp.ox:0,dy:sp?sp.oy:1,sx:sp?sp.px:P.px,sy:sp?sp.py:P.py,bx:0,by:0,k:0,rph:''};
  if(sp)P.dr=[sp.ox,sp.oy];clearInterval(FST);FST=setInterval(fishTick,30);pn('fish')}
function fishKey(on){const F=FSH;if(!F)return;
  if(F.ph==='aim'){if(on)F.hold=1;else if(F.hold){F.hold=0;const pw=F.pw,d=.9+pw*2.4;F.good=pw>=.62&&pw<=.9;F.bx=F.sx+F.dx*d;F.by=F.sy+F.dy*d;F.ph='fly';F.k=0;F.msg=F.good?'Lancio perfetto! L\'amo vola lontano.':'Lancio!';whoosh()}}
  else if(F.ph==='bite'&&on){F.ph='reel';F.dist=1;F.ten=0;F.esc=12+F.f.d*6;F.pull=false;F.pt=1;F.hold=0;F.msg='Preso all\'amo! Gira il mulinello.';tone(500,.08,'square',.05)}
  else if(F.ph==='reel')F.hold=on?1:0;
  else if(F.ph==='end'&&on)fishStart();fishUI()}
function fishTick(){if(PM!=='fish'||!FSH){clearInterval(FST);if(PM!=='fish')FSH=null;return}const F=FSH,dt=.03,now=performance.now();
  if(F.ph==='aim'&&F.hold){F.pw+=F.pd*dt*1.1;if(F.pw>1){F.pw=1;F.pd=-1}if(F.pw<0){F.pw=0;F.pd=1}}
  if(F.ph==='fly'){F.k+=dt/.6;if(F.k>=1){F.k=1;F.ph='wait';F.tw=now+(1500+Math.random()*2600)*(F.good?.7:1);F.msg='Il galleggiante dondola... aspetta che abbocchi.';tone(300,.06,'sine')}}
  if(F.ph==='wait'&&now>=F.tw){F.ph='bite';F.te=now+950;F.f=fishPick(F.good);F.msg='Abbocca!';tone(880,.1,'triangle')}
  if(F.ph==='bite'&&now>F.te){F.ph='end';F.msg='Troppo lento a ferrare: il pesce ha mangiato l\'esca ed è scappato.';tone(150,.2)}
  if(F.ph==='reel'){const f=F.f,rod=P.rod>=2;F.pt-=dt;if(F.pt<=0){F.pull=!F.pull;F.pt=F.pull?.5+Math.random()*(.6+f.d):.8+Math.random()*1.2}
    if(F.hold){F.dist-=dt*(F.pull?.05:.2+(1-f.d)*.1);F.ten+=dt*(F.pull?.9+f.d*.6:.16)*(rod?.75:1)}else{F.ten=Math.max(0,F.ten-dt*.45);F.dist=Math.min(1.2,F.dist+dt*(F.pull?.1+f.d*.08:.02))}
    F.esc-=dt;if(F.ten>=1){F.ph='end';F.msg='Il filo si è spezzato! '+f.n+' è scappato.';tone(120,.3,'sawtooth')}else if(F.dist<=0)fishCatch();else if(F.esc<=0||F.dist>=1.2){F.ph='end';F.msg=f.n+' si è liberato ed è scappato al largo.';tone(150,.2)}}
  fishUI()}
function fishCatch(){const F=FSH,f=F.f;F.ph='end';P.fish[f.id]=(P.fish[f.id]||0)+1;F.msg=f.id==='stivale'?'Hai tirato su... uno stivale vecchio.':'Preso! '+f.n+(f.p>=90?': una rarità!':'');
  jingle(f.p>=90?[72,76,79,84,88]:[67,72,76],.09,'triangle');if(cineOK())sparks(F.sx,F.sy,12,['#9adcff','#ffffff'],60);
  for(const q of P.q){const T=QT[q.id];if(T.t==='fish'&&(T.f==='any'?f.id!=='stivale':T.f===f.id)&&!qReady(q)){q.c++;msg(T.ti+': '+q.c+'/'+T.n);if(qReady(q))jingle([67,72])}}npcMarks();hud();save()}
function fishUI(){const F=FSH;if(!F)return;if(F.ph!==F.rph){F.rph=F.ph;pn('fish');return}const q=id=>$(id);
  if(F.ph==='aim'&&q('fpw'))q('fpw').style.left=(F.pw*100)+'%';
  if(F.ph==='reel'&&q('fdi')){q('fdi').style.width=Math.max(0,Math.min(100,F.dist/1.2*100))+'%';q('fte').style.width=Math.min(100,F.ten*100)+'%';q('fte').style.background=F.ten>.75?'#ff4a3a':F.pull?'#ffb04a':'#4ad66a';
    q('fst').textContent=F.pull?'Il pesce tira! Lascia andare il mulinello.':'È stanco: gira, gira, gira!';q('fes').textContent=Math.max(0,Math.ceil(F.esc))+'s'}}
function fishHTML(){const F=FSH;let h=`<h3>🎣 Pesca · ${P.rod>=2?'Canna di quercia':'Canna da pesca'}</h3><p>${esc(F.msg)}</p>`;
  if(F.ph==='aim')h+='<p class="mu">La zona dorata è il lancio perfetto: l\'amo va più lontano e abboccano pesci più rari.</p><div class="fbar"><i class="fz" style="left:62%;width:28%;background:#d4af37"></i><i id="fpw" class="fm" style="left:0%"></i></div><button id="fbt">🎣 Lancia (tieni premuto)</button>';
  else if(F.ph==='fly'||F.ph==='wait')h+='<p class="mu">Quando il galleggiante va giù, premi Ferra.</p><button onclick="fishStart()">↩ Ritira la lenza</button>';
  else if(F.ph==='bite')h+='<p style="font-size:34px;text-align:center;color:#ffd84a;margin:6px 0"><b>ABBOCCA!</b></p><button id="fbt">⚡ Ferra!</button>';
  else if(F.ph==='reel')h+=`<p id="fst">Gira il mulinello!</p><div class="mu">Distanza del pesce · scappa tra <b id="fes"></b></div><div class="fbar"><i id="fdi" class="fz" style="left:0;width:100%;background:#3a8ad8"></i></div><div class="mu">Tensione del filo</div><div class="fbar"><i id="fte" class="fz" style="left:0;width:0%"></i></div><button id="fbt">🔄 Gira (tieni premuto)</button><p class="mu">Tieni premuto Gira quando il pesce è stanco e lascia quando tira: se la tensione arriva in fondo, il filo si spezza.</p>`;
  else h+='<button id="fbt">🎣 Lancia di nuovo</button>';
  return h+`<p class="mu">${isNight()?'È notte: calamari e trote dorate salgono in superficie.':'Di notte abboccano anche calamari e trote dorate.'} Puoi usare anche la barra spaziatrice.<br>Pescato: ${fishList()||'niente'}</p><button onclick="cl()">Smetti di pescare</button>`}
function fishBind(){const b=$('fbt');if(!b)return;b.onpointerdown=e=>{e.preventDefault();fishKey(1)};b.onpointerup=b.onpointerleave=()=>fishKey(0)}
function fishDraw(){const F=FSH;if(!F||PM!=='fish'||F.ph==='aim')return;const dr=P.dr||[0,1],tx=P.px+dr[0]*.85,ty=P.py+dr[1]*.85,tz=34;let bx=F.bx,by=F.by,bz=-3+Math.sin(t*3)*1;
  if(F.ph==='fly'){const k=F.k;bx=tx+(F.bx-tx)*k;by=ty+(F.by-ty)*k;bz=tz+(-3-tz)*k+Math.sin(k*Math.PI)*40}
  if(F.ph==='bite')bz=-6+Math.sin(t*25)*2;if(F.ph==='reel'){const k=Math.max(.05,Math.min(1,F.dist));bx=tx+(F.bx-tx)*k;by=ty+(F.by-ty)*k;bz=-5+Math.sin(t*14)*1.5}
  g.strokeStyle='rgba(240,240,240,.85)';g.lineWidth=1;g.beginPath();g.moveTo(PX(tx,ty),PY(tx,ty,tz));g.lineTo(PX(bx,by),PY(bx,by,bz+4));g.stroke();
  box(bx-.06,by-.06,bz,.12,.12,5,'#e8483a');box(bx-.05,by-.05,bz+5,.1,.1,3,'#ffffff');if(F.ph==='reel'&&F.pull&&cineOK()&&Math.random()<.3)sparks(bx,by,2,['#cfe8ff'],30)}
/* ---- i nemici parano ---- */
function tryParry(e,d,rem){if(rem||e.k!=='en'||(e.b&&e.b.np)||!(t>=(e.prt||-1))||Math.random()>(e.boss?.12:.18))return d;e.prt=t+1.6;e.pry=t;flt(e,'Parata!','#d8e0ff');if(cineOK())sparks(e.px,e.py,8,['#ffffff','#c8d8ff'],50);tone(1300,.05,'square',.04);return Math.round(d*.2)}
/* ---- arti marziali del Maestro Dino ---- */
const SKL=[{id:'palmo',n:'Palmo del Drago',k:'1',lv:3,c:300,cd:6,ds:'UN\'ONDA D\'URTO DAVANTI A TE! COLPISCE TUTTI I NEMICI NEL CONO E LI SCARAVENTA LONTANO!'},
  {id:'calcio',n:'Calcio del Tornado',k:'2',lv:5,c:600,cd:8,ds:'GIRI SU TE STESSO COME UN TIFONE! COLPISCI TUTTI QUELLI INTORNO E PER UN ISTANTE NESSUNO TI TOCCA!'},
  {id:'ombra',n:'Passo dell\'Ombra',k:'3',lv:8,c:1200,cd:10,ds:'SPARISCI E RICOMPARI ALLE SPALLE DEL NEMICO! IL COLPO È SEMPRE CRITICO, SEMPRE!'},
  {id:'tigre',n:'Respiro della Tigre',k:'4',lv:10,c:2000,cd:25,ds:'RESPIRA COME LA TIGRE! RECUPERI UN TERZO DELLA VITA E PER OTTO SECONDI COLPISCI PIÙ FORTE!'}];
function useSkill(i){const s=SKL[i];if(!started||!s||!P||!P.skl||!P.skl[s.id]||P.hp<=0||Zk==='mare')return;P.skc=P.skc||{};
  if((P.skc[s.id]||0)>t){msg(s.n+': pronto tra '+Math.ceil(P.skc[s.id]-t)+'s');return}
  if(s.id==='palmo'){const[dx,dy]=P.dr||[0,1];for(const e of ents.slice())if(e.k==='en'){const ex=e.px-P.px,ey=e.py-P.py,d=Math.hypot(ex,ey);if(d<3.2&&d>0&&(ex*dx+ey*dy)/d>.45){const r=roll(2.2);hurtE(e,r.d,0,r.cr);if(ents.includes(e)&&!e.boss)mv(e,ex/d*1.5,ey/d*1.5)}}
    fxPalmo(dx,dy);tone(140,.25,'sawtooth',.08)}
  else if(s.id==='calcio'){for(const e of ents.slice())if(e.k==='en'&&dist(e,P)<2.3){const r=roll(1.6);hurtE(e,r.d,0,r.cr)}P.iv=Math.max(P.iv||0,.6);fxCalcio();whoosh()}
  else if(s.id==='ombra'){let tg=P.tg&&P.tg.k==='en'&&ents.includes(P.tg)?P.tg:null,bd=7;if(!tg)for(const e of ents)if(e.k==='en'){const d=dist(e,P);if(d<bd){bd=d;tg=e}}
    if(!tg){msg('Nessun nemico abbastanza vicino');return}const ox0=P.px,oy0=P.py,dx=tg.px-P.px,dy=tg.py-P.py,d=Math.hypot(dx,dy)||1,bx=tg.px+dx/d*.9,by=tg.py+dy/d*.9,ix=Math.floor(bx),iy=Math.floor(by);
    if(cineOK())sparks(P.px,P.py,12,['#3a3a4a','#c46bff'],60);if(ix>0&&iy>0&&ix<N-1&&iy<N-1&&WK(M[iy][ix])){P.px=bx;P.py=by;P.path=[]}const r=roll(2.5);hurtE(tg,Math.round(r.d*1.8),0,true);fxOmbra(ox0,oy0,tg);whoosh()}
  else if(s.id==='tigre'){const h=Math.round(P.mx*.3);P.hp=Math.min(P.mx,P.hp+h);P.bA=Math.max(P.bA,8);flt(P,'+'+h,'#66ff88');fxTigre();jingle([60,67,72],.1,'sawtooth')}
  P.skc[s.id]=t+s.cd;flt(P,s.n+'!','#ffb04a');P.sw=.25;P.swc++;hud()}
function learnSkill(i){const s=SKL[i];if(!s||P.skl[s.id])return;if(P.lv<s.lv){msg('Il Maestro urla: «TORNA AL LIVELLO '+s.lv+'!»');return}if(!pay(px('skl_'+s.id,s.c)))return;
  P.skl[s.id]=1;banner('Tecnica appresa: '+s.n,'Usala con il tasto '+s.k,'spade');jingle([60,64,67,72,76],.09,'square');const d=ents.find(e=>e.nid==='dino');if(d)voice(d);save();pn('npc')}
function masterHTML(){let h='<p class="qb"><b>«ASCOLTA BENE, ALLIEVO! LE TECNICHE SI USANO CON I TASTI 1, 2, 3 E 4! OGNUNA HA UN TEMPO DI RICARICA! E NON LAMENTARTI!»</b></p>';
  for(const[i,s]of SKL.entries()){const ok=P.skl[s.id];h+=`<div class="qb"><b>${s.k} · ${s.n}</b> <small class="mu">livello ${s.lv} · ricarica ${s.cd}s</small><br><small>«${s.ds}»</small><br>`+(ok?'<small>✔ Appresa</small>':`<button onclick="learnSkill(${i})"${P.lv<s.lv?' disabled':''}>${P.lv<s.lv?'Serve il livello '+s.lv:'IMPARA! · '+px('skl_'+s.id,s.c)+'💰'}</button>`)+'</div>'}return h}
function skBar(){if(!P||!P.skl)return;const L=SKL.filter(s=>P.skl[s.id]);let el=$('skbar');if(!L.length){if(el)el.remove();return}
  if(!el){const bar=$('bar');if(!bar)return;el=document.createElement('span');el.id='skbar';bar.appendChild(el)}P.skc=P.skc||{};
  if(!SET.oldbar&&SET.rw&&$('ruota'))wheelBuild();const html=L.map(s=>{const r=Math.max(0,Math.ceil((P.skc[s.id]||0)-t));return`<button onclick="useSkill(${SKL.indexOf(s)})" title="${s.n}">🥋<span> ${s.n.split(' ')[0]}${r?' '+r+'s':''}</span> <kbd>${s.k}</kbd></button>`}).join('');if(el.innerHTML!==html)el.innerHTML=html}
Object.assign(NPCS,{dino:{n:'Maestro Dino',c:'#c0392b',hat:'#1a1a1a',role:'master',ln:['AAAAH! GUARDA E IMPARA, ALLIEVO!','IL CORPO È LA SPADA! LA MENTE È LO SCUDO!!','UN TEMPO ERO UNA RECLUTA! ORA SONO UN MAESTRO!!!','UN VERO GUERRIERO NON CORRE! CAMMINA CON DIGNITÀ!!']}});

/* ---- battaglia navale: tempesta, barili di rum, palle incatenate, fulmini, stiva ---- */
SHK.sfida={l:9,w:2.6,m:[.3,.68],mh:50,h:'#5a3a22',h2:'#3a2414',dk:'#a07a4a',sl:'#f2ede0',fl:'#2a6aa8'};
function navFire(chain){const[me,en]=navShips();if(!me||!en)return;const V=NAV,mx=me.px,ecx=en.px-en.ex/2,tp=(ecx-mx)/26,err=Math.abs(V.pw-tp);let hit=chain||err<=.065,perf=chain||err<.018;
  const lx=mx+V.pw*26,ly=me.py-me.ey/2+(Math.random()-.5)*5;let b={x:mx,y:ly,x2:hit?ecx:lx,y2:en.py-en.ey/2+(Math.random()-.5)*5,k:0,T:.9,hit,perf,ch:chain};
  if(!chain&&V.br&&Math.abs(lx-V.br.x)<1.3){b={x:mx,y:ly,x2:V.br.x,y2:V.br.y,k:0,T:.8,bar:1}}
  V.balls.push(b);V.rl=1.05;V.pw=0;V.pd=1;V.shk=.15;tone(70,.25,'square',.08);P.sw=.2;if(cineOK())sparks(mx,me.py-me.ey/2,10,['#ffd04a','#888888'],60)}
function navChain(){const V=NAV;if(!V||V.ph!=='cannon'||V.chg<3||V.rl>0)return;V.chg=0;navFire(true);msg('Palla incatenata!')}
function navExtra(dt,me,en){const V=NAV;if(V.shk>0){V.shk-=dt;camX+=(Math.random()-.5)*12;camY+=(Math.random()-.5)*7}
  if(V.ph!=='cannon')return;V.lt=(V.lt==null?6:V.lt)-dt;if(V.lt<=0){V.lt=6+Math.random()*7;flash('#e8f0ff',.5,180);tone(55,.7,'sawtooth',.06);V.bolt={t:.25,x:Math.random()};
    if(Math.random()<.45){if(Math.random()<.5){V.hp-=4;flt(P,'Fulmine! -4 scafo','#cfe8ff')}else{V.ehp=Math.max(1,V.ehp-6);flt({px:en.px-1.5,py:en.py-6},'Fulmine! -6','#cfe8ff')}}}
  if(V.bolt&&(V.bolt.t-=dt)<=0)V.bolt=null;
  if(!V.br){V.bt=(V.bt==null?7:V.bt)-dt;if(V.bt<=0){const x0=me.px+4,x1=en.px-en.ex-4;V.br={x:x0+Math.random()*Math.max(1,x1-x0),y:me.py-me.ey/2+(Math.random()-.5)*8,t:14}}}
  else{V.br.t-=dt;V.br.y+=Math.sin(t)*dt*.4;if(V.br.t<=0){V.br=null;V.bt=9}}}
function navDraw(){const V=NAV;for(const b of V.balls){const k=b.k/b.T,x=b.x+(b.x2-b.x)*k,y=b.y+(b.y2-b.y)*k,z=Math.sin(k*Math.PI)*70+14;box(x-.1,y-.1,z,.2,.2,4,'#1a1a1a',1);if(b.ch){box(x-.1,y+.4,z,.2,.2,4,'#1a1a1a');box(x-.02,y,z+1,.04,.4,2,'#5a5a5a')}}
  if(V.br){const u=Math.sin(t*2)*1.5;box(V.br.x-.25,V.br.y-.25,-6+u,.5,.5,10,'#8a5a2a');box(V.br.x-.27,V.br.y-.27,-2+u,.54,.54,1.5,'#4a4a4a');box(V.br.x-.1,V.br.y-.1,4+u,.2,.2,1,'#d4af37')}
  g.save();g.setTransform(DPR,0,0,DPR,0,0);g.strokeStyle='rgba(200,215,235,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<110;i++){const x=(i*97+t*700)%W,y=(i*53+t*1100)%H;g.moveTo(x,y);g.lineTo(x-6,y+16)}g.stroke();
  for(let k=0;k<3;k++){const x=((t*(40+k*12)+k*420)%(W+200))-100,y=H*.12+k*38+Math.sin(t*1.6+k)*10,f=Math.sin(t*9+k)*6;g.strokeStyle='rgba(240,240,240,.8)';g.lineWidth=2;g.beginPath();g.moveTo(x-8,y-f);g.lineTo(x,y);g.lineTo(x+8,y-f);g.stroke()}
  if(V.bolt){const x=W*(.2+V.bolt.x*.6);g.strokeStyle='rgba(235,240,255,.95)';g.lineWidth=3;g.beginPath();g.moveTo(x,0);let yy=0,xx=x;while(yy<H*.55){yy+=30+Math.random()*30;xx+=(Math.random()-.5)*50;g.lineTo(xx,yy)}g.stroke()}g.restore()}
function navHatch(){ents.push(po(14,14,'stiva',{st:'down',n:'Botola · stiva'}));banner('Il ponte è vostro!','La botola è aperta: il Capitano Scarlatto si è rintanato nella stiva.','spade');tone(300,.3,'sawtooth',.05)}
const C100L=e=>e.o?[[-.32,-.22,0,.64,.44,9,'#6a3a1a'],[-.34,-.3,9,.68,.08,12,'#d4af37']]:[[-.32,-.22,0,.64,.44,9,'#8a5a2a'],[-.34,-.24,9,.68,.48,4,'#d4af37'],[-.06,.22,5,.12,.03,4,'#3a2a1a']];
const VASOL=()=>[[-.14,-.14,0,.28,.28,10,'#8a5a3a'],[-.1,-.1,10,.2,.2,3,'#7a4a2a'],[-.09,-.09,13,.18,.18,1.5,'#3a2a1a'],[-.02,-.02,14.5,.04,.04,3,'#4a8a3a']];
function genArr({F,EN,n}){for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}
  for(let y=3;y<=26;y++)for(let x=8;x<=21;x++){M[y][x]=(x===8||x===21||y===3||y===26)?1:0}
  for(const y of[8,19]){F(14,y,'I');F(15,y,'I')}for(const y of[6,10,13,17,21,24]){F(9,y,'J');F(20,y,'J')}
  for(const[x,y,c]of[[10,4,'b'],[11,4,'b'],[18,4,'k'],[19,4,'k'],[13,8,'@'],[16,19,'@'],[10,25,'k'],[11,25,'b'],[19,25,'b'],[14,25,'Ω'],[15,9,'ł'],[14,18,'ł'],[20,4,'¶'],[9,25,'¶'],[10,12,'k'],[19,15,'b']])F(x,y,c);
  for(const[x,y]of[[5,6],[24,10],[4,20],[25,22],[6,14]])DEC[y][x]='^';for(const[x,y]of[[3,12],[26,16]])DEC[y][x]='O';
  for(const[x,y]of[[11,7],[18,7],[12,11],[17,11],[11,16],[18,16],[13,22],[16,22]])EN('pirata',x,y);for(const[x,y]of[[10,14],[19,20],[15,23]])EN('pirata_pistola',x,y);
  return[14,5]}
function genStiva({F,EN,n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)M[y][x]=0;
  for(const[x,y,c]of[[1,1,'k'],[2,1,'k'],[1,2,'k'],[n-2,1,'b'],[n-3,1,'b'],[n-2,2,'k'],[1,n-2,'b'],[2,n-2,'k'],[n-2,n-2,'k'],[n-3,n-2,'b'],
    [4,1,'B'],[6,1,'B'],[8,1,'B'],[15,1,'B'],[17,1,'B'],[1,6,'J'],[1,10,'J'],[1,14,'J'],[n-2,6,'J'],[n-2,10,'J'],[n-2,14,'J'],[6,6,'ł'],[17,6,'ł'],[6,16,'ł'],[17,16,'ł'],
    [10,19,'Ø'],[11,20,'Ø'],[13,20,'Ø'],[14,19,'Ø'],[11,11,'I'],[12,11,'I'],[3,9,'!'],[n-4,9,'!'],[4,15,'k'],[19,15,'k'],[5,20,'b'],[18,20,'b']])F(x,y,c);
  for(const[x,y]of[[8,8],[15,8],[9,14],[14,14]])EN('pirata',x,y);EN('scarlatto',12,18);ents.push({k:'vaso',n:'Un vaso di terra',px:2.5,py:20.5});
  ents.push(po(12,2,'arrembaggio',{st:'up',n:'Scala · ponte'}));return[12,4]}
Object.assign(Z,{stiva:{n:'La Vedova Nera · stiva',lv:5,N:24,a:'#5a3a22',b:'#52341e',bg:'#0a0604',mus:'boarding',gen:genStiva,dist:1,wl:'#3a2414',wh:34,nolamp:1,rd:['#5a3a22','#52341e']}});
Z.arrembaggio.nolamp=1;
function navWin(){const go=()=>{started=1;document.body.classList.add('ig');last=performance.now();const lv=Z.stiva.lv,gd=Math.round((300+lv*60)*(NET.cfg.gm||1)),xp=200+lv*40;
    P.g+=gd;gainXP(xp);P.navw=(P.navw||0)+1;const it=item(lv+3,3,'w');it.n='Sciabola di Scarlatto';ents.push({k:'dr',px:12.5,py:16.5,it},{k:'c100',n:'Cassa del bottino',px:10.5,py:17.5},{k:'c100',n:'Cassa del bottino',px:14.5,py:17.5});
    banner('Vittoria sul mare!','+'+gd+' oro, +'+xp+' XP · aprite le due casse del bottino!','corona');goldFly(gd);jingle([72,76,79,84,88,91],.1,'triangle');if(cineOK())coinRain(30);
    ents.push(po(12,3,'porto',{st:'gate',n:'Torna al Porto'}));music('town');save()};
  if(Zk!=='stiva'){go();return}started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';playCine(TREASC,'boarding',go)}
const STORMC=[{d:5,tx:'La Sfida lasciò il porto con il mare calmo e il vento a favore.',f:'calm'},{d:6,tx:'Poi il cielo diventò nero. Una tempesta mai vista si abbatté sulle onde.',f:'storm'},
  {d:5.5,tx:'Le onde ci trascinarono dritti contro la Vedova Nera del Capitano Scarlatto!',f:'clash'},{d:3.5,tx:'Ai cannoni!',f:'clash2'}];
const BOARDC=[{d:5,tx:'La Vedova Nera sbanda. Rampini, cime, sciabole tra i denti: all\'arrembaggio!',f:'board'}];
const TREASC=[{d:5,tx:'Il Capitano Scarlatto è a terra. Nella stiva brilla il bottino di cento saccheggi.',f:'treasure'}];
function cineSea(lt,f){const sc=Math.min(W,H)/560,rough=f==='calm'?1:f==='board'?3:6;introSc(sc,0,0);
  for(let i=-10;i<=10;i++)for(let j=-10;j<=10;j++){const h2=rough*Math.sin(lt*2.2+i*.8+j*.6);box(i,j,-10+h2,1,1,6,(i+j)&1?'#1f4a6a':'#1a4060',f==='calm'?1:.7)}
  const tilt=f==='calm'?0:Math.sin(lt*1.7)*2,me=mkShip('sfida',-5,-3,'y'),en=mkShip('pirata',3,-5,'y');
  if(f==='storm'){me.px+=Math.sin(lt)*.6;en.px-=Math.sin(lt*1.3)*.6}if(f==='clash'){const k=Math.min(1,lt/4.5);me.px+=k*4.6;me.py+=k*.6}if(f==='clash2'||f==='board'){me.px+=4.6;me.py+=.6}
  drawL(shipL(me),me.px,me.py,tilt,false);drawL(shipL(en),en.px,en.py,-tilt,false);
  if(f==='clash'&&lt>4.4&&lt<5.2&&cineOK()){for(let i=0;i<14;i++){const a=i*.45,r=(lt-4.4)*5;box(.2+Math.cos(a)*r,-2+Math.sin(a)*r,20+r*12,.15,.15,3,'#8a5a2a')}}
  if(f==='board'){const k=(lt%2.5)/2.5,hx=-1+k*3,hy=-2.4,hz=12+Math.sin(k*Math.PI)*36;drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),hx,hy,hz,0,1);for(let r=0;r<4;r++){g.strokeStyle='#c8b890';g.lineWidth=1.5;g.beginPath();g.moveTo(PX(-1+r*.3,-3+r),PY(-1+r*.3,-3+r,52));g.lineTo(PX(3.2,-3+r*.8),PY(3.2,-3+r*.8,40));g.stroke()}}
  g.setTransform(DPR,0,0,DPR,0,0);if(f!=='calm'){g.fillStyle='rgba(10,15,30,.35)';g.fillRect(0,0,W,H);g.strokeStyle='rgba(200,215,235,.4)';g.lineWidth=1;g.beginPath();for(let i=0;i<160;i++){const x=(i*97+lt*900)%W,y=(i*53+lt*1300)%H;g.moveTo(x,y);g.lineTo(x-8,y+20)}g.stroke();
    if(Math.sin(lt*3.1)>.93||(f==='clash'&&lt>4.4&&lt<4.7)){g.fillStyle='rgba(235,240,255,.5)';g.fillRect(0,0,W,H)}}
  if(f==='clash2'){g.textAlign='center';g.font=`bold ${Math.round(Math.min(W,H)/9)}px Georgia,serif`;g.lineWidth=6;g.strokeStyle='#1a0a0a';g.strokeText('AI CANNONI!',W/2,H*.32);g.fillStyle='#ffd84a';g.fillText('AI CANNONI!',W/2,H*.32)}}
function cineTreasure(lt){const sc=Math.min(W,H)/360;introSc(sc,0,0);for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++)box(i,j,-6,1,1,6,(i+j)&1?'#5a3a22':'#52341e');
  for(const[x,y]of[[-1.5,0],[1.5,0]])drawL(C100L({o:lt>1.5}),x,y,0,false);for(let i=0;i<9;i++)box(-.6+(i%3)*.4,-1.4+Math.floor(i/3)*.3,0,.3,.3,4+(i%4)*2,'#d4af37',1.2);
  if(lt>1.5&&cineOK())for(let i=0;i<24;i++){const a=i*.9+lt*2,r=((lt-1.5)*1.4+i*.05)%2;box(Math.cos(a)*r*.6-1.5+(i%2)*3,Math.sin(a)*r*.6,10+r*20,.08,.08,2,'#fff2a0',1.4)}
  g.setTransform(DPR,0,0,DPR,0,0);const gr=g.createRadialGradient(W/2,H/2,H*.1,W/2,H/2,Math.max(W,H)*.6);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.85)');g.fillStyle=gr;g.fillRect(0,0,W,H)}
function navUI(on){let el=$('navui');if(!on){if(el)el.remove();return}if(!el){el=document.createElement('div');el.id='navui';document.body.appendChild(el)}
  el.innerHTML='<b>⚓ Battaglia navale nella tempesta</b><div>Il tuo scafo</div><div class="bar"><i id="nvh" style="background:#4ad66a"></i></div><div>La Vedova Nera</div><div class="bar"><i id="nve" style="background:#e04a3a"></i></div><div class="pm"><i id="nvz" class="pz"></i><i id="nvb" class="pz" style="background:#d4af3799;display:none"></i><i id="nvk" class="pk"></i></div><div id="nvs" class="mu">Tieni premuto Fuoco (o Spazio) e rilascia con il segno nella zona verde.</div><button id="nvf">💥 Fuoco</button><button onclick="navEvade()">⛵ Manovra (Shift)</button><button id="nvc" onclick="navChain()">⛓ Palla incatenata 0/3</button>';
  const f=$('nvf');f.onpointerdown=e=>{e.preventDefault();navHold(1)};f.onpointerup=f.onpointerleave=()=>navHold(0)}
function navUIupd(me,en){const h=$('nvh');if(!h||!NAV)return;const V=NAV;h.style.width=Math.max(0,V.hp)+'%';$('nve').style.width=Math.max(0,V.ehp)+'%';const tp=(en.px-en.ex/2-me.px)/26;
  $('nvz').style.left=((tp-.065)*100)+'%';$('nvz').style.width='13%';$('nvk').style.left=(V.pw*100)+'%';const bb=$('nvb');
  if(V.br){const bp=(V.br.x-me.px)/26;bb.style.display='block';bb.style.left=((bp-.05)*100)+'%';bb.style.width='10%'}else bb.style.display='none';
  const c=$('nvc');c.textContent='⛓ Palla incatenata '+Math.min(3,V.chg||0)+'/3';c.disabled=(V.chg||0)<3;
  $('nvs').textContent=V.ph==='sink'?'La Vedova Nera sta affondando...':V.inc?'⚠ Bordata in arrivo: Manovra!':V.rl>0?'Ricarica dei cannoni...':V.hold?'Rilascia nella zona verde (o in quella dorata per colpire il barile di rum)!':V.br?'Un barile di rum galleggia tra le navi: colpiscilo (zona dorata) per riparare lo scafo.':'Pronto al fuoco'}
addEventListener('keyup',e=>{if(e.key===' '&&FSH&&PM==='fish')fishKey(0)});
document.addEventListener('pointerdown',e=>{if(e.target&&e.target.closest&&e.target.closest('#fbt')){e.preventDefault();fishKey(1)}});
document.addEventListener('pointerup',()=>{if(FSH)fishKey(0)});

/* ================= 6.5: mappa e guida di Aldoria, animazioni, sonno e mondo dei sogni, ruota delle azioni, lingue ================= */
if(SET.lang==null)SET.lang='it';if(SET.rk==null)SET.rk='v';if(SET.rw==null)SET.rw=1;if(SET.oldbar==null)SET.oldbar=0;
/* ---- animazioni dell'eroe: respiro da fermo, fendente quando attacca ---- */
function heroAnim(L,e,mov){const sw=e===P?P.sw:(e.sw||0);
  if(sw>0){const k=Math.min(1,Math.max(0,1-sw/.25)),up=k<.45?k/.45:Math.max(0,1-(k-.45)/.55);return L.map(q=>q[0]+q[3]/2>.18&&q[2]>7?[q[0],q[1]+k*.22,q[2]+up*8-(k>.6?2:0),q[3],q[4],q[5],q[6]]:q)}
  if(!mov){const b=Math.sin(t*2.2+e.px)*.6;return L.map(q=>q[2]>=8.5?[q[0],q[1],q[2]+b,q[3],q[4],q[5],q[6]]:q)}return L}
function walkLegs(L,ph){const s=Math.sin(ph),a=Math.max(0,s)*2.6,b=Math.max(0,-s)*2.6;return L.map(q=>{if(q[2]<.5&&q[5]>3){const lift=q[0]+q[3]/2<0?a:b;return[q[0],q[1],q[2]+lift,q[3],q[4],Math.max(1,q[5]-lift),q[6]]}return q})}
/* ---- mappa di Aldoria e guida turistica ---- */
let TOWNMAP=null;
const ZB=[
  {k:'town',ic:'🏰',how:'Il cuore del regno: qui comincia ogni avventura.',tx:'Una città fortificata, con mura, torri e quattro porte principali. Al centro, la piazza con la fontana; a nord-ovest, il castello del Re Aldric.',
    f:['Castello del Re Aldric: le missioni principali','Biblioteca Arcana: il Saggio, che conosce le lingue antiche','Mercante Ugo: merce del giorno e zaini','Fucina di Borin: forgia e set in vetrina','Bottega dell\'Erborista Mira: pozioni ed elisir','Caserma: il Maestro Dino e le arti marziali','Taverna e Tempio della Luce','Colosseo: arena PvP e classifica (nord-est)','Casinò Fortuna d\'Oro','Motel della Rosa dei Venti: stanza, baule e sonno','Cimitero e Cripta Dimenticata (sud-ovest)']},
  {k:'nord',ic:'🎩',how:'Porta nord-ovest delle mura.',tx:'Il quartiere dei nobili: viali alberati, giardini all\'italiana e ville eleganti.',f:['Palazzo del Conte Valerio','Banca di Aldoria e il notaio Severino','Teatro dell\'Opera','Sei ville con i loro padroni','Il Roseto: rose da raccogliere']},
  {k:'campi',ic:'🌾',how:'Porta est, in alto.',tx:'Campi di grano, il mulino a vento e il bosco dei taglialegna.',f:['Mulino di Pietro e Fienile','Segheria di Ettore','Fattoria di Giacomo: compra i raccolti','Pascoli con mucche, pecore e maiali','Frutteto, vigne e orti: grano, legna, mele e uova']},
  {k:'porto',ic:'⚓',how:'Porta sud, lungo il molo.',tx:'Moli di legno, navi ormeggiate, gabbiani e il faro sull\'isolotto.',f:['Pesca dai galleggianti rossi (canna dal Pescatore Gino)','Pescivendole Nella e Ida','Locanda del Gabbiano e Capitaneria','Ammiraglio Corvo: la battaglia navale','Pozzo delle alghe: discesa all\'Abisso Sommerso','Faro, Cantiere Navale, Pescheria e la Rondine']},
  {k:'rovine',ic:'🏚',how:'Porta ovest, in basso. Il cancello si apre con la missione del Moreau.',tx:'Il quartiere bruciato dall\'incendio di tanti anni fa, abbandonato a spettri e banditi.',f:['La cappella in rovina di Fratel Tobia','Il cimitero e la villa di Lord Vexmoor','Cimeli antichi tra le macerie','Vecchia Ada e l\'Ultima Sentinella']},
  {k:'forest',ic:'🌲',how:'La grande porta nord.',tx:'La Foresta di Elmwood: alberi fitti, laghetti ed Erba Lunare.',f:['Erba Lunare da raccogliere','L\'ingresso di un dungeon (vedi la sezione dei dungeon)']},
  {k:'desert',ic:'🏜',how:'Porta est.',tx:'Il Deserto di Khem: dune, cactus e rovine sepolte dalla sabbia.',f:['Scarabei dorati da raccogliere','L\'ingresso di un dungeon (vedi la sezione dei dungeon)']},
  {k:'peaks',ic:'🏔',how:'Porta ovest.',tx:'I Picchi Gelidi: neve, ghiaccio e vento che taglia.',f:['Sentieri innevati e grotte','L\'ingresso di un dungeon (vedi la sezione dei dungeon)']}];
const MNODE={nord:[-.78,-.82],forest:[0,-1.05],campi:[1.02,-.55],desert:[1.08,.02],porto:[.42,1.05],rovine:[-1.05,.5],peaks:[-1.08,-.05]};
function zoneCreatures(k){const z=Z[k];if(!z)return'';const L=[...new Set((z.en||[]).filter(e=>E[e]).map(e=>E[e].n))];const b=z.boss&&E[z.boss]?E[z.boss].n:'';return(L.length?L.join(', '):'')+(b?(L.length?' · ':'')+'boss: '+b:'')}
function brochureHTML(){let h='<div class="bro"><div class="bcov"><b>Benvenuti ad Aldoria</b><span>Guida ufficiale del Regno · con mappa, quartieri, creature e dungeon</span></div>';
  for(const z of ZB){const Zz=Z[z.k]||{},cr=zoneCreatures(z.k);h+=`<div class="bcard" id="zb_${z.k}"><h4>${z.ic} ${esc(z.nm||Zz.n||z.k)}</h4><p class="mu">Come arrivare: ${z.how}${Zz.lv?' · livello consigliato: '+Zz.lv+'+':''}</p><p>${z.tx}</p><p><b>Cosa trovi</b></p><ul>${z.f.map(x=>`<li>${x}</li>`).join('')}</ul>${cr?`<p class="mu"><b>Creature:</b> ${esc(cr)}</p>`:''}</div>`}
  h+='<div class="bcard" id="zb_dun"><h4>⚔ I sette dungeon</h4><p>Ogni dungeon custodisce un frammento della Corona (la Cittadella è la dimora di Malakar). Rinascono più forti a ogni ciclo.</p><p class="mu">Attenti ai <b>Campioni</b>, più grossi e con un alone dorato ai piedi: sono molto più forti degli altri, ma lasciano sempre un buon bottino, e a ogni ciclo se ne incontrano di più. E i nemici non sono mai soli: chi vi vede chiama quelli che gli stanno vicino.</p><ul>';
  for(const id in DG){const d=DG[id];h+=`<li><b>${esc(d.n)}</b> · livello ${d.lv}+ · ${d.fls} piani · boss: ${E[d.boss]?esc(E[d.boss].n):'?'}<br><span class="mu">Dove: ${esc(DGH[id]||'')}</span></li>`}
  return h+'</ul></div><p class="mu" style="text-align:center">Stampato dalla Tipografia Reale di Aldoria · distribuito gratis alle porte della città</p></div>'}
/* ---- 6.10: mappa rinnovata. Si ingrandisce (rotellina, +/−, pizzico, doppio clic), si trascina,
   ha il tema scuro e disegna la città da un'immagine preparata una volta sola ---- */
const MV={k:0,k0:1,x:0,y:0,w:0,h:0,dp:1,dirty:1,raf:0,hover:null,ptr:new Map(),drag:null,pinch:null,guide:1,fit:1};
let MAPHIT=[],MAPBM=null,MAPLAB=[];
const mapDark=()=>{const t=SET.mapt|0;return t===1||(t===0&&!matchMedia('(prefers-color-scheme: light)').matches)};
// colori della carta: chiara (pergamena) e scura (carta notturna)
const MPAL={light:{bg:'#e9dcb8',spot:'120,90,50',frame:'#8a6a3a',grass:'#9ab878',grass2:'#93b272',wall:'#7b7f89',water:'#5a90c8',road:'#cdbd9c',tree:'#4a7a3a',dec:'#a8987a',line:'#9a7a4a',txt:'#2a1a0a',txtS:'rgba(255,250,235,.92)',node:'#f6ecd2',nodeB:'#8a6a3a',here:'#f5d27a',hereB:'#c0392b',sub:'#6a5a3a',edge:'#5a4a3a',me:'#e8303a',hl:'#ffd84a',roof:1},
  dark:{bg:'#1a2030',spot:'150,170,220',frame:'#a8864a',grass:'#3f5a3a',grass2:'#3a5436',wall:'#5a5f6c',water:'#2c5a8e',road:'#7a705c',tree:'#24442a',dec:'#5e5646',line:'#a8864a',txt:'#f2e8cc',txtS:'rgba(10,14,24,.92)',node:'#262d42',nodeB:'#8a6e3e',here:'#5a4320',hereB:'#f5b942',sub:'#b8ac8c',edge:'#a8864a',me:'#ff5a5a',hl:'#ffd84a',roof:.72}};
const mpal=()=>MPAL[mapDark()?'dark':'light'];
const shade=(c,f)=>{if(f===1)return c;const n=parseInt(c.slice(1).length===3?c.slice(1).replace(/./g,'$&$&'):c.slice(1),16);return`rgb(${(n>>16)*f|0},${(n>>8&255)*f|0},${(n&255)*f|0})`};
// immagine della città: 6 pixel per casella, rifatta solo se cambia la città o il tema
function mapBitmap(){const T=TOWNMAP;if(!T)return null;const key=T.N+(mapDark()?'d':'l');if(MAPBM&&MAPBM.T===T&&MAPBM.key===key)return MAPBM.c;
  const p=mpal(),u=6,c=document.createElement('canvas');c.width=c.height=T.N*u;const q=c.getContext('2d');
  for(let y=0;y<T.N;y++)for(let x=0;x<T.N;x++){const t=T.M[y][x],d=T.DEC[y][x],X=x*u,Y=y*u;let col=(x+y)&1?p.grass:p.grass2;
    if(t===1)col=p.wall;else if(t===2)col=p.water;else if(t===4)col=p.road;else if(t===3){const b=T.TB[T.BM[y][x]];col=shade(b&&b.roof||b&&b.wall||'#a8402f',p.roof)}
    q.fillStyle=col;q.fillRect(X,Y,u,u);
    if(t===6){q.fillStyle=(x+y)&1?p.grass:p.grass2;q.fillRect(X,Y,u,u);if(d==='r'||d==='h'||d==='a'||d==='j'){q.fillStyle=p.tree;q.beginPath();q.arc(X+u/2,Y+u/2,u*.42,0,6.3);q.fill()}else{q.fillStyle=p.dec;q.fillRect(X+1,Y+1,u-2,u-2)}}
    if(t===2&&(x*7+y*3)%5===0){q.fillStyle='rgba(255,255,255,.18)';q.fillRect(X+1,Y+2,u-2,1)}}
  // contorno degli edifici, per distinguerli tra loro
  q.strokeStyle=mapDark()?'rgba(0,0,0,.55)':'rgba(40,20,10,.45)';q.lineWidth=1;for(const b of T.TB)q.strokeRect(b.x*u+.5,b.y*u+.5,b.w*u-1,b.h*u-1);
  MAPBM={T,key,c};return c}
const w2s=(wx,wy)=>[MV.w/2+(wx-MV.x)*MV.k,MV.h/2+(wy-MV.y)*MV.k];
const s2w=(sx,sy)=>[MV.x+(sx-MV.w/2)/MV.k,MV.y+(sy-MV.h/2)/MV.k];
const mapK0=()=>{const m=Math.min(MV.w,MV.h);return m*(m<520?.34:.4)};
// edificio della città che contiene la zona in cui sei (anche le stanze interne: castello, taverna, motel…)
const MAPSUB={cas_:'in_castle',lib_:'in_library',tav_:'in_tavern',tem_:'in_temple',mun_:'in_municipio',bar_:'in_caserma',casino_:'in_casino',oss_:'in_osservatorio',in_stanza:'in_motel',in_motel2:'in_motel'};
function mapBld(k){const T=TOWNMAP;if(!T||!k)return null;for(let i=0;i<6&&k;i++){const b=T.TB.find(b=>b.to===k);if(b)return b;const pf=Object.keys(MAPSUB).find(p=>k.startsWith(p));k=pf?MAPSUB[pf]:Z[k]&&Z[k].out}return null}
function mapFit(){MV.k0=mapK0();MV.k=MV.k0;MV.x=0;MV.y=.04;MV.fit=1;mapDirty()}
function mapZoom(f,sx,sy){if(sx==null){sx=MV.w/2;sy=MV.h/2}const[wx,wy]=s2w(sx,sy),nk=clamp(MV.k*f,MV.k0*.7,MV.k0*14);if(nk===MV.k)return;MV.k=nk;
  MV.x=wx-(sx-MV.w/2)/MV.k;MV.y=wy-(sy-MV.h/2)/MV.k;MV.fit=0;mapClampView();mapDirty()}
function mapClampView(){MV.x=clamp(MV.x,-1.45,1.45);MV.y=clamp(MV.y,-1.45,1.45)}
function mapMe(){let tx=0,ty=0,z=2.6;
  if(Zk==='town'&&P&&TOWNMAP){tx=-.5+P.px/TOWNMAP.N;ty=-.5+P.py/TOWNMAP.N;z=6}
  else{const b=mapBld(Zk);if(b){tx=-.5+(b.x+b.w/2)/TOWNMAP.N;ty=-.5+(b.y+b.h/2)/TOWNMAP.N;z=6}else{const k=MNODE[Zk]?Zk:Object.keys(MNODE).find(n=>Zk&&Zk.startsWith(n));if(k){tx=MNODE[k][0]*.95;ty=MNODE[k][1]*.95;z=1.8}}}
  MV.k=MV.k0*z;MV.x=tx;MV.y=ty;MV.fit=0;mapClampView();mapDirty()}
function mapDirty(){MV.dirty=1}
function mapUI(){const e=$('mzoom');if(e)e.textContent=Math.round(MV.k/MV.k0*100)+'%'}
function openMap(){if(!started)return;winOnly('map');let el=$('mappa');if(!el){el=document.createElement('div');el.id='mappa';document.body.appendChild(el)}
  const tl=['Tema automatico','Tema scuro','Tema chiaro'][SET.mapt|0];
  el.className=(mapDark()?'mdark':'')+(MV.guide?'':' nog');
  el.innerHTML=`<div class="mbox" role="dialog" aria-label="Mappa di Aldoria"><div class="mhd"><b>${ico('mappa',24)} Mappa di Aldoria</b>
  <div class="mtools"><button onclick="mapZoom(1/1.4)" title="Rimpicciolisci (−)" aria-label="Rimpicciolisci">−</button><span id="mzoom" class="mz">100%</span><button onclick="mapZoom(1.4)" title="Ingrandisci (+)" aria-label="Ingrandisci">+</button>
  <button onclick="mapFit();mapUI()" title="Mostra tutta la mappa (0)">⤢ Tutta</button><button onclick="mapMe()" title="Centra la mappa su dove sei">◎ Dove sono</button>
  <button onclick="mapTheme()" title="${tl}">${mapDark()?'☾':'☀'} Tema</button><button onclick="mapGuide()" class="${MV.guide?'on':''}" title="Mostra o nascondi la guida">📖 Guida</button>
  <button class="mx" onclick="closeMap()" title="Chiudi (M o Esc)" aria-label="Chiudi">✕</button></div></div>
  <div class="mbody"><div class="mcw"><canvas id="mapcv"></canvas><div id="mtip" class="mtip"></div><div class="mhint">Rotellina o +/− per ingrandire · trascina per spostarti · clicca una zona per la guida</div></div><div class="mbro">${brochureHTML()}</div></div></div>`;
  el.style.display='flex';const cv2=$('mapcv');mapBind(cv2);
  if(!MV.ro){MV.ro=new ResizeObserver(()=>{const c=$('mapcv');if(c&&$('mappa').style.display==='flex')mapSize(c)});}MV.ro.disconnect();MV.ro.observe(cv2.parentNode);
  mapSize(cv2,1);if(!MV.raf)MV.raf=requestAnimationFrame(mapLoop);tone(500,.06,'triangle')}
function closeMap(){const el=$('mappa');if(el)el.style.display='none';cancelAnimationFrame(MV.raf);MV.raf=0;if(MV.ro)MV.ro.disconnect()}
function mapTheme(){SET.mapt=((SET.mapt|0)+1)%3;LS.set('voxelia_set',SET);const g=MV.guide;openMap();MV.guide=g;msg(['Mappa: tema automatico (come il gioco)','Mappa: tema scuro','Mappa: tema chiaro'][SET.mapt])}
function mapGuide(){MV.guide=MV.guide?0:1;const el=$('mappa');el.classList.toggle('nog',!MV.guide);const b=el.querySelector('.mtools button[title^="Mostra o nascondi"]');if(b)b.classList.toggle('on',!!MV.guide)}
function mapSize(cv2,first){const r=cv2.parentNode.getBoundingClientRect(),dp=Math.min(2,window.devicePixelRatio||1);const w=Math.max(200,r.width),h=Math.max(200,r.height);
  const ow=MV.w,oh=MV.h;MV.w=w;MV.h=h;MV.dp=dp;cv2.width=Math.round(w*dp);cv2.height=Math.round(h*dp);cv2.style.width=w+'px';cv2.style.height=h+'px';
  if(first||MV.fit||!ow)mapFit();else{const ok=MV.k/MV.k0;MV.k0=mapK0();MV.k=MV.k0*ok}mapDirty()}
function mapLoop(){MV.raf=requestAnimationFrame(mapLoop);const here=Zk==='town'||!!mapBld(Zk);
  // il segnalino del giocatore pulsa: si ridisegna circa 12 volte al secondo, altrimenti solo quando qualcosa cambia
  const n=performance.now();if(here&&n-(MV.lp||0)>80){MV.lp=n;MV.dirty=1}if(MV.dirty){MV.dirty=0;mapDraw();mapUI()}}
function mapBind(cv2){const pos=e=>{const r=cv2.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  cv2.onwheel=e=>{e.preventDefault();const[x,y]=pos(e);mapZoom(Math.pow(1.0015,-e.deltaY*(e.deltaMode===1?33:1)),x,y)};
  cv2.ondblclick=e=>{const[x,y]=pos(e);mapZoom(1.8,x,y)};
  cv2.onpointerdown=e=>{cv2.setPointerCapture(e.pointerId);const p=pos(e);MV.ptr.set(e.pointerId,p);
    if(MV.ptr.size===2){const[a,b]=[...MV.ptr.values()];MV.pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),k:MV.k};MV.drag=null}else MV.drag={sx:p[0],sy:p[1],x:MV.x,y:MV.y,mv:0}};
  cv2.onpointermove=e=>{const p=pos(e);if(MV.ptr.has(e.pointerId))MV.ptr.set(e.pointerId,p);
    if(MV.pinch&&MV.ptr.size===2){const[a,b]=[...MV.ptr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);mapZoom(MV.pinch.k*d/MV.pinch.d/MV.k,(a[0]+b[0])/2,(a[1]+b[1])/2);return}
    if(MV.drag){const dx=p[0]-MV.drag.sx,dy=p[1]-MV.drag.sy;if(Math.hypot(dx,dy)>4)MV.drag.mv=1;if(MV.drag.mv){MV.x=MV.drag.x-dx/MV.k;MV.y=MV.drag.y-dy/MV.k;MV.fit=0;mapClampView();mapDirty();cv2.style.cursor='grabbing'}return}
    mapHover(p[0],p[1])};
  const up=e=>{const p=pos(e);MV.ptr.delete(e.pointerId);if(MV.ptr.size<2)MV.pinch=null;const d=MV.drag;MV.drag=null;cv2.style.cursor='';if(d&&!d.mv&&e.type==='pointerup')mapClick(p[0],p[1])};
  cv2.onpointerup=up;cv2.onpointercancel=up;cv2.onpointerleave=()=>{if(!MV.drag){MV.hover=null;$('mtip').style.display='none';mapDirty()}}}
// cosa c'è sotto il puntatore: un quartiere o un edificio della città
function mapPick(x,y){for(const n of MAPHIT)if(n.k!=='town'&&Math.abs(x-n.x)<n.w/2&&Math.abs(y-n.y)<n.h/2)return{k:n.k};
  const T=TOWNMAP;if(!T)return null;const[wx,wy]=s2w(x,y),tx=Math.floor((wx+.5)*T.N),ty=Math.floor((wy+.5)*T.N);if(tx<0||ty<0||tx>=T.N||ty>=T.N)return null;
  const bi=T.BM[ty][tx];if(bi>=0){const b=T.TB[bi];if(b&&b.to&&Z[b.to])return{k:'town',b}}return{k:'town'}}
function mapHover(x,y){const h=mapPick(x,y),tip=$('mtip'),cv2=$('mapcv');const key=h?(h.b?'b'+h.b.to:h.k):'';if(key!==MV.hk){MV.hk=key;MV.hover=h;mapDirty()}
  cv2.style.cursor=h&&(h.b||h.k!=='town')?'pointer':'grab';
  if(h&&h.b){tip.textContent=String(Z[h.b.to].n);tip.style.display='block';tip.style.left=(x+14)+'px';tip.style.top=(y+10)+'px'}else tip.style.display='none'}
function mapClick(x,y){const h=mapPick(x,y);if(!h)return;const c=$('zb_'+h.k);if(!MV.guide)mapGuide();if(c){c.scrollIntoView({behavior:'smooth',block:'start'});c.classList.remove('hl');void c.offsetWidth;c.classList.add('hl')}tone(620,.04,'triangle')}
function mapDraw(){const cv2=$('mapcv');if(!cv2)return;const q=cv2.getContext('2d'),dp=MV.dp,w=MV.w,h=MV.h,p=mpal(),k=MV.k;MAPHIT=[];
  q.setTransform(dp,0,0,dp,0,0);q.fillStyle=p.bg;q.fillRect(0,0,w,h);
  // macchie della carta, fisse rispetto alla mappa
  for(let i=0;i<26;i++){const[sx,sy]=w2s(((i*137)%280)/100-1.4,((i*91)%280)/100-1.4);q.fillStyle=`rgba(${p.spot},${.03+.025*(i%3)})`;q.beginPath();q.arc(sx,sy,(.06+(i%5)*.03)*k,0,6.3);q.fill()}
  // sentieri verso i quartieri
  q.strokeStyle=p.line;q.setLineDash([6,5]);q.lineWidth=Math.max(1.5,k*.008);for(const n in MNODE){const m=MNODE[n],[ax,ay]=w2s(m[0]*.48,m[1]*.48),[bx,by]=w2s(m[0]*.95,m[1]*.95);q.beginPath();q.moveTo(ax,ay);q.lineTo(bx,by);q.stroke()}q.setLineDash([]);
  // la città
  const T=TOWNMAP,[x0,y0]=w2s(-.5,-.5),S=k,bm=mapBitmap();
  if(bm){q.imageSmoothingEnabled=false;q.drawImage(bm,x0,y0,S,S);q.imageSmoothingEnabled=true}else{q.fillStyle=p.dec;q.fillRect(x0,y0,S,S)}
  q.strokeStyle=p.edge;q.lineWidth=3;q.strokeRect(x0,y0,S,S);
  if(T){const ts=S/T.N;
    // edificio sotto il mouse, ed edificio in cui ti trovi
    const mark=(b,c,lw)=>{q.strokeStyle=c;q.lineWidth=lw;q.strokeRect(x0+b.x*ts,y0+b.y*ts,b.w*ts,b.h*ts)};
    if(MV.hover&&MV.hover.b)mark(MV.hover.b,p.hl,3);
    const inB=Zk==='town'?null:mapBld(Zk);if(inB){const a=.5+.5*Math.sin(performance.now()/180);q.globalAlpha=.4+.6*a;mark(inB,p.me,4);q.globalAlpha=1}
    // nomi degli edifici: si vedono di più ingrandendo, senza sovrapporsi
    const fs=clamp(ts*1.5,10,16);if(ts>=3.2){q.font=`bold ${fs}px Georgia,serif`;q.textAlign='center';q.textBaseline='middle';q.lineJoin='round';const used=[];
      const L=T.TB.filter(b=>b.to&&Z[b.to]).sort((a,b)=>b.w*b.h-a.w*a.h);
      for(const b of L){if(ts<5&&b.w*b.h<30)continue;const bx=x0+(b.x+b.w/2)*ts,by=y0+(b.y+b.h/2)*ts;if(bx<-80||by<-20||bx>w+80||by>h+20)continue;
        const nm=String(Z[b.to].n).split(/[·,]/)[0].trim(),tw=q.measureText(nm).width,R=[bx-tw/2-3,by-fs/2-2,tw+6,fs+4];
        if(used.some(u=>R[0]<u[0]+u[2]&&R[0]+R[2]>u[0]&&R[1]<u[1]+u[3]&&R[1]+R[3]>u[1]))continue;used.push(R);
        q.lineWidth=3.5;q.strokeStyle=p.txtS;q.strokeText(nm,bx,by);q.fillStyle=p.txt;q.fillText(nm,bx,by)}
      q.textBaseline='alphabetic'}
    else{q.font=`bold ${Math.max(14,S*.09)}px Georgia,serif`;q.textAlign='center';q.lineWidth=4;q.strokeStyle=p.txtS;q.strokeText('Aldoria',x0+S/2,y0+S/2);q.fillStyle=p.txt;q.fillText('Aldoria',x0+S/2,y0+S/2)}
    if(Zk==='town'&&P){const[mx,my]=[x0+P.px*ts,y0+P.py*ts],a=.5+.5*Math.sin(performance.now()/160),r=clamp(ts*.5,5,9);
      q.fillStyle=`rgba(232,48,58,${.25*a})`;q.beginPath();q.arc(mx,my,r*(2+a),0,6.3);q.fill();q.fillStyle=p.me;q.beginPath();q.arc(mx,my,r,0,6.3);q.fill();q.strokeStyle='#fff';q.lineWidth=2;q.stroke()}}
  // i quartieri e le zone intorno alla città: cartellini di grandezza fissa
  q.textAlign='center';const ns=clamp(Math.min(w,h)/480,.68,1);for(const n in MNODE){const[nx,ny]=w2s(MNODE[n][0]*.95,MNODE[n][1]*.95),z=Z[n],zb=ZB.find(b=>b.k===n);q.font=`bold ${Math.round(14*ns)}px Georgia,serif`;
    const nm=(zb?zb.ic+' ':'')+String(MNAME[n]||(z?z.n:n)).split(/[·,]/)[0].trim(),tw=Math.max(108*ns,q.measureText(nm).width+20*ns),th=38*ns;
    if(nx<-tw||ny<-th||nx>w+tw||ny>h+th)continue;
    const here=Zk===n||(n.endsWith('_')&&String(Zk).startsWith(n))||(n==='porto'&&String(Zk).startsWith('abisso'))||(Zk&&Zk.startsWith(n+'@')),hov=MV.hover&&MV.hover.k===n&&!MV.hover.b;
    q.fillStyle=here?p.here:p.node;q.strokeStyle=here?p.hereB:hov?p.hl:p.nodeB;q.lineWidth=here||hov?3:1.5;
    q.beginPath();q.roundRect?q.roundRect(nx-tw/2,ny-th/2,tw,th,8):q.rect(nx-tw/2,ny-th/2,tw,th);q.fill();q.stroke();
    q.fillStyle=p.txt;q.fillText(nm,nx,ny-2*ns);q.font=`${Math.round(11*ns)}px Georgia,serif`;q.fillStyle=p.sub;q.fillText(z&&z.lv?'livello '+z.lv+'+':'',nx,ny+12*ns);MAPHIT.push({k:n,x:nx,y:ny,w:tw,h:th})}
  MAPHIT.push({k:'town',x:x0+S/2,y:y0+S/2,w:S,h:S});
  // rosa dei venti
  q.font='bold 22px Georgia,serif';q.fillStyle=p.edge;q.fillText('N',w-30,34);q.beginPath();q.moveTo(w-30,40);q.lineTo(w-37,60);q.lineTo(w-30,55);q.lineTo(w-23,60);q.closePath();q.fill();
  q.strokeStyle=p.frame;q.lineWidth=3;q.strokeRect(3,3,w-6,h-6)}
// tasti della mappa: + e − per lo zoom, 0 per vederla tutta
addEventListener('keydown',e=>{const el=$('mappa');if(!el||el.style.display!=='flex'||e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const k=e.key;if(k==='+'||k==='='){mapZoom(1.4)}else if(k==='-'||k==='_'){mapZoom(1/1.4)}else if(k==='0'){mapFit()}else return;e.preventDefault();e.stopImmediatePropagation()},true);
/* ---- sonno al motel e mondo dei sogni ---- */
let DREAM=null;
for(let n=1;n<=6;n++)if(Z['in_stanza'+n])Z['in_stanza'+n].ex=(Z['in_stanza'+n].ex||[]).filter(o=>o.k!=='letto').concat([{k:'letto',n:'Letto · dormi fino al mattino',px:1.5,py:2.5}]);
function sleepBed(){if(MODE==='dim')return;const m=((gNow()%DAYM)+DAYM)%DAYM;if(nightK()<.5){msg('Non hai sonno: si può dormire solo quando fuori è buio.');return}
  if(NET.tm!=null){P.hp=P.mx;msg('Nel mondo condiviso la notte scorre per tutti: ti riposi e recuperi la vita, ma il mattino arriverà da solo.');hud();return}
  P.slp=(P.slp||0)+1;const dream=Math.random()<(P.dreamt?.02:.03)||(!P.dreamt&&P.slp>=20);P.hp=P.mx;const day=Math.floor(gNow()/DAYM)+(m>=12*60?1:0);P.gt=day*DAYM+420;
  started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';
  playCine([{d:3.5,tx:dream?'Ti addormenti... ma questo sonno non è come gli altri.':'Ti addormenti profondamente. La notte passa in un attimo.',f:'sleep'}],'motel',()=>{started=1;document.body.classList.add('ig');last=performance.now();
    if(dream){P.dreamt=1;load('sogno',Zk)}else{msg('Buongiorno! Hai dormito fino al mattino e recuperato tutta la vita.');hud();save()}})}
const FIGL=()=>{const j=Math.sin(t*7)*.05,j2=Math.cos(t*5)*.06;return[[-.32+j,-.3,0,.64,.6,18,'#0a0606'],[-.27,-.26+j2,18,.54,.52,14,'#120a0a'],[-.2+j2,-.18,32,.4,.36,10,'#0a0505'],[-.4,-.1+j,8+Math.sin(t*3)*3,.12,.2,12,'#140a0a'],[.28,-.1-j,10+Math.cos(t*3)*3,.12,.2,12,'#140a0a'],[-.12,.17,36,.07,.03,3,'#ff2a2a',1.5],[.05,.17,36,.07,.03,3,'#ff2a2a',1.5]]};
const DLINES=['Il re non sempre racconta la verità...','C\'è qualcosa di oscuro sotto la città.','Qualcosa che voi... ██████... non potete comprendere.'];
function genSogno({F,W,n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)M[y][x]=0;
  for(let y=3;y<n-3;y+=4)for(let x=3;x<n-3;x++)if((x<9||x>16)&&R()<.85)F(x,y,'ж');for(const[x,y]of[[4,6],[21,6],[4,14],[21,14],[8,10],[17,10],[6,20],[19,20]])F(x,y,'¥');
  for(let i=0;i<40;i++){const x=ri(2,n-3),y=ri(2,n-3);if(M[y][x]===0)W(x,y,'ш')}for(const[x,y,c]of[[2,2,'3'],[n-3,2,'3'],[2,n-3,'!'],[n-3,n-3,'!'],[10,16,'u'],[15,8,'u']])F(x,y,c);
  ents.push({k:'figura',n:'',px:12.5,py:3.5});return[12,21]}
Object.assign(Z,{sogno:{n:'???',lv:1,N:26,a:'#3a2420',b:'#2e1c18',bg:'#050202',mus:'sogno',pt:'ember',gen:genSogno,dist:1,wl:'#2a1814',wh:40,nolamp:1,rd:['#3a2420','#2e1c18']}});
TRK.sogno={bpm:44,root:38,sc:'phr',pr:[0,1,0,6],ld:'sawtooth',dn:.18,pad:1,dr:0};
function dreamStart(){DREAM={ph:'approach',t:0,i:-1,shown:''};let el=$('dreamtx');if(!el){el=document.createElement('div');el.id='dreamtx';document.body.appendChild(el)}el.textContent='';el.style.display='block';
  if(AU.ac&&SET.sf)try{const t0=AU.ac.currentTime;for(let k=0;k<3;k++){vtone(t0+k*1.2,60,1.1,'sawtooth',1.6,.05);vtone(t0+k*1.2+.55,69,.6,'sawtooth',.6,.05)}}catch(_){}}
function dreamTick(dt){const D2=DREAM;if(!D2)return;for(const k in KEYS)KEYS[k]=0;P.path=[];P.tg=null;D2.t+=dt;const f=ents.find(e=>e.k==='figura'),el=$('dreamtx');
  if(D2.ph==='approach'&&f){const d=dist(f,P);if(d>2.2){f.px+=(P.px-f.px)/d*.9*dt;f.py+=(P.py-f.py)/d*.9*dt}else{D2.ph='talk';D2.i=0;D2.t=0}}
  if(D2.ph==='talk'){const L=DLINES[D2.i]||'',n=Math.min(L.length,Math.floor(D2.t*24));if(el&&el.textContent!==L.slice(0,n))el.textContent=L.slice(0,n);if(D2.t>L.length/24+2.2){D2.i++;D2.t=0;if(D2.i>=DLINES.length){D2.ph='vanish';D2.t=0}}}
  if(D2.ph==='vanish'){if(el)el.textContent='';if(f){if(cineOK())sparks(f.px,f.py,30,['#1a0a0a','#ff2a2a','#3a2a2a'],80);ents.splice(ents.indexOf(f),1);flash('#2a0000',.6,500);P.dream=P.dream||{msg:'turmsi lahig uoi',tr:0};
      banner('Un messaggio inciso nella ruggine','«turmsi lahig uoi» · aggiunto al diario','pergamena');save()}if(D2.t>4.5){D2.ph='wake';const r=P.room||1;DREAM=null;if(el)el.style.display='none';irisGo(()=>{load('in_stanza'+r);msg('Ti svegli di soprassalto, madido di sudore. Era solo un sogno... o no?')})}}}
function dreamTranslate(){if(!P.dream)return;P.dream.tr=1;PA={ti:'Il Saggio della Biblioteca',tx:'«Turmsi lahig uoi»... è eldoriano antico, la lingua dei primi re di Aldoria.\n\nSignifica: «Il re nasconde ciò che sta sotto».\n\nDove l\'hai letto? No... non dirmelo. Certe parole è meglio non pronunciarle ad alta voce dentro queste mura.'};pn('txt');jingle([60,63,67],.15,'sine');save()}
function dreamOverlay(){g.save();g.setTransform(DPR,0,0,DPR,0,0);scrVeil('dream',vigP(H*.08,Math.max(W,H)*.5,'rgba(40,0,0,.12)','rgba(8,0,0,.96)'));
  g.fillStyle='rgba(180,170,165,.55)';for(let i=0;i<70;i++){const x=(i*131+t*12+Math.sin(t+i)*30)%W,y=(i*77+t*28)%H;g.fillRect(x,y,2,2)}if(Math.random()<.04){g.fillStyle='rgba(120,0,0,.15)';g.fillRect(0,0,W,H)}g.restore()}
/* ---- ruota delle azioni al posto della barra ---- */
let RKW=0,RUOT=0;
function wheelBuild(){let el=$('ruota');const bar=$('bar');if(!bar)return;if(!el){el=document.createElement('div');el.id='ruota';el.innerHTML='<div class="rr"></div><div class="rc">'+(ico('ingranaggio',26)||'⚙')+'</div>';document.body.appendChild(el)}
  const B=Array.from(bar.querySelectorAll('button')||[]),rr=el.querySelector('.rr'),n=B.length,R2=96;const sig=B.map(b=>b.outerHTML).join('');if(rr.dataset.sig===sig)return;rr.dataset.sig=sig;rr.innerHTML='';
  B.forEach((b,i)=>{const c=b.cloneNode(true);c.removeAttribute('id');const a=i/n*Math.PI*2-Math.PI/2;c.style.left=(120+Math.cos(a)*R2-26)+'px';c.style.top=(120+Math.sin(a)*R2-26)+'px';c.title=(b.textContent||'').trim();rr.appendChild(c)})}
function wheelApply(){const el=$('ruota'),bar=$('bar');if(SET.oldbar){if(el)el.style.display='none';if(bar)bar.style.display='';return}if(bar)bar.style.display='none';wheelBuild();const e2=$('ruota');if(e2)e2.style.display=SET.rw&&started?'block':'none';hudApply()}
// rotazione lenta guidata da qui: anello e pulsanti usano lo stesso angolo (--a), così le icone restano sempre dritte;
// l'ingranaggio al centro gira più in fretta (--g). Tutto si ferma con il mouse sopra la ruota, anche sopra l'ingranaggio
const RWRM=matchMedia('(prefers-reduced-motion: reduce)');let RWL=0,RGEAR=0;
function wheelSpin(n){requestAnimationFrame(wheelSpin);const dt=Math.min(.1,RWL?(n-RWL)/1000:0);RWL=n;const el=$('ruota');if(!el||el.style.display==='none')return;
  const rr=el.querySelector('.rr'),rc=el.querySelector('.rc'),hov=(rr&&rr.matches(':hover'))||(rc&&rc.matches(':hover'));
  if(!RWRM.matches&&!hov){RUOT=(RUOT+dt*3)%360;RGEAR=(RGEAR+dt*9)%360}el.style.setProperty('--a',RUOT.toFixed(2)+'deg');el.style.setProperty('--g',RGEAR.toFixed(2)+'deg')}
requestAnimationFrame(wheelSpin);
function wheelToggle(){SET.rw=SET.rw?0:1;LS.set('voxelia_set',SET);wheelApply();tone(SET.rw?620:420,.06,'triangle')}
function keyName(k){return k===' '?'Spazio':k.length===1?k.toUpperCase():k.charAt(0).toUpperCase()+k.slice(1)}
addEventListener('keydown',e=>{if(!RKW)return;e.preventDefault();e.stopImmediatePropagation();const k=e.key.toLowerCase();RKW=0;if(k!=='escape'&&!'ijklpqrfcom1234'.includes(k)&&!['shift','enter',' '].includes(k)){SET.rk=k;LS.set('voxelia_set',SET)}else if(k!=='escape')msg('Quel tasto è già usato dal gioco: scegline un altro.');if($('set').style.display==='block')openSet()},true);
/* ---- lingue: italiano, inglese ed eldoriano ---- */
const EN={'Il Regno Perduto':'The Lost Kingdom','— gioco di ruolo in grafica voxel isometrica, con mouse, tastiera o touch.':'— a role-playing game in isometric voxel graphics, with mouse, keyboard or touch.',
'Il Re Lich Malakar ha spezzato la Corona di Voxel in sei frammenti. Esplora Aldoria, accetta missioni, conquista sette dungeon che rinascono a ogni vittoria e sfida gli altri eroi nel Colosseo.':'The Lich King Malakar has shattered the Voxel Crown into six shards. Explore Aldoria, take on quests, conquer seven dungeons that rise again after every victory and challenge other heroes in the Colosseum.',
'📜 Modalità Storia':'📜 Story Mode','Il Regno Perduto: crea il tuo eroe, scegli la difficoltà, rivivi il prologo e riunisci la Corona di Voxel.':'The Lost Kingdom: create your hero, choose the difficulty, relive the prologue and reunite the Voxel Crown.',
'Una cabina blu spuntata nel bosco ti trascina attraverso le epoche: Far West, Londra vittoriana, Rivoluzione e Grande Guerra. Più azione, scelte difficili, finali diversi.':'A blue booth that appeared in the woods drags you through time: the Wild West, Victorian London, the Revolution and the Great War. More action, hard choices, different endings.',
'🎡 Parco giochi':'🎡 Playground','Modalità libera e creativa. In lavorazione.':'A free, creative mode. Work in progress.','← Torna alle modalità':'← Back to modes','Il tuo eroe':'Your hero','Nome':'Name','Codice stanza':'Room code',
'Aspetto dell\'eroe':'Hero\'s look','Pelle, capelli, occhi, barba, vestiti, mantello e corporatura.':'Skin, hair, eyes, beard, clothes, cloak and build.','Nuova partita':'New game','Facile':'Easy','Normale':'Normal','Difficile':'Hard','Incubo':'Nightmare',
'Nemici deboli (HP −30%, danni −40%), più bottino. Si rinasce in città.':'Weak enemies (HP −30%, damage −40%), more loot. You respawn in town.','L\'esperienza bilanciata. Si rinasce in città perdendo il 15% dell\'oro.':'The balanced experience. You respawn in town losing 15% of your gold.',
'Nemici resistenti (HP +50%, danni +40%), meno bottino. Si rinasce perdendo il 25% dell\'oro.':'Tough enemies (HP +50%, damage +40%), less loot. You respawn losing 25% of your gold.','HP ×2,2, danni ×2. Morte permanente: se cadi, il salvataggio viene cancellato.':'HP ×2.2, damage ×2. Permadeath: if you fall, your save is deleted.',
'Prologo':'Prologue','La storia della Corona di Voxel, raccontata dall\'inizio':'The story of the Voxel Crown, told from the beginning','Impostazioni':'Settings','Audio, grafica, fotogrammi, comandi, cursore e HUD':'Audio, graphics, frame rate, controls, cursor and HUD',
'Novità':'What\'s new','NUOVO':'NEW','Tutte le modifiche, versione per versione':'Every change, version by version','Comandi':'Controls','Tastiera e mouse':'Keyboard and mouse',
'▶ Continua il viaggio':'▶ Continue the journey','✨ Nuovo viaggio':'✨ New journey','Inizia dalla cabina apparsa nella Foresta di Elmwood.':'Start from the booth that appeared in the Elmwood Forest.','🎬 Cinematica iniziale':'🎬 Opening cutscene','Come siamo finiti dentro la cabina.':'How we ended up inside the booth.',
'Zaino':'Bag','Missioni':'Quests','Diario':'Journal','Classifica':'Leaderboard','Giocatori':'Players','Pozione':'Potion','Colpo':'Strike','Schiva':'Dodge','Affondo':'Lunge','Opzioni':'Options','Mappa':'Map',
'⚙ Impostazioni':'⚙ Settings','Volume generale':'Master volume','Musica di sottofondo':'Background music','Volume musica':'Music volume','Volume effetti':'Effects volume','Prova suono':'Test sound','🖥 Grafica':'🖥 Graphics','Preimpostazione':'Preset',
'Bassa':'Low','Media':'Medium','Alta':'High','Risoluzione di rendering':'Render resolution','Particelle (foglie, neve, braci)':'Particles (leaves, snow, embers)','Ombre':'Shadows','Illuminazione dinamica nei dungeon':'Dynamic lighting in dungeons','☁ Cielo con nuvole':'☁ Cloudy sky',
'🎬 Animazioni':'🎬 Animations','🎮 Comandi':'🎮 Controls','Personalizza l\'HUD':'Customize the HUD','Rimetti l\'HUD com\'era':'Reset the HUD','🎨 Aspetto dell\'eroe':'🎨 Hero\'s look','🎞 Fotogrammi':'🎞 Frame rate','FPS massimi':'Max FPS',
'🌐 Lingua':'🌐 Language','Lingua del gioco':'Game language','🛞 Ruota delle azioni':'🛞 Action wheel','Usa la vecchia barra al posto della ruota':'Use the old bar instead of the wheel','Tasto per mostrare o nascondere la ruota':'Key to show or hide the wheel',
'Chiudi':'Close','Indietro':'Back','Esci dal tavolo':'Leave the table','Accetta':'Accept','Consegna':'Turn in','Mattina':'Morning','Pomeriggio':'Afternoon','Sera':'Evening','Notte':'Night',
'🗺 Mappa di Aldoria':'🗺 Map of Aldoria','Chiudi (M)':'Close (M)','Benvenuti ad Aldoria':'Welcome to Aldoria','Cosa trovi':'What you\'ll find','Smetti di pescare':'Stop fishing','Ritirati':'Withdraw','Muoviti':'Move'};
const ENR=[[/^Giorno (\d+)$/,'Day $1'],[/^Il tuo schermo aggiorna a circa (\d+) Hz\.$/,'Your screen refreshes at about $1 Hz.'],[/^Compra/,'Buy'],[/^Vendi/,'Sell'],[/^Equipaggia/,'Equip'],[/^Livello (\d+)/,'Level $1'],[/^Accetta/,'Accept'],[/^Consegna/,'Turn in']];
const ELX={re:'turmsi',nasconde:'lahig',sotto:'uoi',il:'ah',lo:'ah',la:'ah',i:'ahn',gli:'ahn',le:'ahn',di:'da',del:'dah',della:'dah',e:'en',ed:'en',che:'ke',non:'nu',è:'es',un:'ur',una:'ur',a:'am',in:'en',per:'pal',con:'kor',città:'eldar',aldoria:'Eldoria',
  corona:'karuun',drago:'drakhul',spada:'skeld',oro:'aurum',vita:'vael',missioni:'quathi',missione:'quath',zaino:'thorvak',mappa:'karth',diario:'lumen',re_:'turmsi',regno:'turmhal',eroe:'haldr',notte:'nyth',giorno:'dagr',mattina:'orvi',sera:'vesp',porta:'ostra',mare:'maeril',fuoco:'ignar',acqua:'aquil',terra:'tarn',luce:'lys',ombra:'skal',
  impostazioni:'ordunathi',chiudi:'kludh',lingua:'tungal',guida:'virath',benvenuti:'salvenai',nuova:'nyra',partita:'harth',pozione:'elixa',classifica:'rangh',giocatori:'spielar',opzioni:'velkar',storia:'sagha',livello:'gradh'};
const ELS=['ta','lu','mi','or','eth','va','dri','ul','sa','ne','thor','ka','el','dun','ri','sha','mo','ven','ar','is','hal','qui','ser','ny'];
function elWord(w){const lw=w.toLowerCase();let r=ELX[lw];if(!r){let h=hs(lw);const n=Math.max(1,Math.min(4,Math.round(lw.length/3)));r='';for(let i=0;i<n;i++){r+=ELS[h%ELS.length];h=Math.floor(h/ELS.length)+i*7919}}
  if(w[0]&&w[0]!==w[0].toLowerCase())r=r.charAt(0).toUpperCase()+r.slice(1);if(w.length>1&&w===w.toUpperCase()&&/[A-ZÀ-Ý]/.test(w))r=r.toUpperCase();return r}
const elText=s=>s.replace(/[A-Za-zÀ-ÖØ-öø-ÿ']+/g,m=>m.split("'").map(p=>p?elWord(p):p).join("'"));
function trText(o){const lang=SET.lang;if(lang==='it')return o;const s=o.trim();if(!s)return o;if(lang==='en'){if(EN[s])return o.replace(s,EN[s]);for(const[re,rp]of ENR)if(re.test(s))return o.replace(s,s.replace(re,rp));return o}return elText(o)}
let I18B=0;
function trNode(root){if(!root)return;const st=[root];while(st.length){const nd=st.pop();if(nd.nodeType===3){const p=nd.parentNode;if(!p||p.closest&&p.closest('script,style,kbd,#cl,.nol'))continue;if(nd.__o==null){if(SET.lang==='it')continue;nd.__o=nd.nodeValue}
      if(nd.__t===nd.nodeValue&&nd.__l===SET.lang)continue;if(nd.__t!==undefined&&nd.nodeValue!==nd.__t)nd.__o=nd.nodeValue;const v=trText(nd.__o);nd.__t=v;nd.__l=SET.lang;if(nd.nodeValue!==v)nd.nodeValue=v}
    else if(nd.nodeType===1&&!/^(SCRIPT|STYLE|CANVAS|INPUT|TEXTAREA)$/.test(nd.tagName))for(const c of nd.childNodes)st.push(c)}}
function setLang(l){SET.lang=l;LS.set('voxelia_set',SET);I18B=1;trNode(document.body);I18B=0;if($('set').style.display==='block')openSet()}
(function(){try{const mo=new MutationObserver(R2=>{if(I18B||SET.lang==='it')return;I18B=1;for(const r of R2){if(r.type==='characterData')trNode(r.target);else for(const n of r.addedNodes)trNode(n)}I18B=0});mo.observe(document.body,{subtree:true,childList:true,characterData:true})}catch(_){}})();
(function(){const st=document.createElement('style');st.textContent=`
#mappa{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(5,6,12,.72);z-index:65;
  --mb:#f3e8cc;--mf:#2a1a0a;--ml:#c8a870;--mc:#fbf3df;--mcb:#d8c090;--mh:#6a2a1a;--mm:#6a5a3a;--mbt:#fff8e6;--mbtb:#b89a62}
#mappa.mdark{--mb:#171c2a;--mf:#e8e2d0;--ml:#5a4a2e;--mc:#20273a;--mcb:#3a3a3e;--mh:#f5c27a;--mm:#a8a08a;--mbt:#262d42;--mbtb:#6a5838}
#mappa .mbox{width:min(1280px,97vw);height:min(820px,94vh);background:var(--mb);color:var(--mf);border:3px solid #8a6a3a;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 20px 60px #000a;animation:vxin .3s ease-out;overflow:hidden}
#mappa .mhd{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 10px 6px 14px;border-bottom:2px solid var(--ml);font:18px Georgia,serif}
#mappa .mhd>b{display:flex;align-items:center;gap:8px}#mappa .mtools{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
#mappa .mtools button{font:14px Georgia,serif;cursor:pointer;background:var(--mbt);color:var(--mf);border:1px solid var(--mbtb);border-radius:6px;padding:5px 10px;margin:0;min-width:32px}
#mappa .mtools button:hover,#mappa .mtools button:focus-visible{border-color:#f5b942;outline:none;background:var(--mbt)}#mappa .mtools button.on{background:#f5b94240;border-color:#f5b942}
#mappa .mtools .mx{margin-left:6px;border-radius:50%;width:32px;height:32px;padding:0}.mz{font:13px Georgia,serif;min-width:46px;text-align:center;color:var(--mm)}
#mappa .mbody{flex:1;display:flex;gap:10px;min-height:0;padding:10px}
#mappa .mcw{position:relative;flex:1.35;min-width:0;border-radius:8px;overflow:hidden}#mapcv{position:absolute;inset:0;display:block;touch-action:none;cursor:grab}
#mappa .mtip{position:absolute;display:none;pointer-events:none;background:var(--mbt);color:var(--mf);border:1px solid #f5b942;border-radius:6px;padding:3px 8px;font:13px Georgia,serif;white-space:nowrap;box-shadow:0 4px 12px #0006}
#mappa .mhint{position:absolute;left:12px;bottom:10px;font:italic 12px Georgia,serif;color:var(--mm);background:var(--mb);opacity:.85;padding:2px 8px;border-radius:6px;pointer-events:none}
#mappa .mbro{flex:1;overflow:auto;padding-right:6px}#mappa.nog .mbro{display:none}
.bro{font:14px Georgia,serif;line-height:1.45}.bcov{background:linear-gradient(160deg,#8a3a2a,#5a2a1a);color:#f8ecd0;border-radius:8px;padding:14px;margin-bottom:10px;text-align:center}
.bcov b{display:block;font-size:24px;letter-spacing:1px}.bcov span{font-style:italic;opacity:.9}.bcard{background:var(--mc);border:1px solid var(--mcb);border-radius:8px;padding:8px 12px;margin:8px 0}.bcard h4{margin:2px 0 4px;color:var(--mh)}
#mappa .bro .mu{color:var(--mm)}.bcard ul{margin:4px 0 4px 18px;padding:0}.bcard.hl{animation:bhl 1.4s ease-out}@keyframes bhl{0%{box-shadow:0 0 0 4px #f5b942}100%{box-shadow:0 0 0 0 transparent}}
@media(max-width:760px){#mappa .mbody{flex-direction:column}#mappa .mcw{flex:none;height:52%}#mappa .mhint{display:none}#mappa .mhd{font-size:16px}#mappa .mtools button{padding:4px 7px;font-size:13px}}
#ruota{position:fixed;left:calc(50% - 120px);bottom:4px;width:240px;height:240px;z-index:5;display:none;pointer-events:none}
#pn{z-index:15}
#ruota .rr{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(20,24,40,.55) 55%,rgba(20,24,40,.15) 70%,transparent 72%);transform:rotate(var(--a,0deg));pointer-events:auto}
#ruota .rr button{position:absolute;width:52px;height:52px;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:10px;transform:rotate(calc(-1 * var(--a,0deg)));background:rgba(27,32,48,.92);border:1px solid #f5b94288;color:#fff;cursor:pointer}
#ruota .rr button span{display:none}#ruota .rr button span.ic{display:block;font-size:20px;line-height:1}#ruota .rr button kbd{font-size:9px;opacity:.8}#ruota .rr button:hover{transform:rotate(calc(-1 * var(--a,0deg))) scale(1.12);border-color:#f5b942}
#ruota .rc{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px;border-radius:50%;background:#f5b942;color:#1b2030;display:flex;align-items:center;justify-content:center;font-size:22px;line-height:0;transform:rotate(var(--g,0deg));pointer-events:auto}
#ruota .rc img{display:block;margin:0;width:26px;height:26px}
@keyframes vxspin{to{transform:rotate(360deg)}}
#dreamtx{position:fixed;left:50%;bottom:16vh;transform:translateX(-50%);max-width:min(760px,90vw);font:italic 26px Georgia,serif;color:#f0d8d0;text-align:center;text-shadow:0 0 12px #f00,0 2px 6px #000;z-index:40;display:none;letter-spacing:1px}
`;document.head.appendChild(st)})();
setTimeout(()=>{if(SET.lang!=='it')setLang(SET.lang)},0);

/* ================= 6.6: Aldoria Vecchia, il passaggio nel muro, la stanza del culto, guardie del Re ================= */
let LFROM=null,VSCR=20,MQA=-1,DIG=null,DIGT=0;
/* ---- domande al Moreau ---- */
const MQ=[['Cosa è successo ad Aldoria Vecchia?','Nessuno lo sa. Nessuno! Quella notte c\'erano solo nebbia, fuoco e urla... e poi il silenzio. Un silenzio che ancora mi sveglia, la notte.'],
  ['Dove sono finiti gli abitanti?','I pochi rimasti sono tornati qui, nel centro della città. Tutti gli altri... scomparsi. Niente cadaveri, niente sangue. Solo rovine.'],
  ['Perché il cancello è sbarrato?','Per ordine del Re. Oltre il cancello c\'è solo il Borgo delle Ceneri, la periferia bruciata, piena di sciacalli e spettri. Aldoria Vecchia, quella vera, sta più in là. Nessuno ci entra da allora.'],
  ['Si può arrivare ad Aldoria Vecchia in un altro modo?','Forse. Dietro la vecchia casa vicino al porto, tra le casse, il muro è marcio. Se qualcuno avesse la forza di scavare... Ma sarà durissima, te lo dico.']];
function moreauHTML(){let h='<h4>❓ Chiedi al Moreau</h4>'+MQ.map((q,i)=>`<button onclick="MQA=${i};pn('npc')"${MQA===i?' class="on"':''}>${q[0]}</button>`).join('');
  if(P.vcult)h+=`<button onclick="MQA=9;pn('npc')">Ho trovato una porta di pietra sotto le rovine</button>`;
  if(MQA>=0){const a=MQA===9?'Una porta di pietra? «La verità sarà nei tuoi occhi»... Allora qualcuno sapeva. Qualcuno ha sempre saputo. Non dirlo al Re. Non dirlo a nessuno.':MQ[MQA][1];h+=`<div class="qb dlga" data-q="${esc(MQA===9?'Ho trovato una porta di pietra sotto le rovine':MQ[MQA][0])}"><i>«${esc(a)}»</i></div>`}return h}
/* ---- il passaggio nel muro: lo scavo ---- */
const HOLEL=e=>{const s=e.side==='e'?1:-1,x0=s<0?-.34:.3,L=[];if(e.dug){L.push([x0,-.38,0,.04,.76,20,'#050505'],[x0-.02*s,-.44,0,.07,.07,22,'#7a5a3a'],[x0-.02*s,.37,0,.07,.07,22,'#7a5a3a'],[x0-.02*s,-.44,20,.07,.88,3,'#7a5a3a'],[s<0?-.2:.05,-.3,0,.3,.6,4,'#7b7f89'],[s<0?-.05:.1,.1,0,.2,.25,6,'#8a8e98'])}
  else{const p=Math.min(1,(P.vdp||0)/100);L.push([x0,-.3,2,.03,.04,24,'#2a2a2e'],[x0,-.1,6,.03,.03,16,'#2a2a2e'],[x0,.12,0,.03,.04,20,'#2a2a2e'],[x0,.25,10,.03,.03,12,'#2a2a2e'],[s<0?-.25:.05,-.25,0,.25,.5,3,'#7b7f89']);if(p>0)L.push([x0,-.3*p,0,.035,.6*p,18*p,'#050505'])}return L};
function holePo(){return Object.assign(po(1,59,'vecchia',{st:'hole'}),{px:1.3,py:59.5,n:P.vdug?'Passaggio per Aldoria Vecchia':'Muro crepato',dug:!!P.vdug,side:'w'})}
function buyPick(){if(P.pick)return;if(!pay(px('pick',250)))return;P.pick=1;msg('Hai comprato un piccone da scavo.');tone(400,.1,'square');save();pn('smith')}
function digOpen(){if(!P.q.some(q=>q.id==='mo5')){msg('Il muro è crepato e la pietra si sbriciola... ma perché scavare qui?');return}if(!P.pick){msg('Ti serve un piccone: lo vende il Fabbro Borin, alla Fucina.');tone(150,.15);return}
  DIG={m:0,d:1,z:.3+Math.random()*.4,msg:'Colpisci quando il segno è sulla crepa. Ogni tanto dovrai puntellare con le assi.'};clearInterval(DIGT);DIGT=setInterval(digTick,30);pn('dig')}
const DIGW=()=>Math.max(.07,.18-(P.vdp||0)/100*.1),DIGP=[30,60,90];
function digNeed(){const p=P.vdp||0,pr=P.vprop||0;for(let i=0;i<3;i++)if(p>=DIGP[i]&&!(pr&(1<<i)))return i;return -1}
function digTick(){if(PM!=='dig'||!DIG){clearInterval(DIGT);DIG=null;return}const sp=.8+(P.vdp||0)/100*1.6;DIG.m+=DIG.d*.03*sp;if(DIG.m>1){DIG.m=1;DIG.d=-1}if(DIG.m<0){DIG.m=0;DIG.d=1}const k=$('dgm');if(k)k.style.left=(DIG.m*100)+'%'}
function digHit(){if(!DIG||digNeed()>=0)return;const w=DIGW(),off=Math.abs(DIG.m-DIG.z);
  if(off<w/2){const gain=off<w/6?12:8;P.vdp=Math.min(100,(P.vdp||0)+gain);DIG.z=.15+Math.random()*.7;DIG.msg=gain>8?'Colpo perfetto! La pietra cede.':'La pietra si sbriciola.';tone(900+Math.random()*200,.05,'square',.05);tone(140,.12,'triangle',.05)}
  else{P.vdp=Math.max(0,(P.vdp||0)-6);const d=Math.max(1,Math.round(P.mx*.05));P.hp=Math.max(1,P.hp-d);DIG.msg='Crollo! Le pietre ti cadono addosso (−'+d+' vita).';flash('#6a5a4a',.35,250);tone(70,.4,'sawtooth',.07)}
  const nd=digNeed();if(nd>=0){P.vdp=DIGP[nd];DIG.msg='Il soffitto scricchiola: puntella il passaggio prima di continuare!'}
  if(P.vdp>=100)digDone();else{save();hud();pn('dig')}}
function digProp(){const i=digNeed();if(i<0)return;if((P.res.legna||0)<2){msg('Ti servono 2 assi di legna: si raccolgono nei Campi di Aldoria.');tone(150,.15);return}P.res.legna-=2;P.vprop=(P.vprop||0)|(1<<i);DIG.msg='Assi piantate: il passaggio regge. Avanti!';tone(300,.15,'triangle');save();pn('dig')}
function digDone(){P.vdig=1;P.vdug=1;const q=P.q.find(q=>q.id==='mo5');if(q)q.c=1;cl();const h=ents.find(e=>e.k==='po'&&e.st==='hole');if(h){h.dug=true;h.n='Passaggio per Aldoria Vecchia';if(cineOK())sparks(h.px,h.py,30,['#8a8e98','#5a4a3a','#c8b898'],90)}
  flash('#000000',.5,500);tone(60,1,'sawtooth',.08);banner('Il passaggio è aperto','Dall\'altra parte, il silenzio. Torna dal Moreau, poi entra.','pergamena');npcMarks();hud();save()}
function digHTML(){const p=P.vdp||0,nd=digNeed(),w=DIGW();let h=`<h3>⛏ Il muro crepato</h3><p>${esc(DIG?DIG.msg:'')}</p><div class="mu">Passaggio scavato: ${Math.round(p)}%</div><div class="fbar"><i class="fz" style="left:0;width:${p}%;background:#8a6a42"></i>${DIGP.map(v=>`<i class="fz" style="left:${v}%;width:.6%;background:#f5b942"></i>`).join('')}</div>`;
  if(nd>=0)h+=`<p><b>Puntella prima di continuare.</b> Assi di legna: ${P.res.legna||0}</p><button onclick="digProp()">🪵 Puntella (2 assi)</button>`;
  else h+=`<div class="mu">La crepa</div><div class="fbar"><i class="fz" style="left:${(DIG.z-w/2)*100}%;width:${w*100}%;background:#d4af37"></i><i id="dgm" class="fm" style="left:${DIG.m*100}%"></i></div><button onclick="digHit()">⛏ Scava (Spazio)</button>`;
  return h+`<p class="mu">Più scavi, più il segno corre veloce e la crepa si stringe. Se manchi la crepa, le pietre ti crollano addosso e perdi un po' di scavo.</p><button onclick="cl()">Riposa e smetti</button>`}
/* ---- Aldoria Vecchia ---- */
const VNOTES=['Lettera mai spedita: «Cara Elsa, stanotte la nebbia è salita dal pozzo della piazza. Ha un odore dolciastro. Il campanaro dice che è solo umidità.»',
  'Pagina di un registro: «Ordine del Re: chiudere tutte le cantine del quartiere. Nessuno deve scendere sotto il livello della strada.»',
  'Il disegno di un bambino: una città con le sue case, e sotto la città un grande occhio aperto.',
  'Un diario strappato: «Hanno cominciato a riunirsi di notte, con le candele. Parlano una lingua che non conosco. Turmsi... turmsi...»',
  'Una ricevuta della Fucina: «Dieci catene di ferro, consegnate di notte alla casa del fabbricante di candele. Pagato in oro antico.»',
  'Un biglietto infilato in una crepa: «Se leggi questo, non guardare la nebbia negli occhi.»'];
const RELL=e=>{const u=Math.sin(t*2+e.px)*1;return[[-.14,-.1,0,.28,.2,3,'#5a4a3a'],[-.08,-.06,3,.16,.12,3,e.c||'#c8a84a'],[-.03,-.03,7+u,.06,.06,2,'#fff2c0',1.5]]};
const BOTL=()=>[[-.4,-.4,0,.8,.8,1.2,'#4a3424'],[-.36,-.02,1.2,.72,.04,.5,'#2a1a10'],[.15,-.3,1.2,.12,.12,1,'#6a6a6a'],[-.35,-.35,1,.3,.25,4,'#7b7f89'],[.12,.1,1,.25,.3,5,'#8a8e98']];
function genVecchia({R4,D,F,W,scat,RS,n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){M[y][x]=0;DEC[y][x]=''}
  const rd=(x0,y0,w,h)=>{R4(x0,y0,w,h,4);for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(R()<.45)DEC[y][x]='ŵ'};
  rd(2,47,n-4,2);rd(47,2,2,n-4);rd(2,20,n-4,2);rd(2,72,n-4,2);rd(20,2,2,n-4);rd(72,2,2,n-4);
  const house=(x0,y0,w,h,kind)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(M[y][x]===4)continue;const edge=x===x0||x===x0+w-1||y===y0||y===y0+h-1;
      if(edge){if((x===x0+(w>>1)&&y===y0+h-1)||R()<(kind===0?.55:.18))continue;F(x,y,'Ŗ')}else{const r=R();if(kind===1&&r<.16)F(x,y,'ƒ');else if(r<(kind===0?.3:.12))F(x,y,R()<.55?'u':'≠');else if(r<.17&&kind===2)F(x,y,'h')}}};
  const blocks=[2,22,49,74],bs=[18,25,23,20];let hi=0;
  for(let by=0;by<4;by++)for(let bx=0;bx<4;bx++){const x0=blocks[bx]+1,y0=blocks[by]+1,w0=bs[bx]-2,h0=bs[by]-2;if(x0+w0>n-2||y0+h0>n-2)continue;
    for(let k=0;k<3;k++){const w=ri(5,8),h=ri(4,7),x=x0+ri(0,Math.max(0,w0-w)),y=y0+ri(0,Math.max(0,h0-h));house(x,y,w,h,(hi++)%3)}}
  const craters=[];for(let i=0;i<7;i++){const cx=ri(8,n-9),cy=ri(8,n-9),r=ri(3,5);craters.push([cx,cy,r]);for(let y=cy-r-1;y<=cy+r+1;y++)for(let x=cx-r-1;x<=cx+r+1;x++){if(x<2||y<2||x>n-3||y>n-3)continue;const d=Math.hypot(x-cx,y-cy);
      if(d<=r){M[y][x]=0;DEC[y][x]=d<r*.55?'ç':'č'}else if(d<=r+1&&R()<.5){M[y][x]=6;DEC[y][x]='u'}}}
  scat(2,2,n-4,n-4,'r',.02);scat(2,2,n-4,n-4,'h',.03);scat(2,2,n-4,n-4,'u',.012);for(let i=0;i<500;i++){const x=ri(2,n-3),y=ri(2,n-3);if(M[y][x]===0&&!DEC[y][x])DEC[y][x]='ŵ'}
  const free=(x0,y0,x1,y1)=>{for(let k=0;k<400;k++){const x=ri(x0,x1),y=ri(y0,y1);if(M[y][x]===0&&DEC[y][x]!=='ç')return[x,y]}return null};
  const day=Math.floor(gNow()/DAYM);if(P.vld!==day){P.vld=day;P.vl=[]}const col=['#c8a84a','#a8a8b0','#8a5a3a','#d4af37','#6a8ab8'];
  for(let i=0;i<24;i++){const p=free(3,3,n-4,n-4);if(p&&!P.vl.includes(i))ents.push({k:'reliq',n:'Oggetto del passato',px:p[0]+.5,py:p[1]+.5,li:i,c:col[i%5]})}
  for(let i=0;i<8;i++){const p=free(3,3,n-4,n-4);if(p)RS('cimelio',p[0],p[1])}
  for(let y=84;y<=90;y++)for(let x=8;x<=15;x++){M[y][x]=0;DEC[y][x]=''}for(let x=8;x<=15;x++){F(x,84,'Ŗ');if(x!==11)F(x,90,'Ŗ')}for(let y=84;y<=90;y++){F(8,y,'Ŗ');F(15,y,'Ŗ')}F(9,85,'u');F(10,85,'≠');F(13,88,'u');
  ents.push({k:'botola',n:'',px:9.5,py:86.5});
  for(let y=46;y<=49;y++)M[y][n-1]=1;ents.push(Object.assign(po(n-2,47,'town',{st:'hole'}),{px:n-1.7,py:47.5,n:'Passaggio per la città',dug:true,side:'e'}));return[n-4,47]}
function genCulto({F,n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)M[y][x]=0;const cx=11,cy=11;
  for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++){const d=Math.hypot(x-cx,y-cy);if(d>3.4&&d<4.4)DEC[y][x]='ø'}
  F(cx,cy,'Ā');for(const[x,y]of[[7,7],[15,7],[7,15],[15,15]])F(x,y,'ğ');for(const[x,y]of[[2,2],[n-3,2],[2,n-3],[n-3,n-3],[cx-2,cy],[cx+2,cy],[cx,cy-2],[cx,cy+2],[5,11],[17,11]])F(x,y,'ċ');
  for(const x of[4,8,14,18])F(x,1,'ë');F(1,8,'ë');F(n-2,8,'ë');ents.push({k:'portap',n:'Porta di pietra',px:cx+.5,py:2.3});
  ents.push(po(cx,n-3,'vecchia',{st:'up',n:'Scala · rovine'}));return[cx,n-5]}
Object.assign(Z,{vecchia:{n:'Aldoria Vecchia',lv:4,N:96,a:'#5a6448',b:'#545e44',bg:'#9aa0a6',mus:'vecchia',pt:'dust',gen:genVecchia,dist:1,rd:['#7a7468','#706a60'],wl:'#5a5a60',wh:24,ruin:1,nolamp:1},
  culto:{n:'???',lv:4,N:22,a:'#2e2a2a',b:'#282424',bg:'#030202',mus:'culto',gen:genCulto,dist:1,wl:'#1e1a1a',wh:36,nolamp:1,rd:['#2e2a2a','#282424']}});
TRK.vecchia={bpm:40,root:40,sc:'min',pr:[0,5,3,6],ld:'sine',dn:.12,pad:1,dr:0};TRK.culto={bpm:34,root:31,sc:'phr',pr:[0,1,0,6],ld:'sawtooth',dn:.32,pad:1,dr:0};
function reliqTake(e){ents.splice(ents.indexOf(e),1);P.vl.push(e.li);const r=Math.random();tone(700,.08,'triangle');
  if(r<.35){const gd=ri(20,70);P.g+=gd;goldFly(gd);flt(e,'+'+gd+' 💰','#ffd84a');msg('Una borsa di monete annerite dal fuoco.')}
  else if(r<.55){P.res.cimelio=(P.res.cimelio||0)+1;flt(e,'+1 Cimelio','#ffe08a');msg('Un cimelio di famiglia, ancora intatto.')}
  else if(r<.78&&(P.vn||[]).length<VNOTES.length){P.vn=P.vn||[];const i=VNOTES.findIndex((_,k)=>!P.vn.includes(k));P.vn.push(i);PA={ti:'Un oggetto del passato',tx:VNOTES[i]+'\n\n(Aggiunto al diario)'};pn('txt')}
  else{const d={k:'dr',px:e.px,py:e.py,it:item(Math.max(4,P.lv),Math.random()<.3?2:1)};ents.push(d);msg('Tra la cenere brilla qualcosa.')}save();hud()}
function scream(){if(!AU.ac||!SET.sf)return;try{const t0=AU.ac.currentTime,v=SET.sf*.6;vtone(t0,78+ri(-3,3),1.3,'sawtooth',.45,.022*v);vtone(t0+.08,82,1.1,'triangle',.5,.016*v);vtone(t0+1.6,74,.9,'sawtooth',.55,.008*v)}catch(_){}}
function vecTick(dt){if(P&&P.te>=2)return;if(Zk==='vecchia'){VSCR-=dt;if(VSCR<=0){VSCR=18+Math.random()*30;scream();VSCR2=1.2}const b=ents.find(e=>e.k==='botola');if(b)b.n=dist(b,P)<2.6?'Botola':''}
  else if(Zk==='culto'){VSCR-=dt;if(VSCR<=0){VSCR=6+Math.random()*7;if(AU.ac&&SET.sf)try{const t0=AU.ac.currentTime;vtone(t0,40+ri(0,5),1.6,'sawtooth',1.4,.03*SET.sf);vtone(t0+.03,41+ri(0,5),1.6,'sawtooth',.7,.02*SET.sf)}catch(_){}}}}
let VSCR2=0;
function vecOverlay(){g.save();g.setTransform(DPR,0,0,DPR,0,0);const cu=Zk==='culto';
  if(!cu){g.fillStyle='rgba(200,204,210,.16)';g.fillRect(0,0,W,H);const bs=blobSpr('220,224,228'),R=W*.35;g.globalAlpha=.2;for(let k=0;k<4;k++){const y=H*(.2+k*.2)+Math.sin(t*.3+k)*20,x=((t*12*(k+1))%(W*1.6))-W*.3;g.drawImage(bs,x-R,y-R,2*R,2*R)}g.globalAlpha=1;
    if(VSCR2>0){VSCR2-=.016;g.fillStyle=`rgba(40,0,0,${VSCR2*.12})`;g.fillRect(0,0,W,H)}}
  scrVeil('vec'+cu,vigP(H*.15,Math.max(W,H)*.6,'rgba(0,0,0,0)',cu?'rgba(10,0,0,.9)':'rgba(20,20,26,.55)'));g.restore()}
function cultDoor(){if(P.key&&P.te>=1){cl();whoosh();irisGo(()=>load('occhio','culto'));return}PA={ti:'La porta di pietra',tx:'Una lastra di pietra nera, liscia come vetro. Al centro è scolpito un grande occhio, aperto.\n\nSotto, incise in lettere antiche:\n\n«La verità sarà nei tuoi occhi, a tempo debito.»\n\nLa porta non si muove. Non ancora.'};pn('txt');
  if(!P.vcult){P.vcult=1;const q=P.q.find(q=>q.id==='mo6');if(q)q.c=1;banner('La porta di pietra','«La verità sarà nei tuoi occhi, a tempo debito» · aggiunto al diario','pergamena');npcMarks();save()}jingle([48,51,55,50],.3,'sawtooth')}
const PORTL=()=>[[-.9,-.12,0,1.8,.24,44,'#2a2a2e'],[-1,-.14,44,2,.28,4,'#1e1e22'],[-.3,.12,22,.6,.02,10,'#4a4a52'],[-.12,.13,25,.24,.02,4,'#c0392b',1.3],[-.05,.14,26,.1,.02,2,'#0a0a0a']];
/* ---- guardie del Re a ogni porta della città ---- */
function townGuards(){for(const p of ents.filter(e=>e.k==='po'&&(e.st==='gate'||e.st==='cancello'))){const gx=p.px|0,gy=p.py|0;let ix=0,iy=0,ox=0,oy=0;
  if(gx<=1){ix=1;oy=1}else if(gx>=N-2){ix=-1;oy=1}else if(gy<=1){iy=1;ox=1}else if(gy>=N-2){iy=-1;ox=1}else continue;
  for(const s of[-2,2]){const x=gx+ix*2+ox*s,y=gy+iy*2+oy*s;if(x>0&&y>0&&x<N-1&&y<N-1&&WK(M[y][x])&&!ents.some(e=>e.k==='npc'&&(e.px|0)===x&&(e.py|0)===y))ents.push(mkNpc('guardia',x,y,{n:'Guardia del Re'}))}}}
const FLC=['#e0304a','#f5c342','#c46bff','#ffffff'];
function bldDetail(x,y,h,b,ht,fy,fx){const bm='#4a3424';
  if(fy){box(x,y+.95,0,1,.07,4,'#77706a');if(x===b.x||x===b.x+b.w-1)box(x+(x===b.x?0:.92),y+.95,0,.08,.07,ht,bm);box(x,y+.96,ht-3,1,.06,2,bm);
    if(x!==b.dx&&h>.3&&(x+y)%2===0){box(x+.26,y+.99,ht*.35-2,.48,.1,2,'#7a4a2a');box(x+.3,y+1.03,ht*.35,.1,.06,2,FLC[(x*3+y)%4]);box(x+.55,y+1.03,ht*.35,.1,.06,2,FLC[(x+y*5)%4])}
    if(x===b.dx+1&&b.st!=='motel'){const on=NK>.3;box(x+.1,y+1.0,ht*.55,.12,.12,5,'#2a2a2a');box(x+.12,y+1.02,ht*.55+1,.08,.08,3,on?'#ffd27a':'#c8b88a',on?1.4:1);if(on)nlight(x+.15,y+1.1,ht*.55,70,'255,200,120',.5,1)}}
  if(fx&&!fy){box(x+.95,y,0,.07,1,4,'#77706a');box(x+.96,y,ht-3,.06,1,2,bm);if(y===b.y)box(x+.92,y,0,.08,.08,ht,bm)}}
function smokeFx(x,y,z){if(!SET.part)return;const a0=g.globalAlpha;for(let k=0;k<3;k++){const s=(t*.35+k/3)%1;g.globalAlpha=a0*.45*(1-s);const r=.25+s*.25;box(x+.5-r/2+s*.25,y+.5-r/2,z+s*30,r,r,4,'#d0d0d0')}g.globalAlpha=a0}
Object.assign(QT,{mo5:{t:'step',once:1,lv:4,n:1,ti:'Il buco nel muro',tx:'Il cancello resterà sbarrato per ordine del Re. Ma dietro la vecchia casa vicino al porto, tra le casse, il muro ovest è marcio. Scava un passaggio: ti serve un piccone (lo vende Borin) e qualche asse di legna per puntellare. Sarà durissima, ma ti pagherò bene.',g:500,x:320,pg:'scava il muro crepato dietro le casse (sud-ovest)'},
  mo6:{t:'step',once:1,lv:4,n:1,ti:'Ciò che resta là fuori',tx:'Il passaggio è aperto. Entra in Aldoria Vecchia e scopri cosa è rimasto. Qualunque cosa trovi... torna a raccontarmela.',g:900,x:650,pg:'esplora Aldoria Vecchia e scoprine il segreto'}});
Object.assign(ZB.find(z=>z.k==='rovine'),{how:'Porta ovest, in basso. Il cancello si apre con la missione del Moreau.',tx:'La periferia bruciata fuori dalle mura, oggi covo di banditi, spettri e ghoul. Aldoria Vecchia, quella vera, sta oltre.',f:['La cappella in rovina di Fratel Tobia','La villa di Lord Vexmoor','Cimeli antichi tra le macerie','Vecchia Ada e l\'Ultima Sentinella']});
ZB.push({k:'vecchia',ic:'🌫',how:'Nessuna porta: chiedi al Moreau. Si dice che il muro sud-ovest, dietro le casse, sia marcio.',tx:'Il vecchio cuore della città, abbandonato dopo la notte della nebbia e del fuoco. Case medievali distrutte, alcune ancora in fiamme, sentieri invasi dalle erbacce, crateri. Nessuno. Solo silenzio... e, ogni tanto, qualcosa che somiglia a un urlo.',f:['Oggetti del passato tra le macerie (si rinnovano ogni giorno)','Lettere e diari di chi c\'era','Cimeli di famiglia','Qualcosa di ben nascosto, sotto le rovine']});
MNODE.vecchia=[-.98,.95];

/* ================= entità ================= */
// ombra morbida Ultra sotto i personaggi: una sola immagine preparata una volta, schiacciata in un'ellisse
let SHS=null;
function shSpr(){if(SHS)return SHS;SHS=document.createElement('canvas');SHS.width=SHS.height=64;const q=SHS.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(0,0,0,.42)');gr.addColorStop(.6,'rgba(0,0,0,.2)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);return SHS}
// 7.12: il passo dipende solo dal tempo, con uno sfasamento fisso per ognuno. Prima la fase era t*10+px*2+py: andando in giù
// px e py crescono e le gambe correvano, andando in su (o in diagonale verso l'alto) calano e le gambe quasi si fermavano
const WPH=new WeakMap();
function walkPh(e,k){let o=WPH.get(e);if(o==null){o=e===P?0:Math.random()*6.283;WPH.set(e,o)}return t*k+o}
function ent(e){if(e.k==='abo'){aboDraw(e);return}if(e.k==='resx'||(e===P&&Zk==='mare'))return;if(e.k==='dead'){const k=(t-e.t0)/.7;g.globalAlpha=Math.max(0,1-k);if(e.fc!=null)drawHero(e.m,e.px,e.py,-k*16,k<.15,e.fc);else drawL(e.m,e.px,e.py,-k*16,k<.15);g.globalAlpha=1;return}const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0);
  if(SET.ultra){if(e.k==='tc')GLOW.push([e.px,e.py,28,66,rgbOf(ZZ.tc||'#ffb04a'),.26]);else if(e.k==='po'&&e.st!=='door'&&e.st!=='exit')GLOW.push([e.px,e.py,20,56,rgbOf(e.col),.22]);else if(e.k==='shard')GLOW.push([e.px,e.py,30,72,'255,220,90',.34]);else if(e.k==='dr'&&e.it.r>=2)GLOW.push([e.px,e.py,10,26,rgbOf(RC[e.it.r]),.22])}
  if(e.k==='tc'){box(e.px-.05,e.py-.05,10,.1,.1,14,'#4a3a2a');const fl=1+Math.sin(t*12+e.px*5)*.15;box(e.px-.09,e.py-.09,24,.18,.18,6*fl,ZZ.tc||'#ffb04a',1.2);return}
  if(SET.shad&&e.k!=='ship'){if(SET.ultra&&e.k!=='dr'){const r=(e.boss?30:16)*1.25;g.drawImage(shSpr(),sx-4-r,sy+1-r*.48,2*r,2*r*.48)}
    else{g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(sx,sy,e.k==='dr'?8:e.boss?28:15,e.boss?13:7,0,0,6.3);g.fill()}}
  let L=[],top=36;const wh=e.fl>0,mov=(e===P&&(P.path.length||P.km))||e.k==='en'||(e.k==='npc'&&e.path&&e.path.length)||(e.k==='pl'&&e.mv>0);
  const hro=e===P||e.k==='pl',wp=walkPh(e,hro?17:10),bob=mov?Math.abs(Math.sin(hro?wp:wp*.9))*2:0;
  let fc=-1;if(e===P)fc=heroFace(P.fc|0),L=heroL(P.ap,P.eq.c?P.eq.c.r:-1,P.eq.h?P.eq.h.r:-1,P.eq.w?P.eq.w.r:0,P.eq.w?iv(P.eq.w):3,P.eq.s?P.eq.s.r:-1,P.sw,eqTy(P.eq)).concat(bagL(P.bag||0),FSH&&PM==='fish'?rodL2():[]);
  else if(e.k==='pl')fc=e.fc|0,L=heroL(e.ap,e.c,e.h,e.w,e.wv,e.s,e.sw,e.ty);
  else if(e.k==='po'&&e.st==='hole'){L=HOLEL(e);top=30}else if(e.k==='secret'){L=secretL(e);top=14}else if(e.k==='shard7'){L=SH7L();top=24}else if(e.k==='portac'){L=PORTCL();top=52}else if(e.k==='po'&&e.st==='tap'){L=TAPL(e);top=40}else if(e.k==='reliq'){L=RELL(e);top=16}else if(e.k==='botola'){L=BOTL();top=10}else if(e.k==='portap'){L=PORTL();top=52}
  else if(e.k==='cho'){const k=Math.min(1,(t-e.ot)/.35),c=e.rich?'#5a2a8a':'#8a5a2a';L=[[-.3,-.22,0,.6,.44,9,c],[-.32,-.24,9,.64,.48,1,'#3a2410']];
    L.push(k<1?[-.3,-.22,9+k*10,.6,.44,4-k*2,'#f5c342']:[-.3,-.26,9,.6,.06,12,'#f5c342']);if(t-e.ot<1.4)L.push([-.18,-.12,10,.36,.24,2,'#fff2a0']);top=20}
  else if(e.tr){L=e.m;if(e.bld){top=e.big?74:58;if(e.k==='en')e.az=-Math.abs(Math.sin(t*9+e.px*3))*2}else{top=(L.top||36)+6;fc=faceOf(...(e.fd||[0,1]));if(L.rg)L=rigPose(L,e)}}
  else if(e.k==='en'){L=e.m;top=e.boss?70:40;if(L.rg){top=L.top+6;fc=rigFace(e);L=rigPose(L,e)}else{rigFace(e);if(!L.hm)L=oldPose(L,e)}}
  else if(e.k==='npc'){L=e.m;top=e.nid==='gatto'?18:e.nid==='re'?46:40;if(e.torch&&NK>.05){nlight(e.px,e.py,30,130,'255,170,80',.8);if(SET.ultra)GLOW.push([e.px,e.py,30,40,'255,170,80',.3])}if(L&&L.rg&&L.g&&!e.ghost){top=L.top+6;fc=npcFace(e);L=npcPose(L,e)}}
  else if(e.k==='ch'){L=[[-.3,-.22,0,.6,.44,9,e.rich?'#5a2a8a':'#8a5a2a'],[-.3,-.22,9,.6,.44,4,'#f5c342']];top=20}
  else if(e.k==='board'){L=[[-.4,-.05,0,.08,.08,30,'#5a4a3a'],[.32,-.05,0,.08,.08,30,'#5a4a3a'],[-.45,-.06,14,.9,.06,18,'#8a6a42'],[-.38,-.02,16,.2,.02,6,'#f4f0e0'],[-.1,-.02,18,.24,.02,8,'#f4f0e0'],[.18,-.02,15,.18,.02,7,'#f4f0e0']];top=40}
  else if(e.k==='shard'){const u=Math.sin(t*3)*4,r=t%6.28;L=[[-.12,-.12,12+u,.24,.24,18,'#ffd84a'],[-.06,-.06,30+u,.12,.12,6,'#fff6c0'],[-.2,-.04,18+u,.4,.08,6,'#ffcc33']];top=48;if(r>3)L.push([-.04,-.2,18+u,.08,.4,6,'#ffcc33'])}
  else if(e.k==='lore'){const u=Math.sin(t*3)*3;L=[[-.2,-.08,8+u,.4,.16,3,'#f4e8c8'],[-.24,-.1,8+u,.06,.2,4,'#a0703a'],[.18,-.1,8+u,.06,.2,4,'#a0703a']];top=26}
  else if(e.k==='figura'){L=FIGL();top=0}else if(e.k==='letto'){L=[[-.2,-.2,0,.4,.4,10,'#6a4a2a'],[-.05,-.05,10,.1,.1,6,'#f4f0e0'],[-.03,-.03,16,.06,.06,3,'#ffcc33',1.3]];top=22}else if(e.k==='c100'){L=C100L(e);top=22}else if(e.k==='vaso'){L=VASOL();top=22}else if(e.k==='console'){L=consoleL();top=52}else if(e.k==='clue'){L=[[-.08,-.08,4+Math.sin(t*3+e.px)*2,.16,.16,6,'#fff2a0',1.4],[-.14,-.14,1,.28,.28,1,'#ffe08a',1.2]];top=22}else if(e.k==='stash'){L=[[-.35,-.25,0,.7,.5,12,'#5a2a6a'],[-.37,-.27,12,.74,.54,4,'#d4af37'],[-.08,.25,6,.16,.03,5,'#d4af37']];top=24}else if(e.k==='ship'){L=shipL(e);top=0;if(NK>.02)nlight(e.px-e.ex*.5,e.py-e.ey*.5,24,150,'255,200,120',.6)}else if(e.k==='res'){L=RESM[e.r]();top=24}else if(e.k==='fs'){const u=Math.sin(t*3+e.px)*1.5;L=[[e.ox-.06,e.oy-.06,-3+u,.12,.12,5,'#e8483a'],[e.ox-.05,e.oy-.05,2+u,.1,.1,3,'#ffffff'],[e.ox-.01,e.oy-.01,5+u,.02,.02,6,'#3a3a3a']];top=22}
  else if(e.k==='po')L=portalL(e),top=e.st==='door'?30:e.st==='cancello'?64:e.st==='pozzo'?52:44;
  else{const it=e.it,md=it&&'whcs'.includes(it.s)?dropL(it):null,u=Math.sin(t*4+e.px*1.7)*2.5,z0=e.gid?13:5;
    // 7.10: armi, elmi, corazze e scudi a terra mostrano il loro modello (lo stesso dello zaino), piccolo e fluttuante
    if(md){L=md.map(b=>[b[0],b[1],b[2]+z0+u,b[3],b[4],b[5],b[6]]);top=z0+30}else{L=[[-.15,-.15,z0+1+u,.3,.3,10,RC[it?it.r|0:0]]];top=z0+18}
    if(e.gid)L=[[-.12,-.1,0,.24,.2,6,'#8a6a3a'],[-.07,-.06,6,.14,.12,3,'#6a4a2a']].concat(L)}
  let aox=0,aoy=0;if(e===P||e.k==='pl'){L=heroAnim(L,e,mov);if(mov&&!(e===P&&HA))L=walkLegs(L,wp);if(e===P)L=heroPose(L)}else if(mov&&L.length>=5&&L.hm)L=walkA(L,wp);else if(e.k==='npc'&&L.hm&&!e.wg){L=e===PA&&PM==='npc'?talkA(L):idleA(L,e)}
  if(e.k==='en'&&L.hm&&e.atkT&&t-e.atkT<.3)L=L.map((q,i)=>i===3||i===4?[q[0],q[1],q[2]+5,q[3],q[4],q[5],q[6]]:q);
  if(e.pry&&t-e.pry<.35&&L.hm)L=L.map((q,i)=>i===3||i===4?[q[0],q[1]+.12,q[2]+6,q[3],q[4],q[5],q[6]]:q);
  if(e.atkT&&t-e.atkT<.25){const k=Math.sin((t-e.atkT)/.25*Math.PI)*.35;aox=e.atkD[0]*k;aoy=e.atkD[1]*k}
  if(e.ghost){g.globalAlpha=.55+Math.sin(t*2)*.15;drawL(L,e.px,e.py,8+Math.sin(t*1.7)*3,0);g.globalAlpha=1;nlight(e.px,e.py,30,140,'160,210,255',.9);if(SET.ultra)GLOW.push([e.px,e.py,30,50,'160,210,255',.3])}else if(fc>=0){const ha=e===P?heroAlpha():1;if(ha<1)g.globalAlpha=ha;drawHero(L,e.px+aox,e.py+aoy,bob+(e.az||0),wh,fc);g.globalAlpha=1}else{const fa=poFade(e);if(fa<1)g.globalAlpha=fa;drawL(L,e.px+aox,e.py+aoy,bob+(e.az||0),wh);g.globalAlpha=1}if(e.k==='npc'&&e.nid==='re'&&P.st>=5&&!P.te){const u=Math.sin(t*3);g.globalAlpha=.3+u*.12;box(e.px-.35,e.py-.35,47+u,.7,.7,5,'#ff3a2a',1.4);g.globalAlpha=1;nlight(e.px,e.py,46,90,'255,60,40',.6)}if(e.shd>t){g.globalAlpha=.22;box(e.px-.75,e.py-.75,0,1.5,1.5,e.boss?74:42,'#9adcff',1.2);g.globalAlpha=1}
  if(SET.ultra&&((e.k==='dr'&&e.it.r>=2)||e.k==='shard'))sparkle(sx,sy-(e.k==='shard'?52:30),e.px*3.3+e.py);
  let lab='';if(e===P)lab=NET.ok&&SET.names?NET.name:'';else if(e.k==='pl')lab=SET.names?e.n+' Lv'+e.lv:'';else if(e.k==='dr')lab=iname(e.it)+(e.by?' · '+e.by:'');else if(e.k==='en')lab=e.boss||e.b.pt?e.n:'';else if(e.k==='tr')lab=e.bld?e.n:'';
  else if(e.k==='ch'||e.k==='tc'||e.k==='cho')lab='';else lab=SET.names||e.k==='shard'?e.n||'':'';
  if(OCC&&OCC.intro)return;g.textAlign='center';g.font='bold 11px Georgia,serif';
  if(e.bt>0&&e.bub)label(e.bub,sx,sy-top-22,'#ffe38a');
  if(lab)label(lab,sx,sy-top-8,e.k==='dr'?RC[e.it.r]:e.k==='shard'?'#ffd84a':e.k==='pl'&&inPit(e.px,e.py)?'#ff9a9a':'#fff');
  if(e.k==='npc'&&e.qm){g.font='bold 18px Georgia,serif';label(e.qm,sx,sy-top-(lab?24:8)-Math.abs(Math.sin(t*4))*3,e.qm==='?'?'#7aff7a':'#ffd84a')}
  if(e.k==='en'||e.k==='tr'||e===P||e.k==='pl'){const w=e.boss||(e.b&&e.b.pt)?60:30;g.fillStyle='#000a';g.fillRect(sx-w/2,sy-top,w,5);g.fillStyle=e===P?'#44cc44':e.k==='pl'?'#44aaff':e.k==='tr'?'#4a8aff':e.enr?'#ff7a2a':'#ee3333';g.fillRect(sx-w/2,sy-top,w*Math.max(0,e.hp/e.mx),5)}}
function portalL(e){const c=e.col,u=Math.sin(t*3)*3;switch(e.st){
  case 'cancello':return gateL(e);case 'cabina':return cabinaL();case 'pozzo':return wellL(e);
  case 'door':return doorL(e.face);case 'exit':return ZZ&&ZZ.dg?portalL(Object.assign({},e,{st:''})):exitL();
  case 'gate':return[[-.5,-.15,0,.16,.3,30,'#7b7f89'],[.34,-.15,0,.16,.3,30,'#7b7f89'],[-.5,-.15,30,1,.3,6,'#7b7f89'],[-.34,-.05,4+u*.3,.68,.1,24,c],[-.3,-.04,8,.6,.08,16,'#ffffff']];
  case 'dun':return[[-.55,-.3,0,.2,.6,34,'#4a4a52'],[.35,-.3,0,.2,.6,34,'#4a4a52'],[-.55,-.3,34,1.1,.6,8,'#3a3a42'],[-.35,-.2,0,.7,.4,30,'#0a0a10'],[-.25,-.1,6+u,.5,.2,18,c],[-.6,-.35,42,1.2,.7,4,'#5a5a62']];
  case 'down':return[[-.4,-.4,0,.8,.8,2,'#2a2a2a'],[-.4,-.4,2,.8,.2,8,'#4a4a52'],[-.4,-.2,2,.8,.2,5,'#3a3a42'],[-.4,0,2,.8,.2,2,'#2a2a32'],[-.15,-.15,14+u,.3,.3,10,c]];
  case 'up':return[[-.4,-.4,0,.8,.2,24,'#5a5a62'],[-.4,-.2,0,.8,.2,18,'#55555d'],[-.4,0,0,.8,.2,12,'#505058'],[-.4,.2,0,.8,.2,6,'#4a4a52'],[-.15,-.15,30+u,.3,.3,10,c]];
  case 'void':{const r=(t*2)%6.28;return[[-.45,-.1,0,.12,.2,40,'#2a1a3a'],[.33,-.1,0,.12,.2,40,'#2a1a3a'],[-.33,-.05,4,.66,.1,32,c],[-.2+Math.cos(r)*.15,-.03,14+Math.sin(r)*8,.1,.06,8,'#ffffff']]}
  default:return[[-.4,-.4,0,.14,.14,34,'#99aabb'],[.26,-.4,0,.14,.14,34,'#99aabb'],[-.4,.26,0,.14,.14,34,'#99aabb'],[.26,.26,0,.14,.14,34,'#99aabb'],[-.18,-.18,6+u,.36,.36,16,c]]}}

/* ================= particelle e luci ================= */
const PTC={leaf:['#5aa03a','#c8782a','#8ac04a'],dust:['#d8c08a','#c8b07a'],snow:['#ffffff','#e8f4ff'],ember:['#ff8a2a','#ffcc33','#ff5a1a'],bubble:['#8ff0ff'],mote:['#c46bff','#8a5aff'],petal:['#ffc0d0','#ffffff'],confetti:['#c0392b','#2980b9','#27ae60','#f39c12','#8e44ad']};
function partUpd(dt){const ty=ZZ.pt;if(!SET.part||!ty){parts.length=0;return}
  const rate={leaf:6,dust:10,snow:40,ember:14,bubble:8,mote:8,petal:3,confetti:5}[ty]||5;
  for(let i=0;i<rate*dt*(W/1000)&&parts.length<120;i++){const up=ty==='ember'||ty==='bubble'||ty==='mote';const c=PTC[ty];
    parts.push({x:Math.random()*W,y:up?H+10:ty==='dust'?Math.random()*H:-10,vx:ty==='dust'?40+Math.random()*40:(Math.random()-.5)*20,vy:up?-(20+Math.random()*40):ty==='dust'?(Math.random()-.5)*6:(ty==='snow'?30:20)+Math.random()*30,l:8,c:c[Math.floor(Math.random()*c.length)],s:ty==='snow'?2+Math.random()*2:ty==='dust'?1.5:3,sw:Math.random()*6.28,ty})}
  for(const p of parts){p.l-=dt;p.sw+=dt*2;p.x+=(p.vx+(p.ty==='leaf'||p.ty==='petal'||p.ty==='snow'?Math.sin(p.sw)*18:0))*dt;p.y+=p.vy*dt}
  parts=parts.filter(p=>p.l>0&&p.y>-20&&p.y<H+20&&p.x>-20&&p.x<W+20)}
function partDraw(){if(!parts.length)return;g.setTransform(DPR,0,0,DPR,0,0);for(const p of parts){g.globalAlpha=Math.min(1,p.l)*.8;g.fillStyle=p.c;if(p.ty==='bubble'){g.strokeStyle=p.c;g.lineWidth=1;g.strokeRect(p.x,p.y,4,4)}else g.fillRect(p.x,p.y,p.s,p.ty==='leaf'||p.ty==='confetti'||p.ty==='petal'?p.s*.6:p.s)}g.globalAlpha=1}
const scr=(x,y,z)=>[(PX(x,y)-camX)*S+W/2,(PY(x,y,z||0)-camY)*S+H/2];
function lights(){const z=ZZ;g.setTransform(DPR,0,0,DPR,0,0);
  if(!z.dg){if(z.int)scrVeil('lint',vigP(H*.3,Math.max(W,H)*.7,'rgba(0,0,0,0)','rgba(10,6,0,.55)'));return}
  if(!SET.light){scrVeil('ldk',vigP(H*.1,Math.max(W,H)*.55,'rgba(0,0,0,0)','rgba(0,0,0,.93)'));return}
  const q=2,lw=Math.ceil(W/q),lh=Math.ceil(H/q);if(!lc||lc.width!==lw||lc.height!==lh){lc=document.createElement('canvas');lc.width=lw;lc.height=lh}
  const l=lc.getContext('2d');l.globalCompositeOperation='source-over';l.clearRect(0,0,lw,lh);l.fillStyle='rgba(2,2,6,.94)';l.fillRect(0,0,lw,lh);l.globalCompositeOperation='destination-out';
  const hs=linSpr('0,0,0'),hole=(x,y,r,a)=>{if(x<-r||y<-r||x>W+r||y>H+r)return;l.globalAlpha=a;l.drawImage(hs,(x-r)/q,(y-r)/q,2*r/q,2*r/q)};
  const[px,py]=scr(P.px,P.py,20);hole(px,py,300*S,1);
  const glow=[];for(const e of ents){if(e.k!=='tc'&&e.k!=='po'&&e.k!=='shard'&&e.k!=='lore')continue;const[x,y]=scr(e.px,e.py,26);if(x<-200||y<-200||x>W+200||y>H+200)continue;const r=(e.k==='tc'?160:110)*S*(1+Math.sin(t*9+e.px*3)*.05);hole(x,y,r,.95);glow.push([x,y,r*.6])}
  for(const o of NET.list){const[x,y]=scr(o.px,o.py,20);hole(x,y,170*S,.9)}
  for(const p of PJ){const[x,y]=scr(p.x,p.y,20);hole(x,y,50*S,.8)}
  l.globalAlpha=1;l.globalCompositeOperation='source-over';g.drawImage(lc,0,0,W,H);g.globalCompositeOperation='lighter';const gs=linSpr(rgbOf(z.tc||'#ffb04a'));g.globalAlpha=48/255;
  for(const[x,y,r]of glow)g.drawImage(gs,x-r,y-r,2*r,2*r);
  g.globalAlpha=1;g.globalCompositeOperation='source-over'}

function draw(){const z=ZZ,out=!!SKY[Zk];GLOW.length=0;NLS.length=0;
  if(SET.sky&&out)drawSky();else{g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=z.bg;g.fillRect(0,0,W,H)}
  const[tx,ty]=camTarget();camX+=(PX(tx,ty)-camX)*.12;camY+=(PY(tx,ty,10)-camY)*.12;shakeTick(1/60);
  const fast=SET.fast!==0&&FAST.ok;if(fast)fastCam();else g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);
  fcPaint();if(fast)fastWater();
  const by={},cvx=W/2/S+170,cvy=H/2/S+230;for(const e of ents.concat(P,NET.list)){if(e.k!=='ship'){const ex=PX(e.px,e.py)-camX,ey=PY(e.px,e.py,0)-camY;if(ex>cvx||ex<-cvx||ey>cvy||ey<-cvy)continue}const k=(e.px|0)+(e.py|0);(by[k]=by[k]||[]).push(e)}
  const vx=W/2/S+100,vy0=H/2/S+60,vy1=H/2/S+160;
  if(fast)fastTiles(by,vx,vy0,vy1);else for(let d=0;d<2*N-1;d++){for(let x=Math.max(0,d-N+1);x<=Math.min(d,N-1);x++){const y=d-x,ex=PX(x,y)-camX,ey=PY(x,y,0)-camY;if(Math.abs(ex)<vx&&ey>-vy1&&ey<vy0+40)tile(x,y)}if(by[d])by[d].sort((a,b)=>a.py-b.py).forEach(ent)}
  for(const p of PJ){box(p.x-.08,p.y-.08,18,.16,.16,8,p.c,1.2)}if(NAV)navDraw();warDraw();seaOverlay();if(FSH)fishDraw();if(Zk==='sogno')dreamOverlay();if(Zk==='vecchia'||Zk==='culto')vecOverlay();if(DARKZ.has(Zk))darkOverlay();if(Zk==='occhio')occOverlay();if(PPJ.length)ppjDraw();if(Zk==='dim_vit')fogDraw();
  if(SET.ultra&&!z.dg)glows();
  if(SET.ultra&&SET.sky&&out)cloudShadows();
  for(const f of fx){if(f.k==='ring'){const p=Math.max(0,1-f.t/.5);g.strokeStyle=`rgba(255,200,80,${f.t*2})`;g.lineWidth=5;g.beginPath();g.ellipse(PX(f.x,f.y),PY(f.x,f.y,0),f.r*45*p,f.r*22*p,0,0,6.3);g.stroke()}
    else if(f.k==='warn'){const p=1-f.t/f.mx;g.fillStyle=`rgba(255,40,30,${.15+p*.25})`;g.beginPath();g.ellipse(PX(f.x,f.y),PY(f.x,f.y,0),f.r*45,f.r*22.5,0,0,6.3);g.fill();g.strokeStyle='rgba(255,80,40,.9)';g.lineWidth=2;g.beginPath();g.ellipse(PX(f.x,f.y),PY(f.x,f.y,0),f.r*45*p,f.r*22.5*p,0,0,6.3);g.stroke()}
    else if(f.k==='trail'){g.strokeStyle=`rgba(200,240,255,${Math.min(1,f.t*4)})`;g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(PX(f.x,f.y),PY(f.x,f.y,12));g.lineTo(PX(f.x2,f.y2),PY(f.x2,f.y2,12));g.stroke();g.lineCap='butt'}
    else if(f.k==='boom'){const p=1-f.t/.4;g.strokeStyle=`rgba(255,120,60,${f.t*2.5})`;g.lineWidth=8;g.beginPath();g.ellipse(PX(f.x,f.y),PY(f.x,f.y,0),f.r*45*p,f.r*22*p,0,0,6.3);g.stroke()}}
  if(SET.dmg){g.textAlign='center';g.font='bold 15px Georgia,serif';g.lineWidth=3;g.strokeStyle='#000';for(const p of pop){g.globalAlpha=Math.min(1,p.t*2);const x=PX(p.x,p.y),y=PY(p.x,p.y,44)-(1-p.t)*28;g.fillStyle=p.c;if(typeof vxText==='function')vxText(p.s,x,y,1,1);else{g.strokeText(p.s,x,y);g.fillText(p.s,x,y)}}g.globalAlpha=1}
  lights();if(SET.ultra&&z.dg)glows();
  if(out)nightDraw();
  if(SET.ultra&&!z.dg)grade(out&&NK<.5);
  sfxDraw();vfDraw();tourDraw();partDraw();ffDraw();
  if(SET.wasd&&IT&&!PM&&!(typeof TCH!=='undefined'&&TCH.on)){g.setTransform(DPR,0,0,DPR,0,0);const[X,Y]=scr(IT.px,IT.py,IT.k==='npc'?26:IT.k==='po'?22:12);keycap(X+26*S,Y,'R')}}
let MINIF=0;
function mini(){if(!SET.mini||!MC)return;if(SET.fast!==0&&(++MINIF&1))return;const s=130/N;mm.clearRect(0,0,130,130);mm.drawImage(MC,0,0);
  for(const e of ents){if(e.k==='tc'||e.k==='cho'||e.k==='resx'||e.k==='ship'||e.k==='dead'||e.k==='figura')continue;mm.fillStyle=e.k==='tr'?'#5a9aff':e.k==='en'?(e.boss?'#ff00ff':'#ff4444'):e.k==='po'?'#44eeff':e.k==='ch'?'#ffaa33':e.k==='npc'?(e.qm?'#ffd84a':'#eeee99'):e.k==='shard'||e.k==='lore'?'#ffffff':'#dddddd';const r=e.boss||e.k==='po'?4:3;mm.fillRect(e.px*s-r/2,e.py*s-r/2,r,r)}
  for(const o of NET.list){mm.fillStyle='#66aaff';mm.fillRect(o.px*s-2,o.py*s-2,4,4)}
  const d=P.dr||[0,1],a=Math.atan2(d[1],d[0]),X=P.px*s,Y=P.py*s;mm.save();mm.translate(X,Y);mm.rotate(a);mm.fillStyle='#fff';mm.strokeStyle='#000';mm.lineWidth=1.2;mm.beginPath();mm.moveTo(5,0);mm.lineTo(-3.5,-3.5);mm.lineTo(-1.5,0);mm.lineTo(-3.5,3.5);mm.closePath();mm.stroke();mm.fill();mm.restore();
  compass()}
// bussola: punti cardinali sui bordi della minimappa (il nord è in alto, verso la porta della foresta)
function compass(){const w=130;mm.font='bold 11px Georgia,serif';mm.textAlign='center';mm.textBaseline='middle';
  for(const[l,x,y]of[['N',w/2,8],['E',w-8,w/2],['S',w/2,w-8],['O',8,w/2]]){mm.fillStyle='#000b';mm.beginPath();mm.arc(x,y,7,0,6.3);mm.fill();mm.strokeStyle=l==='N'?'#ff6a5a':'#f5b94299';mm.lineWidth=1;mm.stroke();mm.fillStyle=l==='N'?'#ff8a7a':'#f4e8c8';mm.fillText(l,x,y+.5)}
  mm.textBaseline='alphabetic'}

/* ================= effetti grafici Ultra ================= */
const rgbOf=h=>{if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];const n=parseInt(h.slice(1,7),16);return(n>>16)+','+(n>>8&255)+','+(n&255)};
// riflessi dell'acqua: scintillii che si accendono e si spengono e una banda di luce che scorre sulla superficie
function waterFx(x,y,lava){const ph=hh(x*3.1,y*7.7)*6.283,a=Math.pow(Math.max(0,Math.sin(t*2.3+ph)),12);
  if(a>.05){g.globalAlpha=a;box(x+.15+hh(x,y*2)*.55,y+.15+hh(x*2,y)*.55,-3,.13,.13,0,lava?'#fff2a0':'#ffffff');g.globalAlpha=1}
  if(Zk!=='peaks'){const b=Math.sin((x-y)*.55-t*1.1);if(b>.8){g.globalAlpha=(b-.8)*1.2;box(x,y,-3,1,1,0,lava?'#ffd27a':'#e6f4ff');g.globalAlpha=1}}
  if(lava&&(x+y)%2===0)GLOW.push([x+.5,y+.5,-3,46,'255,110,30',.16])}
// dettagli del terreno (ciuffi d'erba, fiori, sassi, neve, crepe): disegnati una volta sola nella cache del pavimento
function floorDetail(x,y,z){const k=hh(x*5.3+1,y*2.9+3);
  if(Zk==='town'||Zk==='forest'){if(k>.5){const gc=Zk==='forest'?'#3c7a2c':'#5d8c43';box(x+.18+k*.3,y+.32,0,.05,.05,4+k*5,gc);box(x+.52,y+.62-k*.2,0,.05,.05,3+k*3,gc,1.18);box(x+.7-k*.25,y+.22,0,.05,.05,3+k*2,gc,.88)}
    if(k>.92)box(x+.62,y+.58,0,.12,.12,2,['#ffe24a','#ff8ab8','#ffffff','#9ad0ff'][(x*3+y)%4])}
  else if(Zk==='desert'){if(k>.78)box(x+.3+k*.2,y+.42,0,.13,.1,2,'#b8955a');if(k>.95){box(x+.6,y+.2,0,.05,.05,7,'#6a8a3a');box(x+.55,y+.22,4,.15,.04,2,'#6a8a3a')}}
  else if(Zk==='peaks'){if(k>.72)box(x+.25,y+.35,0,.22,.15,2,'#ffffff');if(k>.9)box(x+.6,y+.6,0,.11,.11,3,'#8a96a4')}
  else if(z.dg){if(k>.82)box(x+.1+k*.4,y+.32,0,.3,.03,0,'#2a2a30');if(k<.06)box(x+.55,y+.3,0,.03,.3,0,'#2a2a30')}}
// sprite di bagliore (sfumatura radiale) per ogni colore, generato una volta sola: disegnarlo costa molto meno che creare una sfumatura a ogni fotogramma
const GSP={};
function glowSpr(c){let s=GSP[c];if(s)return s;s=document.createElement('canvas');s.width=s.height=64;const q=s.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,`rgba(${c},1)`);gr.addColorStop(.45,`rgba(${c},.35)`);gr.addColorStop(1,`rgba(${c},0)`);q.fillStyle=gr;q.fillRect(0,0,64,64);return GSP[c]=s}
// 7.4: altre sfumature preparate una volta sola. blobSpr: macchia radiale (nebbia, fumo) che sfuma fino a trasparente;
// linSpr: sfumatura lineare dal colore al nero trasparente (buchi di luce e aloni delle torce nelle segrete)
const BSP={};
function blobSpr(c,lin){const key=c+(lin?'L':'B');let s=BSP[key];if(s)return s;s=document.createElement('canvas');s.width=s.height=128;const q=s.getContext('2d'),gr=q.createRadialGradient(64,64,lin?0:1.5,64,64,64);
  gr.addColorStop(0,`rgba(${c},1)`);gr.addColorStop(1,lin?'rgba(0,0,0,0)':`rgba(${c},0)`);q.fillStyle=gr;q.fillRect(0,0,128,128);return BSP[key]=s}
const linSpr=c=>blobSpr(c,1);
// velature a tutto schermo (vignettature): disegnate una volta a 1/4 di risoluzione e poi solo copiate, finché la finestra non cambia misura
const SCRV={};
function scrVeil(key,paint){const w=Math.max(1,Math.ceil(W/4)),h=Math.max(1,Math.ceil(H/4)),k=w+'x'+h+'|'+W+'x'+H;let v=SCRV[key];
  if(!v||v.k!==k){const c=v&&v.c||document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');q.setTransform(w/W,0,0,h/H,0,0);paint(q);v=SCRV[key]={k,c}}
  g.drawImage(v.c,0,0,W,H)}
const vigP=(r0,r1,c0,c1)=>q=>{const gr=q.createRadialGradient(W/2,H/2,r0,W/2,H/2,r1);gr.addColorStop(0,c0);gr.addColorStop(1,c1);q.fillStyle=gr;q.fillRect(0,0,W,H)};
// bagliori additivi attorno a lampioni, torce, fucine, portali, lava e oggetti rari
function glows(){if(!GLOW.length)return;const z=ZZ,k=z.dg?1:z.int?1.1:.7;g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);g.globalCompositeOperation='lighter';
  for(const[x,y,zz,r,c,a]of GLOW){const X=PX(x,y),Y=PY(x,y,zz),R2=r*(1+Math.sin(t*7+x*3+y)*.06);g.globalAlpha=Math.min(1,a*k);g.drawImage(glowSpr(c),X-R2,Y-R2,2*R2,2*R2)}
  g.globalAlpha=1;g.globalCompositeOperation='source-over'}
function sparkle(x,y,s){const ph=(t*1.7+s)%3;if(ph>=.6)return;const a=Math.sin(ph/.6*Math.PI),X=x+Math.sin(s*7)*8,Y=y-Math.cos(s*5)*6,L=7*a+2;
  g.globalCompositeOperation='lighter';g.strokeStyle=`rgba(255,255,230,${a})`;g.lineWidth=1.5;g.beginPath();g.moveTo(X-L,Y);g.lineTo(X+L,Y);g.moveTo(X,Y-L);g.lineTo(X,Y+L);g.stroke();g.globalCompositeOperation='source-over'}
// ombre delle nuvole che scorrono sul terreno (solo dentro la mappa)
let CSH=null;
function cloudShadows(){if(!CSH){CSH=document.createElement('canvas');CSH.width=CSH.height=128;const q=CSH.getContext('2d'),gr=q.createRadialGradient(64,64,10,64,64,64);gr.addColorStop(0,'rgba(20,30,60,.17)');gr.addColorStop(1,'rgba(20,30,60,0)');q.fillStyle=gr;q.fillRect(0,0,128,128)}
  g.save();g.beginPath();g.moveTo(PX(0,0),PY(0,0,0));g.lineTo(PX(N,0),PY(N,0,0));g.lineTo(PX(N,N),PY(N,N,0));g.lineTo(PX(0,N),PY(0,N,0));g.closePath();g.clip();
  const span=N+20;for(let i=0;i<3;i++){const wx=((i*.37*span+t*.35)%span)-10,wy=((i*.61*span+t*.12)%span)-10,X=PX(wx,wy),Y=PY(wx,wy,0),r=150+i*30;g.drawImage(CSH,X-r,Y-r/2,2*r,r)}
  g.restore()}
// velo di luce Ultra disegnato una volta sola (a metà risoluzione) e poi copiato a ogni fotogramma con un'unica operazione:
// raggi di sole obliqui che partono dal sole in alto a destra (solo all'aperto) e vignettatura calda ai bordi.
// La saturazione e il contrasto in più li dà il filtro CSS della tela (uFx).
let VEIL=null;
function veil(out){const w=Math.ceil(W/2),h=Math.ceil(H/2),sp=sunPos(),ux=sp.x/W,uy=sp.y/H,k=w+'x'+h+(out?'o'+Math.round(ux*40)+'_'+Math.round(uy*40):'i');if(VEIL&&VEIL.k===k)return VEIL.c;
  const c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d');
  if(out){const sx=w*ux,sy=h*uy,L=Math.hypot(w,h)*1.05,dir=ux>.5?0:1;
    for(let i=0;i<5;i++){const a=dir?Math.PI-(2.12+i*.12):2.12+i*.12,w1=(70+(i*37%5)*26)/2,dx=Math.cos(a),dy=Math.sin(a),nx=-dy,ny=dx,al=.07+.03*((i*7)%3)/2;
      const gr=q.createLinearGradient(sx,sy,sx+dx*L,sy+dy*L);gr.addColorStop(0,'rgba(255,238,200,0)');gr.addColorStop(.14,`rgba(255,238,200,${al})`);gr.addColorStop(.6,`rgba(255,238,200,${al*.4})`);gr.addColorStop(1,'rgba(255,238,200,0)');q.fillStyle=gr;
      q.beginPath();q.moveTo(sx+nx*1.5,sy+ny*1.5);q.lineTo(sx+dx*L+nx*w1,sy+dy*L+ny*w1);q.lineTo(sx+dx*L-nx*w1,sy+dy*L-ny*w1);q.lineTo(sx-nx*1.5,sy-ny*1.5);q.closePath();q.fill()}}
  const v=q.createRadialGradient(w/2,h/2,Math.min(w,h)*.42,w/2,h/2,Math.hypot(w,h)*.6);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(22,10,0,.26)');q.fillStyle=v;q.fillRect(0,0,w,h);
  VEIL={k,c};return c}
function grade(out){g.setTransform(DPR,0,0,DPR,0,0);g.drawImage(veil(out),0,0,W,H)}
// colori più vivi in Ultra: filtro applicato dalla scheda grafica alla tela del gioco
function uFx(){cv.style.filter=SET.ultra?'saturate(1.16) contrast(1.05)':''}
// lucciole nella foresta e pollini in città: volano nel mondo intorno all'eroe, non sopra il cielo
let FF=[];
function ffNew(){for(let k=0;k<6;k++){const a=Math.random()*6.283,r=1.5+Math.random()*11,x=P.px+Math.cos(a)*r,y=P.py+Math.sin(a)*r;if(x>1&&y>1&&x<N-1&&y<N-1)return{x,y,z:6+Math.random()*34,vx:0,vy:0,ph:Math.random()*6.28,sp:1.5+Math.random()*2.5}}return{x:P.px,y:P.py,z:20,vx:0,vy:0,ph:0,sp:2}}
function ffUpd(dt){if(!((SET.ultra||NK>.5)&&SET.part&&(Zk==='forest'||Zk==='town'))){FF.length=0;return}const want=Math.round((Zk==='forest'?26:12)*(1+NK*1.2));
  while(FF.length<want)FF.push(ffNew());
  for(let i=0;i<FF.length;i++){const f=FF[i];f.vx+=(Math.random()-.5)*2*dt;f.vy+=(Math.random()-.5)*2*dt;f.vx*=.985;f.vy*=.985;f.x+=f.vx*dt;f.y+=f.vy*dt;f.ph+=dt*f.sp;if(Math.hypot(f.x-P.px,f.y-P.py)>13)FF[i]=ffNew()}}
function ffDraw(){if(!FF.length)return;g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);g.globalCompositeOperation='lighter';const fo=Zk==='forest',sp=glowSpr(fo?'210,255,120':'255,244,210'),r=fo?7:4;
  for(const f of FF){g.globalAlpha=(Math.sin(f.ph)+1)/2*(fo?.8:.55)+.1;g.drawImage(sp,PX(f.x,f.y)-r,PY(f.x,f.y,f.z+Math.sin(f.ph*.6)*5)-r,2*r,2*r)}
  g.globalAlpha=1;g.globalCompositeOperation='source-over'}
// tasto da premere per interagire con ciò che è vicino
function keycap(x,y,k){g.fillStyle='rgba(16,19,26,.88)';g.strokeStyle='#f5b942';g.lineWidth=1.5;g.beginPath();if(g.roundRect)g.roundRect(x-10,y-10,20,20,4);else g.rect(x-10,y-10,20,20);g.fill();g.stroke();
  g.fillStyle='#fff';g.font='bold 12px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(k,x,y+1);g.textBaseline='alphabetic'}

/* ================= cielo con nuvole voxel ================= */
const SKY={town:['#3f84d4','#86bce8','#d9eef9'],arena:['#3f84d4','#86bce8','#d9eef9'],forest:['#4a92d6','#a3d3f0','#e2f3fa'],desert:['#3a7fc8','#9cc4e6','#f3e1b8'],peaks:['#4e6f94','#a9c0d8','#eaf0f6']};
Object.assign(SKY,{nord:['#3f84d4','#86bce8','#d9eef9'],campi:['#4a92d6','#a3d3f0','#e8f4fa'],rovine:['#5a6a80','#9aa6b6','#d0d6de'],porto:['#3a86d8','#8cc4ec','#dff0fb']});
let CLD=null;
// nuvola voxel: blocchi isometrici (faccia sopra chiara, lati in ombra) su una griglia a forma di ellisse, con qualche cumulo più alto al centro
function cloudSprite(r,tn){const U=19,HZ=13,nx=4+(r()*5|0),ny=2+(r()*2|0),C=[];let mh=1;
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++){const ex=(x+.5)/nx*2-1,ey=(y+.5)/ny*2-1,d=ex*ex+ey*ey;if(d>1.05&&r()<.8)continue;const h=1+(d<.5&&r()<.65?1:0)+(d<.18&&r()<.45?1:0);mh=Math.max(mh,h);C.push([x,y,h])}
  if(!C.length)C.push([0,0,1]);
  const w=(nx+ny)*U+4,h=(nx+ny)*U/2+mh*HZ+4,c=document.createElement('canvas');c.width=w;c.height=h;const q=c.getContext('2d'),ox=ny*U+2,oy=mh*HZ+2,pt=(x,y,z)=>[ox+(x-y)*U,oy+(x+y)*U/2-z*HZ];
  const face=(A,col)=>{q.fillStyle=q.strokeStyle=col;q.lineWidth=1;q.beginPath();q.moveTo(A[0][0],A[0][1]);for(let i=1;i<A.length;i++)q.lineTo(A[i][0],A[i][1]);q.closePath();q.fill();q.stroke()};
  C.sort((a,b)=>a[0]+a[1]-b[0]-b[1]);
  for(const[x,y,hh]of C)for(let z=0;z<hh;z++){const t0=pt(x,y,z+1),t1=pt(x+1,y,z+1),t2=pt(x+1,y+1,z+1),t3=pt(x,y+1,z+1);face([t3,t2,pt(x+1,y+1,z),pt(x,y+1,z)],tn[1]);face([t1,t2,pt(x+1,y+1,z),pt(x+1,y,z)],tn[2]);face([t0,t1,t2,t3],tn[0])}
  return c}
function skyInit(){const r=sd(hs('cielo'+Zk)),tn=Zk==='desert'?['#fffaf0','#efe2cc','#d9c8ab']:Zk==='peaks'?['#f6f8fb','#d8e0ea','#b9c6d6']:['#ffffff','#e2eaf4','#c6d3e3'];
  const sp=[];for(let i=0;i<6;i++)sp.push(cloudSprite(r,tn));const L=[];
  for(let i=0;i<15;i++){const far=i<8;L.push({s:sp[i%6],x:r(),y:far?.02+r()*.32:.06+r()*.62,v:(far?6:15)*(.7+r()*.6),p:far?.04:.1,k:far?.6:1.05,a:far?.55:.88})}
  L.sort((a,b)=>a.k-b.k);CLD={z:Zk,L}}
let SKC=null;
const SKD=['#3a3a7a','#d0705a','#f5b07a'];
function mixC(a,b,k){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=(s)=>Math.round(((A>>s)&255)*(1-k)+((B>>s)&255)*k);return'rgb('+f(16)+','+f(8)+','+f(0)+')'}
function drawSky(){const dk=Math.round(Math.max(DK,NK*.3)*20)/20;if(!SKC||SKC.z!==Zk||SKC.h!==H||SKC.d!==dk){const c=SKY[Zk],gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,mixC(c[0],SKD[0],dk));gr.addColorStop(.55,mixC(c[1],SKD[1],dk));gr.addColorStop(1,mixC(c[2],SKD[2],dk));SKC={z:Zk,h:H,gr,d:dk}}
  g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=SKC.gr;g.fillRect(0,0,W,H);
  const sp=sunPos(),sx=sp.x,sy=sp.y;if(sp.up){g.globalAlpha=.75;g.drawImage(glowSpr(DK>.3?'255,170,90':'255,240,190'),sx-170,sy-170,340,340);g.globalAlpha=1;
  g.fillStyle=DK>.3?'#ffd0a0':'#fff3c4';g.fillRect(sx-26,sy-26,52,52);g.fillStyle=DK>.3?'#ff9a4a':'#ffe58a';g.fillRect(sx-20,sy-20,40,40)}
  if(!CLD||CLD.z!==Zk)skyInit();const span=W+600;
  for(const cl of CLD.L){const w=cl.s.width*cl.k,h=cl.s.height*cl.k,x=((cl.x*span+t*cl.v-camX*S*cl.p)%span+span)%span-300,y=cl.y*H-camY*S*cl.p*.25;g.globalAlpha=cl.a;g.drawImage(cl.s,x,y,w,h)}g.globalAlpha=1}

/* ================= icone voxel degli oggetti (generate una volta e tenute in cache) ================= */
const ICO={};
function itype(it){const n=it.n||'';
  if(it.s==='w'){for(const[k,v]of[['Pugnale','dag'],['Stocco','dag'],['Pungiglione','dag'],['Daga','dag'],['Coltello','dag'],['Ascia','axe'],['Mannaia','axe'],['Martello','ham'],['Clava','ham'],['Mazza','ham'],['Randello','ham'],['Maglio','ham'],['Lancia','spr'],['Alabarda','spr'],['Picca','spr'],['Tridente','tri'],['Bastone','stf'],['Scettro','stf'],['Bacchetta','stf'],['Verga','stf'],['Falce','scy']])if(n.includes(k))return v;return'swd'}
  if(it.s==='h'){if(/Corona|Diadema|Tiara/.test(n))return'crn';if(/Cappuccio/.test(n))return'hood';if(/Maschera/.test(n))return'mask';return'helm'}
  if(it.s==='c'){if(/Tunica|Veste/.test(n))return'robe';if(/Cotta|Giaco/.test(n))return'mail';return'plate'}
  return /Brocchiere|Rotella/.test(n)?'buck':/Pavese/.test(n)?'pav':'kite'}
function iconModel(ty,c){const Wd='#6b4a2b',Gd='#d4af37',D='#3a3a42',K='#1d1d24';
  // anelli della cotta di maglia: piccoli quadrati scuri sfalsati sulle due facce visibili
  const rings=()=>{const o=[];for(let z=5,row=0;z<28;z+=5,row++){for(let x=-.22+(row%2?.06:0);x<.2;x+=.12)o.push([x,.15,z,.05,.015,2.5,D]);for(let y=-.13+(row%2?.06:0);y<.11;y+=.12)o.push([.24,y,z,.015,.05,2.5,D])}return o};
  switch(ty){
  case 'swd':return[[-.05,-.05,-4,.1,.1,4,Gd],[-.04,-.04,0,.08,.08,10,Wd],[-.32,-.06,10,.64,.12,4,Gd],[-.07,-.04,14,.14,.08,36,c],[-.04,-.025,50,.08,.05,6,c]];
  case 'dag':return[[-.05,-.05,-3,.1,.1,3,Gd],[-.04,-.04,0,.08,.08,8,Wd],[-.22,-.05,8,.44,.1,3,Gd],[-.06,-.035,11,.12,.07,22,c],[-.03,-.02,33,.06,.04,5,c]];
  case 'axe':return[[-.04,-.04,0,.08,.08,48,Wd],[.04,-.07,30,.34,.14,14,c],[.36,-.08,26,.08,.16,22,c],[-.12,-.06,34,.1,.12,8,D]];
  case 'ham':return[[-.04,-.04,0,.08,.08,40,Wd],[-.26,-.14,36,.52,.28,16,c],[-.28,-.16,40,.04,.32,8,Gd],[.24,-.16,40,.04,.32,8,Gd]];
  case 'spr':return[[-.06,-.06,0,.12,.12,42,Wd],[-.07,-.07,12,.14,.14,5,D],[-.1,-.08,40,.2,.16,4,Gd],[-.12,-.07,44,.24,.14,8,c],[-.09,-.055,52,.18,.11,7,c],[-.05,-.035,59,.1,.07,6,c],[-.025,-.02,65,.05,.04,4,c]];
  case 'tri':return[[-.05,-.05,0,.1,.1,42,Wd],[-.06,-.06,14,.12,.12,6,D],[-.26,-.06,42,.52,.12,5,c],[-.26,-.05,47,.1,.1,16,c],[-.05,-.05,47,.1,.1,22,c],[.16,-.05,47,.1,.1,16,c]];
  case 'stf':return[[-.04,-.04,0,.08,.08,46,Wd],[-.1,-.1,42,.2,.2,4,Gd],[-.12,-.12,46,.24,.24,12,c],[-.06,-.06,58,.12,.12,4,'#ffffff']];
  case 'scy':return[[-.035,-.035,0,.07,.07,52,Wd],[-.6,-.05,46,.62,.1,6,c],[-.6,-.05,38,.1,.1,8,c]];
  case 'helm':return[[-.3,-.3,0,.6,.6,14,c],[-.24,-.24,14,.48,.48,6,c],[-.12,-.12,20,.24,.24,4,c],[-.26,.29,5,.52,.02,3,'#111111'],[-.04,-.18,24,.08,.36,8,Gd]];
  case 'crn':return[[-.3,-.3,0,.6,.6,8,Gd],[-.3,-.3,8,.1,.1,8,Gd],[.2,-.3,8,.1,.1,8,Gd],[-.3,.2,8,.1,.1,8,Gd],[.2,.2,8,.1,.1,8,Gd],[-.05,-.3,8,.1,.1,10,Gd],[-.05,.2,8,.1,.1,10,Gd],[-.06,.29,2,.12,.03,4,c],[.29,-.06,2,.03,.12,4,c]];
  case 'hood':return[[-.3,-.3,0,.6,.6,14,c],[-.22,-.22,14,.44,.44,8,c],[-.12,-.12,22,.24,.24,6,c],[-.2,.29,2,.4,.02,8,'#1a1a1a']];
  case 'mask':return[[-.26,-.1,0,.52,.2,26,Gd],[-.2,.1,14,.12,.02,4,K],[.08,.1,14,.12,.02,4,K],[-.04,.1,6,.08,.03,6,c],[-.28,-.11,26,.56,.22,4,c],[-.34,-.08,0,.08,.16,26,c],[.26,-.08,0,.08,.16,26,c],[-.345,-.085,6,.09,.17,2,Gd],[-.345,-.085,14,.09,.17,2,Gd],[.255,-.085,6,.09,.17,2,Gd],[.255,-.085,14,.09,.17,2,Gd]];
  case 'plate':return[[-.22,-.14,0,.44,.28,8,c],[-.25,-.15,8,.5,.3,22,c],[-.38,-.16,22,.14,.32,10,c],[.24,-.16,22,.14,.32,10,c],[-.08,-.08,30,.16,.16,1,K],[-.23,-.15,6,.46,.3,3,Gd],[-.03,.15,12,.06,.02,16,Gd],[-.12,.15,22,.24,.02,3,Gd]];
  case 'mail':return[[-.24,-.15,0,.48,.3,30,c],[-.35,-.13,12,.11,.26,16,c],[.24,-.13,12,.11,.26,16,c],[-.09,-.09,30,.18,.18,1,K],[-.25,-.16,0,.5,.32,3,Wd],...rings()];
  case 'robe':return[[-.27,-.17,0,.54,.34,5,c],[-.24,-.15,5,.48,.3,27,c],[-.25,-.16,14,.5,.32,3,Gd],[-.34,-.12,16,.1,.24,14,c],[.24,-.12,16,.1,.24,14,c],[-.08,-.08,32,.16,.16,1,K],[-.03,.15,0,.06,.02,14,Gd]];
  case 'pav':return[[-.3,-.06,0,.6,.12,40,c],[-.04,.06,3,.08,.03,34,Gd],[-.31,-.07,0,.62,.14,2.5,Gd],[-.31,-.07,37.5,.62,.14,2.5,Gd],[-.1,.06,16,.2,.03,8,Gd],[-.2,.06,30,.4,.02,3,'#f4f0e0']];
  case 'buck':return[[-.1,-.05,0,.2,.1,4,c],[-.2,-.05,4,.4,.1,4,c],[-.26,-.05,8,.52,.1,16,c],[-.2,-.05,24,.4,.1,4,c],[-.1,-.05,28,.2,.1,4,c],[-.08,.05,11,.16,.06,10,Gd],[-.27,.05,15,.54,.02,2,Wd]];
  default:return[[-.06,-.06,0,.12,.12,5,c],[-.14,-.06,5,.28,.12,6,c],[-.22,-.06,11,.44,.12,6,c],[-.28,-.06,17,.56,.12,7,c],[-.32,-.06,24,.64,.12,14,c],[-.04,.06,4,.08,.03,32,Gd],[-.24,.06,26,.48,.03,4,Gd],[-.33,-.07,37,.66,.14,2,Gd]]}}
// modellino di un oggetto a terra: il modello dell'icona, rimpicciolito (in cache per tipo e rarità)
const DRC=new Map();function dropL(it){const ty=itype(it),r=Math.max(0,Math.min(4,it.r|0)),k=ty+r;let L=DRC.get(k);if(!L){L=scl(iconModel(ty,RC[r]),.42);DRC.set(k,L)}return L}
function icon(it){const ty=itype(it),r=Math.max(0,Math.min(4,it.r|0)),k=ty+r;if(ICO[k])return ICO[k];
  const big=document.createElement('canvas');big.width=big.height=256;const og=g,bg=big.getContext('2d');g=bg;g.setTransform(2.4,0,0,2.4,128,200);
  try{drawL(iconModel(ty,RC[r]),0,0,0)}finally{g=og}
  const d=bg.getImageData(0,0,256,256).data;let x0=256,y0=256,x1=-1,y1=-1;
  for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(d[(y*256+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return ICO[k]='';
  const out=document.createElement('canvas');out.width=out.height=96;const o=out.getContext('2d'),bw=x1-x0+1,bh=y1-y0+1,sc=Math.min(80/bw,80/bh);
  o.shadowColor='rgba(0,0,0,.55)';o.shadowBlur=4;o.shadowOffsetY=2;o.drawImage(big,x0,y0,bw,bh,48-bw*sc/2,48-bh*sc/2,bw*sc,bh*sc);
  return ICO[k]=out.toDataURL()}
