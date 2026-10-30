// Server di Voxelia 7.50: serve il gioco e fa da ponte WebSocket tra i giocatori.
// Gestisce anche: arena PvP (vittorie verificate), punti arena e negozio, classifica, scambi,
// rigenerazione condivisa dei dungeon, il PANNELLO ADMIN (http://localhost:3000/admin)
// i PLUGIN: all'avvio carica i moduli della cartella plugins/ (la crea se manca; istruzioni in plugins/LEGGIMI.md)
// e i MONDI PUBBLICATI con Voxelia Studio (browser dei mondi, recensioni, commenti): cartella mondi/ (o MONDI_DIR).
// Nessuna dipendenza: basta Node.js 16+.   Avvio:  node server.js   (porta 3000, o PORT=xxxx)
// HTTPS facoltativo (serve al Meta Quest, che offre la realtà virtuale solo da indirizzi sicuri):
// TLS_CERT=cert.pem TLS_KEY=key.pem node server.js  -> https:// e WebSocket wss:// sulla stessa porta.
// All'avvio chiede la password del pannello admin (oppure la legge da ADMIN_PASSWORD).
// I dati (classifica, punti arena, cicli dei dungeon, impostazioni, ban) vengono salvati in voxelia-data.json.
const http = require('http'), https = require('https'), fs = require('fs'), path = require('path'), crypto = require('crypto'), os = require('os');
const VER = '7.50';
const PORT = process.env.PORT || 3000;
// certificato e chiave in formato PEM: se ci sono entrambi il server parla solo https/wss
const TLS = (() => {
  const c = process.env.TLS_CERT, k = process.env.TLS_KEY;
  if (!c && !k) return null;
  if (!c || !k) { console.error('Per HTTPS servono sia TLS_CERT sia TLS_KEY'); process.exit(1); }
  try { return { cert: fs.readFileSync(c), key: fs.readFileSync(k) }; }
  catch (e) { console.error('Certificato HTTPS non leggibile: ' + e.message); process.exit(1); }
})();
const PROTO = TLS ? 'https' : 'http';
const DATA = process.env.DATA_FILE || path.join(__dirname, 'voxelia-data.json');
// il gioco può chiamarsi voxelia.html oppure voxelia_v6.3.html ecc.: si usa il file voxelia*.html più recente
const gameFile = () => { try { const f = fs.readdirSync(__dirname).filter(n => /^voxelia.*\.html$/i.test(n)).map(n => [n, fs.statSync(path.join(__dirname, n)).mtimeMs]).sort((a, b) => b[1] - a[1]); return f.length ? f[0][0] : 'voxelia.html'; } catch (e) { return 'voxelia.html'; } };
const page = () => { const h = fs.readFileSync(path.join(__dirname, gameFile()), 'utf8').replace('<!--WS-->', '<script>window.GAME_WS=1</script>'), i = h.lastIndexOf('</body>'), sc = plugScripts(); return i < 0 || !sc ? h : h.slice(0, i) + sc + h.slice(i); };
const adminPage = () => fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8');

// Costi del negozio dell'arena (devono coincidere con la tabella AR nel gioco)
const AR_COST = [40, 25, 35, 25, 120, 150, 90, 90];
const DUNGEONS = ['tana', 'cripta', 'piramide', 'cristallo', 'fucina', 'abisso', 'cittadella', 'tempio48'];

/* ---------- dati persistenti ---------- */
const CFG_DEF = { maxp: 20, lock: 0, pvp: 1, trade: 1, chat: 1, motd: '', xpm: 1, gm: 1, mondi: 1 };
let DB = { ar: {}, runs: {}, cfg: Object.assign({}, CFG_DEF), bans: [], mutes: [], plug: {}, plugOff: [] };
try {
  const j = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  if (j && typeof j === 'object') DB = { ar: j.ar || {}, runs: j.runs || {}, cfg: Object.assign({}, CFG_DEF, j.cfg || {}), bans: Array.isArray(j.bans) ? j.bans : [], mutes: Array.isArray(j.mutes) ? j.mutes : [], clock: j.clock,
    plug: j.plug && typeof j.plug === 'object' ? j.plug : {}, plugOff: Array.isArray(j.plugOff) ? j.plugOff : [] };
} catch (e) {}
const CFG = DB.cfg;
// orologio del mondo: minuti di gioco = base + secondi reali passati da t0 (un giorno di gioco dura 24 minuti; si parte dal giorno 1 alle 8:00)
if (!DB.clock || !isFinite(+DB.clock.base) || !isFinite(+DB.clock.t0)) DB.clock = { base: 480, t0: Date.now() };
const gameMin = () => DB.clock.base + (Date.now() - DB.clock.t0) / 1000;
const clockTxt = () => { const m = Math.floor(gameMin()), d = Math.floor(m / 1440) + 1, h = Math.floor((m % 1440) / 60), mi = m % 60; return { day: d, time: String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0'), min: m }; };
let dirty = false, lastSave = 0;
const touch = () => { dirty = true; };
function flush(sync) {
  if (!dirty) return; dirty = false;
  const s = JSON.stringify(DB);
  if (sync) { try { fs.writeFileSync(DATA, s); lastSave = Date.now(); } catch (e) { console.error('Salvataggio fallito:', e.message); } return; }
  fs.writeFile(DATA + '.tmp', s, e => { if (!e) fs.rename(DATA + '.tmp', DATA, () => { lastSave = Date.now(); }); else console.error('Salvataggio fallito:', e.message); });
}
setInterval(flush, 3000);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { unloadPlugins(); } catch (e) {} dirty = true; flush(true); process.exit(0); });

const str = (v, n) => (typeof v === 'string' ? v : '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const int = (v, a, b) => Math.max(a, Math.min(b, Math.round(+v || 0)));
const key = n => String(n || '').toLowerCase();
function stats(name) { const k = key(name); return DB.ar[k] || (DB.ar[k] = { n: name, w: 0, l: 0, pts: 0, ap: 0 }); }
const pub = s => ({ w: s.w, l: s.l, pts: s.pts, ap: s.ap });

/* ---------- registro eventi e cronologia chat (in memoria) ---------- */
const LOG = [], CHAT = []; let logId = 0, chatId = 0;
const ST = { start: Date.now(), total: 0, peak: 0, msgs: 0 };
function log(k, s) { LOG.push({ id: ++logId, t: Date.now(), k, s }); if (LOG.length > 400) LOG.shift(); if (k === 'admin' || k === 'ban' || k === 'kick') console.log('[' + k + '] ' + s); }
function chatPush(code, n, s, z, adm) { CHAT.push({ id: ++chatId, t: Date.now(), code, n, s, z, adm: adm ? 1 : 0 }); if (CHAT.length > 300) CHAT.shift(); }

/* ---------- password del pannello admin ---------- */
let ADM = null;
function setPw(pw) { const salt = crypto.randomBytes(16); ADM = { salt, hash: crypto.scryptSync(pw, salt, 32) }; }
function checkPw(pw) { if (!ADM || typeof pw !== 'string' || pw.length > 200) return false; const h = crypto.scryptSync(pw, ADM.salt, 32); return crypto.timingSafeEqual(h, ADM.hash); }
const SESS = new Map(), FAILS = new Map();
// 7.43: il pannello sviluppatore del gioco, quando il gioco arriva da questo server, si sblocca solo con la password admin,
// controllata qui. Chi la sa riceve un gettone (12 ore, solo in memoria) con cui il server riconosce i suoi regali.
const DEVT = new Map();
const devOk = tok => { if (typeof tok !== 'string' || tok.length > 64) return null; const d = DEVT.get(tok); if (!d) return null; if (d.exp < Date.now()) { DEVT.delete(tok); return null; } return d; };
function devGrace(n, ms, ip) { const G = globalThis.VoxeliaGuardiano; if (!n || !G) return; try { if (G.sviluppatore) G.sviluppatore(n, ms / 1000, ip); else G.grazia(n, Math.min(600, ms / 1000)); } catch (e) {} }
// Legge una riga dal terminale mostrando * al posto dei caratteri (i caratteri in più restano per la riga dopo)
let pend = '';
function askHidden(q) {
  return new Promise(res => {
    const si = process.stdin; process.stdout.write(q); let s = '';
    const done = rest => { si.removeListener('data', on); si.setRawMode(false); si.pause(); pend = rest; process.stdout.write('\n'); res(s); };
    const on = ch => {
      for (let i = 0; i < ch.length; i++) {
        const c = ch[i];
        if (c === '\r' || c === '\n') { let k = i + 1; if (c === '\r' && ch[k] === '\n') k++; return done(ch.slice(k)); }
        if (c === '\u0003') { process.stdout.write('\n'); process.exit(0); }
        if (c === '\u007f' || c === '\b') { if (s.length) { s = s.slice(0, -1); process.stdout.write('\b \b'); } continue; }
        if (c >= ' ') { s += c; process.stdout.write('*'); }
      }
    };
    si.setRawMode(true); si.setEncoding('utf8'); si.on('data', on); si.resume();
    if (pend) { const p = pend; pend = ''; on(p); }
  });
}
async function choosePassword() {
  if (process.env.ADMIN_PASSWORD) { console.log('Password del pannello admin letta da ADMIN_PASSWORD.'); return process.env.ADMIN_PASSWORD; }
  if (!process.stdin.isTTY) {
    const p = crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, 'x');
    console.log('Nessun terminale interattivo: password del pannello admin generata a caso → ' + p);
    console.log('(per sceglierla tu, avvia con la variabile ADMIN_PASSWORD)');
    return p;
  }
  console.log('');
  const t = '   VOXELIA ' + VER + '  ·  Pannello Admin';
  console.log('  ╔' + '═'.repeat(46) + '╗');
  console.log('  ║' + t.padEnd(46) + '║');
  console.log('  ╚' + '═'.repeat(46) + '╝');
  console.log('  Scegli la password per il pannello admin.');
  console.log('  Ti servirà per entrare su ' + PROTO + '://localhost:' + PORT + '/admin');
  console.log('');
  for (;;) {
    const a = await askHidden('  Password (almeno 6 caratteri): ');
    if (a.length < 6) { console.log('  Troppo corta, riprova.\n'); continue; }
    const b = await askHidden('  Ripeti la password: ');
    if (a !== b) { console.log('  Le password non coincidono, riprova.\n'); continue; }
    console.log('  Password impostata.\n');
    return a;
  }
}

/* ---------- HTTP: gioco e pannello admin ---------- */
const ipOf = req => String(req.headers['cf-connecting-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress || '').trim().replace(/^::ffff:/, '');
const cookie = (req, k) => { const m = (req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + k + '=([^;]+)')); return m ? m[1] : ''; };
function authed(req) { const t = cookie(req, 'vxadm'), e = t && SESS.get(t); if (!e) return false; if (e < Date.now()) { SESS.delete(t); return false; } return true; }
const json = (res, code, o, h) => { res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, h || {})); res.end(JSON.stringify(o)); };
function body(req, cb) { let d = ''; req.on('data', x => { d += x; if (d.length > 20000) req.destroy(); }); req.on('end', () => { let j = {}; try { j = JSON.parse(d || '{}'); } catch (e) {} cb(j && typeof j === 'object' ? j : {}); }); }

/* ---------- 7.43: le versioni precedenti del gioco, da giocare solo da soli ----------
   Le build di releases/ si aprono da /versioni/<versione>/. Il server le serve senza il collegamento al multigiocatore
   (niente window.GAME_WS) e con Content-Security-Policy connect-src 'none': la pagina non può aprire connessioni di nessun
   tipo, quindi niente chat, arena, scambi, mondi della community né altro di online. I salvataggi di ogni versione vecchia
   finiscono in una parte separata del localStorage ("voxelia-v<versione>:..."), così non toccano quelli della versione attuale. */
const REL_DIR = path.join(__dirname, 'releases');
const relCmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
let REL = null, RELT = 0;
function relList() {
  if (REL && Date.now() - RELT < 60000) return REL;
  const L = [];
  try {
    const info = {}; let idx = ''; try { idx = fs.readFileSync(path.join(REL_DIR, 'LEGGIMI.md'), 'utf8'); } catch (e) {}
    for (const m of idx.matchAll(/^\| \[([0-9.]+)\]\([^)]*\) \| ([^|]*) \| ([^|]*) \|/gm)) info[m[1]] = { d: m[2].trim(), t: m[3].trim() };
    for (const f of fs.readdirSync(REL_DIR)) {
      const m = f.match(/^voxelia_v(\d+(?:\.\d+){1,2})\.html$/); if (!m || m[1] === VER) continue;
      L.push({ v: m[1], t: (info[m[1]] || {}).t || '', d: (info[m[1]] || {}).d || '' });
    }
    L.sort((a, b) => relCmp(b.v, a.v));
  } catch (e) {}
  REL = L; RELT = Date.now(); return L;
}
function relPage(v) {
  if (!relList().some(o => o.v === v)) return null;
  let h; try { h = fs.readFileSync(path.join(REL_DIR, 'voxelia_v' + v + '.html'), 'utf8'); } catch (e) { return null; }
  const P = JSON.stringify('voxelia-v' + v + ':');
  // prima di ogni altro script: il localStorage della versione vecchia è una sua parte separata di quello vero
  const shim = '<script>(function(){var R,P=' + P + ';try{R=window.localStorage}catch(e){return}function ks(){var a=[];for(var j=0;j<R.length;j++){var k=R.key(j);if(k&&k.indexOf(P)===0)a.push(k)}return a}'
    + 'var S={getItem:function(k){return R.getItem(P+k)},setItem:function(k,x){R.setItem(P+k,String(x))},removeItem:function(k){R.removeItem(P+k)},key:function(i){var a=ks();return i<a.length?a[i].slice(P.length):null},clear:function(){ks().forEach(function(k){R.removeItem(k)})}};'
    + 'Object.defineProperty(S,"length",{get:function(){return ks().length}});var ok=false;try{Object.defineProperty(window,"localStorage",{configurable:true,get:function(){return S}});ok=window.localStorage===S}catch(e){}'
    + 'if(!ok){window.VXOLD_BLOCK=1;try{window.stop()}catch(e){}document.documentElement.innerHTML="<body style=\\"font:16px sans-serif;padding:20px\\">Questo browser non permette di separare i salvataggi: per non rovinare la tua partita, le versioni vecchie qui non si aprono. <a href=\\"/\\">Torna a Voxelia</a></body>";throw new Error("voxelia: salvataggi non separabili")}})()</script>';
  // in fondo: la fascia della versione vecchia e il codice stanza spento
  const bar = '<script>(function(){if(window.VXOLD_BLOCK)return;function go(){var r=document.getElementById("rc");if(r){r.value="";r.disabled=true;r.placeholder="Solo in singolo";r.title="Le versioni vecchie si giocano solo da soli"}'
    + 'var b=document.createElement("div");b.id="vxold";b.innerHTML="Voxelia ' + v + ' · versione vecchia, solo in singolo · <a href=\\"/\\">Torna alla versione attuale</a>";'
    + 'b.style.cssText="position:fixed;left:50%;top:max(6px,env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:2147483000;background:rgba(10,12,24,.88);color:#ffe7a8;font:12px/1.4 Georgia,serif;padding:4px 12px;border:1px solid #f5b94266;border-radius:12px;pointer-events:auto;max-width:92vw;text-align:center";'
    + 'var a=b.querySelector("a");a.style.color="#9fd0ff";document.body.appendChild(b)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go()})()</script>';
  const m = h.match(/<meta charset=[^>]*>/i), i = m ? h.indexOf(m[0]) + m[0].length : (h.indexOf('<head>') + 6);
  h = h.slice(0, i) + shim + h.slice(i);
  const j = h.lastIndexOf('</body>'); h = j < 0 ? h + bar : h.slice(0, j) + bar + h.slice(j);
  return h;
}

const srv = (TLS ? https.createServer.bind(null, TLS) : http.createServer)((req, res) => {
  const u = req.url.split('?')[0];
  if (u === '/' || u === '/index.html') {
    try { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(page()); }
    catch (e) { res.writeHead(500); res.end('file del gioco (voxelia*.html) non trovato: mettilo nella stessa cartella di server.js'); }
    return;
  }
  if (u === '/versioni' || u === '/versioni/') return json(res, 200, { attuale: VER, versioni: relList() });
  { const m = u.match(/^\/versioni\/(\d+(?:\.\d+){1,2})\/?$/); if (m) {
    if (!u.endsWith('/')) { res.writeHead(301, { Location: '/versioni/' + m[1] + '/' }); res.end(); return; }
    const h = relPage(m[1]); if (!h) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Versione non trovata'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'Content-Security-Policy': "connect-src 'none'; form-action 'none'; base-uri 'none'", 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'no-referrer' });
    res.end(h); return;
  } }
  if (u === '/admin' || u === '/admin/') {
    try { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY' }); res.end(adminPage()); }
    catch (e) { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('admin.html non trovato: mettilo nella stessa cartella di server.js'); }
    return;
  }
  if (u.startsWith('/admin/')) return adminApi(req, res, u);
  if (u.startsWith('/plugins/')) return plugRoute(req, res, u);
  if (u === '/api/mondi' || u.startsWith('/api/mondi/')) return mondiApi(req, res, u);
  res.writeHead(404); res.end('Non trovato');
});

function adminApi(req, res, u) {
  const ip = ipOf(req);
  if (req.method === 'POST' && req.headers['x-voxelia'] !== '1') return json(res, 403, { err: 'Richiesta non valida' });
  if (u === '/admin/login' && req.method === 'POST') {
    const f = FAILS.get(ip) || { n: 0, until: 0 };
    if (f.until > Date.now()) return json(res, 429, { err: 'Troppi tentativi: riprova tra ' + Math.ceil((f.until - Date.now()) / 1000) + ' secondi' });
    return body(req, j => {
      if (!checkPw(j.pw)) {
        f.n++; if (f.n >= 5) { f.until = Date.now() + 60000 * Math.min(10, f.n - 4); }
        FAILS.set(ip, f); log('admin', 'Accesso al pannello fallito da ' + ip);
        return json(res, 401, { err: 'Password errata' });
      }
      FAILS.delete(ip);
      const t = crypto.randomBytes(24).toString('hex'); SESS.set(t, Date.now() + 12 * 3600e3);
      log('admin', 'Accesso al pannello da ' + ip);
      const sec = TLS || (req.headers['x-forwarded-proto'] || '').includes('https') ? '; Secure' : '';
      json(res, 200, { ok: 1 }, { 'Set-Cookie': 'vxadm=' + t + '; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200' + sec });
    });
  }
  if (!authed(req)) return json(res, 401, { err: 'Accesso richiesto' });
  if (u === '/admin/logout' && req.method === 'POST') { SESS.delete(cookie(req, 'vxadm')); return json(res, 200, { ok: 1 }, { 'Set-Cookie': 'vxadm=; Path=/; Max-Age=0' }); }
  if (u === '/admin/api/state') return json(res, 200, state());
  if (u === '/admin/api/mondi') return json(res, 200, mdAdminState());
  if (u === '/admin/api/backup') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="voxelia-backup-' + new Date().toISOString().slice(0, 10) + '.json"' });
    return res.end(JSON.stringify(DB, null, 1));
  }
  if (u === '/admin/api/act' && req.method === 'POST') return body(req, j => { let r; try { r = adminAct(j, req); } catch (e) { r = { err: 'Errore: ' + e.message }; } json(res, r.err ? 400 : 200, r); });
  json(res, 404, { err: 'Non trovato' });
}

/* ---------- MONDI PUBBLICATI (7.6): il browser dei mondi di Voxelia Studio ----------
   I mondi creati con l'editor si pubblicano sul server: chiunque giochi su questo server li trova nel browser del gioco,
   li gioca, li recensisce con le stelle e li commenta. Tutto sta nella cartella mondi/ accanto a server.js
   (o in MONDI_DIR): indice.json con schede, recensioni e commenti, file/ con i mondi, media/ con immagini e video.
   Nessun account: ogni browser ha una chiave segreta casuale (la manda nell'intestazione x-voxelia-key);
   il server ne conserva solo un'impronta. Il nome da autore si "prenota" con la propria chiave. */
const MD_DIR = process.env.MONDI_DIR ? path.resolve(process.env.MONDI_DIR) : path.join(__dirname, 'mondi');
const MD_FILE = path.join(MD_DIR, 'file'), MD_MEDIA = path.join(MD_DIR, 'media'), MD_IDX = path.join(MD_DIR, 'indice.json');
const MD_TAGS = ['Avventura', 'Storia', 'Dungeon', 'Esplorazione', 'Rompicapo', 'Combattimento', 'Arena', 'Mistero', 'Horror', 'Divertente', 'Rilassante', 'Breve', 'Lungo', 'Per tutti'];
const MD_LIM = { world: 4 << 20, img: 3 << 20, vid: 12 << 20, imgs: 8, perUser: 40, userBytes: 250 << 20, comments: 600, ev: 4000 };
let MD = { w: {}, u: {}, names: {}, media: {}, rep: [] };
try { fs.mkdirSync(MD_FILE, { recursive: true }); fs.mkdirSync(MD_MEDIA, { recursive: true }); } catch (e) { console.error('Cartella dei mondi non creata:', e.message); }
try { const j = JSON.parse(fs.readFileSync(MD_IDX, 'utf8')); if (j && typeof j === 'object') for (const k of ['w', 'u', 'names', 'media']) if (j[k] && typeof j[k] === 'object') MD[k] = j[k]; if (Array.isArray(j.rep)) MD.rep = j.rep; } catch (e) {}
let mdDirty = false;
const mdTouch = () => { mdDirty = true; };
function mdFlush(sync) {
  if (!mdDirty) return; mdDirty = false; const s = JSON.stringify(MD);
  if (sync) { try { fs.writeFileSync(MD_IDX, s); } catch (e) { console.error('Salvataggio dei mondi fallito:', e.message); } return; }
  fs.writeFile(MD_IDX + '.tmp', s, e => { if (!e) fs.rename(MD_IDX + '.tmp', MD_IDX, () => {}); else console.error('Salvataggio dei mondi fallito:', e.message); });
}
setInterval(mdFlush, 3000);
process.on('exit', () => mdFlush(true));   // l'arresto (Ctrl+C) passa da process.exit: si salva l'indice se è cambiato

const mdUid = req => { const k = String(req.headers['x-voxelia-key'] || ''); return /^[0-9a-f]{32,64}$/.test(k) ? crypto.createHash('sha256').update('vx:' + k).digest('hex').slice(0, 20) : ''; };
const mdName = uid => (MD.u[uid] && MD.u[uid].n) || 'Anonimo';
const mdNew = p => p + crypto.randomBytes(6).toString('hex');
// testo libero (descrizioni, recensioni, commenti): restano gli a capo e anche < e >, perché il gioco li mostra sempre come testo
const mdTxt = (v, n) => (typeof v === 'string' ? v : '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
const mdBanned = (req, uid) => { const ip = ipOf(req), u = MD.u[uid]; return (u && u.blk) || DB.bans.some(b => (b.ip && b.ip === ip) || (u && b.k && b.k === key(u.n))); };
// limiti di frequenza in memoria: chiave → istanti recenti
const MD_RL = new Map();
function mdRate(k, n, ms) { const now = Date.now(), L = (MD_RL.get(k) || []).filter(t => now - t < ms); if (L.length >= n) { MD_RL.set(k, L); return false; } L.push(now); MD_RL.set(k, L); return true; }
// visite e partite contate una volta per persona in un certo intervallo
const MD_SEEN = new Map();
function mdOnce(k, ms) { const now = Date.now(), t = MD_SEEN.get(k); if (t && now - t < ms) return false; MD_SEEN.set(k, now); return true; }
setInterval(() => { const now = Date.now(); for (const [k, t] of MD_SEEN) if (now - t > 864e5) MD_SEEN.delete(k); for (const [k, L] of MD_RL) if (!L.length || now - L[L.length - 1] > 864e5) MD_RL.delete(k); }, 3600e3);

/* ---- tendenza: ogni azione recente vale dei punti che si dimezzano ogni 24 ore ---- */
const MD_EVW = { v: .25, p: 1, d: 2, r: 2, c: .6, f: 1.5 };
function mdEvent(w, k, x) { const now = Date.now(); (w.ev || (w.ev = [])).push([now, k, x || 0]); while (w.ev.length && (now - w.ev[0][0] > 72 * 3600e3 || w.ev.length > MD_LIM.ev)) w.ev.shift(); mdTouch(); }
function mdHot(w) { const now = Date.now(); let s = 0, p = 0, r = 0; for (const [t, k, x] of w.ev || []) { const age = now - t; if (age > 72 * 3600e3) continue; s += (MD_EVW[k] || 0) * (k === 'r' ? Math.max(.25, 1 + (x - 3) * .5) : 1) * Math.pow(.5, age / 864e5); if (age < 48 * 3600e3) { if (k === 'p') p++; else if (k === 'r') r++; } } return { s, p, r }; }
const MD_FEAT_MIN = 6;
function mdRating(w) { const R = Object.values(w.r || {}); const n = R.length, dist = [0, 0, 0, 0, 0]; let sum = 0; for (const q of R) { sum += q.s; dist[q.s - 1]++; } return { avg: n ? Math.round(sum / n * 10) / 10 : 0, n, dist }; }
const mdUrl = id => { const m = MD.media[id]; return m ? '/api/mondi/media/' + id + '.' + m.ext : null; };
function mdCard(w) {
  const h = mdHot(w), img = (w.media || []).filter(id => MD.media[id] && MD.media[id].k === 'img'), vid = (w.media || []).find(id => MD.media[id] && MD.media[id].k === 'vid');
  const cov = w.cover && MD.media[w.cover] && MD.media[w.cover].k === 'img' ? w.cover : img[0];
  return { id: w.id, n: w.n, a: mdName(w.uid), au: w.uid, tags: w.tags || [], cover: cov ? mdUrl(cov) : null, vid: vid ? mdUrl(vid) : null, nimg: img.length,
    st: { v: w.st.v | 0, p: w.st.p | 0, pu: Object.keys(w.pl || {}).length, d: Object.keys(w.dn || {}).length, f: (w.fav || []).length, c: (w.c || []).length },
    r: mdRating(w), t0: w.t0, t1: w.t1, maps: w.maps | 0, npcs: w.npcs | 0, quests: w.quests | 0, remix: w.remix ? 1 : 0, pin: w.pin ? 1 : 0, hot: Math.round(h.s * 10) / 10, hp: h.p, hr: h.r };
}
const mdList = () => Object.values(MD.w).filter(w => !w.hide);
function mdSort(L, ord) {
  const C = L.map(mdCard);
  if (ord === 'nuovi') C.sort((a, b) => b.t0 - a.t0);
  else if (ord === 'aggiornati') C.sort((a, b) => b.t1 - a.t1);
  else if (ord === 'top') C.sort((a, b) => (b.r.n ? (b.r.avg * b.r.n + 3 * 2) / (b.r.n + 2) : 0) - (a.r.n ? (a.r.avg * a.r.n + 3 * 2) / (a.r.n + 2) : 0) || b.r.n - a.r.n);   // media "prudente": poche recensioni contano meno
  else if (ord === 'giocati') C.sort((a, b) => b.st.p - a.st.p || b.st.pu - a.st.pu);
  else if (ord === 'preferiti') C.sort((a, b) => b.st.f - a.st.f);
  else C.sort((a, b) => b.hot - a.hot || b.t0 - a.t0);
  return C;
}
function mdFeatured() {
  const C = mdSort(mdList(), 'trend'), F = C.filter(c => c.pin).concat(C.filter(c => !c.pin && c.hot >= MD_FEAT_MIN && (c.hp + c.hr) >= 3));
  return F.slice(0, 6).map(c => Object.assign(c, { why: c.pin ? 'Scelto dal server' : '🔥 ' + [c.hp ? c.hp + (c.hp === 1 ? ' partita' : ' partite') : '', c.hr ? c.hr + (c.hr === 1 ? ' recensione' : ' recensioni') : ''].filter(Boolean).join(' e ') + ' nelle ultime 48 ore' }));
}
function mdDetail(w, uid) {
  const c = mdCard(w);
  c.d = w.d || ''; c.media = (w.media || []).filter(id => MD.media[id]).map(id => ({ id, k: MD.media[id].k, url: mdUrl(id) }));
  c.rev = Object.entries(w.r || {}).map(([u, q]) => ({ u, n: mdName(u), s: q.s, tx: q.tx || '', t: q.t, au: u === w.uid ? 1 : 0 })).sort((a, b) => b.t - a.t).slice(0, 80);
  c.com = (w.c || []).slice(-150).reverse().map(q => ({ id: q.id, u: q.u, n: mdName(q.u), tx: q.tx, t: q.t, re: q.re || '', au: q.u === w.uid ? 1 : 0 }));
  c.me = { uid: uid || '', own: uid && uid === w.uid ? 1 : 0, rev: uid && w.r && w.r[uid] ? { s: w.r[uid].s, tx: w.r[uid].tx || '' } : null, fav: uid && (w.fav || []).includes(uid) ? 1 : 0, done: uid && w.dn && w.dn[uid] ? 1 : 0 };
  c.wid = c.me.own ? w.wid : undefined; c.ver = w.ver | 0;
  return c;
}
function mdDelMedia(id) { const m = MD.media[id]; if (!m) return; try { fs.unlinkSync(path.join(MD_MEDIA, id + '.' + m.ext)); } catch (e) {} delete MD.media[id]; mdTouch(); }
function mdDelWorld(id) { const w = MD.w[id]; if (!w) return; for (const m of w.media || []) mdDelMedia(m); try { fs.unlinkSync(path.join(MD_FILE, id + '.json')); } catch (e) {} delete MD.w[id]; MD.rep = MD.rep.filter(r => r.w !== id); mdTouch(); }
// media caricati ma mai usati in una scheda: si cancellano dopo un giorno
setInterval(() => { const now = Date.now(); for (const [id, m] of Object.entries(MD.media)) if (!m.w && now - m.t > 864e5) mdDelMedia(id); }, 3600e3);
const mdUserBytes = uid => Object.values(MD.media).filter(m => m.uid === uid).reduce((a, m) => a + (m.size || 0), 0);
// formato vero del file, dai primi byte (non ci si fida del nome né del tipo dichiarato)
function mdSniff(b) {
  if (b.length < 16) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { k: 'img', ext: 'jpg', ct: 'image/jpeg' };
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { k: 'img', ext: 'png', ct: 'image/png' };
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return { k: 'img', ext: 'webp', ct: 'image/webp' };
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { k: 'vid', ext: 'webm', ct: 'video/webm' };
  if (b.toString('latin1', 4, 8) === 'ftyp') return { k: 'vid', ext: 'mp4', ct: 'video/mp4' };
  return null;
}
const MD_CT = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', webm: 'video/webm', mp4: 'video/mp4' };
function bodyRaw(req, lim, cb) { const parts = []; let n = 0, over = false; req.on('data', x => { if (over) return; n += x.length; if (n > lim) { over = true; cb(null, 'troppo grande'); req.resume(); return; } parts.push(x); }); req.on('end', () => { if (!over) cb(Buffer.concat(parts)); }); req.on('error', () => { if (!over) { over = true; cb(null, 'errore'); } }); }
function bodyBig(req, lim, cb) { bodyRaw(req, lim, (b, e) => { if (!b) return cb(null, e); let j = null; try { j = JSON.parse(b.toString('utf8')); } catch (x) {} cb(j && typeof j === 'object' ? j : null, j ? '' : 'dati non validi'); }); }
// conteggi di un mondo pubblicato (per la scheda)
function mdCount(o) { const n = k => (o && o[k] && typeof o[k] === 'object') ? Object.keys(o[k]).length : 0; return { maps: n('maps'), npcs: n('npcs'), quests: n('quests') }; }
function mdServeMedia(req, res, file) {
  const m = /^([a-z0-9]{6,20})\.(jpg|png|webp|webm|mp4)$/.exec(file), rec = m && MD.media[m[1]];
  if (!rec || rec.ext !== m[2]) { res.writeHead(404); return res.end(); }
  const p = path.join(MD_MEDIA, file); let st; try { st = fs.statSync(p); } catch (e) { res.writeHead(404); return res.end(); }
  const H = { 'Content-Type': MD_CT[rec.ext], 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=604800, immutable', 'Accept-Ranges': 'bytes', 'Content-Security-Policy': "default-src 'none'" };
  const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (r) { let a = r[1] === '' ? st.size - (+r[2] || 0) : +r[1], b = r[1] !== '' && r[2] !== '' ? +r[2] : st.size - 1; a = Math.max(0, a); b = Math.min(st.size - 1, b);
    if (a > b) { res.writeHead(416, { 'Content-Range': 'bytes */' + st.size }); return res.end(); }
    res.writeHead(206, Object.assign(H, { 'Content-Range': 'bytes ' + a + '-' + b + '/' + st.size, 'Content-Length': b - a + 1 })); return fs.createReadStream(p, { start: a, end: b }).pipe(res); }
  res.writeHead(200, Object.assign(H, { 'Content-Length': st.size })); fs.createReadStream(p).pipe(res);
}
const mdTags = t => (Array.isArray(t) ? t : []).filter(x => MD_TAGS.includes(x)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
function mondiApi(req, res, u) {
  const P = req.method === 'POST', uid = mdUid(req), ip = ipOf(req), q = {};
  try { for (const [k, v] of new URL(req.url, 'http://x').searchParams) q[k] = v; } catch (e) {}
  if (P && req.headers['x-voxelia'] !== '1') return json(res, 403, { err: 'Richiesta non valida' });
  const seg = u.slice('/api/mondi'.length).split('/').filter(Boolean);
  if (!P && seg[0] === 'media' && seg[1]) return mdServeMedia(req, res, seg[1]);
  const open = CFG.mondi !== 0;
  // chi vuole scrivere deve avere una chiave, un nome da autore e non essere bandito
  const need = (name) => { if (!uid) return 'Manca la chiave del browser: ricarica il gioco'; if (mdBanned(req, uid)) return 'Non puoi pubblicare né scrivere su questo server'; if (name && !(MD.u[uid] && MD.u[uid].n)) return 'NOME'; return ''; };
  const fail = (e, c) => json(res, e === 'NOME' ? 428 : c || 400, { err: e === 'NOME' ? 'Scegli prima il tuo nome da autore' : e, nome: e === 'NOME' ? 1 : undefined });

  if (!P && !seg.length || (!P && seg[0] === 'home')) {
    const L = mdList(), t = {}; for (const w of L) for (const g of w.tags || []) t[g] = (t[g] || 0) + 1;
    const feat = mdFeatured(), fid = new Set(feat.map(c => c.id));
    return json(res, 200, { open, n: L.length, feat, trend: mdSort(L, 'trend').filter(c => c.hot > .5 && !fid.has(c.id)).slice(0, 12), nuovi: mdSort(L, 'nuovi').slice(0, 12), top: mdSort(L, 'top').filter(c => c.r.n).slice(0, 12), giocati: mdSort(L, 'giocati').filter(c => c.st.p).slice(0, 12),
      tags: MD_TAGS.map(g => [g, t[g] || 0]), me: uid && MD.u[uid] ? { n: MD.u[uid].n } : null });
  }
  if (!P && seg[0] === 'lista') {
    let L = mdList(); const s = str(q.q, 60).toLowerCase();
    if (q.autore) L = L.filter(w => w.uid === q.autore);
    if (q.tag && MD_TAGS.includes(q.tag)) L = L.filter(w => (w.tags || []).includes(q.tag));
    if (q.pref === '1') L = L.filter(w => uid && (w.fav || []).includes(uid));
    if (s) L = L.filter(w => (w.n + ' ' + mdName(w.uid) + ' ' + (w.d || '') + ' ' + (w.tags || []).join(' ')).toLowerCase().includes(s));
    const C = mdSort(L, q.ord), pg = int(q.pag, 0, 1000);
    return json(res, 200, { n: C.length, L: C.slice(pg * 24, pg * 24 + 24), more: C.length > pg * 24 + 24 });
  }
  if (!P && seg[0] === 'tags') return json(res, 200, { tags: MD_TAGS });
  if (seg[0] === 'io') {
    if (!P) {
      const mine = uid ? Object.values(MD.w).filter(w => w.uid === uid) : [];
      return json(res, 200, { n: uid && MD.u[uid] ? MD.u[uid].n : '', uid, open, mine: mdSort(mine, 'nuovi').map(c => Object.assign(c, { wid: MD.w[c.id].wid, hide: MD.w[c.id].hide ? 1 : 0 })),
        favs: uid ? mdSort(mdList().filter(w => (w.fav || []).includes(uid)), 'nuovi') : [] });
    }
    return body(req, j => {
      const e = need(0); if (e) return fail(e, 403);
      const n = str(j.n, 20).replace(/\s+/g, ' '); if (n.length < 2) return fail('Il nome deve avere almeno 2 lettere');
      if (!/^[\p{L}\p{N} _.'\-]+$/u.test(n)) return fail('Nel nome usa solo lettere, numeri, spazi e . _ \' -');
      const k = key(n), o = MD.names[k]; if (o && o !== uid) return fail('Questo nome è già usato da un altro autore: scegline un altro', 409);
      if (!mdRate('nome:' + uid, 10, 3600e3)) return fail('Hai cambiato nome troppe volte: riprova più tardi', 429);
      const u0 = MD.u[uid]; if (u0 && u0.n && key(u0.n) !== k && MD.names[key(u0.n)] === uid) delete MD.names[key(u0.n)];
      MD.u[uid] = Object.assign(u0 || { t: Date.now() }, { n }); MD.names[k] = uid; mdTouch(); json(res, 200, { ok: 1, n });
    });
  }
  if (!P && seg[0] === 'autore' && seg[1]) { const a = str(seg[1], 24), L = Object.values(MD.w).filter(w => w.uid === a && !w.hide); const C = mdSort(L, 'nuovi'); let p = 0, rs = 0, rn = 0; for (const c of C) { p += c.st.p; rs += c.r.avg * c.r.n; rn += c.r.n; }
    return json(res, 200, { n: MD.u[a] ? MD.u[a].n : 'Anonimo', since: MD.u[a] ? MD.u[a].t : 0, L: C, plays: p, avg: rn ? Math.round(rs / rn * 10) / 10 : 0, nrev: rn }); }
  if (!P && seg[0] === 'mio') { const wid = str(q.wid, 40), w = uid && Object.values(MD.w).find(x => x.uid === uid && x.wid === wid); return json(res, 200, { pub: w ? mdDetail(w, uid) : null, n: uid && MD.u[uid] ? MD.u[uid].n : '', open, tags: MD_TAGS }); }

  // caricamento di un'immagine o di un video (corpo binario)
  if (P && seg[0] === 'media') {
    const e = need(0); if (e) return fail(e, 403); if (!open) return fail('Le pubblicazioni sono chiuse su questo server', 403);
    if (!mdRate('media:' + uid, 60, 3600e3) || !mdRate('mediaip:' + ip, 120, 3600e3)) return fail('Troppi caricamenti: riprova tra un po\'', 429);
    return bodyRaw(req, MD_LIM.vid, (b, err) => {
      if (!b) return fail(err === 'troppo grande' ? 'File troppo grande (massimo 3 MB per le immagini, 12 MB per il video)' : 'Caricamento non riuscito', 413);
      const f = mdSniff(b); if (!f) return fail('Formato non valido: servono immagini JPEG, PNG o WebP, video WebM o MP4');
      if (f.k === 'img' && b.length > MD_LIM.img) return fail('Immagine troppo grande (massimo 3 MB)', 413);
      if (mdUserBytes(uid) + b.length > MD_LIM.userBytes) return fail('Hai finito lo spazio per immagini e video su questo server: togli qualcosa dai mondi pubblicati', 413);
      const id = mdNew('m'); try { fs.writeFileSync(path.join(MD_MEDIA, id + '.' + f.ext), b); } catch (x) { return fail('Salvataggio non riuscito sul server', 500); }
      MD.media[id] = { uid, k: f.k, ext: f.ext, size: b.length, t: Date.now(), w: null }; mdTouch();
      json(res, 200, { id, k: f.k, url: mdUrl(id) });
    });
  }
  // pubblica o aggiorna (con o senza il mondo: "solo la scheda" cambia titolo, descrizione e anteprime)
  if (P && seg[0] === 'pubblica') {
    const e = need(1); if (e) return fail(e, 403); if (!open) return fail('Le pubblicazioni sono chiuse su questo server', 403);
    if (!mdRate('pub:' + uid, 20, 3600e3)) return fail('Troppe pubblicazioni in poco tempo: riprova più tardi', 429);
    return bodyBig(req, MD_LIM.world + 200000, (j, err) => {
      if (!j) return fail(err === 'troppo grande' ? 'Il mondo è troppo grande per essere pubblicato (massimo 4 MB)' : 'Dati non validi', 413);
      let w = j.id ? MD.w[str(j.id, 30)] : null;
      if (j.id && (!w || w.uid !== uid)) return fail('Questo mondo pubblicato non è tuo', 403);
      const nm = str(j.n, 60); if (nm.length < 2) return fail('Dai un titolo al mondo');
      const wo = j.mondo; if (!w && (!wo || typeof wo !== 'object')) return fail('Manca il mondo da pubblicare');
      if (wo && (typeof wo !== 'object' || !wo.maps || typeof wo.maps !== 'object' || !Object.keys(wo.maps).length)) return fail('Il mondo non ha mappe');
      if (!w && Object.values(MD.w).filter(x => x.uid === uid).length >= MD_LIM.perUser) return fail('Hai già pubblicato troppi mondi su questo server: ritirane qualcuno', 403);
      const media = (Array.isArray(j.media) ? j.media : []).map(x => str(x, 30)).filter((id, i, a) => MD.media[id] && MD.media[id].uid === uid && (!MD.media[id].w || (w && MD.media[id].w === w.id)) && a.indexOf(id) === i);
      const imgs = media.filter(id => MD.media[id].k === 'img').slice(0, MD_LIM.imgs), vid = media.filter(id => MD.media[id].k === 'vid').slice(0, 1), keep = media.filter(id => imgs.includes(id) || vid.includes(id));
      const now = Date.now(), isNew = !w;
      if (!w) { w = { id: mdNew('w'), uid, wid: str(j.wid, 40), t0: now, t1: now, ver: 0, st: { v: 0, p: 0 }, r: {}, c: [], fav: [], pl: {}, dn: {}, ev: [], media: [] }; }
      if (wo) { const s = JSON.stringify(wo); if (s.length > MD_LIM.world) return fail('Il mondo è troppo grande per essere pubblicato (massimo 4 MB)', 413);
        try { fs.writeFileSync(path.join(MD_FILE, w.id + '.json'), s); } catch (x) { return fail('Salvataggio non riuscito sul server', 500); }
        Object.assign(w, mdCount(wo), { size: s.length, ver: (w.ver | 0) + 1 }); w.t1 = now; }
      for (const id of w.media || []) if (!keep.includes(id)) mdDelMedia(id);
      for (const id of keep) MD.media[id].w = w.id;
      Object.assign(w, { n: nm, d: mdTxt(j.d, 1500), tags: mdTags(j.tags), remix: j.remix ? 1 : 0, media: keep, cover: keep.includes(j.cover) && MD.media[j.cover].k === 'img' ? j.cover : (imgs[0] || null) });
      if (!wo) w.t1 = Math.max(w.t1, now - 1);
      MD.w[w.id] = w; mdTouch();
      log('mondi', mdName(uid) + (isNew ? ' ha pubblicato «' : ' ha aggiornato «') + w.n + '»');
      json(res, 200, { ok: 1, id: w.id, nuovo: isNew ? 1 : 0, ver: w.ver });
    });
  }
  // un mondo pubblicato
  if (seg[0] === 'w' && seg[1]) {
    const w = MD.w[str(seg[1], 30)]; if (!w || (w.hide && w.uid !== uid)) return json(res, 404, { err: 'Mondo non trovato: forse è stato ritirato' });
    const act = seg[2] || '';
    if (!P && !act) return json(res, 200, mdDetail(w, uid));
    if (!P && act === 'mondo') { const p = path.join(MD_FILE, w.id + '.json'); if (!fs.existsSync(p)) return json(res, 404, { err: 'File del mondo mancante' }); res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); return fs.createReadStream(p).pipe(res); }
    if (!P) return json(res, 404, { err: 'Non trovato' });
    const who = uid || ('ip:' + ip);
    if (act === 'vista') { if (uid !== w.uid && mdOnce('v:' + w.id + ':' + who, 6 * 3600e3)) { w.st.v = (w.st.v | 0) + 1; mdEvent(w, 'v'); } return json(res, 200, { ok: 1, v: w.st.v }); }
    if (act === 'gioca') { if (uid !== w.uid && mdOnce('p:' + w.id + ':' + who, 30 * 60e3)) { w.st.p = (w.st.p | 0) + 1; if (uid && Object.keys(w.pl || {}).length < 50000) (w.pl || (w.pl = {}))[uid] = 1; mdEvent(w, 'p'); } return json(res, 200, { ok: 1 }); }
    if (act === 'finito') { if (uid && uid !== w.uid && !(w.dn || (w.dn = {}))[uid]) { w.dn[uid] = 1; mdEvent(w, 'd'); } return json(res, 200, { ok: 1 }); }
    return body(req, j => {
      const e = need(act === 'preferito' || act === 'segnala' ? 0 : 1); if (e) return fail(e, 403);
      const own = w.uid === uid;
      if (act === 'preferito') { const F = w.fav || (w.fav = []), i = F.indexOf(uid); if (i >= 0) F.splice(i, 1); else { F.push(uid); mdEvent(w, 'f'); } mdTouch(); return json(res, 200, { ok: 1, fav: i < 0 ? 1 : 0, n: F.length }); }
      if (act === 'recensione') {
        if (!open) return fail('Recensioni e commenti sono chiusi su questo server', 403);
        const s = int(j.s, 0, 5); if (own && s) return fail('Non puoi recensire un tuo mondo');
        if (!mdRate('rev:' + uid, 30, 3600e3)) return fail('Troppe recensioni in poco tempo', 429);
        if (!s) { delete w.r[uid]; mdTouch(); return json(res, 200, { ok: 1, r: mdRating(w) }); }
        const had = !!w.r[uid]; w.r[uid] = { s, tx: mdTxt(j.tx, 800), t: Date.now() }; if (!had) mdEvent(w, 'r', s); mdTouch();
        return json(res, 200, { ok: 1, r: mdRating(w) });
      }
      if (act === 'commento') {
        if (!open) return fail('Recensioni e commenti sono chiusi su questo server', 403);
        const tx = mdTxt(j.tx, 600); if (!tx) return fail('Scrivi qualcosa');
        if (!mdRate('com:' + uid, 6, 60e3) || !mdRate('comh:' + uid, 80, 3600e3)) return fail('Stai scrivendo troppo in fretta: aspetta un momento', 429);
        const c = { id: mdNew('c'), u: uid, tx, t: Date.now(), re: str(j.re, 20) }; (w.c || (w.c = [])).push(c); if (w.c.length > MD_LIM.comments) w.c.shift(); mdEvent(w, 'c'); return json(res, 200, { ok: 1, id: c.id });
      }
      if (act === 'elimina-commento') { const i = (w.c || []).findIndex(c => c.id === j.id); if (i < 0) return fail('Commento non trovato', 404); if (w.c[i].u !== uid && !own) return fail('Non puoi eliminare questo commento', 403); w.c.splice(i, 1); mdTouch(); return json(res, 200, { ok: 1 }); }
      if (act === 'segnala') { if (!mdRate('rep:' + who, 10, 3600e3)) return fail('Troppe segnalazioni', 429); const why = mdTxt(j.why, 300); MD.rep.push({ t: Date.now(), w: w.id, u: uid, n: mdName(uid), why, c: str(j.c, 20) }); if (MD.rep.length > 500) MD.rep.shift(); mdTouch(); log('mondi', 'Segnalazione su «' + w.n + '»' + (why ? ': ' + why : '')); return json(res, 200, { ok: 1 }); }
      if (act === 'ritira') { if (!own) return fail('Questo mondo non è tuo', 403); log('mondi', mdName(uid) + ' ha ritirato «' + w.n + '»'); mdDelWorld(w.id); return json(res, 200, { ok: 1 }); }
      if (act === 'nascondi') { if (!own) return fail('Questo mondo non è tuo', 403); w.hide = j.on ? 1 : 0; mdTouch(); return json(res, 200, { ok: 1, hide: w.hide }); }
      fail('Azione sconosciuta', 404);
    });
  }
  json(res, 404, { err: 'Non trovato' });
}
// per il pannello admin
function mdAdminState() {
  let bytes = 0; for (const m of Object.values(MD.media)) bytes += m.size || 0; for (const w of Object.values(MD.w)) bytes += w.size || 0;
  const com = []; for (const w of Object.values(MD.w)) for (const c of (w.c || []).slice(-40)) com.push({ w: w.id, wn: w.n, id: c.id, n: mdName(c.u), tx: c.tx, t: c.t });
  const rev = []; for (const w of Object.values(MD.w)) for (const [u, r] of Object.entries(w.r || {})) if (r.tx) rev.push({ w: w.id, wn: w.n, u, n: mdName(u), s: r.s, tx: r.tx, t: r.t });
  return { open: CFG.mondi !== 0, dir: MD_DIR, bytes, list: mdSort(Object.values(MD.w), 'nuovi').map(c => Object.assign(c, { hide: MD.w[c.id].hide ? 1 : 0, size: MD.w[c.id].size | 0, blk: MD.u[c.au] && MD.u[c.au].blk ? 1 : 0, reps: MD.rep.filter(r => r.w === c.id).length })),
    reps: MD.rep.slice(-100).reverse().map((r, i) => Object.assign({ i: MD.rep.length - 1 - i, wn: MD.w[r.w] ? MD.w[r.w].n : '?' }, r)), com: com.sort((a, b) => b.t - a.t).slice(0, 120), rev: rev.sort((a, b) => b.t - a.t).slice(0, 80) };
}
function mdAdminAct(j) {
  const w = MD.w[str(j.id, 30)];
  switch (j.a) {
    case 'mdel': if (!w) return { err: 'Mondo non trovato' }; log('admin', 'Mondo «' + w.n + '» di ' + mdName(w.uid) + ' eliminato'); mdDelWorld(w.id); return { ok: 'Mondo eliminato' };
    case 'mpin': if (!w) return { err: 'Mondo non trovato' }; w.pin = w.pin ? 0 : 1; mdTouch(); log('admin', '«' + w.n + '» ' + (w.pin ? 'messo' : 'tolto') + ' in evidenza'); return { ok: w.pin ? 'Ora è in evidenza nella prima pagina' : 'Non è più in evidenza' };
    case 'mhide': if (!w) return { err: 'Mondo non trovato' }; w.hide = w.hide ? 0 : 1; mdTouch(); log('admin', '«' + w.n + '» ' + (w.hide ? 'nascosto' : 'di nuovo visibile')); return { ok: w.hide ? 'Mondo nascosto dal browser' : 'Mondo di nuovo visibile' };
    case 'mcom': { if (!w) return { err: 'Mondo non trovato' }; const i = (w.c || []).findIndex(c => c.id === j.cid); if (i < 0) return { err: 'Commento non trovato' }; w.c.splice(i, 1); mdTouch(); log('admin', 'Commento eliminato in «' + w.n + '»'); return { ok: 'Commento eliminato' }; }
    case 'mrev': if (!w || !w.r || !w.r[j.u]) return { err: 'Recensione non trovata' }; delete w.r[j.u]; mdTouch(); log('admin', 'Recensione eliminata in «' + w.n + '»'); return { ok: 'Recensione eliminata' };
    case 'mrep': { const i = int(j.i, 0, 1e6); if (!MD.rep[i]) return { err: 'Segnalazione non trovata' }; MD.rep.splice(i, 1); mdTouch(); return { ok: 'Segnalazione archiviata' }; }
    case 'mblk': { const u = MD.u[str(j.u, 24)]; if (!u) return { err: 'Autore non trovato' }; u.blk = u.blk ? 0 : 1; mdTouch(); log('admin', 'Autore ' + u.n + (u.blk ? ' bloccato' : ' sbloccato') + ' nei mondi'); return { ok: u.blk ? u.n + ' non può più pubblicare, recensire né commentare' : u.n + ' è stato sbloccato' }; }
    case 'mopen': CFG.mondi = j.on ? 1 : 0; touch(); log('admin', 'Pubblicazioni dei mondi ' + (CFG.mondi ? 'aperte' : 'chiuse')); return { ok: CFG.mondi ? 'Pubblicazioni, recensioni e commenti aperti' : 'Pubblicazioni, recensioni e commenti chiusi' };
  }
  return null;
}

/* ---------- WebSocket minimale ---------- */
const clients = new Map(); let nid = 1;
const frame = s => { const b = Buffer.from(s), l = b.length; let h;
  if (l < 126) h = Buffer.from([0x81, l]);
  else if (l < 65536) { h = Buffer.alloc(4); h[0] = 0x81; h[1] = 126; h.writeUInt16BE(l, 2); }
  else { h = Buffer.alloc(10); h[0] = 0x81; h[1] = 127; h.writeBigUInt64BE(BigInt(l), 2); }
  return Buffer.concat([h, b]); };
const send = (c, o) => { try { c.sock.write(frame(JSON.stringify(o))); } catch (e) {} };
const players = () => [...clients.values()].filter(c => c.name && !c.gone);
function kick(c, s) { if (c.gone) return; c.gone = 1; send(c, { t: 'kick', s }); setTimeout(() => { try { c.sock.end(); } catch (e) {} }, 300); }

function parse(c) {
  for (;;) {
    const b = c.buf; if (b.length < 2) return;
    const op = b[0] & 15; let l = b[1] & 127, o = 2;
    if (l === 126) { if (b.length < 4) return; l = b.readUInt16BE(2); o = 4; }
    else if (l === 127) { if (b.length < 10) return; l = Number(b.readBigUInt64BE(2)); o = 10; }
    const m = (b[1] & 128) ? 4 : 0;
    if (l > 65536) { c.sock.destroy(); return; }
    if (b.length < o + m + l) return;
    const d = Buffer.from(b.subarray(o + m, o + m + l));
    if (m) { const k = b.subarray(o, o + 4); for (let i = 0; i < d.length; i++) d[i] ^= k[i & 3]; }
    c.buf = b.subarray(o + m + l);
    if (op === 8) { c.sock.end(); return; }
    if (op === 9) { c.sock.write(Buffer.from([0x8A, 0])); continue; }
    if (op === 1) { ST.msgs++; let j; try { j = JSON.parse(d.toString()); } catch (e) { continue; } if (j && typeof j === 'object' && !Array.isArray(j) && !c.gone) try { if (j.t === 'devauth' || j.t === 'devuse' || plugMsg(c, j) !== false) onMsg(c, j); } catch (e) { console.error(e); } }
  }
}

const inArena = c => typeof c.p.rm === 'string' && c.p.rm.endsWith('-arena');
const cool = {}; // coppie vincitore>sconfitto premiate di recente (anti-farm)
const pubCfg = () => ({ pvp: CFG.pvp, trade: CFG.trade, chat: CFG.chat, xpm: CFG.xpm, gm: CFG.gm });
function applyCfg(c) {
  if (!c || typeof c !== 'object') return;
  if ('maxp' in c) CFG.maxp = int(c.maxp, 1, 500);
  for (const k of ['lock', 'pvp', 'trade', 'chat']) if (k in c) CFG[k] = c[k] ? 1 : 0;
  if ('motd' in c) CFG.motd = str(c.motd, 160);
  if ('xpm' in c) CFG.xpm = Math.max(.5, Math.min(5, +c.xpm || 1));
  if ('gm' in c) CFG.gm = Math.max(.5, Math.min(5, +c.gm || 1));
  touch(); for (const p of players()) send(p, { t: 'cfg', c: pubCfg() });
}
const banOf = c => DB.bans.find(b => (b.k && b.k === key(c.name)) || (b.ip && b.ip === c.ip));

function onMsg(c, j) {
  switch (j.t) {
    case 'hello': {
      c.code = str(j.code, 16).toLowerCase().replace(/[^a-z0-9]/g, '');
      c.name = str(j.name, 14) || 'Eroe';
      const b = banOf(c);
      if (b) { log('ban', 'Rifiutato ' + c.name + ' (' + c.ip + '): bandito'); kick(c, 'Sei stato bandito da questo server' + (b.s ? ': ' + b.s : '.')); return; }
      if (CFG.lock) { kick(c, 'Il server è in manutenzione: per ora non si accettano nuovi giocatori. Riprova più tardi.'); return; }
      if (players().length > CFG.maxp) { kick(c, 'Il server è pieno (' + CFG.maxp + ' giocatori). Riprova più tardi.'); return; }
      send(c, { t: 'id', id: c.id, ar: pub(stats(c.name)), runs: DB.runs[c.code] || {}, gm: gameMin() });
      send(c, { t: 'cfg', c: pubCfg() });
      if (CFG.motd) send(c, { t: 'ann', s: CFG.motd, adm: 1 });
      if (!c.joined) {
        c.joined = 1; log('join', c.name + ' è entrato' + (c.code ? ' nella stanza ' + c.code : '') + ' (' + c.ip + ')');
        if (c.code) for (const v of clients.values()) if (v !== c && v.code === c.code) send(v, { t: 'join', n: c.name, j: 1 });
        emit('join', c);
      }
      const n = players().length; if (n > ST.peak) ST.peak = n;
      break;
    }
    case 'p': if (j.d && typeof j.d === 'object' && !Array.isArray(j.d)) { const oz = c.p.zk; c.p = j.d; if (c.joined && typeof j.d.zk === 'string' && j.d.zk !== oz) emit('zone', c, str(j.d.zk, 24), str(oz, 24)); } break;
    // ---- ping: il server manda 'pi' con l'ora, il client risponde 'po'; il tempo di andata e ritorno è il ping ----
    case 'po': { const r = Date.now() - (+j.s || 0); if (r >= 0 && r < 60000) c.ping = c.ping == null ? r : Math.round(c.ping * 0.6 + r * 0.4); break; }
    // ---- lista dei giocatori della stanza, in qualunque zona siano ----
    case 'who': {
      if (!c.code) return;
      const list = [];
      for (const v of players()) if (v.code === c.code) list.push({ id: v.id, n: v.name, lv: v.p.lv | 0, z: str(v.p.zk, 24), x: +v.p.x || 0, y: +v.p.y || 0, hp: v.p.hp | 0, mx: v.p.mx | 0, ping: v.ping == null ? -1 : v.ping, me: v === c ? 1 : 0 });
      list.sort((a, b) => b.me - a.me || a.n.localeCompare(b.n));
      send(c, { t: 'who', list });
      break;
    }

    // ---- arena PvP: l'attaccante manda il colpo, la vittima applica le sue difese ----
    case 'hit': {
      if (!CFG.pvp) { if (!c.pvpWarn || Date.now() - c.pvpWarn > 5000) { c.pvpWarn = Date.now(); send(c, { t: 'err', s: 'Il PvP è disattivato dall\'admin' }); } return; }
      const v = clients.get(j.to);
      if (!v || v === c || !inArena(c) || v.p.rm !== c.p.rm) return;
      const d = Math.max(1, Math.min(99999, Math.round(+j.d || 0)));
      v.lastHit = { by: c.id, at: Date.now() };
      send(v, { t: 'hit', from: c.id, d, cr: !!j.cr, n: c.name });
      break;
    }
    case 'ko': { // la vittima dichiara la propria sconfitta: vale solo se l'ultimo colpo è recente e dell'avversario indicato
      const k = clients.get(j.by);
      if (!k || !c.lastHit || c.lastHit.by !== j.by || Date.now() - c.lastHit.at > 6000 || k.p.rm !== c.p.rm) return;
      c.lastHit = null;
      const pair = key(k.name) + '>' + key(c.name), now = Date.now();
      if (key(k.name) === key(c.name) || cool[pair] > now) {
        send(k, { t: 'ann', s: 'Vittoria non conteggiata: hai già battuto ' + c.name + ' meno di 30 secondi fa.' });
        return;
      }
      cool[pair] = now + 30000;
      const ks = stats(k.name), vs = stats(c.name);
      const pts = Math.min(30, 10 + Math.max(0, ((c.p.lv | 0) - (k.p.lv | 0)) * 2));
      ks.w++; ks.pts += pts; ks.ap += pts; vs.l++; touch();
      log('arena', k.name + ' ha sconfitto ' + c.name + ' (+' + pts + ' punti)'); emit('arena', k, c, pts);
      send(k, { t: 'ar', ar: pub(ks), gain: pts, vs: c.name });
      send(c, { t: 'ar', ar: pub(vs), lost: k.name });
      for (const v of clients.values()) if (v.p.rm === c.p.rm) send(v, { t: 'ann', s: '⚔ ' + k.name + ' ha sconfitto ' + c.name + '! (+' + pts + ' punti arena)' });
      break;
    }
    case 'buy': {
      const i = j.k | 0; if (i < 0 || i >= AR_COST.length || !c.name) return;
      const s = stats(c.name);
      if (s.ap < AR_COST[i]) { send(c, { t: 'err', s: 'Punti arena insufficienti' }); return; }
      s.ap -= AR_COST[i]; touch();
      send(c, { t: 'bought', k: i, ar: pub(s) });
      break;
    }
    // ---- profilo: A chiede, il server inoltra a B, B risponde; i risultati dell'arena li aggiunge il server ----
    case 'prof': {
      const v = clients.get(j.to); if (!v || v === c || !c.code || v.code !== c.code) return;
      send(v, { t: 'profq', from: c.id });
      break;
    }
    case 'profr': {
      const v = clients.get(j.to); if (!v || v === c || v.code !== c.code || !j.d || typeof j.d !== 'object' || Array.isArray(j.d)) return;
      const k = DB.ar[key(c.name)];
      send(v, { t: 'prof', from: c.id, d: j.d, ar: k ? pub(k) : { w: 0, l: 0, pts: 0 } });
      break;
    }
    case 'lb': {
      const list = Object.values(DB.ar).filter(s => s.w || s.l).sort((a, b) => b.pts - a.pts || b.w - a.w).slice(0, 50)
        .map(s => ({ n: s.n, w: s.w, l: s.l, pts: s.pts }));
      send(c, { t: 'lb', list });
      break;
    }
    // ---- dungeon: quando un boss cade, il dungeon passa al ciclo successivo per tutta la stanza ----
    case 'dgdone': {
      if (!c.code) return;
      const d = str(j.d, 20); if (!DUNGEONS.includes(d)) return;
      const r = DB.runs[c.code] || (DB.runs[c.code] = {});
      if ((r[d] || 0) !== (j.run | 0)) return;
      r[d] = (r[d] || 0) + 1; touch();
      log('dungeon', c.name + ' ha completato ' + d + ' nella stanza ' + c.code + ' (ora ciclo ' + (r[d] + 1) + ')'); emit('dungeon', c, d, r[d] + 1);
      for (const v of clients.values()) if (v.code === c.code) send(v, { t: 'runs', runs: r });
      break;
    }
    case 'tr': trade(c, j); break;
    // ---- oggetti gettati a terra: visibili a chi è nella stessa stanza e zona, il primo che li raccoglie li prende ----
    case 'gget': { if (!okRm(c, j.rm)) return; const G = GROUND.get(j.rm); send(c, { t: 'glist', rm: j.rm, list: G ? [...G.values()] : [] }); break; }
    case 'drop': {
      if (!okRm(c, j.rm)) return;
      const it = cleanItem(j.it), x = +j.x, y = +j.y, now = Date.now();
      if (!it || !isFinite(x) || !isFinite(y)) { send(c, { t: 'gerr', u: str(j.it && j.it.u, 12), s: 'Questo oggetto non si può gettare a terra' }); return; }
      if (now - (c.ld || 0) < 300) { send(c, { t: 'gerr', u: it.u, s: 'Piano: aspetta un attimo prima di gettare un altro oggetto' }); return; }
      c.ld = now;
      let G = GROUND.get(j.rm); if (!G) GROUND.set(j.rm, G = new Map());
      if (G.size >= 60) { const old = G.keys().next().value; G.delete(old); rmSend(j.rm, { t: 'gdel', rm: j.rm, id: old }); }
      const g = { gid: 'g' + (gidN++), it, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, by: c.name, t: Date.now() };
      G.set(g.gid, g); rmSend(j.rm, { t: 'gadd', rm: j.rm, g }, c);
      log('item', c.name + ' ha gettato a terra ' + it.n + ' (' + j.rm.slice(c.code.length + 1) + ')'); emit('drop', c, Object.assign({}, it));
      break;
    }
    case 'gtake': {
      if (!okRm(c, j.rm)) return; const G = GROUND.get(j.rm), g = G && G.get(String(j.id));
      if (!g) { send(c, { t: 'gdel', rm: j.rm, id: String(j.id) }); send(c, { t: 'err', s: 'Qualcuno l\'ha già raccolto' }); return; }
      if (!c.p || c.p.rm !== j.rm || Math.hypot((+c.p.x || 0) - g.x, (+c.p.y || 0) - g.y) > 3) { send(c, { t: 'err', s: 'Sei troppo lontano per raccoglierlo' }); return; }
      G.delete(g.gid); if (!G.size) GROUND.delete(j.rm);
      send(c, { t: 'ggot', it: g.it, by: g.by }); rmSend(j.rm, { t: 'gdel', rm: j.rm, id: g.gid }, c);
      log('item', c.name + ' ha raccolto ' + g.it.n + (g.by !== c.name ? ' (lasciato da ' + g.by + ')' : '')); emit('pickup', c, Object.assign({}, g.it), g.by);
      break;
    }
    // ---- chat: arriva a tutta la stanza (stesso codice), in qualunque zona si trovino ----
    // ---- pannello sviluppatore: sblocco con la password admin e registro di quello che si usa ----
    case 'devauth': { // (non passa dai plugin: contiene la password)
      const ip = c.ip, f = FAILS.get(ip) || { n: 0, until: 0 }, n = str(j.n, 14) || c.name || '';
      if (f.until > Date.now()) { send(c, { t: 'devno', s: 'Troppi tentativi: riprova tra ' + Math.ceil((f.until - Date.now()) / 1000) + ' secondi' }); return; }
      if (!checkPw(j.pw)) { f.n++; if (f.n >= 5) f.until = Date.now() + 60000 * Math.min(10, f.n - 4); FAILS.set(ip, f); log('admin', 'Pannello sviluppatore: password errata da ' + (n || '?') + ' (' + ip + ')'); send(c, { t: 'devno', s: 'Password errata' }); return; }
      FAILS.delete(ip);
      for (const [k, d] of DEVT) if (d.exp < Date.now()) DEVT.delete(k);
      const tok = crypto.randomBytes(24).toString('hex'), exp = Date.now() + 12 * 3600e3; DEVT.set(tok, { n, ip, exp });
      log('admin', 'Pannello sviluppatore sbloccato da ' + (n || '?') + ' (' + ip + ')'); devGrace(n, exp - Date.now(), ip);
      send(c, { t: 'devok', tok, exp }); break;
    }
    case 'devuse': {
      const d = devOk(j.tok), n = str(j.n, 14) || c.name || '?', s2 = str(j.s, 120) || 'azione';
      if (!d) { log('admin', 'Pannello sviluppatore usato SENZA password: ' + n + ' (' + c.ip + ') · ' + s2); return; }
      const now = Date.now(); if (now - (c.dl || 0) < 300) return; c.dl = now;
      d.n = n; log('admin', 'Pannello sviluppatore · ' + n + ': ' + s2); devGrace(n, d.exp - now, c.ip); break;
    }
    case 'chat': {
      let s = str(j.s, 200); if (!/\b(?:https?:\/\/|www\.)\S/i.test(s)) s = s.slice(0, 60); const now = Date.now(); if (!s || !c.code || now - (c.lc || 0) < 400) return; c.lc = now;
      if (s[0] === '/') { runCommand(c, s); return; }
      if (!CFG.chat) { send(c, { t: 'err', s: 'La chat è disattivata dall\'admin' }); return; }
      if (DB.mutes.includes(key(c.name))) { send(c, { t: 'err', s: 'Sei stato silenziato dall\'admin: gli altri non vedono i tuoi messaggi' }); return; }
      const z = str(j.z, 24);
      const ps = plugChat(c, s, z); if (ps === false) return; s = ps;
      chatPush(c.code, c.name, s, z);
      for (const v of clients.values()) if (v !== c && v.code === c.code) send(v, { t: 'chat', n: c.name, s, z });
      break;
    }
  }
}

/* ---------- oggetti a terra: per stanza+zona (la chiave "rm" che il gioco usa anche per la presenza) ---------- */
const GROUND = new Map(); let gidN = 1;
const okRm = (c, rm) => typeof rm === 'string' && rm.length <= 60 && !!c.code && rm.startsWith(c.code + '-');
function rmSend(rm, o, also) { for (const v of clients.values()) if (!v.gone && (v.p.rm === rm || v === also)) send(v, o); }
const groundCount = () => { let n = 0; for (const G of GROUND.values()) n += G.size; return n; };
// dopo 10 minuti gli oggetti a terra spariscono
setInterval(() => { const lim = Date.now() - 10 * 60e3; for (const [rm, G] of GROUND) { for (const [id, g] of G) if (g.t < lim) { G.delete(id); rmSend(rm, { t: 'gdel', rm, id }); } if (!G.size) GROUND.delete(rm); } }, 15000);

/* ---------- scambi: il server tiene le due offerte, lo scambio parte solo quando entrambi confermano ---------- */
const trades = new Map();
function cleanItem(o) {
  if (!o || typeof o !== 'object' || o.ar) return null;
  const n = (v, a, b) => Math.max(a, Math.min(b, Math.round(+v || 0)));
  const u = str(o.u, 12) || crypto.randomBytes(4).toString('hex');
  // 7.14: i reperti del Mondo aperto (trofei, curiosità): solo nome, descrizione, rarità e valore
  if (o.s === 'x') return { u, s: 'x', n: str(o.n, 40) || 'Reperto', d: str(o.d, 140), r: n(o.r, 0, 3), p: n(o.p, 0, 99999), k: str(o.k, 12) };
  if (typeof o.s !== 'string' || !['w', 'h', 'c', 's'].includes(o.s)) return null;
  const it = { u, s: o.s, r: n(o.r, 0, 3), v: n(o.v, 1, 99999), n: str(o.n, 48) || 'Oggetto', p: n(o.p, 0, 999999), hp: n(o.hp, 0, 9999), cr: n(o.cr, 0, 50), up: n(o.up, 0, 5) };
  // 7.14: un oggetto unico viaggia con il suo seme; chi lo riceve ricalcola tutto il resto dal seme (uqFix)
  const q = o.uq;
  if (q && typeof q === 'object' && /^[a-z0-9]{6,16}$/.test(String(q.sd || ''))) it.uq = { sd: String(q.sd), lv: n(q.lv, 1, 99), rm: n(q.rm, 0, 3), gv: n(q.gv, 1, 9), own: (Array.isArray(q.own) ? q.own : []).slice(-6).map(x => str(x, 14)).filter(Boolean) };
  return it;
}
function trSync(S) { for (const p of [S.a, S.b]) { const o = p === S.a ? S.b : S.a; send(p, { t: 'tr', a: 'st', n: o.name, you: S.o[p.id], them: S.o[o.id] }); } }
function trEnd(S, m) { trades.delete(S.a.id); trades.delete(S.b.id); if (m) for (const p of [S.a, S.b]) send(p, { t: 'tr', a: 'end', s: m }); }
function trade(c, j) {
  if (j.a === 'req') {
    if (!CFG.trade) { send(c, { t: 'tr', a: 'end', s: 'Gli scambi sono disattivati dall\'admin' }); return; }
    const v = clients.get(j.to);
    if (!v || v === c || trades.has(c.id) || trades.has(v.id) || v.p.rm !== c.p.rm) { send(c, { t: 'tr', a: 'end', s: v && v.p.rm !== c.p.rm ? 'Per scambiare dovete essere nella stessa zona' : 'Giocatore non disponibile per uno scambio' }); return; }
    v.treq = c.id; send(v, { t: 'tr', a: 'req', from: c.id, n: c.name }); send(c, { t: 'tr', a: 'sent', n: v.name });
  } else if (j.a === 'no') {
    const v = clients.get(j.to); if (c.treq === j.to) c.treq = null;
    if (v) send(v, { t: 'tr', a: 'end', s: c.name + ' ha rifiutato lo scambio' });
  } else if (j.a === 'acc') {
    const v = clients.get(j.to);
    if (!v || c.treq !== v.id || trades.has(c.id) || trades.has(v.id)) { send(c, { t: 'tr', a: 'end', s: 'La richiesta di scambio è scaduta' }); return; }
    c.treq = null;
    const S = { a: v, b: c, o: { [v.id]: { it: [], g: 0, ok: false }, [c.id]: { it: [], g: 0, ok: false } } };
    trades.set(v.id, S); trades.set(c.id, S); trSync(S);
  } else {
    const S = trades.get(c.id); if (!S) return;
    const me = S.o[c.id], oth = S.a === c ? S.b : S.a;
    if (j.a === 'off') {
      me.it = (Array.isArray(j.it) ? j.it : []).slice(0, 12).map(cleanItem).filter(Boolean);
      me.g = Math.max(0, Math.min(1e7, j.g | 0));
      me.pt = Math.max(0, Math.min(999, j.pt | 0));   // 7.14: anche le pozioni si scambiano
      for (const k in S.o) S.o[k].ok = false; trSync(S);
    } else if (j.a === 'ok') {
      me.ok = true;
      if (S.o[oth.id].ok) {
        send(c, { t: 'tr', a: 'done', give: me, get: S.o[oth.id], n: oth.name }); send(oth, { t: 'tr', a: 'done', give: S.o[oth.id], get: me, n: c.name });
        log('trade', c.name + ' e ' + oth.name + ' hanno scambiato ' + me.it.length + '+' + S.o[oth.id].it.length + ' oggetti e ' + me.g + '/' + S.o[oth.id].g + ' oro');
        emit('trade', c, oth, { give: me.it.map(i => Object.assign({}, i)), gold: me.g }, { give: S.o[oth.id].it.map(i => Object.assign({}, i)), gold: S.o[oth.id].g });
        trEnd(S);
      } else trSync(S);
    } else if (j.a === 'x') trEnd(S, c.name + ' ha annullato lo scambio');
  }
}

/* ---------- pannello admin: stato e comandi ---------- */
function lanIps() { const r = []; for (const l of Object.values(os.networkInterfaces()).flat()) if (l && l.family === 'IPv4' && !l.internal) r.push(l.address); return r; }
function state() {
  const pl = players().map(c => ({ id: c.id, n: c.name, code: c.code, z: str(c.p.zk, 24), x: +c.p.x || 0, y: +c.p.y || 0, lv: c.p.lv | 0, hp: c.p.hp | 0, mx: c.p.mx | 0, df: c.p.df == null ? -1 : c.p.df | 0, g: c.p.g | 0, ping: c.ping == null ? -1 : c.ping, ip: c.ip, at: c.at, muted: DB.mutes.includes(key(c.name)) ? 1 : 0, ar: DB.ar[key(c.name)] ? pub(DB.ar[key(c.name)]) : null }));
  const rooms = {};
  for (const p of pl) { const r = rooms[p.code] || (rooms[p.code] = { code: p.code, players: [] }); r.players.push(p.n); }
  for (const code in DB.runs) if (!rooms[code]) rooms[code] = { code, players: [] };
  for (const r of Object.values(rooms)) r.runs = DB.runs[r.code] || {};
  const mem = process.memoryUsage();
  return {
    info: { ver: VER, up: Date.now() - ST.start, port: PORT, node: process.version, os: os.type() + ' ' + os.release(), rss: mem.rss, heap: mem.heapUsed, load: os.loadavg()[0], cpus: os.cpus().length,
      players: pl.length, clock: clockTxt(), peak: ST.peak, total: ST.total, msgs: ST.msgs, ground: groundCount(), data: DATA, saved: lastSave, lan: lanIps(), sessions: SESS.size, trades: trades.size / 2 },
    players: pl, rooms: Object.values(rooms).sort((a, b) => b.players.length - a.players.length || a.code.localeCompare(b.code)),
    cfg: CFG, bans: DB.bans, mutes: DB.mutes,
    lb: Object.entries(DB.ar).map(([k, s]) => ({ k, n: s.n, w: s.w, l: s.l, pts: s.pts, ap: s.ap })).sort((a, b) => b.pts - a.pts || b.w - a.w),
    chat: CHAT.slice(-150), log: LOG.slice(-250), dungeons: DUNGEONS, plugins: plugState()
  };
}
function adminAct(j, req) {
  const mr = mdAdminAct(j); if (mr) return mr;
  const a = j.a, v = j.id ? clients.get(j.id) : null, who = v ? v.name : '';
  const need = () => { if (!v || v.gone) throw new Error('giocatore non più connesso'); };
  switch (a) {
    case 'kick': need(); kick(v, 'Sei stato espulso dal server' + (str(j.s, 100) ? ': ' + str(j.s, 100) : '.')); log('kick', who + ' espulso' + (j.s ? ' (' + str(j.s, 100) + ')' : '')); return { ok: 'Hai espulso ' + who };
    case 'ban': {
      const n = v ? v.name : str(j.n, 14); if (!n) return { err: 'Scrivi il nome del giocatore' };
      if (DB.bans.some(b => b.k === key(n))) return { err: n + ' è già bandito' };
      const b = { n, k: key(n), ip: j.ip && v ? v.ip : '', s: str(j.s, 100), t: Date.now() }; DB.bans.push(b); touch();
      for (const c of players()) if (banOf(c)) kick(c, 'Sei stato bandito da questo server' + (b.s ? ': ' + b.s : '.'));
      log('ban', n + ' bandito' + (b.ip ? ' (anche IP ' + b.ip + ')' : '') + (b.s ? ': ' + b.s : '')); return { ok: n + ' è stato bandito' };
    }
    case 'unban': { const i = DB.bans.findIndex(b => b.k === key(j.n)); if (i < 0) return { err: 'Ban non trovato' }; const b = DB.bans.splice(i, 1)[0]; touch(); log('ban', b.n + ' sbandito'); return { ok: b.n + ' può tornare a giocare' }; }
    case 'mute': {
      const k = key(v ? v.name : j.n); if (!k) return { err: 'Nessun giocatore' };
      const i = DB.mutes.indexOf(k), on = i < 0; if (on) DB.mutes.push(k); else DB.mutes.splice(i, 1); touch();
      for (const c of players()) if (key(c.name) === k) send(c, { t: 'ann', s: on ? 'Sei stato silenziato dall\'admin.' : 'L\'admin ti ha tolto il silenzio.', adm: 1 });
      log('admin', (v ? v.name : j.n) + (on ? ' silenziato' : ' non più silenziato')); return { ok: (v ? v.name : j.n) + (on ? ' silenziato' : ' può di nuovo scrivere') };
    }
    case 'give': {
      need(); const k = j.k, n = int(j.n, 1, k === 'lv' ? 50 : k === 'pot' ? 99 : 1e6), r = int(j.r, 0, 3);
      if (!['gold', 'xp', 'pot', 'lv', 'item', 'heal', 'tp'].includes(k)) return { err: 'Azione sconosciuta' };
      send(v, { t: 'adm', a: k, n, r });
      const desc = { gold: n + ' oro', xp: n + ' XP', pot: n + (n === 1 ? ' pozione' : ' pozioni'), lv: n + (n === 1 ? ' livello' : ' livelli'), item: 'un oggetto ' + ['comune', 'raro', 'epico', 'leggendario'][r], heal: 'cura completa', tp: 'teletrasporto ad Aldoria' }[k];
      log('admin', 'A ' + who + ': ' + desc); return { ok: who + ': ' + desc };
    }
    case 'ann': {
      const s = str(j.s, 160); if (!s) return { err: 'Scrivi il messaggio' }; const code = str(j.code, 16);
      let n = 0; for (const c of players()) if (!code || c.code === code) { send(c, { t: 'ann', s: '📢 ' + s, adm: 1 }); n++; }
      chatPush(code || '*', '📢 Annuncio', s, '', 1); log('admin', 'Annuncio' + (code ? ' alla stanza ' + code : ' a tutti') + ': ' + s); return { ok: 'Annuncio inviato a ' + n + ' giocatori' };
    }
    case 'say': {
      const s = str(j.s, 120), code = str(j.code, 16); if (!s || !code) return { err: 'Scegli la stanza e scrivi il messaggio' };
      for (const c of players()) if (c.code === code) send(c, { t: 'chat', n: 'Admin', s, z: '', adm: 1 });
      chatPush(code, 'Admin', s, '', 1); return { ok: 'Messaggio inviato' };
    }
    case 'clearchat': CHAT.length = 0; return { ok: 'Cronologia della chat svuotata' };
    case 'gclear': { const n = groundCount(); for (const [rm, G] of GROUND) for (const id of G.keys()) rmSend(rm, { t: 'gdel', rm, id }); GROUND.clear(); log('admin', 'Rimossi ' + n + ' oggetti a terra'); return { ok: 'Rimossi ' + n + ' oggetti a terra' }; }
    case 'lbset': {
      const r = DB.ar[key(j.n)]; if (!r) return { err: 'Giocatore non trovato in classifica' };
      r.w = int(j.w, 0, 1e6); r.l = int(j.l, 0, 1e6); r.pts = int(j.pts, 0, 1e7); r.ap = int(j.ap, 0, 1e7); touch();
      for (const c of players()) if (key(c.name) === key(j.n)) send(c, { t: 'ar', ar: pub(r) });
      log('admin', 'Classifica modificata: ' + r.n + ' → ' + r.w + 'V ' + r.l + 'S ' + r.pts + ' punti, ' + r.ap + ' da spendere'); return { ok: 'Dati di ' + r.n + ' salvati' };
    }
    case 'lbdel': {
      const k = key(j.n), r = DB.ar[k]; if (!r) return { err: 'Non trovato' }; delete DB.ar[k]; touch();
      for (const c of players()) if (key(c.name) === k) send(c, { t: 'ar', ar: pub(stats(c.name)) });
      log('admin', 'Rimosso dalla classifica: ' + r.n); return { ok: r.n + ' rimosso dalla classifica' };
    }
    case 'lbreset': DB.ar = {}; touch(); for (const c of players()) send(c, { t: 'ar', ar: pub(stats(c.name)) }); log('admin', 'Classifica azzerata'); return { ok: 'Classifica azzerata' };
    case 'runs': {
      const code = str(j.code, 16), d = str(j.d, 20); if (!code || !DUNGEONS.includes(d)) return { err: 'Stanza o dungeon non valido' };
      const r = DB.runs[code] || (DB.runs[code] = {}); r[d] = int(j.v, 0, 99); touch();
      for (const c of players()) if (c.code === code) send(c, { t: 'runs', runs: r });
      log('admin', 'Stanza ' + code + ': ' + d + ' portato al ciclo ' + (r[d] + 1)); return { ok: d + ' ora è al ciclo ' + (r[d] + 1) };
    }
    case 'runsreset': {
      const code = str(j.code, 16); delete DB.runs[code]; touch();
      for (const c of players()) if (c.code === code) send(c, { t: 'runs', runs: {} });
      log('admin', 'Stanza ' + code + ': dungeon riportati al ciclo 1'); return { ok: 'Dungeon della stanza ' + code + ' azzerati' };
    }
    case 'time': {
      // sposta l'ora del mondo: h = ora del giorno (0-23,99); next = passa al giorno dopo alla stessa ora
      const m = gameMin(), day = Math.floor(m / 1440);
      let nm = j.next ? m + 1440 : day * 1440 + Math.max(0, Math.min(23.99, +j.h || 0)) * 60;
      if (!j.next && nm < m - 1) nm += 1440; // l'ora scelta è già passata oggi: si va avanti fino a quell'ora di domani
      DB.clock = { base: nm, t0: Date.now() }; touch();
      const ct = clockTxt();
      for (const p of players()) send(p, { t: 'time', gm: gameMin(), s: 'L\'admin ha cambiato l\'ora: giorno ' + ct.day + ', ore ' + ct.time });
      log('admin', 'Ora del mondo: giorno ' + ct.day + ', ore ' + ct.time); return { ok: 'Ora del mondo: giorno ' + ct.day + ', ore ' + ct.time };
    }
    case 'cfg': { const c = j.c || {}; applyCfg(c); log('admin', 'Impostazioni aggiornate: ' + Object.keys(c).join(', ')); return { ok: 'Impostazioni salvate' }; }
    case 'plugreload': { const r = reloadPlugins(); log('admin', 'Plugin ricaricati: ' + r.ok + ' attivi' + (r.err ? ', ' + r.err + ' con errori' : '')); return { ok: 'Plugin ricaricati: ' + r.ok + ' attivi' + (r.err ? ', ' + r.err + ' con errori' : '') }; }
    case 'plugtoggle': {
      const id = str(j.id, 64), i = DB.plugOff.indexOf(id), on = i >= 0; if (!PLUGS.some(p => p.id === id)) return { err: 'Plugin non trovato' };
      if (on) DB.plugOff.splice(i, 1); else DB.plugOff.push(id); touch(); reloadPlugins();
      log('admin', 'Plugin ' + id + (on ? ' attivato' : ' disattivato')); return { ok: 'Plugin ' + id + (on ? ' attivato' : ' disattivato') };
    }
    case 'save': dirty = true; flush(true); log('admin', 'Salvataggio manuale'); return { ok: 'Dati salvati in ' + path.basename(DATA) };
    case 'pw': {
      if (!checkPw(j.old)) return { err: 'La password attuale non è corretta' };
      if (typeof j.pw !== 'string' || j.pw.length < 6) return { err: 'La nuova password deve avere almeno 6 caratteri' };
      setPw(j.pw); const me = cookie(req, 'vxadm'); for (const t of [...SESS.keys()]) if (t !== me) SESS.delete(t);
      log('admin', 'Password del pannello cambiata'); return { ok: 'Password cambiata: le altre sessioni sono state chiuse' };
    }
    case 'kickall': { const s = str(j.s, 100); let n = 0; for (const c of players()) { kick(c, 'Il server ha disconnesso tutti i giocatori' + (s ? ': ' + s : '.')); n++; } log('kick', 'Espulsi tutti i giocatori (' + n + ')'); return { ok: 'Disconnessi ' + n + ' giocatori' }; }
    case 'shutdown': {
      for (const c of players()) kick(c, 'Il server è stato arrestato dall\'admin.');
      log('admin', 'Server arrestato dal pannello'); try { unloadPlugins(); } catch (e) {} dirty = true; flush(true);
      setTimeout(() => process.exit(0), 800); return { ok: 'Server in arresto…' };
    }
  }
  return { err: 'Comando sconosciuto' };
}

/* ---------- PLUGIN: moduli aggiuntivi caricati dalla cartella plugins/ ----------
   Un plugin è un file .js (plugins/nome.js) oppure una cartella con index.js (plugins/nome/index.js).
   I nomi che iniziano con "_" restano spenti; quelli che iniziano con "." vengono ignorati.
   Ogni plugin riceve un oggetto "api" tutto suo; gli errori dei plugin finiscono nel registro e non fermano il server.
   Istruzioni complete e un esempio: plugins/LEGGIMI.md e plugins/_esempio.js (creati alla prima partenza). */
const PLUG_DIR = process.env.PLUGINS_DIR ? path.resolve(process.env.PLUGINS_DIR) : path.join(__dirname, 'plugins');
const PLUGS = [];            // tutti i plugin trovati, anche spenti o con errori
const CMDS = new Map();      // comando di chat → { pl, desc, fn }
const PLUG_EVENTS = ['start', 'stop', 'join', 'leave', 'zone', 'chat', 'message', 'arena', 'dungeon', 'drop', 'pickup', 'trade'];
const GIVE_KINDS = ['gold', 'xp', 'pot', 'lv', 'item', 'heal', 'tp'];
const plugLog = (pl, s) => { LOG.push({ id: ++logId, t: Date.now(), k: 'plugin', s: '[' + pl.name + '] ' + s }); if (LOG.length > 400) LOG.shift(); console.log('[plugin ' + pl.id + '] ' + s); };
function plugFail(pl, where, e) {
  pl.errors = (pl.errors || 0) + 1; pl.lastErr = where + ': ' + (e && e.message || String(e));
  plugLog(pl, 'errore in ' + where + ': ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e)));
}
function safe(pl, where, fn, args) { try { return fn.apply(null, args || []); } catch (e) { plugFail(pl, where, e); return undefined; } }
const live = () => PLUGS.filter(p => p.ok && !p.off);

// Crea la cartella plugins/ con le istruzioni e un esempio spento, se non esiste
function plugInit() {
  if (fs.existsSync(PLUG_DIR)) return false;
  fs.mkdirSync(PLUG_DIR, { recursive: true });
  try { fs.writeFileSync(path.join(PLUG_DIR, 'LEGGIMI.md'), PLUG_README); } catch (e) {}
  try { fs.writeFileSync(path.join(PLUG_DIR, '_esempio.js'), PLUG_EXAMPLE); } catch (e) {}
  return true;
}

// Vista di un giocatore per i plugin: dati in sola lettura e azioni
function pview(c, pl) {
  if (!c) return null;
  const p = c.p || {}, who = pl ? pl.name : 'Server';
  return Object.freeze({
    id: c.id, name: c.name, room: c.code, zone: str(p.zk, 24), x: +p.x || 0, y: +p.y || 0, lv: p.lv | 0, hp: p.hp | 0, maxHp: p.mx | 0, gold: p.g | 0,
    difficulty: p.df == null ? -1 : p.df | 0, ping: c.ping == null ? -1 : c.ping, ip: c.ip, since: c.at,
    get online() { return !c.gone && clients.has(c.id); },
    tell: s => tell(c, s, who),
    send: (e, d) => send(c, { t: 'x', pl: pl ? pl.id : '', e: str(e, 40), d }),
    give: (k, n, r) => { if (!GIVE_KINDS.includes(k)) throw new Error('tipo di regalo sconosciuto: ' + k); send(c, { t: 'adm', a: k, n: int(n, 1, k === 'lv' ? 50 : k === 'pot' ? 99 : 1e6), r: int(r, 0, 3), by: who }); },
    heal: () => send(c, { t: 'adm', a: 'heal', n: 1, r: 0, by: who }),
    toTown: () => send(c, { t: 'adm', a: 'tp', n: 1, r: 0, by: who }),
    kick: s => { kick(c, 'Sei stato disconnesso' + (str(s, 100) ? ': ' + str(s, 100) : '.')); log('kick', c.name + ' espulso dal plugin ' + who + (s ? ' (' + str(s, 100) + ')' : '')); }
  });
}
// messaggio privato nel registro chat del giocatore (anche su più righe)
// messaggi lunghi del server e dei plugin: niente più tagli, le righe troppo lunghe vanno a capo (su una virgola o uno spazio)
const MSG_LINE = 400, MSG_LINES = 60;
function wrapMsg(s, max = MSG_LINE) {
  const out = [];
  for (const raw of String(s == null ? '' : s).split('\n')) {
    let l = raw.replace(/[\u0000-\u001f<>]/g, '').trim();
    while (l.length > max) {
      let cut = l.lastIndexOf(', ', max); if (cut >= max * 0.5) cut += 1; else { cut = l.lastIndexOf(' ', max); if (cut < max * 0.5) cut = max; }
      out.push(l.slice(0, cut).trim()); l = l.slice(cut).trim();
    }
    if (l) out.push(l);
  }
  return out;
}
function tell(c, s, who) {
  const L = wrapMsg(s), shown = L.length > MSG_LINES ? L.slice(0, MSG_LINES - 1).concat('… e altre ' + (L.length - MSG_LINES + 1) + ' righe') : L;
  for (const t of shown) send(c, { t: 'chat', n: who || 'Server', s: t, z: '', adm: 1 });
}
const findClient = q => { if (!q) return null; if (typeof q === 'object' && q.id) q = q.id; const s = String(q); return clients.get(s) || players().find(c => key(c.name) === key(s)) || null; };

function makeApi(pl) {
  const A = {
    id: pl.id, name: pl.name, dir: pl.dir, gameVersion: VER, port: PORT,
    config: pl.config,
    saveConfig() { try { fs.writeFileSync(pl.cfgFile, JSON.stringify(pl.config, null, 2)); } catch (e) { plugFail(pl, 'saveConfig', e); } },
    // dati che restano tra un riavvio e l'altro (salvati in voxelia-data.json)
    get store() { return DB.plug[pl.id] || (DB.plug[pl.id] = {}); },
    save() { touch(); },
    log(...a) { plugLog(pl, a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')); },
    on(ev, fn) { if (!PLUG_EVENTS.includes(ev)) throw new Error('evento sconosciuto: ' + ev + ' (validi: ' + PLUG_EVENTS.join(', ') + ')'); if (typeof fn === 'function') (pl.H[ev] || (pl.H[ev] = [])).push(fn); return A; },
    command(name, desc, fn) {
      if (typeof desc === 'function') { fn = desc; desc = ''; }
      const k = String(name || '').toLowerCase().replace(/^\//, '').replace(/[^a-z0-9_àèéìòù-]/g, '').slice(0, 24);
      if (!k || typeof fn !== 'function') throw new Error('comando non valido: ' + name);
      if (CMDS.has(k) || ['aiuto', 'help', 'comandi', 'plugin', 'plugins'].includes(k)) { plugLog(pl, 'il comando /' + k + ' esiste già: ignorato'); return A; }
      CMDS.set(k, { pl, desc: str(desc, 120), fn }); pl.cmds.push(k); return A;
    },
    onClient(ev, fn) { if (typeof fn === 'function') (pl.H['c:' + ev] || (pl.H['c:' + ev] = [])).push(fn); return A; },
    client(code) { if (typeof code === 'function') code = '(' + code.toString() + ')();'; if (typeof code === 'string' && code.trim()) pl.client.push(code); return A; },
    route(method, p, fn, o) {
      if (typeof p === 'function') { o = fn; fn = p; p = method; method = '*'; }
      const r = { m: String(method || '*').toUpperCase(), p: '/' + String(p || '').replace(/^\/+/, ''), fn, admin: !!(o && o.admin) };
      if (typeof fn !== 'function') throw new Error('route senza funzione'); pl.routes.push(r); return A;
    },
    every(ms, fn) { const t = setInterval(() => { if (pl.ok && !pl.off) safe(pl, 'every', fn); }, Math.max(250, +ms || 1000)); pl.timers.add(t); return t; },
    after(ms, fn) { const t = setTimeout(() => { pl.timers.delete(t); if (pl.ok && !pl.off) safe(pl, 'after', fn); }, Math.max(0, +ms || 0)); pl.timers.add(t); return t; },
    cancel(t) { clearInterval(t); clearTimeout(t); pl.timers.delete(t); },
    players(room) { return players().filter(c => room == null || c.code === room).map(c => pview(c, pl)); },
    player(q) { const c = findClient(q); return c && c.name && !c.gone ? pview(c, pl) : null; },
    rooms() { const r = {}; for (const c of players()) (r[c.code] || (r[c.code] = [])).push(c.name); return r; },
    tell(p, s) { const c = findClient(p); if (c) tell(c, s, pl.name); },
    announce(s, room) { const t = str(s, 300); if (!t) return 0; let n = 0; for (const c of players()) if (room == null || c.code === room) { send(c, { t: 'ann', s: t, adm: 1 }); n++; } chatPush(room == null ? '*' : room, '🧩 ' + pl.name, t, '', 1); return n; },
    say(room, s) { if (!room) return; for (const t of wrapMsg(s).slice(0, 20)) { for (const c of players()) if (c.code === room) send(c, { t: 'chat', n: pl.name, s: t, z: '', adm: 1 }); chatPush(room, pl.name, t, '', 1); } },
    broadcast(ev, d, room) { for (const c of players()) if (room == null || c.code === room) send(c, { t: 'x', pl: pl.id, e: str(ev, 40), d }); },
    server: {
      get cfg() { return Object.assign({}, CFG); },
      setCfg(c) { applyCfg(c); log('admin', 'Impostazioni cambiate dal plugin ' + pl.name + ': ' + Object.keys(c || {}).join(', ')); },
      clock: () => clockTxt(),
      leaderboard: () => Object.values(DB.ar).map(s => Object.assign({}, s)).sort((a, b) => b.pts - a.pts || b.w - a.w),
      runs: room => Object.assign({}, DB.runs[room] || {})
    }
  };
  return A;
}

// Elenca i plugin nella cartella: file .js e cartelle con index.js (o "main" del package.json)
function plugScan() {
  let names = []; try { names = fs.readdirSync(PLUG_DIR, { withFileTypes: true }); } catch (e) { return []; }
  const out = [];
  for (const d of names) {
    if (d.name[0] === '.') continue;
    let entry = null, dir = PLUG_DIR, cfgFile, id;
    if (d.isFile() && d.name.endsWith('.js')) { id = d.name.slice(0, -3); entry = path.join(PLUG_DIR, d.name); cfgFile = path.join(PLUG_DIR, id + '.config.json'); }
    else if (d.isDirectory()) {
      dir = path.join(PLUG_DIR, d.name); id = d.name; let main = 'index.js';
      try { const pk = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); if (pk && typeof pk.main === 'string') main = pk.main; } catch (e) {}
      entry = path.join(dir, main); if (!fs.existsSync(entry)) continue; cfgFile = path.join(dir, 'config.json');
    } else continue;
    out.push({ id, entry, dir, cfgFile, folder: d.isDirectory() });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

function loadPlugins() {
  const made = plugInit(); if (made) { log('sys', 'Creata la cartella dei plugin: ' + PLUG_DIR); console.log('Creata la cartella dei plugin (istruzioni in LEGGIMI.md): ' + PLUG_DIR); }
  for (const f of plugScan()) {
    const pl = { id: f.id, name: f.id, version: '', description: '', author: '', file: path.relative(__dirname, f.entry) || f.entry, dir: f.dir, cfgFile: f.cfgFile,
      ok: false, off: false, err: '', errors: 0, H: {}, cmds: [], routes: [], timers: new Set(), client: [], stop: null, config: {} };
    PLUGS.push(pl);
    if (f.id[0] === '_') { pl.off = true; pl.offWhy = 'nome con _'; continue; }
    if (DB.plugOff.includes(f.id)) { pl.off = true; pl.offWhy = 'spento dal pannello'; continue; }
    try {
      const mod = require(f.entry), M = typeof mod === 'function' ? { setup: mod } : (mod && typeof mod === 'object' ? (mod.default && typeof mod.default === 'object' ? mod.default : mod) : {});
      if (typeof M.setup !== 'function' && typeof M.init === 'function') M.setup = M.init;
      if (typeof M.setup !== 'function') throw new Error('il modulo deve esportare una funzione oppure { setup(api) { … } }');
      pl.name = str(M.name, 60) || f.id; pl.version = str(M.version, 16); pl.description = str(M.description, 300); pl.author = str(M.author, 60);
      // configurazione: valori predefiniti del plugin + file modificabile (creato se manca)
      const def = M.defaults && typeof M.defaults === 'object' ? M.defaults : null; let fileCfg = null;
      try { fileCfg = JSON.parse(fs.readFileSync(f.cfgFile, 'utf8')); } catch (e) { if (fs.existsSync(f.cfgFile)) plugLog(pl, 'config non valida (' + path.basename(f.cfgFile) + '): uso i valori predefiniti'); }
      pl.config = Object.assign({}, def || {}, fileCfg && typeof fileCfg === 'object' ? fileCfg : {});
      if (def && !fs.existsSync(f.cfgFile)) try { fs.writeFileSync(f.cfgFile, JSON.stringify(pl.config, null, 2)); } catch (e) {}
      if (typeof M.stop === 'function') pl.stop = M.stop;
      if (f.folder) { const cj = path.join(f.dir, 'client.js'); if (fs.existsSync(cj)) pl.client.push(fs.readFileSync(cj, 'utf8')); }
      pl.api = makeApi(pl); pl.ok = true;
      M.setup(pl.api);
      plugLog(pl, 'caricato' + (pl.version ? ' (v' + pl.version + ')' : '') + (pl.cmds.length ? ' · comandi: /' + pl.cmds.join(' /') : ''));
    } catch (e) { pl.ok = false; pl.err = e && e.message || String(e); plugFail(pl, 'caricamento', e); dropPlugin(pl); }
  }
  return { ok: live().length, err: PLUGS.filter(p => !p.ok && !p.off).length };
}
// toglie tutto quello che un plugin ha registrato
function dropPlugin(pl) {
  for (const t of pl.timers) { clearInterval(t); clearTimeout(t); } pl.timers.clear();
  for (const k of pl.cmds) if (CMDS.get(k) && CMDS.get(k).pl === pl) CMDS.delete(k);
  pl.cmds = []; pl.routes = []; pl.H = {}; pl.client = [];
}
function unloadPlugins() {
  for (const pl of live()) { for (const fn of pl.H.stop || []) safe(pl, 'stop', fn); if (pl.stop) safe(pl, 'stop', pl.stop, [pl.api]); }
  for (const pl of PLUGS) { dropPlugin(pl); pl.ok = false; }
  PLUGS.length = 0; CMDS.clear();
  for (const k of Object.keys(require.cache)) if (k.startsWith(PLUG_DIR + path.sep)) delete require.cache[k];
}
function reloadPlugins() { unloadPlugins(); const r = loadPlugins(); for (const pl of live()) for (const fn of pl.H.start || []) safe(pl, 'start', fn); return r; }
const plugSummary = () => { const a = live(), e = PLUGS.filter(p => !p.ok && !p.off), o = PLUGS.filter(p => p.off); return (a.length ? a.map(p => p.name).join(', ') : 'nessuno attivo') + (e.length ? ' · con errori: ' + e.map(p => p.id).join(', ') : '') + (o.length ? ' · spenti: ' + o.length : '') + '  (' + PLUG_DIR + ')'; };
const plugState = () => ({ dir: PLUG_DIR, list: PLUGS.map(p => ({ id: p.id, name: p.name, version: p.version, description: p.description, author: p.author, file: p.file, ok: p.ok, off: p.off, offWhy: p.offWhy || '', err: p.err, errors: p.errors, lastErr: p.lastErr || '', cmds: p.cmds.map(k => ({ k, d: (CMDS.get(k) || {}).desc || '' })), routes: p.routes.map(r => ({ m: r.m, p: '/plugins/' + p.id + r.p, admin: r.admin })), client: p.client.length, events: Object.keys(p.H).filter(k => !k.startsWith('c:')) })) });

// chiama i gestori di un evento: (evento, client, …altri argomenti); i giocatori arrivano come viste
function emit(ev, ...a) {
  const res = [];
  for (const pl of live()) for (const fn of pl.H[ev] || []) res.push(safe(pl, ev, fn, a.map(x => x && x.sock ? pview(x, pl) : x)));
  return res;
}
// ogni messaggio dal gioco passa prima dai plugin: se uno risponde false, il server non lo gestisce
function plugMsg(c, j) {
  if (j.t === 'x') {
    const now = Date.now(); if (now - (c.xt || 0) > 1000) { c.xt = now; c.xn = 0; } if (++c.xn > 30) return false;
    const pl = live().find(p => p.id === j.pl); if (!pl || !c.name) return false;
    for (const fn of pl.H['c:' + str(j.e, 40)] || []) safe(pl, 'onClient ' + j.e, fn, [pview(c, pl), j.d]);
    return false;
  }
  if (!c.name || j.t === 'p' || j.t === 'po') return true; // presenza e ping: troppo frequenti, si usa l'evento "zone"
  for (const pl of live()) for (const fn of pl.H.message || []) if (safe(pl, 'message', fn, [pview(c, pl), Object.assign({}, j)]) === false) return false;
  return true;
}
// chat: un plugin può bloccare il messaggio (false) o cambiarne il testo (stringa)
function plugChat(c, s, z) {
  for (const pl of live()) for (const fn of pl.H.chat || []) {
    const r = safe(pl, 'chat', fn, [pview(c, pl), s, z]);
    if (r === false) return false; if (typeof r === 'string') s = str(r, 60) || s;
  }
  return s;
}
// comandi di chat: "/nome argomenti". /aiuto e /plugin ci sono sempre
function runCommand(c, s) {
  const parts = s.slice(1).trim().split(/\s+/), k = (parts.shift() || '').toLowerCase(), rest = s.slice(1).trim().slice(k.length).trim();
  if (k === 'aiuto' || k === 'help' || k === 'comandi') {
    const L = [...CMDS.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([n, d]) => '/' + n + (d.desc ? ' — ' + d.desc : ''));
    tell(c, L.length ? 'Comandi del server:\n' + L.join('\n') + '\n/plugin — i plugin attivi' : 'Questo server non ha comandi in più. /plugin mostra i plugin attivi.', 'Server'); return;
  }
  if (k === 'plugin' || k === 'plugins') { const a = live(); tell(c, a.length ? 'Plugin attivi (' + a.length + '):\n' + a.slice().sort((x, y) => x.name.localeCompare(y.name, 'it', { numeric: true })).map(p => '• ' + p.name + (p.version ? ' ' + p.version : '') + (p.description ? ' — ' + p.description : '')).join('\n') : 'Nessun plugin attivo su questo server.', 'Server'); return; }
  const cmd = CMDS.get(k);
  if (!cmd || !cmd.pl.ok || cmd.pl.off) { tell(c, 'Comando sconosciuto: /' + str(k, 24) + '. Scrivi /aiuto per la lista.', 'Server'); return; }
  // i comandi dei plugin rispettano la chat spenta e i giocatori silenziati, come i messaggi normali (/aiuto e /plugin restano sempre disponibili)
  if (!CFG.chat) { send(c, { t: 'err', s: 'La chat è disattivata dall\'admin: i comandi dei plugin non sono disponibili' }); return; }
  if (DB.mutes.includes(key(c.name))) { send(c, { t: 'err', s: 'Sei stato silenziato dall\'admin: non puoi usare i comandi dei plugin' }); return; }
  log('plugin', c.name + ' ha usato /' + k + (rest ? ' ' + rest : ''));
  const oops = () => tell(c, 'Il comando /' + k + ' non ha funzionato: errore nel plugin ' + cmd.pl.name + '.', 'Server');
  let r, bad = false; try { r = cmd.fn(pview(c, cmd.pl), parts, rest); } catch (e) { bad = true; plugFail(cmd.pl, '/' + k, e); oops(); }
  if (bad) return;
  if (r && typeof r.then === 'function') r.then(v => { if (typeof v === 'string') tell(c, v, cmd.pl.name); }, e => { plugFail(cmd.pl, '/' + k, e); oops(); });
  else if (typeof r === 'string') tell(c, r, cmd.pl.name);
}
// pagine e API web dei plugin: /plugins/<id>/<percorso>
function plugRoute(req, res, u) {
  const m = u.match(/^\/plugins\/([^/]+)(\/.*)?$/), pl = m && live().find(p => p.id === decodeURIComponent(m[1]));
  if (!pl) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Plugin non trovato'); return; }
  const sub = m[2] || '/', r = pl.routes.find(x => x.p === sub && (x.m === '*' || x.m === req.method)) || pl.routes.find(x => x.p.endsWith('/*') && sub.startsWith(x.p.slice(0, -1)) && (x.m === '*' || x.m === req.method));
  if (!r) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Pagina non trovata'); return; }
  if (r.admin && !authed(req)) { json(res, 401, { err: 'Serve l\'accesso al pannello admin' }); return; }
  if (req.method === 'POST' && req.headers['x-voxelia'] !== '1' && r.admin) { json(res, 403, { err: 'Richiesta non valida' }); return; }
  const q = {}; try { for (const [k, v] of new URL(req.url, 'http://x').searchParams) q[k] = v; } catch (e) {}
  const x = { query: q, path: sub, ip: ipOf(req),
    json: (code, o) => { if (typeof code === 'object') { o = code; code = 200; } json(res, code, o); },
    send: (code, body, type) => { if (typeof code !== 'number') { type = body; body = code; code = 200; } res.writeHead(code, { 'Content-Type': (type || 'text/html') + '; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(String(body == null ? '' : body)); },
    body: cb => body(req, cb) };
  try { const p = r.fn(req, res, x); if (p && typeof p.catch === 'function') p.catch(e => { plugFail(pl, 'route ' + sub, e); if (!res.headersSent) json(res, 500, { err: 'Errore del plugin' }); }); }
  catch (e) { plugFail(pl, 'route ' + sub, e); if (!res.headersSent) json(res, 500, { err: 'Errore del plugin' }); }
}
// script dei plugin aggiunti alla pagina del gioco (dopo il gioco, quindi vedono tutte le sue variabili)
function plugScripts() {
  let h = '';
  for (const pl of live()) for (const code of pl.client)
    h += '<script data-plugin="' + pl.id.replace(/[^\w-]/g, '') + '">try{' + code.replace(/<\/(script)/gi, '<\\/$1') + '\n}catch(e){console.error("[plugin ' + pl.id.replace(/[^\w-]/g, '') + ']",e)}</script>';
  return h;
}

const PLUG_README = `# Plugin di Voxelia

Metti qui i plugin del server. Vengono caricati all'avvio di \`node server.js\`, oppure subito con
**Plugin → Ricarica** nel pannello admin.

- Un plugin è un file \`nome.js\` oppure una cartella \`nome/\` con dentro \`index.js\`.
- I nomi che iniziano con \`_\` restano spenti: rinomina \`_esempio.js\` in \`esempio.js\` per provarlo.
- Dal pannello admin (pagina Plugin) puoi spegnere e riaccendere ogni plugin, e vedere errori, comandi e pagine.
- Un plugin che va in errore viene segnato nel registro e non ferma il server.
- **Attenzione:** un plugin è codice che gira sul tuo server con tutti i permessi. Installa solo plugin di cui ti fidi.

## Forma di un plugin

\`\`\`js
module.exports = {
  name: 'Benvenuto', version: '1.0', author: 'Io', description: 'Saluta chi entra',
  defaults: { testo: 'Benvenuto su questo server!' },   // facoltativo: diventa nome.config.json, modificabile
  setup(api) {
    api.on('join', p => p.tell(api.config.testo));
    api.command('dado', 'tira un dado da 6', (p, args) => p.name + ' tira un dado: ' + (1 + Math.floor(Math.random() * 6)));
  },
  stop(api) { }                                         // facoltativo: quando il plugin viene spento o ricaricato
};
\`\`\`

Va bene anche \`module.exports = api => { … }\`.

## L'oggetto api

| Funzione | A cosa serve |
|---|---|
| \`api.on(evento, fn)\` | Reagisce a un evento del server (vedi sotto). |
| \`api.command(nome, descrizione, fn(p, args, testo))\` | Aggiunge il comando di chat \`/nome\`. Se \`fn\` restituisce una stringa, la riceve chi ha scritto. \`/aiuto\` li elenca tutti. I nomi \`aiuto\`, \`help\`, \`comandi\`, \`plugin\` e \`plugins\` sono riservati. Con la chat spenta o per un giocatore silenziato i comandi dei plugin non funzionano. |
| \`api.players(stanza?)\`, \`api.player(nomeOId)\` | I giocatori online (tutti o di una stanza), o uno solo. |
| \`api.rooms()\` | Le stanze con i nomi dei giocatori. |
| \`api.tell(p, testo)\` | Messaggio privato nel registro della chat. |
| \`api.say(stanza, testo)\` | Messaggio in chat a una stanza, a nome del plugin. |
| \`api.announce(testo, stanza?)\` | Annuncio in evidenza a tutti o a una stanza. |
| \`api.every(ms, fn)\`, \`api.after(ms, fn)\`, \`api.cancel(t)\` | Timer, fermati da soli quando il plugin si spegne. |
| \`api.store\`, \`api.save()\` | Un oggetto tuo che resta tra un riavvio e l'altro (dentro voxelia-data.json). Chiama \`api.save()\` dopo averlo cambiato. |
| \`api.config\`, \`api.saveConfig()\` | La configurazione: \`defaults\` più il file \`nome.config.json\` (o \`config.json\` nella cartella del plugin). |
| \`api.log(...)\` | Scrive nel terminale e nel registro del pannello admin. |
| \`api.route(metodo, percorso, fn(req, res, x), { admin })\` | Una pagina o API web su \`/plugins/<id>/<percorso>\`. \`x.json(obj)\`, \`x.send(html)\`, \`x.query\`, \`x.body(cb)\`. Con \`{ admin: true }\` serve l'accesso al pannello. Un percorso che finisce con \`/*\` vale per tutto quello che segue. |
| \`api.client(codice)\` | Codice JavaScript aggiunto alla pagina del gioco. In una cartella-plugin basta un file \`client.js\`. |
| \`api.onClient(evento, fn(p, dati))\`, \`api.broadcast(evento, dati, stanza?)\` | Messaggi tra il codice nel gioco e il plugin sul server. |
| \`api.server.cfg\`, \`api.server.setCfg({...})\` | Leggere e cambiare le impostazioni del server (pvp, trade, chat, xpm, gm, motd, maxp, lock). |
| \`api.server.clock()\`, \`api.server.leaderboard()\`, \`api.server.runs(stanza)\` | Ora del mondo, classifica dell'arena, cicli dei dungeon di una stanza. |
| \`api.id\`, \`api.name\`, \`api.dir\`, \`api.gameVersion\`, \`api.port\` | Informazioni. |

## Eventi

| Evento | Argomenti | Note |
|---|---|---|
| \`start\` | | Il server è in ascolto (anche dopo Ricarica). |
| \`stop\` | | Il plugin viene spento, ricaricato, o il server si ferma. |
| \`join\` / \`leave\` | \`p\` | Un giocatore entra o esce. |
| \`zone\` | \`p, zonaNuova, zonaVecchia\` | Cambia zona (\`town\`, \`forest\`, \`in_tavern\`, \`cripta@2\`…). |
| \`chat\` | \`p, testo, zona\` | Restituisci \`false\` per bloccare il messaggio, o una stringa per cambiarlo. |
| \`message\` | \`p, messaggio\` | Ogni messaggio grezzo dal gioco (tranne presenza e ping). \`false\` lo blocca. |
| \`arena\` | \`vincitore, sconfitto, punti\` | Una vittoria nella fossa del Colosseo. |
| \`dungeon\` | \`p, dungeon, nuovoCiclo\` | Un boss di dungeon sconfitto. |
| \`drop\` / \`pickup\` | \`p, oggetto\` (/ \`p, oggetto, daChi\`) | Oggetti gettati a terra e raccolti. |
| \`trade\` | \`a, b, datoDaA, datoDaB\` | Uno scambio concluso. |

## Il giocatore \`p\`

Dati: \`id, name, room, zone, x, y, lv, hp, maxHp, gold, difficulty, ping, ip, since, online\`.
Azioni: \`p.tell(testo)\`, \`p.give(tipo, quantità, rarità)\` con tipo \`gold\`, \`xp\`, \`pot\`, \`lv\`, \`item\` (rarità 0-3),
\`heal\`, \`tp\`; \`p.heal()\`, \`p.toTown()\`, \`p.kick(motivo)\`, \`p.send(evento, dati)\` (al codice del plugin nel gioco).

## Codice nel gioco

Il codice aggiunto con \`api.client\` o \`client.js\` gira dopo il gioco e ne vede le variabili (\`P\` è l'eroe, \`msg()\` mostra un avviso,
\`clog()\` scrive in chat, \`banner()\` mostra un titolo grande, \`NPCS\` e \`QT\` sono personaggi e missioni…). Per parlare con il server:

\`\`\`js
VXP.on('mioplugin', 'evento', dati => { … });   // dal server (p.send o api.broadcast)
VXP.send('mioplugin', 'evento', dati);          // al server (api.onClient)
\`\`\`

Il codice nel gioco arriva ai giocatori quando ricaricano la pagina.
`;

const PLUG_EXAMPLE = `// Plugin di esempio: rinomina questo file in esempio.js (senza il trattino basso) e premi
// "Ricarica" nella pagina Plugin del pannello admin, oppure riavvia il server.
module.exports = {
  name: 'Esempio',
  version: '1.0',
  description: 'Saluta chi entra, aggiunge /dado, /ora, /vittorie e /festa e una pagina web',
  defaults: { benvenuto: 'Benvenuto, {nome}! Scrivi /aiuto per i comandi del server.' },

  setup(api) {
    // saluto personale a chi entra
    api.on('join', p => p.tell(api.config.benvenuto.replace('{nome}', p.name)));

    // comandi di chat
    api.command('dado', 'tira un dado (es. /dado 20)', (p, args) => {
      const f = Math.max(2, Math.min(1000, parseInt(args[0]) || 6));
      api.say(p.room, p.name + ' tira un d' + f + ': ' + (1 + Math.floor(Math.random() * f)));
    });
    api.command('ora', "l'ora del mondo", () => { const c = api.server.clock(); return 'Giorno ' + c.day + ', ore ' + c.time; });
    // (non /boss: quel comando è del plugin Boss del mondo, e i comandi doppi vengono ignorati)
    api.command('vittorie', 'quanti boss dei dungeon hai sconfitto', p => (api.store[p.name] || 0) + ' boss sconfitti da ' + p.name);

    // dati che restano tra un riavvio e l'altro
    api.on('dungeon', (p, dungeon, ciclo) => {
      api.store[p.name] = (api.store[p.name] || 0) + 1; api.save();
      api.announce(p.name + ' ha liberato ' + dungeon + '! Ora è al ciclo ' + ciclo, p.room);
    });

    // codice nel gioco: quando il plugin manda l'evento "festa", ogni giocatore della stanza vede un titolo grande
    api.client('VXP.on(' + JSON.stringify(api.id) + ', "festa", d => banner("Festa!", d.testo, "stella"));');
    api.command('festa', 'festeggia con tutta la stanza', p => { api.broadcast('festa', { testo: p.name + ' ha dato il via alla festa!' }, p.room); });

    // una pagina web: http://localhost:3000/plugins/esempio/ (il nome del file senza .js)
    api.route('GET', '/', (req, res, x) => x.send('<h1>Eroi online: ' + api.players().length + '</h1>'));
  }
};
`;

srv.on('upgrade', (req, sock) => {
  if (req.url !== '/ws' || !req.headers['sec-websocket-key']) { sock.destroy(); return; }
  const acc = crypto.createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + acc + '\r\n\r\n');
  sock.setNoDelay(true);
  const c = { id: 'p' + nid++, sock, p: {}, buf: Buffer.alloc(0), code: '', name: '', ip: ipOf(req), at: Date.now() };
  clients.set(c.id, c); ST.total++;
  const bye = () => {
    if (!clients.has(c.id)) return; clients.delete(c.id);
    if (c.joined) { log('leave', c.name + ' è uscito'); for (const v of clients.values()) if (v.code === c.code) send(v, { t: 'join', n: c.name, j: 0 }); emit('leave', c); }
    const S = trades.get(c.id); if (S) trEnd(S, (c.name || 'Il giocatore') + ' si è disconnesso');
  };
  sock.on('data', d => { c.buf = Buffer.concat([c.buf, d]); parse(c); });
  sock.on('close', bye);
  sock.on('error', () => { bye(); sock.destroy(); });
});

// ogni 2 secondi misura il ping di tutti
setInterval(() => { const now = Date.now(); for (const c of clients.values()) send(c, { t: 'pi', s: now, me: c.ping == null ? -1 : c.ping, gm: gameMin() }); }, 2000);

// 10 volte al secondo ogni giocatore riceve lo stato di chi è nella sua stessa stanza e zona
setInterval(() => {
  for (const [id, c] of clients) {
    if (!c.p.rm || c.gone) continue;
    const o = {};
    for (const [k, v] of clients) if (k !== id && !v.gone && v.p.rm === c.p.rm) o[k] = v.p;
    send(c, { t: 's', p: o });
  }
}, 100);

(async () => {
  setPw(await choosePassword());
  loadPlugins();
  srv.listen(PORT, '0.0.0.0', () => {
    log('sys', 'Server avviato sulla porta ' + PORT);
    console.log('Voxelia ' + VER + ' in ascolto sulla porta ' + PORT);
    console.log('Stessa rete wifi:  ' + PROTO + '://localhost:' + PORT);
    for (const ip of lanIps()) console.log('                   ' + PROTO + '://' + ip + ':' + PORT);
    console.log('Wifi diverse: esponi la porta ' + PORT + ' con un tunnel (cloudflared o ngrok) e condividi l\'indirizzo https.');
    if (!TLS) console.log('Meta Quest: la realtà virtuale vuole https. Usa TLS_CERT/TLS_KEY, un tunnel o adb reverse (vedi README).');
    console.log('Pannello admin:    ' + PROTO + '://localhost:' + PORT + '/admin');
    console.log('Dati salvati in:   ' + DATA);
    console.log('Plugin:            ' + plugSummary());
    console.log('Mondi pubblicati:  ' + Object.keys(MD.w).length + '  (' + MD_DIR + ')');
    emit('start');
  });
})();
