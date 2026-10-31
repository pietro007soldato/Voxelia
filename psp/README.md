# Voxelia per PSP

Versione nativa per PlayStation Portable (homebrew, serve il firmware personalizzato).
Grafica a blocchi isometrica disegnata con il GU della PSP, niente vista 3D.
Per installarla basta l'archivio `releases/voxelia_v7.50_psp.zip`: le istruzioni per i giocatori sono in `LEGGIMI.txt`.

## Compilare

Serve il PSPSDK di [pspdev](https://github.com/pspdev/pspdev) (la versione già compilata per Linux va bene):

```sh
export PSPDEV=/percorso/pspdev; export PATH=$PSPDEV/bin:$PATH
cd psp && make            # crea EBOOT.PBP
```

## I file

| File | Cosa contiene |
|---|---|
| `src/main.c` | ciclo principale, titolo, salvataggi, controlli |
| `src/gfx.c` | proiezione isometrica, blocchi, mesh statica a pezzi 4×4, testo, aloni di luce, buio dei dungeon |
| `src/models.c` | i modelli a blocchi del gioco, girati nelle quattro direzioni e animati |
| `src/data.c` | nemici, oggetti, dungeon, personaggi e missioni (gli stessi del gioco per computer) |
| `src/world.c` | generazione delle zone, degli interni e dei dungeon, arredi, edifici, minimappa |
| `src/game.c` | eroe, combattimento, abilità, bottino, missioni, storia, Thalassa, arena, disegno delle entità |
| `src/ui.c` | barre, minimappa, dialoghi, menu, negozi, mappa |
| `src/audio.c` | suoni e musichette sintetizzati |
| `src/autotest.c` | prova automatica (solo con `make EXTRA=-DAUTOTEST`) |
| `src/font.h` | il font (generato da `tools/mkfont.py`) |

## Provare senza PSP

`runtest.sh` compila la versione di prova e la fa girare in `PPSSPPHeadless` (l'emulatore PPSSPP senza finestra):
il gioco si gioca da solo (nuova partita, castello, viaggio a piedi fino alla Tana e ritorno, tutte le zone e i dungeon,
santuari, Quetzal, Malakar, arena, salvataggio, morte), scrive `autotest.log` e scatta le foto dello schermo.
