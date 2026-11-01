/* Voxelia PSP — dati del gioco: nemici, oggetti, dungeon, personaggi, missioni (presi dal gioco originale) */
#include "vx.h"

#define H MK_HUM
#define B MK_BEAST
const EnemyDef EDEF[]={
/* id, nome, pv, att, xp, vel, portata, ricarica, aggro, boss, slam, proiettile, evoca, modello, c1, c2, scala, cappello */
{"slime","Slime",22,4,6,1.4,1.1,1.3,6,0,0,0,0,MK_BLOB,0x55cc66,0,1,0,0},
{"lupo","Lupo",28,6,8,2.8,1.1,1,8,0,0,0,0,B,0x8a8f9a,0x222222,1,0,0},
{"goblin","Goblin",35,8,10,2,1.1,1.1,7,0,0,0,0,H,0x4a6b2a,0x7cc04a,.85,3,0x663333},
{"troll","Troll della Foresta",300,16,120,1.6,1.8,1.5,9,1,1,0,0,H,0x4b6f50,0x6f9a6a,2,0,0},
{"scorpione","Scorpione",45,11,12,2.2,1.1,1.1,7,0,0,0,0,B,0xb5452a,0x222222,1,0,0},
{"sciacallo","Sciacallo",40,12,12,3,1.1,.9,8,0,0,0,0,B,0xc9a24a,0x222222,1,0,0},
{"mummia","Mummia",75,14,18,1.5,1.2,1.3,6,0,0,0,0,H,0xd8cfb0,0xc9bf9a,1,0,0},
{"faraone","Faraone Eterno",500,22,220,1.7,2,1.4,10,1,1,0,"mummia",H,0xd4af37,0xb8860b,1.7,6,0x2a5fd0},
{"lupo_gelo","Lupo del Gelo",55,14,16,3,1.1,.9,8,0,0,0,0,B,0xdde8f4,0x88aaaa,1.1,0,0},
{"yeti","Yeti",130,20,26,1.6,1.3,1.4,7,0,0,0,0,H,0xeef4fa,0xcfe0ee,1.4,0,0},
{"elem_ghiaccio","Elementale di Ghiaccio",60,16,22,1.5,5,1.9,8,0,0,0x9fe8ff,0,MK_ELEM,0x8fd8f0,0,1,0,0},
{"drago_brina","Drago di Brina",800,28,400,1.7,4,1.8,12,1,1,0xbff4ff,0,MK_DRAKE,0x9fc8e8,0xdff2ff,1.8,0,0},
{"arciere","Goblin Arciere",30,9,11,1.8,4.5,1.8,8,0,0,0xc8a060,0,H,0x6b5a2a,0x7cc04a,.85,3,0x2a4a1a},
{"ratto","Ratto Gigante",18,5,5,3.2,1,.8,7,0,0,0,0,B,0x6b5a4a,0x222222,.7,0,0},
{"re_goblin","Re Goblin Grugnak",380,15,180,1.8,1.8,1.3,10,1,1,0,"goblin",H,0x7a2a2a,0x7cc04a,1.6,6,0xd4af37},
{"scheletro","Scheletro",60,16,20,2,1.2,1.1,7,0,0,0,0,H,0xe8e4d8,0xe8e4d8,1,0,0},
{"zombie","Zombie",85,13,16,1.1,1.1,1.4,6,0,0,0,0,H,0x4a5a3a,0x7a9a6a,1,0,0},
{"pipistrello","Pipistrello",22,8,8,3.4,1,.8,9,0,0,0,0,MK_BAT,0x3a2a3a,0,1,0,0},
{"necromante","Necromante Velka",460,18,260,1.5,4.5,1.6,11,1,0,0x9f6bff,"scheletro",H,0x2a1a3a,0xc8b8d8,1.6,10,0x1a0a2a},
{"scarabeo","Scarabeo",38,12,12,2.4,1,1,7,0,0,0,0,B,0x2a7a6a,0x112233,.8,0,0},
{"sacerdote","Sacerdote di Khem",55,18,22,1.6,4.5,1.9,8,0,0,0xffd84a,0,H,0xe8d8a0,0xb8865b,1,8,0xd4af37},
{"sfinge","Sfinge Antica",650,24,360,1.8,2,1.4,11,1,1,0,"scarabeo",MK_SPHINX,0,0,1.9,0,0},
{"golem_cr","Golem di Cristallo",150,20,30,1.3,1.4,1.6,6,0,0,0,0,H,0x9ad0f0,0xc8ecff,1.5,0,0},
{"ragno","Ragno di Cristallo",50,16,18,3,1.1,.9,9,0,0,0,0,MK_SPIDER,0x6a8aaa,0,1,0,0},
{"regina","Regina dei Ragni",760,26,450,2,4,1.6,12,1,0,0xc88cff,"ragno",MK_SPIDER,0x7a5aaa,0,2.2,0,0},
{"imp","Imp",50,20,22,2.4,4.5,1.7,9,0,0,0xff7a2a,0,H,0xb0301a,0xe05a3a,.75,4,0x2a0a0a},
{"golem_magma","Golem di Magma",170,24,34,1.2,1.4,1.6,6,0,0,0,0,H,0x3a2a2a,0xff6a2a,1.5,0,0},
{"demone","Demone",115,26,32,2.2,1.3,1.2,8,0,0,0,0,H,0x7a1a1a,0xa83a2a,1.3,5,0x1a0a0a},
{"ignis","Signore della Fiamma Ignis",900,32,560,1.8,4,1.5,12,1,1,0xff5a1a,"imp",H,0x2a0a0a,0xff7a2a,2.1,8,0xffcc33},
{"uomo_pesce","Uomo-Pesce",95,24,30,2,1.2,1.1,8,0,0,0,0,H,0x2a7a7a,0x5ab0a0,1.1,0,0},
{"medusa","Medusa",60,22,26,1.4,4.5,1.8,8,0,0,0x7ffff0,0,MK_ELEM,0xd08ae0,0,1,0,0},
{"granchio","Granchio Corazzato",125,22,28,1.6,1.2,1.3,7,0,0,0,0,MK_CRAB,0xc8502a,0,1,0,0},
{"leviatano","Leviatano",1100,34,700,1.6,2.4,1.5,12,1,1,0,"medusa",MK_KRAKEN,0x2a5a7a,0,1.6,0,0},
{"cavaliere","Cavaliere del Vuoto",170,30,40,1.8,1.3,1.3,8,0,0,0,0,H,0x2a2238,0x4a3a6a,1.3,6,0x6a4a9a},
{"ombra","Ombra",85,28,30,3.2,1.1,1,10,0,0,0,0,MK_ELEM,0x2a1a3a,0,1,0,0},
{"mago","Mago Oscuro",60,22,30,1.6,5,2,8,0,0,0xcc88ff,0,H,0x5a2d8a,0xe0b090,1,10,0x3a1a6a},
{"lich","Re Lich Malakar",1500,36,1200,1.8,4.5,1.5,14,1,1,0xc46bff,"ombra",H,0x2a1a4a,0xcceeff,1.9,7,0xd4af37},
{"scimmia48","Scimmia Ladra",120,26,34,3.4,1.1,.8,9,0,0,0,0,B,0x8a5a2a,0x5a3a1a,.75,0,0},
{"pantera48","Pantera d'Ombra",170,32,42,3.2,1.2,.9,10,0,0,0,0,B,0x1e1e2a,0x0a0a10,1.15,0,0},
{"serpe48","Serpe di Giada",150,30,38,2.2,1.3,1.1,8,0,0,0,0,MK_SERP,0x2a9a5a,0,1,0,0},
{"guerriero48","Guerriero di Giada",230,34,48,1.9,1.3,1.2,8,0,0,0,0,H,0x2a8a5a,0xc8a070,1.25,6,0xd4af37},
{"sacerdotessa48","Sacerdotessa di Giada",130,30,44,1.6,5,1.8,9,0,0,0x6affc0,0,H,0x3a6a5a,0xe0b090,1,10,0x6affc0},
{"quetzal48","Quetzal, il Serpente di Giada",1500,40,900,1.8,3,1.5,12,1,1,0x6affc0,"serpe48",MK_DRAKE,0x2ab87a,0x8affc8,1.9,0,0},
{"gladiatore","Gladiatore",90,18,24,2.2,1.2,1.1,9,0,0,0,0,H,0x8a3a2a,0xe0b090,1.1,4,0xc0c0c8},
{"campione","Campione dell'Arena",600,26,300,2,1.6,1.3,12,1,1,0,"gladiatore",H,0x8a1a1a,0xe0b090,1.6,6,0xd4af37},
};
#undef H
#undef B
const int NEDEF=sizeof(EDEF)/sizeof(EDEF[0]);
int enemyId(const char*n){int i;if(!n)return -1;for(i=0;i<NEDEF;i++)if(!strcmp(EDEF[i].id,n))return i;return -1;}
void enemyModel(Model*m,int id){const EnemyDef*e=&EDEF[id];u32 c1=C(e->c1),c2=C(e->c2);
  switch(e->mk){case MK_HUM:mHum(m,c1,c2,e->s,e->hatH,C(e->hatC));break;case MK_BEAST:mBeast(m,c1,e->s,c2);break;case MK_BLOB:mBlob(m,c1,e->s);break;
  case MK_BAT:mBat(m,c1,e->s);break;case MK_SPIDER:mSpider(m,c1,e->s);break;case MK_ELEM:mElem(m,c1,e->s);break;case MK_CRAB:mCrab(m,c1,e->s);break;
  case MK_DRAKE:mDrake(m,c1,c2,e->s);break;case MK_KRAKEN:mKraken(m,c1,e->s);break;case MK_SPHINX:mSphinx(m,e->s);break;case MK_SERP:mSerpent(m,c1,e->s);break;}}

/* ---------- oggetti ---------- */
const u32 RCOL[5]={0xffd4ccc8,0xffffa34a,0xffff66b8,0xff2baeff,0xff6d4dff};
const char*RNAME[5]={"Comune","Raro","Epico","Leggendario","Unico"};
static const char*SLN[4][8]={{"Pugnale","Spada","Ascia","Martello","Lancia","Bastone","Falce","Stocco"},{"Elmo","Cappuccio","Corona","Celata"},{"Corazza","Giaco","Tunica","Cotta di maglia"},{"Scudo","Brocchiere","Pavese"}};
static const int SLC[4]={8,4,4,3};
static const char*RS[4]={""," d'Acciaio"," delle Rune"," del Drago"};
static const float RM[5]={1,1.4f,1.9f,2.8f,3.3f};
static float ibase(int s,int lv){return (s==0?5:s==2?4:2.5f)+lv*(s==0?2:1.4f);}
void itemGen(Item*it,int lv,int minR,int slot){int s=slot>=0?slot:irand(0,3);float q=frand();int r=q<.03f?3:q<.12f?2:q<.35f?1:0;if(r<minR)r=minR;
  memset(it,0,sizeof*it);it->s=s;it->r=r;it->v=(short)(ibase(s,lv)*RM[r]*(.85f+frand()*.3f)+.5f);if(it->v<1)it->v=1;
  snprintf(it->n,sizeof it->n,"%s%s",SLN[s][irand(0,SLC[s]-1)],RS[r>3?3:r]);it->p=it->v*5;
  if(r>=2&&frand()<.6f){if(s==0)it->cr=irand(2,4+r*2);else it->hp=(short)(irand(5,12)*(r-1)+lv*2);}}
int itemVal(const Item*it){return (int)(it->v*(1+.12f*it->up)+.5f);}
void itemName(const Item*it,char*o){if(it->up)sprintf(o,"%s +%d",it->n,it->up);else strcpy(o,it->n);}

/* ---------- dungeon ---------- */
const DungDef DDEF[]={
{"tana","Tana dei Goblin",2,2,{"goblin","arciere","ratto",0},"re_goblin",TH_CAVE,"forest",0},
{"cripta","Cripta Dimenticata",4,3,{"scheletro","zombie","pipistrello",0},"necromante",TH_CRYPT,"town",0},
{"piramide","Piramide di Khem",6,3,{"mummia","scarabeo","sacerdote",0},"sfinge",TH_PYR,"desert",0},
{"cristallo","Caverne di Cristallo",8,3,{"golem_cr","ragno","elem_ghiaccio",0},"regina",TH_ICE,"peaks",0},
{"fucina","Fucina Infernale",10,3,{"imp","golem_magma","demone",0},"ignis",TH_FIRE,"peaks",0},
{"abisso","Abisso Sommerso",12,3,{"uomo_pesce","medusa","granchio",0},"leviatano",TH_SEA,"porto",0},
{"cittadella","Cittadella del Vuoto",15,4,{"cavaliere","ombra","mago","scheletro"},"lich",TH_VOID,"in_castle",1},
{"tempio48","Tempio di Giada",13,3,{"guerriero48","sacerdotessa48","serpe48",0},"quetzal48",TH_JADE,"giungla",0},
};
const int NDDEF=sizeof(DDEF)/sizeof(DDEF[0]);
int dungIdx(const char*id){int i;for(i=0;i<NDDEF;i++)if(!strcmp(DDEF[i].id,id))return i;return -1;}

/* ---------- personaggi ---------- */
const NpcDef NDEF[]={
{"re","Re Aldric",0x7a1a2a,0xd4af37,{0},{0},R_KING},
{"guardia","Guardia Reale",0x5a6a8a,0x9aa4b8,{"Il Re riceve chiunque abbia coraggio. Avvicinati pure.","Da quando la corona si è spezzata, le notti sono più lunghe."},{0},0},
{"ciambellano","Ciambellano Orsino",0x6a2a6a,0x222222,{"Il portale per la Cittadella si aprirà qui, quando la corona sarà riforgiata.","Il Re è stanco, ma non ha mai perso la speranza."},{0},0},
{"saggio","Saggio Elandor",0x3a4a8a,0x2a2a5a,{"Malakar era il fratello del Re. Il Vuoto lo ha cambiato.","Ogni dungeon rinasce più oscuro dopo che ne sconfiggi il signore.","Le abilità si scelgono con L e R e si usano con △."},{0},R_SAGE},
{"gilda","Oste Gilda",0xa8632f,0xcc4433,{"Benvenuto al Drago Ubriaco! Birra, letti caldi e chiacchiere.","Se cerchi lavoro, ho sempre qualcosa da fare per un eroe."},{"g1","g2","g3","g4"},R_INN},
{"lino","Bardo Lino",0x2a8a5a,0xaa3366,{"Vuoi sentire la ballata dell'eroe di Aldoria? Non è ancora finita... dipende da te."},{0},R_BARD},
{"avventore","Avventore",0x6a5a4a,0x4a3a2a,{"Ho sentito che i dungeon cambiano forma ogni volta che qualcuno ne sconfigge il signore.","La Piramide di Khem è nel deserto, a est. Non andarci senza pozioni.","Alla Fucina Infernale si arriva dai Picchi Gelidi. Strano, vero?"},{0},0},
{"vera","Mercenaria Vera",0x8a3a3a,0x3a3a3a,{"Un consiglio: i nemici a distanza lanciano proiettili. Muoviti e li schiverai.","Quando un boss si infuria evoca rinforzi. Tieniti libero lo spazio attorno.","Con O fai una capriola: per un attimo nessuno ti può colpire."},{0},0},
{"borin","Fabbro Borin",0x5a3a2a,0x333333,{"Il ferro non mente. Portami materiali e ti forgerò meraviglie.","Posso potenziare il tuo equipaggiamento: fino a +5, se hai l'oro."},{"b1","b2","b3","b4"},R_SMITH},
{"mira","Erborista Mira",0x4a8a3a,0x8a3aaa,{"Le mie pozioni hanno salvato più eroi delle spade.","Ogni ingrediente ha un'anima. Anche la gelatina di slime."},{"m1","m2","m3","m4"},R_ALCH},
{"lia","Sacerdotessa Lia",0xeeeeee,0xcc33cc,{"La Luce ti protegga, viandante.","I morti non dovrebbero camminare. Aiutami a dar loro pace."},{"l1","l2","l3"},R_HEAL},
{"rosa","Mamma Rosa",0xc86a8a,0x6a3a2a,{"Mio figlio Tommaso non sta mai fermo...","Ho appena sfornato il pane. Ne vuoi un pezzo?"},{"r1","r2"},0},
{"gatto","Briciola",0xe09a40,0xe09a40,{0},{0},R_CAT},
{"gerald","Vecchio Gerald",0x7a7a6a,0xaaaaaa,{"Ai miei tempi ero il miglior lanciere del regno. Poi ho preso una freccia... nella schiena.","Malakar era il fratello del Re, lo sapevi? Un tempo era buono."},{"ge1","ge2"},0},
{"marcus","Capitano Marcus",0x3a5a9a,0xc0c8d8,{"La guardia non basta più. Ci servono eroi.","Fuori dalle mura il pericolo cresce ogni giorno."},{"c1","c2","c3","c4","c5","c6","c7"},0},
{"tommaso","Piccolo Tommaso",0x4a9ad0,0xd05a3a,{"Da grande farò l'eroe come te!"},{"t1","t2"},0},
{"ugo","Mercante Ugo",0xa8632f,0xffcc33,{"Merce fresca da ogni angolo del regno!","Compro tutto, a prezzi onesti... più o meno."},{0},R_SHOP},
{"nino","Pescatore Nino",0x3a6a8a,0xe0c040,{"Il mare è inquieto. Qualcosa si muove nell'Abisso, sotto il molo.","Per l'Abisso si scende dal vecchio pozzo pieno di alghe sulla banchina. Io non ci scendo!"},{"n1","n2","n3"},0},
{"kael","Maestro d'Arena Kael",0x8a1a1a,0xd4af37,{"Nel Colosseo conta solo una cosa: restare in piedi.","Ogni ondata è più dura della precedente. Quante ne reggi?"},{0},R_ARENA},
{"guardia_porta","Guardia della Porta",0x5a6a8a,0x9aa4b8,{"A nord la Foresta di Elmwood, a est il Deserto di Khem, a ovest i Picchi Gelidi, a sud il Porto.","La Cripta è nel cimitero a sud-ovest della città."},{0},0},
{"villico","Cittadino",0x6a7a4a,0x5a4a3a,{"Bella giornata ad Aldoria, vero?","Hai visto il Colosseo? Si sentono le urla fin qui!","Il Mercante Ugo fa buoni prezzi, se gli sorridi.","Attento ai lupi, fuori dalle mura."},{0},0},
{"marina","Capitana Marina",0x2a3a6a,0x1a1a2a,{"Il mare è grande, ma la mia Stella del Sud lo conosce tutto."},{0},R_CAPT},
{"oreste","Cancelliere Oreste",0x2a6a6a,0xd4af37,{"Thalassa ti è grata, straniero."},{0},R_ORESTE},
{"nerea","Regina Nerea",0x3a8ab0,0xe8e4ff,{"Il mare ci ha portato un amico."},{0},R_NEREA},
{"zefiro","Mercante Zefiro",0xc86a2a,0xe8d8a0,{"Spezie, perle, sigilli! Tutto quello che il mare porta, Zefiro lo vende."},{0},R_ZEFIRO},
{"ilva","Esploratrice Ilva",0x6a5a3a,0xc8a070,{"Questa giungla è un libro aperto, se sai leggere le foglie.","Le teste di pietra erano i re di Thalassa, prima delle regine. Guardano tutte verso il tempio.","I tre santuari sono a ovest, a est e a sud-ovest. I custodi di giada li proteggono."},{0},0},
{"guardia48","Guardia del Palazzo",0x2a8a8a,0xd4af37,{"Il Palazzo della Regina è aperto a chi porta pace.","Thalassa non ha mura: il mare è la nostra difesa."},{0},0},
{"ilio","Pescatore Ilio",0x4a6a8a,0xd8c070,{"Da quando il Serpente si è svegliato, i pesci scappano verso il largo.","Nella giungla c'è un fiume che porta al tempio. Nessuno lo risale più."},{0},0},
{"teti","Pescivendola Teti",0x3a6a8a,0xe8e0d0,{"Tonno, orate, ricciole! Pescato all'alba, venduto a mezzogiorno!"},{0},0},
{"coral","Piccola Coral",0xe8a0b0,0xffd84a,{"Mia nonna dice che il Serpente di Giada era buono, una volta. Proteggeva la giungla.","Hai visto le scimmie? Mi hanno rubato il pane!"},{0},0},
{"marea","Nonna Marea",0x6a4a8a,0xe8e0d0,{"Siediti, straniero: Thalassa ha mille anni di storie.","Il primo re di Thalassa arrivò su una zattera di giunchi, inseguito da una tempesta."},{0},0},
{"gaia","Ostessa Gaia",0x8a3a4a,0xf4f0e0,{"Benvenuto alla Sirena! Pesce alla brace e rum di canna, finché ce n'è."},{0},R_INN},
{"glauco","Vecchio Glauco",0x4a5a6a,0x2a2a3a,{"Sessant'anni per mare. Ne ho viste di tempeste, ma mai come la notte in cui si svegliò il Serpente."},{0},0},
{"trag","Traghetto Stella del Sud",0x8a6a42,0x8a6a42,{0},{0},R_TRAG},
};
const int NNDEF=sizeof(NDEF)/sizeof(NDEF[0]);
int npcIdx(const char*id){int i;for(i=0;i<NNDEF;i++)if(!strcmp(NDEF[i].id,id))return i;return -1;}

/* ---------- missioni ---------- */
#define E4(a,b,c,d) {a,b,c,d}
const QuestDef QDEF[]={
{"c1",Q_KILL,E4("lupo",0,0,0),8,0,0,0,0,"Caccia ai lupi","I lupi della Foresta di Elmwood attaccano i viandanti. Abbattine 8.",60,40,0},
{"c2",Q_KILL,E4("goblin","arciere",0,0),10,2,0,0,0,"Predoni goblin","I goblin razziano le fattorie. Eliminane 10, nella Foresta o nella loro Tana.",90,70,0},
{"c3",Q_BOSS,E4("troll",0,0,0),1,2,0,0,0,"Il Troll di Elmwood","Un troll gigantesco infesta il cuore della foresta. Abbattilo.",200,150,0},
{"c4",Q_KILL,E4("scorpione","sciacallo",0,0),10,4,0,0,0,"Sabbie pericolose","Le carovane per Khem vengono assalite. Ripulisci il deserto: 10 bestie.",150,110,0},
{"c5",Q_BOSS,E4("faraone",0,0,0),1,5,0,0,0,"Il Faraone Eterno","Un antico sovrano è tornato a camminare nel deserto. Rimandalo nella tomba.",350,260,0},
{"c6",Q_KILL,E4("yeti","lupo_gelo",0,0),8,7,0,0,0,"Bestie del gelo","Sui Picchi Gelidi le bestie scendono a valle. Fermane 8.",240,180,0},
{"c7",Q_BOSS,E4("drago_brina",0,0,0),1,8,0,0,0,"Il Drago di Brina","Il drago dei Picchi ha congelato un intero villaggio. È tempo di affrontarlo.",650,500,0},
{"m1",Q_COL,E4("slime",0,0,0),6,0,"Gelatina di slime",.6,0,"Ingredienti appiccicosi","Mi servono 6 gelatine di slime per un unguento. Gli slime vivono nella foresta.",50,35,0},
{"m2",Q_COL,E4("scorpione",0,0,0),5,4,"Pungiglione",.6,0,"Veleno curativo","Dal veleno di scorpione si ricava un antidoto. Portami 5 pungiglioni.",120,90,0},
{"m3",Q_COL,E4("elem_ghiaccio",0,0,0),5,7,"Cristallo gelido",.6,0,"Freddo eterno","I cristalli degli elementali conservano le erbe per anni. Me ne servono 5.",220,160,0},
{"m4",Q_COL,E4("imp","demone",0,0),6,10,"Zolfo infernale",.6,0,"Fuoco alchemico","Lo zolfo della Fucina Infernale alimenta i miei elisir più potenti. Ne servono 6.",330,250,0},
{"b1",Q_COL,E4("lupo","lupo_gelo",0,0),6,0,"Pelliccia",.6,0,"Pellicce per l'inverno","Foderò le armature con pelliccia di lupo. Portamene 6.",70,50,0},
{"b2",Q_COL,E4("mummia",0,0,0),5,4,"Bende antiche",.6,0,"Bende di Khem","Le bende delle mummie sono intrise di resine rarissime. Me ne servono 5.",140,100,0},
{"b3",Q_COL,E4("golem_cr",0,0,0),5,8,"Minerale cristallino",.6,0,"Acciaio di cristallo","Il minerale dei golem delle Caverne di Cristallo è il migliore per le lame.",260,190,0},
{"b4",Q_COL,E4("golem_magma",0,0,0),4,10,"Nucleo di magma",.6,0,"Il cuore della forgia","Un nucleo di magma tiene accesa una forgia per un secolo. Portamene 4.",340,260,0},
{"l1",Q_KILL,E4("scheletro","zombie",0,0),12,3,0,0,0,"Pace ai defunti","Nella Cripta Dimenticata i morti si sono risvegliati. Dai pace a 12 di loro.",130,100,0},
{"l2",Q_BOSS,E4("necromante",0,0,0),1,4,0,0,0,"La Necromante","Velka, una necromante, controlla la Cripta. Fermala nel suo piano più profondo.",320,240,0},
{"l3",Q_KILL,E4("ombra","cavaliere",0,0),10,14,0,0,0,"Ombre del Vuoto","Le creature del Vuoto corrompono la luce. Distruggine 10 nella Cittadella.",520,400,0},
{"g1",Q_KILL,E4("ratto",0,0,0),8,1,0,0,0,"Ratti giganti","I ratti giganti della Tana dei Goblin mi rubano le provviste. Eliminane 8.",50,40,0},
{"g2",Q_TALK,E4(0,0,0,0),1,0,0,0,"marcus","Consegna urgente","Porta questo barilotto di birra al Capitano Marcus, alla porta nord. Poi torna da me.",30,20,0},
{"g3",Q_TALK,E4(0,0,0,0),1,0,0,0,"borin","Boccale rotto","Il mio boccale preferito si è crepato. Portalo al Fabbro Borin perché lo ripari.",30,20,0},
{"g4",Q_KILL,E4("pipistrello",0,0,0),10,3,0,0,0,"Ali nella notte","I pipistrelli della Cripta escono di notte e spaventano i clienti. Eliminane 10.",110,80,0},
{"r1",Q_TALK,E4(0,0,0,0),1,0,0,0,"lia","Pane per il Tempio","Porteresti questo pane alla Sacerdotessa Lia, al Tempio? Torna pure da me dopo.",25,20,0},
{"r2",Q_TALK,E4(0,0,0,0),1,0,0,0,"nino","Il pranzo di Nino","Il Pescatore Nino dimentica sempre il pranzo. Portaglielo al molo del Porto.",25,20,0},
{"ge1",Q_COL,E4("scheletro",0,0,0),1,3,"Antico stendardo",.15,0,"Lo stendardo perduto","Il mio vecchio reggimento cadde nella Cripta. Uno scheletro porta ancora il nostro stendardo.",160,120,0},
{"ge2",Q_BOSS,E4("sfinge",0,0,0),1,6,0,0,0,"L'enigma della Sfinge","Da giovane non risposi all'enigma della Sfinge. Sconfiggila tu, nella Piramide di Khem.",420,300,0},
{"t1",Q_TALK,E4(0,0,0,0),1,0,0,0,"gatto","Il gatto scomparso","Il mio gatto Briciola è sparito! Forse si è nascosto in una casa del quartiere sud-ovest...",40,30,1},
{"t2",Q_KILL,E4("slime",0,0,0),5,0,0,0,0,"Proteggi Tommaso","Voglio vedere uno slime da vicino! Anzi no... sconfiggine 5 e raccontami com'è andata.",40,30,1},
{"n1",Q_KILL,E4("granchio",0,0,0),8,12,0,0,0,"Chele giganti","I granchi corazzati dell'Abisso hanno distrutto le mie reti. Eliminane 8.",420,320,0},
{"n2",Q_COL,E4("uomo_pesce",0,0,0),6,12,"Scaglie iridescenti",.6,0,"Scaglie preziose","Le scaglie degli uomini-pesce valgono una fortuna. Portamene 6.",440,330,0},
{"n3",Q_BOSS,E4("leviatano",0,0,0),1,12,0,0,0,"Il mostro dell'Abisso","Il Leviatano scuote il molo ogni notte. Scendi nell'Abisso e affrontalo.",800,600,0},
};
const int NQDEF=sizeof(QDEF)/sizeof(QDEF[0]);
int questIdx(const char*id){int i;for(i=0;i<NQDEF;i++)if(!strcmp(QDEF[i].id,id))return i;return -1;}

const ZoneDef ZDEF[]={
{"Aldoria, la Città",0,0,0},{"Foresta di Elmwood",1,0,1},{"Deserto di Khem",4,0,1},{"Picchi Gelidi",7,0,1},{"Porto di Aldoria",3,0,0},
{"Thalassa",12,0,0},{"Giungla di Smeraldo",13,0,1},{"Colosseo di Aldoria",0,0,0},
{"Castello di Aldoria",0,1,0},{"Taverna del Drago Ubriaco",0,1,0},{"Fucina di Borin",0,1,0},{"Bottega dell'Erborista",0,1,0},{"Tempio della Luce",0,1,0},{"Casa di Mamma Rosa",0,1,0},
{"Palazzo di Thalassa",0,1,0},{"Taverna della Sirena",0,1,0},{"Dungeon",0,0,0},
};
