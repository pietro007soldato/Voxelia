# Voxelia – Il Regno Perduto

**Un gioco di ruolo in grafica voxel isometrica, che gira nel browser e si gioca con mouse, tastiera o touch.**
Si gioca da soli o con gli amici. Si esplora la città di Aldoria e il regno intorno e si combatte nei dungeon. In
Tomorrow si fonda un regno proprio, e con l'editor **Voxelia Studio** si costruiscono mondi da far giocare agli altri.

**Versione attuale: 7.49.2** · [📖 Guida](#la-guida-completa) · [🎮 Come iniziare](#come-iniziare) ·
[⌨️ Comandi](#comandi) · [🖥 Server](#il-server-multigiocatore) · [🛠 Sviluppo](#sviluppo) ·
[📝 Novità (CHANGELOG)](CHANGELOG.md)

![Aldoria, la città](docs/aldoria.jpg)

> *Il Re Lich Malakar ha spezzato la Corona di Voxel in sei frammenti. Esplora Aldoria, accetta missioni, conquista i
> dungeon che rinascono a ogni vittoria e sfida gli altri eroi nel Colosseo.*

---

## La guida completa

> 📖 **[Il Codice di Aldoria, la guida completa di Voxelia](https://xvxvxvxvvxvxvvxvxv.github.io/Voxelia/)** (aggiornata alla 7.49.1)
> Questo README è il riassunto: dice cos'è il gioco, come si avvia e come è fatto il progetto. La guida spiega
> tutto, passo per passo: storia e vero finale, personaggi, missioni, dungeon, combattimento, Tomorrow e il tuo regno,
> Thalassa, mestieri, Voxelia Studio, il server e i plugin, con la mappa di Aldoria, le immagini del gioco e la ricerca.
> È un sito statico pubblicato con GitHub Pages dal ramo `gh-pages`.

Le novità di ogni versione, dalla più recente, sono in [CHANGELOG.md](CHANGELOG.md), e nel gioco nel menu **Novità**.

---

## Indice

| Per giocare | Il gioco | Il server | Il progetto |
|---|---|---|---|
| [In breve](#in-breve) | [La Modalità Storia](#la-modalità-storia) | [Il server multigiocatore](#il-server-multigiocatore) | [Struttura del progetto](#struttura-del-progetto) |
| [Come iniziare](#come-iniziare) | [Il combattimento](#il-combattimento) | [Il pannello admin](#il-pannello-admin) | [Sviluppo](#sviluppo) |
| [Comandi](#comandi) | [Il mondo di Aldoria](#il-mondo-di-aldoria) | [Plugin del server](#plugin-del-server) | [Versioni precedenti](#versioni-precedenti) |
| [Le modalità](#le-modalità) | [L'eroe e l'equipaggiamento](#leroe-e-lequipaggiamento) | [Pubblicare il server online](#pubblicare-il-server-online) | |
| [Impostazioni e salvataggi](#impostazioni-lingue-e-salvataggi) | [Cose da fare](#cose-da-fare) | | |
| | [Tomorrow](#tomorrow) | | |
| | [La vista 3D e la grafica](#la-vista-3d-e-la-grafica) | | |
| | [Musica](#musica) | | |
| | [Voxelia Studio](#voxelia-studio) e [Mondi della community](#mondi-della-community) | | |

---

## In breve

- **Un solo file.** Il gioco intero è `voxelia.html`: grafica, musica, testi e logica. Per giocare da soli non servono
  installazioni, librerie o connessione a internet.
- **Un regno grande**: 117 zone (81 interni da esplorare), 8 dungeon a più piani, 190 personaggi, 130 missioni, 78 tipi di
  nemici di cui 14 boss. Oltre il mare c'è un secondo regno, **Thalassa**.
- **Una storia raccontata da filmati** girati nei luoghi veri del gioco, con scelte che cambiano il finale.
- **Tomorrow**: un mondo senza confini, generato mentre cammini, dove conquisti terre, fondi città e fai la guerra
  con le fazioni, anche insieme agli altri giocatori.
- **Vista classica o vista 3D**, da alternare quando vuoi, con luce del sole, ombre, acqua che riflette e orizzonte.
- **70 brani scritti nota per nota**, più quelli procedurali, suonati in tempo reale dal sintetizzatore del gioco.
- **Multigiocatore** con un server Node.js **senza dipendenze**: stanze, chat, scambi, arena PvP, pannello admin e plugin.
- **Voxelia Studio**: un editor completo per creare mondi e **pubblicarli** sul server.
- **Su ogni schermo**: computer, telefoni e tablet (comandi touch) e Meta Quest (realtà virtuale).
- In **italiano**, con l'interfaccia anche in inglese e in eldoriano, la lingua antica del regno.

---

## Come iniziare

### Da soli, nel browser
1. Scarica o apri `voxelia.html` con un browser recente (Chrome, Edge, Firefox, Safari).
2. Nel menu, la Corona di Voxel, scegli la gemma **Modalità Storia**, crea l'eroe e scegli la difficoltà.

La partita si salva da sola nel browser. Il gioco funziona anche offline.

### Con gli amici
Serve [Node.js](https://nodejs.org) 16 o più recente:

```sh
node server.js
```

Il server chiede la password del pannello admin (oppure la legge da `ADMIN_PASSWORD`) e stampa gli indirizzi da aprire,
per esempio `http://192.168.1.20:3000`. Chi scrive lo **stesso codice stanza** nel menu (campo «Stanza») gioca insieme;
con il campo vuoto si gioca da soli.

Per giocare con amici su reti diverse si usa un tunnel (per esempio `cloudflared tunnel --url http://localhost:3000`)
oppure si pubblica il server: vedi [Pubblicare il server online](#pubblicare-il-server-online).

---

## Comandi

### Tastiera e mouse

| Tasto | Azione |
|---|---|
| Clic sul terreno, **W A S D** o frecce | Muoversi |
| Clic su nemici, forzieri, oggetti, personaggi | Attaccare (se il nemico è lontano l'eroe ci va prima), aprire, raccogliere, parlare |
| **R** | Interagire con ciò che hai vicino |
| **Spazio** o **X** | Attacco: ogni pressione fa la mossa seguente della catena; tenuto premuto, il colpo caricato |
| **Maiusc** | Capriola (premuto e lasciato) · corsa (tenuto mentre ti muovi) |
| **E** | Capriola |
| **F** | Affondo (diverso per ogni arma) |
| **1 2 3 4** | Abilità delle arti marziali |
| **Q** | Bere una pozione |
| **Tab** | Blocca il bersaglio · passa al nemico dopo |
| **Z** | Domare il mostro indebolito più vicino |
| **H** | Montare o smontare da cavallo |
| **I** · **J** · **K** | Zaino · Missioni · Diario |
| **L** · **P** | Classifica · Giocatori |
| **M** | Mappa (in Tomorrow, la mappa del mondo) |
| **N** | I compagni (la stalla) |
| **C** | Aspetto dell'eroe |
| **O** | Opzioni |
| **V** | Ruota delle azioni (il tasto si può cambiare) · nel tuo borgo o nella tua casa, l'editor |
| **B** | Vista classica o vista 3D |
| **F8** | Modalità foto |
| **F9** | Pannello sviluppatore (sui server solo con la password admin) |
| **Invio** | Chat |
| **Esc** | Chiude la finestra aperta; con niente di aperto, il menu di pausa |
| Rotella del mouse | Zoom (in 3D avvicina la telecamera) |
| Tasto destro del mouse, trascinando | In 3D, gira la telecamera |

**Solo in Tomorrow:** **U** territorio, conquista e insediamenti · **Y** fazioni · **T** accamparsi · **G** gemme del
teletrasporto.

Ogni tasto apre e chiude la sua finestra, e si apre una finestra alla volta.

### Telefoni e tablet
Sui dispositivi touch compaiono il **joystick** (in basso a sinistra, parte dal punto in cui tocchi), i pulsanti
**Colpo**, **Affondo**, **Schiva**, **Pozione** e le abilità, il pulsante verde **usa** quando c'è qualcosa vicino e il
**Menu** a griglia con tutte le finestre. Lo zoom si fa con due dita. I comandi si adattano da soli a telefoni,
pieghevoli e tablet, e si spostano e ridimensionano con l'**editor dell'HUD** (Impostazioni → Interfaccia).

### Meta Quest (realtà virtuale)
Nel browser del Quest compare il pulsante **Entra in VR**. Si gioca **in prima persona**, a grandezza naturale, con
l'arma in mano: si attacca muovendo il controller. Durante filmati e minigiochi si torna da soli a uno schermo sospeso.
La pagina deve essere aperta da un indirizzo **https** (o da `localhost`): vedi [Giocare dal Meta Quest](#giocare-dal-meta-quest).

<details>
<summary><b>I comandi dei controller</b></summary>

**Schermo sospeso**

| Comando | Controller |
|---|---|
| Puntare e cliccare / scorrere una finestra | Raggio del controller + grilletto / levetta destra su e giù |
| Muoversi | Levetta sinistra |
| Zoom | Levetta destra (avanti e indietro) |
| Interagire (R) / Schivata (o chiudi finestra) | A / B |
| Pozione / Zaino | X / Y |
| Colpo ad area / Affondo | Impugnatura sinistra / destra |
| Mappa / Rimettere lo schermo davanti | Premere la levetta sinistra / destra |

**Prima persona**

| Comando | Controller |
|---|---|
| Attaccare | Fendente con il controller destro · grilletto destro (nemico davanti) |
| Affondo / Colpo ad area | Stoccata in avanti · impugnatura destra / le due mani giù insieme · impugnatura sinistra |
| Camminare / Girarsi | Levetta sinistra (si cammina dove guardi, o davvero nella stanza) / levetta destra |
| Interagire / Schivata o chiudi | A, o grilletto puntato su una persona, porta o oggetto / B |
| Pozione / Zaino / Mappa | X / Y / premere la levetta sinistra |
| Menu della VR | Grilletto sinistro puntato nel vuoto: prima persona sì/no, rotazione, vignetta, distanza di visuale, velocità, altezza degli occhi |

</details>

---

## Le modalità

![Il menu](docs/menu.jpg)

Il menu è la **Corona di Voxel** in 3D: ogni gemma porta a una modalità.

| Gemma | Modalità | Che cos'è |
|---|---|---|
| Rubino | **Modalità Storia** | Il Regno Perduto: l'avventura principale, con quattro difficoltà. |
| Smeraldo | **Tomorrow** | Un mondo senza confini, mille anni dopo Aldoria, con un eroe e un salvataggio suoi. |
| Ametista | **Parco giochi · Voxelia Studio** | L'editor per costruire e giocare i propri mondi. |
| Topazio | **Mondi della community** | I mondi pubblicati dagli altri giocatori sul server: si giocano, si votano, si commentano. |
| Diamante | **Prologo e filmati** | Il prologo e le scene della storia già viste. Sul server anche le [versioni precedenti](#versioni-precedenti). |
| Zaffiro | **Voxelia Dimension** | Un viaggio attraverso le epoche. Per ora è sigillata: si apre solo dal pannello sviluppatore. |

---

## La Modalità Storia

Re Aldric affida all'eroe la missione di ritrovare i **sei frammenti della Corona di Voxel**, custoditi dai signori dei
dungeon. Poi c'è la **Cittadella del Vuoto**, dove aspetta il Re Lich Malakar. Aldoria nasconde anche segreti, pagine di
diario, un quartiere murato e più di un finale: il vero finale si conquista sotto Aldoria Vecchia, contro l'**Abominio**,
in una battaglia in cinque fasi.

- **Filmati** girati nei luoghi veri del gioco, con i personaggi e l'eroe con il suo equipaggiamento. Il **prologo**
  racconta in quattordici scene la storia della Corona. Ogni filmato si salta con «Salta» e si rivede dal menu.
- **Le scelte**: i boss dei dungeon si arrendono e tu decidi se risparmiarli o finirli. La tua via (misericordia, spada o
  equilibrio) cambia i prezzi, gli alleati e l'epilogo. Ogni giorno il Viandante in piazza porta un dilemma.
- **Thalassa**, il regno oltre il mare: dal livello 10 la Capitana Marina, al Porto, ci porta l'eroe. È un capitolo
  nuovo, con la Giungla di Smeraldo, i Sigilli di Giada, il Tempio di Quetzal, le Tavolette di Giada e il mistero della
  Perla.

### Difficoltà

| Difficoltà | Nemici | Bottino | Quando si cade |
|---|---|---|---|
| **Facile** | vita −30%, danni −40% | più ricco | si rinasce in città |
| **Normale** | equilibrati | normale | si rinasce in città perdendo il 15% dell'oro |
| **Difficile** | vita +50%, danni +40% | meno ricco | si rinasce in città perdendo il 25% dell'oro |
| **Incubo** | vita ×2,2, danni ×2 | povero | **morte permanente**: il salvataggio viene cancellato |

In ogni difficoltà i nemici attaccano **in branco** e compaiono i **Campioni**, nemici più grossi con un alone dorato e
un bottino sicuro. I boss combattono in **tre fasi**, hanno un **punto debole** che li stordisce e sotto un quarto della
vita entrano nell'**ultima furia**. I mondi di Voxelia Studio tengono l'equilibrio scelto dal loro autore.

---

## Il combattimento

Si combatte cliccando dove si vuole colpire: l'eroe si gira verso il cursore e fa la mossa della sua arma. Un clic su un
nemico lontano fa camminare l'eroe fino a lui e poi attaccare. Il combattimento classico si riattiva in
Impostazioni → Comandi.

- **Catene e colpi caricati.** Ogni pressione fa la mossa seguente della catena di tre colpi; premere di nuovo appena la
  mossa finisce dà un **colpo perfetto** (+30%). Tenendo premuto si carica il colpo pesante.
- **Stamina.** Attacchi, capriole e corsa la consumano e si ricarica da sola (il massimo è 100 più il livello, fino a
  160). A zero si resta **senza fiato**: niente attacchi, capriole o corsa finché non torna al 30%.
- **Bersaglio** (Tab): l'eroe guarda sempre il nemico bloccato e ogni colpo va su di lui.
- **Armi che crescono**: con l'uso prendono un nome e una mossa speciale. La **maestria** di ogni tipo d'arma sale fino
  a ★10 (+4% di danno per livello).
- **Domare i mostri**: un mostro sotto un terzo della vita si doma con un **Sigillo di doma** (tasto Z; i boss no). I
  compagni (tasto N, fino a 12 nella stalla) combattono al tuo fianco, crescono, si evolvono ai livelli 10 e 20 e si
  possono incrociare per far nascere specie nuove.

<details>
<summary><b>Le mosse di ogni arma</b></summary>

| Arma | Catena | Colpo caricato | Affondo (F) |
|---|---|---|---|
| Pugnale, stocco | Taglio · Rovescio · Doppia pugnalata (sanguinamento) | Danza delle lame | Fendente rapido · Affondo di stocco |
| Spada | Fendente · Montante · Colpo del cavaliere (spinge lontano) | Turbine | Affondo |
| Ascia | Fendente pesante · Rovescio · Spaccascudi (+30% danni) | Salto del boia | Fendente |
| Martello, mazza | Colpo · Montante · Schianto (stordisce) | Terremoto | Schianto |
| Lancia | Stoccata · Stoccata alta · Spazzata | Carica | Stoccata |
| Tridente | Affondo · Affondo · Tre punte (tira a te) | Maremoto | Stoccata |
| Bastone, scettro | Dardo arcano · Dardo arcano · Catena di fulmini | Nova arcana | Colpo di bastone |
| Falce | Mietitura · Rovescio · Raccolto (ruba vita) | Danza della morte | Falciata |

Le mosse sono scritte anche nella scheda dell'arma, nello zaino. Le **arti marziali** del Maestro Dino, in caserma (tasti
1–4), sono il Palmo del Drago (livello 3), il Calcio del Tornado (5), il Passo dell'Ombra (8) e il Respiro della Tigre (10).

</details>

---

## Il mondo di Aldoria

![La Taverna del Drago Ubriaco](docs/taverna.jpg)

- **Aldoria, la città**: la piazza con la fontana e il mercato, il castello del Re, la biblioteca, la taverna, le
  botteghe, il tempio, il casinò, il motel, la caserma, la banca, la Torre della Corona e decine di case da visitare.
- **I quartieri**: Aldoria Nord (il Quartiere Nobile), Aldoria Est (Campi e Mestieri), il **Porto**, il **Borgo delle
  Ceneri** con le rovine di Aldoria Vecchia, e il **Colosseo** con l'arena PvP.
- **Il tempo**: un giorno di gioco dura 24 minuti. Di giorno i cittadini sono in giro, di sera tornano a casa e di notte
  restano le guardie (e l'esperienza vale il 20% in più). Ogni mezz'ora c'è un **evento del mondo**: un drago, una
  meteora o un mercante raro.

### Fuori dalle mura

| Zona | Livello | Boss | Da vedere |
|---|---|---|---|
| Foresta di Elmwood | 1 | Troll della Foresta | radura delle lucciole, cerchio di pietre, capanna del Cacciatore, Grande Quercia |
| Deserto di Khem | 4 | Faraone Eterno | oasi del Mercante Amir, Piramide con la Sfinge, città sepolta, necropoli |
| Picchi Gelidi | 7 | Drago di Brina | rifugio di Ilva, villaggio congelato, lago ghiacciato, grotte di cristallo |

### I dungeon
I dungeon cambiano forma a ogni discesa e **rinascono a ogni vittoria**, più forti e più ricchi. Nei piani ci sono
forzieri, pagine di diario, **falò** e la scala che si apre tirando **due leve insieme**. Prima di entrare si possono
scegliere **maledizioni** che rendono il dungeon più duro e il bottino più ricco.

| Dungeon | Ingresso | Livello | Piani | Boss |
|---|---|---|---|---|
| Tana dei Goblin | Foresta di Elmwood | 2 | 2 | Re Goblin Grugnak |
| Cripta Dimenticata | Borgo delle Ceneri | 4 | 3 | Necromante Velka |
| Piramide di Khem | Deserto di Khem | 6 | 3 | Sfinge Antica |
| Caverne di Cristallo | Picchi Gelidi | 8 | 3 | Regina dei Ragni |
| Fucina Infernale | Picchi Gelidi | 10 | 3 | Signore della Fiamma Ignis |
| Abisso Sommerso | Porto (pozzo delle alghe) | 12 | 3 | Leviatano |
| Tempio di Giada | Giungla di Smeraldo (Thalassa) | 14 | 3 | Quetzal, il Serpente di Giada |
| Cittadella del Vuoto | Castello di Aldoria | 15 | 4 | Re Lich Malakar |

![Nella Cripta Dimenticata](docs/dungeon.jpg)

La **Torre della Corona** è la sfida del giorno: piani costruiti a caso, uguali per tutti e sempre più difficili, con le
benedizioni e la classifica del plugin Torre.

### Il mare
- **Battaglia navale** contro la *Vedova Nera* del Capitano Scarlatto, con cannonate e arrembaggio.
- **La tua nave**: si progetta al Cantiere Navale e dal molo si salpa verso isole sempre nuove.
- **Immersioni** dalla Boa dei tuffatori, sul fondo del mare con l'ossigeno contato.
- **I campi di battaglia di Ryan il Pelato**: cinque battaglie in cui si comanda un esercito.

---

## L'eroe e l'equipaggiamento

- **Aspetto** (tasto C): pelle, capelli, occhi, barba, vestiti, mantello e corporatura.
- **Quattro posti**: arma, elmo, corazza e scudo. Ogni oggetto si vede addosso all'eroe, con lo stesso modello
  dell'icona nello zaino.
- **Rarità**: Comune, Raro, Epico, Leggendario e Arena. I boss lasciano anche **oggetti unici**.
- **Fucina di Borin**: set completi, forgia di oggetti rari ed epici e potenziamento fino a **+5**.
- **Zaini** da 24 fino a 48 posti. Gli oggetti si bloccano, si gettano, si vendono o si distruggono.
- **Pozioni** (tasto Q): ognuna ridà il 35% della vita, con 2,5 secondi tra un sorso e l'altro.

![Icone dello zaino e oggetti indossati](docs/equipaggiamento.png)

---

## Cose da fare

| | |
|---|---|
| **Missioni** | 130 missioni ad Aldoria (punto esclamativo giallo), più il capitolo di Thalassa |
| **Pesca** | 25 specie dal molo e dalla barca, con la gara di pesca del plugin |
| **Mestieri** | Alla Bottega dei mestieri si cucina, si fanno pozioni e si forgia; le ricette si scoprono provando gli ingredienti |
| **Cavalli** | Allo Stallo dei Campi, con la corsa a cavallo |
| **Carte** | Il duello delle carte elementali in taverna, con i personaggi di Aldoria |
| **Animali** | Un amico dal Negozio degli animali che ti segue e scava per te |
| **Scavare** | Con la pala si trovano tesori sepolti e grotte segrete |
| **Casinò e motel** | Slot, dadi, roulette e blackjack; una stanza con il letto per dormire (e sognare) |
| **Foto** | Modalità foto (F8) con pose, filtri e cornice |
| **Scoperte** | Il diario di luoghi, creature, risorse, pesci e isole, con i premi |
| **Classifiche** | Ogni settimana pesca, Colosseo, dungeon e città premiano i primi tre con titoli e mantelli |

---

## Tomorrow

Mille anni dopo Aldoria la Corona è distrutta e il mondo si è ricomposto in terre nuove. Tomorrow ha un eroe e un
salvataggio suoi: la partita della Storia non viene toccata.

### Un mondo che non finisce
- Il mondo è fatto di **regioni** generate mentre cammini, con cinque biomi (prati, boschi, deserti, vette innevate, lande
  di cenere), fiumi e sentieri che continuano da una regione all'altra.
- **Villaggi e città** con strade, piazza, mercato, case in cui si entra e gente che segue le sue abitudini.
- **Dungeon** con nome proprio e un boss con abilità mescolate; **mostri sempre diversi**, più forti man mano che ti
  allontani. Il livello non ha limite.
- **Mappa del mondo** (M), **campo** (T) per riposare e cucinare, **gemme del teletrasporto** (G) e la Pietra del viaggio.
- **Meteo e stagioni** che cambiano i raccolti e i viaggi.

### Contratti, oggetti unici e scambi
- **La Bacheca dei Contratti** in ogni villaggio propone ogni giorno contratti nuovi e unici (taglie, infestazioni,
  spedizioni, reliquie, assedi, messaggi, battaglie), con bersagli con nome, patti che alzano la posta, stelle e la
  reputazione con sei fazioni.
- **Oggetti unici**: ogni oggetto nasce da un seme che decide forma, rarità, qualità, poteri, nome, storia e numero di
  serie. Negli scambi viaggia solo il seme, così un oggetto non si può gonfiare a mano.
- **Scambi** fra eroi di unici, reperti, oro e pozioni, con la **provenienza** di ogni oggetto.
- **La Bacheca delle missioni** (plugin Bacheca): consegne e cacce che i giocatori si danno tra loro.

### Il tuo regno

| | |
|---|---|
| **Conquista** (U) | Pianta lo stendardo in una regione selvaggia e abbatti i suoi mostri: al 100% la regione è tua |
| **Città** | Fino a 8 città, ognuna fino al livello 15, con edifici, tesoro, abitanti, tasse ed esercito; si riparte dalla capitale |
| **Editor del borgo** (V) | Sposta e costruisci edifici, case, strade, piazze, mura, arredi e cubi a blocchi; edifici su misura |
| **Risorse** | Legna, pietra, argilla e ferro dalle terre selvagge, da Segheria, Cava e **Miniera** (dove si scava a mano) |
| **Cittadini** | Mangiano, bevono, vogliono lavoro e felicità: se mancano se ne vanno o protestano |
| **Esercito** | La Caserma addestra i soldati che difendono le terre e combattono con te |
| **La tua casa** | Il deposito, gli interni da arredare, la lavagna dei messaggi e la mensola dei trofei |
| **Carovane** | Portano merci alle tue città o ai villaggi; i banditi le possono assaltare |
| **Fazioni** (Y) | Sei fazioni con stemma e terre; ti unisci a una o fondi la tua. In rete la fazione costruisce una città comune |
| **Guerre** | Le fazioni assaltano le tue terre e si dichiarano guerra, con assedi a orario (plugin Territori e Fazioni) |

---

## La vista 3D e la grafica

Si passa dalla vista classica alla vista 3D in qualsiasi momento con il tasto **B**, con il pulsante **3D** o dal menu
di pausa.

- **Telecamera** dietro l'eroe: si gira con il tasto destro (o due dita) e si avvicina con la rotellina (o il pizzico).
  Muri e alberi davanti all'eroe diventano trasparenti.
- **Luce e materiali**: il sole segue l'ora, con ombre, stelle di notte e torce che illuminano davvero. L'acqua riflette
  il cielo e l'orizzonte arriva fino alle montagne. Lo stile è voxel (cubi a spigoli netti) o liscio.
- **Opzioni** (Impostazioni → Vista 3D e → Grafica): dettaglio, ombre, erba, orizzonte, campo visivo, nebbia,
  risoluzione interna con upscaling e nitidezza in stile FSR. Se il gioco rallenta, la risoluzione scende da sola.
- Nei filmati, nella pesca, nella navigazione e nell'editor si torna da soli alla vista classica. Serve WebGL 2.

---

## Musica

Tutta la musica è generata in tempo reale dal sintetizzatore del gioco (Web Audio): **70 brani scritti** nota per nota,
con melodia, accordi, basso, accompagnamento e batteria, e brani procedurali per le zone speciali. Ogni zona e ogni
edificio di Aldoria ha il suo brano: la taverna balla una giga, la fucina batte sull'incudine, il tempio canta in coro.
Gli strumenti sono 19. La musica si sceglie dalle Impostazioni o dal menu di pausa: automatica, un brano fisso, la radio o
spenta.

---

## Voxelia Studio

![Voxelia Studio](docs/studio.jpg)

Il **Parco giochi** è un editor per creare avventure con gli stessi blocchi, arredi, personaggi, nemici e musiche del
gioco, provarle al volo (**▶ Prova**) e giocarle dall'inizio alla fine.

- **Mappe** da 16×16 a 96×96, collegate da porte, con 14 modelli di partenza.
- **Personaggi** con dialoghi a nodi, mestieri e passeggiate; **missioni**, **oggetti e armi** con effetti speciali.
- **Eventi** con variabili, condizioni e 26 azioni; **compositore di brani**; **cinematiche**.
- **Controllo del mondo** (🩺): trova porte senza destinazione, missioni impossibili e oggetti irraggiungibili.
- I mondi si salvano nel browser e si **esportano** in un file `.voxelia.json`. C'è un mondo di esempio, «La Valle di
  Pratofiorito».

## Mondi della community

Con un server, i mondi di Voxelia Studio si **pubblicano** (pulsante **Pubblica** nell'editor) e compaiono nel browser
dei mondi: in evidenza, di tendenza, più votati e più giocati, con ricerca, filtri, galleria, stelle, recensioni e
commenti. Gli admin possono nascondere mondi, rispondere alle segnalazioni e bloccare gli autori.

---

## Impostazioni, lingue e salvataggi

- **Impostazioni** in 8 categorie: Generale, Audio, Grafica, Prestazioni, Animazioni, Interfaccia, Comandi e Cursore,
  più la Vista 3D.
- **Lingue**: italiano; **English** (menu, comandi e impostazioni; dialoghi e missioni restano in italiano);
  **eldoriano**, la lingua antica del regno.
- **Salvataggi**: tutto resta nel browser (`localStorage`): la partita, Tomorrow a parte, le impostazioni, l'aspetto
  dell'eroe, i mondi di Voxelia Studio e i filmati già visti. Il salvataggio si aggiorna da solo, anche chiudendo la
  pagina, e resta compatibile da una versione all'altra.

---

## Versioni precedenti

La cartella [`releases/`](releases/) contiene le build pubblicate, dalla 4.5 a oggi, con l'elenco in
[`releases/LEGGIMI.md`](releases/LEGGIMI.md).

Sul server si giocano anche dal menu: pulsante **Versioni precedenti** o gemma Diamante. Ogni versione vecchia si apre
da `/versioni/<versione>/` con due garanzie:
- **solo da soli**: niente chat, arena, scambi, mondi della community o plugin (il browser le vieta ogni connessione);
- **salvataggi separati**: ogni versione scrive in una sua parte del salvataggio e non tocca la partita attuale.

---

## Il server multigiocatore

`server.js` è un solo file per Node.js 16+ **senza dipendenze npm**. Serve il gioco e il pannello admin, tiene le
**stanze** (chi scrive lo stesso codice gioca insieme), la **chat** con i link cliccabili, gli **scambi**, l'**arena
PvP** con il suo negozio, la **classifica**, i **cicli dei dungeon** e l'**orologio del mondo** condivisi, i **nemici
condivisi** (tutti vedono gli stessi), i **Mondi della community** e i **plugin**.

### Variabili d'ambiente

| Variabile | Predefinito | A cosa serve |
|---|---|---|
| `PORT` | `3000` | Porta HTTP e WebSocket |
| `ADMIN_PASSWORD` | (chiesta all'avvio) | Password del pannello admin. Senza terminale ne viene generata una e stampata nel registro. |
| `TLS_CERT` / `TLS_KEY` | (nessuno) | Certificato e chiave PEM: il server parla **https** e i WebSocket passano in **wss** |
| `DATA_FILE` | `voxelia-data.json` | Classifica, punti arena, cicli dei dungeon, impostazioni, ban, dati dei plugin |
| `MONDI_DIR` | `mondi/` | Cartella dei mondi pubblicati |
| `PLUGINS_DIR` | `plugins/` | Cartella dei plugin |

### Il pannello admin
Si apre su `http://indirizzo:porta/admin`.

| Pagina | Cosa fa |
|---|---|
| **Panoramica** | Stato del server |
| **Giocatori** | Lista dei giocatori, con cura, teletrasporto ed espulsione |
| **Stanze** | Stanze aperte e dungeon |
| **Chat** | Chat e annunci |
| **Classifica** | La classifica |
| **Ban e silenzi** | Ban e silenzi |
| **Impostazioni** | Massimo di giocatori, stanze chiuse, PvP, scambi e chat, messaggio del giorno, moltiplicatori, mondi della community |
| **Registro** | Il registro degli eventi |
| **Plugin** | Plugin accesi e spenti, errori, comandi e pagine |
| **Mondi** | Moderazione dei mondi pubblicati |
| **Server** | Memoria, carico e backup dei dati |

**Il pannello sviluppatore sui server** è solo per gli admin: il pulsante 🛠 non si vede, e F9 (o `#dev` in fondo
all'indirizzo) chiede la password admin, che controlla il server. Ogni azione finisce nel registro del pannello admin.
Aprendo `voxelia.html` dal disco il pannello resta quello di sempre.

### Giocare dal Meta Quest
Il Quest offre la realtà virtuale solo su pagine **https** o su `localhost`.

<details>
<summary><b>Tre modi per avere l'https</b></summary>

1. **Server online o tunnel** (la più semplice). Sul server pubblicato l'https c'è già. In casa basta un tunnel, poi si
   apre sul Quest l'indirizzo `https://` che stampa:
   ```sh
   cloudflared tunnel --url http://localhost:3000
   # oppure: ngrok http 3000
   ```
2. **HTTPS dal server, in rete locale.** Crea un certificato per l'indirizzo del PC e avvia il server con `TLS_CERT` e
   `TLS_KEY`:
   ```sh
   # con mkcert
   mkcert 192.168.1.20 localhost
   TLS_CERT=192.168.1.20+1.pem TLS_KEY=192.168.1.20+1-key.pem node server.js
   # oppure autofirmato con openssl
   openssl req -x509 -newkey rsa:2048 -nodes -days 365 -keyout key.pem -out cert.pem \
     -subj /CN=192.168.1.20 -addext "subjectAltName=IP:192.168.1.20,DNS:localhost"
   TLS_CERT=cert.pem TLS_KEY=key.pem node server.js
   ```
   Sul Quest apri `https://192.168.1.20:3000` e accetta il certificato (**Avanzate → Procedi**).
3. **Cavo USB con `adb reverse`** (con la modalità sviluppatore del Quest attiva):
   ```sh
   adb reverse tcp:3000 tcp:3000
   ```
   Poi sul Quest apri `http://localhost:3000`.

</details>

---

## Plugin del server

I plugin sono file `.js` nella cartella `plugins/`. Si caricano all'avvio o con **Plugin → Ricarica** nel pannello admin,
e si accendono e spengono senza riavviare. Come scriverne uno è spiegato in [plugins/LEGGIMI.md](plugins/LEGGIMI.md); le
loro versioni sono in [plugins/CHANGELOG.md](plugins/CHANGELOG.md).

> ⚠️ Un plugin è codice che gira sul server con tutti i permessi: installa solo plugin di cui ti fidi.

<details>
<summary><b>I 29 plugin inclusi</b></summary>

| Plugin | Cosa fa |
|---|---|
| **Albo degli eroi** (`albo.js`) | Pagina web con la scheda di ogni eroe e il comando `/albo` |
| **Bacheca** (`bacheca.js`) | Le missioni dei giocatori di Tomorrow: consegne e cacce con un premio in oro (`/bacheca`) |
| **Boss del mondo** (`boss.js`) | Un boss enorme da affrontare tutti insieme, con premi in base al contributo (`/boss`) |
| **Case** (`housing.js`) | Una casa per ogni eroe da arredare, con deposito, pet e il Borgo delle Case (`/casa`) |
| **Caccia al tesoro** (`tesoro.js`) | Un tesoro nascosto in città con indizi a tappe (`/tesoro`) |
| **Classifiche** (`classifiche.js`) | Le classifiche della settimana con titoli e mantelli (`/classifiche`) |
| **Discoteca** (`discoteca.js`) | Una discoteca con DJ, brani da YouTube e SoundCloud, coda, voti e luci (`/discoteca`) |
| **Emote e fumetti** (`emote.js`) | Emote con il fumetto sopra la testa (`/saluta`, `/ridi`, `/balla`…) e la ruota delle emote |
| **Esempio** (`esempio.js`) | Un plugin di prova da cui partire |
| **Fazioni** (`fazioni.js`) | Le fazioni dei giocatori di Tomorrow: ruoli, permessi, città comune, guerre e assedi (`/fazione`) |
| **Foto** (`foto.js`) | La Galleria del server per le foto della modalità foto (`/foto`) |
| **Gara di pesca** (`pesca.js`) | Albo dei record, gare a tempo e annunci dei pesci leggendari |
| **Gruppi d'avventura** (`gruppi.js`) | Gruppi fino a 4 eroi con chat, esperienza e oro condivisi (`/gruppo`) |
| **Guardiano** (`guardiano.js`) | Riconosce oro, livelli e oggetti ottenuti con trucchi, con una pagina admin delle prove |
| **Guardie e ladri** (`guardieladri.js`) | Nascondino a squadre in un quartiere (`/guardie`) |
| **Lavagna** (`lavagna.js`) | La lavagna dei messaggi nelle case, con i coinquilini (`/lavagna`) |
| **Mercatino di Aldoria** (`mercato.js`) | Compravendita di oggetti tra giocatori, anche offline (`/mercato`) |
| **Notti di caccia** (`notti.js`) | Eventi notturni con esperienza moltiplicata e gara a punti (`/evento`) |
| **Posta e amici** (`posta.js`) | Messaggi per chi è offline (`/posta`) e avvisi sugli amici (`/amici`) |
| **Premio giornaliero** (`giornaliero.js`) | Un premio al giorno, più ricco giorno dopo giorno (`/giornaliero`) |
| **Ritorno ad Aldoria** (`hub.js`) | `/hub` riporta ad Aldoria da qualunque zona |
| **Il Sindaco di Aldoria** (`sindaco.js`) | Elezione settimanale del sindaco e decreti (`/vota`, `/sindaco`) |
| **Speedrun dei dungeon** (`speedrun.js`) | Cronometro, classifiche, record e sfida della settimana (`/speedrun`) |
| **Stress test** (`stress.js`) | Bot finti che giocano sul server per misurare latenza, memoria ed errori |
| **Taglie del giorno** (`taglie.js`) | Nuove taglie ogni giorno (`/taglie`) |
| **Teletrasporto** (`tpa.js`) | `/tpa <nome>` per raggiungere un altro eroe, se accetta |
| **Territori** (`territori.js`) | Le terre di Tomorrow condivise: assedi, saccheggi e cronaca (`/terre`) |
| **Torneo dell'arena** (`torneo.js`) | Tornei a eliminazione diretta nel Colosseo, con tabellone e premi |
| **Torre** (`torre.js`) | Classifica del giorno della Torre della Corona: piani superati e tempo (`/torre`) |

</details>

---

## Pubblicare il server online

### Docker
Il `Dockerfile` crea un'immagine con server, gioco, versioni precedenti, pannello admin e plugin (da `node:20-alpine`,
con un utente non root e un controllo di salute). I dati persistenti stanno in `/data`.

```sh
docker build -t voxelia .
docker run -d -p 3000:3000 -e ADMIN_PASSWORD='la-tua-password' -v voxelia-data:/data --name voxelia voxelia
```

### Docker Compose
`docker-compose.yml` avvia l'immagine pubblicata su GitHub Container Registry (`ghcr.io/xvxvxvxvvxvxvvxvxv/voxelia`):

```sh
ADMIN_PASSWORD='la-tua-password' docker compose up -d
```

L'immagine la pubblica il workflow `.github/workflows/docker.yml` a ogni push su `main`, con l'etichetta della versione
del gioco e `latest`. Per l'https dal container, metti `cert.pem` e `key.pem` in `certs/` e togli i commenti alle righe
`TLS_CERT`, `TLS_KEY` e `./certs` in `docker-compose.yml`.

### Suga
Il server ufficiale gira su [Suga](https://suga.app). Il container si costruisce **da questo repository** a ogni push
su `main`, con un endpoint HTTPS sulla porta 3000, un volume su `/data` e `ADMIN_PASSWORD` come variabile sensibile.
Dopo il push la nuova versione è online in un paio di minuti, e nel registro compare
`Voxelia <versione> in ascolto sulla porta 3000`.

---

## Struttura del progetto

```
voxelia.html            il gioco completo, generato da build.sh (non si modifica a mano)
server.js               server multigiocatore, pannello admin, plugin, mondi e versioni precedenti
admin.html              interfaccia del pannello admin
build.sh                unisce i sorgenti in voxelia.html
CHANGELOG.md            tutte le modifiche, dalla più recente (finisce anche dentro il gioco)
src/                    i sorgenti del gioco
plugins/                plugin del server (con LEGGIMI.md e CHANGELOG.md)
releases/               le build delle versioni pubblicate, con l'elenco in LEGGIMI.md
docs/                   immagini di questo README
Dockerfile              immagine del server
docker-compose.yml      avvio con Docker Compose
.github/workflows/      pubblicazione dell'immagine su GitHub Container Registry
```

`build.sh` mette in fila `src/head.html` e i file `src/[numero]_*.js` in ordine alfabetico (`LC_ALL=C`, per cui
`75_tempo.js` viene prima di `7_net.js`). Tutto il codice condivide un unico ambito globale: i file successivi possono
estendere o sostituire le funzioni di quelli precedenti. Per questo i file nuovi si aggiungono in fondo, con un nome
che viene dopo gli altri (`8zzzu_…`, `8zzzv_…`).

<details>
<summary><b>Che cosa c'è in ogni file di <code>src/</code></b></summary>

**Le basi**

| File | Contenuto |
|---|---|
| `head.html` | Pagina, stili, menu e struttura dell'interfaccia |
| `1_core.js` | Utilità, proiezione isometrica, disegno delle scatole voxel, motore audio, versione (`GAME_VER`) |
| `2_data.js` | Modelli voxel, oggetti e rarità, nemici, zone, dungeon, personaggi, missioni, interni |
| `3_world.js` | Generazione del mondo: città, zone aperte, dungeon, interni, porte |
| `4_render.js` | Disegno del mondo e degli arredi, scene, pesca, battaglia navale, mappa, sogni, Dimension, traduzioni, icone |
| `4a_aldoria.js` | Aldoria più grande: edifici nuovi e arredi degli interni |
| `4b_fast.js` | Grafica più veloce: muri e arredi fermi disegnati una volta sola in fogli di sprite |
| `5_game.js` | Eroe, combattimento, bottino, missioni, interazioni, aggiornamento del mondo, salvataggio |
| `6_ui.js` | HUD, finestre (zaino, missioni, negozi, dialoghi, casinò…), impostazioni, novità |
| `75_tempo.js` | Giorno e notte |
| `76_icone.js` | Icone dell'HUD in pixel art |
| `77_scene.js` | Animazioni sceniche: inquadrature, iride, stendardi, oggetti che volano |
| `78_aspetto.js` | Aspetto dell'eroe, modelli dell'equipaggiamento indossato, ritratti |
| `79_hudedit.js` | Editor dell'HUD |
| `7_net.js` | Multigiocatore (WebSocket verso `server.js`), chat con i link |
| `8_main.js` | Menu, musiche scritte, storia, personaggi e routine della città, castello, battaglie, Voxelia Studio, abilità, ciclo principale e tastiera |
| `9_changelog.js` | Generato da `build.sh` a partire da `CHANGELOG.md`: non si modifica a mano |

**Storia, Aldoria e filmati**

| File | Contenuto |
|---|---|
| `8t_touch.js` | Comandi touch per telefoni e tablet |
| `8u_musiche.js` | Le canzoni degli edifici, gli strumenti e le batterie nuove |
| `8v_abominio.js` | Il vero finale: l'Abominio in cinque fasi, l'ombra della Regina Elara, lo scudo di Malakar |
| `8v_sfida.js` | La difficoltà della Modalità Storia: nemici più forti, branco, Campioni, ultima furia dei boss |
| `8w_icone.js` | Icone voxel in tutto il gioco |
| `8x_dev.js` | Pannello sviluppatore (sui server, con la password admin controllata dal server) |
| `8y_film.js` | Il motore dei filmati: luoghi veri, attori che camminano, telecamera, sottotitoli |
| `8y_film2.js` | I filmati della storia, della battaglia navale e di Voxelia Dimension |
| `8y_film3.js` | La scena del prologo sotto la città: gli strati della terra, il pozzo, l'Occhio |
| `8z_mondi.js` | Mondi della community: browser, schede e pubblicazione |
| `8za_mondo.js` | Arredi nuovi, il Colosseo vero (fuori e dentro) |
| `8zb_mappa.js` | La mappa della zona in cui ti trovi (tasto M) |
| `8zc_prova.js` | Pannello sviluppatore: prova di tutte le boss fight |
| `8zd_biomi.js` | Foresta, deserto e picchi: la pianta, i luoghi, le raccolte |
| `8zd_biomi2.js` | Come si disegnano i biomi, gli interni e i loro personaggi |
| `8ze_ricordo.js` | Il ricordo del Moreau: Aldoria Vecchia prima della nebbia |
| `8zj_citta.js` | «Le vie di Aldoria», il tema della città, e le sezioni dinamiche del motore dei brani |
| `8zr_caricamento.js` | Le schermate di caricamento e il filmato del viaggio con la gemma |
| `8zs_modelli.js` | I modelli con scheletro e animazioni dei boss e degli animali |
| `8zza_prologo.js` | Il prologo della Storia: le scene e le sue tre musiche |

**Realtà virtuale e vista 3D**

| File | Contenuto |
|---|---|
| `8zf_xr.js` | Realtà virtuale (WebXR) per Meta Quest: schermo sospeso, controller, levette |
| `8zg_xrui.js` | L'interfaccia HTML del gioco mostrata nel visore |
| `8zh_xr3d.js` | Il mondo in 3D sul tavolo (diorama) |
| `8zi_xrfp.js` | La prima persona: mondo a grandezza naturale, attacchi con i controller, pannelli fluttuanti |
| `8zm_3d.js` | La vista 3D in WebGL 2: luce, ombre, materiali, cielo, orizzonte, stile voxel o liscio, telecamera |
| `8zn_pausa.js` | Il menu di pausa e la sezione «Vista 3D» delle impostazioni |
| `8zzl_grafica.js` | L'acqua su un foglio a parte, la risoluzione dinamica, le opzioni grafiche e l'upscaling in stile FSR |

**Combattimento e compagni**

| File | Contenuto |
|---|---|
| `8zu_combattimento.js` | Catene di colpi, colpo perfetto, colpi caricati, mosse di ogni arma, pose dell'eroe |
| `8zv_domare.js` | Domare i mostri: sigilli, compagni, livelli ed evoluzioni, la stalla, il bestiario |
| `8zzg_azione.js` | Il combattimento d'azione: clic verso il cursore, stamina, capriola, corsa, blocco del bersaglio |
| `8zzu_boss.js` | I boss a tre fasi, con il punto debole e lo stordimento |
| `8zzv_leve.js` | Le due leve dei piani dei dungeon, da tirare insieme (anche in rete) |
| `8zzw_maledizioni.js` | Le maledizioni a scelta prima dei dungeon |
| `8zzx_armi.js` | Le armi che crescono (nome, mossa speciale) |
| `8zzy_torre.js` | La Torre della Corona, la sfida del giorno |
| `8zzz_scavo.js` | La pala, i tesori sepolti e le grotte segrete |

**Tomorrow**

| File | Contenuto |
|---|---|
| `8zk_unici.js` | Oggetti unici: generatore dal seme, poteri, scheda, provenienza; scambi |
| `8zl_aperto.js` | La base: menu, salvataggio a parte, Bacheca dei Contratti, bersagli, assedi, reputazione |
| `8zo_tomorrow.js` | Il mondo: regioni senza fine, biomi, villaggi, dungeon, specie, contratti, mappa, orizzonte 3D |
| `8zp_vivo.js` | Città, case con interni, abitanti, animali, santuari, il campo, le gemme, le battaglie |
| `8zq_mappa.js` | La mappa del mondo interattiva e le finestre dei contratti |
| `8zt_mondo.js` | Le regioni ricordate, il campo che resta, il pavimento a blocchi, i borghi |
| `8zw_regno.js` | Conquista, insediamento, fazioni con sedi, emissari e stemmi |
| `8zx_guerre.js` | Assalti delle fazioni, assedi e saccheggi fra giocatori (plugin Territori), la cronaca |
| `8zy_tw_film.js` | Il filmato del reset dell'universo, le sue musiche e i cimeli di Aldoria |
| `8zz_borghi.js` | Villaggi e città con strade, lotti, piazza, mercato e la gente con le sue abitudini |
| `8zzb_editborgo.js` | L'editor dell'insediamento |
| `8zzc_gestione.js` | Risorse, costi, Cisterna, Fattoria, Segheria, Cava, statistiche, cibo, acqua e abitanti |
| `8zzd_editor2.js` | L'editor completo: tutti i pavimenti, i muri e gli arredi, edifici su misura |
| `8zze_esercito.js` | La Caserma, i soldati, la potenza dell'esercito, le battaglie |
| `8zzf_miniere.js` | Le miniere: lo scavo a mano, i minerali, i reperti storici |
| `8zzh_casa.js` | La tua casa con il deposito, gli interni su misura e le mura del borgo |
| `8zzi_citta.js` | Più città (fino a 8), la capitale, i materiali a prezzi del giorno |
| `8zzj_legna.js` | Gli alberi da abbattere, il legno, la città fino al livello 15 |
| `8zzk_viaggio.js` | La Pietra del viaggio con tutti i luoghi con una gemma del teletrasporto |
| `8zzn_fazione.js` | Le fazioni dei giocatori (plugin Fazioni) |
| `8zzq_ordine.js` | La città che cresce in ordine e le mura sul perimetro |
| `8zzza_cittadini.js` | I bisogni dei cittadini (lavoro, felicità, tasse, proteste) |
| `8zzzb_meteo.js` | Meteo e stagioni, con effetti sui borghi e sullo schermo |
| `8zzzc_carovane.js` | Le carovane e gli assalti dei banditi |
| `8zzzd_blocchi.js` | Costruire a blocchi nell'editor del borgo |
| `8zzze_assedi.js` | Le guerre programmate fra le fazioni e gli assedi (plugin Fazioni) |
| `8zzzr_bacheca.js` | La bacheca delle missioni dei giocatori (plugin Bacheca) |

**Vita, mondo e sistemi**

| File | Contenuto |
|---|---|
| `8zzm_novita.js` | Il portale dopo il boss che chiede prima di uscire, la musica a scelta, le mappe casella per casella, l'Allevamento |
| `8zzo_dev2.js` | Il pannello sviluppatore che dà e crea tutto, con gli strumenti di Tomorrow |
| `8zzp_sync.js` | In rete ogni nemico ha un padrone che lo guida e tutti ne vedono la stessa copia |
| `8zzr_corona.js` | Il menu della Corona di Voxel in 3D |
| `8zzs_disegnate.js` | Le scene disegnate in pixel art, con il testo lettera per lettera |
| `8zzt_aiuti.js` | Aiuti comuni per le novità (campi da salvare, pannelli, giorno della sfida) |
| `8zzt_versioni.js` | Il selettore delle versioni precedenti (serve il server) |
| `8zzta_frasi.js` | Le frasi gialle del titolo |
| `8zzzf_cavalli.js` | I cavalli (H), lo stallo e la corsa a cavallo |
| `8zzzg_navi.js` | La nave da progettare, il molo e le isole |
| `8zzzh_eventi.js` | Gli eventi del mondo ogni mezz'ora |
| `8zzzi_scoperte.js` | Il diario delle scoperte |
| `8zzzj_immersioni.js` | Le immersioni sul fondo del mare |
| `8zzzk_mestieri.js` | I mestieri e la Bottega (Fornello, Alambicco, Incudine), le ricette, il Ricettario |
| `8zzzl_casa.js` | La lavagna di casa e la mensola dei trofei |
| `8zzzm_foto.js` | La modalità foto (F8) |
| `8zzzn_animali.js` | Gli animali da compagnia |
| `8zzzo_carte.js` | Il duello delle carte elementali |
| `8zzzp_incroci.js` | Gli incroci dei compagni |
| `8zzzq_scelte.js` | Le scelte, la via, gli alleati, l'epilogo, i titoli |
| `8zzzs_oltremare.js` | Thalassa, la Giungla di Smeraldo e il Tempio di Giada |
| `8zzzt_classifiche.js` | Le classifiche della settimana |
| `8zzzu_thalassa2.js` | Thalassa più ricca: luoghi, personaggi, Tavolette di Giada, il mistero della Perla |

</details>

---

## Sviluppo

### Costruire e provare
```sh
sh build.sh        # rigenera src/9_changelog.js e voxelia.html
node server.js     # per provarlo con il server (oppure apri voxelia.html nel browser)
```

### Pubblicare una versione nuova
1. Aggiorna il numero di versione in tre posti: `GAME_VER` in `src/1_core.js`; `<title>` e `<sup id="ver">` in
   `src/head.html`; `VER` e il commento iniziale in `server.js`.
2. Scrivi la voce in cima a `CHANGELOG.md`, in italiano.
3. Esegui `sh build.sh`, copia la build in `releases/voxelia_v<versione>.html` e aggiungi la riga in `releases/LEGGIMI.md`.
4. Fai commit e push su `main`: Suga ricostruisce e pubblica da solo.

### Convenzioni
- Nessuna dipendenza esterna: niente framework né librerie, solo JavaScript, Canvas 2D, WebGL e Web Audio.
- Testi, commenti e changelog in italiano.
- I salvataggi devono restare compatibili tra una versione e l'altra.
- Le versioni seguono lo schema `7.9` → `7.9.1` → … → `7.10`: il secondo numero per gli aggiornamenti con novità, il
  terzo per le correzioni.

---

Voxelia è sviluppato da **TeamVoxelia**.
