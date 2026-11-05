// Notti di caccia: ogni tot notti del mondo parte un evento con esperienza moltiplicata e una gara.
// Boss di dungeon e vittorie nel Colosseo danno punti; all'alba chi ne ha di più vince un premio.
// Un giorno del mondo dura 24 minuti veri, quindi una notte dalle 22 alle 5 dura circa 7 minuti.
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
  name: 'Notti di caccia',
  version: '1.2',
  author: 'Voxelia',
  description: 'Eventi notturni con XP moltiplicata e una gara a punti: /evento',
  defaults: {
    ogniNotti: 3,          // l'evento c'è una notte ogni tante (1 = tutte le notti)
    oraInizio: 22,         // ore del mondo
    oraFine: 5,
    moltiplicatoreXp: 2,   // moltiplica l'XP impostata nel pannello (massimo 5 in tutto)
    puntiBoss: 3,
    puntiArena: 1,
    premioPrimo: { oro: 1500, oggetto: 3 },
    premioPartecipanti: { oro: 200 },   // a chi ha fatto almeno un punto ed è online all'alba
    preavviso: true        // annuncio un'ora del mondo prima (circa un minuto vero)
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, chiave = n => String(n).toLowerCase();
    const st = () => api.store;   // st().ev = evento in corso: { notte, xpPrima, xpEvento, punti: { chiave: { nome, p } } }
    const RARITA = ['comune', 'non comune', 'raro', 'epico'];
    const testo = pr => [pr.oro && pr.oro + ' oro', pr.pozioni && pr.pozioni + (pr.pozioni === 1 ? ' pozione' : ' pozioni'), pr.xp && pr.xp + ' XP', pr.oggetto != null && 'un oggetto ' + (RARITA[pr.oggetto] || 'raro')].filter(Boolean).join(', ');
    function dai(p, pr) {
      if (!pr || !p) return;
      if (globalThis.VoxeliaGuardiano) globalThis.VoxeliaGuardiano.grazia(p.name);
      if (pr.oro > 0) p.give('gold', pr.oro);
      if (pr.pozioni > 0) p.give('pot', pr.pozioni);
      if (pr.xp > 0) p.give('xp', pr.xp);
      if (pr.oggetto != null) p.give('item', 1, pr.oggetto);
    }

    // a che notte siamo: la notte che inizia alle 22 del giorno N si chiama N, anche dopo mezzanotte
    function adesso() {
      const c = api.server.clock(), m = ((c.min % 1440) + 1440) % 1440, h = m / 60, ini = C.oraInizio, fin = C.oraFine;
      const notte = ini > fin ? h >= ini || h < fin : h >= ini && h < fin;
      const giorno = Math.floor(c.min / 1440) + 1, numero = ini > fin && h < fin ? giorno - 1 : giorno;
      return { notte, numero, h, giorno, c };
    }
    const evento = n => n > 0 && n % Math.max(1, C.ogniNotti | 0) === 0;
    // quante notti mancano alla prossima notte di caccia (0 = stanotte)
    function prossima() { const a = adesso(); let n = a.notte ? a.numero + 1 : a.giorno; while (!evento(n)) n++; return n - a.giorno; }

    function inizia(n) {
      const xpPrima = api.server.cfg.xpm, xpEvento = Math.min(5, Math.round(xpPrima * C.moltiplicatoreXp * 10) / 10);
      st().ev = { notte: n, xpPrima, xpEvento, punti: {} }; api.save();
      api.server.setCfg({ xpm: xpEvento });
      api.announce('🌙 Notte di caccia! XP ×' + xpEvento + ' fino all\'alba. Boss e vittorie nel Colosseo valgono punti: /evento');
      api.broadcast('inizio', { xp: xpEvento });
      api.log('notte di caccia ' + n + ' iniziata (XP ' + xpPrima + ' → ' + xpEvento + ')');
    }

    function finisci() {
      const ev = st().ev; if (!ev) return;
      // se nel frattempo l'admin ha cambiato l'XP, si lascia la sua scelta
      if (api.server.cfg.xpm === ev.xpEvento) api.server.setCfg({ xpm: ev.xpPrima });
      const cl = Object.values(ev.punti).sort((a, b) => b.p - a.p);
      if (cl.length) {
        const primo = cl[0], top = cl.slice(0, 3).map((r, i) => (i + 1) + '. ' + r.nome + ' (' + r.p + ')').join('  ');
        api.announce('☀ L\'alba! Vince la notte di caccia ' + primo.nome + ' con ' + primo.p + ' punti. ' + top);
        const pv = api.player(primo.nome);
        if (pv) { dai(pv, C.premioPrimo); pv.tell('Hai vinto la notte di caccia! Premio: ' + testo(C.premioPrimo) + '.'); }
        else { st().daRitirare = st().daRitirare || {}; st().daRitirare[chiave(primo.nome)] = C.premioPrimo; }
        for (const r of cl.slice(1)) { const p = api.player(r.nome); if (p) { dai(p, C.premioPartecipanti); p.tell('Grazie per la caccia! Premio: ' + testo(C.premioPartecipanti) + '.'); } }
        st().ultimo = { notte: ev.notte, vincitore: primo.nome, punti: primo.p };
      } else api.announce('☀ L\'alba: la notte di caccia è finita senza punti. Alla prossima!');
      api.broadcast('fine', {});
      delete st().ev; api.save();
    }

    function punti(p, n, perche) {
      const ev = st().ev; if (!ev || !p || n <= 0 || (globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p))) return;   // niente punti ai bot dello Stress test
      const k = chiave(p.name), r = ev.punti[k] || (ev.punti[k] = { nome: p.name, p: 0 });
      r.p += n; api.save();
      p.tell('+' + n + (n > 1 ? ' punti' : ' punto') + ' caccia (' + perche + '): ora ' + r.p);
    }

    let avvisato = 0;
    api.every(5000, () => {
      const a = controlla();
      // preavviso un'ora del mondo prima
      if (C.preavviso && !a.notte && evento(a.giorno) && a.h >= C.oraInizio - 1 && a.h < C.oraInizio && avvisato !== a.giorno) {
        avvisato = a.giorno; const xp = Math.min(5, api.server.cfg.xpm * C.moltiplicatoreXp);
        api.announce('🌒 Tra poco cala la notte: sarà una notte di caccia con XP ×' + xp + '!');
        schermo('Tra poco cala la notte', 'Sarà una notte di caccia con XP ×' + xp, 'luna');
      }
    });

    api.on('dungeon', p => punti(p, C.puntiBoss, 'boss di dungeon'));
    api.on('arena', v => punti(v, C.puntiArena, 'vittoria nel Colosseo'));

    api.on('join', p => {
      const s = st(), k = chiave(p.name);
      if (s.daRitirare && s.daRitirare[k]) {
        const pr = s.daRitirare[k]; delete s.daRitirare[k]; api.save();
        api.after(3000, () => { if (p.online) { dai(p, pr); p.tell('Premio della notte di caccia che hai vinto: ' + testo(pr) + '.'); } });
      }
      if (s.ev) api.after(3000, () => { if (p.online) { p.tell('È in corso una notte di caccia: XP ×' + s.ev.xpEvento + '. Scrivi /evento per la classifica.'); p.send('inizio', { xp: s.ev.xpEvento }); } });
    });

    api.command('evento', 'la notte di caccia: quando, e la classifica', p => {
      const ev = st().ev, a = adesso();
      if (ev) {
        const cl = Object.values(ev.punti).sort((x, y) => y.p - x.p), mio = ev.punti[chiave(p.name)];
        return 'Notte di caccia in corso (XP ×' + ev.xpEvento + ', ' + (ev.fino ? 'decreto del sindaco: finisce tra ' + ((m => m + (m === 1 ? ' minuto' : ' minuti'))(Math.max(1, Math.ceil((ev.fino - Date.now()) / 60000)))) : 'finisce alle ' + String(C.oraFine).padStart(2, '0') + ':00 del mondo, ora sono le ' + a.c.time) + ').\n' +
          (cl.length ? cl.slice(0, 5).map((r, i) => (i + 1) + '. ' + r.nome + ': ' + r.p).join('\n') : 'Ancora nessun punto: sconfiggi un boss!') +
          '\nI tuoi punti: ' + (mio ? mio.p : 0) + '. Boss: ' + C.puntiBoss + ', vittoria nel Colosseo: ' + C.puntiArena + '.';
      }
      const k = prossima(), u = st().ultimo;
      return 'Prossima notte di caccia: ' + (k === 0 ? 'stanotte' : k === 1 ? 'domani notte' : 'tra ' + k + ' giorni del mondo') + ', alle ' + String(C.oraInizio).padStart(2, '0') + ':00 (ora sono le ' + a.c.time + ', giorno ' + a.giorno + ').' +
        (u ? '\nUltima vinta da ' + u.vincitore + ' con ' + u.punti + ' punti.' : '');
    });

    // nel gioco: un titolo grande all'inizio e alla fine
    api.client('VXP.on(' + JSON.stringify(api.id) + ', "inizio", d => VXAnnuncio("Notte di caccia", "XP ×" + d.xp + " fino all\'alba", "stella"));' +
      'VXP.on(' + JSON.stringify(api.id) + ', "fine", () => VXAnnuncio("L\'alba", "La notte di caccia è finita", "stella"));');

    // all'avvio e ogni 5 secondi: inizia, riprende o chiude l'evento secondo l'ora del mondo
    function controlla() {
      const a = adesso(), ev = st().ev;
      if (ev && ev.fino) { if (Date.now() >= ev.fino) finisci(); else if (ev.sospeso) { ev.sospeso = false; api.server.setCfg({ xpm: ev.xpEvento }); api.save(); } }   // anticipata dal Sindaco: dura quanto una notte
      else if (ev && (!a.notte || a.numero !== ev.notte)) finisci();
      else if (ev && ev.sospeso) { ev.sospeso = false; api.server.setCfg({ xpm: ev.xpEvento }); api.save(); }   // ripresa dopo Ricarica o riavvio
      else if (!ev && a.notte && evento(a.numero)) inizia(a.numero);
      return a;
    }
    api.on('start', controlla);

    // aggancio per il Sindaco di Aldoria: decreto «notte di caccia anticipata», che parte subito e dura quanto una notte del mondo
    globalThis.VoxeliaNotti = {
      inCorso: () => !!st().ev,
      anticipa(chi) {
        if (st().ev) return 'C\'è già una notte di caccia in corso.';
        const ore = ((C.oraFine - C.oraInizio) % 24 + 24) % 24 || 7;   // un'ora del mondo = un minuto vero
        inizia('sindaco'); st().ev.fino = Date.now() + ore * 60000; api.save();
        api.log('notte di caccia anticipata' + (chi ? ' da ' + chi : '') + ' per ' + ore + ' minuti');
        return { testo: 'notte di caccia adesso, per ' + ore + (ore === 1 ? ' minuto' : ' minuti') };
      }
    };
  },

  // spegnendo il plugin a metà evento, l'XP torna com'era; se il plugin riparte prima dell'alba, l'evento riprende
  stop(api) { delete globalThis.VoxeliaNotti; const ev = api.store.ev; if (ev && api.server.cfg.xpm === ev.xpEvento) { api.server.setCfg({ xpm: ev.xpPrima }); ev.sospeso = true; api.save(); } }
};
