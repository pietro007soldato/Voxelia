/* Voxelia PSP — prova automatica (solo nella build di prova, -DAUTOTEST): gira il gioco da solo,
   scatta foto dello schermo, combatte, entra nelle porte e scrive un registro. Nel gioco vero non c'è. */
#ifdef AUTOTEST
#include "vx.h"
#include <pspdisplay.h>
#include <stdarg.h>
static FILE*LOG;
void tlog(const char*f,...){char b[256];va_list a;va_start(a,f);vsnprintf(b,sizeof b,f,a);va_end(a);printf("%s\n",b);if(LOG){fprintf(LOG,"%s\n",b);fflush(LOG);}}
static int shotN=0;
void shot(const char*name){void*top;int bw,pf;sceDisplayGetFrameBuf(&top,&bw,&pf,0);if(!top)return;
  u32*px=(u32*)((u32)top|0x40000000);char fn[64];sprintf(fn,"shots/%02d_%s.bmp",shotN++,name);FILE*f=fopen(fn,"wb");if(!f){tlog("foto: non riesco a scrivere %s",fn);return;}
  int W=480,Hh=272,row=W*3,sz=54+row*Hh;unsigned char h[54]={'B','M'};*(int*)(h+2)=sz;*(int*)(h+10)=54;*(int*)(h+14)=40;*(int*)(h+18)=W;*(int*)(h+22)=Hh;*(short*)(h+26)=1;*(short*)(h+28)=24;*(int*)(h+34)=row*Hh;
  fwrite(h,54,1,f);static unsigned char line[480*3];int x,y;for(y=Hh-1;y>=0;y--){for(x=0;x<W;x++){u32 c=px[y*bw+x];line[x*3]=(c>>16)&0xff;line[x*3+1]=(c>>8)&0xff;line[x*3+2]=c&0xff;}fwrite(line,row,1,f);}fclose(f);tlog("foto %s",fn);}

/* ---------- il pilota automatico ---------- */
static char pend[8][48];static float pendT[8];static int npend=0;
static void shotL(const char*n){if(npend<8){strncpy(pend[npend],n,47);pendT[npend]=.3f;npend++;}}
extern Pad pad;extern int dlgN;
static int step=0;static float stT=0;static int godMode=1;static float fpsAcc=0;static int fpsN=0;
static u32 want=0;static float wantAx=0,wantAy=0;
static void press(u32 b){want|=b;}
static void moveTo(float tx,float ty){float dx=tx-P.x,dy=ty-P.y,l=sqrtf(dx*dx+dy*dy);if(l<.2f){wantAx=wantAy=0;return;}dx/=l;dy/=l;float ux=dx-dy,uy=(dx+dy)*.5f,m=sqrtf(ux*ux+uy*uy);wantAx=ux/m;wantAy=uy/m;}
static Ent*nearestEnemy(float r){int i;Ent*b=0;float bd=r*r;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k!=E_EN)continue;float d=dist2(e->x,e->y,P.x,P.y);if(d<bd){bd=d;b=e;}}return b;}
static float stuckT=0,lx=0,ly=0;static float rx=0,ry=0;
static void fight(void){Ent*e=nearestEnemy(30);if(!e){if(stT>2&&((int)(stT*2)%6)==0){rx=irand(2,N-3);ry=irand(2,N-3);}moveTo(rx,ry);return;}
  float d=sqrtf(dist2(e->x,e->y,P.x,P.y));if(d>1.1f)moveTo(e->x,e->y);else{wantAx=wantAy=0;float a=atan2f(e->y-P.y,e->x-P.x);extern float fa;fa=a;P.dir=(int)((a/(PI/2))+4.5f)&3;if(((int)(stT*10))%4==0)press(PSP_CTRL_CROSS);}
  if(((int)(stT*10))%37==0&&P.mp>20)press(PSP_CTRL_TRIANGLE);
  if(P.hp<P.mhp*.35f)press(PSP_CTRL_SQUARE);
  /* se è bloccato, si sposta di lato */
  if(fabsf(P.x-lx)+fabsf(P.y-ly)<.01f&&d>1.1f){stuckT+=dt;if(stuckT>1.5f){P.x=e->x;P.y=e->y+1;if(!walkF(P.x,P.y,.25f)){P.x=e->x;P.y=e->y;}stuckT=0;}}else stuckT=0;lx=P.x;ly=P.y;}
static void tp(float x,float y,int dir){P.x=x;P.y=y;P.dir=dir;extern float fa;fa=dir*PI/2;camX=x;camY=y;}
static int countK(int k){int i,n=0;for(i=0;i<nents;i++)if(ents[i].k==k)n++;return n;}
static Ent*findPortal(int tag){int i;for(i=0;i<nents;i++)if(ents[i].k==E_PORTAL&&ents[i].tag==tag)return &ents[i];return 0;}
static Ent*findNpcRole(const char*id){int i;for(i=0;i<nents;i++)if(ents[i].k==E_NPC&&!strcmp(NDEF[ents[i].id].id,id))return &ents[i];return 0;}
static void standBefore(Ent*e){float bx=e->x,by=e->y;static const int D4[4][2]={{0,1},{1,0},{-1,0},{0,-1}};int k;for(k=0;k<4;k++){float x=bx+D4[k][0],y=by+D4[k][1];if(walkF(x,y,.25f)){tp(x,y,0);extern float fa;fa=atan2f(by-y,bx-x);P.dir=(int)((fa/(PI/2))+4.5f)&3;return;}}tp(bx,by+1,3);}
static int zoneT(int z,int dg,int fl){zoneLoad(z,dg,fl,-1);return 0;}
static void report(const char*what){tlog("[%s] vertici=%d zona=%d dungeon=%d piano=%d pos=%.1f,%.1f vita=%d/%d liv=%d oro=%d nemici=%d uccisi=%d entità=%d",what,vstatLast,Zk,Zdung,Zfloor,P.x,P.y,(int)P.hp,(int)P.mhp,P.lv,P.gold,countK(E_EN),P.kills,nents);}

/* ---------- camminare davvero fino a una casella (percorso sulla griglia) ---------- */
static short PV[MAXN*MAXN];static int pathX[400],pathY[400],pathN=0,pathI=0,ptx=-1,pty=-1;
static int planPath(int tx,int ty){int sx=(int)P.x,sy=(int)P.y,i,h=0,t=0;static int Q[MAXN*MAXN];for(i=0;i<MAXN*MAXN;i++)PV[i]=-2;PV[sy*MAXN+sx]=-1;Q[t++]=sy*MAXN+sx;int found=-1;
  while(h<t){int c=Q[h++],x=c%MAXN,y=c/MAXN,k;if(abs(x-tx)+abs(y-ty)<=0){found=c;break;}static const int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
    for(k=0;k<4;k++){int u=x+dx[k],v=y+dy[k];if(u<0||v<0||u>=N||v>=N||PV[v*MAXN+u]!=-2)continue;if(!walk(u,v)&&!(u==tx&&v==ty))continue;PV[v*MAXN+u]=c;Q[t++]=v*MAXN+u;}}
  if(found<0)return 0;int tmp[400],n=0;for(i=found;i>=0&&n<400;i=PV[i])tmp[n++]=i;pathN=0;for(i=n-1;i>=0;i--){pathX[pathN]=tmp[i]%MAXN;pathY[pathN]=tmp[i]/MAXN;pathN++;}pathI=1;ptx=tx;pty=ty;return 1;}
/* ritorna 1 quando è arrivato accanto alla casella */
static int goTo(int tx,int ty){if(tx!=ptx||ty!=pty){if(!planPath(tx,ty)){tlog("PERCORSO IMPOSSIBILE verso %d,%d da %.1f,%.1f zona %d",tx,ty,P.x,P.y,Zk);ptx=tx;pty=ty;pathN=0;return 2;}}
  if(pathI>=pathN-1){float d=fabsf(P.x-(tx+.5f))+fabsf(P.y-(ty+.5f));extern float fa;fa=atan2f(ty+.5f-P.y,tx+.5f-P.x);P.dir=(int)((fa/(PI/2))+4.5f)&3;return d<1.6f?1:(moveTo(tx+.5f,ty+.5f),0);}
  float wx=pathX[pathI]+.5f,wy=pathY[pathI]+.5f;if(fabsf(P.x-wx)+fabsf(P.y-wy)<.3f){pathI++;return 0;}moveTo(wx,wy);return 0;}
static int nextPortalSub(int sub){int i;for(i=0;i<nents;i++)if(ents[i].k==E_PORTAL&&ents[i].sub==sub)return i;return -1;}
/* il copione: ogni passo dura un po' e fa una cosa */
#define AT(n) case n:
int autoDrive(void){want=0;wantAx=wantAy=0;stT+=dt;
  {int i;for(i=0;i<npend;i++){pendT[i]-=dt;if(pendT[i]<=0){shot(pend[i]);pend[i][0]=0;}}int j=0;for(i=0;i<npend;i++)if(pend[i][0]){if(i!=j){strcpy(pend[j],pend[i]);pendT[j]=pendT[i];}j++;}npend=j;}
  if(godMode&&state==S_PLAY&&P.hp<P.mhp*.3f)P.hp=P.mhp;
  fpsAcc+=dt;fpsN++;
  #define NEXT(t) if(stT>(t)){step++;stT=0;}
  switch(step){
  AT(0) if(!LOG){LOG=fopen("autotest.log","w");sceIoMkdir("shots",0777);tlog("AVVIO prova automatica");}NEXT(1.0f);break;
  AT(1) if(stT<.1f)shotL("titolo");NEXT(.6f);break;
  AT(2) if(stT<.05f)press(PSP_CTRL_CROSS);NEXT(.4f);break;
  AT(3) if(stT<.05f)shotL("difficolta");if(stT>.1f&&stT<.15f)press(PSP_CTRL_CROSS);NEXT(.8f);break;
  AT(4) if(stT<.05f){shotL("dialogo_iniziale");report("nuova partita");}if(stT>.3f&&stT<.35f)press(PSP_CTRL_CROSS);if(stT>.6f){step=50;stT=0;}break;
  AT(50) {extern int hudOff;if(stT<.05f){hudOff=1;tp(26.5f,24.5f,1);P.dayT=17*60;}if(stT>.5f&&stT<.55f)shot("pulita_piazza");if(stT>.6f&&stT<.65f){tp(24.5f,14.5f,1);}if(stT>1.1f&&stT<1.15f)shot("pulita_castello");if(stT>1.2f){hudOff=0;P.dayT=11*60;step=5;stT=0;}}break;
  AT(5) moveTo(24.5f,26);if(stT>2.5f&&stT<2.55f){shotL("citta_camminata");report("camminata");}NEXT(3);break;
  AT(6) if(stT<.05f){Ent*p=findPortal(Z_IN_CASTLE);if(p)standBefore(p);}if(stT>.3f&&stT<.35f)press(PSP_CTRL_CROSS);NEXT(1);break;
  AT(7) if(stT<.05f){report("castello");shotL("castello");Ent*k=findNpcRole("re");if(k)standBefore(k);}if(stT>.3f&&stT<.35f)press(PSP_CTRL_CROSS);if(stT>.6f&&stT<.65f)shotL("re_storia");if(stT>.8f&&stT<.85f)press(PSP_CTRL_CROSS);NEXT(1.2f);break;
  AT(8) if(stT<.05f){report("dopo il re");Ent*p=findPortal(Z_TOWN);if(p)standBefore(p);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);NEXT(.8f);break;
  AT(9) if(stT<.05f){report("di nuovo in città");shotL("citta_fuori_castello");Ent*p=findPortal(Z_IN_TAVERN);if(p)standBefore(p);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);NEXT(.8f);break;
  AT(10) if(stT<.05f){report("taverna");Ent*g=findNpcRole("gilda");if(g)standBefore(g);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);if(stT>.5f&&stT<.55f)shotL("taverna_missione");if(stT>.7f&&stT<.75f)press(PSP_CTRL_CROSS);NEXT(1);break;
  AT(11) if(stT<.05f){tlog("missioni attive: %d",P.nq);zoneT(Z_IN_SMITH,-1,0);Ent*b=findNpcRole("borin");if(b)standBefore(b);P.gold=2000;}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);if(stT>.5f&&stT<.55f)shotL("fucina_negozio");
    if(stT>.6f&&stT<.65f)press(PSP_CTRL_DOWN);if(stT>.7f&&stT<.75f)press(PSP_CTRL_CROSS);if(stT>.9f&&stT<.95f)press(PSP_CTRL_CIRCLE);NEXT(1.2f);break;
  AT(12) if(stT<.05f){tlog("zaino dopo l'acquisto: %d oggetti, oro %d",P.ninv,P.gold);zoneT(Z_IN_ALCH,-1,0);shotL("bottega");zoneT(Z_IN_TEMPLE,-1,0);}if(stT>.3f&&stT<.35f)shotL("tempio");NEXT(.6f);break;
  AT(13) if(stT<.05f){zoneT(Z_TOWN,-1,0);tp(24.5f,30.5f,1);press(PSP_CTRL_START);}if(stT>.3f&&stT<.35f)shotL("menu_eroe");if(stT>.4f&&stT<.45f)press(PSP_CTRL_RTRIGGER);if(stT>.6f&&stT<.65f)shotL("menu_zaino");
    if(stT>.7f&&stT<.75f)press(PSP_CTRL_RTRIGGER);if(stT>.9f&&stT<.95f)shotL("menu_missioni");if(stT>1&&stT<1.05f)press(PSP_CTRL_RTRIGGER);if(stT>1.2f&&stT<1.25f)shotL("menu_diario");if(stT>1.3f&&stT<1.35f)press(PSP_CTRL_RTRIGGER);if(stT>1.5f&&stT<1.55f)shotL("menu_opzioni");
    if(stT>1.6f&&stT<1.65f)press(PSP_CTRL_CIRCLE);NEXT(1.8f);break;
  AT(14) if(stT<.05f)press(PSP_CTRL_SELECT);if(stT>.3f&&stT<.35f)shot("mappa");if(stT>.6f&&stT<.65f)press(PSP_CTRL_SELECT);NEXT(.8f);break;
  AT(15) if(stT<.05f){P.dayT=22*60;}if(stT>.4f&&stT<.45f)shot("citta_notte");if(stT>.5f)P.dayT=11*60;if(stT>.7f){step=100;stT=0;}break;
  /* viaggio a piedi: castello, porta nord, foresta, Tana dei Goblin, boss, ritorno */
  AT(100) {Ent*p=findPortal(Z_IN_CASTLE);if(stT<.05f){zoneT(Z_TOWN,-1,0);tp(24.5f,33.5f,3);report("viaggio: partenza");}int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>40){tlog("viaggio: castello non raggiunto");step++;stT=0;}}break;
  AT(101) if(stT>.5f){if(stT<.6f)report("viaggio: nel castello");Ent*p=findPortal(Z_TOWN);int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>30){tlog("viaggio: uscita castello non raggiunta");step++;stT=0;}}break;
  AT(102) if(stT>.5f){Ent*p=findPortal(Z_FOREST);if(!p){step++;stT=0;break;}int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>60){tlog("viaggio: porta nord non raggiunta");step++;stT=0;}}break;
  AT(103) if(stT>.5f){if(stT<.6f)report("viaggio: nella foresta");int i=nextPortalSub(2);if(i<0){tlog("viaggio: niente Tana");step++;break;}Ent*p=&ents[i];int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);press(PSP_CTRL_CIRCLE);step++;stT=0;}if(r==2||stT>80){tlog("viaggio: Tana non raggiunta");step++;stT=0;}}break;
  AT(104) if(stT>.5f){if(stT<.6f){report("viaggio: Tana piano 1");}int i=nextPortalSub(5);if(i<0){step++;break;}Ent*p=&ents[i];int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>80){tlog("viaggio: scale non raggiunte");step++;stT=0;}}break;
  AT(105) if(stT>.5f){if(stT<.6f){report("viaggio: Tana piano 2");P.lv=Max(P.lv,14);recalc();}fight();int i;for(i=0;i<nents;i++)if(ents[i].k==E_PORTAL&&ents[i].tag==-1)break;
    if(i<nents){Ent*p=&ents[i];int r=goTo((int)p->x,(int)p->y);if(r==1){{extern Ent*dbgFind(void);Ent*q=dbgFind();tlog("dbgFind: %d (%s)",q?q->k:-1,q?q->name:"");}tlog("uscita: vicino=%d stato=%d pos %.1f,%.1f portale %.1f,%.1f k=%d nents=%d idx=%d fa=%f",nearInter?nearInter->k:-1,state,P.x,P.y,p->x,p->y,p->k,nents,i,(double)({extern float fa;fa;}));press(PSP_CTRL_CROSS);step++;stT=0;}}if(stT>120){tlog("viaggio: boss non sconfitto in tempo");step++;stT=0;}}break;
  AT(106) if(stT>.5f){if(stT<.6f)report("viaggio: uscito dalla Tana");Ent*p=findPortal(Z_TOWN);if(!p){tlog("viaggio: nessuna porta per Aldoria qui (zona %d)",Zk);step++;stT=0;break;}int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>80){tlog("viaggio: ritorno ad Aldoria non riuscito");step++;stT=0;}}break;
  AT(107) if(stT>.5f){if(stT<.6f)report("viaggio: ad Aldoria");Ent*k;Ent*p=findPortal(Z_IN_CASTLE);if(!p){step++;stT=0;break;}int r=goTo((int)p->x,(int)p->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>60){step++;stT=0;}(void)k;}break;
  AT(108) if(stT>.5f){Ent*k=findNpcRole("re");if(!k){step++;stT=0;break;}int r=goTo((int)k->x,(int)k->y);if(r==1){press(PSP_CTRL_CROSS);step++;stT=0;}if(r==2||stT>30){step++;stT=0;}}break;
  AT(109) if(stT>.4f&&stT<.45f){shot("viaggio_re");tlog("viaggio finito: frammenti %d, storia %d",P.shards,P.st);}if(stT>.6f&&state!=S_PLAY&&((int)(stT*10))%3==0)press(PSP_CTRL_CROSS);if(stT>2){step=16;stT=0;}break;
  AT(16) if(stT<.05f){zoneT(Z_FOREST,-1,0);report("foresta");shotL("foresta");}fight();if(stT>8&&stT<8.05f){shotL("foresta_combattimento");report("foresta dopo 8s");}NEXT(16);break;
  AT(17) if(stT<.05f){report("foresta fine");P.lv=12;recalc();P.hp=P.mhp;zoneT(Z_DESERT,-1,0);shotL("deserto");}fight();if(stT>6&&stT<6.05f)shotL("deserto_combattimento");NEXT(10);break;
  AT(18) if(stT<.05f){report("deserto fine");zoneT(Z_PEAKS,-1,0);shotL("picchi");}fight();if(stT>6&&stT<6.05f)shotL("picchi_combattimento");NEXT(10);break;
  AT(19) if(stT<.05f){report("picchi fine");zoneT(Z_DUNG,dungIdx("tana"),1);shotL("tana_piano1");report("tana 1");}fight();if(stT>5&&stT<5.05f)shotL("tana_combattimento");NEXT(10);break;
  AT(20) if(stT<.05f){zoneT(Z_DUNG,dungIdx("tana"),2);report("tana 2 (boss)");P.lv=20;recalc();P.hp=P.mhp;}fight();if(stT>3&&stT<3.05f)shotL("tana_boss");if(P.shards&1){tlog("frammento della Tana preso dopo %.1fs",stT);shotL("tana_boss_vinto");step++;stT=0;}NEXT(40);break;
  AT(21) {static const char*D[8]={"tana","cripta","piramide","cristallo","fucina","abisso","cittadella","tempio48"};static int i=0;
      if(stT<.05f){zoneT(Z_DUNG,dungIdx(D[i]),1);}if(stT>.5f&&stT<.55f){char b[48];sprintf(b,"dungeon_%s",D[i]);report(b);shot(b);}if(stT>.7f){i++;stT=0;if(i>=8)step++;}}break;
  AT(22) if(stT<.05f){zoneT(Z_PORTO,-1,0);shotL("porto");report("porto");Ent*m=findNpcRole("marina");if(m)standBefore(m);}if(stT>.3f&&stT<.35f)press(PSP_CTRL_CROSS);if(stT>.6f&&stT<.65f)shotL("marina");if(stT>.8f&&stT<.85f)press(PSP_CTRL_CROSS);NEXT(1.5f);break;
  AT(23) if(stT<.05f){report("dopo la nave");shotL("thalassa");}if(stT>.2f&&stT<.25f){Ent*p=findPortal(Z_IN_PAL48);if(p)standBefore(p);}if(stT>.4f&&stT<.45f)press(PSP_CTRL_CROSS);NEXT(1);break;
  AT(24) if(stT<.05f){report("palazzo");shotL("palazzo");Ent*o=findNpcRole("oreste");if(o)standBefore(o);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);if(stT>.5f&&stT<.55f)shotL("oreste");if(stT>.7f&&stT<.75f)press(PSP_CTRL_CROSS);NEXT(1);break;
  AT(25) if(stT<.05f){tlog("Thalassa ol=%d",P.ol);zoneT(Z_JUNGLE,-1,0);shotL("giungla");report("giungla");}fight();if(stT>5&&stT<5.05f)shotL("giungla_combattimento");NEXT(8);break;
  AT(26) {static int si=0;Ent*s=0;int i;for(i=0;i<nents;i++)if(ents[i].k==E_SHRINE&&ents[i].data==si)s=&ents[i];
    if(stT<.05f&&s)standBefore(s);if(stT>.1f&&stT<.15f)press(PSP_CTRL_CROSS);if(stT>.3f&&stT<.35f){press(PSP_CTRL_CROSS);if(si==0)shotL("santuario");}
    if(stT>.4f&&stT<.5f){int k;for(k=0;k<nents;k++)if(ents[k].k==E_EN&&ents[k].dst)ents[k].hp=1;}if(stT>.4f&&stT<9)fight();if(stT>9&&stT<9.05f&&s)standBefore(s);if(stT>9.1f&&stT<9.15f)press(PSP_CTRL_CROSS);if(stT>9.3f&&stT<9.35f)press(PSP_CTRL_CROSS);if(stT>9.5f&&stT<9.55f)press(PSP_CTRL_CROSS);
    if(stT>10){tlog("sigilli: %d",P.sig);si++;stT=0;if(si>=3)step++;}}break;
  AT(27) if(stT<.05f){tlog("dopo i santuari ol=%d sig=%d",P.ol,P.sig);Ent*p=findPortal(Z_DUNG);tlog("tempio %s",p&&!p->lock?"aperto":"chiuso");if(p)standBefore(p);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);NEXT(.8f);break;
  AT(28) if(stT<.05f){report("tempio di giada");shotL("tempio_giada");zoneT(Z_DUNG,dungIdx("tempio48"),3);P.lv=40;recalc();P.hp=P.mhp;}{int k;for(k=0;k<nents;k++)if(ents[k].k==E_EN&&ents[k].boss&&((int)(stT*2))%10==0&&stT-(int)stT<.04f)tlog("boss %s vita %d/%d",ents[k].name,(int)ents[k].hp,(int)ents[k].mhp);}fight();if(stT>3&&stT<3.05f)shotL("quetzal");if(P.ol>=4){tlog("Quetzal sconfitto");step++;stT=0;}NEXT(120);break;
  AT(29) if(stT<.05f){zoneT(Z_IN_PAL48,-1,0);Ent*n=findNpcRole("nerea");tlog("regina presente: %d",n!=0);if(n)standBefore(n);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);if(stT>.5f&&stT<.55f)shotL("regina");if(stT>.7f&&stT<.75f)press(PSP_CTRL_CROSS);NEXT(1);break;
  AT(30) if(stT<.05f){tlog("Thalassa ol=%d",P.ol);zoneT(Z_ARENA,-1,0);arenaStart();shotL("arena");}fight();if(stT>6&&stT<6.05f){shotL("arena_ondata");tlog("arena: ondata %d",arenaWave);}NEXT(14);break;
  AT(31) if(stT<.05f){tlog("arena: ondata %d record %d",arenaWave,P.arenaBest);P.shards=63;zoneT(Z_IN_CASTLE,-1,0);Ent*k=findNpcRole("re");if(k)standBefore(k);}if(stT>.2f&&stT<.25f)press(PSP_CTRL_CROSS);if(stT>.5f&&stT<.55f)shotL("corona");
    if(stT>.7f&&stT<.75f)press(PSP_CTRL_CROSS);if(stT>.9f&&stT<.95f)press(PSP_CTRL_CROSS);NEXT(1.2f);break;
  AT(32) if(stT<.05f){tlog("storia st=%d",P.st);Ent*p=findPortal(Z_DUNG);tlog("portale cittadella: %d",p!=0);shotL("portale_cittadella");zoneT(Z_DUNG,dungIdx("cittadella"),4);P.lv=50;recalc();P.hp=P.mhp;}fight();if(stT>3&&stT<3.05f)shotL("malakar");{int k;for(k=0;k<nents;k++)if(ents[k].k==E_EN&&ents[k].boss&&((int)(stT*2))%10==0&&stT-(int)stT<.04f)tlog("boss %s vita %d/%d",ents[k].name,(int)ents[k].hp,(int)ents[k].mhp);}if(P.st>=3){tlog("Malakar sconfitto");shotL("finale");step++;stT=0;}NEXT(150);break;
  AT(33) if(stT<.05f){saveGame();Player old=P;memset(&P,0,sizeof P);int ok=loadGame();tlog("salvataggio: %s, liv %d=%d oro %d=%d",ok?"letto":"ERRORE",P.lv,old.lv,P.gold,old.gold);}NEXT(.3f);break;
  AT(34) if(stT<.05f){zoneT(Z_TOWN,-1,0);godMode=0;P.hp=1;tp(24.5f,30.5f,1);Ent*e=enemy("troll",25.5f,30.5f);(void)e;}if(state==S_DEAD&&stT>.5f){shotL("morte");press(PSP_CTRL_CROSS);step++;stT=0;tlog("morte e ritorno: ok");}NEXT(8);break;
  AT(35) if(stT<.05f){report("dopo la morte");godMode=1;}if(stT>.5f&&stT<.55f)press(PSP_CTRL_CROSS);NEXT(1);break;
  /* camminata lunga a caso in tutte le zone, per gli inciampi */
  AT(36) {static int zi=0;static const int ZS[8]={Z_TOWN,Z_FOREST,Z_DESERT,Z_PEAKS,Z_PORTO,Z_THAL,Z_JUNGLE,Z_ARENA};if(stT<.05f){zoneT(ZS[zi],-1,0);rx=P.x;ry=P.y;}
    if(((int)(stT*10))%30==0){rx=irand(1,N-2)+.5f;ry=irand(1,N-2)+.5f;}moveTo(rx,ry);if(state==S_PLAY&&((int)(stT*7))%13==0)press(PSP_CTRL_CROSS);if(state!=S_PLAY&&((int)(stT*10))%5==0)press(PSP_CTRL_CIRCLE);if(state==S_DIALOG&&((int)(stT*10))%5==2)press(PSP_CTRL_CROSS);
    if(stT>12){tlog("camminata in zona %d: pos %.1f,%.1f stato %d vertici %d",ZS[zi],P.x,P.y,state,vstatLast);zi++;stT=0;if(zi>=8)step++;}}break;
  AT(37) if(stT<.05f){tlog("fotogrammi %d in %.1fs di gioco",fpsN,fpsAcc);tlog("FINE prova automatica");}NEXT(.5f);break;
  default:return 1;}
  pad.prev=pad.now;pad.now=want;pad.pr=pad.now&~pad.prev;pad.ax=wantAx;pad.ay=wantAy;
  return 0;}
#endif
