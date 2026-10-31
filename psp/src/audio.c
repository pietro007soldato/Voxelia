/* Voxelia PSP — suoni sintetizzati e musichette per zona (niente file audio) */
#include "vx.h"
#include <pspaudio.h>

#define SR 44100
#define NS 1024
static short __attribute__((aligned(64))) BUF[2][NS*2];
typedef struct{float f0,f1,t,d,vol,ph;int w;} Voice;
static Voice V[8];
static volatile int mZone=-1;
static float mPh[3],mT=0;static int mStep=0;
static unsigned int nz=12345;
static float noise(void){nz=nz*1103515245+12345;return ((nz>>16)&0x7fff)/16384.f-1;}
static float SIN[256];
static float wave(int w,float ph){ph-=(int)ph;switch(w){case 0:return ph<.5f?1:-1;case 1:return ph<.5f?4*ph-1:3-4*ph;case 2:return noise();default:return SIN[(int)(ph*256)&255];}}
void sfx(int id){static const float D[][6]={/*f0,f1,durata,vol,onda*/
  {220,90,.09f,.35f,0},{520,260,.08f,.18f,2},{880,1320,.12f,.25f,1},{180,70,.2f,.4f,0},{440,880,.5f,.3f,1},{200,120,.15f,.25f,2},{660,990,.25f,.25f,3},{300,60,.35f,.35f,2},{1000,1000,.03f,.12f,1},{330,660,.3f,.3f,1},{110,40,.8f,.45f,0}};
  int i,b=0;for(i=0;i<6;i++)if(V[i].t>=V[i].d){b=i;break;}Voice*v=&V[b];v->f0=D[id][0];v->f1=D[id][1];v->d=D[id][2];v->vol=D[id][3];v->w=(int)D[id][4];v->t=0;v->ph=0;}
void musicZone(int z){mZone=z;}
/* le musiche: accordi e una melodia pentatonica che cambia con la zona */
static const int SCALE[5]={0,2,4,7,9};
static float note(int n){return 220.f*powf(2.f,n/12.f);}
static float fB,fC,fM;static int curStep=-1,melOn=0;
static void music(float*l,float*r){if(mZone<0){*l=*r=0;return;}
  float bpm=mZone==Z_DUNG?84:mZone==Z_TOWN||mZone==Z_THAL?104:mZone==Z_ARENA?132:96;float step=60.f/bpm/2;
  mT+=1.f/SR;if(mT>=step){mT-=step;mStep++;}
  if(mStep!=curStep){curStep=mStep;int base=mZone==Z_DUNG?-5:mZone==Z_DESERT?2:mZone==Z_PEAKS?-3:mZone==Z_THAL?5:mZone==Z_JUNGLE?0:mZone>=Z_IN_CASTLE&&mZone<Z_DUNG?3:0;
    static const int PROG[4][3]={{0,4,7},{-3,0,4},{-7,-3,0},{-5,-1,2}};int bar=(mStep/8)%4,s=mStep%8;const int*ch=PROG[bar];
    unsigned h=(mStep*2654435761u)^(mZone*97);int mel=SCALE[(h>>3)%5]+((h>>7)&1)*12;fB=note(base+ch[0]-12);fC=note(base+ch[(s/2)%3]);fM=note(base+mel);melOn=((h>>11)&3)!=0;}
  float env=1-mT/step;mPh[0]+=fB/SR;mPh[1]+=fC/SR;mPh[2]+=fM/SR;if(mPh[0]>1)mPh[0]-=1;if(mPh[1]>1)mPh[1]-=1;if(mPh[2]>1)mPh[2]-=1;
  float b=wave(1,mPh[0])*.10f,c=wave(3,mPh[1])*.05f*env,m=melOn?wave(0,mPh[2])*.035f*env*env:0;
  *l=b+c+m*.8f;*r=b+c*.8f+m;}
static int audioThread(SceSize a,void*p){int ch=sceAudioChReserve(PSP_AUDIO_NEXT_CHANNEL,NS,PSP_AUDIO_FORMAT_STEREO);int k=0;
  while(1){short*o=BUF[k];int i,j;for(i=0;i<NS;i++){float l,r;music(&l,&r);for(j=0;j<6;j++){Voice*v=&V[j];if(v->t>=v->d)continue;float q=v->t/v->d,f=v->f0+(v->f1-v->f0)*q;v->ph+=f/SR;if(v->ph>1)v->ph-=1;float s=wave(v->w,v->ph)*v->vol*(1-q);l+=s;r+=s;v->t+=1.f/SR;}
      if(l>1)l=1;if(l<-1)l=-1;if(r>1)r=1;if(r<-1)r=-1;o[i*2]=(short)(l*20000);o[i*2+1]=(short)(r*20000);}
    sceAudioOutputPannedBlocking(ch,PSP_AUDIO_VOLUME_MAX,PSP_AUDIO_VOLUME_MAX,o);k^=1;}
  return 0;}
void audioInit(void){int i;for(i=0;i<256;i++)SIN[i]=sinf(i*6.2832f/256);for(i=0;i<8;i++){V[i].t=1;V[i].d=0;}int t=sceKernelCreateThread("audio",audioThread,0x12,0x10000,PSP_THREAD_ATTR_USER,0);if(t>=0)sceKernelStartThread(t,0,0);}
