# AGENTS.md -- instructies voor AI-agents die met dit design-system werken

> Machine-gericht. Menselijke uitleg: `README.md`, `WORKFLOW.md`, `hoe-wat.md`.
> Bindend: `DESIGN.md` (taal + bans), `taste/taste-rules.md` (taste),
> `motion-spec.md` (gelockt). Kompas: `PLAN.md` (visie + routekaart).

## Wat dit is

Design-system v2 ("Devin-richting") voor agent-producten. Standalone, geen
npm-package: kopieermodel (shadcn-achtig). Bron van waarheid per component:
`components/<naam>/catalog.json`. Tokens + primitives: `tokens.css`.
Skins: `styles.json` (één `data-style`-attribuut wisselt de hele feel).

## Invarianten (nooit breken)

1. **Lock-model.** Catalogus-entries zijn onveranderlijk (`locked`) tot
   expliciete `ds select` (maakt ACTIEF) of `ds remove`. Nooit een entry-file
   in-place overschrijven; nieuwe versie = nieuwe id of expliciete remove+add.
2. **Origin-split.** `self/` = eigen ontwerpen (incl. aangepaste externe).
   `external/` = ongewijzigde referenties met verplicht `source`-veld.
3. **Gegenereerde bestanden.** `index.html`, `components/index.html`,
   `components/*/index.html`, `docs/`, `taste-site/` en `brain-site/` zijn
   output van `ds build`. Nooit handmatig bewerken -- wijzig het manifest,
   `brain/**/*.md`, of de generator (`ds`).
4. **Playground.** Experimenten alleen in `playground/`. Promotie uitsluitend
   via `ds <comp> add` (de CLI maakt paden root-absoluut bij promotie).
5. **Single-active.** Exact 1 entry per component heeft status `active`;
   `ds select` handhaaft dit automatisch.

## Commando's

```bash
./ds list                                  # overzicht: entries, active, self/ext per component
./ds <comp> list                           # entries + docs (use/avoid) van één component
./ds <comp> select <id>                    # active wisselen + web rebuild
./ds <comp> add <pad> --id x --origin self|external [--source s] [--note n]
./ds <comp> remove <id> [--yes]            # --yes vereist als entry ACTIEF is
./ds check                                 # validate (warnings ok, alleen errors falen)
./ds build                                 # volledige web rebuild (catalogus + docs + taste + brain)
./ds build --check                         # build + hard fail als de tree drift
./ds serve [port]                          # lokale server vanaf de root (default 8085)
./ds style list                            # skins uit styles.json
./ds style add <naam> --css-file <file> [--desc "..."]
./ds brain build                           # brain/**/*.md → brain-site/
./ds brain check                           # unresolved wikilinks (warning-only)
./ds brain new decision <titel>            # scaffold decision-note
./ds brain new research <titel>            # scaffold research-note
./ds brain signal "tekst"                  # expliciete signal (geen auto-write)
./ds brain eval                            # scorecard → brain/eval/scorecard.json
./ds brain gate                            # eval + hard fail bij drempels
```

Elke `add`/`select`/`remove`/`style add` mutatie herbouwt web automatisch.
CLI en web lezen hetzelfde manifest; er bestaat geen tweede bron.

## Componenten toevoegen of wijzigen

1. Werk in `playground/` (relatieve paden ok).
2. `./ds <comp> add playground/<bestand>.html --id <id> --origin self --note "wat en waarom"`
3. Selecteer indien gewenst: `./ds <comp> select <id>`
> 4. Commit met prefix `component:` of `taste:`.

Nieuwe component-familie: map + `catalog.json` aanmaken (bestaand manifest als
template), dan `./ds build`. Elke component krijgt verplicht een `cat`:
primitieven · gesprek · bewijs · structuur (rail/gallery groeperen erop).

## Taste-propagatie (verplicht, zelfde commit)

taste-log entry → (2+ observaties) → regel in `taste/taste-rules.md` →
update: `DESIGN.md` + `tokens.css` + geraakte `components/` + `surfaces/`.
Een regel die alleen in taste-rules staat, bestaat niet.

## Design-regels (harde bans, uit DESIGN.md §10)

- Geen spinners/loaders -- activiteit = worked-row + tool-ripples (1.1s, stopt).
  worked-row is **agent-output, nooit input**: in productie vult een agent de
  rijen; de knoppen in de demo bootsen tool-calls alleen na. Een human klikt
  alleen om uit te klappen.
- Geen emoji als icoon -- Lucide SVG-sprite (`components/icons.svg`,
  `<use href="...#i-*">`)
- Geen em-dashes in copy
- Eén accent (`--accent`). Groen = git, amber = wacht-op-jou, rood =
  destructief/diff-del. Gereserveerd, nooit decoratief
- Koppen weight 500, tracking −0.02em. Mono alleen voor data (timer, diff,
  branch, cmd, pad)
- Geen paars, geen gradients in UI, geen glassmorphism, geen cards-in-cards,
  geen shadow op product-cards
- Light én dark (`data-theme="dark"`) én mobiel (390px) zijn first-class;
  test alle drie (`?theme=dark`, smal viewport)
- Typografie/iconen: DESIGN.md §11-§13 (schaal-tokens verplicht; sprite-svg's
  altijd `fill:none` + `stroke:currentColor`)

## Brain (niet-bindende context)

Agents mogen `brain/**/*.md` lezen en schrijven voor research/decisions.
Product-waarheid blijft `DESIGN.md`, `tokens.css`, `taste/`,
`components/*/catalog.json`. Een `brain/Decisions/`-note overschrijft nooit
DESIGN.md, tokens.css of catalog.json direct; productregels lopen uitsluitend
via de taste-propagatie hierboven. Geen `obsidian`-CLI-calls in
geautomatiseerde flows -- alleen directe file-writes.

Signals (`brain/signals/signals.yaml`) alleen via `./ds brain signal`.
Scorecard (`brain/eval/scorecard.json`) via `./ds brain eval`; CI hard-failt
met `./ds brain gate`. Zie decision
`brain/Decisions/2026-07-30 Brain signals eval dual gate.md`.

Optioneel lokaal (Obsidian GUI moet open zijn, vault **brain**):
`XDG_RUNTIME_DIR=/run/user/$UID obsidian vault=brain files|search|read …`.
Zie `brain/README.md`.

## Agent-laag (`.agents/`)

Canonieke, tool-onafhankelijke skills, subagents en hooks. `.cursor/` is een
dunne overlay: symlinks naar `.agents/skills/*` plus `.cursor/hooks.json` als
wiring. Subagents voeren fase-werk uit; de `non-design-pipeline` skill
orkestreert Fase 1-3 in volgorde met gates. Nooit een tweede bron aanmaken.

| Skill | Waarvoor |
| --- | --- |
| `design-system-brain` | vault gebruiken, `ds brain`, grenzen, Obsidian CLI |
| `brain-note-hygiene` | frontmatter, wikilinks, naamgeving, 0 warnings |
| `brain-decision-capture` | decision, research of taste-log kiezen |
| `non-design-pipeline` | chained orchestratie Fase 1-3 met gates |

| Subagent | Fase |
| --- | --- |
| `foundation-repair` | 1: relatief-pad reparatie, regressies, build/check idempotentie |
| `dna-propagation` | 2: Devin-DNA meting → references/, PLAN.md blokkades |
| `ci-agent-sync` | 3: CI + org-sync, taste-overlays, docs, .gitignore |
| `design-polish` | 4: visueel design (gated op Joep-goedkeuring) |

| Hook | Event | Gedrag |
| --- | --- | --- |
| `.agents/hooks/guard-generated.sh` | `preToolUse` (Write) | weigert edits in gegenereerde output (invariant 3) |
| `.agents/hooks/brain-build.sh` | `afterFileEdit` | herbouwt `brain-site/` na een vault-note edit |

Agent-gedrag-taste (canonieke `taste.yaml` met per-tool generators) staat
**buiten dit repo** (besluit 2026-07-30, zie
`brain/Decisions/2026-07-30 Agent-taste buiten dit repo.md`): gedeeld punt in
`kater-dev-tools`. Geen `.agents/registry/taste.yaml` hier aanmaken.

Dit repo **consumeert** wel de gegenereerde overlays:
`.commandcode/taste/taste.md`, `.cursor/rules/taste.mdc` en de gemarkeerde
taste-sectie in `CLAUDE.md`. Regenereren/checken met
`kater-dev-tools/.agents/scripts/generate-taste.py --target <repo>`.
Nooit de gegenereerde overlays handmatig bewerken.

## Bestandskaart

| Pad | Rol |
| --- | --- |
| `ds` | CLI + web-generator (python3 stdlib, geen deps) |
| `tokens.css` | tokens + primitives (btn, gbtn, badge, switch, seg, input, select, setting) |
| `styles.json` | skins (devin, strak, ...) -- schakel via `data-style` |
| `components/` | 12 families, elk catalog.json + self/ + external/; plus icons.svg + lib.js |
| `components/icons.svg` | Lucide-sprite (`<use href="...#i-*">`) |
| `components/lib.js` | `?theme=` deep-link + gallery-postMessage op standalone varianten |
| `prototype-v2.html` | volledige referentie-app (3-pane sessie) |
| `references/` | meetlat-screenshots (Devin-product, eigen states) |
| `surfaces/` | per-surface briefs |
| `motion-spec.md` | motion-fysica (gelockt) |
| `brain/` | Obsidian Second Brain (niet-bindende context) |
| `brain-site/` | gegenereerde leeslaag uit `brain/` (`ds brain build`) |
| `.agents/` | canonieke agent-skills + subagents + hooks (`.cursor/` is overlay) |
| `new-project.sh` | scaffold nieuw product vanuit dit systeem |

## Build, check, serve (elke agent/CI)

Geen package manager of third-party deps nodig voor de kern: `ds` is pure
Python 3.12 stdlib. Een runtime-check is `python3 --version`. Er is geen
setup-script en geen environment-config nodig.
Remote: `https://github.com/GroepOnline/design-system.git` (org: GroepOnline).
CI: `.github/workflows/validate.yml` (build + check + brain gate) en
`.github/workflows/brain-eval.yml` (nightly scorecard + issue bij gate-fail).

- **Validate:** `./ds check` is de source of truth voor de check-stap.
  Warnings (non-URL sources, em-dashes) zijn verwacht en falen niet; alleen
  `errors` tellen.
- **Idempotentie:** gegenereerde output is committed. CI draait
  `python3 ds build --check`: volledige build + hard fail bij een vuile tree
  (`git status --porcelain` non-empty). Na elke `ds`-mutatie lokaal
  `./ds build --check` draaien en "idempotent (geen drift)" zien.
- **Serve:** altijd vanaf de repo-root, via `./ds serve` (default 8085) of
  fallback `python3 -m http.server` vanaf dezelfde root. Nooit `file://`:
  gegenereerde pagina's gebruiken root-absolute paden (`/tokens.css`,
  `/components/icons.svg#…`, `/components/lib.js`). Open daarna
  `http://localhost:<port>/components/`.
- **Thema/style-state** zit in het gegenereerde shell-script (`SHELL_FOOT` in
  `ds`), niet in `components/lib.js`: de toggles schrijven `ds-theme` /
  `ds-style` naar localStorage en de URL-param (`?theme=dark`,
  `?style=strak`) wint bij laden. Wijzig dit alleen in de generator, nooit in
  gegenereerde HTML. `lib.js` handelt alleen `?theme=` plus de gallery
  postMessage af; geen style, geen persistentie.
- **Fonts** komen van externe CDNs (Fontshare/Google); offline werkt de layout
  met fallback-fonts.

## Remotes (push-lanes)

| Remote | URL | Rol |
| --- | --- | --- |
| `origin-ssh` | `git@github.com-groeponline:GroepOnline/design-system.git` | **Default push-lane voor agents.** SSH als chefadmin-netizen via `~/.ssh/config-groeponline`. Volledige scope, inclusief `.github/workflows`. |
| `origin` | `https://github.com/GroepOnline/design-system.git` | Fetch + simpele pushes. Het HTTPS-token heeft **geen workflow-scope**: een push die workflow-bestanden bevat wordt geweigerd. |
| `ocg-mirror` | `chef-runner-01:/srv/chef/mirrors/...` | Archief-mirror (OnlineChefGroep). Nooit rechtstreeks naar pushen. |

Regel: raakt je commit `.github/workflows/` → push met `git push origin-ssh <branch>`.
Kom je dat pas achter bij een geweigerde push → zelfde branch opnieuw pushen naar
`origin-ssh`, geen force-push nodig.
