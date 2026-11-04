#!/bin/sh
# Verifica di Voxelia prima di pubblicare (7.53). Si lancia dalla cartella del progetto:  sh tools/verifica.sh
# Controlla, senza installare niente (servono solo sh e Node.js 16+):
#  1. la build: build.sh rifà voxelia.html e controlla la sintassi; in CI (VERIFICA_CI=1) la build nel repository deve
#     essere già aggiornata, cioè uguale a quella appena rifatta;
#  2. la sintassi di server.js e dei plugin;
#  3. la versione: GAME_VER, il titolo e il numero nel menu, il server, la voce in cima al CHANGELOG, la build in releases/;
#  4. un server di prova su una porta libera, con dati temporanei: /salute, il gioco (anche compresso e con l'ETag),
#     l'elenco delle versioni, una versione precedente e il pannello admin.
# Esce con 0 se è tutto a posto, con 1 al primo problema (e dice quale).
cd "$(dirname "$0")/.." || exit 1
ko() { echo "✗ $1"; exit 1; }
ok() { echo "✓ $1"; }

sh build.sh >/dev/null || ko "build.sh: la build non riesce (vedi l'errore sopra)"
ok "build e sintassi del gioco"
if [ "$VERIFICA_CI" = "1" ] && command -v git >/dev/null 2>&1; then
  git diff --quiet -- voxelia.html src/9_changelog.js || ko "voxelia.html non è aggiornato: esegui sh build.sh e fai il commit della build"
  ok "la build nel repository è quella dei sorgenti"
fi

node --check server.js || ko "server.js ha un errore di sintassi"
for f in plugins/*.js; do node --check "$f" || ko "$f ha un errore di sintassi"; done
ok "sintassi di server.js e dei plugin"

node -e "
const fs=require('fs');const g=fs.readFileSync('src/1_core.js','utf8').match(/const GAME_VER='([^']+)'/),h=fs.readFileSync('src/head.html','utf8'),s=fs.readFileSync('server.js','utf8'),c=fs.readFileSync('CHANGELOG.md','utf8');
const v=g&&g[1],bad=[];if(!v)bad.push('GAME_VER non trovato in src/1_core.js');
if(!h.includes('<title>Voxelia '+v+' '))bad.push('il <title> di src/head.html non dice '+v);
if(!h.includes('<sup id=\"ver\">'+v+'</sup>'))bad.push('il numero nel menu (sup id=ver) non è '+v);
if(!s.includes(\"const VER = '\"+v+\"'\"))bad.push('VER di server.js non è '+v);
if(!s.split('\n')[0].includes('Voxelia '+v+':'))bad.push('la prima riga di server.js non dice '+v);
const top=(c.match(/^## ([0-9.]+)/m)||[])[1];if(top!==v)bad.push('la prima voce del CHANGELOG è '+top+', non '+v);
if(!fs.existsSync('releases/voxelia_v'+v+'.html'))bad.push('manca releases/voxelia_v'+v+'.html');
else if(!fs.readFileSync('releases/voxelia_v'+v+'.html').equals(fs.readFileSync('voxelia.html')))console.log('! attenzione: releases/voxelia_v'+v+'.html è diversa da voxelia.html (va ricopiata se la build è cambiata)');
if(!fs.readFileSync('releases/LEGGIMI.md','utf8').includes('| ['+v+'](voxelia_v'+v+'.html) |'))bad.push('manca la riga della '+v+' in releases/LEGGIMI.md');
if(bad.length){console.error(bad.map(x=>'  - '+x).join('\n'));process.exit(1)}console.log('versione '+v)
" || ko "i numeri di versione non tornano"
ok "versione coerente ovunque"

TMP=$(mktemp -d) || ko "non riesco a creare una cartella temporanea"
PORTA=$(node -e "const s=require('net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
cp -R plugins "$TMP/plugins"   # i plugin scrivono le loro configurazioni: meglio in una copia
ADMIN_PASSWORD=verifica-$$ PORT=$PORTA DATA_FILE="$TMP/dati.json" MONDI_DIR="$TMP/mondi" PLUGINS_DIR="$TMP/plugins" node server.js >"$TMP/server.log" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null; wait $PID 2>/dev/null; rm -rf "$TMP" 2>/dev/null' EXIT INT TERM
node -e "
const http=require('http'),zlib=require('zlib'),fs=require('fs'),P=$PORTA;
const get=(p,h)=>new Promise((r,j)=>{const q=http.get({host:'127.0.0.1',port:P,path:p,headers:h||{}},res=>{const a=[];res.on('data',d=>a.push(d));res.on('end',()=>r({s:res.statusCode,h:res.headers,b:Buffer.concat(a)}))});q.on('error',j);q.setTimeout(20000,()=>q.destroy(new Error('tempo scaduto')))});
const fail=m=>{console.error('  - '+m);process.exit(1)};
(async()=>{
  let up=false;for(let i=0;i<100&&!up;i++){try{up=(await get('/salute')).s===200}catch(e){await new Promise(r=>setTimeout(r,200))}}
  if(!up)fail('il server non risponde (vedi il registro qui sotto)');
  const v=fs.readFileSync('src/1_core.js','utf8').match(/const GAME_VER='([^']+)'/)[1];
  const s=JSON.parse((await get('/salute')).b);if(s.versione!==v)fail('/salute dice '+s.versione+' invece di '+v);
  const g=await get('/',{'accept-encoding':'gzip'});if(g.s!==200)fail('/ risponde '+g.s);
  const html=(g.h['content-encoding']==='gzip'?zlib.gunzipSync(g.b):g.b).toString();
  if(!html.includes(\"const GAME_VER='\"+v+\"'\"))fail('il gioco servito non è la '+v);
  if(!html.includes('window.GAME_WS=1'))fail('il gioco servito non ha il collegamento al server');
  if(g.h['content-encoding']!=='gzip')fail('il gioco non arriva compresso');
  if((await get('/',{'if-none-match':g.h.etag})).s!==304)fail('l\'ETag del gioco non funziona');
  const L=JSON.parse((await get('/versioni')).b);if(L.attuale!==v||!Array.isArray(L.versioni))fail('/versioni non va');
  if(L.versioni.length){const o=L.versioni[0];const r=await get('/versioni/'+o.v+'/');if(r.s!==200||!String(r.h['content-security-policy']).includes(\"connect-src 'none'\"))fail('la versione '+o.v+' non si apre come dovrebbe')}
  const a=await get('/admin');if(a.s!==200||a.h['x-frame-options']!=='DENY')fail('/admin non va');
  console.log('server: /salute, gioco compresso con ETag, '+L.versioni.length+' versioni precedenti, admin')
})().catch(e=>fail(e.message));
" || { echo "--- registro del server ---"; tail -20 "$TMP/server.log"; ko "il server di prova non va"; }
grep -q "Error\|TypeError\|ReferenceError" "$TMP/server.log" && { tail -20 "$TMP/server.log"; ko "errori nel registro del server"; }
ok "server di prova"
echo "Tutto a posto."
