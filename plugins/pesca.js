// Gara di pesca: albo dei record del server, gare a tempo e annunci dei pesci leggendari.
// Nel gioco il plugin "avvolge" fishLand() (la pesca della 7.3) e manda al server specie e peso di ogni pesce preso.
// Il server conosce già nome, rarità e peso possibile di ogni specie (vedi SPECIE): scarta i pesi impossibili, i pesci
// del mare aperto presi fuori dalla barca, i leggendari presi nel mare sbagliato e le catture troppo ravvicinate.
// Resta un limite: i dati arrivano dal gioco del giocatore, quindi chi modifica il proprio gioco può ancora mandare
// catture finte ma plausibili. Anche i nomi degli eroi non sono verificati: "organizzatori" si fida del nome.
//
// Comandi: /pesca (aiuto e gara in corso), /pesca record, /pesca gara, /pesca io, /pesca via [minuti], /pesca stop.
// Pagine (con l'aspetto della Guida e dei menu del gioco): /plugins/pesca/ (albo e classifica, per tutti), /plugins/pesca/admin (avvia e ferma le gare), /plugins/pesca/dati (JSON).

// specie del gioco 7.3.2: nome, rarità (0 comune … 4 leggendario), peso minimo e massimo in kg, mare = solo dalla barca
const SPECIE = {
  sardina: ['Sardina', 0, .05, .15], sgombro: ['Sgombro', 0, .2, .7], orata: ['Orata', 1, .4, 1.8], branzino: ['Branzino', 1, .5, 3],
  polpo: ['Polpo', 2, .8, 4], calamaro: ['Calamaro', 1, .3, 1.5], pesce_spada: ['Pesce spada', 3, 20, 80], trota_dorata: ['Trota dorata', 3, 1, 4],
  stivale: ['Stivale vecchio', 0, .4, .9],
  acciuga: ['Acciuga', 0, .02, .06, 1], merluzzo: ['Merluzzo', 0, .8, 4, 1], dentice: ['Dentice', 1, 1, 6, 1], ricciola: ['Ricciola', 1, 3, 15, 1],
  lampuga: ['Lampuga', 2, 4, 18, 1], razza: ['Razza', 2, 2, 10, 1], cernia: ['Cernia', 2, 5, 25, 1], tonno: ['Tonno', 2, 15, 90, 1],
  murena: ['Murena', 2, 1, 6, 1], pesce_lanterna: ['Pesce lanterna', 3, .3, 1.2, 1], verdesca: ['Verdesca', 3, 20, 60, 1],
  re_spada: ['Re Spada', 4, 120, 300, 1], tonno_rosso: ['Tonno Rosso Gigante', 4, 250, 600, 1], murena_abissi: ['Murena degli Abissi', 4, 30, 80, 1],
  luna_argento: ['Luna d\'Argento', 4, 200, 900, 1], vecchio_testardo: ['Il Vecchio Testardo', 4, 300, 500, 1]
};
// i cinque mari della Puledra: cosa ci si pesca e il leggendario di ognuno
const MARI = {
  mare_scogliera: ['Scogliera dei Gabbiani', 're_spada', 'acciuga merluzzo dentice ricciola orata sgombro razza pesce_spada'],
  mare_banco: ['Banco dei Tonni', 'tonno_rosso', 'sgombro ricciola lampuga tonno acciuga pesce_spada verdesca'],
  mare_fossa: ['Fossa Profonda', 'murena_abissi', 'merluzzo cernia murena razza polpo pesce_lanterna verdesca'],
  mare_grotta: ['Grotta Marina', 'luna_argento', 'calamaro pesce_lanterna polpo murena dentice acciuga'],
  mare_naufragio: ['Punta del Naufragio', 'vecchio_testardo', 'cernia polpo murena stivale verdesca tonno merluzzo']
};
const RARITA = ['Comune', 'Non comune', 'Raro', 'Epico', 'Leggendario'];

// codice nel gioco: avvolge fishLand e manda ogni pesce preso al server
function nelGioco(ID) {
  if (typeof fishLand !== 'function') { console.warn('[pesca] questa versione del gioco non ha fishLand: la gara di pesca non vede le catture'); return; }
  const vecchia = fishLand;
  fishLand = function (F) {
    const r = vecchia.apply(this, arguments);
    try { const x = F && F.res; if (x && x.f) VXP.send(ID, 'preso', { id: x.f.id, kg: x.kg }); } catch (e) {}
    return r;
  };
  VXP.on(ID, 'avviso', d => { try { msg(d.testo); } catch (e) {} });
  VXP.on(ID, 'banner', d => { try { VXAnnuncio(d.titolo, d.testo, 'stella'); } catch (e) {} });
}

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
  name: 'Gara di pesca',
  version: '1.2',
  author: 'Voxelia',
  description: 'Albo dei record per ogni specie, gare di pesca a tempo con premi e annuncio dei pesci leggendari',
  defaults: {
    durataMinuti: 30,                // durata di una gara
    orari: [],                       // gare automatiche all'ora del server, es. ["18:00", "21:30"]
    premi: [{ oro: 3000, xp: 400 }, { oro: 1500, xp: 200 }, { oro: 750, xp: 100 }],   // primo, secondo, terzo (oro, xp, pozioni)
    organizzatori: [],               // nomi degli eroi che possono scrivere /pesca via e /pesca stop (oltre al pannello admin)
    annunciaLeggendari: true,        // annuncio a tutti quando qualcuno prende un leggendario
    annunciaRecordDa: 2,             // rarità minima per annunciare a tutti un nuovo record del server (0 comune … 4 leggendario, -1 mai)
    secondiTraCatture: 4             // catture più ravvicinate di così vengono scartate
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, S = api.store;
    S.rec = S.rec || {}; S.pes = S.pes || {}; S.premi = S.premi || {};
    if (S.gara === undefined) S.gara = null;
    const K = s => String(s || '').trim().toLowerCase();
    const kgS = k => k >= 10 ? k.toFixed(0) + ' kg' : k >= 1 ? k.toFixed(1) + ' kg' : Math.round(k * 1000) + ' g';
    const tempo = ms => { const m = Math.max(0, Math.ceil(ms / 60000)); return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min'; };
    const ultima = new Map();       // nome → ora dell'ultima cattura accettata
    let capoAnnunciato = 0, capo = '';

    // ---------- la gara ----------
    const classifica = () => S.gara ? Object.values(S.gara.tot).filter(t => t.kg > 0).sort((a, b) => b.kg - a.kg || a.t - b.t) : [];
    function avvia(minuti, da) {
      if (S.gara) return 'C\'è già una gara in corso: finisce tra ' + tempo(S.gara.fine - Date.now()) + '.';
      const m = Math.max(1, Math.min(600, Math.round(+minuti || C.durataMinuti || 30)));
      S.gara = { inizio: Date.now(), fine: Date.now() + m * 60000, da: da || 'il server', tot: {}, avvisi: {} };
      capo = ''; capoAnnunciato = 0; api.save();
      api.announce('🎣 Gara di pesca! Per ' + m + ' minuti vince chi pesca più chili. Classifica: /pesca gara');
      api.broadcast('banner', { titolo: 'Gara di pesca!', testo: m + ' minuti: vince chi pesca più chili' });
      api.log('gara avviata da ' + (da || 'il server') + ' per ' + m + ' minuti');
      return 'Gara avviata per ' + m + ' minuti.';
    }
    function premia(p, pr, pos) {
      if (pr.oro > 0) p.give('gold', pr.oro);
      if (pr.xp > 0) p.give('xp', pr.xp);
      if (pr.pozioni > 0) p.give('pot', pr.pozioni);
      p.tell('Premio della gara di pesca (' + pos + '° posto): ' + [pr.oro > 0 && pr.oro + ' oro', pr.xp > 0 && pr.xp + ' xp', pr.pozioni > 0 && pr.pozioni + (pr.pozioni === 1 ? ' pozione' : ' pozioni')].filter(Boolean).join(', ') + '.');
    }
    function chiudi(perche) {
      const g = S.gara; if (!g) return 'Non c\'è nessuna gara in corso.';
      const L = classifica(), premi = Array.isArray(C.premi) ? C.premi : [];
      S.gara = null;
      if (!perche) S.ultima = { fine: Date.now(), podio: L.slice(0, 3).map(t => ({ nome: t.nome, kg: t.kg, n: t.n })), pescatori: L.length };
      if (perche) { api.announce('🎣 La gara di pesca è stata annullata (' + perche + ').'); api.save(); return 'Gara annullata.'; }
      if (!L.length) api.announce('🎣 La gara di pesca è finita: nessuno ha preso niente!');
      else {
        api.announce('🏆 Gara di pesca finita! Vince ' + L[0].nome + ' con ' + kgS(L[0].kg) + (L[1] ? ' · 2° ' + L[1].nome + ' (' + kgS(L[1].kg) + ')' : '') + (L[2] ? ' · 3° ' + L[2].nome + ' (' + kgS(L[2].kg) + ')' : ''));
        api.broadcast('banner', { titolo: 'Vince ' + L[0].nome + '!', testo: 'Gara di pesca: ' + kgS(L[0].kg) });
        L.slice(0, premi.length).forEach((t, i) => {
          const pr = premi[i] || {}, p = api.player(t.nome);
          if (p) premia(p, pr, i + 1); else (S.premi[K(t.nome)] = S.premi[K(t.nome)] || []).push(Object.assign({ pos: i + 1 }, pr));
        });
      }
      api.save(); api.log('gara finita: ' + (L.length ? L.slice(0, 3).map(t => t.nome + ' ' + kgS(t.kg)).join(', ') : 'nessuna cattura'));
      return 'Gara chiusa.';
    }
    api.on('join', p => {
      const P = S.premi[K(p.name)]; if (!P) return;
      delete S.premi[K(p.name)]; api.save();
      api.after(3000, () => { const q = api.player(p.name); if (q) for (const pr of P) premia(q, pr, pr.pos); });
    });
    // ogni 15 secondi: fine della gara, avvisi degli ultimi minuti e gare automatiche
    let orarioFatto = '';
    api.every(15000, () => {
      const now = Date.now(), g = S.gara;
      if (g) {
        const resta = g.fine - now;
        if (resta <= 0) return chiudi();
        for (const m of [10, 5, 1]) if (resta <= m * 60000 && resta > (m * 60000 - 60000) && !g.avvisi[m] && g.fine - g.inizio > m * 60000 * 2) {
          g.avvisi[m] = 1; api.save(); const L = classifica();
          api.announce('🎣 Gara di pesca: ' + (m === 1 ? 'manca 1 minuto' : 'mancano ' + m + ' minuti') + (L.length ? '! In testa ' + L[0].nome + ' con ' + kgS(L[0].kg) : '! Nessuno ha ancora preso niente'));
        }
      }
      const d = new Date(), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), chiave = d.toDateString() + ' ' + hm;
      if (Array.isArray(C.orari) && C.orari.some(o => String(o).trim().padStart(5, '0') === hm) && orarioFatto !== chiave) { orarioFatto = chiave; if (!S.gara) avvia(C.durataMinuti, 'orario ' + hm); }
    });

    // ---------- le catture dal gioco ----------
    function valida(p, d) {
      const id = d && String(d.id || ''), s = Object.prototype.hasOwnProperty.call(SPECIE, id) && SPECIE[id], kg = d && +d.kg;
      if (!s) return 'specie sconosciuta ' + id.slice(0, 30);
      if (!isFinite(kg) || kg < s[2] - .01 || kg > s[3] + .01) return s[0] + ' di ' + kg + ' kg';
      const z = String(p.zone || '').split('@')[0], mare = MARI[z];
      if (s[4] && !mare) return s[0] + ' fuori dal mare (' + z + ')';
      if (mare && id !== mare[1] && !mare[2].split(' ').includes(id)) return s[0] + ' in ' + mare[0];
      if (s[1] === 4 && (!mare || mare[1] !== id)) return s[0] + ' nel mare sbagliato (' + z + ')';
      const t = ultima.get(K(p.name)) || 0;
      if (Date.now() - t < (C.secondiTraCatture || 0) * 1000) return 'catture troppo ravvicinate';
      return null;
    }
    api.onClient('preso', (p, d) => {
      const no = valida(p, d);
      if (no) { api.log('cattura scartata di ' + p.name + ': ' + no); return; }
      const id = d.id, s = SPECIE[id], kg = Math.round(+d.kg * 100) / 100, k = K(p.name), now = Date.now();
      ultima.set(k, now);
      if (id === 'stivale') return;   // uno stivale non è un pesce: niente record né chili in gara
      // statistiche dell'eroe
      const me = S.pes[k] = S.pes[k] || { nome: p.name, n: 0, kg: 0, leg: {} };
      me.nome = p.name; me.n++; me.kg = Math.round((me.kg + kg) * 100) / 100;
      if (!me.best || kg > me.best.kg) me.best = { id, kg };
      if (s[1] === 4) me.leg[id] = Math.max(me.leg[id] || 0, kg);
      // leggendario
      if (s[1] === 4 && C.annunciaLeggendari !== false) api.announce('🐉 ' + p.name + ' ha pescato ' + s[0] + ' (' + kgS(kg) + ')!');
      // record del server
      const r = S.rec[id];
      if (!r || kg > r.kg) {
        S.rec[id] = { kg, nome: p.name, t: now };
        const da = C.annunciaRecordDa == null ? 2 : +C.annunciaRecordDa;
        if (r && da >= 0 && s[1] >= da && s[1] < 4) api.announce('📏 Nuovo record del server: ' + s[0] + ' di ' + kgS(kg) + ', preso da ' + p.name + (r.nome !== p.name ? ' (prima: ' + r.nome + ', ' + kgS(r.kg) + ')' : '') + '!');
        else p.send('avviso', { testo: (r ? 'Nuovo record del server: ' : 'Primo ' + s[0] + ' dell\'albo: ') + s[0] + ' di ' + kgS(kg) + '!' });
      }
      // gara
      const g = S.gara;
      if (g && now < g.fine) {
        const t = g.tot[k] = g.tot[k] || { nome: p.name, kg: 0, n: 0 };
        t.nome = p.name; t.kg = Math.round((t.kg + kg) * 100) / 100; t.n++; t.t = now;
        if (!t.best || kg > t.best.kg) t.best = { id, kg };
        const L = classifica(), pos = L.indexOf(t) + 1;
        p.tell('Gara: +' + kgS(kg) + ' · totale ' + kgS(t.kg) + ' · sei ' + pos + '° di ' + L.length + ' · mancano ' + tempo(g.fine - now));
        if (L[0] === t && capo !== k) { capo = k; if (now - capoAnnunciato > 60000 && L.length > 1) { capoAnnunciato = now; api.announce('🎣 ' + p.name + ' passa in testa alla gara di pesca con ' + kgS(t.kg) + '!'); } }
      }
      api.save();
    });

    // ---------- comandi ----------
    function testoRecord() {
      const R = Object.keys(SPECIE).filter(id => id !== 'stivale' && S.rec[id]).map(id => SPECIE[id][0] + ' ' + kgS(S.rec[id].kg) + ' (' + S.rec[id].nome + ')');
      if (!R.length) return 'L\'albo dei record è ancora vuoto: pesca qualcosa!';
      const righe = []; let riga = '';
      for (const r of R) { if (riga && (riga + ' · ' + r).length > 190) { righe.push(riga); riga = r; } else riga = riga ? riga + ' · ' + r : r; }
      if (riga) righe.push(riga);
      return ('Albo dei record (' + R.length + ' specie su ' + (Object.keys(SPECIE).length - 1) + '):\n' + righe.join('\n')).split('\n').slice(0, 12).join('\n');
    }
    function testoGara(p) {
      const g = S.gara;
      if (!g) {
        const u = S.ultima, o = (C.orari || []).length ? ' Gare automatiche alle ' + C.orari.join(', ') + '.' : '';
        return 'Nessuna gara in corso.' + o + (u && u.podio.length ? '\nUltima gara: ' + u.podio.map((t, i) => (i + 1) + '° ' + t.nome + ' ' + kgS(t.kg)).join(' · ') : '');
      }
      const L = classifica(), io = L.findIndex(t => K(t.nome) === K(p.name));
      return 'Gara di pesca: mancano ' + tempo(g.fine - Date.now()) + '\n' +
        (L.length ? L.slice(0, 5).map((t, i) => (i + 1) + '° ' + t.nome + ' · ' + kgS(t.kg) + ' (' + t.n + (t.n === 1 ? ' pesce)' : ' pesci)')).join('\n') : 'Nessuno ha ancora preso niente.') +
        (io >= 5 ? '\n…\n' + (io + 1) + '° tu · ' + kgS(L[io].kg) : io < 0 && L.length ? '\nTu non hai ancora preso niente.' : '');
    }
    function testoIo(p) {
      const me = S.pes[K(p.name)];
      if (!me) return 'Non hai ancora pescato niente su questo server.';
      const rec = Object.keys(S.rec).filter(id => K(S.rec[id].nome) === K(p.name)).map(id => SPECIE[id] ? SPECIE[id][0] : id);
      const leg = Object.keys(me.leg).map(id => SPECIE[id][0] + ' ' + kgS(me.leg[id]));
      return p.name + ': ' + me.n + ' pesci, ' + kgS(me.kg) + ' in tutto' + (me.best ? ' · il più grosso: ' + SPECIE[me.best.id][0] + ' di ' + kgS(me.best.kg) : '') +
        '\nLeggendari: ' + (leg.length ? leg.join(', ') : 'nessuno') + ' (' + leg.length + '/5)' +
        (rec.length ? '\nRecord del server: ' + rec.join(', ') : '');
    }
    const puoOrganizzare = p => (C.organizzatori || []).map(K).includes(K(p.name));
    api.command('pesca', 'gara di pesca: /pesca record, /pesca gara, /pesca io', (p, args) => {
      const a = K(args[0]);
      if (a === 'record' || a === 'albo') return testoRecord();
      if (a === 'gara' || a === 'classifica') return testoGara(p);
      if (a === 'io' || a === 'me') return testoIo(p);
      if (a === 'via' || a === 'avvia') return puoOrganizzare(p) ? avvia(args[1], p.name) : 'Solo gli organizzatori possono avviare una gara.';
      if (a === 'stop' || a === 'ferma') return puoOrganizzare(p) ? chiudi(args[1] === 'annulla' ? 'decisione di ' + p.name : undefined) : 'Solo gli organizzatori possono fermare una gara.';
      return '🎣 Gara di pesca\n/pesca record — il pesce più grosso di ogni specie\n/pesca gara — la classifica della gara in corso\n/pesca io — i tuoi pesci e i tuoi leggendari' +
        (puoOrganizzare(p) ? '\n/pesca via [minuti] — avvia una gara · /pesca stop [annulla] — la chiude' : '') + '\n' + testoGara(p).split('\n')[0];
    });

    // ---------- pagine web ----------
    const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const dati = () => ({
      gara: S.gara ? { inizio: S.gara.inizio, fine: S.gara.fine, classifica: classifica().map(t => ({ nome: t.nome, kg: t.kg, n: t.n })) } : null,
      ultima: S.ultima || null,
      record: Object.keys(SPECIE).filter(id => id !== 'stivale').map(id => ({ id, nome: SPECIE[id][0], rarita: SPECIE[id][1], record: S.rec[id] || null })),
      pescatori: Object.values(S.pes).sort((a, b) => b.kg - a.kg).slice(0, 20).map(m => ({ nome: m.nome, n: m.n, kg: m.kg, leggendari: Object.keys(m.leg).length }))
    });
    // aspetto della Guida e dei menu di Voxelia: Georgia, oro con l'ombra ruggine, barra di legno, pannelli col bordo e l'ombra piena
    const ICONE = {
    'boat': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAADh0lEQVR4AdyZy2tTQRTGJ1lJXVhQbEEsVKFYKyq4cGPjG3GpUhQRlSK4KbjyARoU42ujf4C4EB9FUXAjdiEVreDChVW0KIrWqrEotXGhtSLmmm/ohJPJTO7c3Dt3Eku/zPuc87v3nDYwSWbxp7OjyaOy6IqbtgazLdXqzZnZwIS4N8sfVmAAYjlupfnIYe4cW+ft37SIQR0tjUqntiYjh0Ggz0dyDEKfqmvrdo+KrkXRtwKjCiy1uYe1tbUXpdoTdi4WmPkru8PGaXTeOkzvg3fsxPEjXCtSq4yCqnaTdRgE9j6bYxD6VLR+0Kdr1fRjgVEFRusHfdWeoHPOYIIGarI/VpgF7R28dmzVUKwweLqoHSGMqVA3VHTNpB87jC4o1A2Vbl+l+ZqBqRSk6ZpTmKhrKFIY5LvpUxT7RP2gFXOihT0qMa9rI4M5nM54yHmdo6DzsEVlcj4SGICYOLO9JzRM3vO8qP5vhKkhPKhQMMhnGEG+Q+iHFewIybbgj0perxoGqYWclg3aGsMXlcpPVTAAURlzPRcYhtYIamWk8PXeFkTQGgoEg3xF4CKn0WJsU/Ah5OfHGAaphZz1M+hy3QgGIC6DNPXtCxNnjZgGrdvnC4ODImfRYlwLunG9NyHHYQQjH3I9PplJl4EgJl+Yy1dvsoH7/UaCQVlBzvv5gW0dCNZ8YXbt6EqYauP6zrIn1nf+AIMunO5hpnZ0+1T2ASFUAkPvUqrtC8OqtlqbpueKMLiGEHcpYVoVBObC2DQ5Cx8cBiAY1LuS9D4Fdyph9fX7ZPGZzJ01nd/ThLWpOy/f//A3g7uUqFQkmepEZVdlZ8oFbx4OfUlwGD6q449rA8P8r2iy/9kov+US5DKTmHfVVooHawIE/eTZW0MJqtmN0zDP9XHsJ/s78Ys15P840dsP40yOJ/ttgkGPX4+x9JVB/kZ4sIUPozTL5iaZCxXi0/6iRuRFIxj5kOsxTS0aSxkMrSFsfPn5h5O3gkyAfzkeHQj2lsHQ+kFO7tuymJ3qXu5Ey9qbeX3oagQAVCUwrWt2erKwuRb+kn1q2sDk2ORxEWbp7jPejJaFTBZgXOvVvL1lcani5DAA0QVMczbuN4SYAILWRMk9jzxv9dGDTKf8uRfMlcYzT7RxId7mJWtLGPmbGR38zepRlGT43qX/47vZ04uH+DeB5Ju+24W3crcuhTcjQND/BwAA//8WVAo8AAAABklEQVQDAKYB/IX6e56eAAAAAElFTkSuQmCC',
    'crown': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAC8ElEQVR4AexXPWsVQRS92TLwOu3UyigqCDYWBiuR1/vxA/wHgqCNlY0WFhZiL6iNwUqID1GCWqXxoxCChUYQJQ9FiUST5mXPTWZyd3ZnZ+4m7NsNG96Znblz5uw9e2cYktAu+uvMNLWYXWW6ytTwBbptVsNHrvSKTGUunds3kqikKBZJLfTFVKUuNCRcEWvm9rUjo2NTPTJwidrxOPTYDF6sTbaMPy69ZLRyYXTl1kkCzp7aU5Zj1Nw49bgytDAkhpOu3J/oO9O5oeXUpOcmsGHGjaZjc3bMMw2V/rC1wPWRMCfh45l4SM/w5NNrRpJCfbw4xNHMV9XLmDl+uMdnB+cHiDlD8oxgDX1dsXnvtJ4V9nQyZphj9jueHNhqcCYk7Ay4Bja42TFxPDdDvge0eQ5cAw7ENXkznnVyv6PvoVUOY2ttVzfaTOUsIxbCSAQtSCk1U2XPB9/oEMrOnEMtHWKy1AwIfP949q/d40zUN3a90cdTL2NXhM1YaraD/Q1ko/EjrAXiV4SZlc2EpetnqMy4Z8i9V0Lpb3d9SF9lhsWwryU4qGjkWvQVS0NUvZmQ4hjn1WYGb4YkEcpdctHfab7UU5n5sLBM/WeHqP/6BGPyfo/owKTUy/TBnzk6T4MzG7izfC/I1+hnXpYOVGZSPv9+DpcI4EFE8/3tKgERVKZAG+CBoqlkRqFfK1Vt5vHiZ3qZVgaIyfTT7NO0Ks8ZMXytvtRUmcE9cXF+igxOv9pP8v8XKYw++HM3Zshg9vLdIN9o4xnSxzskVGZ4Ie4GCQ6WNJKLfgmVp8CR4GC+Wfu1lgvqzeQk6g/8//av8KXJ4NFi5t7AXdBUwIHPCOaS/sEe9af3tgJ/03sOSfvA2+zP+9/UBkgTD+eWJuQYfTaDTptw/cGXnBHknzwZ/KAXaWXaACTsM4K55PzNjxNtwfTVd4UVgRGgldsMiRehM1P0VZoQ6yrThCoU5dBVpuirNCHWVaYJVSjKoatM0VdpQmwdAAD//8gTlMMAAAAGSURBVAMAB6YblKgU7sIAAAAASUVORK5CYII=',
    'fish': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAACfklEQVR4AexWPS9tQRTdbvOal/deqfKikkh8NH4ACg2NiFIU/oAKlYRGovMLRKHRSriIUNCSiESi8FUgEUEoVJd1knOzzZkzc87MOGfcjGTFnLNn9l5r9tr33go10F8Q42szQ2dCZwq4gWCzAi7ZqITTzrT2jdVsYKSAHXImpnt8ofa3pZ1MwTgZL52IgRBjBg4PWouZOKzVemenyATNXf0OpRDlEiObB7C5PXonE+Ashyw/f8f3Ys1jWGcWAyvJ5gFJXUCWm78Ta4h8EM8kBgex2Rek8dGK0c3E6927scZ//zuUsyabKc5HjCvFwIdgqpoHxG2QJ7fIR6ybKgathGfFA2U9gwugqi8VAyFph26Ptj8/udKRdq6I9wkx3JP47uAz8XR1Qntzg3UsjbTQw/oivWwtRbhcnaHfzb+c8ZbNFOfDC2H9RYzoSfgZm3R4e30mQLfPJA4OHKocdTGwls6TqkQ+xCIxEJKVTLVapRg48/R4H3XluzqDGllRUc2ImAQerrYNUIzlP500undWx/DOCak8LeZz/Rx1JqsnUZzvla2xpyxEYsoq7rpu5Xxj/cv3husCRear7M8PNXG4/J4oUghqNZbNoKhRkOiMbzMk/hZUXXxCDJ8frMucIfwWfL45JeD6YI10fBJiVMrLjF3srjSp6iP+I8QcL08rhcRxrRhxhvJ4WHWTcUzMx5+xJyaKNcD54JnHtWLgUxVsZko2E7zW5mRPoiOquFYM1BcBeN62jhdiuFVsBFmL4R7mfs+yBnFXQpDLWgz3cN61bCZAKi/i/dZi4kQ+/A9ifOiCjEPojOxWfHgXOuNDF2QcQmdkt+LDu9AZH7og4/ABAAD//x/KqY8AAAAGSURBVAMAmdlNhSx3jRgAAAAASUVORK5CYII=',
    'hglass': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAES0lEQVR4Aexaz0tUURQ+U9DCEAIDA8VoESGKtggXQlGU4KIfKEIu3Ej+A6IWZEEbzcCW7goXDZYb3QkDBaJBWoRoikiLUAMVF0GGq+Ll9+TonfPufe/d9940IyR+c3+cc8+538z5uL7xHiOfn8tVpU4hQ27dSKb1yjmnrKSIChWSCMZaMiAC41GDh8zEkxtOT1M1FSKqKk75vr8eMvD+svqDChHYG2N6aSvFfW61ZNhYqO2bqW8eItirh8y7+Y2C/FRQKdiwiQhsHjLPx5dSKm6NLVJHnlDaM0Jbl9pdfD5ZR4/Tc9pPBEQADxlMSszvEOUDch9B41BkgoIUit2azPzbDOUScd4YKzJriwu0vrzo4sPYKD1tbkz1N76g/qbXkdB6vI9KZjtdbKY73HhniqPTsSKjpplMD6eutrU77tzKNlEUuIv3X4bHvh/G25/KekW+rAnNIBKZdG93qq1v0CmvrNKEtJ/qfrbsGw/5wkQNJJMZP9QIAiIwiKAPZEZWKfN++wCY84P0ZSK8RpePbUFtIBnognG/vjY16ThO78MuAmquNVB6666Lgclqauz4lKKKImPOhZUdWvz6y8XoxAbV3pn2xFtXNIl8xmAaQyAZzZqDM0e1oaYPNKQaDH1VI3yGqa6Ip47D9CORkYG59MJqiEvL5I94MkeYsTUZXU37aSiXGpEErcmwftCipoM0BB0xktaISgZ9azJYJGGqeWhIAmtN/rDFQSJk5AZQ8yg9aEJC+mIMf7RxEZtMkIbkBnX+0ifqODYZaIchNYSzSAXOpTjnSBDJ2GTUBNAHxqwJ2cLGwDkCfxVsi9omRoY1EmYj0Aj7s6bCrAvySYQMNsaJVE3I5x74MBH0k0ZsMvKcUTXBWuJWagoaSpJQLDKod2yGtYE+A5poby53JGA3+SOeCvjaIDIZlBbqXZcMpTT4oNKpOl9MEiZ/joeYgM4vaC4SGSTmwKpGMMdE0NdB56/G060JO2dNxk8j0ISz2+J0DdSRDg31p93nfTz345kf/jJe2I3r/KzIoJ4RxFTz0Afsxu8DXOPhC/ub4iGfisOV+l5oMigFUy1zaUEf+jTeWfgCXgsR4nE+5AR0fnIuFBkE5oW6mofY2W7b6uKp+WziBZKRNa2eI6h5qRFa2zXmr7lQnKWlpDUUSAY709U05rnmszQCgx/U79eEH8cz5RPunmEoMp5VexM3y2bcM2Svm8gv9APECRaJzMWfL+PkzNlaazKvOmey6t5PI0G71mkoaI3OznPWZNyFPnXv2m1eEowVjYzNZv+hrzUZ+d2y+r1Y3H5c3lZkKqpr6Oy9jznDidtTtLn3L8eopHzJ4N6MDMxnQK5amY/Hf+YmCPtRwTZujWRw5QT3Ztgxn+3vzJDnDo9uP1oyIMLO6t9O8pk+12PsAUTQhoGHjLw707I6RPnC9dlHWXd4/t+dCfOR5tPHdOXEU2ZH+e7MXwAAAP//WGtSdQAAAAZJREFUAwC/2qASLtNI5QAAAABJRU5ErkJggg==',
    'star': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAACv0lEQVR4AeyXv0okQRDGezc8MLvwuOw4jgPNDMwFM0F8AcE3UPAVFHwHM8HEUDDWzEwEESNFMDBUTFe+lpayp6b+7HQ7O+BCzfR291TVb6a/qelxqPjbWPs1kax06Gow+zv/Jv//zIU2Kw0Cf1VgAALnX23FYSav65Ot3cXA2fLSz6p8xWFitjdPIXAWB+sd6sDUy1f0/A0j3p4eB4s+GdQUDwvmU/Ncy80tBoPXMWoKF4Trw1xq3BxvXxEYgHgD15jfGSavK+H+tTXP+b9zn+pP6brzCYauX2s7Zk5rSuwQDsJca8y2eR8wWCp0DVvbQtquIWu8tnkIFmEAgj9Dt3G+5rlvKqlP0oh2c3INSXG4sVxz8cmw31F0bUttLWNtXPKtjRHfB8cPo3cY0jnE5vbe9Qh5j08P78Lp+dOHoXOWLc81gSDn8crmxYha+P0D/TNplzfP4er2JdrRyWNYWD2LTwTJwga7zKARAFAbJAxdWiLMrGlI0ggFQbvxZKh+0O5TQ5pGAECtAUMHZ6nNaSTPbxAwbRpxw3y1hjwaccNAN9RqasirETcMvQD7CPq/dhvxqGnxzJrBNgF7Cc1hqXHEombxa4IBiMVZ33NUmHy/02X/osHm+5t8v6Jdr8JEB3RfETsqHjrEssFUzL2k6+IwtE5w7ZLJ576KwuR1gtan1K5Zp0QYvONzeut/y7eU1Veah3yopf50boXB6xjv+TTRc7Z+S3l8Ihdq3LUsDEC4yVwf1QXGNZCa33oNGE9dyTWS78kBl1vSTjpLGrLWnRSjARMHpnjX19CINxceJnqxH7SlZffUbaYbxqsRLb2SGnLBTKMRDSZpJ50lDWm+XDDUWTWN0CBCm4s/FUzfGmmL34DJ13BpjQg3Ow51id+ASWuXO1vqSMyow4GLm/q0+A2YDnn0fuk3TO+PoCWBNwAAAP//Wn21ogAAAAZJREFUAwCQDnOFmHz6WgAAAABJRU5ErkJggg==',
    'trophy': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAD7ElEQVR4AexYW0tUURReZyiwgQHBMkQTwy6YMRF0gaSoKKaeostDUC9R/8AuD/bQQ1BB9AMi6CErevEphHkQhILACrKkQQRL0xyaUisbRclT34F13LNnz7kf52QKn3udvdZe+/vcZ7vXPjFaQj/LYqK6mP/vypw7UaeXE3ZvhOOVuX2lSW/emKBywU4I/I7EQAiCow5bMXr+lN56cxeVA4f3rHb19ysQc2Z/tS4C+8PI1p8jKgeMyRd+gY8IkStsU8z1sw16U12cGNt3Vxn7YyFVeS15rzbGV5hcwRnsDDEQggdGRe0qNiPZzoxOK3nF9O6DelvbFgIOJCup7e6Ogv1Bw3nlwMXoTG5OFHDBHmo9WmNwZb4iD2NlvvdOEmA6xP1hdpbJUHABV0BmZIiRO//V5yIx6UdDlH6eMyELE32wZX/Qz5iDYZe7SMyr7hwBD9qH6MiFlxrVx80cb/t/Uup8j4manfdI9JuBARmYr29gioAnnWO07dgzzSp1kRir4Kj7lsVEdYWWzMrgD1xSzMPuLxrqHQRFBVZ8wFcp5mr7Rw0lDtc8URDDtZiKC/iiP9aRzlLX3woAQAccEAJbhXQ6TQyVP4w+sRZT8eU5YydvvNcYLZffaHKtxoFoUSulUo+JkUzeobBrN7kWy3zKE9Dx4iuBL3gxlK8Z6h6AgwpasVaCXeAM5wFcADE79oj4DFspBo4oA1tBxa9IjPxO2tVqqqR++rgOQ4s8Mp9SQhBbJIb3D1q8k6jPRCx2LQYeDPAB6VIoElMqcLH773eMWBaVKj6RFHPxVsa1EIhzLUbeQ3i3RSCpFcRY2cY4r0Iw1rUYcf/ATm1IUKpljYHE+Jzl/Qb3EzkedycA9ye7+woIW8G1GFUynAGAyqfqQywg+lTnhuh3YgcixslEVjFW/26txsk+32Lkc0CeQH6W44MSgnl8i+EzAK3dOYAJP8zrBDzt/1FUW8HvB77FiJNb3TfEONiz47OEeBHo94PAxODa4PT+g5IesSL8iOCxgYiBEE5odQ4hBkLQhgHfYsT7D77/8pmjapObEuZ3YsTi23YQojiHLzF7m9fqSIQzwwswljGc0wj5RLDPaetZzOl96/XaqoWvnU4nVMX1DWuEXCJUcXZ9nsRACCcWzw18R3AD5IAQtEHAtZjOa4f0S8e3EqOhupG8omLlOjMP8jXXV/rS5FoMZns3NEFhALkZ2W9TbDpuPYlxnN1j4ODIpKeRrsV09Y6FsipYaSjwKgRjXYv5nZ+m+PxcKHidyYKTZ7gWg5lGJ2YoDCA3YyD7y/XV2ZMYnjCstmdwwrUQcHEtJvN5KpRVwUqDkFchGPsHAAD//6OKR+kAAAAGSURBVAMADSwTjYe5sjgAAAAASUVORK5CYII=',
    'users': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAEHElEQVR4AeyY2UtUURzHfzMPFUVlGC1UU0HYZloQRUHRRvkUFAVRtDwE/QEVURRFT20PBb0FlSXaAlYglkhRllb2IE2ZoZJLivtSLiQ93PxeOZcz554791zvMhoK3znbbzmfe37HO0yYEvi3YflMzYnstpowmH0bF2pzkieSquxAsJ4QGIAgudcKHCb/wjbt5K5UUtHySJIjXkcwTuobtuJO2NyXui5SkcwfMZjEdWUYlIZqfcNOTMT8xXnVMWLykvkpwWAjMmfVObf+qnlsYdzWuOjf2v1HdW80b/qkmLtld4fiwqA2kVmlvmEDW14yf35dpY+4THb2ljAoDdSoXQCrdfhCVut+zEthAOJHMsRkT1m1hY+qTDBe1jjeJfwd+dneR9cyr9O13BwlHTp4gGYkTVBlIRMMPPmnhrET8b7oS33Lo0QqkjoPTS5KWTzU4T6lMNz6iOyuXrtOui9bGDxdJxKz8L7imsr45ecm49sC7K1AsBYXxm2Nw7+xo5+g0sp2OpdVFkJSVaWlRGLu1s7de+O6xoUxPFXqGzaGg7nztrzFEYgRAXGZjEmiO0+KTPHUYLggw+k+KKoxJR5OHOZz4mq2NJ4JRqxRFkC1Ff1FkIKcQioojhqyiyvaWoEgjgmGfw+cvZ9JVN8CO2XNXpROUCclS+9IxrErIV4UmWkZO1pZT1+rG3Q9fPGB0nefkZ4IAkAmGEzGvAP0CecfsprePzeiiVKNPPCplux85TCqGSzsZKVwcWmqtmTyFBJlESJmuj8vquRngvGjpgESsztuIOYT7whAOPO4XRMMX8/ou61pbc8B7dya9WSlHSXdZKW0Z7Uxfpumz3AGw1sv3HJI48fx+q9/LSDYi4JPR1sreSHE4iXeIdPJMOOVRy5pUyPL2DBum9WWRrCVKa6ji0XZ3ZPCAITlsatpgDDbRLcmmKMlmrb5/CliKth+max0d9Vpw47Z8+2s9K2e8i0b/G/I3z3xDsXAoN6RvalsgLwQYnkt/u6JsQ0YlBZqXjQYTWMdBiB+bfpxXQ29GvxvxuRXHsQNi3ekt3kA854oaf4Kev+o2NDt/TcoeeIkT2LLgugnw98PmZGbOT9ji/vSYcTJ0ToegxmpJ/ffnExDb5/8R8CR+uSt9vW9s1tfCvxkxPcOe/8MpwUBA0E/cJhpfzVaEhrnid41NoGB2EfgMEgc7f1NXgixmIq6O0IJgWEb8KrNbmnQf7UJVz3PG/yGXBiIsPnCzjZPTgUni3gMBP1wT08qDVBGIKp+843uzcrQdWt8Cl2prw650ZkfFfqJAATSy6y38SMFISRk6qrKj9kIm3fT6jBuAgzHt7n0pucg2Ee4syI3kFPBySOhXyCIHa4tOB4KStVPD/tyIgCBElJmSOyHxmD8eKpexPwHAAD//4deGmQAAAAGSURBVAMAq5I2sn7s2iEAAAAASUVORK5CYII=',
    };
    const vi = (n, c) => '<i class="vi' + (c ? ' ' + c : '') + '" style="background-image:url(' + ICONE[n] + ')" aria-hidden="true"></i>';
    const STILE = '<style>' +
      ':root{--bg:#10131a;--pan:#1b2030;--pan2:#232a40;--btn:#2a3350;--btnh:#3b4770;--fg:#e8ecf4;--mu:#9aa4b8;--ac:#f5b942;--hi:#ffd27a;--lo:#c98a1a;--ember:#ff8a5a;' +
      '--title:#f5b942;--tshadow:#8a3b12;--frame:#8a6a3a;--drop:#2e1d10;--line:#f5b94230;--line2:#f5b94266;--wd3:#4a301b;--rowh:#f5b9420f;--good:#4cd07a;--bad:#e8484f;' +
      '--r0:#c8ccd4;--r1:#5ad65a;--r2:#4aa3ff;--r3:#b866ff;--r4:#ffae2b;--f:Georgia,\'Times New Roman\',serif;color-scheme:dark}' +
      ':root[data-theme=light]{--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--btn:#fff8e6;--btnh:#f6e7c2;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--lo:#b9832a;--title:#6a2a1a;--tshadow:#e0c48a;' +
      '--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--rowh:#8a5a0a12;--r0:#5a5e68;--r1:#2a8a2a;--r2:#1f6ab8;--r3:#7a2ec0;--r4:#a8560a;color-scheme:light}' +
      '@media(prefers-color-scheme:light){:root:not([data-theme=dark]):not([data-theme=light]){--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--btn:#fff8e6;--btnh:#f6e7c2;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--lo:#b9832a;--title:#6a2a1a;--tshadow:#e0c48a;' +
      '--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--rowh:#8a5a0a12;--r0:#5a5e68;--r1:#2a8a2a;--r2:#1f6ab8;--r3:#7a2ec0;--r4:#a8560a;color-scheme:light}}' +
      '*{box-sizing:border-box}body{margin:0;color:var(--fg);font:400 16px/1.55 var(--f);min-height:100vh;' +
      'background:radial-gradient(ellipse 90% 50% at 50% -10%,#24305466,transparent 70%),repeating-linear-gradient(26.565deg,transparent 0 46px,var(--line) 46px 47px),repeating-linear-gradient(-26.565deg,transparent 0 46px,var(--line) 46px 47px),var(--bg)}' +
      'a{color:var(--ac)}a:hover{color:var(--hi)}' +
      '.vi{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em;background:center/contain no-repeat;flex-shrink:0;filter:drop-shadow(0 1px 0 #0008)}' +
      '.brand{position:relative;display:flex;align-items:center;gap:10px;padding:12px 22px 13px;font:bold 1.16rem/1.1 var(--f);font-variant:small-caps;letter-spacing:.04em;color:#ffd27a;text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244;' +
      'background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f,inset 0 -2px 0 #2e1d1055,0 5px 0 #00000066}' +
      '.brand::before,.brand::after{content:\'\';position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}.brand::before{left:7px}.brand::after{right:7px}' +
      '.brand .vi{width:32px;height:32px}.brand small{display:block;font:italic 400 .72rem var(--f);font-variant:normal;letter-spacing:0;color:#f4e2b8;text-shadow:1px 1px 0 #0008;margin-top:3px}.brand .sp{flex:1}' +
      'main{max-width:960px;margin:0 auto;padding:22px 16px 60px}' +
      'h1{font:bold clamp(2rem,6vw,3.2rem)/1 var(--f);letter-spacing:.08em;text-transform:uppercase;color:#f5b942;text-shadow:3px 3px 0 #8a3b12;margin:.2em 0 .25em;text-align:center;text-wrap:balance}' +
      ':root[data-theme=light] h1{color:var(--title);text-shadow:3px 3px 0 var(--tshadow)}@media(prefers-color-scheme:light){:root:not([data-theme=dark]) h1{color:var(--title);text-shadow:3px 3px 0 var(--tshadow)}}' +
      '.sub{text-align:center;color:var(--mu);font-style:italic;margin:0 auto 14px;max-width:60ch}' +
      '.stats{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;list-style:none;margin:0 0 8px;padding:0}' +
      '.stats li{display:flex;align-items:baseline;gap:6px;color:var(--mu);font-size:.9rem;background:var(--pan);border:1px solid var(--line2);border-radius:4px;padding:.25em .7em;box-shadow:0 3px 0 var(--drop)}.stats b{font:bold 1.3rem var(--f);color:var(--hi);font-variant-numeric:tabular-nums}' +
      'h2{display:flex;align-items:center;gap:.4em;font:bold clamp(1.4rem,3.4vw,1.9rem)/1.1 var(--f);color:var(--title);text-shadow:2px 2px 0 var(--tshadow);margin:1.6em 0 .5em;padding-top:.7em;position:relative;flex-wrap:wrap}' +
      'h2::before{content:\'\';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--lo),var(--line2) 40%,transparent);border-radius:2px}' +
      'h2 small{font:italic 400 .95rem var(--f);color:var(--mu);text-shadow:none;margin-left:auto}' +
      '.m{color:var(--mu)}.note{color:var(--mu);font-size:.9rem;margin:.6em 0 0}' +
      '.card{background:var(--pan);border:2px solid var(--frame);border-radius:4px;box-shadow:0 5px 0 var(--drop),0 10px 20px #0005;padding:.8em 1em}' +
      '.callout{background:var(--pan2);border:3px solid var(--lo);border-radius:6px;box-shadow:0 0 0 3px var(--wd3),0 7px 0 3px var(--drop),0 16px 30px #0007;padding:.9em 1.15em;margin:18px 3px 8px}' +
      '.callout>b:first-child{display:block;color:var(--hi);font-size:1.05rem;margin-bottom:.4em}.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
      '.tw{overflow:auto;border:2px solid var(--frame);border-radius:4px;background:var(--pan);margin:.6em 0 1em;box-shadow:0 5px 0 var(--drop),0 10px 20px #0005}' +
      'table{border-collapse:collapse;width:100%;font-size:.93rem}' +
      'th{text-align:left;font:bold .7rem var(--f);text-transform:uppercase;letter-spacing:.1em;color:#ffd27a;text-shadow:1px 1px 0 #0008;padding:.75em .7em;white-space:nowrap;background:repeating-linear-gradient(180deg,#0000 0 13px,#00000022 13px 14px),linear-gradient(180deg,#86603b,#5e3f25);border-bottom:2px solid #3a2414}' +
      'td{padding:.5em .7em;border-bottom:1px solid var(--line);vertical-align:middle}tbody tr:nth-child(even){background:var(--rowh)}tbody tr:hover{background:var(--line)}tbody tr:last-child td{border-bottom:0}' +
      'td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}td.pos{font:bold 1.05rem var(--f);color:var(--ac);width:2.5em}' +
      '.r0{color:var(--r0)}.r1{color:var(--r1)}.r2{color:var(--r2)}.r3{color:var(--r3)}.r4{color:var(--r4);font-weight:700}' +
      '.tag{display:inline-block;font:bold .6rem var(--f);text-transform:uppercase;letter-spacing:.08em;border:1px solid #0005;border-radius:2px;box-shadow:0 2px 0 #0007;padding:.15em .5em;white-space:nowrap;color:#10131a}' +
      '.tag.r0{background:#c8ccd4}.tag.r1{background:#5ad65a}.tag.r2{background:#4aa3ff}.tag.r3{background:#b866ff}.tag.r4{background:linear-gradient(180deg,#ffd27a,#c98a1a);color:#2a1a06}' +
      '.podio{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:.6em 0 1em}.podio .card{display:flex;align-items:center;gap:.7em;border-left-width:6px}' +
      '.podio .card b{display:block;color:var(--hi);font-size:1.08rem}.podio .card span{color:var(--mu);font-size:.9rem}.podio .md{font-size:1.9rem;line-height:1}' +
      '.podio .p1{border-left-color:#f5b942}.podio .p2{border-left-color:#c8ccd4}.podio .p3{border-left-color:#c98a5a}' +
      '.gbtn{font:15px var(--f);color:#fff;background:#2a3350;border:1px solid #f5b94288;border-radius:3px;padding:.5em .95em;cursor:pointer;box-shadow:0 3px 0 #00000080;transition:transform .08s,box-shadow .08s,background .15s;display:inline-flex;align-items:center;gap:6px}' +
      '.gbtn:hover{background:#3b4770}.gbtn:active{transform:translateY(2px);box-shadow:0 1px 0 #00000080}' +
      '.gbtn.oro{background:linear-gradient(180deg,#ffd27a,#e0a634 55%,#c98a1a);border-color:#fff0c0;color:#2a1a06;font-weight:bold;text-shadow:0 1px 0 #fff5}.gbtn.oro:hover{background:linear-gradient(180deg,#ffe29a,#ebb444 55%,#d6982a)}' +
      '.gbtn.no{background:linear-gradient(180deg,#d8452c,#a8301c);border-color:#ffb0a0;color:#fff}.gbtn.no:hover{background:linear-gradient(180deg,#e8553c,#b8402c)}' +
      '.gbtn:disabled{opacity:.6;cursor:wait}button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--ac);outline-offset:2px}' +
      ':root[data-theme=light] .thm{background:var(--btn);color:var(--fg);border-color:var(--frame);box-shadow:0 3px 0 var(--drop)}@media(prefers-color-scheme:light){:root:not([data-theme=dark]) .thm{background:var(--btn);color:var(--fg);border-color:var(--frame);box-shadow:0 3px 0 var(--drop)}}' +
      'input{font:15px var(--f);width:5.5em;padding:.45em .6em;border-radius:3px;border:2px solid #3a2414;background:#f4ecd6;color:#2a2010;box-shadow:inset 0 2px 0 #0002,0 2px 0 #a37a4f66}input:focus{outline:none;border-color:var(--ac);box-shadow:0 0 0 2px #f5b94266}' +
      '.vuoto{padding:1em;text-align:center;color:var(--mu);font-style:italic}' +
      '@media(max-width:560px){body{font-size:15px}.brand{padding:10px 18px}.brand .thm span{display:none}td,th{padding:.45em .5em}.nm{display:none}}' +
      '</style>';
    // tema chiaro/scuro come nella Guida (automatico, poi scelto a mano e ricordato)
    const TEMA = '<script>(function(){var R=document.documentElement,m="auto";try{m=localStorage.getItem("voxelia_tema")||"auto"}catch(e){}if(m!=="auto")R.setAttribute("data-theme",m);' +
      'window.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("thm"),N={auto:"automatico",light:"chiaro",dark:"scuro"},O=["auto","light","dark"];if(!b)return;' +
      'var set=function(v){m=v;if(v==="auto")R.removeAttribute("data-theme");else R.setAttribute("data-theme",v);b.innerHTML="◐ <span>Tema: "+N[v]+"</span>";b.title="Tema: "+N[v];try{localStorage.setItem("voxelia_tema",v)}catch(e){}};' +
      'set(m);b.onclick=function(){set(O[(O.indexOf(m)+1)%3])}})})()</script>';
    function pagina(admin) {
      const D = dati(), g = D.gara, presi = D.record.filter(r => r.record).length, leg = D.record.filter(r => r.rarita === 4 && r.record).length;
      const ora = t => new Date(t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      const tabella = (testa, righe) => '<div class="tw"><table><thead><tr>' + testa + '</tr></thead><tbody>' + righe + '</tbody></table></div>';
      return '<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gara di pesca' + (admin ? ' · admin' : '') + '</title>' + STILE + TEMA + '</head><body>' +
        '<header class="brand">' + vi('fish') + '<div>Gara di pesca<small>Voxelia' + (admin ? ' · pannello admin' : ' · albo e classifiche') + '</small></div><span class="sp"></span><button class="gbtn thm" id="thm" type="button" aria-label="Cambia tema">◐</button></header><main>' +
        '<h1>Gara di pesca</h1><p class="sub">Il pesce più grosso di ogni specie, le gare a tempo e i leggendari dei cinque mari.</p>' +
        '<ul class="stats"><li><b>' + presi + '</b>/' + D.record.length + ' specie nell\'albo</li><li><b>' + leg + '</b>/5 leggendari</li><li><b>' + D.pescatori.length + '</b>' + (D.pescatori.length === 1 ? ' pescatore' : ' pescatori') + '</li>' +
          (g ? '<li><b id="manca" data-fine="' + g.fine + '">' + tempo(g.fine - Date.now()) + '</b> alla fine della gara</li>' : '') + '</ul>' +
        (admin ? '<div class="callout"><b>' + vi('trophy') + ' Gestione della gara</b>' + (g ? '<div class="row">Gara in corso, finisce alle ' + new Date(g.fine).toLocaleTimeString('it-IT') + '. <button class="gbtn oro" onclick="fai(\'stop\',this)">Chiudi e premia</button><button class="gbtn no" onclick="if(confirm(\'Annullare la gara senza premi?\'))fai(\'annulla\',this)">Annulla</button></div>'
          : '<div class="row">Nessuna gara in corso. <label>Durata <input id="min" type="number" min="1" max="600" value="' + (+C.durataMinuti || 30) + '"> minuti</label> <button class="gbtn oro" onclick="fai(\'via\',this)">Avvia gara</button></div>') +
          '<p class="note">Premi, orari automatici e organizzatori si cambiano in pesca.config.json (poi Plugin → Ricarica).</p></div>' +
          '<script>function fai(a,b){if(b)b.disabled=true;fetch("admin/"+a,{method:"POST",headers:{"x-voxelia":"1","Content-Type":"application/json"},body:JSON.stringify({min:+((document.getElementById("min")||{}).value||0)})}).then(r=>r.json()).then(j=>{if(j.err){alert(j.err);if(b)b.disabled=false}else location.reload()})}</script>' : '') +
        (g ? '<h2>' + vi('hglass') + 'Gara in corso <small>finisce alle ' + ora(g.fine) + '</small></h2>' +
          (g.classifica.length ? tabella('<th>#</th><th>Eroe</th><th class="n">Chili</th><th class="n">Pesci</th>', g.classifica.map((t, i) => '<tr><td class="pos">' + (i + 1) + '</td><td>' + e(t.nome) + '</td><td class="n">' + kgS(t.kg) + '</td><td class="n">' + t.n + '</td></tr>').join('')) : '<div class="card vuoto">Nessuno ha ancora preso niente.</div>')
          : D.ultima && D.ultima.podio.length ? '<h2>' + vi('trophy') + 'Ultima gara</h2><div class="podio">' + D.ultima.podio.map((t, i) => '<div class="card p' + (i + 1) + '"><span class="md">' + ['🥇', '🥈', '🥉'][i] + '</span><div><b>' + e(t.nome) + '</b><span>' + kgS(t.kg) + '</span></div></div>').join('') + '</div>' : '') +
        '<h2>' + vi('crown') + 'Albo dei record <small>' + presi + ' specie su ' + D.record.length + '</small></h2>' +
        tabella('<th>Specie</th><th>Rarità</th><th class="n">Record</th><th>Preso da</th><th class="nm">Quando</th>',
          D.record.sort((a, b) => b.rarita - a.rarita).map(r => '<tr><td class="r' + r.rarita + '">' + e(r.nome) + '</td><td><span class="tag r' + r.rarita + '">' + RARITA[r.rarita] + '</span></td>' +
            (r.record ? '<td class="n">' + kgS(r.record.kg) + '</td><td>' + e(r.record.nome) + '</td><td class="m nm">' + new Date(r.record.t).toLocaleDateString('it-IT') + '</td>' : '<td class="n m">—</td><td></td><td class="nm"></td>') + '</tr>').join('')) +
        (D.pescatori.length ? '<h2>' + vi('users') + 'Pescatori</h2>' + tabella('<th>#</th><th>Eroe</th><th class="n">Pesci</th><th class="n">Chili in tutto</th><th class="n">Leggendari</th>',
          D.pescatori.map((m, i) => '<tr><td class="pos">' + (i + 1) + '</td><td>' + e(m.nome) + '</td><td class="n">' + m.n + '</td><td class="n">' + kgS(m.kg) + '</td><td class="n' + (m.leggendari ? ' r4' : '') + '">' + m.leggendari + '/5</td></tr>').join('')) : '') +
        '</main>' + (g ? '<script>(function(){var x=document.getElementById("manca");if(!x)return;var f=+x.dataset.fine;setInterval(function(){var m=Math.max(0,Math.ceil((f-Date.now())/60000));x.textContent=m>=60?Math.floor(m/60)+" h "+(m%60)+" min":m+" min"},15000)})()</script>' : '') +
        '</body></html>';
    }
    api.route('GET', '/', (req, res, x) => x.send(pagina(false)));
    api.route('GET', 'dati', (req, res, x) => x.json(dati()));
    api.route('GET', 'admin', (req, res, x) => x.send(pagina(true)), { admin: true });
    api.route('POST', 'admin/*', (req, res, x) => x.body(j => {
      if (x.path === '/admin/via') { if (S.gara) return x.json(409, { err: 'C\'è già una gara in corso' }); avvia(j.min, 'il pannello admin'); return x.json({ ok: 1 }); }
      if (x.path === '/admin/stop' || x.path === '/admin/annulla') { if (!S.gara) return x.json(409, { err: 'Nessuna gara in corso' }); chiudi(x.path === '/admin/annulla' ? 'decisione dell\'admin' : undefined); return x.json({ ok: 1 }); }
      x.json(404, { err: 'Azione sconosciuta' });
    }), { admin: true });

    // ---------- codice nel gioco ----------
    api.client('(' + nelGioco.toString() + ')(' + JSON.stringify(api.id) + ');');

    // una gara rimasta aperta da prima di un riavvio
    api.on('start', () => { if (S.gara && Date.now() >= S.gara.fine) chiudi(); });
  }
};
