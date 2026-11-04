/* ================= 7.50: le insegne luminose del Motel e del Casinò =================
   Prima il Motel aveva una sbarra rosa piatta, appoggiata sopra la porta e le finestre, e il Casinò niente.
   Ora sul tetto, verso la strada, ci sono due insegne vere:
   - il Motel della Rosa dei Venti: una tabella su due pali con la scritta MOTEL al neon rosa (che ogni tanto sfarfalla),
     la cornice, la freccia che lampeggia verso la porta e la fila di lampadine che si rincorrono;
   - il Casinò Fortuna d'Oro: una grande insegna rossa e oro con la scritta CASINÒ, le lampadine tutto intorno che girano,
     i semi delle carte ai lati e una moneta d'oro che gira in cima.
   Di giorno sono spente a metà, di notte brillano e illuminano la strada. Valgono in ogni zona che ha un motel o un casinò
   (anche nei quartieri fatti con l'editor). Sono entità a sé, disegnate dopo l'edificio, così niente le copre. */
const INSF={M:['10001','11011','10101','10001','10001'],O:['111','101','101','101','111'],T:['111','010','010','010','010'],E:['111','100','110','100','111'],L:['100','100','100','100','111'],
  C:['111','100','100','100','111'],A:['010','101','111','101','101'],S:['111','100','111','001','111'],I:['111','010','010','010','111'],N:['1001','1101','1011','1001','1001'],'Ò':['111','101','101','101','111']};
const insW=s=>[...s].reduce((a,ch)=>a+(INSF[ch]?INSF[ch][0].length:3)+1,-1);
// la scritta sul piano della facciata (y fisso), centrata in cx; z0 = base delle lettere, p = larghezza del pixel, ph = altezza
function insText(s,cx,y,z0,p,ph,col,on){let x=cx-insW(s)*p/2,i=0;for(const ch of s){const G=INSF[ch];if(!G){x+=4*p;i++;continue}const lit=on(i);
    for(let r=0;r<5;r++)for(let c=0;c<G[r].length;c++)if(G[r][c]==='1')box(x+c*p,y,z0+(4-r)*ph,p*.92,.03,ph*.92,lit?col:'#4a3a44',lit?1.7:1);
    if(ch==='Ò')box(x+2*p,y,z0+5.2*ph,p*.9,.03,ph*.8,lit?col:'#4a3a44',lit?1.7:1);x+=(G[0].length+1)*p;i++}}
const insNight=()=>Math.max(typeof NK!=='undefined'?NK:0,typeof DK!=='undefined'?DK*.6:0,ZZ&&ZZ.int?1:0);
function insMotel(e){const b=e.b,cx=b.dx+.5,yf=b.y+b.h,y=yf-.3,z0=b.ht,n=insNight(),glow=n>.25,
    // tutta l'insegna si spegne e si riaccende ogni tanto, e ogni lettera sfarfalla a modo suo
    blk=Math.sin(t*.37)>.985,on=i=>glow&&!blk&&!(i===3&&Math.sin(t*9.7)>.985)&&!(i===1&&Math.sin(t*2.3+1)>.992);
  for(const dx of[-1.05,1.0])box(cx+dx,y-.06,z0,.08,.08,14,'#3a3a44');
  box(cx-1.3,y,z0+12,2.6,.1,15,'#1a1420');box(cx-1.36,y+.02,z0+11.5,2.72,.12,1.2,'#5a2a4a');box(cx-1.36,y+.02,z0+26.6,2.72,.12,1.2,'#5a2a4a');
  for(const dx of[-1.36,1.28])box(cx+dx,y+.02,z0+11.5,.08,.12,16.3,'#5a2a4a');
  insText('MOTEL',cx,y+.11,z0+15,.1,1.9,'#ff4a9a',on);
  // le lampadine sotto la scritta, che si rincorrono
  for(let i=0;i<11;i++){const l=glow&&((i+Math.floor(t*7))%3===0);box(cx-1.15+i*.22,y+.11,z0+12.6,.06,.03,1.2,l?'#ffe27a':'#5a4a30',l?1.6:1)}
  // la freccia verso la porta, sul lato destro
  const ar=glow&&Math.floor(t*2.4)%2===0;for(let k=0;k<3;k++)box(cx+1.42,y+.11,z0+3+k*3.2,.1,.03,2.2,ar?'#7affff':'#2a4a4a',ar?1.6:1);box(cx+1.36,y+.11,z0+1.2,.22,.03,1.4,ar?'#7affff':'#2a4a4a',ar?1.6:1);
  if(glow&&typeof nlight==='function'&&!blk)nlight(cx,yf+.3,z0+18,140,'255,80,160',.85*n)}
function insCasino(e){const b=e.b,cx=b.dx+.5,yf=b.y+b.h,y=yf-.3,z0=b.ht,n=insNight(),glow=n>.25,W2=3.6,on=()=>glow;
  for(const dx of[-1.5,1.42])box(cx+dx,y-.06,z0,.1,.1,10,'#2a1a1a');
  box(cx-W2/2,y,z0+8,W2,.12,19,'#5a0a1a');box(cx-W2/2-.06,y+.02,z0+7.5,W2+.12,.13,1.5,'#d4af37');box(cx-W2/2-.06,y+.02,z0+26.8,W2+.12,.13,1.5,'#d4af37');
  for(const dx of[-W2/2-.06,W2/2-.04])box(cx+dx,y+.02,z0+7.5,.1,.13,20.8,'#d4af37');
  insText('CASINÒ',cx,y+.13,z0+12.5,.11,2.1,'#ffd84a',on);
  // le lampadine tutto intorno che girano
  const nb=14,k0=Math.floor(t*8);for(let i=0;i<nb;i++){const l=glow&&((i+k0)%4<2);const c=l?'#fff2b0':'#6a5a30',f=l?1.7:1;
    box(cx-W2/2+.1+i*(W2-.2)/(nb-1)-.03,y+.13,z0+25.4,.07,.03,1.2,c,f);box(cx-W2/2+.1+i*(W2-.2)/(nb-1)-.03,y+.13,z0+9.2,.07,.03,1.2,c,f)}
  // i semi delle carte ai lati: picche e cuori
  const sp=[[0,1,0],[1,1,1],[1,1,1],[0,1,0]],hr=[[1,0,1],[1,1,1],[1,1,1],[0,1,0]];
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){if(sp[r][c])box(cx-W2/2+.18+c*.08,y+.13,z0+13+(3-r)*2.2,.07,.03,2,glow?'#e8e8f0':'#8a8a90',glow?1.3:1);if(hr[r][c])box(cx+W2/2-.42+c*.08,y+.13,z0+13+(3-r)*2.2,.07,.03,2,glow?'#ff3a4a':'#7a2a2a',glow?1.6:1)}
  // la moneta d'oro che gira in cima
  const a=t*2.2,cw=Math.abs(Math.cos(a))*.34+.04;box(cx-cw/2,y+.01,z0+29,cw,.08,9,'#d4af37',glow?1.4:1.05);box(cx-cw/2*.6,y-.0,z0+31,cw*.6,.09,5,'#ffe27a',glow?1.5:1.05);box(cx-.03,y+.02,z0+27,.06,.06,2.2,'#8a6a2a');
  if(glow&&typeof nlight==='function')nlight(cx,yf+.3,z0+16,160,'255,200,90',.9*n)}
// le insegne nascono con la zona: una per ogni motel e per ogni casinò dei quartieri
function insPlace(){if(typeof TB==='undefined'||!Array.isArray(TB)||!ZZ||ZZ.int)return;for(let i=ents.length-1;i>=0;i--)if(ents[i].k==='ins50')ents.splice(i,1);
  for(const b of TB){if(!b||b.dx==null)continue;const ty=b.st==='motel'?'motel':b.to==='in_casino'||b.st==='casino'?'casino':null;if(!ty)continue;
    // l'entità sta all'angolo destro della facciata: così si disegna dopo tutte le caselle dell'edificio
    ents.push({k:'ins50',ty,b,px:b.x+b.w-.5,py:b.y+b.h+.02})}}
const _loadPost750i=loadPost;loadPost=function(k){_loadPost750i(k);try{insPlace()}catch(e){console.warn('insegne',e)}};
const _ent750i=ent;ent=function(e){if(e.k==='ins50'){try{e.ty==='motel'?insMotel(e):insCasino(e)}catch(_){}return}_ent750i(e)};
