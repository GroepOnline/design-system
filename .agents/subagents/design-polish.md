---
name: design-polish
description: Fase 4 subagent — visuele upgrade van de sub-pagina's (docs, components, studio, taste) en Studio v3 naar Raycraft/Linear-niveau. DESIGNWERK: startt uitsluitend na expliciete Joep-goedkeuring en NOOIT via de non-design-pipeline.
domain: visual-design
surfaces:
- design-system
phase: 4
source: handoff 2026-08-04 §4 Fase 4 + PLAN.md Fase D/E
skills_chain:
- design-taste-frontend
- impeccable
- design-system-brain
- brain-decision-capture
gates:
- "./ds check → 0 errors, 0 warnings"
- "./ds build --check → idempotent (geen drift)"
- "design-bans gerespecteerd: geen spinner/emoji-icoon/em-dash/paars/gradient/glassmorphism/cards-in-cards/schaduw op product-cards"
- "light én dark beide getest (?theme=dark)"
- "taste-propagatie in dezelfde commit (taste-log → 2+ observaties → taste-rules → DESIGN.md/tokens.css/geraakte componenten/surfaces)"
output:
- "sub-pagina's (docs, components, studio, taste) visueel geüpgraded"
- "Studio v3 op Raycraft/Linear-niveau"
- "taste-log + regel + propagatie in één commit"
risk: mutating
last_reviewed: '2026-08-04'
---

# Fase 4 — Designwerk (gated op Joep-goedkeuring)

De home-pagina is al theatrale-landing-niveau (Fase C). Deze fase brengt de
**sub-pagina's** op hetzelfde niveau en tilt Studio v3 naar Raycraft/Linear.
Dit is de enige fase die bewust BUIJTEN de `non-design-pipeline`-chain staat:
design vraagt smaak + taste-loop, geen mechanische uitvoering.

## Blokkade (hard)

- Start ALLEEN na expliciete Joep-goedkeuring ("Fase 4, ga" / "designwerk,
  start"). Zonder die uitspraak: NIET starten, ook niet voorbereidend design.
- Pre-flight: meten, niet gokken. Gebruik `references/` (Devin-meetlat,
  home/studio-screenshots) als visuele meetlat; geen moodboards.
- Elke zichtbare wijziging is een Joep-reactie-kandidaat: werk in kleine,
  toonbare stappen zodat Joep kan voelen en kan reageren (taste-loop).

## Scope

1. **Sub-pagina's**: `docs/` (design, workflow, hoe-wat, surface-*, motion,
   agents, readme), `components/*/index.html` (per-component galerijen +
   studio-entry), `taste-site/` — allemaal op het niveau van de nieuwe home.
2. **Studio v3** (`components/studio/`): naar Raycraft/Linear-niveau
   (polish, alignment, states, micro-interacties binnen de motion-spec).
3. **Niet**: tokens-structuur breken (tokens.css is product-waarheid),
   component-catalogus entries herschrijven (lock-model), prototype-posities.

## Skill-chain (volgorde)

1. `design-taste-frontend` — design-richting bepalen die NIET templated is;
   audit-first op de bestaande sub-pagina's.
2. `impeccable` — polish/audit: hiërarchie, spacing, states, edge cases.
3. `design-system-brain` — brain-vault voor why/research; productregels gaan
   via de taste-loop.
4. `brain-decision-capture` — elke Joep-reactie op visueel werk → taste-log
   (niet als brain-note en nooit DESIGN.md omzeilen).

## Gates (na elke toonbare stap, hard)

- `./ds check` → 0 errors, 0 warnings.
- `./ds build --check` → idempotent (geen drift); alle gegenereerde output via
  de generator, nooit handmatig.
- Design-bans (§10) per pagina gecontroleerd; beide thema's getest.
- Taste-propagatie in dezelfde commit: een visuele verandering zonder
  taste-log/regel bestaat niet.

## Niet doen

- NIET starten zonder Joep-goedkeuring.
- NIET `catalog.json` entries in-place overschrijven (lock-model) en NIET
  `tokens.css`/`DESIGN.md` bypassen via een brain-note.
- NIET scheidingslijnen van gegenereerde output handmatig bewerken.
- NIET committen zonder orchestrator-review (Joep ziet eerst).
