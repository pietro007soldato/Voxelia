/* ================= menu animato: paesaggio voxel periodico che scorre in loop ================= */
function mtile(x,y){const a=((x%24)+24)%24,b=((y%24)+24)%24,h=hh(a,b);
  if(Math.abs(b-12-4*Math.sin(a/24*6.283))<1.4){box(x,y,-9,1,1,6,'#3b86d6',.9+Math.sin(mt0*2+x+y)*.08);return}
  box(x,y,-6,1,1,6,(x+y)&1?'#4f8a3c':'#478034',.92+h*.16);
  if(h>.9){box(x+.35,y+.35,0,.3,.3,14,'#6b4a2b');box(x+.05,y+.05,12,.9,.9,12,'#2f6b2a',.85+h*.3);box(x+.25,y+.25,24,.5,.5,8,'#2f6b2a',1.1)}
  else if(h>.86)box(x+.1,y+.1,0,.8,.8,6+h*8,'#8d8f99');
  else if(h>.84&&a%6===0){box(x+.1,y+.1,0,.8,.8,20,'#d8c8a8');box(x+.06,y+.06,20,.88,.88,6,'#a8402f')}}
// ritratto dell'eroe nel menu
function menuPort(){const c=$('mport');if(c)paintHero(c,APM,{c:-1,h:APM.hh?-1:-1,w:1,wv:20,s:-1},0,0)}
let MINT=0;
function drawMenu(dt){mt0+=dt;MINT+=dt;g.setTransform(DPR,0,0,DPR,0,0);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#1d2b5a');gr.addColorStop(.55,'#e0875a');gr.addColorStop(1,'#f5c27a');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.fillStyle='#ffd98a';g.fillRect(W*.78,H*.1,70,70);g.fillStyle='rgba(255,240,230,.55)';
  for(let i=0;i<7;i++){const x=(((i*290-mt0*22)%(W+400))+W+400)%(W+400)-200,y=H*.06+(i*53%140);g.fillRect(x,y,120,16);g.fillRect(x+20,y-12,70,14);g.fillRect(x+40,y+16,80,10)}
  const sc=1.1+Math.max(0,1-MINT/2.4)**2*1.3,Rw=W/2/sc+80,oy=H*.62,cx=mt0*1.2,cy=-mt0*1.2,camx=PX(cx,cy);g.setTransform(sc*DPR,0,0,sc*DPR,(W/2-camx*sc)*DPR,oy*DPR);
  const d0=Math.floor(-(oy/sc+90)/16),d1=Math.ceil(((H-oy)/sc+60)/16);
  for(let d=d0;d<=d1;d++){const a=Math.floor((camx-Rw)/64+d/2),b=Math.ceil((camx+Rw)/64+d/2);for(let x=a;x<=b;x++)mtile(x,d-x)}
  const hx=cx+2,hy=cy-2,bob=Math.abs(Math.sin(mt0*9))*2;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(PX(hx,hy),PY(hx,hy,0),15,7,0,0,6.3);g.fill();
  drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),hx,hy,bob,0,5);
  const dx=hx-1.6,dy=hy+1.6,b2=Math.abs(Math.sin(mt0*9+1))*2;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(PX(dx,dy),PY(dx,dy,0),15,7,0,0,6.3);g.fill();drawL(body(4,3,3,30,2,0),dx,dy,b2);
  g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(255,140,60,.12)';g.fillRect(0,0,W,H);
  // apertura: dal nero, con la camera che si allontana
  drawMenuFx();if(MINT<1.6){g.fillStyle=`rgba(0,0,0,${(1-MINT/1.6)**1.5})`;g.fillRect(0,0,W,H)}}

/* ================= 6.8: musiche scritte — temi, basso, accordi, batteria e riverbero ================= */
// Ogni brano scritto ha delle parti (A, B) e un ordine (form). Melodia: "grado:durata" separati da spazi;
// grado nella scala del brano (0 = tonica, 7 = ottava sopra), con # o b per alterarlo; durata in sedicesimi; r = pausa.
function auFx(){const ac=AU.ac;if(!ac||AU.rv)return;try{const len=ac.sampleRate*2.6|0,ir=ac.createBuffer(2,len,ac.sampleRate);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
  const cv=ac.createConvolver();cv.buffer=ir;const w=ac.createGain();w.gain.value=.3;AU.rvIn=ac.createGain();AU.rvIn.connect(cv);cv.connect(w);w.connect(AU.fd);AU.rv=cv}catch(e){AU.rv=1}}
const INS={flute:{w:'sine',w2:'triangle',v2:.35,a:.05,s:.75,vib:1,r:.12},pluck:{w:'triangle',w2:'sine',m2:2,v2:.25,a:.004,s:0,dec:.42},
  brass:{w:'sawtooth',w2:'sawtooth',det:9,v2:.6,a:.04,s:.7,lp:1700,le:1,r:.1},chip:{w:'square',a:.005,s:.55,lp:3200,r:.05},
  bell:{w:'sine',w2:'sine',m2:3.01,v2:.3,a:.003,s:0,dec:1.4},reed:{w:'square',w2:'sawtooth',v2:.4,a:.03,s:.7,lp:1500,vib:1,r:.08},
  str:{w:'sawtooth',w2:'sawtooth',det:-10,v2:.7,a:.28,s:.85,lp:1100,r:.5},bass:{w:'triangle',w2:'sine',m2:.5,v2:.7,a:.008,s:.6,lp:800,r:.06},
  pad:{w:'triangle',w2:'sine',m2:2,v2:.3,a:.45,s:.9,r:.8}};
const SGV=.52;function ins(m,t0,d,k,v,rv){v*=SGV;const I=INS[k]||INS.pluck,ac=AU.ac,f=440*Math.pow(2,(m-69)/12),gn=ac.createGain();let dst=gn;
  if(I.lp){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=.8;lp.frequency.setValueAtTime(I.lp*(I.le?2:1),t0);if(I.le)lp.frequency.exponentialRampToValueAtTime(I.lp*.7,t0+Math.min(.5,Math.max(.05,d)));lp.connect(gn);dst=lp}
  const os=[],o=ac.createOscillator();o.type=I.w;o.frequency.setValueAtTime(f,t0);o.connect(dst);os.push(o);
  if(I.w2){const o2=ac.createOscillator(),g2=ac.createGain();o2.type=I.w2;o2.frequency.setValueAtTime(f*(I.m2||1),t0);if(I.det)o2.detune.setValueAtTime(I.det,t0);g2.gain.value=I.v2||.5;o2.connect(g2);g2.connect(dst);os.push(o2)}
  if(I.vib&&d>.3){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=5.3;lg.gain.setValueAtTime(0,t0);lg.gain.linearRampToValueAtTime(f*.006,t0+.3);l.connect(lg);for(const q of os)lg.connect(q.frequency);os.push(l)}
  const a=I.a||.01;gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+a);let end;
  if(I.s===0){end=t0+Math.max(a+.03,Math.min(I.dec||.4,d*2.5));gn.gain.exponentialRampToValueAtTime(.0001,end)}
  else{const sus=Math.max(t0+a+.01,t0+d);gn.gain.setTargetAtTime(v*I.s,t0+a,.09);gn.gain.setValueAtTime(v*I.s,sus);end=sus+(I.r||.08);gn.gain.exponentialRampToValueAtTime(.0001,end)}
  gn.connect(AU.fd);if(rv&&AU.rvIn)gn.connect(AU.rvIn);for(const q of os){q.start(t0);q.stop(end+.05)}}
function drm(c,t0,v){v*=SGV;const ac=AU.ac;switch(c){
  case 'x':case 'k':kick(t0,.21*v);break;
  case 's':{nz(t0,.13,.1*v,1900,'bandpass');const o=ac.createOscillator(),g2=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(200,t0);o.frequency.exponentialRampToValueAtTime(120,t0+.08);g2.gain.setValueAtTime(.07*v,t0);g2.gain.exponentialRampToValueAtTime(.0001,t0+.1);o.connect(g2);g2.connect(AU.fd);o.start(t0);o.stop(t0+.12);break}
  case 'h':nz(t0,.028,.03*v,8500,'highpass');break;case 'o':nz(t0,.16,.026*v,7000,'highpass');break;case 'r':nz(t0,.05,.032*v,5500,'bandpass');break;
  case 't':{const o=ac.createOscillator(),g2=ac.createGain();o.type='sine';o.frequency.setValueAtTime(150,t0);o.frequency.exponentialRampToValueAtTime(80,t0+.18);g2.gain.setValueAtTime(.12*v,t0);g2.gain.exponentialRampToValueAtTime(.0001,t0+.22);o.connect(g2);g2.connect(AU.fd);o.start(t0);o.stop(t0+.25);break}
  case 'T':{const o=ac.createOscillator(),g2=ac.createGain();o.type='sine';o.frequency.setValueAtTime(82,t0);o.frequency.exponentialRampToValueAtTime(60,t0+.6);g2.gain.setValueAtTime(.2*v,t0);g2.gain.exponentialRampToValueAtTime(.0001,t0+.8);o.connect(g2);g2.connect(AU.fd);if(AU.rvIn)g2.connect(AU.rvIn);o.start(t0);o.stop(t0+.85);nz(t0,.08,.04*v,400,'lowpass');break}
  case 'c':for(let i=0;i<3;i++)nz(t0+i*.011,.05,.05*v,1500,'bandpass');break
  // 7.10: suoni nuovi per le musiche degli edifici
  case 'a':{for(const[f,g0]of[[1180,.05],[1760,.034],[2650,.02]]){const o=ac.createOscillator(),g2=ac.createGain();o.type='sine';o.frequency.setValueAtTime(f,t0);g2.gain.setValueAtTime(g0*v,t0);g2.gain.exponentialRampToValueAtTime(.0001,t0+.35);o.connect(g2);g2.connect(AU.fd);if(AU.rvIn)g2.connect(AU.rvIn);o.start(t0);o.stop(t0+.4)}nz(t0,.02,.05*v,6000,'highpass');break}
  case 'w':{const o=ac.createOscillator(),g2=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(1250,t0);g2.gain.setValueAtTime(.09*v,t0);g2.gain.exponentialRampToValueAtTime(.0001,t0+.07);o.connect(g2);g2.connect(AU.fd);o.start(t0);o.stop(t0+.09);break}
  case 'n':{const s2=ac.createBufferSource(),fl=ac.createBiquadFilter(),g2=ac.createGain();s2.buffer=AU.nb;fl.type='bandpass';fl.Q.value=3;fl.frequency.setValueAtTime(900,t0);fl.frequency.linearRampToValueAtTime(2200,t0+.22);fl.frequency.linearRampToValueAtTime(900,t0+.44);
    g2.gain.setValueAtTime(0,t0);g2.gain.linearRampToValueAtTime(.05*v,t0+.05);g2.gain.linearRampToValueAtTime(.0001,t0+.45);s2.connect(fl);fl.connect(g2);g2.connect(AU.fd);s2.start(t0,Math.random()*.03);s2.stop(t0+.46);break}
  case 'W':{const s2=ac.createBufferSource(),fl=ac.createBiquadFilter(),g2=ac.createGain();s2.buffer=AU.nb;s2.loop=true;fl.type='lowpass';fl.frequency.setValueAtTime(500,t0);fl.frequency.linearRampToValueAtTime(900,t0+1.2);fl.frequency.linearRampToValueAtTime(400,t0+2.4);
    g2.gain.setValueAtTime(0,t0);g2.gain.linearRampToValueAtTime(.045*v,t0+1.1);g2.gain.linearRampToValueAtTime(.0001,t0+2.6);s2.connect(fl);fl.connect(g2);g2.connect(AU.fd);if(AU.rvIn)g2.connect(AU.rvIn);s2.start(t0);s2.stop(t0+2.7);break}}}
const BASS={root:'r.......r.......',long:'r...............',pulse:'r.r.r.r.r.r.r.r.',pulse8:'r.r.o.r.r.r.o.r.',walk:'r...3...5...a...',ostinato:'r..r..5.r..r..3.',gallop:'r..r..r.r..r..r.',waltz:'r...........',shanty:'r.....5.....'};
const DRUMS={none:{},soft:{k:'x.......x.......',r:'..r...r...r...r.'},folk:{k:'x.......x.......',s:'....s.......s...',r:'..r...r...r...r.'},light:{k:'x.......x.......',r:'..r...r...r..rr.'},
  tribal:{k:'x.....x...x.....',t:'...t.....t..t.t.',r:'r.r.r.r.r.r.r.r.'},heart:{k:'x..x............'},rock:{k:'x.....x.x.......',s:'....s.......s...',h:'h.h.h.h.h.h.h.h.'},
  march:{T:'T.......T.......',s:'....s.s.....s...'},timp:{T:'T...........T.T.'},shanty:{k:'x.....x.....',s:'...s.....s..',r:'r.rr.rr.rr.r'},waltz:{k:'x...........',r:'....r...r...'}};
const COMP={strum:'....x.......x...',strum6:'x..x..x..x..',waltz:'....x...x...',stab:'..x...x...x..x..'};
function songPrep(T){if(T.ev)return;T.ev={};const spb=T.spb||16;for(const pk in T.parts){const p=T.parts[pk],n=p.ch.length*spb,ev=new Array(n);let pos=0;
    for(const tk of p.m.trim().split(/\s+/)){const[a,b]=tk.split(':'),l=+(b||2);if(a!=='r'&&pos<n){let s=a,acc=0;if(s.endsWith('#')){acc=1;s=s.slice(0,-1)}else if(s.endsWith('b')){acc=-1;s=s.slice(0,-1)}ev[pos]=[+s,l,acc]}pos+=l}
    T.ev[pk]=ev;T.chk=(T.chk||[]).concat([pk+':'+pos+'/'+n])}
  T.bars=[];for(const pk of T.form)for(let i=0;i<T.parts[pk].ch.length;i++)T.bars.push([pk,i])}
function songStep(T,s,b,t0,dt,spb){songPrep(T);auFx();const[pk,bi]=T.bars[b%T.bars.length],p=T.parts[pk],deg=p.ch[bi],nx=T.parts[T.bars[(b+1)%T.bars.length][0]].ch[T.bars[(b+1)%T.bars.length][1]],
    sc=SCL[T.sc],mid=k=>T.root+sc[((k%7)+7)%7]+12*Math.floor(k/7),cn=i=>mid(deg+i*2),lv=T.lv||.05,bo=T.root>=57?-24:-12;
  const e=T.ev[pk][bi*spb+s];if(e){const m=mid(e[0])+e[2];ins(m,t0,dt*e[1]*.94,T.ld,lv,1);if(T.echo)ins(m,t0+dt*3,dt*e[1]*.8,T.ld,lv*.26,1)}
  const bp=BASS[T.bs||'root'],bc=bp[s%bp.length];if(bc&&bc!=='.'){let l=1;while(s+l<spb&&bp[(s+l)%bp.length]==='.')l++;
    const r=cn(0)+bo,n=bc==='3'?cn(1)+bo:bc==='5'?cn(2)+bo:bc==='o'?r+12:bc==='a'?mid(nx)+bo-1:r;ins(n,t0,dt*l*.9,'bass',T.bv||.09,0)}
  const cp=new Set((T.cp||'').split(' '));if(cp.has('pad')&&s===0)for(let i=0;i<3;i++)ins(cn(i),t0,dt*spb*.98,'pad',.016,1);
  if(cp.has('ens')&&s===0)for(let i=0;i<3;i++)ins(cn(i),t0,dt*spb*.98,'str',.012,1);
  if(cp.has('arp')&&s%2===0)ins(cn((s>>1)%3)+12,t0,dt*2,'pluck',.022,1);
  if(cp.has('bell')&&s%4===0)ins(cn((s>>2)%3)+24,t0,dt*4,'bell',.014,1);
  if(cp.has('drone')&&s===0){ins(T.root-12,t0,dt*spb,'reed',.008,1);ins(T.root-5,t0,dt*spb,'reed',.006,1)}
  for(const ck of['strum','strum6','waltz','stab'])if(cp.has(ck)&&COMP[ck][s]==='x')for(let i=0;i<3;i++)ins(cn(i)+(ck==='stab'?0:12),t0+i*.012,ck==='stab'?dt*1.2:dt*2.4,ck==='stab'?'brass':'pluck',ck==='stab'?.013:.02,1);
  const D=DRUMS[T.dr||'none'];for(const c in D){const ch=D[c][s%D[c].length];if(ch&&ch!=='.')drm(ch,t0,T.dv||1)}
  if(T.fill&&b%4===3&&s>=12)drm('s',t0,.8)}
// i brani
Object.assign(TRK,{
  menu:{sng:1,bpm:96,root:60,sc:'maj',ld:'brass',lv:.042,echo:1,bs:'pulse8',cp:'pad arp',dr:'soft',form:'AABA',parts:{
    A:{ch:[0,4,5,3],m:'0:2 2:2 4:4 7:4 6:2 4:2  6:4 4:2 1:2 4:6 r:2  5:2 4:2 5:2 7:2 9:4 7:4  7:4 8:2 7:2 5:8'},
    B:{ch:[5,3,0,4],m:'9:6 8:2 7:4 5:4  7:6 5:2 3:4 5:4  4:2 5:2 7:4 4:2 2:2 0:4  1:4 2:2 4:2 6:4 4:4'}}},
  intro:{sng:1,bpm:74,root:57,sc:'min',ld:'brass',lv:.04,echo:1,bs:'long',cp:'ens pad',dr:'timp',form:'AABB',parts:{
    A:{ch:[0,5,3,4],m:'4:8 3:4 2:4  5:8 4:4 2:4  3:4 5:4 7:8  6:12 r:4'},
    B:{ch:[2,6,0,4],m:'6:8 4:4 2:4  8:8 6:4 5:4  7:4 9:4 11:8  8:8 6#:8'}}},
  town:{sng:1,bpm:116,root:62,sc:'maj',ld:'flute',lv:.05,bs:'walk',cp:'strum',dr:'folk',form:'AABA',parts:{
    A:{ch:[0,3,0,4],m:'4:2 4:1 5:1 4:2 2:2 0:4 2:2 4:2  5:2 5:1 6:1 7:4 5:2 3:6  4:2 7:2 6:2 4:2 2:2 4:2 2:2 1:2  1:4 4:2 6:2 4:6 r:2'},
    B:{ch:[5,3,4,0],m:'9:2 9:1 8:1 7:2 5:2 7:4 5:4  8:2 8:1 7:1 5:2 3:2 5:4 3:4  6:2 7:2 8:2 6:2 4:4 1:4  2:2 4:2 7:4 0:6 r:2'}}},
  notte:{sng:1,bpm:70,root:60,sc:'maj',ld:'bell',lv:.08,echo:1,bs:'long',bv:.09,cp:'arp',dr:'none',form:'AB',parts:{
    A:{ch:[0,5,3,4],m:'4:8 2:4 4:4  5:6 4:2 2:8  3:4 5:4 7:8  6:8 4:8'},
    B:{ch:[3,0,1,4],m:'7:6 5:2 3:8  4:4 2:4 0:8  1:4 3:4 5:8  4:12 r:4'}}},
  forest:{sng:1,bpm:104,root:62,sc:'dor',ld:'flute',lv:.048,echo:1,bs:'pulse',cp:'arp',dr:'light',form:'AABA',parts:{
    A:{ch:[0,6,3,0],m:'0:2 2:2 4:2 7:6 6:2 4:2  6:4 4:2 6:2 8:8  7:2 6:2 5:2 3:2 5:4 7:4  4:2 2:2 1:2 2:2 0:8'},
    B:{ch:[2,6,3,4],m:'9:4 7:2 6:2 4:8  8:4 6:2 4:2 6:8  7:2 9:2 10:4 7:4 5:4  8:6 6:2 4:8'}}},
  desert:{sng:1,bpm:96,root:64,sc:'phr',ld:'reed',lv:.04,echo:1,bs:'pulse',cp:'drone',dr:'tribal',form:'AABA',parts:{
    A:{ch:[0,1,0,6],m:'0:2 1:2 2:4 1:2 0:2 r:2 4:2  3:2 2:2 1:4 2:2 3:2 4:4  4:3 5:1 4:2 2:2 1:2 0:6  6:4 5:2 4:2 1:4 0:4'},
    B:{ch:[5,4,1,0],m:'7:4 8:2 7:2 5:4 4:4  4:4 5:2 4:2 2:4 1:4  3:2 4:2 5:2 4:2 3:4 1:4  2:4 1:4 0:8'}}},
  peaks:{sng:1,bpm:76,root:57,sc:'min',ld:'flute',lv:.045,echo:1,bs:'long',bv:.07,cp:'pad bell',dr:'none',form:'AB',parts:{
    A:{ch:[0,5,2,6],m:'4:6 2:2 0:8  9:6 7:2 5:8  6:4 4:4 2:8  8:4 10:4 8:8'},
    B:{ch:[3,0,5,4],m:'7:4 5:4 3:8  4:4 2:4 0:8  9:4 7:2 5:2 7:8  8:8 6:8'}}},
  inter:{sng:1,bpm:132,root:60,sc:'maj',spb:12,ld:'reed',lv:.04,bs:'waltz',cp:'waltz',dr:'waltz',form:'AABA',parts:{
    A:{ch:[0,4,4,0],m:'4:6 2:2 4:2 7:2  6:6 4:6  1:2 4:2 6:2 8:6  7:6 r:2 4:4'},
    B:{ch:[3,0,4,0],m:'5:4 7:2 5:2 3:4  4:6 2:2 0:4  1:4 4:2 6:2 4:4  0:12'}}},
  castello:{sng:1,bpm:88,root:58,sc:'maj',ld:'brass',lv:.04,echo:1,bs:'root',cp:'ens',dr:'march',dv:.8,form:'AABA',parts:{
    A:{ch:[0,3,4,0],m:'0:4 4:4 7:6 4:2  8:4 7:2 5:2 3:8  4:4 6:2 8:2 11:6 r:2  7:12 r:4'},
    B:{ch:[5,3,1,4],m:'9:6 7:2 5:8  7:6 5:2 3:8  5:4 3:2 1:2 3:8  4:4 6:4 8:8'}}},
  dungeon:{sng:1,bpm:84,root:57,sc:'hm',ld:'str',lv:.05,echo:1,bs:'ostinato',bv:.08,cp:'pad',dr:'heart',form:'AB',parts:{
    A:{ch:[0,0,5,4],m:'4:8 3:4 2:4  1:8 2:4 0:4  5:8 4:4 2:4  4:12 r:4'},
    B:{ch:[3,3,5,4],m:'7:8 5:4 3:4  6:8 5:4 3:4  5:4 7:4 9:8  6:8 4:8'}}},
  boss:{sng:1,bpm:152,root:57,sc:'hm',ld:'brass',lv:.04,bs:'gallop',bv:.1,cp:'stab',dr:'rock',fill:1,form:'AABB',parts:{
    A:{ch:[0,5,3,4],m:'0:2 0:2 4:2 0:2 7:4 6:4  5:2 5:2 9:2 5:2 7:4 8:4  3:2 3:2 7:2 3:2 5:4 4:4  6:4 4:4 6:2 7:2 8:4'},
    B:{ch:[3,4,5,4],m:'10:4 9:4 7:4 5:4  8:4 6:4 4:4 6:4  9:2 8:2 7:2 9:2 12:8  11:4 8:4 6:8'}}},
  arena:{sng:1,bpm:140,root:55,sc:'hm',ld:'chip',lv:.03,bs:'pulse8',cp:'stab',dr:'rock',fill:1,form:'AABA',parts:{
    A:{ch:[0,3,4,0],m:'7:2 4:2 7:2 8:2 9:4 7:4  10:2 7:2 5:2 3:2 5:8  6:2 8:2 11:4 8:2 6:2 4:4  7:8 r:8'},
    B:{ch:[5,3,4,4],m:'9:4 7:4 5:4 7:4  10:4 8:4 7:8  11:2 10:2 8:2 6:2 8:8  4:4 6:4 8:4 11:4'}}},
  naval:{sng:1,bpm:126,root:62,sc:'dor',spb:12,ld:'reed',lv:.045,bs:'shanty',cp:'strum6',dr:'shanty',form:'AABA',parts:{
    A:{ch:[0,6,0,4],m:'4:2 4:1 4:2 4:1 4:2 2:1 0:3  6:2 6:1 6:2 6:1 6:2 4:1 3:3  4:2 4:1 4:2 4:1 4:2 5:1 7:3  6:2 4:1 1:3 0:6'},
    B:{ch:[3,0,6,0],m:'7:3 5:3 3:3 5:3  4:3 2:3 0:6  6:3 8:3 10:3 8:3  7:3 4:3 0:6'}}}});

/* ================= 6.8: menu fluido — il paesaggio (che si ripete ogni 24 caselle) si disegna una volta e scorre ================= */
let MSTR=null,MPX=0,MPY=0,MPXt=0,MPYt=0;
addEventListener('pointermove',e=>{if(!inMenu)return;MPXt=(e.clientX/Math.max(1,W)-.5)*2;MPYt=(e.clientY/Math.max(1,H)-.5)*2},{passive:true});
function tilesRect(x0,x1,y0,y1){const d0=Math.floor((y0-60)/16),d1=Math.ceil((y1+90)/16);for(let d=d0;d<=d1;d++){const a=Math.floor((x0-96)/64+d/2),b=Math.ceil((x1+96)/64+d/2);for(let x=a;x<=b;x++)mtile(x,d-x)}}
function menuStrip(sc){const key=W+'x'+H+'@'+sc.toFixed(3)+'/'+DPR;if(MSTR&&MSTR.key===key)return MSTR;
  const per=1536,oy=H*.62,y0=-(oy/sc)-140,hw=H/sc+300,c=document.createElement('canvas');c.width=Math.ceil(per*sc*DPR);c.height=Math.ceil(hw*sc*DPR);
  const g0=g;g=c.getContext('2d');try{g.setTransform(sc*DPR,0,0,sc*DPR,0,-y0*sc*DPR);tilesRect(0,per,y0,y0+hw)}finally{g=g0}
  MSTR={key,c,per,y0,hw,sc};return MSTR}
const MSKY=[['#1d2b5a','#e0875a','#f5c27a'],['#16204a','#c06a6a','#f0a87a'],['#101838','#6a4a7a','#c08a7a'],['#1d2b5a','#e0875a','#f5c27a']];
function lerpC(a,b,k){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')'}
function drawMenu(dt){if(!(dt>=0&&dt<1))dt=1/60;if(!isFinite(mt0))mt0=0;if(!isFinite(MINT))MINT=3;mt0+=dt;MINT+=dt;MPX+=(MPXt-MPX)*Math.min(1,dt*3);MPY+=(MPYt-MPY)*Math.min(1,dt*3);g.setTransform(DPR,0,0,DPR,0,0);
  // cielo che cambia lentamente dal tramonto al crepuscolo e ritorno (un giro ogni 90 secondi)
  const cyc=((mt0/30)%3+3)%3,i0=Math.min(2,Math.floor(cyc)),k=cyc-i0,s0=MSKY[i0],s1=MSKY[i0+1],sm=k*k*(3-2*k);
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,lerpC(s0[0],s1[0],sm));gr.addColorStop(.55,lerpC(s0[1],s1[1],sm));gr.addColorStop(1,lerpC(s0[2],s1[2],sm));g.fillStyle=gr;g.fillRect(0,0,W,H);
  const dusk=i0===1?sm:i0===2?1-sm:0;if(dusk>.05){for(let i=0;i<60;i++){const x=(i*173.3)%W,y=(i*97.7)%(H*.4),a=dusk*(.35+.35*Math.sin(mt0*2+i));g.fillStyle=`rgba(255,255,240,${a})`;g.fillRect(x,y,1.5,1.5)}}
  const sx=W*.78-MPX*10,sy=H*.1-MPY*6+dusk*H*.08;g.fillStyle=`rgba(255,217,138,${.18})`;g.beginPath();g.arc(sx+35,sy+35,70,0,6.3);g.fill();g.fillStyle='#ffd98a';g.fillRect(sx,sy,70,70);
  g.fillStyle='rgba(255,240,230,.55)';for(let i=0;i<7;i++){const x=(((i*290-mt0*22-MPX*18)%(W+400))+W+400)%(W+400)-200,y=H*.06+(i*53%140)-MPY*8;g.fillRect(x,y,120,16);g.fillRect(x+20,y-12,70,14);g.fillRect(x+40,y+16,80,10)}
  const zoom=Math.max(0,1-MINT/2.4),sc=1.1+zoom*zoom*1.3,oy=H*.62-MPY*14,cx=mt0*1.2,cy=-mt0*1.2,camx=PX(cx,cy)+MPX*26;
  if(zoom>0){const Rw=W/2/sc+80;g.setTransform(sc*DPR,0,0,sc*DPR,(W/2-camx*sc)*DPR,oy*DPR);tilesRect(camx-Rw,camx+Rw,-(oy/sc)-30,(H-oy)/sc+10);if(MINT>1.1)menuStrip(1.1)}
  else{const S2=menuStrip(sc);g.setTransform(DPR,0,0,DPR,0,0);const k0=Math.floor((camx-W/2/sc)/S2.per)-1;
    for(let q=k0;q<k0+4;q++){const x=(q*S2.per-camx)*sc+W/2;if(x>W||x+S2.per*sc<0)continue;g.drawImage(S2.c,x,oy+S2.y0*sc,S2.per*sc,S2.hw*sc)}
    g.setTransform(sc*DPR,0,0,sc*DPR,(W/2-camx*sc)*DPR,oy*DPR)}
  const hx=cx+2,hy=cy-2,bob=Math.abs(Math.sin(mt0*9))*2;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(PX(hx,hy),PY(hx,hy,0),15,7,0,0,6.3);g.fill();
  drawHero(walkLegs(heroL(APM,1,APM.hh?2:-1,1,20,0,0),mt0*10),hx,hy,bob,0,5);
  const dx=hx-1.6,dy=hy+1.6,b2=Math.abs(Math.sin(mt0*9+1))*2;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(PX(dx,dy),PY(dx,dy,0),15,7,0,0,6.3);g.fill();drawL(body(4,3,3,30,2,0),dx,dy,b2);
  g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=`rgba(255,140,60,${.12-dusk*.06})`;g.fillRect(0,0,W,H);if(dusk>.05){g.fillStyle=`rgba(20,20,60,${dusk*.18})`;g.fillRect(0,0,W,H)}
  drawMenuFx();if(MINT<1.6){g.fillStyle=`rgba(0,0,0,${(1-MINT/1.6)**1.5})`;g.fillRect(0,0,W,H)}}
// transizioni tra le schermate del menu e titolo a lettere animate
const RMO=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function menuAnim(el){if(!el||RMO||!el.animate)return;el.animate([{opacity:0,transform:'translateY(18px) scale(.985)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
  [...el.querySelectorAll('.mode,.mpan,.dcard,.mbtn,.mback')].forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:480,delay:60+i*55,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}))}
(function(){const h=document.querySelector('.mhead h1');if(h&&!h.dataset.sp){h.dataset.sp=1;const sup=h.querySelector('sup'),tx=h.firstChild&&h.firstChild.nodeType===3?h.firstChild.nodeValue:'';
  if(tx){h.firstChild.remove();const w=document.createElement('span');w.className='mtl';w.innerHTML=[...tx].map((c,i)=>`<i style="--i:${i}">${c}</i>`).join('');h.insertBefore(w,sup)}}
  document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('#menu button');if(!b||RMO)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';
    s.style.left=(e.clientX-r.left)+'px';s.style.top=(e.clientY-r.top)+'px';b.appendChild(s);setTimeout(()=>s.remove(),650)});
  const st=document.createElement('style');st.textContent=`
.mpan,.mfoot{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:linear-gradient(160deg,rgba(14,18,38,.93),rgba(8,10,24,.9))!important}
#menu [hidden]{display:none!important}
#mstory .dcard,#mdim .dcard{animation:none!important}
#menu button{position:relative;overflow:hidden}
.rip{position:absolute;width:12px;height:12px;margin:-6px;border-radius:50%;background:rgba(255,220,150,.45);pointer-events:none;animation:rip .65s ease-out forwards}
@keyframes rip{to{transform:scale(28);opacity:0}}
.mtl i{display:inline-block;font-style:normal;animation:mlet 3.6s calc(var(--i)*.12s + 1.4s) ease-in-out infinite}
@keyframes mlet{0%,70%,100%{transform:none}80%{transform:translateY(-6px) rotate(-2deg)}90%{transform:translateY(1px)}}
.mode{transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,border-color .25s,background .25s!important}
.mode:hover{transform:translateY(-5px) scale(1.015);box-shadow:0 14px 30px #000a,0 0 0 1px #f5b94299,0 0 24px #f5b94233}
.mode::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,240,200,.18),transparent);transform:skewX(-18deg);transition:left .7s}
.mode:hover::after{left:130%}
.mode b{display:inline-block;transition:transform .25s}.mode:hover b{transform:translateX(4px)}
.dcard,.mbtn{transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s,background .22s!important}
.dcard:hover img,.mbtn:hover img{animation:mbob .8s ease-in-out infinite}
@keyframes mbob{50%{transform:translateY(-3px) rotate(-6deg)}}
#menu button:active{transform:scale(.97)!important}
@media(prefers-reduced-motion:reduce){.mtl i,.dcard:hover img,.mbtn:hover img{animation:none}.mode::after{display:none}}`;document.head.appendChild(st)})();

/* ================= 6.8: prologo — undici scene, dissolvenze incrociate, camera morbida ================= */
const ISC2=[
  {d:7.5,f:'found',tx:'Mille anni fa, Aldric il Primo fondò Aldoria sulle rive del mare, dove la pietra incontra la luce.'},
  {d:7.5,f:'crown',tx:'Per tenere unito il regno forgiò la Corona di Voxel: sei gemme, sei terre, un solo cuore.'},
  {d:8.5,f:'eye',tx:'Ma sotto le strade della città qualcosa dormiva. Aldric il Primo lo chiuse nella pietra, e giurò che nessuno dei suoi eredi lo avrebbe mai svegliato.'},
  {d:7.5,f:'peace',tx:'Per secoli Aldoria prosperò. I mercati erano pieni, le campane suonavano, e i figli del re crescevano insieme.'},
  {d:8,f:'malakar',tx:'Ma Malakar, fratello del Re Aldric, bramava quel potere. Studiò le arti proibite, e divenne il Re Lich.'},
  {d:8,f:'fog',tx:'Una notte la nebbia salì da sotto Aldoria Vecchia. Fuoco. Urla. Poi, il silenzio.'},
  {d:7.5,f:'shatter',tx:'In quella stessa notte Malakar infranse la Corona. Sei frammenti volarono lontano, nei luoghi più oscuri del regno.'},
  {d:8.5,f:'lords',tx:'La Tana dei Goblin, la Cripta Dimenticata, la Piramide di Khem, le Caverne di Cristallo, la Fucina Infernale, l\'Abisso Sommerso: ogni frammento è custodito da un signore terribile.'},
  {d:7.5,f:'void',tx:'Dalla sua Cittadella del Vuoto, Malakar attende che il regno cada nell\'ombra. E i dungeon rinascono, più forti, a ogni ciclo.'},
  {d:8,f:'seal',tx:'Il Re fece murare il vecchio quartiere e proibì di parlarne. Ma ad Aldoria i segreti non dormono mai a lungo.'},
  {d:9,f:'hero',tx:'Il Re Aldric cerca un eroe capace di riunire la Corona. Quell\'eroe sei tu.'}];
const IGR={found:['#4a7ad0','#f5d08a'],crown:['#1a1030','#4a2a5a'],eye:['#05040a','#1a0a10'],peace:['#5a90d8','#f8d8a0'],malakar:['#1a0a2a','#5a2a6a'],fog:['#0a0606','#3a1410'],
  shatter:['#0a0612','#3a1a4a'],lords:['#05060c','#1a1430'],void:['#120620','#2a0a3a'],seal:['#2a3048','#7a6a6a'],hero:['#5a8ad0','#f8b878']};
// camera di ogni scena: [cx,cy,zoom] all'inizio e alla fine, con movimento morbido
const ICAM={found:[[-3,3,.8],[1,-1,1.05]],crown:[[0,0,1.25],[0,0,1.05]],eye:[[0,0,.9],[0,0,1]],peace:[[-2,2,1],[1,-1,1.1]],malakar:[[-1,1,.9],[-1,1,1.2]],fog:[[2,-2,1.1],[-1,1,.95]],
  shatter:[[0,0,1],[0,0,.9]],lords:[[1.6,1.6,.85],[1.6,1.6,.95]],void:[[0,0,.95],[0,0,1.1]],seal:[[0,0,1.1],[0,0,1]],hero:[[-3,3,1.15],[1,-1,.95]]};
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,eob=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2)};
let IGC=null,IFD=null;
function introGroundC(sc,cx,cy){const m=Math.max(W,H)*.35|0,key=W+'x'+H+'/'+DPR+'/'+sc.toFixed(2)+'/'+cx.toFixed(1)+','+cy.toFixed(1);
  if(!IGC||IGC.key!==key){const c=IGC&&IGC.c&&IGC.c.width===Math.ceil((W+2*m)*DPR)?IGC.c:document.createElement('canvas');c.width=Math.ceil((W+2*m)*DPR);c.height=Math.ceil((H+2*m)*DPR);
    const g0=g;g=c.getContext('2d');try{g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);const camx=PX(cx,cy),camy=PY(cx,cy,0),ox=W/2+m,oy=H*.6+m;
      g.setTransform(sc*DPR,0,0,sc*DPR,(ox-camx*sc)*DPR,(oy-camy*sc)*DPR);tilesRect(camx-ox/sc,camx+(W+2*m-ox)/sc,camy-oy/sc,camy+(H+2*m-oy)/sc)}finally{g=g0}IGC={key,c,m,sc,cx,cy}}return IGC}
function introGroundD(sc,cx,cy,base){const C=introGroundC(base[2],base[0],base[1]),k=sc/C.sc,dx=sc*(PX(C.cx,C.cy)-PX(cx,cy)),dy=sc*(PY(C.cx,C.cy,0)-PY(cx,cy,0));
  g.setTransform(DPR*k,0,0,DPR*k,DPR*(W/2-k*(W/2+C.m)+dx),DPR*(H*.6-k*(H*.6+C.m)+dy));g.drawImage(C.c,0,0,C.c.width/DPR,C.c.height/DPR)}
function scr2(x,y,z,sc,cx,cy){return[(PX(x,y)-PX(cx,cy))*sc+W/2,(PY(x,y,z)-PY(cx,cy,0))*sc+H*.6]}
function houseV(x,y,w,h,ht,wall,roof,s){if(s<=0)return;const H2=ht*s;box(x,y,0,w,h,H2,wall);box(x-.05,y-.05,H2,w+.1,h+.1,5*s,roof);box(x+w*.4,y+h-.02,0,w*.2,.04,H2*.5,'#4a2a12')}
function villager(x,y,c,ph){drawL(walkA(hum(c,SKIN,1,[4,'#553']),ph),x,y,Math.abs(Math.sin(ph))*1.5)}
function introDraw(dt){const I=INTRO;I.t+=dt;let s=0,a0=0;while(s<ISC2.length&&I.t>a0+ISC2[s].d){a0+=ISC2[s].d;s++}if(s>=ISC2.length){introEnd();return}
  const S=ISC2[s],lt=I.t-a0,D=S.d,u=Math.min(1,lt/D),ue=ease(u),f=S.f,cols=['#7aff7a','#9fd0ff','#ffd060','#b0f0ff','#ff6a2a','#6fffe0'];
  if(I.s!==s){if(I.s!=null&&!RMO){if(!IFD)IFD=document.createElement('canvas');IFD.width=cv.width;IFD.height=cv.height;IFD.getContext('2d').drawImage(cv,0,0);I.fdt=0}I.s=s;const el=$('itx');if(el&&el.animate)el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:700,easing:'ease-out'})}
  const C0=ICAM[f][0],C1=ICAM[f][1],base=Math.min(W,H)/520,cx=C0[0]+(C1[0]-C0[0])*ue,cy=C0[1]+(C1[1]-C0[1])*ue,sc=base*(C0[2]+(C1[2]-C0[2])*ue);
  g.setTransform(DPR,0,0,DPR,0,0);const G=IGR[f],gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,G[0]);gr.addColorStop(1,G[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
  const night=['crown','eye','malakar','fog','shatter','lords','void'].includes(f);if(night)for(let i=0;i<70;i++){const x=(i*173.3+lt*3)%W,y=(i*97.7)%(H*.55);g.fillStyle=`rgba(255,255,240,${.25+.25*Math.sin(lt*2+i)})`;g.fillRect(x,y,1.5,1.5)}
  const gb=[(C0[0]+C1[0])/2,(C0[1]+C1[1])/2,base*Math.min(C0[2],C1[2])];
  if(['found','peace','malakar','fog','seal','hero'].includes(f)){introGroundD(sc,cx,cy,gb);const nt=f==='malakar'?'rgba(40,0,60,.55)':f==='fog'?'rgba(8,8,18,.62)':f==='seal'?'rgba(30,30,50,.25)':'';if(nt){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=nt;g.fillRect(0,0,W,H)}}
  introSc(sc,cx,cy);
  if(f==='found'){const hs2=[[-6,-1,2,2,18,'#e0d0b0','#a8402f'],[-3,3,2,2,16,'#d8c8a0','#3a5a8a'],[3,4,3,2,20,'#c8a878','#7a3a2a'],[5,-1,2,2,18,'#e8d8b0','#2a5a5a'],[-5,4,2,2,16,'#b8c8a0','#6a3a8a'],[1,6,2,2,14,'#f0dcc0','#c8783a']];
    introCastle(0,-3,0);hs2.forEach((h,i)=>houseV(h[0],h[1],h[2],h[3],h[4],h[5],h[6],eob(Math.max(0,Math.min(1,(lt-.6-i*.7)/.9)))));
    const kx=-2+Math.min(1,lt/6)*1.5;fNpc('re',kx,1,faceOf(1,-1),{walk:lt<6})}
  if(f==='crown'){const k=ease(Math.min(1,lt/3.2));for(let i=0;i<6;i++){const a=i*Math.PI/3+lt*.4,r=8*(1-k)+.75,z=60+(1-k)*50*Math.sin(i+1);box(Math.cos(a)*r-.2,Math.sin(a)*r-.2,z,.4,.4,8,cols[i],1.35)}
    if(k>=1){introCrown(0,0,62+Math.sin(lt*2)*3,lt*.8,cols);g.setTransform(DPR,0,0,DPR,0,0);const[x,y]=scr2(0,0,70,sc,cx,cy),p=.5+.5*Math.sin(lt*3),rg=g.createRadialGradient(x,y,4,x,y,160);rg.addColorStop(0,`rgba(255,230,140,${.35+p*.2})`);rg.addColorStop(1,'rgba(255,230,140,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
      g.strokeStyle=`rgba(255,240,180,${.15+p*.1})`;g.lineWidth=2;for(let i=0;i<12;i++){const a=i*Math.PI/6+lt*.3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*320,y+Math.sin(a)*320);g.stroke()}introSc(sc,cx,cy)}}
  if(f==='eye'){g.setTransform(DPR,0,0,DPR,0,0);const gy=H*.38;g.fillStyle='#1a1410';g.fillRect(0,gy,W,H-gy);for(let i=0;i<5;i++){g.fillStyle=`rgba(${40+i*8},${24+i*4},${16+i*3},.6)`;g.fillRect(0,gy+i*(H-gy)/5,W,2)}
    for(let i=0;i<14;i++){const x=W*(.08+i*.065),h=18+(i*37%30);g.fillStyle=i%3?'#2a2a34':'#3a3440';g.fillRect(x,gy-h,W*.05,h);g.fillStyle='#ffd27a';if((i+Math.floor(lt))%4)g.fillRect(x+W*.018,gy-h*.6,4,5)}
    const op=Math.max(0,Math.sin(Math.min(1,lt/D)*Math.PI))*.95,ex=W/2,ey=gy+(H-gy)*.55,ew=Math.min(W*.32,260),eh=ew*.38*op;g.fillStyle='rgba(120,10,10,.25)';g.beginPath();g.ellipse(ex,ey,ew*1.4,ew*.6,0,0,6.3);g.fill();
    g.fillStyle='#e8d8c8';g.beginPath();g.ellipse(ex,ey,ew,Math.max(1,eh),0,0,6.3);g.fill();g.fillStyle='#8a0a0a';g.beginPath();g.arc(ex+Math.sin(lt*.7)*ew*.25,ey,Math.max(1,eh*.85),0,6.3);g.fill();g.fillStyle='#000';g.beginPath();g.ellipse(ex+Math.sin(lt*.7)*ew*.25,ey,Math.max(1,eh*.18),Math.max(1,eh*.75),0,0,6.3);g.fill();
    g.strokeStyle='#4a4a52';g.lineWidth=4;for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(ex+i*ew*.45,gy+4);g.lineTo(ex+i*ew*.2,ey-eh*.5);g.stroke()}introSc(sc,cx,cy)}
  if(f==='peace'){introCastle(5,-5,0);introCrown(5,-5,92+Math.sin(lt*2)*4,lt*1.2,cols);for(let i=0;i<4;i++){const k=['#c0392b','#2980b9','#27ae60','#f39c12'][i];box(-3+i*1.4,2.5,0,.9,.7,9,'#8a6a42');box(-3.1+i*1.4,2.4,18,1.1,.9,2,k);box(-3+i*1.4,2.5,0,.08,.08,18,'#5a4a3a');box(-2.18+i*1.4,2.5,0,.08,.08,18,'#5a4a3a')}
    for(let i=0;i<5;i++){const p=((lt*.5+i*.37)%2)-1;fNpc(['banditore','giardiniere','pescatore','attore','stalliere'][i],-5+i*2+p*1.5,4.5-i*.3,faceOf(1,0),{walk:1})}}
  if(f==='malakar'){introCastle(cx+5,cy-5,1);fBoss('lich',-1,1,0,{s:1.6,e:FA.ilich||(FA.ilich={id:7})});
    introCrown(-1,1,(E.lich.m.top||66)*1.6+6,lt*.6,['#555555']);for(let i=0;i<16;i++){const a=lt*1.3+i*.4,r=2.4+Math.sin(lt+i)*.4;box(-1+Math.cos(a)*r,1+Math.sin(a)*r,20+((lt*30+i*9)%90),.15,.15,4,'#c46bff',1.4)}
    if((lt*1.7)%3<.12){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='rgba(220,200,255,.55)';g.fillRect(0,0,W,H);introSc(sc,cx,cy)}}
  if(f==='fog'){const fade=Math.max(0,Math.min(1,(lt-4.5)/2.5));for(let i=0;i<7;i++){const x=-6+i*2.1,y=-1+(i%3)*2;houseV(x,y,1.6,1.6,16+(i%3)*4,'#8a7a6a','#3a2a24',1);
      if(i%2===0){const fl=1+Math.sin(lt*12+i)*.2;box(x+.3,y+.3,20+(i%3)*4,1,1,10*fl*(1-fade),'#ff7a2a',1.3);box(x+.5,y+.5,24+(i%3)*4,.6,.6,10*fl*(1-fade),'#ffd04a',1.4)}}
    g.setTransform(DPR,0,0,DPR,0,0);for(let k=0;k<6;k++){const x=((lt*30*(k+1)+k*300)%(W*1.5))-W*.25,y=H*(.35+k*.1),rg=g.createRadialGradient(x,y,10,x,y,W*.4);rg.addColorStop(0,'rgba(150,154,165,.15)');rg.addColorStop(1,'rgba(150,154,165,0)');g.fillStyle=rg;g.fillRect(0,0,W,H)}
    g.fillStyle=`rgba(255,60,20,${.18*(1-fade)})`;g.fillRect(0,0,W,H);g.fillStyle=`rgba(5,5,10,${fade*.55})`;g.fillRect(0,0,W,H);
    if(lt>1.4&&lt<1.6||lt>2.6&&lt<2.75){g.fillStyle='rgba(255,255,255,.08)';g.fillRect(0,0,W,H)}introSc(sc,cx,cy)}
  if(f==='shatter'){const k=ease(Math.min(1,lt/3.5));for(let i=0;i<6;i++){const a=i*Math.PI/3+.3,r=k*9,x=Math.cos(a)*r,y=Math.sin(a)*r,z=70+Math.sin(k*Math.PI)*60;
      box(x-.25,y-.25,z,.5,.5,10,cols[i],1.3);for(let j=1;j<6;j++){const r2=Math.max(0,r-j*.6);box(Math.cos(a)*r2-.08,Math.sin(a)*r2-.08,z-j*3,.16,.16,4,cols[i],1.1)}}
    if(lt<.6){g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=`rgba(255,255,255,${1-lt/.6})`;g.fillRect(0,0,W,H);introSc(sc,cx,cy)}}
  if(f==='lords'){const n=Math.min(6,Math.floor(lt/1.05)+1),ids=SHARDS;for(let i=0;i<n;i++){const a=i*Math.PI/3-Math.PI/2,x=Math.cos(a)*6,y=Math.sin(a)*6,c=TH[DG[ids[i]].th].tc,rs=eob(Math.min(1,(lt-i*1.05)/.7));
      box(x-.6,y-.6,0,1.2,1.2,8*rs,'#3a3a44');box(x-.4,y-.4,8*rs,.2,.2,36*rs,'#5a5a64');box(x+.2,y-.4,8*rs,.2,.2,36*rs,'#5a5a64');box(x-.4,y-.4,44*rs,1,.2,6,'#5a5a64');box(x-.25,y-.35,10*rs,.5,.1,32*rs,c,1.2+Math.sin(lt*4+i)*.1)}
    g.setTransform(DPR,0,0,DPR,0,0);g.textAlign='center';g.font='bold 15px Georgia,serif';for(let i=0;i<n;i++){const a=i*Math.PI/3-Math.PI/2,[sx,sy]=scr2(Math.cos(a)*6,Math.sin(a)*6,0,sc,cx,cy);g.globalAlpha=Math.min(1,(lt-i*1.05)/.6);label(DG[ids[i]].n,sx,sy+18,TH[DG[ids[i]].th].tc)}g.globalAlpha=1;introSc(sc,cx,cy)}
  if(f==='void'){for(let i=0;i<9;i++){const w2=Math.sin(lt*1.2+i)*6;box(-3+(i%3)*2,-3+Math.floor(i/3)*2,40+w2+(i===4?30:0),1.6,1.6,30+(i%2)*20+(i===4?40:0),'#2a1a3a',.9+(i%3)*.1)}
    for(let i=0;i<14;i++){const a=lt*.4+i*.45;box(Math.cos(a)*7-.15,Math.sin(a)*7-.15,60+Math.sin(lt*2+i)*14,.3,.3,6,'#c46bff',1.3)}
    g.setTransform(DPR,0,0,DPR,0,0);const ea=.5+.5*Math.sin(lt*2);g.fillStyle=`rgba(255,40,60,${.35+ea*.4})`;g.beginPath();g.ellipse(W*.44,H*.16,26,9,0,0,6.3);g.ellipse(W*.56,H*.16,26,9,0,0,6.3);g.fill();introSc(sc,cx,cy)}
  if(f==='seal'){const n=Math.min(40,Math.floor(lt*7));for(let i=0;i<n;i++){const col=i%10,row=Math.floor(i/10),k=Math.min(1,(lt*7-i)/2),z=row*7+Math.max(0,(1-eob(k))*40);box(-5+col*1.05,0,z,1,1,6.5,row%2?'#8a8e98':'#7b7f89')}
    fNpc('sentinella',-6,2,faceOf(0,-1));fNpc('carceriere',6,2,faceOf(0,-1));fNpc('re',0,3.5,faceOf(0,-1))}
  if(f==='hero'){introCastle(7,-7,0);const k=Math.min(1,lt/6.5),hx=-6+k*6,hy=6-k*6;drawHero(walkLegs(heroL(APM,1,APM.hh?2:-1,1,20,0,0),lt*10),hx,hy,Math.abs(Math.sin(lt*9))*2,0,5);
    if(lt>D-3.4){g.setTransform(DPR,0,0,DPR,0,0);const a=Math.min(1,(lt-(D-3.4))/1.2),zz=1+(1-ease(a))*.3;g.save();g.globalAlpha=a;g.translate(W/2,H*.3);g.scale(zz,zz);g.textAlign='center';g.font=`bold ${Math.round(Math.min(W,H)/8)}px Georgia,serif`;g.lineWidth=6;g.strokeStyle='#3a1a08';g.strokeText('VOXELIA',0,0);g.fillStyle='#ffd88a';g.fillText('VOXELIA',0,0);g.restore()}}
  g.setTransform(DPR,0,0,DPR,0,0);
  if(IFD&&I.fdt!=null&&I.fdt<.9){I.fdt+=dt;g.globalAlpha=Math.max(0,1-ease(Math.min(1,I.fdt/.9)));g.drawImage(IFD,0,0,W,H);g.globalAlpha=1}
  const vg=g.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  const bar=H*.07;g.fillStyle='#000';g.fillRect(0,0,W,bar);g.fillRect(0,H-bar,W,bar);
  const fa=Math.max(s===0?1-lt/1.2:0,s===ISC2.length-1?1-(D-lt)/1:0);if(fa>0){g.fillStyle=`rgba(0,0,0,${Math.min(1,fa)})`;g.fillRect(0,0,W,H)}
  const n=Math.min(S.tx.length,Math.floor(Math.max(0,lt-.5)*40)),tx=S.tx.slice(0,n);if(tx!==I.shown){I.shown=tx;const el=$('itx');if(el)el.textContent=tx}}

/* ================= 6.8: piazza di Aldoria — fontana, mercato, giornata dei cittadini ================= */
const NIGHTZ=new Set(['town','nord','campi','porto']);let MKO=true,RTN=0,RSL=[],RDOORS=[];
// ---- fontana: vasca di pietra 6×6, due vasche sovrapposte, statua del fondatore, getti d'acqua ----
function fountW(x,y){const ph=t*2.2;box(x,y,-6,1,1,6,'#8a8478');
  box(x,y,0,1,1,3,(x+y)&1?'#3a8ad8':'#3584d0',.94+Math.sin(ph+x*1.3+y*.7)*.07);
  const d=Math.hypot(x+.5-36,y+.5-36);for(let k=0;k<2;k++){const r=((t*.9+k*1.3)%2.6)+.9,q=Math.abs(d-r);if(q<.28){const a0=g.globalAlpha;g.globalAlpha=a0*(.32-q);box(x+.3,y+.3,3,.4,.4,.2,'#e8f6ff',1.1);g.globalAlpha=a0}}
  if((x*7+y*3)%5===0)box(x+.3,y+.6,3,.12,.12,.25,'#ffd84a',1.2+Math.sin(t*3+x)*.15);if((x*3+y*5)%7===0)box(x+.6,y+.25,3,.1,.1,.25,'#d8d8e0',1.2);
  if(NK>.1&&SET.ultra&&(x+y)%2===0)GLOW.push([x+.5,y+.5,3,26,'110,180,255',.12*NK])
  if(x===36&&y===36)fountC()}
function fdrops(x0,y0,z0,x1,y1,z1,hgt,n,sp,c){const a0=g.globalAlpha;g.globalAlpha=a0*.85;for(let k=0;k<n;k++){const u=((t*sp)+k/n)%1,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u,z=z0+(z1-z0)*u+hgt*4*u*(1-u);box(x-.04,y-.04,z,.08,.08,1.6,c||'#bfe2ff',1.15)}g.globalAlpha=a0}
function fountC(){const X=36,Y=36,w=Math.sin(t*2)*.05;
  box(X-.75,Y-.75,0,1.5,1.5,5,'#cfc8b8');box(X-.6,Y-.6,5,1.2,1.2,2,'#ddd6c6');box(X-.38,Y-.38,7,.76,.76,9,'#e6e0d2');
  for(const[a,b]of[[-.39,-.2],[-.39,.1],[.33,-.2],[.33,.1]])box(X+a,Y+b,9,.06,.1,5,'#d0c8b6');
  box(X-1.05,Y-1.05,16,2.1,2.1,2.5,'#cbc3b2');box(X-1.1,Y-1.1,18.5,2.2,2.2,.8,'#ddd6c6');box(X-.95,Y-.95,18.6,1.9,1.9,.9,'#4a9ae0',1.08+w);
  box(X-.28,Y-.28,19,.56,.56,8,'#e6e0d2');box(X-.55,Y-.55,27,1.1,1.1,2,'#cbc3b2');box(X-.48,Y-.48,28.8,.96,.96,.7,'#5aaaf0',1.12+w);
  // la statua di Aldric il Primo, con la corona e un'anfora da cui scende l'acqua
  box(X-.2,Y-.16,29.5,.4,.32,12,'#f0ece2');box(X-.22,Y-.18,29.5,.44,.36,3,'#e6e0d4');box(X-.13,Y-.11,41.5,.26,.22,6,'#f4f0e8');box(X-.15,Y-.13,47.5,.3,.26,2,'#d4af37',1.2);
  for(let i=0;i<4;i++)box(X-.14+i*.09,Y-.12,49.5,.05,.05,2,'#d4af37',1.25);box(X+.18,Y-.06,36,.08,.1,9,'#f0ece2');box(X+.14,Y-.12,44,.2,.22,4,'#c8a878');box(X-.27,Y-.04,33,.08,.1,8,'#f0ece2');
  fdrops(X+.26,Y-.02,46,X+.32,Y+.05,29.5,0,6,1.6,'#d8f0ff');
  // traboccamenti: dalla vasca alta a quella media, e dalla media alla grande
  for(const[a,b]of[[-.52,0],[.5,0],[0,-.52],[0,.5]])fdrops(X+a,Y+b,28.5,X+a*1.55,Y+b*1.55,18.8,1,4,1.3);
  for(const[a,b]of[[-1.08,-.5],[-1.08,.5],[1.06,-.5],[1.06,.5],[-.5,-1.08],[.5,-1.08],[-.5,1.06],[.5,1.06]])fdrops(X+a,Y+b,18,X+a*1.35,Y+b*1.35,3,1.5,3,1.1);
  // quattro getti dai lati della vasca grande verso il centro
  for(const[a,b,c,d]of[[33.9,36,34.9,36],[38.1,36,37.1,36],[36,33.9,36,34.9],[36,38.1,36,37.1]])fdrops(a,b,6,c,d,3,12,7,.9);
  if(SET.part&&Math.random()<.3){const a=Math.random()*6.28;sparks(X+Math.cos(a)*1.2,Y+Math.sin(a)*1.2,1,['#e0f0ff'],18)}
  if(NK>.1)nlight(X,Y,20,120,'150,200,255',.35*NK)}
function fountRim(x,y,h){const cor=(x===33||x===38)&&(y===33||y===38);
  if(cor){box(x+.05,y+.05,0,.9,.9,9,'#cfc8b8');box(x,y,9,1,1,2,'#e2dccf');box(x+.3,y+.3,11,.4,.4,10,'#d8d2c4');box(x+.25,y+.25,21,.5,.5,2,'#e2dccf');
    const on=NK>.3;box(x+.38,y+.38,23,.24,.24,5,on?'#ffe08a':'#c8b88a',on?1.4:1);if(on){nlight(x+.5,y+.5,25,120,'255,220,140',.8);if(SET.ultra)GLOW.push([x+.5,y+.5,25,40,'255,220,140',.25])}return}
  box(x,y,0,1,1,6,(x+y)&1?'#c8c0ae':'#cfc7b6',.92+h*.1);box(x-.03,y-.03,6,1.06,1.06,1.6,'#e2dccf');
  if((x+y)%2===0){box(x+.3,y+.3,7.6,.4,.4,3,'#a0603a');box(x+.25,y+.25,10.6,.5,.5,3,'#3f8a3a');box(x+.38,y+.32,13.6,.14,.14,1.5,['#e0304a','#f5c342','#c46bff','#ffffff'][(x+y*3)%4])}}
// ---- bancarelle decorative (aperte di giorno e il pomeriggio, chiuse la sera) ----
const STALLG=[['#c0392b','#f4f0e0',(x,y)=>{for(let i=0;i<6;i++)box(x+.15+(i%3)*.24,y+.25+Math.floor(i/3)*.22,9,.16,.16,3,['#d03a2a','#f39c12','#6ab83a'][i%3],1.05)}],
  ['#2980b9','#f4f0e0',(x,y)=>{for(let i=0;i<4;i++)box(x+.15+i*.18,y+.3,9,.12,.4,1.8,'#b8c8d8',1.15)}],
  ['#c8783a','#f4e4c0',(x,y)=>{for(let i=0;i<5;i++)box(x+.14+(i%3)*.25,y+.25+Math.floor(i/3)*.25,9,.2,.14,2.5,'#d8a858')}],
  ['#8a3a6a','#f4f0e0',(x,y)=>{for(let i=0;i<3;i++){box(x+.18+i*.22,y+.35,9,.16,.16,5,'#b8603a');box(x+.21+i*.22,y+.38,14,.1,.1,1.5,'#9a4a2a')}}],
  ['#27ae60','#f4f0e0',(x,y)=>{for(let i=0;i<4;i++)box(x+.12,y+.2+i*.16,9,.76,.12,2.2,['#c0392b','#2980b9','#f5c342','#8a3a6a'][i])}],
  ['#e86a8a','#f4f0e0',(x,y)=>{for(let i=0;i<6;i++){box(x+.18+(i%3)*.24,y+.28+Math.floor(i/3)*.24,9,.06,.06,3,'#3f7a32');box(x+.15+(i%3)*.24,y+.25+Math.floor(i/3)*.24,12,.12,.12,2,['#e0304a','#f5c342','#c46bff','#ffffff','#ff8a4a','#e86a8a'][i],1.1)}}]];
function stallD(x,y,h){const v=STALLG[(x*5+y*3)%STALLG.length];box(x+.05,y+.2,0,.9,.6,9,'#8a6a42');box(x+.03,y+.18,9,.94,.64,.6,'#9a7a4a');
  for(const[a,b]of[[.05,.15],[.87,.15],[.05,.78],[.87,.78]])box(x+a,y+b,0,.08,.08,22,'#5a4a3a');
  if(MKO){for(let i=0;i<5;i++)box(x-.05+i*.22,y+.05,22-(i%2)*.3,.22,.95,2.4,i%2?v[1]:v[0]);box(x-.05,y+.98,19,1.1,.04,3.4,v[0]);v[2](x,y)}
  else{box(x+.03,y+.16,9.6,.94,.68,3,'#7a6a52');box(x+.08,y+.18,12.6,.84,.6,.6,'#6a5a44');box(x-.02,y+.1,21,1.04,.18,1.8,v[0])}}
// ---- cittadini: di giorno in giro, la sera a casa; i mercanti seguono gli orari del mercato; di notte solo le guardie ----
Object.assign(NPCS,{
  mv_frutta:{n:'Fruttivendola Nora',c:'#c0392b',hat:'#f4e4c0',ln:['Mele, pere, arance! Tutto fresco di stamattina!','Le prime fragole della stagione, assaggia!'],sh:['Mele rosse, mele dolci!','Arance di Khem!','Fragole fresche!']},
  mv_pesce:{n:'Pescivendolo Tano',c:'#2980b9',hat:'#2a4a6a',ln:['Pescato all\'alba, giuro sulla mia barca!','Le sardine di oggi sono una meraviglia.'],sh:['Pesce fresco!','Sardine, spigole, orate!','Pescato all\'alba!']},
  mv_pane:{n:'Fornaio Beppe',c:'#c8783a',hat:'#f4f0e0',ln:['Il pane della Panetteria di Gemma, ancora caldo!','Le focacce finiscono prima di mezzogiorno.'],sh:['Pane caldo!','Focacce al rosmarino!','Ciambelle!']},
  mv_fiori:{n:'Fioraia Viola',c:'#e86a8a',hat:'#3f7a32',ln:['Un mazzo di rose per qualcuno di speciale?','I fiori del Roseto, colti stamattina.'],sh:['Rose del Roseto!','Fiori freschi!','Un fiore per la vostra dama!']},
  ronda:{n:'Guardia di ronda',c:'#4a5a7a',hat:'#8a94a8',ln:['Di notte la città è nostra. Nessun pericolo, cittadino.','Torna a casa, è tardi. O sei un avventuriero? Allora stai attento.','Il Re vuole le strade sicure. Facciamo il giro della piazza ogni ora.']}});
const MSTALL=[[30,30],[31,30],[32,30],[39,30],[40,30],[41,30],[30,41],[31,41],[32,41],[39,41],[40,41],[41,41]],MVEND=[['mv_frutta',31,31],['mv_pesce',40,31],['mv_pane',31,40],['mv_fiori',40,40]];
function townPlaza(){for(let y=33;y<=38;y++)for(let x=33;x<=38;x++){const e=x===33||x===38||y===33||y===38;M[y][x]=e?6:2;DEC[y][x]=e?'ɸ':'ɷ'}
  for(const[x,y]of MSTALL){M[y][x]=6;DEC[y][x]='ʍ'}}
function staysNPC(e){return /guardia|sentinella|capitano|recluta|ronda/i.test((e.nid||'')+' '+(e.n||''))||!!ANM[e.nid]||e.nid==='gatto'||e.nid==='cavallo'||e.wg}
function awakeH(e,h){const o=e.so||0;if(e.nt)return h>=20+o*.6||h<6.2+o*.4;if(e.mkt)return h>=6.6+o*.4&&h<19+o*.3;return h>=6.4+o*.9&&h<19.7+o*.9}
function homeDoor(e){let best=null,bd=1e9;for(const d of RDOORS){const q=Math.hypot(d[0]+.5-e.hx,d[1]+.5-e.hy);if(q<bd){bd=q;best=d}}return best}
function routineInit(k){RSL=[];RDOORS=[];if(!NIGHTZ.has(k))return;MKO=marketOpen();
  for(const e of ents)if(e.k==='po'&&e.st==='door'&&!e.lock&&WK(M[e.py|0]&&M[e.py|0][e.px|0]))RDOORS.push([e.px|0,e.py|0]);
  if(k==='town'){for(const[id,x,y]of MVEND){const e=mkNpc(id,x,y);e.mkt=1;e.sh=NPCS[id].sh;e.nsh=t+2+Math.random()*6;ents.push(e)}
    for(const[x,y]of[[33,31],[38,40],[35,32],[30,36]]){const e=mkNpc('ronda',x,y,{wd:1});e.nt=1;e.torch=1;if(!e.m.rg)e.m.push([.3,.05,12,.06,.06,16,'#5a3a1a'],[.27,.02,28,.12,.12,6,'#ffb040',1.5]);ents.push(e)}}
  const h=gHour();for(const e of ents.slice()){if(e.k!=='npc'||(staysNPC(e)&&!e.nt))continue;e.hx=e.px;e.hy=e.py;e.so=(hs((e.nid||'')+(e.n||''))%1000)/1000;if(e.nid==='ugo')e.mkt=1;
    if(!awakeH(e,h)){ents.splice(ents.indexOf(e),1);RSL.push(e)}}}
function marketOpen(){const h=gHour();return h>=7&&h<19}
function rVanish(e){const i=ents.indexOf(e);if(i>=0)ents.splice(i,1);e.go=null;e.path=[];RSL.push(e);if(PA===e&&PM==='npc')cl();if(Math.hypot(e.px-P.px,e.py-P.py)<8)tone(220,.08,'triangle',.02)}
function routineTick(dt){if(!NIGHTZ.has(Zk)||!P){MKO=true;return}RTN-=dt;
  for(const e of ents)if(e.k==='npc'&&e.sh&&t>e.nsh&&dist(e,P)<10){e.nsh=t+7+Math.random()*7;flt(e,e.sh[Math.floor(Math.random()*e.sh.length)],'#fff6d8')}
  if(RTN>0)return;RTN=.4;const h=gHour();MKO=marketOpen();let ch=0;
  for(const e of ents.slice()){if(e.k!=='npc'||e.hx==null)continue;const aw=awakeH(e,h);
    if(!aw){if(e.go!=='out'){const d=homeDoor(e);e.go='out';e.wt=1e9;e.path=d?path(e.px|0,e.py|0,d[0],d[1]):[];if(e.nt)e.path=path(e.px|0,e.py|0,e.hx|0,e.hy|0)}if(!e.path.length){rVanish(e);ch=1}}
    else if(e.go==='out'){e.go='in';e.path=path(e.px|0,e.py|0,e.hx|0,e.hy|0)}
    else if(e.go==='in'&&!e.path.length){e.go=null;e.wt=e.wd?1+Math.random()*3:1e9}}
  for(const e of RSL.slice())if(awakeH(e,h)){RSL.splice(RSL.indexOf(e),1);const d=e.nt?[e.hx|0,e.hy|0]:homeDoor(e)||[e.hx|0,e.hy|0];e.px=d[0]+.5;e.py=d[1]+.5;e.go='in';e.wt=1e9;e.path=path(d[0],d[1],e.hx|0,e.hy|0);ents.push(e);ch=1}
  if(ch)npcMarks();
  const want=NK>.55?'notte':(ZZ.mus||'town');if(!CN&&!INTRO&&(AU.want==='town'||AU.want==='notte')&&AU.want!==want)music(want)}
// ---- di notte, nelle case, chi abita dorme ----
const HOMEZ=/^in_(house|villa|casa_p)/;let ZZT=0;
function homeSleep(dt){if(!HOMEZ.test(Zk||''))return;const h=gHour(),sl=h>=21.5||h<6;for(const e of ents)if(e.k==='npc'&&e.nid!=='gatto')e.slp=sl;
  if(!sl)return;ZZT-=dt;if(ZZT>0)return;ZZT=2.2;for(const e of ents)if(e.slp)flt(e,'z z Z','#bcd4ff')}
function stallClosed(x,y){box(x+.1,y+.1,0,.8,.8,11,'#8a6a42');box(x+.06,y+.06,11,.88,.88,3,'#7a6a52');box(x+.1,y+.1,14,.8,.8,.6,'#6a5a44')}
{const zt=ZB.find(z=>z.k==='town');if(zt){zt.f[0]='Castello del Re Aldric: le missioni principali, e tante stanze da esplorare (galleria, armeria, prigioni, consiglio, archivio, cucine, appartamenti)';
  zt.f.splice(1,0,'Al centro: la grande fontana di Aldric il Primo e il mercato della piazza (aperto dalle 7 alle 19)');zt.tx+=' Di giorno le strade sono piene di gente; la sera i cittadini tornano a casa e restano solo le guardie, con le torce.'}}

/* ================= 6.8: il castello si allarga, gli edifici grandi hanno nuove stanze, e ovunque segreti ================= */
const CRMC=['#8a8a94','#80808a','#9a9aa6'],CDK=['#4a4a52','#44444c','#5a5a64'];
const RM8=(n,lay,o)=>Object.assign({n,fl:(o.c||CRMC)[0],fl2:(o.c||CRMC)[1],wall:(o.c||CRMC)[2],np:o.np||[],po:o.po||[],lay,mus:o.mus||'castello'},o.x||{});
const ROOMS={
cas_galleria:RM8('Castello · Galleria dei Ritratti',['##############','#ŧ.ƥ.ƥ.ƪ.ƥ.ŧ.#','#............#','#..========..#','#..========..#','#p..........p#','#..========..#','#..========..#','#ŧ..........ŧ#','#..========..#','#..========..#','#ƥ..........ƥ#','#.....p......#','##############'],
  {np:[['guardia',11,5,{n:'Guardia della Galleria'}]],po:[[12,7,'in_castle','Sala del trono'],[1,6,'cas_armeria','Armeria Reale']]}),
cas_armeria:RM8('Castello · Armeria Reale',['############','#ww.ww.ww.A#','#..........#','#ŧ.kk..kk.ŧ#','#..........#','#ŧ..TT....b#','#...TT....b#','#..........#','#k.......ŧ.#','#..........#','#bb....w...#','############'],
  {np:[['maestro_armi',7,7]],po:[[10,4,'cas_galleria','Galleria dei Ritratti'],[1,9,'cas_prigioni','Scala · prigioni',{st:'down'}]]}),
cas_prigioni:RM8('Castello · Prigioni',['#############','#ǁ..#ǁ..#ǁ..#','#...#...#...#','#ǂ.ǂ#ǂǂǂ#ǂǂǂ#','#...........#','#.,.......,.#','#...........#','#...........#','#ǂǂǂ#ǂǂǂ#ǂ.ǂ#','#...#...#...#','#ǁ..#ǁ..#..ǁ#','#...#...#...#','#############'],
  {c:CDK,mus:'dungeon',np:[['prigioniero',2,2],['carceriere',11,6]],po:[[1,6,'cas_armeria','Scala · armeria',{st:'up'}]]}),
cas_passaggio:RM8('???',['############','#..........#','#.ɯ......ɯ.#','#..######..#','#..#    #..#','#ɯ.#    #.ɯ#','#..#    #..#','#..#    #..#','#..######..#','#.ċ......ċ.#','#..........#','############'],
  {c:CDK,mus:'dungeon',po:[[2,1,'cas_galleria','Dietro l\'arazzo'],[10,10,'cas_cripta','Scala · cripta',{st:'down'}]]}),
cas_cripta:RM8('Castello · Cripta dei Re',['##############','#ğ..ċ....ċ..ğ#','#............#','#.ʭ..ʭ..ʭ..ʭ.#','#............#','#ċ....øø....ċ#','#.....øø.....#','#ċ....øø....ċ#','#............#','#.ʭ..ʭ..ʭ..ʭ.#','#............#','#ğ....ʭʭ....ğ#','#............#','##############'],
  {c:CDK,mus:'dungeon',po:[[12,12,'cas_passaggio','Scala · passaggio',{st:'up'}]]}),
cas_consiglio:RM8('Castello · Sala del Consiglio',['##############','#S..F....F..S#','#............#','#..nnnnnnnn..#','#..TTTTTTTT..#','#..TTTTTTTT..#','#..nnnnnnnn..#','#............#','#p..........p#','#....ʘʘ......#','#............#','#Y..........Y#','#............#','##############'],
  {np:[['consigliere',2,7]],po:[[1,7,'in_castle','Sala del trono'],[12,2,'cas_archivio','Archivio Reale']]}),
cas_archivio:RM8('Castello · Archivio Reale',['############','#SSSS..SSSS#','#..........#','#SS.SS.SS..#','#..........#','#SS.SS.SS..#','#..........#','#.H...ŝ..H.#','#..........#','#SS.SS.SS..#','#..........#','############'],
  {c:['#7a5a3a','#725436','#c8b89a'],np:[['archivista',3,8]],po:[[10,2,'cas_consiglio','Sala del Consiglio']]}),
cas_cucine:RM8('Castello · Cucine',['############','#ȼȼ.CCCC.bb#','#..........#','#.TT....TT.#','#.TT....TT.#','#..........#','#k........k#','#bb..CC..bb#','#..........#','#k.p....p.k#','#..........#','############'],
  {c:['#8a7a62','#82725c','#d8c8a8'],np:[['cuoca',4,2],['sguattero',7,8]],po:[[10,5,'in_castle','Sala del trono']]}),
cas_appartamenti:RM8('Castello · Appartamenti Reali',['##############','#BB..F...ɱ..p#','#BB..........#','#....=====...#','#.H..=====...#','#....=====...#','#............#','######..######','#B..ɱ........#','#ɯ..T..ɯ.....#','#.......ɯ..p.#','#..ɯ.........#','#........ɯ...#','##############'],
  {c:['#6a3a3a','#623434','#d8c0b0'],np:[['ancella',6,10]],po:[[12,2,'in_castle','Scala · sala del trono',{st:'down'}]]}),
lib_archivio:RM8('Biblioteca · Archivio sotterraneo',['############','#SSS.SS.SSS#','#..........#','#.SS.SS.SS.#','#..........#','#.SS.SS.SS.#','#..........#','#..H....ċ..#','#..........#','#.ŝ......p.#','#..........#','############'],
  {c:['#6a4a2a','#624426','#a89a7a'],mus:'inter',np:[['nilo',5,8]],po:[[10,10,'in_library','Scala · biblioteca',{st:'up'}]]}),
tav_camere:RM8('Taverna · camere al piano di sopra',['############','#B..#B..#B.#','#B..#B..#B.#','#...#...#..#','#..........#','#..........#','#..T....T..#','#..........#','#B.......bb#','#B.........#','#.........p#','############'],
  {c:['#8a6a42','#82643e','#d8c8a8'],mus:'inter',np:[['viandante',2,6]],po:[[10,5,'in_tavern','Scala · taverna',{st:'down'}]]}),
tav_cantina:RM8('Taverna · cantina',['############','#bbb.bbb.bb#','#..........#','#bb.kk..bbb#','#..........#','#.b....b...#','#.....,....#','#bb.....kk.#','#..........#','#k..bbb...k#','#..........#','############'],
  {c:['#5a4a3a','#544434','#8a7a6a'],mus:'dungeon',po:[[1,10,'in_tavern','Scala · taverna',{st:'up'}]]}),
tem_cripta:RM8('Tempio · cripta',['############','#ċ.ʭ..ʭ..ċ.#','#..........#','#Y........Y#','#..ʭ....ʭ..#','#..........#','#ċ...XX...ċ#','#..........#','#..ʭ....ʭ..#','#..........#','#ċ........ċ#','############'],
  {c:['#a8a49a','#a09c92','#c8c4b8'],mus:'dungeon',po:[[10,9,'in_temple','Scala · tempio',{st:'up'}]]}),
mun_piano:RM8('Municipio · piano superiore',['############','#SSS.F..SSS#','#..........#','#.H..ʘʘ..H.#','#..........#','#..nn..nn..#','#..........#','#p..====..p#','#...====...#','#S........S#','#..........#','############'],
  {c:['#c8b898','#beae8e','#f4efe4'],mus:'inter',np:[['scrivano',3,4]],po:[[10,10,'in_municipio','Scala · municipio',{st:'down'}]]}),
bar_dorm:RM8('Caserma · dormitorio',['############','#B.B.B.B.B.#','#..........#','#k.k.k.k.k.#','#..........#','#..........#','#B.B.B.B.B.#','#..........#','#k.k.k.k.k.#','#..........#','#ww......T.#','############'],
  {c:['#8a8a80','#828278','#b8b8ae'],mus:'inter',np:[['veterano',5,9]],po:[[10,4,'in_caserma','Caserma']]}),
casino_vip:RM8('Casinò · sala privata',['############','#MM..CC..MM#','#..........#','#.QQ....RR.#','#.QQ....RR.#','#..........#','#n..====..n#','#...====...#','#p........p#','#..T....T..#','#..........#','############'],
  {c:['#4a0a1a','#420816','#2a1a2a'],mus:'inter',np:[['lucrezio',5,8]],po:[[10,2,'in_casino','Sala del casinò']]}),
oss_cupola:RM8('Osservatorio · cupola',['############','#*..5..5..*#','#..........#','#....66....#','#....66....#','#..........#','#S..H...H.S#','#..........#','#*........*#','#....ŝ.....#','#..........#','############'],
  {c:['#2a3048','#262c42','#d8d4c8'],mus:'notte',np:[['allieva',3,7]],po:[[10,10,'in_osservatorio','Scala · osservatorio',{st:'down'}]]})};
for(const k in ROOMS)Z[k]=Object.assign({lv:0,N:ROOMS[k].lay.length,bg:'#0e1018',int:1},ROOMS[k]);
const DARKZ=new Set(['cas_prigioni','cas_passaggio','cas_cripta','tav_cantina','tem_cripta']);
// nuove porte negli edifici che esistevano già
for(const[k,L]of Object.entries({in_castle:[[1,8,'cas_galleria','Galleria dei Ritratti'],[14,8,'cas_consiglio','Sala del Consiglio'],[1,13,'cas_cucine','Cucine'],[14,13,'cas_appartamenti','Scala · appartamenti reali',{st:'up'}]],
  in_library:[[10,9,'lib_archivio','Scala · archivio sotterraneo',{st:'down'}]],in_tavern:[[12,11,'tav_camere','Scala · camere',{st:'up'}],[1,11,'tav_cantina','Scala · cantina',{st:'down'}]],
  in_temple:[[11,11,'tem_cripta','Scala · cripta',{st:'down'}]],in_municipio:[[14,13,'mun_piano','Scala · piano superiore',{st:'up'}]],in_caserma:[[1,13,'bar_dorm','Dormitorio']],
  in_casino:[[14,2,'casino_vip','Sala privata']],in_osservatorio:[[10,8,'oss_cupola','Scala · cupola',{st:'up'}]]}))if(Z[k])Z[k].po=(Z[k].po||[]).concat(L);
if(Z.in_castle)Z.in_castle.mus='castello';
Object.assign(NPCS,{
  maestro_armi:{n:'Maestro d\'armi Corrado',c:'#5a5a64',hat:'#3a3a44',ln:['Ogni lama di questa armeria ha un nome e una storia.','Quaranta lance uscirono di qui, una notte. Nessuna è tornata.']},
  prigioniero:{n:'Il prigioniero senza nome',c:'#6a6458',hat:'#4a443a',ln:['La cella è aperta, lo so. Ma fuori è peggio.','L\'Occhio guarda anche qui. Guarda sempre.','Turmsi... turmsi... lahig...']},
  carceriere:{n:'Carceriere Ugolino',c:'#3a3a32',hat:'#2a2a24',ln:['Il prigioniero? È qui da prima di me. Nessuno sa chi sia.','Il Re scende qui da solo, certe notti. Non chiedermi perché.']},
  consigliere:{n:'Consigliere Ottone',c:'#5a2a5a',hat:'#d4af37',ln:['Le decisioni del Re sono sagge. Sempre.','Aldoria Vecchia? Non esiste un luogo con questo nome. Non più.']},
  archivista:{n:'Archivista Oreste',c:'#6a5a3a',hat:'#3a2a1a',ln:['Ogni pagina della storia di Aldoria è qui. Quasi ogni pagina.','Alcuni registri sono stati... riordinati. Su ordine del Ciambellano.']},
  cuoca:{n:'Cuoca Berta',c:'#f4f0e0',hat:'#f4f0e0',ln:['Fuori dai piedi, la zuppa del Re non si cucina da sola!','Ogni notte manca un vassoio dalla dispensa. Ogni notte!']},
  sguattero:{n:'Sguattero Pippo',c:'#8a7a5a',hat:'#5a4a3a',ln:['Non mi mandate giù nelle prigioni, vi prego.','Di notte, sotto il castello, si sente cantare.']},
  ancella:{n:'Ancella Selma',c:'#7a3a5a',hat:'#e8d0e0',ln:['Ho servito la Regina Elara per vent\'anni. Era buona con tutti.','Dopo la notte della nebbia la sua stanza è rimasta così. Il Re non vuole che si tocchi nulla.']},
  nilo:{n:'Apprendista Nilo',c:'#3a5a8a',hat:'#2a2a4a',ln:['Il Saggio mi ha detto di riordinare l\'archivio. Ci vorranno anni!','Qui sotto ci sono libri in una lingua che nessuno parla più.']},
  viandante:{n:'Viandante Osvaldo',c:'#6a5a3a',hat:'#4a3a2a',ln:['Le camere sono comode, ma di notte dalla cantina arrivano rumori strani.','Ho dormito in cento locande. Questa è l\'unica dove i barili si muovono da soli.']},
  scrivano:{n:'Scrivano Gualtiero',c:'#4a4a3a',hat:'#2a2a2a',ln:['Tasse, permessi, catasto: tutto passa da qui.','Le mappe delle fogne? Sono riservate. Per ordine del Re.']},
  veterano:{n:'Veterano Bruno',c:'#5a6a8a',hat:'#7a8494',ln:['C\'ero anch\'io, quella notte. Non ne parlo.','Se senti chiamare il tuo nome nella nebbia, non rispondere. Mai.']},
  lucrezio:{n:'Conte Lucrezio',c:'#2a1a2a',hat:'#aa1a2a',ln:['Qui si gioca forte, amico mio. E si parla poco.','Il Ciambellano è un ottimo cliente. Paga sempre per il silenzio degli altri.']},
  allieva:{n:'Allieva Stella',c:'#2a3a6a',hat:'#d8d4c8',ln:['Dalla cupola si vedono tutte le costellazioni del regno.','Il maestro dice che una costellazione manca dalle carte ufficiali. Chissà perché.']}});
// ---- i segreti: [zona, x, y, aspetto, titolo, testo] ----
const SECD={
  c1:['cas_galleria',7,2,'','Il ritratto coperto','Sotto il drappo nero c\'è il ritratto di un giovane principe dagli occhi chiarissimi. La targa d\'ottone è stata raschiata via, ma si leggono ancora tre lettere: «...KAR».\n\nMalakar. Il fratello del Re, prima di diventare il Re Lich.'],
  c2:['cas_galleria',1,10,'','L\'arazzo che si muove','Dietro l\'arazzo della caccia reale l\'aria è fredda. C\'è un passaggio stretto, che scende nel buio.'],
  c3:['cas_armeria',6,5,'book','Il registro dell\'armeria','«Notte della nebbia: consegnate alla Guardia quaranta lance e venti torce, "per contenere". Restituite: nessuna.»\n\nAccanto, a margine, un\'altra mano ha scritto: «Non chiedere.»'],
  c4:['cas_prigioni',9,10,'','Graffi sul muro','Il muro della cella è coperto di segni incisi con le unghie. Sempre le stesse tre parole, centinaia di volte:\n\n«turmsi lahig uoi»'],
  c5:['cas_passaggio',6,10,'note','Un foglio strappato','«Fratello, tu lo chiami sigillo. Io lo chiamo porta. L\'Occhio non è un nemico: è una promessa. Quando la Corona sarà mia, lo sveglierò io stesso.»\n\n— M.'],
  c6:['cas_cripta',6,10,'','Il sarcofago di Aldric il Primo','«Qui riposa Aldric il Primo, che chiuse l\'Occhio nella pietra. Che nessuno del suo sangue lo riapra, né per amore né per potere.»'],
  c7:['cas_cripta',7,1.5,'door','La porta dell\'Occhio','Una porta di pietra nera, identica a quella sotto Aldoria Vecchia. Lo stesso occhio scolpito, le stesse parole:\n\n«La verità sarà nei tuoi occhi, a tempo debito.»\n\nLe due porte sono collegate. Ne sei certo.'],
  c8:['cas_consiglio',8,7,'note','Il verbale del Consiglio','«Il Consiglio approva all\'unanimità: le cantine di Aldoria Vecchia saranno murate. Nessun documento dovrà più nominare ciò che dorme. Chi ne parla sarà trattato da traditore.»\n\nFirmato: Re Aldric.'],
  c9:['cas_consiglio',7,9,'','La mappa del regno','Sulla grande mappa del tavolo qualcuno ha tracciato un cerchio rosso intorno ad Aldoria Vecchia. Dentro il cerchio, una sola parola in eldoriano: «turmsi».'],
  c10:['cas_archivio',6,8,'book','Il registro bruciato','Un registro degli abitanti di Aldoria Vecchia, mezzo bruciato. Trecentododici nomi sono segnati «trasferiti». Gli altri, più di mille, «non ritrovati».'],
  c11:['cas_archivio',3,6,'book','Una lettera dentro un libro','«Aldric, tuo fratello dice che l\'Occhio lo chiama, la notte. Non vuoi ascoltarmi, ma io l\'ho sentito anch\'io. Se mi succede qualcosa, cerca sotto la cappella.»\n\n— Elara'],
  c12:['cas_cucine',6,9,'note','Un biglietto unto','«Il Re vuole che ogni notte qualcuno porti un vassoio giù nelle prigioni, al terzo piano sotterraneo. Ma le prigioni hanno un piano solo... Io non ci vado più.»\n\n— Pippo'],
  c13:['cas_appartamenti',3,4,'book','Il diario del Re','«Ho mentito al mio popolo. Quella notte, mentre la Corona si spezzava, la nebbia salì da sotto Aldoria Vecchia. Mio fratello sapeva dell\'Occhio. Io l\'ho sempre saputo. Che gli dèi mi perdonino.»'],
  c14:['cas_appartamenti',5,9,'box','Il carillon della Regina','Il carillon suona ancora. Le ancelle raccontano che la Regina Elara lo apriva ogni sera.\n\nDopo la notte della nebbia nessuno l\'ha più vista.'],
  e1:['lib_archivio',3,9,'book','Grammatica eldoriana','Un vecchio manuale della lingua dei primi re. Qualcuno ha sottolineato tre parole:\n\n«turmsi» — il re\n«lahig» — nasconde\n«uoi» — ciò che sta sotto'],
  e2:['tav_cantina',6,8,'note','La nota dei contrabbandieri','«Consegna in cantina, come sempre. Il carico per la casa del fabbricante di candele va lasciato davanti alla grata. Non aprite le casse: c\'è qualcosa che si muove.»'],
  e3:['tem_cripta',5,7,'note','La confessione','«Io, sacerdote della Luce, confesso: la notte della nebbia ho visto il Ciambellano entrare nel tempio con una lanterna spenta, e uscirne con la lanterna accesa di una luce rossa.»'],
  e4:['mun_piano',7,4,'note','La mappa delle fogne','Il catasto delle fogne di Aldoria. Sotto Aldoria Vecchia le gallerie scendono per tre livelli, poi la mappa si interrompe. Al margine, in rosso: «NON SCAVARE OLTRE».'],
  e5:['bar_dorm',8,9,'book','Il diario di una guardia','«Ci hanno mandati con le lance contro la nebbia. Nella nebbia non c\'era nessuno da colpire. Solo voci, che chiamavano i nostri nomi. Siamo tornati in dodici su quaranta.»'],
  e6:['casino_vip',5,9,'note','Una lettera sigillata','«Duecento monete d\'oro a testa, ogni mese, a chi era di guardia quella notte. In cambio, silenzio.»\n\n— Il Ciambellano'],
  e7:['oss_cupola',6,9,'note','La mappa del cielo','Una carta delle stelle annotata a mano: «La costellazione dell\'Occhio sorge una volta ogni cento anni. L\'ultima volta: la notte della nebbia. La prossima...»\n\nIl resto è cancellato.']};
let SECN=Object.keys(SECD).length;const SECC=Object.keys(SECD).filter(k=>k[0]==='c');
function secretsLoad(k){for(const id in SECD){const d=SECD[id];if(d[0]!==k||id==='c2')continue;ents.push({k:d[3]==='door'?'portac':'secret',sid:id,n:'',px:d[1]+.5,py:d[2]+.5,look:d[3]})}
  if(k==='cas_galleria'){const tp=ents.find(e=>e.k==='po'&&e.to==='cas_passaggio');if(!tp)ents.push(Object.assign(po(1,10,'cas_passaggio',{st:'tap',n:''}),{px:1.25,py:10.5,face:'w'}))}}
function secretFind(id){const d=SECD[id];P.sec=P.sec||{};PA={ti:d[4],tx:d[5]};pn('txt');if(id==='c14')jingle([76,79,84,83,79,76,74,76,72],.2,'triangle');
  if(P.sec[id]){return}P.sec[id]=1;const n=Object.keys(P.sec).filter(k=>SECD[k]).length;gainXP(25);banner('Segreto scoperto',d[4]+' · '+n+'/'+SECN,'pergamena');tone(520,.12,'sine');
  if(id[0]==='c'&&SECC.every(k=>P.sec[k])&&!P.secR1){P.secR1=1;P.g+=400;goldFly(400);setTimeout(()=>banner('I segreti del castello','Hai scoperto tutto ciò che il castello nascondeva · +400 oro','corona'),1800)}
  if(n>=SECN&&!P.secR2){P.secR2=1;P.g+=1000;goldFly(1000);setTimeout(()=>banner('Custode dei segreti di Aldoria','Hai trovato tutti i '+SECN+' segreti · +1000 oro','corona'),3600)}hud();save()}
const SECL={book:[[-.14,-.1,0,.28,.2,2.2,'#7a2a2a'],[-.12,-.08,2.2,.24,.16,.4,'#f4ecd4']],note:[[-.13,-.09,0,.26,.18,.5,'#f4ecd4'],[-.08,-.04,.5,.16,.02,.2,'#5a4a3a']],box:[[-.13,-.1,0,.26,.2,4,'#8a5a2a'],[-.14,-.11,4,.28,.22,1,'#d4af37']]};
function secretL(e){const L=(SECL[e.look]||[]).slice(),fd=P.sec&&P.sec[e.sid];if(!fd&&dist(e,P)<3.6){const u=Math.sin(t*4+e.px)*2;L.push([-.03,-.03,7+u,.06,.06,.06,'#fff6c0',1.6],[-.08,-.01,7.5+u,.16,.02,.02,'#fff6c0',1.4])}return L}
const PORTCL=()=>[[-.9,-.12,0,1.8,.24,44,'#1e1e22'],[-1,-.14,44,2,.28,4,'#16161a'],[-.3,.12,22,.6,.02,10,'#3a3a42'],[-.12,.13,25,.24,.02,4,'#c0392b',1.3],[-.05,.14,26,.1,.02,2,'#0a0a0a']];
const TAPL=e=>{const w=Math.sin(t*1.5)*.02,f=P.sec&&P.sec.c2;return[[-.08,-.48,0,.06,.96,34,'#4a3424'],[-.04,-.44+w,4,.04,.88,28,f?'#5a2a2a':'#7a2a2a'],[-.02,-.3+w,14,.02,.6,12,'#d4af37'],[-.02,-.1+w,20,.02,.2,4,'#3a6a3a']].concat(f?[[-.02,-.2,0,.02,.4,20,'#050505']]:[])};
function roomsTick(dt){if(!P)return;for(const e of ents){if(e.k==='secret'||e.k==='portac'){const d=SECD[e.sid];e.n=dist(e,P)<2.6||(P.sec&&P.sec[e.sid])?d[4]:''}
    else if(e.k==='po'&&e.st==='tap')e.n=P.sec&&P.sec.c2?'Passaggio dietro l\'arazzo':dist(e,P)<2.6?'Arazzo della caccia reale':''}}
function darkOverlay(){g.save();g.setTransform(DPR,0,0,DPR,0,0);scrVeil('dark',vigP(H*.12,Math.max(W,H)*.58,'rgba(0,0,0,0)','rgba(4,3,6,.88)'));g.restore()}
function secretsHTML(){const f=Object.keys(SECD).filter(k=>P.sec&&P.sec[k]);if(!f.length)return'';return`<h4>🗝 Segreti di Aldoria (${f.length}/${SECN})</h4>`+f.map(k=>`<div class="qb"><b>${esc(SECD[k][4])}</b><br><small>${esc(SECD[k][5]).replace(/\n/g,'<br>')}</small></div>`).join('')}
// arredi nuovi
function decRooms(x,y,c,h){switch(c){
  case 'ŧ':box(x+.32,y+.38,0,.12,.14,10,'#8a8e98');box(x+.56,y+.38,0,.12,.14,10,'#8a8e98');box(x+.28,y+.32,10,.44,.32,12,'#a8acb6');box(x+.2,y+.36,12,.1,.24,10,'#9a9ea8');box(x+.7,y+.36,12,.1,.24,10,'#9a9ea8');
    box(x+.34,y+.36,22,.32,.26,8,'#b8bcc6');box(x+.36,y+.6,26,.28,.02,1.5,'#1a1a1a');box(x+.45,y+.4,30,.1,.1,4,'#a8303a');box(x+.82,y+.42,0,.05,.05,40,'#6b4a2b');box(x+.79,y+.39,40,.11,.11,5,'#c8ccd4');break;
  case 'ƥ':case 'ƪ':{box(x+.2,y+.45,0,.06,.06,16,'#5a3a1a');box(x+.74,y+.45,0,.06,.06,16,'#5a3a1a');box(x+.15,y+.5,12,.7,.08,26,'#d4af37');
    if(c==='ƪ'){box(x+.13,y+.48,10,.74,.12,30,'#141414');box(x+.13,y+.6,10,.74,.02,2,'#2a2a2a')}else{const k=['#7a2a2a','#2a4a7a','#3a6a3a','#5a3a6a'][(x*3+y)%4];box(x+.2,y+.58,15,.6,.02,20,k);box(x+.38,y+.59,24,.24,.02,8,'#e8c8a8');box(x+.36,y+.59,31,.28,.02,2,'#d4af37')}break}
  case 'ǂ':for(let i=0;i<5;i++)box(x+.08+i*.2,y+.45,0,.05,.05,30,'#4a4a52');box(x,y+.44,28,1,.07,2,'#3a3a42');box(x,y+.44,12,1,.07,1.5,'#3a3a42');break;
  case 'ǁ':box(x+.08,y+.12,0,.84,.76,2.5,'#c8a858',.9+h*.15);box(x+.2,y+.2,2.5,.3,.2,.6,'#b89848');break;
  case 'ȼ':{box(x+.05,y+.08,0,.9,.84,20,'#7a6a5a');box(x,y+.04,20,1,.92,4,'#5a4a3a');box(x+.25,y+.9,3,.5,.06,9,'#1a1010');const fl=1+Math.sin(t*10+x)*.2;box(x+.3,y+.92,4,.4,.04,5*fl,'#ff7a2a',1.4);
    box(x+.3,y+.3,24,.35,.35,6,'#3a3a3a');nlight(x+.5,y+.95,8,90,'255,140,60',.7);if(SET.part&&Math.random()<.03)sparks(x+.5,y+.5,1,['#c8c8c8'],20);break}
  case 'ʭ':box(x+.05,y+.1,0,.9,.8,10,'#8a8478');box(x+.02,y+.07,10,.96,.86,2,'#9a9488');box(x+.3,y+.25,12,.4,.5,2.5,'#a8a296');box(x+.38,y+.6,12,.24,.16,3.5,'#b0aa9e');break;
  case 'ʘ':box(x+.05,y+.1,0,.9,.8,12,'#6b4a2b');box(x+.08,y+.13,12,.84,.74,.5,'#e8dcb8');box(x+.35,y+.3,12.5,.3,.3,.3,'#c0392b');box(x+.2,y+.55,12.5,.4,.04,.3,'#3a6aa8');break;
  case 'ɱ':box(x+.08,y+.25,0,.84,.5,34,'#6b4a2b');box(x+.48,y+.75,4,.04,.02,26,'#3a2a1a');box(x+.38,y+.76,18,.06,.02,3,'#d4af37');box(x+.54,y+.76,18,.06,.02,3,'#d4af37');break;
  case 'ŝ':box(x+.15,y+.2,0,.3,.25,3,'#e8dcb8');box(x+.5,y+.45,0,.35,.2,2,'#d8ccaa');box(x+.3,y+.6,0,.4,.25,4,'#f4ecd4');box(x+.55,y+.15,0,.2,.2,6,'#e0d4b4');break;
  case 'ɯ':box(x+.1,y+.1,-.5,.8,.8,.6,'#2a2420',.85);box(x+.1,y+.1,0,.02,.6,14,'#d8d8d0',.6);box(x+.1,y+.1,14,.6,.02,.02,'#d8d8d0',.6);break;
  default:return false}return true}

/* ================= 6.9: la verità su Malakar, il settimo frammento e l'Abominio ================= */
// ---- la lore riscritta: il diario di Malakar racconta la verità, il Re racconta la sua versione ----
Object.assign(LORE,{
  tana1:['Diario di Malakar, I','Oggi mio fratello è stato incoronato. Io resterò il suo mago di corte. Ha giurato sulla Corona davanti al popolo. Non sa cosa c\'è dentro.'],
  tana2:['Diario di Malakar, II','Nei libri proibiti della Biblioteca ho trovato tre parole in eldoriano: «turmsi lahig uoi». Il re nasconde ciò che sta sotto. Quale re? E che cosa?'],
  cripta1:['Diario di Malakar, III','I morti non mentono. Ho parlato con loro nella Cripta. Mi hanno detto che la Corona non protegge il regno: tiene chiuso qualcosa.'],
  cripta2:['Diario di Malakar, IV','Velka è la mia allieva più dotata. Le ho insegnato a risvegliare le ossa: quando verrà il momento, mi serviranno guardiani che non possono morire.'],
  piramide1:['Diario di Malakar, V','La Sfinge mi ha posto il suo enigma: «Che cosa cresce quando lo nutri, e muore quando lo dimentichi?». Ho risposto: la paura. Mi ha guardato con pietà, e mi ha lasciato passare.'],
  piramide2:['Diario di Malakar, VI','Nei geroglifici di Khem è scritto che chi spezza la corona prende su di sé la sua maledizione. Lo so. Non mi spaventa.'],
  cristallo1:['Diario di Malakar, VII','Ho visto l\'Occhio. Sotto le cantine di Aldoria Vecchia, oltre una porta di pietra. È fatto di tutti quelli che ha divorato. E ogni volta che Aldric indossa la Corona, si apre un poco.'],
  cristallo2:['Diario di Malakar, VIII','Ho supplicato mio fratello di svuotare il quartiere. Ha riso di me davanti al Consiglio. Elara mi ha creduto. Lui no.'],
  fucina1:['Diario di Malakar, IX','Ignis mi ha forgiato le catene. Gli ho detto che servivano a ferire un dio. In un certo senso, è vero.'],
  fucina2:['Diario di Malakar, X','La notte della nebbia l\'Occhio si è svegliato. Sono sceso da solo e ho spezzato la Corona per chiudergli la bocca. Il suono è stato quello di mille vetri. Sopra di me, Aldric gridava il mio nome come quello di un traditore.'],
  abisso1:['Diario di Malakar, XI','Ho affidato i frammenti alle creature più terribili del regno, perché nessuno potesse riunirli. L\'ultimo l\'ho dato al Leviatano. Finché la Corona resta spezzata, l\'Occhio dorme.'],
  abisso2:['Diario di Malakar, XII','La maledizione dell\'Occhio è passata a me. La mia pelle è fredda, il cuore non batte più. Mi chiamano il Re Lich. Che lo facciano: meglio un mostro da odiare che una verità da temere.'],
  cittadella1:['Diario di Malakar, XIII','Mi sono chiuso nella Cittadella, sospeso sul Vuoto, lontano da tutti. Ogni giorno la maledizione mi prende un po\' di più.'],
  cittadella2:['Diario di Malakar, XIV','Se stai leggendo queste pagine, Aldric ti ha mandato a uccidermi. Fallo, se devi. Ma prima cerca la verità ad Aldoria Vecchia. E non dare mai a mio fratello il settimo cuore.']});
Object.assign(DLORE,{cittadella:'La fortezza in cui Malakar si è rinchiuso, sospesa sul Vuoto, lontano da tutti. Ogni pietra trattiene un po\' della maledizione che lo consuma.'});
STORY.intro='Eroe, ascoltami. Il Re Lich Malakar, mio fratello, ha infranto la Corona di Voxel: il cuore che tiene unito il regno. I sei frammenti sono finiti nei luoghi più oscuri: la Tana dei Goblin, la Cripta Dimenticata, la Piramide di Khem, le Caverne di Cristallo, la Fucina Infernale e l\'Abisso Sommerso. Riportameli. Quando la Corona sarà di nuovo intera, i mostri spariranno, i dungeon si spegneranno e Aldoria tornerà quella di un tempo.';
STORY.forge='I sei frammenti si uniscono tra le mani del Re in un lampo di luce. Aldric posa la Corona sul capo: per un attimo i suoi occhi brillano di una luce rossa, poi sorride. Nella sala del trono si apre un portale violaceo: la via per la Cittadella del Vuoto.';
STORY.end='Malakar è caduto. Il Re Aldric siede sul trono con la Corona intera: la sua voce riempie la sala come un tuono, la sua pelle sembra pietra.\n\n«Grazie a te Aldoria è al sicuro. Nessuno potrà più minacciarla.»\n\nTi nomina Campione di Aldoria e ti colma di doni: oro, armi forgiate per il Re e una scorta di pozioni.\n\nMa i dungeon continuano a rinascere, più oscuri a ogni ciclo. E la notte, sotto la città, qualcosa respira.';
for(const s of ISC2){if(s.f==='malakar')s.tx='Ma Malakar, fratello del Re Aldric, studiò le arti proibite. Così racconta il Re: bramava il potere della Corona, e divenne il Re Lich.';
  if(s.f==='shatter')s.tx='In quella stessa notte la Corona andò in pezzi. Sei frammenti volarono lontano, nei luoghi più oscuri del regno.';
  if(s.f==='seal')s.tx='Il Re fece murare il vecchio quartiere e diede la colpa al fratello. Ma ad Aldoria i segreti non dormono mai a lungo.'}
Object.assign(SECD.c5,{5:'«Fratello, tu la chiami leggenda. Io l\'ho vista. Sotto Aldoria Vecchia qualcosa si nutre delle nostre vite, e la Corona intera gli apre la strada. Svuota il quartiere, ti prego. Se non mi ascolterai, la spezzerò io stesso.»\n\n— M.'});
Object.assign(SECD.c6,{5:'«Qui riposa Aldric il Primo, che chiuse l\'Occhio nella pietra con sette cuori: sei nella Corona, uno nella serratura. Che nessuno del suo sangue lo riapra, né per amore né per potere.»'});
Object.assign(SECD.c13,{5:'«Ho mentito al mio popolo. Ho detto che Aldoria Vecchia è bruciata per un incendio. È stato mio fratello, ne sono certo: quella notte era laggiù, sotto le cantine. Quando la Corona sarà di nuovo intera, i mostri spariranno e nessuno ricorderà più.»'});
// ---- sei nuovi pezzi della verità ----
Object.assign(SECD,{
  v1:['vecchia',47,40,'staff','Il bastone spezzato','Un bastone da mago spezzato in due, con le rune di Malakar. Intorno la terra è fusa come vetro: qui qualcuno ha combattuto contro qualcosa che saliva da sotto.'],
  v2:['vecchia',22,60,'note','La lettera di una sopravvissuta','«Non è stato il principe! Il principe Malakar ci ha svegliati in piena notte e ci ha detto di correre verso la città. Poi è sceso nella nebbia, da solo. Quando siamo arrivati ai cancelli, erano già chiusi.»'],
  v3:['in_cappella',3,10,'book','La preghiera di Fratel Tobia','«All\'alba il principe mago è passato dalla cappella, ferito, con la pelle che diventava grigia. Mi ha chiesto di pregare per lui e di non dire a nessuno che era stato lui a fermarla. Ho mantenuto la promessa fino a oggi.»'],
  v4:['culto',11,14,'note','La tavoletta dell\'altare','«Sette cuori chiudono l\'Occhio: sei nella Corona, uno nella serratura. Chi porta la Corona intera beve dal suo potere. E il suo potere beve noi.»'],
  v5:['cas_prigioni',3,1,'note','La confessione del prigioniero','«Ero capitano della Guardia. Quella notte il Re ci ordinò di chiudere i cancelli di Aldoria Vecchia, per contenere la nebbia. Dentro c\'era ancora gente. Bussavano. Noi abbiamo tenuto chiuso. Il Re mi ha rinchiuso qui perché non lo raccontassi.»'],
  v6:['vecchia',70,70,'note','L\'ultima lettera di Malakar','«Se qualcuno legge queste righe, sappia che non ho tradito Aldoria. Ho spezzato la Corona perché intera nutre l\'Occhio. Il settimo cuore, quello della serratura, l\'ho nascosto dove la vecchia piazza beveva. Non darlo mai a mio fratello.»'] });
SECL.staff=[[-.4,-.05,0,.38,.07,.07,'#4a3424'],[.04,-.02,0,.36,.07,.07,'#4a3424'],[.36,-.04,0,.1,.1,.6,'#8a6aff',1.3]];
const TRUTHT='Malakar non ha distrutto Aldoria Vecchia: ha cercato di salvarla.\n\nSotto il quartiere dorme da mille anni l\'Abominio, l\'Occhio che Aldric il Primo chiuse nella pietra con sette cuori: sei nella Corona, uno nella serratura. La Corona intera nutre l\'Occhio, e dà a chi la porta un potere quasi invincibile.\n\nMalakar lo scoprì e avvertì il fratello. Il Re rise di lui. La notte della nebbia l\'Occhio si svegliò: Malakar scese da solo, spezzò la Corona per chiudergli la bocca e ne prese su di sé la maledizione. Diventò il Re Lich.\n\nIl Re Aldric, convinto che fosse stato il fratello, fece chiudere i cancelli con la gente ancora dentro, murò il quartiere e comprò il silenzio di chi sapeva.\n\nIl settimo cuore è ancora nascosto ad Aldoria Vecchia, dove la vecchia piazza beveva.';
function truthDone(){return Object.keys(SECD).every(k=>P.sec&&P.sec[k])}
// ---- dove nascondere le cose nelle rovine (la pianta cambia con la stanza del server) ----
function freeNear(x,y){for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const u=x+dx,v=y+dy;
  if(u>2&&v>2&&u<N-3&&v<N-3&&M[v][u]===0&&!DEC[v][u]&&!ents.some(e=>(e.px|0)===u&&(e.py|0)===v))return[u,v]}return[x,y]}
const WELL=[80,14];
function reach(x,y){const d=bfs(P.px|0,P.py|0);if(d[y*N+x]>=0)return;let b=null,bd=1e9;for(let v=1;v<N-1;v++)for(let u=1;u<N-1;u++)if(d[v*N+u]>=0){const q=Math.abs(u-x)+Math.abs(v-y);if(q<bd){bd=q;b=[u,v]}}
  if(!b)return;let[u,v]=b;const cut=(a,c)=>{if(a>0&&c>0&&a<N-1&&c<N-1&&!WK(M[c][a])){M[c][a]=0;DEC[c][a]=''}};while(u!==x){u+=Math.sign(x-u);cut(u,v)}while(v!==y){v+=Math.sign(y-v);cut(u,v)}}
function truthLoad(k){if(!P)return;
  if(k==='vecchia'){for(const e of ents)if(e.sid&&e.sid[0]==='v'){const[x,y]=freeNear(e.px|0,e.py|0);e.px=x+.5;e.py=y+.5;reach(x,y)}
    const[wx,wy]=WELL;for(let y=wy-2;y<=wy+2;y++)for(let x=wx-2;x<=wx+2;x++){M[y][x]=0;DEC[y][x]=Math.abs(x-wx)+Math.abs(y-wy)>2?'':''}
    for(let x=wx-6;x<=wx+2;x++)if(M[wy+3]&&M[wy+3][x]!==0){M[wy+3][x]=0;DEC[wy+3][x]=''}
    M[wy][wx]=6;DEC[wy][wx]='ʬ';for(const[x,y]of[[wx-2,wy-2],[wx+2,wy-2],[wx-2,wy+2]]){M[y][x]=6;DEC[y][x]='Ŗ'}
    reach(wx,wy+1);if(P.tru&&!P.s7)ents.push({k:'shard7',n:'',px:wx+.5,py:wy+1.5})}
  if(k==='cella'&&P.te===1)ghostSpawn(4,3);
  if(k==='cas_prigioni'){if(P.te===1&&!P.key)ghostSpawn(6,5);if(P.te>=2){const pr=ents.find(e=>e.nid==='prigioniero');if(pr)ents.splice(ents.indexOf(pr),1);ents.push(mkNpc('aldric_p',2,2))}}
  if(k==='in_castle'&&P.te>=2){const r=ents.find(e=>e.nid==='re');if(r){r.nid='malakar_re';r.n='Re Malakar';r.m=npcModel('malakar_re',{},r)}const c=ents.find(e=>e.nid==='ciambellano');if(c)ents.splice(ents.indexOf(c),1)}
  if(k==='occhio')occEnter()}
// 7.49: il fantasma di Malakar ha il suo modello nuovo (quello del Re Malakar, trasparente e azzurro)
let MGM=null;function malakarGhostM(){if(!MGM){try{MGM=ghostL(npcModel('malakar_re',{},{px:1,py:1}),.6,'#bfe6ff')}catch(_){MGM=hum('#bfe6ff','#e8f6ff',1.15,[6,'#9ac4e8'])}}return MGM}
// 7.49: i personaggi dei filmati hanno i modelli nuovi (prima erano gli omini vecchi)
const CFM={};function cFig(id,o){const k=id+'|'+JSON.stringify(o||{});if(!CFM[k]){try{CFM[k]=npcModel(id,o||{},{px:3,py:(o&&o.seed)||3})}catch(_){CFM[k]=hum('#888',SKIN)}}return CFM[k]}
const CROWD49=['mv_frutta','mv_pesce','mv_fiori','gerald','tommaso','rosa','nino','marta','giacomo','lucia','ottavia','gemma'];
function ghostSpawn(x,y){if(ents.some(e=>e.nid==='malakar_g'))return;const e=mkNpc('malakar_g',x,y);e.m=malakarGhostM();e.ghost=1;ents.push(e);if(P.key)ghostGate()}
function ghostGate(){if(ents.some(e=>e.k==='po'&&e.to==='culto'))return;const g2=ents.find(e=>e.nid==='malakar_g');const[x,y]=g2?nearFree(g2.px|0,g2.py|0):[P.px|0,P.py|0];ents.push(Object.assign(po(x,y,'culto',{st:'void'}),{n:'Il varco di Malakar',col:'#9ad0ff'}))}
const SH7L=()=>{const u=Math.sin(t*2)*1.5;return[[-.1,-.1,2+u,.2,.2,8,'#8a1020',1.2],[-.05,-.05,10+u,.1,.1,3,'#ffd0d0',1.5]]};
function shard7(e){ents.splice(ents.indexOf(e),1);P.s7=1;flash('#ffffff',.6,700);jingle([57,60,64,69,72],.2,'sawtooth');
  PA={ti:'Il settimo cuore della Corona',tx:'In fondo al pozzo prosciugato della vecchia piazza, avvolto in un panno nero, c\'è un frammento che nessuno ha mai visto. È più scuro degli altri sei, e caldo come qualcosa di vivo.\n\nÈ il settimo cuore della Corona: la serratura dell\'Occhio.'+(P.st>=5?'\n\nIl Re Aldric deve saperlo.':'\n\nIl Re Aldric deve saperlo, ma prima la Corona va riunita.')};pn('txt');banner('Il settimo frammento','La serratura dell\'Occhio','corona');npcMarks();save()}
// ---- domande ad Aldric e a Malakar ----
let QAS={id:'',i:-1};
const QA={
  re:[['Cos\'è la Corona di Voxel?','Il cuore del regno. Aldric il Primo la forgiò con sei gemme, una per ogni terra. Finché è intera, Aldoria è forte.'],
    ['Chi è Malakar?','Mio fratello. Era il mago di corte, il più dotato che Aldoria abbia mai avuto. Poi ha studiato i libri proibiti e ha tradito tutti noi.'],
    ['Cosa è successo ad Aldoria Vecchia?','Una notte di nebbia e di fuoco. Mio fratello era laggiù, sotto le cantine, con i suoi riti. Quando è finita, il quartiere era vuoto. L\'ho fatto murare, perché nessuno soffrisse ancora.'],
    ['Cosa succederà quando la Corona sarà intera?','I mostri spariranno, i dungeon si spegneranno e Aldoria tornerà quella di un tempo. Ne sono certo.'],
    ['Chi era la Regina Elara?','Mia moglie. Quella notte è scomparsa. Non parlarmene più.'],
    ['Cosa c\'è sotto la città?','Cantine, fogne e topi. Nient\'altro. Chi ti ha messo in testa queste storie?'],
    ['Un consiglio per un eroe?','Comincia dalla Tana dei Goblin, nella Foresta di Elmwood. Poi la Cripta nel cimitero, la Piramide nel deserto, le Caverne di Cristallo e la Fucina sui Picchi, e per ultimo l\'Abisso, sotto il porto. Compra pozioni da Mira e torna da me con ogni frammento.']],
  re5:[['Come vi sentite con la Corona?','Mai stato così forte. Sento il regno intero tra le mani... e qualcosa sotto i piedi, che respira. Sarà la stanchezza.'],
    ['Perché i dungeon non sono spariti?','Ci vuole tempo. La Corona deve abituarsi alla mia testa, e io a lei. Presto, vedrai.']],
  aldric_p:[['Perché hai nascosto la verità?','Perché ero il Re. Un re non può dire al suo popolo che sotto le loro case dorme qualcosa che li divora.'],
    ['Sapevi dell\'Occhio?','Conoscevo la leggenda di Aldric il Primo. Credevo fosse una favola. Quando Malakar ed Elara me ne parlarono, ho riso di loro.'],
    ['Cosa è successo quella notte?','Ho fatto chiudere i cancelli del vecchio quartiere. Dentro c\'era ancora gente. Bussavano. Ho ordinato di tenere chiuso, per contenere la nebbia.'],
    ['Perché pensavi fosse stato Malakar?','Era laggiù, e la Corona si è spezzata tra le sue mani. Che altro dovevo pensare? Era più facile odiare lui che guardare me stesso.'],
    ['La Corona ti rendeva più forte?','Quasi invincibile. Ma ogni giorno sentivo la voce sotto la città diventare più forte, insieme a me.'],
    ['Ti penti?','Ogni notte, in questa cella, sento ancora bussare.'],
    ['Che ne sarà di te?','Mio fratello ha più pietà di quanta ne meriti. Resterò qui. È giusto così.']],
  malakar:[['Chi sei davvero?','Malakar, fratello di Aldric. Mago di corte e, per tutti, il Re Lich. Hai ucciso il mio corpo nella Cittadella. Non te ne faccio una colpa: eri stato ingannato, come tutti.'],
    ['Cosa è successo quella notte?','L\'Occhio si è svegliato. Era stata la Corona intera a nutrirlo, anno dopo anno, sulla testa di mio fratello. Sono sceso nelle cantine e l\'ho fermato nell\'unico modo possibile: spezzando la Corona.'],
    ['Cos\'è l\'Abominio?','Ciò che Aldric il Primo chiuse nella pietra mille anni fa. Si nutre di vite e di potere, ed è fatto di tutti quelli che ha preso. Anche di chi viveva ad Aldoria Vecchia.'],
    ['Perché sei diventato il Re Lich?','Spezzando la Corona ho preso su di me la sua maledizione. Il mio cuore ha smesso di battere. Era il prezzo per tenerlo addormentato.'],
    ['Perché hai nascosto i frammenti nei dungeon?','Li ho affidati alle creature più terribili del regno, perché nessuno potesse riunirli. Non immaginavo che mio fratello avrebbe mandato un eroe a riprenderli.'],
    ['E il settimo frammento?','È il cuore della Corona, la serratura dell\'Occhio. Aldric il Primo lo lasciò sotto il quartiere. Io l\'ho nascosto nel pozzo della vecchia piazza, perché nessun re potesse prenderlo.'],
    ['Cosa sai della Regina Elara?','Fu l\'unica a credermi. Quella notte scese a cercare i bambini rimasti nel quartiere. Non è più tornata.'],
    ['Il culto e il Ciambellano?','Il culto adorava l\'Occhio e gli portava doni. Il Ciambellano lo sapeva, e pagava le guardie perché tacessero.'],
    ['Eri tu nei miei sogni?','Sì. Era l\'unico modo per parlarti senza che mio fratello lo sapesse. «Turmsi lahig uoi»: il re nasconde ciò che sta sotto.']],
  malakar_g:[['Come posso fermarlo?','Con questa chiave aprirai la porta di pietra nella stanza del culto. Dietro c\'è l\'Occhio. Colpisci prima le braccia, poi il ventre, poi la testa. Io sarò con te, per quanto può esserlo un fantasma.']],
  malakar_re:[['Cosa farai ora?','Governare, con meno potere e più verità. Ho fatto distruggere la Corona: Aldoria non avrà mai più bisogno di un re invincibile.'],
    ['E i dungeon?','I signori dei frammenti sono ancora là fuori, e i dungeon rinascono ancora. Il male che ho sparso per proteggere il regno non si cancella in un giorno. Avremo ancora bisogno di te.'],
    ['Un consiglio?','Il Maestro Dino insegna tecniche che anche io invidio. E se cerchi oro, ricorda che il Casinò vince sempre... tranne quando vinci tu.']]};
function qaHTML(id){const L=id==='re'?QA.re.concat(P.st>=5?QA.re5:[]):id==='malakar_g'?QA.malakar.concat(QA.malakar_g):id==='malakar_re'?QA.malakar.concat(QA.malakar_re):QA[id]||[];if(!L.length)return'';
  let h=`<h4>❓ Domande</h4><div class="qa">`+L.map((q,i)=>`<button onclick="QAS={id:'${id}',i:${i}};pn('npc')"${QAS.id===id&&QAS.i===i?' class="on"':''}>${q[0]}</button>`).join('')+'</div>';
  if(QAS.id===id&&L[QAS.i])h+=`<div class="qb dlga" data-q="${esc(L[QAS.i][0])}"><i>«${esc(L[QAS.i][1])}»</i></div>`;return h}
function reExtraHTML(){let h='';if(P.s7===1&&!P.te)h+=P.st>=5?`<div class="qb"><b>Il settimo frammento</b><br><button onclick="arrestHero()">Mostra al Re il settimo cuore della Corona</button></div>`:'<div class="qb"><i>«Un settimo frammento? La Corona ne ha sei. Portameli prima, poi parleremo di favole.»</i></div>';return h+qaHTML('re')}
function ghostHTML(){let h='';if(!P.key)h+=`<div class="qb"><i>«Non avere paura. Sono Malakar. Mio fratello ti ha mentito, come ha mentito a tutti. Il settimo cuore non è un falso: è la serratura di ciò che dorme sotto Aldoria. E adesso che lui ha la Corona, l\'Occhio si sta svegliando di nuovo.»</i><br><button onclick="takeKey()">Prendi la chiave della porta di pietra</button></div>`;
  else h+='<div class="qb"><i>«Il varco ti porta nella stanza del culto. Apri la porta di pietra. E ricorda: braccia, ventre, testa.»</i></div>';return h+qaHTML('malakar_g')}
function takeKey(){P.key=1;banner('La Chiave dell\'Occhio','Malakar ti ha liberato: la porta di pietra ora si aprirà','pergamena');jingle([60,63,67,72],.18,'triangle');ghostGate();save();if(PA&&PA.nid==='malakar_g')pn('npc')}
Object.assign(NPCS,{malakar_g:{n:'Fantasma di Malakar',c:'#bfe6ff',hat:'#9ac4e8',ln:['Il tempo stringe. Ogni notte l\'Occhio si apre un po\' di più.']},
  malakar_re:{n:'Re Malakar',c:'#3a2a6a',hat:'#d4af37',ln:['Aldoria è libera. E tu sei il motivo.','Il mio cuore batte di nuovo. Avevo dimenticato quanto fa rumore.']},
  aldric_p:{n:'Aldric, il Re deposto',c:'#5a5a5a',hat:'#3a3a3a',ln:['Ero il Re di Aldoria. Ora sono solo un uomo che ha sentito bussare e non ha aperto.']}});
// ---- l'arresto e la cella ----
function bnClear(){BQ.length=0;const el=$('bnr');if(el)el.className=''}
function arrestHero(){bnClear();P.te=1;P.s7=2;save();cl();started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';
  playCine(ARRC,'dungeon',()=>{started=1;document.body.classList.add('ig');last=performance.now();load('cella','in_castle');PA={ti:'Le prigioni del castello',tx:'Ti hanno tolto il settimo frammento e ti hanno gettato in una cella. Fuori è notte. Il freddo arriva prima della luce.'};pn('txt')})}
const ARRC=[{d:5,f:'throne',tx:'Il Re rigira il frammento tra le dita. «Un settimo frammento? La Corona ne ha sei. È un falso.»'},
  {d:5.5,f:'throne2',tx:'«Vuoi farmi credere che la mia Corona sia incompleta, per prenderla tu. Guardie! Arrestatelo!»'},
  {d:5.5,f:'cell',tx:'Ti gettano in una cella. La notte scende sul castello. Poi, nel buio, una luce fredda.'}];
// ---- la stanza dell'Occhio e l'Abominio ----
Object.assign(E,{abo_braccio:{n:'Braccio dell\'Abominio',hp:520,at:14,xp:300,sp:0,r:2.8,cd:1.8,ag:40,np:1,pt:1,m:[]},
  abo_ventre:{n:'Ventre dell\'Abominio',hp:1300,at:16,xp:600,sp:0,r:2.6,cd:2,ag:40,np:1,pt:1,m:[]},
  abo_testa:{n:'Testa dell\'Abominio',hp:1900,at:20,xp:1500,sp:0,r:2.6,cd:1.8,ag:40,np:1,pt:1,m:[]},
  anima:{n:'Anima perduta',hp:60,at:9,xp:20,sp:2.2,r:1.1,cd:1.2,ag:40,np:1,m:hum('#c8d0d8','#e8eef4',.9,[3,'#9aa4b0'])}});
const BX=14,BY=6.5,ARMS=[[7.5,8.5,10,7.5],[20.5,8.5,18,7.5],[11.5,13.5,12,10.5],[16.5,13.5,16,10.5]];
function genOcchio({n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){M[y][x]=0;DEC[y][x]=''}for(let y=1;y<=11;y++)for(let x=9;x<=19;x++){M[y][x]=6;DEC[y][x]='ʌ'}
  ents.push({k:'abo',px:BX,py:BY});ents.push(po(14,n-2,'culto',{st:'up',n:'Porta di pietra'}));return[14,n-4]}
function genCella({n}){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)M[y][x]=0;M[1][1]=6;DEC[1][1]='ǁ';for(let x=1;x<n-1;x++){M[n-2][x]=6;DEC[n-2][x]='ǂ'}M[1][n-2]=6;DEC[1][n-2]='ɯ';return[4,5]}
Object.assign(Z,{occhio:{n:'La stanza dell\'Occhio',lv:16,N:28,a:'#2a2422',b:'#262020',bg:'#030202',mus:'abominio',gen:genOcchio,dist:1,wl:'#1a1414',wh:44,nolamp:1,rd:['#2a2422','#262020']},
  cella:{n:'Prigioni del castello · una cella',lv:1,N:9,a:'#4a4a52',b:'#44444c',bg:'#050508',mus:'dungeon',gen:genCella,dist:1,wl:'#3a3a42',wh:34,nolamp:1,rd:['#4a4a52','#44444c']}});
let OCC=null;
function occEnter(){if(P.te!==1){OCC=null;const a=ents.find(e=>e.k==='abo');if(a)a.dead=1;return}OCC={ph:1,nx:3,sw:7,sm:5,bm:4,pools:[],shk:0,win:0,t:0};
  for(const[x,y]of ARMS){const e=mk('abo_braccio',x|0,y|0);e.px=e.ax=x;e.py=e.ay=y;e.al=1;ents.push(e)}
  setTimeout(()=>{if(Zk==='occhio'&&OCC&&!OCC.intro){banner('L\'Abominio','Ciò che dormiva sotto Aldoria','teschio');const a=ents.find(e=>e.k==='abo');if(a)cineOn(a,1.05,2.2);flash('#400000',.5,600);growl()}},600)}
function growl(){if(!AU.ac||!SET.sf)return;try{const t0=AU.ac.currentTime;vtone(t0,28,1.6,'sawtooth',.8,.06*SET.sf);vtone(t0+.05,29,1.5,'sawtooth',.7,.05*SET.sf);vtone(t0+.4,40,1,'square',.5,.02*SET.sf)}catch(_){}}
function partAt(id){return ents.filter(e=>e.k==='en'&&e.t===id)}
function occTick(dt){if(Zk!=='occhio'||!OCC||!P){if(OCCZ){OCCZ=0;CZ.goal=1}return}if(!CAM.f){OCCZ=1;CZ.goal=.8}if(OCC.intro){occIntroTick(dt);return}occBeats();const O=OCC;O.t+=dt;for(const e of ents)if(e.ax!=null){e.px=e.ax;e.py=e.ay}if(O.shk>0){O.shk-=dt;camX+=(Math.random()-.5)*14;camY+=(Math.random()-.5)*8}
  for(const p of O.pools){p.t-=dt;p.k=(p.k||0)-dt;if(p.k<=0&&Math.hypot(P.px-p.x,P.py-p.y)<p.r){p.k=.5;hurtP(p.d)}}O.pools=O.pools.filter(p=>p.t>0);
  if(O.win){O.win-=dt;if(O.win<=0){O.win=0;OCC=null;trueEnding()}return}
  const arms=partAt('abo_braccio'),ven=partAt('abo_ventre'),tes=partAt('abo_testa'),atk=(ZZ.lv*.1+1)*DF.dm;
  if(O.ph===1&&!arms.length){O.ph=2;O.nx=2;banner('Il ventre si apre','Le braccia sono cadute: ora colpisci il ventre','teschio');flash('#5a0000',.5,500);growl();O.shk=.8;const e=mk('abo_ventre',14,12);e.px=e.ax=14;e.py=e.ay=12.6;e.al=1;ents.push(e);O.t=0;return}
  if(O.ph===2&&!ven.length&&O.t>1){O.ph=3;O.nx=2;banner('L\'Occhio si apre','La testa si abbassa: colpiscila','teschio');flash('#ffffff',.5,600);growl();O.shk=1.2;const e=mk('abo_testa',14,12);e.px=e.ax=14;e.py=e.ay=12.6;e.al=1;ents.push(e);O.t=0;return}
  if(O.ph===3&&!tes.length&&O.t>1){O.win=2.2;O.shk=2;flash('#ffffff',.8,1500);growl();for(const e of ents.filter(x=>x.k==='en'))kill(e);return}
  if((O.nx-=dt)<=0){if(O.ph===1){O.nx=arms.length<=2?2.4:3.2;const a=arms[Math.floor(Math.random()*arms.length)];if(a){a.slT=t;fx.push({k:'warn',x:P.px,y:P.py,r:1.6,t:1.1,mx:1.1,dmg:14*atk*1.4});O.shk=.25}}
    else if(O.ph===2){O.nx=2.8;for(let i=0;i<3;i++){const x=P.px+(Math.random()-.5)*4,y=P.py+(Math.random()-.5)*4;fx.push({k:'warn',x,y,r:1.3,t:1,mx:1,dmg:16*atk});setTimeout(()=>{if(OCC)OCC.pools.push({x,y,r:1.1,t:6,d:16*atk*.25})},1000)}}
    else{O.nx=2.6;const dx=P.px-14,dy=P.py-12.6,dd=Math.hypot(dx,dy)||1;for(let i=1;i<=11;i++)fx.push({k:'warn',x:14+dx/dd*i*1.1,y:12.6+dy/dd*i*1.1,r:.6,t:.8+i*.07,mx:.8+i*.07,dmg:20*atk})}}
  if(O.ph===1&&(O.sw-=dt)<=0){O.sw=7.5;for(let i=0;i<9;i++){const a=.15+i*.35;fx.push({k:'warn',x:BX+Math.cos(a)*6.2,y:BY+Math.sin(a)*6.2+1,r:1.4,t:.9+i*.12,mx:.9+i*.12,dmg:14*atk*1.2})}flt(P,'Spazzata!','#ff8a6a')}
  if(O.ph>=2&&(O.sm-=dt)<=0){O.sm=O.ph===3?6:8;if(partAt('anima').length<6)for(let i=0;i<3;i++){const[x,y]=freeNear(6+Math.floor(Math.random()*16),14+Math.floor(Math.random()*8));const m=mk('anima',x,y);m.al=1;ents.push(m)}if(Math.random()<.5)scream()}
  if(O.ph===3&&(O.bm-=dt)<=0){O.bm=5;const n=14;for(let i=0;i<n;i++){const an=i*6.283/n;PJ.push({x:14,y:12.6,vx:Math.cos(an)*5,vy:Math.sin(an)*5,t:2.4,d:20*atk*.7,c:'#ff3a3a'})}growl()}
  if(Math.random()<dt*.08)growl()}
// il mostro: una torre di carne e voci, tentacoli, pezzi di persone, un ventre e un occhio
const ABT=[[3.5,0,42,'#2a1418'],[3.2,42,50,'#4a2026'],[2.8,92,46,'#5a2a30'],[2.2,138,44,'#4a2026']],ABS=[[10.8,7.2,104],[17.2,7.2,104],[12.2,9.6,70],[15.8,9.6,70]];
function aboDraw(e){if(e.dead)return;const ph=OCCph(),br=1+Math.sin(t*1.6)*.03,X=BX,Y=BY,skin='#b89a84',bone='#e8dcc8',dr=ph===3?-10:0;
  g.fillStyle='rgba(0,0,0,.55)';g.beginPath();g.ellipse(PX(X,Y),PY(X,Y,0),330,165,0,0,6.3);g.fill();
  const arms=partAt('abo_braccio'),arm=(i,front)=>{const[ax,ay]=ARMS[i],[sx,sy,sz]=ABS[i],al=arms.find(a=>a.ax===ax&&a.ay===ay);if(!front&&!al)return;
    const up=al&&al.slT&&t-al.slT<.7?Math.sin((t-al.slT)/.7*Math.PI):0,hit=al&&al.fl>0;
    for(let k=0;k<=18;k++){const u=k/18,w=al?Math.sin(t*2.2+i*1.7+u*5)*.45*(1-u)*(1-up):0,x=sx+(ax-sx)*u+w,y=sy+(ay-sy)*u-w*.5,
        z=al?sz*(1-u)*(1-u*.2)+Math.sin(u*Math.PI)*46+up*90*Math.sin(u*Math.PI*.9):Math.max(0,sz*(1-u)*.15),s=1.05-u*.6;
      box(x-s/2,y-s/2,z,s,s,Math.max(4,s*20),hit?'#ff8a8a':al?(k%2?'#4a2026':'#5a2a30'):'#24100f',al?1:.6);
      if(al&&k%5===3){box(x-s*.3,y+s/2,z+s*8,s*.6,.04,s*6,skin,.85);box(x-.05,y+s/2+.02,z+s*12,.1,.02,1.5,'#1a0a0a')}}
    if(al){box(ax-.45,ay-.45,0,.9,.9,4,'#3a1418');for(let c=0;c<4;c++)box(ax-.4+c*.25,ay+.35,0,.08,.3,9-c%2*3,bone)}};
  arm(0,0);arm(1,0);
  // corpo a gradoni: carne viva che respira
  ABT.forEach(([r,z,h,c],i)=>{const zz=(z+(i===3?dr:0))*br,hh=h*br;box(X-r,Y-r,zz,r*2,r*2,hh,c);
    for(let k=0;k<6;k++){const q=((k*.53+i*.29)%1)*(r*2-1.4)-r+.2,sz=.7+((k*7+i*3)%5)*.14,lh=hh*(.45+((k+i)%3)*.18),lz=zz+((k*11+i*5)%9)*1.5,sw=Math.sin(t*1.3+k+i)*.04,c2=(k+i)%2?'#5a2a30':'#4a2026';if(k%2)box(X+q+sw,Y+r-.2,lz,sz,sz*.5+.2,lh,c2);else box(X+r-.2,Y+q+sw,lz,sz*.5+.2,sz,lh,c2)}
    for(let k=0;k<5;k++){const q=((k*.37+i*.21)%1)*r*1.8-r*.9;box(X+q,Y+r,zz+4,.07,.03,hh-8,'#7a1a22',1.1);box(X+r,Y+q,zz+4,.03,.07,hh-8,'#6a161e',1.1)}});
  // pezzi di persone: volti, mani e braccia che escono dalla carne
  for(let i=0;i<18;i++){const a=(i*.618)%1,side=i%2,tier=1+i%3,[r,z0,h]=ABT[tier],z=z0*br+8+((i*13)%Math.max(8,h-18)),x=side?X-r+.3+a*(r*2-.6):X+r+.03,y=side?Y+r+.03:Y-r+.3+a*(r*2-.6),ox=side?0:.02,oy=side?.02:0;
    if(i%3===0){box(x-.22,y-.22,z,.44,.44,7,skin,.9);box(x-.12+ox,y-.12+oy,z+4,.08,.08,1.4,'#140808');box(x+.06+ox,y-.12+oy,z+4,.08,.08,1.4,'#140808');box(x-.06,y-.06,z+1,.14,.14,1.6,'#3a0a0a')}
    else if(i%3===1){const sw=Math.sin(t*3+i)*.2;box(x-.07+(side?sw:0),y-.07+(side?0:sw),z,.14,.14,12,skin,.85);box(x-.14+(side?sw:0),y-.14+(side?0:sw),z+12,.28,.28,3,skin,.85);for(let f=0;f<3;f++)box(x-.12+f*.1+(side?sw:0),y-.04+(side?0:sw),z+15,.04,.04,2.5,skin,.85)}
    else{box(x-.25,y-.06,z,.5,.12,.6,bone)}}
  // il ventre: una bocca verticale con i denti
  const ven=partAt('abo_ventre')[0],vo=ph===2?1:ph===3?.55:0,fy=Y+3.22;
  if(vo){const hit=ven&&ven.fl>0,zz=52*br,hh=34*vo;box(X-1.6,fy,zz,3.2,.06,hh,hit?'#ff5a5a':'#140404');box(X-1.2,fy+.02,zz+2,2.4,.04,hh-4,'#6a0a0a',1.2+Math.sin(t*6)*.2);
    for(let i=0;i<8;i++){box(X-1.5+i*.4,fy+.04,zz+hh-4,.14,.05,4,bone);box(X-1.4+i*.4,fy+.04,zz,.14,.05,4,bone)}nlight(X,fy+1,zz+14,170,'255,60,40',.8*vo)}
  else box(X-1.6,fy,56*br,3.2,.05,1.5,'#140404');
  // la testa e l'occhio
  const eo=ph===3?.85+Math.sin(t*1.2)*.12:ph===4?0:occEyePeek()?.95:Math.max(0,Math.sin(t*.35)*.15),ez=(150+dr)*br,tes=partAt('abo_testa')[0],hit2=tes&&tes.fl>0,ey=Y+2.22;
  box(X-1.7,ey,ez-4,3.4,.08,32,'#3a1418');if(eo>.02){box(X-1.55,ey+.02,ez+12-13*eo,3.1,.05,26*eo,hit2?'#ffd0d0':bone,1.15);const ix=Math.sin(t*.9)*.5+Math.max(-.5,Math.min(.5,(P.px-X)*.04));
    box(X-.55+ix,ey+.05,ez+12-9*eo,1.1,.04,18*eo,'#8a0a0a',1.3);box(X-.18+ix,ey+.08,ez+12-7*eo,.36,.03,14*eo,'#000000');
    nlight(X,ey+1,ez,240,'255,40,40',.9*eo);if(SET.ultra)GLOW.push([X,ey+1,ez,100,'255,40,40',.4*eo])}
  else box(X-1.2,ey+.02,ez+10,2.4,.04,1.2,'#1a0808');
  // corona di tentacoli in cima
  for(let i=0;i<8;i++){const a=t*.5+i*.785,r=1.6;for(let k=0;k<8;k++){const z=(182+dr)*br+k*7,x=X+Math.cos(a)*r*(1-k*.07)+Math.sin(t*1.8+i+k*.5)*.35*(k/8),y=Y+Math.sin(a)*r*(1-k*.07)+Math.cos(t*1.5+i+k*.4)*.25*(k/8);box(x-.2+k*.012,y-.2+k*.012,z,.4-k*.025,.4-k*.025,7,k%2?'#4a2026':'#5a2a30')}}
  arm(2,1);arm(3,1)}
// la camera guarda anche il mostro: è troppo grande per stare nello schermo
const _camTarget=camTarget;camTarget=function(){const r=_camTarget();if(Zk==='occhio'&&OCC&&!CAM.f)return[r[0]+(BX-r[0])*.4,r[1]+(BY+1-r[1])*.4];return r};
let OCCZ=0;
function OCCph(){return OCC?OCC.ph:P&&P.te>=2?4:1}
function occOverlay(){g.save();g.setTransform(DPR,0,0,DPR,0,0);const won=P.te>=2,bs=blobSpr('150,160,150'),R=W*.4;g.globalAlpha=won?.06:.18;for(let k=0;k<6;k++){const x=((t*(10+k*4)+k*300)%(W*1.6))-W*.3,y=H*(.15+k*.14)+Math.sin(t*.4+k)*20;
    g.drawImage(bs,x-R,y-R,2*R,2*R)}g.globalAlpha=1;
  for(const p of(OCC?OCC.pools:[])){const[x,y]=scr(p.x,p.y,0);g.fillStyle=`rgba(90,200,60,${.25+.1*Math.sin(t*5)})`;g.beginPath();g.ellipse(x,y,p.r*45*S,p.r*22*S,0,0,6.3);g.fill()}
  const ph=OCCph(),pulse=ph<4?(.5+.5*Math.sin(t*(ph===3?3.2:1.6))):0;g.fillStyle=`rgba(80,0,0,${pulse*(ph===3?.18:.08)})`;g.fillRect(0,0,W,H);
  scrVeil('occ'+won,vigP(H*.15,Math.max(W,H)*.62,'rgba(0,0,0,0)',`rgba(2,0,0,${won?.5:.9})`));g.restore()}
TRK.abominio={sng:1,bpm:56,root:45,sc:'phr',ld:'str',lv:.055,echo:1,bs:'long',bv:.1,cp:'ens pad drone',dr:'heart',dv:1.4,form:'AB',parts:{
  A:{ch:[0,1,0,1],m:'7:12 8:4  7:8 4:8  8:12 7:4  1:16'},B:{ch:[5,1,6,1],m:'8:6 7:2 8:8  12:16  11:8 8:8  7:12 r:4'}}};
// ---- il vero finale ----
const ENDC=[{d:6,f:'abofall',tx:'L\'Abominio crolla su sé stesso. La nebbia si ritira, e per la prima volta da anni sotto Aldoria Vecchia c\'è silenzio. Un silenzio vero.'},
  {d:6,f:'ghostlight',tx:'Malakar compare accanto a te. La luce fredda che lo avvolgeva si scalda. Per la prima volta da quella notte, il suo volto non è grigio.'},
  {d:7,f:'trial',tx:'All\'alba la città scopre la verità. Aldric viene arrestato per aver nascosto ciò che dormiva sotto Aldoria e per la morte di centinaia di cittadini. Con lui, il Ciambellano.'},
  {d:7,f:'coronation',tx:'Aldoria cerca un nuovo re. Libero dalla maledizione dell\'Abominio, Malakar torna in vita, e il popolo gli posa la corona sul capo.'},
  {d:6,f:'dawn',tx:'La Corona di Voxel viene distrutta. Aldoria non avrà più un re invincibile. Avrà un re che sa la verità.'}];
function trueEnding(){P.te=2;P.g+=10000;goldFly(10000);gainXP(6000);P.pot+=10;const it=item(Math.max(16,P.lv),3,'w');it.n='Lama dell\'Alba';it.cr=20;const it2=item(Math.max(16,P.lv),3,'h');it2.n='Diadema della Verità';it2.hp=150;
  for(const x of[it,it2]){if(P.inv.length<INV)P.inv.push(x);else ents.push({k:'dr',px:P.px,py:P.py,it:x})}save();started=0;document.body.classList.remove('ig');PM=0;$('pn').style.display='none';bnClear();
  playCine(ENDC,'notte',()=>{started=1;document.body.classList.add('ig');last=performance.now();load('in_castle','town');banner('Il vero finale','L\'Occhio è chiuso per sempre · Re Malakar regna su Aldoria','corona');
    PA={ti:'Il vero finale',tx:'Hai scoperto la verità e hai chiuso l\'Occhio per sempre.\n\nRe Malakar ti attende nella sala del trono. Aldric è nelle prigioni del castello: a tutti e due puoi chiedere ciò che vuoi sapere.\n\nRicompense: 10.000 oro, 6.000 esperienza, 10 pozioni, la Lama dell\'Alba e il Diadema della Verità.'};pn('txt');save()})}
function drawLB(L,x,y,zo,f){for(const b of L)box(x+b[0],y+b[1],b[2]+zo,b[3],b[4],b[5],b[6],f)}
const TCF=new Set(['throne','throne2','cell','abofall','ghostlight','trial','coronation','dawn']);
function truthCine(lt,f){g.setTransform(DPR,0,0,DPR,0,0);const G={throne:['#1a1420','#3a2a30'],throne2:['#1a1420','#3a2a30'],cell:['#05060c','#141826'],abofall:['#0a0404','#2a0a0a'],ghostlight:['#06080c','#1a2430'],trial:['#2a2a38','#7a6a5a'],coronation:['#4a7ad0','#f5d08a'],dawn:['#5a8ad0','#f8b878']}[f];
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,G[0]);gr.addColorStop(1,G[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);const sc=Math.min(W,H)/440;introSc(sc,0,0);
  const floor=(c1,c2)=>{for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++)box(i,j,-6,1,1,6,(i+j)&1?c1:c2)};const K=(x,y,z)=>drawHero(cFig('re'),x,y,z||0,0,faceOf(0,1));const HERO=(x,y,fc)=>drawHero(heroL(APM,1,APM.hh?2:-1,1,20,0,0),x,y,0,0,fc||5);const GU=(x,y)=>drawHero(cFig('guardia'),x,y,0,0,faceOf(-x,-y));
  if(f==='throne'||f==='throne2'){floor('#6a6a74','#62626c');for(let j=-6;j<=6;j++)box(-.6,j,0,1.2,1,.3,'#8a1a2a');box(-1,-4.5,0,2,1,10,'#d4af37');box(-1,-4.5,10,2,.3,26,'#a8303a');K(0,-3.6,10);
    const p=Math.sin(lt*3)*.5+.5;g.save();g.globalAlpha=.25+p*.2;box(-.6,-4,42,1.2,1,10,'#ff3a2a',1.6);g.restore();HERO(0,1.5);box(.25,0,12+Math.sin(lt*2),.15,.15,4,'#8a1020',1.3);
    const k=f==='throne2'?Math.min(1,lt/3):0;GU(-3+k*2.2,-1+k*2);GU(3-k*2.2,-1+k*2)}
  if(f==='cell'){floor('#3a3a42','#34343c');for(let i=-3;i<=3;i++)box(i+.4,3,0,.08,.08,34,'#4a4a52');box(-3,3,30,7,.1,2,'#3a3a42');box(-3,-3,0,2,1.2,2,'#c8a858');HERO(0,0,4);
    const a=Math.max(0,Math.min(1,(lt-2.5)/2));if(a>0){g.save();g.globalAlpha=a*.8;drawHero(malakarGhostM(),-1.5,-1.5,Math.sin(lt*2)*2,0,faceOf(1,1));g.restore()}}
  if(f==='abofall'){const k=Math.min(1,lt/4.5),q=1-k,sh=lt<3?Math.sin(lt*40)*.06*(1-lt/3):0;floor('#2a2422','#262020');
    ABT.forEach(([r,z,h,c],i)=>{const rr=r*.62*(1+k*.15*i);box(-rr+sh,-rr-2,z*.62*q,rr*2,rr*2,Math.max(1,h*.62*q),c)});
    for(let i=0;i<6;i++){const a=i*1.05+lt*.3,d=2+k*1.5;for(let s2=0;s2<6;s2++)box(Math.cos(a)*(d-s2*.25)-.2,Math.sin(a)*(d-s2*.25)-2.2,Math.max(0,(60-s2*8)*q),.4,.4,4,s2%2?'#4a2026':'#5a2a30')}
    if(q>.3){box(-1+sh,.3-2,95*.62*q,2,.05,14*q,'#e8dcc8',1.1);box(-.25+sh,.33-2,98*.62*q,.5,.04,9*q,'#8a0a0a',1.2)}
    g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle=`rgba(255,255,255,${Math.max(0,.6-lt*.15)})`;g.fillRect(0,0,W,H);for(let i=0;i<10;i++){const x=W*(.1+i*.09);g.fillStyle=`rgba(255,240,200,${(.06+.04*Math.sin(lt+i))*k})`;g.fillRect(x,0,W*.02,H)}}
  if(f==='ghostlight'){floor('#2a2422','#262020');HERO(1,1,5);const w=Math.min(1,lt/4);g.save();if(w<=.5)g.globalAlpha=.85;drawHero(w>.5?cFig('malakar_re'):malakarGhostM(),-1,-1,Math.sin(lt*2)*(1-w)*3,0,faceOf(1,1));g.restore()}
  if(f==='trial'){floor('#6a6a74','#62626c');drawHero(cFig('aldric_p'),0,-1,0,0,faceOf(0,1));box(-.4,-1.05,8,.8,.1,1.5,'#4a4a52');GU(-1.2,-1.6);GU(1.2,-1.6);
    for(let i=0;i<7;i++)drawHero(cFig(CROWD49[i]),-4+i*1.3,3,Math.abs(Math.sin(lt*4+i))*1.5,0,faceOf(0,-1));drawHero(cFig('ciambellano'),2.5,-1,0,0,faceOf(0,1));box(2.2,-1.05,8,.6,.1,1.5,'#4a4a52')}
  if(f==='coronation'){floor('#8a1a2a','#7a1626');drawHero(cFig('malakar_re'),0,-1,0,0,faceOf(0,1));const k=Math.min(1,lt/4);introCrown(0,-1,90-k*44,lt*.6,['#d4af37']);
    for(let i=0;i<9;i++)drawHero(cFig(CROWD49[i+2]||CROWD49[i]),-5+i*1.25,3.4,Math.abs(Math.sin(lt*5+i))*3*(k>=1?1:0),0,faceOf(0,-1));
    if(k>=1&&cineOK()){g.setTransform(DPR,0,0,DPR,0,0);for(let i=0;i<40;i++){const x=(i*97+lt*80)%W,y=((i*53)+lt*120)%H;g.fillStyle=['#f5c342','#e0304a','#ffffff','#4aa3ff'][i%4];g.fillRect(x,y,5,8)}}}
  if(f==='dawn'){introGroundD(sc*.9,0,0,[0,0,.9]);introSc(sc*.9,0,0);introCastle(0,-3,0);g.setTransform(DPR,0,0,DPR,0,0);const a=Math.min(1,Math.max(0,(lt-2.5)/1.5));g.globalAlpha=a;g.textAlign='center';g.font=`bold ${Math.round(Math.min(W,H)/10)}px Georgia,serif`;g.lineWidth=6;g.strokeStyle='#3a1a08';g.strokeText('VOXELIA',W/2,H*.3);g.fillStyle='#ffd88a';g.fillText('VOXELIA',W/2,H*.3);g.font=`italic ${Math.round(Math.min(W,H)/26)}px Georgia,serif`;g.fillStyle='#fff6dc';g.fillText('La verità sarà nei tuoi occhi',W/2,H*.3+Math.min(W,H)/14);g.globalAlpha=1}}
// ---- la musica della zona: di notte, in città, il notturno (corregge l'alternanza della 6.8) ----
function zoneMus(){return NIGHTZ.has(Zk)&&NK>.55?'notte':(ZZ.mus||'town')}
const DWELL=()=>[[-.45,-.45,0,.9,.9,6,'#7b7f89'],[-.35,-.35,6,.7,.7,.5,'#141414'],[-.45,-.45,6,.1,.9,2,'#8a8e98'],[.35,-.45,6,.1,.9,2,'#8a8e98']];
function decTruth(x,y,c){if(c==='ʬ'){drawL(DWELL(),x+.5,y+.5,0);return true}if(c==='ʌ')return true;return false}
(function(){const st=document.createElement('style');st.textContent='.qa{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}.qa button{font-size:13px;padding:5px 9px}.qa button.on{border-color:#f5b942;background:#3a2c10}';document.head.appendChild(st)})();

// ---- 6.9: i segreti contano anche i pezzi della verità; quando li hai tutti, la verità si compone ----
SECN=Object.keys(SECD).length;
const _secretFind=secretFind;
secretFind=function(id){const was=!!(P.sec&&P.sec[id]);_secretFind(id);if(was||P.tru||!truthDone())return;P.tru=1;
  PA={ti:'La verità su Aldoria Vecchia',tx:SECD[id][5]+'\n\n━━━━━━━━━━\n\nHai riunito tutti i pezzi della verità.\n\n'+TRUTHT};pn('txt');
  setTimeout(()=>banner('La verità','Malakar voleva salvare Aldoria Vecchia · il diario (K) racconta tutto','pergamena'),6000);
  if(Zk==='vecchia'&&!P.s7&&!ents.some(e=>e.k==='shard7'))ents.push({k:'shard7',n:'',px:WELL[0]+.5,py:WELL[1]+1.5});save()};
function truthHTML(){const n=Object.keys(SECD).filter(k=>P.sec&&P.sec[k]).length;if(!P.tru)return n?`<p class="mu">Pezzi della verità: ${n}/${SECN}. Qualcosa non torna nella storia di Aldoria Vecchia.</p>`:'';
  const st=P.te>=2?'L\'Occhio è chiuso. Re Malakar regna su Aldoria.':P.te===1?(P.key?'Malakar ti ha dato la chiave: apri la porta di pietra nella stanza del culto.':'Sei stato arrestato. Aspetta, nella cella.'):P.s7?'Hai il settimo cuore della Corona. Portalo al Re'+(P.st>=5?'.':', quando la Corona sarà riunita.'):'Il settimo cuore è ad Aldoria Vecchia, dove la vecchia piazza beveva.';
  return`<h4>👁 La verità su Aldoria Vecchia</h4><div class="qb"><small>${esc(TRUTHT).replace(/\n/g,'<br>')}</small><br><b>${esc(st)}</b></div>`}
// ---- la ricompensa del Re: doni, e una Corona che lo rende quasi invincibile ----
function kingGifts(){P.pot+=10;const a=item(Math.max(12,P.lv),3,'w'),b=item(Math.max(12,P.lv),3,'c');a.n='Spada del Campione';a.cr=Math.max(a.cr||0,10);b.n='Corazza del Re';b.hp=Math.max(b.hp||0,90);
  for(const x of[a,b]){if(P.inv.length<INV)P.inv.push(x);else ents.push({k:'dr',px:P.px,py:P.py,it:x})}
  setTimeout(()=>banner('I doni del Re','Spada del Campione · Corazza del Re · 10 pozioni','corona'),900)}

// 7.1: "Dove sono" anche nelle zone della verità
if(typeof MAPSUB!=='undefined')MAPSUB.cella='in_castle';
if(typeof mapMe==='function'){const _mapMe=mapMe;mapMe=function(){const z=Zk;if(z==='occhio'||z==='culto'){Zk='vecchia';try{_mapMe()}finally{Zk=z}}else _mapMe()}}
/* ================= 7.2: animazioni delle abilità e dei nemici ================= */
// ---- modelli con scheletro: ogni pezzo appartiene a un gruppo (gambe, braccia, testa, coda, ali...) ----
// Tutti i modelli nuovi guardano verso +y (come l'eroe), così si possono girare nelle 8 direzioni.
function rgNew(kind){const L=[];L.kind=kind;L.g={};return L}
function rgAdd(L,g,b){(L.g[g]=L.g[g]||[]).push(L.length);L.push(b);return L}
function rgScale(L,s){const R=L.map(b=>b[7]?[b[0]*s,b[1]*s,b[2]*s,b[3]*s,b[4]*s,b[5]*s,b[6],b[7]]:[b[0]*s,b[1]*s,b[2]*s,b[3]*s,b[4]*s,b[5]*s,b[6]]);R.kind=L.kind;R.g=L.g;R.rg=1;R.top=(L.top||34)*s;return R}
function rgX(L,list){for(const q of list)rgAdd(L,q[0],q.slice(1));return L}
const ease3=k=>k<0?0:k>1?1:k*k*(3-2*k);
// ---- armi e cappelli (gruppo, x, y, z, larghezza, profondità, altezza, colore) ----
const WP={
  club:()=>[['ar',.24,.02,5,.08,.08,15,'#6a4a2a'],['ar',.21,-.01,17,.14,.14,7,'#5a3a1a']],
  sword:(c='#c8ccd6')=>[['ar',.26,.03,9,.04,.07,21,c],['ar',.2,-.02,8,.16,.13,1.6,'#8a6a2a'],['ar',.26,.03,4,.04,.07,4,'#4a3020']],
  big:(c='#9aa0aa')=>[['ar',.25,.02,7,.07,.1,28,c],['ar',.18,-.03,6,.2,.16,2,'#5a4a3a'],['ar',.26,.03,1,.05,.07,5,'#3a2a1a']],
  spear:(c='#c8ccd6')=>[['ar',.27,.03,0,.04,.04,36,'#7a5a3a'],['ar',.25,.01,36,.08,.08,7,c]],
  trident:(c='#d4af37')=>[['ar',.27,.03,0,.04,.04,34,'#5a6a6a'],['ar',.2,.01,34,.18,.06,2,c],['ar',.2,.01,34,.04,.06,7,c],['ar',.27,.01,34,.04,.06,9,c],['ar',.34,.01,34,.04,.06,7,c]],
  staff:(o='#c46bff')=>[['ar',.27,.03,0,.05,.05,34,'#5a3a2a'],['ar',.23,-.01,34,.13,.13,6,o]],
  bow:()=>[['al',-.42,.06,5,.03,.06,24,'#7a4a2a'],['al',-.39,.08,6,.01,.01,22,'#e8e0d0'],['bd',-.08,-.2,13,.08,.08,12,'#6a3a1a'],['bd',-.06,-.19,25,.04,.04,3,'#e8e0d0']],
  shield:(c='#7a7f8a',b='#d4af37')=>[['al',-.43,-.1,8,.06,.3,14,c],['al',-.45,-.0,13,.03,.09,4,b]],
  dagger:()=>[['ar',.27,.05,6,.03,.05,9,'#c8ccd6'],['ar',.25,.03,5,.07,.09,1.5,'#6a4a2a']],
  pistol:()=>[['ar',.25,.02,13,.06,.24,4,'#3a3a3a'],['ar',.26,.0,10,.04,.06,4,'#5a3a1a']],
  rifle:()=>[['ar',.24,-.06,13,.06,.46,3.5,'#4a3a2a'],['ar',.25,.32,14,.04,.12,2,'#2a2a2a']],
  hammer:(c='#6a6a72')=>[['ar',.27,.03,3,.05,.05,20,'#6a4a2a'],['ar',.19,-.05,21,.21,.21,8,c]],
  axe:()=>[['ar',.27,.03,4,.05,.05,20,'#6a4a2a'],['ar',.3,-.04,18,.04,.22,8,'#b8bcc6']],
  cleaver:()=>[['ar',.26,.03,5,.05,.06,6,'#5a3a1a'],['ar',.24,-.02,11,.06,.2,14,'#a8acb6']],
  scythe:()=>[['ar',.27,.03,0,.04,.04,34,'#3a2a2a'],['ar',.27,-.3,30,.04,.34,4,'#c8ccd6']],
  cutlass:()=>[['ar',.26,.04,9,.04,.09,16,'#d8dce6'],['ar',.22,.0,7,.12,.16,3,'#d4af37']],
  claws:(c='#e8e0c8')=>[['al',-.33,.06,7,.03,.08,3,c],['al',-.27,.06,7,.03,.08,3,c],['ar',.25,.06,7,.03,.08,3,c],['ar',.31,.06,7,.03,.08,3,c]]};
const HT={
  crown:(c='#d4af37')=>[['hd',-.15,-.12,28.5,.3,.25,3,c],['hd',-.15,.1,31,.05,.03,3,c],['hd',-.025,.1,31,.05,.03,4,c],['hd',.1,.1,31,.05,.03,3,'#e0302a']],
  hood:(c)=>[['hd',-.18,-.16,18,.36,.3,12.5,c],['hd',-.11,.13,20,.22,.012,7,'#0a0a10']],
  horns:(c='#e8e0c8',big)=>big?[['hd',-.24,-.02,26,.08,.08,5,c],['hd',-.3,-.02,30,.07,.07,6,c],['hd',.16,-.02,26,.08,.08,5,c],['hd',.23,-.02,30,.07,.07,6,c]]:[['hd',-.15,-.02,28,.06,.06,5,c],['hd',.09,-.02,28,.06,.06,5,c]],
  ears:(c)=>[['hd',-.25,-.04,23,.1,.06,3.5,c],['hd',.15,-.04,23,.1,.06,3.5,c]],
  tricorn:(c='#2a1a14')=>[['hd',-.22,-.18,28,.44,.38,2,c],['hd',-.14,-.1,29,.28,.22,4,c],['hd',-.02,.18,28.5,.04,.04,2,'#d4af37']],
  cowboy:(c='#6a4a2a')=>[['hd',-.24,-.2,28,.48,.42,1.5,c],['hd',-.14,-.1,29,.28,.22,5,c],['hd',-.14,-.1,29,.28,.22,1.2,'#2a1a10']],
  bowler:()=>[['hd',-.19,-.16,28,.38,.32,1.2,'#1a1a1a'],['hd',-.13,-.1,29,.26,.22,4,'#1a1a1a']],
  bearskin:()=>[['hd',-.15,-.12,28,.3,.25,12,'#1a1a1a']],
  helmet:(c='#7a7f8a',pl)=>{const r=[['hd',-.17,-.14,19,.34,.29,12,c],['hd',-.11,.15,24,.22,.012,1.2,'#0a0a10']];if(pl)r.push(['hd',-.03,-.16,31,.06,.3,5,pl]);return r},
  bandana:(c='#c0302a')=>[['hd',-.16,-.13,26,.32,.27,3,c],['hd',-.04,-.2,24,.08,.08,3,c]],
  mask:(c='#3a3a3a')=>[['hd',-.15,.12,20,.3,.02,4,c]],
  nemes:()=>[['hd',-.18,-.14,21,.36,.29,10,'#d4af37'],['hd',-.18,-.14,23,.36,.29,1,'#2a4a9a'],['hd',-.18,-.14,26,.36,.29,1,'#2a4a9a'],['hd',-.18,-.16,10,.08,.12,11,'#d4af37'],['hd',.1,-.16,10,.08,.12,11,'#d4af37']]};
// ---- umanoide: gambe, busto, braccia, testa, poi accessori ----
function mHum(o){const s=o.s||1,L=rgNew('h'),sk=o.sk||SKIN,tp=o.tp||'#5a5a6a',lg=o.lg||'#33343c',hd=o.hd||sk,ar=o.ar||tp,ey=o.ey||'#111';const A=(g,...b)=>rgAdd(L,g,b);
  if(o.robe){A('ll',-.17,-.07,0,.13,.14,5,lg);A('lr',.04,-.07,0,.13,.14,5,lg);A('bd',-.23,-.15,1,.46,.3,9,o.robe);A('bd',-.25,-.17,0,.5,.34,1.5,shx(o.robe,.7))}
  else if(o.tail){A('ll',-.12,-.1,0,.24,.22,4,o.tail);A('lr',-.08,-.32,1,.16,.2,3,o.tail);A('lr',-.12,-.46,1.5,.24,.08,1.5,shx(o.tail,1.2))}
  else{A('ll',-.18,-.07,0,.14,.15,9,lg);A('lr',.04,-.07,0,.14,.15,9,lg);A('ll',-.19,-.05,0,.16,.19,2,o.ft||shx(lg,.7));A('lr',.03,-.05,0,.16,.19,2,o.ft||shx(lg,.7))}
  const hu=o.hunch?.06:0;A('bd',-.21,-.11+hu,9,.42,.24,11,tp);if(o.belt!==0)A('bd',-.22,-.12+hu,9,.44,.26,1.5,o.belt||shx(tp,.6));
  if(o.armsF){A('al',-.33,-.02+hu,16,.11,.36,3.5,ar);A('al',-.33,.34+hu,15.5,.1,.06,3,sk);A('ar',.22,-.02+hu,16,.11,.36,3.5,ar);A('ar',.22,.34+hu,15.5,.1,.06,3,sk)}
  else{A('al',-.33,-.07+hu,10,.11,.14,10,ar);A('al',-.33,-.05+hu,8,.1,.11,2.5,sk);A('ar',.22,-.07+hu,10,.11,.14,10,ar);A('ar',.22,-.05+hu,8,.1,.11,2.5,sk)}
  const hy=hu*1.6;A('hd',-.15,-.12+hy,20,.3,.25,9,hd);
  if(o.eyes!==0){A('hd',-.1,.125+hy,24,.06,.012,2,ey);A('hd',.04,.125+hy,24,.06,.012,2,ey)}
  if(o.mouth)A('hd',-.06,.125+hy,21.5,.12,.012,1,o.mouth);
  for(const q of o.x||[]){const b=[q[1],q[2]+(q[0]==='hd'?hy:0),q[3],q[4],q[5],q[6],q[7]];if(q[8])b.push(q[8]);rgAdd(L,q[0],b)}
  L.top=o.top||(o.tall||36);L.rng=o.rng;return rgScale(L,s)}
// ---- quadrupede: corpo, testa col muso, quattro zampe, coda ----
function mQuad(o){const s=o.s||1,L=rgNew('q'),c=o.c,c2=o.c2||shx(c,.8),ey=o.ey||'#111',lo=o.low?.55:1;const A=(g,...b)=>rgAdd(L,g,b);
  const lh=6*lo,bz=lh;A('q0',-.15,.14,0,.09,.09,lh,c2);A('q1',.06,.14,0,.09,.09,lh,c2);A('q2',-.15,-.28,0,.09,.09,lh,c2);A('q3',.06,-.28,0,.09,.09,lh,c2);
  A('bd',-.16,-.32,bz,.32,.58,8*lo+(o.big?2:0),c);if(o.mane)A('bd',-.18,.04,bz+2,.36,.2,8*lo+3,o.mane);if(o.spikes)for(let i=0;i<4;i++)A('bd',-.04,-.25+i*.13,bz+8*lo,.08,.08,4+i%2*2,o.spikes);
  const hz=bz+(o.low?1:3);A('hd',-.13,.2,hz,.26,.24,8*lo+1,c);A('hd',-.08,.42,hz,.16,o.long?.2:.12,4.5,c2);A('hd',-.03,.53+(o.long?.08:0),hz+3,.06,.02,1.5,'#111');
  A('hd',-.1,.44,hz+6*lo,.05,.01,1.6,ey);A('hd',.05,.44,hz+6*lo,.05,.01,1.6,ey);
  if(o.ears!==0){const ec=o.ec||c;if(o.round){A('hd',-.15,.22,hz+8*lo,.08,.04,3,ec);A('hd',.07,.22,hz+8*lo,.08,.04,3,ec)}else{A('hd',-.12,.24,hz+8*lo,.07,.06,4.5,ec);A('hd',.05,.24,hz+8*lo,.07,.06,4.5,ec)}}
  if(o.ttail)for(let i=0;i<5;i++)A('tl',-.025+0,-.34-i*.1,bz+2-i*.6,.05,.1,1.5,o.ttail);else A('tl',-.04,-.46,bz+3*lo,.08,.16,3,o.tc||c);
  if(o.flame)for(let i=0;i<3;i++)A('fx',-.05+(i-1)*.08,-.2+i*.15,bz+8*lo,.07,.07,3,'#ffb040');
  L.top=o.top||26;return rgScale(L,s)}
// ---- artropodi: scorpioni, scarabei, ragni, granchi ----
function mArth(o){const s=o.s||1,L=rgNew('a'),c=o.c,c2=o.c2||shx(c,.75);const A=(g,...b)=>rgAdd(L,g,b);const nl=o.legs||6;
  for(let i=0;i<nl;i++){const side=i%2?1:-1,row=(i>>1)-(nl/2-1)/2,yy=row*.14-.02,x=side<0?-.4:.27;A('k'+i,x,yy,0,.13,.04,1.6,c2);A('k'+i,side<0?-.4:.37,yy,0,.03,.04,3.5,c2)}
  if(o.kind==='spider'){A('bd',-.2,-.38,4,.4,.4,9,c);A('bd',-.14,-.0,4,.28,.26,7,c2);for(let i=0;i<4;i++)A('hd',-.11+i*.06,.26,8+(i%2)*1.5,.04,.01,1.6,'#ff2a2a');A('hd',-.1,.24,3,.04,.08,4,c2);A('hd',.06,.24,3,.04,.08,4,c2)}
  else if(o.kind==='crab'){A('bd',-.3,-.22,3,.6,.42,7,c);A('bd',-.26,-.18,10,.52,.34,2,shx(c,1.15));A('hd',-.12,.18,9,.04,.04,6,c2);A('hd',.08,.18,9,.04,.04,6,c2);A('hd',-.13,.17,15,.06,.06,2,'#111');A('hd',.07,.17,15,.06,.06,2,'#111');
    A('cl',-.48,.12,3,.2,.22,6,c);A('cl',-.48,.32,5,.08,.1,3,c2);A('cr',.28,.12,3,.2,.22,6,c);A('cr',.4,.32,5,.08,.1,3,c2)}
  else if(o.kind==='beetle'){A('bd',-.22,-.26,3,.44,.48,8,c);A('bd',-.02,-.26,11,.04,.48,.8,'#111');A('bd',-.18,-.22,11,.36,.4,2,shx(c,1.2));A('hd',-.12,.2,4,.24,.14,5,c2);A('hd',-.03,.32,6,.06,.14,3,c2);A('hd',-.03,.42,8,.06,.06,5,c2);A('hd',-.1,.33,7,.04,.01,1.5,'#ff3a2a');A('hd',.06,.33,7,.04,.01,1.5,'#ff3a2a')}
  else{A('bd',-.18,-.2,3,.36,.42,5,c);A('hd',-.13,.2,3,.26,.14,4.5,c2);A('hd',-.09,.33,6,.04,.01,1.5,'#111');A('hd',.05,.33,6,.04,.01,1.5,'#111');
    A('cl',-.36,.24,3,.16,.18,4,c);A('cl',-.36,.4,4,.06,.1,3,c2);A('cl',-.24,.42,4,.06,.08,3,c2);A('cr',.2,.24,3,.16,.18,4,c);A('cr',.2,.4,4,.06,.1,3,c2);A('cr',.3,.42,4,.06,.08,3,c2);
    const seg=[[-.05,-.3,5,4],[-.05,-.38,9,5],[-.05,-.36,14,5],[-.05,-.26,18,4]];seg.forEach((q,i)=>A('s'+i,q[0],q[1],q[2],.1,.1,q[3],i%2?c2:c));A('st',-.03,-.12,19,.06,.12,2.5,o.sting||'#2a1a10')}
  for(const q of o.x||[])rgAdd(L,q[0],q.slice(1));L.top=o.top||22;L.nseg=4;L.nl=nl;return rgScale(L,s)}
// ---- creature che fluttuano: melme, spettri, elementali, meduse, occhi ----
function mFloat(o){const s=o.s||1,L=rgNew(o.kind||'f'),c=o.c;const A=(g,...b)=>rgAdd(L,g,b);
  if(o.kind==='slime'){A('bd',-.28,-.28,0,.56,.56,11,c);A('bd',-.22,-.22,11,.44,.44,3,shx(c,1.2));A('bd',-.1,-.1,4,.2,.2,4,shx(c,.6));A('hd',-.16,.285,7,.08,.012,3,'#111');A('hd',.08,.285,7,.08,.012,3,'#111');A('hd',-.15,.285,9,.03,.012,1,'#ffffff')}
  else if(o.kind==='ghost'){A('bd',-.2,-.14,14,.4,.28,12,c);for(let i=0;i<4;i++)A('s'+i,-.2+i*.1,-.12,6+(i%2)*2,.1,.24,8,shx(c,.85-i%2*.1));A('hd',-.15,-.12,26,.3,.25,9,o.hc||c);
    A('hd',-.1,.13,30,.06,.012,2.4,o.ey||'#7ad8ff');A('hd',.04,.13,30,.06,.012,2.4,o.ey||'#7ad8ff');A('al',-.32,-.04,18,.1,.14,8,c);A('ar',.22,-.04,18,.1,.14,8,c);if(o.hair)A('hd',-.17,-.16,16,.34,.08,14,o.hair);if(o.scream)A('hd',-.04,.13,27,.08,.012,2.4,'#0a0a10')}
  else if(o.kind==='elem'){A('bd',-.12,-.12,12,.24,.24,16,c);A('bd',-.06,-.06,30,.12,.12,6,shx(c,1.2));A('hd',-.08,.125,22,.05,.01,2,'#ffffff');A('hd',.03,.125,22,.05,.01,2,'#ffffff');for(let i=0;i<4;i++)A('o'+i,-.05,-.05,16,.1,.1,7,o.c2||shx(c,1.25))}
  else if(o.kind==='jelly'){A('bd',-.24,-.24,16,.48,.48,8,c);A('bd',-.18,-.18,24,.36,.36,4,shx(c,1.15));A('bd',-.1,-.1,28,.2,.2,2,shx(c,1.3));for(let i=0;i<6;i++){const a=i*1.047;A('s'+i,Math.cos(a)*.16-.03,Math.sin(a)*.16-.03,4,.06,.06,12,shx(c,.8))}}
  else if(o.kind==='eye'){A('bd',-.22,-.22,14,.44,.44,16,'#e8e0d8');A('hd',-.12,.225,18,.24,.02,8,o.iris||'#8a2ad8');A('hd',-.05,.245,20,.1,.02,4,'#0a0a10');for(let i=0;i<5;i++){const a=i*1.257;A('s'+i,Math.cos(a)*.14-.03,Math.sin(a)*.14-.03,2,.06,.06,12,c)}}
  else if(o.kind==='bat'){A('bd',-.1,-.1,16,.2,.2,8,c);A('hd',-.08,.0,24,.16,.14,5,c);A('hd',-.09,.0,29,.05,.04,3,c);A('hd',.04,.0,29,.05,.04,3,c);A('hd',-.06,.14,26,.04,.01,1.4,'#ff3a2a');A('hd',.02,.14,26,.04,.01,1.4,'#ff3a2a');
    A('wl',-.32,-.06,20,.22,.14,1.2,shx(c,.8));A('wo',-.52,-.08,20,.2,.12,1.2,shx(c,.7));A('wr',.1,-.06,20,.22,.14,1.2,shx(c,.8));A('wp',.3,-.08,20,.2,.12,1.2,shx(c,.7))}
  else if(o.kind==='eel'){for(let i=0;i<8;i++)A('s'+i,-.06,.3-i*.1,1+Math.max(0,3-i)*.3,.12-i*.008,.11,5-i*.3,i%2?shx(c,.85):c);A('hd',-.08,.36,2,.16,.14,6,c);A('hd',-.07,.5,5,.04,.01,1.5,'#ffe060');A('hd',.03,.5,5,.04,.01,1.5,'#ffe060')}
  for(const q of o.x||[])rgAdd(L,q[0],q.slice(1));L.top=o.top||40;L.float=o.kind!=='slime'&&o.kind!=='eel';return rgScale(L,s)}
// ---- i nemici prendono i modelli nuovi ----
function newModels(){const g='#5aa84a',set=(k,m)=>{if(E[k])E[k].m=m};
  set('goblin',mHum({s:.84,sk:g,tp:'#7a5a2a',lg:'#5a4a2a',ey:'#ffd040',mouth:'#2a3a1a',x:[...HT.ears(g),...WP.club()]}));
  set('arciere',mHum({s:.84,sk:g,tp:'#4a6a2a',lg:'#4a3a22',ey:'#ffd040',x:[...HT.ears(g),...WP.bow(),...HT.hood('#3a5a2a').slice(0,1)]}));
  set('sciamano_goblin',mHum({s:.86,sk:g,tp:'#7a3a2a',lg:'#4a3a22',ey:'#ff6a2a',x:[...HT.ears(g),['hd',-.15,.12,21,.3,.03,6,'#e8e0c8'],['hd',-.02,-.1,29,.04,.04,9,'#e0302a'],['hd',.06,-.12,29,.04,.04,8,'#3a8ae0'],...WP.staff('#40e0a0')]}));
  set('re_goblin',mHum({s:1.5,sk:'#4e9a3e',tp:'#8a2a2a',lg:'#5a3a1a',ey:'#ffd040',mouth:'#1a2a10',x:[...HT.ears('#4e9a3e'),...HT.crown(),['bd',-.26,-.16,10,.52,.06,13,'#6a1a1a'],...WP.cleaver()]}));
  set('troll',mHum({s:1.6,sk:'#5a7a4a',tp:'#4a5a3a',lg:'#3a4a2a',ey:'#ffea60',mouth:'#2a2a1a',x:[['hd',-.12,.125,19.5,.04,.03,3,'#e8e0c8'],['hd',.08,.125,19.5,.04,.03,3,'#e8e0c8'],['bd',-.24,-.04,18,.48,.14,3,'#3a6a2a'],...WP.club()]}));
  set('mummia',mHum({s:1,sk:'#d8cfb0',tp:'#cfc6a6',lg:'#c8bf9e',hd:'#d8cfb0',ey:'#40e0ff',armsF:1,belt:'#a89e7e',x:[['bd',-.215,-.115,13,.43,.25,.8,'#a89e7e'],['bd',-.215,-.115,17,.43,.25,.8,'#a89e7e'],['hd',-.155,-.125,23,.31,.26,.8,'#a89e7e'],['ll',-.185,-.075,4,.15,.16,.8,'#a89e7e'],['lr',.035,-.075,5,.15,.16,.8,'#a89e7e']]}));
  set('faraone',mHum({s:1.35,sk:'#d8cfb0',tp:'#e8d8a0',lg:'#c8bf9e',ey:'#40e0ff',x:[...HT.nemes(),['bd',-.22,.12,14,.44,.03,5,'#2a4a9a'],['bd',-.22,.12,16,.44,.031,1,'#d4af37'],...WP.staff('#40e0ff')]}));
  set('yeti',mHum({s:1.35,sk:'#a8c8e8',tp:'#f0f4f8',lg:'#e0e8f0',ar:'#f0f4f8',hd:'#f0f4f8',ey:'#2a4a8a',mouth:'#5a7aa8',x:[['hd',-.1,.13,20.5,.2,.02,4,'#a8c8e8'],...HT.horns('#c8c0b0',1),['bd',-.24,-.14,18,.48,.3,3,'#ffffff']]}));
  set('scheletro',mHum({s:1,sk:'#e8e2d0',tp:'#e8e2d0',lg:'#e8e2d0',ar:'#e8e2d0',hd:'#f0ebd8',ey:'#1a0a0a',belt:0,x:[['bd',-.21,-.11,9,.42,.24,11,'#1a1414'],['bd',-.2,-.06,10,.4,.14,1.2,'#e8e2d0'],['bd',-.2,-.06,13,.4,.14,1.2,'#e8e2d0'],['bd',-.2,-.06,16,.4,.14,1.2,'#e8e2d0'],['bd',-.03,-.08,9,.06,.18,11,'#e8e2d0'],['hd',-.04,.125,21,.08,.012,1.2,'#1a0a0a'],...WP.sword('#9a7a5a'),...WP.shield('#6a4a2a','#8a8a8a')]}));
  // il busto dello scheletro è "vuoto": le costole sono chiare sul nero
  if(E.scheletro){const m=E.scheletro.m;const i=m.g.bd[0];m[i]=[m[i][0],m[i][1],m[i][2],m[i][3]*.2,m[i][4],m[i][5],'#e8e2d0']}
  set('zombie',mHum({s:1,sk:'#7a9a6a',tp:'#5a6a7a',lg:'#3a3a4a',ey:'#ff3a2a',armsF:1,hunch:1,mouth:'#3a1a1a',x:[['bd',-.12,.13,12,.1,.01,4,'#7a9a6a'],['bd',.06,.13,15,.08,.01,3,'#8a3a2a']]}));
  set('ghoul',mHum({s:1.05,sk:'#8a8a7a',tp:'#5a5a52',lg:'#4a4a42',ey:'#ffe060',hunch:1,mouth:'#2a0a0a',x:[...WP.claws()]}));
  set('necromante',mHum({s:1.35,sk:'#c8d0c0',tp:'#3a1a4a',robe:'#2a1238',ey:'#c46bff',x:[...HT.hood('#2a1238'),['hd',-.1,.13,24,.06,.012,2,'#c46bff'],['hd',.04,.13,24,.06,.012,2,'#c46bff'],...WP.staff('#c46bff'),['ar',.24,0,40,.08,.08,4,'#e8e2d0']]}));
  set('sacerdote',mHum({s:1,sk:'#c89a6a',tp:'#e8e0c8',robe:'#e8e0c8',ey:'#2a2a2a',x:[['hd',-.17,-.13,28,.34,.28,6,'#d4af37'],['bd',-.22,.12,14,.44,.03,4,'#d4af37'],['ar',.27,.03,0,.05,.05,26,'#d4af37'],['ar',.22,.0,26,.14,.06,2,'#d4af37'],['ar',.24,.0,28,.1,.06,6,'#d4af37']]}));
  set('golem_cr',mHum({s:1.35,sk:'#9ad8f0',tp:'#7ab8d8',lg:'#6aa8c8',ar:'#8ac8e8',hd:'#8ac8e8',ey:'#ffffff',belt:0,x:[['bd',-.24,-.06,20,.08,.08,7,'#c8f0ff'],['bd',.16,-.06,20,.08,.08,9,'#c8f0ff'],['bd',-.05,.12,13,.1,.02,5,'#e0ffff'],['al',-.35,-.04,20,.08,.08,6,'#c8f0ff'],['ar',.24,-.04,20,.08,.08,7,'#c8f0ff']]}));
  set('golem_magma',mHum({s:1.4,sk:'#3a2a24',tp:'#2a1e1a',lg:'#2a1e1a',ar:'#3a2a24',hd:'#3a2a24',ey:'#ffb040',belt:0,x:[['bd',-.15,.125,11,.02,.01,8,'#ff7a2a'],['bd',.05,.125,14,.02,.01,6,'#ff7a2a'],['bd',-.08,.125,17,.14,.01,1,'#ff9a3a'],['hd',-.06,.125,21,.12,.012,1.2,'#ff7a2a'],['fx',-.08,-.06,31,.16,.12,3,'#ff9a3a']]}));
  set('imp',mHum({s:.8,sk:'#c83a2a',tp:'#8a2a1a',lg:'#6a1a10',ey:'#ffea60',x:[...HT.horns('#2a1a1a'),['wg',-.42,-.2,14,.22,.06,10,'#5a1a14'],['wg',.2,-.2,14,.22,.06,10,'#5a1a14'],['tl',-.03,-.3,6,.06,.2,2,'#c83a2a'],['ar',.24,.02,11,.08,.08,3,'#ffb040']]}));
  set('demone',mHum({s:1.3,sk:'#8a1a14',tp:'#3a0a0a',lg:'#2a0808',ey:'#ffea60',mouth:'#ff7a2a',x:[...HT.horns('#1a1010',1),['wg',-.52,-.22,12,.3,.06,18,'#2a0808'],['wg',.22,-.22,12,.3,.06,18,'#2a0808'],['tl',-.03,-.32,4,.06,.24,2,'#8a1a14'],...WP.claws('#ffd040')]}));
  set('fabbro_demone',mHum({s:1.35,sk:'#7a2a1a',tp:'#3a2a1a',lg:'#2a1a10',ey:'#ffb040',x:[...HT.horns('#1a1010'),['bd',-.18,.12,9,.36,.03,10,'#5a3a1a'],...WP.hammer('#3a3a3a')]}));
  set('uomo_pesce',mHum({s:1.05,sk:'#3a8a8a',tp:'#2a6a7a',lg:'#2a5a6a',hd:'#3a9a9a',ey:'#ffe060',mouth:'#1a3a3a',x:[['hd',-.03,-.16,26,.06,.3,6,'#e06a4a'],['bd',-.03,-.18,12,.06,.08,10,'#e06a4a'],['hd',-.22,-.02,21,.06,.12,5,'#e06a4a'],['hd',.16,-.02,21,.06,.12,5,'#e06a4a'],...WP.trident('#c8ccd6')]}));
  set('sirena',mHum({s:1.05,sk:'#9ad0c0',tp:'#3a8a9a',tail:'#2a9a8a',ey:'#2a2a6a',x:[['hd',-.17,-.16,17,.34,.08,14,'#6a3aa8'],['hd',-.16,-.14,28,.32,.26,3,'#6a3aa8'],...WP.trident()]}));
  set('cavaliere',mHum({s:1.15,sk:'#3a3448',tp:'#4a3a6a',lg:'#3a3058',ar:'#4a3a6a',hd:'#4a3a6a',eyes:0,x:[...HT.helmet('#3a3058','#8a4ad0'),['hd',-.11,.15,24,.22,.012,1.2,'#c46bff'],['bd',-.22,.12,11,.44,.02,7,'#2a2240'],...WP.sword('#b8a0e8'),...WP.shield('#2a2240','#8a4ad0')]}));
  set('cavaliere_vuoto',mHum({s:1.25,sk:'#1a1428',tp:'#2a2040',lg:'#201830',ar:'#2a2040',hd:'#2a2040',eyes:0,x:[...HT.helmet('#1a1428','#c46bff'),['hd',-.11,.15,24,.22,.012,1.2,'#e08aff'],...WP.big('#8a6ad0')]}));
  set('cavaliere_ossa',mHum({s:1.15,sk:'#e8e2d0',tp:'#6a6a72',lg:'#e8e2d0',ar:'#e8e2d0',hd:'#f0ebd8',ey:'#ff3a2a',x:[...HT.helmet('#5a5a62'),['bd',-.23,-.13,19,.46,.28,2,'#7a7a82'],...WP.big('#a8a8b0')]}));
  set('mago',mHum({s:1,sk:'#c8b8a8',tp:'#2a2a4a',robe:'#1e1e3a',x:[...HT.hood('#1e1e3a'),['hd',-.1,.13,24,.06,.012,2,'#7a9aff'],['hd',.04,.13,24,.06,.012,2,'#7a9aff'],...WP.staff('#5a7aff')]}));
  set('lich',mHum({s:1.85,sk:'#d8e0e8',tp:'#2a1a4a',robe:'#2a1a4a',hd:'#e8eef4',ey:'#c46bff',x:[...HT.crown('#d4af37'),['bd',-.26,-.16,9,.52,.06,13,'#3a1a5a'],['bd',-.22,.12,14,.44,.03,4,'#d4af37'],...WP.staff('#c46bff')]}));
  set('bandito',mHum({s:1,tp:'#6a4a2a',lg:'#3a2a1a',x:[...HT.hood('#4a3a2a').slice(0,1),...HT.mask('#4a3a2a'),...WP.dagger()]}));
  set('anubi',mHum({s:1.15,sk:'#2a2a2a',tp:'#d4af37',lg:'#e8e0c8',hd:'#1a1a1a',ey:'#ffd040',x:[['hd',-.07,.12,21,.14,.16,4,'#1a1a1a'],['hd',-.14,-.06,28,.06,.06,9,'#1a1a1a'],['hd',.08,-.06,28,.06,.06,9,'#1a1a1a'],['bd',-.22,.12,18,.44,.03,3,'#2a4a9a'],...WP.spear('#d4af37')]}));
  set('pirata',mHum({s:1,tp:'#e8e0d8',lg:'#3a3a5a',x:[...HT.bandana(),['bd',-.215,-.115,12,.43,.25,1,'#2a3a8a'],['bd',-.215,-.115,15,.43,.25,1,'#2a3a8a'],['bd',-.215,-.115,18,.43,.25,1,'#2a3a8a'],...WP.cutlass()]}));
  set('pirata_pistola',mHum({s:1,tp:'#7a2a2a',lg:'#2a2a3a',x:[...HT.tricorn(),...WP.pistol()]}));
  set('scarlatto',mHum({s:1.5,tp:'#a8202a',lg:'#2a1a1a',x:[...HT.tricorn('#1a0a0a'),['hd',-.02,-.2,32,.06,.06,6,'#ffffff'],['bd',-.24,-.14,9,.48,.06,12,'#801a20'],['bd',-.05,.12,10,.1,.02,10,'#d4af37'],...WP.cutlass(),['al',-.32,.0,7,.06,.1,3,'#c8ccd6']]}));
  set('bandito_w',mHum({s:1,tp:'#a87a4a',lg:'#3a3a4a',x:[...HT.cowboy(),['bd',-.23,-.13,15,.46,.28,4,'#8a3a2a'],['hd',-.15,.12,20,.3,.02,3,'#c0302a'],...WP.pistol()]}));
  set('teppista',mHum({s:1.05,tp:'#e8e0d8',lg:'#3a3a3a',x:[...HT.bowler(),['bd',-.14,.12,10,.04,.02,11,'#4a2a1a'],['bd',.1,.12,10,.04,.02,11,'#4a2a1a'],...WP.club()]}));
  set('corvus',mHum({s:1.4,tp:'#1a1a1a',lg:'#1a1a1a',robe:'#141414',hd:'#2a2a2a',ey:'#ffe060',x:[['hd',-.04,.12,20,.08,.2,4,'#e8e0c8'],['hd',-.18,-.16,28,.36,.32,1.5,'#1a1a1a'],['hd',-.14,-.12,29,.28,.24,6,'#1a1a1a'],...WP.staff('#3aff8a')]}));
  set('guardia_reale',mHum({s:1,tp:'#2a3a8a',lg:'#e8e0d8',x:[...HT.tricorn('#1a1a2a'),['bd',-.215,.12,13,.43,.02,5,'#e8e0d8'],...WP.rifle()]}));
  set('granatiere',mHum({s:1.1,tp:'#a8202a',lg:'#e8e0d8',x:[...HT.bearskin(),['bd',-.215,.12,10,.04,.02,10,'#e8e0d8'],['bd',.175,.12,10,.04,.02,10,'#e8e0d8'],...WP.rifle()]}));
  set('soldato',mHum({s:1,tp:'#5a5a3a',lg:'#4a4a2a',x:[['hd',-.18,-.15,27,.36,.3,4,'#4a4a2a'],['hd',-.2,-.17,27,.4,.34,1,'#3a3a20'],...WP.rifle()]}));
  set('anima',mHum({s:.95,sk:'#d8e4ec',tp:'#c8d0d8',lg:'#b8c4cc',ar:'#c8d0d8',ey:'#1a2a3a',mouth:'#1a2a3a',armsF:1}));
  // animali
  set('lupo',mQuad({s:1,c:'#8a8a92',c2:'#6a6a72',ey:'#ffd040',mane:'#7a7a82'}));
  set('lupo_gelo',mQuad({s:1.1,c:'#d8e8f4',c2:'#a8c8e0',ey:'#40c0ff',mane:'#ffffff'}));
  set('sciacallo',mQuad({s:.95,c:'#c8a060',c2:'#a8804a',ey:'#2a1a0a',long:1}));
  set('lupo_cristallo',mQuad({s:1.1,c:'#7ab8d8',c2:'#5a98b8',ey:'#ffffff',spikes:'#c8f0ff'}));
  set('ratto',mQuad({s:.75,c:'#6a5a50',c2:'#5a4a40',ey:'#ff3a2a',low:1,round:1,ec:'#d89a9a',ttail:'#d89a9a',long:1,top:18}));
  set('salamandra',mQuad({s:1.1,c:'#d85a2a',c2:'#a83a1a',ey:'#ffea60',low:1,ears:0,ttail:'#d85a2a',flame:1,long:1,top:18}));
  set('scorpione',mArth({s:1,c:'#8a5a2a',c2:'#6a4020'}));
  set('scorpione_reale',mArth({s:1.25,c:'#c8a040',c2:'#a07a2a',sting:'#3a1a0a'}));
  set('scarabeo',mArth({s:.95,kind:'beetle',c:'#2a6a5a',c2:'#1a4a40'}));
  set('granchio',mArth({s:1.2,kind:'crab',c:'#c8502a',c2:'#a03a1a'}));
  set('ragno',mArth({s:1,kind:'spider',legs:8,c:'#5a7a9a',c2:'#3a5a7a'}));
  set('regina',mArth({s:1.9,kind:'spider',legs:8,c:'#3a2a5a',c2:'#2a1a40',x:[['hd',-.1,.02,11,.2,.14,3,'#d4af37'],['hd',-.1,.02,14,.04,.04,2,'#d4af37'],['hd',.06,.02,14,.04,.04,2,'#d4af37']],top:44}));
  set('anguilla',mFloat({s:1.2,kind:'eel',c:'#2a4a5a',top:16}));
  // creature che fluttuano
  set('slime',mFloat({s:.9,kind:'slime',c:'#5ac85a',top:22}));
  set('spettro',mFloat({s:1,kind:'ghost',c:'#a8b8c8'}));
  set('banshee',mFloat({s:1,kind:'ghost',c:'#c8d0e8',hair:'#e8e8f0',scream:1,ey:'#ffffff'}));
  set('ombra',mFloat({s:1.05,kind:'ghost',c:'#1a1424',hc:'#120e1a',ey:'#c46bff'}));
  set('spettro_cristallo',mFloat({s:1,kind:'ghost',c:'#8ad0f0',hc:'#a8e0ff',ey:'#ffffff'}));
  set('elem_ghiaccio',mFloat({s:1.05,kind:'elem',c:'#8ad0f0',c2:'#c8f0ff'}));
  set('medusa',mFloat({s:1.05,kind:'jelly',c:'#c86ae0'}));
  set('occhio_vuoto',mFloat({s:1.1,kind:'eye',c:'#3a1a5a',iris:'#c46bff'}));
  set('pipistrello',mFloat({s:1,kind:'bat',c:'#4a3a4a'}))}
// ---- pose dei nemici: attesa, corsa, attacco ----
const ATK=.45;
function rigPose(L,e){const n=L.length,O=new Float32Array(n*4),G=L.g,ph=(e.id||0)*1.37,mv=t-(e.mvT||-9)<.18,lt=t-(e.atkT||-9),atk=lt>=0&&lt<ATK;
  const add=(g,dx,dy,dz,dh)=>{const I=G[g];if(!I)return;for(const i of I){const o=i*4;O[o]+=dx;O[o+1]+=dy;O[o+2]+=dz;O[o+3]+=dh}};
  const all=(dx,dy,dz)=>{for(let i=0;i<n;i++){O[i*4]+=dx;O[i*4+1]+=dy;O[i*4+2]+=dz}};
  const w=t*(e.sp>2.5?13:10)+ph,s=Math.sin(w),k=L.kind;
  // attacco: carica (0-35%) e colpo (35-60%), poi ritorno
  // carica: negli ultimi istanti prima del colpo (il nemico è a portata e la ricarica sta finendo); colpo: subito dopo
  const inR=P&&e.r&&dist(e,P)<=e.r*1.05,wind=!atk&&inR&&e.cdt>0&&e.cdt<.34?ease3(1-e.cdt/.34):0,st=atk?(lt<.09?ease3(lt/.09):1-ease3((lt-.09)/.33)):0,wu=wind;
  if(k==='h'){const up=['bd','hd','al','ar','wg','tl','fx'];
    if(mv&&!atk){const a=Math.max(0,s)*3,b=Math.max(0,-s)*3;add('ll',0,s*.09,a,-a);add('lr',0,-s*.09,b,-b);add('al',0,-s*.1,Math.abs(s)*.8,0);add('ar',0,s*.1,Math.abs(s)*.8,0);for(const g of up)add(g,0,.03,Math.abs(s)*1.2,0);add('hd',0,.02,0,0)}
    else if(!atk){const b=Math.sin(t*2.3+ph);for(const g of up)add(g,0,0,b*.5,0);add('al',0,Math.sin(t*1.7+ph)*.02,0,0);add('ar',0,-Math.sin(t*1.7+ph)*.02,0,0);add('hd',Math.sin(t*.8+ph)*.012,0,0,0)}
    if(atk){if(L.rng){const p=Math.max(wu,st);add('ar',0,.22*p,4*p,0);add('al',0,.16*p,3*p,0);add('hd',0,.02*p,0,0)}
      else{add('ar',0,-.12*wind+.34*st,8*wind+1*st,0);add('al',0,.06*st,1*wind,0);add('bd',0,.05*st,0,0);add('hd',0,.08*st,-.8*st,0);add('ll',0,-.05*st,0,0);add('lr',0,.08*st,0,0)}}
    if(G.wg)add('wg',0,0,Math.sin(t*(mv?14:5)+ph)*1.6,0)}
  else if(k==='q'){if(mv&&!atk){const a=Math.max(0,s)*2.6,b=Math.max(0,-s)*2.6;add('q0',0,s*.1,a,-a);add('q3',0,s*.1,a,-a);add('q1',0,-s*.1,b,-b);add('q2',0,-s*.1,b,-b);
      for(const g of['bd','hd','tl','fx'])add(g,0,0,Math.abs(Math.cos(w))*1.4,0);add('hd',0,.02,Math.sin(w*2)*.6,0);add('tl',Math.sin(w*.5)*.05,0,1,0)}
    else{const b=Math.sin(t*2+ph);add('bd',0,0,b*.35,0);add('hd',Math.sin(t*.7+ph)*.03,0,b*.35+(Math.sin(t*.5+ph)>.7?-1:0),0);add('tl',Math.sin(t*4+ph)*.06,0,0,0)}
    if(atk){const p=st;all(0,.32*p,5*Math.sin(Math.min(1,lt/(ATK*.7))*Math.PI));add('hd',0,.06*p,-1.5*p+1.5*wind,0);add('q0',0,.1*p,2*p,-1);add('q1',0,.1*p,2*p,-1)}}
  else if(k==='a'){const nl=L.nl||6;for(let i=0;i<nl;i++){const q=Math.sin(w*1.3+i*1.9);add('k'+i,0,mv?q*.04:0,mv?Math.max(0,q)*1.6:0,0)}
    if(!mv)add('bd',0,0,Math.sin(t*2+ph)*.3,0);
    const sw=Math.sin(t*1.8+ph);for(let i=0;i<4;i++)add('s'+i,sw*.02*i,0,Math.sin(t*2.4+ph+i)*.4,0);
    if(atk){for(let i=0;i<4;i++)add('s'+i,0,(.1*i)*st+(-.04*i)*wind,2*i*wind-1.5*i*st,0);add('st',0,.5*st-.05*wind,-6*st+5*wind,0);add('cl',.06*st,.12*st,1*wind,0);add('cr',-.06*st,.12*st,1*wind,0);all(0,.08*st,0)}
    else{add('cl',Math.sin(t*3+ph)*.015,0,0,0);add('cr',-Math.sin(t*3+ph)*.015,0,0,0)}}
  else if(k==='slime'){const h=mv?Math.abs(Math.sin(w*.6))*6:0,sq=mv?Math.max(0,Math.cos(w*.6*2))*.18:Math.sin(t*3+ph)*.05;for(let i=0;i<n;i++){const o=i*4;O[o+2]+=h;O[o+3]+=0}
    L.sq=sq+(atk?.25*st-.2*wind:0);if(atk)all(0,.28*st,3*st)}
  else if(k==='ghost'||k==='elem'||k==='jelly'||k==='eye'||k==='bat'||k==='f'){const fl=Math.sin(t*2.2+ph)*2.2+6;all(0,0,fl,0);
    for(let i=0;i<6;i++)add('s'+i,Math.sin(t*4+ph+i*1.3)*.05,Math.cos(t*3+ph+i)*.03,Math.sin(t*5+i)*.6,0);
    for(let i=0;i<4;i++){const a=t*2+ph+i*1.571;add('o'+i,Math.cos(a)*.34,Math.sin(a)*.34,Math.sin(a*2)*3,0)}
    if(G.wl){const f=Math.sin(t*18+ph);add('wl',0,0,f*3,0);add('wr',0,0,f*3,0);add('wo',.04*f,0,f*7,0);add('wp',-.04*f,0,f*7,0)}
    add('al',0,0,Math.sin(t*2+ph)*1.2,0);add('ar',0,0,-Math.sin(t*2+ph)*1.2,0);
    if(atk){all(0,.34*st-.06*wind,2*wind);add('al',0,.25*st,4*st,0);add('ar',0,.25*st,4*st,0);add('hd',0,.06*st,0,0)}}
  else if(k==='eel'){for(let i=0;i<8;i++)add('s'+i,Math.sin(t*(mv?9:4)-i*.8+ph)*.12*(.4+i*.1),0,0,0);add('hd',Math.sin(t*(mv?9:4)+.8+ph)*.05,0,0,0);if(atk)all(0,.35*st,2*st)}
  const R=new Array(n);const sq=k==='slime'?(L.sq||0):0;
  for(let i=0;i<n;i++){const b=L[i],o=i*4;let x=b[0]+O[o],y=b[1]+O[o+1],z=b[2]+O[o+2],h=Math.max(.4,b[5]+O[o+3]);
    if(sq){const f=1-sq,hf=1/Math.sqrt(Math.max(.4,f));z=z*f;h=h*f;x=x*hf;y=y*hf;R[i]=[x,y,z,b[3]*hf,b[4]*hf,h,b[6]];continue}
    R[i]=[x,y,z,b[3],b[4],h,b[6]]}
  return R}
// direzione e stato del nemico: si gira dove cammina, verso chi attacca, altrimenti verso l'eroe se lo ha visto
function rigFace(e){const px=e.lpx==null?e.px:e.lpx,py=e.lpy==null?e.py:e.lpy,dx=e.px-px,dy=e.py-py;e.lpx=e.px;e.lpy=e.py;
  if(dx*dx+dy*dy>1e-6){e.mvT=t;e.fd=[dx,dy]}
  if(e.atkD&&t-(e.atkT||-9)<ATK)e.fd=e.atkD;else if(t-(e.mvT||-9)>.4&&e.al&&P)e.fd=[P.px-e.px,P.py-e.py];
  const d=e.fd||[0,1];return faceOf(d[0],d[1])}
// pose leggere anche per i modelli vecchi (boss speciali, macchine): respiro, passo e balzo d'attacco
function oldPose(L,e){const lt=t-(e.atkT||-9),atk=lt>=0&&lt<ATK,b=Math.sin(t*2.2+(e.id||0))*.6,mv=t-(e.mvT||-9)<.18;const st=atk?Math.sin(Math.min(1,lt/ATK)*Math.PI):0;
  const lift=mv?Math.abs(Math.sin(t*9+(e.id||0)))*1.5:b;return L.map(q=>[q[0],q[1],q[2]+(q[2]>3?lift:0)+st*3,q[3],q[4],q[5]*(1+st*.06),q[6]])}

// ================= abilità dell'eroe: ogni mossa ha la sua animazione e i suoi effetti =================
let HA=null,VF=[];
function haStart(k,d,o){HA=Object.assign({k,t0:t,d},o||{})}
function vf(o){if(VF.length<120)VF.push(Object.assign({t0:t},o))}
// posa dell'eroe durante l'abilità (gli indici del modello cambiano con l'aspetto: si lavora sulla posizione dei pezzi)
function heroPose(L){if(!HA)return L;const k=(t-HA.t0)/HA.d;if(k>=1){HA=null;return L}
  const isArmR=q=>q[0]+q[3]/2>.18&&q[2]>5,isArmL=q=>q[0]+q[3]/2<-.25&&q[2]>5&&q[2]<22,isLeg=q=>q[2]<1&&q[5]>3,up=q=>q[2]>=8.5;
  const M=(f)=>L.map(q=>{const r=f(q);return r||q});const e3=ease3;
  switch(HA.k){
    case 'area':{const a=Math.sin(k*Math.PI);return M(q=>isArmR(q)?[q[0]+.12*a,q[1]+.1*a,q[2]+3*a-q[2]*.15*a,q[3],q[4],q[5],q[6]]:isLeg(q)?null:up(q)?[q[0],q[1],q[2]-2*a,q[3],q[4],q[5],q[6]]:null)}
    case 'dodge':{const a=Math.sin(Math.min(1,k)*Math.PI),f=1-.42*a;return L.map(q=>[q[0],q[1]+.08*a,q[2]*f,q[3],q[4],q[5]*f,q[6]])}
    case 'lunge':{const a=k<.3?e3(k/.3):1-e3((k-.3)/.7),ty=HA.ty||'Spada';
      if(ty==='Martello'||ty==='Ascia'){const j=Math.sin(Math.min(1,k/.6)*Math.PI)*16,ov=k<.45?e3(k/.45):1-e3((k-.45)/.3);return M(q=>isArmR(q)?[q[0]-.05*ov,q[1]-.1+(.4*(1-ov)),q[2]+j+16*ov-4*(1-ov),q[3],q[4],q[5],q[6]]:[q[0],q[1],q[2]+j,q[3],q[4],q[5],q[6]])}
      if(ty==='Bastone'||ty==='Falce')return M(q=>isArmR(q)?[q[0]+.1*a,q[1]+.25*a,q[2]+4*a,q[3],q[4],q[5],q[6]]:up(q)?[q[0],q[1]+.05*a,q[2],q[3],q[4],q[5],q[6]]:null);
      return M(q=>isArmR(q)?[q[0]-.08*a,q[1]+.42*a,q[2]+5*a,q[3],q[4],q[5],q[6]]:up(q)?[q[0],q[1]+.12*a,q[2]-1.5*a,q[3],q[4],q[5],q[6]]:isLeg(q)&&q[0]<0?[q[0],q[1]-.12*a,q[2],q[3],q[4],q[5],q[6]]:isLeg(q)?[q[0],q[1]+.12*a,q[2],q[3],q[4],q[5],q[6]]:null)}
    case 'palmo':{const a=k<.25?e3(k/.25):1-e3((k-.6)/.4);return M(q=>(isArmR(q)||isArmL(q))?[q[0]*.6,q[1]+.38*a,q[2]+4*a,q[3],q[4],q[5],q[6]]:up(q)?[q[0],q[1]+.1*a,q[2]-2*a,q[3],q[4],q[5],q[6]]:isLeg(q)&&q[0]<0?[q[0],q[1]-.14*a,q[2],q[3],q[4],q[5],q[6]]:null)}
    case 'calcio':{const j=Math.sin(Math.min(1,k)*Math.PI)*14;let first=true;return L.map(q=>{if(isLeg(q)&&q[0]>0)return[q[0],q[1]+.05,q[2]+j+6,q[3],q[4]+.26,Math.max(2,q[5]-6),q[6]];return[q[0],q[1],q[2]+j,q[3],q[4],q[5],q[6]]})}
    case 'ombra':return L;
    case 'tigre':{const a=Math.sin(Math.min(1,k*1.3)*Math.PI);return M(q=>(isArmR(q)||isArmL(q))?[q[0]+(q[0]<0?-.06:.06)*a,q[1],q[2]+11*a,q[3],q[4],q[5],q[6]]:up(q)?[q[0],q[1],q[2]+1.5*a,q[3],q[4],q[5],q[6]]:null)}}
  return L}
// direzione dell'eroe durante le mosse che girano
function heroFace(fc){if(!HA)return fc;const k=(t-HA.t0)/HA.d;if(HA.k==='area')return(fc+Math.floor(k*16))&7;if(HA.k==='calcio')return(fc+Math.floor(k*24))&7;return fc}
// trasparenza dell'eroe (il Passo dell'Ombra lo fa sparire e ricomparire)
function heroAlpha(){if(!HA||HA.k!=='ombra')return 1;const k=(t-HA.t0)/HA.d;return k<.35?1-k/.35*.85:k<.5?.15:Math.min(1,.15+(k-.5)/.3*.85)}
// effetti nel mondo: archi, fendenti, onde, vortici, aure, crepe, immagini fantasma
function vfDraw(){if(!VF.length)return;g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);VF=VF.filter(f=>t-f.t0<f.d);const ar=(x,y,r,a0,a1,z,c,w,al,n=28)=>{g.beginPath();for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n,X=PX(x+Math.cos(a)*r,y+Math.sin(a)*r),Y=PY(x+Math.cos(a)*r,y+Math.sin(a)*r,z);i?g.lineTo(X,Y):g.moveTo(X,Y)}g.strokeStyle=`rgba(${c},${al})`;g.lineWidth=w;g.stroke()};
  for(const f of VF){const k=(t-f.t0)/f.d;g.save();g.globalCompositeOperation='lighter';g.lineCap='round';
    switch(f.k){
      case 'slash':{// fendente a mezzaluna che si allarga e si spegne
        const sp=f.sp||Math.PI*1.1,a1=f.a+sp*Math.min(1,k*2.2),a0=Math.max(f.a,a1-sp*.75);for(let j=0;j<4;j++)ar(f.x,f.y,f.r*(1-j*.06),a0+(a1-a0)*j*.15,a1,f.z||12,f.c,(f.w||10)*(1-j*.22)*(1-k*.5),(1-k)*(.85-j*.18));
        if(f.c2)ar(f.x,f.y,f.r*.97,a0,a1,f.z||12,f.c2,2,(1-k));break}
      case 'thrust':{const p=Math.min(1,k*3),x1=f.x+f.dx*f.r*p,y1=f.y+f.dy*f.r*p,X0=PX(f.x,f.y),Y0=PY(f.x,f.y,f.z||14),X1=PX(x1,y1),Y1=PY(x1,y1,f.z||14);
        for(const[w,a]of[[16,.18],[8,.4],[3,.95]]){g.strokeStyle=`rgba(${f.c},${a*(1-k)})`;g.lineWidth=w*(f.w||1);g.beginPath();g.moveTo(X0,Y0);g.lineTo(X1,Y1);g.stroke()}
        if(f.star){g.globalAlpha=1-k;g.drawImage(glowSpr(f.c),X1-26,Y1-26,52,52);g.globalAlpha=1}break}
      case 'ring':{const r=f.r0+(f.r-f.r0)*ease3(k);g.strokeStyle=`rgba(${f.c},${(1-k)*.9})`;g.lineWidth=(f.w||6)*(1-k*.6);g.beginPath();g.ellipse(PX(f.x,f.y),PY(f.x,f.y,f.z||1),r*45,r*22.5,0,0,6.3);g.stroke();
        if(f.fill){g.fillStyle=`rgba(${f.c},${(1-k)*.18})`;g.fill()}break}
      case 'spin':{if(f.fol&&P){f.x=P.px;f.y=P.py}for(let j=0;j<3;j++){const a=f.a+k*Math.PI*4+j*2.09;ar(f.x,f.y,f.r,a,a+1.6,10+j*3,f.c,9-j*2,(1-k)*.8)}break}
      case 'cone':{const r=f.r*ease3(Math.min(1,k*1.6)),a=Math.atan2(f.dy,f.dx);for(let j=0;j<3;j++)ar(f.x,f.y,r*(1-j*.18),a-.75,a+.75,6+j*5,f.c,14-j*4,(1-k)*(.8-j*.2),18);
        g.globalAlpha=(1-k)*.8;const X=PX(f.x+Math.cos(a)*r*.7,f.y+Math.sin(a)*r*.7),Y=PY(f.x+Math.cos(a)*r*.7,f.y+Math.sin(a)*r*.7,10);g.drawImage(glowSpr(f.c),X-60,Y-35,120,70);break}
      case 'tornado':{if(f.fol&&P){f.x=P.px;f.y=P.py}for(let j=0;j<26;j++){const h=(j/26)*60,a=t*14+j*.9,r=.35+j/26*.6,X=PX(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r),Y=PY(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,h);g.fillStyle=`rgba(${f.c},${(1-k)*.75})`;g.fillRect(X-3,Y-3,6,4)}break}
      case 'aura':{if(f.fol&&P){f.x=P.px;f.y=P.py}for(let j=0;j<10;j++){const a=j*.628+t*1.5,r=.45,u=((t*1.6+j*.37)%1),X=PX(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r),Y=PY(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,4+u*48);g.fillStyle=`rgba(${f.c},${(1-u)*(1-k)*.8})`;g.fillRect(X-2.5,Y-10,5,14)}
        const X=PX(f.x,f.y),Y=PY(f.x,f.y,16);g.globalAlpha=(1-k)*.55;g.drawImage(glowSpr(f.c),X-70,Y-60,140,90);
        if(f.stripe)for(let j=0;j<3;j++){g.strokeStyle=`rgba(255,140,30,${(1-k)*.7})`;g.lineWidth=4;g.beginPath();const yy=Y-6-j*12+Math.sin(t*6+j)*2;g.moveTo(X-22,yy);g.quadraticCurveTo(X,yy-8,X+22,yy);g.stroke()}break}
      case 'crack':{g.globalCompositeOperation='source-over';for(let j=0;j<(f.n||7);j++){const a=j*6.283/(f.n||7)+f.x*3,l=f.r*(.6+((j*37)%10)/25);g.strokeStyle=`rgba(40,28,16,${(1-k)*.55})`;g.lineWidth=2.2;g.beginPath();g.moveTo(PX(f.x,f.y),PY(f.x,f.y,0));
          const mx=f.x+Math.cos(a)*l*.5+Math.cos(a+1.4)*.15,my=f.y+Math.sin(a)*l*.5+Math.sin(a+1.4)*.15;g.lineTo(PX(mx,my),PY(mx,my,0));g.lineTo(PX(f.x+Math.cos(a)*l,f.y+Math.sin(a)*l),PY(f.x+Math.cos(a)*l,f.y+Math.sin(a)*l,0));g.stroke()}break}
      case 'ghost':{g.globalCompositeOperation='source-over';g.globalAlpha=(1-k)*(f.a||.45);drawHero(f.L,f.x,f.y,f.z||0,f.white?1:0,f.fc);break}
      case 'x':{const p=Math.min(1,k*3),X=PX(f.x,f.y),Y=PY(f.x,f.y,18),r=34*p;g.strokeStyle=`rgba(${f.c},${1-k})`;for(const w of[12,4]){g.lineWidth=w;g.beginPath();g.moveTo(X-r,Y-r*.6);g.lineTo(X+r,Y+r*.6);g.moveTo(X+r,Y-r*.6);g.lineTo(X-r,Y+r*.6);g.stroke()}break}
      case 'flash':{g.globalAlpha=(1-k);const X=PX(f.x,f.y),Y=PY(f.x,f.y,f.z||14);g.drawImage(glowSpr(f.c),X-f.r,Y-f.r*.7,f.r*2,f.r*1.4);break}}
    g.restore()}}
// scossa della camera per i colpi pesanti
let VSHK=0;function shake(a){if(cineOK())VSHK=Math.max(VSHK,a)}
function shakeTick(dt){if(VSHK>0){VSHK=Math.max(0,VSHK-dt*2.2);camX+=(Math.random()-.5)*VSHK*16;camY+=(Math.random()-.5)*VSHK*10}}
// istantanea dell'eroe per le immagini fantasma
function heroSnap(){return heroL(P.ap,P.eq.c?P.eq.c.r:-1,P.eq.h?P.eq.h.r:-1,P.eq.w?P.eq.w.r:0,P.eq.w?iv(P.eq.w):3,P.eq.s?P.eq.s.r:-1,0,eqTy(P.eq))}
const ANG=(dx,dy)=>Math.atan2(dy,dx);
// ---- gli effetti di ogni abilità ----
function fxArea(){haStart('area',.45);const c=lgFxCol();vf({k:'spin',x:P.px,y:P.py,r:1.5,a:0,c,d:.5,fol:1});vf({k:'ring',x:P.px,y:P.py,r0:.4,r:2.6,c:'255,230,170',w:7,d:.55,fill:1});
  if(cineOK())burst(P.px,P.py,16,['#ffe8a0','#ffffff','#d8c8a0'],{v:2.2,up:60,gr:200,d:.6,s:3,z:4});shake(.25)}
function fxDodge(dx,dy){haStart('dodge',.3);const L=heroSnap(),fc=P.fc|0;for(let i=0;i<4;i++)setTimeout(()=>{if(P)vf({k:'ghost',L,x:P.px,y:P.py,fc,d:.35,a:.35-i*.06})},i*55);
  if(cineOK()){burst(P.px,P.py,8,['#c8b89a','#a89878'],{v:1,up:40,gr:120,d:.5,s:4,z:2});setTimeout(()=>{if(P)burst(P.px,P.py,6,['#c8b89a','#a89878'],{v:.8,up:30,gr:120,d:.5,s:4,z:2})},250)}}
function lgFxCol(){const w=P.eq.w;return w&&w.r>=3?'255,180,60':w&&w.r===2?'200,120,255':w&&w.r===1?'120,190,255':'230,240,255'}
function fxLunge(T,dx,dy){const ty=Object.keys(LG).find(k=>LG[k]===T)||'Spada',x=P.px,y=P.py,a=ANG(dx,dy),c=lgFxCol();haStart('lunge',ty==='Martello'||ty==='Ascia'?.5:.32,{ty});
  switch(ty){
    case 'Pugnale':vf({k:'slash',x:x+dx*1.2,y:y+dy*1.2,r:.8,a:a-2.2,sp:2.2,c,w:7,d:.28});setTimeout(()=>vf({k:'slash',x:P.px,y:P.py,r:.8,a:a+.6,sp:-2.2,c,w:7,d:.28}),110);vf({k:'thrust',x,y,dx,dy,r:T.r,c:'230,240,255',w:.5,d:.25});break;
    case 'Spada':vf({k:'thrust',x,y,dx,dy,r:T.r+.4,c,w:1.1,d:.32,star:1});setTimeout(()=>{if(P)vf({k:'slash',x:P.px,y:P.py,r:1.1,a:a-1.3,sp:2.6,c,w:9,d:.3})},140);break;
    case 'Stocco':for(let i=0;i<3;i++)setTimeout(()=>{if(P)vf({k:'thrust',x:P.px,y:P.py,dx,dy,r:1.4,c:'255,240,180',w:.6,d:.18,star:1})},i*70);vf({k:'thrust',x,y,dx,dy,r:T.r,c,w:.5,d:.3});break;
    case 'Lancia':vf({k:'thrust',x,y,dx,dy,r:T.r+.8,c,w:1.4,d:.4,star:1});vf({k:'cone',x,y,dx,dy,r:T.r*.8,c:'200,230,255',d:.35});break;
    case 'Ascia':setTimeout(()=>{if(!P)return;vf({k:'slash',x:P.px,y:P.py,r:1.2,a:a-1.6,sp:3.2,c:'255,150,90',w:13,d:.32});vf({k:'crack',x:P.px+dx*.8,y:P.py+dy*.8,r:1.0,n:6,d:1.2});shake(.45);if(cineOK())burst(P.px+dx*.8,P.py+dy*.8,14,['#8a6a4a','#c8a878','#ffffff'],{v:1.6,up:140,gr:400,d:.8,s:4,z:2})},230);break;
    case 'Martello':setTimeout(()=>{if(!P)return;vf({k:'ring',x:P.px,y:P.py,r0:.3,r:3,c:'255,200,120',w:10,d:.5,fill:1});vf({k:'crack',x:P.px,y:P.py,r:1.4,n:9,d:1.5});vf({k:'flash',x:P.px,y:P.py,r:110,c:'255,220,160',d:.25,z:4});shake(.8);
      if(cineOK())burst(P.px,P.py,22,['#8a7a6a','#b8a888','#ffffff'],{v:2.4,up:200,gr:420,d:.9,s:5,z:2})},240);break;
    case 'Bastone':vf({k:'spin',x:x+dx*1.2,y:y+dy*1.2,r:.9,a,c:'120,200,255',d:.45});vf({k:'thrust',x,y,dx,dy,r:T.r,c:'140,210,255',w:.8,d:.3});if(cineOK())sparks(x+dx*2,y+dy*2,12,['#9ad8ff','#ffffff'],80);break;
    case 'Falce':vf({k:'slash',x:x+dx*.9,y:y+dy*.9,r:1.6,a:a-2,sp:4,c:'200,90,255',w:12,d:.42,c2:'255,255,255'});break}
  whoosh()}
function fxPalmo(dx,dy){haStart('palmo',.5);vf({k:'cone',x:P.px,y:P.py,dx,dy,r:3.4,c:'255,150,40',d:.55});vf({k:'flash',x:P.px+dx*.6,y:P.py+dy*.6,r:70,c:'255,200,100',d:.3});shake(.4);
  if(cineOK())for(let i=0;i<14;i++){const sp=(Math.random()-.5)*1.2,a=ANG(dx,dy)+sp,v=1.8+Math.random()*1.5;sfx({k:'pt',x:P.px+dx*.4,y:P.py+dy*.4,z:12,vx:Math.cos(a)*v,vy:Math.sin(a)*v,vz:20+Math.random()*30,gr:30,b:0,d:.6,c:['#ffb040','#ff7020','#ffe0a0'][i%3],s:5})}}
function fxCalcio(){haStart('calcio',.6);vf({k:'tornado',x:P.px,y:P.py,c:'220,240,255',d:.7,fol:1});vf({k:'ring',x:P.px,y:P.py,r0:.5,r:2.3,c:'230,245,255',w:6,d:.6});shake(.3)}
function fxOmbra(x0,y0,tg){haStart('ombra',.5);const L=heroSnap();vf({k:'ghost',L,x:x0,y:y0,fc:P.fc|0,d:.5,a:.5});
  if(cineOK()){burst(x0,y0,16,['#3a2a4a','#6a3a8a','#1a1424'],{v:.8,up:50,gr:-20,d:.9,s:6,z:6});setTimeout(()=>{if(P)burst(P.px,P.py,12,['#3a2a4a','#c46bff'],{v:.9,up:60,gr:-20,d:.8,s:5,z:8})},160)}
  if(tg)setTimeout(()=>vf({k:'x',x:tg.px,y:tg.py,c:'200,110,255',d:.45}),180)}
function fxTigre(){haStart('tigre',.9);vf({k:'aura',x:P.px,y:P.py,c:'90,255,140',d:1.3,stripe:1,fol:1});pillar(P.px,P.py,'90,255,140',1.2,40)}

newModels();

/* ================= 7.2: luoghi — recinzioni, pontili, cancelli a tema, porto, mulino, cripta ================= */
// ---- recinzioni: ogni palo si collega solo ai pali vicini, nella direzione giusta ----
const isFence=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&DEC[y][x]==='f';
function fenceD(x,y){const W='#5a4a3a',P2='#4a3a2a',l=isFence(x-1,y),r=isFence(x+1,y),u=isFence(x,y-1),d=isFence(x,y+1);
  box(x+.43,y+.43,0,.14,.14,12,P2);box(x+.41,y+.41,12,.18,.18,1.5,'#6a5a48');
  for(const z of[4,8.5]){if(l)box(x,y+.46,z,.5,.08,1.8,W);if(r)box(x+.5,y+.46,z,.5,.08,1.8,W);if(u)box(x+.46,y,z,.08,.5,1.8,W);if(d)box(x+.46,y+.5,z,.08,.5,1.8,W)}}
// ---- pontili di legno: assi trasversali con le fughe, travi di bordo e pali che scendono in acqua ----
let PIERD=new Set();
function pierTile(x,y,h){const water=(a,b)=>M[b]&&M[b][a]===2,isP=(a,b)=>(M[b]&&M[b][a]===4&&(DEC[b][a]==='~'||(Zk==='town'&&b>=64)))||PIERD.has(b*N+a);
  // le assi vanno di traverso rispetto al verso più lungo del pontile
  let lx=0,ly=0;for(let i=1;i<9;i++){if(isP(x-i,y))lx++;else break}for(let i=1;i<9;i++){if(isP(x+i,y))lx++;else break}for(let i=1;i<9;i++){if(isP(x,y-i))ly++;else break}for(let i=1;i<9;i++){if(isP(x,y+i))ly++;else break}
  const across=ly>=lx?'x':'y';
  box(x,y,-7,1,1,6,'#3a2a1a',.9);const tone=['#9a7448','#8e6a40','#a27c4e','#8a663e'];
  for(let i=0;i<4;i++){const c=tone[(hs(x*31+y*17+i)>>>3)%4],f=.92+h*.1+((i*7+x+y)%3)*.02;
    if(across==='x')box(x+.01,y+i*.25+.015,-1.2,.98,.22,1.2,c,f);else box(x+i*.25+.015,y+.01,-1.2,.22,.98,1.2,c,f)}
  if(across==='x'){box(x+.12,y+.1,0,.03,.03,.3,'#3a2a1a');box(x+.85,y+.6,0,.03,.03,.3,'#3a2a1a')}else{box(x+.1,y+.12,0,.03,.03,.3,'#3a2a1a');box(x+.6,y+.85,0,.03,.03,.3,'#3a2a1a')}
  // travi sui lati che guardano l'acqua e pali ogni due caselle
  if(water(x+1,y))box(x+.9,y,-6,.1,1,6.2,'#5a4028');if(water(x,y+1))box(x,y+.9,-6,1,.1,6.2,'#5a4028');
  if(water(x+1,y)&&y%2===0)box(x+.86,y+.4,-16,.16,.16,17,'#4a3420');if(water(x,y+1)&&x%2===0)box(x+.4,y+.86,-16,.16,.16,17,'#4a3420');
  if(water(x+1,y)&&water(x,y+1))box(x+.82,y+.82,-16,.18,.18,19,'#4a3420')}
// ---- cancelli ispirati ai quartieri: marmo e ferro battuto per i nobili, legno e paglia per i campi ----
Object.assign(GSTY,{nobile:{p:'#ece6da',c:'#d4af37',l:'#1c1c24',l2:'#2a2a34',h:'#d4af37',ex:(Q,o,sp,eo)=>{
    for(const a of[o,o+sp]){Q(a-.22,eo-.22,58,.44,.44,3,'#ece6da');Q(a-.16,eo-.16,61,.32,.32,6,'#d4af37');Q(a-.1,eo-.1,67,.2,.2,4,'#ece6da');Q(a-.06,eo-.06,71,.12,.12,3,'#d4af37')}
    Q(o+sp/2-.32,eo-.25,43,.64,.06,13,'#2a4a8a');Q(o+sp/2-.2,eo-.27,46,.4,.05,7,'#d4af37');Q(o+sp/2-.06,eo-.28,48,.12,.04,3,'#a8303a');
    Q(o-1.25,eo-.42,0,.8,.84,15,'#3f7a32');Q(o-1.2,eo-.38,15,.7,.76,3,'#4a8a3a');Q(o+sp+.45,eo-.42,0,.8,.84,15,'#3f7a32');Q(o+sp+.5,eo-.38,15,.7,.76,3,'#4a8a3a');
    for(const a of[o-.85,o+sp+.85]){Q(a-.12,eo-.12,18,.24,.24,4,'#e8e0d0');Q(a-.06,eo-.06,22,.12,.12,5,'#e0304a')}}},
  campi:{p:'#7a5a3a',c:'#e0c060',l:'#a07a4a',l2:'#8a6a3a',h:'#3a3a3a',ex:(Q,o,sp,eo)=>{
    for(const a of[o,o+sp]){Q(a-.28,eo-.28,58,.56,.56,3,'#d8b850');Q(a-.14,eo-.14,61,.28,.28,8,'#e0c050');Q(a-.04,eo-.04,69,.08,.08,4,'#c8a040')}
    Q(o+sp/2-.48,eo-.27,47,.96,.07,10,'#a07a4a');Q(o+sp/2-.4,eo-.29,49,.8,.04,6,'#8a6a3a');Q(o+sp/2-.3,eo-.3,51,.12,.03,2,'#e8e0c8');Q(o+sp/2-.1,eo-.3,51,.2,.03,2,'#e8e0c8');Q(o+sp/2+.18,eo-.3,51,.12,.03,2,'#e8e0c8');
    Q(o-1.15,eo-.36,0,.72,.66,8,'#e0c060');Q(o-1.1,eo-.31,8,.62,.56,6,'#d8b850');Q(o-1.15,eo-.36,4,.72,.66,.8,'#a08030');
    Q(o+sp+.42,eo-.3,0,.6,.56,7,'#e0c060');Q(o+sp+.5,eo-.06,7,.06,.08,16,'#6a4a2a');Q(o+sp+.4,eo-.08,16,.26,.06,2,'#6a4a2a');Q(o+sp+.47,eo-.1,23,.12,.1,5,'#e0c060')}},
  // 7.12: il cancello del Borgo delle Ceneri, come quelli degli altri lati della città: pilastri anneriti dal fuoco, sbarre di
  // ferro arrugginito, un arco di ferro con le punte, bracieri spenti (con qualche brace) e l'insegna bruciata
  ceneri:{p:'#5e5854',c:'#36312e',l:'#2e2420',l2:'#3e2e26',h:'#8a4a22',v:'#4a4038',bars:1,ex:(Q,o,sp,eo)=>{
    for(const a of[o,o+sp]){Q(a-.37,eo-.37,30,.74,.74,5,'#3e3936');Q(a-.37,eo-.37,12,.74,.74,3,'#46403c');
      Q(a-.24,eo-.24,58,.48,.48,3,'#2a2624');Q(a-.3,eo-.3,61,.6,.6,4,'#2e2826');Q(a-.2,eo-.2,64.2,.4,.4,.8,'#4a4440');
      for(let i=0;i<3;i++){const k=.5+.5*Math.sin(t*(2.3+i)+a*3+i*2);Q(a-.16+i*.11,eo-.12+(i%2)*.14,65,.08,.08,1+k,k>.7?'#ff8a3a':'#a8401a')}}
    for(let k=0;k<=8;k++){const a=o+sp*k/8,z=50+Math.sin(k/8*Math.PI)*7;Q(a-.06,eo-.06,z,.12,.12,3,'#33282a');if(k%2===0&&k&&k<8)Q(a-.03,eo-.03,z+3,.06,.06,4,'#4a3a32')}
    Q(o+sp/2-.42,eo-.1,40,.84,.08,7,'#2e221a');Q(o+sp/2-.36,eo-.12,42,.72,.04,3,'#4a3626');Q(o+sp/2-.3,eo-.13,44,.1,.03,2,'#6a5a4a');Q(o+sp/2+.06,eo-.13,43,.16,.03,2,'#6a5a4a');
    Q(o+sp/2-.3,eo-.08,47,.04,.04,3,'#2a2420');Q(o+sp/2+.26,eo-.08,47,.04,.04,3,'#2a2420');
    Q(o-1.15,eo-.32,0,.62,.55,2,'#6a6560');Q(o-1.05,eo-.25,2,.4,.35,1.5,'#7a7470');Q(o+sp+.5,eo-.28,0,.52,.46,1.6,'#5e5a56');Q(o+sp+.56,eo-.22,1.6,.3,.28,1.2,'#8a3a1a')}}});
// ---- il mulino: distrutto dalla tempesta finché Pietro non lo ripara ----
const millOK=()=>!!(P&&P.unl&&P.unl.mulino);
function millBroken(x,y,b,ht){const zc=ht*.75;box(x+.42,y+1.02,zc-3,.16,.06,6,'#5a3a2a');
  // un'asse rimasta, storta, e una spezzata che pende
  for(let q=1;q<=6;q++)box(x+.5+Math.cos(.55)*q*.3-.08,y+1.06,zc+Math.sin(.55)*q*8-3,.16,.05,6,q>2?'#d8cdb4':'#6a4a2a');
  for(let q=1;q<=4;q++)box(x+.5-q*.06-.08,y+1.06,zc-q*7-3,.16,.05,6,q>2?'#c8bca0':'#5a3a20');
  box(x+.62,y+1.03,zc+14,.3,.04,10,'#3a2a1a')}
// detriti del mulino a terra
function millDebris(x,y){box(x+.1,y+.3,0,.8,.12,1.4,'#c8bca0');box(x+.25,y+.05,1.4,.12,.8,1.4,'#8a6a42');box(x+.55,y+.6,0,.3,.3,3,'#7a5a3a')}
// ---- decorazioni nuove: casse da pesca, ceste, rastrelliere col pesce, banchi del pesce, corde, lanterne, alghe, ancora, statue della cripta ----
function decWorld(x,y,c,h){switch(c){
  case 'Ж':box(x+.12,y+.14,0,.7,.5,6,'#9a7448');box(x+.14,y+.16,6,.66,.46,.6,'#7a5a3a');for(let i=0;i<3;i++)box(x+.2+i*.2,y+.22,6.2,.14,.32,1.4,['#9ab0c0','#c0c8d0','#d8a080'][i%3]);
    box(x+.2,y+.24,7,.6,.42,5,'#8e6a40');box(x+.22,y+.26,12,.56,.38,.6,'#6a4a2a');box(x+.3,y+.32,12.4,.18,.12,1.2,'#a8b8c8');break;
  case 'Щ':box(x+.28,y+.28,0,.44,.44,6,'#b08a52');box(x+.26,y+.26,6,.48,.48,1,'#8a6a3a');for(let i=0;i<4;i++)box(x+.32+(i%2)*.18,y+.32+(i>>1)*.16,6.5,.14,.1,1.6,i%2?'#c8d0d8':'#9ab0c0');break;
  case 'Ъ':box(x+.1,y+.45,0,.06,.06,22,'#6a4a2a');box(x+.84,y+.45,0,.06,.06,22,'#6a4a2a');box(x+.1,y+.45,21,.8,.06,1.4,'#5a3a20');
    for(let i=0;i<5;i++){const sw=Math.sin(t*1.5+i+x)*.01;box(x+.2+i*.14+sw,y+.46,12,.06,.04,8,i%2?'#a8b8c8':'#c8a878')}break;
  case 'Ы':box(x+.05,y+.15,0,.9,.7,9,'#8a6a42');box(x+.08,y+.18,9,.84,.64,1.5,'#e8f4fa',1.05);
    for(let i=0;i<6;i++)box(x+.14+(i%3)*.26,y+.24+(i>>1&1)*.28,10.5,.2,.1,1.4,['#9ab0c0','#d89870','#c0c8d0'][i%3]);
    box(x+.06,y+.15,9,.06,.06,16,'#5a3a20');box(x+.88,y+.15,9,.06,.06,16,'#5a3a20');box(x,y+.1,25,1,.8,1.4,'#3a7ab8');box(x+.02,y+.12,25.5,.96,.76,.6,'#e8e8f0');break;
  case 'Ь':for(let i=0;i<3;i++)box(x+.22+i*.03,y+.22+i*.03,i*1.6,.4-i*.06,.4-i*.06,1.6,'#c8b080');box(x+.6,y+.55,0,.24,.24,5,'#7a8a9a');box(x+.62,y+.57,5,.2,.2,.6,'#3a6a9a');break;
  case 'Э':box(x+.45,y+.45,0,.1,.1,26,'#3a3a3a');box(x+.45,y+.3,24,.1,.2,1.5,'#3a3a3a');box(x+.42,y+.22,18,.16,.16,6,'#ffd88a',1.15);nlight(x+.5,y+.3,21,140,'255,214,140',.8);if(SET.ultra)GLOW.push([x+.5,y+.3,21,40,'255,214,140',.25]);break;
  case 'Ю':box(x+.15,y+.2,0,.5,.4,4,'#6a6a70');box(x+.5,y+.5,0,.32,.3,3,'#5a5a60');for(let i=0;i<4;i++){const s=Math.sin(t*1.8+i+x)*.04;box(x+.2+i*.17+s,y+.3+(i%2)*.25,3,.06,.06,6+(i%3)*2,i%2?'#2f8a4a':'#3fa05a')}break;
  case 'Я':box(x+.46,y+.2,0,.08,.6,1.4,'#4a4a52');box(x+.46,y+.45,1.4,.08,.08,14,'#4a4a52');box(x+.36,y+.42,13,.28,.14,1.6,'#4a4a52');box(x+.3,y+.2,0,.4,.08,3,'#5a4a3a');box(x+.42,y+.8,0,.16,.12,2,'#7a3a2a');break;
  case 'Б':box(x+.25,y+.25,0,.5,.5,6,'#8a8a90');box(x+.33,y+.33,6,.34,.34,14,'#a8a8ae');box(x+.3,y+.3,20,.4,.4,5,'#b8b8be');box(x+.2,y+.36,16,.14,.26,8,'#9a9aa0');box(x+.66,y+.36,16,.14,.26,8,'#9a9aa0');box(x+.42,y+.42,25,.16,.16,3,'#c8c8ce');break;
  case 'Г':millDebris(x,y);break;
  case 'Л':box(x+.2,y+.2,0,.6,.6,5,'#8a6a3a');for(let i=0;i<4;i++)box(x+.24+(i%2)*.28,y+.24+(i>>1)*.28,5,.22,.22,2.4,['#e0402a','#f0a020','#4a9a3a','#e8d050'][(i+x)%4]);break;
  case 'Ф':box(x+.1,y+.45,0,.06,.06,18,'#6a4a2a');box(x+.84,y+.45,0,.06,.06,18,'#6a4a2a');for(let i=0;i<6;i++)box(x+.16+i*.12,y+.47,4+((i*5)%4),.1,.02,13-((i*5)%4),'#a89a7a');box(x+.3,y+.45,10,.08,.08,2,'#e8483a');box(x+.62,y+.45,7,.08,.08,2,'#e8b020');break;
  default:return false}return true}
// ---- il porto: casse da pesca sui pontili, più mercato sul lungomare (il pozzo dell'Abisso, dalla 7.12, è sulla banchina) ----
function portDecor(){if(Zk!=='porto')return;const ok=(x,y)=>M[y]&&M[y][x]===4&&!ents.some(e=>Math.abs(e.px-x-.5)<.9&&Math.abs(e.py-y-.5)<.9);
  for(const[x,y,c]of[[8,35,'Ж'],[6,44,'Щ'],[26,44,'Ж'],[22,47,'Ь'],[26,33,'Ж'],[38,42,'Щ'],[36,33,'Ж'],[8,31,'Ь'],[3,46,'Ж'],[11,45,'Щ'],[30,49,'Ж'],[18,50,'Ь'],[47,31,'Ж'],[22,35,'Щ'],[38,31,'Э'],[22,31,'Э'],[6,31,'Э']])if(ok(x,y)){M[y][x]=6;DEC[y][x]=c;PIERD.add(y*N+x)}
  FC=null}
// ---- dialoghi del mugnaio: il mulino rotto e poi riparato ----
function millLines(){const d=NPCS.pietro;if(!d)return;d.ln=millOK()?['Il vento gira, la macina gira. Tutto gira, grazie a te!','La farina di Aldoria finisce di nuovo sulla tavola del Re.']:['La tempesta mi ha spezzato le pale. Senza mulino, niente farina.','Guarda che disastro... trent\'anni di lavoro, e una notte di vento.']}
function millRepaired(){millLines();FC=null;BM&&0;banner('Il mulino è riparato','Le pale girano di nuovo nei Campi e Mestieri','pergamena');if(cineOK()&&Zk==='campi'){const b=TB.find(b=>b.st==='mill');if(b){burst(b.x+b.w/2,b.y+b.h,30,['#ffffff','#e0c050','#a07a4a'],{v:1.6,up:220,gr:300,d:1.4,s:4,z:40});ringFx(b.x+b.w/2,b.y+b.h,'255,230,160',1,3)}}jingle([60,64,67,72,76],.12,'triangle')}
// ---- la cripta si sposta nel cimitero del Borgo delle Ceneri ----
DG.cripta.ent='rovine';DGH.cripta='nel cimitero del Borgo delle Ceneri (porta ovest della città: il Moreau sa come aprire il cancello)';
DGH.abisso='nel Porto di Aldoria: il pozzo pieno di alghe è sulla banchina, in fondo alla strada che scende dalla città';
if(NPCS.guardia_porta)NPCS.guardia_porta.ln=['A nord la Foresta di Elmwood, a est il Deserto di Khem, a ovest i Picchi Gelidi.','La Cripta è nel cimitero del Borgo delle Ceneri, oltre il cancello ovest. Per l\'Abisso si scende dal pozzo delle alghe, sulla banchina del Porto.'];
if(QA&&QA.re)for(const q of QA.re)if(q[0]==='Un consiglio per un eroe?')q[1]='Comincia dalla Tana dei Goblin, nella Foresta di Elmwood. Poi la Cripta, nel cimitero del Borgo delle Ceneri: chiedi al Moreau di aprirti il cancello. Poi la Piramide nel deserto, le Caverne di Cristallo e la Fucina sui Picchi, e per ultimo l\'Abisso, sotto il porto. Compra pozioni da Mira e torna da me con ogni frammento.';
(function(){const tz=ZB.find(z=>z.k==='town'),rz=ZB.find(z=>z.k==='rovine'),pz=ZB.find(z=>z.k==='porto');if(tz)tz.f=tz.f.map(s=>s==='Cimitero e Cripta Dimenticata (sud-ovest)'?'Il vecchio cimitero (sud-ovest)':s);
  if(rz&&!rz.f.some(s=>/Cripta/.test(s)))rz.f.push('La Cripta Dimenticata, nel cimitero a sud-est: il secondo frammento della Corona');
  if(pz)pz.f=pz.f.map(s=>/Pozzo delle alghe/.test(s)?'Pozzo delle alghe, sulla banchina in fondo alla strada: discesa all\'Abisso Sommerso':s)})();
// ---- il mugnaio Pietro: due missioni per riparare il mulino ----
Object.assign(QT,{mul1:{t:'gat',r:'legna',n:10,once:1,unl:'mul1',ti:'Le pale spezzate',tx:'La tempesta dell\'altra notte mi ha spezzato le pale del mulino. Senza mulino niente farina, e senza farina Aldoria resta senza pane! Portami 10 fasci di legna dal bosco dei taglialegna: con quella rifaccio le pale.',g:140,x:110},
  mul2:{t:'col',e:['goblin','arciere','sciamano_goblin'],it:'Ingranaggio di bronzo',n:4,ch:.4,once:1,req:'mul1',unl:'mulino',ti:'Gli ingranaggi rubati',tx:'Le pale sono pronte, ma mentre il mulino era fermo i goblin della Foresta di Elmwood mi hanno rubato gli ingranaggi di bronzo della macina. Riprendine 4 e il mulino tornerà a girare.',g:260,x:220}});
if(QT.ca7)QT.ca7.req='mulino';if(NPCS.pietro)NPCS.pietro.qs=['mul1','mul2','ca7'];
function worldLoad(k){PIERD=new Set();millLines();if(k==='porto')portDecor()}

/* ================= 7.2: progressione più lenta, prezzi per livello, rarità e storia, nemici più forti con la storia ================= */
// Più avanzi nella storia e di livello, più costa tutto: +8% per ogni tappa della storia, +1,2% per livello.
function priceMul(){if(!P)return 1;return(1+.08*(P.st||0)+(P.te>=2?.08:0))*(1+(P.lv||1)*.012)}
// Le rarità più alte costano molto di più del loro valore: un leggendario costa quasi il doppio di prima, un epico una volta e mezza.
const RMP=[1,1.15,1.45,1.9,2.4];
function itemPM(it){return(RMP[it.r]||1)*priceMul()*(1+Math.min(.6,(it.v||0)/800))}
// Nemici e boss più forti man mano che la storia va avanti (i pezzi dell'Abominio hanno il loro equilibrio).
function stHP(b){if(!P||b.np)return 1;const s=P.st||0;return 1+.07*s+(b.boss?.06*s:0)}
function stAT(b){if(!P||b.np)return 1;const s=P.st||0;return 1+.05*s+(b.boss?.04*s:0)}
// Missioni: chi paga molto ora paga meno, in proporzione (le piccole quasi uguali).
(function(){for(const k in QT){const T=QT[k];if(T._r)continue;T._r=1;const g=T.g||0,x=T.x||0;
  T.g=Math.max(10,Math.round(g*(.9-.3*Math.min(1,Math.max(0,(g-60)/840)))));T.x=Math.max(8,Math.round(x*(.88-.26*Math.min(1,Math.max(0,(x-50)/600)))))}})();

/* ================= 7.2: filmato di benvenuto, cinematica dell'Abominio, stanza dell'Occhio da boss ================= */
// ---- benvenuto ad Aldoria: una visita guidata della città, la prima volta che si gioca ----
const TOURS=[
  {x:36,y:37,z:1.1,d:6.5,ti:'Benvenuto ad Aldoria',tx:'Questa è la capitale del regno. Al centro c\'è la piazza con la fontana e il mercato, aperto dalle 7 alle 19. Di notte in strada restano solo le guardie.'},
  {x:8,y:12.5,z:1.55,d:7,mk:[8.5,12.5],ti:'Il Re ti aspetta',tx:'Il castello è a nord-ovest. Entra e parla con il Re Aldric: ti affiderà la missione principale. Chi ha un ! giallo sopra la testa ha una missione per te; un ? vuol dire che puoi consegnarla.'},
  {x:26,y:23.5,z:1.7,d:6,mk:[26.5,23.5],ti:'Le pozioni',tx:'Nella Bottega dell\'Erborista Mira si comprano le pozioni. In battaglia si bevono con il tasto Q: tienine sempre qualcuna nello zaino.'},
  {x:41,y:24.5,z:1.7,d:6,mk:[41.5,24.5],ti:'Armi e armature',tx:'Il Fabbro Borin vende e potenzia armi, elmi, corazze e scudi. In piazza il Mercante Ugo vende la merce del giorno e zaini più grandi. I prezzi cambiano ogni giorno.'},
  {x:8,y:33.5,z:1.6,d:7,mk:[8.5,33.5],ti:'Come si combatte',tx:'Clicca un nemico per attaccarlo. Spazio: colpo ad area. Shift o E: schivata. F: affondo, diverso per ogni arma. In caserma il Maestro Dino insegna quattro tecniche, da usare con i tasti da 1 a 4.'},
  {x:35,y:3,z:1.4,d:6.5,mk:[35.5,1.5],ti:'Fuori dalle mura',tx:'La grande porta nord porta alla Foresta di Elmwood e alla Tana dei Goblin, dove si trova il primo frammento della Corona. Le altre porte portano al deserto, ai picchi, ai quartieri e al porto.'},
  {x:null,y:null,z:1.25,d:7,ti:'Pronto a partire',tx:'I: zaino · J: missioni · K: diario · M: mappa della zona · V: ruota delle azioni · O: opzioni. Il primo passo è il castello del Re. Buona avventura!'}];
let TOUR=null;
function welcomeTour(force){if(!force&&(LS.get('voxelia_tour',0)||!cineOK()||Zk!=='town'))return false;LS.set('voxelia_tour',1);
  TOUR={i:0,t:0,from:[P.px,P.py,SZ],sz0:SZ};document.body.classList.add('lbx','tour');let el=$('tourb');if(!el){el=document.createElement('div');el.id='tourb';document.body.appendChild(el)}el.hidden=false;tourHTML();music('town');return true}
function tourHTML(){const s=TOURS[TOUR.i],el=$('tourb');el.innerHTML=`<div class="tdots">${TOURS.map((_,i)=>`<i class="${i===TOUR.i?'on':i<TOUR.i?'ok':''}"></i>`).join('')}</div><b>${esc(s.ti)}</b><p>${esc(s.tx)}</p><div class="tbt"><button onclick="tourNext()">${TOUR.i<TOURS.length-1?'Avanti ▸':'Inizia ▸'}</button><button class="mu2" onclick="tourEnd()">Salta</button></div>`;el.classList.remove('in');void el.offsetWidth;el.classList.add('in')}
function tourNext(){if(!TOUR)return;const c=tourCam();TOUR.from=[c[0],c[1],SZ];TOUR.i++;TOUR.t=0;if(TOUR.i>=TOURS.length){tourEnd();return}tourHTML();tone(620,.05,'triangle')}
function tourEnd(){if(!TOUR)return;SZ=TOUR.sz0||1;TOUR=null;document.body.classList.remove('lbx','tour');const el=$('tourb');if(el)el.hidden=true;
  PA={ti:'Benvenuto ad Aldoria',tx:'Il Re Aldric ti attende nel castello a nord-ovest: segui il ! giallo sopra la sua testa.\n\n'+(typeof TCH!=='undefined'&&TCH.on?'I comandi: trascina il dito in basso a sinistra per muoverti (o tocca dove vuoi andare), tocca un personaggio per parlarci e un nemico per attaccarlo. A destra: Colpo, Affondo, Schiva e Pozione; il pulsante verde compare quando puoi parlare, aprire o raccogliere qualcosa. Menu apre zaino, missioni, diario, mappa, chat e opzioni. Due dita per lo zoom.':'I tasti utili: I zaino, J missioni, K diario, M mappa, V ruota delle azioni, O opzioni, WASD o frecce per muoverti, R per interagire, Q pozione, Spazio colpo ad area, Shift o E schivata, F affondo, Invio chat.')};pn('txt')}
function tourCam(){const s=TOURS[TOUR.i],tx=s.x==null?P.px:s.x,ty=s.y==null?P.py:s.y,k=ease3(Math.min(1,TOUR.t/1.5)),f=TOUR.from;return[f[0]+(tx-f[0])*k,f[1]+(ty-f[1])*k,f[2]+(s.z-f[2])*k]}
// se si cambia zona o si torna al menu nel mezzo di un filmato, l'interfaccia torna com'era
function cineReset(){TOUR=null;if(typeof OCC!=='undefined'&&OCC)OCC.intro=null;document.body.classList.remove('lbx','tour','abin');for(const id of['tourb','abit']){const el=$(id);if(el)el.hidden=true}}
function tourTick(dt){if(!TOUR){if(document.body.classList.contains('abin')&&!(OCC&&OCC.intro)){document.body.classList.remove('lbx','abin');const el=$('abit');if(el)el.hidden=true}return}if(Zk!=='town'){tourEnd();return}TOUR.t+=dt;P.path=[];P.tg=null;for(const k in KEYS)KEYS[k]=0;const c=tourCam();SZ=c[2];
  const s=TOURS[TOUR.i];if(TOUR.t>s.d+.4)tourNext()}
function tourDraw(){if(!TOUR)return;const s=TOURS[TOUR.i];if(!s.mk)return;g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);const[x,y]=s.mk,X=PX(x,y),Y=PY(x,y,0),p=(t*1.4)%1;
  g.save();g.globalCompositeOperation='lighter';for(const q of[p,(p+.5)%1]){g.strokeStyle=`rgba(255,214,90,${(1-q)*.9})`;g.lineWidth=4;g.beginPath();g.ellipse(X,Y,20+q*50,10+q*25,0,0,6.3);g.stroke()}
  const bob=Math.abs(Math.sin(t*4))*12;g.fillStyle='rgba(255,214,90,.95)';g.beginPath();g.moveTo(X,Y-40-bob);g.lineTo(X-14,Y-66-bob);g.lineTo(X+14,Y-66-bob);g.closePath();g.fill();g.restore()}
// ---- la stanza dell'Occhio: colonne spezzate, bracieri rossi, catene, ossa, gabbie, rune e vene sul pavimento ----
function genOcchio2({n}){const r=genOcchio({n});const blk=(x,y,c)=>{if(M[y]&&M[y][x]===0&&!DEC[y][x]){M[y][x]=6;DEC[y][x]=c}},flo=(x,y,c)=>{if(M[y]&&M[y][x]===0&&!DEC[y][x])DEC[y][x]=c};
  for(const y of[3,8,13,18,23]){blk(2,y,'Ш');blk(n-3,y,'Ш')}for(const x of[4,24])blk(x,1,'Ш');
  for(const[x,y]of[[5,23],[22,23],[3,16],[24,16],[7,13],[21,13]])blk(x,y,'Д');
  for(const[x,y]of[[3,5],[24,5],[4,20],[23,20]])blk(x,y,'Ц');
  for(const[x,y]of[[2,10],[25,11],[3,25],[24,25],[6,2],[22,2],[2,21],[25,6],[5,9],[23,9]])blk(x,y,'Ч');
  for(const[x,y]of[[8,2],[20,2],[8,6],[20,6]])blk(x,y,'П');
  // cerchio di rune davanti al mostro e vene di carne che strisciano verso la porta
  for(let a=0;a<24;a++){const an=a/24*6.283,x=Math.round(14+Math.cos(an)*4.2),y=Math.round(17+Math.sin(an)*3.2);flo(x,y,'Р')}
  for(let i=0;i<14;i++){flo(14+Math.round(Math.sin(i*.7)*1.2),12+i,'В');flo(8-Math.round(i*.35),11+Math.round(i*.8),'В');flo(20+Math.round(i*.35),11+Math.round(i*.8),'В')}
  for(const[x,y]of[[10,19],[18,15],[6,17],[22,19],[12,23]])flo(x,y,'С');
  return r}
function decCine(x,y,c,h){switch(c){
  case 'Ш':{const br=(x*7+y*3)%3;box(x+.2,y+.2,0,.6,.6,6,'#3a3030');box(x+.27,y+.27,6,.46,.46,br===0?30:br===1?18:40,'#4a3e3c');if(br!==1)box(x+.22,y+.22,br===0?36:46,.56,.56,4,'#3a3030');else for(let i=0;i<3;i++)box(x+.1+i*.25,y+.6,0,.2,.2,4,'#4a3e3c');
    box(x+.3,y+.68,14,.06,.04,8,'#6a1a1a');box(x+.62,y+.68,22,.06,.04,6,'#6a1a1a');if(br!==1){const fl=Math.sin(t*9+x)*.8;box(x+.44,y+.44,br===0?40:50,.12,.12,3+fl,'#ff6a3a',1.3);nlight(x+.5,y+.5,br===0?42:52,90,'255,80,40',.6)}break}
  case 'Д':{box(x+.3,y+.3,0,.4,.4,3,'#2a2222');box(x+.42,y+.42,3,.16,.16,12,'#3a2e2e');box(x+.22,y+.22,15,.56,.56,4,'#2a2222');const f=Math.sin(t*10+x*3)*1.5;box(x+.3,y+.3,19,.4,.4,6+f,'#c8201a',1.25);box(x+.38,y+.38,24,.24,.24,5+f,'#ff6a2a',1.35);
    nlight(x+.5,y+.5,24,200,'255,50,30',1);if(SET.ultra)GLOW.push([x+.5,y+.5,24,60,'255,50,30',.35]);break}
  case 'Ц':{box(x+.1,y+.1,0,.8,.8,1.5,'#2a2424');for(let i=0;i<4;i++){box(x+.12+i*.24,y+.12,1.5,.04,.04,24,'#3a3436');box(x+.12+i*.24,y+.84,1.5,.04,.04,24,'#3a3436')}box(x+.1,y+.1,25,.8,.8,1.5,'#2a2424');
    box(x+.4,y+.4,1.5,.2,.12,5,'#c8bca8');box(x+.38,y+.4,6,.14,.14,3,'#d8ccb8');box(x+.55,y+.3,1.5,.06,.2,2,'#c8bca8');break}
  case 'Ч':{for(const[a,b,z,w]of[[.2,.3,0,.5],[.3,.5,1.5,.4],[.4,.2,0,.3],[.25,.25,3,.3]])box(x+a,y+b,z,w,.08,1.5,'#d8ccb8');box(x+.48,y+.42,1,.2,.18,4,'#e8dcc8');box(x+.52,y+.6,2.5,.04,.01,1.2,'#1a1010');box(x+.6,y+.6,2.5,.04,.01,1.2,'#1a1010');break}
  case 'П':{for(let i=0;i<9;i++){const sw=Math.sin(t*1.2+i*.4+x)*.03;box(x+.45+sw*i*.4,y+.45,i*5,.1,.1,4,i%2?'#5a5a62':'#4a4a52')}box(x+.4,y+.4,45,.2,.2,2,'#3a3a42');break}
  case 'Р':{const p=.6+.4*Math.sin(t*2.2+x*.7+y*.5);box(x+.25,y+.25,0,.5,.5,.4,'#2a0a0a');box(x+.32,y+.45,.4,.36,.1,.3,`rgb(${180+70*p|0},${30*p|0},${20*p|0})`,1.3);box(x+.45,y+.32,.4,.1,.36,.3,`rgb(${180+70*p|0},${30*p|0},${20*p|0})`,1.3);if(p>.9)nlight(x+.5,y+.5,2,50,'255,40,30',.3);break}
  case 'В':{const p=Math.sin(t*1.6+y*.6)*.05;box(x+.35,y,0,.3,1,.6,'#4a1418');box(x+.4+p,y+.1,.6,.2,.8,.4,'#6a1a20');break}
  case 'С':{box(x+.1,y+.15,0,.8,.7,.3,'#3a0606');box(x+.2,y+.25,.3,.5,.4,.2,'#5a0a0a',1.1);break}
  default:return false}return true}
// ---- l'ingresso dell'Abominio: un filmato dentro il gioco, prima della battaglia ----
const ABI=[[0,'Il silenzio. Poi, un respiro.'],[2.6,'La nebbia si apre.'],[5.2,'Ciò che dormiva sotto Aldoria si sveglia.']];
function occIntroStart(){if(!OCC)return;OCC.intro={t:0,i:-1};document.body.classList.add('lbx','abin');let el=$('abit');if(!el){el=document.createElement('div');el.id='abit';document.body.appendChild(el)}el.innerHTML='<p id="abis"></p><h2 id="abih">L\'Abominio</h2><small id="abiu">Ciò che dormiva sotto Aldoria</small><button onclick="occIntroEnd()">Salta ▸</button>';el.hidden=false;el.className=''}
function occIntroEnd(){if(!OCC||!OCC.intro)return;OCC.intro=null;SZ=OCC.sz0||1;document.body.classList.remove('lbx','abin');const el=$('abit');if(el)el.hidden=true;CZ.goal=.8;OCC.nx=2.5;OCC.sw=6;flt(P,'Combatti!','#ff6a5a')}
function occIntroTick(dt){const I=OCC.intro;I.t+=dt;P.path=[];P.tg=null;for(const k in KEYS)KEYS[k]=0;const T=I.t;
  for(let i=ABI.length-1;i>=0;i--)if(T>=ABI[i][0]){if(I.i!==i){I.i=i;const s=$('abis');if(s){s.textContent=ABI[i][1];s.className='';void s.offsetWidth;s.className='in'}}break}
  if(T>.9&&!I.g1){I.g1=1;growl()}if(T>3.6&&!I.g2){I.g2=1;growl();shake(.6);flash('#300000',.4,700)}
  if(T>5.4&&!I.eye){I.eye=1;flash('#ff2010',.35,500);growl();shake(1.2)}
  const arms=partAt('abo_braccio');for(let i=0;i<arms.length;i++)if(T>6.2+i*.35&&!arms[i].ia){arms[i].ia=1;arms[i].slT=t;setTimeout(()=>{if(!OCC)return;shake(.9);vf({k:'ring',x:arms[i].ax,y:arms[i].ay,r0:.2,r:1.8,c:'255,60,40',w:8,d:.6});if(cineOK())burst(arms[i].ax,arms[i].ay,14,['#5a2a30','#8a6a5a','#2a1414'],{v:1.6,up:160,gr:400,d:1,s:4,z:2})},300)}
  if(T>7.9&&!I.ti){I.ti=1;const el=$('abit');if(el)el.className='abti';flash('#ffffff',.5,600);shake(1.5);tone(55,.9,'sawtooth',.08);growl()}
  if(T>10.4)occIntroEnd()}
function occIntroCam(){const I=OCC&&OCC.intro;if(!I)return null;const T=I.t,k1=ease3((T-1.6)/4.2),k2=ease3((T-7.6)/1.6);
  const x=14+(11.3-14)*k1+(P.px-11.3)*k2*.5,y=21+(3.8-21)*k1+(P.py-3.8)*k2*.4,z=2.1+(1.25-2.1)*k1+(.95-1.25)*k2;return[x,y,z]}
// l'Occhio si apre per un istante durante il filmato
function occEyePeek(){const I=OCC&&OCC.intro;return I&&I.t>5.4&&I.t<7.6}
// momenti di cinema durante la battaglia: braccia che cadono, ventre che si apre, testa che crolla
let OCCK={arms:4,ph:1};
function occBeats(){if(!OCC||OCC.intro)return;const arms=partAt('abo_braccio').length;if(arms<OCCK.arms){OCCK.arms=arms;shake(.9);slowmo(.45,.5);growl();
    for(const[ax,ay]of ARMS)if(!partAt('abo_braccio').some(a=>a.ax===ax&&a.ay===ay)&&!OCC['d'+ax]){OCC['d'+ax]=1;if(cineOK())burst(ax,ay,26,['#5a2a30','#8a1a1a','#e8dcc8'],{v:2,up:200,gr:420,d:1.2,s:5,z:6});vf({k:'flash',x:ax,y:ay,r:90,c:'255,80,60',d:.4,z:10})}}
  if(OCC.ph!==OCCK.ph){OCCK.ph=OCC.ph;const e=ents.find(x=>x.t===(OCC.ph===2?'abo_ventre':'abo_testa'));shake(1.4);slowmo(.35,1.1);
    if(e&&cineOK()){cineOn(e,1.2,2.2);CAM.k=.75}if(cineOK())for(let i=0;i<3;i++)setTimeout(()=>{if(OCC)burst(BX+(Math.random()-.5)*5,BY+4,20,OCC.ph===2?['#7aff4a','#3a8a2a','#ffffff']:['#ff3a2a','#ffffff','#ffd0d0'],{v:1.8,up:240,gr:300,d:1.3,s:5,z:60})},i*250);
    vf({k:'ring',x:BX,y:BY+5,r0:.5,r:6,c:OCC.ph===2?'120,255,80':'255,60,40',w:12,d:.9})}
  if(OCC.win&&!OCC.boom){OCC.boom=1;slowmo(.3,1.6);shake(2);for(let i=0;i<8;i++)setTimeout(()=>{if(!cineOK())return;const x=BX+(Math.random()-.5)*7,y=BY+(Math.random()-.5)*7;burst(x,y,24,['#ffffff','#ffd0a0','#ff6a3a','#5a2a30'],{v:2.4,up:260,gr:260,d:1.4,s:6,z:40+Math.random()*80});pillar(x,y,'255,230,200',1.2,60);shake(1)},i*220)}}
(function(){const st=document.createElement('style');st.textContent=`
#tourb{position:fixed;left:50%;bottom:calc(9vh + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;width:min(640px,92vw);background:linear-gradient(180deg,rgba(14,18,32,.96),rgba(8,10,20,.96));border:1px solid #c8963a;border-radius:10px;padding:16px 20px 14px;color:#f2ead6;box-shadow:0 18px 60px #000c}
#tourb.in{animation:tIn .45s ease-out}@keyframes tIn{from{opacity:0;transform:translate(-50%,18px)}to{opacity:1;transform:translate(-50%,0)}}
#tourb b{display:block;font:700 22px Georgia,serif;color:#ffd98a;margin-bottom:6px;letter-spacing:.02em}#tourb p{margin:0 0 12px;font:16px/1.55 Georgia,serif}
#tourb .tdots{display:flex;gap:6px;margin-bottom:10px}#tourb .tdots i{width:22px;height:4px;border-radius:2px;background:#3a3f52}#tourb .tdots i.on{background:#ffd98a}#tourb .tdots i.ok{background:#8a6a3a}
#tourb .tbt{display:flex;gap:8px;justify-content:flex-end}#tourb button{font:600 15px Georgia,serif;padding:7px 16px}#tourb .mu2{opacity:.75}
body.tour #ruota,body.tour #bar{opacity:.25;pointer-events:none}
body.abin #hud,body.abin #ruota,body.abin #bar,body.abin #qt,body.abin #chw,body.abin #cl,body.abin #clk,body.abin #mm,body.abin #zn,body.abin #msg,body.abin #bnr,body.abin #ztc{opacity:0!important;pointer-events:none;transition:opacity .5s}
#abit[hidden],#tourb[hidden]{display:none!important}
#abit{position:fixed;inset:0;z-index:58;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:16vh;color:#f2e4dc;text-align:center}
#abit p{font:italic 22px Georgia,serif;opacity:0;margin:0;text-shadow:0 2px 12px #000}#abit p.in{animation:abS 2.4s ease forwards}@keyframes abS{0%{opacity:0;transform:translateY(8px)}20%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
#abit h2{font:700 clamp(46px,9vw,110px) Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:#ff4a3a;margin:0;opacity:0;text-shadow:0 0 30px #a00,0 0 80px #600,0 4px 0 #200}
#abit small{font:italic 20px Georgia,serif;opacity:0;color:#e8c8c0;margin-top:6px}
#abit.abti h2{animation:abT 2.6s ease-out forwards}#abit.abti small{animation:abU 2.6s ease-out .3s forwards}#abit.abti p{display:none}
@keyframes abT{0%{opacity:0;transform:scale(1.35);filter:blur(8px)}18%{opacity:1;transform:scale(1);filter:none}85%{opacity:1}100%{opacity:0}}@keyframes abU{0%{opacity:0}25%{opacity:1}85%{opacity:1}100%{opacity:0}}
#abit button{pointer-events:auto;position:absolute;right:18px;bottom:calc(14px + env(safe-area-inset-bottom,0px));font:600 14px Georgia,serif;padding:6px 14px}
@media (prefers-reduced-motion:reduce){#tourb.in,#abit h2,#abit small,#abit p.in{animation:none;opacity:1}}`;document.head.appendChild(st)})();
Z.occhio.gen=genOcchio2;
const _ct72=camTarget;camTarget=function(){if(TOUR){const c=tourCam();return[c[0],c[1]]}const oc=occIntroCam();if(oc){SZ=oc[2];return[oc[0],oc[1]]}return _ct72()};
const _occEnter72=occEnter;occEnter=function(){_occEnter72();OCCK={arms:4,ph:1};if(OCC&&cineOK()){OCC.sz0=SZ;occIntroStart()}};

/* ================= 7.2: nuova interfaccia dei dialoghi ================= */
// Il dialogo con un personaggio diventa una finestra in basso: ritratto animato che parla, nome con il mestiere,
// battuta che si scrive lettera per lettera (clic per completarla) e risposte numerate (tasti 1-9).
const DROLE={shop:'Mercante',smith:'Fabbro',alch:'Alchimista',heal:'Guaritore',inn:'Locandiere',bard:'Bardo',arena:"Maestro dell'Arena",casino:'Casinò',fisher:'Pescatore',buyer:'Compratore',king:'Re di Aldoria',master:'Maestro',motel:'Motel',naval:'Capitaneria',sage:'Saggio',cat:'Gatto',dim:'Viandante'};
let DLG={e:null,line:'',tw:0,raf:0,t0:0};
function dlgWrap(e,h){const m=h.match(/^<h3>([\s\S]*?)<\/h3><p><i>([\s\S]*?)<\/i><\/p>/);if(!m)return h;
  // la risposta a una domanda la dice il personaggio, nella battuta in alto (non in fondo alla finestra)
  let raw=m[2].replace(/^«|»$/g,''),ask='';const an=h.match(/<div class="qb dlga" data-q="([^"]*)"><i>«([\s\S]*?)»<\/i><\/div>/);if(an){raw=an[2];ask=an[1];h=h.replace(an[0],'')}
  const d=NPCS[e.nid]||{},role=d.role&&DROLE[d.role]?DROLE[d.role]:'',aq=P.q.find(q=>q.npc===e.nid);
  const st=aq?(qReady(aq)?'<span class="dlgs ok">✔ missione pronta</span>':'<span class="dlgs">missione in corso</span>'):qAvail(e.nid)?'<span class="dlgs nw">! nuova missione</span>':'';
  return`<div class="dlgh" onclick="dlgSkip()"><div class="dlgp"><canvas id="dlgc" width="128" height="148"></canvas></div><div class="dlgb"><div class="dlgn">${m[1]}${role?` <small>${esc(role)}</small>`:''}${st}</div>${ask?`<p class="dlgask">Hai chiesto: «${ask}»</p>`:''}<p class="dlgl" id="dlgl" data-t="${raw.replace(/"/g,'&quot;')}">${raw}</p></div></div><div class="dlgo">${h.slice(m[0].length)}</div>`}
const _npcHTML72=npcHTML;npcHTML=function(e){return dlgWrap(e,_npcHTML72(e))};
function dlgOn(m,pe,was){const on=m==='npc'&&PA&&PA.k==='npc';pe.classList.toggle('dlgm',!!on);document.body.classList.toggle('dlgo',!!on);if(!on)return;
  const el=$('dlgl');if(!el)return;const tx=el.textContent;
  // la stessa battuta (ad esempio dopo aver accettato una missione) non si riscrive da capo
  if(was&&DLG.e===PA&&DLG.line===tx){el.classList.add('done')}
  else{DLG.e=PA;DLG.line=tx;DLG.t0=performance.now();pe.scrollTop=0;if(cineOK()&&!matchMedia('(prefers-reduced-motion:reduce)').matches){el.dataset.n='0';el.classList.remove('done');dlgType()}else el.classList.add('done')}
  if(!DLG.raf)DLG.raf=requestAnimationFrame(dlgLoop)}
function dlgType(){const el=$('dlgl');if(!el||el.classList.contains('done'))return;const full=el.dataset.t.replace(/&quot;/g,'"'),n=Math.min(full.length,Math.floor((performance.now()-DLG.t0)/22));
  el.innerHTML=esc(full.slice(0,n))+'<span class="dlgr">'+esc(full.slice(n))+'</span>';if(n>=full.length)el.classList.add('done')}
function dlgSkip(){const el=$('dlgl');if(el&&!el.classList.contains('done')){DLG.t0=-1e9;dlgType()}}
function dlgLoop(n){const pe=$('pn');if(!pe||pe.style.display!=='block'||PM!=='npc'||!PA||PA.k!=='npc'){DLG.raf=0;document.body.classList.remove('dlgo');if(pe)pe.classList.remove('dlgm');return}
  DLG.raf=requestAnimationFrame(dlgLoop);dlgType();const c=$('dlgc');if(c)paintNpc(c,PA,n/1000,!$('dlgl')||!$('dlgl').classList.contains('done'))}
// ritratto dal vivo: il personaggio respira, gira appena la testa e muove la bocca mentre parla
function paintNpc(c,e,tm,talking){const dp=Math.min(2,window.devicePixelRatio||1),w=128,h=148;if(c.width!==w*dp){c.width=w*dp;c.height=h*dp}
  const q=c.getContext('2d');q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,c.width,c.height);let L=e.m;if(!L||!L.length)return;
  let top=0;for(const p of L)top=Math.max(top,(p[2]||0)+(p[5]||0));top=Math.max(14,top);
  const sc=Math.min(2.9,(h-12)/(top*.85+4)),oy=16+(top+2)*sc+Math.sin(tm*2)*.6;
  const og=g;g=q;try{g.setTransform(sc*dp,0,0,sc*dp,w/2*dp,oy*dp);if(talking&&!e.slp&&L.length>5)L=talkA(L);
    const fc=0;if(L.hm||L.rg||L.length<40)drawHero(L,0,0,0,0,fc);else drawL(L,0,0,0,0)}catch(err){}finally{g=og}}
// tasti 1-9 per scegliere una risposta, Invio/spazio per completare la battuta
addEventListener('keydown',ev=>{if(PM!=='npc'||!document.body.classList.contains('dlgo'))return;const tg=ev.target;if(tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'||tg.isContentEditable))return;
  if(/^[1-9]$/.test(ev.key)){const bs=[...$('pn').querySelectorAll('button')].filter(b=>b.offsetParent);const b=bs[+ev.key-1];if(b){ev.preventDefault();ev.stopImmediatePropagation();b.click()}}
  else if(ev.key==='Enter'||ev.key===' '){const el=$('dlgl');if(el&&!el.classList.contains('done')){ev.preventDefault();ev.stopImmediatePropagation();dlgSkip()}}},true);
(function(){const st=document.createElement('style');st.textContent=`
#pn.dlgm{top:auto!important;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%)!important;width:min(860px,96vw);max-height:62vh;padding:0;border:none;background:transparent;box-shadow:none;overflow:visible}
#pn.dlgm .dlgh{display:flex;gap:14px;align-items:stretch;background:linear-gradient(180deg,var(--pn),color-mix(in srgb,var(--pn) 86%,#000));border:2px solid var(--ac);border-radius:12px;padding:12px 16px 12px 12px;box-shadow:0 14px 50px #000a,inset 0 0 0 1px #fff1;cursor:pointer;position:relative}
#pn.dlgm .dlgh:after{content:'';position:absolute;left:16px;right:16px;top:5px;height:1px;background:linear-gradient(90deg,transparent,var(--ac),transparent);opacity:.5}
#pn.dlgm .dlgp{flex:0 0 112px;height:130px;border-radius:9px;border:2px solid color-mix(in srgb,var(--ac) 70%,transparent);background:radial-gradient(circle at 50% 38%,#4a5a88,#1a2034 72%);overflow:hidden;position:relative;box-shadow:inset 0 0 18px #000a}
#pn.dlgm .dlgp canvas{width:128px;height:148px;position:absolute;left:50%;top:-6px;transform:translateX(-50%)}
#pn.dlgm .dlgb{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
#pn.dlgm .dlgn{font:700 21px Georgia,serif;color:var(--ac);letter-spacing:.02em;display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:4px;text-shadow:0 1px 0 #0006}
#pn.dlgm .dlgn small{font:italic 14px Georgia,serif;color:var(--fg);opacity:.7}
#pn.dlgm .dlgs{font:600 12px Georgia,serif;padding:2px 8px;border-radius:9px;background:#0003;color:var(--fg);opacity:.85}#pn.dlgm .dlgs.ok{background:#2f7a3a;color:#fff}#pn.dlgm .dlgs.nw{background:#b8861e;color:#fff}
#pn.dlgm .dlgl{font:17px/1.55 Georgia,serif;margin:0;min-height:3.1em}#pn.dlgm .dlgask{margin:0 0 3px;font:italic 13px Georgia,serif;color:var(--mu)}#pn.dlgm .dlgl:before{content:'«';opacity:.6}#pn.dlgm .dlgl:after{content:'»';opacity:.6}
#pn.dlgm .dlgl .dlgr{opacity:0}#pn.dlgm .dlgl:not(.done):after{content:'▍';opacity:.8;animation:dlgC .6s steps(2) infinite}@keyframes dlgC{50%{opacity:0}}
#pn.dlgm .dlgo{background:color-mix(in srgb,var(--pn) 98%,transparent);border:1px solid color-mix(in srgb,var(--ac) 55%,transparent);border-radius:10px;padding:8px 10px;box-shadow:0 10px 36px #0008;overflow:auto;max-height:38vh;counter-reset:dl;margin-top:8px}
#pn.dlgm .dlgo:empty{display:none}
#pn.dlgm .dlgo button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin:1px 0;padding:6px 12px;border-radius:7px;background:#0000;border:1px solid transparent;color:inherit;font:16px Georgia,serif;transition:background .15s,border-color .15s,transform .15s}
#pn.dlgm .dlgo button:before{counter-increment:dl;content:counter(dl);flex:0 0 22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:700 12px system-ui,sans-serif;background:var(--ac);color:#1b1408}
#pn.dlgm .dlgo button:hover,#pn.dlgm .dlgo button:focus-visible{background:color-mix(in srgb,var(--ac) 18%,transparent);border-color:color-mix(in srgb,var(--ac) 60%,transparent);transform:translateX(3px)}
#pn.dlgm .dlgo .qb{border:1px solid color-mix(in srgb,var(--ac) 45%,transparent);border-left:4px solid var(--ac);background:color-mix(in srgb,var(--ac) 7%,transparent);border-radius:8px;padding:8px 12px;margin:4px 0}
#pn.dlgm .dlgo .qb p{margin:4px 0 6px;line-height:1.5}
#pn.dlgm .dlgo>h4{margin:6px 4px 2px;font:700 15px Georgia,serif;color:var(--ac)}
#pn.dlgm.pop{animation:dlgIn .32s cubic-bezier(.2,1.2,.4,1)}@keyframes dlgIn{from{opacity:0;transform:translate(-50%,24px)}to{opacity:1;transform:translate(-50%,0)}}
body.dlgo #ruota{opacity:.12;pointer-events:none;transition:opacity .25s}body.dlgo #bar{opacity:.3}
@media (max-width:600px){#pn.dlgm .dlgp{flex-basis:72px;height:88px}#pn.dlgm .dlgp canvas{width:86px;height:100px;top:-4px}#pn.dlgm .dlgn{font-size:17px}#pn.dlgm .dlgl{font-size:15px}#pn.dlgm .dlgo button{font-size:15px;padding:7px 8px}}
@media (prefers-reduced-motion:reduce){#pn.dlgm.pop{animation:none}}`;document.head.appendChild(st)})();

/* ================= 7.3: personaggi unici — ogni NPC ha il suo aspetto, i suoi attrezzi e il suo modo di muoversi ================= */
const hx6=c=>{if(!c||c[0]!=='#')return'#888888';if(c.length===4)return'#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return c.slice(0,7)};
const SKT={a:'#ffdbac',b:'#f1c27d',c:'#e0ac69',d:'#c68642',e:'#a0662f',f:'#8d5524'};
const HAIRC=['#1a1a1a','#2a1a10','#4a2a14','#5a3a1a','#8a5a2a','#d8b050','#a83a1a','#7a7a7a','#e8e8e8'];
// scheda di ogni personaggio: pelle | capelli | barba | cappello | aggiunte | attrezzo | animazione | corporatura
// (R = scelto a caso, ma sempre uguale per lo stesso personaggio nello stesso posto)
const NPS={
re:'b|short:#e8e8e8|full:#e8e8e8|crown|cape:#7a1a2a,collar,necklace|scepter|proud|tall',
guardia:'R|R|R|helmet:#9aa4b8:#c0392b|armor,sheath|spear|guard|n',guardia2:'R|R|R|helmet:#9aa4b8:#c0392b|armor,sheath|spear|guard|n',
ciambellano:'a|bald2:#888888|mous:#888888|none|collar,buttons|scroll|bow|fat',
saggio:'b|long:#f0f0f0|long:#f0f0f0|wizard|stars|staff:#7ad0ff|idle|old,robe',
gilda:'c|bun:#a83a1a|none|scarf|apron:#f0e8d8|mug|wipe|f,fat',
lino:'b|curly:#d8b050|goatee:#d8b050|feather::#ffd84a|vest:#d8a020|lute|lute|n',
avventore:'R|R|R|none|belly|mug|drink|n',
avventore2:'c|tail:#1a1a1a|none|bandana:#3a3a3a|armor:#6a5a4a,scar|sword|proud|f',
borin:'b|bald2:#5a2a10|full:#a83a1a|none|apron:#4a3a2a,arms|hammer|hammer|big',
mira:'a|braids:#6a3a1a|none|flower|apron:#6a8a3a|flask|stir|f',
lia:'c|long:#1a1a1a|none|veil|necklace|book|pray|f',
rosa:'b|bun:#888888|none|scarf|apron:#f0e8d8|basket|idle|f,fat',
gerald:'a|bald2:#e8e8e8|mous:#e8e8e8|cap|vest:#5a4a3a|cane|old|old',
marcus:'b|short:#3a2a1a|stubble|helmet:#c0c8d8:#2a5aa8|armor,cape:#3a5a9a|sword|proud|tall',
tommaso:'a|spiky:#d8b050|none|none|freckles|none|kid|kid',
ugo:'c|short:#2a1a10|bigmous:#2a1a10|beret|vest:#a8632f,pouch|coinbag|shout|fat',
nino:'d|short:#1a1a1a|stubble|sailor|stripes|net|idle|n',
kael:'d|mohawk:#1a1a1a|goatee:#1a1a1a|none|armor:#8a1a1a,epaulet,scar|big|proud|big',
banditore:'b|short:#8a5a2a|mous:#8a5a2a|feather::#ffffff|vest:#d0a030|bell|shout|n',
araldo:'b|short:#d8b050|none|beret|sash:#d4af37,collar|flag|shout|n',
guardia_porta:'R|R|R|helmet:#9aa4b8:#c0392b|armor,sheath|spear|guard|n',
croupier:'a|short:#1a1a1a|mous:#1a1a1a|none|vest:#aa1a2a,bowtie|dice|count|n',
scommettitore:'R|R|stubble|cap|belly|dice|nervous|n',
scommettitrice:'b|long:#d8b050|none|diadem|necklace|fan|fan|f',
moreau:'b|short:#1a1a1a|goatee:#1a1a1a|tophat|cape:#1a1a22,glasses|cane|idle|tall',
conte:'a|short:#3a2a1a|bigmous:#3a2a1a|feather::#ffffff|cape:#6a1a3a,collar,medal|cane|proud|n',
contessa:'a|bun:#3a2a1a|none|diadem|necklace,collar|fan|fan|f',
maggiordomo:'b|bald2:#888888|none|none|bowtie,buttons|tray|bow|tall',
banchiere:'b|short:#888888|mous:#888888|tophat|vest:#2a4a2a,glasses,belly|coinbag|count|fat',
severino:'a|bald2:#5a5a5a|none|none|glasses,collar|quill|write|old',
cassiere:'b|short:#5a3a1a|none|cap|glasses|keys|count|n',
giardiniere:'c|short:#5a3a1a|stubble|straw|apron:#3a6a2a|rake|sweep|n',
beatrice:'a|curly:#a83a1a|none|flower|necklace|book|read|f',
lorenzo:'b|long:#4a2a1a|goatee:#4a2a1a|beret|scarf:#8a3a3a|quill|write|n',
guardia_nord:'R|R|R|helmet:#d4af37:#ffffff|armor:#c0c4d0,cape:#2a3a8a|spear|guard|tall',
nobile:'R|R|R|feather::#ffffff|cape|cane|proud|n',
bruno_b:'c|short:#2a1a10|full:#2a1a10|none|vest:#3a2a1a,check|axe|chop|big',
marta:'c|braids:#8a5a2a|none|scarf|apron:#f0e8d8|basket|idle|f',
giacomo:'c|bald2:#888888|mous:#888888|straw|vest,belly|pitchfork|pitch|fat',
rosa_f:'b|bun:#a83a1a|none|scarf|apron:#f0e8d8|basket|idle|f',
pietro:'b|short:#e8e8e8|full:#e8e8e8|cap|apron:#e8e0d0,flour|sack|mill|fat',
elio:'d|curly:#2a1a10|stubble|straw|cape:#6a5a3a|crook|idle|n',
lia_r:'b|tail:#c84a2a|none|flower|apron:#e8d8a0|basket|idle|f',
ettore:'c|short:#3a2a1a|stubble|cap|vest:#5a4a3a|mallet|proud|big',
mercante_campi:'R|R|mous|straw|apron|basket|shout|fat',
contadino:'R|R|R|straw|apron|pitchfork|pitch|n',
ada:'a|bun:#e8e8e8|none|scarf|cape:#5a4a5a|cane|old|old,f',
tobia:'c|tonsure:#5a3a1a|none|none|robe,cross|book|pray|n',
sentinella:'b|none|full:#888888|helmet:#6a6a7a|armor:#6a6a7a,cape:#4a4a5a|spear|guard|tall',
gino:'d|short:#888888|full:#888888|souwester|stripes|rod|idle|n',
nella:'c|bun:#1a1a1a|none|scarf|apron:#e8e0d0|fish|shout|f,fat',
baldo:'b|short:#e8e8e8|full:#e8e8e8|captain|buttons,epaulet,pipe|telescope|proud|fat',
doganiere:'b|short:#2a1a10|mous:#2a1a10|kepi|buttons|scroll|write|n',
rocco:'d|short:#1a1a1a|stubble|bandana|stripes,earring|rope|idle|big',
pippo:'a|spiky:#d8b050|none|sailor|stripes|broom|sweep|kid',
ernesto:'c|bald2:#888888|full:#888888|none|apron:#7a5a3a|saw|chop|n',
oste:'b|bald|mous:#5a3a1a|none|apron:#ffffff,belly|mug|wipe|fat',
cantastorie:'b|long:#1a1a1a|none|feather::#ffd84a|cape:#5a2a6a|lute|dance|f',
ubriaco:'c|wild:#5a4a3a|stubble|none|stripes,rednose|bottle|drunk|n',
marinaio:'R|R|R|sailor|stripes|none|idle|n',
duchessa:'a|bun:#d8b050|none|diadem|necklace,collar|fan|fan|f',
cameriera:'b|bun:#5a3a1a|none|bow:#ffffff|apron:#ffffff|tray|idle|f',
servitore:'R|short|none|none|bowtie|tray|bow|n',
silvio:'c|short:#2a1a10|goatee:#2a1a10|turban|vest:#d4af37,necklace|coinbag|count|fat',
pittrice:'b|bun:#a83a1a|none|beret|apron:#d8c8b0,paint|palette|paint|f',
generale:'b|bald2:#e8e8e8|bigmous:#e8e8e8|bicorne:#1a1a1a|epaulet,medal,sash:#d4af37,buttons|sword|proud|big',
armatore:'b|short:#5a5a5a|full:#5a5a5a|tophat|vest,belly|telescope|idle|fat',
vedova:'a|bun:#1a1a1a|none|veil|necklace|none|sad|f',
impresario:'b|short:#1a1a1a|bigmous:#1a1a1a|tophat|cape:#5a1a3a,bowtie,belly|cane|shout|fat',
attore:'b|curly:#3a2a1a|none|feather::#d4af37|cape:#c0392b,collar|skull|declaim|n',
attrice:'a|long:#d8b050|none|diadem|necklace|fan|declaim|f',
garzone:'b|short:#a87a3a|none|cap|apron:#e8e0d0|bread|idle|n',
stalliere:'c|short:#4a3a2a|stubble|straw|vest|pitchfork|pitch|n',
teresa:'b|bun:#5a3a1a|none|scarf|apron|basket|idle|f',
lucia:'a|braids:#d8b050|none|bow:#ffd84a|freckles|flowers|kid|kid,f',
marino:'b|bald2:#e8e8e8|full:#e8e8e8|sailor|pipe|cane|old|old',
retaio:'c|short:#888888|mous:#888888|cap|apron|net|write|n',
magazziniere:'b|bald2:#3a3a3a|stubble|none|apron:#6a5a4a,belly|scroll|write|fat',
facchino:'d|short:#1a1a1a|stubble|bandana|arms|crate|idle|big',
losco:'R|short:#1a1a1a|stubble|hood|cape:#2a2a2a,eyepatch|dagger|nervous|n',
ida:'c|bun:#888888|none|scarf|apron:#ffffff|fish|shout|f',
pescatore:'R|R|R|souwester|none|rod|fish|n',
nico:'b|spiky:#8a5a2a|none|cap|apron|hammer|hammer|kid',
anselmo:'b|bald2:#d8d0c0|long:#d8d0c0|cap|scarf|lantern|old|old',
ferro:'b|short:#1a1a2a|full:#1a1a2a|tricorn|cape,eyepatch,epaulet|cutlass|proud|big',
nostromo:'c|bald|full:#2a2a2a|bandana|stripes|rope|shout|big',
cuoco:'c|short:#5a3a1a|bigmous:#2a1a10|chef|apron:#ffffff,belly|ladle|stir|fat',
portiere:'b|bun:#3a2a1a|none|bow|necklace|keys|idle|f,fat',
ospite:'R|R|stubble|cap|scarf|none|tired|n',
ammiraglio:'b|short:#e8e8e8|bigmous:#e8e8e8|bicorne|epaulet,medal,buttons|telescope|proud|tall',
sceriffo:'c|short:#5a3a1a|bigmous:#5a3a1a|cowboy|vest:#5a3a1a,star|pistol|proud|n',
blackjack:'b|short:#1a1a1a|stubble|cowboy|scarf:#8a1a1a|pistol|nervous|n',
cittadino_w:'R|R|R|cowboy|vest|none|idle|n',
ispettore:'a|short:#3a3a3a|mous:#3a3a3a|bowler|cape:#3a3a44,pipe|lens|idle|tall',
corvus_npc:'a|short:#1a1a1a|none|tophat|cape:#1a1a22,glasses|cane|nervous|n',
ashby:'a|short:#d8b050|mous:#d8b050|tophat|collar,bowtie|cane|proud|n',
pip:'b|spiky:#5a3a1a|none|cap|patches|none|nervous|kid',
londinese:'R|R|R|bowler|scarf|none|idle|n',
marianne:'b|long:#5a3a1a|none|phrygian|sash:#ffffff|flag|shout|f',
valmont:'a|curly:#e8e8e8|none|tricorn|collar,cape|cane|proud|n',
cittadino_r:'R|R|R|phrygian|sash|pitchfork|shout|n',
sergente:'c|short:#2a1a10|bigmous:#2a1a10|kepi|buttons|rifle|guard|n',
ferito:'b|short:#5a3a1a|stubble|bandage|patches|cane|sad|n',
dino:'b|bald|bigmous:#1a1a1a|headband|sash:#1a1a1a|none|kungfu|n',
gemma:'b|bun:#d8b050|none|scarf|apron:#ffffff|rollpin|stir|f,fat',
ottavia:'a|bun:#3a2a1a|none|none|glasses,necklace|shears|write|f',
cliente:'R|R|R|none|none|basket|idle|n',
ruggero:'b|short:#5a5a5a|full:#5a5a5a|helmet:#8a8f9a:#a8303a|armor,cape|sword|proud|big',
recluta:'a|short:#d8b050|none|helmet:#8a8a94|armor:#8a8a94|spear|nervous|n',
scudiero:'b|short:#7a5a3a|none|cap|vest|shield|idle|kid',
astronomo:'b|long:#e8e8e8|long:#e8e8e8|wizard|stars|telescope|look|old,robe',
sindaco:'b|bald2:#888888|bigmous:#888888|tophat|sash:#d4af37,medal,buttons,belly|scroll|proud|fat',
usciere:'b|short:#2a2a2a|none|kepi|buttons|keys|guard|n',
segretaria:'b|bun:#6a4a3a|none|none|glasses|book|write|f',
fornaio:'b|short:#c8a878|none|chef|apron|bread|idle|n',
mv_frutta:'c|bun:#a83a1a|none|scarf|apron|basket|shout|f',
mv_pesce:'d|short:#1a1a1a|mous:#1a1a1a|cap|apron:#e8e0d0|fish|shout|fat',
mv_pane:'b|short:#5a3a1a|none|chef|apron|bread|shout|fat',
mv_fiori:'a|long:#d8b050|none|flower|apron:#3f7a32|flowers|shout|f',
ronda:'R|R|R|helmet:#8a94a8|armor|torch|guard|n',
maestro_armi:'b|short:#5a5a64|full:#3a3a3a|none|armor:#5a5a64,scar|big|sword2|big',
prigioniero:'c|wild:#4a443a|long:#4a443a|none|patches|none|sad|old',
carceriere:'b|bald|stubble|none|vest:#3a3a32,belly|keys|idle|fat',
consigliere:'a|short:#888888|goatee:#888888|beret|collar,necklace|scroll|idle|tall',
archivista:'a|bald2:#888888|none|none|glasses|book|read|old',
cuoca:'c|bun:#5a3a1a|none|scarf|apron:#f4f0e0|ladle|stir|f,fat',
sguattero:'b|spiky:#5a4a3a|none|cap|apron|broom|sweep|kid',
ancella:'b|bun:#3a2a1a|none|bow|collar|tray|idle|f',
nilo:'a|short:#8a5a2a|none|hood|robe|book|read|kid',
viandante:'c|long:#6a5a3a|full:#6a5a3a|straw|cape:#6a5a3a|crook|idle|n',
scrivano:'a|short:#4a4a3a|none|beret|glasses|quill|write|n',
veterano:'b|bald2:#888888|full:#888888|none|armor:#5a6a8a,eyepatch,scar|cane|old|old',
lucrezio:'a|short:#1a1a1a|goatee:#1a1a1a|tophat|cape:#aa1a2a,collar|cane|proud|tall',
allieva:'b|tail:#2a1a10|none|none|glasses|book|read|f',
malakar_re:'a|long:#1a1a1a|goatee:#1a1a1a|crown|cape:#3a2a6a,collar|staff:#c46bff|proud|tall',
aldric_p:'b|short:#e8e8e8|full:#e8e8e8|none|patches|none|sad|old',
portiere2:'b|short|none|cap|buttons|keys|idle|n',
stefano:'d|mane:#4a3420|bigmous:#4a3420|cap:#c0392b|stripes:#c0392b,scarf:#f2c230,earring,horseshoe|rod|laugh|tall',
ryan:'c|bald|stubble:#3a2a1a|none|armor:#5a6a4a,dogtag,shine|sword|drill|big',
manuel:'b|bald2:#2a1a10|full:#2a1a10|none|vest:#5a3a2a,scowl,belly,rednose|mug|angry|fat'};
const ANIMN=new Set(['gatto','mucca','pecora','maiale','gallina','cavallo','cavallo2','cavallo3','gabbiano']);
function npcRnd(seed){let s=(seed*2654435761)>>>0;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function npcModel(id,o,e){const d=NPCS[id]||{},seed=(hs?hs(id+'|'+(o.n||d.n||'')+'|'+((e&&e.px|0)||0)+','+((e&&e.py|0)||0)):7)+(o.seed||0),r=npcRnd(seed),pick=a=>a[Math.floor(r()*a.length)];
  const sp=(NPS[id]||(id[0]==='v'?'R|R|R|R|R|R|R|R':'R|R|R|none|none|none|idle|n')).split('|');let[sk,hair,beard,hat,xs,prop,an,body]=sp;
  const bodyS=new Set((body==='R'?pick(['n','n','f','fat','tall','f','old']):body).split(','));if(id[0]==='v'&&!NPS[id]&&r()<.4)bodyS.add('f');
  const fem=bodyS.has('f');
  if(sk==='R')sk=pick(['a','b','b','c','c','d','e','f']);const skin=SKT[sk]||SKIN;
  const tp=hx6(o.c||d.c||'#888888'),hatC=hx6(o.hat||d.hat||'#555555');
  if(hair==='R')hair=fem?pick(['long','bun','tail','braids','curly']):pick(['short','short','bald2','curly','spiky','short','bald']);
  if(beard==='R')beard=fem?'none':pick(['none','none','stubble','full','mous','goatee','none']);
  if(hat==='R')hat=pick(['none','none','cap','straw','beret','bowler','scarf','none']);
  if(xs==='R')xs=pick(['none','apron','vest','scarf','none','belly']);
  if(prop==='R')prop=pick(['none','none','basket','bread','book','mug','flowers','none']);
  if(an==='R')an=pick(['idle','idle','shout','read','idle']);
  const col=(s,def)=>{const i=s.indexOf(':');return i<0?[s,def]:[s.slice(0,i),hx6(s.slice(i+1).split(':')[0]||def)]};
  const hc0=pick(HAIRC.slice(0,7));let[hs_,hcol]=col(hair,hc0);let[bs_,bcol]=col(beard,hcol);
  const X=[];const A=(g,x,y,z,w,dd,h,c,b)=>X.push(b?[g,x,y,z,w,dd,h,c,b]:[g,x,y,z,w,dd,h,c]);
  // capelli
  const hair0=X.length;if(/^(helmet|hood|veil|turban)/.test(hat))hs_='none';switch(hs_){case 'short':A('hd',-.16,-.135,28.6,.32,.27,1.8,hcol);A('hd',-.16,-.145,21.5,.32,.05,7.5,hcol);A('hd',-.165,-.12,25,.02,.17,4,hcol);A('hd',.145,-.12,25,.02,.17,4,hcol);break;
    case 'bald2':A('hd',-.16,-.145,21.5,.32,.05,5,hcol);A('hd',-.165,-.12,22.5,.02,.16,4,hcol);A('hd',.145,-.12,22.5,.02,.16,4,hcol);break;
    case 'bald':break;case 'tonsure':A('hd',-.16,-.145,22,.32,.05,6,hcol);A('hd',-.165,-.12,23,.02,.2,5,hcol);A('hd',.145,-.12,23,.02,.2,5,hcol);A('hd',-.16,.1,27,.32,.03,1.5,hcol);break;
    case 'long':A('hd',-.17,-.14,28.6,.34,.28,1.9,hcol);A('hd',-.17,-.16,13.5,.34,.06,16,hcol);A('hd',-.175,-.12,17,.03,.2,12,hcol);A('hd',.145,-.12,17,.03,.2,12,hcol);A('hd',-.15,.11,27,.3,.03,2,hcol);break;
    case 'bun':A('hd',-.16,-.135,28.6,.32,.27,1.8,hcol);A('hd',-.16,-.145,22,.32,.05,7,hcol);A('hd',-.07,-.22,26,.14,.09,5,hcol);break;
    case 'tail':A('hd',-.16,-.135,28.6,.32,.27,1.8,hcol);A('hd',-.16,-.145,22,.32,.05,7,hcol);A('hd',-.045,-.22,15,.09,.08,12,hcol);break;
    case 'braids':A('hd',-.16,-.135,28.6,.32,.27,1.8,hcol);A('hd',-.16,-.145,22,.32,.05,7,hcol);A('hd',-.2,-.05,13,.06,.06,11,hcol);A('hd',.14,-.05,13,.06,.06,11,hcol);A('hd',-.2,-.05,12,.06,.06,1.2,'#c0392b');A('hd',.14,-.05,12,.06,.06,1.2,'#c0392b');break;
    case 'curly':for(let i=0;i<5;i++)A('hd',-.18+i*.075,-.16,28+(i%2)*.8,.09,.31,2.4,hcol);A('hd',-.17,-.16,20,.34,.06,9,hcol);A('hd',-.18,-.12,23,.04,.18,6,hcol);A('hd',.14,-.12,23,.04,.18,6,hcol);break;
    case 'spiky':A('hd',-.16,-.135,28.6,.32,.27,1.6,hcol);for(let i=0;i<4;i++)A('hd',-.13+i*.08,-.08+(i%2)*.08,29.5,.06,.06,2.5+(i%2),hcol);A('hd',-.16,-.145,22,.32,.05,7,hcol);break;
    case 'mohawk':A('hd',-.035,-.15,28.6,.07,.3,4.5,hcol);break;
    case 'wild':A('hd',-.19,-.17,27.5,.38,.33,3.2,hcol);A('hd',-.23,-.08,24,.06,.12,4,hcol);A('hd',.17,-.04,25,.06,.1,3.5,hcol);A('hd',-.18,-.17,19,.36,.06,10,hcol);A('hd',-.05,.0,30.5,.08,.08,2,hcol);break;
    case 'mane':A('hd',-.18,-.16,28,.36,.31,2.6,hcol);A('hd',-.06,.06,29.5,.12,.12,2.5,hcol);A('hd',-.17,-.17,20,.34,.06,9,hcol);A('hd',-.06,-.24,13,.12,.08,16,hcol);A('hd',-.04,-.3,8,.08,.07,8,hcol);A('hd',-.2,-.1,21,.04,.16,7,hcol);A('hd',.16,-.1,21,.04,.16,7,hcol);break}
  const hair1=X.length;
  // barba e baffi
  switch(bs_){case 'full':A('hd',-.15,.1,19.5,.3,.05,4.5,bcol);A('hd',-.155,-.03,20,.02,.15,5,bcol);A('hd',.135,-.03,20,.02,.15,5,bcol);A('hd',-.1,.13,22,.2,.02,1.1,bcol);break;
    case 'long':A('hd',-.12,.1,11.5,.24,.06,12.5,bcol);A('hd',-.1,.13,22,.2,.02,1.1,bcol);A('hd',-.155,-.03,19,.02,.15,6,bcol);A('hd',.135,-.03,19,.02,.15,6,bcol);break;
    case 'mous':A('hd',-.1,.13,22.1,.2,.02,1.1,bcol);break;
    case 'bigmous':A('hd',-.15,.13,21.8,.3,.025,1.4,bcol);A('hd',-.18,.13,22.6,.04,.025,1.3,bcol);A('hd',.14,.13,22.6,.04,.025,1.3,bcol);break;
    case 'goatee':A('hd',-.04,.12,18.8,.08,.04,3.2,bcol);A('hd',-.09,.13,22.1,.18,.02,1,bcol);break;
    case 'stubble':A('hd',-.14,.127,20,.28,.01,2.4,shx(skin,.82));break}
  // cappelli
  const[ht,hc1,hc2]=(()=>{const p=hat.split(':');return[p[0],p[1]?hx6(p[1]):hatC,p[2]?hx6(p[2]):'']})();
  const HL=q=>{for(const b of q)X.push(b)};
  // 7.12: sotto un cappello i capelli si tagliano all'altezza della tesa (prima la calotta dei capelli, più larga della cupola del
  // cappello, spuntava ai lati e sopra: si vedeva nei filmati); corone, diademi, fiori, fiocchi e fasce stanno sopra i capelli
  {const cz=ht==='scarf'?27:/^(none|crown|diadem|flower|bow|headband|bandage|R)$/.test(ht)?99:28.3;if(cz<99)for(let i=hair1-1;i>=hair0;i--){const b=X[i];if(b[3]>=cz)X.splice(i,1);else if(b[3]+b[6]>cz)b[6]=cz-b[3]}}
  switch(ht){case 'crown':HL(HT.crown());break;case 'helmet':HL(HT.helmet(hc1,hc2||null));break;case 'tricorn':HL(HT.tricorn(hc1));break;case 'cowboy':HL(HT.cowboy(hc1));break;
    case 'bowler':HL(HT.bowler());break;case 'bandana':HL(HT.bandana(hc1));break;case 'hood':HL(HT.hood(hc1));break;
    case 'cap':A('hd',-.16,-.13,28.4,.32,.27,2.2,hc1);A('hd',-.13,.12,28.4,.26,.09,.8,shx(hc1,.8));break;
    case 'sailor':A('hd',-.155,-.125,28.4,.31,.26,2.6,hc1==='#555555'?'#f4f4f0':hc1);A('hd',-.16,-.13,28.4,.32,.27,.8,'#2a4a8a');break;
    case 'captain':A('hd',-.16,-.13,28.4,.32,.27,3,'#f4f4f0');A('hd',-.165,-.135,28.4,.33,.28,1,'#1a1a2a');A('hd',-.13,.12,28.4,.26,.09,.7,'#1a1a1a');A('hd',-.03,.135,29.8,.06,.01,1.2,'#d4af37');break;
    case 'souwester':A('hd',-.21,-.22,27.8,.42,.44,1.1,hc1==='#555555'?'#e8c030':hc1);A('hd',-.15,-.13,28.8,.3,.26,3,hc1==='#555555'?'#e8c030':hc1);A('hd',-.17,-.24,22,.34,.05,6,hc1==='#555555'?'#e8c030':hc1);break;
    case 'straw':A('hd',-.27,-.25,28.3,.54,.52,.8,'#e0c870');A('hd',-.14,-.12,29,.28,.25,3,'#e0c870');A('hd',-.145,-.125,29.1,.29,.26,.8,hc1==='#555555'?'#8a3a2a':hc1);break;
    case 'chef':A('hd',-.15,-.12,28.4,.3,.25,2,'#ffffff');A('hd',-.18,-.15,30.4,.36,.31,6,'#f8f8f8');break;
    case 'beret':A('hd',-.17,-.15,28.3,.34,.3,2,hc1);A('hd',-.02,-.02,30.3,.04,.04,1,hc1);break;
    case 'tophat':A('hd',-.2,-.18,28.4,.4,.36,.8,hc1==='#555555'?'#1a1a1a':hc1);A('hd',-.13,-.11,29.2,.26,.22,8,hc1==='#555555'?'#1a1a1a':hc1);A('hd',-.135,-.115,29.4,.27,.23,1.2,'#8a1a2a');break;
    case 'feather':A('hd',-.22,-.2,28.3,.44,.4,.9,hc1);A('hd',-.14,-.12,29,.28,.25,3,hc1);A('hd',.06,-.18,30,.04,.2,7,hc2||'#ffffff');A('hd',.06,-.24,34,.04,.1,4,hc2||'#ffffff');break;
    case 'bicorne':A('hd',-.27,-.07,28.3,.54,.15,5.5,hc1==='#555555'?'#1a1a1a':hc1);A('hd',-.27,-.07,33.5,.54,.15,.7,'#d4af37');A('hd',-.05,.08,30,.1,.01,2.5,'#c0392b');break;
    case 'kepi':A('hd',-.15,-.12,28.4,.3,.25,4,hc1);A('hd',-.12,.11,28.4,.24,.09,.8,'#111111');A('hd',-.155,-.125,29,.31,.26,.8,'#d4af37');break;
    case 'wizard':{const c=hc1;A('hd',-.21,-.21,28.3,.42,.4,1,c);A('hd',-.14,-.13,29.3,.28,.26,3.2,c);A('hd',-.1,-.09,32.5,.2,.18,3,c);A('hd',-.06,-.05,35.5,.12,.1,3,c);A('hd',-.03,-.02,38.5,.06,.05,3,c);A('hd',.06,.13,31,.04,.01,1.4,'#ffe080',1.3);A('hd',-.08,.1,34,.03,.01,1.2,'#ffe080',1.3);break}
    case 'veil':{const c=hc1==='#555555'?'#f4f4f4':hc1;A('hd',-.17,-.16,21,.34,.07,9,c);A('hd',-.17,-.14,28.5,.34,.29,1.6,c);A('hd',-.18,-.13,19,.03,.24,10.5,c);A('hd',.15,-.13,19,.03,.24,10.5,c);A('bd',-.2,-.16,12,.4,.05,9,c);break}
    case 'scarf':A('hd',-.165,-.15,27,.33,.29,2.5,hc1);A('hd',-.165,-.16,21,.33,.05,7,hc1);A('hd',-.04,-.2,20,.08,.05,3,hc1);break;
    case 'flower':for(let i=0;i<5;i++)A('hd',-.15+i*.07,-.13+(i%2)*.2,28.6,.05,.05,1.6,['#ff8ab0','#ffd84a','#ffffff','#c88aff','#ff8ab0'][i]);break;
    case 'diadem':A('hd',-.155,-.125,27.8,.31,.26,.7,'#d4af37');A('hd',-.03,.13,28.2,.06,.01,1.4,'#5ad0ff',1.2);break;
    case 'bow':{const c=hc1;A('hd',-.1,-.04,29,.08,.06,2,c);A('hd',.02,-.04,29,.08,.06,2,c);A('hd',-.02,-.04,29.3,.04,.06,1.4,shx(c,.8));break}
    case 'turban':A('hd',-.17,-.15,27.6,.34,.3,4.4,hc1);A('hd',-.03,.14,29.5,.06,.01,1.6,'#c0392b',1.2);break;
    case 'phrygian':A('hd',-.16,-.14,28.2,.32,.28,3,hc1);A('hd',-.1,-.02,31,.2,.2,2.5,hc1);A('hd',-.06,.12,31.5,.12,.08,2,hc1);break;
    case 'headband':A('hd',-.155,-.125,26.3,.31,.26,1.1,hc1);A('hd',-.04,-.2,24,.05,.05,4,hc1);break;
    case 'bandage':A('hd',-.155,-.125,25.5,.31,.26,1.4,'#f0ece4');A('hd',.05,.12,26,.05,.02,.8,'#c0392b');break}
  // aggiunte
  let belly=0,arms='',robe=bodyS.has('robe')?tp:null;
  for(const tk of(xs==='none'?[]:xs.split(','))){const[k,cc]=col(tk,'');switch(k){
    case 'apron':{const c=cc||'#f0ece4';A('bd',-.18,.125,6,.36,.02,11,c);A('bd',-.12,.13,15,.24,.012,4.5,c);break}
    case 'cape':{const c=cc||shx(tp,.6);A('bd',-.24,-.17,3,.48,.04,17,c);A('bd',-.23,-.15,19,.46,.29,1.5,c);break}
    case 'vest':{const c=cc||shx(tp,.7);A('bd',-.22,.125,9.5,.15,.015,10,c);A('bd',.07,.125,9.5,.15,.015,10,c);A('bd',-.22,-.125,9.5,.44,.02,10,c);break}
    case 'scarf':{const c=cc||'#c0392b';A('bd',-.17,-.13,18.8,.34,.28,2,c);A('bd',.05,.135,13,.06,.012,6,c);break}
    case 'sash':{const c=cc||'#d4af37';A('bd',-.2,.135,17,.12,.012,2.5,c);A('bd',-.08,.135,14.5,.12,.012,2.5,c);A('bd',.04,.135,12,.12,.012,2.5,c);A('bd',.14,.135,9.5,.07,.012,2.5,c);break}
    case 'armor':{const c=cc||'#9aa0aa';A('bd',-.225,-.125,11,.45,.27,9,c);A('bd',-.37,-.09,18,.15,.18,3,shx(c,.85));A('bd',.22,-.09,18,.15,.18,3,shx(c,.85));A('bd',-.05,.14,13,.1,.01,5,shx(c,1.25));break}
    case 'epaulet':A('bd',-.37,-.08,19.6,.15,.16,1.2,'#d4af37');A('bd',.22,-.08,19.6,.15,.16,1.2,'#d4af37');break;
    case 'medal':A('bd',-.12,.135,15.5,.05,.012,2.4,'#d4af37');A('bd',-.115,.135,17.5,.04,.012,1.2,'#c0392b');break;
    case 'star':A('bd',-.13,.135,15.5,.07,.012,2.2,'#e8d070',1.2);break;
    case 'buttons':for(const z of[11,13.5,16])A('bd',-.015,.135,z,.03,.012,1,'#d4af37');break;
    case 'collar':A('bd',-.17,-.13,19.3,.34,.29,1.5,'#f4f0e8');break;
    case 'necklace':A('bd',-.08,.135,18.2,.16,.012,.8,'#d4af37');A('bd',-.02,.135,16.5,.04,.012,1.6,'#5ad0ff',1.2);break;
    case 'cross':A('bd',-.015,.135,14.5,.03,.012,3.5,'#d4af37');A('bd',-.045,.135,16.5,.09,.012,.9,'#d4af37');break;
    case 'dogtag':A('bd',-.06,.135,17.8,.12,.012,.5,'#c8ccd4');A('bd',-.02,.135,15.6,.04,.012,2,'#c8ccd4');break;
    case 'bowtie':A('bd',-.06,.135,18.4,.05,.015,1.3,'#1a1a1a');A('bd',.01,.135,18.4,.05,.015,1.3,'#1a1a1a');break;
    case 'pouch':A('bd',.12,.1,8,.09,.06,3.5,'#6a4a2a');break;
    case 'sheath':A('bd',.2,-.1,3,.04,.06,9,'#4a3a2a');break;
    case 'stripes':{const c=cc||'#f4f4f0';for(const z of[11,13.5,16])A('bd',-.215,.13,z,.43,.012,.9,c);break}
    case 'check':for(const z of[11,15])A('bd',-.215,.13,z,.43,.012,1.2,'#1a1a1a');A('bd',-.06,.13,9,.03,.012,11,'#1a1a1a');break;
    case 'patches':A('bd',-.15,.13,12,.07,.012,2,shx(tp,1.3));A('bd',.08,.13,16,.06,.012,2.4,shx(tp,.7));A('ll',-.15,.08,3,.06,.01,2,shx(tp,1.2));break;
    case 'paint':A('bd',-.1,.135,9,.04,.012,1.2,'#c0392b');A('bd',.06,.135,12,.05,.012,1,'#2a7ad8');A('bd',-.02,.135,7,.04,.012,1,'#f2c230');break;
    case 'flour':A('bd',-.12,.135,12,.08,.012,1.5,'#ffffff');A('hd',.05,.13,21,.05,.01,1,'#ffffff');break;
    case 'glasses':A('hd',-.12,.135,24.4,.09,.012,1.8,'#2a2a2a');A('hd',.03,.135,24.4,.09,.012,1.8,'#2a2a2a');A('hd',-.03,.135,25,.06,.012,.5,'#2a2a2a');break;
    case 'eyepatch':A('hd',.02,.136,23.4,.09,.015,3,'#111111');A('hd',-.15,.135,26.6,.3,.012,.5,'#111111');break;
    case 'pipe':A('hd',.04,.13,21.3,.03,.09,.8,'#4a2a1a');A('hd',.035,.21,21.3,.05,.05,2.2,'#4a2a1a');break;
    case 'rednose':A('hd',-.03,.135,22.6,.06,.03,1.6,'#e05a4a');A('hd',-.13,.133,22.5,.04,.01,1,'#f08a8a');A('hd',.09,.133,22.5,.04,.01,1,'#f08a8a');break;
    case 'freckles':for(const[x,z]of[[-.11,23],[-.08,22.4],[.06,23],[.09,22.4]])A('hd',x,.133,z,.02,.01,.5,'#b8703a');break;
    case 'scar':A('hd',.06,.133,22.2,.02,.01,4,'#b85a4a');break;
    case 'earring':A('hd',.15,.0,21.6,.025,.025,1.6,'#d4af37');break;
    case 'scowl':A('hd',-.12,.133,26.1,.09,.012,.9,'#2a1a10');A('hd',.03,.133,26.1,.09,.012,.9,'#2a1a10');A('hd',-.03,.133,26.3,.06,.012,.5,'#2a1a10');A('hd',-.06,.133,21,.12,.012,.6,'#5a2a1a');break;
    case 'shine':A('hd',-.08,-.04,29,.1,.1,.3,'#fff6e0',1.4);break;
    case 'horseshoe':A('bd',-.06,.135,16.3,.12,.012,.6,'#c8ccd4');A('bd',-.06,.135,14.3,.025,.012,2,'#c8ccd4');A('bd',.035,.135,14.3,.025,.012,2,'#c8ccd4');break;
    case 'stars':A('bd',-.15,.135,12,.03,.01,1,'#ffe080',1.3);A('bd',.1,.135,15,.03,.01,1,'#ffe080',1.3);A('bd',-.02,.135,7,.03,.01,1,'#ffe080',1.3);break;
    case 'belly':belly=1;break;case 'arms':arms='big';break;case 'robe':robe=cc||tp;break}}
  // attrezzi in mano
  const P_={scepter:[['ar',.27,.05,6,.04,.04,18,'#d4af37'],['ar',.245,.025,24,.09,.09,4,'#e0302a',1.2]],
    spear:WP.spear(),sword:WP.sword(),big:WP.big(),staff:WP.staff(prop.split(':')[1]?hx6(prop.split(':')[1]):'#7ad0ff'),hammer:WP.hammer(),axe:WP.axe(),dagger:WP.dagger(),pistol:WP.pistol(),rifle:WP.rifle(),cutlass:WP.cutlass(),shield:WP.shield('#7a5a3a','#d4af37'),
    mallet:[['ar',.27,.03,4,.04,.04,13,'#6a4a2a'],['ar',.2,-.04,15,.18,.12,5,'#8a6a42']],
    lute:[['bd',-.17,.15,9.5,.22,.06,6.5,'#b07a3a'],['bd',-.1,.21,11.5,.07,.01,2.5,'#2a1a10'],['bd',.04,.16,13,.22,.03,1.6,'#6a4a2a'],['bd',.24,.16,13,.05,.04,2.5,'#4a2a1a']],
    book:[['al',-.36,.06,10.5,.2,.14,.7,'#7a2a2a'],['al',-.35,.07,11.1,.18,.12,.5,'#f4f0e0']],
    scroll:[['ar',.22,.08,10.5,.1,.05,7,'#f4e8c8'],['ar',.21,.08,17.3,.12,.06,.8,'#8a6a3a']],
    quill:[['al',-.36,.06,10.5,.2,.14,.7,'#f4f0e0'],['ar',.28,.08,10,.02,.02,6,'#ffffff'],['ar',.27,.08,15,.04,.02,2.5,'#e8e8e8']],
    broom:[['ar',.27,.06,2,.04,.04,22,'#8a6a3a'],['ar',.21,.0,0,.16,.14,4,'#c8a860']],
    rake:[['ar',.27,.06,2,.04,.04,24,'#8a6a3a'],['ar',.18,.04,0,.22,.04,2,'#6a6a72']],
    ladle:[['ar',.27,.06,6,.03,.03,10,'#b8b8c0'],['ar',.25,.04,5,.07,.07,2,'#b8b8c0']],
    tray:[['ar',.17,.04,15.5,.3,.22,.6,'#c8c8d0'],['ar',.22,.08,16.1,.08,.08,3.4,'#c8a060'],['ar',.22,.08,19.5,.08,.08,.7,'#ffffff']],
    mug:[['ar',.24,.07,9.2,.09,.09,3.6,'#a07040'],['ar',.24,.07,12.8,.09,.09,.8,'#fffaf0'],['ar',.33,.09,10,.02,.04,2,'#a07040']],
    bottle:[['ar',.25,.07,8,.07,.07,5,'#2a6a3a'],['ar',.27,.09,13,.03,.03,2.5,'#2a6a3a']],
    flask:[['ar',.25,.07,8,.08,.08,3.5,'#5ad06a',1.2],['ar',.27,.09,11.5,.04,.04,2,'#d8d0c0']],
    pitchfork:[['ar',.27,.03,0,.04,.04,30,'#7a5a3a'],['ar',.21,.03,29,.16,.04,1,'#7a7a82'],['ar',.21,.03,30,.03,.04,5,'#7a7a82'],['ar',.275,.03,30,.03,.04,5,'#7a7a82'],['ar',.34,.03,30,.03,.04,5,'#7a7a82']],
    crook:[['ar',.27,.04,0,.04,.04,30,'#7a5a3a'],['ar',.27,.04,30,.04,.16,1.5,'#7a5a3a'],['ar',.27,.17,27,.04,.03,4,'#7a5a3a']],
    cane:[['ar',.28,.12,0,.04,.04,10,'#5a3a1a'],['ar',.25,.12,10,.08,.04,1,'#d4af37']],
    lantern:[['al',-.32,.04,3,.1,.1,5,'#3a3a3a'],['al',-.31,.05,4,.08,.08,3,'#ffd060',1.6]],
    torch:[['ar',.27,.04,8,.04,.04,10,'#5a3a1a'],['ar',.25,.02,18,.08,.08,4,'#ffb040',1.6]],
    net:[['al',-.42,-.02,2,.2,.18,9,'#c8b890'],['al',-.4,.0,4,.16,.14,.5,'#a89870'],['al',-.4,.0,7,.16,.14,.5,'#a89870']],
    basket:[['al',-.43,-.06,5,.19,.16,5,'#a0703a'],['al',-.42,-.05,10,.17,.14,1.2,'#e05a3a'],['al',-.38,-.02,10.5,.06,.06,1.2,'#f2c230']],
    flowers:[['ar',.25,.06,9,.06,.06,6,'#3a8a2a'],['ar',.22,.03,14.5,.12,.12,3,'#ff8ab0'],['ar',.24,.05,16.5,.06,.06,1.5,'#ffd84a']],
    coinbag:[['al',-.4,.0,6,.13,.13,5,'#8a6a2a'],['al',-.37,.03,11,.07,.07,1,'#d4af37']],
    dice:[['ar',.25,.1,10,.05,.05,1.5,'#ffffff'],['ar',.31,.09,10,.05,.05,1.5,'#ffffff']],
    telescope:[['ar',.25,.04,10,.06,.06,3,'#8a6a3a'],['ar',.25,.1,12,.06,.18,3,'#d4af37'],['ar',.25,.28,13,.07,.06,3.4,'#8a6a3a']],
    palette:[['al',-.44,.06,10.5,.19,.15,.6,'#d8b080'],['al',-.42,.08,11.1,.04,.04,.4,'#c0392b'],['al',-.36,.12,11.1,.04,.04,.4,'#2a7ad8'],['al',-.32,.08,11.1,.04,.04,.4,'#f2c230'],['ar',.27,.08,10,.02,.02,6,'#6a4a2a'],['ar',.27,.08,16,.02,.02,1,'#c0392b']],
    bread:[['al',-.37,-.02,9,.06,.06,10,'#d0a050'],['al',-.38,.04,8,.08,.08,4,'#c09040']],
    fish:[['ar',.24,.06,3,.07,.04,7,'#8aa0b0'],['ar',.22,.06,2,.1,.03,1.5,'#6a8090']],
    keys:[['ar',.25,.08,8,.06,.01,2,'#c8a040'],['ar',.25,.08,6,.02,.01,2,'#c8a040']],
    fan:[['ar',.18,.12,16,.18,.012,5,'#e8c0e0'],['ar',.25,.12,15,.03,.012,1.5,'#8a4a6a']],
    bell:[['ar',.25,.06,13,.06,.06,3,'#6a4a2a'],['ar',.23,.04,9,.1,.1,4,'#d4af37']],
    flag:[['ar',.27,.03,0,.04,.04,40,'#6a4a2a'],['ar',.31,.03,28,.02,.3,10,'#c0392b'],['ar',.31,.03,32,.02,.3,2,'#d4af37'],['ar',.25,.01,40,.08,.08,2,'#d4af37']],
    sack:[['al',-.44,-.1,3,.22,.2,9,'#d8ccb0'],['al',-.38,-.06,12,.1,.1,1.5,'#a89878']],
    rope:[['al',-.42,-.02,8,.16,.16,2,'#c8a870'],['al',-.4,.0,10,.12,.12,1.4,'#b89860']],
    saw:[['ar',.26,.04,9,.04,.06,3,'#6a4a2a'],['ar',.27,.08,8,.015,.34,3,'#c0c4cc']],
    skull:[['al',-.37,.08,13,.1,.09,3.6,'#ece4d0'],['al',-.35,.165,14.2,.025,.012,1,'#1a1a1a'],['al',-.31,.165,14.2,.025,.012,1,'#1a1a1a']],
    lens:[['ar',.27,.08,9,.02,.02,5,'#4a2a1a'],['ar',.24,.07,14,.08,.02,3,'#c8e8ff',1.2]],
    rollpin:[['ar',.2,.08,10,.24,.06,1.6,'#d8b080']],
    shears:[['ar',.26,.08,8,.02,.06,5,'#c0c4cc'],['ar',.29,.08,8,.02,.06,5,'#c0c4cc']],
    crate:[['bd',-.12,-.18,22,.3,.26,7,'#9a7a4a'],['bd',-.12,-.18,25,.3,.26,.6,'#6a4a2a']],
    rod:[]};
  if(prop==='rod'){const L2=P_.rod;for(let k=0;k<6;k++)L2.push(['ar',.25,.05+k*.13,13+k*2.4,.04,.13,3,k<2?'#3a2a1a':'#8a6a42']);if(o.rod){L2.push(['ar',.26,.79,-4,.015,.015,29,'#dddddd'],['ar',.225,.755,-5,.08,.08,3,'#e8483a'],['ar',.235,.765,-2,.06,.06,2,'#ffffff'])}}
  const pk=prop.split(':')[0];for(const b of(P_[pk]||[]))X.push(b);
  if(belly)A('bd',-.2,.12,10,.4,.07,8,tp);
  // corporatura
  const s=bodyS.has('kid')?.72:bodyS.has('big')?1.1:bodyS.has('tall')?1.06:bodyS.has('old')?.97:1;
  if(bodyS.has('fat')){A('bd',-.25,-.12,10,.5,.26,8,tp)}
  if(fem&&!robe&&!bodyS.has('kid'))robe=tp;if(fem&&bodyS.has('kid'))A('bd',-.22,-.14,6,.44,.3,4,tp);
  const lg=hx6(robe?shx(tp,.6):pick(['#33343c','#3a3226','#2a2a3a','#4a3a2a','#3a3a3a']));
  const m=mHum({s,sk:skin,tp,lg,ar:arms==='big'?skin:(robe&&fem?tp:shx(tp,.92)),robe:robe?shx(robe,.95):null,hunch:bodyS.has('old'),belt:fem?0:undefined,mouth:an==='angry'?'#5a2a1a':undefined,ey:'#111111',x:X});
  m.an=an;m.fem=fem;return m}
// ---- dove guarda: verso l'eroe quando gli parli o gli passi vicino, altrimenti dove cammina o il suo verso preferito ----
function npcFace(e){const px=e.lpx==null?e.px:e.lpx,py=e.lpy==null?e.py:e.lpy,dx=e.px-px,dy=e.py-py;e.lpx=e.px;e.lpy=e.py;
  if(dx*dx+dy*dy>1e-6){e.nmv=t;e.nfd=[dx,dy]}
  if(t-(e.nmv||-9)<.2&&e.nfd)return faceOf(e.nfd[0],e.nfd[1]);
  const talk=PA===e&&PM==='npc',an=e.m&&e.m.an,d=P?dist(e,P):99;
  if(P&&(talk||(d<2.6&&an!=='fish'&&an!=='sleep'&&!e.slp)))return faceOf(P.px-e.px,P.py-e.py);
  return e.fc0!=null?e.fc0:0}
// ---- pose: camminata, gesti mentre parla, e il suo modo di stare fermo ----
function npcPose(L,e){const n=L.length,O=new Float32Array(n*4),G=L.g;if(!G)return L;
  const add=(g,dx,dy,dz,dh)=>{const I=G[g];if(!I)return;for(const i of I){const o=i*4;O[o]+=dx;O[o+1]+=dy;O[o+2]+=dz;O[o+3]+=dh||0}};
  const up=g=>{for(const k of['bd','hd','al','ar'])add(k,0,0,g,0)};
  const ph=e.nph==null?(e.nph=(e.px*7.3+e.py*3.1)%6.28):e.nph,T=t+ph,an=L.an||'idle',mv=(e.path&&e.path.length)||t-(e.nmv||-9)<.2,talk=PA===e&&PM==='npc',cyc=(p)=>(T%p)/p,S=Math.sin;
  if(mv){const s=S(T*10),a=Math.max(0,s)*3,b=Math.max(0,-s)*3;add('ll',0,s*.09,a,-a);add('lr',0,-s*.09,b,-b);add('al',0,-s*.1,Math.abs(s)*.8,0);add('ar',0,s*.1,Math.abs(s)*.8,0);up(Math.abs(s)*1.1)}
  else if(e.slp){up(S(T*1.2)*.4-1);add('hd',0,.04,-1.2,0)}
  else if(talk){const k=S(t*5);
    if(an==='angry'){const f=cyc(1.1);add('ar',0,.12,f<.3?9*f/.3:Math.max(0,9-(f-.3)*40),0);add('al',.14,.12,2,0);add('hd',S(t*14)*.015,0,Math.abs(S(t*9))*.6,0)}
    else if(an==='laugh'){up(Math.abs(S(t*13))*1.1);add('al',0,.1,6+S(t*6)*3,0);add('ar',0,.1,6-S(t*6)*3,0)}
    else if(an==='drill'){add('ar',0,.2,6+S(t*8)*1.5,0);add('hd',0,.03,Math.abs(S(t*10))*.5,0);add('al',.06,-.1,0,0)}
    else{add('ar',0,.06+k*.04,2.5+2.5*k,0);add('al',0,.04-k*.03,1.2-1.2*k,0);add('hd',0,0,Math.abs(S(t*9))*.5,0);up(S(t*2)*.3)}}
  else{const br=S(T*2.2)*.45;up(br);
    switch(an){
      case 'guard':add('bd',0,0,.3,0);break;
      case 'proud':add('bd',0,.015,.4,0);add('hd',0,0,.5,0);add('al',-.04,0,.8,0);add('ar',.04,0,.8,0);if(cyc(7)>.85)add('hd',S(T*3)*.02,0,0,0);break;
      case 'hammer':{const f=cyc(1.3),u=f<.6?f/.6:1-(f-.6)/.12;const z=f<.72?ease3(Math.max(0,u))*9:-1.5;add('ar',0,f<.72?-.08*u:.14,z,0);add('bd',0,f>=.72&&f<.8?.03:0,f>=.72&&f<.8?-.5:0,0);break}
      case 'chop':{const f=cyc(1.6),u=f<.55?f/.55:1-(f-.55)/.15;add('ar',-.04*u,f<.7?-.1*u:.18,f<.7?ease3(Math.max(0,u))*10:-2,0);add('al',0,.05,2,0);break}
      case 'pitch':{const f=cyc(2.2);const p=f<.2?f/.2:f<.4?1-(f-.2)/.2:0;add('ar',0,.22*p,-1*p,0);add('al',0,.12*p,0,0);add('bd',0,.03*p,0,0);break}
      case 'lute':add('ar',0,.05,2+S(T*16)*1.2,0);add('al',.06,.06,3,0);add('hd',S(T*2)*.02,0,0,0);up(Math.abs(S(T*4))*.4);break;
      case 'drink':case 'drunk':{const f=cyc(an==='drunk'?5:7);const sw=an==='drunk'?S(T*1.3)*.06:0;for(const g of['bd','hd','al','ar'])add(g,sw,0,0,0);add('hd',sw*.6,0,0,0);
        if(f>.7)add('ar',-.06,.06,8,0),add('hd',0,-.02,.4,0);break}
      case 'old':up(-.4);if(cyc(9)>.9){const c=S(T*20);add('bd',0,.03,c*.3,0);add('hd',0,.04,c*.4,0)}break;
      case 'kid':{const f=cyc(2.4);if(f<.4){const j=Math.abs(S(f/.4*Math.PI*2))*4;up(j);add('ll',0,0,j,0);add('lr',0,0,j,0);add('al',0,0,j*1.2,0);add('ar',0,0,j*1.2,0)}break}
      case 'write':add('ar',S(T*7)*.02,.1,2+Math.abs(S(T*11))*.6,0);add('al',.04,.08,2,0);add('hd',0,.03,-.7,0);break;
      case 'read':add('al',.08,.12,5,0);add('ar',-.02,.1,3,0);add('hd',0,.03,-.6,0);if(cyc(6)>.9)add('ar',-.1,.06,5,0);break;
      case 'stir':case 'wipe':{const a=T*(an==='stir'?4:3);add('ar',Math.cos(a)*.05,.1+S(a)*.05,2,0);if(an==='wipe')add('bd',0,.02,0,0);break}
      case 'sweep':{const s2=S(T*3);add('ar',s2*.07,.06,0,0);add('al',s2*.07,.04,1,0);add('bd',s2*.02,0,0,0);break}
      case 'shout':{const f=cyc(4.5);if(f>.75){const a=Math.sin((f-.75)/.25*Math.PI);add('ar',0,.06,9*a,0);add('al',0,.06,4*a,0);add('hd',0,.02,.8*a,0)}break}
      case 'fan':add('ar',S(T*12)*.03,.05,6,0);add('hd',S(T*.7)*.012,0,.3,0);break;
      case 'pray':add('al',.12,.12,5,0);add('ar',-.12,.12,5,0);add('hd',0,.04,-.8,0);break;
      case 'angry':{add('al',.17,.13,3,0);add('ar',-.17,.15,2.5,0);add('lr',0,0,Math.max(0,S(T*9))*1.2,0);const f=cyc(3.5);if(f>.8)add('hd',S(T*20)*.025,0,0,0);
        const g2=cyc(9);if(g2>.9){const a=Math.sin((g2-.9)/.1*Math.PI);add('ar',.17,-.03,8*a,0)}break}
      case 'nervous':{const f=cyc(2.2);add('hd',f<.3?-.025:f<.6?.025:0,0,0,0);add('bd',S(T*7)*.006,0,0,0);break}
      case 'dance':{const s2=S(T*4);up(Math.abs(s2)*1.6);add('al',0,0,Math.max(0,s2)*7,0);add('ar',0,0,Math.max(0,-s2)*7,0);add('ll',0,0,Math.max(0,s2)*1.5,0);add('lr',0,0,Math.max(0,-s2)*1.5,0);break}
      case 'declaim':{const f=cyc(6);add('ar',.04,.08,8+S(T*1.5)*2,0);add('al',.12,.1,3,0);add('hd',0,0,.8,0);if(f>.8)up(Math.abs(S(T*6))*.6);break}
      case 'wave':{const f=cyc(5);if(f>.7){add('ar',0,0,10,0);add('ar',S(T*10)*.05,0,0,0)}break}
      case 'salute':{const f=cyc(6);if(f>.65)add('ar',-.1,.1,10,0);break}
      case 'count':add('ar',0,.1,2+Math.abs(S(T*6))*1,0);add('al',.05,.08,2,0);add('hd',0,.03,-.5,0);break;
      case 'paint':{const f=cyc(1.4);add('ar',0,.1+(f<.3?.08:0),4,0);add('al',.02,.06,2,0);break}
      case 'look':add('ar',-.04,.02,6,0);add('hd',0,-.02,.6,0);break;
      case 'bow':{const f=cyc(7);if(f>.8){const a=Math.sin((f-.8)/.2*Math.PI);add('hd',0,.1*a,-2.5*a,0);add('bd',0,.05*a,-.6*a,0)}break}
      case 'sad':add('hd',0,.03,-1,0);up(-.4);if(cyc(8)>.85)up(S(T*2)*.6);break;
      case 'tired':{add('hd',S(T*.5)*.02,.03,-.8,0);const f=cyc(9);if(f>.85)add('ar',0,.06,9,0),add('hd',0,-.02,.6,0);break}
      case 'kungfu':{const f=cyc(1.8);const p=f<.15?f/.15:f<.3?1-(f-.15)/.15:f<.5?0:f<.65?(f-.5)/.15:f<.8?1-(f-.65)/.15:0;if(f<.4)add('ar',0,.3*p,4*p,0);else add('al',0,.3*p,4*p,0);add('ll',0,-.06,0,0);add('lr',0,.06,0,0);up(-.6);break}
      case 'sword2':{const f=cyc(2.4);const a=S(f*Math.PI*2);add('ar',a*.1,.1+Math.abs(a)*.12,6+a*3,0);add('ll',0,-.05,0,0);add('lr',0,.06,0,0);break}
      case 'fish':{if(cyc(6)>.92)add('ar',0,-.04,1.5,0);break}
      case 'mill':{if(typeof millOK==='function'&&!millOK()){add('hd',0,.03,-1,0);up(-.3);if(cyc(10)>.8)add('ar',0,.08,7,0)}else{const f=cyc(3);if(f<.25)up(Math.abs(S(f/.25*Math.PI*2))*2)}break}
      case 'laugh':{const f=cyc(7);if(f<.3){up(Math.abs(S(T*13))*1.2);add('hd',0,-.02,.5,0)}else if(f>.78){const a=Math.sin((f-.78)/.22*Math.PI);up(2*a);add('al',0,.16,7*a+S(T*16)*2*a,0);add('ar',0,.16,7*a-S(T*16)*2*a,0);add('ll',0,.04*a,0,0)}break}
      case 'drill':{add('al',.08,-.12,1,0);add('ar',-.08,-.12,1,0);const f=cyc(5);if(f>.7){const a=Math.sin((f-.7)/.3*Math.PI);add('bd',0,.04*a,0,0);add('hd',0,.06*a,-.4*a,0);add('ar',.08,.32*a+.12*a,7*a,0)}else{const s2=S(T*4);add('ll',0,0,Math.max(0,s2)*1.5,0);add('lr',0,0,Math.max(0,-s2)*1.5,0)}break}
      default:{const f=cyc(8);if(f>.8)add('hd',S(T*1.4)*.02,0,0,0)}}}
  const R=new Array(n);for(let i=0;i<n;i++){const b=L[i],o=i*4;R[i]=[b[0]+O[o],b[1]+O[o+1],b[2]+O[o+2],b[3],b[4],Math.max(.3,b[5]+O[o+3]),b[6],b[7]]}
  R.rg=1;R.g=L.g;return R}
const _mkNpc73=mkNpc;mkNpc=function(id,x,y,o){o=o||{};const e=_mkNpc73(id,x,y,o);if(!ANIMN.has(id)&&!o.keepM){try{e.m=npcModel(id,o,e)}catch(err){console.warn('npc',id,err)}}return e};
// ritratto nel dialogo: ora si muove con i gesti del personaggio
function paintNpc(c,e,tm,talking){const dp=Math.min(2,window.devicePixelRatio||1),w=128,h=148;if(c.width!==w*dp){c.width=w*dp;c.height=h*dp}
  const q=c.getContext('2d');q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,c.width,c.height);let L=e.m;if(!L||!L.length)return;
  let top=0;for(const p of L)top=Math.max(top,(p[2]||0)+(p[5]||0));top=Math.max(14,Math.min(top,46));
  const sc=Math.min(2.9,(h-12)/(top*.85+4)),oy=16+(top+2)*sc+Math.sin(tm*2)*.6;
  const og=g;g=q;try{g.setTransform(sc*dp,0,0,sc*dp,w/2*dp,oy*dp);if(L.rg&&L.g)L=npcPose(L,e);else if(talking&&!e.slp&&L.length>5&&L.hm)L=talkA(L);
    if(L.hm||L.rg||L.length<40)drawHero(L,0,0,0,0,0);else drawL(L,0,0,0,0)}catch(err){}finally{g=og}}

/* ================= 7.3: la pesca rifatta — lancio, ombre nell'acqua, abboccate finte, lotta con la corrente e pesci leggendari ================= */
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h){this.rect(x,y,w,h)};
const FRC=['#c8ccd4','#5ad65a','#4aa3ff','#b866ff','#ffae2b'],FRN=['Comune','Non comune','Raro','Epico','Leggendario'];
// dati in più per i pesci di sempre (rarità, peso in kg, forma e colori)
const FX73={sardina:{r:0,kg:[.05,.15],c:'#9ab4c8',b:'#e8f0f4',l:.34,h:3.2},sgombro:{r:0,kg:[.2,.7],c:'#3a7a8a',b:'#e0ecf0',st:'#1a3a4a',l:.42,h:3.6},
  orata:{r:1,kg:[.4,1.8],c:'#b8c0c8',b:'#f0f0f0',st:'#e8c040',l:.44,h:5},branzino:{r:1,kg:[.5,3],c:'#8a98a8',b:'#e8ecf0',l:.52,h:4.6},
  polpo:{r:2,kg:[.8,4],c:'#c8605a',sh:'octo',l:.4,h:5},calamaro:{r:1,kg:[.3,1.5],c:'#e8b0a0',sh:'squid',l:.5,h:3.5},
  pesce_spada:{r:3,kg:[20,80],c:'#3a5a7a',b:'#c8d4e0',sh:'sword',l:.9,h:6},trota_dorata:{r:3,kg:[1,4],c:'#e8b040',b:'#fff0c0',st:'#c87a20',l:.5,h:4.6,gl:1},
  stivale:{r:0,kg:[.4,.9],c:'#5a3a22',sh:'boot',l:.3,h:6}};
for(const f of FISHT)Object.assign(f,FX73[f.id]||{r:0,kg:[.2,1],c:'#8aa0b0',l:.4,h:4});
// i pesci del mare aperto (si pescano solo dalla barca di Stefano)
FISHT.push(
  {id:'acciuga',n:'Acciuga',w:0,p:5,d:.12,sea:1,r:0,kg:[.02,.06],c:'#a8c0d0',b:'#f0f6fa',l:.28,h:2.6},
  {id:'merluzzo',n:'Merluzzo',w:0,p:14,d:.3,sea:1,r:0,kg:[.8,4],c:'#b0a080',b:'#efe8d8',l:.6,h:4.6},
  {id:'dentice',n:'Dentice',w:0,p:28,d:.42,sea:1,r:1,kg:[1,6],c:'#d08a8a',b:'#f8e0e0',l:.56,h:5.4},
  {id:'ricciola',n:'Ricciola',w:0,p:40,d:.5,sea:1,r:1,kg:[3,15],c:'#7a8aa0',b:'#e8ecf0',st:'#e8d040',l:.75,h:5},
  {id:'lampuga',n:'Lampuga',w:0,p:60,d:.58,sea:1,r:2,kg:[4,18],c:'#2ab07a',b:'#f0e040',l:.8,h:6,fn:'#2a7ad8'},
  {id:'razza',n:'Razza',w:0,p:55,d:.5,sea:1,r:2,kg:[2,10],c:'#7a6a5a',sh:'flat',l:.6,h:1.6},
  {id:'cernia',n:'Cernia',w:0,p:75,d:.62,sea:1,r:2,kg:[5,25],c:'#7a5a3a',b:'#c8a878',sh:'grouper',l:.8,h:7},
  {id:'tonno',n:'Tonno',w:0,p:90,d:.66,sea:1,r:2,kg:[15,90],c:'#23345e',b:'#d8dce8',fn:'#e8c040',l:1,h:7.5},
  {id:'murena',n:'Murena',w:0,p:70,d:.6,sea:1,r:2,kg:[1,6],c:'#6a7a3a',sh:'eel',st:'#e8e080',l:.9,h:3},
  {id:'pesce_lanterna',n:'Pesce lanterna',w:0,p:140,d:.7,sea:1,r:3,kg:[.3,1.2],c:'#2a3450',sh:'lantern',l:.42,h:4.6,gl:1},
  {id:'verdesca',n:'Verdesca',w:0,p:180,d:.8,sea:1,r:3,kg:[20,60],c:'#3a5a8a',b:'#e8ecf0',sh:'shark',l:1.3,h:6.5},
  {id:'re_spada',n:'Re Spada',w:0,p:1200,d:.92,sea:1,r:4,leg:1,kg:[120,300],c:'#c8a440',b:'#fff4c8',sh:'sword',l:1.5,h:7.5,gl:1,fn:'#ffd84a'},
  {id:'tonno_rosso',n:'Tonno Rosso Gigante',w:0,p:1500,d:.94,sea:1,r:4,leg:1,kg:[250,600],c:'#8a1a2a',b:'#f0d8d8',fn:'#ffd84a',l:1.7,h:11},
  {id:'murena_abissi',n:'Murena degli Abissi',w:0,p:1400,d:.95,sea:1,r:4,leg:1,kg:[30,80],c:'#2a1a3a',sh:'eel',st:'#c46bff',l:1.6,h:4.6,gl:1},
  {id:'luna_argento',n:'Luna d\'Argento',w:0,p:1800,d:.95,sea:1,r:4,leg:1,kg:[200,900],c:'#d8e4f0',b:'#ffffff',sh:'sun',l:1,h:7,gl:1},
  {id:'vecchio_testardo',n:'Il Vecchio Testardo',w:0,p:3000,d:.98,sea:1,r:4,leg:1,kg:[300,500],c:'#4a3a2a',b:'#a88a5a',sh:'grouper',l:1.8,h:13,old:1});
const FISHI=Object.fromEntries(FISHT.map(f=>[f.id,f]));
// ---- modelli voxel dei pesci (lungo l'asse y, testa in avanti) ----
function fishModel(f,s=1){const L=[],c=f.c,b=f.b||shx(hx6(c),1.3),fn=f.fn||shx(hx6(c),.8),l=f.l*s,h=f.h*s,w=Math.max(.06,l*.22),A=(x,y,z,W,D,H,col,br)=>L.push(br?[x,y,z,W,D,H,col,br]:[x,y,z,W,D,H,col]);
  switch(f.sh){
    case 'boot':A(-.08,-.1,0,.16,.2,h,c);A(-.08,.08,0,.16,.16,h*.35,c);A(-.09,-.11,h*.85,.18,.22,h*.15,'#3a2412');A(-.085,.2,0,.17,.06,h*.18,'#2a1a0a');break;
    case 'octo':A(-w,-w,h*.35,w*2,w*2,h*.65,c);A(-w*.7,-w*.7,h,w*1.4,w*1.4,h*.2,c);for(let i=0;i<6;i++){const a=i/6*6.28;A(Math.cos(a)*w*1.1-.02,Math.sin(a)*w*1.1-.02,0,.04,.04,h*.4,shx(hx6(c),.9))}A(-w*.6,w*.95,h*.6,.04,.01,h*.15,'#111');A(w*.45,w*.95,h*.6,.04,.01,h*.15,'#111');break;
    case 'squid':A(-w*.6,-l*.2,h*.2,w*1.2,l*.6,h*.6,c);A(-w*.4,-l*.35,h*.3,w*.8,l*.15,h*.4,c);for(let i=0;i<4;i++)A(-w*.5+i*w*.33,l*.38,h*.15,.03,l*.25,h*.2,shx(hx6(c),.9));A(-w*.6-.005,l*.25,h*.5,.01,.04,h*.18,'#111');A(w*.6-.005,l*.25,h*.5,.01,.04,h*.18,'#111');break;
    case 'flat':A(-l*.45,-l*.3,0,l*.9,l*.6,h,c);A(-l*.25,-l*.45,0,l*.5,l*.15,h,c);A(-.015,-l*1.05,0,.03,l*.6,h*.6,shx(hx6(c),.8));A(-l*.1,l*.2,h,.03,.03,h*.3,'#111');A(l*.07,l*.2,h,.03,.03,h*.3,'#111');break;
    case 'eel':{for(let i=0;i<7;i++){const ox=Math.sin(i*1.1)*w*.5;A(ox-w*.35,-l*.5+i*l*.14,0,w*.7,l*.15,h,i===6?shx(hx6(c),1.1):c);if(f.st&&i%2)A(ox-w*.36,-l*.5+i*l*.14,h*.4,w*.72,l*.05,h*.2,f.st,f.gl?1.3:0)}
      A(-w*.37,l*.4,h*.55,.01,.04,h*.2,f.gl?'#ff4ad0':'#111',f.gl?1.6:0);A(w*.36,l*.4,h*.55,.01,.04,h*.2,f.gl?'#ff4ad0':'#111',f.gl?1.6:0);A(-w*.2,l*.48,0,w*.4,.03,h*.3,'#3a0a0a');break}
    case 'sun':A(-w*.5,-l*.4,0,w,l*.8,h*1.6,c,f.gl?1.15:0);A(-w*.45,-l*.38,0,w*.9,l*.76,h*.4,b);A(-w*.2,-l*.1,h*1.6,w*.4,l*.2,h*.9,c);A(-w*.2,-l*.1,-h*.8,w*.4,l*.2,h*.8,c);A(-w*.25,-l*.5,h*.3,w*.5,l*.12,h,shx(hx6(c),.9));
      A(-w*.5-.005,l*.25,h*1.1,.01,.05,h*.2,'#1a2a3a');A(w*.5-.005,l*.25,h*1.1,.01,.05,h*.2,'#1a2a3a');break;
    default:{const big=f.sh==='grouper',sw=f.sh==='sword',sk=f.sh==='shark';const W=big?w*1.3:w;
      A(-W/2,-l*.35,0,W,l*.7,h,c);A(-W/2+.005,-l*.32,0,W-.01,l*.62,h*.32,b);A(-W*.42,l*.35,h*.08,W*.84,l*.14,h*(big?.9:.78),c);
      A(-W*.12,-l*.62,-h*.15,W*.24,l*.2,h*1.25,fn);A(-W*.08,-l*.18,h,W*.16,l*(sk?.2:.36),h*(sk?.9:sw?.9:.45),fn);if(sk)A(-W*.06,-l*.1,h*1.6,W*.12,l*.08,h*.5,fn);
      A(-W/2-.006,l*.38,h*.55,.012,.035,h*.18,'#111');A(W/2-.006,l*.38,h*.55,.012,.035,h*.18,'#111');
      if(sw)A(-.015,l*.49,h*.42,.03,l*.5,h*.14,'#d8dce4');if(sk)A(-W*.3,l*.49,h*.1,W*.6,l*.08,h*.5,c);
      if(big){A(-W*.35,l*.49,h*.05,W*.7,.02,h*.3,'#2a1a10');for(let i=0;i<5;i++)A(-W/2-.004,-l*.25+i*l*.12,h*(.3+(i%2)*.3),.008,.04,h*.12,shx(hx6(c),.7))}
      if(f.st)for(let i=0;i<3;i++)A(-W/2-.004,-l*.22+i*l*.17,h*.35,W+.008,.035,h*.55,f.st,f.gl?1.25:0);
      if(f.sh==='lantern'){A(-.01,l*.45,h,.02,.02,h*.7,'#1a2030');A(-.03,l*.43,h*1.65,.06,.06,h*.25,'#9affff',1.8)}
      if(f.old){A(-W*.3,l*.5,h*.45,.02,.02,h*.4,'#b0b0b8');A(W*.2,l*.5,h*.3,.02,.02,h*.35,'#b0b0b8');A(-W*.05,l*.2,h*1.05,W*.5,l*.2,h*.25,'#c0392b')}
      if(f.gl)A(-W*.1,-l*.2,h*.95,W*.2,l*.4,h*.1,'#fff6c0',1.4)}}
  return L}
// ---- dove si pesca: il porto e i cinque mari di Stefano ----
const FGR={porto:{n:'Porto di Aldoria'},
  mare_scogliera:{n:'Scogliera dei Gabbiani',t:{acciuga:25,merluzzo:20,dentice:16,ricciola:12,orata:10,sgombro:10,razza:6,pesce_spada:3},leg:'re_spada',q:'ste2'},
  mare_banco:{n:'Banco dei Tonni',t:{sgombro:20,ricciola:18,lampuga:16,tonno:14,acciuga:10,pesce_spada:6,verdesca:3},leg:'tonno_rosso',q:'ste3'},
  mare_fossa:{n:'Fossa Profonda',t:{merluzzo:18,cernia:18,murena:16,razza:12,polpo:10,pesce_lanterna:6,verdesca:5},leg:'murena_abissi',q:'ste4'},
  mare_grotta:{n:'Grotta Marina',t:{calamaro:18,pesce_lanterna:16,polpo:12,murena:12,dentice:10,acciuga:10},leg:'luna_argento',q:'ste5'},
  mare_naufragio:{n:'Punta del Naufragio',t:{cernia:20,polpo:12,murena:12,stivale:10,verdesca:8,tonno:8,merluzzo:10},leg:'vecchio_testardo',q:'ste6'}};
function fishPick(good){const G=FGR[Zk];const rb=(P.rod>=2?1.6:1)*(P.rod>=3?1.3:1)*(good?1.5:1),nt=isNight();
  if(G&&G.t){const lg=FISHI[G.leg],qa=P.q.some(q=>q.id===G.q),got=(P.fish[G.leg]||0)>0;
    if(lg&&(G.leg!=='vecchio_testardo'||qa||got)){const ch=(qa&&!got?.1:.018)*(good?1.6:1)*(P.rod>=3?1.3:1);if(Math.random()<ch)return lg}
    const L=Object.entries(G.t).map(([id,w])=>[FISHI[id],w*(FISHI[id].r>=2?rb:1)]).filter(x=>x[0]);let r=Math.random()*L.reduce((a,b)=>a+b[1],0);for(const[f,w]of L)if((r-=w)<0)return f;return L[0][0]}
  const L=FISHT.filter(f=>!f.sea&&(!f.nt||nt)&&f.w>0).map(f=>[f,f.w*(f.p>=30?rb:1)]);let r=Math.random()*L.reduce((a,b)=>a+b[1],0);for(const[f,w]of L){if((r-=w)<0)return f}return L[0][0]}
const ROD=['Nessuna canna','Canna da pesca','Canna di quercia','Canna del Cavallo Pazzo'];
const fkg=f=>{const[a,b]=f.kg,u=Math.pow(Math.random(),1.8);return Math.round((a+(b-a)*u)*100)/100};
const fkgS=k=>k>=10?k.toFixed(0)+' kg':k>=1?k.toFixed(1)+' kg':Math.round(k*1000)+' g';
// ---- la partita di pesca ----

function fishStart(){const sp=FSPOT,sea=Zk.startsWith('mare_');if(sp){P.dr=[sp.ox,sp.oy];P.fc=faceOf(sp.ox,sp.oy)}P.path=[];P.tg=null;
  FSH={ph:'aim',pw:0,pd:1,hold:0,msg:'Tieni premuto per caricare il lancio, poi rilascia.',dx:sp?sp.ox:(P.dr||[0,1])[0],dy:sp?sp.oy:(P.dr||[0,1])[1],sx:P.px,sy:P.py,bx:0,by:0,k:0,rph:'',sea,t0:performance.now(),sh:[],rip:[],sp:[]};
  clearInterval(FST);FST=setInterval(fishTick,30);pn('fish')}
function fishCastTo(F){const pw=F.pw,d=(F.sea?1.3:.9)+pw*(F.sea?3.4:2.4);let bx=F.sx+F.dx*d,by=F.sy+F.dy*d;
  const wat=(a,b)=>{const x=a|0,y=b|0;return x>0&&y>0&&x<N-1&&y<N-1&&M[y][x]===2};let ok=wat(bx,by);for(let k=1;k<=12&&!ok;k++){if(wat(bx+F.dx*.25*k,by+F.dy*.25*k)){bx+=F.dx*.25*k;by+=F.dy*.25*k;ok=1;break}if(wat(bx-F.dx*.25*k,by-F.dy*.25*k)){bx-=F.dx*.25*k;by-=F.dy*.25*k;ok=1;break}}F.bx=bx;F.by=by}
function fishKey(on){const F=FSH;if(!F)return;const now=performance.now();
  if(F.ph==='aim'){if(on)F.hold=1;else if(F.hold){F.hold=0;F.good=F.pw>=.62&&F.pw<=.9;fishCastTo(F);F.ph='fly';F.k=0;F.msg=F.good?'Lancio perfetto! L\'amo vola lontano.':'Lancio!';whoosh();F.cast=now}}
  else if(F.ph==='wait'&&on&&!F.sk){F.sk=1;const ch=F.sh[0];if(ch){ch.flee=1}F.tw=now+3200+Math.random()*3000;F.nb=fishNibbles(now,F.tw);F.f=fishPick(F.good);fishShadow(F,1);
    F.msg=F.nibT&&now-F.nibT<500?'Era solo un assaggio! Il pesce è scappato: aspetta che abbocchi davvero.':'Troppo presto! Hai spaventato il pesce.';tone(170,.15,'sine');setTimeout(()=>{if(FSH===F)F.sk=0},350)}
  else if(F.ph==='bite'&&on){fishFightStart(F)}
  else if(F.ph==='fight')F.hold=on?1:0;
  else if(F.ph==='end'&&on&&now-(F.endT||0)>500)fishStart();fishUI()}
function fishNibbles(now,tw){const n=Math.floor(Math.random()*3.2),L=[];for(let i=0;i<n;i++)L.push(now+1000+Math.random()*Math.max(200,tw-now-1700));return L.sort((a,b)=>a-b)}
function fishShadow(F,fresh){const f=F.f,big=Math.min(1.6,.5+Math.log10(1+f.kg[1])*.5);const a=Math.random()*6.28;
  const ch={x:F.bx+Math.cos(a)*2.2,y:F.by+Math.sin(a)*2.2,vx:0,vy:0,s:big,gl:f.r>=4?FRC[4]:f.r>=3?FRC[3]:'',ch:1};
  if(fresh)F.sh=F.sh.filter(s=>!s.ch||s.flee);F.sh.unshift(ch);while(F.sh.length<4){const b=Math.random()*6.28,r=1+Math.random()*1.8;F.sh.push({x:F.bx+Math.cos(b)*r,y:F.by+Math.sin(b)*r,vx:0,vy:0,s:.35+Math.random()*.5})}}
function fishFightStart(F){const f=F.f,r=f.r,rod=P.rod||1;F.ph='fight';F.hold=0;tone(520,.08,'square',.05);if(cineOK())shake(.25);
  F.fp=.5;F.ft=.5;F.fs=.12+f.d*.42;F.ftT=0;F.zc=.5;F.zv=0;F.zw=Math.max(.15,.27+(rod-1)*.04-.02*r);F.pr=.32;F.dash=0;F.dw=0;F.jt=-1;F.deep=0;F.nd=3+Math.random()*3;F.nj=5+Math.random()*4;F.ndp=6+Math.random()*4;F.ft0=performance.now();
  F.msg=f.r>=4?'È ENORME! Tieni il pesce dentro la zona dorata!':'Ha abboccato! Tieni il pesce dentro la zona dorata.'}
function fishTick(){if(PM!=='fish'||!FSH){clearInterval(FST);if(PM!=='fish')FSH=null;return}const F=FSH,dt=.03,now=performance.now();if(Math.hypot(P.px-F.sx,P.py-F.sy)>1.3){cl();msg('Hai smesso di pescare.');return}
  if(F.ph==='aim'&&F.hold){F.pw+=F.pd*dt*1.05;if(F.pw>1){F.pw=1;F.pd=-1}if(F.pw<0){F.pw=0;F.pd=1}}
  if(F.ph==='fly'){F.k+=dt/.65;if(F.k>=1){F.k=1;F.ph='wait';F.f=fishPick(F.good);F.tw=now+(2400+Math.random()*3800)*(F.good?.7:1)*(F.sea?.85:1);F.nb=fishNibbles(now,F.tw);fishShadow(F,1);
      F.msg='Il galleggiante dondola... guarda le ombre sotto l\'acqua.';tone(260,.07,'sine');fishRip(F.bx,F.by,1.2);if(cineOK())sparks(F.bx,F.by,10,['#cfe8ff','#ffffff'],50)}}
  if(F.ph==='wait'){for(const s of F.sh){if(s.flee){const dx=s.x-F.bx,dy=s.y-F.by,d=Math.hypot(dx,dy)||1;s.x+=dx/d*dt*4;s.y+=dy/d*dt*4;s.al=Math.max(0,(s.al==null?1:s.al)-dt*1.5);continue}
      if(s.ch&&now>F.tw-1600){s.x+=(F.bx-s.x)*Math.min(1,dt*1.6);s.y+=(F.by-s.y)*Math.min(1,dt*1.6)}
      else{s.vx+=(Math.random()-.5)*dt*3;s.vy+=(Math.random()-.5)*dt*3;const dx=F.bx-s.x,dy=F.by-s.y,d=Math.hypot(dx,dy);if(d>2.4){s.vx+=dx/d*dt*1.4;s.vy+=dy/d*dt*1.4}s.vx*=.97;s.vy*=.97;s.x+=s.vx*dt;s.y+=s.vy*dt}}
    F.sh=F.sh.filter(s=>!s.flee||s.al>0);
    if(F.nb&&F.nb.length&&now>=F.nb[0]){F.nb.shift();F.nibT=now;tone(330,.04,'sine',.03);fishRip(F.bx,F.by,.5)}
    if(now>=F.tw){F.ph='bite';F.te=now+1000*(P.rod>=2?1.15:1)*(F.f.r>=4?.75:1);F.msg='ABBOCCA! Ferra subito!';tone(880,.1,'triangle');tone(660,.12,'square',.04);fishRip(F.bx,F.by,1.6);if(cineOK()){sparks(F.bx,F.by,16,['#ffffff','#bfe6ff'],70);shake(.15)}}}
  if(F.ph==='bite'&&now>F.te){F.ph='end';F.endT=now;F.res=null;F.msg='Troppo lento a ferrare: il pesce ha mangiato l\'esca ed è scappato.';tone(150,.2)}
  if(F.ph==='fight')fishFight(F,dt,now);
  if(F.ph==='land'){F.k+=dt/.8;if(F.k>=1){F.ph='end';F.endT=now}}
  if(F.rip.length)F.rip=F.rip.filter(r=>now-r.t<1400);fishUI()}
function fishRip(x,y,s){FSH&&FSH.rip.push({x,y,s,t:performance.now()})}
function fishFight(F,dt,now){const f=F.f,r=f.r,leg=f.r>=4;
  // il pesce: corre verso un punto, cambia idea, a volte scatta, salta o va a fondo
  F.ftT-=dt;if(F.ftT<=0||Math.abs(F.ft-F.fp)<.02){F.ftT=.6+Math.random()*(1.8-f.d);const rg=.25+f.d*.6;F.ft=Math.max(.04,Math.min(.96,F.fp+(Math.random()-.5)*rg*2))}
  if(r>=3||leg){F.nd-=dt;if(F.nd<=0&&!F.dw&&F.jt<0){F.dw=.45;F.nd=(leg?3.5:5)+Math.random()*3;tone(200,.1,'sawtooth',.04)}
    if(F.dw>0){F.dw-=dt;if(F.dw<=0){F.dw=0;F.dash=.55;F.ft=F.fp<.5?.9+Math.random()*.08:.02+Math.random()*.08;if(cineOK())shake(.2)}}}
  if(r>=2&&F.jt<0){F.nj-=dt;if(F.nj<=0){F.nj=(leg?4:7)+Math.random()*4;F.jt=0;F.jx=F.fp;F.jto=Math.max(.05,Math.min(.95,F.fp+(Math.random()-.5)*.7));tone(400,.08,'triangle');whoosh()}}
  if(F.jt>=0){F.jt+=dt;F.fp=F.jx+(F.jto-F.jx)*Math.min(1,F.jt/.9);if(F.jt>=.9){F.jt=-1;fishRip(F.wfx||F.bx,F.wfy||F.by,1.4);if(cineOK())sparks(F.wfx||F.bx,F.wfy||F.by,14,['#ffffff','#bfe6ff'],70);tone(200,.12,'sine')}}
  else{const sp=F.fs*(F.dash>0?2.4:1);F.dash=Math.max(0,F.dash-dt);const d=F.ft-F.fp;F.fp+=Math.sign(d)*Math.min(Math.abs(d),sp*dt)+(Math.random()-.5)*dt*.05;F.fp=Math.max(0,Math.min(1,F.fp))}
  if(leg){F.ndp-=dt;if(F.ndp<=0&&F.deep<=0){F.deep=2.6;F.ndp=7+Math.random()*4;F.msg='Va a fondo! La zona si stringe: tieni duro!';tone(90,.3,'sine',.06)}if(F.deep>0){F.deep-=dt;if(F.deep<=0)F.msg='Tieni il pesce dentro la zona dorata!'}}
  // la zona dorata: tieni premuto per spingerla a destra, lascia e torna a sinistra
  const zw=F.zw*(F.deep>0?.78:1);F.zv+=(F.hold?3.2:-3.2)*dt;F.zv*=1-1.8*dt;F.zc+=F.zv*dt;if(F.zc<zw/2){F.zc=zw/2;F.zv=-F.zv*.35}if(F.zc>1-zw/2){F.zc=1-zw/2;F.zv=-F.zv*.35}
  const inz=F.jt<0&&Math.abs(F.fp-F.zc)<zw/2;F.inz=inz;
  if(F.jt<0)F.pr+=inz?(.3-.02*r)*dt:-(.1+.012*r)*dt;
  if(inz&&Math.random()<.08)tone(600+F.pr*500,.025,'triangle',.02);
  if(F.pr>=1)fishLand(F);else if(F.pr<=0){F.ph='end';F.endT=now;F.res=null;F.msg=(leg?f.n+' ha spezzato la lenza ed è tornato negli abissi.':'Il pesce si è liberato ed è scappato.');tone(120,.3,'sawtooth');if(cineOK())sparks(F.bx,F.by,10,['#ffffff'],60)}}
function fishLand(F){const f=F.f,kg=fkg(f),nw=!(P.fish[f.id]>0),rec=!nw&&kg>((P.frec||{})[f.id]||0);P.frec=P.frec||{};
  P.fish[f.id]=(P.fish[f.id]||0)+1;if(!(P.frec[f.id]>=kg))P.frec[f.id]=kg;F.res={f,kg,nw,rec};F.ph='land';F.k=0;
  F.msg=f.id==='stivale'?'Hai tirato su... uno stivale vecchio.':(f.r>=4?'LEGGENDARIO! ':'Preso! ')+f.n+' · '+fkgS(kg)+(nw?' · nuova specie!':rec?' · nuovo record!':'');
  jingle(f.r>=4?[72,76,79,84,88,91]:f.r>=2?[72,76,79,84]:[67,72,76],.09,'triangle');if(f.r>=4){if(cineOK()){shake(.6);slowmo&&slowmo(.4,.8)}banner('Pesce leggendario!',f.n+' · '+fkgS(kg),'stella')}
  for(const q of P.q){const T=QT[q.id];if(T.t==='fish'&&!qReady(q)&&(T.f==='any'?(f.id!=='stivale'&&(!T.zb||Zk.startsWith('mare_'))):T.f===f.id)){q.c++;msg(T.ti+': '+q.c+'/'+T.n);if(qReady(q))jingle([67,72])}}
  npcMarks();hud();save()}
function fishCatch(){fishLand(FSH)}
function fishUI(){const F=FSH;if(!F)return;if(F.ph!==F.rph){F.rph=F.ph;pn('fish');return}const m=$('fmsg');if(m&&m.textContent!==F.msg)m.textContent=F.msg}
function fishHTML(){const F=FSH,G=FGR[Zk];const lab={aim:'🎣 Lancia (tieni premuto)',fly:'…',wait:'⚡ Ferra',bite:'⚡ FERRA!',fight:'🔄 Recupera (tieni premuto)',land:'…',end:'🎣 Lancia di nuovo'}[F.ph];
  return`<div class="fhd"><b>🎣 ${esc(G?G.n:ZZ.n)}</b><span>${esc(ROD[Math.min(3,P.rod||1)])}</span></div><canvas id="fcv" width="560" height="150" onpointerdown="event.preventDefault();fishKey(1)"></canvas><p id="fmsg">${esc(F.msg)}</p>
  <div class="fbr"><button id="fbt" class="${F.ph==='bite'?'hot':''}">${lab}</button><button onclick="pn('fdia')">📖 Diario</button><button onclick="cl()">Smetti</button></div>
  <p class="mu fsm">Barra spaziatrice o tieni premuto sul riquadro. ${F.sea?'In mare aperto abboccano pesci più grossi.':isNight()?'È notte: calamari e trote dorate salgono in superficie.':'Di notte abboccano anche calamari e trote dorate.'}</p>`}
function fishBind(){const b=$('fbt');if(!b)return;b.onpointerdown=e=>{e.preventDefault();fishKey(1)};b.onpointerup=b.onpointerleave=()=>fishKey(0)}
// diario del pescatore: specie prese, quante, il record
function fdiaHTML(){let h='<h3>📖 Diario del pescatore</h3><p class="mu">Ogni specie presa, quante volte e il pesce più grosso.</p><div class="fdia">';
  const rec=P.frec||{};for(const f of FISHT.slice().sort((a,b)=>a.r-b.r||a.p-b.p)){const n=P.fish[f.id]||0;
    h+=`<div class="fde ${n?'':'no'}" style="--rc:${FRC[f.r]}"><b>${n?esc(f.n):'???'}</b><small>${FRN[f.r]}${f.sea?' · mare aperto':''}</small><span>${n?'×'+n+(rec[f.id]?' · record '+fkgS(rec[f.id]):''):f.leg?'leggenda dei mari':'non ancora preso'}</span></div>`}
  const tot=FISHT.filter(f=>P.fish[f.id]>0).length;return h+`</div><p class="mu">Specie trovate: ${tot}/${FISHT.length}</p><button onclick="${fishBack()?"pn('fish')":'cl()'}">${fishBack()?'Torna a pescare':'Chiudi'}</button>`}
// ---- la canna: si piega e trema mentre il pesce tira ----
function rodL2(){const F=FSH,L=[];let a0=.78,bend=0,sx=0;
  if(F){if(F.ph==='aim')a0=.78+F.pw*1.1*(F.hold?1:0);else if(F.ph==='fly')a0=.5+Math.max(0,.6-F.k)*.4;else if(F.ph==='fight'){a0=.6;bend=.1+.12*(1-F.pr)+(F.dash>0?.08:0);sx=(F.fp-.5)*.06}else if(F.ph==='bite')a0=.5,bend=.12;else if(F.ph==='wait')a0=.62}
  let y=.05,z=14,a=a0;for(let k=0;k<7;k++){const tr=F&&F.ph==='fight'?Math.sin(t*30+k)*.004*k:0;L.push([.24+sx*k+tr,y,z,.04,.12,3,k<2?'#3a2a1a':k===6?'#e8e8e8':'#8a6a42']);y+=Math.cos(a)*.13;z+=Math.sin(a)*3.4;a-=bend}
  rodL2.tip=[.26+sx*7,y,z];return L}
// punto della punta della canna nel mondo
function rodTip(){const tp=rodL2.tip||[.26,.85,34],dr=P.dr||[0,1],d=Math.hypot(dr[0],dr[1])||1,fx=dr[0]/d,fy=dr[1]/d;return[P.px+fy*tp[0]+fx*tp[1],P.py-fx*tp[0]+fy*tp[1],tp[2]]}
// ---- disegno nel mondo: mira, galleggiante, ombre, increspature, salti ----
function fishDraw(){const F=FSH;if(!F||PM!=='fish')return;const now=performance.now();fishPanel(now);const[tx,ty,tz]=rodTip();
  // increspature
  for(const r of F.rip){const k=(now-r.t)/1400;g.strokeStyle=`rgba(230,245,255,${(1-k)*.7})`;g.lineWidth=1.5;for(const o of[0,.35]){const kk=Math.max(0,k-o);if(kk<=0)continue;g.beginPath();g.ellipse(PX(r.x,r.y),PY(r.x,r.y,-3),r.s*kk*40,r.s*kk*20,0,0,6.3);g.stroke()}}
  if(F.ph==='aim'){const d=(F.sea?1.3:.9)+F.pw*(F.sea?3.4:2.4),x=F.sx+F.dx*d,y=F.sy+F.dy*d,good=F.pw>=.62&&F.pw<=.9;
    g.setLineDash([4,5]);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;g.beginPath();for(let i=0;i<=16;i++){const k=i/16,px2=F.sx+F.dx*d*k,py2=F.sy+F.dy*d*k,z=20+Math.sin(k*Math.PI)*36*(.4+F.pw)-k*23;i?g.lineTo(PX(px2,py2),PY(px2,py2,z)):g.moveTo(PX(px2,py2),PY(px2,py2,z))}g.stroke();g.setLineDash([]);
    const p=1+Math.sin(t*8)*.1;g.strokeStyle=good?'rgba(255,215,90,.95)':'rgba(255,255,255,.8)';g.lineWidth=2.5;g.beginPath();g.ellipse(PX(x,y),PY(x,y,-3),18*p,9*p,0,0,6.3);g.stroke();g.beginPath();g.ellipse(PX(x,y),PY(x,y,-3),5,2.5,0,0,6.3);g.stroke();return}
  // ombre dei pesci
  if(F.ph==='wait'||F.ph==='bite'){for(const s of F.sh){const a=(s.al==null?1:s.al)*(s.ch?.5:.32),X=PX(s.x,s.y),Y=PY(s.x,s.y,-4),ang=Math.atan2(PY(0,0,0)-PY(s.vx||F.bx-s.x,s.vy||F.by-s.y,0),PX(s.vx||F.bx-s.x,s.vy||F.by-s.y)-PX(0,0));
      g.save();g.translate(X,Y);g.rotate(-ang);g.globalAlpha=a;if(s.gl){g.shadowColor=s.gl;g.shadowBlur=14}g.fillStyle=s.gl&&s.ch?'#2a2a10':'#0a1a2a';g.beginPath();g.ellipse(0,0,16*s.s,6*s.s,0,0,6.3);g.fill();g.beginPath();g.moveTo(-14*s.s,0);g.lineTo(-24*s.s,-6*s.s);g.lineTo(-24*s.s,6*s.s);g.fill();g.restore()}g.globalAlpha=1}
  let bx=F.bx,by=F.by,bz=-3+Math.sin(t*3)*1;
  if(F.ph==='fly'){const k=F.k;bx=tx+(F.bx-tx)*k;by=ty+(F.by-ty)*k;bz=tz+(-3-tz)*k+Math.sin(k*Math.PI)*46}
  if(F.ph==='wait'&&F.nibT&&now-F.nibT<260)bz=-6;
  if(F.ph==='bite')bz=-9+Math.sin(t*28)*2;
  let fx=bx,fy=by,fz=-6;
  if(F.ph==='fight'){const dr=[F.dx,F.dy],rx=dr[1],ry=-dr[0],off=(F.fp-.5)*3.2,back=(1-F.pr)*.9;fx=F.bx+rx*off+F.dx*back;fy=F.by+ry*off+F.dy*back;F.wfx=fx;F.wfy=fy;bx=fx;by=fy;bz=-8;
    if(F.jt>=0){const j=Math.sin(Math.min(1,F.jt/.9)*Math.PI);fz=-6+j*44}
    if(Math.random()<.25&&cineOK())sparks(fx,fy,1,['#ffffff','#cfe8ff'],30);if(Math.random()<.04)fishRip(fx,fy,.8)}
  if(F.ph==='land'){const k=F.k,sx=F.wfx||F.bx,sy=F.wfy||F.by;fx=sx+(P.px-sx)*k;fy=sy+(P.py-sy)*k;fz=-4+Math.sin(k*Math.PI)*50+k*10}
  // filo
  if(F.ph!=='end'&&F.ph!=='land'){const tense=F.ph==='fight';g.strokeStyle=tense?(F.dw>0?'rgba(255,120,100,.95)':'rgba(255,255,255,.95)'):'rgba(240,240,240,.8)';g.lineWidth=tense?1.4:1;g.beginPath();g.moveTo(PX(tx,ty),PY(tx,ty,tz));
    if(tense)g.lineTo(PX(bx,by),PY(bx,by,F.jt>=0?fz+4:bz+2));else{const mx=(tx+bx)/2,my=(ty+by)/2;g.quadraticCurveTo(PX(mx,my),PY(mx,my,(tz+bz)/2-12),PX(bx,by),PY(bx,by,bz+4))}g.stroke()}
  if(F.ph!=='fight'&&F.ph!=='land'&&F.ph!=='end'){box(bx-.06,by-.06,bz,.12,.12,5,'#e8483a');box(bx-.05,by-.05,bz+5,.1,.1,3,'#ffffff')}
  if(F.ph==='bite'){g.font='bold 30px Georgia,serif';g.textAlign='center';label('!',PX(P.px,P.py),PY(P.px,P.py,74)+Math.sin(t*20)*2,'#ffd84a')}
  // il pesce fuori dall'acqua (salto e arrivo)
  if((F.ph==='fight'&&F.jt>=0)||F.ph==='land'){const f=F.f,ml=F.fm||(F.fm=fishModel(f,Math.min(1.1,.55+Math.log10(1+(F.res?F.res.kg:f.kg[1]))*.2)));const fc=faceOf(F.ph==='land'?P.px-fx:F.dy,F.ph==='land'?P.py-fy:-F.dx);
    drawHero(ml,fx,fy,fz,0,fc)}
  if(F.ph==='fight'&&F.jt<0){g.globalAlpha=.45;g.fillStyle='#0a1a2a';g.beginPath();g.ellipse(PX(fx,fy),PY(fx,fy,-4),18,7,0,0,6.3);g.fill();g.globalAlpha=1}}
// ---- il riquadro della pesca: acqua vista di lato, ombre, lotta e cartolina del pescato ----
function fishPanel(now){const F=FSH,c=$('fcv');if(!c)return;const dp=Math.min(2,window.devicePixelRatio||1),W2=560,H2=150;if(c.width!==W2*dp){c.width=W2*dp;c.height=H2*dp}
  const q=c.getContext('2d');q.setTransform(dp,0,0,dp,0,0);const tt=now/1000;
  const deep=F.ph==='fight'&&F.deep>0,gr=q.createLinearGradient(0,0,0,H2);gr.addColorStop(0,deep?'#0a2236':'#1d6e9a');gr.addColorStop(.35,deep?'#06182a':'#0f4a74');gr.addColorStop(1,deep?'#02060e':'#061a33');
  q.fillStyle=gr;q.fillRect(0,0,W2,H2);
  // raggi di luce e bolle
  q.globalAlpha=.08;q.fillStyle='#cfefff';for(let i=0;i<5;i++){const x=(i*130+tt*12)%(W2+120)-60;q.beginPath();q.moveTo(x,0);q.lineTo(x+40,0);q.lineTo(x+90,H2);q.lineTo(x+60,H2);q.fill()}q.globalAlpha=1;
  q.fillStyle='rgba(220,240,255,.35)';for(let i=0;i<14;i++){const x=(i*41.7)%W2,y=H2-((tt*22+i*37)%H2);q.beginPath();q.arc(x+Math.sin(tt*2+i)*3,y,1.2+(i%3)*.6,0,6.3);q.fill()}
  const SURF=30;
  const sil=(x,y,len,col,dir,al,glc)=>{q.save();q.translate(x,y);q.scale(dir,1);q.globalAlpha=al;if(glc){q.shadowColor=glc;q.shadowBlur=16}q.fillStyle=col;q.beginPath();q.ellipse(0,0,len*.5,len*.2,0,0,6.3);q.fill();
    q.beginPath();q.moveTo(-len*.42,0);q.lineTo(-len*.7,-len*.2+Math.sin(tt*10)*2);q.lineTo(-len*.7,len*.2+Math.sin(tt*10)*2);q.fill();q.beginPath();q.moveTo(-len*.1,-len*.18);q.lineTo(len*.08,-len*.32);q.lineTo(len*.15,-len*.16);q.fill();
    q.fillStyle='rgba(255,255,255,.8)';q.beginPath();q.arc(len*.3,-len*.04,Math.max(1,len*.04),0,6.3);q.fill();q.restore()};
  const surf=()=>{q.fillStyle='rgba(180,225,255,.25)';q.beginPath();q.moveTo(0,0);for(let x=0;x<=W2;x+=10)q.lineTo(x,SURF+Math.sin(x*.05+tt*2)*2.5);q.lineTo(W2,0);q.fill();q.strokeStyle='rgba(230,248,255,.7)';q.lineWidth=1.5;q.beginPath();for(let x=0;x<=W2;x+=10){const y=SURF+Math.sin(x*.05+tt*2)*2.5;x?q.lineTo(x,y):q.moveTo(x,y)}q.stroke()};
  const txt=(s,x,y,sz,col,al)=>{q.font=`${al||'bold'} ${sz}px Georgia,serif`;q.textAlign='center';q.lineWidth=3;q.strokeStyle='rgba(0,0,0,.6)';q.strokeText(s,x,y);q.fillStyle=col;q.fillText(s,x,y)};
  if(F.ph==='aim'){surf();const x0=60,x1=500,y=88;q.fillStyle='rgba(0,0,0,.35)';q.fillRect(x0-4,y-14,x1-x0+8,28);const g2=q.createLinearGradient(x0,0,x1,0);g2.addColorStop(0,'#3a8ad8');g2.addColorStop(.6,'#7ad0ff');g2.addColorStop(1,'#ff6a4a');
    q.fillStyle=g2;q.fillRect(x0,y-10,(x1-x0)*F.pw,20);q.fillStyle='rgba(255,215,90,.35)';q.fillRect(x0+(x1-x0)*.62,y-12,(x1-x0)*.28,24);q.strokeStyle='#ffd84a';q.lineWidth=2;q.strokeRect(x0+(x1-x0)*.62,y-12,(x1-x0)*.28,24);
    q.fillStyle='#ffffff';q.fillRect(x0+(x1-x0)*F.pw-2,y-16,4,32);txt(F.hold?'Rilascia nella zona dorata!':'Tieni premuto per caricare',W2/2,y-24,15,'#ffffff');txt('lancio perfetto',x0+(x1-x0)*.76,y+30,11,'#ffd84a','italic');return}
  if(F.ph==='fly'||F.ph==='wait'||F.ph==='bite'){surf();const bx=W2/2;let by=SURF-2+Math.sin(tt*3)*1.5;if(F.ph==='wait'&&F.nibT&&now-F.nibT<260)by+=5;if(F.ph==='bite')by+=10+Math.sin(tt*30)*2;
    if(F.ph!=='fly'){q.strokeStyle='rgba(255,255,255,.6)';q.lineWidth=1;q.beginPath();q.moveTo(bx,by+8);q.lineTo(bx,108);q.stroke();q.fillStyle='#c8ccd4';q.fillRect(bx-1,106,3,5);
      // ombre: la prescelta si avvicina all'amo
      const chs=F.sh[0];F.sh.forEach((s,i)=>{const ang=i*2.1+tt*(.3+i*.13),r=s.ch&&F.ph==='wait'&&now>F.tw-1600?Math.max(0,(F.tw-now)/1600)*160:s.flee?220:110+i*30;const x=bx+Math.cos(ang)*r,y=70+i*16+Math.sin(ang*1.7)*10;
        sil(x,s.ch&&F.ph==='bite'?108:y,36*s.s,s.gl&&s.ch?'#3a3010':'#04111f',Math.sin(ang)>0?-1:1,(s.al==null?1:s.al)*(s.ch?.85:.55),s.ch?s.gl:'')})}
    q.fillStyle='#e8483a';q.fillRect(bx-5,by,10,8);q.fillStyle='#ffffff';q.fillRect(bx-4,by-5,8,5);
    if(F.ph==='bite'){const a=.5+Math.sin(tt*20)*.5;q.fillStyle=`rgba(255,216,74,${.15*a})`;q.fillRect(0,0,W2,H2);txt('!',bx,92,64,'#ffd84a');txt('FERRA!',bx+120,70,22,'#ffffff')}
    else if(F.ph==='wait'){const ch=F.sh[0];if(ch&&ch.s>1.05)txt(ch.gl===FRC[4]?'Un\'ombra enorme e dorata...':'Un\'ombra grossa si avvicina...',W2/2,138,13,ch.gl||'#cfe8ff','italic')}return}
  if(F.ph==='fight'){const x0=40,x1=470,y0=58,y1=106,w=x1-x0,zw=F.zw*(F.deep>0?.78:1);
    q.fillStyle='rgba(0,10,20,.45)';q.beginPath();q.roundRect(x0-6,y0-6,w+12,y1-y0+12,10);q.fill();const gg=q.createLinearGradient(x0,0,x1,0);gg.addColorStop(0,'rgba(40,120,180,.4)');gg.addColorStop(1,'rgba(20,70,130,.4)');q.fillStyle=gg;q.fillRect(x0,y0,w,y1-y0);
    if(F.dw>0){q.strokeStyle=`rgba(255,80,60,${.5+Math.sin(tt*40)*.5})`;q.lineWidth=3;q.strokeRect(x0-3,y0-3,w+6,y1-y0+6)}
    const zx=x0+(F.zc-zw/2)*w;q.fillStyle=F.inz?'rgba(255,215,90,.38)':'rgba(255,215,90,.18)';q.fillRect(zx,y0,zw*w,y1-y0);q.strokeStyle='#ffd84a';q.lineWidth=2.5;q.strokeRect(zx,y0,zw*w,y1-y0);
    const f=F.f,fx=x0+F.fp*w,jy=F.jt>=0?Math.sin(Math.min(1,F.jt/.9)*Math.PI)*42:0,len=Math.min(70,26+Math.log10(1+f.kg[1])*14);
    sil(fx,(y0+y1)/2-jy,len,F.jt>=0?'#cfe8ff':'#0a1a2a',F.ft>F.fp?1:-1,1,f.r>=3?FRC[f.r]:'');if(F.dw>0)txt('!',fx,y0-8,24,'#ff6a4a');
    // anello dei progressi
    const cx=515,cy=82,R2=28;q.lineWidth=7;q.strokeStyle='rgba(255,255,255,.15)';q.beginPath();q.arc(cx,cy,R2,0,6.3);q.stroke();q.strokeStyle=F.pr>.7?'#5ad65a':F.pr>.35?'#ffd84a':'#ff6a4a';q.beginPath();q.arc(cx,cy,R2,-Math.PI/2,-Math.PI/2+F.pr*6.283);q.stroke();
    txt(Math.round(F.pr*100)+'%',cx,cy+5,14,'#ffffff');txt(f.r>=4?'??? · leggendario':f.r>=3?'???  · grosso':'???',(x0+x1)/2,y0-16,13,f.r>=3?FRC[f.r]:'#cfe8ff','italic');
    txt(F.hold?'▶ recupero':'◀ la corrente tira',(x0+x1)/2,y1+24,12,'#cfe8ff','italic');return}
  // cartolina del pescato
  if((F.ph==='land'||F.ph==='end')&&F.res){const r=F.res,f=r.f,col=FRC[f.r];q.fillStyle='rgba(0,0,0,.35)';q.fillRect(0,0,W2,H2);const cg=q.createRadialGradient(110,80,10,110,80,90);cg.addColorStop(0,col+'88');cg.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=cg;q.fillRect(0,0,220,H2);
    const ml=F.cm||(F.cm=fishModel(f,1)),ppt=Math.min(230/Math.max(.3,f.l),2400/Math.max(2,f.h*(f.sh==="sun"?2.4:1)),440);const og=g;g=q;try{q.setTransform(dp*ppt/32,0,0,dp*ppt/32,110*dp,(96+f.h*ppt/80)*dp);drawHero(ml,0,0,0,0,(Math.floor(tt*1.2))&7)}catch(e){}finally{g=og;q.setTransform(dp,0,0,dp,0,0)}
    q.textAlign='left';q.font='bold 24px Georgia,serif';q.fillStyle=col;q.fillText(f.n,230,48);q.font='italic 14px Georgia,serif';q.fillStyle='#e8f0f8';q.fillText(FRN[f.r]+' · '+fkgS(r.kg)+' · vale '+f.p+'💰',230,72);
    let bx2=230;const badge=(s,c2)=>{q.font='bold 12px Georgia,serif';const w=q.measureText(s).width+16;q.fillStyle=c2;q.beginPath();q.roundRect(bx2,88,w,22,11);q.fill();q.fillStyle='#1a1408';q.fillText(s,bx2+8,103);bx2+=w+8};
    if(r.nw)badge('★ Nuova specie','#ffd84a');if(r.rec)badge('▲ Nuovo record','#7ad0ff');if(f.r>=4)badge('Leggenda dei mari','#ffae2b');
    if(F.ph==='land'&&cineOK()&&Math.random()<.4){q.fillStyle='#ffffff';q.fillRect(Math.random()*W2,Math.random()*H2,2,2)}
    q.font='12px Georgia,serif';q.fillStyle='rgba(230,240,250,.7)';q.fillText('Specie trovate: '+FISHT.filter(x=>P.fish[x.id]>0).length+'/'+FISHT.length,230,134);return}
  surf();txt(F.msg.length>60?F.msg.slice(0,58)+'…':F.msg,W2/2,92,15,'#ffffff','italic')}
(function(){const st=document.createElement('style');st.textContent=`
#pn.fishp{top:auto!important;bottom:calc(14px + env(safe-area-inset-bottom,0px))!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:min(600px,96vw)!important;max-height:70vh;padding:10px 14px 8px;background:linear-gradient(180deg,rgba(10,30,50,.96),rgba(6,16,30,.97));border:2px solid #4aa3d8;border-radius:12px;color:#e8f2fa;box-shadow:0 16px 50px #000b}
#pn.fishp .fhd{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:6px}#pn.fishp .fhd b{font:700 18px Georgia,serif;color:#9adcff}#pn.fishp .fhd span{font:italic 13px Georgia,serif;opacity:.75}
#pn.fishp canvas#fcv{width:100%;aspect-ratio:560/150;display:block;border-radius:8px;border:1px solid #2a5a7a;touch-action:none;cursor:pointer}
#pn.fishp #fmsg{margin:7px 2px;font:15px/1.4 Georgia,serif;min-height:1.4em}
#pn.fishp .fbr{display:flex;gap:6px;flex-wrap:wrap}#pn.fishp .fbr button{margin:0}#pn.fishp #fbt{flex:1;font-weight:700;background:linear-gradient(180deg,#2a6a9a,#1a4a72);border-color:#7ad0ff}
#pn.fishp #fbt.hot{background:linear-gradient(180deg,#e8a020,#b86a10);border-color:#ffd84a;animation:fbHot .25s infinite alternate}@keyframes fbHot{to{transform:scale(1.04)}}
#pn.fishp .fsm{font-size:12px;margin:6px 0 0;opacity:.7}
.fdia{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin:8px 0;max-height:46vh;overflow:auto}
.fde{border:1px solid var(--rc);border-left:4px solid var(--rc);border-radius:6px;padding:5px 8px;display:flex;flex-direction:column;gap:1px;background:#0002}.fde b{color:var(--rc)}.fde small{opacity:.7;font-size:11px}.fde span{font-size:12px}.fde.no{opacity:.55}`;document.head.appendChild(st)})();

/* ================= 7.3: Stefano «il Cavallo Pazzo» e la Puledra — a pesca in mare aperto in cerca dei pesci leggendari ================= */
Object.assign(NPCS,{stefano:{n:'Stefano «il Cavallo Pazzo»',c:'#2a5a8a',hat:'#c0392b',role:'',ln:['IIIIH-HIHIHI! Lo senti il mare? Ti sta chiamando, ragazzo!',
  'Mi chiamano il Cavallo Pazzo da quando inseguii un tonno al galoppo... dentro il mare. Col cavallo. Non chiedere.',
  'Trent\'anni che inseguo il Vecchio Testardo. Mi ha mangiato una canna, un cappello e metà del mio orgoglio!',
  'La Puledra è la barca più veloce del porto. La più rumorosa di sicuro. Come il suo capitano!',
  'I pesci leggendari esistono, eccome! Gli altri ridono. Io pesco. HIIIH!',
  'Il segreto? Guarda le ombre sotto l\'acqua. Se è grossa e dorata... tieniti forte al cappello!'],qs:['ste1','ste2','ste3','ste4','ste5','ste6']}});
Object.assign(QT,{
  ste1:{t:'fish',f:'any',zb:1,n:3,once:1,unl:'ste1',ti:'Il battesimo del mare',tx:'Sali sulla Puledra e pesca tre pesci in mare aperto! Dal molo si prendono le sardine: là fuori, i pesci veri. HIIIH!',g:150,x:120},
  ste2:{t:'fish',f:'re_spada',n:1,once:1,req:'ste1',unl:'ste2',ti:'Il Re della Scogliera',tx:'Alla Scogliera dei Gabbiani nuota il Re Spada: una spada d\'oro lunga come un remo. Prendilo, e ti porto dove nessuno osa andare!',g:900,x:700},
  ste3:{t:'fish',f:'tonno_rosso',n:1,once:1,req:'ste2',unl:'ste3',rod:3,ti:'Il tonno dei tonni',tx:'Sul Banco dei Tonni c\'è un tonno rosso grande come una carrozza. Tira come dieci cavalli! Portalo a bordo e ti regalo la mia canna migliore.',g:1300,x:1000},
  ste4:{t:'fish',f:'murena_abissi',n:1,once:1,req:'ste3',unl:'ste4',ti:'Denti nel buio',tx:'Nella Fossa Profonda l\'acqua è nera come la pece. Lì vive la Murena degli Abissi: gli occhi le brillano viola. Non farti mordere!',g:1500,x:1200},
  ste5:{t:'fish',f:'luna_argento',n:1,once:1,req:'ste4',unl:'ste5',ti:'La luna sotto il mare',tx:'Nella Grotta Marina, quando tutto è buio, nuota la Luna d\'Argento: un pesce tondo che brilla come la luna piena. Mia nonna giurava di averla vista.',g:1800,x:1500},
  ste6:{t:'fish',f:'vecchio_testardo',n:1,once:1,req:'ste5',unl:'ste6',ti:'Il Vecchio Testardo',tx:'È ora. Alla Punta del Naufragio, tra le ossa delle navi, mi aspetta da trent\'anni il Vecchio Testardo. Una cernia enorme, piena dei miei ami. Aiutami a prenderlo, compagno!',g:5000,x:3500}});
const SEAG=[['mare_scogliera','Scogliera dei Gabbiani','Scogli, gabbiani e acqua limpida. Il Re Spada caccia qui.',null],['mare_banco','Banco dei Tonni','Mare aperto, tonni che saltano. Il Tonno Rosso Gigante.','ste2'],
  ['mare_fossa','Fossa Profonda','Acqua nera e fredda. La Murena degli Abissi.','ste3'],['mare_grotta','Grotta Marina','Una grotta che brilla nel buio. La Luna d\'Argento.','ste4'],['mare_naufragio','Punta del Naufragio','Relitti e tempesta. Il Vecchio Testardo.','ste5']];
function seaHTML(e){const onb=Zk.startsWith('mare_');let h='';
  if(!P.rod)h+=`<button onclick="P.rod=1;flt(P,'+🎣','#9adcff');msg('Stefano ti presta una canna da pesca!');save();pn('npc')">🎣 Fatti prestare una canna</button>`;
  h+=`<h4>⛵ ${onb?'Dove andiamo adesso?':'Salpa con la Puledra'}</h4>`;
  for(const[k,n,ds,req]of SEAG){const ok=!req||P.unl[req];if(k===Zk)continue;h+=ok?`<button onclick="seaGo('${k}')">⛵ ${esc(n)} <small class="mu">· ${esc(ds)}</small></button>`:`<button disabled style="opacity:.45">🔒 ${esc(n)} <small class="mu">· prima completa la missione di Stefano</small></button>`}
  if(onb)h+=`<button onclick="seaHome()">⚓ Torna al porto di Aldoria</button>`;
  return h+`<button onclick="pn('fdia')">📖 Diario del pescatore</button>`}
function seaGo(k){if(!P.rod){P.rod=1;msg('Stefano ti presta una canna da pesca!')}cl();const G=SEAG.find(s=>s[0]===k);irisGo(()=>{load(k,Zk);banner('La Puledra salpa!',G?G[1]:'','luna');whoosh()})}
function seaHome(){cl();irisGo(()=>{load('porto','town');P.px=10.5+1;P.py=45.5;P.path=[];camX=PX(P.px,P.py);camY=PY(P.px,P.py,10);msg('Si torna al porto. HIIIH!')})}
// premio speciale della terza missione: la canna di Stefano
const _qTurn73=qTurn;qTurn=function(q){const T=QT[q&&q.id];_qTurn73(q);if(T&&T.rod&&(P.rod||0)<T.rod){P.rod=T.rod;setTimeout(()=>banner('Canna del Cavallo Pazzo','Zona dorata più larga e pesci leggendari più vicini','stella'),1200);save()}};
// ---- il mare: la barca al centro, e attorno il paesaggio di ogni zona ----
let BOATD=new Set(),BOATA=new Set();
const SEAZ={scogliera:{n:'In barca · Scogliera dei Gabbiani',pool:'#2f86c4',bg:'#62a8de',sky:['#3f84d4','#86bce8','#d9eef9']},
  banco:{n:'In barca · Banco dei Tonni',pool:'#2a6ca8',bg:'#4a88c8',sky:['#3a78c8','#7ab2e4','#cfe6f6']},
  fossa:{n:'In barca · Fossa Profonda',pool:'#163e66',bg:'#20384e',sky:['#3a4a64','#6a7a90','#a8b4c0']},
  grotta:{n:'In barca · Grotta Marina',pool:'#0f5a66',bg:'#04080c',cave:1},
  naufragio:{n:'In barca · Punta del Naufragio',pool:'#24486a',bg:'#2a3440',sky:['#2a3240','#4a5464','#7a8494']}};
for(const k in SEAZ){const s=SEAZ[k];Z['mare_'+k]={n:s.n,lv:6,N:40,a:s.pool,b:s.pool,bg:s.bg,pool:s.pool,mus:'pesca',pt:'mote',gen:genSea,dist:1,wl:s.cave?'#2a2a32':'#3a3a44',wh:s.cave?70:6,nolamp:1,sea:1,boat:1,gr:k,rd:['#8a6a42','#7e6040']};if(s.sky)SKY['mare_'+k]=s.sky}
function genSea(o){const{F,N2,FS,n}=o,z=ZZ,gr=z.gr;BOATD=new Set();BOATA=new Set();
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){M[y][x]=2;DEC[y][x]=''}
  if(SEAZ[gr].cave){for(let y=0;y<n;y++)for(let x=0;x<n;x++){const d=Math.min(x,y,n-1-x,n-1-y)+(hh(x*.7,y*.7)*2.2|0);if(d<3){M[y][x]=1}}}
  // la Puledra: scafo, ponte, cabina, albero
  const x0=17,x1=23,y0=12,y1=30;const inB=(x,y)=>{if(y<y0||y>y1)return false;const tp=Math.max(0,y-(y1-3));return x>=x0+tp&&x<=x1-tp};
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inB(x,y)){BOATA.add(y*n+x);const edge=!inB(x-1,y)||!inB(x+1,y)||!inB(x,y-1)||!inB(x,y+1);if(edge){M[y][x]=6;DEC[y][x]='ℜ'}else{M[y][x]=0;DEC[y][x]='';BOATD.add(y*n+x)}}
  for(let y=13;y<=15;y++)for(let x=18;x<=22;x++){M[y][x]=6;DEC[y][x]='ℭ';BOATD.delete(y*n+x)}
  F(20,22,'ℳ');BOATD.delete(22*n+20);
  for(const[x,y,c]of[[18,17,'Ж'],[22,17,'Ж'],[18,26,'Ь'],[22,26,'Щ'],[22,21,'Ф'],[18,21,'Я'],[21,28,'Э']]){F(x,y,c);BOATD.delete(y*n+x)}
  const s=N2('stefano',20,16);s.fc0=faceOf(0,1);
  // posti per pescare lungo le murate
  for(const[x,y,ox,oy]of[[18,19,-1,0],[22,19,1,0],[18,24,-1,0],[22,24,1,0],[20,29,0,1],[20,28,0,1]])if(M[y][x]===0)FS(x,y,ox,oy);
  // paesaggio
  const rk=(x,y,c)=>{if(x>0&&y>0&&x<n-1&&y<n-1&&M[y][x]===2&&!inB(x,y)&&!(x>=15&&x<=25&&y>=10&&y<=32)){M[y][x]=6;DEC[y][x]=c}};
  const cluster=(cx,cy,r,c)=>{for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++)if(Math.hypot(x-cx,y-cy)<=r-hh(x,y)*1.2)rk(x,y,c)};
  if(gr==='scogliera'){cluster(5,6,4,'ℛ');cluster(33,9,3,'ℛ');cluster(7,33,3,'ℛ');cluster(34,32,4,'ℛ');cluster(31,20,2,'ℛ');for(const[x,y]of[[10,20],[28,26],[12,12]])rk(x,y,'ℛ')}
  else if(gr==='banco'){for(const[x,y]of[[8,8],[32,10],[10,30],[30,32],[6,20],[34,22]])if(M[y][x]===2)DEC[y][x]='^'}
  else if(gr==='fossa'){for(const[x,y]of[[9,14],[31,26]])rk(x,y,'ℨ')}
  else if(gr==='grotta'){for(let i=0;i<26;i++){const x=3+Math.floor(hh(i,1)*34),y=3+Math.floor(hh(1,i)*34);rk(x,y,'ℵ')}}
  else if(gr==='naufragio'){cluster(8,9,3,'ℛ');cluster(33,30,3,'ℛ');for(const[x,y]of[[10,24],[11,25],[29,10],[30,11],[31,12],[6,32],[33,6]])rk(x,y,'ℨ')}
  return[20,19]}
// ponte di legno della barca
function deckTile(x,y,h){box(x,y,-6,1,1,6,'#5a3a22',.9);const tn=['#a87e50','#9c7448','#b08654','#946c42'];
  for(let i=0;i<4;i++){const c=tn[(hs(x*13+y*29+i)>>>3)%4];box(x+i*.25+.015,y+.01,-1,.22,.98,1,c,.94+h*.08)}
  if((x+y)%3===0)box(x+.4,y+.45,0,.04,.04,.25,'#3a2a1a')}
// decorazioni del mare e della barca
function decSea(x,y,c,h){switch(c){
  case 'ℜ':{const ob=(a,b)=>!BOATA.has(b*N+a),H0=-14,c1='#23446e',c2='#7a4a28';
    const wallX=(xx)=>{box(xx,y,H0,.16,1,12,c1,.95);box(xx,y,-2.5,.16,1,1.4,'#f0e8d8');box(xx,y,-1.1,.16,1,10,c2,.93);box(xx-.02,y,8.9,.2,1,1.3,'#c89a5a')};
    const wallY=(yy)=>{box(x,yy,H0,1,.16,12,c1,.95);box(x,yy,-2.5,1,.16,1.4,'#f0e8d8');box(x,yy,-1.1,1,.16,10,c2,.93);box(x,yy-.02,8.9,1,.2,1.3,'#c89a5a')};
    if(ob(x-1,y))wallX(x);if(ob(x,y-1))wallY(y);if(ob(x+1,y))wallX(x+.84);if(ob(x,y+1))wallY(y+.84);
    if((x+y)%3===0&&!ob(x,y-1)&&!ob(x,y+1)===false)box(x+.42,y+.42,10,.12,.12,2.5,'#5a3a1e');return true}
  case 'ℭ':{const top=y===13,frt=y===15,lft=x===18,rgt=x===22;box(x,y,0,1,1,24,'#e8e0d0',.92);box(x-.02,y-.02,24,1.04,1.04,2.5,'#c0392b');
    if(frt&&(x===19||x===21))box(x+.2,y+.97,11,.6,.05,7,'#7ad0ff',1.1);if(rgt&&y===14)box(x+.97,y+.2,11,.05,.6,7,'#7ad0ff',1.1);if(frt&&x===20){box(x+.2,y+.97,0,.6,.05,17,'#6a4224');box(x+.45,y+1.02,8,.1,.05,1.4,'#d4af37')}
    if(top&&x===20)box(x+.35,y+.35,26.5,.3,.3,10,'#3a3a3a');return true}
  case 'ℳ':{box(x+.4,y+.4,0,.2,.2,90,'#6a4224');box(x+.1,y+.42,60,.8,.16,1.2,'#5a3a1e');const sw=Math.sin(t*1.4)*.04;box(x-.6+sw,y+.48,26,2.2,.04,34,'#f4ecdc',.98);box(x-.6+sw,y+.47,40,2.2,.05,5,'#c0392b');
    box(x+.35,y+.35,90,.3,.3,3,'#c0392b');box(x+.5,y+.45,93,.5+Math.sin(t*3)*.1,.04,5,'#f2c230');return true}
  case 'ℛ':{const r=.8+h*.6,ht=8+h*26;box(x+.05,y+.05,-8,.9,.9,ht,'#6a6a72',.85+h*.1);box(x+.2,y+.15,-8+ht,.6,.6,4+h*6,'#7a7a82',.9);box(x+.1,y+.1,-8+ht*.3,.8,.8,1.5,'#3a6a3a');
    if(h>.6){box(x+.3,y+.3,-4+ht+(4+h*6),.4,.4,1.6,'#c8b890');box(x+.42,y+.42,-2.4+ht+(4+h*6),.14,.14,1.2,'#f4f4f4')}return true}
  case 'ℨ':{box(x+.1,y+.2,-10,.8,.6,10,'#4a3420',.85);box(x+.15,y+.25,0,.7,.08,6,'#5a4028');if(h>.5){box(x+.45,y+.45,-6,.12,.12,38+h*20,'#4a3a2a');box(x+.2,y+.48,22+h*10,.6,.05,1.2,'#3a2a1a');box(x+.5,y+.46,24,.03,.03,14,'#8a8070')}
    else box(x+.05,y+.3,-4,.9,.4,4,'#3a2a1a');return true}
  case 'ℵ':{const ht=6+h*22;box(x+.1,y+.1,-8,.8,.8,ht,'#4a5a66',.95);box(x+.25,y+.25,-8+ht,.5,.5,5,'#5a6a76');box(x+.3,y+.2,-8+ht*.4,.14,.14,4,'#7affe0',1.7);if(h>.4)box(x+.6,y+.55,-8+ht*.7,.12,.12,3,'#a0d8ff',1.7);if(h>.7)box(x+.15,y+.6,-8+ht+2,.1,.1,4,'#c8a0ff',1.7);return true}}
  return false}
// gabbiani, tonni che saltano, nebbia, lucciole marine, pioggia: un tocco di vita per ogni mare
function seaOverlay(){if(!ZZ||!ZZ.sea)return;const gr=ZZ.gr;
  // scia e schiuma attorno allo scafo
  g.strokeStyle='rgba(240,250,255,.45)';g.lineWidth=1.2;for(let i=0;i<14;i++){const y=12+i*1.4,ph=(t*1.5+i*.7)%1;g.globalAlpha=(1-ph)*.6;for(const[x,dx]of[[16.6,-1],[23.4,1]]){const xx=x+dx*ph*1.2;g.beginPath();g.moveTo(PX(xx,y),PY(xx,y,-3));g.lineTo(PX(xx,y+.6),PY(xx,y+.6,-3));g.stroke()}}g.globalAlpha=1;
  if(gr==='scogliera'||gr==='naufragio'||gr==='banco'){for(let i=0;i<5;i++){const a=t*.4+i*1.26,r=9+i*2,x=20+Math.cos(a)*r,y=20+Math.sin(a)*r*.7,z=60+i*8+Math.sin(t*2+i)*4,fl=Math.sin(t*9+i)*.12;
      box(x-.08,y-.04,z,.16,.08,2,'#f4f4f4');box(x-.28,y-.03,z+1+fl*10,.2,.06,.8,'#e8e8e8');box(x+.08,y-.03,z+1+fl*10,.2,.06,.8,'#e8e8e8')}}
  if(gr==='banco'){const k=(t*.5)%3;if(k<1){const x=8+(Math.floor(t*.5/3)*7)%24,y=6+(Math.floor(t*.5/3)*11)%28,j=Math.sin(k*Math.PI);drawHero(fishModel(FISHI.tonno,.7),x+k*2,y,-6+j*30,0,faceOf(1,0))}}
  g.save();g.setTransform(DPR,0,0,DPR,0,0);
  if(gr==='fossa'){const gd=g.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,H*.75);gd.addColorStop(0,'rgba(10,20,30,0)');gd.addColorStop(1,'rgba(4,10,18,.55)');g.fillStyle=gd;g.fillRect(0,0,W,H);
    g.fillStyle='rgba(200,220,235,.06)';for(let i=0;i<6;i++){const x=((t*14+i*230)%(W+400))-200;g.beginPath();g.ellipse(x,H*(.2+i*.12),260,40,0,0,6.3);g.fill()}}
  if(gr==='grotta'){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,0,W,H);for(let i=0;i<40;i++){const x=(hh(i,3)*W+Math.sin(t*.3+i)*30)%W,y=(hh(3,i)*H+Math.cos(t*.4+i)*20)%H,a=.4+Math.sin(t*2+i)*.4;g.fillStyle=`rgba(120,255,230,${a})`;g.beginPath();g.arc(x,y,1.5+(i%3),0,6.3);g.fill()}}
  if(gr==='naufragio'){g.strokeStyle='rgba(200,215,235,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<70;i++){const x=(hh(i,7)*W+t*240+i*13)%W,y=(hh(7,i)*H+t*520)%H;g.moveTo(x,y);g.lineTo(x-6,y+14)}g.stroke();
    if((t%11)<.12){g.fillStyle='rgba(255,255,255,.25)';g.fillRect(0,0,W,H)}}g.restore()}
// arrivo in mare: musica e piccolo rollio della telecamera
const _ct73=camTarget;camTarget=function(){const r=_ct73();if(ZZ&&ZZ.boat)return[r[0]+Math.sin(t*.9)*.05,r[1]+Math.sin(t*1.3)*.07];return r};
Object.assign(TRK,{pesca:{sng:1,bpm:104,root:62,sc:'maj',spb:12,ld:'flute',lv:.04,echo:1,bs:'shanty',cp:'strum6',dr:'shanty',dv:.55,form:'AABA',parts:{
  A:{ch:[0,3,4,0],m:'4:3 2:3 0:3 2:3  3:3 5:3 7:6  6:3 5:3 4:3 2:3  4:9 r:3'},
  B:{ch:[5,3,0,4],m:'9:3 7:3 5:3 7:3  8:3 7:3 5:6  4:3 5:3 7:3 9:3  8:6 6:6'}}}});

/* ================= 7.3: Gabriele «Ryan il Pelato» e le battaglie — truppe, corsie, ordini e assalti all'accampamento nemico ================= */
Object.assign(NPCS,{ryan:{n:'Gabriele «Ryan il Pelato»',c:'#5a6a4a',hat:'#3a4a2a',role:'',ln:['Gabriele. Ma tutti mi chiamano Ryan il Pelato. Il primo che ride fa cinquanta flessioni!',
  'Una testa lucida riflette il sole negli occhi del nemico. Strategia, soldato!','Le battaglie non si vincono con la forza. Si vincono con gli ordini giusti al momento giusto!',
  'Ho perso i capelli in battaglia. Tutti. In una notte. Non parliamone.','In piedi, soldato! Il regno ha bisogno di comandanti, non di turisti!',
  'Lancieri contro cavalieri, cavalieri contro arcieri, arcieri contro fanti, fanti contro lancieri. Ripetilo finché non lo sogni!'],qs:['ry1','ry2','ry3','ry4','ry5']}});
const BATS={guado:{n:'Il Guado dei Salici',fac:'banditi',fn:'Banditi del Guado',diff:.62,pu:['fanti','arcieri'],eu:['fanti','arcieri'],ab:['carica'],rw:[400,320],ds:'Banditi che assaltano i carri dei mercanti. La battaglia per imparare.'},
  ponte:{n:'Il Ponte di Pietra',fac:'goblin',fn:'Orda dei Goblin',diff:.8,pu:['fanti','arcieri','lancieri'],eu:['fanti','arcieri','lancieri'],ab:['carica','frecce'],rw:[700,560],ds:'Un fiume taglia il campo: si passa solo sui tre ponti.'},
  colle:{n:'Il Colle dei Corvi',fac:'ossa',fn:'Legione delle Ossa',diff:.95,pu:['fanti','arcieri','lancieri','cavalieri'],eu:['fanti','arcieri','lancieri','cavalieri'],ab:['carica','frecce','rinforzi'],rw:[1100,900],ds:'I morti si rialzano tra le tombe. Arrivano i tuoi primi cavalieri.'},
  forte:{n:'L\'assedio del Forte Nero',fac:'nero',fn:'Predoni del Forte Nero',diff:1.1,tw:1.6,pu:['fanti','arcieri','lancieri','cavalieri','catapulta'],eu:['fanti','arcieri','lancieri','cavalieri'],ab:['carica','frecce','rinforzi'],rw:[1600,1300],ds:'Torri robuste e una palizzata. Porta le catapulte!'},
  spade:{n:'La Piana delle Spade',fac:'legione',fn:'Legione Nera',diff:1.2,pu:['fanti','arcieri','lancieri','cavalieri','catapulta'],eu:['fanti','arcieri','lancieri','cavalieri','catapulta'],ab:['carica','frecce','rinforzi'],rw:[3000,2500],gen:1,ds:'La battaglia finale. Il Generale Varg guida la Legione Nera.'}};
Object.assign(QT,{
  ry1:{t:'bat',b:'guado',n:1,once:1,unl:'ry1',ti:'Battesimo del fuoco',tx:'I banditi del Guado dei Salici assaltano i carri dei mercanti. Prendi il comando di una compagnia e cacciali via! Ti porto io sul campo.',g:350,x:300},
  ry2:{t:'bat',b:'ponte',n:1,once:1,req:'ry1',unl:'ry2',ti:'Il Ponte di Pietra',tx:'Un\'orda di goblin vuole passare il fiume. Tieni i tre ponti e distruggi il loro accampamento. Ti affido i lancieri!',g:600,x:500},
  ry3:{t:'bat',b:'colle',n:1,once:1,req:'ry2',unl:'ry3',ti:'Il Colle dei Corvi',tx:'Sul Colle dei Corvi i morti marciano in file ordinate. Nessuno sa chi li comandi. Prendi i cavalieri e falli tornare sotto terra.',g:900,x:800},
  ry4:{t:'bat',b:'forte',n:1,once:1,req:'ry3',unl:'ry4',ti:'L\'assedio del Forte Nero',tx:'I predoni si sono chiusi nel Forte Nero, con torri robuste. Ci vogliono le catapulte. Ne ho fatte costruire due: sono tue.',g:1300,x:1100},
  ry5:{t:'bat',b:'spade',n:1,once:1,req:'ry4',unl:'ry5',it:'h',ti:'La Piana delle Spade',tx:'La Legione Nera del Generale Varg marcia verso Aldoria. È la battaglia della mia vita, soldato. E voglio te al comando.',g:2600,x:2200}});
Z.in_caserma.np.push(['ryan',9,6]);
// tipi di truppa: costo, vita, danno, portata, velocità, ricarica, quanti per squadra
const UT={fanti:{n:'Fanteria',ic:'⚔',c:25,hp:110,at:12,r:1.1,sp:2,cd:1,sq:3,vs:{lancieri:1.5},d:'Robusti, forti contro i lancieri.'},
  lancieri:{n:'Lancieri',ic:'🔱',c:35,hp:120,at:11,r:1.55,sp:1.8,cd:1.1,sq:3,vs:{cavalieri:2.2,gen:1.8},d:'Fermano le cariche: fortissimi contro i cavalieri.'},
  arcieri:{n:'Arcieri',ic:'🏹',c:40,hp:70,at:10,r:5,sp:1.9,cd:1.4,sq:3,rng:1,vs:{fanti:1.5},d:'Tirano da lontano, forti contro la fanteria.'},
  cavalieri:{n:'Cavalieri',ic:'🐎',c:65,hp:200,at:19,r:1.25,sp:3.3,cd:1.2,sq:2,vs:{arcieri:2.2},d:'Veloci e potenti, travolgono gli arcieri.'},
  catapulta:{n:'Catapulta',ic:'🪨',c:100,hp:160,at:42,r:7,sp:1,cd:3.6,sq:1,rng:1,cat:1,vs:{},d:'Lenta, colpisce da lontanissimo: tre volte il danno sulle torri.'}};
const UTK=['fanti','lancieri','arcieri','cavalieri','catapulta'];
const ABL={carica:{n:'Carica!',ic:'📯',cd:35,d:'8 secondi: le tue truppe corrono e colpiscono più forte.'},frecce:{n:'Pioggia di frecce',ic:'🌧',cd:28,d:'Una raffica di frecce sul gruppo nemico più numeroso nella corsia scelta.'},rinforzi:{n:'Rinforzi',ic:'🛡',cd:45,d:'Una squadra di fanti gratis nella corsia scelta.'}};
const FACC={banditi:{tp:'#7a3a2a',lg:'#3a2a1a',hc:'#a83a1a',hk:'bandana',sk:'#e0ac69'},goblin:{tp:'#5a4a2a',lg:'#3a3a1a',hc:'#7a6a3a',hk:'ears',sk:'#6aa04a',s:.86},
  ossa:{tp:'#d8d0b8',lg:'#c8c0a8',hc:'#6a5a4a',hk:'helmet',sk:'#e8e0c8',ey:'#e03a2a'},nero:{tp:'#2a2a30',lg:'#1a1a20',hc:'#1a1a20',hk:'helmet',sk:'#c68642',pl:'#c0392b'},
  legione:{tp:'#3a1a4a',lg:'#1a1020',hc:'#2a1030',hk:'horns',sk:'#d8b090',pl:'#d4af37'},aldoria:{tp:'#2a5aa8',lg:'#33343c',hc:'#a8b0bc',hk:'helmet',sk:SKIN,pl:'#2a5aa8'}};
function warModel(side,ut){const fa=side?FACC[WAR.b.fac]:FACC.aldoria,x=[];const H=(q)=>{for(const b of q)x.push(b)};
  if(fa.hk==='helmet')H(HT.helmet(fa.hc,fa.pl||null));else if(fa.hk==='bandana')H(HT.bandana(fa.hc));else if(fa.hk==='ears')H(HT.ears(fa.sk));else if(fa.hk==='horns')H(HT.horns('#d4af37')),H(HT.helmet(fa.hc));
  if(ut==='cavalieri'){const m=mQuad({c:side?(WAR.b.fac==='ossa'?'#c8c0a8':'#2a2226'):'#8a5a32',mane:side?'#1a1a1a':'#2a1a10',s:1.25});const A=(...b)=>rgAdd(m,'bd',b);
    A(-.3,-.05,12,.08,.16,8,fa.lg);A(.22,-.05,12,.08,.16,8,fa.lg);A(-.2,-.12,18,.4,.26,9,fa.tp);A(-.14,-.1,27,.28,.24,8,fa.sk);A(-.16,-.12,33.5,.32,.28,3.5,fa.hc);A(-.1,.13,30,.06,.01,1.5,'#111');A(.04,.13,30,.06,.01,1.5,'#111');
    A(.2,-.3,22,.05,1.2,1.2,'#8a6a42');A(.19,.9,21.5,.07,.14,2.2,'#c8ccd6');A(.2,.5,23,.02,.25,3,side?'#c0392b':'#2a5aa8');A(-.34,-.12,18,.06,.3,10,side?'#5a2a2a':'#2a5aa8');m.top=44;return m}
  if(ut==='catapulta'){const L=rgNew('cat'),A=(g,...b)=>rgAdd(L,g,b),w=side?'#4a3a2a':'#8a6a42';A('bd',-.35,-.4,3,.7,.8,3,w);for(const[a,b]of[[-.42,-.32],[.32,-.32],[-.42,.22],[.32,.22]])A('bd',a,b,0,.1,.12,5,'#3a2a1a');
    A('bd',-.3,-.05,6,.08,.1,14,w);A('bd',.22,-.05,6,.08,.1,14,w);A('bd',-.3,-.05,19,.6,.1,2,w);A('ar',-.04,-.45,8,.08,.7,2,shx(hx6(w),1.15));A('ar',-.1,-.55,9,.2,.18,3,'#5a4a3a');A('ar',-.07,-.52,11.5,.14,.12,3,'#7a7a82');
    A('bd',-.25,.3,6,.5,.06,2,side?'#c0392b':'#2a5aa8');L.top=26;return rgScale(L,1.1)}
  if(ut==='fanti')H(WP.sword()),H(WP.shield(fa.tp,side?'#c0392b':'#e8d070'));else if(ut==='lancieri')H(WP.spear()),H([['al',-.4,-.06,9,.06,.2,10,shx(hx6(fa.tp),.8)]]);else if(ut==='arcieri')H(WP.bow());
  if(ut==='gen')H(WP.big('#c8a8ff')),H(HT.crown('#d4af37'));
  const m=mHum({s:ut==='gen'?1.45:fa.s||1,sk:fa.sk,tp:fa.tp,lg:fa.lg,ey:fa.ey||'#111',x,rng:ut==='arcieri',belt:shx(hx6(fa.tp),.6)});return m}
// accampamenti e torri
function warBldL(side,big){const c=side?(WAR.b.fac==='ossa'?'#6a6458':'#4a3a3a'):'#8a8a92',fl=side?'#c0392b':'#2a5aa8',L=[];
  if(big){for(const[a,b,w,d]of[[-1.3,-1.3,2.6,.18],[-1.3,1.12,2.6,.18],[-1.3,-1.3,.18,2.6],[1.12,-1.3,.18,2.6]])L.push([a,b,0,w,d,12,'#6a4a2a']);for(let i=0;i<8;i++)L.push([-1.3+i*.36,-1.3,12,.12,.12,3,'#5a3a1a'],[-1.3+i*.36,1.12,12,.12,.12,3,'#5a3a1a']);
    L.push([-.7,-.7,0,1.4,1.4,16,side?'#5a2a2a':'#e8e0d0'],[-.55,-.55,16,1.1,1.1,8,side?'#4a1a1a':'#d8d0c0'],[-.3,-.3,24,.6,.6,6,side?'#3a1010':'#c8c0b0'],[-.05,-.05,0,.1,.1,64,'#5a3a1a'],[.05,-.04,48,.08,.8,16,fl],[.05,-.04,60,.08,.8,2,'#d4af37'],[-.1,.68,0,.2,.04,10,'#2a1a10'])}
  else{L.push([-.4,-.4,0,.8,.8,34,c],[-.46,-.46,34,.92,.92,4,shx(hx6(c),.85)]);for(const[a,b]of[[-.46,-.46],[.3,-.46],[-.46,.3],[.3,.3]])L.push([a,b,38,.16,.16,4,c]);L.push([-.1,.38,12,.2,.04,8,'#1a1a1a'],[0,0,38,.05,.05,18,'#5a3a1a'],[.05,-.02,48,.04,.35,7,fl])}
  return L}
let WAR=null,TRP=[];
const WA=[6.5,35.5],WE=[35.5,6.5];
function lanePts(side,l){const a=side?WE:WA,b=side?WA:WE,m=l===0?[7.5,7.5]:l===2?[34.5,34.5]:null;return m?[a,m,b]:[a,b]}
function warSetup(id){const b=BATS[id];WAR={id,b,t:0,sup:[50,50*b.diff],lane:1,ord:'avanza',sel:'fanti',cd:{},boost:0,ai:2,won:0,over:0,gen:0,kills:[0,0],first:!(P.bat&&P.bat[id])};TRP=[];
  const mk2=(side,big,x,y)=>{const lv=P.lv||1,hp=Math.round((big?4200:1000)*(1+lv*.05)*(side&&!big?(b.tw||1):1)*(side?.85+.3*b.diff:1));
    const e={k:side?'en':'tr',tr:1,bld:1,big,side,id:eid++,t:'trb',n:side?(big?'Accampamento nemico':'Torre nemica'):(big?'Il tuo accampamento':'Torre di Aldoria'),px:x,py:y,hp,mx:hp,at:big?10:16,r:big?4.5:5.5,cd:big?1.6:1.3,cdt:1,rad:big?1.45:.55,m:warBldL(side,big),b:{n:'',np:1,pt:1},fl:0,al:1,ag:0,xp:big?200:60,boss:0,sp:0};ents.push(e);return e};
  WAR.base=[mk2(0,1,WA[0],WA[1]),mk2(1,1,WE[0],WE[1])];
  for(const[x,y]of[[6.5,26.5],[13.5,28.5],[15.5,35.5]]){mk2(0,0,x,y);mk2(1,0,41-x,41-y)}
  for(const s of[0,1])for(const[dx,dy]of[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]){const c=s?WE:WA,x=Math.floor(c[0])+dx,y=Math.floor(c[1])+dy;if(M[y]&&M[y][x]!==1){M[y][x]=6;DEC[y][x]=''}}
  warUI(1);music('guerra');banner(b.n,'Contro: '+b.fn,'spade');setTimeout(()=>{if(WAR&&!WAR.over)msg('Ryan: «Scegli la corsia, poi manda le truppe! Distruggi il loro accampamento!»')},2600)}
function warSpawn(side,ut,lane,free){const W=WAR;if(!W||W.over)return false;const U=UT[ut];if(ents.filter(e=>e.tr&&!e.bld&&e.side===side).length>=30){if(!side)msg('Ryan: «Il campo è pieno, soldato! Aspetta che si liberi.»');return false}if(!free){if(W.sup[side]<U.c)return false;W.sup[side]-=U.c}
  const b=W.b,lv=P.lv||1,hm=(1+lv*.06)*(side?.8+.4*b.diff:1),am=(1+lv*.05)*(side?.8+.3*b.diff:1);const base=side?WE:WA,pts=lanePts(side,lane),d0=pts[1],dd=Math.hypot(d0[0]-base[0],d0[1]-base[1]);
  for(let i=0;i<U.sq;i++){const ox=(d0[0]-base[0])/dd*2.2+(Math.random()-.5)*1.2,oy=(d0[1]-base[1])/dd*2.2+(Math.random()-.5)*1.2,hp=Math.round(U.hp*hm);
    // 7.11: la squadra nasce solo su caselle libere (prima un soldato su cinque della corsia centrale nasceva dentro il recinto dell'accampamento e restava lì per sempre)
    const[sx,sy]=warFree(base[0]+ox,base[1]+oy,(d0[0]-base[0])/dd,(d0[1]-base[1])/dd);
    const e={k:side?'en':'tr',tr:1,side,ut,id:eid++,t:'tr_'+ut,n:(side?'':'')+U.n,px:sx,py:sy,hp,mx:hp,at:U.at*am,r:U.r,sp:U.sp,cd:U.cd,cdt:.5+Math.random()*.5,lane,wp:1,m:warModel(side,ut),b:{n:U.n,np:1},fl:0,al:1,ag:0,xp:8+lv,boss:0,fd:[d0[0]-base[0],d0[1]-base[1]]};
    ents.push(e)}
  if(!side){tone(520,.06,'triangle');if(cineOK())sparks(base[0],base[1],10,['#7ad0ff','#ffffff'],50)}return true}
function warGen(){const W=WAR,b=W.b;const lv=P.lv||1,hp=Math.round(3200*(1+lv*.06)),e={k:'en',tr:1,side:1,ut:'gen',id:eid++,t:'tr_gen',n:'Generale Varg',px:WE[0]-2,py:WE[1]+2,hp,mx:hp,at:26*(1+lv*.05),r:1.6,sp:1.4,cd:1.3,cdt:1,lane:1,wp:1,m:warModel(1,'gen'),b:{n:'Generale Varg',np:1,pt:1},fl:0,al:1,ag:0,xp:600,boss:0};
  ents.push(e);banner('Il Generale Varg scende in campo!','Fermalo prima che raggiunga il tuo accampamento','teschio');shake(.8);tone(70,.6,'sawtooth',.07)}
// ---- il cervello della battaglia ----
function warTick(dt){const W=WAR;if(!W||!ZZ||!ZZ.war||!started)return;W.t+=dt;if(W.over){W.ot=(W.ot||0)+dt;warUI();return}
  const b=W.b;W.sup[0]+=dt*5;W.sup[1]+=dt*5*b.diff;W.boost=Math.max(0,W.boost-dt);for(const k in W.cd)W.cd[k]=Math.max(0,W.cd[k]-dt);
  if(b.gen&&!W.gen&&W.t>90){W.gen=1;warGen()}
  // l'esercito nemico decide
  if((W.ai-=dt)<=0){W.ai=1.4+Math.random()*1.8;const mine={};for(const e of ents)if(e.tr&&!e.bld&&e.side===0)mine[e.ut]=(mine[e.ut]||0)+1;
    const top=Object.keys(mine).sort((a,c)=>mine[c]-mine[a])[0];const ctr={fanti:'arcieri',arcieri:'cavalieri',cavalieri:'lancieri',lancieri:'fanti',catapulta:'cavalieri'};
    let ut=top&&Math.random()<.55?ctr[top]:b.eu[Math.floor(Math.random()*b.eu.length)];if(!b.eu.includes(ut))ut=b.eu[Math.floor(Math.random()*b.eu.length)];
    if(W.sup[1]>=UT[ut].c&&(Math.random()<.75||W.sup[1]>140)){let lane=Math.floor(Math.random()*3);if(Math.random()<.5){const lc=[0,0,0];for(const e of ents)if(e.tr&&!e.bld&&e.side===0)lc[e.lane]++;lane=lc.indexOf(Math.max(...lc))}warSpawn(1,ut,lane)}}
  // squadre, torri e accampamenti
  const units=ents.filter(e=>e.tr),foes=[[],[]];for(const e of units)foes[e.side===0?1:0].push(e);if(P.hp>0)foes[1].push(P);
  for(const e of units){e.fl=Math.max(0,(e.fl||0)-dt);e.cdt-=dt;const U=UT[e.ut]||{},boost=e.side===0&&W.boost>0;
    let tg=null,bd=1e9;const ag=e.bld?e.r:(e.ut==='catapulta'?8:U.rng?6:4.6);
    for(const o of foes[e.side]){if(o.hp<=0)continue;if(e.igT>t&&dist(e,o)-(o.rad||0)>e.r)continue;const d=dist(e,o)-(o.rad||0);if(d<ag&&d<bd){bd=d;tg=o}}
    if(e.ut==='catapulta'){const bl=foes[e.side].filter(o=>o.bld&&dist(e,o)-o.rad<e.r);if(bl.length){tg=bl[0];bd=dist(e,tg)-tg.rad}}
    if(e.bld){if(tg&&e.cdt<=0){e.cdt=e.cd;warShoot(e,tg,'arrow',e.at)}continue}
    const retreat=e.side===0&&W.ord==='ritirata',hold=e.side===0&&W.ord==='difendi';
    if(retreat){const hb=WA;const d=Math.hypot(hb[0]-e.px,hb[1]-e.py);if(d>2.4)warMove(e,hb[0],hb[1],dt,boost);else e.hp=Math.min(e.mx,e.hp+e.mx*.15*dt);continue}
    if(tg){const rr=e.r*(e.ut==='gen'?1:1);if(bd>rr)warMove(e,tg.px,tg.py,dt,boost);else if(e.cdt<=0){e.cdt=e.cd*(boost?.75:1);const dx=tg.px-e.px,dy=tg.py-e.py,dd=Math.hypot(dx,dy)||1;e.atkT=t;e.atkD=[dx/dd,dy/dd];e.fd=e.atkD;
        let dmg=e.at*((U.vs||{})[tg.ut]||1)*(boost?1.5:1)*(.85+Math.random()*.3);if(tg.bld)dmg*=e.ut==='catapulta'?3:.9;
        if(e.ut==='catapulta')warShoot(e,tg,'stone',dmg);else if(U.rng)warShoot(e,tg,'arrow',dmg);else warHit(e,tg,dmg)}continue}
    if(hold){const pts=lanePts(0,e.lane),p=pts[0],q=pts[1],hx=p[0]+(q[0]-p[0])*.35,hy=p[1]+(q[1]-p[1])*.35;if(Math.hypot(hx-e.px,hy-e.py)>1)warMove(e,hx,hy,dt,boost);continue}
    const pts=lanePts(e.side,e.lane);let w=pts[Math.min(e.wp,pts.length-1)];if(Math.hypot(w[0]-e.px,w[1]-e.py)<1.4&&e.wp<pts.length-1){e.wp++;w=pts[e.wp]}warMove(e,w[0],w[1],dt,boost)}
  // separazione: non si ammucchiano
  for(let i=0;i<units.length;i++){const a=units[i];if(a.bld)continue;for(let j=i+1;j<units.length;j++){const c=units[j];if(c.bld)continue;const dx=c.px-a.px,dy=c.py-a.py,d=dx*dx+dy*dy;if(d<.25&&d>1e-6){const k=(.5-Math.sqrt(d))*.5,dd=Math.sqrt(d);mv(a,-dx/dd*k,-dy/dd*k);mv(c,dx/dd*k,dy/dd*k)}}}
  // proiettili
  for(const p of TRP){p.t+=dt;if(p.t>=p.d){p.done=1;if(p.k==='stone'){if(cineOK()){burst(p.x1,p.y1,14,['#6a5a4a','#a89878','#ffffff'],{v:1.4,up:160,gr:400,d:.8,s:3,z:2});shake(.15)}tone(80,.15,'sawtooth',.05);
        for(const o of foes[p.side].slice())if(o.hp>0&&Math.hypot(o.px-p.x1,o.py-p.y1)-(o.rad||0)<1.3)warHit(p.src,o,o===p.tg?p.dmg:p.dmg*.55)}
      else if(p.tg&&p.tg.hp>0&&Math.hypot(p.tg.px-p.x1,p.tg.py-p.y1)-(p.tg.rad||0)<1.2)warHit(p.src,p.tg,p.dmg)}}
  TRP=TRP.filter(p=>!p.done);
  if(W.base[1].hp<=0&&!W.over)warEnd(1);else if(W.base[0].hp<=0&&!W.over)warEnd(0,'Il tuo accampamento è caduto.');
  if(Math.floor(W.t*4)!==Math.floor((W.t-dt)*4))warUI()}
function warMove(e,x,y,dt,boost){const dx=x-e.px,dy=y-e.py,d=Math.hypot(dx,dy);if(d<.05)return;const sp=e.sp*dt*(boost?1.45:1);
  // 7.11: chi si trova dentro una casella bloccata (recinto dell'accampamento, palizzata, acqua) ne esce verso la casella libera più vicina
  if(blk(e.px,e.py)){const[u,v]=nearFree(e.px|0,e.py|0),ex=u+.5-e.px,ey=v+.5-e.py,ed=Math.hypot(ex,ey)||1,s=Math.min(ed,sp);e.px+=ex/ed*s;e.py+=ey/ed*s;e.fd=[ex/ed,ey/ed];e.mvT=t;return}
  // 7.11: davanti a un ostacolo (il recinto, la palizzata del Forte Nero, il fiume del Ponte) la truppa lo aggira seguendo una strada vera
  if(e.wpath&&e.wpath.length&&e.wpt>t&&Math.hypot(e.wgx-x,e.wgy-y)<3){const w=e.wpath[0],wx=w.x+.5-e.px,wy=w.y+.5-e.py,wd=Math.hypot(wx,wy);
    if(wd<.3){e.wpath.shift();if(!e.wpath.length)e.wpath=null}else{const s=Math.min(wd,sp),x0=e.px,y0=e.py;mv(e,wx/wd*s,wy/wd*s);e.fd=[wx/wd,wy/wd];e.mvT=t;if(Math.hypot(e.px-x0,e.py-y0)<s*.2)e.wpath=null}return}
  const s=Math.min(d,sp),x0=e.px,y0=e.py;mv(e,dx/d*s,dy/d*s);e.fd=[dx/d,dy/d];e.mvT=t;
  const mvd=Math.hypot(e.px-x0,e.py-y0);if(mvd<s*.25){e.stk=(e.stk||0)+dt;if(e.stk>.5){e.stk=0;const[gx,gy]=warGoal(x,y),p=path(e.px|0,e.py|0,gx,gy);
      if(p.length){e.wpath=p.slice(0,40);e.wpt=t+8;e.wgx=x;e.wgy=y}else{e.igT=t+3;e.wp=Math.max(1,e.wp)}}}else e.stk=0}
// la casella libera più vicina a un punto, cercando prima lungo la direzione della corsia
function warFree(x,y,dx,dy){if(!blk(x,y))return[x,y];for(let k=.25;k<=5;k+=.25){const u=x+dx*k,v=y+dy*k;if(!blk(u,v))return[u,v]}const[u,v]=nearFree(x|0,y|0);return[u+.5,v+.5]}
// la meta di un percorso deve essere una casella libera (il centro dell'accampamento è recintato)
function warGoal(x,y){const gx=x|0,gy=y|0;if(gx>=0&&gy>=0&&gx<N&&gy<N&&WK(M[gy][gx]))return[gx,gy];return nearFree(gx,gy)}
function warShoot(e,tg,k,dmg){const st=k==='stone';TRP.push({k,x0:e.px,y0:e.py,z0:e.bld?40:st?14:18,x1:tg.px,y1:tg.py,t:0,d:st?1.1:.35+dist(e,tg)*.06,tg,src:e,side:e.side,dmg});if(Math.random()<.4)tone(st?140:900,.04,st?'sawtooth':'triangle',.02)}
function warHit(src,o,d){d=Math.max(1,Math.round(d));if(o===P){hurtP(d);return}if(o.hp<=0)return;o.hp-=d;o.fl=.12;if(SET.dmg&&(src===P||Math.random()<.35))flt(o,d,o.side?'#ffffff':'#ffb0a0');if(o.hp<=0)kill(o)}
// la morte di una truppa (dagli eroi o dalle truppe)
const _kill73=kill;kill=function(e){if(!e||!e.tr){_kill73(e);return}const i=ents.indexOf(e);if(i<0)return;ents.splice(i,1);
  if(cineOK()&&e.m&&!e.bld)ents.push({k:'dead',m:e.m,px:e.px,py:e.py,t0:t,fc:e.m.rg?faceOf(...(e.fd||[0,1])):null});const W=WAR;if(!W)return;
  if(e.bld){if(cineOK()){burst(e.px,e.py,40,['#5a4a3a','#8a7a6a','#ffb040','#ffffff'],{v:2,up:240,gr:380,d:1.4,s:5,z:20});shake(1);pillar&&pillar(e.px,e.py,'255,180,80',1,50)}tone(60,.5,'sawtooth',.08);
    msg(e.side?(e.big?'L\'accampamento nemico crolla!':'Torre nemica distrutta!'):(e.big?'Il tuo accampamento è caduto!':'Hanno distrutto una tua torre!'));if(e.side)gainXP(Math.round(e.xp*DF.x));return}
  W.kills[e.side]++;W.sup[e.side?0:1]+=e.side?3:2;if(e.side===1&&e.ut==='gen'){banner('Il Generale Varg è caduto!','La Legione vacilla','trofeo');slowmo&&slowmo(.4,.8);gainXP(Math.round(e.xp*DF.x))}
  else if(e.side===1&&dist(e,P)<2.2)gainXP(Math.round(e.xp*DF.x*.5))};
function warEnd(win,why){const W=WAR;if(!W||W.over)return;W.over=win?1:-1;W.ot=0;W.ord='avanza';
  if(win){const b=W.b,f=W.first?1:.35,g=Math.round(b.rw[0]*f*(NET.cfg.gm||1)),x=Math.round(b.rw[1]*f);P.bat=P.bat||{};P.bat[W.id]=(P.bat[W.id]||0)+1;P.g+=g;gainXP(Math.round(x*DF.x));goldFly(g);
    for(const q of P.q){const T=QT[q.id];if(T.t==='bat'&&T.b===W.id&&!qReady(q))q.c=1}npcMarks();
    if(cineOK()){slowmo&&slowmo(.35,1.4);shake(1.2);for(let i=0;i<6;i++)setTimeout(()=>{if(WAR)burst(WE[0]+(Math.random()-.5)*3,WE[1]+(Math.random()-.5)*3,24,['#ffd84a','#ffffff','#2a5aa8'],{v:2,up:260,gr:260,d:1.4,s:5,z:40})},i*200)}
    jingle([60,64,67,72,76,79,84],.12,'square');banner('Vittoria!',b.n+' · +'+g+' oro, +'+x+' XP','trofeo')}
  else{tone(90,.6,'sawtooth',.06);banner('Sconfitta',why||'Ritirata!','teschio');P.hp=Math.max(P.hp,Math.round(P.mx*.5))}
  save();warUI(1)}
function warLeave(){cl();const W=WAR;irisGo(()=>{WAR=null;warUI(0);load('in_caserma','town');const r=ents.find(e=>e.nid==='ryan');if(r){P.px=r.px;P.py=r.py+1.2;P.path=[];camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}
  if(W&&W.over===1)setTimeout(()=>msg('Ryan: «Che spettacolo, soldato! Vieni a prendere la tua ricompensa!»'),900)})}
function warGo(id){if(!BATS[id])return;cl();irisGo(()=>{load('bat_'+id,'in_caserma')})}
// ---- il comando: carte delle truppe, corsie, ordini, abilità di Ryan ----
function warCmd(k,a){const W=WAR;if(!W||W.over)return;
  if(k==='u'){if(!W.b.pu.includes(a))return;if(!warSpawn(0,a,W.lane)){tone(150,.1);msg('Rifornimenti insufficienti')}}
  else if(k==='l'){W.lane=a;tone(600,.04,'triangle')}else if(k==='o'){W.ord=a;tone(500,.05,'triangle');msg({avanza:'Ryan: «Avanti, avanti, AVANTI!»',difendi:'Ryan: «Tenete la posizione!»',ritirata:'Ryan: «Ritirata! Tutti all\'accampamento!»'}[a])}
  else if(k==='a'){if(!W.b.ab.includes(a)||W.cd[a]>0)return;W.cd[a]=ABL[a].cd;
    if(a==='carica'){W.boost=8;tone(392,.3,'square',.05);setTimeout(()=>tone(523,.5,'square',.05),300);banner('Carica!','Le tue truppe si lanciano in avanti','spade');if(W.ord==='ritirata')W.ord='avanza'}
    else if(a==='frecce'){const pts=lanePts(0,W.lane);let best=null,bn=0;for(const e of ents)if(e.tr&&e.side===1&&!e.bld){let n=0;for(const o of ents)if(o.tr&&o.side===1&&!o.bld&&dist(e,o)<2.2)n++;if(n>bn){bn=n;best=e}}
      const c=best||{px:(pts[0][0]+pts[pts.length-1][0])/2,py:(pts[0][1]+pts[pts.length-1][1])/2};for(let i=0;i<18;i++){const x=c.px+(Math.random()-.5)*4,y=c.py+(Math.random()-.5)*4;TRP.push({k:'arrow',x0:WA[0],y0:WA[1],z0:80,x1:x,y1:y,t:-Math.random()*.4,d:.9,side:0,src:P,dmg:0,rain:1})}
      setTimeout(()=>{if(!WAR)return;for(const e of ents.slice())if(e.tr&&e.side===1&&!e.bld&&Math.hypot(e.px-c.px,e.py-c.py)<2.4)warHit(P,e,55*(1+(P.lv||1)*.05))},1100);tone(900,.2,'triangle',.03)}
    else if(a==='rinforzi'){warSpawn(0,'fanti',W.lane,1);banner('Rinforzi!','Una squadra di fanti arriva al campo','spade')}}
  warUI(1)}
// riscrive il pannello solo se il contenuto cambia: rifarlo a ogni tick distruggeva i pulsanti mentre venivano cliccati
function setBH(el,h){if(el._h!==h){el._h=h;el.innerHTML=h}}
function warUI(on){let el=$('batui');if(on===0){if(el)el.remove();document.body.classList.remove('batt');return}const W=WAR;if(!W)return;
  if(!el){el=document.createElement('div');el.id='batui';document.body.appendChild(el);el.addEventListener('pointerdown',e=>e.stopPropagation())}document.body.classList.add('batt');
  const b=W.b,hb=s=>Math.max(0,W.base[s].hp/W.base[s].mx*100);const sup=Math.floor(W.sup[0]);
  if(W.over){const ok=W.over===1;setBH(el,`<div class="bt-top"><div class="bt-end ${ok?'win':'lose'}"><b>${ok?'🏆 Vittoria!':'💀 Sconfitta'}</b><span>${ok?'Il nemico è in rotta. Ryan esulta!':'I tuoi soldati si ritirano. Riprova con un\'altra strategia.'}</span><button onclick="warLeave()">Torna in caserma da Ryan</button>${ok?'':`<button onclick="warRetry()">Riprova la battaglia</button>`}</div></div>`);return}
  let h=`<div class="bt-top"><div class="bt-hp"><i style="width:${hb(0)}%"></i><span>Il tuo accampamento</span></div><b>${esc(b.n)}</b><div class="bt-hp en"><i style="width:${hb(1)}%"></i><span>${esc(b.fn)}</span></div></div>`;
  h+=`<div class="bt-bar"><div class="bt-sup">🌾 <b>${sup}</b><small>rifornimenti</small></div><div class="bt-units">`;
  UTK.forEach((k,i)=>{if(!b.pu.includes(k))return;const U=UT[k],can=sup>=U.c;h+=`<button class="bt-u ${can?'':'no'}" title="${esc(U.n+': '+U.d)}" onclick="warCmd('u','${k}')"><em>${i+1}</em><span>${U.ic}</span><b>${U.n}</b><small>${U.c} 🌾 · ×${U.sq}</small></button>`});
  h+=`</div><div class="bt-col"><div class="bt-lanes">${['Alta','Centro','Bassa'].map((n,i)=>`<button class="${W.lane===i?'on':''}" onclick="warCmd('l',${i})">${n}</button>`).join('')}</div><div class="bt-ord">${[['avanza','⚔ Avanza'],['difendi','🛡 Difendi'],['ritirata','↩ Ritirata']].map(([k,n])=>`<button class="${W.ord===k?'on':''}" onclick="warCmd('o','${k}')">${n}</button>`).join('')}</div></div>`;
  h+=`<div class="bt-ab">${b.ab.map((k,i)=>{const A=ABL[k],c=W.cd[k]||0;return`<button class="${c>0?'cd':''}" title="${esc(A.d)}" onclick="warCmd('a','${k}')"><em>${6+i}</em>${A.ic}<small>${c>0?Math.ceil(c)+'s':A.n}</small></button>`}).join('')}<button class="bt-pot" onclick="pot()" title="Pozione">🧪<small>${P.pot}</small></button><button class="bt-x" onclick="warAbandon()" title="Abbandona la battaglia">🏳</button></div></div>`;
  if(W.boost>0)h+=`<div class="bt-boost">📯 CARICA! ${Math.ceil(W.boost)}s</div>`;setBH(el,h)}
function warAbandon(){if(!WAR||WAR.over)return;warEnd(0,'Hai suonato la ritirata.')}
function warRetry(){const id=WAR&&WAR.id;if(!id)return;irisGo(()=>{load('bat_'+id,'in_caserma')})}
addEventListener('keydown',ev=>{if(!WAR||WAR.over||!ZZ||!ZZ.war||PM)return;const tg=ev.target;if(tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'))return;const n=+ev.key;if(n>=1&&n<=5){const k=UTK[n-1];if(WAR.b.pu.includes(k)){ev.preventDefault();ev.stopImmediatePropagation();warCmd('u',k)}}
  else if(n>=6&&n<=8){const k=WAR.b.ab[n-6];if(k){ev.preventDefault();ev.stopImmediatePropagation();warCmd('a',k)}}},true);
// ---- i campi di battaglia ----
for(const id in BATS){const b=BATS[id],dark=id==='colle';Z['bat_'+id]={n:'Battaglia · '+b.n,lv:Math.max(3,(P&&P.lv)||5),N:42,a:dark?'#6a7a52':id==='forte'?'#8a8a5a':'#7aa04a',b:dark?'#64744c':id==='forte'?'#828254':'#74994a',bg:'#86c0ea',mus:'guerra',pt:'mote',gen:genBat,dist:1,wl:'#5a6a3a',wh:10,nolamp:1,war:id,rd:['#a89a7a','#9e9070']};
  SKY['bat_'+id]=dark?['#4a4a5a','#8a8a96','#c8c4c0']:['#3f84d4','#86bce8','#d9eef9']}
function genBat(o){const{D,F,n}=o,id=ZZ.war;
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){M[y][x]=0;DEC[y][x]=''}
  const nearLane=(x,y,m)=>{for(let l=0;l<3;l++){const p=lanePts(0,l);for(let i=0;i<p.length-1;i++){const[a,b]=[p[i],p[i+1]],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy,k=Math.max(0,Math.min(1,((x+.5-a[0])*dx+(y+.5-a[1])*dy)/L2)),qx=a[0]+dx*k,qy=a[1]+dy*k;if(Math.hypot(x+.5-qx,y+.5-qy)<m)return true}}return false};
  const nearBase=(x,y,r)=>Math.hypot(x+.5-WA[0],y+.5-WA[1])<r||Math.hypot(x+.5-WE[0],y+.5-WE[1])<r;
  // strade di terra battuta lungo le corsie
  for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(nearLane(x,y,1.2))M[y][x]=4;
  if(id==='ponte'){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(Math.abs(x-y)<=1){if(nearLane(x,y,1.7)){M[y][x]=4;DEC[y][x]='~'}else{M[y][x]=2;DEC[y][x]=''}}}
  const deco=(c,p,lane)=>{for(let y=2;y<n-2;y++)for(let x=2;x<n-2;x++)if(M[y][x]===0&&!nearLane(x,y,lane||2.6)&&!nearBase(x,y,4.5)&&R()<p)D(x,y,c)};
  if(id==='guado'){deco('r',.07);deco('h',.03);for(let y=18;y<=23;y++)for(let x=2;x<=8;x++)if(M[y][x]===0&&R()<.7){M[y][x]=2}for(let y=2;y<=8;y++)for(let x=18;x<=23;x++)if(M[y][x]===0&&R()<.7)M[y][x]=2}
  else if(id==='ponte'){deco('r',.06);deco('u',.03)}
  else if(id==='colle'){deco('t',.05);deco('u',.04);deco('ℸ',.03)}
  else if(id==='forte'){deco('u',.04);deco('r',.03);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const c=Math.max(Math.abs(x+.5-WE[0]),Math.abs(y+.5-WE[1]));if(c>=5&&c<6&&x>0&&y>0&&x<n-1&&y<n-1&&!nearLane(x,y,1.7)){M[y][x]=6;DEC[y][x]='ℷ'}}}
  else if(id==='spade'){deco('h',.02);deco('ℶ',.02)}
  // bandiere ai lati delle basi
  for(const[x,y,c]of[[3,31,'ℶ'],[10,38,'ℶ'],[38,10,'ℶ'],[31,3,'ℶ']])if(M[y][x]===0)F(x,y,c);
  return[Math.floor(WA[0])+2,Math.floor(WA[1])-2]}
function decWar(x,y,c,h){switch(c){
  case 'ℶ':{const s=x+y<41,fl=s?'#2a5aa8':'#c0392b',wv=Math.sin(t*3+x)*.05;box(x+.45,y+.45,0,.1,.1,40,'#5a3a1a');box(x+.55,y+.48+wv,26,.04,.5,13,fl);box(x+.55,y+.48+wv,26,.04,.5,1.5,'#d4af37');return true}
  case 'ℷ':{for(let i=0;i<3;i++)box(x+.08+i*.3,y+.08+i*.3,0,.24,.24,22+((x*3+y+i)%3)*3,'#5a3a1e');box(x+.1,y+.1,14,.8,.8,1.5,'#3a2a14');return true}
  case 'ℸ':{box(x+.42,y+.42,0,.16,.16,22,'#3a3430');box(x+.2,y+.45,16,.6,.08,1.4,'#3a3430');box(x+.5,y+.2,19,.08,.5,1.2,'#3a3430');if(h>.5){box(x+.2,y+.47,17.4,.1,.08,2,'#111111');box(x+.25,y+.47,19.4,.05,.06,1,'#111111')}return true}}return false}
function warLoad(k){if(ZZ&&ZZ.war){warSetup(ZZ.war)}else if(WAR){WAR=null;TRP=[];warUI(0)}}
// disegno: proiettili, frecce delle torri, corsie evidenziate
function warDraw(){const W=WAR;if(!W||!ZZ||!ZZ.war)return;
  if(!W.over){const pts=lanePts(0,W.lane);g.strokeStyle='rgba(120,190,255,.35)';g.lineWidth=3;g.setLineDash([10,8]);g.beginPath();pts.forEach((p,i)=>{const X=PX(p[0],p[1]),Y=PY(p[0],p[1],0);i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke();g.setLineDash([])}
  for(const p of TRP){if(p.t<0)continue;const k=Math.min(1,p.t/p.d),x=p.x0+(p.x1-p.x0)*k,y=p.y0+(p.y1-p.y0)*k,z=p.z0*(1-k)+Math.sin(k*Math.PI)*(p.k==='stone'?70:p.rain?20:18);
    if(p.k==='stone'){box(x-.09,y-.09,z,.18,.18,5,'#6a6a72');g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(PX(x,y),PY(x,y,0),6,3,0,0,6.3);g.fill()}
    else{const k2=Math.min(1,k+.05),x2=p.x0+(p.x1-p.x0)*k2,y2=p.y0+(p.y1-p.y0)*k2,z2=p.z0*(1-k2)+Math.sin(k2*Math.PI)*(p.rain?20:18);g.strokeStyle=p.side?'#5a3a2a':'#e8e0d0';g.lineWidth=1.6;g.beginPath();g.moveTo(PX(x,y),PY(x,y,z));g.lineTo(PX(x2,y2),PY(x2,y2,z2));g.stroke()}}}
(function(){const st=document.createElement('style');st.textContent=`
body.batt #ruota{display:none!important}
#batui{position:fixed;left:0;right:0;bottom:0;top:0;pointer-events:none;z-index:14;font-family:Georgia,serif;color:#f2ead6}
#batui button{pointer-events:auto;margin:0}
#batui .bt-top{position:absolute;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background:rgba(10,14,24,.82);border:1px solid #c8963a;border-radius:10px;padding:6px 12px;pointer-events:auto}
#batui .bt-top>b{font-size:15px;color:#ffd98a;white-space:nowrap}
#batui .bt-hp{position:relative;width:min(180px,26vw);height:16px;background:#0008;border-radius:8px;overflow:hidden;border:1px solid #4a7ad8}#batui .bt-hp i{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,#2a5aa8,#5a9ae8);transition:width .3s}
#batui .bt-hp.en{border-color:#d84a3a}#batui .bt-hp.en i{background:linear-gradient(90deg,#a82a1a,#e85a4a)}#batui .bt-hp span{position:absolute;inset:0;font-size:11px;line-height:16px;text-align:center;text-shadow:0 1px 2px #000}
#batui .bt-bar{position:absolute;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;gap:10px;align-items:stretch;background:linear-gradient(180deg,rgba(18,22,36,.94),rgba(8,10,20,.95));border:1px solid #c8963a;border-radius:12px;padding:8px 10px;pointer-events:auto;box-shadow:0 12px 40px #000a;max-width:96vw;flex-wrap:wrap;justify-content:center}
#batui .bt-sup{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:64px;font-size:20px}#batui .bt-sup small{font-size:10px;opacity:.7}
#batui .bt-units{display:flex;gap:5px}
#batui .bt-u{position:relative;display:flex;flex-direction:column;align-items:center;gap:1px;width:78px;padding:5px 4px;background:#2a3350;border:1px solid #7a9ad8;border-radius:8px;color:#fff}
#batui .bt-u span{font-size:20px}#batui .bt-u b{font-size:12px}#batui .bt-u small{font-size:10px;opacity:.8}#batui .bt-u em,#batui .bt-ab em{position:absolute;top:2px;left:4px;font:700 10px system-ui;opacity:.6}
#batui .bt-u.no{opacity:.45}#batui .bt-u:hover{background:#3a4a70}
#batui .bt-col{display:flex;flex-direction:column;gap:4px;justify-content:center}#batui .bt-lanes,#batui .bt-ord{display:flex;gap:3px}
#batui .bt-lanes button,#batui .bt-ord button{font-size:12px;padding:4px 8px;background:#1e2438;border:1px solid #4a5a7a;border-radius:6px;color:#dde}#batui .bt-lanes button.on{background:#2a5aa8;border-color:#9ad0ff;color:#fff}#batui .bt-ord button.on{background:#8a6a1a;border-color:#ffd98a;color:#fff}
#batui .bt-ab{display:flex;gap:5px;align-items:center}#batui .bt-ab button{position:relative;display:flex;flex-direction:column;align-items:center;width:62px;padding:5px 2px;font-size:20px;background:#3a2a1a;border:1px solid #d8a040;border-radius:8px;color:#fff}#batui .bt-ab button small{font-size:10px}
#batui .bt-ab button.cd{opacity:.45;filter:grayscale(.7)}#batui .bt-ab .bt-x{width:40px;background:#3a1a1a;border-color:#a84a3a}#batui .bt-ab .bt-pot{width:44px;background:#1a3a2a;border-color:#4ad66a}
#batui .bt-boost{position:absolute;top:60px;left:50%;transform:translateX(-50%);font:700 20px Georgia,serif;color:#ffd84a;text-shadow:0 2px 8px #000;animation:btB .4s infinite alternate}@keyframes btB{to{transform:translateX(-50%) scale(1.08)}}
#batui .bt-end{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 16px}#batui .bt-end b{font-size:28px}#batui .bt-end.win b{color:#ffd84a}#batui .bt-end.lose b{color:#ff7a6a}#batui .bt-end span{font-size:14px;opacity:.85}
@media (max-width:700px){#batui .bt-u{width:62px}#batui .bt-u b{font-size:10px}#batui .bt-hp{width:24vw}}`;document.head.appendChild(st)})();
function warHTML(e){const done=P.bat||{};let h='<h4>⚔ Sul campo di battaglia</h4>';
  for(const id in BATS){const b=BATS[id],qi=Object.keys(QT).find(k=>QT[k].t==='bat'&&QT[k].b===id),T=QT[qi],ok=!T.req||P.unl[T.req]||done[id],act=P.q.some(q=>q.id===qi);
    h+=ok?`<button onclick="warGo('${id}')">⚔ ${esc(b.n)} <small class="mu">· ${esc(b.ds)}${done[id]?' · vinta '+done[id]+'×':act?' · missione attiva':''}</small></button>`:`<button disabled style="opacity:.45">🔒 ${esc(b.n)} <small class="mu">· prima vinci la battaglia precedente</small></button>`}
  return h+'<p class="mu" style="margin:4px 8px">Ripetere una battaglia già vinta paga meno, ma è un ottimo allenamento.</p>'}
// premio della battaglia finale: l'elmo di Ryan
const _qTurn73b=qTurn;qTurn=function(q){const T=QT[q&&q.id];_qTurn73b(q);if(T&&T.it==='h'){const it=item((P.lv||1)+4,3,'h');it.n='Elmo del Pelato';if(P.inv.length<INV)P.inv.push(it);else ents.push({k:'dr',px:P.px,py:P.py,it});banner('Elmo del Pelato','Ryan ti regala il suo elmo. «Tanto a me non serve: lo porto lucido!»','corona');save()}};
// musica di guerra
Object.assign(TRK,{guerra:{sng:1,bpm:132,root:55,sc:'min',ld:'brass',lv:.042,bs:'gallop',bv:.1,cp:'stab',dr:'march',dv:1,fill:1,form:'AABA',parts:{
  A:{ch:[0,5,3,4],m:'0:4 0:2 2:2 3:4 4:4  5:6 4:2 3:4 2:4  3:4 3:2 4:2 5:4 7:4  6:8 4:8'},
  B:{ch:[5,6,4,4],m:'7:4 8:4 9:4 7:4  10:6 9:2 8:8  7:4 5:4 4:4 3:4  4:8 r:8'}}}});

const _wl73=worldLoad;worldLoad=function(k){_wl73(k);warLoad(k)};
const _die73=die;die=function(){if(WAR&&ZZ&&ZZ.war&&!DF.pm&&!WAR.over){P.hp=1;warEnd(0,'Sei stato ferito: i tuoi soldati ti portano al sicuro.');return}_die73()};

/* ================= 7.3: Manuel, il più scontroso della Taverna del Drago Ubriaco ================= */
Object.assign(NPCS,{manuel:{n:'Manuel',c:'#6a4a3a',hat:'#3a2a1a',ln:['Che vuoi?','Ancora tu? Non ti basta il resto della taverna?','Se sei venuto a chiacchierare, la porta è là.','Mmh. Parla, ma sbrigati.','Non ho tempo. Ho una birra da finire e un muso da tenere.','Hai la faccia di uno che fa domande. Odio quelli che fanno domande.']}});
const MANQ=[['Buongiorno, Manuel!',['Buongiorno un corno.','Era buono finché non sei arrivato tu.','Il giorno è buono solo quando finisce.']],
  ['Come stai?',['Male. Come ieri. Come domani.','Stavo meglio cinque minuti fa, prima della tua domanda.','Ho mal di schiena, mal di testa e mal di te.']],
  ['Che lavoro fai?',['Il bevitore. A tempo pieno. Con gli straordinari.','Facevo il carpentiere. Poi ho capito che la gente è più storta del legno.','Lavoravo. Poi mi sono stancato. Fine della storia.']],
  ['Perché sei sempre arrabbiato?',['Non sono arrabbiato! SONO ESATTAMENTE COME DEVO ESSERE!','Perché la gente fa domande come questa.','Vuoi davvero saperlo? No. Infatti non te lo dico.']],
  ['Hai qualche consiglio per me?',['Sì: lasciami in pace.','Non fidarti di nessuno. Specialmente di quelli che fanno domande.','Bevi meno latte. E parla meno con me.']],
  ['Conosci qualche segreto di Aldoria?',['L\'unico segreto è come faccio a sopportarvi tutti.','Sì. E me lo tengo.','Il segreto è stare zitti. Provaci.']],
  ['Bella giornata, eh?',['Per te, forse.','Il sole mi dà fastidio. La pioggia pure. Anche tu.','Sì. Bellissima. Adesso rovinala andandotene.']],
  ['Ti offro da bere! (5💰)',null]];
const MAN={i:-1,n:0,dr:0,ans:''};
function manAsk(i){const now=Date.now();if(now-(MAN.lt||0)>60000)MAN.n=0;MAN.lt=now;MAN.n++;MAN.i=i;
  if(MAN.n>6&&MANQ[i][1]&&Math.random()<.6){MAN.ans=['BASTA! Mi fai venire il mal di testa!','Ancora?! Ti pago io per stare zitto!','Ma tu non hai una casa? Un lavoro? Un drago da uccidere? VAI!'][Math.floor(Math.random()*3)];tone(110,.2,'sawtooth',.05)}
  else if(MANQ[i][1])MAN.ans=MANQ[i][1][Math.floor(Math.random()*3)];
  else{if(!pay(5)){MAN.ans='Non hai neanche cinque monete? E vuoi offrire da bere a me? Ah!'}else{MAN.dr++;const e=ents.find(x=>x.nid==='manuel');if(e)flt(e,'🍺','#ffd84a');
    MAN.ans=MAN.dr>=5&&!MAN.tip?(MAN.tip=1,'... Va bene. Una cosa te la dico. Al porto c\'è uno matto come un cavallo, Stefano. Dicono che sappia dove nuotano i pesci d\'oro. E in caserma c\'è un pelato che cerca gente per le sue battaglie. Ecco. Non ti ho detto niente. E ora sparisci.'):['... Grazie. Non abituarti.','Lo bevo. Ma resto arrabbiato.','Hmpf. Almeno qualcuno qui ha un po\' di buon senso. Comunque vattene.','Questa birra è calda. Come sempre. Come tutto, qui.'][Math.floor(Math.random()*4)]}}
  pn('npc')}
function manBye(){const e=ents.find(x=>x.nid==='manuel');if(e)flt(e,['Era ora!','Finalmente!','Non tornare!','Hmpf.'][Math.floor(Math.random()*4)],'#ff8a7a');cl()}
function manuelHTML(e){const d=NPCS.manuel;const line=MAN.i>=0&&MAN.ans?MAN.ans:d.ln[Math.floor(Math.random()*d.ln.length)];MAN.i=-1;
  let h=`<h3>${esc(e.n)}</h3><p><i>«${esc(line)}»</i></p>`;MANQ.forEach((q,i)=>{h+=`<button onclick="manAsk(${i})">${esc(q[0])}</button>`});
  return h+'<button onclick="manBye()">Arrivederci</button>'}
// dialoghi: Manuel ha il suo, Stefano e Ryan aggiungono i loro viaggi
const _npcHTML73=npcHTML;npcHTML=function(e){if(e&&e.nid==='manuel'&&!e.slp)return dlgWrap(e,manuelHTML(e));let h=_npcHTML73(e);
  const ex=e&&!e.slp?(e.nid==='stefano'?seaHTML(e):e.nid==='ryan'&&typeof warHTML==='function'?warHTML(e):''):'';
  if(ex){const k=h.lastIndexOf('<button onclick="cl()">Arrivederci</button>');if(k>=0)h=h.slice(0,k)+ex+h.slice(k);else h+=ex}return h};
Z.in_tavern.np.push(['manuel',8,10]);
Object.assign(DROLE,{});
// sulla mappa: il mare di Stefano e i campi di battaglia di Ryan
const MNAME={mare_:'Il mare di Stefano',bat_:'Campi di battaglia'};
Object.assign(MNODE,{mare_:[.98,1.02],bat_:[.6,-1.02]});
ZB.push({k:'mare_',nm:'Il mare di Stefano',ic:'⛵',how:'Parla con Stefano «il Cavallo Pazzo» sul molo ovest del Porto: ti porta con la Puledra.',tx:'Cinque mari, ognuno con i suoi pesci e una leggenda da pescare: la Scogliera dei Gabbiani, il Banco dei Tonni, la Fossa Profonda, la Grotta Marina e la Punta del Naufragio.',f:['Pesci del mare aperto, più grossi e rari','Cinque pesci leggendari','Il Diario del pescatore con i tuoi record']},
  {k:'bat_',nm:'Campi di battaglia',ic:'⚔',how:'Parla con Gabriele «Ryan il Pelato» nella Caserma della Guardia.',tx:'Cinque battaglie in cui comandi un esercito: scegli le truppe, la corsia e gli ordini, e distruggi l\'accampamento nemico.',f:['Fanti, lancieri, arcieri, cavalieri e catapulte','Torri da abbattere e un accampamento da difendere','Le abilità di Ryan: Carica, Pioggia di frecce, Rinforzi']});

// arredi degli interni: stessi simboli dei dungeon, disegno diverso
const DUP52='1234567890!%?<>';
function decInt52(x,y,c,h){switch(c){
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
  case '?':box(x+.3,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.64,y+.45,0,.06,.1,24,'#7a5a3a');box(x+.25,y+.42,10,.5,.06,18,'#f4f0e8');box(x+.3,y+.4,14,.2,.04,6,['#3a8ad8','#e8484f','#4cd07a','#ffd84a'][(x*3+y)%4]);box(x+.5,y+.4,18,.15,.04,5,'#c86ae8');break;
  case '<':box(x+.05,y+.25,0,.9,.5,32,'#6a4a2a');box(x+.48,y+.74,4,.04,.02,26,'#3a2a1a');box(x+.38,y+.75,16,.06,.02,4,'#d4af37');box(x+.56,y+.75,16,.06,.02,4,'#d4af37');break;
  case '>':box(x+.05,y+.15,0,.9,.7,9,'#e8e4dc');box(x+.12,y+.22,6,.76,.56,3,'#8ac8e8');box(x+.08,y+.75,3,.1,.05,3,'#b8963a');break;
  default:return false}return true}
function npcUnstick(){for(const e of ents){if(e.k!=='npc'||e.wg)continue;const x=e.px|0,y=e.py|0;if(x<0||y<0||x>=N||y>=N||WK(M[y][x]))continue;const q=nearFree(x,y);if(q&&WK(M[q[1]][q[0]])){e.px=q[0]+.5;e.py=q[1]+.5}}}
function fishBack(){return!!(FSPOT&&P&&ents.includes(FSPOT)&&Math.hypot(P.px-FSPOT.px,P.py-FSPOT.py)<1.5)}
(function(){const st=document.createElement('style');const sel=':root[data-theme=light] ';st.textContent=`
${sel}[style*="color:#c8ccd4"]{color:#4a505e!important}${sel}[style*="color:#ffae2b"]{color:#b86e00!important}
@media(prefers-color-scheme:light){:root:not([data-theme=dark]) [style*="color:#c8ccd4"]{color:#4a505e!important}:root:not([data-theme=dark]) [style*="color:#ffae2b"]{color:#b86e00!important}}
@media (max-width:700px){#batui .bt-top{top:calc(100px + env(safe-area-inset-top,0px))!important;max-width:94vw}#batui .bt-top>b{display:none}#batui .bt-bar{padding:6px}}`;document.head.appendChild(st)})();
function enMove(e,tp,d,dt){const s=e.sp*dt;
  if(e.ep&&e.ep.length&&e.ept>t){const w=e.ep[0],dx=w.x+.5-e.px,dy=w.y+.5-e.py,dd=Math.hypot(dx,dy);if(dd<.25)e.ep.shift();else mv(e,dx/dd*Math.min(s,dd),dy/dd*Math.min(s,dd));if(Math.hypot(tp.px-e.px,tp.py-e.py)<1.2)e.ep=null;return}
  const x0=e.px,y0=e.py;mv(e,(tp.px-e.px)/d*s,(tp.py-e.py)/d*s);
  if(Math.hypot(e.px-x0,e.py-y0)<s*.55){e.stk=(e.stk||0)+dt;if(e.stk>.3&&!(e.epw>t)){e.stk=0;e.epw=t+.8;const tx=tp.px|0,ty=tp.py|0;if(tx>=0&&ty>=0&&tx<N&&ty<N&&WK(M[ty][tx])){const p=path(e.px|0,e.py|0,tx,ty);if(p.length){e.ep=p.slice(0,24);e.ept=t+9}}}}else e.stk=0}
const _ct731=camTarget;camTarget=function(){const r=_ct731();if(document.body.classList.contains('dlgo')){const d=110/(32*Math.max(.6,S||1));return[r[0]+d,r[1]+d]}return r};
function pathTo(gx,gy){const ok=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&WK(M[y][x]);if(ok(gx,gy))return path(P.px|0,P.py|0,gx,gy);
  const C=[];for(let r=1;r<=4;r++){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=gx+dx,y=gy+dy;if(ok(x,y))C.push([Math.hypot(dx,dy)+Math.hypot(x-P.px,y-P.py)*.05,x,y])}if(C.length)break}
  C.sort((a,b)=>a[0]-b[0]);for(const c of C.slice(0,6)){const p=path(P.px|0,P.py|0,c[1],c[2]);if(p.length||((P.px|0)===c[1]&&(P.py|0)===c[2]))return p}return[]}
// ordine di disegno isometrico: per ogni coppia di pezzi che si sovrappongono sullo schermo, quello separato "dietro" lungo un asse va prima
function isoOrder(R,odd){const n=R.length;if(n<2)return R;const K2=Math.SQRT2,e=.002,bb=new Array(n),key=new Float64Array(n);
  for(let i=0;i<n;i++){const b=R[i],x0=b[0],x1=b[0]+b[3],y0=b[1],y1=b[1]+b[4],z0=b[2],z1=b[2]+b[5];
    bb[i]=odd?[x0,x1,y0,y1,z0,z1,-K2*y1*32,-K2*y0*32,K2*x0*16-z1,K2*x1*16-z0]:[x0,x1,y0,y1,z0,z1,(x0-y1)*32,(x1-y0)*32,(x0+y0)*16-z1,(x1+y1)*16-z0];
    key[i]=odd?(x0+x1)*8+(z0+z1)*.01:(x0+x1+y0+y1)*4+(z0+z1)*.01}
  const out=[],adj=Array.from({length:n},()=>[]),deg=new Int32Array(n);
  for(let i=0;i<n;i++){const a=bb[i];for(let j=i+1;j<n;j++){const c=bb[j];if(a[7]<=c[6]+e||c[7]<=a[6]+e||a[9]<=c[8]+e||c[9]<=a[8]+e)continue;let o=0;
    if(a[1]<=c[0]+e)o=-1;else if(c[1]<=a[0]+e)o=1;else if(!odd&&a[3]<=c[2]+e)o=-1;else if(!odd&&c[3]<=a[2]+e)o=1;else if(a[5]<=c[4]+e)o=-1;else if(c[5]<=a[4]+e)o=1;
    else{const E2=.02,ins=(A,B)=>A[0]>=B[0]-E2&&A[1]<=B[1]+E2&&A[2]>=B[2]-E2&&A[3]<=B[3]+E2&&A[4]>=B[4]-.5&&A[5]<=B[5]+.5;
      if(ins(c,a))o=1;else if(ins(a,c))o=-1;else{// pezzi che si compenetrano: decide l'asse in cui si toccano di meno
      const px=Math.min(a[1],c[1])-Math.max(a[0],c[0]),py=odd?1e9:Math.min(a[3],c[3])-Math.max(a[2],c[2]),pz=(Math.min(a[5],c[5])-Math.max(a[4],c[4]))/32;
      if(px<=py&&px<=pz)o=(a[0]+a[1])<(c[0]+c[1])?-1:1;else if(py<=pz)o=(a[2]+a[3])<(c[2]+c[3])?-1:1;else o=(a[4]+a[5])<(c[4]+c[5])?-1:1}}
    if(o<0){adj[i].push(j);deg[j]++}else if(o>0){adj[j].push(i);deg[i]++}}}
  const done=new Uint8Array(n);for(let k=0;k<n;k++){let best=-1;for(let i=0;i<n;i++)if(!done[i]&&deg[i]===0&&(best<0||key[i]<key[best]))best=i;
    if(best<0)for(let i=0;i<n;i++)if(!done[i]&&(best<0||key[i]<key[best]))best=i;done[best]=1;out.push(R[best]);for(const j of adj[best])deg[j]--}
  return out}
let LFP=0;
function heroPut(x,y){P.px=x+.5;P.py=y+.5;P.path=[];P.tg=null;camX=PX(P.px,P.py);camY=PY(P.px,P.py,10)}
function heroFix(from){if(!P||!M||!M.length)return;
  // 7.41.1: uscendo dal portale dopo il boss (from = ultimo piano, es. «tana@2») non c'è una porta che porti proprio lì:
  // si arriva accanto all'ingresso dello stesso dungeon, come quando si esce dal primo piano
  if(from&&!LFP){let ps=ents.filter(e=>e.k==='po'&&e.to===from);const fb=String(from).split('@');if(!ps.length&&fb.length>1)ps=ents.filter(e=>e.k==='po'&&typeof e.to==='string'&&e.to.split('@')[0]===fb[0]&&e.to.includes('@'));if(ps.length){const p=ps.reduce((a,b)=>dist(P,b)<dist(P,a)?b:a);const[x,y]=nearFree(p.px|0,p.py|0);if(WK(M[y][x])){heroPut(x,y);LFP=1}}}
  const x=P.px|0,y=P.py|0;if(!(M[y]&&WK(M[y][x]))){const q=nearFree(x,y);if(WK(M[q[1]][q[0]]))heroPut(q[0],q[1]);else for(let r=1;r<N;r++){let ok=0;for(let v=y-r;v<=y+r&&!ok;v++)for(let u=x-r;u<=x+r&&!ok;u++)if(u>0&&v>0&&u<N-1&&v<N-1&&WK(M[v][u])){heroPut(u,v);ok=1}if(ok)break}}}
function poFade(e){if(e.k!=='po'||!P||!(e.st==='up'||e.st==='down'||e.st==='tap'))return 1;const d=(e.px+e.py)-(P.px+P.py);if(d<=0)return 1;const k=Math.abs((e.px-e.py)-(P.px-P.py));return k<1.6&&d<2.6?.38:1}
/* ================= 7.5: VOXELIA STUDIO — il Parco giochi diventa un editor di mondi =================
   Un mondo è fatto di mappe (terreno, muri, acqua, decorazioni, edifici e oggetti), personaggi con dialoghi a scelte,
   missioni, oggetti e armi, musiche scritte nota per nota, cinematiche, variabili e trigger. Si costruisce con gli
   asset del gioco e si gioca come la storia: stesso eroe, stesso combattimento, stesse animazioni.
   Questo blocco: cataloghi, salvataggio dei mondi, mappe trasformate in zone del gioco e il loro disegno. */
let EDIT=0,EW=null,EM=null,EDSP=null,EDPLAY=null;
const EDIX='voxelia_ed_idx',EDWK='voxelia_ed_w_',EDSK='voxelia_ed_s_';
const edUid=p=>(p||'')+Math.random().toString(36).slice(2,8);
const edClone=o=>JSON.parse(JSON.stringify(o));
/* ---- codifica dei livelli di una mappa: un carattere per casella, le serie lunghe compresse (~n~c) ---- */
// 7.6: oltre i 62 caratteri di base, lettere accentate e greche (servono per i terreni e i muri dei luoghi del gioco)
const B62='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'+'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ'+'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';
function rleE(a){let s='',i=0;while(i<a.length){const v=a[i];let n=1;while(i+n<a.length&&a[i+n]===v)n++;const c=B62[v]||'0';s+=n>3?'~'+n+'~'+c:c.repeat(n);i+=n}return s}
function rleD(s,n,d=0){const a=new Array(n).fill(d);if(typeof s!=='string')return a;let i=0,k=0;
  while(k<s.length&&i<n){if(s[k]==='~'){const j=s.indexOf('~',k+1);if(j<0)break;const c=+s.slice(k+1,j)||0,v=Math.max(0,B62.indexOf(s[j+1]));for(let q=0;q<c&&i<n;q++)a[i++]=v;k=j+2}else{a[i++]=Math.max(0,B62.indexOf(s[k]));k++}}return a}

/* ---- pavimenti: due tinte a scacchiera, un dettaglio disegnato una volta nella cache del pavimento ---- */
// road: le strade (gli abitanti a passeggio le preferiscono) · pier: pontile di legno sull'acqua
const EMAT=[
  {id:'erba',n:'Erba',a:'#7d9a5b',b:'#76925a',v:.16,d:'tuft',k:'Natura'},
  {id:'erba2',n:'Erba di bosco',a:'#4f8a3c',b:'#478034',v:.18,d:'tuft2',k:'Natura'},
  {id:'fiori',n:'Prato fiorito',a:'#7fa05e',b:'#78985a',v:.14,d:'flow',k:'Natura'},
  {id:'secca',n:'Erba secca',a:'#b8a864',b:'#b0a05c',v:.14,d:'tuft3',k:'Natura'},
  {id:'terra',n:'Terra',a:'#8a6a46',b:'#826440',v:.14,d:'peb',k:'Natura'},
  {id:'sabbia',n:'Sabbia',a:'#d9b56b',b:'#cfab62',v:.12,d:'ripple',k:'Natura'},
  {id:'neve',n:'Neve',a:'#e6edf4',b:'#dbe4ee',v:.1,d:'spark',k:'Natura'},
  {id:'ghiaccio',n:'Ghiaccio',a:'#a8c8e0',b:'#9cbcd6',v:.12,d:'shine',k:'Natura'},
  {id:'fango',n:'Fango',a:'#5e5236',b:'#574b31',v:.12,d:'peb',k:'Natura'},
  {id:'roccia',n:'Roccia di grotta',a:'#6b5a48',b:'#635342',v:.16,d:'peb',k:'Grotte'},
  {id:'cripta',n:'Pietra di cripta',a:'#5b5f6e',b:'#53576a',v:.14,d:'crack',k:'Grotte'},
  {id:'vuoto',n:'Pavimento del Vuoto',a:'#3a2f4f',b:'#342a48',v:.14,d:'rune',k:'Grotte'},
  {id:'cristallo',n:'Cristallo',a:'#8fb8d8',b:'#86aed0',v:.12,d:'glint',k:'Grotte'},
  {id:'lava',n:'Roccia lavica',a:'#3a2622',b:'#34221e',v:.1,d:'ember',k:'Grotte'},
  {id:'strada',n:'Lastricato',a:'#a89a84',b:'#9e917c',v:.12,road:1,k:'Strade'},
  {id:'ciottoli',n:'Ciottoli',a:'#8e8a84',b:'#86827c',v:.12,road:1,d:'cobble',k:'Strade'},
  {id:'sentiero',n:'Sentiero',a:'#a08260',b:'#987a5a',v:.14,road:1,d:'peb',k:'Strade'},
  {id:'mattoni',n:'Mattoni',a:'#9a5a46',b:'#8e5240',v:.1,road:1,d:'brick',k:'Strade'},
  {id:'pontile',n:'Pontile di legno',a:'#9a7448',b:'#8e6a40',v:.1,road:1,pier:1,k:'Strade'},
  {id:'legno',n:'Assi di legno',a:'#9a7a52',b:'#92744e',v:.1,d:'plank',k:'Interni'},
  {id:'parquet',n:'Parquet scuro',a:'#6a4a2e',b:'#62442a',v:.1,d:'plank',k:'Interni'},
  {id:'marmo',n:'Marmo',a:'#d8d4c8',b:'#ccc8bc',v:.08,d:'vein',k:'Interni'},
  {id:'scacchi',n:'Piastrelle a scacchi',a:'#e8e4d8',b:'#3a3a42',v:.05,k:'Interni'},
  {id:'pietra',n:'Pietra',a:'#8a8a94',b:'#80808a',v:.1,d:'crack',k:'Interni'},
  {id:'rosso',n:'Tappeto rosso',a:'#a8303a',b:'#a02c36',v:.06,d:'rug',k:'Interni'},
  {id:'blu',n:'Tappeto blu',a:'#2e4a8a',b:'#2a4482',v:.06,d:'rug',k:'Interni'},
  {id:'verde',n:'Tappeto verde',a:'#2f6a3a',b:'#2a6234',v:.06,d:'rug',k:'Interni'},
  {id:'oro',n:'Pavimento d\'oro',a:'#d4af37',b:'#c9a432',v:.1,d:'glint',k:'Interni'},
  {id:'casino',n:'Moquette del casinò',a:'#6a1a2a',b:'#601626',v:.06,k:'Interni'}];
const EMATI={};EMAT.forEach((m,i)=>EMATI[m.id]=i);
function edFloorDet(x,y,m,h){const k=hh(x*5.3+1,y*2.9+3),k2=hh(x*1.7+5,y*3.3+2);switch(m.d){
  case 'tuft':case 'tuft2':case 'tuft3':if(k>.45){const gc=m.d==='tuft'?'#5d8c43':m.d==='tuft2'?'#3c7a2c':'#9a8a4a';box(x+.18+k*.3,y+.32,0,.05,.05,3+k*4,gc);box(x+.52,y+.62-k*.2,0,.05,.05,2+k*3,gc,1.18);box(x+.7-k*.25,y+.22,0,.05,.05,2+k*2,gc,.88)}break;
  case 'flow':if(k>.4){box(x+.2+k*.4,y+.3,0,.07,.07,1.5,['#e86a8a','#ffd84a','#ffffff','#c88aff'][(x*3+y)%4]);box(x+.6,y+.6-k*.2,0,.06,.06,1.2,['#ffd84a','#e86a8a','#c88aff','#ffffff'][(x+y*5)%4])}if(k2>.6)box(x+.3,y+.7,0,.05,.05,3,'#5d8c43');break;
  case 'peb':if(k>.6)box(x+.2+k*.4,y+.3+k2*.4,0,.12,.09,1.2,shx(m.a,.8));if(k2>.75)box(x+.6,y+.2,0,.08,.08,1,shx(m.a,1.15));break;
  case 'ripple':if(k>.5)box(x+.1,y+.3+k*.3,0,.8,.04,.4,shx(m.a,.9));break;
  case 'spark':if(k>.7)box(x+.3+k2*.4,y+.3,0,.05,.05,.6,'#ffffff',1.1);break;
  case 'shine':if(k>.55)box(x+.15,y+.2+k*.4,0,.5,.04,.3,'#e8f6ff',1.1);break;
  case 'crack':if(k>.65){box(x+.2,y+.4,0,.4,.03,.2,shx(m.a,.75));box(x+.55,y+.4,0,.03,.3,.2,shx(m.a,.75))}break;
  case 'rune':if(k>.8)box(x+.35,y+.35,0,.3,.3,.3,'#7a4ab0',1.2);break;
  case 'glint':if(k>.6)box(x+.3+k2*.3,y+.3,0,.08,.08,.5,'#ffffff',1.2);break;
  case 'ember':if(k>.55){box(x+.15,y+.3+k*.3,0,.6,.04,.25,'#ff6a1a',1.3);box(x+.4,y+.15,0,.04,.5,.25,'#ff8a2a',1.3)}break;
  case 'cobble':for(let i=0;i<4;i++)box(x+.08+(i%2)*.46,y+.08+(i>>1)*.46,0,.38,.38,.4,shx((i+x+y)%2?m.a:m.b,.95+((i*7+x*3+y)%3)*.04));break;
  case 'brick':for(let i=0;i<3;i++)box(x+.02,y+.31+i*.33,0,.96,.02,.15,'#6a3a2a');box(x+.48,y+.02,0,.02,.3,.15,'#6a3a2a');box(x+.2,y+.35,0,.02,.3,.15,'#6a3a2a');box(x+.75,y+.68,0,.02,.3,.15,'#6a3a2a');break;
  case 'plank':for(let i=1;i<4;i++)box(x+.01,y+i*.25,0,.98,.02,.15,shx(m.a,.72));if((x+y)%2)box(x+.5,y+.02,0,.02,.22,.15,shx(m.a,.72));break;
  case 'vein':if(k>.5)box(x+.1+k*.2,y+.2,0,.5,.02,.12,'#b8b4a8');break;
  case 'rug':box(x+.04,y+.04,0,.92,.04,.15,'#d4af37');box(x+.04,y+.92,0,.92,.04,.15,'#d4af37');break}}

/* ---- muri: ogni stile ha la sua forma; "tinta" vuol dire che il colore si può cambiare dalla mappa ---- */
const EWAL=[
  {id:'pietra',n:'Pietra',c:'#7a7f89',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,34+h*8,c,.9+h*.1);if(h>.8)box(x+.1,y+.1,34+h*8,.4,.3,2,'#4a7a3a')}},
  {id:'mura',n:'Mura merlate',c:'#8b8f99',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,30,c,.9+h*.1);if((x+y)%2===0)box(x+.2,y+.2,30,.6,.6,6,c,.95)}},
  {id:'mattoni',n:'Mattoni',c:'#9a5a42',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,34,c,.9+h*.08);const d=shx(c,.7);for(let z=6;z<34;z+=7){box(x,y+.99,z,1,.02,.6,d);box(x+.99,y,z,.02,1,.6,d)}box(x+((y%2)?.5:.25),y+.99,0,.02,.02,34,d)}},
  {id:'legno',n:'Assi di legno',c:'#7a5a3a',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,30,c,.9+h*.08);const d=shx(c,.65);for(const o of[.25,.5,.75]){box(x+o,y+.99,0,.02,.02,30,d);box(x+.99,y+o,0,.02,.02,30,d)}box(x-.02,y-.02,28,1.04,1.04,3,shx(c,.8))}},
  {id:'interno',n:'Muro di casa',c:'#d8c8a8',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,44,c,.9+h*.08);box(x,y+.99,0,1,.02,6,shx(c,.7));box(x+.99,y,0,.02,1,6,shx(c,.7));if(h>.82)box(x+.25,y+.98,20,.5,.04,12,['#a83a3a','#3a6aa8','#3a8a4a'][(x+y)%3])}},
  {id:'roccia',n:'Roccia',c:'#5a4a3c',tint:1,f:(x,y,h,c)=>{const r=26+h*28;box(x,y,0,1,1,r,c,.8+h*.2);if(h>.4)box(x+.15,y+.2,r,.5,.5,4+h*6,c,.9);if(h>.8)box(x+.6,y+.6,r-6,.3,.3,8,shx(c,1.15))}},
  {id:'cripta',n:'Pietra di cripta',c:'#3a3d4a',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,40,c,.9+h*.1);if(h>.6){box(x+.3,y+.97,10,.4,.04,14,'#141620');if(h>.8)box(x+.42,y+.99,13,.16,.03,5,'#e8e4d8')}}},
  {id:'siepe',open:1,n:'Siepe',c:'#3a7a32',tint:1,f:(x,y,h,c)=>{box(x+.04,y+.04,0,.92,.92,16+h*4,c,.85+h*.25);box(x+.12,y+.12,16+h*4,.76,.76,2,shx(c,1.2))}},
  {id:'alberi',open:1,n:'Bosco fitto',c:'#2f6b2a',tint:1,f:(x,y,h,c)=>{box(x+.35,y+.35,0,.3,.3,14,'#6b4a2b');box(x+.05,y+.05,12,.9,.9,12,c,.85+h*.3);box(x+.25,y+.25,24,.5,.5,8,c,1.1)}},
  {id:'abeti',open:1,n:'Abeti innevati',c:'#2f5a4a',tint:1,f:(x,y,h,c)=>{box(x+.4,y+.4,0,.2,.2,8,'#5a3a2a');box(x+.1,y+.1,8,.8,.8,10,c);box(x+.2,y+.2,18,.6,.6,9,c,1.1);box(x+.3,y+.3,27,.4,.4,8,c,1.2);box(x+.38,y+.38,35,.24,.24,4,'#f4f8fc')}},
  {id:'dune',open:1,n:'Cactus e dune',c:'#4e9a47',tint:1,f:(x,y,h,c)=>{if(h<.5){box(x+.38,y+.38,0,.24,.24,18+h*30,c);box(x+.15,y+.42,10,.25,.14,6,c)}else box(x+.1,y+.1,0,.8,.8,8+h*14,'#a88c5a')}},
  {id:'scogli',open:1,n:'Scogli',c:'#6a6a72',tint:1,f:(x,y,h,c)=>{const ht=10+h*24;box(x+.05,y+.05,0,.9,.9,ht,c,.85+h*.1);box(x+.2,y+.15,ht,.6,.6,4+h*6,shx(c,1.1));box(x+.1,y+.1,ht*.3,.8,.8,1.5,'#3a6a3a')}},
  {id:'ghiaccio',n:'Ghiaccio',c:'#bfe3f5',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,28+h*14,c,1.02);box(x+.2,y+.2,28+h*14,.5,.5,3,'#ffffff',1.05);if(h>.6)box(x+.97,y+.3,8,.04,.3,14,'#ffffff',1.1)}},
  {id:'cristalli',n:'Cristalli',c:'#b48aff',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,8,'#3a3048');box(x+.15,y+.2,8,.25,.25,20+h*20,c,1.15);box(x+.55,y+.5,8,.3,.3,14+h*14,shx(c,1.2),1.1);box(x+.4,y+.15,8,.18,.18,10+h*10,shx(c,.9),1.2)}},
  {id:'palizzata',open:1,n:'Palizzata',c:'#5a3a1e',tint:1,f:(x,y,h,c)=>{for(let i=0;i<3;i++)box(x+.08+i*.3,y+.08+i*.3,0,.24,.24,22+((x*3+y+i)%3)*3,c);box(x+.1,y+.1,14,.8,.8,1.5,'#3a2a14')}},
  {id:'ossidiana',n:'Ossidiana del Vuoto',c:'#211a30',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,38+h*10,c,.9+h*.2);if(h>.5)box(x+.3,y+.98,8,.06,.03,26,'#c46bff',1.4);if(h>.8)box(x+.98,y+.5,12,.03,.06,18,'#c46bff',1.4)}},
  {id:'oro',n:'Tempio d\'oro',c:'#c9a860',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,40,c,.9+h*.1);box(x-.01,y-.01,22,1.02,1.02,3,'#d4af37',.9);if(h>.7)box(x+.3,y+.98,8,.4,.03,8,'#3a5aa8')}},
  {id:'lavica',n:'Roccia lavica',c:'#3a2420',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,32+h*14,c,.85+h*.2);if(h>.45)box(x+.2,y+.98,4,.05,.03,20+h*10,'#ff6a1a',1.4);if(h>.7)box(x+.98,y+.6,6,.03,.05,16,'#ff8a2a',1.4)}},
  {id:'basso',n:'Muretto basso',c:'#9a9284',tint:1,f:(x,y,h,c)=>{box(x,y,0,1,1,10,c,.9+h*.1);box(x-.02,y-.02,10,1.04,1.04,2,shx(c,.85))}}];
const EWALI={};EWAL.forEach((w,i)=>EWALI[w.id]=i);

/* ---- decorazioni: tutti gli arredi e gli oggetti del gioco. walk: si può camminare sopra ---- */
const EDEC=[
  ['Natura','r','Albero'],['Natura','a','Albero di mele'],['Natura','d','Albero secco'],['Natura','ℸ','Albero bruciato'],['Natura','h','Cespuglio fiorito'],['Natura','j','Siepe bassa'],['Natura','e','Roseto'],['Natura','o','Aiuola'],
  ['Natura','u','Rocce'],['Natura','m','Ceppo'],['Natura','¢','Cactus'],['Natura','ŵ','Germogli',1],['Natura','ℛ','Scoglio'],['Natura','ℵ','Roccia con cristallo'],['Natura','Ю','Alghe sugli scogli'],['Natura','?','Alga'],['Natura','%','Corallo'],
  ['Natura','1','Fungo gigante'],['Natura','2','Funghi luminosi'],['Natura','8','Cristalli'],['Natura','9','Stalagmite di ghiaccio'],
  ['Campagna','g','Grano'],['Campagna','q','Ortaggi'],['Campagna','v','Vite'],['Campagna','y','Balla di fieno'],['Campagna','L','Legna accatastata'],['Campagna','+','Arnia'],['Campagna',':','Abbeveratoio'],['Campagna','E','Spaventapasseri'],
  ['Campagna','f','Staccionata'],['Campagna','z','Mola'],['Campagna','Я','Pompa dell\'acqua'],['Campagna','Л','Cassetta di verdure'],['Campagna','Г','Macerie di legno'],['Campagna','i','Sacchi di farina'],['Campagna','x','Carretto'],['Campagna','G','Cuccia'],['Campagna','Ω','Girandola'],
  ['Città','l','Lampione'],['Città','ł','Lanterna su palo'],['Città','Э','Lampada appesa'],['Città','W','Pozzo con tetto'],['Città','ʬ','Pozzo di pietra'],['Città','s','Bancarella'],['Città','ʍ','Bancarella a strisce'],['Città','H','Banco del mercato'],['Città','n','Panchina'],
  ['Città','Y','Statua'],['Città','Б','Statua di pietra'],['Città','ɸ','Bordo di fontana'],['Città','t','Lapide'],['Città','Ŧ','Bandiera tricolore'],['Città','§','Stendardo blu'],['Città','ℶ','Stendardo di battaglia'],['Città','I','Palo'],['Città','N','Stenditoio'],
  ['Porto','&','Ancora'],['Porto','@','Rotolo di corda'],['Porto','k','Cassa'],['Porto','b','Botte'],['Porto','Ж','Casse di pesce'],['Porto','Щ','Cassetta di pesce'],['Porto','Ъ','Pesce ad asciugare'],['Porto','Ы','Banco del pesce'],['Porto','Ь','Corde e secchio'],
  ['Porto','ℨ','Relitto'],['Porto','ℳ','Albero maestro con vela'],['Porto','¶','Bandiera pirata'],['Porto','J','Cannoncino'],
  ['Casa','T','Tavolo'],['Casa','B','Letto'],['Casa','$','Letto di lusso'],['Casa','S','Libreria'],['Casa','C','Bancone'],['Casa','F','Camino'],['Casa','p','Pianta in vaso'],['Casa',';','Cassettiera'],['Casa','_','Comò'],['Casa','ɱ','Armadio'],
  ['Casa','ŝ','Sacchi'],['Casa','ʘ','Leggio con libro'],['Casa','ƥ','Quadro'],['Casa','ƪ','Lavagna'],['Casa','ǁ','Tappeto',1],['Casa','ȼ','Forno'],['Casa','*','Candelabro'],['Casa','|','Pendola'],
  ['Casa','¡1','Forno del pane'],['Casa','¡2','Scaffale del pane'],['Casa','¡3','Manichino'],['Casa','¡4','Tavolo da sarta'],['Casa','¡5','Telescopio'],['Casa','¡6','Mappamondo'],['Casa','¡7','Busto di pietra'],['Casa','¡8','Letto a castello'],
  ['Casa','¡9','Mangiatoia'],['Casa','¡0','Scrivania'],['Casa','¡!','Stendardo rosso'],['Casa','¡%','Pianoforte'],['Casa','¡?','Cavalletto da pittore'],['Casa','¡<','Guardaroba'],['Casa','¡>','Vasca da bagno'],
  ['Castello','K','Trono'],['Castello','X','Altare'],['Castello','ŧ','Armatura'],['Castello','w','Rastrelliera d\'armi'],['Castello','A','Incudine'],['Castello','P','Calderone'],['Castello','ǂ','Inferriata'],['Castello','ž','Tappeto reale',1],
  ['Castello','M','Slot machine'],['Castello','R','Roulette'],['Castello','Q','Tavolo da carte'],['Castello','Z','Tavolo dei dadi'],
  ['Segrete','3','Gabbia'],['Segrete','4','Sarcofago'],['Segrete','ʭ','Tomba'],['Segrete','5','Candele'],['Segrete','ċ','Candele accese'],['Segrete','6','Obelisco'],['Segrete','7','Idolo d\'oro'],['Segrete','Ø','Mucchio d\'oro'],['Segrete','0','Braciere di lava'],
  ['Segrete',',','Braciere'],['Segrete','Д','Braciere rosso'],['Segrete','!','Palo di ferro'],['Segrete','<','Cristallo del Vuoto'],['Segrete','>','Runa del Vuoto',1],['Segrete','{','Ossa',1],['Segrete','Ч','Ossa sparse',1],['Segrete','Ц','Gabbia d\'ossa'],
  ['Segrete','ğ','Colonna nera'],['Segrete','Ш','Colonna spezzata'],['Segrete','Ā','Altare oscuro'],['Segrete','ë','Stendardo cupo'],['Segrete','ж','Grata di ferro'],['Segrete','¥','Totem'],['Segrete','П','Catena appesa'],
  ['Segrete','Р','Runa rossa',1],['Segrete','В','Vena pulsante',1],['Segrete','С','Pozza scura',1],['Segrete','ш','Macchia di sangue',1],['Segrete','ɯ','Botola aperta'],
  ['Guerra','ß','Sacchi di sabbia'],['Guerra','¤','Filo spinato'],['Guerra','Ŗ','Muro di trincea'],['Guerra','·','Cratere',1],['Guerra','≠','Assi spezzate',1],['Guerra','ç','Terra bruciata',1],['Guerra','č','Terra scura',1],['Guerra','ø','Segno rosso',1],
  ['Guerra','ƒ','Falò'],['Guerra','ℷ','Paletti di legno'],
  ['Acqua','O','Barca a remi',0,1],['Acqua','^','Boa',0,1],['Acqua','U','Zampillo',0,1]].map(([k,c,n,walk,water])=>({k,c,n,walk:!!walk,water:!!water}));
const EDECI={};EDEC.forEach((d,i)=>EDECI[d.c]=d);
const EDECK=[...new Set(EDEC.map(d=>d.k))];
const edDecWalk=c=>!!(EDECI[c]&&EDECI[c].walk);

/* ---- edifici, porte e passaggi ---- */
const EBLD=[{id:'casa',n:'Casa',st:''},{id:'fumo',n:'Casa con camino',st:'',smoke:1},{id:'castello',n:'Castello',st:'cas'},{id:'tempio',n:'Tempio',st:'tem'},{id:'colosseo',n:'Arena',st:'col'},{id:'osservatorio',n:'Osservatorio',st:'obs'},
  {id:'municipio',n:'Municipio',st:'mun'},{id:'motel',n:'Motel con insegna',st:'motel'},{id:'mulino',n:'Mulino a vento',st:'mill'},{id:'faro',n:'Faro',st:'lh'}];
const EBLDI={};EBLD.forEach(b=>EBLDI[b.id]=b);
const EPOR=[{st:'exit',n:'Porta di legno'},{st:'door',n:'Porta nel muro (contro un muro)'},{st:'',n:'Arco luminoso'},{st:'gate',n:'Cancello di pietra'},{st:'cancello',n:'Cancello che si apre'},{st:'dun',n:'Ingresso di grotta'},
  {st:'up',n:'Scala che sale'},{st:'down',n:'Scala che scende'},{st:'void',n:'Portale del Vuoto'},{st:'cabina',n:'Cabina blu'},{st:'pozzo',n:'Pozzo'}];
const EPORI={};EPOR.forEach(p=>EPORI[p.st]=p);
const ELIQ={acqua:{n:'Acqua',c:null},mare:{n:'Mare profondo',c:'#2a6aa8'},palude:{n:'Palude',c:'#4a6a3a'},ghiaccio:{n:'Acqua gelida',c:'#bfe3f5'},lava:{n:'Lava',c:'#ff6a1a'},vuoto:{n:'Vuoto viola',c:'#5a2a8a'},sangue:{n:'Sangue',c:'#7a1018'}};
const ESKY={azzurro:['Cielo azzurro',['#3f84d4','#86bce8','#d9eef9']],sereno:['Primavera',['#4a92d6','#a3d3f0','#e2f3fa']],deserto:['Deserto',['#3a7fc8','#9cc4e6','#f3e1b8']],neve:['Montagna',['#4e6f94','#a9c0d8','#eaf2f8']],
  tramonto:['Tramonto',['#2a3a7a','#e0875a','#f5c27a']],tempesta:['Tempesta',['#3a4048','#6a7480','#9aa2aa']],nebbia:['Nebbia',['#8a9098','#b0b4b8','#d0d2d4']],viola:['Cielo del Vuoto',['#1a0a2a','#4a2a6a','#8a5aaa']],inferno:['Cielo di fuoco',['#2a0604','#7a1a0a','#d0601a']],notte:['Notte stellata',['#05070f','#0a1020','#141c30']]};
const ELIGHT={giorno:'Sempre giorno',ciclo:'Giorno e notte',notte:'Sempre notte',interno:'Interno (penombra)',buio:'Buio',tenebre:'Tenebre (solo torce e luci)'};
const EPART={'':'Niente',leaf:'Foglie',petal:'Petali',dust:'Polvere',snow:'Neve',rain:'Pioggia',ffly:'Lucciole',ember:'Braci',bubble:'Bolle',mote:'Scintille viola',confetti:'Coriandoli'};
const ETRKN={menu:'Menu',town:'Aldoria',notte:'Notte in città',forest:'Foresta',desert:'Deserto',peaks:'Picchi gelidi',inter:'Valzer degli interni',castello:'Castello',dungeon:'Dungeon',arena:'Arena',boss:'Boss',
  tana:'Tana dei Goblin',cripta:'Cripta',piramide:'Piramide',cristallo:'Caverne di cristallo',fucina:'Fucina infernale',abisso:'Abisso',cittadella:'Cittadella del Vuoto',naval:'Battaglia navale',boarding:'Arrembaggio',
  intro:'Prologo',motel:'Motel',dimhub:'La Cabina',west:'Far West',vit:'Londra vittoriana',riv:'Rivoluzione',war:'Grande Guerra',sogno:'Il sogno',vecchia:'Aldoria Vecchia',culto:'Il culto',abominio:'L\'Abominio',pesca:'Pesca',guerra:'Battaglia'};
// nemici che si possono mettere nelle mappe (le parti dell'Abominio e le anime no)
function edEnemyList(){return Object.keys(E).filter(k=>!/^abo_/.test(k)&&!E[k].np&&!E[k].pt)}
const ERES={grano:'Grano',legna:'Legna',mela:'Mele',uova:'Uova',rosa:'Rose',cimelio:'Cimelio'};

/* ---- un mondo nuovo e le sue parti ---- */
function edNewMap(o={}){const N2=clamp(o.N|0||32,12,96),n=N2*N2,m={id:o.id||edUid('m'),n:o.n||'Nuova mappa',N:N2,light:o.light||'ciclo',sky:o.sky||'azzurro',bg:o.bg||'#141820',liq:o.liq||'acqua',mus:o.mus||'town',pt:o.pt==null?'':o.pt,lv:o.lv||1,
    wc:'',low:o.low?1:0,t:new Array(n).fill(0),f:new Array(n).fill(o.f|0),w:new Array(n).fill(o.w|0),d:{},dw:{},b:[],e:[],sp:[N2>>1,N2>>1],enter:[],cine:''};return m}
function edNewWorld(name){const m=edNewMap({n:'Prato'});const w={v:1,id:edUid('w'),name:name||'Il mio mondo',desc:'',author:(typeof NET!=='undefined'&&NET.name)||'',created:Date.now(),updated:Date.now(),
  start:{map:m.id,x:m.sp[0],y:m.sp[1]},set:{lv:1,g:30,pot:3,diff:1,perm:0,time:480,day:1,rod:0,xpm:1,gm:1,intro:'',end:'',gems:0,bag:24,gear:{w:'',h:'',c:'',s:''},obj:''},
  maps:{[m.id]:m},npcs:{},items:{},quests:{},songs:{},cines:{},vars:{}};return w}
// 7.6: un mondo che arriva da fuori (file importato o mondo pubblicato da un altro giocatore) passa da qui prima di tutto:
// i testi liberi (nomi, battute, descrizioni...) restano come sono e il gioco li mostra sempre come testo; tutti gli altri valori
// (identificativi, colori, tipi) non possono contenere < > " ' ` \ & e le chiavi sono solo lettere, numeri, - e _.
// Così nessun mondo può far eseguire codice a chi lo gioca o lo apre nell'editor.
const EDFREE=new Set(['n','tx','desc','wait','txt','title','ti','obj','name','lines','end','done','author','sub']);
const EDOPS=['<=','==','!=','>','<','>=','set','add','sub','tog'];
function edSafe(o,k,d){if(d>40)return undefined;
  if(typeof o==='string'){if(EDFREE.has(k))return o.slice(0,6000);if(k==='op')return EDOPS.includes(o)?o:'>=';return o.replace(/[<>"'`\\&\x00-\x1f\x7f]/g,'').slice(0,20000)}
  if(typeof o==='number')return isFinite(o)?o:0;if(typeof o==='boolean'||o===null)return o;
  if(Array.isArray(o)){const r=[];for(let i=0;i<o.length&&i<20000;i++){const v=edSafe(o[i],k,d+1);r.push(v===undefined?null:v)}return r}
  if(o&&typeof o==='object'){const r={};for(const kk of Object.keys(o)){if(!/^[\w-]{1,64}$/.test(kk)||kk==='__proto__'||kk==='constructor'||kk==='prototype')continue;const v=edSafe(o[kk],kk,d+1);if(v!==undefined)r[kk]=v}return r}
  return undefined}
function edSafeWorld(w){const D={},SD={};if(w.maps&&typeof w.maps==='object')for(const id in w.maps){const m=w.maps[id];if(m&&m.d&&typeof m.d==='object')D[id]=m.d}
  if(w.stamps&&typeof w.stamps==='object')for(const id in w.stamps){const st=w.stamps[id];if(st&&st.c&&st.c.d&&typeof st.c.d==='object')SD[id]=st.c.d}
  const r=edSafe(w,'',0)||{};if(!/^[\w-]{1,48}$/.test(r.id||''))r.id=edUid('w');
  // le decorazioni hanno codici con simboli (& < > ...): valgono solo quelli del catalogo (nelle mappe e nei timbri)
  const deco=o0=>{const o={};for(const i in o0){const v=o0[i];if(/^\d{1,5}$/.test(i)&&typeof v==='string'&&EDECI[v])o[i]=v}return o};
  for(const id in D)if(r.maps&&r.maps[id])r.maps[id].d=deco(D[id]);
  for(const id in SD)if(r.stamps&&r.stamps[id]&&r.stamps[id].c)r.stamps[id].c.d=deco(SD[id]);
  return r}
// lettura difensiva: un file importato o un salvataggio vecchio non deve mai bloccare il gioco
function edFixWorld(w){if(!w||typeof w!=='object'||Array.isArray(w))return null;w=edSafeWorld(w);w.v=1;w.id=w.id||edUid('w');w.name=String(w.name||'Mondo senza nome').slice(0,60);w.desc=String(w.desc||'').slice(0,600);
  for(const k of['maps','npcs','items','quests','songs','cines','vars'])if(!w[k]||typeof w[k]!=='object'||Array.isArray(w[k]))w[k]={};
  w.set=Object.assign({lv:1,g:30,pot:3,diff:1,perm:0,time:480,day:1,rod:0,xpm:1,gm:1,intro:'',end:'',gems:0,bag:24,gear:{w:'',h:'',c:'',s:''},obj:''},w.set||{});if(!w.set.gear)w.set.gear={w:'',h:'',c:'',s:''};
  for(const id in w.maps){const m=w.maps[id];if(!m||typeof m!=='object'){delete w.maps[id];continue}m.id=id;edFixMap(m)}
  if(!Object.keys(w.maps).length){const m=edNewMap({n:'Prato'});w.maps[m.id]=m}
  if(!w.start||!w.maps[w.start.map]){const m=Object.values(w.maps)[0];w.start={map:m.id,x:m.sp[0],y:m.sp[1]}}
  for(const id in w.npcs){const d=w.npcs[id];if(!d||typeof d!=='object'){delete w.npcs[id];continue}d.id=id;edFixNpc(d)}
  for(const id in w.items){const d=w.items[id];if(!d||typeof d!=='object'){delete w.items[id];continue}d.id=id;edFixItem(d)}
  for(const id in w.quests){const d=w.quests[id];if(!d||typeof d!=='object'){delete w.quests[id];continue}d.id=id;edFixQuest(d)}
  for(const id in w.songs){const d=w.songs[id];if(!d||typeof d!=='object'){delete w.songs[id];continue}d.id=id;edFixSong(d)}
  for(const id in w.cines){const d=w.cines[id];if(!d||typeof d!=='object'){delete w.cines[id];continue}d.id=id;d.n=String(d.n||'Cinematica');if(!Array.isArray(d.steps))d.steps=[]}
  for(const id in w.vars){const d=w.vars[id];if(!d||typeof d!=='object'){delete w.vars[id];continue}d.id=id;d.n=String(d.n||id).replace(/[^\wàèéìòù]/g,'_').slice(0,30);d.v=+d.v||0}
  return w}
function edFixMap(m){const N2=clamp(m.N|0||32,12,96),n=N2*N2;m.N=N2;m.n=String(m.n||'Mappa');
  for(const k of['t','f','w']){if(typeof m[k]==='string')m[k]=rleD(m[k],n);if(!Array.isArray(m[k])||m[k].length!==n)m[k]=new Array(n).fill(0)}
  m.t=m.t.map(v=>v===1||v===2||v===9?v:0);m.f=m.f.map(v=>v<EMAT.length?v:0);m.w=m.w.map(v=>v<EWAL.length?v:0);
  if(!m.d||typeof m.d!=='object')m.d={};if(!m.dw||typeof m.dw!=='object')m.dw={};for(const i in m.d)if(!(+i>=0&&+i<n)||typeof m.d[i]!=='string')delete m.d[i];
  if(!Array.isArray(m.b))m.b=[];if(!Array.isArray(m.e))m.e=[];if(!Array.isArray(m.enter))m.enter=[];
  m.b=m.b.filter(b=>b&&b.w>0&&b.h>0);for(const b of m.b){b.u=b.u||edUid('b');b.x=clamp(b.x|0,0,N2-1);b.y=clamp(b.y|0,0,N2-1);b.w=clamp(b.w|0,1,N2-b.x);b.h=clamp(b.h|0,1,N2-b.y);b.st=EBLDI[b.st]?b.st:'casa';b.ht=clamp(+b.ht||26,10,90)}
  m.e=m.e.filter(e=>e&&typeof e.k==='string');for(const e of m.e){e.u=e.u||edUid('e');e.x=clamp(+e.x||0,0,N2-1);e.y=clamp(+e.y||0,0,N2-1)}
  if(!Array.isArray(m.sp))m.sp=[N2>>1,N2>>1];m.sp=[clamp(m.sp[0]|0,0,N2-1),clamp(m.sp[1]|0,0,N2-1)];
  if(!ELIGHT[m.light])m.light='ciclo';if(!ESKY[m.sky])m.sky='azzurro';if(!ELIQ[m.liq])m.liq='acqua';if(EPART[m.pt]==null)m.pt='';m.lv=clamp(m.lv|0||1,1,60);return m}
function edFixNpc(d){d.n=String(d.n||'Personaggio').slice(0,40);d.look=Object.assign({sk:'b',hair:'short',hc:'#4a2a14',beard:'none',bc:'',hat:'none',h1:'#555555',h2:'',c:'#3a6ea5',xs:[],prop:'none',an:'idle',body:['n']},d.look||{});
  if(!Array.isArray(d.look.xs))d.look.xs=[];if(!Array.isArray(d.look.body))d.look.body=['n'];if(!d.dlg||typeof d.dlg!=='object')d.dlg={start:'a',nodes:{a:{tx:'Salve, viandante!',opts:[]}}};if(!d.dlg.nodes||typeof d.dlg.nodes!=='object')d.dlg.nodes={};
  if(!d.dlg.nodes[d.dlg.start]){const k=Object.keys(d.dlg.nodes)[0];if(k)d.dlg.start=k;else{d.dlg.start='a';d.dlg.nodes.a={tx:'...',opts:[]}}}
  for(const k in d.dlg.nodes){const nd=d.dlg.nodes[k];if(!nd||typeof nd!=='object'){delete d.dlg.nodes[k];continue}nd.tx=String(nd.tx||'');if(!Array.isArray(nd.opts))nd.opts=[];for(const o of nd.opts){o.tx=String(o.tx||'...');if(!Array.isArray(o.cond))o.cond=[];if(!Array.isArray(o.acts))o.acts=[]}}
  if(!Array.isArray(d.shop))d.shop=[];if(!Array.isArray(d.lines))d.lines=[];d.role=d.role||'';d.title=d.title||'';return d}
function edFixItem(d){d.n=String(d.n||'Oggetto').slice(0,40);if(!'whcs'.includes(d.k)&&!EITK[d.k])d.k='quest';d.r=clamp(d.r|0,0,4);d.v=Math.max(0,+d.v||0);d.price=Math.max(0,+d.price||0);if(!Array.isArray(d.use))d.use=[];return d}
function edFixQuest(d){d.ti=String(d.ti||'Missione').slice(0,60);d.tx=String(d.tx||'');if(!Array.isArray(d.steps))d.steps=[];if(!Array.isArray(d.req))d.req=[];d.rew=Object.assign({g:0,x:0,items:[],acts:[]},d.rew||{});if(!Array.isArray(d.rew.items))d.rew.items=[];if(!Array.isArray(d.rew.acts))d.rew.acts=[];return d}
function edFixSong(d){d.n=String(d.n||'Brano');d.bpm=clamp(+d.bpm||100,40,220);d.root=clamp(+d.root||60,36,84);if(!SCL[d.sc])d.sc='maj';if(!INS[d.ld])d.ld='flute';if(!d.parts||typeof d.parts!=='object')d.parts={A:{ch:[0,3,4,0],nt:[]}};
  for(const k in d.parts){const p=d.parts[k];if(!Array.isArray(p.ch)||!p.ch.length)p.ch=[0,3,4,0];if(!Array.isArray(p.nt))p.nt=[]}d.form=String(d.form||'A').replace(/[^A-D]/g,'')||'A';for(const c of d.form)if(!d.parts[c])d.parts[c]={ch:[0,3,4,0],nt:[]};if(!d.drm||typeof d.drm!=='object')d.drm={};if(!Array.isArray(d.cp))d.cp=[];d.spb=d.spb===12?12:16;if(!BASS[d.bs])d.bs='root';if(!DRUMS[d.dr]&&d.dr!=='custom')d.dr='none';return d}
// tipi di oggetti non indossabili (finiscono nella borsa)
const EITK={pot:'Pozione',food:'Cibo',key:'Chiave',quest:'Oggetto di missione',note:'Lettera o libro',mat:'Materiale',gem:'Gemma',coin:'Tesoro'};
// salvataggio dei mondi nel browser: un indice e un documento per mondo (livelli delle mappe compressi)
function edPack(w){const o=edClone(w);for(const id in o.maps){const m=o.maps[id];m.t=rleE(m.t);m.f=rleE(m.f);m.w=rleE(m.w)}return o}
function edUnpack(o){return edFixWorld(o)}
function edIdx(){const L=LS.get(EDIX,[]);return Array.isArray(L)?L:[]}
function edSaveWorld(w,quiet){if(!w)return false;w.updated=Date.now();const p=edPack(w);let ok=true;try{localStorage.setItem(EDWK+w.id,JSON.stringify(p))}catch(e){ok=false}
  const L=edIdx().filter(q=>q.id!==w.id);L.unshift({id:w.id,name:w.name,desc:w.desc.slice(0,140),maps:Object.keys(w.maps).length,npcs:Object.keys(w.npcs).length,quests:Object.keys(w.quests).length,t:w.updated});LS.set(EDIX,L);
  if(!ok&&!quiet)edToast('⚠ Spazio del browser esaurito: esporta il mondo in un file per non perderlo','err');return ok}
function edLoadWorld(id){try{const s=localStorage.getItem(EDWK+id);return s?edUnpack(JSON.parse(s)):null}catch(e){return null}}
function edDelWorld(id){LS.del(EDWK+id);LS.del(EDSK+id);LS.set(EDIX,edIdx().filter(q=>q.id!==id))}
let EDTT=0;function edToast(s,k){let el=$('edtoast');if(!el){el=document.createElement('div');el.id='edtoast';document.body.appendChild(el)}el.textContent=s;el.className='on'+(k?' '+k:'');clearTimeout(EDTT);EDTT=setTimeout(()=>el.className='',2600)}

/* ---- personaggi: la scheda dell'aspetto diventa la stessa stringa dei personaggi del gioco ---- */
function edNpcKey(id){return 'edn_'+id}
function edNpcSpec(L){const c=v=>v?':'+v:'';const xs=(L.xs||[]).filter(Boolean).map(x=>typeof x==='string'?x:x.k+(x.c?':'+x.c:'')).join(',')||'none';
  return [L.sk||'b',(L.hair||'none')+c(L.hc),(L.beard||'none')+c(L.bc),(L.hat||'none')+(L.hat&&L.hat!=='none'?':'+(L.h1||'')+(L.h2?':'+L.h2:''):''),xs,L.prop||'none',L.an||'idle',(L.body&&L.body.length?L.body:['n']).join(',')].join('|')}
function edRegNpc(d){const k=edNpcKey(d.id);NPS[k]=edNpcSpec(d.look);NPCS[k]={n:d.n,c:d.look.c||'#888888',hat:d.look.h1||'#555555',role:d.role==='shop'?'':d.role,ed:d.id,buy:d.role==='buyfish'?'fish':d.role==='buyres'?'res':undefined};return k}
function edMakeNpc(d,x,y){const k=edRegNpc(d);const e=mkNpc(k,x,y,{n:d.n});if(d.animal&&ANM[d.animal]){e.m=ANM[d.animal]();e.wg=1}return e}

/* ---- le mappe diventano zone del gioco ---- */
const edZk=id=>'ed_'+id;
function edMusKey(m){if(!m)return'town';if(m.startsWith('song:')){const id=m.slice(5);return EW&&EW.songs[id]?'eds_'+id:'town'}return TRK[m]?m:'town'}
function edZone(m){const k=edZk(m.id),lq=ELIQ[m.liq]||ELIQ.acqua,out=m.light==='giorno'||m.light==='ciclo'||m.light==='notte';
  const z=Z[k]=Object.assign(Z[k]||{},{ed:1,edm:m,n:m.n,lv:m.lv||1,N:m.N,a:EMAT[0].a,b:EMAT[0].b,o:'#2f6b2a',bg:m.bg||'#141820',mus:edMusKey(m.mus),pt:m.pt||'',pool:lq.c||undefined,nolamp:1,tc:'#ffb04a'});
  if(out)SKY[k]=(ESKY[m.sky]||ESKY.azzurro)[1];else delete SKY[k];
  if(m.light==='buio')DARKZ.add(k);else DARKZ.delete(k);return k}
// costruisce la zona: in modifica tutti gli oggetti sono visibili e fermi, in gioco dipendono dallo stato della partita
function edGen(z){const m=z.edm,n=N;PIERD=new Set();GT=new Set();BM=grid(-1);TB=[];
  for(let i=0;i<n*n;i++){const x=i%n,y=i/n|0,t0=m.t[i],d=m.d[i];
    if(t0===1){M[y][x]=1;continue}if(t0===9){M[y][x]=9;continue}
    if(t0===2){M[y][x]=2;if(d&&EDECI[d]&&EDECI[d].water)DEC[y][x]=d;continue}
    const mt=EMAT[m.f[i]]||EMAT[0];if(mt.pier)PIERD.add(i);
    if(d&&!(EDECI[d]&&EDECI[d].water)){DEC[y][x]=d;M[y][x]=(m.dw[i]||edDecWalk(d))?(mt.road?4:0):6}else M[y][x]=mt.road?4:0}
  for(const b of m.b){const st=EBLDI[b.st]||EBLD[0],i0=TB.push({x:b.x,y:b.y,w:b.w,h:b.h,st:st.st,wall:b.wall||'#e0d0b0',roof:b.roof||'#a8402f',ht:b.ht||26,smoke:st.smoke?1:0,dx:b.door?b.dx:-9,to:b.to?1:0,u:b.u})-1;
    for(let y=b.y;y<b.y+b.h&&y<n;y++)for(let x=b.x;x<b.x+b.w&&x<n;x++){M[y][x]=3;DEC[y][x]='';BM[y][x]=i0}
    if(b.door){const dy=b.y+b.h;if(dy<n&&b.dx>=b.x&&b.dx<b.x+b.w){if(M[dy][b.dx]!==3){M[dy][b.dx]=4;DEC[dy][b.dx]=''}
      if(!EDIT&&b.to&&EW.maps[b.to])ents.push(Object.assign(po(b.dx,dy,edZk(b.to),{st:'door',n:b.n||EW.maps[b.to].n}),{face:'n',edb:b}))}}}
  if(EDIT)edEditEnts(m);else edPlayEnts(m);
  return(m.sp||[n>>1,n>>1]).slice()}
// in modifica la zona si costruisce senza musica, salvataggio né cartelli
function edPortalFace(x,y){const w=(a,b)=>M[b]&&M[b][a]===1||(M[b]&&M[b][a]===3);return w(x,y-1)?'n':w(x,y+1)?'s':w(x-1,y)?'w':w(x+1,y)?'e':'n'}

/* ---- disegno: pavimenti e muri delle mappe dell'editor ---- */
const _floor75=floor;
floor=function(x,y,c,h){const z=ZZ;if(!z||!z.ed||c===2){_floor75(x,y,c,h);return}const m=z.edm,i=y*N+x,mt=EMAT[m.f[i]]||EMAT[0];
  if(mt.pier){if(typeof pierTile==='function'){pierTile(x,y,h);return}}
  box(x,y,-6,1,1,6,(x+y)&1?mt.a:mt.b,.92+h*mt.v);if(mt.d)edFloorDet(x,y,mt,h)};
const _wall75=wall;
wall=function(x,y,h){const z=ZZ;if(!z||!z.ed){_wall75(x,y,h);return}const m=z.edm,st=EWAL[m.w[y*N+x]]||EWAL[0],c=st.tint&&m.wc?m.wc:st.c;
  if(m.low&&(x===N-1||y===N-1)){box(x,y,0,1,1,6,c,.9+h*.08);return}st.f(x,y,h,c)};
const _dec75=dec;
dec=function(x,y,c,h){if(c&&c.length===2&&c[0]==='¡'){if(typeof decInt52==='function'&&decInt52(x,y,c[1],h))return;return}
  if(c==='ž'){box(x+.02,y+.02,-.4,.96,.96,.5,'#8a1a2a',1);box(x+.1,y+.1,0,.8,.8,.15,'#c0392b');box(x+.08,y+.08,0,.84,.05,.2,'#d4af37');return}
  _dec75(x,y,c,h)};
// luci: interni in penombra, tenebre come nei dungeon
const _lights75=lights;
lights=function(){const z=ZZ;if(z&&z.ed){if(EDIT&&!EDS.dark)return;const L=z.edm.light;
  if(L==='interno'){g.setTransform(DPR,0,0,DPR,0,0);scrVeil('lint',vigP(H*.3,Math.max(W,H)*.7,'rgba(0,0,0,0)','rgba(10,6,0,.55)'));return}
  if(L==='tenebre'){const o=z.dg,fk=ents.filter(e=>e.k==='edlight'||e.k==='edgem').map(e=>({k:'shard',px:e.px,py:e.py})),n0=ents.length;z.dg='ed';ents.push(...fk);try{_lights75()}finally{z.dg=o;ents.length=n0}return}return}_lights75()};
const _dark75=darkOverlay;darkOverlay=function(){if(EDIT&&!EDS.dark&&ZZ&&ZZ.ed)return;_dark75()};
const _night75=nightDraw;nightDraw=function(){if(EDIT&&!EDS.dark&&ZZ&&ZZ.ed)return;_night75()};
// giorno sempre, notte sempre o ciclo
const _tt75=timeTick;timeTick=function(dt){_tt75(dt);const z=ZZ;if(z&&z.ed&&SKY[Zk]){const L=z.edm.light;if(L==='giorno'){NK=0;DK=0}else if(L==='notte'){NK=1;DK=0}}};

/* ---- oggetti dell'editor nel mondo: cartelli, note, gemme, letti, luci, raccolti, oggetti a terra, trigger ---- */
for(const k of['edi','edsign','ednote','edgem','edbed','edres','edlever'])ITK.add(k);
const EDIL={sign:()=>[[-.06,-.06,0,.12,.12,20,'#6b4a2b'],[-.36,-.05,14,.72,.08,16,'#9a7448'],[-.32,-.01,17,.64,.02,2,'#5a3a1a'],[-.28,-.01,22,.5,.02,2,'#5a3a1a']],
  note:()=>{const u=Math.sin(t*3)*2;return[[-.18,-.12,6+u,.36,.24,3,'#f4e8c8'],[-.2,-.13,6+u,.05,.26,4,'#a0703a'],[.15,-.13,6+u,.05,.26,4,'#a0703a'],[-.1,-.02,9+u,.2,.02,.3,'#5a4a3a']]},
  gem:(c)=>{const u=Math.sin(t*3)*3;return[[-.1,-.1,10+u,.2,.2,14,c],[-.05,-.05,24+u,.1,.1,4,'#ffffff'],[-.16,-.04,15+u,.32,.08,5,c]]},
  bed:()=>[[-.35,-.25,0,.7,.5,8,'#6b4a2b'],[-.32,-.22,8,.64,.44,3,'#e8e0d0'],[-.32,-.02,8,.64,.24,4,'#3a6aa8'],[-.35,-.25,8,.08,.5,10,'#5a3a1a']],
  light:(c)=>{const u=Math.sin(t*2.4)*2;return[[-.08,-.08,16+u,.16,.16,8,c],[-.04,-.04,24+u,.08,.08,2,'#ffffff']]},
  lever:(on)=>[[-.22,-.16,0,.44,.32,5,'#5a5a62'],[-.18,-.12,5,.36,.24,1,'#3a3a42'],[on?.02:-.12,-.03,6,.1,.06,14,'#6b4a2b'],[on?.0:-.18,-.06,18,.16,.12,5,on?'#4cd07a':'#e8484f',1.2]],
  trig:()=>[],spawn:()=>[[-.25,-.25,0,.5,.5,1,'#4cd07a'],[-.05,-.05,1,.1,.1,26,'#ffffff'],[.05,-.05,18,.3,.04,8,'#4cd07a']]};
function edItemModel(it){const d=EW&&EW.items[it];if(!d)return[[-.15,-.15,6,.3,.3,10,'#c8ccd4']];if('whcs'.includes(d.k)){return[[-.15,-.15,6+Math.sin(t*4)*3,.3,.3,10,RC[d.r|0]]]}
  const u=Math.sin(t*4)*3,c=d.col||({pot:'#e8484f',food:'#e0a050',key:'#d4af37',quest:'#c88aff',note:'#f4e8c8',mat:'#9a9aa4',gem:'#5ad0ff',coin:'#ffd84a'}[d.k]||'#c8ccd4');
  switch(d.k){case 'key':return[[-.03,-.15,8+u,.06,.3,3,c],[-.08,-.2,8+u,.16,.1,6,c],[-.03,.1,8+u,.1,.05,3,c]];case 'pot':return[[-.1,-.1,4+u,.2,.2,10,c],[-.05,-.05,14+u,.1,.1,4,'#cfe6f2'],[-.06,-.06,18+u,.12,.12,2,'#8a5a2a']];
    case 'note':return[[-.15,-.12,6+u,.3,.24,2,c],[-.08,-.02,8+u,.16,.02,.3,'#5a4a3a']];case 'coin':return[[-.12,-.12,4+u,.24,.24,3,c],[-.08,-.08,7+u,.16,.16,3,c]];
    case 'gem':return[[-.08,-.08,8+u,.16,.16,12,c],[-.04,-.04,20+u,.08,.08,3,'#ffffff']];case 'food':return[[-.12,-.1,4+u,.24,.2,8,c],[-.04,-.04,12+u,.08,.08,3,'#5a8a3a']];
    default:return[[-.12,-.12,6+u,.24,.24,10,c],[-.06,-.06,16+u,.12,.12,3,'#ffffff']]}}
function edEnt(e){const sx=PX(e.px,e.py),sy=PY(e.px,e.py,0),d=e.ed||{};let L=[],top=26;
  if(SET.shad&&e.k!=='edtrig'&&e.k!=='edlight'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(sx,sy,12,6,0,0,6.3);g.fill()}
  switch(e.k){case 'edsign':L=EDIL.sign();top=36;break;case 'ednote':L=EDIL.note();top=24;break;case 'edgem':L=EDIL.gem(d.col||'#5ad0ff');top=34;if(SET.ultra)GLOW.push([e.px,e.py,20,40,rgbOf(d.col||'#5ad0ff'),.3]);nlight(e.px,e.py,20,90,rgbOf(d.col||'#5ad0ff'),.6);break;
    case 'edbed':L=EDIL.bed();top=22;break;case 'edlight':{const c=d.col||'#ffd890';if(EDIT)L=EDIL.light(c);nlight(e.px,e.py,20,d.r||160,rgbOf(c),.95);if(SET.ultra)GLOW.push([e.px,e.py,20,(d.r||160)*.35,rgbOf(c),.3]);top=30;break}
    case 'edi':L=edItemModel(d.item);top=24;break;case 'edres':L=(RESM[d.look]||RESM.grano)();top=24;break;case 'edspawn':L=EDIL.spawn();top=30;break;
    case 'edlever':L=EDIL.lever(!!e.on);top=26;break;case 'edresx':return;
    case 'edtrig':return}
  if(L.length)drawL(L,e.px,e.py,0,e.fl>0);
  const lab=e.n||'';if(lab&&(SET.names||EDIT)&&!(OCC&&OCC.intro)){g.textAlign='center';g.font='bold 11px Georgia,serif';label(lab,sx,sy-top-8,e.k==='edgem'?'#9ae8ff':'#fff')}}
const _ent75=ent;ent=function(e){if(EDIT&&e===P)return;if(e.k&&e.k.charCodeAt(0)===101&&e.k.charCodeAt(1)===100&&e.k.length>2){edEnt(e);return}_ent75(e)};

/* ---- anteprime delle tavolozze: una casella con il suo arredo, disegnata una volta e tenuta in memoria ---- */
const EDTH={},EDTZ={n:'',edm:null,pool:undefined,tc:'#ffb04a'};
// fn disegna la casella (0,0); il centro della casella finisce in basso al centro dell'anteprima
function edThumb(key,fn,w=64,h=72,sc=1.1,pad=10){if(EDTH[key])return EDTH[key];const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const q=c.getContext('2d');
  const og=g,oz=ZZ,ok=Zk,oN=N,oM=M,oD=DEC;g=q;ZZ=EDTZ;Zk='ed_anteprima';
  try{q.setTransform(sc*2,0,0,sc*2,w,h*2-pad*2-16*sc*2);fn()}catch(err){}finally{g=og;ZZ=oz;Zk=ok;N=oN;M=oM;DEC=oD}return EDTH[key]=c.toDataURL()}
function edDecThumb(c){return edThumb('d'+c,()=>{const wt=EDECI[c]&&EDECI[c].water;N=1;M=[[wt?2:6]];DEC=[[c]];
  if(wt){_floor75(0,0,2,.5);return}box(0,0,-6,1,1,6,'#6e8a50');dec(0,0,c,.6)},64,76,1.05,8)}
function edMatThumb(i){const mt=EMAT[i];return edThumb('m'+i,()=>{N=3;M=[[0,0,0],[0,0,0],[0,0,0]];DEC=[['','',''],['','',''],['','','']];for(let y=-1;y<1;y++)for(let x=-1;x<1;x++){box(x+.5,y+.5,-6,1,1,6,(x+y)&1?mt.a:mt.b,.95);if(mt.d)edFloorDet(x+.5,y+.5,mt,.6)}},64,56,.9,6)}
function edWallThumb(i){const st=EWAL[i];return edThumb('w'+i,()=>{N=1;M=[[1]];DEC=[['']];box(0,0,-6,1,1,6,'#6e8a50');st.f(0,0,.6,st.c)},64,90,1,8)}

/* ---- pioggia e lucciole ---- */
const _partUpd75=partUpd;partUpd=function(dt){const ty=ZZ&&ZZ.pt;if(ty==='rain'||ty==='ffly'){edPartUpd(dt,ty);return}_partUpd75(dt)};
function edPartUpd(dt,ty){if(!SET.part){parts.length=0;return}
  if(ty==='rain'){const rate=110*(W/1000);for(let i=0;i<rate*dt&&parts.length<300;i++)parts.push({x:Math.random()*(W+240)-60,y:-20-Math.random()*40,vx:-90,vy:720+Math.random()*240,l:2,ty:'rain'})}
  else for(let i=0;i<5*dt&&parts.length<46;i++)parts.push({x:Math.random()*W,y:H*.15+Math.random()*H*.8,vx:0,vy:0,l:5+Math.random()*5,ty:'ffly',ph:Math.random()*6.28});
  for(const p of parts){p.l-=dt;if(p.ty==='ffly'){p.ph+=dt*2;p.x+=Math.cos(p.ph*1.3)*16*dt;p.y+=Math.sin(p.ph)*11*dt}else{p.x+=p.vx*dt;p.y+=p.vy*dt}}parts=parts.filter(p=>p.l>0&&p.y<H+30)}
const _partDraw75=partDraw;partDraw=function(){const ty=ZZ&&ZZ.pt;if(ty==='rain'||ty==='ffly'){edPartDraw(ty);return}_partDraw75()};
function edPartDraw(ty){g.setTransform(DPR,0,0,DPR,0,0);if(ty==='rain'){g.fillStyle='rgba(30,45,72,.13)';g.fillRect(0,0,W,H);if(!parts.length)return;g.strokeStyle='rgba(185,212,240,.5)';g.lineWidth=1.2;g.beginPath();for(const p of parts){g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.022,p.y-p.vy*.022)}g.stroke();return}
  for(const p of parts){if(p.ty!=='ffly')continue;const a=Math.max(0,Math.sin(p.ph*1.7))*Math.min(1,p.l)*(.35+.65*Math.max(NK,.25));g.globalAlpha=a*.3;g.fillStyle='#e8ff8a';g.fillRect(p.x-5,p.y-5,10,10);g.globalAlpha=a;g.fillRect(p.x-1.5,p.y-1.5,3,3)}g.globalAlpha=1}

/* ================= 7.5: VOXELIA STUDIO — giocare i mondi: missioni, dialoghi, zone evento, azioni, salvataggi ================= */
let EDG=null,EDDL={e:null,node:''},EDTK=0;let EDTR=0;
function edNewState(w){const S2={v:{},q:{},dead:{},open:{},taken:{},used:{},tiles:{},notes:[],gems:{},cines:{},visited:{},bag:{},inT:{},ck:null,musO:null,t0:Date.now(),play:0,kills:0,won:0};
  for(const id in w.vars)S2.v[id]=w.vars[id].v|0;return S2}
// gli oggetti del mondo diventano oggetti veri del gioco
function edMakeItem(id){const d=EW.items[id];if(!d||!'whcs'.includes(d.k))return null;const it={u:uid(),s:d.k,r:d.r|0,v:Math.max(0,d.v|0),n:d.n,p:Math.max(0,d.price|0),ed:id,base:d.base||EBASE[d.k][0]};
  if(d.cr)it.cr=d.cr|0;if(d.hp)it.hp=d.hp|0;if(d.fx){it.fx=d.fx;it.fxv=d.fxv||2}return it}
const _itype75=itype;itype=function(it){if(it&&it.base)return _itype75({s:it.s,n:it.base});return _itype75(it)};
const _lgType75=lgType;lgType=function(){const w=P&&P.eq.w;if(w&&w.base){const T=lgTypeOf(w.base);if(T)return T}return _lgType75()};
const EFXN={fuoco:'🔥 Fuoco',gelo:'❄ Gelo',vampiro:'🩸 Vampiro',fulmine:'⚡ Fulmine',veleno:'☠ Veleno',spinta:'💨 Spinta'};
const _ivDetail75=ivDetail;ivDetail=function(){let h=_ivDetail75();const f=IVSEL&&ivFind(IVSEL);if(f&&f.it&&f.it.fx)h=h.replace('<div class="ivl">','<div class="ivl">'+EFXN[f.it.fx]+' (forza '+(f.it.fxv||2)+')<br>');
  if(f&&f.it&&f.it.ed&&EW&&EW.items[f.it.ed]&&EW.items[f.it.ed].desc)h=h.replace('<div class="ivl">','<div class="ivl"><i>'+esc(EW.items[f.it.ed].desc)+'</i><br>');return h};

/* ---- borsa: oggetti non indossabili ---- */
function edHas(id){if(!id)return 0;let n=EDG.bag[id]|0;for(const it of P.inv)if(it.ed===id)n++;for(const s of'whcs')if(P.eq[s]&&P.eq[s].ed===id)n++;return n}
function edGive(id,n=1,wx,wy){const d=EW.items[id];if(!d)return;n=Math.max(1,n|0);
  if('whcs'.includes(d.k)){for(let i=0;i<n;i++){const it=edMakeItem(id);if(it)gain(it,wx,wy)}}else{EDG.bag[id]=(EDG.bag[id]|0)+n;flt(P,'+'+n+' '+d.n,'#ffe08a');msg('Raccolto: '+d.n+(n>1?' ×'+n:''));
    if(cineOK()&&wx!=null)flyIcon(edItemIconURL(d),scr(wx,wy,20),bagBtn())}
  edQuestCheck();hud()}
function edTake(id,n=1){let k=Math.max(1,n|0);const b=Math.min(EDG.bag[id]|0,k);if(b){EDG.bag[id]-=b;k-=b;if(!EDG.bag[id])delete EDG.bag[id]}
  for(let i=P.inv.length-1;i>=0&&k>0;i--)if(P.inv[i].ed===id){P.inv.splice(i,1);k--}for(const s of'hcsw'){if(k>0&&P.eq[s]&&P.eq[s].ed===id){P.eq[s]=null;k--;if(s==='w')P.eq.w={u:uid(),s:'w',r:0,v:3,n:'Pugnale',p:0}}}recalc();hud()}
function edUse(id){const d=EW.items[id];if(!d||!(EDG.bag[id]>0))return;let used=0;
  if((d.k==='pot'||d.k==='food')&&(d.heal||d.buff)){if(d.heal){const h=Math.min(P.mx-P.hp,d.heal|0);P.hp=Math.min(P.mx,P.hp+(d.heal|0));flt(P,'+'+h,'#66ff66');sceneHeal()}
    if(d.buff==='forza'){P.bA=90;flt(P,'💪','#ffd84a')}else if(d.buff==='pietra'){P.bD=90;flt(P,'🪨','#cccccc')}else if(d.buff==='rigenera'||d.buff==='veloce'){EDG.reg=30;flt(P,'✚','#66ff88')}used=1;tone(520,.1)}
  if(d.k==='note'&&d.txt){PA={ti:d.n,tx:d.txt,back:'inv'};pn('txt');used=1}
  if(d.use&&d.use.length){edRun(d.use,{item:id});used=1}
  if(!used){msg('Non succede niente.');return}if(!d.keep){EDG.bag[id]--;if(!EDG.bag[id])delete EDG.bag[id]}hud();edQuestCheck();if(PM==='inv')pn('inv');save()}
const _invHTML75=invHTML;invHTML=function(){let h=_invHTML75();if(MODE!=='ed'||!EDG)return h;const ks=Object.keys(EDG.bag).filter(k=>EW.items[k]&&EDG.bag[k]>0);
  let b=`<h4>🧺 Oggetti</h4>`;if(!ks.length)b+='<p class="mu">Niente: chiavi, pozioni, lettere e oggetti delle missioni finiscono qui.</p>';
  for(const k of ks){const d=EW.items[k],usable=d.k==='pot'||d.k==='food'||d.k==='note'||(d.use&&d.use.length);b+=`<div class="it"><span><img class="ii" src="${edItemIconURL(d)}" alt=""><b>${esc(d.n)}</b> ×${EDG.bag[k]} <span class="mu">${esc(EITK[d.k]||'')}${d.desc?' · '+esc(d.desc):''}</span></span><span>${usable?`<button onclick="edUse('${k}')">Usa</button>`:''}</span></div>`}
  return h.replace('<div class="ivd">',b+'<div class="ivd">')};

/* ---- condizioni e azioni ---- */
function edQState(id){const q=EDG.q[id];return q?q.st:0}
function edCond(L){if(!Array.isArray(L)||!L.length)return true;for(const c of L){if(!c||!c.c)continue;let ok=true;switch(c.c){
  case 'var':{const a=EDG.v[c.v]|0,b=c.n|0;ok=c.op==='<='?a<=b:c.op==='=='?a===b:c.op==='!='?a!==b:c.op==='>'?a>b:c.op==='<'?a<b:a>=b;break}
  case 'item':ok=edHas(c.item)>=(c.n||1);break;case 'noitem':ok=edHas(c.item)<1;break;
  case 'quest':{const s=edQState(c.q);ok=c.st==='none'?s===0:c.st==='active'?s===1:c.st==='ready'?s===2:c.st==='done'?s===3:s!==3;break}
  case 'lv':ok=P.lv>=(c.n|0);break;case 'gold':ok=P.g>=(c.n|0);break;case 'gems':ok=Object.keys(EDG.gems).length>=(c.n|0);break;
  case 'time':ok=c.st==='night'?nightK()>.5:nightK()<=.5;break;case 'chance':ok=Math.random()*100<(c.n||50);break}if(!ok)return false}return true}
function edSound(s){switch(s){case 'gioia':jingle([67,72,76,79],.1,'triangle');break;case 'mistero':jingle([62,65,68,71],.22,'sine');break;case 'allarme':for(let i=0;i<4;i++)setTimeout(()=>tone(880,.12,'square',.05),i*220);break;
  case 'tuono':tone(50,1.2,'sawtooth',.09);shake(1.2);break;case 'campana':jingle([84,0,79],.4,'sine');break;case 'porta':tone(120,.25,'sawtooth',.05);break;case 'moneta':tone(1200,.06,'triangle');setTimeout(()=>tone(1600,.08,'triangle'),70);break;
  case 'magia':jingle([72,76,79,84,88,91],.06,'sine');break;case 'ruggito':tone(70,.8,'sawtooth',.08);shake(.8);break}}
// esegue le azioni in fila; una cinematica ferma la fila finché non finisce
function edRun(L,ctx,i0){if(!Array.isArray(L)||!EDG)return;ctx=ctx||{};for(let i=i0||0;i<L.length;i++){const a=L[i];if(!a||!a.a)continue;
  if(a.a==='cine'&&EW.cines[a.c]){edCinePlay(a.c,()=>edRun(L,ctx,i+1));return'wait'}try{edDo(a,ctx)}catch(err){console.warn('azione',a,err)}if(!started||MODE!=='ed')return}
  edRefreshCond();edQuestCheck();npcMarks();hud()}
function edDo(a,ctx){const gm=EW.set.gm||1,xm=EW.set.xpm||1;switch(a.a){
  case 'msg':msg(a.tx||'');break;
  case 'say':{const d=EW.npcs[a.npc],e=d?ents.find(q=>q.edn===d.id):null;if(e){e.bub=a.tx||'...';e.bt=Math.max(3,(a.tx||'').length*.07)}if(d){PA={ti:d.n,tx:a.tx||''};pn('txt')}else msg(a.tx||'');break}
  case 'txt':PA={ti:a.ti||'',tx:a.tx||''};pn('txt');break;case 'banner':banner(a.ti||'',a.sub||'','pergamena');break;
  case 'gold':{const n=Math.round((a.n|0)*(a.n>0?gm:1));P.g=Math.max(0,P.g+n);if(n>0){flt(P,'+'+n+' oro','#ffd84a');goldFly(n)}else if(n<0)flt(P,n+' oro','#ff9a8a');break}
  case 'xp':{const n=Math.round((a.n|0)*xm);if(n>0){gainXP(n);flt(P,'+'+n+' XP','#8ad8ff')}break}
  case 'give':edGive(a.item,a.n||1,P.px,P.py);break;case 'take':edTake(a.item,a.n||1);break;case 'pot':P.pot=Math.max(0,P.pot+(a.n|0));flt(P,(a.n>0?'+':'')+(a.n|0)+' 🧪','#88ff88');break;
  case 'heal':P.hp=a.n?Math.min(P.mx,P.hp+(a.n|0)):P.mx;sceneHeal();break;case 'hurt':{P.hp-=Math.max(1,a.n|0);P.fl=.15;flt(P,'-'+(a.n|0),'#ff6666');if(P.hp<=0)die();break}
  case 'var':{const o=EDG.v[a.v]|0,n=a.n|0;EDG.v[a.v]=a.op==='add'?o+n:a.op==='sub'?o-n:a.op==='tog'?(o?0:1):n;break}
  case 'qstart':edQuestStart(a.q,1);break;case 'qstep':edQuestAdvance(a.q,1);break;case 'qdone':edQuestComplete(a.q);break;
  case 'tp':{const mid=a.map&&EW.maps[a.map]?a.map:EM.id,m=EW.maps[mid];let x=a.x,y=a.y;if(!(x>=0&&y>=0)){x=m.sp[0];y=m.sp[1]}x=clamp(x|0,0,m.N-1);y=clamp(y|0,0,m.N-1);cl();whoosh();
    if(edZk(mid)===Zk)irisGo(()=>{heroPut(x,y);heroFix()});else{EDSP=[x,y];irisGo(()=>load(edZk(mid),Zk))}break}
  case 'music':EDG.musO=a.m?{map:Zk,m:edMusKey(a.m)}:null;music(zoneMus());break;case 'sound':edSound(a.s);break;
  case 'spawn':{const n=clamp(a.n|0||1,1,20);if(!E[a.t])break;for(let i=0;i<n;i++){let x=a.x,y=a.y;if(!(x>=0&&y>=0)){const an=Math.random()*6.28,r=2.5+Math.random()*2;x=Math.floor(P.px+Math.cos(an)*r);y=Math.floor(P.py+Math.sin(an)*r)}
    const[fx2,fy2]=nearFree(clamp(x,1,N-2),clamp(y,1,N-2));const o=ZZ.lv;if(a.lv)ZZ.lv=a.lv;const e=mk(a.t,fx2,fy2,40000+Math.floor(Math.random()*90000));ZZ.lv=o;e.al=1;ents.push(e);if(cineOK())sparks(e.px,e.py,10,['#c46bff','#ffffff'],60)}break}
  case 'tile':{const mid=a.map&&EW.maps[a.map]?a.map:EM.id,m=EW.maps[mid];if(!(a.x>=0&&a.y>=0&&a.x<m.N&&a.y<m.N))break;const i=(a.y|0)*m.N+(a.x|0);(EDG.tiles[mid]=EDG.tiles[mid]||{})[i]=a.to||'floor';
    if(mid===EM.id){edTileApply(m,i,a.to||'floor');if(cineOK())sparks((a.x|0)+.5,(a.y|0)+.5,12,['#d8c8a0','#ffffff'],60)}break}
  case 'shop':{const d=EW.npcs[a.npc];if(d){PA=ents.find(q=>q.edn===d.id)||{k:'npc',edn:d.id,n:d.n,nid:edNpcKey(d.id)};pn('edshop')}break}
  case 'shake':shake(1.2);break;case 'flash':flash(a.col||'#ffffff',.7,600);break;
  case 'end':edEnd(a.ti||'Vittoria!',a.tx||EW.set.end||'');break;case 'fail':edFail(a.tx||'')}}
// una casella cambiata da un'azione (ponti che compaiono, muri che crollano)
function edTileApply(m,i,to){const x=i%N,y=i/N|0;if(!M[y])return;if(to==='nodec'){DEC[y][x]='';if(M[y][x]===6)M[y][x]=(EMAT[m.f[i]]||EMAT[0]).road?4:0}
  else if(to==='wall'){M[y][x]=1;DEC[y][x]=''}else if(to==='water'){M[y][x]=2;DEC[y][x]=''}else if(to==='void'){M[y][x]=9;DEC[y][x]=''}else{const mt=EMAT[m.f[i]]||EMAT[0];M[y][x]=mt.road?4:0;DEC[y][x]=''}FC=null}

/* ---- missioni ---- */
function edQAvail(npcId){const L=[];for(const q of Object.values(EW.quests)){if(q.giver!==npcId)continue;const s=EDG.q[q.id];if(s&&(s.st===1||s.st===2))continue;if(s&&s.st===3&&!q.rep)continue;if(P.lv<(q.lv|0)||!edCond(q.req))continue;L.push(q)}return L}
function edQuestStart(id,force){const q=EW.quests[id];if(!q)return;const s=EDG.q[id];if(s&&(s.st===1||s.st===2))return;EDG.q[id]={st:1,s:0,c:0,n:s?s.n|0:0};
  if(cineOK())banner('Missione accettata',q.ti,'pergamena');else msg('Nuova missione: '+q.ti);jingle([67,71,74]);edQuestCheck();npcMarks();hud();save()}
function edStep(id){const q=EW.quests[id],s=EDG.q[id];return q&&s&&s.st===1?q.steps[s.s]:null}
function edQuestAdvance(id,force){const q=EW.quests[id],s=EDG.q[id];if(!q||!s||s.st!==1)return;s.s++;s.c=0;
  if(s.s>=q.steps.length){if(q.turn==='@auto'||(!q.giver&&!q.turn))edQuestComplete(id);else{s.st=2;jingle([67,72]);msg(q.ti+': fatto! Torna da '+((EW.npcs[q.turn||q.giver]||{}).n||'chi te l\'ha affidata'))}}
  else{const st=q.steps[s.s];msg(q.ti+': '+edStepText(st,s));jingle([64,67])}edQuestCheck();npcMarks();hud()}
function edQuestComplete(id){const q=EW.quests[id];if(!q)return;const s=EDG.q[id]||(EDG.q[id]={st:1,s:0,c:0,n:0});if(s.st===3)return;
  for(const st of q.steps)if((st.k==='collect')&&!st.keep&&st.item)edTake(st.item,st.n||1);
  s.st=3;s.n=(s.n|0)+1;const g=Math.round((q.rew.g|0)*(EW.set.gm||1)),x=Math.round((q.rew.x|0)*(EW.set.xpm||1));P.g+=g;if(x)gainXP(x);for(const r of q.rew.items)edGive(r.item,r.n||1,P.px,P.py);
  if(cineOK()){banner('Missione completata',q.ti+(g?' · +'+g+' oro':'')+(x?', +'+x+' XP':''),'spunta');goldFly(g)}else msg('Missione completata: '+q.ti);jingle([72,76,79,84,88],.09);
  if(q.rep)delete EDG.q[id].s;edRun(q.rew.acts,{quest:id});npcMarks();hud();save()}
function edStepText(st,s){if(!st)return'';if(st.tx)return st.tx+(st.n>1&&(st.k==='kill'||st.k==='collect'||st.k==='gems')?' ('+edStepCount(st,s)+'/'+st.n+')':'');const nm=id=>(EW.npcs[id]||{}).n||'?',it=id=>(EW.items[id]||{}).n||'?';
  switch(st.k){case 'kill':return'Sconfiggi '+(st.t&&st.t!=='*'&&E[st.t]?E[st.t].n:'nemici')+(st.map&&EW.maps[st.map]?' in '+EW.maps[st.map].n:'')+' ('+edStepCount(st,s)+'/'+(st.n||1)+')';
    case 'collect':return'Raccogli '+it(st.item)+' ('+edStepCount(st,s)+'/'+(st.n||1)+')';case 'talk':return'Parla con '+nm(st.npc);case 'deliver':return'Porta '+(st.n>1?st.n+'× ':'')+it(st.item)+' a '+nm(st.npc);
    case 'reach':return'Raggiungi il punto indicato in '+((EW.maps[st.map]||{}).n||'?');case 'zone':{const m=EW.maps[st.map],z=m&&m.e.find(e=>e.u===st.z);return'Vai a '+(z&&z.n?z.n:'il luogo indicato')+(m?' ('+m.n+')':'')}
    case 'var':return'Completa l\'impresa';case 'gems':return'Raccogli le gemme ('+Object.keys(EDG.gems).length+'/'+(st.n||1)+')';case 'boss':{const m=EW.maps[st.map],e=m&&m.e.find(q=>q.u===st.u);return'Sconfiggi '+(e?(e.n||E[e.t].n):'il nemico')}}return''}
function edStepCount(st,s){if(st.k==='collect')return Math.min(st.n||1,edHas(st.item));if(st.k==='gems')return Object.keys(EDG.gems).length;return s?s.c|0:0}
// controlla i passi che dipendono dallo stato (oggetti, variabili, gemme, luoghi)
function edQuestCheck(){if(!EDG||!EW)return;for(const id in EDG.q){const s=EDG.q[id];if(s.st!==1)continue;const st=edStep(id);if(!st)continue;let ok=false;
  if(st.k==='collect')ok=edHas(st.item)>=(st.n||1);else if(st.k==='var'){const a=EDG.v[st.v]|0,b=st.n|0;ok=st.op==='=='?a===b:st.op==='<='?a<=b:a>=b}else if(st.k==='gems')ok=Object.keys(EDG.gems).length>=(st.n||1);
  else if(st.k==='reach')ok=EM&&EM.id===st.map&&Math.hypot(P.px-(st.x+.5),P.py-(st.y+.5))<=(st.r||2)+.5;
  if(ok)edQuestAdvance(id)}}
function edQuestKill(e){for(const id in EDG.q){const st=edStep(id);if(!st)continue;const s=EDG.q[id];
  if(st.k==='kill'&&(st.t==='*'||!st.t||st.t===e.t)&&(!st.map||st.map===EM.id)){s.c=(s.c|0)+1;msg(EW.quests[id].ti+': '+s.c+'/'+(st.n||1));if(s.c>=(st.n||1))edQuestAdvance(id)}
  else if(st.k==='boss'&&e.ed&&e.ed.u===st.u)edQuestAdvance(id)}}
function edQuestTalk(npcId){for(const id in EDG.q){const st=edStep(id);if(st&&st.k==='talk'&&st.npc===npcId)edQuestAdvance(id)}}
function edQuestZone(u){for(const id in EDG.q){const st=edStep(id);if(st&&st.k==='zone'&&st.z===u)edQuestAdvance(id)}}
function edDeliver(id){const st=edStep(id);if(!st||st.k!=='deliver')return;if(edHas(st.item)<(st.n||1)){msg('Non hai abbastanza '+((EW.items[st.item]||{}).n||''));return}edTake(st.item,st.n||1);tone(700,.08,'triangle');edQuestAdvance(id);pn('npc')}

/* ---- dialoghi ---- */
function edNode(d,k){let nd=d.dlg.nodes[k]||d.dlg.nodes[d.dlg.start];for(let i=0;i<8&&nd&&nd.cond&&nd.cond.length&&!edCond(nd.cond);i++){if(!nd.alt||!d.dlg.nodes[nd.alt])return null;k=nd.alt;nd=d.dlg.nodes[k]}return nd?{nd,k}:null}
function edNpcHTML(e){const d=EW.npcs[e.edn];if(!d)return`<h3>${esc(e.n||'?')}</h3><p><i>«...»</i></p><button onclick="cl()">Arrivederci</button>`;
  if(EDDL.e!==e){EDDL={e,node:d.dlg.start,first:1}}const r=edNode(d,EDDL.node)||{nd:{tx:'...',opts:[]},k:''};EDDL.node=r.k;let line=r.nd.tx||'...';
  if(EDDL.first&&r.k===d.dlg.start&&d.lines.length&&Math.random()<.5)line=d.lines[Math.floor(Math.random()*d.lines.length)];EDDL.first=0;EDDL.line=EDDL.line&&EDDL.k===r.k?EDDL.line:line;EDDL.k=r.k;line=EDDL.line;
  let h=`<h3>${esc(d.n)}${d.title?' <small>'+esc(d.title)+'</small>':''}</h3><p><i>«${esc(line)}»</i></p>`;
  // missioni: da consegnare, consegne, in corso, nuove
  for(const q of Object.values(EW.quests)){const s=EDG.q[q.id];if(!s)continue;const to=q.turn&&q.turn!=='@auto'?q.turn:q.giver;
    if(s.st===2&&to===d.id){const g=Math.round((q.rew.g|0)*(EW.set.gm||1)),x=Math.round((q.rew.x|0)*(EW.set.xpm||1));h+=`<div class="qb"><b>${esc(q.ti)}</b> — fatto!${q.done?`<p><i>«${esc(q.done)}»</i></p>`:''}<button onclick="edTurnIn('${q.id}')">✔ Consegna${g||x?' (+'+g+'💰, +'+x+' XP)':''}</button></div>`}
    else if(s.st===1){const st=edStep(q.id);if(st&&st.k==='deliver'&&st.npc===d.id)h+=`<div class="qb"><b>${esc(q.ti)}</b><br><button ${edHas(st.item)>=(st.n||1)?'':'disabled'} onclick="edDeliver('${q.id}')">📦 Consegna ${st.n>1?st.n+'× ':''}${esc((EW.items[st.item]||{}).n||'')}</button></div>`;
      else if(q.giver===d.id)h+=`<div class="qb"><b>${esc(q.ti)}</b> <span class="mu">in corso: ${esc(edStepText(st,s))}</span>${q.wait?`<br><i>«${esc(q.wait)}»</i>`:''}</div>`}}
  for(const q of edQAvail(d.id)){const g=Math.round((q.rew.g|0)*(EW.set.gm||1)),x=Math.round((q.rew.x|0)*(EW.set.xpm||1)),it=q.rew.items.map(r=>(EW.items[r.item]||{}).n).filter(Boolean);
    h+=`<div class="qb"><b>📜 ${esc(q.ti)}</b><p>${esc(q.tx).replace(/\n/g,'<br>')}</p><span class="mu">Ricompensa: ${[g?g+'💰':'',x?x+' XP':'',...it].filter(Boolean).join(' · ')||'—'}</span><br><button onclick="edQuestStart('${q.id}');pn('npc')">Accetta</button></div>`}
  r.nd.opts.forEach((o,i)=>{if(edCond(o.cond))h+=`<button onclick="edOptClick(${i})">${esc(o.tx)}</button>`});
  switch(d.role){case 'shop':h+=`<button onclick="pn('edshop')">🛒 Commercia</button>`;break;case 'smith':h+=`<button onclick="pn('smith')">⚒ Forgia e potenzia</button>`;break;case 'alch':h+=`<button onclick="pn('alch')">⚗ Pozioni ed elisir</button>`;break;
    case 'heal':h+=`<button onclick="heal()">✚ Cura completa</button>`;break;case 'inn':h+=`<button onclick="rest()">🛏 Riposa (10💰)</button>`;break;case 'bard':h+=`<button onclick="song()">🎵 Chiedi una canzone</button>`;break;
    case 'casino':h+=`<button onclick="pn('casino')">🎰 Gioca</button>`;break;case 'fisher':if(P.rod<2)h+=`<button onclick="buyRod()">🎣 ${P.rod?'Canna di quercia':'Canna da pesca'} · ${P.rod?300:60}💰</button>`;break;
    case 'buyfish':case 'buyres':h+=`<button onclick="pn('sellres')">💰 Vendi ${d.role==='buyfish'?'il pescato':'i raccolti'}</button>`;break}
  return h+'<button onclick="cl()">Arrivederci</button>'}
function edOptClick(i){const e=EDDL.e,d=e&&EW.npcs[e.edn];if(!d)return;const r=edNode(d,EDDL.node);if(!r)return;const o=r.nd.opts[i];if(!o||!edCond(o.cond))return;
  const pm0=PM,res=edRun(o.acts,{npc:e});if(res==='wait'||!started)return;if(PM!=='npc'&&PM!==pm0)return;if(PM!==pm0&&PM!==0)return;
  if(o.go&&d.dlg.nodes[o.go]){EDDL.node=o.go;EDDL.line=null;PA=e;pn('npc')}else if(PM==='npc')cl()}
function edTurnIn(id){edQuestComplete(id);if(PM==='npc')pn('npc')}
const _npcHTML75=npcHTML;npcHTML=function(e){if(MODE==='ed'&&e&&e.edn&&EW)return dlgWrap(e,edNpcHTML(e));return _npcHTML75(e)};
const _npcMarks75=npcMarks;npcMarks=function(){if(MODE!=='ed'||!EDG||!EW){_npcMarks75();return}
  for(const e of ents){if(e.k!=='npc')continue;if(!e.edn){e.qm='';continue}const id=e.edn;let m='';
    for(const q of Object.values(EW.quests)){const s=EDG.q[q.id];if(s&&s.st===2&&(q.turn&&q.turn!=='@auto'?q.turn:q.giver)===id){m='?';break}}
    if(!m&&edQAvail(id).length)m='!';if(!m)for(const qid in EDG.q){const st=edStep(qid);if(st&&(st.k==='talk'||st.k==='deliver')&&st.npc===id){m='…';break}}e.qm=m}};

/* ---- negozio dei personaggi ---- */
function edShopHTML(){const e=PA,d=e&&EW.npcs[e.edn];if(!d)return'<p>...</p><button onclick="cl()">Chiudi</button>';let h=`<h3>🛒 ${esc(d.n)} · 💰${P.g}</h3>`;
  const st=EDG.stock||(EDG.stock={});d.shop.forEach((s,i)=>{const it=EW.items[s.item];if(!it)return;const pr=s.p>0?s.p|0:Math.max(1,it.price|0),k=d.id+':'+i,left=s.q>0?Math.max(0,s.q-(st[k]|0)):-1;
    h+=`<div class="it"><span><img class="ii" src="${edItemIconURL(it)}" alt=""><b style="color:${'whcs'.includes(it.k)?RC[it.r|0]:'inherit'}">${esc(it.n)}</b> <span class="mu">${'whcs'.includes(it.k)?(it.k==='w'?'ATT ':'DIF ')+(it.v|0)+(it.cr?' · CRIT +'+it.cr+'%':'')+(it.hp?' · PV +'+it.hp:''):esc(it.desc||EITK[it.k]||'')}${left>=0?' · ne restano '+left:''}</span></span><span><button ${left===0||P.g<pr?'disabled':''} onclick="edBuy(${i})">${pr}💰</button></span></div>`});
  if(d.pots)h+=`<div class="it"><span>🧪 Pozione (cura 40%) <span class="mu">ne hai ${P.pot}</span></span><span><button ${P.g<25?'disabled':''} onclick="if(pay(25)){P.pot++;hud();pn('edshop')}">25💰</button></span></div>`;
  if(d.buys!==0){h+=`<h4>Vendi</h4>`;let any=0;P.inv.forEach((it,i)=>{if(it.ar||it.lk)return;any=1;h+=`<div class="it"><span>${fmt(it)}</span><span><button onclick="edSell(${i})">Vendi ${Math.max(1,Math.round((it.p||1)/2))}💰</button></span></div>`});
    for(const k in EDG.bag){const it=EW.items[k];if(!it||!(it.price>0)||it.k==='key'||it.k==='quest')continue;any=1;h+=`<div class="it"><span><img class="ii" src="${edItemIconURL(it)}" alt="">${esc(it.n)} ×${EDG.bag[k]}</span><span><button onclick="edSellB('${k}')">Vendi ${Math.max(1,Math.round(it.price/2))}💰</button></span></div>`}
    if(!any)h+='<p class="mu">Niente da vendere.</p>'}
  return h+`<button onclick="pn('npc')">Indietro</button><button onclick="cl()">Chiudi</button>`}
function edBuy(i){const e=PA,d=e&&EW.npcs[e.edn];if(!d)return;const s=d.shop[i],it=s&&EW.items[s.item];if(!it)return;const pr=s.p>0?s.p|0:Math.max(1,it.price|0),k=d.id+':'+i,st=EDG.stock||(EDG.stock={});
  if(s.q>0&&(st[k]|0)>=s.q)return;if('whcs'.includes(it.k)&&P.inv.length>=INV){msg('Zaino pieno');return}if(!pay(pr))return;st[k]=(st[k]|0)+1;edGive(it.id,1);pn('edshop');hud();save()}
function edSell(i){const it=P.inv[i];if(!it||it.ar||it.lk)return;P.inv.splice(i,1);const g=Math.max(1,Math.round((it.p||1)/2));P.g+=g;tone(1200,.06,'triangle');goldFly(g);pn('edshop');hud();save()}
function edSellB(k){const it=EW.items[k];if(!it||!(EDG.bag[k]>0))return;EDG.bag[k]--;if(!EDG.bag[k])delete EDG.bag[k];const g=Math.max(1,Math.round(it.price/2));P.g+=g;tone(1200,.06,'triangle');pn('edshop');hud();edQuestCheck();save()}
// pannelli propri del mondo: negozio, missioni (J), diario (K)
function edPanel(m,h){PM=m;$('ztc').className='';const pe=$('pn'),was=pe.style.display==='block'&&pe.dataset.m===m;pe.classList.remove('fishp');pe.innerHTML=h;pe.style.display='block';pe.dataset.m=m;if(!was&&cineOK()){pe.classList.remove('pop');void pe.offsetWidth;pe.classList.add('pop')}iconFill(pe);dlgOn(m,pe,was)}
const _pn75=pn;pn=function(m,arg){if(MODE==='ed'&&EDG&&started){if(arg!==undefined)PA=arg;
  if(m==='edshop'){edPanel(m,edShopHTML());return}if(m==='q'){edPanel(m,edQuestPanel());return}if(m==='dia'){edPanel(m,edDiaPanel());return}if(m==='lb'||m==='who'){edPanel(m,`<h3>${esc(EW.name)}</h3><p>${esc(EW.desc||'')}</p><p class="mu">${EW.author?'Un mondo di '+esc(EW.author)+' · ':''}creato con Voxelia Studio</p><button onclick="cl()">Chiudi</button>`);return}}
  _pn75(m,arg)};
function edQuestPanel(){let h=`<h3>📜 Missioni</h3>`;if(EW.set.obj)h+=`<div class="qb"><b>⚜ Obiettivo</b><br>${esc(EW.set.obj)}${EW.set.gems?` · gemme ${Object.keys(EDG.gems).length}/${EW.set.gems}`:''}</div>`;
  const L=Object.values(EW.quests).filter(q=>EDG.q[q.id]);if(!L.length)h+='<p class="mu">Nessuna missione. Cerca i personaggi con il <b style="color:#ffd84a">!</b> sopra la testa.</p>';
  for(const q of L.filter(q=>EDG.q[q.id].st!==3)){const s=EDG.q[q.id],to=EW.npcs[q.turn&&q.turn!=='@auto'?q.turn:q.giver];h+=`<div class="qb"><b>${esc(q.ti)}</b>${EW.npcs[q.giver]?` <span class="mu">da ${esc(EW.npcs[q.giver].n)}</span>`:''}<br>${esc(q.tx)}<br><b>${s.st===2?'✔ Fatto: torna da '+esc(to?to.n:'?'):esc(edStepText(edStep(q.id),s))}</b></div>`}
  const D=L.filter(q=>EDG.q[q.id].st===3);if(D.length)h+=`<h4>Completate</h4>`+D.map(q=>`<div class="it"><span>✔ ${esc(q.ti)}</span></div>`).join('');return h+'<button onclick="cl()">Chiudi</button>'}
function edDiaPanel(){let h=`<h3>📖 Diario · ${esc(EW.name)}</h3>`;const g=Object.keys(EDG.gems).length;if(EW.set.gems||g)h+=`<p>🔷 Gemme: <b>${g}</b>${EW.set.gems?' / '+EW.set.gems:''}</p>`;
  h+=`<h4>Pagine e note (${EDG.notes.length})</h4>`;if(!EDG.notes.length)h+='<p class="mu">Le note che leggi finiscono qui.</p>';
  EDG.notes.forEach((n,i)=>{h+=`<div class="it"><span>📜 ${esc(n.ti)}</span><span><button onclick="PA={ti:EDG.notes[${i}].ti,tx:EDG.notes[${i}].tx,back:'dia'};_pn75('txt')">Leggi</button></span></div>`});
  const vis=Object.keys(EDG.visited).map(k=>EW.maps[k]).filter(Boolean);h+=`<h4>Luoghi visitati (${vis.length}/${Object.keys(EW.maps).length})</h4><p>${vis.map(m=>esc(m.n)).join(' · ')}</p>`;
  return h+`<p class="mu">Nemici sconfitti: ${EDG.kills|0} · Missioni completate: ${Object.values(EDG.q).filter(s=>s.st===3).length}/${Object.keys(EW.quests).length} · Tempo di gioco: ${Math.round((EDG.play|0)/60)} min</p><button onclick="cl()">Chiudi</button>`}

/* ---- gli oggetti del mondo in gioco ---- */
function edPlayEnts(m){const tov=EDG.tiles[m.id];if(tov)for(const i in tov)edTileApply(m,+i,tov[i]);
  for(const d of m.e){if(d.cond&&d.cond.length&&!edCond(d.cond))continue;const e=edMakePlayEnt(d,m);if(e)ents.push(e)}}
function edMakePlayEnt(d,m){const x=d.x,y=d.y,S2=EDG;switch(d.k){
  case 'npc':{const nd=EW.npcs[d.npc];if(!nd)return null;const e=edMakeNpc(nd,x,y);e.ed=d;e.edn=nd.id;e.fc0=d.fc|0;e.n=nd.n;
    if(d.beh==='vaga'){e.wd=1;e.wg=1;e.wt=1+Math.random()*3;e.path=[]}else if(d.beh==='segue'){e.fol=1;e.go=1;e.path=[];e.ft=0}else if(d.beh==='pattuglia'&&d.pts&&d.pts.length){e.go=1;e.path=[];e.pat=[[x,y]].concat(d.pts);e.pi=0;e.pw=1}return e}
  case 'en':{if(!E[d.t])return null;const dt=S2.dead[d.u];if(dt&&(!d.resp||Date.now()-dt<d.resp*1000))return null;const o=ZZ.lv;ZZ.lv=d.lv||m.lv||1;const e=mk(d.t,x,y);ZZ.lv=o;
    if(d.boss&&!E[d.t].boss){e.mx=e.hp=Math.round(e.mx*2.5);e.at*=1.3;e.xp*=4}if(d.boss)e.boss=1;const hm=+d.hp||1,am=+d.at||1;e.mx=e.hp=Math.max(1,Math.round(e.mx*hm));e.at*=am;e.n=d.n||e.n;e.ed=d;if(d.guard==='pass'){e.ag=0;e.pas=1}return e}
  case 'ch':return S2.open[d.u]?null:{k:'ch',px:x+.5,py:y+.5,rich:d.rich?1:0,ed:d};
  case 'po':{const to=EW.maps[d.to],st=d.st||'door',e=po(x,y,edZk(d.to||'_'),{st,n:d.n||(to?to.n:'?')});e.ed=d;e.face=d.face||edPortalFace(x,y);if(st==='cancello')Object.assign(e,{dir:d.dir||'x',span:3,off:-1.5,eo:0,sw:1,sty:d.sty||'ferro'});return e}
  case 'it':{if(S2.taken[d.u])return null;const it=EW.items[d.item];if(!it)return null;return{k:'edi',px:x+.5,py:y+.5,ed:d,n:it.n+(d.n>1?' ×'+d.n:'')}}
  case 'sign':return{k:'edsign',px:x+.5,py:y+.5,ed:d,n:d.ti||'Cartello'};
  case 'note':return S2.taken[d.u]?null:{k:'ednote',px:x+.5,py:y+.5,ed:d,n:d.ti||'Nota'};
  case 'gem':return S2.gems[d.u]?null:{k:'edgem',px:x+.5,py:y+.5,ed:d,n:d.n||'Gemma'};
  case 'lever':return{k:'edlever',px:x+.5,py:y+.5,ed:d,n:d.n||'Leva',on:S2.lev&&S2.lev[d.u]?1:0};
  case 'tc':return{k:'tc',px:x+.5,py:y+.5};case 'light':return{k:'edlight',px:x+.5,py:y+.5,ed:d};case 'bed':return{k:'edbed',px:x+.5,py:y+.5,ed:d,n:'Letto'};
  case 'res':return{k:'edres',px:x+.5,py:y+.5,ed:d,n:d.n||ERES[d.look]||'Risorsa'};case 'fs':return{k:'fs',px:x+.5,py:y+.5,ox:0,oy:0,n:'Punto di pesca'};
  case 'trig':return d.on==='use'?{k:'edtrig',px:d.x+d.w/2,py:d.y+d.h/2,ed:d,n:d.n||''}:null}return null}
ITK.add('edtrig');
// personaggi e oggetti che compaiono o spariscono quando cambiano variabili e missioni
function edRefreshCond(){if(!EM||EDIT||!EDG)return;for(const d of EM.e){if(!d.cond||!d.cond.length)continue;const ex=ents.find(e=>e.ed===d),want=edCond(d.cond);
  if(want&&!ex){const e=edMakePlayEnt(d,EM);if(e){ents.push(e);if(cineOK()&&e.k!=='edtrig')sparks(e.px,e.py,10,['#ffffff','#ffd84a'],60)}}else if(!want&&ex){ents.splice(ents.indexOf(ex),1)}}}
const _act75=act;act=function(e){if(MODE!=='ed'||!EDG){_act75(e);return}const d=e.ed;
  if(e.k==='edi'){const it=EW.items[d.item];if(!it)return;if('whcs'.includes(it.k)&&P.inv.length>=INV){msg('Zaino pieno: fai spazio per raccogliere '+it.n);tone(150,.15);return}ents.splice(ents.indexOf(e),1);if(d.u)EDG.taken[d.u]=1;edGive(d.item,d.n||1,e.px,e.py);save();return}
  if(e.k==='edsign'){PA={ti:d.ti||'Cartello',tx:d.tx||'(Il cartello è vuoto.)'};pn('txt');tone(400,.05,'triangle');return}
  if(e.k==='ednote'){ents.splice(ents.indexOf(e),1);EDG.taken[d.u]=1;EDG.notes.push({ti:d.ti||'Nota',tx:d.tx||''});jingle([64,67,71],.12,'triangle');if(cineOK())sparks(e.px,e.py,10,['#f4e8c8','#ffd98a'],60);PA={ti:d.ti||'Nota',tx:d.tx||'',sub:'La trovi nel Diario (K)'};pn('txt');edRun(d.acts,{});save();return}
  if(e.k==='edgem'){ents.splice(ents.indexOf(e),1);EDG.gems[d.u]=1;const n=Object.keys(EDG.gems).length,tot=EW.set.gems|0;jingle([72,79,84,91],.12,'triangle');if(cineOK()){pillar(e.px,e.py,rgbOf(d.col||'#5ad0ff'),1.4,50);burst(e.px,e.py,20,[d.col||'#5ad0ff','#ffffff'],{v:1.2,up:200,b:0,gr:150,d:1.2})}
    banner((d.n||'Gemma')+(tot?' '+n+'/'+tot:''),tot&&n>=tot?'Le hai trovate tutte!':'','frammento');edRun(d.acts,{});edQuestCheck();save();if(tot&&n>=tot&&!EDG.won)setTimeout(()=>edEnd('Vittoria!',EW.set.end||'Hai trovato tutte le gemme.'),1800);return}
  if(e.k==='edbed'){P.hp=P.mx;EDG.ck={map:EM.id,x:e.px|0,y:e.py|0};if(nightK()>.5&&EW.set.day){const m=((gNow()%DAYM)+DAYM)%DAYM;P.gt+=((m<420?420:1440+420)-m)}flash('#000000',.85,900);msg('Hai dormito: vita piena, partita salvata. Se cadi, ti risvegli qui.');jingle([60,64,67,72],.18,'sine');hud();save();return}
  if(e.k==='edres'){e.k='edresx';e.rt=t+(d.resp||60);if(d.item&&EW.items[d.item])edGive(d.item,1,e.px,e.py);else{P.res[d.look||'grano']=(P.res[d.look||'grano']||0)+1;flt(e,'+1 '+(ERES[d.look]||'risorsa'),'#ffe08a')}tone(660,.06,'triangle');if(cineOK())sparks(e.px,e.py,8,['#ffe08a','#ffffff'],40);return}
  if(e.k==='edtrig'){edTrig(d,1);return}
  if(e.k==='edlever'){const L=EDG.lev||(EDG.lev={});if(d.once&&EDG.used[d.u]){msg('Non si muove più.');return}e.on=e.on?0:1;L[d.u]=e.on;if(d.once)EDG.used[d.u]=1;if(d.v)EDG.v[d.v]=e.on;tone(e.on?240:180,.12,'square',.05);setTimeout(()=>tone(e.on?360:140,.08,'square',.04),90);if(cineOK())sparks(e.px,e.py,6,['#c8c8d0'],40);edRun(e.on?d.acts:d.off,{});save();return}
  if(e.k==='ch'&&d){if(d.key&&edHas(d.key)<1){msg('Il forziere è chiuso a chiave: serve '+((EW.items[d.key]||{}).n||'una chiave')+'.');tone(150,.2);return}EDG.open[d.u]=1;const lv=ZZ.lv||P.lv;
    if(cineOK()){e.k='cho';e.ot=t;sceneChest(e)}else ents.splice(ents.indexOf(e),1);const nr=d.rnd==null?1:d.rnd|0;for(let i=0;i<nr;i++){const q=dropOk({k:'dr',px:e.px+i*.5-.4,py:e.py+.5,it:item(lv+1,e.rich?1:0)});arcFrom(q,e.px,e.py,.25+i*.12);ents.push(q)}
    const gd=d.g>0?d.g|0:Math.round(ri(10,30)*(1+lv)*(e.rich?3:1)*(EW.set.gm||1));P.g+=gd;setTimeout(()=>goldFly(gd,e.px,e.py),250);for(const r of(d.items||[]))edGive(r.item,r.n||1,e.px,e.py);tone(800,.1);msg('Forziere aperto! +'+gd+' oro');edRun(d.acts,{});hud();save();return}
  if(e.k==='po'&&(d||e.edb)){const q=d||{};if(q.key&&edHas(q.key)<1){msg(q.msg||('È chiuso a chiave: serve '+((EW.items[q.key]||{}).n||'una chiave')+'.'));tone(150,.2);return}
    if(q.cond&&q.cond.length&&!edCond(q.cond)){msg(q.msg||'Il passaggio è chiuso.');tone(150,.2);return}if(IRB)return;const to=e.to,fr=Zk;if(!Z[to]){msg('Questo passaggio non porta da nessuna parte.');return}
    if(q.tx>=0&&q.ty>=0)EDSP=[q.tx|0,q.ty|0];whoosh();irisGo(()=>load(to,fr));return}
  if(e.k==='npc'&&e.edn){edQuestTalk(e.edn);EDDL={e:null,node:''};_act75(e);return}
  _act75(e)};
// zona evento
function edTrig(d,use){if(d.once&&EDG.used[d.u])return;if(!edCond(d.cond)){if(use)msg('Non succede niente.');return}if(d.once)EDG.used[d.u]=1;edQuestZone(d.u);edRun(d.acts,{trig:d.u});save()}
function edTrigTick(){if(!EM||!P)return;const px=Math.floor(P.px),py=Math.floor(P.py);for(const d of EM.e){if(d.k!=='trig')continue;const inside=px>=d.x&&px<d.x+d.w&&py>=d.y&&py<d.y+d.h,was=!!EDG.inT[d.u];
  if(inside!==was){EDG.inT[d.u]=inside?1:0;if(inside&&d.on!=='use'&&d.on!=='leave')edTrig(d);else if(!inside&&d.on==='leave')edTrig(d)}}}

/* ---- ciclo di gioco nei mondi dell'editor ---- */
function edPlayTick(dt){if(!EDG||!EM||CNE)return;EDG.play+=dt;edTrigTick();
  for(const e of ents){
    if(e.k==='npc'&&e.pat&&!e.path.length){if((e.pw-=dt)<=0){e.pi=(e.pi+1)%e.pat.length;const[gx,gy]=e.pat[e.pi];e.path=path(e.px|0,e.py|0,gx,gy).slice(0,40);e.pw=1+Math.random()*1.5}}
    else if(e.k==='edresx'&&t>e.rt)e.k='edres';
    else if(e.k==='npc'&&e.fol){if((e.ft-=dt)<=0){e.ft=.45;const d0=dist(e,P);if(d0>12){const[fx2,fy2]=nearFree(P.px|0,P.py|0);e.px=fx2+.5;e.py=fy2+.5;e.path=[]}else if(d0>2.3){const p=path(e.px|0,e.py|0,P.px|0,P.py|0);p.pop();e.path=p.slice(0,30)}else e.path=[]}}
    else if(e.k==='en'){if(e.burn){e.burn.t-=dt;if((e.burn.k=(e.burn.k||0)+dt)>=.5){e.burn.k=0;if(ents.includes(e)){flt(e,e.burn.c==='#9aff6a'?'☠':'🔥','#ff9a4a');hurtE(e,e.burn.d,1)}}if(e.burn&&e.burn.t<=0)delete e.burn}
      if(e.slow&&t>e.slow){e.sp=e.sp0||e.sp;delete e.slow}}}
  if(EDG.reg>0){EDG.reg-=dt;if((EDG.regk=(EDG.regk||0)+dt)>1){EDG.regk=0;P.hp=Math.min(P.mx,P.hp+Math.ceil(P.mx*.02))}}
  if((EDTK+=dt)>.3){EDTK=0;edQuestCheck();if((EDTR=(EDTR||0)+1)>3){EDTR=0;edRespawn()}}}
function edRespawn(){for(const d of EM.e){if(d.k!=='en'||!d.resp)continue;const dt=EDG.dead[d.u];if(!dt||Date.now()-dt<d.resp*1000)continue;if(ents.some(e=>e.ed===d))continue;if(Math.hypot(P.px-d.x,P.py-d.y)<6)continue;if(d.cond&&d.cond.length&&!edCond(d.cond))continue;
  delete EDG.dead[d.u];const e=edMakePlayEnt(d,EM);if(e){ents.push(e);if(cineOK())sparks(e.px,e.py,8,['#c46bff'],50)}}}
const _upd75b=upd;upd=function(dt){_upd75b(dt);if(MODE==='ed'&&!EDIT&&started)edPlayTick(dt)};
// effetti delle armi speciali
const _hurtP75=hurtP;hurtP=function(at){if(MODE==='ed'&&typeof CNE!=='undefined'&&CNE)return;_hurtP75(at)};
const _hurtE75=hurtE;hurtE=function(e,d,rem,cr){const w=MODE==='ed'&&!rem&&P&&P.eq.w&&P.eq.w.fx?P.eq.w:null;_hurtE75(e,d,rem,cr);if(!w||!e||e.k!=='en')return;const k=w.fxv||2,alive=ents.includes(e);
  switch(w.fx){case 'fuoco':if(alive)e.burn={t:2+k*.6,d:Math.max(1,Math.round(d*.08*k)),c:'#ff6a2a'};break;case 'veleno':if(alive)e.burn={t:4+k*1.5,d:Math.max(1,Math.round(d*.05*k)),c:'#9aff6a'};break;
    case 'gelo':if(alive){if(!e.slow)e.sp0=e.sp;e.sp=(e.sp0||e.sp)*Math.max(.25,.7-k*.08);e.slow=t+1.5+k*.5;if(cineOK())sparks(e.px,e.py,5,['#bff4ff','#ffffff'],40)}break;
    case 'vampiro':{const h=Math.max(1,Math.round(d*.05*k));P.hp=Math.min(P.mx,P.hp+h);flt(P,'+'+h,'#ff6a8a');break}
    case 'fulmine':{let b=null,bd=3.2;for(const o of ents)if(o!==e&&o.k==='en'){const q=dist(o,e);if(q<bd){bd=q;b=o}}if(b){fx.push({k:'trail',x:e.px,y:e.py,x2:b.px,y2:b.py,t:.3});_hurtE75(b,Math.max(1,Math.round(d*.25*k)),1);tone(1400,.05,'square',.03)}break}
    case 'spinta':if(alive&&!e.boss){const dd=dist(e,P)||1;mv(e,(e.px-P.px)/dd*.25*k,(e.py-P.py)/dd*.25*k)}break}};
const _kill75=kill;kill=function(e){const ed=MODE==='ed'&&EDG&&e&&e.k==='en'&&ents.includes(e);_kill75(e);if(!ed)return;EDG.kills=(EDG.kills|0)+1;const d=e.ed;
  if(d){EDG.dead[d.u]=Date.now();if(d.drop&&EW.items[d.drop]){const it=EW.items[d.drop];if('whcs'.includes(it.k)){const g=edMakeItem(d.drop);if(g)ents.push({k:'dr',px:e.px,py:e.py,it:g})}else ents.push({k:'edi',px:e.px+.3,py:e.py+.2,ed:{item:d.drop,n:1},n:it.n})}
    edRun(d.acts,{})}edQuestKill(e);npcMarks();hud()};
const _die75=die;die=function(){if(MODE!=='ed'||!EDG){_die75();return}sceneDeath();if(EW.set.perm&&!EDPLAY.test){edFail('Sei caduto. Con la morte permanente l\'avventura finisce qui.',1);return}
  P.hp=P.mx;if((EW.set.diff|0)>0)P.g=Math.floor(P.g*.9);const ck=EDG.ck&&EW.maps[EDG.ck.map]?EDG.ck:{map:EW.start.map,x:EW.start.x,y:EW.start.y};EDSP=[ck.x,ck.y];
  irisGo(()=>load(edZk(ck.map),null));msg('Sei stato sconfitto: ti risvegli '+(EDG.ck?'dove hai dormito l\'ultima volta':'all\'inizio')+'.')};
const _load75=load;load=function(k,from){_load75(k,from);if(MODE==='ed'&&!EDIT&&ZZ&&ZZ.ed&&Zk===k)edOnEnter()};
function edOnEnter(){EM=ZZ.edm;if(EDSP){const[x,y]=EDSP;EDSP=null;if(x>=0&&y>=0&&x<N&&y<N){heroPut(x,y);heroFix()}}const first=!EDG.visited[EM.id];EDG.visited[EM.id]=1;EDG.inT={};
  const px=Math.floor(P.px),py=Math.floor(P.py);for(const d of EM.e)if(d.k==='trig'&&px>=d.x&&px<d.x+d.w&&py>=d.y&&py<d.y+d.h)EDG.inT[d.u]=1;
  if(!EDG.ck)EDG.ck=null;npcMarks();if(EM.cine&&!EDG.cines['m:'+EM.id]&&EW.cines[EM.cine]){EDG.cines['m:'+EM.id]=1;edCinePlay(EM.cine,()=>edRun(EM.enter,{}))}else if(EM.enter&&EM.enter.length)edRun(EM.enter,{});hud()}
const _zm75=zoneMus;zoneMus=function(){if(MODE==='ed'&&EDG&&EDG.musO&&EDG.musO.map===Zk)return EDG.musO.m;return _zm75()};
const _tt75b=timeTick;timeTick=function(dt){if(MODE==='ed'&&EW&&!EDIT){lastDay=0;if(!EW.set.day){const g0=P.gt;_tt75b(dt);P.gt=g0;return}}_tt75b(dt)};
const _so75=storyObj;storyObj=function(s){if(MODE==='ed')return'';return _so75(s)};
let EDQTh='';const _hud75=hud;hud=function(){_hud75();if(MODE!=='ed'||!EDG||!EW||EDIT)return;let q='';
  if(EW.set.obj)q+=`${ico('corona')} ${esc(EW.set.obj)}${EW.set.gems?' ('+Object.keys(EDG.gems).length+'/'+EW.set.gems+')':''}<br>`;else if(EW.set.gems)q+=`${ico('frammento')} Gemme: <b>${Object.keys(EDG.gems).length}/${EW.set.gems}</b><br>`;
  for(const id in EDG.q){const s=EDG.q[id],Q=EW.quests[id];if(!Q||s.st===3)continue;q+=`${ico(s.st===2?'spunta':'punto')} ${esc(Q.ti)}: <b>${esc(s.st===2?'consegna a '+((EW.npcs[Q.turn&&Q.turn!=='@auto'?Q.turn:Q.giver]||{}).n||'?'):edStepText(edStep(id),s))}</b><br>`}
  if(q!==EDQTh){EDQTh=q;$('qt').innerHTML=q}};
const _om75=openMap;openMap=function(){if(MODE==='ed'&&EDG){edMapView();return}_om75()};
function edMapView(){const c=document.createElement('canvas');c.width=c.height=300;const q=c.getContext('2d');if(MC)q.drawImage(MC,0,0,300,300);const s=300/N;
  for(const e of ents){if(e.k==='npc'){q.fillStyle=e.qm?'#ffd84a':'#eeee99'}else if(e.k==='po'){q.fillStyle='#44eeff'}else if(e.k==='edgem'){q.fillStyle='#5ad0ff'}else continue;q.fillRect(e.px*s-3,e.py*s-3,6,6)}
  q.fillStyle='#fff';q.strokeStyle='#000';q.beginPath();q.arc(P.px*s,P.py*s,5,0,6.3);q.fill();q.stroke();
  edPanel('map',`<h3>🗺 ${esc(EM.n)}</h3><img src="${c.toDataURL()}" alt="" style="width:100%;max-width:300px;display:block;margin:0 auto;image-rendering:pixelated;border:1px solid #f5b94266"><p class="mu">Bianco: tu · giallo: personaggi · azzurro: passaggi · blu: gemme</p><button onclick="cl()">Chiudi</button>`)}

/* ---- inizio, salvataggio, fine ---- */
function edPlay(w,o={}){EW=w;EDIT=0;MODE='ed';cineReset();auInit();cineOff();edRegAll();const el=$('ed');if(el)el.style.display='none';document.body.classList.remove('edm','dimm');
  const sv=!o.test&&!o.fresh?LS.get(EDSK+w.id,null):null;EDPLAY={test:!!o.test,wid:w.id};DF=DFS[w.set.diff]||DFS[1];P=newP();gndLoad(null);
  Object.assign(P,{lv:w.set.lv|0||1,g:w.set.g|0,pot:w.set.pot|0,unl:{mulino:1},res:{},fish:{},stash:[],sold:{},room:0,bag:0,rod:w.set.rod?1:0,gt:w.set.time||480});INV=clamp(w.set.bag|0||24,8,60);
  P.eq={w:null,h:null,c:null,s:null};for(const s of'whcs'){const id=w.set.gear[s];if(id){const it=edMakeItem(id);if(it&&it.s===s)P.eq[s]=it}}if(!P.eq.w)P.eq.w={u:uid(),s:'w',r:0,v:3,n:'Pugnale',p:0};
  EDG=edNewState(w);if(sv&&sv.g&&sv.p){EDG=Object.assign(edNewState(w),sv.g);for(const k in sv.p)if(sv.p[k]!=null)P[k]=sv.p[k];if(!P.eq.w)P.eq.w={u:uid(),s:'w',r:0,v:3,n:'Pugnale',p:0};P.ap=apFix(P.ap||APM)}
  recalc();if(!sv)P.hp=P.mx;NET.code='';NET.name=($('nm').value.trim()||NET.name||'Eroe').replace(/[<>]/g,'').slice(0,14);NET.tm=null;lastDay=0;SZ=1;
  $('menu').style.display='none';closeSet();document.body.classList.add('ig','edplay');inMenu=0;started=1;last=performance.now();PM=0;$('pn').style.display='none';
  let mid=w.start.map,x=w.start.x,y=w.start.y;if(sv&&sv.g&&EW.maps[sv.g.map]){mid=sv.g.map;x=sv.g.x;y=sv.g.y}if(o.map&&EW.maps[o.map]){mid=o.map;x=o.x;y=o.y}
  EDSP=[x,y];edBackBtn();load(edZk(mid),null);hudApply();wheelApply();hud();
  if(!sv&&!o.map&&w.set.intro&&EW.cines[w.set.intro])edCinePlay(w.set.intro);else if(!sv&&!o.map&&!o.test){PA={ti:w.name,tx:(w.desc||'Buona avventura!')+'\n\nI: zaino · J: missioni · K: diario · M: mappa · R: interagisci · WASD o clic: muoviti'};pn('txt')}}
function edPlaySave(){if(MODE!=='ed'||!EDG||EDIT||!started||!EW)return;EDG.map=EM?EM.id:EW.start.map;EDG.x=P.px|0;EDG.y=P.py|0;if(EDPLAY&&EDPLAY.test)return;
  LS.set(EDSK+EW.id,{g:EDG,t:Date.now(),name:NET.name,p:{lv:P.lv,xp:P.xp,g:P.g,pot:P.pot,hp:P.hp,eq:P.eq,inv:P.inv,gt:P.gt,kills:P.kills,res:P.res,fish:P.fish,rod:P.rod,ap:P.ap,bA:0,bD:0}})}
const _save75=save;save=function(){if(MODE==='ed'){if(!EDIT)edPlaySave();return}_save75()};
function edBackBtn(){let b=$('edback');if(!b){b=document.createElement('div');b.id='edback';document.body.appendChild(b)}
  b.innerHTML=EDPLAY&&EDPLAY.test?`<button onclick="edBackToEditor()">⏹ Torna all'editor</button>${window.GAME_WS&&typeof MediaRecorder!=='undefined'?`<button title="Registra un video della partita per l'anteprima della pubblicazione" onclick="mcamOpen('vid')">⏺ Video</button>`:''}${window.GAME_WS?`<button title="Scatta una foto per l'anteprima della pubblicazione" onclick="mcamOpen('img')">📷 Foto</button>`:''}`:`<button onclick="toMenu()" title="Salva ed esci">⏏ Esci</button>`;b.style.display='block'}
function edBackToEditor(){if(typeof edCineStop==='function')edCineStop();cl();cineOff();const b=$('edback');if(b)b.style.display='none';const el=$('edend');if(el)el.remove();document.body.classList.remove('ig','edplay','edcine');
  PM=0;$('pn').style.display='none';EDG=null;EDIT=1;MODE='ed';P=newP();P.px=P.py=-60;P.unl={mulino:1};DF=DFS[1];const e2=$('ed');if(e2)e2.style.display='';document.body.classList.add('edm');
  const wh=$('ruota');if(wh)wh.style.display='none';edRegAll();const mid=EDS.back&&EW.maps[EDS.back.map]?EDS.back.map:EW.start.map;edOpenMap(mid,1);if(EDS.back){EDS.cam.x=EDS.back.x;EDS.cam.y=EDS.back.y}music(EDS.mus?ZZ.mus:'menu')}
function edTest(here){if(!EW)return;edSaveNow(1);EDS.back={map:EM.id,x:EDS.cam.x,y:EDS.cam.y};const o={test:1};if(here){o.map=EM.id;const[x,y]=nearFreeIn(EM,EDS.cam.x|0,EDS.cam.y|0);o.x=x;o.y=y}EDIT=0;edPlay(EW,o)}
function nearFreeIn(m,x,y){const n=m.N,ok=(a,b)=>a>=0&&b>=0&&a<n&&b<n&&m.t[b*n+a]===0&&!(m.d[b*n+a]&&!m.dw[b*n+a]&&!edDecWalk(m.d[b*n+a]))&&!m.b.some(q=>a>=q.x&&a<q.x+q.w&&b>=q.y&&b<q.y+q.h);
  for(let r=0;r<n;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(ok(x+dx,y+dy))return[x+dx,y+dy]}return[x,y]}
// il salvataggio della storia non va mai toccato: si salva il mondo e si esce con il gioco già fermo
const _toMenu75=toMenu;toMenu=function(){if(MODE==='ed'&&!EDIT){if(EDPLAY&&EDPLAY.test){edBackToEditor();return}edPlaySave();if(typeof edCineStop==='function')edCineStop();const b=$('edback');if(b)b.style.display='none';const el=$('edend');if(el)el.remove();
    document.body.classList.remove('edplay');started=0;MODE='story';EDG=null;_toMenu75();mode('parco');return}_toMenu75()};
function edEnd(ti,tx){if(!EDG)return;EDG.won=1;edPlaySave();cl();const g=Object.keys(EDG.gems).length,qd=Object.values(EDG.q).filter(s=>s.st===3).length;jingle([72,76,79,84,88,91,96],.12,'triangle');if(cineOK())coinRain(40);
  let el=$('edend');if(!el){el=document.createElement('div');el.id='edend';document.body.appendChild(el)}
  el.innerHTML=`<div class="edeb"><h2>${esc(ti||'Vittoria!')}</h2><p>${esc(tx||'').replace(/\n/g,'<br>')}</p><div class="edes"><span>⏱ ${Math.max(1,Math.round(EDG.play/60))} min</span><span>💀 ${EDG.kills|0} nemici</span><span>📜 ${qd} missioni</span>${g?`<span>🔷 ${g} gemme</span>`:''}<span>⭐ livello ${P.lv}</span></div>
    <p class="mu">${esc(EW.name)}${EW.author?' · un mondo di '+esc(EW.author):''}</p><button onclick="this.closest('#edend').remove()">Continua a esplorare</button><button onclick="toMenu()">${EDPLAY&&EDPLAY.test?'Torna all\'editor':'Torna al menu'}</button></div>`}
function edFail(tx,perm){if(!EDG)return;cl();if(perm&&EDPLAY&&!EDPLAY.test)LS.del(EDSK+EW.id);let el=$('edend');if(!el){el=document.createElement('div');el.id='edend';document.body.appendChild(el)}tone(70,1,'sawtooth',.08);
  el.innerHTML=`<div class="edeb fail"><h2>Partita persa</h2><p>${esc(tx||'').replace(/\n/g,'<br>')}</p><button onclick="this.closest('#edend').remove();${perm?'toMenu()':`EDSP=[EW.start.x,EW.start.y];P.hp=P.mx;load(edZk(EW.start.map),null)`}">${perm?'Torna al menu':'Ricomincia dall\'inizio della mappa'}</button>${perm?'':'<button onclick="toMenu()">Esci</button>'}</div>`}

/* ================= 7.5: VOXELIA STUDIO — l'editor: strumenti, pennelli, oggetti, annulla e rifai ================= */
const EDS={tool:'paint',mat:0,wall:0,dec:'r',decK:'Natura',decQ:'',brush:1,shape:'brush',walk:0,scatter:0,sel:null,npc:'',en:'slime',enLv:0,enBoss:0,obj:'ch',por:'exit',porTo:'',porBack:1,
  bst:'casa',bwall:'#e0d0b0',broof:'#a8402f',bht:26,bdoor:1,bto:'',stK:'start',erase:'all',grid:1,dark:0,mus:0,labels:1,cam:{x:16,y:16},hover:null,drag:null,undo:[],redo:[],fdirty:0,ftime:0,dirty:0,saveT:0,pan:null,touches:{},
  itemSel:'',objCol:'#5ad0ff',sideTab:'',key:0};
const EDTOOLS=[['sel','sel','Seleziona e sposta (anche una casella: terreno, muro, decorazione)','V',0],['area','area','Area: copia, taglia, incolla, sposta, ruota, specchia','R',0],['hand','hand','Muovi la vista','H',0],
  ['paint','grass','Terreno','B',1],['wall','brick','Muri','M',1],['water','water','Acqua e lava','A',1],['void','void','Vuoto (burrone)','X',1],['dec','tree','Decorazioni e arredi','D',1],['bld','house','Edifici','E',1],
  ['npc','person','Personaggi','N',2],['en','monster','Nemici','K',2],['obj','chest','Oggetti e forzieri','O',2],['por','door','Porte e passaggi','P',2],['trig','bolt','Zone evento (trigger)','T',2],['start','flag','Punto di partenza','S',2],
  ['stamp','stamp','Timbri e modelli pronti','U',3],['erase','eraser','Gomma','G',3],['pick','dropper','Contagocce','I',3]];
const EDTI={};EDTOOLS.forEach(q=>EDTI[q[0]]=q);
const EDOBJ=[['ch','🧰','Forziere'],['it','💎','Oggetto a terra'],['sign','🪧','Cartello'],['note','📜','Nota o pagina di diario'],['gem','🔷','Gemma da collezionare'],['tc','🔥','Torcia'],['light','💡','Luce colorata'],
  ['bed','🛏','Letto (riposo e salvataggio)'],['lever','🕹','Leva o interruttore'],['res','🌾','Risorsa da raccogliere'],['fs','🎣','Punto di pesca']];
const EDOBJI={};EDOBJ.forEach(o=>EDOBJI[o[0]]=o);

/* ---- entrare nell'editor ---- */
function edOpen(id){const w=id?edLoadWorld(id):null;if(!w){edToast('Mondo non trovato','err');return}EW=w;edEnter()}
function edEnter(){cineReset();auInit();cineOff();EDIT=1;MODE='ed';EDPLAY=null;DF=DFS[1];P=newP();P.px=P.py=-60;P.unl={mulino:1};NET.code='';NET.name=NET.name||'Autore';
  $('menu').style.display='none';closeSet();inMenu=0;started=1;last=performance.now();document.body.classList.remove('ig','dimm');document.body.classList.add('edm');PM=0;$('pn').style.display='none';
  const wh=$('ruota');if(wh)wh.style.display='none';SZ=1;EDS.undo=[];EDS.redo=[];EDS.sel=null;edRegAll();edUI();edOpenMap(EW.start.map&&EW.maps[EW.start.map]?EW.start.map:Object.keys(EW.maps)[0]);music(EDS.mus?ZZ.mus:'menu')}
// registra nel gioco tutto ciò che il mondo definisce: zone, personaggi, brani
function edRegAll(){for(const id in EW.maps)edZone(EW.maps[id]);for(const id in EW.npcs)edRegNpc(EW.npcs[id]);for(const id in EW.songs)edRegSong(EW.songs[id])}
function edOpenMap(id,keep){if(!EW.maps[id])id=Object.keys(EW.maps)[0];EM=EW.maps[id];EDS.sel=null;edZone(EM);edBuild();
  if(!keep){EDS.cam.x=EM.sp[0]+.5;EDS.cam.y=EM.sp[1]+.5;camX=PX(EDS.cam.x,EDS.cam.y);camY=PY(EDS.cam.x,EDS.cam.y,10)}
  const sel=$('edmap');if(sel)sel.innerHTML=edMapOpts(EM.id);edSide();edStat();if(EDS.mus)music(ZZ.mus)}
function edMapOpts(cur){return Object.values(EW.maps).map(m=>`<option value="${m.id}"${m.id===cur?' selected':''}>${esc(m.n)} (${m.N}×${m.N})${EW.start.map===m.id?' 🚩':''}</option>`).join('')}
function edBuild(){const z=Z[edZk(EM.id)];Zk=edZk(EM.id);ZZ=z;N=z.N;R=Math.random;eid=0;M=grid(0);DEC=grid('');BM=null;FC=null;ents=[];fx=[];pop=[];PJ=[];parts=[];
  edGen(z);HHc=new Float32Array(N*N);for(let y=0;y<N;y++)for(let x=0;x<N;x++)HHc[y*N+x]=hh(x,y);$('zn').innerHTML=esc(z.n)}
// rifà solo gli oggetti (dopo averne messo, tolto o spostato uno)
function edRebuildEnts(){ents=ents.filter(e=>!e.ref&&!e.edb);edEditEnts(EM)}
function edEditEnts(m){for(const d of m.e){const e=edDispEnt(d);if(e){e.ref=d;ents.push(e)}}}
function edDispEnt(d){const x=d.x,y=d.y;switch(d.k){
  case 'npc':{const nd=EW.npcs[d.npc];if(!nd)return{k:'edsign',px:x+.5,py:y+.5,n:'? personaggio cancellato'};const e=edMakeNpc(nd,x,y);e.fc0=d.fc|0;e.n=nd.n;return e}
  case 'en':{if(!E[d.t])return{k:'edsign',px:x+.5,py:y+.5,n:'? nemico'};const o=ZZ.lv;if(d.lv)ZZ.lv=d.lv;const e=mk(d.t,x,y);ZZ.lv=o;e.n=d.n||E[d.t].n;if(d.boss)e.boss=1;return e}
  case 'ch':return{k:'ch',px:x+.5,py:y+.5,rich:d.rich?1:0};
  case 'po':{const to=EW.maps[d.to],st=d.st||'door',e=po(x,y,edZk(d.to||'_'),{st,n:d.n||(to?'→ '+to.n:'(senza destinazione)')});e.face=d.face||edPortalFace(x,y);if(st==='cancello')Object.assign(e,{dir:d.dir||'x',span:3,off:-1.5,eo:0,sw:1,sty:d.sty||'ferro'});return e}
  case 'it':{const it=EW.items[d.item];return{k:'edi',px:x+.5,py:y+.5,ed:d,n:it?it.n+(d.n>1?' ×'+d.n:''):'? oggetto'}}
  case 'sign':return{k:'edsign',px:x+.5,py:y+.5,ed:d,n:d.ti||'Cartello'};
  case 'note':return{k:'ednote',px:x+.5,py:y+.5,ed:d,n:d.ti||'Nota'};
  case 'gem':return{k:'edgem',px:x+.5,py:y+.5,ed:d,n:d.n||'Gemma'};
  case 'tc':return{k:'tc',px:x+.5,py:y+.5};
  case 'light':return{k:'edlight',px:x+.5,py:y+.5,ed:d};
  case 'bed':return{k:'edbed',px:x+.5,py:y+.5,ed:d,n:'Letto'};
  case 'lever':return{k:'edlever',px:x+.5,py:y+.5,ed:d,n:d.n||'Leva'};
  case 'res':return{k:'edres',px:x+.5,py:y+.5,ed:d,n:d.n||ERES[d.look]||'Risorsa'};
  case 'fs':return{k:'fs',px:x+.5,py:y+.5,ox:0,oy:0,n:'Punto di pesca'};
  case 'trig':return{k:'edtrig',px:x+.5,py:y+.5,ed:d}}return null}

/* ---- l'interfaccia ---- */
function edUI(){let el=$('ed');if(!el){el=document.createElement('div');el.id='ed';document.body.appendChild(el)}
  el.innerHTML=`<div id="edtop"><button class="edw" title="Impostazioni del mondo" onclick="edWorldWin()">🌍 <b id="edwn">${esc(EW.name)}</b></button>
    <span class="edg"><select id="edmap" title="Mappa che stai modificando" onchange="edGoMap(this.value)">${edMapOpts(EM?EM.id:'')}</select><button title="Mappe del mondo: nuova, duplica, elimina" onclick="edMapsWin()">🗺</button><button title="Proprietà di questa mappa (luce, cielo, musica, dimensioni...)" onclick="edMapWin()">⚙</button></span>
    <span class="edg"><button title="Annulla (Ctrl+Z)" onclick="edUndo()">↶</button><button title="Rifai (Ctrl+Y)" onclick="edRedo()">↷</button><button title="Cronologia delle modifiche" onclick="edHistWin()">⏱</button><button title="Salva (Ctrl+S)" onclick="edSaveNow()">💾</button></span>
    <span class="edg"><button class="edplay" title="Prova il mondo dall'inizio" onclick="edTest(0)">▶ Prova</button><button title="Prova partendo dal centro della vista" onclick="edTest(1)">▶ da qui</button><button class="edpub" title="Pubblica il mondo nel browser dei mondi: titolo, anteprime e video" onclick="mpubOpen()">🌐 <span class="lb">Pubblica</span></button></span>
    <span class="edg edwins"><button onclick="edNpcWin()" title="Personaggi: aspetto, dialoghi, negozi">🧑 <span class="lb">Personaggi</span></button><button onclick="edQuestWin()" title="Missioni">📜 <span class="lb">Missioni</span></button><button onclick="edItemWin()" title="Armi, armature, pozioni, chiavi e oggetti">⚔ <span class="lb">Oggetti</span></button>
      <button onclick="edSongWin()" title="Musiche">🎵 <span class="lb">Musica</span></button><button onclick="edCineWin()" title="Cinematiche">🎬 <span class="lb">Cinematiche</span></button><button onclick="edVarWin()" title="Variabili del mondo">🔣 <span class="lb">Variabili</span></button></span>
    <span class="edg"><button title="Controlla il mondo: porte senza destinazione, missioni impossibili, oggetti irraggiungibili..." onclick="edCheckWin()">🩺</button><button title="Guida e comandi" onclick="edHelp()">❓</button><button title="Torna al menu (salva)" onclick="edExit()">✖</button></span></div>
  <div id="edleft">${EDTOOLS.map(([k,i,n,h,gr],j)=>(j&&EDTOOLS[j-1][4]!==gr?'<hr>':'')+`<button data-t="${k}" title="${n} (${h})" onclick="edTool('${k}')">${edI(i)}</button>`).join('')}<hr><button title="Griglia" id="edgrid" onclick="EDS.grid=!EDS.grid;edTool(EDS.tool)">${edI('grid')}</button><button title="Mostra la luce vera (notte, buio, interni)" id="eddark" onclick="EDS.dark=!EDS.dark;edTool(EDS.tool)">🌙</button><button title="Musica della mappa" id="edmus" onclick="EDS.mus=!EDS.mus;music(EDS.mus?ZZ.mus:'menu');edTool(EDS.tool)">♪</button></div>
  <div id="edside"></div><div id="edstat"></div><div id="edwin" hidden></div>`;edStatBar();edTool(EDS.tool);edTopFit()}
// la barra in alto può andare a capo su schermi stretti: gli strumenti e il pannello partono sotto di lei
function edTopFit(){const t=$('edtop'),r=$('ed');if(t&&r)r.style.setProperty('--edt',(t.offsetHeight+2)+'px')}
addEventListener('resize',()=>{if(EDIT)edTopFit()});
function edGoMap(id){if(!EW.maps[id])return;edOpenMap(id)}
function edTool(k){EDS.tool=k;EDS.drag=null;if(k!=='sel')EDS.sel=null;if(k!=='area'&&k!=='stamp')EDS.paste=null;for(const b of document.querySelectorAll('#edleft button[data-t]'))b.classList.toggle('on',b.dataset.t===k);
  const tg=(id,v)=>{const b=$(id);if(b)b.classList.toggle('on',!!v)};tg('edgrid',EDS.grid);tg('eddark',EDS.dark);tg('edmus',EDS.mus);edSide()}
function edSide(){const el=$('edside');if(!el||!EW||!EM)return;el.innerHTML=edSideHTML();edSideAfter()}
function edBrushHTML(fill){const B=[1,2,3,5,7];return`<div class="edrow"><span>Pennello</span><span class="seg">${B.map(b=>`<button class="${EDS.brush===b?'on':''}" onclick="EDS.brush=${b};edSide()">${b}</button>`).join('')}</span></div>
  <div class="edrow"><span>Forma</span><span class="seg">${[['brush','✎','Pennello'],['rect','▭','Rettangolo pieno'],['line','╱','Linea'],...(fill?[['fill','🪣','Riempi l\'area']]:[])].map(([k,i,n])=>`<button title="${n}" class="${EDS.shape===k?'on':''}" onclick="EDS.shape='${k}';edSide()">${i}</button>`).join('')}</span></div>`}
function edSideHTML(){const T=EDS.tool,m=EM;let h='';
  switch(T){
  case 'sel':h=(EDS.sel?(EDS.sel.k==='tile'?'':`<h4>👆 Seleziona</h4>`)+edPropsHTML(EDS.sel):`<h4>👆 Seleziona</h4><p class="mu">Clicca un personaggio, un nemico, un oggetto, una porta, un edificio o una zona evento per modificarlo. Trascinalo per spostarlo. <kbd>Canc</kbd> lo elimina, <kbd>Ctrl+D</kbd> lo duplica, <kbd>Maiusc+frecce</kbd> lo sposta di una casella.</p><p class="mu">Clicca una casella vuota per cambiarne terreno, muro e decorazione, o per sostituirli in tutta la mappa.</p>`);break;
  case 'hand':h=`<h4>✋ Muovi la vista</h4><p class="mu">Trascina per spostare la vista. Lo fai anche con il tasto destro o centrale del mouse con qualsiasi strumento, o con le frecce. La rotella ingrandisce.</p>`;break;
  case 'paint':{const q=(EDS.matQ||'').toLowerCase(),sw=i=>{const mt=EMAT[i];return`<button class="edsw${EDS.mat===i?' on':''}${EDS.mat2===i?' mix':''}" title="${esc(mt.n)}${mt.road?' (strada)':''} · Maiusc+clic: mescola" onclick="if(event.shiftKey){EDS.mat2=EDS.mat2===${i}?-1:${i};edSide()}else edMatPick(${i})"><img src="${edMatThumb(i)}" alt=""><small>${esc(mt.n)}</small></button>`};
    h=`<h4>🟩 Terreno</h4>${edBrushHTML(1)}<div class="edrow"><span>Mescola con</span><select onchange="EDS.mat2=+this.value;edSide()"><option value="-1">(niente)</option>${EMAT.map((m2,i)=>`<option value="${i}"${EDS.mat2===i?' selected':''}>${esc(m2.n)}</option>`).join('')}</select>${EDS.mat2>=0?`<input type="range" min="5" max="95" step="5" value="${EDS.mixP}" title="Quanto del secondo terreno" oninput="EDS.mixP=+this.value;this.nextElementSibling.textContent=this.value+'%'"><small>${EDS.mixP}%</small>`:''}</div>
    <input id="edmq" class="edsrch" placeholder="🔍 Cerca un terreno..." value="${esc(EDS.matQ)}" oninput="EDS.matQ=this.value;edSideKeep('edmq')">`;
    if(EDS.recM.length&&!q)h+=`<h5>Usati di recente</h5>`+EDS.recM.filter(i=>EMAT[i]).map(sw).join('');
    let k0='';EMAT.forEach((mt,i)=>{if(q&&!mt.n.toLowerCase().includes(q))return;if(mt.k!==k0){k0=mt.k;h+=`<h5>${mt.k}</h5>`}h+=sw(i)});if(q&&!EMAT.some(mt=>mt.n.toLowerCase().includes(q)))h+='<p class="mu">Nessun terreno con questo nome.</p>';
    h+=`<p class="mu">Il terreno si dipinge anche sotto muri, acqua e decorazioni. Le strade (lastricato, ciottoli, sentieri) sono quelle su cui passeggiano gli abitanti.</p>`;break}
  case 'wall':{const q=(EDS.walQ||'').toLowerCase();h=`<h4>🧱 Muri</h4>${edBrushHTML(0)}<input id="edwq" class="edsrch" placeholder="🔍 Cerca un muro..." value="${esc(EDS.walQ)}" oninput="EDS.walQ=this.value;edSideKeep('edwq')">`;let k0='';
    EWAL.forEach((st,i)=>{if(q&&!st.n.toLowerCase().includes(q))return;if(st.k!==k0){k0=st.k;h+=`<h5>${esc(st.k||'')}</h5>`}h+=`<button class="edsw tall${EDS.wall===i?' on':''}" title="${esc(st.n)}" onclick="EDS.wall=${i};edSide()"><img src="${edWallThumb(i)}" alt=""><small>${esc(st.n)}</small></button>`});
    h+=`<div class="edrow"><span>Tinta dei muri della mappa</span><span><input type="color" value="${m.wc||'#7a7f89'}" onchange="edPush('tinta');EM.wc=this.value;edBuild()"> <button onclick="edPush('tinta');EM.wc='';edBuild();edSide()">originale</button></span></div><p class="mu">I muri non si attraversano e coprono la vista: quelli davanti all'eroe diventano trasparenti.</p>`;break}
  case 'water':h=`<h4>🌊 Acqua</h4>${edBrushHTML(1)}<div class="edrow"><span>Liquido di questa mappa</span><select onchange="edPush('liquido');EM.liq=this.value;edZone(EM);edBuild()">${Object.entries(ELIQ).map(([k,v])=>`<option value="${k}"${m.liq===k?' selected':''}>${v.n}</option>`).join('')}</select></div><p class="mu">Non si attraversa a piedi: per passarci sopra usa il terreno «Pontile di legno». Nell'acqua puoi mettere barche, boe e zampilli (Decorazioni → Acqua) e punti di pesca (Oggetti).</p>`;break;
  case 'void':h=`<h4>⬛ Vuoto</h4>${edBrushHTML(1)}<p class="mu">Caselle che non esistono: si vede lo sfondo della mappa. Servono per isole nel cielo, bordi irregolari e burroni.</p>`;break;
  case 'dec':{const q=(EDS.decQ||'').toLowerCase(),L=EDEC.filter(d=>q?d.n.toLowerCase().includes(q):d.k===EDS.decK);
    h=`<h4>🌳 Decorazioni</h4>${edBrushHTML(0)}<div class="edrow"><label><input type="checkbox" ${EDS.walk?'checked':''} onchange="EDS.walk=this.checked?1:0"> Attraversabile</label><label title="Mette le decorazioni a caso nell'area del pennello">Spargi <select onchange="EDS.scatter=+this.value">${[[0,'no'],[.15,'poco'],[.35,'medio'],[.6,'tanto']].map(([v,n])=>`<option value="${v}"${EDS.scatter===v?' selected':''}>${n}</option>`).join('')}</select></label></div>
    <input id="eddq" placeholder="🔍 Cerca un arredo..." value="${esc(EDS.decQ)}" oninput="EDS.decQ=this.value;edSideKeep('eddq')"><div class="edtabs">${EDECK.map(k=>`<button class="${!q&&EDS.decK===k?'on':''}" onclick="EDS.decK='${k}';EDS.decQ='';edSide()">${k}</button>`).join('')}</div>`;
    const dsw=d=>`<button class="edsw${EDS.dec===d.c&&EDS.mix.length<2?' on':''}${EDS.mix.includes(d.c)?' mix':''}" title="${esc(d.n)}${d.walk?' (ci si cammina sopra)':''} · Maiusc+clic: aggiungi al pennello misto" onclick="edDecPick('${d.c.replace(/'/g,"\\'")}',event)"><img src="${edDecThumb(d.c)}" alt=""><small>${esc(d.n)}</small></button>`;
    if(EDS.mix.length>1)h+=`<div class="edselbox"><b>${edI('mix')} Pennello misto</b> <span class="mu">ogni casella prende a caso uno di questi ${EDS.mix.length} arredi</span><div>${EDS.mix.map(c=>`<img class="edtth" title="${esc((EDECI[c]||{}).n||c)}" src="${edDecThumb(c)}" alt="">`).join('')}</div><button onclick="EDS.mix=[];edSide()">Svuota</button></div>`;
    else h+=`<p class="mu">Maiusc+clic su più arredi: il pennello li mescola a caso (alberi diversi, rocce, fiori...).</p>`;
    if(EDS.recD.length&&!q)h+=`<h5>Usati di recente</h5>`+EDS.recD.filter(c=>EDECI[c]).map(c=>dsw(EDECI[c])).join('')+`<h5>${esc(EDS.decK)}</h5>`;
    for(const d of L)h+=dsw(d);
    if(!L.length)h+='<p class="mu">Nessun arredo con questo nome.</p>';break}
  case 'bld':h=`<h4>🏠 Edifici</h4><p class="mu">Trascina sulla mappa per disegnare un edificio (almeno 2×2). La porta è sul lato davanti (in basso a destra): può portare a un'altra mappa, per esempio l'interno.</p>
    <div class="edrow"><span>Stile</span><select onchange="EDS.bst=this.value">${EBLD.map(b=>`<option value="${b.id}"${EDS.bst===b.id?' selected':''}>${b.n}</option>`).join('')}</select></div>
    <div class="edrow"><span>Muri / tetto</span><span><input type="color" value="${EDS.bwall}" onchange="EDS.bwall=this.value"> <input type="color" value="${EDS.broof}" onchange="EDS.broof=this.value"></span></div>
    <div class="edrow"><span>Altezza</span><input type="range" min="14" max="70" value="${EDS.bht}" oninput="EDS.bht=+this.value"></div>
    <div class="edrow"><label><input type="checkbox" ${EDS.bdoor?'checked':''} onchange="EDS.bdoor=this.checked?1:0"> Con la porta</label><select onchange="EDS.bto=this.value">${edMapSel(EDS.bto,'(nessuna destinazione)')}</select></div>`;break;
  case 'npc':{const L=Object.values(EW.npcs);h=`<h4>🧑 Personaggi</h4><p class="mu">Scegli un personaggio e clicca sulla mappa per metterlo. Lo stesso personaggio può stare in più punti.</p><button onclick="edNpcNew()">＋ Nuovo personaggio</button><button onclick="edNpcWin()">🧑 Modifica i personaggi</button>
    <div class="edrow"><span>Dal gioco</span><select onchange="if(this.value){const id=edNpcFromGame(this.value);if(id){EDS.npc=id;edToast('«'+EW.npcs[id].n+'» è nel tuo mondo: clicca sulla mappa per metterlo')}edSide()}"><option value="">(scegli un personaggio di Aldoria)</option>${edGameNpcs().map(k=>`<option value="${k}">${esc(NPCS[k].n)}</option>`).join('')}</select></div><div class="edlist">`;
    if(!L.length)h+='<p class="mu">Nessun personaggio: creane uno!</p>';for(const d of L)h+=`<button class="edli${EDS.npc===d.id?' on':''}" onclick="EDS.npc='${d.id}';edSide()"><img src="${edNpcThumb(d)}" alt=""><span><b>${esc(d.n)}</b><small>${esc(d.title||EDROLE[d.role]||'')}</small></span></button>`;h+='</div>';break}
  case 'en':{h=`<h4>👹 Nemici</h4><div class="edrow"><span>Livello</span><select onchange="EDS.enLv=+this.value"><option value="0">della mappa (${m.lv})</option>${[1,2,3,4,5,6,8,10,12,15,18,22,26,30,40].map(v=>`<option value="${v}"${EDS.enLv===v?' selected':''}>${v}</option>`).join('')}</select></div><div class="edrow"><label><input type="checkbox" ${EDS.enBoss?'checked':''} onchange="EDS.enBoss=this.checked?1:0"> Boss (più forte, presentazione e bottino)</label></div><div class="edlist">`;
    for(const k of edEnemyList()){const b=E[k];h+=`<button class="edli${EDS.en===k?' on':''}" onclick="EDS.en='${k}';edSide()"><img src="${edEnThumb(k)}" alt=""><span><b>${esc(b.n)}</b><small>PV ${b.hp} · ATT ${b.at}${b.rng?' · a distanza':''}${b.boss?' · boss':''}</small></span></button>`}h+='</div>';break}
  case 'obj':{h=`<h4>🎁 Oggetti</h4><div class="edlist">`+EDOBJ.map(([k,i,n])=>`<button class="edli${EDS.obj===k?' on':''}" onclick="EDS.obj='${k}';edSide()"><span class="edic">${i}</span><span><b>${n}</b></span></button>`).join('')+'</div>';
    if(EDS.obj==='it'){const L=Object.values(EW.items);h+=`<div class="edrow"><span>Oggetto</span><select onchange="EDS.itemSel=this.value">${L.map(d=>`<option value="${d.id}"${EDS.itemSel===d.id?' selected':''}>${esc(d.n)}</option>`).join('')}</select></div>`+(L.length?'':'<p class="mu">Crea prima un oggetto nella finestra ⚔ Oggetti.</p>')+`<button onclick="edItemWin()">⚔ Oggetti del mondo</button>`}
    h+=`<p class="mu">Clicca sulla mappa per mettere l'oggetto, poi con 👆 Seleziona ne modifichi il contenuto (bottino, testo, colore...).</p>`;break}
  case 'por':h=`<h4>🚪 Porte e passaggi</h4><div class="edrow"><span>Aspetto</span><select onchange="EDS.por=this.value">${EPOR.map(p=>`<option value="${p.st}"${EDS.por===p.st?' selected':''}>${p.n}</option>`).join('')}</select></div>
    <div class="edrow"><span>Porta a</span><select onchange="EDS.porTo=this.value">${edMapSel(EDS.porTo,'(scegli dopo)')}</select></div><div class="edrow"><label><input type="checkbox" ${EDS.porBack?'checked':''} onchange="EDS.porBack=this.checked?1:0"> Crea anche il passaggio di ritorno</label></div>
    <button onclick="edMapNew(1)">＋ Nuova mappa (per esempio un interno)</button><p class="mu">Passando nel passaggio l'eroe arriva accanto al passaggio di ritorno, se c'è, altrimenti nel punto d'arrivo della mappa.</p>`;break;
  case 'trig':h=`<h4>⚡ Zone evento</h4><p class="mu">Trascina sulla mappa per disegnare una zona. Quando l'eroe ci entra (o la usa con R) succedono le azioni che scegli: messaggi, cinematiche, teletrasporti, nemici che compaiono, variabili, missioni...</p>`;break;
  case 'start':h=`<h4>🚩 Partenza e arrivo</h4><div class="seg"><button class="${EDS.stK==='start'?'on':''}" onclick="EDS.stK='start';edSide()">Inizio dell'avventura</button><button class="${EDS.stK==='sp'?'on':''}" onclick="EDS.stK='sp';edSide()">Arrivo in questa mappa</button></div>
    <p class="mu">${EDS.stK==='start'?'Clicca dove comincia la partita: l\'eroe nasce qui.':'Clicca dove arriva l\'eroe in questa mappa quando non c\'è un passaggio di ritorno (teletrasporti, rinascita dopo una sconfitta).'}</p><p>Inizio: <b>${esc((EW.maps[EW.start.map]||{}).n||'?')}</b> (${EW.start.x}, ${EW.start.y})</p>`;break;
  case 'erase':h=`<h4>🧽 Gomma</h4>${edBrushHTML(0)}<div class="seg">${[['all','Tutto'],['dec','Solo decorazioni'],['obj','Solo oggetti']].map(([k,n])=>`<button class="${EDS.erase===k?'on':''}" onclick="EDS.erase='${k}';edSide()">${n}</button>`).join('')}</div><p class="mu">Toglie decorazioni, oggetti, muri, acqua ed edifici e lascia il terreno.</p>`;break;
  case 'area':h=edAreaHTML();break;case 'stamp':h=edStampHTML();break;
  case 'pick':h=`<h4>💧 Contagocce</h4><p class="mu">Clicca una casella per prenderne il terreno, il muro o la decorazione e continuare a dipingere con quello.</p>`;break}
  if(EDS.sel&&T!=='sel'&&EDS.sel.k!=='tile')h=`<div class="edselbox">${edPropsHTML(EDS.sel)}</div>`+h;
  h+=`<div class="edmini"><canvas id="edmm" width="150" height="150" title="Clicca per spostare la vista"></canvas></div>`;return h}
// ridisegna il pannello senza perdere il campo di ricerca
function edSideKeep(id){const a=document.activeElement,pos=a&&a.id===id?a.selectionStart:null;edSide();const el=$(id);if(el&&pos!=null){el.focus();el.setSelectionRange(pos,pos)}}
function edSideAfter(){const c=$('edmm');if(c)c.onpointerdown=ev=>{const r=c.getBoundingClientRect(),k=N/150;EDS.cam.x=(ev.clientX-r.left)*150/r.width*k;EDS.cam.y=(ev.clientY-r.top)*150/r.height*k}}
function edMapSel(cur,none){return`<option value="">${none}</option>`+Object.values(EW.maps).map(q=>`<option value="${q.id}"${cur===q.id?' selected':''}>${esc(q.n)}</option>`).join('')}
const EDROLE={'':'',shop:'Mercante',smith:'Fabbro',alch:'Erborista',heal:'Guaritore',inn:'Locandiere',bard:'Bardo',casino:'Casinò',fisher:'Pescatore',buyfish:'Compra il pesce',buyres:'Compra i raccolti'};
function edEnThumb(k){return edThumb('en'+k,()=>{const m=E[k].m;if(m.rg||m.hm)drawHero(m,0,0,0,0,1);else drawL(m,.5,.5,0)},64,76,E[k].boss?.62:1,4)}
function edNpcThumb(d){const k='npc'+d.id+edNpcSpec(d.look)+(d.look.c||'')+(d.animal||'');return edThumb(k,()=>{const e=edMakeNpc(d,0,0);if(e.m.rg||e.m.hm)drawHero(e.m,0,0,0,0,1);else drawL(e.m,.5,.5,0)},64,80,1.15,4)}

/* ---- proprietà dell'oggetto selezionato ---- */
function edSelRef(){const s=EDS.sel;if(!s)return null;return s}
function edPropsHTML(s){if(s.k==='tile')return edTileHTML(s);const d=s.d;let h='';const f=(lab,inp)=>`<div class="edrow"><span>${lab}</span>${inp}</div>`,num=(k,v,a,b,st)=>`<input type="number" value="${v}" min="${a}" max="${b}" step="${st||1}" onchange="edPropSet('${k}',+this.value)">`,
    txt=(k,v,ph)=>`<input value="${esc(v||'')}" placeholder="${ph||''}" onchange="edPropSet('${k}',this.value)">`,area=(k,v,ph)=>`<textarea rows="4" placeholder="${ph||''}" onchange="edPropSet('${k}',this.value)">${esc(v||'')}</textarea>`,
    chk=(k,v,lab)=>`<label><input type="checkbox" ${v?'checked':''} onchange="edPropSet('${k}',this.checked?1:0)"> ${lab}</label>`,
    sel=(k,v,opts)=>`<select onchange="edPropSet('${k}',this.value)">${opts.map(([a,b])=>`<option value="${a}"${String(v)===String(a)?' selected':''}>${esc(b)}</option>`).join('')}</select>`;
  const items=()=>[['','(nessuno)'],...Object.values(EW.items).map(q=>[q.id,q.n])];
  if(s.k==='bld'){const b=d;h+=`<h4>🏠 Edificio</h4>`+f('Nome',txt('n',b.n,'per esempio Casa di Rosa'))+f('Stile',sel('st',b.st,EBLD.map(q=>[q.id,q.n])))+f('Muri',`<input type="color" value="${b.wall||'#e0d0b0'}" onchange="edPropSet('wall',this.value)">`)+f('Tetto',`<input type="color" value="${b.roof||'#a8402f'}" onchange="edPropSet('roof',this.value)">`)
    +f('Altezza',num('ht',b.ht,10,90))+f('Posizione',`${b.x}, ${b.y} · ${b.w}×${b.h}`)+`<div class="edrow">${chk('door',b.door,'Porta')} ${b.door?num('dx',b.dx,b.x,b.x+b.w-1):''}</div>`+(b.door?f('Porta a',sel('to',b.to||'',[['','(niente)'],...Object.values(EW.maps).map(q=>[q.id,q.n])]))+(b.to?'':`<button onclick="edBldInterior()">＋ Crea l'interno</button>`):'');}
  else if(s.k==='trig'){h+=`<h4>⚡ Zona evento</h4>`+f('Nome',txt('n',d.n,'per esempio Ingresso della grotta'))+f('Quando',sel('on',d.on||'enter',[['enter','l\'eroe ci entra'],['use','l\'eroe la usa (R o clic)'],['leave','l\'eroe ne esce']]))+`<div class="edrow">${chk('once',d.once,'Una volta sola')}</div>`+f('Area',`${d.x}, ${d.y} · ${d.w}×${d.h}`)
    +`<h5>Solo se</h5>${edCondHTML(d.cond,'EDS.sel.d.cond')}<h5>Azioni</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}`}
  else switch(d.k){
    case 'npc':{const nd=EW.npcs[d.npc];h+=`<h4>🧑 ${esc(nd?nd.n:'?')}</h4>`+f('Personaggio',sel('npc',d.npc,Object.values(EW.npcs).map(q=>[q.id,q.n])))+`<button onclick="edNpcWin('${d.npc}')">✏ Aspetto e dialoghi</button>`
      +f('Guarda verso',sel('fc',d.fc|0,[[0,'sud-est'],[1,'sud'],[2,'sud-ovest'],[3,'ovest'],[4,'nord-ovest'],[5,'nord'],[6,'nord-est'],[7,'est']]))+f('Comportamento',sel('beh',d.beh||'fermo',[['fermo','Fermo al suo posto'],['vaga','Passeggia qui intorno'],['pattuglia','Fa la ronda (punti)'],['segue','Segue l\'eroe (compagno)']]))
      +(d.beh==='pattuglia'?`<p class="mu">Punti della ronda: ${(d.pts||[]).length}. <button onclick="EDS.key=1;edToast('Clicca sulla mappa per aggiungere i punti, Invio o Esc per finire')">＋ Aggiungi punti</button> <button onclick="edPropSet('pts',[])">Cancella</button></p>`:'')
      +`<h5>Compare solo se</h5>${edCondHTML(d.cond,'EDS.sel.d.cond')}`;break}
    case 'en':h+=`<h4>👹 ${esc(d.n||(E[d.t]||{}).n||'')}</h4>`+f('Tipo',sel('t',d.t,edEnemyList().map(k=>[k,E[k].n])))+f('Nome',txt('n',d.n,(E[d.t]||{}).n))+f('Livello',sel('lv',d.lv|0,[[0,'della mappa'],...[1,2,3,4,5,6,8,10,12,15,18,22,26,30,40,50].map(v=>[v,v])]))
      +`<div class="edrow">${chk('boss',d.boss,'Boss')}</div>`+f('Vita ×',num('hp',d.hp||1,.2,10,.1))+f('Attacco ×',num('at',d.at||1,.2,10,.1))+f('Rinasce dopo (s)',num('resp',d.resp|0,0,3600,10))+f('Lascia l\'oggetto',sel('drop',d.drop||'',items()))
      +f('Guardia',sel('guard',d.guard||'',[['','Attacca quando ti vede'],['pass','Pacifico finché non lo colpisci']]))+`<h5>Compare solo se</h5>${edCondHTML(d.cond,'EDS.sel.d.cond')}<h5>Quando viene sconfitto</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}`;break;
    case 'ch':h+=`<h4>🧰 Forziere</h4><div class="edrow">${chk('rich',d.rich,'Forziere prezioso (viola)')}</div>`+f('Oro (0 = a caso)',num('g',d.g|0,0,99999))+f('Equipaggiamento a caso',num('rnd',d.rnd==null?1:d.rnd,0,6))
      +f('Serve la chiave',sel('key',d.key||'',items()))+`<h5>Contenuto</h5>${edItemListHTML(d.items,'EDS.sel.d.items')}<h5>Quando si apre</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}`;break;
    case 'po':h+=`<h4>🚪 Passaggio</h4>`+f('Aspetto',sel('st',d.st||'door',EPOR.map(p=>[p.st,p.n])))+f('Porta a',sel('to',d.to||'',[['','(niente)'],...Object.values(EW.maps).map(q=>[q.id,q.n])]))+f('Nome',txt('n',d.n,'si legge sopra il passaggio'))
      +f('Arrivo (x, y)',`<span>${num('tx',d.tx==null?-1:d.tx,-1,95)} ${num('ty',d.ty==null?-1:d.ty,-1,95)}</span>`)+'<p class="mu">-1 = accanto al passaggio di ritorno, o nel punto d\'arrivo della mappa.</p>'
      +(d.st==='cancello'?f('Verso',sel('dir',d.dir||'x',[['x','nord-sud'],['y','est-ovest']]))+f('Stile',sel('sty',d.sty||'ferro',Object.keys(GSTY).map(k=>[k,k]))):'')
      +f('Chiuso a chiave',sel('key',d.key||'',items()))+`<h5>Aperto solo se</h5>${edCondHTML(d.cond,'EDS.sel.d.cond')}`+f('Messaggio se chiuso',txt('msg',d.msg,'È chiuso.'))
      +(d.to&&EW.maps[d.to]?`<button onclick="edGoMap('${d.to}')">↪ Vai alla mappa di arrivo</button>`:'');break;
    case 'it':h+=`<h4>💎 Oggetto a terra</h4>`+f('Oggetto',sel('item',d.item||'',items()))+f('Quantità',num('n',d.n||1,1,99))+`<button onclick="edItemWin('${d.item||''}')">⚔ Modifica l'oggetto</button><h5>Compare solo se</h5>${edCondHTML(d.cond,'EDS.sel.d.cond')}`;break;
    case 'sign':h+=`<h4>🪧 Cartello</h4>`+f('Titolo',txt('ti',d.ti))+area('tx',d.tx,'Che cosa c\'è scritto');break;
    case 'note':h+=`<h4>📜 Nota</h4>`+f('Titolo',txt('ti',d.ti))+area('tx',d.tx,'Il testo della pagina')+'<p class="mu">Raccolta, finisce nel Diario (K).</p>'+`<h5>Quando si legge</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}`;break;
    case 'gem':h+=`<h4>🔷 Gemma</h4>`+f('Nome',txt('n',d.n,'Gemma'))+f('Colore',`<input type="color" value="${d.col||'#5ad0ff'}" onchange="edPropSet('col',this.value)">`)+'<p class="mu">Le gemme si contano: nel Mondo puoi dire quante ne servono per vincere.</p>'+`<h5>Quando si raccoglie</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}`;break;
    case 'light':h+=`<h4>💡 Luce</h4>`+f('Colore',`<input type="color" value="${d.col||'#ffd890'}" onchange="edPropSet('col',this.value)">`)+f('Raggio',num('r',d.r||160,40,400,10))+'<p class="mu">Si vede di notte, al buio e nelle tenebre.</p>';break;
    case 'res':h+=`<h4>🌾 Risorsa</h4>`+f('Aspetto',sel('look',d.look||'grano',Object.entries(ERES)))+f('Nome',txt('n',d.n,ERES[d.look||'grano']))+f('Dà l\'oggetto',sel('item',d.item||'',items()))+f('Ricresce dopo (s)',num('resp',d.resp||60,5,3600,5));break;
    case 'lever':h+=`<h4>🕹 Leva</h4>`+f('Nome',txt('n',d.n,'Leva'))+f('Variabile (0 giù, 1 su)',sel('v',d.v||'',edVarsL()))+`<div class="edrow">${chk('once',d.once,'Si usa una volta sola')}</div><h5>Quando si alza</h5>${edActHTML(d.acts,'EDS.sel.d.acts')}<h5>Quando si abbassa</h5>${edActHTML(d.off,'EDS.sel.d.off')}`;break;
    case 'bed':h+=`<h4>🛏 Letto</h4><p class="mu">Dormendo l'eroe recupera tutta la vita e la partita si salva. Di notte passa al mattino.</p>`;break;
    case 'tc':h+=`<h4>🔥 Torcia</h4><p class="mu">Illumina le mappe buie e di notte.</p>`;break;
    case 'fs':h+=`<h4>🎣 Punto di pesca</h4><p class="mu">Va messo nell'acqua, vicino alla riva. Serve una canna: dalla al giocatore nelle impostazioni del mondo, o con un Pescatore.</p>`;break}
  h+=`<div class="edrow"><span class="mu">${s.k==='bld'||s.k==='trig'?'':'Posizione '+d.x+', '+d.y}</span><span><button title="Duplica (Ctrl+D)" onclick="edDup()">⧉</button><button class="danger" title="Elimina (Canc)" onclick="edDelSel()">🗑 Elimina</button></span></div>`;return h}
function edPropSet(k,v){const s=EDS.sel;if(!s)return;edPush('modifica');const d=s.d;d[k]=v;
  if(s.k==='bld'&&k==='door'&&v&&(d.dx==null||d.dx<d.x||d.dx>=d.x+d.w))d.dx=d.x+(d.w>>1);
  if(s.k==='bld'){edBuild()}else edRebuildEnts();edDirty();edSide()}
function edDirty(){EDS.dirty=1}

/* ---- annulla e rifai: istantanee della mappa ---- */
function edSnap(){return JSON.stringify({m:{t:EM.t,f:EM.f,w:EM.w,d:EM.d,dw:EM.dw,b:EM.b,e:EM.e,sp:EM.sp,N:EM.N,wc:EM.wc,liq:EM.liq},st:EW.start,id:EM.id})}
function edPush(lab){EDS.undo.push({s:edSnap(),l:lab||'',tl:(EDTI[EDS.tool]||[])[2]?EDTI[EDS.tool][2].split(' (')[0].split(':')[0]:'',mn:EM?EM.n:'',tm:Date.now()});if(EDS.undo.length>80)EDS.undo.shift();EDS.redo=[];edDirty()}
function edRestore(s){const o=JSON.parse(s);if(!EW.maps[o.id])return;const m=EW.maps[o.id];Object.assign(m,o.m);EW.start=o.st;if(EM.id!==o.id)edOpenMap(o.id,0);else{EM=m;edZone(EM);edBuild()}EDS.sel=null;edSide()}
function edUndo(){if(!EDS.undo.length){edToast('Niente da annullare');return}const u=EDS.undo.pop();EDS.redo.push(Object.assign({},u,{s:edSnap()}));edRestore(u.s);edDirty()}
function edRedo(){if(!EDS.redo.length){edToast('Niente da rifare');return}const u=EDS.redo.pop();EDS.undo.push(Object.assign({},u,{s:edSnap()}));edRestore(u.s);edDirty()}
function edSaveNow(q){if(!EW)return;const ok=edSaveWorld(EW,q);EDS.dirty=0;if(!q&&ok)edToast('💾 Mondo salvato')}

/* ---- modificare le caselle ---- */
const edIn=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
function edSync(x,y){const i=y*N+x,t0=EM.t[i],d=EM.d[i];if(BM&&BM[y]&&BM[y][x]>=0)return;
  if(t0===1){M[y][x]=1;DEC[y][x]='';edFInv(x,y);return}if(t0===9){M[y][x]=9;DEC[y][x]='';edFInv(x,y);return}
  if(t0===2){M[y][x]=2;DEC[y][x]=d&&EDECI[d]&&EDECI[d].water?d:'';edFInv(x,y);return}
  const mt=EMAT[EM.f[i]]||EMAT[0];if(mt.pier)PIERD.add(i);else PIERD.delete(i);
  if(d&&!(EDECI[d]&&EDECI[d].water)){DEC[y][x]=d;M[y][x]=(EM.dw[i]||edDecWalk(d))?(mt.road?4:0):6}else{DEC[y][x]='';M[y][x]=mt.road?4:0}edFInv(x,y)}
// 7.6: il disegno veloce tiene in memoria le caselle vuote come «niente da disegnare»: dopo una modifica vanno ricontrollate
function edFInv(x,y){if(typeof FAST==='undefined'||!FAST.st||FAST.zk!==Zk||FAST.N!==N)return;for(let v=y-1;v<=y+1;v++)for(let u=x-1;u<=x+1;u++){if(u<0||v<0||u>=N||v>=N)continue;const i=v*N+u;FAST.st[i]=0;FAST.spr[i]=null;FAST.thr[i]=0}}
function edApply(x,y){if(!edIn(x,y))return;const i=y*N+x,T=EDS.tool,m=EM;let fl=0;
  switch(T){
  case 'paint':{const mt=edMatNow();if(m.t[i]!==0||m.f[i]!==mt){if(m.t[i]===2&&m.d[i]&&EDECI[m.d[i]]&&EDECI[m.d[i]].water)delete m.d[i];m.t[i]=0;m.f[i]=mt;fl=1}break}
  case 'wall':if(m.t[i]!==1||m.w[i]!==EDS.wall){m.t[i]=1;m.w[i]=EDS.wall;delete m.d[i];delete m.dw[i];fl=1}break;
  case 'water':if(m.t[i]!==2){m.t[i]=2;if(m.d[i]&&!(EDECI[m.d[i]]&&EDECI[m.d[i]].water))delete m.d[i];fl=1}break;
  case 'void':if(m.t[i]!==9){m.t[i]=9;delete m.d[i];fl=1}break;
  case 'dec':{if(EDS.scatter&&Math.random()>EDS.scatter)return;const c=edDecNow(),wt=EDECI[c]&&EDECI[c].water;if(wt){if(m.t[i]!==2)m.t[i]=2}else if(m.t[i]!==0){m.t[i]=0;fl=1}
    m.d[i]=c;if(EDS.walk)m.dw[i]=1;else delete m.dw[i];break}
  case 'erase':{if(EDS.erase!=='obj'){if(m.d[i]){delete m.d[i];delete m.dw[i]}else if(EDS.erase==='all'&&m.t[i]!==0){m.t[i]=0;fl=1}}
    if(EDS.erase!=='dec'){const n0=m.e.length;m.e=m.e.filter(e=>e.k==='trig'||!(Math.floor(e.x)===x&&Math.floor(e.y)===y));if(m.e.length!==n0)EDS.entDirty=1;
      if(EDS.erase==='all'){const b0=m.b.length;m.b=m.b.filter(b=>!(x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h));if(m.b.length!==b0)EDS.bldDirty=1}}break}}
  edSync(x,y);if(fl)EDS.fdirty=1}
function edBrushAt(x,y,f){const b=EDS.brush,o=Math.floor((b-1)/2);for(let dy=0;dy<b;dy++)for(let dx=0;dx<b;dx++){const u=x-o+dx,v=y-o+dy;if(b>=5){const r=b/2;if(Math.hypot(dx-o,dy-o)>r)continue}f(u,v)}}
function edLine(x0,y0,x1,y1,f){const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;for(;;){f(x0,y0);if(x0===x1&&y0===y1||++n>400)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function edFill(x,y){if(!edIn(x,y))return;const m=EM,i0=y*N+x,key=i=>m.t[i]*1000+(m.t[i]===0?m.f[i]:m.t[i]===1?m.w[i]:0)+(m.d[i]?.5:0),k0=key(i0),seen=new Uint8Array(N*N),q=[i0];seen[i0]=1;let n=0;
  while(q.length&&n<9216){const i=q.pop(),cx=i%N,cy=i/N|0;edApply(cx,cy);n++;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const u=cx+a,v=cy+b;if(!edIn(u,v))continue;const j=v*N+u;if(seen[j]||key(j)!==k0)continue;seen[j]=1;q.push(j)}}}
function edPaintTools(){return['paint','wall','water','void','dec','erase'].includes(EDS.tool)}
function edStrokeEnd(){EDS.mmv=(EDS.mmv|0)+1;if(EDS.entDirty){EDS.entDirty=0;edRebuildEnts()}if(EDS.bldDirty){EDS.bldDirty=0;edBuild()}EDS.fdirty=1;EDS.ftime=0;edDirty();edStat()}

/* ---- mettere oggetti ---- */
function edAddEnt(o){edPush('oggetto');o.u=edUid('e');EM.e.push(o);edRebuildEnts();edDirty();return o}
function edPlace(x,y){if(!edIn(x,y))return;const T=EDS.tool;
  if(T==='npc'){if(!EW.npcs[EDS.npc]){const L=Object.keys(EW.npcs);if(L.length)EDS.npc=L[0];else{edNpcNew(x,y);return}}const o=edAddEnt({k:'npc',x,y,npc:EDS.npc,fc:1,beh:'fermo',cond:[]});edSelect('e',o,1);return}
  if(T==='en'){const o=edAddEnt({k:'en',x,y,t:EDS.en,lv:EDS.enLv||0,boss:EDS.enBoss?1:0,resp:0,acts:[],cond:[]});edSelect('e',o,1);return}
  if(T==='obj'){const k=EDS.obj;let o={k,x,y};
    if(k==='ch')Object.assign(o,{rich:0,g:0,rnd:1,items:[],acts:[]});else if(k==='it'){const id=EDS.itemSel&&EW.items[EDS.itemSel]?EDS.itemSel:Object.keys(EW.items)[0];if(!id){edToast('Prima crea un oggetto in ⚔ Oggetti');edItemWin();return}Object.assign(o,{item:id,n:1,cond:[]})}
    else if(k==='sign')Object.assign(o,{ti:'Cartello',tx:''});else if(k==='note')Object.assign(o,{ti:'Pagina strappata',tx:'',acts:[]});else if(k==='gem')Object.assign(o,{n:'Gemma',col:EDS.objCol,acts:[]});
    else if(k==='light')Object.assign(o,{col:'#ffd890',r:160});else if(k==='lever')Object.assign(o,{n:'Leva',v:'',acts:[],off:[]});else if(k==='res')Object.assign(o,{look:'grano',item:'',resp:60});
    o=edAddEnt(o);edSelect('e',o,1);return}
  if(T==='por'){const o=edAddEnt({k:'po',x,y,st:EDS.por,to:EDS.porTo||'',n:'',face:''});o.face=edPortalFace(x,y);
    if(EDS.porTo&&EDS.porBack&&EW.maps[EDS.porTo]&&EDS.porTo!==EM.id){const t=EW.maps[EDS.porTo];if(!t.e.some(e=>e.k==='po'&&e.to===EM.id)){const back={u:edUid('e'),k:'po',x:t.sp[0],y:Math.max(0,t.sp[1]-1),st:EDS.por==='down'?'up':EDS.por==='up'?'down':EDS.por,to:EM.id,n:'',face:''};t.e.push(back);edToast('Creato anche il passaggio di ritorno in «'+t.n+'»')}}
    edSelect('e',o,1);return}
  if(T==='start'){edPush('partenza');if(EDS.stK==='start')EW.start={map:EM.id,x,y};else EM.sp=[x,y];edDirty();edSide();edToast(EDS.stK==='start'?'🚩 L\'avventura comincia qui':'Punto d\'arrivo della mappa spostato');const s=$('edmap');if(s)s.innerHTML=edMapOpts(EM.id);return}}
function edSelect(k,d,keep){EDS.sel={k:k==='e'?d.k:k,d};if(!keep&&EDS.tool!=='sel'){EDS.tool='sel';for(const b of document.querySelectorAll('#edleft button[data-t]'))b.classList.toggle('on',b.dataset.t==='sel')}edSide()}
function edDelSel(){const s=EDS.sel;if(!s)return;if(s.k==='tile'){edTileSet('d','');return}edPush('elimina');if(s.k==='bld'){EM.b=EM.b.filter(b=>b!==s.d);EDS.sel=null;edBuild()}else{EM.e=EM.e.filter(e=>e!==s.d);EDS.sel=null;edRebuildEnts()}edDirty();edSide()}
function edDup(){const s=EDS.sel;if(!s||s.k==='tile')return;edPush('duplica');const o=edClone(s.d);o.u=edUid(s.k==='bld'?'b':'e');
  if(s.k==='bld'){o.x=Math.min(N-o.w,o.x+o.w+1);if(o.door)o.dx=o.x+(o.dx-s.d.x);EM.b.push(o);edBuild()}else{o.x=Math.min(N-1,o.x+1);EM.e.push(o);edRebuildEnts()}EDS.sel={k:s.k,d:o};edDirty();edSide()}
function edBldInterior(){const s=EDS.sel;if(!s||s.k!=='bld')return;const b=s.d,nm=(b.n||'Casa')+' · interno';const w2=Math.max(8,Math.min(16,b.w*2)),h2=Math.max(8,Math.min(16,b.h*2));
  const m=edGenRoom(edNewMap({n:nm,N:Math.max(w2,h2)+2,light:'interno',mus:'inter',pt:''}),w2,h2);EW.maps[m.id]=m;edZone(m);edPush('interno');b.to=m.id;b.door=1;if(b.dx==null)b.dx=b.x+(b.w>>1);
  const ex=m.e.find(e=>e.k==='po');if(ex)ex.to=EM.id;edBuild();edDirty();edSide();const sl=$('edmap');if(sl)sl.innerHTML=edMapOpts(EM.id);edToast('Creato l\'interno «'+nm+'»: lo trovi tra le mappe')}

/* ---- puntatore: strumenti, trascinamenti, vista ---- */
function edTile(ev){const[mx,my]=toWorld(ev.clientX,ev.clientY);return[Math.floor((mx/32+my/16)/2),Math.floor((my/16-mx/32)/2)]}
function edHit(ev){const[mx,my]=toWorld(ev.clientX,ev.clientY);let best=null,bd=1e9;for(const e of ents){if(!e.ref)continue;const r=e.boss?40:26,d=Math.hypot(PX(e.px,e.py)-mx,(PY(e.px,e.py,e.k==='en'||e.k==='npc'?16:8)-my)*.8);if(d<r&&d<bd){bd=d;best=e}}
  if(best)return{k:best.ref.k,d:best.ref};const[x,y]=edTile(ev);const tr=EM.e.find(e=>e.k==='trig'&&x>=e.x&&x<e.x+e.w&&y>=e.y&&y<e.y+e.h);if(tr)return{k:'trig',d:tr};
  const b=EM.b.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);if(b)return{k:'bld',d:b};return null}
function edDown(ev){if(!EDIT)return;ev.preventDefault();cv.setPointerCapture&&cv.setPointerCapture(ev.pointerId);EDS.touches[ev.pointerId]=[ev.clientX,ev.clientY];
  if(Object.keys(EDS.touches).length>=2){EDS.drag=null;EDS.pan={pinch:edPinch(),cx:EDS.cam.x,cy:EDS.cam.y,z:SZ};return}
  if(ev.button===1||ev.button===2||EDS.tool==='hand'||EDS.key===' '){EDS.pan={x:ev.clientX,y:ev.clientY,cx:EDS.cam.x,cy:EDS.cam.y};return}
  if(ev.button!==0)return;const[x,y]=edTile(ev),T=EDS.tool;
  if(EDS.key===1&&EDS.sel&&EDS.sel.d.k==='npc'){edPush('ronda');(EDS.sel.d.pts=EDS.sel.d.pts||[]).push([x,y]);edSide();return}
  if(EDS.paste&&(T==='area'||T==='stamp')){edPasteAt(x,y);return}
  if(T==='area'){const r=edAreaR();if(r&&x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h){EDS.drag={k:'amove',x0:x,y0:y,dx:0,dy:0};return}EDS.drag={k:'area',x0:x,y0:y,x1:x,y1:y};EDS.area={x0:x,y0:y,x1:x,y1:y};return}
  if(T==='stamp'){edToast('Scegli prima un timbro o un modello nel pannello a destra');return}
  if(T==='sel'){const h=edHit(ev);EDS.sel=h||(edIn(x,y)?{k:'tile',d:{x,y}}:null);if(h){const d=h.d;EDS.drag={k:'move',x0:x,y0:y,ox:d.x,oy:d.y,moved:0}}edSide();return}
  if(edPaintTools()){if(T==='erase'||T==='dec'||EDS.shape==='brush'){edPush('pennello');EDS.drag={k:'paint',lx:x,ly:y};edBrushAt(x,y,edApply);return}
    if(EDS.shape==='fill'){edPush('riempi');edFill(x,y);edStrokeEnd();return}EDS.drag={k:EDS.shape,x0:x,y0:y,x1:x,y1:y};return}
  if(T==='pick'){edPick(x,y);return}
  if(T==='bld'||T==='trig'){const h=edHit(ev);if(h&&(h.k==='bld'&&T==='bld'||h.k==='trig'&&T==='trig')){edSelect(h.k,h.d,1);EDS.drag={k:'move',x0:x,y0:y,ox:h.d.x,oy:h.d.y,moved:0};return}EDS.drag={k:'rect',x0:x,y0:y,x1:x,y1:y};return}
  if(T!=='start'){const h=edHit(ev);if(h&&h.k!=='bld'&&h.k!=='trig'){edSelect(h.k,h.d,1);EDS.drag={k:'move',x0:x,y0:y,ox:h.d.x,oy:h.d.y,moved:0};return}}
  edPlace(x,y)}
function edPinch(){const p=Object.values(EDS.touches);return Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1])||1}
function edMove(ev){if(!EDIT)return;const tp=EDS.touches[ev.pointerId];if(tp){tp[0]=ev.clientX;tp[1]=ev.clientY}
  const[x,y]=edTile(ev);EDS.hover=[x,y];
  if(EDS.pan){if(EDS.pan.pinch){const k=edPinch()/EDS.pan.pinch;SZ=clamp(EDS.pan.z*k,.3,2.6);return}const dx=(ev.clientX-EDS.pan.x)/S,dy=(ev.clientY-EDS.pan.y)/S;
    // spostamento sullo schermo → spostamento in caselle (proiezione isometrica al contrario)
    EDS.cam.x=EDS.pan.cx-(dx/32+dy/16)/2;EDS.cam.y=EDS.pan.cy-(dy/16-dx/32)/2;camX=PX(EDS.cam.x,EDS.cam.y);camY=PY(EDS.cam.x,EDS.cam.y,10);return}
  const D=EDS.drag;if(!D){edStat();return}
  if(D.k==='paint'){if(x!==D.lx||y!==D.ly){edLine(D.lx,D.ly,x,y,(u,v)=>edBrushAt(u,v,edApply));D.lx=x;D.ly=y}return}
  if(D.k==='rect'||D.k==='line'){D.x1=x;D.y1=y;return}
  if(D.k==='area'){D.x1=x;D.y1=y;EDS.area={x0:D.x0,y0:D.y0,x1:x,y1:y};return}if(D.k==='amove'){D.dx=x-D.x0;D.dy=y-D.y0;return}
  if(D.k==='move'&&EDS.sel){const d=EDS.sel.d,nx=D.ox+x-D.x0,ny=D.oy+y-D.y0;if(nx===d.x&&ny===d.y)return;if(!D.moved){edPush('sposta');D.moved=1}
    if(EDS.sel.k==='bld'){const ox=d.x;d.x=clamp(nx,0,N-d.w);d.y=clamp(ny,0,N-d.h);if(d.door)d.dx+=d.x-ox;edBuild()}else if(EDS.sel.k==='trig'){d.x=clamp(nx,0,N-d.w);d.y=clamp(ny,0,N-d.h)}else{d.x=clamp(nx,0,N-1);d.y=clamp(ny,0,N-1);edRebuildEnts()}edDirty()}}
function edUp(ev){if(!EDIT)return;delete EDS.touches[ev.pointerId];if(EDS.pan){if(!Object.keys(EDS.touches).length)EDS.pan=null;return}const D=EDS.drag;EDS.drag=null;if(!D)return;
  if(D.k==='paint'){edStrokeEnd();return}
  if(D.k==='move'){if(D.moved)edSide();return}
  if(D.k==='area'){edSide();return}if(D.k==='amove'){if(D.dx||D.dy)edAreaMove(D.dx,D.dy);return}
  const x0=Math.min(D.x0,D.x1),y0=Math.min(D.y0,D.y1),x1=Math.max(D.x0,D.x1),y1=Math.max(D.y0,D.y1);
  if(EDS.tool==='bld'){if(x1-x0<1||y1-y0<1){edToast('Un edificio è grande almeno 2×2');return}edPush('edificio');const b={u:edUid('b'),x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,st:EDS.bst,wall:EDS.bwall,roof:EDS.broof,ht:EDS.bht,door:EDS.bdoor,dx:x0+((x1-x0+1)>>1),to:EDS.bto||'',n:''};
    EM.b.push(b);edBuild();edSelect('bld',b,1);edDirty();return}
  if(EDS.tool==='trig'){edPush('zona');const o={u:edUid('e'),k:'trig',x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,on:'enter',once:1,n:'Zona '+(EM.e.filter(e=>e.k==='trig').length+1),cond:[],acts:[]};EM.e.push(o);edSelect('trig',o,1);edDirty();return}
  edPush(D.k==='rect'?'rettangolo':'linea');if(D.k==='rect'){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)edApply(x,y)}else edLine(D.x0,D.y0,D.x1,D.y1,(u,v)=>edBrushAt(u,v,edApply));edStrokeEnd()}
function edPick(x,y){if(!edIn(x,y))return;const i=y*N+x,m=EM;if(m.d[i]){EDS.dec=m.d[i];EDS.walk=m.dw[i]?1:0;edTool('dec');const d=EDECI[m.d[i]];if(d)EDS.decK=d.k;edSide();return}
  if(m.t[i]===1){EDS.wall=m.w[i];edTool('wall');return}if(m.t[i]===2){edTool('water');return}if(m.t[i]===9){edTool('void');return}EDS.mat=m.f[i];edTool('paint')}
function edStat(){const el=$('edstat');if(!el||!EM)return;const hv=EDS.hover;let s=`<b>${esc(EM.n)}</b> · ${N}×${N}`;
  if(hv&&edIn(hv[0],hv[1])){const i=hv[1]*N+hv[0],t0=EM.t[i];s+=` · casella ${hv[0]}, ${hv[1]} · ${t0===1?'muro: '+EWAL[EM.w[i]].n:t0===2?(ELIQ[EM.liq]||ELIQ.acqua).n:t0===9?'vuoto':EMAT[EM.f[i]].n}${EM.d[i]&&EDECI[EM.d[i]]?' · '+EDECI[EM.d[i]].n:''}`}
  const ar=edAreaR();if(EDS.tool==='area'&&ar)s+=` · area ${ar.w}×${ar.h}`;if(EDS.paste)s+=` · incolla «${esc(EDS.paste.name)}» ${EDS.paste.c.w}×${EDS.paste.c.h}`;
  s+=`${EDS.dirty?' · <i>modifiche non salvate</i>':''}`;let tx=$('edstx');if(!tx){edStatBar();tx=$('edstx')}if(tx&&tx.innerHTML!==s)tx.innerHTML=s;const zv=$('edzv');if(zv){const z=Math.round(SZ*100)+'%';if(zv.textContent!==z)zv.textContent=z}}

/* ---- tastiera dell'editor ---- */
function edKey(e){const k=e.key,lk=k.toLowerCase(),c=e.ctrlKey||e.metaKey,tg=e.target;
  if(tg&&(tg.tagName==='INPUT'||tg.tagName==='TEXTAREA'||tg.tagName==='SELECT'||tg.isContentEditable)){if(k==='Escape')tg.blur();return}
  if(c&&lk==='z'){e.preventDefault();e.shiftKey?edRedo():edUndo();return}
  if(c&&lk==='c'){e.preventDefault();edCopy();return}if(c&&lk==='x'){e.preventDefault();edCopy(1);return}if(c&&lk==='v'){e.preventDefault();edPasteStart();return}if(c&&lk==='a'){e.preventDefault();edAreaAll();return}
  if(EDS.paste&&!c&&(lk==='r'||lk==='f')){edPasteXf(lk==='r'?'rot':'x');return}if(c&&lk==='y'){e.preventDefault();edRedo();return}if(c&&lk==='s'){e.preventDefault();edSaveNow();return}if(c&&lk==='d'){e.preventDefault();edDup();return}
  if(k==='Escape'){if(!$('edwin').hidden){edWinClose();return}if(EDS.key===1){EDS.key=0;return}if(EDS.paste){EDS.paste=null;edSide();return}if(EDS.area&&EDS.tool==='area'){EDS.area=null;edSide();return}EDS.sel=null;EDS.drag=null;edSide();return}
  if(k==='Enter'&&EDS.key===1){EDS.key=0;edToast('Ronda pronta');return}
  if(!$('edwin').hidden)return;
  if(k==='Delete'||k==='Backspace'){if(EDS.tool==='area'&&EDS.area){e.preventDefault();edAreaDel();return}if(EDS.sel){e.preventDefault();edDelSel()}return}
  if(k==='Tab'){e.preventDefault();const r=$('ed');if(r)r.classList.toggle('edfocus');return}if(k==='0'){edFit();return}
  if(e.shiftKey&&k.startsWith('Arrow')&&EDS.sel&&EDS.sel.k!=='tile'){e.preventDefault();const d=EDS.sel.d,dx=k==='ArrowRight'?1:k==='ArrowLeft'?-1:0,dy=k==='ArrowDown'?1:k==='ArrowUp'?-1:0;edPush('sposta');
    if(EDS.sel.k==='bld'){const ox=d.x;d.x=clamp(d.x+dx,0,N-d.w);d.y=clamp(d.y+dy,0,N-d.h);if(d.door)d.dx+=d.x-ox;edBuild()}else if(EDS.sel.k==='trig'){d.x=clamp(d.x+dx,0,N-d.w);d.y=clamp(d.y+dy,0,N-d.h)}else{d.x=clamp(d.x+dx,0,N-1);d.y=clamp(d.y+dy,0,N-1);edRebuildEnts()}edDirty();edSide();return}
  if(k===' '){EDS.key=' ';e.preventDefault();return}
  if(k==='+'||k==='='){SZ=clamp(SZ*1.15,.3,2.6);return}if(k==='-'){SZ=clamp(SZ/1.15,.3,2.6);return}
  if(k==='['){EDS.brush=Math.max(1,EDS.brush-1);edSide();return}if(k===']'){EDS.brush=Math.min(9,EDS.brush+1);edSide();return}
  if(k.startsWith('Arrow')){EDS.keys=EDS.keys||{};EDS.keys[k]=1;e.preventDefault();return}
  const t=EDTOOLS.find(q=>q[3].toLowerCase()===lk);if(t&&!c){edTool(t[0]);return}}
addEventListener('keyup',e=>{if(!EDIT)return;if(e.key===' '&&EDS.key===' ')EDS.key=0;if(EDS.keys)delete EDS.keys[e.key]});
// rotella: zoom più ampio che nel gioco (fino a vedere mappe grandi per intero)
cv.addEventListener('wheel',e=>{if(!EDIT)return;SZ=clamp(SZ*(1-e.deltaY*.0012),.3,2.6)},{passive:true});
cv.addEventListener('pointermove',e=>{if(EDIT)edMove(e)});
addEventListener('pointerup',e=>{if(EDIT)edUp(e)});addEventListener('pointercancel',e=>{if(EDIT){delete EDS.touches[e.pointerId];EDS.pan=null;EDS.drag=null}});
cv.addEventListener('contextmenu',e=>{if(EDIT)e.preventDefault()});
// i gestori del clic e della tastiera del gioco vengono assegnati più avanti nel file: si avvolgono a fine caricamento (edInstall)
function edInstallEd(){const pd=cv.onpointerdown;cv.onpointerdown=ev=>{if(EDIT){auInit();edDown(ev);return}pd(ev)};const kd=onkeydown;onkeydown=e=>{if(EDIT){edKey(e);return}kd(e)}}

/* ---- ciclo dell'editor: vista, autosalvataggio, pavimento da ridisegnare ---- */
const _upd75=upd;upd=function(dt){if(EDIT){edUpd(dt);return}_upd75(dt)};
function edUpd(dt){t+=dt;NK=EDS.dark&&ZZ&&ZZ.ed&&SKY[Zk]?(EM.light==='notte'?1:EM.light==='ciclo'?.85:0):0;DK=0;partUpd(dt);
  const ks=EDS.keys||{},sp=dt*14/Math.max(.4,SZ);let mx=(ks.ArrowRight?1:0)-(ks.ArrowLeft?1:0),my=(ks.ArrowDown?1:0)-(ks.ArrowUp?1:0);
  if(mx||my){EDS.cam.x+=(mx+my)*sp*.7;EDS.cam.y+=(my-mx)*sp*.7}EDS.cam.x=clamp(EDS.cam.x,-4,N+4);EDS.cam.y=clamp(EDS.cam.y,-4,N+4);
  if(EDS.fdirty&&(EDS.ftime+=dt)>.12&&!EDS.drag){EDS.fdirty=0;EDS.ftime=0;buildFC();if(typeof FAST!=='undefined')FAST.fc=FC}
  if(EDS.fdirty&&EDS.drag&&(EDS.ftime+=dt)>.25){EDS.fdirty=0;EDS.ftime=0;buildFC();if(typeof FAST!=='undefined')FAST.fc=FC}
  if(EDS.dirty&&(EDS.saveT+=dt)>30){EDS.saveT=0;edSaveNow(1)}
  for(const e of ents)if(e.k==='en'){e.fl=Math.max(0,(e.fl||0)-dt)}
  edMini(dt)}
const _ct75=camTarget;camTarget=function(){if(EDIT)return[EDS.cam.x,EDS.cam.y];return _ct75()};
const _ch75=curHover;curHover=function(dt){if(EDIT){const c=EDS.pan||EDS.tool==='hand'||EDS.key===' '?'grab':EDS.tool==='sel'?'default':'crosshair';if(cv.style.cursor!==c)cv.style.cursor=c;return}_ch75(dt)};
let EDMT=0,EDMC=null,EDMK='';function edMiniMap(){const m=EM,n=m.N,k=m.id+'|'+n+'|'+EDS.undo.length+'|'+EDS.mmv;if(EDMC&&EDMK===k)return EDMC;EDMK=k;const c=EDMC||document.createElement('canvas');c.width=c.height=n;const q=c.getContext('2d'),id=q.createImageData(n,n),D=id.data,lq=(ELIQ[m.liq]||ELIQ.acqua).c||'#3b86d6';
  const rgb=h=>{const v=parseInt(hx6(h).slice(1),16);return[v>>16,v>>8&255,v&255]},WC=EWAL.map(w=>rgb(shx(w.tint&&m.wc?m.wc:w.c,.75))),MC2=EMAT.map(t=>rgb(t.a)),LQ=rgb(lq);
  for(let i=0;i<n*n;i++){const t0=m.t[i];let c2=t0===1?WC[m.w[i]]||WC[0]:t0===2?LQ:t0===9?null:MC2[m.f[i]]||MC2[0];if(c2&&t0===0&&m.d[i]&&!m.dw[i]&&!edDecWalk(m.d[i]))c2=c2.map(v=>v*.62|0);const o=i*4;if(c2){D[o]=c2[0];D[o+1]=c2[1];D[o+2]=c2[2];D[o+3]=255}}q.putImageData(id,0,0);return EDMC=c}
function edMini(dt){if((EDMT+=dt)<.25)return;EDMT=0;const c=$('edmm');if(!c||!EM)return;const q=c.getContext('2d'),s=150/N;q.clearRect(0,0,150,150);q.imageSmoothingEnabled=false;q.drawImage(edMiniMap(),0,0,150,150);
  for(const b of EM.b){q.fillStyle=b.roof||'#a8402f';q.fillRect(b.x*s,b.y*s,b.w*s,b.h*s)}
  for(const e of EM.e){q.fillStyle={npc:'#ffe066',en:'#ff4a4a',po:'#44eeff',ch:'#ffaa33',trig:'#c46bff'}[e.k]||'#ffffff';if(e.k==='trig'){q.globalAlpha=.4;q.fillRect(e.x*s,e.y*s,e.w*s,e.h*s);q.globalAlpha=1}else q.fillRect(e.x*s,e.y*s,Math.max(2,s),Math.max(2,s))}
  if(EW.start.map===EM.id){q.fillStyle='#4cd07a';q.fillRect(EW.start.x*s-2,EW.start.y*s-2,5,5)}
  // il riquadro della vista
  const k=1/S,c0=toWorld(0,0),c1=toWorld(W,0),c2=toWorld(W,H),c3=toWorld(0,H),T=([a,b])=>[((a/32+b/16)/2)*s,((b/16-a/32)/2)*s];q.strokeStyle='#fff';q.lineWidth=1;q.beginPath();
  [c0,c1,c2,c3].map(T).forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.closePath();q.stroke()}

/* ---- sopra la mappa: griglia, casella sotto il mouse, zone evento, partenza, selezione ---- */
const _draw75=draw;draw=function(){_draw75();if(EDIT)edOverlay()};
function edDia(x,y,w,h,z){g.beginPath();g.moveTo(PX(x,y),PY(x,y,z));g.lineTo(PX(x+w,y),PY(x+w,y,z));g.lineTo(PX(x+w,y+h),PY(x+w,y+h,z));g.lineTo(PX(x,y+h),PY(x,y+h,z));g.closePath()}
function edOverlay(){g.setTransform(S*DPR,0,0,S*DPR,(W/2-camX*S)*DPR,(H/2-camY*S)*DPR);const n=N;
  if(EDS.grid){g.strokeStyle='rgba(255,255,255,.09)';g.lineWidth=1/S;g.beginPath();const cx=EDS.cam.x|0,cy=EDS.cam.y|0,r=Math.ceil(26/Math.max(.35,SZ));
    for(let i=Math.max(0,cx-r);i<=Math.min(n,cx+r);i++){g.moveTo(PX(i,Math.max(0,cy-r)),PY(i,Math.max(0,cy-r),0));g.lineTo(PX(i,Math.min(n,cy+r)),PY(i,Math.min(n,cy+r),0))}
    for(let j=Math.max(0,cy-r);j<=Math.min(n,cy+r);j++){g.moveTo(PX(Math.max(0,cx-r),j),PY(Math.max(0,cx-r),j,0));g.lineTo(PX(Math.min(n,cx+r),j),PY(Math.min(n,cx+r),j,0))}g.stroke();
    g.strokeStyle='rgba(245,185,66,.5)';g.lineWidth=2/S;edDia(0,0,n,n,0);g.stroke()}
  // zone evento
  for(const e of EM.e)if(e.k==='trig'&&!EDS.hideT){const sel=EDS.sel&&EDS.sel.d===e;g.fillStyle=sel?'rgba(196,107,255,.35)':'rgba(196,107,255,.18)';g.strokeStyle='rgba(220,160,255,.9)';g.lineWidth=(sel?3:1.5)/S;edDia(e.x,e.y,e.w,e.h,0);g.fill();g.stroke();
    g.font='bold 11px Georgia,serif';g.textAlign='center';edLabI('bolt',e.n||'zona',PX(e.x+e.w/2,e.y+e.h/2),PY(e.x+e.w/2,e.y+e.h/2,0),'#e8c8ff')}
  // partenza e arrivo
  const flag=(x,y,c,l)=>{g.fillStyle=c;edDia(x+.2,y+.2,.6,.6,0);g.fill();g.fillRect(PX(x+.5,y+.5)-1,PY(x+.5,y+.5,34),2,34);g.beginPath();g.moveTo(PX(x+.5,y+.5)+1,PY(x+.5,y+.5,34));g.lineTo(PX(x+.5,y+.5)+16,PY(x+.5,y+.5,29));g.lineTo(PX(x+.5,y+.5)+1,PY(x+.5,y+.5,24));g.fill();g.font='bold 10px Georgia,serif';g.textAlign='center';label(l,PX(x+.5,y+.5),PY(x+.5,y+.5,40),c)};
  flag(EM.sp[0],EM.sp[1],'#5ad0ff','arrivo');if(EW.start.map===EM.id)flag(EW.start.x,EW.start.y,'#4cd07a','inizio');
  // etichette: personaggi, porte, ronde
  if(EDS.labels&&!EDS.hideE){g.font='bold 10px Georgia,serif';g.textAlign='center';for(const e of ents){if(!e.ref)continue;const d=e.ref,X=PX(e.px,e.py);
    if(d.k==='po'){const to=EW.maps[d.to];edLabI('door',to?to.n:'?',X,PY(e.px,e.py,58),to?'#9ff0ff':'#ff9a8a')}
    else if(d.k==='en'){if(d.boss)edLabI('crown',e.n+' Lv'+(d.lv||EM.lv),X,PY(e.px,e.py,78),'#ffb0a0');else label(e.n+' Lv'+(d.lv||EM.lv),X,PY(e.px,e.py,46),'#ffb0a0')}
    else if(d.k==='npc'){if(d.beh==='pattuglia'&&d.pts&&d.pts.length){g.strokeStyle='rgba(255,224,102,.7)';g.lineWidth=2/S;g.setLineDash([6,5]);g.beginPath();g.moveTo(X,PY(e.px,e.py,0));for(const p of d.pts)g.lineTo(PX(p[0]+.5,p[1]+.5),PY(p[0]+.5,p[1]+.5,0));g.stroke();g.setLineDash([])}}
    else if(d.k==='ch'&&(d.key||d.items&&d.items.length))edLabI(d.key?'lock':'chest','',X,PY(e.px,e.py,30),'#ffd84a')}
    for(const b of EM.b)if(b.door&&b.to){const to=EW.maps[b.to];edLabI('door',to?to.n:'?',PX(b.dx+.5,b.y+b.h+.5),PY(b.dx+.5,b.y+b.h+.5,40),'#9ff0ff')}}
  // selezione
  const s=EDS.sel;if(s){const d=s.d,p=.5+.5*Math.sin(t*6);g.strokeStyle=`rgba(255,216,74,${.6+.4*p})`;g.lineWidth=3/S;
    if(s.k==='bld'){edDia(d.x,d.y,d.w,d.h,0);g.stroke()}else if(s.k==='tile'){g.fillStyle='rgba(255,216,74,.18)';edDia(d.x,d.y,1,1,0);g.fill();g.stroke()}else if(s.k!=='trig'){g.beginPath();g.ellipse(PX(d.x+.5,d.y+.5),PY(d.x+.5,d.y+.5,0),26,13,0,0,6.3);g.stroke()}}
  // area selezionata, pezzo da incollare
  const ar=edAreaR();if(ar&&(EDS.tool==='area'||EDS.paste)){const D0=EDS.drag,mx=D0&&D0.k==='amove'?D0.dx:0,my=D0&&D0.k==='amove'?D0.dy:0;g.save();g.setLineDash([8/S,6/S]);g.lineDashOffset=-t*30/S;g.strokeStyle='#ffd84a';g.lineWidth=2/S;g.fillStyle='rgba(255,216,74,.10)';edDia(ar.x+mx,ar.y+my,ar.w,ar.h,0);g.fill();g.stroke();g.restore();
    g.font='bold 12px Georgia,serif';g.textAlign='center';label(ar.w+'×'+ar.h,PX(ar.x+mx,ar.y+my),PY(ar.x+mx,ar.y+my,8),'#ffd84a')}
  if(EDS.paste&&EDS.hover&&!EDS.pan){const c=EDS.paste.c,x0=EDS.hover[0]-(c.w>>1),y0=EDS.hover[1]-(c.h>>1);g.fillStyle='rgba(120,220,255,.16)';g.strokeStyle='#7ad0ff';g.lineWidth=2/S;
    for(let y=0;y<c.h;y++)for(let x=0;x<c.w;x++){const j=y*c.w+x;if(c.t[j]<0&&!c.d[j])continue;edDia(x0+x,y0+y,1,1,0);g.fill()}for(const e of c.e){g.fillStyle='rgba(255,224,102,.55)';edDia(x0+e.x+.25,y0+e.y+.25,.5,.5,0);g.fill()}
    edDia(x0,y0,c.w,c.h,0);g.stroke();return}
  // casella sotto il mouse e anteprime
  const hv=EDS.hover,D=EDS.drag;
  if(D&&(D.k==='rect'||D.k==='line')){g.fillStyle=EDS.tool==='trig'?'rgba(196,107,255,.3)':EDS.tool==='bld'?'rgba(255,200,120,.3)':'rgba(255,255,255,.22)';g.strokeStyle='#ffd84a';g.lineWidth=2/S;
    if(D.k==='rect'){const x0=Math.min(D.x0,D.x1),y0=Math.min(D.y0,D.y1);edDia(x0,y0,Math.abs(D.x1-D.x0)+1,Math.abs(D.y1-D.y0)+1,0);g.fill();g.stroke();g.font='bold 12px Georgia,serif';label((Math.abs(D.x1-D.x0)+1)+'×'+(Math.abs(D.y1-D.y0)+1),PX(x0,y0),PY(x0,y0,8),'#ffd84a')}
    else edLine(D.x0,D.y0,D.x1,D.y1,(u,v)=>edBrushAt(u,v,(a,b)=>{edDia(a,b,1,1,0);g.fill()}))}
  else if(hv&&edIn(hv[0],hv[1])&&!EDS.pan){g.strokeStyle='rgba(255,216,74,.9)';g.fillStyle='rgba(255,216,74,.14)';g.lineWidth=1.5/S;
    if(edPaintTools())edBrushAt(hv[0],hv[1],(a,b)=>{if(edIn(a,b)){edDia(a,b,1,1,0);g.fill();g.stroke()}});else{edDia(hv[0],hv[1],1,1,0);g.fill();g.stroke()}}}

/* ---- uscire, provare ---- */
function edExit(){edSaveNow(1);EDIT=0;MODE='story';document.body.classList.remove('edm');const el=$('ed');if(el)el.remove();started=0;PM=0;$('pn').style.display='none';$('menu').style.display='flex';inMenu=1;music('menu');mode('parco');cv.style.cursor=''}

/* ================= 7.5: VOXELIA STUDIO — finestre: mappe, mondo, personaggi, missioni, oggetti, variabili ================= */
let EDRR=null,EDWR=null;   // EDRR: ridisegna ciò che contiene la lista di azioni modificata · EDWR: ridisegna la finestra aperta
function edWin(title,html,cls){const el=$('edwin');el.hidden=false;el.className=cls||'';el.innerHTML=`<div class="edwb"><div class="edwh"><b>${title}</b><button class="edx" title="Chiudi (Esc)" onclick="edWinClose()">✕</button></div><div class="edwc" id="edwc">${html}</div></div>`;iconFill(el)}
function edWinSet(html){const c=$('edwc');if(!c)return;const st=c.scrollTop,sub=c.querySelector('.edscr'),ss=sub?sub.scrollTop:0;c.innerHTML=html;c.scrollTop=st;const s2=c.querySelector('.edscr');if(s2)s2.scrollTop=ss}
function edWinClose(){const el=$('edwin');if(el){el.hidden=true;el.innerHTML=''}if(typeof EDSG!=='undefined'&&EDSG.play)edSongStop();EDWR=null;EDRR=edSide;cancelAnimationFrame(EDPV.raf);EDPV.raf=0;if(EM){edRegAll();edRebuildEnts();edSide()}}
const edP=path=>new Function('EW','EDS','EDF','return '+path)(EW,EDS,EDF);
let EDF={};   // oggetto che la finestra sta modificando
function edRR(){if(EDRR)EDRR()}
const edOpt=(L,cur)=>L.map(([a,b])=>`<option value="${esc(a)}"${String(cur)===String(a)?' selected':''}>${esc(b)}</option>`).join('');
const edMapsL=()=>Object.values(EW.maps).map(m=>[m.id,m.n]);
const edItemsL=(none)=>[['',none||'(scegli)'],...Object.values(EW.items).map(d=>[d.id,d.n])];
const edNpcsL=(none)=>[['',none||'(scegli)'],...Object.values(EW.npcs).map(d=>[d.id,d.n])];
const edQuestsL=()=>[['','(scegli)'],...Object.values(EW.quests).map(d=>[d.id,d.ti])];
const edVarsL=()=>[['','(scegli)'],...Object.values(EW.vars).map(d=>[d.id,d.n])];
const edCinesL=()=>[['','(nessuna)'],...Object.values(EW.cines).map(d=>[d.id,d.n])];
function edMusL(){return[['','(quella della mappa)'],...Object.values(EW.songs).map(s=>['song:'+s.id,'🎵 '+s.n]),...Object.keys(ETRKN).filter(k=>TRK[k]).map(k=>[k,ETRKN[k]])]}

/* ---- condizioni e azioni: le stesse ovunque (dialoghi, zone evento, missioni, oggetti, forzieri, nemici) ---- */
const ECOND={var:'Variabile',item:'Ha l\'oggetto',noitem:'Non ha l\'oggetto',quest:'Missione',lv:'Livello almeno',gold:'Oro almeno',gems:'Gemme almeno',time:'Momento del giorno',chance:'Probabilità'};
const EACT={msg:'Messaggio in basso',say:'Battuta di un personaggio',txt:'Finestra con testo',banner:'Titolo grande',gold:'Dai/togli oro',xp:'Dai esperienza',give:'Dai un oggetto',take:'Togli un oggetto',pot:'Dai pozioni',
  heal:'Cura l\'eroe',hurt:'Ferisci l\'eroe',var:'Cambia una variabile',qstart:'Avvia una missione',qstep:'Fai avanzare una missione',qdone:'Completa una missione',tp:'Teletrasporta l\'eroe',cine:'Mostra una cinematica',
  music:'Cambia la musica',sound:'Suono',spawn:'Fai comparire nemici',tile:'Cambia una casella',shop:'Apri un negozio',shake:'Scuoti lo schermo',flash:'Lampo',end:'Vittoria: fine dell\'avventura',fail:'Sconfitta: partita persa'};
const ESND={gioia:'Gioia',mistero:'Mistero',allarme:'Allarme',tuono:'Tuono',campana:'Campana',porta:'Porta',moneta:'Monete',magia:'Magia',ruggito:'Ruggito'};
function edCondHTML(L,path){if(!Array.isArray(L)){try{edP(path+'=[]')}catch(e){}L=[]}let h='<div class="edcl">';
  L.forEach((c,i)=>{const fs=edCondFields(c,path,i);h+=`<div class="edcr"><select onchange="edCSet('${path}',${i},'c',this.value,1)">${edOpt(Object.entries(ECOND),c.c)}</select>${fs}<button title="Togli" onclick="edLDel('${path}',${i})">✕</button></div>`});
  return h+`<button class="edadd" onclick="edLAdd('${path}',{c:'var',v:'',op:'>=',n:1})">＋ condizione</button></div>`}
function edF(path,i,k,v,type,opts,ph){const on=`edCSet('${path}',${i},'${k}',${type==='n'?'+this.value':'this.value'})`;
  if(opts)return`<select onchange="${on}">${edOpt(opts,v)}</select>`;if(type==='n')return`<input type="number" value="${v==null?'':v}" onchange="${on}">`;
  if(type==='ta')return`<textarea rows="2" placeholder="${ph||''}" onchange="${on}">${esc(v||'')}</textarea>`;if(type==='c')return`<input type="color" value="${v||'#ffffff'}" onchange="${on}">`;return`<input value="${esc(v==null?'':v)}" placeholder="${ph||''}" onchange="${on}">`}
function edCondFields(c,p,i){switch(c.c){
  case 'var':return edF(p,i,'v',c.v,'s',edVarsL())+edF(p,i,'op',c.op||'>=','s',[['>=','≥'],['<=','≤'],['==','='],['!=','≠'],['>','>'],['<','<']])+edF(p,i,'n',c.n|0,'n');
  case 'item':case 'noitem':return edF(p,i,'item',c.item,'s',edItemsL())+(c.c==='item'?'×'+edF(p,i,'n',c.n||1,'n'):'');
  case 'quest':return edF(p,i,'q',c.q,'s',edQuestsL())+edF(p,i,'st',c.st||'done','s',[['none','non iniziata'],['active','in corso'],['ready','da consegnare'],['done','completata'],['notdone','non completata']]);
  case 'lv':case 'gold':case 'gems':return edF(p,i,'n',c.n|0,'n');
  case 'time':return edF(p,i,'st',c.st||'day','s',[['day','di giorno'],['night','di notte']]);
  case 'chance':return edF(p,i,'n',c.n||50,'n')+'%'}return''}
function edActHTML(L,path){if(!Array.isArray(L)){try{edP(path+'=[]')}catch(e){}L=[]}let h='<div class="edcl">';
  L.forEach((a,i)=>{h+=`<div class="edcr"><span class="edn">${i+1}</span><select onchange="edCSet('${path}',${i},'a',this.value,1)">${edOpt(Object.entries(EACT),a.a)}</select>${edActFields(a,path,i)}<span class="edmv"><button title="Su" onclick="edLMove('${path}',${i},-1)">▲</button><button title="Giù" onclick="edLMove('${path}',${i},1)">▼</button><button title="Togli" onclick="edLDel('${path}',${i})">✕</button></span></div>`});
  return h+`<button class="edadd" onclick="edLAdd('${path}',{a:'msg',tx:''})">＋ azione</button></div>`}
function edActFields(a,p,i){const F=(k,v,t,o,ph)=>edF(p,i,k,v,t,o,ph);switch(a.a){
  case 'msg':return F('tx',a.tx,'s',0,'testo');case 'say':return F('npc',a.npc||'','s',edNpcsL('(narratore)'))+F('tx',a.tx,'ta',0,'che cosa dice');
  case 'txt':return F('ti',a.ti,'s',0,'titolo')+F('tx',a.tx,'ta',0,'testo');case 'banner':return F('ti',a.ti,'s',0,'titolo')+F('sub',a.sub,'s',0,'sottotitolo');
  case 'gold':case 'xp':case 'pot':case 'hurt':return F('n',a.n|0,'n');case 'heal':return F('n',a.n|0,'n')+'<small class="mu">0 = tutta</small>';
  case 'give':case 'take':return F('item',a.item,'s',edItemsL())+'×'+F('n',a.n||1,'n');
  case 'var':return F('v',a.v,'s',edVarsL())+F('op',a.op||'set','s',[['set','='],['add','+'],['sub','−'],['tog','inverti 0/1']])+F('n',a.n|0,'n');
  case 'qstart':case 'qstep':case 'qdone':return F('q',a.q,'s',edQuestsL());
  case 'tp':return F('map',a.map||'','s',[['','(questa mappa)'],...edMapsL()])+'x'+F('x',a.x==null?-1:a.x,'n')+'y'+F('y',a.y==null?-1:a.y,'n');
  case 'cine':return F('c',a.c,'s',edCinesL());case 'music':return F('m',a.m||'','s',edMusL());case 'sound':return F('s',a.s||'gioia','s',Object.entries(ESND));
  case 'spawn':return F('t',a.t||'slime','s',edEnemyList().map(k=>[k,E[k].n]))+'×'+F('n',a.n||1,'n')+'x'+F('x',a.x==null?-1:a.x,'n')+'y'+F('y',a.y==null?-1:a.y,'n')+'<small class="mu">-1 = vicino all\'eroe</small>';
  case 'tile':return F('map',a.map||'','s',[['','(questa mappa)'],...edMapsL()])+'x'+F('x',a.x|0,'n')+'y'+F('y',a.y|0,'n')+F('to',a.to||'floor','s',[['floor','diventa terreno'],['wall','diventa muro'],['water','diventa acqua'],['void','diventa vuoto'],['nodec','togli la decorazione']]);
  case 'shop':return F('npc',a.npc,'s',edNpcsL());case 'flash':return F('col',a.col||'#ffffff','c');
  case 'end':return F('ti',a.ti,'s',0,'Vittoria!')+F('tx',a.tx,'ta',0,'il finale');case 'fail':return F('tx',a.tx,'ta',0,'perché è finita')}return''}
function edCSet(path,i,k,v,rer){const L=edP(path);if(!L||!L[i])return;L[i][k]=v;if(k==='a'||k==='c'){const o=L[i];for(const q in o)if(q!==k)delete o[q]}edDirty();if(rer)edRR()}
function edLAdd(path,o){let L=edP(path);if(!Array.isArray(L)){edP(path+'=[]');L=edP(path)}L.push(o);edDirty();edRR()}
function edLDel(path,i){const L=edP(path);if(L)L.splice(i,1);edDirty();edRR()}
function edLMove(path,i,d){const L=edP(path);if(!L)return;const j=i+d;if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]];edDirty();edRR()}
function edItemListHTML(L,path){if(!Array.isArray(L)){try{edP(path+'=[]')}catch(e){}L=[]}let h='<div class="edcl">';L.forEach((o,i)=>{h+=`<div class="edcr">${edF(path,i,'item',o.item,'s',edItemsL())}×${edF(path,i,'n',o.n||1,'n')}<button onclick="edLDel('${path}',${i})">✕</button></div>`});
  return h+`<button class="edadd" onclick="edLAdd('${path}',{item:'${Object.keys(EW.items)[0]||''}',n:1})">＋ oggetto</button></div>`}

/* ---- mappe ---- */
const EGEN={vuoto:'Vuota (solo terreno)',prato:'Prato con alberi',bosco:'Bosco fitto con radure',isola:'Isola nel mare',lago:'Valle con lago e fiume',grotta:'Grotta naturale',dungeon:'Dungeon a stanze',villaggio:'Villaggio',interno:'Stanza (interno)',deserto:'Deserto',neve:'Montagna innevata',labirinto:'Labirinto di siepi',arena:'Arena circolare',cielo:'Isola nel cielo'};
function edMapsWin(){EDWR=edMapsWin;let h=`<p class="mu">Ogni mappa è un luogo: un prato, un villaggio, l'interno di una casa, una grotta. Si collegano con porte e passaggi (strumento 🚪) o con i teletrasporti.</p><button onclick="edMapNew()">＋ Nuova mappa</button><div class="edcards">`;
  for(const m of Object.values(EW.maps)){const np=m.e.filter(e=>e.k==='npc').length,ne=m.e.filter(e=>e.k==='en').length;
    h+=`<div class="edcard${m.id===EM.id?' on':''}"><b>${esc(m.n)}</b>${EW.start.map===m.id?' <span class="edtag">🚩 inizio</span>':''}<small>${m.N}×${m.N} · ${ELIGHT[m.light]} · ${np} personaggi · ${ne} nemici · ${m.b.length} edifici</small>
      <span><button onclick="edWinClose();edGoMap('${m.id}')">✏ Apri</button><button onclick="edMapDup('${m.id}')">⧉</button><button class="danger" onclick="edMapDel('${m.id}')" ${Object.keys(EW.maps).length<2?'disabled':''}>🗑</button></span></div>`}
  edWin('🗺 Mappe del mondo',h+'</div>')}
function edMapNew(fromPor){EDF={n:'Nuova mappa',N:32,gen:'prato',light:'ciclo',mus:'forest',lv:1,fromPor:fromPor?1:0};EDWR=edMapNewWin;edMapNewWin()}
function edMapNewWin(){const f=EDF;edWin('＋ Nuova mappa',`<div class="edform"><label>Nome<input value="${esc(f.n)}" onchange="EDF.n=this.value"></label>
  <label>Dimensioni<select onchange="EDF.N=+this.value">${edOpt([[16,'16×16 (stanza)'],[24,'24×24'],[32,'32×32'],[40,'40×40'],[48,'48×48'],[64,'64×64 (grande)'],[80,'80×80'],[96,'96×96 (enorme)']],f.N)}</select></label>
  <label>Parti da<select onchange="EDF.gen=this.value;const L={interno:'interno',grotta:'tenebre',dungeon:'tenebre',cielo:'giorno'};if(L[this.value])EDF.light=L[this.value];edMapNewWin()">${edOpt(Object.entries(EGEN),f.gen)}</select></label>
  <label>Luce<select onchange="EDF.light=this.value">${edOpt(Object.entries(ELIGHT),f.light)}</select></label><label>Musica<select onchange="EDF.mus=this.value">${edOpt(edMusL().slice(1),f.mus)}</select></label>
  <label>Livello dei nemici<input type="number" min="1" max="60" value="${f.lv}" onchange="EDF.lv=+this.value"></label></div><button class="gold" onclick="edMapCreate()">✔ Crea la mappa</button>`)}
function edMapCreate(){const f=EDF,m=edNewMap({n:f.n||'Mappa',N:f.N,light:f.light,mus:f.mus,lv:f.lv});edGenerate(m,f.gen);EW.maps[m.id]=m;edZone(m);edDirty();
  if(f.fromPor){EDS.porTo=m.id}edWinClose();edOpenMap(m.id);edToast('Mappa «'+m.n+'» creata')}
function edMapDup(id){const m=edClone(EW.maps[id]);m.id=edUid('m');m.n+=' (copia)';for(const e of m.e)e.u=edUid('e');for(const b of m.b)b.u=edUid('b');EW.maps[m.id]=m;edZone(m);edDirty();edMapsWin()}
function edMapDel(id){if(Object.keys(EW.maps).length<2)return;const m=EW.maps[id];if(!confirm('Eliminare la mappa «'+m.n+'»? Porte e teletrasporti verso di lei resteranno senza destinazione.'))return;
  delete EW.maps[id];delete Z[edZk(id)];if(EW.start.map===id){const q=Object.values(EW.maps)[0];EW.start={map:q.id,x:q.sp[0],y:q.sp[1]}}EDS.undo=[];EDS.redo=[];edDirty();if(EM.id===id)edOpenMap(EW.start.map);edMapsWin()}
function edMapWin(){EDF=EM;EDWR=edMapWin;EDRR=edMapWin;const m=EM;
  const h=`<div class="edform"><label>Nome<input value="${esc(m.n)}" onchange="EM.n=this.value;edZone(EM);edDirty();$('edmap').innerHTML=edMapOpts(EM.id)"></label>
  <label>Dimensioni<span><select id="edmN">${edOpt([[12,12],[16,16],[20,20],[24,24],[32,32],[40,40],[48,48],[56,56],[64,64],[72,72],[80,80],[96,96]].map(([a])=>[a,a+'×'+a]),m.N)}</select> <button onclick="edResize(+$('edmN').value)">Applica</button></span></label>
  <label>Luce<select onchange="EM.light=this.value;edZone(EM);edBuild();edDirty();edMapWin()">${edOpt(Object.entries(ELIGHT),m.light)}</select></label>
  ${['giorno','ciclo','notte'].includes(m.light)?`<label>Cielo<select onchange="EM.sky=this.value;edZone(EM);edDirty()">${edOpt(Object.entries(ESKY).map(([k,v])=>[k,v[0]]),m.sky)}</select></label>`:`<label>Sfondo<input type="color" value="${m.bg||'#141820'}" onchange="EM.bg=this.value;edZone(EM);edDirty()"></label>`}
  <label>Liquido<select onchange="EM.liq=this.value;edZone(EM);edBuild();edDirty()">${edOpt(Object.entries(ELIQ).map(([k,v])=>[k,v.n]),m.liq)}</select></label>
  <label>Musica<select onchange="EM.mus=this.value;edZone(EM);edDirty();if(EDS.mus)music(ZZ.mus)">${edOpt(edMusL().slice(1),m.mus)}</select></label>
  <label>Particelle nell'aria<select onchange="EM.pt=this.value;edZone(EM);edDirty()">${edOpt(Object.entries(EPART),m.pt)}</select></label>
  <label>Livello dei nemici<input type="number" min="1" max="60" value="${m.lv}" onchange="EM.lv=clamp(+this.value|0,1,60);edZone(EM);edRebuildEnts();edDirty()"></label>
  <label><span><input type="checkbox" ${m.low?'checked':''} onchange="EM.low=this.checked?1:0;edBuild();edDirty()"> Muri bassi sul bordo davanti (si vede dentro, come negli interni)</span></label></div>
  <h5>Quando l'eroe entra</h5><label class="edl">Cinematica la prima volta <select onchange="EM.cine=this.value;edDirty()">${edOpt(edCinesL(),m.cine||'')}</select></label>${edActHTML(m.enter,'EDF.enter')}
  <h5>Rigenera la mappa</h5><p class="mu">Cancella tutto e la ricostruisce da un modello (si può annullare con Ctrl+Z).</p><span><select id="edgen">${edOpt(Object.entries(EGEN),'prato')}</select> <button class="danger" onclick="edRegen($('edgen').value)">Rigenera</button></span>
  <h5>Trasforma la mappa</h5><p class="mu">Ruota o specchia tutto: terreno, arredi, edifici, oggetti, zone evento, punto d'arrivo e inizio. Si annulla con Ctrl+Z.</p><div class="edbtns"><button onclick="edMapXf('rot');edMapWin()">⟳ Ruota di 90°</button><button onclick="edMapXf('x');edMapWin()">${edI('fliph')} Specchia</button><button onclick="edMapXf('y');edMapWin()">${edI('flipv')} Capovolgi</button></div>
  <div class="edrow"><span>Sposta tutto di</span><span>x <input type="number" id="edmdx" value="0" min="-95" max="95" style="width:64px"> y <input type="number" id="edmdy" value="0" min="-95" max="95" style="width:64px"> <button onclick="edMapXf('shift',+$('edmdx').value,+$('edmdy').value);edMapWin()">Sposta</button></span></div>`;
  if($('edwin').hidden||!$('edwc'))edWin('⚙ Proprietà della mappa',h);else edWinSet(h)}
function edRegen(k){edPush('rigenera');const keep={id:EM.id,n:EM.n,light:EM.light,sky:EM.sky,mus:EM.mus,lv:EM.lv,pt:EM.pt,liq:EM.liq,enter:EM.enter,cine:EM.cine};const m=edNewMap({N:EM.N});edGenerate(m,k);
  Object.assign(EM,m,keep);edZone(EM);edBuild();edDirty();edWinClose();edToast('Mappa rigenerata: Ctrl+Z per tornare indietro')}
function edResize(n2){n2=clamp(n2|0,12,96);if(n2===EM.N)return;edPush('dimensioni');const m=EM,o=m.N,nn=n2*n2,T=new Array(nn).fill(0),F=new Array(nn).fill(m.f[0]||0),Wl=new Array(nn).fill(0),D={},DW={};
  for(let y=0;y<Math.min(o,n2);y++)for(let x=0;x<Math.min(o,n2);x++){const i=y*o+x,j=y*n2+x;T[j]=m.t[i];F[j]=m.f[i];Wl[j]=m.w[i];if(m.d[i])D[j]=m.d[i];if(m.dw[i])DW[j]=1}
  Object.assign(m,{N:n2,t:T,f:F,w:Wl,d:D,dw:DW});m.e=m.e.filter(e=>e.x<n2&&e.y<n2);for(const e of m.e)if(e.k==='trig'){e.w=Math.min(e.w,n2-e.x);e.h=Math.min(e.h,n2-e.y)}m.b=m.b.filter(b=>b.x+b.w<=n2&&b.y+b.h<=n2);
  m.sp=[Math.min(m.sp[0],n2-1),Math.min(m.sp[1],n2-1)];if(EW.start.map===m.id){EW.start.x=Math.min(EW.start.x,n2-1);EW.start.y=Math.min(EW.start.y,n2-1)}edZone(m);edBuild();edDirty();$('edmap').innerHTML=edMapOpts(m.id);edMapWin()}

/* ---- generatori: un punto di partenza per ogni tipo di luogo ---- */
function edGenerate(m,k){const n=m.N,I=(x,y)=>y*n+x,inb=(x,y)=>x>=0&&y>=0&&x<n&&y<n,rnd=Math.random,ri2=(a,b)=>a+Math.floor(rnd()*(b-a+1));
  const fl=(x,y,mat)=>{if(!inb(x,y))return;const i=I(x,y);m.t[i]=0;m.f[i]=EMATI[mat];delete m.d[i]},wl=(x,y,st)=>{if(!inb(x,y))return;const i=I(x,y);m.t[i]=1;m.w[i]=EWALI[st];delete m.d[i]},
    wa=(x,y)=>{if(!inb(x,y))return;const i=I(x,y);m.t[i]=2;delete m.d[i]},dc=(x,y,c,walk)=>{if(!inb(x,y))return;const i=I(x,y);if(m.t[i]!==0)return;m.d[i]=c;if(walk)m.dw[i]=1},
    vd=(x,y)=>{if(inb(x,y)){m.t[I(x,y)]=9;delete m.d[I(x,y)]}},all=(f)=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)f(x,y)},
    free=(x,y)=>inb(x,y)&&m.t[I(x,y)]===0&&!m.d[I(x,y)],far=(x,y,r)=>Math.hypot(x-m.sp[0],y-m.sp[1])>r,
    scat=(c,p,cond)=>all((x,y)=>{if(free(x,y)&&rnd()<p&&far(x,y,3)&&(!cond||cond(x,y)))dc(x,y,c)}),border=st=>all((x,y)=>{if(!x||!y||x===n-1||y===n-1)wl(x,y,st)});
  m.t.fill(0);m.d={};m.dw={};m.b=[];m.e=[];m.sp=[n>>1,n>>1];
  switch(k){
  case 'vuoto':m.f.fill(EMATI.erba);break;
  case 'prato':m.f.fill(EMATI.erba);all((x,y)=>{if(hh(x*.31,y*.27)>.62)m.f[I(x,y)]=EMATI.fiori});scat('r',.05);scat('a',.01);scat('h',.02);scat('u',.012);scat('o',.006);break;
  case 'bosco':m.f.fill(EMATI.erba2);all((x,y)=>{const v=hh(x*.13,y*.17)*.6+hh(x*.41,y*.37)*.4;if(v>.58&&far(x,y,4))wl(x,y,'alberi');else if(v>.5)dc(x,y,rnd()<.5?'r':'h')});border('alberi');scat('u',.01);scat('m',.008);scat('ŵ',.03);
    for(let i=0;i<n/8;i++)m.e.push({u:edUid('e'),k:'en',x:ri2(3,n-4),y:ri2(3,n-4),t:['slime','lupo','goblin'][i%3],lv:0,boss:0,resp:0,acts:[],cond:[]});m.e=m.e.filter(e=>m.t[I(e.x,e.y)]===0&&!m.d[I(e.x,e.y)]&&far(e.x,e.y,6));break;
  case 'isola':{m.f.fill(EMATI.sabbia);const c=n/2;all((x,y)=>{const d=Math.hypot(x-c+.5,y-c+.5)/(n/2)+(hh(x*.2,y*.2)-.5)*.25;if(d>.82)wa(x,y);else if(d<.62)m.f[I(x,y)]=EMATI.erba});scat('r',.04,(x,y)=>m.f[I(x,y)]===EMATI.erba);scat('¢',.01,(x,y)=>m.f[I(x,y)]===EMATI.sabbia);
    all((x,y)=>{if(m.t[I(x,y)]===2&&rnd()<.004)m.d[I(x,y)]=rnd()<.5?'O':'^'});m.liq='mare';m.sky='sereno';break}
  case 'lago':{m.f.fill(EMATI.erba);const lx=n*.62,ly=n*.38,r=n*.16;all((x,y)=>{if(Math.hypot(x-lx,y-ly)+(hh(x*.3,y*.3)-.5)*3<r)wa(x,y)});let rx=lx;for(let y=Math.floor(ly);y<n;y++){rx+=Math.sin(y*.4)*.9-.15;for(let k=-1;k<=1;k++)wa(Math.round(rx)+k,y)}
    const by=Math.floor(n*.75);for(let x=0;x<n;x++){const i=I(x,by);if(m.t[i]===2){m.t[i]=0;m.f[i]=EMATI.pontile}}for(let x=0;x<n;x++){fl(x,by-1,'sentiero');if(m.t[I(x,by)]!==0)continue;fl(x,by,'sentiero')}scat('r',.05);scat('h',.015);scat('u',.01);break}
  case 'grotta':{m.f.fill(EMATI.roccia);all((x,y)=>{m.t[I(x,y)]=rnd()<.45?1:0});for(let it=0;it<5;it++){const T=m.t.slice();all((x,y)=>{let c=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const u=x+a,v=y+b;if(!inb(u,v)||T[I(u,v)]===1)c++}m.t[I(x,y)]=c>=5?1:0})}
    m.w.fill(EWALI.roccia);border('roccia');for(let b=-2;b<=2;b++)for(let a=-2;a<=2;a++){const x=m.sp[0]+a,y=m.sp[1]+b;if(inb(x,y)&&x>0&&y>0&&x<n-1&&y<n-1)m.t[I(x,y)]=0}
    edConnect(m);scat('1',.012);scat('2',.02);scat('8',.008);scat('u',.012);all((x,y)=>{if(free(x,y)&&rnd()<.01)m.e.push({u:edUid('e'),k:'tc',x,y})});m.light='tenebre';m.mus='tana';break}
  case 'dungeon':{m.f.fill(EMATI.cripta);m.t.fill(1);m.w.fill(EWALI.cripta);const rooms=[];for(let q=0;q<300&&rooms.length<4+n/6;q++){const w=ri2(5,9),h=ri2(5,9),x=ri2(1,n-w-2),y=ri2(1,n-h-2);if(rooms.some(r=>x<r.x+r.w+1&&x+w+1>r.x&&y<r.y+r.h+1&&y+h+1>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)});for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.t[I(i,j)]=0}
    rooms.sort((a,b)=>a.cx+a.cy-b.cx-b.cy);for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i];for(let x=Math.min(a.cx,b.cx);x<=Math.max(a.cx,b.cx);x++)m.t[I(x,a.cy)]=0;for(let y=Math.min(a.cy,b.cy);y<=Math.max(a.cy,b.cy);y++)m.t[I(b.cx,y)]=0}
    if(rooms.length){m.sp=[rooms[0].cx,rooms[0].cy];for(const r of rooms){m.e.push({u:edUid('e'),k:'tc',x:r.x,y:r.y},{u:edUid('e'),k:'tc',x:r.x+r.w-1,y:r.y})}const L=rooms[rooms.length-1];m.e.push({u:edUid('e'),k:'ch',x:L.cx,y:L.cy,rich:1,g:0,rnd:2,items:[],acts:[]});
      rooms.slice(1).forEach((r,i)=>{for(let q=0;q<2;q++)m.e.push({u:edUid('e'),k:'en',x:ri2(r.x+1,r.x+r.w-2),y:ri2(r.y+1,r.y+r.h-2),t:['scheletro','zombie','pipistrello'][(i+q)%3],lv:0,boss:0,resp:0,acts:[],cond:[]})})}
    scat('{',.01);scat('4',.006);scat('5',.006);m.light='tenebre';m.mus='dungeon';break}
  case 'villaggio':{m.f.fill(EMATI.erba);const c=n>>1;for(let i=0;i<n;i++){for(let k=-1;k<=0;k++){fl(i,c+k,'strada');fl(c+k,i,'strada')}}for(let y=c-3;y<=c+2;y++)for(let x=c-3;x<=c+2;x++)fl(x,y,'ciottoli');dc(c-1,c-1,'Y');
    const H=[[c-9,c-8],[c+3,c-8],[c-9,c+4],[c+4,c+4],[c-15,c-8],[c+10,c+4]];const cols=[['#e0d0b0','#a8402f'],['#c8b89a','#3a5a8a'],['#b8c8a0','#6a3a8a'],['#f0dcc0','#c8783a'],['#d8c8a0','#2a6a4a'],['#e8d8e8','#8a3a6a']];
    H.forEach(([x,y],i)=>{if(x<1||y<1||x+5>n-1||y+4>n-2)return;m.b.push({u:edUid('b'),x,y,w:5,h:4,st:i===0?'fumo':'casa',wall:cols[i%6][0],roof:cols[i%6][1],ht:24,door:1,dx:x+2,to:'',n:''})});
    for(let i=4;i<n;i+=7){dc(i,c-3,'l');dc(c+2,i,'l')}scat('r',.03,(x,y)=>Math.abs(x-c)>8||Math.abs(y-c)>8);scat('o',.01);m.sp=[c+1,c+3];m.mus='town';break}
  case 'interno':{edGenRoom(m,Math.min(n-2,14),Math.min(n-2,12));break}
  case 'deserto':m.f.fill(EMATI.sabbia);all((x,y)=>{const v=hh(x*.11,y*.13);if(v>.72&&far(x,y,4))wl(x,y,'dune')});scat('¢',.03);scat('u',.012);scat('{',.004);m.sky='deserto';m.pt='dust';m.mus='desert';break;
  case 'neve':m.f.fill(EMATI.neve);all((x,y)=>{const v=hh(x*.12,y*.15);if(v>.66&&far(x,y,4))wl(x,y,'abeti');else if(v<.1)m.f[I(x,y)]=EMATI.ghiaccio});scat('9',.008);scat('u',.01);m.sky='neve';m.pt='snow';m.mus='peaks';break;
  case 'labirinto':{m.f.fill(EMATI.sentiero);m.t.fill(1);m.w.fill(EWALI.siepe);const W2=Math.floor((n-1)/2),seen=new Uint8Array(W2*W2),st=[[0,0]];seen[0]=1;fl(1,1,'sentiero');
    while(st.length){const[cx,cy]=st[st.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[cx+a,cy+b]).filter(([a,b])=>a>=0&&b>=0&&a<W2&&b<W2&&!seen[b*W2+a]);if(!nb.length){st.pop();continue}const[nx,ny]=nb[Math.floor(rnd()*nb.length)];seen[ny*W2+nx]=1;
      fl(nx*2+1,ny*2+1,'sentiero');fl(cx*2+1+(nx-cx),cy*2+1+(ny-cy),'sentiero');st.push([nx,ny])}m.sp=[1,1];m.e.push({u:edUid('e'),k:'ch',x:(W2-1)*2+1,y:(W2-1)*2+1,rich:1,g:0,rnd:2,items:[],acts:[]});break}
  case 'arena':{m.f.fill(EMATI.sabbia);const c=n/2;all((x,y)=>{const d=Math.hypot(x-c+.5,y-c+.5);if(d>c-1.5)wl(x,y,'mura');else if(d>c-3.5&&(x+y)%5===0)dc(x,y,'ℶ')});m.mus='arena';break}
  case 'cielo':{m.f.fill(EMATI.erba);const c=n/2;all((x,y)=>{const d=Math.hypot(x-c+.5,y-c+.5)/(n/2)+(hh(x*.25,y*.25)-.5)*.3;if(d>.78)vd(x,y);else if(d>.68)m.f[I(x,y)]=EMATI.roccia});scat('r',.04);scat('h',.02);m.sky='sereno';m.pt='petal';m.bg='#9fd0f0';break}}
  if(m.t[I(m.sp[0],m.sp[1])]!==0||m.d[I(m.sp[0],m.sp[1])]){m.t[I(m.sp[0],m.sp[1])]=0;delete m.d[I(m.sp[0],m.sp[1])]}if(k!=='labirinto')edConnect(m);m.e=m.e.filter(e=>e.k!=='en'||(m.t[I(e.x,e.y)]===0&&!m.d[I(e.x,e.y)]));return m}
// stanza al centro della mappa con la porta in basso
function edGenRoom(m,w,h){const n=m.N,I=(x,y)=>y*n+x;w=Math.min(w,n);h=Math.min(h,n);const x0=Math.max(0,(n-w)>>1),y0=Math.max(0,(n-h)>>1);m.t.fill(9);m.f.fill(EMATI.legno);m.w.fill(EWALI.interno);
  for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const i=I(x,y);m.t[i]=(x===x0||y===y0||x===x0+w-1||y===y0+h-1)?1:0}m.low=1;
  const dx=x0+(w>>1),dy=y0+h-1;m.t[I(dx,dy)]=0;m.f[I(dx,dy)]=EMATI.legno;m.e=m.e.filter(e=>e.k!=='po');m.e.push({u:edUid('e'),k:'po',x:dx,y:dy,st:'exit',to:'',n:'Esci',face:'s'});m.sp=[dx,dy-1];
  const D=(x,y,c)=>{const i=I(x,y);if(m.t[i]===0&&!(x===dx&&y>=dy-1))m.d[i]=c};D(x0+1,y0+1,'S');D(x0+2,y0+1,'S');D(x0+w-2,y0+1,'F');D(x0+w-2,y0+h-2,'p');D(x0+1,y0+h-2,'b');D(x0+(w>>1)-1,y0+(h>>1),'T');D(x0+(w>>1),y0+(h>>1),'T');
  for(let x=x0+2;x<x0+w-2;x++)if(Math.abs(x-dx)<=1)for(let y=y0+3;y<dy;y++)m.f[I(x,y)]=EMATI.rosso;return m}
// apre un corridoio verso le sacche chiuse, così tutta la grotta è raggiungibile
// collega al punto di arrivo tutte le parti di terreno chiuse (scava tra muri e arredi); le sacche minuscole si riempiono
function edConnect(m){for(let k=0;k<6;k++)if(!edConnect1(m))break}
function edConnect1(m){let ch=0;const n=m.N,NN=n*n,D=[1,-1,n,-n],nb=(c,k)=>{const x=c%n;if(k===0&&x===n-1||k===1&&x===0)return-1;const j=c+D[k];return j<0||j>=NN?-1:j},
  bl=i=>m.t[i]!==0||(m.d[i]&&!(m.dw&&m.dw[i])&&!edDecWalk(m.d[i])),main=new Uint8Array(NN),s0=m.sp[1]*n+m.sp[0];if(bl(s0))return 0;
  const flood=(src,mark,lab)=>{const q=[src];mark[src]=lab;for(let i=0;i<q.length;i++)for(let k=0;k<4;k++){const j=nb(q[i],k);if(j>=0&&!mark[j]&&!bl(j)){mark[j]=lab;q.push(j)}}return q};
  flood(s0,main,1);const seen=new Uint8Array(NN);
  for(let c=0;c<NN;c++){if(main[c]||seen[c]||bl(c))continue;const comp=flood(c,seen,1);
    if(comp.length<=2){let ok=0;for(const i of comp)for(let k=0;k<4&&!ok;k++){const j=nb(i,k);if(j>=0&&m.t[j]===1){ok=1;for(const z of comp){m.t[z]=1;m.w[z]=m.w[j];delete m.d[z]}}}if(ok){ch=1;continue}}
    // dal pezzo chiuso alla casella raggiungibile più vicina
    const par=new Int32Array(NN).fill(-2),q=comp.slice();for(const i of q)par[i]=-1;let hit=-1;
    for(let i=0;i<q.length&&hit<0;i++)for(let k=0;k<4;k++){const j=nb(q[i],k);if(j<0||par[j]!==-2)continue;par[j]=q[i];if(main[j]){hit=j;break}q.push(j)}
    if(hit<0)continue;ch=1;for(let j=par[hit];j>=0&&par[j]!==-1;j=par[j]){if(m.t[j]===2)m.f[j]=EMATI.pontile;m.t[j]=0;delete m.d[j];main[j]=1}
    for(const i of comp)main[i]=1}return ch}

/* ---- il mondo ---- */
function edWorldWin(){EDWR=edWorldWin;EDF=EW.set;EDRR=edWorldWin;const w=EW,s=w.set,gear=s.gear;const gl=k=>edItemsL('(base)').filter(([id])=>!id||EW.items[id].k===k);
  const h=`<div class="edform"><label>Nome del mondo<input value="${esc(w.name)}" maxlength="60" onchange="EW.name=this.value;$('edwn').textContent=this.value;edDirty()"></label><label>Autore<input value="${esc(w.author||'')}" maxlength="30" onchange="EW.author=this.value;edDirty()"></label>
  <label class="wide">Descrizione<textarea rows="3" maxlength="600" onchange="EW.desc=this.value;edDirty()">${esc(w.desc)}</textarea></label></div>
  <h5>L'eroe all'inizio</h5><div class="edform"><label>Livello<input type="number" min="1" max="60" value="${s.lv}" onchange="EW.set.lv=clamp(+this.value|0,1,60);edDirty()"></label><label>Oro<input type="number" min="0" value="${s.g}" onchange="EW.set.g=Math.max(0,+this.value|0);edDirty()"></label>
  <label>Pozioni<input type="number" min="0" max="99" value="${s.pot}" onchange="EW.set.pot=clamp(+this.value|0,0,99);edDirty()"></label><label>Posti nello zaino<input type="number" min="8" max="60" value="${s.bag}" onchange="EW.set.bag=clamp(+this.value|0,8,60);edDirty()"></label>
  <label>Arma<select onchange="EW.set.gear.w=this.value;edDirty()">${edOpt(gl('w'),gear.w)}</select></label><label>Elmo<select onchange="EW.set.gear.h=this.value;edDirty()">${edOpt(gl('h'),gear.h)}</select></label>
  <label>Corazza<select onchange="EW.set.gear.c=this.value;edDirty()">${edOpt(gl('c'),gear.c)}</select></label><label>Scudo<select onchange="EW.set.gear.s=this.value;edDirty()">${edOpt(gl('s'),gear.s)}</select></label>
  <label><span><input type="checkbox" ${s.rod?'checked':''} onchange="EW.set.rod=this.checked?1:0;edDirty()"> Ha una canna da pesca</span></label></div>
  <h5>Regole</h5><div class="edform"><label>Difficoltà<select onchange="EW.set.diff=+this.value;edDirty()">${edOpt(DFS.map((d,i)=>[i,d.n]),s.diff)}</select></label><label><span><input type="checkbox" ${s.perm?'checked':''} onchange="EW.set.perm=this.checked?1:0;edDirty()"> Morte permanente</span></label>
  <label>Esperienza ×<input type="number" step=".1" min=".1" max="10" value="${s.xpm}" onchange="EW.set.xpm=clamp(+this.value,.1,10);edDirty()"></label><label>Oro ×<input type="number" step=".1" min=".1" max="10" value="${s.gm}" onchange="EW.set.gm=clamp(+this.value,.1,10);edDirty()"></label>
  <label>Ora di partenza<select onchange="EW.set.time=+this.value;edDirty()">${edOpt([[360,'06:00 alba'],[480,'08:00 mattina'],[720,'12:00'],[1020,'17:00'],[1170,'19:30 tramonto'],[1320,'22:00 notte']],s.time)}</select></label>
  <label><span><input type="checkbox" ${s.day?'checked':''} onchange="EW.set.day=this.checked?1:0;edDirty()"> Il tempo scorre (giorno e notte)</span></label>
  <label>Gemme per vincere<input type="number" min="0" max="999" value="${s.gems}" onchange="EW.set.gems=Math.max(0,+this.value|0);edDirty()"></label><label class="wide">Obiettivo mostrato in alto a destra<input value="${esc(s.obj||'')}" placeholder="per esempio Trova le tre chiavi del faro" onchange="EW.set.obj=this.value;edDirty()"></label></div>
  <h5>Inizio e fine</h5><div class="edform"><label>Cinematica d'apertura<select onchange="EW.set.intro=this.value;edDirty()">${edOpt(edCinesL(),s.intro)}</select></label><label class="wide">Testo della vittoria (con le gemme o l'azione «Vittoria»)<textarea rows="2" onchange="EW.set.end=this.value;edDirty()">${esc(s.end||'')}</textarea></label></div>
  <h5>File</h5><button onclick="edExport(EW)">📤 Esporta il mondo in un file</button><button onclick="edSaveNow()">💾 Salva adesso</button><p class="mu">Il mondo si salva in questo browser (automaticamente ogni 30 secondi). Esportalo per tenerne una copia o per regalarlo a qualcuno: si importa dal Parco giochi.</p>`;
  if($('edwin').hidden||!$('edwc'))edWin('🌍 Il mondo',h);else edWinSet(h)}
function edExport(w){try{const b=new Blob([JSON.stringify(edPack(w))],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(w.name||'mondo').replace(/[^\w\- àèéìòù]/gi,'').trim().replace(/\s+/g,'_')+'.voxelia.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}catch(e){edToast('Esportazione non riuscita','err')}}

/* ---- personaggi ---- */
const EHAIR=[['none','Calvo'],['short','Corti'],['bald2','Solo ai lati'],['tonsure','Tonsura'],['long','Lunghi'],['bun','Chignon'],['tail','Coda'],['braids','Trecce'],['curly','Ricci'],['spiky','A punta'],['mohawk','Cresta'],['wild','Arruffati'],['mane','Criniera']];
const EBEARD=[['none','Niente'],['stubble','Barba incolta'],['mous','Baffi'],['bigmous','Baffoni'],['goatee','Pizzetto'],['full','Barba'],['long','Barba lunga']];
const EHAT=[['none','Niente'],['cap','Berretto'],['beret','Basco'],['straw','Paglia'],['tophat','Cilindro'],['bowler','Bombetta'],['feather','Cappello con piuma'],['tricorn','Tricorno'],['bicorne','Bicorno'],['cowboy','Da cowboy'],['sailor','Da marinaio'],['captain','Da capitano'],
  ['souwester','Cerata'],['chef','Da cuoco'],['wizard','Da mago'],['kepi','Kepì'],['helmet','Elmo'],['hood','Cappuccio'],['crown','Corona'],['diadem','Diadema'],['veil','Velo'],['scarf','Foulard'],['bandana','Bandana'],['turban','Turbante'],['phrygian','Berretto frigio'],['headband','Fascia'],['bandage','Benda'],['flower','Fiori'],['bow','Fiocco']];
const EXS=[['apron','Grembiule',1],['cape','Mantello',1],['vest','Gilet',1],['scarf','Sciarpa',1],['sash','Fascia',1],['armor','Armatura',1],['robe','Veste lunga',1],['stripes','Righe',1],['check','Quadri'],['patches','Toppe'],['epaulet','Spalline'],['medal','Medaglia'],['star','Stella'],['buttons','Bottoni'],
  ['collar','Colletto'],['necklace','Collana'],['cross','Croce'],['dogtag','Piastrina'],['bowtie','Farfallino'],['pouch','Borsello'],['sheath','Fodero'],['paint','Macchie di colore'],['flour','Farina'],['glasses','Occhiali'],['eyepatch','Benda sull\'occhio'],['pipe','Pipa'],['rednose','Naso rosso'],
  ['freckles','Lentiggini'],['scar','Cicatrice'],['earring','Orecchino'],['scowl','Sopracciglia aggrottate'],['shine','Testa lucida'],['horseshoe','Ferro di cavallo'],['stars','Stelline'],['belly','Pancia'],['arms','Braccia muscolose']];
const EPROP=[['none','Niente'],['sword','Spada'],['big','Spadone'],['spear','Lancia'],['axe','Ascia'],['hammer','Martello'],['dagger','Pugnale'],['cutlass','Sciabola'],['shield','Scudo'],['staff','Bastone magico'],['scepter','Scettro'],['pistol','Pistola'],['rifle','Fucile'],
  ['mallet','Mazza'],['lute','Liuto'],['book','Libro'],['scroll','Pergamena'],['quill','Penna e registro'],['broom','Scopa'],['rake','Rastrello'],['pitchfork','Forcone'],['crook','Bastone da pastore'],['cane','Bastone da passeggio'],['ladle','Mestolo'],['tray','Vassoio'],['mug','Boccale'],
  ['bottle','Bottiglia'],['flask','Ampolla'],['lantern','Lanterna'],['torch','Torcia'],['net','Rete'],['rod','Canna da pesca'],['basket','Cesto'],['flowers','Fiori'],['coinbag','Sacchetto di monete'],['dice','Dadi'],['telescope','Cannocchiale'],['palette','Tavolozza'],['bread','Pane'],
  ['fish','Pesce'],['keys','Chiavi'],['fan','Ventaglio'],['bell','Campanella'],['flag','Bandiera'],['sack','Sacco'],['rope','Corda'],['saw','Sega'],['skull','Teschio'],['lens','Lente'],['rollpin','Mattarello'],['shears','Forbici'],['crate','Cassa sulla testa']];
const EANIM=[['idle','Tranquillo'],['proud','Fiero'],['guard','Sull\'attenti'],['salute','Saluta militare'],['wave','Saluta con la mano'],['bow','Si inchina'],['shout','Richiama la gente'],['declaim','Recita'],['laugh','Ride di gusto'],['angry','Arrabbiato'],['sad','Triste'],['tired','Stanco'],
  ['nervous','Nervoso'],['old','Anziano curvo'],['kid','Bambino che saltella'],['dance','Balla'],['drink','Beve'],['drunk','Ubriaco'],['read','Legge'],['write','Scrive'],['count','Conta le monete'],['pray','Prega'],['look','Guarda lontano'],['fan','Si fa aria'],
  ['hammer','Batte il martello'],['chop','Spacca la legna'],['pitch','Usa il forcone'],['sweep','Spazza'],['stir','Mescola'],['wipe','Pulisce il bancone'],['paint','Dipinge'],['lute','Suona il liuto'],['fish','Pesca'],['kungfu','Arti marziali'],['sword2','Si allena con la spada'],['drill','Istruttore']];
const EBODY=[['f','Donna'],['fat','Robusto'],['tall','Alto'],['big','Massiccio'],['old','Anziano'],['kid','Bambino']];
const EANIMAL=[['','(una persona)'],['mucca','Mucca'],['pecora','Pecora'],['maiale','Maiale'],['gallina','Gallina'],['cavallo','Cavallo marrone'],['cavallo2','Cavallo bianco'],['cavallo3','Cavallo nero'],['gabbiano','Gabbiano']].filter(([k])=>!k||(typeof ANM!=='undefined'&&ANM[k]));
const ESKIN=[['a','#ffdbac'],['b','#f1c27d'],['c','#e0ac69'],['d','#c68642'],['e','#a0662f'],['f','#8d5524']];
const EDPV={raf:0,fc:1,t0:0};
function edNpcNew(x,y){const d=edFixNpc({id:edUid('n'),n:'Nuovo personaggio'});d.look=edRandLook();EW.npcs[d.id]=d;edRegNpc(d);EDS.npc=d.id;edDirty();if(x!=null&&EM){const o=edAddEnt({k:'npc',x,y,npc:d.id,fc:1,beh:'fermo',cond:[]});EDS.sel={k:'npc',d:o}}edNpcWin(d.id)}
function edRandLook(){const r=a=>a[Math.floor(Math.random()*a.length)],f=Math.random()<.45,HC=HAIRC.slice(0,8);const L={sk:r(ESKIN)[0],hair:f?r(['long','bun','tail','braids','curly']):r(['short','short','bald2','curly','spiky','wild']),hc:r(HC),beard:f?'none':r(['none','none','stubble','mous','full','goatee']),bc:'',
  hat:r(['none','none','cap','straw','beret','scarf','feather','bowler']),h1:r(['#6a3a2a','#2a4a6a','#8a1a2a','#3a5a2a','#d8c070','#1a1a1a']),h2:'',c:r(['#3a6ea5','#a8632f','#5a8a3a','#8a3a3a','#6a3a8a','#c0a050','#3a3a4a','#2a7a7a']),xs:Math.random()<.5?[r(['apron','vest','scarf','cape','belly'])]:[],
  prop:r(['none','none','book','mug','basket','bread','flowers','cane']),an:r(['idle','idle','shout','read','proud','wave']),body:f?['f']:[r(['n','n','fat','tall'])]};return L}
function edLookFromGame(id){const sp=(NPS[id]||'R|R|R|none|none|none|idle|n').split('|'),L=edRandLook(),col=s=>{const i=(s||'').indexOf(':');return i<0?[s,'']:[s.slice(0,i),s.slice(i+1).split(':')[0]]};
  const[sk,hair,beard,hat,xs,prop,an,body]=sp;if(sk&&sk!=='R')L.sk=sk;if(hair&&hair!=='R'){const[a,b]=col(hair);L.hair=a;if(b)L.hc=hx6(b)}if(beard&&beard!=='R'){const[a,b]=col(beard);L.beard=a;L.bc=b?hx6(b):''}
  if(hat&&hat!=='R'){const p=hat.split(':');L.hat=p[0];L.h1=p[1]?hx6(p[1]):hx6((NPCS[id]||{}).hat||'#555555');L.h2=p[2]?hx6(p[2]):''}
  if(xs&&xs!=='R')L.xs=xs==='none'?[]:xs.split(',').map(t=>{const[a,b]=col(t);return b?{k:a,c:hx6(b)}:a});if(prop&&prop!=='R')L.prop=prop;if(an&&an!=='R')L.an=an;if(body&&body!=='R')L.body=body.split(',');L.c=hx6((NPCS[id]||{}).c||L.c);return L}
function edNpcWin(id){if(!EW)return;EDS.npcW=id&&EW.npcs[id]?id:EDS.npcW&&EW.npcs[EDS.npcW]?EDS.npcW:Object.keys(EW.npcs)[0]||'';EDS.npcTab=EDS.npcTab||'look';EDWR=edNpcRender;EDRR=edNpcRender;edWin('🧑 Personaggi','','wide');edNpcRender()}
function edNpcRender(){const L=Object.values(EW.npcs),d=EW.npcs[EDS.npcW];EDF=d||{};let h=`<div class="edsplit"><div class="edcol"><button onclick="edNpcNew()">＋ Nuovo</button><div class="edlist">`;
  for(const q of L)h+=`<button class="edli${q.id===EDS.npcW?' on':''}" onclick="EDS.npcW='${q.id}';edNpcRender()"><img src="${edNpcThumb(q)}" alt=""><span><b>${esc(q.n)}</b><small>${esc(q.title||EDROLE[q.role]||'')}</small></span></button>`;
  h+=`</div></div><div class="edmain edscr">`;
  if(!d)h+=`<p class="mu">Crea il tuo primo personaggio: ogni personaggio ha un aspetto unico, un modo di muoversi, dialoghi a scelte e, se vuoi, un negozio.</p>`;
  else{const T=EDS.npcTab;h+=`<div class="edrow"><input class="edbig" value="${esc(d.n)}" maxlength="40" onchange="EDF.n=this.value;edDirty();edNpcRender()"><span><button onclick="edNpcDup()">⧉ Duplica</button><button class="danger" onclick="edNpcDel()">🗑</button></span></div>
    <div class="edtabs">${[['look','🎨 Aspetto'],['dlg','💬 Dialogo'],['role','🛒 Mestiere e negozio'],['where','📍 Dove si trova']].map(([k,n])=>`<button class="${T===k?'on':''}" onclick="EDS.npcTab='${k}';edNpcRender()">${n}</button>`).join('')}</div>`;
    if(T==='look')h+=edNpcLookHTML(d);else if(T==='dlg')h+=edNpcDlgHTML(d);else if(T==='role')h+=edNpcRoleHTML(d);else h+=edNpcWhereHTML(d)}
  edWinSet(h+'</div></div>');if(d&&EDS.npcTab==='look')edPvStart(d)}
function edNpcLookHTML(d){const L=d.look,sel=(k,opts,v)=>`<select onchange="EDF.look.${k}=this.value;edNpcChg()">${edOpt(opts,v)}</select>`,colr=(k,v)=>`<input type="color" value="${hx6(v||'#555555')}" onchange="EDF.look.${k}=this.value;edNpcChg()">`;
  const xsOn=k=>L.xs.some(x=>(typeof x==='string'?x:x.k)===k),xsCol=k=>{const x=L.xs.find(q=>typeof q==='object'&&q.k===k);return x?x.c:''};
  let h=`<div class="edlook"><div class="edpv"><canvas id="edpvc" width="180" height="210"></canvas><div class="seg"><button onclick="EDPV.fc=(EDPV.fc+7)%8">⟲</button><button onclick="EDPV.fc=(EDPV.fc+1)%8">⟳</button><button onclick="EDF.look=edRandLook();edNpcChg(1)">🎲 A caso</button></div>
    <label class="edl">Parti da un personaggio del gioco<select onchange="if(this.value){EDF.look=edLookFromGame(this.value);edNpcChg(1)}"><option value="">(scegli)</option>${Object.keys(NPS).filter(k=>!k.startsWith('edn_')&&NPCS[k]&&NPCS[k].n).sort((a,b)=>NPCS[a].n.localeCompare(NPCS[b].n)).map(k=>`<option value="${k}">${esc(NPCS[k].n)}</option>`).join('')}</select></label>
    <label class="edl">Titolo (sotto il nome)<input value="${esc(d.title||'')}" placeholder="per esempio Il fornaio" onchange="EDF.title=this.value;edDirty()"></label>
    <label class="edl">Oppure un animale<select onchange="EDF.animal=this.value;edNpcChg(1)">${edOpt(EANIMAL,d.animal||'')}</select></label></div><div class="edlf">`;
  h+=`<div class="edrow"><span>Pelle</span><span>${ESKIN.map(([k,c])=>`<button class="sw${L.sk===k?' on':''}" style="background:${c}" onclick="EDF.look.sk='${k}';edNpcChg(1)"></button>`).join('')}</span></div>`;
  h+=`<div class="edrow"><span>Corporatura</span><span class="edchk">${EBODY.map(([k,n])=>`<label><input type="checkbox" ${L.body.includes(k)?'checked':''} onchange="edBody('${k}',this.checked)"> ${n}</label>`).join('')}</span></div>`;
  h+=`<div class="edrow"><span>Vestito</span>${colr('c',L.c)}</div><div class="edrow"><span>Capelli</span><span>${sel('hair',EHAIR,L.hair)} ${colr('hc',L.hc)}</span></div><div class="edrow"><span>Barba</span><span>${sel('beard',EBEARD,L.beard)} ${colr('bc',L.bc||L.hc)}</span></div>`;
  h+=`<div class="edrow"><span>Cappello</span><span>${sel('hat',EHAT,L.hat)} ${colr('h1',L.h1)} ${colr('h2',L.h2||'#ffffff')}</span></div><div class="edrow"><span>In mano</span>${sel('prop',EPROP,L.prop)}</div><div class="edrow"><span>Come si muove</span>${sel('an',EANIM,L.an)}</div>`;
  h+=`<h5>Aggiunte</h5><div class="edxs">${EXS.map(([k,n,c])=>`<label><input type="checkbox" ${xsOn(k)?'checked':''} onchange="edXs('${k}',this.checked)"> ${n}${c&&xsOn(k)?` <input type="color" value="${hx6(xsCol(k)||'#c0392b')}" onchange="edXsC('${k}',this.value)">`:''}</label>`).join('')}</div>`;
  return h+'</div></div>'}
function edBody(k,on){const b=EDF.look.body.filter(q=>q!==k&&q!=='n');if(on)b.push(k);EDF.look.body=b.length?b:['n'];edNpcChg(1)}
function edXs(k,on){const L=EDF.look.xs.filter(x=>(typeof x==='string'?x:x.k)!==k);if(on)L.push(k);EDF.look.xs=L;edNpcChg(1)}
function edXsC(k,c){EDF.look.xs=EDF.look.xs.map(x=>(typeof x==='string'?x:x.k)===k?{k,c}:x);edNpcChg()}
function edNpcChg(full){edRegNpc(EDF);edDirty();EDPV.m=null;if(full)edNpcRender()}
function edPvStart(d){cancelAnimationFrame(EDPV.raf);EDPV.m=null;const loop=n=>{const c=$('edpvc');if(!c||!EW.npcs[d.id]||EDS.npcTab!=='look'){EDPV.raf=0;return}EDPV.raf=requestAnimationFrame(loop);
    if(!EDPV.m){try{const e=edMakeNpc(EW.npcs[d.id],0,0);EDPV.m=e.m;EDPV.e={px:0,py:0,m:e.m,nph:0,path:[]}}catch(err){return}}
    const q=c.getContext('2d'),dp=Math.min(2,devicePixelRatio||1),w=180,h=210;if(c.width!==w*dp){c.width=w*dp;c.height=h*dp}q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,c.width,c.height);
    const og=g;g=q;try{q.setTransform(3.3*dp,0,0,3.3*dp,w/2*dp,(h-22)*dp);box(-.6,-.6,-4,1.2,1.2,4,'#3a4870');let L=EDPV.m;if(L.rg&&L.g)L=npcPose(L,EDPV.e);if(L.rg||L.hm)drawHero(L,0,0,0,0,EDPV.fc);else drawL(L,0,0,0)}catch(err){}finally{g=og}};EDPV.raf=requestAnimationFrame(loop)}
function edNpcDup(){const d=edClone(EW.npcs[EDS.npcW]);d.id=edUid('n');d.n+=' (copia)';EW.npcs[d.id]=d;edRegNpc(d);EDS.npcW=d.id;edDirty();edNpcRender()}
function edNpcDel(){const d=EW.npcs[EDS.npcW];if(!d)return;const n=Object.values(EW.maps).reduce((a,m)=>a+m.e.filter(e=>e.k==='npc'&&e.npc===d.id).length,0);
  if(!confirm('Eliminare «'+d.n+'»?'+(n?' È nella mappa '+n+' volte: verrà tolto anche da lì.':'')))return;for(const m of Object.values(EW.maps))m.e=m.e.filter(e=>!(e.k==='npc'&&e.npc===d.id));delete EW.npcs[d.id];EDS.npcW='';if(EDS.npc===d.id)EDS.npc='';edDirty();edNpcRender()}
// dialogo: nodi con una battuta e le risposte del giocatore; ogni risposta può avere condizioni, azioni e il nodo successivo
function edNpcDlgHTML(d){const D=d.dlg,ks=Object.keys(D.nodes);let h=`<p class="mu">Il dialogo comincia dal nodo iniziale. Ogni risposta può portare a un altro nodo o chiudere il dialogo, e può dare oggetti, avviare missioni, cambiare variabili... Le missioni che questo personaggio affida e quelle da consegnargli compaiono da sole.</p>
  <div class="edrow"><span>Nodo iniziale</span><select onchange="EDF.dlg.start=this.value;edDirty()">${edOpt(ks.map(k=>[k,k+': '+(D.nodes[k].tx||'').slice(0,40)]),D.start)}</select></div>`;
  ks.forEach(k=>{const nd=D.nodes[k],P2=/^[a-z]\w*$/i.test(k)?`EDF.dlg.nodes.${k}`:`EDF.dlg.nodes[${JSON.stringify(k).replace(/"/g,'&quot;')}]`;h+=`<div class="ednode"><div class="edrow"><b>Nodo ${esc(k)}</b><span>${k!==D.start?`<button class="danger" onclick="edNodeDel('${k}')">🗑</button>`:'<span class="edtag">iniziale</span>'}</span></div>
    <textarea rows="2" placeholder="Che cosa dice il personaggio" onchange="${P2}.tx=this.value;edDirty()">${esc(nd.tx)}</textarea><div class="edrow"><span class="mu">Solo se (altrimenti salta al nodo)</span><span>${edCondHTML(nd.cond,P2+'.cond')}<select onchange="${P2}.alt=this.value;edDirty()">${edOpt([['','(nessuno)'],...ks.map(q=>[q,q])],nd.alt||'')}</select></span></div>`;
    nd.opts.forEach((o,i)=>{const OP=P2+'.opts['+i+']';h+=`<div class="edopt"><div class="edrow"><span class="edn">${i+1}</span><input value="${esc(o.tx)}" placeholder="Risposta del giocatore" onchange="${OP}.tx=this.value;edDirty()"><span>→ <select onchange="if(this.value==='+'){${OP}.go=edNodeNew()}else ${OP}.go=this.value;edDirty();edNpcRender()">${edOpt([['','(fine del dialogo)'],...ks.map(q=>[q,'nodo '+q]),['+','＋ nuovo nodo']],o.go||'')}</select></span><button onclick="edLDel('${P2}.opts',${i})">✕</button></div>
      <details${(o.cond.length||o.acts.length)?' open':''}><summary>Condizioni e azioni (${o.cond.length}/${o.acts.length})</summary><h6>Si vede solo se</h6>${edCondHTML(o.cond,OP+'.cond')}<h6>Scegliendola</h6>${edActHTML(o.acts,OP+'.acts')}</details></div>`});
    h+=`<button class="edadd" onclick="edLAdd('${P2}.opts',{tx:'...',go:'',cond:[],acts:[]})">＋ risposta</button></div>`});
  h+=`<button onclick="edNodeNew();edNpcRender()">＋ Nuovo nodo</button><h5>Frasi a caso</h5><p class="mu">Se scrivi delle frasi qui, ogni tanto il personaggio ne dice una invece della battuta del nodo iniziale (una per riga).</p><textarea rows="3" onchange="EDF.lines=this.value.split('\\n').map(s=>s.trim()).filter(Boolean);edDirty()">${esc(d.lines.join('\n'))}</textarea>`;return h}
function edNodeNew(){const D=EDF.dlg;let k='a';const used=new Set(Object.keys(D.nodes));for(let i=0;i<200;i++){k=i<26?String.fromCharCode(97+i):'n'+i;if(!used.has(k))break}D.nodes[k]={tx:'',opts:[]};edDirty();return k}
function edNodeDel(k){const D=EDF.dlg;if(k===D.start)return;delete D.nodes[k];for(const nd of Object.values(D.nodes)){for(const o of nd.opts)if(o.go===k)o.go='';if(nd.alt===k)nd.alt=''}edDirty();edNpcRender()}
function edNpcRoleHTML(d){let h=`<div class="edrow"><span>Mestiere</span><select onchange="EDF.role=this.value;edRegNpc(EDF);edDirty();edNpcRender()">${edOpt(Object.entries(EDROLE).map(([k,v])=>[k,v||'(nessuno)']),d.role)}</select></div>`;
  const R={shop:'Vende gli oggetti della lista qui sotto e compra quelli del giocatore.',smith:'Apre la fucina del gioco: forgia su misura e potenziamenti.',alch:'Vende pozioni ed elisir.',heal:'Cura completamente, gratis.',inn:'Fa riposare per 10 monete.',bard:'Canta una canzone.',casino:'Apre i giochi del casinò.',fisher:'Vende la canna da pesca.',buyfish:'Compra i pesci pescati.',buyres:'Compra i raccolti (grano, legna, mele, uova...).'};
  if(d.role)h+=`<p class="mu">${R[d.role]||''}</p>`;
  if(d.role==='shop'){h+=`<h5>Merce</h5><div class="edcl">`;d.shop.forEach((s,i)=>{h+=`<div class="edcr">${edF('EDF.shop',i,'item',s.item,'s',edItemsL())} prezzo ${edF('EDF.shop',i,'p',s.p==null?'':s.p,'n')} <small class="mu">vuoto = quello dell'oggetto</small> scorta ${edF('EDF.shop',i,'q',s.q==null?0:s.q,'n')}<small class="mu">0 = infinita</small><button onclick="edLDel('EDF.shop',${i})">✕</button></div>`});
    h+=`<button class="edadd" onclick="edLAdd('EDF.shop',{item:'${Object.keys(EW.items)[0]||''}',q:0})">＋ merce</button></div><div class="edrow"><label><input type="checkbox" ${d.buys!==0?'checked':''} onchange="EDF.buys=this.checked?1:0;edDirty()"> Compra anche gli oggetti del giocatore (a metà prezzo)</label></div><div class="edrow"><label><input type="checkbox" ${d.pots?'checked':''} onchange="EDF.pots=this.checked?1:0;edDirty()"> Vende anche le pozioni (25 oro)</label></div>`}
  return h}
function edNpcWhereHTML(d){let h='<div class="edcl">',n=0;for(const m of Object.values(EW.maps))for(const e of m.e)if(e.k==='npc'&&e.npc===d.id){n++;h+=`<div class="edcr">📍 <b>${esc(m.n)}</b> (${e.x}, ${e.y}) · ${e.beh||'fermo'} <button onclick="edWinClose();edGoMap('${m.id}');EDS.cam.x=${e.x}+.5;EDS.cam.y=${e.y}+.5;edSelect('e',EW.maps['${m.id}'].e.find(q=>q.u==='${e.u}'))">Vai</button></div>`}
  const qs=Object.values(EW.quests).filter(q=>q.giver===d.id||q.turn===d.id);
  return(n?h:h+'<p class="mu">Non è in nessuna mappa: scegli 🧑 Personaggi nella barra degli strumenti e clicca sulla mappa.</p>')+'</div>'+(qs.length?'<h5>Missioni</h5>'+qs.map(q=>`<div class="edcr">📜 ${esc(q.ti)} ${q.giver===d.id?'(la affida)':''}${q.turn===d.id?'(la riceve)':''}</div>`).join(''):'')}

/* ---- missioni ---- */
const ESTEP={kill:'Sconfiggi nemici',collect:'Raccogli oggetti',talk:'Parla con qualcuno',deliver:'Consegna oggetti a qualcuno',reach:'Raggiungi un luogo',zone:'Entra in una zona evento',var:'Una variabile raggiunge un valore',gems:'Raccogli gemme',boss:'Sconfiggi un nemico preciso'};
function edQuestWin(id){EDS.qW=id&&EW.quests[id]?id:EDS.qW&&EW.quests[EDS.qW]?EDS.qW:Object.keys(EW.quests)[0]||'';EDWR=edQuestRender;EDRR=edQuestRender;edWin('📜 Missioni','','wide');edQuestRender()}
function edQuestNew(){const d=edFixQuest({id:edUid('q'),ti:'Nuova missione',tx:'',giver:Object.keys(EW.npcs)[0]||'',steps:[{k:'kill',t:'slime',n:5}],rew:{g:50,x:40,items:[],acts:[]}});EW.quests[d.id]=d;EDS.qW=d.id;edDirty();edQuestRender()}
function edQuestRender(){const L=Object.values(EW.quests),d=EW.quests[EDS.qW];EDF=d||{};let h=`<div class="edsplit"><div class="edcol"><button onclick="edQuestNew()">＋ Nuova</button><div class="edlist">`;
  for(const q of L)h+=`<button class="edli${q.id===EDS.qW?' on':''}" onclick="EDS.qW='${q.id}';edQuestRender()"><span class="edic">📜</span><span><b>${esc(q.ti)}</b><small>${esc((EW.npcs[q.giver]||{}).n||'avviata da un\'azione')}</small></span></button>`;
  h+=`</div></div><div class="edmain edscr">`;
  if(!d)h+='<p class="mu">Una missione ha un personaggio che la affida, dei passi da compiere (sconfiggere nemici, raccogliere oggetti, parlare con qualcuno, raggiungere un luogo...) e una ricompensa.</p>';
  else{h+=`<div class="edrow"><input class="edbig" value="${esc(d.ti)}" maxlength="60" onchange="EDF.ti=this.value;edDirty();edQuestRender()"><span><button class="danger" onclick="if(confirm('Eliminare la missione?')){delete EW.quests[EDS.qW];EDS.qW='';edDirty();edQuestRender()}">🗑</button></span></div>
    <textarea rows="3" placeholder="La richiesta, come la racconta chi la affida" onchange="EDF.tx=this.value;edDirty()">${esc(d.tx)}</textarea>
    <div class="edform"><label>La affida<select onchange="EDF.giver=this.value;edDirty()">${edOpt(edNpcsL('(nessuno: la avvia un\'azione)'),d.giver||'')}</select></label><label>Si consegna a<select onchange="EDF.turn=this.value;edDirty()">${edOpt([['','chi la affida'],['@auto','nessuno: si completa da sola'],...Object.values(EW.npcs).map(q=>[q.id,q.n])],d.turn||'')}</select></label>
    <label>Livello minimo<input type="number" min="0" max="60" value="${d.lv|0}" onchange="EDF.lv=+this.value|0;edDirty()"></label><label><span><input type="checkbox" ${d.rep?'checked':''} onchange="EDF.rep=this.checked?1:0;edDirty()"> Si può ripetere</span></label></div>
    <h5>Disponibile solo se</h5>${edCondHTML(d.req,'EDF.req')}<h5>Passi (in ordine)</h5><div class="edcl">`;
    d.steps.forEach((s,i)=>{h+=`<div class="edcr"><span class="edn">${i+1}</span><select onchange="edCSet('EDF.steps',${i},'k',this.value,1)">${edOpt(Object.entries(ESTEP),s.k)}</select>${edStepFields(s,i)}<input class="edsm" value="${esc(s.tx||'')}" placeholder="testo nel diario (facoltativo)" onchange="EDF.steps[${i}].tx=this.value;edDirty()"><span class="edmv"><button onclick="edLMove('EDF.steps',${i},-1)">▲</button><button onclick="edLMove('EDF.steps',${i},1)">▼</button><button onclick="edLDel('EDF.steps',${i})">✕</button></span></div>`});
    h+=`<button class="edadd" onclick="edLAdd('EDF.steps',{k:'kill',t:'slime',n:3})">＋ passo</button></div><h5>Ricompensa</h5><div class="edform"><label>Oro<input type="number" min="0" value="${d.rew.g|0}" onchange="EDF.rew.g=+this.value|0;edDirty()"></label><label>Esperienza<input type="number" min="0" value="${d.rew.x|0}" onchange="EDF.rew.x=+this.value|0;edDirty()"></label></div>
    ${edItemListHTML(d.rew.items,'EDF.rew.items')}<h6>Azioni al completamento</h6>${edActHTML(d.rew.acts,'EDF.rew.acts')}
    <h5>Battute</h5><div class="edform"><label class="wide">Quando la consegni<input value="${esc(d.done||'')}" placeholder="Grazie, eroe!" onchange="EDF.done=this.value;edDirty()"></label><label class="wide">Mentre è in corso<input value="${esc(d.wait||'')}" placeholder="Allora, ci sei riuscito?" onchange="EDF.wait=this.value;edDirty()"></label></div>`}
  edWinSet(h+'</div></div>')}
function edStepFields(s,i){const F=(k,v,t,o,ph)=>edF('EDF.steps',i,k,v,t,o,ph);switch(s.k){
  case 'kill':return F('t',s.t||'*','s',[['*','qualsiasi nemico'],...edEnemyList().map(k=>[k,E[k].n])])+'×'+F('n',s.n||1,'n')+F('map',s.map||'','s',[['','in qualsiasi mappa'],...edMapsL()]);
  case 'collect':return F('item',s.item,'s',edItemsL())+'×'+F('n',s.n||1,'n')+'<small class="mu">li trova a terra, nei forzieri o dai nemici</small>';
  case 'talk':return F('npc',s.npc,'s',edNpcsL());case 'deliver':return F('npc',s.npc,'s',edNpcsL())+F('item',s.item,'s',edItemsL())+'×'+F('n',s.n||1,'n');
  case 'reach':return F('map',s.map||'','s',[['','(scegli)'],...edMapsL()])+'x'+F('x',s.x|0,'n')+'y'+F('y',s.y|0,'n')+'raggio'+F('r',s.r||2,'n');
  case 'zone':return F('map',s.map||'','s',[['','(scegli)'],...edMapsL()])+F('z',s.z||'','s',[['','(scegli la zona)'],...(EW.maps[s.map]?EW.maps[s.map].e.filter(e=>e.k==='trig').map(e=>[e.u,e.n||'zona']):[])]);
  case 'var':return F('v',s.v,'s',edVarsL())+F('op',s.op||'>=','s',[['>=','≥'],['==','='],['<=','≤']])+F('n',s.n|0,'n');
  case 'gems':return F('n',s.n||1,'n');case 'boss':return F('map',s.map||'','s',[['','(scegli)'],...edMapsL()])+F('u',s.u||'','s',[['','(scegli il nemico)'],...(EW.maps[s.map]?EW.maps[s.map].e.filter(e=>e.k==='en').map(e=>[e.u,(e.n||E[e.t].n)+' ('+e.x+','+e.y+')']):[])])}return''}

/* ---- oggetti ---- */
const EBASE={w:['Spada','Pugnale','Stocco','Ascia','Martello','Lancia','Tridente','Bastone','Falce'],h:['Elmo','Cappuccio','Corona','Maschera'],c:['Corazza','Cotta di maglia','Tunica'],s:['Scudo','Brocchiere']};
const EFX=[['','Nessuno'],['fuoco','🔥 Fuoco: brucia per qualche secondo'],['gelo','❄ Gelo: rallenta'],['vampiro','🩸 Vampiro: cura chi colpisce'],['fulmine','⚡ Fulmine: salta a un nemico vicino'],['veleno','☠ Veleno: danno lento ma lungo'],['spinta','💨 Spinta: allontana i nemici']];
function edItemWin(id){EDS.iW=id&&EW.items[id]?id:EDS.iW&&EW.items[EDS.iW]?EDS.iW:Object.keys(EW.items)[0]||'';EDWR=edItemRender;EDRR=edItemRender;edWin('⚔ Oggetti','','wide');edItemRender()}
function edItemNew(k){const d=edFixItem({id:edUid('i'),n:k==='w'?'Spada nuova':k==='key'?'Chiave':k==='pot'?'Pozione':'Oggetto',k:k||'w',base:k==='w'?'Spada':'',r:k==='w'?1:0,v:k==='w'?12:k==='h'||k==='s'?6:k==='c'?9:0,price:30,heal:k==='pot'?40:0});EW.items[d.id]=d;EDS.iW=d.id;EDS.itemSel=d.id;edDirty();edItemRender()}
function edItemIconURL(d){if('whcs'.includes(d.k))return icon({s:d.k,r:d.r|0,n:d.base||d.n});return edThumb('it'+d.k+(d.col||''),()=>{const L=edItemModel(d.id);drawL(L.map(b=>[b[0],b[1],Math.max(0,b[2]-8),b[3]*1.6,b[4]*1.6,b[5]*1.4,b[6]]),.5,.5,0)},48,48,1.6,0)}
function edItemRender(){const L=Object.values(EW.items),d=EW.items[EDS.iW];EDF=d||{};let h=`<div class="edsplit"><div class="edcol"><span class="seg"><button title="Nuova arma" onclick="edItemNew('w')">＋⚔</button><button title="Nuova armatura" onclick="edItemNew('c')">＋🛡</button><button title="Nuova pozione" onclick="edItemNew('pot')">＋🧪</button><button title="Nuova chiave" onclick="edItemNew('key')">＋🔑</button><button title="Nuovo oggetto" onclick="edItemNew('quest')">＋📦</button></span><div class="edlist">`;
  for(const q of L)h+=`<button class="edli${q.id===EDS.iW?' on':''}" onclick="EDS.iW='${q.id}';edItemRender()"><img src="${edItemIconURL(q)}" alt=""><span><b style="color:${'whcs'.includes(q.k)?RC[q.r|0]:'inherit'}">${esc(q.n)}</b><small>${'whcs'.includes(q.k)?SN[q.k]+' · '+RN[q.r|0]:EITK[q.k]}</small></span></button>`;
  h+=`</div></div><div class="edmain edscr">`;
  if(!d)h+='<p class="mu">Armi con effetti speciali, armature, pozioni, chiavi per le porte, oggetti da raccogliere per le missioni, lettere da leggere...</p>';
  else{const gear='whcs'.includes(d.k);h+=`<div class="edrow"><input class="edbig" value="${esc(d.n)}" maxlength="40" onchange="EDF.n=this.value;edDirty();edItemRender()"><span><img class="edicn" src="${edItemIconURL(d)}" alt=""><button class="danger" onclick="edItemDel()">🗑</button></span></div>
    <div class="edform"><label>Tipo<select onchange="EDF.k=this.value;if('whcs'.includes(this.value))EDF.base=EBASE[this.value][0];edDirty();edItemRender()">${edOpt([['w','⚔ Arma'],['h','⛑ Elmo'],['c','🛡 Corazza'],['s','🛡 Scudo'],...Object.entries(EITK)],d.k)}</select></label>`;
    if(gear){h+=`<label>Forma<select onchange="EDF.base=this.value;edDirty();edItemRender()">${edOpt(EBASE[d.k].map(b=>[b,b]),d.base)}</select></label><label>Rarità<select onchange="EDF.r=+this.value;edDirty();edItemRender()">${edOpt(RN.map((n,i)=>[i,n]),d.r|0)}</select></label>
      <label>${d.k==='w'?'Attacco':'Difesa'}<input type="number" min="0" max="999" value="${d.v|0}" onchange="EDF.v=Math.max(0,+this.value|0);edDirty()"></label><label>Critico +%<input type="number" min="0" max="100" value="${d.cr|0}" onchange="EDF.cr=clamp(+this.value|0,0,100);edDirty()"></label><label>Vita +<input type="number" min="0" max="9999" value="${d.hp|0}" onchange="EDF.hp=Math.max(0,+this.value|0);edDirty()"></label>`;
      if(d.k==='w')h+=`<label class="wide">Effetto speciale<select onchange="EDF.fx=this.value;edDirty()">${edOpt(EFX,d.fx||'')}</select></label><label>Forza dell'effetto<input type="range" min="1" max="5" value="${d.fxv||2}" onchange="EDF.fxv=+this.value;edDirty()"></label>`}
    else{if(d.k==='pot'||d.k==='food')h+=`<label>Cura (PV)<input type="number" min="0" max="9999" value="${d.heal|0}" onchange="EDF.heal=Math.max(0,+this.value|0);edDirty()"></label><label>Effetto<select onchange="EDF.buff=this.value;edDirty()">${edOpt([['','nessuno'],['forza','💪 Forza +25% (90 s)'],['pietra','🪨 Difesa +25% (90 s)'],['veloce','💨 Velocità (60 s)']],d.buff||'')}</select></label>`;
      h+=`<label>Colore<input type="color" value="${d.col||'#c88aff'}" onchange="EDF.col=this.value;edDirty();edItemRender()"></label>`}
    h+=`<label>Prezzo<input type="number" min="0" max="999999" value="${d.price|0}" onchange="EDF.price=Math.max(0,+this.value|0);edDirty()"></label></div><label class="edl">Descrizione<textarea rows="2" onchange="EDF.desc=this.value;edDirty()">${esc(d.desc||'')}</textarea></label>`;
    if(d.k==='note')h+=`<label class="edl">Testo (si legge usandolo)<textarea rows="5" onchange="EDF.txt=this.value;edDirty()">${esc(d.txt||'')}</textarea></label>`;
    if(!gear)h+=`<div class="edrow"><label><input type="checkbox" ${d.keep?'checked':''} onchange="EDF.keep=this.checked?1:0;edDirty()"> Non si consuma usandolo</label></div><h6>Quando si usa</h6>${edActHTML(d.use,'EDF.use')}`;
    h+=`<p class="mu">${gear?'Si trova nello zaino e si equipaggia. ':'Finisce negli «Oggetti» dello zaino. '}Mettilo nelle mappe (🎁 Oggetti → Oggetto a terra), nei forzieri, come bottino dei nemici, nei negozi o come ricompensa.</p>`}
  edWinSet(h+'</div></div>')}
function edItemDel(){const d=EW.items[EDS.iW];if(!d||!confirm('Eliminare «'+d.n+'»?'))return;delete EW.items[d.id];for(const m of Object.values(EW.maps))m.e=m.e.filter(e=>!(e.k==='it'&&e.item===d.id));EDS.iW='';edDirty();edItemRender()}

/* ---- variabili ---- */
function edVarWin(){EDWR=edVarWin;EDRR=edVarWin;let h=`<p class="mu">Le variabili sono numeri che il mondo ricorda: «porta_aperta» = 1, «mele_consegnate» = 3, «reputazione» = 10... Si cambiano con le azioni e si controllano con le condizioni (dialoghi, zone evento, personaggi che compaiono, passaggi chiusi).</p><div class="edcl">`;
  for(const v of Object.values(EW.vars)){const used=JSON.stringify(EW).split('"'+v.id+'"').length-2;h+=`<div class="edcr"><input class="edsm" value="${esc(v.n)}" onchange="EW.vars['${v.id}'].n=this.value.replace(/[^\\wàèéìòù]/g,'_').slice(0,30);edDirty();edVarWin()"> inizia da <input type="number" value="${v.v|0}" onchange="EW.vars['${v.id}'].v=+this.value|0;edDirty()"><input value="${esc(v.desc||'')}" placeholder="a cosa serve" onchange="EW.vars['${v.id}'].desc=this.value;edDirty()"><small class="mu">usata ${used} volte</small><button onclick="if(confirm('Eliminare la variabile?')){delete EW.vars['${v.id}'];edDirty();edVarWin()}">✕</button></div>`}
  h+=`</div><button onclick="const id=edUid('v');EW.vars[id]={id,n:'variabile_'+(Object.keys(EW.vars).length+1),v:0,desc:''};edDirty();edVarWin()">＋ Nuova variabile</button>`;
  if($('edwin').hidden||!$('edwc'))edWin('🔣 Variabili',h);else edWinSet(h)}

/* ---- guida ---- */
function edHelp(){edWin('❓ Guida di Voxelia Studio',`<div class="edhelp"><h5>Per cominciare</h5><ol><li>Dipingi il terreno (🟩), alza i muri (🧱), metti acqua (🌊) e decorazioni (🌳). Gli edifici (🏠) si disegnano trascinando.</li><li>Crea i personaggi (🧑 Personaggi in alto): aspetto, dialoghi, mestiere. Poi mettili nella mappa con lo strumento 🧑.</li>
  <li>Aggiungi nemici (👹), forzieri e oggetti (🎁), porte verso altre mappe (🚪) e zone evento (⚡).</li><li>Scrivi le missioni (📜), le musiche (🎵), le cinematiche (🎬).</li><li>Premi <b>▶ Prova</b>: giochi subito il tuo mondo. «Torna all'editor» ti riporta qui.</li></ol>
  <h5>Mouse e tastiera</h5><ul><li>Clic sinistro: usa lo strumento · tasto destro o centrale trascinando: sposta la vista · rotella: zoom · frecce: muovi la vista</li><li>Ctrl+Z annulla · Ctrl+Y rifai · Ctrl+S salva · Ctrl+D duplica · Canc elimina · [ ] pennello più piccolo o più grande · Spazio + trascina: sposta la vista</li>
  <li>Strumenti: V seleziona · R area · H mano · B terreno · M muri · A acqua · X vuoto · D decorazioni · E edifici · N personaggi · K nemici · O oggetti · P porte · T zone evento · S partenza · U timbri · G gomma · I contagocce</li>
  <li>Area: Ctrl+C copia · Ctrl+X taglia · Ctrl+V incolla (anche in un'altra mappa) · Ctrl+A tutta la mappa · Canc svuota · trascina dentro la selezione per spostarla · mentre incolli R ruota e F specchia</li>
  <li>Maiusc+frecce sposta di una casella l'oggetto selezionato · 0 mostra tutta la mappa · Tab nasconde i pannelli · Maiusc+clic su più arredi o terreni li mescola nel pennello</li><li>Sul telefono: un dito usa lo strumento, due dita spostano e ingrandiscono la vista.</li></ul>
  <h5>Pubblicare</h5><ul><li>Con <b>🌐 Pubblica</b> in alto il mondo finisce nel browser dei mondi del server: chi gioca lì lo trova, lo gioca, gli dà le stelle e lo commenta.</li><li>Scegli titolo, descrizione e generi, poi le anteprime: <b>📷 Inquadra e scatta</b> (senza griglia né aiuti), immagini dal computer, un <b>🎬 video</b> fino a 20 secondi registrato muovendo la vista oppure con il <b>🎥 giro automatico</b>. Anche durante ▶ Prova puoi premere ⏺ Video o 📷 Foto.</li><li>Quando cambi il mondo, torna su 🌐 Pubblica e premi «Aggiorna il mondo e l'anteprima». Serve il gioco aperto dal server (node server.js).</li></ul>
  <h5>Idee</h5><ul><li>Una porta chiusa a chiave: crea una Chiave in ⚔ Oggetti, mettila in un forziere e scegli «Chiuso a chiave» nella porta.</li><li>Un ponte che compare: una zona evento con l'azione «Cambia una casella» (acqua → terreno).</li>
  <li>Un personaggio che appare solo dopo una missione: nella sua posizione, «Compare solo se» → Missione completata.</li><li>Una scelta che cambia il finale: una variabile cambiata dal dialogo e controllata dall'ultima zona evento.</li>
  <li>Un villaggio in un attimo: strumento Timbri (U) → «Piazza con fontana», «Mercato», «Orto recintato»... e poi ritocca a mano. I pezzi che costruisci tu si salvano come timbri con lo strumento Area.</li>
  <li>Cambiare tutte le querce in abeti: Seleziona (V) una quercia sulla mappa → «Sostituisci in tutta la mappa».</li></ul></div>`)}

/* ---- controllo del mondo: tutto quello che potrebbe non funzionare giocando ---- */
function edCheck(){const L=[],add=(lv,tx,m,x,y,u)=>L.push({lv,tx,m:m?m.id:'',x,y,u}),nm=m=>'«'+m.n+'»';
  const itemsSeen=new Set(),npcPlaced=new Set(),enTypes=new Set(),refs=[];
  const scan=(L2,where,m,x,y)=>{if(!Array.isArray(L2))return;for(const a of L2){if(!a)continue;refs.push({a,where,m,x,y});if((a.a==='give'))itemsSeen.add(a.item);if(a.a==='spawn')enTypes.add(a.t)}};
  for(const m of Object.values(EW.maps)){const n=m.N,I=(x,y)=>y*n+x,inB=(x,y)=>x>=0&&y>=0&&x<n&&y<n,bl=new Uint8Array(n*n);
    for(let i=0;i<n*n;i++){const t0=m.t[i];if(t0!==0)bl[i]=1;else if(m.d[i]&&!m.dw[i]&&!edDecWalk(m.d[i])&&!(EDECI[m.d[i]]&&EDECI[m.d[i]].water))bl[i]=1}
    for(const b of m.b){for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(inB(x,y))bl[I(x,y)]=1;if(b.door&&inB(b.dx,b.y+b.h))bl[I(b.dx,b.y+b.h)]=0;
      if(b.door&&b.to&&!EW.maps[b.to])add('err','La porta di un edificio porta a una mappa che non esiste più',m,b.dx,b.y+b.h);if(b.door&&!b.to)add('info','L\'edificio '+(b.n?'«'+b.n+'» ':'')+'ha una porta che non porta da nessuna parte',m,b.dx,b.y+b.h)}
    // da dove si entra nella mappa: arrivo, inizio, passaggi, porte
    const ent0=[m.sp];if(EW.start.map===m.id)ent0.push([EW.start.x,EW.start.y]);for(const e of m.e)if(e.k==='po')ent0.push([e.x,e.y]);for(const b of m.b)if(b.door)ent0.push([b.dx,b.y+b.h]);
    for(const[x,y]of[m.sp].concat(EW.start.map===m.id?[[EW.start.x,EW.start.y]]:[]))if(!inB(x,y)||bl[I(x,y)])add('err',(EW.start.map===m.id&&x===EW.start.x&&y===EW.start.y?'L\'inizio dell\'avventura':'Il punto d\'arrivo')+' è su una casella bloccata',m,x,y);
    const R2=new Uint8Array(n*n),q=[];for(const[x,y]of ent0){if(!inB(x,y))continue;for(const[a,b]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const u=x+a,v=y+b;if(inB(u,v)&&!bl[I(u,v)]&&!R2[I(u,v)]){R2[I(u,v)]=1;q.push(I(u,v))}}}
    for(let k=0;k<q.length;k++){const c=q[k],x=c%n,y=c/n|0;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const u=x+a,v=y+b;if(!inB(u,v)||bl[I(u,v)]||R2[I(u,v)])continue;if(a&&b&&(bl[I(u,y)]||bl[I(x,v)]))continue;R2[I(u,v)]=1;q.push(I(u,v))}}
    const near=(x,y)=>[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].some(([a,b])=>inB(x+a,y+b)&&R2[I(x+a,y+b)]);
    const NM={npc:'Il personaggio',en:'Il nemico',ch:'Il forziere',it:'L\'oggetto',po:'Il passaggio',sign:'Il cartello',note:'La nota',gem:'La gemma',bed:'Il letto',lever:'La leva',res:'La risorsa'};
    for(const e of m.e){const lab=(NM[e.k]||'')+(e.k==='npc'&&EW.npcs[e.npc]?' '+EW.npcs[e.npc].n:e.k==='en'&&E[e.t]?' '+(e.n||E[e.t].n):'');
      if(e.k==='npc'){if(!EW.npcs[e.npc])add('err','Qui c\'era un personaggio che è stato eliminato',m,e.x,e.y,e.u);else npcPlaced.add(e.npc)}
      if(e.k==='en'){if(!E[e.t])add('err','Tipo di nemico sconosciuto',m,e.x,e.y,e.u);else enTypes.add(e.t);if(e.drop)itemsSeen.add(e.drop);if(e.drop&&!EW.items[e.drop])add('err',lab+' lascia un oggetto che non esiste più',m,e.x,e.y,e.u)}
      if(e.k==='it'){if(!EW.items[e.item])add('err','Oggetto a terra che non esiste più',m,e.x,e.y,e.u);else itemsSeen.add(e.item)}
      if(e.k==='ch'){for(const r of e.items||[]){itemsSeen.add(r.item);if(!EW.items[r.item])add('err','Il forziere contiene un oggetto che non esiste più',m,e.x,e.y,e.u)}if(e.key&&!EW.items[e.key])add('err','Il forziere chiede una chiave che non esiste più',m,e.x,e.y,e.u)}
      if(e.k==='po'){if(!e.to)add('err','Il passaggio non porta da nessuna parte',m,e.x,e.y,e.u);else if(!EW.maps[e.to])add('err','Il passaggio porta a una mappa che non esiste più',m,e.x,e.y,e.u);
        else if(!(e.tx>=0&&e.ty>=0)&&!EW.maps[e.to].e.some(q=>q.k==='po'&&q.to===m.id)&&!EW.maps[e.to].b.some(b=>b.door&&b.to===m.id))add('info','Da '+nm(EW.maps[e.to])+' non c\'è un passaggio di ritorno verso '+nm(m)+': si arriva nel suo punto d\'arrivo',m,e.x,e.y,e.u);
        if(e.key&&!EW.items[e.key])add('err','Il passaggio chiede una chiave che non esiste più',m,e.x,e.y,e.u)}
      if(['npc','ch','it','sign','note','gem','bed','lever','res','po'].includes(e.k)&&inB(e.x,e.y)){const blk=bl[I(e.x,e.y)];
        if(blk&&e.k==='npc'&&!(EW.npcs[e.npc]&&EW.npcs[e.npc].animal))add('warn',lab+' è sopra un muro, l\'acqua o un arredo (verrà spostato alla casella libera più vicina)',m,e.x,e.y,e.u);
        else if(!near(e.x,e.y))add('warn',lab+' non si può raggiungere dal punto d\'arrivo né dai passaggi',m,e.x,e.y,e.u)}
      scan(e.acts,lab,m,e.x,e.y);scan(e.off,lab,m,e.x,e.y)}
    scan(m.enter,'l\'ingresso in '+nm(m),m,m.sp[0],m.sp[1]);if(m.cine&&!EW.cines[m.cine])add('err','La cinematica della mappa '+nm(m)+' non esiste più',m);
    if(String(m.mus).startsWith('song:')&&!EW.songs[m.mus.slice(5)])add('warn','La musica di '+nm(m)+' non esiste più: si sentirà quella di Aldoria',m)}
  // le mappe che non si raggiungono dall'inizio
  const seen=new Set([EW.start.map]),qq=[EW.start.map],links=id=>{const m=EW.maps[id],o=[];for(const e of m.e)if(e.k==='po'&&e.to)o.push(e.to);for(const b of m.b)if(b.door&&b.to)o.push(b.to);return o};
  for(const r of refs)if(r.a.a==='tp'&&r.a.map&&r.m)(EW.maps[r.m].tpl=EW.maps[r.m].tpl||[]).push(r.a.map);
  while(qq.length){const id=qq.shift();for(const to of links(id).concat(EW.maps[id].tpl||[]))if(EW.maps[to]&&!seen.has(to)){seen.add(to);qq.push(to)}}for(const m of Object.values(EW.maps)){delete m.tpl;if(!seen.has(m.id))add('warn','La mappa '+nm(m)+' non si raggiunge dall\'inizio (nessuna porta o teletrasporto ci porta)',m)}
  // personaggi, negozi, missioni, oggetti
  for(const d of Object.values(EW.npcs)){for(const s of d.shop||[]){itemsSeen.add(s.item);if(!EW.items[s.item])add('err','Il negozio di «'+d.n+'» vende un oggetto che non esiste più')}for(const nd of Object.values(d.dlg.nodes))for(const o of nd.opts){scan(o.acts,'il dialogo di «'+d.n+'»');if(o.go&&!d.dlg.nodes[o.go])add('err','Nel dialogo di «'+d.n+'» una risposta porta a un nodo che non esiste')}}
  for(const s of['w','h','c','s'])if(EW.set.gear[s])itemsSeen.add(EW.set.gear[s]);
  for(const q of Object.values(EW.quests)){scan(q.rew.acts,'la missione «'+q.ti+'»');for(const r of q.rew.items)itemsSeen.add(r.item)}
  for(const q of Object.values(EW.quests)){const T='Missione «'+q.ti+'»: ';if(q.giver&&!EW.npcs[q.giver])add('err',T+'chi la affida non esiste più');else if(q.giver&&!npcPlaced.has(q.giver))add('warn',T+(EW.npcs[q.giver].n)+' non è in nessuna mappa');
    if(!q.giver&&!refs.some(r=>r.a.a==='qstart'&&r.a.q===q.id))add('warn',T+'non ha nessuno che la affida e nessuna azione la avvia');if(!q.steps.length)add('warn',T+'non ha passi');
    if(q.turn&&q.turn!=='@auto'&&!npcPlaced.has(q.turn))add('warn',T+'chi la riceve non è in nessuna mappa');
    q.steps.forEach((s,i)=>{const P2=T+'passo '+(i+1)+': ';if((s.k==='talk'||s.k==='deliver')&&!npcPlaced.has(s.npc))add('warn',P2+'il personaggio non è in nessuna mappa');
      if((s.k==='collect'||s.k==='deliver')&&!EW.items[s.item])add('err',P2+'l\'oggetto non esiste');else if((s.k==='collect'||s.k==='deliver')&&!itemsSeen.has(s.item))add('warn',P2+'«'+EW.items[s.item].n+'» non si trova da nessuna parte (né a terra, né nei forzieri, né nei negozi o nel bottino)');
      if(s.k==='kill'&&s.t&&s.t!=='*'&&!enTypes.has(s.t))add('warn',P2+'nel mondo non c\'è nessun '+((E[s.t]||{}).n||s.t));if((s.k==='reach'||s.k==='zone'||s.k==='boss')&&!EW.maps[s.map])add('err',P2+'la mappa non esiste');
      if(s.k==='zone'&&EW.maps[s.map]&&!EW.maps[s.map].e.some(e=>e.u===s.z))add('err',P2+'la zona evento non esiste più');if(s.k==='boss'&&EW.maps[s.map]&&!EW.maps[s.map].e.some(e=>e.u===s.u))add('err',P2+'il nemico non esiste più')})}
  for(const r of refs){const a=r.a,w='Un\'azione ('+(EACT[a.a]||a.a)+') in '+r.where+': ',M2=r.m?EW.maps[r.m]:null;
    if((a.a==='give'||a.a==='take')&&!EW.items[a.item])add('err',w+'l\'oggetto non esiste',M2,r.x,r.y);if((a.a==='qstart'||a.a==='qstep'||a.a==='qdone')&&!EW.quests[a.q])add('err',w+'la missione non esiste',M2,r.x,r.y);
    if(a.a==='var'&&!EW.vars[a.v])add('err',w+'la variabile non esiste',M2,r.x,r.y);if(a.a==='cine'&&!EW.cines[a.c])add('err',w+'la cinematica non esiste',M2,r.x,r.y);if(a.a==='tp'&&a.map&&!EW.maps[a.map])add('err',w+'la mappa non esiste',M2,r.x,r.y);if(a.a==='spawn'&&!E[a.t])add('err',w+'nemico sconosciuto',M2,r.x,r.y)}
  if(EW.set.intro&&!EW.cines[EW.set.intro])add('err','La cinematica d\'apertura non esiste più');if(EW.set.gems){const g=Object.values(EW.maps).reduce((a,m)=>a+m.e.filter(e=>e.k==='gem').length,0);if(g<EW.set.gems)add('err','Per vincere servono '+EW.set.gems+' gemme, ma nel mondo ce ne sono '+g)}
  return L}
function edCheckWin(){const L=edCheck(),ic={err:'⛔',warn:'⚠',info:'ℹ'},n=k=>L.filter(q=>q.lv===k).length;EDWR=edCheckWin;
  let h=`<p>${L.length?`Trovati <b style="color:#ff8a7a">${n('err')} errori</b>, <b style="color:#ffd84a">${n('warn')} avvisi</b> e ${n('info')} note.`:'<b style="color:#7aff8a">✔ Tutto a posto!</b> Nessun problema trovato.'}</p><p class="mu">Gli errori fanno smettere di funzionare qualcosa; gli avvisi sono cose che forse non volevi; le note sono solo informazioni.</p><div class="edcl">`;
  L.sort((a,b)=>({err:0,warn:1,info:2}[a.lv])-({err:0,warn:1,info:2}[b.lv]));L.forEach((q,i)=>{h+=`<div class="edcr edck ${q.lv}"><span>${ic[q.lv]}</span><span style="flex:1">${esc(q.tx)}${q.m&&EW.maps[q.m]?` <small class="mu">(${esc(EW.maps[q.m].n)}${q.x!=null?' '+q.x+', '+q.y:''})</small>`:''}</span>${q.m&&EW.maps[q.m]?`<button onclick="edCheckGo(${i})">Vai</button>`:''}</div>`});
  EDCK=L;edWin('🩺 Controllo del mondo',h+'</div>')}
let EDCK=[];
function edCheckGo(i){const q=EDCK[i];if(!q)return;edWinClose();if(EM.id!==q.m)edOpenMap(q.m);if(q.x!=null){EDS.cam.x=q.x+.5;EDS.cam.y=q.y+.5}if(q.u){const d=EM.e.find(e=>e.u===q.u);if(d)edSelect(d.k==='trig'?'trig':'e',d)}}

/* ================= 7.5: VOXELIA STUDIO — musiche scritte nota per nota =================
   Un brano ha fino a quattro parti (A, B, C, D) e un ordine (per esempio AABA). Ogni parte ha i suoi accordi (uno per battuta)
   e una melodia scritta sul pentagramma a griglia. Basso, accompagnamento e batteria seguono gli accordi da soli.
   Il brano diventa un brano vero del gioco: suona con gli stessi strumenti, lo stesso riverbero e la stessa batteria. */
const EINS={flute:'Flauto',pluck:'Arpa',brass:'Ottoni',chip:'8-bit',bell:'Campane',reed:'Oboe',str:'Archi',pad:'Tappeto morbido'};
const ESCL={maj:'Maggiore (allegra)',min:'Minore (malinconica)',dor:'Dorica (avventura)',phr:'Frigia (deserto)',hm:'Minore armonica (epica)',lyd:'Lidia (sognante)'};
const EBASS={root:'Una nota per mezza battuta',long:'Note lunghe',pulse:'Pulsante',pulse8:'Ottave',walk:'Camminata',ostinato:'Ostinato',gallop:'Galoppo',waltz:'Valzer',shanty:'Marinaresco'};
const ECOMP={pad:'Tappeto',ens:'Archi',arp:'Arpeggio',bell:'Campanelli',drone:'Bordone',strum:'Chitarra',strum6:'Chitarra (6/8)',waltz:'Valzer',stab:'Colpi di ottoni'};
const EDRUM={none:'Niente',soft:'Leggera',folk:'Popolare',light:'Bosco',tribal:'Tribale',heart:'Battito',rock:'Battaglia',march:'Marcia',timp:'Timpani',shanty:'Marinaresca',waltz:'Valzer',custom:'✏ La mia (sotto)'};
const EDRK=[['k','Cassa'],['s','Rullante'],['h','Charleston'],['o','Piatto aperto'],['r','Maracas'],['t','Tom'],['T','Timpano'],['c','Battimani']];
const ENOTE=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
const ECHN=['I','II','III','IV','V','VI','VII'];
function edNewSong(){return edFixSong({id:edUid('s'),n:'Nuovo brano',bpm:104,root:62,sc:'maj',ld:'flute',echo:1,bs:'pulse',cp:['arp'],dr:'folk',form:'AABA',spb:16,
  parts:{A:{ch:[0,3,4,0],nt:[[0,4,2],[2,4,2],[4,5,2],[6,7,6],[16,7,2],[18,6,2],[20,4,4],[24,2,4],[32,3,4],[36,5,4],[40,4,8],[48,2,4],[52,1,4],[56,0,8]]},B:{ch:[5,3,4,4],nt:[[0,9,6],[6,7,2],[8,5,8],[16,8,6],[22,6,2],[24,4,8],[32,7,4],[36,5,4],[40,3,8],[48,4,4],[52,6,4],[56,4,8]]}},drm:{}})}
// melodia → stringa "grado:durata" del gioco, con le pause
function edNotesM(nt,total){const L=nt.filter(n=>n[0]>=0&&n[0]<total).slice().sort((a,b)=>a[0]-b[0]);let pos=0,s=[];
  for(let i=0;i<L.length;i++){const[st,dg,ln,ac]=L[i];if(st<pos)continue;if(st>pos)s.push('r:'+(st-pos));const nx=i+1<L.length?Math.max(st+1,L[i+1][0]):total,l=Math.max(1,Math.min(ln||1,nx-st,total-st));s.push(dg+(ac>0?'#':ac<0?'b':'')+':'+l);pos=st+l}
  if(pos<total)s.push('r:'+(total-pos));return s.join(' ')||'r:'+total}
function edSongTRK(d){const spb=d.spb===12?12:16,T={sng:1,bpm:d.bpm,root:d.root,sc:d.sc,ld:d.ld,lv:d.ld==='bell'?.07:d.ld==='brass'||d.ld==='chip'?.035:.048,echo:d.echo?1:0,bs:d.bs||'root',cp:(d.cp||[]).join(' '),dr:d.dr||'none',form:d.form||'A',spb,parts:{},bv:.085};
  if(d.dr==='custom'){const k='eds_'+d.id;DRUMS[k]={};for(const[c]of EDRK){const p=(d.drm&&d.drm[c])||'';if(p.includes('x'))DRUMS[k][c]=p.replace(/x/g,c==='k'?'x':c).slice(0,spb).padEnd(spb,'.')}T.dr=k}
  if(spb===12&&T.bs==='root')T.bs='waltz';for(const k in d.parts){const p=d.parts[k];T.parts[k]={ch:p.ch.slice(),m:edNotesM(p.nt,p.ch.length*spb)}}
  for(const c of T.form)if(!T.parts[c])T.parts[c]={ch:[0],m:'r:'+spb};return T}
function edRegSong(d){try{TRK['eds_'+d.id]=edSongTRK(d)}catch(e){console.warn('brano',e)}}
// suona una nota al volo (mentre si scrive)
function edBeep(d,dg,ac){auInit();const ac2=AU.ac;if(!ac2)return;try{auFx();const sc=SCL[d.sc]||SCL.maj,m=d.root+sc[((dg%7)+7)%7]+12*Math.floor(dg/7)+(ac|0);ins(m,ac2.currentTime+.02,.35,d.ld,.06,1)}catch(e){}}
function edNoteName(d,dg){const sc=SCL[d.sc]||SCL.maj,m=d.root+sc[((dg%7)+7)%7]+12*Math.floor(dg/7);return ENOTE[((m%12)+12)%12]+(Math.floor(m/12)-1)}

/* ---- la finestra della musica ---- */
const EDSG={part:'A',len:2,acc:0,cell:16,play:0};
function edSongWin(id){EDS.sW=id&&EW.songs[id]?id:EDS.sW&&EW.songs[EDS.sW]?EDS.sW:Object.keys(EW.songs)[0]||'';EDWR=edSongRender;EDRR=edSongRender;edWin('🎵 Musica','','wide');edSongRender()}
function edSongNew(){const d=edNewSong();EW.songs[d.id]=d;edRegSong(d);EDS.sW=d.id;EDSG.part='A';edDirty();edSongRender()}
function edSongRender(){const L=Object.values(EW.songs),d=EW.songs[EDS.sW];EDF=d||{};let h=`<div class="edsplit"><div class="edcol"><button onclick="edSongNew()">＋ Nuovo brano</button><div class="edlist">`;
  for(const q of L)h+=`<button class="edli${q.id===EDS.sW?' on':''}" onclick="EDS.sW='${q.id}';EDSG.part='A';edSongRender()"><span class="edic">🎵</span><span><b>${esc(q.n)}</b><small>${q.bpm} bpm · ${EINS[q.ld]||q.ld}</small></span></button>`;
  h+=`</div><p class="mu">Ascolta anche i brani del gioco: li trovi nelle proprietà delle mappe.</p></div><div class="edmain edscr">`;
  if(!d){h+='<p class="mu">Scrivi la colonna sonora del tuo mondo: scegli tempo, tonalità e strumento, metti gli accordi e disegna la melodia sulla griglia. Basso, accompagnamento e batteria seguono da soli.</p>';edWinSet(h+'</div></div>');return}
  if(!d.parts[EDSG.part])EDSG.part=Object.keys(d.parts)[0];const P0=d.parts[EDSG.part],spb=d.spb===12?12:16;
  h+=`<div class="edrow"><input class="edbig" value="${esc(d.n)}" maxlength="40" onchange="EDF.n=this.value;edSongUp(1)"><span><button class="gold" onclick="edSongPlay()">${EDSG.play?'⏹ Ferma':'▶ Ascolta'}</button><button onclick="edSongDup()">⧉</button><button class="danger" onclick="edSongDel()">🗑</button></span></div>
  <div class="edform"><label>Tempo: <b id="edbpm">${d.bpm}</b> bpm<input type="range" min="50" max="200" value="${d.bpm}" oninput="$('edbpm').textContent=this.value" onchange="EDF.bpm=+this.value;edSongUp()"></label>
  <label>Tonalità<select onchange="EDF.root=+this.value;edSongUp(1)">${edOpt(Array.from({length:24},(_,i)=>[48+i,ENOTE[(48+i)%12]+' '+(Math.floor((48+i)/12)-1)]),d.root)}</select></label>
  <label>Scala<select onchange="EDF.sc=this.value;edSongUp(1)">${edOpt(Object.entries(ESCL),d.sc)}</select></label><label>Strumento<select onchange="EDF.ld=this.value;edSongUp()">${edOpt(Object.entries(EINS),d.ld)}</select></label>
  <label>Basso<select onchange="EDF.bs=this.value;edSongUp()">${edOpt(Object.entries(EBASS),d.bs)}</select></label><label>Batteria<select onchange="EDF.dr=this.value;edSongUp(1)">${edOpt(Object.entries(EDRUM),d.dr)}</select></label>
  <label><span><input type="checkbox" ${d.echo?'checked':''} onchange="EDF.echo=this.checked?1:0;edSongUp()"> Eco</span></label><label><span><input type="checkbox" ${spb===12?'checked':''} onchange="edSongWaltz(this.checked)"> Tempo di valzer (3/4)</span></label></div>
  <div class="edrow"><span>Accompagnamento</span><span class="edchk">${Object.entries(ECOMP).map(([k,n])=>`<label><input type="checkbox" ${d.cp.includes(k)?'checked':''} onchange="EDF.cp=EDF.cp.filter(q=>q!=='${k}');if(this.checked)EDF.cp.push('${k}');edSongUp()"> ${n}</label>`).join('')}</span></div>
  <div class="edrow"><span>Ordine delle parti</span><input class="edsm" value="${esc(d.form)}" maxlength="16" onchange="EDF.form=this.value.toUpperCase().replace(/[^A-D]/g,'')||'A';for(const c of EDF.form)if(!EDF.parts[c])EDF.parts[c]={ch:[0,3,4,0],nt:[]};edSongUp(1)"><small class="mu">lettere A-D, per esempio AABA</small></div>
  <div class="edtabs">${Object.keys(d.parts).sort().map(k=>`<button class="${EDSG.part===k?'on':''}" onclick="EDSG.part='${k}';edSongRender()">Parte ${k}</button>`).join('')}${Object.keys(d.parts).length<4?`<button onclick="edSongPartNew()">＋ parte</button>`:''}</div>
  <div class="edrow"><span>Battute: <b>${P0.ch.length}</b> <button onclick="edBars(-1)">−</button><button onclick="edBars(1)">＋</button></span><span>Nuove note lunghe <select onchange="EDSG.len=+this.value">${edOpt([[1,'1/16'],[2,'1/8'],[3,'1/8 puntato'],[4,'1/4'],[6,'1/4 puntato'],[8,'1/2'],[12,'3/4'],[16,'intera']],EDSG.len)}</select>
    <span class="seg">${[[0,'♮'],[1,'♯'],[-1,'♭']].map(([v,n])=>`<button class="${EDSG.acc===v?'on':''}" onclick="EDSG.acc=${v};edSongRender()">${n}</button>`).join('')}</span> <button onclick="edSongGen()">🎲 Melodia a caso</button> <button onclick="if(confirm('Cancellare le note della parte ${EDSG.part}?')){EDF.parts['${EDSG.part}'].nt=[];edSongUp(1)}">🧽</button></span></div>
  <div class="edroll"><div class="edchd">${P0.ch.map((c,i)=>`<select title="Accordo della battuta ${i+1}" style="width:${spb*EDSG.cell}px" onchange="EDF.parts['${EDSG.part}'].ch[${i}]=+this.value;edSongUp()">${edOpt(ECHN.map((n,k)=>[k,n+' · '+edNoteName(d,k).replace(/\d+$/,'')]),c)}</select>`).join('')}</div><canvas id="edpr"></canvas></div>
  <p class="mu">Clic su una casella vuota: mette una nota (la senti). Clic su una nota: la toglie. Trascina in orizzontale mentre la metti per allungarla. Gli accordi (I, IV, V...) sono numerati sulla scala: I è la tonica.</p>`;
  if(d.dr==='custom'){h+=`<h5>La mia batteria</h5><div class="eddr">`;for(const[c,n]of EDRK){const p=(d.drm[c]||'').padEnd(spb,'.');h+=`<div class="edrow"><span class="eddn">${n}</span><span>${Array.from({length:spb},(_,i)=>`<button class="edst${p[i]==='x'?' on':''}${i%4===0?' b4':''}" onclick="edDrum('${c}',${i})"></button>`).join('')}</span></div>`}h+='</div>'}
  edWinSet(h+'</div></div>');edRollDraw()}
function edSongUp(full){edRegSong(EDF);edDirty();if(EDSG.play&&AU.ac){const k='eds_'+EDF.id;AU.want='';music(k)}if(full)edSongRender()}
function edSongWaltz(on){const d=EDF,o=d.spb===12?12:16,n=on?12:16;if(o===n)return;for(const p of Object.values(d.parts))p.nt=p.nt.map(q=>[Math.floor(q[0]/o)*n+Math.min(n-1,q[0]%o),q[1],Math.min(q[2],n),q[3]]);d.spb=n;if(on){if(!d.cp.includes('waltz'))d.cp.push('waltz');d.bs='waltz';d.dr='waltz'}edSongUp(1)}
function edBars(k){const p=EDF.parts[EDSG.part],spb=EDF.spb===12?12:16;if(k>0&&p.ch.length<8)p.ch.push(p.ch[p.ch.length-1]||0);else if(k<0&&p.ch.length>1){p.ch.pop();const T=p.ch.length*spb;p.nt=p.nt.filter(q=>q[0]<T)}edSongUp(1)}
function edSongPartNew(){const k=['A','B','C','D'].find(q=>!EDF.parts[q]);if(!k)return;EDF.parts[k]={ch:[0,3,4,0],nt:[]};EDSG.part=k;edSongUp(1)}
function edSongDup(){const d=edClone(EDF);d.id=edUid('s');d.n+=' (copia)';EW.songs[d.id]=d;edRegSong(d);EDS.sW=d.id;edDirty();edSongRender()}
function edSongDel(){if(!confirm('Eliminare il brano «'+EDF.n+'»?'))return;delete EW.songs[EDF.id];delete TRK['eds_'+EDF.id];for(const m of Object.values(EW.maps))if(m.mus==='song:'+EDF.id)m.mus='town';EDS.sW='';edDirty();edSongStop();edSongRender()}
function edSongPlay(){if(EDSG.play){edSongStop();edSongRender();return}auInit();edRegSong(EDF);AU.want='';music('eds_'+EDF.id);EDSG.play=1;edSongRender()}
function edSongStop(){EDSG.play=0;music(EDIT&&EDS.mus&&ZZ?ZZ.mus:'menu')}
function edDrum(c,i){const d=EDF,spb=d.spb===12?12:16,p=(d.drm[c]||'').padEnd(spb,'.').split('');p[i]=p[i]==='x'?'.':'x';d.drm[c]=p.join('');if(d.dr!=='custom')d.dr='custom';edSongUp(1)}
function edSongGen(){const d=EDF,p=d.parts[EDSG.part],spb=d.spb===12?12:16,R2=Math.random;p.nt=[];let pos=0,last=4;const T=p.ch.length*spb;
  while(pos<T){const bar=Math.floor(pos/spb),ch=p.ch[bar]||0,beat=pos%spb===0,L=[1,2,2,2,4,4,6,8][Math.floor(R2()*8)],len=Math.min(L,T-pos);
    if(!beat&&R2()<.18){pos+=Math.min(2,len);continue}let dg=beat?ch+[0,2,4,7][Math.floor(R2()*4)]:last+[-2,-1,-1,1,1,2,0][Math.floor(R2()*7)];dg=clamp(dg,-2,11);if(pos%spb===spb-2||pos+len>=T)dg=ch+(R2()<.5?0:4);
    p.nt.push([pos,dg,len]);last=dg;pos+=len}edSongUp(1)}
// la griglia: righe = gradi della scala (dall'ottava sotto a due ottave sopra), colonne = sedicesimi
const EDRG={lo:-7,hi:14};
function edRollDraw(){const c=$('edpr'),d=EDF;if(!c||!d||!d.parts)return;const p=d.parts[EDSG.part],spb=d.spb===12?12:16,cols=p.ch.length*spb,rows=EDRG.hi-EDRG.lo+1,cw=EDSG.cell,rh=14,lw=0;
  c.width=cols*cw;c.height=rows*rh;c.style.width=c.width+'px';c.style.height=c.height+'px';const q=c.getContext('2d');q.fillStyle='#141826';q.fillRect(0,0,c.width,c.height);
  for(let r=0;r<rows;r++){const dg=EDRG.hi-r,ton=((dg%7)+7)%7===0;q.fillStyle=ton?'#232b44':r%2?'#181d2e':'#1b2134';q.fillRect(0,r*rh,c.width,rh);
    // le note dell'accordo di ogni battuta sono più chiare
    for(let b=0;b<p.ch.length;b++){const rel=(((dg-p.ch[b])%7)+7)%7;if(rel===0||rel===2||rel===4){q.fillStyle='rgba(245,185,66,.07)';q.fillRect(b*spb*cw,r*rh,spb*cw,rh)}}}
  for(let i=0;i<=cols;i++){q.fillStyle=i%spb===0?'#f5b94288':i%4===0?'#ffffff26':'#ffffff0d';q.fillRect(i*cw,0,1,c.height)}
  q.font='9px Georgia';q.fillStyle='#ffffff66';for(let r=0;r<rows;r++){const dg=EDRG.hi-r;if((((dg%7)+7)%7)===0||r===0)q.fillText(edNoteName(d,dg),2,r*rh+10)}
  for(const n of p.nt){const[st,dg,ln,ac]=n;if(dg<EDRG.lo||dg>EDRG.hi)continue;const x=st*cw,y=(EDRG.hi-dg)*rh;q.fillStyle=ac>0?'#ff8a5a':ac<0?'#7aa8ff':'#f5b942';q.fillRect(x+1,y+1,Math.max(3,ln*cw-2),rh-2);q.fillStyle='#ffffff55';q.fillRect(x+1,y+1,Math.max(3,ln*cw-2),3);
    if(ac){q.fillStyle='#1b1408';q.fillText(ac>0?'♯':'♭',x+3,y+11)}}
  // dove sta suonando
  if(EDSG.play&&AU.tr==='eds_'+d.id){const T=TRK[AU.tr];if(T&&T.bars&&T.bars.length){const[pk,bi]=T.bars[AU.bar%T.bars.length];if(pk===EDSG.part){q.fillStyle='rgba(255,255,255,.5)';q.fillRect((bi*spb+AU.st)*cw,0,2,c.height)}}}
  c.onpointerdown=ev=>{ev.preventDefault();const r=c.getBoundingClientRect(),st=Math.floor((ev.clientX-r.left)/cw),dg=EDRG.hi-Math.floor((ev.clientY-r.top)/rh);if(st<0||st>=cols)return;
    const hit=p.nt.findIndex(n=>n[1]===dg&&st>=n[0]&&st<n[0]+n[2]);if(hit>=0){p.nt.splice(hit,1);edSongUp();edRollDraw();return}
    const n=[st,dg,Math.min(EDSG.len,cols-st)];if(EDSG.acc)n.push(EDSG.acc);p.nt=p.nt.filter(q=>!(q[0]===st));p.nt.push(n);edBeep(d,dg,EDSG.acc);edRollDraw();
    const mv=e2=>{const s2=Math.floor((e2.clientX-r.left)/cw);n[2]=clamp(s2-st+1,1,cols-st);edRollDraw()},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);edSongUp()};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
  if(EDSG.play&&!EDSG.raf)EDSG.raf=setTimeout(()=>{EDSG.raf=0;if($('edpr')&&EDSG.play)edRollDraw()},90)}

/* ================= 7.5: VOXELIA STUDIO — cinematiche =================
   Una cinematica è una fila di passi: la telecamera vola, i personaggi parlano e camminano, lo schermo sfuma,
   compaiono titoli, cambia la musica. Il giocatore guarda (clic o Invio per andare avanti, Esc per saltare). */
let CNE=null;
const ECST={cam:'Telecamera su un punto',camto:'Telecamera su qualcuno',say:'Battuta',text:'Narrazione al centro',title:'Titolo grande',move:'Qualcuno cammina',face:'Qualcuno si gira',anim:'Cambia il modo di muoversi',emote:'Fumetto sopra la testa',
  appear:'Fai comparire un personaggio',vanish:'Fai sparire un personaggio',wait:'Aspetta',fade:'Dissolvenza',flash:'Lampo',shake:'Terremoto',music:'Musica',sound:'Suono',tp:'Sposta l\'eroe',act:'Azioni'};
function edWho(w){if(w==='hero')return P;if(!w)return null;return ents.find(e=>e.k==='npc'&&e.edn===w)||null}
function edCinePlay(id,cb){const c=EW&&EW.cines[id];if(!c||!c.steps||!c.steps.length||!started){if(cb)cb();return}if(CNE)edCineStop(1);cl();cineOff();
  CNE={c,i:-1,t:0,cb,sz0:SZ,cam:{x:P.px,y:P.py,z:SZ,ax:P.px,ay:P.py,az:SZ,bx:P.px,by:P.py,bz:SZ,k:1,d:1,ent:P},fade:0,fa:0,fb:0,fk:1,fd:1,wait:0,tw:0};
  for(const e of ents)if(e.k==='en'){e._ag=e.ag;e.ag=0;e.al=0}for(const k in KEYS)KEYS[k]=0;P.path=[];P.tg=null;
  if(c.hud!==0)document.body.classList.add('edcine');let el=$('edcin');if(!el){el=document.createElement('div');el.id='edcin';document.body.appendChild(el)}
  el.className='';el.innerHTML=`<i class="edbar t"></i><i class="edbar b"></i><div id="edcfade"></div><div id="edctxt"></div><div id="edcsub" hidden><div class="edcp"><canvas id="edcpor" width="96" height="110"></canvas></div><div class="edcb"><b id="edcwho"></b><p id="edcline"></p><small>▸ clic, Invio o spazio</small></div></div>${c.skip!==0?'<button id="edcskip" onclick="edCineSkip()">Salta ▸</button>':''}`;
  el.style.display='block';if(c.bars!==0)requestAnimationFrame(()=>el.classList.add('bars'));edCineNext()}
function edCineStop(quiet){const C=CNE;if(!C)return;CNE=null;for(const e of ents)if(e.k==='en'&&e._ag!=null){e.ag=e._ag;delete e._ag}SZ=C.sz0||1;document.body.classList.remove('edcine');const el=$('edcin');if(el){el.style.display='none';el.innerHTML=''}
  for(const e of ents)if(e.k==='npc'&&e.cinGo){e.go=0;e.cinGo=0}if(!quiet&&C.cb)C.cb()}
function edCineSkip(){const C=CNE;if(!C)return;const L=C.c.steps;for(let i=C.i+1;i<L.length;i++){const s=L[i];if(['act','music','tp','appear','vanish','face','anim'].includes(s.k))try{edCineDo(s,1)}catch(e){}}
  const s=L[C.i];if(s&&s.k==='move'){const e=edWho(s.who);if(e&&e!==P){e.path=[];e.px=(s.x|0)+.5;e.py=(s.y|0)+.5}else if(e===P){P.path=[];heroPut(s.x|0,s.y|0)}}edCineStop()}
function edCineNext(){const C=CNE;if(!C)return;C.i++;C.t=0;C.wait=0;const sub=$('edcsub'),tx=$('edctxt');if(sub)sub.hidden=true;if(tx)tx.className='';
  if(C.i>=C.c.steps.length){edCineStop();return}const s=C.c.steps[C.i];try{edCineDo(s,0)}catch(err){console.warn('cinematica',s,err);C.dur=0}}
function edCineDo(s,instant){const C=CNE||{},d=Math.max(0,+s.d||0);C.dur=0;switch(s.k){
  case 'cam':{const x=(+s.x||0)+.5,y=(+s.y||0)+.5,z=clamp(+s.z||1.2,.4,2.6);if(instant)break;C.cam={x:C.cam.x,y:C.cam.y,z:C.cam.z,ax:C.cam.x,ay:C.cam.y,az:C.cam.z,bx:x,by:y,bz:z,k:0,d:d||1.5,ent:null};C.dur=s.wait===0?0:(d||1.5);break}
  case 'camto':{const e=edWho(s.who||'hero')||P,z=clamp(+s.z||1.3,.4,2.6);if(instant)break;C.cam={x:C.cam.x,y:C.cam.y,z:C.cam.z,ax:C.cam.x,ay:C.cam.y,az:C.cam.z,bx:e.px,by:e.py,bz:z,k:0,d:d||1.2,ent:e};C.dur=s.wait===0?0:(d||1.2);break}
  case 'say':{if(instant)break;const e=edWho(s.who),nd=EW.npcs[s.who],nm=s.who==='hero'?NET.name||'Eroe':nd?nd.n:(s.n||'');const sub=$('edcsub');if(sub){sub.hidden=false;sub.classList.toggle('nar',!e&&!nm)}
    const w=$('edcwho');if(w)w.textContent=nm;C.line=String(s.tx||'');C.lt=performance.now();C.typing=1;C.port=e;if(e&&e!==P){e.bub=null}C.wait=s.wait===0?0:1;C.dur=s.wait===0?Math.max(2,C.line.length*.055):1e9;voice(e&&e!==P?e:null);break}
  case 'text':{if(instant)break;const el=$('edctxt');if(el){el.textContent=s.tx||'';el.className='on'}C.wait=s.wait===0?0:1;C.dur=s.wait===0?(d||Math.max(2.5,(s.tx||'').length*.06)):1e9;break}
  case 'title':if(instant)break;banner(s.ti||'',s.sub||'','pergamena');C.dur=d||3;break;
  case 'move':{const e=edWho(s.who);if(!e)break;const x=clamp(s.x|0,0,N-1),y=clamp(s.y|0,0,N-1);if(instant){if(e===P)heroPut(x,y);else{e.px=x+.5;e.py=y+.5;e.path=[]}break}
    const p=path(e.px|0,e.py|0,x,y);if(e===P){P.path=p}else{e.path=p.slice(0,80);e.go=1;e.cinGo=1;e.wd=0}C.mv=e;C.dur=s.wait===0?0:1e9;C.mvt=0;break}
  case 'face':{const e=edWho(s.who);if(!e)break;const f=(s.dir|0)&7;if(e===P)P.fc=f;else{e.fc0=f;e.nfd=null;e.nmv=-9}break}
  case 'anim':{const e=edWho(s.who);if(e&&e.m&&e!==P)e.m.an=s.an||'idle';break}
  case 'emote':{const e=edWho(s.who);if(e){e.bub=s.e||'!';e.bt=2.2}if(!instant)C.dur=d||1;break}
  case 'appear':{const nd=EW.npcs[s.npc];if(!nd)break;const x=clamp(s.x|0,0,N-1),y=clamp(s.y|0,0,N-1);const e=edMakeNpc(nd,x,y);e.edn=nd.id;e.n=nd.n;e.fc0=(s.dir|0)&7;e.cinA=1;ents.push(e);if(!instant&&cineOK())sparks(e.px,e.py,14,['#ffffff','#c8d8ff'],80);break}
  case 'vanish':{const L=ents.filter(q=>q.k==='npc'&&q.edn===s.npc),e=L.filter(q=>q.cinA).pop()||L.pop();if(e){if(!instant&&cineOK())sparks(e.px,e.py,14,['#ffffff','#c8d8ff'],80);ents.splice(ents.indexOf(e),1)}break}
  case 'wait':if(!instant)C.dur=d||1;break;
  case 'fade':{if(instant)break;const to=s.to==='in'?0:1;C.fa=C.fade;C.fb=to;C.fk=0;C.fd=d||1;C.fc=s.col||'#000000';C.dur=s.wait===0?0:(d||1);break}
  case 'flash':if(!instant)flash(s.col||'#ffffff',.8,700);break;case 'shake':if(!instant)shake(clamp(+s.a||1.2,.2,3));break;
  case 'music':EDG&&(EDG.musO=s.m?{map:Zk,m:edMusKey(s.m)}:null);music(s.m?edMusKey(s.m):zoneMus());break;case 'sound':if(!instant)edSound(s.s);break;
  case 'tp':{const x=clamp(s.x|0,0,N-1),y=clamp(s.y|0,0,N-1);heroPut(x,y);if(CNE)CNE.cam.ent=CNE.cam.ent||null;break}
  case 'act':edRun((s.acts||[]).filter(a=>a.a!=='cine'),{});break}}
function edCineClick(){const C=CNE;if(!C)return;const s=C.c.steps[C.i];if(!s)return;if(s.k==='say'&&C.typing){C.lt=-1e9;return}if(C.wait){edCineNext()}}
function edCineKey(e){const k=e.key;if(k==='Escape'){if(CNE&&CNE.c.skip!==0)edCineSkip();e.preventDefault();return}if(k==='Enter'||k===' '||k==='e'||k==='E'){e.preventDefault();edCineClick()}}
function edCineTick(dt){const C=CNE;if(!C)return;C.t+=dt;for(const k in KEYS)KEYS[k]=0;P.tg=null;const s=C.c.steps[C.i];
  // telecamera
  const cm=C.cam;if(cm.k<1){cm.k=Math.min(1,cm.k+dt/Math.max(.05,cm.d));const e=ease3(cm.k),bx=cm.ent?cm.ent.px:cm.bx,by=cm.ent?cm.ent.py:cm.by;cm.x=cm.ax+(bx-cm.ax)*e;cm.y=cm.ay+(by-cm.ay)*e;cm.z=cm.az+(cm.bz-cm.az)*e}
  else if(cm.ent){cm.x+=(cm.ent.px-cm.x)*Math.min(1,dt*5);cm.y+=(cm.ent.py-cm.y)*Math.min(1,dt*5)}SZ=cm.z;
  // dissolvenza
  if(C.fk<1){C.fk=Math.min(1,C.fk+dt/C.fd);C.fade=C.fa+(C.fb-C.fa)*C.fk}const fd=$('edcfade');if(fd){fd.style.opacity=C.fade;fd.style.background=C.fc||'#000'}
  if(!s)return;
  if(s.k==='say'){const el=$('edcline');if(el){const n=Math.min(C.line.length,Math.floor((performance.now()-C.lt)/24));const tx=C.line.slice(0,n);if(el.textContent!==tx)el.textContent=tx;if(n>=C.line.length)C.typing=0}const pc=$('edcpor');if(pc&&C.port&&C.port!==P&&C.port.m)paintNpc(pc,C.port,t,C.typing);else if(pc&&C.port===P&&!C.pp){C.pp=1;try{paintHero(pc,P.ap,myEq(),0,0)}catch(e){}}}
  if(s.k==='move'&&C.mv){C.mvt+=dt;const e=C.mv,done=e===P?!P.path.length:!(e.path&&e.path.length);if(done||C.mvt>14){if(e!==P){e.go=0;e.cinGo=0}C.mv=null;if(s.wait!==0){edCineNext();return}}}
  if(!C.wait&&C.t>=C.dur&&!(s.k==='move'&&C.mv&&s.wait!==0))edCineNext()}
const _ct75b=camTarget;camTarget=function(){if(CNE&&!EDIT)return[CNE.cam.x,CNE.cam.y];return _ct75b()};
const _upd75c=upd;upd=function(dt){if(CNE&&!EDIT){edCineTick(dt)}_upd75c(dt)};
function edInstallCine(){const pd=cv.onpointerdown;cv.onpointerdown=ev=>{if(CNE&&!EDIT){auInit();edCineClick();return}pd(ev)};const kd=onkeydown;onkeydown=e=>{if(CNE&&!EDIT){if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;edCineKey(e);return}kd(e)}}
function edInstall(){edInstallEd();edInstallCine()}
document.addEventListener('pointerdown',e=>{if(CNE&&!EDIT&&e.target&&e.target.closest&&e.target.closest('#edcsub,#edctxt'))edCineClick()});

/* ---- la finestra delle cinematiche ---- */
function edCineWin(id){EDS.cW=id&&EW.cines[id]?id:EDS.cW&&EW.cines[EDS.cW]?EDS.cW:Object.keys(EW.cines)[0]||'';EDWR=edCineRender;EDRR=edCineRender;edWin('🎬 Cinematiche','','wide');edCineRender()}
function edCineNew(){const x=EDS.cam.x|0,y=EDS.cam.y|0,np=Object.keys(EW.npcs)[0]||'';const d={id:edUid('c'),n:'Nuova cinematica',bars:1,hud:1,skip:1,steps:[{k:'fade',to:'in',d:1.2},{k:'cam',x,y,z:1.3,d:2},{k:'say',who:np,tx:'Benvenuto, viandante!'},{k:'camto',who:'hero',z:1,d:1}]};EW.cines[d.id]=d;EDS.cW=d.id;edDirty();edCineRender()}
function edCineRender(){const L=Object.values(EW.cines),d=EW.cines[EDS.cW];EDF=d||{};let h=`<div class="edsplit"><div class="edcol"><button onclick="edCineNew()">＋ Nuova</button><div class="edlist">`;
  for(const q of L)h+=`<button class="edli${q.id===EDS.cW?' on':''}" onclick="EDS.cW='${q.id}';edCineRender()"><span class="edic">🎬</span><span><b>${esc(q.n)}</b><small>${q.steps.length} passi</small></span></button>`;
  h+=`</div></div><div class="edmain edscr">`;
  if(!d){h+='<p class="mu">Le cinematiche raccontano: la telecamera vola su un luogo, i personaggi parlano e camminano, lo schermo sfuma. Si avviano all\'inizio del mondo, la prima volta che entri in una mappa, con una zona evento o con l\'azione «Mostra una cinematica».</p>';edWinSet(h+'</div></div>');return}
  const who=[['hero','L\'eroe'],...Object.values(EW.npcs).map(q=>[q.id,q.n])],whoN=[['','(narratore)'],...who];
  h+=`<div class="edrow"><input class="edbig" value="${esc(d.n)}" maxlength="40" onchange="EDF.n=this.value;edDirty();edCineRender()"><span><button class="gold" onclick="edCinePreview('${d.id}')">▶ Prova</button><button class="danger" onclick="if(confirm('Eliminare la cinematica?')){delete EW.cines[EDS.cW];EDS.cW='';edDirty();edCineRender()}">🗑</button></span></div>
  <div class="edrow"><span class="edchk"><label><input type="checkbox" ${d.bars!==0?'checked':''} onchange="EDF.bars=this.checked?1:0;edDirty()"> Bande nere</label><label><input type="checkbox" ${d.hud!==0?'checked':''} onchange="EDF.hud=this.checked?1:0;edDirty()"> Nascondi l'interfaccia</label><label><input type="checkbox" ${d.skip!==0?'checked':''} onchange="EDF.skip=this.checked?1:0;edDirty()"> Si può saltare</label></span></div>
  <p class="mu">Le coordinate sono quelle della mappa in cui parte la cinematica. «📍» prende il centro della vista dell'editor. I personaggi devono essere nella mappa (o fatti comparire).</p><div class="edcl">`;
  d.steps.forEach((s,i)=>{const F=(k,v,t,o,ph)=>edF('EDF.steps',i,k,v,t,o,ph),xy=`x${F('x',s.x|0,'n')}y${F('y',s.y|0,'n')}<button title="Centro della vista" onclick="EDF.steps[${i}].x=EDS.cam.x|0;EDF.steps[${i}].y=EDS.cam.y|0;edDirty();edCineRender()">📍</button>`;let f='';
    switch(s.k){case 'cam':f=xy+'zoom'+F('z',s.z||1.2,'n')+'secondi'+F('d',s.d||1.5,'n');break;case 'camto':f=F('who',s.who||'hero','s',who)+'zoom'+F('z',s.z||1.3,'n')+'secondi'+F('d',s.d||1.2,'n');break;
      case 'say':f=F('who',s.who||'','s',whoN)+F('tx',s.tx,'ta',0,'la battuta')+`<label><input type="checkbox" ${s.wait!==0?'checked':''} onchange="EDF.steps[${i}].wait=this.checked?1:0;edDirty()"> aspetta il clic</label>`;break;
      case 'text':f=F('tx',s.tx,'ta',0,'il testo del narratore')+`<label><input type="checkbox" ${s.wait!==0?'checked':''} onchange="EDF.steps[${i}].wait=this.checked?1:0;edDirty()"> aspetta il clic</label>`;break;
      case 'title':f=F('ti',s.ti,'s',0,'titolo')+F('sub',s.sub,'s',0,'sottotitolo')+'secondi'+F('d',s.d||3,'n');break;
      case 'move':f=F('who',s.who||'hero','s',who)+xy+`<label><input type="checkbox" ${s.wait!==0?'checked':''} onchange="EDF.steps[${i}].wait=this.checked?1:0;edDirty()"> aspetta che arrivi</label>`;break;
      case 'face':f=F('who',s.who||'hero','s',who)+F('dir',s.dir|0,'s',[[0,'sud-est'],[1,'sud'],[2,'sud-ovest'],[3,'ovest'],[4,'nord-ovest'],[5,'nord'],[6,'nord-est'],[7,'est']]);break;
      case 'anim':f=F('who',s.who||'','s',who.slice(1))+F('an',s.an||'idle','s',EANIM);break;case 'emote':f=F('who',s.who||'hero','s',who)+F('e',s.e||'!','s',[['!','!'],['?','?'],['…','…'],['♥','♥'],['💢','💢'],['💤','💤'],['🎵','🎵'],['😮','😮']])+'secondi'+F('d',s.d||1,'n');break;
      case 'appear':f=F('npc',s.npc||'','s',edNpcsL())+xy+F('dir',s.dir|0,'s',[[0,'sud-est'],[1,'sud'],[2,'sud-ovest'],[3,'ovest'],[4,'nord-ovest'],[5,'nord'],[6,'nord-est'],[7,'est']]);break;case 'vanish':f=F('npc',s.npc||'','s',edNpcsL());break;
      case 'wait':f='secondi'+F('d',s.d||1,'n');break;case 'fade':f=F('to',s.to||'out','s',[['out','verso il nero'],['in','dal nero']])+F('col',s.col||'#000000','c')+'secondi'+F('d',s.d||1,'n');break;
      case 'flash':f=F('col',s.col||'#ffffff','c');break;case 'shake':f='forza'+F('a',s.a||1.2,'n');break;case 'music':f=F('m',s.m||'','s',edMusL());break;case 'sound':f=F('s',s.s||'gioia','s',Object.entries(ESND));break;
      case 'tp':f=xy;break;case 'act':f=edActHTML(s.acts,'EDF.steps['+i+'].acts');break}
    h+=`<div class="edcr edstep"><span class="edn">${i+1}</span><select onchange="edCSet('EDF.steps',${i},'k',this.value,1)">${edOpt(Object.entries(ECST),s.k)}</select>${f}<span class="edmv"><button onclick="edLMove('EDF.steps',${i},-1)">▲</button><button onclick="edLMove('EDF.steps',${i},1)">▼</button><button title="Duplica" onclick="EDF.steps.splice(${i+1},0,edClone(EDF.steps[${i}]));edDirty();edCineRender()">⧉</button><button onclick="edLDel('EDF.steps',${i})">✕</button></span></div>`});
  h+=`<button class="edadd" onclick="edLAdd('EDF.steps',{k:'say',who:'',tx:''})">＋ passo</button></div>`;
  const used=[];if(EW.set.intro===d.id)used.push('apertura del mondo');for(const m of Object.values(EW.maps)){if(m.cine===d.id)used.push('prima volta in «'+m.n+'»');for(const e of m.e)if(JSON.stringify(e.acts||[]).includes('"'+d.id+'"'))used.push((e.n||e.k)+' in «'+m.n+'»')}
  h+=`<p class="mu">${used.length?'Si avvia: '+esc(used.join(' · ')):'Non si avvia ancora da nessuna parte: scegline l\'avvio (🌍 Mondo → Cinematica d\'apertura, ⚙ mappa → la prima volta, o un\'azione).'}</p>`;edWinSet(h+'</div></div>')}
function edCinePreview(id){edWinClose();edTest(1);setTimeout(()=>edCinePlay(id),60)}

/* ================= 7.5: VOXELIA STUDIO — il Parco giochi nel menu, il mondo di esempio, lo stile dell'editor ================= */
const _mode75=mode;mode=function(m){const pc=$('mparco');if(m==='parco'){$('msel').hidden=true;$('mstory').hidden=true;$('mdim').hidden=true;if(pc){pc.hidden=false;menuAnim(pc)}edMenu();tone(520,.05,'triangle');return}if(pc)pc.hidden=true;_mode75(m)};
function edMenu(){const el=$('mparcob');if(!el)return;const L=edIdx(),PM2=typeof mPubMap==='function'?mPubMap():{};let h=`<div class="dgrid edmg"><button class="dcard edcom" onclick="mbOpen()"><b>🌐 Mondi della community</b><small>Gioca ai mondi creati dagli altri giocatori del server, dai le stelle, commenta e pubblica i tuoi.</small></button><button class="dcard ednew" onclick="edNewWin()"><b>✨ Nuovo mondo</b><small>Parti da un prato, un'isola, un villaggio, una grotta o un dungeon.</small></button>
  <button class="dcard" onclick="edSample()"><b>🎓 Mondo di esempio</b><small>«La Valle di Pratofiorito»: un'avventura breve con missioni, dialoghi, una grotta, un boss, musica e cinematiche. Giocala o aprila per vedere come è fatta.</small></button>
  <label class="dcard edimp"><b>📥 Importa un mondo</b><small>Un file .voxelia.json esportato da Voxelia Studio.</small><input type="file" accept=".json,application/json" onchange="edImport(this.files[0]);this.value=''"></label></div>`;
  if(L.length){h+=`<h4 class="edmh">I tuoi mondi</h4><div class="edwl">`;for(const q of L){const sv=LS.get(EDSK+q.id,null);
    h+=`<div class="edwc2"><div><b>${esc(q.name)}</b>${PM2[q.id]?'<i class="edpubt">🌐 pubblicato</i>':''}<small>${esc(q.desc||'')}</small><span class="mu">${q.maps} mappe · ${q.npcs} personaggi · ${q.quests} missioni · modificato ${esc(new Date(q.t).toLocaleString('it-IT'))}${sv?' · partita salvata':''}</span></div>
      <span><button class="gold" onclick="edPlayId('${q.id}',0)">▶ ${sv?'Continua':'Gioca'}</button>${sv?`<button onclick="ovrEdW('${q.id}')">↺ Da capo</button>`:''}<button onclick="edOpen('${q.id}')">✏ Modifica</button><button title="${PM2[q.id]?'Aggiorna la pubblicazione':'Pubblica nel browser dei mondi'}" onclick="mpFromMenu('${q.id}')">🌐</button>
      <button title="Esporta in un file" onclick="const w=edLoadWorld('${q.id}');if(w)edExport(w)">📤</button><button title="Duplica" onclick="edDupWorld('${q.id}')">⧉</button><button class="danger" title="Elimina" onclick="if(confirm('Eliminare per sempre «'+${JSON.stringify(q.name).replace(/"/g,'&quot;')}+'»? Esportalo prima se vuoi tenerne una copia.')){edDelWorld('${q.id}');edMenu()}">🗑</button></span></div>`}h+='</div>'}
  else h+='<p class="mnote">Non hai ancora nessun mondo: creane uno o apri il mondo di esempio.</p>';el.innerHTML=h}
function edPlayId(id,fresh){const w=edLoadWorld(id);if(!w){edToast('Mondo non trovato','err');return}if(fresh)LS.del(EDSK+id);edPlay(w,{fresh})}
function edDupWorld(id){const w=edLoadWorld(id);if(!w)return;w.id=edUid('w');w.name+=' (copia)';w.created=Date.now();edSaveWorld(w);edMenu()}
function edImport(f){if(!f)return;const r=new FileReader();r.onload=()=>{try{const w=edFixWorld(JSON.parse(r.result));if(!w)throw 0;if(edIdx().some(q=>q.id===w.id))w.id=edUid('w');edSaveWorld(w);edMenu();edToast('Mondo «'+w.name+'» importato')}catch(e){edToast('Questo file non è un mondo di Voxelia Studio','err')}};r.readAsText(f)}
function edNewWin(){const el=$('mparcob');if(!el)return;el.innerHTML=`<div class="mpan ednw"><h3>✨ Nuovo mondo</h3><label>Nome<input id="ednwn" maxlength="60" value="Il mio mondo"></label>
  <label>La prima mappa<select id="ednwg">${edOpt(Object.entries(EGEN),'prato')}</select></label><label>Dimensioni<select id="ednwN">${edOpt([[24,'24×24 (piccola)'],[32,'32×32'],[40,'40×40'],[48,'48×48'],[64,'64×64 (grande)']],40)}</select></label>
  <button class="gold" onclick="edCreateWorld()">✔ Crea e apri l'editor</button><button onclick="edMenu()">Annulla</button></div>`;$('ednwn').select()}
function edCreateWorld(){const nm=($('ednwn').value||'').trim()||'Il mio mondo',gk=$('ednwg').value,n=+$('ednwN').value||40;const w=edNewWorld(nm);const m0=Object.values(w.maps)[0];delete w.maps[m0.id];
  const L={interno:'interno',grotta:'tenebre',dungeon:'tenebre',cielo:'giorno'};const m=edNewMap({n:EGEN[gk]?EGEN[gk].split(' ')[0]:'Mappa',N:n,light:L[gk]||'ciclo',mus:gk==='grotta'?'tana':gk==='dungeon'?'dungeon':gk==='villaggio'?'town':'forest'});edGenerate(m,gk);m.n=nm.slice(0,30);w.maps[m.id]=m;w.start={map:m.id,x:m.sp[0],y:m.sp[1]};
  edSaveWorld(w);EW=w;edEnter();setTimeout(()=>edToast('Benvenuto in Voxelia Studio! ❓ in alto a destra per la guida'),400)}

/* ---- il mondo di esempio: La Valle di Pratofiorito ---- */
function edSample(){const L=edIdx(),ex=L.find(q=>q.name==='La Valle di Pratofiorito');if(ex&&!confirm('Hai già il mondo di esempio. Crearne un\'altra copia, nuova di zecca?')){edMenu();return}const w=edSampleWorld();edSaveWorld(w);edMenu();edToast('Ecco «La Valle di Pratofiorito»: giocala o aprila nell\'editor')}
function edSampleWorld(){const w=edNewWorld('La Valle di Pratofiorito');w.maps={};w.desc='Gli slime hanno invaso l\'orto di Pratofiorito e il faro della valle è spento da quando il Re degli Slime ne ha rubato la chiave. Aiuta la Sindaca Ortensia, ritrova la pastorella Gemma e riporta la luce. (Mondo di esempio di Voxelia Studio: aprilo nell\'editor per vedere come è fatto.)';w.author='Voxelia Studio';
  const I=(m,x,y)=>y*m.N+x,mat=id=>EMATI[id],wl=id=>EWALI[id];
  const put=(m,o)=>{o.u=o.u||edUid('e');m.e.push(o);return o},F=(m,x,y,id)=>{const i=I(m,x,y);m.t[i]=0;m.f[i]=mat(id);delete m.d[i]},D=(m,x,y,c,wk)=>{const i=I(m,x,y);if(m.t[i]!==0)m.t[i]=0;m.d[i]=c;if(wk)m.dw[i]=1},Wl=(m,x,y,st)=>{const i=I(m,x,y);m.t[i]=1;m.w[i]=wl(st);delete m.d[i]};
  // oggetti
  const it=(o)=>{const d=edFixItem(Object.assign({id:edUid('i')},o));w.items[d.id]=d;return d.id};
  const iSpada=it({n:'Spada di quercia',k:'w',base:'Spada',r:1,v:12,price:60,desc:'Leggera e ben bilanciata.'}),iScudo=it({n:'Scudo di legno',k:'s',base:'Scudo',r:0,v:5,price:30}),
    iPozione=it({n:'Pozione di bacche',k:'pot',heal:60,price:20,col:'#c0392b',desc:'Cura 60 punti vita.'}),iPane=it({n:'Pane dolce',k:'food',heal:25,price:6,col:'#e0a050'}),
    iChiave=it({n:'Chiave del faro',k:'key',price:0,col:'#d4af37',desc:'Una chiave d\'ottone, ancora appiccicosa.'}),iGelatina=it({n:'Gelatina di slime',k:'mat',price:4,col:'#6ad06a',desc:'Appiccicosa. Il mercante la compra.'}),
    iLama=it({n:'Lama delle lucciole',k:'w',base:'Stocco',r:3,v:24,cr:8,fx:'fulmine',fxv:3,price:400,desc:'Dove colpisce, la luce salta al nemico vicino.'}),iLettera=it({n:'Lettera di Gemma',k:'note',price:0,col:'#f4e8c8',txt:'Cara Lilla, sono andata a cercare la pecora Nuvola nel bosco. Se non torno per cena, non preoccuparti: so badare a me stessa. (Più o meno.) — Gemma',keep:1});
  // personaggi
  const np=(o,look)=>{const d=edFixNpc(Object.assign({id:edUid('n')},o));d.look=Object.assign(d.look,look);w.npcs[d.id]=d;return d.id};
  const nSind=np({n:'Sindaca Ortensia',title:'Sindaca di Pratofiorito',lines:['Pratofiorito era il villaggio più tranquillo della valle. Era.']},{sk:'b',hair:'bun',hc:'#8a8a8a',hat:'feather',h1:'#5a2a6a',h2:'#ffffff',c:'#7a3a8a',xs:['necklace','collar'],prop:'scroll',an:'proud',body:['f']}),
    nMerc=np({n:'Mercante Bartolo',title:'Bottega di Bartolo',role:'shop',pots:1,buys:1,shop:[],lines:['Merce fresca! Più o meno.','Compro gelatina di slime: non chiedermi cosa ci faccio.']},{sk:'c',hair:'short',hc:'#2a1a10',beard:'bigmous',bc:'#2a1a10',hat:'beret',h1:'#a83a2a',c:'#a8632f',xs:['vest','belly'],prop:'coinbag',an:'shout',body:['fat']}),
    nLilla=np({n:'Lilla',title:'Bambina del villaggio'},{sk:'a',hair:'braids',hc:'#d8b050',hat:'bow',h1:'#e86a8a',c:'#e86a8a',xs:['freckles'],prop:'flowers',an:'kid',body:['f','kid']}),
    nGemma=np({n:'Pastorella Gemma',title:'Persa nel bosco'},{sk:'b',hair:'tail',hc:'#5a3a1a',hat:'straw',h1:'#c0392b',c:'#5a8a3a',xs:['apron:#f0e8d8'],prop:'crook',an:'nervous',body:['f']}),
    nFabbro=np({n:'Fabbra Rocca',title:'Fucina di Pratofiorito',role:'smith',lines:['Il ferro non mente.','Porta oro, e ti farò una lama che canta.']},{sk:'d',hair:'short',hc:'#1a1a1a',c:'#5a3a2a',xs:['apron:#3a2a1a','arms'],prop:'hammer',an:'hammer',body:['f','big']}),
    nGuardia=np({n:'Guardia Tito',title:'Alla porta est'},{sk:'b',hair:'short',hc:'#3a2a1a',beard:'stubble',hat:'helmet',h1:'#9aa4b8',h2:'#c0392b',c:'#3a5a8a',xs:['armor','sheath'],prop:'spear',an:'guard',body:['tall']}),
    nMucca=np({n:'Nuvola',title:'La pecora di Gemma',animal:'pecora',lines:['Beee!']},{});
  w.npcs[nMerc].shop=[{item:iPozione,q:0},{item:iPane,q:0},{item:iSpada,q:1},{item:iScudo,q:1}];
  // variabili
  const vGemma='v'+edUid(),vLilla='v'+edUid();w.vars[vGemma]={id:vGemma,n:'gemma_salva',v:0,desc:'La pastorella è tornata a casa'};w.vars[vLilla]={id:vLilla,n:'regalo_di_lilla',v:0,desc:'Lilla ti ha regalato i fiori'};
  // brano
  const s=edNewSong();s.n='Pratofiorito';s.bpm=112;s.root=62;s.ld='flute';s.bs='walk';s.cp=['strum'];s.dr='folk';w.songs[s.id]=s;
  const s2=edNewSong();s2.n='Grotta degli slime';s2.bpm=84;s2.root=57;s2.sc='hm';s2.ld='str';s2.bs='ostinato';s2.cp=['pad'];s2.dr='heart';s2.form='AB';s2.parts={A:{ch:[0,0,5,4],nt:[[0,4,8],[8,3,4],[12,2,4],[16,1,8],[24,2,4],[28,0,4],[32,5,8],[40,4,4],[44,2,4],[48,4,12]]},B:{ch:[3,3,5,4],nt:[[0,7,8],[8,5,4],[12,3,4],[16,6,8],[24,5,4],[28,3,4],[32,5,4],[36,7,4],[40,9,8],[48,6,8],[56,4,8]]}};w.songs[s2.id]=s2;
  // mappa 1: il villaggio
  const m1=edNewMap({n:'Pratofiorito',N:40,light:'ciclo',mus:'song:'+s.id,sky:'sereno',pt:'petal',lv:1});w.maps[m1.id]=m1;m1.f.fill(mat('erba'));
  for(let i=0;i<40;i++){F(m1,i,20,'strada');F(m1,i,21,'strada');F(m1,20,i,'strada');F(m1,21,i,'strada')}for(let y=17;y<=24;y++)for(let x=17;x<=24;x++)F(m1,x,y,'ciottoli');D(m1,19,19,'Y');D(m1,22,22,'ɸ');
  for(let x=0;x<40;x++){if(x<18||x>23){Wl(m1,x,0,'siepe');Wl(m1,x,39,'siepe')}}for(let y=0;y<40;y++){Wl(m1,0,y,'siepe');if(y<19||y>22)Wl(m1,39,y,'siepe')}
  const bl=(x,y,w2,h,st,wa,ro,n,to)=>{const b={u:edUid('b'),x,y,w:w2,h,st,wall:wa,roof:ro,ht:24,door:1,dx:x+(w2>>1),to:to||'',n:n||''};m1.b.push(b);return b};
  const bS=bl(9,9,7,5,'municipio','#e8dcc4','#8a2a2a','Municipio'),bM=bl(26,9,6,5,'casa','#c8b89a','#3a5a8a','Bottega di Bartolo'),bF=bl(26,27,6,5,'fumo','#8a7a6a','#4a4a4a','Fucina'),bC=bl(9,27,5,4,'casa','#f0dcc0','#c8783a','Casa di Lilla');
  for(const[x,y]of[[5,17],[13,17],[27,17],[34,17],[5,24],[13,24],[27,24],[34,24]])D(m1,x,y,'l');
  for(let x=3;x<=8;x++){for(const y of[31,33,35])D(m1,x,y,'q');}for(let x=2;x<=9;x++){D(m1,x,30,'f');D(m1,x,36,'f')}for(let y=30;y<=36;y++){D(m1,2,y,'f');D(m1,9,y,'f')}delete m1.d[I(m1,9,34)];D(m1,5,29,'E');
  for(const[x,y,c]of[[3,4,'r'],[6,3,'a'],[15,4,'r'],[33,4,'a'],[36,7,'r'],[35,32,'r'],[17,35,'h'],[24,35,'h'],[30,36,'o'],[14,36,'o'],[4,13,'h'],[36,13,'h']])D(m1,x,y,c);
  for(const[x,y]of[[30,15],[31,15]])D(m1,x,y,'k');D(m1,32,15,'b');D(m1,25,31,'L');D(m1,32,32,'A');
  m1.sp=[20,23];w.start={map:m1.id,x:20,y:23};
  put(m1,{k:'npc',x:14,y:16,npc:nSind,fc:1,beh:'fermo',cond:[]});put(m1,{k:'npc',x:28,y:15,npc:nMerc,fc:1,beh:'fermo',cond:[]});put(m1,{k:'npc',x:16,y:22,npc:nLilla,fc:7,beh:'vaga',cond:[]});
  put(m1,{k:'npc',x:31,y:33,npc:nFabbro,fc:1,beh:'fermo',cond:[]});put(m1,{k:'npc',x:37,y:19,npc:nGuardia,fc:3,beh:'fermo',cond:[]});
  put(m1,{k:'npc',x:11,y:33,npc:nGemma,fc:1,beh:'fermo',cond:[{c:'var',v:vGemma,op:'>=',n:1}]});put(m1,{k:'npc',x:7,y:34,npc:nMucca,fc:1,beh:'vaga',cond:[{c:'var',v:vGemma,op:'>=',n:1}]});
  put(m1,{k:'sign',x:23,y:25,ti:'Pratofiorito',tx:'Benvenuti a Pratofiorito!\nA est: il Bosco dei Sussurri.\nAl Municipio: la Sindaca Ortensia.\n\n(Si raccomanda di non dare da mangiare agli slime.)'});
  put(m1,{k:'trig',x:17,y:17,w:8,h:8,on:'enter',once:1,n:'Piazza',cond:[],acts:[{a:'banner',ti:'Pratofiorito',sub:'Il villaggio dei fiori'}]});
  // interno: il municipio con il letto
  const m4=edGenRoom(edNewMap({n:'Municipio',N:14,light:'interno',mus:'inter',pt:''}),12,10);w.maps[m4.id]=m4;bS.to=m4.id;const ex4=m4.e.find(e=>e.k==='po');ex4.to=m1.id;put(m4,{k:'bed',x:3,y:4});
  put(m4,{k:'note',x:9,y:5,ti:'Registro del faro',tx:'«Il faro della valle si accende solo con la sua chiave d\'ottone. Chi la custodisce custodisce la luce.»\n\nSotto, a matita: «Il Re degli Slime l\'ha inghiottita. Di nuovo.»',acts:[]});
  // mappa 2: il bosco
  const m2=edNewMap({n:'Bosco dei Sussurri',N:40,light:'ciclo',mus:'forest',sky:'sereno',pt:'leaf',lv:2});w.maps[m2.id]=m2;edGenerate(m2,'bosco');m2.n='Bosco dei Sussurri';m2.mus='forest';m2.pt='leaf';
  for(let x=0;x<40;x++)for(const y of[19,20])F(m2,x,y,'sentiero');for(let y=8;y<20;y++)F(m2,30,y,'sentiero');for(let y=4;y<=10;y++)for(let x=27;x<=34;x++)F(m2,x,y,'terra');
  m2.e=m2.e.filter(e=>e.k!=='en');for(const[x,y,t]of[[8,14,'slime'],[12,25,'slime'],[17,9,'slime'],[22,27,'slime'],[25,14,'slime'],[6,28,'slime'],[14,31,'lupo'],[33,26,'lupo'],[24,33,'goblin'],[9,6,'goblin']]){F(m2,x,y,'erba2');put(m2,{k:'en',x,y,t,lv:0,boss:0,resp:90,acts:[],cond:[],drop:t==='slime'?iGelatina:''})}
  m2.sp=[1,19];F(m2,0,19,'sentiero');put(m2,{k:'po',x:0,y:19,st:'cancello',dir:'y',sty:'legno',to:m1.id,n:'Pratofiorito'});const po1=put(m1,{k:'po',x:39,y:20,st:'cancello',dir:'y',sty:'legno',to:m2.id,n:'Bosco dei Sussurri'});
  F(m1,39,20,'strada');F(m1,39,21,'strada');
  // sentieri dal sentiero principale verso tutto ciò che conta (il bosco è generato a caso: così niente resta chiuso tra gli alberi)
  const trail=(x,y)=>{for(let k=-1;k<=1;k++)for(let j=-1;j<=1;j++){const u=x+k,v=y+j;if(u>0&&v>0&&u<39&&v<39){const i=I(m2,u,v);if(m2.t[i]===1||(m2.d[i]&&!m2.dw[i])){m2.t[i]=0;m2.f[i]=mat('erba2');delete m2.d[i]}}}const s0=Math.sign(19.5-y);for(let v=y;v!==19&&v!==20;v+=s0){const i=I(m2,x,v);m2.t[i]=0;m2.f[i]=mat('sentiero');delete m2.d[i]}};
  for(const[x,y]of[[10,35],[35,5],[5,4]]){F(m2,x,y,'erba2');put(m2,{k:'gem',x,y,n:'Gemma blu',col:'#5ad0ff',acts:[]})}
  F(m2,31,30,'erba2');put(m2,{k:'ch',x:31,y:30,rich:0,g:40,rnd:1,items:[{item:iPozione,n:2}],acts:[]});
  for(let y=24;y<=28;y++)for(let x=14;x<=19;x++)F(m2,x,y,'fiori');F(m2,16,26,'fiori');put(m2,{k:'npc',x:16,y:26,npc:nGemma,fc:1,beh:'fermo',cond:[{c:'var',v:vGemma,op:'<',n:1}]});
  for(const e of m2.e)if(e.k!=='po')trail(e.x,e.y);
  put(m2,{k:'note',x:18,y:24,ti:'Lettera stropicciata',tx:'Cara Lilla, sono andata a cercare la pecora Nuvola nel bosco. Se non torno per cena, non preoccuparti. — Gemma',acts:[]});
  // la grotta
  const m3=edNewMap({n:'Grotta del Re Slime',N:30,light:'tenebre',mus:'song:'+s2.id,lv:3});w.maps[m3.id]=m3;m3.f.fill(mat('roccia'));m3.t.fill(1);m3.w.fill(wl('roccia'));
  const room=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=I(m3,x,y);m3.t[i]=0}};room(3,20,9,26);room(9,22,18,23);room(15,20,16,22);room(14,10,24,20);room(17,4,22,10);room(5,5,12,12);room(10,8,15,9);
  for(const[x,y]of[[3,20],[9,26],[14,10],[24,20],[5,5],[12,12]])put(m3,{k:'tc',x,y});for(const[x,y,c]of[[6,22,'2'],[16,12,'1'],[22,18,'2'],[7,10,'8'],[20,15,'u'],[4,25,'{']])D(m3,x,y,c);
  m3.sp=[5,24];put(m3,{k:'po',x:4,y:26,st:'up',to:m2.id,n:'Uscita: Bosco'});const po2=put(m2,{k:'po',x:31,y:6,st:'dun',to:m3.id,n:'Grotta del Re Slime'});
  for(const[x,y,t]of[[12,22,'slime'],[16,14,'slime'],[22,12,'slime'],[8,8,'pipistrello'],[18,18,'ratto']])put(m3,{k:'en',x,y,t,lv:0,boss:0,resp:0,acts:[],cond:[]});
  const boss=put(m3,{k:'en',x:19,y:6,t:'slime',n:'Re degli Slime',lv:5,boss:1,hp:3,at:1.4,resp:0,drop:iChiave,acts:[{a:'banner',ti:'Il Re è caduto!',sub:'La Chiave del faro brilla nella gelatina'},{a:'shake'}],cond:[]});
  put(m3,{k:'ch',x:8,y:6,rich:1,g:120,rnd:1,items:[{item:iLama,n:1}],acts:[]});put(m3,{k:'light',x:20,y:8,col:'#7aff7a',r:200});
  put(m3,{k:'trig',x:14,y:10,w:11,h:3,on:'enter',once:1,n:'Sala del trono',cond:[],acts:[{a:'cine',c:'BOSSCINE'}]});
  // missioni
  const q=(o)=>{const d=edFixQuest(Object.assign({id:edUid('q')},o));w.quests[d.id]=d;return d.id};
  const q1=q({ti:'Slime nell\'orto',tx:'Gli slime del Bosco dei Sussurri vengono a mangiarsi i cavoli dell\'orto ogni notte. Sconfiggine 5, ti prego!',giver:nSind,steps:[{k:'kill',t:'slime',n:5,map:m2.id}],rew:{g:60,x:60,items:[],acts:[]},done:'Il mio orto ti ringrazia. Anche i cavoli.',wait:'Gli slime sono nel bosco, a est. Sono appiccicosi, ma non mordono. Molto.'});
  const q2=q({ti:'La pastorella perduta',tx:'La mia amica Gemma è andata nel bosco a cercare la sua pecora e non è più tornata... Me la ritrovi? Ti regalo i miei fiori più belli!',giver:nLilla,steps:[{k:'talk',npc:nGemma,tx:'Trova Gemma nel Bosco dei Sussurri'}],rew:{g:20,x:50,items:[{item:iPane,n:2}],acts:[{a:'var',v:vGemma,op:'set',n:1},{a:'var',v:vLilla,op:'set',n:1}]},done:'Gemma è a casa! Grazie grazie grazie!'});
  const q3=q({ti:'La chiave del faro',tx:'Il Re degli Slime si è preso la chiave del faro e se l\'è portata nella sua grotta, in fondo al bosco. Senza il faro la valle resta al buio. Riportamela.',giver:nSind,steps:[{k:'collect',item:iChiave,n:1,tx:'Strappa la Chiave del faro al Re degli Slime (grotta nel bosco)'}],
    req:[{c:'quest',q:q1,st:'done'}],rew:{g:250,x:200,items:[],acts:[{a:'cine',c:'ENDCINE'},{a:'end',ti:'Il faro è acceso!',tx:'Il faro di Pratofiorito torna a brillare sulla valle. Gli slime, offesi, si trasferiscono in un\'altra valle. Lilla ti regala un disegno: sei tu, con una spada enorme e un sorriso ancora più grande.'}]},done:'La chiave! Andiamo subito ad accendere il faro!'});
  // dialoghi
  const N=w.npcs;N[nSind].dlg={start:'a',nodes:{a:{tx:'Benvenuto a Pratofiorito, viandante. Di solito è un posto tranquillo, ma ultimamente...',opts:[{tx:'Che cosa succede?',go:'b',cond:[],acts:[]},{tx:'Avete un letto per la notte?',go:'c',cond:[],acts:[]}]},
    b:{tx:'Gli slime! Dal bosco a est. E come se non bastasse il loro Re ha rubato la chiave del faro. Se mi dai una mano, saprò ricompensarti.',opts:[]},c:{tx:'Nel Municipio, dietro di me, c\'è un letto per chi aiuta il villaggio. Dormire ti rimette in forze, e se cadi in battaglia ti risvegli lì.',opts:[]}}};
  N[nLilla].dlg={start:'a',nodes:{a:{tx:'Ciao! Io sono Lilla. Ho sei anni e tre quarti.',cond:[{c:'var',v:vLilla,op:'<',n:1}],alt:'z',opts:[{tx:'Che bei fiori!',go:'b',cond:[],acts:[]}]},b:{tx:'Sono per Gemma. Quando torna.',opts:[]},
    z:{tx:'Gemma mi ha raccontato tutto! Hai visto la pecora? Si chiama Nuvola!',opts:[{tx:'(Le fai una carezza sulla testa)',go:'',cond:[],acts:[{a:'msg',tx:'Lilla ride.'}]}]}}};
  N[nGemma].dlg={start:'a',nodes:{a:{tx:'Oh! Meno male, una persona! Mi sono persa cercando Nuvola... L\'hai vista? È una pecora. Bianca. Pelosa.',cond:[{c:'var',v:vGemma,op:'<',n:1}],alt:'h',opts:[{tx:'Lilla ti sta cercando.',go:'b',cond:[],acts:[]},{tx:'Torna al villaggio, ti accompagno.',go:'b',cond:[],acts:[]}]},
    b:{tx:'Lilla! Che cara. Va bene, torno a casa: Nuvola saprà ritrovare la strada da sola, è più furba di me. Prendi questa, l\'avevo scritta per lei.',opts:[{tx:'(Prendi la lettera)',go:'',cond:[],acts:[{a:'give',item:iLettera,n:1},{a:'msg',tx:'Gemma corre verso il villaggio.'}]}]},
    h:{tx:'Nuvola è tornata da sola, come ti dicevo! Grazie per avermi riportata a casa.',opts:[]}}};
  N[nGuardia].dlg={start:'a',nodes:{a:{tx:'Alt! Ah, sei tu. Il bosco è pieno di slime: tieni d\'occhio la vita e porta qualche pozione.',opts:[{tx:'Dove trovo le pozioni?',go:'b',cond:[],acts:[]},{tx:'Ci sono pericoli peggiori degli slime?',go:'c',cond:[],acts:[]}]},
    b:{tx:'Da Bartolo, la bottega con il tetto blu. Le pozioni si bevono con Q.',opts:[]},c:{tx:'In fondo al bosco c\'è una grotta. Dicono che dentro viva un Re. Un Re slime. Enorme.',opts:[]}}};
  N[nMerc].dlg={start:'a',nodes:{a:{tx:'Benvenuto da Bartolo! Pozioni, pane e qualche lama. Compro anche la gelatina di slime.',opts:[]}}};
  N[nFabbro].dlg={start:'a',nodes:{a:{tx:'Vuoi che la tua arma tagli di più? Potenziare costa, ma ne vale la pena.',opts:[]}}};
  // cinematiche
  w.cines.INTRO={id:'INTRO',n:'Arrivo a Pratofiorito',bars:1,hud:1,skip:1,steps:[{k:'fade',to:'out',d:.01,wait:0},{k:'cam',x:20,y:12,z:.85,d:.01},{k:'fade',to:'in',d:2},{k:'text',tx:'La Valle di Pratofiorito. Un tempo la notte la illuminava un faro.',wait:0,d:4},
    {k:'cam',x:12,y:15,z:1.45,d:2.5},{k:'say',who:nSind,tx:'Un viandante! Proprio quando serviva. Vieni al Municipio, ti spiego tutto.',wait:1},{k:'emote',who:nLilla,e:'♥',d:1},{k:'camto',who:'hero',z:1,d:1.6}]};
  w.cines.BOSSCINE={id:'BOSSCINE',n:'Il Re degli Slime',bars:1,hud:1,skip:1,steps:[{k:'cam',x:19,y:7,z:1.6,d:1.8},{k:'shake',a:1.4},{k:'sound',s:'ruggito'},{k:'title',ti:'Il Re degli Slime',sub:'Sovrano appiccicoso della grotta',d:2.4},{k:'camto',who:'hero',z:1,d:1}]};
  w.cines.ENDCINE={id:'ENDCINE',n:'Il faro si accende',bars:1,hud:1,skip:1,steps:[{k:'say',who:nSind,tx:'Ce l\'hai fatta! La chiave del faro... è ancora appiccicosa, ma funziona!',wait:1},{k:'fade',to:'out',d:1.2},{k:'sound',s:'campana'},{k:'fade',to:'in',d:1.5}]};
  w.set.intro='INTRO';w.set.obj='Riaccendi il faro di Pratofiorito';w.set.gems=0;w.set.g=40;w.set.pot=3;w.set.time=600;
  // le zone evento e i passaggi vengono collegati agli identificatori veri
  void po1;void po2;void boss;void q2;void q3;return edFixWorld(w)}

/* ---- stile ---- */
(function(){const st=document.createElement('style');st.textContent=`
body.edm #menu{display:none!important}body.edm #ruota,body.edm #bar{display:none!important}
#ed{position:fixed;inset:0;z-index:30;pointer-events:none;font:13px Georgia,serif;color:#e8ecf4}#ed>*{pointer-events:auto}
#ed button{margin:1px;padding:5px 9px}#ed select,#ed input:not([type=checkbox]):not([type=range]):not([type=color]),#ed textarea{font:inherit;background:#0b0e18;color:#e8ecf4;border:1px solid #f5b94266;border-radius:4px;padding:4px 6px;margin:1px;box-sizing:border-box}
#ed textarea{width:100%;resize:vertical}#ed input[type=color]{width:34px;height:24px;padding:0;border:1px solid #f5b94266;background:none;vertical-align:middle}
#ed{--edt:48px}#edtop{position:absolute;left:0;right:0;top:0;min-height:44px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:3px 6px;background:linear-gradient(180deg,#1b2238f2,#121828f2);border-bottom:1px solid #f5b94266;box-sizing:border-box;box-shadow:0 4px 18px #0007}
#edtop .edg{display:inline-flex;align-items:center;gap:1px;padding-left:4px;border-left:1px solid #ffffff1a}#edtop button{padding:4px 7px;font-size:13px}#edtop .edw{background:transparent;border-color:transparent;font-size:15px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#edtop .edw b{color:#f5b942}
#edtop #edmap{max-width:180px}#edtop .edplay{background:#2f7a3a;border-color:#7aff8a}#edtop .edwins button{font-size:12px;padding:4px 6px}
#edleft{position:absolute;left:0;top:var(--edt);bottom:26px;width:50px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 0;background:#121828ee;border-right:1px solid #f5b94244;overflow-y:auto;scrollbar-width:none}
#edleft button{width:40px;height:38px;padding:0;font-size:19px;line-height:1;border-radius:8px;background:#1f2740;border-color:#ffffff22}#edleft button.on{background:#7a5a1e;border-color:#f5b942;box-shadow:0 0 0 2px #f5b94255}#edleft hr{width:70%;border:0;border-top:1px solid #ffffff22;margin:4px 0}
#edside{position:absolute;right:0;top:var(--edt);bottom:26px;width:310px;overflow-y:auto;padding:6px 10px 10px;background:#121828f0;border-left:1px solid #f5b94244;box-sizing:border-box}
#edside h4{margin:6px 0;color:#f5b942;font-size:16px}#edside h5,#edwin h5{margin:10px 0 4px;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#f5b942}#edwin h6{margin:8px 0 2px;font-size:12px;color:#c8cede}
#edside .mu,#edwin .mu{color:#9aa4b8;font-size:12px;line-height:1.4}#edside kbd{font:11px monospace;background:#0006;padding:0 4px;border-radius:3px}
.edrow{display:flex;align-items:center;justify-content:space-between;gap:6px;margin:5px 0;flex-wrap:wrap}.edrow>span:first-child{color:#c8cede}
#ed .seg button{padding:3px 8px;margin:0 1px}#ed .seg button.on,.edtabs button.on{background:#7a5a1e;border-color:#f5b942}
.edtabs{display:flex;flex-wrap:wrap;gap:2px;margin:6px 0}.edtabs button{padding:3px 8px!important;font-size:12px}
.edsw{display:inline-flex;flex-direction:column;align-items:center;width:88px;height:96px;vertical-align:top;padding:2px!important;background:#1a2036!important;border:2px solid #ffffff14!important;border-radius:8px;overflow:hidden}
.edsw.tall{height:112px}.edsw img{width:64px;height:72px;object-fit:contain;image-rendering:auto}.edsw.tall img{height:88px}.edsw small{font-size:10px;line-height:1.15;color:#c8cede;text-align:center}.edsw.on{border-color:#f5b942!important;background:#3a3020!important}
.edlist{display:flex;flex-direction:column;gap:2px;margin:6px 0}.edli{display:flex!important;align-items:center;gap:8px;text-align:left;background:#1a2036!important;border:1px solid #ffffff14!important;border-radius:7px;padding:3px 6px!important}
.edli.on{border-color:#f5b942!important;background:#3a3020!important}.edli img{width:40px;height:46px;object-fit:contain;flex-shrink:0}.edli b{display:block;font-size:13px}.edli small{display:block;font-size:11px;color:#9aa4b8}.edic{font-size:24px;width:40px;text-align:center;flex-shrink:0}
.edselbox{border:1px solid #f5b94266;border-radius:8px;padding:2px 8px 6px;margin:2px 0 10px;background:#f5b9420d}.edmini{margin-top:10px;text-align:center}.edmini canvas{width:150px;height:150px;border:1px solid #f5b94255;border-radius:4px;image-rendering:pixelated;background:#000;cursor:crosshair}
#edstat{position:absolute;left:50px;right:310px;bottom:0;height:26px;line-height:26px;padding:0 10px;font-size:12px;background:#0b0e18e6;border-top:1px solid #f5b94233;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#edstat i{color:#ffd84a}
#edwin{position:fixed!important;inset:0;z-index:40;background:#05070fb0;display:flex;align-items:center;justify-content:center}#edwin[hidden]{display:none}
.edwb{width:min(760px,96vw);max-height:92vh;display:flex;flex-direction:column;background:#1b2030;border:2px solid #f5b942;border-radius:10px;box-shadow:0 20px 60px #000c;overflow:hidden;color:#e8ecf4}#edwin.wide .edwb{width:min(1100px,97vw);height:min(760px,92vh)}
.edwh{display:flex;align-items:center;justify-content:space-between;padding:6px 10px 6px 16px;border-bottom:1px solid #f5b94244;background:#00000022}.edwh b{font-size:18px;color:#f5b942}.edx{background:transparent!important;border:none!important;font-size:18px}
.edwc{flex:1;overflow:auto;padding:10px 16px 16px}#edwin.wide .edwc{overflow:hidden;padding:0}
.edsplit{display:flex;height:100%;min-height:0}.edcol{width:230px;flex-shrink:0;padding:8px;border-right:1px solid #f5b94233;overflow-y:auto;background:#0000001a}.edmain{flex:1;min-width:0;overflow-y:auto;padding:10px 16px 20px}
.edbig{font-size:18px!important;font-weight:bold;flex:1;min-width:160px}.edsm{width:150px}
.edform{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 14px;margin:6px 0}.edform label{display:flex;flex-direction:column;gap:2px;font-size:12px;color:#c8cede}.edform label.wide{grid-column:1/-1}.edl{display:flex;flex-direction:column;gap:2px;font-size:12px;color:#c8cede;margin:6px 0}
.edcl{display:flex;flex-direction:column;gap:3px;margin:4px 0}.edcr{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:4px 6px;background:#0000002a;border:1px solid #ffffff12;border-radius:6px}.edcr textarea{flex:1 1 100%}
.edcr input:not([type]),.edcr input[type=number]{width:auto;max-width:180px}.edcr input[type=number]{width:70px}.edn{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#f5b942;color:#1b1408;font:bold 11px system-ui,sans-serif;flex-shrink:0}
.edmv{margin-left:auto;display:inline-flex}.edmv button{padding:1px 6px!important}.edadd{align-self:flex-start;font-size:12px;background:#24304e!important}
.ednode{border:1px solid #f5b94255;border-left:4px solid #f5b942;border-radius:8px;padding:6px 10px;margin:8px 0;background:#f5b9420a}.edopt{margin:6px 0 6px 14px;padding:4px 8px;border-left:2px solid #ffffff22}.edopt details summary{cursor:pointer;font-size:12px;color:#9aa4b8}
.edtag{font-size:11px;background:#2f7a3a;color:#fff;border-radius:8px;padding:1px 7px}
.edcards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin-top:8px}.edcard{border:1px solid #ffffff22;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:4px;background:#0000002a}.edcard.on{border-color:#f5b942}.edcard small{color:#9aa4b8}
.edlook{display:grid;grid-template-columns:200px 1fr;gap:14px}.edpv{text-align:center}.edpv canvas{width:180px;height:210px;background:radial-gradient(circle at 50% 60%,#3a4870,#141826);border-radius:8px;border:1px solid #f5b94255}
.edchk{display:flex;flex-wrap:wrap;gap:4px 10px}.edchk label{font-size:12px;white-space:nowrap}.edxs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:2px 8px;font-size:12px}.edxs label{display:flex;align-items:center;gap:4px}
#ed .sw{width:22px;height:22px;padding:0!important;border-radius:50%;border:2px solid #0008}#ed .sw.on{outline:3px solid #fff}
.edicn{width:42px;height:42px;vertical-align:middle;background:radial-gradient(circle,#2c3554,#141826);border-radius:6px}
.edroll{overflow-x:auto;border:1px solid #f5b94244;border-radius:6px;background:#0b0e18;padding:0 0 4px;max-width:100%}.edchd{display:flex;white-space:nowrap}.edchd select{font-size:11px!important;padding:1px!important;margin:0!important;border-radius:0!important;box-sizing:border-box}#edpr{display:block;cursor:crosshair;touch-action:none}
.eddr .edrow{margin:1px 0;flex-wrap:nowrap}.eddn{width:110px;font-size:12px}.edst{width:20px;height:20px;padding:0!important;margin:0 1px!important;background:#1a2036!important;border-color:#ffffff22!important}.edst.b4{border-left:2px solid #f5b94288!important}.edst.on{background:#f5b942!important}
.edhelp li{margin:4px 0;line-height:1.45}.edck.err{border-color:#e5484f88}.edck.warn{border-color:#ffd84a66}.edck.info{border-color:#5ab0ff55}
#edtoast{position:fixed;left:50%;bottom:44px;transform:translateX(-50%) translateY(20px);z-index:60;background:#1b2238;border:1px solid #f5b942;color:#fff;padding:8px 16px;border-radius:8px;box-shadow:0 8px 24px #000a;opacity:0;pointer-events:none;transition:.25s;font:14px Georgia,serif}#edtoast.on{opacity:1;transform:translateX(-50%)}#edtoast.err{border-color:#e55;background:#3a1a20}
#edback{position:fixed;left:50%;top:calc(46px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:24;display:none}#edback button{background:#2a3350e6;border-color:#f5b942;font:600 14px Georgia,serif;padding:6px 14px;box-shadow:0 4px 14px #0008}
body:not(.ig) #edback{display:none!important}body.abin #edback{opacity:0;pointer-events:none}
#edend{position:fixed;inset:0;z-index:72;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#0a0e1e99,#000d);animation:vxin .5s ease-out}
.edeb{max-width:min(620px,92vw);text-align:center;background:linear-gradient(180deg,#1b2238,#0e1222);border:2px solid #f5b942;border-radius:14px;padding:20px 26px;color:#f2ead6;box-shadow:0 20px 70px #000}.edeb h2{font:700 40px Georgia,serif;color:#ffd84a;margin:4px 0 10px;text-shadow:3px 3px 0 #8a3b12}.edeb p{font:16px/1.6 Georgia,serif}
.edeb.fail h2{color:#ff6a5a}.edes{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:10px 0}.edes span{background:#0006;border:1px solid #f5b94255;border-radius:16px;padding:4px 12px}
#edcin{position:fixed;inset:0;z-index:57;pointer-events:none;display:none}#edcin .edbar{position:absolute;left:0;right:0;height:0;background:#000;transition:height .5s ease}#edcin .edbar.t{top:0}#edcin .edbar.b{bottom:0}#edcin.bars .edbar{height:9vh}
body.edcine #hud,body.edcine #ruota,body.edcine #bar,body.edcine #qt,body.edcine #chw,body.edcine #clk,body.edcine #mm,body.edcine #zn,body.edcine #msg,body.edcine #edback,body.edcine #fps{opacity:0!important;pointer-events:none!important;transition:opacity .4s}#edcfade{position:absolute;inset:0;background:#000;opacity:0}#edcin #edcskip{position:absolute;right:18px;bottom:calc(14px + env(safe-area-inset-bottom,0px));pointer-events:auto;font:600 14px Georgia,serif;padding:6px 14px;background:#0a1020cc;border-color:#f5b942}
#edctxt{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:min(780px,88vw);text-align:center;font:italic 26px/1.5 Georgia,serif;color:#f4ecd8;text-shadow:0 2px 14px #000,0 0 2px #000;opacity:0;transition:opacity .6s;pointer-events:auto;cursor:pointer}#edctxt.on{opacity:1}
#edcsub{position:absolute;left:50%;bottom:calc(10vh + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(820px,94vw);display:flex;gap:14px;align-items:center;background:linear-gradient(180deg,#141a2cf2,#0a0e1cf2);border:2px solid #f5b942;border-radius:12px;padding:10px 16px 10px 10px;pointer-events:auto;cursor:pointer;box-shadow:0 14px 50px #000c}
#edcsub[hidden]{display:none}#edcsub.nar .edcp{display:none}.edcp{flex:0 0 96px;height:110px;border-radius:8px;background:radial-gradient(circle at 50% 38%,#4a5a88,#1a2034 72%);overflow:hidden;border:1px solid #f5b94288}.edcp canvas{width:96px;height:110px}
.edcb{flex:1}.edcb b{font:700 19px Georgia,serif;color:#f5b942}.edcb p{font:17px/1.55 Georgia,serif;margin:4px 0;min-height:2.6em;color:#f2ead6}.edcb small{opacity:.55;font-size:11px}
#msel .mode.parco{border-color:#4cd07a;background:linear-gradient(160deg,rgba(20,70,40,.8),rgba(40,30,70,.8))}#msel .mode i.nw{background:#4cd07a;color:#0b1a10}
#mparco .dcard{min-height:96px}.edmg{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))!important}.ednew{border-left-color:#4cd07a!important}.edimp{cursor:pointer;position:relative}.edimp input{position:absolute;inset:0;opacity:0;cursor:pointer}
.edmh{margin:14px 0 6px;color:#f5b942;letter-spacing:1px;text-transform:uppercase;font-size:13px}.edwl{display:flex;flex-direction:column;gap:6px}.edwc2{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;background:rgba(10,14,30,.7);border:1px solid #f5b94244;border-radius:8px;padding:8px 12px}
.edwc2 b{display:block;font-size:16px;color:#f5d08a}.edwc2 small{display:block;opacity:.85;margin:2px 0}.edwc2 .mu{font-size:11px}.ednw label{display:flex;flex-direction:column;gap:3px;margin:8px 0;font-size:12px}.ednw select{font:inherit;background:#0007;color:#fff;border:1px solid #f5b94288;padding:6px;border-radius:3px}
@media(max-width:820px){#edside{top:auto;bottom:0;left:0;width:auto;height:40vh;border-left:0;border-top:1px solid #f5b94255}#edleft{bottom:40vh}#edstat{display:none}.edlook{grid-template-columns:1fr}.edsplit{flex-direction:column}.edcol{width:auto;max-height:34%;border-right:0;border-bottom:1px solid #f5b94233}#edtop .edwins button{padding:4px 6px}#edtop{font-size:12px}}`;document.head.appendChild(st)})();

/* ================= 7.6: VOXELIA STUDIO — tutti gli asset del gioco nell'editor =================
   Terreni, strade e pavimenti di ogni luogo del gioco, i muri dei dungeon e delle mura della città, le gradinate
   del Colosseo, gli oggetti speciali delle stanze segrete, le reti del porto, le conchiglie, le musiche dei viaggi
   nel tempo e i personaggi del gioco da mettere direttamente nelle mappe.
   L'ordine degli elenchi non cambia mai: le mappe salvate ricordano la posizione del terreno e del muro. */
const EZFO=[["Colosseo di Aldoria", "#d8c08a", "#cfb680"], ["Aldoria Nord · Quartiere Nobile", "#7fa35e", "#7a9c5a"], ["Aldoria Est · Campi e Mestieri", "#86a64e", "#7f9e4a"], ["Borgo delle Ceneri · periferia di Aldoria Vecchia", "#5e6a48", "#586444"], ["Porto di Aldoria", "#8aa060", "#839a5c"], ["La Cabina · interno", "#1a2a4a", "#1e3052"], ["Dusty Creek · 1878", "#c8a870", "#c0a068"], ["Londra · 1888", "#5a6a5a", "#546454"], ["Parigi · 1789", "#8a8a70", "#82826a"], ["Il fronte · 1917", "#5a4a3a", "#54442f"], ["La Vedova Nera · stiva", "#5a3a22", "#52341e"], ["Il sogno", "#3a2420", "#2e1c18"], ["Aldoria Vecchia", "#5a6448", "#545e44"], ["Il culto", "#2e2a2a", "#282424"], ["La stanza dell'Occhio", "#2a2422", "#262020"], ["Battaglia · Il Guado dei Salici", "#7aa04a", "#74994a"], ["Battaglia · Il Colle dei Corvi", "#6a7a52", "#64744c"], ["Battaglia · L'assedio del Forte Nero", "#8a8a5a", "#828254"]],EZFR=[["Aldoria Nord · Quartiere Nobile", "#dcd6c8", "#d2ccbe"], ["Aldoria Est · Campi e Mestieri", "#a8916a", "#9e8862"], ["Borgo delle Ceneri · periferia di Aldoria Vecchia", "#7e7a70", "#76726a"], ["Porto di Aldoria", "#aaa294", "#a0988a"], ["La Cabina · interno", "#2a3a6a", "#24345e"], ["Dusty Creek · 1878", "#b89060", "#ae8858"], ["Londra · 1888", "#6a6a72", "#62626a"], ["Parigi · 1789", "#a09a8a", "#969080"], ["Il fronte · 1917", "#3a3024", "#342a20"], ["Aldoria Vecchia", "#7a7468", "#706a60"]],EZFI=[["Biblioteca Arcana", "#7a5a3a", "#725436"], ["Taverna del Drago Ubriaco", "#8a6a42", "#82643e"], ["Fucina di Borin", "#6a6a6a", "#646464"], ["Bottega dell'Erborista", "#6a7a5a", "#647456"], ["Casa abbandonata", "#7a6a52", "#72644e"], ["Casa di Gerald", "#8a7252", "#826c4e"], ["Palazzo del Conte", "#c8b898", "#beae8e"], ["Banca di Aldoria", "#a8a49a", "#9e9a90"], ["Segheria di Ettore", "#9a7a4a", "#8e7044"], ["Cappella in rovina", "#6a6a64", "#62625c"], ["Capitaneria di Porto", "#7a6a5a", "#726254"], ["Villa Smeraldo", "#8a9a7a", "#829272"], ["Villa Iris", "#b8a8c8", "#ae9ebe"], ["Villa Rossa", "#a87a6a", "#9e7062"], ["Villa Ponente", "#8aa0b0", "#8096a6"], ["Villa Grigia", "#9a9a9a", "#909090"], ["Teatro dell'Opera", "#7a2a2a", "#702424"], ["Mulino di Pietro", "#9a8a6a", "#908062"], ["Casa di Nonno Marino", "#8a8a7a", "#828272"], ["Casa degli Sposi", "#a89a7a", "#9e9072"], ["Deposito delle Merci", "#6a5a4a", "#625244"], ["Pescheria del Porto", "#a8b0b4", "#9ea6aa"], ["Faro di Aldoria", "#8a8a8a", "#808080"], ["La Rondine · stiva", "#6a4a2a", "#604426"], ["Motel della Rosa dei Venti", "#8a5a4a", "#805244"], ["Motel · primo piano", "#7a4a3a", "#704436"], ["Stanza 1 del Motel", "#8a6a4a", "#806244"], ["Panetteria di Gemma", "#c8a878", "#be9e70"], ["Sartoria di Ottavia", "#a88a9a", "#9e8090"], ["Caserma della Guardia", "#7a7a7a", "#727272"], ["Osservatorio", "#3a3a5a", "#343454"], ["Municipio di Aldoria", "#b8a888", "#ae9e80"], ["Castello · Prigioni", "#4a4a52", "#44444c"], ["Castello · Cucine", "#8a7a62", "#82725c"], ["Castello · Appartamenti Reali", "#6a3a3a", "#623434"], ["Caserma · dormitorio", "#8a8a80", "#828278"], ["Casinò · sala privata", "#4a0a1a", "#420816"], ["Osservatorio · cupola", "#2a3048", "#262c42"]],EZW=[["Aldoria Nord · Quartiere Nobile", "#e4ded2", 30, 0], ["Aldoria Est · Campi e Mestieri", "#7a5a3a", 18, 0], ["Borgo delle Ceneri · periferia di Aldoria Vecchia", "#6a6a70", 22, 1], ["Porto di Aldoria", "#8b8f99", 26, 0], ["La Vedova Nera · Arrembaggio", "#5a3a22", 14, 0], ["La Cabina · interno", "#2a4a8a", 44, 0], ["Dusty Creek · 1878", "#8a6a4a", 14, 0], ["Londra · 1888", "#5a3a32", 30, 0], ["Parigi · 1789", "#9a8a70", 24, 0], ["Il fronte · 1917", "#4a3a2a", 16, 0], ["La Vedova Nera · stiva", "#3a2414", 34, 0], ["Il sogno", "#2a1814", 40, 0], ["Aldoria Vecchia", "#5a5a60", 24, 1], ["Il culto", "#1e1a1a", 36, 0], ["La stanza dell'Occhio", "#1a1414", 44, 0], ["Prigioni del castello · una cella", "#3a3a42", 34, 0], ["In barca · Scogliera dei Gabbiani", "#3a3a44", 6, 0], ["In barca · Grotta Marina", "#2a2a32", 70, 0], ["Battaglia · Il Guado dei Salici", "#5a6a3a", 10, 0]];
const EPROPN=[['b','Bacheca degli avvisi'],['d','Lavagna dei lavori'],['v','Vaso con piantina'],['l','Lumino votivo'],['k','Libro che fluttua'],['B','Libro chiuso',1],['N','Foglio a terra',1],['X','Scatolina'],
  ['c','Scrigno dorato'],['C','Scrigno dorato aperto'],['a','Forziere aperto'],['A','Forziere prezioso aperto'],['s','Scrigno segreto'],['g','Piedistallo con gemma'],['r','Reliquia antica'],['R','Reliquia azzurra'],
  ['f','Frammento di stella'],['h','Cuore della Corona'],['i','Indizio luminoso',1],['t','Botola chiusa',1],['P','Grande portale scuro'],['Q','Portale sigillato'],['m','Console della Cabina'],['o','Figura d\'ombra']];
(function(){
  const green=a=>{const v=parseInt(a.slice(1),16),r=v>>16,g2=v>>8&255,b=v&255;return g2>r+6&&g2>b+6};
  EZFO.forEach(([n,a,b],i)=>EMAT.push({id:'zo'+i,n:'Terreno · '+n,a,b,v:.15,d:green(a)?'tuft':'peb',k:'Luoghi del gioco'}));
  EZFR.forEach(([n,a,b],i)=>EMAT.push({id:'zr'+i,n:'Strada · '+n,a,b,v:.12,road:1,d:'cobble',k:'Strade del gioco'}));
  EZFI.forEach(([n,a,b],i)=>EMAT.push({id:'zi'+i,n:'Pavimento · '+n,a,b,v:.08,k:'Interni del gioco'}));
  for(const[id,n,a,b,d]of[['dg_pyr','Piramide di Khem','#c9a860','#bf9f58','crack'],['dg_fire','Fucina Infernale','#5a3a32','#523530','ember'],['dg_sea','Abisso Sommerso','#3f6a6a','#3a6262','peb']])EMAT.push({id,n:'Dungeon · '+n,a,b,v:.14,d,k:'Grotte'});
  EMAT.forEach((m,i)=>EMATI[m.id]=i);
  // muri: i dungeon con i loro ornamenti, le mura di ogni luogo, la torre e le gradinate
  for(const w of EWAL)w.k=w.k||'Classici';
  for(const[th,n,c]of[['cave','Tana dei Goblin','#4a3c30'],['crypt','Cripta Dimenticata','#3a3d4a'],['pyr','Piramide di Khem','#8f7a48'],['ice','Caverne di Cristallo','#6f9ab8'],['fire','Fucina Infernale','#3a2420'],['sea','Abisso Sommerso','#24464a'],['void','Cittadella del Vuoto','#211a30']])
    EWAL.push({id:'th_'+th,n:'Muro · '+n,c,tint:1,k:'Dungeon del gioco',f:(x,y,h,c2)=>{box(x,y,0,1,1,36+h*10,c2,.95+h*.1);if(h>.85)box(x+.97,y+.3,14,.05,.4,10,c2,.7);wallOrn(x,y,h,{th,o:c2})}});
  EZW.forEach(([n,c,wh,ru],i)=>EWAL.push({id:'zw'+i,n:'Mura · '+n,c,tint:1,k:'Luoghi del gioco',f:ru?(x,y,h,c2)=>{const r=h>.3?8+h*24:4;box(x,y,0,1,1,r,c2,.8+h*.15);if(h>.6)box(x+.2,y+.2,r,.5,.5,4,c2,.7)}
    :(x,y,h,c2)=>{box(x,y,0,1,1,wh,c2,.9+h*.1);if((x+y)%2===0)box(x+.2,y+.2,wh,.6,.6,5,c2,.95)}}));
  EWAL.push({id:'torre',n:'Torre delle mura',c:'#7b7f89',tint:1,k:'Speciali',f:(x,y,h,c)=>{box(x-.1,y-.1,0,1.2,1.2,46,c);box(x-.15,y-.15,46,1.3,1.3,5,shx(c,.87));if(h>.5)box(x+.4,y+1.08,24,.2,.04,9,'#1a1a22')}},
    {id:'tribuna',n:'Gradinata con spettatori',c:'#c8b890',tint:1,k:'Speciali',f:(x,y,h,c)=>{const ht=8+((x*7+y*3)%4)*7;box(x,y,0,1,1,ht,c,.85+h*.1);if(h>.35){const bb=Math.abs(Math.sin(t*5+x*1.7+y*2.3))*3;box(x+.3,y+.3,ht,.4,.4,7,['#c0392b','#2980b9','#27ae60','#8e44ad','#f39c12'][(h*50|0)%5]);box(x+.33,y+.33,ht+7+bb,.34,.34,6,SKIN)}}},
    {id:'cancellata',n:'Cancellata di ferro',c:'#3a3a42',tint:1,k:'Speciali',f:(x,y,h,c)=>{for(let i=0;i<4;i++){box(x+.1+i*.25,y+.45,0,.06,.06,26,c);box(x+.1+i*.25,y+.45,26,.06,.06,3,'#d4af37')}box(x,y+.44,22,1,.08,2,c);box(x,y+.44,6,1,.08,2,c)}},
    {id:'staccionata',n:'Staccionata alta',c:'#8a6a42',tint:1,k:'Speciali',f:(x,y,h,c)=>{box(x+.1,y+.45,0,.1,.1,16,c);box(x+.8,y+.45,0,.1,.1,16,c);box(x,y+.46,6,1,.08,3,shx(c,1.1));box(x,y+.46,12,1,.08,3,shx(c,1.1))}});
  EWAL.forEach((w,i)=>EWALI[w.id]=i);
  // arredi che mancavano e gli oggetti speciali delle stanze del gioco
  EDEC.push({k:'Porto',c:'Ф',n:'Reti stese ad asciugare',walk:false,water:false});
  for(const[c,n,walk]of EPROPN)EDEC.push({k:'Oggetti speciali',c:'¿'+c,n,walk:!!walk,water:false});
  for(const d of EDEC)EDECI[d.c]=d;for(const d of EDEC)if(!EDECK.includes(d.k))EDECK.push(d.k);
  Object.assign(ETRKN,{dimintro:'Viaggio nel tempo',dimend:'Ritorno dal viaggio'});ERES.conchiglia='Conchiglie';
})();
// gli oggetti speciali: gli stessi modelli che il gioco usa per bacheche, scrigni, reliquie, portali e segreti
function EPROPF(c,x,y){const u=Math.sin(t*3+x*1.7)*3;switch(c){
  case 'b':return[[-.4,-.05,0,.08,.08,30,'#5a4a3a'],[.32,-.05,0,.08,.08,30,'#5a4a3a'],[-.45,-.06,14,.9,.06,18,'#8a6a42'],[-.38,-.02,16,.2,.02,6,'#f4f0e0'],[-.1,-.02,18,.24,.02,8,'#f4f0e0'],[.18,-.02,15,.18,.02,7,'#f4f0e0']];
  case 'v':return VASOL();case 'l':return[[-.2,-.2,0,.4,.4,10,'#6a4a2a'],[-.05,-.05,10,.1,.1,6,'#f4f0e0'],[-.03,-.03,16,.06,.06,3,'#ffcc33',1.3]];
  case 'k':return[[-.2,-.08,8+u,.4,.16,3,'#f4e8c8'],[-.24,-.1,8+u,.06,.2,4,'#a0703a'],[.18,-.1,8+u,.06,.2,4,'#a0703a']];
  case 'f':{const r=t%6.28,L=[[-.12,-.12,12+u,.24,.24,18,'#ffd84a',1.2],[-.06,-.06,30+u,.12,.12,6,'#fff6c0',1.3],[-.2,-.04,18+u,.4,.08,6,'#ffcc33',1.2]];if(r>3)L.push([-.04,-.2,18+u,.08,.4,6,'#ffcc33',1.2]);return L}
  case 'h':return SH7L();case 'o':return FIGL();case 'c':return C100L({});case 'C':return C100L({o:1});case 'r':return RELL({px:x+.5});case 'R':return RELL({px:x+.5,c:'#7ad0ff'});
  case 't':return BOTL();case 'P':return PORTL();case 'Q':return PORTCL();case 'm':return consoleL();
  case 'i':return[[-.08,-.08,4+Math.sin(t*3+x)*2,.16,.16,6,'#fff2a0',1.4],[-.14,-.14,1,.28,.28,1,'#ffe08a',1.2]];
  case 's':return[[-.35,-.25,0,.7,.5,12,'#5a2a6a'],[-.37,-.27,12,.74,.54,4,'#d4af37'],[-.08,.25,6,.16,.03,5,'#d4af37']];
  case 'a':return[[-.3,-.22,0,.6,.44,9,'#8a5a2a'],[-.32,-.24,9,.64,.48,1,'#3a2410'],[-.3,-.26,9,.6,.06,12,'#f5c342'],[-.18,-.12,10,.36,.24,2,'#fff2a0',1.2]];
  case 'A':return[[-.3,-.22,0,.6,.44,9,'#5a2a8a'],[-.32,-.24,9,.64,.48,1,'#3a2410'],[-.3,-.26,9,.6,.06,12,'#f5c342']];
  case 'B':return SECL.book;case 'N':return SECL.note;case 'X':return SECL.box;
  case 'g':return[[-.12,-.1,0,.24,.2,6,'#8a6a3a'],[-.07,-.06,6,.14,.12,3,'#6a4a2a'],[-.15,-.15,12+Math.sin(t*4)*3,.3,.3,10,'#c88aff']];
  case 'd':return[[-.4,-.05,0,.08,.08,30,'#5a4a3a'],[.32,-.05,0,.08,.08,30,'#5a4a3a'],[-.45,-.06,14,.9,.06,18,'#2a4a3a'],[-.3,-.02,18,.6,.02,10,'#e8e4d8']]}return null}
const _dec76=dec;dec=function(x,y,c,h){if(c&&c.length===2&&c[0]==='¿'){const L=EPROPF(c[1],x,y);if(L&&L.length)drawLB(L,x+.5,y+.5,0,1);return}_dec76(x,y,c,h)};
// i personaggi del gioco: si copiano nel mondo con nome, aspetto e colori e si mettono subito nella mappa
function edGameNpcs(){return Object.keys(NPS).filter(k=>!k.startsWith('edn_')&&NPCS[k]&&NPCS[k].n&&NPCS[k].n!=='???').sort((a,b)=>NPCS[a].n.localeCompare(NPCS[b].n))}
function edNpcFromGame(k){if(!NPCS[k])return null;const ex=Object.values(EW.npcs).find(d=>d.from===k);if(ex)return ex.id;const d=edFixNpc({id:edUid('n'),n:NPCS[k].n,from:k});d.look=edLookFromGame(k);
  const r=NPCS[k].role;if(r&&EDROLE[r]!==undefined)d.role=r;EW.npcs[d.id]=d;edRegNpc(d);edDirty();return d.id}

/* ================= 7.6: VOXELIA STUDIO — icone voxel =================
   Ogni icona è un disegno di 12×12 cubetti: il davanti colorato, lo spessore in ombra verso l'alto a destra e i bordi
   illuminati come i blocchi del gioco. Le emoji dell'interfaccia dell'editor diventano queste icone da sole. */
const EDIP={k:'#262b36',w:'#ffffff',W:'#dfe4ee',g:'#a3adc0',G:'#5f6879',y:'#ffd84a',o:'#f0a83a',O:'#a8701c',r:'#ec4a50',R:'#a42a32',p:'#ff92b4',b:'#58aef8',B:'#2c62c4',c:'#a8f2ff',n:'#a0703c',N:'#623e1e',t:'#dcb47c',e:'#52d07e',E:'#2a8a3c',l:'#b4f27e',v:'#bc92ff',V:'#6c3cb4',s:'#ffd4a4',S:'#c0824a',x:'#3a4050',m:'#ff8a2a'};
const EDICO={"hand":["....k.k.k...","...ksksksk..","...ksksksk..","...ksksksk..",".kkksssssk..","kssksssssk..",".ksssssssk..","..kssssssk..","..kssssssk..","...ksssssk..","...kssssk...","....kkkk...."],"grass":["............","eeeeeeeeeeee","elleeeleelle","eEeeEEeeeEee","EnEEnnEEnEnE","nnnnnnnnnnnn","nnNnnnnnnNnn","nnnnnNnnnnnn","nNnnnnnnNnnn","nnnnnnnNnnnn","nnnNnnnnnnNn","NNNNNNNNNNNN"],"brick":["............","rrrrr.rrrrrr","RRRRR.RRRRRR","RRRRR.RRRRRR","............","rr.rrrrrr.rr","RR.RRRRRR.RR","RR.RRRRRR.RR","............","rrrrr.rrrrrr","RRRRR.RRRRRR","RRRRR.RRRRRR"],"water":["............","..c.....c...",".cbc...cbc..","cbbbcccbbbcc","bbbbbbbbbbbb","bBbbbbbBbbbb","bbbbBbbbbbBb","bbbbbbbbbbbb","bbBbbbbbBbbb","bbbbbbBbbbbb","bbbbbbbbbbbb","BBBBBBBBBBBB"],"void":["............","...VVVVVV...",".VVkkkkkkVV.",".VkkkkvkkkV.","VkkvkkkkkkkV","VkkkkkkkvkkV","VkkkkvkkkkkV","VkvkkkkkkkkV",".VkkkkkkvkV.",".VVkkkkkkVV.","...VVVVVV...","............"],"tree":["....EEEE....","..EEeeeeEE..",".EeelleeeeE.",".Eelleeeeee.","EeeeeeeeleeE","EeeeeleeeeeE",".EeeeeeeeeE.","..EEeeeeEE..","....EnnE....",".....nn.....",".....nN.....","....NnnN...."],"house":[".....RR.....","....RrrR....","...RrrrrR...","..RrrrrrrR..",".RrrrrrrrrR.","RRRRRRRRRRRR",".tttttttttt.",".tccttttcct.",".tccttttcct.",".ttttnntttt.",".ttttnntttt.",".NNNNNNNNNN."],"person":["....kkkk....","...kNNNNk...","...kssssk...","...kskksk...","...kssssk...","..kkbbbbkk..",".kbbbbbbbbk.",".kbkbbbbkbk.",".ksbbbbbbsk.","..kbbbbbbk..","..kNNkkNNk..","..kkk..kkk.."],"monster":[".k........k.",".Wk......kW.",".WWk....kWW.","..kRrrrrRk..",".krrrrrrrrk.",".kryyrryyrk.",".krrrrrrrrk.",".krwkwwkwrk.",".krrrrrrrrk.","..krrrrrrk..","...kkkkkk...","............"],"door":["...gggggg...","..gGGGGGGg..",".gGnnnnnnGg.",".gGnNnnNnGg.",".gGnNnnNnGg.",".gGnnnnnnGg.",".gGnnnnyyGg.",".gGnNnnNnGg.",".gGnNnnNnGg.",".gGnnnnnnGg.",".gGnnnnnnGg.","gggggggggggg"],"flag":[".WW.........",".WWeeeee....",".WWeeeeeee..",".WWeeelleee.",".WWeeeeeee..",".WWeeeee....",".WW.........",".WW.........",".WW.........",".WW.........","gggg........","GGGG........"],"eraser":["............","............","............",".pppppppbbb.",".pppppppbbb.",".pppppppbbb.",".pppppppbbb.",".RRRRRRRBBB.","............","..g..g..g...","............","............"],"drop":[".....bb.....",".....bb.....","....bbbb....","....bbbb....","...bbbbbb...","..bbbbbbbb..",".bbwbbbbbbb.",".bwbbbbbbbb.",".bbbbbbbbbb.",".bbbbbbbbBb.","..bbbbbbBb..","...bbbbbb..."],"dropper":[".........kk.","........kGGk",".......kGGGk","......kGGGk.",".....kWkGk..","....kWWWk...","...kWWWk....","..kbWWk.....",".kbbbk......",".kbbk.......","kbk.........",".b.........."],"area":["yyy..yy..yyy","y..........y","y..........y","............","............","y..........y","y..........y","............","............","y..........y","y..........y","yyy..yy..yyy"],"stamp":["....nnnn....","...nNNNNn...","...nNNNNn...","....nNNn....",".....nn.....",".....nn.....","..gggggggg..",".gGGGGGGGGg.",".gGGGGGGGGg.","..rrrrrrrr..","............",".rr.rrr.rr.."],"grid":["WWWWWWWWWWWW","W...W...W..W","W...W...W..W","W...W...W..W","WWWWWWWWWWWW","W...W...W..W","W...W...W..W","W...W...W..W","WWWWWWWWWWWW","W...W...W..W","W...W...W..W","WWWWWWWWWWWW"],"eye":["............","............","....kkkk....","..kkWWWWkk..",".kWWWbbWWWk.","kWWWbkkbWWWk","kWWWbkkbWWWk",".kWWWbbWWWk.","..kkWWWWkk..","....kkkk....","............","............"],"globe":["....bbbb....","..bbeebbbb..",".bbeeeebbbb.",".beeeeebbeb.","bbeeeebbeeeb","bbbeebbbeeeb","bbbbbbbbbeeb","bbbeebbbbbbb",".bbeeebbbbb.",".bbbeeebbbb.","..bbbbbbbb..","....bbbb...."],"undo":["............","...W........","..WW........",".WWWWWWWW...","WWWWWWWWWW..",".WWW.....WW.","..WW......WW","...W......WW","..........WW",".........WW.","....WWWWWW..","....WWWWW..."],"save":["bbbbbbbbbbb.","bbbgggggbbbb","bbbgGGggbbbb","bbbgGGggbbbb","bbbgggggbbbb","bbbbbbbbbbbb","bbWWWWWWWWbb","bbWggggggWbb","bbWWWWWWWWbb","bbWggggggWbb","bbWWWWWWWWbb","bbbbbbbbbbbb"],"vars":["............","oooooooooooo","o..........o","o.y...y....o","o..y.y..WW.o","o...y......o","o..y.y..WW.o","o.y...y....o","o..........o","oooooooooooo","............","............"],"check":[".bbbbbbbbbb.",".bBBBBBBBBb.",".bBBBBBBBeb.",".bBBBBBBeeb.",".bBeBBBeeBb.",".bBeeBeeBBb.",".bBBeeeBBBb.","..bBBeBBBb..","..bBBBBBBb..","...bBBBBb...","....bBBb....",".....bb....."],"help":["...yyyyyy...","..yyyyyyyy..",".yyy....yyy.",".yy......yy.","........yyy.",".......yyy..",".....yyy....",".....yy.....",".....yy.....","............",".....yy.....",".....yy....."],"close":["............",".WW......WW.",".WWW....WWW.","..WWW..WWW..","...WWWWWW...","....WWWW....","....WWWW....","...WWWWWW...","..WWW..WWW..",".WWW....WWW.",".WW......WW.","............"],"trash":["....gggg....","gggggggggggg","GGGGGGGGGGGG",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.",".gGgGgGgGgG.","..gggggggg.."],"dup":["....WWWWWWWW","....W......W","....W......W","WWWWWWWW...W","WggggggW...W","WggggggW...W","WggggggW...W","WggggggWWWWW","WggggggW....","WggggggW....","WggggggW....","WWWWWWWW...."],"plus":["............","............",".....ee.....",".....ee.....",".....ee.....","..eeeeeeee..","..eeeeeeee..",".....ee.....",".....ee.....",".....ee.....","............","............"],"minus":["............","............","............","............","............","..rrrrrrrr..","..rrrrrrrr..","............","............","............","............","............"],"pencil":[".........pp.","........pppp",".......gggp.","......yyyg..",".....yyyo...","....yyyo....","...yyyo.....","..yyyo......",".tyyo.......",".tto........",".kt.........","............"],"pin":["....rrrr....","...rrrrrr...","..rrwwrrrr..","..rrwrrrrr..","..rrrrrrrr..","...rrrrrr...","....rrrr....",".....RR.....",".....RR.....",".....gg.....",".....gg.....","............"],"fire":[".....r......",".....rr.....","....rrr.....","....rrmr....","...rrmmr..r.","..rrmmmrrrr.",".rrmmymmmrr.",".rmmyyymmmr.",".rmyyyyymmr.",".rmyyWyyymr.","..rmyyyymr..","...rrrrrr..."],"sign":["............","nnnnnnnnnnnn","nttttttttttn","ntNNNNNNtttn","nttttttttttn","ntNNNNNttttn","nttttttttttn","nnnnnnnnnnnn",".....nn.....",".....nn.....",".....nn.....","....NNNN...."],"bulb":["...yyyyyy...","..yyyyyyyy..",".yyywyyyyyy.",".yywyyyyyyy.",".yyyyyyyyyy.",".yyyyyyyyyy.","..yyyyyyyy..","...yyyyyy...","...gggggg...","...GGGGGG...","...gggggg...","....GGGG...."],"bed":["............","............","n...........","nWWW........","nWWWbbbbbbb.","nbbbbbbbbbbn","nBBBBBBBBBBn","nnnnnnnnnnnn","n..........n","n..........n","............","............"],"lever":["........rr..",".......rrrr.",".......rrrr.","........rr..",".......nn...","......nn....",".....nn.....","....nn......",".gggggggggg.","gGGGGGGGGGGg","gGGGGGGGGGGg","gggggggggggg"],"wheat":[".....o......","....ooo.....","...o.o.o....","....ooo.....","...o.o.o....","....ooo.....","...o.o.o....",".....o......",".....e......",".....e......","....ee......",".....e......"],"fish":["............","............","....bbbb....","..bbbbbbbb.b",".bbwkbbbbbbb","bbbbbbbbbbbb",".bbbbbbbbbbb","..bbbbbbbb.b","....bbbb....","............","............","............"],"helmet":["............","...gggggg...","..gWWWWWWg..",".gWWWWWWWWg.",".gWWWWWWWWg.","gggggggggggg","gGGGGGGGGGGg","gWkkkWWkkkWg","gWWWWWWWWWWg",".gWWWWWWWWg.","..gggggggg..","............"],"key":["............","............","..ooo.......",".oyyyo......","oy..yooooooo","oy..yyyyyyyo",".oyyyoooyoyo","..ooo...o.o.","............","............","............","............"],"box":["............","SSSSSSSSSSSS","tttttnnttttt","tttttnnttttt","SSSSSnnSSSSS","tttttttttttt","tttttttttttt","ttWWWWtttttt","ttWggWtttttt","ttWWWWtttttt","tttttttttttt","SSSSSSSSSSSS"],"stall":["rrWWrrWWrrWW","rrWWrrWWrrWW","RR..RR..RR..","n..........n","n..........n","nnnnnnnnnnnn","nyyrreeoobbn","nnnnnnnnnnnn","n..........n","n..........n","n..........n","N..........N"],"palette":["...tttttt...",".tttttttttt.","ttrrttbbtttt","ttrrttbbtttt","tyyttttteett","tyytt..tteet","ttttt..ttttt","tvvttttttttt","tvvtttttttt.",".ttttttttt..","..tttttt....","............"],"speech":["............",".WWWWWWWWWW.","WWWWWWWWWWWW","WWWWWWWWWWWW","WWWkWWkWWkWW","WWWWWWWWWWWW",".WWWWWWWWWW.","..WWW.......","..WW........",".W..........","............","............"],"lock":["....gggg....","...g....g...","..g......g..","..g......g..",".oooooooooo.",".oyyyyyyyyo.",".oyyykkyyyo.",".oyyykkyyyo.",".oyyyykyyyo.",".oyyyyyyyyo.",".oooooooooo.","............"],"warn":[".....yy.....",".....yy.....","....yyyy....","....ykky....","...yykkyy...","...yykkyy...","..yyykkyyy..","..yyykkyyy..",".yyyyyyyyyy.",".yyyykkyyyy.","yyyyyyyyyyyy","yyyyyyyyyyyy"],"stop":["...rrrrrr...","..rrrrrrrr..",".rrrrrrrrrr.","rrrrrrrrrrrr","rrrrrrrrrrrr","rWWWWWWWWWWr","rWWWWWWWWWWr","rrrrrrrrrrrr","rrrrrrrrrrrr",".rrrrrrrrrr.","..rrrrrrrr..","...rrrrrr..."],"info":["...bbbbbb...","..bbbbbbbb..",".bbbbWWbbbb.","bbbbbWWbbbbb","bbbbbbbbbbbb","bbbbWWWbbbbb","bbbbbWWbbbbb","bbbbbWWbbbbb","bbbbbWWbbbbb",".bbbWWWWbbb.","..bbbbbbbb..","...bbbbbb..."],"dice":["............",".WWWWWWWWWW.",".WrrWWWWrrW.",".WrrWWWWrrW.",".WWWWWWWWWW.",".WWWWrrWWWW.",".WWWWrrWWWW.",".WWWWWWWWWW.",".WrrWWWWrrW.",".WrrWWWWrrW.",".WWWWWWWWWW.","............"],"export":[".....ee.....","....eeee....","...eeeeee...",".....ee.....",".....ee.....",".....ee.....","g....ee....g","g..........g","g..........g","g..........g","gggggggggggg","GGGGGGGGGGGG"],"import":[".....bb.....",".....bb.....",".....bb.....",".....bb.....","...bbbbbb...","....bbbb....","g....bb....g","g..........g","g..........g","g..........g","gggggggggggg","GGGGGGGGGGGG"],"cap":["............",".....BB.....","...BBBBBB...",".BBBBBBBBBB.","BBBBBBBBBBBy",".BBBBBBBBB.y","...bbbbbb..y","...bbbbbb.yy","...bbbbbb...","....bbbb....","............","............"],"search":["...gggg.....",".gg....gg...",".g.cc...g...","g.cc.....g..","g.c......g..","g........g..",".g......g...",".gg....gg...","...ggggnn...",".......nnn..","........nnn.",".........nn."],"zoomin":["...gggg.....",".gg....gg...",".g..ee..g...","g...ee...g..","g.eeeeee.g..","g...ee...g..",".g..ee..g...",".gg....gg...","...ggggnn...",".......nnn..","........nnn.",".........nn."],"zoomout":["...gggg.....",".gg....gg...",".g......g...","g........g..","g.rrrrrr.g..","g........g..",".g......g...",".gg....gg...","...ggggnn...",".......nnn..","........nnn.",".........nn."],"bucket":["............","..gggggggg..",".g........g.","gWWWWWWWWWWg","gbbbbbbbbbbg","gbbbbbbbbbbg",".gbbbbbbbbg.",".gbbbbbbbbg.",".gbbbbbbbbg.","..gbbbbbbg..","..gggggggg..","............"],"snow":[".....cc.....","..c..cc..c..","...c.cc.c...","....cccc....",".c..cccc..c.","cccccccccccc","cccccccccccc",".c..cccc..c.","....cccc....","...c.cc.c...","..c..cc..c..",".....cc....."],"wind":["............",".......WWW..","..........W.","WWWWWWWWWW..","............","WWWWWWWWWWW.","...........W","WWWWWWWWWWW.","............","WWWWWW......",".......W....","....WWW....."],"stopb":["............","............","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","..rrrrrrrr..","............","............"],"timer":["....gggg....",".....gg.....","...WWWWWW...","..WWWWkWWW..",".WWWWWkWWWW.",".WWWWWkWWWW.",".WWWWWkkkWW.",".WWWWWWWWWW.",".WWWWWWWWWW.","..WWWWWWWW..","...WWWWWW...","............"],"rotr":["...WWWWW....","..W.....W.W.",".W.......WW.","W.......WWW.","W...........","W...........","W..........W","W..........W",".W........W.","..W......W..","...WWWWWW...","............"],"arrowr":["............","............","......W.....","......WW....","WWWWWWWWW...","WWWWWWWWWW..","WWWWWWWWWW..","WWWWWWWWW...","......WW....","......W.....","............","............"],"up":["............","............",".....WW.....","....WWWW....","...WWWWWW...","..WWWWWWWW..",".WWWWWWWWWW.","............","............","............","............","............"],"anvil":["............","............","gggggggggg..",".GGGGGGGGGgg","..GGGGGGGG..","....GGGG....","....GGGG....","...GGGGGG...","..gggggggg..","..GGGGGGGG..","............","............"],"rect":["............",".WWWWWWWWWW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WggggggggW.",".WWWWWWWWWW.","............"],"line":["..........WW",".........WWW","........WWW.",".......WWW..","......WWW...",".....WWW....","....WWW.....","...WWW......","..WWW.......",".WWW........","WWW.........","WW.........."],"scissors":["W.........W.",".W.......W..","..W.....W...","...W...W....","....W.W.....",".....W......","....W.W.....","..rrr.rrr...",".r..r.r..r..",".r..r.r..r..","..rr...rr...","............"],"paste":["....gggg....",".nnngWWgnnn.",".nWWWWWWWWn.",".nWggggggWn.",".nWWWWWWWWn.",".nWgggggWWn.",".nWWWWWWWWn.",".nWggggggWn.",".nWWWWWWWWn.",".nWgggWWWWn.",".nWWWWWWWWn.",".nnnnnnnnnn."],"fliph":[".....WW.....",".....WW.....","..b..WW..b..",".bb..WW..bb.","bbbbbWWbbbbb","bbbbbWWbbbbb",".bb..WW..bb.","..b..WW..b..",".....WW.....",".....WW.....","............","............"],"layers":["....bbbb....","..bbbbbbbb..","....bbbb....","............","....eeee....","..eeeeeeee..","....eeee....","............","....oooo....","..oooooooo..","....oooo....","............"],"fit":["WWWW....WWWW","W..........W","W..........W","W..........W","............","....gggg....","....gggg....","............","W..........W","W..........W","W..........W","WWWW....WWWW"],"tile":["............","............","......ee....","....eeeeee..","..eeeeeeeeee","eeeeeeeeeeee","nneeeeeeeeNN","nnnneeeeNNNN","nnnnnnNNNNNN","..nnnnNNNN..","....nnNN....","............"],"cursorplus":["k...........","kk..........","kwk.........","kwwk........","kwwwk.......","kwwwwk...ee.","kwwwwwk..ee.","kwwwkkk.eeee","kwkkwk..eeee","kk..kwk..ee.",".....kk..ee.","............"],"wand":["..........y.",".........yyy","..........y.","......y.....",".....yWy....","......yn....",".....nn.....","....nn......","...nn.......","..nn........",".nn.........","nn.........."],"mix":["yy....rr....","yy....rr....","............","...bb....ee.","...bb....ee.","............","ee....yy....","ee....yy....","............","...rr....bb.","...rr....bb.","............"],"replace":["..WWWWWWW...",".W.......W..","W.......WWW.","W........W..","W...........","............","..........W.",".W........W.","WWW.......W.",".W.......W..","..WWWWWWW...","............"],"world":["....eeee....","..eeeeeeee..",".eebbbbbbee.","eebbwbbbbbee","ebbbbbbbbbbe","ebbbbbbbbbbe","eeeeeeeeeeee","nnnnnnnnnnnn","nNnnnnnnNnnn",".nnnnNnnnnn.","..nnnnnnnn..","....nnnn...."]};
(function(){const mir=R=>R.map(r=>[...r].reverse().join('')),flip=R=>R.slice().reverse(),tr=R=>R.map((_,y)=>R.map(r=>r[y]).join(''));
  Object.assign(EDICO,{redo:mir(EDICO.undo),rotl:mir(EDICO.rotr),down:flip(EDICO.up),flipv:tr(EDICO.fliph),arrowl:mir(EDICO.arrowr),blood:EDICO.drop.map(r=>r.replace(/b/g,'r').replace(/B/g,'R').replace(/w/g,'p')),
    })})();
const EDIC={};
// un'icona sola per ogni cosa: dove il gioco ha già la sua icona (quelle dell'HUD) si usa quella, anche nell'editor e nelle emoji convertite
const icoRecol=(n,m)=>ICOS[n].map(sh=>sh.map(v=>typeof v==='string'&&m[v]?m[v]:v));
Object.assign(ICOS,{ampolla:icoRecol('pozione',{'#e8484f':'#4cd07a','#ffb0b4':'#b4f2c4'}),veleno:icoRecol('pozione',{'#e8484f':'#a070e8','#ffb0b4':'#d8c0ff'}),cuorev:icoRecol('cuore',{'#e8484f':'#d8dde6','#ff9aa0':'#ffffff'})});
const VXA={coin:'oro',potion:'pozione',flask:'ampolla',poison:'veleno',sword:'spada',swords:'spade',shield:'scudo',gear:'ingranaggio',scroll:'pergamena',book:'libro',star:'stella',rock:'pietra',crown:'corona',moon:'luna',moonn:'luna',ok:'spunta',chest:'forziere',gem:'xp',play:'gioca',skull:'teschio',note:'nota',bolt:'fulmine',film:'ciak',map:'mappa',sel:'cursore',
  heart:'cuore',heartw:'cuorev',trophy:'trofeo',pack:'zaino',users:'gente',boom:'esplosione',portal:'vortice',dagger:'pugnale',sun:'sole',muscle:'forza',target:'mira',monitor:'schermo',pad:'gamepad',shard:'frammento',page:'pagina'};
function edIcoC(n){if(EDIC[n])return EDIC[n];const a=VXA[n];if(a&&ICOS[a])return EDIC[n]=ICON(a,3).c;const R=EDICO[n];if(!R)return null;const sc=4,D=3,c=document.createElement('canvas');c.width=12*sc+D;c.height=12*sc+D;const q=c.getContext('2d'),at=(x,y)=>y>=0&&y<12&&x>=0&&x<12?R[y][x]:'.';
  for(let k=D;k>=1;k--)for(let y=0;y<12;y++)for(let x=0;x<12;x++){const ch=R[y][x];if(ch==='.')continue;q.fillStyle=shx(EDIP[ch]||'#ff00ff',k===D?.38:.55);q.fillRect(x*sc+k,y*sc+D-k,sc,sc)}
  for(let y=0;y<12;y++)for(let x=0;x<12;x++){const ch=R[y][x];if(ch==='.')continue;const col=EDIP[ch]||'#ff00ff',X=x*sc,Y=y*sc+D;q.fillStyle=col;q.fillRect(X,Y,sc,sc);
    if(at(x,y-1)!==ch){q.fillStyle=shx(col,1.28);q.fillRect(X,Y,sc,1)}if(at(x-1,y)!==ch){q.fillStyle=shx(col,1.14);q.fillRect(X,Y,1,sc)}
    if(at(x,y+1)!==ch){q.fillStyle=shx(col,.72);q.fillRect(X,Y+sc-1,sc,1)}if(at(x+1,y)!==ch){q.fillStyle=shx(col,.82);q.fillRect(X+sc-1,Y,1,sc)}}
  return EDIC[n]=c}
function edIcoURL(n){const k='u'+n;if(EDIC[k])return EDIC[k];const c=edIcoC(n);return EDIC[k]=c?c.toDataURL():''}
let EDICS=null;function edIcoRule(n){if(EDIC['r'+n]||!EDICO[n]&&!VXA[n])return;EDIC['r'+n]=1;if(!EDICS){EDICS=document.createElement('style');EDICS.id='edicons';document.head.appendChild(EDICS)}
  try{EDICS.sheet.insertRule(`.vi[data-v="${n}"]{background-image:url(${edIcoURL(n)})}`,EDICS.sheet.cssRules.length)}catch(e){}}
// un'icona dentro l'HTML
const edI=(n,cls)=>{edIcoRule(n);return`<i class="vi${cls?' '+cls:''}" data-v="${n}"></i>`};
// emoji dell'interfaccia → icona (quelle dei fumetti e le note musicali restano com'erano: sono contenuto, non interfaccia)
const EDEM={'👆':'sel','✋':'hand','🟩':'grass','🧱':'brick','🌊':'water','⬛':'void','🌳':'tree','🏠':'house','🧑':'person','👹':'monster','🎁':'chest','🧰':'chest','🚪':'door','⚡':'bolt','🚩':'flag','🧽':'eraser','💧':'drop',
  '🌙':'moon','🎵':'note','♪':'note','🌍':'globe','🗺':'map','⚙':'gear','↶':'undo','↷':'redo','💾':'save','▶':'play','📜':'scroll','⚔':'swords','🎬':'film','🔣':'vars','🩺':'check','❓':'help','✖':'close','✕':'close',
  '🗑':'trash','⧉':'dup','＋':'plus','✏':'pencil','✎':'pencil','📍':'pin','💰':'coin','🔥':'fire','🔷':'gem','💎':'gem','🪧':'sign','💡':'bulb','🛏':'bed','🕹':'lever','🌾':'wheat','🎣':'fish','🛡':'shield','⛑':'helmet',
  '🧪':'potion','🔑':'key','📦':'box','🛒':'stall','🎨':'palette','💬':'speech','👑':'crown','🔒':'lock','⚠':'warn','⛔':'stop','ℹ':'info','✔':'ok','⭐':'star','✨':'star','🎲':'dice','📤':'export','📥':'import','🎓':'cap',
  '🔍':'search','🪣':'bucket','☠':'skull','💀':'skull','❄':'snow','🩸':'blood','💨':'wind','💪':'up','🪨':'rock','⏹':'stopb','⏱':'timer','⟲':'rotl','⟳':'rotr','↺':'rotl','↪':'arrowr','▲':'up','▼':'down','⚒':'anvil','⚗':'flask',
  '🎰':'dice','⚜':'crown','📖':'book','⏏':'export','▭':'rect','╱':'line','🧺':'box','🎡':'world','🗝':'key','📋':'paste','✂':'scissors','🧭':'map'};
let EDEMR=new RegExp('('+Object.keys(EDEM).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\uFE0F?\\s?','gu');
function edIcoTree(root){if(!root||!root.nodeType)return;if(root.nodeType===3){if(root.parentNode)edIcoTree(root.parentNode);return}if(root.nodeType!==1)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[];while(w.nextNode()){const n=w.currentNode,p=n.parentNode;if(!p||p.nodeName==='TEXTAREA'||p.nodeName==='SCRIPT'||p.nodeName==='STYLE'||(p.closest&&p.closest('.noico')))continue;EDEMR.lastIndex=0;if(EDEMR.test(n.nodeValue))L.push(n)}
  for(const n of L){const p=n.parentNode,s=n.nodeValue;EDEMR.lastIndex=0;
    if(p.nodeName==='OPTION'||p.nodeName==='SELECT'||p.nodeName==='TITLE'){n.nodeValue=s.replace(EDEMR,'');continue}
    const fr=document.createDocumentFragment();let last=0;s.replace(EDEMR,(m,k,off)=>{if(off>last)fr.appendChild(document.createTextNode(s.slice(last,off)));const i=document.createElement('i'),v=EDEM[k];i.className='vi';i.dataset.v=v;edIcoRule(v);fr.appendChild(i);
      if(/\s$/.test(m))fr.appendChild(document.createTextNode(' '));last=off+m.length;return m});if(last<s.length)fr.appendChild(document.createTextNode(s.slice(last)));p.replaceChild(fr,n)}
  if(root.querySelectorAll)for(const i of root.querySelectorAll('.vi[data-v]'))edIcoRule(i.dataset.v)}
// osserva solo le parti dell'interfaccia che appartengono all'editor
const EDOBS=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')for(const n of m.addedNodes)edIcoTree(n);else if(m.type==='characterData')edIcoTree(m.target)}});
const EDOBR=new WeakSet();function edIcoWatch(el){if(!el||EDOBR.has(el))return;EDOBR.add(el);edIcoTree(el);EDOBS.observe(el,{childList:true,subtree:true,characterData:true})}
const EDOBB=new MutationObserver(()=>{for(const id of['ed','edtoast','edend','edcin','edback','mparco'])edIcoWatch($(id))});
EDOBB.observe(document.body,{childList:true});setTimeout(()=>{for(const id of['mparco','ed','edtoast'])edIcoWatch($(id));const pc=document.querySelector('#msel .mode.parco');if(pc)edIcoTree(pc)},0);
// icone disegnate sulla mappa (porte, boss, forzieri chiusi): un'icona e poi la scritta
function edLabI(n,txt,x,y,col){const c=edIcoC(n);g.font=g.font||'bold 10px Georgia,serif';const tw=txt?g.measureText(txt).width:0,sz=15;if(c)g.drawImage(c,x-(tw+sz+3)/2,y-sz+3,sz,sz);if(txt)label(txt,x+(sz+3)/2,y,col)}

/* ================= 7.6: VOXELIA STUDIO — strumenti da professionisti =================
   Selezione d'area (copia, taglia, incolla, sposta, ruota, specchia, riempi), timbri salvati nel mondo e modelli pronti,
   ispettore della casella con «sostituisci in tutta la mappa», pennello misto, terreno mescolato, elementi recenti,
   cronologia delle modifiche, controlli della vista, livelli nascondibili e trasformazioni dell'intera mappa. */
Object.assign(EDS,{area:null,alay:{t:1,d:1,e:1,b:1},clip:null,paste:null,mix:[],mat2:-1,mixP:30,recD:[],recM:[],matQ:'',walQ:'',hideE:0,hideT:0,stName:''});

/* ---- appunti: un pezzo di mappa con terreno, muri, decorazioni, oggetti ed edifici ---- */
function edClipNew(w,h,lay){return{w,h,t:new Array(w*h).fill(-1),f:new Array(w*h).fill(0),wl:new Array(w*h).fill(0),d:{},dw:{},e:[],b:[],full:1,lay:Object.assign({t:1,d:1,e:1,b:1},lay||{})}}
function edClipFrom(m,x0,y0,w,h,lay){lay=lay||EDS.alay;const n=m.N,c=edClipNew(w,h,lay);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const X=x0+x,Y=y0+y,j=y*w+x;if(X<0||Y<0||X>=n||Y>=n)continue;const i=Y*n+X;
    if(lay.t){c.t[j]=m.t[i];c.f[j]=m.f[i];c.wl[j]=m.w[i]}if(lay.d&&m.d[i]){c.d[j]=m.d[i];if(m.dw[i])c.dw[j]=1}}
  if(lay.e)for(const e of m.e){if(!edInRect(e,x0,y0,w,h))continue;const o=edClone(e);o.x-=x0;o.y-=y0;if(o.pts)o.pts=o.pts.map(([a,b])=>[a-x0,b-y0]);c.e.push(o)}
  if(lay.b)for(const b of m.b)if(b.x>=x0&&b.y>=y0&&b.x+b.w<=x0+w&&b.y+b.h<=y0+h){const o=edClone(b);o.x-=x0;o.y-=y0;o.dx-=x0;c.b.push(o)}
  return c}
// un oggetto sta nell'area se ci sta il suo punto; una zona evento se ci sta tutta
function edInRect(e,x0,y0,w,h){return e.k==='trig'?e.x>=x0&&e.y>=y0&&e.x+e.w<=x0+w&&e.y+e.h<=y0+h:e.x>=x0&&e.y>=y0&&e.x<x0+w&&e.y<y0+h}
function edAreaClear(m,x0,y0,w,h,lay){lay=lay||EDS.alay;const n=m.N;
  for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(x<0||y<0||x>=n||y>=n)continue;const i=y*n+x;if(lay.d){delete m.d[i];delete m.dw[i]}if(lay.t&&m.t[i]!==0){m.t[i]=0;if(m.d[i]&&EDECI[m.d[i]]&&EDECI[m.d[i]].water)delete m.d[i]}}
  if(lay.e)m.e=m.e.filter(e=>!edInRect(e,x0,y0,w,h));if(lay.b)m.b=m.b.filter(b=>!(b.x>=x0&&b.y>=y0&&b.x+b.w<=x0+w&&b.y+b.h<=y0+h))}
function edClipPaste(m,c,x0,y0){const n=m.N;let k=0;
  for(let y=0;y<c.h;y++)for(let x=0;x<c.w;x++){const X=x0+x,Y=y0+y;if(X<0||Y<0||X>=n||Y>=n)continue;const i=Y*n+X,j=y*c.w+x;
    if(c.t[j]>=0){m.t[i]=c.t[j];m.f[i]=c.f[j]<EMAT.length?c.f[j]:0;m.w[i]=c.wl[j]<EWAL.length?c.wl[j]:0;k++}
    if(c.d[j]&&EDECI[c.d[j]]){m.d[i]=c.d[j];if(c.dw[j])m.dw[i]=1;else delete m.dw[i];if(m.t[i]===1||m.t[i]===9)m.t[i]=0;if(m.t[i]===2&&!EDECI[c.d[j]].water)m.t[i]=0;k++}
    else if(c.full&&c.lay&&c.lay.d){delete m.d[i];delete m.dw[i]}
    if((m.t[i]===1||m.t[i]===9)&&m.d[i]){delete m.d[i];delete m.dw[i]}}
  for(const e of c.e){const o=edClone(e);o.u=edUid('e');o.x+=x0;o.y+=y0;if(o.pts)o.pts=o.pts.map(([a,b])=>[a+x0,b+y0]);
    if(o.k==='trig'?(o.x<0||o.y<0||o.x+o.w>n||o.y+o.h>n):(o.x<0||o.y<0||o.x>=n||o.y>=n))continue;if(o.k==='po')o.face='';m.e.push(o);k++}
  for(const b of c.b){const o=edClone(b);o.u=edUid('b');o.x+=x0;o.y+=y0;o.dx+=x0;if(o.x<0||o.y<0||o.x+o.w>n||o.y+o.h>n)continue;m.b.push(o);k++}return k}
// ruota di 90° in senso orario; specchia a destra-sinistra (x) o sopra-sotto (y)
function edClipRot(c){const w=c.w,h=c.h,n=edClipNew(h,w,c.lay);n.full=c.full;const P=(x,y)=>[h-1-y,x];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const j=y*w+x,[X,Y]=P(x,y),k=Y*n.w+X;n.t[k]=c.t[j];n.f[k]=c.f[j];n.wl[k]=c.wl[j];if(c.d[j]){n.d[k]=c.d[j];if(c.dw[j])n.dw[k]=1}}
  for(const e of c.e){const o=edClone(e);if(o.k==='trig'){const nx=h-o.y-o.h,ny=o.x;o.x=nx;o.y=ny;const t0=o.w;o.w=o.h;o.h=t0}else{[o.x,o.y]=P(o.x,o.y);if(o.pts)o.pts=o.pts.map(([a,b])=>P(a,b));if(o.fc!=null)o.fc=((o.fc|0)+2)%8;if(o.k==='po')o.face=''}n.e.push(o)}
  for(const b of c.b){const o=edClone(b);o.x=h-b.y-b.h;o.y=b.x;o.w=b.h;o.h=b.w;o.dx=o.x+(o.w>>1);n.b.push(o)}return n}
function edClipFlip(c,ax){const w=c.w,h=c.h,n=edClipNew(w,h,c.lay);n.full=c.full;const P=(x,y)=>ax==='x'?[w-1-x,y]:[x,h-1-y];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const j=y*w+x,[X,Y]=P(x,y),k=Y*w+X;n.t[k]=c.t[j];n.f[k]=c.f[j];n.wl[k]=c.wl[j];if(c.d[j]){n.d[k]=c.d[j];if(c.dw[j])n.dw[k]=1}}
  for(const e of c.e){const o=edClone(e);if(o.k==='trig'){if(ax==='x')o.x=w-o.x-o.w;else o.y=h-o.y-o.h}else{[o.x,o.y]=P(o.x,o.y);if(o.pts)o.pts=o.pts.map(([a,b])=>P(a,b));if(o.fc!=null)o.fc=(((ax==='x'?2:6)-(o.fc|0))%8+8)%8;if(o.k==='po')o.face=''}n.e.push(o)}
  for(const b of c.b){const o=edClone(b);if(ax==='x'){o.x=w-b.x-b.w;o.dx=o.x+(b.w-1-(b.dx-b.x))}else{o.y=h-b.y-b.h;o.dx=b.dx}n.b.push(o)}return n}
function edClipCount(c){return Object.keys(c.d).length+c.e.length+c.b.length}
// anteprima: una piccola mappa vista dall'alto
function edClipThumb(c,px){px=px||Math.max(2,Math.min(8,Math.floor(96/Math.max(c.w,c.h))));const cv2=document.createElement('canvas');cv2.width=c.w*px;cv2.height=c.h*px;const q=cv2.getContext('2d');
  for(let y=0;y<c.h;y++)for(let x=0;x<c.w;x++){const j=y*c.w+x,t0=c.t[j];let col=null;if(t0===0)col=(EMAT[c.f[j]]||EMAT[0]).a;else if(t0===1)col=shx((EWAL[c.wl[j]]||EWAL[0]).c,.75);else if(t0===2)col='#3b86d6';else if(t0===9)col='#0a0c14';
    if(col){q.fillStyle=col;q.fillRect(x*px,y*px,px,px)}if(c.d[j]){q.fillStyle=c.dw[j]?'rgba(255,255,255,.35)':'rgba(30,20,10,.65)';q.fillRect(x*px+px*.2,y*px+px*.2,px*.6,px*.6)}}
  for(const b of c.b){q.fillStyle=b.roof||'#a8402f';q.fillRect(b.x*px,b.y*px,b.w*px,b.h*px)}
  for(const e of c.e){q.fillStyle={npc:'#ffe066',en:'#ff4a4a',po:'#44eeff',ch:'#ffaa33',trig:'#c46bff'}[e.k]||'#ffffff';if(e.k==='trig'){q.globalAlpha=.4;q.fillRect(e.x*px,e.y*px,e.w*px,e.h*px);q.globalAlpha=1}else q.fillRect(e.x*px+px*.15,e.y*px+px*.15,px*.7,px*.7)}
  return cv2.toDataURL()}

/* ---- l'area selezionata ---- */
const edAreaR=()=>{const a=EDS.area;return a?{x:Math.min(a.x0,a.x1),y:Math.min(a.y0,a.y1),w:Math.abs(a.x1-a.x0)+1,h:Math.abs(a.y1-a.y0)+1}:null};
function edCopy(cut){const r=edAreaR();if(!r){edToast('Prima seleziona un\'area con lo strumento ▭ Area (R)');return}EDS.clip=edClipFrom(EM,r.x,r.y,r.w,r.h);
  if(cut){edPush('taglia');edAreaClear(EM,r.x,r.y,r.w,r.h);edAfterBulk()}edToast((cut?'✂ Tagliato':'📋 Copiato')+': '+r.w+'×'+r.h+(edClipCount(EDS.clip)?' · '+edClipCount(EDS.clip)+' tra arredi e oggetti':'')+' — Ctrl+V per incollare');edSide()}
function edPasteStart(c,name){if(!c){c=EDS.clip;if(!c){edToast('Gli appunti sono vuoti: copia prima un\'area (Ctrl+C)');return}}EDS.paste={c,name:name||'appunti'};if(EDS.tool!=='area'&&EDS.tool!=='stamp')edTool('area');else edSide();
  edToast('Clic sulla mappa per incollare «'+(name||'appunti')+'» · R ruota · F specchia · Esc per finire')}
function edPasteAt(x,y){const P=EDS.paste;if(!P)return;const c=P.c,x0=x-(c.w>>1),y0=y-(c.h>>1);edPush('incolla');const k=edClipPaste(EM,c,x0,y0);edAfterBulk();EDS.area={x0,y0,x1:x0+c.w-1,y1:y0+c.h-1};if(!k)edToast('Niente da incollare qui (fuori dalla mappa?)')}
function edAreaDel(){const r=edAreaR();if(!r)return;edPush('cancella area');edAreaClear(EM,r.x,r.y,r.w,r.h);edAfterBulk();edToast('Area svuotata')}
function edAreaFill(){const r=edAreaR();if(!r)return;edPush('riempi area');for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){if(!edIn(x,y))continue;const i=y*N+x;EM.t[i]=0;EM.f[i]=EDS.mat;if(EDS.mat2>=0&&Math.random()*100<EDS.mixP)EM.f[i]=EDS.mat2;if(EM.d[i]&&EDECI[EM.d[i]]&&EDECI[EM.d[i]].water)delete EM.d[i]}edAfterBulk()}
function edAreaXf(k){const r=edAreaR();if(!r)return;edPush(k==='rot'?'ruota area':'specchia area');const c=edClipFrom(EM,r.x,r.y,r.w,r.h);edAreaClear(EM,r.x,r.y,r.w,r.h);const c2=k==='rot'?edClipRot(c):edClipFlip(c,k);
  edClipPaste(EM,c2,r.x,r.y);EDS.area={x0:r.x,y0:r.y,x1:r.x+c2.w-1,y1:r.y+c2.h-1};edAfterBulk()}
function edAreaMove(dx,dy){const r=edAreaR();if(!r||(!dx&&!dy))return;edPush('sposta area');const c=edClipFrom(EM,r.x,r.y,r.w,r.h);edAreaClear(EM,r.x,r.y,r.w,r.h);edClipPaste(EM,c,r.x+dx,r.y+dy);
  EDS.area={x0:r.x+dx,y0:r.y+dy,x1:r.x+dx+r.w-1,y1:r.y+dy+r.h-1};edAfterBulk()}
function edAreaAll(){EDS.area={x0:0,y0:0,x1:N-1,y1:N-1};if(EDS.tool!=='area')edTool('area');else edSide()}
// dopo un cambiamento grande: si ricostruisce la zona, gli oggetti e la minimappa
function edAfterBulk(){EDS.sel=null;edZone(EM);edBuild();EDS.mmv=(EDS.mmv|0)+1;edDirty();edSide();edStat()}
function edPasteXf(k){const P=EDS.paste;if(!P)return;P.c=k==='rot'?edClipRot(P.c):edClipFlip(P.c,k);edSide()}

/* ---- timbri: pezzi di mappa salvati nel mondo, più i modelli pronti fatti con gli arredi del gioco ---- */
function edStamps(){if(!EW.stamps||typeof EW.stamps!=='object')EW.stamps={};return EW.stamps}
function edStampSave(){const r=edAreaR();if(!r){edToast('Seleziona prima un\'area');return}const n=(EDS.stName||'').trim()||('Timbro '+(Object.keys(edStamps()).length+1));const id=edUid('s');
  edStamps()[id]={id,n:n.slice(0,40),c:edClipFrom(EM,r.x,r.y,r.w,r.h)};EDS.stName='';edDirty();edToast('Timbro «'+n+'» salvato: lo trovi nello strumento Timbri (U)');edSide()}
function edStampDel(id){const s=edStamps()[id];if(!s||!confirm('Eliminare il timbro «'+s.n+'»?'))return;delete edStamps()[id];edDirty();edSide()}
// modelli pronti: una legenda di caratteri → terreno, muro, decorazione o oggetto
const EPREF=[
  ['Piazza con fontana','Città',['ccccccc','clcccLc','ccc_ccc','cc_Y_cc','ccc_ccc','cLcccLc','ccccccc'],{c:{f:'ciottoli'},l:{f:'ciottoli',d:'l'},L:{f:'ciottoli',d:'n'},_:{f:'ciottoli'},Y:{f:'ciottoli',d:'Y'}}],
  ['Mercato','Città',['sssssss','.s.H.ʍ.','sssssss','.k.b.k.','sssssss'],{s:{f:'strada'},'.':{f:'strada'},H:{f:'strada',d:'H'},'ʍ':{f:'strada',d:'ʍ'},k:{f:'strada',d:'k'},b:{f:'strada',d:'b'}},[[1,1,'s']]],
  ['Orto recintato','Campagna',['ffffff','fqqqqf','fqqqqf','fqEqqf','fqqqqf','ff..ff'],{f:{f:'terra',d:'f'},q:{f:'terra',d:'q'},E:{f:'terra',d:'E'},'.':{f:'terra'}}],
  ['Campo di grano','Campagna',['gggggg','gggggg','gggggg','ggygg+','gggggg'],{g:{f:'terra',d:'g'},y:{f:'terra',d:'y'},'+':{f:'terra',d:'+'}}],
  ['Accampamento','Natura',['..r..','.L.k.','r.F.b','.b.L.','..u..'],{'.':{f:'terra'},r:{f:'erba',d:'r'},L:{f:'terra',d:'L'},k:{f:'terra',d:'k'},b:{f:'terra',d:'b'},F:{f:'terra',d:'ƒ'},u:{f:'terra',d:'u'}}],
  ['Boschetto','Natura',['.r.a.r','r.h..r','.r.rh.','h.r..r','.r.u.r','r..r.h'],{'.':{f:'erba2'},r:{f:'erba2',d:'r'},a:{f:'erba2',d:'a'},h:{f:'erba2',d:'h'},u:{f:'erba2',d:'u'}}],
  ['Laghetto','Natura',['..hh..','.wwww.','hwwwwh','hwwOwh','.wwww.','..hh..'],{'.':{f:'erba'},h:{f:'erba',d:'h'},w:{t:2},O:{t:2,d:'^'}}],
  ['Molo','Porto',['ww p ww'.replace(/ /g,''),'wwpww','wwpww','wbp@w','wwpww','wwpkw'],{w:{t:2},p:{f:'pontile'},b:{f:'pontile',d:'b'},'@':{f:'pontile',d:'@'},k:{f:'pontile',d:'k'}}],
  ['Cimitero','Segrete',['ǂǂǂǂǂǂ','ǂtʭtʭǂ','ǂ....ǂ','ǂtʭt5ǂ','ǂ....ǂ','ǂǂ..ǂǂ'],{'ǂ':{f:'terra',d:'ǂ'},t:{f:'terra',d:'t'},'ʭ':{f:'terra',d:'ʭ'},'5':{f:'terra',d:'ċ'},'.':{f:'terra'}}],
  ['Altare oscuro','Segrete',['ğ...ğ','.ċРċ.','.РĀР.','.ċРċ.','ğ.ш.ğ'],{'ğ':{f:'cripta',d:'ğ'},'.':{f:'cripta'},'ċ':{f:'cripta',d:'ċ'},'Р':{f:'cripta',d:'Р'},'Ā':{f:'cripta',d:'Ā'},'ш':{f:'cripta',d:'ш'}}],
  ['Stanza del tesoro','Segrete',['#####','#ØCØ#','#Ø.Ø#','#...#','##.##'],{'#':{t:1,w:'cripta'},'Ø':{f:'oro',d:'Ø'},'.':{f:'oro'},C:{f:'oro',o:{k:'ch',rich:1,g:0,rnd:2,items:[],acts:[]}}}],
  ['Rovine','Segrete',['Ш..ğ.','.Г...','ğ..ШГ','..u..','Г.ğ.Ш'],{'Ш':{f:'pietra',d:'Ш'},'ğ':{f:'pietra',d:'ğ'},'Г':{f:'pietra',d:'Г'},u:{f:'pietra',d:'u'},'.':{f:'pietra'}}],
  ['Trincea','Guerra',['ŖŖŖŖŖŖ','ßß..ßß','č·čč·č','.¤¤¤¤.'],{'Ŗ':{f:'fango',d:'Ŗ'},'ß':{f:'fango',d:'ß'},'.':{f:'fango'},'č':{f:'fango',d:'č',w:1},'·':{f:'fango',d:'·',w:1},'¤':{f:'fango',d:'¤'}}],
  ['Taverna (arredi)','Casa',['F.TT.S','..TT..','C....b','C.TT.b','..TT.p'],{F:{f:'legno',d:'F'},T:{f:'legno',d:'T'},S:{f:'legno',d:'S'},C:{f:'legno',d:'C'},b:{f:'legno',d:'b'},p:{f:'legno',d:'p'},'.':{f:'legno'}}],
  ['Sala del trono','Castello',['ŧ.K.ŧ','..ž..','§.ž.§','..ž..','*.ž.*'],{'ŧ':{f:'marmo',d:'ŧ'},K:{f:'marmo',d:'K'},'ž':{f:'marmo',d:'ž',w:1},'§':{f:'marmo',d:'§'},'*':{f:'marmo',d:'*'},'.':{f:'marmo'}}]];
function edPrefab(i){const P=EPREF[i];if(!P)return null;const[n,,rows,leg,extra]=P,h=rows.length,w=Math.max(...rows.map(r=>[...r].length)),c=edClipNew(w,h);c.full=0;c.lay={t:1,d:1,e:1,b:1};
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const L=leg[ch];if(!L)return;const j=y*w+x;if(L.t!=null){c.t[j]=L.t;if(L.w)c.wl[j]=EWALI[L.w]|0}else if(L.f){c.t[j]=0;c.f[j]=EMATI[L.f]|0}if(L.d&&EDECI[L.d]){c.d[j]=L.d;if(L.w===1||EDECI[L.d].walk)c.dw[j]=1}if(L.o)c.e.push(Object.assign({x,y},edClone(L.o)))}));
  void extra;return c}
function edStampUse(id){if(id[0]==='#'){const c=edPrefab(+id.slice(1));if(c)edPasteStart(c,EPREF[+id.slice(1)][0]);return}const s=edStamps()[id];if(s)edPasteStart(edClone(s.c),s.n)}

/* ---- pannelli dei nuovi strumenti ---- */
function edAreaHTML(){const r=edAreaR(),P=EDS.paste,L=EDS.alay,lay=(k,n)=>`<label><input type="checkbox" ${L[k]?'checked':''} onchange="EDS.alay.${k}=this.checked?1:0"> ${n}</label>`;let h=`<h4>▭ Area</h4>`;
  if(P){h+=`<div class="edselbox"><h5>Incolla: ${esc(P.name)}</h5><img class="edcth" src="${edClipThumb(P.c)}" alt=""><p class="mu">${P.c.w}×${P.c.h} · clic sulla mappa per incollarlo (anche più volte). <kbd>R</kbd> ruota · <kbd>F</kbd> specchia · <kbd>Esc</kbd> finisce.</p>
    <span class="seg"><button title="Ruota (R)" onclick="edPasteXf('rot')">⟳ Ruota</button><button title="Specchia (F)" onclick="edPasteXf('x')">${edI('fliph')} Specchia</button><button title="Capovolgi" onclick="edPasteXf('y')">${edI('flipv')} Capovolgi</button></span><button onclick="EDS.paste=null;edSide()">✔ Fine</button></div>`}
  h+=`<p class="mu">Trascina per selezionare un rettangolo. Trascinando dentro la selezione la sposti. <kbd>Ctrl+C</kbd> copia · <kbd>Ctrl+X</kbd> taglia · <kbd>Ctrl+V</kbd> incolla · <kbd>Canc</kbd> svuota · <kbd>Ctrl+A</kbd> tutta la mappa.</p>
    <div class="edchk edlays">${lay('t','Terreno e muri')}${lay('d','Decorazioni')}${lay('e','Oggetti e personaggi')}${lay('b','Edifici')}</div>`;
  if(r){let ne=0,nd=0;for(const e of EM.e)if(edInRect(e,r.x,r.y,r.w,r.h))ne++;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(edIn(x,y)&&EM.d[y*N+x])nd++;
    h+=`<div class="edselbox"><b>${r.w}×${r.h}</b> <span class="mu">da ${r.x}, ${r.y} · ${nd} decorazioni · ${ne} oggetti</span>
    <div class="edbtns"><button onclick="edCopy()">📋 Copia</button><button onclick="edCopy(1)">✂ Taglia</button><button onclick="edPasteStart()" ${EDS.clip?'':'disabled'}>${edI('paste')} Incolla</button><button class="danger" onclick="edAreaDel()">🗑 Svuota</button>
    <button onclick="edAreaXf('rot')" title="Ruota di 90° (l'area deve essere libera intorno)">⟳ Ruota</button><button onclick="edAreaXf('x')">${edI('fliph')} Specchia</button><button onclick="edAreaXf('y')">${edI('flipv')} Capovolgi</button>
    <button onclick="edAreaFill()" title="Riempie l'area con il terreno scelto nello strumento Terreno">🪣 Riempi di ${esc((EMAT[EDS.mat]||EMAT[0]).n)}</button><button onclick="EDS.area=null;edSide()">Deseleziona</button></div>
    <div class="edrow"><input id="edstn" placeholder="Nome del timbro" value="${esc(EDS.stName)}" oninput="EDS.stName=this.value"><button onclick="edStampSave()">${edI('stamp')} Salva come timbro</button></div></div>`}
  else h+=`<p class="mu">Nessuna area selezionata.</p><button onclick="edAreaAll()">Seleziona tutta la mappa</button>`;
  if(EDS.clip&&!P)h+=`<h5>Appunti</h5><div class="edrow"><img class="edcth" src="${edClipThumb(EDS.clip)}" alt=""><span class="mu">${EDS.clip.w}×${EDS.clip.h}<br>si possono incollare anche in un'altra mappa</span><button onclick="edPasteStart()">${edI('paste')} Incolla</button></div>`;
  return h}
function edStampHTML(){const S=Object.values(edStamps());let h=`<h4>${edI('stamp')} Timbri e modelli</h4><p class="mu">Scegli un timbro e clicca sulla mappa per stamparlo: terreno, arredi e oggetti in un colpo solo. Per creare i tuoi timbri seleziona un pezzo di mappa con lo strumento ▭ Area e premi «Salva come timbro».</p>`;
  if(EDS.paste)h=`<div class="edselbox"><h5>Stai stampando: ${esc(EDS.paste.name)}</h5><span class="seg"><button onclick="edPasteXf('rot')">⟳ Ruota</button><button onclick="edPasteXf('x')">${edI('fliph')} Specchia</button></span><button onclick="EDS.paste=null;edSide()">✔ Fine</button></div>`+h;
  h+=`<h5>I timbri del mondo</h5><div class="edstl">`;if(!S.length)h+='<p class="mu">Ancora nessun timbro.</p>';
  for(const s of S)h+=`<div class="edstc"><button class="edstb" onclick="edStampUse('${s.id}')"><img src="${edClipThumb(s.c)}" alt=""><b>${esc(s.n)}</b><small>${s.c.w}×${s.c.h}</small></button><button class="danger edsx" title="Elimina" onclick="edStampDel('${s.id}')">✕</button></div>`;
  h+=`</div><h5>Modelli pronti</h5><div class="edstl">`;EPREF.forEach((p,i)=>{const c=edPrefab(i);h+=`<div class="edstc"><button class="edstb" onclick="edStampUse('#${i}')"><img src="${edClipThumb(c)}" alt=""><b>${esc(p[0])}</b><small>${p[1]} · ${c.w}×${c.h}</small></button></div>`});
  return h+'</div>'}
// ispettore della casella (strumento Seleziona su una casella senza oggetti)
function edTileHTML(s){const{x,y}=s.d,i=y*N+x,m=EM;if(!edIn(x,y))return'';const t0=m.t[i],d=m.d[i],dd=d&&EDECI[d];
  const grp=(L,cur,lab)=>{let o='',k0=null;L.forEach((q,j)=>{const k=q.k||'';if(k!==k0){if(k0!==null)o+='</optgroup>';o+=`<optgroup label="${esc(k)}">`;k0=k}o+=`<option value="${j}"${j===cur?' selected':''}>${esc(q.n)}</option>`});return o+(k0!==null?'</optgroup>':'')};
  const decG=()=>{let o='<option value="">(niente)</option>';for(const k of EDECK){o+=`<optgroup label="${esc(k)}">`+EDEC.filter(q=>q.k===k).map(q=>`<option value="${esc(q.c)}"${q.c===d?' selected':''}>${esc(q.n)}</option>`).join('')+'</optgroup>'}return o};
  let h=`<h4>${edI('tile')} Casella ${x}, ${y}</h4><div class="seg edtyp">${[[0,'Terreno'],[1,'Muro'],[2,'Acqua'],[9,'Vuoto']].map(([v,n])=>`<button class="${t0===v?'on':''}" onclick="edTileSet('t',${v})">${n}</button>`).join('')}</div>
    <div class="edrow"><span>Terreno</span><select onchange="edTileSet('f',+this.value)">${grp(EMAT,m.f[i])}</select></div>`;
  if(t0===1)h+=`<div class="edrow"><span>Muro</span><select onchange="edTileSet('w',+this.value)">${grp(EWAL,m.w[i])}</select></div>`;
  h+=`<div class="edrow"><span>Decorazione</span>${dd?`<img class="edtth" src="${edDecThumb(d)}" alt="">`:''}<select onchange="edTileSet('d',this.value)">${decG()}</select></div>`;
  if(d)h+=`<div class="edrow"><label><input type="checkbox" ${m.dw[i]||edDecWalk(d)?'checked':''} ${edDecWalk(d)?'disabled':''} onchange="edTileSet('dw',this.checked?1:0)"> Ci si cammina sopra</label><button class="danger" onclick="edTileSet('d','')">🗑 Togli</button></div>`;
  const mats=EMAT.map((q,j)=>[j,q.n]),dec=[['','(niente: toglile)'],...EDEC.map(q=>[q.c,q.n])];
  h+=`<h5>Sostituisci in tutta la mappa</h5><p class="mu">Cambia in un colpo tutte le caselle uguali a questa (si annulla con Ctrl+Z).</p>`;
  if(t0===0)h+=`<div class="edrow"><span>${esc(EMAT[m.f[i]].n)} →</span><select id="edrpf">${edOpt(mats,m.f[i])}</select><button onclick="edReplace('f',${m.f[i]},+$('edrpf').value)">Sostituisci (${m.f.filter((v,j)=>v===m.f[i]&&m.t[j]===0).length})</button></div>`;
  if(t0===1)h+=`<div class="edrow"><span>${esc(EWAL[m.w[i]].n)} →</span><select id="edrpw">${edOpt(EWAL.map((q,j)=>[j,q.n]),m.w[i])}</select><button onclick="edReplace('w',${m.w[i]},+$('edrpw').value)">Sostituisci (${m.w.filter((v,j)=>v===m.w[i]&&m.t[j]===1).length})</button></div>`;
  if(d)h+=`<div class="edrow"><span>${esc(dd?dd.n:d)} →</span><select id="edrpd">${edOpt(dec,d)}</select><button onclick="edReplace('d','${d.replace(/'/g,"\\'")}',$('edrpd').value)">Sostituisci (${Object.values(m.d).filter(v=>v===d).length})</button></div>`;
  return h}
function edTileSet(k,v){const s=EDS.sel;if(!s||s.k!=='tile')return;const{x,y}=s.d,i=y*N+x,m=EM;edPush('casella');
  if(k==='t'){m.t[i]=v;if(v!==0&&m.d[i]&&!(v===2&&EDECI[m.d[i]]&&EDECI[m.d[i]].water)){delete m.d[i];delete m.dw[i]}}
  else if(k==='f'){m.f[i]=v}else if(k==='w'){m.w[i]=v}else if(k==='d'){if(!v){delete m.d[i];delete m.dw[i]}else{m.d[i]=v;const wt=EDECI[v]&&EDECI[v].water;if(wt)m.t[i]=2;else if(m.t[i]!==0)m.t[i]=0}}else if(k==='dw'){if(v)m.dw[i]=1;else delete m.dw[i]}
  edSync(x,y);EDS.fdirty=1;EDS.ftime=0;EDS.mmv=(EDS.mmv|0)+1;edDirty();edSide();edStat()}
function edReplace(k,from,to){const m=EM,n=m.N*m.N;let c=0;edPush('sostituisci');
  for(let i=0;i<n;i++){if(k==='f'&&m.t[i]===0&&m.f[i]===from){m.f[i]=to;c++}else if(k==='w'&&m.t[i]===1&&m.w[i]===from){m.w[i]=to;c++}else if(k==='d'&&m.d[i]===from){if(to){m.d[i]=to}else{delete m.d[i];delete m.dw[i]}c++}}
  edAfterBulk();edToast('Sostituite '+c+' caselle')}

/* ---- pennello misto, terreno mescolato, recenti ---- */
function edDecPick(c,ev){if(ev&&ev.shiftKey){const i=EDS.mix.indexOf(c);if(i>=0)EDS.mix.splice(i,1);else{if(!EDS.mix.length&&EDS.dec&&EDS.dec!==c)EDS.mix.push(EDS.dec);EDS.mix.push(c)}}else{EDS.dec=c;if(EDS.mix.length&&!EDS.mix.includes(c))EDS.mix=[]}
  EDS.recD=[c,...EDS.recD.filter(q=>q!==c)].slice(0,10);edSide()}
function edMatPick(i){EDS.mat=i;EDS.recM=[i,...EDS.recM.filter(q=>q!==i)].slice(0,10);edSide()}
function edDecNow(){return EDS.mix.length>1?EDS.mix[Math.floor(Math.random()*EDS.mix.length)]:EDS.dec}
function edMatNow(){return EDS.mat2>=0&&Math.random()*100<EDS.mixP?EDS.mat2:EDS.mat}

/* ---- cronologia ---- */
const EDHL={pennello:'Pennello',riempi:'Riempimento',rettangolo:'Rettangolo',linea:'Linea',oggetto:'Oggetto aggiunto',partenza:'Punto di partenza',elimina:'Eliminato',duplica:'Duplicato',interno:'Interno creato',sposta:'Spostato',edificio:'Edificio',zona:'Zona evento',
  modifica:'Proprietà cambiata',ronda:'Ronda',rigenera:'Mappa rigenerata',dimensioni:'Dimensioni della mappa',tinta:'Tinta dei muri',liquido:'Liquido',taglia:'Area tagliata',incolla:'Incollato','cancella area':'Area svuotata','riempi area':'Area riempita',
  'ruota area':'Area ruotata','specchia area':'Area specchiata','sposta area':'Area spostata',casella:'Casella cambiata',sostituisci:'Sostituzione','trasforma mappa':'Mappa trasformata'};
function edHistWin(){EDWR=edHistWin;const U=EDS.undo,R=EDS.redo;let h=`<p class="mu">Ogni riga è un momento a cui puoi tornare. Le modifiche più recenti sono in alto. Puoi anche usare Ctrl+Z e Ctrl+Y.</p><div class="edcl edhist">`;
  h+=`<div class="edcr on"><span class="edn">●</span><b>Adesso</b></div>`;
  for(let i=U.length-1;i>=0;i--){const u=U[i];h+=`<div class="edcr"><span class="edn">${U.length-i}</span><span style="flex:1">${esc(EDHL[u.l]||u.l||'Modifica')}${u.tl?' <small class="mu">· '+esc(u.tl)+'</small>':''}${u.mn?' <small class="mu">· '+esc(u.mn)+'</small>':''}</span><small class="mu">${u.tm?new Date(u.tm).toLocaleTimeString('it-IT'):''}</small><button onclick="edHistGo(${i})">↶ Torna qui</button></div>`}
  if(!U.length)h+='<p class="mu">Ancora nessuna modifica in questa sessione.</p>';if(R.length)h+=`<p class="mu">${R.length} modifiche annullate si possono rifare con Ctrl+Y.</p>`;
  if($('edwin').hidden||!$('edwc'))edWin('⏱ Cronologia delle modifiche',h+'</div>');else edWinSet(h+'</div>')}
function edHistGo(i){let n=0;while(EDS.undo.length>i&&n<80){edUndo();n++}edHistWin()}

/* ---- vista: zoom, adatta, livelli ---- */
function edZoom(k){SZ=clamp(k==='+'?SZ*1.2:k==='-'?SZ/1.2:k,.3,2.6);edStat()}
function edFit(){const mob=innerWidth<=820,aw=Math.max(200,W-(mob?50:372)),ah=Math.max(160,H-(mob?H*.4:0)-80);const k=SZ/S;SZ=clamp(Math.min(aw*.92/(64*N),ah*.92/(34*N+50))*k,.3,2.6);const S2=SZ/k;EDS.cam.x=EDS.cam.y=N/2;
  // il centro della parte di mappa che si vede davvero (il pannello copre la destra, o il basso sul telefono)
  if(mob){const o=H*.2/S2/16/2;EDS.cam.x+=o;EDS.cam.y+=o}else{const o=(318-54)/2/S2/32/2;EDS.cam.x+=o;EDS.cam.y-=o}edStat()}
function edCenterStart(){if(EW.start.map!==EM.id){edOpenMap(EW.start.map)}EDS.cam.x=EW.start.x+.5;EDS.cam.y=EW.start.y+.5}
function edLayer(k){EDS[k]=EDS[k]?0:1;edStatBar();edStat()}
function edStatBar(){const el=$('edstat');if(!el)return;const tg=(k,ic,n,inv)=>`<button class="${(inv?!EDS[k]:EDS[k])?'on':''}" title="${n}" onclick="edLayer('${k}')">${edI(ic)}</button>`;
  el.innerHTML=`<span id="edstx"></span><span class="edzc">${tg('labels','sign','Etichette sulla mappa')}${tg('hideE','person','Mostra personaggi e oggetti',1)}${tg('hideT','bolt','Mostra le zone evento',1)}<i class="edsep"></i>
    <button title="Riduci (−)" onclick="edZoom('-')">${edI('zoomout')}</button><b id="edzv" title="Zoom al 100%" onclick="edZoom(1)">100%</b><button title="Ingrandisci (+)" onclick="edZoom('+')">${edI('zoomin')}</button><button title="Tutta la mappa (0)" onclick="edFit()">${edI('fit')}</button><button title="Vai all'inizio dell'avventura" onclick="edCenterStart()">${edI('flag')}</button></span>`}
const _ent76=ent;ent=function(e){if(EDIT&&EDS.hideE&&e.ref)return;_ent76(e)};

/* ---- trasformare tutta la mappa ---- */
function edMapXf(k,dx,dy){const m=EM,n=m.N;edPush('trasforma mappa');const all={t:1,d:1,e:1,b:1},c=edClipFrom(m,0,0,n,n,all);edAreaClear(m,0,0,n,n,all);for(let i=0;i<n*n;i++)m.t[i]=0;
  let c2=c,P=(x,y)=>[x,y];if(k==='rot'){c2=edClipRot(c);P=(x,y)=>[n-1-y,x]}else if(k==='x'||k==='y'){c2=edClipFlip(c,k);P=(x,y)=>k==='x'?[n-1-x,y]:[x,n-1-y]}else if(k==='shift'){dx|=0;dy|=0;P=(x,y)=>[clamp(x+dx,0,n-1),clamp(y+dy,0,n-1)];
    // le caselle che restano scoperte prendono il terreno del bordo
    const f0=m.f.slice();for(let i=0;i<n*n;i++)m.f[i]=f0[i]}
  edClipPaste(m,c2,k==='shift'?dx:0,k==='shift'?dy:0);m.sp=P(m.sp[0],m.sp[1]);if(EW.start.map===m.id){const[a,b]=P(EW.start.x,EW.start.y);EW.start.x=a;EW.start.y=b}edAfterBulk();edToast('Mappa trasformata: Ctrl+Z per tornare indietro')}

/* ---- stile 7.6: interfaccia più ordinata, icone voxel, controlli della vista ---- */
(function(){const st=document.createElement('style');st.id='ed76css';st.textContent=`
.vi{display:inline-block;width:1.32em;height:1.32em;vertical-align:-.32em;background:center/contain no-repeat;flex-shrink:0;filter:drop-shadow(0 1px 0 #0008)}
#ed{--ac:#f5b942;--bg0:#0d111c;--bg1:#151b2b;--bg2:#1d2539;--bg3:#273150;--ln:#ffffff16;--tx:#e6eaf3;--mu:#97a2b8;font:13px/1.35 "Segoe UI",system-ui,-apple-system,Roboto,sans-serif}
#ed button,#edwin button{font:inherit;font-size:12.5px;background:linear-gradient(180deg,var(--bg3),var(--bg2));color:var(--tx);border:1px solid #ffffff1f;border-radius:6px;padding:5px 9px;margin:1px;display:inline-flex;align-items:center;gap:5px;transition:background .12s,border-color .12s,box-shadow .12s;box-shadow:0 1px 0 #ffffff0d inset,0 1px 2px #0006}
#ed button:hover:not(:disabled),#edwin button:hover:not(:disabled){background:linear-gradient(180deg,#34406a,#273150);border-color:#f5b94299}
#ed button:active:not(:disabled){transform:translateY(1px)}#ed button.danger,#edwin button.danger{background:linear-gradient(180deg,#7a2a32,#5a1e24);border-color:#e5484f88}#ed button.gold,#edwin button.gold{background:linear-gradient(180deg,#8a6420,#6a4a16);border-color:var(--ac)}
#ed button.on,#ed .seg button.on,#ed .edtabs button.on,#edwin .edtabs button.on{background:linear-gradient(180deg,#8a6420,#5e4314);border-color:var(--ac);box-shadow:0 0 0 1px #f5b94255,0 1px 0 #ffffff22 inset}
#ed h4,#edwin .edwh b{font-family:Georgia,serif}#edside h4{display:flex;align-items:center;gap:7px;margin:4px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--ln);font-size:17px}
#edtop{background:linear-gradient(180deg,#1a2136,#121828);border-bottom:1px solid #f5b94255;gap:6px;padding:4px 8px}#edtop .edg{gap:2px;padding:2px 2px 2px 8px;border-left:1px solid var(--ln)}
#edtop button{padding:4px 8px}#edtop .edw{font-family:Georgia,serif;font-size:15px;box-shadow:none}#edtop .edplay{background:linear-gradient(180deg,#3a9a4a,#2a7036)!important;border-color:#7aff8a!important;font-weight:600}
#edtop .edwins button{padding:4px 8px;font-size:12px}
#edleft{width:54px;background:linear-gradient(90deg,#121828,#0f1422);gap:3px;padding:6px 0}#edleft button{width:42px;height:40px;padding:0;justify-content:center;border-radius:9px;font-size:20px}
#edleft button .vi{width:26px;height:26px;vertical-align:0}#edleft hr{width:60%;border:0;border-top:1px solid #ffffff1c;margin:3px 0}
#edleft button.on{background:linear-gradient(180deg,#9a7224,#6a4a16);border-color:#ffd27a;box-shadow:0 0 0 2px #f5b94255,0 0 14px #f5b94244}
#edside{width:318px;background:linear-gradient(180deg,#141a2a,#101523);scrollbar-width:thin;scrollbar-color:#3a4566 transparent;padding:8px 12px 12px}
#edside h5{display:flex;align-items:center;gap:6px;margin:12px 0 5px;color:#f5c66a;letter-spacing:1.4px;font-size:10.5px}#edside h5::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#f5b94244,transparent)}
.edsw{width:90px!important;background:linear-gradient(180deg,#1d2539,#161c2c)!important;transition:border-color .12s,transform .12s}.edsw:hover{border-color:#f5b94299!important;transform:translateY(-1px)}.edsw.mix{border-color:#7ad0ff!important;box-shadow:0 0 0 2px #7ad0ff44}
.edli:hover{border-color:#f5b94288!important}.edselbox{background:linear-gradient(180deg,#f5b9421a,#f5b94208);border-color:#f5b94255}
.edsrch{width:100%;margin:6px 0!important}.edbtns{display:flex;flex-wrap:wrap;gap:3px;margin:6px 0}.edbtns button{flex:1 1 auto}.edlays{margin:6px 0}
.edcth{max-width:96px;max-height:96px;image-rendering:pixelated;border:1px solid #f5b94255;border-radius:4px;background:#0006;display:block;margin:4px 0}.edtth{width:30px;height:34px;object-fit:contain;vertical-align:middle;background:#0005;border-radius:4px;margin:1px}
.edstl{display:grid;grid-template-columns:1fr 1fr;gap:6px}.edstc{position:relative}.edstb{width:100%;flex-direction:column;align-items:center!important;padding:6px 4px!important;gap:2px!important;height:100%}
.edstb img{width:72px;height:72px;object-fit:contain;image-rendering:pixelated;background:#0006;border-radius:4px}.edstb b{font-size:12px;text-align:center}.edstb small{color:var(--mu);font-size:10.5px}.edsx{position:absolute;top:2px;right:2px;padding:1px 4px!important;font-size:10px!important}
#edleft,#edside{bottom:30px}#edstat{left:0;right:0;z-index:2;height:30px;line-height:30px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px 0 12px;background:#0a0d16f0;font-size:12px;overflow:visible}
#edstx{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#c8cede}.edzc{display:inline-flex;align-items:center;gap:2px;flex-shrink:0}
.edzc button{padding:2px 5px!important;height:24px}.edzc button .vi{width:18px;height:18px;vertical-align:0}.edzc button.on{background:linear-gradient(180deg,#3a4a76,#2a3558)!important;border-color:#7ad0ff99!important;box-shadow:none!important}
#edzv{min-width:44px;text-align:center;cursor:pointer;color:#ffd84a;font-variant-numeric:tabular-nums}.edsep{width:1px;height:18px;background:var(--ln);margin:0 4px}
#ed.edfocus #edside,#ed.edfocus #edleft{display:none}#ed.edfocus #edstat{left:0;right:0}
.edwb{background:linear-gradient(180deg,#1b2133,#151a29);border-color:#f5b942cc;border-radius:12px}.edwh{background:linear-gradient(180deg,#232b44,#1a2034);padding:8px 10px 8px 16px}.edwh b{display:flex;align-items:center;gap:8px}
#edwin{font:13px/1.35 "Segoe UI",system-ui,-apple-system,Roboto,sans-serif}#edwin select,#edwin input:not([type=checkbox]):not([type=range]):not([type=color]),#edwin textarea,#ed select,#ed input:not([type=checkbox]):not([type=range]):not([type=color]){font:inherit;font-size:12.5px;background:#0a0e18;color:#e6eaf3;border:1px solid #ffffff26;border-radius:5px;padding:4px 6px}
#ed select:focus,#ed input:focus,#ed textarea:focus,#edwin select:focus,#edwin input:focus,#edwin textarea:focus{outline:none;border-color:#f5b942;box-shadow:0 0 0 2px #f5b94233}
.edcr{background:#00000033;border-color:#ffffff10}.edhist .edcr.on{border-color:#f5b94288}.edtyp{display:flex;margin:4px 0 8px}.edtyp button{flex:1;justify-content:center}
.edic .vi{width:28px;height:28px}.edli .edic{display:flex;justify-content:center}#edtoast{font:14px "Segoe UI",system-ui,sans-serif;display:flex;align-items:center;gap:6px}
#mparco .vi{width:1.25em;height:1.25em}
#edside select{max-width:100%;min-width:0}#edside .edrow select{flex:1 1 120px}#edside .edrow>span:first-child{flex-shrink:0}.edsw{height:104px!important}.edsw.tall{height:120px!important}.edsw small{max-height:2.4em;overflow:hidden}
@media(max-width:1500px){#edtop .edwins .lb{display:none}#edtop .edwins button{padding:4px 7px}}
@media(max-width:820px){#edside{width:auto}#edleft{width:50px;bottom:calc(40vh + 30px)}#edleft button{width:40px;height:38px}#edstat{display:flex;left:0;right:0;bottom:40vh}#edside{bottom:0}#edstx{font-size:11px}.edzc button{padding:2px 3px!important}}`;document.head.appendChild(st)})();

/* ================= avvio, salvataggi, menu ================= */
function contHTML(){const s=LS.get(SAVEK,null);$('cont').innerHTML=s&&s.p?`<button class="mbtn cont" onclick="contGame()">${ico('gioca',24)}<span><b>Continua: ${esc(s.name)}</b><small>Livello ${s.p.lv|0} · ${DFS[s.df]?DFS[s.df].n:''} · frammenti ${(s.p.sh||[]).length}/6 · salvato ${esc(new Date(s.t).toLocaleString('it-IT'))}</small></span></button>`:'';menuPort();
  if(s){if(!$('nm').value)$('nm').value=s.name||'';if(!$('rc').value)$('rc').value=s.code||''}}
function newGame(d){if(!LS.get('voxelia_intro',0)){const s0=LS.get(SAVEK,null);if(!(s0&&s0.p)){LS.set('voxelia_intro',1);playIntro(()=>begin(d,null));return}}const s=LS.get(SAVEK,null);if(s&&s.p){ovrStory(s,()=>begin(d,null));return}begin(d,null)}
function contGame(){const s=LS.get(SAVEK,null);if(s&&s.p)begin(s.df|0,s)}
function begin(d,s){cineReset();MODE='story';DIM=null;PPJ=[];document.body.classList.remove('dimm');auInit();DF=DFS[d]||DFS[1];P=newP();gndLoad(s&&s.gnd);
  if(s){for(const k in s.p)if(s.p[k]!=null)P[k]=s.p[k];P.ap=apFix(P.ap||APM);for(const it of P.inv.concat(eqs()))if(!it.u)it.u=uid();if(!P.eq.w)P.eq.w={u:uid(),s:'w',r:0,v:3,n:'Pugnale',p:0}}
  NET.name=($('nm').value.trim()||(s&&s.name)||'Eroe').replace(/[<>]/g,'').slice(0,14);NET.code=$('rc').value.trim().toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16);
  NET.tm=null;lastDay=0;cineOff();SZ=1;NET.hits=[];NET.say=null;NET.ar=null;NET.lb=null;NET.runs={};NET.st=NET.code?(window.GAME_WS?'connessione…':'multigiocatore non disponibile: apri il gioco dal server (node server.js)'):'';
  P.unl=P.unl||{};P.bag=P.bag||0;P.skl=P.skl||{};INV=24+BAGS[P.bag].s;P.stash=P.stash||[];P.sold=P.sold||{};P.room=P.room||0;P.res=P.res||{};P.fish=P.fish||{};P.rod=P.rod||0;recalc();if(!s)P.hp=P.mx;$('menu').style.display='none';closeSet();document.body.classList.add('ig');inMenu=0;started=1;last=performance.now();
  netConnect();load(s&&P.te===1&&!P.key?'cella':'town');npcMarks();hudApply();wheelApply();
  if(!s&&welcomeTour()){}else if(!s){PA={ti:'Benvenuto ad Aldoria',tx:'Il Re Aldric ti attende nel castello a nord-ovest: segui il ! giallo sopra la sua testa.\n\nI personaggi con ! hanno missioni da darti e ti pagano in monete. Le porte della città portano alla Foresta (nord), al Deserto (est) e ai Picchi Gelidi (ovest). Il Colosseo, con l\'arena PvP e la classifica, è a nord-est. Dalle porte secondarie si va nei nuovi quartieri: il Quartiere Nobile (nord-ovest), i Campi (est), il Porto (sud) e il Borgo delle Ceneri (ovest, chiuso: chiedi al Moreau).\n\nI tasti utili: I zaino, J missioni, K diario, L classifica, P giocatori, O opzioni, WASD o frecce per muoverti, R per interagire, Q pozione, Spazio colpo ad area, Shift o E schivata, F affondo, Invio chat.'};pn('txt')}}
function toMenu(){save();hudEdit(0);cineOff();closeLook();started=0;netLeave();PM=0;$('pn').style.display='none';document.body.classList.remove('ig');$('menu').style.display='flex';inMenu=1;music('menu');contHTML();dimObj();mode('');wheelApply()}

/* ================= input ================= */
// Un clic su un altro eroe non apre nulla (si cammina o si colpisce ciò che c'è sotto): il profilo si apre con il doppio clic.
// Nella fossa dell'arena, invece, il clic singolo attacca come sempre.
let lastPl={id:null,t:0},plHint=0;
function nearAt(L,mx,my){let best=null,bd=1e9;for(const e of L){if(e.k==='tc'||e.k==='cho'||e.k==='resx'||e.k==='ship'||e.k==='dead'||e.k==='figura')continue;const r=e.boss?44:26,d=Math.hypot(PX(e.px,e.py)-mx,(PY(e.px,e.py,e.boss?30:16)-my)*.8);if(d<r&&d<bd){bd=d;best=e}}return best}
const toWorld=(cx,cy)=>[(cx-W/2)/S+camX,(cy-H/2)/S+camY];
cv.onpointerdown=ev=>{auInit();if(!started||PM==='trade'||PM==='treq')return;cl();const[mx,my]=toWorld(ev.clientX,ev.clientY),near=L=>nearAt(L,mx,my);
  const pl=near(NET.list),pvp=pl&&inPit(pl.px,pl.py)&&inPit(P.px,P.py);
  if(pl&&pvp){P.tg=pl;P.rp=0;return}
  if(pl){const now=performance.now();
    if(lastPl.id===pl.id&&now-lastPl.t<450){lastPl={id:null,t:0};P.path=[];P.tg=null;pl.prof=null;pl.par=null;NET.send({t:'prof',to:pl.id});pn('pl',pl);return}
    lastPl={id:pl.id,t:now};if(!plHint){plHint=1;msg('Doppio clic su un eroe per aprire il suo profilo')}}
  const best=near(ents);if(best){P.tg=best;P.rp=0;return}
  const gx=Math.floor((mx/32+my/16)/2),gy=Math.floor((my/16-mx/32)/2);P.tg=null;P.path=pathTo(gx,gy)};
cv.addEventListener('wheel',e=>{e.preventDefault();SZ=clamp(SZ*(1-e.deltaY*.001),.55,1.9)},{passive:false});
document.addEventListener('keydown',()=>auInit());
const MOVEK=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
onkeydown=e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();
  if(k==='escape'&&$('mappa')&&$('mappa').style.display==='flex'){closeMap();return}
  if(k==='escape'){if(HED)hudEdit(0);else if($('look').style.display==='block')closeLook();else if($('chg').style.display==='block')closeChg();else if($('set').style.display==='block')closeSet();else if(started)cl();return}
  if(HED)return;
  // 7.10: con la finestra dell'aspetto aperta il tasto C la chiude (come Esc); gli altri tasti restano fermi
  if($('look').style.display==='block'){if(k==='c'&&!e.repeat)closeLook();return}
  if(!started)return;
  if(SET.wasd&&MOVEK.includes(k)){KEYS[k]=1;e.preventDefault();return}
  if(k==='r'){if(IT){P.path=[];P.tg=null;act(IT)}return}
  if(k==='enter'){$('ch').focus();e.preventDefault();return}
  if(k==='m'){$('mappa')&&$('mappa').style.display==='flex'?closeMap():openMap();return}if(k===SET.rk){wheelToggle();return}
  if(k.length===1&&k>='1'&&k<='4'){useSkill(+k-1);return}
  if(k==='q')pot();else if(k==='shift'||k==='e')dodge();else if(k==='f')lunge();else if(k===' '){area();e.preventDefault()}else if(k==='i')tog('inv');else if(k==='j')tog('q');else if(k==='k')tog('dia');else if(k==='l')tog('lb');else if(k==='p')tog('who');else if(k==='c')openLook();else if(k==='o')$('set').style.display==='block'?closeSet():openSet()};
onkeyup=e=>{KEYS[e.key.toLowerCase()]=0};
addEventListener('blur',()=>{for(const q in KEYS)KEYS[q]=0});
onbeforeunload=()=>{if(started)save()};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)save()});

/* ================= ciclo principale ================= */
/* ---- frequenza dei fotogrammi (7.4) ----
   Il gioco disegna sempre al ritmo dello schermo (requestAnimationFrame): il browser non può mostrare più immagini di quante
   lo schermo ne aggiorni. Fino alla 7.3 senza V-Sync il ciclo girava con un timer più veloce dello schermo: i fotogrammi in più
   non si vedevano, ma tenevano occupato il browser, che finiva per mostrarne meno (il gioco andava più lento, non più veloce).
   Con un limite FPS più basso della frequenza dello schermo si saltano i fotogrammi in più, a intervalli regolari. */
let FPL=0,HZ=0,HZL=0;const HZS=[];
function loop(n){requestAnimationFrame(loop);frame(n)}
// un fotogramma del gioco: lo chiama il ciclo dello schermo e, in realtà virtuale, quello del visore (8zf_xr.js)
function frame(n){
  if(HZL&&HZS.length<90){const d=n-HZL;if(d>2&&d<60)HZS.push(d);if(HZS.length===90)HZ=Math.round(1000/HZS.slice().sort((a,b)=>a-b)[45])}HZL=n;
  if(SET.fpsmax>0&&!(HZ&&SET.fpsmax>=HZ-1)){const iv=1000/SET.fpsmax;if(n-FPL<iv-1.5)return;FPL=n-FPL>2*iv?n:FPL+iv}else FPL=n;
  const dt=Math.max(0,Math.min(.05,(n-last)/1000||0));last=n;
  if(!started){if(INTRO)introDraw(dt);else if(CN)cineDraw(dt);else if(inMenu)drawMenu(dt);return}
  cineTick(dt);upd(dt*TS);if(!started)return;if(PM==='who'&&NET.ok&&(NET.wt=(NET.wt||0)+dt)>1){NET.wt=0;NET.send({t:'who'})}draw();mini();cdUI();curHover(dt);if((acc+=dt)>.2){acc=0;hud();pdCheck();clockUI()}
  if(SET.fps){fpsN++;fpsT+=dt;if(fpsT>=.5){$('fps').textContent=Math.round(fpsN/fpsT)+' FPS';fpsN=0;fpsT=0}}}
/* ================= cursore personalizzato: pixel art generata dal gioco ================= */
const CURC={oro:'#f5b942',argento:'#d8dde6',rubino:'#e8484f',smeraldo:'#4cd07a',zaffiro:'#4aa3ff',ametista:'#b866ff'};
const CURN=['Spada','Freccia','Guanto','Mirino','Cursore del sistema'];
// forme su una griglia 16×16: poligoni ['p',[[x,y]...]], tratti spessi ['s',x1,y1,x2,y2,spessore], cerchi ['c',x,y,r], anelli ['o',x,y,r,spessore]; l'ultimo valore è il colore
function curShape(k,col){const G='#e2b33a',B='#7a4a22',dk=col?shx(col,.55):'#333333';switch(k){
  case 0:return{hs:[1,1],f:[['s',1.6,1.6,9.6,9.6,1.15,col],['s',7.6,11.4,11.4,7.6,.95,G],['s',10.3,10.3,12.3,12.3,.75,B],['c',13,13,1.05,G]]};
  case 1:return{hs:[1,1],f:[['p',[[1,1],[1,12.6],[3.9,9.8],[6,13.9],[8,13],[5.9,9],[9.7,9]],col]]};
  case 2:return{hs:[5,1],f:[['p',[[4,2.2],[4.8,1.2],[6.2,1.2],[7,2.2],[7,8],[4,8]],col],['p',[[7,6],[12,6],[12.8,7],[12.8,12.4],[11.6,13.4],[4.6,13.4],[3.8,12.4],[3.8,8],[7,8]],col],['p',[[3.9,9.2],[2.4,7.4],[1.4,8.3],[2.8,11.6],[3.9,12.2]],col],['s',9,6.6,9,8.6,.3,dk],['s',10.8,6.6,10.8,8.6,.3,dk],['p',[[4.4,13.4],[12.2,13.4],[12.2,14.8],[4.4,14.8]],G]]};
  case 3:return{hs:[8,8],f:[['o',8,8,4.6,1.5,col],['s',8,1,8,3.6,.75,col],['s',8,12.4,8,15,.75,col],['s',1,8,3.6,8,.75,col],['s',12.4,8,15,8,.75,col],['c',8,8,.85,col]]};
  case 'talk':return{hs:[2,2],f:[['p',[[2,2.6],[2.6,2],[13.4,2],[14,2.6],[14,9.4],[13.4,10],[8,10],[4.6,13.4],[5,10],[2.6,10],[2,9.4]],'#f4f1e8'],['c',5.4,6,.85,'#3a3a42'],['c',8,6,.85,'#3a3a42'],['c',10.6,6,.85,'#3a3a42']]};
  case 'atk':return curShape(0,'#ff5a4a')}}
function shx(h,f){const n=parseInt(h.slice(1,7),16),m=v=>Math.max(0,Math.min(255,Math.round(v*f)));return'#'+((m(n>>16)<<16)|(m(n>>8&255)<<8)|m(n&255)).toString(16).padStart(6,'0')}
function curBake(sh,sc){return curBakeC(sh,sc).toDataURL()}
function curBakeC(sh,sc){const Nn=16,px=new Array(Nn*Nn).fill(null);
  const inP=(x,y,Q)=>{let c=false;for(let i=0,j=Q.length-1;i<Q.length;j=i++){const[xi,yi]=Q[i],[xj,yj]=Q[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
  const sD=(x,y,a,b,c,d)=>{const vx=c-a,vy=d-b,l=vx*vx+vy*vy||1,q=Math.max(0,Math.min(1,((x-a)*vx+(y-b)*vy)/l));return Math.hypot(x-(a+vx*q),y-(b+vy*q))};
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++){const X=x+.5,Y=y+.5;for(const f of sh.f){let on=false;
    if(f[0]==='p')on=inP(X,Y,f[1]);else if(f[0]==='s')on=sD(X,Y,f[1],f[2],f[3],f[4])<=f[5]+.2;else if(f[0]==='c')on=Math.hypot(X-f[1],Y-f[2])<=f[3]+.2;else if(f[0]==='o')on=Math.abs(Math.hypot(X-f[1],Y-f[2])-f[3])<=f[4]/2;
    if(on)px[y*Nn+x]=f[f.length-1]||null}}
  const at=(x,y)=>x<0||y<0||x>=Nn||y>=Nn?null:px[y*Nn+x],ol=(x,y)=>!at(x,y)&&!!(at(x-1,y)||at(x+1,y)||at(x,y-1)||at(x,y+1));
  const c=document.createElement('canvas');c.width=c.height=Nn*sc;const q=c.getContext('2d'),put=(x,y,col)=>{q.fillStyle=col;q.fillRect(x*sc,y*sc,sc,sc)};
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++)if(!at(x,y)&&!ol(x,y)&&(at(x-1,y-1)||ol(x-1,y-1)))put(x,y,'rgba(0,0,0,.35)');  // ombra
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++)if(ol(x,y))put(x,y,'#140c04');  // contorno scuro
  for(let y=0;y<Nn;y++)for(let x=0;x<Nn;x++){const v=at(x,y);if(!v)continue;const lt=!at(x-1,y)||!at(x,y-1),dk=!at(x+1,y)||!at(x,y+1);put(x,y,lt&&!dk?shx(v,1.3):dk&&!lt?shx(v,.7):v)}  // luce in alto a sinistra, ombra in basso a destra
  return c}
let CURU={},curK='',curT=0,MX=-1,MY=-1;
function curApply(){let css='';const st=SET.cur|0;
  if(st<4){const sc=[1,2,3][(SET.curs|0)-1]||2,col=CURC[SET.curc]||CURC.oro,mk=(k,c)=>{const s=curShape(k,c);return{u:curBake(s,sc),u2:curBake(s,sc*2),x:s.hs[0]*sc,y:s.hs[1]*sc}};
    CURU={def:mk(st,col),atk:mk('atk'),talk:mk('talk'),use:mk(2,col)};
    // sugli schermi ad alta densità il browser sceglie l'immagine doppia, così la pixel art resta nitida (i browser che non capiscono image-set usano la prima regola)
    const cu=(o,f)=>`cursor:url(${o.u}) ${o.x} ${o.y},${f};cursor:-webkit-image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},${f};cursor:image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},${f}`;
    css=`html,body,#menu,#pn,#set,#chg,canvas#c{${cu(CURU.def,'auto')}}button,select,summary,label,input[type=checkbox],input[type=range],.ti{${cu(CURU.use,'pointer')}}input:not([type]),input[type=text],input[type=number],input[type=password]{cursor:text}`}
  else CURU={};
  $('curcss').textContent=css;cv.style.cursor='';curK=''}
function curPrev(){if(!CURU.def)return'';return[['def','Normale'],['atk','Nemico'],['talk','Personaggio'],['use','Oggetti e porte']].map(([k,l])=>`<span><img src="${CURU[k].u}" alt="" width="${(SET.curs|0)*16||32}">${l}</span>`).join('')}
cv.addEventListener('pointermove',e=>{MX=e.clientX;MY=e.clientY});
// cambia il cursore in base a cosa c'è sotto il mouse (nemico, personaggio, porta od oggetto)
function curHover(dt){if(!CURU.def||!SET.curx||MX<0){if(curK){cv.style.cursor='';curK=''}return}if((curT-=dt)>0)return;curT=.08;
  const[mx,my]=toWorld(MX,MY),pl=nearAt(NET.list,mx,my),h=pl||nearAt(ents,mx,my);let k='';
  if(h){if(h.k==='en'||(h.k==='pl'&&inPit(h.px,h.py)&&inPit(P.px,P.py)))k='atk';else if(h.k==='npc')k='talk';else k='use'}
  if(k!==curK){curK=k;if(!k){cv.style.cursor='';return}const o=CURU[k];cv.style.cursor=`url(${o.u}) ${o.x} ${o.y},auto`;cv.style.cursor=`image-set(url(${o.u}) 1x,url(${o.u2}) 2x) ${o.x} ${o.y},auto`}}
$('ver').textContent=GAME_VER;document.title='Voxelia '+GAME_VER+' – Il Regno Perduto';
rs();onresize=rs;applySet();iconFill();contHTML();$('menu').classList.add('intro','rdy');setTimeout(()=>$('menu').classList.remove('intro'),3200);newBadge();music('menu');requestAnimationFrame(loop);edInstall();
