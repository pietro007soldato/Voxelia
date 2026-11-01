/* Voxelia PSP — interfaccia: barre, minimappa, dialoghi, menu, negozi, mappa */
#include "vx.h"

static void bar(float x,float y,float w,float h,float v,u32 c,u32 c2){if(v<0)v=0;if(v>1)v=1;rect(x-1,y-1,w+2,h+2,0xc0000000);rect(x,y,w,h,0xff302020);rectG(x,y,w*v,h,c,c2);}
static const char*btnX="✕",*btnO="○",*btnS="□",*btnT="△";

/* ---------- barre e minimappa ---------- */
void hudDraw(void){char b[96];
  rect(4,4,150,46,0x90101010);
  bar(8,8,110,7,P.hp/P.mhp,0xff3a3ae0,0xff2020a0);sprintf(b,"%d/%d",(int)P.hp,(int)P.mhp);TSC=.8f;textS(120,5,b,0xffffffff);TSC=1;
  bar(8,18,110,5,P.mp/P.mmp,0xffe0803a,0xffa05020);bar(8,26,110,3,P.sta/100,0xff3ad8ff,0xff20a0d0);
  bar(8,33,110,3,(float)P.xp/xpNeed(P.lv),0xff4ae87a,0xff30a050);
  sprintf(b,"Liv %d   %d oro",P.lv,P.gold);textS(8,37,b,0xff4ad8ff);if(!ZDEF[Zk].inside&&Zk!=Z_DUNG){int mi=(int)fmodf(P.dayT,1440);sprintf(b,"%02d:%02d",mi/60,mi%60);TSC=.8f;textS(122,38,b,0xffe0e0e0);TSC=1;}
  TSC=.85f;sprintf(b,"%s pozioni %d",btnS,P.pot);textS(158,5,b,0xffb0b0ff);if(P.mpot){sprintf(b,"magia %d",P.mpot);textS(158+textW("□ pozioni 00  "),5,b,0xffffc080);}
  sprintf(b,"%s %s",btnT,skillName(P.skill));textS(158,18,b,0xffffd0a0);if(P.skills>1){textS(158,30,"L cambia",0xff909090);}TSC=1;
  /* minimappa */
  float s=N>48?1.2f:1.6f,mx=SCR_W-4-N*s,my=4;rect(mx-2,my-2,N*s+4,N*s+4,0xa0000000);miniDraw(mx,my,s);
  int i;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k==E_PORTAL&&e->sub!=3)rect(mx+e->x*s-1,my+e->y*s-1,3,3,0xffffd060);else if(e->k==E_EN&&e->boss)rect(mx+e->x*s-1.5f,my+e->y*s-1.5f,4,4,0xff3030ff);}
  if((int)(gT*3)&1)rect(mx+P.x*s-1.5f,my+P.y*s-1.5f,4,4,0xffffffff);else rect(mx+P.x*s-1,my+P.y*s-1,3,3,0xff30ff30);
  /* boss */
  for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k==E_EN&&e->boss&&dist2(e->x,e->y,P.x,P.y)<14*14){rect(90,SCR_H-32,300,22,0xb0101010);textC(240,SCR_H-31,e->name,0xff6060ff);bar(100,SCR_H-17,280,5,e->hp/e->mhp,0xff3030e0,0xff2020a0);break;}}
  if(arenaWave&&Zk==Z_ARENA){sprintf(b,"Ondata %d · record %d",arenaWave,P.arenaBest);textC(240,52,b,0xff4ad8ff);}
  /* azione vicina */
  if(nearInter&&state==S_PLAY){Ent*e=nearInter;const char*v=e->k==E_NPC?"Parla":e->k==E_CHEST?"Apri":e->k==E_SHRINE?"Esamina":(e->k==E_PORTAL&&(e->sub==3||e->tag==-1||!strcmp(e->name,"Uscita")))?"Esci":e->sub==5?"Scendi":"Vai";
    if(e->k==E_NPC&&(NDEF[e->id].role==R_TRAG||NDEF[e->id].role==R_CAPT))v="Parla";sprintf(b,"%s %s: %s",btnX,v,e->k==E_PORTAL?e->name:e->k==E_NPC?e->name:"");
    float w=textW(b)+12;rect(240-w/2,SCR_H-56,w,17,0xb0101010);textC(240,SCR_H-54,b,0xffffffff);}
  if(msgT>0){u32 a=(u32)(Min(1,msgT)*255);float w=textW(msgLine)+12;rect(240-w/2,SCR_H-76,w,16,(a*3/4)<<24);textC(240,SCR_H-75,msgLine,(a<<24)|0xffffff);}
}

/* ---------- dialogo ---------- */
void dialogDraw(void){float y=SCR_H-86;frame(12,y,456,80);textS(22,y+5,dlgWho,0xff4ad8ff);
  textBox(22,y+21,436,dlgTxt[dlgI],0xffffffff,4);
  char b[48];if(state==S_CHOICE)sprintf(b,"%s accetta   %s rifiuta",btnX,btnO);else sprintf(b,"%s ▶",btnX);TSC=.85f;textS(462-textW(b),y+64,b,0xffa0e0ff);TSC=1;}

/* ---------- menu ---------- */
static int mTab=0,mSel=0,mScroll=0;
void menuOpen(void){state=S_MENU;mSel=0;mScroll=0;sfx(SFX_MENU);}
static const char*TABS[5]={"Eroe","Zaino","Missioni","Diario","Opzioni"};
static const char*SLOTN[4]={"Arma","Elmo","Corazza","Scudo"};
static void itemLine(float x,float y,const Item*it,int sel){char nm[48],b[96];itemName(it,nm);if(sel)rect(x-4,y-1,400,14,0x60c08040);textS(x,y,nm,RCOL[it->r]);
  sprintf(b,"%s %d%s%s",it->s==0?"ATT":"DIF",itemVal(it),it->cr?"  CRIT":"",it->hp?"  PV":"");if(it->cr)sprintf(b,"%s %d · crit +%d%%",it->s==0?"ATT":"DIF",itemVal(it),it->cr);else if(it->hp)sprintf(b,"%s %d · PV +%d",it->s==0?"ATT":"DIF",itemVal(it),it->hp);
  textS(x+220,y,b,0xffd0d0d0);}
static int optZoom=1;
void menuDraw(void){int i;char b[128];frame(10,10,460,252);
  for(i=0;i<5;i++){u32 c=i==mTab?0xff4ad8ff:0xffa0a0a0;textS(24+i*90,16,TABS[i],c);if(i==mTab)rect(22+i*90,30,textW(TABS[i])+4,2,0xff4ad8ff);}
  TSC=.8f;textS(330,246,"L/R schede · ○ chiudi",0xff909090);TSC=1;
  float y=40;
  if(mTab==0){sprintf(b,"Livello %d   Esperienza %d/%d",P.lv,P.xp,xpNeed(P.lv));textS(24,y,b,0xffffffff);y+=15;
    sprintf(b,"Vita %d/%d   Magia %d/%d   Oro %d",(int)P.hp,(int)P.mhp,(int)P.mp,(int)P.mmp,P.gold);textS(24,y,b,0xffffffff);y+=15;
    sprintf(b,"Attacco %d   Difesa %d   Critico %d%%",(int)pAtk(),(int)pDef(),(int)pCrit());textS(24,y,b,0xffa0ffa0);y+=20;
    for(i=0;i<4;i++){textS(24,y,SLOTN[i],0xff909090);if(P.has[i])itemLine(90,y,&P.eq[i],0);else textS(90,y,"—",0xff808080);y+=15;}
    y+=6;sprintf(b,"Pozioni %d · Pozioni di magia %d · Abilità: %d",P.pot,P.mpot,P.skills);textS(24,y,b,0xffffffff);y+=15;
    {int c=0;for(i=0;i<6;i++)if(P.shards&(1<<i))c++;sprintf(b,"Frammenti della Corona: %d/6",c);textS(24,y,b,0xff4ad8ff);y+=15;}
    sprintf(b,"Nemici sconfitti %d · Forzieri aperti %d · Cadute %d",P.kills,P.chestsOpened,P.deaths);textS(24,y,b,0xffc0c0c0);y+=15;
    int m=(int)(P.playT/60);sprintf(b,"Tempo di gioco %d h %02d min · Record nell'arena: ondata %d",m/60,m%60,P.arenaBest);textS(24,y,b,0xffc0c0c0);}
  else if(mTab==1){if(!P.ninv){textS(24,y,"Lo zaino è vuoto. Gli oggetti si trovano nei forzieri e dai nemici.",0xffc0c0c0);return;}
    for(i=mScroll;i<P.ninv&&i<mScroll+11;i++){itemLine(28,y,&P.inv[i],i==mSel);y+=15;}
    const Item*it=&P.inv[mSel];sprintf(b,"%s equipaggia (al posto di: %s %d)   %s getta",btnX,P.has[it->s]?SLOTN[it->s]:"niente",P.has[it->s]?itemVal(&P.eq[it->s]):0,btnS);TSC=.85f;textS(24,226,b,0xffa0e0ff);TSC=1;}
  else if(mTab==2){if(!P.nq){textS(24,y,"Nessuna missione in corso. Cerca i personaggi con il punto esclamativo !",0xffc0c0c0);y+=15;}
    for(i=0;i<P.nq;i++){const QuestDef*d=&QDEF[P.qact[i]];sprintf(b,"%s  (%d/%d)",d->ti,P.qn[i],d->n);textS(24,y,b,P.qn[i]>=d->n?0xff7aff7a:0xff4ad8ff);y+=13;y+=13*textBox(34,y,420,d->tx,0xffd0d0d0,2)+4;if(y>230)break;}}
  else if(mTab==3){const char*st=P.st==0?"Il Re Aldric vuole parlarti: vai al castello, a nord della piazza.":P.st==1?"Trova i sei frammenti della Corona di Voxel nei dungeon e riportali al Re.":P.st==2?"Il portale per la Cittadella del Vuoto è aperto nella sala del trono. Sconfiggi Malakar.":"Hai sconfitto Malakar. Aldoria è salva, ma i dungeon rinascono più forti.";
    textS(24,y,"La Corona di Voxel",0xff4ad8ff);y+=14;y+=13*textBox(24,y,430,st,0xffffffff,3)+6;
    for(i=0;i<6;i++){sprintf(b,"%s %s%s",P.shards&(1<<i)?"★":"·",DDEF[i].n,P.done[i]?"":"");textS(30+(i%2)*215,y+(i/2)*13,b,P.shards&(1<<i)?0xff4ad8ff:0xff909090);}y+=46;
    const char*ol=P.ol==0?"Al Porto la Capitana Marina cerca chi la accompagni a Thalassa (dal livello 10).":P.ol==1?"A Thalassa, parla con il Cancelliere Oreste nel palazzo.":P.ol==2?"Trova i tre Sigilli di Giada nei santuari della Giungla di Smeraldo.":P.ol==3?"Entra nel Tempio di Giada e affronta Quetzal, il Serpente di Giada.":P.ol==4?"Torna a Thalassa: la Regina Nerea ti aspetta.":"Capitolo completato: sei l'Eroe di Thalassa.";
    textS(24,y,"Il regno oltre il mare",0xff4ad8ff);y+=14;textBox(24,y,430,ol,0xffffffff,3);}
  else{const char*O[4]={"Salva la partita","Zoom della visuale","Comandi","Torna al titolo"};
    for(i=0;i<4;i++){if(i==mSel)rect(20,y+i*18-1,300,15,0x60c08040);textS(28,y+i*18,O[i],0xffffffff);}
    sprintf(b,"%s",optZoom==0?"vicino":optZoom==1?"normale":"lontano");textS(200,y+18,b,0xff4ad8ff);
    if(mSel==2){textBox(24,y+80,430,"Levetta o croce: muoviti · ✕ attacca, parla, apri · ○ capriola · □ pozione · △ abilità · L cambia abilità · R tieni premuto per correre · START menu · SELECT mappa",0xffd0d0d0,4);}}
}
void menuUpdate(void){if(PRESS(PSP_CTRL_CIRCLE)||PRESS(PSP_CTRL_START)){state=S_PLAY;return;}
  if(PRESS(PSP_CTRL_LTRIGGER)){mTab=(mTab+4)%5;mSel=0;mScroll=0;sfx(SFX_MENU);}if(PRESS(PSP_CTRL_RTRIGGER)){mTab=(mTab+1)%5;mSel=0;mScroll=0;sfx(SFX_MENU);}
  int n=mTab==1?P.ninv:mTab==4?4:0;if(n){if(PRESS(PSP_CTRL_DOWN)){mSel=(mSel+1)%n;sfx(SFX_MENU);}if(PRESS(PSP_CTRL_UP)){mSel=(mSel+n-1)%n;sfx(SFX_MENU);}}
  if(mSel<mScroll)mScroll=mSel;if(mSel>=mScroll+11)mScroll=mSel-10;
  if(mTab==1&&P.ninv){if(mSel>=P.ninv)mSel=P.ninv-1;if(PRESS(PSP_CTRL_CROSS))equip(mSel);if(PRESS(PSP_CTRL_SQUARE)){P.inv[mSel]=P.inv[--P.ninv];if(mSel>=P.ninv&&mSel)mSel--;}}
  if(mTab==4){if(PRESS(PSP_CTRL_CROSS)){if(mSel==0){saveGame();banner("Partita salvata","");state=S_PLAY;}else if(mSel==1){optZoom=(optZoom+1)%3;ZOOM=optZoom==0?.9f:optZoom==1?.72f:.56f;}else if(mSel==3){saveGame();state=S_TITLE;}}}}

/* ---------- negozi ---------- */
static int shRole=0,shSel=0,shTab=0;static Item stock[8];static int nstock=0;
void shopOpen(int role){shRole=role;shSel=0;shTab=0;state=S_SHOP;int i;nstock=0;
  if(role==R_SMITH||role==R_ZEFIRO){int lv=P.lv+(role==R_ZEFIRO?2:0);for(i=0;i<6;i++){itemGen(&stock[i],lv,role==R_ZEFIRO?1:0,i%4);stock[i].p=(int)(stock[i].p*1.6f);}nstock=6;}
  if(role==R_SHOP){for(i=0;i<4;i++){itemGen(&stock[i],P.lv,0,-1);stock[i].p=(int)(stock[i].p*1.4f);}nstock=4;}
  if(role==R_ARENA){state=S_SHOP;}}
static const char*shopName(void){switch(shRole){case R_SMITH:return "Fucina di Borin";case R_ALCH:return "Bottega dell'Erborista";case R_SHOP:return "Banco di Ugo";case R_INN:return "Locanda";case R_HEAL:return "Tempio della Luce";case R_ZEFIRO:return "Bancarella di Zefiro";case R_ARENA:return "Colosseo";}return "";}
typedef struct{const char*n;const char*d;int p;} SimpleOff;
static int simpleOffers(SimpleOff*o){int n=0;
  if(shRole==R_ALCH||shRole==R_ZEFIRO){o[n++]=(SimpleOff){"Pozione di vita","Ridà quasi metà della vita (□)",25+P.lv*2};o[n++]=(SimpleOff){"Pozione di magia","Riempie la magia (□ quando la vita è piena)",30+P.lv*2};o[n++]=(SimpleOff){"Cinque pozioni di vita","Conviene!",110+P.lv*9};}
  if(shRole==R_INN){o[n++]=(SimpleOff){"Riposa una notte","Vita e magia piene, e la partita viene salvata",15};o[n++]=(SimpleOff){"Un boccale di birra","Ascolta le voci della taverna",3};}
  if(shRole==R_HEAL){o[n++]=(SimpleOff){"Benedizione della Luce","Vita e magia piene, gratis",0};}
  if(shRole==R_ARENA){o[n++]=(SimpleOff){"Entra nell'arena","Ondate di nemici sempre più forti: oro ed esperienza a ogni ondata",0};}
  if(shRole==R_SMITH){int s;for(s=0;s<4;s++)if(P.has[s]&&P.eq[s].up<5){static char nm[4][48];sprintf(nm[s],"Potenzia %s",SLOTN[s]);o[n++]=(SimpleOff){nm[s],"+12% di forza per livello, fino a +5",(int)(40+itemVal(&P.eq[s])*6*(P.eq[s].up+1))};}}
  return n;}
static int upSlot(int k){int s,c=0;for(s=0;s<4;s++)if(P.has[s]&&P.eq[s].up<5){if(c==k)return s;c++;}return -1;}
void shopDraw(void){char b[128];int i;frame(20,20,440,232);textS(32,26,shopName(),0xff4ad8ff);sprintf(b,"%d oro",P.gold);textS(440-textW(b),26,b,0xff4ad8ff);
  int sell=shRole==R_SHOP&&shTab==1;if(shRole==R_SHOP){textS(200,26,shTab?"[Vendi]":"[Compra]",0xffffffff);TSC=.8f;textS(270,28,"L/R cambia",0xff909090);TSC=1;}
  SimpleOff o[8];int no=simpleOffers(o);float y=46;int k=0;
  if(sell){for(i=0;i<P.ninv&&i<12;i++){itemLine(36,y,&P.inv[i],shSel==i);sprintf(b,"%d oro",P.inv[i].p/2);textS(400,y,b,0xff4ad8ff);y+=15;}if(!P.ninv)textS(36,y,"Non hai niente da vendere.",0xffc0c0c0);}
  else{for(i=0;i<no;i++,k++){if(shSel==k)rect(30,y-1,420,14,0x60c08040);textS(36,y,o[i].n,0xffffffff);sprintf(b,o[i].p?"%d oro":"gratis",o[i].p);textS(400,y,b,0xff4ad8ff);TSC=.8f;textS(46,y+12,o[i].d,0xffb0b0b0);TSC=1;y+=26;}
    for(i=0;i<nstock;i++,k++){itemLine(36,y,&stock[i],shSel==k);sprintf(b,"%d oro",stock[i].p);textS(400,y,b,0xff4ad8ff);y+=15;}}
  sprintf(b,"%s %s   ○ esci",btnX,sell?"vendi":"compra");TSC=.85f;textS(32,236,b,0xffa0e0ff);TSC=1;
  if(!sell&&shSel>=no&&shSel-no<nstock){const Item*it=&stock[shSel-no];if(P.has[it->s]){sprintf(b,"Ora hai: %s %d",SLOTN[it->s],itemVal(&P.eq[it->s]));TSC=.85f;textS(200,236,b,0xffc0c0c0);TSC=1;}}}
void shopUpdate(void){SimpleOff o[8];int no=simpleOffers(o);int sell=shRole==R_SHOP&&shTab==1;int n=sell?P.ninv:no+nstock;
  if(PRESS(PSP_CTRL_CIRCLE)){state=S_PLAY;return;}
  if(shRole==R_SHOP&&(PRESS(PSP_CTRL_LTRIGGER)||PRESS(PSP_CTRL_RTRIGGER))){shTab^=1;shSel=0;sfx(SFX_MENU);}
  if(n){if(PRESS(PSP_CTRL_DOWN)){shSel=(shSel+1)%n;sfx(SFX_MENU);}if(PRESS(PSP_CTRL_UP)){shSel=(shSel+n-1)%n;sfx(SFX_MENU);}}if(shSel>=n)shSel=n?n-1:0;
  if(!PRESS(PSP_CTRL_CROSS)||!n)return;
  if(sell){P.gold+=P.inv[shSel].p/2;P.inv[shSel]=P.inv[--P.ninv];sfx(SFX_COIN);if(shSel>=P.ninv&&shSel)shSel--;return;}
  if(shSel<no){SimpleOff*q=&o[shSel];if(P.gold<q->p){msgT=2;strcpy(msgLine,"Non hai abbastanza oro");return;}P.gold-=q->p;sfx(SFX_COIN);
    if(shRole==R_ALCH||shRole==R_ZEFIRO){if(shSel==0)P.pot++;else if(shSel==1)P.mpot++;else P.pot+=5;}
    else if(shRole==R_INN){if(shSel==0){P.hp=P.mhp;P.mp=P.mmp;P.dayT=(int)(P.dayT/1440+1)*1440+7*60;saveGame();banner("Buona notte","Ti svegli riposato · partita salvata");state=S_PLAY;}
      else{const char*R[4]={"«Dicono che nella Cittadella le mura si muovano da sole.»","«La Capitana Marina cerca gente coraggiosa per Thalassa.»","«Il fabbro Borin può potenziare l'armatura fino a +5.»","«Nei forzieri dei dungeon c'è roba rara.»"};state=S_PLAY;say("Avventore",R[irand(0,3)]);}}
    else if(shRole==R_HEAL){P.hp=P.mhp;P.mp=P.mmp;burst(P.x,P.y,10,20,C(0xfff0a0),2);state=S_PLAY;say("Sacerdotessa Lia","Che la Luce ti protegga, viandante.");}
    else if(shRole==R_ARENA){state=S_PLAY;if(Zk!=Z_ARENA)zoneLoad(Z_ARENA,-1,0,Z_TOWN);arenaStart();}
    else if(shRole==R_SMITH){int s=upSlot(shSel);if(s>=0){P.eq[s].up++;recalc();burst(P.x,P.y,12,14,C(0xffb04a),1.5f);banner("Potenziato!",P.eq[s].n);}}
    return;}
  {Item*it=&stock[shSel-no];if(P.gold<it->p){msgT=2;strcpy(msgLine,"Non hai abbastanza oro");return;}if(P.ninv>=INV_MAX){msgT=2;strcpy(msgLine,"Lo zaino è pieno");return;}
    P.gold-=it->p;Item c=*it;c.p=c.p/2;invAdd(&c);sfx(SFX_COIN);stock[shSel-no]=stock[--nstock];banner("Comprato","Lo trovi nello zaino (START)");}}

/* ---------- mappa grande ---------- */
void mapDraw(void){char b[64];frame(80,10,320,252);zoneName(b);textC(240,14,b,0xff4ad8ff);float s=(float)230/N,mx=240-N*s/2,my=30;miniDraw(mx,my,s);
  int i;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k==E_PORTAL&&e->sub!=3){rect(mx+e->x*s-2,my+e->y*s-2,5,5,0xffffd060);}else if(e->k==E_NPC&&NDEF[e->id].role)rect(mx+e->x*s-1.5f,my+e->y*s-1.5f,4,4,0xffff9a4a);else if(e->k==E_EN&&e->boss)rect(mx+e->x*s-2,my+e->y*s-2,5,5,0xff3030ff);else if(e->k==E_SHRINE)rect(mx+e->x*s-2,my+e->y*s-2,5,5,0xff7aff3a);}
  rect(mx+P.x*s-2.5f,my+P.y*s-2.5f,6,6,0xffffffff);rect(mx+P.x*s-1.5f,my+P.y*s-1.5f,4,4,0xff30c030);
  TSC=.8f;textS(90,248,"giallo: uscite · arancio: negozi e personaggi importanti · rosso: boss",0xffb0b0b0);TSC=1;}
