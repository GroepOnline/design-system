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

## Categorieën

`cat` in catalog.json: primitieven · gesprek · bewijs · structuur. Nieuwe
componenten krijgen verplicht een categorie; rail/gallery groeperen erop.
Typografie- en icon-regels: DESIGN.md §11-§13 (schaal-tokens verplicht,
sprite-svg's altijd fill:none + stroke:currentColor).

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

## Cursor Cloud specific instructions

Standalone static design-system. No package manager, no third-party deps: the
`ds` CLI is pure Python 3.12 stdlib. There is nothing to install, and the repo
carries no `.cursor/environment.json` or setup script: when Cursor Cloud asks
for an install/update command, `python3 --version` is enough as a runtime check.

- Lint/validate: `./ds check` (source of truth for the `check` CI step).
  Warnings (non-URL sources, em-dashes) are expected and do not fail; only
  `errors` matter.
- Build/generate: `./ds build`. Generated output (`components/*/index.html`,
  `components/index.html`, `docs/`, `taste-site/`) is committed. CI's
  `python3 ds build --check` step is effectively a plain build (the `--check`
  arg is ignored by `main()`), so after any `ds` mutation keep the tree
  idempotent: run `./ds build` and confirm `git diff` is empty.
- Run/serve (dev): serve from the repo root, e.g.
  `python3 -m http.server 8000`, then open
  `http://localhost:8000/components/`. You MUST serve from root, not `file://`:
  generated pages use root-absolute asset paths (`/tokens.css`,
  `/components/icons.svg#…`, `/components/lib.js`).
- Any `./ds ... add|select|remove` mutation auto-rebuilds the web output, so no
  separate build step is needed after CLI mutations.
- Theme/style live in the generated shell script (`SHELL_FOOT` in `ds`), not in
  `components/lib.js`: the bottom-left toggles write `ds-theme` / `ds-style` to
  `localStorage`, and on load the page restores those values or the
  `?theme=dark` / `?style=strak` deep-link, with the URL param winning. Change
  this in the generator, never in the generated HTML. `components/lib.js` only
  applies `?theme=` plus the gallery postMessage on standalone variant pages;
  it handles neither style nor persistence.
- Caveat when you test that: the restore path is currently broken. `setTheme`
  runs at the top level before `let curTheme, curStyle` is initialized, so any
  load with a theme or style to restore throws a ReferenceError and aborts the
  rest of the shell script (`/components/?theme=dark` still renders light).
  Moving that declaration above the calls in `ds` and rebuilding fixes it.
- Fonts load from external CDNs (Fontshare/Google); offline the layout still
  works with fallback fonts.
