# Plugin di Voxelia

Metti qui i plugin del server. Vengono caricati all'avvio di `node server.js`, oppure subito con
**Plugin → Ricarica** nel pannello admin.

- Un plugin è un file `nome.js` oppure una cartella `nome/` con dentro `index.js`.
- I nomi che iniziano con `_` restano spenti: rinomina `_esempio.js` in `esempio.js` per provarlo.
- Dal pannello admin (pagina Plugin) puoi spegnere e riaccendere ogni plugin, e vedere errori, comandi e pagine.
- Un plugin che va in errore viene segnato nel registro e non ferma il server.
- **Attenzione:** un plugin è codice che gira sul tuo server con tutti i permessi. Installa solo plugin di cui ti fidi.

## Forma di un plugin

```js
module.exports = {
  name: 'Benvenuto', version: '1.0', author: 'Io', description: 'Saluta chi entra',
  defaults: { testo: 'Benvenuto su questo server!' },   // facoltativo: diventa nome.config.json, modificabile
  setup(api) {
    api.on('join', p => p.tell(api.config.testo));
    api.command('dado', 'tira un dado da 6', (p, args) => p.name + ' tira un dado: ' + (1 + Math.floor(Math.random() * 6)));
  },
  stop(api) { }                                         // facoltativo: quando il plugin viene spento o ricaricato
};
```

Va bene anche `module.exports = api => { … }`.

## L'oggetto api

| Funzione | A cosa serve |
|---|---|
| `api.on(evento, fn)` | Reagisce a un evento del server (vedi sotto). |
| `api.command(nome, descrizione, fn(p, args, testo))` | Aggiunge il comando di chat `/nome`. Se `fn` restituisce una stringa, la riceve chi ha scritto. `/aiuto` li elenca tutti. I nomi `aiuto`, `help`, `comandi`, `plugin` e `plugins` sono riservati. Con la chat spenta o per un giocatore silenziato i comandi dei plugin non funzionano. |
| `api.players(stanza?)`, `api.player(nomeOId)` | I giocatori online (tutti o di una stanza), o uno solo. |
| `api.rooms()` | Le stanze con i nomi dei giocatori. |
| `api.tell(p, testo)` | Messaggio privato nel registro della chat. |
| `api.say(stanza, testo)` | Messaggio in chat a una stanza, a nome del plugin. |
| `api.announce(testo, stanza?)` | Annuncio in evidenza a tutti o a una stanza. |
| `api.every(ms, fn)`, `api.after(ms, fn)`, `api.cancel(t)` | Timer, fermati da soli quando il plugin si spegne. |
| `api.store`, `api.save()` | Un oggetto tuo che resta tra un riavvio e l'altro (dentro voxelia-data.json). Chiama `api.save()` dopo averlo cambiato. |
| `api.config`, `api.saveConfig()` | La configurazione: `defaults` più il file `nome.config.json` (o `config.json` nella cartella del plugin). |
| `api.log(...)` | Scrive nel terminale e nel registro del pannello admin. |
| `api.route(metodo, percorso, fn(req, res, x), { admin })` | Una pagina o API web su `/plugins/<id>/<percorso>`. `x.json(obj)`, `x.send(html)`, `x.query`, `x.body(cb)`. Con `{ admin: true }` serve l'accesso al pannello. Un percorso che finisce con `/*` vale per tutto quello che segue. |
| `api.client(codice)` | Codice JavaScript aggiunto alla pagina del gioco. In una cartella-plugin basta un file `client.js`. |
| `api.onClient(evento, fn(p, dati))`, `api.broadcast(evento, dati, stanza?)` | Messaggi tra il codice nel gioco e il plugin sul server. |
| `api.server.cfg`, `api.server.setCfg({...})` | Leggere e cambiare le impostazioni del server (pvp, trade, chat, xpm, gm, motd, maxp, lock). |
| `api.server.clock()`, `api.server.leaderboard()`, `api.server.runs(stanza)` | Ora del mondo, classifica dell'arena, cicli dei dungeon di una stanza. |
| `api.id`, `api.name`, `api.dir`, `api.gameVersion`, `api.port` | Informazioni. |

## Eventi

| Evento | Argomenti | Note |
|---|---|---|
| `start` | | Il server è in ascolto (anche dopo Ricarica). |
| `stop` | | Il plugin viene spento, ricaricato, o il server si ferma. |
| `join` / `leave` | `p` | Un giocatore entra o esce. |
| `zone` | `p, zonaNuova, zonaVecchia` | Cambia zona (`town`, `forest`, `in_tavern`, `cripta@2`…). |
| `chat` | `p, testo, zona` | Restituisci `false` per bloccare il messaggio, o una stringa per cambiarlo. |
| `message` | `p, messaggio` | Ogni messaggio grezzo dal gioco (tranne presenza e ping). `false` lo blocca. |
| `arena` | `vincitore, sconfitto, punti` | Una vittoria nella fossa del Colosseo. |
| `dungeon` | `p, dungeon, nuovoCiclo` | Un boss di dungeon sconfitto. |
| `drop` / `pickup` | `p, oggetto` (/ `p, oggetto, daChi`) | Oggetti gettati a terra e raccolti. |
| `trade` | `a, b, datoDaA, datoDaB` | Uno scambio concluso. |

## Il giocatore `p`

Dati: `id, name, room, zone, x, y, lv, hp, maxHp, gold, difficulty, ping, ip, since, online`.
Azioni: `p.tell(testo)`, `p.give(tipo, quantità, rarità)` con tipo `gold`, `xp`, `pot`, `lv`, `item` (rarità 0-3),
`heal`, `tp`; `p.heal()`, `p.toTown()`, `p.kick(motivo)`, `p.send(evento, dati)` (al codice del plugin nel gioco).

## Codice nel gioco

Il codice aggiunto con `api.client` o `client.js` gira dopo il gioco e ne vede le variabili (`P` è l'eroe, `msg()` mostra un avviso,
`clog()` scrive in chat, `banner()` mostra un titolo grande, `NPCS` e `QT` sono personaggi e missioni…). Per parlare con il server:

```js
VXP.on('mioplugin', 'evento', dati => { … });   // dal server (p.send o api.broadcast)
VXP.send('mioplugin', 'evento', dati);          // al server (api.onClient)
```

Per un annuncio a schermo che salti chi è in un dungeon, nella Torre, nella fossa o vicino a un boss, copia da `boss.js` la funzione
`annuncioNelGioco` e `ANNUNCIO`: poi `api.client(ANNUNCIO(api.id))` e `api.broadcast('annuncio', { titolo, testo, icona }, stanza)`
(o `p.send('annuncio', …)` per un solo giocatore). Nel gioco si chiama `VXAnnuncio(titolo, testo, icona)`.

Il codice nel gioco arriva ai giocatori quando ricaricano la pagina.

## Bot dello stress test

Il plugin `stress.js` (pagina admin `/plugins/stress/`) collega al server dei bot finti. Un plugin che salva dati per giocatore
può saltarli così: `if (globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p)) return;` (lo fanno già posta, taglie, guardiano, notti ed esempio).
In modalità partita i bot usano anche i comandi elencati in `comandi` di stress.config.json: mettici solo comandi che non salvano dati.
