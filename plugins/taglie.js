// Taglie del giorno: ogni giorno il server estrae alcune taglie uguali per tutti (boss, arena, scambi, esplorazione).
// /taglie mostra quelle di oggi e i tuoi progressi. Premi e numero di taglie si cambiano in taglie.config.json.
// La Cripta Dimenticata dalla 7.2 si raggiunge solo dal Borgo delle Ceneri: chi non l'ha ancora aperto riceve al suo posto
// un'altra taglia (la stessa per tutti quelli nella sua situazione). Il gioco dice al plugin se il Borgo è aperto.
const DUNGEON = { tana: 'Tana dei Goblin', cripta: 'Cripta Dimenticata', piramide: 'Piramide di Khem', cristallo: 'Caverne di Cristallo',
  fucina: 'Fucina Infernale', abisso: 'Abisso Sommerso', cittadella: 'Cittadella del Vuoto' };
const ZONE = { forest: 'Foresta di Elmwood', desert: 'Deserto di Khem', peaks: 'Picchi Gelidi', in_library: 'Biblioteca Arcana', in_temple: 'Tempio della Luce', in_castle: 'Castello di Aldoria' };

// tutte le taglie possibili: ev è l'evento che le fa avanzare, ok decide se quell'evento conta,
// fam raggruppa le taglie simili (ne esce al massimo una per gruppo)
const POOL = [
  { id: 'boss2', fam: 'boss', testo: 'Sconfiggi 2 boss di dungeon', ev: 'dungeon', n: 2 },
  { id: 'boss4', fam: 'boss', testo: 'Sconfiggi 4 boss di dungeon', ev: 'dungeon', n: 4, extra: 1 },
  ...Object.entries(DUNGEON).map(([d, nome]) => ({ id: 'dg_' + d, testo: 'Libera ' + nome, ev: 'dungeon', n: 1, ok: (p, dg) => dg === d })),
  { id: 'arena1', fam: 'arena', testo: 'Vinci un incontro nel Colosseo', ev: 'arena', n: 1 },
  { id: 'arena3', fam: 'arena', testo: 'Vinci 3 incontri nel Colosseo', ev: 'arena', n: 3, extra: 1 },
  { id: 'scambio', testo: 'Concludi uno scambio con un altro eroe', ev: 'trade', n: 1 },
  ...Object.entries(ZONE).map(([z, nome]) => ({ id: 'zona_' + z, testo: 'Visita ' + nome, ev: 'zone', n: 1, ok: (p, zona) => zona === z })),
  { id: 'dungeon_entra', testo: 'Entra in 3 dungeon diversi', ev: 'zone', n: 3, unico: true, ok: (p, zona) => zona.split('@')[0] in DUNGEON && zona.split('@')[0] }
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
  name: 'Taglie del giorno',
  version: '1.3',
  author: 'Voxelia',
  description: 'Ogni giorno nuove taglie per tutti: /taglie per vederle',
  defaults: {
    quante: 3,
    premio: { oro: 300, xp: 300 },               // per ogni taglia
    premioDifficile: { oro: 600, xp: 600 },      // per le taglie più lunghe
    premioTutte: { oro: 500, oggetto: 2 },       // bonus quando le completi tutte
    promemoria: true,
    annunciaNuove: true                          // a mezzanotte UTC, in chat e a schermo
  },

  setup(api) {
    // annuncio a schermo (oltre alla chat) a tutti o a una stanza; regno: solo a chi gioca nel regno, non a Tomorrow
    const schermo = (titolo, testo, icona, room, regno) => api.broadcast('annuncio', { titolo: String(titolo).slice(0, 60), testo: String(testo || '').slice(0, 120), icona, regno: regno ? 1 : 0 }, room);
    api.client(ANNUNCIO(api.id));
    const C = api.config, chiave = n => String(n).toLowerCase();
    const oggi = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };

    // estrazione uguale per tutti, decisa dal giorno: niente da salvare, e dopo un riavvio restano le stesse
    // senzaCripta: la cripta viene saltata e si pesca una taglia in più; le altre restano le stesse
    function taglie(g, senzaCripta) {
      let s = g * 2654435761 % 4294967296; const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
      const L = POOL.slice(), out = [], usati = new Set();
      while (out.length < Math.max(1, Math.min(6, C.quante | 0 || 3)) && L.length) {
        const t = L.splice(Math.floor(rnd() * L.length), 1)[0], fam = t.fam || t.id;
        if (usati.has(fam) || (senzaCripta && t.id === 'dg_cripta')) continue;                 // non due taglie quasi uguali nello stesso giorno
        usati.add(fam); out.push(t);
      }
      return out;
    }

    function scheda(p) {
      if (globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p)) return { nome: p.name, prog: {}, visti: {}, fatte: [] };   // i bot dello Stress test non si salvano
      const s = api.store, g = oggi(); s.eroi = s.eroi || {};
      if (s.giorno !== g) { s.giorno = g; s.eroi = {}; }     // nuovo giorno: progressi azzerati
      const k = chiave(p.name);
      return s.eroi[k] || (s.eroi[k] = { nome: p.name, prog: {}, visti: {}, fatte: [] });
    }

    // il gioco dice se il Borgo delle Ceneri (e quindi la cripta) è aperto per questo eroe
    const aperta = new Map();   // id del giocatore -> true/false
    api.client('(' + function (ID) {
      let ultimo = null, ultimoId = null;
      const cripta = () => { try { return !!(P && P.unl && P.unl.rovine); } catch (e) { return false; } };
      setInterval(() => {
        try {
          if (!P || !NET.ok || !NET.id) return;
          const v = cripta();
          if (v !== ultimo || NET.id !== ultimoId) { ultimo = v; ultimoId = NET.id; VXP.send(ID, 'cripta', { aperta: v }); }
        } catch (e) {}
      }, 2000);
    }.toString() + ')(' + JSON.stringify(api.id) + ');');
    api.onClient('cripta', (p, d) => {
      const v = !!(d && d.aperta); aperta.set(p.id, v);
      // la scelta resta fissa per tutto il giorno, così i progressi non cambiano taglia a metà
      const e = scheda(p); if (e.cripta == null) { e.cripta = v; api.save(); }
    });
    api.on('leave', p => aperta.delete(p.id));
    // le taglie di oggi per questo eroe; finché il gioco non ha risposto conta come Borgo chiuso
    // prima della 7.2 la cripta aveva l'ingresso in città: aperta per tutti
    const [ma, mi] = String(api.gameVersion || '').split('.').map(Number), criptaInCitta = ma < 7 || (ma === 7 && mi < 2);
    const sue = p => {
      if (criptaInCitta) return taglie(oggi());
      const e = scheda(p);
      if (e.cripta == null && aperta.has(p.id)) { e.cripta = aperta.get(p.id); api.save(); }   // nuovo giorno: si fissa con l'ultima risposta
      return taglie(oggi(), !e.cripta);
    };

    const RARITA = ['comune', 'non comune', 'raro', 'epico'];
    const testo = pr => [pr.oro && pr.oro + ' oro', pr.pozioni && pr.pozioni + (pr.pozioni === 1 ? ' pozione' : ' pozioni'), pr.xp && pr.xp + ' XP', pr.oggetto != null && 'un oggetto ' + (RARITA[pr.oggetto] || 'raro')].filter(Boolean).join(', ');
    function dai(p, pr) {
      if (!pr) return;
      if (globalThis.VoxeliaGuardiano) globalThis.VoxeliaGuardiano.grazia(p.name);
      if (pr.oro > 0) p.give('gold', pr.oro);
      if (pr.pozioni > 0) p.give('pot', pr.pozioni);
      if (pr.xp > 0) p.give('xp', pr.xp);
      if (pr.oggetto != null) p.give('item', 1, pr.oggetto);
    }

// i bot del plugin Stress test non si salvano
    const finto = p => !!(globalThis.VoxeliaStress && globalThis.VoxeliaStress.bot(p));
    function avanza(p, ev, ...dati) {
      if (!p || finto(p)) return;
      const T = sue(p), e = scheda(p); let cambiato = false;
      for (const t of T) {
        if (t.ev !== ev || e.fatte.includes(t.id)) continue;
        const r = t.ok ? t.ok(p, ...dati) : true; if (!r) continue;
        if (t.unico) { const v = e.visti[t.id] || (e.visti[t.id] = []); if (v.includes(r)) continue; v.push(r); }
        e.prog[t.id] = (e.prog[t.id] || 0) + 1; cambiato = true;
        if (e.prog[t.id] >= t.n) {
          e.fatte.push(t.id);
          const pr = t.extra ? C.premioDifficile : C.premio;
          dai(p, pr);
          p.tell('Taglia completata: ' + t.testo + '! Premio: ' + testo(pr) + '.');
          api.announce('🎯 ' + p.name + ' ha completato la taglia "' + t.testo + '"', p.room);
          if (e.fatte.length < T.length) p.send('annuncio', { titolo: 'Taglia completata!', testo: t.testo + ' · ' + testo(pr), icona: 'spunta' });
          if (e.fatte.length === T.length) {
            dai(p, C.premioTutte);
            api.announce('🏆 ' + p.name + ' ha completato tutte le taglie di oggi!', p.room);
            p.tell('Tutte le taglie di oggi completate! Bonus: ' + testo(C.premioTutte) + '.');
            p.send('annuncio', { titolo: 'Tutte le taglie di oggi!', testo: 'Bonus: ' + testo(C.premioTutte), icona: 'corona' });
          }
        } else p.tell('Taglia "' + t.testo + '": ' + e.prog[t.id] + '/' + t.n);
      }
      if (cambiato) api.save();
    }

    // a mezzanotte UTC escono le taglie nuove: lo dice a chi è online
    let giornoVisto = oggi();
    api.every(30000, () => {
      const g = oggi(); if (g === giornoVisto) return; giornoVisto = g;
      if (!C.annunciaNuove || !api.players().some(p => !finto(p))) return;
      api.announce('🎯 Sono uscite le taglie di oggi: scrivi /taglie per vederle!');
      schermo('Nuove taglie', 'Le taglie di oggi sono pronte · /taglie', 'pergamena');
    });

    api.on('dungeon', (p, d) => avanza(p, 'dungeon', d));
    api.on('arena', vincitore => avanza(vincitore, 'arena'));
    api.on('trade', (a, b) => { avanza(a, 'trade'); avanza(b, 'trade'); });
    api.on('zone', (p, zona) => avanza(p, 'zone', String(zona || '')));

    api.command('taglie', 'le taglie di oggi e i tuoi progressi', p => {
      const T = sue(p), e = scheda(p);
      return 'Taglie di oggi (' + e.fatte.length + '/' + T.length + ' completate):\n' +
        T.map(t => (e.fatte.includes(t.id) ? '✔ ' : '• ') + t.testo + ' — ' + (e.fatte.includes(t.id) ? 'fatta' : (e.prog[t.id] || 0) + '/' + t.n)).join('\n') +
        '\nPremio per taglia: ' + testo(C.premio) + '. Tutte e ' + T.length + ': ' + testo(C.premioTutte) + ' in più.';
    });

    api.on('join', p => {
      if (!C.promemoria || finto(p)) return;
      const e = scheda(p), n = sue(p).length;
      if (e.fatte.length < n) api.after(5000, () => { if (p.online) p.tell('Ci sono taglie da completare oggi (' + e.fatte.length + '/' + n + '): scrivi /taglie'); });
    });

    // pagina pubblica con le taglie di oggi e chi le ha completate, con l'aspetto dei menu di Voxelia (come la guida):
    // Georgia, oro con l'ombra ruggine, barra di legno con i chiodi, pannelli col bordo e l'ombra piena sotto
    const TIPO = { dungeon: ['Dungeon', 'boss'], arena: ['Colosseo', 'duel'], trade: ['Scambio', 'talk'], zone: ['Esplorazione', 'step'] };
    const STILE = ':root{--bg:#10131a;--pan:#1b2030;--pan2:#232a40;--btn:#2a3350;--fg:#e8ecf4;--mu:#9aa4b8;--ac:#f5b942;--hi:#ffd27a;--lo:#c98a1a;--ember:#ff8a5a;' +
      '--title:#f5b942;--tshadow:#8a3b12;--frame:#8a6a3a;--drop:#2e1d10;--line:#f5b94230;--line2:#f5b94266;--good:#4cd07a;--f:Georgia,\'Times New Roman\',serif;color-scheme:dark}' +
      '@media(prefers-color-scheme:light){:root{--bg:#e8dfc8;--pan:#fbf3df;--pan2:#f3e8cc;--btn:#fff8e6;--fg:#2a1a0a;--mu:#6a5a3a;--ac:#8a5a0a;--hi:#6a2a1a;--lo:#b9832a;--ember:#b4461c;' +
      '--title:#6a2a1a;--tshadow:#e0c48a;--frame:#b89a62;--drop:#a37a4f;--line:#8a6a3a33;--line2:#8a6a3a77;--good:#2f8a4e;color-scheme:light}}' +
      '*{box-sizing:border-box}body{margin:0;min-height:100vh;color:var(--fg);font:400 16px/1.55 var(--f);background:radial-gradient(ellipse 90% 50% at 50% -10%,#24305466,transparent 70%),' +
      'repeating-linear-gradient(26.565deg,transparent 0 46px,var(--line) 46px 47px),repeating-linear-gradient(-26.565deg,transparent 0 46px,var(--line) 46px 47px),var(--bg)}' +
      '.legno{position:relative;padding:13px 30px 14px;font:bold 1.16rem/1.1 var(--f);font-variant:small-caps;letter-spacing:.04em;color:#ffd27a;text-shadow:2px 2px 0 #8a3b12,0 0 14px #f5b94244;' +
      'background:repeating-linear-gradient(180deg,#0000 0 17px,#0000002a 17px 19px),linear-gradient(180deg,#86603b,#5e3f25 55%,#4a301b);border-bottom:3px solid #3a2414;box-shadow:inset 0 2px 0 #a37a4f,0 5px 0 #00000066}' +
      '.legno::before,.legno::after{content:"";position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;background:#d9b36a;box-shadow:inset -2px -2px 0 #8a6420;border-radius:1px}.legno::before{left:10px}.legno::after{right:10px}' +
      '.legno small{display:block;font:italic 400 .72rem var(--f);font-variant:normal;letter-spacing:0;color:#f4e2b8;text-shadow:1px 1px 0 #0008;margin-top:3px}' +
      'main{max-width:1000px;margin:0 auto;padding:22px 16px 48px}' +
      '.kick{margin:0;font:bold .74rem var(--f);text-transform:uppercase;letter-spacing:.16em;color:var(--ember)}' +
      'h1{margin:.15em 0 .2em;font:bold clamp(2rem,7vw,3.6rem)/1.05 var(--f);letter-spacing:.07em;text-transform:uppercase;color:var(--title);text-shadow:3px 3px 0 var(--tshadow);text-wrap:balance}' +
      'h2{display:flex;align-items:center;gap:10px;margin:1.6em 0 .6em;font:bold clamp(1.35rem,3.4vw,1.8rem)/1.15 var(--f);color:var(--title);text-shadow:2px 2px 0 var(--tshadow)}' +
      'h2::after{content:"";flex:1;min-width:30px;height:2px;background:linear-gradient(90deg,var(--line2),transparent)}' +
      '.sub{margin:0 0 14px;max-width:64ch;color:var(--mu)}' +
      'kbd{font:bold .8rem var(--f);background:var(--btn);border:1px solid var(--line2);border-radius:3px;box-shadow:0 2px 0 #0009;padding:.1em .5em;color:var(--fg);white-space:nowrap}' +
      '.stats{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}' +
      '.stats li{display:flex;align-items:baseline;gap:6px;font-size:.92rem;color:var(--mu);background:var(--pan);border:1px solid var(--line2);border-radius:4px;padding:.25em .75em;box-shadow:0 3px 0 var(--drop)}' +
      '.stats b{font:bold 1.35rem var(--f);color:var(--hi);font-variant-numeric:tabular-nums}' +
      '.tg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}' +
      '.card{display:flex;flex-direction:column;gap:.45em;padding:.85em 1em;background:var(--pan);border:2px solid var(--frame);border-left-width:6px;border-radius:4px;box-shadow:0 5px 0 var(--drop),0 10px 20px #0005}' +
      '.card.boss{border-left-color:#c8463c}.card.duel{border-left-color:#e08a2c}.card.talk{border-left-color:#9a7ae0}.card.step{border-left-color:#3fb0a8}' +
      '.card.ok{border-color:var(--good)}.card h3{margin:0;font:bold 1.12rem/1.3 var(--f);color:var(--hi)}' +
      '.tags{display:flex;flex-wrap:wrap;gap:6px}.qt,.tag{display:inline-block;font:bold .62rem var(--f);text-transform:uppercase;letter-spacing:.07em;border-radius:2px;padding:.22em .55em;box-shadow:0 2px 0 #0006}' +
      '.qt{background:#2a3452;color:#e8ecf4}.qt.boss{background:#5a1f22;color:#ffc8c0}.qt.duel{background:#5a3a14;color:#ffd8a8}.qt.talk{background:#3a2a5a;color:#e0d0ff}.qt.step{background:#1f4646;color:#c0f0ec}' +
      '.tag{color:#2a1a06;background:linear-gradient(180deg,#ffd27a,#c98a1a);border:1px solid #0005}' +
      '.prem{margin:0;font-size:.92rem;color:var(--mu)}.prem b{color:var(--fg);font-weight:normal}' +
      '.chi{display:flex;align-items:center;gap:10px;margin-top:auto;padding-top:.5em;border-top:1px solid var(--line);font-size:.9rem;color:var(--mu)}' +
      '.bar{flex:1;height:9px;background:#0006;border:1px solid #fff3;border-radius:2px;overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--lo),var(--ac))}' +
      '.chi b{color:var(--fg);font-variant-numeric:tabular-nums}' +
      '.alt{margin:.2em 0 0;padding:.5em .7em;background:var(--pan2);border:1px dashed var(--line2);border-radius:3px;font-size:.88rem;color:var(--mu)}.alt b{color:var(--fg);font-weight:normal}' +
      '.callout{margin:22px 3px 0;padding:.85em 1.1em;background:var(--pan2);border:3px solid var(--lo);border-radius:6px;box-shadow:0 0 0 3px #4a301b,0 7px 0 3px var(--drop),0 16px 30px #0007}' +
      '.callout b:first-child{color:var(--hi)}' +
      '.eld{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}.eld li{background:var(--pan);border:1px solid var(--line2);border-radius:3px;padding:.3em .75em;box-shadow:0 2px 0 var(--drop)}' +
      '.eld li::before{content:"🏆 "}.vuoto{margin:0;color:var(--mu);font-style:italic}.note{margin-top:28px;font-size:.85rem;color:var(--mu)}';

    api.route('GET', '/', (req, res, x) => {
      const T = taglie(oggi()), s = api.store, E = s.giorno === oggi() ? Object.values(s.eroi || {}) : [];
      const alt = !criptaInCitta && T.some(t => t.id === 'dg_cripta') && taglie(oggi(), true).find(t => !T.includes(t));
      const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const quanti = t => E.filter(e => e.fatte.includes(t.id)).length, eroi = n => n + (n === 1 ? ' eroe' : ' eroi');
      const tutte = E.filter(e => e.fatte.length >= T.length);
      let data = ''; try { data = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) {}
      const riquadro = t => {
        const [tipo, cl] = TIPO[t.ev] || ['Taglia', ''], n = quanti(t), pr = t.extra ? C.premioDifficile : C.premio;
        return '<article class="card ' + cl + '"><div class="tags"><span class="qt ' + cl + '">' + tipo + '</span>' + (t.extra ? '<span class="tag">Difficile</span>' : '') + '</div>' +
          '<h3>' + esc(t.testo) + '</h3><p class="prem">Premio: <b>' + esc(testo(pr) || 'nessuno') + '</b></p>' +
          (t.id === 'dg_cripta' && alt ? '<p class="alt">Chi non ha ancora aperto il Borgo delle Ceneri: <b>' + esc(alt.testo) + '</b> · ' + eroi(quanti(alt)) + '</p>' : '') +
          '<div class="chi"><span class="bar"><i style="width:' + (E.length ? Math.round(n / E.length * 100) : 0) + '%"></i></span><span><b>' + n + '</b> ' + (n === 1 ? 'eroe' : 'eroi') + '</span></div></article>';
      };
      x.send('<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taglie del giorno</title>' +
        '<style>' + STILE + '</style><body><header class="legno">🎯 Taglie del giorno<small>Bacheca di Aldoria · Voxelia</small></header><main>' +
        '<p class="kick">' + esc(data || 'Oggi') + '</p><h1>Taglie del giorno</h1>' +
        '<p class="sub">Ogni giorno nuove taglie, uguali per tutti gli eroi. Nel gioco scrivi <kbd>/taglie</kbd> per vedere i tuoi progressi.</p>' +
        '<ul class="stats"><li><b>' + T.length + '</b> taglie</li><li><b>' + E.length + '</b> ' + (E.length === 1 ? 'eroe' : 'eroi') + ' a caccia oggi</li><li><b>' + tutte.length + '</b> le hanno fatte tutte</li></ul>' +
        '<h2>Le taglie di oggi</h2><div class="tg">' + T.map(riquadro).join('') + '</div>' +
        '<div class="callout"><b>Bonus per chi le completa tutte:</b> ' + esc(testo(C.premioTutte) || 'nessuno') + ', oltre ai premi di ogni taglia.</div>' +
        '<h2>Chi le ha completate tutte</h2>' + (tutte.length ? '<ul class="eld">' + tutte.map(e => '<li>' + esc(e.nome) + '</li>').join('') + '</ul>' : '<p class="vuoto">Ancora nessuno.</p>') +
        '<p class="note">Le taglie cambiano a mezzanotte, ora del server.</p></main></body></html>');
    });
  }
};
