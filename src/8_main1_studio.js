/* 7.53: tolto da 8_main.js, stesso ordine di prima: Voxelia Studio (editor, mondi da giocare, finestre, musiche, cinematiche, icone, strumenti) */
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
const VXA={coin:'oro',potion:'pozione',flask:'ampolla',poison:'veleno',sword:'spada',swords:'spade',shield:'scudo',gear:'ingranaggio',scroll:'pergamena',book:'libro',star:'stella',rock:'pietra',crown:'corona',moon:'luna',moonn:'luna',ok:'spunta',chest:'forziere',gem:'xp',play:'gioca',playl:'indietro',skull:'teschio',note:'nota',bolt:'fulmine',film:'ciak',map:'mappa',sel:'cursore',
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
  '🌙':'moon','🎵':'note','♪':'note','🌍':'globe','🗺':'map','⚙':'gear','↶':'undo','↷':'redo','💾':'save','▶':'play','◀':'playl','📜':'scroll','⚔':'swords','🎬':'film','🔣':'vars','🩺':'check','❓':'help','✖':'close','✕':'close',
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
