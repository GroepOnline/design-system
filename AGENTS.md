# AGENTS.md -- instructies voor AI-agents die met dit design-system werken

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
3. **Gegenereerde bestanden.** `components/*/index.html`, `components/index.html`,
   `docs/`, `taste-site/` en `brain-site/` zijn output van `ds build`. Nooit
   handmatig bewerken -- wijzig het manifest, `brain/**/*.md`, of de generator (`ds`).
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
./ds build                                 # volledige web rebuild (catalogus + docs + taste + brain)
./ds serve [port]                          # lokale web-server vanaf de root (default 8085)
./ds brain build                           # brain/**/*.md → brain-site/
./ds brain check                           # unresolved wikilinks (warning-only)
./ds brain new decision <titel>            # scaffold decision-note
./ds brain new research <titel>            # scaffold research-note
./ds brain signal "tekst"                  # expliciete signal (geen auto-write)
./ds brain eval                            # scorecard → brain/eval/scorecard.json
./ds brain gate                            # eval + hard fail bij drempels
```

Elke mutatie herbouwt web automatisch. CLI en web lezen hetzelfde manifest;
er bestaat geen tweede bron.

## Brain (niet-bindende context)

Agents mogen `brain/**/*.md` lezen en schrijven voor research/decisions.
Product-waarheid blijft `DESIGN.md`, `tokens.css`, `taste/`,
`components/*/catalog.json`. Productregels lopen uitsluitend via de
bestaande taste-propagatie (taste-log → taste-rules → DESIGN.md). Een
`brain/Decisions/`-note overschrijft nooit DESIGN.md, tokens.css of
catalog.json direct. Geen `obsidian`-CLI-calls in geautomatiseerde flows --
alleen directe file-writes.

Signals (`brain/signals/signals.yaml`) alleen via `./ds brain signal`.
Scorecard (`brain/eval/scorecard.json`) via `./ds brain eval`; CI hard-failt
met `./ds brain gate`. Zie decision
`brain/Decisions/2026-07-30 Brain signals eval dual gate.md`.

Optioneel lokaal (Obsidian GUI moet open, vault **brain**):
`XDG_RUNTIME_DIR=/run/user/$UID obsidian vault=brain files|search|read …`.
Zie `brain/README.md`.

## Agent-laag (`.agents/`)

Canonieke, tool-onafhankelijke skills, subagents en hooks. `.cursor/` is een dunne
overlay: symlinks naar `.agents/skills/*` plus `.cursor/hooks.json` als wiring.
Subagents (`.agents/subagents/`) voeren fase-werk uit; de `non-design-pipeline`
skill orkestreert Fase 1-3 in volgorde met gates. Nooit een tweede bron aanmaken.

| Skill | Waarvoor |
|---|---|
| `design-system-brain` | vault gebruiken, `ds brain`, grenzen, Obsidian CLI |
| `brain-note-hygiene` | frontmatter, wikilinks, naamgeving, 0 warnings |
| `brain-decision-capture` | decision, research of taste-log kiezen |
| `non-design-pipeline` | chained orchestratie Fase 1-3 (foundation-repair → dna-propagation → ci-agent-sync) met gates |

| Subagent | Fase |
|---|---|
| `foundation-repair` | 1: relatief-pad reparatie, regressies, build/check idempotentie |
| `dna-propagation` | 2: Devin-DNA meting → references/, PLAN.md blokkades |
| `ci-agent-sync` | 3: CI + org-sync, taste-overlays, docs, .gitignore |
| `design-polish` | 4: visueel design (gated op Joep-goedkeuring) |

| Hook | Event | Gedrag |
|---|---|---|
| `guard-generated.sh` | `preToolUse` (Write) | weigert edits in gegenereerde output (invariant 3) |
| `brain-build.sh` | `afterFileEdit` | herbouwt `brain-site/` na een vault-note edit |

Agent-gedrag-taste (canonieke `taste.yaml` met per-tool generators) staat
**buiten dit repo** (besluit 2026-07-30): gedeeld punt in `kater-dev-tools`
(PR https://github.com/OnlineChefGroep/kater-dev-tools/pull/174). Zie `brain/Decisions/2026-07-30 Agent-taste buiten dit repo.md`.
Geen `.agents/registry/taste.yaml` hier aanmaken.

Dit repo **consumeert** wel de gegenereerde overlays:
`.commandcode/taste/taste.md`, `.cursor/rules/taste.mdc` en de gemarkeerde
taste-sectie in `CLAUDE.md`. Regenereren/checken gebeurt met
`kater-dev-tools/.agents/scripts/generate-taste.py --target <repo>`.
Nooit de gegenereerde overlays handmatig bewerken.

## Design-regels (harde bans, uit DESIGN.md §10)

- Geen spinners/loaders -- activiteit = worked-row + tool-ripples (1.1s, stopt)
- Geen emoji als icoon -- Lucide SVG (`components/icons.svg`, 29 symbols)
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
| `brain/` | Obsidian Second Brain (niet-bindende context) |
| `brain-site/` | gegenereerde leeslaag uit `brain/` (`ds brain build`) |
| `.agents/` | canonieke agent-skills + hooks (`.cursor/` is overlay) |
| `new-project.sh` | scaffold nieuw product vanuit dit systeem |

## Cursor Cloud specific instructions

Standalone static design-system. No package manager, no third-party deps: the
`ds` CLI is pure Python 3.12 stdlib. There is nothing to install, and the repo
carries no `.cursor/environment.json` or setup script: when Cursor Cloud asks
for an install/update command, `python3 --version` is enough as a runtime check.
Remote: `https://github.com/GroepOnline/design-system.git` (org: GroepOnline).
CI: `.github/workflows/validate.yml` (build + check + brain gate) en
`.github/workflows/brain-eval.yml` (nightly scorecard + issues op gate-fail).

- Lint/validate: `./ds check` (source of truth for the `check` CI step).
  Warnings (non-URL sources, em-dashes) are expected and do not fail; only
  `errors` matter.
- Build/generate: `./ds build`. Generated output (`components/*/index.html`,
  `components/index.html`, `docs/`, `taste-site/`, `brain-site/`) is committed. CI's
  `python3 ds build --check` runs a full build and then fails hard if the
  working tree shows drift (`git status --porcelain` non-empty), so after any
  `ds` mutation keep the tree idempotent: run `./ds build --check` and confirm
  it reports "idempotent (geen drift)".
- Run/serve (dev): serve from the repo root, prefer `./ds serve` (default port
  8085; override with `./ds serve <port>`), then open
  `http://localhost:<port>/components/`. `python3 -m http.server` is a plain
  fallback for the same root-absolute layout. You MUST serve from root, not
  `file://`: generated pages use root-absolute asset paths (`/tokens.css`,
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
- Caveat when you test that: the restore path had a TDZ issue where `setTheme`
  ran at the top level before `let curTheme, curStyle` was initialized. This was
  **fixed in v2** -- `curTheme`/`curStyle` declarations are now placed above the
  restore calls in `SHELL_FOOT` (`ds` line 449). If `?theme=dark` still renders
  light, check that `let curTheme` appears before the `wantTheme` restore block.
- Fonts load from external CDNs (Fontshare/Google); offline the layout still
  works with fallback fonts.
