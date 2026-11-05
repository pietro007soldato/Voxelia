// Boss del mondo: a intervalli un boss enorme compare in una zona selvaggia di ogni stanza, annunciato a tutti.
// La sua vita sta sul server: il gioco di ogni eroe manda i danni che fa, il server li somma e rimanda la vita a tutti,
// e quando il boss cade premia chi l'ha colpito in base al contributo (/boss per lo stato, /boss classifica).
//
// Come nasce il boss nel gioco (verificato sulla 7.8): il gioco non ha una funzione pubblica per creare un nemico, ma tutti
// i nemici nascono da mk(tipo, x, y, id) e finiscono in ents (le dimensioni temporali fanno lo stesso con dimSpawn).
// Il plugin usa mk() con il tipo di un boss esistente (aspetto, attacchi di bossAI e minimappa restano quelli del gioco),
// poi cambia nome, misura e forza e lo segna con wb=1. Ogni colpo dell'eroe passa da hurtE(): per il boss del mondo il plugin
// lo intercetta, mostra il colpo e lo manda al server invece di togliere vita da solo; il boss non passa mai da kill(),
// quindi niente missioni completate per sbaglio, niente bottino doppio e niente dungeonClear. Gli altri nemici non cambiano.
// Ogni gioco muove la sua copia del boss: conta solo la vita, che è quella del server. Per questo dalla 7.41 il boss e i suoi
// evocati restano fuori dai nemici che il gioco condivide in rete (syncPack, syncEH).
//
// Limiti: i danni arrivano dal gioco del giocatore; il server ne accetta al massimo dannoMaxSec al secondo per eroe,
// così chi usa i trucchi non lo abbatte in un colpo, ma può comunque arrivare a quel tetto. Il server non può togliere
// niente (p.give solo in positivo), quindi il boss non fa perdere oro a nessuno.

// zone selvagge aperte a tutti dall'inizio, con i nemici (verificate sulla 7.8)
const ZONE = { forest: 'Foresta di Elmwood', desert: 'Deserto di Khem', peaks: 'Picchi Gelidi' };
// boss del gioco che si possono usare come base (aspetto e attacchi)
const BASI = ['troll', 'faraone', 'drago_brina', 're_goblin', 'necromante', 'sfinge', 'regina', 'ignis', 'leviatano', 'lich'];
const MIN = 60000;

// codice nel gioco: crea il boss quando sei nella sua zona, manda i tuoi colpi al server e mostra la barra della vita
function nelGioco(ID) {
  const opz = f => { try { return f(); } catch (e) { return undefined; } };
  const USA = { mk: () => mk, ents: () => ents, E: () => E, hurtE: () => hurtE, bfs: () => bfs, WK: () => WK, flt: () => flt, scl: () => scl, msg: () => msg, banner: () => banner };
  const mancanti = Object.keys(USA).filter(k => { try { return USA[k]() === undefined; } catch (e) { return true; } });
  if (mancanti.length) {
    console.warn('[plugin ' + ID + '] mancano: ' + mancanti.join(', '));
    VXP.on(ID, 'stato', () => { opz(() => msg('Il boss del mondo non funziona con questa versione del gioco: avvisa l\'admin del server.')); VXP.send(ID, 'rotto', mancanti); });
    return;
  }
  const EID = 990001;            // id fisso, lontano da quelli del gioco (zone da 0, dimensioni 30000+, evocati 20000+)
  let B = null;                  // il boss attivo nella mia stanza: { k, zk, nome, base, scala, forza, max, hp, fine }
  let pend = 0;                  // danni (in vite) non ancora mandati al server
  const boss = () => opz(() => ents.find(e => e.wb)) || null;
  const qui = () => B && opz(() => Zk) === B.zk && opz(() => started) && opz(() => MODE) === 'story';

  // la casella libera più vicina al centro della mappa tra quelle che l'eroe può raggiungere (stessa mappa → stesso posto)
  function posto() {
    const sx = P.px | 0, sy = P.py | 0, d = bfs(sx, sy), c = N / 2;
    let best = null, bd = Infinity;
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const v = d[y * N + x]; if (v < 0 || !WK(M[y][x]) || v < 6) continue;
      const s = Math.hypot(x - c, y - c); if (s < bd) { bd = s; best = [x, y]; }
    }
    return best || [sx, sy];
  }
  function evoca() {
    if (!qui() || boss()) return;
    const base = E[B.base] ? B.base : 'troll';
    const [x, y] = posto();
    const e = mk(base, x, y, EID);
    e.wb = 1; e.wk = B.k; e.n = B.nome; e.vb = e.mx;                 // vb: una «vita» del boss, come la farebbe il gioco per questa zona
    e.mx = Math.max(1, Math.round(e.vb * B.max)); e.hp = Math.max(1, Math.round(e.vb * B.hp));
    e.at *= B.forza; e.xp = 0;
    if (B.scala !== 1 && e.m) { const m2 = scl(e.m, B.scala); for (const q of Object.keys(e.m)) if (isNaN(q)) m2[q] = e.m[q]; e.m = m2; e.r = (e.r || 1) * Math.min(1.5, B.scala); }
    ents.push(e);
    opz(() => msg('⚔ ' + B.nome + ' è qui!'));
  }
  function via(festa) {
    const e = boss(); if (!e) return;
    const i = ents.indexOf(e); if (i >= 0) ents.splice(i, 1);
    if (festa) {
      opz(() => { if (cineOK() && e.m) ents.push({ k: 'dead', m: e.m, px: e.px, py: e.py, t0: t, boss: 1, fc: e.m.rg ? faceOf(...(e.fd || [0, 1])) : null }); });
      opz(() => jingle([60, 64, 67, 72, 76, 79], .11));
      opz(() => { if (cineOK()) { flash('#fff', .5, 800); burst(e.px, e.py, 50, ['#ffffff', '#ffd84a', '#ff6a2a'], { v: 2, up: 240, gr: 300, d: 1.8, s: 5 }); pillar(e.px, e.py, '255,216,74', 1.6, 80); } });
    } else opz(() => { if (cineOK()) sparks(e.px, e.py, 30, ['#c8b8d8', '#ffffff'], 80); });
  }

  // i colpi dell'eroe al boss del mondo vanno al server; gli altri nemici restano al gioco
  const hurt0 = hurtE;
  hurtE = function (e, d, rem, cr) {
    if (!e || !e.wb) return hurt0.apply(this, arguments);
    // rem=1 qui sono solo i danni nel tempo dei tuoi colpi (bruciature, veleno): i colpi degli altri eroi arrivano dal server,
    // perché per il boss del mondo il gioco non li mette nei messaggi di presenza (NET.hits)
    if (e.shd && e.shd > t) { flt(e, 'Immune', '#9adcff'); return; }
    if (!rem) { opz(() => wmHit()); const d2 = opz(() => tryParry(e, d, rem)); if (typeof d2 === 'number') d = d2; }
    if (!(d > 0)) return;
    // 7.44: i boss hanno il punto debole (colpi doppi, quattro colpi lo stordiscono) e, storditi, prendono una volta e mezzo i danni.
    // Il colpo al boss del mondo non passa dal gioco, quindi qui si fa lo stesso conto (con i nomi del gioco, se ci sono)
    opz(() => {
      if (b43Open(e)) { d = Math.round(d * 2); e.stg = (e.stg || 0) + 1; if (e.stg >= 4) { e.wkO = 0; e.stn = t + 3; e.stg = 0; flt(e, 'STORDITO!', '#ffd84a'); tone(200, .4, 'square', .06); shake(.6); } }
      else if (b43Stun(e)) d = Math.round(d * 1.5);
    });
    e.hp = Math.max(1, e.hp - d); e.fl = .12; e.al = 1;
    flt(e, (cr ? '💥' : '') + d, cr ? '#ffd84a' : '#ffffff'); opz(() => tone(cr ? 330 : 220, .05));
    pend += d / (e.vb || 1);
  };

  // 7.41: in rete ogni nemico ha un padrone e gli altri ne vedono la copia (syncPack, syncEH). Il boss del mondo ce l'ha
  // già ogni eroe, quindi lui e i suoi evocati restano fuori: senza, ognuno vedeva anche il boss degli altri (due o più boss),
  // i colpi alla copia finivano nel contributo del suo padrone e i colpi del boss arrivavano due volte
  const mio = e => e && (e.wb || e.wbs || (e.id >= 10000 + EID * 10 && e.id < 10000 + EID * 10 + 10));
  // 7.44: in terza fase il boss richiama due rinforzi (b43Tick, dentro bossAI): anche quelli sono del boss del mondo
  if (typeof b43Tick === 'function') {
    const tick0 = b43Tick;
    b43Tick = function () {
      const b = boss(), n0 = opz(() => ents.length) || 0, r = tick0.apply(this, arguments);
      if (b) opz(() => { for (let i = n0; i < ents.length; i++) if (ents[i] && ents[i].k === 'en' && !ents[i].pup && dist(ents[i], b) < 4) ents[i].wbs = 1; });
      return r;
    };
  }
  if (typeof syncPack === 'function') {
    const pack0 = syncPack;
    syncPack = function () {
      const r = pack0.apply(this, arguments);
      if (r && Array.isArray(r.es)) { const via = new Set(opz(() => ents.filter(mio).map(e => e.sg)) || []); if (via.size) r.es = r.es.filter(x => !via.has(x[0])); }
      return r;
    };
  }
  if (typeof syncEH === 'function') {
    const eh0 = syncEH;
    syncEH = function (pid, at) {
      // il colpo parte da un nemico in questo fotogramma (atkT) o dallo schianto del boss (1,5 volte l'attacco)
      if (opz(() => ents.some(e => mio(e) && ((e.atkT === t && Math.abs(at - e.at) < .01) || (e.wb && Math.abs(at - e.at * 1.5) < .01))))) return;
      return eh0.apply(this, arguments);
    };
  }

  // barra della vita in alto, solo nella zona del boss
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;left:50%;top:54px;transform:translateX(-50%);width:min(420px,70vw);z-index:40;pointer-events:none;display:none;' +
    'font:600 13px system-ui,sans-serif;color:#fff;text-shadow:0 1px 2px #000;text-align:center';
  bar.innerHTML = '<div class=n></div><div style="height:10px;margin-top:3px;background:#0009;border:1px solid #ffd84a88;border-radius:5px;overflow:hidden"><div class=v style="height:100%;width:100%;background:linear-gradient(90deg,#c0392b,#ff8a3a);transition:width .3s"></div></div>';
  document.body.appendChild(bar);
  // sui telefoni la barra al centro finirebbe sopra l'HUD e la minimappa (comandi touch della 7.9): se non c'è spazio
  // va sotto l'HUD in alto a sinistra, come la scheda della Discoteca, e il riquadro dei Gruppi si mette sotto
  let pos = '';
  function posizionaBarra() {
    const h = document.getElementById('hud'), r = h && h.getBoundingClientRect();
    const larga = Math.min(420, innerWidth * .7), sotto = !!(r && r.height && r.right + 8 > (innerWidth - larga) / 2);
    const p = sotto ? [Math.round(r.bottom + 8), Math.max(8, Math.round(r.left)), Math.min(240, Math.max(180, Math.round(r.width + 25)))].join() : 'centro';
    if (p === pos) return; pos = p;
    if (!sotto) { Object.assign(bar.style, { left: '50%', top: '54px', transform: 'translateX(-50%)', width: 'min(420px,70vw)', textAlign: 'center' }); return; }
    const [top, left, larg] = p.split(',');
    Object.assign(bar.style, { left: left + 'px', top: top + 'px', transform: 'none', width: 'min(' + larg + 'px,calc(100vw - 32px))', textAlign: 'left' });
  }
  function disegna() {
    const e = boss();
    if (!qui() || !e) { bar.style.display = 'none'; return; }
    const f = Math.max(0, Math.min(1, e.hp / e.mx));
    bar.style.display = 'block'; posizionaBarra();
    bar.querySelector('.n').textContent = '⚔ ' + B.nome + ' · ' + Math.ceil(f * 100) + '%';
    bar.querySelector('.v').style.width = (f * 100) + '%';
  }

  VXP.on(ID, 'stato', d => {
    if (!d || !d.k) return;
    if (B && B.k !== d.k) via(false);
    B = d; evoca(); disegna();
  });
  VXP.on(ID, 'vita', d => {
    if (!B || !d || d.k !== B.k) return;
    B.hp = d.hp; if (d.max > 0) B.max = d.max;
    const e = boss();
    if (e) { const mx = Math.max(1, Math.round(B.max * e.vb)), hp = Math.round(d.hp * e.vb); e.hp = Math.max(1, hp - Math.round(pend * e.vb)); e.mx = mx; }
    disegna();
  });
  VXP.on(ID, 'fine', d => {
    if (!B || !d || d.k !== B.k) return;
    const c = qui(); via(!!d.vinto); B = null; pend = 0; disegna();
    // chi era nella zona del boss o ha dato colpi vede il suo risultato; gli altri sanno che il boss è caduto
    if (d.vinto) opz(() => VXAnnuncio(c || d.tuo ? 'Boss sconfitto!' : 'Boss del mondo sconfitto', d.tuo || (d.nome + ' è caduto'), 'corona', !(c || d.tuo)));
  });
  setInterval(() => {
    if (pend > 0 && B) { VXP.send(ID, 'colpo', { k: B.k, v: +pend.toFixed(4) }); pend = 0; }
    if (qui()) evoca();
    else if (boss()) via(false);
    disegna();
  }, 300);
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
  name: 'Boss del mondo',
  version: '1.5',
  author: 'Voxelia',
  description: 'Un boss enorme compare in una zona selvaggia: si affronta tutti insieme e il premio va in base al contributo (/boss)',
  defaults: {
    ogniMin: 60,            // minuti tra la fine di un boss e l'arrivo del successivo
    primaMin: 10,           // minuti dall'avvio del server al primo boss
    durataMin: 15,          // se nessuno lo sconfigge entro questi minuti, il boss se ne va
    minGiocatori: 1,        // il boss compare solo nelle stanze con almeno questi eroi online
    vite: 6,                // quanto è resistente con un solo eroe nella stanza, in «vite» (1 vita = il boss come lo farebbe il gioco in quella zona)
    vitePerEroe: 3,         // vite in più per ogni altro eroe: quelli online nella stanza quando compare, più chi arriva dopo e lo colpisce
    dannoMaxSec: 0.1,       // danni massimi accettati per eroe, in vite al secondo (contro i trucchi: 0.1 = almeno 10 secondi per vita)...
    dannoMaxLivello: 0.01,  // ...più questo per ogni livello dell'eroe (al livello 20: 0.3 vite al secondo)
    quotaMin: 0.03,         // parte minima dei danni totali per avere il premio (0.03 = 3%)
    premio: { oro: 1200, xp: 900 },   // premio pieno: ognuno riceve il 40% più il 60% in proporzione ai suoi danni
    // a chi fa più danni un oggetto epico (3), a chi fa almeno il 15% uno raro (2), agli altri uno non comune (1); -1 = nessuno
    oggetti: { primo: 3, bravi: 2, altri: 1 },
    // un boss per zona: nome, boss del gioco da cui prende aspetto e attacchi, misura e forza dei colpi
    boss: [
      { zona: 'forest', nome: 'Vecchio Tronco, il Troll Millenario', base: 'troll', scala: 1.6, forza: 1.2 },
      { zona: 'desert', nome: 'Sfinge delle Sabbie Rosse', base: 'sfinge', scala: 1.4, forza: 1.15 },
      { zona: 'peaks', nome: 'Vermigelo, il Drago Antico', base: 'drago_brina', scala: 1.4, forza: 1.1 }
    ]
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, ID = api.id, S = api.store;
    if (!S.eroi || typeof S.eroi !== 'object') S.eroi = {};       // nome in minuscolo → { nome, vittorie, primi, danni }
    if (!Array.isArray(S.storico)) S.storico = [];                // ultimi boss: { quando, nome, zona, stanza, vinto, top: [nomi] }
    const ATT = new Map();                                        // stanza → boss attivo
    const ascolta = [];                                           // funzioni di altri plugin (globalThis.VoxeliaBoss.onSconfitto)

    const num = (v, d, a, b) => { const n = +v; return isFinite(n) ? Math.max(a, Math.min(b, n)) : d; };
    const finto = p => !!(globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p));
    const lista = (Array.isArray(C.boss) ? C.boss : []).filter((b, i) => {
      const err = !b || typeof b !== 'object' ? 'non è un oggetto' : !ZONE[b.zona] ? 'zona "' + b.zona + '" non valida (si può usare: ' + Object.keys(ZONE).join(', ') + ')'
        : !BASI.includes(b.base) ? 'base "' + b.base + '" non valida (si può usare: ' + BASI.join(', ') + ')' : '';
      if (err) api.log('boss ' + (i + 1) + ' ignorato: ' + err);
      return !err;
    });
    if (!lista.length) api.log('nessun boss valido in boss.config.json: non comparirà nessun boss');
    if (!(S.prossima > 0)) { S.prossima = Date.now() + num(C.primaMin, 10, 0, 1440) * MIN; api.save(); }

    const vista = A => ({ k: A.k, zk: A.zk, nome: A.nome, base: A.base, scala: A.scala, forza: A.forza, max: +A.max.toFixed(3), hp: +Math.max(0, A.hp).toFixed(3), fine: A.fine });
    const pct = A => Math.max(0, Math.ceil(A.hp / A.max * 100));
    const minuti = ms => Math.max(1, Math.ceil(ms / MIN));
    const classifica = A => [...A.danni.values()].sort((a, b) => b.v - a.v);

    function evoca(room, scelta, chi) {
      if (ATT.has(room)) return 'In questa stanza c\'è già un boss.';
      const b = scelta || lista[Math.floor(Math.random() * lista.length)];
      if (!b) return 'Nessun boss valido nel config.';
      const n = api.players(room).filter(p => !finto(p)).length;
      const ora = Date.now();
      const A = {
        k: ID + ':' + room + ':' + ora, room, zk: b.zona, nome: String(b.nome || 'Boss del mondo').slice(0, 40), base: b.base,
        scala: num(b.scala, 1.4, .5, 2.5), forza: num(b.forza, 1, .2, 5),
        max: num(C.vite, 6, .2, 100) + num(C.vitePerEroe, 3, 0, 50) * Math.max(0, n - 1),
        contati: Math.max(1, n), inizio: ora, fine: ora + num(C.durataMin, 15, 1, 600) * MIN, danni: new Map(), cambiata: false, avvisi: {}
      };
      A.hp = A.max;
      ATT.set(room, A);
      api.broadcast('stato', vista(A), room);
      api.announce('🐉 ' + A.nome + ' è apparso: ' + ZONE[A.zk] + '! Affrontatelo insieme entro ' + minuti(A.fine - ora) + ' min (/boss)', room);
      schermo('Boss del mondo!', A.nome + ' è apparso: ' + ZONE[A.zk] + ' · /boss', 'teschio', room, 1);
      api.log('boss evocato nella stanza ' + room + ': ' + A.nome + ' (' + A.zk + ', ' + A.max.toFixed(1) + ' vite)' + (chi ? ' da ' + chi : ''));
      return '';
    }
    function chiudi(A, vinto) {
      ATT.delete(A.room);
      const top = classifica(A), tot = top.reduce((a, x) => a + x.v, 0) || 1;
      const premiati = [];
      if (vinto) {
        const P0 = C.premio && typeof C.premio === 'object' ? C.premio : {}, O = C.oggetti && typeof C.oggetti === 'object' ? C.oggetti : {};
        const oro = num(P0.oro, 0, 0, 1e6), xp = num(P0.xp, 0, 0, 1e6), qmin = num(C.quotaMin, .03, 0, 1);
        top.forEach((x, i) => {
          const q = x.v / tot; if (q < qmin) return;
          const r = Math.round(num(i === 0 ? O.primo : q >= .15 ? O.bravi : O.altri, -1, -1, 3));
          const g = Math.round(oro * (.4 + .6 * q)), e = Math.round(xp * (.4 + .6 * q));
          premiati.push({ id: x.id, nome: x.nome, q, testo: [g > 0 && g + ' oro', e > 0 && e + ' XP', r >= 0 && 'un oggetto ' + ['comune', 'non comune', 'raro', 'epico'][r]].filter(Boolean).join(', ') });
          const p = api.player(x.id) || api.player(x.nome);
          if (!p || p.room !== A.room) return;               // uscito prima della fine: niente premio
          try { if (g > 0) p.give('gold', g); if (e > 0) p.give('xp', e); if (r >= 0) p.give('item', 1, r); }
          catch (err) { api.log('premio non consegnato a ' + p.name + ': ' + (err && err.message || err)); }
          if (finto(p)) return;
          const k = x.nome.toLowerCase(), s = S.eroi[k] || (S.eroi[k] = { nome: x.nome, vittorie: 0, primi: 0, danni: 0 });
          s.nome = x.nome; s.vittorie++; s.danni = +(s.danni + x.v).toFixed(3); if (i === 0) s.primi++;
        });
      }
      S.storico.unshift({ quando: Date.now(), nome: A.nome, zona: A.zk, stanza: A.room, vinto: !!vinto, top: top.slice(0, 3).map(x => x.nome) });
      S.storico = S.storico.slice(0, 30);
      if (!ATT.size) S.prossima = Date.now() + num(C.ogniMin, 60, .2, 1440) * MIN;
      api.save();
      for (const o of api.players(A.room)) {
        const me = premiati.find(x => x.id === o.id);
        o.send('fine', { k: A.k, vinto: !!vinto, nome: A.nome, tuo: me ? 'Il tuo contributo: ' + Math.round(me.q * 100) + '% · ' + me.testo : '' });
      }
      if (vinto) {
        api.announce('🏆 ' + A.nome + ' è stato sconfitto! ' + (top.length ? 'I più valorosi: ' + top.slice(0, 3).map(x => x.nome + ' ' + Math.round(x.v / tot * 100) + '%').join(', ') : ''), A.room);
        const info = { nome: A.nome, zona: A.zk, stanza: A.room, eroi: top.map(x => ({ id: x.id, nome: x.nome, quota: x.v / tot })) };
        for (const fn of ascolta) try { fn(info); } catch (e) { api.log('errore in un ascoltatore di VoxeliaBoss: ' + (e && e.message || e)); }
      } else api.announce(A.nome + ' se n\'è andato senza essere sconfitto (vita rimasta ' + pct(A) + '%).', A.room);
      api.log('boss ' + (vinto ? 'sconfitto' : 'andato via') + ' nella stanza ' + A.room + ': ' + A.nome + (top.length ? ' · ' + top.map(x => x.nome + ' ' + x.v.toFixed(2)).join(', ') : ''));
    }

    // i colpi dal gioco: solo dalla stanza e dalla zona del boss, con un tetto al secondo per eroe
    api.onClient('colpo', (p, d) => {
      const A = ATT.get(p.room);
      if (!A || !d || d.k !== A.k || p.zone !== A.zk || !(A.hp > 0)) return;
      let v = +d.v; if (!isFinite(v) || v <= 0) return;
      const ora = Date.now(), cap = num(C.dannoMaxSec, .1, .001, 10) + num(C.dannoMaxLivello, .01, 0, 1) * Math.max(0, p.lv);
      const x = A.danni.get(p.id) || { id: p.id, nome: p.name, v: 0, tok: cap * 2, t: ora, scarti: 0 };
      if (!A.danni.has(p.id)) {
        A.danni.set(p.id, x);
        // un eroe in più rispetto a quelli contati quando è apparso: il boss diventa più resistente
        if (!finto(p) && A.danni.size > A.contati) { const per = num(C.vitePerEroe, 3, 0, 50); A.max += per; A.hp += per; A.contati++; }
      }
      x.tok = Math.min(cap * 2, x.tok + cap * (ora - x.t) / 1000); x.t = ora;
      if (v > x.tok) { x.scarti += v - x.tok; v = x.tok; }
      if (v <= 0) return;
      x.tok -= v; x.v += v; A.hp -= v; A.cambiata = true;
      if (A.hp <= 1e-6) chiudi(A, true);
    });
    api.onClient('rotto', (p, d) => api.log('il gioco di ' + p.name + ' non ha: ' + (Array.isArray(d) ? d.join(', ') : d)));

    api.every(500, () => {
      const ora = Date.now();
      for (const A of [...ATT.values()]) {
        if (ora >= A.fine) { chiudi(A, false); continue; }
        if (A.cambiata) { A.cambiata = false; api.broadcast('vita', { k: A.k, hp: +Math.max(0, A.hp).toFixed(3), max: +A.max.toFixed(3) }, A.room); }
        const resta = A.fine - ora;
        if (resta < 2 * MIN && A.fine - A.inizio > 5 * MIN && !A.avvisi.fine) { A.avvisi.fine = 1; api.announce('⏳ ' + A.nome + ' se ne va tra 2 minuti! Vita rimasta ' + pct(A) + '%', A.room); schermo(A.nome + ' se ne va tra 2 minuti', 'Vita rimasta ' + pct(A) + '% · ' + ZONE[A.zk], 'teschio', A.room, 1); }
        if (A.hp <= A.max / 2 && !A.avvisi.meta) { A.avvisi.meta = 1; api.announce('⚔ ' + A.nome + ' è a metà vita! (' + ZONE[A.zk] + ')', A.room); schermo(A.nome + ' è a metà vita!', ZONE[A.zk] + ': ancora un ultimo sforzo', 'spade', A.room, 1); }
      }
      if (ATT.size || ora < S.prossima || !lista.length) return;
      const min = num(C.minGiocatori, 1, 1, 100), stanze = api.rooms();
      for (const room of Object.keys(stanze)) if (api.players(room).filter(p => !finto(p)).length >= min) evoca(room);
    });

    api.client('(' + nelGioco.toString() + ')(' + JSON.stringify(ID) + ');');

    // chi entra in una stanza col boss lo riceve (e lo vede appena va nella sua zona)
    api.on('join', p => api.after(2500, () => { const o = api.player(p.id), A = o && ATT.get(o.room); if (A) { o.send('stato', vista(A)); o.tell(stato(o)); } }));
    api.on('zone', (p, z) => { const A = ATT.get(p.room); if (A && z === A.zk) p.send('stato', vista(A)); });

    function stato(p) {
      const A = ATT.get(p.room);
      if (!A) {
        const m = Math.ceil((S.prossima - Date.now()) / MIN);
        return 'Nessun boss del mondo in questo momento. ' + (ATT.size ? 'Ce n\'è uno in un\'altra stanza.' : m > 0 ? 'Il prossimo arriva tra circa ' + m + ' min.' : 'Il prossimo arriva appena ci sono abbastanza eroi online.');
      }
      const top = classifica(A), tot = top.reduce((a, x) => a + x.v, 0) || 1, mio = A.danni.get(p.id);
      return '🐉 ' + A.nome + ' · ' + ZONE[A.zk] + ' · vita ' + pct(A) + '% · se ne va tra ' + minuti(A.fine - Date.now()) + ' min' +
        (top.length ? '\nI più valorosi: ' + top.slice(0, 3).map(x => x.nome + ' ' + Math.round(x.v / tot * 100) + '%').join(', ') : '') +
        (mio ? '\nIl tuo contributo: ' + Math.round(mio.v / tot * 100) + '%' : '\nVai ' + (p.zone === A.zk ? 'a cercarlo al centro della zona!' : 'in ' + ZONE[A.zk] + ' e cercalo al centro della mappa.'));
    }
    api.command('boss', 'il boss del mondo: dove si trova e quanta vita gli resta (/boss classifica per i più valorosi)', (p, args) => {
      if (/^(classifica|top)$/i.test(args[0] || '')) {
        const L = Object.values(S.eroi).sort((a, b) => b.vittorie - a.vittorie || b.danni - a.danni).slice(0, 10);
        return L.length ? 'Cacciatori di boss:\n' + L.map((v, k) => (k + 1) + '. ' + v.nome + ' · ' + v.vittorie + ' boss' + (v.primi ? ', ' + (v.primi === 1 ? 'una volta' : v.primi + ' volte') + ' il più valoroso' : '')).join('\n') : 'Nessun boss del mondo è ancora stato sconfitto.';
      }
      return stato(p);
    });

    // per gli altri plugin (per esempio i Gruppi d'avventura): stato e avviso quando un boss cade
    globalThis.VoxeliaBoss = {
      attivi: () => [...ATT.values()].map(A => Object.assign(vista(A), { stanza: A.room })),
      onSconfitto: fn => { if (typeof fn === 'function') ascolta.push(fn); }
    };
    api.on('stop', () => { for (const A of ATT.values()) api.broadcast('fine', { k: A.k, vinto: false }, A.room); ATT.clear(); if (globalThis.VoxeliaBoss) delete globalThis.VoxeliaBoss; });

    // pagine web: pubblica con i boss in corso e la classifica, admin con i pulsanti.
    // Stesso aspetto dei menu di Voxelia e della guida: Georgia, oro con l'ombra ruggine, barra di legno coi chiodi, pannelli con l'ombra piena sotto
    const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const CHIARO = '--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--btn:#fff8e6;--btnh:#f6e7c2;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--title:#6a2a1a;--tshadow:#e0c48a;--ember:#a8401a;--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--rowh:#8a5a0a12;--glow:#fff0;color-scheme:light';
    const STILE = '<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><style>' +
      ':root{--bg:#10131a;--pan:#1b2030;--pan2:#232a40;--btn:#2a3350;--btnh:#3b4770;--fg:#e8ecf4;--mu:#9aa4b8;--ac:#f5b942;--hi:#ffd27a;--title:#f5b942;--tshadow:#8a3b12;--ember:#ff8a5a;--frame:#8a6a3a;--drop:#2e1d10;--line:#f5b94230;--line2:#f5b94266;--rowh:#f5b9420f;--glow:#24305466;--good:#4cd07a;--bad:#e8484f;--f:Georgia,"Times New Roman",serif;color-scheme:dark}' +
      '@media(prefers-color-scheme:light){:root{' + CHIARO + '}}' +
      '*{box-sizing:border-box}body{margin:0;color:var(--fg);font:400 16px/1.55 var(--f);background:radial-gradient(ellipse 90% 50% at 50% -10%,var(--glow),transparent 70%),repeating-linear-gradient(26.565deg,transparent 0 46px,var(--line) 46px 47px),repeating-linear-gradient(-26.565deg,transparent 0 46px,var(--line) 46px 47px),var(--bg);min-height:100vh}' +
      'a{color:var(--ac);text-underline-offset:2px}a:hover{color:var(--hi)}' +
      '.brand{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px max(28px,calc(50% - 400px));font:bold 1.3rem/1.15 var(--f);font-variant:small-caps;letter-spacing:.04em;color:#ffd27a;text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244;' +
      'background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f,inset 0 -2px 0 #2e1d1055,0 5px 0 #00000066}' +
      '.brand::before,.brand::after{content:"";position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}.brand::before{left:8px}.brand::after{right:8px}' +
      '.brand small{display:block;font:italic 400 .78rem var(--f);letter-spacing:0;font-variant:normal;color:#f4e2b8;text-shadow:1px 1px 0 #0008;margin-top:3px}.brand a{color:#ffd27a;font:.85rem var(--f);font-variant:normal;letter-spacing:0;text-shadow:1px 1px 0 #0008}.brand a:hover{color:#ffe7a8}' +
      'main{max-width:860px;margin:0 auto;padding:22px 16px 50px}' +
      'h1{margin:0;font:inherit}h2{font:bold 1.6rem/1.15 var(--f);color:var(--title);text-shadow:2px 2px 0 var(--tshadow);margin:1.4em 0 .5em}' +
      '.kick{display:flex;align-items:center;gap:10px;font:bold .72rem var(--f);text-transform:uppercase;letter-spacing:.14em;color:var(--hi);margin:0 0 .6em}.kick::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,var(--line2),transparent)}' +
      '.mu{color:var(--mu)}small{color:var(--mu);font-size:.85rem}' +
      '.card{background:var(--pan);border:2px solid var(--frame);border-radius:4px;box-shadow:0 5px 0 var(--drop),0 10px 20px #0005;padding:.85em 1.05em;margin:0 0 16px}' +
      '.boss{border-left:6px solid var(--bad)}.boss b.n{font-size:1.2rem;color:var(--ember)}.riga{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}.riga .mu{font-size:.92rem}' +
      '.tag{display:inline-block;font:bold .62rem var(--f);text-transform:uppercase;letter-spacing:.08em;color:#2a1a06;background:linear-gradient(180deg,#ffd27a,#c98a1a);border:1px solid #0005;border-radius:2px;box-shadow:0 2px 0 #0007;padding:.15em .5em}' +
      '.vita{position:relative;height:18px;margin:.65em 0 .4em;background:#0008;border:2px solid #3a2414;border-radius:3px;overflow:hidden;box-shadow:0 3px 0 #0006}.vita i{display:block;height:100%;background:linear-gradient(180deg,#ff7a5a,#c0392b 60%,#8a1f1a)}' +
      '.vita span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:bold .78rem var(--f);color:#fff;text-shadow:1px 1px 0 #000}' +
      '.top{display:flex;flex-wrap:wrap;gap:6px;margin-top:.5em}.top span{background:var(--pan2);border:1px solid var(--line2);border-radius:3px;padding:.15em .55em;font-size:.88rem;box-shadow:0 2px 0 #0006}.top b{color:var(--hi);margin-left:.3em}' +
      '.tw{overflow:auto;border:2px solid var(--frame);border-radius:4px;background:var(--pan);box-shadow:0 5px 0 var(--drop),0 10px 20px #0005;margin:0 0 16px}' +
      'table{border-collapse:collapse;width:100%;font-size:.94rem}th{text-align:left;font:bold .7rem var(--f);text-transform:uppercase;letter-spacing:.1em;color:#ffd27a;text-shadow:1px 1px 0 #0008;padding:.75em .7em;white-space:nowrap;background:repeating-linear-gradient(180deg,#0000 0 13px,#00000022 13px 14px),linear-gradient(180deg,#86603b,#5e3f25);border-bottom:2px solid #3a2414}' +
      'td{padding:.5em .7em;border-bottom:1px solid var(--line);vertical-align:top}tbody tr:nth-child(even){background:var(--rowh)}tbody tr:hover{background:var(--line)}th.n,td.n{text-align:right;width:7em;font-variant-numeric:tabular-nums;white-space:nowrap}td.p{font:bold 1.05rem var(--f);color:var(--ac);width:2.5em;text-align:right}td small{display:block}' +
      '.vuoto{color:var(--mu);font-style:italic}' +
      'button,select{font:15px var(--f);border-radius:3px;padding:.45em .85em;margin:2px}' +
      'button{color:#fff;background:#2a3350;border:1px solid #f5b94288;cursor:pointer;box-shadow:0 3px 0 #00000080;transition:transform .08s,box-shadow .08s,background .15s}button:hover{background:#3b4770}button:active{transform:translateY(2px);box-shadow:0 1px 0 #00000080}' +
      'button.oro{background:linear-gradient(180deg,#ffd27a,#e0a634 55%,#c98a1a);border-color:#fff0c0;color:#2a1a06;font-weight:bold;text-shadow:0 1px 0 #fff5}button.oro:hover{background:linear-gradient(180deg,#ffe29a,#ecb444 55%,#d9962a)}' +
      'button.via{background:linear-gradient(180deg,#d8452c,#a8301c);border-color:#ffb0a0}button.via:hover{background:linear-gradient(180deg,#e85a3c,#b83a24)}' +
      'select{border:2px solid #3a2414;background:#f4ecd6;color:#2a2010;box-shadow:inset 0 2px 0 #0002,0 2px 0 #a37a4f66;max-width:100%}select:focus{outline:none;border-color:var(--ac)}' +
      'button:focus-visible,a:focus-visible,select:focus-visible{outline:2px solid var(--ac);outline-offset:2px}' +
      '.form{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.form label{font:bold .7rem var(--f);text-transform:uppercase;letter-spacing:.08em;color:var(--mu)}' +
      '.agg{text-align:center;font:italic .82rem var(--f);color:var(--mu);margin-top:26px}' +
      '@media(max-width:560px){.brand{padding:12px 24px}h2{font-size:1.35rem}}</style>';
    const testa = (titolo, sotto, link) => '<header class=brand><div><h1>🐉 ' + titolo + '</h1><small>' + sotto + '</small></div>' + (link || '') + '</header><main>';
    const PIEDE = '<p class=agg>La pagina si aggiorna da sola ogni 15 secondi.</p></main>';
    const quando = t => new Date(t).toLocaleString('it-IT');
    function inCorso(adm) {
      if (!ATT.size) { const m = Math.ceil((S.prossima - Date.now()) / MIN); return '<div class=card><span class=vuoto>Nessun boss in giro.</span> ' + (m > 0 ? 'Il prossimo tra circa <b>' + m + ' min</b>.' : 'Il prossimo appena ci sono abbastanza eroi online.') + '</div>'; }
      return [...ATT.values()].map(A => {
        const top = classifica(A), tot = top.reduce((a, x) => a + x.v, 0) || 1;
        return '<div class="card boss"><div class=riga><b class=n>' + e(A.nome) + '</b><span class=tag>' + e(ZONE[A.zk]) + '</span>' + (adm ? '<span class=mu>stanza <b>' + e(A.room) + '</b> · ' + A.max.toFixed(1) + ' vite</span>' : '') + '<span class=mu>se ne va tra ' + minuti(A.fine - Date.now()) + ' min</span></div>' +
          '<div class=vita><i style="width:' + pct(A) + '%"></i><span>' + pct(A) + '% di vita</span></div>' +
          (top.length ? '<div class=top>' + top.slice(0, adm ? 20 : 5).map(x => '<span>' + e(x.nome) + '<b>' + Math.round(x.v / tot * 100) + '%</b>' + (adm && x.scarti > .01 ? ' <small>(scartati ' + x.scarti.toFixed(2) + ' vite oltre il tetto)</small>' : '') + '</span>').join('') + '</div>' : '<small>Nessuno l\'ha ancora colpito.</small>') +
          (adm ? '<div style="margin-top:.7em"><button class=via onclick=\'if(confirm("Mandare via il boss?"))fai("annulla",{stanza:' + e(JSON.stringify(A.room)) + '})\'>Mandalo via</button></div>' : '') + '</div>';
      }).join('');
    }
    function albo() {
      const L = Object.values(S.eroi).sort((a, b) => b.vittorie - a.vittorie || b.danni - a.danni).slice(0, 20);
      return '<h2>Cacciatori di boss</h2>' + (L.length ? '<div class=tw><table><thead><tr><th></th><th>Eroe</th><th class=n>Boss</th><th class=n>Più valoroso</th></tr></thead><tbody>' + L.map((v, k) => '<tr><td class=p>' + (k + 1) + '</td><td>' + e(v.nome) + '</td><td class=n>' + v.vittorie + '</td><td class=n>' + v.primi + '</td></tr>').join('') + '</tbody></table></div>' : '<div class=card><span class=vuoto>Nessun boss del mondo è ancora stato sconfitto.</span></div>') +
        '<h2>Ultimi boss</h2>' + (S.storico.length ? '<div class=tw><table><thead><tr><th>Quando</th><th>Boss</th><th>Esito</th></tr></thead><tbody>' + S.storico.slice(0, 15).map(h => '<tr><td><small>' + e(quando(h.quando)) + '</small></td><td>' + e(h.nome) + '<small>' + e(ZONE[h.zona] || h.zona) + '</small></td><td>' + (h.vinto ? '🏆 ' + e(h.top.join(', ')) : '<span class=vuoto>se n\'è andato</span>') + '</td></tr>').join('') + '</tbody></table></div>' : '<div class=card><span class=vuoto>Ancora nessun boss.</span></div>');
    }
    api.route('GET', '/', (req, res, x) => x.send(STILE + '<title>Boss del mondo · Voxelia</title>' + testa('Boss del mondo', 'Si affronta tutti insieme: il premio va in base ai danni') + '<p class=kick>In corso</p>' + inCorso(false) + albo() + PIEDE + '<script>setTimeout(()=>location.reload(),15000)</script>'));
    api.route('GET', 'admin', (req, res, x) => {
      const stanze = Object.keys(api.rooms());
      x.send(STILE + '<title>Boss del mondo · admin</title>' + testa('Boss del mondo · admin', 'Un boss ogni ' + num(C.ogniMin, 60, .2, 1440) + ' min, resta ' + num(C.durataMin, 15, 1, 600) + ' min · ' + lista.length + ' boss validi (si cambiano in boss.config.json)', '<a href="./">Pagina pubblica</a>') +
        '<p class=kick>In corso</p>' + inCorso(true) +
        '<p class=kick>Evoca ora</p>' +
        (stanze.length ? '<div class="card form"><label for=r>Stanza</label><select id=r>' + stanze.map(r => '<option>' + e(r) + '</option>').join('') + '</select><label for=b>Boss</label><select id=b><option value="">a caso</option>' +
          lista.map((b, i) => '<option value="' + i + '">' + e(b.nome) + ' (' + e(ZONE[b.zona]) + ')</option>').join('') + '</select><button class=oro onclick=\'fai("evoca",{stanza:r.value,i:b.value})\'>Evoca</button></div>' : '<div class=card><span class=vuoto>Nessuna stanza con eroi online.</span></div>') +
        albo() + PIEDE +
        '<script>function fai(a,b){fetch("admin/"+a,{method:"POST",headers:{"x-voxelia":"1","Content-Type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json()).then(j=>{if(j.ok)location.reload();else alert(j.err||"Errore")})}setTimeout(()=>location.reload(),15000)</script>');
    }, { admin: true });
    api.route('POST', 'admin/*', (req, res, x) => x.body(b => {
      b = b && typeof b === 'object' ? b : {};
      const room = String(b.stanza || '');
      if (x.path === '/admin/evoca') {
        if (!api.rooms()[room]) return x.json(400, { err: 'Nessun eroe online in quella stanza.' });
        const i = b.i === '' || b.i == null ? -1 : parseInt(b.i, 10);
        const r = evoca(room, lista[i] || null, 'admin'); return r ? x.json(400, { err: r }) : x.json({ ok: 1 });
      }
      if (x.path === '/admin/annulla') { const A = ATT.get(room); if (!A) return x.json(400, { err: 'Nessun boss in quella stanza.' }); chiudi(A, false); return x.json({ ok: 1 }); }
      x.json(404, { err: 'azione sconosciuta' });
    }), { admin: true });
  }
};
