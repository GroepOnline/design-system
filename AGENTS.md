# AGENTS.md — instructies voor AI-agents die met dit design-system werken

> Machine-gericht. Menselijke uitleg: `README.md` en `WORKFLOW.md`.
> Taste-regels (binding): `taste/taste-rules.md`. Taal: `DESIGN.md`.

## Wat dit is

Design-system v2 ("Devin-richting") voor agent-producten. Standalone.
Bron van waarheid per component: `components/<naam>/catalog.json`.

## Invarianten (nooit breken)

1. **Lock-model.** Catalogus-entries zijn onveranderlijk (`locked`) tot expliciete
   `ds select` (maakt ACTIEF) of `ds remove`. Nooit een entry-file in-place
   overschrijven; nieuwe versie = nieuwe id of expliciete remove+add.
2. **Origin-split.** `self/` = eigen ontwerpen (incl. aangepaste externe).
   `external/` = ongewijzigde referenties met `source`-veld verplicht.
3. **Gegenereerde bestanden.** `components/*/index.html` en `components/index.html`
   zijn output van `ds build`. Nooit handmatig bewerken — wijzig het manifest
   of de generator (`ds`).
4. **Playground.** Experimenten alleen in `playground/`. Promotie uitsluitend
   via `ds <comp> add`. De CLI maakt paden root-absoluut bij promotie.
5. **Single-active.** Exact 1 entry per component heeft status `active`.
   `ds select` handhaaft dit automatisch.

## Commando's

```bash
./ds list                                  # overzicht: entries, active, self/ext per component
./ds <comp> list                           # entries + docs (use/avoid) van één component
./ds <comp> select <id>                    # active wisselen + web rebuild
./ds <comp> add <pad> --id x --origin self|external [--source s] [--note n]
./ds <comp> remove <id> [--yes]            # --yes vereist als entry ACTIEF is
./ds build                                 # volledige web rebuild
```

Elke mutatie herbouwt web automatisch. CLI en web lezen hetzelfde manifest;
er bestaat geen tweede bron.

## Design-regels (harde bans, uit DESIGN.md §10)

- Geen spinners/loaders — activiteit = worked-row + tool-ripples (1.1s, stopt)
- Geen emoji als icoon — Lucide SVG (`components/icons.svg`, 29 symbols)
- Geen em-dashes in copy
- Eén accent (`--accent`). Groen = git, amber = wacht-op-jou, rood = destructief/diff-del. Gereserveerd, nooit decoratief
- Koppen weight 500, tracking −0.02em. Mono alleen voor data (timer, diff, branch, cmd, pad)
- Geen paars, geen gradients in UI, geen glassmorphism, geen cards-in-cards, geen shadow op product-cards
- Light én dark (`data-theme="dark"`) zijn first-class; test beide (`?theme=dark`)

## Componenten toevoegen of wijzigen

1. Werk in `playground/` (relatieve paden ok).
2. `./ds <comp> add playground/<bestand>.html --id <id> --origin self --note "wat en waarom"`
3. Selecteer indien gewenst: `./ds <comp> select <id>`
4. Commit met prefix `component:` of `taste:`.

Nieuwe component-familie: map + `catalog.json` aanmaken (bestaand manifest als
template), dan `./ds build`.

## Taste-propagatie (verplicht, zelfde commit)

taste-log entry → (2+ observaties) → regel in `taste/taste-rules.md` →
update: `DESIGN.md` + `tokens.css` + geraakte `components/` + `surfaces/`.
Een regel die alleen in taste-rules staat, bestaat niet.

## Bestandskaart

| Pad | Rol |
|---|---|
| `ds` | CLI + web-generator (python3, geen deps) |
| `tokens.css` | tokens + primitives (btn, gbtn, badge, switch, seg, input, select, setting) |
| `components/icons.svg` | 29 Lucide symbols (`<use href="...#i-*">`) |
| `components/lib.js` | thema deep-link + switch-gedrag voor varianten |
| `prototype-v2.html` | volledige referentie-app (3-pane sessie) |
| `references/` | meetlat-screenshots (Devin-product, eigen states) |
| `surfaces/` | per-surface briefs |
| `motion-spec.md` | motion-fysica (gelockt) |
| `new-project.sh` | scaffold nieuw product vanuit dit systeem |
