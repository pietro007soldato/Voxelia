# Voxelia: server di gioco + pannello admin + plugin in un container.
# Nessuna dipendenza npm: serve solo Node.js 16+.
FROM node:20-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_FILE=/data/voxelia-data.json \
    MONDI_DIR=/data/mondi \
    PLUGINS_DIR=/app/plugins

WORKDIR /app
COPY server.js admin.html voxelia.html ./
# I plugin stanno nell'immagine (cartella plugins/ del repository), non nel volume.
COPY plugins ./plugins
# Le versioni precedenti del gioco (si giocano da /versioni/<versione>/, solo da soli).
COPY releases ./releases

# I dati persistenti (classifica, dungeon, ban, mondi) stanno in /data: montarlo come volume.
RUN mkdir -p /data && chown -R node:node /data /app
USER node

VOLUME ["/data"]
EXPOSE 3000

# Con TLS_CERT/TLS_KEY il server risponde solo in https (certificato anche autofirmato): il controllo segue il protocollo.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const t=process.env.TLS_CERT;require(t?'https':'http').get((t?'https':'http')+'://127.0.0.1:'+process.env.PORT+'/salute',{rejectUnauthorized:false},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# HTTPS facoltativo: monta cert e chiave PEM (es. in /certs) e imposta TLS_CERT=/certs/cert.pem TLS_KEY=/certs/key.pem.
# Imposta ADMIN_PASSWORD a runtime (non nel Dockerfile) per evitare di salvare segreti nell'immagine.
CMD ["node", "server.js"]
