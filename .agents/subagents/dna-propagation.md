---
name: dna-propagation
description: Fase 2 subagent — Devin-DNA meting propageren: .commandcode/devin-home.json → references/devin-app-dna.md (datum + nav/composer/main deltas), PLAN.md Fase B resterende schermen labelen als geblokkeerd op ingelogde Devin-sessie.
domain: measurement
surfaces:
- design-system
phase: 2
source: handoff 2026-08-04 §3.3 + §4 Fase 2
skills_chain:
- design-system-brain
- brain-note-hygiene
gates:
- "references/devin-app-dna.md vermeldt 2026-08-04 meting + nieuwe deltas uit devin-home.json"
- "PLAN.md Fase B noemt Review/DeepWiki/Usage&Limits als 'vereist ingelogde Devin-sessie (OAuth) — geblokkeerd op Joep'"
- "./ds check → 0 errors, 0 warnings (PLAN.md/references zijn geen generated output)"
output:
- "references/devin-app-dna.md bijgewerkt"
- "PLAN.md Fase B geblokkeerde items gelabeld"
risk: mutating
last_reviewed: '2026-08-04'
---

# Fase 2 — Devin-DNA meting afronden (rest Task 2)

Propageert de op 2026-08-04 verzamelde live-meting
(`.commandcode/devin-home.json`, app.devin.ai, dark, 1607×976) naar de
meetlat-archieflaag en markeert wat mens-werk blijft.

## Context

De 2026-07-28-meetdatum in `references/devin-app-dna.md` is verouderd; er is
nieuwe meetdata (nav/composer/main + btn-metingen) verzameld maar niet
gearchiveerd. PLAN.md Fase B (Review/DeepWiki/Usage & Limits) vereist een
ingelogde live Devin-sessie (OAuth) — kan niet autonoom.

## Taken (mechanisch, in deze volgorde)

1. Lees `references/devin-app-dna.md` en `.commandcode/devin-home.json`.
2. Werk `references/devin-app-dna.md` bij:
   - datum/titel in kopregel (dark mode, 2026-08-04, viewport 1607×976)
   - nieuwe meetdeltas: nav (280px breed), composer/input (geen vaste
     textarea, contenteditable), btn h35/r6, main 1306px — in dezelfde
     tabelvorm als de bestaande deltas
   - screenshots verwijzen naar `devin-home.png` (hernieuwd)
3. PLAN.md Fase B: label de resterende schermen (Review/DeepWiki/Usage&Limits)
   als "vereist ingelogde live Devin-sessie (OAuth) — geblokkeerd op Joep".
4. `./ds check` → bevestig 0 errors.

## Skill-chain (volgorde)

1. `design-system-brain` — vault-grenzen bewaken: references/ is meetlat-laag,
   geen brain-note nodig tenzij er een besluit is.
2. `brain-note-hygiene` — alleen als dit raakt aan `brain/**/*.md`; anders niet
   laden.

## Gates

- `references/devin-app-dna.md` bevat "2026-08-04" en de nieuwe
  nav/composer/main-deltas uit devin-home.json.
- `PLAN.md` Fase B vermeldt expliciet de OAuth-blokkade voor de resterende
  schermen.
- `./ds check` → 0 errors, 0 warnings.

## Niet doen

- NIET verzinnen van metingen die niet in `devin-home.json` staan.
- NIET `taste/`, `DESIGN.md`, `tokens.css` of `catalog.json` wijzigen (geen
  design/taste-propagatie zonder Joep-reactie).
- NIET de niet-gelabelde schermen proberen te meten (OAuth-blokkade is echt).
- NIET committen zonder orchestrator-review.
