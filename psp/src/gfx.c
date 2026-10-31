/* Voxelia PSP — grafica: blocchi isometrici con il GU, mesh statica della zona, testo e interfaccia */
#include "vx.h"
#include "font.h"

static unsigned int __attribute__((aligned(64))) LIST[256*1024];
#define FBW 512
static void*fbp0,*fbp1,*zbp;
float camX=10,camY=10,ZOOM=0.72f;
int vstat=0,vstatLast=0;
int frameNo=0;

u32 shade(u32 c,float f){int r=c&0xff,g=(c>>8)&0xff,b=(c>>16)&0xff,a=c>>24;r=(int)(r*f);g=(int)(g*f);b=(int)(b*f);if(r>255)r=255;if(g>255)g=255;if(b>255)b=255;if(r<0)r=0;if(g<0)g=0;if(b<0)b=0;return((u32)a<<24)|(b<<16)|(g<<8)|r;}
u32 mix(u32 a,u32 b,float t){int i;u32 o=0;for(i=0;i<32;i+=8){int x=(a>>i)&0xff,y=(b>>i)&0xff;int v=(int)(x+(y-x)*t);if(v<0)v=0;if(v>255)v=255;o|=(u32)v<<i;}return o;}

/* ---------- memoria video ---------- */
static void*vram(int w,int h,int psm){int sz=w*h*(psm==GU_PSM_4444||psm==GU_PSM_5650||psm==GU_PSM_5551?2:4);static unsigned int off=0;void*r=(void*)off;off+=sz;return r;}

static u32 __attribute__((aligned(16))) FONTT[256*128];
static u32 __attribute__((aligned(16))) MINIT[64*64];
static int miniN=0;
static u32 __attribute__((aligned(16))) GLOWT[64*64];
static u32 __attribute__((aligned(16))) DARKT[64*64];

void gfxInit(void){
  int i;for(i=0;i<256*128;i++)FONTT[i]=((u32)FONTA[i]<<24)|0xffffff;
  {int x,y;for(y=0;y<64;y++)for(x=0;x<64;x++){float d=sqrtf((x-31.5f)*(x-31.5f)+(y-31.5f)*(y-31.5f))/31.5f;float a=d>=1?0:(1-d)*(1-d);GLOWT[y*64+x]=((u32)(a*255)<<24)|0xffffff;float b=d>=1?1:powf(d,1.6f);DARKT[y*64+x]=((u32)(b*255)<<24);}}
  sceKernelDcacheWritebackAll();
  fbp0=vram(FBW,SCR_H,GU_PSM_8888);fbp1=vram(FBW,SCR_H,GU_PSM_8888);zbp=vram(FBW,SCR_H,GU_PSM_4444);
  sceGuInit();sceGuStart(GU_DIRECT,LIST);
  sceGuDrawBuffer(GU_PSM_8888,fbp0,FBW);sceGuDispBuffer(SCR_W,SCR_H,fbp1,FBW);sceGuDepthBuffer(zbp,FBW);
  sceGuOffset(2048-SCR_W/2,2048-SCR_H/2);sceGuViewport(2048,2048,SCR_W,SCR_H);
  sceGuDepthRange(65535,0);sceGuScissor(0,0,SCR_W,SCR_H);sceGuEnable(GU_SCISSOR_TEST);
  sceGuDepthFunc(GU_GEQUAL);sceGuEnable(GU_DEPTH_TEST);sceGuDisable(GU_CULL_FACE);
  sceGuShadeModel(GU_FLAT);sceGuEnable(GU_CLIP_PLANES);
  sceGuBlendFunc(GU_ADD,GU_SRC_ALPHA,GU_ONE_MINUS_SRC_ALPHA,0,0);
  sceGuFinish();sceGuSync(0,0);sceDisplayWaitVblankStart();sceGuDisplay(GU_TRUE);
}

/* ---------- proiezione isometrica (2:1) ---------- */
static ScePspFMatrix4 PROJ;
#define RZ 80.0f
static void setProj(void){
  float K=ZOOM,cx=(camX-camY)*32*K,cy=(camX+camY)*16*K,dc=camX+camY;
  memset(&PROJ,0,sizeof PROJ);
  PROJ.x.x=32*K/240;PROJ.x.y=-16*K/136;PROJ.x.z=-1/RZ;
  PROJ.y.x=-32*K/240;PROJ.y.y=-16*K/136;PROJ.y.z=-1/RZ;
  PROJ.z.x=0;PROJ.z.y=K/136;PROJ.z.z=-1/(32*RZ);
  PROJ.w.x=-cx/240;PROJ.w.y=cy/136;PROJ.w.z=dc/RZ;PROJ.w.w=1;
}
void w2s(float x,float y,float z,float*sx,float*sy){float K=ZOOM;*sx=((x-y)*32-(camX-camY)*32)*K+240;*sy=(((x+y)*16-z)-(camX+camY)*16)*K+136;}

/* ---------- blocchi dinamici (ricostruiti a ogni fotogramma) ---------- */
#define DYNMAX 60000
static V3 __attribute__((aligned(16))) DYN[DYNMAX];
static int dynN=0,dynS=0;
#define ALMAX 12000
static V3 __attribute__((aligned(16))) ALP[ALMAX];
static int alN=0;

static inline void quad(V3*v,u32 c,float ax,float ay,float az,float bx,float by,float bz,float cx,float cy,float cz,float dx,float dy,float dz){
  v[0].c=c;v[0].x=ax;v[0].y=ay;v[0].z=az;v[1].c=c;v[1].x=bx;v[1].y=by;v[1].z=bz;v[2].c=c;v[2].x=cx;v[2].y=cy;v[2].z=cz;
  v[3].c=c;v[3].x=ax;v[3].y=ay;v[3].z=az;v[4].c=c;v[4].x=cx;v[4].y=cy;v[4].z=cz;v[5].c=c;v[5].x=dx;v[5].y=dy;v[5].z=dz;}
static int boxV(V3*v,float x,float y,float z,float w,float d,float h,u32 c,float f){
  float T=z+h;int n=0;
  quad(v,shade(c,f),x,y,T,x+w,y,T,x+w,y+d,T,x,y+d,T);n=6;
  if(h>0.01f){quad(v+6,shade(c,.78f*f),x,y+d,T,x+w,y+d,T,x+w,y+d,z,x,y+d,z);quad(v+12,shade(c,.58f*f),x+w,y,T,x+w,y+d,T,x+w,y+d,z,x+w,y,z);n=18;}
  return n;}
void boxF(float x,float y,float z,float w,float d,float h,u32 c,float f){if(dynN+18>DYNMAX)return;dynN+=boxV(DYN+dynN,x,y,z,w,d,h,c,f);}
void box(float x,float y,float z,float w,float d,float h,u32 c){boxF(x,y,z,w,d,h,c,1);}
void flat(float x,float y,float z,float w,float d,u32 c){if(dynN+6>DYNMAX)return;quad(DYN+dynN,c,x,y,z,x+w,y,z,x+w,y+d,z,x,y+d,z);dynN+=6;}
void boxA(float x,float y,float z,float w,float d,float h,u32 c,int a){if(alN+18>ALMAX)return;c=(c&0xffffff)|((u32)a<<24);alN+=boxV(ALP+alN,x,y,z,w,d,h,c,1);}
void alFlushPub(void){if(!alN)return;sceKernelDcacheWritebackRange(ALP,alN*sizeof(V3));sceGumDrawArray(GU_TRIANGLES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_3D,alN,0,ALP);alN=0;}
void dynFlush(void){int n=dynN-dynS;if(n<=0)return;vstat+=n;sceKernelDcacheWritebackRange(DYN+dynS,n*sizeof(V3));
  sceGumDrawArray(GU_TRIANGLES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_3D,n,0,DYN+dynS);dynS=dynN;}
static void alFlush(void){if(!alN)return;sceKernelDcacheWritebackRange(ALP,alN*sizeof(V3));sceGuEnable(GU_BLEND);sceGuDepthMask(GU_TRUE);
  sceGumDrawArray(GU_TRIANGLES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_3D,alN,0,ALP);sceGuDepthMask(GU_FALSE);sceGuDisable(GU_BLEND);alN=0;}

/* ---------- mesh statica: blocchi 8×8 caselle ---------- */
#define CH 4
#define NCH (MAXN/CH)
typedef struct{V3*v;int n,cap;} Chunk;
static Chunk CHK[NCH][NCH];
int meshOn=0;
void meshFree(void){int i,j;for(i=0;i<NCH;i++)for(j=0;j<NCH;j++){if(CHK[i][j].v)free(CHK[i][j].v);CHK[i][j].v=0;CHK[i][j].n=CHK[i][j].cap=0;}}
void meshBegin(void){meshFree();meshOn=1;}
static V3*chkAdd(float x,float y,int n){int cx=(int)(x/CH),cy=(int)(y/CH);if(cx<0)cx=0;if(cy<0)cy=0;if(cx>=NCH)cx=NCH-1;if(cy>=NCH)cy=NCH-1;
  Chunk*c=&CHK[cy][cx];if(c->n+n>c->cap){int nc=c->cap?c->cap*2:1024;while(nc<c->n+n)nc*=2;V3*nv=(V3*)memalign(16,nc*sizeof(V3));if(!nv)return 0;if(c->v){memcpy(nv,c->v,c->n*sizeof(V3));free(c->v);}c->v=nv;c->cap=nc;}
  V3*r=c->v+c->n;c->n+=n;return r;}
void meshBox(float x,float y,float z,float w,float d,float h,u32 c,float f){V3*v=chkAdd(x+w*.5f,y+d*.5f,h>0.01f?18:6);if(v)boxV(v,x,y,z,w,d,h,c,f);}
void meshFlat(float x,float y,float z,float w,float d,u32 c){V3*v=chkAdd(x+w*.5f,y+d*.5f,6);if(v)quad(v,c,x,y,z,x+w,y,z,x+w,y+d,z,x,y+d,z);}
void meshEnd(void){meshOn=0;sceKernelDcacheWritebackAll();}
void meshDraw(void){int i,j;for(i=0;i<NCH;i++)for(j=0;j<NCH;j++){Chunk*c=&CHK[i][j];if(!c->n)continue;
    float x0=j*CH,y0=i*CH,sx1,sy1,sx2,sy2,sx3,sy3,sx4,sy4;
    w2s(x0,y0+CH,0,&sx1,&sy1);w2s(x0+CH,y0,0,&sx2,&sy2);w2s(x0,y0,120,&sx3,&sy3);w2s(x0+CH,y0+CH,-20,&sx4,&sy4);
    if(sx2<-20||sx1>SCR_W+20||sy4<-20||sy3>SCR_H+20)continue;
    vstat+=c->n;sceGumDrawArray(GU_TRIANGLES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_3D,c->n,0,c->v);}}

/* ---------- fotogramma ---------- */
static int in2D=0;
void gfxBegin(u32 clear){vstatLast=vstat;vstat=0;sceGuStart(GU_DIRECT,LIST);dynN=dynS=0;alN=0;
  sceGuDepthMask(GU_FALSE);sceGuClearColor(clear);sceGuClearDepth(0);sceGuClear(GU_COLOR_BUFFER_BIT|GU_DEPTH_BUFFER_BIT);gfx3D();}
void gfx3D(void){in2D=0;setProj();sceGumMatrixMode(GU_PROJECTION);sceGumLoadMatrix(&PROJ);sceGumMatrixMode(GU_VIEW);sceGumLoadIdentity();sceGumMatrixMode(GU_MODEL);sceGumLoadIdentity();
  sceGuEnable(GU_DEPTH_TEST);sceGuDepthMask(GU_FALSE);sceGuDisable(GU_TEXTURE_2D);sceGuDisable(GU_BLEND);}
void gfx2D(void){dynFlush();alFlush();in2D=1;sceGuDisable(GU_DEPTH_TEST);sceGuDepthMask(GU_TRUE);sceGuEnable(GU_BLEND);}
void gfxEnd(void){if(!in2D)gfx2D();sceGuFinish();sceGuSync(0,0);sceDisplayWaitVblankStart();sceGuSwapBuffers();frameNo++;}

/* ---------- 2D ---------- */
typedef struct{u32 c;float x,y,z;} V2;
void rect(float x,float y,float w,float h,u32 c){V2*v=(V2*)sceGuGetMemory(2*sizeof(V2));v[0].c=c;v[0].x=x;v[0].y=y;v[0].z=0;v[1].c=c;v[1].x=x+w;v[1].y=y+h;v[1].z=0;
  sceGuDisable(GU_TEXTURE_2D);sceGuDrawArray(GU_SPRITES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,2,0,v);}
void rectG(float x,float y,float w,float h,u32 c1,u32 c2){V2*v=(V2*)sceGuGetMemory(6*sizeof(V2));
  v[0].c=c1;v[0].x=x;v[0].y=y;v[1].c=c1;v[1].x=x+w;v[1].y=y;v[2].c=c2;v[2].x=x+w;v[2].y=y+h;v[3].c=c1;v[3].x=x;v[3].y=y;v[4].c=c2;v[4].x=x+w;v[4].y=y+h;v[5].c=c2;v[5].x=x;v[5].y=y+h;
  int i;for(i=0;i<6;i++)v[i].z=0;sceGuDisable(GU_TEXTURE_2D);sceGuShadeModel(GU_SMOOTH);sceGuDrawArray(GU_TRIANGLES,GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,6,0,v);sceGuShadeModel(GU_FLAT);}
void frame(float x,float y,float w,float h){rect(x,y,w,h,0xe0201810);rect(x,y,w,1,0xff60b8d8);rect(x,y+h-1,w,1,0xff306080);rect(x,y,1,h,0xff4890b0);rect(x+w-1,y,1,h,0xff4890b0);}
void tint(u32 c){rect(0,0,SCR_W,SCR_H,c);}

/* testo UTF-8 con il font dell'atlante */
static int glyph(unsigned cp){int i;for(i=0;i<FONT_N;i++)if(FONTG[i].c==cp)return i;return -1;}
static unsigned short GC[512];static int gcInit=0;
static int gidx(unsigned cp){if(!gcInit){int i;for(i=0;i<512;i++)GC[i]=0xffff;gcInit=1;}if(cp<512){if(GC[cp]==0xffff){int g=glyph(cp);GC[cp]=g<0?0xfffe:g;}return GC[cp]==0xfffe?-1:GC[cp];}
  if(cp==0x2019)cp='\'';if(cp==0x2026)return glyph(0x2026);return glyph(cp);}
static unsigned utf8(const char**s){const unsigned char*p=(const unsigned char*)*s;unsigned c=*p;if(c<0x80){(*s)++;return c;}
  if((c&0xe0)==0xc0){c=((c&0x1f)<<6)|(p[1]&0x3f);*s+=2;return c;}if((c&0xf0)==0xe0){c=((c&0x0f)<<12)|((p[1]&0x3f)<<6)|(p[2]&0x3f);*s+=3;return c;}
  c=((c&0x07)<<18)|((p[1]&0x3f)<<12)|((p[2]&0x3f)<<6)|(p[3]&0x3f);*s+=4;return c;}
int textW(const char*s){float w=0;while(*s){unsigned cp=utf8(&s);if(cp=='\n')break;int g=gidx(cp);w+=(g<0?6:FONTG[g].adv)*TSC;}return (int)w;}
float TSC=1;
int text(float x,float y,const char*s,u32 c){
  int n=0;const char*q=s;while(*q){utf8(&q);n++;}if(!n)return 0;
  VT*v=(VT*)sceGuGetMemory(n*2*sizeof(VT));int k=0;float x0=x;
  while(*s){unsigned cp=utf8(&s);if(cp=='\n'){x=x0;y+=FONT_LH*TSC;continue;}int g=gidx(cp);if(g<0){x+=6*TSC;continue;}
    float gx=x+FONTG[g].ox*TSC;
    v[k].u=FONTG[g].x;v[k].v=FONTG[g].y;v[k].c=c;v[k].x=(int)gx;v[k].y=(int)y;v[k].z=0;k++;
    v[k].u=FONTG[g].x+FONTG[g].w;v[k].v=FONTG[g].y+FONTG[g].h;v[k].c=c;v[k].x=(int)(gx+FONTG[g].w*TSC);v[k].y=(int)(y+FONTG[g].h*TSC);v[k].z=0;k++;
    x+=FONTG[g].adv*TSC;}
  sceGuEnable(GU_TEXTURE_2D);sceGuTexMode(GU_PSM_8888,0,0,0);sceGuTexImage(0,256,128,256,FONTT);sceGuTexFunc(GU_TFX_MODULATE,GU_TCC_RGBA);sceGuTexFilter(TSC!=1?GU_LINEAR:GU_NEAREST,TSC!=1?GU_LINEAR:GU_NEAREST);sceGuTexScale(1,1);sceGuTexOffset(0,0);
  if(k)sceGuDrawArray(GU_SPRITES,GU_TEXTURE_32BITF|GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,k,0,v);
  sceGuDisable(GU_TEXTURE_2D);return (int)(x-x0);}
int textS(float x,float y,const char*s,u32 c){text(x+1,y+1,s,0xc0000000);return text(x,y,s,c);}
void textC(float cx,float y,const char*s,u32 c){textS(cx-textW(s)/2,y,s,c);}
/* testo a capo dentro una larghezza; ritorna le righe usate */
int textBox(float x,float y,float w,const char*s,u32 c,int maxL){
  char line[200];int lines=0;const char*p=s;
  while(*p&&lines<maxL){int len=0,lastSp=-1;const char*q=p;line[0]=0;
    while(*q&&*q!='\n'){const char*q0=q;utf8(&q);int cl=q-q0;if(len+cl>=199)break;memcpy(line+len,q0,cl);line[len+cl]=0;
      if(textW(line)>w){if(lastSp>0){line[lastSp]=0;q=p+lastSp+1;}else{line[len]=0;q=q0;}break;}
      if(*q0==' ')lastSp=len;len+=cl;}
    textS(x,y+lines*FONT_LH,line,c);lines++;p=q;if(*p=='\n')p++;}
  return lines;}

/* minimappa: una texture per zona */
void miniTex(u32*px,int n){memcpy(MINIT,px,64*64*4);miniN=n;sceKernelDcacheWritebackRange(MINIT,sizeof MINIT);}
void miniDraw(float x,float y,float s){VT*v=(VT*)sceGuGetMemory(2*sizeof(VT));
  v[0].u=0;v[0].v=0;v[0].c=0xffffffff;v[0].x=x;v[0].y=y;v[0].z=0;v[1].u=miniN;v[1].v=miniN;v[1].c=0xffffffff;v[1].x=x+miniN*s;v[1].y=y+miniN*s;v[1].z=0;
  sceGuEnable(GU_TEXTURE_2D);sceGuTexMode(GU_PSM_8888,0,0,0);sceGuTexImage(0,64,64,64,MINIT);sceGuTexFunc(GU_TFX_MODULATE,GU_TCC_RGBA);sceGuTexFilter(GU_NEAREST,GU_NEAREST);
  sceGuDrawArray(GU_SPRITES,GU_TEXTURE_32BITF|GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,2,0,v);sceGuDisable(GU_TEXTURE_2D);}

/* alone luminoso (somma di luce) e buio con il buco attorno all'eroe */
static void spr(float x,float y,float w,float h,u32 c){VT*v=(VT*)sceGuGetMemory(2*sizeof(VT));v[0].u=0;v[0].v=0;v[0].c=c;v[0].x=x;v[0].y=y;v[0].z=0;v[1].u=64;v[1].v=64;v[1].c=c;v[1].x=x+w;v[1].y=y+h;v[1].z=0;
  sceGuEnable(GU_TEXTURE_2D);sceGuTexMode(GU_PSM_8888,0,0,0);sceGuTexImage(0,64,64,64,GLOWT);sceGuTexFunc(GU_TFX_MODULATE,GU_TCC_RGBA);sceGuTexFilter(GU_LINEAR,GU_LINEAR);
  sceGuDrawArray(GU_SPRITES,GU_TEXTURE_32BITF|GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,2,0,v);sceGuDisable(GU_TEXTURE_2D);}
void glow(float sx,float sy,float r,u32 c){if(sx<-r||sy<-r||sx>SCR_W+r||sy>SCR_H+r)return;sceGuBlendFunc(GU_ADD,GU_SRC_ALPHA,GU_FIX,0,0xffffffff);spr(sx-r,sy-r*.6f,2*r,1.2f*r,c);sceGuBlendFunc(GU_ADD,GU_SRC_ALPHA,GU_ONE_MINUS_SRC_ALPHA,0,0);}
/* buio: un velo nero con il "buco" morbido attorno a un punto */
void dark(float sx,float sy,float r,int a){if(a<=0)return;u32 c=((u32)a<<24);float ry=r*.7f;
  rect(0,0,SCR_W,sy-ry,c);rect(0,sy+ry,SCR_W,SCR_H,c);rect(0,sy-ry,sx-r,2*ry,c);rect(sx+r,sy-ry,SCR_W,2*ry,c);
  VT*v=(VT*)sceGuGetMemory(2*sizeof(VT));v[0].u=0;v[0].v=0;v[0].c=c;v[0].x=sx-r;v[0].y=sy-ry;v[0].z=0;v[1].u=64;v[1].v=64;v[1].c=c;v[1].x=sx+r;v[1].y=sy+ry;v[1].z=0;
  sceGuEnable(GU_TEXTURE_2D);sceGuTexMode(GU_PSM_8888,0,0,0);sceGuTexImage(0,64,64,64,DARKT);sceGuTexFunc(GU_TFX_MODULATE,GU_TCC_RGBA);sceGuTexFilter(GU_LINEAR,GU_LINEAR);
  sceGuDrawArray(GU_SPRITES,GU_TEXTURE_32BITF|GU_COLOR_8888|GU_VERTEX_32BITF|GU_TRANSFORM_2D,2,0,v);sceGuDisable(GU_TEXTURE_2D);}
