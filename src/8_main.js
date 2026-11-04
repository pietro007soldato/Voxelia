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
