// Richieste di teletrasporto: /tpa <nome> chiede a un altro eroe della stessa stanza di raggiungerlo.
// Chi riceve la richiesta può accettarla (/tpaccetta o il pulsante nel gioco), rifiutarla (/tparifiuta)
// o ignorarla: dopo scadenzaSec secondi scade da sola. Prima di partire si controlla che chi chiede possa
// davvero entrare nella zona di arrivo. Le zone chiuse da una missione si riconoscono da sole: dai portali
// con un cancello ("lock") che i giocatori incontrano, e dalle missioni che aprono una zona con lo stesso nome
// ("unl"). Edifici e dungeon dentro una zona chiusa sono chiusi anche loro. Quello che non è un cancello
// (come la Cittadella, che dipende dalla storia del Re) si scrive in "regole" di tpa.config.json.
// Alcune zone hanno un ingresso che non è né un cancello né una missione, e il plugin le conosce già (vedi SPECIALI):
// Aldoria Vecchia (il muro crepato da scavare), la stanza del culto sotto di lei, la stanza dell'Occhio (la porta
// di pietra, che si apre con la chiave di Malakar) e la cella delle prigioni, dove ti porta solo la storia.
// Il controllo usa i progressi salvati nel gioco del giocatore: come tutto lo stato dell'eroe, un
// giocatore che modifica il proprio gioco può falsificarli. Le zone in "vietate" sono escluse sempre.
const ZONE = { town: 'Aldoria', arena: 'il Colosseo', forest: 'la Foresta di Elmwood', desert: 'il Deserto di Khem', peaks: 'i Picchi Gelidi',
  nord: 'Aldoria Nord', campi: 'Aldoria Est', rovine: 'Aldoria Vecchia', porto: 'il Porto', cittadella: 'la Cittadella del Vuoto',
  vecchia: 'Aldoria Vecchia', culto: 'una stanza sotterranea', occhio: 'la stanza dell\'Occhio', cella: 'una cella delle prigioni' };
// zone dove non ci si teletrasporta mai, qualunque sia la configurazione: nella cella ti porta solo la storia
const CHIUSE = ['cella'];

// codice nel gioco: controlla l'accesso alla zona con i progressi dell'eroe, mostra la richiesta con i pulsanti e fa il viaggio
function nelGioco(ID) {
  let box = null, aperta = null;
  // nomi del gioco che il plugin usa: se un aggiornamento ne toglie uno, il teletrasporto si spegne con un avviso invece di rompersi
  const USA = { Z: () => Z, DG: () => DG, QT: () => QT, NPCS: () => NPCS, load: () => load, nearFree: () => nearFree, WK: () => WK, irisGo: () => irisGo, msg: () => msg };
  function mancanti() { return Object.keys(USA).filter(k => { try { return USA[k]() === undefined; } catch (e) { return true; } }); }
  const ROTTO = 'Il teletrasporto non funziona con questa versione del gioco: avvisa l\'admin del server.';
  const opz = f => { try { return f(); } catch (e) { return undefined; } };

  // cancelli trovati nelle zone visitate: un portale con "lock" porta a una zona chiusa da una missione
  const visti = {};
  function cerca() {
    const nuovi = [];
    try { for (const e of ents) if (e && e.k === 'po' && typeof e.lock === 'string' && typeof e.to === 'string') { const b = e.to.split('@')[0]; if (visti[b] !== e.lock) { visti[b] = e.lock; nuovi.push([b, e.lock]); } } } catch (e) {}
    if (nuovi.length) VXP.send(ID, 'cancelli', nuovi);
  }
  let zPrima = null; setInterval(() => { const z = opz(() => Zk); if (z && z !== zPrima) { zPrima = z; setTimeout(cerca, 300); } }, 1000);

  // zone che si aprono in un modo che il plugin non può scoprire da solo: "dentro" è la zona da cui ci si entra,
  // "serve" controlla i progressi dell'eroe come fa il gioco (per l'Occhio: cultDoor vuole la chiave e l'arresto)
  const SPECIALI = {
    vecchia: { serve: () => !!P.vdug, testo: 'prima apri il passaggio nel muro crepato di Aldoria (chiedi al Moreau)' },
    culto: { dentro: 'vecchia' },
    occhio: { dentro: 'culto', serve: () => !!P.key && (P.te | 0) >= 1, testo: 'la porta di pietra si apre solo con la chiave di Malakar' },
    cella: { dentro: 'in_castle', mai: 1 }
  };
  // da dove si entra in una zona: un edificio dalla zona in "out", un dungeon dalla zona in "ent"
  function padre(b) { if (SPECIALI[b] && SPECIALI[b].dentro) return SPECIALI[b].dentro; const z = opz(() => Z[b]), d = opz(() => DG[b]); return z && z.int ? (z.out || 'town') : d ? d.ent : null; }
  // la regola di una zona: quella scritta in configurazione, altrimenti un cancello scoperto o una missione che apre una zona con lo stesso nome
  function regola(b, R, S) {
    if (R && R[b]) return R[b].libera ? null : R[b];
    if (SPECIALI[b] && (SPECIALI[b].serve || SPECIALI[b].mai)) return SPECIALI[b];
    if (S && S[b]) return { sblocco: S[b] };
    if (visti[b]) return { sblocco: visti[b] };
    if (Object.keys(QT).some(id => QT[id] && QT[id].unl === b)) return { sblocco: b };
    return null;
  }
  const nomeDi = b => opz(() => Z[b] && Z[b].n.split(' · ')[0]) || opz(() => DG[b] && DG[b].n) || b;
  // "in" con l'articolo: in Aldoria, nella stanza dell'Occhio, nel Castello
  const PREP = { La: 'nella', Il: 'nel', Lo: 'nello', Le: 'nelle', I: 'nei', Gli: 'negli' };
  const inZ = n => { const m = /^(La|Il|Lo|Le|I|Gli) (.*)$/.exec(n); return m ? PREP[m[1]] + ' ' + m[2] : /^L'/.test(n) ? 'nell\'' + n.slice(2) : 'in ' + n; };
  function prova(b, r) {
    const nome = nomeDi(b);
    if (r.mai) return 'Non ci si può teletrasportare ' + inZ(nome) + '.';
    if (r.sblocco && !(P.unl && P.unl[r.sblocco])) {
      let s = 'Non puoi ancora entrare ' + inZ(nome);
      const q = Object.keys(QT).find(id => QT[id] && QT[id].unl === r.sblocco), npc = q && Object.keys(NPCS).find(n => (NPCS[n].qs || []).includes(q));
      const di = n => /^Il /.test(n) ? 'del ' + n.slice(3) : /^La /.test(n) ? 'della ' + n.slice(3) : 'di ' + n;
      if (q) s += ': prima completa la missione «' + QT[q].ti + '»' + (npc && NPCS[npc].n ? ' ' + di(NPCS[npc].n) : '');
      return s + '.';
    }
    if (r.storia != null && (P.st | 0) < r.storia) return 'Non puoi ancora entrare ' + inZ(nome) + ': ' + (r.testo || 'prima devi andare avanti nella missione del Re') + '.';
    if (r.livello && (P.lv | 0) < r.livello) return 'Non puoi ancora entrare ' + inZ(nome) + ': serve il livello ' + r.livello + '.';
    if (r.serve && !r.serve()) return 'Non puoi ancora entrare ' + inZ(nome) + ': ' + r.testo + '.';
    return '';
  }
  function accesso(zk, R, S) {
    const b = String(zk || '').split('@')[0], f = +String(zk || '').split('@')[1];
    if (!(Z[zk] || (DG[b] && f >= 1 && f <= (DG[b].fls || 1)))) return 'La zona in cui si trova non esiste nel tuo gioco: ricarica la pagina.';
    // controlla la zona e quelle da cui si passa per arrivarci (un edificio dentro Aldoria Vecchia è chiuso come Aldoria Vecchia)
    for (let z = b, i = 0, giro = new Set(); z && i < 10 && !giro.has(z); z = padre(z), i++) {
      giro.add(z); const r = regola(z, R, S); const no = r && prova(z, r); if (no) return no;
    }
    return '';
  }
  function impegnato() {
    if (mancanti().length) return ROTTO;
    if (!P || !opz(() => started)) return 'Il gioco non è ancora pronto.';
    if (opz(() => PM) === 'trade') return 'Stai facendo uno scambio: finiscilo prima di teletrasportarti.';
    if (opz(() => IRB)) return 'Stai già cambiando zona.';
    if (opz(() => Zk) === 'cella') return 'Sei chiuso in una cella: da qui non puoi teletrasportarti.';
    return '';
  }
  function controlla(d) {
    try { return impegnato() || accesso(d.zk, d.regole, d.cancelli); }
    catch (e) { console.error('[plugin ' + ID + ']', e); return ROTTO; }
  }
  const avvisa = s => { try { msg(s); } catch (e) {} };
  function chiudi() { if (box) box.remove(); box = null; aperta = null; }
  function rispondi(si) { if (aperta) VXP.send(ID, 'risposta', { id: aperta, si: !!si }); chiudi(); }

  VXP.on(ID, 'verifica', d => {
    // "occupato": il motivo è quello che sta facendo chi chiede (uno scambio, un cambio di zona…), non la zona di arrivo
    let occupato = false; try { occupato = !!impegnato(); } catch (e) {}
    const perche = controlla(d); VXP.send(ID, 'verifica', { id: d.id, perche, rotto: perche === ROTTO ? mancanti() : undefined, occupato: occupato || undefined });
  });
  VXP.on(ID, 'vai', d => {
    const perche = controlla(d);
    VXP.send(ID, 'esito', { id: d.id, perche });
    if (perche) { avvisa(perche); return; }
    opz(() => whoosh());
    const viaggio = () => {
      try {
        load(d.zk);
        if (Zk !== d.zk) return;
        const x = d.x | 0, y = d.y | 0;
        // vicino a chi ha accettato; nella fossa del Colosseo no: si resta nella sala d'attesa
        if (x > 0 && y > 0 && x < N - 1 && y < N - 1 && !(Zk === 'arena' && opz(() => inPit(d.x, d.y)))) {
          const s = nearFree(x, y);
          if (s && WK(M[s[1]][s[0]])) {
            P.px = s[0] + .5; P.py = s[1] + .5; P.path = []; P.tg = null;
            opz(() => { camX = PX(P.px, P.py); camY = PY(P.px, P.py, 10); });
          }
        }
        avvisa('✨ Ti sei teletrasportato da ' + d.da);
      } catch (e) { console.error('[plugin ' + ID + ']', e); }
    };
    try { irisGo(viaggio); } catch (e) { viaggio(); }
  });
  VXP.on(ID, 'richiesta', d => {
    chiudi(); aperta = d.id;
    box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:99;background:rgba(20,22,30,.94);color:#f2eee6;border:1px solid #c9a84a;border-radius:10px;padding:12px 14px;font:14px system-ui,sans-serif;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.5)';
    const t = document.createElement('div'); t.textContent = '✨ ' + d.da + ' vuole teletrasportarsi da te'; t.style.marginBottom = '4px';
    const s = document.createElement('div'); s.style.cssText = 'opacity:.7;font-size:12px;margin-bottom:10px'; s.textContent = 'Scade tra ' + d.sec + ' secondi · /tpaccetta o /tparifiuta';
    const b = (txt, si, bg) => { const e = document.createElement('button'); e.textContent = txt; e.style.cssText = 'margin:0 4px;padding:6px 14px;border-radius:6px;border:0;cursor:pointer;font:600 14px system-ui,sans-serif;color:#fff;background:' + bg; e.onclick = ev => { ev.stopPropagation(); rispondi(si); }; return e; };
    box.append(t, s, b('Accetta', 1, '#3f8a4a'), b('Rifiuta', 0, '#8a3a3a'));
    document.body.appendChild(box); opz(() => tone(660, .08));
  });
  VXP.on(ID, 'chiudi', d => { if (!d || !d.id || d.id === aperta) chiudi(); });
}

module.exports = {
  name: 'Teletrasporto',
  version: '1.3',
  author: 'Voxelia',
  description: '/tpa <nome> per raggiungere un altro eroe, se accetta',
  defaults: {
    scadenzaSec: 60,          // dopo quanti secondi una richiesta senza risposta scade
    attesaSec: 10,            // secondi minimi tra due richieste dello stesso eroe
    // regole scritte a mano, in più di quelle trovate da sole: "sblocco" è la chiave di un cancello aperto da una missione,
    // "storia" il punto della missione del Re, "livello" un livello minimo; { "libera": true } toglie una regola trovata da sola
    regole: {
      cittadella: { storia: 3, testo: 'prima la Corona di Voxel deve essere riforgiata dal Re Aldric' }
    },
    vietate: []               // zone dove non ci si teletrasporta mai, es. ["arena", "cittadella"]
  },

  setup(api) {
    const C = api.config, ID = api.id;
    const richieste = new Map();   // id → { id, da, daNome, a, aNome, timer }
    const verifiche = new Map();   // id → { da, a, timer }  (in attesa della risposta del gioco di chi chiede)
    const ultima = new Map();      // id giocatore → ora dell'ultima richiesta
    const rifiuti = () => { const s = api.store; return s.rifiuti || (s.rifiuti = {}); };   // chi ha spento le richieste
    let n = 0, rottoDetto = false;
    // cancelli scoperti dai giocatori: zona → chiave della missione che la apre
    const cancelli = () => { const s = api.store; return s.cancelli && typeof s.cancelli === 'object' ? s.cancelli : (s.cancelli = {}); };
    const nomeOk = s => typeof s === 'string' && /^[a-z0-9_]{1,24}$/.test(s);
    api.onClient('cancelli', (p, L) => {
      if (!Array.isArray(L)) return;
      const S = cancelli(); let cambiato = false;
      for (const x of L.slice(0, 20)) {
        if (!Array.isArray(x) || !nomeOk(x[0]) || !nomeOk(x[1]) || S[x[0]] === x[1] || Object.keys(S).length >= 200) continue;
        S[x[0]] = x[1]; cambiato = true; api.log('zona chiusa trovata: ' + x[0] + ' (si apre con "' + x[1] + '", vista da ' + p.name + ')');
      }
      if (cambiato) api.save();
    });
    const scad = () => Math.max(10, Math.min(600, C.scadenzaSec | 0 || 60));
    const base = zk => String(zk || '').split('@')[0];
    const nomeZona = zk => ZONE[base(zk)] || (base(zk).startsWith('in_') ? 'un edificio' : base(zk));

    api.client('(' + nelGioco.toString() + ')(' + JSON.stringify(ID) + ');');

    // cerca un eroe della stessa stanza: nome esatto, oppure l'unico che inizia così
    function trova(p, q) {
      q = String(q || '').toLowerCase(); if (!q) return { err: 'Scrivi a chi: /tpa <nome>' };
      const tutti = api.players().filter(o => o.id !== p.id);
      let o = tutti.find(o => o.name.toLowerCase() === q);
      if (!o) { const L = tutti.filter(o => o.name.toLowerCase().startsWith(q)); if (L.length > 1) return { err: 'Più eroi iniziano con "' + q + '": ' + L.map(o => o.name).join(', ') + '. Scrivi il nome intero.' }; o = L[0]; }
      if (!o) return { err: (q === p.name.toLowerCase() ? 'Sei già da te stesso.' : 'Nessun eroe online si chiama "' + q + '".') };
      if (o.room !== p.room) return { err: o.name + ' è in un altro mondo (stanza ' + o.room + '): puoi raggiungere solo chi gioca nella tua stanza.' };
      return { o };
    }
    // problemi che il server vede da solo, senza chiedere al gioco
    function ostacolo(o) {
      if (!o.zone) return o.name + ' sta ancora entrando nel gioco: riprova tra poco.';
      if (CHIUSE.includes(base(o.zone)) || (C.vietate || []).includes(base(o.zone)) || (C.vietate || []).includes(o.zone)) return 'Non ci si può teletrasportare in ' + nomeZona(o.zone) + ', dove si trova ' + o.name + '.';
      return '';
    }
    function togli(r, perA, perDa) {
      if (!richieste.delete(r.id)) return;
      api.cancel(r.timer);
      const a = api.player(r.a), da = api.player(r.da);
      if (a) { a.send('chiudi', { id: r.id }); if (perA) a.tell(perA); }
      if (da && perDa) da.tell(perDa);
    }
    const uscenti = p => [...richieste.values()].find(r => r.da === p.id);
    const entranti = p => [...richieste.values()].filter(r => r.a === p.id);
    function scegli(p, q, cmd) {
      const L = entranti(p); if (!L.length) return { err: 'Non hai richieste di teletrasporto in attesa.' };
      if (!q) return { r: L[L.length - 1] };
      q = q.toLowerCase(); const r = L.find(r => r.daNome.toLowerCase() === q) || L.find(r => r.daNome.toLowerCase().startsWith(q));
      return r ? { r } : { err: 'Nessuna richiesta da "' + q + '". In attesa: ' + L.map(r => r.daNome).join(', ') + ' (/' + cmd + ' <nome>).' };
    }

    api.command('tpa', 'chiedi di teletrasportarti da un eroe: /tpa <nome>', (p, args) => {
      const { o, err } = trova(p, args[0]); if (err) return err;
      const u = uscenti(p); if (u) return 'Hai già chiesto a ' + u.aNome + ': aspetta la risposta o scrivi /tpannulla.';
      if ([...verifiche.values()].some(v => v.da === p.id)) return 'Un momento, sto ancora controllando la richiesta di prima.';
      const att = Math.max(0, C.attesaSec | 0) * 1000 - (Date.now() - (ultima.get(p.id) || 0));
      if (att > 0) return 'Aspetta ancora ' + Math.ceil(att / 1000) + ' secondi prima di una nuova richiesta.';
      if (rifiuti()[o.name.toLowerCase()]) return o.name + ' non accetta richieste di teletrasporto.';
      const ost = ostacolo(o); if (ost) return ost;
      // chiede al gioco di chi parte se può entrare nella zona di arrivo
      const id = ID + (++n);
      verifiche.set(id, { da: p.id, a: o.id, zk: o.zone, timer: api.after(5000, () => { if (verifiche.delete(id)) p.tell('Il tuo gioco non risponde: ricarica la pagina e riprova.'); }) });
      p.send('verifica', { id, zk: o.zone, regole: C.regole, cancelli: cancelli() });
    });

    api.onClient('verifica', (p, d) => {
      const v = d && verifiche.get(d.id); if (!v || v.da !== p.id) return;
      verifiche.delete(d.id); api.cancel(v.timer);
      if (d.rotto && !rottoDetto) { rottoDetto = true; api.log('il gioco non ha più ' + [].concat(d.rotto).join(', ') + ': il teletrasporto va aggiornato per questa versione'); }
      const o = api.player(v.a);
      if (!o || o.room !== p.room) { p.tell('L\'eroe che cercavi non è più nella tua stanza.'); return; }
      if (d.perche) { p.tell((d.rotto || d.occupato ? '' : o.name + ' è in una zona che non puoi raggiungere. ') + String(d.perche).slice(0, 200)); return; }
      if (uscenti(p)) return;
      ultima.set(p.id, Date.now());
      const r = { id: d.id, da: p.id, daNome: p.name, a: o.id, aNome: o.name };
      r.timer = api.after(scad() * 1000, () => togli(r, 'La richiesta di ' + p.name + ' è scaduta.', o.name + ' non ha risposto: la richiesta di teletrasporto è scaduta.'));
      richieste.set(r.id, r);
      o.tell(p.name + ' vuole teletrasportarsi da te. /tpaccetta per accettare, /tparifiuta per rifiutare (scade tra ' + scad() + ' s).');
      o.send('richiesta', { id: r.id, da: p.name, sec: scad() });
      p.tell('Richiesta inviata a ' + o.name + '. Scade tra ' + scad() + ' secondi; /tpannulla per ritirarla.');
    });

    function accetta(o, r) {
      const p = api.player(r.da);
      if (!p || p.room !== o.room) { togli(r, r.daNome + ' non è più nella tua stanza.'); return; }
      const ost = ostacolo(o); if (ost) { togli(r, ost, ost); return; }
      togli(r, 'Hai accettato: ' + r.daNome + ' sta arrivando.');
      p.send('vai', { id: r.id, zk: o.zone, x: o.x, y: o.y, da: o.name, regole: C.regole, cancelli: cancelli() });
      verifiche.set(r.id, { arrivo: 1, da: p.id, a: o.id, timer: api.after(5000, () => verifiche.delete(r.id)) });
    }
    api.onClient('esito', (p, d) => {
      const v = d && verifiche.get(d.id); if (!v || !v.arrivo || v.da !== p.id) return;
      verifiche.delete(d.id); api.cancel(v.timer);
      const o = api.player(v.a);
      if (d.perche) { p.tell(String(d.perche).slice(0, 200)); if (o) o.tell(p.name + ' non può raggiungerti: ' + String(d.perche).slice(0, 160)); }
      else api.log(p.name + ' si è teletrasportato da ' + (o ? o.name : '?'));
    });

    api.command('tpaccetta', 'accetta una richiesta di teletrasporto', (p, args) => { const { r, err } = scegli(p, args[0], 'tpaccetta'); if (err) return err; accetta(p, r); });
    api.command('tparifiuta', 'rifiuta una richiesta di teletrasporto', (p, args) => {
      const { r, err } = scegli(p, args[0], 'tparifiuta'); if (err) return err;
      togli(r, 'Hai rifiutato la richiesta di ' + r.daNome + '.', p.name + ' ha rifiutato la tua richiesta di teletrasporto.');
    });
    api.command('tpannulla', 'ritira la tua richiesta di teletrasporto', p => {
      const r = uscenti(p); if (!r) return 'Non hai richieste in attesa.';
      togli(r, r.daNome + ' ha ritirato la richiesta di teletrasporto.', 'Richiesta a ' + r.aNome + ' ritirata.');
    });
    api.command('tpblocco', 'non ricevere più richieste di teletrasporto (riscrivilo per riattivarle)', p => {
      const s = rifiuti(), k = p.name.toLowerCase();
      if (s[k]) { delete s[k]; api.save(); return 'Ora puoi di nuovo ricevere richieste di teletrasporto.'; }
      s[k] = 1; api.save();
      for (const r of entranti(p)) togli(r, '', p.name + ' non accetta richieste di teletrasporto.');
      return 'Non riceverai più richieste di teletrasporto. Riscrivi /tpblocco per riattivarle.';
    });
    // i pulsanti nel gioco
    api.onClient('risposta', (p, d) => {
      const r = d && richieste.get(d.id); if (!r || r.a !== p.id) return;
      if (d.si) accetta(p, r);
      else togli(r, 'Hai rifiutato la richiesta di ' + r.daNome + '.', p.name + ' ha rifiutato la tua richiesta di teletrasporto.');
    });

    api.on('leave', p => {
      ultima.delete(p.id);
      for (const r of [...richieste.values()]) {
        if (r.da === p.id) togli(r, r.daNome + ' è uscito: richiesta annullata.');
        else if (r.a === p.id) togli(r, '', r.aNome + ' è uscito: richiesta annullata.');
      }
    });
  },

  stop(api) { for (const p of api.players()) p.send('chiudi', {}); }
};
