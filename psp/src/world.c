/* Voxelia PSP — il mondo: generazione delle zone, edifici, arredi, mesh statica e minimappa */
#include "vx.h"

int N=48;
u8 M[MAXN][MAXN],DEC[MAXN][MAXN],BH[MAXN][MAXN];
Pal pal;
int Zk=Z_TOWN,Zdung=-1,Zfloor=0;
float zoneLv=0;

typedef struct{int x,y,w,h,ht,dx;u32 wall,roof;u8 st;} Bld;
enum{BS_HOUSE,BS_CASTLE,BS_TEMPLE,BS_TOWER,BS_ARENA,BS_LH,BS_HUT};
static Bld BL[40];static int nbl=0;

int walk(int x,int y){if(x<0||y<0||x>=N||y>=N)return 0;u8 m=M[y][x];return m==T_FLOOR||m==T_ROAD||m==T_CARPET;}
int walkF(float x,float y,float r){return walk((int)(x-r),(int)(y-r))&&walk((int)(x+r),(int)(y-r))&&walk((int)(x-r),(int)(y+r))&&walk((int)(x+r),(int)(y+r));}

/* ---------- strumenti di costruzione ---------- */
static int ok(int x,int y){return x>0&&y>0&&x<N-1&&y<N-1;}
static void R4(int x0,int y0,int w,int h,int v){int x,y;for(y=y0;y<y0+h;y++)for(x=x0;x<x0+w;x++)if(ok(x,y)){M[y][x]=v;if(v!=T_DEC)DEC[y][x]=0;}}
static void D(int x,int y,int c){if(ok(x,y)&&M[y][x]==T_FLOOR&&!DEC[y][x]){M[y][x]=T_DEC;DEC[y][x]=c;}}
static u8 RD[MAXN][MAXN];
static void F(int x,int y,int c){if(ok(x,y)){if(M[y][x]==T_ROAD)RD[y][x]=1;M[y][x]=T_DEC;DEC[y][x]=c;}}
static void W(int x,int y,int c){if(ok(x,y)&&M[y][x]==T_FLOOR)DEC[y][x]=c;}
static Ent*portal(int x,int y,int dst,int data,const char*n){Ent*e=entNew(E_PORTAL,x+.5f,y+.5f);if(!e)return 0;e->tag=dst;e->data=data;strncpy(e->name,n,47);if(M[y][x]!=T_ROAD&&M[y][x]!=T_CARPET)M[y][x]=T_FLOOR;DEC[y][x]=0;return e;}
static void H(int x,int y,int w,int h,int ht,u32 wall,u32 roof,int st,int dx,int dst,const char*n){int i,j;Bld*b=&BL[nbl];if(nbl<40)nbl++;
  b->x=x;b->y=y;b->w=w;b->h=h;b->ht=ht;b->wall=wall;b->roof=roof;b->st=st;b->dx=dx;
  for(j=y;j<y+h;j++)for(i=x;i<x+w;i++)if(ok(i,j)){M[j][i]=T_BUILD;DEC[j][i]=0;BH[j][i]=nbl;}
  if(dst>=0&&ok(dx,y+h)){M[y+h][dx]=T_ROAD;Ent*p=portal(dx,y+h,dst,0,n);if(p)p->sub=1;}}
Ent*npc(const char*id,float x,float y,int wander){int k=npcIdx(id);if(k<0)return 0;Ent*e=entNew(E_NPC,x+.5f,y+.5f);if(!e)return 0;e->id=k;strncpy(e->name,NDEF[k].n,47);e->flags=wander;e->hx=e->x;e->hy=e->y;e->dir=1;return e;}
Ent*enemy(const char*t,float x,float y);
static void scat(int x0,int y0,int w,int h,int c,float p){int x,y;for(y=y0;y<y0+h;y++)for(x=x0;x<x0+w;x++)if(frand()<p)D(x,y,c);}
static void fill(int v){int x,y;memset(DEC,0,sizeof DEC);memset(RD,0,sizeof RD);memset(BH,0,sizeof BH);for(y=0;y<MAXN;y++)for(x=0;x<MAXN;x++)M[y][x]=(x<N&&y<N)?v:T_VOID;}
static void border(int v){int i;for(i=0;i<N;i++){M[0][i]=M[N-1][i]=M[i][0]=M[i][N-1]=v;}}
/* raggiungibilità: tutto ciò che non si raggiunge dal punto di partenza diventa muro */
static short DQ[MAXN*MAXN];static short DD[MAXN*MAXN];
static void bfs(int sx,int sy){int i,h=0,t=0;for(i=0;i<MAXN*MAXN;i++)DD[i]=-1;if(!walk(sx,sy))return;DD[sy*MAXN+sx]=0;DQ[t++]=sy*MAXN+sx;
  while(h<t){int c=DQ[h++],x=c%MAXN,y=c/MAXN,k;static const int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};for(k=0;k<4;k++){int u=x+dx[k],v=y+dy[k];if(!walk(u,v)||DD[v*MAXN+u]>=0)continue;DD[v*MAXN+u]=DD[c]+1;DQ[t++]=v*MAXN+u;}}}
static int reach(int x,int y){return x>=0&&y>=0&&x<N&&y<N&&DD[y*MAXN+x]>=0;}
/* una casella libera e raggiungibile, lontana almeno dmin dal punto di partenza */
static int freeSpot(int*ox,int*oy,int dmin){int k;for(k=0;k<400;k++){int x=irand(2,N-3),y=irand(2,N-3);if(!reach(x,y)||DD[y*MAXN+x]<dmin||DEC[y][x])continue;
    int i,busy=0;for(i=0;i<nents;i++)if(ents[i].k&&fabsf(ents[i].x-x-.5f)<1.5f&&fabsf(ents[i].y-y-.5f)<1.5f){busy=1;break;}if(busy)continue;*ox=x;*oy=y;return 1;}return 0;}
/* scava un sentiero fra due punti (per non lasciare zone chiuse) */
static void dig(int x0,int y0,int x1,int y1,int v){int x=x0,y=y0,k=0;while((x!=x1||y!=y1)&&k++<400){if(ok(x,y)&&!walk(x,y)&&M[y][x]!=T_BUILD){M[y][x]=v;DEC[y][x]=0;}
    if(abs(x1-x)>abs(y1-y))x+=x1>x?1:-1;else y+=y1>y?1:-1;}if(ok(x,y)&&!walk(x,y)&&M[y][x]!=T_BUILD){M[y][x]=v;DEC[y][x]=0;}}

/* ---------- arredi: codici ---------- */
enum{D_TREE=1,D_BUSH,D_FLOW,D_BENCH,D_LAMP,D_FENCE,D_STALL,D_STATUE,D_WELL,D_PALM,D_ROCK,D_CACTUS,D_PINE,D_GRAVE,D_CRATE,D_BARREL,D_TORCH,D_PILLAR,D_HEDGE,
  D_SHELF,D_TABLE,D_BED,D_COUNTER,D_ANVIL,D_FORGE,D_CAULDRON,D_ALTAR,D_THRONE,D_PEW,D_PLANT,D_RACK,D_CHESTD,D_RUG,D_BIGTREE,D_FERN,D_BANANA,D_BIGFLOW,D_RUIN,
  D_PIER,D_SAND,D_UMBR,D_FOUNT,D_COLUMN,D_CYPRESS,D_LEMON,D_BOLLARD,D_NET,D_SNOWROCK,D_DEADTREE,D_BONES,D_CRYSTAL,D_LAVAROCK,D_CORAL,D_VOIDP,D_JADEP,D_SEAWEED,D_FLOWG,D_MOSAIC};

/* ================= ALDORIA ================= */
static void genTown(void){int x,y;N=48;fill(T_FLOOR);border(T_WALL);
  pal.a=C(0x7d9a5b);pal.b=C(0x76925a);pal.road1=C(0xb8ab92);pal.road2=C(0xaea188);pal.wall=C(0x9a9488);pal.bg=C(0x7fb6e6);pal.th=0;
  R4(22,1,4,46,T_ROAD);R4(1,22,46,4,T_ROAD);R4(17,17,14,14,T_ROAD);
  /* fontana in piazza */
  R4(23,23,2,2,T_DEC);DEC[23][23]=D_FOUNT;DEC[23][24]=DEC[24][23]=DEC[24][24]=255;
  /* le porte nelle mura */
  for(x=22;x<26;x++){M[0][x]=T_ROAD;M[N-1][x]=T_ROAD;}for(y=22;y<26;y++){M[y][0]=T_ROAD;M[y][N-1]=T_ROAD;}
  portal(23,0,Z_FOREST,0,"Foresta di Elmwood");portal(47,23,Z_DESERT,0,"Deserto di Khem");portal(0,23,Z_PEAKS,0,"Picchi Gelidi");portal(23,47,Z_PORTO,0,"Porto di Aldoria");
  /* castello */
  R4(15,12,18,3,T_ROAD);H(16,3,16,8,50,C(0xb8b4ac),C(0x5a6a8a),BS_CASTLE,24,Z_IN_CASTLE,"Castello di Aldoria");R4(23,11,2,1,T_ROAD);
  /* taverna, fucina, bottega, tempio, case */
  H(4,13,9,6,28,C(0xd8c8a8),C(0xa83a2a),BS_HOUSE,8,Z_IN_TAVERN,"Taverna del Drago Ubriaco");R4(8,20,1,2,T_ROAD);
  H(35,13,8,6,26,C(0x8a7a6a),C(0x4a4a52),BS_HOUSE,38,Z_IN_SMITH,"Fucina di Borin");R4(38,20,1,2,T_ROAD);
  H(4,27,8,6,26,C(0xc8d8b0),C(0x4a8a3a),BS_HOUSE,7,Z_IN_ALCH,"Bottega dell'Erborista");R4(7,33,1,1,T_ROAD);
  H(35,27,9,7,34,C(0xf0ece0),C(0x4a6a8a),BS_TEMPLE,39,Z_IN_TEMPLE,"Tempio della Luce");R4(39,34,1,1,T_ROAD);
  H(36,38,6,5,22,C(0xe0d0b0),C(0x8a4a2a),BS_HOUSE,38,Z_IN_HOUSE,"Casa di Mamma Rosa");R4(38,44,1,3,T_ROAD);R4(26,45,13,2,T_ROAD);
  H(27,37,6,5,22,C(0xe8dcc0),C(0x3a6a9a),BS_HOUSE,29,-1,"");H(4,4,7,5,24,C(0xe0d4b8),C(0x6a3a8a),BS_HOUSE,7,-1,"");H(36,4,8,6,30,C(0xd8c8a0),C(0x8a6a2a),BS_ARENA,40,Z_ARENA,"Colosseo di Aldoria");R4(40,11,1,11,T_ROAD);
  /* cimitero con l'ingresso della Cripta */
  for(x=3;x<=13;x++){D(x,36,D_FENCE);}for(y=36;y<=45;y++){D(3,y,D_FENCE);D(13,y,D_FENCE);}
  for(y=38;y<=44;y+=2)for(x=5;x<=11;x+=2)if(!(x==8&&y==40))D(x,y,D_GRAVE);
  {Ent*p=portal(8,41,Z_DUNG,dungIdx("cripta")*16+1,"Cripta Dimenticata");if(p)p->sub=2;}
  M[36][8]=T_ROAD;DEC[36][8]=0;R4(8,34,1,2,T_ROAD);
  /* mercato */
  for(x=18;x<=21;x++){F(x,26,D_STALL);}F(27,18,D_STALL);F(28,18,D_STALL);
  /* alberi, fiori, panchine, lampioni */
  for(x=2;x<46;x+=3){D(x,21,D_TREE);D(x,26,D_TREE);}for(y=2;y<46;y+=3){D(21,y,D_TREE);D(26,y,D_TREE);}
  for(x=17;x<31;x+=4){F(x,17,D_FLOW);F(x+1,30,D_BENCH);}
  for(y=4;y<20;y+=4){D(14,y,D_LAMP);D(33,y,D_LAMP);}
  scat(1,1,46,46,D_FLOW,.025f);scat(1,1,46,46,D_BUSH,.02f);scat(14,36,8,10,D_TREE,.12f);
  F(17,22,D_LAMP);F(30,25,D_LAMP);F(17,25,D_LAMP);F(30,22,D_LAMP);F(20,19,D_STATUE);F(27,28,D_STATUE);F(36,24,D_WELL);
  /* personaggi */
  npc("marcus",21,3,0);npc("guardia_porta",21,44,0);npc("ugo",19,25,0);npc("gerald",27,29,0);npc("tommaso",34,44,1);npc("kael",41,12,0);
  npc("villico",19,21,1);npc("villico",29,24,1);npc("villico",10,23,1);npc("villico",35,23,1);
  {Ent*e;e=npc("villico",23,15,1);if(e)strcpy(e->name,"Anna");e=npc("villico",12,24,1);if(e)strcpy(e->name,"Bruno");}
}

/* ================= interni ================= */
static const char*L_CASTLE[]={"################","#pp...pKKp...pp#","#..............#","#p...======...p#","#....======....#","#T...======...T#","#....======....#","#p...======...p#","#....======....#","#S...======...S#","#....======...V#","#......==......#","#######D########",0};
static const char*L_TAVERN[]={"##############","#bbb.CCCCC..F#","#............#","#.TT..TT..TT.#","#............#","#.TT..TT..TT.#","#............#","#k..........k#","#bb........bb#","#............#","######D#######",0};
static const char*L_SMITH[]={"###########","#wwww...FF#","#.........#","#..A....A.#","#.........#","#kk.....bb#","#.........#","#....C....#","####D######",0};
static const char*L_ALCH[]={"##########","#SSS..SSS#","#........#","#..P.....#","#........#","#p..CC..p#","#........#","#k.......#","####D#####",0};
static const char*L_TEMPLE[]={"#############","#p...XXX...p#","#...........#","#.nn..=..nn.#","#.....=.....#","#.nn..=..nn.#","#.....=.....#","#.nn..=..nn.#","#p....=....p#","######D######",0};
static const char*L_HOUSE[]={"########","#BB..Sp#","#......#","#.TT...#","#.TT..c#","#......#","#b.....#","###D####",0};
static const char*L_PAL48[]={"################","#pp...pKKp...pp#","#..............#","#n.....==.....n#","#n.....==.....n#","#p.....==.....p#","#......==......#","#T.....==.....T#","#......==......#","#######D########",0};
static const char*L_SIR48[]={"##############","#bbb.CCCC..F.#","#............#","#.TT..TT..TT.#","#............#","#.TT..TT..TT.#","#............#","#k..........b#","######D#######",0};
static void genInterior(const char**L,u32 fl,u32 fl2,u32 wall,int out){int x,y,w=0,h=0;while(L[h]){int l=strlen(L[h]);if(l>w)w=l;h++;}N=w>h?w:h;N+=2;fill(T_VOID);
  pal.a=fl;pal.b=fl2;pal.wall=wall;pal.road1=fl;pal.road2=fl2;pal.bg=C(0x141820);pal.th=99;
  for(y=0;y<h;y++)for(x=0;x<(int)strlen(L[y]);x++){char c=L[y][x];int X=x+1,Y=y+1;
    switch(c){case '#':M[Y][X]=T_WALL;break;case '.':M[Y][X]=T_FLOOR;break;case '=':M[Y][X]=T_CARPET;break;
    case 'D':M[Y][X]=T_FLOOR;{Ent*p=portal(X,Y,out,0,ZDEF[out].n);if(p)p->sub=3;}break;
    case 'c':M[Y][X]=T_FLOOR;if(!(P.flags&(1<<Zk))){Ent*e=entNew(E_CHEST,X+.5f,Y+.5f);if(e){e->data=1000+Zk;}}break;
    case 'V':M[Y][X]=T_FLOOR;if(P.st>=2){Ent*p=portal(X,Y,Z_DUNG,dungIdx("cittadella")*16+1,"Cittadella del Vuoto");if(p)p->sub=4;}break;
    default:M[Y][X]=T_DEC;DEC[Y][X]=c=='S'?D_SHELF:c=='T'?D_TABLE:c=='B'?D_BED:c=='b'?D_BARREL:c=='k'?D_CRATE:c=='C'?D_COUNTER:c=='A'?D_ANVIL:c=='F'?D_FORGE:c=='P'?D_CAULDRON:c=='X'?D_ALTAR:c=='K'?D_THRONE:c=='n'?D_PEW:c=='p'?D_PLANT:c=='w'?D_RACK:D_CRATE;}}
}

/* ================= zone aperte ================= */
static int wildTheme=0;
static void wildPal(int z){if(z==Z_FOREST){pal.a=C(0x4f8a3c);pal.b=C(0x478034);pal.wall=C(0x2f6b2a);pal.bg=C(0x9fd0f0);}
  else if(z==Z_DESERT){pal.a=C(0xd9b56b);pal.b=C(0xcfab62);pal.wall=C(0x4e9a47);pal.bg=C(0xf0d9a0);}
  else{pal.a=C(0xe6edf4);pal.b=C(0xdbe4ee);pal.wall=C(0x2f5a4a);pal.bg=C(0xb8cde0);}pal.road1=shade(pal.a,.85f);pal.road2=shade(pal.b,.85f);pal.pool=z==Z_PEAKS?C(0xbfe3f5):C(0x3b86d6);}
static void genWild(int z){int x,y,i;N=40;fill(T_FLOOR);wildTheme=z;wildPal(z);pal.th=z;
  for(y=0;y<N;y++)for(x=0;x<N;x++)if(!x||!y||x==N-1||y==N-1||frand()<.13f)M[y][x]=T_WALL;
  for(i=0;i<4;i++){int cx=irand(8,N-9),cy=irand(8,N-9),r=irand(2,3);for(y=cy-r;y<=cy+r;y++)for(x=cx-r;x<=cx+r;x++)if((x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r)M[y][x]=T_WATER;}
  int gx,gy,sx,sy;if(z==Z_FOREST){gx=N/2;gy=N-2;}else if(z==Z_DESERT){gx=1;gy=N/2;}else{gx=N-2;gy=N/2;}
  for(y=gy-4;y<=gy+4;y++)for(x=gx-4;x<=gx+4;x++)if(ok(x,y))M[y][x]=T_FLOOR;
  if(z==Z_FOREST){sx=gx;sy=gy-2;M[N-1][gx]=T_FLOOR;portal(gx,N-1,Z_TOWN,0,"Aldoria");}
  else if(z==Z_DESERT){sx=gx+2;sy=gy;M[gy][0]=T_FLOOR;portal(0,gy,Z_TOWN,0,"Aldoria");}
  else{sx=gx-2;sy=gy;M[gy][N-1]=T_FLOOR;portal(N-1,gy,Z_TOWN,0,"Aldoria");}
  /* un sentiero di terra battuta attraverso la zona */
  {int ex=N-gx,ey=N-gy;if(z==Z_FOREST){ex=N/2;ey=4;}for(i=0;i<3;i++){int mx=irand(8,N-9),my=irand(8,N-9);dig(sx,sy,mx,my,T_ROAD);sx=mx;sy=my;}dig(sx,sy,ex,ey,T_ROAD);}
  if(z==Z_FOREST){sx=gx;sy=gy-2;}else if(z==Z_DESERT){sx=gx+2;sy=gy;}else{sx=gx-2;sy=gy;}
  bfs(sx,sy);for(y=1;y<N-1;y++)for(x=1;x<N-1;x++)if(M[y][x]==T_FLOOR&&!reach(x,y))M[y][x]=T_WALL;
  /* boss lontano, ingressi dei dungeon */
  int bx=sx,by=sy,bd=0;for(y=2;y<N-2;y++)for(x=2;x<N-2;x++)if(reach(x,y)&&DD[y*MAXN+x]>bd){bd=DD[y*MAXN+x];bx=x;by=y;}
  const char*bossN=z==Z_FOREST?"troll":z==Z_DESERT?"faraone":"drago_brina";
  for(i=0;i<NDDEF;i++){const char*en=DDEF[i].ent;int match=(z==Z_FOREST&&!strcmp(en,"forest"))||(z==Z_DESERT&&!strcmp(en,"desert"))||(z==Z_PEAKS&&!strcmp(en,"peaks"));if(!match)continue;
    int px,py;if(freeSpot(&px,&py,12)){for(y=py-1;y<=py+1;y++)for(x=px-1;x<=px+1;x++)if(ok(x,y)&&M[y][x]==T_WALL)M[y][x]=T_FLOOR;Ent*p=portal(px,py,Z_DUNG,i*16+1,DDEF[i].n);if(p)p->sub=2;}}
  enemy(bossN,bx,by);
  const char*EN[3][3]={{"slime","lupo","goblin"},{"scorpione","sciacallo","mummia"},{"lupo_gelo","yeti","elem_ghiaccio"}};int ti=z==Z_FOREST?0:z==Z_DESERT?1:2;
  for(i=0;i<14;i++){int px,py;if(freeSpot(&px,&py,8))enemy(EN[ti][i%3],px,py);}
  for(i=0;i<3;i++){int px,py;if(freeSpot(&px,&py,6)){Ent*e=entNew(E_CHEST,px+.5f,py+.5f);if(e)e->data=-1;}}
  /* arredi sul prato */
  for(y=1;y<N-1;y++)for(x=1;x<N-1;x++)if(M[y][x]==T_FLOOR&&!DEC[y][x]){float q=frand();
    if(z==Z_FOREST){if(q<.03f)W(x,y,D_FLOW);else if(q<.05f)D(x,y,D_BUSH);else if(q<.06f)D(x,y,D_ROCK);}
    else if(z==Z_DESERT){if(q<.02f)D(x,y,D_ROCK);else if(q<.03f)D(x,y,D_BONES);}
    else{if(q<.02f)D(x,y,D_SNOWROCK);}}
  P.x=sx+.5f;P.y=sy+.5f;
}

/* ================= PORTO ================= */
static void genPorto(void){int x,y;N=40;fill(T_FLOOR);border(T_WALL);pal.a=C(0x9a9a7a);pal.b=C(0x929272);pal.road1=C(0xb0a690);pal.road2=C(0xa69c86);pal.wall=C(0x8a8478);pal.bg=C(0x8fc8f0);pal.pool=C(0x3b86d6);pal.th=0;
  R4(1,26,N-2,13,T_WATER);R4(18,1,4,25,T_ROAD);R4(3,22,34,4,T_ROAD);
  for(y=26;y<36;y++)for(x=19;x<21;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}for(y=26;y<32;y++)for(x=8;x<10;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}for(y=26;y<33;y++)for(x=30;x<32;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}
  M[0][19]=M[0][20]=T_ROAD;portal(19,0,Z_TOWN,0,"Aldoria");
  H(4,4,8,6,24,C(0xd8c8a8),C(0x2a6a8a),BS_HOUSE,8,-1,"");H(26,4,9,6,26,C(0xc8c0b0),C(0x8a3a2a),BS_HOUSE,30,-1,"");H(4,13,7,5,22,C(0xe0d4b8),C(0x3a8a6a),BS_HOUSE,7,-1,"");
  H(33,14,4,4,70,C(0xf4f0e8),C(0xc83a3a),BS_LH,35,-1,"");
  for(x=4;x<36;x+=3){if(x>16&&x<23)continue;F(x,21,x%2?D_BARREL:D_CRATE);}F(14,24,D_NET);F(25,24,D_BOLLARD);F(12,25,D_BOLLARD);F(28,25,D_BOLLARD);
  {Ent*p=portal(26,23,Z_DUNG,dungIdx("abisso")*16+1,"Pozzo delle alghe · Abisso Sommerso");if(p)p->sub=2;}
  npc("nino",9,30,0);npc("marina",20,34,0);npc("villico",14,23,1);
  {Ent*e=npc("trag",19,36,0);if(e){e->x=20.f;e->y=36.6f;}}
  scat(1,1,38,20,D_FLOW,.02f);for(y=2;y<20;y+=4){D(16,y,D_LAMP);D(23,y,D_LAMP);}
  P.x=20;P.y=3;}

/* ================= THALASSA ================= */
static void genThal(void){int x,y;N=44;fill(T_FLOOR);border(T_WALL);pal.a=C(0xb4bc74);pal.b=C(0xacb46c);pal.road1=C(0xefe9dc);pal.road2=C(0xe6dfd0);pal.wall=C(0xe8e0d0);pal.bg=C(0x7fc0f0);pal.pool=C(0x2a8ad0);pal.th=0;
  R4(1,34,N-2,9,T_WATER);R4(20,10,4,24,T_ROAD);R4(3,18,38,2,T_ROAD);R4(14,20,16,7,T_ROAD);R4(8,28,28,6,T_ROAD);
  for(y=34;y<41;y++)for(x=21;x<23;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}for(y=34;y<38;y++)for(x=11;x<13;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}for(y=34;y<38;y++)for(x=31;x<33;x++){M[y][x]=T_ROAD;DEC[y][x]=D_PIER;}
  /* sabbia, palazzo, case dai tetti colorati */
  for(y=28;y<34;y++)for(x=1;x<8;x++)if(M[y][x]==T_FLOOR)DEC[y][x]=D_SAND;
  R4(14,8,16,2,T_ROAD);H(14,2,16,6,46,C(0xf8f4ec),C(0x2ab8a8),BS_CASTLE,21,Z_IN_PAL48,"Palazzo di Thalassa");
  u32 RF[6]={C(0x2a8aa8),C(0xd87a3a),C(0x3aa8a0),C(0xc84a4a),C(0x2a6ab8),C(0xe8b84a)};
  H(2,2,5,5,22,C(0xf4f0e8),RF[0],BS_HOUSE,4,-1,"");H(8,2,5,5,24,C(0xece4d4),RF[1],BS_HOUSE,10,-1,"");H(31,2,5,5,22,C(0xf4f0e8),RF[2],BS_HOUSE,33,-1,"");H(37,2,5,5,26,C(0xece4d4),RF[3],BS_HOUSE,39,-1,"");
  H(2,10,5,5,22,C(0xf4f0e8),RF[4],BS_HOUSE,4,-1,"");H(37,10,5,5,22,C(0xf4f0e8),RF[5],BS_HOUSE,39,-1,"");
  H(3,21,8,5,26,C(0xece4d4),C(0xd87a3a),BS_HOUSE,7,Z_IN_SIR48,"Taverna della Sirena");R4(7,27,1,1,T_ROAD);
  H(33,21,8,6,32,C(0xf4f0e8),C(0x2ab8a8),BS_TEMPLE,37,-1,"");H(39,30,3,3,80,C(0xf4f0e8),C(0xc83a3a),BS_LH,40,-1,"");
  /* piazza a mosaico con la fontana, il mercato, le palme */
  for(y=20;y<27;y++)for(x=14;x<30;x++)if(M[y][x]==T_ROAD)DEC[y][x]=D_MOSAIC;
  R4(21,22,2,2,T_DEC);DEC[22][21]=D_FOUNT;DEC[22][22]=DEC[23][21]=DEC[23][22]=255;
  for(x=9;x<36;x+=2){if(x>=19&&x<=24)continue;F(x,28,D_STALL);}
  for(y=11;y<18;y+=3){F(19,y,D_PALM);F(24,y,D_PALM);}F(14,20,D_PALM);F(29,20,D_PALM);F(14,26,D_PALM);F(29,26,D_PALM);
  for(x=2;x<8;x+=3)D(x,31,D_UMBR);D(2,29,D_PALM);D(6,28,D_PALM);
  for(y=2;y<9;y+=2){D(13,y,D_CYPRESS);D(30,y,D_CYPRESS);}
  for(x=12;x<34;x+=4)F(x,33,D_BOLLARD);F(15,11,D_LEMON);F(28,11,D_LEMON);F(15,15,D_LEMON);F(28,15,D_LEMON);
  scat(1,1,42,16,D_FLOW,.03f);
  /* il cancello della giungla, il traghetto */
  M[19][0]=T_ROAD;M[18][0]=T_ROAD;portal(0,18,Z_JUNGLE,0,"Giungla di Smeraldo");
  {Ent*e=npc("trag",21,40,0);if(e){e->x=22.f;e->y=40.6f;}}
  npc("guardia48",19,8,0);npc("guardia48",24,8,0);npc("zefiro",17,27,0);npc("teti",27,29,0);npc("coral",18,23,1);npc("marea",25,24,1);npc("ilio",11,37,0);npc("villico",9,19,1);
  P.x=22;P.y=33;}

/* ================= GIUNGLA ================= */
static void genJungle(void){int x,y,i;N=44;fill(T_FLOOR);border(T_WALL);pal.a=C(0x4f9a4c);pal.b=C(0x47904a);pal.road1=C(0x8a7450);pal.road2=C(0x82704a);pal.wall=C(0x2f5a2a);pal.bg=C(0x8fd0b0);pal.pool=C(0x3b96c6);pal.th=Z_JUNGLE;
  /* vegetazione a macchie */
  for(y=1;y<N-1;y++)for(x=1;x<N-1;x++){float v=(sinf(x*.33f+1.3f)*cosf(y*.29f)+sinf((x+y)*.17f))*.5f+frand()*.35f;float q=frand();
    if(v>.55f){if(q<.4f)D(x,y,D_BIGTREE);else if(q<.6f)D(x,y,D_PALM);else if(q<.75f)D(x,y,D_BANANA);else D(x,y,D_BUSH);}
    else if(v>.35f){if(q<.12f)D(x,y,D_BIGTREE);else if(q<.3f)W(x,y,D_FERN);else if(q<.34f)W(x,y,D_BIGFLOW);}else if(q<.08f)W(x,y,D_FERN);}
  /* il fiume */
  for(y=1;y<N-1;y++){int rx=(int)(31+sinf(y*.2f)*3);for(x=rx;x<rx+3;x++){M[y][x]=T_WATER;DEC[y][x]=0;}}
  /* sentieri */
  int G[2]={N-2,22},T[2]={20,6},S[3][2]={{6,12},{38,30},{8,36}};
  dig(G[0],G[1],20,22,T_ROAD);dig(20,22,T[0],T[1]+3,T_ROAD);for(i=0;i<3;i++)dig(20,22,S[i][0],S[i][1],T_ROAD);
  for(y=1;y<N-1;y++)for(x=1;x<N-1;x++)if(M[y][x]==T_ROAD&&x>=28&&x<=36){int rx=(int)(31+sinf(y*.2f)*3);if(x>=rx&&x<rx+3)DEC[y][x]=D_PIER;}
  /* il tempio */
  for(y=2;y<=10;y++)for(x=14;x<=26;x++){M[y][x]=T_ROAD;DEC[y][x]=D_RUIN;}
  H(17,2,7,4,40,C(0x7a8a78),C(0x6a7a6a),BS_TEMPLE,20,-1,"");
  {Ent*p=portal(20,6,Z_DUNG,dungIdx("tempio48")*16+1,"Tempio di Giada");if(p){p->sub=2;p->lock=P.ol<3;}}
  for(y=3;y<=9;y+=2){F(14,y,D_PILLAR);F(26,y,D_PILLAR);}F(17,8,D_JADEP);F(23,8,D_JADEP);
  /* santuari dei sigilli */
  for(i=0;i<3;i++){int sx=S[i][0],sy=S[i][1];for(y=sy-2;y<=sy+2;y++)for(x=sx-2;x<=sx+2;x++)if(ok(x,y)&&M[y][x]!=T_WATER){M[y][x]=T_ROAD;DEC[y][x]=D_RUIN;}
    F(sx-2,sy-2,D_PILLAR);F(sx+2,sy-2,D_PILLAR);F(sx-2,sy+2,D_PILLAR);F(sx+2,sy+2,D_PILLAR);
    Ent*e=entNew(E_SHRINE,sx+.5f,sy+.5f);if(e){e->data=i;strcpy(e->name,"Santuario di Giada");}}
  /* campo di Ilva */
  R4(34,38,5,3,T_FLOOR);npc("ilva",35,39,0);
  M[22][N-1]=T_ROAD;portal(N-1,22,Z_THAL,0,"Thalassa");
  bfs(N-2,22);for(y=1;y<N-1;y++)for(x=1;x<N-1;x++)if(walk(x,y)&&!reach(x,y)){M[y][x]=T_DEC;if(!DEC[y][x])DEC[y][x]=D_BUSH;}
  const char*EN[3]={"scimmia48","pantera48","serpe48"};for(i=0;i<14;i++){int px,py;if(freeSpot(&px,&py,8))enemy(EN[i%3],px,py);}
  for(i=0;i<3;i++){int px,py;if(freeSpot(&px,&py,6)){Ent*e=entNew(E_CHEST,px+.5f,py+.5f);if(e)e->data=-1;}}
  P.x=N-2.5f;P.y=22.5f;}

/* ================= COLOSSEO ================= */
static void genArena(void){int x,y;N=30;fill(T_FLOOR);pal.a=C(0xd8c08a);pal.b=C(0xcfb680);pal.road1=C(0xb8a070);pal.road2=C(0xb0986a);pal.wall=C(0x9a8a70);pal.bg=C(0x7fb6e6);pal.th=0;
  for(y=0;y<N;y++)for(x=0;x<N;x++){float d=sqrtf((x-14.5f)*(x-14.5f)+(y-14.5f)*(y-14.5f));if(d>13.5f)M[y][x]=T_VOID;else if(d>12)M[y][x]=T_WALL;}
  M[27][14]=M[27][15]=T_ROAD;M[26][14]=M[26][15]=T_ROAD;portal(14,27,Z_TOWN,0,"Aldoria");
  for(y=0;y<N;y++)for(x=0;x<N;x++){float d=sqrtf((x-14.5f)*(x-14.5f)+(y-14.5f)*(y-14.5f));if(d>10.5f&&d<12&&M[y][x]==T_FLOOR&&(x+y)%5==0)D(x,y,D_TORCH);}
  npc("kael",13,24,0);P.x=15;P.y=24.5f;}

/* ================= DUNGEON ================= */
static void dungPal(int th){switch(th){
  case TH_CAVE:pal.a=C(0x6b5a48);pal.b=C(0x635342);pal.wall=C(0x4a3c30);pal.bg=C(0x0a0806);break;
  case TH_CRYPT:pal.a=C(0x5b5f6e);pal.b=C(0x53576a);pal.wall=C(0x3a3d4a);pal.bg=C(0x07080c);break;
  case TH_PYR:pal.a=C(0xc9a860);pal.b=C(0xbf9f58);pal.wall=C(0x8f7a48);pal.bg=C(0x0c0a05);break;
  case TH_ICE:pal.a=C(0xa8c8e0);pal.b=C(0x9cbcd6);pal.wall=C(0x6f9ab8);pal.bg=C(0x05080d);break;
  case TH_FIRE:pal.a=C(0x5a3a32);pal.b=C(0x523530);pal.wall=C(0x3a2420);pal.bg=C(0x100403);pal.pool=C(0xff6a1a);break;
  case TH_SEA:pal.a=C(0x3f6a6a);pal.b=C(0x3a6262);pal.wall=C(0x24464a);pal.bg=C(0x020809);pal.pool=C(0x2a7ab0);break;
  case TH_VOID:pal.a=C(0x3a2f4f);pal.b=C(0x342a48);pal.wall=C(0x211a30);pal.bg=C(0x030206);pal.pool=C(0x5a2a8a);break;
  default:pal.a=C(0x5a7a6a);pal.b=C(0x527264);pal.wall=C(0x3a5a4a);pal.bg=C(0x04100a);pal.pool=C(0x2a9a7a);break;}
  pal.road1=shade(pal.a,1.1f);pal.road2=shade(pal.b,1.1f);pal.th=100+th;}
typedef struct{int x,y,w,h;} Room;
static void genDungeon(int di,int fl){const DungDef*d=&DDEF[di];int x,y,i;N=42;fill(T_WALL);dungPal(d->th);if(d->th!=TH_FIRE&&d->th!=TH_SEA&&d->th!=TH_VOID&&d->th!=TH_JADE)pal.pool=C(0x2a5a8a);
  Room R[12];int nr=0;
  for(i=0;i<80&&nr<10;i++){int w=irand(5,9),h=irand(5,8),rx=irand(2,N-w-3),ry=irand(2,N-h-3),k,bad=0;for(k=0;k<nr;k++)if(rx<R[k].x+R[k].w+2&&rx+w+2>R[k].x&&ry<R[k].y+R[k].h+2&&ry+h+2>R[k].y){bad=1;break;}
    if(bad)continue;R[nr].x=rx;R[nr].y=ry;R[nr].w=w;R[nr].h=h;nr++;R4(rx,ry,w,h,T_FLOOR);}
  for(i=1;i<nr;i++){int ax=R[i-1].x+R[i-1].w/2,ay=R[i-1].y+R[i-1].h/2,bx=R[i].x+R[i].w/2,by=R[i].y+R[i].h/2;
    for(x=ax;x!=bx;x+=bx>ax?1:-1){M[ay][x]=T_FLOOR;M[ay+1][x]=T_FLOOR;}for(y=ay;y!=by;y+=by>ay?1:-1){M[y][bx]=T_FLOOR;M[y][bx+1]=T_FLOOR;}}
  /* pozze (lava, acqua, vuoto) e arredi nelle stanze */
  for(i=1;i<nr-1;i++)if(frand()<.35f){Room*r=&R[i];int cx=r->x+r->w/2,cy=r->y+r->h/2;if(r->w>6&&r->h>5){M[cy][cx-1]=M[cy][cx]=d->th==TH_FIRE?T_LAVA:T_WATER;}}
  int dc[8]={D_BONES,D_PILLAR,D_CRATE,D_BARREL,D_CRYSTAL,D_LAVAROCK,D_CORAL,D_VOIDP};
  for(i=0;i<nr;i++){Room*r=&R[i];int k;for(k=0;k<3;k++){int px=r->x+irand(0,r->w-1),py=r->y+irand(0,r->h-1);if(px==r->x+r->w/2||py==r->y+r->h/2)continue;
      int c=d->th==TH_ICE?D_CRYSTAL:d->th==TH_FIRE?D_LAVAROCK:d->th==TH_SEA?D_CORAL:d->th==TH_VOID?D_VOIDP:d->th==TH_JADE?D_JADEP:dc[irand(0,3)];
      if(px>r->x&&px<r->x+r->w-1&&py>r->y&&py<r->y+r->h-1)D(px,py,c);}}
  /* le torce sui muri */
  for(y=1;y<N-1;y++)for(x=1;x<N-1;x++)if(M[y][x]==T_WALL&&walk(x,y+1)&&frand()<.12f)DEC[y][x]=D_TORCH;
  int sx=R[0].x+R[0].w/2,sy=R[0].y+R[0].h/2;
  bfs(sx,sy);
  Room*last=&R[nr-1];int lx=last->x+last->w/2,ly=last->y+last->h/2;
  portal(sx-1,sy-1,d->fin?Z_IN_CASTLE:(!strcmp(d->ent,"forest")?Z_FOREST:!strcmp(d->ent,"desert")?Z_DESERT:!strcmp(d->ent,"peaks")?Z_PEAKS:!strcmp(d->ent,"porto")?Z_PORTO:!strcmp(d->ent,"giungla")?Z_JUNGLE:Z_TOWN),0,"Uscita");
  float lv=d->lv+(P.done[di]>0?P.done[di]*3:0)+fl-1;zoneLv=lv;
  if(fl<d->fls){Ent*p=portal(lx,ly,Z_DUNG,di*16+fl+1,"Scale verso il basso");if(p)p->sub=5;}
  else{Ent*b=enemy(d->boss,lx+.0f,ly+.0f);(void)b;}
  for(i=1;i<nr;i++){Room*r=&R[i];int k,n=irand(2,4)+(fl>1);for(k=0;k<n;k++){int px=r->x+irand(1,r->w-2),py=r->y+irand(1,r->h-2);if(!walk(px,py))continue;int en=0;while(d->en[en]&&en<4)en++;enemy(d->en[irand(0,en-1)],px,py);}}
  for(i=0;i<2;i++){int px,py;if(freeSpot(&px,&py,6)){Ent*e=entNew(E_CHEST,px+.5f,py+.5f);if(e)e->data=-2;}}
  P.x=sx+.5f;P.y=sy+.5f;}

/* ================= disegno statico ================= */
static float hh(int x,int y){float n=sinf(x*127.1f+y*311.7f)*43758.5f;return n-floorf(n);}
static void mTree(int x,int y,float h){float s=.85f+h*.3f;meshBox(x+.42f,y+.42f,0,.16f,.16f,12*s,C(0x6b4a2b),1);meshBox(x+.12f,y+.12f,10*s,.76f,.76f,12*s,C(0x3f8a36),.95f+h*.1f);meshBox(x+.24f,y+.24f,22*s,.52f,.52f,8*s,C(0x4a9a3e),1);meshBox(x+.36f,y+.36f,30*s,.28f,.28f,5*s,C(0x55a845),1);}
static void mPine(int x,int y,float h,int snow){float s=.9f+h*.3f;meshBox(x+.42f,y+.42f,0,.16f,.16f,8,C(0x5a3a22),1);meshBox(x+.1f,y+.1f,6,.8f,.8f,8*s,C(0x2f6a3a),1);meshBox(x+.2f,y+.2f,6+8*s,.6f,.6f,8*s,C(0x357a42),1);meshBox(x+.32f,y+.32f,6+16*s,.36f,.36f,8*s,C(0x3a8a4a),1);
  if(snow){meshBox(x+.2f,y+.2f,6+16*s,.6f,.6f,1.2f,C(0xf4f8fc),1);meshBox(x+.32f,y+.32f,6+24*s,.36f,.36f,1.5f,C(0xffffff),1);}}
static void mRock(int x,int y,float h,u32 c){float hz=6+h*7;meshBox(x+.1f,y+.14f,0,.8f,.72f,hz,c,.92f+h*.1f);meshBox(x+.2f,y+.2f,hz,.56f,.5f,2.4f,c,1.04f);}
static void mPalm(int x,int y,float h){int i;float top=28+h*8;for(i=0;i<6;i++)meshBox(x+.42f+(h>.5f?1:-1)*i*.03f,y+.42f,i*top/6,.16f,.16f,top/6+.3f,i%2?C(0x8a6a42):C(0x7a5a3a),1);
  float cx=x+.5f,cy=y+.5f;for(i=0;i<6;i++){float a=i*1.047f+h*2,dx=cosf(a),dy=sinf(a);int j;for(j=0;j<3;j++)meshBox(cx+dx*(.12f+j*.17f)-.07f,cy+dy*(.12f+j*.17f)-.07f,top-j*j*1.3f,.14f,.14f,1.4f,j%2?C(0x3a8a3a):C(0x2f7a30),1);}
  meshBox(cx-.1f,cy-.08f,top-2.5f,.1f,.1f,2.2f,C(0x6a4a2a),1);}
static void addLight(float x,float y,float z,u32 c,float r){if(nlights>=160)return;Light*l=&LIGHTS[nlights++];l->x=x;l->y=y;l->z=z;l->c=c;l->r=r;}
static void decMesh(int x,int y,int c,float h){u32 k;switch(c){
  case D_TREE:mTree(x,y,h);break;
  case D_BIGTREE:{float s=.9f+h*.3f;meshBox(x+.38f,y+.38f,0,.24f,.24f,34*s,C(0x5a3a22),1);meshBox(x-.1f,y-.1f,28*s,1.2f,1.2f,8,C(0x2a6a2a),1);meshBox(x+.1f,y+.1f,28*s+8,.8f,.8f,6,C(0x3a8433),1);}break;
  case D_BUSH:meshBox(x+.12f,y+.14f,0,.76f,.72f,8+h*4,C(0x3f8a3a),.95f+h*.1f);meshBox(x+.2f,y+.2f,8+h*4,.56f,.5f,3,C(0x4a9a42),1);if(h>.5f){meshBox(x+.3f,y+.3f,10+h*4,.1f,.1f,1.5f,C(0xff5a8a),1);meshBox(x+.6f,y+.5f,9+h*4,.1f,.1f,1.5f,C(0xffd84a),1);}break;
  case D_FLOW:{u32 fc[4]={C(0xff5a8a),C(0xffd84a),C(0x8a6aff),C(0xffffff)};meshBox(x+.2f,y+.2f,0,.6f,.6f,1.5f,C(0x4a8a3a),1);meshBox(x+.3f,y+.3f,1.5f,.12f,.12f,1.5f,fc[(x+y)%4],1);meshBox(x+.6f,y+.55f,1.5f,.12f,.12f,1.5f,fc[(x*3+y)%4],1);meshBox(x+.45f,y+.7f,1.5f,.1f,.1f,1.5f,fc[(x+y*2)%4],1);}break;
  case D_BENCH:meshBox(x+.1f,y+.35f,4,.8f,.3f,2,C(0x8a6a42),1);meshBox(x+.12f,y+.38f,0,.08f,.24f,4,C(0x5a4a3a),1);meshBox(x+.8f,y+.38f,0,.08f,.24f,4,C(0x5a4a3a),1);meshBox(x+.1f,y+.3f,6,.8f,.06f,5,C(0x8a6a42),1);break;
  case D_LAMP:addLight(x+.5f,y+.5f,28,C(0xffd890),70);meshBox(x+.44f,y+.44f,0,.12f,.12f,26,C(0x2a2a30),1);meshBox(x+.36f,y+.36f,26,.28f,.28f,5,C(0xffe08a),1.2f);meshBox(x+.34f,y+.34f,31,.32f,.32f,1.5f,C(0x2a2a30),1);break;
  case D_FENCE:meshBox(x+.42f,y+.42f,0,.16f,.16f,10,C(0x7a5a3a),1);meshBox(x,y+.46f,6,1,.08f,2,C(0x8a6a42),1);meshBox(x+.46f,y,6,.08f,1,2,C(0x8a6a42),1);break;
  case D_STALL:{u32 cl[4]={C(0xc84a3a),C(0x2a8aa8),C(0xe8a83a),C(0x3a9a6a)};k=cl[(x+y)%4];int i;meshBox(x+.1f,y+.28f,0,.8f,.46f,9,C(0x8a6a42),1);meshBox(x+.08f,y+.08f,0,.06f,.06f,22,C(0x6a4a2a),1);meshBox(x+.86f,y+.08f,0,.06f,.06f,22,C(0x6a4a2a),1);meshBox(x+.08f,y+.84f,0,.06f,.06f,22,C(0x6a4a2a),1);meshBox(x+.86f,y+.84f,0,.06f,.06f,22,C(0x6a4a2a),1);
    for(i=0;i<4;i++)meshBox(x+.04f+i*.23f,y+.06f,22,.23f,.88f,1.6f,i%2?C(0xf4f0e8):k,1);meshBox(x+.18f,y+.34f,9,.18f,.3f,2.4f,C(0xffa83a),1);meshBox(x+.46f,y+.34f,9,.18f,.3f,2.4f,C(0xd84a3a),1);meshBox(x+.7f,y+.34f,9,.12f,.3f,2.4f,C(0x6ac04a),1);}break;
  case D_STATUE:meshBox(x+.15f,y+.15f,0,.7f,.7f,8,C(0xa8a8b0),1);meshBox(x+.3f,y+.3f,8,.4f,.4f,18,C(0xc8c8d0),1);meshBox(x+.32f,y+.32f,26,.36f,.36f,8,C(0xd0d0d8),1);meshBox(x+.25f,y+.25f,34,.5f,.5f,2,C(0xd4af37),1);break;
  case D_WELL:meshBox(x+.1f,y+.1f,0,.8f,.8f,8,C(0x9a9488),1);meshBox(x+.2f,y+.2f,7.9f,.6f,.6f,.2f,C(0x2a5a9a),1);meshBox(x+.1f,y+.45f,8,.08f,.1f,16,C(0x6a4a2a),1);meshBox(x+.82f,y+.45f,8,.08f,.1f,16,C(0x6a4a2a),1);meshBox(x+.05f,y+.05f,24,.9f,.9f,2,C(0x8a3a2a),1);break;
  case D_FOUNT:meshBox(x,y,0,2,2,4,C(0xd8d0c0),1);meshBox(x+.12f,y+.12f,4,1.76f,1.76f,.3f,C(0x3a9ad8),1.1f);meshBox(x+.8f,y+.8f,4,.4f,.4f,14,C(0xd8d0c0),1);meshBox(x+.55f,y+.55f,18,.9f,.9f,2,C(0xe8e0d0),1);meshBox(x+.65f,y+.65f,20,.7f,.7f,.3f,C(0x5ab0e8),1.1f);meshBox(x+.9f,y+.9f,20,.2f,.2f,8,C(0x2ab87a),1);break;
  case D_PALM:mPalm(x,y,h);break;
  case D_ROCK:mRock(x,y,h,pal.th==Z_DESERT?C(0xa8906a):C(0x8a8a84));break;
  case D_SNOWROCK:mRock(x,y,h,C(0x9aa4b0));meshBox(x+.2f,y+.2f,6+h*7+2.4f,.56f,.5f,1.5f,C(0xffffff),1);break;
  case D_CACTUS:meshBox(x+.38f,y+.38f,0,.24f,.24f,22,C(0x4e9a47),1);meshBox(x+.16f,y+.42f,8,.22f,.16f,4,C(0x4e9a47),1);meshBox(x+.16f,y+.42f,12,.12f,.16f,8,C(0x4e9a47),1);meshBox(x+.62f,y+.42f,12,.22f,.16f,4,C(0x4e9a47),1);meshBox(x+.72f,y+.42f,16,.12f,.16f,8,C(0x4e9a47),1);break;
  case D_PINE:mPine(x,y,h,pal.th==Z_PEAKS);break;
  case D_GRAVE:meshBox(x+.25f,y+.4f,0,.5f,.2f,12,C(0x8a8a90),1);meshBox(x+.2f,y+.2f,0,.6f,.6f,.5f,C(0x5a6a4a),1);meshBox(x+.42f,y+.38f,12,.16f,.24f,3,C(0x9a9aa0),1);break;
  case D_CRATE:meshBox(x+.15f,y+.15f,0,.7f,.7f,12,C(0x9a7a4a),1);meshBox(x+.15f,y+.85f,0,.7f,.02f,12,C(0x6a4a2a),1);break;
  case D_BARREL:meshBox(x+.2f,y+.2f,0,.6f,.6f,14,C(0x7a5a3a),1);meshBox(x+.18f,y+.18f,3,.64f,.64f,1.5f,C(0x3a3a3a),1);meshBox(x+.18f,y+.18f,10,.64f,.64f,1.5f,C(0x3a3a3a),1);break;
  case D_TORCH:meshBox(x+.44f,y+.44f,0,.12f,.12f,20,C(0x5a3a22),1);meshBox(x+.38f,y+.38f,20,.24f,.24f,4,C(0xffb04a),1.4f);addLight(x+.5f,y+.5f,24,C(0xffa040),70);break;
  case D_PILLAR:meshBox(x+.2f,y+.2f,0,.6f,.6f,3,shade(pal.wall,1.2f),1);meshBox(x+.28f,y+.28f,3,.44f,.44f,26,shade(pal.wall,1.35f),1);meshBox(x+.22f,y+.22f,29,.56f,.56f,3,shade(pal.wall,1.2f),1);break;
  case D_SHELF:{int i;meshBox(x+.05f,y+.05f,0,.9f,.9f,30,C(0x6b4a2b),1);for(i=0;i<3;i++){u32 cb[4]={C(0xa83a3a),C(0x3a6aa8),C(0x3a8a4a),C(0xb89a3a)};meshBox(x+.1f,y+.92f,4+i*9,.8f,.05f,6,cb[(i+x+y)%4],1);}}break;
  case D_TABLE:meshBox(x+.05f,y+.05f,8,.9f,.9f,2,C(0x8a6a42),1);meshBox(x+.1f,y+.1f,0,.1f,.1f,8,C(0x6a4a2a),1);meshBox(x+.8f,y+.8f,0,.1f,.1f,8,C(0x6a4a2a),1);meshBox(x+.8f,y+.1f,0,.1f,.1f,8,C(0x6a4a2a),1);meshBox(x+.1f,y+.8f,0,.1f,.1f,8,C(0x6a4a2a),1);if(h>.5f)meshBox(x+.4f,y+.4f,10,.16f,.16f,3,C(0xe8e0d0),1);break;
  case D_BED:meshBox(x+.05f,y+.1f,0,.9f,.8f,6,C(0x7a5a3a),1);meshBox(x+.08f,y+.12f,6,.84f,.76f,2,C(0xc84a5a),1);meshBox(x+.08f,y+.12f,8,.24f,.76f,1.5f,C(0xf4f0e8),1);break;
  case D_COUNTER:meshBox(x,y+.1f,0,1,.8f,14,C(0x7a5a3a),1);meshBox(x-.02f,y+.08f,14,1.04f,.84f,2,C(0x9a7a4a),1);if(h>.6f)meshBox(x+.3f,y+.3f,16,.2f,.2f,6,C(0xc8a040),1);break;
  case D_ANVIL:meshBox(x+.3f,y+.3f,0,.4f,.4f,8,C(0x3a3a3a),1);meshBox(x+.15f,y+.3f,8,.7f,.4f,4,C(0x4a4a4a),1);break;
  case D_FORGE:addLight(x+.5f,y+.9f,8,C(0xff8a3a),60);meshBox(x+.05f,y+.05f,0,.9f,.9f,16,C(0x5a4a4a),1);meshBox(x+.2f,y+.9f,4,.6f,.06f,8,C(0xff6a1a),1.3f);break;
  case D_CAULDRON:meshBox(x+.2f,y+.2f,0,.6f,.6f,10,C(0x2a2a2a),1);meshBox(x+.25f,y+.25f,10,.5f,.5f,.5f,C(0x5aff8a),1.2f);break;
  case D_ALTAR:meshBox(x,y+.1f,0,1,.8f,14,C(0xe8e4d8),1);meshBox(x-.02f,y+.08f,14,1.04f,.84f,3,C(0xd4af37),1);if(h>.5f){meshBox(x+.45f,y+.45f,17,.1f,.1f,8,C(0xf4f0e0),1);meshBox(x+.46f,y+.46f,25,.08f,.08f,3,C(0xffcc33),1.2f);}break;
  case D_THRONE:meshBox(x+.1f,y+.1f,0,.8f,.8f,10,C(0xd4af37),1);meshBox(x+.1f,y+.1f,10,.8f,.25f,26,C(0xa8303a),1);meshBox(x+.1f,y+.1f,36,.8f,.25f,4,C(0xd4af37),1);break;
  case D_PEW:meshBox(x+.05f,y+.3f,0,.9f,.4f,6,C(0x7a5a3a),1);meshBox(x+.05f,y+.26f,6,.9f,.08f,6,C(0x6a4a2a),1);break;
  case D_PLANT:meshBox(x+.3f,y+.3f,0,.4f,.4f,8,C(0xa0603a),1);meshBox(x+.2f,y+.2f,8,.6f,.6f,12,C(0x3f8a3a),.9f+h*.2f);break;
  case D_RACK:meshBox(x+.1f,y+.4f,0,.8f,.15f,22,C(0x6b4a2b),1);meshBox(x+.2f,y+.56f,4,.05f,.05f,24,C(0xcccccc),1);meshBox(x+.5f,y+.56f,4,.05f,.05f,24,C(0xcccccc),1);break;
  case D_FERN:meshBox(x+.2f,y+.3f,0,.3f,.25f,4,C(0x3a8a3a),1);meshBox(x+.5f,y+.45f,0,.25f,.3f,3,C(0x4aa04a),1);break;
  case D_BANANA:meshBox(x+.42f,y+.42f,0,.16f,.16f,20,C(0x6a8a3a),1);meshBox(x+.05f,y+.35f,17,.3f,.3f,2,C(0x4aa83a),1);meshBox(x+.65f,y+.35f,17,.3f,.3f,2,C(0x4aa83a),1);meshBox(x+.35f,y+.05f,17,.3f,.3f,2,C(0x4aa83a),1);meshBox(x+.35f,y+.65f,17,.3f,.3f,2,C(0x4aa83a),1);meshBox(x+.48f,y+.5f,13,.12f,.12f,5,C(0xe8d040),1);break;
  case D_BIGFLOW:meshBox(x+.2f,y+.2f,0,.6f,.6f,1.6f,C(0x2f6a2a),1);meshBox(x+.25f,y+.25f,1.6f,.5f,.5f,2,C(0xc8303a),1);meshBox(x+.4f,y+.4f,3.6f,.2f,.2f,1,C(0x5a1a1a),1);break;
  case D_RUIN:break;
  case D_UMBR:{u32 cl=(x+y)%2?C(0x2a8aa8):C(0xe84a4a);meshBox(x+.47f,y+.47f,0,.06f,.06f,22,C(0xe8e0d0),1);meshBox(x+.1f,y+.1f,22,.8f,.8f,2,cl,1);meshBox(x+.25f,y+.25f,24,.5f,.5f,1.5f,C(0xf4f0e8),1);}break;
  case D_COLUMN:meshBox(x+.28f,y+.28f,0,.44f,.44f,3,C(0xe8e0d0),1);meshBox(x+.33f,y+.33f,3,.34f,.34f,32,C(0xf8f4ec),1);meshBox(x+.26f,y+.26f,35,.48f,.48f,3,C(0xd4af37),1);break;
  case D_CYPRESS:meshBox(x+.42f,y+.42f,0,.16f,.16f,6,C(0x5a3a22),1);meshBox(x+.3f,y+.3f,5,.4f,.4f,22,C(0x2a5a2a),1);meshBox(x+.35f,y+.35f,27,.3f,.3f,10,C(0x2f6a2f),1);break;
  case D_LEMON:{int i;meshBox(x+.42f,y+.42f,0,.16f,.16f,10,C(0x6a4a2a),1);meshBox(x+.18f,y+.18f,9,.64f,.64f,10,C(0x3f8a36),1);for(i=0;i<5;i++)meshBox(x+.2f+hh(x+i,y)*.55f,y+.2f+hh(x,y+i)*.55f,11+i*1.5f,.08f,.08f,1.6f,C(0xffe03a),1);}break;
  case D_BOLLARD:meshBox(x+.36f,y+.36f,0,.28f,.28f,7,C(0x3a3a42),1);meshBox(x+.32f,y+.32f,7,.36f,.36f,1.6f,C(0x4a4a54),1);break;
  case D_NET:meshBox(x+.1f,y+.1f,0,.8f,.8f,3,C(0x8a7a5a),1);meshBox(x+.2f,y+.3f,3,.5f,.4f,2,C(0x6a5a3a),1);break;
  case D_BONES:meshBox(x+.2f,y+.4f,0,.5f,.1f,1.5f,C(0xe8e4d8),1);meshBox(x+.5f,y+.2f,0,.1f,.5f,1.5f,C(0xe8e4d8),1);meshBox(x+.25f,y+.5f,0,.18f,.18f,3,C(0xe8e4d8),1);break;
  case D_CRYSTAL:addLight(x+.4f,y+.4f,10,C(0x9ae0ff),30);meshBox(x+.3f,y+.3f,0,.25f,.25f,18,C(0x9ae0ff),1.1f);meshBox(x+.55f,y+.45f,0,.18f,.18f,11,C(0xc8f0ff),1.1f);break;
  case D_LAVAROCK:mRock(x,y,h,C(0x3a2a2a));meshBox(x+.3f,y+.3f,4,.15f,.15f,.5f,C(0xff6a1a),1.3f);break;
  case D_CORAL:meshBox(x+.3f,y+.3f,0,.12f,.12f,12,C(0xe86a8a),1);meshBox(x+.5f,y+.45f,0,.12f,.12f,8,C(0xff9a6a),1);meshBox(x+.25f,y+.55f,0,.1f,.1f,6,C(0xe8e06a),1);break;
  case D_VOIDP:addLight(x+.5f,y+.5f,22,C(0xc46bff),40);meshBox(x+.3f,y+.3f,0,.4f,.4f,20,C(0x3a2a5a),1);meshBox(x+.38f,y+.38f,20,.24f,.24f,4,C(0xc46bff),1.3f);break;
  case D_JADEP:addLight(x+.5f,y+.5f,15,C(0x5affb0),40);meshBox(x+.25f,y+.25f,0,.5f,.5f,4,C(0x5a6a58),1);meshBox(x+.32f,y+.32f,4,.36f,.36f,9,C(0x6e7e6c),1);meshBox(x+.34f,y+.34f,13,.32f,.32f,3,C(0x3affa0),1.3f);break;
  case D_SEAWEED:meshBox(x+.4f,y+.4f,0,.08f,.08f,10,C(0x2a8a5a),1);break;
  }}

static void bldMesh(Bld*b){float x=b->x,y=b->y,w=b->w,h=b->h,ht=b->ht;int i,j;
  u32 wl=b->wall,rf=b->roof;
  meshBox(x+.05f,y+.05f,0,w-.1f,h-.1f,ht,wl,1);
  /* finestre e porta sul lato verso la strada (+y) e sul fianco (+x) */
  for(i=1;i<w-1;i+=2){if(b->st==BS_LH)break;if(fabsf(x+i+.5f-(b->dx+.5f))<1.1f)continue;meshBox(x+i+.2f,y+h-.04f,ht*.45f,.5f,.04f,ht*.28f,C(0x2a3a5a),1);meshBox(x+i+.16f,y+h-.03f,ht*.45f-1,.58f,.04f,1,C(0x6a5a4a),1);}
  for(j=1;j<h-1;j+=2){if(b->st==BS_LH)break;meshBox(x+w-.04f,y+j+.2f,ht*.45f,.04f,.5f,ht*.28f,C(0x2a3a5a),1);}
  if(b->dx>=x&&b->dx<x+w){meshBox(b->dx+.18f,y+h-.04f,0,.64f,.06f,ht<30?ht*.6f:16,C(0x5a3a22),1);meshBox(b->dx+.56f,y+h,7,.06f,.03f,1.5f,C(0xd4af37),1);}
  switch(b->st){
  case BS_CASTLE:{for(i=0;i<w;i++){if(i%2==0){meshBox(x+i+.05f,y+.05f,ht,.9f,.5f,6,wl,1);meshBox(x+i+.05f,y+h-.55f,ht,.9f,.5f,6,wl,1);}}
    for(j=0;j<h;j++)if(j%2==0){meshBox(x+.05f,y+j+.05f,ht,.5f,.9f,6,wl,1);meshBox(x+w-.55f,y+j+.05f,ht,.5f,.9f,6,wl,1);}
    float tw=2;float tx[2]={x-.3f,x+w-tw+.3f};for(i=0;i<2;i++){meshBox(tx[i],y+h-tw+.3f,0,tw,tw,ht+18,wl,1.05f);meshBox(tx[i]-.1f,y+h-tw+.2f,ht+18,tw+.2f,tw+.2f,3,shade(wl,.9f),1);
      meshBox(tx[i]+.2f,y+h-tw+.5f,ht+21,tw-.4f,tw-.4f,6,rf,1);meshBox(tx[i]+.5f,y+h-tw+.8f,ht+27,tw-1,tw-1,6,rf,1);meshBox(tx[i]+.85f,y+h-tw+1.15f,ht+33,.3f,.3f,10,C(0x5a4a3a),1);meshBox(tx[i]+1.15f,y+h-tw+1.15f,ht+38,.6f,.04f,4,C(0xc83a3a),1);}
    meshBox(x+1,y+1,ht,w-2,h-2,.5f,shade(wl,.85f),1);}break;
  case BS_TEMPLE:meshBox(x-.1f,y-.1f,ht,w+.2f,h+.2f,3,shade(wl,1.05f),1);{float s;int k=0;for(s=0;s<4;s++){float in=s*Min(w,h)/8.f;meshBox(x+in,y+in,ht+3+s*4,w-2*in,h-2*in,4,rf,1-.04f*s);k++;}}
    for(i=0;i<w;i+=2)meshBox(x+i+.3f,y+h+.1f,0,.4f,.4f,ht,C(0xf8f4ec),1);break;
  case BS_LH:addLight(x+w/2,y+h/2,ht+8,C(0xffe08a),90);for(i=0;i<5;i++)meshBox(x+.2f,y+.2f,ht*i/5.f,w-.4f,h-.4f,ht/10.f,C(0xc83a3a),1.01f);meshBox(x-.1f,y-.1f,ht,w+.2f,h+.2f,3,C(0x3a3a3a),1);meshBox(x+.5f,y+.5f,ht+3,w-1,h-1,10,C(0xffe08a),1.3f);meshBox(x+.3f,y+.3f,ht+13,w-.6f,h-.6f,4,C(0xc83a3a),1);break;
  case BS_ARENA:for(i=0;i<w;i++)meshBox(x+i+.1f,y+h-.08f,4,.2f,.08f,ht-6,C(0xc8b890),1);meshBox(x-.1f,y-.1f,ht,w+.2f,h+.2f,3,shade(wl,.9f),1);for(i=0;i<w;i+=2)meshBox(x+i+.4f,y+.4f,ht+3,.2f,.2f,12,C(0x6a4a2a),1),meshBox(x+i+.6f,y+.42f,ht+11,.6f,.04f,4,i%4?C(0x2a5aa8):C(0xc83a3a),1);break;
  default:{float s;for(s=0;s<4;s++){float in=s*Min(w,h)/8.f-.15f*(s==0);meshBox(x+in,y+in,ht+s*4,w-2*in,h-2*in,4,rf,1-.05f*s);}}}
}
static u32 floorCol(int x,int y){u8 m=M[y][x];float h=hh(x,y);int ck=(x+y)&1;
  if(m==T_ROAD||(m==T_DEC&&RD[y][x]))return shade(ck?pal.road1:pal.road2,.95f+h*.1f);
  if(m==T_CARPET)return shade(C(0xa8303a),.95f+h*.08f);
  return shade(ck?pal.a:pal.b,.94f+h*.12f);}
void buildMesh(void){int x,y;meshBegin();
  for(y=0;y<N;y++)for(x=0;x<N;x++){u8 m=M[y][x];float h=hh(x,y);
    if(m==T_VOID)continue;
    if(m==T_WATER||m==T_LAVA){u32 c=m==T_LAVA?C(0xff6a1a):pal.pool?pal.pool:C(0x3b86d6);meshBox(x,y,-9,1,1,6,shade(c,.9f+((x*7+y*3)%5)*.03f),1);continue;}
    int edge=0;if(x==N-1||y==N-1||M[y+1][x]==T_WATER||M[y][x+1]==T_WATER||M[y+1][x]==T_VOID||M[y][x+1]==T_VOID||M[y+1][x]==T_LAVA||M[y][x+1]==T_LAVA)edge=1;
    u32 fc=floorCol(x,y);
    if(m==T_DEC&&DEC[y][x]==D_STALL&&pal.th==0&&(Zk==Z_TOWN||Zk==Z_THAL))fc=floorCol(x,y);
    if(m==T_WALL&&pal.th>=99&&pal.th<120&&pal.th!=99){/* muri di dungeon */
      int hz=30,near=0,a2,b2;for(b2=-1;b2<=1;b2++)for(a2=-1;a2<=1;a2++){int u=x+a2,v=y+b2;if(u>=0&&v>=0&&u<N&&v<N&&walk(u,v))near=1;}
      if(!near){meshFlat(x,y,hz,1,1,shade(pal.wall,.7f));continue;}
      meshBox(x,y,0,1,1,hz,shade(pal.wall,.95f+h*.1f),1);meshFlat(x,y,hz+.05f,1,1,shade(pal.wall,1.3f));
      if(DEC[y][x]==D_TORCH){meshBox(x+.42f,y+.98f,12,.16f,.12f,6,C(0x5a3a22),1);meshBox(x+.44f,y+1,18,.12f,.08f,3,C(0xffb04a),1.4f);addLight(x+.5f,y+1.1f,20,C(0xffa040),80);}continue;}
    if(m==T_WALL&&pal.th==99){meshBox(x,y,0,1,1,28,shade(pal.wall,.95f+h*.08f),1);continue;}
    if(edge)meshBox(x,y,-6,1,1,6,fc,1);else meshFlat(x,y,0,1,1,fc);
    if(m==T_ROAD&&DEC[y][x]==D_PIER){meshBox(x,y,-1,1,1,1,shade(C(0x8a6a42),.9f+((x+y)&1)*.1f),1);meshBox(x,y+.48f,0,1,.04f,.05f,C(0x5a3a22),1);continue;}
    if(DEC[y][x]==D_SAND){meshBox(x,y,0,1,1,.35f,shade((x+y)&1?C(0xecdcae):C(0xe6d4a2),.96f+h*.08f),1);continue;}
    if(DEC[y][x]==D_MOSAIC){int r=(int)fmaxf(fabsf(x+.5f-22),fabsf(y+.5f-23));if(r%4==1)meshBox(x+.12f,y+.12f,0,.76f,.76f,.12f,(x+y)&1?C(0x3a9ac0):C(0x5ab4d4),1);else if(r%4==3&&((x+y)&1))meshBox(x+.3f,y+.3f,0,.4f,.4f,.12f,C(0xe0b858),1);continue;}
    if(DEC[y][x]==D_RUIN&&m!=T_DEC){meshBox(x+.02f,y+.02f,0,.96f,.96f,.6f,(x+y)%2?C(0x9aa494):C(0x8e9888),1);continue;}
    if(m==T_WALL){/* bordo di città o natura delle zone aperte */
      if(pal.th==Z_FOREST){if(h<.65f)mTree(x,y,h);else mPine(x,y,h,0);}
      else if(pal.th==Z_DESERT){if(h<.45f)meshBox(x+.38f,y+.38f,0,.24f,.24f,22,C(0x4e9a47),1),meshBox(x+.16f,y+.42f,8,.22f,.16f,4,C(0x4e9a47),1),meshBox(x+.16f,y+.42f,12,.12f,.16f,8,C(0x4e9a47),1);else mRock(x,y,h,C(0xb89a6a));}
      else if(pal.th==Z_PEAKS){if(h<.55f)mPine(x,y,h,1);else{mRock(x,y,h,C(0x9aa4b0));meshBox(x+.2f,y+.2f,6+h*7+2.4f,.56f,.5f,1.5f,C(0xffffff),1);}}
      else if(pal.th==Z_JUNGLE){meshBox(x,y,0,1,1,14+h*6,shade(C(0x2f5a2a),.9f+h*.2f),1);meshBox(x+.1f,y+.1f,14+h*6,.8f,.8f,3,C(0x3a7a32),1);}
      else{float hz=Zk==Z_ARENA?30:18;meshBox(x,y,0,1,1,hz,shade(pal.wall,.95f+h*.1f),1);if(Zk!=Z_ARENA&&(x+y)%2==0)meshBox(x+.1f,y+.1f,hz,.8f,.8f,4,shade(pal.wall,1.05f),1);}
      continue;}
    if(DEC[y][x]&&DEC[y][x]!=255)decMesh(x,y,DEC[y][x],h);}
  int i;for(i=0;i<nbl;i++)bldMesh(&BL[i]);
  meshEnd();}

/* minimappa */
static u32 MPX[64*64];
static void buildMini(void){int x,y;for(y=0;y<64;y++)for(x=0;x<64;x++){u32 c=0;if(x<N&&y<N){u8 m=M[y][x];
    c=m==T_VOID?0:m==T_WATER?C(0x3b86d6):m==T_LAVA?C(0xff6a1a):m==T_WALL?shade(pal.wall,.8f):m==T_BUILD?C(0xa0705a):m==T_ROAD?pal.road1:m==T_DEC?shade(pal.a,.7f):pal.a;
    if(c)c=(c&0xffffff)|0xd0000000;}MPX[y*64+x]=c;}
  miniTex(MPX,N);}

/* ================= caricamento ================= */
static void placeFrom(int from,int fdata){int i;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k!=E_PORTAL)continue;
    if(e->tag==from&&(from!=Z_DUNG||(e->data>>4)==(fdata>>4))){float x=e->x,y=e->y;int k;static const int dx[8]={0,0,1,-1,1,-1,1,-1},dy[8]={1,-1,0,0,1,1,-1,-1};
      for(k=0;k<8;k++){int u=(int)x+dx[k],v=(int)y+dy[k];if(walk(u,v)){int busy=0,j;for(j=0;j<nents;j++)if(ents[j].k==E_PORTAL&&(int)ents[j].x==u&&(int)ents[j].y==v)busy=1;if(busy)continue;
        if(e->sub==1&&dy[k]!=1)continue;P.x=u+.5f;P.y=v+.5f;return;}}}}}
float spawnT=0;
void dlog(const char*f,...);
void zoneLoad(int z,int dung,int fl,int from){int fd=Zdung*16+Zfloor;entsClear();if(z!=Z_ARENA)arenaWave=0;nbl=0;memset(&pal,0,sizeof pal);
  Zk=z;Zdung=dung;Zfloor=fl;zoneLv=ZDEF[z].lv;
  switch(z){case Z_TOWN:srand(1234);genTown();P.x=24;P.y=30;srand(sceKernelGetSystemTimeLow());break;
  case Z_FOREST:case Z_DESERT:case Z_PEAKS:genWild(z);break;
  case Z_PORTO:genPorto();break;case Z_THAL:srand(4321);genThal();srand(sceKernelGetSystemTimeLow());break;case Z_JUNGLE:genJungle();break;case Z_ARENA:genArena();break;
  case Z_IN_CASTLE:genInterior(L_CASTLE,C(0x8a8a94),C(0x80808a),C(0x9a9aa6),Z_TOWN);npc("re",7,2,0);npc("guardia",4,2,0);npc("guardia",11,2,0);npc("ciambellano",12,11,0);npc("saggio",3,9,0);break;
  case Z_IN_TAVERN:genInterior(L_TAVERN,C(0x8a6a42),C(0x82643e),C(0xd8c8a8),Z_TOWN);npc("gilda",7,3,0);npc("lino",11,9,0);npc("avventore",4,5,0);npc("vera",9,7,0);break;
  case Z_IN_SMITH:genInterior(L_SMITH,C(0x6a6a6a),C(0x646464),C(0xa89a8a),Z_TOWN);npc("borin",5,3,0);break;
  case Z_IN_ALCH:genInterior(L_ALCH,C(0x6a7a5a),C(0x647456),C(0xc8d8b0),Z_TOWN);npc("mira",5,4,0);break;
  case Z_IN_TEMPLE:genInterior(L_TEMPLE,C(0xd8d4c8),C(0xccc8bc),C(0xf0ece0),Z_TOWN);npc("lia",7,3,0);break;
  case Z_IN_HOUSE:genInterior(L_HOUSE,C(0x9a7a52),C(0x92744e),C(0xe0d0b0),Z_TOWN);npc("rosa",5,3,0);{int k=questIdx("t1");if(!P.qdone[k])npc("gatto",3,6,0);}break;
  case Z_IN_PAL48:genInterior(L_PAL48,C(0xe8e0d0),C(0xddd4c4),C(0xf4f0e8),Z_THAL);npc("oreste",6,4,0);npc("guardia48",4,9,0);npc("guardia48",13,9,0);if(P.ol>=4)npc("nerea",8,3,0);break;
  case Z_IN_SIR48:genInterior(L_SIR48,C(0x8a6a42),C(0x82643e),C(0xd8c8a8),Z_THAL);npc("gaia",7,3,0);npc("glauco",4,5,0);break;
  case Z_DUNG:genDungeon(dung,fl);break;}
  if(z!=Z_DUNG)zoneLv=ZDEF[z].lv;
  if(ZDEF[z].inside){int i;for(i=0;i<nents;i++)if(ents[i].k==E_PORTAL){P.x=ents[i].x;P.y=ents[i].y-1;break;}}
  if(from>=0&&z!=Z_DUNG)placeFrom(from,fd);
  else if(z==Z_DUNG&&fl==1&&from!=Z_DUNG){}
  if(Zk==Z_TOWN&&from==Z_DUNG)placeFrom(Z_DUNG,fd);
  buildMesh();buildMini();camX=P.x;camY=P.y;spawnT=0;musicZone(z);
#ifndef AUTOTEST
  {static int nz=0;if(nz++<40)dlog("zona %d caricata (dungeon %d piano %d), memoria libera %d KB",z,dung,fl,(int)(sceKernelMaxFreeMemSize()/1024));}
#endif
#ifndef AUTOTEST
  if(state==S_PLAY&&(z==Z_TOWN||z==Z_THAL))saveGame();
#endif
}
void zoneName(char*o){if(Zk==Z_DUNG)sprintf(o,"%s · piano %d",DDEF[Zdung].n,Zfloor);else strcpy(o,ZDEF[Zk].n);}
