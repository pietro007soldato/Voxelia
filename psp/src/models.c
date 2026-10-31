/* Voxelia PSP — i modelli a blocchi (gli stessi del gioco), girati verso le quattro direzioni e animati */
#include "vx.h"

static void add(Model*m,float x,float y,float z,float w,float d,float h,u32 c){if(m->n>=24)return;Bx*b=&m->b[m->n++];b->x=x;b->y=y;b->z=z;b->w=w;b->d=d;b->h=h;b->c=c;}
/* i modelli del gioco guardano verso +y: qui li giro in modo che guardino verso +x */
static void swapXY(Model*m,int from){int i;for(i=from;i<m->n;i++){Bx*b=&m->b[i];float t=b->x;b->x=b->y;b->y=t;t=b->w;b->w=b->d;b->d=t;}}
static void scale(Model*m,float s){int i;for(i=0;i<m->n;i++){Bx*b=&m->b[i];b->x*=s;b->y*=s;b->z*=s;b->w*=s;b->d*=s;b->h*=s;}m->s=s;}

void mHum(Model*m,u32 c,u32 k,float s,int hatH,u32 hat){m->n=0;m->kind=MK_HUM;
  add(m,-.2,-.1,0,.15,.2,9,C(0x333344));add(m,.05,-.1,0,.15,.2,9,C(0x333344));
  add(m,-.22,-.14,9,.44,.28,12,c);add(m,-.34,-.08,10,.12,.16,10,k);add(m,.22,-.08,10,.12,.16,10,k);add(m,-.15,-.12,21,.3,.24,10,k);
  add(m,-.09,.11,26,.05,.03,2.5,C(0x111111));add(m,.04,.11,26,.05,.03,2.5,C(0x111111));
  if(hatH)add(m,-.17,-.14,31,.34,.28,hatH,hat);
  swapXY(m,0);scale(m,s);}
void mBeast(Model*m,u32 c,float s,u32 k){m->n=0;m->kind=MK_BEAST;
  add(m,-.3,-.15,5,.6,.3,8,c);add(m,.2,-.12,9,.22,.24,8,c);add(m,-.28,-.14,0,.1,.1,5,k);add(m,-.28,.04,0,.1,.1,5,k);add(m,.2,-.14,0,.1,.1,5,k);add(m,.2,.04,0,.1,.1,5,k);
  add(m,-.42,-.03,9,.14,.06,7,c);add(m,.4,-.06,13,.04,.04,3,C(0x111111));add(m,.4,.04,13,.04,.04,3,C(0x111111));scale(m,s);}
void mBlob(Model*m,u32 c,float s){m->n=0;m->kind=MK_BLOB;add(m,-.3,-.3,0,.6,.6,12,c);add(m,-.22,-.22,12,.44,.44,4,c);add(m,-.2,.3,7,.1,.05,4,C(0x111111));add(m,.1,.3,7,.1,.05,4,C(0x111111));swapXY(m,0);scale(m,s);}
void mBat(Model*m,u32 c,float s){m->n=0;m->kind=MK_BAT;add(m,-.1,-.1,16,.2,.2,7,c);add(m,-.42,-.04,19,.32,.08,2,c);add(m,.1,-.04,19,.32,.08,2,c);add(m,-.06,.1,20,.04,.02,2,C(0xff3333));add(m,.03,.1,20,.04,.02,2,C(0xff3333));swapXY(m,0);scale(m,s);}
void mSpider(Model*m,u32 c,float s){int i;m->n=0;m->kind=MK_SPIDER;add(m,-.25,-.2,5,.5,.4,8,c);add(m,.18,-.12,6,.2,.24,6,c);add(m,.36,-.08,9,.04,.04,2,C(0xff2222));add(m,.36,.04,9,.04,.04,2,C(0xff2222));
  for(i=0;i<4;i++){float x=-.2+i*.13;add(m,x,-.38,0,.05,.2,7,c);add(m,x,.18,0,.05,.2,7,c);}scale(m,s);}
void mElem(Model*m,u32 c,float s){m->n=0;m->kind=MK_ELEM;add(m,-.18,-.18,10,.36,.36,14,c);add(m,-.36,-.08,16,.14,.14,8,c);add(m,.22,-.08,16,.14,.14,8,c);add(m,-.12,-.12,26,.24,.24,9,c);add(m,-.06,.12,29,.04,.02,3,C(0xffffff));add(m,.04,.12,29,.04,.02,3,C(0xffffff));swapXY(m,0);scale(m,s);}
void mCrab(Model*m,u32 c,float s){m->n=0;m->kind=MK_CRAB;add(m,-.3,-.25,3,.6,.5,7,c);add(m,-.48,.15,4,.18,.16,6,c);add(m,.3,.15,4,.18,.16,6,c);add(m,-.1,.22,9,.05,.05,4,C(0x111111));add(m,.05,.22,9,.05,.05,4,C(0x111111));add(m,-.32,-.3,0,.06,.6,3,c);add(m,.26,-.3,0,.06,.6,3,c);swapXY(m,0);scale(m,s);}
void mDrake(Model*m,u32 c,u32 w,float s){m->n=0;m->kind=MK_DRAKE;add(m,-.4,-.2,8,.8,.4,12,c);add(m,.38,-.14,16,.3,.28,10,c);add(m,.62,-.1,16,.14,.2,6,c);add(m,-.7,-.06,10,.32,.12,6,c);add(m,-.3,-.7,18,.5,.5,2,w);add(m,-.3,.2,18,.5,.5,2,w);
  add(m,-.34,-.18,0,.12,.12,8,C(0x333333));add(m,-.34,.06,0,.12,.12,8,C(0x333333));add(m,.2,-.18,0,.12,.12,8,C(0x333333));add(m,.2,.06,0,.12,.12,8,C(0x333333));add(m,.46,-.12,26,.05,.05,6,C(0xeeeeee));add(m,.46,.06,26,.05,.05,6,C(0xeeeeee));scale(m,s);}
void mKraken(Model*m,u32 c,float s){int i;m->n=0;m->kind=MK_KRAKEN;add(m,-.35,-.35,6,.7,.7,16,c);add(m,-.25,-.25,22,.5,.5,8,c);add(m,-.1,.36,16,.08,.02,5,C(0xffff00));add(m,.06,.36,16,.08,.02,5,C(0xffff00));
  for(i=0;i<6;i++){float a=i/6.0f*6.28f;add(m,cosf(a)*.5f-.05f,sinf(a)*.5f-.05f,0,.1,.1,10,c);}swapXY(m,0);scale(m,s);}
void mSphinx(Model*m,float s){mBeast(m,C(0xd4b25a),1,C(0xb8963a));m->n=7;m->kind=MK_SPHINX;add(m,.22,-.12,14,.2,.24,10,C(0xe0c080));add(m,.2,-.16,22,.24,.32,6,C(0x2a5fd0));add(m,.42,-.06,18,.03,.04,2,C(0x111111));add(m,.42,.04,18,.03,.04,2,C(0x111111));scale(m,s);}
void mSerpent(Model*m,u32 c,float s){int i;m->n=0;m->kind=MK_SERP;for(i=0;i<6;i++){float x=-.5f+i*.17f;add(m,x,-.08f+sinf(i*1.3f)*.12f,0,.18,.16,5+i*.6f,i%2?c:shade(c,1.15f));}
  add(m,.48,-.1,4,.22,.2,7,c);add(m,.66,-.08,8,.03,.04,2,C(0xffe84a));add(m,.66,.04,8,.03,.04,2,C(0xffe84a));scale(m,s);}

/* disegno: rotazione a passi di 90° (i blocchi restano allineati) e animazione semplice */
void drawModel(const Model*m,float px,float py,float pz,int dir,float wt,float atk,int white,int alpha){
  int i;float sw=sinf(wt),bob=fabsf(sinf(wt))*1.2f;
  for(i=0;i<m->n;i++){const Bx*b=&m->b[i];float x=b->x,y=b->y,z=b->z,w=b->w,d=b->d,h=b->h;float s=m->s>0?m->s:1;
    switch(m->kind){
    case MK_HUM:
      if(i==0){x+=sw*.12f*s;z+=(sw>0?sw:0)*1.5f*s;}else if(i==1){x-=sw*.12f*s;z+=(sw<0?-sw:0)*1.5f*s;}
      else if(i==3){x-=sw*.08f*s;if(atk>0){x+=atk*.28f*s;z+=atk*5*s;}}else if(i==4)x+=sw*.08f*s;
      if(i>=2)z+=bob*.6f;break;
    case MK_BEAST:case MK_SPHINX:if(i>=2&&i<=5){float q=(i==2||i==5)?sw:-sw;x+=q*.08f*s;}if(i<2||i>5)z+=bob*.5f;if(i==1&&atk>0)x+=atk*.15f*s;break;
    case MK_SPIDER:if(i>=4)x+=((i&1)?sw:-sw)*.05f*s;break;
    case MK_BAT:z+=sinf(wt*2)*3;if(i==1||i==2)z+=sinf(wt*4)*2;break;
    case MK_BLOB:{float q=1+sinf(wt*1.5f)*.08f;h*=q;}break;
    case MK_ELEM:case MK_KRAKEN:z+=sinf(wt*.8f)*2;break;
    case MK_DRAKE:if(i==4||i==5)z+=sinf(wt*1.5f)*4;break;
    case MK_SERP:if(i<6)y+=sinf(wt*1.4f+i)*.06f*s;break;}
    float rx,ry,rw,rd;
    switch(dir&3){case 0:rx=x;ry=y;rw=w;rd=d;break;case 1:rx=-(y+d);ry=x;rw=d;rd=w;break;case 2:rx=-(x+w);ry=-(y+d);rw=w;rd=d;break;default:rx=y;ry=-(x+w);rw=d;rd=w;break;}
    u32 c=white?C(0xffffff):b->c;
    if(alpha<255)boxA(px+rx,py+ry,pz+z,rw,rd,h,c,alpha);else box(px+rx,py+ry,pz+z,rw,rd,h,c);}
}
