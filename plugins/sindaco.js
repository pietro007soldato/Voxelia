// Il Sindaco di Aldoria: ogni settimana gli eroi eleggono il sindaco con /vota nome.
// Vota solo chi ha giocato almeno `minutiPerVotare` minuti nella settimana; un voto a testa, si può cambiare fino allo spoglio.
// Il sindaco ha il cappello in chat, fa un discorso annunciato a tutti e una volta al giorno emana un decreto
// scelto dalla lista `decreti` del config. I decreti che toccano altri plugin valgono solo se quel plugin è acceso.
// Tutto lo stato sta in api.store (voxelia-data.json), quindi resta anche dopo un rebuild su suga.app.
const http = require('http'), path = require('path'), fs = require('fs');

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
  name: 'Il Sindaco di Aldoria',
  version: '1.2',
  author: 'Voxelia',
  description: 'Elezione settimanale del sindaco e decreti: /vota, /sindaco, /decreto, /discorso',
  defaults: {
    giornoElezione: 0,       // giorno dello spoglio: 0 domenica, 1 lunedì … 6 sabato (ora del server)
    oraElezione: 21,         // ora dello spoglio (ora del server)
    minutiPerVotare: 30,     // minuti di gioco nella settimana per poter votare
    votoPerSe: false,        // si può votare per sé?
    unVotoPerIp: false,      // un solo voto per indirizzo IP (attenzione: chi gioca dalla stessa casa ha lo stesso IP)
    minVoti: 1,              // voti minimi per eleggere qualcuno; se no il sindaco resta in carica
    cappello: '🎩 ',          // prima dei messaggi del sindaco in chat ('' = niente)
    decreti: [
      { id: 'xp', nome: 'Esperienza doppia', tipo: 'xp', per: 2, minuti: 60 },
      { id: 'oro', nome: 'Oro doppio', tipo: 'oro', per: 2, minuti: 60 },
      { id: 'festa', nome: 'Festa in discoteca', tipo: 'festa', minuti: 30, regalo: { oro: 25, pozioni: 1 } },
      { id: 'notte', nome: 'Notte di caccia anticipata', tipo: 'notte' },
      { id: 'sconto', nome: 'Sconto al Mercatino', tipo: 'sconto', percento: 10, minuti: 120 }
    ]
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, chiave = n => String(n || '').toLowerCase();
    const bot = p => !!(globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p));
    // S.voti = { elettore: { nome, per, perNome, t, ip } }, S.minuti = { eroe: minuti }, S.visti = { eroe: nome },
    // S.discorsi = { eroe: testo }, S.sindaco = { nome, dal, voti, detto, giorno }, S.attivi = [{ id, tipo, fino, … }]
    const st = () => { const s = api.store; for (const k of ['voti', 'minuti', 'visti', 'discorsi']) if (!s[k] || typeof s[k] !== 'object') s[k] = {}; if (!Array.isArray(s.attivi)) s.attivi = []; if (!Array.isArray(s.storia)) s.storia = []; return s; };
    const sindaco = () => st().sindaco || null;
    const eSindaco = p => !!(sindaco() && chiave(sindaco().nome) === chiave(p.name));
    const oggi = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
    const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    const quando = t => { const d = new Date(t); return GIORNI[d.getDay()] + ' alle ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
    function prossimaElezione(da) {
      const d = new Date(da); d.setHours(Math.max(0, Math.min(23, C.oraElezione | 0)), 0, 0, 0);
      d.setDate(d.getDate() + ((((C.giornoElezione | 0) % 7) + 7 - d.getDay()) % 7));
      if (d.getTime() <= da) d.setDate(d.getDate() + 7);
      return d.getTime();
    }
    function conta() {
      const per = {};
      for (const v of Object.values(st().voti)) { const r = per[v.per] || (per[v.per] = { nome: v.perNome, n: 0, t: 0 }); r.n++; r.t = Math.max(r.t, v.t); }
      return Object.values(per).sort((a, b) => b.n - a.n || a.t - b.t);   // a pari voti vince chi ci è arrivato prima
    }
    function dai(p, pr) {
      if (!p || !pr) return;
      if (globalThis.VoxeliaGuardiano) globalThis.VoxeliaGuardiano.grazia(p.name);
      if (pr.oro > 0) p.give('gold', pr.oro);
      if (pr.pozioni > 0) p.give('pot', pr.pozioni);
    }

    // un altro plugin è acceso? Lo chiede al server stesso: /plugins/<id>/ risponde «Plugin non trovato» solo se è spento
    function acceso(id, cb) {
      const r = http.get({ host: '127.0.0.1', port: api.port, path: '/plugins/' + encodeURIComponent(id) + '/', timeout: 2000 }, res => {
        let b = ''; res.on('data', d => { if (b.length < 200) b += d; }); res.on('end', () => cb(!/^Plugin non trovato/.test(b)));
      });
      r.on('timeout', () => r.destroy()); r.on('error', () => cb(false));
    }
    // c'è una notte di caccia adesso? (stessa regola di notti.js, letta dal suo config). Serve a non mescolare due moltiplicatori di XP.
    function notteDiCaccia() {
      if (globalThis.VoxeliaNotti && typeof globalThis.VoxeliaNotti.inCorso === 'function') return globalThis.VoxeliaNotti.inCorso();
      let N = {}; try { N = Object.assign({}, require(path.join(api.dir, 'notti.js')).defaults || {}); } catch (e) { return false; }
      try { Object.assign(N, JSON.parse(fs.readFileSync(path.join(api.dir, 'notti.config.json'), 'utf8'))); } catch (e) {}
      const c = api.server.clock(), m = ((c.min % 1440) + 1440) % 1440, h = m / 60, ini = N.oraInizio, fin = N.oraFine;
      const notte = ini > fin ? h >= ini || h < fin : h >= ini && h < fin; if (!notte) return false;
      const n = Math.floor(c.min / 1440) + 1 - (ini > fin && h < fin ? 1 : 0);
      return n > 0 && n % Math.max(1, N.ogniNotti | 0) === 0;
    }

    // ---------- elezione ----------
    function elezione() {
      const s = st(), cl = conta(), vecchio = sindaco(), min = Math.max(1, C.minVoti | 0);
      s.storia.unshift({ t: Date.now(), vincitore: cl[0] && cl[0].n >= min ? cl[0].nome : null, voti: cl.slice(0, 5).map(r => r.nome + ' ' + r.n), elettori: Object.keys(s.voti).length });
      s.storia.length = Math.min(s.storia.length, 30);
      if (cl[0] && cl[0].n >= min) {
        const v = cl[0], rieletto = vecchio && chiave(vecchio.nome) === chiave(v.nome);
        s.sindaco = { nome: v.nome, dal: Date.now(), voti: v.n, detto: false, giorno: '' };
        api.announce('🎩 ' + (rieletto ? v.nome + ' è rieletto sindaco di Aldoria' : 'Aldoria ha un nuovo sindaco: ' + v.nome) + ' con ' + v.n + (v.n === 1 ? ' voto!' : ' voti!') + (cl[1] ? ' Secondo: ' + cl[1].nome + ' (' + cl[1].n + ').' : ''));
        api.broadcast('eletto', { nome: v.nome, voti: v.n });
        const d = s.discorsi[chiave(v.nome)];
        if (d) api.after(4000, () => parla(d));
        const p = api.player(v.nome); if (p) benvenuto(p);
      } else if (vecchio) api.announce('🎩 Nessun voto questa settimana: ' + vecchio.nome + ' resta sindaco di Aldoria.');
      else api.announce('🎩 Nessun voto questa settimana: Aldoria resta senza sindaco. Votate con /vota nome!');
      api.log('spoglio: ' + (cl.length ? cl.map(r => r.nome + ' ' + r.n).join(', ') : 'nessun voto') + ' → ' + (sindaco() ? sindaco().nome : 'nessuno'));
      s.voti = {}; s.minuti = {}; s.discorsi = {};
      s.prossima = prossimaElezione(Date.now()); api.save();
    }
    function parla(testo) {
      const sd = sindaco(); if (!sd) return;
      sd.detto = true; api.save();
      api.announce('🎩 Discorso del sindaco ' + sd.nome + ': «' + String(testo).slice(0, 110) + '»');
      api.broadcast('discorso', { nome: sd.nome, testo: String(testo).slice(0, 160) });
    }
    function benvenuto(p) {
      const sd = sindaco(); if (!sd || chiave(sd.nome) !== chiave(p.name)) return;
      api.after(3000, () => {
        if (!p.online) return;
        p.send('eletto', { nome: sd.nome, voti: sd.voti, tu: true });
        p.tell('Sei il sindaco di Aldoria! ' + (sd.detto ? '' : 'Scrivi il discorso con /discorso testo e leggilo a tutti con /discorso leggi. ') + (sd.giorno === oggi() ? 'Il decreto di oggi l\'hai già emanato.' : 'Puoi emanare un decreto al giorno: /decreto'));
      });
    }

    // ---------- decreti ----------
    const lista = () => (Array.isArray(C.decreti) ? C.decreti : []).filter(d => d && d.tipo);
    const durata = d => Math.max(1, +d.minuti || 60) * 60000;
    const BOOST = { xp: 'xpm', oro: 'gm' };
    function trova(q) { const L = lista(), n = parseInt(q, 10); return n >= 1 && n <= L.length ? L[n - 1] : L.find(d => chiave(d.id) === chiave(q) || chiave(d.nome) === chiave(q)) || null; }
    // fa partire il decreto; cb(errore) se non si può
    function emana(d, p, cb) {
      const s = st(), fino = Date.now() + durata(d), m = Math.round(durata(d) / 60000), min = m + (m === 1 ? ' minuto' : ' minuti');
      if (BOOST[d.tipo]) {
        const k = BOOST[d.tipo];
        if (s.attivi.some(a => a.k === k)) return cb('È già in vigore un decreto così.');
        const go = () => {
          const prima = api.server.cfg[k], val = Math.min(5, Math.round(prima * Math.max(1, +d.per || 2) * 10) / 10);
          if (val <= prima) return cb('Il moltiplicatore è già al massimo.');
          api.server.setCfg({ [k]: val });
          s.attivi.push({ id: d.id, tipo: d.tipo, k, prima, val, fino }); api.save();
          cb(null, (d.tipo === 'xp' ? 'Esperienza ×' : 'Oro ×') + val + ' per ' + min);
        };
        if (k !== 'xpm') return go();
        return acceso('notti', on => on && notteDiCaccia() ? cb('C\'è una notte di caccia in corso: emana il decreto dopo l\'alba.') : go());
      }
      if (d.tipo === 'festa') return acceso('discoteca', on => {
        if (!on) return cb('La Discoteca non è accesa su questo server.');
        if (s.attivi.some(a => a.tipo === 'festa')) return cb('La festa è già in corso.');
        s.attivi.push({ id: d.id, tipo: 'festa', fino, regalo: d.regalo || null, presi: {} }); api.save();
        api.broadcast('festa', { min: Math.round(durata(d) / 60000) });
        cb(null, 'Festa in discoteca per ' + min + ': il portale è in piazza, scrivi /discoteca' + (d.regalo ? '. Regalo all\'ingresso!' : ''));
      });
      // questi due si appoggiano all'aggancio di Notti di caccia 1.1 e Mercatino 1.1 (globalThis.VoxeliaNotti / VoxeliaMercato)
      if (d.tipo === 'notte') {
        const N = globalThis.VoxeliaNotti;
        if (!N || typeof N.anticipa !== 'function') return cb('Le Notti di caccia di questo server non accettano decreti.');
        const e = N.anticipa(p.name); return typeof e === 'string' ? cb(e) : cb(null, (e && e.testo) || 'notte di caccia adesso');
      }
      if (d.tipo === 'sconto') {
        const M = globalThis.VoxeliaMercato;
        if (!M || typeof M.sconto !== 'function') return cb('Il Mercatino di questo server non accetta decreti.');
        const e = M.sconto(Math.max(1, Math.min(100, +d.percento || 10)), durata(d), p.name); return typeof e === 'string' ? cb(e) : cb(null, (e && e.testo) || 'sconto al Mercatino per ' + min);
      }
      cb('Decreto sconosciuto: ' + d.tipo);
    }
    // fine dei decreti a tempo. Se nel frattempo il moltiplicatore è cambiato (una notte di caccia, l'admin), si aspetta
    // che torni al valore del decreto per rimettere quello di prima; dopo un'ora si lascia la scelta di chi l'ha cambiato.
    function scadenze() {
      const s = st(), ora = Date.now(); let cambiato = false;
      s.attivi = s.attivi.filter(a => {
        if (a.fino > ora) { if (a.sospeso) { a.sospeso = false; api.server.setCfg({ [a.k]: a.val }); cambiato = true; } return true; }   // ripresa dopo Ricarica o riavvio
        if (a.k && a.sospeso) { cambiato = true; return false; }
        if (a.k) {
          if (api.server.cfg[a.k] === a.val) { api.server.setCfg({ [a.k]: a.prima }); api.announce('🎩 Finito il decreto del sindaco: ' + (a.tipo === 'xp' ? 'esperienza' : 'oro') + ' di nuovo ×' + a.prima + '.'); cambiato = true; return false; }
          if (ora - a.fino < 3600000) return true;
          api.log('decreto ' + a.id + ': moltiplicatore cambiato da altri, lasciato com\'è');
        }
        if (a.tipo === 'festa') api.announce('🎩 La festa del sindaco è finita. Grazie a tutti!');
        cambiato = true; return false;
      });
      if (cambiato) api.save();
    }

    // ---------- tempo di gioco, chat, ingressi ----------
    api.every(60000, () => {
      const s = st();
      for (const p of api.players()) if (!bot(p)) { const k = chiave(p.name); s.minuti[k] = (s.minuti[k] || 0) + 1; s.visti[k] = p.name; }
      const v = Object.keys(s.visti); if (v.length > 3000) for (const k of v.slice(0, v.length - 3000)) delete s.visti[k];
      api.save();
    });
    api.every(15000, () => { const s = st(); if (!s.prossima) { s.prossima = prossimaElezione(Date.now()); api.save(); } if (Date.now() >= s.prossima) elezione(); scadenze(); });
    api.on('start', () => { const s = st(); if (!s.prossima) { s.prossima = prossimaElezione(Date.now()); api.save(); } if (Date.now() >= s.prossima) elezione(); scadenze(); });

    api.on('join', p => {
      if (bot(p)) return;
      st().visti[chiave(p.name)] = p.name; api.save();
      if (eSindaco(p)) benvenuto(p);
      const f = st().attivi.find(a => a.tipo === 'festa');
      if (f) api.after(3500, () => { if (p.online) p.tell('🎩 Il sindaco ha indetto una festa in discoteca! Scrivi /discoteca.'); });
    });
    api.on('chat', (p, testo) => { if (C.cappello && eSindaco(p) && testo.length + C.cappello.length <= 60) return C.cappello + testo; });
    api.on('zone', (p, z) => {
      if (z !== 'in_discoteca' || bot(p)) return;
      const f = st().attivi.find(a => a.tipo === 'festa'), k = chiave(p.name);
      if (!f || !f.regalo || f.presi[k]) return;
      f.presi[k] = 1; api.save(); dai(p, f.regalo); p.tell('🎩 Regalo della festa del sindaco!');
    });

    // ---------- comandi ----------
    api.command('vota', 'vota il sindaco di Aldoria: /vota nome', (p, args) => {
      const s = st(), k = chiave(p.name), mio = s.voti[k], min = Math.max(0, C.minutiPerVotare | 0), fatti = s.minuti[k] || 0;
      if (!args.length) return (mio ? 'Hai votato ' + mio.perNome + '. ' : '') + 'Scrivi /vota nome. Spoglio ' + quando(s.prossima || prossimaElezione(Date.now())) + '.';
      if (bot(p)) return 'I bot non votano.';
      if (fatti < min) return 'Per votare devi giocare almeno ' + min + (min === 1 ? ' minuto' : ' minuti') + ' in questa settimana: finora ' + fatti + '.';
      const ck = chiave(args.join(' ')), nome = s.visti[ck];
      if (!nome) return 'Non conosco nessun eroe che si chiama «' + args.join(' ') + '».';
      if (ck === k && !C.votoPerSe) return 'Non puoi votare per te stesso.';
      if (C.unVotoPerIp && Object.entries(s.voti).some(([e, v]) => e !== k && v.ip === p.ip)) return 'Da questa rete ha già votato un altro eroe.';
      if (mio && mio.per === ck) return 'Hai già votato ' + nome + '.';
      s.voti[k] = { nome: p.name, per: ck, perNome: nome, t: Date.now(), ip: p.ip }; api.save();
      api.log(p.name + ' vota ' + nome);
      return (mio ? 'Hai cambiato il voto: ora voti ' : 'Hai votato ') + nome + '. Spoglio ' + quando(s.prossima) + '.';
    });

    api.command('sindaco', 'chi è il sindaco, i voti della settimana e i decreti', p => {
      const s = st(), sd = sindaco(), cl = conta(), a = s.attivi.filter(x => x.fino > Date.now());
      return (sd ? '🎩 Sindaco di Aldoria: ' + sd.nome + ' (eletto con ' + sd.voti + (sd.voti === 1 ? ' voto' : ' voti') + ').' : 'Aldoria non ha ancora un sindaco.') +
        (a.length ? '\nIn vigore: ' + a.map(x => (lista().find(d => d.id === x.id) || {}).nome || x.id).join(', ') + '.' : '') +
        '\nVoti di questa settimana: ' + (cl.length ? cl.slice(0, 5).map(r => r.nome + ' ' + r.n).join(', ') : 'ancora nessuno') + '.' +
        '\nSpoglio ' + quando(s.prossima || prossimaElezione(Date.now())) + '.' + ((C.minutiPerVotare | 0) > 0 ? ' Hai giocato ' + (s.minuti[chiave(p.name)] || 0) + ' minuti su ' + (C.minutiPerVotare | 0) + ' per votare.' : '') + ' Vota con /vota nome';
    });

    api.command('decreto', 'i decreti del sindaco: /decreto numero (solo il sindaco)', (p, args) => {
      const L = lista(), sd = sindaco();
      if (!eSindaco(p)) return (sd ? 'Solo il sindaco (' + sd.nome + ') emana decreti.' : 'Aldoria non ha un sindaco: votalo con /vota nome.') + ' Decreti possibili: ' + L.map(d => d.nome).join(', ') + '.';
      if (!args.length) return 'Decreti (uno al giorno' + (sd.giorno === oggi() ? ', oggi già fatto' : '') + '):\n' + L.map((d, i) => (i + 1) + '. ' + d.nome).join('\n') + '\nScrivi /decreto numero.';
      if (sd.giorno === oggi()) return 'Hai già emanato il decreto di oggi. Il prossimo da domani.';
      const d = trova(args.join(' ')); if (!d) return 'Non c\'è questo decreto: scrivi /decreto per la lista.';
      emana(d, p, (e, cosa) => {
        if (e) return p.tell(e);
        const s2 = sindaco(); if (s2) { s2.giorno = oggi(); api.save(); }
        cosa = cosa.charAt(0).toUpperCase() + cosa.slice(1);
        api.announce('🎩 Decreto del sindaco ' + p.name + ': ' + d.nome + '! ' + cosa + (/[.!?]$/.test(cosa) ? '' : '.'));
        api.broadcast('decreto', { nome: d.nome, cosa });
        api.log(p.name + ' emana il decreto ' + d.id);
      });
    });

    api.command('discorso', 'il discorso che leggerai se diventi sindaco: /discorso testo', (p, args, testo) => {
      const s = st(), k = chiave(p.name), sd = sindaco(); let t = String(testo || '').trim();
      if (!t) return s.discorsi[k] ? 'Il tuo discorso: «' + s.discorsi[k] + '»' : 'Scrivi /discorso testo (e /discorso + altro testo per continuarlo): se vinci, lo leggeranno tutti allo spoglio.';
      if (bot(p)) return;
      if (chiave(t) === 'leggi') {
        if (!eSindaco(p)) return 'Solo il sindaco legge il suo discorso a tutti; il tuo verrà letto se vinci.';
        if (sd.detto) return 'Hai già fatto il discorso di questo mandato.';
        if (!s.discorsi[k]) return 'Scrivi prima il discorso con /discorso testo.';
        parla(s.discorsi[k]); return 'Hai letto il tuo discorso a tutta Aldoria.';
      }
      // un messaggio di chat è lungo al massimo 60 caratteri: con "/discorso + …" il discorso continua
      if (t[0] === '+') t = ((s.discorsi[k] || '') + ' ' + t.slice(1).trim()).trim();
      t = t.slice(0, 110);
      s.discorsi[k] = t; api.save();
      if (eSindaco(p) && !sd.detto) return 'Discorso pronto: «' + t + '». Continualo con /discorso + testo, o leggilo a tutti con /discorso leggi.';
      return 'Discorso salvato: «' + t + '». Se vinci l\'elezione, lo leggeranno tutti allo spoglio.';
    });

    // ---------- nel gioco: titoli grandi ----------
    const ID = JSON.stringify(api.id);
    api.client('VXP.on(' + ID + ', "eletto", d => VXAnnuncio(d.tu ? "Sei il sindaco!" : "Nuovo sindaco", d.nome + " · " + d.voti + (d.voti === 1 ? " voto" : " voti"), "corona"));' +
      'VXP.on(' + ID + ', "discorso", d => typeof clog === "function" && clog("🎩 " + d.nome + ": «" + d.testo + "»"));' +
      'VXP.on(' + ID + ', "decreto", d => VXAnnuncio("Decreto del sindaco", d.nome, "corona"));' +
      'VXP.on(' + ID + ', "festa", d => VXAnnuncio("Festa in discoteca!", "Il portale è in piazza · " + d.min + " minuti", "nota"));');

    // ---------- pagine web: lo stesso aspetto dei menu di Voxelia e della guida (Georgia, oro, legno, pannelli a cubetti) ----------
    const e = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    // icone voxel disegnate dal gioco (le stesse della guida)
    const ICONE = {
      tophat: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAACb0lEQVR4AeyYz0sbQRTHX2JqU2ppCRWhrbRFb5VCe2gFEQ8iePPkn+FJ8OAf4M27R++e/Af8Fzx58CDiIWKMRsUNUVeJ+S6+ZdygzLzZkYmM+GUm2Xk/PvNmk80r0iv6CzC+FjNUhivzfqDSdimOozuKK/Ox8qVd6i+TK+kCqOtEMABRnfgyN4b5Mfq/PTg0Qi5ULn+w2hdjGES7al2SC8G3jUQwNgFd2lrD2FYoTzgrmPimRb//jtO/iWmRvg1/p1LpbW48VjCcxXnjmCRi+7zGXGDySsbWT4Cx3UFX9qEyrnbW1m+ojO0OurCHz1AZ7IKPCpXxsSrIydvKzH0aQH5G8hJmcahiBMGLjWGiy5P0VyacHFX3RU/MeMqGfdafFAS+jGHqk+NUn51OdDQzRTt/xsTa/jWa+GF/GyNfkZNYxjCIdFo/JheCb9bmecRT7VEEo+1duHC11hBZGsNsHOzTVqcyLgQCKQhsjWGWzu5oOepLtFA9pbXPP2l9eEyklXaZVH/ze1XkJNYjGJ2+MSJxRwZzCJ9MEsEWyvrDe5BOPuqaFAYtV52+MYK8hHRyUdcgpwQGIHghke33jCTmUzZF097x7e116utN/zu6ifvEipoxZf0NGvSxs73ppDJ8ZnXGlORhomPz3JoHN+nw3NrstdSoM2lGjUIC05n39P9F47AAgKL6bARyvOmzkCMLeTII5sWT2l5BVZ69XwTIU+htx3GLoFbzjGqHu0lFOEbPHjPcIwzBY0/CqEeLQTB2wWTvIT6fPoxI+CkQXOuCUe8f3+bZewQAqrpg1Iu9Ng8wvlYsVCZU5gV24FUds3sAAAD//xUEM+YAAAAGSURBVAMARNDxlNVYFpUAAAAASUVORK5CYII=',
      castle: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAADdklEQVR4AexZPWsUQRieWxBFG78gYoxyWEkCFtqaQgSxtAsi2KeyUTsR0ghqoz/An6CVihIsJEZFRaPF3fkZw0Vjo4VwIpL1noFZ3h1v3ndmZzfchQv3ZN6Z5/2YZ2Z3J5dNFPmZPHoipSCUNikHWw+SXxijIFRPk/rCtp0wRiHxmZhTZ6bTPWN1ZWAHxvJl5+s1Hy0GhF2M9mN5mgt2bD5XfHJ/7l164eJVBUwcPIRaOcTyuWTdTmw+Ll7vzMKrZwro1sp9cL1iABwAm0LiqS+1kQugY7ClfBKvxSCRDde9Y/wk3vj5tlI+iUcdpxiQg4acmLF9+/W9g/vHYOVbO9Mk8ZmjpyHlk3i7TE4MSFzLFBijoBxsyhWxkYPCzkE52DZP+/+JoeSg2aIYrAZF1QJpLdgh9VgxS4sfVOePUhs2bdNoNppqZNdoSP4g39h6iU+19tJHBfj4Uh+cCzYo77JRC3DxrnEvMa5gbtycC3bLxcRyopjG2xd6V4qsVJHJxdRjxeA5f+36TWUwc/mGoueOPVn4m/PJ1UrxphZaqZ5dnxUDZzxRKDDGgfr2srlYcHYMxnwhivFN1A9+0WJCVzLUP2SRosTgXGh/+ayAp3MP1ZWZ8zXuHAr1DxEC3ygxSECBM4X2JTvUX8pXmhhznkgFDR/qb+K4tjQxXJG14qLE9DpXpHPEPn84/9BFiBKDYqFPp1B/1PBFtBjfQmvhFyzGXlm7L03a9rf7UjzHB4npdU7gbKEIPWdoLGwunhMCLkgMAjgcGR9JOZ5y6cpLBX8KyhexSxMzNVlPR3ds9prD6qe7Cr4UXoGCUyliIMTUeXDvlv7vqH0voA8fCEFbBaLF3Ll0LD13ckIZTG1/pFw4Xrud+cF/fO/WUjVFicH1jtm8WfyhigCxFCYfHQuxC4vZ/behr/uQYpyvuX84H4krJKbK616aMMcHizldb+Wu++8/f3P5WW5s55Zcrth7KFgMZkfvD/RjUGauQmJiJl9l7FBMlatbJLeJGe6MWYl+a4c70287YuazbnZmebmt1oWYVqupNyfhvn/gOwgFImZffy30FzI96V028ofOxwhBbELfWZp3l672V2dVbTx8tjJ0Dkzrd6eu+vb4k/nH0JBBX2Z4KzaIyFR0jfeNhZoW07UH+vN8frYGAQl9hzhouwMBRgjsfwAAAP//seoVlAAAAAZJREFUAwDQ1Sezk9l1fwAAAABJRU5ErkJggg==',
      users: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAEHElEQVR4AeyY2UtUURzHfzMPFUVlGC1UU0HYZloQRUHRRvkUFAVRtDwE/QEVURRFT20PBb0FlSXaAlYglkhRllb2IE2ZoZJLivtSLiQ93PxeOZcz554791zvMhoK3znbbzmfe37HO0yYEvi3YflMzYnstpowmH0bF2pzkieSquxAsJ4QGIAgudcKHCb/wjbt5K5UUtHySJIjXkcwTuobtuJO2NyXui5SkcwfMZjEdWUYlIZqfcNOTMT8xXnVMWLykvkpwWAjMmfVObf+qnlsYdzWuOjf2v1HdW80b/qkmLtld4fiwqA2kVmlvmEDW14yf35dpY+4THb2ljAoDdSoXQCrdfhCVut+zEthAOJHMsRkT1m1hY+qTDBe1jjeJfwd+dneR9cyr9O13BwlHTp4gGYkTVBlIRMMPPmnhrET8b7oS33Lo0QqkjoPTS5KWTzU4T6lMNz6iOyuXrtOui9bGDxdJxKz8L7imsr45ecm49sC7K1AsBYXxm2Nw7+xo5+g0sp2OpdVFkJSVaWlRGLu1s7de+O6xoUxPFXqGzaGg7nztrzFEYgRAXGZjEmiO0+KTPHUYLggw+k+KKoxJR5OHOZz4mq2NJ4JRqxRFkC1Ff1FkIKcQioojhqyiyvaWoEgjgmGfw+cvZ9JVN8CO2XNXpROUCclS+9IxrErIV4UmWkZO1pZT1+rG3Q9fPGB0nefkZ4IAkAmGEzGvAP0CecfsprePzeiiVKNPPCplux85TCqGSzsZKVwcWmqtmTyFBJlESJmuj8vquRngvGjpgESsztuIOYT7whAOPO4XRMMX8/ou61pbc8B7dya9WSlHSXdZKW0Z7Uxfpumz3AGw1sv3HJI48fx+q9/LSDYi4JPR1sreSHE4iXeIdPJMOOVRy5pUyPL2DBum9WWRrCVKa6ji0XZ3ZPCAITlsatpgDDbRLcmmKMlmrb5/CliKth+max0d9Vpw47Z8+2s9K2e8i0b/G/I3z3xDsXAoN6RvalsgLwQYnkt/u6JsQ0YlBZqXjQYTWMdBiB+bfpxXQ29GvxvxuRXHsQNi3ekt3kA854oaf4Kev+o2NDt/TcoeeIkT2LLgugnw98PmZGbOT9ji/vSYcTJ0ToegxmpJ/ffnExDb5/8R8CR+uSt9vW9s1tfCvxkxPcOe/8MpwUBA0E/cJhpfzVaEhrnid41NoGB2EfgMEgc7f1NXgixmIq6O0IJgWEb8KrNbmnQf7UJVz3PG/yGXBiIsPnCzjZPTgUni3gMBP1wT08qDVBGIKp+843uzcrQdWt8Cl2prw650ZkfFfqJAATSy6y38SMFISRk6qrKj9kIm3fT6jBuAgzHt7n0pucg2Ee4syI3kFPBySOhXyCIHa4tOB4KStVPD/tyIgCBElJmSOyHxmD8eKpexPwHAAD//4deGmQAAAAGSURBVAMAq5I2sn7s2iEAAAAASUVORK5CYII=',
      search: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAD90lEQVR4AdRZTUhVQRSe+9pEbaQiA7WIVqHkol1QZBDUslYRQkS7lv0YKLSJaJHtom0EErXJpWl/okjUQtKUFhGmIumqReu69T04j/HcM//3+l7Bx8ycM+eb8717zrzrq6YS/p04dTZPQcLRYmi0mIuXruadXQdVLMRsEo1RYiAk8dxKwoPFTMx8zW/dHlYx6Ok9WokIIrWKkfoBgfOfPqoYIJYw9XYsk/h1G+31HY1iUEpSP/gS2/Y9ffIoM/HTmbZ4k08Ug4NMAa9ejkY9FTxJcJIQzMtGQYytJ1DzayvfFfBh5p26f2cgC8HgtSuZiz9FYEEMyPApSoCPgJo/2X85t4H28lHiho3vC12LYlwkKJX+u8N55+FuZYKLowq/Uww+MQISICGYx4D3XAyHKcYqZnX5W70/qEdQ85N5ng8NXlcSjvSdNp3TsPMea9/X0fClTjaJwR1vIqQegX/ul1IS4CNMjjzOaB4z4jzko8PF0xCD6xh3vBRApYX+kPzcNjJ0I0kIzqN8kBPAz5DWdTEIJKde07CBGM2OuYS51+OKAH+oEOk8PR9w+qKm3/v8e0TqkfV/JUbkKwvzavXLQh3vXzxXA8d6g5+I3kM4j+dDZ/mM9Sej31ZSkN4fkh+21B4BB8GVD+3jY10MN4auQ0srlN93f7AY6g+MOKRVhCCXIDFl9AgOrQLgDBKDAEKZPUKcqWOUmFYqLf0DcIoZH037HtEPq3ruFHPv/JmMEPM9UrUAnd8oJubdSCeOmeM9zBSHfEw+soti8AqDVwq8ExEooKqRzpP4kY9k57Zame9GnNx3DSG0V8qHfK6xVua7keswyc/fxfC3E4DfGPCuJsWYbGKZmd6NUNM6TKS+dnBhr+k8+EIgipEIqHdolPaE2FBa4AqJce31FuMiCvFDSMh+371WMV0HDm36TRl/7/gSm/bpPYLfqzfW10xbg+1WMWCjesaINQH3Pmo+FIgHFwFrCfnGrGS22pxipGjc+ygV1HwoJD5u+7M0xk1e64IY/Z6fZ7/2g5GEYB4DF3+sEORSEKN/7/A57n1e86h7X6Dn+rZNqAu7pkX8nn2InKJREOPDxJ+Y75q4Py//VBLIT+Px7vZcB9lNY5QYE1mZ9o7dO5QOH+5gMbaadz0hn4RS9gSL4X0UskbP2ZLt2rNT3TzX00D3/jbb9oaPJsFiKLCqUe8lfobeP5hzf8uJ4QnSWu8fzMmuj1su5s3cj003mZ5M6nzLxTwYXcx07G3bbtQQ2kNbLsaYucFh6yEe0vJieMK2ddPFlNlDTRej9w/mth6yPRX4mi4GScRgenGj8B9b/6WYZ1NLBSH4QFpODO8hfpuZhEDMXwAAAP//LCP/PgAAAAZJREFUAwAJztAlmmeO9gAAAABJRU5ErkJggg==',
      gear: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAADnklEQVR4AexYO2sVQRSeuyDYiF7EB2gQ0cJCtLC3iBAQ/AFiY2FnaREhhU0sBLVRsBUbwcpKFBUFIYWCICKYIJFouKCiRlEIWHjlW+4s554589wddwMJfNkzM+f1zZzZ2bmFyvh3dPL40IWmQ2cjc+r02eHuib3KhqaJwF8WMiAC5/8bjZN5OPdueP7CFSXh4OEjWflFkeH1b8vs9asXSoJN39YfGk/bB5NB6dD61w5yPVPiBZGB41xJS35T43nJ0D2Qu+ZBrE48JxnULALo+odMgXEOOu6TuS3asAmNB10KKxksNfYIVaYyxiRQHZcs2aLPZoMxCklPJAMiknLX+wwytGZxVnz+NKg4TOzZJ54f0NOg+pXhSIi15/q+PWuQQVxds3iiTYE+F6iuJLtsMcZt0KdBx549ud+jbcgiGQx0Gbdv3TCIIF+DzKMHd8dObyi1Cb0qeCIPGxGMGWQuz073KHbs3AW9VrD8YVENPi6VeD73VM2cOyOuiE7OIKMH8NTvfchdAPKh4DlZyeD1jPc6N2irjVwopDxEMiAiKUt9qOU6kHym9hlkXOcMD4KaXv2j1IaN/SQszC8o156MOWeQW4F/GqhHyHSm0fZhsPxepcDnF+OuXJAvRUUGpYWahIO1AORKgZxLMiCCRghcMwV73wpBh6LJc62os0d+r/5Vv36uVLmtfPuifnz/WmJp8a16fO9Oj2PT5n6l39+6fWyv1d1D5cr4ZruKPhLo7I+6kh+xvly5lmSSM+mY4TqZji1IlU7Wldl/4NCQo4rcsID7TTYyW/rblISGOZTu9LWgiH3Pz795OXbal95q/Kv7NtNEkEJB7y6Qfd9KV6/dVBqTx6YUPzemTpxULvBzaXrmYuVv9tJ15foNAd+CrvtNdJm53vOYHTrTkgwdDp9Pro829gieFNFkqHFbMi0tmoNBpu4eklbD1kcTscl81WxEYG+Qwb6hiNlDei+FPuvuERCgMMjQQdwVaFuS6cylyJJPWx/yoeB6VjK4FuC+wA3aaiMXCikPkQyISMpd7zPIxNxvcpML/Q1A52GQwQCtfbTbhC2X9XOGrwqdKUnm+rwt2dA+lz7GGjtn+LcRPY+07DqXYu25fq3fmjETNkg1a9Ntoj8knvgC8AV3LbXPNmU8NJ6XDP1WQyKhjqGbgjrxvGT0XsDTV7MpyXMbxNGIjeclw4M11Q7ZA7GxWiGTq1QbJ0Nrnp4fkDHTuYjA9z8AAAD//4LBBzsAAAAGSURBVAMADbQSsDXKJiAAAAAASUVORK5CYII=',
      book: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAADD0lEQVR4AeyYzUtVQRjG33sgcGlB9mERtpAkIcGVEBZuKlpH0rI/IGgREWULayX1B7QJ+oIWgS2DuFC6k6AvL0UUZnFRyxCCWnbqOTBy5sOZ8555b55bCo/HM/PO+8zvzMw7YEL/0M8GTFUX8/9ZmRMnT6UxCq1gTG6MNfOvuTIXx66kvb19VFamkfneivxOGBiZ5pLvrcpvwfxK0/Tq+CUqo4PDh4PMrcyvwah9+LG5QmVkkgyPHEtNIaZMbozB2Lww37xWYbD0OB/54Ji/N3V00q7dPZZicubHYq55oS+DAQhepDT3aUEqFStPYu7h+T9bjJXBCD50dJTOX77mVP+BQSOa97qvb792ls0zmq0M9qMSL707+tWLGXLJHc1rVfPE0xyZwZiN7fpuwUw9qRNHseAcL8T6/DSYt28atKNngAaGjhdS88t32tO92Zff2yftp8EoZ9d+d7Wp+NinK7erLeTjhAkNqmq/BfP40aSzEpX5UkWgJf00GNTxifFzVFQXzp6mmHtJ0g8fToNBA+o3RxgTI44XYn1eFowvuOp9FgxqeVmVgeV6+Tw0GG7dN++jnXsHaWmx6fPT+rh+oXtNg1FOrspVtE3l4DylcjthOBOpUqwFw6n7ri/KheP4hXJrMNy6b95HI8NDtG17d8hztZ/rF7rXNBi4oJaXFcZzxfXy5bdgfMFV77NgJOt+EXhJPw1Guu6HYKT9NBhl7qpSrjYVH/t05Xa1hXycMKFBVe23YCTrfhFoST8NRrruh2Ck/TQYmEvWfeQLScpvcbZOFkzIvIr9H57ezKaV3Ln3gPV/Mt+9gIy+M4B+aT8FgtzJ1vc3qP/rbRF1zU7Q6JbpNXWk9lDER8332a0zYCD1K9tmr+dXqB2lIPCcbizVMhi8tLPuT83VMP+k/nJBdFWQ1CfJHQAfBYK/k+uTjZqkujo7kNepz8s/qPntZ6aZd8sU6zt293m2Isps3bYZ9riahNRzXWDyW0MKBHnEYXxnEIatAkFucRjfOTD3OCYgKXEYyclxc23AcL/Y34r/DQAA//8ave2eAAAABklEQVQDABbm4MHcYs71AAAAAElFTkSuQmCC',
      hglass: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAES0lEQVR4Aexaz0tUURQ+U9DCEAIDA8VoESGKtggXQlGU4KIfKEIu3Ej+A6IWZEEbzcCW7goXDZYb3QkDBaJBWoRoikiLUAMVF0GGq+Ll9+TonfPufe/d9940IyR+c3+cc8+538z5uL7xHiOfn8tVpU4hQ27dSKb1yjmnrKSIChWSCMZaMiAC41GDh8zEkxtOT1M1FSKqKk75vr8eMvD+svqDChHYG2N6aSvFfW61ZNhYqO2bqW8eItirh8y7+Y2C/FRQKdiwiQhsHjLPx5dSKm6NLVJHnlDaM0Jbl9pdfD5ZR4/Tc9pPBEQADxlMSszvEOUDch9B41BkgoIUit2azPzbDOUScd4YKzJriwu0vrzo4sPYKD1tbkz1N76g/qbXkdB6vI9KZjtdbKY73HhniqPTsSKjpplMD6eutrU77tzKNlEUuIv3X4bHvh/G25/KekW+rAnNIBKZdG93qq1v0CmvrNKEtJ/qfrbsGw/5wkQNJJMZP9QIAiIwiKAPZEZWKfN++wCY84P0ZSK8RpePbUFtIBnognG/vjY16ThO78MuAmquNVB6666Lgclqauz4lKKKImPOhZUdWvz6y8XoxAbV3pn2xFtXNIl8xmAaQyAZzZqDM0e1oaYPNKQaDH1VI3yGqa6Ip47D9CORkYG59MJqiEvL5I94MkeYsTUZXU37aSiXGpEErcmwftCipoM0BB0xktaISgZ9azJYJGGqeWhIAmtN/rDFQSJk5AZQ8yg9aEJC+mIMf7RxEZtMkIbkBnX+0ifqODYZaIchNYSzSAXOpTjnSBDJ2GTUBNAHxqwJ2cLGwDkCfxVsi9omRoY1EmYj0Aj7s6bCrAvySYQMNsaJVE3I5x74MBH0k0ZsMvKcUTXBWuJWagoaSpJQLDKod2yGtYE+A5poby53JGA3+SOeCvjaIDIZlBbqXZcMpTT4oNKpOl9MEiZ/joeYgM4vaC4SGSTmwKpGMMdE0NdB56/G060JO2dNxk8j0ISz2+J0DdSRDg31p93nfTz345kf/jJe2I3r/KzIoJ4RxFTz0Afsxu8DXOPhC/ub4iGfisOV+l5oMigFUy1zaUEf+jTeWfgCXgsR4nE+5AR0fnIuFBkE5oW6mofY2W7b6uKp+WziBZKRNa2eI6h5qRFa2zXmr7lQnKWlpDUUSAY709U05rnmszQCgx/U79eEH8cz5RPunmEoMp5VexM3y2bcM2Svm8gv9APECRaJzMWfL+PkzNlaazKvOmey6t5PI0G71mkoaI3OznPWZNyFPnXv2m1eEowVjYzNZv+hrzUZ+d2y+r1Y3H5c3lZkKqpr6Oy9jznDidtTtLn3L8eopHzJ4N6MDMxnQK5amY/Hf+YmCPtRwTZujWRw5QT3Ztgxn+3vzJDnDo9uP1oyIMLO6t9O8pk+12PsAUTQhoGHjLw707I6RPnC9dlHWXd4/t+dCfOR5tPHdOXEU2ZH+e7MXwAAAP//WGtSdQAAAAZJREFUAwC/2qASLtNI5QAAAABJRU5ErkJggg==',
      crown: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAC8ElEQVR4AexXPWsVQRS92TLwOu3UyigqCDYWBiuR1/vxA/wHgqCNlY0WFhZiL6iNwUqID1GCWqXxoxCChUYQJQ9FiUST5mXPTWZyd3ZnZ+4m7NsNG96Znblz5uw9e2cYktAu+uvMNLWYXWW6ytTwBbptVsNHrvSKTGUunds3kqikKBZJLfTFVKUuNCRcEWvm9rUjo2NTPTJwidrxOPTYDF6sTbaMPy69ZLRyYXTl1kkCzp7aU5Zj1Nw49bgytDAkhpOu3J/oO9O5oeXUpOcmsGHGjaZjc3bMMw2V/rC1wPWRMCfh45l4SM/w5NNrRpJCfbw4xNHMV9XLmDl+uMdnB+cHiDlD8oxgDX1dsXnvtJ4V9nQyZphj9jueHNhqcCYk7Ay4Bja42TFxPDdDvge0eQ5cAw7ENXkznnVyv6PvoVUOY2ttVzfaTOUsIxbCSAQtSCk1U2XPB9/oEMrOnEMtHWKy1AwIfP949q/d40zUN3a90cdTL2NXhM1YaraD/Q1ko/EjrAXiV4SZlc2EpetnqMy4Z8i9V0Lpb3d9SF9lhsWwryU4qGjkWvQVS0NUvZmQ4hjn1WYGb4YkEcpdctHfab7UU5n5sLBM/WeHqP/6BGPyfo/owKTUy/TBnzk6T4MzG7izfC/I1+hnXpYOVGZSPv9+DpcI4EFE8/3tKgERVKZAG+CBoqlkRqFfK1Vt5vHiZ3qZVgaIyfTT7NO0Ks8ZMXytvtRUmcE9cXF+igxOv9pP8v8XKYw++HM3Zshg9vLdIN9o4xnSxzskVGZ4Ie4GCQ6WNJKLfgmVp8CR4GC+Wfu1lgvqzeQk6g/8//av8KXJ4NFi5t7AXdBUwIHPCOaS/sEe9af3tgJ/03sOSfvA2+zP+9/UBkgTD+eWJuQYfTaDTptw/cGXnBHknzwZ/KAXaWXaACTsM4K55PzNjxNtwfTVd4UVgRGgldsMiRehM1P0VZoQ6yrThCoU5dBVpuirNCHWVaYJVSjKoatM0VdpQmwdAAD//8gTlMMAAAAGSURBVAMAB6YblKgU7sIAAAAASUVORK5CYII='
    };
    const vi = (n, c) => '<i class="vi' + (c ? ' ' + c : '') + '" style="background-image:url(' + ICONE[n] + ')" aria-hidden="true"></i>';
    const CHIARO = '--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--title:#6a2a1a;--tshadow:#e0c48a;--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--rowh:#8a5a0a12;--ember:#a8560a;color-scheme:light';
    const stile = '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><style>' +
      ':root{--bg:#10131a;--pan:#1b2030;--pan2:#232a40;--fg:#e8ecf4;--mu:#9aa4b8;--ac:#f5b942;--hi:#ffd27a;--lo:#c98a1a;--ember:#ff8a5a;--title:#f5b942;--tshadow:#8a3b12;' +
      '--frame:#8a6a3a;--drop:#2e1d10;--line:#f5b94230;--line2:#f5b94266;--wd3:#4a301b;--good:#4cd07a;--bad:#e8484f;--rowh:#f5b9420f;--f:Georgia,"Times New Roman",serif;color-scheme:dark}' +
      '@media(prefers-color-scheme:light){:root{' + CHIARO + '}}*{box-sizing:border-box}' +
      'body{margin:0;color:var(--fg);font:400 16px/1.55 var(--f);background:radial-gradient(ellipse 90% 50% at 50% -10%,#24305466,transparent 70%),' +
      'repeating-linear-gradient(26.565deg,transparent 0 46px,var(--line) 46px 47px),repeating-linear-gradient(-26.565deg,transparent 0 46px,var(--line) 46px 47px),var(--bg);min-height:100vh}' +
      // barra di legno con i chiodi, come l'intestazione della guida
      '.bar{position:relative;display:flex;align-items:center;gap:12px;padding:14px 24px 15px;font:bold 1.25rem/1.1 var(--f);font-variant:small-caps;letter-spacing:.04em;color:#ffd27a;' +
      'text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244;background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);' +
      'border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f,inset 0 -2px 0 #2e1d1055,0 5px 0 #00000066}' +
      '.bar::before,.bar::after{content:"";position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}.bar::before{left:8px}.bar::after{right:8px}' +
      '.vi{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em;background:center/contain no-repeat;flex-shrink:0;filter:drop-shadow(0 1px 0 #0008);image-rendering:pixelated}.bar .vi{width:34px;height:34px}h2 .vi{width:1.3em;height:1.3em}.stats .vi{margin-right:.4em}.bar small{display:block;font:italic 400 .75rem var(--f);font-variant:normal;letter-spacing:0;color:#f4e2b8;text-shadow:1px 1px 0 #0008;margin-top:3px}' +
      'main{max-width:860px;margin:0 auto;padding:22px 16px 48px}' +
      'h2{display:flex;align-items:center;gap:10px;font:bold 1rem/1.25 var(--f);text-transform:uppercase;letter-spacing:.1em;color:var(--hi);margin:1.9em 0 .6em}' +
      'h2::after{content:"";flex:1;min-width:30px;height:2px;background:linear-gradient(90deg,var(--line2),transparent)}' +
      '.tag{display:inline-block;font:bold .62rem var(--f);text-transform:uppercase;letter-spacing:.08em;color:#2a1a06;background:linear-gradient(180deg,#ffd27a,#c98a1a);border:1px solid #0005;border-radius:2px;box-shadow:0 2px 0 #0007;padding:.15em .5em;text-shadow:none;font-variant:normal}' +
      // il sindaco in carica: il riquadro in evidenza della guida
      '.callout{background:var(--pan2);border:3px solid var(--lo);border-radius:6px;box-shadow:0 0 0 3px var(--wd3),0 7px 0 3px var(--drop),0 16px 30px #0007;padding:1em 1.2em;margin:6px 3px 0;display:flex;gap:16px;align-items:center;flex-wrap:wrap}' +
      '.callout .vi.big{width:64px;height:64px;filter:drop-shadow(0 3px 0 #0008)}.kick{font:bold .72rem var(--f);text-transform:uppercase;letter-spacing:.16em;color:var(--ember);margin:0}' +
      '.nome{font:bold clamp(1.7rem,5vw,2.4rem)/1.1 var(--f);color:var(--title);text-shadow:2px 2px 0 var(--tshadow);margin:.1em 0;overflow-wrap:anywhere}.callout p{margin:0}' +
      '.mu{color:var(--mu)}.stats{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:20px 0 0;padding:0}' +
      '.stats li{font-size:.92rem;color:var(--mu);background:var(--pan);border:1px solid var(--line2);border-radius:4px;padding:.3em .75em;box-shadow:0 3px 0 var(--drop)}.stats b{margin:0 .3em;font:bold 1.15rem var(--f);color:var(--hi);font-variant-numeric:tabular-nums}' +
      // tavole con l'intestazione di legno
      '.tw{overflow:auto;border:2px solid var(--frame);border-radius:4px;background:var(--pan);box-shadow:0 5px 0 var(--drop),0 10px 20px #0005}table{border-collapse:collapse;width:100%;font-size:.93rem}' +
      'th{text-align:left;font:bold .7rem var(--f);text-transform:uppercase;letter-spacing:.1em;color:#ffd27a;text-shadow:1px 1px 0 #0008;padding:.75em .7em;white-space:nowrap;' +
      'background:repeating-linear-gradient(180deg,#0000 0 13px,#00000022 13px 14px),linear-gradient(180deg,#86603b,#5e3f25);border-bottom:2px solid #3a2414}' +
      'td{padding:.5em .7em;border-bottom:1px solid var(--line);vertical-align:middle;overflow-wrap:anywhere}tbody tr:nth-child(even){background:var(--rowh)}tbody tr:hover{background:var(--line)}' +
      'td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}td.vuoto{color:var(--mu);font-style:italic;text-align:center;padding:1em}' +
      '.vb{display:flex;align-items:center;justify-content:flex-end;gap:10px}.vb i{display:block;height:10px;min-width:4px;border-radius:2px;background:linear-gradient(180deg,#ffd27a,#c98a1a);box-shadow:0 2px 0 #0006}' +
      'tr.primo td:first-child{color:var(--hi);font-weight:bold}' +
      // pulsanti come quelli del gioco
      '.az{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}button{font:15px var(--f);color:#fff;background:#2a3350;border:1px solid #f5b94288;border-radius:3px;padding:.5em .95em;cursor:pointer;' +
      'box-shadow:0 3px 0 #00000080;transition:transform .08s,box-shadow .08s,background .15s}button:hover{background:#3b4770}button:active{transform:translateY(2px);box-shadow:0 1px 0 #00000080}' +
      'button.oro{background:linear-gradient(180deg,#ffd27a,#e0a634 55%,#c98a1a);border-color:#fff0c0;color:#2a1a06;font-weight:bold;text-shadow:0 1px 0 #fff5}button.oro:hover{filter:brightness(1.08)}' +
      'button.no{border-color:#e8484f99}button.no:hover{background:#5a2430}button:disabled{opacity:.55;cursor:wait}' +
      'button:focus-visible{outline:2px solid var(--ac);outline-offset:2px}.esito{margin:12px 0 0;min-height:1.5em;font-style:italic}.esito.ok{color:var(--good)}.esito.err{color:var(--bad)}' +
      '.foot{margin-top:40px;padding-top:12px;border-top:3px solid var(--wd3);color:var(--mu);font-size:.85rem}' +
      '@media(max-width:560px){.bar{padding:12px 20px;font-size:1.1rem}.callout .vi.big{width:48px;height:48px}th,td{padding:.45em .5em}}</style>';
    const tavola = (teste, righe, vuoto) => '<div class="tw"><table><thead><tr>' + teste.map(t => '<th' + (t[0] === '#' ? ' class="n">' + t.slice(1) : '>' + t) + '</th>').join('') + '</tr></thead><tbody>' +
      (righe.join('') || '<tr><td colspan="' + teste.length + '" class="vuoto">' + vuoto + '</td></tr>') + '</tbody></table></div>';
    function pagina(admin) {
      const s = st(), sd = sindaco(), cl = conta(), ora = Date.now(), max = cl.length ? cl[0].n : 1;
      const attivi = s.attivi.filter(a => a.fino > ora && !a.sospeso), mm = t => { const m = Math.max(1, Math.round((t - ora) / 60000)); return m + (m === 1 ? ' minuto' : ' minuti'); };
      return '<!doctype html><html lang="it"><meta charset="utf-8"><title>Sindaco di Aldoria' + (admin ? ' · admin' : '') + '</title>' + stile +
        '<header class="bar">' + vi('tophat') + '<div>Il Sindaco di Aldoria' + (admin ? ' <span class="tag">admin</span>' : '') + '<small>Elezioni settimanali e decreti della città</small></div></header><main>' +
        '<section class="callout">' + vi(sd ? 'tophat' : 'castle', 'big') + '<div><p class="kick">' + (sd ? 'Sindaco in carica' : 'Municipio vuoto') + '</p>' +
        (sd ? '<p class="nome">' + e(sd.nome) + '</p><p class="mu">Eletto ' + e(new Date(sd.dal).toLocaleDateString('it-IT')) + ' con ' + sd.voti + (sd.voti === 1 ? ' voto' : ' voti') + '.</p>'
          : '<p class="nome">Nessun sindaco</p><p class="mu">Votalo nel gioco con /vota nome.</p>') + '</div></section>' +
        '<ul class="stats"><li>' + vi('hglass') + 'Prossimo spoglio <b>' + e(quando(s.prossima || prossimaElezione(ora))) + '</b></li><li>' + vi('users') + 'Elettori finora <b>' + Object.keys(s.voti).length + '</b></li>' +
        (attivi.length ? attivi.map(a => '<li>' + vi('crown') + 'In vigore <b>' + e((lista().find(d => d.id === a.id) || {}).nome || a.id) + '</b> ancora ' + mm(a.fino) + '</li>').join('') : '') + '</ul>' +
        '<h2>' + vi('users') + 'Voti della settimana</h2>' + tavola(['Candidato', '#Voti'], cl.map((r, i) => '<tr' + (i ? '' : ' class="primo"') + '><td>' + e(r.nome) + '</td><td class="n"><div class="vb"><i style="width:' + Math.round(r.n / max * 120) + 'px"></i>' + r.n + '</div></td></tr>'), 'Nessun voto per ora') +
        (admin ? '<h2>' + vi('search') + 'Chi ha votato chi</h2>' + tavola(['Elettore', 'Voto', 'IP'], Object.values(s.voti).map(v => '<tr><td>' + e(v.nome) + '</td><td>' + e(v.perNome) + '</td><td class="mu">' + e(v.ip) + '</td></tr>'), 'Nessun voto per ora') +
          '<h2>' + vi('gear') + 'Azioni</h2><div class="az"><button class="oro" onclick="f(\'spoglio\',this)">Fai lo spoglio adesso</button><button class="no" onclick="f(\'togli\',this)">Togli il sindaco</button><button onclick="f(\'decreto\',this)">Ridai il decreto di oggi</button></div><p class="esito" id="esito"></p>' +
          '<script>function f(a,b){if(!confirm("Sicuro?"))return;var o=document.getElementById("esito");b.disabled=true;fetch("admin/"+a,{method:"POST",headers:{"x-voxelia":"1"}}).then(function(r){return r.json()})' +
          '.then(function(j){o.className="esito "+(j.ok?"ok":"err");o.textContent=j.ok||j.err;setTimeout(function(){location.reload()},900)}).catch(function(){o.className="esito err";o.textContent="Il server non risponde.";b.disabled=false})}</script>' : '') +
        '<h2>' + vi('book') + 'Elezioni passate</h2>' + tavola(['Data', 'Eletto', 'Voti'], s.storia.map(h => '<tr><td>' + e(new Date(h.t).toLocaleDateString('it-IT')) + '</td><td>' + e(h.vincitore || '—') + '</td><td class="mu">' + e(h.voti.join(', ')) + '</td></tr>'), 'Nessuna elezione finora') +
        '<p class="foot">Il Sindaco di Aldoria ' + e(module.exports.version) + ' · plugin di Voxelia</p></main></html>';
    }
    api.route('GET', '/', (req, res, x) => x.send(pagina(false)));
    api.route('GET', 'admin', (req, res, x) => x.send(pagina(true)), { admin: true });
    api.route('POST', 'admin/*', (req, res, x) => {
      const a = x.path.split('/').pop(), s = st();
      if (a === 'spoglio') { elezione(); return x.json({ ok: 'Spoglio fatto: ' + (sindaco() ? sindaco().nome : 'nessun sindaco') }); }
      if (a === 'togli') { const v = sindaco(); delete s.sindaco; api.save(); if (v) api.announce('🎩 ' + v.nome + ' non è più sindaco di Aldoria.'); return x.json({ ok: 'Sindaco tolto' }); }
      if (a === 'decreto') { if (s.sindaco) { s.sindaco.giorno = ''; api.save(); } return x.json({ ok: 'Il sindaco può emanare un altro decreto oggi' }); }
      x.json({ err: 'Azione sconosciuta' });
    }, { admin: true });
  },

  // spegnendo il plugin, i moltiplicatori dei decreti tornano come prima; se riparte prima della scadenza, il decreto riprende
  stop(api) {
    const s = api.store; if (!Array.isArray(s.attivi)) return;
    for (const a of s.attivi) if (a.k && !a.sospeso && api.server.cfg[a.k] === a.val) { api.server.setCfg({ [a.k]: a.prima }); a.sospeso = true; }
    api.save();
  }
};
