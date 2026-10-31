/* Voxelia per PSP — il ciclo principale, il titolo e i salvataggi */
#include "vx.h"
#include <psppower.h>
#include <pspdebug.h>
#include <stdarg.h>

PSP_MODULE_INFO("Voxelia",0,1,0);
PSP_MAIN_THREAD_ATTR(THREAD_ATTR_USER|THREAD_ATTR_VFPU);
PSP_HEAP_SIZE_KB(16*1024);

static int running=1;
/* registro di avvio: sullo schermo (prima della grafica) e nel file log.txt accanto al gioco */
static int dbgScr=0;
void dlog(const char*f,...){char b[160];va_list a;va_start(a,f);vsnprintf(b,sizeof b,f,a);va_end(a);
  if(dbgScr)pspDebugScreenPrintf("%s\n",b);FILE*o=fopen("log.txt","a");if(o){fprintf(o,"%s\n",b);fclose(o);}}
static int hasSave=-1;
int hudOff=0;
static int exitCb(int a,int b,void*c){running=0;return 0;}
static int cbThread(SceSize a,void*b){int id=sceKernelCreateCallback("Exit",exitCb,0);sceKernelRegisterExitCallback(id);sceKernelSleepThreadCB();return 0;}
static void setupCb(void){int t=sceKernelCreateThread("cb",cbThread,0x11,0xFA0,0,0);if(t>=0)sceKernelStartThread(t,0,0);}

Pad pad;
void padRead(void){SceCtrlData c;sceCtrlPeekBufferPositive(&c,1);pad.prev=pad.now;pad.now=c.Buttons;pad.pr=pad.now&~pad.prev;
  float x=(c.Lx-128)/127.f,y=(c.Ly-128)/127.f;float m=sqrtf(x*x+y*y);if(m<.25f){x=y=0;}else{float k=(m-.25f)/.75f/m;if(k*m>1)k=1/m;x*=k;y*=k;}pad.ax=x;pad.ay=y;}

/* ---------- salvataggio ---------- */
#define SAVEV 0x56580107
typedef struct{int v;Player p;int zone;} Save;
void saveGame(void){Save s;s.v=SAVEV;s.p=P;s.zone=(Zk==Z_DUNG||Zk==Z_ARENA)?(Zk==Z_ARENA?Z_TOWN:-1):Zk;if(s.zone<0){s.zone=Z_TOWN;}
  if(ZDEF[s.zone].inside){s.zone=s.zone==Z_IN_PAL48||s.zone==Z_IN_SIR48?Z_THAL:Z_TOWN;}
  FILE*f=fopen("save.dat","wb");if(!f)return;fwrite(&s,sizeof s,1,f);fclose(f);hasSave=1;}
int saveExists(void){if(hasSave>=0)return hasSave;FILE*f=fopen("save.dat","rb");if(!f)return 0;Save s;int ok=fread(&s,sizeof s,1,f)==1&&s.v==SAVEV;fclose(f);hasSave=ok;return ok;}
int loadGame(void){FILE*f=fopen("save.dat","rb");if(!f)return 0;Save s;int ok=fread(&s,sizeof s,1,f)==1&&s.v==SAVEV;fclose(f);if(!ok)return 0;P=s.p;recalc();zoneLoad(s.zone,-1,0,-1);return 1;}

/* ---------- titolo ---------- */
static int tSel=0,tDiff=1,tStep=0;
static void titleDraw(void){
  /* sfondo: la città che gira piano */
  camX=24+sinf(gT*.1f)*8;camY=26+cosf(gT*.1f)*8;
  gfx3D();meshDraw();dynFlush();gfx2D();
  rectG(0,0,SCR_W,SCR_H,0x40000000,0xc0000000);
  TSC=3;textC(240,40,"VOXELIA",0xff4ad8ff);TSC=1.2f;textC(240,86,"Il Regno Perduto",0xffffffff);TSC=1;
  const char*O[3]={"Continua","Nuova partita","Comandi"};int has=saveExists();
  if(tStep==0){int i;for(i=0;i<3;i++){if(i==0&&!has)continue;u32 c=i==tSel?0xff4ad8ff:0xffc0c0c0;if(i==tSel)rect(170,128+i*20,140,16,0x60c08040);textC(240,130+i*20,O[i],c);}}
  else if(tStep==1){const char*Dn[4]={"Facile","Normale","Difficile","Incubo"};textC(240,118,"Difficoltà",0xffffffff);int i;for(i=0;i<4;i++){u32 c=i==tDiff?0xff4ad8ff:0xffc0c0c0;if(i==tDiff)rect(170,136+i*18,140,15,0x60c08040);textC(240,137+i*18,Dn[i],c);}}
  else{rect(40,112,400,120,0xc0101010);textBox(52,118,380,"Levetta o croce: muoviti\n✕ attacca, parla, apri, entra\n○ capriola (per un attimo nessuno ti colpisce)\n□ pozione   △ abilità   L cambia abilità\nR (tieni premuto) corri   START menu e salvataggio   SELECT mappa",0xffffffff,8);}
  TSC=.8f;textC(240,254,"Versione PSP · ✕ conferma · ○ indietro",0xff909090);TSC=1;}
static void titleUpdate(void){int has=saveExists();
  if(tStep==0){if(PRESS(PSP_CTRL_DOWN)){do tSel=(tSel+1)%3;while(tSel==0&&!has);sfx(SFX_MENU);}if(PRESS(PSP_CTRL_UP)){do tSel=(tSel+2)%3;while(tSel==0&&!has);sfx(SFX_MENU);}
    if(!has&&tSel==0)tSel=1;
    if(PRESS(PSP_CTRL_CROSS)){sfx(SFX_MENU);if(tSel==0){if(loadGame()){state=S_PLAY;banner("Bentornato!","");}}else if(tSel==1)tStep=1;else tStep=2;}}
  else if(tStep==1){if(PRESS(PSP_CTRL_DOWN)){tDiff=(tDiff+1)%4;sfx(SFX_MENU);}if(PRESS(PSP_CTRL_UP)){tDiff=(tDiff+3)%4;sfx(SFX_MENU);}if(PRESS(PSP_CTRL_CIRCLE))tStep=0;
    if(PRESS(PSP_CTRL_CROSS)){playerInit(tDiff);zoneLoad(Z_TOWN,-1,0,-1);P.x=24.5f;P.y=33.5f;camX=P.x;camY=P.y;state=S_PLAY;tStep=0;
      say("Capitano Marcus","Benvenuto ad Aldoria, viandante. Il Re Aldric ti cerca: il castello è a nord della piazza. Avvicinati e premi ✕ per parlare.");}}
  else if(PRESS(PSP_CTRL_CIRCLE)||PRESS(PSP_CTRL_CROSS))tStep=0;}

void hudDraw(void);void dialogDraw(void);void menuDraw(void);void menuUpdate(void);void shopDraw(void);void shopUpdate(void);void mapDraw(void);
extern int dlgAct;
static void travelShip(int toThal){if(toThal){zoneLoad(Z_THAL,-1,0,-1);banner("Thalassa","Il regno oltre il mare");}else{zoneLoad(Z_PORTO,-1,0,-1);P.x=20.5f;P.y=24.5f;camX=P.x;camY=P.y;}}

int main(void){
  {FILE*o=fopen("log.txt","w");if(o)fclose(o);}
  pspDebugScreenInit();dbgScr=1;dlog("Voxelia PSP - avvio (versione %s)",__DATE__);
  setupCb();dlog("1/7 callback ok");
  SceCtrlData c0;sceCtrlSetSamplingCycle(0);sceCtrlSetSamplingMode(PSP_CTRL_MODE_ANALOG);sceCtrlPeekBufferPositive(&c0,1);int safe=(c0.Buttons&PSP_CTRL_LTRIGGER)!=0;
  dlog("2/7 controlli ok%s",safe?" - MODALITA' SICURA (L premuto): niente audio, velocita' normale":"");
  if(!safe){int r=scePowerSetClockFrequency(333,333,166);dlog("3/7 processore a 333 MHz (%d)",r);}else dlog("3/7 processore lasciato com'e'");
  srand(sceKernelGetSystemTimeLow());
  dlog("4/7 memoria libera: %d KB",(int)(sceKernelMaxFreeMemSize()/1024));
  dlog("5/7 avvio grafica...");sceKernelDelayThread(300000);
  dbgScr=0;gfxInit();dlog("5/7 grafica ok");
  playerInit(1);zoneLoad(Z_TOWN,-1,0,-1);state=S_TITLE;dlog("6/7 citta' pronta");
  if(!safe){audioInit();dlog("7/7 audio ok");}else dlog("7/7 audio spento");
  u64 last;sceRtcGetCurrentTick(&last);u32 res=sceRtcGetTickResolution();
  while(running){u64 now;sceRtcGetCurrentTick(&now);dt=(now-last)/(float)res;last=now;if(dt>.05f)dt=.05f;if(dt<=0)dt=1/60.f;
#ifdef AUTOTEST
    dt=1/30.f;
#endif
#ifdef AUTOTEST
    {extern int autoDrive(void);if(autoDrive())running=0;}
#else
    padRead();
#endif
    switch(state){
    case S_TITLE:gT+=dt;titleUpdate();break;
    case S_PLAY:if(PRESS(PSP_CTRL_START)){menuOpen();break;}if(PRESS(PSP_CTRL_SELECT)){state=S_MAP;break;}gameUpdate();break;
    case S_DIALOG:case S_CHOICE:gT+=dt;
      if(state==S_CHOICE){extern void afterChoice(void);if(PRESS(PSP_CTRL_CROSS)){acceptQuest();state=S_PLAY;afterChoice();}else if(PRESS(PSP_CTRL_CIRCLE)){pendingQ=-1;state=S_PLAY;afterChoice();}break;}
      if(PRESS(PSP_CTRL_CROSS)||PRESS(PSP_CTRL_CIRCLE)){dlgI++;if(dlgI>=dlgN){dlgN=0;dlgI=0;state=S_PLAY;if(pendingQ==-2){pendingQ=-1;travelShip(1);}else if(pendingQ==-3){pendingQ=-1;travelShip(0);}}}break;
    case S_MENU:menuUpdate();break;
    case S_SHOP:shopUpdate();break;
    case S_MAP:if(PRESS(PSP_CTRL_SELECT)||PRESS(PSP_CTRL_CIRCLE)||PRESS(PSP_CTRL_START))state=S_PLAY;break;
    case S_DEAD:gT+=dt;if(PRESS(PSP_CTRL_CROSS)){P.gold-=P.gold/10;P.hp=P.mhp;P.mp=P.mmp;zoneLoad(Z_TOWN,-1,0,-1);P.x=39.5f;P.y=35.5f;camX=P.x;camY=P.y;state=S_PLAY;say("Sacerdotessa Lia","La Luce ti ha riportato indietro. Hai perso un po' d'oro, ma non la vita. Riprova!");}break;}
    float dl=dayLight();u32 bg=pal.bg;if(dl>0&&!ZDEF[Zk].inside&&Zk!=Z_DUNG)bg=mix(pal.bg,C(0x101830),dl*.85f);
    gfxBegin(bg);
    if(state==S_TITLE){titleDraw();}
    else{gameDraw();if(!hudOff)hudDraw();
      if(state==S_DIALOG||state==S_CHOICE)dialogDraw();else if(state==S_MENU)menuDraw();else if(state==S_SHOP)shopDraw();else if(state==S_MAP)mapDraw();
      else if(state==S_DEAD){tint(0xa0000020);TSC=2;textC(240,100,"Sei caduto",0xff3a3aff);TSC=1;textC(240,150,"✕ torna al Tempio di Aldoria (perdi il 10% dell'oro)",0xffffffff);}}
    gfxEnd();
    if(frameNo==1||frameNo==2||frameNo==60||frameNo==600)dlog("fotogramma %d ok",frameNo);}
  saveGame();sceGuTerm();sceKernelExitGame();return 0;}
