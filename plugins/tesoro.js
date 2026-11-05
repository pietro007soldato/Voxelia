// Caccia al tesoro: a intervalli il plugin nasconde un tesoro in uno dei nascondigli di tesoro.config.json
// e lo annuncia a tutti con un primo indizio; col passare del tempo arrivano indizi più precisi.
// Il server guarda dove sono i giocatori online e premia il primo che arriva abbastanza vicino.
// Quando un eroe è a pochi passi, nel suo gioco la casella del tesoro manda scintille dorate.
// Il tesoro si nasconde solo in zone che tutti possono raggiungere dall'inizio, senza missioni né cancelli
// (stesso criterio del Teletrasporto 1.2), e con una mappa che non cambia da una stanza all'altra:
// Foresta, Deserto, Picchi e dungeon sono esclusi perché le loro caselle cambiano in ogni stanza.
// Limite: la posizione arriva dal gioco del giocatore, quindi chi modifica il proprio gioco potrebbe falsificarla.

// zone dove il tesoro può stare, con la loro misura (verificate sul gioco 7.3.2: si raggiungono da Aldoria
// senza cancelli chiusi e la mappa è la stessa in ogni stanza; Nord, Est e Porto cambiano solo qualche cespuglio)
const APERTE = {
  town: 72, arena: 40, nord: 56, campi: 56, porto: 56,   // il Colosseo dalla 7.12 è 40×40 (prima 30)
  in_castle: 16, in_library: 12, in_tavern: 14, in_house1: 8, in_alch: 10, in_smith: 11, in_temple: 13, in_house2: 8, in_casino: 16,
  in_house3: 8, in_panetteria: 12, in_sartoria: 12, in_caserma: 16, in_scuderia: 14, in_osservatorio: 12, in_municipio: 16, in_motel: 16, in_motel2: 18,
  cas_galleria: 14, cas_consiglio: 14, cas_cucine: 12, cas_appartamenti: 14, cas_armeria: 12, cas_archivio: 12, cas_prigioni: 13,
  lib_archivio: 12, tav_camere: 12, tav_cantina: 12, tem_cripta: 12, casino_vip: 12, bar_dorm: 12, oss_cupola: 12, mun_piano: 12,
  in_palazzo: 16, in_banca: 14, in_teatro: 16, in_villa1: 16, in_villa2: 16, in_villa3: 16, in_villa4: 16, in_villa5: 16, in_villa6: 16,
  in_segheria: 14, in_fattoria: 14, in_fienile: 14,
  in_faro: 10, in_locanda: 16, in_capitaneria: 14, in_magazzino1: 14, in_magazzino2: 14, in_pescheria: 14, in_cantiere: 14,
  in_casa_p1: 12, in_casa_p2: 12, in_casa_p3: 12, in_casa_p4: 12, in_galeone: 16
};
const MIN = 60000;

// codice nel gioco: scintille sulla casella del tesoro quando il server dice che sei vicino, e la festa per chi lo trova
function nelGioco(ID) {
  const opz = f => { try { return f(); } catch (e) { return undefined; } };
  let qui = null, detto = false;
  VXP.on(ID, 'vicino', d => { if (!qui || qui.zk !== d.zk || qui.x !== d.x || qui.y !== d.y) detto = false; qui = d; if (!detto) { detto = true; opz(() => msg('✨ Qualcosa luccica qui vicino...')); } });
  VXP.on(ID, 'fine', () => { qui = null; detto = false; });
  VXP.on(ID, 'trovato', d => {
    if (qui && opz(() => Zk) === qui.zk) opz(() => burst(qui.x + .5, qui.y + .5, 40, ['#ffd700', '#fff6a0', '#ffb030'], { v: 1.4, up: 200, gr: 40 }));
    qui = null; detto = false;
    if (d && d.tuo) { opz(() => VXAnnuncio('Tesoro trovato!', d.testo || '', 'forziere')); opz(() => jingle([72, 76, 79, 84], .14, 'triangle')); }
    else if (d && d.chi) opz(() => VXAnnuncio('Tesoro trovato', d.chi + ' ha trovato il tesoro' + (d.dove ? ' presso ' + d.dove : ''), 'forziere'));
  });
  setInterval(() => {
    if (!qui || opz(() => Zk) !== qui.zk || !opz(() => started)) return;
    const dx = opz(() => P.px) - (qui.x + .5), dy = opz(() => P.py) - (qui.y + .5);
    if (!(Math.hypot(dx, dy) < 9)) return;
    opz(() => sparks(qui.x + .5, qui.y + .5, 4, ['#ffd700', '#fff6a0', '#ffffff'], 60));
  }, 300);
}

// nascondigli predefiniti: casella (x, y) libera in ogni stanza, nome per gli annunci, tre indizi dal più vago al più preciso
const NASCONDIGLI = [
  { zona: 'town', x: 42, y: 29, nome: 'il pozzo del mercato', indizi: ['Il tesoro è in città, dove i mercanti gridano i prezzi.', 'Cerca a est della fontana, tra le bancarelle del mercato.', 'È proprio sotto il pozzo del mercato, sul lato sud.'] },
  { zona: 'town', x: 47, y: 47, nome: 'il grande albero del parco', indizi: ['Il tesoro riposa all\'ombra, nel verde della città.', 'Cerca nel parco a sud-est della piazza della fontana.', 'È ai piedi del grande albero al centro del parco, appena a sud.'] },
  { zona: 'town', x: 6, y: 13, nome: 'il cortile del castello', indizi: ['Il tesoro è dove abita chi porta la corona.', 'Cerca nel cortile davanti al Castello, a nord-ovest di Aldoria.', 'È tra i due alberi del cortile, a sinistra della Guardia del Castello.'] },
  { zona: 'town', x: 62, y: 12, nome: 'le aiuole dell\'Osservatorio', indizi: ['Il tesoro passa le notti a guardare le stelle.', 'Cerca nell\'angolo nord-est di Aldoria, davanti all\'Osservatorio.', 'È tra i cannocchiali e le aiuole, tre passi sotto la porta dell\'Osservatorio.'] },
  { zona: 'town', x: 15, y: 62, nome: 'l\'ancora del lungomare', indizi: ['Il tesoro sente l\'odore del mare, ma non è al Porto.', 'Cerca sul lungomare di Aldoria, nella parte ovest.', 'È accanto all\'ancora più a ovest del lungomare, verso l\'acqua.'] },
  { zona: 'town', x: 65, y: 49, nome: 'il recinto di Saetta', indizi: ['Il tesoro ha visto passare più zoccoli che stivali.', 'Cerca vicino alla Scuderia, nella parte est di Aldoria.', 'È dentro il recinto dei cavalli, dove pascola Saetta.'] },
  { zona: 'town', x: 8, y: 45, nome: 'il vecchio cimitero', indizi: ['Il tesoro dorme accanto a chi non si sveglia più.', 'Cerca a sud-ovest di Aldoria, dietro una recinzione.', 'È tra le lapidi del vecchio cimitero, appena sotto la piccola cripta.'] },
  { zona: 'town', x: 61, y: 30, nome: 'il giardino del Municipio', indizi: ['Il tesoro è dove si scrivono le leggi della città.', 'Cerca nel giardino davanti al Municipio, a est di Aldoria.', 'È appena a sud dell\'albero, tra le siepi del giardino del Municipio.'] },
  { zona: 'town', x: 40, y: 13, nome: 'l\'ingresso del Colosseo', indizi: ['Il tesoro sente le grida della folla.', 'Cerca fuori dal Colosseo, a nord di Aldoria.', 'È all\'angolo sud-ovest del Colosseo, a pochi passi dal Tabellone dell\'Arena.'] },
  { zona: 'town', x: 22, y: 11, nome: 'il giardino della Biblioteca', indizi: ['Il tesoro ama il silenzio e i libri.', 'Cerca davanti alla Biblioteca Arcana, a nord di Aldoria.', 'È tra le due panchine del giardino, appena sotto la porta della Biblioteca.'] },
  { zona: 'porto', x: 47, y: 44, nome: 'il Faro', indizi: ['Il tesoro aspetta dove finisce la terra.', 'Cerca al Porto, sulla punta del molo a est.', 'È ai piedi del Faro di Aldoria, appena sotto la sua porta.'] },
  { zona: 'porto', x: 47, y: 23, nome: 'le reti dei pescatori', indizi: ['Il tesoro è rimasto impigliato.', 'Cerca al Porto, vicino alla Capitaneria.', 'È appena sopra le reti stese ad asciugare, a est della Capitaneria.'] },
  { zona: 'porto', x: 4, y: 26, nome: 'l\'ancora del molo ovest', indizi: ['Il tesoro ha gettato l\'ancora.', 'Cerca al Porto, all\'estremità ovest della banchina.', 'È accanto alla grande ancora a ovest, sotto la Locanda del Gabbiano.'] },
  { zona: 'nord', x: 18, y: 50, nome: 'il roseto', indizi: ['Il tesoro profuma di rose.', 'Cerca nel Quartiere Nobile, nella parte sud-ovest.', 'È nel roseto del Giardiniere Fiore, tra le aiuole.'] },
  { zona: 'nord', x: 28, y: 28, nome: 'la vasca del Quartiere Nobile', indizi: ['Il tesoro si specchia nell\'acqua dei nobili.', 'Cerca nella piazza al centro del Quartiere Nobile.', 'È appena a sud della grande vasca della piazza.'] },
  { zona: 'nord', x: 33, y: 37, nome: 'il giardino delle siepi', indizi: ['Il tesoro si è perso tra le siepi.', 'Cerca nel Quartiere Nobile, nei giardini a sud della piazza.', 'È nel giardino di siepi a est, vicino all\'albero.'] },
  { zona: 'campi', x: 36, y: 36, nome: 'il frutteto', indizi: ['Il tesoro è maturo al punto giusto.', 'Cerca ad Aldoria Est, nei Campi e Mestieri.', 'È in mezzo al frutteto, tra i meli.'] },
  { zona: 'campi', x: 18, y: 43, nome: 'il pollaio', indizi: ['Il tesoro è stato covato con cura.', 'Cerca ad Aldoria Est, vicino alla Casa della Fattoria.', 'È dentro il pollaio, tra le galline e le uova.'] },
  { zona: 'in_tavern', x: 11, y: 2, nome: 'il camino della Taverna', indizi: ['Il tesoro si scalda vicino al fuoco.', 'Cerca alla Taverna del Drago Ubriaco.', 'È accanto al camino, in fondo a destra dietro il bancone.'] },
  { zona: 'in_library', x: 5, y: 1, nome: 'gli scaffali della Biblioteca', indizi: ['Il tesoro è nascosto tra le pagine.', 'Cerca dentro la Biblioteca Arcana.', 'È in fondo alla sala, tra i due scaffali centrali, dietro il Saggio Elandor.'] },
  { zona: 'in_temple', x: 10, y: 1, nome: 'l\'altare del Tempio', indizi: ['Il tesoro è stato benedetto.', 'Cerca dentro il Tempio della Luce.', 'È in fondo al tempio, a destra dell\'altare, vicino alla pianta.'] }
];

// ---------- annuncio a schermo, come «Giorno N» o il level up ----------
// Nel gioco: VXAnnuncio(titolo, testo, icona, soloRegno) mostra uno stendardo al centro dello schermo, ma non a chi è in un posto
// impegnativo (dungeon, Torre, fossa del Colosseo, battaglia in mare, missioni delle dimensioni, sogno, scena) o vicino a un boss
// sveglio: a lui resta il messaggio in chat. Lo stesso codice è in tutti i plugin a eventi: lo usa la versione più nuova.
function annuncioNelGioco() {
  const V = 1;
  if (globalThis.VXAnnuncio && globalThis.VXAnnuncio.v >= V) return;
  const opz = f => { try { return f(); } catch (e) { return undefined; } };
  const impegnato = () => {
    if (!opz(() => started)) return 'scena';                                    // menu, caricamento, filmati
    const z = opz(() => ZZ) || {}, k = String(opz(() => Zk) || '');
    if (z.dg || /^twd_/.test(k)) return 'dungeon';
    if (z.torre || /^torre\d+$/.test(k)) return 'torre';
    if (/^dim_/.test(k) && k !== 'dim_hub') return 'dimensione';
    if (opz(() => NAV)) return 'mare';
    if (opz(() => DREAM)) return 'sogno';
    if (opz(() => inPit(P.px, P.py))) return 'fossa';
    if ((opz(() => CAM.t) || 0) > 0) return 'scena';
    if (opz(() => ents.some(e => e.boss && e.hp > 0 && (e.al || e.wb) && dist(e, P) < 14))) return 'boss';
    return '';
  };
  const VXAnnuncio = (titolo, testo, icona, soloRegno) => {
    if (impegnato() || (soloRegno && opz(() => twOn()))) return false;
    opz(() => banner(String(titolo || ''), String(testo || ''), icona || 'stella'));
    if (opz(() => cineOK())) opz(() => { $('msg').style.display = 'none'; });  // lo stendardo prende il posto dell'avviso in alto
    return true;
  };
  VXAnnuncio.v = V; VXAnnuncio.impegnato = impegnato;
  globalThis.VXAnnuncio = VXAnnuncio;
}
// da mettere con api.client: definisce VXAnnuncio e mostra gli annunci che il plugin manda con l'evento «annuncio»
const ANNUNCIO = id => '(' + annuncioNelGioco.toString() + ')();VXP.on(' + JSON.stringify(id) + ',"annuncio",d=>{if(d&&globalThis.VXAnnuncio)VXAnnuncio(d.titolo,d.testo,d.icona,d.regno)});';

module.exports = {
  name: 'Caccia al tesoro',
  version: '1.3',
  author: 'Voxelia',
  description: 'Un tesoro nascosto in città, indizi a tappe e un premio al primo che lo trova (/tesoro)',
  defaults: {
    ogniMin: 40,              // minuti tra la fine di una caccia e l'inizio della successiva
    primaMin: 5,              // minuti dall'avvio del server alla prima caccia
    durataMin: 15,            // dopo quanti minuti, se nessuno l'ha trovato, il tesoro sparisce
    indiziMin: [0, 5, 10],    // quando esce ciascun indizio, in minuti dall'inizio della caccia
    minGiocatori: 1,          // la caccia parte solo con almeno questi eroi online
    raggio: 1.6,              // quanto vicino (in caselle) bisogna arrivare per trovarlo
    premio: { oro: 300, xp: 200, rarita: 2 },   // rarità dell'oggetto in regalo: 0-3, oppure -1 per nessun oggetto
    // zona, casella (x, y), nome mostrato quando la caccia finisce e indizi dal più vago al più preciso.
    // Valgono solo le zone aperte a tutti con una mappa uguale in ogni stanza (vedi APERTE in tesoro.js).
    nascondigli: NASCONDIGLI
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, ID = api.id;
    const S = api.store;
    if (!S.vinti || typeof S.vinti !== 'object') S.vinti = {};    // nome in minuscolo → { nome, n }
    if (!Array.isArray(S.storico)) S.storico = [];                // ultime cacce: { quando, dove, chi }
    if (!Array.isArray(S.ultimi)) S.ultimi = [];                  // nascondigli usati di recente (per non ripeterli)
    const vicini = new Map();                                     // id giocatore → chiave del tesoro di cui ha già le coordinate

    const num = (v, d, a, b) => { const n = +v; return isFinite(n) ? Math.max(a, Math.min(b, n)) : d; };
    const ogni = () => num(C.ogniMin, 40, .2, 1440) * MIN, durata = () => num(C.durataMin, 15, .2, 600) * MIN;
    const tappe = () => (Array.isArray(C.indiziMin) && C.indiziMin.length ? C.indiziMin : [0, 5, 10]).map(m => num(m, 0, 0, 600) * MIN);
    const raggio = () => num(C.raggio, 1.6, .8, 6);

    // un nascondiglio vale solo in una zona aperta a tutti, dentro la mappa e con almeno un indizio
    function problema(s) {
      if (!s || typeof s !== 'object') return 'non è un oggetto';
      if (!APERTE[s.zona]) return 'la zona "' + s.zona + '" non è aperta a tutti fin dall\'inizio o cambia da una stanza all\'altra';
      const n = APERTE[s.zona];
      if (!Number.isInteger(s.x) || !Number.isInteger(s.y) || s.x < 1 || s.y < 1 || s.x > n - 2 || s.y > n - 2) return 'casella fuori dalla mappa (' + s.zona + ' va da 1 a ' + (n - 2) + ')';
      if (!Array.isArray(s.indizi) || !s.indizi.some(t => typeof t === 'string' && t.trim())) return 'manca almeno un indizio';
      return '';
    }
    const lista = Array.isArray(C.nascondigli) ? C.nascondigli : [];
    const validi = [];
    lista.forEach((s, i) => { const p = problema(s); if (p) api.log('nascondiglio ' + (i + 1) + ' ignorato: ' + p); else validi.push(i); });
    if (!validi.length) api.log('nessun nascondiglio valido in tesoro.config.json: la caccia non partirà');
    const nomeDi = s => String(s.nome || s.zona).slice(0, 60);
    const indizi = s => s.indizi.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim().slice(0, 130));

    const salva = () => api.save();
    const caccia = () => S.attiva && lista[S.attiva.i] && !problema(lista[S.attiva.i]) ? S.attiva : null;
    if (S.attiva && !caccia()) { S.attiva = null; salva(); }   // il nascondiglio è stato tolto o cambiato nel config
    if (!(S.prossima > 0)) { S.prossima = Date.now() + num(C.primaMin, 5, 0, 1440) * MIN; salva(); }

    // gli indizi usciti finora, con quanto manca alla fine
    function stato() {
      const A = caccia();
      if (!A) {
        const m = Math.max(0, Math.ceil((S.prossima - Date.now()) / MIN));
        return 'Nessun tesoro nascosto in questo momento. ' + (m > 0 ? 'La prossima caccia inizia tra circa ' + m + ' min.' : 'La prossima caccia inizia appena ci sono abbastanza eroi online.');
      }
      const s = lista[A.i], L = indizi(s).slice(0, A.dati), m = Math.max(1, Math.ceil((A.fine - Date.now()) / MIN));
      return '🗝 C\'è un tesoro nascosto! Sparisce tra ' + m + ' min.\n' + L.map((t, k) => 'Indizio ' + (k + 1) + ': ' + t).join('\n');
    }

    function nascondi(scelta, chi) {
      if (caccia()) return 'C\'è già una caccia in corso.';
      let i = scelta;
      if (i == null) {
        if (!validi.length) return 'Nessun nascondiglio valido nel config.';
        const lib = validi.filter(k => !S.ultimi.includes(k)), pool = lib.length ? lib : validi;
        i = pool[Math.floor(Math.random() * pool.length)];
      } else if (!validi.includes(i)) return 'Nascondiglio non valido.';
      const ora = Date.now();
      S.attiva = { i, inizio: ora, fine: ora + durata(), dati: 0, k: ID + ':' + ora };
      S.ultimi = [i].concat(S.ultimi.filter(k => k !== i)).slice(0, Math.min(5, Math.max(0, validi.length - 1)));
      salva(); vicini.clear();
      api.log('tesoro nascosto: ' + nomeDi(lista[i]) + ' (' + lista[i].zona + ' ' + lista[i].x + ',' + lista[i].y + ')' + (chi ? ' da ' + chi : ''));
      indizia(true);
      return '';
    }
    // esce l'indizio successivo quando è il suo momento
    function indizia(primo) {
      const A = caccia(); if (!A) return;
      const L = indizi(lista[A.i]), T = tappe(), dopo = Date.now() - A.inizio;
      let nuovo = -1;
      while (A.dati < L.length && (A.dati === 0 || dopo >= (T[A.dati] != null ? T[A.dati] : T[T.length - 1] + (A.dati - T.length + 1) * MIN * 5))) { nuovo = A.dati; A.dati++; }
      if (nuovo < 0) return;
      salva();
      const t = L[nuovo];
      if (primo) { api.announce('🗝 Caccia al tesoro! Primo indizio: ' + t); schermo('Caccia al tesoro!', t, 'forziere'); }
      else { api.announce('🗝 Indizio ' + (nuovo + 1) + (nuovo === L.length - 1 ? ' (l\'ultimo)' : '') + ': ' + t); schermo(nuovo === L.length - 1 ? 'Ultimo indizio' : 'Nuovo indizio', t, 'pergamena'); }
    }
    function chiudi() { S.attiva = null; S.prossima = Date.now() + ogni(); salva(); vicini.clear(); api.broadcast('fine', {}); }
    function scaduta() {
      const A = caccia(); if (!A) return;
      const s = lista[A.i];
      S.storico.unshift({ quando: Date.now(), dove: nomeDi(s), chi: null }); S.storico = S.storico.slice(0, 30);
      chiudi();
      api.announce('Nessuno ha trovato il tesoro: era nascosto presso ' + nomeDi(s) + '. Prossima caccia tra ' + Math.round(ogni() / MIN) + ' min.');
    }
    function trovato(p) {
      const A = caccia(); if (!A) return;
      const s = lista[A.i], P = C.premio && typeof C.premio === 'object' ? C.premio : {};
      const oro = num(P.oro, 0, 0, 1e6) | 0, xp = num(P.xp, 0, 0, 1e6) | 0, r = num(P.rarita, -1, -1, 3) | 0;
      try { if (oro > 0) p.give('gold', oro); if (xp > 0) p.give('xp', xp); if (r >= 0) p.give('item', 1, r); }
      catch (e) { api.log('premio non consegnato a ' + p.name + ': ' + (e && e.message || e)); }
      const k = p.name.toLowerCase(), v = S.vinti[k] || (S.vinti[k] = { nome: p.name, n: 0 }); v.nome = p.name; v.n++;
      S.storico.unshift({ quando: Date.now(), dove: nomeDi(s), chi: p.name }); S.storico = S.storico.slice(0, 30);
      const premio = [oro > 0 && oro + ' oro', xp > 0 && xp + ' XP', r >= 0 && 'un oggetto ' + ['comune', 'non comune', 'raro', 'epico'][r]].filter(Boolean).join(', ');
      for (const o of api.players()) o.send('trovato', o.id === p.id ? { tuo: 1, testo: premio ? 'Hai vinto ' + premio : '' } : { chi: p.name, dove: nomeDi(s) });
      chiudi();
      api.announce('🏆 ' + p.name + ' ha trovato il tesoro presso ' + nomeDi(s) + '!' + (premio ? ' Premio: ' + premio + '.' : ''));
      api.log(p.name + ' ha trovato il tesoro (' + nomeDi(s) + ')');
    }

    // ogni secondo: indizi, scadenza, chi è vicino e chi l'ha trovato
    api.every(1000, () => {
      const A = caccia(), ora = Date.now();
      if (!A) { if (ora >= S.prossima && validi.length && api.players().length >= num(C.minGiocatori, 1, 0, 100)) nascondi(); return; }
      if (ora >= A.fine) { scaduta(); return; }
      indizia(false);
      const s = lista[A.i], R = raggio();
      let primo = null, d0 = Infinity;
      for (const p of api.players()) {
        if (p.zone !== s.zona) continue;
        const d = Math.hypot(p.x - (s.x + .5), p.y - (s.y + .5));
        if (d <= R && d < d0) { primo = p; d0 = d; }
        // a pochi passi il gioco riceve la casella per le scintille (una volta per giocatore e per caccia)
        if (d <= 7 && vicini.get(p.id) !== A.k) { vicini.set(p.id, A.k); p.send('vicino', { zk: s.zona, x: s.x, y: s.y }); }
      }
      if (primo) trovato(primo);
    });

    api.client('(' + nelGioco.toString() + ')(' + JSON.stringify(ID) + ');');

    api.on('join', p => { if (caccia()) api.after(3000, () => { const o = api.player(p.id); if (o && caccia()) o.tell(stato()); }); });
    api.on('leave', p => vicini.delete(p.id));

    api.command('tesoro', 'la caccia al tesoro: indizi usciti finora (/tesoro classifica per i migliori cercatori)', (p, args) => {
      if (/^(classifica|top)$/i.test(args[0] || '')) {
        const L = Object.values(S.vinti).sort((a, b) => b.n - a.n).slice(0, 10);
        return L.length ? 'Migliori cercatori di tesori:\n' + L.map((v, k) => (k + 1) + '. ' + v.nome + ' (' + v.n + ')').join('\n') : 'Nessuno ha ancora trovato un tesoro.';
      }
      return stato();
    });

    // pagine web: pubblica con gli indizi usciti e la classifica, admin con il nascondiglio e i pulsanti
    // aspetto dei menu di Voxelia e della guida: Georgia, oro con l'ombra ruggine, barra di legno coi chiodi,
    // pannelli col bordo a cubetti e l'ombra piena sotto, icone voxel del gioco; chiaro o scuro come il sistema
    const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const ICO = {
      key: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAC9klEQVR4AexWTWsUQRCtWSTExUUxKIpBBCNiAgHBL8hFvaxe16NeBP9BwMvqTdTf4FkFLzkKexByEDx4URElePEDUYwExRAlHib7htSkpme6u3Y2O5kss/Do7ql61f26quit0RD9KjFlTWaVmSozBdxAVWYFXHKuLXrKzNXz+8NekOtEfZDUYu5cOxKeGK+TFn2cKTdVJQZCcu9QINErJpy/GLbbk6TBhek9BR49vZVTDPoDlN+vf5EG8GWM7B0h8CXYNqjRKgalhf7Is/HooZ10tL4j0V954vTKyRQDIRxorvOdnnUzowE4EPLv619MC0dKjOwR9EDr9iS17p5WYdfxBs1ePhj3F/hFKkqIQX1jc+4PzCMsLBJpEDlT3F/ry3hA/EEiFoPSytsj8WkdE8QeJLB1JAZCsABkj2DdefyJOs8XrYBPWVBz9Qh64O2HZQKePP1Gl268DEzQ4bpVy1TXpnmf8vrInsQhosxYewQefYJjD2I0jxaJMT9u1/Wmi5E9p3mbevVxXfSmipnuvjPaNymP38S5Mdp9YNSqRy1mdWmVrrfGQxOpyJr3KK9ParPkB5UY/D05eXaMpo41UkiG29pVTdY4jiLfFawhBP+3MNfA9SZl2cyYpo9pd61rV+69CxgzN18FzYkGNWf2RVhe+EPtB6do9v4ZK+jzShz/Tddf8pvrcWxjY+k/yXfK5Jv2eCPLJLPM+E2IOa4aj502Jsz3jRuM5Ix5ya/u1aP5H0GmGDetfNZbDz8GOFVKjKuHzHo21wgo+b43BP5mj0q+xs5C4JsSw/2D0ewhW+3zd/TY+y8rBMy9+EmI4YIZ3+Rr7BDBSIlhgxy5hn2j5KCG5do157jSR/J9duapxLCzdpSp13Kkn49vs3vFyBrW9IBtI3lYOZfx8d3k++zgMLxiXDVv2lDjHFg7yhhZfJ9d7uMVI53LPq/ElDVDQ5EZvtxKDN9E2cYqM2XLCJ+nygzfRNnGKjNlywifp8oM30TZxqHKzBoAAAD//yYlVPMAAAAGSURBVAMApTGzlNH0p9gAAAAASUVORK5CYII=',
      trophy: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAD7ElEQVR4AexYW0tUURReZyiwgQHBMkQTwy6YMRF0gaSoKKaeostDUC9R/8AuD/bQQ1BB9AMi6CErevEphHkQhILACrKkQQRL0xyaUisbRclT34F13LNnz7kf52QKn3udvdZe+/vcZ7vXPjFaQj/LYqK6mP/vypw7UaeXE3ZvhOOVuX2lSW/emKBywU4I/I7EQAiCow5bMXr+lN56cxeVA4f3rHb19ysQc2Z/tS4C+8PI1p8jKgeMyRd+gY8IkStsU8z1sw16U12cGNt3Vxn7YyFVeS15rzbGV5hcwRnsDDEQggdGRe0qNiPZzoxOK3nF9O6DelvbFgIOJCup7e6Ogv1Bw3nlwMXoTG5OFHDBHmo9WmNwZb4iD2NlvvdOEmA6xP1hdpbJUHABV0BmZIiRO//V5yIx6UdDlH6eMyELE32wZX/Qz5iDYZe7SMyr7hwBD9qH6MiFlxrVx80cb/t/Uup8j4manfdI9JuBARmYr29gioAnnWO07dgzzSp1kRir4Kj7lsVEdYWWzMrgD1xSzMPuLxrqHQRFBVZ8wFcp5mr7Rw0lDtc8URDDtZiKC/iiP9aRzlLX3woAQAccEAJbhXQ6TQyVP4w+sRZT8eU5YydvvNcYLZffaHKtxoFoUSulUo+JkUzeobBrN7kWy3zKE9Dx4iuBL3gxlK8Z6h6AgwpasVaCXeAM5wFcADE79oj4DFspBo4oA1tBxa9IjPxO2tVqqqR++rgOQ4s8Mp9SQhBbJIb3D1q8k6jPRCx2LQYeDPAB6VIoElMqcLH773eMWBaVKj6RFHPxVsa1EIhzLUbeQ3i3RSCpFcRY2cY4r0Iw1rUYcf/ATm1IUKpljYHE+Jzl/Qb3EzkedycA9ye7+woIW8G1GFUynAGAyqfqQywg+lTnhuh3YgcixslEVjFW/26txsk+32Lkc0CeQH6W44MSgnl8i+EzAK3dOYAJP8zrBDzt/1FUW8HvB77FiJNb3TfEONiz47OEeBHo94PAxODa4PT+g5IesSL8iOCxgYiBEE5odQ4hBkLQhgHfYsT7D77/8pmjapObEuZ3YsTi23YQojiHLzF7m9fqSIQzwwswljGc0wj5RLDPaetZzOl96/XaqoWvnU4nVMX1DWuEXCJUcXZ9nsRACCcWzw18R3AD5IAQtEHAtZjOa4f0S8e3EqOhupG8omLlOjMP8jXXV/rS5FoMZns3NEFhALkZ2W9TbDpuPYlxnN1j4ODIpKeRrsV09Y6FsipYaSjwKgRjXYv5nZ+m+PxcKHidyYKTZ7gWg5lGJ2YoDCA3YyD7y/XV2ZMYnjCstmdwwrUQcHEtJvN5KpRVwUqDkFchGPsHAAD//6OKR+kAAAAGSURBVAMADSwTjYe5sjgAAAAASUVORK5CYII=',
      map: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAADv0lEQVR4AexYTUgVURQ+vkUtTKWgrEUYoVCboiAMpN2DIjdFiYtw8YoW5S5q4cJVUKv2tWgVCVabKBHRSkJcZD9YLQx7lrSwp/1Q1EKEbL5HZzhz3517586MMU8UP+65956f+znnc967OVpFP2tksvowV++TOZnfu1zN8J9Mz5n8ckvTZqpWoPXLZEAEk2pHbunFteUrl09RNaJt387A37/8ZIovi1SNCDDxJmUy3rgqfivIPPWekgkrzdpUG3um+gEyUx/n6Ul3K030HtHi9u56atq20ZQv0R7qj+f76E2XHnfqLhjrB8jwSUqTRdKB91d6nHu1SDrY6mrJ2IKyuu9M5tbAc0LvMpIS4zwYk+ZyItPQ0hjQUlINTXkalRp51H6Dfn1ejM3JiQyqSC1hngakPpLkcyaTpNhKx1aQmemfoNK499/sH9QDmPZUX8yhBQmsSUwPPvT+cw2HQvra7ACZXTu20NixvI+eP7VUu32Tn+PHdIlGW/f7+yNtB2l27ru/rxrQROF1jgrFujKah0uB9wTqjZ77QmG41PiANmxdr6bVzrEYIIMF+RkNcx2i+Mi4rwvzBMg1tmUu1WafqGMFmaiBWfSzkpkRGopCQNXH3dkP9Nh7MgDiXd9TUlOIN8FIBj09JjTkqpH6/vd0/PoJ6rh/toyfnc1k0pB6UNSXehrsfGvUqJEMksfpY+gDQDzAOWAD2ANg28CxPJr8rWRMwVnbS0zGphGVcFINqfnkPBEZ9T2iauRQf1egx6EB1g9GVw3Jg+vsRGQ4Ifof4Dn3N0Ze4xFrDF5DLMDzuGMqZOIWTzvOmYyrRmwHTlNDTmRcNWIjkraGnMjw4dDfAM9ZAxh5LeqIGAbHIDfA86hjLDJRk/9vPyuZpBqR8TpbJaxqSN03zY1kkmoE8S73cKqG1PeUiQj2jGTgAKB/AdgA9zhGzG2Q9wbS1sUhp4TOJ2wtEpmw4KytV5CRfY3DuvawGo8cJrh+vzHlCpBBjxcuLlGhd10Z7d2L1PGsxUeDt2dKhnipkYHuNvr96VtoSFr3cFwgQIYX6d0CaeE7mA2bLmS0i6+M09l6MjrPKlhLnYy8M8Adm/o3wFoYVF/Xeapk8J6Qdwa2ezfpC9t2x2AjlyoZFIvyjpA+qo0ccZE6mbgHSSOugsxQ3ywNjS1oEaeg1FCceJeYABn0/OGj5ykMew6cDnyntxVCPmiBkVQTtnoBMnBWe1idw8cFSeOj1ro3MllTQSZqcJb8rt4cqcF5cupnI/nZKus2CDAR2H8BAAD//5ZUKl4AAAAGSURBVAMAigw0Z1Vgw1kAAAAASUVORK5CYII=',
      scroll: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAC1klEQVR4AeyZy2oUQRSGTyS4EAQvYDKIlyCCEEFcCG7iyhdw59pn0J2CK1HQpU+gC3dBRdGFIBHBSy4kISQkDJNZJCE3BpIQQhaZ5A+cUKnunu5TdaprIAn8VHe66pzzVXXNP0OdIMFfX29XM6bySi0M8/BeT/Pi+VMUS3kgeF4IBiDo3O7Khfn6/H7zyYObFEO9l8+I5q8lDPYHoo3XGxRDyM3qqnQT6jHFz7jNhMGrhf3BHWO2PdevUef22qH9mlZPKgxAuPOP0YUoq4I3ATUApDZTxWWuEjDmHsE7+/LpI3r99nEU3b57h/ou0cF+RT2tiBIw6IxZgXANVYerFEPIDaEWCNesXxOLHXzNbSoMP2zX9sNALQGCWhMw5h5Bh9iy68kCQZ0JmDf9Ex2sZ+9HUmcAA8vSyXMVgurrnZRXTwKmrCJD5DnaMAN7n2wh5bNiopWZml2isd9/qTY0FESfPv6kK5WzzjwiGM4y19iiEOL4rq0TjGuy0OPEMJPzG0FWBSvtCyuCuXH1An37/iqY+j+/oPpCw4kJg0QwGBD6OxpyuEoM45qojHFiGG2P0YQUwWj7jK+v2BMhguHB+OTREMfTap1gtJJrxxHDaPpMVBhtn/H1FXsyxCuj7TN2QT73YhifZKHHimG0fcaO5wMsgtH2Gft3ka/viGB41jQ8Ji0Gx3dtnWBck4UeJ4bR9Bl7dXxhRTDaPmP/NvL1HREMZk7bZ+x4yOEqMYxrojLGiWFsX5Deh4QSwfj6jK+PZE0E/78lDM4PuaPZ2p9CRe/NGC7XqMeUHSMTBkeB7XKmiaJVzjQRyJSPz5hxJNdqZ5pmUl+fcfER9TNNE8j2Bem9GavoNc4zIbP/8Znmuy+DJPUSrf5YCdUzze6dZbp1eiOKRv78p7nVzX39m17ROdPE+xpDWBlW2h7hZ9xm+gx3aIe21XG5WV8ujPnOlr06KLQoCPruAgAA//9yf29DAAAABklEQVQDAFnCA8AiBfgbAAAAAElFTkSuQmCC',
      hglass: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAES0lEQVR4Aexaz0tUURQ+U9DCEAIDA8VoESGKtggXQlGU4KIfKEIu3Ej+A6IWZEEbzcCW7goXDZYb3QkDBaJBWoRoikiLUAMVF0GGq+Ll9+TonfPufe/d9940IyR+c3+cc8+538z5uL7xHiOfn8tVpU4hQ27dSKb1yjmnrKSIChWSCMZaMiAC41GDh8zEkxtOT1M1FSKqKk75vr8eMvD+svqDChHYG2N6aSvFfW61ZNhYqO2bqW8eItirh8y7+Y2C/FRQKdiwiQhsHjLPx5dSKm6NLVJHnlDaM0Jbl9pdfD5ZR4/Tc9pPBEQADxlMSszvEOUDch9B41BkgoIUit2azPzbDOUScd4YKzJriwu0vrzo4sPYKD1tbkz1N76g/qbXkdB6vI9KZjtdbKY73HhniqPTsSKjpplMD6eutrU77tzKNlEUuIv3X4bHvh/G25/KekW+rAnNIBKZdG93qq1v0CmvrNKEtJ/qfrbsGw/5wkQNJJMZP9QIAiIwiKAPZEZWKfN++wCY84P0ZSK8RpePbUFtIBnognG/vjY16ThO78MuAmquNVB6666Lgclqauz4lKKKImPOhZUdWvz6y8XoxAbV3pn2xFtXNIl8xmAaQyAZzZqDM0e1oaYPNKQaDH1VI3yGqa6Ip47D9CORkYG59MJqiEvL5I94MkeYsTUZXU37aSiXGpEErcmwftCipoM0BB0xktaISgZ9azJYJGGqeWhIAmtN/rDFQSJk5AZQ8yg9aEJC+mIMf7RxEZtMkIbkBnX+0ifqODYZaIchNYSzSAXOpTjnSBDJ2GTUBNAHxqwJ2cLGwDkCfxVsi9omRoY1EmYj0Aj7s6bCrAvySYQMNsaJVE3I5x74MBH0k0ZsMvKcUTXBWuJWagoaSpJQLDKod2yGtYE+A5poby53JGA3+SOeCvjaIDIZlBbqXZcMpTT4oNKpOl9MEiZ/joeYgM4vaC4SGSTmwKpGMMdE0NdB56/G060JO2dNxk8j0ISz2+J0DdSRDg31p93nfTz345kf/jJe2I3r/KzIoJ4RxFTz0Afsxu8DXOPhC/ub4iGfisOV+l5oMigFUy1zaUEf+jTeWfgCXgsR4nE+5AR0fnIuFBkE5oW6mofY2W7b6uKp+WziBZKRNa2eI6h5qRFa2zXmr7lQnKWlpDUUSAY709U05rnmszQCgx/U79eEH8cz5RPunmEoMp5VexM3y2bcM2Svm8gv9APECRaJzMWfL+PkzNlaazKvOmey6t5PI0G71mkoaI3OznPWZNyFPnXv2m1eEowVjYzNZv+hrzUZ+d2y+r1Y3H5c3lZkKqpr6Oy9jznDidtTtLn3L8eopHzJ4N6MDMxnQK5amY/Hf+YmCPtRwTZujWRw5QT3Ztgxn+3vzJDnDo9uP1oyIMLO6t9O8pk+12PsAUTQhoGHjLw707I6RPnC9dlHWXd4/t+dCfOR5tPHdOXEU2ZH+e7MXwAAAP//WGtSdQAAAAZJREFUAwC/2qASLtNI5QAAAABJRU5ErkJggg=='
    };
    const CHIARO = '--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--btn:#fff8e6;--btnh:#f6e7c2;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--lo:#b9832a;' +
      '--title:#6a2a1a;--tshadow:#e0c48a;--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--rowh:#8a5a0a12;--ember:#a8401a;--glow:#fff0;color-scheme:light';
    const STILE = '<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><style>' +
      ':root{--bg:#10131a;--pan:#1b2030;--pan2:#232a40;--btn:#2a3350;--btnh:#3b4770;--fg:#e8ecf4;--mu:#9aa4b8;--ac:#f5b942;--hi:#ffd27a;--lo:#c98a1a;--ember:#ff8a5a;' +
      '--title:#f5b942;--tshadow:#8a3b12;--frame:#8a6a3a;--drop:#2e1d10;--line:#f5b94230;--line2:#f5b94266;--rowh:#f5b9420f;--good:#4cd07a;--bad:#e8484f;--glow:#24305466;' +
      '--f:Georgia,"Times New Roman",serif;color-scheme:dark}' +
      '@media(prefers-color-scheme:light){:root{' + CHIARO + '}}' +
      '*{box-sizing:border-box}' +
      'body{margin:0;color:var(--fg);font:400 16px/1.55 var(--f);min-height:100vh;background:radial-gradient(ellipse 90% 50% at 50% -10%,var(--glow),transparent 70%),' +
      'repeating-linear-gradient(26.565deg,transparent 0 46px,var(--line) 46px 47px),repeating-linear-gradient(-26.565deg,transparent 0 46px,var(--line) 46px 47px),var(--bg)}' +
      'a{color:var(--ac);text-underline-offset:2px}a:hover{color:var(--hi)}' +
      '.vi{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em;background:center/contain no-repeat;flex-shrink:0;filter:drop-shadow(0 1px 0 #0008)}' +
      Object.keys(ICO).map(k => '.v-' + k + '{background-image:url(' + ICO[k] + ')}').join('') +
      // barra di legno in alto, come il titolo dei menu del gioco
      '.top{position:relative;display:flex;align-items:center;gap:12px;padding:14px max(16px,calc(50% - 430px));font:bold 1.3rem/1.1 var(--f);font-variant:small-caps;letter-spacing:.04em;color:#ffd27a;' +
      'text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244;background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);' +
      'border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f,0 5px 0 #00000066}' +
      '.top::before,.top::after{content:"";position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}' +
      '.top::before{left:6px}.top::after{right:6px}.top .vi{width:36px;height:36px}' +
      '.top small{display:block;font:italic 400 .72rem var(--f);font-variant:normal;letter-spacing:0;color:#f4e2b8;text-shadow:1px 1px 0 #0008;margin-top:3px}' +
      '.top .gbtn{margin-left:auto}' +
      'main{max-width:892px;margin:0 auto;padding:22px 16px 48px}' +
      'h1{font:bold clamp(1.9rem,6vw,2.9rem)/1.05 var(--f);letter-spacing:.07em;text-transform:uppercase;color:var(--title);text-shadow:3px 3px 0 var(--tshadow);margin:.2em 0 .15em;text-wrap:balance}' +
      'h2{display:flex;align-items:center;gap:.45em;font:bold 1.45rem/1.15 var(--f);color:var(--title);text-shadow:2px 2px 0 var(--tshadow);margin:0 0 .5em}h2 .vi{width:1.1em;height:1.1em}' +
      '.kick{display:flex;align-items:center;gap:10px;font:bold .72rem var(--f);text-transform:uppercase;letter-spacing:.16em;color:var(--ember);margin:0}' +
      '.kick::after{content:"";width:60px;height:2px;background:linear-gradient(90deg,var(--line2),transparent)}' +
      '.lede{color:var(--mu);margin:.2em 0 1.2em;max-width:62ch}' +
      // pannelli con il bordo a cubetti e l'ombra piena sotto
      '.card{background:var(--pan);border:2px solid var(--frame);border-radius:4px;box-shadow:0 5px 0 var(--drop),0 10px 20px #0005;padding:.9em 1.1em;margin:0 0 22px}' +
      '.call{background:var(--pan2);border:3px solid var(--lo);border-radius:6px;box-shadow:0 0 0 3px #4a301b,0 7px 0 3px var(--drop),0 16px 30px #0007;padding:1em 1.2em;margin:6px 3px 30px}' +
      '.call header{display:flex;flex-wrap:wrap;align-items:center;gap:10px;justify-content:space-between;border-bottom:2px solid var(--line2);padding-bottom:.5em;margin-bottom:.4em}' +
      '.call header b{display:flex;align-items:center;gap:.45em;font-size:1.2rem;color:var(--hi)}.call header .vi{width:30px;height:30px}' +
      '.call.off{border-color:var(--frame)}.call.off p{margin:0;display:flex;gap:.6em;align-items:center}.call.off .vi{width:30px;height:30px}' +
      '.chip{display:inline-flex;align-items:baseline;gap:6px;font-size:.9rem;color:var(--mu);background:var(--btn);border:1px solid var(--line2);border-radius:4px;padding:.2em .7em;box-shadow:0 3px 0 #0008}' +
      '.chip b{font:bold 1.2rem var(--f);color:var(--hi);font-variant-numeric:tabular-nums}' +
      '.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}' +
      // indizi: la linea delle tappe della guida
      '.tl{list-style:none;padding:0;margin:.8em 0 .2em 6px;border-left:3px solid var(--lo)}' +
      '.tl li{position:relative;padding:.05em 0 .85em 1.4em}.tl li:last-child{padding-bottom:.1em}' +
      '.tl li::before{content:"";position:absolute;left:-8px;top:.4em;width:13px;height:13px;background:var(--ac);transform:rotate(45deg);box-shadow:2px 2px 0 var(--tshadow)}' +
      '.tl span{display:block;font:bold .66rem var(--f);text-transform:uppercase;letter-spacing:.1em;color:var(--ember)}' +
      '.tl li.no{color:var(--mu);font-style:italic}.tl li.no::before{background:transparent;border:2px solid var(--line2);box-shadow:none}' +
      '.dove{margin:.6em 0 0;padding:.5em .8em;background:var(--rowh);border-left:5px solid var(--good);border-radius:3px}.dove b{color:var(--hi)}' +
      '.mu{color:var(--mu)}small{color:var(--mu);font-size:.85rem}' +
      '.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:22px;align-items:start}.cols>*{min-width:0}' +
      // tavole con l'intestazione di legno
      '.tw{overflow:auto;border:2px solid var(--frame);border-radius:4px;background:var(--pan);box-shadow:0 5px 0 var(--drop),0 10px 20px #0005;margin:0 0 22px}' +
      'table{border-collapse:collapse;width:100%;font-size:.95rem}' +
      'th{text-align:left;font:bold .7rem var(--f);text-transform:uppercase;letter-spacing:.1em;color:#ffd27a;text-shadow:1px 1px 0 #0008;padding:.75em .8em;white-space:nowrap;' +
      'background:repeating-linear-gradient(180deg,#0000 0 13px,#00000022 13px 14px),linear-gradient(180deg,#86603b,#5e3f25);border-bottom:2px solid #3a2414}' +
      'td{padding:.5em .8em;border-bottom:1px solid var(--line);vertical-align:top}tbody tr:last-child td{border-bottom:0}' +
      'tbody tr:nth-child(even){background:var(--rowh)}tbody tr:hover{background:var(--line)}' +
      'td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;width:1%}td.pos{font-weight:bold;color:var(--ac)}tr.p1 td.pos,tr.p1 b{color:var(--hi)}' +
      'td.w{white-space:nowrap}.vuoto{padding:1em;margin:0;color:var(--mu);font-style:italic}' +
      // pulsanti come quelli del gioco
      '.gbtn{font:15px var(--f);color:#fff;background:#2a3350;border:1px solid #f5b94288;border-radius:3px;padding:.5em .95em;cursor:pointer;text-decoration:none;' +
      'box-shadow:0 3px 0 #00000080;transition:transform .08s,box-shadow .08s,background .15s;display:inline-flex;align-items:center;gap:6px;margin:3px 4px 3px 0}' +
      '.gbtn:hover{background:#3b4770;color:#fff}.gbtn:active{transform:translateY(2px);box-shadow:0 1px 0 #00000080}' +
      '.gbtn.oro{background:linear-gradient(180deg,#ffd27a,#e0a634 55%,#c98a1a);border-color:#fff0c0;color:#2a1a06;font-weight:bold;text-shadow:0 1px 0 #fff5}' +
      '.gbtn.oro:hover{background:linear-gradient(180deg,#ffe7a8,#f0b844 55%,#d99a2a)}' +
      '.gbtn.ko{background:linear-gradient(180deg,#d8452c,#a8301c);border-color:#ffb8a8}.gbtn.ko:hover{background:linear-gradient(180deg,#e85a40,#b83a24)}' +
      '.top .gbtn{font-size:13px;font-variant:normal;letter-spacing:0;text-shadow:none;font-weight:normal}' +
      'select{font:15px var(--f);margin:3px 4px 3px 0;padding:.5em .7em;border-radius:3px;border:2px solid #3a2414;background:#f4ecd6;color:#2a2010;box-shadow:inset 0 2px 0 #0002,0 2px 0 #a37a4f66;max-width:100%}' +
      'select:focus{outline:none;border-color:var(--ac);box-shadow:0 0 0 2px #f5b94266}' +
      'button:focus-visible,a:focus-visible{outline:2px solid var(--ac);outline-offset:2px}' +
      '.ctl{display:flex;flex-wrap:wrap;align-items:center;gap:4px}' +
      '.bad{border-left:5px solid var(--bad)}.bad b{color:var(--bad)}.bad ul{margin:.4em 0 0;padding-left:1.2em}' +
      'footer{margin-top:26px;padding-top:12px;border-top:3px solid #4a301b;color:var(--mu);font-size:.85rem;font-style:italic}' +
      '@media(prefers-color-scheme:light){.call{box-shadow:0 0 0 3px #b89a62,0 7px 0 3px var(--drop),0 16px 30px #0003}.card,.tw{box-shadow:0 5px 0 var(--drop),0 10px 20px #0002}}' +
      '@media(max-width:560px){.top{font-size:1.1rem;padding:10px 16px}.top small{display:none}.top .vi{width:28px;height:28px}td,th{padding-inline:.55em}}' +
      '@media(prefers-reduced-motion:reduce){.gbtn{transition:none}}' +
      '</style>';
    const vi = k => '<i class="vi v-' + k + '" aria-hidden="true"></i>';
    const testa = (titolo, adm) => STILE + '<title>' + titolo + '</title><header class="top">' + vi('key') + '<div>Caccia al tesoro<small>' + (adm ? 'Pannello admin del plugin' : 'Un plugin del server di Voxelia') + '</small></div>' +
      (adm ? '<a class="gbtn" href="./">Pagina pubblica</a>' : '') + '</header><main>';
    const piede = s => '<footer>' + s + '</footer></main>';
    const quando = t => new Date(t).toLocaleString('it-IT');
    function albo() {
      const L = Object.values(S.vinti).sort((a, b) => b.n - a.n).slice(0, 20);
      return '<div class="cols"><section><h2>' + vi('trophy') + 'Migliori cercatori</h2>' + (L.length ? '<div class="tw"><table><thead><tr><th>#</th><th>Eroe</th><th>Tesori</th></tr></thead><tbody>' +
        L.map((v, k) => '<tr' + (k ? '' : ' class="p1"') + '><td class="n pos">' + (k + 1) + '</td><td>' + (k ? '' : '🏆 ') + '<b>' + e(v.nome) + '</b></td><td class="n">' + v.n + '</td></tr>').join('') + '</tbody></table></div>'
        : '<div class="tw"><p class="vuoto">Nessuno ha ancora trovato un tesoro.</p></div>') + '</section>' +
        '<section><h2>' + vi('scroll') + 'Ultime cacce</h2>' + (S.storico.length ? '<div class="tw"><table><thead><tr><th>Quando</th><th>Nascondiglio</th><th>Trovato da</th></tr></thead><tbody>' +
        S.storico.slice(0, 15).map(h => '<tr><td class="w"><small>' + e(quando(h.quando)) + '</small></td><td>' + e(h.dove) + '</td><td>' + (h.chi ? '🏆 ' + e(h.chi) : '<small>nessuno</small>') + '</td></tr>').join('') + '</tbody></table></div>'
        : '<div class="tw"><p class="vuoto">Ancora nessuna caccia.</p></div>') + '</section></div>';
    }
    function inCorso(adm) {
      const A = caccia(); if (!A) return '<div class="call off"><p>' + vi('hglass') + '<span>' + e(stato()) + '</span></p></div>';
      const s = lista[A.i];
      return '<div class="call"><header><b>' + vi('map') + 'Caccia in corso</b><span class="chip">sparisce tra <b>' + Math.max(1, Math.ceil((A.fine - Date.now()) / MIN)) + '</b> min</span></header>' +
        (adm ? '<p class="dove">Nascondiglio: <b>' + e(nomeDi(s)) + '</b> <small>(' + e(s.zona) + ' ' + s.x + ',' + s.y + ')</small></p>' : '') +
        '<ol class="tl">' + indizi(s).map((t, k) => k < A.dati ? '<li><span>Indizio ' + (k + 1) + '</span>' + e(t) + '</li>' : adm ? '<li class="no"><span>Indizio ' + (k + 1) + ' · non ancora uscito</span>' + e(t) + '</li>' : '').join('') + '</ol></div>';
    }
    api.route('GET', '/', (req, res, x) => x.send(testa('Caccia al tesoro', false) + '<p class="kick">Aldoria</p><h1>Caccia al tesoro</h1>' +
      '<p class="lede">Ogni tanto un tesoro viene nascosto in città o nei dintorni. Leggi gli indizi, cerca le scintille dorate e arriva per primo. In gioco: <b>/tesoro</b>.</p>' +
      inCorso(false) + albo() + piede('La pagina si aggiorna da sola ogni 30 secondi.') + '<script>setTimeout(()=>location.reload(),30000)</script>'));
    api.route('GET', 'admin', (req, res, x) => {
      const opz = validi.map(i => '<option value="' + i + '">' + e(nomeDi(lista[i])) + ' (' + e(lista[i].zona) + ')</option>').join('');
      const scarti = lista.map((s, i) => [i, problema(s)]).filter(z => z[1]);
      x.send(testa('Caccia al tesoro · admin', true) + '<p class="kick">Pannello admin</p><h1>Caccia al tesoro</h1>' +
        '<div class="chips"><span class="chip">una caccia ogni <b>' + Math.round(ogni() / MIN) + '</b> min</span><span class="chip">dura <b>' + Math.round(durata() / MIN) + '</b> min</span>' +
        '<span class="chip"><b>' + validi.length + '</b> nascondigli validi</span></div>' +
        inCorso(true) +
        '<div class="card"><div class="ctl">' + (caccia() ? '<button class="gbtn ko" onclick=\'if(confirm("Annullare la caccia?"))fai("annulla",{})\'>Annulla la caccia</button>'
          : '<select id=s aria-label="Nascondiglio"><option value="">Nascondiglio a caso</option>' + opz + '</select><button class="gbtn oro" onclick=\'fai("nascondi",{i:document.getElementById("s").value})\'>Nascondi il tesoro ora</button>') +
        '</div><small>I nascondigli si cambiano in tesoro.config.json.</small></div>' +
        (scarti.length ? '<div class="card bad"><b>Nascondigli ignorati</b><ul>' + scarti.map(z => '<li>' + (z[0] + 1) + '. ' + e(z[1]) + '</li>').join('') + '</ul></div>' : '') +
        albo() + piede('La pagina si aggiorna da sola ogni 20 secondi.') +
        '<script>function fai(a,b){fetch("admin/"+a,{method:"POST",headers:{"x-voxelia":"1","Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json()).then(j=>{if(j.ok)location.reload();else alert(j.err||"Errore")})}setTimeout(()=>location.reload(),20000)</script>');
    }, { admin: true });
    api.route('POST', 'admin/*', (req, res, x) => x.body(b => {
      b = b && typeof b === 'object' ? b : {};
      if (x.path === '/admin/nascondi') {
        const i = b.i === '' || b.i == null ? null : parseInt(b.i, 10);
        const r = nascondi(Number.isInteger(i) ? i : null, 'admin'); return r ? x.json(400, { err: r }) : x.json({ ok: 1 });
      }
      if (x.path === '/admin/annulla') {
        if (!caccia()) return x.json(400, { err: 'Nessuna caccia in corso' });
        chiudi(); api.announce('La caccia al tesoro è stata annullata.'); api.log('caccia annullata dall\'admin'); return x.json({ ok: 1 });
      }
      x.json(404, { err: 'Azione sconosciuta' });
    }), { admin: true });
  },

  stop(api) { api.broadcast('fine', {}); }
};
