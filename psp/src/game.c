/* Voxelia PSP — il gioco: eroe, nemici, combattimento, bottino, missioni, storia */
#include "vx.h"

Ent ents[MAXE];int nents=0;
Player P;
int state=S_TITLE;
float gT=0,dt=1/60.f;
char msgLine[96];float msgT=0;
Light LIGHTS[160];int nlights=0;

float frand(void){return (rand()&0xffff)/65536.f;}
int irand(int a,int b){if(b<=a)return a;return a+rand()%(b-a+1);}
float dist2(float ax,float ay,float bx,float by){return (ax-bx)*(ax-bx)+(ay-by)*(ay-by);}

Ent*entNew(int k,float x,float y){int i;for(i=0;i<MAXE;i++)if(!ents[i].k){Ent*e=&ents[i];memset(e,0,sizeof*e);e->k=k;e->x=x;e->y=y;if(i>=nents)nents=i+1;return e;}return 0;}
void entsClear(void){memset(ents,0,sizeof ents);nents=0;nlights=0;}

static const float DF_HP[4]={.7f,1,1.5f,2.2f},DF_DM[4]={.6f,1,1.4f,2},DF_X[4]={1.25f,1,1.2f,1.5f};
Ent*enemy(const char*t,float x,float y){int id=enemyId(t);if(id<0)return 0;if(x==(int)x)x+=.5f;if(y==(int)y)y+=.5f;Ent*e=entNew(E_EN,x,y);if(!e)return 0;const EnemyDef*d=&EDEF[id];
  float lv=zoneLv;e->id=id;e->hp=e->mhp=(int)(d->hp*(1+lv*.15f)*DF_HP[P.diff]);e->at=d->at*(1+lv*.1f)*DF_DM[P.diff];e->sp=d->sp;e->r=d->r;e->cd=d->cd;e->ag=d->ag;e->boss=d->boss;
  e->xp=(int)(d->xp*(1+lv*.3f));e->hx=x;e->hy=y;e->cdt=d->cd*frand();e->dir=irand(0,3);e->anim=frand()*6;strncpy(e->name,d->n,47);return e;}

/* ---------- statistiche dell'eroe ---------- */
int xpNeed(int lv){return (int)(40*powf(lv,1.55f));}
void recalc(void){int hpb=0,i;for(i=0;i<4;i++)if(P.has[i])hpb+=P.eq[i].hp;P.mhp=90+P.lv*14+hpb;P.mmp=30+P.lv*4;if(P.hp>P.mhp)P.hp=P.mhp;if(P.mp>P.mmp)P.mp=P.mmp;}
float pAtk(void){return 6+P.lv*2.2f+(P.has[0]?itemVal(&P.eq[0]):0);}
float pDef(void){int i;float d=P.lv*.6f;for(i=1;i<4;i++)if(P.has[i])d+=itemVal(&P.eq[i]);return d;}
float pCrit(void){return 5+(P.has[0]?P.eq[0].cr:0);}
void playerInit(int diff){memset(&P,0,sizeof P);P.diff=diff;P.lv=1;P.gold=40;P.pot=3;P.mpot=1;P.skills=1;
  itemGen(&P.eq[0],1,0,0);strcpy(P.eq[0].n,"Spada di legno");P.eq[0].r=0;P.eq[0].v=6;P.eq[0].cr=0;P.has[0]=1;
  itemGen(&P.eq[2],1,0,2);strcpy(P.eq[2].n,"Tunica da viaggio");P.eq[2].r=0;P.eq[2].v=3;P.eq[2].hp=0;P.has[2]=1;
  recalc();P.hp=P.mhp;P.mp=P.mmp;P.sta=100;P.dayT=8*60;P.dir=1;}
void giveGold(int g){P.gold+=g;}
void giveXp(int x){x=(int)(x*DF_X[P.diff]);P.xp+=x;while(P.xp>=xpNeed(P.lv)){P.xp-=xpNeed(P.lv);P.lv++;recalc();P.hp=P.mhp;P.mp=P.mmp;
    char b[64];sprintf(b,"Ora sei al livello %d",P.lv);
    if(P.lv==4&&P.skills<2){P.skills=2;banner("Livello 4: Palla di fuoco","Cambi abilità con L, la usi con △");}
    else if(P.lv==7&&P.skills<3){P.skills=3;banner("Livello 7: Luce curativa","Cambi abilità con L, la usi con △");}
    else if(P.lv==10&&P.skills<4){P.skills=4;banner("Livello 10: Tempesta di lame","Cambi abilità con L, la usi con △");}
    else banner("Livello superiore!",b);
    sfx(SFX_LVL);burst(P.x,P.y,10,24,C(0xffd84a),2.5f);}}
int invAdd(const Item*it){if(P.ninv>=INV_MAX)return 0;P.inv[P.ninv++]=*it;return 1;}
void equip(int i){if(i<0||i>=P.ninv)return;Item it=P.inv[i];int s=it.s;if(P.has[s]){P.inv[i]=P.eq[s];}else{P.inv[i]=P.inv[--P.ninv];}P.eq[s]=it;P.has[s]=1;recalc();sfx(SFX_MENU);}

/* ---------- messaggi ---------- */
static char bT[64],bS[96];static float bTime=0;
void banner(const char*t,const char*s){strncpy(bT,t,63);bT[63]=0;strncpy(bS,s?s:"",95);bS[95]=0;bTime=3.2f;}
static void msg(const char*s){strncpy(msgLine,s,95);msgLine[95]=0;msgT=3;}
typedef struct{float x,y,z,t;u32 c;char s[20];} FT;static FT FTX[24];
void floatText(float x,float y,const char*s,u32 c){int i,b=0;for(i=0;i<24;i++)if(FTX[i].t<FTX[b].t)b=i;FT*f=&FTX[b];f->x=x;f->y=y;f->z=28;f->t=1;f->c=c;strncpy(f->s,s,19);f->s[19]=0;}
typedef struct{float x,y,z,vx,vy,vz,t,s;u32 c;} PT;static PT PTS[200];static int npt=0;
void burst(float x,float y,float z,int n,u32 c,float sp){int i;for(i=0;i<n;i++){PT*p=&PTS[npt];npt=(npt+1)%200;p->x=x;p->y=y;p->z=z;float a=frand()*6.28f,v=frand()*sp;p->vx=cosf(a)*v;p->vy=sinf(a)*v;p->vz=40+frand()*60;p->t=.6f+frand()*.5f;p->c=c;p->s=.06f+frand()*.06f;}}

/* ---------- dialoghi ---------- */
char dlgWho[32];char dlgTxt[8][300];int dlgN=0,dlgI=0;int dlgAct=0;
void say(const char*who,const char*txt){if(state!=S_DIALOG&&state!=S_CHOICE){dlgN=0;dlgI=0;}strncpy(dlgWho,who,31);dlgWho[31]=0;if(dlgN<8){strncpy(dlgTxt[dlgN],txt,299);dlgTxt[dlgN][299]=0;dlgN++;}state=S_DIALOG;dlgAct=0;sfx(SFX_MENU);}
void sayQ(const char*who,const char*txt,int act){say(who,txt);dlgAct=act;}
int pendingQ=-1;Ent*pendingE=0;

/* ---------- missioni ---------- */
static int qActive(int q){int i;for(i=0;i<P.nq;i++)if(P.qact[i]==q)return i;return -1;}
static void qFinish(int slot){int q=P.qact[slot];const QuestDef*d=&QDEF[q];char b[96];P.qdone[q]=1;giveGold(d->g);giveXp(d->x);
  sprintf(b,"+%d oro · +%d esperienza",d->g,d->x);banner(d->ti,b);sfx(SFX_COIN);
  P.qact[slot]=P.qact[P.nq-1];P.qn[slot]=P.qn[P.nq-1];P.nq--;}
void questEvent(int kind,const char*what,int n){int i,j;for(i=0;i<P.nq;i++){const QuestDef*d=&QDEF[P.qact[i]];
    if(kind==Q_KILL&&(d->t==Q_KILL||d->t==Q_BOSS)){for(j=0;j<4&&d->e[j];j++)if(!strcmp(d->e[j],what)){if(P.qn[i]<d->n){P.qn[i]++;if(P.qn[i]>=d->n)msg("Missione completata: torna da chi te l'ha data");}}}
    if(kind==Q_COL&&d->t==Q_COL){for(j=0;j<4&&d->e[j];j++)if(!strcmp(d->e[j],what)&&P.qn[i]<d->n&&frand()<d->ch){P.qn[i]++;char b[80];sprintf(b,"%s (%d/%d)",d->it,P.qn[i],d->n);floatText(P.x,P.y,d->it,C(0xffd84a));msg(b);}}}}
static const char*npcGiver(int q){int i,j;for(i=0;i<NNDEF;i++)for(j=0;j<8&&NDEF[i].qs[j];j++)if(!strcmp(NDEF[i].qs[j],QDEF[q].id))return NDEF[i].id;return "";}
/* parlando con un personaggio: consegne, missioni nuove, battute */
static int npcQuests(Ent*e){const NpcDef*n=&NDEF[e->id];int i,j;
  /* le missioni "parla con…" che finiscono da questo personaggio */
  for(i=0;i<P.nq;i++){const QuestDef*d=&QDEF[P.qact[i]];if(d->t==Q_TALK&&d->to&&!strcmp(d->to,n->id)){char b[200];sprintf(b,"Grazie! Ti ha mandato qualcuno? (%s)",d->ti);say(n->n,b);qFinish(i);return 1;}}
  for(j=0;j<8&&n->qs[j];j++){int q=questIdx(n->qs[j]);if(q<0)continue;int s=qActive(q);
    if(s>=0){const QuestDef*d=&QDEF[q];if(P.qn[s]>=d->n){say(n->n,"Ce l'hai fatta! Ecco la tua ricompensa.");qFinish(s);return 1;}
      char b[200];sprintf(b,"%s: %d/%d. %s",d->ti,P.qn[s],d->n,d->tx);say(n->n,b);return 1;}}
  for(j=0;j<8&&n->qs[j];j++){int q=questIdx(n->qs[j]);if(q<0||P.qdone[q])continue;const QuestDef*d=&QDEF[q];if(P.lv<d->lv)continue;if(P.nq>=8){say(n->n,"Hai già troppe missioni in corso: finiscine qualcuna e torna da me.");return 1;}
    char b[300];sprintf(b,"%s\n%s\n(ricompensa %d oro) — X accetta · O rifiuta",d->ti,d->tx,d->g);say(n->n,b);state=S_CHOICE;pendingQ=q;pendingE=e;return 1;}
  return 0;}
static int shopRole(int r){return r==R_SMITH||r==R_ALCH||r==R_SHOP||r==R_INN||r==R_HEAL||r==R_ZEFIRO||r==R_ARENA;}
void afterChoice(void){Ent*e=pendingE;pendingE=0;if(e&&e->k==E_NPC&&shopRole(NDEF[e->id].role))shopOpen(NDEF[e->id].role);}
void acceptQuest(void){if(pendingQ<0)return;P.qact[P.nq]=pendingQ;P.qn[P.nq]=0;P.nq++;banner("Nuova missione",QDEF[pendingQ].ti);pendingQ=-1;}

/* ---------- storia ---------- */
static const char*ST_INTRO="Eroe, ascoltami. Il Re Lich Malakar, mio fratello, ha infranto la Corona di Voxel: il cuore che tiene unito il regno. I sei frammenti sono finiti nei luoghi più oscuri: la Tana dei Goblin, la Cripta Dimenticata, la Piramide di Khem, le Caverne di Cristallo, la Fucina Infernale e l'Abisso Sommerso. Riportameli e la corona riforgiata aprirà la via per la sua Cittadella.";
static const char*ST_FORGE="I sei frammenti si uniscono tra le mani del Re in un lampo di luce. La Corona di Voxel è di nuovo intera, e nella sala del trono si apre un portale violaceo: la via per la Cittadella del Vuoto.";
static const char*ST_END="Con la caduta di Malakar il Vuoto si ritira. Il Re Aldric depone la corona sull'altare e ti nomina Campione di Aldoria. Ma i dungeon del regno continuano a rinascere, più oscuri a ogni ciclo: la tua leggenda è appena cominciata.";
static int shardCount(void){int i,n=0;for(i=0;i<6;i++)if(P.shards&(1<<i))n++;return n;}

void shopOpenNpc(int role);
static void talk(Ent*e){const NpcDef*n=&NDEF[e->id];e->dir=(int)((atan2f(P.y-e->y,P.x-e->x)/(PI/2)+4.5f))&3;char b[300];
  switch(n->role){
  case R_KING:
    if(P.st==0){say(n->n,ST_INTRO);P.st=1;banner("La Corona di Voxel","Trova i sei frammenti nei dungeon");return;}
    if(P.st==1&&shardCount()==6){say(n->n,ST_FORGE);P.st=2;banner("La Corona è riforgiata","Il portale per la Cittadella è nella sala del trono");zoneLoad(Z_IN_CASTLE,-1,0,-1);P.x=8;P.y=10;say(n->n,"Vai, Campione. Il portale ti aspetta.");return;}
    if(P.st==1){sprintf(b,"Hai %d frammenti su 6. Cerca nei dungeon: la Tana dei Goblin (Foresta), la Cripta (cimitero), la Piramide (Deserto), le Caverne di Cristallo e la Fucina Infernale (Picchi), l'Abisso (Porto).",shardCount());say(n->n,b);return;}
    if(P.st==2){say(n->n,"Il portale per la Cittadella del Vuoto è aperto, in fondo alla sala. Che la Luce ti accompagni.");return;}
    say(n->n,"Aldoria ti deve tutto, Campione. I dungeon rinascono: la tua leggenda continua.");return;
  case R_CAT:{int q=questIdx("t1"),s=qActive(q);if(s>=0){say("Briciola","Miao! Briciola ti segue fino a casa.");qFinish(s);e->k=0;}else say("Briciola","Miao?");}return;
  case R_CAPT:if(P.lv<10){say(n->n,"La Stella del Sud salpa per Thalassa, il regno oltre il mare. Ma è un viaggio pericoloso: torna quando sarai almeno al livello 10.");return;}
    if(P.ol==0){say(n->n,"Thalassa ha bisogno di aiuto: il Serpente di Giada si è svegliato e la Regina Nerea è scomparsa. Salpiamo! Parla con il Cancelliere Oreste, nel palazzo.");P.ol=1;}
    else say(n->n,"Salpiamo verso Thalassa!");
    pendingQ=-2;return;
  case R_TRAG:if(Zk==Z_THAL){say("Stella del Sud","Si torna ad Aldoria: il Porto vi aspetta.");pendingQ=-3;}else if(P.ol>=1){say("Stella del Sud","Si salpa per Thalassa!");pendingQ=-2;}else say("Stella del Sud","La nave della Capitana Marina. Parla con lei per salpare.");return;
  case R_ORESTE:if(P.ol<=1){say(n->n,"Straniero, il Serpente di Giada si è svegliato e ha rapito la nostra Regina nel suo tempio, nella Giungla di Smeraldo. Le porte del tempio si aprono solo con i tre Sigilli di Giada: sono nei tre santuari della giungla, protetti dai custodi. Portali al tempio.");P.ol=2;banner("I Sigilli di Giada","Trova i tre santuari nella giungla");}
    else if(P.ol==2){int c=(P.sig&1)+((P.sig>>1)&1)+((P.sig>>2)&1);sprintf(b,"Hai %d sigilli su 3. I santuari sono nella giungla, a ovest della città.",c);say(n->n,b);}
    else if(P.ol==3)say(n->n,"Il tempio è aperto. Libera la Regina dal Serpente!");
    else say(n->n,"Thalassa ti è grata, Eroe. La Regina ti aspetta.");return;
  case R_NEREA:if(P.ol==4){say(n->n,"Mi hai liberata. Il Serpente dormirà di nuovo per mille anni, e Thalassa sarà sempre la tua casa. Accetta questo dono della corona del mare.");
      Item it;itemGen(&it,P.lv+2,3,3);strcpy(it.n,"Egida di Thalassa");it.hp+=40;invAdd(&it);giveGold(800);giveXp(900);P.ol=5;banner("Eroe di Thalassa","Egida di Thalassa · +800 oro");}
    else say(n->n,"Il mare ci ha portato un amico.");return;
  default:break;}
  if(npcQuests(e))return;
  if(shopRole(n->role)){shopOpen(n->role);return;}
  if(n->role==R_SAGE){static int si=0;say(n->n,n->ln[si%3]);si++;return;}
  {int k=0;while(k<4&&n->ln[k])k++;if(k){static int li=0;say(e->name,n->ln[(li++)%k]);}else say(e->name,"...");}}

/* ---------- bottino ---------- */
static void dropItem(float x,float y,int lv,int minR){Ent*d=entNew(E_DROP,x+frand()*.6f-.3f,y+frand()*.6f-.3f);if(!d)return;d->sub=1;d->xp=lv;d->data=minR;d->vz=60;d->life=60;}
static void dropGold(float x,float y,int g){Ent*d=entNew(E_DROP,x+frand()*.6f-.3f,y+frand()*.6f-.3f);if(!d)return;d->sub=0;d->gold=g;d->vz=50;d->life=60;}
static void dropPot(float x,float y){Ent*d=entNew(E_DROP,x,y);if(!d)return;d->sub=2;d->vz=50;d->life=60;}
static void killEnemy(Ent*e){const EnemyDef*d=&EDEF[e->id];giveXp(e->xp);P.kills++;burst(e->x,e->y,12,16,C(d->c1?d->c1:0x888888),2);sfx(SFX_DIE);
  questEvent(Q_KILL,d->id,1);questEvent(Q_COL,d->id,1);
  dropGold(e->x,e->y,(int)(e->xp*.5f+irand(1,5)));if(frand()<(e->boss?1:.09f))dropItem(e->x,e->y,(int)zoneLv+1,e->boss?2:0);if(frand()<.08f)dropPot(e->x,e->y);
  if(e->boss){int di=Zk==Z_DUNG?Zdung:-1;char b[96];sprintf(b,"%s è sconfitto!",e->name);banner(b,"");sfx(SFX_BOSS);
    if(di>=0){P.done[di]++;if(di<6&&!(P.shards&(1<<di))){P.shards|=1<<di;sprintf(b,"Frammento della Corona %d/6",shardCount());banner(b,"Riportalo al Re Aldric nel castello");}
      if(!strcmp(DDEF[di].id,"cittadella")&&P.st<3){P.st=3;say("Re Aldric",ST_END);}
      if(!strcmp(DDEF[di].id,"tempio48")&&P.ol<4){P.ol=4;banner("Il Serpente dorme","La Regina Nerea è libera: torna al palazzo di Thalassa");}
      Ent*p=entNew(E_PORTAL,e->x,e->y+1.2f);if(p){p->tag=-1;p->sub=6;strcpy(p->name,"Portale verso l'uscita");}}
    if(Zk==Z_ARENA)giveGold(200);}
  e->k=0;}

/* ---------- combattimento ---------- */
static float dirAng(int d){return d*PI/2;}
float fa=0;/* direzione precisa in cui guarda l'eroe */
void hitPlayer(float dmg,float fx,float fy){if(P.iframe>0||P.dodgeT>0)return;float def=pDef();dmg=dmg*100/(100+def*3);if(dmg<1)dmg=1;P.hp-=dmg;P.iframe=.5f;P.hurt=.25f;
  char b[16];sprintf(b,"-%d",(int)dmg);floatText(P.x,P.y,b,C(0xff5a5a));sfx(SFX_HURT);float d=sqrtf(dist2(P.x,P.y,fx,fy))+.01f;P.vx+=(P.x-fx)/d*4;P.vy+=(P.y-fy)/d*4;}
static void damage(Ent*e,float dmg,int crit){e->hp-=dmg;e->hit=.15f;char b[16];sprintf(b,crit?"%d!":"%d",(int)dmg);floatText(e->x,e->y,b,crit?C(0xffd84a):C(0xffffff));sfx(SFX_HIT);
  burst(e->x,e->y,14,4,C(0xffffff),1.2f);if(!e->boss){float d=sqrtf(dist2(P.x,P.y,e->x,e->y))+.01f;e->vx+=(e->x-P.x)/d*3;e->vy+=(e->y-P.y)/d*3;e->stun=.15f;}
  if(e->hp<=0)killEnemy(e);}
static void meleeHit(float range,float arc,float mult){int i;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k!=E_EN)continue;float dx=e->x-P.x,dy=e->y-P.y,d=sqrtf(dx*dx+dy*dy);
    float rr=range+(e->boss?EDEF[e->id].s*.25f:0);if(d>rr)continue;float a=atan2f(dy,dx)-fa;while(a>PI)a-=2*PI;while(a<-PI)a+=2*PI;if(fabsf(a)>arc&&d>.6f)continue;
    int crit=frand()*100<pCrit();float dm=pAtk()*mult*(.9f+frand()*.2f)*(crit?1.8f:1);damage(e,dm,crit);}}
static void projectile(float x,float y,float vx,float vy,float dmg,u32 c,int fromP){Ent*p=entNew(E_PROJ,x,y);if(!p)return;p->vx=vx;p->vy=vy;p->at=dmg;p->col=c;p->sub=fromP;p->life=2.2f;p->z=12;}
static void useSkill(void){static const float cost[4]={10,15,25,30};int s=P.skill;if(P.mp<cost[s]){msg("Magia insufficiente");return;}P.mp-=cost[s];sfx(SFX_MAGIC);
  if(s==0){meleeHit(1.9f,PI,1.3f);burst(P.x,P.y,10,18,C(0xc8e8ff),2.5f);P.atkT=.35f;}
  else if(s==1){projectile(P.x+cosf(fa)*.4f,P.y+sinf(fa)*.4f,cosf(fa)*8,sinf(fa)*8,pAtk()*1.8f,C(0xff7a2a),1);}
  else if(s==2){float h=P.mhp*.35f;P.hp+=h;if(P.hp>P.mhp)P.hp=P.mhp;burst(P.x,P.y,6,20,C(0x7affa0),2);char b[16];sprintf(b,"+%d",(int)h);floatText(P.x,P.y,b,C(0x7aff7a));}
  else{int k;for(k=0;k<8;k++){float a=k*PI/4;projectile(P.x,P.y,cosf(a)*7,sinf(a)*7,pAtk()*1.1f,C(0xd0e8ff),1);}}}
static const char*SKN[4]={"Colpo rotante","Palla di fuoco","Luce curativa","Tempesta di lame"};
const char*skillName(int i){return SKN[i&3];}

/* ---------- interazione ---------- */
Ent*nearInter=0;
static Ent*findInter(void){int i;Ent*b=0;float bd=1.6f*1.6f;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k!=E_NPC&&e->k!=E_CHEST&&e->k!=E_PORTAL&&e->k!=E_SHRINE)continue;if(e->k==E_CHEST&&e->flags)continue;
    float r=e->k==E_PORTAL?1.1f:1.6f;float d=dist2(e->x,e->y,P.x+cosf(fa)*.3f,P.y+sinf(fa)*.3f);if(d<r*r&&d<bd){bd=d;b=e;}}return b;}
Ent*dbgFind(void){return findInter();}
static void travel(int z,int data,int from){int dg=-1,fl=0;if(z==Z_DUNG){dg=data>>4;fl=data&15;}sfx(SFX_DOOR);zoneLoad(z,dg,fl,from);}
static void usePortal(Ent*e){
  if(e->tag==-1){/* uscita dopo il boss */int di=Zdung;const char*en=DDEF[di].ent;int z=DDEF[di].fin?Z_IN_CASTLE:!strcmp(en,"forest")?Z_FOREST:!strcmp(en,"desert")?Z_DESERT:!strcmp(en,"peaks")?Z_PEAKS:!strcmp(en,"porto")?Z_PORTO:!strcmp(en,"giungla")?Z_JUNGLE:Z_TOWN;travel(z,0,Z_DUNG);return;}
  if(e->lock){say("Tempio di Giada","Le porte del tempio sono sigillate: servono i tre Sigilli di Giada dei santuari.");return;}
  if(e->tag==Z_DUNG){int di=e->data>>4,fl=e->data&15;(void)fl;if(Zk!=Z_DUNG&&P.lv+3<DDEF[di].lv){char b[160];sprintf(b,"%s: è consigliato il livello %d. Entri lo stesso con O premuto e X.",DDEF[di].n,DDEF[di].lv);if(!HOLD(PSP_CTRL_CIRCLE)){msg(b);return;}}}
  travel(e->tag,e->data,Zk);}
static void openChest(Ent*e){e->flags=1;if(e->data>=1000)P.flags|=1<<(e->data-1000);sfx(SFX_CHEST);int g=irand(10,30)+(int)zoneLv*8;giveGold(g);char b[64];sprintf(b,"+%d oro",g);floatText(e->x,e->y,b,C(0xffd84a));
  if(frand()<.7f)dropItem(e->x,e->y+.6f,(int)zoneLv+1,e->data==-2?1:0);if(frand()<.5f)dropPot(e->x+.5f,e->y+.5f);P.chestsOpened++;burst(e->x,e->y,10,12,C(0xffd84a),1.5f);}
static void shrine(Ent*e){int i=e->data;if(P.ol<2){say("Santuario di Giada","Un antico santuario. Un'iscrizione dice: «Solo chi è mandato dalla Regina può prendere il sigillo».");return;}
  if(P.sig&(1<<i)){say("Santuario di Giada","Il santuario è vuoto: il sigillo è già tuo.");return;}
  if(!e->lock){e->lock=1;int k;for(k=0;k<2;k++){Ent*g=enemy(i==1?"sacerdotessa48":"guerriero48",e->x+(k?1.5f:-1.5f),e->y+1);if(g){g->dst=i+1;g->ag=20;}}say("Santuario di Giada","I custodi di giada si risvegliano!");return;}
  {int k,alive=0;for(k=0;k<nents;k++)if(ents[k].k==E_EN&&ents[k].dst==i+1)alive++;if(alive){say("Santuario di Giada","I custodi proteggono ancora il sigillo.");return;}}
  P.sig|=1<<i;sfx(SFX_LVL);int c=(P.sig&1)+((P.sig>>1)&1)+((P.sig>>2)&1);char b[64];sprintf(b,"Sigillo di Giada %d/3",c);banner(b,c==3?"Il tempio si apre!":"Trova gli altri santuari");
  if(c==3){P.ol=3;int k;for(k=0;k<nents;k++)if(ents[k].k==E_PORTAL&&ents[k].tag==Z_DUNG)ents[k].lock=0;}}
static void interact(Ent*e){if(e->k==E_NPC)talk(e);else if(e->k==E_PORTAL)usePortal(e);else if(e->k==E_CHEST)openChest(e);else if(e->k==E_SHRINE)shrine(e);}

/* ---------- arena ---------- */
int arenaWave=0;float arenaT=0;
void arenaStart(void){arenaWave=1;arenaT=1.5f;banner("Il Colosseo","Ondata 1: resisti!");}
static void arenaUpdate(void){if(Zk!=Z_ARENA||!arenaWave)return;int i,alive=0;for(i=0;i<nents;i++)if(ents[i].k==E_EN)alive++;
  if(arenaT>0){arenaT-=dt;if(arenaT<=0){int n=2+arenaWave;zoneLv=arenaWave*1.2f;const char*mix[6]={"gladiatore","lupo","goblin","scheletro","yeti","demone"};
      for(i=0;i<n;i++){float a=i*6.28f/n;enemy(arenaWave%5==0&&i==0?"campione":mix[irand(0,Min(5,arenaWave/2+1))],14.5f+cosf(a)*7,14.5f+sinf(a)*7);}}return;}
  if(!alive){giveGold(30*arenaWave);giveXp(20*arenaWave);if(arenaWave>P.arenaBest)P.arenaBest=arenaWave;arenaWave++;char b[64];sprintf(b,"Ondata %d!",arenaWave);banner(b,"+oro e esperienza");arenaT=2.5f;}}

/* ---------- aggiornamento ---------- */
float dayLight(void){float h=fmodf(P.dayT,1440)/60;if(ZDEF[Zk].inside||Zk==Z_DUNG)return 0;if(h>=7&&h<18)return 0;if(h>=20||h<5)return 1;if(h>=18)return (h-18)/2;return 1-(h-5)/2;}
static void playerUpdate(void){
  float ax=pad.ax,ay=pad.ay;if(HOLD(PSP_CTRL_UP))ay=-1;if(HOLD(PSP_CTRL_DOWN))ay=1;if(HOLD(PSP_CTRL_LEFT))ax=-1;if(HOLD(PSP_CTRL_RIGHT))ax=1;
  float mx=(ax/32+ay/16)*.5f,my=(ay/16-ax/32)*.5f,ml=sqrtf(mx*mx+my*my);
  float sp=4.2f;int run=HOLD(PSP_CTRL_RTRIGGER)&&P.sta>0;if(run){sp*=1.55f;}
  if(P.dodgeT>0){P.dodgeT-=dt;sp=10;mx=cosf(fa);my=sinf(fa);ml=1;}
  if(ml>.0005f){mx/=ml;my/=ml;float mag=sqrtf(ax*ax+ay*ay);if(mag>1)mag=1;if(P.dodgeT>0)mag=1;if(P.atkT>0)mag*=.35f;
    fa=atan2f(my,mx);P.dir=(int)((fa/(PI/2))+4.5f)&3;float vx=mx*sp*mag,vy=my*sp*mag;
    if(run&&mag>.3f){P.sta-=22*dt;if(P.sta<0)P.sta=0;}
    float nx=P.x+(vx+P.vx)*dt,ny=P.y+(vy+P.vy)*dt;if(walkF(nx,P.y,.25f))P.x=nx;if(walkF(P.x,ny,.25f))P.y=ny;P.vx*=.8f;P.vy*=.8f;
    P.z+=dt*9*mag*(run?1.4f:1);}
  else{float nx=P.x+P.vx*dt,ny=P.y+P.vy*dt;if(walkF(nx,P.y,.25f))P.x=nx;if(walkF(P.x,ny,.25f))P.y=ny;P.vx*=.8f;P.vy*=.8f;}
  if(!run||ml<.0005f){P.sta+=18*dt;if(P.sta>100)P.sta=100;}
  if(P.iframe>0)P.iframe-=dt;if(P.hurt>0)P.hurt-=dt;if(P.atkT>0)P.atkT-=dt;if(P.atkCd>0)P.atkCd-=dt;if(P.dodgeCd>0)P.dodgeCd-=dt;if(P.potCd>0)P.potCd-=dt;
  P.mp+=dt*(1.2f+P.lv*.08f);if(P.mp>P.mmp)P.mp=P.mmp;
  nearInter=findInter();
  if(PRESS(PSP_CTRL_CROSS)){if(nearInter)interact(nearInter);else if(P.atkCd<=0){P.atkT=.3f;P.atkCd=.38f;P.combo=fmodf(P.combo+1,3);sfx(SFX_SWING);meleeHit(1.35f,1.05f,P.combo==2?1.4f:1);}}
  if(PRESS(PSP_CTRL_CIRCLE)&&P.dodgeCd<=0&&P.sta>=20){P.dodgeT=.22f;P.dodgeCd=.6f;P.sta-=20;P.iframe=.3f;}
  if(PRESS(PSP_CTRL_SQUARE)&&P.potCd<=0){if(P.hp<P.mhp&&P.pot>0){P.pot--;float h=P.mhp*.45f;P.hp+=h;if(P.hp>P.mhp)P.hp=P.mhp;P.potCd=1;burst(P.x,P.y,8,10,C(0xff5a7a),1.5f);sfx(SFX_MAGIC);}
    else if(P.mpot>0&&P.mp<P.mmp*.5f){P.mpot--;P.mp=P.mmp;P.potCd=1;burst(P.x,P.y,8,10,C(0x5a8aff),1.5f);}else if(P.pot<=0)msg("Non hai pozioni: comprale da Mira");}
  if(PRESS(PSP_CTRL_TRIANGLE))useSkill();
  if(PRESS(PSP_CTRL_LTRIGGER)){P.skill=(P.skill+1)%P.skills;char b[48];sprintf(b,"Abilità: %s",SKN[P.skill]);msg(b);}
  if(P.hp<=0){P.hp=0;state=S_DEAD;P.deaths++;sfx(SFX_DIE);}
}
static void enemyUpdate(Ent*e){const EnemyDef*d=&EDEF[e->id];float dx=P.x-e->x,dy=P.y-e->y,dd=sqrtf(dx*dx+dy*dy);
  e->anim+=dt*6;if(e->hit>0)e->hit-=dt;if(e->stun>0){e->stun-=dt;}
  float kx=e->vx*dt,ky=e->vy*dt;if(walkF(e->x+kx,e->y,.25f))e->x+=kx;if(walkF(e->x,e->y+ky,.25f))e->y+=ky;e->vx*=.85f;e->vy*=.85f;
  if(e->stun>0)return;
  if(e->slam>0){e->slam-=dt;if(e->slam<=0){if(dd<2.6f)hitPlayer(e->at*1.6f,e->x,e->y);burst(e->x,e->y,4,30,C(0xd8c8a0),4);}return;}
  int agg=dd<e->ag||e->hp<e->mhp;
  if(!agg){/* gironzola */e->wt-=dt;if(e->wt<=0){e->wt=1+frand()*3;e->tx=e->hx+frand()*4-2;e->ty=e->hy+frand()*4-2;}float tx=e->tx-e->x,ty=e->ty-e->y,tl=sqrtf(tx*tx+ty*ty);
    if(tl>.2f){float s=e->sp*.35f*dt;float nx=e->x+tx/tl*s,ny=e->y+ty/tl*s;if(walkF(nx,ny,.25f)){e->x=nx;e->y=ny;}e->dir=(int)((atan2f(ty,tx)/(PI/2))+4.5f)&3;}return;}
  e->dir=(int)((atan2f(dy,dx)/(PI/2))+4.5f)&3;e->cdt-=dt;
  float reach=e->r+(e->boss?d->s*.2f:0);
  if(d->rng&&dd<e->r+1&&dd>1.2f){if(e->cdt<=0){e->cdt=e->cd;projectile(e->x,e->y,dx/dd*6,dy/dd*6,e->at,C(d->rng),0);}
    if(dd<3){float s=-e->sp*.5f*dt;float nx=e->x+dx/dd*s,ny=e->y+dy/dd*s;if(walkF(nx,ny,.25f)){e->x=nx;e->y=ny;}}return;}
  if(dd>reach*.8f){float s=e->sp*dt*(e->boss&&e->hp<e->mhp*.4f?1.3f:1);float nx=e->x+dx/dd*s,ny=e->y+dy/dd*s;
    if(walkF(nx,e->y,.25f))e->x=nx;else{float px=e->x+(dy/dd)*s;if(walkF(px,e->y,.25f))e->x=px;}
    if(walkF(e->x,ny,.25f))e->y=ny;else{float py=e->y-(dx/dd)*s;if(walkF(e->x,py,.25f))e->y=py;}}
  if(dd<=reach&&e->cdt<=0){e->cdt=e->cd;
    if(e->boss&&d->slam&&frand()<.3f){e->slam=.9f;return;}
    e->tag=8;hitPlayer(e->at,e->x,e->y);}
  if(e->boss&&d->sum&&e->hp<e->mhp*.6f&&frand()<dt*.15f){int k,c=0;for(k=0;k<nents;k++)if(ents[k].k==E_EN&&!ents[k].boss)c++;if(c<5){Ent*s=enemy(d->sum,e->x+frand()*2-1,e->y+frand()*2-1);if(s)s->ag=30;burst(e->x,e->y,10,12,C(0x9f6bff),2);}}
  if(e->tag>0)e->tag--;}
static void projUpdate(Ent*p){p->x+=p->vx*dt;p->y+=p->vy*dt;p->life-=dt;if(p->life<=0||!walk((int)p->x,(int)p->y)){if(M[(int)p->y][(int)p->x]!=T_WATER||p->life<=0){p->k=0;burst(p->x,p->y,10,4,p->col,1);return;}}
  if(p->sub){int i;for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k!=E_EN)continue;if(dist2(e->x,e->y,p->x,p->y)<(.5f+(e->boss?.4f:0))*(.5f+(e->boss?.4f:0))){int crit=frand()*100<pCrit();damage(e,p->at*(crit?1.8f:1),crit);p->k=0;burst(p->x,p->y,12,10,p->col,2);return;}}}
  else if(dist2(P.x,P.y,p->x,p->y)<.35f*.35f){hitPlayer(p->at,p->x-p->vx,p->y-p->vy);p->k=0;}}
static void dropUpdate(Ent*d){d->vz-=200*dt;d->z+=d->vz*dt;if(d->z<0){d->z=0;d->vz=-d->vz*.3f;}d->life-=dt;d->anim+=dt*3;
  if(dist2(d->x,d->y,P.x,P.y)<.5f*.5f||(d->sub==0&&dist2(d->x,d->y,P.x,P.y)<1.6f*1.6f)){
    if(d->sub==0){if(dist2(d->x,d->y,P.x,P.y)>.4f*.4f){float dx=P.x-d->x,dy=P.y-d->y,l=sqrtf(dx*dx+dy*dy);d->x+=dx/l*dt*7;d->y+=dy/l*dt*7;return;}giveGold(d->gold);sfx(SFX_COIN);char b[16];sprintf(b,"+%d",d->gold);floatText(P.x,P.y,b,C(0xffd84a));d->k=0;}
    else if(d->sub==2){P.pot++;floatText(P.x,P.y,"+1 pozione",C(0xff8aa8));sfx(SFX_COIN);d->k=0;}
    else{Item it;itemGen(&it,d->xp,d->data,-1);if(invAdd(&it)){char nm[40];itemName(&it,nm);char b[64];sprintf(b,"Trovato: %s",nm);msg(b);floatText(P.x,P.y,nm,RCOL[it.r]);sfx(SFX_CHEST);d->k=0;}else{msg("Zaino pieno: vendi qualcosa da Ugo");d->life=30;}}}
  if(d->life<=0)d->k=0;}
static void npcUpdate(Ent*e){e->anim+=dt;if(!e->flags)return;e->wt-=dt;if(e->wt<=0){e->wt=2+frand()*4;e->tx=e->hx+frand()*6-3;e->ty=e->hy+frand()*6-3;}
  float tx=e->tx-e->x,ty=e->ty-e->y,tl=sqrtf(tx*tx+ty*ty);if(tl>.2f&&dist2(e->x,e->y,P.x,P.y)>2.5f){float s=1.1f*dt,nx=e->x+tx/tl*s,ny=e->y+ty/tl*s;if(walkF(nx,ny,.25f)){e->x=nx;e->y=ny;e->sp=1;}else e->wt=0;e->dir=(int)((atan2f(ty,tx)/(PI/2))+4.5f)&3;e->z+=dt*6;}else e->sp=0;}

/* le creature delle zone aperte ritornano col tempo */
static void respawn(void){if(!ZDEF[Zk].wild)return;spawnT+=dt;if(spawnT<25)return;spawnT=0;int i,c=0;for(i=0;i<nents;i++)if(ents[i].k==E_EN)c++;if(c>=12)return;
  const char*EN[4][3]={{"slime","lupo","goblin"},{"scorpione","sciacallo","mummia"},{"lupo_gelo","yeti","elem_ghiaccio"},{"scimmia48","pantera48","serpe48"}};int ti=Zk==Z_FOREST?0:Zk==Z_DESERT?1:Zk==Z_PEAKS?2:3;
  int k;for(k=0;k<50;k++){int x=irand(2,N-3),y=irand(2,N-3);if(!walk(x,y)||dist2(x,y,P.x,P.y)<14*14)continue;enemy(EN[ti][irand(0,2)],x,y);break;}}
void gameUpdate(void){int i;gT+=dt;P.playT+=dt;P.dayT+=dt*1.5f;if(bTime>0)bTime-=dt;if(msgT>0)msgT-=dt;
  playerUpdate();if(state!=S_PLAY)return;
  for(i=0;i<nents;i++){Ent*e=&ents[i];switch(e->k){case E_EN:if(dist2(e->x,e->y,P.x,P.y)<26*26)enemyUpdate(e);break;case E_PROJ:projUpdate(e);break;case E_DROP:dropUpdate(e);break;case E_NPC:npcUpdate(e);break;}}
  for(i=0;i<200;i++){PT*p=&PTS[i];if(p->t<=0)continue;p->t-=dt;p->x+=p->vx*dt;p->y+=p->vy*dt;p->z+=p->vz*dt;p->vz-=220*dt;if(p->z<0){p->z=0;p->vz*=-.3f;p->vx*=.6f;p->vy*=.6f;}}
  for(i=0;i<24;i++)if(FTX[i].t>0){FTX[i].t-=dt*.9f;FTX[i].z+=dt*30;}
  arenaUpdate();respawn();
  camX+=(P.x-camX)*Min(1,dt*6);camY+=(P.y-camY)*Min(1,dt*6);}

/* ---------- disegno ---------- */
static Model HM,TM;
static u32 rarCol(int s){if(!P.has[s])return 0;u32 c[5]={C(0x8a8a94),C(0x3a7ad0),C(0x8a4ad0),C(0xd8a030),C(0xd04a5a)};return c[P.eq[s].r];}
static void drawHero(int alpha){u32 body=P.has[2]?rarCol(2):C(0x3a6ea5);mHum(&HM,body,C(0xf1c27d),1,P.has[1]?4:0,P.has[1]?rarCol(1):0);
  /* capelli */ if(!P.has[1]){Bx*b=&HM.b[HM.n++];b->x=-.13f;b->y=-.16f;b->z=30;b->w=.27f;b->d=.32f;b->h=3;b->c=C(0x5a3a22);}
  float wt=P.z,atk=P.atkT>0?sinf((1-P.atkT/.3f)*PI):0;int white=P.hurt>0&&((int)(gT*20)&1);
  float hz=P.dodgeT>0?2:0;drawModel(&HM,P.x,P.y,hz,P.dir,wt,atk,white,alpha);
  /* arma e scudo */ float a=dirAng(P.dir),ca=cosf(a),sa=sinf(a),rx=sa*.3f,ry=-ca*.3f,lx=-sa*.3f,ly=ca*.3f;
  float sw=atk*.4f;u32 wc=P.has[0]?rarCol(0):C(0xcccccc);
  if(alpha<255){boxA(P.x+rx+ca*(.05f+sw)-.04f,P.y+ry+sa*(.05f+sw)-.04f,12+atk*6,.08f,.08f,16,wc,alpha);}
  else{box(P.x+rx+ca*(.05f+sw)-.04f,P.y+ry+sa*(.05f+sw)-.04f,12+atk*6+hz,.08f,.08f,16,shade(wc,1.2f));box(P.x+rx+ca*(.05f+sw)-.1f,P.y+ry+sa*(.05f+sw)-.1f,11+atk*6+hz,.2f,.2f,1.5f,C(0x6a4a2a));
    if(P.has[3])box(P.x+lx-.12f+ca*.05f,P.y+ly-.12f+sa*.05f,9+hz,.24f,.24f,12,rarCol(3));}
  if(atk>.2f&&alpha==255){int k;for(k=0;k<5;k++){float q=fa-1+k*.5f;box(P.x+cosf(q)*1.05f-.05f,P.y+sinf(q)*1.05f-.05f,12,.1f,.1f,2,CA(0xffffff,180));}}}
static void drawNpc(Ent*e){const NpcDef*n=&NDEF[e->id];if(n->role==R_CAT){mBeast(&TM,C(0xe09a40),.5f,C(0xe09a40));drawModel(&TM,e->x,e->y,0,e->dir,e->anim*3,0,0,255);return;}
  if(n->role==R_TRAG){/* la nave */float x=e->x,y=e->y;box(x-1.4f,y-.5f,-4,2.8f,1,8,C(0x6a4a2a));box(x-1.3f,y-.4f,4,2.6f,.8f,1,C(0x9a7a4a));box(x-.05f,y-.05f,5,.1f,.1f,40,C(0x5a3a22));box(x-.06f,y-.7f,16,.04f,1.4f,22,C(0xf4f0e8));box(x+1.2f,y-.2f,0,.6f,.4f,5,C(0x6a4a2a));return;}
  u32 skin=C(0xf1c27d);if(!strcmp(n->id,"villico")){u32 cs[6]={C(0x6a7a4a),C(0x8a4a3a),C(0x3a5a8a),C(0x7a3a6a),C(0x9a8a3a),C(0x4a8a7a)};mHum(&TM,cs[(int)(e->hx*7+e->hy)%6],skin,1,3,C(0x5a3a2a));}
  else mHum(&TM,C(n->c),skin,!strcmp(n->id,"tommaso")||!strcmp(n->id,"coral")?.75f:1,n->role==R_KING||n->role==R_NEREA?6:4,C(n->hat));
  if(n->role==R_KING||n->role==R_NEREA){Bx*b=&TM.b[TM.n++];b->x=-.18f;b->y=-.18f;b->z=31;b->w=.36f;b->d=.36f;b->h=2;b->c=C(0xffd84a);}
  drawModel(&TM,e->x,e->y,0,e->dir,e->sp>0?e->z:0,0,0,255);}
static void drawEnemy(Ent*e){Model*m=&TM;enemyModel(m,e->id);int white=e->hit>0;float atk=e->tag>0?e->tag/8.f:0;
  float z=EDEF[e->id].mk==MK_BAT?4:0;drawModel(m,e->x,e->y,z,e->dir,e->anim,atk,white,255);
  if(e->slam>0){float r=2.5f*(1-e->slam/.9f*.3f);int k;for(k=0;k<16;k++){float a=k*PI/8;box(e->x+cosf(a)*r-.08f,e->y+sinf(a)*r-.08f,.2f,.16f,.16f,.6f,C(0xff3a3a));}}}
static void drawChest(Ent*e){float x=e->x-.35f,y=e->y-.25f;box(x,y,0,.7f,.5f,8,C(0x8a5a2a));if(e->flags){box(x,y-.1f,8,.7f,.12f,6,C(0x9a6a3a));}else{box(x,y,8,.7f,.5f,3,C(0xa06a32));box(x+.3f,y+.48f,4,.1f,.04f,4,C(0xd4af37));}}
static void drawPortal(Ent*e){float x=e->x,y=e->y;switch(e->sub){
  case 2:{/* ingresso del dungeon: arco di pietra con scale */box(x-.6f,y-.5f,0,.25f,.25f,24,C(0x6a6a70));box(x+.35f,y-.5f,0,.25f,.25f,24,C(0x6a6a70));box(x-.6f,y-.5f,24,1.2f,.25f,5,C(0x5a5a62));box(x-.35f,y-.4f,0,.7f,.15f,20,C(0x0a0810));
    if(e->lock){box(x-.3f,y-.25f,0,.6f,.06f,18,C(0x2ab87a));}float g=.5f+.5f*sinf(gT*3);box(x-.2f,y-.22f,8+g*2,.4f,.04f,4,e->lock?C(0x6affc0):C(0xffb04a));}break;
  case 4:case 6:{float g=gT*2;int k;box(x-.5f,y-.5f,0,1,1,1,C(0x2a1a4a));for(k=0;k<6;k++){float a=g+k*1.05f;box(x+cosf(a)*.45f-.06f,y+sinf(a)*.45f-.06f,4+k*3,.12f,.12f,3,C(0xc46bff));}box(x-.15f,y-.15f,6,.3f,.3f,20,CA(0xc46bff,140));}break;
  case 5:{box(x-.45f,y-.45f,-4,.9f,.9f,4,C(0x1a1410));int k;for(k=0;k<3;k++)box(x-.4f+k*.25f,y-.4f,-k*1.3f,.25f,.8f,1,C(0x6a6a70));}break;
  case 3:{box(x-.4f,y-.06f,0,.8f,.12f,16,C(0x6a4a2a));box(x-.36f,y-.04f,0,.72f,.14f,15,C(0x8a5a32));box(x+.2f,y+.08f,7,.06f,.04f,1.5f,C(0xd4af37));}break;
  case 0:if(Zk!=Z_TOWN){float dx=x<1?1:x>N-2?-1:0,dy=y<1?1:y>N-2?-1:0;float sx=x+dx*.6f+(dy?.7f:0),sy=y+dy*.6f+(dx?.7f:0);box(sx-.05f,sy-.05f,0,.1f,.1f,20,C(0x6a4a2a));box(sx-.3f,sy-.06f,14,.6f,.12f,6,C(0x9a7a4a));}break;
  default:break;}}
static void drawShrine(Ent*e){float x=e->x,y=e->y;int got=P.sig&(1<<e->data);box(x-.4f,y-.4f,0,.8f,.8f,4,C(0x5a6a58));box(x-.25f,y-.25f,4,.5f,.5f,10,C(0x6e7e6c));
  if(!got){float b=sinf(gT*2)*1.5f;box(x-.15f,y-.15f,16+b,.3f,.3f,6,C(0x3affa0));}}
static void drawDrop(Ent*d){float x=d->x,y=d->y,z=d->z+sinf(d->anim)*1.5f;if(d->sub==0){box(x-.08f,y-.08f,z,.16f,.16f,3,C(0xffd84a));box(x-.04f,y-.04f,z+3,.08f,.08f,1,C(0xfff0a0));}
  else if(d->sub==2){box(x-.08f,y-.08f,z,.16f,.16f,5,C(0xff4a6a));box(x-.04f,y-.04f,z+5,.08f,.08f,2,C(0xe8e0d0));}
  else{box(x-.12f,y-.12f,z+2,.24f,.24f,6,C(0xa8a8b8));box(x-.06f,y-.06f,z+8,.12f,.12f,3,C(0xffd84a));}}
extern int arenaWave;
void gameDraw(void){int i;float dl=dayLight();
  meshDraw();
  for(i=0;i<nents;i++){Ent*e=&ents[i];if(!e->k)continue;if(fabsf(e->x-camX)+fabsf(e->y-camY)>22&&!(e->k==E_NPC&&NDEF[e->id].role==R_TRAG))continue;
    switch(e->k){case E_NPC:drawNpc(e);break;case E_EN:drawEnemy(e);break;case E_CHEST:drawChest(e);break;case E_PORTAL:drawPortal(e);break;case E_SHRINE:drawShrine(e);break;case E_DROP:drawDrop(e);break;
    case E_PROJ:box(e->x-.1f,e->y-.1f,e->z,.2f,.2f,5,e->col);box(e->x-.06f-e->vx*.03f,e->y-.06f-e->vy*.03f,e->z+1,.12f,.12f,3,shade(e->col,.8f));break;}}
  /* l'acqua che scorre e le onde: piccole strisce chiare */
  drawHero(255);
  for(i=0;i<200;i++){PT*p=&PTS[i];if(p->t>0)box(p->x-p->s/2,p->y-p->s/2,p->z*.12f,p->s,p->s,p->s*30,p->c);}
  dynFlush();
  /* l'eroe dietro un muro o un albero si vede in trasparenza */
  sceGuDepthFunc(GU_LESS);sceGuDepthMask(GU_TRUE);sceGuEnable(GU_BLEND);drawHero(110);
  {extern void alFlushPub(void);alFlushPub();}
  sceGuDepthFunc(GU_GEQUAL);sceGuDepthMask(GU_FALSE);sceGuDisable(GU_BLEND);
  gfx2D();
  /* notte e buio dei dungeon */
  if(Zk==Z_DUNG){float sx,sy;w2s(P.x,P.y,14,&sx,&sy);dark(sx,sy,250*ZOOM/.72f,185);}
  else if(dl>0){tint(((u32)(dl*120)<<24)|0x401808);}
  /* luci: lampioni di notte, torce sempre nei dungeon */
  for(i=0;i<nlights;i++){Light*l=&LIGHTS[i];if(Zk!=Z_DUNG&&dl<=.05f&&!ZDEF[Zk].inside)continue;float sx,sy;w2s(l->x,l->y,l->z,&sx,&sy);glow(sx,sy,l->r*ZOOM*(1+.05f*sinf(gT*7+i)),(u32)((Zk==Z_DUNG?.8f:dl)*150)<<24|(l->c&0xffffff));}
  for(i=0;i<nents;i++){Ent*e=&ents[i];if(e->k==E_PROJ){float sx,sy;w2s(e->x,e->y,e->z,&sx,&sy);glow(sx,sy,22,0x90000000|(e->col&0xffffff));}}
  /* nomi, punti esclamativi, barre della vita */
  for(i=0;i<nents;i++){Ent*e=&ents[i];float sx,sy;if(!e->k)continue;
    if(e->k==E_EN&&(e->hp<e->mhp||e->boss)&&!e->boss){w2s(e->x,e->y,34*EDEF[e->id].s,&sx,&sy);rect(sx-12,sy,24,3,0xa0000000);rect(sx-12,sy,24*e->hp/e->mhp,3,0xff3a3ae0);}
    if(e->k==E_NPC&&dist2(e->x,e->y,P.x,P.y)<36&&NDEF[e->id].role!=R_TRAG){w2s(e->x,e->y,40,&sx,&sy);textC(sx,sy-10,e->name,0xffffffff);
      const NpcDef*n=&NDEF[e->id];int j,mark=0;for(j=0;j<8&&n->qs[j];j++){int q=questIdx(n->qs[j]);if(q<0)continue;int s=-1,k;for(k=0;k<P.nq;k++)if(P.qact[k]==q)s=k;if(s>=0&&P.qn[s]>=QDEF[q].n){mark=2;break;}if(!P.qdone[q]&&s<0&&P.lv>=QDEF[q].lv){mark=1;break;}}
      if((n->role==R_KING&&(P.st==0||(P.st==1&&shardCount()==6)))||(n->role==R_ORESTE&&P.ol<=1)||(n->role==R_NEREA&&P.ol==4)||(n->role==R_CAPT&&P.lv>=10&&P.ol==0))mark=1;
      if(mark)textC(sx,sy-24,mark==2?"?":"!",mark==2?0xff4ae8ff:0xff3ad8ff);}
    if(e->k==E_PORTAL&&e->name[0]&&dist2(e->x,e->y,P.x,P.y)<9&&e->sub!=1&&e->sub!=3){w2s(e->x,e->y,26,&sx,&sy);textC(sx,sy-6,e->name,0xffa0e0ff);}}
  for(i=0;i<24;i++){FT*f=&FTX[i];if(f->t<=0)continue;float sx,sy;w2s(f->x,f->y,f->z,&sx,&sy);u32 a=(u32)(Min(1,f->t*2)*255);textC(sx,sy,f->s,(f->c&0xffffff)|(a<<24));}
  if(bTime>0){float a=Min(1,bTime);u32 al=(u32)(a*230);rect(60,52,360,40,(al<<24)|0x101820);rect(60,52,360,1,(al<<24)|0x60b8d8);textC(240,56,bT,(al+25)<<24|0x4ad8ff);textC(240,72,bS,(al+25)<<24|0xffffff);}
}
void alFlushPub(void);
