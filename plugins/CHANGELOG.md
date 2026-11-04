# Changelog dei plugin di Voxelia

Stato al 3 novembre 2026. Versioni prese dal campo `version` di ogni file, date e modifiche dai thread del progetto.
Dove una modifica non ha cambiato il numero di versione, è segnata come «senza cambio di versione».

## Teletrasporto 1.3 (gioco 7.50.1)

- Se `/tpa` non parte perché chi chiede è impegnato (sta già cambiando zona, sta facendo uno scambio, è in cella), il messaggio dice solo il motivo, senza più «… è in una zona che non puoi raggiungere» davanti.

## Bacheca 1.0 e Classifiche 1.0 (gioco 7.48)

- **Nuovo plugin Bacheca:** le missioni che i giocatori dello stesso mondo di Tomorrow si danno tra loro. Una **consegna** (risorse) o una **caccia** (creature da abbattere) con un premio in oro che il server tiene da parte; chi la prende la porta a termine e il premio gli arriva con `p.give`, le risorse vanno al committente (anche offline, alla prossima entrata). Le missioni non prese tornano indietro dopo `giorni` (3), le cacce prese e non finite tornano aperte dopo `oreCaccia` (24). Limiti: `maxAperte` (3) per eroe, `maxPrese` (2), `maxMondo` (40), premio fra `premioMin` (10) e `premioMax` (50000). Comando `/bacheca`, pagina web `/plugins/bacheca/`.
- **Nuovo plugin Classifiche:** quattro gare che ripartono ogni lunedì (settimana ISO, UTC): pesca (i chili mandati dal gioco), Colosseo (le vittorie nell'arena, dall'evento `arena`), dungeon (dall'evento `dungeon`) e città (il valore delle città di Tomorrow, il migliore della settimana). A settimana chiusa i primi tre di ogni gara ricevono un titolo e il primo un mantello; il premio arriva al gioco all'entrata o aprendo l'albo. Tiene `settimane` (8) settimane; `inClassifica` (10); `annuncia` (sì) i campioni. Comando `/classifiche`, pagina web `/plugins/classifiche/`.
- **Server:** il Tempio di Giada (`tempio48`) entra fra i dungeon con i cicli.

## Lavagna 1.0 e Foto 1.0 (gioco 7.47)

- **Nuovo plugin Lavagna:** la lavagna dei messaggi nelle case (stanza del Motel, case di Tomorrow, case del Borgo). Chi entra scrive; il padrone di casa (chi reclama per primo la lavagna dalla sua casa; per il Motel chi ha quel nome) e i suoi coinquilini fissano e cancellano i messaggi; il padrone sceglie fino a `maxCoinquilini` (6) coinquilini. Le lavagne di Tomorrow sono separate per mondo. Comando `/lavagna`, pagina web `/plugins/lavagna/`. Config: `maxMessaggi` (40), `maxLunghezza` (160), `pausaSecondi` (4), `maxLavagne` (3000).
- **Nuovo plugin Foto:** la Galleria del server per le foto della modalità foto (F8). Accetta solo JPEG sotto i 60 KB, al massimo `maxPerEroe` (8) per eroe e `maxFoto` (40) in tutto, una ogni `pausaSecondi` (20). Le immagini si vedono nel gioco e su `/plugins/foto/` (ogni foto su `/plugins/foto/img?id=…`); l'admin ne toglie una con `/plugins/foto/via?num=<numero>`. Comando `/foto`.

## Fazioni 1.1 (gioco 7.45)

- **Le guerre programmate:** il capo (o chi comanda l'esercito) dichiara guerra a una fazione con una città comune, con un preavviso (minimo `preavvisoMinimo` minuti, massimo 2 ore). All'ora stabilita l'assedio dura `guerraMinuti` (20): il server tiene le brecce nelle mura, la presa della piazza (30 secondi senza difensori vicini) e alla fine dà agli attaccanti `bottinoGuerra` (30%) del tesoro della città assediata, o la vittoria ai difensori.
- Una fazione fa una guerra alla volta; fra le stesse due fazioni serve una pausa di `pausaGuerraOre` (2) ore. Annunci a tutto il mondo all'inizio e alla fine.

## Torre 1.0 (gioco 7.44)

- **Nuovo plugin Torre:** la classifica della Torre della Corona, la sfida del giorno (dieci piani uguali per tutti i giocatori fino a mezzanotte UTC).
- Il gioco manda, alla fine di ogni salita, i piani superati e il tempo; il plugin tiene il miglior risultato di ogni eroe per ogni giorno (gli ultimi 14), lo rimanda a chi apre l'ingresso della Torre e annuncia chi arriva in cima per primo.
- Non accetta risultati di altri giorni, più di dieci piani o tempi troppo brevi. Comando `/torre`, pagina web `/plugins/torre/`. Config: `giorni` (14), `inClassifica` (20), `annunciaVetta` (sì).

## Guardiano 2.7 (gioco 7.42.3)

- Nuova funzione `VoxeliaGuardiano.sviluppatore(nome, secondi, ip)`, che chiama il server quando un admin sblocca il pannello sviluppatore del gioco con la password: per quel tempo (al massimo 12 ore) il Guardiano non segnala quel giocatore, ma solo se ha lo stesso nome **e** lo stesso indirizzo di chi ha dato la password.

## Manutenzione del gioco 7.41.1 (senza cambio di versione)

- **Premio giornaliero 1.0:** il promemoria all'ingresso controlla di nuovo, dopo 3 secondi, se il premio è già stato ritirato; `/serie` dice «1 premio in tutto».
- **Albo degli eroi 1.2:** «1 ritirato» al posto di «1 ritirati» (chat e pagina web).
- **Notti di caccia, Taglie, Torneo, Gara di pesca:** «1 pozione» al posto di «1 pozioni» nel testo dei premi.

## Fazioni 1.0 (gioco 7.39)

- **Nuovo plugin Fazioni:** nello stesso mondo di Tomorrow (stesso codice stanza) i giocatori fondano una fazione e costruiscono insieme un insediamento.
- Il capo fonda la fazione, invita (o accoglie chi chiede di entrare) e mette in comune una delle sue città. Chi entra parte come **recluta**, senza permessi.
- Ruoli: capo, staff, membro, recluta e quelli che crea il capo. **Solo il capo** cambia i permessi dei ruoli e ne crea di nuovi; lo **staff** invita, accoglie, cambia i ruoli dei membri ed espelle al posto suo.
- Permessi: costruire (edifici, potenziamenti, editor del borgo e delle mura), arredare, tesoro, esercito, nome della città, invitare, espellere.
- La città comune la tiene il server: chi la cambia manda solo le parti cambiate, e passano solo quelle che il suo ruolo può toccare; tutti i membri online la vedono cambiare subito. La vita di tutti i giorni della città (tasse, raccolto, abitanti) la fa andare avanti il gioco del capo.
- Ogni membro ha una chiave segreta che il gioco tiene nel browser: un altro giocatore con lo stesso nome non può agire al suo posto.
- La città arriva a pezzi da 30 KB (un messaggio del server non supera i 64 KB). Comando `/fazione`, pagina admin `/plugins/fazioni/admin`. Config: `maxMembri` (30), `maxFazioni` (80), `maxRuoli` (10), `maxCittaKB` (1500).

## Territori 1.1 (gioco 7.30)

- Con le terre si ricorda anche la **potenza dell'esercito** di ogni insediamento (`pow`), così chi lo assedia trova guardie forti quanto il suo esercito.

## Territori 1.0 (gioco 7.22)

- **Nuovo plugin Territori:** i giocatori che giocano a Tomorrow nello stesso mondo (stesso codice stanza) condividono le terre conquistate. Il plugin le ricorda per ogni mondo, le manda a tutti e decide chi le possiede: una terra già presa da un altro si ottiene solo con un assedio.
- Gli insediamenti non si conquistano: si saccheggiano. Chi perde una terra o viene saccheggiato lo scopre subito, o al suo ritorno se era offline.
- Ogni mondo ha la sua cronaca delle battaglie. Il comando `/terre` dice chi tiene quante terre; la pagina admin `/plugins/territori/` riassume i mondi.
- Config: `maxRegioni` (terre per eroe, 400) e `registro` (righe di cronaca, 40). I bot dello Stress test non vengono salvati.

## Oggetti unici e reperti (gioco 7.14)

- **Guardiano 2.6:** gli oggetti unici del Mondo aperto (quelli con il seme in `uq`) hanno poteri, quindi possono avere critico fino al 30%, più vita e un prezzo di vendita più alto: il controllo degli «oggetti impossibili» ora ne tiene conto. I reperti (`s: 'x'`) non si indossano e si controllano solo rarità e valore. Prima un'offerta di scambio con un unico o un reperto veniva fermata come trucco.
- **Mercatino 1.3 e Case 1.6:** quando ripuliscono un oggetto ricevuto dal browser tengono anche il seme dell'unico (`uq`: seme, livello, rarità minima, provenienza). Il gioco ricalcola poteri, nome e storia dal seme, quindi un unico venduto al mercatino o lasciato in casa torna identico.

## Pagine web col tema di Voxelia

- Il 14 ottobre le pagine web dei plugin hanno preso l'aspetto dei menu del gioco e della guida 7.10: Georgia, titoli oro con l'ombra ruggine, barra di legno coi chiodi in alto, pannelli col bordo e l'ombra piena sotto, tabelle con l'intestazione di legno, pulsanti come quelli del gioco, colori pergamena col tema chiaro. Si leggono anche sul telefono.
- Plugin aggiornati: Albo 1.2, Boss del mondo 1.2, Guardiano 2.5, Guardie e ladri 1.2, Case 1.5, Mercatino 1.2, Gara di pesca 1.1, Sindaco 1.1, Speedrun 1.2, Stress test 1.3, Taglie 1.2, Caccia al tesoro 1.1, Torneo 1.1. Percorsi, dati e comandi non cambiano. Esempio resta com'era.
- Albo, Guardiano, Gara di pesca e Mercatino hanno anche un pulsante per scegliere il tema; le altre pagine seguono il tema del sistema.

## Link interi in chat

- Controllo del 14 ottobre, per la 7.11.1, che rende cliccabili i link nella chat (provato: i link dei due plugin diventano cliccabili): solo due plugin scrivevano in chat un link a metà (`/plugins/…` senza indirizzo), **Albo degli eroi** (`/albo` col tuo nome) e **Speedrun dei dungeon** (`/speedrun`). Ora scrivono il link intero, es. `https://voxelia.esempio.it/plugins/albo/`. Gli altri plugin in chat non scrivono link: le pagine admin si aprono dal pannello.
- L'indirizzo è quello da cui ogni eroe ha aperto il gioco (lo manda il codice del plugin nella pagina del gioco), quindi è giusto anche per chi gioca in locale o in LAN. Chi ha il server dietro un dominio o un tunnel può fissarlo con `indirizzo` nel config dei due plugin. Su un gioco senza i link cliccabili il testo resta leggibile come prima.

## Compatibilità con la 7.11

- Controllo del 14 ottobre sul gioco 7.11 (con le novità di 7.9, 7.9.1-7.9.4 e 7.10): tutti i plugin si caricano senza errori, e nel gioco vero (computer e telefono, due eroi online) non compaiono errori. I nomi del gioco che i plugin usano ci sono tutti, con gli stessi parametri, e il ponte `VXP` è uguale riga per riga.
- In `server.js` cambiano solo i messaggi: `p.tell` e il testo restituito dai comandi non si fermano più a 12 righe da 200 caratteri (vanno a capo, fino a 60 righe), `api.say` va a capo invece di tagliare a 120 caratteri, `api.announce` arriva a 300 caratteri, e `/plugin` elenca i plugin con la descrizione. Nessun plugin va cambiato: i messaggi lunghi (`/aiuto`, `/taglie`, `/pesca`…) ora arrivano interi.
- Il «regno più difficile» della 7.11 vale anche sui server: nemici più forti, Campioni, branco e ultima furia dei boss passano da `mk` e `upd`, che il gioco riscrive. Il Boss del mondo nasce come boss, quindi non diventa mai un Campione; nella Modalità Storia ha più vita e colpisce più forte come gli altri boss, e sotto un quarto della vita entra nell'ultima furia. La sua vita resta quella del server.
- Durante i filmati nuovi il gioco si mette in pausa (`started` a 0, `CN.film`): Teletrasporto e Ritorno ad Aldoria li riconoscono già come scena, il Boss del mondo sparisce e ricompare alla fine, il sensore del Guardiano aspetta.
- Due plugin andavano adattati: **Guardiano 2.4** (benedizione della Regina Elara) e **Boss del mondo 1.1** (barra della vita sui telefoni).

## Compatibilità con la 7.8

- L'API dei plugin è la stessa della 7.3.2: in `server.js` si aggiungono solo i Mondi della community (cartella `mondi/`, `/api/mondi`, pagina Mondi del pannello), e il ponte `VXP` nel gioco è uguale riga per riga. Zone, dungeon e missioni sono gli stessi della 7.3.2.
- I Mondi della community si giocano senza server (il gioco esce dalla stanza) e le loro mappe hanno nomi `ed_…`: nessun plugin li vede né li tocca.
- Tutti i plugin si caricano sul server 7.8 senza errori (controllo del 10 ottobre, nel gioco vero).
- Due plugin andavano adattati: **Discoteca 1.3** e **Case 1.3**. Dalla 7.4 il gioco disegna le caselle ferme una volta sola («rendering veloce») e non passa più dal disegno che i due plugin usano per i loro oggetti. Le correzioni non cambiano niente sulle versioni precedenti.
- **Guardiano** non va cambiato: la modalità sviluppatore della 7.7 (oro, livelli, teletrasporti dal pannello 🛠) usata in una partita online viene già segnalata come oro e livelli senza spiegazione e piani saltati.

## Compatibilità con la 7.0 e la 7.3.2

- L'API dei plugin è identica dalla 7.0 alla 7.3.2: in `server.js` cambia solo il numero di versione, e il ponte `VXP` nel gioco è uguale riga per riga.
- Tutti i plugin si caricano sul server 7.3.2 senza errori (controllo del 9 ottobre, poi ripetuto con lo stress test insieme a tutti gli altri).
- Due plugin andavano adattati alla 7.3.x e sono già corretti: **Discoteca 1.2** (aspetto del DJ) e **Case 1.1** (mobili della 7.3.1, ora 1.2). Le correzioni non cambiano niente sulla 7.0, quindi vanno bene su tutte e due le versioni.
- **Teletrasporto 1.2** blocca le due zone nuove della 7.3.2 (stanza dell'Occhio e cella); sulle versioni più vecchie, dove non esistono, si comporta come prima.
- **Taglie 1.1** legge la versione del gioco: prima della 7.2 la Cripta era in città e la taglia esce a tutti.
- **Gara di pesca** usa la pesca della 7.3 (`fishLand`): su un gioco che non ce l'ha non vede le catture e lo scrive nella console.
- Caccia al tesoro, Gara di pesca, Torneo, Posta e Stress test sono stati scritti e provati sulla 7.3.2. Premio giornaliero, Guardiano 1.0, Taglie 1.0 e Notti di caccia sono nati su una copia del server 5.3, con la stessa API.
- Discoteca, Case e Teletrasporto si spengono con un avviso («non funziona con questa versione del gioco») se un aggiornamento futuro toglie qualcosa che usano, invece di rompere il gioco.

---

## Il Sindaco di Aldoria (`sindaco.js`) — 1.1

**1.1** — 14 ottobre 2026
- Le pagine web `/plugins/sindaco/` e `/plugins/sindaco/admin` hanno l'aspetto dei menu di Voxelia e della guida: Georgia, titoli oro con l'ombra ruggine, barra di legno con i chiodi in alto, pannelli col bordo a cubetti e l'ombra piena sotto, tavole con l'intestazione di legno, pulsanti come quelli del gioco e le icone voxel del gioco al posto delle emoji (cappello a cilindro, clessidra, eroi, corona, lente, ingranaggio, libro). Con il telefono o il computer in tema chiaro usano i colori pergamena della guida.
- Il sindaco in carica è in un riquadro in evidenza; sotto, prossimo spoglio, elettori finora e i decreti in vigore con i minuti che mancano (gli stessi che dice `/sindaco`). Nei voti della settimana una barra mostra quanto è avanti ogni candidato.
- Nella pagina admin i pulsanti scrivono l'esito sotto di loro invece di aprire una finestra, poi la pagina si ricarica; chiedono ancora conferma prima di agire. Percorsi, dati e comandi sono gli stessi della 1.0.

**1.0** — 14 ottobre 2026 (scritto e provato sulla 7.8, insieme a tutti gli altri plugin)
- Ogni settimana si elegge il sindaco con `/vota nome`: un voto a testa, si può cambiare fino allo spoglio (`giornoElezione` e `oraElezione`, di base domenica alle 21 ora del server). Vota solo chi ha giocato almeno `minutiPerVotare` (30) minuti nella settimana; niente voto per sé (`votoPerSe`), un voto per IP facoltativo (`unVotoPerIp`). A pari voti vince chi ci è arrivato prima; senza voti il sindaco resta in carica.
- `/discorso testo` (e `/discorso + altro` per continuarlo, perché la chat taglia a 60 caratteri): il discorso del vincitore viene annunciato a tutti allo spoglio; chi è eletto senza discorso lo scrive e lo legge con `/discorso leggi`. Titolo grande con la corona nel gioco.
- Il sindaco ha 🎩 davanti ai messaggi in chat (`cappello`) e una volta al giorno emana un decreto dalla lista `decreti` con `/decreto numero`: Esperienza doppia e Oro doppio (moltiplicatori del server per `minuti`), Festa in discoteca (solo con la Discoteca accesa: annuncio e regalo a chi entra, `regalo`). Con Notti di caccia 1.1 e Mercatino 1.1 anche Notte di caccia anticipata (parte subito e dura quanto una notte del mondo) e Sconto al Mercatino (la tassa sulle vendite scende di `percento` punti per `minuti`; con la tassa di base del 5% diventa zero); se uno dei due plugin è spento, il sindaco riceve un avviso.
- L'esperienza doppia non parte durante una notte di caccia (anche anticipata); se una notte comincia durante il decreto, alla fine il moltiplicatore torna giusto. Con Ricarica o riavvio a metà decreto il moltiplicatore torna com'era e il decreto riprende.
- `/sindaco` dice chi è il sindaco, i decreti in vigore e i voti della settimana. Pagina pubblica `/plugins/sindaco/`, pagina admin `/plugins/sindaco/admin` (chi ha votato chi, Fai lo spoglio adesso, Togli il sindaco, Ridai il decreto di oggi). Tutto è salvato in `voxelia-data.json`, quindi resta anche dopo un rebuild su suga.app.

## Emote e fumetti (`emote.js`) — 1.0

**1.0** — 14 ottobre 2026 (scritto e provato sulla 7.8)
- `/saluta`, `/ridi`, `/applaudi`, `/arrabbiato`, `/cuore`, `/balla`, `/triste`, `/ok`, `/dubbio`, `/dormi`, `/forza`, `/brindisi` mostrano per `durataSec` (4) secondi un fumetto con un'icona voxel della 7.8 sopra la testa dell'eroe, visibile a chi è nella stessa zona. Ridi, arrabbiato e triste sono facce nuove disegnate a cubetti come le altre. Con `/balla` l'eroe saltella. Fra due emote passano almeno `attesaSec` (2) secondi; `spente` toglie quelle che non vuoi.
- Ruota delle emote con il tasto G (`tasto`): si sceglie col mouse o coi numeri, Esc la chiude. `/emote` elenca le emote e apre la ruota, anche da telefono.
- I messaggi di chat compaiono come fumetto sopra chi li scrive, al posto della scritta gialla del gioco (`fumettiChat`). Il fumetto compare solo se il server ha consegnato il messaggio: chi è silenziato dall'admin o dal Guardiano non ha più la scritta sopra la testa, che il gioco mostrava lo stesso.
- Funziona insieme ai Gruppi d'avventura (nome verde e barra della vita restano) e col «rendering veloce». Chi non ha ricaricato la pagina dopo l'installazione non vede i fumetti e `/saluta` glielo dice.

## Speedrun dei dungeon (`speedrun.js`) — 1.2

**1.2** — 14 ottobre 2026
- Pagina `/plugins/speedrun/` col tema di Voxelia, come i menu del gioco e la guida: Georgia, titolo oro con l'ombra ruggine, barra di legno con i chiodi in alto, pannelli col bordo e l'ombra piena, intestazioni delle tabelle in legno, dungeon come pulsanti del gioco (quello scelto in oro) con il numero di piani.
- Sfida della settimana in un riquadro in evidenza, medaglie ai primi tre, difficoltà come etichette colorate (Facile verde, Normale blu, Difficile arancio, Incubo rosso), sfide vinte in elenco.
- Tema chiaro se il dispositivo è in modalità chiara; sul telefono le tabelle stanno nella larghezza dello schermo.
- Stessi dati, stessi indirizzi (`/plugins/speedrun/`, `dati`, `?stanza=`), aggiornamento ogni 30 secondi e dungeon scelto ricordato come prima. Provato sul server 7.11.1: nessun errore nella pagina, computer e telefono.

**1.1** — 14 ottobre 2026
- Link interi in chat: `/speedrun` scrive l'indirizzo completo della pagina (es. `https://voxelia.esempio.it/plugins/speedrun/?stanza=…`), così dalla 7.11.1 si apre con un clic dalla chat. L'indirizzo è quello da cui l'eroe gioca, oppure `indirizzo` nel config.

**1.0** — 14 ottobre 2026 (scritto e provato sulla 7.8, insieme a tutti gli altri plugin)
- Il cronometro parte quando l'eroe entra nel primo piano di un dungeon e si ferma quando ne sconfigge il boss; a ogni piano nuovo arriva il tempo parziale. Tutto misurato sul server.
- Classifiche separate per stanza (i piani cambiano con il codice della stanza), con ciclo e difficoltà di ogni tempo. Chi è nello stesso dungeon col cronometro acceso quando un compagno abbatte il boss ha il suo tempo.
- Non vale: uscire dal dungeon (anche morendo), scollegarsi, saltare un piano o fare meno di `tempoMinimoSec` (30). Il Guardiano blocca già due boss troppo ravvicinati.
- Record della stanza annunciato alla stanza, record del server a tutti (un annuncio solo per gruppo).
- **Sfida della settimana**: ogni lunedì un dungeon scelto da `sfidaDungeon`; alla fine della settimana il più veloce di ogni stanza riceve `sfidaPremioOro` (500) e un oggetto di rarità `sfidaPremioOggetto` (raro), se l'hanno finita almeno `sfidaMinimoEroi` (2) eroi. Chi è offline lo riceve al rientro.
- `/speedrun` (cronometro, sfida, i tuoi record), `/speedrun tana`, `/speedrun sfida`, `/speedrun server`, `/speedrun annulla`. Pagina pubblica `/plugins/speedrun/`: senza `?stanza=` mostra solo i record di tutte le stanze, senza codici; il link con la stanza lo dà `/speedrun`.

## Ritorno ad Aldoria (`hub.js`) — 1.0

**1.0** — 10 ottobre 2026 (scritto e provato sulla 7.8, insieme a tutti gli altri plugin)
- `/hub` riporta l'eroe ad Aldoria, al punto d'arrivo della città, da qualunque zona, con la stessa transizione del Teletrasporto.
- Non funziona: durante uno scambio, un cambio di zona o una scena; dalla cella delle prigioni; dalla fossa del Colosseo; con mostri che ti attaccano entro 7 caselle; per `combattimentoSec` (8) secondi dopo un colpo subito; durante una partita di Guardie e ladri; dalle zone in `vietate`. Fra un `/hub` e l'altro passano almeno `attesaSec` (30) secondi.
- Come il Teletrasporto, se un aggiornamento del gioco toglie qualcosa che usa, si spegne con un avviso invece di rompere il gioco.

## Boss del mondo (`boss.js`) — 1.2

**1.2** — 14 ottobre 2026 (provato sulla 7.11.1)
- Pagine web rifatte con l'aspetto di Voxelia e della guida: Georgia, titoli oro con l'ombra ruggine, intestazione su una barra di legno coi chiodi, pannelli col bordo dorato e l'ombra piena sotto, tabelle con l'intestazione di legno, pulsanti come quelli del gioco (oro per «Evoca», rosso per «Mandalo via»). Con il tema chiaro del dispositivo diventano color pergamena come la guida.
- Il boss in corso ha una barra della vita più grande con la percentuale scritta dentro, la zona come etichetta e i più valorosi in riquadri. Nelle tabelle i numeri sono allineati a destra, negli ultimi boss c'è la colonna «Quando».
- Si leggono bene anche sul telefono. Percorsi, dati, aggiornamento ogni 15 secondi e pulsanti dell'admin restano gli stessi.

**1.1** — 14 ottobre 2026 (provato sulla 7.11)
- Sui telefoni la barra della vita del boss finiva sopra l'HUD e la minimappa. Ora, quando al centro non c'è spazio, va sotto l'HUD in alto a sinistra come la scheda della Discoteca, e il riquadro dei Gruppi si mette sotto. Sul computer resta in alto al centro.


**1.0** — 10 ottobre 2026 (scritto e provato sulla 7.8, insieme a tutti gli altri plugin)
- Ogni `ogniMin` (60) un boss enorme compare in ogni stanza con eroi online, al centro di Foresta, Deserto o Picchi, annunciato a tutti. Se nessuno lo sconfigge in `durataMin` (15) se ne va. `/boss` dice dove si trova e quanta vita gli resta, `/boss classifica` i più valorosi.
- La vita sta sul server: ogni gioco manda i danni che fa e riceve la vita aggiornata, con una barra in alto nella zona del boss. Più eroi nella stanza, più vite (`vite`, `vitePerEroe`).
- Premio a chi ha fatto almeno il 3% dei danni: 40% del premio più il 60% in proporzione ai danni (`premio`), oggetto epico al più valoroso, raro a chi fa almeno il 15%.
- Nel gioco il boss nasce con `mk()` da un boss esistente (aspetto e attacchi del gioco), con nome, misura e forza dal config. I colpi passano da `hurtE`, che il plugin intercetta solo per il boss del mondo: niente `kill()`, quindi niente missioni o bottino del gioco.
- Contro i trucchi il server accetta al massimo `dannoMaxSec` + `dannoMaxLivello` × livello vite al secondo per eroe. La pagina admin `/plugins/boss/admin` mostra i danni scartati, ed evoca o manda via il boss; pagina pubblica `/plugins/boss/`.
- Per gli altri plugin: `globalThis.VoxeliaBoss.attivi()` e `globalThis.VoxeliaBoss.onSconfitto(fn)`, con i nomi e la parte di danni di ogni eroe.
- Il comando `/boss` di `esempio.js` viene ignorato, perché quello del Boss del mondo si carica prima.

## Mercatino di Aldoria (`mercato.js`) — 1.2

**1.2** — 14 ottobre 2026
- La pagina pubblica (`/plugins/mercato/`) e il pannello admin (`/plugins/mercato/admin`) hanno lo stesso aspetto della guida e dei menu del gioco: barra di legno coi chiodi, titoli oro con l'ombra ruggine, pannelli col bordo e l'ombra piena, tabelle con l'intestazione di legno, pulsanti come quelli del gioco.
- Icone voxel disegnate dal gioco stesso (bancarella, moneta, spada, elmo, corazza, scudo, pergamena, avviso, lucchetto, chiave, gente) al posto delle emoji.
- Tema automatico, scuro o chiaro, col pulsante in alto (ricordato nel browser come nella guida); i colori delle rarità restano leggibili anche sul chiaro.
- Pagina pubblica: ricerca per nome dell'oggetto o del venditore (anche senza accenti) e filtri per tipo; la ricerca resta quando la pagina si aggiorna da sola ogni minuto, e l'aggiornamento aspetta se stai scrivendo.
- Pannello admin: riepilogo in cima, una sezione per ogni lista; gli errori delle azioni compaiono in un avviso nella pagina invece che in una finestra del browser.
- Percorsi, dati (`/plugins/mercato/dati`) e azioni dell'admin sono invariati. Pagine provate su schermo largo e telefono.

**1.1** — 14 ottobre 2026 (provato sulla 7.8)
- Aggancio per il decreto «Sconto al Mercatino» del Sindaco di Aldoria (`globalThis.VoxeliaMercato.sconto`): per la durata del decreto la tassa sulle vendite scende, e il mercatino mostra subito quella nuova. Lo sconto è salvato nel file dei dati, quindi resta dopo un riavvio. Senza il Sindaco non cambia niente.


**1.0** — 10 ottobre 2026 (provato sulla 7.8, insieme a tutti gli altri plugin)
- `/mercato` apre la bancarella nel gioco con tre schede: In vendita (filtro per armi, elmi, corazze, scudi; Compra e Conferma), Vendi (prezzo per ogni oggetto dello zaino) e I miei banchi (oggetti sul banco, da ritirare, ultime vendite). `/mercato cerca nome` elenca in chat.
- Gli oggetti in vendita li tiene il server, come il deposito delle Case. Si compra anche quando il venditore è offline: l'oro (meno la tassa, `tassaPercento`, di base 5%) arriva con `p.give` subito o al rientro.
- Invenduti dopo `giorniScadenza` (7) tornano al venditore. Oggetti premio dell'arena e oggetti bloccati non si vendono.
- Il banco è legato al browser con una chiave segreta: chi entra con lo stesso nome da un altro browser non ritira né incassa (`/mercato chiave` per spostarlo).
- Contro i trucchi: l'oro lo toglie il gioco, quindi il plugin controlla che dopo la consegna l'oro del compratore scenda davvero del prezzo; se no lo segna come sospetto e (di base) lo blocca. Pagina pubblica `/plugins/mercato/`, pagina admin `/plugins/mercato/admin`.

## Gruppi d'avventura (`gruppi.js`) — 1.0

**1.0** — 10 ottobre 2026 (scritto e provato sulla 7.8)
- Gruppi fino a 4 eroi della stessa stanza: `/gruppo invita nome`, `/gruppo accetta`, `/gruppo rifiuta`, `/gruppo esci`, `/gruppo caccia nome` (solo il capo); `/gruppo` dice chi c'è, con vita e zona di ognuno. Il gruppo si scioglie quando resta un eroe solo.
- Chat di gruppo con `/gr testo`, in verde nel registro della chat.
- Boss di dungeon: i compagni nello stesso dungeon (qualunque piano) ricevono il 30% dell'esperienza del boss e 5 monete per livello del dungeon, +25% per ogni ciclo già completato, moltiplicati per gli eventi XP e oro del server.
- Nel gioco: riquadro del gruppo sotto l'HUD (sotto quello della Discoteca, se c'è) con vita, livello, zona e pulsante «Raggiungi» (`/tpa`); invito con Accetta e Rifiuta; nome verde e barra della vita sopra i compagni anche con i nomi spenti, sia col disegno classico sia col «rendering veloce»; compagni in verde sulla minimappa.
- Chi chiude il gioco resta nel gruppo per 5 minuti (`assenzaMin`); i gruppi restano anche dopo un riavvio. Pagina admin `/plugins/gruppi/` con i gruppi attivi.

## Case (`housing.js`) — 1.5

**1.5** — 14 ottobre 2026 (provato sulla 7.11.1)
- La pagina admin `/plugins/housing/admin` ha l'aspetto di Voxelia e della guida: Georgia, titolo oro con l'ombra ruggine, barra di legno coi chiodi, tabella con l'intestazione di legno, pulsanti come quelli del gioco (oro per «Nuovo codice», rosso per «Elimina»). Segue il tema chiaro o scuro del sistema e si legge anche sul telefono.
- In cima ci sono i totali del borgo (case occupate sul massimo, oro e oggetti nei depositi, visite) e una casella per cercare un eroe, una casa o un pet.
- Il nuovo codice compare in un riquadro con il pulsante «Copia»; gli errori compaiono nella pagina invece che in una finestra.
- Corretto: un nome con l'apostrofo (per esempio «Lia d'Aldoria») rompeva il pulsante «Elimina», e il nome dell'eroe nel riquadro del codice ora è protetto come nel resto della pagina.
- Percorsi, dati e azioni della pagina sono quelli di prima.

**1.4** — 14 ottobre 2026
- Case molto più care: dalla tenda a 1000 monete alla villa a 8000 (prima da 50 a 280). Il trasloco resta a metà prezzo del nuovo modello; colori, arredi e cibo del pet costano come prima.

**1.3** — 10 ottobre 2026 (provato sulla 7.8)
- Nelle case si vedono di nuovo tappeti, acquario e cuccia del pet, e i muri davanti tornano bassi: dalla 7.4 il «rendering veloce» del gioco li saltava. Nel Borgo e nelle case il plugin usa il disegno classico, fuori il gioco torna veloce.

**1.2** — 9 ottobre 2026
- Il riquadro del Borgo e delle case non copre più l'HUD in alto a sinistra: si mette sotto e lo segue quando diventa più alto (livello alto, tante righe di statistiche); su telefono si stringe come l'HUD.

**1.1** — 9 ottobre 2026
- Dalla 7.3.1 negli interni alcuni simboli disegnano mobili diversi: nelle case erano sparite le colonne della villa, i pupazzi di neve dell'igloo e gli arredi «Colonna», «Cristalli» e «Pupazzo di neve». Ora si vedono di nuovo.
- Aspetto fisso per il custode del Borgo (dalla 7.3 il gioco ne dava uno a caso).

**1.0, seconda versione** — 8 ottobre 2026 (senza cambio di versione)
- Pannelli nello stile di Voxelia, con schede, tasto Chiudi ed Esc.
- Icone in pixel art al posto delle emoji, con la testina di ogni pet nel suo colore.
- Prezzi: casa da 50 (tenda) a 280 monete (villa) pet compreso, trasloco a metà prezzo, ridipingere 8, arredi da 5 a 40, cibo del pet 3. Si può pagare con l'oro del deposito. `prezzoPercento` li scala tutti.

**1.0** — 8 ottobre 2026
- Prima versione, provata sulla 7.0: 10 modelli di casa, colori, musica e nome, 34 arredi.
- Deposito di oggetti e oro sul server, aperto solo con il codice segreto della casa (`/casa chiave`).
- Pet tamagotchi a scelta tra 10 specie; gli ospiti possono coccolarlo e giocarci ma non vedono il deposito.
- Borgo delle Case con portale in città, `/borgo`, `/visita`, `/case`, `/pet`; pagina admin `/plugins/housing/admin`.

## Discoteca (`discoteca.js`) — 1.4

**1.4** — 13 ottobre 2026 (provato sulla 7.8)
- Le luci seguono il BPM vero di ogni brano: il plugin lo cerca per titolo su Deezer (gratis, senza chiave) e lo ricorda per le volte dopo. Con una chiave gratuita di getsongbpm.com (`chiaveGetSongBpm`) cerca anche lì quando Deezer non trova il brano. Chi chiede il brano può ancora scriverlo a mano (/dj link 128); se non si trova, resta 124. Nel pannello del DJ si vede il BPM del brano (con ~ davanti quando è quello predefinito). Config `cercaBpm` per spegnere la ricerca.

**1.3** — 10 ottobre 2026 (provato sulla 7.8)
- Pista luminosa, casse, consolle del DJ e pali dei fari si vedono di nuovo: dalla 7.4 il «rendering veloce» del gioco li saltava e restavano solo fasci e laser. Nella sala il plugin usa il disegno classico, fuori il gioco torna veloce.
- La consolle con i piatti ora sta davanti al DJ, che è dietro, tra la consolle e il muro. Per parlargli ci si mette davanti alla consolle, in qualunque punto, e si preme R o si clicca.

**1.2** — 9 ottobre 2026
- La scheda del DJ in alto a sinistra ora sta sempre sotto l'HUD e lo segue quando diventa più alto; sul telefono è più stretta e non copre l'orologio.
- Aspetto del DJ per la 7.3 (cappellino rosa, occhiali e collana): prima il gioco gliene dava uno a caso e scuro, e nella sala non si vedeva quasi.

**Portale in piazza** — 9 ottobre 2026 (il numero di versione di questo passaggio non risulta dai thread)
- Portale «Discoteca Voxel» in piazza, a sud della fontana, di fronte a quello del Borgo delle Case. Uscendo dalla porta si torna accanto al portale. Config `posPortale` e `portaleInCitta`.

**1.0** — 8 ottobre 2026
- Prima versione per la 7.0: `/discoteca`, sala con pista, fari e laser a tempo, DJ con coda per stanza da YouTube e SoundCloud, voti per skip e pausa, volume, base house quando il DJ è libero. Comandi `/dj`, `/coda`, `/skip`, `/pausa`.


## Teletrasporto (`tpa.js`) — 1.3

**1.3** — 3 novembre 2026 (gioco 7.50.1)
- Quando `/tpa` non parte perché chi chiede è impegnato (sta già cambiando zona, sta facendo uno scambio, è in cella), il messaggio dice solo il motivo: prima cominciava con «… è in una zona che non puoi raggiungere», anche se la zona andava benissimo.

**1.2** — 9 ottobre 2026
- Stanza dell'Occhio: ci si arriva solo con la chiave di Malakar e dopo l'arresto, come per la porta di pietra del gioco.
- Cella delle prigioni: mai raggiungibile con `/tpa` (blocco sul server), e chi è in cella non può usare `/tpa` per uscire.
- Aldoria Vecchia e la stanza del culto: ora serve il passaggio scavato nel muro crepato (il buco c'era già dalla 7.0).

**1.1** — 8 ottobre 2026
- Riconosce da solo le zone chiuse: dai portali con cancello (`lock`, ricordati anche dopo un riavvio) e dalle missioni che aprono una zona con lo stesso nome (`unl`). Edifici e dungeon dentro una zona chiusa sono chiusi anche loro.
- In `regole` restano solo i blocchi che non sono cancelli (come la Cittadella); `{ "libera": true }` riapre una zona.
- Si spegne con un avviso se il gioco non ha più qualcosa che usa.

**1.0** — 8 ottobre 2026
- `/tpa`, `/tpaccetta`, `/tparifiuta`, `/tpannulla`, `/tpblocco`, riquadro con Accetta e Rifiuta, scadenza dopo 60 secondi, controllo di accesso alla zona alla richiesta e all'accettazione.

## Taglie del giorno (`taglie.js`) — 1.2

**1.2** — 14 ottobre 2026 (provato sulla 7.11.1)
- La pagina pubblica `/plugins/taglie/` ha l'aspetto dei menu di Voxelia e della guida: Georgia, titolo oro con l'ombra ruggine, barra di legno con i chiodi in alto, pannelli col bordo dorato e l'ombra piena sotto. Con il tema chiaro del dispositivo diventa color pergamena come la guida.
- In cima la data di oggi e un riepilogo: quante taglie, quanti eroi sono a caccia oggi, quanti le hanno fatte tutte. Ogni taglia è un riquadro con il tipo come etichetta colorata (Dungeon rosso, Colosseo arancio, Scambio viola, Esplorazione verde acqua), «Difficile» per quelle più lunghe, il premio e una barra con quanti eroi l'hanno completata.
- La taglia sostitutiva della Cripta (per chi non ha aperto il Borgo delle Ceneri) sta nello stesso riquadro; il bonus per chi le completa tutte è in un riquadro in evidenza, e chi ci è riuscito compare con 🏆.
- Si legge anche sul telefono. Percorso, taglie e conteggi sono quelli di prima: cambia solo l'aspetto.

**1.1** — 9 ottobre 2026
- La taglia «Libera la Cripta Dimenticata» esce solo a chi ha aperto il Borgo delle Ceneri; agli altri ne arriva un'altra, uguale per tutti nella stessa situazione. La scelta vale per tutta la giornata.
- La pagina pubblica mostra anche la taglia sostitutiva. Prima della 7.2 la cripta esce a tutti come prima.
- I bot dello stress test vengono ignorati (senza cambio di versione).

**1.0** — 8 ottobre 2026
- Prima versione: 3 taglie al giorno uguali per tutti, premi e bonus, `/taglie` e pagina `/plugins/taglie/`.

## Guardiano (`guardiano.js`) — 2.5

**2.5** — 14 ottobre 2026 (provato sulla 7.11.1)
- La pagina admin `/plugins/guardiano/` ha l'aspetto dei menu di Voxelia e della guida: scritte in Georgia, titolo d'oro con l'ombra ruggine su una barra di legno con i chiodi, pannelli col bordo color legno e l'ombra piena sotto, intestazioni delle tabelle in legno, pulsanti come quelli del gioco (rossi per Espelli, Spegni, Togli la sospensione e Cancella).
- In cima un riepilogo: eroi in gioco, segnalazioni salvate, quante di gravità alta, automoderazione e sensore accesi o spenti. I filtri delle segnalazioni (Tutte, Media e alta, Solo alta) sono pulsanti, con quello scelto in oro; sospesi e silenziati sono in un elenco a parte.
- Tema chiaro e scuro: segue quello del sistema, e il pulsante ◐ Tema in alto lo cambia e lo ricorda. Su telefono le tabelle scorrono di lato.
- Dati, filtri, pulsanti e percorsi sono gli stessi di prima: cambia solo l'aspetto.

**2.4** — 14 ottobre 2026 (provato sulla 7.11)
- Dalla 7.11, contro l'Abominio, la benedizione della Regina Elara rende i colpi più forti del 20% fino alla fine della battaglia. Il sensore segnalava come «colpi impossibili» (gravità alta) i colpi più forti di chi la aveva: ora nella stanza dell'Occhio, con la benedizione, il massimo accettato è 11,7 volte l'attacco invece di 9,7. Fuori da lì non cambia niente.


**2.3** — 14 ottobre 2026 (provato sulla 7.3.2)
- Il pulsante Accendi/Spegni dell'automoderazione salva la scelta nel file dei dati (`voxelia-data.json`) invece che in `guardiano.config.json`: su suga.app i dati stanno nel volume `/data` e la scelta resta dopo riavvii e rebuild, mentre la cartella dei plugin torna com'è nel repository.
- Senza una scelta dalla pagina vale la variabile d'ambiente `GUARDIANO_AUTOMODERAZIONE` (`1` o `0`), poi `attiva` in config. La pagina admin dice da dove viene lo stato.

**2.2** — 10 ottobre 2026 (provato sulla 7.3.2)
- Automoderazione configurabile, spenta di base: si accende e si spegne dalla pagina admin o in `guardiano.config.json` (`automoderazione`). Ogni segnalazione dà punti all'eroe (alta 10, media 3, bassa 0; Cheat Menu 30), che scadono dopo 72 ore.
- Regole a soglia, modificabili: 10 punti avviso, 20 ripristino, 30 espulsione, 60 sospensione di 24 ore, 120 sospensione di 7 giorni. Azioni disponibili: avvisa, ripristina, citta, silenzia (chat bloccata per N ore), espelli, sospendi (N ore o per sempre), con un messaggio facoltativo.
- Chi è sospeso viene rifiutato appena entra (anche per IP con `sospendiIp`); annuncio facoltativo nella stanza; nomi esenti.
- Pagina admin: punti degli eroi, ultime sanzioni, sospesi e silenziati, con i pulsanti Azzera i punti, Togli la sospensione, Togli il silenzio.
- Quando è accesa prende il posto di `azione`, `azioneDa` ed `espelliDopo`.

**2.1** — 9 ottobre 2026 (provato sulla 7.3.2 nel gioco vero)
- Guadagni per ora di gioco: per ogni eroe si contano oro ed esperienza guadagnati giocando (non regali, scambi o deposito), per fascia di 10 livelli. Chi supera 5 volte la mediana della fascia dopo almeno un'ora viene segnalato (al massimo una volta al giorno). Tabella nella pagina admin. Opzioni `statistiche`, `statMultiplo`, `statOreMin`, `statGiocatoriMin`.
- Copia dell'eroe sul server (livello, oro, esperienza, oggetti con il deposito, frammenti), salvata ogni minuto e all'uscita e confrontata con la prima foto del sensore al rientro. Con `copia: "rimetti"` toglie solo quello che c'è in più (non aggiunge mai niente, quindi chi usa il nome di un altro non riceve la sua roba). Predefinito `"segnala"`.
- I bot dello stress test restano esclusi da statistiche e copie.

**2.0** — 9 ottobre 2026 (provato sulla 7.3.2, anche nel gioco vero con il Cheat Menu dell'addon)
- Sensore nella pagina del gioco: riconosce il Cheat Menu e le funzioni del gioco sostituite, controlla vita massima, esperienza, pozioni di forza/pietra, zaino, frammenti della Corona senza boss, oggetti impossibili, colpi sui mostri oltre 9,7 volte l'attacco, eroe dentro i muri, mostri a raffica. Se smette di mandare le foto lo segnala.
- Oro e livelli si confrontano con quello che li spiega: regali del pannello admin e di tutti i plugin (visti dal server, senza `grazia`), scambi, deposito delle case, vendite di oggetti, risorse e pesci, casinò. Finestre di 1 secondo, 1 minuto e 10 minuti.
- Dal server: vita massima impossibile o sotto il minimo del livello, livello oltre 150, teletrasporti, piani dei dungeon saltati, offerte con oro che non si ha e oggetti impossibili negli scambi e a terra (bloccati), grossi passaggi d'oro, progressi fatti fuori dal server tra due sessioni.
- Ogni segnalazione ha una gravità (alta, media, bassa) e le prove. Nuova azione `ripristina` (toglie oro, livelli, oggetti e frammenti illeciti) e `azioneDa`; pagina admin con giocatori online, filtri e pulsanti Ripristina, In città, Espelli.
- `VoxeliaGuardiano.credito(nome, oro, livelli)` per i plugin che regalano in altri modi; `grazia` resta.

- Aggiunta una riga che ignora i bot dello stress test — 9 ottobre 2026 (senza cambio di versione).

**1.0** — 8 ottobre 2026
- Segnala salti di oro e livello, velocità impossibili, boss di dungeon fuori dal dungeon o troppo ravvicinati (questi li blocca), colpi PvP esagerati. Pagina admin `/plugins/guardiano/`. Di base segnala e basta; `azione` in config per riportare in città o espellere. `VoxeliaGuardiano.grazia(nome)` per i regali degli altri plugin.

## Stress test (`stress.js`) — 1.3

**1.3** — 14 ottobre 2026
- La pagina admin `/plugins/stress/` ha l'aspetto dei menu di Voxelia e della guida: Georgia, titoli d'oro con l'ombra ruggine, barra di legno con i chiodi in alto, pannelli col bordo e l'ombra piena, tavole con l'intestazione di legno, pulsanti come quelli del gioco (Avvia d'oro, Ferma rosso, preset scelto in oro). Tema chiaro pergamena se il sistema è in modalità chiara.
- In alto un'etichetta dice se c'è un test in corso. I campi del modulo stanno in una griglia ordinata, anche sul telefono (due per riga, senza scorrimento di lato).
- Comportamento, indirizzi, preset e dati invariati. Provato sul server 7.11.1 con un test vero (6 bot, 20 s): nessun errore nella pagina.

**1.2** — 9 ottobre 2026
- Più stanze: i bot si dividono all'inizio tra più stanze (stresstest1, stresstest2…). Con «cambio stanza» escono dalla loro stanza e, come nel gioco, si ricollegano in un'altra o ne creano una nuova (`nuoveStanze`, `maxStanze`). La pagina mostra i bot per stanza, quante volte hanno cambiato stanza e quanto ci mettono a rientrare.
- Scambi, duelli e `/tpa` avvengono solo tra bot della stessa stanza. I cicli dei dungeon di tutte le stanze usate tornano com'erano a fine test.
- 8 preset pronti nella pagina (config `preset`, modificabile): Prova veloce, Serata normale, Via vai di stanze, Tante stanze piccole, Tutti in piazza, Raffica di chat e comandi, Server pieno, Resistenza (1 ora).
- Corretto: un messaggio di chat scritto da un bot rimasto solo nella sua stanza non viene più contato come perso.

**1.1** — 9 ottobre 2026
- Modalità «partita completa» (predefinita): i bot giocano davvero. Scendono nei dungeon piano per piano fino al boss, che fa avanzare il ciclo della stanza come nel gioco. Cacciano mostri nelle zone aperte, usano le pozioni e a volte muoiono. Fanno duelli nella fossa del Colosseo, con le vittorie contate dal server. Si scambiano oggetti, gettano e raccolgono oggetti a terra e si teletrasportano tra loro con `/tpa`.
- I bot usano i comandi dei plugin (lista `comandi` in stress.config.json, solo comandi che non salvano niente). La pagina misura il tempo di risposta e mostra gli errori dei plugin e i comandi sconosciuti.
- La pagina mostra dal vivo cosa fanno i bot (dungeon, città, duelli…) e i conteggi della partita. La modalità «leggera» (la 1.0) resta disponibile.
- Pulizia: a fine test anche i cicli dei dungeon della stanza tornano com'erano.
- Notti di caccia, Esempio, `/amici` (Posta) e `/taglie` ignorano i bot. Provato con il Guardiano 2.0 nella configurazione più severa: nessuna segnalazione né espulsione.

**1.0** — 9 ottobre 2026
- Fino a 200 bot WebSocket nella stanza `stresstest`, avviati solo dalla pagina admin `/plugins/stress/`. Misura latenza di chat e `who`, intervallo degli aggiornamenti di stato, ritardo del ciclo di Node, memoria, CPU, messaggi al secondo ed errori.
- Pulizia a fine test: i bot escono dalla classifica dell'arena e il limite di giocatori torna com'era. `globalThis.VoxeliaStress.bot(p)` per farli ignorare agli altri plugin.

## Posta e amici (`posta.js`) — 1.0

- Ignora i bot dello stress test, anche in `/amici` — 9 ottobre 2026 (senza cambio di versione).

**1.0** — 9 ottobre 2026
- `/posta nome testo`, `/posta`, `/posta cancella`; `/amici aggiungi|togli` con avvisi di entrata e uscita. Limiti contro lo spam in config, messaggi che scadono dopo 30 giorni.

## Notti di caccia (`notti.js`) — 1.1

**1.1** — 14 ottobre 2026 (provato sulla 7.8)
- Aggancio per il decreto «Notte di caccia anticipata» del Sindaco di Aldoria (`globalThis.VoxeliaNotti`): la notte di caccia parte subito, con la stessa XP e la stessa gara, e dura quanto una notte del mondo (7 minuti con le ore di base). `/evento` dice quanto manca. Se c'è già una notte di caccia, il decreto viene rifiutato. Senza il Sindaco non cambia niente.

- Niente punti ai bot dello stress test — 9 ottobre 2026 (senza cambio di versione).

**1.0** — 8 ottobre 2026
- Una notte del mondo ogni 3 con XP ×2 e gara a punti tra boss e Colosseo, premio all'alba. `/evento`.

## Gara di pesca (`pesca.js`) — 1.1

**1.1** — 14 ottobre 2026
- Le pagine `/plugins/pesca/` e `/plugins/pesca/admin` hanno l'aspetto della Guida e dei menu di Voxelia: Georgia, titolo oro con l'ombra ruggine, barra di legno con i chiodi, pannelli col bordo e l'ombra piena, tabelle con l'intestazione di legno, pulsanti del gioco e icone voxel (pesce, clessidra, corona, trofeo, eroi).
- Tema chiaro e scuro come nella Guida: segue il sistema, il pulsante ◐ lo cambia e lo ricorda.
- Rarità come etichette colorate, podio dell'ultima gara a schede, conteggi in alto (specie nell'albo, leggendari, pescatori, tempo che manca) e conto alla rovescia che si aggiorna da solo. Sul telefono la colonna «Quando» si nasconde.
- Percorsi, dati JSON, comandi e funzionamento della gara non cambiano.

**1.0** — 9 ottobre 2026
- Albo dei record per specie, gare a tempo (pagina admin, `/pesca via`, o a orari fissi), annunci dei leggendari, `/pesca io`. Il server scarta pesi impossibili, pesci presi nel mare sbagliato e catture troppo ravvicinate.

## Torneo dell'arena (`torneo.js`) — 1.1

**1.1** — 14 ottobre 2026
- Le pagine `/plugins/torneo/` (pubblica) e `/plugins/torneo/admin` hanno l'aspetto della guida e dei menu di Voxelia: Georgia, titolo oro con l'ombra ruggine su una barra di legno coi chiodi, pannelli col bordo pieno e l'ombra sotto, pulsanti blu-ardesia del gioco (dorati per le azioni, rossi per annullare), tabella dell'albo d'oro con l'intestazione di legno, sfondo a rombi. Si legge chiaro o scuro come il sistema e sta tutto nello schermo del telefono.
- Il tabellone mostra gli incontri come schede con il colore dello stato (oro chiamato, brace in corso, verde concluso), il podio come targhette e gli iscritti e i campioni come gettoni. Nella pagina admin le impostazioni (iscrizioni, attesa, durata, PvP) stanno in una riga di etichette e accanto a ogni stanza c'è lo stato del torneo.
- Comportamento, percorsi, dati e config invariati (provato sul server 7.11.1: pagina pubblica, pagina admin e il pulsante «Vince…» dell'admin).

**1.0** — 9 ottobre 2026
- Tabellone a eliminazione diretta per stanza, iscrizioni da pagina admin o a orario, passaggio del turno con iscritti dispari, finale per il terzo posto, sconfitta a tavolino, colpi degli spettatori scartati, albo d'oro.

## Caccia al tesoro (`tesoro.js`) — 1.1

**1.1** — 14 ottobre 2026
- Pagine web con l'aspetto di Voxelia e della guida: barra di legno coi chiodi in alto, titoli in Georgia oro con l'ombra ruggine, pannelli col bordo a cubetti e l'ombra piena, tabelle con l'intestazione di legno, pulsanti come quelli del gioco e icone voxel del gioco (chiave, mappa, coppa, pergamena, clessidra). Segue il tema chiaro o scuro del sistema e si legge bene anche sul telefono.
- Pagina pubblica `/plugins/tesoro/`: la caccia in corso è un riquadro con i minuti che mancano e gli indizi usciti in fila come tappe; sotto, Migliori cercatori e Ultime cacce affiancati. Una riga spiega il gioco e ricorda `/tesoro`.
- Pagina admin `/plugins/tesoro/admin`: impostazioni in tre etichette (ogni quanto, quanto dura, nascondigli validi), nascondiglio e indizi non ancora usciti nel riquadro della caccia, pulsanti Nascondi il tesoro ora (oro) e Annulla la caccia (rosso), nascondigli ignorati in un riquadro a parte, link alla pagina pubblica in alto.
- Percorsi, dati, comandi e comportamento nel gioco non cambiano; le pagine si aggiornano da sole come prima (30 secondi la pubblica, 20 l'admin).

**1.0** — 9 ottobre 2026
- Un tesoro ogni 40 minuti in 21 nascondigli, indizi a tappe, scintille quando si è vicini, premio al primo che arriva. Solo zone aperte dall'inizio e con mappa uguale in ogni stanza (verificate sulla 7.3.2).

## Premio giornaliero (`giornaliero.js`) — 1.0

**1.0** — 8 ottobre 2026
- `/giornaliero` e `/serie`: 7 premi crescenti nei giorni di fila, un premio al giorno per connessione, promemoria all'ingresso.

## Albo degli eroi (`albo.js`) — 1.2

**1.2** — 14 ottobre 2026
- La pagina `/plugins/albo/` ha l'aspetto dei menu di Voxelia e della guida: barra di legno con i chiodi in alto, titolo oro con l'ombra ruggine, schede col bordo e l'ombra piena sotto, Georgia come nel gioco e le icone voxel del gioco al posto delle emoji (arena, tornei, tesori, premio giornaliero, pesca, casa, pet).
- I primi tre eroi dell'ordinamento per livello, ore o arena hanno la medaglia d'oro, d'argento e di bronzo. In cima il conto degli eroi, di chi è online, il livello più alto e le ore di gioco in tutto.
- L'ordinamento si sceglie con dei pulsanti invece del menu a tendina e la pagina se lo ricorda. Tema chiaro e scuro automatico, con il pulsante «Tema» per sceglierlo.
- «1 giorni fa» diventa «1 giorno fa», sulla pagina e in `/albo`. Comandi, dati, indirizzi e privacy restano quelli della 1.1.

**1.1** — 14 ottobre 2026
- Link interi in chat: `/albo` con il tuo nome scrive l'indirizzo completo della pagina (es. `https://voxelia.esempio.it/plugins/albo/`), così dalla 7.11.1 si apre con un clic dalla chat. L'indirizzo è quello da cui l'eroe gioca, oppure `indirizzo` nel config.

**1.0** — 9 ottobre 2026
- Pagina web pubblica `/plugins/albo/` con una scheda per eroe: livello, ultima volta online, ore di gioco (contate dall'Albo con l'ingresso e l'uscita, più un controllo al minuto), punti e posizione nell'arena. Ricerca per nome e ordinamento per livello, ore, arena, visti di recente o nome; si aggiorna da sola e va bene su telefono.
- Aggiunge quello che sanno gli altri plugin, letto in sola lettura da `voxelia-data.json`: pesci e record della Gara di pesca, tornei vinti, tesori trovati, serie del Premio giornaliero, casa e pet. Non legge Guardiano, Posta e amici, Teletrasporto e Taglie, e non mostra stanze, codici, IP, depositi o statistiche dei pet.
- `/albo nome` in gioco mostra la scheda in breve. `/albo nascondi` toglie la propria scheda dalla pagina web (`/albo mostra` la rimette); l'admin può nascondere dei nomi con `nascosti` nel config.
- I bot dello stress test e chi si chiama ancora «Eroe» non compaiono. Provato sulla 7.3.2 insieme a tutti gli altri plugin, anche con Ricarica e uno stress test in corso.

## Guardie e ladri (`guardieladri.js`) — 1.2

**1.2** — 14 ottobre 2026 (provato sul server 7.11.1)
- Le pagine web (`/plugins/guardieladri/` e `/plugins/guardieladri/admin`) hanno l'aspetto dei menu di Voxelia e della guida: Georgia, titoli oro con l'ombra ruggine, barra di legno coi chiodi in alto, pannelli col bordo e l'ombra piena sotto, intestazioni delle tabelle in legno, pulsanti come quelli del gioco. Con il sistema in tema chiaro usano i colori pergamena della guida.
- Fase della partita, ruoli ed esito sono etichette colorate (iscrizioni, i ladri si nascondono, caccia; guardia, ladro); la tabella delle ultime partite ha le intestazioni; la pagina pubblica spiega in una riga come entrare (`/guardie entra`).
- Sui telefoni le tabelle scorrono dentro il loro riquadro e la pagina non scorre di lato.
- Stessi indirizzi, stessi dati, stesse azioni dell'admin (apri le iscrizioni, annulla la partita) e stessi aggiornamenti automatici (30 secondi la pubblica, 15 l'admin).

**1.1** — 10 ottobre 2026
- Durante la partita blocca anche `/hub`, pure su un server che ha già `guardieladri.config.json` con la lista vecchia di `comandiBloccati`.
- Per gli altri plugin: `globalThis.VoxeliaGuardieLadri.gioca(p)` dice se un eroe sta giocando una partita in corso.

**1.0** — 9 ottobre 2026
- Nascondino a squadre in un quartiere, una partita per stanza. Si apre con `/guardie apri` (o dalla pagina admin `/plugins/guardieladri/admin`), si entra con `/guardie entra`, anche chiedendo `ladro` o `guardia`. Le squadre si fanno a caso: una guardia ogni due ladri, almeno 3 giocatori.
- I ladri hanno un minuto per nascondersi mentre le guardie hanno lo schermo oscurato, poi 5 minuti di caccia. Il server cattura un ladro quando una guardia è nella sua zona a 2 caselle o meno. In chat si legge solo quanti ladri restano, i nomi escono alla fine.
- Quattro quartieri pronti: Aldoria con tutti i suoi edifici (di base), Quartiere Nobile, Campi e Mestieri, Porto. Chi ne esce è squalificato. Durante la partita `/tpa`, `/borgo`, `/visita` e `/discoteca` sono bloccati per chi gioca.
- Le guardie vedono i ladri solo entro 6 caselle, anche sulla minimappa. Nella lista dei giocatori, nella chat e nel profilo non compare la zona dei ladri.
- Contro i trucchi: ogni cambio di zona deve passare da una porta vera (mappa dei portali letta dal gioco 7.3.2) e nessuno può andare oltre 9 caselle al secondo. Dopo un movimento impossibile la guardia non cattura per 5 secondi, al terzo si è squalificati. Limite: un gioco modificato riceve comunque dal server la posizione di tutti.
- Premi: 150 oro e 100 XP a ogni ladro rimasto libero, 100 oro e 80 XP alle guardie se li prendono tutti, 25 oro per ogni cattura (sotto i 3 giocatori niente premi). Classifica con `/guardie classifica` e pagina pubblica `/plugins/guardieladri/`. I bot dello stress test non entrano in classifica.
- Provato sulla 7.3.2 con giocatori finti e con tre eroi nel gioco vero (Chromium), anche su schermo da telefono, con Ricarica a partita in corso e insieme a tutti gli altri plugin.

## Esempio (`esempio.js`) — 1.0

- I bot dello stress test non vengono contati in `/boss` — 9 ottobre 2026 (senza cambio di versione).
- Plugin dimostrativo fornito con il server: saluto, `/dado`, `/ora`, `/boss`, `/festa` e una pagina web.
