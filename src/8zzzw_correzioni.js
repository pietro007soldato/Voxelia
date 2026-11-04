/* ================= 7.50: correzioni generali =================
   - Niente più cose una sopra l'altra: quando una zona è pronta, un personaggio, una raccolta o un forziere che sta sopra
     una porta, sopra un altro personaggio o sopra un oggetto con cui si interagisce viene spostato nella casella libera più
     vicina (raggiungibile a piedi). Succedeva soprattutto nei villaggi di Tomorrow (abitanti sulle porte delle case). */
const UNST={n:0};
function unstack50(){if(!ZZ||!started||!P)return;const d=bfs(P.px|0,P.py|0),busy=new Set(),key=(x,y)=>x+','+y,L=ents.filter(e=>e.px!=null&&(e.k==='po'||ITK.has(e.k)));
  for(const e of L)if(e.k==='po')busy.add(key(e.px|0,e.py|0));
  const mov=e=>e.k==='npc'&&!e.wg&&!e.boat&&!e.rod||e.k==='res'||e.k==='ch'&&!e.rich;let n=0;
  for(const e of L){if(e.k==='po')continue;const x=e.px|0,y=e.py|0,k=key(x,y);
    if(busy.has(k)&&mov(e)){let best=null;for(let r=1;r<4&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r&&!best;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const u=x+dx,v=y+dy;
        if(u<1||v<1||u>=N-1||v>=N-1||!WK(M[v][u])||busy.has(key(u,v))||d[v*N+u]<0)continue;if(DEC[v]&&DEC[v][u]&&DEC[v][u][0]!=='₪'&&M[v][u]!==4)continue;best=[u,v]}
      if(best){e.px=best[0]+.5;e.py=best[1]+.5;if(e.hx!=null){e.hx=e.px;e.hy=e.py}n++;busy.add(key(best[0],best[1]));continue}}
    busy.add(k)}
  UNST.n=n}
const _loadPost750c=loadPost;loadPost=function(k){_loadPost750c(k);try{unstack50()}catch(e){console.warn('correzioni',e)}};
// - I testi lunghi nelle righe dei pannelli vanno a capo invece di uscire di lato (il Diario scorreva in orizzontale:
//   «nel Porto di Aldoria: il pozzo pieno di alghe…» non entrava). Vale per le righe .it e .x43r di tutti i pannelli.
(function(){const st=document.createElement('style');st.textContent=`.it>span{min-width:0}.it>span:last-child.mu,.it>span.mu:last-child{flex-shrink:1;white-space:normal;overflow-wrap:anywhere}
.x43r>span{min-width:0;overflow-wrap:anywhere}#pn{overflow-x:hidden}#pn img{max-width:100%}`;document.head.appendChild(st)})();
// - Il pannello delle benedizioni della Torre si apre solo dentro la Torre (prima, aperto da fuori, dava errore)
{const tb0=X43P.torb;X43P.torb=()=>TOR.run?tb0():`<p class="mu">Le benedizioni si scelgono dentro la Torre, dopo aver ripulito un piano.</p><button onclick="cl()">Chiudi</button>`}
