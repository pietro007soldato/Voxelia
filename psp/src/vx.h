/* Voxelia per PSP — definizioni comuni */
#ifndef VX_H
#define VX_H
#include <pspkernel.h>
#include <pspdisplay.h>
#include <pspctrl.h>
#include <pspgu.h>
#include <pspgum.h>
#include <psprtc.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <malloc.h>

typedef struct Ent Ent;

#define SCR_W 480
#define SCR_H 272
#define MAXN 64
#define PI 3.14159265f

/* ---------- colori: 0xRRGGBB → ABGR della PSP ---------- */
static inline u32 C(u32 rgb){return 0xff000000u|((rgb&0xff)<<16)|(rgb&0xff00)|((rgb>>16)&0xff);}
static inline u32 CA(u32 rgb,int a){return ((u32)a<<24)|((rgb&0xff)<<16)|(rgb&0xff00)|((rgb>>16)&0xff);}
u32 shade(u32 c,float f);   /* c in ABGR */
u32 mix(u32 a,u32 b,float t);

/* ---------- grafica ---------- */
typedef struct{u32 c;float x,y,z;} V3;
typedef struct{float u,v;u32 c;float x,y,z;} VT;
extern float camX,camY,ZOOM;extern int vstat,vstatLast; /* camera in coordinate di casella */
extern int frameNo;
void gfxInit(void);
void gfxBegin(u32 clear);
void gfxEnd(void);
void gfx3D(void);
void gfx2D(void);
void box(float x,float y,float z,float w,float d,float h,u32 c);
void boxF(float x,float y,float z,float w,float d,float h,u32 c,float f);
void boxA(float x,float y,float z,float w,float d,float h,u32 c,int alpha);
void flat(float x,float y,float z,float w,float d,u32 c); /* rettangolo orizzontale */
void dynFlush(void);
/* mesh statica della zona, divisa in blocchi */
void meshBegin(void);
void meshEnd(void);
void meshBox(float x,float y,float z,float w,float d,float h,u32 c,float f);
void meshFlat(float x,float y,float z,float w,float d,u32 c);
void meshDraw(void);
void meshFree(void);
extern int meshOn;
/* 2D */
void rect(float x,float y,float w,float h,u32 c);
void rectG(float x,float y,float w,float h,u32 c1,u32 c2);
void frame(float x,float y,float w,float h);
int text(float x,float y,const char*s,u32 c);
int textS(float x,float y,const char*s,u32 c); /* con ombra */
int textW(const char*s);
int textBox(float x,float y,float w,const char*s,u32 c,int maxLines);
void textC(float cx,float y,const char*s,u32 c);
void w2s(float x,float y,float z,float*sx,float*sy);
void tint(u32 c); /* velo su tutto lo schermo */
void miniTex(u32*px,int n);
void miniDraw(float x,float y,float s);
extern float TSC;
void alFlushPub(void);
const char*skillName(int i);
extern int arenaWave;void arenaStart(void);
extern Ent*nearInter;
extern int pendingQ;void acceptQuest(void);
extern char dlgWho[32];extern char dlgTxt[8][300];extern int dlgN,dlgI;
int xpNeed(int lv);
void glow(float sx,float sy,float r,u32 c);
void dark(float sx,float sy,float r,int a);
#define Min(a,b) ((a)<(b)?(a):(b))
#define Max(a,b) ((a)>(b)?(a):(b))
typedef struct{float x,y,z;u32 c;float r;} Light;
extern Light LIGHTS[];extern int nlights;
void buildMesh(void);
Ent*npc(const char*id,float x,float y,int wander);
Ent*enemy(const char*t,float x,float y);

/* ---------- input ---------- */
typedef struct{u32 now,prev,pr;float ax,ay;} Pad;
extern Pad pad;
#define PRESS(b) (pad.pr&(b))
#define HOLD(b) (pad.now&(b))
void padRead(void);

/* ---------- mondo ---------- */
enum{T_FLOOR=0,T_WALL=1,T_WATER=2,T_BUILD=3,T_ROAD=4,T_DEC=6,T_CARPET=8,T_VOID=9,T_LAVA=10};
extern int N;
extern u8 M[MAXN][MAXN];
extern u8 DEC[MAXN][MAXN];
extern u8 BH[MAXN][MAXN]; /* indice edificio+1 */
typedef struct{u32 a,b,road1,road2,wall,bg,pool;int th;} Pal;
extern Pal pal;
int walk(int x,int y);
int walkF(float x,float y,float r);

/* ---------- entità ---------- */
enum{E_NONE,E_PLAYER,E_NPC,E_EN,E_PORTAL,E_CHEST,E_DROP,E_PROJ,E_RES,E_SIGN,E_FX,E_SHRINE,E_ALTAR,E_ANIMAL};
struct Ent{
  u8 k,t,dir,boss,flags,sub;short id;
  float x,y,z,vx,vy,vz;
  float hp,mhp,at,sp,r,cd,cdt,ag,anim,hit,stun,life,slam;
  int xp,gold,tag,dst,lock,data;
  u32 col;
  char name[48];
  float hx,hy,wt,tx,ty;
};
#define MAXE 220
extern Ent ents[MAXE];
extern int nents;
Ent*entNew(int k,float x,float y);
void entsClear(void);

/* ---------- modelli ---------- */
typedef struct{float x,y,z,w,d,h;u32 c;} Bx;
typedef struct{Bx b[24];int n;u8 kind;float s;} Model;
void mHum(Model*m,u32 body,u32 skin,float s,int hatH,u32 hat);
void mBeast(Model*m,u32 c,float s,u32 k);
void mBlob(Model*m,u32 c,float s);
void mBat(Model*m,u32 c,float s);
void mSpider(Model*m,u32 c,float s);
void mElem(Model*m,u32 c,float s);
void mCrab(Model*m,u32 c,float s);
void mDrake(Model*m,u32 c,u32 w,float s);
void mKraken(Model*m,u32 c,float s);
void mSphinx(Model*m,float s);
void mSerpent(Model*m,u32 c,float s);
void drawModel(const Model*m,float x,float y,float z,int dir,float walkT,float atk,int white,int alpha);

/* ---------- dati ---------- */
typedef struct{const char*id;const char*n;float hp,at;int xp;float sp,r,cd,ag;u8 boss,slam;u32 rng;const char*sum;u8 mk;u32 c1,c2;float s;u8 hatH;u32 hatC;} EnemyDef;
enum{MK_HUM,MK_BEAST,MK_BLOB,MK_BAT,MK_SPIDER,MK_ELEM,MK_CRAB,MK_DRAKE,MK_KRAKEN,MK_SPHINX,MK_SERP};
extern const EnemyDef EDEF[];
extern const int NEDEF;
int enemyId(const char*n);
void enemyModel(Model*m,int id);

typedef struct{u8 s,r,up;short v;short cr,hp;char n[30];int p;} Item; /* s: 0 arma 1 elmo 2 corazza 3 scudo; r rarità */
extern const u32 RCOL[5];
extern const char*RNAME[5];
void itemGen(Item*it,int lv,int minR,int slot);
int itemVal(const Item*it);
void itemName(const Item*it,char*o);

typedef struct{const char*id;u8 t;const char*e[4];int n;int lv;const char*it;float ch;const char*to;const char*ti;const char*tx;int g,x;u8 once;} QuestDef;
enum{Q_KILL,Q_COL,Q_BOSS,Q_TALK};
extern const QuestDef QDEF[];
extern const int NQDEF;
int questIdx(const char*id);

typedef struct{const char*id;const char*n;u32 c,hat;const char*ln[4];const char*qs[8];u8 role;} NpcDef;
enum{R_NONE,R_KING,R_SAGE,R_INN,R_SMITH,R_ALCH,R_HEAL,R_SHOP,R_CAT,R_CAPT,R_ORESTE,R_NEREA,R_ZEFIRO,R_TRAG,R_BARD,R_ARENA};
extern const NpcDef NDEF[];
extern const int NNDEF;
int npcIdx(const char*id);

typedef struct{const char*id;const char*n;int lv,fls;const char*en[4];const char*boss;int th;const char*ent;u8 fin;} DungDef;
extern const DungDef DDEF[];
extern const int NDDEF;
int dungIdx(const char*id);
enum{TH_CAVE,TH_CRYPT,TH_PYR,TH_ICE,TH_FIRE,TH_SEA,TH_VOID,TH_JADE};

/* ---------- zone ---------- */
enum{Z_TOWN,Z_FOREST,Z_DESERT,Z_PEAKS,Z_PORTO,Z_THAL,Z_JUNGLE,Z_ARENA,
     Z_IN_CASTLE,Z_IN_TAVERN,Z_IN_SMITH,Z_IN_ALCH,Z_IN_TEMPLE,Z_IN_HOUSE,Z_IN_PAL48,Z_IN_SIR48,
     Z_DUNG,Z_COUNT};
typedef struct{const char*n;int lv;u8 inside,wild;} ZoneDef;
extern const ZoneDef ZDEF[];
extern int Zk,Zdung,Zfloor;
extern float zoneLv;
void zoneLoad(int z,int dung,int floor,int from);
void zoneName(char*o);
extern float spawnT;

/* ---------- giocatore ---------- */
#define INV_MAX 24
typedef struct{
  float x,y,z,vx,vy;int dir;
  float hp,mhp,mp,mmp,sta;
  int lv,xp,gold,pot,mpot,elix;
  Item eq[4];u8 has[4];
  Item inv[INV_MAX];int ninv;
  int diff;
  int shards;      /* bit per frammento */
  int st;          /* storia: 0 inizio,1 missione frammenti,2 corona riforgiata,3 Malakar sconfitto */
  int ol;          /* Thalassa: 0 non iniziato,1 a Thalassa,2 sigilli,3 tempio aperto,4 Regina libera,5 finito */
  int sig;         /* bit sigilli */
  int done[12];    /* dungeon completati (cicli) */
  int qact[8];short qn[8];int nq; /* missioni attive: indice, progresso */
  u8 qdone[64];
  int kills,deaths,chestsOpened;
  float playT,dayT;
  int skill,skills;/* abilità scelta, sbloccate */
  float atkT,atkCd,dodgeT,dodgeCd,iframe,hurt,combo;
  int title;
  float potCd;
  int arenaBest;
  int pet;
  int flags;
} Player;
extern Player P;
void playerInit(int diff);
void recalc(void);
float pAtk(void);
float pDef(void);
float pCrit(void);
void giveXp(int x);
void giveGold(int g);
int invAdd(const Item*it);
void equip(int i);

/* ---------- gioco ---------- */
enum{S_TITLE,S_PLAY,S_DIALOG,S_MENU,S_SHOP,S_DEAD,S_STORY,S_MAP,S_CHOICE};
extern int state;
extern float gT,dt;
void gameUpdate(void);
void gameDraw(void);
void say(const char*who,const char*txt);
void sayQ(const char*who,const char*txt,int act);
void banner(const char*t,const char*s);
void floatText(float x,float y,const char*s,u32 c);
void burst(float x,float y,float z,int n,u32 c,float sp);
void questEvent(int kind,const char*what,int n);
void saveGame(void);
int loadGame(void);
int saveExists(void);
void uiDraw(void);
void uiUpdate(void);
void menuOpen(void);
void shopOpen(int role);
void hitPlayer(float dmg,float fx,float fy);
float dayLight(void);
extern char msgLine[96];extern float msgT;
float frand(void);
int irand(int a,int b);
float dist2(float ax,float ay,float bx,float by);
void sfx(int id);
void musicZone(int z);
enum{SFX_HIT,SFX_SWING,SFX_COIN,SFX_HURT,SFX_LVL,SFX_DOOR,SFX_MAGIC,SFX_DIE,SFX_MENU,SFX_CHEST,SFX_BOSS};
void audioInit(void);
#endif
