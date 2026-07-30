# Changelog

> Alle noemenswaardige wijzigingen aan dit design system.
> Zie `git log` voor het volledige commit-historie.

## [Unreleased]

### Added
- `docs/pi-sessions-design-system.md` — overzicht Pi-agent sessies over
  design system
- `CHANGELOG.md` — dit bestand

## [v2] — 2026-07-28

### Added
- **Grouped-card patroon** voor settings (`components/settings/self/`):
  sectie = header (14px/500) + één card (r10, border, `0 16px`) met
  hairlines tussen rows. Beide thema's, beide skins.
- `tokens.css` — sgroup.primitive tokens voor grouped-card
- `PLAN.md` — visie + routekaart voor het lerende, gelockte, gemeten
  UI-systeem
- Devin settings DNA live gemeten (dark+light), 3 screenshots in `references/`
- `ds style add` CLI — behoudt default-entry, nette indent, duplicate/naam-guards, `--desc`
- CI workflow `validate.yml` (build + check)
- `ds check` CLI — validatie (catalogus, sprite ids, geen em-dashes)
- `WORKFLOW.md` — pipeline-documentatie

### Changed
- Stijl-laag (strak-skin) + verhoudingen + interacties + studio v3
- `hoe-wat.md` — em-dash purge (24x) conform copy-regels
- Typografie-schaal + categorieën + CLI-logs (v2.1)
- Rail v2: echte component-blokken + auto-height iframes
- AGENTS.md — Cursor Cloud specifieke instructies

### Fixed
- setTheme TDZ bug in gegenereerde shell — `curTheme`/`curStyle` initialisatie
  boven de restore-calls
- `ds style add` — behoudt default-entry, betere indent, guards tegen
  duplicate-namen en lege/ongeldige paden

## [v2-init] — 2026-07-27

### Added
- **Catalogus-systeem**: per-component mappen, self/external split, lock-model,
  `ds` CLI (list/select/add/remove)
- Alle 10 componenten: btn, gbtn, badge, switch, seg, input, select, card,
  composer, user-pill
- Settings-surface (compleet)
- Dark theme first-class (`data-theme="dark"`)
- Studio v2: visuele editor voor non-designers (Stitch-achtig)
- Desktop-first shell + docs-engine + taste-site
- `new-project.sh` — scaffolder voor nieuwe producten
- `AGENTS.md` — instructies voor AI-agents
- `references/` — meetlat-screenshots (settings-dark, gallery-dark)
- Scrollbar-fix voor de catalogus-web

### Changed
- v2: standalone design-system — **Devin-richting** (gemeten DNA van devin.ai
  computed styles)
- shadcn-conventies: btn, gbtn, badge component-contracten
- Lucide-iconen (29 symbols), geen emoji
- Ripple-activiteit i.p.v. spinners
- tokens.css v2: light+dark, skin-systeem, Devin exacte waarden

### Removed
- v1 "Stroom" (teal, eigen signatuurlijn) — vervangen door Devin-richting

## [v1 — Stroom] — voor 2026-07-17

### Added
- Initiële design language "Stroom" (teal accent)
- Eerste prototype (`prototype-v1-stroom.html`, `stroom-prototype.html`)
- Basis tokens.css